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

## Steps

```
pip install numpy scipy rasterio

python3 resolve_summits.py    # SSR + DTM1          -> summits.json
python3 build_corridors.py    # corridors.swarm.json + PICKS/ALTERNATES -> corridors.json
python3 generate_routes.py    # corridors + summits -> routes.json   (~10 min)
python3 emit_ts.py            # routes.json         -> ../../lib/routes.ts
python3 check_routes.py       # independent sanity pass

# only when re-running the research itself:
python3 find_trailheads.py            # OSM roads/parking -> trailhead_candidates.json
python3 nearby_places.py              # SSR point search  -> nearby_places.json
TOPPKART_WF=<transcripts> python3 harvest_swarm.py   # -> corridors.swarm.json
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

1. a search disc that **grows** until the highest cell inside it matches the
   published height. Growing outward and stopping at the first match is what
   keeps a peak from being confused with a taller neighbour — Steindalsnosi
   (2025 m) matches 975 m out, well before Fannaråki (2068 m) comes into range
   at 1490 m.
2. a hill-climb from there onto the exact top. Run in this order on purpose:
   climbing straight from an SSR point stalls on the first shoulder above a
   saddle, which is how Himmeltindan and Steindalsnosi first came out ~30 m and
   ~120 m short.

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

## The app's numbers, reconciled against the ground

`verticalM` now means one thing everywhere: the cumulative ascent of the tour's
**first** route, as solved over the terrain model, rounded to the nearest 10 m so
it reads like a published figure and does not drift when the geometry is
regenerated. An alternative route has its own gain and is not expected to match.

Sixteen tours needed correcting to get there. Three were obvious — figures that
matched no real trailhead at all:

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
