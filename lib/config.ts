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

/** The legal entity behind the service, named on /vilkar and /personvern.
 *
 *  **These are placeholders and must be filled in before launch.** Both pages
 *  render them verbatim, so an unfilled value shows up on the live site as
 *  «[organisasjonsnummer]» — deliberately impossible to miss. A terms page that
 *  does not say who you are contracting with, and a privacy notice that does
 *  not name the controller, are not merely untidy: identifying the trader is
 *  required of a consumer sale, and naming the controller is required by the
 *  GDPR.
 *
 *  A constant rather than an env var for the same reason as `supportEmail`:
 *  it is a public fact read in the browser bundle, where a variable without a
 *  `NEXT_PUBLIC_` prefix would silently be undefined. */
export const LEGAL = {
  entity: "[selskapsnavn]",
  orgNumber: "[organisasjonsnummer]",
  address: "[postadresse]",
} as const;

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
