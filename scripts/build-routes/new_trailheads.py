"""Trailhead shortlist for a tour whose vertical gain is not known yet.

`find_trailheads.py` ranks candidates by how close their terrain height is to
`summitM − verticalM`. That works for the first 24 tours, where the vertical came
from a guidebook — but for a peak being added from scratch the vertical is what
the route is going to *produce*, so ranking by it would be circular (the README
records what that circularity did to Rørnestinden).

So this ranks on what is known independently of the route: a mapped car park
beats a road end, near beats far, and a start on the sea is only sensible for a
peak that actually rises out of the fjord. It produces a shortlist to choose
from, not a choice — the pick is recorded in `NEW_PICKS` in `new_corridors.py`.
"""

import json
import os
import sys

from find_trailheads import candidates
from geo import dtm_point, haversine

PARTIAL = "new_trailhead_candidates.partial.json"
OUT = "new_trailhead_candidates.json"


def score(c, summit_z):
    """Lower is better. Distance in km, plus penalties."""
    s = c["dist_km"] / 3.0
    if c["kind"] != "P":
        s += 1.6  # a road is a place to stop, a car park is a trailhead
    if not c["name"]:
        s += 0.4
    if c["z"] < 3.0 and summit_z > 900:
        # Sea-level starts are real in Lyngen and Lofoten, but they are the
        # long way up everywhere else — rank them behind, do not exclude them.
        s += 0.8
    if c["dist_km"] < 1.2:
        s += 1.0  # too close to be the bottom of a tour
    return s


def main():
    summits = json.load(open("summits.json"))
    only = set(sys.argv[1:])
    result = json.load(open(PARTIAL)) if os.path.exists(PARTIAL) else {}
    if result:
        print(f"resuming — {len(result)} peaks already done")

    for slug, s in summits.items():
        if slug in result or (only and slug not in only):
            continue
        try:
            for radius in (6000, 10000, 15000):
                cands = candidates(s["lat"], s["lng"], radius)
                if len(cands) >= 15 or radius == 15000:
                    break
        except Exception as e:  # noqa: BLE001
            print(f"!! {slug}: Overpass unavailable — {e}")
            continue

        cands.sort(key=lambda c: haversine(s["lat"], s["lng"], c["lat"], c["lng"]))
        seen, best = [], []
        for c in cands:
            if any(haversine(c["lat"], c["lng"], p[0], p[1]) < 600 for p in seen):
                continue
            seen.append((c["lat"], c["lng"]))
            if len(seen) > 30:
                break
            try:
                z, terr = dtm_point(c["lat"], c["lng"])
            except Exception:  # noqa: BLE001
                continue
            if z is None:
                continue
            d = haversine(s["lat"], s["lng"], c["lat"], c["lng"])
            rec = {
                **c,
                "z": round(z, 1),
                "terreng": terr or "?",
                "dist_km": round(d / 1000, 2),
                "gain_m": round(s["summit_dtm"] - z),
            }
            rec["score"] = round(score(rec, s["summit_dtm"]), 2)
            best.append(rec)

        best.sort(key=lambda c: c["score"])
        result[slug] = {"summit_m": s["summit_dtm"], "candidates": best[:10]}
        with open(PARTIAL, "w") as f:
            json.dump(result, f, ensure_ascii=False)

        print(f"\n=== {slug}  summit {s['summit_dtm']} m")
        for c in best[:10]:
            print(
                f"   {c['score']:>5.2f}  {c['kind']:<12} z={c['z']:>7.1f}  +{c['gain_m']:>4} m  "
                f"{c['dist_km']:>5.2f} km  {c['lat']:.5f},{c['lng']:.5f}  "
                f"{c['terreng']:<14} {c['name']}"
            )

    with open(OUT, "w") as f:
        json.dump(result, f, indent=1, ensure_ascii=False)
    print(f"\nwrote {OUT} ({len(result)} peaks)")


if __name__ == "__main__":
    main()
