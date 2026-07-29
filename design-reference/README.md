# Handoff: Toppkart — abonnementstjeneste for skiturer

## Oversikt
Toppkart er en nettside som selger toppturguider for ski i Norge. Kjernen er et fullskjermkart med alle turene; turdetaljer (rutebeskrivelse, GPX, høydeprofil, skredterreng) ligger bak et abonnement på **29 kr/mnd** med **14 dagers gratis prøveperiode (kort kreves ved start, første trekk etter prøveperioden)**.

Målgruppe: både nybegynnere og erfarne — trygghet (skredterreng, Varsom-varsel) er gjennomgående i produkt og copy. Språk: norsk primært, med NO/EN-veksler (implementert på kartsiden i prototypen).

## Om designfilene
Filene i denne pakken er **designreferanser laget i HTML** — prototyper som viser tiltenkt utseende og oppførsel, ikke produksjonskode. Oppgaven er å **gjenskape designet i målkodebasen**. Det finnes ingen eksisterende kodebase; anbefalt oppsett (bestemt av produkteier):

- **Hosting/deploy:** Vercel (anbefalt rammeverk: Next.js App Router)
- **Auth + database:** Supabase (passordløs innlogging med magic link på e-post; Postgres med RLS)
- **Betaling:** Stripe (Subscription, 29 kr/mnd, `trial_period_days: 14`, kort kreves ved oppstart — bruk Stripe Checkout + Customer Portal + webhooks)
- **E-post:** Resend (transaksjonsmail: kvitteringer, varsler; Supabase Auth kan konfigureres til å sende magic links via Resend SMTP)
- Kart: Leaflet + OpenStreetMap i prototypen. I produksjon vurder MapTiler/Mapbox med norsk topografisk stil, eller Kartverkets WMTS. Behold OSM-attribusjon hvis OSM brukes.

## Fidelity
**High-fidelity.** Farger, typografi, spacing og komponentgrammatikk er endelige og følger designsystemet «Industry» (se `styles.css` — alle tokens som CSS-variabler). Gjenskap pixel-nært.

## Designsystem («Industry»)
- Grunnflate `#f2f2f3`, tekst `#1d1f20`, én aksent (stålblå) `#5980a6` med 100–900-ramp (se `styles.css`). Aksent-700 `#416180` brukes for liten aksentfarget tekst (kontrast).
- Typografi: **Barlow Condensed 600** (overskrifter, UPPERCASE, letter-spacing 0.01–0.08em) over **Barlow 400/500/700** (brødtekst 15–16px/24px). Google Fonts.
- Alt er «blueprint»-objekter: rette hjørner (radius 0), 1px hairline-rammer (`--color-divider`), og **registreringskryss i hjørnene** (klassen `.blueprint` + fire `<i class="corner tl/tr/bl/br">`). Kort/figurer er transparente strektegninger; den solide aksentknappen (`.btn-primary`) er det eneste fylte objektet.
- Bilder dukoneres i aksentfargen (klassen `.duotone` — `mix-blend-mode: color`-overlay).
- Seksjoner nummereres med kicker-grammatikk: «01 · Abonnement» over en 1px linjal.
- Ikoner: Lucide, stroke 1.5. Ingen emoji (unntak: 🔒 brukt som lås-glyf i prototypen — erstatt med Lucide `lock`).

## Sider

### 1. Landingsside (`Landing.dc.html`)
- Sticky toppnav: brand TOPPKART, lenker (Kartet, Innhold, Pris, Logg inn), primærknapp «Prøv gratis».
- Hero: display-tittel «ALLE TOPPTURENE. / ETT KART.» (clamp 46–92px, linjebrudd per setning), ingress, CTA-rad («Prøv gratis i 14 dager» primær + «Se kartet» sekundær + notis «Deretter 29 kr/mnd. Ingen binding.»).
- **Dataplate** (blueprint-ramme med tittelblokk «Toppkart — nøkkeldata / TK-100 / Ark 01 av 04»): 4 rader — 214 toppturer; 12 regioner; 29 kr/mnd; 14 dager gratis med anmerkning «Kort kreves — første trekk etter prøveperioden». Verdier i Barlow Condensed 22px, radnummer i aksent-700.
- «02 · Hva hver turguide holder»: 3 blueprint-celler (Rute og nedkjøring / Skredterreng / Sesong og forhold).
- «03 · Trygghet først»: tekst + duotonet figur (konturkart-grafikk `assets/kontur.png`; byttes til ekte toppturfoto).
- «04 · Abonnement»: pris-plate (29 kr stor, punktliste 01–04) + e-postpåmelding («Start prøveperiode») med notis om innloggingslenke, Stripe og kort.
- Tweaks i prototypen: `showAnnual` (årspris-rad 290 kr/år), `showQuote` (sitatseksjon). Sjekk gjeldende defaults i fila.

