"""The treeline every guide quotes, re-read every 5 m along the line.

`guide_facts.treeline_scan` reads Kartverket's terrain class at each *vertex*
of the line — about one every 45 m — and calls the last `Skog` vertex the
treeline. That is the figure the guides quote, and two of them were wrong in
opposite ways when it was read more closely:

  Hornindalsrokken  the guide said 673 m; every vertex from 655 to 798 m is
                    forest. The vertex scan was right and the prose was stale.
  Vassdalstinden    the guide said 581 m; the scan said 637. Read every 5 m, the
                    line leaves the forest at 581, crosses 95 m of open ground,
                    and clips a forest stand at 636–638 m. Both numbers are
                    true of different things, and the guide has to say which.

This check reads the class every `STEP_M` of ground, walks the line with the
same stopping rule as `treeline_scan` (`TREELINE_QUIET_M` of ground and
`TREELINE_QUIET_UP` of height clear of the last forest), and reports three
heights per route:

  vertex   guide_facts' treeline — the figure the guides are checked against
  dense    the same rule on the 5 m samples: where the forest really ends
  belt     the top of the highest forest run at least `BELT_MIN_M` long —
           where the line leaves the forest it has been in for open ground

and every number the guide puts next to a word for forest or treeline. A route
is listed when `dense` is more than `TOL_M` above `vertex` (the scan stepped
over forest), when `belt` is more than `PATCH_M` below `dense` (a patch above a
gap, the Vassdalstinden shape), or when a stated number matches none of the
three.

Only the stretch from `WINDOW_BELOW_M` under the vertex treeline to the quiet
margin above it is read densely — about 40 000 lookups for the catalogue rather
than 115 000 — because that is the only stretch where the two scans can
disagree. Classes are cached in cache/treeline_dense.json, so a re-run is free.

    python3 check_treeline.py [slug …]
"""

import json
import os
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor

from geo import dtm_point, haversine
from guide_facts import TREELINE_CEILING_M, TREELINE_QUIET_M, TREELINE_QUIET_UP

STEP_M = 5.0
BELT_MIN_M = 60.0 # a forest run this long is belt; shorter ones above it are clips
WINDOW_BELOW_M = 300.0  # how far under the vertex treeline the dense read starts
TOL_M = 10.0      # a stated height this close to a measurement matches it
SEGMENT_M = 20.0  # dense above vertex by more than this: more than one vertex segment of forest missed
PATCH_M = 30.0    # belt below dense by more than this: a patch above a gap
WORKERS = 16
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache", "treeline_dense.json")

FOREST_WORD = re.compile(
    r"(skoggrens\w*|tregrens\w*|skogen|skog\b|forest|treeline|tree line)",
    re.I,
)
# The height a guide gives for the treeline is the first number after the word,
# before the clause moves on: «skoggrensa ligger på 359 etter 1,04 km», «the
# forest holds to 798 m». A number followed by a distance or an angle unit is
# not it.
STATED = re.compile(r"\D{0,30}?(?<![\d,.])(\d{2,4})(?![\d,.]\d)(?!\s*(?:km|grader|degrees|°|meter grunn|metres of ground|%))")


def load_cache():
    return json.load(open(CACHE)) if os.path.exists(CACHE) else {}


def classify(cache, pts):
    """Terrain class and DTM1 height for each point, through the cache."""
    keys = [f"{a:.5f},{b:.5f}" for a, b in pts]
    todo = [(k, p) for k, p in zip(keys, pts) if k not in cache]

    def ask(item):
        k, (a, b) = item
        for i in range(4):
            try:
                z, cls = dtm_point(a, b)
                if cls is not None:
                    return k, [z, cls]
            except Exception:  # noqa: BLE001 — the API drops connections under load
                pass
            time.sleep(1.5 * (i + 1))
        return k, None

    with ThreadPoolExecutor(WORKERS) as ex:
        for k, v in ex.map(ask, todo):
            if v is not None:
                cache[k] = v
    return [cache.get(k) for k in keys]


