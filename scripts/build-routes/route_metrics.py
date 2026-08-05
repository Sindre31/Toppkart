"""Tour metadata read off the route line: vertical, time, grade, aspect.

A peak added from scratch has no guidebook entry to copy these four fields from,
so they are measured here. `python3 route_metrics.py --calibrate` prints each
measurement beside the value the first 24 tours carry, which is the only way to
find out how much a measurement is worth. The answer differs sharply per field,
and that is the point of this module's existence rather than a footnote to it:

  verticalM  Trustworthy. The routed cumulative ascent rounded to 10 m — the same
             rule the 24 follow. (And the reason `verticalM` may never be used to
             infer a trailhead: README, «The bug that caused most of this».)
  duration   Good enough. A skinning model — 4.5 km/h along the ground, 350 m/h
             of ascent, the run down at 12 km/h, plus three quarters of an hour
             of transitions and breaks — banded to the two-hour window the app
             shows. It lands on or next to the app's band for most of the 24.
  grade      A CHECK, NOT A SOURCE. Grading off the steepest sustained 100 m band
             reproduces only 14 of the 24 editorial grades. What it cannot see is
             most of what makes a tour hard: Galdhøpiggen comes out 1 because a
             glacier is flat, and exposure, crevasses, cornices and a scrambling
             finish are all invisible to a slope angle. Take the grade from the
             route research; use this to notice when the two disagree by more
             than one step.
  aspect     A CHECK, NOT A SOURCE, for a different reason. This measures which
             way the *route* faces near the top; the app's field means which way
             the descent flank faces, and on a peak climbed from the back side
             the two are opposites. Bitihorn measures N here and is S in the app,
             and both are defensible statements about different things.

Season is not derived at all. Snow arrives on a coast at a different time than it
does at 2000 m inland, and nothing on the line says when — it comes from the
route research, together with whether the access road is ploughed.
"""

import json
import math
import sys

from geo import haversine
from guide_facts import bands, cumdist, steepest_band

COMPASS_NO = ["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"]


def bearing(a, b):
    lat1, lat2 = math.radians(a[0]), math.radians(b[0])
    dlng = math.radians(b[1] - a[1])
    y = math.sin(dlng) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dlng)
    return math.degrees(math.atan2(y, x)) % 360


def descent_aspect(points):
    """Which way the descent faces, as one of the eight compass points.

    Each step is weighted by its length so a dense cluster of short steps around
    a kick turn cannot outvote the long, straight part of the run.
    """
    x = y = 0.0
    upper = points[len(points) // 2 :]
    for a, b in zip(upper, upper[1:]):
        d = haversine(a[0], a[1], b[0], b[1])
        if d < 1:
            continue
        # Reversed: the way down is the way the flank faces.
        ang = math.radians(bearing(b, a))
        x += math.cos(ang) * d
        y += math.sin(ang) * d
    if x == 0 and y == 0:
        return "?"
    deg = math.degrees(math.atan2(y, x)) % 360
    return COMPASS_NO[int((deg + 22.5) % 360 // 45)]


TRANSITION_H = 0.75  # skins off, layers on, food, and standing on the top


def duration_band(distance_m, gain_m):
    """A normal round trip, as the two-hour band the app shows."""
    hours = (
        distance_m / 1000.0 / 4.5
        + gain_m / 350.0
        + distance_m / 1000.0 / 12.0
        + TRANSITION_H
    )
    lo = max(1, int(round(hours)) - 1)
    if hours < 3:
        return f"{lo}–{max(3, int(round(hours)) + 1)} t"
    return f"{lo}–{lo + 2} t"


# A first cut, not a calibration: `--calibrate` reproduces 14 of the 24 editorial
# grades with these bands, and no threshold does much better, because the angle
# of the skin track is simply not what the editorial grade is measuring. Kept as
# the cross-check described in the module docstring.
GRADE_BANDS = [(18.0, 1), (24.0, 2), (30.0, 3)]


def grade_from(band_angle, gain_m):
    g = 4
    for limit, value in GRADE_BANDS:
        if band_angle < limit:
            g = value
            break
    # Length is its own kind of difficulty: a gentle line with 1300 m of ascent
    # is not a beginner's day out, whatever its steepest hundred metres measure.
    if gain_m >= 1300 and g < 3:
        g += 1
    elif gain_m >= 800 and g < 2:
        g += 1
    return g


def metrics(rec):
    pts = [tuple(p) for p in rec["points"]]
    zs = rec["elevations"]
    # `steepest_band` takes the per-100 m band table, not the line: it is the
    # steepest band with at least 120 m of ground under it, which is what makes
    # it a slope rather than a step. (It used to take the line and return a
    # tuple; this module still called it that way and had not been run since.)
    band = steepest_band(bands(pts, zs))
    angle = band["angle"] if band else 0.0
    return {
        "verticalM": int(round(rec["gainM"] / 10.0) * 10),
        "gainM": rec["gainM"],
        "distanceM": rec["distanceM"],
        "startM": zs[0],
        "summitM": zs[-1],
        "duration": duration_band(rec["distanceM"], rec["gainM"]),
        "steepestBandAngle": round(angle, 1),
        "steepestBandFrom": band["fromM"] if band else None,
        "steepestBandTo": band["toM"] if band else None,
        "maxStepAngle": round(rec["maxAngle"], 1),
        "grade": grade_from(angle, rec["gainM"]),
        "aspect": descent_aspect(pts),
        "distanceKm": round(rec["distanceM"] / 1000.0, 1),
        "cumdistM": round(cumdist(pts)[-1]),
    }


def main():
    routes = json.load(open("routes.json"))
    tours = json.load(open("tourmeta.json"))
    calibrate = "--calibrate" in sys.argv

    out = {}
    hits = total = 0
    print(
        f"{'tour':<20}{'gain':>6}{'dist':>7}{'steep':>7}{'maxº':>6}"
        f"{'grade':>7}{'aspect':>8}{'duration':>10}   app grade/aspect/duration"
    )
    for slug, recs in routes.items():
        m = metrics(recs[0])
        out[slug] = m
        meta = tours.get(slug)
        known = ""
        if meta:
            total += 1
            same = m["grade"] == meta["grade"]
            hits += 1 if same else 0
            known = (
                f"   {meta['grade']}{'  ' if same else ' !'} {meta['aspect']:<3} "
                f"{meta['duration']:<7} {meta['verticalM']:>5} m"
            )
        print(
            f"{slug:<20}{m['gainM']:>6}{m['distanceKm']:>6.1f}k{m['steepestBandAngle']:>7.1f}"
            f"{m['maxStepAngle']:>6.1f}{m['grade']:>7}{m['aspect']:>8}{m['duration']:>10}{known}"
        )

    if calibrate and total:
        print(f"\ngrade agrees with the editorial grade on {hits}/{total} of the graded tours")

    with open("route_metrics.json", "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    print(f"\nwrote route_metrics.json ({len(out)} tours)")


if __name__ == "__main__":
    main()
