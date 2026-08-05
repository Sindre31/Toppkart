"""Write the second batch of peaks into the app.

Touches four files, and rewrites rather than appends so the tour list stays in
one order — north to south — instead of becoming two lists stacked on top of each
other:

  lib/tours.ts          the TOURS rows (existing rows are re-emitted verbatim)
  lib/i18n/content.ts   the English teaser for each new tour
  supabase/seed.sql     the same rows again, for the database seed
  tourmeta.json         so the rest of the pipeline can see the new tours

Every number in a new row is measured, not chosen: `summitM` from the DTM summit,
`verticalM` and `duration` from the routed line (`route_metrics.py`). Grade,
aspect, season and the teasers come from the route research in
`new_tourmeta.json` — see `route_metrics.py` on why the terrain measurement is
the check for the first two rather than the source.

    python3 emit_new_tours.py [slug …]

**Name the slugs you are adding.** With no arguments this re-emits every tour in
`NEW_TOURS`, including the ones already on the map — and a re-emitted row is
built from today's `route_metrics.json` and today's `new_tourmeta.json`, not from
the row that shipped. Run bare while adding the Sunnmøre round and it rewrote
fifteen settled tours: `hasGuide: true` disappeared from all of them (the row
format here has no guide flag, because a tour being added does not have one), and
Hamperokken's vertical moved 1400 → 1390 and Jakta's 1560 → 1570 on nothing but a
re-measurement of an unchanged line. Existing rows are copied through byte for
byte; that is the property to rely on, and it only holds for slugs left out.
"""

import json
import os
import re
import sys

from newtours import NEW_TOURS

REPO = "/home/user/Toppkart"
ROW_RE = re.compile(r'^\s*\{ slug: "([^"]+)",.*\},\s*$')


def ts_row(slug, name, region, s, m, meta):
    """One TOURS row, formatted the way the hand-written ones are."""
    teaser = meta["teaserNo"].replace('"', '\\"')
    return (
        f'  {{ slug: "{slug}", name: "{name}", region: "{region}", '
        f'lat: {s["lat"]}, lng: {s["lng"]}, summitM: {round(s["summit_dtm"])}, '
        f'verticalM: {m["verticalM"]}, duration: "{m["duration"]}", grade: {meta["grade"]}, '
        f'aspect: "{meta["aspect"]}", season: "{meta["season"]}", '
        f'teaser: "{teaser}" }},\n'
    )


def sql_row(slug, name, region, s, m, meta):
    teaser = meta["teaserNo"].replace("'", "''")
    return (
        f"  ('{slug}', '{name}', '{region}', {s['lat']}, {s['lng']}, "
        f"{round(s['summit_dtm'])}, {m['verticalM']}, '{m['duration']}', {meta['grade']}, "
        f"'{meta['aspect']}', '{meta['season']}', '{teaser}', true)"
    )


def order(slugs, summits):
    """North to south, which is the order the first 24 are already in."""
    return sorted(slugs, key=lambda slug: -summits[slug]["lat"])


TEASER_VERTICAL = (
    re.compile(r"(?<![\d,])(\d{3,4})(?=\s*(?:høydemeter|høgdemeter))"),
    re.compile(r"(?<![\d.])(\d{3,4})(?=\s*(?:m|metres)\b[^.;:]{0,20}?(?:ascent|climbing))"),
)
TEASER_TOL_M = 15


def teaser_vertical_disagreements(slug, meta, vertical):
    """A teaser that quotes its own vertical has to quote the card's.

    The research wrote summit-minus-trailhead — Hamperokken's «1332 høydemeter»
    is exactly 1397 − 65 — while the card carries cumulative ascent, which is
    what the word means in a tour description. Both numbers were right and they
    appeared one above the other in the same card, differing by 68 m.
    """
    out = []
    for key, rx in zip(("teaserNo", "teaserEn"), TEASER_VERTICAL):
        text = meta.get(key)
        if not text:
            continue
        found = rx.search(text)
        if found and abs(int(found.group(1)) - vertical) > TEASER_TOL_M:
            out.append(f"{slug}.{key} says {found.group(1)} m, the card says {vertical} m")
    return out


def rewrite_tours(rows_by_slug, summits):
    path = os.path.join(REPO, "lib", "tours.ts")
    src = open(path).read().splitlines(keepends=True)
    existing, start, end = {}, None, None
    for i, line in enumerate(src):
        m = ROW_RE.match(line)
        if not m:
            continue
        existing[m.group(1)] = line
        start = i if start is None else start
        end = i
    if start is None:
        raise SystemExit("no TOURS rows found in lib/tours.ts")

    merged = {**existing, **rows_by_slug}
    body = [merged[slug] for slug in order(merged, summits)]
    open(path, "w").write("".join(src[:start] + body + src[end + 1 :]))
    print(f"lib/tours.ts: {len(merged)} tours ({len(rows_by_slug)} new)")


