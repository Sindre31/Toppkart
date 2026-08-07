"""The line against mapped ground: water it crosses, and trails it claims to follow.

`check_routes.py` asks whether the geometry is sane and `check_guides.py` asks
whether the prose is sourced. Neither can see the error that has cost this
project the most: a line that runs somewhere real, measurable and *wrong*,
described by prose that is individually true of every number in it.

Both of the Trondheim round's serious findings were of that shape, and neither
check saw them:

  Kråkfjellet and Rensfjellet ran 1.9 km out on Håen — a reservoir drawn down
  every winter, and the one hazard their source names — under copy that said
  «følg strandlinja på nordsida». Every figure in that copy was correct.

  Storhornet was sold as «merket vinterløype» while the drawn line sat up to
  1423 m away from the mapped ski route, pinned to a place-name register point
  with no cabin within 600 m of it.

The common factor is that both were checkable against something outside the
terrain model — OpenStreetMap's water polygons and its winter routes. That is
what this pass does. Three questions, all answerable from public data:

  water     Which vertices sit on a lake, how far the line runs on it, how far
            offshore it gets, and — for a regulated lake, which is the dangerous
            case — whether the guide says so at all.
  trail     For a tour whose own guide says it follows a løype, a winter route,
            a skogsbilveg or an anleggsveg: how far does the line stray from the
            nearest mapped one?
  side      Where the guide says the route runs to the right or left of a named
            stream, which side is the line actually on?

    python3 check_ground.py [slug …]

Exits non-zero if anything needs a look. Findings are printed with the numbers
behind them, because the decision — reroute, rewrite, or leave it — is a
judgement about the mountain that this script is not entitled to make. A frozen
tarn a source routes you across is fine; a drawn-down reservoir is not, and only
a reader can tell those apart.

Answers from both APIs are cached under `cache/`, so a re-run is cheap and a
first run over all 75 tours is a few minutes rather than a few hours.
"""

import json
import math
import os
import re
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request

from geo import CACHE, haversine

# A line may touch water without it being a defect — a skin track cuts the
# corner of a tarn. These are the thresholds at which it becomes something a
# reader should have been told about.
WATER_FLOOR_M = 25.0         # below this it is the grid clipping a corner
WATER_REPORT_M = 60.0        # metres of line on a lake surface
WATER_OFFSHORE_M = 80.0      # how far from the mapped shore it gets
TRAIL_REPORT_M = 250.0       # metres between the line and the trail it claims
TRAIL_END_M = 250.0          # how close a trail must come to both ends to count

# Terrain classes the DTM returns for standing water. `InnsjøRegulert` is the
# one that matters most: a regulated lake is drawn down through the winter, so
# its ice is the least trustworthy surface in this entire product.
WATER_CLASSES = ("Innsjø", "InnsjøRegulert")
REGULATED = "InnsjøRegulert"

# Words a guide uses when it promises the reader a prepared or mapped line. If
# none of them appear, there is no trail claim to check and the tour is skipped
# for that question rather than measured against a trail it never mentioned.
TRAIL_WORDS = re.compile(
    r"\b(løype|løypa|løypene|vinterløype\w*|skiløype\w*|skogsbilveg\w*|skogsbilvei\w*|"
    r"anleggsveg\w*|anleggsvei\w*|merket|merkede|merka|preparert\w*|oppkjørt\w*)\b",
    re.I,
)
# «utenfor oppkjørte løyper» is the opposite claim, and a word search cannot
# tell the two apart. A tour is only measured against a mapped trail if at least
# one mention is not immediately preceded by a negation — the same shape of rule
# `check_guides.py` uses to keep "does not mean a safe mountain" out of its
# reassurance count.
TRAIL_DENIAL = re.compile(r"\b(utenfor|utanfor|uten|utan|ikke|ikkje|outside|without|not)\b[^.!?;:]{0,20}$", re.I)
# The OSM tags that answer it. `piste:type` covers groomed and backcountry ski
# routes; the road and track values cover the anleggsveg and skogsbilveg cases,
# which are ordinary highways that happen to be unploughed in winter.
# One query per tour rather than one per question. Overpass rate-limits by
# request, not by bytes, and three small queries per tour is three times the
# chance of a 504 — so the trails, the water polygons and the named streams are
# fetched together and split up here.
GROUND_QUERY = """[out:json][timeout:180];
(way(around:{r},{lat},{lng})["piste:type"];
 way(around:{r},{lat},{lng})[highway~"^(track|service|unclassified|residential|path)$"];
 way(around:{r},{lat},{lng})[waterway][name];);
out geom tags;"""

