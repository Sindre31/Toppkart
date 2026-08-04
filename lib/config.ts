/** Product constants and environment wiring.
 *
 *  The app runs in two modes:
 *   - **live**: Supabase + Stripe env vars are present, real auth and billing.
 *   - **demo**: no keys configured. Auth and subscription state are kept in
 *     signed-ish httpOnly cookies so the whole flow stays clickable (the
 *     design-review path). Every integration module falls back to this.
 */

export const PRICE = {
  monthly: { amount: 29, label: "29 kr", planLabel: "Toppkart månedlig", perLabel: "per måned" },
  yearly: { amount: 290, label: "290 kr", planLabel: "Toppkart årlig", perLabel: "per år — to måneder gratis" },
} as const;

export const TRIAL_DAYS = 14;

export const SITE = {
  name: "Toppkart",
  tagline: "Alle toppturene. Ett kart.",
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

/** Accent ramp 300/500/700/900 — grade 1…4 on the map. */
export const GRADE_COLORS = ["#b5d9fd", "#749dc4", "#416180", "#1d2d3d"] as const;

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePriceMonthly: process.env.STRIPE_PRICE_MONTHLY ?? "",
  stripePriceYearly: process.env.STRIPE_PRICE_YEARLY ?? "",
  /** Comma-separated e-mail addresses that may open /admin/*. Server-side
   *  only — never give this a NEXT_PUBLIC_ prefix. Unset means nobody. */
  adminEmails: process.env.ADMIN_EMAILS ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  fromEmail: process.env.RESEND_FROM_EMAIL ?? "Toppkart <ingen-svar@toppkart.no>",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isStripeConfigured = Boolean(env.stripeSecretKey);
export const isResendConfigured = Boolean(env.resendApiKey);

/** Cookie names used by demo mode. */
export const DEMO_COOKIE = { session: "tk_demo_session", subscription: "tk_demo_sub" } as const;
