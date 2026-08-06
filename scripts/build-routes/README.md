# build-routes

Generates `lib/routes.ts` — the detailed ascent routes for every tour. A peak can
have more than one.

The line each tour draws on the map used to be a schematic zig-zag: a trailhead
invented by pushing the summit coordinate a scaled distance in the direction of
the tour's aspect, with a decorative weave on the way up. It was never meant to
survive contact with real data. This pipeline replaces it.

## Where the geometry comes from

Two things have to be true for an ascent line to be right, and they come from
different places.

**Which way the route goes** is route knowledge. A terrain model cannot tell you
which valley a tour is skinned from, or which side of the stream the skin track
takes. That is the *corridor*: a trailhead plus a handful of ordered waypoints
that pin the line into the right valley, up the right shoulder, and onto the
right summit ridge. It lives in `corridors.json`.

Every corridor was researched against primary sources — Friflyt and ut.no route
descriptions, Kartverket's place-name register, OpenStreetMap parking and path
geometry — and then **independently audited by a second pass whose job was to
refute it**, re-querying every coordinate against DTM1 and re-reading the
guidebooks from scratch. `source` on each route records which stage it survived.

The audit was not a formality. It caught, among other things:

- **Stornappstinden** traced along the summer footpath rather than the documented
  spring ski line, with a waypoint labelled "Vestre toppflate" that DTM sampling
  showed to be a sustained 23–27° slope with no flat ground on it.
- **Kirketaket** started at an OSM road fork rather than a car park — and both
  branches of that fork are groomed nordic pistes in winter. Moved to the mapped
  Hellerøra parking, cross-checked three ways against ut.no's stated gain and
  length.
- **Slogen** with two waypoints labelled as the wrong valley, and a claim that
  the trailhead was a vertex of a named OSM way — the auditor fetched the way and
  found the nearest node 26 m off.
- **Rørnestinden**, where the auditor overturned a change *this pipeline's author*
  had made by hand. See below.

**Where the line actually runs** is terrain. Given the corridor, `router.py`
solves a least-cost path over Kartverket's 1 m national terrain model (DTM1),
with a cost model that prices what matters when skinning uphill:

- a gentle gradient is cheap; cost grows quadratically past ~20° and hard past 38°
- steeper than 45° is impassable — that is not a skin track
- giving back height on an ascent is penalised
- traversing a steep side-slope is penalised **even where the step itself is
  flat**, which is the term that keeps the line off cliff bands and out of
  terrain traps rather than merely pointing it uphill
- sea is impassable; frozen lakes are not, because this is a winter product

Neither half is much use alone. The corridor without the terrain model gives you
straight lines through cliffs; the terrain model without the corridor gives you a
technically-gentle line up a face nobody skis.

### Solved on a coarse grid, measured on a fine one

Dijkstra over a 1 m grid for a ten-kilometre corridor is not a thing you run, so
the router solves on a downsampled DTM — a few metres per cell. That resolution
is right for *finding* a way up and wrong for *saying how steep it is*: the grid
rounds the corner off a step, and a couple of metres of error over a 30 m
baseline is a dozen degrees.

`resample_dtm1.py` re-reads every vertex elevation straight from the DTM1 point
API and rewrites `gainM`, `lossM` and `maxAngle` from it. The geometry stays
exactly as routed; only the heights change. The two ends keep their pinned values
— the trailhead from the corridor research, the summit from `summits.json` —
because those were resolved deliberately and a reader recognises them.

Folarskardnuten is the case that showed why it was needed. Vertex by vertex the
stored profile was within ±6 m of DTM1 and averaged −0.4 m; it looked fine. Its
steepest 30 m window read **25.5° stored and 37.8° measured**, and the guide
written from it told the reader a 38-degree step was a 25-degree one. Across all
39 tours it moved the steepest sustained gradient by 2° or more on fifteen of
them — eleven steeper, four gentler. Storgalten 29.2 → 34.6, Steindalsnosi
26.4 → 30.3, Kavringtinden 30.3 → 33.8, Tromsdalstinden 23.8 → 26.9; the other
way, Melderskin 30.9 → 27.3 and Besshø 26.1 → 23.2. Cumulative gain moved much
less — under 2.5% everywhere, mostly a metre or two.

`router.steepest_span` now returns *where* the steepest window is as well as how
steep, `guide_facts.py` carries it as `steepestStep`, and `check_guides.py` counts
those two elevations as sourced. A guide that says "29.4 degrees between 1411 and
1428 moh" is checkable in a way that a bare angle is not.

## Steps

```
pip install numpy scipy rasterio

python3 resolve_summits.py    # SSR + DTM1          -> summits.json
python3 build_corridors.py    # corridors.swarm.json + PICKS/ALTERNATES -> corridors.json
python3 generate_routes.py    # corridors + summits -> routes.json   (~10 min)
python3 resample_dtm1.py      # every vertex re-read from DTM1        (~15 min)
python3 emit_ts.py            # routes.json         -> ../../lib/routes.ts
python3 check_routes.py       # independent sanity pass over the geometry
python3 check_tours.py        # the card figures: summit, vertical, coordinate, seed

# only when re-running the research itself:
python3 find_trailheads.py            # OSM roads/parking -> trailhead_candidates.json
python3 nearby_places.py              # SSR point search  -> nearby_places.json
TOPPKART_WF=<transcripts> python3 harvest_swarm.py   # -> corridors.swarm.json
```

Then the written guides, which depend on the finished geometry:

```
python3 routes_from_ts.py     # lib/routes.ts       -> routes.json  (skips re-routing)
python3 sync_tourmeta.py      # lib/tours.ts        -> tourmeta.json (after hand edits)
python3 guide_facts.py        # routes.json + DTM1  -> guide_facts.json
python3 enrich_facts.py       # folds the research, audit and measurements back in
python3 guide_brief.py <slug> # the writing brief one agent gets for one tour

TOPPKART_WF=<transcripts> python3 harvest_guides.py  # -> guides.json
python3 check_guides.py       # mechanical pass; must be read, not just run
python3 test_check_guides.py  # pins the reassurance rule in both directions
python3 emit_guides.py [slug…]  # -> ../../lib/guides.ts, GUIDE_EN, seed.sql, hasGuide
```

`find_trailheads.py` and `nearby_places.py` only ever produce a *shortlist*; the
choice is recorded in `PICKS` in `build_corridors.py`, with the terrain height
and the height the tour's stated vertical implies in a comment beside each. Two
sources, because Overpass rate-limits hard and Kartverket's place-name register
does not — but the register only knows named places, so it cannot find a parking
area on a mountain road. Between them every tour gets a start with a real road
under it.

`resolve_summits.py` is worth understanding, because the coordinates it replaced
were badly wrong — Slogen was 18 km off, Kirketaket's landed at 138 m in forest,
and the peak the app calls Kirketaket is registered as **Kyrkjetaket**. For each
tour it looks the name up in Kartverket's place-name register (SSR),
disambiguates by kommune and by proximity to the old coordinate, then snaps to
the true summit in two stages:

1. a search disc that **grows**, taking the highest cell inside it at each
   radius. Growing outward rather than searching one big box is what keeps a peak
   from being confused with a taller neighbour — Steindalsnosi (2025 m) matches
   975 m out, and once Fannaråki (2068 m) comes into range at 1490 m it is 43 m
   off the claim and loses.
2. a hill-climb from each of those candidates onto the exact top. Run in this
   order on purpose: climbing straight from an SSR point stalls on the first
   shoulder above a saddle, which is how Himmeltindan and Steindalsnosi first
   came out ~30 m and ~120 m short.
3. **the climbed top whose height comes closest to the published one wins.**

