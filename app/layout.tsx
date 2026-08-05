import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Feedback } from "@/components/Feedback";
import { getViewer } from "@/lib/access";
import { GA_MEASUREMENT_ID } from "@/lib/config";
import { htmlLang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { siteMeta } from "@/lib/i18n/common";
import { CANONICAL_ORIGIN, OG_IMAGE, isIndexable } from "@/lib/seo";
import "./globals.css";

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
  /* Free: `getViewer()` is memoised per request, and every page that renders
     the account nav has already asked. The dialog only needs the address, to
     tell the reader whether a reply can reach them. */
  const { email } = await getViewer();

  /* Production only. `VERCEL_ENV` is "preview" on branch deploys and undefined
     locally, so neither ends up in the property's numbers — a preview deploy
     counted as real traffic is the usual way analytics start lying. Read on the
     server, where the variable exists; it is not a NEXT_PUBLIC_ one. */
  const analytics = process.env.VERCEL_ENV === "production";

  return (
    <html lang={htmlLang(lang)}>
      <head>
        {/* Barlow and Barlow Condensed are pulled in by the @import at the top
            of globals.css; warming the connections keeps headings from
            flashing in the fallback face. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
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
