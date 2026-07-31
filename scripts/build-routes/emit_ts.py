"""Emit lib/routes.ts from routes.json."""

import json
import os

REPO = "/home/user/Toppkart"

HEADER = '''/** The ascent routes for every tour — a peak can have more than one.
 *
 *  Each line is a least-cost path solved over Kartverket's 1 m national terrain
 *  model (DTM1), through a corridor — trailhead, then the valley, shoulder and
 *  summit ridge the route uses. The cost model prices what matters on the way up:
 *  a gentle skinning gradient is cheap, steep ground is expensive, giving back
 *  height is penalised, and traversing a steep side-slope is penalised even where
 *  the step itself is flat, which is what keeps the line off cliff bands. Sea is
 *  impassable; frozen lakes are not.
 *
 *  Where a peak has several documented ways up they are all here, and they are
 *  not variants of one line: Galdhøpiggen's two standard starts are 737 vertical
 *  metres apart, and Tromsdalstinden's two routes leave the same car park and
 *  climb different sides of the mountain. The first route of a tour is the one
 *  the tour's own `verticalM` and `duration` describe.
 *
 *  Summit coordinates are snapped to the highest DTM cell and cross-checked
 *  against the published height. Trailheads are the winter parking places.
 *
 *  These are real terrain lines, not the schematic zig-zag they replace — but
 *  they are still generated geometry, not a recorded track. They show where a
 *  route goes; they are not a substitute for a map, a forecast and judgement in
 *  the field. Production replaces them with surveyed GPX.
 *
 *  Generated — see scripts/build-routes/ for the pipeline that produces it.
 */

export interface TourRoute {
  /** Stable within the tour; appears in `/kart?rute=` and the GPX filename. */
  id: string;
  /** What the route is called, e.g. "Normalruta fra Grøvdalen". */
  name: string;
  /** Where it starts: the winter parking. */
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

    chunks = [HEADER, "/** Routes per tour, the tour's own route first. */\n"]
    chunks.append("export const ROUTES: Record<string, readonly TourRoute[]> = {\n")
    written = {}
    for slug in order:
        recs = routes.get(slug)
        if not recs:
            continue
        written[slug] = recs
        key = slug if "-" not in slug else f'"{slug}"'
        chunks.append(f"  {key}: [\n")
        for r in recs:
            flat = []
            for (lat, lng), z in zip(r["points"], r["elevations"]):
                flat += [f"{lat:.5f}", f"{lng:.5f}", str(z)]
            rows = ["        " + ", ".join(flat[i : i + 12]) for i in range(0, len(flat), 12)]
            chunks.append(
                f"    {{\n"
                f"      id: {json.dumps(r['id'])},\n"
                f"      name: {json.dumps(r['name'], ensure_ascii=False)},\n"
                f"      trailhead: {json.dumps(r['trailheadName'], ensure_ascii=False)},\n"
                f"      distanceM: {r['distanceM']},\n"
                f"      gainM: {r['gainM']},\n"
                f"      line: [\n" + ",\n".join(rows) + ",\n      ],\n"
                f"    }},\n"
            )
        chunks.append("  ],\n")
    chunks.append("};\n")

    path = os.path.join(REPO, "lib", "routes.ts")
    with open(path, "w") as f:
        f.write("".join(chunks))
    # Count what was written, not what was read: routes.json also holds lines for
    # peaks that are routed but not yet published, and reporting those as shipped
    # is how a tour looks live when it is not.
    n = sum(len(r["points"]) for recs in written.values() for r in recs)
    total = sum(len(recs) for recs in written.values())
    held = len(routes) - len(written)
    print(
        f"wrote {path}: {len(written)} tours, {total} routes, {n} points, "
        f"{os.path.getsize(path)/1024:.0f} KB"
        + (f" ({held} routed but unpublished tours left out)" if held else "")
    )


if __name__ == "__main__":
    main()
