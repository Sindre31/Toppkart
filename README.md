# Toppkart

Toppkart is a Norwegian ski-touring field guide sold as a subscription: quality-assured peak
tours on one map, with route, vertical gain, steepness and avalanche terrain. The subscription
costs 29 kr/mnd (or 290 kr/år), and every new account starts with a 14-day free trial where a
card is required at signup and the first charge lands when the trial ends. The site is in
Norwegian; this README and the rest of `docs/` are in English for whoever maintains it.

## Stack

- **Next.js 16, App Router**, TypeScript in strict mode. Server Components by default.
- **Supabase** — passwordless magic-link auth, Postgres for tours/profiles/subscriptions (tables are prefixed `tk_`, so the database can be shared with other projects), and
  row-level security as the second line of defence on gated columns.
- **Stripe** — subscription billing. Checkout in `mode: "subscription"` with
  `trial_period_days: 14`, the Customer Portal for payment-method changes and cancellation, and
  webhooks to sync subscription status back into Postgres.
- **Resend** — transactional mail (receipts, "your trial is ending" notices). Supabase Auth can
  also be pointed at Resend SMTP so the magic-link mail comes from the same sender.
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
protect is placeholder copy that ships in the repository anyway. It exists so the app can be
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
  logg-inn/              /logg-inn — magic-link sign-in
  betaling/              /betaling — start-the-trial checkout
  min-side/              /min-side — subscription, receipts, account
  api/                   Route handlers, incl. api/stripe/webhook
components/
  Blueprint.tsx          <Blueprint> registration-cross frame, <SectionKicker>
  SiteChrome.tsx         <SiteNav>, <SiteFooter>
lib/
  config.ts              PRICE, TRIAL_DAYS, SITE, GRADE_COLORS, env, is*Configured
  types.ts               Tour, TourGuide, Viewer, Subscription, Invoice
  tours.ts               The 24 tours, REGIONS, getTour(), routesFor(), routeById(),
                         routeFor(), routeProfile()
  routes.ts              Generated ascent routes per tour — see scripts/build-routes/
  guides.ts              Editorial guide content (currently Kirketaket only)
  access.ts              getViewer() / grantsAccess() — server-only access gate
  stripe.ts              Stripe client, null in demo mode
  demo-session.ts        Cookie-backed stand-ins for auth and subscription
  supabase/              Browser and server Supabase clients
supabase/
  schema.sql             Tables, policies, RLS
  seed.sql               The 24 tours and the Kirketaket guide
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
| `/logg-inn` | Passwordless sign-in, sends a magic link | `Logg inn.dc.html` |
| `/betaling` | Start the trial — 0 kr today, card required | `Betaling.dc.html` |
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
- **Three summit heights disagree with the terrain model.** Rørnestinden, Rombakstøtta and
  Himmeltindan sit 11–13 m below their published figures in DTM1. The coordinates are right; the
  heights are old survey numbers on sharp, corniced tops. Worth settling before print.
- **The Kirketaket guide text is example content.** The ascent, descent and avalanche-terrain
  copy in `lib/guides.ts` was written to fill the layout. It needs editorial review by someone
  who knows the tour before publication, and the same applies to every guide written after it.
- **`assets/kontur.png` is a placeholder.** It is a generated contour-map graphic standing in for
  real ski-touring photography. `assets/photo.jpg` is an unrelated reference photo from the design
  system and should also go.
- **Map tiles should move to a Norwegian topographic source.** OpenStreetMap is what the prototype
  used; Kartverket's WMTS or a MapTiler style with Norwegian topography is the intended
  production source. Keep the OpenStreetMap attribution visible for exactly as long as OSM tiles
  are being served.
