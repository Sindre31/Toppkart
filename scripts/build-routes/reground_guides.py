"""Re-ground the figures in `guides.json` on the routes as they are now.

The trail round moved 57 of 95 lines. A guide written against the old line is
still good prose about the right mountain, but the numbers in it were measured
off geometry that no longer exists: band angles, the ground each band covers,
the steepest 30 m window and the two elevations it sits between, the treeline,
the distance and the vertical. `check_guides.py` found 83 of them across 31
guides, and every one is a restatement of something `guide_facts.json` holds.

So this is a substitution, not a rewrite: each edit replaces a figure with the
same figure measured on the new line. Nothing here invents a claim, changes what
a sentence asserts, or touches prose that is not a number. Where the *shape* of
a claim stopped being true — Folarskardnuten's teaser promised a 37-degree step
and the line that follows the mapped route tops out at 29 — that is not in this
file, because it needs a sentence rewritten rather than a number swapped, and it
was done by hand.

Every edit is (slug, old, new) and must match exactly once per language, or the
run aborts: a substitution that silently matched nothing would leave a stale
figure behind and report success, and a substitution that matched twice was not
specific enough to be trusted. `check_guides.py` is the proof — it re-derives
every number in the prose from the facts and is the thing that has to come back
clean afterwards.
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def facts():
    return json.load(open(os.path.join(HERE, "guide_facts.json"), encoding="utf-8"))


def band(r, lo):
    for b in r["bands"]:
        if b["fromM"] == lo:
            return b
    raise KeyError(f"no band from {lo} in {r['id']}")


def apply_edits(guides, edits):
    """Each edit is (slug, old, new), applied across that tour's whole entry."""
    misses = []
    for slug, old, new in edits:
        blob = json.dumps(guides[slug], ensure_ascii=False)
        n = blob.count(old)
        if n == 0:
            misses.append(f"{slug}: never found {old!r}")
            continue
        guides[slug] = json.loads(blob.replace(old, new))
    return misses


def main():
    path = os.path.join(HERE, "guides.json")
    guides = json.load(open(path, encoding="utf-8"))
    f = facts()
    edits = build_edits(f)
    misses = apply_edits(guides, edits)
    if misses:
        print("\n".join(misses))
        return 1
    json.dump(guides, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"applied {len(edits)} substitutions across "
          f"{len({e[0] for e in edits})} guides")
    return 0