# The water polygon is asked for per crossing rather than over the whole route.
# A bbox-wide request comes back with every tarn in the valley and, on a big
# lake, without enough of the shoreline that matters — Bessvatnet measured 260 m
# offshore when asked about locally and 1315 m when asked about at range. The
# offshore distance is a headline number, so it is measured where the line
# actually stands.
WATER_QUERY = """[out:json][timeout:180];
way(around:600,{lat},{lng})[natural=water];out geom;
rel(around:600,{lat},{lng})[natural=water];way(r);out geom;"""


def ground(slug, rec):
    """Every mapped feature this pass needs around one route, in one request."""
    mid, radius = bbox_centre(rec["points"])
    els = overpass(
        f"ground_{slug}",
        GROUND_QUERY.format(r=int(radius) + 1200, lat=f"{mid[0]:.5f}", lng=f"{mid[1]:.5f}"),
    )
    if els is None:
        return None, None
    trails, streams = [], []
    for el in els:
        t = el.get("tags") or {}
        if "piste:type" in t or t.get("highway"):
            trails.append(el)
        if t.get("waterway") and t.get("name"):
            streams.append(el)
    return trails, streams

SIDE_RE = re.compile(
    r"\b(til\s+)?(høyre|høgre|venstre)\s+for\s+([A-ZÆØÅ][\wæøåÆØÅ-]*(?:bekken|elva|elv|å|åa|vatnet))",
    re.I,
)


def _cache_get(key, build):
    """Disk-cached answer. A failure is never cached.

    Caching `None` was the first version, and it meant a five-minute Overpass
    outage turned into a permanent «no mapped trail to check it against» on
    whichever tours happened to be running at the time — a check reporting its
    own network weather as a fact about the mountain.
    """
    path = os.path.join(CACHE, key + ".json")
    if os.path.exists(path) and os.path.getsize(path) > 1:
        with open(path) as f:
            got = json.load(f)
        if got is not None:
            return got
    value = build()
    if value is not None:
        with open(path, "w") as f:
            json.dump(value, f, ensure_ascii=False)
    return value


def dtm_class(lat, lng):
    """DTM1 elevation and terrain class at a point, cached to disk."""

    def build():
        url = "https://ws.geonorge.no/hoydedata/v1/punkt?" + urllib.parse.urlencode(
            {"ost": f"{lng:.6f}", "nord": f"{lat:.6f}", "koordsys": 4258}
        )
        for attempt in range(4):
            try:
                d = json.loads(urllib.request.urlopen(url, timeout=60).read())
                p = (d.get("punkter") or [{}])[0]
                return {"z": p.get("z"), "t": p.get("terreng")}
            except Exception:  # noqa: BLE001
                time.sleep(2 * (attempt + 1))
        return {"z": None, "t": None}

    return _cache_get(f"tc_{lat:.5f}_{lng:.5f}", build)


# One run asks Overpass seventy-odd questions, which is enough for the main
# instance to start refusing. Rotating over the public mirrors turns a rate
# limit into a retry somewhere else rather than a minute of sleeping.
OVERPASS_TIMEOUT_S = 45
OFFLINE = [False]
OVERPASS_ENDPOINTS = (
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.private.coffee/api/interpreter",
)


# Overpass goes down, and when it does every uncached query costs the full
# rotation before giving up. After this many failures in a run the pass stops
# asking and reports the affected questions as unchecked, which is the honest
# answer and lets the run finish. The count is cumulative rather than
# consecutive: a big query failing while a small one succeeds is exactly what a
# loaded instance does, and a consecutive counter never trips on it.
# Cached answers keep working, so re-running when Overpass recovers fills in
# only what is missing. `--offline` skips it entirely.
OVERPASS_GIVE_UP_AFTER = 4
_overpass_failures = [0]


