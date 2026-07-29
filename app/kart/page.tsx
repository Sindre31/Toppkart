import type { Metadata } from "next";
import { getViewer } from "@/lib/access";
import { getTour } from "@/lib/tours";
import MapView from "./MapView";

export const metadata: Metadata = {
  title: "Kartet",
  description:
    "Alle toppturene på ett kart: grad, høydemeter, normaltid, himmelretning og sesong for hver topp.",
};

/** The map is open to everyone; `hasAccess` only decides whether the detail
 *  panel shows the locked block or the subscriber block. */
export default async function KartPage({
  searchParams,
}: {
  searchParams: Promise<{ tur?: string | string[] }>;
}) {
  const [viewer, params] = await Promise.all([getViewer(), searchParams]);

  const raw = params?.tur;
  const slug = Array.isArray(raw) ? raw[0] : raw;
  const initialSlug = slug && getTour(slug) ? slug : null;

  return <MapView hasAccess={viewer.hasAccess} initialSlug={initialSlug} />;
}
