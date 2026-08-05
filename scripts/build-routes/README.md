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
python3 check_routes.py       # independent sanity pass

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
python3 enrich_facts.py       # folds the corridor research and audit back in
python3 guide_brief.py <slug> # the writing brief one agent gets for one tour

TOPPKART_WF=<transcripts> python3 harvest_guides.py  # -> guides.json
python3 check_guides.py       # mechanical pass; must be read, not just run
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

32 routes over 24 tours. The first route of a tour is the one its own `verticalM`
and `duration` describe. Alternatives are only added where a second route is
actually documented — `ALTERNATES` in `build_corridors.py`, and the research
output, are not places to invent one because the schema allows it. The remaining
16 tours have a single route, and the app renders no picker for them.

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

`new_tourmeta.json` accumulates: each later pass appends what it measured, and
`check_guides.py` treats those notes as the source for the figures in the prose.
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
of the 39 agrees with its routed gain to within 10 m**, which is the invariant to
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
