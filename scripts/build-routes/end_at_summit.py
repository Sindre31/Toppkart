"""End a line at its tour's summit when the summit moved onto ground the line already crosses.

When `resolve_summits.py` moves a top to a point the shipped line passes on its
way to the old one, re-solving the route would throw away a reviewed line to
reproduce its first part. This keeps the line as it is up to the vertex
nearest the new summit, drops whatever sits inside the generator's
`SUMMIT_LEG_MIN_M` of it — the same rule `generate_routes.build()` applies, so
the last leg comes in straight from the side the line climbed — and pins the
summit from `summits.json` as the final vertex.

Bånsæterkampen is the case that needed it: the line crossed the 1202.4 m top
890 m before the 1196.1 m one the card used to name.

    python3 end_at_summit.py <slug> <route-id>
"""

import json
import sys

from cut_spurs import restate
from generate_routes import SUMMIT_LEG_MIN_M
from geo import haversine


def main():
    slug, rid = sys.argv[1], sys.argv[2]
    routes = json.load(open("routes.json"))
    s = json.load(open("summits.json"))[slug]
    r = next(x for x in routes[slug] if x["id"] == rid)
    pts = [tuple(p) for p in r["points"]]
    zs = list(r["elevations"])
    k = min(range(len(pts)), key=lambda i: haversine(*pts[i], s["lat"], s["lng"]))
    gap = haversine(*pts[k], s["lat"], s["lng"])
    before = (r["distanceM"], r["gainM"], len(pts))
    pts, zs = pts[: k + 1], zs[: k + 1]
    while len(pts) > 1 and haversine(*pts[-1], s["lat"], s["lng"]) < SUMMIT_LEG_MIN_M:
        pts.pop()
        zs.pop()
    pts.append((round(s["lat"], 5), round(s["lng"], 5)))
    zs.append(int(round(s["summit_dtm"])))
    r["points"], r["elevations"] = [list(p) for p in pts], zs
    restate(r)
    json.dump(routes, open("routes.json", "w"), ensure_ascii=False)
    print(
        f"{slug}/{rid}: passed {gap:.0f} m from the summit at v{k}; "
        f"{before[0]} m +{before[1]}, {before[2]} vertices → "
        f"{r['distanceM']} m +{r['gainM']}, {len(pts)} vertices, "
        f"last leg {haversine(*pts[-2], *pts[-1]):.0f} m from {zs[-2]} to {zs[-1]} m"
    )


if __name__ == "__main__":
    main()
