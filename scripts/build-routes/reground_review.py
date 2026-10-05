"""Re-ground the guides on the lines the review round changed.

The review round drew every line on Kartverket's topographic map and cut ten
out-and-backs to corridor waypoints on eight routes (`cut_spurs.py`), and moved
Bånsæterkampen's summit onto the 1202.4 m top its line already crossed
(`resolve_summits.py` SUMMIT_SEED, `end_at_summit.py`). Every figure below is
the same figure measured on the shipped line, in both languages; where a cut
changed what a sentence was *about*, the sentence is rewritten:

  Kvitegga      the 38.7° «steepest sustained section» the guide put on
                Brattbakken was the spur's way back down from the waypoint
                (1296 → 1265 m). The line now crosses the bakke at 29.9° in its
                steepest 30 m; the tour's steepest 30 m, 33.5°, is in Snødalen.
                The line passes under the 1583 m top rather than over it.
  Store Ble     the line went down to Sigridsbu and back up to Langedalen; it
                now passes 180 m north of the hut, the Langedalen option of the
                two the source gives.
  Bånsæterkampen  a different summit, a shorter line and a new flank sweep.

Same contract as `reground_guides.py`: every edit is (slug, old, new) and must
match at least once, or the run reports it and exits non-zero. Measurements
made by hand for this round are recorded in each guide's `problems`, which is
where `check_guides.py` looks for them.
"""

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))

ROUND = "REVIEW ROUND"


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


NOTES = {
    "kvitegga": (
        "the line walked out to the Brattbakken waypoint (tip 1292 m) and to «Høgda 1583» and back; "
        "both spurs cut (cut_spurs.py). 5926 m +1457 → 5329 m +1391, card 1460 → 1390. The old "
        "steepest 30 m, 38.7° between 1296 and 1265, was the spur's descent. Measured on the new line: "
        "steepest 30 m inside Brattbakken 29.9° between 1200 and 1218 m (router.steepest_span over the "
        "vertices between 1100 and 1330 m); first SnøIsbre vertex at 1224 m (DTM1 point API, every "
        "vertex 1180–1340 m); the line passes under the 1583 top at 1554–1560 m."
    ),
    "rundfjellet": (
        "two spurs cut (cut_spurs.py): to «sørryggen» and to «ryggen der den dreier vest», the second "
        "with a 76 m leg because the spur began with a 27 m drop off the ridge. 5277 m +890 → 4820 m "
        "+841, loss 93 → 44, card 890 → 840; steepest 30 m now 29.1° between 644 and 663 m."
    ),
    "lonahorgi": (
        "spur to «Ryggen nordvest for Svartahorgi» cut (cut_spurs.py): 6712 m +1307 → 6451 m +1298; "
        "the line joins the ridge at 1011 m."
    ),
    "snota": (
        "Trollheimshytta line: spur to «inn på vinterruta frå Gråhaugen» cut (cut_spurs.py): "
        "11613 m +1356 → 11362 m +1320, loss 221 → 185; the line now passes the junction at 993 m."
    ),
    "styggemann": (
        "spur to «Sørmyrseter» cut (cut_spurs.py): 9608 m +549 → 9477 m +541, loss 161 → 153; card "
        "550 stays (within 10 m). The cut is on dry ground: DTM1 every 10 m reads 1593 m wet on both lines, "
        "and the line still crosses the seter meadow (DyrketMark at 611 m, two vertices). «1,26 km» to the "
        "Jotefjell junction had no source and is dropped."
    ),
    "store-ble": (
        "the line climbed Langedalen, went down to Sigridsbu and came back up (540 m out and back); "
        "cut (cut_spurs.py): 6690 m +672 → 6328 m +664, card 670 stays. It now passes 180 m north of "
        "the hut, the Langedalen option of the two the source gives. The two short crossings near the "
        "hut (DTM1: 31 m at 1178 m, 30 m at 1175 m) went with the spur, and so did the 90 m on the tarn at "
        "1162 m the guide named: check_ground on the cut line reports water only at 746 m."
    ),
    "banseterkampen": (
        "summit moved to the 1202.4 m top (61.39470/10.12085) the line already crossed, 890 m "
        "east-north-east of the 1196.1 m top the card carried; between them a saddle at 1152 m on a "
        "straight DTM1 profile, so the old line gave back 44 m (1200 → 1158 → 1196). SSR's Fjell "
        "geometry for Bånsæterkampen passes 3 m from the new top and 150 m from the old. Line cut at "
        "the new top (end_at_summit.py): 2727 m +341 → 1834 m +301, loss 58 → 12, card 341 → 300. "
        "Flank sweep from the new top (flank_probe.py 61.3947 10.12085): N 7.4° (11.0° 200–260 m out), "
        "NE 5.7° (10.1° 340–400), E 28.2° (41.7° 140–200), SE 31.0° (54.1° 40–100), S 30.8° (54.6° "
        "50–110), SW 20.1° (32.4° 200–260), W 5.3° (13.4° 200–260), NW 7.9° (12.9° 110–170)."
    ),
}


