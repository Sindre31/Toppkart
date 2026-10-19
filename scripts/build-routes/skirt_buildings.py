"""Take a shipped line round the buildings it goes through, and change nothing else.

`check_ground.py --houses` finds them: DTM1 is bare ground, so the router cannot
see a house, and a line over a farmyard or a cabin field goes straight through
whatever stands there. Re-solving the tour is the wrong fix. A shipped line has
been through `retrace_trails`, `cut_spurs` and the review rounds since it was
first routed, and a fresh solve through the corridor throws that away: tried on
the first nineteen, Fannaråken from Turtagrø came back 300 m shorter and
Folarskardnuten 430 m shorter, for a fix that needed a few dozen metres moved.

So this does what `cut_spurs.py` does, at the building rather than the spur:

  - the footprints are the ones `check_ground.py` cached for the route's bbox;
    a building within SUMMIT_M of the summit is the hut or mast the tour goes
    to, and is left alone;
  - for each cluster of crossings the line leaves at a vertex LEAD_M before it
    and rejoins at one LEAD_M after, through three detour points offset to the
    nearer side that keeps CLEAR_M off every footprint;
  - every new leg is read from DTM1 every SAMPLE_M, may not be steeper than
    LEG_MAX_DEG over 30 m, and may not answer a water class;
  - a trailhead that sits in or against a building moves to the nearest point
    CLEAR_M clear of all of them.

A resort or a summit installation does not leave 5 m between buildings
everywhere — Spiterstulen's trailhead stands in a cabin field and Gaustatoppen's
ridge carries the transmitter and its bunkers end to end — so where no detour
fits, the pass tries again with a longer lead and less clearance (LADDER), and
says which it used.

The detour points then go into `corridors.json` as waypoints, and a moved
trailhead moves there too, so a re-solve through the corridor goes round the
same buildings.

    python3 skirt_buildings.py <slug>/<route> …           # dry run
    python3 skirt_buildings.py --apply <slug>/<route> …   # rewrites routes.json and corridors.json
"""

import glob
import json
import math
import sys

from cut_spurs import LEG_MAX_DEG, SAMPLE_M, WATER, leg, restate
from geo import dtm_point, haversine
from router import steepest_gradient

CLEAR_M = 5.0      # how far a detour keeps from any footprint
SUMMIT_M = 100.0   # the same rule check_ground.py uses for the summit hut
LEAD_M = 20.0      # how far before and after a crossing the detour starts
MAX_OFFSET_M = 120.0
# (lead, clearance) to try in order when the defaults find no detour.
LADDER = ((20.0, 5.0), (20.0, 4.0), (30.0, 4.0), (30.0, 3.0), (40.0, 3.0))


class Frame:
    """A local metric frame: buildings are a few metres across, so flat is exact enough."""

    def __init__(self, lat0, lng0):
        self.lat0, self.lng0 = lat0, lng0
        self.kx = 111320.0 * math.cos(math.radians(lat0))
        self.ky = 110540.0

    def xy(self, lat, lng):
        return ((lng - self.lng0) * self.kx, (lat - self.lat0) * self.ky)

    def ll(self, x, y):
        return (round(self.lat0 + y / self.ky, 5), round(self.lng0 + x / self.kx, 5))


def footprints(slug, rid, summit, fr):
    seen = {}
    for path in glob.glob(f"cache/buildings_{slug}_{rid}_*.json"):
        for el in json.load(open(path)) or []:
            g = el.get("geometry") or []
            if len(g) < 4 or g[0] != g[-1] or not (el.get("tags") or {}).get("building"):
                continue
            cen = (sum(n["lat"] for n in g) / len(g), sum(n["lon"] for n in g) / len(g))
            if haversine(cen[0], cen[1], summit[0], summit[1]) < SUMMIT_M:
                continue
            seen[el["id"]] = [fr.xy(n["lat"], n["lon"]) for n in g[:-1]]
    return seen


def inside(p, poly):
    x, y = p
    c = False
    for (x1, y1), (x2, y2) in zip(poly, poly[1:] + poly[:1]):
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
            c = not c
    return c


def seg_dist(p, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    t = 0.0 if dx == dy == 0 else max(0.0, min(1.0, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)))
    return math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)


def clearance(p, polys):
    """Metres from p to the nearest footprint; negative inside one."""
    best = 1e9
    for poly in polys:
        if inside(p, poly):
            return -1.0
        for a, b in zip(poly, poly[1:] + poly[:1]):
            best = min(best, seg_dist(p, a, b))
    return best


def path_clear(path, polys, need):
    for a, b in zip(path, path[1:]):
        n = max(1, int(math.dist(a, b) / 2))
        for k in range(n + 1):
            p = (a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n)
            if clearance(p, polys) < need:
                return False
    return True


