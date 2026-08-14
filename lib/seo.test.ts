import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import { guideSlugs } from "@/lib/guides";
import { CANONICAL_ORIGIN } from "@/lib/seo";
import { getTour } from "@/lib/tours";

/** Sitemap-et mot det som faktisk svarer.
 *
 *  Et sitemap er en påstand overfor Bing og Google: disse adressene finnes, og
 *  det er verdt å hente dem. Påstanden koster noe når den er feil — en URL vi
 *  har meldt inn og som svarer 404 er en død lenke vi selv har lagt inn i køen
 *  deres, og nok av dem er en av grunnene til at en katalog blir liggende som
 *  «Discovered but not crawled» i stedet for å bli krypt.
 *
 *  Fram til nå kunne den ikke bli feil på den måten: `/tur/hva-som-helst` svarte
 *  `200 OK` med «Turen finnes ikke», så *alt* i sitemap-et så levende ut. Nå
 *  svarer ukjente slugs 404 slik de skal (se `generateMetadata` i
 *  `app/tur/[slug]/page.tsx`), og da er avstanden mellom de to listene noe som
 *  kan gjøre skade. `TOURS` avgjør hva sitemap-et lover; `GUIDES` avgjør hva
 *  ruta kjenner igjen. De er det samme settet i dag, og denne testen er det som
 *  sier fra den dagen de ikke er det.
 */

const urls = sitemap().map((entry) => entry.url);
const tourPaths = urls
  .map((url) => url.replace(CANONICAL_ORIGIN, ""))
  .filter((path) => path.startsWith("/tur/"));

describe("the sitemap", () => {
  it("only promises tours that exist", () => {
    expect(tourPaths.length).toBeGreaterThan(0);
    for (const path of tourPaths) {
      expect(getTour(path.slice("/tur/".length)), path).toBeTruthy();
    }
  });

  /* `generateStaticParams` er lista `/tur/[slug]` bygges fra, og den leses ut av
     `GUIDES`, ikke `TOURS`. En tur uten guide ville stått i sitemap-et og vært
     ukjent for ruta — meldt inn til søkemotorene, og 404 når de kom. */
  it("promises nothing the tour route cannot render", () => {
    const known = new Set(guideSlugs());
    for (const path of tourPaths) {
      expect(known.has(path.slice("/tur/".length)), path).toBe(true);
    }
  });

  it("lists absolute URLs on the canonical origin", () => {
    for (const url of urls) {
      expect(url.startsWith(`${CANONICAL_ORIGIN}/`), url).toBe(true);
    }
  });

  /* Én adresse per side. Duplikater i et sitemap er ikke farlig i seg selv, men
     de er alltid symptomet på noe annet — to kilder som lister den samme turen,
     eller en slug som har fått en tvilling. */
  it("has no duplicate entries", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });
});
