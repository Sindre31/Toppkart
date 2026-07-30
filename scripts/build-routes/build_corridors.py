"""Build corridors.json — one or more ascent corridors per tour.

A peak generally has more than one way up. Galdhøpiggen has two standard starts
that are not variants of each other: the glacier route from Juvasshytta and the
long haul from Spiterstulen, 737 vertical metres apart. Tromsdalstinden has two
lines from the *same* car park. So a tour holds a list of routes, the first being
the one its published figures describe.

Only routes that are actually documented go in here. An alternative is not
invented because the schema allows one.
"""

import json
import os
import re

from geo import dtm_point

# ---------------------------------------------------------------- primary routes
# slug -> (lat, lng, trailhead name). The elevation beside each is what the DTM
# returns, against the start height the tour's stated vertical implies.
PICKS = {
    "slogen": (62.19291, 6.65840, "Øye i Norangsdalen"),          # 5 m, want 3
    "snohetta": (62.29417, 9.35067, "Snøheim"),                   # 1474 m, want 1487
    "rondslottet": (61.83918, 9.72398, "Spranget"),               # 1061 m, want 1128
    "bitihorn": (61.32767, 8.79880, "Bygdin"),                    # 1062 m, want 1108
    "synshorn": (61.32767, 8.79880, "Bygdin"),                    # 1062 m, want 1075
    "gaustatoppen": (59.88011, 8.73429, "Gaustablikk"),           # 945 m, want 932
    "melderskin": (59.98589, 6.01157, "Rosendal"),                # 9 m, want 6
    "stornappstinden": (68.13317, 13.43193, "Napp"),              # 11 m, want 11
    "galdhopiggen": (61.67276, 8.37059, "Juvvasshytta"),          # 1841 m
    "skala": (61.87151, 6.84590, "Loen"),                         # 2 m, want 7
    "kirketaket": (62.58289, 7.92225, "Tverråbrua i Grøvdalen"),  # 68 m, want 59
    "kolastinden": (62.25790, 6.38382, "Standaldalen"),           # 376 m, want 281
    "oksen": (60.45066, 6.64006, "Tjoflot"),                      # 181 m
    "himmeltindan": (68.19984, 13.54135, "Haukland"),             # 9 m
    "fanaraken": (61.50808, 7.81156, "1100-meteren, Sognefjellsvegen"),  # 1100 m, want 1117
    "steindalsnosi": (61.54884, 7.89055, "Korpen, Sognefjellsvegen"),    # 1397 m, want 1404
    "storehorn": (60.82829, 8.57482, "Skyrvedalsvegen"),                 # 887 m, want 852
    # Rørnestinden takes its name from Rørnes, and its stated 1041 m gain equals
    # the summit height — so the tour starts at the fjord, not up at Lyngseidet.
    "rornestinden": (69.58195, 20.14945, "Rørnesveien"),                 # 2 m, want -11
}

# Tours where PICKS wins over a researched corridor — see Rørnestinden above.
OVERRIDE_RESEARCH = {"rornestinden"}

# ------------------------------------------------------------ alternative routes
# Second (and further) documented ways up. Every coordinate here was read back
# from the DTM point API; the elevation in the comment is what it returned.
ALTERNATES = {
    "galdhopiggen": [
        {
            "id": "spiterstulen",
            "name": "Fra Spiterstulen over Svellnose og Keilhaus topp",
            "trailhead": (61.62446, 8.40477, "Spiterstulen"),  # 1103 m
            "waypoints": [
                (61.63362, 8.33792, "Svellnose"),      # 2271 m
                (61.63491, 8.32595, "Keilhaus topp"),  # 2353 m
            ],
            "note": "The other standard route, and the one the app's 1100 m figure "
                    "sits closest to — 1365 m from the valley floor at Spiterstulen.",
        }
    ],
    "tromsdalstinden": [
        {
            "id": "sommerruta",
            "name": "Sommerruta — NNV-ryggen fra Tromsdalen",
            "trailhead": (69.63243, 19.03232, "Parkering ved Tromsdalen skytebane"),
            "waypoints": [
                (69.61700, 19.06250, "Der stien forlater Tromsdalen"),  # 128 m
                (69.61560, 19.10800, "NNV-ryggen, ca. 500 moh"),        # 504 m
                (69.61430, 19.11700, "NNV-ryggen, ca. 600 moh"),        # 603 m
                (69.61400, 19.12600, "NNV-ryggen, ca. 780 moh"),        # 784 m
                (69.61330, 19.13800, "NNV-ryggen, ca. 970 moh"),        # 973 m
            ],
            "note": "Same car park as the ski line, different mountain: this is the "
                    "marked summer path up the north-north-west ridge. Steep and "
                    "icy low down in winter.",
        }
    ],
    "rondslottet": [
        {
            "id": "doralseter",
            "name": "Fra Dørålseter gjennom Langglupdalen",
            "trailhead": (61.99784, 9.80650, "Nedre Dørålseter"),  # 1043 m
            "waypoints": [],
            "note": "The northern approach, from the Dørålen side.",
        }
    ],
    "snohetta": [
        {
            "id": "reinheim",
            "name": "Fra Reinheim i Stroplsjødalen",
            "trailhead": (62.34119, 9.35622, "Reinheim"),  # 1342 m
            "waypoints": [],
            "note": "The classic hut-to-summit line from the north-east.",
        }
    ],
    "gaustatoppen": [
        {
            "id": "stavsro",
            "name": "Fra Stavsro opp østryggen",
            "trailhead": (59.83410, 8.71335, "Stavsro"),  # 1177 m
            "waypoints": [],
            "note": "The short, popular route from the Rjukan road — the one most "
                    "people walk in summer.",
        }
    ],
}


