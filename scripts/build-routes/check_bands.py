"""Every «A grader … mellom X og Y moh» claim in the prose, measured against its own band.

`check_guides.py` asks whether a number in the copy can be sourced at all. This
asks a narrower and harder question: when the prose ties an angle to a *named
height band*, does that band actually measure that angle on the line the app
draws today?

The two are not the same check, and the difference is where re-routes hide. A
guide that said «20,6 grader mellom 1000 og 1100 moh» kept both its numbers
after the line moved — 20.6 was still a real measurement somewhere, and 1000 to
1100 was still a real band — so a number-sourcing pass walked straight past it
while the sentence had quietly become false. That drift was found by hand once,
in a round that had to re-read thirty guides to do it. This is that read, as a
script, over both languages and every tour.

Claims are matched in both orders, because the corpus writes them both ways:

    «brattaste hundremetersbeltet 21,1 grader mellom 300 og 400 moh»
    «beltet frå 500 til 600 moh måler 1,8 grader»
    "a mean 13.2 degrees between 900 and 1000 metres"

and the superlative form is checked too — a claim to be *the* steepest band is a
claim about identity, not just magnitude, and it is the one a re-route breaks
first. Which figure the prose may quote is `check_guides.py`'s question; this
one only asks whether the band named beside it measures what is claimed.

    python3 check_bands.py [slug …]
"""

import json
import math
import re
import sys

from guide_facts import bands, cumdist

REPO = "/home/user/Toppkart"

# Tolerances. The prose rounds to one decimal, and `bands()` rounds the same
# way, so anything past a tenth is a real disagreement rather than a rounding
# artefact — but a band whose vertices moved a metre or two under resampling can
# shift a tenth without the sentence being wrong, so the gate is two.
ANGLE_TOL = 0.2
# A superlative is a claim about which band wins. A band that measures within a
# tenth of the winner is a tie, not a lie.
SUPERLATIVE_TIE = 0.1

NUM = r"(\d+(?:[.,]\d+)?)"
# The gap between an angle and the band it belongs to. It may not run past a
# clause boundary or over another angle: a sentence that states a band and then
# a separate steepest-step figure — «13,9 grader mellom 700 og 800 moh,
# brattaste samanhengande parti 21,9 grader» — otherwise pairs the band with the
# wrong number and reports a defect that is only a greedy regex.
GAP = r"(?:(?!grader|degrees|°)[^.;:!?,])"

# «21,1 grader … mellom 300 og 400 moh» / "13.2 degrees between 900 and 1000 metres"
ANGLE_FIRST = re.compile(
    NUM
    + r"\s*(?:grader|degrees|°)\s*"
    + GAP
    + r"{0,40}?(?:mellom|between|frå|fra|from)\s+"
    + NUM
    + r"\s*(?:og|and|til|to|–|-)\s*"
    + NUM
    + r"\s*(?:moh|m\.o\.h|metres|meters|m\b)",
    re.I,
)
# «beltet frå 500 til 600 moh måler 1,8 grader» / "the 900–1000 band at a mean 21.3"
BAND_FIRST = re.compile(
    r"(?:mellom|between|frå|fra|from|beltet)\s+"
    + NUM
    + r"\s*(?:og|and|til|to|–|-)\s*"
    + NUM
    + r"\s*(?:moh|m\.o\.h|metres|meters|m\b)\s*"
    + GAP
    + r"{0,40}?"
    + NUM
    + r"\s*(?:grader|degrees|°)",
    re.I,
)

# «Beltet frå 500 til 600 er det bratteste i snitt med 21,5 grader» — the band
# named without a unit after it. `BAND_FIRST` requires «moh» or «metres» there,
# and this idiom simply does not write one, so twenty guides across the corpus
# stated a band claim that no pass ever read: Skjellesvikgalten, Sebortinden,
# Jotind, Melåaksla, Kråkrøtinden and the five of the Møysalen round among them.
# A band claim is the one sentence shape a re-route falsifies silently, which is
# why this check exists at all — so the unit is optional here, and the «beltet»
# lead-in is what keeps the pattern from pairing two unrelated numbers.
BAND_NOUN_LEAD = r"(?:beltet|belte|bandet|sjiktet|the\s+band)"
BAND_FIRST_NO_UNIT = re.compile(
    BAND_NOUN_LEAD
    + r"\s+(?:frå|fra|from)\s+"
    + NUM
    + r"\s*(?:og|and|til|to|–|-)\s*"
    + NUM
    + r"\s*(?:moh|m\.o\.h|metres|meters|m\b)?\s*"
    + GAP
    + r"{0,40}?"
    + NUM
    + r"\s*(?:grader|degrees|°)",
    re.I,
)

