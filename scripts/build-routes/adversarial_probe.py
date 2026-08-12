"""Independent measurements for an adversarial read.

The sweeps that produce a guide read the terrain from a WCS raster, cached under
`cache/`. This reads the same terrain from Kartverket's **point** API instead —
`ws.geonorge.no/hoydedata/v1/punkt`, one request per point, the number the
service answers with rather than the number a resampled tile answers with.

That difference is the whole point of the tool. Every independent read so far
has found at least one figure that reproduces at one resolution and not the
other, and a quoted angle that only exists in a 25 m raster is a quoted angle
that is not there on the mountain. See "Rødtinden's steep step is real, and it
is not where the copy put it" in README.md.

It also does not know what the guide says. It prints measurements; the reading
is done by a person against the prose.

Usage:
    python3 adversarial_probe.py bearings <slug>
        Bearings and geometry off the stored route line: where the line starts
        and ends, which way it points over its last stretch, where the start is
        seen from the summit.

    python3 adversarial_probe.py radial <lat> <lng> <bearing> [--out 600] [--step 10]
        A profile out from a point, with the steepest window at several widths.

    python3 adversarial_probe.py sweep <lat> <lng> [--out 400] [--step 20]
        The same, on all eight compass points.

    python3 adversarial_probe.py terrain <lat> <lng> [<lat> <lng> ...]
        Terrain class and height at each point.

    python3 adversarial_probe.py line <slug> [--every 10]
        Terrain class along the stored route, every Nth vertex.
"""

import json
import math
import re
import sys
import time
import urllib.parse
import urllib.request

POINT_API = "https://ws.geonorge.no/hoydedata/v1/punkt"
ROUTES_TS = __file__.rsplit("/", 3)[0] + "/lib/routes.ts"

_cache: dict[tuple[float, float], dict] = {}


def point(lat: float, lng: float, tries: int = 4) -> dict:
    """Height and terrain class at one coordinate, from DTM1.

    Cached in memory: a radial sweep at 10 m steps revisits the summit for every
    bearing, and the service is a public one we are a guest on.
    """
    key = (round(lat, 6), round(lng, 6))
    if key in _cache:
        return _cache[key]
    qs = urllib.parse.urlencode({"ost": key[1], "nord": key[0], "koordsys": 4258})
    for attempt in range(tries):
        try:
            with urllib.request.urlopen(f"{POINT_API}?{qs}", timeout=30) as fh:
                data = json.load(fh)
            hit = (data.get("punkter") or [{}])[0]
            _cache[key] = hit
            return hit
        except Exception:
            if attempt == tries - 1:
                _cache[key] = {}
                return {}
            time.sleep(1.5 * (attempt + 1))
    return {}


def prefetch(coords) -> None:
    """Warm the cache for a list of coordinates, a few at a time.

    A radial at 10 m steps out to a kilometre is a hundred requests, and a
    sweep is eight of those. Sequentially that is minutes of waiting on a
    service that answers in milliseconds. Eight at a time is enough to make it
    quick and few enough to stay a polite guest — this is a public API with no
    key and no quota, which is a reason to be careful rather than a licence.
    """
    from concurrent.futures import ThreadPoolExecutor

    todo = [c for c in coords if (round(c[0], 6), round(c[1], 6)) not in _cache]
    if not todo:
        return
    with ThreadPoolExecutor(max_workers=8) as pool:
        list(pool.map(lambda c: point(*c), todo))


def z(lat: float, lng: float):
    return point(lat, lng).get("z")


def offset(lat: float, lng: float, bearing: float, metres: float):
    br = math.radians(bearing)
    return (
        lat + (metres * math.cos(br)) / 110540.0,
        lng + (metres * math.sin(br)) / (111320.0 * math.cos(math.radians(lat))),
    )


def bearing_between(a: tuple[float, float], b: tuple[float, float]) -> float:
    """Compass bearing from a to b, degrees, 0 = north."""
    dlat = (b[0] - a[0]) * 110540.0
    dlng = (b[1] - a[1]) * 111320.0 * math.cos(math.radians((a[0] + b[0]) / 2))
    return (math.degrees(math.atan2(dlng, dlat)) + 360) % 360


def haversine(a: tuple[float, float], b: tuple[float, float]) -> float:
    dlat = (b[0] - a[0]) * 110540.0
    dlng = (b[1] - a[1]) * 111320.0 * math.cos(math.radians((a[0] + b[0]) / 2))
    return math.hypot(dlat, dlng)


