"""Print the writing brief for one tour: everything the guide must be true to.

Usage:  python3 guide_brief.py <slug> [<slug> ...]
"""

import json
import sys


def block(slug, f):
    t = f[slug]
    p = t["routes"][0]
    alt = t["routes"][1] if len(t["routes"]) > 1 else None
    tl = p["treeline"]
    sb = p["steepestBand"]
    lines = [
        "─" * 72,
        f"slug: {slug}   {t['name']} ({t['region']})",
        f"  grade {t['grade']}, aspect {t['aspect']}, season {t['season']}, "
        f"normal time {t['duration']}",
        f"  summit {t['summitClaimM']} moh (terrain model: {t['summitDtmM']} m)",
        f'  teaser already shown on the map: "{t["teaser"]}"',
        "",
        "  PRIMARY ROUTE — this is what the guide describes",
        f"    name:      {p['name']}",
        f"    trailhead: {p['trailhead']}"
        + (f"   (full: {p['trailheadFull']})" if p.get("trailheadFull") and p["trailheadFull"] != p["trailhead"] else ""),
        f"    starts at: {p['startM']} m,  summit {p['summitM']} m",
        f"    distance:  {p['distanceM']/1000:.2f} km,  gain {p['gainM']} m,  "
        f"height given back {p['lossM']} m",
        f"    steepest 100 m band: "
        + (f"{sb['fromM']}–{sb['toM']} moh at a mean {sb['angle']}°" if sb else "not resolved"),
        f"    steepest sustained gradient (30 m window): {p['maxAngle']}°",
        "    treeline (Kartverket class stops being Skog): "
        + (f"{tl['last_forest_m']} m" if tl else "no forest — the route starts above the treeline"),
        "",
        "    TERRAIN CLASS ALONG THE LINE (Kartverket, trailhead -> summit):",
    ]
    for s in p.get("terrainSamples") or []:
        lines.append(f"      {s['z']:>5} m  {s['terreng']}")
    lines += [
        "",
        "    ROUTE RESEARCH AND AUDIT NOTES — your best material. Produced by",
        "    researching the tour against Friflyt/ut.no, then audited by a second",
        "    pass that re-queried every coordinate. These name the real cornices,",
        "    cliff bands and steep sections, often with measured angles.",
        "",
    ]
    notes = p.get("researchNotes") or "(none recorded)"
    lines += ["      " + l for l in notes.split("\n")]
    af = t.get("auditFindings") or []
    if af:
        lines += [
            "",
            "    WHAT THE AUDIT FOUND when it re-checked this tour. Corrections and",
            "    measured observations — often the most concrete terrain detail there is:",
            "",
        ]
        for a in af:
            lines += ["      - " + a]
    if alt:
        lines += [
            "",
            "  SECOND ROUTE (mention in passing at most; do not describe it)",
            f"    {alt['name']} — from {alt['trailhead']}, {alt['gainM']} m gain "
            f"over {alt['distanceM']/1000:.2f} km",
        ]
    return "\n".join(lines)


def main():
    f = json.load(open(__file__.replace("guide_brief.py", "guide_facts.json")))
    slugs = sys.argv[1:] or list(f)
    for s in slugs:
        if s not in f:
            print(f"!! unknown slug {s}; known: {', '.join(f)}", file=sys.stderr)
            continue
        print(block(s, f))
        print()


if __name__ == "__main__":
    main()
