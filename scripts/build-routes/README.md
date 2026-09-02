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
python3 check_geometry.py     # the shape of every line: scribbles, spurs, sea, notches — offline

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
python3 check_ground.py       # the line against OSM: water it crosses, trails it claims
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

Nine tours carry a second route; the table above is all of them. 87 routes over
78 tours. The first route of a tour is the one its own `verticalM` and `duration`
describe. Alternatives are only added where a second route is actually documented
— `ALTERNATES` in `build_corridors.py`, and the research output, are not places
to invent one because the schema allows it. The other 69 tours have a single
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

## The Trondheim round

Seven peaks, on the fjells a car from Trondheim reaches in one to two hours. Two
regions: **Trøndelag** for the three tops in Melhus and Trondheim kommune, and
**Trollheimen** for the four in Oppdal and Surnadal. The app goes from 68 tours
to 75.

The conditions the earlier rounds were built on hold, with the primary source
split by area. For the four Trollheimen tours it is **Fri Flyt**, which indexes
Oppdal as `skiturer-oppdal` and publishes the same shape of route description as
for Sunnmøre and Vestland — a facts block with toppunkt, høydemeter, kilometer,
startsted, himmelretning, bratteste punkt and KAST class, and for two of them its
own GPS coordinate for the summit. For the three near town it is **ut.no**, which
is where the ski tours on Trondheim's local fjells are actually published: a
series described by Håvard Engen and reviewed by Trondhjems Turistforening, each
with a start elevation, a summit elevation, height lost on the way up, total
climb, length, time, aspect, and a KAST terrain class. Every tour has a second,
independent source; every trailhead has a mapped car park; every waypoint
resolves in the place-name register and measures on DTM1.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Snota | Trollheimen | 495 | 1668 | 1268 | 10.2 | 15.7° | 28.9° | 3 |
| Okla | Trollheimen | 598 | 1582 | 1028 | 5.6 | 20.6° | 25.1° | 2 |
| Storhornet | Trollheimen | 653 | 1589 | 938 | 6.5 | 19.1° | 21.8° | 2 |
| Storbekkhøa | Trollheimen | 623 | 1504 | 893 | 5.6 | 17.5° | 26.4° | 2 |
| Rensfjellet | Trøndelag | 411 | 942 | 674 | 11.0 | 12.2° | 25.9° | 2 |
| Vassfjellet | Trøndelag | 184 | 711 | 541 | 4.7 | 15.9° | 23.0° | 1 |
| Kråkfjellet | Trøndelag | 411 | 815 | 430 | 9.3 | 5.8° | 18.6° | 2 |

`check_new_corridors.py` re-queries all of it from scratch and comes back with
one note across the seven — Snota's give-back, which the source states itself
(«tapte hm opp: ca 100» against a routed 95). `check_routes.py` calls the 75
tours and 84 routes clean, and `check_tours.py` the 75 cards.

Two tours leave from the same car park at Håen, which is the Tempelseter shape
again: one ploughed road in and two kommunetopper off the same track.

### What the sources got right, and where they did not

Five of the seven summits land within 2.1 m of their published height, and two of
those are confirmed twice over. **Storhornet** reads 1589.0 m on DTM1 against a
published 1589, and Fri Flyt's own GPS position for the top — 213151.854,
6958824.056 in UTM33 — converts to 10 m from the cell the summit search climbed
to. **Storbekkhøa** reads 1504.3 against 1504, with Fri Flyt's coordinate 27 m
away. Rensfjellet reads 941.5 against 941 and Vassfjellet 710.9 against 710.

**Kråkfjellet is the sixth, and it is 2 m short.** Trondheim's kommunetopp is
published as 817 m everywhere; the highest cell within 300 m of the register
point reads 814.9. The card carries 815, which is the rule Storehorn set: where
the card and the terrain model disagree, the terrain model is the one that was
measured.

**Okla's summit is registered under another name, and the two sources publish two
heights.** The mountain is Okla; its high point — where the cairn and the summit
book are — is registered as **Snydda**, and the point registered as *Okla* lies
2.4 km due west on 1458.8 m ground. Ut.no publishes 1580 m for the top and Fri
Flyt 1564. DTM1 reads 1582.3, which settles it in ut.no's favour and puts Fri
Flyt's figure 18 m low. The card carries the measurement and the name the tour
goes under.

**Storbekkhøa's two published climbs are 300 m apart.** Fri Flyt gives 600
høydemeter, ut.no 900. The car park measures 622.6 m and the summit 1504.3 — 882
m of pure difference — and the routed line climbs 893. Ut.no's figure is the one
that matches the ground; Fri Flyt's fits no start on this side of the mountain.

**Kråkfjellet's routed gain is 89 m below ut.no's.** The description says «følg
rygg eller søkk i samme retning avhengig av snøen og skiføret», and the ridges
here run north–south: a line that crosses them collects up-and-down that a line
along them does not. The card carries the routed 430 m and the guide says why the
published 519 is different.

**Two waypoints are inferences, and both say so.** Rensfjellet's crossing of
Oksdalen is not a named place — the valley's register point sits 3.95 km away on
a bearing of 15 — so the crossing was read off the terrain model as the low line
running south from it, 532.0 m. Storbekkhøa's «skaret du følger opp mot toppen»
is named in neither source; the point in the corridor, 1313.3 m, is where both
descriptions send you, west of the steep south-east face.

### What the flank sweeps found

All seven summits were swept on eight bearings with `flank_probe.py` before a word
was written, and the sweeps are in `measurements.json`. Three of them changed the
copy, and one changed the research.

- **Storhornet's published hazard note points 3 km away from the hazard.** Fri
  Flyt warns about «det bratte terrenget rundt Omnråa sør for toppen». Omnråa is
  real — a cirque registered 3.02 km south of the cairn — but the south side
  directly below the top measures 6.0° mean with an 8.2° steepest window, and the
  southward radial does not reach 24.8° until 1450–1500 m out. What is steep where
  you stand is **north-east**: 30.7° mean with 46.2° in the window 10–70 m out.
  This is the Storehorn shape exactly, and the guide now names both and says which
  is which.
- **Vassfjellet's ski centre was on the wrong side of the mountain in the
  research.** The note said Vassfjellet vinterpark lies north of the summit. The
  alpine area is **east**: the skisenter's own polygon has its centre 1.3 km out on
  a bearing of 86, the vinterpark 2.5 km on 80, and the nearest lift ends 893 m
  from the cairn on 46. The route from Markavollen comes up from the west and
  crosses none of it. The «anleggsveg mot toppen» ut.no puts you on is the service
  road to **Melhus hovedsender**, a communications mast 131 m from the cairn.
- **Snota's glacier is on the line, and it was checked rather than assumed.** Ut.no
  says the route crosses a bre for about 500 m from around 1380 moh. Seven vertices
  of the routed line between 1364 and 1471 m answer `SnøIsbre` in Kartverket's
  terrain classes, and the stretch measures 436 m; the points either side of it are
  `ÅpentOmråde`. That is the opposite of the Torvløysa case, where the same kind of
  claim did not survive the query — and it is why the claim is worth querying
  either way.
- **Snota's summit flank confirms its own warning.** «Toppflanken er stupbratt mot
  Ø» measures 48.1° mean with a 57.9° window 130–190 m out; south and south-east
  carry 71.4° and 71.0° windows as little as 10–70 m from the top. West and
  north-west — where the route comes up and goes back down — measure 14.8° and 9.4°.
- **Two of the three tours near town have no steep side at all.** Kråkfjellet's
  steepest 60 m window in any direction is 21.8°, and north measures 2.0° mean;
  Rensfjellet's is 17.8°. Their guides are about distance, ice on a drawn-down
  reservoir and cornices you can fall off in flat light, because that is what those
  mountains are. Storbekkhøa is the other way: its south-east face measures 34.1°
  mean with 46.9° 20–80 m out from the cairn, which is exactly the wall Fri Flyt
  warns about, while the north-west half circle the route climbs measures 3.7°.

### The first move off the summit

Three of the seven do not ski back the way the card's aspect suggests, and the
bearings are in `measurements.json` so the guides can say so:

- **Storbekkhøa** leaves the cairn heading **west** (276° over the first 200 m,
  236° over 500) even though the car park bears 170. That is Fri Flyt's half
  circle, and it has to be finished before the line turns south.
- **Okla** leaves heading **east** along the ridge (73°) with the car park at 167,
  because north and north-west off that summit measure 43.6° and 44.7° mean with
  50.9° and 57.1° windows — Fri Flyt's alternative descent to Gjevilvatnet, which
  it calls «svært bratt og seriøst».
- **Snota** leaves heading **north-west** (320°) with the car park at 13, running
  back along the summit flank before it drops east down the glacier. Taking the
  card's Ø literally at the cairn puts you on the 48.1° face.

### The guides

All seven have a guide in bokmål and English, written against `guide_brief.py`,
the corridor research and the sweeps, and they pass `check_guides.py` clean — as
do the other 68 after the run. The Norwegian and English versions were compared
number by number and agree.

The writing pass caught four errors in its own material, which is the argument for
doing the measuring before the writing rather than after: Vassfjellet's ski centre
(above), Storhornet's Omnråa note (above), the register point for Okla described
as «vest-sørvest» when the bearing is 267, and Oksdalen's register point given as
4.2 km from the crossing when it is 3.95. What has *not* happened is an
independent adversarial read: the same pass that wrote these guides is the one
that checked them. That gap is closed below in "The seven, read adversarially",
by a later pass whose only job was to break them; the method is the one in
"The 22, read adversarially" above.

### The seven, read adversarially

The section above ends by naming the gap: the pass that wrote these seven guides
was the pass that checked them. This is the independent read that closes it, and
it is the round where the method paid for itself most bluntly — three of the seven
had a **line that went somewhere the copy said it did not**.

**Kråkfjellet and Rensfjellet crossed Håen.** Both guides said «følg strandlinja
på nordsida av vatnet», and the corridor record claimed in as many words that the
line was «lagt langs nordbredden av Håen ... ikke over vatnet». It was not. On
both tours about 1.9 km of vertices read exactly 433.0 m with terrain class
`InnsjøRegulert`, up to 251 m from the mapped north shore. Håen is a reservoir
that is drawn down every winter, and unsafe ice on it is the single hazard ut.no
names for both tours — so the map was taking a paying reader onto the one thing
the guide told them to stay off.

The fix was in the source all along. Ut.no's own line for Kråkfjellet is
«skogsbilveien **eller** strandlinja N på Håen rett Ø», and that forest road is
real and mapped: OSM way/617153815, `Lundadalsvegen`, `toll=yes`, running 2.6 km
east from the car park along the north side, 410.5 m at the parking to 434.8 m at
its eastern end 290 m short of Kråklivollen. Six waypoints on that road pin both
corridors onto land. Kråkfjellet now has **no vertex on the water at all** and
Rensfjellet 35 m of shoreline brush. The figures moved with the line, and moved
*toward* the source: Kråkfjellet 430 → 470 m of gain over 9.3 → 9.6 km against
ut.no's 519, Rensfjellet 670 → 700 m over 11.0 → 11.3 km against ut.no's «ca 650».

**Okla crossed Mjølkskåla.** Ut.no could not be plainer — «rund eggen med vatnet
Mjølkskåla under deg» — and the guide quoted the rim at 1324 m as the line's own
height. The line ran 495 m at 1277.0 m, `Innsjø`, straight across the lake. Two
waypoints on firm ground put it back on the rim: the shoulder east of the water
at 62.6880/9.2850 (1275.2 m) and the rim north of it at 62.6888/9.2780
(1289.7 m). Gain 1028 → 1024 m, distance 5.56 → 5.69 km, and the lake is below
the line the whole way. Korgtjønna at 1151 m the line still crosses, for 720 m —
that is where ut.no sends you, and the guide now says so instead of implying dry
ground.

**Kråkfjellet's road claim was wrong in the other direction too.** «Der
Lundadalsvegen ender» — the road does not end at the car park; the *ploughing*
does, and the road beyond it is the skogsbilveg the route follows. Corrected in
both languages.

**Snota's glacier was measured at the wrong resolution.** The guide said seven
points classed as glacier terrain between 1364 and 1471 m over 436 m. Re-querying
the terrain class on *every* vertex rather than every third gives eleven points
from 1364 to 1463 m over 404 m, with two bare vertices at 1414 and 1421 m in the
middle where the ice is broken — and 1471 m is open ground, not glacier. The
sampled figure was the sampling, not the glacier. Ut.no's «frå ca 1380 moh ... i
ca 500 m» still brackets it.

**Vassfjellet's distance gap was undisclosed.** The routed 4.74 km against
ut.no's 6.7 km is the marked track winding where the line does not; the vertical
agrees to 15 m. Every other tour in the round discloses its gap against the
published figures, and this one now does too.

**What was confirmed clean.** Every summit height was re-queried from DTM1 at the
card's own coordinate and all seven land within 0.15 m of the stored value —
Vassfjellet 710.89, Kråkfjellet 814.89, Rensfjellet 941.55, Snota 1667.99,
Storbekkhøa 1504.26, Snydda 1582.17, Storhornet 1588.98. So did every trailhead,
waypoint and named elevation quoted in the prose: 27 points, none off by more than
0.13 m. Every car park was re-fetched from OSM and every tag the guides lean on is
there — `fee=yes` and `payment:cash=30` at Storli, `capacity=10` at Bree, no fee
tag at Markavollen (where the guide correctly credits the charge to ut.no rather
than to OSM). Every Varsom region was re-queried by coordinate: Vassfjellet,
Kråkfjellet and Rensfjellet are Sør-Trøndelag, type **B**; Snota, Storbekkhøa,
Okla and Storhornet are Trollheimen, type **A** — exactly what the ten guides
claim. Vassfjellet's mast is 131 m from the cairn at 709.4 m and the ski centre
1.30 km out on bearing 86, both as written; Storhornet's 725 m vertex really is
`DyrketMark`. Storbekkhøa and Storhornet needed no change at all.

### The other four, read as closely

The read above moved three lines. The four it left alone — Vassfjellet, Snota,
Storbekkhøa and Storhornet — were then given the same treatment rather than a
clean bill on the strength of having survived one pass. Two of them needed work,
and one of those was the largest single geometry error in the round.

**Storhornet was not on the marked winter route it is sold as.** The guide's own
first sentence is «på merket vinterløype fra Bree», and OSM has that route: a
continuous `piste:type=skitour` chain of seven ways from the Bree car park to a
node 25 m from the cairn, 5.13 km long, with **131 cabins within 300 m of it** —
the Hornlia hyttefelt the description walks you through. The routed line was not
on it. It was pinned to the *register point* for Hornlia (62.63835/9.46726,
846.8 m), which has **zero buildings within 600 m**, and to get there it ran
north for two kilometres, doubled back south-west, and only then turned for the
summit. Peak divergence from the mapped route: **1423 m**. The dogleg is also
where the tour's extra kilometre came from — 6.53 km routed against Fri Flyt's
5.3 and ut.no's 5.2.

Six waypoints on the mapped chain fixed it. The line is now 4.84 km with a peak
divergence of 166 m, 113 cabins within 300 m, and a heading that sits between
300° and 325° from the treeline up — which is what both sources mean by
«nordvest». Gain went 938 → 936 m, against ut.no's stated 928. Every band on the
new line is between 9.5° and 13.4°, and it gives back nothing at all, so the
guide's «jevn stigning» is now a measurement rather than a hope.

