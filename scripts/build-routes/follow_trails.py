"""Put the line on the mapped path where it runs beside one through forest.

The routes are solved over the terrain model, which does not know a path
exists, and the most visible thing that does to a line is this: it leaves the
path drawn on the map, runs 50 to 200 m to one side of it for a few hundred
metres, and comes back. Whether that matters depends on the ground beside the
path.

  * **Open ground** — above the treeline, on a bog, on a glacier — is the same
    snow either side of the path. A line 80 m off it is still a line someone can
    ski, and often a better one: the summer path takes the scramble, the winter
    line rounds it. Those are left as they are, and listed, so the decision is
    on the record.
  * **Forest** is not. Below the treeline the path is the corridor — the strip
    where the trees are cleared, the track is broken and everybody else goes. A
    line drawn 150 m into the scrub beside it is wrong in the one way a reader
    can see without leaving the sofa, and on the ground it is a line nobody
    will follow.

So, for every route: find the *detours* — stretches more than `ON_M` off any
mapped way, at least `MIN_RUN_M` long, that leave a way and come back to one
(a line that was never on the path is not running beside it) and stay within
`BESIDE_M` of one for most of their length. Read the terrain class along each
from DTM1's point API every `SAMPLE_M`. A detour that is mostly `Skog` is
replaced by the path itself: the shortest way along the mapped network from
where the line leaves it to where it comes back, taken only when that is not
much longer than the detour (`MAX_DETOUR_RATIO`) — a path that goes the long
way round is a different route, not the same one drawn better.

The path is written into the corridor as waypoints — its own vertices thinned
to `SIMPLIFY_M` and never further apart than `WP_MAX_GAP_M` — and the route is
re-solved through them with `generate_routes.build`, so a re-solve through the
corridor draws the path (the rule `cut_spurs.py` follows). A research waypoint
inside the detour that sits off the path is replaced: it is what held the line
off the path. One that sits further than `BESIDE_M` from the path is there for a
different reason — a lake to round, a shoulder to cross — and the detour is left
alone.

What ships is not the whole re-solve but the shipped line with its forest
detours spliced out of it (`splice`), read from DTM1 like every shipped line.
The first pass shipped whole re-solves and, read at 1 m, eight of thirty came
back a degree or more steeper — mostly outside the moved stretch, because a
re-solve re-cuts the grid and lands the smoothing differently everywhere. The
splice changes the ground the reader was told about only where it was wrong.

A line is taken only if it raises no problem `generate_routes.problems_with`
did not already raise on the shipped line, leaves no forest detour behind, does
not grow, give back height, or get steeper beyond the bars below — the same
bars `retrace_trails.py` holds a trail line to — and leaves the card's vertical
true of the primary route.

The mapped ways are `trails.py`'s OSM paths, tracks, footways and ski-touring
routes, plus its minor roads (`fetch_roads`). The roads matter twice: a line
that follows the road from the car park is on mapped ground, not beside the
footpath next to the road, and a path that reaches a track by fifty metres of
farm road is one network on the ground. Without them the first run read both
as «not connected» — Englafjell's marked path along the railway, which the
source says to carry skis on, among them.

    python3 follow_trails.py --survey [slug …]   # list the detours, solve nothing
    python3 follow_trails.py [slug …]            # …and re-solve the forest ones; dry run
    python3 follow_trails.py --apply [slug …]    # write routes.json + corridors.json
    python3 follow_trails.py --out part1.json [slug …]   # dry run under another name…
    python3 follow_trails.py --apply-report part*.json   # …and ship its moves later
    python3 emit_ts.py
"""

import heapq
import json
import math
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np

from check_ground import dtm_class
from check_trails import _dist_to_segments, _frame, _resample, _segments
from generate_routes import build, problems_with
from geo import haversine
from resample_dtm1 import load_cache, resample
from router import path_length_m, steepest_gradient
from trails import bbox_of, fetch, fetch_roads

HERE = os.path.dirname(os.path.abspath(__file__))