### 2. Kartside (`kart.html`) — kjernen
- Toppbar 56px: brand, NO/EN-segmentkontroll, «Logg inn», «Prøv gratis» (åpner paywall-dialog).
- Venstre sidepanel 372px: søk, gradfilter (segmentkontroll Alle/1/2/3/4), regionvelger, teller + notis, scrollbar turliste (kort med navn, moh, gradprikk, region, ↑ høydemeter, tid).
- Kart (Leaflet, OSM): sirkelmarkører farget etter grad — aksent-ramp 300/500/700/900 (`#b5d9fd`/`#749dc4`/`#416180`/`#1d2d3d`), hvit 1.5px kant. Filtrering dimmer markører (opacity 0.15). Tooltip med turnavn.
- Turvalg: markør forstørres, **skjematisk rutelinje** tegnes (hvit underlinje 6px + stiplet aksent-700 3px, startpunkt-sirkel med tooltip «Start / parkering»), kartet flyr til ruta. I produksjon: ekte GPX-geometri per tur.
- Detaljpanel (erstatter lista, «← Til lista»): navn, grad, region, moh; teaser-setning; stats-grid 2×3 (Høydemeter, Normaltid, Grad, Himmelretning, Sesong); ev. «Åpne turguiden →» (Kirketaket har guide-side); **låst blokk**: blurrede tekstlinjer, «Resten av guiden er låst», chips (Rutebeskrivelse, Høydeprofil, GPX, Skredterreng, Varsom-varsel), CTA «Start gratis prøveperiode».
- Paywall: alle «Prøv gratis»/«Start gratis prøveperiode»-CTA-er navigerer direkte til betalingssiden (`Betaling.dc.html`).
- NO/EN: full i18n-ordbok for UI-strenger (`I18N` i fila); turinnhold er norsk i prototypen.
- **Gating:** kartet og nøkkeltall er åpne for alle; beskrivelse/GPX/profil/skredterreng krever aktivt abonnement eller prøveperiode.

### 3. Turguide (`Turguide Kirketaket.dc.html`) — åpen guide (abonnentvisning)
- Breadcrumb «← Tilbake til kartet», region-kicker + tags (grad, sesong), display-tittel, ingress, «Last ned GPX» + «Åpne i kartet».
- Stats-plate: 5 celler (Topp 1439 moh, ↑1380 m, 5–6 t, Middels, SV).
- Kartutsnitt (duotone figur) + høydeprofil (SVG-areagraf, 60→1439 moh over 5,5 km).
- Nummererte seksjoner: 01 Oppstigning, 02 Nedkjøring, 03 Skredterreng (3 celler: Normalruta / Utenfor ruta / Før du går med varsom.no-lenke).
- Tweak `abonnent=false` viser låst tilstand (lås-blokk med CTA i stedet for seksjonene).
- **NB:** turteksten er eksempelinnhold — reelle beskrivelser må skrives/kvalitetssikres redaksjonelt.

### 4. Innlogging (`Logg inn.dc.html`)
- Sentrert blueprint-kort: «LOGG INN / UTEN PASSORD», e-postfelt, «Send innloggingslenke» (Enter sender også), enkel e-postvalidering med feilmelding.
- Sendt-tilstand: «Lenken er sendt» + «Send på nytt». Notis under kortet: «Ny her? Prøv gratis …».
- Produksjon: `supabase.auth.signInWithOtp({ email })`; magic link-e-post via Resend SMTP.

### 5. Min side (`Min side.dc.html`)
- Header «MIN SIDE» + innlogget e-post.
- «01 · Abonnement»: plate med plan «Toppkart — 29 kr/mnd», status-tag (Prøveperiode/Aktiv/Avsluttet), rader (Neste trekk, Betalingsmetode Visa •••• 4242, Medlem siden), knapper «Endre betalingsmetode» (→ Stripe Customer Portal) og «Avslutt abonnement» (bekreftelsesdialog: beholder tilgang ut perioden) / «Gjenoppta».
- «02 · Kvitteringer»: tabell (dato, beskrivelse, beløp, status-tag, PDF-lenke) — fra Stripe invoices; tom tilstand i prøveperioden.
- «03 · Konto»: e-postkort (endre adresse; innlogging med lenke). Ingen nyhetsbrev/varsler (bevisst fjernet).
- Tweak `subState`: trial | active | cancelled.

