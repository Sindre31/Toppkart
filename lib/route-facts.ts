/** Nøkkeltallene for hver av rutene opp en topp, ikke bare den første.
 *
 *  En tur bærer høydemeter, normaltid og himmelretning for sin egen rute — den
 *  første i `ROUTES`. Har toppen flere veier opp, beskriver de tallene ikke de
 *  andre: Galdhøpiggens to vanlige starter ligger 737 høydemeter fra hverandre.
 *  Når leseren velger en annen rute i kartpanelet, skal tallene følge med.
 *
 *  For turens egen rute brukes turens redaksjonelle tall uendret. For de andre
 *  regnes de av linja, med de samme modellene byggeskriptet bruker
 *  (`scripts/build-routes/route_metrics.py`):
 *
 *  - **Høydemeter**: rutas oppsummerte stigning, rundet til 10 m — samme regel
 *    som turene følger.
 *  - **Normaltid**: feltmodellen (4,5 km/t langs bakken, 350 høydemeter i
 *    timen, 12 km/t ned, tre kvarter til skifte og pauser) i et totimersbånd.
 *    Gir modellen samme bånd for den andre ruta som for turens egen, står turens
 *    redaksjonelle tid; ellers modellens.
 *  - **Himmelretning**: hvilken vei nedkjøringen vender i øvre halvdel av
 *    linja. Byggeskriptet kaller dette en kontroll og ikke en kilde, fordi
 *    turens felt kan mene en annen flanke enn den ruta går i. Derfor regnes den
 *    *relativt*: forskjellen mellom de to rutenes målte retning legges til
 *    turens redaksjonelle. Er de målt like, står turens egen retning.
 *
 *  Kjøres på serveren; klienten får bare de ferdige tallene. */

import type { TourRoute } from "./routes";
import type { Tour } from "./types";

const COMPASS = ["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"] as const;
const EARTH_M = 6_371_000;
const toRad = Math.PI / 180;

export interface RouteFacts {
  verticalM: number;
  /** «5–7 t», i dataenes norske form; oversettes av den som viser det. */
  duration: string;
  /** En av de åtte kompassretningene, i dataenes norske form. */
  aspect: string;
}

function haversine(a: readonly number[], b: readonly number[]): number {
  const dLat = (b[0] - a[0]) * toRad;
  const dLng = (b[1] - a[1]) * toRad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toRad) * Math.cos(b[0] * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

function bearing(a: readonly number[], b: readonly number[]): number {
  const lat1 = a[0] * toRad;
  const lat2 = b[0] * toRad;
  const dLng = (b[1] - a[1]) * toRad;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) / toRad) % 360 + 360) % 360;
}

function points(route: TourRoute): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < route.line.length; i += 3) out.push([route.line[i], route.line[i + 1]]);
  return out;
}

/** Retningen nedkjøringen vender i øvre halvdel av linja, som indeks i
 *  `COMPASS`, eller null for en linje uten lengde. Hvert steg vektes med
 *  lengden sin, så en klynge korte steg rundt en vending ikke overstyrer det
 *  lange, rette strekket. */
export function descentSector(route: TourRoute): number | null {
  const pts = points(route);
  const upper = pts.slice(Math.floor(pts.length / 2));
  let x = 0;
  let y = 0;
  for (let i = 1; i < upper.length; i += 1) {
    const d = haversine(upper[i - 1], upper[i]);
    if (d < 1) continue;
    const angle = bearing(upper[i], upper[i - 1]) * toRad;
    x += Math.cos(angle) * d;
    y += Math.sin(angle) * d;
  }
  if (x === 0 && y === 0) return null;
  const deg = ((Math.atan2(y, x) / toRad) % 360 + 360) % 360;
  return Math.floor(((deg + 22.5) % 360) / 45);
}

/** Normaltid som totimersbånd, «4–6 t». */
export function durationBand(distanceM: number, gainM: number): string {
  const km = distanceM / 1000;
  const hours = km / 4.5 + gainM / 350 + km / 12 + 0.75;
  const rounded = Math.round(hours);
  const lo = Math.max(1, rounded - 1);
  if (hours < 3) return `${lo}–${Math.max(3, rounded + 1)} t`;
  return `${lo}–${lo + 2} t`;
}

/** Tallene for hver rute på turen, etter rute-id. */
export function routeFacts(tour: Tour, routes: readonly TourRoute[]): Record<string, RouteFacts> {
  const out: Record<string, RouteFacts> = {};
  const [main] = routes;
  if (!main) return out;

  const mainSector = descentSector(main);
  const tourSector = COMPASS.indexOf(tour.aspect as (typeof COMPASS)[number]);
  const mainBand = durationBand(main.distanceM, main.gainM);

  for (const route of routes) {
    if (route === main) {
      out[route.id] = { verticalM: tour.verticalM, duration: tour.duration, aspect: tour.aspect };
      continue;
    }
    const band = durationBand(route.distanceM, route.gainM);
    const sector = descentSector(route);
    const aspect =
      sector === null || mainSector === null || tourSector === -1
        ? tour.aspect
        : COMPASS[(((tourSector + sector - mainSector) % 8) + 8) % 8];
    out[route.id] = {
      verticalM: Math.round(route.gainM / 10) * 10,
      duration: band === mainBand ? tour.duration : band,
      aspect,
    };
  }
  return out;
}
