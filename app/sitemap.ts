import type { MetadataRoute } from "next";

import { canonicalUrl } from "@/lib/seo";
import { TOURS } from "@/lib/tours";

/** `/sitemap.xml` — listen Search Console skal fôres med.
 *
 *  Bare sider en utlogget leser faktisk får se står her: forsiden, kartet, de
 *  61 tursidene og de to juridiske sidene. `/min-side`, `/betaling`,
 *  `/logg-inn` og `/admin/*` hører ikke hjemme i et sitemap — de er konto- og
 *  driftssider, og de er merket `noindex` der de defineres.
 *
 *  Guidene er halvt låst for utloggede (rutebeskrivelse og skredterreng ligger
 *  bak abonnement), men innledning, kart, nøkkeltall og høydeprofil er åpne.
 *  Det er ekte innhold på en åpen URL, og det er det Google indekserer. De
 *  turene som ennå ikke har en skriven guide står også her: sida deres har
 *  nøkkeltall, teaser og lenke inn i kartet, og sier selv at guiden kommer.
 *
 *  Ingen `lastModified`: sitemap-et bygges statisk, så feltet ville blitt
 *  byggetidspunktet — altså «alt endret seg» ved hver eneste deploy. En dato
 *  som alltid er fersk er verdiløs som signal, og Google behandler den
 *  deretter. Bedre å la den stå tom enn å love noe vi ikke måler.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: canonicalUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: canonicalUrl("/kart"), changeFrequency: "weekly", priority: 0.9 },
    { url: canonicalUrl("/turer"), changeFrequency: "weekly", priority: 0.9 },
    ...TOURS.map((tour) => ({
      url: canonicalUrl(`/tur/${tour.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: canonicalUrl("/vilkar"), changeFrequency: "yearly", priority: 0.1 },
    { url: canonicalUrl("/personvern"), changeFrequency: "yearly", priority: 0.1 },
  ];
}
