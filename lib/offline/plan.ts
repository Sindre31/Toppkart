/** Hva som må ligge på telefonen for at en tur skal virke uten dekning.
 *
 *  Rene funksjoner, og testet, av samme grunn som resten av `lib/`: hver av dem
 *  gir et troverdig feil svar heller enn å feile. En flisberegning med x og y
 *  byttet om lagrer like mange bilder, bare av feil fjell. En lenkesøker som
 *  overser én måte å referere til en chunk på, lagrer en side som virker på
 *  nett og står og laster i fjellet. Begge deler oppdages først der det ikke
 *  finnes dekning til å rette det. */

/** Kartverkets topografiske kart — det `/kart` tegner. Samme adresse og samme
 *  `{z}/{y}/{x}`-rekkefølge som `TILE_URL` i `app/kart/MapCanvas.tsx`; en
 *  lagret flis med en annen adresse er en flis Leaflet aldri ber om. */
export function topoTileUrl(z: number, x: number, y: number): string {
  return `https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/${z}/${y}/${x}.png`;
}

/** Flisa et punkt ligger i, i `webmercator`-rutenettet. */
export function tileAt(lat: number, lng: number, z: number): { x: number; y: number } {
  const n = 2 ** z;
  const s = Math.sin((lat * Math.PI) / 180);
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor((0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n);
  return { x: Math.min(n - 1, Math.max(0, x)), y: Math.min(n - 1, Math.max(0, y)) };
}

export interface Bounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export function boundsOf(points: readonly (readonly [number, number])[]): Bounds {
  let south = Infinity;
  let west = Infinity;
  let north = -Infinity;
  let east = -Infinity;
  for (const [lat, lng] of points) {
    south = Math.min(south, lat);
    north = Math.max(north, lat);
    west = Math.min(west, lng);
    east = Math.max(east, lng);
  }
  return { south, west, north, east };
}

/** Utvider et rektangel med en andel av sin egen størrelse, og minst `minDeg`
 *  — en rute som går rett nord har ingen bredde å ta en andel av. */
export function padBounds(b: Bounds, ratio: number, minDeg = 0.01): Bounds {
  const dLat = Math.max((b.north - b.south) * ratio, minDeg);
  const dLng = Math.max((b.east - b.west) * ratio, minDeg * 2);
  return { south: b.south - dLat, north: b.north + dLat, west: b.west - dLng, east: b.east + dLng };
}

/** Alle fliser som dekker et rektangel på ett zoomnivå, som `"z/x/y"`. */
export function tilesInBounds(b: Bounds, z: number): string[] {
  const nw = tileAt(b.north, b.west, z);
  const se = tileAt(b.south, b.east, z);
  const out: string[] = [];
  for (let x = nw.x; x <= se.x; x += 1) {
    for (let y = nw.y; y <= se.y; y += 1) out.push(`${z}/${x}/${y}`);
  }
  return out;
}

/** Flisene langs en linje på ett zoomnivå, med `radius` fliser til hver side.
 *
 *  Brukes på de detaljerte nivåene, der rektangelet rundt en lang rute stort
 *  sett er dal man ikke skal til: ruta til Rondslottet dekker 1833 fliser på
 *  nivå 15 som rektangel, og en brøkdel av det som korridor. Punktene ligger
 *  tettere enn en flis, så korridoren har ingen hull. */
export function tilesAlong(
  points: readonly (readonly [number, number])[],
  z: number,
  radius = 1,
): string[] {
  const n = 2 ** z;
  const seen = new Set<string>();
  for (const [lat, lng] of points) {
    const { x, y } = tileAt(lat, lng, z);
    for (let dx = -radius; dx <= radius; dx += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        const tx = x + dx;
        const ty = y + dy;
        if (tx < 0 || ty < 0 || tx >= n || ty >= n) continue;
        seen.add(`${z}/${tx}/${ty}`);
      }
    }
  }
  return [...seen];
}

/** Nivåene en tur lagres med.
 *
 *  Oversikten (10–13) som rektangel rundt alle rutene opp, så man ser dalen og
 *  nabofjellene. Detaljen (14–15) som korridor langs linjene, der man faktisk
 *  går. Nivå 15 er omtrent 1:15 000 — godt nok til å se hvilken side av en
 *  bekk man står på. Nivå 16 ville firedoble antallet for de samme meterne. */
