/** Turer lagret for bruk uten dekning — lagringen, i nettleseren.
 *
 *  Alt ligger i én Cache Storage-cache, `OFFLINE_CACHE`, som service workeren
 *  (`public/sw.js`) leser fra når nettet svikter. Ingenting av dette går til
 *  serveren; det er leserens egen kopi på leserens egen telefon.
 *
 *  En tur er lagret når fire ting ligger der: turguiden som HTML, kartsida
 *  som HTML (både `/kart` og `/kart?tur=<slug>`), alle JS-, CSS- og fontfilene
 *  sidene trenger, og kartflisene langs rutene. Pluss GPX-fila. Sidene skrives til slutt, etter
 *  alt de viser til, så en lagring som ryker halvveis aldri etterlater en side
 *  som lastes uten koden sin.
 *
 *  Hvilke URL-er som hører til hvilken tur, står i en liten JSON-fil i den
 *  samme cachen (`META_PATH`). Den trengs for å kunne fjerne én tur uten å ta
 *  med filer en annen tur også bruker — to turguider deler nesten all koden. */

import { planOverviewTiles, planTourTiles, staticRefs, tileRefs } from "./plan";

/** Navnene `public/sw.js` også bruker. `lib/offline/sw.test.ts` holder dem like. */
export const OFFLINE_CACHE = "tk-offline-v1";
export const META_PATH = "/__offline/saved.json";

export interface SavedEntry {
  savedAt: string;
  /** Omtrentlig størrelse på det som ble hentet ned for denne oppføringen. */
  bytes: number;
  urls: string[];
}

export interface SavedTour extends SavedEntry {
  name: string;
  region: string;
}

export interface OfflineMeta {
  version: 1;
  tours: Record<string, SavedTour>;
  /** Kartsida og det den trenger, delt av alle turene. Skrives på nytt ved hver
   *  lagring, så den alltid passer med koden til den siste turen som ble lagret. */
  kart?: SavedEntry;
}

export interface SaveProgress {
  done: number;
  total: number;
}

/** Om denne nettleseren kan lagre og servere sider uten nett. */
export function offlineSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "caches" in window &&
    "serviceWorker" in navigator
  );
}

const EMPTY: OfflineMeta = { version: 1, tours: {} };

export async function readMeta(): Promise<OfflineMeta> {
  if (!offlineSupported()) return EMPTY;
  const cache = await caches.open(OFFLINE_CACHE);
  const res = await cache.match(META_PATH);
  if (!res) return EMPTY;
  try {
    const meta = (await res.json()) as OfflineMeta;
    return meta?.version === 1 ? meta : EMPTY;
  } catch {
    return EMPTY;
  }
}

async function writeMeta(cache: Cache, meta: OfflineMeta) {
  await cache.put(
    META_PATH,
    new Response(JSON.stringify(meta), { headers: { "content-type": "application/json" } }),
  );
}

/** Kjører `tasks` med høyst `limit` samtidig — nettleserens egen grense per
 *  vert er seks, og flere enn det står bare i kø. */
