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
# Fallback trailheads, used only for a tour with no researched corridor. Every
# tour currently has one, so nothing here is reached — it is kept as the path
# back if corridors.swarm.json is ever regenerated from scratch.
#
# CAUTION: the "want" figures below are summitM − verticalM, and that is not a
# sound way to locate a trailhead. verticalM holds the peak's published ALTITUDE
# in eight of the 24 tours rather than its ascent (see README), so matching a
# candidate's elevation to it can reproduce the error and then look like
# confirmation. That is exactly how the Rørnestinden entry below went wrong.
# Treat these as a shortlist to check against a route description, never as an
# answer.
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
    # REFUTED, kept only so the mistake is not made again. I argued that
    # Rørnestinden's stated 1041 m "gain" equalling its summit height meant a
    # fjord start. 1041 is the peak's published altitude, duplicated into the
    # vertical field. Friflyt names Lyngseidet/Eidebakken as the start, OSM has a
    # car park on that exact coordinate against farm access with no parking within
    # a kilometre here, and the router gives +1004 m from Lyngseidet against a
    # published 1000 m. The researched corridor wins.
    "rornestinden": (69.58195, 20.14945, "Rørnesveien"),                 # 2 m — do not use
}

# Tours where PICKS would win over a researched corridor. Empty: the one entry it
# ever held, Rørnestinden, was refuted by the Lyngen audit. I had argued from the
# app's stated 1041 m "gain" equalling the summit height, so the start had to be
# at sea level — but 1041 is Rørnestinden's published *altitude*, duplicated into
# the vertical field, so it says nothing about the trailhead. Friflyt names
# Lyngseidet/Eidebakken explicitly, OSM has a mapped car park on that exact
# coordinate, and the router gives +1003 m there against Friflyt's published
# 1000 m. See README, "Where the app's own numbers disagree with the ground".
OVERRIDE_RESEARCH: set[str] = set()

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
            "note": "The other standard route. Its 1434 m of gain from the valley "
                    "floor is why the app's old 1100 m figure matched neither start: "
                    "it sat between this and the 632 m from Juvasshytta.",
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
        },
        {
            "id": "bjornhollia",
            "name": "Fra Bjørnhollia gjennom Langglupdalen",
            "trailhead": (61.88408, 10.01196, "Bjørnhollia"),  # 913 m
            "waypoints": [
                (61.89500, 10.01500, "nordover langs dalen"),   # 931 m
                (61.90600, 10.00200, "dalmunnen"),              # 914 m
                (61.91300, 9.96500, "inn i Langglupdalen"),     # 1030 m
                (61.91900, 9.93000, "opp dalen"),               # 1260 m
                (61.92400, 9.89500, "øvre Langglupdalen"),      # 1272 m
                (61.92000, 9.86500, "stiskillet"),              # 1764 m
                (61.91700, 9.85800, "toppflanken"),             # 1969 m
            ],
            "note": "ut.no 1112154771: from the hut doorstep, the marked route "
                    "up Langglupdalen towards Dørålseter, past the bridge over "
                    "Langglupå and the Høgronden junction, then west from the "
                    "Rondeslottet junction. 22.4 km, 1433 m, at least five hours "
                    "up. The third start on this summit: Spranget south, Nedre "
                    "Dørålseter north, Bjørnhollia east.",
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
    "melderskin": [
        {
            "id": "myrdalsvatnet",
            "name": "Frå Myrdalsvatnet over Omnen",
            "trailhead": (60.02300, 6.06094, "Myrdalsvatnet"),  # 367 m
            "waypoints": [
                (60.02500, 6.07300, "traktorvegen"),               # 430 m
                (60.02731, 6.08584, "Nipeelva"),                   # 525 m
                (60.02350, 6.08700, "opp langs elva"),             # 750 m
                (60.01910, 6.08444, "ryggen over Omnetjørnene"),   # 1033 m
                (60.01449, 6.08235, "Omnen"),                      # 1155 m
                (60.01000, 6.08200, "toppryggen"),                 # 1204 m
            ],
            "note": "Fri Flyts eige startsted for Melderskin er Myrdalsvannet, ikkje "
                    "Kletta: «Fra Myrdalsvannet, følg grusveien litt tilbake til du "
                    "kommer til en traktorvei. Følg veien til Nipelva dukker opp. Følg "
                    "elva oppover til det blir naturlig å svinge av mot Omnen (1158). "
                    "Da ligger Omnetjørnene til venstre for deg. Følg den tydelige "
                    "ryggen opp til toppen.» 1054 høydemeter, 5 timar, NØ, 45 grader "
                    "på det brattaste, «Ta med stegjern og øks». Omnen er "
                    "registerført (Topp, Kvinnherad, 60,01449/6,08235) og DTM1 les "
                    "1155,5 mot boka sine 1158. Omnetjørnene ligg på 1066 moh aust "
                    "for ryggen, altså til venstre når ein går sørover — linja "
                    "kryssar dei ikkje. Startsteda er 2,0 km og 213 høgdemeter frå "
                    "kvarandre; Myrdalsvatnet er alt eit kartfesta startsted i "
                    "appen, det Juklavasstinden går frå, og dei to rutene deler den "
                    "same nedre tilkomsten langs Nipeelva.",
        }
    ],
    "gullfjellstoppen": [
        {
            "id": "gullbotn",
            "name": "Frå Gullbotn over Gullfjellhalsen",
            "trailhead": (60.40767, 5.63913, "Gullbotn"),  # 244 m
            "waypoints": [
                (60.40533, 5.62955, "der merkestien tek av"),          # 293 m
                (60.40280, 5.61426, "Gullbotn nord for Mannaleitnipa"),  # 447 m
                (60.39611, 5.60660, "merkestien over 700"),            # 699 m
                (60.38955, 5.59276, "Gullfjellhalsen"),                # 941 m
            ],
            "note": "Fri Flyt fører tre startsted for Gullfjellet — «Osevann i "
                    "Bjørndalen, Gullbotn ved Trengereid eller Bontveit» — og gir "
                    "nordruta si eiga skildring: «Alternativ 2: Fra nord er det "
                    "mulig å starte ved den nedlagte Gullbotn Turistheim. Følg "
                    "merkingen opp i selve Gullbotn nord for Mannaleitnipa (593 "
                    "moh) og videre til Gullfjellshalsen.» Turistheimen er OSM way "
                    "923743081, old_name «Gullbotn th;Gullbotten Turistheim», og "
                    "parkeringa 170 m unna er OSM way 961372245 (name=Gullbotn, "
                    "hiking=yes, ski=yes). Merkinga er kartlagd: OSM way 1118672845 "
                    "og 61938702, 3,45 km frå der stien tek av til varden. Han går "
                    "gjennom Gullbotn på 447 moh, nord for Mannaleitnipa, og over "
                    "Gullfjellhalsen — registerført som Rygg på 60,38955/5,59276, "
                    "941 moh. Appens rute går frå Osavatnet på vestsida, 9,6 km "
                    "unna langs vegen og 63 høgdemeter høgare.",
        }
    ],
}


