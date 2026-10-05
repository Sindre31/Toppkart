"""The vertical every card and guide quotes, re-read every 5 m along the line.

Every height in `lib/routes.ts` is DTM1 at a vertex — `resample_dtm1.py` reads
them from Kartverket's point API — and `gainM` is the sum of the rises between
consecutive vertices, about 45 m apart. The card's `verticalM` and every guide
intro quote that figure. What it cannot see is ground between two vertices:
the shape round's every-eighth-vertex re-read found Fanaråken's Turtagrø line
riding 14–27 m under a moraine bump for five vertices, which is exactly a hill
the vertex sum walked past.

This check reads DTM1 every `STEP_M` along each line from 1 m WCS tiles
(`TILE_M` of line per request, so the catalogue is a few thousand requests
rather than a quarter of a million point lookups) and reports per route:

  vertex    the stored gainM — what the card and the guides quote
  dense2    cumulative ascent of the 5 m profile, counting a climb only once it
  dense5    has risen 2 m (5 m) above the last low — hysteresis, so a boulder
            or a hummock does not add a metre each time the line steps over it
  bump      the largest height by which the 5 m profile stands above (or
            below) the straight line between two vertices, and where

A route is listed when `dense5` exceeds `vertex` by more than `GAIN_TOL_M`
and `GAIN_TOL_PCT` together — ascent the vertex sum does not count — or when a
`bump` is larger than `BUMP_M`. Profiles are cached in cache/gain_dense/, and
the tiles are deleted once read.

    python3 check_gain.py [slug …]
"""

import json
import math
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np

from geo import Dem, dem_tile, haversine, _tile_path

STEP_M = 5.0
TILE_M = 200.0
MARGIN_M = 15.0
GAIN_TOL_M = 15.0
GAIN_TOL_PCT = 2.0
BUMP_M = 15.0
WORKERS = 8
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "cache", "gain_dense")


def samples(points, elevations):
    """(ground, lat, lng, vertex-interpolated z) every STEP_M, and the vertices' ground."""
    out, cum, vg = [], 0.0, [0.0]
    for (a, b), za, zb in zip(zip(points, points[1:]), elevations, elevations[1:]):
        d = haversine(a[0], a[1], b[0], b[1])
        n = max(1, int(d // STEP_M))
        for k in range(n):
            t = k / n
            out.append((cum + d * t, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t,
                        za + (zb - za) * t))
        cum += d
        vg.append(cum)
    out.append((cum, points[-1][0], points[-1][1], float(elevations[-1])))
    return out, vg


def bilinear(dem, lat, lng):
    fr = (lat - dem.lat0) / dem.dlat - 0.5
    fc = (lng - dem.lng0) / dem.dlng - 0.5
    r0, c0 = int(math.floor(fr)), int(math.floor(fc))
    if not (0 <= r0 < dem.height - 1 and 0 <= c0 < dem.width - 1):
        return None
    dr, dc = fr - r0, fc - c0
    q = dem.z[r0:r0 + 2, c0:c0 + 2]
    if np.isnan(q).any():
        return None
    return float(q[0, 0] * (1 - dr) * (1 - dc) + q[0, 1] * (1 - dr) * dc
                 + q[1, 0] * dr * (1 - dc) + q[1, 1] * dr * dc)


def read_chunk(key, chunk):
    lats = [s[1] for s in chunk]
    lngs = [s[2] for s in chunk]
    lat0 = sum(lats) / len(lats)
    mlat = MARGIN_M / 111320
    mlng = MARGIN_M / (111320 * math.cos(math.radians(lat0)))
    minlat, maxlat = min(lats) - mlat, max(lats) + mlat
    minlng, maxlng = min(lngs) - mlng, max(lngs) + mlng
    w = max(8, int(math.ceil((maxlng - minlng) * 111320 * math.cos(math.radians(lat0)))))
    h = max(8, int(math.ceil((maxlat - minlat) * 111320)))
    for attempt in range(3):
        try:
            path = dem_tile(key, minlng, minlat, maxlng, maxlat, w, h)
            dem = Dem(path)
            os.remove(path)
            return [bilinear(dem, s[1], s[2]) for s in chunk]
        except Exception:  # noqa: BLE001 — WCS drops connections under load
            p = _tile_path(key)
            if os.path.exists(p):
                os.remove(p)
    return [None] * len(chunk)


def profile(slug, r):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{slug}__{r['id']}.json")
    sm, vg = samples(r["points"], r["elevations"])
    if os.path.exists(path):
        got = json.load(open(path))
        if len(got) == len(sm):
            return sm, vg, got
    chunks, cur = [], []
    for s in sm:
        if cur and s[0] - cur[0][0] > TILE_M:
            chunks.append(cur)
            cur = []
        cur.append(s)
    chunks.append(cur)
    with ThreadPoolExecutor(WORKERS) as ex:
        parts = list(ex.map(lambda ic: read_chunk(f"gain_{slug}_{r['id']}_{ic[0]}", ic[1]), enumerate(chunks)))
    z = [v for part in parts for v in part]
    # The ends are pinned, as everywhere else in the pipeline.
    z[0], z[-1] = float(r["elevations"][0]), float(r["elevations"][-1])
    json.dump(z, open(path, "w"))
    return sm, vg, z


def hysteresis_gain(zs, h):
    gain, low, high, rising = 0.0, zs[0], zs[0], None
    for z in zs[1:]:
        if rising is not False:
            if z > high:
                high = z
            elif high - z >= h:
                gain += high - low if rising else 0.0
                low, rising = z, False
                high = z
                continue
        if rising is not True:
            if z < low:
                low = z
            elif z - low >= h:
                rising, high = True, z
    if rising:
        gain += high - low
    return gain


def main():
    only = set(sys.argv[1:])
    routes = json.load(open(os.path.join(HERE, "routes.json")))
    flagged = 0
    print(f"{'route':<34}{'vertex':>7}{'dense2':>8}{'dense5':>8}  bump")
    for slug, recs in routes.items():
        if only and slug not in only:
            continue
        for r in recs:
            sm, vg, z = profile(slug, r)
            pairs = [(s, v) for s, v in zip(sm, z) if v is not None]
            missing = len(sm) - len(pairs)
            zs = [v for _, v in pairs]
            d2, d5 = hysteresis_gain(zs, 2.0), hysteresis_gain(zs, 5.0)
            dev = [(v - s[3], s[0], v) for s, v in pairs]
            up = max(dev, key=lambda x: x[0])
            dn = min(dev, key=lambda x: x[0])
            worst = up if abs(up[0]) >= abs(dn[0]) else dn
            notes = []
            extra = d5 - r["gainM"]
            if extra > GAIN_TOL_M and extra > r["gainM"] * GAIN_TOL_PCT / 100:
                notes.append(f"{extra:.0f} m of ascent the vertex sum does not count")
            if abs(worst[0]) > BUMP_M:
                notes.append(f"ground {worst[0]:+.0f} m off the vertex line at {worst[1]:.0f} m out ({worst[2]:.0f} m)")
            if missing:
                notes.append(f"{missing} samples unread")
            if notes:
                flagged += 1
            if notes or only:
                print(f"{slug + '/' + r['id']:<34}{r['gainM']:>7}{d2:>8.0f}{d5:>8.0f}  "
                      f"{worst[0]:+.0f} m @ {worst[1]:.0f}  {'; '.join(notes)}", flush=True)
    print(f"\n{flagged} routes to look at")
    return 1 if flagged else 0


if __name__ == "__main__":
    sys.exit(main())
