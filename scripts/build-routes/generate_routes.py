"""Turn researched corridors into detailed routes, and check every one.

Reads summits.json (step 1) and corridors.json (route research), routes each
corridor over the terrain model, then validates before anything reaches the app:
endpoints must land on the trailhead and the summit, the ascent must be
essentially monotonic, and no step may exceed a skinnable angle.

A tour has a list of routes. Only the first — the one the tour's published
figures describe — is checked against `verticalM`; an alternative route up the
same peak has its own vertical and is not expected to match.
"""

import json
import math
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor

from geo import Dem, dem_tile, dtm_point, haversine
from router import (
    Router,
    cells_to_latlng,
    chaikin,
    path_length_m,
    resample,
    simplify,
    steepest_gradient,
)

SIMPLIFY_EPS_M = 10.0
RESAMPLE_M = 45.0
MAX_OK_ANGLE = 42.0

SUMMIT_FINE_M = 400      # how much of the finish is re-read at 1 m
SUMMIT_TILE_M = 1000     # tile side, so the disc above fits with room to spare
SUMMIT_TILE_PX = 1000    # one pixel per metre


class _FineDem:
    """A 1 m DTM patch around a summit, answering by lat/lng."""

    def __init__(self, dem):
        self.dem = dem

    def at(self, lat, lng):
        row, col = self.dem.rc(lat, lng)
        if not (0 <= row < self.dem.height and 0 <= col < self.dem.width):
            return None
        z = float(self.dem.z[row, col])
        return None if math.isnan(z) else z


_fine_cache = {}


def summit_dem(lat, lng):
    key = (round(lat, 5), round(lng, 5))
    if key not in _fine_cache:
        half_lat = SUMMIT_TILE_M / 2 / 110540.0
        half_lng = SUMMIT_TILE_M / 2 / (111320.0 * math.cos(math.radians(lat)))
        _fine_cache[key] = _FineDem(
            Dem(
                dem_tile(
                    f"finish_{lat:.5f}_{lng:.5f}_{SUMMIT_TILE_M}",
                    lng - half_lng,
                    lat - half_lat,
                    lng + half_lng,
                    lat + half_lat,
                    SUMMIT_TILE_PX,
                    SUMMIT_TILE_PX,
                )
            )
        )
    return _fine_cache[key]


_class_cache: dict[tuple[float, float], str] = {}


def dtm_class(lat, lng):
    """Kartverket's terrain class at a point, cached.

    The nudge search revisits the same neighbourhood for every bearing, and this
    is a public service we are a guest on.

    A failed call is retried and never cached. Caching it would be worse than
    useless: an empty class reads as dry, so one timed-out request would pin a
    vertex in the water for the rest of the run — which is exactly what happened
    to the tarn below Gullfjellstoppen.
    """
    key = (round(lat, 6), round(lng, 6))
    if key in _class_cache:
        return _class_cache[key]
    for attempt in range(4):
        try:
            _class_cache[key] = dtm_point(lat, lng)[1] or ""
            return _class_cache[key]
        except Exception:  # noqa: BLE001
            time.sleep(1.5 * (attempt + 1))
    # Unknown ground next to water is treated as water: the point of this pass is
    # to keep the line off the lake, so the safe guess is the one that moves it.
    return "Innsjø"


# «Havflate», not «Hav»: that is the class Kartverket actually answers for the
# sea, and with the wrong name in this tuple the pass read the fjord as dry —
# Taraldsviktinden's east route shipped three vertices on the harbour at −2 m
# and Nonstinden's one on a tidal inlet at −5 m, under a corridor that never
# asked to avoid water and a check (`check_ground.py`) that only asks about
# lakes. The router already treats the sea as impassable, but at nine metres a
# cell a shoreline is a blur, and this pass is what makes it a line.
WATER_CLASSES = ("Innsjø", "InnsjøRegulert", "Elv", "Hav", "Havflate")
NUDGE_STEP_M = 5.0
NUDGE_MAX_M = 40.0
SCAN_M = 2.5       # how finely a leg is read between its ends
CLEARANCE_M = 4.0  # how far from the shoreline a vertex has to sit
NUDGE_PASSES = 8


def _step(lat, lng, brg, d):
    return (
        lat + (d * math.cos(math.radians(brg))) / 110540.0,
        lng
        + (d * math.sin(math.radians(brg)))
        / (111320.0 * math.cos(math.radians(lat))),
    )


