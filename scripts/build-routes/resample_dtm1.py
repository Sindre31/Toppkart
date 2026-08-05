"""Re-read every vertex elevation in routes.json straight from DTM1.

`generate_routes.py` solves the line over a *downsampled* DTM — a few metres per
cell — because Dijkstra over a 1 m grid for a ten-kilometre corridor is not a
thing you run. That resolution is right for finding a way up and wrong for
saying how steep it is: the grid rounds the corners off a step, and a couple of
metres of error over a 30 m baseline is a dozen degrees.

Folarskardnuten is the case that showed it. Vertex by vertex the stored profile
is within ±6 m of DTM1 and averages −0.4 m — it looks fine. Its steepest 30 m
window reads 25.5° stored and 38.3° measured, and the guide written from it told
the reader a 40-degree step was a 25-degree one.

So the geometry stays as routed and only the elevations are re-read, at every
vertex, from the same 1 m model the guides quote. The two ends keep their pinned
values — the trailhead from the corridor research, the summit from summits.json —
because those are the two points a reader recognises and they were resolved
deliberately.

Run after `routes_from_ts.py` (or `generate_routes.py`) and before `emit_ts.py`.
"""

import json
import math
import os
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from geo import haversine
from router import steepest_gradient

# The point API answers in about 1.3 s, so the whole job is latency, not work.
# Sixteen in flight reads roughly nine a second; more is rude for the gain.
WORKERS = 16
CACHE = os.path.join(os.path.dirname(__file__), "cache", "dtm1_points.json")


def load_cache():
    if os.path.exists(CACHE):
        return json.load(open(CACHE))
    return {}


def point_z(lat, lng, tries=4):
    url = (f"https://ws.geonorge.no/hoydedata/v1/punkt"
           f"?koordsys=4258&nord={lat}&ost={lng}&geojson=false")
    for i in range(tries):
        try:
            d = json.loads(urllib.request.urlopen(url, timeout=30).read())
            return d["punkter"][0]["z"]
        except Exception:  # noqa: BLE001
            time.sleep(1.5 * (i + 1))
    return None


def resample(routes, cache):
    """Every vertex of every route, read from DTM1. Cached by rounded coordinate."""
    wanted = []
    for recs in routes.values():
        for r in recs:
            for lat, lng in r["points"]:
                key = f"{lat:.5f},{lng:.5f}"
                if key not in cache:
                    wanted.append((key, lat, lng))
    wanted = list({k: (k, a, b) for k, a, b in wanted}.values())
    print(f"{len(wanted)} vertices to read from DTM1 "
          f"({sum(len(r['points']) for v in routes.values() for r in v)} total, rest cached)")

    done = 0
    with ThreadPoolExecutor(WORKERS) as ex:
        for (key, lat, lng), z in zip(wanted, ex.map(lambda w: point_z(w[1], w[2]), wanted)):
            if z is not None:
                cache[key] = z
            done += 1
            if done % 500 == 0:
                print(f"  {done}/{len(wanted)}", flush=True)
                json.dump(cache, open(CACHE, "w"))
    json.dump(cache, open(CACHE, "w"))
    return cache


def main():
    routes = json.load(open("routes.json"))
    corridors = json.load(open("corridors.json"))
    summits = json.load(open("summits.json"))
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    cache = resample(routes, load_cache())

    missing = 0
    print(f"\n{'tour':<18}{'route':<14}  gain          loss      steepest 30 m")
    for slug, recs in routes.items():
        by_id = {r["id"]: r for r in corridors[slug]["routes"]}
        for r in recs:
            pts = [tuple(p) for p in r["points"]]
            old_zs = r["elevations"]
            zs = []
            for (lat, lng), fallback in zip(pts, old_zs):
                z = cache.get(f"{lat:.5f},{lng:.5f}")
                if z is None:
                    missing += 1
                zs.append(float(z) if z is not None else float(fallback))

            # The ends stay where they were deliberately put.
            th = (by_id.get(r["id"]) or {}).get("trailhead") or {}
            if th.get("elevation_m") is not None:
                zs[0] = float(th["elevation_m"])
            if summits.get(slug, {}).get("summit_dtm") is not None:
                zs[-1] = float(summits[slug]["summit_dtm"])

            zs = [int(round(z)) for z in zs]
            gain = sum(max(0, b - a) for a, b in zip(zs, zs[1:]))
            loss = sum(max(0, a - b) for a, b in zip(zs, zs[1:]))
            ang = round(steepest_gradient(pts, zs), 1)
            print(f"{slug:<18}{r['id']:<14}  {r['gainM']:>5} -> {gain:<5}  "
                  f"{r['lossM']:>3} -> {loss:<4}  {r['maxAngle']:>5} -> {ang}")
            r["elevations"] = zs
            r["gainM"] = gain
            r["lossM"] = loss
            r["maxAngle"] = ang
            r["minZ"] = round(float(min(zs)), 1)

    json.dump(routes, open("routes.json", "w"), ensure_ascii=False)
    print(f"\nwrote routes.json — {missing} vertices kept their routed value "
          f"because DTM1 did not answer")


if __name__ == "__main__":
    main()
