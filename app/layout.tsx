import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { GA_MEASUREMENT_ID } from "@/lib/config";
import { htmlLang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { siteMeta } from "@/lib/i18n/common";
import "./globals.css";

/** Title and description follow the reader's language. `generateMetadata` runs
 *  per request, so it can read the language cookie the way the pages do. */
export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const site = siteMeta(lang);
  return {
    title: { default: `${site.name} — ${site.tagline}`, template: `${site.name} — %s` },
    description: site.description,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();

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
