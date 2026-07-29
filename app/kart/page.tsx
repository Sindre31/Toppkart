import type { Metadata } from "next";
import { getViewer } from "@/lib/access";
import { getLang } from "@/lib/i18n";
import { mapDict } from "@/lib/i18n/map";
import { getTour } from "@/lib/tours";
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
  searchParams: Promise<{ tur?: string | string[] }>;
}) {
  const [viewer, params, lang] = await Promise.all([getViewer(), searchParams, getLang()]);

  const raw = params?.tur;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  const initialSlug = slug && getTour(slug) ? slug : null;

  return <MapView lang={lang} hasAccess={viewer.hasAccess} initialSlug={initialSlug} />;
}
