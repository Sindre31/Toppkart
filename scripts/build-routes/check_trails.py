"""How far each generated route runs from the trail an ordinary map draws.

The routes are solved over the terrain model, which does not know that a path
exists. Mostly that is fine — above the treeline there is no path, and in
winter the line belongs where the snow and the slope angle put it. Lower down
it is not fine: a valley with a track up it has that track for a reason, and a
line that runs 150 m to the side of it through the birch scrub is wrong in the
one way a reader can check at a glance, by looking at the map.

This measures the gap. For every route it reports

  near25 / near50 / near100   share of the line within that many metres of a
                              mapped trail, weighted by length rather than by
                              vertex count — vertices bunch up on switchbacks
  medianOff                   the typical offset
  worstRun                    the longest continuous stretch further than
                              `FAR_M` from anything mapped, and where it starts

plus the same figures for the lower half of the climb alone (`lowNear50`),
which is the half where a trail usually exists and the argument for following
it is strongest.

A low near-score is not automatically a fault. Half the tours here finish on an
open ridge or a glacier where nothing is mapped and nothing should be. What the
numbers are for is to sort the set: the routes worth re-solving are the ones
that run *beside* a trail they could have been on, and those show up as a long
worstRun in the lower half with trails present in the box.
"""

import json
import math
import os
import sys

import numpy as np

from trails import bbox_of, fetch

HERE = os.path.dirname(__file__)

FAR_M = 100.0        # beyond this the line is not «on» the trail by any reading
STEP_M = 10.0        # resample the route this finely before measuring


def _frame(lat0):
    """Metres per degree at this latitude — good enough over a single tour."""
    return 110540.0, 111320.0 * math.cos(math.radians(lat0))


def _segments(ways, lat0):
    """All trail ways as one array of segments in a local metric frame."""
    my, mx = _frame(lat0)
    a, b = [], []
    for way in ways:
        line = way["line"]
        for p, q in zip(line, line[1:]):
            a.append((p[1] * mx, p[0] * my))
            b.append((q[1] * mx, q[0] * my))
    if not a:
        return None, None
    return np.array(a), np.array(b)


def _dist_to_segments(pts, sa, sb):
    """Distance from every point to the nearest segment, metres."""
    # pts (N,2), sa/sb (M,2) -> (N,M) then min over M. N is a few hundred and M
    # a few thousand, so the dense form is both simplest and fast enough.
    d = sb - sa                                          # (M,2)
    ll = (d * d).sum(1)                                  # (M,)
    ll = np.where(ll == 0, 1e-9, ll)
    ap = pts[:, None, :] - sa[None, :, :]                # (N,M,2)
    t = np.clip((ap * d[None, :, :]).sum(2) / ll[None, :], 0.0, 1.0)
    proj = sa[None, :, :] + t[:, :, None] * d[None, :, :]
    return np.hypot(*(pts[:, None, :] - proj).transpose(2, 0, 1)).min(1)


def _resample(points, step_m):
    out = [points[0]]
    my, mx = _frame(points[0][0])
    carry = 0.0
    for a, b in zip(points, points[1:]):
        seg = math.hypot((b[1] - a[1]) * mx, (b[0] - a[0]) * my)
        if seg <= 0:
            continue
        t = step_m - carry
        while t <= seg:
            f = t / seg
            out.append((a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f))
            t += step_m
        carry = (carry + seg) % step_m
    out.append(points[-1])
    return out


def measure(rec, ways):
    pts = _resample([tuple(p) for p in rec["points"]], STEP_M)
    lat0 = pts[0][0]
    my, mx = _frame(lat0)
    xy = np.array([(p[1] * mx, p[0] * my) for p in pts])

    sa, sb = _segments(ways, lat0)
    if sa is None:
        n = len(pts)
        return {
            "trailWays": 0,
            "near25": 0.0, "near50": 0.0, "near100": 0.0,
            "lowNear50": 0.0,
            "medianOff": None,
            "worstRunM": int(round(_length(xy))),
            "worstRunAtKm": 0.0,
            "n": n,
        }

    off = _dist_to_segments(xy, sa, sb)

    # Along-track distance, so shares are of ground covered rather than of
    # vertices — a switchback packs vertices into very little ground.
    step = np.hypot(*(xy[1:] - xy[:-1]).T)
    seglen = np.concatenate([[0.0], step])
    total = seglen.sum()
    weight = seglen / total

    low = xy.shape[0] // 2

    worst, worst_at, run, run_at = 0.0, 0.0, 0.0, 0.0
    along = np.cumsum(seglen)
    for i in range(len(off)):
        if off[i] > FAR_M:
            if run == 0.0:
                run_at = float(along[i])
            run += float(seglen[i])
            if run > worst:
                worst, worst_at = run, run_at
        else:
            run = 0.0

    return {
        "trailWays": len(ways),
        "near25": float((weight * (off <= 25)).sum()),
        "near50": float((weight * (off <= 50)).sum()),
        "near100": float((weight * (off <= 100)).sum()),
        "lowNear50": float(
            (weight[:low] * (off[:low] <= 50)).sum() / max(weight[:low].sum(), 1e-9)
        ),
        "medianOff": float(np.median(off)),
        "worstRunM": int(round(worst)),
        "worstRunAtKm": round(worst_at / 1000.0, 2),
        "n": len(pts),
    }


def _length(xy):
    return float(np.hypot(*(xy[1:] - xy[:-1]).T).sum())


def main():
    routes = json.load(open(os.path.join(HERE, "routes.json"), encoding="utf-8"))
    only = set(sys.argv[1:])
    out = {}
    rows = []
    for slug, recs in sorted(routes.items()):
        if only and slug not in only:
            continue
        for rec in recs:
            key = f"{slug}_{rec['id']}"
            ways = fetch(bbox_of(rec["points"]), key)
            m = measure(rec, ways)
            m["distanceM"] = rec["distanceM"]
            out[key] = m
            rows.append((slug, rec["id"], m))

    rows.sort(key=lambda r: r[2]["lowNear50"])
    print(f"{'tour':<20}{'route':<15}{'ways':>5}{'near25':>8}{'near50':>8}"
          f"{'low50':>7}{'medOff':>8}{'worstRun':>10}{'at km':>7}")
    for slug, rid, m in rows:
        med = "  —  " if m["medianOff"] is None else f"{m['medianOff']:5.0f}"
        print(
            f"{slug:<20}{rid:<15}{m['trailWays']:>5}"
            f"{m['near25']*100:>7.0f}%{m['near50']*100:>7.0f}%{m['lowNear50']*100:>6.0f}%"
            f"{med:>8}{m['worstRunM']:>9} m{m['worstRunAtKm']:>7.2f}"
        )

    with open(os.path.join(HERE, "trail_fit.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"\nwrote trail_fit.json ({len(out)} routes)")


if __name__ == "__main__":
    main()
