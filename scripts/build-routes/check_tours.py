"""Every elevation the app states, against the source it claims to come from.

`check_routes.py` checks the geometry and `check_guides.py` checks the prose.
This checks the numbers on the tour card — the ones a reader compares against a
map before leaving the house — and the places those numbers are copied to.

Five assertions, all of them things that have gone wrong at least once:

  summitM      is Kartverket's 1 m terrain model at the resolved summit, rounded.
               `verticalM` originally held the peak's published *altitude* in
               eight tours (README, "The bug that caused most of this"), and the
               fix was to single-source every height from DTM1. A card that
               carries a published figure instead is only visible if something
               compares the two.
  verticalM    is the cumulative ascent of the tour's **first** route, to within
               10 m. The README names this as the invariant to assert.
  lat/lng      is the resolved summit, not the prototype's coordinate. Slogen's
               was 18 km off once.
  profile      the elevation profile's end label is drawn from `summitClaimM`
               while the line under it is drawn from the routed elevations. They
               come from different files and can drift apart — Folarskardnuten's
               label said 1927 for a while after its summit moved.
  seed.sql     holds the same rows again for the database. Two copies of a number
               is one copy too many unless something checks them. Every column
               is compared, not just the four numeric ones: five teasers drifted
               — Glittertinden's seed row said «1180 høydemeter» beside a
               vertical_m of 1228 — and a check of lat/lng/summit/vertical
               walked past all five.
  content.ts   the English teaser quotes the same figures as the Norwegian one.
               The same five tours had an English teaser two corrections behind.
  tourmeta.json  the pipeline's copy of the row, which `guide_facts.py` and
               `emit_guides.py` read. Fifty tours carried `hasGuide: false`
               there against `true` in the app; `sync_tourmeta.py` fixes it.

    python3 check_tours.py

Exits non-zero if anything needs a look. Run after any hand edit to a tour row.
"""

import json
import os
import re
import sys

from geo import haversine

REPO = "/home/user/Toppkart"

SUMMIT_TOL_M = 2.0      # rounding, and nothing else
VERTICAL_TOL_M = 10.0   # the README's invariant
COORD_TOL_M = 1.0       # the row is the resolved summit or it is not
TEASER_TOL_M = 15.0     # a teaser rounds; it does not disagree

ROW = re.compile(
    r'\{ slug: "([^"]+)", name: "([^"]+)", region: "([^"]+)", lat: ([\d.]+), lng: ([\d.]+), '
    r'summitM: (\d+), verticalM: (\d+)'
)
TEASER = re.compile(r'\{ slug: "([^"]+)".*?teaser: "((?:[^"\\]|\\.)*)"')
TEASER_NUM = re.compile(r"(?<![\d,])(\d{3,4})(?=\s*(?:høydemeter|høgdemeter))")
# The first 24 rows are column-aligned with runs of spaces, the later ones use a
# single space, and Galdhøpiggen's has none at all after its region, so every
# separator here is `,\s*`. A single-space pattern matched 44 of the 68 and said
# nothing about the other 24 — which is how a check comes back clean on the half
# of the file it can see.
SEED_ROW = re.compile(
    r"\('([a-z0-9-]+)',\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)',\s*([\d.]+),\s*([\d.]+),\s*(\d+),\s*(\d+),"
    r"\s*'([^']*)',\s*(\d),\s*'([^']*)',\s*'([^']*)',\s*'((?:[^']|'')*)',\s*(true|false)\)"
)
FULL_ROW = re.compile(
    r'\{ slug: "([^"]+)", name: "([^"]+)", region: "([^"]+)", lat: ([\d.]+), lng: ([\d.]+), '
    r'summitM: (\d+), verticalM: (\d+), duration: "([^"]+)", grade: (\d), aspect: "([^"]+)", '
    r'season: "([^"]+)", (?:hasGuide: (true|false), )?teaser: "((?:[^"\\]|\\.)*)"'
)
# An English teaser in lib/i18n/content.ts: `slug: "…",` or `"slug-with-dash": "…",`.
EN_TEASER = re.compile(r'^\s*"?([a-z0-9-]+)"?:\s*\n?\s*"((?:[^"\\]|\\.)*)",', re.M)
NUMBER = re.compile(r"\d+(?:[.,]\d+)?")
PROFILE = re.compile(
    r'slug: "([^"]+)",(?:.|\n)*?startLabel: "(\d+) moh",\n\s*endLabel: "(\d+) moh"'
)


def tours_ts():
    src = open(os.path.join(REPO, "lib", "tours.ts")).read()
    rows = {
        m.group(1): {
            "name": m.group(2), "region": m.group(3),
            "lat": float(m.group(4)), "lng": float(m.group(5)),
            "summitM": int(m.group(6)), "verticalM": int(m.group(7)),
        }
        for m in ROW.finditer(src)
    }
    teasers = {m.group(1): m.group(2) for m in TEASER.finditer(src)}
    return rows, teasers


