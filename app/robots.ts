import type { MetadataRoute } from "next";

import { canonicalUrl, isIndexable } from "@/lib/seo";

/** `/robots.txt`.
 *
 *  Alt annet enn produksjon svarer `Disallow: /`. Hver preview-deploy er hele
 *  nettstedet på sitt eget domene med nøyaktig samme tekst; indekseres den,
 *  konkurrerer den med `toppkart.no` om de samme søkene.
 *
 *  I produksjon stenges bare det som ikke er sider: `/api/*` er endepunkter (og
 *  `/api/gpx/*` krever abonnement uansett), og `/auth/callback` er et ledd i en
 *  innloggingsrunde, ikke noe å lande på fra et søk.
 *
 *  Kontosidene står bevisst *ikke* her. En URL som er stengt i robots.txt kan
 *  ikke hentes, og da ser Google heller aldri `noindex`-taggen på den — er den
 *  allerede lenket til, kan den bli liggende i indeksen uten at vi får sagt fra.
 *  `/min-side`, `/betaling`, `/logg-inn` og `/admin/tilbakemeldinger` sier
 *  derfor `noindex` i sin egen metadata, og lar roboten komme inn og lese det.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/auth/"] }],
    sitemap: canonicalUrl("/sitemap.xml"),
  };
}