**Storhornet's south side was understated by fifteen degrees.** Fri Flyt's single
hazard note is the steep ground around Omnråa, south of the summit, and the guide
answered it with «først 24,8 grader 1450 til 1500 meter ut» — far away and not
very steep. Both halves were an artefact of how it was measured. The probe was
run `--out 1500 --step 25`: the radial stopped at 1500 m, which is 10 m past
where the ground actually begins to break, and a 25 m step turns the "60 m
window" into two samples and smooths the break away. Re-run at `--out 2000
--step 10`, the south radial is plateau under ten degrees for 1.45 km and then
falls off: 60 m windows of **37 to 40°** from about 1490 m out, the steepest
**39.7° at 1610–1670 m**, single ten-metre steps to **48°**, and 339 m of height
gone by two kilometres. The guide now says that. The original figure is kept in
`measurements.json`, marked superseded, because the way it was wrong is the
useful part.

**Storbekkhøa follows the wrong stream in one sentence.** Ut.no sends you up
«gjennom bjørkelia til høyre for Veslebekken»; Fri Flyt says the route «følgjer
Storbekken nordover frå Storli gjennom bjørkeskogen». The line is Fri Flyt's —
14 to 112 m from Storbekken the whole way, and 120 to 906 m *west* of Veslbekken
(OSM way/248399534), which is the left-hand side going up, not the right. The
guide had quoted ut.no's phrase over Fri Flyt's line. It now says which source
the line follows and where the other one goes. Its stream crossing was also
wrong in detail: the first crossing of Storbekken is at 644 m, not at the valley
floor, and the line braids back over it eight more times between 968 and 997 m.
And «the steepest band on the whole tour» is two bands, not one — 700–800 m and
1300–1400 m both measure 17.5°.

**Vassfjellet quoted a steepest-window figure across two raster resolutions.**
`flank_probe.py` sizes its DEM tile from `--out`, so a 400 m sweep and a 1 km
sweep read the same ground at different resolutions. Means survive that; steepest
60 m windows do not. The guide carried both — «33,3 grader … innafor 400 meter og
32,9 grader ut til en kilometer» — as if they were two facts about the mountain,
and the kilometre figure does not reproduce (34.3° at 190–250 m on a re-run).
Only the 400 m windows are quoted now, alongside the kilometre *mean*, which is
stable. Two smaller things went with it: north-west has the steepest window but
south-east the higher mean, so «nordvest er brattast» needed a qualifier; and the
line is a terrain line through the løype network rather than the løype itself —
2205 of 4744 m sit more than 50 m from any mapped trail — which the guide now
says outright. The anleggsveg it joins is real and mapped: Vassfjellvegen, OSM
way/429525197, 16 m from the line.

**Snota was clean, and gained one clause.** Every flank figure, band, bearing and
the glacier stretch reproduced exactly. The one thing missing was that 90 m of
the line crosses a small unnamed tarn at 1024 m at the foot of Litj-Snota, just
below the waypoint the guide already names at 1026. Worth a clause in a guide
that is otherwise precise about what the line crosses. Its Svartvatnet crossing
is deliberate and sourced — ut.no routes «over Svartvatnet (889 moh)», while the
mapped backcountry route in the area goes around it 478 m to the side.

What reproduced across all four, exactly: every one of the eight-bearing flank
sweeps at 400 m, every band table, every steepest step, every bearing off the
summit, every treeline, and full number parity between the Norwegian and English
texts — no figure appears in one language and not the other.

## check_ground.py — the line against mapped ground

Three of the four errors that mattered in the Trondheim round had the same
shape, and none of the three existing checks could see any of them. `check_routes`
asks whether the geometry is sane: a line across a reservoir is perfectly sane
geometry. `check_tours` asks whether the card's numbers are DTM1: they were.
`check_guides` asks whether every figure in the prose traces to a measurement:
every figure did. The copy that sent a reader onto drawn-down reservoir ice was
factually correct in every number it contained.

What the three shared was that they were checkable against something *outside*
the terrain model — OpenStreetMap's water polygons and its winter routes — and
nothing was doing that. `check_ground.py` does. It asks three questions:

**Water.** Which vertices stand on a lake, how far the line runs on it, how far
offshore it gets, and whether the guide names that height at all. A lake surface
in DTM1 is exactly constant, so runs of identical stored elevation are where
water can be, and only those are queried for a terrain class — which is what
turns fifteen thousand lookups into a few hundred. `InnsjøRegulert` is called out
separately: a regulated lake is drawn down every winter, so its ice is the least
trustworthy surface in the product, and a crossing the guide never mentions is
reported however short it is.

**Trail.** For a tour whose own guide promises a løype, a vinterløype, a
skogsbilveg or an anleggsveg, how far does the line stray from the nearest mapped
one? The claim is only enforced where it can be — when a mapped trail reaches
both the trailhead and the summit, the whole line is supposed to be on it.
Where the trail covers part of the route only (Kråkfjellet's skogsbilveg runs
three kilometres of nine, and the rest is open fjell with nothing mapped to
follow) the worst gap says nothing, and it is printed as a note rather than a
finding. «Utenfor oppkjørte løyper» is the opposite claim and is excluded by the
same negation rule `check_guides` uses on its reassurance patterns.

**Side.** Where the prose says the route runs to the right or left of a named
stream, which side is it on? Which way is right depends on which way you are
walking, so this is resolved from the trailhead-to-summit bearing, and a tour
that runs east–west is reported as undecidable rather than answered with a coin
flip.

It exits non-zero on findings, and it prints the numbers behind each one, because
the decision is not the script's to make. A frozen tarn a source deliberately
routes you across is fine — Snota goes over Svartvatnet because ut.no says to.
A drawn-down reservoir nobody mentioned is not. Only a reader can tell those
apart, and the output is written to be read rather than merely passed.

### Would it have caught them?

Yes, and this was checked rather than assumed: the pre-fix `lib/routes.ts` was
restored from the commit before the fixes, re-parsed, and run through the same
functions.

| tour, as it was | what the check says |
| --- | --- |
| Kråkfjellet | 1530 m and 191 m on water at 433 m, up to 251 m from the mapped shore — **REGULATED lake** |
| Rensfjellet | 1496 m and 225 m on water at 433 m, up to 242 m from shore — **REGULATED lake**, plus a 795 m stray from a trail that reaches both ends |
| Okla | 450 m on water at 1277 m and 631 m at 1151 m |
| Storhornet | strays 588 m from a mapped trail that reaches the car park (5 m) and the cairn (25 m) |

The offshore figures are the ones measured by hand during the read — 251 m and
242 m — which is the check reproducing a result rather than inventing one.

Two of those four print as **notes** rather than findings, because the guide did
name the height: Okla's copy quoted 1277 in the course of claiming the line
stayed *above* Mjølkskåla. That is the honest limit of a text search, and it is
why the output says «the guide names that height, which is not the same as
saying it crosses it» instead of clearing the tour. A note is a place to look.

### The first run over all 75

`check_ground_run.txt` is the run, kept in the tree because the findings are a
work list and not a pass/fail. It reports **21 things to look at across 16
tours** — every one of them a place where the drawn line stands on water, and
most of them on tours from the original 24 that had already been read
adversarially twice.

Overpass was refusing service while it ran (504 from the main instance, no route
to two of the mirrors from this network), so it ran `--offline`: the water
question is complete, because that comes from Kartverket, and the trail and
stream-side questions are reported as **UNCHECKED** rather than clean. Re-running
when Overpass recovers fills those in from cache.

**Fanaråken was the one that had to be fixed immediately**, and it is the reason
this check exists. Its guide contains the instruction in as many words:

> «Hold land langs vestsida — **ikke skjær over isen**.»

The line cut across the ice. 375 m of it read 1373.0 m — the tarn Silja — and
136 m read 1356.0 m with terrain class `InnsjøRegulert`: Prestesteinsvatnet,
OSM relation/4037643, `water=reservoir`, the magasin whose dam the guide's own
next sentence names. A guide that tells the reader to stay off the ice, over a
map line that crosses it.

Six waypoints on firm ground along the west side fix it, threading between two
small tarns at 1384 and 1381 m and running west of the reservoir down to the dam.
The new line has no vertex on water at all. Going round costs what going round
costs, and the guide now says so: **113 m given back** against the 54 a straight
line to the dam would have given, because land undulates and ice does not.
Length 6.03 → 6.70 km, gain 763 → 783 m. Re-solving the whole line also moved the
steepest 30 m window from 42.7° to 27.1° (1859–1882 m), which the prose carried
in two places and now carries correctly.

**Ytstevasshornet was the second fix, and the same shape.** Its guide says the
first stretch is «flate langs vatnet» — flat along the lake. The line went
straight out onto it: 180 m at 526.0 m, terrain class `InnsjøRegulert`.
Svartevatnet is a reservoir and its surface sits twelve metres below the car
park. Four waypoints on firm ground along the east shore fix it, and the line now
holds land round the north end and down to the south end at 524 m. Length
3.87 → 3.93 km, gain 835 → 833 m, loss 0 → 40 m — going round a lake costs
height the ice does not. Re-solving moved the steepest 30 m window 25.3 → 26.9°
(795–818 m), the steepest band 21.2 → 22.5° and the treeline 663 → 624 m, all of
which the prose carried.

**Styggemann was the third, and the first one the prose fixed rather than the
router.** Its line crosses five natural waters — Ravalsjø at 475 m for 630 m past
the islet Kjelen, Skrimsvannet at 575 m twice (191 and 270 m), Urdstjerna at
594 m for 225 and Stulstjernet at 602 m for 225 — 1541 of 9608 metres, and the
guide named none of them. None is regulated, none goes more than 99 m from
shore, and DNT's own winter chain from Ravalsjø runs through the same ground: a
groomed track over a narrow forest lake is ordinary winter travel, and routing
it off ice the track itself uses would have made the line worse. So the fix is
the sentence that was missing, not the geometry. The check also caught the
crossing *this* reader had missed — the 630 m over Ravalsjø, which the first
pass filed as a note because the guide names 476 m for Ormetangen, one metre
from the water's 475. That is the documented limit of the mention test doing
exactly what it says on the tin.

While there, one audit note was corrected: the research recorded «Urdstjerna
finnes ikke i registeret». It does, as Nedre Urdstjerna and Midtre Urdstjerna —
the name search had looked for the bare form.

**Folarskardnuten was the fourth, and the same call as Styggemann.** Four
crossings, 495 of 12 610 metres: Tjørngravtjørni at 1098 m twice (135 and 45 m),
an unnamed tarn at 1230 m for 45, and the tarn by Lordehytta at 1603 m for 270.
The last one the guide already handled well — it names the height and calls it
«vatn under snøen» — but it did not say the line crosses it, and the three on the
approach were not mentioned at all. All four are natural, none goes more than
84 m from shore, and they sit on the marked DNT winter route. Prose again, no
geometry.

**The rest of the list, for whoever takes it next.** No crossing on a regulated
lake remains, and 11 findings across 10 tours are left:
Folarskardnuten (three), Breitinden (295 m at 474 m, 34 m offshore), Juklavasstinden
(225 m), Rasletinden (two), Rondslottet, Glittertinden, Høgevarde on both routes,
Store Ble, Surløytenuten and Vassdalstinden. Every one of them is a line standing
on a lake under prose that never mentions it.

Two came back as **notes** and are right to be there rather than fixed: Besshø
crosses three and a half kilometres of Bessvatnet, and its guide describes that
in detail and calls the ice normal winter travel; Snota crosses Svartvatnet
because ut.no routes it that way and names the height. The check surfaces both
and lets a reader confirm them, which is the intended behaviour — the difference
between those and Fanaråken is not the crossing, it is whether anyone was told.

## The three, written with the ground check first

Kjerag, Møysalen and Sæbyggjenuten were added after the Trondheim round, and are
the first three where `check_ground.py` ran **before** the guide was written
rather than after it. That is a small change of order with a large effect on the
copy: six water crossings went into the prose as measured facts instead of being
found later as omissions.

None of the six needed a reroute. All are DTM1 terrain class `Innsjø` rather than
`InnsjøRegulert`, and none of the OSM polygons carries `water=reservoir` or
`landuse=reservoir` — this is the Styggemann/Folarskardnuten call, not the
Fanaråken one. What each guide now says is which lake, at what height, for how
many metres, and how far offshore the line gets:

| Tour | Crossings | On water | Named |
|---|---|---|---|
| Kjerag | five, at 925, 975, 1064, 1075 and 1080 m | 1091 of 7362 m | none — unnamed in SSR and OSM alike |
| Møysalen | three | 562 of 9747 m | Forkledalsvatnan 154, Rundvatnet 391, Grønnvatnet 328 |
| Sæbyggjenuten | one | 720 of 11 306 m | Midtre Gjuvvatn 1124 |

Three findings came out of writing them that the sources do not carry.

**Kjerag's high point is not the high point.** The registered summit reads
1123.7 m in DTM1, but the highest cell within 5 km is 1163.7 m at 59.01952/6.61052,
1347 m east-north-east — and 200 m due south of the registered point the ground
stands 1.5 m higher than the point itself, which is why the eight-direction sweep
returns −0.4° southward. The routed line makes the same joke: it crosses 1129 m
at 6640 m out, gives back 66 m to 1063, and climbs 21.2° over 60 m to arrive at
1124. All of that is in the guide, because a reader standing on a plateau
deserves to know the summit is a registration and not a peak. The real hazard is
elsewhere and was measured rather than repeated: due north the plateau holds
1008–1016 m out to 1850 m and then falls 71.4° and 77.4° over the next hundred,
reaching sea level about 2.6 km out. The drawn line never comes within 1675 m of
ground below 800 m.

**Møysalen's summit ridge has a 51 m notch, and it is real.** The line rises to
1170 m at 9332 m out and drops to 1119 over 27.3 m of ground — the sort of figure
that is almost always a resampling artefact. Twelve DTM1 point lookups at 2.3 m
spacing through the drop return a continuous curve (1170.0, 1163.3, 1162.6,
1160.6, 1158.2, 1153.3, 1151.1, 1148.6, 1139.6, 1133.5, 1127.3, 1123.8, 1119.2),
and a 5×5 grid at 20 m spacing around it reads 1055 to 1186 m, so no neighbouring
line is gentler. It is a notch. It is also why the route's largest step is 45.9°
and why Friflyt has people carrying skis there. Møysalen is the steepest summit
in the app by flank sweep: no direction averages under 24.5° out to a kilometre,
and east reads 70.8° in its steepest 60 m window only 10 m from the top.

**Sæbyggjenuten is forecast as Vest-Telemark**, and the reason is not the one
this section first gave. `AvalancheWarningByCoordinates` for 59.46181/7.62568
returns region 3035, Vest-Telemark — an A-region with a daily forecast — and the
first write-up called that a mismatch against a summit «where the mountain is»,
in Setesdal. It is not a mismatch. Kartverket's kommune API puts the registered
high point in **Tokke, Telemark**, and the county line crosses the summit itself:
5 m west of the point is still Telemark, 10 m west is Bykle in Agder and reads
1503.87 m against the point's 1506.49. So Varsom matches the coordinate exactly.
«Agders høgaste» still holds — nothing in Agder is higher than that ~1504 m ten
metres away — but the registered point is 2.6 m higher and on the Telemark side
of the line. The card's «Setesdal» describes the valley you start in, and that is
right too: the Berdalen car park is in Bykle, Agder. The tour begins in one county
and ends in another, which is worth a sentence rather than a shrug, and the guide
now says so in both languages.
All three tours are in A-regions: Heiane (3037), Lofoten og Vesterålen (3014) and
Vest-Telemark (3035).

The measurements behind every figure above are in `measurements.json` under the
three slugs, which is what `check_guides.py` reads when deciding whether a number
in the prose is sourced. `check_ground.py` re-run after the guides went in returns
all six crossings as notes rather than findings, and the three tours as clean.

### The three, read adversarially

The section above ends the way the Trondheim one did, by naming the gap: the pass
that wrote these three guides was the pass that checked them. This is the
independent read. It moved one card, rewrote half of one guide, found a pipeline
bug reaching **38 guides**, and found a second bug in the fix for the first.

**The treeline in every guide is a sample, not a measurement.** `guide_facts.py`
read the treeline off the fourteen-point `terrain_along` table, so
`last_forest_m` was the highest of fourteen points that happened to be forest.
That is a lower bound on the treeline and never anything else — the error only
ever runs one way. Møysalen is the case that exposed it: sampled **162 m**,
actually **234 m**, confirmed by querying the terrain class at every one of the
route's 333 vertices. The birch along the valley floor is interleaved with bog,
55 of the 333 vertices are forest, and the sampler landed on bog three times
running before climbing out of the belt. Bisecting between neighbouring samples
would not have found it either, because the two samples bracketing the true last
forest vertex were *both* non-forest. Sæbyggjenuten is wrong the same way and by
more: its guide claimed forest to 904 m and open ground from 1052, and the
registered pass at **Tverrheiskaret, 1028 m, is terrain class `Skog`** — forest
124 m above the claimed treeline, in the middle of the claimed open ground.

`treeline_scan` replaces it: walk vertices from the start, stop only once the
line has been out of the forest for both 600 m of ground and 150 m of height,
cache the classes to disk, and skip any vertex above 1300 m because no forest in
Norway grows that high — without that ceiling the quiet rule never fires on a
route that starts above the forest, and the scan walks all 300 vertices of every
alpine tour for an answer it already has.

Kartverket's point API went down partway through the first complete run; it came
back and the run finished. **62 of the 78 treelines moved, every single one of
them upward**, and five tours that the sampler said had no forest at all turned
out to have some:

| Tour | Sampled | Measured |
|---|---|---|
| Breitinden | 30 | **301** |
| Kirketaket | 458 | **683** |
| Lodalskåpa | 604 | **787** |
| Skåla | 367 | **543** |
| Hornindalsrokken | 521 | **673** |
| Sæbyggjenuten | 904 | **1044** |
| Juklavasstinden | 531 | **668** |
| Møysalen | 162 | **234** |

**34 guides quoted a figure that changed, and all 34 are corrected** in both
languages. Two sentences needed rewriting rather than renumbering, because
`first_open_m` changed meaning: it used to be the lowest *sample* above the last
forest sample and is now the first non-forest vertex after the last forest one,
so the two are usually only a few metres apart. Gyranfisen's «Ved 916 moh er du
fortsatt i skog» inverted under that — 916 became the first *open* point — and
Melshornet's «brattaste steget ligg ved skoggrensa» stopped being true once the
treeline moved 35 m above the step.

**The fix needed a fix.** The first attempt replaced the old numbers anywhere
they appeared inside a sentence mentioning forest, and that corrupted Grafjell's
«og på 950 moh går ruta ut på Istjenn» — 950 is Istjenn's elevation and merely
happened to equal the old treeline. It was backed out. The replacement now
matches only the eighteen phrasings that actually *state* a treeline
(«Skogen slipper taket på», «Kartverket fører skog til», «the forest holds to»,
«Bjørka held til», …) and the ten that state where open ground begins, captures
the number from the construct itself, and refuses to substitute unless it is
within 3 m of the stored old value. Under that rule 32 of the 34 matched
automatically; Rana and Skogshorn used phrasings the list was missing, which is
exactly what the report-what-you-did-not-match step is for.

**The outage found the second bug, in the fix.** `_class_at` first returned
`None` when a lookup failed, and `None` is not `"Skog"` — so an hour of
Kartverket downtime would have written *"no forest on this mountain"* into every
tour processed during it, silently and permanently. That is the exact shape of
`check_ground.py`'s cached-failure bug. It now raises, and a scan that cannot
complete returns a sentinel and keeps the previous value rather than inventing an
absence. An incomplete scan cannot rule the forest out, and it must not be
allowed to sound as if it can.

**Møysalen's glacier is not where the guide put it.** The corridor waypoint was
called «Breen sørøst for Møysalen, ~1025 moh» and the guide repeated it. At that
point — 502 m from the summit on bearing 140 — DTM1 returns 1026.59 m with
terrain class `ÅpentOmråde`. The ice the line actually crosses is at **752 to
898 m**, continuously over 405 m of ground, on bearings **184 to 216** from the
summit, 422 to 582 m out. Ring probes at 300, 500, 700 and 900 m in all eight
directions find `SnøIsbre` only east and south-west; south-east is bare ground
from 759 to 1047 m. The consequence ran into the avalanche copy too: the guide
placed its 41.9-degree step «rett under breen», and that step is at 1036–1063 m,
*above* the ice.

**And it moved the card.** The aspect was `SØ`, justified in the research by the
140-degree bearing to that same waypoint. With the waypoint gone, four things
agree on **S**: Friflyt calls the Vestryggen route «sørvendt bratt terreng» and
every other line on the mountain south-facing; `route_metrics.py` measures S; the
drop-weighted mean bearing is 193 degrees; and the ice is at 184–216. Changed to
S. While there, the teaser said 123 m down to Grønnvatnet (the waypoint chain)
against the guide's 120 (the routed line) — both now 120 — and `gradeReason`
still carried the waypoint chain's 1364 m of cumulative ascent against the
routed 1596.

**Kjerag's bearing was measured against a summit that moved.** The guide said the
bearing from the road point to the top is 271 degrees. It is **265**: the
research measured 270.3 to its own summit point, and the point `summits.json`
carries today is 338 m away. The argument survives — the sources say «mot
nordvest», north-west leads to Kjeragbolten 1921 m away, and the top is due west
— but the number was stale.

**Two of Kjerag's four sources are dead.** `utemagasinet.no` has been shut down
entirely and redirects to friflyt.no, taking with it the article the whole ski
route was researched from; the Sirdal kommune page on the winter closure returns
404. The claim they supported — not ploughed until the week before Easter,
opening 1 May at the earliest — cannot be sourced any more and is out. ut.no is
live and says it plainly: «Rv500 mellom Sirdal og Lysebotn stenges når første
snøfall kommer i okt/nov og åpner ikke før mai/juni.» Also from ut.no, and worth
saying: «Kjeragbolten ligger ca. 300 meter sør for varden» — the cairn the
walking descriptions mean is up by the bolt, not where this line ends.

**The road is Langvassvegen.** OSM way 374684028 carries `name=Langvassvegen` and
the place-name register agrees. «Langavassvegen» was the research's spelling and
had reached the route name, the teaser and the prose.

**Sæbyggjenuten has three passes, not two, and the guide warned about the wrong
pair.** The register has `Tverrheiskaret` at 1027.59 m, a second `Tverrheiskaret`
at 1091.50 m, and `Tverrheiskardet` at 1155.68 m. The two that are genuinely easy
to confuse are the last two — **305 m apart** — not the pair 2.4 km apart the
guide named.

**A distance written as a word walked past the check.** «Ti kilometer inn» on an
11.31 km route, and `check_guides.py` only ever matched `\d`. It now reads
spelled-out quantities where a unit follows, which surfaced six more across four
tours — all sourced once the check learned that «fire kilometer» and a 4455 m
`groundM` are the same fact at two scales. The one real gap it found besides
Sæbyggjenuten's was Horndalsnuten's «om lag tjue kilometer aust for Voss», a road
distance with nothing on the route to source it against; it is measured and
recorded now (15.9 km straight line, the 20 being the road through Raundalen).

**What was confirmed clean.** All 19 named elevations across the three tours were
re-queried from DTM1 and land within 0.35 m of the stored value — every
trailhead, every waypoint, every height quoted in prose. Every 100 m band table
was recomputed from `routes.json` and reproduces exactly. Every car park was
re-fetched from OSM and every tag the guides lean on is there: Øygardstøl
`capacity=100 fee=yes charge="200 NOK (car)"`, Litlvatnet `fee=no
check_date=2025-07-28`, Berdalen `amenity=parking` on node 4991831285. Lysevegen
still carries `motor_vehicle:conditional=no @ Nov-May` and `snowplowing=no`.
Kjerag's junction really is at the bridge — 12 m from OSM way 736576464,
`bridge:description=Stølsdalen I`. Kjerag's south-west flank really does fall
54.8 degrees in its steepest 60 m window 800 m out: a 20 m-step profile gives
1023.4 down to 937.5, and the neighbouring bearing reads 54.0. All six water
crossings re-verified as natural, none carrying a reservoir tag. And
Sæbyggjenuten's «Langemyr» waypoint, which looked wrong because a name search
returns a different Bykle Langemyr 4.6 km away on the wrong side of the car park,
is right: a point search on the waypoint itself returns Langemyr at 0 m.

## The eleven, worked

The list `check_ground.py`'s first full run left behind. Overpass was throttling
badly on the day, so the crossings were re-measured against **Kartverket's
terrain class** instead — walk perpendicular to the line from the crossing until
the class stops being water, which gives the offshore distance from the same
source the rest of the pipeline uses, and gives `InnsjøRegulert` for free.

**Two were never water.** Glittertinden's 45 m «on water» at 1335 m sits in a
228 m flat run whose midpoint is terrain class `Myr`, with firm ground 10 m to
either side — bog in Veodalen. Two of Rondslottet's three flat runs at 1167 m
(63 and 135 m) are `ÅpentOmråde`. The flat-run heuristic finds candidates; only
the class settles them.

**Two were rerouted, and both are the Fanaråken shape** — prose said land, the
line went on the ice:

  Rondslottet's guide opens with «Hold deg på land rundt vika ved Lonin i sørenden
  av Rondvatnet i stedet for å ta snarveien over isen; dette er utløpsenden, og
  der er isen tynnest». The line ran 90 m on that ice, up to 50 m offshore, 60 to
  128 m from the SSR point for Lonin. A waypoint on land west of the bay
  (61.8782/9.7950, `ÅpentOmråde`) and moving the Rondvassbu point from
  61.879/9.798 onto the hut itself (61.87886/9.79645) fixes it. The route now has
  no vertex on water at all: 12.34 km, +1283, −187, steepest step 34.9°.

  Breitinden ran 315 m straight across Breitindvatnet at 474 m, up to 40 m
  offshore, beneath the flank its own guide calls «terrengfelle under hele
  henget» — and the guide also says there is no published ski description for the
  mountain, so that line was the terrain model's own invention. The lake is narrow
  there: land lies 80 m north. Two north-shore waypoints (69.4527/17.6255 at 467 m
  and 69.4519/17.6324 at 500 m). No vertex on water: 4.24 km, +1049, −72, 39.4°,
  and the card went 1030 → 1050 m.

**Seven became prose.** Høgevardtjenn at 1378 m on both Høgevarde routes,
Omnatjørnane at 1066 m on Juklavasstinden, two unnamed tarns at 1379 and 1377 m
on Rasletinden, a second tarn at 1177 m on Store Blæ, one at 1068 m on
Surløytenuten and one at 946 m on Vassdalstinden. All `Innsjø`, none regulated,
all on lines the sources themselves follow. Each is now named with its height,
its length and how far offshore the line gets. Juklavasstinden's also fixed a
name: the register spells them **Omnatjørnane**, not Omnetjørnene, and the
guide's «ryggen over Omnetjørnene» was hiding a 269 m crossing behind an
ambiguous preposition.

### The finding this pass created

Running the trail check with a network — the first run had done it offline —
surfaced Høgevarde/tempelseter: says «oppkjørt», and the line strays up to 573 m
from the mapped track, with 1081 m of 4782 beyond 250 m. It was **not** re-pinned,
and that is the interesting part. Storhornet was re-pinned because the mapped
thing was a named `piste:type=skitour` chain running to a cairn through a cabin
field — an actual route. What is mapped around Høgevarde is unnamed
`piste:type=nordic` loops (way 399105957, `piste:grooming=classic`, and way
444823421) and a `highway=path`. A cross-country loop is not obliged to reach a
summit, so a summit line leaving it is correct behaviour, not a defect. The
guide says the number out loud instead.

That left the check unable to ever return clean on a tour where nothing was
wrong. `check_water` has always softened to a note once the guide names the
height it crosses; `check_trail` had no equivalent, so it now does the same:
`states_gap()` looks for the worst-gap figure in the copy, within 15 m, and it
must carry a metre unit — a bare number anywhere in the prose is not a
disclosure. Seven cases cover the shapes that must not match: a degrees figure,
a bare number, a *moh* height, and a wrong value behind a thousands separator.

## The alpine-resort round

Eight peaks, on the fjells you reach from the five places people actually book a
week in: **Hemsedal, Trysil, Kvitfjell, Hafjell and Geilo.** The app goes from 78
tours to 86. Four new regions, and only one of them is named after a resort,
because — the Oslo round's finding again — the ski touring is not in the lift
system. It is on Hemsedalsfjellet, on Hallingskarvet above Geilo, on the ridge
across the Lågen from Kvitfjell, on Øyerfjellet behind Hafjell, and in the forest
above Vestby in Trysil.

The conditions are the ones the earlier rounds set, and the primary source is
split by area again. **Fri Flyt indexes exactly one of the five**: `skiturer-hemsedal`
holds seven route descriptions in the shape the Sunnmøre and Vestland rounds were
built on — toppunkt, høydemeter, kilometer, startsted, himmelretning, bratteste
punkt, KAST class, and for two of them a GPS position for the summit. For the
other four areas it is **ut.no**, which publishes an activity type, a season, a
grading, a stated distance and gain, a named chain of ground — and, through
`/api/gpx/trip/<id>`, the line itself. That track is new material for this
pipeline and it earned its keep four times below: it settles which of two tops a
tour goes to where the place-name register cannot, twice; it puts Nevelfjell's line
back on land; and it is what got Trysilfjellet rejected.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Prestholtskarvet | Geilo | 963 | 1860 | 955 | 11.4 | 22.0° | 25.2° | 3 |
| Kyrkjebønosi | Hemsedal | 722 | 1670 | 1002 | 4.6 | 20.6° | 26.8° | 3 |
| Nibbi | Hemsedal | 939 | 1740 | 803 | 3.0 | 20.4° | 23.7° | 2 |
| Slettind | Hemsedal | 1122 | 1592 | 474 | 2.5 | 18.6° | 20.6° | 1 |
| Ustetind | Geilo | 989 | 1376 | 413 | 4.1 | 9.7° | 20.5° | 2 |
| Bånsæterkampen | Ringebufjellet | 913 | 1196 | 331 | 2.8 | 13.9° | 20.5° | 2 |
| Ulvsjøberget | Trysil | 559 | 854 | 295 | 2.1 | 12.4° | 17.5° | 2 |
| Nevelfjell | Øyerfjellet | 828 | 1090 | 268 | 4.1 | 4.4° | 12.6° | 1 |

`check_new_corridors.py` re-queries all of it and comes back with one class of
note across the eight: five trailheads have a mapped road under them and no
mapped car park. That is what Eastern Norway looks like in OSM — a seterveg, a
grustak, a lay-by at a fylkesgrense — and each record says which way is under it
and quotes the source's own parking sentence. `check_routes.py` calls the 86
tours and 95 routes clean, and `check_tours.py` the 86 cards.

### Trysilfjellet was researched and rejected

Trysil's kommunetopp is 1132 m and has two published route descriptions on ut.no
— from Skihytta in the south (1112155778) and from Fageråsen in the north-west
(1112155777). **Both go up the alpine slopes.** The Skihytta one says so itself:
«Følg merket sti oppover i slalåmbakken». The Fageråsen one was checked against
Kartverket's terrain classes point by point along its own GPX, and six of sixteen
samples answer `Alpinbakke` — a continuous run from 938 to 1002 m, and again at
1092. Those are groomed pistes in operation all season.

Drawing a topptur line there sends a paying reader uphill into ski traffic in an
area with no uphill route, and no source describes any other flank. Inventing one
because the schema allows it is the thing this pipeline exists not to do. The
record is in `new_corridors.json` with verdict `reject` and the measurement is in
`measurements.json`; Trysil ships **Ulvsjøberget** instead, which is the highest
summit in the kommune with a published description that stays out of the resort.

### What the checks caught

**Prestholtskarvet's register point sits between two of its own tops, and the
tie-break gave the tour to the wrong one.** Hallingskarvet's plateau above
Prestholt carries two summits 650 m apart that climb to 1860.4 and 1857.5 m.
Against a published 1859 they miss by 1.4 and 1.5 m — a tie by any reading, and
`resolve_top` breaks a tie inside 2 m by distance from the register point, which
is 198 m from the lower one and 550 m from the higher. That rule is right; it is
the rule that settled Ranten, where two *different mountains* competed for one
name. It cannot settle a mountain whose register point sits between two of its
own tops, and the register knows no other Fjell or Topp name within 2 km of
either.

What settles it is ut.no's own line: its last vertex is 20 m from the higher top
and 660 m from the lower. `resolve_summits.py` now carries a `SUMMIT_SEED` table
— one entry, with the reason beside it — that replaces the register point as the
seed and the tie-breaker for a named peak. A peak not in the table resolves
exactly as before, which is why this is a table and not a rule.

**Nibbi's register point is 93 m below the mountain.** SSR has two Nibbi in
Hemsedal; the southern one reads 1647.7 m on DTM1 against a published 1741 and
sits 1.2 km south-south-west of the top, the northern 1567.0. Fri Flyt publishes
a GPS position for the summit — 155711.732/6766857.855 in UTM33 — which converts
to 8 m from the cell the summit search climbs to, so that is the `near`
coordinate. The climbed top reads 1740.3 against 1741.

**Kyrkjebønosi has a third top, and it is the highest.** The tour goes to 1670.5 m,
which is what both sources publish as 1671 and where ut.no's line ends. A top
940 m west measures 1675.0 — 4.5 m higher, named by nobody, and not on any
published route. The card carries the top the tour goes to and the record says
the other one is there.

**Nevelfjell crossed Nevelvatnet twice.** `check_ground.py` found the first line
180 m out on the lake at 904 m, up to 94 m from the mapped shore, with five
vertices answering `Innsjø`. Ut.no's own løype goes south and west around it —
61.19444/10.60069, 61.19522/10.59895, 61.19533/10.59739 and 61.19643/10.59393 all
answer `Skog` — and a waypoint on the south shore cut it to 90 m and 38 m, which
is not the same as fixing it. Two waypoints, south end and west side, took it to
none. The line is now 4.07 km with +268, and the guide names the lake.

**Bånsæterkampen is 5.9 m short, and it is the only card in this round that is.**
Ut.no gives 1202 m for the ridge's high point; the climbed cell reads 1196.1. Five
of the eight land within 1.5 m of their published height and two of those are
confirmed twice over — Slettind reads 1592.0 against Fri Flyt's 1592, with Fri
Flyt's own GPS position 2 m from the register point and 3 m from the climbed
cell, and Nevelfjell 1090.1 against 1089 with the register point 60 m away.

**And the merge reverted thirteen settled tours.** `merge_corridors.py` rewrote
every record in `new_corridors.json` into `corridors.json`, including the ones
later passes had revised downstream — Breitinden lost the two north-shore
waypoints that took it off Breitindvatnet, Okla the two that took it off
Mjølkskåla, Storhornet's waypoint went back 1.4 km off the mapped winter route,
and Gyranfisen's `hazardNotes` reverted to the «vestsida stuper mot Vidalen»
sentence its own flank probe had refuted. Caught in the diff, restored from HEAD,
and the script now merges only slugs not already present unless you name them —
the same `[slug …]` rule `generate_routes.py` and `emit_new_tours.py` already
follow, and for the same reason.

### What the flank sweeps found

All eight summits were swept on eight bearings with `flank_probe.py` before a word
was written, and two were swept again further out. The readings are in
`measurements.json`.

- **Prestholtskarvet's cliff is on the side you came up.** Every bearing is under
  10° for the first 400 m — it is a plateau — and the intuition that the drop must
  therefore be on the far side is wrong. North measures 2.0° mean out to a
  kilometre and a half with a steepest 60 m window of 6.6°: the skarv just keeps
  going. South-east reads 66.0° in the window 1225–1275 m out, south 51.1° at
  925–975, south-west 49.3° at 475–525. That is the wall above Prestholt, and
  Prestholtskardet is the one break in it.
- **Slettind's published hazard note points at the gentler side.** Fri Flyt warns
  «Skredterreng nord for toppen, så ikke dra for langt til skikjørers høyre i
  starten av nedkjøringen» — and north does measure 24.9° in its steepest 60 m
  window 100–160 m out, which is real. But the serious terrain on this mountain is
  the other hand: west 23.9° mean with a 52.5° window 660–720 m out, south-west
  23.6° with 49.5° at 360–420, both dropping into Mørkedalen. The guide gives the
  warning as written and says what is on the other side of it.
- **Kyrkjebønosi's cornice side and its alternative descent are the same side.**
  North-east measures 33.0° mean with 48.0° in the window 0–60 m out, east 28.9°
  with 46.0° at 10–70. That is the renne toward Trøimsbotn that Fri Flyt gives 500
  metres of «bratt og fin skikjøring» and warns about in the same breath, and it
  is where «toppskavl» means something. West and south-west measure 11.3° and
  12.3° — the big white flank the standard descent uses.
- **Bånsæterkampen's ridge is exactly as advertised.** South-east 25.5° mean with
  45.2° in the window 30–90 m out, south 23.0° with 39.8° at 40–100, east 21.0°
  with 38.0°. North-east, where the route comes up, measures 6.3°, and west 3.9°.
  Ut.no's «bratte stup mot sør» is a measurement, not a flourish.
- **Ulvsjøberget's one steep thing is 400 m from the route.** South-west measures
  23.9° mean with a 49.2° window 330–390 m out — that is Stygghammeren, the
  «bratt, usikret fjellhylle» ut.no tells you to visit at your own risk. The
  ascent comes from the south-east, which measures 5.0°.
- **Two mountains have no steep side at all.** Nevelfjell's steepest 60 m window
  in any direction is 19.3° and its west side measures 3.4° mean; Ustetind's is
  28.9° to the south-east and nothing else clears 28. Their guides are about
  distance, flat light and open water under snow, because that is what those
  mountains are.

### The eight guides

All eight have a guide in bokmål and English — nynorsk for the three Hemsedal
tours, which is what the kommune writes and what Skogshorn's teaser already
used — written against `guide_brief.py`, the corridor research and the sweeps.
They pass `check_guides.py` clean, as do the other 78 after the run, and
`test_check_guides.py` still pins the reassurance rule in both directions. The
Norwegian and English versions were compared number by number and agree.

The writing pass then read its own material adversarially, and corrected three
things in it:

- **Nibbi's waterfall is not mapped.** The guide said «det er fossen i
  Nordrestølbekken» as a statement of fact. There is no waterfall node in OSM and
  no fall in the register anywhere on that hillside; what is there is the stream,
  named in both, and it is the only named stream the line passes. The
  identification is an inference from the stream, and both languages now say so.
- **Prestholtskarvet's two starts are 579 m apart, not 1.7 km.** The draft
  explained the difference between the card's climb and ut.no's 855 m as «de 1,7
  kilometerne og drøye hundre høydemeterne», and the straight-line distance from
  the Havsdalen car park to the top of the lift is 579 m — 107 vertical metres,
  and 1531 m along the routed line before it reaches that level. The sentence now
  names the two starting points instead of a distance between them.
- **Slettind's rv 52 sentence was written as a source's claim.** No source says
  the road closes; it is a property of the pass. Reworded to «kan stengje eller gå
  i kolonne i uvêr».

Two guides are about mountains with nothing steep on them, and they say so rather
than reaching for a hazard: Nevelfjell's steepest 60 m window in any direction is
19.3°, and the copy is about Nevelvatnet under snow and about five kilometres of
løypenett that looks the same everywhere. Ustetind's is 28.9°, and its copy is
bergen365's three: hidden running water, wind slab above the treeline, and
terrain traps.

Three of the eight carry a season that no source states — Kyrkjebønosi,
Bånsæterkampen and Ulvsjøberget — and in all three the guide's forecast paragraph
says where the figure came from instead of leaving it to look sourced. That is
the Surløytenuten rule from the Oslo round, applied three times in one round
because four of the five areas have no published winter description at all.

### What was left out

**Storeskardnosene (1502 m)** would have been a fourth Hemsedal tour and has
everything the others have — ut.no 116045 is a ski touring + topptur record with
707 m of gain and two documented starts, Feten in the north and Storeskardvatnet
in the south. It is left out only because three tours from one valley is already
the most any area gets in this round, and it is the obvious first addition next
time.

**Svarthetta (1553 m), Harahorn (1532 m), Leinenøse and «1609»** are the rest of
Fri Flyt's Hemsedal index. Svarthetta has a second source (ut.no 116746 and
hemsedal.com's Topp 20) and is a real candidate; the other three have one.

**Muen (1424 m) and Ramshøgda (1463 m)** are the good fjells on Ringebufjellet
near Kvitfjell, and neither has a published ski description. Muen has none on
ut.no at all. Ramshøgda has two, both barmark, both starting from a road on the
Atna side 45 km from the resort. Bånsæterkampen is 6.6 km from Kvitfjell and has
three descriptions; it wins on both counts and its own record says the
descriptions are summer ones.

**Skagsvola (932 m) and Fulufjellet's Brynflået** are the other two Trysil
candidates. Skagsvola is the most topptur-shaped thing in the kommune — a 1.6 km
ridge ending in a 600 m egg with 460 m down to Engersjøen — and its access is 7 km
of gravel and 4 km of skogsbilveg that nothing says is ploughed. Brynflået tops
out at 927 m on ut.no's own line, 120 m below Fulufjellet's Norwegian high point,
and the tour is a sherpa staircase into a national park.

## The popularity round

Four peaks, chosen by a question rather than by a map: **which are the most
popular ski tours in Norway?** That is answerable — the guidebooks say it out
loud — but only one area at a time, so the rule for this round is one sentence:

> a published source calls it the most visited or the most popular ski tour of
> its area, and the app does not already carry a tour on that mountain.

The second half of the rule is what makes the round small, and it is the more
interesting half. Run the question over the areas the app already covers and the
answer is mostly *already here*: Kirketaket, whose own card has called it «Norges
kanskje mest populære topptur» since the first 24; Nibbi, «Hemsedals mest gåtte
vårtopp»; Storhornet, «Oppdals mest besøkte topp»; Gaustatoppen, Melderskin,
Storgalten, Tromsdalstinden. The gap the popularity question exposes is **Troms**
— the app had three tours in the country's busiest ski-touring region, and none
of them was one of the two the Fri Flyt writers name as the most-visited.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Strandtinden | Harstad | 21 | 1076 | 1090 | 4.8 | 19.0° | 28.7° | 3 |
| Råskarfjellet | Hemsedal | 938 | 1610 | 685 | 3.3 | 20.1° | 24.0° | 2 |
| Kjølen | Troms | 224 | 790 | 578 | 4.1 | 12.6° | 24.9° | 1 |
| Rødtinden | Troms | 20 | 470 | 450 | 2.3 | 15.1° | 24.2° | 1 |

The sentences the round is built on, in the sources' own words:

- **Rødtinden** — «Vi våger påstanden. Dette er den mest besøkte toppen rundt
  Tromsø!!», Fri Flyt's route description, repeated in its «Enkle og fine
  toppturer i Tromsø».
- **Kjølen** — «En av Kvaløyas mest besøkte topper», ut.no 118113.
- **Strandtinden** — «Harstadområdets store klassiker, sannsynligvis det mest
  populære og kjente fjellet for toppturfolk fra Harstad og utenfra», Fri Flyt.
- **Råskarfjellet** — «en av de mest populære toppturfjellene i Hemsedal», Fri
  Flyt's «Tre anbefalte toppturer i Hemsedal», where mountain guide and
  guidebook author Jørgen Aamot also notes that it is usually called by its
  height alone, «1609».

The four standing conditions hold: a full published route description, a start
at a road, a second source, and every point resolving in the place-name register
and measuring on DTM1. `check_new_corridors.py` returns one note across the four
— Strandtinden's start, which is a stretch of E10 rather than a car park,
because that is what the guidebook says it is. `check_routes.py` calls the 90
tours and 99 routes clean, `check_tours.py` the 90 cards, and `check_ground.py`
the four lines — the last one only after it had moved a trailhead, below.

### What the checks caught

**Rødtinden is a named shoulder, and hill-climbing walked off it.** The register
point reads 469.5 m, Fri Flyt publishes 470 with a GPS position 3 m away, and
ut.no's line ends 8 m from it. But the ground under the name falls away in seven
directions and *rises* in the eighth: 479.6 m at 200 m out on a bearing of 315,
488.5 at 400, 491.0 at 600, and on without a saddle to Storbogtinden. The
unconstrained climb returned 488.2 m at 263 m out, which is not a summit — it is
where a 700 m tile ran out. `resolve_summits.py` now carries `SUMMIT_CAP_M`, a
table of how far from the seed a summit may sit, with Rødtinden's 150 m and the
reason beside it. This is the opposite failure to the one `SUMMIT_SEED` exists
for: there the register point could not say which top carried the name, here it
says exactly that and the terrain model has no top to offer.

**Kjølen's first line went 290 m out onto Finnvikvatnet.** The corridor started
at the mapped car park at the lake's east end, 231.6 m, and the router took the
short way across the ice at 229.0 m — terrain class `Innsjø`, no reservoir tag,
but nobody sends anyone over it either: ut.no's own start is on the *south* side
of the water, and the land east of it stands 25–35 m higher. The fix is the
start, not a detour. The trailhead is now ut.no's point, 224.2 m, with OSM
way/1154427451 (`highway=service`) 128 m away and the mapped car park recorded
640 m north. The line has no vertex on water at all, and the gain moved 575 →
578 m against ut.no's published 563.

**Strandtinden is registered under two other names, and its road is named after
it.** The register has no Strandtinden here: the top is **Strandstinden** (Fjell,
24 m from the resolved cell) and **Djupfesttinden** (Topp, 20 m). Fri Flyt files
the tour under «Harstad / Tjeldsund»; the summit and every name the route passes
— Heggedalen, Heggvatnet, Kvanntoa, Kvannto — are registered in **Lødingen**. The
E10 that runs under the mountain is `Strandstindvegen` in both the register and
OSM. The card keeps Harstad, which is where the day starts and how both sources
place the tour.

**And its two spot heights confirmed the corridor.** The route description
navigates by numbers off the paper map — «ei slukt ved høyde 505», then «forbi
høyde 570» — and those two points measure **509.6 m** and **570.3 m** on DTM1,
234 m apart on the line the text describes. That is the independent check this
corridor has instead of a GPX track, and it is why the record ships at
confidence `medium` rather than `low`: the trailhead is a stretch of road and
the bowl has no name in the register, but the two places the guidebook counts
from are exactly where it says they are.

**Råskardfjellet's flat is a hundred metres higher than the guidebook's.** Fri
Flyt puts the avalanche terrain «til 1300 moh» and a short flat above it. On the
routed line the flat is at 1378 to 1397 m, with 212 vertical metres left to the
cairn. The card carries the measurement. Its register spelling is
**Råskardfjellet** with a d, its published summit 1609 measures 1609.8, and Fri
Flyt's own GPS position lands 8 m from the climbed cell.

### What the flank sweeps found

All four summits were swept on eight bearings before anything was written, and
the readings are in `measurements.json`.

- **Rødtinden's one steep thing is exactly where Fri Flyt says it is, and it is
  steeper than the number.** «Like før toppen mot SØ er det heng med bratthet
  opp mot 40 grader» — the 135 radial, sampled every five metres, reads 36.3° at
  25 m out, 39.3° at 40, **50.4° at 55** and 45.9° at 60, then under 25° from
  75 m out. Over a 60 m window it is 33.1°. A tour whose whole route is under
  25 degrees has a fifty-degree step seventy metres from the cairn.
- **Kjølen is gentle in seven directions and not in the eighth.** North measures
  20.9° mean with 36.7° in the window 710–770 m out; the east side the route
  climbs and descends measures 9.8°. Ut.no's «ikke en topp for deg som må ha
  kvasse egger og bratte nedkjøringer» is a measurement.
- **Strandtinden has no gentle side.** No bearing measures under 17° mean out to
  a kilometre, and four of the eight carry 60 m windows over 50°: south 64.3° at
  10–70 m out, south-east 62.5°, east 54.9° at 20–80, south-west 56.0°. Even the
  north side the tour is famous for reads 41.8° in the window 20–80 m below the
  cairn. West is the flattest at 17.0°, and west is the ridge the route takes the
  summit from — which is what Fri Flyt means by «letteste vei til toppen er å
  holde høyre (vest)».
- **Råskardfjellet is a plateau.** South-east measures 0.6° mean, south-west
  −0.2° because the ground keeps rising, south 3.8°, north-west 2.6°. The only
  steep reading is 41.7° in a window 930–990 m out to the north, nowhere near the
  route. That is the mountain Fri Flyt describes when it says «dersom det er
  dårlig sikt, er det lite terrengformasjoner å orientere etter» — the hazard
  here is navigation, not slope angle.

### What was left out

**Ullstinden (1078 m, Tromsø fastland)** is the round's near miss. It was
researched twice — once to a resolved summit, and then again, harder, after the
round shipped. Both attempts are worth writing down, because the second one
answered every question but the one that matters.

The first attempt stopped on a name. The normal route «følger du den breie
ryggen sør for Hesjedalen», and there is no Hesjedalen in the place-name register
anywhere near that mountain. The second attempt found it: the valley is
**Hestedalen** (Northern Sami *Heastavággi*, SSR 69.77591/19.58890), and Fri Flyt
spells it wrong. A second source confirms it and the line — a different Fri Flyt
article by a different author, describing the same tour on bare ground: «Fra
start går du nordøst over et myrområde mot Hestedalen, før du følger ryggen i
retning av Svarthamartinden et stykke oppover. Når dalen flater ut, forlates
ryggen og du går i retning av Ullstinden.»

With the name in hand every landmark in both texts resolves. The car park is OSM
way/255323008 — 2660 m², `hiking=yes`, the only big one on Snarbyeidet, 133.2 m.
The bog the second source sends you across measures 166.8 m and answers terrain
class `Myr`. The broad ridge south of Hestedalen is continuous and rises evenly:
a perpendicular crest search from the car park reads 167 m at 500 m out, 270 at
1000, 414 at 1500, 577 at 2000, 743 at 2500 and 851 at 3000. The summit resolves
to 1092.4 m against a published 1078, which is the Storehorn case and no
obstacle.

**What does not resolve is the last two kilometres.** Ullstinden stands behind a
pass, and the wall on the near side of it was swept along its whole length — 21
latitudes from 69.7860 to 69.8060, eight points across at each. The steepest
gradient reads 31 to 54 degrees on every one of them from 69.7890 north to
69.8060: 53.8° at 69.7910, 53.5 at 69.7920, 53.8 at 69.7930, 51.1 at 69.7990,
46.7 at 69.8000. Four corridor variants were routed across it. All four give back
192 to 345 metres of height, and all four carry a steepest 30 m step of 35 to 39
degrees.

Three latitudes read under 27°, and they are the trap. At 69.7860, 69.7870 and
69.7880 the sweep says 21.4, 21.7 and 26.1 degrees — but those three do not cross
the pass at all: they go over Stortinden. And the gentlest of them does not
survive being measured properly. Sampled every 119 m the traverse east off
Stortinden's north shoulder reads 26.1°; sampled every 22 m the same ground reads
980, 987, 989, 996, 992, 983, 978, 980, 959, 947, 933, 916 m — a **44.3° step**
between 980 and 959, and another 44.3° between 878 and 854 on the way down to the
saddle. The coarse spacing was averaging the wall away. That is the Vassfjellet
lesson pointing the other direction, and it is why the sweep was re-run before
anything was drawn from it.

Everything *below* the edge is exactly what the sources describe: from upper
Hestedalen to the shoulder the steepest step is 25.5° over 40 m, and the line
from the car park is even the whole 4.5 km to the plateau rim at 755 m. Fri Flyt's
«bratteste punkt 20–25 grader» is true right up to the point where the mountain
stops being reachable.

**And Stallvika, the obvious alternative, has no road.** The bay on the Ullsfjord
side sits below the one gentle flank Ullstinden has — from Stallvikskaret at
457.6 m the climb to the summit is 458, 501, 549, 614, 687, 773, 859, 906, 979,
1056, 1092 m over 1305 metres, monotonic, without giving back a metre. But in a
box spanning 19.560–19.700 E and 69.780–69.840 N, OpenStreetMap has no `highway`
of any class nearer the bay than a path 2845 m away, no `track` within 3469 m and
no mapped parking at all. The line up from the shore is steeper than the tour it
would replace, too: 458 m of climbing in 942, with a 45.6° step between 114 and
210 m. The mountain's gentle side faces a fjord nobody drives to.

Both sources say something else. The ski description gives the steepest point as
**20–25 degrees** and calls the mountain «et flott mål for nyfrelste toppturister,
og for de som ønsker et 100 % skredtrygt fjell», and the two published climbs —
980 m and «litt i underkant av 1000» — leave no room for 200 metres of give-back
(summit minus trailhead is 959). A drawn line with a forty-degree step on a
mountain sold as avalanche-safe is not an imprecise number; it is a line that
tells the reader something its own source does not. Either the route goes
somewhere neither the text nor the terrain model has shown us, or there is a
third trailhead. The record is in `new_corridors.json` with verdict `reject`, the
measurements with it, and the summit stays resolved in `peaks.py` — the next
person starts two questions further along than this one did.

**Storsylen (1762 m)** is «det mest populære toppturmålet i Sylan fra både norsk
og svensk side» on ut.no's own page, and it fails the road condition the
Patchellhytta pair failed: the described tour is nine hours round trip *from
Nedalshytta*, and the road in is not a winter road. Its summit has been resolved
in `peaks.py` since the second batch.

**Togga (1340 m)**, «det mest populære turmålet i Sogndal», was researched and
rejected in the Vestland round for a reason that has not changed: Fri Flyt
publishes two tours on it with two summit heights, the register has one Togga,
and the top its point sits on measures 1235.5 m — 30 m above one published figure
and 105 below the other.

### The four guides

All four have a guide in bokmål and English — nynorsk for Råskarfjellet, which is
what the app's three other Hemsedal tours already use — written against
`guide_brief.py`, the corridor research and the sweeps. They pass
`check_guides.py` clean, as do the other 86 after the run, `test_check_guides.py`
still pins the reassurance rule in both directions, and the two languages were
compared number by number: 87, 74, 82 and 71 figures per tour, and every one of
them appears in both.

The treeline scan is where the writing pass learned something the research had
not measured, and it says something different about each mountain:

- **Rødtinden's forest is birch with bog in it.** Kartverket carries forest to
  208 m and open ground from 218, but the class along the line alternates —
  `Skog` at 35, 80, 113 and 204 m, `Myr` at 53, 156 and 241. That is the belt a
  skier crosses in the first kilometre and a half, and it is why the guide says
  the treeline is a band rather than a line.
- **Kjølen is above the treeline from the car.** The last forest vertex is at
  218 m, forty metres along the line, and every one of the fourteen samples above
  it answers `ÅpentOmråde`.
- **Strandtinden's last sample before the summit is glacier terrain.** The vertex
  at 1023 m answers `SnøIsbre` — perennial snow on the side Fri Flyt says holds
  its snow into June, and the same class an independent probe returned 991 m up
  the north-west radial. The guide names it; nothing else on the line carries it.
- **Råskardfjellet's forest stops at 1115 m** and open ground starts at 1133,
  which brackets the 1130 the corridor research read off a straight-line probe.

One figure had to be recorded before it could be written: Fri Flyt's «Følg RV52
vestover fra Hemsedal sentrum i 19,5 km» lived only in the trailhead's OSM
evidence, which is not one of the sources `check_guides.py` reads, so the drive
distance came back unsourced on the first run. It is in the tour's `corrections`
now, which is where a quoted published figure belongs.

### The four, read adversarially

The section above ended by naming the gap: the pass that wrote these four guides
was the pass that checked them. This is the independent read that closes it, run
the same way as the Trondheim and Vestland ones — every compass claim re-derived
as a bearing from the corridor and the routed line, every flank figure re-taken
from the DTM1 *point* API rather than the raster the sweeps used, terrain classes
re-queried, the sources re-read for what they actually say, and the two languages
compared number by number.

**It moved a line, and it found a hole in a check.** One tour of the four had
copy that pointed the reader somewhere the mountain does not go; two had figures
that were right about the mountain and wrong about where on it; and one claim on
a fourth had never been tested at all, because the pattern that was supposed to
test it could not see a compound noun.

**Strandtinden was climbing the side its own source warns about.** The guide said
the route «tar toppen via vestryggen», and the corridor's last waypoint was named
«Vestryggen mot toppen» — but that waypoint sat on a bearing of 60 from the
summit, and the line came up the last 519 metres pointing 222. It was on the
north-east rib. Fri Flyt could not be clearer about which side it means: «Letteste
vei til toppen er å holde høyre (vest) fra nå og bestige toppen via ryggen fra
høyre (vest). Det er helt klart mulig å gå opp på andre siden, men **den er mer
eksponert**.» The line was on the more exposed one, and the copy had inherited the
error from the corridor and then dressed it in the right word.

The north-west ridge is real and the point API measures it: 1039.8 m at 150 m out
on a bearing of 300, 1011.5 at 250, 969.3 at 350, 952.3 at 450, 956.8 at 550 and
886.0 at 650. The rib beside it reads 1010.2, 956.2 and 908.5 at 150, 300 and
500 m — steeper the whole way. Four waypoints now take the line west along the
bench at 806 m and up the crest, and the last 600 metres bear **135** instead of
222. Going round costs what going round costs, and the guide says so: 4.77 →
5.86 km, gain 1090 → 1156 m, height given back 35 → 101 m, steepest step 28.7 →
29.1°. The card went with it — `verticalM` 1090 → 1160 and the duration band 4–6
→ 5–7 t.

**And the snow on that face is in the terrain model.** The north side reads
`SnøIsbre` from about 1050 m downwards — on a bearing of 340 from 40 m out, on 0
and 20 from 60 — continuous to at least 200 m. Every one of the sixteen vertices
in the line's last 500 metres is `ÅpentOmråde`: the ridge is bare ground beside a
permanent snowfield, which is also why Fri Flyt can promise midnight-sun skiing
there in June.

**Rødtinden's steep step is real, and it is not where the copy put it.** The guide
quoted the raster sweep sampled every five metres — 39.3° at 40 m out, 50.4 at 55,
45.9 at 60. Re-read from the point API every ten metres, the radial runs 469.6,
467.7, 464.6, 459.5, 452.7, 448.8, 437.0, 430.6, 426.6 m: the fifty-degree step
reproduces (49.7° between 50 and 60 m) and the 39.3 at 40 does not — that ten
metres reads 21.3°. This is the Vassfjellet lesson again, where a figure was
quoted across two resolutions. The copy now carries the point-API profile and the
one window it can defend, 32.3° from 20 to 80 m out. Its east flank moved too: the
steepest window is 28.6° at **50–110 m**, not 29.4° at 20–80, and the guide now
says that the east side's steep ground sits further from the cairn than the
south-east's, which is what makes it easier to wander into.

**Kjølen's guide overstated its own source and quoted the wrong radial.** Fri Flyt
does not call the Finnvikdalen start the shortest of its four; it calls it «et
litt kortere alternativ med mindre stigning», and the guide now quotes that.
The descent was described as «østover» against the east radial's 9.8°, where the
bearing from the summit to the start is **62** — between east and north-east, and
the guide now gives both radials, 9.8 and 10.0. Its north flank re-measures 35.5°
at 720–780 m against the sweep's 36.7 at 710–770. Two things the read confirmed
rather than corrected: the radar is OSM node/11190896274, «Stor-Kjølen Radar», 46 m
from the summit cell, and the hut is way/175567108, «Varmebua på Kjølen», 41 m from
it. And one thing it added, because the source leans on it and the copy did not:
Fri Flyt puts the best skiing on this mountain on the *other* two routes, «der
siste del nedover Finnlandsfjellet bare er å nyte i store og herlige svinger». This
is the short way up, not the finest way down.

**Fri Flyt's «vatn 395» on Kjølen cannot be pinned.** The route description
navigates by it; the register has no named water in Finnvikdalen but Finnvikvatnet
itself, and the line passes 395 m on open ground 294 m from the nearest mapped
tarn. The corridor is in the valley the text describes, and that is as far as the
evidence goes. It is recorded as a measurement rather than resolved.

**Råskardfjellet came through.** Its river crossing is where the guide says it is
— terrain class `Elv` at 926.1 m, 224 metres along the line, one vertex wide — and
both flank figures reproduce on the point API: north 41.1° at 940–1000 m against
the sweep's 41.7 at 930–990, east 26.1° at 60–120 against 27.0. The two figures
were re-rounded to the point-API values.

### The check that could not see a compound noun

`check_ground.py`'s trail test only runs on a tour whose guide promises a prepared
line, and `TRAIL_WORDS` decided that with `\b(løype|løypa|…)`. There is no word
boundary inside a Norwegian compound, so **«lysløypa» never matched** — and
Rødtinden's whole first kilometre is that claim. The pattern now allows a prefix,
which brings three guides into the check that were outside it: Rødtinden and
Geitgaljen («lysløypa») and Vassfjellet («skiløypene»).

Rødtinden then passes on the measurement rather than on silence: OSM has 741 ways
in the corridor, 68 of them `piste:type`, a mapped trail reaches the trailhead at
6 m and the summit at 1 m, and the line never strays more than **56 m** from one.
Geitgaljen came back `UNCHECKED` — Overpass would not answer for it — which is the
right answer and the one the old pattern could not give.

## The eight, read adversarially

The alpine-resort round was written and checked by the same pass. That gap is
closed here, run the way the Trondheim, Vestland and popularity rounds were:
every band and step re-derived from the shipped line with the pipeline's own
definition but an independent implementation, every flank figure re-taken from
Kartverket's **point** API rather than the raster the sweeps used, the compass
claims re-derived as bearings, and the two languages compared number by number.
`adversarial_probe.py` is the tool; it prints measurements and knows nothing
about what the guides say.

**It found one thing, and the thing is not about these eight.** The figures in
these guides were right when they were written and are not right now, because
the line moved underneath them.

### The re-route in #62 left the prose behind

«Kontosida og forsida tåler en telefon, og ruteren kan se stien» taught the
router to follow mapped trails. That moved twenty-odd lines. Some guides were
re-derived against the new geometry and some were not, and nothing reported the
ones that were not.

The scale, measured against the lines the app currently ships:

- **27 opening figures** — the distance and the climb in the first sentence of a
  guide — disagreed with the route they describe. Molden and Melshornet were out
  by about 300 metres, Besshø's climb by 23. Every one of them matched the value
  the line had before #62 exactly, which is what identifies the cause rather
  than guessing at it.
- **Band and step figures** in five of the eight: Prestholtskarvet, Kyrkjebønosi,
  Nibbi, Slettind and Ulvsjøberget.

**Prestholtskarvet had drifted furthest.** Its whole band table was the old
line's — 22,0° from 1500 to 1600 m over 225 metres of ground, where the line now
gives 17,6° over 315 — and its steepest step, «25,2 grader mellom 1514 og 1535»,
measures 19,7° on the line that is there now. The real steepest step moved down
the mountain, to 24,8° between 1323 and 1344. The guide had also started
contradicting itself: the intro said the 1200–1300 band is 1,3° over 5130 m and
the ascent said 1,2° over 5221, which is the same band twice, because the intro
had been updated and the ascent had not.

**Nibbi said the wrong band was steepest.** «Bandet frå 1300 til 1400 moh er det
brattaste på turen med 20,4 grader» — but that band measures 20,8°, and the
1200–1300 band measures 21,4°, which the guide's own intro already said. Two
sentences in one guide, disagreeing about which part of the mountain is steepest.

**Slettind is the one that looks like nothing.** It quoted 16,1° for the
1300–1400 band and 16,1° for the 1400–1500 band. The second is correct. The
first is the old line's figure, and it survived a reading because it happened to
round to the same number as its neighbour.

All of the above is corrected against the shipped line, in both languages.

### The check could not see it

`check_guides.py` accepts a km figure if it lands within 150 m of **any** value
in the facts or the notes. That tolerance is there for a reason — «1,4 km
eksponert rygg» is a sourced distance that is not the route's length — but with
several hundred numbers in scope, the set is dense enough that almost any
plausible figure is within 150 m of something. The route's own length was, in
practice, unchecked.

The fix is not a tighter tolerance on the same test. It is a different test,
tied to the one value the figure is a measurement of, and it lives in
`lib/guides.test.ts` so it runs in CI rather than in a script somebody has to
remember to run: the distance and the climb stated in each intro must match the
route the app draws, and the two languages must state the same numbers.

It is also visible to readers now. The figure on a tour page prints the line's
real distance in its caption, directly under prose that used to state a
different one.

### Confirmed rather than corrected

Slettind's flanks reproduce on the point API within a few tenths — west 23,9°
average out to a kilometre against the guide's 23,9, north 11,1 against 11,0,
south-west 23,7 against 23,6 — and its 22,5° step between 1527 and 1546 m is
exact. Nibbi's 21,4° steepest band over 224 metres of ground is exact once
measured with the pipeline's definition rather than a plausible substitute for
it. Ustetind, Bånsæterkampen and Nevelfjell came through with nothing to change.

Two of the round's compass claims were re-derived and hold: Slettind's route
name says the north-west flank, and the line climbs on a bearing of 138–142,
which is that flank; Ustetind's card says north, and the line climbs on 154.

### Still open — and then worked

The same scan flagged **15 further band claims outside these eight** — Okla,
Folarskardnuten, Grafjell, Høgevarde, Kvamshesten, Kvitegga, Melshornet, Ranten,
Storhornet, Torvløysa, Vassfjellet, Ytstevasshornet, Glitregga. Several looked
like the extractor pairing a ground figure with an angle from a neighbouring
clause rather than a real defect, and telling those apart takes the same
sentence-by-sentence reading these eight got.

The next round did that reading — see "The second reground" below. The scan
itself was rebuilt band-tied (every «A° fra X til Y moh» claim re-derived
against its own band with `bands()` and `steepest_span()`, the functions the
guides were written from) and run over all 91 guides in both languages. Of the
15, Kvamshesten and Kvitegga dissolved as extractor artefacts — their figures
reproduce on the line — and the other 13 tours were genuinely stale. The full
sweep found the same #62 drift in 17 more guides the original scan never
reached, 30 in all, every one verified against the pre-#62 geometry before it
was touched. All are corrected; the scan comes back with artefacts only.

## The second reground: the variants the first round's strings missed

`reground_guides.py` (this round's edit list replaces the first round's in the
file; the first is in git) closed out the #62 drift the exact-string round left
behind. Exact strings miss variants: the same stale figure often stood twice in
one guide — once in the sentence #71 fixed and once in an intro or avalanche
body phrased differently. Bånsæterkampen's intro still carried «brattaste steg
20,5 grader mellom 961 og 978» while its ascent, three paragraphs down, had
been corrected to 22,1 between 986 and 1000.

Where a superlative's *identity* moved, the sentence was rewritten rather than
renumbered, in both languages:

- **Okla's steepest band is 700–800 m in the birch forest**, not 1000–1100 on
  the shoulder (20,6° there became 15,1). The shoulder paragraph now states its
  own band without the superlative, and the intro carries the identity.
- **Tromsdalstinden's steepest single stretch is in the slope up to Salen**
  (26,3° between 547 and 569 m), not on the upper ridge — which is the slope
  its avalanche section already told the reader to respect, so the prose now
  agrees with itself.
- **Storhornet's steepest step moved from the forest at 826–842 m up to
  1463–1480 m** below the shelter, and its whole band ladder shifted a tenth.
- **Rana's steepest hundred is 1200–1300 m on the climb to the arête** (the old
  claim of 21,0° for 1000–1100 measures 12,3 on the line that follows the
  trail), and its summit-crest step reads 38,0 between 1530 and 1554.
- **Glittertinden's steepest band moved from 1400–1500 to 1600–1700 m** with
  the line's move onto the marked-path side of Steinbudalen's north flank, and
  its max-angle claim of 19,6° measures 18,5.
- **Kråkfjellet's steepest place is the forest-road pitch at 467–480 m**, not
  659–670; **Storbekkhøa's step dropped from under the ridge to the birch
  forest at 661–683 m**; **Store Bles 35,2° span kept its angle and moved 100
  height-metres down the summit slope**; **Melshornet's steepest band is now
  400–500 m**, below the treeline figure its caption had to correct too;
  **Vassfjellet's «all the steep in one band» became two near-equal bands**;
  **Skarenes top two bands now tie**, and the sentence names them both.

Two things had to be true before any of it was edited. First, `guides.json`
had drifted behind the shipped files — the #71 opening-figure fixes lived in
`lib/guides.ts` and `content.ts` but not in the JSON — so the shipped prose was
read back into `guides.json` first (54 fields), or re-emitting would have
reverted those 27 corrections silently. Second, every stale claim was matched
against the pre-#62 line and reproduced it exactly, which is what identifies
drift rather than a wrong measurement.

The same round ran `check_ground.py` over all 91, which came back with one
finding: **Kvamshesten's line is on the ice of three natural tarns** —
Skaravatnet ~244 m at 715 moh, an unnamed tarn 58 m at 726 in the pass,
Grunnevatnet ~262 m at 785, measured against the point API's terrain classes
at 3–4 m steps — while the prose read «held nordsida av vatnet ... rundar
Grunnevatnet», as if the line stayed on land. None of the three is regulated,
so by the same reasoning as Styggemann and Folarskardnuten the missing sentence
was the defect: the guide now states the crossings with their lengths and how
far offshore the line gets, in both languages.

The proof is mechanical and it all comes back clean: the band-tied scan over
91×2 guides (artefacts only — fall-line radials, flank sweeps, a reversed
descent span), `check_guides.py` 0/0, `check_tours.py` clean, `check_routes.py`
clean, `check_ground.py` clean, and the CI suite including the intro-figure
test.

## The Bergen round, researched

Bergen is the largest hole in the map: the nearest tour is Vesoldo, 43 km out in
Hardanger, so a city of 290 000 people has nothing inside an hour's drive.

`bergen_research.json` holds step 1 and step 2 for closing it — candidates with a
published ski-touring description, and every summit resolved against the
place-name register and the terrain model. **Nothing from it ships.** No corridor
is drawn and no line is routed, so no tour in `lib/tours.ts` comes from this file.

Fri Flyt indexes Bergen the same way it indexes Hemsedal — `skiturer-bergen`,
with toppunkt, høydemeter, startsted and an OPP/NED description — and lists
**Gullfjellet, Såta and Skrott**. ut.no adds **Tveitakvitingen** as an explicit
skitur. The other Kvamskogen hits are fottur with a summer season, and describing
a summer path as a ski route is what this pipeline exists not to do.

Three of the four summits resolve to their published height exactly, and two of
those reproduce the published climb to within 2 m from the resolved trailhead.
The fourth is the interesting one:

**The register's «Gullfjellet» is not Gullfjellstoppen.** It sits at
60.37313/5.58038 and reads 909,56 m against a published 987, and the highest
ground within 700 m of it is 924,83. The summit is 1,7 km north-north-east, at
60.38756/5.59037, where the raster reads 987,37 and the point API 986,8 — the
published figure. A tour pinned to the register point would put Bergen's own
mountain 62 m too low and 1,7 km from where it is. That is the Kjerag and
Storhornet finding a third time, and it is worth stating plainly: on this
evidence the register point is a name, not a measurement.

### Gullfjellstoppen is routed, and the first line ran on water

The corridor is traced off the mapped ways: trailhead to Redningshytta to the
summit is connected on OSM at **7 750 m**, against ut.no's stated 8,2 km for the
same route, and every element of Fri Flyt's description reproduces on it. The
road passes 538 m south of Svartavatnet, so «til høyre for Svartavatnet» is
right — the straight-line reading that made it look wrong was the reading, not
the source. Redningshytta measures 596,5 m against «600 moh», and the «liten
unnabakke» east of the hut is a real 25 m dip.

The router solves it at 7,35 km, +783 m, max 25,8°, and the line is not
publishable, because **it runs on water**: over Osavatnet at the start, over
Svartavatnet, and over a tarn at 766 m.

That is the router doing what it says it does. Its docstring: *«sea is
impassable; frozen lakes are not (this is a winter product)»*. Flat water is the
cheapest ground Dijkstra knows, so given a lake beside a road it takes the lake.
Twenty-three waypoints pinned along the road at 180 m spacing did not clear it;
the line cuts between them.

**The assumption is an inland one.** Osavatnet is at 307 m on the coast at the
latitude of Bergen — a city Fri Flyt itself calls «ikke den mest snøsikre byen» —
and Svartavatnet is `InnsjøRegulert`, a regulated lake drawn down in winter,
which is precisely the hazard that forced the Kråkfjellet and Rensfjellet
re-routes. Ice cannot be assumed here the way it can on a February plateau in
Jotunheimen.

### The router got the water cost

Of the two ways out, tracing the road only fixes the ground a road exists on —
and this line also crossed a tarn at 766 m, where there is no road to trace. So
the router got the fix, as `avoid_water=`, opt-in per corridor and never a wall.
A corridor that genuinely wants the ice keeps it: Besshø spends three and a half
kilometres on Bessvatnet on purpose, and nothing about that changes.

**Finding the water needs no new data source.** A 1 m terrain model renders a
lake as the plane it is, and nothing else in Norwegian terrain is flat to within
a few centimetres over a hectare. On a 5 m grid the five largest flat regions
around Gullfjellet came back Innsjø, Innsjø, InnsjøRegulert, InnsjøRegulert and
InnsjøRegulert — five for five against Kartverket's own classes.

The thresholds are tuned at the resolution the router actually works at, which
is about 9 m per pixel, not at the resolution the idea was tested at. That
mattered: a mask catching only flat *cores* missed every shore and every narrow
arm, which is exactly the ground a shortcut clips, and it moved the line not at
all. At `eps 0,30 m`, `min 120 cells`, dilated 2, the mask catches **7 of 7**
water vertices on the offending line, **29 of 30** randomly sampled masked cells
come back as water by Kartverket's class, and the mask is 3% of the grid.

With the flag off, the router is unchanged — verified rather than asserted: the
run immediately after the patch, before the corridor set `avoidWater`, produced
the pre-patch line to the metre (226 pts, 7,35 km, +783 / −103, max 25,8°).

### Cost is not enough: the line is taken off the water

The line came off Osavatnet, where it had run for the best part of a kilometre.
Going round costs what going round costs: 7,35 → 7,80 km, and the climb 783 →
830 m.

Cost alone did not finish it. It left **89 m of 7 514 m on water**, and rebuilding
the corridor at 50 m spacing along the two shoreline stretches only got that to
82 m. The reason is not the price of water; it is the resolution of everything
around it. The routing grid is about 9 m per cell, a road along a shore is
narrower than that, smoothing rounds corners, and the line is resampled at 45 m —
so a leg between two perfectly dry vertices cuts the inside of a bend and lands
in the lake. Every remaining clip was a single vertex or a single leg with dry
ground **five metres away**.

So the correction goes where corrections of that size already go. `build()`
re-pins the trailhead and the summit after smoothing walks them off their marks;
`avoidWater` now also re-pins the line off the water, asking Kartverket's terrain
class rather than the router's flatness mask — the mask exists so Dijkstra can
price water without a network round trip per cell, and this pass runs once per
line, so it can afford to ask. Vertices on or against the shore move to clear
ground; legs are read every 2,5 m and get a dry vertex inserted wherever they are
wet; the two passes repeat until neither has anything left to do.

Three details were each worth a run of their own:

- **A failed lookup must not be cached.** An empty terrain class reads as dry, so
  one timed-out request pinned a vertex in the tarn for the rest of the run.
- **Dry is not enough; it has to be clear.** Coordinates are written to five
  decimals, about a metre, and the class boundary is a raster edge. One vertex
  read dry where the router put it and wet where the file recorded it. Four
  metres of clearance survives the rounding — with dryness accepted as a fallback,
  because between two tarns there may be no four metres to have.
- **The measurement has to be finer than the fix.** At an 8 m leg scan a 10 m clip
  survived; at 4 m a 9 m one did. The pass now reports what it could not clear,
  sampled at half its own step and on the rounded coordinates, so the number is
  measured rather than assumed.

**The line is 275 points, 7,80 km, +830 / −150 m, max 25,4°, and 0 m on water.**
Confirmed three ways: the pass's own readout, an independent sweep of Kartverket's
classes every 2 m (3 769 samples, 0 m), and `check_ground.py` against OSM's water
polygons (0 m). `check_routes.py` is clean — endpoints on their marks, no step
over 40°. `resample_dtm1.py` then re-read every vertex at 1 m, as it does for
every route, and the shipped figures are **+839 / −159 m, max 27,4°**.

### Gullfjellstoppen ships

The guide is written in both languages and the tour is live: 91 tours, 100
routes, 91 guides. Four things about it are worth keeping.

**The card's vertical is 839 m, not the 700 the source gives.** Fri Flyt's 700 is
about summit minus start (987 − 307 = 680); the card carries cumulative ascent,
and the line gives back 159 m along the way. ut.no states «800 høydemeter totalt»
and 8,2 km for the same route, against 839 m and 7,80 km measured — which is the
corroboration that matters, since it is the only other source that walks this
start.

**It is the gentlest tour in the corpus.** No 100 m band averages more than 8,1°,
and the steepest sustained section is a single 27,4° step between 709 and 727 m.
That is not a reason to relax about it: the summit dome is flat and the ground
under it is not. Measured from the cairn, north falls 45,8° at 30–90 m out,
north-west 61,2° at 90–150 m and west 59,0° at 200–260 m, while the south side —
the ascent — averages 4,9°. A gentle dome over steep sides is the shape that
punishes a bearing error in cloud, and that is what the guide's summit paragraph
is about.

**There is no avalanche forecast for this mountain.** NVE's
`AvalancheWarningByCoordinates` puts the summit in **Hordalandskysten**, a B
region: «Ikke vurdert». The nearest A region is **Voss**, a different and more
inland range. The guide says so rather than pointing at a forecast that does not
cover the ground — the first tour in the corpus where that had to be said.

**The flank sweep went into `measurements.json`.** Five records: the eight-point
sweep at 20 m, the fine three-bearing sweep at 10 m that found the edge closer to
the cairn than the coarse one could see, the dip at Redningshytta, where the line
passes the named features, and the 0-of-7 803 m water reading. That is what makes
the guide's angles checkable — `check_guides.py` reports 0 unsourced numbers and 0
reassurance claims across all 91.

### Still to do

Three of the four Bergen candidates are still unbuilt. Såta needs land points at
Rosselandsbotnen and the innermost Eikedalen car park; Overpass timed out
repeatedly on that box during this round, and its trailhead should be pinned to a
mapped way the way Osavatnet's was, not read off a map tile. Skrott's description
has not been read in full. Tveitakvitingen's trailhead is unsettled and its
«preparerte løyper» unchecked against terrain class the way Trysilfjellet's were.
Each then wants a corridor, routing, measurement and two guides.

## The Kvamskogen round

The three candidates the Bergen round researched and left «ready to route» —
Såta, Skrott and Tveitakvitingen — built the way Gullfjellstoppen was, in one
new region: **Kvamskogen**, the massif all three stand on, an hour's drive from
Bergen. The app goes from 91 tours to 94.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Skrott | 272 | 1320 | 1068 | 5.0 | 17.4° | 28.2° | 3 |
| Tveitakvitingen | 382 | 1299 | 995 | 8.6 | 16.4° | 25.0° | 3 |
| Såta | 459 | 1260 | 895 | 6.6 | 18.4° | 32.5° | 3 |

The standing conditions hold with the same honesty rule the Oslo round set:
**Såta ships at confidence `medium`**, because Fri Flyt is the only full
description of the Eikedalen–Skeiskvanndalen line — westcoastpeaks and Peakbook
corroborate the mountain, the name Iendafjellet, the height and the ski use,
but from a different valley. Skrott is `high`: Fri Flyt's ski description and
ut.no 116438 cover the same line, and the guide quotes ut.no's own caveat that
the tour is primarily a hike. Tveitakvitingen is `medium` — ut.no is the only
full description, but the corridor is traced off **ut.no's own GPX line**
(api/gpx/trip/1112154404, 257 points, 8.86 km against a published 9.0), which
ends 8 m from the resolved summit.

### Tveitakvitingen's two hold reasons, settled

The Bergen round held the tour on a trailhead that did not resolve and a route
that «follows prepared pistes». Both dissolve under measurement. The register
has no Furudalen on Kvamskogen — the place is **Furedalen**, and the mapped car
park is «Furedalen alpin» (node/10261906575, 382.2 m). And the «preparerte
løyper» are mapped `piste:type=nordic` with classic/skating grooming along
Mødalsvegen the whole way to Mødal: sampled every 25 m along the GPX, only the
first ~100 m at the car park read `Alpinbakke` — the flat by the base area, ut.no's
own «gå ca 100 meter til Mødalsvegen» — and everything after is Skog and Myr.
Not the Trysilfjellet shape, where the line climbed 938→1002 m inside a piste.

One more thing worth writing down before someone conflates two tours: the
«Såta» this route climbs toward («opp mot Såta i bratte klyv») is the local
**802 m Såta south of fv. 7** (ut.no 1112771), not the app's 1260 m Såta on the
north side of Kvamskogen. The guide says so.

### What the register settled

- **Såta is registered as Iendefjell too** — both names on the same coordinate,
  which turns Fri Flyt's «som mange kaller Iendafjellet» from a claim about
  local usage into a register fact.
- **Skeiskvanndalen and Steinskvanndalen are two different valleys**, 3.4 km
  apart, both registered. Fri Flyt's ski line uses the former; westcoastpeaks'
  summer route («Steinkvanndalen», a spelling the register does not have) uses
  the latter. Without that distinction the second source looks like it
  contradicts the first.
- **Rosselandsbotnen's register point sits on the water** — 661.75 m, class
  Innsjø. The south shore reads Myr at 660.44, and that is the land point the
  corridor uses.
- **Håsete, not Høsete** (754.9 m, against Fri Flyt's «rundt 800 meter»), and
  the ski hut above it measures **1109.8 m** against Fri Flyt's «omtrent 1000
  moh» — westcoastpeaks' «the hut at 1100m» is the figure the terrain model
  sides with.
- **«Stoveveggen» and «Middagshola» are not in the register** near the route,
  fuzzy search included; the guide carries them as the source's names. ut.no's
  «Tjødnadalen» is registered **Tjørnadalen**.

### The water, twice wrong in opposite directions

The first solve ran both avoidWater corridors through the router's water cost,
and the flatness mask — built to find lakes — read the flat **bog** in
Skeiskvanndalen (551–557 m) as water: the line wove between mask cells, gave
back 165 of 967 m in zigzag, and the off-water pass scattered 495 vertices into
the wet legs. Bog is ordinary winter ground (the Styggemann rule), so both
tours were re-solved without the water cost.

Then `check_ground.py` caught the opposite error on the clean line: **360 m on
water at 551 m**, up to 102 m offshore — the valley floor holds two natural
lakes, one unnamed and one the register calls **Skeiskvanndalsvatnet**, and
without the water cost the router took them. Neither is regulated, but they lie
low and coastal an hour from Bergen, and Fri Flyt does not say which side the
flat approach takes — so by the same ice argument the round set on
Gullfjellstoppen, the corridor is pinned along the dry north-west side past
both, probed point by point (the south side stands in the water). Going round
costs what going round costs: +844/−43 became **+895/−94**, and the card
carries 900 against Fri Flyt's 800, which is roughly summit minus start.
`check_ground.py` now returns all three lines clean, 0 m on water.

### What the flank sweeps found

All three summits were swept on eight bearings before a word was written; the
readings are in `measurements.json`.

- **Såta's steep side is the one you climb.** The west flank measures 25.4°
  mean with 53.0° in the window 740–800 m out, and the north-west 22.2°/53.6°.
  Fri Flyt's «skred både opp og ned, og klipper» is a measurement. The
  southwest couloir between Såterindane — Fri Flyt's alternative descent —
  starts at 43.4° only 110–170 m from the cairn, and the guide carries the
  source's own instruction to pull right before the bottom of it.
- **Skrott's west side falls 49.0° only 10–70 m from the cairn**, and the
  south-west 45.4° at 160–220 m, while the north-west shoulder the route uses
  measures 7.0° mean. In flat light the two sides look alike from the cairn,
  and the guide's descent section is built on that contrast. Fri Flyt's ledge
  alternative from the ski hut gets its own warning quoted — hard snow,
  west-facing cornices — and westcoastpeaks' ice-axe-and-crampons note with it.
- **Tveitakvitingen has no steep side at all** — no bearing averages over
  14.2°, and the steepest window anywhere is 37.5° 690–750 m out to the
  south-west, off the route. Its guide is about the 17 km round trip, flat
  light and navigation on a plateau with few forms, because that is what the
  mountain is.

### The grades

`route_metrics.py` measures grade 2 on all three, and all three cards carry an
editorial 3, each with its reason recorded in `new_tourmeta.json`: what a slope
angle cannot see is Såta's wind-blasted skar (Fri Flyt mentions an ice axe),
Skrott's cliffs in the forest and 49° summit-block edge, and Tveitakvitingen's
17 km of weather exposure. The aspects are the measured ones (SV, S, NØ — no
source names any). Seasons: **jan–apr is sourced only for Tveitakvitingen**
(ut.no); Såta and Skrott borrow it from the same massif and their guides say so
— the Surløytenuten rule, twice more.

All three summits are in Varsom region **Voss (3031), an A region with a daily
forecast** — queried per coordinate, and worth stating because the round's
first tour went the other way: Gullfjellstoppen is in the B region
Hordalandskysten, and its guide has to say there is no daily forecast. These
three do not.

The proof is the usual battery, and it all comes back clean: `check_routes.py`
94 tours / 103 routes, `check_tours.py` 94 cards, `check_guides.py` 0 unsourced
numbers and 0 reassurance claims across all 94 guides in both languages,
`test_check_guides.py` 15 cases, `check_ground.py` clean on all three lines,
and the CI suite including the intro-figure test.

### Still open

The guides are sourced and verified against the terrain model — not against
anyone's experience of these mountains. A local reader per tour is still the
missing check, here as everywhere. And **Fuglafjellet**, Kvamskogen's highest,
has not been researched at all.

## The Voss round

The Kvamskogen round left one name standing: **Fuglafjellet, Kvamskogen's
highest, not researched at all.** This round researched it — and rejected it,
which is the honest half of what a research pass is for. Both ut.no trip
descriptions (116556 from Vending, 118830246 from Øvre Steinskvanndalen) are
summer fotturer with summer seasons; westcoastpeaks describes four summer
scrambling alternatives through the cliffbands and states outright that no
winter/ski route is formally described; and the mountain's own character in
every source — «mange stup», no public trails, crampons advised on autumn
snow — is the reason. A described summer line through cliffbands is exactly
what this pipeline exists not to draw skis over. Fuglafjellet stays off the
map until someone publishes a ski description.

What shipped instead is the rest of **Fri Flyt's skiturer-voss index** — the
same per-area shape the Hemsedal and Bergen rounds were built on. The index
lists five tours; the app already carried Storanosi, Lønahorgi and
Horndalsnuten, and the two it lacked are now built, in the region with the
largest ratio of published-to-shipped in the app. The app goes from 94 tours
to 96.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Finnbufjellet | 772 | 1357 | 619 | 4.4 | 13.2° | 23.3° | 2 |
| Vatnaknausen | 383 | 1302 | 979 | 7.5 | 13.9° | 21.9° | 2 |

### Finnbunuten, and a number that meant the opposite of what it said

Fri Flyt calls the mountain Finnbufjellet and quotes 1358 moh. The register's
Finnbufjellet point (Fjell, 60.88774/6.44335) reads 1330,8 in DTM1 — 27 m
short — and the highest ground in the massif, 1357,0 m, sits at
60.88067/6.44088, 22 m from the register's **Finnbunuten** (Topp). The
Kirketaket/Kyrkjetaket pattern again: the app bears Fri Flyt's name, the
summit search the register's, recorded in `peaks.py` beside the seed.

The fact box was wrong in a subtler way. Fri Flyt's «Høydemeter: 770» and the
Utemagasinet version of the same description («Skifjell for nybegynnere»,
588 høydemeter fra parkeringen på toppen av Halsabakkene) cannot both be
gains. The terrain settles it: rv13 passes 770 moh exactly where the
Halsabakkane hairpins level out at Sendo (60.90112/6.46437, 771 in DTM1), the
camping flat beside the road reads 766–779, and 1358 − 770 = 588. **Fri
Flyt's 770 is the starting elevation, not the climb** — the card carries the
routed 620. «Halsabakkene» is registered **Halsabakkane**, and the guide says
so.

The corridor itself is the sentence «ryggen på østsiden av Finnbujuvet og
Kvassdalen» read against the ground: the Finnbu streams (way/306514915,
way/306514882) cut ravines west of the ridge past the Finnbuene støl, and
Kvassdalen — the valley rv13 climbs out of, floor at 574–581 — lies deep to
its east. The ridge between them is the only ridge east of the ravine, it
meets the Myrkdalen-skisenter alternative on the shoulder at 1090 moh
(Fri Flyt's «etter en times gange»), and the eight-direction sweep says why
the sentence matters: N off the summit is a 2,7° plain, but W and NW fall
50,3° and 56,7° at their steepest — the «luftige partier» on the nordegg
that KAST 1 does not cover. The guide keeps the route and the warning in the
same paragraph.

### Vatnaknausen, and the road the first solve refused

Vatnaknausen is Fri Flyt's «panoramautsikt over Voss»-tour: toll road from
Selheim to the mapped «Tverberg car park» (node/7829590483, 382,7 moh), road
into Budalen, Nyestølen (the register holds 27 of them; this is the one at
60.64412/6.60230), straight north along the treeline (822 moh measured), onto
the egg west of Rjupetjørnane, and east over the plateau.

The first solve gave back 134 m: with a waypoint sitting 130 m off the
mapped road it crested a 773 m shoulder on the line of summer path
way/973320189 and dropped into Budalen. The actual road is the chain
**Tverrbergsvegen (way/322409601, fee=yes) south to the junction at 475 moh,
then the Øvraset road (way/707342766) east** — repinned along the mapped
geometry, the line keeps 979 of its metres and gives back 58, the road's own
dips. Same lesson as Gullfjellstoppen's lake, one layer up: the router
solves terrain, and anything the prose promises — a road, a shore, a løype —
has to be pinned from mapped ground, not gestured at.

The summit is the knaus the name promises. East off the cairn the mean is
−0,3° for 800 m — the plateau continues — but the steepest 60 m windows sit
40,6° just 50–110 m out east, 46,7° at 40–100 m southeast, 43,8° at
340–400 m northeast. In fog, flat-and-then-cliff is the dangerous shape, and
the guide's summit section is built on exactly those five figures. West-facing
the whole way (Fri Flyt sells the sunset descent), which the guide converts
into the timing hazard it is: what softens at four refreezes at sundown.

### The grades, the season, and the region

`route_metrics.py` measures 1 for Finnbufjellet and 2 for Vatnaknausen; both
cards carry 2. Finnbufjellet's is editorial with its reason in
`new_tourmeta.json` — KAST 1 covers the ridge, not the nordegg beside it or
the 50°+ west faces — and Vatnaknausen's measured 2 agrees with Fri Flyt's
KAST 2. Neither source publishes season months, so **jan–apr is borrowed from
the app's other Voss tours and both guides say so** — the Surløytenuten rule,
twice more. Both summits are in Varsom region **Voss (3031), an A region with
a daily forecast** — queried per coordinate.

The proof is the usual battery, all clean: `check_routes.py` 96 tours / 105
routes, `check_tours.py` 96 cards, `check_guides.py` 0 unsourced numbers and
0 reassurance claims across all 96 guides in both languages (it caught one
draft sentence quoting Fri Flyt's «tryggest spor mulig», which is a
reassurance claim whoever says it — reworded), `test_check_guides.py` 15
cases, `check_ground.py` 0 m on water and 0 trail findings on both lines, and
the CI suite — whose intro-figure test rejected «4,4 km» against a 4,366 km
line and got «4,37 km», working exactly as built.

### Still open

The guides are sourced and verified against the terrain model — not against
anyone's experience of these mountains. The independent adversarial read that
covers 90 of the 96 has not read these two (nor the four of the
Bergen/Kvamskogen rounds). Vatnaknausen ships at confidence `medium` on a
single full source; Finnbufjellet at `medium` with Fri Flyt corroborated by
Utemagasinet and prominent-mountains. And the winter state of the roads —
rv13 over Vikafjellet at the Finnbufjellet trailhead, the toll road's
ploughed extent above Selheim — is stated as the weather-dependent thing it
is, not asserted; a local reader would settle both in a sentence.

## The popularity round, continued

The first popularity round's rule — *a published source calls it the most
visited or the most popular ski tour of its area, and the app does not already
carry that mountain* — run again over the areas the map now covers. Three
candidates carried real claims and failed the standing conditions; two carried
real claims and shipped. The app goes from 96 tours to 98.

The three rejections first, because they are the rule working:

- **Istinden (Lyngen, 1495)** — «en av de mest populære» in Lyngsalpene per
  Fri Flyt, whose full description is also KAST 3 – Komplekst: crampons and
  ice axe as required equipment, glacier travel up «brearmen øst for
  Urdkjerringa», and a 35–45° summit chute where «skiene tas på sekken». The
  router only solves skinnable ground under its step cap, and a generated
  line has nothing honest to say about glaciers or booting a couloir. The
  claim is real; the line is outside this product.
- **Storsylen (Sylan, 1762)** — «det mest populære toppturmålet i Sylan både
  fra norsk og svensk side» per ut.no 1112181, which is a summer fottur, and
  the winter road ends in Stugudal, 14 km short of the winter-closed
  Nedalshytta (self-service quarters only; Fri Flyt's Sylan piece points at
  snowmobile transport). «A start at a road» fails.
- **Storfjellet (Narvik, 1633)** — Fri Flyt's «det optimale toppturfjellet»
  is praise, not a most-visited claim, and its description wants ice axe and
  crampons besides. Not researched further.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Varden (Småtindan) | Lofoten | 2 | 700 | 825 | 5.0 | 22.8° | 32.3° | 2 |
| Midtitinden | Bodø | 11 | 1060 | 1051 | 4.2 | 19.1° | 26.9° | 2 |

The sentences the round is built on: Fri Flyt's second Småtindan description
calls Varden «den mest populære toppturen på øygruppa», and its Midtitinden
page opens with the mountain as one of the most visited ski peaks around
Bodø. Bodø is a new region — the map previously had nothing between
Trøndelag and Harstad.

### Varden, and the lake the first solve skied across

The summit is the Hesten (Segla) pattern: the register carries both **Varden
(Ås)** and **Småtindan (Fjell)** within 30 m of the climbed cell — 700,5 moh
against a published 700 — and the resolver seeds on Småtindan because a bare
«Varden» never reaches Vågan inside SSR's first page. The massif's highest
point is a *different* peak, 732 m, 600 m south-west; the claims-tiebreak in
the summit search is what keeps the tour off it.

`check_ground.py` earned its keep again: the first solve ran **450 m along
Karlsvatnet at 12 moh** — an unnamed-on-the-line, coastal, sea-level lake
filling the valley south of the *regulated* Stor-Kongsvatnet (OSM relations
5312814 and 5312819). The land between them is a ~250 m neck at 68.226–68.228,
and the line is repinned over it at 29 moh with the router's water cost on:
0 m on water, and the guide names both lakes and the reason. The notch
«til høyre rundt» Ørntinden is measured too — 293 moh against the 398 m
knoll, about 50 vertical metres given back, which is most of why the tour's
gain (825) exceeds its net height.

The eight-direction sweep says what the summit is: NW 60,7° and W 53,8° at
20–80 m, E 49,3° at 10–70 m — a tind, not a hei, and Fri Flyt's own «kjøringen
begynner ca. 50 m under toppen» agrees with the measurement. Kolbeindalen,
where Fri Flyt warns of avalanche danger and a shooting range, lies one ridge
north of the line and stays there.

### Midtitinden, sea to summit

Every metre of the mountain is climbed: the mapped pull-off at Kleivberget on
rv80 reads 11 moh, the top 1059,5 — and the register's own Midtitinden point
reads 983,5, 75 m low and 190 m north-east of the summit, the Gullfjellstoppen
pattern again. Fri Flyt's route numbers reproduce rung for rung on DTM1: the
top cabin «Geilo, ca 50» reads 54,4; the military-route marking «ved 560» —
the line passes 536; the south-east ridge «ca 720» reads 728; «ca 900» reads
879; the turn onto the north-east ridge «ved 980» happens at 1026. The line
gives back two metres total, and its steepest sustained stretch is 26,9° —
Fri Flyt's «under 30 grader», confirmed rather than assumed.

The descent variants Fri Flyt grades from easy to demanding are measured
rather than waved at: NE towards Stordalen 69,2° at its steepest, S 56,7°
at 70–130 m from the cairn, SW 60,8°. The guide carries the numbers and the
sentence they add up to: choose by conditions, not appetite.

### The grades, the season, and the regions

Both measure grade 2 and ship at 2, in agreement with Fri Flyt's KAST 2 for
Varden and «under 30 grader» for Midtitinden. Neither source publishes season
months: both cards borrow jan–apr — Varden from the app's other Lofoten
tours, Midtitinden from the same latitude — and both guides say so. The
regions are queried per coordinate: **Lofoten og Vesterålen (3014)** and
**Salten (3016)**, both A regions with daily forecasts.

One `check_ground.py` finding is read and set aside rather than fixed: it
reports the Varden line 367 m off a mapped trail under a guide that says
«lysløypa» — but the guide's løype claim covers only the valley kilometre
(which lies on the mapped Damveien), and the strayed metres are the neck and
the upper flank, where no løype is claimed. The reasoning is in
`measurements.json` next to the sweep.

The proof: `check_routes.py` 98 tours / 107 routes, `check_tours.py` 98
cards, `check_guides.py` 0 unsourced numbers and 0 reassurance claims across
196 guide texts, `test_check_guides.py` 15 cases, `check_ground.py` 0 m on
water on both lines, and the CI suite — whose intro-figure test rejected the
card's rounded 820 against an 825 m line and got the measured figure, again
working exactly as built.

### Still open

The independent adversarial read now trails by eight: Gullfjellstoppen, the
three Kvamskogen tours, the two of the Voss round, and these two. Both ship
at confidence `medium` on Fri Flyt descriptions with the register and the
terrain model as the second witness. And the popularity question still has
areas left to ask in — Vesterålen's and Helgeland's most-visited names were
not settled this round.

## The backlog round

`newtours.py` has carried a registry of names since the second batch, and
eleven of them never got a corridor. This round asked which of the backlog
have full published ski descriptions and skinnable lines — and shipped the
two that do. The app goes from 98 tours to **100**.

One more name left the backlog by rejection: **Store Kjostinden (1488)**,
whose Fri Flyt description has a main ascent holding 35–45° between 1080 and
1340 moh and an east alternative up Rottenvikbreen — the Istinden conclusion
again, recorded in `new_corridors.json`.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Fastdalstinden | Lyngen | 123 | 1275 | 1271 | 7.3 | 19.5° | 25.5° | 3 |
| Togga | Sogn | 427 | 1204 | 780 | 2.6 | 22.5° | 27.5° | 3 |

Both seasons are published for once — Fri Flyt's own januar–mai and
desember–mars — so no borrowing rule was needed. Both summits sit in
A regions, queried per coordinate: Lyngen (3010) and Indre Sogn (3029).

### Fastdalstinden, and the reservoir in the middle of the tour

The start «parkeringsplass på Varto» resolved through a road name:
**Vardoveien** (gravel, `way/412108701`) leaves fv7920 at Rottenvik and ends
at 123 moh — Fri Flyt's «relativt smal vei ca. 1 km», beside the register's
Varto, and 1275 − 1160 = 115 confirms the start. The anleggsvei it becomes
is mapped to the dam at 515, and the dam is the finding: **Rottenvikvatnet
is a reservoir** (`relation/8271819`, water=reservoir; InnsjøRegulert,
513,0 moh). The corridor carried the water cost from the first solve, the
west-and-north-shore instruction is pinned on land (566 / 572 / 589 moh),
and the two water judges disagree by a hair worth recording: the router's
off-water pass reported 9 m left on water against Kartverket's terrain
classes — shoreline noise at the reservoir edge — while `check_ground.py`
against the OSM polygon measures 0 m.

The rest of Normalruta I reproduces: the flat «på 650 moh» measures 650 to
the metre, the little lake west of it is mapped, and the «liten
ryggformasjon» with its 30° spots holds 815 → 1070 on the line. The grade-3
card over a measured 2 is editorial with its reason recorded: 1270 hm and
6–8 hours is the Sæbyggjenuten scale, the stated hazards are «utløpsområder
og skavler», and Fri Flyt says of the south-side descent variant — in
unusually heavy words for a guidebook — that it «har vært skuddpunkt for
dødelige skredulykker». The guide quotes that sentence and does not draw
the variant; the eight-direction sweep (SW 51,6°, W 46,6° at their
steepest) backs it.

### Togga, and the summit search that walked off the name

The old registry resolution for Togga stood 280 m west of the name at
1235,5 moh — a bump on a ridge that keeps rising west-south-west without a
saddle (1282,5 at 590 m, 1354,0 at 990 m, 1438,6 at 2,2 km). That is the
Rødtinden shape: a named point on connected rising ground, where
hill-climbing has nothing to stop it. `SUMMIT_CAP_M` now carries
`togga: 150` with the reason beside it, and the capped search resolves
1203,8 at the register point (1202,6) against a published 1205. The guide
turns the same fact into the navigation hazard it is: west of the cairn the
mean is *negative* because the ridge climbs on — in fog, «following the
ridge» walks into bigger mountains, not down.

Everything else reproduces exactly: Brandhaugane (Haug, 426,1 — and
1205 − 785 = 420), Orraleiken «flater ut» at a measured 1042,3, the route
2,64 km against a published 2,7. The card's grade 3 over a measured 2 is
Fri Flyt's own warning made editorial: «på søraustryggen (normalvegen) er
det eit brattare parti der skiløparar har utløyst snøskred under opptur» —
the 800–900 band, measured 22,5° with the line switchbacking gentler than
the 33–35° fall line. Both guides carry that asymmetry explicitly: the
line's numbers are the track's, not the slope's.

The proof: `check_routes.py` 100 tours / 109 routes, `check_tours.py` 100
cards, `check_guides.py` 0 unsourced numbers and 0 reassurance claims
across 200 guide texts, `test_check_guides.py` 15 cases, `check_ground.py`
0 m on water on both lines (one partial-claim trail note read and set aside
in `measurements.json`, the Varden shape again), and the CI suite.

### Still open

Ten backlog names remain unbuilt, most for want of a published ski
description rather than research effort: istinden (Narvik), skjomtinden,
storsteinsfjellet, storsylen (rejected), fongen, trollhetta, blahoa,
storskrymten, englafjell, grubba. The adversarial-read gap now counts ten.

## Round four: Englafjell and Sandhornet

Two threads pulled at once: the last backlog name with a full published ski
description, and the Bodø region the popularity round opened with a single
tour. The app goes from 100 tours to 102.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Englafjell | Hardanger | 148 | 1200 | 1237 | 8.6 | 21.1° | 30.1° | 3 |
| Sandhornet | Bodø | 10 | 993 | 1021 | 5.0 | 21.3° | 32.5° | 2 |

**Trollhetta was checked and stays unbuilt**: ut.no's crossing over «hettene»
is a summer fottur and no ski turbeskrivelse was found — the same
missing-description reason that holds most of the remaining backlog.

### Englafjell, and the waypoint that was the corridor author's

Fri Flyt's Rosendal description resolved cleanly — Musland and its mapped
tractor road and path network, Såta (Ås, 651 moh — the north-west knoll, not
either of the two Såta tops further north in the kommune), the south ridge
651 → 869 → 1032 → 1126 → 1184 → 1199,9, monotonic, and Limomnen (Li, 889,2)
as the bowl the summit cornices overhang. The first solve gave back 307 m,
and 177 of them were self-inflicted: a «lia vestover» waypoint had pinned the
line over a 313 m knoll the source never mentions. The pin was removed, the
router found the natural valley crossing itself, and the give-back fell to
the terrain's own 185 — the correction is in the research record, because a
corridor author inventing ground is exactly what the audit trail exists to
catch.

The card's grade 3 over a measured 2 carries Fri Flyt's own framing:
«vanskelig», 35° on the easiest way, «skredutsatt terreng, vanskelig
navigering og utglidningsfare», skis on the pack in the forest, and a
NE flank falling 55,5° under the corniced summit ridge. And the region
matters: **Englafjell sits in Hordalandskysten (3033), a B region with no
daily forecast** — the Gullfjellstoppen situation, and the guide says so
instead of pointing at a bulletin that does not cover the ground.

### Sandhornet, sea to summit again

Fri Flyt's Horsdal route reproduces rung for rung: the farm at 13 moh, the
shore path at 0–28, the stairs ending where the ground levels at a measured
189 against the source's «190 moh», 463 against «450», 662 and 752 north of
point 592, and the top at 993,4 against a published 993. The mountain stands
in Gildeskål; the card keeps Fri Flyt's Bodø the way Strandtinden keeps
Harstad. The hazard is the interesting part: the source's warning is about
**runout zones in Stjerndalen** — the W and SV flanks under Isvasstinden,
which the register confirms stands just east of the line — not about the
track's own steepness (under 30° except a measured 32,5° in the last fifty
metres). The guide gives the runout crossing its own section, and the
eight-direction sweep explains the island-mountain edges: W 59,0°, NW 59,9°,
N 61,8° within 170 m of the cairn. The fully described Ravika route (a 40°
section between 920 and 840) is named as the variant it is and not drawn.

The proof: `check_routes.py` 102 tours / 111 routes, `check_tours.py` 102
cards, `check_guides.py` 0 unsourced numbers and 0 reassurance claims across
204 guide texts — after it crashed on a comma-separated elevation list and
got the corpus convention («869, 1032, 1126 og 1184 moh») instead —
`test_check_guides.py` 15, `check_ground.py` clean on both lines including
the trail claims, and the CI suite.

### Still open

Nine backlog names remain, all for want of a published ski description. The
adversarial-read gap counts twelve. Neither source publishes season months;
both cards borrow jan–apr and both guides say so.

## Round five: Tomskjevelen, and Helgeland on the map

One tour, one new region, and the last empty stretch of coast between
Trøndelag and Bodø filled. The app goes from 102 tours to 103.

Fri Flyt's Helgeland index carries the sentence the round is built on:
Tomskjevelen, 922 moh on the island of Tomma, «regnes av mange som
Helgelands fineste skifjell». The access is a year-round public car ferry
from Nesna — read as part of the tour, not a breach of the road-start
condition: the road resumes on the island, Forslandsvegen ends at the farm,
and the guide says «ferja er ein del av turen» in as many words. (Contrast
Storsylen, where the rejection was 14 km of *unploughed road*, not scheduled
public infrastructure.)

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tomskjevelen | Helgeland | 45 | 922 | 951 | 3.9 | 21.8° | 27.9° | 2 |

Three findings, all of familiar shapes:

- **The register point is not the top, and the spelling differs.** The
  register writes **Tommskjevelen** and parks its point on a west knoll at
  756 moh; the summit — 921,7 climbed, against a published 922 — stands
  330 m east. The growing disc with the claims tiebreak finds it, and the
  card carries Fri Flyt's single-m spelling the way Kirketaket carries its
  guidebook name.
- **`check_ground.py` caught the lake again.** The first solve ran 135 m
  across Forslandsvatnet (a natural tarn at 148 moh — but 148 moh on an
  island in the open sea is not ice anyone should assume). Re-pinned along
  the north shore on land with the water cost on: 0 m on water, past the
  small tarns and Tinnvatnet too.
- **The summit is a horn.** The eight-direction sweep reads 31–44° mean in
  every sector, with 69,4° as the steepest window (NE). The line itself
  measures 27,9° max — and the guide's whole safety story is that
  asymmetry: kind track, unkind everything else, «ustabil med varierende
  snøforhold» as the source's own season sentence, and the east-facing
  snow-collecting hollow named as the variant it is.

Helgeland is region 3018, an A region — queried per coordinate. Fri Flyt
publishes neither KAST nor a steepest point for this tour, so the measured
figures stand alone on the card, and the season is borrowed jan–apr with
the guide saying so.

The proof: `check_routes.py` 103 tours / 112 routes, `check_tours.py` 103
cards, `check_guides.py` 0 unsourced numbers and 0 reassurance claims
across 206 guide texts, `test_check_guides.py` 15, `check_ground.py` 0 m
on water, and the CI suite.

## Round six: Tredje Svanfjell

One more, from Fri Flyt's Senja index: «Tredje Svanfjell er en klassiker i
Kaperdalen. Fin tur for nyfrelste toppturister, som også er en flott
mørketidstur.» The app goes from 103 tours to 104. Storriten in Narvik was
checked first and rejected: its Fri Flyt description is a **summer-ski**
tour (juni–august, «mest populære sommerski-toppen i området») behind a
gravel road that opens when it is plowed in early summer — the Storsylen
failure in a lighter coat.

| tour | region | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Tredje Svanfjell | Senja | 236 | 899 | 664 | 2.8 | 23.4° | 29.9° | 2 |

Three notes, two of them new shapes:

- **The name is not in the register at all.** The Svanfjell peaks are
  numbered informally, and the register's Svanfjellet (the massif) sits
  2,2 km south-east on another top. Fri Flyt publishes its own GPS summit
  position (UTM33), which reads 897,8 in DTM1 against a published 898 —
  that position seeds `SUMMIT_SEED`, the Kjølen rule, and the climb lands
  on 898,6.
- **The road number is retired.** Fri Flyt's «parkering langs Fv.232» is
  today fv. 7862 Kaperdalsveien, with four mapped lay-bys — and the one at
  235,7 moh is the start the arithmetic picks (898 − 660 = 238).
- **The fact-box aspect disagrees with the route.** Fri Flyt says S-SØ, but
  its own normal route — the only one it describes — climbs from Kaperdalen
  in the west and descends the same line: the skiing faces west, the
  measurement says V, and the card carries the measured. The south-east
  side (56,3° at its steepest 180–240 m out) is not a side anyone skis.

Every fixed point in the description reproduces: point 504 reads 478,7, the
notch north of it 582,4, the foretop «870» 862,9, and the source's «cirka
30–40 høydemeter» to the top measures 36. The line gives back **zero**
vertical metres, the season desember–mai is the source's own, and the
region is Sør-Troms (3012), an A region. The guide takes the source's
mørketidstur framing seriously as the assessment it is.

The proof: `check_routes.py` 104 tours / 113 routes, `check_tours.py` 104
cards, `check_guides.py` 0 unsourced numbers and 0 reassurance claims
across 208 guide texts, `test_check_guides.py` 15, `check_ground.py` clean,
and the CI suite.

## The adversarial round: the standing gap, closed

Every round since the first has ended with the same sentence — the guides are
verified against the terrain model, not against anyone who has skied these
mountains, and the independent read whose only job is to break them has not
happened for the newest tours. This round is that read, plus the mechanical
check that should have existed alongside it.

Nothing new went on the map. What changed is that **22 band figures and about
fifty prose claims across sixteen guides are now true where they were not**.

### `check_bands.py` — the claim that carries its own address

`check_guides.py` asks whether a number in the copy can be sourced at all.
`check_bands.py` asks the narrower, harder question: when the prose ties an
angle to a *named height band*, does that band measure that angle on the line
the app draws today? The difference is where re-routes hide. A guide that said
«20,6 grader mellom 1000 og 1100 moh» kept both numbers after #62 moved its
line — 20.6 was a real measurement somewhere and 1000–1100 was a real band —
so a number-sourcing pass walked straight past a sentence that had become
false. That drift was found once by hand, in a round that re-read thirty
guides. This is that read as a script, over both languages and all 104 tours.

It found fifteen claims in six guides that the hand pass had missed, and two
of them were the dangerous kind, where the *identity* of a superlative had
moved rather than just its value:

- **Snøhetta** called 1800–1900 m its steepest hundred. That band measures
  13,8°; the steepest is 1700–1800 at 16,0°. Both the height and the angle
  were wrong.
- **Kirketaket**, **Melderskin** and **Skåla** each named a band one step
  below the true steepest one, and **Slogen**'s steepest forest hundred is
  200–300 m at 21,9°, not 100–200 m at 22,8°.

`reground_bands.py` carries the twenty-two edits, each of which must match
exactly once or the run refuses to write. Where only the figure had drifted the
number was replaced; where the identity had moved the sentence was rewritten to
say where the steep ground actually is.

Two limits are worth writing down, because both were bugs in the check before
they were features. The English guides write four-figure heights with a
thousands separator — «between 1,700 and 1,800 m» — and a decimal-comma reader
turns that into 1.7, which matches no band and silently drops half the corpus;
the scan normalises it now. And the *sustained stretch* is deliberately not
checked: a band claim carries its own address, but a sustained-stretch claim
does not, and the corpus routinely puts the source's rating, the band, the step
and sometimes a flank angle in one sentence. A check that guesses which figure
the superlative owns reports defects that are only parsing, so that question is
left to `check_guides.py` and to a reader.

### The independent read

Three agents took the fourteen newest tours with one instruction: refute. They
re-fetched every source page, re-queried the register, re-ran the flank sweeps
and recomputed the superlatives. Ten were read in the first wave and the
Bergen/Kvamskogen four in the second, so the gap every previous round's
write-up had to name is now closed on all 104 guides.

The findings sorted into six shapes, and the first is the one that matters
most:

**Fabricated or altered quotations — four of them, inside quotation marks and
attributed to Fri Flyt.** Finnbufjellet's guide had «Nordeggen har et par
luftige partier hvor man må vurdere ferdighetene og skredfaren»; the page says
«utsatte områder hvor ferdigheter og skredfare må vurderes». Fastdalstinden's
had «Sørsiden har vært **skuddpunkt** for dødelige skredulykker» — the source
says «åsted for et par tragiske skredulykker med dødelig utfall», and
*skuddpunkt* (the release point) is a stronger and unsupported claim.
Tomskjevelen's headline — «regnes av mange som Helgelands fineste skifjell» —
is a promotion of «mange regner Tomskjevelen som en av de absolutt fineste
toppene på hele Helgelandskysten», and it had ridden into the tour card's
teaser. Vatnaknausen's KAST quote had been trimmed of «En del brattere», the
two words that say the terrain is steeper.

**Warnings the source gives for *this* route, dropped or moved onto a
variant.** Fastdalstinden's fatal-accident sentence sits inside the normal
route's own description, not the south-side variant the guide attached it to.
Varden's page carries «Skredutsatte områder i øvre deler ned fra salen» — the
saddle the line crosses — while the guide imported Kolbeindalen's warnings from
the *other* page and then told the reader the danger was in a valley they were
not going to. Midtitinden's source says «vær oppmerksom på den konvekse
overgangen som begynner på 800 moh»; the guide called that ground «jamn», and
the tour's steepest sustained stretch measures inside that rollover. Four more
Midtitinden warnings — recorded slab avalanches on the east slope, ski one at
a time in the gully, the cornice edge on the north-west ridge — reached
neither language.

**Superlatives placed where they are not.** `steepestStep` in
`guide_facts.json` gives *elevations*, not position along the route, and three
guides read it as a place. Sandhornet's 32,5° is the stair section at 26–51
moh, 1,3 km into a 5 km route — the guide put it in the summit flank, three
times, and so manufactured agreement with the source at a value steeper than
the source's own. Englafjell's 30,1° is in the valley climb at 312–330 moh, not
on the corniced summit ridge. Vatnaknausen's crux is *below* its treeline: the
21,9° step sits at 738–756 m in the forest above Nyestølen, while the flank the
guide called the steepest measures 11,2°.

**Compass bearings a reader would act on in fog.** Sandhornet's guide said
south-east was the only way home; the line bears 189° and the trailhead lies on
200°. Tomskjevelen's said south along a north-west-trending ridge; the measured
descent bears 134–147°.

**Register claims, in both directions.** Finnbufjellet's descent named
«Sendobotnen», which does not exist — the registered basin is Finnbugjuvet.
Englafjell's guide said the register does not carry Hjorteklett; it carries
**Hjortaklett**, 460 m north of Såta. Varden attributed «hold til høyre rundt»
to Ørntinden when the source says «toppen av Aksla» — registered
**Ørntindaksla**, 316 m, which makes the detour cost 24 m rather than 50. And
Midtitinden's «registerpunktet er ikkje toppen» was half wrong: the point is
294 m away, not 190, and the true summit *is* named in the register, as
**Mjønestindan**, 15 m from the climbed cell.

**Card fields that contradict the guide or the source.** Varden's teaser said
820 höjdmeter where the line gains 825 and pointed at the **west** flank — the
side the guide spends two paragraphs telling you not to ski — while the card's
own aspect and the source both say east. Duration is longer than the source on
every one of the six newest tours and was declared on none; the season
convention («kortets jan–apr er lånt … og guiden seier det») now extends to it.

### The Bergen/Kvamskogen four

The second wave read the four the first had left, and found the same shapes
again — plus one the earlier waves had not: a guide that shipped correct in
Norwegian and wrong in English, because the two languages had been corrected
separately.

**A source's entire hazard note, dropped.** Fri Flyt's Faremomenter for
Gullfjellet reads «Hele Glumragjelet, samt de to rennene, er veldig skredutsatt
vinterstid, og på våren kommer det ofte is og stein ned fra de stupbratte
fjellsidene», and none of it reached either language. It is not a warning about
this line — which is the gentlest in the corpus, no band over 8,1° — and that
is exactly why leaving it out was the wrong call: a reader who finds the page
finds a hazard the guide never mentioned. The register has no *Glumragjelet*;
the name is **Glamregjelet**, and the gully sits 663 m due west of the cairn at
576 moh, straight below the west side the descent section already warns falls
59,0°. Both languages now quote the note and place it. (There is a second
Glamregjelet 4,37 km north, and Pilatusgjelet 624 m west-south-west at 793 moh
— the register carries more gullies on that side than the source names, so the
guide names the one it can place and stops there.)

**The same superlative misplacement, in a tour the first wave had not reached.**
Såta's guide said the south-west couloir between Såterindane «byrjar med 43,4
grader berre 110 til 170 meter frå varden», in three places across two
languages. The register puts **Såterindane 837 m south-west** of the cairn: the
43,4° right below the summit is the shoulder, not the mouth of the couloir, and
Fri Flyt's own text says to continue *past* the cairn to find it. Written as it
stood, a reader in poor visibility would have dropped into the wrong thing 700 m
early.

**A safety-critical bearing that survived in one language only.** Skrott's
Norwegian descent had been corrected to say the north-west side is not the way
home — it falls 49,8° over the first twenty metres — and that the shoulder you
came up lies due **north**. The English still read "the north-west shoulder you
came up measures 7.0 degrees on average", naming the cliff as the gentle way
down. The 7,0° is real and is the trap: it is an 800 m mean that averages the
drop into the notch against the climb back up toward Glynt. The north shoulder
measures 17,5° over its first 400 m, and both languages now say so. Skrott also
paraphrased westcoastpeaks' axe-and-crampons line as being needed «for ei trygg
nedstigning» / "for a safe descent" — the source states a requirement, and the
guide had turned it into an assurance. `check_guides.py`'s reassurance rule
caught that one.

**A height read off the wrong feature.** Tveitakvitingen's English put the line
past Svartatjørna "at the 598 m level". The nearest vertex is 86 m from the
register point at 621 moh, and the tarn itself reads 618,2. Gullfjellstoppen
had the mirror image: Norwegian gave Redningshytta 597,5 moh and English 592,
and both figures are real — 597,5 is the hut point, 592 is the line 18 m away.
Neither said which, so both now say both.

**A written guide the app could not reach.** `varden-smaatindan`'s row in
`lib/tours.ts` carried no `hasGuide` at all, so a finished guide in both
languages was invisible in the app. Re-emitting from `guides.json` set it. The
same card's `verticalM` said 820 where the line gains 825 — the teaser had
already been corrected to 825, so the card was contradicting itself — and
`lib/tours.ts`, `tourmeta.json` and `seed.sql` now all read 825.

Making that guide visible is what surfaced the round's last finding, and it is
worth writing down because it is the shape `check_ground.py` exists for.
Varden's copy names «Lysløypa», and OSM has a path reaching both the trailhead
(3 m) and the summit (94 m), so the trail check enforced the claim over the
whole line and reported the line straying **367 m** from mapped ground. Traced,
it is not the lysløype at all: the way that reaches the summit is
`way/544369056`, a bare `highway=path` with no piste tag and no winter status —
a summer footpath. The guide's only trail claim is the approach, and it already
says the line leaves the løype before the lake.

The line is nonetheless off mapped ground for 519 m of 5 046, between 3,87 and
4,34 km out, rejoining the path 39 m away at 602 moh. That is not a defect —
a ski line and a footpath are allowed to differ — but it is not nothing either,
and the honest thing is the one the Høgevarde precedent established: say the
number out loud. Both languages now state where the two part, by how much, and
that through the 330–470 m band the footpath is the *gentler* of the two (its
steepest thirty-metre step measures 20,8° against the line's 24,9°). The check
reads that disclosure and downgrades the finding to a note, which is the
mechanism working as designed rather than being worked around.

Every finding above is fixed in both languages, with the research records
corrected alongside, and `check_guides.py`, `check_bands.py`,
`test_check_guides.py`, `check_ground.py` and the CI suite all come back clean.

### What the research settled, without building anything

- **The eight unbuilt registry names.** Seven are rejected with a specific
  failing condition, recorded in `new_corridors.json`: Skjomtinden and
  Storsteinsfjellet on ice axe and crampons — Storsteinsfjellet's own page says
  «alle går delvis på bre»; Fongen, Trollhetta and Storskrymten on having no
  ski description at all (every published start is a DNT hut or a summer toll
  road); Blåhøa on a single private ut.no posting with no second source. The
  eighth, **Grubbå**, is buildable and queued with its full description.
- **A registry error, corrected.** The `istinden` entry pointed at a 1459 m
  mountain in inner Sørdalen whose only description is a summer fell-running
  report. The Istind everyone means is **Vestre Istinden**, 1489 m in Bardu,
  the landmark of Indre Troms, with a full Fri Flyt ski description. `peaks.py`
  now names the right mountain, and the summit resolves to 1488,6 against a
  published 1489.
- **Vesterålen has no qualifying claim.** The popularity rule wants a published
  source calling a tour the most visited or most popular of its area. For
  Vesterålen the only «mest»-claim found is for **Måtind** — «Vesterålens
  desidert mest kjente topptur» — and it is a summer hike with 20 000 visitors
  and no ski route. Stortinden, Forkledalstindan and Forselvtinden all demand
  «alpinøks og stegjern»; Stor Snytindan starts at a DNT hut. Vesterålen stays
  a one-tour region, and that is now a recorded answer rather than an open
  question.
- **Three regional indexes, inventoried.** Bodø has **79** turbeskrivelser, not
  the handful the app had seen — most rejected on crampons or on access (the
  thirteen Sjunkfjorden tours carry no adkomst text at all and Vassvika is
  boat-access; the eighteen Beiarn starts are seter roads off FV813). Senja's
  index is five, of which four are new to the app. Helgeland's is four, of
  which Lukttinden and Tortenviktinden are buildable and Breitinden is rejected
  («turen krever ofte stegjern»). The clean candidates are listed for the next
  round.

### Routed but unpublished

**Vestre Istinden** and **Husfjellet** are researched, corridored and solved,
and neither is on the map. Husfjellet is why: the routed line's steepest step
measures 33,7° in the first kilometre, and Fri Flyt gives the tour «under 27
grader» and KAST 1. That is a corridor that needs pinning along the real
Dronningstien rather than a line the router found for itself, and a tour whose
own numbers contradict its source is exactly what this pipeline exists not to
publish. Both lines stay in `routes.json`, out of `tourmeta.json`, and
`emit_ts.py` leaves them out by design.

## The Istind round: the backlog's last routed name, and a line moved off a glacier

**Vestre Istinden, 1489 moh in Bardu — 104 → 105.** It was the one candidate the
previous rounds had already researched, corridored and solved, and it shipped
nothing: `routes.json` carried a line, `tourmeta.json` did not carry a card, and
the write-up's only stated reason for holding it back was about Husfjellet, the
tour it happened to be paired with in that paragraph. This round finished it,
and finishing it turned up two things the earlier pass had not looked for.

### The routed line crossed a glacier

The standing conditions say no glacier. The line that had been sitting in
`routes.json` ran straight across the cirque between Vestre and Søre Istinden:
**six sample points between 1017 and 1109 moh read `SnøIsbre`** in Kartverket's
terrain class, and OSM carries the glacier as `way/375260442` between 898 and
1155 moh, exactly there. Two of the corridor's waypoints were inside it.

Both sources say to go around. Fri Flyt: «ta opp på ryggen som går opp på
vestsiden av veggen». ut.no: «Fortsett videre oppover til høyre for bekken og
**breen**». The route had never been in doubt — the corridor had simply been
pinned through the basin instead of onto the crest west of it, and nothing in
the battery asks about ice.

The two upper waypoints were moved onto the ridge, verified point by point
against both the terrain class and the polygon before anything was re-routed.
The line now has **0 metres on the glacier** and no `SnøIsbre` sample anywhere,
and passes 14 metres from its edge at 4,27 km — close, which the guide says out
loud rather than rounding away.

### And then it left the signposted path

`check_ground.py` fired on the new line, and its finding was worth reading twice
because the *trigger* was wrong and the *substance* was right.

The trigger: the guide calls the mountain «landemerket i Indre Troms», and
`TRAIL_WORDS` matched **lande*merket*** as a claim to follow a marked trail. The
pattern allowed any compound prefix in front of every trail word, which is
correct for *lysløypa* and *skiløypa* — that prefix rule exists because it once
missed exactly those — but wrong for *merket*, where a prefix changes the noun
instead of narrowing it. The words are now split: the ones that take a Norwegian
compound prefix, and the ones that must stand alone. A twelve-case table checks
both directions, including *varemerket* and *kjennemerket*.

The substance survived the fix: the line really was **577 m off the mapped path
at its worst, with 1 393 m of 5 397 beyond 250 m**, all of it in the birch
forest. Both sources describe that path — ut.no's «tydelig og bra, men bratt»,
signposted with a green marker — and above the treeline the line was already on
it, within tens of metres of `way/527286327`, the trailblazed summer path that
reaches the summit 3 m from the cairn. Only the forest was the router's own
invention.

So the three forest waypoints were pinned to `way/1084430679`. The line now sits
**66 m from mapped ground on average, 276 m at worst, with 49 m of 5 238 beyond
250 m**. It is 160 m shorter, gains 4 m more, and its steepest step dropped from
27,4° to 27,7° in a different place entirely — which is the part worth writing
down.

### The re-route moved every figure in the guide

The first guide had been written against the pre-pinning line, and the pinning
invalidated it wholesale: the treeline moved from 604 to 558 moh and from 2,16
to 1,81 km, every band angle changed, and **the steepest sustained stretch moved
from 946–966 moh to 1286–1304 moh** — from the step up onto the ridge to the
upper ridge itself, half a kilometre below the cairn instead of 1,7 km. A guide
that had correctly said "it is not the summit slope that is steepest but the
step onto the ridge" became false the moment the line improved. Both languages
were rewritten from the new facts, and `check_bands.py` agrees with all six band
claims.

### What the register and the sources actually say

- The register spells the southern top **Søre Istinden**, not Fri Flyt's «Søndre
  Istind». Istindan is a registered *fjellområde* holding five tinder: Vestre
  (1489, the tour), Søre 2,0 km off, Midtre 815 m, Austre 2,3 km and Indre 6,7
  km. **«Nordveggen» is not in the register at all** — it is Fri Flyt's own name
  for the north face, and the guide attributes it.
- The register puts Vestre Istinden in **Bardu alone**; ut.no writes «på
  kommunegrensen mellom Bardu og Målselv».
- **No source publishes a ski season.** ut.no's jul–sep belongs to the *fottur*
  (it grades the hike VERY_TOUGH over 8 922 m), and Fri Flyt has no season field.
  The card's feb–mai is therefore editorial, not borrowed, and the guide says so
  — as it says that the card's 5–7 t is the pipeline's estimate against Fri
  Flyt's «6-7 timer».
- Fri Flyt's «Fallhøyde ned til skogen er omtrent 900 meter» measures **931 m**
  on the line, and its «renna (30-35 grader)» measures **30,6° mean** in the
  south-west sweep — both close enough to quote, and both quoted with the
  measured figure beside them. That couloir is a different line from this one and
  is not routed here.
- Ice axe and crampons apply only to the toppegg variant from Søre Istinden,
  which is not this corridor. The guide says which.

### A pipeline bug the round exposed

`guide_facts.py` iterated every slug in `routes.json` and read `tourmeta.json`
blind, so the first run after a routed-but-unpublished tour exists died on a
`KeyError` — Husfjellet, deliberately unpublished since the round that built it.
`emit_ts.py` already skips those by design; this pass now agrees.

## The five-route round: Senja's index finished, Helgeland's opened, and a corridor unblocked

**104 → 110.** Five tours, no new regions: the rest of Fri Flyt's Senja index and
the two buildable names on its Helgeland index. Four are new to the pipeline;
the fifth had been routed for two rounds and could not ship.

| tour | region | gain | length | steepest step | source's own figure |
|---|---|---|---|---|---|
| Husfjellet | Senja | 640 m | 3,29 km | 19,6° | «Under 27 grader» |
| Lonketinden | Senja | 784 m | 3,06 km | 30,0° | «30-35 grader (kort parti)» |
| Skolpan | Senja | 607 m | 2,31 km | 27,1° | «27-30 grader» |
| Lukttinden | Helgeland | 1129 m | 3,99 km | 28,1° | ut.no «opp i 30 grader» (alt. 2) |
| Tortenviktinden | Helgeland | 1023 m | 5,57 km | 23,7° | — (ingen kjelde gir tal) |

Every line lands inside the figure its own source publishes. That is the point
of the table: three of the five sources state a steepness, and the router was
not told any of them.

### Husfjellet: the tour that contradicted its source for two rounds

Husfjellet has been researched, corridored and routed since the Senja round, and
`emit_ts.py` left it out by design, because the line disagreed with the page it
was built from. Fri Flyt gives «Bratteste punkt: Under 27 grader»; the routed
line had a 33,7° step at 624 m out and a **38,1° drop** at 2 702 m, where it cut
across a gully instead of holding the ridge. The README's standing note said the
corridor needed pinning along the real Dronningstien.

It does exist in OSM, as a chain of three ways from the church at Skaland to the
cairn, and a Dijkstra pass over the path-node graph reproduces the published
route end to end: nearest node 59 m from the trailhead, 5 m from the summit, and
a sample at **327,6 moh** where Fri Flyt names «Sommerdalhaugen 327 moh». The
corridor is pinned to that chain. The line now measures **19,6°** as its
steepest sustained stretch — inside the source at last — and the tour ships.

### Lonketinden: the measurement landed on the sentence

Fri Flyt writes «Rundt 550 moh. er det et kort parti som er 30–35 grader». The
routed line's steepest sustained stretch is **30,0° between 564 and 588 moh**.
Neither number was available to the other: the source is a guidebook author's
prose and the line is a least-cost path over DTM1. Skolpan did the same thing —
«Mellom 600–740 moh. er det partier som er 27–30 grader», measured 27,1° between
693 and 714 moh.

The trailhead corroborates too. «Vannbassenget ved Finnelva» resolves to the
highest road end in the valley at 65,9 moh, and 848 − 66 = 782 against Fri Flyt's
«785 høydemeter» — the published vertical points at exactly that start.

### Lukttinden: two published ways up, and the corridor takes the gentler

This is the one where the second source is much stricter than the first. Fri Flyt
gives no steepness field at all and sells the tour as the easy alternative to
Okstindene («ikke omkranset av bre»). ut.no publishes it as a **ski tour** with a
logged track and says «På grunn av bratthet bør den ikke gåes ved skredfare»,
then splits the ascent in two: alternative 1, his own drawn line, «ganske bratt,
med opptil **40 grader** helning»; alternative 2, «den noe mindre bratte ryggen
opp til høyre… opp i 30 grader».

The corridor follows alternative 2, and the finished line measures 28,1° —
inside the gentler alternative and well under the steeper one. Two further things
from that page are in the guide because no other source carries them: the cornice
«som dannes på nordøstsiden av varden… Skavler bryter 45 grader i snøen og kan
dra deg med selv om du står på fast grunn», which the NE sweep confirms at 63,4°
in its steepest 60 m only 60–120 m out behind a 19,8° mean; and the height, where
**ut.no's 1348 beats Fri Flyt's 1342** — the summit search resolves 1347,8, and
`peaks.py` carries 1348 as the expected height so the resolver stops reporting a
+5,8 m delta against the figure this round had already found to be the weaker.

**One disagreement is left standing rather than smoothed.** ut.no describes a
final slope «på ca 35 grader for å nå toppen», often icy. The routed line finds
35° nowhere: the top band measures 18,5° and the tour's steepest stretch is 28,1°
lower down. The guide says so in both languages. A source that has walked the
mountain and a line that is computed do not have to agree, and where they do not,
the honest move is to print both.

### Tortenviktinden: sea level to a thousand metres

1023 m of ascent over 5,57 km from the farm Neset, against Visit Helgeland's
1 025 m over 5,2 km — the closest independent corroboration in the round. The
register puts the summit in **Lurøy** while the approach from Flostrand is in
**Rana**. Fri Flyt's only named hazard, Grøveldalen's «høye og bratte sva på
begge sider», is a registered cirque 2,5 km south of the cairn and off the route;
the guide says which. The flat broken shelf the source describes is the 700–900 m
bands at 10,4° and 8,8° over 1 170 m of ground between them.

**And that shelf is where `check_ground.py` earned its keep again.** The first
routed line crossed **140 m of water at 792 moh**; a bypass south of the nearest
tarn cut that to 90 m; the mapped picture turned out to be a *cluster* of at
least ten polygons between 785 and 792 moh, sitting exactly where Fri Flyt writes
«små bekkedaler på tvers av fjellet». The corridor now goes south of the whole
group. It costs 0,17 km, brings the line to **0 m on water**, and drops the
steepest sustained stretch from 26,0° to 23,7°. Every figure in the guide was
rewritten twice as the line moved — the same lesson the Istind round recorded
earlier on this branch, and the reason the band check runs after every re-route
rather than before.

### What is declared rather than assumed

- **Seasons.** Three are published: Fri Flyt's «Februar - mai» for Husfjellet,
  Lonketinden and Skolpan. Lukttinden's apr–jun is ut.no's own ski-tour season.
  **Tortenviktinden has none** — Fri Flyt only notes that the coastal position
  makes it unstable, and Visit Helgeland says winter with the alternative «after
  Easter» — so its feb–mai is editorial and the guide says so.
- **Second sources are uneven, and the records say so.** Lukttinden and
  Tortenviktinden have genuinely independent ones (ut.no's ski tour; Visit
  Helgeland's route with figures). Lonketinden and Skolpan do **not**: Fri Flyt
  publishes Lonketinden at two addresses and both rest on Espen Nordahl's
  *Toppturer i Troms*, and Peakbook corroborates only Skolpan's height. Both ship
  at `confidence: medium` on the same footing as Tredje Svanfjell, and both
  guides state the limitation.
- **Verticals.** Fri Flyt's «785 høydemeter» for Husfjellet is more than the
  mountain is tall; the card carries the routed 640. Skolpan's published 580
  against a routed 607 is recorded too.

### A false positive in `check_ground.py`, and a real finding under it

The trail check fired on Vestre Istinden earlier this round because the guide
calls the mountain «lande**merket** i Indre Troms» and `TRAIL_WORDS` allowed any
compound prefix in front of every trail word. That prefix rule is correct for
*lysløypa* and *skiløypa* — it exists because the check once missed exactly those
— and wrong for *merket*, where a prefix replaces the noun rather than narrowing
it. The words are now split into a compound-taking group and a stand-alone group,
with a twelve-case table covering both directions including *varemerket* and
*kjennemerket*. Rødtinden's genuine lysløype claim and Varden's disclosure note
both still behave.

## The Romsdal round

Five classics around Isfjorden, Skorgedalen, Måndalen and Innfjorden, all from
Fri Flyt's Romsdalen index — the region that held one tour, Kirketaket, in an
area with forty-plus published route descriptions. The four conditions of the
Sunnmøre round hold: a full Fri Flyt route description, a start at a road, an
independent second source, and every point resolving in the place-name register
and measuring on DTM1. All five summits resolve within 3 m of their published
heights, and all five sit in Varsom's **Romsdal** region — an A-region with a
daily forecast, queried per summit coordinate rather than assumed.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Middagstinden | 349 | 1568 | 1306 | 6.2 | 25.1° | 30.0° | 4 |
| Mjølvafjellet | 6 | 1215 | 1220 | 5.1 | 21.0° | 31.5° | 2 |
| Øspetinden | 201 | 1228 | 1061 | 6.9 | 22.4° | 25.6° | 3 |
| Blånebba | 418 | 1317 | 934 | 4.0 | 22.2° | 27.4° | 3 |
| Skarven | 307 | 1048 | 744 | 3.3 | 20.5° | 27.7° | 2 |

### What the checks caught

**Blånebba's trailhead was 350 m off the road.** The corridor first pinned the
Venjesdalen parking at a DTM-probed flat at 391 moh; `check_new_corridors` found
no mapped road or car park within 250 m of it. OSM's Venjesdalssetra node
(3726780487) is where the toll road actually ends — 418 moh on DTM1 against Fri
Flyt's stated 380, a difference recorded rather than smoothed — and the route
was re-solved from the mapped point. The routed gain moved 942 → 934.

**Middagstinden crossed the regulated Berillvatnet three times before it
didn't.** The route follows the road along the lake's south side, and
Berillvatnet reads `InnsjøRegulert` on DTM1 — the exact class of water
`check_ground` exists for. The first solve cut 180 m across the ice up to 87 m
from shore; two south-shore waypoints cut that to 45 m at the west arm, where
the line clipped the inlet delta; a wider berth west of the lake (403, 390 and
410 moh, with the river crossing where the source puts it) took it to **0 m on
water**. Every band figure in the guide was rewritten as the line moved — the
same lesson the Senja round recorded, and `check_bands` caught the two figures
that had drifted between reroutes.

**Skarven was researched as grade 1 and ships as grade 2.** Fri Flyt gives
KAST 1 – Enkelt and ut.no calls it a beginners' classic, but the finished line
measures 20.5° in its steepest band and 27.7° in its steepest stretch — above
what the app's grade 1 tours measure (Husfjellet 17.1/19.6, Melshornet
17.8/21.7) — and the east flank below the fore-summit is avalanche-prone in the
source's own words. The measurement is the check for the grade, the Ranten rule
in the other direction.

**Fri Flyt's «ca 700 moh» for Venåssetra is wrong.** The register's Venåssetra
(62.50809/7.30469) reads 393 moh on DTM1, and the routed profile agrees — the
setra sits 2.7 km up the toll road from Venås at 201, not halfway up the
mountain. The guide states the measured height and says the source's figure is
wrong, which is what `corrections` is for.

**Two second sources are thinner than the rule wants, and the records say so.**
ut.no describes Mjølvafjellet from Venjesdalen — a different start from Fri
Flyt's Isfjorden stadion — so the second source covers the mountain, not the
line, and Peakbook corroborates the height. Middagstinden has Peakbook tour
articles and two trip blogs on the same line but no independent full route
description. Both ship at `confidence: medium` on the Lonketinden footing, and
both guides state the limitation.

**Blånebba's season is published twice and differently.** Fri Flyt gives
March–May, ut.no December–April. The card carries the primary source's and the
guide records the disagreement instead of averaging it.

### What was left out

**Storgrovfjellet** (1629) is a spring tour from the Trollstigen plateau at
700 moh — a road that opens in late May at best and spent two recent seasons
closed for rockfall securing. A start nobody can drive to for most of the ski
season is not a start; it waits for the road's schedule to settle.
**Kvitfjellet** (1381) starts on Vistdalsheia, where neither source says
whether the road over the pass is ploughed in the December–April season the
tour claims; a trailhead whose winter access cannot be confirmed fails the
road condition. **Svartvasstinden** (1259) needs crampons, ice axe and belay
gear for an exposed ridge and a short climbing step to reach its main summit —
Fri Flyt's own description — and a line whose last move is a belayed scramble
is not a ski card.

## The Troms round

Five around Tromsø — Breivikeidet, Ramfjorden and Ringvassøya — from Fri Flyt's
Troms index, most of it Espen Nordahl's *Toppturer i Troms* republished. The
four conditions hold, with the second-source caveat that book creates: where the
only independent coverage is a trip blog or a tourist listing, the record ships
at `confidence: medium` and says so. All five summits resolve within 1,1 m of
their published heights — and the forecast query earned its keep again: **four
of the five lie in Varsom's Lyngen region, not Tromsø's** — only Store
Skalltinden on Ringvassøya is forecast as Tromsø. Both are A-regions with a
daily bulletin, and every guide names the region its summit actually answered.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Gabrielfjellet | 76 | 1214 | 1139 | 4.4 | 24.9° | 29.2° | 3 |
| Storfjellet | 41 | 1088 | 1053 | 3.3 | 29.7° | 36.5° | 3 |
| Store Skalltinden | 11 | 901 | 981 | 6.0 | 21.6° | 27.0° | 3 |
| Fagerfjellet | 21 | 957 | 947 | 4.3 | 17.2° | 25.6° | 2 |
| Skarlitinden | 31 | 858 | 937 | 6.3 | 21.1° | 30.5° | 2 |

### What the checks caught

**Storfjellet resolved onto a 1424 m namesake 24 km away, and the fix was in
`geo.py`.** The place-name helper read one page of 50 rows, and «Storfjellet»
alone has hundreds — the Breivikeidet row sat beyond page 1, so the resolver
seeded from the only Tromsø row it could see, at Lakselvbukt. `stedsnavn` now
pages through the register (bounded at eight pages), and the row lands 46 m
from Fri Flyt's published GPS point.

**The mountain skiers call Gabrielfjellet is registered as Iverfjellet.** SSR's
own «Gabrielfjellet» is a shoulder 3,2 km northeast of the 1213 m top; the
summit search from that row could never have reached it. Fri Flyt's published
point sits 47 m from the register's Iverfjellet, outdooractive lists the tour
under both names, and the guide tells the reader which name the map will show.
The Kirketaket/Kyrkjetaket case, one round later.

**Skarlitinden's steepest sustained stretch is downhill.** The line collects
937 m of gain against Fri Flyt's 835 because the col and plateau give back
110 m — and the steepest 30 m window, 30,5°, is the dip after point 511, ridden
downward on the way up. The guide says so rather than leaving the reader to
wonder how a KAST 1 tour carries a 30-degree figure.

**Store Skalltinden crosses a tarn, and it became prose, not a reroute.**
`check_ground` found 103 m on the natural lake at 543 moh southwest of point
695 — the very lake Fri Flyt's own description aims from — never more than 18 m
from shore. Natural water on a line the source itself puts there is the
seven-became-prose rule: named with height, length and offshore distance. The
line already held land at Skallvatnet's south end, where the source keeps it.

**Grade moved in both directions.** Store Skalltinden measures grade 2 and
ships as 3 — sea to summit, steep ground on both sides of the line between 600
and 800, and three named hazards are more than a slope angle sees (the Gråfjell
rule). Skarlitinden was scored 2 for the terrain trap and the plateau edge,
and the measurement agrees.

### What was left out

**Stortuva** (1109, above Ullsfjorden) has a full Fri Flyt description and no
independent second source anywhere — not ut.no, not morotur, not a blog naming
the line. One-source tours do not ship. **Kvaløya's Middagstinden** would
collide with the Romsdal round's Middagstinden on the map's own terms and
waits for a naming decision. The Lyngen heavyweights the index leads with —
Istinden, Store Kjostinden — were researched in earlier rounds and rejected on
steepness that belongs to a different product; those records stand.

## The Lofoten round

Five on Austvågøya and Vestvågøy from Fri Flyt's Lofoten index — an older page
format than the KAST-classified regions: most tours carry no KAST, no season
and no GPS point, so the register, the terrain model and the second sources
carry more of the verification than usual, and every season on these cards is
editorial from the neighbouring tours, said out loud in each record. All five
sit in Varsom's **Lofoten og Vesterålen** A-region, queried per summit.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rundfjellet | 6 | 803 | 890 | 5.3 | 18.4° | 31.2° | 2 |
| Pilan | 5 | 826 | 847 | 4.2 | 21.9° | 39.4° | 3 |
| Torskmannen | 5 | 755 | 754 | 3.0 | 21.6° | 28.1° | 3 |
| Justadtinden | 14 | 736 | 733 | 2.9 | 22.6° | 29.8° | 2 |
| Kleppstadheia | 16 | 534 | 525 | 2.2 | 20.9° | 32.9° | 1 |

### What the checks caught

**Rundfjellet could not be routed from its own car park, and the reason is a
bridge.** The parking at Vatterfjordpollen sits east of the tidal strait the
E10 crosses on a small bridge; the DTM records the strait as sea, sea is
impassable in the cost model, and the bridge does not exist in a terrain
model. Two shore waypoints were not enough — the router failed twice — so the
drawn line starts on the west side of the bridge and the guide carries the
walk across in prose. A line can only start where the terrain model has
ground.

**Pilan was researched as grade 2 on Fri Flyt's KAST 1 and ships as grade 3.**
The summit cone measures 39.4° in its steepest 30 m window, between 753 and
786 moh, and the flank probes around the cone (20.9–46.5° mean by sector) say
the step is terrain, not routing. The measurement is the check for the grade —
the Ranten rule — and the guide tells the reader exactly where the step sits
and how to read it.

**Vågan has two registered Torskmannen.** The one the source describes
resolves 755.2 against a published 755 at the head of Vestpollen; the namesake
6 km southwest reads 717.6. The kommune could not separate them — the `near`
coordinate did.

**Justadtinden has no treeline at all.** The terrain classes along the line
hold no continuous forest from the farm to the cairn — `treeline_scan`
returned nothing, the first tour outside the alpine spring rounds to do so —
and the guide says the whole tour reads from the car instead of quoting a
forest limit that does not exist.

**Kleppstadheia's steep warning pointed one way; the summit measures the
other.** Fri Flyt warns about steep ground along the south side of the ridge —
true lower down — while at the summit the north, northeast and east sides are
the edges (34.6–37.9° mean, windows to 55.9) and south is a 4.0° flat. The
guide carries both, each at the elevation it belongs to.

## The Narvik round

Five from Fri Flyt's Narvik chapter — Håkvikdalen, Beisfjord/Djupvik, Skjomen
and Gratangsfjellet. The chapter is modern and KAST-classified, and it is also
regulated-reservoir country: three of the five corridors touch water NVE has a
number for, and none of the shipped lines stands on any of it. Varsom answered
**Ofoten** for four summits and **Sør-Troms** for Spanstinden — the mountain
sits in the source's Narvik chapter, but the bulletin it answers to does not.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Skjomtinden | 223 | 1576 | 1487 | 7.6 | 20.3° | 33.7° | 4 |
| Beisfjordtøtta | 60 | 1448 | 1428 | 7.2 | 22.7° | 38.4° | 3 |
| Gangnesaksla | 20 | 1318 | 1306 | 4.9 | 20.0° | 26.0° | 3 |
| Spanstinden | 424 | 1457 | 1047 | 5.2 | 18.8° | 25.0° | 2 |
| Litletind | 223 | 1100 | 916 | 5.2 | 19.9° | 26.2° | 2 |

### What the checks caught

**Beisfjordtøtta took three reroutes to get around a lake called Pumpvatnet —
which turned out not to be the regulated one.** Fri Flyt's route crosses
Forsnesvatn on the ice; both Forsnesvatnet and Isvatnet read `InnsjøRegulert`,
so the corridor was planned around them from the start, on the east shore. The
lake the router actually crossed was Pumpvatnet — `Innsjø`, natural despite
the name — 182 m of it, then 90 m, then 181 m as single waypoints pushed the
line into different lobes. The full north-shore chain (two points in sequence
around the outlet) took it to 0 m. The remaining 38,4° step is the summit
block itself, and the guide says so.

**Skjomtinden is KAST 2 in the source and grade 4 on the card.** The gear list
says ice axe and crampons, the west sides are bare and rocky with travel on
foot, and the line gives back 134 m on the traverse. A classification about
avalanche exposure and a grade about what the day demands are different
statements — Slogen's class, and the guide is written that way.

**Nervatnet is regulated, and the source offers the ice «om den er stabil».**
Both Håkvikdalen tours keep the shoreline path on land instead, both ways, and
say why: regulated ice cracks along the shore as the reservoir draws down.

**Spanstinden crosses Bukkemyrvatnet because the source's own route does.**
90 m, never more than 25 m from shore, on a natural lake at 418 moh — the
seven-became-prose rule, stated with height, length and offshore distance.

**Niingen and Storriten were researched and left out.** Niingen starts at
Blåvatnhyttene — huts a ski-in away, not a road — which is the Patchellhytta
condition. Storriten is a June–August summer-ski tour up a seasonal
anleggsvei toward Sitasjaure; a card whose season is the road's maintenance
window is not this product's card. Both records stand for a later decision.

## The Sør-Troms round

Five from Fri Flyt's Harstad section — Kvæfjord, and the islands Andørja and
Rolla in Ibestad. The chapter is why the region held one tour: nearly
everything in it is KAST 3 – Komplekst with ice axe and crampons on the gear
list, so four of the five ship as grade 4 and the fifth is the round's one
grade 1. Varsom split the five again: the Ibestad and Kvæfjordeidet summits
answer to **Sør-Troms**, while Reinspælen and Snøtindan on the Kvæfjord/
Vesterålen border answer to **Lofoten og Vesterålen** — queried per summit,
as always.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Snøtindan | 13 | 996 | 1548 | 9.0 | 22.1° | 33.8° | 4 |
| Reinspælen | 5 | 1117 | 1404 | 8.4 | 21.0° | 41.7° | 4 |
| Snøtinden | 9 | 1215 | 1242 | 6.8 | 22.7° | 28.1° | 4 |
| Stortinden på Rolla | 85 | 1020 | 984 | 7.3 | 21.4° | 27.8° | 4 |
| Storhornet i Kvæfjord | 175 | 722 | 658 | 8.2 | 9.5° | 25.8° | 1 |

### What the checks caught

**Three of five lines crossed water on the first solve, and one of the lakes
was regulated.** Stortinden's corridor clipped 315 m of Mevatnet
(`InnsjøRegulert`) at its south tip and took two reroutes to reach 0 m — the
second because a single east-shore point still let the router cut the tip.
Snøtinden crossed 90 m of Snøfjellvatnet and needed its lake-edge waypoint
replaced with two shore points. Snøtindan crossed three separate tarns —
the source's route crosses them on ice — and holds land past all of them
after three passes; the north-side bypass of the 573 tarn was itself revised
when it forced 100 m of extra climb over a knoll the south side avoids.

**Snøtindan's card carries 1550 vertical metres for a 996 summit.** The
source gives 1250–1350 crossing the lakes on ice; the land-only line collects
1548, giving back 565 over Løbergskaret and the tarn shelves. The guide
carries the ledger — the number is bigger than the mountain, and it says why.

**Stortinden's published gain is its summit height.** 1021 for a 1021 m top —
the altitude-duplicated-into-gain bug this pipeline has met since Oksen. The
card carries the routed 980, and `verticalM` still never infers a trailhead.

**Grade 4 stands against measured 2s and 3s on four tours.** The slope
numbers alone would grade Snøtinden and Stortinden a 2 — but KAST 3, ice axe
and crampons on the source's own list, corniced summits and exposed ridge
traverses are what the day demands, and that is the Gråfjell rule. The
measured figures are all in the guides, so the reader sees both statements.

**Storhornet i Kvæfjord is the app's first qualified duplicate name.** The
register's Storhornet in Kvæfjord collides with the Trollheimen tour already
on the map, so the card carries the qualifier — the decision the Troms round
deferred on Kvaløya's Middagstinden now has a precedent.

## The Tjeldsund round

Five from Fri Flyt's Tjeldsund chapter, on both sides of Tjeldsundet where
Strandtinden has stood alone since the backlog round: Sætertinden and
Haukebøtinden above the Sandtorg–Gausvik shore, Kongsviktinden and
Jakobstinden sharing a trailhead in Kongsvikdalen, and Taraldsviktinden over
Fiskefjorden. A different chapter from the Sør-Troms round's: two of the
five are KAST 1 ridges — Sætertinden staked from 500 m with telephone poles
above that, the app's first stakes-and-poles tour — and the three KAST 2
summits carry ice axe and crampons on the source's own list, which is the
Gråfjell rule again and grades them 3 against measured 2s.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Sætertinden | 15 | 1095 | 1113 | 6.1 | 21.2° | 26.9° | 2 |
| Haukebøtinden | 46 | 905 | 863 | 4.4 | 18.0° | 24.8° | 2 |
| Kongsviktinden | 25 | 980 | 1092 | 9.1 | 17.9° | 31.6° | 3 |
| Jakobstinden | 25 | 976 | 1062 | 8.5 | 18.0° | 31.0° | 3 |
| Taraldsviktinden | 5 | 776 | 779 | 4.5 | 19.0° | 22.9° | 3 |

### What the checks caught

**The water the OSM check could not see.** `check_ground.py` measured 0 m of
mapped water under all five lines on the first solve — and the terrain-class
samples in `guide_facts.py` still showed Elv and Innsjø under the two
Kongsvikdalen tours, because the braided Kongsvikelva and the tarn at 324 m
east of Sætran are in Kartverket's classes and not in OSM. Both corridors
were re-solved with `avoidWater`. Kongsviktinden's took two re-pins beyond
that: the nudge pass answered the tarn with a 1.2 km detour over a 465 m
knoll that gave back 52 m, so the corridor was moved onto the south contour
— and the first placement of «sør for tjernet» sat on a 318 m knoll of its
own, so it moved 350 m east into the contour at 278. Final line: 1092 m
gained, 137 given back across the rolling plateau, zero vertices on water.
What remains under the measure is where Kongsvikdalveien crosses the braided
river on its bridges, stated in the guides — the Spanstinden rule.

**Overpass had to be re-mirrored before anything could be checked.** The
three mirrors in the rotation are unreachable from this environment, and the
first replacement tried — overpass.osm.ch — is a Switzerland-only extract
that answers fast and empty, exactly the failure `check_ground.py`'s
timestamp guard exists for (its `timestamp_osm_base` is a build number, not
a date, and the guard rejects it). maps.mail.ru's Overpass carries the full
planet with an ISO timestamp and current data, and now leads all three
rotations.

**The round splits across the forecast border, and not the way the map
suggests.** Queried per summit as always: Sætertinden, Kongsviktinden,
Jakobstinden and Taraldsviktinden answer to Lofoten og Vesterålen —
Sætertinden with its feet in Troms — while Haukebøtinden, one Sagtind
traverse from Sætertinden, answers to Sør-Troms alone. Both A-regions with
daily bulletins; each guide names its own.

**Sætertinden's published vertical is exact.** 1095 − 15 = 1080 is Fri
Flyt's stated figure to the metre, and the routed line collects 1113 giving
back 33 — the cleanest reconciliation in the round. Jakobstinden's 975 − 25
= 950 forliker its published 960 the same way. No Oksen-class
altitude-into-gain bug anywhere in this chapter.

**Taraldsviktinden's summit walked 350 m off the register point.** The SSR
representation point reads 773.9 m; the climb found 775.8 at
68.55162/16.16806 against the published 777, and the 774 cairn the source
mentions stands on the west side. The guide carries all three numbers.

**Two burials on Sætertinden's north side, and the guide points at them.**
The source records people dug out in 2017 and 2019, both on descents left
(north) of the staked ridge. The flank probe puts the gentle sides N/NW/W
and 60.1° in the south-east, where the expert couloirs live — the route is
staked because it is the line, and the avalanche panel says exactly that.

## The Lofast round

Five more from the Harstad book, around Gullesfjorden and west of
Fiskefjorden — four of the five start on the E10 (Lofast): the Fiskefjorden
car park Taraldsviktinden already uses, the parking bay at Kobbedalselv bru
in Kanstadbotn, and the big car park at the Gullesfjordbotn roundabout,
which serves two of them. Only Melåa, on fv. 7784 along Gullesfjorden's
east shore, is off it. Two KAST 1 ridges, a KAST 1 with an exposed finish
that grades 3 by the Gråfjell rule, a Complex tour whose whole point is the
gentlest line through steeper ground, and the round's one grade 4.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Snøtinden i Tjeldsund | 5 | 980 | 1018 | 4.4 | 21.7° | 29.0° | 2 |
| Fiskefjordtindan | 15 | 965 | 1076 | 7.6 | 15.2° | 32.8° | 3 |
| Nonstinden | 49 | 930 | 983 | 5.6 | 24.1° | 31.1° | 4 |
| Tverrfjellet | 12 | 889 | 885 | 5.5 | 14.0° | 23.9° | 2 |
| Middagsfjellet | 49 | 810 | 762 | 2.9 | 20.6° | 27.3° | 3 |

### What the checks caught

**Two summits were not where the first read put them, and the register could
not settle either.** Fiskefjordtindan is a ridge with two tops 876 m apart:
the register point sits on the northern one, which the scan reads at 998.9 —
but Fri Flyt publishes 967, the southern top climbs to 964.2, and the route
from Kanstadbotn finishes there. Tverrfjellet above Melåa carries no
register name at all — SSR's nearest Tverrfjellet entries are 12–20 km away
on other mountains — and the massif answered with two candidates: a 921.9 m
knoll and an 888.9 m top separated by a col the DTM reads at ~576, so they
are separate mountains. «Rett opp mot toppen» from west of Tverrelvfoten is
the 888.9 one, its published 899 a pre-scan figure of the Rørnestinden
class. Both went into `SUMMIT_SEED`, which existed for exactly this.

**Nonstinden's first ridge was in the sea.** The corridor draft put «ryggen
nordover fra 155» east of the fjord head, and DTM1 answered Havflate −5.5:
Gullesfjordbotn cuts in between the roundabout parking and the mountain.
The ridge is west of the botn, past the west-side car park, and the line
gives back 43 m around the shore before it starts — stated in the guide.

**The forecast border splits this round too, and the other way.** Queried
per summit: four of five answer to Lofoten og Vesterålen, while
Tverrfjellet — the only summit whose route starts in Kvæfjord's
Austerfjorden — answers to Sør-Troms alone, mirroring Haukebøtinden in the
Tjeldsund round.

**No water anywhere.** After the Tjeldsund round's three re-solves, every
corridor here was probed against the terrain classes before routing —
around Øvre Kobbedalsvatnet, past Revskarvatnet, along the myrene — and the
first solve came back with zero wet vertices on all five lines and
`check_ground.py` at 0 m. The probing is cheaper than the re-route.

**KAST and the card disagree in both directions, and the guides carry
both.** Fiskefjordtindan is KAST 1 – Enkelt with ice axe and crampons on
the gear list and an east face the probe measures at 67.2° under the summit
ridge — grade 3 by the Gråfjell rule. Middagsfjellet is KAST 3 – Komplekst
with a normal line that never passes 27.3° — grade 3 because the
classification describes the surroundings, not the line. Nonstinden's
«four steep descents» measure 21.5–38.9° mean on all eight bearings — the
round's grade 4.

## The Grytøya and Kvæfjord-vest round

Ten more from the Harstad book, in two clusters: six on Grytøya — four of
them from the same Dale trailhead, plus the free ferry quay at Bjørnerå and
the road to the shooting range at Grøtavær — and four in western Kvæfjord,
from Hundstadsætran, Skommesvik, Vebbestadsætran and Melå. Two grade 2
ridges, four grade 3s, and three tours the KAST 3 / axe-and-crampons
classes push to grade 4 by the Gråfjell rule. For the first time every
summit in a round answers to a single forecasting region: NVE resolves all
ten to Sør-Troms (3012), an A-region with a daily bulletin — the previous
two rounds each split 4/1 across regions.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Nona | 58 | 1009 | 1024 | 5.4 | 22.7° | 36.2° | 4 |
| Trolltinden | 2 | 918 | 942 | 4.7 | 21.0° | 36.4° | 3 |
| Stortussen | 58 | 945 | 1024 | 5.5 | 18.9° | 36.2° | 3 |
| Litletussen | 58 | 795 | 765 | 4.0 | 18.9° | 22.4° | 3 |
| Hattfjellet | 81 | 857 | 829 | 4.0 | 21.6° | 31.4° | 3 |
| Slåttheia | 58 | 694 | 638 | 2.5 | 21.8° | 25.0° | 2 |
| Middagstinden i Kvæfjord | 20 | 922 | 908 | 4.1 | 19.2° | 31.4° | 4 |
| Horntindan | 22 | 911 | 934 | 3.9 | 21.8° | 29.4° | 4 |
| Hemmestadfjellet | 38 | 686 | 679 | 3.9 | 25.2° | 34.9° | 2 |
| Melåaksla | 11 | 916 | 964 | 5.9 | 23.7° | 35.5° | 2 |

**The 922 knoll from the Lofast round is a mountain, and now it has its
own tour.** Tverrfjellet's summit forensics last round found two candidate
tops split by a ~576 m col and concluded they were two mountains —
Tverrfjellet (889) and an unnamed 922. The Harstad book's Middagstinden
923 in Kvæfjord is that 922: the summit search resolves 921.9 exactly
where the col analysis put it. The two now carry tours from opposite
fjords — Tverrfjellet from Melåa on Gullesfjorden, Middagstinden from
Hundstadsætran on Kvæfjorden — and the card is the third qualified name
duplicate, *Middagstinden i Kvæfjord*, against the Romsdal one.

**Melåaksla took three candidates.** The register's name stands on the
747 shoulder in the north; the first `SUMMIT_SEED` walked uphill onto a
959.6 top a kilometre south-east of the book's mountain. Published height
names the top: 915 matches the 915.7 summit at 68.63268/16.13913 between
them, so the seed was moved there and the guide tells the story — the
ridge past the cairn keeps rising, because the next mountain in the chain
has already begun.

**A trailhead is where the plough turns, not where the register puts the
farm.** `check_new_corridors.py` found no mapped road within 250 m of the
Skommesvik register point (74 m) that Horntindan's source names as the
start. The corridor was re-anchored on the service road off fv. 850
Revsnesveien at 22 m — the source's «F83» is that road's pre-renumbering
name, worth a line in the corrections because the next researcher will hit
the same stale reference.

**The router cut a lake the research had already walked around.**
Litletussen's corridor says «rundt vatnet på land» — the source crosses
Storvatnet's ice, the line keeps to land, the Snøtindan rule — but the
least-cost solve found 225 m of frozen lake cheaper than the shore.
`check_ground.py` caught it; the fix was declaring `avoidWater` on the
corridor, which is where that intent belongs, and the re-solve came back
41 m longer and dry. With that, all ten lines carry zero wet vertices —
the terrain-class pre-probing from the Lofast round again did the work the
re-route pass used to do.

**Stortussen keeps its 137 m of give-back.** The line loses 137 of the
1024 m it gains — over the 60/123 advisory line — because the source's
route rolls along Storvatnet, Trollvatnet and an undulating summit ridge.
As with Reinspælen, the undulation is the tour: Fri Flyt's own 1080
høydemeter figure carries it, and the guide states the skins-off,
skins-on rhythm instead of flattening the route to please a threshold.

**One transient and one memorial.** Nona's first solve failed on a WCS
GetCoverage 404 from Geonorge — a plain retry succeeded, nothing to fix.
And Trolltinden's source documents a fatal avalanche on 10 March 2019 in
the couloir east of Storelva on Storfjellet; the guide carries it, with
the source's instruction to avoid the innermost north-west bowl where
large slides have run before.

## The Ibestad round

Five from the Harstad book on Ibestad's two islands: four on Andørja —
Northern Europe's most mountain-rich island, twenty summits over 1000 m —
and Sula on Rolla as the round's KAST 1 entry. Langlitinden is the
headline: the Nordic countries' highest summit on an island, 1276 m with
1276 m of prominence, fjord to cairn. Two tours share the road end at
Vang; the KAST 3 / axe-and-crampons classes push four of the five to
grade 4 by the Gråfjell rule. For the second round running, every summit
resolves to a single forecasting region — Sør-Troms (3012).

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Langlitinden | 8 | 1276 | 1305 | 5.5 | 21.5° | 33.5° | 4 |
| Skartinden | 8 | 1149 | 1287 | 4.4 | 24.8° | 38.8° | 4 |
| Kråkrøtinden | 16 | 1186 | 1193 | 5.2 | 21.6° | 27.2° | 4 |
| Ristinden | 44 | 1056 | 1052 | 4.1 | 23.9° | 38.3° | 4 |
| Sula | 22 | 848 | 827 | 3.8 | 17.0° | 21.9° | 2 |

**The summit search went five for five within 1.1 m.** Every SSR register
point resolved onto the DTM1 top at the published height on the first
try — no seeds, no forensics, the cleanest round yet. The corridors
needed one correction: Ytterholla's waypoint elevation (497, not the
442 first written down).

**The lake on Langlitinden's flat got the round's one re-route.** The
source's west route passes "the flat with the small lake"; the first
solve found 251 m of the (unnamed, per SSR) tarn at 575 m cheaper than
its shore. `check_ground.py` caught it, `avoidWater` on the corridor
fixed it — five moved vertices, fourteen inserted, zero metres still on
water — and all five lines ship dry.

**The router and the source describe the same passage differently, and
the guide carries both.** Kråkrøtinden's 40-degree passage is real — the
flank probe puts 42.5–48.0° windows right under the summit in the NW/W
bearings the north route uses — but the model's own line never exceeds
27.2° in a single step, because the track crosses the passage at a
slant. Fall line versus skin track: the guide states both numbers and
why they differ.

**Ristinden has no gentle side.** All eight flank probes average
26.4–42.3° — the only summit in ten rounds where every bearing exceeds
26°. The Breilifatet ramp works because its steep window (52.3°) sits
270–330 m out from the cairn; the guide says stable snow is the ticket
in, not a wish.

**Sula's KAST 1 is the route's, not the mountain's.** The SE flank the
route uses probes 14.7° mean with a 20.5° steepest window — the source's
"slopes just over 20 degrees" confirmed on the line (max step 21.9°) —
but every other bearing holds 50–69° windows tight on the cairn. The
same route-not-mountain pattern as Hemmestadfjellet last round, from the
other end of the KAST scale.

## The Tjeldøya round

Five from the Harstad book: Tjeldøya's four tours — Trollfjellet (the
island's only summit over 1000), Jotind, Helligtinden and Siriskolten —
plus Sebortinden by the Lofast, which starts from the same E10 car park
as Møysalen. The island's four are the app's first tours in the
**Ofoten** forecasting region (3015); Sebortinden answers to Lofoten og
Vesterålen, so after two single-region rounds this one splits 4/1 the
way the first two Harstad-book rounds did. The source's «F711» is
today's fv. 7548 (Tjeldøyveien/Myklebostadveien) — the same
road-renumbering note as F83/fv. 850 and F104/fv. 7784 before it.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Trollfjellet | 3 | 1009 | 1028 | 6.6 | 17.9° | 26.1° | 2 |
| Jotind | 10 | 979 | 1048 | 6.3 | 17.1° | 31.9° | 4 |
| Helligtinden | 9 | 948 | 1029 | 5.4 | 19.9° | 33.3° | 3 |
| Siriskolten | 7 | 659 | 669 | 3.3 | 18.6° | 23.5° | 1 |
| Sebortinden | 23 | 831 | 894 | 4.0 | 24.2° | 31.7° | 4 |

**Tjeldøya has two registered Trollfjellet, and the search found the
wrong one first.** The ssr-nearest pass latched onto a 660 knoll in the
island's north-east; the 1010 summit is the southern register entry east
of Kjerstadtinden, and a `SUMMIT_SEED` on that point walks the disc-grow
to 1008.9. The guide tells the reader the island has a namesake pair —
the same trap Melåaksla and Middagstinden documented from other angles.

**A trailhead can sit on the sea.** `check_new_corridors.py` flagged the
first Valvågen lay-by point as on the water surface — the pocket sits
between road and shore. The start moved to the road's own vertex by the
pollen, and the 672-lake waypoint (a 60 m dip below the shoulder) moved
out of the corridor and into the prose, where undulation belongs.

**Every line dry on the first solve, no re-routes.** Five for five with
zero wet vertices and `check_ground.py` clean — the second round (after
Lofast) where the terrain-class pre-probing left nothing for the
avoidWater pass to do.

**The narrow summit ridge is measured, not just quoted.** Jotind's
source asks for a rope or the summer route around the top; the flank
probe puts 46.4–54.3° windows in the first 60 m on N/NE/E and a lone
6.1° mean on SW — exactly where the summer route rounds. Sebortinden's
Sebortindrenna («avalanches every single year») probes 47.8° mean with a
69.0° window: the guide carries the source's sentence and the number
that backs it.

**Møysalen's car park now serves two tours.** Sebortinden reuses the
moysalen corridor's trailhead verbatim — same coordinates, same OSM
evidence — the first shared trailhead across rounds since the four
Dale tours on Grytøya.

## The island-completion round

Five from the Harstad book that close out three islands: Klåptinden and
Middagstinden på Andørja (the app's fourth qualified name duplicate),
Lasselitinden on western Rolla, and Toppen and Skjellesvikgalten, which
make Grytøya complete — seven tours from Dale to Skjellesvika on the
island that began with Nona. Third consecutive round where every summit
answers to Sør-Troms. One candidate was researched and turned away:
**Åtinden (1108)** has no normal route — both of the source's lines are
45–50° expert couloirs, outside the app's route envelope, and the honest
answer is to say so rather than draw a line the source never described.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Klåptinden | 175 | 998 | 839 | 3.8 | 21.3° | 26.0° | 3 |
| Middagstinden på Andørja | 12 | 630 | 618 | 3.0 | 18.5° | 28.2° | 2 |
| Lasselitinden | 39 | 896 | 863 | 3.6 | 24.2° | 31.3° | 3 |
| Toppen | 40 | 759 | 721 | 2.6 | 21.1° | 29.2° | 4 |
| Skjellesvikgalten | 6 | 987 | 1019 | 4.1 | 21.5° | 32.8° | 4 |

**A published height can name no top at all.** Fri Flyt's
Skjellesvikgalten is «800 moh», but the register's Skjellesvikgalten
(hovudnamn, with Storgalten as undernavn) is the 987 summit, DTM1
agrees to the decimetre, and the east ridge holds no separate ~800 top —
only a shoulder at ~798 on a slope that keeps rising. The inverse of the
Melåaksla case, where the published height picked the right top out of
three: here it picks nothing, so the card carries the register height
and the guide says so in its first sentence.

**Two lakes, two different mistakes.** The first solve clipped 51 m of
Klåpvatnet because the corridor waypoint sat beside the lake, and
crossed 270 m of Toppskarvatnet because the waypoint *was* the lake —
its SSR representasjonspunkt. Both fixed the same way: waypoint moved
ashore, `avoidWater` declared, lines re-solved dry. A tarn's register
point is the middle of the water; a corridor should never pin it.

**KAST 1 with the bluntest hazard text in the book.** Middagstinden på
Andørja's normal route is KAST 1 – Enkelt, and the same page says
avalanches have run on every descent it describes, naturally and
skier-triggered. The guide gives the history more weight than the
class — grade 2, with the wind-loading mechanism (SW wind loads the NE
descent) spelled out.

**A second memorial.** Skjellesvikgalten's south couloirs killed one
person in February 2008; the guide carries it beside the probe numbers
(48.7–54.6° windows), as the Trolltinden 2019 and Sebortindrenna notes
do.

**The container recycle bit once.** After an environment restart,
`generate_routes.py` wrote a routes.json holding only the five new
tours — the gitignored working file had vanished with the container.
`routes_from_ts.py` rebuilt the other 165 from the emitted
`lib/routes.ts` and the five were merged back over it; the emitted
files, not the cache, are the source of truth.

## The Møysalen round

Five more, and for the first time the round is a *chapter* rather than a
district: chapter 9 of the Harstad book, «Møysalen nasjonalpark og omegn»,
the last unopened stretch of the Lofast corridor. Lakselvtindan,
Forkledalstindan and Forselvtinden all start from the big E10 car park
south of Litlvatnet — the one Møysalen and Sebortinden already use, which
now serves five tours, the largest trailhead in the app. Kvasstinden comes
off the car park east of the Austerstraumen bridge. The fifth,
Årbostadtinden, is not in the chapter: it is Andørja's landmark couloir,
and it is here because three of the chapter's own candidates could not
ship. The four Lofast summits answer to **Lofoten og Vesterålen** (3014)
and Årbostadtinden to **Sør-Troms** (3012), both A-regions — a 4/1 split,
like the Tjeldøya round.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lakselvtindan | 23 | 747 | 819 | 5.5 | 20.0° | 26.2° | 3 |
| Forkledalstindan | 23 | 901 | 1024 | 5.6 | 18.6° | 39.9° | 4 |
| Forselvtinden | 23 | 907 | 1180 | 8.3 | 19.0° | 39.0° | 4 |
| Kvasstinden | 3 | 832 | 933 | 4.1 | 22.3° | 28.5° | 2 |
| Årbostadtinden | 9 | 1179 | 1171 | 4.0 | 23.5° | 29.0° | 4 |

**The summit search went five for five within 3.3 m** — 747.0 against 748,
900.7 against 902, 906.7 against 906, 831.6 against 831 and 1179.4 against
1179. No `SUMMIT_SEED`, no forensics, the cleanest round since Ibestad.

### `avoidWater` did not survive the merge, and never had

The round's real finding is a bug the pipeline had been carrying since the
flag existed. `merge_corridors.route_rec()` builds the shipped corridor by
listing the keys it copies — id, name, description, trailhead, waypoints,
source, notes — and `avoidWater` was not among them. So the flag could be
declared in `new_corridors.json`, which is where the *research* records
«the source crosses the ice, the line keeps to land», and be silently
dropped on the way to `corridors.json`.

It was never noticed because it was always repaired by hand. Ten corridors
carried the flag before this round; every one of them got it typed into
`corridors.json` after `check_ground.py` had already reported the line
skiing a lake. The manual fix looked like the workflow.

This round declared it on four corridors and produced the same failure
twice: **Lakselvtindan came back with 665 m of Storvatnet under it and
Forkledalstindan with 710 m**, both at 10 moh — up to 76 m and 62 m from
the mapped shore respectively, so not a clipped corner but the lake. The
fix belongs in the builder, and is there now. The re-solve gave
0 m on water on all four, with 3 + 2 + 5 vertices moved and 11 inserted
between them — and Kvasstinden, which declared the flag and never needed
it, moved nothing.

**The book settles its own contradiction about that lake.** Fri Flyt's
Lakselvtindan says «kryss Storvatnet». The same book's Forkledalen route
(9.11.1), from the same car park, says «følger man Nordsiden av
Storvatnet». The land line is not our invention — it is the other page.

### Two Kvasstinden, and the published height names the right one

Lødingen has two register entries called Kvasstinden 4.3 km apart. The
north-western climbs to 831.6 in DTM1; the south-eastern to 913. Fri Flyt
publishes 831, so the tour is the north-western one, and the search
resolves it to within 0.6 m without a seed. This is the Melåaksla
mechanism — published height picking one real top out of several — and the
exact inverse of Skjellesvikgalten, where the published height named no
top at all.

**Its trailhead is one the book gets wrong twice over.** The Startsted
line reads «stor parkeringsplass langs E10 på østsiden av brua over
Austerstraumen» and the route text opens «fra parkeringa på Husjordøya».
Both cannot hold: Husjordøya sits *between* Vesterstraumen and
Austerstraumen, and the mapped car park (OSM way/179095783, DTM1 3.0 moh)
is east of the Austerstraumen bridge, on the mainland shore. The corridor
follows the parking line, because that is the one that can be checked.

### A published vertical that belongs to a shorter tour

Fri Flyt gives Forkledalstindan «Høydemeter: 700», and the routed line
climbs 1024. Both are right about different tours. Route 9.6.1 is KAST 2
up to «topp som er på 700 meter» — 706.7 in DTM1, and «mange starter
nedkjøringen herfra». Reaching the 901 summit means 9.6.3 Traversen, KAST
3, with downclimbing on snow or rock. The card carries the mountain; the
guide says in its first sentence that the source's figure is the ski tour.

The flank sweep is why it grades 4 rather than 2: **all eight bearings off
Forkledalstindan hold a 37.7–60.0° window inside the first 100 m of the
cairn**. Ristinden was the previous worst case and had every *mean* above
26°; this one has no gentle first hundred metres in any direction at
all. The router still solved it — 39.9° in the steepest 30 m window,
under the 45° wall — because the line crosses the ridge at a slant where
the fall line does not, the Kråkrøtinden pattern again.

### The first route that summits another tour

Forselvtinden's own description begins «følg ruta opp på Lakselvtindan»,
so the line goes over a summit that is itself a card in this app — the
first time that has happened. It is also the round's longest at 8.29 km
and gives back 296 m of the 1180 it climbs, which is what Fri Flyt's 1050
against 884 m of net height was always describing. Møysalen, from the same
car park, gives back 355; undulation is the neighbourhood.

Between 700 and 800 moh the line crosses **1955 m of ground at 2.1°** —
two kilometres of near-flat plateau, and the gentlest 100 m band on any of
this round's five lines.

### Årbostadtinden, mapped end to end

The fifth is the one tour of the round whose whole route is already in
OpenStreetMap: path way/227135840 runs from fv. 7804 at Storelva's outlet
to 40 m from the cairn. DTM1 along it reads 9 → 44 → 327 → 531 → 593 →
630 → 689 → 726 → 813 → 978 → 1174, monotonic, and 1170 m of gain —
*exactly* Fri Flyt's published figure. The routed line gives 1171 m with
**one metre of give-back over 3.98 km**: six tours in the app climb with no
give-back at all, but none of them climbs this much.
The source's «hold til høyre for Storelva» checks out too: the mapped path
runs west of the stream (OSM way/374887831) the whole way.

Its flanks say there is one way up: SW 22.1° mean, W 30.7°, and then N
49.2°, NE 50.3° with 66.8 and 74.7° windows. The couloir is the tour.

### Three turned away

- **Durmålstinden (1005)** and **Svartskardtindan (833)**, both in the
  chapter. Durmålstinden's only line is Sydrenna, KAST 3, whose narrowest
  part is «50 + grader» and usually iced, with a 60 m rope, a rack and
  snow anchors on the list. Svartskardtindan asks for ~50° climbing with
  rope and possible rappel. Same answer as Åtinden last round: outside the
  app's route envelope, and the honest reply is to say so.
- **Viktindan (825)**, which failed for a different reason and is worth
  recording because the evidence looked good. The book gives it **no
  Startsted at all** — the only tour in the chapter without one. Three
  independent sources filled that gap: the E10 lay-by is mapped (OSM
  way/179095787), it sits 660 m from Trolldalen's own register point, and
  the DTM shows the valley bending east exactly where the source says
  «følg denne til den dreier østover». The flank sweep even settles the
  side — N 4.8° mean over 500 m against S 44.7° and SW 49.5°. What none of
  them settle is the three kilometres between that bend and the summit,
  which the source does not describe in any way. A corridor there would be
  drawn, not read, and this pipeline's rule is that only documented routes
  get a line.

### A number that outlived its source

`check_guides.py` was clean on the five new guides on the first run, and
red on fourteen numbers across seven older ones — none of them touched
this round. The cause was not a regression in the prose but in what the
checker could see.

Twelve of the fourteen were the same figure in different guides: the
distance at which the forest lets go. `guide_facts.py` measures and prints
both halves of the treeline — «419 moh etter 3,24 km» — but
`allowed_values()` listed only the metres. Forty-four guides had a hand-written
`problems` note carrying the kilometres and seven did not, and the
difference was who was writing that week, not whether the figure was
measured. `last_forest_km` is listed now, and those twelve are sourced by
the table that produced them.

The last two are one number and are left standing: Taraldsviktinden's
guide puts a stone tunnel «på rundt 450 moh». Its source was an agent
transcript under `/root/.claude/projects/…`, which `enrich_facts.py` reads
and which does not exist in a fresh container — so the figure is
unverifiable here rather than wrong. Overpass knows no tunnel on that
flank at that height; the nearest is Norddalstunnelen, 1.7 km north-west
at 362 m. Deleting a possibly-correct sentence on the strength of a
missing cache would be worse than reporting it, so it is reported: **175
guides, one number outstanding, on a tour from the Tjeldsund round.** The
general lesson is the same one `measurements.json` was created for — a
figure whose only home is a transcript has no home.

**Closed two rounds later**, and not by argument: researching
Taraldsviktinden's second route put the figure back on a tracked source.
Fri Flyt's 3.5.3 states the Tunnel at «ca. 450 moh» and DTM1 reads 452,8
at the corridor point, both now in the research record. See «The
second-route round».

## The town round

Chapter 1 of the Harstad book — «Harstad», the town's own hills. Heia is
the old downhill hill with Maistua halfway up and lights on it on weekday
evenings; Nattmålsfjellet and
Hinnstein are the after-work hills of Kilbotn and Breivikhaugen;
Sørvikfjellet is the steep one above the Kilbotnveien; and Rundfjellet, out
at the DNT hut on Bjørnhaugen, is the chapter's biggest. Every summit
answers to **Sør-Troms** (3012), an A-region — the fourth single-region
round.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rundfjellet i Harstad | 212 | 868 | 774 | 6.9 | 18.5° | 23.9° | 2 |
| Heia | 63 | 527 | 466 | 2.2 | 20.2° | 25.0° | 1 |
| Nattmålsfjellet | 85 | 546 | 479 | 2.7 | 15.1° | 22.0° | 3 |
| Hinnstein | 51 | 560 | 510 | 2.9 | 13.6° | 23.7° | 3 |
| Sørvikfjellet | 61 | 607 | 560 | 3.6 | 20.6° | 26.1° | 4 |

**Every line in the round stays under 26.2° in its steepest 30 m window**,
and only Sørvikfjellet carries an ice axe on the source's list. Heia is the
app's seventeenth grade 1 and its third-shortest line at 2.19 km, and Heia,
Nattmålsfjellet and Hinnstein are three of the fifteen smallest ascents in
the catalogue. The summit search went five for five within 7 m, four of
them inside a metre.

Which is the round's real argument: a 500-metre hill twenty minutes from a
front door is not a lesser object than a 1200-metre one, and three of these
five have put people in avalanches.

### Three of the five carry avalanche history in the source's own words

That is the point of the round, and the reason a cluster of 500-metre town
hills is worth publishing at all. Fri Flyt writes, without hedging:

- **Nattmålsfjellet** — «Selv om Nattmålsfjellet ser enkelt ut er det flere
  plasser det kan gå skred, og det har også gått skred der.» Every ascent
  on the north side other than Nord 1 is KAST 3. The measurement says why
  the appearance lies: the summit is gentle on every bearing — 3.3° SE,
  5.1° SW, 5.3° S — and the steep ground sits 300 to 500 m out, 34.5° NE
  and 35.3° SE. The hazard is what hangs over the track, not what is under
  it, and the guide says so in those words.
- **Hinnstein** — «det er sørøstsiden som tiltrekker flest skikjørere, men
  vær obs på at flere er tatt av skred der.» The side most people ski,
  fifteen minutes from town.
- **Sørvikfjellet** — «vær obs på at det går skred på det bratteste henget
  hvert år.» The flank probe finds it: NE 33.9° mean with a 45.3° window
  180–240 m out, dead in the slab band. The route goes in from the east
  and rounds *south* of the summit to stay clear, which is the source's
  own «det enkleste terrenget litt sør for toppen» — and the guide
  explains that the detour is the safety margin, not a shortcut.

Heia is the counterpart: KAST 1 on all three routes, and the source
volunteering that outside them «kan du enkelt oppsøke heng på 40 grader».
The probe finds those too — 40.6° north of the cairn, 46.0° north-west.

### A sixth qualified duplicate name

`rundfjellet` was already taken by Lofoten's Rundfjellet (803 m, Vågan,
above Vatterfjordpollen), and the collision was not caught by inspection —
it was caught by `resolve_summits.py` printing two lines for one slug and
`summits.json` ending up with one of them. The Harstad one ships as
`rundfjellet-harstad` / **Rundfjellet i Harstad**, the app's sixth
qualified duplicate after Storhornet, Stortinden, Middagstinden twice
and Snøtinden i Tjeldsund — *sixth*, not fifth: this paragraph originally
said fifth and had forgotten Snøtinden. Corrected in the round after.
Worth noting for the next round: nothing in the pipeline refuses a
duplicate slug, and the failure is silent in the direction that loses data.

### `avoidWater`, second outing

The Møysalen round fixed the flag's path through `merge_corridors`; this
round is the first to declare it on a fresh corridor and have it simply
work. Fri Flyt's Rundfjellet says «Gå over Rundfjellvannet», the corridor
says otherwise, and the line came back **0 m on water on the first solve** —
one vertex moved and seven inserted. Storvatnet is the harder half: OSM
relation/4035561 spans 3.8 km north to south with its surface at 134.8 m,
and the first draft corridor ran two and a half kilometres straight down
the middle of it before the west shore was traced latitude by latitude out
of the DTM.

### The band check was reading two thirds of the corpus

`check_bands.py` measures «A grader mellom X og Y moh» claims against the
band they name — the one sentence shape a re-route falsifies silently. It
reported 522 claims over 175 tours and «all agree», and the five guides of
the Møysalen round contributed **none of them**.

The corpus writes the claim two ways. `BAND_FIRST` requires a unit after
the band — «beltet frå 500 til 600 **moh** måler 1,8 grader» — and a large
part of the corpus simply does not write one: «Beltet frå 500 til 600 er
det bratteste i snitt med 21,5 grader». Twenty guides stated a band claim
that no pass had ever read, Skjellesvikgalten, Sebortinden, Jotind,
Melåaksla and Kråkrøtinden among them, and all five of the Møysalen round.

The unit is optional now, with the «beltet» lead-in doing the work of
keeping the pattern from pairing two unrelated numbers, and the three
patterns de-duplicate by band so nothing is measured twice. **690 claims
over 180 tours, all agreeing with the line** — the 168 that had been
invisible were all correct, which is the good version of this news, and
they are checked from here on. Seven guides still parse no claim at all,
down from twenty.

### A number the guide tests caught before CI did

Heia's intro quoted the source's training figure — three laps in an
evening for 1200 høgdemeter — and `lib/guides.test.ts` fails an intro
whose largest vertical figure is not the line's own climb. It is right:
an intro states this tour's ascent, and a lap total belongs to the
descent, where the lap culture is. The sentence moved; the test passes.

### A checker gap measured and left open

`check_guides.py`'s number pattern lists `metres|meters|m` but not the
Norwegian **`meter`**, so `\b` fails against the following `e` and every
«656 meter» in the corpus goes unread. It is not small: **701 occurrences
across 136 of the 180 guides**, none of them currently checked.

It is left open deliberately. Adding the word alone is not the fix —
the surrounding number pattern `(\d[\d\s.,]*)` is loose enough to run
across a sentence boundary, and the first attempt produced
`'929.9.102'` from «929. 9.102 meter» before it produced a single finding.
Doing it properly means tightening the number token and then reading
whatever 701 newly-visible figures turn up across 136 guides, which is a
round of its own and would bury this one. The measurement is here so the
next round can start from it rather than rediscover it.

## The second-route round

Five more ways up peaks that are already on the map. Nine tours carried a
second route before this round, and eight of them are southern —
Galdhøpiggen, Fanaråken, Rondslottet, Snøhetta, Gaustatoppen, Bitihorn,
Slogen and Høgevarde. **Tromsdalstinden was the only one of the 89
northern tours with more than one line**, and its two share a car park.
These five are the first northern peaks to get a second route from a
second trailhead. 180 tours, 194 routes.

| tour | new route | start | gain | km | steepest 30 m | primary for comparison |
| --- | --- | --- | --- | --- | --- | --- |
| Kongsviktinden | Østsia | bensinstasjonen i Kongsvik, 59 | 923 | 4.37 | 30.9° | 1092 m / 9.12 km / 31.6° |
| Taraldsviktinden | Østsiden med Tunellen | båthavna i Kongsvik, 3 | 798 | 4.93 | 33.5° | 779 m / 4.53 km / 22.9° |
| Klåptinden | Sørsiden | Vasskarveien v/Vassmyran, 192 | 808 | 3.09 | 31.7° | 839 m / 3.83 km / 26.0° |
| Nona | Sørsiden | Vaskinn, 17 | 996 | 4.55 | 27.1° | 1024 m / 5.41 km / 36.2° |
| Årbostadtinden | Sørsiden | Holte i Vasskaret, 204 | 998 | 3.86 | 26.7° | 1171 m / 3.98 km / 29.0° |

### What counts as a second route

Fri Flyt lists three to eight numbered lines on most of these mountains,
and nearly all of them are *descents from the same ascent* — variants, not
ways up. `corridors.json` holds a list of routes per tour precisely
because they are **not** variants of one line, so the bar here was two
things at once: a start the source designates separately, and the source
saying in its own words that the line is climbed.

All five clear both. The parking lines carry «for østsiden parkeres det
ved bensinstasjonen i Kongsvik», «for sørsiden parkeres det på liten
lomme i Vasskaret», «for sørsiden parkeres det ... ved Holte»; and the
route texts add «man kan selvsagt gå opp denne ruta også» (Kongsviktinden),
«kan man selvsagt gå opp denne ruten» (Taraldsviktinden), «går man heller
opp fra sørsiden» (Klåptinden) and «lettere å finne hvis man går opp samme
rute som man kjører ned» (Nona).

Two of the five open **Vasskaret** as a trailhead serving two Andørja
peaks from the south, and two open **Kongsvik** — the petrol station and
the boat harbour, 1,8 km apart on the same shore, each the start of a
different mountain's east side.

**Langlitinden was researched and turned away.** Its east side has a
designated parking at Fornes — the one Kråkrøtinden already uses — and the
source sanctions climbing one side and skiing another. But the line runs
off **Blåisen** (SSR, Isbre, 68.86894/17.39566, 350 m from the cairn), and
the standing conditions say no glacier. The Istind round moved a line off
ice rather than ship it; this one is not drawn at all.

### A merge that reverted a hand-set flag

`avoidWater` is copied out of the *research* record by
`merge_corridors.route_rec()` — that was last round's fix. What that fix
did not cover is a corridor whose flag exists **only in corridors.json**,
put there by hand in an earlier round after `check_ground.py` caught the
line on water. Kongsviktinden was one: its research record never carried
the field.

So re-merging it to add a second route dropped the flag, and the primary
re-solved **9.12 km / +1092 m → 7.93 km / +1046 m** — 1.2 km shorter,
straight back across the tarn at 324 moh it had once been taken off. The
tour card's vertical, the guide's numbers and the drawn line would all
have moved, on a route nobody had touched.

It was caught by diffing the re-solved primary against the emitted
geometry in `lib/routes.ts` rather than trusting a merge to be idempotent.
The builder now carries forward any `avoidWater` already on a shipped
route, the research record is backfilled so the flag cannot fall out
again, and the check was run over the whole file: **zero regressions
across all 180 tours and 189 previously shipped routes.**

The re-solve with the flag restored still did not reproduce the shipped
line exactly — 9.12 km but +1080 m against +1092, and 90 m left on water
against zero — which is its own small lesson: an `avoidWater` solve is not
deterministic enough to re-derive a settled line from. So the five
primaries were restored from `lib/routes.ts` with `routes_from_ts.py` and
only the five new alternates spliced in. After resampling, every primary
came back byte-identical: 1092, 779, 839, 1024, 1171.

### `check_guides.py` was reading one route in two

`allowed_values` took the full fact set from `routes[0]` — bands, steepest
step, steepest band, treeline, terrain samples, pinned waypoint
elevations — and from every *other* route exactly four scalars: gain,
distance, start, summit. `guide_facts.py` computes the whole set for every
route.

So any sentence quoting a second route's measured angle was reported as
invented. This round produced two immediately — Taraldsviktinden's «33,5
grader» and Klåptinden's «31,7», both the alternates' own resampled
maxima — and the gap was not new: eight of the nine multi-route guides
already discuss their alternate in the prose.

The per-route collection is now a function applied to every route. Widening
only ever adds allowed values, so nothing that passed before can fail:
**180 guides, 0 unsourced numbers.**

### The Taraldsviktinden tunnel, closed

Two rounds carried an outstanding finding: the stone tunnel's «rundt 450
moh» in Taraldsviktinden's guide came from an agent transcript that does
not exist in a fresh container, so the figure was unverifiable rather than
wrong. Researching the east route settled it from the source itself — Fri
Flyt's 3.5.3 puts the Tunnel at «ca. 450 moh», and DTM1 reads **452,8** at
the corridor point. Both numbers are in the research record and both are
in the guide. The corpus now has no unsourced figure anywhere.

## The gathering-up round

Five more from *Toppturer rundt Harstad*, one from each of four chapters
and two from the same car park: Lundenesgalten on Grytøya, Rundtind on the
Drangen ridge on Rolla, Stortinden in Sortland, and Storlitinden and
Vetefjellet on Kvæfjordeidet. 185 tours, 199 routes.

| tour | start | summit | gain | km | steepest 100 m band | steepest 30 m | grade |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lundenesgalten | 5 | 787 | 788 | 4.65 | 20.5° | 26.2° | 3 |
| Rundtind | 30 | 872 | 880 | 5.97 | 19.2° | 24.8° | 3 |
| Stortinden i Sortland | 13 | 1020 | 1008 | 3.35 | 21.4° | 28.9° | 4 |
| Storlitinden | 167 | 613 | 446 | 2.69 | 16.9° | 19.8° | 1 |
| Vetefjellet | 167 | 547 | 392 | 2.85 | 15.3° | 19.8° | 2 |

The summit search went five for five inside 5.2 m — +5.2, −0.4, −0.7, −1.1
and +1.0 against the published heights — and four of the five answer to
**Sør-Troms** (3012). Stortinden is the exception on both counts: it is in
Sortland, forecast under **Lofoten og Vesterålen** (3014), and its line is
the app's fourth-steepest by average gradient, 1008 m of climbing inside
3.35 km. At the other end, Vetefjellet's 390 m card vertical is the
fourth-smallest in the catalogue, and Storlitinden is the eighteenth
grade 1.

### Sandvatnet is a reservoir, and the first line went straight over it

`check_ground` is the pass that reads the finished line against OSM's
water, and on the first Rundtind solve it returned **900 m on the ice at
240 moh, up to 87 m from the mapped shore, on a REGULATED lake**. The lake
is `relation/5577731` — Sandvatnet, also called Mevatnet, `water=reservoir`,
NVE reservoir 743, `ele` 240 with `ele:min` **231**. Nine metres of
drawdown.

The source never asked for it. Fri Flyt's 5.3.1 says «gå innover myrene» —
go inland across the bogs — and the router took the flat lake instead
because flat is cheap. Two things were wrong and both were fixed:

- The corridor's «vegenden» waypoint sat at 68.76819/17.00879, which DTM1
  answers at 240.1 m **with no terrain class at all** — the giveaway that
  the point is on a water surface rather than on ground. It moved to the
  last road vertex on land, 68.76781/17.00879, 245.7 m, classed `Skog`.
- The route got `avoidWater` — the flag the Møysalen round had to repair a
  path for through `merge_corridors`, and the town round then exercised on
  a corridor that declared it from the start.

The lake was not new to the pipeline. The Sør-Troms round had already
routed Stortinden på Rolla around its east shore — under its other name,
Mevatnet — and had to do it **twice**, first adding a waypoint east of the south end
when `check_ground` found 315 m of ice, then another when the second solve
still clipped the southern tip by 45 m. That fix was geometry: two hand-placed
waypoints on one corridor. `avoidWater` is the same fix stated as a property
of the route, and it took one pass on Rundtind. A corridor that touches a
regulated lake should reach for the flag before it reaches for waypoints.

The re-solve came back **0 m on water**, and the terrain samples along the
line changed from `InnsjøRegulert, InnsjøRegulert, InnsjøRegulert` to
`Myr, Myr, Myr`. That is the source's own sentence, in Kartverket's
vocabulary. The tour went from 6.07 km / +857 m to 5.97 km / +880 m and
its steepest 30 m window from 22.5° to 24.8°: going round the magazine
costs a hundred metres of distance and twenty of climbing.

### A waypoint beside the road reads nothing like the road

The same corridor had an earlier defect that `check_new_corridors` would
have reported as *«gives back 33 m»*: a point called «traktorvegen» at
68.75600/17.00600 read **272.6 m**, higher than the road end 1.3 km
further on at 240.1 m. The point was not on the road. It was on the
hillside beside it, and a tractor road that switchbacks up a forest slope
has a hundred metres of relief within a hundred metres of itself.

The fix was to stop guessing where a road is and fetch it: `way/1024678361`
Drangenveien has 99 vertices, and reading DTM1 at every third one shows the
road itself rolling between 224.8 and 267.7 m across those samples before
dropping to its end.
Both waypoints now sit on real vertices — 68.75375/17.00098 at 224.8 and
the road end — and the corridor climbs monotonically from 30 to 872.

### Where the book measures its vertical from

Storlitinden and Vetefjellet start from the same car park, the mapped
`way/428852981` «Kvæfjordeidet» at 167.2 m, and both come out about 45 m
above Fri Flyt's stated climb: 446 against 400, and 392 against 350. Two
tours off by the same amount from the same point is not rounding, and it
is not the router either. It is the book measuring from somewhere else,
and in both cases the somewhere else is findable:

- **Storlitinden.** 613 − 400 = 213, and Kvilheim, the fritidsbolig where
  the tractor road starts, reads **213.5** on DTM1.
- **Vetefjellet.** 547 − 350 = 197, and the source's own preferred start is
  a small car park at a cabin field, which it places «1,5 km lengre vest»
  of nothing in particular — measured the other way, the cabin-field roads
  east of Kvæfjordeidet sit **1488 m** from the plowed car park, twelve
  metres off the stated figure, and read **185 to 203 m** on DTM1.

Neither start is in OpenStreetMap; the plowed municipal car park at the
Kvæfjord ski trails is, and the source names it for both tours — for
Vetefjellet explicitly as the alternative, «følge skogsvei over Olaåsen»,
which is the way the corridor goes. So the cards carry the measured
climb from the mapped start, and both guides say in their own prose where
the book's smaller number comes from.

### One `check_ground` finding that is the check misreading a car park

Vetefjellet came back with a trail note: the guide «says «skiløypene» and a
mapped trail runs the whole way … but the line strays 536 m from it». It is
a false positive, and a useful one to have on record. The word is in the
guide because the *car park* is called that — the source's own «stor brøytet
parkeringsplass ved skiløypene» — not because the route follows a piste.
Kvæfjordløypene run west towards Koven, which is Storhornet i Kvæfjord's
tour; Vetefjellet goes east over Olaåsen and off the trail network
immediately, exactly as the source describes it. The note is written into
the guide's `problems` so the next reader does not re-open it.

### A seventh qualified duplicate name, and a miscount in the round before

`stortinden` was already Rolla's (1020 m, Ibestad), so Sortland's ships as
`stortinden-sortland` / **Stortinden i Sortland**. Writing that up meant
counting the qualified names, and the count in «A sixth qualified duplicate
name» above was wrong when it was written: it listed Storhornet,
Middagstinden twice and Stortinden, and forgot **Snøtinden i Tjeldsund**.
Rundfjellet i Harstad was the sixth, not the fifth, and this one is the
seventh. That paragraph now says so.

### What was turned away

Chapter 8, *Evenes og Skånland*, is the one chapter of the book that
contributes nothing to the app, and it is worth writing down why so the
next round does not re-research it:

- Four of its five summits — Grindalstind, Pungdalstinden,
  Skittendalstinden, Villdalsfjellet — are approached from Blåvatnhytta,
  which is itself KAST 2, five hours and 560 høgdemeter in from Bogen,
  past a regulated lake the source calls «noen plasser utrygg is». That is
  a hut trip, not a day tour.
- The fifth, **Nøvatinden**, is graded M2 and asks for «stegjern, to
  isøkser, 60 m tau, lite sikringsrack med normale størrelser og en stor
  tricam», with 45–50° of rotten rock and a rappel off the top. Rope and
  rack are outside what this app carries, the same bar that turned away
  Åtinden, Durmålstinden and Svartskardtindan.

Two more lines were turned away inside tours that did ship. Lundenesgalten's
4.8.2 **Nordtind – Galten** is an alpine variant needing 30 m of rope, axe,
crampons and a small rack for a 45–50° step. Stortinden's 2.6.1 **Sørøst**
starts at a farm on the west side of Langvatnet where the source requires
the landowner's consent and no parking is mapped, so the tour ships from
Vangpollen instead — which is also the start the source designates
without conditions.

The book still has day tours left in it after this round.

## The ten-route round

Ten more ways up peaks the app already carries, all from the northern
Fri Flyt books — Tromsø, Troms, Lofoten, Bodø and Harstad. 185 tours,
**209 routes**, and 22 tours with more than one line. Kjølen and
Strandtinden are the first two to carry three.

| tour | new route | start | gain | km | steepest 30 m | primary for comparison |
| --- | --- | --- | --- | --- | --- | --- |
| Kjølen | Fra Kvaløysletta | Kvaløysletta sykehjem, 26 | 805 | 6.76 | 23.1° | 578 m / 4.11 km / 24.9° |
| Kjølen | Fra Slettaelva | Slettaelva, 59 | 809 | 6.26 | 34.7° | ″ |
| Fagerfjellet | Henrikskaret | Fagerelva, 32 | 929 | 3.09 | 30.0° | 947 m / 4.30 km / 25.6° |
| Store Skalltinden | Bjørnskardalen | Bjørnskar, 10 | 966 | 6.13 | 32.1° | 981 m / 6.04 km / 27.0° |
| Storfjellet | Østhenget | Krokenga, 15 | 1074 | 3.66 | 30.7° | 1053 m / 3.27 km / 36.5° |
| Strandtinden | Kåringen | E10 ved Kåringen, 159 | 1063 | 8.18 | 22.8° | 1156 m / 5.86 km / 29.1° |
| Strandtinden | Kanstadbotn | E10 i Kanstadbotn, 15 | 1140 | 7.68 | 30.8° | ″ |
| Rundfjellet | Kudalsheia | avkjørselen mot Kudalsheia, 39 | 797 | 3.29 | 28.1° | 890 m / 5.28 km / 31.2° |
| Sandhornet | Nordøstsiden | Ravika, 4 | 1018 | 5.28 | 36.1° | 1021 m / 5.01 km / 32.5° |
| Hemmestadfjellet | Vestsiden | Gammelgårdsbukta, 18 | 668 | 2.44 | 26.2° | 679 m / 3.88 km / 34.9° |

The eight tours were re-routed in full, primaries included, and every
shipped primary reproduced its geometry exactly — same vertex count, same
length, same gain and same steepest step after resampling. That is the
check that matters when adding a route to a tour that already has one.

### The Tromsø book writes the bar into its own headings

The second-route round had to argue, case by case, whether a numbered
line was a *way up* or a *way down*. The northern books settle it
typographically. Tromsø, Ringvassøya and Senja print **`OPP:`** and
**`NED:`** inside each numbered route, so «4.11.2 HENRIKSKARET … OPP: Det
er mulig å velge startsted ved utløpet av Fagerelva» is a sanctioned
ascent from a designated start in one sentence, and «8.5.2 SØRVESTSIDEN»
with no `OPP:` block is a descent line and nothing else. Lofoten and Bodø
use the same idea with a heading — `ALTERNATIV OPPSTIGNING`, `Opp
(nordøstsiden)`.

Scanning the 95 Fri Flyt pages fetched for this round — one per shipped
tour outside the Harstad book — for that shape, together with the Harstad
pages already on disk, produced fifteen candidates; ten survived a read.

### Two of them are second *starts* the source names in its own facts line

- **Kjølen** publishes four. Its Startsted line reads «Kvaløysletta /
  (OPP 1 og OPP 2), Storelva / (OPP 3) og Finnvikdalen (OPP 4). Ulike
  parkeringer», and each of 2.4.1–2.4.4 is a separate walk-up with its
  own car park and its own bus stop. The app had OPP 4; it now has OPP 1
  and OPP 2 as well.
- **Rundfjellet** names Kudalsheia first and calls the app's shipped
  start the alternative: «Alternativ startsted er Vatterfjordpollen.» The
  north side is two kilometres shorter and gentler in its steepest step —
  28.1° against 31.2° — and the source's warning for it is the surface,
  not the angle: «Fra Kudalen på nordsiden er det ofte steinhard skare
  siste kneika, ta med stegjern og isøks.»

### One of the new lines is steeper than the book's own «steepest point»

Kjølen's facts block says **«Bratteste punkt: Under 27 grader»**, and
that holds for the routes it was written about: Finnvikdalen measures
24.9° in its steepest 30 m window and Kvaløysletta 23.1°. The Slettaelva
line measures **34.7°, between 350 and 371 moh**, on the pull out of
Svarthammardalen. It is the same mountain and the same book page, and the
number in the facts block is not true of all four of its own routes. The
guide says so in those words rather than repeating the book.

### A lake the source sends you across, and one it does not

Store Skalltinden's Bjørnskardalen route is written «opp til og over
Bjørnskardvatnan», so the ice is the route. `check_ground` found the
solved line on water at three heights, and the three are not the same
kind of thing:

- **220 moh** — Nedre Bjørnskarvatnet (`relation/9929007`, ssr 534110)
  and **250 moh** — the main lake. Both are members of Bjørnskarvatnan,
  both read `Innsjø` rather than `InnsjøRegulert`, and both are what the
  source means.
- **480 moh** — an unnamed tarn (`way/714508198`, NVE vann 66673) on the
  broad ridge above the col, which nothing sanctions.

Two corridor edits — moving «ryggen» to 69.871/19.304 and inserting «sør
for tjernet» at 69.872/19.309 — took the high crossing from 135 m to 89 m
and no further: the broad ridge the source tells you to follow runs over
that tarn. So the guide names all three heights, which is what
`check_ground` asks for and what a reader needs, and the record says which
of the three the source actually chose.

### `emit_new_tours.py` silently dropped a `hasGuide`

Found while emitting this round: **Vetefjellet shipped in the previous
commit without `hasGuide: true`**. The cause is a re-run. `emit_new_tours.py`
rebuilds a tour's `TOURS` row from `route_metrics.json` and `tourmeta.json`,
and `hasGuide` lives in neither — it is written by `emit_guides.py`. Running
the tour emitter *after* the guide emitter therefore erases the flag, and
the previous round did exactly that when a teaser figure was corrected.

Nothing caught it. `check_tours.py` does not read the flag, and
`lib/guides.test.ts` checks that every tour claiming a guide has one —
`TOURS.filter(t => t.hasGuide)` — which is the safe direction only. A tour
that *has* a guide and does not claim it passes every check and shows the
reader nothing. The root README already warns that `emit_new_tours.py`
must be given slugs; the sharper rule is **run `emit_guides.py` last**.

### What was turned away

Five candidates read like second routes and are not, and the reasons are
worth keeping so the next round does not re-research them:

- **Snøtindan 2.7.2 Østruta** from Gullesfjordbotn camping — a designated
  start and a described line, but it traverses Vestbotntinden and drops to
  Øvre Storelvvatnet before the final climb. A two-summit day, not one
  ascent.
- **Kjølen 2.4.3 Fra Storelva** — the ski stadium is mapped, but the line
  «opp til Rødtinden og videre over Storbogstinden, forbi pkt. 530 moh.»
  crosses a col that DTM1 reads at 230–270 m between two tops at 470 and
  567. That is a 300 m re-climb, and the book's 530 does not resolve on the
  ground between them.
- **Istinden, from Tunebrua** — a designated alternative start, but the
  middle is «finn den beste veien gjennom skogen», and the round that
  shipped Istinden had already established that the forest road there «som
  regel ikke [er] brøytet». It is the exit, not the start.
- **Reinspalen 2.10.3/2.10.4 from Bømarka** — the summer route, from a
  named start, but the source says of both that «om du kommer til selve
  toppen ved å følge ryggen er ikke alltid sikkert». A line that may not
  reach the summit is not a route to it.
- **Skogshornrenna, from Lykkjastølen** — a designated start and an
  explicit «bør du gå denne ruta opp», but the couloir averages 40° with
  steeper passages and two rock steps to drop, and the source calls it
  «forbeholdt eksperter».

Beyond those, the usual: Nonstinden's three other lines, Trolltinden's
Bollen and Østrenna, Helligtinden's Østskåla, Snøtinden's Sørvestsiden and
Trollfjellet's Vestsiden 2 are descent variants from the same car park,
and Strandtinden's Kvannto needs a rappel off the summit.

## The southern second-route round

Five more ways up peaks the app already carries — and the first round of
second routes to leave the north. Jotunheimen, Rondane, Sogn, Trollheimen
and Andørja. 185 tours, **214 routes**, 26 tours with more than one line.
Rondslottet becomes the third with three.

| tour | new route | start | gain | km | steepest 30 m | primary for comparison |
| --- | --- | --- | --- | --- | --- | --- |
| Glittertinden | Fra Spiterstulen | Spiterstulen, 1103 | 1390 | 10.24 | 25.2° | 1228 m / 13.33 km / 18.5° |
| Rondslottet | Fra Bjørnhollia | Bjørnhollia, 913 | 1538 | 12.31 | 33.7° | 1283 m / 12.34 km / 34.9° |
| Molden | Frå Marifjøra | kaia i Marifjøra, 1 | 1131 | 5.28 | 36.3° | 626 m / 3.31 km / 23.3° |
| Snota | Frå Trollheimshytta | Trollheimshytta, 533 | 1356 | 11.61 | 28.5° | 1268 m / 10.22 km / 28.9° |
| Langlitinden | Rytterkløfta frå Vasskaret | Vasskaret, 210 | 1170 | 6.78 | 37.5° | 1305 m / 5.53 km / 33.5° |

### When Fri Flyt runs out, ut.no starts

The ten-route round scanned every Fri Flyt page behind a shipped tour and
took the ten that met the bar. There is no
eleventh: the remaining numbered lines are descent variants from the same
car park, couloirs at 40–50°, or lines the source itself says may not reach
the summit.

ut.no is the other half of the corpus, and it is shaped differently. Fri
Flyt writes one page per mountain with numbered routes inside it; ut.no
writes **one turforslag per route**, and the title normally names the start:
«Topptur til Glittertinden fra Spiterstulen», «Snota 1668 fra
Trollheimshytta», «Fottur til Molden frå Marifjøra». Where Fri Flyt makes
you decide whether a numbered heading is a way up, ut.no's page *is* a way
up, with its own distance, gain, duration, season and grading. Four of this
round's five came from there; the fifth is a Fri Flyt line that had been
read past twice.

The trip data sits in the page's `__NEXT_DATA__` blob rather than the HTML,
so the description comes out verbatim rather than through a summariser —
which matters when the guide has to quote it.

### Four candidates that were the shipped route wearing another name

The expensive failure mode in this round was not a bad route, it was a
route that turns out to be the one already on the card. Four got far enough
to be worth writing down:

- **Torvløysa frå Hatlestad-gardane.** Fri Flyt describes it, ut.no is the
  app's source, and the two looked like different mountains' worth of
  approach — until `generate_routes.py` printed the trailhead name and it
  read `Hatlestad i Norddal`. The corridor had already been written,
  measured and merged. **The router's own output was the check that caught
  it**, which is an argument for reading that column rather than skipping to
  the totals.
- **Molden frå Krossen.** 1116 − 620 = 496; the shipped Mollandsmarki start
  reads 501. Same place, different name on the sign.
- **Snota frå Gråsjøen.** ut.no's «P-plass ved enden av veien» is
  `way/236522760` — which is the mapped parking the shipped Gråhaugen route
  already starts from, to the metre.
- **Kvamshesten frå Stølshaugane i Bygstad.** A different car park, but the
  line passes Kårstadstølen and Grunnevatnet exactly as the shipped one
  does. A nearer parking on the same route is not a second route.

The rule these four sharpen: **check the shipped trailhead's coordinate, not
its name**, before researching a corridor.

### A steepest step that is a descent

Rondslottet from Bjørnhollia has its steepest 30 m window at **33.7 degrees
between 926 and 896 moh** — the numbers run downhill. The route leaves the
hut at 913, climbs onto the shoulder north of it, and drops back into the
mouth of Langglupdalen before the real climb starts; that dip is steeper
than anything above it. `guide_facts.steepestStep` records the window's two
elevations rather than assuming the first is the lower, so the fact survives
into the guide intact, and the guide says plainly that the steepest ground
on the line is not in the climb at all.

It is also why this line gives back 273 m against Dørålseter's 143 and
Spranget's 187, and why it is the biggest ascent on the mountain — 1538 m
from the lowest of the three starts.

### Re-routing a tour can move its other lines

The ten-route round re-solved eight tours in full and every shipped primary
came back with identical geometry. This round re-solved six and **four
primaries moved**: Glittertinden 13 325 → 12 878 m, Molden 3308 → 3016,
Torvløysa 11 130 → 10 612 and Rondslottet's Dørålseter line 12 455 →
11 406. Same corridors, same code, different lines — a few hundred metres
of route, and up to 47 m of stated gain.

The likeliest cause is the DTM tile cache: `router.py` solves on a
downsampled grid, and a tile re-fetched at a slightly different extent
shifts every cell boundary, which is enough for Dijkstra to prefer a
different equally-cheap path. The cache directory is gitignored and was
rebuilt between the two rounds.

What matters is that this is *recoverable and must be recovered*. The
Møysalen round's procedure is now the standing one for adding a route to an
existing tour:

1. `generate_routes.py` and `resample_dtm1.py` for the affected tours.
2. Keep the new routes out of `routes.json` for a moment.
3. `git checkout -- lib/routes.ts && python3 routes_from_ts.py` — this
   restores every shipped line from the committed artefact.
4. Splice the new routes back in, and check that each primary reports its
   committed distance, gain and steepest step.

After that the five primaries here report exactly what they reported before
the round: 1228/13 325/18.5, 1283/12 337/34.9, 626/3308/23.3,
1268/10 221/28.9 and 1305/5528/33.5.

## The second-start round

Five more ways up peaks the app already carries, and the first round where
every one of the five is a start the source **names in its own facts line**
rather than a line buried in a route description. 185 tours, **219 routes**,
31 tours with more than one line. Bergen, Sunnfjord, Rosendal and two in
Narvik — the widest spread of any round so far.

| tour | new route | start | gain | km | steepest 30 m | primary for comparison |
| --- | --- | --- | --- | --- | --- | --- |
| Melderskin | Frå Myrdalsvatnet over Omnen | Myrdalsvatnet, 367 | 1101 | 5.10 | 33.8° | 1273 m / 4.90 km / 30.6° |
| Gullfjellstoppen | Frå Gullbotn over Gullfjellhalsen | Gullbotn, 244 | 753 | 3.96 | 26.1° | 839 m / 7.80 km / 27.4° |
| Snønipa | Opp via Veitebergsdalen | skogsvegen, 290 | 1673 | 9.27 | 30.3° | 1494 m / 8.45 km / 27.6° |
| Beisfjordtøtta | Frå Narvik gjennom Tøttadalen | Taraldsvikfossen, 205 | 1351 | 9.03 | 27.0° | 1428 m / 7.19 km / 38.4° |
| Spanstinden | Opp frå Lapphaugen turiststasjon | Lapphaugen, 350 | 1111 | 4.80 | 28.5° | 1047 m / 5.24 km / 25.0° |

### The `Startsted:` line is a better index than the route numbering

The ten-route round scanned Fri Flyt's *numbered routes* and declared the
corpus exhausted; the southern round went to ut.no because of it. Both were
reading the wrong field. Fri Flyt's fact box has a `Startsted:` line, and on a
mountain with more than one start it lists them all:

    Startsted: Osevann i Bjørndalen, Gullbotn ved Trengereid eller Bontveit
    Veibeskrivelse: A: … inntil Bukkemyrvatnet. B: … parker ved Lapphaugen turiststasjon.

Comparing that line against the trailhead each tour actually ships is one
`grep` over the cached pages, and it produced about thirty leads where the two
disagreed. Three of this round's five came from it directly (Melderskin,
Gullfjellstoppen, Spanstinden), and the scan is cheap enough to re-run whenever
the corpus grows.

Melderskin is the sharpest case. The app climbs it from **Kletta, 154 moh**,
which is ut.no's summer path. Fri Flyt has never described that line: its
`Startsted:` is **Myrdalsvannet**, and its «Opp» paragraph goes up Nipelva to
Omnen and along the ridge. Myrdalsvatnet was *already a mapped trailhead in the
app* — Juklavasstinden starts there — so the two routes share their lower
approach and the second one cost nothing but the reading.

### Two of the five are the same route with a longer approach, and that is fine

Beisfjordtøtta from Narvik and Spanstinden from Lapphaugen both rejoin the
shipped line partway up. The bar does not ask for a different mountain; it asks
for *a start the source designates separately* and *an explicit sanction that
the line is climbed*. Both clear it in the source's own words — Fri Flyt writes
«man kan også starte turen fra Narvik og følge den populære turstien … Herfra
kan du følge turbeskrivelsen videre», and lists Lapphaugen as start **B** — and
both are different enough on the ground to be worth drawing: the Narvik line is
1.8 km longer with 4.8 km of forest instead of 300 m of steep hillside, and
Lapphaugen is 74 m lower than Bukkemyrvatnet and gains 1111 m in 4.80 km rather
than 1047 in 5.24.

What was turned away, by contrast, is the case where the source's *second*
description opens with «Start turen på samme måte som 1.2.1» — Beisfjordtøtta's
own 1.2.2 and 1.2.3, Skjomtinden 1.11.2, Litletind 1.12.2. Same car park, same
first hour: a variant, not a route.

### A summit cell can be an island

Beisfjordtøtta's alternate would not route at all. The last leg — the col at
1257 to the cairn at 1448 — failed with «no route», on a corridor whose primary
solves the identical stretch every time.

The cause is the routing grid. `Router` sizes its DEM from the corridor's
bounding box, and the Narvik start is 4.3 km further west, so the cells land
differently. On that grid the summit coordinate falls in a cell reading
**1394 m, on the lip of the drop to Beisfjorden**, with 1436 to 1447 m of
plateau one cell away in every direction the route arrives from. Forty-two to
fifty-three metres over a 10.4 m cell is 76 to 79 degrees, so every edge into
the target failed the 45-degree test and the destination was unreachable —
not blocked, not sea, just an island.

`snap()` did not catch it because `snap()` only steps around cells that are
*blocked*: nodata and sea. A cell that is fine in itself and has no passable
step into it is a different failure, and it had never been hit before because
no shipped corridor put a cliff-side summit on an unlucky alignment.

`Router._reachable_near()` is the fix: after a leg has already failed, search
outwards from the target for the nearest cell the Dijkstra pass actually
reached, preferring the highest among equally near candidates. It runs **only
on a leg that would otherwise raise**, so no line that routes today can move
because of it — and Beisfjordtøtta's own primary re-solved to the metre
(7188 m, +1428, −40, 38.4°) after the change, which is the check that matters.
`build()` then re-pins the finish to the true summit coordinate and re-reads
the last 400 m off a 1 m tile, as it already did.

### `avoidWater` does not scale to a nine-kilometre line

Snønipa's Veitebergsdalen line passes a glacier lake at 1103 moh that the
source sends you *towards* and never says to cross, so the first attempt set
`avoidWater: true`.

It ran for twenty-five minutes on that one line without finishing, at zero CPU
the whole time. `_off_water()` reads each leg every 2.5 m and asks Kartverket
for the terrain class at every sample, up to eight passes. On a 9.3 km line
that is on the order of twenty thousand HTTP round trips at about 0.7 s each —
hours, not minutes. Every corridor that had needed the flag before was two to
five kilometres, so the cost had never shown.

The flag came off and the geometry did the work instead. `check_ground.py`
caught the first line crossing **541 m of the lake, up to 119 m from the mapped
shore**: a single waypoint east of the water is not enough, because Dijkstra
cuts the corner on the 1.4 km leg up from Sollibotnen. Three points along the
south and east shores — 1117, 1147 and 1188 moh, all read from DTM1 — put the
line round it on land, and `check_ground` came back clean. A fourth at 1110 in
the middle of the east shore was tried and taken out again: it cost 37 m of
give-back without moving the line.

That leaves a real limitation written down rather than hidden: **`avoidWater`
is affordable up to about five kilometres of line, and past that the corridor
has to route around the water itself.** The check that would have caught a
mistake either way is `check_ground.py`, which is cheap because it runs once
per finished line rather than eight times per leg.

### `check_bands.py` was measuring every claim against the wrong line

`check_bands.py` measured every «A grader mellom X og Y moh» claim against
`routes[0]` — the tour's own line — and said so in its docstring. That is right
for the intro and the caption, which describe the tour, and wrong for the
paragraph a multi-route guide gives its *second* route. This round's first
draft walked into it: six claims were reported as disagreeing when each was a
correct measurement of the alternate, compared against the primary's bands.

Chasing that down turned up two shipped sentences doing the same thing and
never being read at all:

- **Molden**, «det brattaste hundremetersbeltet 21,0 mellom 300 og 400» — the
  primary starts at 501 moh and has no vertices in that band, so `band_angle`
  returned `None`, and the claim was skipped rather than checked. 21.0 is
  Marifjøra's figure, and correct.
- **Glittertinden**, «det brattaste hundremetersbeltet 21,2 mellom 1900 og
  2000» — written with neither «grader» on the angle nor «moh» on the range, a
  shape none of the three patterns read. The primary measures 12.4 there. 21.2
  is Spiterstulen's, and correct.

Both sentences were right and neither was verified, for four rounds. So the
check changed rather than the prose:

1. A fourth pattern, `BAND_NOUN_ANGLE_FIRST`, reads the band-noun → angle →
   range order with the unit optional on both. It reads 18 claims no other
   pattern does, 16 of them written in earlier rounds and never measured.
2. A claim is measured against **every route of the tour**, and reported only
   when it matches none of them. That is still exactly the drift the check
   exists for — a line that moves leaves its sentence matching no route at all
   — and it stops reporting a correct second-route measurement as a defect.
3. A claim that matched a second route is listed separately, and its
   *superlative* is judged against that route's own table rather than the
   primary's. A «brattaste beltet» claim about the alternate is now a checked
   claim, not an unread one.

The corpus goes from 722 measured claims to 750 — the new pattern and this
round's five paragraphs between them — all agreeing, with fourteen now labelled
as describing a second route. That label is the thing to watch: a
second-route claim appearing in an `intro` or a `caption` would be a sentence
written about the wrong line.

### Re-routing moved three primaries again

Same as the southern round, and by now expected: re-solving these five tours
moved Melderskin (4897 → 5080 m), Gullfjellstoppen (7802 → 7799) and Snønipa
(8450 → 8294), while Beisfjordtøtta and Spanstinden came back identical. The
standing recovery procedure was followed — `git checkout -- lib/routes.ts &&
python3 routes_from_ts.py`, then splice only the new routes in — and all five
primaries report their committed distance, gain and steepest step:
1273/4897/30.6, 839/7802/27.4, 1494/8450/27.6, 1428/7188/38.4 and
1047/5242/25.0.

### What was turned away

Twelve candidates were read in full and rejected:

- **Englafjell frå Musland** — Fri Flyt's «Opp» says «ta av mot Musland», which
  is the shipped trailhead's own name.
- **Hornindalsrokken** — one «Opp», from Langøylia, which is the shipped start.
  The other two numbered lines are descents.
- **Gullfjellstoppen frå Bontveit/Hausdalen** — a real third start, but the
  source names three possible lines from it and describes none: «gå enten den
  tradisjonelle ryggruten via Livarden/Austlirinden eller inn i Brekkedalen».
  A start without a route is not a route.
- **Gygrastolen, «Opp (alternativ 2)»** — starts from Gygrastølvannet, on the
  shipped approach, and ends «i en luftig egg hvor tau og sikringer kreves».
  Fails the start test and the no-rope rule.
- **Skrott, «ALTERNATIV OPPSTIGNING»** — a shortcut from the ski hut on the
  shipped line. Same start.
- **Skogshorn, «ALTERNATIV OPPSTIGNING»** — Skogshornrenna, a 40-degree
  couloir the source says «må kun gås under stabile snøforhold»; already turned
  away in an earlier round and turned away again.
- **Beisfjordtøtta 1.2.2 and 1.2.3**, **Skjomtinden 1.11.2**, **Litletind
  1.12.2** — all four open by sending you up the shipped route. Variants.
- **Mjølvafjellet 2.28.4, frå Vengedalen over Halsaskaret** — a genuinely
  separate start with a full description, but it is «Komplekst», needs
  «Stegjern og Isøks», gives back 70 m onto a knife-edge and has «45 graders
  passasje på ryggen» with the skis on your back. At 45 degrees the router's
  own limit is the honest answer: this is not a skinning line.
- **Finnbufjellet frå Myrkdalen skisenter** — named as an «alternativ
  tilkomst» you *meet* after an hour, not a start that is described.
- **Varden/Småtindan, Vassdalstinden, Storhornet** — the failure mode the
  southern round wrote up, again: a `Startsted:` whose *name* differs from the
  shipped trailhead's but whose *coordinate* is the same place. Kabelvågmarka
  is signposted to Eidet, Vallasætra is up the Nupen road past the barrier, and
  Bree is where the shipped Storhornet already starts.

## The index round

Four more ways up peaks the app already carries — and the round that stopped
guessing which page to read. 185 tours, **223 routes**, 35 tours with more
than one line.

| tour | new route | start | gain | km | steepest 30 m | primary for comparison |
| --- | --- | --- | --- | --- | --- | --- |
| Snøtindan | Østruta frå Gullesfjordbotn | Gullesfjordbotn camping, 3 | 1439 | 9.13 | 36.5° | 1548 m / 9.04 km / 33.8° |
| Lønahorgi | Frå toppen av Horgaletten | toppstasjonen, 948 | 506 | 3.66 | 24.4° | 1307 m / 6.71 km / 28.9° |
| Steindalsnosi | Sørsida frå Turtagrø | Turtagrø, 884 | 1172 | 7.83 | 28.4° | 764 m / 3.99 km / 30.3° |
| Horndalsnuten | Sørruta frå Skaftedalen | Skaftedalen, 486 | 1007 | 5.76 | 27.7° | 1121 m / 5.93 km / 31.4° |

It is four and not five, and the reason is the point of the round.

### The corpus, indexed

Five rounds have looked for second routes by reading the Fri Flyt page behind
each shipped tour. That works while there are unread pages, and every round
has ended by declaring the seam thin and then finding more the next time —
which is the signature of a search with no index rather than a corpus with no
routes.

So this round built the index. `friflyt.no/topptur` lists 25 region pages, and
each region page lists its route pages: **580 pages in all**. Every one was
fetched. That turns "have we read everything?" from a judgement into a query.

Against that index, four scans:

1. **`multistart.py`** — the fact box's `Startsted:` / `Veibeskrivelse:` line
   naming more than one start (`eller`, `A:`/`B:`, `alternativ`).
2. **`altstart.py`** — prose anywhere on the page that sanctions starting
   somewhere else («man kan også starte turen fra …», «Alternativt startsted
   ved …»). This is the idiom Beisfjordtøtta's Narvik start is written in, and
   no heading-based scan sees it.
3. **`headscan.py`** — two or more ascent headings on a page belonging to one
   of my tours, or an ascent heading naming a place («Opp frå X»).
4. **`sanction.py`** — a line the page files under `NED` that the source
   nonetheless says to climb («Før Sognefjellet opnar er det best å gå sørsida
   opp frå Helgedalen»).

Plus a full-text pass over all 580 pages for the name of every single-route
tour in an ascent context, to catch a peak described from a neighbour's page.

Everything the four scans found is in this round or was turned away below.
**There is no fifth.** That is now a fact about the corpus rather than a
report on how hard somebody looked, and the root README says so.

### What the index found that five rounds of reading had missed

- **Steindalsnosi's south side.** The page files it as `1.4 Ned sørsida`, a
  descent — and then adds, in the when-line, «Før Sognefjellet opnar er det
  best å gå sørsida opp frå Helgedalen». The Fanaråken page in the same book
  says it outright: «Frå Turtagrø inn Helgedalen og opp langs Steindøla og
  gjennom Steindalen (sjå skildring Steindalsnosi sørside).» Only a scan that
  reads `NED` sections for ascent sanction finds this, and it is the best
  route of the round: the shipped line starts at Gjuvvatnet on
  Sognefjellsvegen, which is closed in winter, so until the road opens this is
  the *only* way up. Turtagrø is already a mapped trailhead — Fanaråken starts
  there — and the two lines share their first two waypoints up Helgedalen.
- **Horndalsnuten from the south.** The fact box carries both starts in one
  sentence and the intro explains the choice — «Det er to gode utgangspunkt
  for denne turen, et på den skyggefulle nordsiden, og et som ligger solvendt
  mot sør» — but the page has only one heading, `OPP (FRA NORD):`, with the
  south route under a bare `(FRA SØR):`. A heading scan that requires the word
  «Opp» walks past it.

### A start you reach by lift

Lønahorgi's fact box lists two starts with a time for each — «2 timer fra
Horgaletten, 4 timer fra Høyland» — and the ascent text is unambiguous about
which one people use: «De aller fleste besøkende velger å benytte seg av
heissystemet. Øverst i Horgaletten-heisen, ved rundt 920 meters høyde, er det
bare å feste feller under skiene.» The app shipped the other one.

The first instinct was to reject it, because a trailhead in this collection is
a place you drive to and park. That instinct is wrong on its own evidence:
**Reinheim, Bjørnhollia and Trollheimshytta are already trailheads here**, and
none of them has a road. The contract is that a start is a real, locatable
place where the tour begins, not that a car can reach it. The top station of
the Horgaletten tow is OSM way 30743181 and reads 948 moh; the guide says
plainly that you get there by lift.

`check_ground.py` then earned its keep. The first line took its own way up the
ridge and the check reported that a mapped trail runs the whole way while the
line strayed 286 m from it. That trail is OSM way 72667449, 184 points ending
in the summit cairn — the «tydelige staker» the source describes. The corridor
now follows it from Vådalseggi up, and between the lift and Vådalseggi it does
not, because there is no mapped path there and the source says as much: there
you just put the skins on and go.

### A traverse that gives back a third of what it climbs

Snøtindan's east route crosses the mountain rather than climbing one side of
it: up from Gullesfjordbotn to Vestbotntinden at 935, **down 330 metres** to
Øvre Storelvvatnet at 605, across the lake, and up again onto the route from
Snytindhytta. The routed line gives back 446 m of 1439 gained.

That is not a routing fault, and the tour's own shipped line settles it: from
Løbergsbukta it gives back 565 m of 1548. This is a mountain you traverse.
Both figures are in the guide.

The three lake crossings — the lakes at 76 and 113 on the way in, and Øvre
Storelvvatnet in the middle — are each sanctioned in the source's own words
(«etter å ha krysset vann 76», «Vann 113 krysses vestover», «Stak over
vannet»), so the corridor is pinned to their shores and `check_ground` reports
0 m on water. The one edit the line needed was a waypoint on the west side of
the summit at 803 moh: without it the last leg went straight at the summit
block at 45 degrees, and the source says to round the top on the west and come
up from the south.

### What was turned away

Everything the scans surfaced and this round did not take, with the reason:

- **Møysalen frå Fiskefjord** (`9.1.2 Oppstigning fra Fiskefjord`). A real
  second start with a titled section — and one sentence of route: «Ruta følger
  mer eller mindre kommunegrensen mellom Sortland og Hadsel til rutene møtes
  på ryggen over breen.» The Sortland–Hadsel boundary runs two kilometres
  along Fiskfjordvatnet, a regulated reservoir the source never mentions, and
  drawing eight kilometres of line around it on a KAST 3 peak would be my
  geometry, not theirs. The nearest thing to a fifth route in the corpus, and
  the reason there is no fifth.
- **Istinden frå Tunebrua** and **Gullfjellstoppen frå Bontveit.** Both name a
  start in the fact box and both then decline to describe a line: «Finn den
  beste veien gjennom skogen og ta sikte på enten Vestre eller Søndre Istind»,
  «gå enten den tradisjonelle ryggruten via Livarden/Austlirinden eller inn i
  Brekkedalen». The previous round's rule stands — a start without a route is
  not a route — and it has to apply to both or neither.
- **Finnbufjellet frå Myrkdalen skisenter.** The fact box names it and the
  ascent text says where it joins («Etter en times gange vil du møte på
  alternativ tilkomst fra Myrkdalen skisenter»), which is the Beisfjordtøtta
  shape — except Beisfjordtøtta named the connecting path and this names
  nothing between the resort and the junction.
- **Skårasalen frå Kvistadsætra**, **Melshornet frå Volda skisenter**,
  **Skårene frå Hesjedalen**, **Okla**, **Midtitinden**, **Skarven**,
  **Snøtinden (Andørja)**, **Eidskyrkja**, **Hornindalsrokken**, **Englafjell**
  — a start named without a route, a second parking on the shipped road, or a
  page whose numbered lines are all descents.
- **Mjølvafjellet frå Vengedalen** and **Skogshornrenna**, again: a 45-degree
  ridge with the skis on your back, and a 40-degree couloir.

### ut.no has no public index

The natural next corpus is ut.no, which the southern round used. It has no
enumerable index available here: `sitemap.xml` returns a 500, the area and
search listings render client-side, and the GraphQL API at
`api.ut.no/v1/graphql` answers `search` and `tripsNear` with 403 without a
client credential — so those are not routes to work around. What is left is
one search per peak, which was done for the likeliest dozen and produced
nothing: every ut.no ski trip found for a shipped peak starts where the app
already starts. A future round wanting a fifth route starts there, with more
patience, or with a guidebook.

## The shape round: every summit, every line, in one sitting

No new tour and no new route. 185 tours, 223 routes, and the first time every
check the pipeline owns has been run over the whole catalogue in one container,
with the answers written down side by side. Most of it came back clean. What
did not falls into two kinds: figures that had drifted between copies of the
same row, which are fixed, and shapes in the drawn lines that no existing check
looks at, which are now checked and are listed here for the next round to work.

What ran, and what it said:

| check | scope | result |
| --- | --- | --- |
| `npm test`, `typecheck`, `lint` | the app | green, 68 tests |
| `check_tours.py` | 185 cards, 185 profiles, 185 seed rows | clean on the four numbers it compared — see below for the columns it did not |
| `check_routes.py` | 223 routes, one DTM1 re-read each | clean: every line ends on its summit, every midpoint within 12 m |
| `check_bands.py` | 756 band claims in 185 guides | all agree with a line the app draws |
| `check_guides.py` | 185 guides, both languages, on `guide_facts.json` rebuilt from scratch (one DTM1 read per vertex, three hours) | 0 unsourced numbers, 0 reassurance claims |
| `check_ground.py` | all 223 routes, three hours against maps.mail.ru's Overpass | 9 findings: four trail claims never measured before, one that is the reservoir, four one-vertex tarn clips — below |
| a denser DTM1 re-read | every 8th vertex of every route, 5382 points | 5381 within 5 m of the stored elevation; one stretch of Fanaråken's Turtagrø line reads up to 27 m low — below |
| `check_geometry.py` (new) | 223 routes, offline | 46 things to look at in 34 tours as found, every one of them below; 8 in 6 after the fixes, all of them real steps the guides describe |

### Five cards whose seed row and English teaser were two corrections behind

`check_tours.py` compared four columns of each `seed.sql` row — lat, lng,
summit, vertical — and said the seed was the same rows again. It was not.
Five teasers in the seed carried figures from before their tour's line was
last corrected, and the English teaser in `lib/i18n/content.ts` for the same
five had never been updated either. Production and the English site would
have shown a reader one number on the card and another in the sentence under
it:

| tour | the seed and the English teaser said | the card says |
| --- | --- | --- |
| Vassfjellet | 540 høydemeter | 560 |
| Glittertinden | 12,6 km og 1180 høydemeter | 13,3 km og 1228 |
| Besshø | 1305 høydemeter | 1328 |
| Rasletinden | 750 høydemeter og 6 km, flatt de første 1,2 km | 778, 7,2 km, 2,2 km |
| Folarskardnuten | 12 km, 970 høgdemeter, eit 37-graders trinn | 13 km, 997, 29 grader |

All five are the Jotunheimen, Hallingdal and Trondheim re-routes of earlier
rounds, where `lib/tours.ts` was corrected by hand and the seed was not
re-emitted. Both copies now match, and `check_tours.py` compares **every**
column of the seed row, the multiset of numbers in the English teaser against
the Norwegian one, and `tourmeta.json` against the app — which is how the
next item was found.

### Fifty `hasGuide` flags stale in `tourmeta.json`

The pipeline's copy of the tour list said `hasGuide: false` for fifty tours
the app ships guides for — every tour from the Grytøya round onward. Nothing
the app renders reads that file, so no reader saw it, but `emit_new_tours.py`
does, and the ten-route round already recorded what happens when a stale
copy is re-emitted over a good one. `sync_tourmeta.py` fixes it and
`check_tours.py` now fails when it drifts.

### `check_geometry.py` — the shape of a line

Every existing check compares numbers: a height against DTM1, a distance
against the emitter, a claim against a band. A line can pass all of them and
still be the wrong shape, because the numbers describe a line that goes
somewhere silly in a way that leaves every number true. This round wrote the
check that looks at the shape — self-crossings, tight loops, out-and-backs,
vertices on the sea, notches — and ran it over all 223 lines. It needs no
network and no raster, so it runs anywhere `routes_from_ts.py` does. What it
found — and then, on request, fixed in the same round: the spurs and the notch
by editing the shipped lines, the scribbles and the sea by fixing the pass that
made them and re-solving. The findings first, as found; the fixes follow.

**Two lines that go in circles on a closed road.** `jakobstinden/sorostsiden`
spends **924 m of its 8468 m** in five patches of tight loops, and
`kongsviktinden/nordsiden` **964 m of 9116 m** in five more — both on the
flat, forested, winter-closed road out of Kongsvikdalen that the two tours
share for their first four kilometres, at 21–25 moh, with the line's first
300 vertices covering 1987 m of path for 725 m of ground. Every vertex is on
ground DTM1 agrees with (it reads `Skog` at 22–24 m throughout), the line
just circles there. Both are `avoidWater` solves, and the second-route round
already noted that an `avoidWater` solve of Kongsviktinden was not
reproducible. The consequence is in the prose: the guides' «8,47 km» and
«9,12 km», and Kongsviktinden's «1,1 grader over 4682 meter grunn» for the
band under 100 moh, are a tenth too long. The fix that fits the evidence is
the one Lønahorgi got in the index round — pin the corridor to the mapped
road for the road section and re-solve — and then re-derive both guides.

**Seven out-and-backs to a corridor waypoint.** Each of these lines walks
out to a waypoint that sits 130–300 m off the line it would otherwise take,
turns round and comes back along its own track:

| route | out and back | ground | height | the waypoint at the tip |
| --- | --- | --- | --- | --- |
| `snotindan/gullesfjordbotn` | 295 m | 599 m | 862 → 934 → 864 | Vestbotntinden |
| `reinspalen/geitryggen` | 244 m | 540 m | 654 → 681 → 653 | Geitryggen |
| `ytstevasshornet/normalruta` | 199 m | 405 m | 955 → 969 → 958 | Vatna i Vassdalen, 976 |
| `helligtinden/nordryggen` | 180 m | 401 m | 654 → 588 → 645 | Litletind-ryggen |
| `skartinden/via-ytterholla` | 157 m | 360 m | 867 → 800 → 863 | skardet |
| `skjomtinden/normalruta` | 134 m | 383 m | 1532 → 1444 → 1533 | renna mot ryggen nordvest for toppen |
| `fiskefjordtindan/sorvestsiden` | 132 m | 300 m | 885 → 853 → 891 | ryggen austover |

The first is the one that matters for the prose: the index round wrote
Snøtindan's east route as going «over Vestbotntinden», and the geometry
visits the top and retraces. The rest are a waypoint placed on a feature the
router would rather pass beside — a col, a ridge shoulder, a lake — and each
adds twice the spur to the distance and, on Skjomtinden and Helligtinden, a
descent and re-climb the tour need not make. Moving the waypoint onto the
line, or dropping it where the description does not need it, is a corridor
edit and a re-solve per route.

**Two lines on the sea.** `taraldsviktinden/austsida` leaves the boat
harbour along the shore and puts three vertices on `Havflate` at −2 m over
its first 500 m — about 135 m of line on the water in three places, between
vertices 20 and 30. `nonstinden/ostsiden` crosses a tidal inlet north of
Gullesfjordbotn with one vertex at −5 m, 90 m of line over the water at
vertex 63. `check_ground.py` cannot see either: it asks about `Innsjø` and
`InnsjøRegulert` and never about the sea. `generate_routes.py` is supposed to
refuse a point at sea level; both lines are resampled after it validates.

**A notch at Storrønden's cairn, and three summit steps to look at.** The
line up Storrønden arrives along the ridge from the north-west, and its last
three vertices go 2126 → **2097** → 2139 m over 24 m of ground: 14 m to a
point 29 m lower, then 10 m and 42 m up to the cairn. DTM1 confirms the
notch point by point, so the geometry is a real feature — the east face —
and the line crosses it because the last vertex was snapped to the summit
cell from the wrong side. The guide's «bratteste sammenhengende parti 25,7
grader» is a 30 m window and smooths it away. Three other lines end with a
single step no skinning line takes: Rana +57 m over 18 m to the cairn (the
guide says 38,0 over 30 m), Vassdalstinden +32 m over 19 m at 1246 moh, and
Hornindalsrokken +32 m over 30 m at 1476 moh. Hamperøkken's +37 m over 12 m
is the «siste trinn lokalt over 45 grader» its guide already states.

**Seven resample notches.** Single vertices 12–31 m above or below both
neighbours within 60 m of ground — Langlitinden's Rytterkløfta at 1130,
Snøtinden i Tjeldsund at 409, Snøtindan's Løbergsdalen at 800, Forkledalstindan
at 702, Varden at 333 and 341, Kolåstinden at 1419. A boulder, a stream bank
or a cornice edge read by a 1 m model at a point the coarse solve stepped
over. They put a spike in the profile and a metre or two into the gain; they
do not move the line.

**Noted, not defects.** Fifteen tours carry an editorial grade two steps
above what the steepest 100 m band measures — all of them Harstad-book
KAST 4 peaks where the grade is exposure and a scramble, not angle — which is
what `route_metrics.py` says a terrain grade is for. Ten alternates give back
between 84 and 349 m on the way up; every one is a traverse or a col the
guide already describes. And the elevation profile's end label is the card's
summit while the line's last vertex is DTM1 rounded down, so thirteen profiles
say 1219 over a line that ends at 1218 — a metre of rounding that
`check_tours.py` allows on purpose.

### Every eighth vertex, re-read

`check_routes.py` re-reads one point per route from Kartverket. This round
re-read every eighth vertex of every route — 5382 points — and compared the
stored elevation and terrain class with the answer. **5381 are within 5 m**,
and the terrain classes are what the lines claim: 3621 open ground, 1301
forest, 173 bog, 69 glacier, 61 lake, none sea (the two sea lines above stand
on the water between the sampled vertices). The one exception is
`fanaraken/turtagro` between vertices 158 and 162, at 1308–1314 m stored
against 1322–1341 m on the ground: five vertices 14–27 m low on a moraine
bump the resample did not read, so that route's gain is understated by
roughly 25 m. It does not touch the card — the primary is the Fannaråkhytta
line — and the fix is `resample_dtm1.py` on that one route.

The 61 lake samples fall on 30 routes, and 27 of them name the lake's height
in the guide, as `check_ground` has required since the Trondheim round. The
three that do not were measured vertex by vertex: Haukebøtinden's east side
clips a tarn at 690 m for one vertex (45 m, under the 60 m floor the check
reports at), Rondslottet's Bjørnhollia line stands 90 m on a tarn at 942 m in
the forest above the hut, and **Snøtindan's Løbergsdalen line stands 91 m on a
tarn at 641 m and 45 m on the tarn at 573 m** — under a guide that says «linja
holder land forbi alle vatna der kilden krysser på isen» and names 573 as
passed «på land, sør for det». `check_ground` run on the tour agrees about
641 m and cannot see 573 m at the length it clips. Both are natural tarns on
the shelf the guide already describes as «tjernshyllene»; the sentence is
what needs to move, or the two vertices.

### The scribbles and the sea, re-solved

The scribbles were not the solver's: a shortest path cannot loop. They were
the off-water pass. `_lift_legs` read each leg every 2.5 m and appended a
nudged vertex for *every* wet sample, so a 45 m leg over a 20 m arm of the
braided Kongsvikelva grew eight new vertices, each pushed to the nearest dry
ground in whichever of twelve bearings answered first. It now inserts one
dry vertex per wet run, from the run's middle. And the sea lines survived
the same pass because it looked for a class named `Hav` while Kartverket
answers `Havflate`; the class is added, the two corridors carry
`avoidWater` in `corridors.json` and the research record, and all four
routes were re-solved through their unchanged corridors — same grid, so the
other routes of those tours reproduced their shipped lines to within 2 m of
gain and were restored from `lib/routes.ts` as usual.

| route | before | after | on water | card |
| --- | --- | --- | --- | --- |
| `jakobstinden/sorostsiden` | 8.47 km, +1062, 529 vertices | 7.40 km, +1017, 257 | 77 m, the bridge crossings | 1060 → 1020 |
| `kongsviktinden/nordsiden` | 9.12 km, +1092, 574 vertices | 8.05 km, +1051, 291 | 80 m, the bridge crossings | 1090 → 1050 |
| `taraldsviktinden/austsida` | 4.93 km, +798, 3 vertices at −2 m | 4.94 km, +792 | 0 m | alternate |
| `nonstinden/ostsiden` | 5.64 km, +983, 1 vertex at −5 m | 5.72 km, +973 | 0 m; the inlet is rounded on land | 980 |

The guides' opening figures, the band under 100 moh on the two Kongsvik
tours («1,1 grader over 4682 meter grunn» → 1,4 over 3625), the treeline
distances and the height given back are re-derived in both languages, and
`check_ground` comes back clean on all six routes of the four tours.

### The spurs and the notch, fixed in place

A re-solve was the first instinct and the wrong one. Moving a waypoint moves
the corridor's bounding box, the routing grid is cut to that box, and a grid
cut differently discretises the whole line differently — Reinspalen re-solved
through its moved waypoint came back with the spur gone and 84 m *more*
climbing, dipping to 222 m where the reviewed line had dipped to 287. Every
one of the seven came back changed end to end, not at the spur. That is not a
fix; it throws away seven lines that earlier rounds read adversarially to
repair 130–300 m of each.

The spur itself needs none of that. Each one leaves the line at a vertex and
comes back within 12 m of it, so the loop between those two vertices is cut
and the line continues — exact, local, and reviewable. The same rule at a
smaller scale (a loop of 60 m or more returning within 12 m at the same
height, which a switchback never does) found three more that the 300 m rule
had walked past: 91 m on Reinspalen's Kobberyggen at 414 m, 175 m on
Skartinden's flat at 869 m, 91 m on Skjomtinden at 1356 m. The seven
waypoints were moved onto the line in `corridors.json` and the research
record, each with a note saying where it came from, so the corridor agrees
with the line it ships.

| route | cut | before | after | card |
| --- | --- | --- | --- | --- |
| `snotindan/gullesfjordbotn` | 599 m spur to Vestbotntinden | 9.13 km, +1439 | 8.52 km, +1360 | alternate |
| `reinspalen/geitryggen` | 540 m spur, 91 m loop | 8.44 km, +1404 | 7.80 km, +1369 | 1400 → 1370 |
| `ytstevasshornet/normalruta` | 405 m spur | 4.19 km, +833 | 3.79 km, +816 | 830 → 820 |
| `helligtinden/nordryggen` | 401 m spur | 5.44 km, +1029 | 5.04 km, +954 | 1030 → 950 |
| `skartinden/via-ytterholla` | 360 m spur, 175 m loop | 4.44 km, +1287 | 3.92 km, +1193 | 1290 → 1190 |
| `skjomtinden/normalruta` | 383 m spur, 91 m loop | 7.64 km, +1487 | 7.17 km, +1386 | 1490 → 1390 |
| `fiskefjordtindan/sorvestsiden` | 300 m spur | 7.56 km, +1076 | 7.27 km, +1044 | 1080 → 1040 |
| `storronden/normalruta` | 3 vertices inside 30 m of the cairn | 10.26 km, +1145 | 10.23 km, +1108 | 1140 → 1110 |
| `rana/normalruta` | east-face hook → 4 crest vertices | 8.61 km, +1602 | 8.59 km, +1559 | 1600 → 1560 |
| `hamperokken/normalruta` | 1 vertex inside 30 m | 5.64 km, +1389 | 5.64 km, +1383 | 1390 |
| `vassdalstinden/normalruta` | 2 vertices inside 30 m | 6.50 km, +1212 | 6.47 km, +1210 | 1210 |
| `kolastinden/normalruta` | 3 vertices inside 30 m | 5.70 km, +1120 | 5.67 km, +1120 | 1120 |
| `breitinden/normalruta` | 3 vertices inside 30 m | 4.24 km, +1049 | 4.21 km, +1049 | 1050 |
| `forkledalstindan/sydsiden` | 3 vertices inside 30 m | 5.59 km, +1024 | 5.56 km, +1016 | 1020 |

Two of the cuts changed what a guide said, not just its numbers.
Helligtinden's «bratteste enkeltpartiet, 33,3 grader mellom 626 og 650 moh»
was the climb back out of the spur; the steepest step on the line is now
28,2° between 646 and 665, and the sentence that called it one of the
source's two sections over 30 has been rewritten to say the line lies
gentler than the crest. Snøtindan's east route no longer goes «over
Vestbotntinden på 935»: it crosses the shoulder at 864 and the guide says
so, with the drop to Øvre Storelvvatnet re-measured from there. Skartinden's
guide now distinguishes the col's floor at 795 from the shoulder at 867 the
line crosses, and Ytstevasshornet's caption had quoted 3,93 km for a 4,19 km
line since some earlier edit — both now read 3,79. Every other change is a
figure replaced by the same figure measured on the shipped line, in both
languages, with the round recorded in each guide's `problems`.
`check_guides.py` and `check_bands.py` come back clean on all eight.

Storrønden's fix is a rule in `generate_routes.py` as well as an edit. After
the summit is pinned, `build()` now drops whatever the smoothing left inside
30 m of it (`SUMMIT_LEG_MIN_M`), so the last leg comes in straight from the
side the line climbed. 164 of the 223 shipped lines carry such a leftover
vertex; for 158 of them it sits a metre or two below the cairn and changes
nothing. The other six were Storrønden's shape — Rana (−60 m inside 22 m),
Hamperøkken (−37 m), Vassdalstinden (−32), Kolåstinden (−31), Breitinden
(−28) and Forkledalstindan (−21) — and were done the same way, with one
exception that the 30 m rule could not have fixed.

Five of them drop cleanly to a last leg of 30–43 m at 37–46° from the side
the line already climbed, and DTM1 read along each new leg agrees it is a
summit block, not an artefact: Hamperøkken 1364 → 1389 over 41 m from the
south, Vassdalstinden 1258 → 1275 over 34 m, Kolåstinden 1402 → 1425 over
36 m, Breitinden flat at 980 and then the block, Forkledalstindan 868 → 884.
What changed in their guides is the *steepest 30 m* figure, and it went up
on four of them — Hamperøkken 33,3 → 38,0, Vassdalstinden 36,2 → 41,3,
Kolåstinden 38,0 → 43,1, Breitinden 39,4 → 45,9 — because the old window
averaged a 6 m cliff with the flat ground beside it, and the new one is the
block itself. Hamperøkken's «siste trinn lokalt over 45» was the +37 m over
12 m artefact and now reads as the 38° summit step it is; Kolåstinden's
guide already stated a 47° summit pitch from the flank probe. Breitinden's
steepest hundred moved from 600–700 to the summit block's 900–1000 and the
sentence says so.

**Rana is the exception.** The cairn is a spire: DTM1 at 30 m out reads
1520–1554 on every bearing but one, and 1586 on the south-west crest — the
guide's own «kammen». The shipped line climbed the flank at 200°, hooked
round onto the east face and finished +57 m over 18 m; dropping its last
vertices would have left a 43 m leg at 57° up that face. So the hook after
v275 (1552 m, 128 m out) was replaced by four vertices on the crest — 1572,
1579, 1580, 1586 m at 120, 90, 60, 30 m on bearing 225° — and «toppkammen
frå sørvest» was added to the corridor so a re-solve approaches the same
way. The steepest 30 m on Rana is no longer the summit at all: 28,4° on the
arête between 1210 and 1232, against the 38,0° the guide had placed on the
crest, and the gain drops 1602 → 1559 (card 1600 → 1560). The English guide
had also been saying the descent was «1595 metres in one run» against a
Norwegian 1602 — one more figure that had drifted between the languages and
now reads 1559 in both.

### What `check_ground` said about the whole catalogue

The first run over all 223 routes from one container came back with nine
things to look at, and the record in `check_ground_run.txt` shows why four
of them are new: when the ground check last ran over these tours, Overpass
would not answer for them and their trail claims were marked UNCHECKED. It
answers now, and four guides promise a mapped line the drawn one leaves:

| route | the guide says | the line strays | where |
| --- | --- | --- | --- |
| `gygrastolen/normalruta` | «anleggsvegen» | 526 m, 1205 m of 5966 beyond 250 m | 2.9 km out, at 566 m |
| `gyranfisen/vikerkoia` | «Løypene» | 443 m, 450 m of 5360 beyond 250 m | 4.9 km out, at 1039 m |
| `hogevarde/norefjellstua` | «oppkjørt» | 427 m, 1949 m of 11668 beyond 250 m | 3.3 km out, at 1102 m |
| `grafjell/tempelseter` | «løypa» | 292 m, 300 m of 8044 beyond 250 m | 7.1 km out, at 1351 m |

All four were then read with the map and the guide side by side, and all
four are the Tempelseter shape rather than a line beside a path it should be
on. Gygrastølen's guide names the anleggsveg at the start and on the way
down; the road ends at Gygrastølvatnet, the line above it is on a ridge above
the treeline, and the mapped way `check_trail` measured against is a summer
path 526 m away — the check measured the whole line because another path
reaches the cairn. Gyranfisen's «Løypene» is a caveat about grooming, and the
line's own way over the ridge from Svarttjernskollen is 443 m from a nordic
loop that goes round it. Høgevarde's Norefjellstua line leaves the network in
three places along Norefjellsryggen, all of them nordic loops or a summer
path. Gråfjell's line leaves the track for its last three hundred metres
below a summit the guide already says the track does not reach directly. In
each case the copy now states the measured gap and where it is, in both
languages, which is what `check_trail` softens on; the four come back as
notes. The fifth trail finding, Fastdalstinden's Varto route, is the
reservoir and is closed below.

The other four are water: one vertex each, 45–46 m of line, on a tarn the
guide does not name — Kjølen's Slettaelva route at 126 m, Melåaksla's ridge
route at 600 m, Reinspalen's Geitryggen route at 287 m and Snøtindan's
Løbergsdalen route at 641 m. Below the 60 m the check normally reports at,
surfaced only because Overpass returned no polygon to measure the shore
against.

All four were taken off the water rather than named, with the pipeline's
own pass applied locally: the wet vertices moved to the nearest dry ground
(10–25 m away in every case), the legs either side read every 2.5 m and
lifted where wet, and the moved vertices given DTM1 elevations. Read that
closely, the clips were more than one vertex each — three on Kjølen's
Slettaelva line (127, 131 and a third at 357 m the check had not reported),
three on Melåaksla's (480, 586, 591), two on Reinspalen's (288) and five on
Snøtindan's Løbergsdalen line (571–646, the two tarns its guide says it
passes on land, which is now true). `check_ground` comes back with 0 m on
water for all seven routes of the four tours.

### The mid-route notches

The 29 items the shape check still listed after everything above were the
sampling notches: a segment over 45° with ten metres or more of rise, or a
vertex 12 m above or below both neighbours within 60 m of ground, in the
middle of a line rather than at its summit. Read closely they were two
things. **Ten were small out-and-backs** of 60–230 m the spike rule had
caught by their shape — Snøtinden i Tjeldsund's line walked 161 m out and
back at 371 m and read as a 39 m climb, Varden's 233 m at 313 m — and were
cut by the same-height-loop rule. **The rest were single vertices the
coarse solve had put on a boulder, a stream bank or the lip of a step**, and
those were moved the way the water clips were: DTM1 read in a disc of 5–25 m
around the vertex, the vertex moved to the nearest dry point at which both
adjacent segments come in at 40° or less. Twenty moved, by 5–20 m, well
inside the 9–15 m cell of the grid they were solved on. **Six had no such
ground within 25 m and stand**, because they are real: Breitinden's and
Kolåstinden's summit blocks, Nona's two summit steps, Kongsviktinden's east
side under the cairn, and Møysalen's 51 m notch, which its guide measured at
2.3 m spacing and calls what it is. Fastdalstinden's Varto line had a 124 m
zigzag on the flat bog at 513 m that no loop rule fits, and was straightened
between the patch's entry and exit vertices.

Every touched line's figures were re-derived and moved into both languages
by the same substitutions as before; where the steepest thirty metres moved
*place* — Reinspalen's from the summit-ridge transition to the step onto
Kobberyggen, Forkledalstindan's from the start of the ridge to the last
stretch under the cairn, Lodalskåpa's from the summit ridge to the slopes
below the glacier, Snøtinden i Tjeldsund's out of the loop it had been in —
the sentence was rewritten to say where the steep ground is. Six cards move
by 10–65 m (Snøtinden i Tjeldsund 1020 → 980, Strandtinden 1160 → 1140,
Forkledalstindan 1020 → 980, Varden 825 → 760, Middagstinden 1310 → 1290,
Kvitegga 1480 → 1460); the guide, band, card and shape checks and the test
suite are clean, and what `check_geometry.py` lists now is the six real
steps.

### One `check_ground` trail finding that is the reservoir, not the road

`fastdalstinden/varto` came back saying the guide promises an «anleggsveg»
and the line strays 771 m from the mapped one. The guide says the road is
followed to the dam at 515 moh and no further, and the 771 m is measured on
the far shore of Rottenvikvatnet, which the line rounds on land because the
lake is a reservoir — the same guide's own «rundt magasinet på land». Below
the dam the line is within 160 m of the road throughout. A false positive of
the Vetefjellet kind, recorded here so it is not re-opened.

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
