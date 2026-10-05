"""Cut the out-and-backs a line makes to a corridor waypoint it would otherwise pass beside.

The shape round (`check_geometry.py`) cut seven of these: a line that walks out
to a waypoint 130–300 m off its natural course and comes back along its own
track. Its rule only saw spurs of 300 m or more, or loops that returned within
12 m. The review round drew every line on Kartverket's topographic map and
found ten more under that bar, on nine routes — and every tip sat on a corridor
waypoint, within 50 m of it. The spur is the solver honouring a point the
research placed slightly off the ground a skier crosses; the line runs out to
it, turns, and comes back to where it was going anyway.

The fix is the shape round's, at a scale its 12 m rule could not reach: the
line leaves the spur at one vertex and rejoins at another, and the stretch
between is replaced by a straight leg. Here the two vertices are up to 60 m
apart, so the leg is read from DTM1 every 15 m rather than drawn blind:

  - the pair is chosen within 30 vertices of the tip, to remove the most path
    for the shortest leg, with the leg no longer than CHORD_MAX_M;
  - the leg may not be steeper than LEG_MAX_DEG over its own length, and no
    sample on it may answer a water class — a cut that saves 300 m by putting
    the line on a tarn is not a fix;
  - each new vertex takes its DTM1 elevation, so gain, loss and the steepest
    30 m are re-derived from the ground, not interpolated.

Nothing else on the line moves. The waypoint is then moved onto the line in
`corridors.json` and the research record, with a `corridorNote` saying where it
came from, so a re-solve through the corridor draws the line that ships.

    python3 cut_spurs.py            # dry run: prints each cut
    python3 cut_spurs.py --apply    # rewrites routes.json and the corridors
"""

import json
import math
import sys

from geo import dtm_point, haversine
from router import path_length_m, steepest_gradient

WATER = ("Innsjø", "InnsjøRegulert", "Elv", "Hav", "Havflate")
WINDOW = 30           # vertices either side of the tip to look for the cut
CHORD_MAX_M = 60.0    # longest straight leg that may replace a spur
LEG_MAX_DEG = 35.0    # a leg steeper than this is not a skinning line
SAMPLE_M = 15.0       # DTM1 read spacing along a new leg

# (tour, route, the corridor waypoint the spur runs out to[, longest leg in metres])
SPURS = [
    ("styggemann", "ravalsjo", "Sørmyrseter"),
    ("store-ble", "sigridsbu", "Sigridsbu turisthytte"),
    ("lonahorgi", "normalruta", "Ryggen nordvest for Svartahorgi"),
    ("kvitegga", "normalruta", "Brattbakken, 1316"),
    ("kvitegga", "normalruta", "Høgda 1583"),
    ("snota", "trollheimshytta", "inn på vinterruta frå Gråhaugen"),
    ("rundfjellet", "normalruta", "sørryggen"),
    # The spur here starts by dropping 27 m off the ridge it rejoins 76 m on;
    # a 60 m leg removes the tip and leaves the dip, so this one may be longer.
    ("rundfjellet", "normalruta", "ryggen der den dreier vest", 80.0),
    ("slogen", "oye-direkte", "Ryggmøtet, høgde 1204"),
]


def cum(points):
    out = [0.0]
    for a, b in zip(points, points[1:]):
        out.append(out[-1] + haversine(a[0], a[1], b[0], b[1]))
    return out


def leg(a, b):
    """Samples every SAMPLE_M strictly between a and b: [(lat, lng, z, class)]."""
    d = haversine(a[0], a[1], b[0], b[1])
    n = max(1, int(math.ceil(d / SAMPLE_M)))
    out = []
    for k in range(1, n):
        t = k / n
        lat, lng = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
        z, cls = dtm_point(lat, lng)
        out.append((round(lat, 5), round(lng, 5), z, cls))
    return out


def find_cut(pts, zs, tip, chord_max=CHORD_MAX_M):
    c = cum(pts)
    cands = []
    for i in range(max(0, tip - WINDOW), tip):
        for j in range(tip + 1, min(len(pts) - 1, tip + WINDOW) + 1):
            d = haversine(*pts[i], *pts[j])
            if d > chord_max or d < 1:
                continue
            if math.degrees(math.atan2(abs(zs[j] - zs[i]), d)) > LEG_MAX_DEG:
                continue
            cands.append(((c[j] - c[i]) - d, i, j, d))
    cands.sort(reverse=True)
    for saved, i, j, d in cands[:12]:
        samples = leg(pts[i], pts[j])
        if any(s[2] is None for s in samples):
            continue
        if any(s[3] in WATER for s in samples):
            continue
        prof = [zs[i]] + [s[2] for s in samples] + [zs[j]]
        span = [pts[i]] + [(s[0], s[1]) for s in samples] + [pts[j]]
        if steepest_gradient(span, prof, window_m=min(30.0, d)) > LEG_MAX_DEG + 5:
            continue
        return i, j, d, saved, samples
    return None


