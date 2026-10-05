/* Toppkart — service worker.
 *
 * Én jobb: når nettet svikter, svar med det leseren har lagret med «Lagre
 * offline». Den lagrer ingenting selv, cacher ingenting på eget initiativ og
 * står aldri mellom en leser med nett og den ferske sida — bortsett fra
 * når nettet er så tregt at en lagret side er bedre enn å vente (se
 * `NAV_TIMEOUT_MS`).
 *
 * Lagringen skjer fra sida, i `lib/offline/store.ts`. Navnene under må være
 * de samme som der; `lib/offline/sw.test.ts` sjekker det.
 *
 * Skrevet for hånd, uten byggsteg og uten bibliotek, fordi den er liten og fordi
 * en service worker som oppfører seg rart er vanskelig å bli kvitt hos leseren.
 * Det som ikke matcher en regel under, går rett til nettet som om den ikke
 * fantes.
 */

const OFFLINE_CACHE = "tk-offline-v1";
const SHELL_CACHE = "tk-shell-v1";
const OFFLINE_PAGE = "/offline.html";
const TILE_HOST = "cache.kartverket.no";

/** Så lenge venter en navigasjon på nettet før den tar den lagrede sida, når
 *  det finnes en. En strek dekning i et skar svarer ofte til slutt — etter et
 *  halvt minutt. */
const NAV_TIMEOUT_MS = 6000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.add(new Request(OFFLINE_PAGE, { cache: "reload" })))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("tk-") && k !== OFFLINE_CACHE && k !== SHELL_CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  /* Utlogging og sletting av kontoen tar de lagrede guidene med seg. De er
     abonnentens, og en delt telefon skal ikke sitte igjen med dem. Serveren
     sender også `Clear-Site-Data`; dette er for nettlesere som ikke tar den. */
  if (sameOrigin && request.method === "POST" && url.pathname === "/api/auth/signout") {
    event.waitUntil(caches.delete(OFFLINE_CACHE));
    return;
  }
  if (sameOrigin && request.method === "DELETE" && url.pathname === "/api/konto") {
    const response = fetch(request);
    event.respondWith(response);
    event.waitUntil(
      response.then((res) => (res.ok ? caches.delete(OFFLINE_CACHE) : undefined)).catch(() => {}),
    );
    return;
  }

  if (request.method !== "GET") return;

  if (sameOrigin) {
    if (request.mode === "navigate") {
      event.respondWith(navigate(request, url));
      return;
    }
    /* Innholdshashet og uforanderlig: ligger den lagret, er den riktig. */
    if (url.pathname.startsWith("/_next/static/")) {
      event.respondWith(cacheFirst(request, url.pathname));
      return;
    }
    if (url.pathname.startsWith("/api/gpx/")) {
      event.respondWith(networkFirst(request, url.pathname));
      return;
    }
    return;
  }

  /* Kartflisene. Lagrede fliser først — de er de samme bildene, og i fjellet
     er hver rundtur til Kartverket en sekund som ikke trengs. Leaflet ber om
     dem som `no-cors`, de er lagret fra en `cors`-henting; det er derfor
     oppslaget er på adressen og ikke på forespørselen. */
  if (url.hostname === TILE_HOST) {
    event.respondWith(cacheFirst(request, request.url));
  }
});

async function lookup(key) {
  const cache = await caches.open(OFFLINE_CACHE);
  return cache.match(key, { ignoreVary: true });
}

async function cacheFirst(request, key) {
  const hit = await lookup(key);
  return hit || fetch(request);
}

async function networkFirst(request, key) {
  try {
    return await fetch(request);
  } catch (err) {
    const hit = await lookup(key);
    if (hit) return hit;
    throw err;
  }
}

/** Den lagrede kopien av sida det navigeres til, om det finnes en.
 *
 *  Turguiden lagres under sin egen sti. Kartsida lagres både som `/kart` og som
 *  `/kart?tur=<slug>` for hver lagrede tur; andre parametre (`rute`, `lang`)
 *  spiller ingen rolle for hvilken kopi som passer. En tur som ikke er lagret,
 *  får lista. */
async function savedPage(url) {
  if (url.pathname === "/kart") {
    const tur = url.searchParams.get("tur");
    const hit = tur ? await lookup(`/kart?tur=${encodeURIComponent(tur)}`) : undefined;
    return hit || lookup("/kart");
  }
  return lookup(url.pathname);
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

async function navigate(request, url) {
  const saved = await savedPage(url);

  if (!saved) {
    try {
      return await fetch(request);
    } catch (err) {
      const shell = await caches.open(SHELL_CACHE);
      const fallback = await shell.match(OFFLINE_PAGE);
      if (fallback) return fallback;
      throw err;
    }
  }

  /* Vet nettleseren at det ikke er nett, er det ingen vits i å vente på det. */
  if (self.navigator && self.navigator.onLine === false) return saved;
  try {
    return await Promise.race([fetch(request), timeout(NAV_TIMEOUT_MS)]);
  } catch {
    return saved;
  }
}