def crossings(line, cum, polys):
    """Clusters of the line's 2 m samples that fall inside a footprint."""
    hits = []
    for i in range(len(line) - 1):
        a, b = line[i], line[i + 1]
        n = max(1, int(math.dist(a, b) / 2))
        for k in range(n):
            p = (a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n)
            for wid, poly in polys.items():
                if inside(p, poly):
                    hits.append((cum[i] + (cum[i + 1] - cum[i]) * k / n, wid))
    hits.sort()
    groups = []
    for s, wid in hits:
        if groups and s - groups[-1]["b"] < 3 * LEAD_M:
            groups[-1]["b"] = s
            groups[-1]["ids"].add(wid)
        else:
            groups.append({"a": s, "b": s, "ids": {wid}})
    return groups


def at(line, cum, s):
    """The point and the unit direction of travel s metres along the line."""
    s = max(0.0, min(cum[-1], s))
    for i in range(len(line) - 1):
        if cum[i + 1] >= s:
            a, b = line[i], line[i + 1]
            d = math.dist(a, b) or 1.0
            f = (s - cum[i]) / ((cum[i + 1] - cum[i]) or 1.0)
            return (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f), ((b[0] - a[0]) / d, (b[1] - a[1]) / d)
    a, b = line[-2], line[-1]
    d = math.dist(a, b) or 1.0
    return b, ((b[0] - a[0]) / d, (b[1] - a[1]) / d)


def free_spot(p, polys):
    """The nearest point to p that is CLEAR_M off every footprint."""
    for r in range(1, 120):
        for k in range(72):
            th = 2 * math.pi * k / 72
            q = (p[0] + r * math.cos(th), p[1] + r * math.sin(th))
            if clearance(q, polys) >= CLEAR_M:
                return q
    return None


def dry_leg(a, b):
    """DTM1 samples strictly between a and b, or None if the leg is wet or too steep."""
    samples = leg(a, b)
    if any(s[2] is None for s in samples) or any(s[3] in WATER for s in samples):
        return None
    return samples


def skirt(r, slug, summit):
    """The rewritten line, its new corridor points and a moved trailhead, or a reason it could not."""
    pts = [tuple(p) for p in r["points"]]
    zs = list(r["elevations"])
    fr = Frame(*pts[0])
    polys = footprints(slug, r["id"], summit, fr)
    allp = list(polys.values())
    line = [fr.xy(*p) for p in pts]
    cum = [0.0]
    for a, b in zip(line, line[1:]):
        cum.append(cum[-1] + math.dist(a, b))
    groups = crossings(line, cum, polys)
    if not groups:
        return None, "clean"

    trailhead = None
    if clearance(line[0], allp) < CLEAR_M:
        q = free_spot(line[0], allp)
        if q is None:
            return None, "the trailhead is boxed in by buildings"
        trailhead = fr.ll(*q)
        line[0] = q
        pts[0] = trailhead
        z, _ = dtm_point(*trailhead)
        zs[0] = int(round(z))

    # Work from the summit end back, so earlier vertex indices stay valid.
    added = []
    for g in reversed(groups):
        a, b = g["a"], g["b"]
        i = max([k for k in range(len(cum)) if cum[k] <= a - LEAD_M] or [0])
        j = min([k for k in range(len(cum)) if cum[k] >= b + LEAD_M] or [len(cum) - 1])
        if j == len(cum) - 1 and j - i < 2:
            return None, f"crossing at {a:.0f} m runs into the summit"
        stations = [s for s in (a - LEAD_M / 2, (a + b) / 2, b + LEAD_M / 2) if cum[i] < s < cum[j]]
        chosen = None
        for t in range(int(CLEAR_M), int(MAX_OFFSET_M), 2):
            for side in (1, -1):
                cand = []
                for s in stations:
                    p, d = at(line, cum, s)
                    cand.append((p[0] - d[1] * side * t, p[1] + d[0] * side * t))
                path = [line[i]] + cand + [line[j]]
                if all(clearance(p, allp) >= CLEAR_M for p in cand) and path_clear(path, allp, CLEAR_M / 2):
                    chosen = cand
                    break
            if chosen:
                break
        if chosen is None:
            return None, f"no detour within {MAX_OFFSET_M:.0f} m round way/{sorted(g['ids'])} at {a:.0f} m"
        # Three points is what the search needs, not what the line needs: where
        # the line bends at the building, the outer two make a hook back on
        # itself. Drop any point the detour stays clear without.
        k = 0
        while len(chosen) > 1 and k < len(chosen):
            trial = chosen[:k] + chosen[k + 1:]
            if path_clear([line[i]] + trial + [line[j]], allp, CLEAR_M / 2):
                chosen = trial
            else:
                k += 1
        via = [fr.ll(*p) for p in chosen]
        via_z = [dtm_point(*p) for p in via]
        if any(z is None or cls in WATER for z, cls in via_z):
            return None, f"a detour point round way/{sorted(g['ids'])} is on water or off the terrain model"
        chain = [pts[i]] + via + [pts[j]]
        new_pts, new_zs = [], []
        for k, (p, q) in enumerate(zip(chain, chain[1:])):
            samples = dry_leg(p, q)
            if samples is None:
                return None, f"the detour round way/{sorted(g['ids'])} crosses water"
            new_pts += [(s[0], s[1]) for s in samples]
            new_zs += [int(round(s[2])) for s in samples]
            if k < len(via):
                new_pts.append(via[k])
                new_zs.append(int(round(via_z[k][0])))
        span_pts = [pts[i]] + new_pts + [pts[j]]
        span_zs = [zs[i]] + new_zs + [zs[j]]
        if steepest_gradient(span_pts, span_zs, window_m=30.0) > LEG_MAX_DEG + 5:
            return None, f"the detour round way/{sorted(g['ids'])} is steeper than {LEG_MAX_DEG + 5:.0f}°"
        pts = pts[: i + 1] + new_pts + pts[j:]
        zs = zs[: i + 1] + new_zs + zs[j:]
        added.append((sorted(g["ids"]), via, [int(round(z)) for z, _ in via_z], a))

    return {"points": [list(p) for p in pts], "elevations": zs, "trailhead": trailhead, "added": added[::-1]}, None


