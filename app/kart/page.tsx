import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { NavLinks } from "@/components/SiteChrome";
import { getLang } from "@/lib/i18n/server";
import { mapDict } from "@/lib/i18n/map";
import { localizeTours } from "@/lib/i18n/content";
import { atWidth, photoFor } from "@/lib/peak-photos";
import { POPULARITY } from "@/lib/popularity";
import { byPopularity } from "@/lib/popularity-order";
import { siteJsonLd } from "@/lib/structured-data";
import { REGIONS, TOURS, getTour, routeMeta, routesFor } from "@/lib/tours";
import MapView from "./MapView";

/** Kartet er forsida: `next.config.ts` skriver `/` om hit.
 *
 *  `?tur=` og `?rute=` velger hva panelet åpner på — de er navigasjon, ikke nye
 *  sider, og hver kombinasjon ville ellers blitt en egen adresse i indeksen med
 *  samme kart under. Canonical peker dem alle, og `/kart`, tilbake på `/`; turen
 *  har sin egen side på `/tur/<slug>`, og det er den som skal rangere på
 *  fjellnavnet. */
export async function generateMetadata(): Promise<Metadata> {
  const t = mapDict(await getLang());
  return { title: t.metaTitle, description: t.metaDescription, alternates: { canonical: "/" } };
}

/** Miniatyrene til kartpanelet: 960 px holder til et panel på 370 og en
 *  telefon på 390, også med dobbel pikseltetthet. */
function panelPhotos() {
  return Object.fromEntries(
    TOURS.flatMap((tour) => {
      const photo = photoFor(tour.slug);
      return photo ? [[tour.slug, atWidth(photo, 960)]] : [];
    }),
  );
}

/** The map — and every guide behind it — is open to everyone. */
export default async function KartPage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string | string[]; rute?: string | string[] }>;
}) {
  const [params, lang] = await Promise.all([searchParams, getLang()]);

  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

  const slug = first(params?.tur);
  const tour = slug ? getTour(slug) : undefined;
  const initialSlug = tour ? slug! : null;

  /* `?rute=` only means anything alongside a tour, and an id that peak does not
     have is dropped here rather than trusted — `routeById` would fall back
     anyway, but then the URL and the drawn line would disagree. */
  const routeId = first(params?.rute);
  const initialRouteId =
    tour && routeId && routesFor(tour).some((r) => r.id === routeId) ? routeId : null;

  /* Turene og rutenavnene lages her framfor i `MapView`.
   *
   *  Datasettet og den engelske overlay-en er store moduler, og så lenge
   *  klientkomponenten importerte dem, lå de i bunten `/kart` må laste og kjøre
   *  før noe på sida svarer. Ingenting av det er avhengig av noe nettleseren
   *  vet: språket leses av en informasjonskapsel, som serveren har lest
   *  allerede. Så det som sendes over er resultatet — turene ferdig oversatt, og
   *  rutene uten geometrien de ikke viser. Linjene tegnes av Leaflet-halvdelen,
   *  som lastes for seg. */
  return (
    <>
      {/* Hvem nettstedet er. Står bare på forsida: `WebSite` gjentatt på 90
          sider er det samme utsagnet 90 ganger. */}
      <JsonLd data={siteJsonLd(lang)} />
      <MapView
        lang={lang}
        nav={<NavLinks lang={lang} current="/" />}
        /* Mest leste på Wikipedia først. Lista bevarer rekkefølgen den får,
           så sorteringen hører hjemme her; «Nær meg» sorterer på nytt etter
           avstand i `MapView`. */
        tours={byPopularity(localizeTours(TOURS, lang), POPULARITY)}
        sortedByPopularity={Object.keys(POPULARITY).length > 0}
        regions={REGIONS}
        routeMeta={routeMeta()}
        initialSlug={initialSlug}
        initialRouteId={initialRouteId}
        photos={panelPhotos()}
      />
    </>
  );
}
