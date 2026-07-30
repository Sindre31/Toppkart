import type { Metadata } from "next";
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

  return (
    <html lang={htmlLang(lang)}>
      <head>
        {/* Barlow and Barlow Condensed are pulled in by the @import at the top
            of globals.css; warming the connections keeps headings from
            flashing in the fallback face. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
