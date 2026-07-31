"""Independent sanity pass over the generated routes.

Deliberately re-derives everything from routes.json and re-queries the elevation
API, rather than trusting what the generator reported.
"""

import json
import math
import sys

from geo import dtm_point, haversine

routes = json.load(open("routes.json"))
summits = json.load(open("summits.json"))

print(f"{'tour / route':<34}{'pts':>4} {'end':>6} {'>40°':>5}  notes")
bad = []
for slug, recs in routes.items():
    s = summits[slug]
    ids = [r["id"] for r in recs]
    if len(ids) != len(set(ids)):
        bad.append(f"{slug}: duplicate route ids {ids}")
    for r in recs:
        pts, zs = r["points"], r["elevations"]
        notes: list[str] = []
        d_end = haversine(pts[-1][0], pts[-1][1], s["lat"], s["lng"])
        maxgap = max(haversine(a[0], a[1], b[0], b[1]) for a, b in zip(pts, pts[1:]))
        steep = sum(
            1
            for (a, b), (za, zb) in zip(zip(pts, pts[1:]), zip(zs, zs[1:]))
            if haversine(a[0], a[1], b[0], b[1]) > 1
            and abs(math.degrees(math.atan2(zb - za, haversine(a[0], a[1], b[0], b[1])))) > 40
        )
        mid = len(pts) // 2
        # The elevation API drops connections under load; a flaky network should
        # not look like a data defect, so an unreachable probe is reported as
        # unchecked rather than crashing the pass.
        try:
            z_api, _ = dtm_point(*pts[mid])
        except Exception:  # noqa: BLE001
            z_api = None
            notes.append("midpoint elevation unverified (API unreachable)")
        if d_end > 30:
            notes.append(f"ends {d_end:.0f} m off the summit")
        if maxgap > 120:
            notes.append(f"{maxgap:.0f} m gap between points")
        if z_api is not None and abs(z_api - zs[mid]) > 12:
            notes.append(f"stored elevation off by {abs(z_api - zs[mid]):.0f} m at the midpoint")
        if zs[-1] < s["summit_dtm"] - 30:
            notes.append("ends below the summit")
        if len(pts) < 25:
            notes.append("too few points to be a detailed line")
        print(f"{slug + ' / ' + r['id']:<34}{len(pts):>4} {d_end:>5.0f}m {steep:>5}  {'; '.join(notes)}")
        if notes:
            bad.append(f"{slug}/{r['id']}: " + "; ".join(notes))

total = sum(len(v) for v in routes.values())
print(f"\n{len(routes)} tours, {total} routes — " + ("clean" if not bad else f"{len(bad)} need a look"))
for b in bad:
    print("  -", b)
sys.exit(1 if bad else 0)
