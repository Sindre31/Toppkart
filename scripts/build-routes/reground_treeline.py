"""Bring the guides' treeline figures onto the treeline the line actually has.

`check_treeline.py` read the terrain class every 5 m around every route's
treeline and compared it with the height each guide gives next to a word for
forest. Twelve guides gave a figure from an older scan or from research that
predates the line — Kirketaket's «bjørkeskog til 421» on a line that is in
forest to 632, Skåla's 426 against 698 — and two more said something the
measurement now settles. Every replacement is `guide_facts`' vertex treeline
(`last_forest_m`) or its first open vertex (`first_open_m`), which the 5 m read
agrees with to within one vertex segment on every one of them.

Same contract as `reground_review.py`: every edit is (slug, old, new) and must
match, or the run reports it and exits non-zero.
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROUND = "TREELINE ROUND"


def apply_edits(guides, edits):
    misses = []
    for slug, old, new in edits:
        blob = json.dumps(guides[slug], ensure_ascii=False)
        if blob.count(old) == 0:
            misses.append(f"{slug}: never found {old!r}")
            continue
        guides[slug] = json.loads(blob.replace(old, new))
    return misses


def main():
    path = os.path.join(HERE, "guides.json")
    guides = json.load(open(path, encoding="utf-8"))
    if any(any(p.startswith(ROUND) for p in g.get("problems") or []) for g in guides.values()):
        print("already applied")
        return 0
    edits = build_edits()
    misses = apply_edits(guides, edits)
    if misses:
        print("\n".join(misses))
        return 1
    for slug, note in NOTES.items():
        guides[slug].setdefault("problems", []).append(f"{ROUND}: {note}")
    json.dump(guides, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"applied {len(edits)} substitutions across {len({e[0] for e in edits})} guides")
    return 0


def note(was, now, dense):
    return (f"the guide gave the treeline as {was} m; check_treeline.py reads forest on the line to {dense} m "
            f"at 5 m spacing and guide_facts' vertex scan to {now} m. Figure replaced in both languages.")


NOTES = {
    "storgalten": note(70, 180, 180) + " First open vertex 189 m.",
    "kavringtinden": note(301, 320, 325),
    "rombakstotta": note(457, 494, 498),
    "kirketaket": note(421, 632, 632) + (
        " The old sentence also contradicted itself — open birch at 420 m and «the forest lets go right "
        "there» — and is rewritten."),
    "kolastinden": note(410, 474, 487),
    "saudehornet": note(339, 456, 459) + " First open vertex 473 m.",
    "slogen": note(659, 681, 684),
    "jakta": note(296, 395, 395),
    "skala": note(426, 698, 707) + (
        " «ved Tyvasætra» is dropped: no corridor waypoint or source places it, and the figure it "
        "was attached to was wrong."),
    "oksen": note(538, 580, 580) + " Start 276 m, so the walk down below the treeline is 304 m, not «260-odd».",
    "melderskin": note(520, 618, 618) + (
        " The comparison with the Myrdalsvatnet line also gave the Kletta route 300 m of forest and a "
        "treeline of 521; guide_facts reads 1.76 km and 618."),
    "melshornet": note(454, 545, 546) + (
        " With the treeline at 545, the steepest step (458–472 m) is in the forest, not above or just "
        "below the treeline as the intro and ascent said, and the ridge at 519 m is still below it."),
    "saebyggjenuten": (
        "the guide said how high the forest goes on this line «is not measured point by point»; it is now: "
        "guide_facts' vertex scan reads 1044 m and check_treeline.py 1048 m at 5 m spacing."),
}


def build_edits():
    e = []

    def add(slug, *pairs):
        for old, new in pairs:
            e.append((slug, old, new))

    add("storgalten",
        ("Kort linje, åpent fjell fra 70 moh og opp", "Kort linje, åpent fjell fra 189 moh og opp"),
        ("Bjørkeskogen slipper taket allerede rundt 70 moh;", "Bjørkeskogen slipper taket allerede rundt 180 moh;"),
        ("A short line, open mountain from 70 m up", "A short line, open mountain from 189 m up"),
        ("The birch forest gives up at around 70 m;", "The birch forest gives up at around 180 m;"))

    add("kavringtinden",
        ("Skogen slipper taket ved 301 moh, og du går forbi Skihytta på 317.",
         "Du går forbi Skihytta på 317, og skogen slipper taket ved 320 moh."),
        ("The forest lets go at 301 m, and you pass Skihytta at 317.",
         "You pass Skihytta at 317, and the forest lets go at 320 m."))

    add("rombakstotta",
        ("Skogen slipper taket på 457 moh,", "Skogen slipper taket på 494 moh,"),
        ("Under skoggrensa på 457 moh blir det tett igjen.", "Under skoggrensa på 494 moh blir det tett igjen."),
        ("The forest lets go at 457 m and", "The forest lets go at 494 m and"),
        ("Below the treeline at 457 m it gets tight again.", "Below the treeline at 494 m it gets tight again."))

    add("kirketaket",
        ("bomvei, bjørkeskog til 421, så rygg hele veien", "bomvei, bjørkeskog til 632, så rygg hele veien"),
        ("Skogen slipper taket akkurat der: over 421 moh er det åpent terreng resten av veien.",
         "Skogen slipper taket på 632 moh, og derfra er det åpent terreng resten av veien."),
        ("toll road, birch forest to 421, then ridge all the way", "toll road, birch forest to 632, then ridge all the way"),
        ("The forest lets go right there: above 421 m it is open ground the rest of the way.",
         "The forest lets go at 632 m, and from there it is open ground the rest of the way."))

    add("kolastinden",
        ("Skogen slipper allerede på 410 moh,", "Skogen slipper på 474 moh,"),
        ("The forest lets go already at 410 m,", "The forest lets go at 474 m,"))

    add("saudehornet",
        ("Skogen sluttar rundt 339 moh og terrenget er ope frå 344.",
         "Skogen sluttar rundt 456 moh og terrenget er ope frå 473."),
        ("The forest ends around 339 m and the ground is open from 344.",
         "The forest ends around 456 m and the ground is open from 473."))

    add("slogen",
        ("Skoggrensa slipper på 659 moh.", "Skoggrensa slipper på 681 moh."),
        ("The treeline lets go at 659 m.", "The treeline lets go at 681 m."))

    add("jakta",
        ("Skogen sluttar rundt 296 moh og terrenget er ope frå om lag 400.",
         "Skogen sluttar rundt 395 moh og terrenget er ope frå 398."),
        ("The forest ends around 296 m and the ground is open from about 400.",
         "The forest ends around 395 m and the ground is open from 398."))

    add("skala",
        ("Skogen slipper taket rundt 426 moh, ved Tyvasætra, og", "Skogen slipper taket rundt 698 moh, og"),
        ("The forest lets go at around 426 m, at Tyvasætra, and", "The forest lets go at around 698 m, and"))

    add("oksen",
        ("skoggrensa ligger på 538 moh,", "skoggrensa ligger på 580 moh,"),
        ("Skoggrensa på 538 moh er der skiene går på sekken, og de siste drøyt 260 høydemeterne",
         "Skoggrensa på 580 moh er der skiene går på sekken, og de siste drøyt 300 høydemeterne"),
        ("the treeline is at 538 m,", "the treeline is at 580 m,"),
        ("The treeline at 538 m is where the skis go on the pack, and the last 260-odd metres",
         "The treeline at 580 m is where the skis go on the pack, and the last 300-odd metres"))

    add("melderskin",
        ("du stiger jevnt gjennom skogen til rundt 520 moh.", "du stiger jevnt gjennom skogen til rundt 618 moh."),
        ("og 1,84 km med skog i stedet for 300 meter — furua slipper først på 659 moh her mot 521 der.",
         "og 1,84 km med skog mot 1,76 — furua slipper på 659 moh her mot 618 der."),
        ("you climb steadily through the trees to around 520 m.", "you climb steadily through the trees to around 618 m."),
        ("and 1.84 km of forest instead of 300 metres — the pines let go at 659 m here against 521 there.",
         "and 1.84 km of forest against 1.76 — the pines let go at 659 m here against 618 there."))

    add("melshornet",
        ("og det ligg nede rett over skoggrensa på 454 moh — ikkje oppe under varden.",
         "og det ligg nede i skogen, mellom 458 og 472 moh — ikkje oppe under varden."),
        ("med skoggrensa på 454 moh og brattaste hundremeteren", "med skoggrensa på 545 moh og brattaste hundremeteren"),
        ("Skogen slepper taket ved 454 moh, og brattaste steget på heile turen ligg like under skoggrensa — 23,8 grader over tretti meter, mellom 458 og 472 moh.",
         "Brattaste steget på heile turen ligg i skogen — 23,8 grader over tretti meter, mellom 458 og 472 moh."),
        ("Over skoggrensa flatar det ut mot ryggen ved 519 moh.",
         "Mot ryggen ved 519 moh flatar det ut, og ved 545 moh slepper skogen taket."),
        ("mellom 458 og 472 moh rett under skoggrensa;", "mellom 458 og 472 moh, nede i skogen;"),
        ("and it sits just above the treeline at 454 m — not up under the cairn.",
         "and it sits low in the forest, between 458 and 472 m — not up under the cairn."),
        ("with the treeline at 454 m and the steepest hundred-metre band", "with the treeline at 545 m and the steepest hundred-metre band"),
        ("The forest lets go at 454 m, and the steepest step of the whole tour sits just below the treeline — 23.8 degrees over thirty metres, between 458 and 472 m.",
         "The steepest step of the whole tour is in the forest — 23.8 degrees over thirty metres, between 458 and 472 m."),
        ("Above the treeline it flattens out toward the ridge at 519 m.",
         "It flattens out toward the ridge at 519 m, and at 545 m the forest lets go."),
        ("between 458 and 472 m just below the treeline;", "between 458 and 472 m, low in the forest;"))

    add("saebyggjenuten",
        ("Kor høgt han går på denne linja er ikkje målt punkt for punkt — Kartverket sitt punkt-API låg nede då dette vart kontrollert — så guiden seier det som er målt og ikkje meir.",
         "Langs linja står skogen til 1044 moh, og frå 1052 er det ope."),
        ("How much higher it goes on this line has not been measured point by point — Kartverket's point API was down when this was checked — so the guide states what is measured and no more.",
         "Along the line the forest stands to 1044 m, and from 1052 it is open."))

    return e


if __name__ == "__main__":
    sys.exit(main())
