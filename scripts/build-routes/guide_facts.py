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

from geo import dtm_point, haversine
from router import steepest_span

PROFILE_W = 600.0
PROFILE_TOP = 18.0     # y of the summit
PROFILE_BASE = 200.0   # y of the trailhead
TERRAIN_SAMPLES = 14


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

    This is what gives a guide an honest treeline: the elevation at which the
    class stops being Skog. Guessing it would be exactly the sort of invented
    detail these guides must not contain.
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


def treeline(samples):
    """Highest sample still classed as forest, and the first one above it."""
    last_forest = None
    for s in samples:
        if s["terreng"] == "Skog":
            last_forest = s["z"]
    if last_forest is None:
        return None
    above = [s["z"] for s in samples if s["z"] > last_forest]
    return {"last_forest_m": last_forest, "first_open_m": min(above) if above else None}


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
            table = bands(pts, zs)
            band = steepest_band(table)
            ang, i0, i1 = steepest_span(pts, zs)
            samples = []
            if r["id"] == "normalruta":
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
                    "treeline": treeline(samples) if samples else None,
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
