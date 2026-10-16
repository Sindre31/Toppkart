# Handoff: Turguide v3 — kart ved siden, nytt uttrykk

## Oversikt
Omdesign av turguiden (`/tur/[slug]`) og kartsiden (`/kart`) i Toppkart. Målet er en guide som er lett å lese ved planlegging på PC: kartet står fast ved siden av teksten, prosaen er kuttet til fire etapper koblet til kart og høydeprofil, og det som må gjøres før turen («Før du går», atkomst) står først. Uttrykket er nytt — det erstatter «Industry» (Barlow Condensed, blåkopi-rammer, stålblått).

## Om designfilene
Filene her er **designreferanser laget i HTML** (`.dc.html`-prototyper med inline-styles og en liten logikk-klasse nederst). De skal **ikke** shippes — oppgaven er å gjenskape dem i den eksisterende Next.js-kodebasen (App Router, Server Components, CSS Modules + `app/globals.css`, Leaflet via react-leaflet, Lucide-ikoner). Bruk eksisterende komponenter og dataflyt; bytt ut tokens og markup.

Rutelinja og etappetallene i prototypen er **skjematiske** — i produksjon kommer geometrien fra `routeProfile()` i `lib/tours.ts`, og etappene må avledes av den (se «Etapper» under).

## Fidelity
**High-fidelity.** Farger, typografi, radier, skygger og layout er endelige. Gjenskap pixel-nært på 1280 px og bredere; under ~1000 px faller to-kolonne-oppsettet til én kolonne (kartet over teksten).

## Design-tokens (nytt, erstatter Industry i `app/globals.css`)
Farger
- `--color-bg` papir: `#f4f1ea`
- `--color-card`: `#fffdf8`
- `--color-text` blekk: `#1c2622`
- Dempet tekst: `rgba(28,38,34,0.78)` (brødtekst-sekundær), `0.62`/`0.6` (etiketter), `0.5`/`0.55` (hint)
- Flater: `rgba(28,38,34,0.05)` (tint), `0.06` (søkefelt/segment), `0.08` (nummer-sirkel av)
- Linjer: `rgba(28,38,34,0.12)` (footer-strek), `0.14`/`0.18` (knapperammer)
- Aksent «tyttebær»: `#8a2a5b` (rute, lenker, aktive valg) · hover/mørk `#5c1a3c`
- Aksent-tint: `rgba(138,42,91,0.08)` (profilfyll, valgt rad), `0.3` (dempet rutesegment)
- Fylt knapp / valgt: blekk `#1c2622` på papir `#f4f1ea`; hover `#2b3a34`
- Gradfarger (kartmarkører og legende): 1 `#e2b3c9`, 2 `#bf6a93`, 3 `#8a2a5b`, 4 `#4a1430`, hvit kant 2 px
- Skredfare: behold `DANGER_COLORS` fra `lib/avalanche.ts` (nivå 2 = `#ffff00` med tekst `#1c2622`). Disse er standardfarger og skal ikke tilpasses paletten.

Typografi (Google Fonts, last via `next/font`)
- Display/tall: **Instrument Serif** 400 (regular + italic)
- Tekst/UI: **Schibsted Grotesk** 400/500/600/700, `font-feature-settings: "tnum"`
- h1: Instrument Serif `clamp(56px, 6.5vw, 84px)`, line-height 0.98, letter-spacing −0.02em
- Seksjonstittel (h2): Instrument Serif 32px / 1.05 / −0.015em
- Store tall i kort: Instrument Serif 30px (statkort), 36px (bratthet), 40px (faregrad/temp)
- Ingress: Schibsted 18/28, farge 0.78; kursiv setning i Instrument Serif italic 20px
- Brødtekst: 16/26 (punktlister), 15/23 (kort), etiketter 12–13px 500
- Knapper: 14px 600, høyde 42px, pill (radius 999)
- Logo: Instrument Serif 26px «Toppkart»

Form
- Radius: kort 14px, kartramme 22px, profilkort 18px, statkort i panel 12px, piller 999px
- Skygge kort: `0 1px 0 rgba(28,38,34,0.06), 0 8px 24px rgba(28,38,34,0.05)`
- Skygge aktivt etappekort: `0 1px 0 rgba(28,38,34,0.06), 0 12px 32px rgba(28,38,34,0.1)`
- Skygge kart/panel: `0 1px 0 rgba(28,38,34,0.08), 0 24px 60px rgba(28,38,34,0.12)`
- Flytende kontroller over kart: bakgrunn `rgba(255,253,248,0.92)`, `backdrop-filter: blur(8px)`, skygge `0 6px 20px rgba(28,38,34,0.14)`, pill
- Ingen blåkopi-rammer, ingen registreringskryss, ingen uppercase-overskrifter.

## Skjermer

### 1. Turguide (`Turguide v3.dc.html` → `app/tur/[slug]/page.tsx`)
Toppnav: sticky, 18px vertikal padding, `rgba(244,241,234,0.9)` + blur 10px, ingen strek. Logo venstre, lenker Kartet / Mine turer / Om (14px 500, opacity 0.75), språkvelger som pill-segment (NO valgt = blekk-fylt).

