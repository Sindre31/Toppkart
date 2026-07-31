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


def build(route_rec, summit):
    th = route_rec["trailhead"]
    corridor = [(th["lat"], th["lng"])]
    corridor += [(w["lat"], w["lng"]) for w in route_rec.get("waypoints") or []]
    corridor.append((summit["lat"], summit["lng"]))

    router = Router(corridor)
    pts = cells_to_latlng(router.dem, router.route(corridor))
    pts = resample(chaikin(simplify(pts, SIMPLIFY_EPS_M), 2), RESAMPLE_M)

    # Pin the ends to the real trailhead and the real summit; smoothing can walk
    # them a few metres and those two points are the ones users recognise.
    pts[0] = (th["lat"], th["lng"])
    pts[-1] = (summit["lat"], summit["lng"])

    zs = [router.elevation_at(*p) for p in pts]
    gain = sum(max(0.0, b - a) for a, b in zip(zs, zs[1:]))
    loss = sum(max(0.0, a - b) for a, b in zip(zs, zs[1:]))

    worst = 0.0
    for (a, b), (za, zb) in zip(zip(pts, pts[1:]), zip(zs, zs[1:])):
        d = haversine(a[0], a[1], b[0], b[1])
        if d > 1.0:
            worst = max(worst, abs(math.degrees(math.atan2(zb - za, d))))

    return {
        "id": route_rec["id"],
        "name": route_rec.get("name", ""),
        "trailheadName": th.get("name", ""),
        "points": [(round(a, 5), round(b, 5)) for a, b in pts],
        "elevations": [int(round(z)) for z in zs],
        "distanceM": int(round(path_length_m(pts))),
        "gainM": int(round(gain)),
        "lossM": int(round(loss)),
        "maxAngle": round(worst, 1),
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
        out.append(f"max step angle {rec['maxAngle']}°")
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

    out = {}
    bad = []
    for slug, summit in summits.items():
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
