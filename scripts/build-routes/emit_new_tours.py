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
"""

import json
import os
import re

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


def rewrite_teasers_en(teasers):
    path = os.path.join(REPO, "lib", "i18n", "content.ts")
    src = open(path).read()
    anchor = "export const TOUR_TEASER_EN: Record<string, string> = {"
    start = src.index(anchor) + len(anchor)
    end = src.index("\n};", start)
    block = src[start:end]
    for slug, text in teasers.items():
        if f"\n  {slug}:" in block or f'\n  "{slug}":' in block:
            continue
        key = slug if re.fullmatch(r"[a-z][a-z0-9]*", slug) else f'"{slug}"'
        body = json.dumps(text, ensure_ascii=False)
        line = f"  {key}:\n    {body},"
        block += ("" if block.endswith("\n") else "\n") + line + "\n"
    open(path, "w").write(src[:start] + block + src[end:])
    print(f"lib/i18n/content.ts: +{len(teasers)} English teasers")


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

    ts_rows, sql_rows, teasers = {}, {}, {}
    skipped = []
    for slug, (name, region) in NEW_TOURS.items():
        if slug not in metrics or slug not in meta:
            skipped.append(slug)
            continue
        s, m, mt = summits[slug], metrics[slug], meta[slug]
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
    with open("tourmeta.json", "w") as f:
        json.dump(tourmeta, f, indent=1, ensure_ascii=False)
    print(f"tourmeta.json: {len(tourmeta)} tours")
    if skipped:
        print("\nno route or no research, left off the map:")
        for slug in skipped:
            print("  -", slug)


if __name__ == "__main__":
    main()
