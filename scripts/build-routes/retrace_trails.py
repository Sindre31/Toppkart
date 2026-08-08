"""Solve every corridor twice — blind to the mapped trails, and not — and keep
whichever line is better.

The routes were solved over the terrain model alone, and against the ut.no
descriptions they are close. Where they are not close is the detail a reader
checks first: the line runs *beside* the path an ordinary map draws, through the
same contours, for a few hundred metres at a time. The terrain model has no
opinion about that, because a path is not terrain.

`router.py` now takes a `trails=` argument that makes mapped ground cheaper (see
`TRAIL_FACTOR` there). This runs both solves and decides per route, because the
trail is not always right:

  * a summer path takes the scramble the winter line has to avoid
  * a path stops at the treeline and the tour continues for another 900 m
  * the marked route rounds a lake the ski line crosses on the ice
  * OSM has a track in the valley that goes to a hut, not to this peak

So the trail line has to *earn* the swap. It is taken only when it is measurably
closer to what the map draws and no worse in every way the pipeline already
prices — steepness, height given back, distance, and the tour's published
vertical. A candidate that improves the trail fit by making the tour 800 m
longer or a degree steeper is not an improvement, it is a trade, and this file
does not make trades on the reader's behalf.

Everything it decides is written to `trail_retrace.json`, accepted or not, with
the numbers behind the decision. Rejections are the interesting half: they are
the record of which lines were checked and deliberately left alone.

    python3 retrace_trails.py [slug …]                 # decide; -> trail_retrace.json
    python3 retrace_trails.py --out part1.json [slug …]  # …under another name
    python3 retrace_trails.py --apply part*.json         # fold accepts into routes.json

The report carries the accepted geometry, not just the verdict, which is what
lets the deciding and the applying be separate commands. Ninety-five corridors
solved twice is an afternoon on one core and a quarter of that on four, and
four processes cannot share one `routes.json` — so each writes its own report
and a final `--apply` merges them. It also means the decision can be read, and
disagreed with, before anything is written.
"""

import json
import math
import os
import sys

import numpy as np

from check_trails import measure
from generate_routes import build, problems_with
from router import Router
from trails import bbox_of, fetch

HERE = os.path.dirname(__file__)

# — what a swap has to be worth —
#
# Eight points of near-50 share is about 200 m of a 2.5 km climb moving onto the
# path. Below that the two lines are the same line with a different rounding,
# and swapping geometry that is already in the repository for no visible gain is
# churn: every accepted route costs a re-read of its elevations, and every guide
# written against it has to be re-checked.
MIN_GAIN_PP = 0.08
# Distance and vertical are the two figures on the tour card. A trail line that
# is meaningfully longer or climbs meaningfully more is not the same tour, and
# the card would have to change to match — at which point the trail is not
# improving the route, it is replacing it.
MAX_DIST_GROWTH = 0.12
MAX_DIST_GROWTH_M = 600.0
MAX_GAIN_GROWTH = 0.12
# …except when the longer line is also a markedly gentler one. Slogen is the
# case the exception exists for: its normalruta reads 50.3° over the steepest
# 30 m — above this pipeline's own 42° ceiling — and the line that follows the
# mapped route reads 34.0° while running 705 m further. On a bare distance rule
# that rejection stands, and the product keeps a 50° step on the most serious
# tour in the set because the safer line is twelve percent longer.
#
# Going round rather than up is the trade a ski tourer makes on purpose, so the
# distance bar is waived when the candidate takes a real bite out of the
# steepest sustained gradient. Three degrees is well past what the grid
# disagrees with itself about.
DIST_WAIVED_BY_ANGLE_DROP_DEG = 3.0
# Steepness is the one number in the product a reader might make a safety
# decision on, so a candidate may not get meaningfully steeper — above the point
# where the number means anything.
#
# The floor is not squeamishness about arithmetic. Storhornet is the case: its
# line reads 17.9° over the steepest 30 m and the trail line reads 22.5°, and on
# a blanket «no worse» rule that rejection stands — while the route in question
# is Oppdal's most walked peak, the trail is the marked vinterløype the tour's
# own guide promises, and both figures describe ground you skin up without
# thinking about it. Nothing a reader does changes between 18° and 22°. What
# changes at 30° is the avalanche question and at 35° the skiing, and those are
# the numbers worth protecting — so below the floor the comparison is dropped
# rather than allowed to veto a line that is right on every other count.
MAX_ANGLE_WORSE_DEG = 1.0
MAX_ANGLE_FLOOR_DEG = 25.0


