"""Write the guides into the app: lib/guides.ts, GUIDE_EN, seed.sql, hasGuide.

The elevation profile is not editorial — it is the real route, so the SVG path and
the three labels are computed from routes.json rather than left to a writer. Only
the caption underneath is prose.

    python3 emit_guides.py                  # every guide in guides.json
    python3 emit_guides.py besshoe jakta    # only these, leaving the rest alone

Naming slugs rewrites those blocks and splices them into the existing files in
tourmeta order; every other guide is copied through byte for byte. That matters
because a guide's prose and its profile are written against the same geometry at
the same time: re-emitting a tour whose line has since been re-routed would give
it a new distance label under a caption that still quotes the old one. Adding
tours is therefore a per-slug operation, and bringing older guides up to a newer
`lib/routes.ts` is a separate job that has to touch their numbers too.
"""

import json
import os
import re
import sys

REPO = "/home/user/Toppkart"


def q(s):
    """A TypeScript double-quoted string."""
    return json.dumps(s, ensure_ascii=False)


def sq(s):
    """A SQL single-quoted string."""
    return "'" + s.replace("'", "''") + "'"


def no_num(x, decimals=1):
    """Norwegian decimal comma."""
    return f"{x:.{decimals}f}".replace(".", ",")


def profile_of(facts, slug):
    p = facts[slug]["routes"][0]
    return {
        "path": p["svgPath"],
        "startNo": f"{p['startM']} moh",
        "endNo": f"{facts[slug]['summitClaimM']} moh",
        "distNo": f"{no_num(p['distanceM']/1000)} km",
        "startEn": f"{p['startM']} m",
        "endEn": f"{facts[slug]['summitClaimM']} m",
        "distEn": f"{p['distanceM']/1000:.1f} km",
    }


MARKER_NO = "export const GUIDES: Record<string, TourGuide> = {"
MARKER_EN = "export const GUIDE_EN: Record<string, GuideTextEn> = {"

HEADER = '''/** Redaksjonelt guideinnhold — den delen av en tur som ligger bak abonnement.
 *
 *  Teksten er skrevet mot rutedataene i `lib/routes.ts`: hver høydeprofil er den
 *  faktiske linja kartet tegner, og tallene i prosaen — starthøyde, topp,
 *  distanse, bratteste parti, skoggrense — er hentet fra Kartverkets 1 m
 *  terrengmodell langs den ruta. Terrengbeskrivelsene bygger på ruteresearchen og
 *  revisjonen som ligger i `scripts/build-routes/corridors.json`, som navngir de
 *  skavlene, hammerne og bratthengene som faktisk finnes.
 *
 *  ⚠️  Dette er likevel ikke et kvalitetssikret turkart. Geometrien er beregnet,
 *  ikke gått med GPS, og skredvurderingen for dagen står i skredvarselet — ikke
 *  her. Sjekk varsom.no, og bruk eget hode i felt.
 *
 *  I produksjon ligger disse feltene i `tours`-tabellen i Supabase
 *  (description_up, description_down, avalanche_notes, gpx_path) med RLS som
 *  bare slipper gjennom brukere med status trialing/active. Denne modulen er
 *  seeden og den lokale fallbacken, på linje med `lib/tours.ts`.
 *
 *  Generert — se scripts/build-routes/ for pipelinen.
 */

import type { Grade, TourGuide } from "./types";

/** Gradskalaen slik den vises i kartet og på guidesiden (grad 1–4). */
export const GRADE_LABELS: Record<Grade, string> = {
  1: "Enkel",
  2: "Middels",
  3: "Krevende",
  4: "Ekspert",
};

'''


def existing_blocks(src, marker):
    """The guide blocks already in a file, verbatim, keyed by slug.

    Everything from the `  slug: {` line to its closing `  },` — the text this
    emitter would otherwise regenerate, kept exactly as it shipped.
    """
    start = src.index(marker)
    end = src.index("\n};\n", start)
    body = src[start:end]
    heads = [(m.group(1), m.start()) for m in re.finditer(r'\n  "?([a-z0-9-]+)"?: \{\n', body)]
    out = {}
    for i, (slug, pos) in enumerate(heads):
        stop = heads[i + 1][1] if i + 1 < len(heads) else len(body)
        # The last block stops where the literal's own "\n};" begins, so it is
        # the one arriving without its trailing newline. Give it one back.
        out[slug] = body[pos:stop].strip("\n") + "\n"
    return out


