/** Om en adresse under `/tur/` peker på en tur som ikke finnes.
 *
 *  Brukes av middleware, som avgjør det før sida rendres. Det er det eneste
 *  stedet avgjørelsen kan få statuskoden riktig: `/tur/[slug]` ligger under
 *  rot-`loading.tsx`, så svaret strømmes, og `200` er sendt før sida — eller
 *  `generateMetadata` — har slått opp slug-en. Se `docs/seo.md`.
 *
 *  Ingen importer: middleware kjører på Edge, og `lib/tours` drar med seg all
 *  rutegeometrien. Lista over turer kommer inn som et sett, bygd fra
 *  `TOUR_SLUGS`, som `next.config.ts` fyller fra `TOURS` ved bygging. */

/** Navnet på miljøvariabelen `next.config.ts` legger slug-lista i. */
export const TOUR_SLUGS_ENV = "TOUR_SLUGS";

export function parseTourSlugs(value: string | undefined): ReadonlySet<string> {
  return new Set((value ?? "").split(",").filter(Boolean));
}

export function isUnknownTour(pathname: string, known: ReadonlySet<string>): boolean {
  /* Uten liste vet vi ingenting, og da er det verre å svare 404 på alle 185
     turene enn å svare 200 på én skrivefeil. */
  if (!known.size) return false;
  const m = /^\/tur\/([^/]+)\/?$/.exec(pathname);
  if (!m) return false;
  let slug: string;
  try {
    slug = decodeURIComponent(m[1]);
  } catch {
    return true;
  }
  return !known.has(slug);
}