def load_routes() -> dict[str, list[dict]]:
    """The emitted `ROUTES` table, read as data.

    Deliberately parsed out of `lib/routes.ts` rather than out of the JSON the
    pipeline keeps: the TypeScript is what the app ships and what the figure
    draws, and a check that reads the intermediate file cannot see a bad emit.
    """
    src = open(ROUTES_TS, encoding="utf-8").read()
    out: dict[str, list[dict]] = {}
    # The closing `\n` is a lookahead, not part of the match: it is also the
    # opening `\n` of the next block, and consuming it made this find every
    # *other* tour — 45 of 90, silently and plausibly.
    for m in re.finditer(r'\n  "?([a-z0-9-]+)"?: \[\n(.*?)\n  \],(?=\n)', src, re.S):
        slug, body = m.group(1), m.group(2)
        routes = []
        for rm in re.finditer(
            r'id: "([^"]+)",\s*\n\s*name: "([^"]*)",\s*\n\s*trailhead: "([^"]*)",\s*\n'
            r"\s*distanceM: (\d+),\s*\n\s*gainM: (\d+),\s*\n\s*line: \[(.*?)\],\s*\n",
            body,
            re.S,
        ):
            nums = [float(v) for v in re.findall(r"-?\d+\.?\d*", rm.group(6))]
            line = [(nums[i], nums[i + 1], nums[i + 2]) for i in range(0, len(nums), 3)]
            routes.append(
                {
                    "id": rm.group(1),
                    "name": rm.group(2),
                    "trailhead": rm.group(3),
                    "distanceM": int(rm.group(4)),
                    "gainM": int(rm.group(5)),
                    "line": line,
                }
            )
        if routes:
            out[slug] = routes
    return out