Climbing before judging, rather than judging the disc maxima, is what the third
step buys, and it fixes two failures that pull in opposite directions. The search
used to *stop* at the first disc whose maximum was within 15 m of the claim, and
that put **Folarskardnuten on a subsidiary top**: 1927.3 m at 311 m out is inside
15 m of the claimed 1933, so it was returned and the disc never grew far enough
to see the real summit, 1931.7 m at 647 m. Simply preferring the closest disc
maximum instead moves **Skåla** 50 m onto a 1851.4 m cell — Skålatårnet, the
stone tower on the top — where climbing from the smaller disc reaches the 1847.1 m
ground the guidebooks call 1848. The highest cell in a wide disc is exactly where
a structure or a noise spike sits.

Every summit is then checked against the height the tour claims. 21 of 24 agree
within 2 m. The three that do not — Rørnestinden −11 m, Rombakstøtta −12 m,
Himmeltindan −13 m — are sharp, often corniced tops where the published figure
predates the laser scan; the coordinate is right, the metre is arguable.

`generate_routes.py` validates before writing: the ends have to land on the
trailhead and the summit, the ascent has to be essentially monotonic, no step may
exceed a skinnable angle, no point may sit at sea level, and the gain has to be
in the same country as the tour's stated vertical.

## A peak can have more than one route

`corridors.json` holds a *list* of routes per tour, and they are not variants of
one line:

| tour | routes |
| --- | --- |
| Galdhøpiggen | Juvasshytta (632 m) and Spiterstulen (1434 m) — two standard starts 737 vertical metres apart |
| Fanaråken | Korpen (757 m) and Turtagrø (1196 m) |
| Tromsdalstinden | the Salen ski line and the marked NNV-ridge summer path — **same car park**, different sides of the mountain |
| Rondslottet | Spranget (1245 m) and Dørålseter (1222 m) — opposite approaches |
| Snøhetta | Snøheim (819 m) and Reinheim (948 m) |
| Gaustatoppen | Gaustablikk (965 m) and Stavsro (706 m) |
| Slogen | Skylstad (1482 m) and direct from Øye (1512 m) |
| Bitihorn | Bygdin (549 m) and Båtskaret (454 m) |
| Høgevarde | Tempelseter (598 m) and Norefjellstua (826 m) — opposite sides of Norefjell |

Nine tours carry a second route; the table above is all of them. 77 routes over
68 tours. The first route of a tour is the one its own `verticalM` and `duration`
describe. Alternatives are only added where a second route is actually documented
— `ALTERNATES` in `build_corridors.py`, and the research output, are not places
to invent one because the schema allows it. The other 59 tours have a single
route, and the app renders no picker for them.

`ALTERNATES` only reaches the first 24, because `build_corridors.py` is fed by a
swarm file the later rounds have no equivalent of. A researched corridor can now
carry its own second route instead: an `alternates` list on the record in
`new_corridors.json`, folded in by `merge_corridors.py` after the primary. That
is how Høgevarde carries both of its documented starts.

Route and trailhead *names* get shortened for display — the research came back
with sentences like "Normalruta fra Djupvik/Forselvveien via Pumpvatnet,
bekkedalen mot Forsnesvatnet, Isvatnet og sørøstryggen", which is good prose and
a useless label. The full text is kept alongside as `description` / `fullName`.

## The written guides

Every tour has a Norwegian and an English guide. The first 24 were written by one
agent per tour against `guide_brief.py <slug>` and then handed to a second agent
whose only job was to try to break it. All 24 came back `corrected`, which is the
point: an agent writing confident prose about terrain it cannot see will produce
a plausible sentence rather than no sentence.

The fifteen tours added in the second round — Besshø, Breitinden, Folarskardnuten,
Geitgaljen, Glittertinden, Hamperokken, Jakta, Keipen, Lønahorgi, Rasletinden,
Saudehornet, Skårasalen, Skogshorn, Storronden and Vesoldo — were written against
the same material, which for them is tracked rather than harvested: the corridor
description and notes in `corridors.json`, and the audit corrections in
`new_corridors.json` and `new_tourmeta.json`, all folded into the brief by
`enrich_facts.py`. They pass `check_guides.py` clean, and they have since been
through an adversarial second reader — one per tour, all fifteen found something.

The 22 tours of the Sunnmøre and Vestland rounds were written the same way, against
`guide_brief.py` and the corridor research each one was built from, and they pass
`check_guides.py` clean. They have **now** been through the adversarial second reader too — see
"The 22, read adversarially" below. Ten of the 22 came back with something; twelve were clean.

Writing them found one hole in the check itself. `NUM_UNIT` matched «høydemeter» and not
«høgdemeter», so every vertical stated in nynorsk — seven of the shipped guides, and all 22 of
the new ones — was invisible to it. The pattern now reads both, `test_check_guides.py` still
passes its fifteen cases, and the only figure the widened check turned up across all 61 guides
was one of the new ones, which was wrong and has been rewritten.

`new_tourmeta.json` accumulates: each later pass appends what it measured, and
`check_guides.py` treats those notes as the source for the figures in the prose.
`measurements.json` is the same thing for **any** tour, and it exists because the
first round's research lives in agent transcripts: a flank measured after the
guide was written had nowhere to be recorded, so twelve numbers sat in the check
as unsourced for as long as they did. One record per figure, and `how` has to say
enough that the next reader can repeat the measurement.
`merge_corridors.py` therefore keeps the corrections already recorded and adds
only what is new, and leaves a teaser alone once it has been rewritten against
the routed gain. Replacing either wholesale on a re-run silently unsources every
number a later pass measured — which is exactly what it did once, and the check
went from 12 unsourced numbers to 75 in one command.

A guide is written in the language its teaser uses, so the seven western tours
whose research came back in nynorsk read as nynorsk on the page rather than
switching dialect halfway down.

What the adversarial pass actually caught, on real tours:

- **Kavringtinden** was sold a north-facing couloir for the descent. Friflyt's
  descent is Østrenna, E–NE. The cornices had been placed on the wrong side, and
  the guide then routed you onto them.
- **Storehorn** warned you off the west side — "the west drops 47° right below the
  summit". West is the *flattest* side there: a near-level bench for 260 m. The
  ground that falls away under the cairn is south, 96 vertical metres in 20 of
  ground. In flat light the original sentence pointed at the cliff.
- **Synshorn** had a rock band "over 60°" directly below the summit on the south
  side. The south side is 4.5° for the first 400 m. The wall is real but sits
  half a kilometre out, past a plateau that is exactly the trap the copy should
  have described.
- **Hesten** grew a north-west cliff, "330 vertical metres in 160". NW measures
  11.6°. **Store Blåmann** grew 45° flanks on the lower ridge. **Storgalten** put
  the route in Russelva, a different drainage 6.3 km north.

Two tools keep this honest. `flank_probe.py <lat> <lng> [bearing…]` walks a radial
line out from a point and prints the profile and the steepest 60 m window, so
"the south side is over 60°" stops being an opinion. `check_guides.py` matches
every number in the prose against the route facts, the corridor research and the
checker's own measurements, and prints anything left over — a plausible metre
figure nobody can source is exactly what should not ship in an avalanche product.
It reads `guides.json`, and takes slugs to check a subset.

