"""Per-tour facts for the written guides, derived from the routes themselves.

A guide should not invent where a route is steep, where it leaves the forest, or
how far it is. All of that is already in the geometry and in Kartverket's terrain
classes, so it is computed here and handed to whoever writes the prose. What is
left for editorial judgement is the judgement — not the numbers.

Also emits the elevation-profile SVG path the guide page draws, over the same
`0 0 600 220` viewBox the prototype used.
"""

import json
import math

from geo import dtm_point, haversine

PROFILE_W = 600.0
PROFILE_TOP = 18.0     # y of the summit
PROFILE_BASE = 200.0   # y of the trailhead
TERRAIN_SAMPLES = 14


def cumdist(points):
    out = [0.0]
    for a, b in zip(points, points[1:]):
        out.append(out[-1] + haversine(a[0], a[1], b[0], b[1]))
    return out


def svg_path(points, elevations):
    """Elevation profile as an SVG polyline over the guide page's viewBox."""
    d = cumdist(points)
    total = d[-1] or 1.0
    lo, hi = min(elevations), max(elevations)
    span = (hi - lo) or 1.0
    # Thin to ~26 vertices: the profile is decoration at 600 px wide, and a
    # 200-point path would bloat every guide payload for no visible gain.
    step = max(1, len(points) // 26)
    idx = list(range(0, len(points), step))
    if idx[-1] != len(points) - 1:
        idx.append(len(points) - 1)
    pts = []
    for i in idx:
        x = d[i] / total * PROFILE_W
        y = PROFILE_BASE - (elevations[i] - lo) / span * (PROFILE_BASE - PROFILE_TOP)
        pts.append(f"{x:.0f},{y:.0f}")
    return "M" + " L".join(pts)


def steepest_band(points, elevations, band=100):
    """The 100 m elevation band with the highest mean gradient, and its angle."""
    d = cumdist(points)
    lo = int(min(elevations) // band * band)
    hi = int(max(elevations))
    best = None
    for base in range(lo, hi, band):
        run = 0.0
        rise = 0.0
        for i in range(len(points) - 1):
            za, zb = elevations[i], elevations[i + 1]
            if not (base <= za < base + band):
                continue
            step = d[i + 1] - d[i]
            if step <= 0:
                continue
            run += step
            rise += zb - za
        if run < 120:
            continue
        ang = math.degrees(math.atan2(rise, run))
        if best is None or ang > best[2]:
            best = (base, base + band, ang, run)
    return best


def max_step_angle(points, elevations):
    worst = 0.0
    for (a, b), (za, zb) in zip(zip(points, points[1:]), zip(elevations, elevations[1:])):
        dd = haversine(a[0], a[1], b[0], b[1])
        if dd > 1:
            worst = max(worst, math.degrees(math.atan2(zb - za, dd)))
    return worst


def terrain_along(points, elevations, n=TERRAIN_SAMPLES):
    """Kartverket terrain class at n points along the line.

    This is what gives a guide an honest treeline: the elevation at which the
    class stops being Skog. Guessing it would be exactly the sort of invented
    detail these guides must not contain.
    """
    step = max(1, len(points) // (n - 1))
    idx = list(range(0, len(points), step))
    if idx[-1] != len(points) - 1:
        idx.append(len(points) - 1)
    out = []
    for i in idx:
        try:
            _, terr = dtm_point(*points[i])
        except Exception:  # noqa: BLE001
            terr = None
        out.append({"i": i, "z": elevations[i], "terreng": terr})
    return out


def treeline(samples):
    """Highest sample still classed as forest, and the first one above it."""
    last_forest = None
    for s in samples:
        if s["terreng"] == "Skog":
            last_forest = s["z"]
    if last_forest is None:
        return None
    above = [s["z"] for s in samples if s["z"] > last_forest]
    return {"last_forest_m": last_forest, "first_open_m": min(above) if above else None}


def main():
    routes = json.load(open("routes.json"))
    corridors = json.load(open("corridors.json"))
    tours = json.load(open("tourmeta.json"))
    summits = json.load(open("summits.json"))

    out = {}
    for slug, recs in routes.items():
        by_id = {r["id"]: r for r in corridors[slug]["routes"]}
        entries = []
        for r in recs:
            pts = [tuple(p) for p in r["points"]]
            zs = r["elevations"]
            band = steepest_band(pts, zs)
            samples = terrain_along(pts, zs) if r["id"] == "normalruta" else []
            src = by_id.get(r["id"], {})
            entries.append(
                {
                    "id": r["id"],
                    "name": r["name"],
                    "trailhead": r["trailheadName"],
                    "trailheadFull": (src.get("trailhead") or {}).get("fullName", ""),
                    "startM": zs[0],
                    "summitM": zs[-1],
                    "gainM": r["gainM"],
                    "lossM": r["lossM"],
                    "distanceM": r["distanceM"],
                    "maxAngle": round(max_step_angle(pts, zs), 1),
                    "steepestBand": (
                        {"fromM": band[0], "toM": band[1], "angle": round(band[2], 1)}
                        if band else None
                    ),
                    "svgPath": svg_path(pts, zs),
                    "terrainSamples": samples,
                    "treeline": treeline(samples) if samples else None,
                    # The research/audit notes: cornices, cliff bands, what the
                    # line must avoid. The single most valuable input to a guide.
                    "researchNotes": src.get("notes", "") or src.get("note", ""),
                    "description": src.get("description", ""),
                    "source": src.get("source", ""),
                }
            )
        meta = tours[slug]
        out[slug] = {
            "name": meta["name"],
            "region": meta["region"],
            "grade": meta["grade"],
            "aspect": meta["aspect"],
            "season": meta["season"],
            "duration": meta["duration"],
            "verticalM": meta["verticalM"],
            "summitClaimM": meta["summitM"],
            "summitDtmM": summits[slug]["summit_dtm"],
            "teaser": meta.get("teaser", ""),
            "routes": entries,
        }
        p = entries[0]
        tl = p["treeline"]
        print(
            f"{slug:<18}{p['startM']:>5}->{p['summitM']:<5} {p['distanceM']/1000:5.2f} km  "
            f"steepest {p['steepestBand']['fromM'] if p['steepestBand'] else '-'}-"
            f"{p['steepestBand']['toM'] if p['steepestBand'] else '-'} m "
            f"@{p['steepestBand']['angle'] if p['steepestBand'] else '-'}°  "
            f"treeline {tl['last_forest_m'] if tl else 'none'}"
        )

    with open("guide_facts.json", "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"\nwrote guide_facts.json ({len(out)} tours)")


if __name__ == "__main__":
    main()