ON_M = 30.0            # within this of a mapped way the line is on it
BESIDE_M = 150.0       # …and within this it is still in the way's corridor
BESIDE_SHARE = 0.6     # share of a detour that has to be in the corridor
MIN_RUN_M = 150.0      # shorter than this is a corner cut, not a detour
SAMPLE_M = 40.0        # terrain class read this often along a detour
FOREST_SHARE = 0.5     # a detour this much Skog is a detour through forest
JOIN_M = 40.0          # ways whose vertices are this close are one network
MAX_DETOUR_RATIO = 1.5  # the path may be this much longer than the detour
SIMPLIFY_M = 8.0       # path vertices kept as waypoints: Douglas-Peucker tolerance
WP_MAX_GAP_M = 120.0   # …with one inserted wherever two are further apart

MAX_GROWTH = 0.12
CARD_TOL_M = 10.0      # the card's vertical has to stay true of the primary line
MAX_ANGLE_WORSE_DEG = 1.0
MAX_ANGLE_FLOOR_DEG = 25.0
WATER = ("Elv", "Innsjø", "InnsjøRegulert", "Havflate")


def load(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return json.load(f)


# — finding the detours —

def detours(points, ways):
    pts = _resample([tuple(p) for p in points], 10.0)
    my, mx = _frame(pts[0][0])
    xy = np.array([(p[1] * mx, p[0] * my) for p in pts])
    sa, sb = _segments(ways, pts[0][0])
    if sa is None:
        return pts, []
    off = _dist_to_segments(xy, sa, sb)
    seg = np.concatenate([[0.0], np.hypot(*(xy[1:] - xy[:-1]).T)])
    along = np.cumsum(seg)
    out, i, n = [], 0, len(off)
    while i < n:
        if off[i] <= ON_M:
            i += 1
            continue
        j = i
        while j < n and off[j] > ON_M:
            j += 1
        length = along[j - 1] - along[i]
        beside = seg[i:j][off[i:j] <= BESIDE_M].sum() / max(seg[i:j].sum(), 1e-9)
        if i > 0 and j < n and length >= MIN_RUN_M and beside >= BESIDE_SHARE:
            out.append({
                "i0": i, "i1": j - 1,
                "fromKm": round(float(along[i]) / 1000, 2),
                "lenM": int(length),
                "medOff": int(np.median(off[i:j])),
                "maxOff": int(off[i:j].max()),
            })
        i = j
    return pts, out


def classify(pts, found):
    """Terrain class tally for each detour, read every SAMPLE_M."""
    step = max(1, int(SAMPLE_M / 10))
    jobs = [[pts[k] for k in range(d["i0"], d["i1"] + 1, step)] for d in found]
    flat = [p for job in jobs for p in job]
    with ThreadPoolExecutor(12) as ex:
        got = dict(zip(flat, ex.map(lambda p: dtm_class(p[0], p[1]), flat)))
    for d, job in zip(found, jobs):
        tally = {}
        for p in job:
            t = (got.get(p) or {}).get("t") or "?"
            tally[t] = tally.get(t, 0) + 1
        d["classes"] = tally
        d["forest"] = round(tally.get("Skog", 0) / len(job), 2)
    return found


# — the path network —

class Network:
    """The mapped ways as a graph: vertices, edges along each way, and a join
    wherever two ways come within `JOIN_M` of each other at a vertex — OSM
    shares the node at a junction, but a path drawn up to a track and stopped
    a few metres short is still the same path on the ground."""

    def __init__(self, ways, lat0):
        self.my, self.mx = _frame(lat0)
        index, self.xy = {}, []
        self.adj = []

        def vid(p):
            key = (round(p[0], 6), round(p[1], 6))
            if key not in index:
                index[key] = len(self.xy)
                self.xy.append((p[1] * self.mx, p[0] * self.my))
                self.adj.append([])
            return index[key]

        for w in ways:
            ids = [vid(p) for p in w["line"]]
            for a, b in zip(ids, ids[1:]):
                if a != b:
                    d = math.dist(self.xy[a], self.xy[b])
                    self.adj[a].append((b, d))
                    self.adj[b].append((a, d))
        self.xy = np.array(self.xy)
        for a in range(len(self.xy)):
            d = np.hypot(*(self.xy - self.xy[a]).T)
            for b in np.nonzero((d > 0) & (d <= JOIN_M))[0]:
                self.adj[a].append((int(b), float(d[b])))

    def nearest(self, lat, lng):
        x = np.array([lng * self.mx, lat * self.my])
        d = np.hypot(*(self.xy - x).T)
        k = int(np.argmin(d))
        return k, float(d[k])

    def shortest(self, a, b):
        dist, prev, todo = {a: 0.0}, {}, [(0.0, a)]
        while todo:
            d, u = heapq.heappop(todo)
            if u == b:
                break
            if d > dist[u]:
                continue
            for v, w in self.adj[u]:
                if d + w < dist.get(v, math.inf):
                    dist[v], prev[v] = d + w, u
                    heapq.heappush(todo, (d + w, v))
        if b not in dist:
            return None, math.inf
        path = [b]
        while path[-1] != a:
            path.append(prev[path[-1]])
        return path[::-1], dist[b]

    def latlng(self, k):
        return (self.xy[k][1] / self.my, self.xy[k][0] / self.mx)


def simplify(xy, eps):
    """Douglas-Peucker on a metric polyline; returns kept indices."""
    if len(xy) < 3:
        return list(range(len(xy)))
    a, b = np.array(xy[0]), np.array(xy[-1])
    ab = b - a
    n = np.hypot(*ab) or 1e-9
    rel = np.array(xy[1:-1]) - a
    d = np.abs(ab[0] * rel[:, 1] - ab[1] * rel[:, 0]) / n
    k = int(np.argmax(d)) + 1
    if d[k - 1] <= eps:
        return [0, len(xy) - 1]
    left = simplify(xy[: k + 1], eps)
    right = simplify(xy[k:], eps)
    return left[:-1] + [k + i for i in right]


def path_waypoints(net, path, label):
    """The path's vertices as corridor waypoints: thinned, then densified."""
    xy = [tuple(net.xy[k]) for k in path]
    kept = simplify(xy, SIMPLIFY_M)
    out = []
    for i, j in zip(kept, kept[1:]):
        out.append(net.latlng(path[i]))
        gap = math.dist(xy[i], xy[j])
        extra = int(gap // WP_MAX_GAP_M)
        for e in range(1, extra + 1):
            f = e / (extra + 1)
            p = (xy[i][0] + (xy[j][0] - xy[i][0]) * f, xy[i][1] + (xy[j][1] - xy[i][1]) * f)
            out.append((p[1] / net.my, p[0] / net.mx))
    out.append(net.latlng(path[kept[-1]]))
    return [{"name": label, "lat": round(lat, 5), "lng": round(lng, 5)} for lat, lng in out]


# — the re-solve —

def onto_path(route_rec, pts, forest, net):
    """The corridor with each forest detour replaced by the path it runs beside.

    Returns (waypoints, replaced, skipped). Every waypoint, old and new, is
    ordered by where the shipped line passes it, so the new ones slot in among
    the research's own rather than after them.
    """
    def at(w):
        return min(range(len(pts)), key=lambda k: haversine(*pts[k], w["lat"], w["lng"]))

    old = [(at(w), w) for w in route_rec.get("waypoints") or []]
    added, replaced, skipped = [], [], []
    for d in forest:
        lo, hi = max(0, d["i0"] - 1), min(len(pts) - 1, d["i1"] + 1)
        a, da = net.nearest(*pts[lo])
        b, db = net.nearest(*pts[hi])
        path, length = net.shortest(a, b)
        if path is None:
            skipped.append((d, "the path it leaves and the one it rejoins are not connected"))
            continue
        if length > MAX_DETOUR_RATIO * (d["lenM"] + 20):
            skipped.append((d, f"the path is {length:.0f} m against {d['lenM']} m of line"))
            continue
        wps = path_waypoints(net, path, f"stien ved {d['fromKm']:.2f} km")
        inside = [(k, w) for k, w in old if lo - 3 <= k <= hi + 3]
        far = [w["name"] for _, w in inside
               if min(haversine(w["lat"], w["lng"], p["lat"], p["lng"]) for p in wps) > BESIDE_M]
        if far:
            skipped.append((d, f"research waypoint {', '.join(far)} is not on this path"))
            continue
        for item in inside:
            old.remove(item)
            replaced.append(item[1]["name"])
        # Spread the new ones over lo..hi so the sort keeps them in path order.
        span = max(1, len(wps) - 1)
        added += [(lo + (hi - lo) * n / span, w) for n, w in enumerate(wps)]
    merged = sorted(old + added, key=lambda kw: kw[0])
    return [w for _, w in merged], replaced, skipped


def worse(old, new, old_probs, new_probs):
    why = [p for p in new_probs if p.split(" ")[0] not in {q.split(" ")[0] for q in old_probs}]
    if new["distanceM"] > (1 + MAX_GROWTH) * old["distanceM"]:
        why.append(f"{new['distanceM'] - old['distanceM']:+d} m longer")
    if new["gainM"] > (1 + MAX_GROWTH) * old["gainM"]:
        why.append(f"climbs {new['gainM'] - old['gainM']:+d} m more")
    if new["lossM"] > old["lossM"] + max(40.0, 0.05 * old["gainM"]):
        why.append(f"gives back {new['lossM'] - old['lossM']:+d} m more")
    if new["maxAngle"] > old["maxAngle"] + MAX_ANGLE_WORSE_DEG and new["maxAngle"] > MAX_ANGLE_FLOOR_DEG:
        why.append(f"steepest 30 m {old['maxAngle']}° -> {new['maxAngle']}°")
    return why


def splice(pub, solved, on_path):
    """The shipped line with only its forest detours replaced from the re-solve.

    A re-solve through the new waypoints moves the whole line a little — the
    grid is re-cut, the smoothing lands differently — and on a 1 m read that is
    enough to move a steepest-30-m figure by two degrees on a ridge nowhere near
    the path. Nothing outside the detours was wrong, and every figure a guide
    quotes from it should stay what it was; so the re-solve only donates the
    stretch between where the line left the path and where it came back.
    Elevations of the result are read from DTM1, like every shipped line.
    """
    pts = _resample([tuple(p) for p in pub["points"]], 10.0)
    P, Z = [tuple(p) for p in pub["points"]], list(pub["elevations"])
    N = [tuple(p) for p in solved["points"]]

    def near(line, p, lo=0):
        return min(range(lo, len(line)), key=lambda k: haversine(*line[k], *p))

    cuts = []
    for d in on_path:
        leave, rejoin = pts[max(0, d["i0"] - 1)], pts[min(len(pts) - 1, d["i1"] + 1)]
        ia, ja = near(P, leave), near(N, leave)
        ib, jb = near(P, rejoin, ia), near(N, rejoin, ja)
        cuts.append((ia, ib, ja, jb))
    cuts.sort()
    out, zs, at = [], [], 0
    for ia, ib, ja, jb in cuts:
        if ia < at:
            continue
        out += P[at:ia]
        zs += Z[at:ia]
        out += N[ja:jb + 1]
        zs += [None] * (jb + 1 - ja)
        at = ib + 1
    out += P[at:]
    zs += Z[at:]

    cache = resample({"_": [{"points": [p for p, z in zip(out, zs) if z is None]}]}, load_cache())
    zs = [z if z is not None else int(round(cache.get(f"{p[0]:.5f},{p[1]:.5f}", 0)))
          for p, z in zip(out, zs)]
    line = dict(pub, points=[list(p) for p in out], elevations=zs)
    line["distanceM"] = int(round(path_length_m(out)))
    line["gainM"] = sum(max(0, b - a) for a, b in zip(zs, zs[1:]))
    line["lossM"] = sum(max(0, a - b) for a, b in zip(zs, zs[1:]))
    line["maxAngle"] = round(steepest_gradient(out, zs), 1)
    line["minZ"] = round(float(min(zs)), 1)
    return line


def judge(pub, line, ways, idx, claimed, skipped_km):
    """Why `line` should not replace `pub`; empty means take it."""
    why = worse(pub, line, problems_with(pub, idx == 0, claimed), problems_with(line, idx == 0, claimed))
    # The card's vertical is the primary route's gain to within ten metres
    # (`check_tours.py`, `lib/tours.test.ts`). A path that undulates through
    # the forest can add more than that, and then the card, the teaser and the
    # guide would all have to change — a different tour, not a better line.
    if claimed is not None and abs(line["gainM"] - claimed) > CARD_TOL_M:
        why.append(f"gain {line['gainM']} m against the card's {claimed} m")
    npts, left = detours(line["points"], ways)
    classify(npts, left)
    still = [d for d in left if d["forest"] >= FOREST_SHARE
             and not any(abs(d["fromKm"] - f) < 0.3 for f in skipped_km)]
    if still:
        why.append("still in the forest beside the path: " + ", ".join(
            f"{d['lenM']} m at {d['fromKm']} km" for d in still))
    return why


def take(routes, corridors, slug, idx, entry):
    """Ship one line into routes.json and its waypoints into the corridor."""
    new = {k: v for k, v in entry["route"].items() if k != "gridResM"}
    routes[slug][idx] = new
    route_rec = next(r for r in corridors[slug]["routes"] if r["id"] == new["id"])
    route_rec["waypoints"] = entry["waypoints"]
    note = ("follow_trails.py: put on the mapped path where the line ran beside it "
            "through forest (" + ", ".join(f"{d['lenM']} m from {d['fromKm']} km" for d in entry["onPath"])
            + ")" + (f"; replaced {', '.join(entry['replaced'])}" if entry["replaced"] else "") + ".")
    prev = route_rec.get("corridorNote")
    route_rec["corridorNote"] = f"{prev} {note}" if prev else note


def apply_reports(paths):
    """Ship the `move` decisions of one or more dry-run reports, without re-solving.

    The dry run already solved each line and carries it, which is what lets the
    deciding and the shipping be separate steps — four processes over seventy
    routes cannot share one routes.json, so each writes its own report and this
    merges them, after the lines have been looked at.
    """
    routes, corridors = load("routes.json"), load("corridors.json")
    moved = []
    for path in paths:
        with open(path, encoding="utf-8") as f:
            report = json.load(f)
        for key, entry in report.items():
            if entry["decision"] != "move":
                continue
            rid = entry["route"]["id"]
            slug = key[: -len("_" + rid)]
            idx = next(i for i, r in enumerate(routes[slug]) if r["id"] == rid)
            shipped = routes[slug][idx]
            if any(shipped[k] != v for k, v in entry["before"].items()):
                print(f"{key}: the shipped line is not the one this report judged — re-run it")
                continue
            take(routes, corridors, slug, idx, entry)
            moved.append(slug)
    with open(os.path.join(HERE, "routes.json"), "w", encoding="utf-8") as f:
        json.dump(routes, f, ensure_ascii=False)
    with open(os.path.join(HERE, "corridors.json"), "w", encoding="utf-8") as f:
        json.dump(corridors, f, ensure_ascii=False, indent=1)
    print(f"applied {len(moved)} routes\nnow: python3 emit_ts.py   # moved: " + " ".join(sorted(set(moved))))
    return 0


def main():
    args = sys.argv[1:]
    if "--apply-report" in args:
        return apply_reports([a for a in args if a != "--apply-report"])
    apply = "--apply" in args
    survey = "--survey" in args
    out_path = os.path.join(HERE, "cache", "trail_detours.json")
    if "--out" in args:
        i = args.index("--out")
        out_path = args[i + 1]
        args = args[:i] + args[i + 2:]
    only = {a for a in args if not a.startswith("--")}

    routes = load("routes.json")
    corridors = load("corridors.json")
    summits = load("summits.json")
    tours = load("tourmeta.json")

    report, moved = {}, []
    for slug in sorted(routes):
        if only and slug not in only:
            continue
        for idx, pub in enumerate(routes[slug]):
            key = f"{slug}_{pub['id']}"
            box = bbox_of(pub["points"])
            ways = fetch(box, key) + fetch_roads(box, key)
            pts, found = detours(pub["points"], ways)
            if not found:
                continue
            classify(pts, found)
            forest = [d for d in found if d["forest"] >= FOREST_SHARE]
            entry = {"detours": found, "decision": "keep"}
            report[key] = entry
            for d in found:
                kind = "SKOG" if d in forest else "open"
                print(f"{key:<36} {kind}  {d['fromKm']:>5.2f} km  {d['lenM']:>5} m  "
                      f"off {d['medOff']:>3}/{d['maxOff']:>3} m  {d['classes']}", flush=True)
            if not forest:
                entry["why"] = ["every detour is on open ground — skiable either side of the path"]
                continue
            if survey:
                continue

            net = Network(ways, pts[0][0])
            route_rec = next(r for r in corridors[slug]["routes"] if r["id"] == pub["id"])
            wps, replaced, skipped = onto_path(route_rec, pts, forest, net)
            for d, reason in skipped:
                print(f"  {d['fromKm']:.2f} km left as it is: {reason}", flush=True)
            entry["skipped"] = [{"fromKm": d["fromKm"], "why": r} for d, r in skipped]
            if len(skipped) == len(forest):
                entry["why"] = ["no forest detour has a path to put it on"]
                continue

            try:
                new = build(dict(route_rec, waypoints=wps), summits[slug])
            except Exception as err:  # noqa: BLE001
                entry["why"] = [f"router failed: {err}"]
                print(f"  -> KEEP  router failed — {err}", flush=True)
                continue
            claimed = (tours.get(slug) or {}).get("verticalM") if idx == 0 else None
            on_path = [d for d in forest if d not in [x for x, _ in skipped]]
            line = splice(pub, new, on_path)
            why = judge(pub, line, ways, idx, claimed, {d["fromKm"] for d, _ in skipped})
            print(f"  -> {'KEEP' if why else 'MOVE'}  {pub['distanceM']} -> {line['distanceM']} m  "
                  f"+{pub['gainM']} -> +{line['gainM']} m  -{pub['lossM']} -> -{line['lossM']} m  "
                  f"{pub['maxAngle']} -> {line['maxAngle']}°  replaced {replaced or 'nothing'}"
                  + ("   " + "; ".join(why) if why else ""), flush=True)
            entry.update({
                "decision": "keep" if why else "move",
                "why": why,
                "before": {k: pub[k] for k in ("distanceM", "gainM", "lossM", "maxAngle")},
                "after": {k: line[k] for k in ("distanceM", "gainM", "lossM", "maxAngle")},
                "waypoints": wps,
                "replaced": replaced,
                "onPath": on_path,
                "solved": new,
                "route": line,
            })
            if why or not apply:
                continue
            take(routes, corridors, slug, idx, entry)
            moved.append(slug)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    n_forest = sum(1 for v in report.values() if any(d["forest"] >= FOREST_SHARE for d in v["detours"]))
    n_move = sum(1 for v in report.values() if v["decision"] == "move")
    print(f"\n{len(report)} routes with detours, {n_forest} through forest, {n_move} onto the path"
          f" — {out_path}")
    if apply and moved:
        with open(os.path.join(HERE, "routes.json"), "w", encoding="utf-8") as f:
            json.dump(routes, f, ensure_ascii=False)
        with open(os.path.join(HERE, "corridors.json"), "w", encoding="utf-8") as f:
            json.dump(corridors, f, ensure_ascii=False, indent=1)
        print("wrote routes.json and corridors.json\nnow: python3 emit_ts.py   # moved: "
              + " ".join(sorted(set(moved))))
    return 0


if __name__ == "__main__":
    sys.exit(main())
