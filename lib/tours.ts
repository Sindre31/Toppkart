import { ROUTES, type TourRoute } from "./routes";
import type { Tour } from "./types";

/** The 24 tours from the prototype (`design-reference/kart.html` → TOURS).
 *
 *  Summit coordinates are now real: each one is resolved through Kartverket's
 *  place-name register, snapped to the highest cell of the 1 m terrain model and
 *  cross-checked against the published height. The teasers are still editorial
 *  drafts. In production these rows live in Supabase; this module is the seed
 *  and the local fallback.
 */
export const TOURS: Tour[] = [
  { slug: "storgalten", name: "Storgalten", region: "Lyngen", lat: 69.88543, lng: 20.25257, summitM: 1219, verticalM: 1219, duration: "5–7 t", grade: 3, aspect: "NV", season: "feb–mai", hasGuide: true, teaser: "Fjord-til-topp i ytre Lyngen: 1219 høydemeter rett opp fra havnivå." },
  { slug: "store-blamann", name: "Store Blåmann", region: "Troms", lat: 69.73502, lng: 18.59147, summitM: 1044, verticalM: 1040, duration: "4–6 t", grade: 3, aspect: "S", season: "feb–mai", hasGuide: true, teaser: "Kvaløyas brattest profilerte klassiker — krever stabile forhold og god planlegging." },
  { slug: "tromsdalstinden", name: "Tromsdalstinden", region: "Troms", lat: 69.6071, lng: 19.14585, summitM: 1238, verticalM: 1200, duration: "5–7 t", grade: 2, aspect: "V", season: "des–mai", hasGuide: true, teaser: "Tromsøs signaturtopp: lang, jevn oppstigning fra Tromsdalen med storslått utsikt mot Lyngen." },
  { slug: "rornestinden", name: "Rørnestinden", region: "Lyngen", lat: 69.57329, lng: 20.11187, summitM: 1030, verticalM: 1000, duration: "4–6 t", grade: 2, aspect: "V", season: "jan–mai", hasGuide: true, teaser: "Den vennligste inngangen til Lyngsalpene, med slak rygg og romslig nedkjøring." },
  { slug: "hamperokken", name: "Hamperokken", region: "Troms", lat: 69.5621, lng: 19.35872, summitM: 1397, verticalM: 1400, duration: "5–7 t", grade: 4, aspect: "NV", season: "feb–mai", hasGuide: true, teaser: "1400 høydemeter fra Fv91, men skiene settes igjen på Middagsaksla 1076 moh – siste 1,4 km er eksponert rygg til fots." },
  { slug: "kavringtinden", name: "Kavringtinden", region: "Lyngen", lat: 69.54704, lng: 20.12428, summitM: 1289, verticalM: 1250, duration: "5–7 t", grade: 3, aspect: "N", season: "mar–mai", hasGuide: true, teaser: "Indre Lyngen-perle med nordvendt snø som holder seg langt ut i mai." },
  { slug: "hesten-segla", name: "Hesten (Segla)", region: "Senja", lat: 69.51388, lng: 17.58462, summitM: 556, verticalM: 510, duration: "2–4 t", grade: 2, aspect: "S", season: "jan–apr", hasGuide: true, teaser: "Kort tur, stort postkort: nedkjøring med Segla i fanget og havet under." },
  { slug: "keipen", name: "Keipen", region: "Senja", lat: 69.4953, lng: 17.72324, summitM: 938, verticalM: 840, duration: "3–5 t", grade: 3, aspect: "S", season: "jan–mai", hasGuide: true, teaser: "840 høydemeter fra Medfjordbotnvatnan gjennom skåla sør for toppen; ruta skrår opp, mens fallinja ved sida av måler 38–52 grader." },
  { slug: "breitinden", name: "Breitinden", region: "Senja", lat: 69.45168, lng: 17.65623, summitM: 1007, verticalM: 1030, duration: "4–6 t", grade: 4, aspect: "SV", season: "jan–apr", hasGuide: true, teaser: "1030 høydemeter fra Svarthola via Svartholvatnet og Breitindvatnet; de siste 244 er klyving på sørvestryggen." },
  { slug: "rombakstotta", name: "Rombakstøtta", region: "Narvik", lat: 68.43312, lng: 17.58324, summitM: 1231, verticalM: 1100, duration: "5–7 t", grade: 3, aspect: "SV", season: "feb–mai", hasGuide: true, teaser: "Narviks spisse landemerke — variert oppstigning og fin, vedvarende nedkjøring." },
  { slug: "geitgaljen", name: "Geitgaljen", region: "Lofoten", lat: 68.34434, lng: 14.81302, summitM: 1085, verticalM: 1070, duration: "4–6 t", grade: 4, aspect: "NV", season: "feb–apr", hasGuide: true, teaser: "1071 høydemeter fra Liland opp Lilandsdalen; renna fra 250 til 360 moh er 35 grader, og toppen krever stegjern." },
  { slug: "himmeltindan", name: "Himmeltindan", region: "Lofoten", lat: 68.22101, lng: 13.57307, summitM: 956, verticalM: 980, duration: "4–6 t", grade: 3, aspect: "Ø", season: "feb–apr", hasGuide: true, teaser: "Vestvågøys høyeste, med alpint preg og linjer rett mot Nordishavet." },
  { slug: "stornappstinden", name: "Stornappstinden", region: "Lofoten", lat: 68.1441, lng: 13.41493, summitM: 740, verticalM: 680, duration: "3–5 t", grade: 2, aspect: "N", season: "jan–apr", hasGuide: true, teaser: "Lofot-klassiker i overkommelig format — mye fjell for høydemeterne." },
  { slug: "kirketaket", name: "Kirketaket", region: "Romsdal", lat: 62.61158, lng: 7.90672, summitM: 1439, verticalM: 1270, duration: "5–6 t", grade: 2, aspect: "SV", season: "des–mai", hasGuide: true, teaser: "Norges kanskje mest populære topptur: bred rygg, trygge linjevalg, lang sesong." },
  { slug: "snohetta", name: "Snøhetta", region: "Dovrefjell", lat: 62.31992, lng: 9.26747, summitM: 2286, verticalM: 820, duration: "5–7 t", grade: 2, aspect: "Ø", season: "apr–jun", hasGuide: true, teaser: "Storslått og luftig, men overraskende snill — når Snøheimvegen åpner." },
  { slug: "kolastinden", name: "Kolåstinden", region: "Sunnmøre", lat: 62.25886, lng: 6.31102, summitM: 1432, verticalM: 1120, duration: "5–7 t", grade: 3, aspect: "N", season: "feb–mai", hasGuide: true, teaser: "Alpin klassiker fra Standaldalen med velkjent renne og storslått finish." },
  { slug: "saudehornet", name: "Saudehornet", region: "Sunnmøre", lat: 62.23578, lng: 6.14246, summitM: 1303, verticalM: 1160, duration: "4–6 t", grade: 3, aspect: "SV", season: "jan–mai", hasGuide: true, teaser: "1157 høgdemeter frå vassverket i Ørsta, og ryggkammen held rundt 32° i snitt dei siste 170, med det brattaste på 37." },
  { slug: "slogen", name: "Slogen", region: "Sunnmøre", lat: 62.20818, lng: 6.67306, summitM: 1564, verticalM: 1520, duration: "6–8 t", grade: 4, aspect: "V", season: "mar–mai", hasGuide: true, teaser: "Sunnmørsalpenes dronning — en alvorlig tur for erfarne, i riktig vindu." },
  { slug: "jakta", name: "Jakta", region: "Sunnmøre", lat: 62.1711, lng: 6.61671, summitM: 1589, verticalM: 1560, duration: "6–8 t", grade: 3, aspect: "SØ", season: "feb–mai", hasGuide: true, teaser: "1560 høgdemeter frå Norang: slak stigning inn Konedalen, så ei 33-graders side opp på den smale toppryggen." },
  { slug: "skarasalen", name: "Skårasalen", region: "Sunnmøre", lat: 62.16566, lng: 6.48583, summitM: 1542, verticalM: 1440, duration: "6–8 t", grade: 3, aspect: "V", season: "jan–mai", hasGuide: true, teaser: "1438 høgdemeter frå bommen på Kvistadvegen, med det brattaste opp mot skaret på 1074 moh." },
  { slug: "rondslottet", name: "Rondslottet", region: "Rondane", lat: 61.9149, lng: 9.8512, summitM: 2178, verticalM: 1280, duration: "6–8 t", grade: 2, aspect: "S", season: "mar–mai", hasGuide: true, teaser: "Rondanes høyeste: rolig høyfjellsterreng og stabil vårsesong." },
  { slug: "storronden", name: "Storronden", region: "Rondane", lat: 61.8917, lng: 9.86198, summitM: 2139, verticalM: 1140, duration: "6–8 t", grade: 2, aspect: "SV", season: "mars–mai", hasGuide: true, teaser: "1140 høydemeter fra Spranget: seks kilometer innmarsj til Rondvassbu, så 2,6 km jevn vestrygg fra stidelet på 1440 moh." },
  { slug: "skala", name: "Skåla", region: "Nordfjord", lat: 61.86923, lng: 6.97251, summitM: 1848, verticalM: 1820, duration: "6–8 t", grade: 3, aspect: "SV", season: "mar–jun", hasGuide: true, teaser: "1848 sammenhengende høydemeter fra fjorden i Loen — en av landets lengste nedkjøringer." },
  { slug: "glittertinden", name: "Glittertinden", region: "Jotunheimen", lat: 61.65138, lng: 8.5575, summitM: 2451, verticalM: 1180, duration: "7–9 t", grade: 3, aspect: "SØ", season: "juni–juli", hasGuide: true, teaser: "12,6 km og 1180 høydemeter fra Veodalen: 7 km flat innmarsj til Glitterheim, så jevn stigning øst for Glitterbrean." },
  { slug: "galdhopiggen", name: "Galdhøpiggen", region: "Jotunheimen", lat: 61.63644, lng: 8.31243, summitM: 2469, verticalM: 630, duration: "6–8 t", grade: 3, aspect: "N", season: "apr–jun", hasGuide: true, teaser: "Norges tak på ski — bre, tau og stor høyde; vanligvis gått fra Juvasshytta." },
  { slug: "steindalsnosi", name: "Steindalsnosi", region: "Sogn", lat: 61.52696, lng: 7.90076, summitM: 2025, verticalM: 760, duration: "3–5 t", grade: 1, aspect: "S", season: "apr–jun", hasGuide: true, teaser: "2000-meter for de fleste: kort, slak og solvendt fra Sognefjellsveien." },
  { slug: "besshoe", name: "Besshø", region: "Jotunheimen", lat: 61.51791, lng: 8.68712, summitM: 2257, verticalM: 1300, duration: "6–8 t", grade: 3, aspect: "Ø", season: "mars–mai", hasGuide: true, teaser: "1305 høydemeter fra Bessheim: tre og en halv kilometer langs Bessvatnet før Grotådalen, og til slutt den slake austryggen over Brue." },
  { slug: "fanaraken", name: "Fanaråken", region: "Sogn", lat: 61.51669, lng: 7.90825, summitM: 2068, verticalM: 760, duration: "5–7 t", grade: 2, aspect: "N", season: "apr–jun", hasGuide: true, teaser: "Høyfjellstur fra Sognefjellet med breutsikt og pålitelig vårsnø." },
  { slug: "rasletinden", name: "Rasletinden", region: "Jotunheimen", lat: 61.39514, lng: 8.69944, summitM: 2104, verticalM: 750, duration: "4–6 t", grade: 2, aspect: "Ø", season: "apr–mai", hasGuide: true, teaser: "750 høydemeter og 6 km fra Valdresflye: flatt de første 1,2 km, så en kneik til 1530 moh og slak rygg østfra mot toppen." },
  { slug: "synshorn", name: "Synshorn", region: "Valdres", lat: 61.34011, lng: 8.79727, summitM: 1475, verticalM: 420, duration: "2–3 t", grade: 1, aspect: "Ø", season: "feb–mai", hasGuide: true, teaser: "Kort og trygg tur fra Valdresflye — perfekt førstetur og værvindu-tur." },
  { slug: "bitihorn", name: "Bitihorn", region: "Valdres", lat: 61.29435, lng: 8.79947, summitM: 1607, verticalM: 550, duration: "2–4 t", grade: 1, aspect: "S", season: "feb–mai", hasGuide: true, teaser: "Markert horn med enkel normalrute og fin utsikt over Bygdin." },
  { slug: "skogshorn", name: "Skogshorn", region: "Hemsedal", lat: 60.88148, lng: 8.69482, summitM: 1729, verticalM: 840, duration: "3–5 t", grade: 2, aspect: "Ø", season: "feb–mai", hasGuide: true, teaser: "836 høgdemeter frå Trefta opp den breie austryggen; brattaste måling er 28,5 grader." },
  { slug: "storehorn", name: "Storehorn", region: "Hemsedal", lat: 60.81506, lng: 8.59566, summitM: 1478, verticalM: 470, duration: "3–4 t", grade: 2, aspect: "Ø", season: "des–apr", hasGuide: true, teaser: "Hemsedals husfjell for topptur — kort vei fra bilen, mange linjevalg." },
  { slug: "lonahorgi", name: "Lønahorgi", region: "Voss", lat: 60.69383, lng: 6.41489, summitM: 1412, verticalM: 1300, duration: "6–8 t", grade: 2, aspect: "NØ", season: "feb–april", hasGuide: true, teaser: "1300 høgdemeter frå Høyland via Bergsstølen og Breiming, med dei siste 107 opp nordryggen frå punkt 1305." },
  { slug: "folarskardnuten", name: "Folarskardnuten", region: "Hallingdal", lat: 60.60742, lng: 7.78251, summitM: 1932, verticalM: 970, duration: "6–8 t", grade: 3, aspect: "S", season: "mars–mai", hasGuide: true, teaser: "Over 12 km inn frå Haugastøl og 970 høgdemeter, med eit kort 37-graders trinn opp frå Folarskardet." },
  { slug: "oksen", name: "Oksen", region: "Hardanger", lat: 60.45983, lng: 6.68301, summitM: 1241, verticalM: 960, duration: "4–6 t", grade: 2, aspect: "SV", season: "jan–apr", hasGuide: true, teaser: "Fjordutsikt i alle retninger og jevn stigning fra Tjoflot." },
  { slug: "vesoldo", name: "Vesoldo", region: "Hardanger", lat: 60.31237, lng: 6.09197, summitM: 1046, verticalM: 840, duration: "3–5 t", grade: 2, aspect: "SV", season: "feb–apr", hasGuide: true, teaser: "838 høgdemeter frå Byrkjenes, skog opp til Fadnastølen og open sørvestrygg over; nord- og vestsida av toppen fell 48–55°." },
  { slug: "melderskin", name: "Melderskin", region: "Hardanger", lat: 60.00623, lng: 6.08261, summitM: 1426, verticalM: 1270, duration: "6–8 t", grade: 3, aspect: "V", season: "feb–mai", hasGuide: true, teaser: "Rosendalsalpenes storslåtte klassiker, fra sjøen til 1426 moh." },
  { slug: "gaustatoppen", name: "Gaustatoppen", region: "Telemark", lat: 59.8542, lng: 8.64928, summitM: 1883, verticalM: 970, duration: "4–6 t", grade: 2, aspect: "NV", season: "des–mai", hasGuide: true, teaser: "Sør-Norges mest markante topp — ser du den, ser den deg." },
];

