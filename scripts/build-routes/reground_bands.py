"""Third reground: the band claims `check_bands.py` measured against the line.

The first two rounds fixed figures that a *hand* scan found after #62 moved 57
of 95 lines. This round is the same work done by machine — `check_bands.py`
re-derives every «A grader … mellom X og Y moh» claim against its own band on
the line the app draws today — and it found fifteen claims in six guides that
the hand scan had missed, in both languages.

Two of them are the dangerous kind. Where only the *figure* drifted, the number
is replaced and the sentence stands. Where the *identity* of a superlative
moved, the sentence is rewritten to say where the steep ground actually is:

  - **Snøhetta** called 1800–1900 m its steepest hundred — that band measures
    13,8°, and the steepest is 1700–1800 m at 16,0°. Both the height and the
    angle were wrong, which is exactly the shape a number-sourcing check cannot
    see: 19,0 was a real measurement of the pre-#62 line, and 1800–1900 was a
    real band, so nothing in the sentence looked invented.
  - **Kirketaket**, **Melderskin** and **Skåla** each named a band one step
    below the true steepest one.
  - **Slogen**'s steepest forest hundred is 200–300 m at 21,9°, not 100–200 m,
    which measures 19,0°.

Every edit is (slug, lang, field, old, new) and must match exactly once, or the
run reports it and exits non-zero. The proof afterwards is mechanical:
`check_bands.py` comes back empty and `check_guides.py` stays clean.
"""

import json
import sys

