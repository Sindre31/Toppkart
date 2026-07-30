"""Turn researched corridors into detailed routes, and check every one.

Reads summits.json (step 1) and corridors.json (route research), routes each tour
over the terrain model, then validates the result before it is allowed anywhere
near the app: endpoints must land on the trailhead and the summit, the ascent must
be essentially monotonic, and no step may exceed a skinnable angle.
"""

import json
import math
import sys

from geo import haversine
from router import (
    Router,
    cells_to_latlng,
    chaikin,
    path_length_m,
    resample,
    simplify,
)

SIMPLIFY_EPS_M = 10.0
RESAMPLE_M = 45.0
MAX_OK_ANGLE = 42.0


def build(slug, corridor_rec, summit, tour_meta):
    th = corridor_rec["trailhead"]
    wps = corridor_rec.get("waypoints") or []
    corridor = [(th["lat"], th["lng"])]
    corridor += [(w["lat"], w["lng"]) for w in wps]
    corridor.append((summit["lat"], summit["lng"]))

    router = Router(corridor)
    cells = router.route(corridor)
    pts = cells_to_latlng(router.dem, cells)
    pts = resample(chaikin(simplify(pts, SIMPLIFY_EPS_M), 2), RESAMPLE_M)

    # Pin the ends to the real trailhead and the real summit; smoothing can walk
    # them a few metres and those two points are the ones users recognise.
    pts[0] = (th["lat"], th["lng"])
    pts[-1] = (summit["lat"], summit["lng"])

    zs = [router.elevation_at(*p) for p in pts]
    gain = sum(max(0.0, b - a) for a, b in zip(zs, zs[1:]))
    loss = sum(max(0.0, a - b) for a, b in zip(zs, zs[1:]))
    dist = path_length_m(pts)

    worst = 0.0
    for (a, b), (za, zb) in zip(zip(pts, pts[1:]), zip(zs, zs[1:])):
        d = haversine(a[0], a[1], b[0], b[1])
        if d > 1.0:
            worst = max(worst, abs(math.degrees(math.atan2(zb - za, d))))

    problems = []
    if loss > max(60.0, 0.12 * gain):
        problems.append(f"gives back {loss:.0f} m of {gain:.0f} m gained")
    if worst > MAX_OK_ANGLE:
        problems.append(f"max step angle {worst:.0f}°")
    if min(zs) < 0.4:
        problems.append("a point sits at or below sea level")
    claimed = tour_meta["verticalM"]
    if abs(gain - claimed) > max(150.0, 0.25 * claimed):
        problems.append(f"gain {gain:.0f} m vs app's {claimed} m")
    if len(pts) < 25:
        problems.append(f"only {len(pts)} points — not a detailed line")

    return {
        "slug": slug,
        "routeName": corridor_rec.get("route_name", ""),
        "trailheadName": th.get("name", ""),
        "points": [(round(a, 5), round(b, 5)) for a, b in pts],
        "elevations": [int(round(z)) for z in zs],
        "distanceM": int(round(dist)),
        "gainM": int(round(gain)),
        "lossM": int(round(loss)),
        "maxAngle": round(worst, 1),
        "gridResM": round(router.res_m, 1),
        "problems": problems,
    }


def main():
    summits = json.load(open("summits.json"))
    corridors = json.load(open("corridors.json"))
    meta = {t[0]: t for t in __import__("peaks").PEAKS}
    tours = json.load(open("tourmeta.json"))

    out = {}
    bad = []
    for slug, summit in summits.items():
        if slug not in corridors:
            bad.append(f"{slug}: no corridor")
            continue
        try:
            rec = build(slug, corridors[slug], summit, tours[slug])
        except Exception as e:  # noqa: BLE001
            bad.append(f"{slug}: router failed — {e}")
            continue
        out[slug] = rec
        flag = "  <-- " + "; ".join(rec["problems"]) if rec["problems"] else ""
        print(
            f"{slug:<18} {len(rec['points']):>4} pts  {rec['distanceM']/1000:5.2f} km  "
            f"+{rec['gainM']:>4} m  -{rec['lossM']:>3} m  max {rec['maxAngle']:>4.1f}°  "
            f"{rec['gridResM']:>4.1f} m/px  {rec['trailheadName']}{flag}"
        )
        if rec["problems"]:
            bad.append(f"{slug}: " + "; ".join(rec["problems"]))

    with open("routes.json", "w") as f:
        json.dump(out, f, ensure_ascii=False)
    print(f"\nwrote routes.json ({len(out)} routes)")
    if bad:
        print("\nneeds a look:")
        for b in bad:
            print("  -", b)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