### 6. Betalingsside (`Betaling.dc.html`) — Stripe Checkout-flyt
- Toppnav med notis «Sikker betaling via Stripe». Kicker «Steg 2 av 2 · Betaling», tittel «START PRØVEPERIODEN».
- To kolonner: **Oppsummering** (blueprint-plate: plan 29 kr/mnd, prøveperiode −29 kr, «Å betale i dag: 0 kr» stor, notis om første trekk 12. august 2026) og **kortskjema** (e-post, kortnummer, utløpsdato/CVC, navn; knapp «Start prøveperiode — 0 kr i dag»; notis: kort behandles av Stripe, ingen binding, kvittering på e-post).
- Bekreftelsestilstand «VELKOMMEN OPP»: prøveperiode til 12. august 2026, knapper «Åpne kartet» + «Min side».
- Tweak `plan`: maned | ar (290 kr/år).
- Produksjon: bruk Stripe Checkout (hosted) eller Payment Element; `mode: "subscription"`, `trial_period_days: 14`, kort kreves. Denne siden viser tiltenkt utseende/innhold rundt betalingselementet.

## CTA-flyt
Alle «Prøv gratis»-CTA-er (landing-nav, hero, påmelding, kartsidens toppknapp, låst turdetalj, turguidens låste tilstand, innloggingssidens notis) → `Betaling.dc.html` → bekreftelse → kartet / Min side.

## Interaksjoner
- Hover/aktiv/fokus følger `styles.css` (aksent-ramp; `:focus-visible` 2px aksent-outline). Ingen browser-default states.
- Kart: `flyTo`/`flyToBounds` 0.8s ved valg; markør-radius 7→10 ved valg.
- Dialoger lukkes på backdrop-klikk og Lukk-knapp.
- Responsivt: sidepanel maks 85vw på smale skjermer; landing bruker clamp() og auto-fit-grids.

## Datamodell (forslag, Supabase/Postgres)
- `tours`: id, slug, name, region, lat, lng, summit_m, vertical_m, duration, grade (1–4), aspect, season, teaser, description_up, description_down, avalanche_notes, gpx_path (Storage), published.
- `profiles`: user_id (FK auth.users), email, locale.
- `subscriptions`: user_id, stripe_customer_id, stripe_subscription_id, status (trialing/active/canceled/past_due), current_period_end. Synkes via Stripe-webhooks (`checkout.session.completed`, `customer.subscription.updated/deleted`, `invoice.paid`).
- RLS: `tours` grunnfelter (navn, posisjon, stats, teaser) lesbare for alle; beskrivelsesfelter/GPX kun for brukere med status trialing/active (eller gate i API-laget/server components).
- Flyt: Logg inn (magic link) → Stripe Checkout (subscription, trial 14 dager, kort kreves) → webhook setter status → gating åpnes. Kvittering + «prøveperioden slutter snart»-e-post via Resend.

## Design-tokens
Alt i `styles.css` som CSS-variabler: `--color-*` (bg #f2f2f3, surface #e9e9ea, text #1d1f20, accent #5980a6 + ramper 100–900), `--font-heading/body`, `--space-1…8` (3.4–27.2px, 0.85 densitet), `--radius-*` (overstyres til 0 for blueprint-objekter), `--shadow-sm/md/lg`. Rytme på sidene: 24px leading-enhet, 12px halvsteg.

## Assets
- `assets/kontur.png` — generert konturkart-grafikk (plassholder for toppturfoto/kartutsnitt).
- `assets/photo.jpg` — referansefoto fra designsystemet (ikke tur-relatert; erstattes).
- `image-slot.js` — prototypekomponent for bildeplasser; i produksjon: vanlige `<img>`/next-image.
- Turdata i `kart.html` (`TOURS`-array): 24 ekte, kjente toppturer med **omtrentlige** koordinater — må erstattes med kvalitetssikrede data og ekte rutegeometri.

## Filer i pakken
- `Landing.dc.html` — landingsside
- `kart.html` — kartside (åpnes direkte; ren HTML + Leaflet)
- `Turguide Kirketaket.dc.html` — åpen turguide
- `Logg inn.dc.html` — innlogging
- `Betaling.dc.html` — betalingsside (Stripe Checkout-flyt)
- `Min side.dc.html` — konto/abonnement
- `styles.css` — designsystemets tokens + komponentklasser (lenkes av alle sider)
- `image-slot.js`, `assets/`

`.dc.html`-filene er prototypeformat: template-markup med inline-styles + en liten logikk-klasse nederst i fila. All markup, tekst og styling kan leses direkte fra filene; gjenskap som React-komponenter.