TEASER_EN_ENTRY = re.compile(
    r'^[ \t]*"?([a-z][a-z0-9-]*)"?:\s*\n?\s*("(?:[^"\\]|\\.)*"),\s*$', re.MULTILINE
)


def rewrite_teasers_en(teasers):
    """Merge, not append.

    This used to skip any slug already present, which quietly made the file
    append-only: correcting a teaser in `new_tourmeta.json` re-emitted the
    Norwegian one and left the English one carrying the old text. Same tour, two
    languages, two different numbers.
    """
    path = os.path.join(REPO, "lib", "i18n", "content.ts")
    src = open(path).read()
    anchor = "export const TOUR_TEASER_EN: Record<string, string> = {"
    start = src.index(anchor) + len(anchor)
    end = src.index("\n};", start)
    block = src[start:end]

    existing = {m.group(1): m.group(2) for m in TEASER_EN_ENTRY.finditer(block)}
    if not existing:
        raise SystemExit("no English teasers found in lib/i18n/content.ts")

    added = updated = 0
    merged = dict(existing)
    for slug, text in teasers.items():
        body = json.dumps(text, ensure_ascii=False)
        if slug not in merged:
            added += 1
        elif merged[slug] != body:
            updated += 1
        merged[slug] = body

    lines = []
    for slug, body in merged.items():
        key = slug if re.fullmatch(r"[a-z][a-z0-9]*", slug) else f'"{slug}"'
        lines.append(f"  {key}:\n    {body},")
    open(path, "w").write(src[:start] + "\n" + "\n".join(lines) + "\n" + src[end:])
    print(f"lib/i18n/content.ts: {len(merged)} English teasers (+{added} new, {updated} corrected)")


def rewrite_seed(sql_by_slug, summits):
    path = os.path.join(REPO, "supabase", "seed.sql")
    src = open(path).read()
    head = src.index("values\n") + len("values\n")
    tail = src.index(";\n", head)
    existing = {}
    for line in src[head:tail].splitlines():
        m = re.match(r"\s*\('([^']+)'", line)
        if m:
            existing[m.group(1)] = line.rstrip().rstrip(",")
    merged = {**existing, **sql_by_slug}
    rows = [merged[slug] for slug in order(merged, summits)]
    open(path, "w").write(src[:head] + ",\n".join(rows) + "\n" + src[tail:])
    print(f"supabase/seed.sql: {len(merged)} tour rows")


def main():
    summits = json.load(open("summits.json"))
    metrics = json.load(open("route_metrics.json"))
    meta = json.load(open("new_tourmeta.json"))
    tourmeta = json.load(open("tourmeta.json"))

    only = set(sys.argv[1:])
    ts_rows, sql_rows, teasers = {}, {}, {}
    skipped, mismatched = [], []
    for slug, (name, region) in NEW_TOURS.items():
        if only and slug not in only:
            continue
        if slug not in metrics or slug not in meta:
            skipped.append(slug)
            continue
        s, m, mt = summits[slug], metrics[slug], meta[slug]
        mismatched += teaser_vertical_disagreements(slug, mt, m["verticalM"])
        ts_rows[slug] = ts_row(slug, name, region, s, m, mt)
        sql_rows[slug] = sql_row(slug, name, region, s, m, mt)
        if mt.get("teaserEn"):
            teasers[slug] = mt["teaserEn"]
        tourmeta[slug] = {
            "name": name,
            "region": region,
            "summitM": round(s["summit_dtm"]),
            "verticalM": m["verticalM"],
            "duration": m["duration"],
            "grade": mt["grade"],
            "aspect": mt["aspect"],
            "season": mt["season"],
            "hasGuide": False,
        }

    rewrite_tours(ts_rows, summits)
    rewrite_teasers_en(teasers)
    rewrite_seed(sql_rows, summits)
    # Same north-to-south order as lib/tours.ts: emit_ts.py takes the order of
    # ROUTES from this file, and two files listing the same tours in different
    # orders is a diff nobody can read.
    ordered = {slug: tourmeta[slug] for slug in order(tourmeta, summits) if slug in summits}
    ordered.update({k: v for k, v in tourmeta.items() if k not in ordered})
    with open("tourmeta.json", "w") as f:
        json.dump(ordered, f, indent=1, ensure_ascii=False)
    print(f"tourmeta.json: {len(tourmeta)} tours")
    if skipped:
        print("\nno route or no research, left off the map:")
        for slug in skipped:
            print("  -", slug)
    if mismatched:
        print("\nteaser and card disagree about the vertical:")
        for line in mismatched:
            print("  -", line)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
