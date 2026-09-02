# Toppkart

Toppkart is a Norwegian ski-touring field guide sold as a subscription: quality-assured peak
tours on one map, with route, vertical gain, steepness and avalanche terrain. The subscription
costs 29 kr/mnd (or 290 kr/år), and every new account starts with a 14-day free trial where a
card is required at signup and the first charge lands when the trial ends. The site is in
Norwegian; this README and the rest of `docs/` are in English for whoever maintains it.

## Stack

- **Next.js 16, App Router**, TypeScript in strict mode. Server Components by default.
- **Supabase** — Google sign-in, the only way in: no password, no magic link, no SMTP. Postgres for tours/profiles/subscriptions (tables are prefixed `tk_`, so the database can be shared with other projects), and
  row-level security as the second line of defence on gated columns.
- **Stripe** — subscription billing. Checkout in `mode: "subscription"` with
  `trial_period_days: 14`, the Customer Portal for payment-method changes and cancellation, and
  webhooks to sync subscription status back into Postgres. `npm run stripe:setup -- --apply`
  provisions a fresh Stripe account with the product, both prices, the portal configuration and
  the webhook endpoint, and prints the environment variables they produce.
- **Resend** — transactional mail (receipts, "your trial is ending" notices) after a Stripe
  checkout, and the operational alerts in `lib/alerts.ts` that go to `ADMIN_EMAILS` when a webhook
  fails or completes a checkout it cannot attach to an account. Nothing to do with signing in:
  Google sends no mail, so auth needs no SMTP at all. Optional — without the key those sends log
  and no-op, which for the alerts means the log is the only place they appear.
- **Leaflet + Kartverket** — the full-screen map on `/kart`, over Kartverket's topographic WMTS
  (`cache.kartverket.no`, the `webmercator` grid, zoom 18 at the top). Open data under CC BY 4.0,
  so «© Kartverket» stays visible in the corner. Coverage is Norway and only Norway, which is
  right for the product and means the map is blank if you pan out of the country.
- **Vercel** — hosting and deploys. See `docs/deploy.md`.

## Demo mode

**With no environment variables set at all, the app runs.** Clone it, then:

```bash
npm install
npm run dev
```

Open <http://localhost:3000> and the whole product is walkable: sign in with any e-mail address,
start the trial, watch the gated guide content unlock, cancel the subscription, resume it. No
Supabase project, no Stripe account, no keys.

This works because `lib/config.ts` exposes `isSupabaseConfigured` / `isStripeConfigured` and every
integration module checks them. When the keys are absent, auth and subscription state fall back to
the cookie-backed helpers in `lib/demo-session.ts` — two `httpOnly` cookies (`tk_demo_session` and
`tk_demo_sub`) holding the signed-in e-mail and a synthetic subscription record. Nothing crashes
or 500s on a missing key; the code path just changes.

