import type { Metadata } from "next";
import { NavLinks } from "@/components/SiteChrome";
import { getViewer } from "@/lib/access";
import { getLang } from "@/lib/i18n/server";
import { mapDict } from "@/lib/i18n/map";
import { localizeTours } from "@/lib/i18n/content";
import { REGIONS, TOURS, getTour, routeMeta, routesFor } from "@/lib/tours";
import MapView from "./MapView";

/** `?tur=` og `?rute=` velger hva panelet åpner på — de er navigasjon, ikke nye
 *  sider, og hver kombinasjon ville ellers blitt en egen adresse i indeksen med
 *  samme kart under. Canonical peker dem alle tilbake på `/kart`; turen har sin
 *  egen side på `/tur/<slug>`, og det er den som skal rangere på fjellnavnet. */
export async function generateMetadata(): Promise<Metadata> {
  const t = mapDict(await getLang());
  return { title: t.metaTitle, description: t.metaDescription, alternates: { canonical: "/kart" } };
}

/** The map is open to everyone; `hasAccess` only decides whether the detail
 *  panel shows the locked block or the subscriber block. */
export default async function KartPage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string | string[]; rute?: string | string[] }>;
}) {
  const [viewer, params, lang] = await Promise.all([getViewer(), searchParams, getLang()]);

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
    <MapView
      lang={lang}
      hasAccess={viewer.hasAccess}
      nav={<NavLinks lang={lang} current="/kart" />}
      tours={localizeTours(TOURS, lang)}
      regions={REGIONS}
      routeMeta={routeMeta()}
      initialSlug={initialSlug}
      initialRouteId={initialRouteId}
    />
  );
}