def _load(path):
    return json.load(open(path)) if os.path.exists(path) else {}


# The research agents sometimes transliterate Norwegian letters away in the
# labels they return. These are proper nouns on a Norwegian map, so repair them.
SPELLING = {
    "Fanarak": "Fanaråk",
    "Turtagro": "Turtagrø",
    "Roernes": "Rørnes",
    "Blamann": "Blåmann",
    "Snoheim": "Snøheim",
    "Doralseter": "Dørålseter",
    "Batskaret": "Båtskaret",
    "Fjordgard": "Fjordgård",
    "Hellerora": "Hellerøra",
    "Grovdal": "Grøvdal",
    "Kolastind": "Kolåstind",
    "Skala": "Skåla",
    "Soerrut": "Sørrut",
    "Norangsdal": "Norangsdal",
}


def respell(text):
    for wrong, right in SPELLING.items():
        text = text.replace(wrong, right)
    return text


def short_name(name):
    """A route needs a name, not a description.

    The research came back with full sentences ("Normalruta fra Djupvik/
    Forselvveien via Pumpvatnet, bekkedalen mot Forsnesvatnet, Isvatnet og
    sørøstryggen"), which is useful prose and a terrible label. Cut at the first
    clause break and keep the head; the full text stays in `description` for the
    guides to use later.
    """
    name = respell(name)
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
    out = re.sub(r"\s*\([^)]*\)", "", respell(name))  # drop parentheticals
    out = re.split(r"\s*[,–—]\s*", out, maxsplit=1)[0]  # first clause only
    out = PARKING_PREFIX.sub("", out).strip()
    if len(out) > 40:
        out = out.split(" ved ")[0].strip()
    return out[:40].strip(" ,–—") or name


def wp(lat, lng, name):
    z, _ = dtm_point(lat, lng)
    return {
        "lat": lat, "lng": lng, "name": respell(name),
        "elevation_m": round(z, 1) if z else None,
    }


def main():
    swarm = _load("corridors.swarm.json")
    summits = json.load(open("summits.json"))
    tours = json.load(open("tourmeta.json"))

    out = {}
    for slug in summits:
        routes = []

        # --- researched routes (primary first), from harvest_swarm.py
        if slug in swarm and slug not in OVERRIDE_RESEARCH:
            rec = swarm[slug]
            for r in rec["routes"]:
                th = r["trailhead"]
                routes.append(
                    {
                        "id": r["id"],
                        "name": short_name(r.get("name") or "Normalruta"),
                        "description": r.get("name") or "",
                        "trailhead": {
                            **th,
                            "name": short_trailhead(th.get("name", "")),
                            "fullName": th.get("name", ""),
                        },
                        "waypoints": r.get("waypoints") or [],
                        "source": rec.get("source", "researched"),
                        "notes": r.get("notes", ""),
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

        # --- hand-entered alternatives, skipping any the research already covered
        have = {r["id"] for r in routes}
        for alt in ALTERNATES.get(slug, []):
            if alt["id"] in have:
                continue
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

        routes[0]["id"] = "normalruta"
        seen_ids = {"normalruta"}
        for i, r in enumerate(routes[1:], start=2):
            if r["id"] in seen_ids:
                r["id"] = f"rute-{i}"
            seen_ids.add(r["id"])

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
