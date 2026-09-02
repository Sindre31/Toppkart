"""The shape of every line, checked offline against nothing but itself.

`check_routes.py` asks whether a line ends on its summit and whether its
elevations agree with Kartverket at one sample point. `check_ground.py` asks
what mapped ground it crosses. Neither looks at the *shape* of the line — and
the first full-catalogue pass over all 223 routes found four kinds of defect
that every existing check had walked past, because every number those checks
compare was correct:

  scribble   Two routes out of Kongsvik spend a tenth of their length — 924 m
             and 964 m — in tight loops inside a flat forest at 22 moh. Every
             vertex is on ground the DTM agrees with; the line just goes round
             in circles there, and the distance the guide quotes is a tenth too
             long because of it.
  spur       Seven routes walk out to a corridor waypoint that sits 130–300 m
             off the natural line and come straight back along their own
             track: an out-and-back that adds twice the spur to the distance
             and, on a ridge, a climb the tour never makes.
  crossing   A line that crosses itself is one of the two above, or a resample
             artefact; either way it is a shape the map should not draw.
  sea        Two routes carry vertices on `Havflate` — one crosses a boat
             harbour at its start, one dips into a tidal inlet — at −2 and
             −5 m. `check_ground.py` looks only for lakes.

Plus the things that are cheap to re-derive and have drifted at least once:
the summit the line ends on, the gain and distance the emitter wrote, the
corridor it was solved through, the elevation profile drawn under the guide,
and the notch a resampled vertex can put in a line.

Reads `routes.json` (build it with `routes_from_ts.py`), `summits.json`,
`corridors.json`, `route_metrics.json` and the emitted TypeScript. No network,
no raster: it runs in seconds and can run anywhere.

    python3 check_geometry.py [slug …]

Exits non-zero when something needs a look. Notes — a route that shares its
primary's car park, a line that gives back height on a ridge, a terrain grade
two steps from the editorial one — are printed and do not fail the run: they
are things a reader should know, not defects.
"""

import json
import math
import os
import re
import sys
from collections import defaultdict

from guide_facts import svg_path

REPO = "/home/user/Toppkart"
HERE = os.path.dirname(os.path.abspath(__file__))

END_TOL_M = 25.0         # the line ends on the card's summit — lib/tours.test.ts says the same
SUMMIT_TOL_M = 5.0       # last elevation against the card
GAIN_TOL_M = 10.0        # the README's invariant
GAP_M = 120.0            # the longest step between two vertices check_routes.py allows
STEEP_DEG = 45.0         # a segment steeper than this is a cliff or a resample notch …
STEEP_MIN_M = 10.0       # … once it rises this much. Two metres over one metre is rounding
CROSS_MIN_M = 4.0        # a crossing between segments shorter than this is coordinate jitter
SPIKE_M = 12.0           # up-and-back-down within SPIKE_SPAN_M of ground
SPIKE_SPAN_M = 60.0
SCRIBBLE_RADIUS_M = 30.0  # a window of path that never leaves this radius …
SCRIBBLE_PATH_M = 120.0   # … while covering this much ground is going in circles
SPUR_RETURN_M = 12.0     # back within this of an earlier vertex …
SPUR_GROUND_M = 300.0    # … after this much ground is an out-and-back
TRAILHEAD_TOL_M = 60.0   # the line starts where the corridor says
TRAILHEAD_Z_TOL_M = 15.0
WAYPOINT_TOL_M = 200.0   # every corridor waypoint is near the line
DIP_NOTE_M = 80.0        # height given back on the way up, reported as a note


def haversine(lat1, lng1, lat2, lng2):
    r = 6371008.8
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lng2 - lng1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


ROW = re.compile(
    r'\{ slug: "([^"]+)", name: "([^"]+)", region: "([^"]+)", lat: ([\d.]+), lng: ([\d.]+), '
    r'summitM: (\d+), verticalM: (\d+), duration: "([^"]+)", grade: (\d)'
)
PROFILE = re.compile(
    r'slug: "([^"]+)",(?:.|\n)*?elevationProfile: \{\n\s*path: "([^"]+)",\n\s*startLabel: "(\d+) moh",'
    r'\n\s*endLabel: "(\d+) moh",\n\s*distanceLabel: "([^"]+)",'
)