def guide_block_ts(slug, guides, facts):
    """One guide's block in lib/guides.ts, prose from guides.json, profile from facts."""
    g = guides[slug]["no"]
    pr = profile_of(facts, slug)
    key = slug if "-" not in slug else q(slug)
    chunks = [
        f"  {key}: {{\n",
        f"    slug: {q(slug)},\n",
        f"    intro:\n      {q(g['intro'])},\n",
    ]
    chunks += prose_fields(g)
    chunks.append(
        "    elevationProfile: {\n"
        f"      path: {q(pr['path'])},\n"
        f"      startLabel: {q(pr['startNo'])},\n"
        f"      endLabel: {q(pr['endNo'])},\n"
        f"      distanceLabel: {q(pr['distNo'])},\n"
        f"      caption: {q(g['caption'])},\n"
        "    },\n"
    )
    chunks.append("  },\n")
    return "".join(chunks)


def guide_block_en(slug, guides, facts):
    """One guide's block in GUIDE_EN. No path — the English page draws the same one."""
    g = guides[slug]["en"]
    pr = profile_of(facts, slug)
    key = slug if "-" not in slug else q(slug)
    chunks = [f"  {key}: {{\n", f"    intro:\n      {q(g['intro'])},\n"]
    chunks += prose_fields(g)
    chunks.append(
        "    elevationProfile: {\n"
        f"      startLabel: {q(pr['startEn'])},\n"
        f"      endLabel: {q(pr['endEn'])},\n"
        f"      distanceLabel: {q(pr['distEn'])},\n"
        f"      caption: {q(g['caption'])},\n"
        "    },\n"
    )
    chunks.append("  },\n")
    return "".join(chunks)


def prose_fields(g):
    """ascent, descent and avalanche — identical in both languages' literals."""
    chunks = []
    for field in ("ascent", "descent"):
        chunks.append(f"    {field}: [\n")
        for p in g[field]:
            chunks.append(f"      {q(p)},\n")
        chunks.append("    ],\n")
    chunks.append("    avalanche: [\n")
    for a in g["avalanche"]:
        chunks.append(
            "      {\n"
            f"        title: {q(a['title'])},\n"
            f"        body: {q(a['body'])},\n"
            "      },\n"
        )
    chunks.append("    ],\n")
    return chunks


def splice(path, marker, order, targets, build):
    """Rewrite `targets` inside the record literal at `marker`, keep the rest verbatim.

    Blocks come out in `order` — tourmeta's order, which is also lib/tours.ts's —
    so a guide added later still lands beside its neighbours rather than at the end.
    """
    src = open(path).read()
    start = src.index(marker)
    end = src.index("\n};\n", start) + len("\n};\n")
    kept = existing_blocks(src, marker)
    written = 0
    out = [marker + "\n"]
    for slug in order:
        if slug in targets:
            out.append(build(slug))
            written += 1
        elif slug in kept:
            out.append(kept[slug])
    out.append("};\n")
    open(path, "w").write(src[:start] + "".join(out) + src[end:])
    return written, len(out) - 2 - written


def emit_guides_ts(guides, facts, order, targets):
    path = os.path.join(REPO, "lib", "guides.ts")
    if not os.path.exists(path) or targets >= set(existing_blocks(open(path).read(), MARKER_NO)):
        # Nothing to preserve: write the file from scratch, header and all.
        chunks = [HEADER, MARKER_NO + "\n"]
        chunks += [guide_block_ts(s, guides, facts) for s in order if s in targets]
        chunks.append("};\n\n")
        chunks.append(
            "export function getGuide(slug: string): TourGuide | undefined {\n"
            "  return GUIDES[slug];\n"
            "}\n\n"
            "/** Slugs som faktisk har en skrevet guide — brukes av `generateStaticParams`. */\n"
            "export function guideSlugs(): string[] {\n"
            "  return Object.keys(GUIDES);\n"
            "}\n"
        )
        open(path, "w").write("".join(chunks))
        wrote, kept = len(targets), 0
    else:
        wrote, kept = splice(path, MARKER_NO, order, targets,
                             lambda s: guide_block_ts(s, guides, facts))
    print(f"wrote {path} ({wrote} emitted, {kept} kept, {os.path.getsize(path)//1024} KB)")


