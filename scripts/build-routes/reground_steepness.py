"""Bring the guides' steepest step onto the 5 m profile.

`check_steepness.py` ran `router.steepest_span` — the steepest 30 m of ground —
over the 5 m profile `check_gain.py` caches and found 33 routes where the line
crosses ground 5–17° steeper than the vertex window the guide quotes: a short
step between two vertices that the vertex profile walks past. On an avalanche
product the steepest figure must not be understated, so every guide quoting
one of those 33 windows now quotes the 5 m one.

Two passes, in both languages:

  1. In every sentence that quotes the old angle, the angle and the two heights
     it ran between are replaced with the 5 m window's. That is all most of
     them need: on sixteen routes the window is the same place, steeper.
  2. On the seventeen where the steepest ground is somewhere else, the words
     around the figure — «i toppanløpet», «nede i skogen», «a road bend» — are
     rewritten to say where it now is (EDITS below).

Every figure is recorded in the guide's `problems`, which `check_guides.py`
reads as a source. Same contract as the other reground scripts: an edit that
does not match is reported and the run exits non-zero.
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROUND = "STEEPNESS ROUND"

# route: (vertex angle, from, to, 5 m angle, from, to)
WINDOWS = {
    "storfjellet/normalruta": (36.5, 531, 554, 42.4, 536, 565),
    "hamperokken/normalruta": (38.0, 1355, 1397, 46.2, 1365, 1397),
    "stortussen/sydryggen": (36.2, 593, 627, 43.9, 649, 615),
    "skjellesvikgalten/ostryggen": (32.8, 557, 583, 39.0, 778, 803),
    "nona/sorsida": (27.1, 846, 863, 34.0, 933, 953),
    "krakrotinden/nordruta": (27.2, 631, 647, 32.5, 1157, 1176),
    "spanstinden/normalruta": (25.0, 947, 968, 31.0, 863, 883),
    "moysalen/vestryggen": (45.9, 1165, 1119, 62.9, 1184, 1119),
    "strandtinden/karingen": (22.8, 976, 995, 32.2, 973, 994),
    "forkledalstindan/sydsiden": (39.4, 866, 901, 45.0, 869, 901),
    "litletind/normalruta": (26.2, 1043, 1064, 32.8, 1045, 1066),
    "varden-smaatindan/kabelvagmarka": (32.3, 127, 155, 38.3, 129, 156),
    "vassfjellet/markavollen": (23.0, 251, 270, 29.0, 252, 270),
    "rensfjellet/haaen": (19.7, 663, 679, 27.9, 661, 679),
    "snota/grahaugen": (28.9, 1414, 1434, 35.2, 1413, 1436),
    "snota/trollheimshytta": (28.5, 1409, 1435, 35.3, 1490, 1514),
    "vassdalstinden/normalruta": (41.3, 1247, 1278, 50.6, 1133, 1171),
    "slogen/normalruta": (33.0, 1435, 1455, 38.1, 1449, 1475),
    "jakta/normalruta": (35.0, 413, 449, 43.1, 1244, 1272),
    "eidskyrkja/normalruta": (22.9, 1166, 1179, 33.6, 1126, 1147),
    "rondslottet/bjornhollia": (33.7, 926, 896, 45.8, 913, 880),
    "skarsteinfjellet/normalruta": (25.0, 520, 541, 31.9, 1321, 1340),
    "lodalskapa/normalruta": (31.1, 1081, 1111, 46.4, 1973, 2005),
    "fanaraken/normalruta": (27.1, 1859, 1882, 36.8, 1859, 1884),
    "kvamshesten/normalruta": (22.7, 639, 669, 36.2, 665, 688),
    "bitihorn/batskaret": (26.2, 1343, 1365, 31.5, 1343, 1364),
    "kyrkjebonosi/kyrkjebon": (24.1, 1422, 1442, 30.0, 811, 829),
    "raskarfjellet/sildegjerdet": (24.0, 1348, 1368, 29.0, 1164, 1181),
    "horndalsnuten/skaftedalen": (27.7, 1210, 1234, 33.2, 1211, 1231),
    "gygrastolen/normalruta": (25.4, 1042, 1063, 36.0, 1322, 1345),
    "melderskin/normalruta": (30.6, 720, 744, 36.5, 848, 874),
    "melderskin/myrdalsvatnet": (33.8, 1258, 1284, 39.7, 1317, 1345),
    "kjerag/normalruta": (24.4, 673, 687, 29.6, 1083, 1102),
}

# Hand edits applied after the generic pass, on its output: (slug, old, new).
EDITS = [
    # Stortussen: the steepest 30 m is a drop into a notch on the ridge, not where it rears up.
    ("stortussen", "det bratteste enkeltpartiet, 43,9 grader mellom 649 og 615 moh, ligger der ryggen reiser seg.",
     "ryggen reiser seg der, men det bratteste enkeltpartiet på linja, 43,9 grader, er et fall ned i et søkk lenger nord, fra 649 til 615 moh."),
    ("stortussen", "the steepest single step, 43.9 degrees between 649 and 615 m, sits where the ridge rears up.",
     "the ridge rears up there, but the steepest single step on the line, 43.9 degrees, is a drop into a notch further north, from 649 to 615 m."),
    ("stortussen", "med det bratteste enkeltpartiet, 43,9 grader, mellom 649 og 615 moh.",
     "med det bratteste enkeltpartiet, 43,9 grader, ned i et søkk fra 649 til 615 moh."),
    ("stortussen", "with the steepest single step, 43.9 degrees, between 649 and 615 m.",
     "with the steepest single step, 43.9 degrees, down into a notch from 649 to 615 m."),
    # Skjellesvikgalten: higher up, under the shoulder.
    ("skjellesvikgalten", "det bratteste enkeltpartiet, 39,0 grader, ligger mellom 778 og 803 moh.",
     "det bratteste enkeltpartiet, 39,0 grader, ligger høyere, mellom 778 og 803 moh under skuldra."),
    ("skjellesvikgalten", "the steepest single step, 39.0 degrees, sits between 778 and 803 m.",
     "the steepest single step, 39.0 degrees, sits higher, between 778 and 803 m below the shoulder."),
    # Vassdalstinden: the flank under the summit, not the summit step.
    ("vassdalstinden", "ligg heilt oppe, mellom 1133 og 1171 moh.", "ligg høgt i flanken under toppen, mellom 1133 og 1171 moh."),
    ("vassdalstinden", "sits right at the top, between 1133 and 1171 m.", "sits high in the flank below the summit, between 1133 and 1171 m."),
    ("vassdalstinden", "mellom 1133 og 1171 moh — sjølve toppsteget.", "mellom 1133 og 1171 moh, i flanken under toppen."),
    ("vassdalstinden", "between 1133 and 1171 m — the summit step itself.", "between 1133 and 1171 m, in the flank below the summit."),
    # Jakta: where the line reaches the ridge.
    ("jakta", "held 43,1 grader som brattaste samanhengande parti — sikk-sakken",
     "held 43,1 grader som brattaste samanhengande parti, mellom 1244 og 1272 moh der ho når ryggen — sikk-sakken"),
    ("jakta", "holds 43.1 degrees as its steepest sustained section — the switchbacks",
     "holds 43.1 degrees as its steepest sustained section, between 1244 and 1272 m where it reaches the ridge — the switchbacks"),
    # Rondslottet: a kilometre and a half in.
    ("rondslottet", "i søkket ned mot dalmunnen den første kilometeren.", "i søkket ned mot dalmunnen, halvannan kilometer inn."),
    ("rondslottet", "in the dip down to the valley mouth in the first kilometre.", "in the dip down to the valley mouth, a kilometre and a half in."),
    # Skarsteinfjellet: up on the ridge, not down in the forest.
    ("skarsteinfjellet", "Brattaste samanhengande parti måler 31,9 grader og ligg nede ved 520 moh; over 800 moh kjem linja aldri over 16 grader i noko hundremetersband.",
     "Brattaste samanhengande parti måler 31,9 grader og ligg oppe på ryggen, mellom 1321 og 1340 moh; over 800 moh kjem linja elles aldri over 16 grader i noko hundremetersband."),
    ("skarsteinfjellet", "The steepest sustained section measures 31.9 degrees and sits low, at 520 m; above 800 m the line never exceeds 16 degrees in any hundred-metre band.",
     "The steepest sustained section measures 31.9 degrees and sits up on the ridge, between 1321 and 1340 m; above 800 m the line otherwise never exceeds 16 degrees in any hundred-metre band."),
    ("skarsteinfjellet", "600 til 700 moh med 17,3 grader i snitt, og brattaste samanhengande parti måler 31,9 grader mellom 1321 og 1340 moh.",
     "600 til 700 moh med 17,3 grader i snitt; brattaste samanhengande parti ligg høgare, 31,9 grader mellom 1321 og 1340 moh på ryggen."),
    ("skarsteinfjellet", "600 to 700 m averaging 17.3 degrees, and the steepest sustained section measures 31.9 degrees between 1321 and 1340 m.",
     "600 to 700 m averaging 17.3 degrees; the steepest sustained section sits higher, 31.9 degrees between 1321 and 1340 m on the ridge."),
    ("skarsteinfjellet", "31,9 grader mellom 1321 og 1340 moh — begge nede i skogsdelen.",
     "31,9 grader mellom 1321 og 1340 moh — det fyrste nede i skogsdelen, det andre oppe på ryggen."),
    ("skarsteinfjellet", "31.9 degrees between 1321 and 1340 m — both down in the forested part.",
     "31.9 degrees between 1321 and 1340 m — the first down in the forested part, the second up on the ridge."),
    # Gygrastølen: a short step right under the summit.
    ("gygrastolen", "Brattaste samanhengande parti måler 36,0 grader, så det er lengda og ikkje hellinga som avgjer dagen.",
     "Brattaste samanhengande parti måler 36,0 grader, men det er eit kort steg rett under toppen; elles er det lengda og ikkje hellinga som avgjer dagen."),
    ("gygrastolen", "The steepest sustained section measures 36.0 degrees, so it is the length and not the angle that decides the day.",
     "The steepest sustained section measures 36.0 degrees, but it is a short step right below the summit; otherwise it is the length and not the angle that decides the day."),
    ("gygrastolen", "Brattaste samanhengande parti måler 36,0 grader mellom 1322 og 1345 moh.",
     "Brattaste samanhengande parti, 36,0 grader mellom 1322 og 1345 moh, er det korte steget rett under toppen."),
    ("gygrastolen", "The steepest sustained section measures 36.0 degrees between 1322 and 1345 m.",
     "The steepest sustained section, 36.0 degrees between 1322 and 1345 m, is the short step right below the summit."),
    # Lodalskåpa: under the summit, not far below.
    ("lodalskapa", "ligg langt nede, 46,4 grader mellom 1973 og 2005 moh, i bakkane opp mot breen.",
     "ligg her, 46,4 grader mellom 1973 og 2005 moh, under toppen."),
    ("lodalskapa", "is far below, 46.4 degrees between 1973 and 2005 m, on the slopes up to the glacier.",
     "is here, 46.4 degrees between 1973 and 2005 m, below the summit."),
    # Kjerag: the steepest ground is onto the plateau, not a road bend.
    ("kjerag", "men ho kuttar hårnålssvingane: det brattaste 30-meterssteget på heile ruta, 29,6 grader mellom 1083 og 1102 moh, ligg 86 meter frå vegbanen og er ein sving og ikkje ei stigning.",
     "men ho kuttar hårnålssvingane — svingar, ikkje stigning. Det brattaste 30-meterssteget på heile ruta ligg oppe: 29,6 grader mellom 1083 og 1102 moh, på Kjeragplatået."),
    ("kjerag", "but it cuts the hairpins: the steepest 30-metre step on the whole route, 29.6 degrees between 1083 and 1102 m, sits 86 metres off the roadway and is a corner rather than a gradient.",
     "but it cuts the hairpins — corners, not gradient. The steepest 30-metre step on the whole route is up top: 29.6 degrees between 1083 and 1102 m, on the Kjerag plateau."),
    ("kjerag", "Brattaste 30-meterssteg er 29,6 grader og ligg på ein vegsving på 673 moh; brattaste 60 meter er 21,2 grader mellom 1077 og 1112 moh; brattaste 100 meter er 19,5 grader og brattaste 400 meter 11,3 grader.",
     "Brattaste 30-meterssteg er 29,6 grader mellom 1083 og 1102 moh, på platået; brattaste 60 meter er 24,9 grader og brattaste 100 meter 22,8, begge i eit søkk på platået ned til 1067 moh, og brattaste 400 meter 11,8 grader."),
    ("kjerag", "The steepest 30-metre step is 29.6 degrees and sits on a road bend at 673 m; the steepest 60 metres is 21.2 degrees between 1077 and 1112 m; the steepest 100 metres is 19.5 degrees and the steepest 400 metres 11.3 degrees.",
     "The steepest 30-metre step is 29.6 degrees between 1083 and 1102 m, on the plateau; the steepest 60 metres is 24.9 degrees and the steepest 100 metres 22.8, both in a dip on the plateau down to 1067 m, and the steepest 400 metres 11.8 degrees."),
    ("kjerag", "der brattaste 30 meter er 29,6 grader på ein vegsving og", "der brattaste 30 meter er 29,6 grader, oppe på platået, og"),
    ("kjerag", "where the steepest 30 metres is 29.6 degrees on a road bend and", "where the steepest 30 metres is 29.6 degrees, up on the plateau, and"),
    # Kyrkjebønosi: low down, not up in the 1400s.
    ("kyrkjebonosi", "Her ligg òg det brattaste steget på turen, 30,0 grader mellom 811 og 829 moh.",
     "Det brattaste steget på turen ligg likevel lågt, 30,0 grader mellom 811 og 829 moh, i den fyrste halvkilometeren."),
    ("kyrkjebonosi", "The steepest step on the tour is here too, 30.0 degrees between 811 and 829 m.",
     "The steepest step on the tour is nonetheless low down, 30.0 degrees between 811 and 829 m, in the first half kilometre."),
    # Raskarfjellet: the step is in the 1100–1200 band, not above 1300.
    ("raskarfjellet", "og 20,1 frå 1100 til 1200, som er brattaste bandet.",
     "og 20,1 frå 1100 til 1200, som er brattaste bandet, med brattaste steget på 29,0 grader mellom 1164 og 1181 moh."),
    ("raskarfjellet", "and 20.1 from 1100 to 1200, which is the steepest band.",
     "and 20.1 from 1100 to 1200, which is the steepest band, with the steepest step of 29.0 degrees between 1164 and 1181 m."),
    ("raskarfjellet", "19,3 frå 1300 til 1400, med brattaste steget på 29,0 grader mellom 1164 og 1181 moh.", "19,3 frå 1300 til 1400."),
    ("raskarfjellet", "19.3 from 1300 to 1400, with the steepest step of 29.0 degrees between 1164 and 1181 m.", "19.3 from 1300 to 1400."),
]


def fmt(x, lang):
    s = f"{x:.1f}"
    return s.replace(".", ",") if lang == "no" else s


def generic(guides):
    """Swap angle and heights in the sentences that quote the vertex window."""
    changed = []
    for route, (va, v0, v1, da, d0, d1) in WINDOWS.items():
        slug = route.split("/")[0]
        for lang in ("no", "en"):
            old_a, new_a = fmt(va, lang), fmt(da, lang)
            blob = json.dumps(guides[slug][lang], ensure_ascii=False)
            ang = re.compile(r"(?<![\d,.])" + re.escape(old_a) + r"(?![\d])")
            pair = re.compile(
                r"(?<!\d)" + str(v0) + r"(\s*(?:og|and|til|to|–|-)\s*)" + str(v1) + r"(?!\d)"
            )

            def fix(sent):
                if not ang.search(sent):
                    return sent
                s = ang.sub(new_a, sent)
                return pair.sub(lambda m: f"{d0}{m.group(1)}{d1}", s)

            parts = re.split(r"(?<=[.!?])(\s+)", blob)
            new = "".join(fix(p) for p in parts)
            if new != blob:
                guides[slug][lang] = json.loads(new)
                changed.append((route, lang))
    return changed


def main():
    path = os.path.join(HERE, "guides.json")
    guides = json.load(open(path, encoding="utf-8"))
    if any(any(p.startswith(ROUND) for p in g.get("problems") or []) for g in guides.values()):
        print("already applied")
        return 0
    changed = generic(guides)
    misses = []
    for slug, old, new in EDITS:
        blob = json.dumps(guides[slug], ensure_ascii=False)
        if old not in blob:
            misses.append(f"{slug}: never found {old!r}")
            continue
        guides[slug] = json.loads(blob.replace(old, new))
    if misses:
        print("\n".join(misses))
        return 1
    notes = {}
    for route, (va, v0, v1, da, d0, d1) in WINDOWS.items():
        slug = route.split("/")[0]
        notes.setdefault(slug, []).append(
            f"{route}: steepest 30 m on the 5 m profile (check_steepness.py) {da}° between {d0} and {d1} m, "
            f"against the vertex window's {va}° between {v0} and {v1} m"
        )
    notes["kjerag"].append(
        "kjerag/normalruta on the same 5 m profile: steepest 60 m 24.9° (1097 to 1067 m), steepest 100 m "
        "22.8° (1109 to 1067 m), steepest 400 m 11.8° (976 to 1060 m); the vertex windows were 21.2, 19.5 and 11.3")
    for slug, ns in notes.items():
        guides[slug].setdefault("problems", []).append(f"{ROUND}: " + "; ".join(ns) + ".")
    json.dump(guides, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"generic pass changed {len(changed)} guide-languages; {len(EDITS)} hand edits")
    return 0


if __name__ == "__main__":
    sys.exit(main())