def restate(r):
    pts, zs = r["points"], r["elevations"]
    r["distanceM"] = int(round(path_length_m(pts)))
    r["gainM"] = sum(max(0, b - a) for a, b in zip(zs, zs[1:]))
    r["lossM"] = sum(max(0, a - b) for a, b in zip(zs, zs[1:]))
    r["maxAngle"] = round(steepest_gradient(pts, zs), 1)
    r["minZ"] = round(float(min(zs)), 1)


def move_waypoint(waypoints, name, lat, lng, z, gap):
    """Move the named waypoint onto the line; the note to record, or None if absent."""
    for w in waypoints:
        if w.get("name") != name:
            continue
        # corridors.json says elevation_m, the research record elevationM.
        key = "elevationM" if "elevationM" in w else "elevation_m"
        old = (w["lat"], w["lng"], w[key])
        w["lat"], w["lng"], w[key] = lat, lng, float(z)
        return (
            f"«{name}» moved onto the line in the review round: the solved line passed "
            f"{gap:.0f} m beside the researched point and walked out to it and back "
            f"({old[0]}/{old[1]}, {old[2]:.0f} m); the waypoint now sits where the line "
            f"already ran, at DTM1 {z:.0f} m."
        )
    return None


def main():
    apply = "--apply" in sys.argv
    routes = json.load(open("routes.json"))
    corridors = json.load(open("corridors.json"))
    research = json.load(open("new_corridors.json"))
    by_slug = {rec["slug"]: rec for rec in research}

    for slug, rid, wname, *limit in SPURS:
        r = next(x for x in routes[slug] if x["id"] == rid)
        cr = next(x for x in corridors[slug]["routes"] if x["id"] == rid)
        w = next((x for x in cr["waypoints"] if x["name"] == wname), None)
        if w is None:
            raise SystemExit(f"{slug}/{rid}: no waypoint {wname!r}")
        pts = [tuple(p) for p in r["points"]]
        zs = list(r["elevations"])
        tip = min(range(len(pts)), key=lambda k: haversine(*pts[k], w["lat"], w["lng"]))
        # Once applied, the waypoint *is* a vertex of the line; cutting again
        # around it would remove a stretch that is not a spur.
        if haversine(*pts[tip], w["lat"], w["lng"]) < 1.0:
            print(f"{slug}/{rid} «{wname}»: already on the line — nothing to cut")
            continue
        before = (r["distanceM"], r["gainM"], len(pts))
        cut = find_cut(pts, zs, tip, *limit)
        if cut is None:
            print(f"{slug}/{rid} «{wname}»: no dry cut found — left as it is")
            continue
        i, j, d, saved, samples = cut
        new_pts = pts[: i + 1] + [(s[0], s[1]) for s in samples] + pts[j:]
        new_zs = zs[: i + 1] + [int(round(s[2])) for s in samples] + zs[j:]
        r["points"], r["elevations"] = [list(p) for p in new_pts], new_zs
        restate(r)
        # The waypoint lands on the line vertex nearest the researched point.
        k = min(range(len(new_pts)), key=lambda m: haversine(*new_pts[m], w["lat"], w["lng"]))
        gap = haversine(*new_pts[k], w["lat"], w["lng"])
        print(
            f"{slug}/{rid} «{wname}»: tip v{tip} ({zs[tip]} m), cut v{i}–v{j} "
            f"({zs[i]}→{zs[j]} m) with a {d:.0f} m leg of {len(samples)} new vertices; "
            f"{saved:.0f} m less line. {before[0]} m +{before[1]} → "
            f"{r['distanceM']} m +{r['gainM']}; waypoint now {gap:.0f} m off → v{k} at {new_zs[k]} m"
        )
        if apply:
            note = move_waypoint(cr["waypoints"], wname,
                                 new_pts[k][0], new_pts[k][1], new_zs[k], gap)
            prev = cr.get("corridorNote")
            cr["corridorNote"] = f"{prev} {note}" if prev else note
            rec = by_slug.get(slug)
            if rec and rec.get("corridor"):
                cor = rec["corridor"]
                if cor.get("routeId") == rid:
                    move_waypoint(cor.get("waypoints") or [], wname,
                                  new_pts[k][0], new_pts[k][1], new_zs[k], gap)
                for alt in cor.get("alternates") or []:
                    if (alt.get("routeId") or alt.get("id")) == rid:
                        move_waypoint(alt.get("waypoints") or [], wname,
                                      new_pts[k][0], new_pts[k][1], new_zs[k], gap)

    if apply:
        json.dump(routes, open("routes.json", "w"), ensure_ascii=False)
        json.dump(corridors, open("corridors.json", "w"), ensure_ascii=False, indent=1)
        json.dump(research, open("new_corridors.json", "w"), ensure_ascii=False, indent=2)
        print("\nwrote routes.json, corridors.json, new_corridors.json")


if __name__ == "__main__":
    main()
