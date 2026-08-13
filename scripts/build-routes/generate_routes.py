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

from geo import Dem, dem_tile, haversine
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