export const OVERVIEW_ZOOMS = [10, 11, 12, 13] as const;
export const DETAIL_ZOOMS = [14, 15] as const;

/** Taket per tur. Med 30–80 kB per flis er det 15–30 MB, og det er grensen for
 *  hva det er rimelig å be om på mobilnett — og å hente fra Kartverket — for
 *  én tur. Går en tur over, faller nivå 15 bort først; resten er fortsatt et
 *  brukbart kart. */
export const TILE_BUDGET = 400;

/** Flisene for én tur: alle rutene opp, oversikt og detalj, innenfor taket. */
export function planTourTiles(
  routes: readonly (readonly (readonly [number, number])[])[],
  budget = TILE_BUDGET,
): string[] {
  const all = routes.flat();
  if (!all.length) return [];
  const area = padBounds(boundsOf(all), 0.2);

  const overview = OVERVIEW_ZOOMS.flatMap((z) => tilesInBounds(area, z));
  const detail = DETAIL_ZOOMS.map((z) => [
    ...new Set(routes.flatMap((line) => tilesAlong(line, z))),
  ]);

  const out = [...overview];
  for (const level of detail) {
    if (out.length + level.length > budget) break;
    out.push(...level);
  }
  return out.map((key) => {
    const [z, x, y] = key.split("/").map(Number);
    return topoTileUrl(z, x, y);
  });
}

/** Landsoversikten `/kart` åpner på, slik at kartet ikke står grått før man har
 *  zoomet inn til en lagret tur. Nivå 4–6 over fastlandet er et par dusin
 *  fliser. */
export const NORWAY: Bounds = { south: 57.8, west: 4.4, north: 71.3, east: 31.2 };
export const NORWAY_ZOOMS = [4, 5, 6] as const;

export function planOverviewTiles(): string[] {
  return NORWAY_ZOOMS.flatMap((z) => tilesInBounds(NORWAY, z)).map((key) => {
    const [z, x, y] = key.split("/").map(Number);
    return topoTileUrl(z, x, y);
  });
}

/* — statiske filer — */

/** Filene en side eller en chunk viser til under `/_next/static/`.
 *
 *  Tre skrivemåter, og alle tre finnes i en bygd side:
 *
 *  - HTML: `"/_next/static/chunks/abc.js"` i `<script>` og `<link>`.
 *  - JS: `"static/chunks/abc.js"` uten `/_next/` foran. Det er slik
 *    Turbopack peker på chunkene en `import()` eller `next/dynamic` laster —
 *    kartets Leaflet-del og rutelinjene står ikke i HTML-en i det hele tatt,
 *    bare i en chunk HTML-en laster.
 *  - CSS: `url(../media/font.woff2)`, relativt til CSS-fila.
 *
 *  `from` er adressen teksten ble hentet fra, så relative stier kan løses. */
export function staticRefs(text: string, from: string): string[] {
  const base = new URL(from, "https://x.invalid");
  const out = new Set<string>();

  for (const m of text.matchAll(/\/_next\/static\/[^"'\s)\\<>]+/g)) out.add(m[0]);

  for (const m of text.matchAll(/(?<![\w/])static\/(?:chunks|media)\/[\w.~-]+\.\w+/g)) {
    out.add(`/_next/${m[0]}`);
  }

  for (const m of text.matchAll(/url\(\s*["']?([^"')]+?)["']?\s*\)/g)) {
    const ref = m[1];
    if (ref.startsWith("data:") || ref.startsWith("#")) continue;
    const resolved = new URL(ref, base);
    if (resolved.origin === base.origin && resolved.pathname.startsWith("/_next/static/")) {
      out.add(resolved.pathname);
    }
  }

  return [...out].filter((p) => !p.endsWith("/"));
}

/** Kartfliser en side viser som vanlige `<img>` — figuren på turguiden. */
export function tileRefs(html: string): string[] {
  return [
    ...new Set(
      [...html.matchAll(/https:\/\/cache\.kartverket\.no\/[^"'\s)<>]+\.png/g)].map((m) =>
        m[0].replace(/&amp;/g, "&"),
      ),
    ),
  ];
}
