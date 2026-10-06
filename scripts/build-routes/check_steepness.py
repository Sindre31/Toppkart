"""The steepest step every guide quotes, re-read from the 5 m profile.

Every guide gives the line's steepest sustained gradient — «brattaste
samanhengande parti 29,4 grader mellom 1411 og 1428 moh» — and that figure is
`router.steepest_span` over the line's *vertices*, about 45 m apart: the
steepest 30 m of ground between two of them. A step shorter than the spacing
can sit between two vertices and never be measured, and on an avalanche
product the steepest ground is the figure that must not be understated.

This check runs the same `steepest_span` over the 5 m profile `check_gain.py`
caches (cache/gain_dense/ — run that first) and reports per route:

  vertex   the 30 m window the guides quote, with the two heights
  dense    the same window over the 5 m profile
  where    the heights the dense window runs between

A route is listed when `dense` exceeds `vertex` by more than `TOL_DEG`. No
network: it reads the cached profiles.

    python3 check_steepness.py [slug …]
"""

import json
import os
import sys

from check_gain import OUT, samples
from router import steepest_span

TOL_DEG = 5.0


def main():
    only = set(sys.argv[1:])
    here = os.path.dirname(os.path.abspath(__file__))
    routes = json.load(open(os.path.join(here, "routes.json")))
    flagged = 0
    print(f"{'route':<34}{'vertex':>16}{'dense':>16}  notes")
    for slug, recs in routes.items():
        if only and slug not in only:
            continue
        for r in recs:
            path = os.path.join(OUT, f"{slug}__{r['id']}.json")
            if not os.path.exists(path):
                print(f"{slug + '/' + r['id']:<34}  no cached profile — run check_gain.py")
                continue
            pts, zs = [tuple(p) for p in r["points"]], r["elevations"]
            va, vi, vj = steepest_span(pts, zs)
            sm, _ = samples(pts, zs)
            z = json.load(open(path))
            good = [(s, v) for s, v in zip(sm, z) if v is not None]
            dp = [(s[1], s[2]) for s, _ in good]
            dz = [v for _, v in good]
            da, di, dj = steepest_span(dp, dz)
            v_txt = f"{va:4.1f}° {zs[vi]}–{zs[vj]}"
            d_txt = f"{da:4.1f}° {dz[di]:.0f}–{dz[dj]:.0f}"
            note = ""
            if da - va > TOL_DEG:
                flagged += 1
                note = f"+{da - va:.1f}° the vertex window does not see"
            if note or only:
                print(f"{slug + '/' + r['id']:<34}{v_txt:>16}{d_txt:>16}  {note}", flush=True)
    print(f"\n{flagged} routes to look at")
    return 1 if flagged else 0


if __name__ == "__main__":
    sys.exit(main())
