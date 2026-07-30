"""Stamp the corridor file with DTM elevations and provenance.

corridors.json is the one hand-authored input to this pipeline — the route
knowledge a terrain model cannot supply. Filling in the terrain height at every
coordinate makes it self-checking: if a number here ever stops matching the DTM,
the coordinate moved.
"""

import json

from geo import dtm_point


def main():
    corridors = json.load(open("corridors.json"))
    sources = json.load(open("corridor_sources.json"))
    summits = json.load(open("summits.json"))
    tours = json.load(open("tourmeta.json"))

    for slug, rec in corridors.items():
        rec["source"] = sources.get(slug, "")
        th = rec["trailhead"]
        z, terr = dtm_point(th["lat"], th["lng"])
        th["elevation_m"] = round(z, 1) if z is not None else None
        th["terreng"] = terr
        for w in rec.get("waypoints") or []:
            z, terr = dtm_point(w["lat"], w["lng"])
            w["elevation_m"] = round(z, 1) if z is not None else None
        implied = round(summits[slug]["summit_dtm"] - tours[slug]["verticalM"], 1)
        rec["implied_start_m"] = implied
        rec["start_vs_implied_m"] = (
            round(th["elevation_m"] - implied, 1) if th["elevation_m"] is not None else None
        )
        print(
            f"{slug:<18} {th['elevation_m']:>7} m  (implied {implied:>7}, "
            f"Δ{rec['start_vs_implied_m']:+7}) {len(rec.get('waypoints') or []):>2} wp  "
            f"{th.get('terreng')}"
        )

    with open("corridors.json", "w") as f:
        json.dump(corridors, f, indent=1, ensure_ascii=False)
    print("\nstamped corridors.json")


if __name__ == "__main__":
    main()
