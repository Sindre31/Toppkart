"""Re-ground the figures in `guides.json` on the routes as they are now.

Second round. The first round (#71) fixed the 27 opening figures and the band
tables of the eight alpine-resort guides after the trail round (#62) moved 57
of 95 lines. Its substitutions were exact strings, and exact strings miss
variants: the same stale figure often appears twice in one guide — once in the
sentence the round fixed and once in an intro or avalanche body phrased
differently. A band-tied scan over all 91 guides (each «A° fra X til Y moh»
claim re-derived against its own band with the pipeline's own definitions)
found the leftovers: 30 guides still quoting the pre-#62 line. Every claim
below was verified to match the pre-#62 geometry exactly, which is what
identifies stale prose rather than a wrong measurement.

Same rules as the first round: each edit replaces a figure with the same
figure measured on the shipped line. Where the *identity* of a superlative
moved — Okla's steepest band is now 700–800 m, not 1000–1100; Tromsdalstinden's
steepest step is now in the slope up to Salen, not on the ridge — the sentence
is rewritten to say where the steep ground actually is, in both languages.

Every edit is (slug, old, new) and must match at least once, or the run
reports it and exits non-zero. The proof afterwards is mechanical: the
band-tied scan comes back empty and `check_guides.py` stays clean.
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
    """The substitutions, per tour. Values verified against guide_facts.json."""
    e = []

    def add(slug, *pairs):
        for old, new in pairs:
            e.append((slug, old, new))

    # — banseterkampen — the intro kept the pre-#62 step in a phrasing the
    #   first round's exact strings did not cover
    add("banseterkampen",
        ("brattaste hundremetersband er 13,9 grader fra 900 til 1000 moh, og brattaste steg 20,5 grader mellom 961 og 978",
         "brattaste hundremetersband er 14,0 grader fra 900 til 1000 moh, og brattaste steg 22,1 grader mellom 986 og 1000"),
        ("the steepest hundred-metre band is 13.9 degrees from 900 to 1000 m, and the steepest step 20.5 degrees between 961 and 978",
         "the steepest hundred-metre band is 14.0 degrees from 900 to 1000 m, and the steepest step 22.1 degrees between 986 and 1000"))

    # — besshoe — band and steepest span both moved a touch
    add("besshoe",
        ("måler 17,0 grader i snitt", "måler 18,0 grader i snitt"),
        ("holder 17,0 grader i snitt", "holder 18,0 grader i snitt"),
        ("på linja er 23,2 grader", "på linja er 28,1 grader"),
        ("på linja måler 23,2 grader", "på linja måler 28,1 grader"),
        ("averages 17.0 degrees", "averages 18.0 degrees"),
        ("on the line is 23.2 degrees", "on the line is 28.1 degrees"),
        ("on the line measures 23.2 degrees", "on the line measures 28.1 degrees"))

    # — breitinden — the 600–700 band, stale since the #58 reroute off the lake
    add("breitinden",
        ("måler 23,4 grader", "måler 22,2 grader"),
        ("averages 23.4 degrees", "averages 22.2 degrees"))

    # — folarskardnuten — the approach band
    add("folarskardnuten",
        ("bandet mellom 1200 og 1300 moh måler 1,6 grader i snitt",
         "bandet mellom 1200 og 1300 moh måler 2,1 grader i snitt"),
        ("the band between 1200 and 1300 m averages 1.6 degrees",
         "the band between 1200 and 1300 m averages 2.1 degrees"))

    # — glitregga — three bands drifted a tenth or three; the steepest span
    #   moved from 1044–1063 up to the last rise to the cairn at 1297
    add("glitregga",
        ("16,0 grader i snitt frå 500 til 600 moh", "15,7 grader i snitt frå 500 til 600 moh"),
        ("16,0 grader frå 800 til 900 moh og 18,4 frå 900 til 1000",
         "15,7 grader frå 800 til 900 moh og 18,5 frå 900 til 1000"),
        ("11,9 grader frå 1200 til 1300 moh", "11,6 grader frå 1200 til 1300 moh"),
        ("21,4 grader og ligg mellom 1044 og 1063 moh", "23,8 grader og ligg mellom 1280 og 1297 moh"),
        ("på linja måler 21,4 grader", "på linja måler 23,8 grader"),
        ("brattaste hundremeteren, 900 til 1000 moh, måler 18,4 grader, og brattaste samanhengande parti 21,4 grader mellom 1044 og 1063 moh",
         "brattaste hundremeteren, 900 til 1000 moh, måler 18,5 grader, og brattaste samanhengande parti 23,8 grader mellom 1280 og 1297 moh"),
        ("16.0 degrees on average from 500 to 600 m", "15.7 degrees on average from 500 to 600 m"),
        ("16.0 degrees from 800 to 900 m and 18.4 from 900 to 1000",
         "15.7 degrees from 800 to 900 m and 18.5 from 900 to 1000"),
        ("11.9 degrees from 1200 to 1300 m", "11.6 degrees from 1200 to 1300 m"),
        ("21.4 degrees and lies between 1044 and 1063 m", "23.8 degrees and lies between 1280 and 1297 m"),
        ("on the line measures 21.4 degrees", "on the line measures 23.8 degrees"),
        ("the steepest hundred-metre band, 900 to 1000 m, measures 18.4 degrees, and the steepest sustained section 21.4 degrees between 1044 and 1063 m",
         "the steepest hundred-metre band, 900 to 1000 m, measures 18.5 degrees, and the steepest sustained section 23.8 degrees between 1280 and 1297 m"))

    # — glittertinden — the line now climbs the north flank on the marked-path
    #   side: the steepest band moved from 1400–1500 to 1600–1700 and the
    #   steepest span reads 18.5 where the old line read 19.6
    add("glittertinden",
        ("på hele linja måler 19,6 grader", "på hele linja måler 18,5 grader"),
        ("bratteste sammenhengende parti på linja er 19,6 grader", "bratteste sammenhengende parti på linja er 18,5 grader"),
        ("bratteste sammenhengende parti måler 19,6 grader", "bratteste sammenhengende parti måler 18,5 grader"),
        ("ligger mellom 1400 og 1500 moh og holder 13,5 grader i snitt",
         "ligger mellom 1600 og 1700 moh og holder 13,2 grader i snitt"),
        ("den bratteste hundremeteren, 1400 til 1500 moh, holder 13,5 grader i snitt",
         "den bratteste hundremeteren, 1600 til 1700 moh, holder 13,2 grader i snitt"),
        ("holder 9 til 16 grader i snitt, med enkeltsteg opp mot 23",
         "holder 9 til 13 grader i snitt, med enkeltsteg opp mot 19"),
        ("on the whole line measures 19.6 degrees", "on the whole line measures 18.5 degrees"),
        ("the steepest sustained section on the line is 19.6 degrees", "the steepest sustained section on the line is 18.5 degrees"),
        ("the steepest sustained section measures 19.6 degrees", "the steepest sustained section measures 18.5 degrees"),
        ("lies between 1400 and 1500 m and averages 13.5 degrees",
         "lies between 1600 and 1700 m and averages 13.2 degrees"),
        ("the steepest hundred-metre band, 1400 to 1500 m, averages 13.5 degrees",
         "the steepest hundred-metre band, 1600 to 1700 m, averages 13.2 degrees"),
        ("holds 9 to 16 degrees on average, with individual steps up to 23",
         "holds 9 to 13 degrees on average, with individual steps up to 19"))

    # — grafjell —
    add("grafjell",
        ("7,4 grader fra 1200 til 1300 moh", "6,3 grader fra 1200 til 1300 moh"),
        ("mellom 1275 og 1292 moh ligger bratteste sammenhengende parti på turen, 20,7 grader",
         "mellom 1283 og 1302 moh ligger bratteste sammenhengende parti på turen, 22,9 grader"),
        ("Bratteste sammenhengende parti måler 20,7 grader, mellom 1275 og 1292 moh",
         "Bratteste sammenhengende parti måler 22,9 grader, mellom 1283 og 1302 moh"),
        ("10,0 grader over 596 meter grunn", "10,0 grader over 585 meter grunn"),
        ("7.4 degrees from 1200 to 1300 m", "6.3 degrees from 1200 to 1300 m"),
        ("between 1275 and 1292 m sits the steepest sustained section of the tour, 20.7 degrees",
         "between 1283 and 1302 m sits the steepest sustained section of the tour, 22.9 degrees"),
        ("The steepest sustained section measures 20.7 degrees, between 1275 and 1292 m",
         "The steepest sustained section measures 22.9 degrees, between 1283 and 1302 m"),
        ("10.0 degrees over 596 metres of ground", "10.0 degrees over 585 metres of ground"))

    # — jonshornet —
    add("jonshornet",
        ("19,5 grader frå 200 til 300 moh og 19,1 frå 300 til 400",
         "19,6 grader frå 200 til 300 moh og 19,3 frå 300 til 400"),
        ("Brattaste samanhengande parti måler 32,2 grader, og skia",
         "Brattaste samanhengande parti måler 33,7 grader, og skia"),
        ("32,2 grader mellom 1165 og 1187 moh", "33,7 grader mellom 1165 og 1185 moh"),
        ("bandet frå 1200 til 1300 moh måler 18,4 grader", "bandet frå 1200 til 1300 moh måler 18,5 grader"),
        ("bandet frå 1200 til 1300 moh 18,4 grader", "bandet frå 1200 til 1300 moh 18,5 grader"),
        ("bandet frå 700 til 800 moh måler 12,5 grader og 900 til 1000 moh 15,5",
         "bandet frå 700 til 800 moh måler 12,1 grader og 900 til 1000 moh 15,2"),
        ("19.5 degrees from 200 to 300 m and 19.1 from 300 to 400",
         "19.6 degrees from 200 to 300 m and 19.3 from 300 to 400"),
        ("The steepest sustained section measures 32.2 degrees, and most people",
         "The steepest sustained section measures 33.7 degrees, and most people"),
        ("32.2 degrees between 1165 and 1187 m", "33.7 degrees between 1165 and 1185 m"),
        ("the band from 1200 to 1300 m measures 18.4 degrees", "the band from 1200 to 1300 m measures 18.5 degrees"),
        ("the band from 1200 to 1300 m runs at 18.4", "the band from 1200 to 1300 m runs at 18.5"),
        ("the band from 700 to 800 m measures 12.5 degrees and 900 to 1000 m runs at 15.5",
         "the band from 700 to 800 m measures 12.1 degrees and 900 to 1000 m runs at 15.2"))

    # — kvamshesten — check_ground: the line is on the ice of three natural
    #   tarns (Skaravatnet ~244 m at 715 moh, an unnamed tarn 58 m at 726 in
    #   the pass, Grunnevatnet ~262 m at 785), measured on the point API at
    #   3–4 m steps, while «held nordsida av vatnet ... rundar Grunnevatnet»
    #   read as staying on land. None is regulated, so the prose states the
    #   crossings the way the other natural-tarn tours do — a reroute is for
    #   reservoirs, not for tarns the corridor itself passes over.
    add("kvamshesten",
        ("Ruta held nordsida av vatnet vestover og rundar Grunnevatnet på 785 moh.",
         "Ruta går vestover langs nordsida av vatnet og forbi Grunnevatnet på 785 moh — og linja ligg på isen undervegs: om lag 240 meter på Skaravatnet, 58 meter på eit unamngjeve tjern på 726 moh i skaret, og om lag 260 meter på Grunnevatnet, opptil om lag 40 meter frå land. Alle tre er naturlege fjellvatn, ikkje magasin, men det er vatn under snøen og skal vurderast som det."),
        ("The route holds the north side of the lake westward and rounds Grunnevatnet at 785 m.",
         "The route runs west along the north side of the lake and past Grunnevatnet at 785 m — and the line sits on the ice along the way: about 240 metres on Skaravatnet, 58 metres on an unnamed tarn at 726 m in the pass, and about 260 metres on Grunnevatnet, up to about 40 metres from shore. All three are natural mountain tarns, not reservoirs, but they are water under the snow and to be judged as that."))

    # — kavringtinden — the guide quoted the steepest step as 34 in one
    #   sentence and 30,3 in another; the line says 33,5 in both places
    add("kavringtinden",
        ("moh, 24,9 grader i snitt", "moh, 24,5 grader i snitt"),
        ("på 24,9 grader i snitt", "på 24,5 grader i snitt"),
        ("måler 34.", "måler 33,5."),
        ("måler 30,3.", "måler 33,5."),
        ("24.9 degrees on average", "24.5 degrees on average"),
        ("measures 34.", "measures 33.5."),
        ("measures 30.3.", "measures 33.5."))

    # — krakfjellet — the steepest place on the line moved down onto the
    #   forest-road pitch at 467–480 m
    add("krakfjellet",
        ("13,9 grader mellom 659 og 670 moh", "16,1 grader mellom 467 og 480 moh"),
        ("bandene måler 1,2, 2,4, 3,8, 5,3 og 5,8 grader", "bandene måler 1,2, 2,4, 3,6, 6,0 og 5,7 grader"),
        ("gir tilbake 64 høydemeter", "gir tilbake 67 høydemeter"),
        ("13.9 degrees between 659 and 670 m", "16.1 degrees between 467 and 480 m"),
        ("the bands measure 1.2, 2.4, 3.8, 5.3 and 5.8 degrees", "the bands measure 1.2, 2.4, 3.6, 6.0 and 5.7 degrees"),
        ("gives back 64 metres", "gives back 67 metres"))

    # — lodalskapa — the top band and the steepest span above the glacier edge
    add("lodalskapa",
        ("Bandet frå 1900 til 2000 moh måler 19,8 grader, og brattaste samanhengande parti 35,6 grader mellom 1975 og 2008.",
         "Bandet frå 1900 til 2000 moh måler 17,1 grader, og brattaste samanhengande parti 27,3 grader mellom 2000 og 2023."),
        ("35,6 grader mellom 1975 og 2008 moh", "27,3 grader mellom 2000 og 2023 moh"),
        ("The band from 1900 to 2000 m measures 19.8 degrees, and the steepest sustained section 35.6 degrees between 1975 and 2008.",
         "The band from 1900 to 2000 m measures 17.1 degrees, and the steepest sustained section 27.3 degrees between 2000 and 2023."),
        ("35.6 degrees between 1975 and 2008 m", "27.3 degrees between 2000 and 2023 m"))

    # — melshornet — the steepest band moved from 700–800 down to 400–500,
    #   and the treeline the caption quotes is the one the first round already
    #   corrected in the body: 454, not 476
    add("melshornet",
        ("Brattaste samanhengande parti måler 21,7 grader, og det ligg nede like under skoggrensa på 476 moh",
         "Brattaste samanhengande parti måler 23,8 grader, og det ligg nede rett over skoggrensa på 454 moh"),
        ("med skoggrensa på 476 moh og brattaste hundremeteren mellom 700 og 800 moh",
         "med skoggrensa på 454 moh og brattaste hundremeteren mellom 400 og 500 moh"),
        ("Ryggen stig jamt til topps: 12,7 grader frå 600 til 700 moh og 17,8 frå 700 til 800, som er brattaste hundremeteren.",
         "Ryggen stig jamt til topps: 12,9 grader frå 600 til 700 moh og 13,1 frå 700 til 800."),
        ("The steepest sustained section measures 21.7 degrees, and it sits just below the treeline at 476 m",
         "The steepest sustained section measures 23.8 degrees, and it sits just above the treeline at 454 m"),
        ("with the treeline at 476 m and the steepest hundred-metre band between 700 and 800 m",
         "with the treeline at 454 m and the steepest hundred-metre band between 400 and 500 m"),
        ("The ridge climbs evenly to the top: 12.7 degrees from 600 to 700 m and 17.8 from 700 to 800, which is the steepest hundred-metre band.",
         "The ridge climbs evenly to the top: 12.9 degrees from 600 to 700 m and 13.1 from 700 to 800."),
        ("7,2 grader over 810 meter grunn", "6,7 grader over 855 meter grunn"),
        ("7.2 degrees over 810 metres of ground", "6.7 degrees over 855 metres of ground"))

    # — molden — intro and one avalanche body kept the pre-#62 figures the
    #   first round fixed elsewhere in the same guide
    add("molden",
        ("Brattaste hundremeteren måler 14,8 grader, og brattaste samanhengande parti 24,8 —",
         "Brattaste hundremeteren måler 16,3 grader, og brattaste samanhengande parti 23,3 —"),
        ("Brattaste hundremeteren er 900 til 1000 moh med 14,8 grader i snitt",
         "Brattaste hundremeteren er 900 til 1000 moh med 16,3 grader i snitt"),
        ("10,7 grader frå 500 til 600 moh, 14,4 frå 600 til 700 og 14,2 frå 700 til 800",
         "10,0 grader frå 500 til 600 moh, 11,6 frå 600 til 700 og 14,3 frå 700 til 800"),
        ("8,9 grader frå 1000 til 1100 moh", "7,9 grader frå 1000 til 1100 moh"),
        ("The steepest hundred-metre band measures 14.8 degrees, and the steepest sustained section 24.8 —",
         "The steepest hundred-metre band measures 16.3 degrees, and the steepest sustained section 23.3 —"),
        ("The steepest hundred-metre band is 900 to 1000 m averaging 14.8 degrees",
         "The steepest hundred-metre band is 900 to 1000 m averaging 16.3 degrees"),
        ("10.7 degrees from 500 to 600 m, 14.4 from 600 to 700 and 14.2 from 700 to 800",
         "10.0 degrees from 500 to 600 m, 11.6 from 600 to 700 and 14.3 from 700 to 800"),
        ("8.9 degrees from 1000 to 1100 m", "7.9 degrees from 1000 to 1100 m"))

    # — okla — the steepest band is now 700–800 in the birch forest, not
    #   1000–1100 on the shoulder, so the identity moves to the intro and the
    #   shoulder paragraph states its own band without the superlative
    add("okla",
        ("Brattaste hundremetersband er 20,6 grader fra 1000 til 1100 moh, og brattaste steg 25,3 grader mellom 1481 og 1496",
         "Brattaste hundremetersband er 19,8 grader fra 700 til 800 moh, og brattaste steg 26,1 grader mellom 1481 og 1499"),
        ("Bandene måler 16,4 og 15,8 grader, og det brattaste hundremetersbandet på turen ligger her: 20,6 grader fra 1000 til 1100 moh over 271 meter grunn.",
         "Bandene måler 15,3 og 12,8 grader, og bandet fra 1000 til 1100 moh måler 15,1 grader over 405 meter grunn."),
        ("Siste stigning måler 19,7 grader fra 1400 til 1500 moh og 16,9 videre, med et steg på 25,3 grader mellom 1481 og 1496 moh.",
         "Siste stigning måler 19,5 grader fra 1400 til 1500 moh og 17,0 videre, med et steg på 26,1 grader mellom 1481 og 1499 moh."),
        ("der brattaste hundremetersband er 20,6 grader fra 1000 til 1100 moh og brattaste sammenhengende steg 25,3 grader mellom 1481 og 1496",
         "der brattaste hundremetersband er 19,8 grader fra 700 til 800 moh og brattaste sammenhengende steg 26,1 grader mellom 1481 og 1499"),
        ("Ruta gir tilbake 40 høydemeter", "Ruta gir tilbake 41 høydemeter"),
        ("ned til 1509 moh, og 500 meter ned 72", "ned til 1510 moh, og 500 meter ned 71"),
        ("The steepest hundred-metre band is 20.6 degrees from 1000 to 1100 m, and the steepest step 25.3 degrees between 1481 and 1496",
         "The steepest hundred-metre band is 19.8 degrees from 700 to 800 m, and the steepest step 26.1 degrees between 1481 and 1499"),
        ("The bands measure 16.4 and 15.8 degrees, and the steepest hundred-metre band on the tour sits here: 20.6 degrees from 1000 to 1100 m over 271 metres of ground.",
         "The bands measure 15.3 and 12.8 degrees, and the band from 1000 to 1100 m measures 15.1 degrees over 405 metres of ground."),
        ("The last climb measures 19.7 degrees from 1400 to 1500 m and 16.9 above that, with a step of 25.3 degrees between 1481 and 1496 m.",
         "The last climb measures 19.5 degrees from 1400 to 1500 m and 17.0 above that, with a step of 26.1 degrees between 1481 and 1499 m."),
        ("where the steepest hundred-metre band is 20.6 degrees from 1000 to 1100 m and the steepest sustained step 25.3 degrees between 1481 and 1496",
         "where the steepest hundred-metre band is 19.8 degrees from 700 to 800 m and the steepest sustained step 26.1 degrees between 1481 and 1499"),
        ("The route gives back 40 metres", "The route gives back 41 metres"),
        ("down to 1509 m, and 500 metres down 72", "down to 1510 m, and 500 metres down 71"))

    # — rana — the line up from Nordkopen moved: the steepest hundred is now
    #   1200–1300 on the climb to the arête, and the summit-crest step reads
    #   38,0 between 1530 and 1554
    add("rana",
        ("måler 37,5 grader og ligg heilt oppe på toppkammen, mellom 1530 og 1555 moh",
         "måler 38,0 grader og ligg heilt oppe på toppkammen, mellom 1530 og 1554 moh"),
        ("Bandet frå 400 til 500 moh måler 17,3 grader", "Bandet frå 400 til 500 moh måler 11,7 grader"),
        ("5,8 grader frå 100 til 200 moh og 6,6 frå 200 til 300",
         "5,5 grader frå 100 til 200 moh og 6,5 frå 200 til 300"),
        ("Bandet frå 1000 til 1100 moh er brattaste hundremeteren, 21,0 grader i snitt, og partiet frå 600 til 800 moh under det ligg på 18 til 20 grader",
         "Bandet frå 1200 til 1300 moh er brattaste hundremeteren, 19,2 grader i snitt, og partiet frå 700 til 1000 moh under det ligg på 16 til 19 grader"),
        ("6,9 grader frå 1300 til 1400", "7,2 grader frå 1300 til 1400"),
        ("37,5 grader over tretti meter mellom 1530 og 1555 moh",
         "38,0 grader over tretti meter mellom 1530 og 1554 moh"),
        ("bandet frå 1000 til 1100 moh måler 21,0 grader i snitt",
         "bandet frå 1200 til 1300 moh måler 19,2 grader i snitt"),
        ("measures 37.5 degrees and sits right up on the summit crest, between 1530 and 1555 m",
         "measures 38.0 degrees and sits right up on the summit crest, between 1530 and 1554 m"),
        ("The band from 400 to 500 m measures 17.3 degrees", "The band from 400 to 500 m measures 11.7 degrees"),
        ("5.8 degrees from 100 to 200 m and 6.6 from 200 to 300",
         "5.5 degrees from 100 to 200 m and 6.5 from 200 to 300"),
        ("The band from 1000 to 1100 m is the steepest hundred-metre band at 21.0 degrees, and the ground from 600 to 800 m below it runs at 18 to 20",
         "The band from 1200 to 1300 m is the steepest hundred-metre band at 19.2 degrees, and the ground from 700 to 1000 m below it runs at 16 to 19"),
        ("6.9 degrees from 1300 to 1400", "7.2 degrees from 1300 to 1400"),
        ("37.5 degrees over thirty metres between 1530 and 1555 m",
         "38.0 degrees over thirty metres between 1530 and 1554 m"),
        ("the band from 1000 to 1100 m averages 21.0 degrees",
         "the band from 1200 to 1300 m averages 19.2 degrees"))

    # — ranten — the slope from Raudmyra follows the trail now: band 10,8 over
    #   566 m and the steepest span 19,6 between 1354 and 1370
    add("ranten",
        ("bratteste sammenhengende parti måler 27,1 grader", "bratteste sammenhengende parti måler 19,6 grader"),
        ("Bandet fra 1300 til 1400 moh måler 13,9 grader over 405 meter grunn — det er halve stigningen på under en halv kilometer — og mellom 1322 og 1338 moh ligger bratteste sammenhengende parti, 27,1 grader.",
         "Bandet fra 1300 til 1400 moh måler 10,8 grader over 566 meter grunn — det er halve stigningen på en drøy halv kilometer — og mellom 1354 og 1370 moh ligger bratteste sammenhengende parti, 19,6 grader."),
        ("13,9 grader i snitt fra 1300 til 1400 moh, og bratteste sammenhengende parti 27,1 grader mellom 1322 og 1338 moh",
         "10,8 grader i snitt fra 1300 til 1400 moh, og bratteste sammenhengende parti 19,6 grader mellom 1354 og 1370 moh"),
        ("the steepest sustained section measures 27.1 degrees", "the steepest sustained section measures 19.6 degrees"),
        ("The band from 1300 to 1400 m measures 13.9 degrees over 405 metres of ground — half the climbing in under half a kilometre — and between 1322 and 1338 m sits the steepest sustained section, 27.1 degrees.",
         "The band from 1300 to 1400 m measures 10.8 degrees over 566 metres of ground — half the climbing in a good half-kilometre — and between 1354 and 1370 m sits the steepest sustained section, 19.6 degrees."),
        ("13.9 degrees on average from 1300 to 1400 m, and a steepest sustained section of 27.1 degrees between 1322 and 1338 m",
         "10.8 degrees on average from 1300 to 1400 m, and a steepest sustained section of 19.6 degrees between 1354 and 1370 m"))

    # — rombakstotta —
    add("rombakstotta",
        ("med 18,8 grader i snitt, og bratteste enkeltsteg måler 26,3 grader",
         "med 16,1 grader i snitt, og bratteste enkeltsteg måler 27,1 grader"),
        ("at a mean of 18.8 degrees, and the steepest single step measures 26.3 degrees",
         "at a mean of 16.1 degrees, and the steepest single step measures 27.1 degrees"))

    # — skarene — two bands drifted a tenth and the top two now tie, so the
    #   superlative names them both
    add("skarene",
        ("18,1 grader frå 900 til 1000 moh, 20,5 frå 1000 til 1100, 20,0 frå 1300 til 1400, 21,2 frå 1500 til 1600 og 21,3 frå 1600 til 1700 — brattaste hundremeteren",
         "17,9 grader frå 900 til 1000 moh, 20,5 frå 1000 til 1100, 19,6 frå 1300 til 1400, 21,2 frå 1500 til 1600 og 21,2 frå 1600 til 1700 — dei to brattaste hundremetrane"),
        ("26,8 grader mellom 1528 og 1544", "27,9 grader mellom 1528 og 1544"),
        ("band mellom 18,1 og 21,3 grader", "band mellom 17,9 og 21,2 grader"),
        ("18.1 degrees from 900 to 1000 m, 20.5 from 1000 to 1100, 20.0 from 1300 to 1400, 21.2 from 1500 to 1600 and 21.3 from 1600 to 1700 — the steepest hundred-metre band",
         "17.9 degrees from 900 to 1000 m, 20.5 from 1000 to 1100, 19.6 from 1300 to 1400, 21.2 from 1500 to 1600 and 21.2 from 1600 to 1700 — the two steepest hundred-metre bands"),
        ("26.8 degrees between 1528 and 1544", "27.9 degrees between 1528 and 1544"),
        ("bands between 18.1 and 21.3 degrees", "bands between 17.9 and 21.2 degrees"))

    # — snonipa —
    add("snonipa",
        ("15,9 grader frå 1200 til 1300 moh, 19,2 frå 1300 til 1400 — brattaste hundremeteren — og 18,2 frå 1700 til 1800",
         "15,6 grader frå 1200 til 1300 moh, 19,4 frå 1300 til 1400 — brattaste hundremeteren — og 17,8 frå 1700 til 1800"),
        ("15.9 degrees from 1200 to 1300 m, 19.2 from 1300 to 1400 — the steepest hundred-metre band — and 18.2 from 1700 to 1800",
         "15.6 degrees from 1200 to 1300 m, 19.4 from 1300 to 1400 — the steepest hundred-metre band — and 17.8 from 1700 to 1800"))

    # — steindalsnosi — the «40 metres at 35 degrees» step matches the pre-#62
    #   line; the two sentences the first round fixed already say 30,3
    add("steindalsnosi",
        ("det bratteste steget på veg opp er 40 meter med 35 grader mellom 1820 og 1860 moh",
         "det bratteste steget på veg opp er 30,3 grader over tretti meter mellom 1828 og 1848 moh"),
        ("Bratteste parti på oppstigninga: 35 grader mellom 1820 og 1860 moh.",
         "Bratteste parti på oppstigninga: 30,3 grader mellom 1828 og 1848 moh."),
        ("the steepest step on the way up is 40 metres at 35 degrees between 1820 and 1860 m",
         "the steepest step on the way up is 30.3 degrees over thirty metres between 1828 and 1848 m"),
        ("Steepest section on the climb: 35 degrees between 1820 and 1860 m.",
         "Steepest section on the climb: 30.3 degrees between 1828 and 1848 m."))

    # — storanosi — one Norwegian intro sentence kept the old band figure the
    #   first round fixed in English
    add("storanosi",
        ("mellom 1000 og 1100 moh og måler 18,8 grader", "mellom 1000 og 1100 moh og måler 18,4 grader"),
        ("gives back 40 metres of height", "gives back 47 metres of height"))

    # — storbekkhoa — the steepest step moved from under the ridge down into
    #   the birch forest at 661–683, and the two top bands no longer tie with
    #   700–800
    add("storbekkhoa",
        ("897 høydemeter der brattaste hundremetersband er 17,5 grader — og det er to av dem, fra 700 til 800 moh og fra 1300 til 1400 — og brattaste sammenhengende steg 26,4 grader mellom 1082 og 1099.",
         "897 høydemeter der brattaste hundremetersband er 15,8 grader, fra 700 til 800 moh, og brattaste sammenhengende steg 25,8 grader mellom 661 og 683."),
        ("brattaste hundremetersband er 17,5 grader", "brattaste hundremetersband er 15,8 grader"),
        ("Bandet fra 700 til 800 moh er det brattaste under skoggrensa, 15,8 grader over 360 meter grunn.",
         "Bandet fra 700 til 800 moh er det brattaste på hele turen, 15,8 grader over 360 meter grunn, og det brattaste sammenhengende steget på linja ligger like under: 25,8 grader mellom 661 og 683 moh."),
        ("Ryggen vest for bekken ligger på 1211 moh, og det brattaste sammenhengende steget kommer like under: 26,4 grader mellom 1082 og 1099 moh.",
         "Ryggen vest for bekken ligger på 1211 moh, og bandet fra 1000 til 1100 moh opp mot den måler 12,6 grader."),
        ("Bandene her måler 17,5 og 16,1 grader.", "Bandene her måler 9,7 og 15,7 grader."),
        ("897 metres of climbing where the steepest hundred-metre band is 17.5 degrees — and there are two of them, from 700 to 800 m and from 1300 to 1400 — and the steepest sustained step 26.4 degrees between 1082 and 1099.",
         "897 metres of climbing where the steepest hundred-metre band is 15.8 degrees, from 700 to 800 m, and the steepest sustained step 25.8 degrees between 661 and 683."),
        ("the steepest hundred-metre band is 17.5 degrees", "the steepest hundred-metre band is 15.8 degrees"),
        ("The band from 700 to 800 m is the steepest below the treeline, 15.8 degrees over 360 metres of ground.",
         "The band from 700 to 800 m is the steepest of the whole tour, 15.8 degrees over 360 metres of ground, and the steepest sustained step on the line sits just below it: 25.8 degrees between 661 and 683 m."),
        ("The ridge west of the stream sits at 1211 m, and the steepest sustained step comes just below it: 26.4 degrees between 1082 and 1099 m.",
         "The ridge west of the stream sits at 1211 m, and the band from 1000 to 1100 m up toward it measures 12.6 degrees."),
        ("The bands here measure 17.5 and 16.1 degrees.", "The bands here measure 9.7 and 15.7 degrees."))

    # — store-ble — the 35,2° span kept its angle and moved 100 m down the
    #   summit slope
    add("store-ble",
        ("mellom 1290 og 1314 moh", "mellom 1228 og 1251 moh"),
        ("på sørsida 300 meter fra varden", "på sørsida snaut 500 meter fra varden"),
        ("between 1290 and 1314 m", "between 1228 and 1251 m"),
        ("on the south side 300 metres from the cairn", "on the south side just under 500 metres from the cairn"),
        ("en kneik gjennom Langedalen der bandet fra 900 til 1000 moh måler 16,7 grader",
         "en kneik gjennom Langedalen der bandet fra 800 til 900 moh måler 11,2 grader"),
        ("a pitch through Langedalen where the band from 900 to 1000 m measures 16.7 degrees",
         "a pitch through Langedalen where the band from 800 to 900 m measures 11.2 degrees"))

    # — storhornet — the steepest step moved from the forest at 826–842 up to
    #   1463–1480 below the shelter, and the whole band ladder shifted a tenth
    add("storhornet",
        ("ingen hundremetersband måler mer enn 13,4 grader, brattaste sammenhengende steg er 19,6 grader mellom 826 og 842 moh",
         "ingen hundremetersband måler mer enn 13,1 grader, brattaste sammenhengende steg er 20,5 grader mellom 1463 og 1480 moh"),
        ("Bandene måler 9,5 og 10,3 grader fra 600 til 800 moh, og det brattaste sammenhengende steget på hele turen ligger her: 19,6 grader mellom 826 og 842 moh.",
         "Bandene måler 8,6 og 9,9 grader fra 600 til 800 moh."),
        ("Bandene måler 12,5, 11,5, 10,5, 10,1, 11,8 og 9,5 grader oppover, og det brattaste av dem alle er 13,4 grader fra 1400 til 1500 moh, over 450 meter grunn.",
         "Bandene måler 12,4, 11,4, 9,6, 10,7, 11,8 og 9,6 grader oppover, og det brattaste av dem alle er 13,1 grader fra 1400 til 1500 moh, over 465 meter grunn. Det brattaste sammenhengende steget på hele turen ligger også her: 20,5 grader mellom 1463 og 1480 moh."),
        ("ingen del av den routede linja måler mer enn 19,6 grader, og brattaste hundremetersband er 13,4 fra 1400 til 1500 moh",
         "ingen del av den routede linja måler mer enn 20,5 grader, og brattaste hundremetersband er 13,1 fra 1400 til 1500 moh"),
        ("no hundred-metre band exceeds 13.4 degrees, the steepest sustained step is 19.6 degrees between 826 and 842 m",
         "no hundred-metre band exceeds 13.1 degrees, the steepest sustained step is 20.5 degrees between 1463 and 1480 m"),
        ("The bands measure 9.5 and 10.3 degrees from 600 to 800 m, and the steepest sustained step of the whole tour sits here: 19.6 degrees between 826 and 842 m.",
         "The bands measure 8.6 and 9.9 degrees from 600 to 800 m."),
        ("The bands measure 12.5, 11.5, 10.5, 10.1, 11.8 and 9.5 degrees going up, and the steepest of them all is 13.4 degrees from 1400 to 1500 m, over 450 metres of ground.",
         "The bands measure 12.4, 11.4, 9.6, 10.7, 11.8 and 9.6 degrees going up, and the steepest of them all is 13.1 degrees from 1400 to 1500 m, over 465 metres of ground. The steepest sustained step of the whole tour sits here too: 20.5 degrees between 1463 and 1480 m."),
        ("no part of the routed line measures more than 19.6 degrees, and the steepest hundred-metre band is 13.4 from 1400 to 1500 m",
         "no part of the routed line measures more than 20.5 degrees, and the steepest hundred-metre band is 13.1 from 1400 to 1500 m"))

    # — torvloysa —
    add("torvloysa",
        ("16,9 grader frå 600 til 700 moh og 15,2 frå 700 til 800",
         "15,4 grader frå 600 til 700 moh og 15,5 frå 700 til 800"),
        ("16.9 degrees from 600 to 700 m and 15.2 from 700 to 800",
         "15.4 degrees from 600 to 700 m and 15.5 from 700 to 800"))

    # — tromsdalstinden — the tour's steepest single stretch is no longer on
    #   the ridge: it is in the slope up to Salen, which is also the slope the
    #   avalanche section already tells the reader to read
    add("tromsdalstinden",
        ("Beltet mellom 1000 og 1100 moh er det bratteste på selve ryggen, 19,2 grader i snitt, og turens bratteste enkeltparti ligger her: 26,9 grader mellom 1063 og 1081 moh.",
         "Beltet mellom 1000 og 1100 moh er det bratteste på selve ryggen, 20,1 grader i snitt; turens bratteste enkeltparti ligger nede i bakken opp mot Salen, 26,3 grader mellom 547 og 569 moh."),
        ("Sporet passerer 25 grader ett sted, mellom 1063 og 1081 moh på sørryggen, der det måler 26,9; beltet 1000 til 1100 moh holder 19,2 grader i snitt.",
         "Sporet passerer 25 grader ett sted, mellom 547 og 569 moh i bakken opp mot Salen, der det måler 26,3; beltet 1000 til 1100 moh holder 20,1 grader i snitt."),
        ("The band between 1000 and 1100 m is the steepest on the ridge itself, a mean of 19.2 degrees, and the tour's steepest single stretch sits here: 26.9 degrees between 1063 and 1081 m.",
         "The band between 1000 and 1100 m is the steepest on the ridge itself, a mean of 20.1 degrees; the tour's steepest single stretch sits low on the slope up to Salen, 26.3 degrees between 547 and 569 m."),
        ("The track passes 25 degrees in one place, between 1063 and 1081 m on the south ridge, where it measures 26.9;",
         "The track passes 25 degrees in one place, between 547 and 569 m on the slope up to Salen, where it measures 26.3;"))

    # — ustetind —
    add("ustetind",
        ("med det brattaste steget på hele turen underveis: 20,5 grader mellom 1325 og 1340 moh",
         "med det brattaste steget på hele turen underveis: 18,5 grader mellom 1343 og 1355 moh"),
        ("brattaste band er 9,7 grader og brattaste steg 20,5", "brattaste band er 9,7 grader og brattaste steg 18,5"),
        ("with the steepest step of the tour on the way: 20.5 degrees between 1325 and 1340 m",
         "with the steepest step of the tour on the way: 18.5 degrees between 1343 and 1355 m"),
        ("the steepest band is 9.7 degrees and the steepest step 20.5",
         "the steepest band is 9.7 degrees and the steepest step 18.5"))

    # — vassfjellet — the steep ground is now two near-equal bands, so «one
    #   band» would be false with any numbers in it
    add("vassfjellet",
        ("Nesten alt det bratte ligger i ett band: 15,9 grader fra 500 til 600 moh, over bare 405 meter grunn.",
         "Det bratte ligger samlet mellom 500 og 700 moh: 11,5 grader fra 500 til 600 og 12,3 fra 600 til 700, som er bratteste hundremeteren."),
        ("Over skoggrensa slakner det til 11,6 grader fra 600 til 700 moh",
         "Over skoggrensa holder det 12,3 grader fra 600 til 700 moh"),
        ("Almost all the steep ground sits in one band: 15.9 degrees from 500 to 600 m, over just 405 metres of ground.",
         "The steep ground sits together between 500 and 700 m: 11.5 degrees from 500 to 600 and 12.3 from 600 to 700, which is the steepest hundred-metre band."),
        ("Above the treeline it eases to 11.6 degrees from 600 to 700 m",
         "Above the treeline it holds 12.3 degrees from 600 to 700 m"))

    # — vesoldo —
    add("vesoldo",
        ("16,7 grader", "16,5 grader"),
        ("16.7 degrees", "16.5 degrees"))

    # — ytstevasshornet — the steep middle moved with the reroute off the
    #   reservoir: steepest span 25,0 between 728 and 749, band grounds with it
    add("ytstevasshornet",
        ("Brattaste samanhengande parti måler 26,9 grader", "Brattaste samanhengande parti måler 25,0 grader"),
        ("18,3 grader frå 600 til 700 moh, 22,5 frå 700 til 800 over berre 270 meter grunn, og 20,0 frå 800 til 900, med brattaste samanhengande parti på 26,9 grader mellom 795 og 818 moh",
         "18,2 grader frå 600 til 700 moh, 22,4 frå 700 til 800 over berre 225 meter grunn, og 20,5 frå 800 til 900, med brattaste samanhengande parti på 25,0 grader mellom 728 og 749 moh"),
        ("bandet frå 900 til 1000 moh måler 6,5 grader", "bandet frå 900 til 1000 moh måler 6,3 grader"),
        ("19,0 grader frå 1000 til 1100 moh og 18,9 frå 1100 til 1200",
         "11,8 grader frå 1000 til 1100 moh og 18,0 frå 1100 til 1200"),
        ("brattaste hundremeteren, 700 til 800 moh, måler 22,5 grader over 270 meter grunn, og brattaste samanhengande parti 26,9 grader mellom 795 og 818 moh",
         "brattaste hundremeteren, 700 til 800 moh, måler 22,4 grader over 225 meter grunn, og brattaste samanhengande parti 25,0 grader mellom 728 og 749 moh"),
        ("The steepest sustained section measures 26.9 degrees", "The steepest sustained section measures 25.0 degrees"),
        ("18.3 degrees from 600 to 700 m, 22.5 from 700 to 800 over only 270 metres of ground, and 20.0 from 800 to 900, with the steepest sustained section at 26.9 degrees between 795 and 818 m",
         "18.2 degrees from 600 to 700 m, 22.4 from 700 to 800 over only 225 metres of ground, and 20.5 from 800 to 900, with the steepest sustained section at 25.0 degrees between 728 and 749 m"),
        ("the band from 900 to 1000 m measures 6.5 degrees", "the band from 900 to 1000 m measures 6.3 degrees"),
        ("19.0 degrees from 1000 to 1100 m and 18.9 from 1100 to 1200",
         "11.8 degrees from 1000 to 1100 m and 18.0 from 1100 to 1200"),
        ("the steepest hundred metres, 700 to 800 m, measures 22.5 degrees over 270 metres of ground, and the steepest sustained section 26.9 degrees between 795 and 818 m",
         "the steepest hundred metres, 700 to 800 m, measures 22.4 degrees over 225 metres of ground, and the steepest sustained section 25.0 degrees between 728 and 749 m"))

    return e


if __name__ == "__main__":
    sys.exit(main())
