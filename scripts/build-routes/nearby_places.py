"""Named places near a summit that imply road access, ranked against the start
elevation a tour's stated vertical implies. An Overpass-free fallback for picking
a trailhead when the routing agents have not covered a tour yet.
"""

import json
import urllib.parse

from geo import _get, dtm_point

ROADY = {
    "Gard", "Bruk", "Grend", "Setervoll", "Seter", "Turisthytte", "Bygdelag (bygd)",
    "Tettsted", "Bru", "Adressenavn", "Tettbebyggelse", "Hytte", "Campingplass",
    "Hotell", "Fjellstue", "Dal", "Dalføre", "Skytebane", "Parkeringsplass",
}

TARGETS = {
    "kirketaket": (62.61158, 7.90672, 59),
    "fanaraken": (61.51669, 7.90825, 1117),
    "steindalsnosi": (61.52696, 7.90076, 1404),
    "storehorn": (60.81506, 8.59566, 852),
    "kolastinden": (62.25886, 6.31102, 281),
    "rombakstotta": (68.43312, 17.58324, 131),
    "himmeltindan": (68.22041, 13.57328, -11),
    "skala": (61.86923, 6.97251, 7),
    "oksen": (60.45983, 6.68301, 1),
}


def punkt(lat, lng, radius=5000):
    out = []
    for side in (1, 2, 3):
        url = "https://ws.geonorge.no/stedsnavn/v1/punkt?" + urllib.parse.urlencode(
            {
                "nord": lat, "ost": lng, "koordsys": 4258, "radius": radius,
                "treffPerSide": 50, "side": side, "utkoordsys": 4258,
            }
        )
        try:
            d = json.loads(_get(url, timeout=90))
        except Exception:  # noqa: BLE001
            break
        rows = d.get("navn", [])
        if not rows:
            break
        for x in rows:
            p = x.get("representasjonspunkt") or {}
            if p.get("nord") is None:
                continue
            out.append(
                {
                    "name": (x.get("stedsnavn") or [{}])[0].get("skrivemåte", ""),
                    "type": x.get("navneobjekttype"),
                    "lat": p["nord"],
                    "lng": p["øst"],
                    "d": x.get("meterFraPunkt") or 0,
                }
            )
        if len(rows) < 50:
            break
    return out


def main():
    result = {}
    for slug, (la, lo, want) in TARGETS.items():
        print(f"\n=== {slug}  want start ~{want} m", flush=True)
        rows = [r for r in punkt(la, lo) if r["type"] in ROADY]
        scored = []
        seen = []
        for r in rows:
            if any(abs(r["lat"] - s[0]) < 0.004 and abs(r["lng"] - s[1]) < 0.01 for s in seen):
                continue
            seen.append((r["lat"], r["lng"]))
            z, terr = dtm_point(r["lat"], r["lng"])
            if z is None or z < 0.4:
                continue
            scored.append((abs(z - want) / 60.0 + r["d"] / 4000.0, r, z, terr))
        scored.sort(key=lambda x: x[0])
        result[slug] = [
            {**r, "z": round(z, 1), "terreng": terr, "dz": round(z - want, 1)}
            for _, r, z, terr in scored[:10]
        ]
        for _, r, z, terr in scored[:8]:
            print(
                f"   {r['name']:<20}{r['type']:<16}{r['lat']:.5f},{r['lng']:.5f} "
                f"z={z:8.1f} (Δ{z - want:+8.1f}) {r['d']:>5} m  {terr}",
                flush=True,
            )
    with open("nearby_places.json", "w") as f:
        json.dump(result, f, indent=1, ensure_ascii=False)
    print("\nwrote nearby_places.json")


if __name__ == "__main__":
    main()
