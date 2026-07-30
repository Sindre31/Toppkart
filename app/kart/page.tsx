import type { Metadata } from "next";
import { getViewer } from "@/lib/access";
import { getLang } from "@/lib/i18n/server";
import { mapDict } from "@/lib/i18n/map";
import { getTour, routesFor } from "@/lib/tours";
import MapView from "./MapView";

export async function generateMetadata(): Promise<Metadata> {
  const t = mapDict(await getLang());
  return { title: t.metaTitle, description: t.metaDescription };
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

  return (
    <MapView
      lang={lang}
      hasAccess={viewer.hasAccess}
      initialSlug={initialSlug}
      initialRouteId={initialRouteId}
    />
  );
}
