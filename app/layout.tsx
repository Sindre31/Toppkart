import type { Metadata } from "next";
import { SITE } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `${SITE.name} — %s` },
  description: SITE.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
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
