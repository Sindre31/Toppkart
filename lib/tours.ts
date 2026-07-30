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
  { slug: "tromsdalstinden", name: "Tromsdalstinden", region: "Troms", lat: 69.6071, lng: 19.14585, summitM: 1238, verticalM: 1200, duration: "5–7 t", grade: 2, aspect: "V", season: "des–mai", teaser: "Tromsøs signaturtopp: lang, jevn oppstigning fra Tromsdalen med storslått utsikt mot Lyngen." },
  { slug: "store-blamann", name: "Store Blåmann", region: "Troms", lat: 69.73502, lng: 18.59147, summitM: 1044, verticalM: 1040, duration: "4–6 t", grade: 3, aspect: "S", season: "feb–mai", teaser: "Kvaløyas brattest profilerte klassiker — krever stabile forhold og god planlegging." },
  { slug: "storgalten", name: "Storgalten", region: "Lyngen", lat: 69.88543, lng: 20.25257, summitM: 1219, verticalM: 1219, duration: "5–7 t", grade: 3, aspect: "NV", season: "feb–mai", teaser: "Fjord-til-topp i ytre Lyngen: 1219 høydemeter rett opp fra havnivå." },
  { slug: "rornestinden", name: "Rørnestinden", region: "Lyngen", lat: 69.57329, lng: 20.11187, summitM: 1041, verticalM: 1000, duration: "4–6 t", grade: 2, aspect: "V", season: "jan–mai", teaser: "Den vennligste inngangen til Lyngsalpene, med slak rygg og romslig nedkjøring." },
  { slug: "kavringtinden", name: "Kavringtinden", region: "Lyngen", lat: 69.54704, lng: 20.12428, summitM: 1289, verticalM: 1240, duration: "5–7 t", grade: 3, aspect: "N", season: "mar–mai", teaser: "Indre Lyngen-perle med nordvendt snø som holder seg langt ut i mai." },
  { slug: "hesten-segla", name: "Hesten (Segla)", region: "Senja", lat: 69.51388, lng: 17.58462, summitM: 556, verticalM: 510, duration: "2–4 t", grade: 2, aspect: "S", season: "jan–apr", teaser: "Kort tur, stort postkort: nedkjøring med Segla i fanget og havet under." },
  { slug: "rombakstotta", name: "Rombakstøtta", region: "Narvik", lat: 68.43312, lng: 17.58324, summitM: 1243, verticalM: 1100, duration: "5–7 t", grade: 3, aspect: "SV", season: "feb–mai", teaser: "Narviks spisse landemerke — variert oppstigning og fin, vedvarende nedkjøring." },
  { slug: "himmeltindan", name: "Himmeltindan", region: "Lofoten", lat: 68.22041, lng: 13.57328, summitM: 962, verticalM: 960, duration: "4–6 t", grade: 3, aspect: "Ø", season: "feb–apr", teaser: "Vestvågøys høyeste, med alpint preg og linjer rett mot Nordishavet." },
  { slug: "stornappstinden", name: "Stornappstinden", region: "Lofoten", lat: 68.1441, lng: 13.41493, summitM: 740, verticalM: 680, duration: "3–5 t", grade: 2, aspect: "N", season: "jan–apr", teaser: "Lofot-klassiker i overkommelig format — mye fjell for høydemeterne." },
  { slug: "kirketaket", name: "Kirketaket", region: "Romsdal", lat: 62.61158, lng: 7.90672, summitM: 1439, verticalM: 1270, duration: "5–6 t", grade: 2, aspect: "SV", season: "des–mai", hasGuide: true, teaser: "Norges kanskje mest populære topptur: bred rygg, trygge linjevalg, lang sesong." },
  { slug: "slogen", name: "Slogen", region: "Sunnmøre", lat: 62.20818, lng: 6.67306, summitM: 1564, verticalM: 1480, duration: "6–8 t", grade: 4, aspect: "V", season: "mar–mai", teaser: "Sunnmørsalpenes dronning — en alvorlig tur for erfarne, i riktig vindu." },
  { slug: "kolastinden", name: "Kolåstinden", region: "Sunnmøre", lat: 62.25886, lng: 6.31102, summitM: 1432, verticalM: 1080, duration: "5–7 t", grade: 3, aspect: "N", season: "feb–mai", teaser: "Alpin klassiker fra Standaldalen med velkjent renne og storslått finish." },
  { slug: "skala", name: "Skåla", region: "Nordfjord", lat: 61.86923, lng: 6.97251, summitM: 1848, verticalM: 1840, duration: "6–8 t", grade: 3, aspect: "SV", season: "mar–jun", teaser: "1848 sammenhengende høydemeter fra fjorden i Loen — en av landets lengste nedkjøringer." },
  { slug: "fanaraken", name: "Fanaråken", region: "Sogn", lat: 61.51669, lng: 7.90825, summitM: 2068, verticalM: 760, duration: "5–7 t", grade: 2, aspect: "N", season: "apr–jun", teaser: "Høyfjellstur fra Sognefjellet med breutsikt og pålitelig vårsnø." },
  { slug: "steindalsnosi", name: "Steindalsnosi", region: "Sogn", lat: 61.52696, lng: 7.90076, summitM: 2025, verticalM: 760, duration: "3–5 t", grade: 1, aspect: "S", season: "apr–jun", teaser: "2000-meter for de fleste: kort, slak og solvendt fra Sognefjellsveien." },
  { slug: "galdhopiggen", name: "Galdhøpiggen", region: "Jotunheimen", lat: 61.63644, lng: 8.31243, summitM: 2469, verticalM: 630, duration: "6–8 t", grade: 3, aspect: "N", season: "apr–jun", teaser: "Norges tak på ski — bre, tau og stor høyde; vanligvis gått fra Juvasshytta." },
  { slug: "synshorn", name: "Synshorn", region: "Valdres", lat: 61.34011, lng: 8.79727, summitM: 1475, verticalM: 400, duration: "2–3 t", grade: 1, aspect: "Ø", season: "feb–mai", teaser: "Kort og trygg tur fra Valdresflye — perfekt førstetur og værvindu-tur." },
  { slug: "bitihorn", name: "Bitihorn", region: "Valdres", lat: 61.29435, lng: 8.79947, summitM: 1607, verticalM: 550, duration: "2–4 t", grade: 1, aspect: "S", season: "feb–mai", teaser: "Markert horn med enkel normalrute og fin utsikt over Bygdin." },
  { slug: "rondslottet", name: "Rondslottet", region: "Rondane", lat: 61.9149, lng: 9.8512, summitM: 2178, verticalM: 1240, duration: "6–8 t", grade: 2, aspect: "S", season: "mar–mai", teaser: "Rondanes høyeste: rolig høyfjellsterreng og stabil vårsesong." },
  { slug: "snohetta", name: "Snøhetta", region: "Dovrefjell", lat: 62.31992, lng: 9.26747, summitM: 2286, verticalM: 800, duration: "5–7 t", grade: 2, aspect: "Ø", season: "apr–jun", teaser: "Storslått og luftig, men overraskende snill — når Snøheimvegen åpner." },
  { slug: "storehorn", name: "Storehorn", region: "Hemsedal", lat: 60.81506, lng: 8.59566, summitM: 1478, verticalM: 470, duration: "3–4 t", grade: 2, aspect: "Ø", season: "des–apr", teaser: "Hemsedals husfjell for topptur — kort vei fra bilen, mange linjevalg." },
  { slug: "oksen", name: "Oksen", region: "Hardanger", lat: 60.45983, lng: 6.68301, summitM: 1241, verticalM: 960, duration: "4–6 t", grade: 2, aspect: "SV", season: "jan–apr", teaser: "Fjordutsikt i alle retninger og jevn stigning fra Tjoflot." },
  { slug: "melderskin", name: "Melderskin", region: "Hardanger", lat: 60.00623, lng: 6.08261, summitM: 1426, verticalM: 1270, duration: "6–8 t", grade: 3, aspect: "V", season: "feb–mai", teaser: "Rosendalsalpenes storslåtte klassiker, fra sjøen til 1426 moh." },
  { slug: "gaustatoppen", name: "Gaustatoppen", region: "Telemark", lat: 59.8542, lng: 8.64928, summitM: 1883, verticalM: 950, duration: "4–6 t", grade: 2, aspect: "NV", season: "des–mai", teaser: "Sør-Norges mest markante topp — ser du den, ser den deg." },
];

export const REGIONS: string[] = [...new Set(TOURS.map((t) => t.region))];

export function getTour(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}

/** Every documented way up a tour, the tour's own route first.
 *
 *  A peak can have more than one, and they are not variants of one line:
 *  Galdhøpiggen's two standard starts are 737 vertical metres apart. The first
 *  route is the one the tour's `verticalM` and `duration` describe. */
export function routesFor(t: Tour): readonly TourRoute[] {
  return ROUTES[t.slug] ?? [];
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