def _load(path):
    return json.load(open(path)) if os.path.exists(path) else {}


def short_name(name):
    """A route needs a name, not a description.

    The research came back with full sentences ("Normalruta fra Djupvik/
    Forselvveien via Pumpvatnet, bekkedalen mot Forsnesvatnet, Isvatnet og
    sørøstryggen"), which is useful prose and a terrible label. Cut at the first
    clause break and keep the head; the full text stays in `description` for the
    guides to use later.
    """
    head = re.split(r"\s*[:—–]\s*| via | med | opp | til |, ", name, maxsplit=1)[0]
    head = head.strip(" ,–—:/(")
    return head if 8 <= len(head) <= 60 else name[:60].strip(" ,–—:/(")


PARKING_PREFIX = re.compile(
    r"^(parkering ved |avgiftsparkering ved |veienden i |p-plass ved )", re.I
)


def short_trailhead(name):
    """"Parkering ved Tromsdalen skytebane, innerst i Turistvegen (Tromsdalen)"
    is a driving instruction. The label wants "Tromsdalen skytebane"; the full
    text stays in the corridor file.
    """
    out = re.sub(r"\s*\([^)]*\)", "", name)          # drop parentheticals
    out = re.split(r"\s*[,–—]\s*", out, maxsplit=1)[0]  # first clause only
    out = PARKING_PREFIX.sub("", out).strip()
    if len(out) > 40:
        out = out.split(" ved ")[0].strip()
    return out[:40].strip(" ,–—") or name


def wp(lat, lng, name):
    z, _ = dtm_point(lat, lng)
    return {"lat": lat, "lng": lng, "name": name, "elevation_m": round(z, 1) if z else None}


def main():
    swarm = _load("corridors.swarm.json")
    summits = json.load(open("summits.json"))
    tours = json.load(open("tourmeta.json"))

    out = {}
    for slug in summits:
        routes = []

        # --- primary
        if slug in swarm and slug not in OVERRIDE_RESEARCH:
            rec = swarm[slug]
            routes.append(
                {
                    "id": "normalruta",
                    "name": short_name(rec.get("route_name") or "Normalruta"),
                    "description": rec.get("route_name") or "",
                    "trailhead": {
                        **rec["trailhead"],
                        "name": short_trailhead(rec["trailhead"].get("name", "")),
                        "fullName": rec["trailhead"].get("name", ""),
                    },
                    "waypoints": rec.get("waypoints") or [],
                    "source": rec.get("source", "researched"),
                }
            )
        elif slug in PICKS:
            lat, lng, name = PICKS[slug]
            routes.append(
                {
                    "id": "normalruta",
                    "name": f"Normalruta fra {name}",
                    "trailhead": wp(lat, lng, name),
                    "waypoints": [],
                    "source": "trailhead from Kartverket/OSM, line from the terrain model",
                }
            )
        else:
            print(f"!! {slug}: no primary corridor")
            continue

        # --- alternatives
        for alt in ALTERNATES.get(slug, []):
            lat, lng, name = alt["trailhead"]
            routes.append(
                {
                    "id": alt["id"],
                    "name": alt["name"],
                    "trailhead": wp(lat, lng, short_trailhead(name)),
                    "waypoints": [wp(*w) for w in alt["waypoints"]],
                    "source": "documented alternative route",
                    "note": alt.get("note", ""),
                }
            )

        # The tour's published vertical describes the first route, so that is the
        # one worth comparing against the ground. A large gap here is a data bug
        # in the tour list, not a routing problem — see README.
        implied = round(summits[slug]["summit_dtm"] - tours[slug]["verticalM"], 1)
        for i, r in enumerate(routes):
            z = r["trailhead"].get("elevation_m")
            r["implied_start_m"] = implied if i == 0 else None
            r["start_vs_implied_m"] = round(z - implied, 1) if (i == 0 and z is not None) else None

        out[slug] = {"routes": routes}
        head = routes[0]
        print(
            f"{slug:<18}{len(routes)} route(s)  primary starts {head['trailhead'].get('elevation_m')} m "
            f"(implied {implied}, Δ{head['start_vs_implied_m']:+})  "
            + ", ".join(r["id"] for r in routes[1:])
        )

    with open("corridors.json", "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    total = sum(len(v["routes"]) for v in out.values())
    print(f"\nwrote corridors.json — {len(out)} tours, {total} routes")


if __name__ == "__main__":
    main()
