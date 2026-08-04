"""Rebuild routes.json from the emitted lib/routes.ts.

`generate_routes.py` is the source of the geometry, but it needs ten minutes and
a few hundred megabytes of DTM tiles to reproduce a line that is already tracked
in the repository. The steps that come *after* it — `guide_facts.py` and the
written guides — only need the finished line, and `lib/routes.ts` is exactly
that: trailhead, name, distance, cumulative gain, and every `lat, lng, elevation`
triplet the router emitted.

So when the guides are the thing being worked on rather than the geometry, this
reads the artefact back into the shape `guide_facts.py` expects. It derives
nothing the emitter dropped except the two figures that are pure arithmetic over
the elevations — `lossM`, the mirror of `gainM`, and `minZ` — plus `maxAngle`,
recomputed with `router.steepest_gradient` so it means the same thing here as in
`generate_routes.py`.

It is a fallback, not a substitute: it cannot change a route, only restate one.
Re-run `generate_routes.py` for anything that touches where a line goes.
"""

import json
import os
import re

from router import steepest_gradient, path_length_m

REPO = os.path.join(os.path.dirname(__file__), "..", "..")
TS = os.path.join(REPO, "lib", "routes.ts")

TOUR_RE = re.compile(r'^  "?([a-z0-9-]+)"?: \[$', re.M)
ROUTE_RE = re.compile(
    r'\{\s*id: "(?P<id>[^"]*)",\s*'
    r'name: "(?P<name>[^"]*)",\s*'
    r'trailhead: "(?P<trailhead>[^"]*)",\s*'
    r'distanceM: (?P<distanceM>\d+),\s*'
    r'gainM: (?P<gainM>\d+),\s*'
    r'line: \[(?P<line>[^\]]*)\],',
    re.S,
)


def parse():
    src = open(TS, encoding="utf-8").read()
    body = src[src.index("export const ROUTES"):]
    starts = [(m.group(1), m.start()) for m in TOUR_RE.finditer(body)]
    out = {}
    for i, (slug, pos) in enumerate(starts):
        end = starts[i + 1][1] if i + 1 < len(starts) else len(body)
        recs = []
        for m in ROUTE_RE.finditer(body[pos:end]):
            nums = [float(x) for x in m.group("line").replace("\n", " ").split(",") if x.strip()]
            if len(nums) % 3:
                raise SystemExit(f"{slug}/{m.group('id')}: line is not lat,lng,z triplets")
            pts = [(nums[j], nums[j + 1]) for j in range(0, len(nums), 3)]
            zs = [int(nums[j + 2]) for j in range(0, len(nums), 3)]
            recs.append(
                {
                    "id": m.group("id"),
                    "name": m.group("name"),
                    "trailheadName": m.group("trailhead"),
                    "points": pts,
                    "elevations": zs,
                    "distanceM": int(m.group("distanceM")),
                    "gainM": int(m.group("gainM")),
                    "lossM": int(round(sum(max(0, a - b) for a, b in zip(zs, zs[1:])))),
                    "maxAngle": round(steepest_gradient(pts, zs), 1),
                    "minZ": round(float(min(zs)), 1),
                }
            )
        if not recs:
            raise SystemExit(f"{slug}: no routes parsed")
        out[slug] = recs
    return out


def main():
    routes = parse()
    total = sum(len(v) for v in routes.values())
    for slug, recs in routes.items():
        p = recs[0]
        # The distance the emitter wrote and the distance the points measure are
        # the same number computed twice; if they disagree the parse is wrong.
        # A few metres of drift is the emitter's five-decimal rounding, ~1 m per
        # vertex at these latitudes; a parse error is off by kilometres.
        measured = path_length_m(p["points"])
        if abs(measured - p["distanceM"]) > 0.005 * p["distanceM"] + 10:
            raise SystemExit(
                f"{slug}: parsed line measures {measured:.0f} m, file says {p['distanceM']} m"
            )
    with open(os.path.join(os.path.dirname(__file__), "routes.json"), "w") as f:
        json.dump(routes, f, ensure_ascii=False)
    print(f"wrote routes.json from lib/routes.ts ({len(routes)} tours, {total} routes)")


if __name__ == "__main__":
    main()
