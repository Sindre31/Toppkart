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
| Galdhøpiggen | Juvasshytta (627 m) and Spiterstulen (1434 m) — two standard starts 737 vertical metres apart |
| Tromsdalstinden | the Salen ski line and the marked NNV-ridge summer path — **same car park**, different sides of the mountain |
| Rondslottet | Spranget (1241 m) and Dørålseter (1222 m) — opposite approaches |
| Snøhetta | Snøheim (815 m) and Reinheim (948 m) |
| Gaustatoppen | Gaustablikk (972 m) and Stavsro (706 m) |

The first route of a tour is the one the tour's own `verticalM` and `duration`
describe. Alternatives are only added where a second route is actually
documented; `ALTERNATES` in `build_corridors.py` is not a place to invent one
because the schema allows it. The remaining 19 tours have a single route, and the
app renders no picker for them.

Route and trailhead *names* get shortened for display — the research came back
with sentences like "Normalruta fra Djupvik/Forselvveien via Pumpvatnet,
bekkedalen mot Forsnesvatnet, Isvatnet og sørøstryggen", which is good prose and
a useless label. The full text is kept alongside as `description` / `fullName`.

## Where the app's own numbers disagree with the ground

Three figures were fixed earlier, with the tour owner's agreement, because they
matched no real trailhead at all:

| tour | was | now | why |
| --- | --- | --- | --- |
| Galdhøpiggen | 1100 m | **630 m** | 1100 matched neither standard start. It sat between them, and both are now routes: Juvasshytta 632 m, Spiterstulen 1434 m. |
| Oksen | 1240 m | **1060 m** | 1240 implies a sea-level start; Tjoflot, which the teaser names, is at 181 m. |
| Hesten (Segla) | 626 m summit, 620 m gain | **556 m / 510 m** | The summit is 557 m in DTM1. 626 looks like Segla (638 m), a spire, not a ski summit. |

### `verticalM` is not always a vertical gain

The Rørnestinden audit turned up the reason so many of these look odd. In eight
tours the field holds the peak's **published altitude**, not its ascent:
Storgalten 1219/1219, Rørnestinden 1041/1041, and Store Blåmann, Himmeltindan,
Stornappstinden, Slogen, Skåla and Melderskin all within 10 m of their own summit
heights. For a genuine fjord-to-summit tour that happens to be nearly right, which
is why it went unnoticed; where the standard trailhead is higher up, it is simply
wrong. Oksen's old 1240 was its 1241 m summit altitude duplicated the same way.

Treat the field as unreliable. In particular **do not use it to infer a trailhead
elevation** — an earlier version of this pipeline picked placeholder trailheads by
matching `summitM − verticalM`, which quietly bakes the error into the geometry
and then appears to confirm itself.

### Remaining disagreements

Twelve of the 24 primary routes now land within 40 m of the published figure,
including Galdhøpiggen +2, Hesten −4, Himmeltindan +5, Rombakstøtta −5,
Tromsdalstinden +6. The other twelve do not:

| tour | app says | routed | diff | audited trailhead |
| --- | --- | --- | --- | --- |
| Rondslottet | 1050 m | 1245 m | +195 | Spranget p-plass |
| Fanaråken | 950 m | 757 m | −193 | Korpen |
| Storehorn | 630 m | 473 m | −157 | Hornslie p-plass |
| Melderskin | 1420 m | 1272 m | −148 | Kletta p-plass |
| Steindalsnosi | 620 m | 758 m | +138 | Gjuvvatnet |
| Kirketaket | 1380 m | 1271 m | −109 | Hellerøra-parkeringa |
| Oksen | 1060 m | 963 m | −97 | Tjoflot øvre parkering |
| Kavringtinden | 1150 m | 1243 m | +93 | Lyngseidet |
| Slogen | 1560 m | 1482 m | −78 | Skylstad i Norangsdalen |
| Kolåstinden | 1150 m | 1076 m | −74 | Standaleidet |
| Stornappstinden | 730 m | 680 m | −50 | Nappskaret skianlegg |
| Bitihorn | 500 m | 549 m | +49 | Bitihorn p-plass ved Fv51 |

**These are deliberately not reconciled.** The trailheads are the audited ones,
each traced to a route description and a mapped car park, and in several cases the
audit found an independent published gain that agrees with the route and not with
the app: Fanaråken 724 m on ut.no against the app's 950 (the app figure fits the
1200 m Turtagrø route, which is here as the alternative); Kirketaket 1243 m on
ut.no against 1380; Stornappstinden 680 m on Friflyt against 730; Rørnestinden
1000 m on Friflyt, which the router reproduces at 1004 m.

Changing published figures is an editorial call. What the pipeline guarantees is
that the geometry is right for the trailhead named beside it, and that the gap is
written down rather than hidden.

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
