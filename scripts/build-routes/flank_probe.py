"""Measure the slope of a flank, so a claim about one can be checked.

Guides say things like "the south side directly below the summit is a rock band
over 60 degrees". That is a claim about terrain, and terrain is measurable — this
walks a radial line out from a point and prints the profile and the steepest
window along it.

Usage:
    python3 flank_probe.py <lat> <lng> [bearing ...] [--out 400] [--step 10]

Bearings are compass degrees: 0 north, 90 east, 180 south, 270 west. With no
bearing given it sweeps all eight.
"""

import math
import sys

from geo import Dem, dem_tile


def profile(dem, lat, lng, bearing, out_m, step_m):
    br = math.radians(bearing)
    pts = []
    for d in range(0, out_m + 1, step_m):
        la = lat + (d * math.cos(br)) / 110540.0
        lo = lng + (d * math.sin(br)) / (111320.0 * math.cos(math.radians(lat)))
        r, c = dem.rc(la, lo)
        if 0 <= r < dem.height and 0 <= c < dem.width:
            pts.append((d, float(dem.z[r, c])))
    return pts


def steepest_window(pts, window_m):
    n = max(1, window_m // (pts[1][0] - pts[0][0])) if len(pts) > 1 else 1
    best = (0.0, 0, 0)
    for i in range(len(pts) - n):
        dd = pts[i + n][0] - pts[i][0]
        dz = pts[i][1] - pts[i + n][1]
        a = math.degrees(math.atan2(dz, dd))
        if a > best[0]:
            best = (a, pts[i][0], pts[i + n][0])
    return best


def main():
    args = [a for a in sys.argv[1:]]
    out_m, step_m = 400, 10
    for flag, default in (("--out", 400), ("--step", 10)):
        if flag in args:
            i = args.index(flag)
            val = int(args[i + 1])
            if flag == "--out":
                out_m = val
            else:
                step_m = val
            del args[i:i + 2]
    if len(args) < 2:
        print(__doc__)
        return 2
    lat, lng = float(args[0]), float(args[1])
    bearings = [int(b) for b in args[2:]] or [0, 45, 90, 135, 180, 225, 270, 315]

    half = out_m + 300
    hl = half / 110540.0
    hg = half / (111320.0 * math.cos(math.radians(lat)))
    dem = Dem(dem_tile(f"probe_{lat:.4f}_{lng:.4f}_{half}",
                       lng - hg, lat - hl, lng + hg, lat + hl, 800, 800))

    names = {0: "N", 45: "NE", 90: "E", 135: "SE", 180: "S", 225: "SW", 270: "W", 315: "NW"}
    print(f"Flanks from {lat},{lng} — out {out_m} m, sampled every {step_m} m")
    print(f"{'dir':<5}{'bearing':>8}{'start m':>9}{'end m':>8}"
          f"{'mean°':>7}{'steepest 60 m window':>24}")
    for b in bearings:
        pts = profile(dem, lat, lng, b, out_m, step_m)
        if len(pts) < 3:
            continue
        mean = math.degrees(math.atan2(pts[0][1] - pts[-1][1], pts[-1][0]))
        a, d0, d1 = steepest_window(pts, 60)
        print(f"{names.get(b, str(b)):<5}{b:>8}{pts[0][1]:>9.1f}{pts[-1][1]:>8.1f}"
              f"{mean:>7.1f}{f'{a:.1f}° at {d0}-{d1} m out':>24}")

    if len(bearings) <= 2:
        for b in bearings:
            print(f"\nfull profile on bearing {b}° ({names.get(b, '')}):")
            prev = None
            for d, z in profile(dem, lat, lng, b, out_m, step_m):
                ang = "" if prev is None else f"   {math.degrees(math.atan2(prev - z, step_m)):6.1f}°"
                print(f"  {d:>5} m   {z:8.1f} m{ang}")
                prev = z
    return 0


if __name__ == "__main__":
    sys.exit(main())