# Seven guides are written in nynorsk and the rest in bokmål, and the corpus
# names the hundred-metre band six different ways — belte, band, sjikt, spenn,
# «hundremeteren», «hundremeterspennet». A pattern that knows only one spelling
# checks only one spelling, and the identity claims in the others go unread.
STEEP = r"(?:brattaste|bratteste)"
BAND_NOUN = r"(?:hundremeter\w*|hundremetersband|100[\s-]?m\w*|belte\w*|sjikt\w*|spenn\w*)"
STEEPEST_BAND_WORDS = re.compile(
    STEEP + r"\s+" + BAND_NOUN
    + r"|" + BAND_NOUN + r"[^.;:!?]{0,25}" + STEEP
    + r"|steepest (?:100[\s-]m(?:etre)?|hundred[\s-]metre)[\s-]*band"
    + r"|steepest band",
    re.I,
)
# What this check deliberately does NOT do
# ----------------------------------------
# The steepest *sustained stretch* is not checked here, and that is a decision
# rather than an omission. A band claim carries its own address — «21,1 grader
# mellom 300 og 400 moh» can only be about one band, so the figure and the
# ground it describes are welded together and the check is exact. A sustained-
# stretch claim has no address, and the corpus routinely puts three figures in
# one sentence — the source's rating, the band, the step, sometimes a flank —
# so deciding which of them the superlative owns is guesswork, and a check that
# guesses reports defects that are only parsing. `check_guides.py` already
# refuses any figure that cannot be sourced at all; the sustained stretch is
# left to that pass and to a human reading the sentence.


def num(s):
    return float(s.replace(",", "."))


# The English guides write four-figure heights with a thousands separator —
# «between 1,700 and 1,800 m» — and a decimal-comma reader turns that into 1.7,
# which matches no band and silently drops half the corpus out of the check.
# Stripping the separator is safe: it only fires on a comma followed by exactly
# three digits, and no angle in this corpus is written that way.
THOUSANDS = re.compile(r"(?<=\d),(?=\d{3}\b)")


def sentences(text):
    text = THOUSANDS.sub("", text)
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]


def guide_texts(guide):
    """Every prose field of one guide, per language, as (lang, where, text)."""
    for lang in ("no", "en"):
        g = guide.get(lang) or {}
        if g.get("intro"):
            yield lang, "intro", g["intro"]
        for i, p in enumerate(g.get("ascent") or []):
            yield lang, f"ascent[{i}]", p
        for i, p in enumerate(g.get("descent") or []):
            yield lang, f"descent[{i}]", p
        for i, s in enumerate(g.get("avalanche") or []):
            yield lang, f"avalanche[{i}]", s.get("body", "")
        if g.get("caption"):
            yield lang, "caption", g["caption"]


# Norwegian writes decimals with a comma and ranges with a dash, so a clause
# boundary is only a separator that does not sit between two digits. Splitting
# naively turns «19,5 grader» into a clause ending «19» and one beginning
# «5 grader», and the scan then reports a defect that is only arithmetic.
CLAUSE = re.compile(r"(?<!\d)[,;:—–](?!\d)")


def clause_around(sentence, at):
    """The clause holding position `at`, plus the one before it.

    Claims are listed clause by clause, and a superlative sits either inside its
    own clause («brattaste hundremetersbeltet 13,9 grader mellom 700 og 800
    moh») or in the clause that introduces the list. Anything further away
    belongs to a different claim.
    """
    cuts = [0] + [m.end() for m in CLAUSE.finditer(sentence)] + [len(sentence)]
    for i in range(len(cuts) - 1):
        if cuts[i] <= at < cuts[i + 1]:
            start = cuts[i - 1] if i else 0
            return sentence[start : cuts[i + 1]]
    return sentence


def band_angle(table, lo, hi):
    """The measured angle of the band the prose names, or None if there is none."""
    for b in table:
        if b["fromM"] == lo and b["toM"] == hi:
            return b["angle"]
    return None


