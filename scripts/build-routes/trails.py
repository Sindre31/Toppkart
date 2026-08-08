"""Mapped trails around each route, from OpenStreetMap.

The routes in `lib/routes.ts` are solved over the terrain model alone. That is
the right way to find a *skinnable* line — the terrain model knows where the
cliffs and the terrain traps are, and no trail database does — but it is blind
to the one thing every reader has on the screen next to it: the path drawn on
an ordinary map. Where a summer trail exists and is skiable, the line ought to
be on it, because that is where the boot pack, the signposts and everybody
else's track are.

So: fetch what an ordinary map draws, and hand it to `check_trails.py` to
measure against, and to `router.py` as a discount so the solver can prefer it.

What counts as «the path you see on a normal map»:

  highway=path / footway / track / bridleway / steps
      The N50 «sti» and «traktorveg» classes, essentially. Norwegian OSM is
      dense here — DNT's marked network and the municipal trails are in it.
  piste:type=skitour
      Ski touring routes proper. Rarer, but when present it is exactly the
      line this project is trying to draw, mapped by someone who skied it.

Deliberately *not* included: roads (`highway=residential` and up). A driveable
road near the trailhead is not a route decision, and pulling the line onto one
would only widen the corridor at the bottom where it is already right.

Cached per tour under `cache/`, keyed on the bounding box, so re-running the
checker costs nothing and the Overpass instance is asked once.
"""

import json
import math
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

CACHE = os.path.join(os.path.dirname(__file__), "cache")
os.makedirs(CACHE, exist_ok=True)

# Kumi first, and kumi again on the retry. The main instance answers these
# bboxes with a 504 under load about as often as it answers them at all — a
# whole-valley path query is not a small ask — while kumi returns the same 95 kB
# in nine seconds and reports «Rate limit: 0», meaning it does not meter us.
#
# The list started as a plain alternation between the two, which sounds like
# resilience and was the opposite: every other attempt went to the endpoint that
# was not going to answer, and each of those cost its own backoff before the
# next real try. The fallback is worth keeping for the day kumi is the one that
# is down, so it stays — as the last resort rather than as every second turn.
ENDPOINTS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
]

# Six in flight. The work is entirely the remote instance's, so this is about
# not leaving the link idle between answers rather than about local parallelism.
# Six is what the endpoint's own status page says it will take without metering;
# it is not a number to raise past what that page reports.
WORKERS = 6

# How far outside the route's own extent to look. A line that is 300 m off the
# trail still has to *find* the trail, and 500 m is far enough to see it while
# staying inside the valley the route uses.
PAD_M = 500.0

# Fetched, then dropped on the way back out. A sherpa staircase is mapped like
# any other path and is the one kind of «trail» a ski line must not be pulled
# onto: it is built at an angle no one skins, and where it exists there is
# always an ordinary path beside it that the discount should prefer instead.
# Filtered on read rather than in the query so the cache stays a faithful copy
# of what OSM answered — the rule is ours, not Overpass's.
SKIP_KINDS = {"steps"}

QUERY = """[out:json][timeout:180];
(
  way["highway"~"^(path|footway|track|bridleway|steps)$"]({s:.5f},{w:.5f},{n:.5f},{e:.5f});
  way["piste:type"="skitour"]({s:.5f},{w:.5f},{n:.5f},{e:.5f});
);
out geom;
"""


def bbox_of(points, pad_m=PAD_M):
    lats = [p[0] for p in points]
    lngs = [p[1] for p in points]
    midlat = (min(lats) + max(lats)) / 2
    dlat = pad_m / 110540.0
    dlng = pad_m / (111320.0 * math.cos(math.radians(midlat)))
    return (min(lats) - dlat, min(lngs) - dlng, max(lats) + dlat, max(lngs) + dlng)


def _post(url, body, timeout=240):
    req = urllib.request.Request(
        url,
        data=urllib.parse.urlencode({"data": body}).encode(),
        headers={"User-Agent": "toppkart-route-check/1.0 (+https://toppkart.no)"},
    )
    return json.loads(urllib.request.urlopen(req, timeout=timeout).read())


def fetch(bbox, key):
    """Trail ways inside `bbox`, as a list of lat/lng polylines."""
    path = os.path.join(CACHE, f"trails_{key}.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return [w for w in json.load(f) if w["kind"] not in SKIP_KINDS]

    s, w, n, e = bbox
    query = QUERY.format(s=s, w=w, n=n, e=e)
    last = None
    for attempt in range(6):
        url = ENDPOINTS[attempt % len(ENDPOINTS)]
        try:
            data = _post(url, query)
            break
        except Exception as err:  # noqa: BLE001
            last = err
            # Overpass answers 429/504 under load; backing off is the whole
            # protocol here, not an error path.
            time.sleep(5 * (attempt + 1))
    else:
        raise RuntimeError(f"overpass failed for {key}: {last}")

    ways = []
    for el in data.get("elements", []):
        geom = el.get("geometry") or []
        if len(geom) < 2:
            continue
        tags = el.get("tags") or {}
        ways.append(
            {
                "id": el.get("id"),
                "kind": tags.get("piste:type") or tags.get("highway") or "",
                "name": tags.get("name") or "",
                "line": [[round(p["lat"], 6), round(p["lon"], 6)] for p in geom],
            }
        )
    with open(path, "w", encoding="utf-8") as f:
        json.dump(ways, f, ensure_ascii=False)
    return [w for w in ways if w["kind"] not in SKIP_KINDS]


def main():
    routes = json.load(open(os.path.join(os.path.dirname(__file__), "routes.json"), encoding="utf-8"))
    only = set(sys.argv[1:])
    jobs = []
    for slug, recs in sorted(routes.items()):
        if only and slug not in only:
            continue
        for rec in recs:
            jobs.append((f"{slug}_{rec['id']}", bbox_of(rec["points"])))

    total = 0
    with ThreadPoolExecutor(WORKERS) as ex:
        for (key, _), ways in zip(jobs, ex.map(lambda j: fetch(j[1], j[0]), jobs)):
            total += len(ways)
            print(f"{key:<34}{len(ways):>4} trail ways", flush=True)
    print(f"\n{total} ways cached")


if __name__ == "__main__":
    main()
