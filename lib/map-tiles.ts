/** Kartlagene, felles for hovedkartet (`app/kart/MapCanvas.tsx`) og kartet i
 *  turguidene (`components/guide/GuideMapCanvas.tsx`): Kartverket over,
 *  OpenStreetMap under. To steder som tegner det samme kartet skal ikke kunne
 *  drive fra hverandre. */

import { COVERAGE_MAX_ZOOM, COVERAGE_MIN_ZOOM, COVERED } from "./map-coverage";

/** Kartverkets topografiske norgeskart, servert fra deres egen flis-cache.
 *
 *  Her lå OpenStreetMap fram til nå, fordi prototypen brukte det. Forskjellen
 *  er ikke kosmetisk. Et toppturkart skal vise høydekurver, bre, myr og ur, og
 *  det er nettopp det Kartverkets topografiske serie tegner og OSMs standardstil
 *  ikke har — den er laget for veier og bebyggelse, ikke for terreng over
 *  tregrensa. Rutelinja vår er dessuten regnet ut i Kartverkets egen
 *  høydemodell, så kartet under streken og streken selv kommer nå fra samme
 *  kilde.
 *
 *  Adressen er WMTS-en i `webmercator`-rutenettet, som er det samme rutenettet
 *  Leaflet regner i, så flisene legger seg rett i rutenettet uten projeksjons-
 *  arbeid. Rekkefølgen i stien er `{z}/{y}/{x}` — TileMatrix, TileRow, TileCol —
 *  altså y foran x, motsatt av OSM. Bytt dem om, og kartet blir speilvendt om
 *  diagonalen uten å feile på en eneste forespørsel.
 *
 *  Dekningen er Norge og bare Norge: utenfor grensa er flisene helt
 *  gjennomsiktige. Der tegner `BASE_URL` under resten av verden, så nabolanda
 *  og havet ikke står tomme. Kartverket ligger øverst, så Norge ser ut akkurat
 *  som før.
 *
 *  Bruksvilkår: åpne data under Kartverkets lisens (CC BY 4.0), som krever at
 *  opphavet står synlig. Det gjør det i `attribution` på kartlagene. */
export const TILE_URL = "https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png";
/** Bakgrunnskartet for alt utenfor Norge: OpenStreetMaps standardkart. Det synes
 *  bare der Kartverkets fliser er gjennomsiktige, altså utenfor landet.
 *
 *  Valgt framfor OpenTopoMap, som ble for mettet i landsvisningen, og CARTO, som
 *  krever API-nøkkel. OSMs bruksvilkår krever synlig kreditering (står i
 *  `attribution`) og forbyr masseforhåndshenting — derfor lagrer verken
 *  offline-lagringa eller `prefetchTiles` disse flisene; de er bare Kartverkets.
 *
 *  Inne i Norge hentes de ikke i det hele tatt (`coveredByKartverket`): der er
 *  de skjult uansett, og fordi de ofte kom raskere enn Kartverkets, blinket et
 *  annet kart fram under hver flytur. */
export const BASE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const BASE_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
export const BASE_MAX_NATIVE_ZOOM = 19;
/** Så langt cachen er tegnet. Nivå 19 svarer 400, ikke en tom flis, så dette er
 *  en grense å holde seg innenfor og ikke en anbefaling. Leaflets egen standard
 *  er tilfeldigvis den samme; den står her fordi den er Kartverkets. */
export const MAX_ZOOM = 18;

export const TILE_ATTRIBUTION = "© Kartverket";

/** Om flisa `z/x/y` ligger helt inne i et område Kartverket dekker — der er
 *  OSM-flisa under bortkastet. Under nivået dekningen er målt på, svarer den
 *  nei: der er flisene så store at nesten alle når ut over grensa. */
export function coveredByKartverket(z: number, x: number, y: number): boolean {
  if (z < COVERAGE_MIN_ZOOM) return false;
  for (let level = COVERAGE_MIN_ZOOM; level <= Math.min(z, COVERAGE_MAX_ZOOM); level += 1) {
    const scale = 2 ** (z - level);
    if (COVERED.has(`${level}/${Math.floor(x / scale)}/${Math.floor(y / scale)}`)) return true;
  }
  return false;
}