def tours_ts():
    src = open(os.path.join(REPO, "lib", "tours.ts")).read()
    return {
        m.group(1): {
            "lat": float(m.group(4)), "lng": float(m.group(5)),
            "summitM": int(m.group(6)), "verticalM": int(m.group(7)),
            "duration": m.group(8), "grade": int(m.group(9)),
        }
        for m in ROW.finditer(src)
    }


def profiles_ts():
    src = open(os.path.join(REPO, "lib", "guides.ts")).read()
    return {
        m.group(1): {"path": m.group(2), "start": int(m.group(3)), "end": int(m.group(4)), "dist": m.group(5)}
        for m in PROFILE.finditer(src)
    }


def _cross(o, a, b):
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])


def _intersects(p1, p2, p3, p4):
    d1, d2 = _cross(p3, p4, p1), _cross(p3, p4, p2)
    d3, d4 = _cross(p1, p2, p3), _cross(p1, p2, p4)
    return d1 * d2 < 0 and d3 * d4 < 0


def crossings(pts, segs):
    """How many times the line crosses itself. Adjacent segments share a vertex
    and cannot cross; everything else is checked pairwise, ignoring segments
    too short for a five-decimal coordinate to place. Quadratic, and fine at a
    few hundred vertices."""
    n = 0
    for i in range(len(pts) - 1):
        if segs[i] < CROSS_MIN_M:
            continue
        for j in range(i + 2, len(pts) - 1):
            if segs[j] >= CROSS_MIN_M and _intersects(pts[i], pts[i + 1], pts[j], pts[j + 1]):
                n += 1
    return n


def scribbles(pts, zs, cum):
    """Windows of path that cover SCRIBBLE_PATH_M of ground without ever leaving
    a SCRIBBLE_RADIUS_M disc around where they started."""
    out, i, n = [], 0, len(pts)
    while i < n:
        j = i + 1
        while j < n and haversine(*pts[i], *pts[j]) < SCRIBBLE_RADIUS_M:
            j += 1
        length = cum[j - 1] - cum[i]
        if length >= SCRIBBLE_PATH_M:
            out.append((i, j - 1, length, zs[i]))
            i = j
        else:
            i += 1
    return out


def spurs(pts, zs, cum):
    """The first place the line comes back within SPUR_RETURN_M of an earlier
    vertex after SPUR_GROUND_M or more of ground: an out-and-back, or a loop."""
    n = len(pts)
    for i in range(n):
        for j in range(i + 1, n):
            if cum[j] - cum[i] > SPUR_GROUND_M and haversine(*pts[i], *pts[j]) < SPUR_RETURN_M:
                far = max(range(i, j + 1), key=lambda k: haversine(*pts[i], *pts[k]))
                return i, j, cum[j] - cum[i], far, haversine(*pts[i], *pts[far])
    return None


