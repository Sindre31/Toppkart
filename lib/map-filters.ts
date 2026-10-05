/** Filtrene og avstandsregningen på `/kart`, som rene funksjoner.
 *
 *  De ligger her og ikke i `MapView` av samme grunn som `grantsAccess()` ligger
 *  i `lib/access`: hver av dem gir et troverdig feil svar i stedet for å feile.
 *  Et sektorfilter som glemmer at «NØ» også er østvendt, eller en avstand regnet
 *  i grader i stedet for kilometer, ser helt riktig ut på skjermen. */

import type { Lang } from "@/lib/i18n";

/** Hovedretningene filteret tilbyr. Kodene er engelske fordi de er nøkler, ikke
 *  tekst — etikettene kommer fra ordboka. */
export const ASPECT_SECTORS = ["N", "E", "S", "W"] as const;
export type AspectSector = (typeof ASPECT_SECTORS)[number];

/** Høydemeterspennene filteret tilbyr, i stigende rekkefølge. `max` er
 *  eksklusiv, så en tur på nøyaktig 1000 m havner i ett spenn og bare ett.
 *
 *  Grensene er satt etter fordelingen i datasettet (kvartilene ligger rundt
 *  740, 950 og 1130 m), slik at ingen av knappene er en tom hylle. */
export const VERTICAL_BANDS = [
  { id: "lt700", min: 0, max: 700 },
  { id: "700-1000", min: 700, max: 1000 },
  { id: "1000-1300", min: 1000, max: 1300 },
  { id: "gte1300", min: 1300, max: Infinity },
] as const;
export type VerticalBand = (typeof VERTICAL_BANDS)[number]["id"];

/** Om en tur med himmelretningen `aspect` vender mot `sector`.
 *
 *  `aspect` er det kortet viser, altså enten norsk (`N`, `NØ`, `V`, `SV` …) eller
 *  allerede oversatt til engelsk (`N`, `NE`, `W`, `SW` …) — kartet får turene
 *  ferdig oversatt fra serveren. Begge normaliseres til engelske bokstaver.
 *
 *  En mellomretning hører til begge sine naboer: en nordøstvendt tur er både
 *  nordvendt og østvendt. Det er slik en som leter etter «nordvendt for
 *  puddersnø» tenker, og å la `NØ` falle ut av «Nord» ville skjule tolv turer. */
export function matchesAspect(aspect: string, sector: AspectSector): boolean {
  const code = aspect.trim().toUpperCase().replace(/Ø/g, "E").replace(/V/g, "W");
  /* Bare gyldige koder: én eller to bokstaver fra kompasset. Noe annet — en tom
     streng, en skrivefeil — vender ingen vei, i stedet for å treffe tilfeldig. */
  if (!/^[NSEW]{1,2}$/.test(code)) return false;
  return code.includes(sector);
}

export function inVerticalBand(verticalM: number, band: VerticalBand): boolean {
  const b = VERTICAL_BANDS.find((x) => x.id === band);
  return !!b && verticalM >= b.min && verticalM < b.max;
}

export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_M = 6_371_008.8;

/** Storsirkelavstand i meter (haversine).
 *
 *  Luftlinje, ikke kjøreavstand — det kortet skal si er «hvilke topper ligger
 *  nærmest meg», og for det er luftlinje ærlig så lenge den kalles det. */
export function distanceM(a: LatLng, b: LatLng): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** `850` → `"850 m"`, `12_340` → `"12 km"`, `4_260` → `"4,3 km"` på norsk.
 *
 *  Én desimal under ti kilometer, der den skiller to nabotopper; hele
 *  kilometer over, der en desimal bare er støy fra en GPS med 30 m slingring. */
export function formatDistance(meters: number, lang: Lang): string {
  /* Terskelen sammenlignes med det avrundede tallet, så 997 m ikke skrives
     «1000 m» og 9,97 km ikke «10,0 km». */
  const tens = Math.round(meters / 10) * 10;
  if (tens < 1000) return `${tens} m`;
  const km = meters / 1000;
  const text =
    Math.round(km * 10) < 100
      ? km.toFixed(1)
      : Math.round(km).toLocaleString(lang === "no" ? "nb-NO" : "en-GB");
  return `${lang === "no" ? text.replace(".", ",") : text} km`;
}
