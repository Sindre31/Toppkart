import type { Tour } from "./types";

/** The 24 tours from the prototype (`design-reference/kart.html` → TOURS).
 *
 *  NB: coordinates are approximate and the teasers are editorial drafts — the
 *  handoff flags both for replacement with quality-assured data and real GPX
 *  geometry before launch. In production these rows live in Supabase; this
 *  module is the seed and the local fallback.
 */
export const TOURS: Tour[] = [
  { slug: "tromsdalstinden", name: "Tromsdalstinden", region: "Troms", lat: 69.618, lng: 19.078, summitM: 1238, verticalM: 1200, duration: "5–7 t", grade: 2, aspect: "V", season: "des–mai", teaser: "Tromsøs signaturtopp: lang, jevn oppstigning fra Tromsdalen med storslått utsikt mot Lyngen." },
  { slug: "store-blamann", name: "Store Blåmann", region: "Troms", lat: 69.663, lng: 18.510, summitM: 1044, verticalM: 1040, duration: "4–6 t", grade: 3, aspect: "S", season: "feb–mai", teaser: "Kvaløyas brattest profilerte klassiker — krever stabile forhold og god planlegging." },
  { slug: "storgalten", name: "Storgalten", region: "Lyngen", lat: 69.795, lng: 20.285, summitM: 1219, verticalM: 1219, duration: "5–7 t", grade: 3, aspect: "NV", season: "feb–mai", teaser: "Fjord-til-topp i ytre Lyngen: 1219 høydemeter rett opp fra havnivå." },
  { slug: "rornestinden", name: "Rørnestinden", region: "Lyngen", lat: 69.712, lng: 20.049, summitM: 1041, verticalM: 1041, duration: "4–6 t", grade: 2, aspect: "V", season: "jan–mai", teaser: "Den vennligste inngangen til Lyngsalpene, med slak rygg og romslig nedkjøring." },
  { slug: "kavringtinden", name: "Kavringtinden", region: "Lyngen", lat: 69.556, lng: 20.166, summitM: 1289, verticalM: 1150, duration: "5–7 t", grade: 3, aspect: "N", season: "mar–mai", teaser: "Indre Lyngen-perle med nordvendt snø som holder seg langt ut i mai." },
  { slug: "hesten-segla", name: "Hesten (Segla)", region: "Senja", lat: 69.503, lng: 17.652, summitM: 626, verticalM: 620, duration: "2–4 t", grade: 2, aspect: "S", season: "jan–apr", teaser: "Kort tur, stort postkort: nedkjøring med Segla i fanget og havet under." },
  { slug: "rombakstotta", name: "Rombakstøtta", region: "Narvik", lat: 68.428, lng: 17.703, summitM: 1243, verticalM: 1100, duration: "5–7 t", grade: 3, aspect: "SV", season: "feb–mai", teaser: "Narviks spisse landemerke — variert oppstigning og fin, vedvarende nedkjøring." },
  { slug: "himmeltindan", name: "Himmeltindan", region: "Lofoten", lat: 68.115, lng: 13.435, summitM: 962, verticalM: 960, duration: "4–6 t", grade: 3, aspect: "Ø", season: "feb–apr", teaser: "Vestvågøys høyeste, med alpint preg og linjer rett mot Nordishavet." },
  { slug: "stornappstinden", name: "Stornappstinden", region: "Lofoten", lat: 68.080, lng: 13.630, summitM: 740, verticalM: 730, duration: "3–5 t", grade: 2, aspect: "N", season: "jan–apr", teaser: "Lofot-klassiker i overkommelig format — mye fjell for høydemeterne." },
  { slug: "kirketaket", name: "Kirketaket", region: "Romsdal", lat: 62.583, lng: 7.831, summitM: 1439, verticalM: 1380, duration: "5–6 t", grade: 2, aspect: "SV", season: "des–mai", hasGuide: true, teaser: "Norges kanskje mest populære topptur: bred rygg, trygge linjevalg, lang sesong." },
  { slug: "slogen", name: "Slogen", region: "Sunnmøre", lat: 62.085, lng: 6.898, summitM: 1564, verticalM: 1560, duration: "6–8 t", grade: 4, aspect: "V", season: "mar–mai", teaser: "Sunnmørsalpenes dronning — en alvorlig tur for erfarne, i riktig vindu." },
  { slug: "kolastinden", name: "Kolåstinden", region: "Sunnmøre", lat: 62.255, lng: 6.432, summitM: 1432, verticalM: 1150, duration: "5–7 t", grade: 3, aspect: "N", season: "feb–mai", teaser: "Alpin klassiker fra Standaldalen med velkjent renne og storslått finish." },
  { slug: "skala", name: "Skåla", region: "Nordfjord", lat: 61.862, lng: 6.937, summitM: 1848, verticalM: 1840, duration: "6–8 t", grade: 3, aspect: "SV", season: "mar–jun", teaser: "1848 sammenhengende høydemeter fra fjorden i Loen — en av landets lengste nedkjøringer." },
  { slug: "fanaraken", name: "Fanaråken", region: "Sogn", lat: 61.517, lng: 7.899, summitM: 2068, verticalM: 950, duration: "5–7 t", grade: 2, aspect: "N", season: "apr–jun", teaser: "Høyfjellstur fra Sognefjellet med breutsikt og pålitelig vårsnø." },
  { slug: "steindalsnosi", name: "Steindalsnosi", region: "Sogn", lat: 61.453, lng: 7.938, summitM: 2025, verticalM: 620, duration: "3–5 t", grade: 1, aspect: "S", season: "apr–jun", teaser: "2000-meter for de fleste: kort, slak og solvendt fra Sognefjellsveien." },
  { slug: "galdhopiggen", name: "Galdhøpiggen", region: "Jotunheimen", lat: 61.636, lng: 8.313, summitM: 2469, verticalM: 1100, duration: "6–8 t", grade: 3, aspect: "N", season: "apr–jun", teaser: "Norges tak på ski — bre, tau og stor høyde; vanligvis gått fra Juvasshytta." },
  { slug: "synshorn", name: "Synshorn", region: "Valdres", lat: 61.437, lng: 8.928, summitM: 1475, verticalM: 400, duration: "2–3 t", grade: 1, aspect: "Ø", season: "feb–mai", teaser: "Kort og trygg tur fra Valdresflye — perfekt førstetur og værvindu-tur." },
  { slug: "bitihorn", name: "Bitihorn", region: "Valdres", lat: 61.303, lng: 8.792, summitM: 1607, verticalM: 500, duration: "2–4 t", grade: 1, aspect: "S", season: "feb–mai", teaser: "Markert horn med enkel normalrute og fin utsikt over Bygdin." },
  { slug: "rondslottet", name: "Rondslottet", region: "Rondane", lat: 61.911, lng: 9.841, summitM: 2178, verticalM: 1050, duration: "6–8 t", grade: 2, aspect: "S", season: "mar–mai", teaser: "Rondanes høyeste: rolig høyfjellsterreng og stabil vårsesong." },
  { slug: "snohetta", name: "Snøhetta", region: "Dovrefjell", lat: 62.320, lng: 9.266, summitM: 2286, verticalM: 800, duration: "5–7 t", grade: 2, aspect: "Ø", season: "apr–jun", teaser: "Storslått og luftig, men overraskende snill — når Snøheimvegen åpner." },
  { slug: "storehorn", name: "Storehorn", region: "Hemsedal", lat: 60.832, lng: 8.325, summitM: 1478, verticalM: 630, duration: "3–4 t", grade: 2, aspect: "Ø", season: "des–apr", teaser: "Hemsedals husfjell for topptur — kort vei fra bilen, mange linjevalg." },
  { slug: "oksen", name: "Oksen", region: "Hardanger", lat: 60.452, lng: 6.749, summitM: 1241, verticalM: 1240, duration: "4–6 t", grade: 2, aspect: "SV", season: "jan–apr", teaser: "Fjordutsikt i alle retninger og jevn stigning fra Tjoflot." },
  { slug: "melderskin", name: "Melderskin", region: "Hardanger", lat: 60.017, lng: 6.130, summitM: 1426, verticalM: 1420, duration: "6–8 t", grade: 3, aspect: "V", season: "feb–mai", teaser: "Rosendalsalpenes storslåtte klassiker, fra sjøen til 1426 moh." },
  { slug: "gaustatoppen", name: "Gaustatoppen", region: "Telemark", lat: 59.852, lng: 8.648, summitM: 1883, verticalM: 950, duration: "4–6 t", grade: 2, aspect: "NV", season: "des–mai", teaser: "Sør-Norges mest markante topp — ser du den, ser den deg." },
];