def load(name):
    return json.load(open(os.path.join(HERE, name), encoding="utf-8"))


def trail_lines(rec, key):
    """The mapped trails near this route, as bare polylines for the router."""
    return [w["line"] for w in fetch(bbox_of(rec["points"]), key)]


def corridor_of(route_rec, summit):
    th = route_rec["trailhead"]
    out = [(th["lat"], th["lng"])]
    out += [(w["lat"], w["lng"]) for w in route_rec.get("waypoints") or []]
    out.append((summit["lat"], summit["lng"]))
    return out


def solve(route_rec, summit, trails):
    """`generate_routes.build`, but with the Router handed the trails.

    `build` constructs its own Router, so the trail-aware solve is done by
    monkey-patching the constructor for the duration of the call rather than by
    forking `build` — a second copy of the smoothing, pinning and fine-summit
    logic is exactly the kind of drift this pipeline has been bitten by before.
    """
    import generate_routes

    original = generate_routes.Router
    generate_routes.Router = lambda points, **kw: original(points, trails=trails, **kw)
    try:
        return generate_routes.build(route_rec, summit)
    finally:
        generate_routes.Router = original


def verdict(base, cand, base_fit, cand_fit, probs):
    """Why this candidate was or was not taken. Empty list means: take it."""
    why = []
    if probs:
        why.append("fails the geometry checks: " + "; ".join(probs))
    gain_pp = cand_fit["near50"] - base_fit["near50"]
    if gain_pp < MIN_GAIN_PP:
        why.append(f"trail fit +{gain_pp*100:.0f} pp, under the {MIN_GAIN_PP*100:.0f} pp bar")
    grew = cand["distanceM"] - base["distanceM"]
    gentler = base["maxAngle"] - cand["maxAngle"] >= DIST_WAIVED_BY_ANGLE_DROP_DEG
    if (
        grew > MAX_DIST_GROWTH * base["distanceM"]
        and grew > MAX_DIST_GROWTH_M
        and not gentler
    ):
        why.append(f"{grew:+.0f} m longer ({grew/base['distanceM']*100:+.0f}%)")
    if cand["gainM"] > (1 + MAX_GAIN_GROWTH) * base["gainM"]:
        why.append(f"climbs {cand['gainM'] - base['gainM']:+.0f} m more")
    if (
        cand["maxAngle"] > base["maxAngle"] + MAX_ANGLE_WORSE_DEG
        and cand["maxAngle"] > MAX_ANGLE_FLOOR_DEG
    ):
        why.append(f"steepest 30 m {base['maxAngle']}° -> {cand['maxAngle']}°")
    if cand["lossM"] > base["lossM"] + max(40.0, 0.05 * base["gainM"]):
        why.append(f"gives back {cand['lossM'] - base['lossM']:+.0f} m more")
    return why


def apply_reports(paths):
    """Fold the accepted lines from one or more reports into routes.json."""
    routes = load("routes.json")
    moved = []
    for path in paths:
        with open(path, encoding="utf-8") as f:
            report = json.load(f)
        for key, entry in report.items():
            if entry["decision"] != "reroute":
                continue
            rec = entry.get("route")
            if rec is None:
                raise SystemExit(f"{path}: {key} says reroute but carries no geometry")
            slug = key[: -len("_" + rec["id"])]
            recs = routes.get(slug)
            if recs is None:
                raise SystemExit(f"{path}: {key} — no such tour in routes.json")
            for j, pub in enumerate(recs):
                if pub["id"] == rec["id"]:
                    recs[j] = {k: v for k, v in rec.items()}
                    moved.append(key)
                    break
            else:
                raise SystemExit(f"{path}: {key} — no such route in routes.json")
    with open(os.path.join(HERE, "routes.json"), "w", encoding="utf-8") as f:
        json.dump(routes, f, ensure_ascii=False)
    slugs = sorted({k.rsplit("_", 1)[0] for k in moved})
    print(f"applied {len(moved)} routes to routes.json")
    print("now: python3 resample_dtm1.py " + " ".join(slugs))
    return 0


