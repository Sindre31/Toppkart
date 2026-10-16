/** Product constants and environment wiring.
 *
 *  Toppkart is free. Every guide is open to everyone and there are no reader
 *  accounts; the only sign-in left is for `/admin`.
 *
 *  The app runs in two modes:
 *   - **live**: Supabase env vars are present — real admin sign-in and the
 *     feedback table.
 *   - **demo**: no keys configured. The admin session is kept in an httpOnly
 *     cookie so the flow stays clickable. Every integration module falls back
 *     to this.
 */

/** Voluntary support. Shown on `/om`. A public fact, read in the browser
 *  bundle, so a constant rather than an env var. */
export const VIPPS = {
  /** Digits only — what gets copied to the clipboard. */
  number: "96640540",
  /** Grouped the way Norwegian mobile numbers are read out. */
  label: "966 40 540",
} as const;

export const SITE = {
  name: "Toppkart",
  tagline: "Alle toppturene. Ett kart.",
  /** Domenet siden er indeksert under. Som `supportEmail` en offentlig
   *  kjensgjerning om nettstedet, ikke en hemmelighet — og fallbacken når
   *  `NEXT_PUBLIC_SITE_URL` ikke er satt. Se `lib/seo.ts` for hvorfor sitemap
   *  og canonical ikke kan bruke per-deploy-verten `env.siteUrl` faller ned på. */
  url: "https://toppkart.no",
  /** Receive-only support mailbox. Outgoing mail leaves from a no-reply
   *  address, so this is what `Reply-To` points at and what the footer links
   *  to — it never has to send anything, only take delivery.
   *
   *  Deliberately a constant rather than an env var: it is a public fact about
   *  the site and it is read in the browser bundle, where a non-`NEXT_PUBLIC_`
   *  variable would silently be undefined. */
  supportEmail: "support@toppkart.no",
  description:
    "Toppkart er en feltguide for skiturer i Norge: kvalitetssikrede toppturer på ett kart, med rute, høydemeter, bratthet og skredterreng.",
} as const;

/** No company stands behind Toppkart yet, so `/vilkar` and `/personvern` name
 *  the service itself as operator and controller, and point at `supportEmail`
 *  as the single contact route. That is the honest description of a small
 *  private project and it is what those pages say.
 *
 *  If the service is ever run through a registered company — or turnover grows
 *  enough that it has to be — the seller has to be identifiable by name and
 *  address, and the controller has to be named. At that point add the details
 *  here and interpolate them in `lib/i18n/legal.ts`, where the two paragraphs
 *  that would carry them are marked. */

/** Google Analytics measurement id.
 *
 *  A public constant rather than an env var: it ships in the browser bundle
 *  either way, and a measurement id is not a secret — it identifies the
 *  property, it does not grant access to it.
 *
 *  `app/layout.tsx` loads the tag only on the production deployment, so
 *  localhost and Vercel previews stay out of the numbers. GA4's enhanced
 *  measurement picks up client-side route changes through history events, so
 *  no page-view listener is needed for the App Router. */
export const GA_MEASUREMENT_ID = "G-5VS58ECVSB";

/** Grad 1…4 på kartet og i tegnforklaringen: én lysskala av aksenten
 *  (tyttebær), lesbar over Kartverkets grønne og brune. Speilet i
 *  `--grade-1…4` i `app/globals.css`. */
export const GRADE_COLORS = ["#e2b3c9", "#bf6a93", "#8a2a5b", "#4a1430"] as const;

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  /** Comma-separated e-mail addresses that may open /admin/*. Server-side
   *  only — never give this a NEXT_PUBLIC_ prefix. Unset means nobody. */
  adminEmails: process.env.ADMIN_EMAILS ?? "",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
};

/** `ADMIN_EMAILS` as a normalised list. Empty when unset. Read by
 *  `lib/admin.ts` to decide who may open `/admin/*`.
 *
 *  **Empty means nobody**, never everybody. */
export function adminEmailList(): string[] {
  return env.adminEmails
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);

/** Cookie names used by demo mode. */
export const DEMO_COOKIE = {
  session: "tk_demo_session",
} as const;
