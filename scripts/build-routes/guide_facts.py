"""Per-tour facts for the written guides, derived from the routes themselves.

A guide should not invent where a route is steep, where it leaves the forest, or
how far it is. All of that is already in the geometry and in Kartverket's terrain
classes, so it is computed here and handed to whoever writes the prose. What is
left for editorial judgement is the judgement — not the numbers.

Also emits the elevation-profile SVG path the guide page draws, over the same
`0 0 600 220` viewBox the prototype used.
"""

import json
import math
import os
from concurrent.futures import ThreadPoolExecutor

from geo import dtm_point, haversine
from router import steepest_span

# In flight against Kartverket's point API. The same number `resample_dtm1.py`
# uses against the same endpoint: it answers in about 1.3 s, so the job is
# latency rather than work, and sixteen reads roughly nine a second.
CLASS_WORKERS = 16

# Distinct from `None`, which is a real answer meaning «Kartverket has no class
# for this point». A failed lookup must never enter the cache as either.
_MISSING = object()

PROFILE_W = 600.0
PROFILE_TOP = 18.0     # y of the summit
PROFILE_BASE = 200.0   # y of the trailhead
TERRAIN_SAMPLES = 14

# How far past the last forest vertex the treeline scan keeps looking before it
# accepts that the forest has ended. Both have to be satisfied: a birch belt
# interleaved with bog can go quiet for several hundred metres of ground and
# then come back, and it can do that without gaining height.
TREELINE_QUIET_M = 600.0    # ground since the last Skog vertex
TREELINE_QUIET_UP = 150.0   # height above the highest Skog vertex
# And a ceiling, because the quiet rule alone never fires on a route that starts
# above the forest: with no Skog vertex to count from, the scan walks all 300
# vertices of every alpine tour for an answer it already has. No forest grows
# this high anywhere in Norway — the highest treeline in the country is in the
# inland south and stops well below it, and the highest in this corpus is
# Sæbyggjenuten's at 1028 m.
TREELINE_CEILING_M = 1300.0

_CLASS_CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache", "terrain_class.json")

# Sentinel: the scan could not complete, so the tour keeps the treeline it has.
KEEP_PREVIOUS = object()


def cumdist(points):
    out = [0.0]
    for a, b in zip(points, points[1:]):
        out.append(out[-1] + haversine(a[0], a[1], b[0], b[1]))
    return out