def _wet(lat, lng):
    return dtm_class(lat, lng) in WATER_CLASSES


def _too_close(lat, lng):
    """Wet, or dry only by a metre.

    Written coordinates are rounded to five decimals, about a metre, and the
    class boundary is itself a raster edge. A vertex sitting exactly on the
    shoreline is therefore a coin toss — the tarn below Redningshytta read dry
    where the router put it and wet where the file records it. Asking for four
    metres of clearance makes the answer survive the rounding.
    """
    if _wet(lat, lng):
        return True
    return any(_wet(*_step(lat, lng, brg, CLEARANCE_M)) for brg in (0, 90, 180, 270))


def _dry_near(lat, lng, fallback=True):
    """The nearest point off the water, searched outwards. None if there is none.

    Clearance is what we ask for and dryness is what we settle for. Between two
    tarns the ground can be narrower than the four metres `_too_close` wants, and
    there insisting on clearance finds nothing at all and leaves the vertex in
    the lake — which is the worse of the two answers by a long way. A vertex that
    is merely close to the shore is not in that bind and passes `fallback=False`,
    so it moves only for a real improvement and the passes settle.
    """
    tests = [lambda p: not _too_close(*p)]
    if fallback:
        tests.append(lambda p: not _wet(*p))
    for accept in tests:
        d = NUDGE_STEP_M
        while d <= NUDGE_MAX_M:
            for brg in range(0, 360, 30):
                cand = _step(lat, lng, brg, d)
                if accept(cand):
                    return cand
            d += NUDGE_STEP_M
    return None


def _warm(points):
    """Ask for a batch of terrain classes at once; each one is an HTTP call."""
    with ThreadPoolExecutor(max_workers=6) as ex:
        list(ex.map(lambda p: dtm_class(*p), points))


def _nudge_vertices(pts):
    """Move any vertex on or against the water to clear ground."""
    _warm(
        [
            p
            for lat, lng in pts
            for p in [(lat, lng)]
            + [_step(lat, lng, brg, CLEARANCE_M) for brg in (0, 90, 180, 270)]
        ]
    )
    moved = 0
    out = list(pts)
    for i, (lat, lng) in enumerate(pts):
        # The ends are the trailhead and the summit, pinned on purpose.
        if i in (0, len(pts) - 1) or not _too_close(lat, lng):
            continue
        dry = _dry_near(lat, lng, fallback=_wet(lat, lng))
        if dry:
            out[i] = dry
            moved += 1
    return out, moved