Three of its inputs were widened for the second round, because they were failing
sourced figures rather than catching invented ones: the per-100 m band table and
the corridor's own waypoint elevations are now facts a guide may quote, and a
number written with a decimal comma in Norwegian research ("1,4 km eksponert
rygg") is read as one number rather than two.

### The reassurance rule, and why it is easy to get backwards

The second half of the check looks for copy that tells the reader terrain is
safe. It has to do two opposite things at once, and a word search only does one
of them: every guide's forecast paragraph ends "an empty page does not mean a
safe mountain", so the rule reported the warning as the thing it warns against —
on both tours that carry the sentence, every run.

A denial now exempts a match, but only when it sits immediately in front of the
word and inside the same sentence. That gap is the whole rule: "not steep here,
and the bowl below is safe" is two clauses and is still reported. Widening it to
"a negation anywhere in the sentence" would have made the rule silent, which is
worse than the noise — so `test_check_guides.py` pins fifteen cases in both
directions and is the thing to run after touching either pattern.

Both word patterns were also too narrow to do the job they existed for. The
Norwegian listed `trygg` and `trygge`, so `trygt terreng` — the most natural way
to write the claim — was never checked at all, and the sentence that started this
escaped in Norwegian by luck rather than by rule. The English matched `safe` but
not `safest`, which is how "the northeast ridge is the safest line choice on the
mountain" sat unread in Kavringtinden's avalanche paragraph. Widening both caught
it on the first run. It now says *gentlest of the documented line choices*, which
is what the paragraph goes on to give the numbers for — safest is a judgement
about cornices, wind and consequence; gentlest is a measurement.

Neither tool can tell you the route goes up the wrong valley. That is what the
second agent is for.

### Emitting

`emit_guides.py` with no arguments writes every guide in `guides.json`; naming
slugs writes only those and copies the rest through byte for byte. Prefer the
second when adding tours. A guide's prose and its elevation profile are written
against the same geometry at the same time, so re-emitting a tour whose line has
been re-routed since gives it a fresh distance label under a caption that still
quotes the old one — which is exactly the state the first 24 are in after the
`maxAngle` fix re-routed every line. Bringing them up to the current
`lib/routes.ts` means rewriting their numbers too, and that is a job of its own.

`tourmeta.json` is the pipeline's copy of the tour list, and nothing the app
reads: `guide_facts.py` takes the claimed summit height from it, `emit_ts.py`
takes the order of ROUTES from it, and `generate_routes.py` checks a routed gain
against its `verticalM`. It drifts the moment a tour row is corrected by hand,
and it drifts silently — after Folarskardnuten's summit moved, the profile under
the guide went on labelling the top "1927 moh" because `summitClaimM` comes from
here. `sync_tourmeta.py` re-reads it from `lib/tours.ts`; run it after any hand
edit to the rows.

`guide_facts.py` needs `routes.json`, which is not tracked. When the guides are
what is being worked on rather than the geometry, `routes_from_ts.py` reads the
finished lines back out of `lib/routes.ts` instead of spending ten minutes and a
few hundred megabytes of DTM tiles reproducing them. The terrain classes behind
the treeline are cached in the previous `guide_facts.json` and only re-queried
for a line that has actually moved.

## The app's numbers, reconciled against the ground

`verticalM` is now the cumulative ascent of the tour's **first** route. **Every one
of the 61 agrees with its routed gain to within 10 m**, which is the invariant to
assert if this is ever checked automatically. An alternative route has its own
gain and is not expected to match.

The DTM1 re-sampling moved six of them past that line and they were re-rounded:
Kavringtinden 1240 → 1250, Breitinden 1020 → 1030, Kolåstinden 1080 → 1120,
Slogen 1480 → 1520, Rondslottet 1240 → 1280, Folarskardnuten 950 → 970. Three of
those six were already outside 10 m before the re-sampling. The teasers quote the
gain too, and eight of them were brought along.

### Folarskardnuten's summit moved

Fixing the summit search moved three peaks, two of them published. **Folarskardnuten**
went 821 m — from the 1927.3 m north-east top to the 1932.2 m high point, on a
bearing of 216° across a 1899.9 m saddle — and **Himmeltindan** 67 m and 7 m up,
to 955.9 m, which is where `lib/tours.ts` already had it. Storehorn's moved a
metre. All three were re-routed and re-sampled.

Folarskardnuten's finish is a different piece of mountain now: from the 1830 m
shoulder the route runs 702 m west-south-west on a bearing of 253°, climbing
evenly at 0.5 to 17.5° instead of 487 m north-west to the old top. The tour is
115 m longer, and its steepest sustained gradient reads **27.2° instead of 37.8°**
— not because the step out of Folarskardet changed, but because the re-solved
line crosses it diagonally rather than head on. The fall line up the ramp is
still the researched 36.7° over 41 m, and the guide now says which is which.

The cairn the published route descriptions name is on the 1927 m top, and the
guide says so.

Twenty tours were corrected to get there, to the routed gain rounded to the
nearest 10 m — rounded so the figures read like published data and do not drift
when the geometry is regenerated.

The ones *not* touched at the time were already inside 10 m of a figure that
is deliberately round and matches the guidebooks: Tromsdalstinden 1200 (routed
1206), Store Blåmann 1040 (1031), Storgalten 1219 (1210), Rondslottet 1240 (1245).
Replacing a published 1200 with a machine-rounded 1210 would be a downgrade, not a
correction. Rondslottet has since moved anyway — the re-sampling put its routed
gain at 1281.

Of the twenty, three were figures that matched no real trailhead at all:

| tour | was | now | why |
| --- | --- | --- | --- |
| Galdhøpiggen | 1100 m | **630 m** | 1100 matched neither standard start; it sat between Juvasshytta (632 m) and Spiterstulen (1434 m), and both are now routes in their own right. |
| Oksen | 1240 m | **1060 → 960 m** | 1240 was the 1241 m summit altitude duplicated into the gain field. Corrected again once the audit moved the start to Tjoflot øvre. |
| Hesten (Segla) | 626 m summit, 620 m gain | **556 m / 510 m** | The summit is 557 m in DTM1. The old 626 looks like Segla (638 m), a spire, not a ski summit. |

The other thirteen followed from the audited trailheads:

| tour | was | now | audited trailhead |
| --- | --- | --- | --- |
| Rondslottet | 1050 m | **1240 m** | Spranget p-plass |
| Fanaråken | 950 m | **760 m** | Korpen (the 950 fits the 1196 m Turtagrø route, which is here as the alternative) |
| Storehorn | 630 m | **470 m** | Hornslie p-plass |
| Melderskin | 1420 m | **1270 m** | Kletta p-plass |
| Steindalsnosi | 620 m | **760 m** | Gjuvvatnet |
| Kirketaket | 1380 m | **1270 m** | Hellerøra-parkeringa (ut.no gives 1243 m) |
| Kavringtinden | 1150 m | **1240 m** | Lyngseidet |
| Slogen | 1560 m | **1480 m** | Skylstad i Norangsdalen |
| Kolåstinden | 1150 m | **1080 m** | Standaleidet |
| Rørnestinden | 1041 m | **1000 m** | Lyngseidet — and Friflyt publishes exactly 1000 m |
| Bitihorn | 500 m | **550 m** | Bitihorn p-plass ved Fv51 |
| Stornappstinden | 730 m | **680 m** | Nappskaret skianlegg (Friflyt gives 680 m) |
| Oksen | 1060 m | **960 m** | Tjoflot øvre parkering |

And four more where the figure was only 15–25 m out — small, but still a real
discrepancy rather than rounding: Skåla 1840 → **1820**, Synshorn 400 → **420**,
Snøhetta 800 → **820**, Gaustatoppen 950 → **970**.

Where a guidebook publishes its own gain the two now agree closely — Rørnestinden
1000 against Friflyt's 1000, Stornappstinden 680 against Friflyt's 680, Kirketaket
1270 against ut.no's 1243, Fanaråken 760 against ut.no's 724. The residual few tens
of metres is a counting difference: these figures are cumulative ascent, so they
include the undulation a simple summit-minus-trailhead subtraction misses.

### The bug that caused most of this

`verticalM` originally held the peak's published **altitude** rather than its
ascent in eight tours: Storgalten 1219/1219, Rørnestinden 1041/1041, and Store
Blåmann, Himmeltindan, Stornappstinden, Slogen, Skåla and Melderskin all within
10 m of their own summit heights. For a fjord-to-summit tour that is nearly
right, which is why it survived; where the trailhead is higher up it is simply
wrong.

That matters beyond the numbers. **Do not use `verticalM` to infer a trailhead
elevation.** An earlier version of this pipeline picked placeholder trailheads by
matching `summitM − verticalM`, which bakes the error into the geometry and then
reads back as confirmation — it is how the Rørnestinden trailhead was moved to
sea level on an argument that turned out to be circular, and it took an
independent audit against Friflyt, OSM and the router to undo.

### Two routes worth knowing about

Slogen's primary line has a 40.4° step and Fanaråken's a 41.8° one. Both are real
— Slogen is a grade 4 alpine tour, and the Fanaråken audit confirmed the router
detours around a 55.7° band the straight corridor would otherwise cross. They are
the first places to look if a line ever renders wrong.

## The Sunnmøre round

Twelve peaks were added to Sunnmøre in one pass — the region goes from five tours
to seventeen, and the app from 39 to 51. The brief was "every well-documented ski
tour in Sunnmøre", and that question has no natural end: Fri Flyt alone publishes
around ninety route descriptions for the region, from Melshornet's floodlit track
to couloirs nobody skis twice. So the line was drawn where it can be defended,
and it is four conditions, all of them checkable:

1. Fri Flyt publishes a **full route description** — a named start, the line
   through named ground, gain, length and time. A photo caption is not one.
2. The tour **starts at a road**. This is what ruled out the Patchellhytta pair
   (Store Smørskredtind, Store Brekketind): the hut is a day's walk in, so the
   corridor would begin somewhere no car reaches and the vertical would describe
   a tour nobody does in one day. Shuttle-only descents are out for the same
   reason — Jønshornet is here as the ascent from Vollane, not as Fri Flyt's
   round trip down Jønshornrenna with a car left in Molladalen.
3. A **second, independent source** covers the same line: ut.no, morotur,
   peakbook, utemagasinet, a kommune or Visit site. Where the two disagree, the
   disagreement is recorded rather than averaged.
4. Every point of the corridor **resolves and measures**: the name in Kartverket's
   register, the trailhead against an OSM road or car park, and every elevation
   re-queried from DTM1. `check_new_corridors.py` re-runs all of it from scratch.

Hornindalsrokken was researched in the earlier round and had never been routed;
it goes in here with the eleven new ones.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Råna | 63 | 1587 | 1595 | 8.1 | 21.0° | 37.5° | 3 |
| Kvitegga | 324 | 1700 | 1477 | 6.1 | 22.5° | 38.1° | 3 |
| Hornindalsrokken | 388 | 1527 | 1466 | 7.3 | 23.3° | 46.6° | 4 |
| Torvløysa | 453 | 1851 | 1461 | 10.6 | 20.2° | 27.2° | 2 |
| Jønshornet | 107 | 1417 | 1428 | 5.7 | 19.5° | 32.2° | 4 |
| Skårene | 621 | 1830 | 1219 | 6.4 | 21.3° | 26.8° | 3 |
| Vassdalstinden | 92 | 1278 | 1212 | 6.5 | 23.6° | 36.2° | 3 |
| Eidskyrkja | 368 | 1482 | 1115 | 4.6 | 18.3° | 22.9° | 3 |
| Sunndalsnipa | 437 | 1395 | 989 | 5.6 | 19.6° | 29.0° | 2 |
| Auskjeret | 333 | 1203 | 870 | 3.8 | 18.6° | 26.4° | 2 |
| Ytstevasshornet | 538 | 1331 | 835 | 3.9 | 21.2° | 25.3° | 3 |
| Melshornet | 252 | 809 | 559 | 3.0 | 17.8° | 21.7° | 1 |

None of the twelve has a written guide yet. The research they were built from —
route description, trailhead evidence, hazard notes, sources and every correction
below — is in `new_corridors.json` and `new_tourmeta.json`, which is what
`guide_brief.py` reads.

### What the checks caught

**Two mountains called Kvitegga, nine kilometres apart, both documented.** Fri
Flyt has a route up each. The register has nine of the name. The one this round
ships is Kvitegga 1717, registered in **Volda**, skied from Snødalen; the Stranda
point at 62.13855,6.86486 climbs to 1488 m and is the 1489 m Kvitegga skied from
Ljøen — a different tour, and the one the summit search picked first. The
published 1717 is the **snow dome**: DTM1 reads 1700.3 m on bare ground, and
Hjørundfjordportalen says as much in words. The card carries the measurement.

**Fausaskiftet is not in the place-name register.** Auskjeret's start is named in
both sources and findable in neither SSR nor an address search. It is the west
end of Fausavegen (OSM way/598763759) at 62.36019,6.82149, 332,6 m — and that
point reconciles three published figures at once: 870 m of routed gain against
Fri Flyt's 850 and ut.no's 871, and 3,2 km in a straight line against Fri Flyt's
3 km. A trailhead that makes three independent numbers land is not a guess.

**Råna needed the corridor pinned onto the crest.** The first solve took the
east side of the summit ridge and finished with a 30 m window at **62°** — the
routing grid's summit cell reads about 1530 m where the top is 1587, so the line
walked up to the pin and then stood up. `flank_probe.py` says why there is no
gentle way: every direction off that summit falls 22–41° in the first 400 m, with
60 m windows of 53–66°. Two waypoints on the crest (1531 m, then 1562 m at 30 m
from the top) put the line where the description puts it — «følg toppryggen
nordover heile vegen til toppen» — and the steepest 30 m dropped to 37.5°.

**Skårene is spelled Skorene in the register**, and its register point sits
1,3 km north of the top on 1773 m ground. The summit search climbed to 1829,9 m
against a published 1829. Its access is documented under *Eidshornet*, two pages
away: park at Korsmyra, which OSM has as a car park 380 m from Grandesætra.

**Hornindalsrokken gives back 327 m and has a 46,6° step, and both are real.**
The give-back is the documented ridge — Trollaksla 1255, Sætrenibba 1370, the
skaret north of it at 1226 — and the 129 m of it in one drop is that skaret. The
steep step is the east rib in the last hundred metres, which the research already
recorded as the place skis come off (52 m west of the summit the ground reads
1247 against 1443 on the crest, about 75°). Its teaser had to be rewritten: the
research figure, 1139 m, is summit minus trailhead in a straight line, and the
ridge that goes up and down collects 1466.

**Three tours' published verticals belong to a start the winter driver does not
reach.** Fri Flyt gives Råna 1500 m and «5 timar frå Haukåssætra» — but the sætra
reads 229,8 m, which is 1357 to the top, and the road up to it is winter-closed;
starting where the gravel road leaves Urke (63,4 m) gives 1524 m and matches the
published figure. Vassdalstinden's 1200 m is from Nupen (92,2 m), not from
Vallasætra (323,5 m) up the toll road. Torvløysa's «Hatlestad-gardane på 350
moh» is the mapped car park at 453,2 m, so its routed 1461 m sits below the
published 1500 rather than at it.

### The two bugs this round found in the pipeline

`route_metrics.py` had not been run since `guide_facts.steepest_band` changed
shape: it still called `steepest_band(pts, zs)` and unpacked a tuple, where the
function now takes the per-100 m band table and returns a dict. It raised
`TypeError` on the first tour, so no new tour could get a row at all.

`emit_new_tours.py` re-emits **every** tour in `NEW_TOURS` when run bare, and a
re-emitted row is built from today's `route_metrics.json` and `new_tourmeta.json`
rather than from the row that shipped. Run without arguments it rewrote fifteen
settled tours: `hasGuide: true` vanished from all of them, because the row format
here is for tours that do not have a guide yet, and Hamperokken's vertical moved
1400 → 1390 on a re-measurement of a line that had not changed. It now takes
slugs, and the ones you leave out are copied through byte for byte.
`resolve_summits.py` and `resample_dtm1.py` take slugs for the same reason —
re-resolving 57 settled summits or re-reading 10 786 vertices to add twelve tours
is hours spent reproducing numbers that are already in the file.


## The Vestland round

Ten more peaks, on the same four conditions: a full Fri Flyt route description, a
start at a road, an independent second source, and every point resolving in the
place-name register and measuring on DTM1. Vestland is not one Fri Flyt index but
five — `skiturer-stryn`, `-sunnfjord`, `-sogn`, `-voss` and `-rosendal` — so the
round reads as five small ones, and it lands in five of the app's regions.
Sunnfjord is new; the other four already had tours.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lodalskåpa | Nordfjord | 584 | 2082 | 1524 | 10.4 | 20.5° | 35.6° | 4 |
| Snønipa | Sunnfjord | 351 | 1827 | 1493 | 8.3 | 19.2° | 26.0° | 3 |
| Juklavasstinden | Hardanger | 367 | 1361 | 1341 | 7.2 | 21.5° | 30.8° | 3 |
| Gygrastolen | Hardanger | 90 | 1347 | 1267 | 6.0 | 19.8° | 25.4° | 3 |
| Skarsteinsfjellet | Nordfjord | 349 | 1567 | 1219 | 5.8 | 17.3° | 25.0° | 2 |
| Horndalsnuten | Voss | 398 | 1462 | 1121 | 5.9 | 21.4° | 31.4° | 3 |
| Glitregga | Nordfjord | 398 | 1297 | 901 | 4.4 | 18.4° | 21.4° | 2 |
| Kvamshesten | Sunnfjord | 404 | 1209 | 838 | 4.9 | 22.8° | 27.4° | 3 |
| Storanosi | Voss | 510 | 1205 | 735 | 4.4 | 18.8° | 26.3° | 2 |
| Molden | Sogn | 501 | 1120 | 623 | 3.0 | 14.8° | 24.8° | 1 |

### Two tours the ground would not confirm, and were left out

**Togga.** Fri Flyt has two tours on it, «Togga 1205» and «Togga 1340». The
register has one Togga, and the local top its point sits on measures 1235,5 m on
DTM1 — 30 m above the one published height and 105 below the other. A tour row
carries a summit height; there is no reading of this massif that makes one true,
so it waits for someone who knows which top is which.

**Englafjell.** The description starts at the first farm in Musland and follows a
ridge over Såta to the summit. The raster says the ground west of Musland rises
to 900–1000 m and then falls to 350–400 m before Englafjell's own slope — a
valley the width of the corridor, with no name in the text to pin the crossing
to. The line was placeable only by guessing which side of it the route takes, and
a guess is what this pipeline is built not to draw.

### What the checks caught

**Kvamshesten's two published verticals are two different starts.** Fri Flyt
gives «960 høgdemeter frå Rytnane» and «810 frå parkeringa sørvest for
Kårstadstølen», and DTM1 separates them cleanly: Rytnane reads 209,1 m and the
road end 404,5 m, against a 1209 m summit. The signed parking is the second, and
that is where the corridor starts.

`check_new_corridors.py` also flagged its second leg — «Kårstadstølen ->
Rabbane: heads 128° away from the summit». The rule is right that the leg points
away; the guidebook is right that the route goes that way: «Du held no fram aust
mot Rabbane, og deretter i nordleg retning mot skaret aust for Skardavatnet». A
bearing rule cannot tell a detour from a dogleg, which is why its output is read
rather than obeyed.

**Juklavasstinden's 988 m is summit minus trailhead, not cumulative ascent.** The
described line climbs to the ridge above Omnetjørnene at 1033 m, drops east to
Møsetjørna at 755 and takes the north ridge to 1361 — about 300 m given back on
the way up. Routing it with no waypoints at all produces a tidier line, 1149 m of
gain and 155 m of loss, and it runs 500–800 m north of every landmark in the
text. The corridor won, and the card carries the measured 1340 m.

**Glitregga starts on a football pitch.** «Randabygd Idrettsanlegg, Ålandsleite
(400 moh.)» is OSM relation/5871905, and DTM1 answers 397,9 m with the terrain
class SportIdrettPlass — the rare case where the guidebook figure, the map object
and the terrain model agree to two metres.

**Lodalskåpa is a spring tour because of a road.** Bødalen is closed through the
winter and opens in May or June, so the season is set to `mai–jun` rather than
the winter window the other nine carry. Its 1524 m of routed gain sits 124 m
above Fri Flyt's 1400, which is the undulation along ten kilometres of valley,
glacier and ridge.

**Skarsteinsfjellet and Gygrastolen start lower than the guidebook implies.** The
gate on Dragesetvegen reads 349,1 m against a start the published 1100 m would
put at 466; the anleggsveg above Ænes reads 90,2 m against 1330 m of stated gain
from a summit at 1347. Both are the point where a car stops, and both are
recorded as the difference they are rather than smoothed away.


## The Oslo round

Seven peaks, on the fjells a car from Oslo reaches in one to two hours: Norefjell,
Blefjell, Skrim and Vikerfjell. Four new regions, and none of them is called Oslo,
because **the ski terrain is not in the city**. Oslomarka's high points are
forested 400–630 m hills, and Fri Flyt's own `skiturer-oslo` tag holds two
articles: Rødkleiva, which is a 200 m offpiste slope in an old alpine hill, and
Høgruta i Maridalen, a two-day 44 km traverse over Fagervann, Mellomkollen and
Barlindåsen. Neither is a tour row — one has no summit and the other has no day.
So the round goes where the ski tours are, and the drive is the thing that makes
it an Oslo round, in the sources' own figures: Skrim «en drøy times kjøring fra
Oslo», Vikerfjell «bare 10 mil», Blefjell «i underkant av to timer», and
Tempelseter on Norefjell «ca 14 mil og to timer».

The four conditions the Sunnmøre and Vestland rounds were built on still hold,
with one changed: **Fri Flyt does not publish route descriptions for these
fjells.** The primary source is ut.no, which does — with an activity type, a
season, a stated distance and gain, and a named chain of ground — and, for the
winter line specifically, randofolk.no, a randonée site that publishes the same
shape of description with a start, a route, the descent and the season it was
skied in. Where a tour's own full description exists only for barmark, that is
said out loud in `confidence` and in the record's `notes` rather than papered
over: Surløytenuten and Gyranfisen are the two, and both are `medium`.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Store Ble | Blefjell | 714 | 1343 | 670 | 6.3 | 16.7° | 35.2° | 2 |
| Gyranfisen | Vikerfjell | 661 | 1127 | 666 | 5.4 | 15.4° | 24.9° | 2 |
| Høgevarde | Norefjell | 910 | 1461 | 598 | 4.8 | 11.8° | 19.5° | 1 |
| Gråfjell | Norefjell | 910 | 1466 | 581 | 7.8 | 10.0° | 20.7° | 2 |
| Styggemann | Skrim | 483 | 871 | 549 | 9.6 | 15.1° | 23.2° | 2 |
| Ranten | Norefjell | 910 | 1416 | 527 | 5.6 | 13.9° | 27.1° | 2 |
| Surløytenuten | Blefjell | 714 | 1097 | 456 | 6.1 | 5.3° | 24.9° | 2 |

`check_new_corridors.py` re-queries all of it from scratch and comes back with
one note across the seven: Gyranfisen's give-back, which is the next section.
Every waypoint elevation matches DTM1, every trailhead has mapped parking within
250 m, no leg heads away from its summit, and `check_routes.py` calls the 68
tours and 77 routes clean.

Three of the seven leave from the same car park at Tempelseter, and two from the
same one at Nordstul. That is not a shortcut — it is what an Eastern Norway ski
fjell looks like: one ploughed road in, a løypenett out of it, and several tops
off the same network. All seven have a written guide, in bokmål and English, and
they pass `check_guides.py` clean — see below for what was measured to make that
true.

### What the checks caught

**Ranten was resolved onto a different mountain, and the margin was 30 cm.** The
summit search climbed to a 1415.9 m top on the Gråfjell massif, 1.5 km from
Ranten's register point, because against a published 1419 it beat Ranten's own
1415.6 m top by three tenths of a metre. Height alone cannot separate two
candidates that agree that closely — a published summit figure is rounded to the
metre at best. `resolve_top` now breaks a tie inside 2 m by distance from the
register point, which is the one piece of evidence that says which mountain
carries the name. The rule only applies between *different* tops: two candidates
within 200 m of each other are the same summit seen from two discs, and there
the height still decides. Without that guard Folarskardnuten's settled summit
moved 22 m onto a cell 0.7 m lower.

**Gyranfisen gives back 200 m of the 666 it climbs, and the terrain says so.**
Between Svarttjernskollen (1054 m) and Gyranfisen (1127 m) lies the søkk toward
Fjelldalen and Steintjern, and DTM1 reads 866 m midway. Three corridor variants
were routed — waypoint on Venekollen's top, no waypoint at all, and the waypoint
300 m west of it — and all three gave back 173–227 m. The one that shipped is the
one the description describes: ut.no passes Venekollen «på høyre hånd», so the
line goes west of it at 948.8 m, not over the 982.4 m top.

**Gråfjell's trail junction is an inference, and it is labelled as one.** Ut.no
places it «ca 1,5 km nord for Donkelitjenn», and there is no name in the register
at that spot. The waypoint is the distance and bearing the source gives, measured
on DTM1 at 1282.5 m, and the record says that is where it came from. Donkelitjenn
itself is the check that the corridor is on the described løype at all: ut.no
gives 1153 moh and «herfra er det en stigning på 313 m igjen», DTM1 reads 1156.0,
and 1156 + 313 lands 3 m from the summit.

**Surløytenuten's season is borrowed from its neighbour.** Nobody publishes one
for this top. It shares a car park, a fjell and a height band with Store Ble,
where randofolk.no gives January to April, so that is what the card carries — and
the record says it is an inference from the next tour over rather than a source
for this one.

**Two grades came back two steps from the measurement, and one of them was
wrong.** Ranten was researched as grade 3 on randofolk.no's «en mer alpin topp
med brattere nedkjøring». That is the renner in the jagged profile, and the route
does not go in them: the line measures 27.1° at its steepest 30 m and 13.9° over
its steepest sustained hundred. It ships as 2, with the renner still in
`hazardNotes`. Gråfjell stays at 2 against a measured 1, because its difficulty is
eight kilometres of high fjell and navigation between tarns, which a slope angle
cannot see.

**Four aspects were taken from the measurement and two from the guidebook.**
Where a source names the descent it wins: Ranten skis south to Fetjenn (198°)
though it is climbed from the east, and Surløytenuten's published return is the
steep south side though the corridor's last leg faces north. Both are the
Bitihorn case — the way the route faces and the way the descent flank faces are
different statements. Where nothing is named, `route_metrics.py` decides.

### The seven guides, and the flank probes they are built on

The Oslo round's guides were written against `guide_brief.py` like the others,
and then against a measurement pass the earlier rounds did not have: every one of
the seven summits was swept with `flank_probe.py` on all eight bearings, and the
readings are in `measurements.json` rather than in a sentence somebody has to
take on trust. That is what lets a guide say **which** side of a mountain is the
dangerous one instead of saying that some side is.

It paid for itself before a word was written. The research for **Gyranfisen** had
recorded that «vestsida av Gyranfisen stuper mot Vidalen». It does not: the probe
reads 5.7° mean to the west out to a kilometre and a half, with a steepest 60 m
window of 20.9°. The cliffs in ut.no's text are Bukollen, Gråfjell and
Storrustefjell — the mountains on the *far* side of the valley, which you look at
from the summit. The sentence was corrected in `new_corridors.json` before it
could become a guide that pointed a reader at the wrong edge.

What the sweeps found on the other six, all of it now in the copy:

- **Ranten** falls 40.2–54.8° in the 60 m windows 90–170 m below the cairn on
  every bearing from 150 to 210 — and 195 is the bearing to Fetjenn, which is
  where the marked path goes down. North and west measure 10–12°. From the top
  the two sides do not look very different.
- **Styggemann** is steepest where nobody is heading: 48.5° east, 45.3°
  south-east and 43.9° north-east, all within a hundred metres of the cairn. The
  route comes from the south at 25.1°.
- **Høgevarde** is gentle on three sides and steep on one: 7.1–8.6° west,
  south-west and north-west; 41.5° and 41.3° in the windows 70–160 m below the
  top to the east and north-east, toward the ski centre you can see from the
  summit.
- **Store Ble**'s south-east side, the one randofolk.no says you may have to
  scramble in thin snow, measures 41.5° 60–120 m below the top; the north side it
  offers as the alternative measures 5.8°. The guidebook and the terrain model
  agree about which way to go.
- **Gråfjell** has no steep side at all — 5.2–18.3° mean in all eight directions,
  steepest window 30.2°. Its guide is about navigation, because that is what the
  mountain is.
- **Surløytenuten**'s ridge back north measures 2.2° mean with a 5.7° steepest
  window; the published steep return south reads 29.5°.

Two other things the check made the copy change. Gyranfisen's «the rest stays
below 11 degrees» was reported as an under-N-degrees claim against a line that
reaches 24.9°, and it was right to: the sentence was about hundred-metre bands
and read as a claim about the tour. It now lists the bands. And Ranten's «den
trygge vegen ned» was reported for calling terrain safe — it is now «den slake
vegen ned», which is a measurement rather than a judgement, the same correction
the Kavringtinden pass made.

All seven forecast regions were queried rather than assumed, on the same Varsom
endpoint the app uses: Norefjell, Vikerfjell and Skrim are **Buskerud sør** and
Blefjell is **Telemark sør**, and both are **B-regions** — forecast only at
danger level 4 and 5. On most winter days there is no assessment for these
mountains at all, and every one of the seven guides says so in its own words.

### What the adversarial reader found

All seven then went through the second pass — the one whose job is to refute the
copy rather than polish it. It re-derived every compass claim as a bearing, took
the steep faces again from the DTM1 *point* API rather than the raster the first
sweep used, re-read the sources for what they actually say, and checked the two
languages against each other number by number. Nine findings, seven of them in
the class this pass exists for: a sentence that points the reader somewhere.

- **Høgevarde told the reader the ski centre was below them to the east.** It is
  9.85 km away on a bearing of 148 — south-east — and that direction is the
  steepest sector of the mountain: 51.2° in the window 420–480 m out. The east
  and north-east flanks the sentence warned about are real (41.5° and 41.3°), but
  the reason given for looking that way was invented, and it made a ten-kilometre
  descent sound like a shortcut to the car.
- **Ranten's south side is a shoulder before it is a wall.** The first sweep gave
  40–55° in the windows 90–170 m out and the guide said so. Re-measured every 30 m
  from the point API, the ground reads 1415.6, 1399.2, 1393.9, 1395.5 — one steep
  step, then flat, and on the bearing to Fetjenn it *rises again* at 90 m — before
  breaking at 47.2, 54.5 and 60.0°. That is the Synshorn shape exactly: the trap
  is the bench you can see, not the wall you cannot. Both languages now describe
  the shoulder first.
- **Styggemann quoted the wrong radial for its own descent.** The guide said
  Sørmyrseter lies on a bearing of 191 and that the described line was therefore
  the mildest. The bearing is 172, and that radial measures 29.1° with a 35.1°
  step at 120–150 m out — while 165 reads 36.8 and 180 reads 25.1. The line the
  reader will actually ski was neither the one measured nor the mildest.
- **Gyranfisen put Treknatten on the wrong side of the mountain.** A research note
  said 1.3 km north-east; it is 4.20 km on a bearing of 340. The note was
  corrected in `new_corridors.json` and the guide with it.
- **Gråfjell descended the wrong way off its own summit.** The route comes onto
  the top from the north-west, so the first kilometre down retraces north-west to
  the junction at 1282 m — the guide said south-west. It also called the tour
  "half done" at Donkelitjenn, which is ut.no's 19.3 km track; on the routed line
  the tarn is at 65 %. And it counted three lakes where the route goes out onto
  two.
- **Store Ble ran two different measurements together** — the route's own 35.2°
  step, which is on the south side 300 m from the cairn, and the 41.5° south-east
  radial beside it. They are now stated as the two things they are.
- **"Meter under varden" was horizontal distance everywhere.** Every flank figure
  in this round is a window *out* from the summit, not below it, and four guides
  said "under". A reader converting that to vertical metres would place every
  steep band far lower on the mountain than it is.

Two smaller ones: Gyranfisen read an opening in the forest at a sample point that
has no terrain class at all (the API answers null there — it now uses the first
classified open point, 1050 m), and Styggemann carried ut.no's advice to leave
your pack at the trail junction, which belongs to the Ivarsbu approach from the
east, 1.26 km away on the other side of the summit. Høgevarde also gained the
sentence naming its second route, which every other two-route guide in the app
has and it did not.

The number parity check between Norwegian and English came back clean on all
seven, and `check_guides.py` is clean again after the rewrites. What is still
true is that **nobody who has skied these tours has read the copy** — that is a
different check from this one, and it is the one the repository README lists as
open.

### What was left out

**Vikerfjell's Høgfjell (1010 m)** is the thousand-metre peak nearest Oslo and
has groomed trails to the top, but no source publishes a route to it — only that
the løype exists. A trail that is known to be driven is not a described line, and
this pipeline draws described lines.

**Oslomarka.** Rødkleiva and Høgruta i Maridalen are covered above. Kolsås,
Vettakollen, Tryvannshøgda and Oppkuven are real winter destinations and none of
them is a topptur with a vertical worth a card.

## The 22, read adversarially

The Sunnmøre and Vestland guides shipped sourced but unverified, and this is what
happened when the same second reader that went over the Oslo round was pointed at
them. Method: every compass claim re-derived as a bearing from the corridor and
the routed line, every summit swept with `flank_probe.py` on all eight bearings
(none of these 22 had ever been swept), the steep faces re-read from the DTM1
*point* API rather than the raster, terrain-class claims re-queried, the research
records re-read for what they actually say, and the two languages compared number
by number. All 22 sweeps are in `measurements.json`.

**Ten of the 22 needed a change. Twelve were clean.** The clean twelve are worth
naming, because a pass that finds something everywhere is not measuring anything:
Hornindalsrokken, Jønshornet, Vassdalstinden, Eidskyrkja, Sunndalsnipa,
Melshornet, Lodalskåpa, Snønipa, Juklavasstinden, Gygrastolen, Horndalsnuten and
Storanosi came through with their directions, their flank claims and their
terrain-class claims all confirmed. Hornindalsrokken's «om lag 55 grader rett aust
for ryggen og 75 rett vest» measures 55.8 and 74.2. Vassdalstinden's Vestrenna,
«45 til 50 grader», measures 46.9 mean on the west radial with a 57.1 window.
Melshornet's cornice «ut mot Ørsta» is on the north side, and north is the steep
one, 41.1°.

The three that were wrong rather than imprecise:

- **Skarsteinsfjellet was sent down the mountain in the wrong direction.** The
  guide said «ned same ryggen, austover mot Remestøylen og Dragesetvegen» and then,
  one sentence later, «fallretninga er vest». Remestøylen is on a bearing of 289
  from the summit and the trailhead 275: both west. The ascent legs measure 45,
  134, 101 and 101 — you climb east. The error came from the corridor research,
  which says «vest-sørvestover opp den tydelege ryggen»; the guide inherited it
  mirror-image and contradicted itself inside two sentences. Both are corrected.
- **Torvløysa carried a glacier the route does not cross.** The guide stated
  «Kartverket registrerer breterreng kring 1437 moh» and built a crevasse warning
  on it, in the section a reader uses to decide whether to bring a rope. Every
  point on the line between 1380 and 1520 m reads `ÅpentOmråde`. The nearest cell
  classed `SnøIsbre` sits about 300 m off the route at 1482 m. The paragraph now
  says that, and the ridge's real hazard — its sides — took its place.
- **Auskjeret warned about the wrong side.** The research said «fjellet har eit
  brattheng mot aust som er over 30 grader», and the guide told the reader not to
  drop east off the ridge. East off the ridge measures 7.5, 7.0 and 8.9 degrees
  mean from three points on it (896, 1000 and 1103 m), and 18.9 from the cairn,
  with the steepest 60 m window at 31.1° a full 280–340 m out. What is actually
  steep is **north and north-east of the summit**: 30.6 and 35.8 mean, windows
  58.9 and 50.5. This is the Storehorn shape exactly — a warning pointing away
  from the hazard.

Two more were true but pointed loosely, which on this product is the same
problem:

- **Kvitegga's «fallretninga er aust»** is the way home, not the first move: from
  the cairn the route runs *south* along the ridge to 1583 m before it turns down.
  Due east of the summit the flank measures 39.2° mean with a **73.1° window
  190–250 m out**. A reader taking the aspect field literally at the cairn drops
  into that. The guide now says which comes first. Its «sommarstien vestover inn
  Snødalen» is also south-west — the leg measures 210° — and that came from the
  research too.
- **Glitregga's «rett under toppen er terrenget bratt»** did not say which side.
  North measures 26.3 mean with a 37.8° window; south, east and west measure 2.8,
  8.9 and 1.8. Now it names the north.

And five guides gained a measured hazard they had simply never mentioned, because
nobody had swept these summits: **Molden** — a grade 1 tour — has 46.1 and 46.4
degrees mean east and south-east with 62–64° windows, which is the fjord view
being an edge rather than a slope; **Kvamshesten** 48.9 and 47.1 south and
south-east with 74° windows; **Skårene** 40.0 west and 37.7 north-east against 13
on the flank you climbed; **Ytstevasshornet** 43.2 north with a 67.3° window as
little as 10–70 m out from the cairn; **Torvløysa** 40.9 west and 36.2 south-west
off a ridge the copy called broad and gentle.

One thing was left as a disagreement rather than a fix. **Råna's card says the
descent faces south-east**; the line home bears 182° and `route_metrics` measures
S. Rather than overwrite an editorial field from a single radial, the guide now
states both — the card's SØ and the measured 182 — and says the crest is held on
its west side, away from the cornices the research recorded. A tour card and a
guide that disagree silently is worse than one that says which is which.

## The trailheads, checked against the ground

The rounds above audited where the line goes. This one audited where the day
starts: all 77 trailheads across the 68 published tours, and every claim the copy
makes about them — road name and number, whether there is a car park, whether it
charges, whether the road is even open in the season the tour is sold for.

That last one is the reason the pass was worth running. A wrong steepness figure
is a bad guide; a start point on a road that is gated until Easter is a wasted
drive, and the reader has no way to tell from the page.

Method, in the order it was run:

- Every trailhead coordinate reverse-geocoded against **Nominatim**, then queried
  against **Overpass** in a 400 m radius for roads (with `ref`), `amenity=parking`
  (with `fee`), barriers and gates, and mountain huts.
- Every place name and road name re-read from **Kartverket's place-name register**
  (`api.kartverket.no/stedsnavn/v1/punkt`), which is what settles a spelling.
- Everything the copy asserts that a map cannot answer — opening dates, tolls,
  parking charges — read back to the primary source: the county's own road
  notices, the national park authority, the toll road's own site, the tour
  descriptions the corridor research already cites.

One trap is worth writing down because it produced a false alarm before it was
caught: Overpass returns a way's **centre**, and a fylkesveg is a long way. Ranking
roads by distance-to-centre put Lenangsveien 900 m from a trailhead it runs past
at 150 m, which reads exactly like «the guide names a road that isn't there».
Road presence has to be asked with a tight `around` and read as a yes/no, not
sorted by a centroid.

**Eleven of the 68 needed a change.** What the register and the car-park data
confirmed is the larger half of the result: `Fv7922` at Sandneset, `fv7768` at
Slettneset, `fv862` at both Senja starts, `fv655` in Norangsdalen *and*
Nibbedalen, `fv51` at Bygdin and Bessheim, `fv5910` at Vollane, `fv2920` on
Lykkjavegen, `fv3430` at Stavsro, `fv5723` at Tjugen — every road number in the
copy is the current one. So are the names: Kartverket has **Slettneset**,
**Sandneset**, **Hornslie**, **Medfjordbotnvatnan** and **Langefonn turisthytte**
exactly as written, and Fausaskiftet really is where Fausavegen leaves
Nysætervegen. The Reinheim start sits 2 m from the hut. The mapped car parks at
Spranget, Hellerøra, Melderskin, Korsmyra, Hatlestad, Helgatun, Svartevatnet and
Ålandsleite are all at the trailhead; Skårasalen's start is a `barrier=toll_booth`
at 0 m and Skarsteinsfjellet's a `barrier=gate` at 0 m, which is what both guides
say. Rørnestinden and Kavringtinden share Eidebakken in two independent
descriptions, and Kvamshesten's road really is signed to «Storehesten» — the local
name for the mountain the guide calls Kvamshesten, which the copy now says out
loud instead of leaving as an apparent mismatch.

The changes, by kind:

- **Two started on a winter-closed pass without saying so.** Steindalsnosi and
  Fanaråken both begin on Sognefjellsvegen, which closes over the high ground and
  is plowed open around Easter, with the pass night-closed 20–08 for the first
  weeks after. Neither guide mentioned it, and both were still calling the road
  `rv55` — it has been **fv55** since the 2020 road reform. Both now carry the
  road number and the closure, because on these two tours the road *is* the
  season.
- **Four were silent about a charge.** Hauklandstranda (Himmeltindan) charges
  year round and is time-limited by the hour, which matters on a 4–6 hour tour;
  Tjugen (Skåla), Trefta (Skogshorn) and the toll road up to Hornslie (Storehorn)
  all charge too. All four are tagged `fee=yes` in OSM and confirmed against the
  operators' own descriptions.
- **Three named the wrong thing.** Melshornet's Krøvelseidet road is fv5894
  Vikebygdvegen and runs Volda–**Åmdalen**, not Volda–Ørsta. Storehorn's road ends
  at Hornslie as **Leinestølvegen**; Torsetstølvegen is the toll road you turn off
  onto to get there, so the guide now describes the drive instead of naming the
  wrong road. Snøheimvegen's cycling rule is a **window**, 1 June–15 July, not a
  date to wait out — and e-bikes are banned all year, which the guide had not said
  at all.
- **Two asserted more than the sources support.** Storgalten's «there is no proper
  car park here» is contradicted by a documented parking on the north side of
  Galtelva, and no OSM parking is not evidence of none; it now describes what is
  there — unsigned space by the river mouth and the verge — without the negative
  claim. Synshorn quoted a flat 80 kroner where sources give both 60 and 80; it
  now says the plot charges and to read the sign.
- **One was internally inconsistent.** Kvamshesten cited Fri Flyt's 960 m from
  Rytnane «nede på 209 moh», and 209 + 960 does not reach a 1209 m summit. The
  disputed elevation is simply gone; the two verticals and where each starts are
  what the sentence was for.

Four route labels changed with them, because the route picker on `/kart` shows the
trailhead string and nothing else: `skytebanen` → `Tromsdalen skytebane` (its
sibling route already said that), `Lyngseidet` → `Eidebakken ved Lyngseidet` on
both Lyngen tours, since the guides send you to Eidebakken and «Lyngseidet» is a
village, and `Tempelsetra kafè` → `Tempelseter` so that the three tours leaving
the same car park name it the same way.

One bug fell out of re-running the emitter. `emit_seed` truncated the old block at
`-- Kirketaket`, which stopped matching the moment a tour sorted ahead of
Kirketaket; the fallback cut at the first `update` and left the generated banner
standing, so **every re-emit since had stacked another copy of it — 34 of them**
in the committed `seed.sql`. It now cuts on the banner itself.
## The card figures, checked

`check_routes.py` checks the geometry and `check_guides.py` the prose. Nothing
checked the four numbers on the tour card itself — summit height, vertical,
coordinate, and the copy of all three in `supabase/seed.sql` — so `check_tours.py`
now does, and it asserts what this README already claims: **`summitM` is DTM1 at
the resolved summit, `verticalM` is the first route's cumulative ascent to within
10 m, `lat`/`lng` is the resolved summit, and the elevation profile's end label is
the elevation the line under it actually ends at.**

Running it the first time found four things across the 68 tours.

**The database seed had missed three summit corrections.** When Rørnestinden went
1041 → 1030, Rombakstøtta 1243 → 1231 and Himmeltindan 962 → 956 — the round that
single-sourced every height from the terrain model — `lib/tours.ts` was updated and
`supabase/seed.sql` was not. Himmeltindan's row still carried the old coordinate
too, 67 m off the top, and the old 960 m vertical. `lib/tours.ts` is the demo-mode
fallback and the seed is what populates production, so the two would have served
different heights for those three tours to different readers. Both now agree.

**Storehorn carried a published height where every other tour carries a measured
one.** The card said 1478; DTM1 reads 1482.4 at the local maximum 2 m from the
stored coordinate, with the next top 8 m lower and 203 m away — so the coordinate
is right and the mountain is 4 m higher than the published figure. Eleven other
tours also carry a published number, but on those the published and measured
figures agree to within 1.5 m, so nothing turns on it; Storehorn was the only one
where the card and the terrain model genuinely disagreed. It now carries 1482,
which is the same rule Rørnestinden, Rombakstøtta and Himmeltindan follow, and the
elevation profile under its guide — which had been labelling the top 1478 while
drawing a line that ends at 1482 — was re-emitted with it.

**And the check's own first version was quietly checking half the file.** The
first 24 seed rows are column-aligned with runs of spaces, the later ones use a
single space, and Galdhøpiggen's has none at all after its region. A `', '`
pattern matched 44 of the 68 rows and reported clean on the 24 it could not see —
which is exactly the failure mode this file exists to catch, one level up. The
separator is `,\s*` now, and the row count is printed so a silent shortfall is
visible.

## Network

Everything is public and unauthenticated:

- `ws.geonorge.no/hoydedata/v1/punkt` — DTM1 elevation at a point
- `ws.geonorge.no/stedsnavn/v1/navn` — place names (SSR)
- `wcs.geonorge.no/skwms1/wcs.hoyde-dtm-nhm-25833` — DTM raster tiles (WCS)

Tiles are cached under `cache/`, which is gitignored — the first run pulls a few
hundred MB, later runs are local.

## This is generated geometry

It is a real terrain line, not a recorded track, and the app says so in both
languages. It shows where the route goes; it does not replace a map, an avalanche
forecast, and judgement in the field. Production replaces these with surveyed
GPX from Supabase Storage.
