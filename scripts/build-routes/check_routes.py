"""Independent sanity pass over the generated routes."""
import json, math
from geo import haversine, dtm_point

routes = json.load(open("routes.json"))
tours = json.load(open("tourmeta.json"))
summits = json.load(open("summits.json"))

print(f"{'slug':<18}{'pts':>4} {'endpoints':>9} {'monotone':>9} {'steep>40':>9}  notes")
bad = []
for slug, r in routes.items():
    pts, zs = r["points"], r["elevations"]
    s = summits[slug]
    # endpoints
    d_end = haversine(pts[-1][0], pts[-1][1], s["lat"], s["lng"])
    # spacing sanity: no huge jumps (would mean a straight line through terrain)
    gaps = [haversine(a[0],a[1],b[0],b[1]) for a,b in zip(pts,pts[1:])]
    maxgap = max(gaps)
    # steep segments
    steep = 0
    for (a,b),(za,zb) in zip(zip(pts,pts[1:]), zip(zs,zs[1:])):
        d = haversine(a[0],a[1],b[0],b[1])
        if d>1 and abs(math.degrees(math.atan2(zb-za,d)))>40: steep += 1
    # elevation consistency: does the stored elevation match the DTM?
    mid = len(pts)//2
    z_api,_ = dtm_point(*pts[mid])
    drift = abs(z_api - zs[mid]) if z_api is not None else -1
    notes = []
    if d_end > 30: notes.append(f"end {d_end:.0f} m off summit")
    if maxgap > 120: notes.append(f"gap {maxgap:.0f} m")
    if drift > 12: notes.append(f"stored ele off by {drift:.0f} m at midpoint")
    if zs[-1] < s["summit_dtm"] - 30: notes.append("ends below the summit")
    print(f"{slug:<18}{len(pts):>4} {d_end:>7.0f} m {'yes' if steep==0 else 'no':>9} {steep:>9}  {'; '.join(notes)}")
    if notes: bad.append((slug, notes))
print()
print("clean" if not bad else f"{len(bad)} routes need a look")