def _lift_legs(pts):
    """Bend a leg out of the water even when both its ends are dry.

    Dry vertices are not a dry line: the legs are up to 45 m long and a straight
    one across the inside of a shoreline bend cuts the corner over the water.
    So read each leg every few metres and insert a dry vertex wherever it is wet.
    A coarser read left a 6 m clip that only a 5 m audit could see.
    """
    legs = []
    for a, b in zip(pts, pts[1:]):
        # At least two intervals, so that the short legs this pass itself creates
        # get read in the middle rather than only at their dry ends.
        n = max(2, round(haversine(*a, *b) / SCAN_M))
        legs.append(
            [
                (a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n)
                for i in range(1, n)
            ]
        )
    _warm([p for leg in legs for p in leg])

    # One vertex per wet *run*, not per wet sample. The first version of this
    # appended a nudged vertex for every wet 2.5 m sample, so a 45 m leg over
    # a 20 m river arm grew eight new vertices, each pushed to the nearest dry
    # ground in whichever of twelve bearings answered first — a scribble. Two
    # tours out of Kongsvikdalen shipped with a tenth of their length in such
    # loops beside the braided Kongsvikelva (924 m of 8468, 964 m of 9116),
    # every vertex on ground the DTM agreed with, the line going in circles.
    # A wet run is one crossing and wants one dry point, taken from its middle.
    out = [pts[0]]
    added = 0
    for leg, end in zip(legs, pts[1:]):
        run = []
        for p in leg + [None]:
            if p is not None and _wet(*p):
                run.append(p)
                continue
            if run:
                dry = _dry_near(*run[len(run) // 2])
                if dry:
                    out.append(dry)
                    added += 1
                run = []
        out.append(end)
    return out, added


def _off_water(pts):
    """Take the line off the water for real, vertices and legs alike.

    The water cost in `router.py` gets the line *near* the shore; this is what
    makes it *on* the shore. Both are needed, and neither replaces the other:
    without the cost the line takes the lake outright, and without this it
    still skims the edge, because the routing grid is about nine metres per
    cell and a road along a shoreline is narrower than that.

    Every vertex this moved on Gullfjellstoppen had clear ground within five to
    ten metres — a smaller correction than the 45 m the line is resampled at,
    and the same kind of after-the-fact fix `build()` already makes when it
    re-pins the trailhead and the summit that smoothing walked off their marks.

    Kartverket's terrain class is the authority here, not the flatness mask the
    router uses. The mask exists so Dijkstra can price water without a network
    round trip per cell; this runs once per line, so it can afford to ask.

    Nudging a vertex moves the legs on either side of it, which can put a leg in
    the water that was not, so the two passes repeat until neither has anything
    left to do.
    """
    moved = added = 0
    for _ in range(NUDGE_PASSES):
        pts, m = _nudge_vertices(pts)
        pts, a = _lift_legs(pts)
        moved += m
        added += a
        if not m and not a:
            break
    return pts, moved, added, _wet_metres(pts)


def _wet_metres(pts):
    """How much of the finished line still stands on water.

    The passes above are a fix; this is the measurement, and it is the number
    worth printing. Sampling at half the scan step means it reads the line more
    finely than the pass that corrected it, so it cannot agree by construction.
    It reads the rounded coordinates, because those are the ones that ship.
    """
    pts = [(round(a, 5), round(b, 5)) for a, b in pts]
    samples, weights = [], []
    for a, b in zip(pts, pts[1:]):
        d = haversine(*a, *b)
        n = max(2, round(d / (SCAN_M / 2)))
        for i in range(n):
            t = i / n
            samples.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
            weights.append(d / n)
    _warm(samples)
    return sum(w for p, w in zip(samples, weights) if _wet(*p))


def build(route_rec, summit):
    th = route_rec["trailhead"]
    corridor = [(th["lat"], th["lng"])]
    corridor += [(w["lat"], w["lng"]) for w in route_rec.get("waypoints") or []]
    corridor.append((summit["lat"], summit["lng"]))

    # `avoidWater` is a property of the corridor research, not of the router:
    # it says «the ice on this tour cannot be assumed», which is a fact about the
    # mountain and the season that only the research knows. Off by default, so
    # every existing line is unaffected.
    router = Router(corridor, avoid_water=bool(route_rec.get("avoidWater")))
    pts = cells_to_latlng(router.dem, router.route(corridor))
    # Smooth first, thin second. The other order thinned the grid staircase down
    # to ~40 m legs and then asked Chaikin to round corners that were now the
    # switchbacks themselves; simplifying after the smoothing keeps the shape and
    # keeps the point count down, because Douglas-Peucker only drops a vertex the
    # line does not need.
    pts = resample(simplify(chaikin(pts, 2), SIMPLIFY_EPS_M), RESAMPLE_M)

    # Pin the ends to the real trailhead and the real summit; smoothing can walk
    # them a few metres and those two points are the ones users recognise.
    pts[0] = (th["lat"], th["lng"])
    pts[-1] = (summit["lat"], summit["lng"])

    # A corridor that says the ice cannot be assumed gets its line taken off the
    # water for real, not merely priced away from it.
    if route_rec.get("avoidWater"):
        pts, moved, added, wet_m = _off_water(pts)
        print(
            f"    off water: {moved} vertices moved, {added} inserted"
            f" — {wet_m:.0f} m still on water"
        )

    zs = [router.elevation_at(*p) for p in pts]

    # …then re-read the summit approach at full resolution. The routing grid is
    # DTM1 downsampled to a few metres per cell — fine for finding a way up,
    # wrong on a summit, which is by definition the one place the terrain is a
    # point rather than a slope. Jakta's summit cell came out 49 m low, so the
    # line finished by dropping off the top: it understated the vertical and
    # then reported the drop as a 52° step. Reading the last stretch off a 1 m
    # tile is what makes the finish a measurement rather than a rounding error,
    # and it must be a profile and not just the final height — pinning the true
    # summit onto a grid that never climbed to it only moves the same cliff one
    # point back down the line.
    fine = summit_dem(summit["lat"], summit["lng"])
    for i, p in enumerate(pts):
        if haversine(p[0], p[1], summit["lat"], summit["lng"]) <= SUMMIT_FINE_M:
            z = fine.at(*p)
            if z is not None:
                zs[i] = z
    if summit.get("summit_dtm") is not None:
        zs[-1] = float(summit["summit_dtm"])
    if th.get("elevation_m") is not None:
        zs[0] = float(th["elevation_m"])

    gain = sum(max(0.0, b - a) for a, b in zip(zs, zs[1:]))
    loss = sum(max(0.0, a - b) for a, b in zip(zs, zs[1:]))

    return {
        "id": route_rec["id"],
        "name": route_rec.get("name", ""),
        "trailheadName": th.get("name", ""),
        "points": [(round(a, 5), round(b, 5)) for a, b in pts],
        "elevations": [int(round(z)) for z in zs],
        "distanceM": int(round(path_length_m(pts))),
        "gainM": int(round(gain)),
        "lossM": int(round(loss)),
        "maxAngle": round(steepest_gradient(pts, zs), 1),
        "gridResM": round(router.res_m, 1),
        "minZ": round(min(zs), 1),
    }


def problems_with(rec, is_primary, claimed):
    """`claimed` is None for a tour the app does not carry a vertical for yet.

    The other four checks are properties of the line itself and always apply; the
    gain check compares it against a *published* figure, and a peak being added
    from scratch has none — its vertical is going to be read off this route. See
    the README on why inferring one from the other in either direction is how the
    Rørnestinden trailhead ended up in the fjord.
    """
    out = []
    if rec["lossM"] > max(60.0, 0.12 * rec["gainM"]):
        out.append(f"gives back {rec['lossM']} m of {rec['gainM']} m gained")
    if rec["maxAngle"] > MAX_OK_ANGLE:
        out.append(f"steepest 30 m {rec['maxAngle']}°")
    if rec["minZ"] < 0.4:
        out.append("a point sits at or below sea level")
    if is_primary and claimed is not None and abs(rec["gainM"] - claimed) > max(150.0, 0.25 * claimed):
        out.append(f"gain {rec['gainM']} m vs app's {claimed} m")
    if len(rec["points"]) < 25:
        out.append(f"only {len(rec['points'])} points — not a detailed line")
    return out


def main():
    summits = json.load(open("summits.json"))
    corridors = json.load(open("corridors.json"))
    tours = json.load(open("tourmeta.json"))

    # `generate_routes.py [slug …]` routes only those tours and merges them into
    # the existing routes.json. Routing is ten minutes of Dijkstra over DTM1 for
    # the whole set, so re-solving 56 unchanged lines to add one is the
    # difference between iterating on a corridor and waiting on one.
    only = set(sys.argv[1:])
    out = json.load(open("routes.json")) if only and os.path.exists("routes.json") else {}
    bad = []
    for slug, summit in summits.items():
        if only and slug not in only:
            continue
        if slug not in corridors:
            bad.append(f"{slug}: no corridor")
            continue
        built = []
        for i, route_rec in enumerate(corridors[slug]["routes"]):
            try:
                rec = build(route_rec, summit)
            except Exception as e:  # noqa: BLE001
                bad.append(f"{slug}/{route_rec['id']}: router failed — {e}")
                continue
            probs = problems_with(rec, i == 0, (tours.get(slug) or {}).get("verticalM"))
            rec["problems"] = probs
            built.append(rec)
            tag = "primary" if i == 0 else "alt    "
            flag = "  <-- " + "; ".join(probs) if probs else ""
            print(
                f"{slug:<18}{tag} {rec['id']:<14}{len(rec['points']):>4} pts "
                f"{rec['distanceM']/1000:5.2f} km  +{rec['gainM']:>4} m  -{rec['lossM']:>3} m  "
                f"max {rec['maxAngle']:>4.1f}°  {rec['trailheadName'][:34]}{flag}"
            )
            if probs:
                bad.append(f"{slug}/{rec['id']}: " + "; ".join(probs))
        if built:
            out[slug] = built

    with open("routes.json", "w") as f:
        json.dump(out, f, ensure_ascii=False)
    total = sum(len(v) for v in out.values())
    print(f"\nwrote routes.json ({len(out)} tours, {total} routes)")
    if bad:
        print("\nneeds a look:")
        for b in bad:
            print("  -", b)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
