import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Feedback } from "@/components/Feedback";
import { ServiceWorker } from "@/components/ServiceWorker";
import { getIdentity } from "@/lib/access";
import { GA_MEASUREMENT_ID } from "@/lib/config";
import { htmlLang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { siteMeta } from "@/lib/i18n/common";
import { CANONICAL_ORIGIN, OG_IMAGE, isIndexable } from "@/lib/seo";
import "./globals.css";

/** Instrument Serif og Schibsted Grotesk, hentet ved bygging og servert fra
 *  vårt eget domene — ikke bak en `@import` i `globals.css`, som ville vært tre
 *  blokkerende rundturer til to fremmede verter før første bokstav.
 *
 *  Instrument Serif er visningsskriften: fjellnavn, seksjonstitler og de store
 *  tallene. Den finnes bare i én vekt, med kursiv til ingressens siste setning.
 *  Schibsted Grotesk bærer alt annet, i 400–700; den er variabel, så vektene
 *  koster én fil og ikke fire.
 *
 *  `display: "swap"`: tekst leses i reserveskriften med det samme framfor å stå
 *  usynlig og vente. Variablene leses av `--font-heading` og `--font-body` i
 *  `globals.css`. */
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--tk-font-heading",
});

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--tk-font-body",
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

/** Låser sida til skjermbredden: ingen knip-zoom, alltid den bredden layouten
 *  er tegnet for.
 *
 *  `width`/`initialScale` er de samme Next satte selv før denne eksporten
 *  fantes; det nye er `maximumScale` og `userScalable`.
 *
 *  To ting å vite om dem. iOS Safari har ignorert begge siden iOS 10 — Apple
 *  overstyrer dem med vilje, så på iPhone er de uten virkning, og det er
 *  16px-regelen på `.input` i globals.css som gjør at sida faktisk blir
 *  stående i riktig bredde der. Og de bryter WCAG 1.4.4, som krever at tekst
 *  kan forstørres til 200 %; på Android, der de virker, mister lesere med
 *  svakt syn den muligheten. Fjern de to linjene for å få den tilbake. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  /* The feedback dialog only needs the address, to tell the reader whether a
     reply can reach them. Readers have no accounts, so this is only ever set
     for a signed-in admin. */
  const { email } = await getIdentity();

  /* Production only. `VERCEL_ENV` is "preview" on branch deploys and undefined
     locally, so neither ends up in the property's numbers — a preview deploy
     counted as real traffic is the usual way analytics start lying. Read on the
     server, where the variable exists; it is not a NEXT_PUBLIC_ one. */
  const analytics = process.env.VERCEL_ENV === "production";

  return (
    <html lang={htmlLang(lang)} className={`${instrumentSerif.variable} ${schibstedGrotesk.variable}`}>
      <body>
        {children}
        <Feedback lang={lang} email={email} />
        <ServiceWorker />
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