def main():
    args = sys.argv[1:]
    if "--apply" in args:
        return apply_reports([a for a in args if a != "--apply"])

    out_path = os.path.join(HERE, "trail_retrace.json")
    if "--out" in args:
        i = args.index("--out")
        out_path = args[i + 1]
        args = args[:i] + args[i + 2:]
    only = set(args)

    summits = load("summits.json")
    corridors = load("corridors.json")
    tours = load("tourmeta.json")
    published = load("routes.json")

    report = {}
    for slug in sorted(published):
        if only and slug not in only:
            continue
        if slug not in corridors:
            print(f"{slug}: no corridor — skipped")
            continue
        by_id = {r["id"]: r for r in corridors[slug]["routes"]}
        for i, pub in enumerate(published[slug]):
            key = f"{slug}_{pub['id']}"
            route_rec = by_id.get(pub["id"])
            if route_rec is None:
                print(f"{key}: no corridor for this route — skipped")
                continue

            ways = fetch(bbox_of(pub["points"]), key)
            lines = [w["line"] for w in ways]
            pub_fit = measure(pub, ways)

            if not lines:
                report[key] = {
                    "decision": "keep",
                    "why": ["nothing mapped in the box — no trail to follow"],
                    "publishedNear50": pub_fit["near50"],
                }
                print(f"{key:<34} keep      nothing mapped")
                continue

            try:
                base = solve(route_rec, summits[slug], None)
                cand = solve(route_rec, summits[slug], lines)
            except Exception as err:  # noqa: BLE001
                report[key] = {"decision": "keep", "why": [f"router failed: {err}"]}
                print(f"{key:<34} keep      router failed — {err}")
                continue

            base_fit = measure(base, ways)
            cand_fit = measure(cand, ways)
            claimed = (tours.get(slug) or {}).get("verticalM") if i == 0 else None
            probs = problems_with(cand, i == 0, claimed)
            why = verdict(base, cand, base_fit, cand_fit, probs)

            report[key] = {
                "decision": "keep" if why else "reroute",
                "why": why,
                "publishedNear50": round(pub_fit["near50"], 3),
                "baseNear50": round(base_fit["near50"], 3),
                "trailNear50": round(cand_fit["near50"], 3),
                "publishedNear25": round(pub_fit["near25"], 3),
                "trailNear25": round(cand_fit["near25"], 3),
                "distanceM": [base["distanceM"], cand["distanceM"]],
                "gainM": [base["gainM"], cand["gainM"]],
                "lossM": [base["lossM"], cand["lossM"]],
                "maxAngle": [base["maxAngle"], cand["maxAngle"]],
                "trailWays": len(ways),
            }
            if not why:
                report[key]["route"] = cand

            mark = "REROUTE" if not why else "keep   "
            print(
                f"{key:<34} {mark}  near50 {pub_fit['near50']*100:3.0f}% -> "
                f"{cand_fit['near50']*100:3.0f}%   "
                f"{base['distanceM']}->{cand['distanceM']} m  "
                f"+{base['gainM']}->{cand['gainM']} m  "
                f"{base['maxAngle']}->{cand['maxAngle']}°"
                + ("   " + "; ".join(why) if why else ""),
                flush=True,
            )

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)

    n_re = sum(1 for v in report.values() if v["decision"] == "reroute")
    print(f"\n{len(report)} routes checked, {n_re} would move — {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