def steepest(profile: list[tuple[int, float]], window_m: int):
    """The steepest descending window of a given width along a radial."""
    if len(profile) < 2:
        return None
    step = profile[1][0] - profile[0][0]
    n = max(1, window_m // step)
    best = None
    for i in range(len(profile) - n):
        dd = profile[i + n][0] - profile[i][0]
        dz = profile[i][1] - profile[i + n][1]
        ang = math.degrees(math.atan2(dz, dd))
        if best is None or ang > best[0]:
            best = (ang, profile[i][0], profile[i + n][0])
    return best


def radial(lat, lng, bearing, out_m, step_m):
    coords = [offset(lat, lng, bearing, d) for d in range(0, out_m + 1, step_m)]
    prefetch(coords)
    prof = []
    for d, (la, lo) in zip(range(0, out_m + 1, step_m), coords):
        h = z(la, lo)
        if h is not None:
            prof.append((d, h))
    return prof


def cmd_radial(lat, lng, bearing, out_m=600, step_m=10, verbose=True):
    prof = radial(lat, lng, bearing, out_m, step_m)
    if not prof:
        print(f"bearing {bearing:>3.0f}  (no data)")
        return prof
    if verbose:
        print(f"bearing {bearing:>3.0f}  " + "  ".join(f"{d}:{h:.1f}" for d, h in prof))
    # The average gradient over the whole radial, which is the figure the
    # guides quote as «måler X grader i snitt».
    drop = prof[0][1] - prof[-1][1]
    avg = math.degrees(math.atan2(drop, prof[-1][0])) if prof[-1][0] else 0.0
    print(f"  bearing {bearing:>3.0f}: average over {prof[-1][0]} m = {avg:.1f}°  (drop {drop:.1f} m)")
    for w in (30, 60, 100, 200):
        s = steepest(prof, w)
        if s:
            print(f"    steepest {w:>3} m window: {s[0]:.1f}° between {s[1]} and {s[2]} m out")
    return prof


def cmd_sweep(lat, lng, out_m=400, step_m=20):
    for b in range(0, 360, 45):
        cmd_radial(lat, lng, b, out_m, step_m)


def cmd_terrain(coords):
    for lat, lng in coords:
        p = point(lat, lng)
        print(f"{lat:.5f},{lng:.5f}  z={p.get('z')}  {p.get('terreng')}")


def cmd_bearings(slug):
    routes = load_routes().get(slug)
    if not routes:
        print(f"no route for {slug}")
        return
    for r in routes:
        line = r["line"]
        start, summit = (line[0][0], line[0][1]), (line[-1][0], line[-1][1])
        print(f"\n== {slug} / {r['id']} — {r['name']}")
        print(f"   trailhead: {r['trailhead']}  stored: {r['distanceM']} m, {r['gainM']} m gain")
        print(f"   start  {start[0]:.5f},{start[1]:.5f}  z={line[0][2]:.0f}")
        print(f"   summit {summit[0]:.5f},{summit[1]:.5f}  z={line[-1][2]:.0f}")
        print(f"   vertices: {len(line)}")
        print(f"   bearing summit -> start: {bearing_between(summit, start):.0f}")
        print(f"   bearing start -> summit: {bearing_between(start, summit):.0f}")
        print(f"   straight-line distance: {haversine(start, summit):.0f} m")
        # Which way the line actually points over its final stretches — the
        # claim «up the west ridge» is a claim about exactly this.
        for tail in (200, 500, 1000):
            acc, i = 0.0, len(line) - 1
            while i > 0 and acc < tail:
                acc += haversine((line[i][0], line[i][1]), (line[i - 1][0], line[i - 1][1]))
                i -= 1
            frm = (line[i][0], line[i][1])
            print(
                f"   last {tail} m of line runs on bearing {bearing_between(frm, summit):.0f}"
                f"  (from {frm[0]:.5f},{frm[1]:.5f}, z={line[i][2]:.0f})"
            )
        lo = min(p[2] for p in line)
        hi = max(p[2] for p in line)
        gain = sum(max(0.0, line[i][2] - line[i - 1][2]) for i in range(1, len(line)))
        drop = sum(max(0.0, line[i - 1][2] - line[i][2]) for i in range(1, len(line)))
        print(f"   line elevation: min {lo:.0f}, max {hi:.0f}, cumulative +{gain:.0f} / -{drop:.0f}")


def cmd_bands(slug):
    """Ground distance and gradient per 100 m height band, along the line.

    This is the shape most ascent paragraphs are written in — «from 1200 to
    1300 m it measures 13.5 degrees over 405 metres of ground» — and it is
    derived here from the stored line alone, so it can be checked without the
    raster the sweeps used.
    """
    for r in load_routes().get(slug, []):
        line = r["line"]
        print(f"\n== {slug} / {r['id']} — bands")
        # Cumulative ground distance at each vertex, so a height can be turned
        # into a position along the line by interpolation rather than by
        # rounding a segment into whichever band its lower end fell in. That
        # rounding is worth avoiding: on a 74-vertex line it moves a band
        # boundary by tens of metres, which is enough to change a quoted angle
        # by a degree and send a reader looking for an error that is not there.
        run = [0.0]
        for i in range(1, len(line)):
            run.append(run[-1] + haversine((line[i - 1][0], line[i - 1][1]), (line[i][0], line[i][1])))

        lo_z = min(p[2] for p in line)
        hi_z = max(p[2] for p in line)

        def ground_at(target: float):
            """Distance along the line where it first reaches `target` metres."""
            for i in range(1, len(line)):
                a, b = line[i - 1][2], line[i][2]
                if (a < target <= b) or (a > target >= b):
                    span = b - a
                    frac = 0.0 if span == 0 else (target - a) / span
                    return run[i - 1] + frac * (run[i] - run[i - 1])
            return None

        edges = [lo_z] + [b for b in range(int(lo_z // 100 * 100) + 100, int(hi_z) + 1, 100)] + [hi_z]
        edges = sorted(set(edges))
        for j in range(1, len(edges)):
            bot, top = edges[j - 1], edges[j]
            g0 = 0.0 if j == 1 else ground_at(bot)
            g1 = run[-1] if top == hi_z else ground_at(top)
            if g0 is None or g1 is None or g1 <= g0:
                continue
            ground = g1 - g0
            ang = math.degrees(math.atan2(top - bot, ground))
            print(
                f"   {bot:>6.0f}–{top:<6.0f} m: {ground:>6.0f} m of ground, {ang:>5.1f}°"
            )

        # The steepest sustained step: the steepest stretch of the line itself
        # over a given amount of ground, which is the statistic a «bratteste
        # steg» sentence is making a claim about. Measured at several widths
        # because a step quoted over 7 metres and one quoted over 50 are
        # different claims, and only one of them is about skiing.
        for width in (20, 50, 100):
            best = None
            for i in range(len(line)):
                for k in range(i + 1, len(line)):
                    d = run[k] - run[i]
                    if d < width:
                        continue
                    ang = math.degrees(math.atan2(line[k][2] - line[i][2], d))
                    if best is None or ang > best[0]:
                        best = (ang, line[i][2], line[k][2], d)
                    break
            if best:
                print(
                    f"   steepest {width:>3} m step: {best[0]:.1f}° from {best[1]:.0f} to "
                    f"{best[2]:.0f} m over {best[3]:.0f} m of ground"
                )


def cmd_line(slug, every=10):
    routes = load_routes().get(slug)
    if not routes:
        print(f"no route for {slug}")
        return
    for r in routes:
        print(f"\n== {slug} / {r['id']}")
        line = r["line"]
        run = 0.0
        for i in range(0, len(line), every):
            if i:
                run = sum(
                    haversine((line[k][0], line[k][1]), (line[k - 1][0], line[k - 1][1]))
                    for k in range(1, i + 1)
                )
            p = point(line[i][0], line[i][1])
            print(
                f"   {i:>4}  {run:>7.0f} m  stored z={line[i][2]:>6.1f}  "
                f"dtm1 z={p.get('z')}  {p.get('terreng')}"
            )


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 2
    cmd = args[0]

    def flag(name, default):
        if name in args:
            i = args.index(name)
            val = int(args[i + 1])
            del args[i : i + 2]
            return val
        return default

    if cmd == "bearings":
        cmd_bearings(args[1])
    elif cmd == "radial":
        out_m = flag("--out", 600)
        step_m = flag("--step", 10)
        cmd_radial(float(args[1]), float(args[2]), float(args[3]), out_m, step_m)
    elif cmd == "sweep":
        out_m = flag("--out", 400)
        step_m = flag("--step", 20)
        cmd_sweep(float(args[1]), float(args[2]), out_m, step_m)
    elif cmd == "terrain":
        vals = [float(v) for v in args[1:]]
        cmd_terrain([(vals[i], vals[i + 1]) for i in range(0, len(vals), 2)])
    elif cmd == "line":
        every = flag("--every", 10)
        cmd_line(args[1], every)
    else:
        print(__doc__)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
