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
import os
import sys

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
TIE_M = 2.0
SAME_TOP_M = 200.0

# Peaks where the register point cannot say which top the tour goes to, and a
# published route can. The seed replaces the SSR representation point for the
# disc search and for the tie-break in `resolve_top` — nothing else changes, and
# a peak not listed here is resolved exactly as before.
#
# This is a table rather than a rule because the rule it would replace is right
# almost everywhere. `resolve_top` breaks a height tie by distance from the
# register point, and that is the evidence that settled Ranten. It cannot settle
# a mountain whose register point sits between two of its own tops.
SUMMIT_SEED = {
    # Two tops on the Hallingskarvet plateau, 650 m apart, climbing to 1860.4 and
    # 1857.5 m. Against a published 1859 they land 1.4 and 1.5 m off, which is a
    # tie by any reading, and the register point is 198 m from the lower one and
    # 550 m from the higher — so the tie-break handed the tour to the lower top.
    # Ut.no's ski line ends 20 m from the higher one and 660 m from the lower,
    # and the register knows no other Fjell or Topp name within 2 km of either.
    # The seed is that line's last vertex.
    "prestholtskarvet": (60.55829, 8.01297),
    # Tverrfjellet above Melåa in Kvæfjord carries no register name on its
    # summit: SSR's nearest Tverrfjellet entries sit in Sortland, Lødingen and
    # Tjeldsund, 12–20 km away on other mountains. The name is the source's and
    # the neighbourhood's — Tverrfjellelva drains the mountain and Tverrelvfoten
    # (the 581 m Ås the route passes west of) sits under it. Two tops answer:
    # a 921.9 m knoll 2.9 km north-east of Tverrelvfoten, and this 888.8 m top
    # 1.6 km due north of it — separated by a col the DTM reads at ~576 m, so
    # they are separate mountains, not shoulder and summit. The route says
    # «rett opp mot toppen» from west of Tverrelvfoten, and straight up is this
    # one; the published 899 is its pre-scan figure (the Rørnestinden class).
    "tverrfjellet": (68.70180, 16.13526),
    # Fiskefjordtindan is a ridge with two tops 876 m apart: the register point
    # sits on the northern one, which the scan reads at 998.9, while Fri Flyt
    # publishes 967 — and the southern top climbs to 964.2, within 3 m of the
    # published figure. The route from Kanstadbotn reaches the southern top
    # first and its «ridge east to the summit» finishes there; the register
    # point names the massif, not the tour.
    "fiskefjordtindan": (68.53225, 16.01086),
    # «Tredje Svanfjell» is not a register name at all — the Svanfjella are
    # numbered informally, and the register's Svanfjellet (Fjell) sits 2,2 km
    # south-east on another top. Fri Flyt publishes a GPS summit position
    # (UTM33 594798.7/7689615.18) that reads 897,8 in DTM1 against a published
    # 898; that position is the seed, the Kjølen rule again.
    "tredje-svanfjell": (69.29947, 17.40356),
}

# Peaks whose named top is a shoulder on a ridge that keeps rising, where an
# unconstrained climb walks off the mountain the tour goes to. The value is how
# far from the seed the summit is allowed to sit, in metres.
#
# This is the opposite failure to SUMMIT_SEED's. There the register point could
# not say which of two tops the name belongs to; here it says exactly that, and
# the terrain model has no top to offer — the ground under the name is convex in
# seven directions and rises in the eighth, all the way to the next mountain.
# Hill-climbing has nothing to stop it, so it returns whatever the tile edge
# happens to be. A cap says out loud that the summit is the named point rather
# than pretending a local maximum was found.
SUMMIT_CAP_M = {
    # Rødtinden's register point reads 469.5 m and Fri Flyt publishes 470 with a
    # GPS position 3 m away; ut.no's own line ends 8 m from it. The ground falls
    # away on every bearing but 315, where it rises without a saddle to 491 m at
    # 600 m out and on to Storbogtinden. The climb stopped at 488.2 m at 263 m
    # out — not a summit, just where a 700 m tile ran out. Capped to 150 m, which
    # keeps the rounded top the name and both published lines agree on.
    "rodtinden": 150.0,
    # Togga is the same shape at 1205 m: the register point reads 1202.6 against
    # Fri Flyt's published 1205, and the ridge rises west-south-west without a
    # saddle — 1235.5 at 280 m, 1282.5 at 590 m, 1354.0 at 990 m and on toward
    # the higher massif. The uncapped climb stored 1235.5, which is a bump on
    # the connected ridge, not the named top the tour goes to. Capped to 150 m.
    "togga": 150.0,
}


def _seed_dem(lat, lng):
    half_lat = SPAN_M / 2 / 110540.0
    half_lng = SPAN_M / 2 / (111320.0 * math.cos(math.radians(lat)))
    key = f"peak_{lat:.5f}_{lng:.5f}_{SPAN_M}"
    return Dem(
        dem_tile(key, lng - half_lng, lat - half_lat, lng + half_lng, lat + half_lat, 700, 700)
    )