def main():
    rows, teasers = tours_ts()
    summits = json.load(open("summits.json"))
    routes = json.load(open("routes.json"))
    problems = []

    print(f"{'tour':<20}{'summit':>8}{'DTM':>9}{'vert':>7}{'routed':>8}{'coord':>8}")
    for slug, r in sorted(rows.items()):
        s = summits.get(slug)
        recs = routes.get(slug)
        if not s or not recs:
            problems.append(f"{slug}: no resolved summit or no routed line")
            continue
        d_sum = r["summitM"] - s["summit_dtm"]
        d_vert = r["verticalM"] - recs[0]["gainM"]
        d_pos = haversine(r["lat"], r["lng"], s["lat"], s["lng"])
        flags = []
        if abs(d_sum) > SUMMIT_TOL_M:
            flags.append(f"summit {d_sum:+.1f} m from DTM1 ({s['summit_dtm']})")
        if abs(d_vert) > VERTICAL_TOL_M:
            flags.append(f"vertical {d_vert:+.0f} m from the routed gain ({recs[0]['gainM']})")
        if d_pos > COORD_TOL_M:
            flags.append(f"coordinate {d_pos:.0f} m from the resolved summit")
        if flags:
            problems += [f"{slug}: {f}" for f in flags]
            print(f"{slug:<20}{r['summitM']:>8}{s['summit_dtm']:>9.1f}{r['verticalM']:>7}"
                  f"{recs[0]['gainM']:>8}{d_pos:>7.0f}m  <-- {'; '.join(flags)}")

    # A teaser that quotes its own vertical quotes the card's.
    for slug, text in teasers.items():
        m = TEASER_NUM.search(text)
        if m and slug in rows and abs(int(m.group(1)) - rows[slug]["verticalM"]) > TEASER_TOL_M:
            problems.append(
                f"{slug}: teaser says {m.group(1)} m, the card says {rows[slug]['verticalM']} m"
            )

    # The profile's labels against the line drawn under them.
    guides = open(os.path.join(REPO, "lib", "guides.ts")).read()
    n_profiles = 0
    for m in PROFILE.finditer(guides):
        slug, start, end = m.group(1), int(m.group(2)), int(m.group(3))
        n_profiles += 1
        rec = (routes.get(slug) or [None])[0]
        if not rec:
            continue
        if abs(start - rec["elevations"][0]) > 1:
            problems.append(f"{slug}: profile starts at {start} m, the line at {rec['elevations'][0]}")
        if abs(end - rec["elevations"][-1]) > 1:
            problems.append(f"{slug}: profile ends at {end} m, the line at {rec['elevations'][-1]}")

    # seed.sql is the same rows again — every column of them.
    src = open(os.path.join(REPO, "lib", "tours.ts")).read()
    full = {}
    for m in FULL_ROW.finditer(src):
        full[m.group(1)] = {
            "name": m.group(2), "region": m.group(3), "lat": float(m.group(4)), "lng": float(m.group(5)),
            "summitM": int(m.group(6)), "verticalM": int(m.group(7)), "duration": m.group(8),
            "grade": int(m.group(9)), "aspect": m.group(10), "season": m.group(11),
            "hasGuide": m.group(12) == "true", "teaser": m.group(13).replace('\\"', '"'),
        }
    if set(full) != set(rows):
        problems.append("the full-row pattern does not match every tour row — has the row format changed?")
    seed = open(os.path.join(REPO, "supabase", "seed.sql")).read()
    n_seed = 0
    for m in SEED_ROW.finditer(seed):
        slug = m.group(1)
        n_seed += 1
        r = full.get(slug)
        if not r:
            problems.append(f"{slug}: in seed.sql but not in lib/tours.ts")
            continue
        got = {
            "name": m.group(2).replace("''", "'"), "region": m.group(3).replace("''", "'"),
            "lat": float(m.group(4)), "lng": float(m.group(5)), "summitM": int(m.group(6)),
            "verticalM": int(m.group(7)), "duration": m.group(8), "grade": int(m.group(9)),
            "aspect": m.group(10), "season": m.group(11), "teaser": m.group(12).replace("''", "'"),
        }
        for key, value in got.items():
            if value != r[key]:
                problems.append(f"{slug}: seed.sql {key} is {value!r}, lib/tours.ts has {r[key]!r}")
    missing = set(rows) - {m.group(1) for m in SEED_ROW.finditer(seed)}
    if missing:
        problems.append(f"in lib/tours.ts but not in seed.sql: {', '.join(sorted(missing))}")

    # The English teaser states the same figures as the Norwegian one. Compared
    # as the multiset of numbers, decimal comma read as decimal point, so a
    # translation is free to reorder a sentence but not to quote an older card.
    content = open(os.path.join(REPO, "lib", "i18n", "content.ts")).read()
    en = {}
    for m in EN_TEASER.finditer(content):
        en.setdefault(m.group(1), m.group(2))
    for slug, r in full.items():
        if slug not in en:
            problems.append(f"{slug}: no English teaser in lib/i18n/content.ts")
            continue
        want = sorted(x.replace(",", ".") for x in NUMBER.findall(r["teaser"]))
        got = sorted(x.replace(",", ".") for x in NUMBER.findall(en[slug]))
        if want != got:
            problems.append(f"{slug}: English teaser quotes {got}, the Norwegian one {want}")

    # tourmeta.json is the pipeline's copy of the same row.
    meta = json.load(open("tourmeta.json"))
    for slug, r in full.items():
        tm = meta.get(slug)
        if not tm:
            problems.append(f"{slug}: not in tourmeta.json — run sync_tourmeta.py")
            continue
        for key in ("name", "region", "summitM", "verticalM", "duration", "grade", "aspect", "season", "hasGuide"):
            if tm.get(key) != r[key]:
                problems.append(f"{slug}: tourmeta.json {key} is {tm.get(key)!r}, lib/tours.ts has {r[key]!r} — run sync_tourmeta.py")

    print(f"\n{len(rows)} tours, {n_profiles} elevation profiles, {n_seed} seed rows, {len(en)} English teasers")
    if problems:
        print("\nneeds a look:")
        for p in problems:
            print("  -", p)
        return 1
    print("clean — every card height is DTM1, every vertical is its routed gain")
    return 0


if __name__ == "__main__":
    sys.exit(main())