def check_route(slug, r, tour, primary, corridor, summit, problem, note):
    rid = r["id"]
    pts = [tuple(p) for p in r["points"]]
    zs = r["elevations"]
    n = len(pts)
    segs = [haversine(*a, *b) for a, b in zip(pts, pts[1:])]
    cum = [0.0]
    for d in segs:
        cum.append(cum[-1] + d)

    if n < 25:
        problem(f"{rid}: only {n} points")
    if abs(cum[-1] - r["distanceM"]) > 0.005 * r["distanceM"] + 10:
        problem(f"{rid}: distanceM {r['distanceM']} but the line measures {cum[-1]:.0f} m")
    gain = sum(max(0, b - a) for a, b in zip(zs, zs[1:]))
    if abs(gain - r["gainM"]) > GAIN_TOL_M:
        problem(f"{rid}: gainM {r['gainM']} but the elevations sum to {gain}")
    if max(segs) > GAP_M:
        problem(f"{rid}: {max(segs):.0f} m gap between vertices")

    # Ends.
    d_end = haversine(*pts[-1], tour["lat"], tour["lng"])
    if d_end > END_TOL_M:
        problem(f"{rid}: ends {d_end:.0f} m from the card summit")
    if abs(zs[-1] - tour["summitM"]) > SUMMIT_TOL_M:
        problem(f"{rid}: ends at {zs[-1]} m, the card says {tour['summitM']}")
    if summit and haversine(*pts[-1], summit["lat"], summit["lng"]) > SUMMIT_TOL_M:
        problem(f"{rid}: ends {haversine(*pts[-1], summit['lat'], summit['lng']):.0f} m from the resolved summit")
    if r is not primary:
        d = haversine(*pts[-1], *primary["points"][-1])
        if d > END_TOL_M:
            problem(f"{rid}: ends {d:.0f} m from the primary's end")
        d = haversine(*pts[0], *primary["points"][0])
        if d < 50:
            note(f"{rid}: shares the primary's trailhead ({d:.0f} m apart)")

    # Sea. The DTM reads the water surface as slightly negative, so a vertex at
    # or below zero is standing on the fjord, not on a beach.
    below = [i for i, z in enumerate(zs) if z < 0]
    if below:
        problem(f"{rid}: {len(below)} vertices below sea level (v{below[0]}, {min(zs)} m) — the line is on the water")
    top = max(zs)
    if top > zs[-1] + 3:
        note(f"{rid}: reaches {top} m before the {zs[-1]} m summit — gives back {top - zs[-1]} m")

    # Shape.
    steep = [(i, d, zs[i + 1] - zs[i]) for i, d in enumerate(segs)
             if d > 1 and abs(zs[i + 1] - zs[i]) >= STEEP_MIN_M
             and math.degrees(math.atan2(abs(zs[i + 1] - zs[i]), d)) > STEEP_DEG]
    if steep:
        worst = max(steep, key=lambda s: abs(s[2]) / s[1])
        problem(f"{rid}: {len(steep)} segment(s) over {STEEP_DEG:.0f}° — worst v{worst[0]}: {worst[2]:+d} m over {worst[1]:.0f} m of ground at {zs[worst[0]]} moh")
    spikes = [i for i in range(1, n - 1)
              if (zs[i] - zs[i - 1]) * (zs[i] - zs[i + 1]) > 0
              and min(abs(zs[i] - zs[i - 1]), abs(zs[i] - zs[i + 1])) > SPIKE_M
              and segs[i - 1] + segs[i] < SPIKE_SPAN_M]
    if spikes:
        i = spikes[0]
        problem(f"{rid}: {len(spikes)} elevation spike(s) — v{i}: {zs[i-1]} → {zs[i]} → {zs[i+1]} over {segs[i-1] + segs[i]:.0f} m")
    sc = scribbles(pts, zs, cum)
    if sc:
        total = sum(s[2] for s in sc)
        problem(f"{rid}: goes in circles — {total:.0f} m of {r['distanceM']} m inside {len(sc)} patch(es) of {SCRIBBLE_RADIUS_M:.0f} m: "
                + "; ".join(f"v{a}–v{b} {L:.0f} m at {z} moh" for a, b, L, z in sc))
    sp = spurs(pts, zs, cum)
    if sp:
        i, j, ground, far, reach = sp
        kind = "loop" if abs(zs[i] - zs[j]) < 8 else "switchback"
        where = ""
        if corridor:
            wp = min(corridor["waypoints"], key=lambda w: haversine(w["lat"], w["lng"], *pts[far]))
            d = haversine(wp["lat"], wp["lng"], *pts[far])
            if d < 30:
                where = f" — the tip is waypoint «{wp['name']}», {d:.0f} m off"
        problem(f"{rid}: out-and-back {kind} — {reach:.0f} m out and back to within {haversine(*pts[i], *pts[j]):.0f} m of v{i} after {ground:.0f} m of ground, {zs[i]} → {zs[far]} → {zs[j]} m{where}")
    x = crossings(pts, segs)
    if x and not sc and not sp:
        # One or two crossings between real segments is a resampled switchback
        # folding over itself by a metre or two: worth knowing, not worth a
        # reroute. Three or more is a shape.
        (problem if x >= 3 else note)(f"{rid}: crosses itself {x} time(s)")

    # Descent on the way up, as a note: a col is a col.
    runmax, dip, dip_at = zs[0], 0, None
    for z in zs:
        runmax = max(runmax, z)
        if runmax - z > dip:
            dip, dip_at = runmax - z, z
    if dip > DIP_NOTE_M:
        loss = sum(max(0, a - b) for a, b in zip(zs, zs[1:]))
        note(f"{rid}: drops {dip} m below its running high (to {dip_at} m); {loss} m of descent on the way up")

    # The corridor it was solved through.
    if corridor:
        th = corridor["trailhead"]
        d = haversine(*pts[0], th["lat"], th["lng"])
        if d > TRAILHEAD_TOL_M:
            problem(f"{rid}: starts {d:.0f} m from the corridor trailhead «{th['name']}»")
        if abs(zs[0] - th["elevation_m"]) > TRAILHEAD_Z_TOL_M:
            problem(f"{rid}: starts at {zs[0]} m, the corridor trailhead reads {th['elevation_m']:.0f}")
        far = []
        for w in corridor["waypoints"]:
            d = min(haversine(w["lat"], w["lng"], *p) for p in pts)
            if d > WAYPOINT_TOL_M:
                far.append(f"«{w['name']}» {d:.0f} m")
        if far:
            problem(f"{rid}: misses corridor waypoints: " + "; ".join(far))