def snap_candidates(lat, lng):
    """The highest DTM cell in each of a series of growing discs.

    One candidate per radius, deduplicated: once the real top is inside the disc
    every larger radius returns the same cell, so a peak usually yields two or
    three distinct places to look at rather than six.
    """
    dem = _seed_dem(lat, lng)
    rows = np.arange(dem.height)[:, None]
    cols = np.arange(dem.width)[None, :]
    r0, c0 = dem.rc(lat, lng)
    dist = np.hypot((rows - r0) * dem.my, (cols - c0) * dem.mx)

    out = []
    for radius in (300, 600, 900, 1200, 1500, 2000):
        z = np.where(dist <= radius, dem.z, np.nan)
        if np.all(np.isnan(z)):
            continue
        idx = int(np.nanargmax(z))
        row, col = divmod(idx, dem.width)
        slat, slng = dem.latlng(row, col)
        if any(haversine(slat, slng, a, b) < 20 for a, b, _, _ in out):
            continue
        out.append((slat, slng, float(dem.z[row, col]), radius))
    return out


def hill_climb(lat, lng, span_m=700, px=700):
    """Walk uphill to the exact local top.

    Run *after* `snap_candidates`, never instead of it: starting from a point
    already high on the right massif, this only sharpens the position, whereas
    climbing straight from an SSR point stalls on the first shoulder above a
    saddle.
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


def resolve_top(lat, lng, expect):
    """The local top whose height comes closest to the elevation the tour claims.

    Every candidate is hill-climbed *before* it is judged, and that ordering is
    the whole point. Judging the disc maxima instead gets two things wrong in
    opposite directions:

    - It stopped at the first disc whose maximum was within `TOL_M`, which is how
      Folarskardnuten ended up on a subsidiary top: 1927.3 m at 311 m out is
      inside 15 m of the claimed 1933, so the search returned it and never grew
      far enough to see the real summit, 1931.7 m at 647 m.
    - Simply preferring the closest disc maximum instead moves Skåla 50 m onto a
      1851.4 m cell — Skålatårnet, the stone tower on the top — where climbing
      from the smaller disc's maximum reaches the 1847.1 m ground the guidebooks
      call 1848. The highest cell in a wide disc is exactly where a structure or
      a noise spike sits.

    Climbing first and comparing after gets both right, and still refuses a
    taller neighbour: Steindalsnosi climbs to 2023.8 m against a claimed 2025,
    and Fannaråki at 2067 m never comes close enough to win.

    When two climbed tops are a different mountain each and match the claim
    equally well, the nearer one wins. Ranten is why: its own top reads 1415.6 m
    at 34 m from the register point and a top on the Gråfjell massif 1.5 km away
    reads 1415.9 m, so against a claimed 1419 the neighbour won by three tenths of
    a metre and the tour was moved onto a mountain it is not. Height alone cannot
    separate two candidates that agree to within the accuracy of a published
    figure; the register point can, because it is the one piece of evidence that
    says which mountain carries the name.

    Two candidates within `SAME_TOP_M` of each other are the same summit seen
    from two discs, and there the height decides as before — otherwise
    Folarskardnuten's top moves 22 m onto a cell 0.7 m lower, which is a settled
    coordinate changed for no reason.
    """
    best = None
    for slat, slng, _, radius in snap_candidates(lat, lng):
        flat, flng, fz = hill_climb(slat, slng)
        if best is None:
            best = (flat, flng, fz, radius)
            continue
        delta, best_delta = abs(fz - expect), abs(best[2] - expect)
        # A tie is anything inside TIE_M: a published summit height is rounded to
        # the metre at best, so a smaller difference than that is not evidence.
        tied = (
            abs(delta - best_delta) <= TIE_M
            and haversine(flat, flng, best[0], best[1]) > SAME_TOP_M
        )
        if tied:
            if haversine(lat, lng, flat, flng) < haversine(lat, lng, best[0], best[1]):
                best = (flat, flng, fz, radius)
        elif delta < best_delta:
            best = (flat, flng, fz, radius)
    return best


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
    # `resolve_summits.py [slug …]` resolves only those peaks and merges them
    # into the existing summits.json. Same reasoning as generate_routes.py's slug
    # argument: every peak costs a 4.2 km DTM tile and a hill-climb tile on top,
    # so re-resolving 57 settled summits to add one is a few hundred megabytes
    # spent reproducing coordinates that are already in the file.
    only = set(sys.argv[1:])
    out = json.load(open("summits.json")) if only and os.path.exists("summits.json") else {}
    problems = []
    for slug, name, kommuner, expect, nlat, nlng in PEAKS:
        if only and slug not in only:
            continue
        cands = pick(name, kommuner, nlat, nlng)
        if not cands:
            problems.append(f"{slug}: no SSR match for {name!r}")
            continue
        _, d_near, best = cands[0]

        # The climbed height stands even where it is lower than the disc maximum
        # that seeded it: the climb reads a 1 m tile and the disc a 6 m one, so
        # the lower number is the better measurement, not a lost summit.
        seed_lat, seed_lng = SUMMIT_SEED.get(slug, (best["lat"], best["lng"]))
        cap = SUMMIT_CAP_M.get(slug)
        if cap:
            # The tile *is* the cap: hill_climb never leaves the span it is given,
            # so a 2·cap tile centred on the seed returns the highest ground
            # within cap metres of the named point and nothing beyond it.
            flat, flng, fz = hill_climb(seed_lat, seed_lng, span_m=2 * cap, px=int(2 * cap))
            radius = int(cap)
        else:
            flat, flng, fz, radius = resolve_top(seed_lat, seed_lng, expect)
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
