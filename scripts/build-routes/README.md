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
that Kirketaket is skinned from Grøvdalen, or which side of the stream the skin
track takes. That is the *corridor*: a trailhead plus a handful of ordered
waypoints that pin the line into the right valley, up the right shoulder, and
onto the right summit ridge. It lives in `corridors.json`, researched per tour
and cross-checked against Kartverket's registers.

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
python3 find_trailheads.py    # OSM roads/parking   -> trailhead_candidates.json
python3 nearby_places.py      # SSR point search    -> nearby_places.json
python3 build_corridors.py    # the two above + PICKS/ALTERNATES -> corridors.json
python3 generate_routes.py    # corridors + summits -> routes.json
python3 emit_ts.py            # routes.json         -> ../../lib/routes.ts
python3 check_routes.py       # independent sanity pass
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

`corridors.json` records `start_vs_implied_m` per tour: the terrain height at the
primary route's trailhead minus the height the tour's stated `verticalM` implies.
Most are within a few tens of metres, which is just where in a car park you stand.
Three were far enough out to be data bugs rather than rounding, and all three are
now fixed in `lib/tours.ts` and `supabase/seed.sql`:

| tour | was | now | why |
| --- | --- | --- | --- |
| Galdhøpiggen | 1100 m | **630 m** | 1100 m matched neither standard start. It sat between them, and both now exist as routes: Juvasshytta 627 m, Spiterstulen 1434 m. The tour's teaser names Juvasshytta, so that is the primary. |
| Oksen | 1240 m | **1060 m** | 1240 m implies a sea-level start, but Tjoflot — which the tour's own teaser names — is at 181 m. |
| Hesten (Segla) | 626 m summit, 620 m gain | **556 m summit, 510 m gain** | The summit is 557 m in DTM1. The old 626 looks like Segla (638 m), which is a spire, not a ski summit. |

The figures are rounded to the nearest 10 so they read like published data and do
not drift when the geometry is regenerated. After the fix every tour's implied
start is within ~95 m of its real trailhead, and most within 20 m —
`start_vs_implied_m` in `corridors.json` records the gap per tour. The two
largest remaining, Kavringtinden (−77 m) and Rondslottet (−68 m), are plausible
figure-vs-trailhead disagreements rather than clear errors, and are left alone.

Three routes carry a note from the validator worth keeping in mind: Steindalsnosi
gives back 101 m because the line crosses Steindalen between the road and the
peak; Slogen has a single 41° step; and Rombakstøtta has two steps above 40° on
the summit ridge. All three are in character for the terrain and the grade, but
they are the places to look first if a line ever looks wrong.

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