def insert_waypoints(corridor_route, line_pts, added):
    """Put the detour points into the corridor in the order the line meets them."""
    def along(lat, lng):
        best, at_m, run = 1e9, 0.0, 0.0
        for p, q in zip(line_pts, line_pts[1:]):
            d = haversine(p[0], p[1], lat, lng)
            if d < best:
                best, at_m = d, run
            run += haversine(p[0], p[1], q[0], q[1])
        return at_m

    keyed = [(along(w["lat"], w["lng"]), w) for w in corridor_route.get("waypoints") or []]
    for ids, via, zs, _ in added:
        for (lat, lng), z in zip(via, zs):
            keyed.append((along(lat, lng), {
                "name": "utenom bygningene",
                "lat": lat, "lng": lng, "elevation_m": float(z),
                "note": "Lagt inn av skirt_buildings.py: linja gjekk gjennom "
                        + ", ".join(f"way/{i}" for i in ids) + ".",
            }))
    keyed.sort(key=lambda kv: kv[0])
    corridor_route["waypoints"] = [w for _, w in keyed]


def main():
    global LEAD_M, CLEAR_M
    args = sys.argv[1:]
    apply = "--apply" in args
    targets = [a.split("/") for a in args if a != "--apply"]
    routes = json.load(open("routes.json"))
    corridors = json.load(open("corridors.json"))
    summits = json.load(open("summits.json"))
    failed = []
    for slug, rid in targets:
        r = next(x for x in routes[slug] if x["id"] == rid)
        summit = (summits[slug]["lat"], summits[slug]["lng"])
        for LEAD_M, CLEAR_M in LADDER:
            out, why = skirt(r, slug, summit)
            if out is not None or why == "clean":
                break
        if out is None:
            print(f"{slug}/{rid}: {why}")
            if why != "clean":
                failed.append(f"{slug}/{rid}")
            continue
        before = (r["distanceM"], r["gainM"], r.get("maxAngle"))
        r["points"], r["elevations"] = out["points"], out["elevations"]
        restate(r)
        moved = f", trailhead moved to {out['trailhead']}" if out["trailhead"] else ""
        if (LEAD_M, CLEAR_M) != LADDER[0]:
            moved += f" (lead {LEAD_M:.0f} m, clearance {CLEAR_M:.0f} m)"
        print(
            f"{slug}/{rid}: {len(out['added'])} detour(s){moved}; "
            f"{before[0]} m +{before[1]} max {before[2]}° → {r['distanceM']} m +{r['gainM']} max {r['maxAngle']}°"
        )
        if apply:
            cr = next(x for x in corridors[slug]["routes"] if x["id"] == rid)
            if out["trailhead"]:
                cr["trailhead"]["lat"], cr["trailhead"]["lng"] = out["trailhead"]
                cr["trailhead"]["elevation_m"] = float(out["elevations"][0])
            insert_waypoints(cr, r["points"], out["added"])
    if apply:
        json.dump(routes, open("routes.json", "w"), ensure_ascii=False)
        json.dump(corridors, open("corridors.json", "w"), ensure_ascii=False, indent=1)
        print("\nwrote routes.json, corridors.json")
    if failed:
        print("\nleft as they are: " + " ".join(failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
