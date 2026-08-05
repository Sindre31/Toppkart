/** Hvilken adresse Google skal kjenne siden under — og hvem som får lov til å
 *  indeksere den.
 *
 *  Dette er bevisst *ikke* `env.siteUrl`. Den faller tilbake på
 *  `https://$VERCEL_URL`, som er verten for **én enkelt** deploy
 *  (`toppkart-qytwddyuz-…vercel.app`) og byttes ut hver gang noe deployes. Til
 *  redirects er det riktig — der er poenget å komme tilbake dit du kom fra. I
 *  et sitemap eller en canonical er det motsatt: adressen skal være den samme
 *  i morgen som i dag, ellers melder vi inn et sett URL-er som slutter å svare
 *  ved neste push, og hver preview-deploy blir en ny kopi av hele nettstedet i
 *  søkeindeksen.
 *
 *  Derfor: `NEXT_PUBLIC_SITE_URL` hvis den er satt (den skal være det, se
 *  `docs/deploy.md` steg 5), ellers domenet selv — aldri per-deploy-verten.
 */

import { SITE } from "@/lib/config";

/** Origin uten skråstrek til slutt, f.eks. `https://toppkart.no`. */
export const CANONICAL_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || SITE.url).replace(/\/+$/, "");

/** Absolutt URL for en sti — det sitemap-et krever, og det Open Graph-taggene
 *  blir til uansett, siden `metadataBase` står i rotlayouten. */
export const canonicalUrl = (path: string): string => `${CANONICAL_ORIGIN}${path}`;

/** Bildet som følger med når en lenke deles.
 *
 *  Next slår ikke sammen `openGraph` på tvers av layout og side — definerer en
 *  side sin egen, erstatter den rotlayoutens i sin helhet, bildet inkludert.
 *  Derfor ligger målene her, så de to stedene som setter `openGraph` kan låne
 *  dem i stedet for å gjenta dem og drive fra hverandre. */
export const OG_IMAGE = { url: "/assets/photo.jpg", width: 1600, height: 1187 } as const;

/** Bare produksjonsdeployen skal indekseres.
 *
 *  `VERCEL_ENV` er `"preview"` på branch-deploys og udefinert lokalt. En
 *  preview-deploy har hele nettstedet på et eget domene, med samme tekst; blir
 *  den indeksert, konkurrerer den med den ekte siden om de samme søkene. Derfor
 *  svarer `/robots.txt` med `Disallow: /` overalt annet enn i produksjon.
 */
export const isIndexable = process.env.VERCEL_ENV === "production";
