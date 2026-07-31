"""Write the guides into the app: lib/guides.ts, GUIDE_EN, seed.sql, hasGuide.

The elevation profile is not editorial — it is the real route, so the SVG path and
the three labels are computed from routes.json rather than left to a writer. Only
the caption underneath is prose.
"""

import json
import os
import re

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


def emit_guides_ts(guides, facts, order):
    chunks = [HEADER, "export const GUIDES: Record<string, TourGuide> = {\n"]
    for slug in order:
        if slug not in guides:
            continue
        g = guides[slug]["no"]
        pr = profile_of(facts, slug)
        key = slug if "-" not in slug else q(slug)
        chunks.append(f"  {key}: {{\n")
        chunks.append(f"    slug: {q(slug)},\n")
        chunks.append(f"    intro:\n      {q(g['intro'])},\n")
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
    path = os.path.join(REPO, "lib", "guides.ts")
    open(path, "w").write("".join(chunks))
    print(f"wrote {path} ({len(guides)} guides, {os.path.getsize(path)//1024} KB)")


def emit_guide_en(guides, facts, order):
    """Replace the GUIDE_EN literal in lib/i18n/content.ts, leaving the rest alone."""
    path = os.path.join(REPO, "lib", "i18n", "content.ts")
    src = open(path).read()
    start = src.index("export const GUIDE_EN: Record<string, GuideTextEn> = {")
    end = src.index("\n};\n", start) + len("\n};\n")

    chunks = ["export const GUIDE_EN: Record<string, GuideTextEn> = {\n"]
    for slug in order:
        if slug not in guides:
            continue
        g = guides[slug]["en"]
        pr = profile_of(facts, slug)
        key = slug if "-" not in slug else q(slug)
        chunks.append(f"  {key}: {{\n")
        chunks.append(f"    intro:\n      {q(g['intro'])},\n")
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
        chunks.append(
            "    elevationProfile: {\n"
            f"      startLabel: {q(pr['startEn'])},\n"
            f"      endLabel: {q(pr['endEn'])},\n"
            f"      distanceLabel: {q(pr['distEn'])},\n"
            f"      caption: {q(g['caption'])},\n"
            "    },\n"
        )
        chunks.append("  },\n")
    chunks.append("};\n")

    open(path, "w").write(src[:start] + "".join(chunks) + src[end:])
    print(f"wrote GUIDE_EN in {path}")


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
    marker = "-- ============================================================================\n-- Kirketaket"
    if marker in src:
        src = src[: src.index(marker)]
    else:
        src = src[: src.index("update public.tk_tours set")]

    out = [
        src.rstrip() + "\n\n",
        "-- ============================================================================\n",
        "-- Written guides — all 24 tours\n",
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
    guides = json.load(open("guides_swarm.json"))
    facts = json.load(open("guide_facts.json"))
    order = list(json.load(open("tourmeta.json")).keys())

    emit_guides_ts(guides, facts, order)
    emit_guide_en(guides, facts, order)
    set_has_guide(guides)
    emit_seed(guides, order)


if __name__ == "__main__":
    main()
