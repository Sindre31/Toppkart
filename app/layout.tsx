import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Feedback } from "@/components/Feedback";
import { getIdentity } from "@/lib/access";
import { GA_MEASUREMENT_ID } from "@/lib/config";
import { htmlLang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { siteMeta } from "@/lib/i18n/common";
import { CANONICAL_ORIGIN, OG_IMAGE, isIndexable } from "@/lib/seo";
import "./globals.css";

/** Barlow og Barlow Condensed, hentet ved bygging og servert fra vårt eget
 *  domene. De lå tidligere bak en `@import` øverst i `globals.css`, altså tre
 *  blokkerende rundturer på rad til to fremmede verter før den første bokstaven
 *  kunne tegnes i riktig skrift. Nå kommer filene fra samme opphav som resten av
 *  sida, uten oppslag, uten ny forbindelse, og med den samme
 *  bufferen — og `preconnect`-lenkene i `<head>` er ikke lenger noe å varme opp.
 *
 *  `display: "swap"` er det samme løftet som før: tekst leses i reserveskriften
 *  med det samme framfor å stå usynlig og vente.
 *
 *  Vektene er de som faktisk brukes — 400/500/700 i brødteksten, 400/600 i
 *  overskriftene — og det er den listen som avgjør hvor mange filer som lastes.
 *  Variablene leses av `--font-body` og `--font-heading` i `globals.css`. */
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--tk-font-body",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--tk-font-heading",
});

/** Title and description follow the reader's language. `generateMetadata` runs
 *  per request, so it can read the language cookie the way the pages do.
 *
 *  `metadataBase` er det som gjør at de relative adressene under — canonical på
 *  hver side, og bildet her — kommer ut som hele URL-er i HTML-en. Uten den
 *  skriver Next ut `/tur/slogen` der Google venter `https://toppkart.no/tur/slogen`.
 *
 *  Alt som ikke er produksjonsdeployen sier `noindex` i tillegg til
 *  `Disallow: /` i `robots.txt` — beltet for de robotene som allerede kjenner
 *  en preview-URL og henter den uten å spørre robots.txt først. */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const site = siteMeta(lang);
  const title = `${site.name} — ${site.tagline}`;
  return {
    metadataBase: new URL(CANONICAL_ORIGIN),
    title: { default: title, template: `${site.name} — %s` },
    description: site.description,
    applicationName: site.name,
    openGraph: {
      type: "website",
      siteName: site.name,
      /* Delingsspråket følger leserens eget: samme URL, to språk, valgt av
         `tk_lang`-cookien. */
      locale: lang === "en" ? "en_GB" : "nb_NO",
      title,
      description: site.description,
      images: [{ ...OG_IMAGE, alt: site.tagline }],
    },
    twitter: { card: "summary_large_image" },
    ...(isIndexable ? {} : { robots: { index: false, follow: false } }),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  /* Free: `getIdentity()` is memoised per request, and every page that renders
     the account nav has already asked. The dialog only needs the address, to
     tell the reader whether a reply can reach them — not the subscription row
     `getViewer()` would fetch alongside it. */
  const { email } = await getIdentity();

  /* Production only. `VERCEL_ENV` is "preview" on branch deploys and undefined
     locally, so neither ends up in the property's numbers — a preview deploy
     counted as real traffic is the usual way analytics start lying. Read on the
     server, where the variable exists; it is not a NEXT_PUBLIC_ one. */
  const analytics = process.env.VERCEL_ENV === "production";

  return (
    <html lang={htmlLang(lang)} className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        {children}
        <Feedback lang={lang} email={email} />
        <Analytics />
        {analytics && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