Innhold: `max-width 1360px`, padding `0 clamp(20px,4vw,48px) 72px`.

Header
- «← Tilbake til kartet» 13px 500, dempet.
- Metalinje: «Romsdal · Middels · Sesong des–mai» 13px 500 dempet.
- h1 fjellnavn, ingress med kursiv avslutning.
- Handlinger høyre, pill-knapper 42px: Favoritt (ikon-knapp 42×42, Lucide `star`), «Har gått» (Lucide `check`; trykket = blekk-fylt, tekst «Gått 16. okt. 2026»), «Lagre offline» (Lucide `wifi-off`), **«Last ned GPX»** fylt blekk (Lucide `download`). Ikoner 15px, stroke 1.75.

To kolonner: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 440px), 1fr))`, gap `32px clamp(28px,4vw,64px)`. På 1280 px gir det venstre lesekolonne ≈ 5/12 og høyre kart ≈ 7/12 — bruk `minmax(0,5fr) minmax(0,7fr)` over 1000 px og én kolonne under.

Venstre kolonne (lese)
1. **Statkort** 3×2 grid, gap 10: Topp 1439 moh · Høydemeter ↑ 1270 m · Lengde 5,5 km · Normaltid 5–6 t · Himmelretning SV · Grad Middels. Kort 14px radius, padding 14/16, etikett 12px, verdi Instrument Serif 30px.
2. **Før du går** (h2). Rad med to kort (`repeat(auto-fit, minmax(240px,1fr))`): faregrad-kort (gul, tall 40px, «Moderat skredfare / Romsdal · Varsom») og værkort (Lucide `cloud-snow` 28px, «−4°» 40px, «På toppen nå, lett snø / Vind 6 m/s fra SV · Yr ↗»). Under: **sjekkliste** i ett kort (padding 6/4), rader 10/14 med radius 10 og hover-tint; egendefinert rund avkrysning 20px (ring 1.5px `rgba(28,38,34,0.3)`, avkrysset = blekk-fylt med hvit hake), tekst 15px, hint 12px dempet til høyre; avkrysset tekst gjennomstreket og 0.45. Lagres i `localStorage` per tur (samme mønster som `tk_marks`).
   Punkter: Les dagens skredvarsel · Sjekk været på toppen · Sender/mottaker, søkestang og spade · GPX på klokka eller telefonen · Guiden lagret offline · Si fra hvor du går og når du er tilbake.
3. **Kom deg dit** (h2). Kort med «P»-merke (26px sirkel, 2px aksentkant), stedsnavn 18px 600, beskrivelse 15/23, høyre: «Veibeskrivelse ↗» og «60 moh · lat, lng». Hover på kortet uthever etappe 1 i kartet.
4. **Opp, i fire etapper** (h2 + hint «Pek for å se den i kartet»). Liste av etappekort: grid `36px 1fr`, gap 16, padding 14/16/14/12, radius 14, margin-bottom 6. Nummer i 36px sirkel (Instrument Serif 22px; av = `rgba(28,38,34,0.08)`/blekk, aktiv = aksent/hvit). Tittel 17px 600, meta 13px dempet høyre («520–900 moh · 1,7 km»), tekst 15/23. Aktiv (hover eller klikk-låst): bakgrunn `#fffdf8` + skygge. Avsluttes med mørkt kort (blekk, papir-tekst) «I dårlig sikt: hold ryggen …».
5. **Ned** (h2): punktliste med 8px aksent-prikk, 16/25, fet innledning.
6. **Skredterreng** (h2): to kort — «Normalruta / under 30°» og «Flankene mot S og SV / 30–40°», tall 36px, forklaring 14/21.
7. **Langs ruta** (h2): tre bilder 4:3, radius 14, bildetekst 13px («1 · Start, 60 moh»). Bilder fra `lib/photos.ts` eller nye felt på guiden.
8. **Flere turer i Romsdal**: pill-lenker (navn 14px 600 + «1048 moh · Middels» 12px); hover inverterer til blekk/papir.

