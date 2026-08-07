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
  checkout. Nothing to do with signing in: Google sends no mail, so auth needs no SMTP at all.
  Optional — without the key those sends log and no-op.
- **Leaflet + OpenStreetMap** — the full-screen map on `/kart`. See "Before launch" about moving
  to a Norwegian topographic tile source.
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
npm run build      # production build
```

To run against real services, copy `.env.example` to `.env.local` and fill in the values you have.
The two modes are decided per integration, so a half-configured environment is fine: Supabase keys
without Stripe keys gives you real auth and a demo subscription.

## Project structure

```
app/
  globals.css            The "Industry" design system — source of truth for every token
  layout.tsx             Fonts, <SiteChrome>, metadata
  page.tsx               / — landing
  kart/                  /kart — full-screen Leaflet map, list panel, detail panel
  tur/[slug]/            /tur/[slug] — tour guide, gated below the key figures
  logg-inn/              /logg-inn — Google sign-in
  betaling/              /betaling — start-the-trial checkout
  min-side/              /min-side — subscription, receipts, account
  api/                   Route handlers, incl. api/stripe/webhook
components/
  Blueprint.tsx          <Blueprint> registration-cross frame, <SectionKicker>
  CapsText.tsx           Pulls back Barlow Condensed's over-wide uppercase Ø
  SiteChrome.tsx         <SiteNav>, <SiteFooter>
lib/
  config.ts              PRICE, TRIAL_DAYS, SITE, GRADE_COLORS, env, is*Configured
  types.ts               Tour, TourGuide, Viewer, Subscription, Invoice
  tours.ts               The 75 tours, REGIONS, getTour(), routesFor(), routeById(),
                         routeFor(), routeProfile()
  routes.ts              Generated ascent routes per tour — see scripts/build-routes/
  guides.ts              Editorial guide content — all 75 tours, generated
  access.ts              getViewer() / grantsAccess() — server-only access gate
  stripe.ts              Stripe client, null in demo mode
  demo-session.ts        Cookie-backed stand-ins for auth and subscription
  supabase/              Browser and server Supabase clients
supabase/
  schema.sql             Tables, policies, RLS
  seed.sql               The 75 tours and all 75 guides
design-reference/        The HTML prototypes and the product/design handoff. Read-only ground
                         truth; not shipped.
docs/
  deploy.md              Vercel, Supabase and Stripe setup checklist
```

## Routes

| Route | What it is | Prototype |
|---|---|---|
| `/` | Landing page: hero, data plate, what a guide contains, subscription | `Landing.dc.html` |
| `/kart` | The map — tour list, grade/region filters, detail panel with the route picker and the locked block. `?tur=<slug>` opens a tour, `&rute=<id>` a specific route | `kart.html` |
| `/tur/[slug]` | Tour guide: stats, elevation profile, ascent/descent, avalanche terrain | `Turguide Kirketaket.dc.html` |
| `/logg-inn` | Sign in with Google | `Logg inn.dc.html` |
| `/betaling` | Start the trial — sign-in first, then 0 kr today, card required | `Betaling.dc.html` |
| `/min-side` | Subscription status, receipts, account e-mail | `Min side.dc.html` |

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
- **Only five peaks have their alternative routes entered.** The data model takes any number of
  routes per tour and the map renders a picker when there is more than one, but `ALTERNATES` in
  `scripts/build-routes/build_corridors.py` currently covers Galdhøpiggen, Tromsdalstinden,
  Rondslottet, Snøhetta and Gaustatoppen. Other peaks in the list have well-known second routes
  that nobody has researched yet — the gap is content, not capability.
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
  `check_tours.py`, `check_guides.py` and `check_routes.py` come back clean on all 75 tours: every
  card height is DTM1 at the resolved summit, every vertical is its route's cumulative ascent to
  within 10 m, every number in the prose traces to a measurement, and `supabase/seed.sql` holds the
  same figures as `lib/tours.ts`. That last one was not true until it was checked: the seed had
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
  the defect. The remaining fourteen are a work list in
  `scripts/build-routes/check_ground_run.txt`.
- **The guide text has not been read by anyone who has skied these tours.** Every number in
  `lib/guides.ts` traces to Kartverket's terrain model, the route research or a cited source, and
  every number is matched mechanically by `check_guides.py` — which reads nynorsk verticals as well
  as bokmål ones, and comes back clean on all 75 guides.
  On top of that, **all 75 guides have been through an adversarial second read**
  whose only job is to break it — the 24 of the first round, the 15 of the second, the 7 of the
  Oslo round, the 22 of the Sunnmøre and Vestland rounds, and finally the 7 of the Trondheim
  round. That last read was the first one done by someone other than the pass that wrote the
  guides, and it found the worst class of error yet: **two routed lines that crossed water the
  guide said they went around.** Kråkfjellet and Rensfjellet ran 1.9 km out on Håen — a reservoir
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
- **`assets/kontur.png` is a placeholder.** It is a generated contour-map graphic standing in for
  real ski-touring photography. `assets/photo.jpg` is an unrelated reference photo from the design
  system and should also go. The contour graphic is now the only invented terrain left on a tour
  page: it carries a "1439 moh" label baked into the artwork and renders identically on all 75
  tours, so on 74 of them it states a height that is not that peak's. The caption says it is
  schematic, but it sits beside real figures — replace it before print.
- **Map tiles should move to a Norwegian topographic source.** OpenStreetMap is what the prototype
  used; Kartverket's WMTS or a MapTiler style with Norwegian topography is the intended
  production source. Keep the OpenStreetMap attribution visible for exactly as long as OSM tiles
  are being served.