def emit_guide_en(guides, facts, order, targets):
    """Replace the GUIDE_EN literal in lib/i18n/content.ts, leaving the rest alone."""
    path = os.path.join(REPO, "lib", "i18n", "content.ts")
    wrote, kept = splice(path, MARKER_EN, order, targets,
                         lambda s: guide_block_en(s, guides, facts))
    print(f"wrote GUIDE_EN in {path} ({wrote} emitted, {kept} kept)")


def set_has_guide(guides):
    """Every tour with a guide gets hasGuide: true; any without loses it."""
    path = os.path.join(REPO, "lib", "tours.ts")
    lines = open(path).read().splitlines(keepends=True)
    added = removed = 0
    for i, line in enumerate(lines):
        m = re.search(r'slug: "([^"]+)"', line)
        if not m:
            continue
        slug = m.group(1)
        has = "hasGuide: true," in line
        want = slug in guides
        if want and not has:
            lines[i] = line.replace(" teaser:", " hasGuide: true, teaser:", 1)
            added += 1
        elif has and not want:
            lines[i] = line.replace("hasGuide: true, ", "", 1)
            removed += 1
    open(path, "w").write("".join(lines))
    print(f"lib/tours.ts: hasGuide +{added} -{removed}")


def emit_seed(guides, order):
    """Rebuild the editorial block at the end of seed.sql."""
    path = os.path.join(REPO, "supabase", "seed.sql")
    src = open(path).read()
    banner = "-- ============================================================================\n"
    # Cut the previously generated block off before writing a new one. The old
    # marker was the first guide's name, so it stopped matching the moment a tour
    # sorted ahead of Kirketaket — and the fallback (cut at the first `update`)
    # left the generated header standing, so every re-emit stacked another copy
    # of it. Cut on the header itself instead; it is the one line this function
    # is guaranteed to have written.
    generated = "-- Written guides — all"
    marker = banner + "-- Kirketaket"
    if generated in src:
        src = src[: src.rindex(banner, 0, src.index(generated))]
    elif marker in src:
        src = src[: src.index(marker)]
    else:
        src = src[: src.index("update public.tk_tours set")]

    out = [
        src.rstrip() + "\n\n",
        "-- ============================================================================\n",
        f"-- Written guides — all {len([s for s in order if s in guides])} tours\n",
        "-- ----------------------------------------------------------------------------\n",
        "-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so\n",
        "-- the database seed and the local fallback cannot drift apart. Paragraphs in\n",
        "-- the description columns are separated by a blank line.\n",
        "--\n",
        "-- The prose is written against the real route geometry: the numbers in it come\n",
        "-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is\n",
        "-- still not a substitute for the day's avalanche forecast.\n",
        "-- ============================================================================\n\n",
    ]
    for slug in order:
        if slug not in guides:
            continue
        g = guides[slug]["no"]
        up = "\n\n".join(g["ascent"])
        down = "\n\n".join(g["descent"])
        out.append("update public.tk_tours set\n")
        out.append(f"  description_up   = {sq(up)},\n")
        out.append(f"  description_down = {sq(down)},\n")
        out.append("  avalanche_notes  = jsonb_build_array(\n")
        parts = []
        for a in g["avalanche"]:
            parts.append(
                "    jsonb_build_object(\n"
                f"      'title', {sq(a['title'])},\n"
                f"      'body',  {sq(a['body'])}\n"
                "    )"
            )
        out.append(",\n".join(parts) + "\n  )\n")
        out.append(f"where slug = {sq(slug)};\n\n")

    out.append(
        "-- gpx_path stays NULL everywhere: the GPX served by app/api/gpx/[slug] is\n"
        "-- generated from lib/routes.ts, not from a recorded track uploaded to\n"
        "-- Supabase Storage. Set this once surveyed files exist.\n"
    )
    open(path, "w").write("".join(out))
    print(f"wrote {path} ({os.path.getsize(path)//1024} KB)")


def main():
    guides = json.load(open("guides.json"))
    facts = json.load(open("guide_facts.json"))
    order = list(json.load(open("tourmeta.json")).keys())

    targets = set(sys.argv[1:]) or set(guides)
    unknown = targets - set(guides)
    if unknown:
        raise SystemExit(f"no guide written for: {', '.join(sorted(unknown))}")

    emit_guides_ts(guides, facts, order, targets)
    emit_guide_en(guides, facts, order, targets)
    # hasGuide and the seed are derived from the whole file either way: a slug
    # has a guide or it does not, and the seed is one block of SQL.
    set_has_guide(guides)
    emit_seed(guides, order)


if __name__ == "__main__":
    main()
