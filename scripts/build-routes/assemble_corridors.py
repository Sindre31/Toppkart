"""Assemble corridors.json.

Trailheads come from `trailhead_candidates.json` — real OSM roads and parking
near each peak, ranked by how well the terrain height matches the start elevation
the tour's stated vertical implies. `PICKS` overrides that ranking wherever the
right start is a named place the ranking would not find on its own, or where the
tour's own stated vertical is the thing that is wrong.

`WAYPOINTS` pins a corridor only where the router needs telling which way to go.
Left empty, the router picks the cheapest skinnable line between trailhead and
summit, which for a peak with one obvious flank is already the right answer.
"""

import json
import os

# slug -> (lat, lng, name). Every coordinate here was read back from the DTM point
# API, and every one sits on a road or a mapped parking area. The elevation in the
# comment is what the terrain model returned, against the start height the tour's
# stated vertical gain implies.
PICKS = {
    # Named places in Kartverket's register — huts, farms, hamlets, bridges.
    "slogen": (62.19291, 6.65840, "Øye i Norangsdalen"),          # 5 m, want 3
    "snohetta": (62.29417, 9.35067, "Snøheim"),                   # 1474 m, want 1487
    "rondslottet": (61.83918, 9.72398, "Spranget"),               # 1061 m, want 1128
    "bitihorn": (61.32767, 8.79880, "Bygdin"),                    # 1062 m, want 1108
    "synshorn": (61.32767, 8.79880, "Bygdin"),                    # 1062 m, want 1075
    "gaustatoppen": (59.88011, 8.73429, "Gaustablikk"),           # 945 m, want 932
    "melderskin": (59.98589, 6.01157, "Rosendal"),                # 9 m, want 6
    "stornappstinden": (68.13317, 13.43193, "Napp"),              # 11 m, want 11
    "hesten-segla": (69.50893, 17.62825, "Fjordgård"),            # 10 m
    "galdhopiggen": (61.67276, 8.37059, "Juvvasshytta"),          # 1841 m
    "skala": (61.87151, 6.84590, "Loen"),                         # 2 m, want 7
    "kirketaket": (62.58289, 7.92225, "Tverråbrua i Grøvdalen"),  # 68 m, want 59
    "kolastinden": (62.25790, 6.38382, "Standaldalen"),           # 376 m, want 281
    "oksen": (60.45066, 6.64006, "Tjoflot"),                      # 181 m
    "himmeltindan": (68.19984, 13.54135, "Haukland"),             # 9 m
    # Mapped parking and roads from OpenStreetMap.
    "fanaraken": (61.50808, 7.81156, "1100-meteren, Sognefjellsvegen"),  # 1100 m, want 1117
    "steindalsnosi": (61.54884, 7.89055, "Korpen, Sognefjellsvegen"),    # 1397 m, want 1404
    "storehorn": (60.82829, 8.57482, "Skyrvedalsvegen"),                 # 887 m, want 852
    "rombakstotta": (68.43758, 17.64546, "Straumsnes"),                  # 169 m, want 131
    # Rørnestinden takes its name from Rørnes, and its stated 1041 m gain equals
    # the summit height — so the tour starts at the fjord, not up at Lyngseidet.
    "rornestinden": (69.58195, 20.14945, "Rørnesveien"),                 # 2 m, want -11
}

# Tours where PICKS wins over a researched corridor. Only Rørnestinden: the
# research put it at Lyngseidet (62 m) at medium confidence, which cannot be
# right for a fjord-to-summit tour. Its waypoints belong to that other corridor,
# so they are dropped with it.
OVERRIDE_RESEARCH = {"rornestinden"}

# slug -> [(lat, lng, name), ...] ordered trailhead->summit, endpoints excluded.
WAYPOINTS = {}


def _load(path):
    return json.load(open(path)) if os.path.exists(path) else {}


def main():
    cands = _load("trailhead_candidates.json") or _load("trailhead_candidates.partial.json")
    swarm = _load("corridors.swarm.json")
    summits = json.load(open("summits.json"))

    out, sources = {}, {}
    for slug in summits:
        # Researched-and-audited corridors first: they carry the route knowledge
        # a terrain model cannot supply — which valley, which ridge, what to avoid.
        if slug in swarm and slug not in OVERRIDE_RESEARCH:
            rec = swarm[slug]
            out[slug] = {
                "route_name": rec.get("route_name", ""),
                "trailhead": rec["trailhead"],
                "waypoints": rec.get("waypoints") or [],
            }
            sources[slug] = rec.get("source", "swarm")
            continue

        if slug in PICKS:
            lat, lng, name = PICKS[slug]
            sources[slug] = "named place (SSR)"
        else:
            c = (cands.get(slug) or {}).get("candidates") or []
            if not c:
                print(f"!! {slug}: no trailhead candidate")
                continue
            lat, lng, name = c[0]["lat"], c[0]["lng"], c[0]["name"] or ""
            sources[slug] = "OSM road/parking, ranked by elevation"
        out[slug] = {
            "route_name": "",
            "trailhead": {"lat": lat, "lng": lng, "name": name, "elevation_m": None},
            "waypoints": [
                {"lat": a, "lng": b, "name": n, "elevation_m": None}
                for a, b, n in WAYPOINTS.get(slug, [])
            ],
        }

    with open("corridors.json", "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    with open("corridor_sources.json", "w") as f:
        json.dump(sources, f, indent=1, ensure_ascii=False)
    print(f"wrote corridors.json ({len(out)} corridors)")
    for slug in out:
        print(f"  {slug:<18} {sources[slug]}")


if __name__ == "__main__":
    main()