async function pool<T>(items: readonly T[], limit: number, run: (item: T) => Promise<void>) {
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const item = items[next];
      next += 1;
      await run(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

class SaveError extends Error {
  constructor(
    readonly reason: "locked" | "network" | "quota",
    message: string,
  ) {
    super(message);
  }
}

export { SaveError };

/** Henter en side som den innloggede leseren ser den. */
async function fetchPage(path: string): Promise<{ res: Response; html: string }> {
  const res = await fetch(path, { credentials: "same-origin", cache: "no-store" });
  if (!res.ok) throw new SaveError("network", `${path}: ${res.status}`);
  const html = await res.clone().text();
  return { res, html };
}

/** Lagrer én tur. Kaster `SaveError` hvis noe som må med, ikke kom med.
 *
 *  `lines` er rutelinjene opp som `[lat, lng]`-par — alle rutene, så det man
 *  bytter til i rutevelgeren også har kart under seg. */
export async function saveTour(
  tour: { slug: string; name: string; region: string; lines: [number, number][][] },
  onProgress?: (p: SaveProgress) => void,
): Promise<SavedTour> {
  const cache = await caches.open(OFFLINE_CACHE);
  /* Be om at nettleseren ikke rydder bort dette når lagringen blir trang.
     Svaret er nettleserens; Chrome sier ja til installerte og mye brukte
     sider, Safari og Firefox spør eller sier nei. Lagringen virker uansett. */
  void navigator.storage?.persist?.();

  const pagePath = `/tur/${tour.slug}`;
  const page = await fetchPage(pagePath);
  /* Sida svarer 200 også uten tilgang — da med den låste guiden. Det skal
     ikke lagres som om det var turen. `data-access` settes av sida selv. */
  if (!page.html.includes('data-access="open"')) {
    throw new SaveError("locked", "the guide came back locked");
  }
  const kart = await fetchPage("/kart");
  /* Kartet med turen åpen, rendret av serveren slik lenka fra guiden ber om
     det. `/kart` alene ville åpne på lista, og kartet kan ikke lese `?tur=`
     selv uten å rendre noe annet enn serveren gjorde. 200 kB per tur, mot
     megabytene med fliser. */
  const kartTourPath = `/kart?tur=${encodeURIComponent(tour.slug)}`;
  const kartTour = await fetchPage(kartTourPath);

  let bytes = 0;
  let kartBytes = 0;
  let done = 0;
  let total = 0;
  const tick = () => onProgress?.({ done, total });

  /* — 1. Koden: lenkene i begge sidene, og så det de lenker til, til det ikke
     dukker opp noe nytt. Filene under `/_next/static/` har innholdshash i
     navnet og endrer seg aldri, så det som alt ligger i cachen hentes derfra
     i stedet for fra nettet.

     Resultatet er en graf, ikke en liste: hvilke filer hver side trenger
     regnes ut hver for seg etterpå. Det er det `removeTour` står på — fjernes
     en tur, skal ingenting kartsida trenger gå med den. — */
  const tourRoots = [
    ...new Set([...staticRefs(page.html, pagePath), ...staticRefs(kartTour.html, kartTourPath)]),
  ];
  const kartRoots = staticRefs(kart.html, "/kart");
  const refs = new Map<string, string[]>();
  const sizes = new Map<string, number>();
  let frontier = [...new Set([...tourRoots, ...kartRoots])];
  total += frontier.length;
  tick();
  while (frontier.length) {
    const found: string[] = [];
    await pool(frontier, 6, async (url) => {
      refs.set(url, []);
      let res = await cache.match(url);
      if (!res) {
        const fresh = await fetch(url);
        if (!fresh.ok) throw new SaveError("network", `${url}: ${fresh.status}`);
        await cache.put(url, fresh.clone());
        res = fresh;
      }
      if (/\.(js|css)$/.test(url)) {
        const text = await res.text();
        sizes.set(url, text.length);
        const children = staticRefs(text, url);
        refs.set(url, children);
        found.push(...children);
      } else {
        sizes.set(url, (await res.arrayBuffer()).byteLength);
      }
      done += 1;
      tick();
    });
    frontier = [...new Set(found)].filter((u) => !refs.has(u));
    total += frontier.length;
  }
  const closure = (roots: readonly string[]) => {
    const seen = new Set<string>();
    const stack = [...roots];
    while (stack.length) {
      const url = stack.pop()!;
      if (seen.has(url)) continue;
      seen.add(url);
      stack.push(...(refs.get(url) ?? []));
    }
    return [...seen];
  };

  /* — 2. Kartflisene. Rutenes egne, figurens på turguiden, og landsoversikten
     kartet åpner på. En flis som ikke kommer, er et grått felt og ikke en
     ødelagt tur; mange som ikke kommer, er et nett som ikke virker. — */
  const tourTiles = [...new Set([...planTourTiles(tour.lines), ...tileRefs(page.html)])];
  const kartTiles = planOverviewTiles();
  const tiles = [...new Set([...tourTiles, ...kartTiles])];
  total += tiles.length + 1;
  tick();

  let failed = 0;
  await pool(tiles, 6, async (url) => {
    const have = await cache.match(url);
    if (have) {
      sizes.set(url, Number(have.headers.get("content-length")) || 0);
    } else {
      try {
        /* `cors`, ikke `no-cors`: Kartverket svarer med
           `access-control-allow-origin: *`, og et lesbart svar er et svar med
           kjent størrelse. Et opakt svar regnes av Chrome som flere megabyte
           hver mot lagringskvoten, uansett hva det faktisk veier. */
        const res = await fetch(url, { mode: "cors", credentials: "omit" });
        if (!res.ok) throw new Error(String(res.status));
        const buf = await res.clone().arrayBuffer();
        sizes.set(url, buf.byteLength);
        await cache.put(url, res);
      } catch (err) {
        if (err instanceof DOMException && err.name === "QuotaExceededError") {
          throw new SaveError("quota", "storage is full");
        }
        failed += 1;
      }
    }
    done += 1;
    tick();
  });
  if (failed > tiles.length * 0.1) {
    throw new SaveError("network", `${failed} of ${tiles.length} map tiles failed`);
  }

  /* — 3. GPX-fila, for den som vil åpne den i en annen app i felt. — */
  const gpxPath = `/api/gpx/${tour.slug}`;
  const gpx = await fetch(gpxPath, { credentials: "same-origin" });
  if (!gpx.ok) throw new SaveError("network", `${gpxPath}: ${gpx.status}`);
  sizes.set(gpxPath, (await gpx.clone().arrayBuffer()).byteLength);
  await cache.put(gpxPath, gpx);
  done += 1;
  tick();

  /* — 4. Sidene sist. — */
  await cache.put(pagePath, page.res);
  await cache.put(kartTourPath, kartTour.res);
  await cache.put("/kart", kart.res);
  sizes.set(pagePath, page.html.length);
  sizes.set(kartTourPath, kartTour.html.length);
  sizes.set("/kart", kart.html.length);

  const tourUrls = [
    pagePath,
    kartTourPath,
    gpxPath,
    ...tourTiles,
    ...closure(tourRoots),
  ];
  const kartUrls = [
    "/kart",
    ...kartTiles,
    ...closure(kartRoots),
  ];
  for (const url of tourUrls) bytes += sizes.get(url) ?? 0;
  for (const url of kartUrls) kartBytes += sizes.get(url) ?? 0;

  const now = new Date().toISOString();
  const saved: SavedTour = {
    name: tour.name,
    region: tour.region,
    savedAt: now,
    bytes,
    urls: tourUrls,
  };
  const meta = await readMeta();
  const previousKart = meta.kart;
  meta.tours[tour.slug] = saved;
  meta.kart = { savedAt: now, bytes: kartBytes, urls: kartUrls };
  await writeMeta(cache, meta);
  /* Den forrige kartsidas kode kan nå være foreldet — etter en ny versjon av
     nettstedet viser `/kart` til nye chunker. Det ingen lenger peker på, går. */
  if (previousKart) await prune(cache, meta, previousKart.urls);
  return saved;
}

/** Sletter de av `candidates` som ingen lagret oppføring lenger viser til. */
async function prune(cache: Cache, meta: OfflineMeta, candidates: readonly string[]) {
  const keep = new Set<string>([META_PATH, ...(meta.kart?.urls ?? [])]);
  for (const t of Object.values(meta.tours)) for (const u of t.urls) keep.add(u);
  await Promise.all(candidates.filter((u) => !keep.has(u)).map((u) => cache.delete(u)));
}

/** Fjerner én tur, og det bare den brukte. Er det den siste, går alt. */
export async function removeTour(slug: string): Promise<void> {
  const meta = await readMeta();
  const entry = meta.tours[slug];
  if (!entry) return;
  delete meta.tours[slug];
  if (!Object.keys(meta.tours).length) {
    await clearOffline();
    return;
  }
  const cache = await caches.open(OFFLINE_CACHE);
  await writeMeta(cache, meta);
  await prune(cache, meta, entry.urls);
}

/** Alt lagret, borte. Utlogging og sletting av kontoen gjør det samme fra
 *  service workeren; dette er for knappen. */
export async function clearOffline(): Promise<void> {
  if (!offlineSupported()) return;
  await caches.delete(OFFLINE_CACHE);
}

export function savedBytes(meta: OfflineMeta): number {
  let n = meta.kart?.bytes ?? 0;
  for (const t of Object.values(meta.tours)) n += t.bytes;
  return n;
}