def main():
    routes = json.load(open("routes.json"))
    guides = json.load(open("guides.json"))
    only = set(sys.argv[1:])

    problems = []
    claims = 0
    scanned = 0

    for slug, guide in sorted(guides.items()):
        if only and slug not in only:
            continue
        recs = routes.get(slug)
        if not recs:
            continue
        scanned += 1
        # The tour's own route is the first one: the figures on the card and in
        # the prose describe that line, not an alternate.
        r = recs[0]
        pts = [tuple(p) for p in r["points"]]
        zs = r["elevations"]
        table = bands(pts, zs)
        if not table:
            continue
        top = max(table, key=lambda b: b["angle"])

        for lang, where, text in guide_texts(guide):
            for sentence in sentences(text):
                found = []
                for m in ANGLE_FIRST.finditer(sentence):
                    found.append((num(m.group(1)), num(m.group(2)), num(m.group(3)), m.start()))
                # A band already read angle-first is not read again band-first:
                # «17,4 grader mellom 800 og 900 moh og brattaste samanhengande
                # parti 28,2 grader» pairs that band with the *next* claim's
                # angle otherwise, which is a greedy match rather than a defect.
                claimed = {(lo, hi) for _, lo, hi, _ in found}
                for m in BAND_FIRST.finditer(sentence):
                    lo, hi = num(m.group(1)), num(m.group(2))
                    if (lo, hi) in claimed:
                        continue
                    found.append((num(m.group(3)), lo, hi, m.start()))
                    claimed.add((lo, hi))
                # Last, the unitless «beltet frå X til Y … A grader» idiom, and
                # only for bands neither pass above has already read — the three
                # patterns overlap by design, and a band counted twice would be
                # measured twice and reported twice.
                for m in BAND_FIRST_NO_UNIT.finditer(sentence):
                    lo, hi = num(m.group(1)), num(m.group(2))
                    if (lo, hi) in claimed:
                        continue
                    found.append((num(m.group(3)), lo, hi, m.start()))
                    claimed.add((lo, hi))
                for angle, lo, hi, at in found:
                    # A superlative belongs to the clause it stands in — or to
                    # the one introducing it. A guide that lists three rising
                    # bands and calls the last one the steepest must not have
                    # that word read onto the first.
                    near = clause_around(sentence, at)
                    # Only height bands, and only the 100 m grid the table is on.
                    if hi - lo != 100 or lo % 100 or hi % 100:
                        continue
                    claims += 1
                    measured = band_angle(table, int(lo), int(hi))
                    if measured is None:
                        problems.append(
                            (slug, lang, where, f"claims {angle}° for {lo:.0f}–{hi:.0f} moh, "
                             f"but the line has no vertices in that band", sentence)
                        )
                        continue
                    if abs(measured - angle) > ANGLE_TOL:
                        problems.append(
                            (slug, lang, where, f"claims {angle}° for {lo:.0f}–{hi:.0f} moh; "
                             f"the band measures {measured}°", sentence)
                        )
                    # A superlative belongs to the claim it stands next to, not
                    # to every claim in the sentence. Sunndalsnipa's guide lists
                    # three rising bands and calls the *last* one the steepest;
                    # attaching that word to the first band invents a defect.
                    # …unless the sentence lists several bands and names the
                    # real winner among them. «18,9 frå 1000 til 1100 og 20,1
                    # frå 1100 til 1200, som er det brattaste beltet» is a
                    # correct sentence, and the superlative belongs to the
                    # second claim however the clauses fall out.
                    elif (
                        STEEPEST_BAND_WORDS.search(near)
                        and not any(
                            (lo2, hi2) == (top["fromM"], top["toM"]) for _, lo2, hi2, _ in found
                        )
                        # The winning band is often named without repeating the
                        # unit — «15,7 grader frå 800 til 900 moh og 18,5 frå
                        # 900 til 1000, som er brattaste hundremeteren» — so the
                        # bare range counts as naming it.
                        and not re.search(
                            rf"{top['fromM']}\s*(?:og|and|til|to|–|-)\s*{top['toM']}", sentence
                        )
                        and (top["angle"] - measured > SUPERLATIVE_TIE)
                    ):
                        problems.append(
                            (slug, lang, where,
                             f"calls {lo:.0f}–{hi:.0f} moh the steepest band at {measured}°, but "
                             f"{top['fromM']}–{top['toM']} measures {top['angle']}°", sentence)
                        )
                # A superlative-sustained claim carries its own number, and that
                # number lives in the same clause as the phrase. Reading the
                # whole sentence picks up the source's own rating instead —
                # «brattaste punkt 25–30 grader» is Fri Flyt describing the
                # mountain, not the pipeline measuring the line.
    for slug, lang, where, what, sentence in problems:
        print(f"{slug} [{lang}] {where}: {what}")
        print(f"    … {sentence[:160]}")
    print(
        f"\n{scanned} tours, {claims} band claims measured — "
        + (f"{len(problems)} disagree" if problems else "all agree with the line")
    )
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
