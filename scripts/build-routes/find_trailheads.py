"""Candidate trailheads: real roads and parking near each summit.

For every tour, ask OpenStreetMap for parking areas and drivable roads within
reach of the peak, read the terrain height at each, and rank by how well the
height matches the start elevation the tour's stated vertical gain implies. This
does not decide the route — it produces the shortlist a human picks from, with a
real road under every option.
"""

import json
import math
import os
import time
import urllib.parse
import urllib.request

from geo import dtm_point, haversine

# The main instance throws 504s under load; rotate mirrors rather than give up.
MIRRORS = [
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
]

ROAD_RE = "^(trunk|primary|secondary|tertiary|unclassified|residential|track|service)$"


def overpass(query, rounds=3):
    last = None
    for round_ in range(rounds):
        for url in MIRRORS:
            try:
                req = urllib.request.Request(
                    url,
                    data=urllib.parse.urlencode({"data": query}).encode(),
                    headers={"User-Agent": "toppkart-route-build/1.0"},
                )
                return json.loads(urllib.request.urlopen(req, timeout=180).read())
            except Exception as e:  # noqa: BLE001
                last = e
                time.sleep(3)
        time.sleep(10 * (round_ + 1))
    raise RuntimeError(f"all Overpass mirrors failed: {last}")


def candidates(lat, lng, radius_m):
    q = f"""[out:json][timeout:180];
(
  nwr(around:{radius_m},{lat},{lng})["amenity"="parking"];
  way(around:{radius_m},{lat},{lng})["highway"~"{ROAD_RE}"];
);
out center 400;"""
    d = overpass(q)
    out = []
    for el in d.get("elements", []):
        c = el.get("center") or ({"lat": el.get("lat"), "lon": el.get("lon")})
        if c.get("lat") is None:
            continue
        tags = el.get("tags") or {}
        kind = "P" if tags.get("amenity") == "parking" else tags.get("highway", "?")
        out.append(
            {
                "lat": c["lat"],
                "lng": c["lon"],
                "kind": kind,
                "name": tags.get("name") or tags.get("ref") or "",
            }
        )
    return out


PARTIAL = "trailhead_candidates.partial.json"


def main():
    summits = json.load(open("summits.json"))
    tours = json.load(open("tourmeta.json"))
    # Resume: a 504 storm mid-run should not cost the tours already done.
    result = {}
    if os.path.exists(PARTIAL):
        result = json.load(open(PARTIAL))
        print(f"resuming — {len(result)} tours already resolved")

    for slug, s in summits.items():
        if slug in result:
            continue
        meta = tours[slug]
        want = s["summit_dtm"] - meta["verticalM"]
        best = []
        try:
            for radius in (5000, 9000, 14000):
                cands = candidates(s["lat"], s["lng"], radius)
                if len(cands) >= 12 or radius == 14000:
                    break
        except Exception as e:  # noqa: BLE001
            print(f"!! {slug}: Overpass unavailable — {e}")
            continue
        # Sample terrain at a spread of candidates, cheapest-first by promise:
        # near the peak and roughly the right height.
        cands.sort(key=lambda c: haversine(s["lat"], s["lng"], c["lat"], c["lng"]))
        seen = []
        for c in cands:
            if any(haversine(c["lat"], c["lng"], p[0], p[1]) < 500 for p in seen):
                continue
            seen.append((c["lat"], c["lng"]))
            if len(seen) > 26:
                break
            z, terr = dtm_point(c["lat"], c["lng"])
            if z is None or z < 0.4:
                continue
            d = haversine(s["lat"], s["lng"], c["lat"], c["lng"])
            best.append(
                {
                    **c,
                    "z": round(z, 1),
                    "terreng": terr or "?",
                    "dist_km": round(d / 1000, 2),
                    "dz_vs_expected": round(z - want, 1),
                }
            )
        best.sort(key=lambda c: (abs(c["dz_vs_expected"]) / 60.0) + c["dist_km"] / 4.0)
        result[slug] = {"want_start_m": round(want, 1), "candidates": best[:8]}
        with open(PARTIAL, "w") as f:
            json.dump(result, f, ensure_ascii=False)

        print(f"\n=== {slug}  summit {s['summit_dtm']} m, vertical {meta['verticalM']} m "
              f"-> start should be near {want:.0f} m")
        for c in best[:8]:
            print(f"   {c['kind']:<12} z={c['z']:>7.1f} (Δ{c['dz_vs_expected']:+7.1f})  "
                  f"{c['dist_km']:>5.2f} km  {c['lat']:.5f},{c['lng']:.5f}  "
                  f"{c['terreng']:<14} {c['name']}")

    with open("trailhead_candidates.json", "w") as f:
        json.dump(result, f, indent=1, ensure_ascii=False)
    print("\nwrote trailhead_candidates.json")


if __name__ == "__main__":
    main()