export const REGIONS: string[] = [...new Set(TOURS.map((t) => t.region))];

export function getTour(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}

/** Turene i én region, eventuelt uten den man allerede står på.
 *
 *  Brukes av «flere turer i …» nederst i hver guide. Regionen er den eneste
 *  slektskapen datasettet faktisk kjenner — «lignende tur» ville vært en
 *  påstand om terreng vi ikke måler. */
export function toursInRegion(region: string, exclude?: string): Tour[] {
  return TOURS.filter((t) => t.region === region && t.slug !== exclude);
}

/** Turene gruppert på region, i den rekkefølgen `TOURS` står i — som er nord
 *  til sør, fra Lyngen til Gaustatoppen. Rekkefølgen er redaksjonell og skal
 *  overleve grupperinga; derfor `REGIONS` og ikke en sortert nøkkelliste. */
export function toursByRegion(): { region: string; tours: Tour[] }[] {
  return REGIONS.map((region) => ({ region, tours: toursInRegion(region) }));
}

/** Ankeret en region får på `/turer`: «Sunnmøre» → `sunnmore`.
 *
 *  Fragmentet havner i adressefeltet og i delte lenker, så det holdes til
 *  ASCII framfor å bli prosentkodet til `#Sunnm%C3%B8re`. */
export function regionAnchor(region: string): string {
  return region
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Every documented way up a tour, the tour's own route first.
 *
 *  A peak can have more than one, and they are not variants of one line:
 *  Galdhøpiggen's two standard starts are 737 vertical metres apart. The first
 *  route is the one the tour's `verticalM` and `duration` describe. */
export function routesFor(t: Tour): readonly TourRoute[] {
  return ROUTES[t.slug] ?? [];
}

/** En rute uten geometrien: alt rutevelgeren i panelet viser. */
export type RouteMeta = Omit<TourRoute, "line">;

/** Rutene til hver tur, uten linjene.
 *
 *  Rutevelgeren på `/kart` viser navn, oppstigning, lengde og utgangspunkt — den
 *  har aldri hatt bruk for punktene. Å hente dem derfra kostet likevel hele
 *  `lib/routes` i nettleseren, fordi `routesFor` og geometrien bor i samme
 *  modul: rundt 240 kB terrengpunkter lastet ned og parset før lista til
 *  venstre kunne trykkes på.
 *
 *  Denne kjører på serveren og sendes inn som en prop, så det klienten får er
 *  det den viser. Linjene lastes fortsatt — de skal tegnes — men i Leaflet-bunten
 *  som uansett hentes for seg, og ikke foran alt annet. */
export function routeMeta(): Record<string, RouteMeta[]> {
  const out: Record<string, RouteMeta[]> = {};
  for (const tour of TOURS) {
    const routes = routesFor(tour);
    if (!routes.length) continue;
    out[tour.slug] = routes.map(({ id, name, trailhead, distanceM, gainM }) => ({
      id,
      name,
      trailhead,
      distanceM,
      gainM,
    }));
  }
  return out;
}

/** One route of a tour, by id. Falls back to the tour's own route when `id` is
 *  missing or unknown, so a stale `?rute=` in a shared link still draws. */
export function routeById(t: Tour, id?: string | null): TourRoute | null {
  const routes = routesFor(t);
  if (!routes.length) return null;
  return (id ? routes.find((r) => r.id === id) : undefined) ?? routes[0];
}

/** The detailed ascent line, trailhead first and summit last.
 *
 *  The geometry lives in `./routes` — a least-cost path solved over Kartverket's
 *  1 m terrain model through the corridor the route uses. Empty when a tour has
 *  no route yet, so callers should check before drawing. */
export function routeFor(t: Tour, id?: string | null): [number, number][] {
  const route = routeById(t, id);
  if (!route) return [];
  const out: [number, number][] = [];
  for (let i = 0; i < route.line.length; i += 3) {
    out.push([route.line[i], route.line[i + 1]]);
  }
  return out;
}

/** The same line with its terrain elevations, for the GPX track and the profile.
 *  `points[i]` and `elevations[i]` describe the same place. */
export function routeProfile(
  t: Tour,
  id?: string | null,
): {
  points: [number, number][];
  elevations: number[];
  distanceM: number;
  gainM: number;
  routeId: string;
  routeName: string;
  trailhead: string;
} | null {
  const route = routeById(t, id);
  if (!route) return null;
  const points: [number, number][] = [];
  const elevations: number[] = [];
  for (let i = 0; i < route.line.length; i += 3) {
    points.push([route.line[i], route.line[i + 1]]);
    elevations.push(route.line[i + 2]);
  }
  return {
    points,
    elevations,
    distanceM: route.distanceM,
    gainM: route.gainM,
    routeId: route.id,
    routeName: route.name,
    trailhead: route.trailhead,
  };
}