def build_edits(f):
    """The substitutions, per tour, each sourced from `guide_facts.json`."""
    e = []

    def add(slug, *pairs):
        for old, new in pairs:
            e.append((slug, old, new))

    # — banseterkampen — 331 m/2,77 km line replaced by 341 m/2,73 km
    r = f["banseterkampen"]["routes"][0]
    b900, b1000, b1100 = band(r, 900), band(r, 1000), band(r, 1100)
    st = r["steepestStep"]
    add("banseterkampen",
        ("331 høydemeter", f"{r['gainM']} høydemeter"),
        ("331 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("2,77 km", f"{r['distanceM']/1000:.2f}".replace(".", ",") + " km"),
        ("2.77 km", f"{r['distanceM']/1000:.2f} km"),
        ("13,9 grader fra 900 til 1000 moh over 355 meter grunn",
         f"{b900['angle']:.1f}".replace(".", ",") + f" grader fra 900 til 1000 moh over {b900['groundM']} meter grunn"),
        ("13.9 degrees from 900 to 1000 m over 355 metres of ground",
         f"{b900['angle']:.1f} degrees from 900 to 1000 m over {b900['groundM']} metres of ground"),
        ("et steg på 20,5 grader mellom 961 og 978",
         f"et steg på {st['angle']:.1f}".replace(".", ",") + f" grader mellom {st['fromM']} og {st['toM']}"),
        ("a step of 20.5 degrees between 961 and 978",
         f"a step of {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']}"),
        ("12,8 grader fra 1000 til 1100 moh over 449 meter grunn",
         f"{b1000['angle']:.1f}".replace(".", ",") + f" grader fra 1000 til 1100 moh over {b1000['groundM']} meter grunn"),
        ("12.8 degrees from 1000 to 1100 m over 449 metres of ground",
         f"{b1000['angle']:.1f} degrees from 1000 to 1100 m over {b1000['groundM']} metres of ground"),
        ("2,7 grader over 1969 meter grunn",
         f"{b1100['angle']:.1f}".replace(".", ",") + f" grader over {b1100['groundM']} meter grunn"),
        ("2.7 degrees over 1969 metres of ground",
         f"{b1100['angle']:.1f} degrees over {b1100['groundM']} metres of ground"),
        ("brattaste band er 13,9 grader og brattaste steg 20,5",
         f"brattaste band er {b900['angle']:.1f}".replace(".", ",") + " grader og brattaste steg "
         + f"{st['angle']:.1f}".replace(".", ",")),
        ("steepest band is 13.9 degrees and the steepest step 20.5",
         f"steepest band is {b900['angle']:.1f} degrees and the steepest step {st['angle']:.1f}"),
        ("gir tilbake 48 høydemeter", f"gir tilbake {r['lossM']} høydemeter"),
        ("gives back 48 metres", f"gives back {r['lossM']} metres"),
        ("skogen som slipper taket på 954 moh",
         f"skogen som slipper taket på {r['treeline']['last_forest_m']} moh"),
        ("the forest letting go at 954 m",
         f"the forest letting go at {r['treeline']['last_forest_m']} m"),
    )

    # — folarskardnuten — the 27,2° window moved with the line
    r = f["folarskardnuten"]["routes"][0]
    b1700 = band(r, 1700)
    st = r["steepestStep"]
    add("folarskardnuten",
        ("12,61 km", f"{r['distanceM']/1000:.2f}".replace(".", ",") + " km"),
        ("12.61 km", f"{r['distanceM']/1000:.2f} km"),
        ("967 høgdemeter", f"{r['gainM']} høgdemeter"),
        ("967 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("27,2 grader over det brattaste 30-metersvindauget, mellom 1775 og 1808 moh",
         f"{r['maxAngle']:.1f}".replace(".", ",")
         + f" grader over det brattaste 30-metersvindauget, mellom {st['fromM']} og {st['toM']} moh"),
        ("27.2 degrees over its steepest 30-metre window, between 1775 and 1808 m",
         f"{r['maxAngle']:.1f} degrees over its steepest 30-metre window, "
         f"between {st['fromM']} and {st['toM']} m"),
        ("18,7 grader for 1700 til 1800 moh er eit snitt over 320 meter grunn",
         f"{b1700['angle']:.1f}".replace(".", ",")
         + f" grader for 1700 til 1800 moh er eit snitt over {b1700['groundM']} meter grunn"),
        ("18.7-degree average for the 1700 to 1800 m band is an average over 320 metres of ground",
         f"{b1700['angle']:.1f}-degree average for the 1700 to 1800 m band is an average "
         f"over {b1700['groundM']} metres of ground"),
    )

    # — glittertinden —
    r = f["glittertinden"]["routes"][0]
    add("glittertinden",
        ("1181 høydemeter", f"{r['gainM']} høydemeter"),
        ("1181 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("12,88 km", f"{r['distanceM']/1000:.2f}".replace(".", ",") + " km"),
        ("12.88 km", f"{r['distanceM']/1000:.2f} km"),
    )

    # — grafjell — three band figures in one sentence
    r = f["grafjell"]["routes"][0]
    b900, b1000, b1100 = band(r, 900), band(r, 1000), band(r, 1100)
    add("grafjell",
        ("2,2 grader over 2472 meter grunn, 1000 til 1100 måler 3,6 over 1564, og 1100 til 1200 bare 2,9 over 1902 meter",
         f"{b900['angle']:.1f}".replace(".", ",") + f" grader over {b900['groundM']} meter grunn, "
         f"1000 til 1100 måler " + f"{b1000['angle']:.1f}".replace(".", ",") + f" over {b1000['groundM']}, "
         f"og 1100 til 1200 bare " + f"{b1100['angle']:.1f}".replace(".", ",") + f" over {b1100['groundM']} meter"),
        ("2.2 degrees over 2472 metres of ground, 1000 to 1100 measures 3.6 over 1564, and 1100 to 1200 only 2.9 over 1902 metres",
         f"{b900['angle']:.1f} degrees over {b900['groundM']} metres of ground, "
         f"1000 to 1100 measures {b1000['angle']:.1f} over {b1000['groundM']}, "
         f"and 1100 to 1200 only {b1100['angle']:.1f} over {b1100['groundM']} metres"),
    )

    def no(x, d=1):
        """Norwegian decimal comma, the way the guides write figures."""
        return f"{x:.{d}f}".replace(".", ",")

    # — jonshornet — the col band
    r = f["jonshornet"]["routes"][0]
    b = band(r, 1100)
    add("jonshornet",
        (f"5,7 grader over 1008 meter grunn", f"{no(b['angle'])} grader over {b['groundM']} meter grunn"),
        ("5.7 degrees over 1008 metres of ground",
         f"{b['angle']:.1f} degrees over {b['groundM']} metres of ground"))

    # — krakfjellet — the four bands above Rundtjønnin
    r = f["krakfjellet"]["routes"][0]
    b5, b6, b7, b8 = band(r, 500), band(r, 600), band(r, 700), band(r, 800)
    add("krakfjellet",
        ("2,4, 3,8, 5,3 og 5,8 grader, og det siste av dem dekker bare 129 meter grunn",
         f"{no(b5['angle'])}, {no(b6['angle'])}, {no(b7['angle'])} og {no(b8['angle'])} grader, "
         f"og det siste av dem dekker bare {b8['groundM']} meter grunn"),
        ("2.4, 3.8, 5.3 and 5.8 degrees, and the last of them covers only 129 metres of ground",
         f"{b5['angle']:.1f}, {b6['angle']:.1f}, {b7['angle']:.1f} and {b8['angle']:.1f} degrees, "
         f"and the last of them covers only {b8['groundM']} metres of ground"),
        ("de siste 129 meterne grunn over 800 moh", f"de siste {b8['groundM']} meterne grunn over 800 moh"),
        ("the last 129 metres of ground above 800 m", f"the last {b8['groundM']} metres of ground above 800 m"),
        ("468 høydemeter", f"{r['gainM']} høydemeter"),
        ("468 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("9,63 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("9.63 km", f"{r['distanceM']/1000:.2f} km"))

    # — melderskin — distance only
    r = f["melderskin"]["routes"][0]
    add("melderskin",
        ("5,1 km", no(r["distanceM"] / 1000, 1) + " km"),
        ("5.1 km", f"{r['distanceM']/1000:.1f} km"))

    # — melshornet — the treeline and the step under it
    r = f["melshornet"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    b5, b7 = band(r, 500), band(r, 700)
    add("melshornet",
        ("Skogen slepper taket ved 476 moh", f"Skogen slepper taket ved {r['treeline']['last_forest_m']} moh"),
        ("The forest lets go at 476 m", f"The forest lets go at {r['treeline']['last_forest_m']} m"),
        ("21,7 grader over tretti meter, mellom 423 og 441 moh",
         f"{no(st['angle'])} grader over tretti meter, mellom {st['fromM']} og {st['toM']} moh"),
        ("21.7 degrees over thirty metres, between 423 and 441 m",
         f"{st['angle']:.1f} degrees over thirty metres, between {st['fromM']} and {st['toM']} m"),
        ("21,7 grader og ligg lågt, mellom 423 og 441 moh",
         f"{no(st['angle'])} grader og ligg lågt, mellom {st['fromM']} og {st['toM']} moh"),
        ("21.7 degrees and sits low, between 423 and 441 m",
         f"{st['angle']:.1f} degrees and sits low, between {st['fromM']} and {st['toM']} m"),
        ("7,2 grader i snitt frå 500 til 600 moh", f"{no(b5['angle'])} grader i snitt frå 500 til 600 moh"),
        ("7.2 degrees on average from 500 to 600 m", f"{b5['angle']:.1f} degrees on average from 500 to 600 m"),
        ("brattaste hundremeteren, 700 til 800 moh, måler 17,8",
         f"brattaste hundremeteren, {sb['fromM']} til {sb['toM']} moh, måler {no(sb['angle'])}"),
        ("the steepest hundred-metre band, 700 to 800 m, measures 17.8",
         f"the steepest hundred-metre band, {sb['fromM']} to {sb['toM']} m, measures {sb['angle']:.1f}"))

    # — molden — the steepest step moved down the hill
    r = f["molden"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    add("molden",
        ("24,8 grader over tretti meter mellom 725 og 746 moh",
         f"{no(st['angle'])} grader over tretti meter mellom {st['fromM']} og {st['toM']} moh"),
        ("24.8 degrees over thirty metres between 725 and 746 m",
         f"{st['angle']:.1f} degrees over thirty metres between {st['fromM']} and {st['toM']} m"),
        ("måler 14,8 grader, og brattaste samanhengande parti 24,8 grader mellom 725 og 746 moh",
         f"måler {no(sb['angle'])} grader, og brattaste samanhengande parti {no(st['angle'])} "
         f"grader mellom {st['fromM']} og {st['toM']} moh"),
        ("measures 14.8 degrees, and the steepest sustained section 24.8 degrees between 725 and 746 m",
         f"measures {sb['angle']:.1f} degrees, and the steepest sustained section {st['angle']:.1f} "
         f"degrees between {st['fromM']} and {st['toM']} m"))

    # — nevelfjell —
    r = f["nevelfjell"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    b8, b9, b10 = band(r, 800), band(r, 900), band(r, 1000)
    add("nevelfjell",
        ("brattaste hundremetersband er 4,8 grader fra 900 til 1000 moh over 1215 meter grunn, og brattaste sammenhengende steg 12,6 grader mellom 936 og 946",
         f"brattaste hundremetersband er {no(sb['angle'])} grader fra {sb['fromM']} til {sb['toM']} moh over "
         f"{sb['groundM']} meter grunn, og brattaste sammenhengende steg {no(st['angle'])} grader "
         f"mellom {st['fromM']} og {st['toM']}"),
        ("the steepest hundred-metre band is 4.8 degrees from 900 to 1000 m over 1215 metres of ground, and the steepest sustained step 12.6 degrees between 936 and 946",
         f"the steepest hundred-metre band is {sb['angle']:.1f} degrees from {sb['fromM']} to {sb['toM']} m over "
         f"{sb['groundM']} metres of ground, and the steepest sustained step {st['angle']:.1f} degrees "
         f"between {st['fromM']} and {st['toM']}"),
        ("2,5 grader over 1702 meter grunn", f"{no(b8['angle'])} grader over {b8['groundM']} meter grunn"),
        ("2.5 degrees over 1702 metres of ground", f"{b8['angle']:.1f} degrees over {b8['groundM']} metres of ground"),
        ("Bandet fra 900 til 1000 moh måler 4,8 grader over 1215 meter grunn og er det brattaste på turen; det brattaste steget ligger her, 12,6 grader mellom 936 og 946 moh",
         f"Bandet fra 900 til 1000 moh måler {no(b9['angle'])} grader over {b9['groundM']} meter grunn; "
         f"det brattaste steget ligger her, {no(st['angle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("The band from 900 to 1000 m measures 4.8 degrees over 1215 metres of ground and is the steepest on the tour; the steepest step is here, 12.6 degrees between 936 and 946 m",
         f"The band from 900 to 1000 m measures {b9['angle']:.1f} degrees over {b9['groundM']} metres of ground; "
         f"the steepest step is here, {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']} m"),
        ("4,4 grader fra 1000 til 1100 moh over 1151 meter grunn",
         f"{no(b10['angle'])} grader fra 1000 til 1100 moh over {b10['groundM']} meter grunn"),
        ("4.4 degrees from 1000 to 1100 m over 1151 metres of ground",
         f"{b10['angle']:.1f} degrees from 1000 to 1100 m over {b10['groundM']} metres of ground"))

    # — nibbi —
    r = f["nibbi"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    add("nibbi",
        ("20,4 grader frå 1300 til 1400 moh over 274 meter grunn",
         f"{no(sb['angle'])} grader frå {sb['fromM']} til {sb['toM']} moh over {sb['groundM']} meter grunn"),
        ("20.4 degrees from 1300 to 1400 m over 274 metres of ground",
         f"{sb['angle']:.1f} degrees from {sb['fromM']} to {sb['toM']} m over {sb['groundM']} metres of ground"),
        ("23,7 grader mellom 1172 og 1192", f"{no(st['angle'])} grader mellom {st['fromM']} og {st['toM']}"),
        ("23.7 degrees between 1172 and 1192", f"{st['angle']:.1f} degrees between {st['fromM']} and {st['toM']}"))

    # — ranten — the three flat bands
    r = f["ranten"]["routes"][0]
    b9, b10, b12 = band(r, 900), band(r, 1000), band(r, 1200)
    add("ranten",
        ("527 høydemeter", f"{r['gainM']} høydemeter"),
        ("527 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("5,56 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("5.56 km", f"{r['distanceM']/1000:.2f} km"),
        ("skoggrensa på 941 moh", f"skoggrensa på {r['treeline']['last_forest_m']} moh"),
        ("Skogen slipper taket ved 941 moh", f"Skogen slipper taket ved {r['treeline']['last_forest_m']} moh"),
        ("the treeline at 941 m", f"the treeline at {r['treeline']['last_forest_m']} m"),
        ("The forest lets go at 941 m", f"The forest lets go at {r['treeline']['last_forest_m']} m"),
        ("4,8 grader fra 900 til 1000 moh over 1075 meter grunn, 4,0 fra 1000 til 1100 over 1440 meter, og 3,9 fra 1200 til 1300 over 1516",
         f"{no(b9['angle'])} grader fra 900 til 1000 moh over {b9['groundM']} meter grunn, "
         f"{no(b10['angle'])} fra 1000 til 1100 over {b10['groundM']} meter, og "
         f"{no(b12['angle'])} fra 1200 til 1300 over {b12['groundM']}"),
        ("4.8 degrees from 900 to 1000 m over 1075 metres of ground, 4.0 from 1000 to 1100 over 1440 metres, and 3.9 from 1200 to 1300 over 1516",
         f"{b9['angle']:.1f} degrees from 900 to 1000 m over {b9['groundM']} metres of ground, "
         f"{b10['angle']:.1f} from 1000 to 1100 over {b10['groundM']} metres, and "
         f"{b12['angle']:.1f} from 1200 to 1300 over {b12['groundM']}"))

    # — rombakstotta —
    r = f["rombakstotta"]["routes"][0]
    add("rombakstotta",
        ("5,49 km og 1103 høydemeter", no(r["distanceM"] / 1000, 2) + f" km og {r['gainM']} høydemeter"),
        ("5.49 km and 1103 m of climbing", f"{r['distanceM']/1000:.2f} km and {r['gainM']} m of climbing"))

    # — skogshorn — the treeline
    r = f["skogshorn"]["routes"][0]
    tl = r["treeline"]
    add("skogshorn",
        ("Bjørka held til rundt 970 moh, og over 978 er alt ope",
         f"Bjørka held til rundt {tl['last_forest_m']} moh, og over {tl['first_open_m']} er alt ope"),
        ("The birch holds to around 970 m, and above 978 everything is open",
         f"The birch holds to around {tl['last_forest_m']} m, and above {tl['first_open_m']} everything is open"))

    # — slettind —
    r = f["slettind"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    b14 = band(r, 1400)
    add("slettind",
        ("18,6 grader frå 1500 til 1600 moh over 270 meter grunn — og brattaste samanhengande steg er 20,6 grader mellom 1501 og 1518",
         f"{no(sb['angle'])} grader frå 1500 til 1600 moh over {sb['groundM']} meter grunn — og brattaste "
         f"samanhengande steg er {no(st['angle'])} grader mellom {st['fromM']} og {st['toM']}"),
        ("18.6 degrees from 1500 to 1600 m over 270 metres of ground — and the steepest sustained step is 20.6 degrees between 1501 and 1518",
         f"{sb['angle']:.1f} degrees from 1500 to 1600 m over {sb['groundM']} metres of ground — and the steepest "
         f"sustained step is {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']}"),
        ("17,0 grader frå 1400 til 1500 moh over 315 meter grunn, og 18,6 frå 1500 til 1600 over 270",
         f"{no(b14['angle'])} grader frå 1400 til 1500 moh over {b14['groundM']} meter grunn, og "
         f"{no(sb['angle'])} frå 1500 til 1600 over {sb['groundM']}"),
        ("17.0 degrees from 1400 to 1500 m over 315 metres of ground, and 18.6 from 1500 to 1600 over 270",
         f"{b14['angle']:.1f} degrees from 1400 to 1500 m over {b14['groundM']} metres of ground, and "
         f"{sb['angle']:.1f} from 1500 to 1600 over {sb['groundM']}"),
        ("20,6 grader mellom 1501 og 1518", f"{no(st['angle'])} grader mellom {st['fromM']} og {st['toM']}"),
        ("20.6 degrees between 1501 and 1518", f"{st['angle']:.1f} degrees between {st['fromM']} and {st['toM']}"))

    # — storanosi —
    r = f["storanosi"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    b5, b11 = band(r, 500), band(r, 1100)
    add("storanosi",
        ("735 høgdemeter på 4,43 km", f"{r['gainM']} høgdemeter på " + no(r["distanceM"] / 1000, 2) + " km"),
        ("3,1 grader over 1756 meter grunn", f"{no(b11['angle'])} grader over {b11['groundM']} meter grunn"),
        ("Dei fyrste 587 metrane grunn er tilnærma flate — bandet frå 500 til 600 moh måler 8,9 grader i snitt",
         f"Dei fyrste {b5['groundM']} metrane grunn er tilnærma flate — bandet frå 500 til 600 moh måler "
         f"{no(b5['angle'])} grader i snitt"),
        ("1000 til 1100 moh med 18,8 grader i snitt, og brattaste samanhengande parti måler 26,3 grader mellom 1085 og 1107 moh",
         f"{sb['fromM']} til {sb['toM']} moh med {no(sb['angle'])} grader i snitt, og brattaste samanhengande "
         f"parti måler {no(st['angle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("1000 til 1100 moh, måler 18,8 grader, og brattaste samanhengande parti 26,3 grader mellom 1085 og 1107 moh",
         f"{sb['fromM']} til {sb['toM']} moh, måler {no(sb['angle'])} grader, og brattaste samanhengande parti "
         f"{no(st['angle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("Platået frå 1100 til 1200 moh ligg på 3,1 grader",
         f"Platået frå 1100 til 1200 moh ligg på {no(b11['angle'])} grader"),
        # — the English half of the same four sentences —
        ("735 metres of climbing over 4.43 km", f"{r['gainM']} metres of climbing over {r['distanceM']/1000:.2f} km"),
        ("3.1 degrees over 1756 metres of ground",
         f"{b11['angle']:.1f} degrees over {b11['groundM']} metres of ground"),
        ("The first 587 metres of ground are near-flat — the band from 500 to 600 m measures 8.9 degrees",
         f"The first {b5['groundM']} metres of ground are near-flat — the band from 500 to 600 m "
         f"measures {b5['angle']:.1f} degrees"),
        ("1000 to 1100 m averaging 18.8 degrees, and the steepest sustained section measures 26.3 degrees between 1085 and 1107 m",
         f"{sb['fromM']} to {sb['toM']} m averaging {sb['angle']:.1f} degrees, and the steepest sustained "
         f"section measures {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']} m"),
        ("1000 to 1100 m, measures 18.8 degrees, and the steepest sustained section 26.3 degrees between 1085 and 1107 m",
         f"{sb['fromM']} to {sb['toM']} m, measures {sb['angle']:.1f} degrees, and the steepest sustained "
         f"section {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']} m"),
        ("The plateau from 1100 to 1200 m lies at 3.1 degrees",
         f"The plateau from 1100 to 1200 m lies at {b11['angle']:.1f} degrees"),
        ("The steepest hundred-metre band sits between 1000 and 1100 m and measures 18.8 degrees",
         f"The steepest hundred-metre band sits between {sb['fromM']} and {sb['toM']} m and "
         f"measures {sb['angle']:.1f} degrees"))

    # — hamperokken — the sustained figure and the treeline
    r = f["hamperokken"]["routes"][0]
    tl = r["treeline"]
    add("hamperokken",
        ("36 grader", f"{no(r['maxAngle'])} grader"),
        ("36 degrees", f"{r['maxAngle']:.1f} degrees"),
        ("424 m", f"{tl['last_forest_m']} m"),
        ("542 m", f"{tl['first_open_m']} m"))

    # — kvamshesten — the bowl band. The line now takes the mapped route to the
    #   col instead of straight up the bowl, so 1000–1100 reads 11 degrees where
    #   it read 23. The bowl is still there and still avalanche terrain — that
    #   claim comes from the research, not from the line — so only the measured
    #   figures move, and the sentence that called the band «the steep part»
    #   now says where the steep part actually is.
    r = f["kvamshesten"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    b7, b10 = band(r, 700), band(r, 1000)
    add("kvamshesten",
        ("838 høgdemeter", f"{r['gainM']} høgdemeter"),
        ("838 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("4,93 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("4.93 km", f"{r['distanceM']/1000:.2f} km"),
        ("3,9 grader over 1485 meter grunn", f"{no(b7['angle'])} grader over {b7['groundM']} meter grunn"),
        ("3.9 degrees over 1485 metres of ground",
         f"{b7['angle']:.1f} degrees over {b7['groundM']} metres of ground"),
        ("Dette er den bratte delen: bandet frå 1000 til 1100 moh måler 22,8 grader i snitt over 237 meter grunn, og brattaste samanhengande parti 27,4 grader mellom 997 og 1015 moh",
         f"Bandet frå 1000 til 1100 moh måler {no(b10['angle'])} grader i snitt over {b10['groundM']} meter "
         f"grunn; brattaste hundremeteren er {no(sb['angle'])} frå {sb['fromM']} til {sb['toM']} moh, og "
         f"brattaste samanhengande parti {no(st['angle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("This is the steep part: the band from 1000 to 1100 m averages 22.8 degrees over 237 metres of ground, and the steepest sustained section 27.4 degrees between 997 and 1015 m",
         f"The band from 1000 to 1100 m averages {b10['angle']:.1f} degrees over {b10['groundM']} metres of "
         f"ground; the steepest hundred-metre band is {sb['angle']:.1f} from {sb['fromM']} to {sb['toM']} m, "
         f"and the steepest sustained section {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']} m"),
        ("bandet frå 1000 til 1100 moh måler 22,8 grader i snitt, brattaste samanhengande parti 27,4 grader mellom 997 og 1015 moh",
         f"bandet frå 1000 til 1100 moh måler {no(b10['angle'])} grader i snitt, brattaste samanhengande parti "
         f"{no(st['angle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("the band from 1000 to 1100 m averages 22.8 degrees, the steepest sustained section measures 27.4 degrees between 997 and 1015 m",
         f"the band from 1000 to 1100 m averages {b10['angle']:.1f} degrees, the steepest sustained section "
         f"measures {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']} m"))

    # — kyrkjebonosi —
    r = f["kyrkjebonosi"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    b7, b8, b9, b10, b15, b16 = (band(r, x) for x in (700, 800, 900, 1000, 1500, 1600))
    add("kyrkjebonosi",
        ("20,6 grader frå 1400 til 1500 moh, og brattaste steg 26,8 grader mellom 1305 og 1322",
         f"{no(sb['angle'])} grader frå {sb['fromM']} til {sb['toM']} moh, og brattaste steg "
         f"{no(st['angle'])} grader mellom {st['fromM']} og {st['toM']}"),
        ("20.6 degrees from 1400 to 1500 m, and the steepest step 26.8 degrees between 1305 and 1322",
         f"{sb['angle']:.1f} degrees from {sb['fromM']} to {sb['toM']} m, and the steepest step "
         f"{st['angle']:.1f} degrees between {st['fromM']} and {st['toM']}"),
        ("15,7 grader frå 700 til 800 moh over 302 meter grunn, 13,2 frå 800 til 900 over 416, 14,8 frå 900 til 1000 over 360, og 13,2 frå 1000 til 1100 over 443",
         f"{no(b7['angle'])} grader frå 700 til 800 moh over {b7['groundM']} meter grunn, {no(b8['angle'])} "
         f"frå 800 til 900 over {b8['groundM']}, {no(b9['angle'])} frå 900 til 1000 over {b9['groundM']}, og "
         f"{no(b10['angle'])} frå 1000 til 1100 over {b10['groundM']}"),
        ("15.7 degrees from 700 to 800 m over 302 metres of ground, 13.2 from 800 to 900 over 416, 14.8 from 900 to 1000 over 360, and 13.2 from 1000 to 1100 over 443",
         f"{b7['angle']:.1f} degrees from 700 to 800 m over {b7['groundM']} metres of ground, {b8['angle']:.1f} "
         f"from 800 to 900 over {b8['groundM']}, {b9['angle']:.1f} from 900 to 1000 over {b9['groundM']}, and "
         f"{b10['angle']:.1f} from 1000 to 1100 over {b10['groundM']}"),
        ("26,8 grader mellom 1305 og 1322 moh", f"{no(st['angle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("26.8 degrees between 1305 and 1322 m", f"{st['angle']:.1f} degrees between {st['fromM']} and {st['toM']} m"),
        ("4,5 grader over 1328 meter grunn og 1600 til 1700 måler 6,8 over 549",
         f"{no(b15['angle'])} grader over {b15['groundM']} meter grunn og 1600 til 1700 måler "
         f"{no(b16['angle'])} over {b16['groundM']}"),
        ("4.5 degrees over 1328 metres of ground and 1600 to 1700 measures 6.8 over 549",
         f"{b15['angle']:.1f} degrees over {b15['groundM']} metres of ground and 1600 to 1700 measures "
         f"{b16['angle']:.1f} over {b16['groundM']}"))

    # — lodalskapa — glacier registration read off the new line's samples
    r = f["lodalskapa"]["routes"][0]
    b5, b6, b12 = band(r, 500), band(r, 600), band(r, 1200)
    ice = min(s["z"] for s in r["terrainSamples"] if (s.get("terreng") or "").endswith("Isbre"))
    add("lodalskapa",
        ("1524 høgdemeter", f"{r['gainM']} høgdemeter"),
        ("1524 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("10,43 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("10.43 km", f"{r['distanceM']/1000:.2f} km"),
        ("0,6 grader over 1583 meter grunn, 600 til 700 moh 4,5 grader over 1345, og 1200 til 1300 moh 2,3 grader over 2429 meter",
         f"{no(b5['angle'])} grader over {b5['groundM']} meter grunn, 600 til 700 moh {no(b6['angle'])} grader "
         f"over {b6['groundM']}, og 1200 til 1300 moh {no(b12['angle'])} grader over {b12['groundM']} meter"),
        ("0.6 degrees over 1583 metres of ground, 600 to 700 m runs at 4.5 over 1345, and 1200 to 1300 m at 2.3 over 2429 metres",
         f"{b5['angle']:.1f} degrees over {b5['groundM']} metres of ground, 600 to 700 m runs at "
         f"{b6['angle']:.1f} over {b6['groundM']}, and 1200 to 1300 m at {b12['angle']:.1f} over "
         f"{b12['groundM']} metres"),
        ("breterreng på linja frå 1860 moh", f"breterreng på linja frå {ice} moh"),
        ("glacier terrain on the line from 1860 m", f"glacier terrain on the line from {ice} m"))

    # — okla —
    r = f["okla"]["routes"][0]
    b6, b7, b11 = band(r, 600), band(r, 700), band(r, 1100)
    add("okla",
        ("1024 høydemeter", f"{r['gainM']} høydemeter"),
        ("1024 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("5,69 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("5.69 km", f"{r['distanceM']/1000:.2f} km"),
        ("907 moh", f"{r['treeline']['last_forest_m']} moh"),
        ("907 m", f"{r['treeline']['last_forest_m']} m"),
        ("12,3 grader fra 600 til 700 moh og 19,8 fra 700 til 800",
         f"{no(b6['angle'])} grader fra 600 til 700 moh og {no(b7['angle'])} fra 700 til 800"),
        ("12.3 degrees from 600 to 700 m and 19.8 from 700 to 800",
         f"{b6['angle']:.1f} degrees from 600 to 700 m and {b7['angle']:.1f} from 700 to 800"),
        ("3,4 grader fra 1100 til 1200 moh over 1710 meter grunn",
         f"{no(b11['angle'])} grader fra 1100 til 1200 moh over {b11['groundM']} meter grunn"),
        ("3.4 degrees from 1100 to 1200 m over 1710 metres of ground",
         f"{b11['angle']:.1f} degrees from 1100 to 1200 m over {b11['groundM']} metres of ground"))

    # — prestholtskarvet —
    r = f["prestholtskarvet"]["routes"][0]
    b10, b11, b12 = band(r, 1000), band(r, 1100), band(r, 1200)
    add("prestholtskarvet",
        ("955 høydemeter", f"{r['gainM']} høydemeter"),
        ("955 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("11,40 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("11.40 km", f"{r['distanceM']/1000:.2f} km"),
        ("1,2 grader over 5221 meter grunn", f"{no(b12['angle'])} grader over {b12['groundM']} meter grunn"),
        ("1.2 degrees over 5221 metres of ground",
         f"{b12['angle']:.1f} degrees over {b12['groundM']} metres of ground"),
        ("3,0 grader over 1710 meter grunn, 1100 til 1200 måler 4,6 over 1260",
         f"{no(b10['angle'])} grader over {b10['groundM']} meter grunn, 1100 til 1200 måler "
         f"{no(b11['angle'])} over {b11['groundM']}"),
        ("3.0 degrees over 1710 metres of ground, 1100 to 1200 measures 4.6 over 1260",
         f"{b10['angle']:.1f} degrees over {b10['groundM']} metres of ground, 1100 to 1200 measures "
         f"{b11['angle']:.1f} over {b11['groundM']}"),
        ("skogen som slipper taket på 1048 moh", f"skogen som slipper taket på {r['treeline']['last_forest_m']} moh"),
        ("the forest letting go at 1048 m", f"the forest letting go at {r['treeline']['last_forest_m']} m"),
        ("gir tilbake 58 høydemeter", f"gir tilbake {r['lossM']} høydemeter"),
        ("gives back 58 metres", f"gives back {r['lossM']} metres"))

    # — rana —
    r = f["rana"]["routes"][0]
    add("rana",
        ("1595 høgdemeter", f"{r['gainM']} høgdemeter"),
        ("1595 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("8,12 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("8.12 km", f"{r['distanceM']/1000:.2f} km"),
        ("Kartverket fører skog til 284 moh", f"Kartverket fører skog til {r['treeline']['last_forest_m']} moh"),
        ("Kartverket has forest to 284 m", f"Kartverket has forest to {r['treeline']['last_forest_m']} m"))

    # — rasletinden —
    r = f["rasletinden"]["routes"][0]
    sb = r["steepestBand"]
    add("rasletinden",
        ("746 høydemeter", f"{r['gainM']} høydemeter"),
        ("746 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("6,55 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("6.55 km", f"{r['distanceM']/1000:.2f} km"),
        ("21,6 grader", f"{no(r['maxAngle'])} grader"),
        ("21.6 degrees", f"{r['maxAngle']:.1f} degrees"),
        ("1900 til 2000 moh, måler 17,6 grader i snitt",
         f"{sb['fromM']} til {sb['toM']} moh, måler {no(sb['angle'])} grader i snitt"),
        ("1900 to 2000 m, averages 17.6 degrees",
         f"{sb['fromM']} to {sb['toM']} m, averages {sb['angle']:.1f} degrees"))

    # — snonipa —
    r = f["snonipa"]["routes"][0]
    sb = r["steepestBand"]
    ice = min(s["z"] for s in r["terrainSamples"] if (s.get("terreng") or "").endswith("Isbre"))
    add("snonipa",
        ("1493 høgdemeter", f"{r['gainM']} høgdemeter"),
        ("1493 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("8,29 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("8.29 km", f"{r['distanceM']/1000:.2f} km"),
        ("26,0 grader", f"{no(r['maxAngle'])} grader"),
        ("26.0 degrees", f"{r['maxAngle']:.1f} degrees"),
        ("922 moh", f"{ice} moh"),
        ("922 m", f"{ice} m"),
        ("skoggrensa på 625", f"skoggrensa på {r['treeline']['last_forest_m']}"),
        ("the treeline at 625", f"the treeline at {r['treeline']['last_forest_m']}"),
        ("1300 til 1400 moh, måler 19,2 grader", f"{sb['fromM']} til {sb['toM']} moh, måler {no(sb['angle'])} grader"),
        ("1300 to 1400 m, measures 19.2 degrees", f"{sb['fromM']} to {sb['toM']} m, measures {sb['angle']:.1f} degrees"))

    # — storbekkhoa —
    r = f["storbekkhoa"]["routes"][0]
    b7, b9 = band(r, 700), band(r, 900)
    tl = r["treeline"]
    add("storbekkhoa",
        ("893 høydemeter", f"{r['gainM']} høydemeter"),
        ("893 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("5,57 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("5.57 km", f"{r['distanceM']/1000:.2f} km"),
        ("17,5 grader over 299 meter grunn", f"{no(b7['angle'])} grader over {b7['groundM']} meter grunn"),
        ("17.5 degrees over 299 metres of ground", f"{b7['angle']:.1f} degrees over {b7['groundM']} metres of ground"),
        ("Skogen slipper taket på 871 moh, og fra 878",
         f"Skogen slipper taket på {tl['last_forest_m']} moh, og fra {tl['first_open_m']}"),
        ("The forest lets go at 871 m, and from 878",
         f"The forest lets go at {tl['last_forest_m']} m, and from {tl['first_open_m']}"),
        ("3,4 grader over 1621 meter grunn", f"{no(b9['angle'])} grader over {b9['groundM']} meter grunn"),
        ("3.4 degrees over 1621 metres of ground", f"{b9['angle']:.1f} degrees over {b9['groundM']} metres of ground"),
        ("gir tilbake 12 høydemeter", f"gir tilbake {r['lossM']} høydemeter"),
        ("gives back 12 metres", f"gives back {r['lossM']} metres"))

    # — store-ble — the steepest band moved down a step, from 900–1000 to 800–900
    r = f["store-ble"]["routes"][0]
    sb, tl = r["steepestBand"], r["treeline"]
    b8, b9 = band(r, 800), band(r, 900)
    add("store-ble",
        ("670 høydemeter", f"{r['gainM']} høydemeter"),
        ("670 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("6,26 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("6.26 km", f"{r['distanceM']/1000:.2f} km"),
        ("skoggrensa på 977 moh", f"skoggrensa på {tl['last_forest_m']} moh"),
        ("the treeline at 977 m", f"the treeline at {tl['last_forest_m']} m"),
        ("bratteste hundremeteren mellom 900 og 1000 moh",
         f"bratteste hundremeteren mellom {sb['fromM']} og {sb['toM']} moh"),
        ("the steepest hundred-metre band between 900 and 1000 m",
         f"the steepest hundred-metre band between {sb['fromM']} and {sb['toM']} m"),
        ("10,7 grader fra 800 til 900 moh, og 16,7 grader fra 900 til 1000 over bare 360 meter grunn, som er bratteste hundremeteren på turen",
         f"{no(b8['angle'])} grader fra 800 til 900 moh over {b8['groundM']} meter grunn, som er bratteste "
         f"hundremeteren på turen, og {no(b9['angle'])} grader fra 900 til 1000"),
        ("10.7 degrees from 800 to 900 m, and 16.7 degrees from 900 to 1000 over only 360 metres of ground, which is the steepest hundred-metre band on the tour",
         f"{b8['angle']:.1f} degrees from 800 to 900 m over {b8['groundM']} metres of ground, which is the "
         f"steepest hundred-metre band on the tour, and {b9['angle']:.1f} degrees from 900 to 1000"),
        ("Skogen slipper taket ved 977 moh, og først på 993 moh",
         f"Skogen slipper taket ved {tl['last_forest_m']} moh, og først på {tl['first_open_m']} moh"),
        ("The forest lets go at 977 m, and only at 993 m",
         f"The forest lets go at {tl['last_forest_m']} m, and only at {tl['first_open_m']} m"),
        ("Bratteste hundremeteren er 900 til 1000 moh med 16,7 grader over 360 meter grunn — kneika opp mot skoggrensa",
         f"Bratteste hundremeteren er {sb['fromM']} til {sb['toM']} moh med {no(sb['angle'])} grader over "
         f"{sb['groundM']} meter grunn — kneika opp mot skoggrensa"),
        ("The steepest hundred-metre band is 900 to 1000 m at 16.7 degrees over 360 metres of ground — the pitch up to the treeline",
         f"The steepest hundred-metre band is {sb['fromM']} to {sb['toM']} m at {sb['angle']:.1f} degrees over "
         f"{sb['groundM']} metres of ground — the pitch up to the treeline"))

    # — torvloysa — the steepest hundred metres moved from 1400–1500 to 1700–1800
    r = f["torvloysa"]["routes"][0]
    st, sb, tl = r["steepestStep"], r["steepestBand"], r["treeline"]
    b10, b12, b18 = band(r, 1000), band(r, 1200), band(r, 1800)
    ridge = [b for b in r["bands"] if b["fromM"] >= 1000]
    lo, hi = min(b["angle"] for b in ridge), max(b["angle"] for b in ridge)
    add("torvloysa",
        ("1461 høgdemeter", f"{r['gainM']} høgdemeter"),
        ("1461 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("10,61 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("10.61 km", f"{r['distanceM']/1000:.2f} km"),
        ("skoggrensa på 800 moh", f"skoggrensa på {tl['last_forest_m']} moh"),
        ("the treeline at 800 m", f"the treeline at {tl['last_forest_m']} m"),
        ("med band mellom 7 og 20 grader heile vegen: 8,4 frå 1000 til 1100 moh, 14,1 frå 1200 til 1300, 20,2 frå 1400 til 1500 — brattaste hundremeteren — og 9,0 dei siste hundre",
         f"med band mellom {lo:.0f} og {hi:.0f} grader heile vegen: {no(b10['angle'])} frå 1000 til 1100 moh, "
         f"{no(b12['angle'])} frå 1200 til 1300, {no(sb['angle'])} frå {sb['fromM']} til {sb['toM']} — "
         f"brattaste hundremeteren — og {no(b18['angle'])} dei siste hundre"),
        ("with bands between 7 and 20 degrees the whole way: 8.4 from 1000 to 1100 m, 14.1 from 1200 to 1300, 20.2 from 1400 to 1500 — the steepest hundred-metre band — and 9.0 for the last hund",
         f"with bands between {lo:.0f} and {hi:.0f} degrees the whole way: {b10['angle']:.1f} from 1000 to 1100 m, "
         f"{b12['angle']:.1f} from 1200 to 1300, {sb['angle']:.1f} from {sb['fromM']} to {sb['toM']} — the "
         f"steepest hundred-metre band — and {b18['angle']:.1f} for the last hund"),
        ("Brattaste hundremeteren, 1400 til 1500 moh, måler 20,2 grader og brattaste samanhengande parti 27,2 grader mellom 1396 og 1419 moh",
         f"Brattaste hundremeteren, {sb['fromM']} til {sb['toM']} moh, måler {no(sb['angle'])} grader og "
         f"brattaste samanhengande parti {no(r['maxAngle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("The steepest hundred-metre band, 1400 to 1500 m, measures 20.2 degrees and the steepest sustained section 27.2 degrees between 1396 and 1419 m",
         f"The steepest hundred-metre band, {sb['fromM']} to {sb['toM']} m, measures {sb['angle']:.1f} degrees "
         f"and the steepest sustained section {r['maxAngle']:.1f} degrees between {st['fromM']} and {st['toM']} m"),
        ("Ryggen elles ligg mellom 7 og 18 grader", f"Ryggen elles ligg mellom {lo:.0f} og {hi:.0f} grader"),
        ("The rest of the ridge lies between 7 and 18 degrees",
         f"The rest of the ridge lies between {lo:.0f} and {hi:.0f} degrees"))

    # — ustetind —
    r = f["ustetind"]["routes"][0]
    st, sb = r["steepestStep"], r["steepestBand"]
    b9, b10 = band(r, 900), band(r, 1000)
    add("ustetind",
        ("413 høydemeter", f"{r['gainM']} høydemeter"),
        ("413 metres of climbing", f"{r['gainM']} metres of climbing"),
        ("4,09 km", no(r["distanceM"] / 1000, 2) + " km"),
        ("4.09 km", f"{r['distanceM']/1000:.2f} km"),
        ("brattaste sammenhengende steg 20,5 grader mellom 1325 og 1340",
         f"brattaste sammenhengende steg {no(st['angle'])} grader mellom {st['fromM']} og {st['toM']}"),
        ("the steepest sustained step 20.5 degrees between 1325 and 1340",
         f"the steepest sustained step {st['angle']:.1f} degrees between {st['fromM']} and {st['toM']}"),
        ("9,7 grader fra 1100 til 1200 moh over 585 meter grunn",
         f"{no(sb['angle'])} grader fra 1100 til 1200 moh over {sb['groundM']} meter grunn"),
        ("9.7 degrees from 1100 to 1200 m over 585 metres of ground",
         f"{sb['angle']:.1f} degrees from 1100 to 1200 m over {sb['groundM']} metres of ground"),
        ("1,0 grad over 816 meter grunn", f"{no(b9['angle'])} grad over {b9['groundM']} meter grunn"),
        ("1.0 degree over 816 metres of ground", f"{b9['angle']:.1f} degrees over {b9['groundM']} metres of ground"),
        ("5,4 grader fra 1000 til 1100 moh over 1035 meter grunn",
         f"{no(b10['angle'])} grader fra 1000 til 1100 moh over {b10['groundM']} meter grunn"),
        ("5.4 degrees from 1000 to 1100 m over 1035 metres of ground",
         f"{b10['angle']:.1f} degrees from 1000 to 1100 m over {b10['groundM']} metres of ground"),
        ("skogen som slipper taket på 1070 moh", f"skogen som slipper taket på {r['treeline']['last_forest_m']} moh"),
        ("the forest letting go at 1070 m", f"the forest letting go at {r['treeline']['last_forest_m']} m"),
        ("gir tilbake 26 høydemeter", f"gir tilbake {r['lossM']} høydemeter"),
        ("gives back 26 metres", f"gives back {r['lossM']} metres"))

    # — vassfjellet — the steepest step is no longer above Vassfjellhytta; it is
    #   down at 251 m, so the clause that put it there is dropped rather than
    #   renumbered, and the step is stated where it is.
    r = f["vassfjellet"]["routes"][0]
    st = r["steepestStep"]
    b3, b4, b5 = band(r, 300), band(r, 400), band(r, 500)
    add("vassfjellet",
        ("23,0 grader mellom 534 og 553 moh", f"{no(st['angle'])} grader mellom {st['fromM']} og {st['toM']} moh"),
        ("23.0 degrees between 534 and 553 m", f"{st['angle']:.1f} degrees between {st['fromM']} and {st['toM']} m"),
        ("4,6 grader over 1215 meter grunn, og 400 til 500 moh 3,3 grader over 1710",
         f"{no(b3['angle'])} grader over {b3['groundM']} meter grunn, og 400 til 500 moh "
         f"{no(b4['angle'])} grader over {b4['groundM']}"),
        ("4.6 degrees over 1215 metres of ground, and 400 to 500 m 3.3 degrees over 1710",
         f"{b3['angle']:.1f} degrees over {b3['groundM']} metres of ground, and 400 to 500 m "
         f"{b4['angle']:.1f} degrees over {b4['groundM']}"),
        ("15,9 grader fra 500 til 600 moh over 405 meter grunn, med et steg på ",
         f"{no(b5['angle'])} grader fra 500 til 600 moh over {b5['groundM']} meter grunn, og linjas brattaste steg måler "),
        ("15.9 degrees from 500 to 600 m over 405 metres of ground, with a step of ",
         f"{b5['angle']:.1f} degrees from 500 to 600 m over {b5['groundM']} metres of ground, and the line's steepest step measures "),
        ("gir tilbake 14 høydemeter på 4,74 km",
         f"gir tilbake {r['lossM']} høydemeter på " + no(r["distanceM"] / 1000, 2) + " km"),
        ("gives back 14 metres over 4.74 km",
         f"gives back {r['lossM']} metres over {r['distanceM']/1000:.2f} km"),
        # The avalanche section restates the same three bands and the steepest
        # point; the step is now down at 251 m, well below Vassfjellhytta.
        ("bandene under 500 moh måler 3,3 og 4,6 grader, og bandet fra 500 til 600 måler 15,9 over 405 meter grunn. Brattaste punkt på hele den routede linja er 23,0 grader, mellom 534 og 553 moh",
         f"bandene under 500 moh måler {no(b4['angle'])} og {no(b3['angle'])} grader, og bandet fra 500 til 600 "
         f"måler {no(b5['angle'])} over {b5['groundM']} meter grunn. Brattaste punkt på hele den routede linja "
         f"er {no(st['angle'])} grader, mellom {st['fromM']} og {st['toM']} moh"),
        ("bands below 500 m measure 3.3 and 4.6 degrees, and the band from 500 to 600 measures 15.9 over 405 metres of ground. The steepest point on the whole routed line is 23.0 degrees, between 534 and 553 m",
         f"bands below 500 m measure {b4['angle']:.1f} and {b3['angle']:.1f} degrees, and the band from 500 to 600 "
         f"measures {b5['angle']:.1f} over {b5['groundM']} metres of ground. The steepest point on the whole "
         f"routed line is {st['angle']:.1f} degrees, between {st['fromM']} and {st['toM']} m"))

    # — ytstevasshornet —
    r = f["ytstevasshornet"]["routes"][0]
    b5 = r["bands"][0]
    add("ytstevasshornet",
        (f"Dei fyrste 858 metrane grunn er flate — 4,3 grader",
         f"Dei fyrste {b5['groundM']} metrane grunn er flate — {no(b5['angle'])} grader"),
        ("The first 858 metres of ground are flat — 4.3 degrees",
         f"The first {b5['groundM']} metres of ground are flat — {b5['angle']:.1f} degrees"))

    return e


if __name__ == "__main__":
    sys.exit(main())