def svg_path(points, elevations):
    """Elevation profile as an SVG polyline over the guide page's viewBox."""
    d = cumdist(points)
    total = d[-1] or 1.0
    lo, hi = min(elevations), max(elevations)
    span = (hi - lo) or 1.0
    # Thin to ~26 vertices: the profile is decoration at 600 px wide, and a
    # 200-point path would bloat every guide payload for no visible gain.
    step = max(1, len(points) // 26)
    idx = list(range(0, len(points), step))
    if idx[-1] != len(points) - 1:
        idx.append(len(points) - 1)
    pts = []
    for i in idx:
        x = d[i] / total * PROFILE_W
        y = PROFILE_BASE - (elevations[i] - lo) / span * (PROFILE_BASE - PROFILE_TOP)
        pts.append(f"{x:.0f},{y:.0f}")
    return "M" + " L".join(pts)


def bands(points, elevations, band=100):
    """Mean gradient per 100 m of height, trailhead band first.

    The single steepest band answers "how steep does it get"; the table answers
    "where is the climbing", which is the question a route description is
    actually written around — a flat six-kilometre lake and a sustained
    twenty-degree ridge are both invisible in a maximum.
    """
    d = cumdist(points)
    lo = int(min(elevations) // band * band)
    hi = int(max(elevations))
    out = []
    for base in range(lo, hi + 1, band):
        run = 0.0
        rise = 0.0
        for i in range(len(points) - 1):
            if not (base <= elevations[i] < base + band):
                continue
            step = d[i + 1] - d[i]
            if step <= 0:
                continue
            run += step
            rise += elevations[i + 1] - elevations[i]
        if run <= 0:
            continue
        out.append(
            {
                "fromM": base,
                "toM": base + band,
                "angle": round(math.degrees(math.atan2(rise, run)), 1),
                "groundM": int(round(run)),
            }
        )
    return out


def steepest_band(table):
    """The steepest band with enough ground under it to be a slope, not a step."""
    real = [b for b in table if b["groundM"] >= 120]
    return max(real, key=lambda b: b["angle"]) if real else None


def terrain_along(points, elevations, n=TERRAIN_SAMPLES):
    """Kartverket terrain class at n points along the line.

    Fourteen points is enough to say what kind of ground a route crosses — bog,
    slab, glacier, water — which is what this table is for. It is *not* enough to
    say where the forest ends; see `treeline_scan`.
    """
    step = max(1, len(points) // (n - 1))
    idx = list(range(0, len(points), step))
    if idx[-1] != len(points) - 1:
        idx.append(len(points) - 1)
    out = []
    for i in idx:
        try:
            _, terr = dtm_point(*points[i])
        except Exception:  # noqa: BLE001
            terr = None
        out.append({"i": i, "z": elevations[i], "terreng": terr})
    return out


def _class_cache():
    try:
        return json.load(open(_CLASS_CACHE))
    except (OSError, ValueError):
        return {}


class LookupFailed(Exception):
    """Kartverket did not answer. Distinct from "it answered, and it is not forest"."""


def _class_at(cache, lat, lng):
    key = f"{lat:.5f},{lng:.5f}"
    if key not in cache:
        try:
            _, terr = dtm_point(lat, lng)
        except Exception as exc:  # noqa: BLE001
            # Never cache a failure as an answer about the ground, and never let
            # it read as one either. A silent None here would have made an hour
            # of Kartverket downtime say "no forest on this mountain" for every
            # tour processed during it — the same shape as check_ground.py's
            # cached-failure bug, which turned a five-minute outage into a
            # permanent claim. Raise instead, and let the scan abstain.
            raise LookupFailed(f"{lat:.5f},{lng:.5f}") from exc
        cache[key] = terr
    return cache[key]


def prefetch_classes(cache, points, elevations):
    """Warm the class cache for every vertex the treeline scan could reach.

    The scan itself has to be sequential — it walks until the forest has been
    quiet for long enough, and it cannot know where that is without the answers
    in order. But *which* vertices it might ask about is known up front: every
    one below `TREELINE_CEILING_M`. Fetching those concurrently first turns the
    scan into a walk over a warm dictionary.

    It matters because the point API answers in about 1.3 seconds and a forested
    Eastern Norway line has a few hundred vertices under the ceiling. Serially
    that is a tour every several minutes, and a round that moved 53 lines is an
    afternoon of waiting on one request at a time. Sixteen in flight is what
    `resample_dtm1.py` settled on against the same endpoint.

    Deliberately silent about failures: anything that does not come back is
    simply left out of the cache, and `_class_at` will ask again in the scan and
    raise `LookupFailed` there — which is where abstaining is already handled
    correctly. Nothing here decides anything about the ground.
    """
    wanted = {}
    for (lat, lng), z in zip(points, elevations):
        if z > TREELINE_CEILING_M:
            continue
        key = f"{lat:.5f},{lng:.5f}"
        if key not in cache:
            wanted[key] = (lat, lng)
    if not wanted:
        return cache

    def one(item):
        key, (lat, lng) = item
        try:
            _, terr = dtm_point(lat, lng)
            return key, terr
        except Exception:  # noqa: BLE001
            return key, _MISSING

    with ThreadPoolExecutor(CLASS_WORKERS) as ex:
        for key, terr in ex.map(one, list(wanted.items())):
            if terr is not _MISSING:
                cache[key] = terr
    return cache


def treeline_scan(points, elevations, cum):
    """Where the forest actually ends, from every vertex rather than from a sample.

    The old version read the treeline off the fourteen-point `terrain_along`
    table, and that is wrong in a way that always errs the same direction: the
    highest *sampled* forest point is at best a lower bound on the highest forest
    point, so every treeline it produced was too low. Møysalen is the case that
    exposed it — sampled 162 m, actually 234 m, because the birch along the
    valley floor is interleaved with bog and the sampler landed on bog three
    times running before climbing out of the belt entirely.

    Bisecting between adjacent samples would not have found it either: the two
    samples bracketing the true last forest vertex were *both* non-forest. So
    this walks vertices from the start and only stops once the line has been out
    of the forest for both `TREELINE_QUIET_M` of ground and `TREELINE_QUIET_UP`
    of height — enough that a belt coming back is no longer plausible.

    Costs a few hundred lookups on a first run for a low-starting tour and none
    on a re-run; the classes are cached to disk because ground cover does not
    change between invocations.
    """
    cache = _class_cache()
    # `before` is read ahead of the prefetch on purpose: the prefetched answers
    # are exactly the ones worth writing back, and taking the count afterwards
    # would make the save below think nothing had been learned.
    before = len(cache)
    prefetch_classes(cache, points, elevations)
    last_i = None
    first_open_m = None
    scanned = 0
    failed = False
    try:
        for i in range(len(points)):
            if elevations[i] > TREELINE_CEILING_M:
                continue      # too high for forest; skip the lookup, keep walking
            terr = _class_at(cache, *points[i])
            scanned = i
            if terr == "Skog":
                last_i = i
                first_open_m = None
            elif last_i is not None and first_open_m is None:
                first_open_m = elevations[i]
            if last_i is not None:
                quiet_ground = cum[i] - cum[last_i]
                quiet_up = elevations[i] - elevations[last_i]
                if quiet_ground >= TREELINE_QUIET_M and quiet_up >= TREELINE_QUIET_UP:
                    break
    except LookupFailed:
        failed = True
    if len(cache) != before:
        os.makedirs(os.path.dirname(_CLASS_CACHE), exist_ok=True)
        json.dump(cache, open(_CLASS_CACHE, "w"))
    if failed:
        # An incomplete scan cannot rule the forest out, and a treeline that is
        # only a lower bound is what this function exists to stop shipping. The
        # tour keeps whatever treeline it already had until a complete scan runs.
        return KEEP_PREVIOUS
    if last_i is None:
        return None
    return {
        "last_forest_m": elevations[last_i],
        "first_open_m": first_open_m,
        "last_forest_km": round(cum[last_i] / 1000.0, 2),
        "scanned_vertices": scanned + 1,
    }


def prev_treeline(previous, slug, route_id):
    """The treeline from the last complete run, for a scan that could not finish."""
    for r in ((previous.get(slug) or {}).get("routes") or []):
        if r.get("id") == route_id:
            return r.get("treeline")
    return None


def cached_samples(previous, slug, route_id, elevations):
    """The terrain classes from a previous run, when the line has not moved.

    Kartverket's terrain class at a point does not change between runs; the DTM
    lookups behind it are ~550 requests and several minutes. Reuse them when the
    profile is identical, and re-query the moment it is not.
    """
    for r in ((previous.get(slug) or {}).get("routes") or []):
        if r.get("id") != route_id:
            continue
        got = r.get("terrainSamples") or []
        # A re-routed line can be shorter than the one the samples were taken
        # from, so the stored indices are not safe to read blind — an out-of-range
        # index is itself the answer that the line has moved.
        if not got or any(s["i"] >= len(elevations) for s in got):
            return None
        if [s["z"] for s in got] == [elevations[s["i"]] for s in got]:
            return got
    return None


def main():
    routes = json.load(open("routes.json"))
    corridors = json.load(open("corridors.json"))
    tours = json.load(open("tourmeta.json"))
    summits = json.load(open("summits.json"))
    previous = json.load(open("guide_facts.json")) if os.path.exists("guide_facts.json") else {}

    out = {}
    for slug, recs in routes.items():
        by_id = {r["id"]: r for r in corridors[slug]["routes"]}
        entries = []
        for r in recs:
            pts = [tuple(p) for p in r["points"]]
            zs = r["elevations"]
            cum = cumdist(pts)
            tl = treeline_scan(pts, zs, cum)
            if tl is KEEP_PREVIOUS:
                tl = prev_treeline(previous, slug, r.get("id"))
                print(f"  ! {slug}/{r.get('id')}: treeline scan incomplete "
                      f"(Kartverket unavailable) — kept {tl}")
            table = bands(pts, zs)
            band = steepest_band(table)
            ang, i0, i1 = steepest_span(pts, zs)
            samples = []
            # The tour's own route, not the one called "normalruta". The two were
            # the same thing until a round gave its routes descriptive ids —
            # Høgevarde leaves from Tempelseter and Norefjellstua, and neither is
            # a "normalruta" — and the id test then silently dropped the terrain
            # classes for all seven of them. Treeline is one of the few facts a
            # guide for a forested Eastern Norway fjell is actually built on.
            if r is recs[0]:
                samples = cached_samples(previous, slug, r["id"], zs) or terrain_along(pts, zs)
            src = by_id.get(r["id"], {})
            entries.append(
                {
                    "id": r["id"],
                    "name": r["name"],
                    "trailhead": r["trailheadName"],
                    "trailheadFull": (src.get("trailhead") or {}).get("fullName", ""),
                    "startM": zs[0],
                    "summitM": zs[-1],
                    "gainM": r["gainM"],
                    "lossM": r["lossM"],
                    "distanceM": r["distanceM"],
                    "maxAngle": round(ang, 1),
                    # Where that steepest window actually is. A guide is allowed
                    # to name the two elevations, and naming them is better than
                    # an angle floating free of the mountain.
                    "steepestStep": {"fromM": zs[i0], "toM": zs[i1], "angle": round(ang, 1)},
                    "steepestBand": band,
                    "bands": table,
                    # Where the corridor research pinned the line: these are the
                    # elevations a route description names out loud.
                    "waypoints": [
                        {"name": w.get("name", ""), "m": round(w["elevation_m"], 1)}
                        for w in (src.get("waypoints") or [])
                        if w.get("elevation_m") is not None
                    ],
                    "svgPath": svg_path(pts, zs),
                    "terrainSamples": samples,
                    "treeline": tl,
                    # The research/audit notes: cornices, cliff bands, what the
                    # line must avoid. The single most valuable input to a guide.
                    "researchNotes": src.get("notes", "") or src.get("note", ""),
                    "description": src.get("description", ""),
                    "source": src.get("source", ""),
                }
            )
        meta = tours[slug]
        out[slug] = {
            "name": meta["name"],
            "region": meta["region"],
            "grade": meta["grade"],
            "aspect": meta["aspect"],
            "season": meta["season"],
            "duration": meta["duration"],
            "verticalM": meta["verticalM"],
            "summitClaimM": meta["summitM"],
            "summitDtmM": summits[slug]["summit_dtm"],
            "teaser": meta.get("teaser", ""),
            "routes": entries,
        }
        p = entries[0]
        tl = p["treeline"]
        print(
            f"{slug:<18}{p['startM']:>5}->{p['summitM']:<5} {p['distanceM']/1000:5.2f} km  "
            f"steepest {p['steepestBand']['fromM'] if p['steepestBand'] else '-'}-"
            f"{p['steepestBand']['toM'] if p['steepestBand'] else '-'} m "
            f"@{p['steepestBand']['angle'] if p['steepestBand'] else '-'}°  "
            f"treeline {tl['last_forest_m'] if tl else 'none'}"
        )

    with open("guide_facts.json", "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"\nwrote guide_facts.json ({len(out)} tours)")


if __name__ == "__main__":
    main()