def main():
    os.chdir(HERE)
    routes = json.load(open("routes.json"))
    summits = json.load(open("summits.json"))
    corridors = json.load(open("corridors.json"))
    metrics = json.load(open("route_metrics.json"))
    tours = tours_ts()
    profiles = profiles_ts()
    only = set(sys.argv[1:])

    problems, notes = defaultdict(list), defaultdict(list)
    n_routes = 0
    for slug, tour in tours.items():
        if only and slug not in only:
            continue
        recs = routes.get(slug)
        if not recs:
            problems[slug].append("no routed line")
            continue
        ids = [r["id"] for r in recs]
        if len(set(ids)) != len(ids):
            problems[slug].append(f"duplicate route ids {ids}")
        by_id = {c["id"]: c for c in corridors.get(slug, {}).get("routes", [])}
        if slug in corridors and set(by_id) != set(ids):
            problems[slug].append(f"corridor ids {sorted(by_id)} vs shipped {sorted(ids)}")
        for r in recs:
            n_routes += 1
            check_route(slug, r, tour, recs[0], by_id.get(r["id"]), summits.get(slug),
                        problems[slug].append, notes[slug].append)

        primary = recs[0]
        if abs(primary["gainM"] - tour["verticalM"]) > GAIN_TOL_M:
            problems[slug].append(f"card vertical {tour['verticalM']} vs routed {primary['gainM']}")
        m = metrics.get(slug)
        if m and (m["gainM"], m["distanceM"], m["startM"]) != (primary["gainM"], primary["distanceM"], primary["elevations"][0]):
            problems[slug].append(f"route_metrics.json is stale: {m['gainM']}/{m['distanceM']}/{m['startM']} vs the line's {primary['gainM']}/{primary['distanceM']}/{primary['elevations'][0]}")
        if m and abs(m["grade"] - tour["grade"]) > 1:
            notes[slug].append(f"terrain grade {m['grade']} against editorial grade {tour['grade']}")
        # The profile under the guide is this line, thinned the same way.
        pr = profiles.get(slug)
        if not pr:
            problems[slug].append("no elevation profile in lib/guides.ts")
        else:
            want = svg_path([tuple(p) for p in primary["points"]], primary["elevations"])
            if want != pr["path"]:
                problems[slug].append("the elevation profile in lib/guides.ts is not drawn from the shipped line")
            label = f"{primary['distanceM'] / 1000:.1f}".replace(".", ",") + " km"
            if pr["dist"] != label:
                problems[slug].append(f"profile distanceLabel «{pr['dist']}» vs the line's {label}")
            if pr["start"] != primary["elevations"][0]:
                problems[slug].append(f"profile starts at {pr['start']} m, the line at {primary['elevations'][0]}")

    n_tours = len(only or tours)
    n_problems = sum(len(v) for v in problems.values())
    for slug in tours:
        for p in problems.get(slug, []):
            print(f"  {slug}: {p}")
    if any(notes.values()):
        print("\nnotes:")
        for slug in tours:
            for p in notes.get(slug, []):
                print(f"  {slug}: {p}")
    print(f"\n{n_tours} tours, {n_routes} routes — " + ("clean" if not n_problems else f"{n_problems} things to look at in {len([s for s in problems if problems[s]])} tours"))
    return 1 if n_problems else 0


if __name__ == "__main__":
    sys.exit(main())
