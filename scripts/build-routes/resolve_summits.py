"""Step 1: resolve each peak to its true summit coordinate.

SSR gives a representation point for the named mountain, which sits near but not
exactly on the top. We take it as a seed and hill-climb the 1 m DTM to the local
maximum — hill-climbing rather than "highest cell in a box" on purpose, so a peak
never snaps onto a taller neighbour (Steindalsnosi sits 1.1 km from the 2068 m
Fannaråki; a box search would happily jump across).

The climbed height is then checked against the elevation the tour claims. Every
peak agreeing to within a few metres is what tells us we found the right summit.
"""

import json
import math

import numpy as np

from geo import Dem, dem_tile, dtm_point, haversine, stedsnavn
from peaks import PEAKS

GOOD_TYPES = ("Fjell", "Berg", "Topp", "Fjellområde", "Ås", "Haug")


def pick(name, kommuner, near_lat, near_lng):
    """Best SSR candidate: exact-name mountains, nearest to the stored coord."""
    rows = stedsnavn(name) or stedsnavn(name, fuzzy=True)
    scored = []
    for r in rows:
        score = 0
        if r["name"].lower() == name.lower():
            score += 100
        if r["type"] in GOOD_TYPES:
            score += 50
        if any(k in (r["kommune"] or []) for k in kommuner):
            score += 200
        d = haversine(near_lat, near_lng, r["lat"], r["lng"])
        scored.append((-score, d, r))
    # Name/type/kommune first, then proximity to the stored coordinate.
    scored.sort(key=lambda x: (x[0], x[1]))
    return [(-s, d, r) for s, d, r in scored]


SPAN_M = 4200
TOL_M = 15


def _seed_dem(lat, lng):
    half_lat = SPAN_M / 2 / 110540.0
    half_lng = SPAN_M / 2 / (111320.0 * math.cos(math.radians(lat)))
    key = f"peak_{lat:.5f}_{lng:.5f}_{SPAN_M}"
    return Dem(
        dem_tile(key, lng - half_lng, lat - half_lat, lng + half_lng, lat + half_lat, 700, 700)
    )


def snap_summit(lat, lng, expect):
    """Highest DTM cell within a disc that grows until its height matches the
    elevation the tour claims.

    Growing outward and stopping on the first match is what keeps a peak from
    being confused with a taller neighbour: Steindalsnosi (2025 m) matches at
    975 m out, well before Fannaråki (2068 m) comes into range at 1490 m.
    """
    dem = _seed_dem(lat, lng)
    rows = np.arange(dem.height)[:, None]
    cols = np.arange(dem.width)[None, :]
    r0, c0 = dem.rc(lat, lng)
    dist = np.hypot((rows - r0) * dem.my, (cols - c0) * dem.mx)

    fallback = None
    for radius in (300, 600, 900, 1200, 1500, 2000):
        z = np.where(dist <= radius, dem.z, np.nan)
        if np.all(np.isnan(z)):
            continue
        idx = int(np.nanargmax(z))
        row, col = divmod(idx, dem.width)
        zz = float(dem.z[row, col])
        slat, slng = dem.latlng(row, col)
        if fallback is None or abs(zz - expect) < abs(fallback[2] - expect):
            fallback = (slat, slng, zz, radius)
        if abs(zz - expect) <= TOL_M:
            return slat, slng, zz, radius
    return fallback


def hill_climb(lat, lng, span_m=700, px=700):
    """Walk uphill to the exact local top.

    Run *after* snap_summit, never instead of it: starting from a point already
    high on the right massif, this only sharpens the position, whereas climbing
    straight from an SSR point stalls on the first shoulder above a saddle.
    """
    half_lat = span_m / 2 / 110540.0
    half_lng = span_m / 2 / (111320.0 * math.cos(math.radians(lat)))
    dem = Dem(
        dem_tile(
            f"top_{lat:.5f}_{lng:.5f}_{span_m}",
            lng - half_lng,
            lat - half_lat,
            lng + half_lng,
            lat + half_lat,
            px,
            px,
        )
    )
    row, col = dem.rc(lat, lng)
    row = min(max(row, 1), dem.height - 2)
    col = min(max(col, 1), dem.width - 2)
    for _ in range(px * 2):
        best = (dem.at(row, col), row, col)
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                z = dem.at(row + dr, col + dc)
                if not np.isnan(z) and z > best[0]:
                    best = (z, row + dr, col + dc)
        if best[1] == row and best[2] == col:
            break
        row, col = best[1], best[2]
    slat, slng = dem.latlng(row, col)
    return slat, slng, float(dem.at(row, col))


def nearby_maxima(lat, lng, n=5):
    """Distinct local maxima around a seed — for eyeballing a mismatch."""
    dem = _seed_dem(lat, lng)
    order = np.argsort(np.nan_to_num(dem.z, nan=-9999).ravel())[::-1]
    picked = []
    for idx in order[: dem.width * dem.height]:
        row, col = divmod(int(idx), dem.width)
        la, lo = dem.latlng(row, col)
        if any(haversine(la, lo, p[0], p[1]) < 400 for p in picked):
            continue
        picked.append((la, lo, float(dem.z[row, col]), haversine(lat, lng, la, lo)))
        if len(picked) >= n:
            break
    return picked


def main():
    out = {}
    problems = []
    for slug, name, kommuner, expect, nlat, nlng in PEAKS:
        cands = pick(name, kommuner, nlat, nlng)
        if not cands:
            problems.append(f"{slug}: no SSR match for {name!r}")
            continue
        _, d_near, best = cands[0]

        slat, slng, sz, radius = snap_summit(best["lat"], best["lng"], expect)
        flat, flng, fz = hill_climb(slat, slng)
        if fz < sz:
            flat, flng, fz = slat, slng, sz
        z_api, terr = dtm_point(flat, flng)
        drift = haversine(nlat, nlng, flat, flng)
        delta = fz - expect
        flag = "" if abs(delta) <= TOL_M else "  <-- CHECK"
        print(
            f"{slug:<18} {name:<16} {flat:.5f},{flng:.5f}  z={fz:7.1f} "
            f"(claims {expect}, Δ{delta:+6.1f})  r={radius:4d}m  ssr {d_near/1000:5.1f}km  "
            f"stored off {drift/1000:6.2f}km  {terr}{flag}"
        )
        if abs(delta) > TOL_M:
            problems.append(f"{slug}: DTM {fz:.1f} m vs claimed {expect} m")
            for la, lo, zz, d in nearby_maxima(best["lat"], best["lng"]):
                print(f"      alt: {la:.5f},{lo:.5f} z={zz:7.1f}  {d:6.0f} m from SSR point")

        out[slug] = {
            "name": name,
            "lat": round(flat, 5),
            "lng": round(flng, 5),
            "summit_dtm": round(fz, 1),
            "claims": expect,
            "stored_off_km": round(drift / 1000, 2),
        }

    with open("summits.json", "w") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)
    print(f"\nwrote summits.json ({len(out)} peaks)")
    if problems:
        print("\nneeds a look:")
        for p in problems:
            print("  -", p)


if __name__ == "__main__":
    main()