Høyre kolonne (kart), `position: sticky; top: 76px; height: calc(100vh − 96px); min-height: 600px`
- Kartramme radius 22, skygge stor, fyller høyden. Leaflet: OSM under + Kartverket topo over (som i `lib/map-tiles.ts`), zoom-kontroll nederst høyre, stylet som pill (36px knapper, ingen ramme).
- Over kartet (øverst): venstre pill med aksent-prikk og tekst «Hele ruta · 5,5 km» / «Etappe 2 · 520–900 moh»; høyre pill-lenke «Åpne i hovedkartet ↗» (hover inverterer).
- Rute: hvit underlinje 8px (opacity 0.9) + ett `Polyline` per etappe i aksent 3px. Aktiv etappe 6px, øvrige 0.3 opacity. Tooltip «2 · Slak rygg over skogen». Start: «P»-ikon 26px; topp: trekant 28×25 i aksent med hvit kant; etappeskiller: 20px sirkler med tall (papir-fyll, 2px aksentkant). Markører som `divIcon` (se `components/map/markers.ts`).
- Under kartet: **Høydeprofil**-kort (radius 18): tittel Instrument Serif 20px, høyre «5,5 km · ↑ 1270 m · brattest 900–1200 moh» 13px. SVG viewBox 600×150, to vannrette hjelpelinjer 0.1, arealfyll `rgba(138,42,91,0.08)`, ett `path` per etappe (2.5px, aktiv 5px, dempet 0.3), usynlige `rect`-felter per etappe som hover-mål, etappenummer sentrert nederst, «60 moh» og «1439 moh» i hjørnene.

Footer: strek 0.12, 13/24 dempet, lenker uten understrek, kreditering «Kartgrunnlag © Kartverket · …» høyre.

Inngangsanimasjon: `rise` (opacity 0→1, translateY 10→0) 0.5–0.6 s ease-out, forsinkelse 0 / 0.1 / 0.2 s på header / tekstkolonne / kart. Respekter `prefers-reduced-motion`.

### 2. Kartsiden (`Kart v3.dc.html` → `app/kart/MapView.tsx` + `kart.module.css`)
Hele skjermen: grid `64px 1fr` × `400px 1fr`, bakgrunn papir. Toppbar uten strek (logo, lenker, språk-pill). Panel og kart er to «flytende» flater med radius 22 og skygge, 16px fra kantene.

Liste-modus
- Søk som pill (42px, `rgba(28,38,34,0.06)`, Lucide `search`) + «Nær meg»-pill (Lucide `locate`).
- Gradfilter som chips: Alle / Enkel / Middels / Krevende / Ekspert med gradprikk; valgt = blekk-fylt. Region-select som pill til høyre. Rad to: Himmelretning / Høydemeter / Mine turer som piller.
- Teller «185 turer · mest populære først» 12px.
- Turkort: ingen ramme, radius 14, padding 12/14, hover-tint 0.05, valgt `rgba(138,42,91,0.08)`. Navn Instrument Serif 22px, «1439 moh» 14px 600 høyre, metalinje 12.5px (gradprikk + navn, region, ↑ hm, tid). Hover på kort forstørrer markøren i kartet (7→11 px).

Detalj-modus (erstatter lista)
- Foto 16:10 øverst med flytende «← Lista» (venstre) og Favoritt/Har gått ikon-knapper (høyre).
- Metalinje, h2 Instrument Serif 40px, teaser 15/23.
- 2×2 statkort (tint 0.05, radius 12, verdi Instrument Serif 26px).
- **«Åpne turguiden →»** fylt blekk, 48px, full bredde — den ene handlingen.
- To små kort side om side: faregrad (gul) og vær (tint), tall 30px.
- Notis om beregnet rutelinje 12px.

Kart
- Markører: `circleMarker` r 7, gradfarge, hvit kant 2px; valgt/hover r 11; filtrert bort = opacity 0.15.
- Posisjonsknapp øverst høyre (38px pill), legende nederst venstre (pill med fire gradprikker).
- Valgt topp: `flyToBounds` 0.8 s rundt ruta; rute hvit 8px + aksent 3px, «P»-start med tooltip «Start / parkering».

## Interaksjon og tilstand
- Guide: `hover: number|null`, `pinned: number|null` (klikk låser/opphever en etappe); `active = hover ?? pinned` styrer kartsegmenter, profil og etappekort samtidig. `checks` (sjekkliste), `fav`, `done` i `localStorage`.
- Kart: `selected`, `hovered`, `grade`, `query`. Logoklikk nullstiller og flyr hjem.
- Leaflet i sticky kolonne: opprett kartet først når beholderen har størrelse, og kall `invalidateSize()` fra en `ResizeObserver`. Musehjul-zoom av til kartet er klikket, av igjen ved `mouseout` (som i dag).

## Etapper (dataendring)
Guiden deles i 3–5 etapper per rute. Hver etappe trenger: tittel, kort tekst, start/slutt-indeks i rutelinja, høydeintervall og lengde. Foreslått felt på `TourGuide`: `stages: { title: string; body: string; fromIdx: number; toIdx: number }[]`; høyde og lengde regnes fra `routeProfile()`. Eksisterende `ascent[]`-prosa kan brukes som kilde ved første generering (`scripts/build-routes/emit_guides.py`).

## Ikoner
Lucide: `download`, `map`, `wifi-off`, `star`, `check`, `cloud-snow`, `cloud`, `search`, `locate`. Stroke 1.75 i knapper, 1.5 i værikoner.

## Filer
- `Turguide v3.dc.html` — turguiden
- `Kart v3.dc.html` — kartsiden
- `image-slot.js` — prototypekomponent for bildeplasser (bruk `<img>`/`PeakPhoto` i produksjon)