EDITS = [
    # ── Gaustatoppen: the band is still the steepest, the angle drifted ──
    ("gaustatoppen", "no", "ascent", 2,
     "ligger mellom 1700 og 1800 moh og måler 15,8°",
     "ligger mellom 1700 og 1800 moh og måler 17,5°"),
    ("gaustatoppen", "no", "avalanche", 0,
     "den bratteste hundremeteren, mellom 1700 og 1800 moh, holder 15,8°",
     "den bratteste hundremeteren, mellom 1700 og 1800 moh, holder 17,5°"),
    ("gaustatoppen", "en", "ascent", 2,
     "lies between 1,700 and 1,800 m and measures 15.8°",
     "lies between 1,700 and 1,800 m and measures 17.5°"),
    ("gaustatoppen", "en", "avalanche", 0,
     "the steepest hundred metres, between 1,700 and 1,800 m, holds 15.8°",
     "the steepest hundred metres, between 1,700 and 1,800 m, holds 17.5°"),

    # ── Kirketaket: the steepest hundred is one band higher, and the step with it ──
    ("kirketaket", "no", "ascent", 3,
     "Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1300 og 1400 moh "
     "og holder 20,8° i snitt. Det bratteste enkelttrinnet ligger høyere, mellom 1411 "
     "og 1428 moh, og måler 29,4°.",
     "Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1400 og 1500 moh "
     "og holder 22,1° i snitt; sjiktet under, 1300 til 1400 moh, måler 20,5°. Det "
     "bratteste enkelttrinnet ligger i det same høgdelaget, mellom 1411 og 1433 moh, "
     "og måler 30,3°."),
    ("kirketaket", "no", "avalanche", 0,
     "Bratteste hundremeterssjikt på oppstigninga er nettopp 1300–1400 moh, med 20,8° "
     "i snitt; det bratteste enkelttrinnet ligger like over, mellom 1411 og 1428 moh, "
     "og måler 29,4°.",
     "Sjiktet 1300–1400 moh måler 20,5° i snitt, og hundremeteren over det — 1400–1500 "
     "moh, 22,1° — er den bratteste på oppstigninga; det bratteste enkelttrinnet ligger "
     "i den, mellom 1411 og 1433 moh, og måler 30,3°."),
    ("kirketaket", "en", "ascent", 3,
     "The steepest 100-metre band of the whole ascent lies between 1300 and 1400 m and "
     "averages 20.8°. The steepest single step sits higher, between 1411 and 1428 m, "
     "and measures 29.4°.",
     "The steepest 100-metre band of the whole ascent lies between 1400 and 1500 m and "
     "averages 22.1°; the band below it, 1300 to 1400 m, measures 20.5°. The steepest "
     "single step sits in that same band, between 1411 and 1433 m, and measures 30.3°."),
    ("kirketaket", "en", "avalanche", 0,
     "The steepest 100-metre band of the ascent is exactly 1300–1400 m, averaging 20.8°; "
     "the steepest single step sits just above it, between 1411 and 1428 m, and measures "
     "29.4°.",
     "The 1300–1400 m band averages 20.5°, and the hundred above it — 1400–1500 m at "
     "22.1° — is the steepest of the ascent; the steepest single step sits in it, "
     "between 1411 and 1433 m, and measures 30.3°."),

    # ── Melderskin: the steepest hundred is 800–900, and both quoted bands drifted ──
    ("melderskin", "no", "ascent", 1,
     "Mellom 600 og 700 moh holder den 20,3° i snitt over hundre høydemeter, og det "
     "bratteste hundremeterspennet på turen kommer høyere: 22,5° mellom 900 og 1000 moh.",
     "Mellom 600 og 700 moh holder den 22,6° i snitt over hundre høydemeter, og det "
     "bratteste hundremeterspennet på turen kommer like over: 23,9° mellom 800 og 900 "
     "moh, med 22,2° mellom 900 og 1000."),
    ("melderskin", "no", "avalanche", 0,
     "Den bratteste hundremeteren ligger mellom 900 og 1000 moh og holder 22,5°; "
     "bratteste enkeltsteg på linja måler 27,3°.",
     "Den bratteste hundremeteren ligger mellom 800 og 900 moh og holder 23,9°; "
     "bratteste enkeltsteg på linja måler 30,6°, mellom 720 og 744 moh."),
    ("melderskin", "en", "ascent", 1,
     "Between 600 and 700 m it averages 20.3° over a hundred vertical metres, and the "
     "steepest hundred-metre band of the tour comes higher: 22.5° between 900 and 1000 m.",
     "Between 600 and 700 m it averages 22.6° over a hundred vertical metres, and the "
     "steepest hundred-metre band of the tour comes just above: 23.9° between 800 and "
     "900 m, with 22.2° between 900 and 1000."),
    ("melderskin", "en", "avalanche", 0,
     "The steepest hundred metres lies between 900 and 1000 m and holds 22.5°; the "
     "steepest single step on the line measures 27.3°.",
     "The steepest hundred metres lies between 800 and 900 m and holds 23.9°; the "
     "steepest single step on the line measures 30.6°, between 720 and 744 m."),

    # ── Skåla: the steepest hundred is 1500–1600, and the step is 26,9° ──
    ("skala", "no", "ascent", 2,
     "Den bratteste hundremeteren på hele linja ligger mellom 1400 og 1500 moh og holder "
     "20,3° i snitt; det bratteste enkelttrinnet måler 29,1°.",
     "Den bratteste hundremeteren på hele linja ligger mellom 1500 og 1600 moh og holder "
     "21,2° i snitt, med 20,2° i sjiktet under; det bratteste enkelttrinnet måler 26,9°."),
    ("skala", "en", "ascent", 2,
     "The steepest hundred metres on the whole line sit between 1400 and 1500 m and hold "
     "20.3° on average; the steepest single step measures 29.1°.",
     "The steepest hundred metres on the whole line sit between 1500 and 1600 m and hold "
     "21.2° on average, with 20.2° in the band below; the steepest single step measures "
     "26.9°."),

    # ── Slogen: the steepest forest hundred is 200–300, not 100–200 ──
    ("slogen", "no", "ascent", 0,
     "Dette er den bratteste delen av skogen: de hundre metrene mellom 100 og 200 moh "
     "ligger på 22,8° i snitt.",
     "Dette er den bratteste delen av skogen: de hundre metrene mellom 200 og 300 moh "
     "ligger på 21,9° i snitt, og de under, 100 til 200 moh, på 19,0°."),
    ("slogen", "en", "ascent", 0,
     "This is the steepest part of the forest: the hundred metres between 100 and 200 m "
     "average 22.8°.",
     "This is the steepest part of the forest: the hundred metres between 200 and 300 m "
     "average 21.9°, and the hundred below, 100 to 200 m, 19.0°."),
    ("slogen", "no", "avalanche", 0,
     "Skogpartiet over Brekkheida er brattest mellom 100 og 200 moh, 22,8° i snitt.",
     "Skogpartiet over Brekkheida er brattest mellom 200 og 300 moh, 21,9° i snitt."),
    ("slogen", "en", "avalanche", 0,
     "The forest section above Brekkheida is steepest between 100 and 200 m, averaging 22.8°.",
     "The forest section above Brekkheida is steepest between 200 and 300 m, averaging 21.9°."),

    # ── Snøhetta: the steepest hundred is 1700–1800 at 16,0°, and the step is 21,7° ──
    ("snohetta", "no", "ascent", 3,
     "Det bratteste hundremeterbeltet ligger mellom 1800 og 1900 moh og holder 19,0° i "
     "snitt; bratteste parti på linja måler 23,5°.",
     "Det bratteste hundremeterbeltet ligger mellom 1700 og 1800 moh og holder 16,0° i "
     "snitt — beltet over, 1800 til 1900 moh, måler 13,8° — og bratteste parti på linja "
     "måler 21,7°."),
    ("snohetta", "no", "avalanche", 0,
     "Det bratteste hundremeterbeltet, mellom 1800 og 1900 moh, holder 19,0° i snitt, og "
     "bratteste parti på linja måler 23,5°.",
     "Det bratteste hundremeterbeltet, mellom 1700 og 1800 moh, holder 16,0° i snitt, og "
     "bratteste parti på linja måler 21,7°."),
    ("snohetta", "en", "ascent", 3,
     "The steepest hundred-metre band lies between 1800 and 1900 m and holds a mean 19.0°; "
     "the steepest section on the line measures 23.5°.",
     "The steepest hundred-metre band lies between 1700 and 1800 m and holds a mean 16.0° "
     "— the band above it, 1800 to 1900 m, measures 13.8° — and the steepest section on "
     "the line measures 21.7°."),
    ("snohetta", "en", "avalanche", 0,
     "The steepest hundred-metre band, between 1800 and 1900 m, holds a mean 19.0°, and "
     "the steepest section on the line measures 23.5°.",
     "The steepest hundred-metre band, between 1700 and 1800 m, holds a mean 16.0°, and "
     "the steepest section on the line measures 21.7°."),
]


def main():
    guides = json.load(open("guides.json"))
    missed = []
    done = 0
    for slug, lang, field, idx, old, new in EDITS:
        node = guides[slug][lang][field]
        if field == "avalanche":
            text = node[idx]["body"]
        elif isinstance(node, list):
            text = node[idx]
        else:
            text = node
        if old not in text:
            missed.append(f"{slug} [{lang}] {field}[{idx}]: {old[:70]}…")
            continue
        text = text.replace(old, new, 1)
        if field == "avalanche":
            node[idx]["body"] = text
        elif isinstance(node, list):
            node[idx] = text
        else:
            guides[slug][lang][field] = text
        done += 1

    if missed:
        print("did not match — nothing written:")
        for m in missed:
            print("  -", m)
        return 1

    with open("guides.json", "w") as f:
        json.dump(guides, f, ensure_ascii=False, indent=1)
    print(f"regrounded {done} band claims across {len({e[0] for e in EDITS})} guides")
    return 0


if __name__ == "__main__":
    sys.exit(main())
