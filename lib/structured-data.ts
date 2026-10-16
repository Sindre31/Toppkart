/** Schema.org-objektene sidene sender med til søkemotorene.
 *
 *  Hvorfor dette finnes. `/tur/*` er 86 sider som deler den samme malen, og for
 *  en utlogget robot er den unike teksten på hver av dem kort: navnet,
 *  innledningen og fem tall. Google fant dem alle gjennom sitemap-et og lot
 *  flertallet ligge som «Oppdaget – ikke indeksert for øyeblikket», altså:
 *  vi vet at de finnes, vi bruker ikke krypebudsjett på dem. Den vurderingen
 *  gjøres på hva siden ser ut til å handle om, og en mal med lite tekst i seg
 *  ser ut som lite. Strukturerte data snur ikke den vurderingen alene, men de
 *  fjerner gjettingen: at dette er en artikkel om et navngitt fjell på gitte
 *  koordinater i en gitt region, sagt eksplisitt framfor utledet av prosaen.
 *
 *  Alt her er opplysninger sida allerede viser. Det er hele regelen — Google
 *  behandler strukturerte data som beskriver noe annet enn det leseren ser som
 *  spam, og de er verdiløse i det øyeblikket de kan drive fra sida. Derfor tar
 *  hver funksjon under inn den samme `Tour`/`TourGuide`-en som JSX-en rendrer,
 *  ikke sine egne strenger. Ingen datoer: vi måler ikke når en guide sist ble
 *  endret, og en oppdiktet `datePublished` er nettopp det som er forbudt.
 *
 *  Utskriften skjer i `components/JsonLd.tsx`.
 */

import { SITE } from "@/lib/config";
import { htmlLang, type Lang } from "@/lib/i18n";
import { CANONICAL_ORIGIN, OG_IMAGE, canonicalUrl } from "@/lib/seo";
import type { Tour, TourGuide } from "@/lib/types";

/** Avsenderen. Samme objekt refereres fra både `WebSite` og hver artikkel, så
 *  det er én enhet i grafen framfor tre løse med samme navn. */
const ORGANIZATION_ID = `${CANONICAL_ORIGIN}/#organization`;

function organization() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE.name,
    url: CANONICAL_ORIGIN,
    email: SITE.supportEmail,
    logo: canonicalUrl("/icon.png"),
  };
}

/** Forsida: hvem nettstedet er, én gang, på den ene siden som representerer
 *  hele det. Ingen `SearchAction` — nettstedet har ingen søkeboks, og å melde
 *  inn en som ikke finnes er en ren feilopplysning. */
export function siteJsonLd(lang: Lang) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${CANONICAL_ORIGIN}/#website`,
      url: CANONICAL_ORIGIN,
      name: SITE.name,
      description: SITE.description,
      inLanguage: htmlLang(lang),
      publisher: { "@id": ORGANIZATION_ID },
    },
    { "@context": "https://schema.org", ...organization() },
  ];
}

/** Brødsmulene. `path` er stien slik den står i lenkene ellers i appen; siste
 *  ledd er sida man står på og trenger ingen. */
export function breadcrumbJsonLd(trail: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.path ? { item: canonicalUrl(crumb.path) } : {}),
    })),
  };
}

/** En turguide: artikkelen og fjellet den handler om. Hele guiden er åpen
 *  for alle, så `isAccessibleForFree` er sann. */
export function tourJsonLd({
  tour,
  guide,
  lang,
}: {
  tour: Tour;
  guide: TourGuide | undefined;
  lang: Lang;
}) {
  const path = `/tur/${tour.slug}`;
  const url = canonicalUrl(path);
  const description = guide?.intro ?? tour.teaser;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `${tour.name}, ${tour.region}`,
    description,
    inLanguage: htmlLang(lang),
    image: canonicalUrl(OG_IMAGE.url),
    mainEntityOfPage: url,
    publisher: { "@id": ORGANIZATION_ID },
    isAccessibleForFree: true,
    about: {
      "@type": "Mountain",
      name: tour.name,
      /* Regionen er egennavnet lista og overskriftene bruker — «Lyngen»,
         «Sunnmørsalpene». Det er det stedet fjellet ligger i, og det eneste
         datasettet kjenner om plasseringa utover koordinatene. */
      containedInPlace: { "@type": "Place", name: tour.region },
      geo: {
        "@type": "GeoCoordinates",
        latitude: tour.lat,
        longitude: tour.lng,
        /* Meter over havet — schema.org sin standardenhet for feltet, og den
           samme høyden som står i nøkkeltallene. */
        elevation: tour.summitM,
      },
    },
  };
}