def build_edits():
    e = []

    def add(slug, *pairs):
        for old, new in pairs:
            e.append((slug, old, new))

    # — kvitegga —
    add("kvitegga",
        ("1457 høgdemeter på 5,93 km frå Nibbedalen til det høgste fjellet i midtre Sunnmørsalpane. "
         "Brattaste samanhengande parti måler 38,7 grader — det er Brattbakken, og han er den eine tekniske delen av turen.",
         "1391 høgdemeter på 5,33 km frå Nibbedalen til det høgste fjellet i midtre Sunnmørsalpane. "
         "Brattbakken er den eine tekniske delen av turen: bandet frå 1100 til 1200 moh måler 22,5 grader i snitt, "
         "og rutebeskrivinga set bakken til om lag 35 grader."),
        ("1457 høgdemeter og 5,93 km frå grustaket i Nibbedalen gjennom Snødalen, over Brattbakken og høgda på 1583 moh til toppen.",
         "1391 høgdemeter og 5,33 km frå grustaket i Nibbedalen gjennom Snødalen, over Brattbakken og under høgda på 1583 moh til toppen."),
        ("Terrengmodellen måler bandet frå 1100 til 1200 moh til 22,5 grader i snitt og det brattaste samanhengande partiet til 38,7 grader mellom 1265 og 1292 moh. Kartverket registrerer breterreng frå 1290 moh.",
         "Terrengmodellen måler bandet frå 1100 til 1200 moh til 22,5 grader i snitt og det brattaste 30-metersvindauget i bakken til 29,9 grader mellom 1200 og 1218 moh. "
         "Brattaste samanhengande parti på heile turen, 33,5 grader mellom 883 og 903 moh, ligg lenger nede i Snødalen. Kartverket registrerer breterreng frå 1224 moh."),
        ("Over bakken flatar det brelagde platået ut: 9,7 grader frå 1200 til 1300 moh og 5,6 frå 1500 til 1600 over 1036 meter grunn. "
         "Du følgjer det til høgda på 1583 moh, går ned eit lite skar og nordover langs ryggen til toppen på 1700 moh.",
         "Bakken held fram til om lag 1300 moh — bandet frå 1200 til 1300 måler 20,4 grader over 271 meter grunn — og over han flatar det brelagde platået ut: "
         "7,7 grader frå 1500 til 1600 moh over 757 meter grunn. Du følgjer det under høgda på 1583 moh, gjennom eit lite skar og nordover langs ryggen til toppen på 1700 moh."),
        ("frå varden går ruta sørover langs ryggen til høgda på 1583 moh før ho svingar ned.",
         "frå varden går ruta sørover langs ryggen til skaret under høgda på 1583 moh før ho svingar ned."),
        ("bandet frå 1100 til 1200 moh måler 22,5 grader i snitt og brattaste samanhengande parti 38,7 grader mellom 1265 og 1292 moh. Bakken er skredterreng",
         "bandet frå 1100 til 1200 moh måler 22,5 grader i snitt og brattaste 30-metersvindauge i bakken 29,9 grader mellom 1200 og 1218 moh. Bakken er skredterreng"),
        ("1457 metres of climbing over 5.93 km from Nibbedalen to the highest mountain in the central Sunnmøre Alps. "
         "The steepest sustained section measures 38.7 degrees — that is Brattbakken, and it is the one technical part of the tour.",
         "1391 metres of climbing over 5.33 km from Nibbedalen to the highest mountain in the central Sunnmøre Alps. "
         "Brattbakken is the one technical part of the tour: the band from 1100 to 1200 m averages 22.5 degrees, "
         "and the route description puts the slope at about 35 degrees."),
        ("1457 metres of climbing and 5.93 km from the gravel pit in Nibbedalen through Snødalen, over Brattbakken and the 1583 m top to the summit.",
         "1391 metres of climbing and 5.33 km from the gravel pit in Nibbedalen through Snødalen, over Brattbakken and below the 1583 m top to the summit."),
        ("The terrain model measures the band from 1100 to 1200 m at 22.5 degrees on average and the steepest sustained section at 38.7 degrees between 1265 and 1292 m. Kartverket registers glacier terrain from 1290 m.",
         "The terrain model measures the band from 1100 to 1200 m at 22.5 degrees on average and the steepest 30-metre window on the slope at 29.9 degrees between 1200 and 1218 m. "
         "The steepest sustained section on the whole tour, 33.5 degrees between 883 and 903 m, is further down in Snødalen. Kartverket registers glacier terrain from 1224 m."),
        ("Above the slope the glaciated plateau lays back: 9.7 degrees from 1200 to 1300 m and 5.6 from 1500 to 1600 over 1036 metres of ground. "
         "Follow it to the 1583 m top, drop through a small col and head north along the ridge to the summit at 1700 m.",
         "The slope carries on to about 1300 m — the band from 1200 to 1300 measures 20.4 degrees over 271 metres of ground — and above it the glaciated plateau lays back: "
         "7.7 degrees from 1500 to 1600 m over 757 metres of ground. Follow it below the 1583 m top, through a small col and north along the ridge to the summit at 1700 m."),
        ("from the cairn the route runs south along the ridge to the high point at 1583 m before it turns down.",
         "from the cairn the route runs south along the ridge to the col below the 1583 m top before it turns down."),
        ("the band from 1100 to 1200 m averages 22.5 degrees and the steepest sustained section 38.7 degrees between 1265 and 1292 m. The slope is avalanche terrain",
         "the band from 1100 to 1200 m averages 22.5 degrees and the steepest 30-metre window on it 29.9 degrees between 1200 and 1218 m. The slope is avalanche terrain"))

    # — rundfjellet —
    add("rundfjellet",
        ("890 høydemeter og 5,28 km fra havet ved Vatterfjordpollen", "840 høydemeter og 4,82 km fra havet ved Vatterfjordpollen"),
        ("Ryggen gir tilbake 93 høydemeter på veien, og det er derfor kortet bærer 890 der kilden regner 800.",
         "Ryggen gir tilbake 44 høydemeter på veien, og det er derfor kortet bærer 840 der kilden regner 800."),
        ("890 høydemeter og 5,28 km fra Vatterfjordpollen opp sørryggen", "840 høydemeter og 4,82 km fra Vatterfjordpollen opp sørryggen"),
        ("det bratteste — 31,2 grader mellom 624 og 644 moh — der ryggen dreier vest.",
         "det bratteste — 29,1 grader mellom 644 og 663 moh — der ryggen dreier vest."),
        ("Ryggen er kupert: 93 høydemeter gis tilbake underveis, og beltene ligger på 10 til 12,5 grader",
         "Ryggen er kupert: 44 høydemeter gis tilbake underveis, og beltene ligger på 10 til 15,2 grader"),
        ("Der ryggen dreier vest — 604 moh der linja tar svingen — venter det siste: 15,1 grader i beltet fra 700 til 800, med det bratteste sammenhengende partiet, 31,2 grader, mellom 624 og 644 moh.",
         "Der ryggen dreier vest — 641 moh der linja tar svingen — venter det siste: 15,1 grader i beltet fra 700 til 800, med det bratteste sammenhengende partiet, 29,1 grader, mellom 644 og 663 moh."),
        ("Det er to kilometer kortare enn ruta frå Vatterfjordpollen, og brattaste steget måler 28,1 grader mellom 664 og 680 moh mot 31,2 på hovudruta.",
         "Det er halvanna kilometer kortare enn ruta frå Vatterfjordpollen, og brattaste steget måler 28,1 grader mellom 664 og 680 moh mot 29,1 på hovudruta."),
        ("890 metres of ascent over 5.28 km from the sea at Vatterfjordpollen", "840 metres of ascent over 4.82 km from the sea at Vatterfjordpollen"),
        ("The ridge gives back 93 vertical metres along the way, which is why the card carries 890 where the source counts 800.",
         "The ridge gives back 44 vertical metres along the way, which is why the card carries 840 where the source counts 800."),
        ("890 metres of ascent and 5.28 km from Vatterfjordpollen up the south ridge", "840 metres of ascent and 4.82 km from Vatterfjordpollen up the south ridge"),
        ("the steepest ground — 31.2 degrees between 624 and 644 m — where the ridge turns west.",
         "the steepest ground — 29.1 degrees between 644 and 663 m — where the ridge turns west."),
        ("The ridge undulates: 93 vertical metres are given back, and the bands sit at 10 to 12.5 degrees",
         "The ridge undulates: 44 vertical metres are given back, and the bands sit at 10 to 15.2 degrees"),
        ("Where the ridge turns west — 604 m where the line takes the bend — the last part waits: 15.1 degrees in the band from 700 to 800, with the steepest sustained stretch, 31.2 degrees, between 624 and 644 m.",
         "Where the ridge turns west — 641 m where the line takes the bend — the last part waits: 15.1 degrees in the band from 700 to 800, with the steepest sustained stretch, 29.1 degrees, between 644 and 663 m."),
        ("That is two kilometres shorter than the route from Vatterfjordpollen, and the steepest step measures 28.1 degrees between 664 and 680 m against 31.2 on the main route.",
         "That is a kilometre and a half shorter than the route from Vatterfjordpollen, and the steepest step measures 28.1 degrees between 664 and 680 m against 29.1 on the main route."))

    # — lonahorgi —
    add("lonahorgi",
        ("1307 høgdemeter frå 139 moh", "1298 høgdemeter frå 139 moh"),
        ("1307 høgdemeter og 6,71 km frå Høyland", "1298 høgdemeter og 6,45 km frå Høyland"),
        ("før du kjem inn på ryggen på om lag 1003 moh.", "før du kjem inn på ryggen på om lag 1011 moh."),
        ("Mot normalrutas 1307 høgdemeter på 6,71 km", "Mot normalrutas 1298 høgdemeter på 6,45 km"),
        ("1307 metres of climbing from 139 m", "1298 metres of climbing from 139 m"),
        ("1307 metres of climbing and 6.71 km from Høyland", "1298 metres of climbing and 6.45 km from Høyland"),
        ("before joining the ridge at about 1003 m.", "before joining the ridge at about 1011 m."),
        ("Against the normal route's 1307 metres over 6.71 km", "Against the normal route's 1298 metres over 6.45 km"))

    # — snota (the Trollheimshytta alternate) —
    add("snota",
        ("frå Trollheimshytta: 1356 høgdemeter på 11,61 km", "frå Trollheimshytta: 1320 høgdemeter på 11,36 km"),
        ("På 1054 moh kjem ho inn på den same vinterruta", "Ved 993 moh kjem ho inn på den same vinterruta"),
        ("Linja frå Trollheimshytta gir frå seg 221 høgdemeter", "Linja frå Trollheimshytta gir frå seg 185 høgdemeter"),
        ("from Trollheimshytta: 1356 metres of ascent over 11.61 km", "from Trollheimshytta: 1320 metres of ascent over 11.36 km"),
        ("At 1054 m it joins the same winter route", "At 993 m it joins the same winter route"),
        ("The line from Trollheimshytta gives back 221 metres", "The line from Trollheimshytta gives back 185 metres"))

    # — styggemann — the cut is on dry ground by the seter; the lake crossings are unchanged
    add("styggemann",
        ("549 høydemeter på 9,61 km fra Ravalsjø", "541 høydemeter på 9,48 km fra Ravalsjø"),
        ("549 høydemeter og 9,61 km fra Ravalsjø", "541 høydemeter og 9,48 km fra Ravalsjø"),
        ("og 600 til 700 moh 1,4 grader over 3826 — det er over sju kilometer skog og myr mellom 483 og 700 moh.",
         "og 600 til 700 moh 1,5 grader over 3695 — det er nesten sju kilometer skog og myr mellom 483 og 700 moh."),
        ("Ruta gir tilbake 161 høydemeter", "Ruta gir tilbake 153 høydemeter"),
        ("549 metres of climbing over 9.61 km from Ravalsjø", "541 metres of climbing over 9.48 km from Ravalsjø"),
        ("549 metres of climbing and 9.61 km from Ravalsjø", "541 metres of climbing and 9.48 km from Ravalsjø"),
        ("and 600 to 700 m 1.4 degrees over 3826 — that is over seven kilometres of forest and bog between 483 and 700 m.",
         "and 600 to 700 m 1.5 degrees over 3695 — that is almost seven kilometres of forest and bog between 483 and 700 m."),
        ("The route gives back 161 metres of height", "The route gives back 153 metres of height"),
        # The terrain sample that read open ground at 820 m sits at 830 on the cut line.
        ("og på 820 moh er du i åpent terreng.", "og på 830 moh er du i åpent terreng."),
        ("by 820 m you are in open terrain.", "by 830 m you are in open terrain."),
        # «1,26 km» was never measured: it passed only because a 1.4° band angle sat
        # within the km tolerance, and the cut moved that angle. No source places the
        # junction, so the figure goes rather than being made to fit.
        ("vest på Jotefjell — 1,26 km sørøst for varden.", "vest på Jotefjell, sørøst for varden."),
        ("west on Jotefjell — 1.26 km south-east of the cairn.", "west on Jotefjell, south-east of the cairn."))

    # — store-ble — the line no longer goes down to Sigridsbu and back
    add("store-ble",
        ("672 høydemeter på 6,69 km fra Nordstulvatnet", "664 høydemeter på 6,33 km fra Nordstulvatnet"),
        ("672 høydemeter og 6,69 km fra Nordstul", "664 høydemeter og 6,33 km fra Nordstul"),
        ("Det er her T-ruta deler seg: opp Langedalen, eller utsiktsløypa om Sigridsbu.",
         "Det er her T-ruta deler seg: opp Langedalen, eller utsiktsløypa om Sigridsbu. Linja går opp Langedalen."),
        ("Sigridsbu ligger på 1175 moh, og fra hytta flater det ut. Bandet fra 1100 til 1200 moh måler 3,1 grader over 1890 meter grunn — nesten to kilometer platå med vidåpen utsikt, "
         "og linja krysser et tjern på 1162 moh på vegen. Litt før det går linja også 45 meter over et tjern på 1177 moh, men bare 10 meter fra land — der skjærer den et hjørne. Begge tjerna er naturlige.",
         "Øverst i Langedalen passerer linja 180 meter nord for Sigridsbu, som ligger på 1175 moh, og derfra flater det ut. Bandet fra 1100 til 1200 moh måler 3,8 grader over 1529 meter grunn — halvannen kilometer platå med vidåpen utsikt."),
        ("og 3,1 grader over platået fra 1100 til 1200 moh.", "og 3,8 grader over platået fra 1100 til 1200 moh."),
        ("672 metres of climbing over 6.69 km from Nordstulvatnet", "664 metres of climbing over 6.33 km from Nordstulvatnet"),
        ("672 metres of climbing and 6.69 km from Nordstul", "664 metres of climbing and 6.33 km from Nordstul"),
        ("This is where the T-marked route splits: up Langedalen, or the viewpoint loop past Sigridsbu.",
         "This is where the T-marked route splits: up Langedalen, or the viewpoint loop past Sigridsbu. The line goes up Langedalen."),
        ("Sigridsbu sits at 1175 m, and from the hut the ground flattens. The band from 1100 to 1200 m measures 3.1 degrees over 1890 metres of ground — almost two kilometres of plateau with the view wide open, "
         "and the line crosses a tarn at 1162 m on the way. A little before that the line also runs 45 metres across a tarn at 1177 m, but only 10 metres from shore — there it cuts a corner. Both tarns are natural.",
         "At the head of Langedalen the line passes 180 metres north of Sigridsbu, which sits at 1175 m, and from there the ground flattens. The band from 1100 to 1200 m measures 3.8 degrees over 1529 metres of ground — a kilometre and a half of plateau with the view wide open."),
        ("and 3.1 degrees across the plateau from 1100 to 1200 m.", "and 3.8 degrees across the plateau from 1100 to 1200 m."))

    # — banseterkampen — a different summit: the 1202.4 m top the line crossed
    add("banseterkampen",
        ("341 høydemeter og 2,73 km fra Bånsetra opp på en fjellrygg med stup mot sør.",
         "301 høydemeter og 1,83 km fra Bånsetra opp på en fjellrygg med stup mot sør."),
        ("men sørøstsida under eggen måler 25,5 grader i snitt med 45,2 i vinduet 30 til 90 meter ut.",
         "men sørsida under toppen måler 30,8 grader i snitt med 54,6 i vinduet 50 til 110 meter ut."),
        ("341 høydemeter og 2,73 km fra Bånsetra opp lia til 1110 moh og inn på fjellryggen på 1195, med skogen som slipper taket på 955 moh.",
         "301 høydemeter og 1,83 km fra Bånsetra opp lia til 1100 moh og opp ryggen til toppen på 1202, med skogen som slipper taket på 955 moh."),
        ("Videre skrår linja sørvestover: 12,5 grader fra 1000 til 1100 moh over 461 meter grunn, forbi 1110 moh, og inn på selve ryggen på 1195. "
         "Der er det slutt på stigninga. Bandet fra 1100 til 1200 moh måler 3,1 grader over 1807 meter grunn — det er eggen, og den er nesten vannrett.",
         "Videre skrår linja sørvestover: 12,5 grader fra 1000 til 1100 moh over 461 meter grunn, og så opp på ryggen. "
         "Bandet fra 1100 til 1200 moh måler 5,8 grader over 967 meter grunn — ryggen stiger jevnt og slakt helt til toppen."),
        ("Vestover langs kanten til høyeste punkt, 1196,1 moh. Ut.no fører 1202 for samme sted, og det er det største avviket mellom kort og terrengmodell i denne runden; kortet fører målinga.",
         "Toppen er en bred kuppel på 1202,4 moh, og det er den ut.no fører med 1202 som høyeste punkt på Bånsæterkampen. "
         "Ryggen fortsetter vestover langs kanten til en lavere topp på 1196,1 moh, 890 meter unna bak et søkk — den toppen kortet tidligere førte."),
        ("Ned samme vegen, nordøstover. Den sida måler 6,3 grader i snitt over 400 meter med et bratteste 60-metersvindu på 10,6 — det er den slake halvsirkelen ruta ligger i, og vest måler 3,9 med 12,8.",
         "Ned samme vegen, nordøstover. Den sida måler 5,7 grader i snitt over 400 meter med et bratteste 60-metersvindu på 10,1 — det er den slake ryggen ruta kom opp — og nord måler 7,4 med 11,0."),
        ("og sveipet setter tall på det: sørøst 25,5 grader i snitt med 45,2 i vinduet 30 til 90 meter ut, sør 23,0 med 39,8 i 40 til 100, øst 21,0 med 38,0 i 30 til 90, og sørvest 18,7 med 42,5 lenger ute, 180 til 240.",
         "og sveipet setter tall på det: sørøst 31,0 grader i snitt med 54,1 i vinduet 40 til 100 meter ut, sør 30,8 med 54,6 i 50 til 110, øst 28,2 med 41,7 i 140 til 200, og sørvest 20,1 med 32,4 lenger ute, 200 til 260."),
        ("341 høydemeter der brattaste band er 14,0 grader og brattaste steg 22,1. Ruta gir tilbake 58 høydemeter på 2,73 km, det meste av det på selve ryggen, som måler 3,1 grader over 1807 meter grunn.",
         "301 høydemeter der brattaste band er 14,0 grader og brattaste steg 22,1. Ruta gir tilbake 12 høydemeter på 1,83 km, og ryggen opp mot toppen måler 5,8 grader over 967 meter grunn."),
        ("Sørøst måler 45,2 grader i brattaste 60-metersvindu bare 30 til 90 meter fra toppen, sør 39,8 og øst 38,0. "
         "Det er ikke terreng du kommer tilbake fra hvis du går ut på skavlen, og på en rygg som ellers måler 2,7 grader er det ingenting som varsler deg om at kanten kommer.",
         "Sør og sørøst måler 54,6 og 54,1 grader i brattaste 60-metersvindu bare 40 til 110 meter fra toppen, og øst 41,7. "
         "Det er ikke terreng du kommer tilbake fra hvis du går ut på skavlen, og på en rygg som ellers måler 5,8 grader er det ingenting som varsler deg om at kanten kommer."),
        ("341 metres of climbing and 2.73 km from Bånsetra onto a ridge that drops away to the south.",
         "301 metres of climbing and 1.83 km from Bånsetra onto a ridge that drops away to the south."),
        ("but the south-east side under the edge measures 25.5 degrees on average with 45.2 in the window 30 to 90 metres out.",
         "but the south side under the top measures 30.8 degrees on average with 54.6 in the window 50 to 110 metres out."),
        ("341 metres of climbing and 2.73 km from Bånsetra up the hillside to 1110 m and onto the ridge at 1195, with the forest letting go at 955 m.",
         "301 metres of climbing and 1.83 km from Bånsetra up the hillside to 1100 m and up the ridge to the top at 1202, with the forest letting go at 955 m."),
        ("On up the line slants south-west: 12.5 degrees from 1000 to 1100 m over 461 metres of ground, past 1110 m, and onto the ridge itself at 1195. "
         "There the climbing ends. The band from 1100 to 1200 m measures 3.1 degrees over 1807 metres of ground — that is the edge, and it is nearly level.",
         "On up the line slants south-west: 12.5 degrees from 1000 to 1100 m over 461 metres of ground, and then up onto the ridge. "
         "The band from 1100 to 1200 m measures 5.8 degrees over 967 metres of ground — the ridge climbs evenly and gently all the way to the top."),
        ("West along the rim to the high point, 1196.1 m. Ut.no gives 1202 for the same place, the largest disagreement between card and terrain model in this round; the card carries the measurement.",
         "The top is a broad dome at 1202.4 m, and it is the one ut.no gives as 1202, the highest point on Bånsæterkampen. "
         "The ridge carries on west along the rim to a lower top at 1196.1 m, 890 metres away beyond a dip — the top the card used to carry."),
        ("Back the same way, north-east. That side measures 6.3 degrees on average over 400 metres with a steepest 60-metre window of 10.6 — the gentle half-circle the route sits in — and west measures 3.9 with 12.8.",
         "Back the same way, north-east. That side measures 5.7 degrees on average over 400 metres with a steepest 60-metre window of 10.1 — the gentle ridge the route came up — and north measures 7.4 with 11.0."),
        ("and the sweep puts numbers on it: south-east 25.5 degrees on average with 45.2 in the window 30 to 90 metres out, south 23.0 with 39.8 at 40 to 100, east 21.0 with 38.0 at 30 to 90, and south-west 18.7 with 42.5 further out, 180 to 240.",
         "and the sweep puts numbers on it: south-east 31.0 degrees on average with 54.1 in the window 40 to 100 metres out, south 30.8 with 54.6 at 50 to 110, east 28.2 with 41.7 at 140 to 200, and south-west 20.1 with 32.4 further out, 200 to 260."),
        ("341 metres of climbing where the steepest band is 14.0 degrees and the steepest step 22.1. The route gives back 58 metres over 2.73 km, most of it on the ridge itself, which measures 3.1 degrees over 1807 metres of ground.",
         "301 metres of climbing where the steepest band is 14.0 degrees and the steepest step 22.1. The route gives back 12 metres over 1.83 km, and the ridge up to the top measures 5.8 degrees over 967 metres of ground."),
        ("South-east measures 45.2 degrees in its steepest 60-metre window only 30 to 90 metres from the top, south 39.8 and east 38.0. "
         "That is not ground you come back from if you walk out onto the cornice, and on a ridge that otherwise measures 2.7 degrees nothing tells you the edge is coming.",
         "South and south-east measure 54.6 and 54.1 degrees in their steepest 60-metre windows only 40 to 110 metres from the top, and east 41.7. "
         "That is not ground you come back from if you walk out onto the cornice, and on a ridge that otherwise measures 5.8 degrees nothing tells you the edge is coming."))

    return e


if __name__ == "__main__":
    sys.exit(main())
