"""Mechanical fact-check of the written guides against the route data.

Not a replacement for the adversarial pass — it cannot tell you the route goes up
the wrong valley. What it can do is catch the two things that are both checkable
and dangerous: a number in the prose that contradicts the terrain model, and a
reassuring safety claim the data does not support.

Every elevation, distance and angle in the copy is matched against the facts for
that tour. Anything unaccounted for is printed for a human to look at, because a
plausible-looking metre figure nobody can source is exactly the kind of detail
that should not ship in an avalanche product.
"""

import json
import re
import sys

# Claims that assert safety rather than describe terrain. Each is only allowed
# when the data backs it, checked below.
REASSURING = [
    (re.compile(r"holder seg under (\d+)", re.I), "under-N-degrees claim (NO)"),
    (re.compile(r"stays below (\d+)", re.I), "under-N-degrees claim (EN)"),
    (re.compile(r"ingen kjente utløpssoner", re.I), "no-known-runout claim (NO)"),
    (re.compile(r"no known runout", re.I), "no-known-runout claim (EN)"),
    (re.compile(r"\btrygg\b|\btrygge\b", re.I), "calls terrain safe (NO)"),
    (re.compile(r"\bsafe\b", re.I), "calls terrain safe (EN)"),
]

NUM_UNIT = re.compile(
    r"(\d[\d\s.,]*)\s*(moh|m\.o\.h|høydemeter|vertical met|metres|meters|m\b|km\b|grader|degrees|°)",
    re.I,
)


def norm(tok):
    return float(tok.replace(" ", "").replace(" ", "").replace(",", "."))


def allowed_values(t):
    """Every number a guide for this tour is entitled to state."""
    p = t["routes"][0]
    vals = {
        float(p["startM"]), float(p["summitM"]), float(t["summitClaimM"]),
        float(t["summitDtmM"]), float(p["gainM"]), float(p["maxAngle"]),
        float(t["verticalM"]), round(p["distanceM"] / 1000.0, 1),
        float(p["distanceM"]), float(p["lossM"]),
    }
    for b in p.get("bands") or []:
        # Every 100 m band: its edges, its mean angle and the ground it covers.
        # A guide that says "the first pitch runs at fourteen degrees" is quoting
        # this table, and it should not have to round to the single steepest band
        # to be checkable.
        vals |= {float(b["fromM"]), float(b["toM"]), float(b["angle"]), float(b["groundM"])}
    if p.get("steepestStep"):
        # The steepest 30 m window and the two elevations it runs between: a
        # guide that says where the step is should not read as unsourced for it.
        ss = p["steepestStep"]
        vals |= {float(ss["fromM"]), float(ss["toM"]), float(ss["angle"])}
    if p.get("steepestBand"):
        sb = p["steepestBand"]
        vals |= {float(sb["fromM"]), float(sb["toM"]), float(sb["angle"])}
    # The elevations the corridor research pinned the line to — a route
    # description names them, and they are measurements, not prose.
    vals |= {float(w["m"]) for w in p.get("waypoints") or []}
    if p.get("treeline"):
        tl = p["treeline"]
        vals.add(float(tl["last_forest_m"]))
        if tl.get("first_open_m"):
            vals.add(float(tl["first_open_m"]))
    for s in p.get("terrainSamples") or []:
        vals.add(float(s["z"]))
    for alt in t["routes"][1:]:
        vals |= {float(alt["gainM"]), round(alt["distanceM"] / 1000.0, 1),
                 float(alt["startM"]), float(alt["summitM"])}
    return vals


def numbers_in(text_obj):
    blob = " ".join(
        [text_obj["intro"], text_obj["caption"]]
        + list(text_obj["ascent"]) + list(text_obj["descent"])
        + [a["title"] + " " + a["body"] for a in text_obj["avalanche"]]
    )
    return blob, [(norm(m.group(1)), m.group(2).lower(), m.group(0)) for m in NUM_UNIT.finditer(blob)]


def main():
    guides = json.load(open("guides.json"))
    facts = json.load(open("guide_facts.json"))
    only = set(sys.argv[1:])
    if only:
        guides = {s: g for s, g in guides.items() if s in only}

    unmatched_total = 0
    reassure_total = 0
    for slug in sorted(guides):
        t = facts[slug]
        allowed = allowed_values(t)
        # A number counts as sourced if it appears in the route facts, in the
        # corridor research, or in the fact-checker's write-up — that last one is
        # where the flank angles measured with flank_probe.py end up.
        notes = (
            (t["routes"][0].get("researchNotes") or "")
            + (t["routes"][0].get("description") or "")
            + " ".join(t.get("auditFindings") or [])
            + " ".join(guides[slug].get("problems") or [])
        )
        # Prose rounds: a note reading "31.3° mean" entitles the copy to say
        # "31 grader". Compare numerically rather than by substring, or every
        # rounded figure reads as invented.
        # The research is written in Norwegian as often as in English, so a
        # decimal comma is a decimal: reading "1,4 km eksponert rygg" as the two
        # numbers 1 and 4 is how a sourced figure gets reported as invented.
        noted = {float(m.replace(",", ".")) for m in re.findall(r"\d+(?:[.,]\d+)?", notes)}
        issues = []

        for lang in ("no", "en"):
            blob, nums = numbers_in(guides[slug][lang])

            for value, unit, raw in nums:
                if unit.startswith(("grader", "degrees", "°")):
                    ok = any(abs(value - a) <= 1.5 for a in allowed | noted)
                elif unit.startswith("km"):
                    # Research states distances in kilometres too — "1.4 km of
                    # exposed ridge" is sourced even though it is not the route's
                    # own length.
                    ok = any(abs(value - a) <= 0.15 for a in (allowed | noted) if a < 100)
                else:
                    ok = any(abs(value - a) <= 6 for a in allowed | noted)
                if not ok:
                    issues.append(f"[{lang}] unsourced number: {raw.strip()!r}")

            for pat, label in REASSURING:
                for m in pat.finditer(blob):
                    ctx = blob[max(0, m.start() - 70): m.end() + 70].replace("\n", " ")
                    if label.startswith("under-N"):
                        claimed = float(m.group(1))
                        real = t["routes"][0]["maxAngle"]
                        if real > claimed:
                            issues.append(
                                f"[{lang}] {label}: says under {claimed:.0f}° but the "
                                f"line reaches {real}° — …{ctx.strip()}…"
                            )
                    else:
                        issues.append(f"[{lang}] {label}: …{ctx.strip()}…")

        if issues:
            print(f"\n{slug}  (max step {t['routes'][0]['maxAngle']}°, "
                  f"{t['routes'][0]['distanceM']/1000:.2f} km, "
                  f"{t['routes'][0]['startM']}->{t['routes'][0]['summitM']} m)")
            for i in issues:
                print("   " + i)
            unmatched_total += sum(1 for i in issues if "unsourced" in i)
            reassure_total += sum(1 for i in issues if "unsourced" not in i)

    print(f"\n{len(guides)} guides checked — {unmatched_total} unsourced numbers, "
          f"{reassure_total} reassurance claims to review")
    return 1 if (unmatched_total or reassure_total) else 0


if __name__ == "__main__":
    sys.exit(main())
