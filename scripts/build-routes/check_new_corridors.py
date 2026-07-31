"""Independent pass over a researched corridor, before it is routed.

`check_routes.py` checks the line the router produced. This checks the corridor
the router is about to be given, which is where the expensive mistakes are: a
trailhead with no road under it, a waypoint whose elevation was written down
rather than measured, a sequence that wanders into the next valley. Every figure
is re-queried from Kartverket and OpenStreetMap here rather than taken from the
research that proposed it.

    python3 check_new_corridors.py [slug …]

Exits non-zero if anything needs a look. Nothing it reports is automatically
fatal — a fjord-to-summit tour really does start at 2 m — but everything it
reports has to be looked at.
"""

import json
import math
import sys

from find_trailheads import candidates
from geo import dtm_point, haversine
from newtours import NEW_TOURS

ELEV_TOL_M = 4.0        # the API is deterministic; a mismatch means it was not queried
ROAD_RADIUS_M = 250     # how far a trailhead may sit from a mapped road or car park
MAX_LEG_KM = 4.5
MAX_CORRIDOR_KM = 16.0


def bearing(a, b):
    lat1, lat2 = math.radians(a[0]), math.radians(b[0])
    dlng = math.radians(b[1] - a[1])
    y = math.sin(dlng) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlng)
    return math.degrees(math.atan2(y, x)) % 360


def angle_between(a, b):
    return abs((a - b + 180) % 360 - 180)


def check(slug, corridor, summit):
    notes = []
    route = corridor["routes"][0]
    th = route["trailhead"]
    pts = [(th["lat"], th["lng"], th["elevation_m"], th["name"])]
    pts += [(w["lat"], w["lng"], w["elevation_m"], w["name"]) for w in route["waypoints"]]
    summit_pt = (summit["lat"], summit["lng"], summit["summit_dtm"], "toppen")

    # 1. every elevation re-queried from DTM1
    for lat, lng, claimed, name in pts:
        z, terr = dtm_point(lat, lng)
        if z is None:
            notes.append(f"{name}: no DTM elevation at {lat},{lng} (sea or outside coverage)")
            continue
        if abs(z - claimed) > ELEV_TOL_M:
            notes.append(f"{name}: claims {claimed} m, DTM says {z:.1f} m")
        if terr == "Havflate":
            notes.append(f"{name}: sits on the sea surface")

    chain = pts + [summit_pt]

    # 2. the corridor climbs
    for (_, _, za, na), (_, _, zb, nb) in zip(chain, chain[1:]):
        if zb < za - 25:
            notes.append(f"{na} -> {nb}: gives back {za - zb:.0f} m")

    # 3. legs are a corridor, not a road trip
    total = 0.0
    for (la, ga, _, na), (lb, gb, _, nb) in zip(chain, chain[1:]):
        d = haversine(la, ga, lb, gb)
        total += d
        if d > MAX_LEG_KM * 1000:
            notes.append(f"{na} -> {nb}: {d/1000:.1f} km with nothing pinning it")
    if total > MAX_CORRIDOR_KM * 1000:
        notes.append(f"corridor is {total/1000:.1f} km end to end")

    # 4. every leg makes progress toward the summit
    for i, ((la, ga, _, na), (lb, gb, _, nb)) in enumerate(zip(chain, chain[1:])):
        if haversine(la, ga, lb, gb) < 150:
            continue
        want = bearing((la, ga), (summit["lat"], summit["lng"]))
        got = bearing((la, ga), (lb, gb))
        if angle_between(want, got) > 110 and i < len(chain) - 2:
            notes.append(f"{na} -> {nb}: heads {angle_between(want, got):.0f}° away from the summit")

    # 5. the trailhead has a road under it
    try:
        near = candidates(th["lat"], th["lng"], ROAD_RADIUS_M)
        if not near:
            notes.append(f"trailhead «{th['name']}»: no mapped road or car park within {ROAD_RADIUS_M} m")
        elif not any(c["kind"] == "P" for c in near):
            kinds = sorted({c["kind"] for c in near})
            notes.append(f"trailhead «{th['name']}»: no mapped parking, only {', '.join(kinds)}")
    except Exception as e:  # noqa: BLE001
        notes.append(f"trailhead «{th['name']}»: OSM unreachable, unchecked ({e})")

    # 6. it is a tour, not a stroll
    gain = summit["summit_dtm"] - th["elevation_m"]
    if gain < 250:
        notes.append(f"only {gain:.0f} m below the summit — is this the bottom of the tour?")

    return notes


def main():
    corridors = json.load(open("corridors.json"))
    summits = json.load(open("summits.json"))
    only = set(sys.argv[1:]) or set(NEW_TOURS)

    bad = 0
    for slug in [s for s in NEW_TOURS if s in only and s in corridors]:
        notes = check(slug, corridors[slug], summits[slug])
        th = corridors[slug]["routes"][0]["trailhead"]
        n = len(corridors[slug]["routes"][0]["waypoints"])
        print(
            f"{slug:<20}{th['elevation_m']:>7.0f} m  {n} wp  {th['name'][:34]:<36}"
            + ("" if not notes else "<-- " + str(len(notes)))
        )
        for note in notes:
            print("      -", note)
        bad += 1 if notes else 0

    print(f"\n{len(only & set(corridors))} corridors checked, {bad} need a look")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