def overpass(key, query):
    """An Overpass query, cached to disk. Returns None if no mirror will answer."""

    def fetch(url, box):
        try:
            req = urllib.request.Request(
                url,
                data=urllib.parse.urlencode({"data": query}).encode(),
                headers={"User-Agent": "toppkart-check-ground/1.0"},
            )
            d = json.loads(urllib.request.urlopen(req, timeout=OVERPASS_TIMEOUT_S).read())
            # A mirror serving an empty or half-built database answers fast and
            # wrong, which is worse than not answering: every tour comes back
            # «no mapped trail to check it against» and the run looks clean.
            # One of the public mirrors did exactly that here — 0 elements for a
            # way that exists, and an `osm3s.timestamp_osm_base` of «116218»
            # where a healthy instance reports an ISO date. Anything that does
            # not look like a date is treated as a failed request.
            base = str((d.get("osm3s") or {}).get("timestamp_osm_base") or "")
            if not re.match(r"^\d{4}-\d{2}-\d{2}T", base):
                return
            box.append(d)
        except Exception:  # noqa: BLE001
            pass

    def build():
        n = len(OVERPASS_ENDPOINTS)
        for attempt in range(2 * n):
            # A socket timeout only fires on silence, and a loaded Overpass
            # mirror answers by trickling — which is how one query held a whole
            # run for twenty minutes. The request therefore runs in a thread
            # with a hard join, and a mirror that has not finished by then is
            # abandoned rather than waited on.
            box = []
            t = threading.Thread(target=fetch, args=(OVERPASS_ENDPOINTS[attempt % n], box), daemon=True)
            t.start()
            t.join(OVERPASS_TIMEOUT_S)
            if box:
                return box[0].get("elements", [])
            # Sleep only once the whole rotation has been tried, so a single
            # busy mirror costs a retry rather than a wait.
            if attempt % n == n - 1:
                time.sleep(5 * (attempt // n + 1))
        return None

    path = os.path.join(CACHE, key + ".json")
    if not (os.path.exists(path) and os.path.getsize(path) > 1):
        if OFFLINE[0] or _overpass_failures[0] >= OVERPASS_GIVE_UP_AFTER:
            return None
    got = _cache_get(key, build)
    if got is None:
        _overpass_failures[0] += 1
    return got


def nodes_of(elements):
    out = []
    for el in elements:
        for n in el.get("geometry") or []:
            out.append((n["lat"], n["lon"]))
    return out


def bearing(lat1, lng1, lat2, lng2):
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dl = math.radians(lng2 - lng1)
    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def bbox_centre(points):
    lats = [p[0] for p in points]
    lngs = [p[1] for p in points]
    mid = ((min(lats) + max(lats)) / 2, (min(lngs) + max(lngs)) / 2)
    radius = max(haversine(mid[0], mid[1], p[0], p[1]) for p in points)
    return mid, radius


def flat_runs(elevations, minimum=2):
    """Indices of runs of identical stored elevation.

    A lake surface in DTM1 is exactly constant, so a run of equal elevations is
    where standing water can be — and querying only those is what turns 15 000
    terrain-class lookups into a few hundred. Flat ground produces runs too;
    they cost one lookup each and come back as bog or open ground.
    """
    runs = []
    i = 0
    while i < len(elevations):
        j = i
        while j + 1 < len(elevations) and elevations[j + 1] == elevations[i]:
            j += 1
        if j - i + 1 >= minimum:
            runs.append((i, j))
        i = j + 1
    return runs


def segment_lengths(points):
    return [0.0] + [
        haversine(a[0], a[1], b[0], b[1]) for a, b in zip(points, points[1:])
    ]


def guide_text(guides, slug):
    g = guides.get(slug)
    if not g:
        return ""
    parts = []
    for lang in ("no", "en"):
        t = g.get(lang) or {}
        parts += [t.get("intro", ""), t.get("caption", "")]
        parts += list(t.get("ascent") or []) + list(t.get("descent") or [])
        parts += [a.get("body", "") for a in (t.get("avalanche") or [])]
    return " ".join(parts)


def water_vertices(slug, rec):
    """Indices of vertices whose terrain class is standing water.

    Shared by the water and trail checks: the second needs it because a mapped
    summer path goes *around* a lake that a winter line crosses, and measuring
    the ski route's deviation over the ice is measuring the season, not an error.
    """
    pts, zs = rec["points"], rec["elevations"]
    on = []  # (index, elevation, terrain class)
    for i, j in flat_runs(zs):
        # Probe the middle of the run first. Most flat runs are bog or a plateau,
        # and one lookup rules those out; only a run that comes back as water is
        # worth resolving vertex by vertex to get its true extent. Over 75 tours
        # that is the difference between twelve thousand lookups and three.
        if dtm_class(pts[(i + j) // 2][0], pts[(i + j) // 2][1])["t"] not in WATER_CLASSES:
            continue
        for k in range(i, j + 1):
            got = dtm_class(pts[k][0], pts[k][1])
            if got["t"] in WATER_CLASSES:
                on.append((k, zs[k], got["t"]))
    return on


def check_water(slug, rec, text, on):
    """Where the line stands on water, and whether the guide admits it."""
    if not on:
        return []
    pts = rec["points"]
    seg = segment_lengths(pts)
    findings = []
    # Group contiguous water vertices into crossings, so a route over three
    # tarns reports three of them rather than one summed number.
    groups = []
    run = [on[0]]
    for entry in on[1:]:
        if entry[0] - run[-1][0] <= 2:
            run.append(entry)
        else:
            groups.append(run)
            run = [entry]
    groups.append(run)

    findings = []
    for n, grp in enumerate(groups):
        first, last = grp[0][0], grp[-1][0]
        metres = sum(seg[k] for k in range(first + 1, last + 1))
        level = grp[0][1]
        regulated = any(t == REGULATED for _, _, t in grp)
        # A metre or two of line reading as lake is the router clipping a
        # corner at the resolution of the terrain model, not a crossing.
        if metres < WATER_FLOOR_M and not regulated:
            continue
        mid_pt = pts[(first + last) // 2]
        water = nodes_of(
            overpass(
                f"water_{slug}_{n}_{level}",
                WATER_QUERY.format(lat=f"{mid_pt[0]:.5f}", lng=f"{mid_pt[1]:.5f}"),
            )
            or []
        )
        offshore = None
        if water:
            offshore = max(
                min(haversine(pts[k][0], pts[k][1], a, b) for a, b in water)
                for k, _, _ in grp
            )
        near_shore = offshore is not None and offshore < WATER_OFFSHORE_M
        # Does the prose name this height at all? Match the level and its
        # neighbours, because prose rounds. This is a triage aid and not a
        # verdict: Okla's line named 1277 in order to say it stayed *above*
        # Mjølkskåla, while running 495 m across it. A named height means a
        # reader should look, not that the crossing is disclosed.
        mentioned = any(str(level + d) in text for d in (-1, 0, 1))
        # A short brush near the shore is a skin track cutting a corner and
        # needs no telling — unless the water is a reservoir nobody named.
        if metres < WATER_REPORT_M and near_shore and (mentioned or not regulated):
            continue
        note = "note: " if (mentioned and not regulated) else ""
        findings.append(
            f"{note}{metres:.0f} m on water at {level} m"
            + (f", up to {offshore:.0f} m from the mapped shore" if offshore is not None
               else ", offshore distance unknown (no water polygon returned)")
            + (" — REGULATED lake" if regulated else "")
            + (" — the guide names that height, which is not the same as saying it crosses it"
               if mentioned else " — and the guide never names that height")
        )
    return findings


def check_trail(slug, rec, text, on_water, trail_els):
    """A tour that promises a marked line, measured against the mapped one.

    The claim is only enforced where it can be: when a mapped trail reaches both
    the trailhead and the summit, the whole line is supposed to be on it, and a
    kilometre-wide detour is a defect. Where the trail covers only part of the
    route — Kråkfjellet's skogsbilveg runs three kilometres of nine, and the rest
    is open fjell with nothing mapped to follow — the deviation above it says
    nothing, so it is reported as a note rather than a finding.
    """
    claims = [
        m
        for m in TRAIL_WORDS.finditer(text)
        if not TRAIL_DENIAL.search(text[max(0, m.start() - 40): m.start()])
    ]
    if not claims:
        return []
    quoted = claims[0].group(0)
    if trail_els is None:
        return [f"note: says «{quoted}» — UNCHECKED, Overpass would not answer"]
    pts = rec["points"]
    nodes = nodes_of(trail_els)
    if not nodes:
        return [f"note: says «{quoted}», but Overpass returned no mapped trail to check it against"]

    seg = segment_lengths(pts)
    wet = {k for k, _, _ in on_water}
    worst = (0.0, 0.0, 0)
    off = 0.0
    cum = 0.0
    for i, p in enumerate(pts):
        cum += seg[i]
        # A mapped path cannot cross a lake, and a winter route can. Besshø's
        # line runs three and a half kilometres over the ice on Bessvatnet while
        # the summer trail goes round the shore — that gap is the season, not a
        # defect, so the ice is left out of the measurement.
        if i in wet:
            continue
        d = min(haversine(p[0], p[1], a, b) for a, b in nodes)
        if d > TRAIL_REPORT_M:
            off += seg[i]
        if d > worst[0]:
            worst = (d, cum, rec["elevations"][i])

    d_start = min(haversine(pts[0][0], pts[0][1], a, b) for a, b in nodes)
    d_top = min(haversine(pts[-1][0], pts[-1][1], a, b) for a, b in nodes)
    end_to_end = d_start <= TRAIL_END_M and d_top <= TRAIL_END_M
    if not end_to_end:
        return [
            f"note: says «{quoted}», but no mapped trail reaches both ends "
            f"(trailhead {d_start:.0f} m, summit {d_top:.0f} m) — the claim covers part of the "
            f"line only, so its {worst[0]:.0f} m worst gap is not a verdict"
        ]
    if worst[0] < TRAIL_REPORT_M:
        return []
    return [
        f"says «{quoted}» and a mapped trail runs the whole way (trailhead {d_start:.0f} m, "
        f"summit {d_top:.0f} m), but the line strays {worst[0]:.0f} m from it "
        f"({worst[1]:.0f} m out, {worst[2]} m), with {off:.0f} m of {cum:.0f} beyond "
        f"{TRAIL_REPORT_M:.0f} m"
    ]


def check_side(slug, rec, text, stream_els):
    """«til høyre for Veslebekken» — measured rather than repeated.

    Which way is right depends on which way you are walking, and this resolves
    that from the trailhead-to-summit bearing. That only works where the tour
    runs broadly north or south, so a route that runs east or west is reported
    as unmeasurable rather than answered with a coin flip.
    """
    claims = SIDE_RE.findall(text)
    if not claims:
        return []
    if stream_els is None:
        return ["note: names a right/left-of-stream side — UNCHECKED, Overpass would not answer"]
    pts = rec["points"]
    course = abs(((bearing(pts[0][0], pts[0][1], pts[-1][0], pts[-1][1]) + 90) % 180) - 90)
    if course > 45:
        return [
            f"note: names a right/left-of-stream side, but the tour runs broadly east–west, "
            f"so which side is 'right' is not decidable from the course"
        ]
    ways = stream_els
    findings = []
    for _, hand, name in claims:
        want_right = hand.lower().startswith("hø")
        base = name.rstrip(".,;:").lower()
        # The register and the guidebooks disagree about the joining vowel —
        # OSM has Veslbekken where ut.no writes Veslebekken — so names are
        # compared with every «e» dropped from both sides.
        match = [
            w
            for w in ways
            if (w.get("tags", {}).get("name") or "").lower().replace("e", "") == base.replace("e", "")
        ]
        if not match:
            findings.append(f"names «{name}» but no mapped waterway of that name is near the line")
            continue
        geom = nodes_of(match)
        # Which side, at the vertices that are actually near the stream: the
        # sign of the longitude difference, on a route whose overall direction
        # of travel decides what "right" means.
        travel_north = pts[-1][0] > pts[0][0]
        sides = []
        for i, p in enumerate(pts):
            near = [n for n in geom if abs(n[0] - p[0]) < 0.0015]
            if not near:
                continue
            n = min(near, key=lambda n: haversine(p[0], p[1], n[0], n[1]))
            if haversine(p[0], p[1], n[0], n[1]) > 1500:
                continue
            east = p[1] > n[1]
            sides.append(east if travel_north else not east)
        if not sides:
            continue
        on_right = sum(sides) / len(sides)
        if want_right and on_right < 0.5:
            findings.append(
                f"says the line runs to the right of {name}, but {100 * (1 - on_right):.0f}% "
                f"of the vertices beside it are on the left"
            )
        if not want_right and on_right > 0.5:
            findings.append(
                f"says the line runs to the left of {name}, but {100 * on_right:.0f}% "
                f"of the vertices beside it are on the right"
            )
    return findings


def main():
    routes = json.load(open("routes.json"))
    guides = json.load(open("guides.json"))
    args = sys.argv[1:]
    if "--offline" in args:
        OFFLINE[0] = True
        args.remove("--offline")
        print("--offline: the terrain model only; trails and stream sides go unchecked")
    only = set(args)
    todo = {s: r for s, r in routes.items() if not only or s in only}

    bad = []
    print(f"{'tour / route':<34}{'water':>7}{'trail':>7}  findings", flush=True)
    for slug in sorted(todo):
        text = guide_text(guides, slug)
        for rec in todo[slug]:
            on_water = water_vertices(slug, rec)
            trail_els, stream_els = ground(slug, rec)
            findings = []
            findings += check_water(slug, rec, text, on_water)
            findings += check_trail(slug, rec, text, on_water, trail_els)
            findings += check_side(slug, rec, text, stream_els)
            w = sum(1 for f in findings if "on water" in f and not f.startswith("note:"))
            t = sum(1 for f in findings if "mapped trail" in f and not f.startswith("note:"))
            print(f"{slug + ' / ' + rec['id']:<34}{w:>7}{t:>7}  {'; '.join(findings)}", flush=True)
            for f in findings:
                if not f.startswith("note:"):
                    bad.append(f"{slug}/{rec['id']}: {f}")

    total = sum(len(v) for v in todo.values())
    print(f"\n{len(todo)} tours, {total} routes — " + ("clean" if not bad else f"{len(bad)} need a look"))
    for b in bad:
        print("  -", b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