Be clear-eyed about what this is: **demo mode gates sample content, it is not a security
boundary.** The demo cookies are not signed and are trivially forged, and the "gated" text they
protect ships in the repository anyway. It exists so the app can be
reviewed and developed without credentials. Real enforcement in live mode is `getViewer()` on the
server plus RLS in Postgres — see "Access model".

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000, demo mode
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm test           # vitest run
npm run build      # production build
```

### Checks

CI runs all four of those on every push and pull request, with no Supabase or Stripe keys set —
which is deliberate, and is what proves a missing secret can never be the thing that breaks a
deploy.

The tests are pointed at one specific class of bug: **the pure functions that fail quietly.**
`grantsAccess()` decides who may read a guide, `lib/stripe-mapping.ts` decides what a
subscription row says, and `routeProfile()` decides where a line goes — and each of them returns
a plausible wrong answer rather than throwing. Everything that talks to Supabase, Stripe or
Resend is left alone on purpose: that code complains on its own when it breaks, and testing it
would mean writing mocks that assert our own understanding of someone else's API. `periodEndFor`
was once wrong because Stripe moved a field, and any mock written before that would have
reproduced the mistake faithfully.

The tour data gets the same treatment: `lib/tours.test.ts` re-checks the emitted TypeScript for
the invariants a regeneration could break — every line ending on the summit it belongs to, every
card vertical within 10 m of its route's ascent, every line stored as whole lat/lng/elevation
triples. It is a tripwire on the pipeline's output, not a second opinion on the terrain. The
real audit is the Python under `scripts/build-routes/`, which measures against Kartverket's
terrain model and against mapped ground, and which cannot run in CI: it needs Geonorge and a few
hundred megabytes of cached raster.

To run against real services, copy `.env.example` to `.env.local` and fill in the values you have.
The two modes are decided per integration, so a half-configured environment is fine: Supabase keys
without Stripe keys gives you real auth and a demo subscription.

## Project structure

```
app/
  globals.css            The "Industry" design system — source of truth for every token
  layout.tsx             Fonts, <SiteChrome>, <Feedback>, metadata
  page.tsx               / — landing
  kart/                  /kart — full-screen Leaflet map, list panel, detail panel
  turer/                 /turer — every tour, grouped by region. The indexable list
  tur/[slug]/            /tur/[slug] — tour guide, gated below the key figures
  logg-inn/              /logg-inn — Google sign-in
  betaling/              /betaling — start-the-trial checkout
  min-side/              /min-side — subscription, receipts, account, delete account
  vilkar/, personvern/   Terms and privacy, both languages, from lib/i18n/legal.ts
  admin/                 /admin/* — behind ADMIN_EMAILS, 404 for everyone else
  api/                   Route handlers, incl. api/stripe/webhook and api/konto (deletion)
  robots.ts, sitemap.ts  Production indexes; preview deploys say Disallow: /
components/
  Blueprint.tsx          <Blueprint> registration-cross frame, <SectionKicker>
  CapsText.tsx           Pulls back Barlow Condensed's over-wide uppercase Ø
  SiteChrome.tsx         <SiteNav>, <SiteFooter>
  Feedback.tsx           The floating «Gi tilbakemelding» dialog
  guide/                 Tour-page parts, incl. <RouteMap> — the route drawn from its
                         own points, as inline SVG over Kartverket's topographic
                         tiles. Colour on a tour page, greyscale on the landing page
lib/
  config.ts              PRICE, TRIAL_DAYS, SITE, GRADE_COLORS, env, is*Configured
  types.ts               Tour, TourGuide, Viewer, Subscription, Invoice
  tours.ts               The 185 tours, REGIONS, getTour(), routesFor(), routeById(),
                         routeFor(), routeProfile()
  routes.ts              Generated ascent routes per tour — see scripts/build-routes/
  guides.ts              Editorial guide content — all 185 tours, generated
  i18n/                  Every user-visible string, no/en. content.ts holds the guides
  access.ts              getViewer() / grantsAccess() — server-only access gate
  stripe.ts              Stripe client, null in demo mode
  stripe-mapping.ts      Reading a Stripe object into a subscription row. Unit-tested
  alerts.ts              Mails ADMIN_EMAILS when a webhook fails silently
  rate-limit.ts          Fixed-window limiting, counted in Postgres
  admin.ts               Who may open /admin/*. Fails closed
  demo-session.ts        Cookie-backed stand-ins for auth and subscription
  supabase/              Browser and server Supabase clients
  *.test.ts              Unit tests, run by `npm test` — see "Checks" below
supabase/
  schema.sql             Tables, policies, RLS
  seed.sql               The 185 tours and all 185 guides
design-reference/        The HTML prototypes and the product/design handoff. Read-only ground
                         truth; not shipped.
docs/
  deploy.md              Vercel, Supabase and Stripe setup checklist
  seo.md                 What crawlers get, and the caching fixes that were priced and declined
```

## Routes

| Route | What it is | Prototype |
|---|---|---|
| `/` | Landing page: hero, data plate, what a guide contains, subscription | `Landing.dc.html` |
| `/kart` | The map — tour list, grade/region filters, detail panel with the route picker and the locked block. `?tur=<slug>` opens a tour, `&rute=<id>` a specific route | `kart.html` |
| `/turer` | Every tour, grouped by region. Plain links, no map — the page a crawler can read | — |
| `/tur/[slug]` | Tour guide: stats, route map, elevation profile, ascent/descent, avalanche terrain | `Turguide Kirketaket.dc.html` |
| `/logg-inn` | Sign in with Google | `Logg inn.dc.html` |
| `/betaling` | Start the trial — sign-in first, then 0 kr today, card required | `Betaling.dc.html` |
| `/min-side` | Subscription status, receipts, account e-mail | `Min side.dc.html` |
| `/vilkar`, `/personvern` | Terms and privacy. Copy lives in `lib/i18n/legal.ts`; bump `LEGAL_UPDATED` when you edit a paragraph | — |
| `/admin/tilbakemeldinger` | What people wrote in the feedback dialog. `ADMIN_EMAILS` only; 404 for everyone else | — |

Every «Prøv gratis» / «Start gratis prøveperiode» call to action anywhere in the app goes to
`/betaling`.

## Design system

The design system is called "Industry" and `app/globals.css` is its source of truth — all tokens
live there as CSS variables (`--color-*`, `--font-heading`/`--font-body`, `--space-1…8`,
`--radius-*`), copied verbatim from `design-reference/styles.css` with a block of shared page
primitives appended below. Everything on the page is a blueprint object: right-angled corners
(radius 0), 1px hairline borders in `--color-divider`, and four registration crosses in the
corners, which is what `<Blueprint>` renders. Type is Barlow Condensed 600 uppercase for headings
over Barlow 400/500/700 for body text, sections are numbered with a kicker ("01 · Abonnement")
above a 1px rule, and there is exactly one accent — steel blue `#5980a6` with its 100–900 ramp, of
which `.btn-primary` is the only filled object on the site. Icons are `lucide-react` at stroke
width 1.5; there are no emoji.

## Access model

The map and the key figures are open to everyone: tour name, position, summit elevation, vertical
gain, duration, grade, aspect, season and teaser. The route description, elevation profile, GPX
download and avalanche terrain notes require a subscription that is `trialing` or `active` — a
`canceled` subscription keeps access until the period it already paid for runs out.

This is enforced in two places. Server-side, `getViewer()` in `lib/access.ts` resolves the current
viewer and returns `hasAccess`; pages must decide what to render from that flag, and gated content
must never reach the client for a viewer without access. Independently, RLS policies in
`supabase/schema.sql` restrict the gated columns at the database level, so a leaked anon key or a
mistake in a route handler still cannot read them. Treat both as required — the server check is
the product behaviour, RLS is the backstop.

`grantsAccess()` is mirrored in SQL as `public.tk_has_active_subscription()`, and the two must
say the same thing. `lib/access.test.ts` pins the TypeScript side case by case, written so it can
be read against that function line by line — change one and the test is where you find out you
have to change the other.

### The route figure

`<RouteMap>` draws the tour's own line over Kartverket's topographic tiles — the same map
`/kart` renders, in the same grid, and the line is solved in the same terrain model those tiles
are drawn from, so the contours under the line are the contours it followed.

It went through three states, and the middle one is the interesting mistake. First a shared
placeholder image, which was simply false. Then the route's real points in an empty frame over a
drawn grid, which was true and still not much: the shape of a line and nothing about the ground
it crosses. A route with no mountain around it is a graph.

Putting a real map underneath raises the stakes on the projection. The frame version used
equirectangular about the route's midpoint, which is fine when nothing has to line up with
anything. Now the line has to sit in the right place on a picture someone else drew, so it is
computed in spherical Mercator — exactly what the WMTS and Leaflet use. `RouteMap.test.ts` pins
that against independently computed values and checks all 103 routes fit inside their figure,
because a wrong projection throws nothing and renders beautifully.

Zoom is an integer, so padding is expensive: every pixel of margin is half the scale the moment a
route stops fitting. The north arrow and scale bar are therefore placed by counting route
vertices per corner and taking the two quietest, rather than by widening the margin until the
summit marker stops colliding with them.

### Deleting an account

`DELETE /api/konto`, behind the «Slett kontoen» card on Min side. The order is Stripe first,
Postgres second, and it is not arbitrary: cancel the subscription and fail the delete, and the
reader has an account with no subscription — annoying, visible, fixable. Delete first and fail at
Stripe, and the account is gone while the card keeps being charged every month, with no account
left to find the customer through. Only one of those two failures keeps costing money after it
happens.

One `auth.users` delete takes the profile, the subscription row, the invoice mirror and the
feedback with it, through `on delete cascade`. What stays is the customer and the invoices at
Stripe: that is the accounting record the Bookkeeping Act wants kept for five years, and
`/personvern` says so in both languages. The invoice *mirror* is not that record — it exists so
«02 · Kvitteringer» can render without a round trip — so it goes with the reader who asked to be
forgotten.

Confirmation is type-the-word rather than a second click. Cancelling a subscription can be undone
by subscribing again; this cannot be undone by anyone, including us.

### The one endpoint that is open on purpose

`/api/tilbakemelding` takes a message without asking anyone to sign in, because the people most
likely to have something useful to say are the ones who have not signed up. That decision is what
makes `lib/rate-limit.ts` necessary: an open write endpoint is one loop away from a full table,
and the honeypot in the route only catches a form filler, never someone repeating the request
they saw in the network tab. The limit is ten an hour per caller, counted by
`public.tk_rate_limit_hit()` in Postgres — in the app it would be one counter per lambda, which
is not a limit — and keyed by a salted hash of the address, so the table can say that *someone*
wrote twice and never who. It fails open: turning away a reader with something to say is the
worse error here, which is the opposite of how `lib/admin.ts` is built and for the opposite
reason.

## Before launch

The design handoff flags this work as unfinished. None of it is a code defect; all of it is
content and data quality that has to be settled before the site is sold to anyone.

- **Route lines are generated, not surveyed.** They are no longer schematic: `lib/routes.ts` holds
  detailed lines — one or more per tour — solved as least-cost paths over Kartverket's 1 m terrain
  model through the corridor each route follows, and the summit coordinates behind them are snapped
  to the terrain model and checked against published heights. See `scripts/build-routes/` for the
  pipeline and what it verifies. What is still missing is ground truth: these lines show where a
  route goes, but nobody has skied them with a GPS. Surveyed GPX per route, served from Supabase
  Storage, is still the production plan.
- **Thirty-five peaks of 185 have their alternative routes entered, and the Fri Flyt corpus is
  now exhausted.** The data model takes any number of routes per tour and the map renders a picker
  when there is more than one; 223 routes now cover 185 tours, and Kjølen, Strandtinden and
  Rondslottet carry three lines each. The remaining 150 tours have exactly one route. That is no
  longer a research backlog against the source this collection was built from: every one of Fri
  Flyt's 580 published route pages has been indexed and read, and the four documented second
  starts left in it went in with the round that indexed them. Further second routes have to come
  from a different corpus — ut.no, the guidebooks, or a surveyed track. See the second-route
  rounds in `scripts/build-routes/README.md` for what counts as a second route, what gets turned
  away, and how the index was built.
- **Three summit heights were settled against DTM1, and still disagree with the published
  figures.** Rørnestinden (1041 → **1030**), Rombakstøtta (1243 → **1231**) and Himmeltindan
  (962 → **956**) now carry Kartverket's 1 m terrain model, the same source as the other 21
  summits. Himmeltindan's stored coordinate turned out to be 67 m off the top as well, reading
  8 m low; it was moved and its route regenerated, which is why its gain went 960 → 980 m.
  What remains open is *why* the published numbers sit 6–12 m higher. These are sharp, corniced
  Arctic tops and the published figures are old survey numbers, so the gap may be a cornice, a
  cairn, or simply an older measurement — DTM1 is bare rock. A local reader should settle it
  before print; the app is at least now internally consistent and single-sourced.
- **All seven Oslo-round tours sit in Varsom B-regions, and so do the three nearest Trondheim.**
  Norefjell, Vikerfjell and Skrim are *Buskerud sør*, Blefjell is *Telemark sør*, and Vassfjellet,
  Kråkfjellet and Rensfjellet are *Sør-Trøndelag*. A B-region is forecast only at danger level 4 and
  5 — so on most winter days the avalanche panel on those tours has no assessment to show, because
  none was made. Each of the ten guides says so in its own words, and every region was queried
  rather than assumed. The four Trollheimen tours are in an A-region and are forecast daily.
- **The tour cards are checked, the guides are checked, the geometry is checked — by machine.**
  `check_tours.py` and `check_routes.py` come back clean on all 185 tours and `check_guides.py` on
  every number in all 185 guides: every card height is DTM1 at the resolved summit, every vertical is
  its route's cumulative ascent to within 10 m, every number in the prose traces to a measurement, and
  `supabase/seed.sql` holds the same figures as `lib/tours.ts`. The last figure without a tracked
  source — a stone tunnel's altitude in Taraldsviktinden's guide — was settled by researching that
  mountain's second route; see «The second-route round» in `scripts/build-routes/README.md`. That last one was not true until it was checked: the seed had
  missed the summit corrections for Rørnestinden, Rombakstøtta and Himmeltindan, so production and
  demo mode would have shown different heights for three tours.
  A fourth, `check_ground.py`, was added after the Trondheim round, because those three checks were
  all clean on a line that ran two kilometres across a drawn-down reservoir and on another that was
  sold as a marked winter route while sitting more than half a kilometre off it. Terrain-model
  checks cannot see either: the geometry is sane, the numbers are DTM1, and the prose is sourced.
  `check_ground.py` measures the line against **mapped ground** instead — OpenStreetMap's water
  polygons and its winter routes — and asks which vertices stand on a lake, whether the guide says
  so, and how far a tour that promises a løype strays from the mapped one. It was validated by
  restoring the pre-fix geometry and confirming it flags all four of the errors that were found by
  hand. Its first run over all 75 came back with **21 things to look at across 16 tours**, most of
  them on tours from the original 24 that had already been read adversarially twice — every one a
  place where the drawn line stands on a lake under prose that never mentions it. One was fixed
  straight away and is the reason the check exists: **Fanaråken's guide says «Hold land langs
  vestsida — ikke skjær over isen», and the line cut across the ice** of Prestesteinsvatnet, a
  reservoir whose dam the guide's own next sentence names. It now runs on firm ground the whole way.
  Ytstevasshornet was the second fix and the same shape — «flate langs vatnet» in the prose, 180 m
  out on Svartevatnet's reservoir ice in the geometry — so no line stands on a regulated lake any
  more. Styggemann was the third and the first the prose fixed rather than the router: five
  natural waters, 1541 of 9608 metres, none of them named in the guide and none regulated — a
  groomed track over a narrow forest lake is ordinary winter travel, so the missing sentence was
  the defect, and Folarskardnuten the fourth on the same reasoning — four crossings, 495 of
  12 610 metres, on the marked DNT winter route. The remaining eleven have now been worked.
  **Two dissolved**: Glittertinden's «water» at 1335 m is terrain class `Myr`, and two of
  Rondslottet's three flat runs at 1167 m are open ground. **Two were rerouted**, both because the
  line went where the guide told the reader not to go — Rondslottet ran 90 m on the ice 60 m from
  Lonin under its own «Hold deg på land rundt vika ved Lonin ... i stedet for å ta snarveien over
  isen», and Breitinden ran 315 m straight across Breitindvatnet under the flank its guide calls a
  *terrengfelle*, with no published ski description sending it there. Neither has a vertex on water
  any more. **Seven became prose**: natural tarns on lines the sources themselves follow, now named
  with height, length and offshore distance. Working them turned up one new finding — Høgevarde
  strays up to 573 m from the track it calls «oppkjørt» — which is *not* a defect in the line: what
  is mapped there is unnamed `piste:type=nordic` loops, and a cross-country loop need not reach a
  summit. The guide states the number instead, and `check_trail` learned to soften to a note when
  the copy states the gap, which is what the water check has always done. The record of all eleven
  is in `scripts/build-routes/check_ground_run.txt`. The shape round then ran it over all 223 routes
  from one container and found nine more — four trail claims that Overpass had never answered for
  before, and four one-vertex tarn clips — which are listed under «The shape round» and are outstanding.
- **Every line has now been checked for its shape, and 34 tours have something to look at.**
  The shape round ran every check the pipeline owns over all 185 tours and 223 routes in one
  sitting and added the one that was missing: `check_geometry.py`, which reads the emitted
  TypeScript offline and asks whether a line crosses itself, goes in circles, walks out to a
  waypoint and back, stands on the sea or steps through a notch. The number checks were clean
  and the shape check was not. **Two lines go in circles on the closed road out of
  Kongsvikdalen** — `jakobstinden/sorostsiden` for 924 of its 8468 m and
  `kongsviktinden/nordsiden` for 964 of 9116 — so the «8,47 km» and «9,12 km» their guides quote
  are a tenth too long. **Seven routes walk out to a corridor waypoint and retrace**, 130–300 m
  each way; the one that reaches the prose is Snøtindan's east route, written as going «over
  Vestbotntinden» while the line visits the top and comes back. **Two lines stand on the sea**:
  Taraldsviktinden's east route along the harbour shore at −2 m and Nonstinden's east route
  across a tidal inlet at −5 m, which `check_ground.py` cannot see because it only asks about
  lakes. And **Storrønden's line drops 29 m into the east face and climbs 42 m out of it in the
  last 24 m before the cairn**, a notch DTM1 confirms point by point. The spurs and the notch
  are fixed in the same round by cutting the loops out of the shipped lines — seven cards moved
  by 10 to 100 m and two guides changed what they said — and `generate_routes.py` now drops the
  leftover vertices that made the notch. The six summits with the same leftover — Rana,
  Hamperøkken, Vassdalstinden, Kolåstinden, Breitinden, Forkledalstindan — got the same edit, and
  Rana's line, which had hooked onto the east face of a spire, now follows the south-west crest
  the guide calls «kammen» (card 1600 → 1560). The scribbles and the sea lines are re-solved with the off-water pass fixed (one dry
  vertex per wet run, and `Havflate` counted as water): Jakobstinden and Kongsviktinden lost a
  kilometre of loops each and their cards move 1060 → 1020 and 1090 → 1050, and the two sea routes
  stand on land. The four tarn clips are nudged onto the shore, the four trail claims state
  their measured gap, and the 29 mid-route notches are gone: ten were small out-and-backs and were
  cut, twenty vertices moved 5–20 m onto ground that reads like their neighbours, and six real
  steps stand and are the only shape findings left. See «The shape round» in `scripts/build-routes/README.md` for all of it.
  What the same round did fix: **five `seed.sql` rows and five English teasers were two
  corrections behind their cards** — Glittertinden's said «1180 høydemeter» beside a
  `vertical_m` of 1228 — because `check_tours.py` compared four numeric columns and no text;
  it now compares every column, the English teaser's figures, and `tourmeta.json`, where fifty
  `hasGuide` flags had gone stale.
- **Three peaks were added after the Trondheim round: Kjerag, Møysalen and Sæbyggjenuten.**
  They bring three new regions with them — Rogaland, Vesterålen and Setesdal — and they were
  routed, carded and written the same way as the rest, with `check_ground.py` run before the prose
  rather than after it. That order changed what got written. All six water crossings the check
  found are natural lakes rather than reservoirs, so none of them needed a reroute — but none of
  them would have been mentioned either, and now each is named with its height, its length and how
  far offshore the line gets. Two of the three carry a correction the sources do not:
  **Kjerag's plateau high point is not the highest ground on the plateau** — DTM1 puts 1163.7 m
  some 1347 m east-north-east of the registered point, and the drawn line itself crosses 1129 m
  before giving back 66 m to reach the 1124 m summit — and **Sæbyggjenuten is forecast by Varsom
  as Vest-Telemark, not Setesdal**, which is the region label the app shows. Møysalen's summit
  ridge holds a 51 m notch over 27.3 m of ground; it was checked point by point at 2.3 m spacing
  before it went in the copy, because a drop that abrupt is usually a grid artefact and this one
  is not.
- **Every treeline was a sample, and all 78 that existed then have been re-measured.** The 12
  tours added since were written against the fixed `treeline_scan` from the start, so the numbers
  below describe the repair, not the current set. `guide_facts.py` derived the
  treeline from a fourteen-point terrain-class table, so `last_forest_m` was the highest of
  fourteen points that *happened* to be forest — a lower bound, never anything else, and wrong in
  the same direction every time. `treeline_scan` now walks every vertex, stopping only after 600 m
  of ground *and* 150 m of height without forest, with a 1300 m ceiling so alpine routes cost
  nothing. **62 of the 78 moved, every one of them upward**, and five tours that had no treeline at
  all turned out to have one. The largest error was Breitinden at +271 m (30 → 301); Kirketaket
  moved +225, Lodalskåpa +183, Skåla +176, Hornindalsrokken +152. **34 guides quoted a figure that
  changed and all 34 are corrected** in both languages. Two sentences had to be rewritten rather
  than renumbered, because the new `first_open_m` means the first non-forest vertex after the last
  forest one rather than the lowest sample above it, and Gyranfisen's «Ved 916 moh er du fortsatt i
  skog» inverted under it.
  The fix needed a second pass of its own: a blind numeric replace inside forest sentences
  corrupted Grafjell's «på 950 moh går ruta ut på Istjenn», which is a lake elevation that happened
  to equal the old treeline. The replacement is scoped to the phrasings that actually *state* a
  treeline, and every substitution is checked against the stored old value before it is made.
- **`emit_new_tours.py` must be given slugs, never run bare.** It rebuilds the `TOURS` rows from
  `new_tourmeta.json`, which is the *research* snapshot — so a bare run reverts every teaser and
  vertical corrected after the research, silently. Running it once during this round put back ten
  stale teasers and two card verticals (Hamperøkken 1400 → 1390, Jakta 1560 → 1570). `check_tours.py`
  caught it and it was reverted. The four teasers in `new_tourmeta.json` that were genuinely stale —
  Breitinden, Kråkfjellet, Rensfjellet and Folarskardnuten, all disagreeing with their cards since
  the reroutes of earlier rounds — are fixed at source so the next run agrees.
- **And it must be run *before* `emit_guides.py`, never after.** The `TOURS` row it writes has no
  `hasGuide` field — that flag is `emit_guides.py`'s — so a later `emit_new_tours.py` run erases it.
  Vetefjellet shipped one commit without it after a teaser figure was corrected, and nothing caught
  it: `check_tours.py` does not read the flag, and `lib/guides.test.ts` only checks that every tour
  *claiming* a guide has one, which is the safe direction. A tour that has a guide and does not claim
  it passes every check and shows the reader nothing.
- **The guide text has not been read by anyone who has skied these tours.** Every number in
  `lib/guides.ts` traces to Kartverket's terrain model, the route research or a cited source, and
  every number is matched mechanically by `check_guides.py` — which reads nynorsk verticals as well
  as bokmål ones, and comes back clean on all 185 guides with no unsourced number left.
  On top of that, **105 of the 185 have been through an independent adversarial read** whose only job
  is to break it — the 24 of the first round, the 15 of the second, the 7 of the Oslo round, the
  22 of the Sunnmøre and Vestland rounds, the 7 of the Trondheim round, Kjerag, Møysalen and
  Sæbyggjenuten, the 4 of the popularity round, the 8 of the alpine-resort round and, last, the
  14 newest — the gap every previous round's write-up had to name. That read is written up in
  `scripts/build-routes/README.md`. The seventy-five of the fourteen newest rounds — Senja/Helgeland, Romsdal, Troms, Lofoten, Narvik, Sør-Troms, Tjeldsund, Lofast, Grytøya/Kvæfjord-vest, Ibestad, Tjeldøya, the island-completion round, the Møysalen round and the town round — are the current gap. It found four fabricated quotations, seven dropped or
  misplaced source warnings, four superlatives stated in the wrong place on the mountain, three
  bearings pointing the wrong way in fog, a fjord depth measured against water 8 km away, and a
  teaser naming the flank its own guide says not to ski — all fixed, in both languages.

  **The last of those closed a hole that was not about those eight at all.** The re-route in #62
  moved twenty-odd lines, and the prose describing them was re-derived for some tours and not for
  others. Measured against the lines the app ships, **27 opening figures** — the distance and the
  climb in a guide's first sentence — described a line that no longer existed, Molden and
  Melshornet by about 300 metres; so did the band and step tables of five of the eight.
  Prestholtskarvet had drifted furthest and had begun contradicting itself, stating the same
  band as 1,3° over 5130 m in its intro and 1,2° over 5221 m in its ascent. Nibbi named the wrong
  band as the steepest on the tour, against its own intro. All of it is corrected.

  `check_guides.py` could not see any of it: it accepts a distance if it lands within 150 m of
  *any* sourced number, and with hundreds in scope that is nearly always true. The replacement
  check is tied to the route's own length and runs in CI — see "Checks" above and "The eight,
  read adversarially" in `scripts/build-routes/README.md`. The 15 band claims outside those
  eight that the same scan flagged have since been worked, and the band-tied scan they came
  from was rebuilt and run over all 91 guides in both languages: the #62 re-route had left
  stale band and step figures in **30 guides**, every one verified against the pre-#62 line
  before it was touched, and where a superlative's identity had moved — Okla's steepest band,
  Tromsdalstinden's steepest step — the sentence was rewritten to say where the steep ground
  actually is. See "The second reground" in `scripts/build-routes/README.md`.

  The read of Kjerag, Møysalen and Sæbyggjenuten moved a card, rewrote half a guide,
  and found the pipeline bug two bullets up. It was the first read done by someone other than the
  pass that wrote the guides, and it found the worst class of error yet: **two routed lines that
  crossed water the guide said they went around.** Kråkfjellet and Rensfjellet ran 1.9 km out on Håen — a reservoir
  drawn down every winter, and the one hazard their source names — while the copy said «følg
  strandlinja på nordsida», and Okla crossed Mjølkskåla while the copy said the lake stayed
  «under deg». All three of those corridors were re-pinned onto the ground the sources describe (the
  forest road ut.no offers along Håen, the rim north of Mjølkskåla), re-routed and re-measured,
  and their guides rewritten against the new lines. It earns its keep every
  time. It caught a descent sold on the wrong side of Kavringtinden, a cliff warning pointing away
  from the cliff on Storehorn, a rock band on Synshorn that does not exist, a ski centre placed on
  the wrong side of Høgevarde, and — in the last pass — Skarsteinsfjellet sent *east* down a
  mountain whose trailhead is west, a crevasse warning on a Torvløysa glacier the route does not
  cross, and an Auskjeret warning about an east-facing slope that measures 7 to 9 degrees while
  the north-east side measures 36. Ten of those 22 needed a change; twelve were confirmed clean;
  four of the seven Trondheim tours needed their line moved. The remaining three were then read
  a second time rather than trusted, which is where the fourth came from: **Storhornet was not on
  the marked winter route it is sold as** — pinned to a register point with no cabin within 600 m
  while the mapped `piste:type=skitour` trail it claims to follow runs 1.4 km away through 131 of
  them — and its answer to Fri Flyt's one hazard note understated the south side by fifteen
  degrees, because the probe that measured it stopped 10 m short of where the ground breaks.
  That makes the copy sourced and verified against the terrain model — but not against anyone's
  experience of the mountain. It still needs a local reader per tour before print. See "The 22,
  read adversarially", "The seven, read adversarially" and "The other four, read as closely" in
  `scripts/build-routes/README.md` for the method and the findings.
- **`assets/photo.jpg` is still a placeholder.** It is an unrelated reference photo from the
  design system, and it is now used for one thing only: the Open Graph image in `lib/seo.ts`, the
  picture that appears when someone shares a link. Replace it with something that is actually of
  a Norwegian ski tour before the site is shared anywhere that matters.

  `assets/kontur.png` is **gone**, and with it the last invented terrain on the site. It was a
  generated contour graphic with «1439 moh» baked into the artwork — 1439 is Kirketaket, because
  the prototype drew Kirketaket. The tour pages stopped using it when `<RouteMap>` landed and
  started drawing each peak's own line; the landing page kept it until it was replaced by that
  same component, drawing Kirketaket's real normal route. The number is true again, on the one
  mountain it was always about.