export const REGIONS: string[] = [...new Set(TOURS.map((t) => t.region))];

export function getTour(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}

/** Schematic route line for the prototype: the trailhead is placed in the
 *  tour's aspect direction, distance scaled by vertical gain, with a little
 *  weave on the way up. Production replaces this with real GPX geometry. */
const DIR: Record<string, [number, number]> = {
  N: [1, 0], S: [-1, 0], "Ø": [0, 1], V: [0, -1],
  NV: [0.7, -0.7], "NØ": [0.7, 0.7], SV: [-0.7, -0.7], "SØ": [-0.7, 0.7],
};

export function routeFor(t: Tour): [number, number][] {
  const [dy, dx] = DIR[t.aspect] ?? [1, 0];
  const dist = 0.012 + (t.verticalM / 1000) * 0.028;
  const lngScale = 1 / Math.cos((t.lat * Math.PI) / 180);
  const start: [number, number] = [t.lat + dy * dist, t.lng + dx * dist * lngScale];
  const px = -dx;
  const py = dy;
  const pt = (f: number, s: number): [number, number] => [
    t.lat + dy * dist * f + py * s * dist,
    t.lng + (dx * dist * f + px * s * dist) * lngScale,
  ];
  return [start, pt(0.72, 0.18), pt(0.45, -0.14), pt(0.2, 0.1), [t.lat, t.lng]];
}
