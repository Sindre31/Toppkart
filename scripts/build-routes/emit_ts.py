"""Emit lib/routes.ts from routes.json."""

import json
import os

REPO = "/home/user/Toppkart"

HEADER = '''/** Detailed ascent lines for every tour.
 *
 *  Each line is a least-cost path solved over Kartverket's 1 m national terrain
 *  model (DTM1), through a corridor — trailhead, then the valley, shoulder and
 *  summit ridge the standard route uses. The cost model prices what matters on
 *  the way up: a gentle skinning gradient is cheap, steep ground is expensive,
 *  giving back height is penalised, and traversing a steep side-slope is
 *  penalised even where the step itself is flat, which is what keeps the line
 *  off cliff bands. Sea is impassable; frozen lakes are not.
 *
 *  Summit coordinates are snapped to the highest DTM cell and cross-checked
 *  against the published height. Trailheads are the winter parking places.
 *
 *  These are real terrain lines, not the schematic zig-zag they replace — but
 *  they are still generated geometry, not a recorded track. They show where the
 *  route goes; they are not a substitute for a map, a forecast and judgement in
 *  the field. Production replaces them with surveyed GPX.
 *
 *  Generated — see scripts/build-routes/ for the pipeline that produces it.
 */

export interface TourRoute {
  /** The standard route the line follows, e.g. "Normalruta fra Skorgedalen". */
  routeName: string;
  /** Where the tour starts: the winter parking. */
  trailhead: string;
  /** Length along the ground, metres. */
  distanceM: number;
  /** Cumulative ascent along the line, metres. */
  gainM: number;
  /** Flat `lat, lng, elevation` triplets — trailhead first, summit last.
   *  Flat rather than nested to keep the payload small; read it with
   *  `routeFor` / `routeProfile` in `./tours` rather than indexing it here. */
  line: readonly number[];
}

'''


def main():
    routes = json.load(open("routes.json"))
    order = json.load(open("tourmeta.json")).keys()

    chunks = [HEADER, "export const ROUTES: Record<string, TourRoute> = {\n"]
    for slug in order:
        r = routes.get(slug)
        if not r:
            continue
        flat = []
        for (lat, lng), z in zip(r["points"], r["elevations"]):
            flat += [f"{lat:.5f}", f"{lng:.5f}", str(z)]
        # Wrap the triplets so the file stays reviewable in a diff.
        rows = []
        for i in range(0, len(flat), 12):
            rows.append("      " + ", ".join(flat[i : i + 12]))
        key = slug if slug.replace("-", "").isalnum() and "-" not in slug else f'"{slug}"'
        chunks.append(
            f"  {key}: {{\n"
            f"    routeName: {json.dumps(r['routeName'], ensure_ascii=False)},\n"
            f"    trailhead: {json.dumps(r['trailheadName'], ensure_ascii=False)},\n"
            f"    distanceM: {r['distanceM']},\n"
            f"    gainM: {r['gainM']},\n"
            f"    line: [\n" + ",\n".join(rows) + ",\n    ],\n"
            f"  }},\n"
        )
    chunks.append("};\n")

    path = os.path.join(REPO, "lib", "routes.ts")
    with open(path, "w") as f:
        f.write("".join(chunks))
    n = sum(len(r["points"]) for r in routes.values())
    print(f"wrote {path}: {len(routes)} routes, {n} points, {os.path.getsize(path)/1024:.0f} KB")


if __name__ == "__main__":
    main()