def samples(points, elevations, upto_m, from_m=0.0):
    """(ground, lat, lng, z) every STEP_M along the line, between `from_m` and `upto_m`."""
    out, cum = [], 0.0
    for (a, b), za, zb in zip(zip(points, points[1:]), elevations, elevations[1:]):
        d = haversine(a[0], a[1], b[0], b[1])
        if cum + d >= from_m:
            n = max(1, int(d // STEP_M))
            for k in range(n):
                t = k / n
                if cum + d * t >= from_m:
                    out.append((cum + d * t, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t,
                                za + (zb - za) * t))
        cum += d
        if cum > upto_m:
            break
    return out


def scan(rows):
    """treeline_scan's rule over samples: (dense last forest z, belt top z, runs)."""
    last = None
    for g, z, cls in rows:
        if z > TREELINE_CEILING_M:
            continue
        if cls == "Skog":
            last = (g, z)
        elif last and g - last[0] >= TREELINE_QUIET_M and z - last[1] >= TREELINE_QUIET_UP:
            break
    runs, cur = [], None
    for g, z, cls in rows:
        f = cls == "Skog"
        if cur and cur[0] == f:
            cur[2], cur[4] = g, z
        else:
            if cur:
                runs.append(cur)
            cur = [f, g, g, z, z]
    if cur:
        runs.append(cur)
    # The belt is the highest stretch of forest the line is actually in for a
    # while; anything above it is a clip of a stand beside the line.
    belt = None
    for f, g0, g1, z0, z1 in runs:
        if f and g1 - g0 + STEP_M >= BELT_MIN_M and (last is None or g0 <= last[0]):
            belt = z1
    return (last[1] if last else None), belt, runs


def stated(text):
    """The heights a guide gives as its treeline: the first number after each forest word."""
    out = set()
    for m in FOREST_WORD.finditer(text):
        got = STATED.match(text, m.end())
        if got:
            v = int(got.group(1))
            if 0 < v < 1400:
                out.add(v)
    return out


def main():
    only = set(sys.argv[1:])
    routes = json.load(open("routes.json"))
    facts = json.load(open("guide_facts.json"))
    guides = json.load(open("guides.json"))
    cache = load_cache()
    flagged = 0
    print(f"{'route':<34}{'vertex':>7}{'dense':>7}{'belt':>7}  stated   notes")
    for slug, recs in routes.items():
        if only and slug not in only or slug not in facts:
            continue
        text = " ".join(
            json.dumps(guides.get(slug, {}).get(lang, {}), ensure_ascii=False) for lang in ("no", "en")
        )
        said = stated(text)
        for r, fr in zip(recs, facts[slug]["routes"]):
            tl = fr.get("treeline") or {}
            vertex = tl.get("last_forest_m")
            # The vertex scan is right below its own treeline to within a vertex;
            # what it can miss is above it. Read densely from WINDOW_BELOW_M
            # under its last forest vertex to the quiet margin past it.
            edge = (tl.get("last_forest_km") or 0) * 1000
            sm = samples(r["points"], r["elevations"], edge + TREELINE_QUIET_M + 200,
                         max(0.0, edge - WINDOW_BELOW_M))
            got = classify(cache, [(a, b) for _, a, b, _ in sm])
            rows = [(g, (c[0] if c and c[0] is not None else z), c[1] if c else None)
                    for (g, _, _, z), c in zip(sm, got)]
            dense, belt, runs = scan(rows)
            dense = round(dense) if dense is not None else None
            belt = round(belt) if belt is not None else None
            notes = []
            if dense is not None and (vertex is None or dense - vertex > SEGMENT_M):
                notes.append(f"forest to {dense} m, vertex scan says {vertex}")
            described = any(abs(v - belt) <= TOL_M for v in said) and any(abs(v - dense) <= TOL_M for v in said) \
                if dense is not None and belt is not None else False
            if dense is not None and belt is not None and dense - belt > PATCH_M and not described:
                patches = [f"{round(z0)}–{round(z1)} m ({g1 - g0 + STEP_M:.0f} m)"
                           for f, g0, g1, z0, z1 in runs if f and z0 > belt + 1]
                notes.append(f"belt ends {belt} m; forest again at " + ", ".join(patches[:3]))
            near = {v for v in said if any(x is not None and abs(v - x) <= TOL_M for x in (vertex, dense, belt))}
            if r is recs[0] and said and not near:
                notes.append(f"guide states {sorted(said)}, none within {TOL_M:.0f} m of the measurements")
            if notes:
                flagged += 1
            if notes or only:
                print(f"{slug + '/' + r['id']:<34}{str(vertex):>7}{str(dense):>7}{str(belt):>7}  "
                      f"{','.join(map(str, sorted(said))) or '-':<8} {'; '.join(notes)}")
        json.dump(cache, open(CACHE, "w"))
    print(f"\n{flagged} routes to look at")
    return 1 if flagged else 0


if __name__ == "__main__":
    sys.exit(main())
