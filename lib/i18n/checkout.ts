/** NO/EN dictionary for the checkout flow — `/betaling`.
 *
 *  Covers the two states the route can be in: the summary + payment step, and
 *  the confirmation shown after Stripe (or the demo flow) returns.
 *
 *  Prices stay in kroner in both languages — the product is sold in Norway, and
 *  the English site is a translation, not a different market. Only the words
 *  around the figure change (`per måned` → `per month`).
 *
 *  The plan tokens `maned` / `ar` are used here purely as lookup keys for the
 *  visible copy. The values sent to `/api/checkout` and on to Stripe are the
 *  same tokens the route already validates and are never translated.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

/** The plan the user is buying, as it travels through the URL and the API. */
export type PlanKey = "maned" | "ar";

/** The visible name and billing cadence of a plan. */
export interface PlanCopy {
  planLabel: string;
  perLabel: string;
}

export interface CheckoutDict {
  /* — <head> — */
  metaTitle: string;
  metaDescription: string;
  /* — chrome — */
  navNote: string;
  /* — header — */
  kicker: string;
  heading: string;
  /* — summary plate — */
  summaryHeading: string;
  trialRow: (days: number) => string;
  dueToday: string;
  firstCharge: (price: string, date: string) => string;
  /* — form — */
  stripeNextStep: string;
  /* — sign in before paying — */
  googleButton: string;
  googleRedirecting: string;
  /** Separator between the Google button and the e-mail field. */
  orDivider: string;
  /** Sits under the Google button. */
  googleNote: string;
  /** Explains why the payment form is not shown yet. */
  signInFirst: string;
  /** Precedes the address on the signed-in step. */
  signedInAs: string;
  /** The API refused a checkout with no session behind it. */
  notSignedIn: string;
  cardNumberLabel: string;
  cardNumberPlaceholder: string;
  expiryLabel: string;
  expiryPlaceholder: string;
  cvcLabel: string;
  cvcPlaceholder: string;
  cardNameLabel: string;
  cardNamePlaceholder: string;
  submit: string;
  submitBusy: string;
  reassurance: string;
  /* — errors — */
  emailInvalid: string;
  startFailed: string;
  networkFailed: string;
  unknownPlan: string;
  priceUnavailable: string;
  providerSilent: string;
  /* — confirmation — */
  confirmKicker: string;
  confirmHeading: string;
  confirmBody: (date: string) => string;
  confirmOpenMap: string;
  confirmAccount: string;
  /* — plans — */
  plans: Record<PlanKey, PlanCopy>;
}

const CHECKOUT: Translated<CheckoutDict> = {
  no: {
    metaTitle: "Betaling",
    metaDescription:
      "Start prøveperioden på Toppkart: 14 dager gratis, deretter 29 kr/mnd. Kort kreves ved oppstart, ingen binding.",

    navNote: "Sikker betaling via Stripe",

    kicker: "Steg 2 av 2 · Betaling",
    heading: "Start prøveperioden",

    summaryHeading: "Oppsummering",
    trialRow: (days) => `Prøveperiode ${days} dager`,
    dueToday: "Å betale i dag",
    firstCharge: (price, date) =>
      `Første trekk (${price}) den ${date}. Avslutt før det, så trekkes ingenting.`,

    stripeNextStep: "Kortopplysningene legges inn hos Stripe i neste steg.",
    googleButton: "Fortsett med Google",
    googleRedirecting: "Sender deg til Google …",
    orDivider: "eller",
    googleNote:
      "Vi lagrer e-postadressen fra Google-kontoen din, og bruker den bare til kvitteringer.",
    signInFirst:
      "Logg inn først, så knyttes abonnementet til kontoen din med én gang. Det tar ett klikk, og du kommer rett tilbake hit.",
    signedInAs: "Abonnementet knyttes til",
    notSignedIn: "Du må logge inn med Google før du starter abonnementet.",
    cardNumberLabel: "Kortnummer",
    cardNumberPlaceholder: "1234 1234 1234 1234",
    expiryLabel: "Utløpsdato",
    expiryPlaceholder: "MM / ÅÅ",
    cvcLabel: "CVC",
    cvcPlaceholder: "123",
    cardNameLabel: "Navn på kortet",
    cardNamePlaceholder: "Kari Nordmann",
    submit: "Start prøveperiode — 0 kr i dag",
    submitBusy: "Starter prøveperioden …",
    reassurance:
      "Kortopplysningene behandles av Stripe og lagres aldri hos Toppkart. Ingen binding — avslutt når som helst fra Min side. Kvittering sendes på e-post etter hvert trekk.",

    emailInvalid: "Skriv inn en gyldig e-postadresse.",
    startFailed: "Vi fikk ikke startet prøveperioden. Prøv igjen om litt.",
    networkFailed: "Vi fikk ikke kontakt med serveren. Prøv igjen om litt.",
    unknownPlan: "Ukjent abonnement. Velg månedlig eller årlig.",
    priceUnavailable: "Prisen for dette abonnementet er ikke satt opp ennå. Prøv igjen senere.",
    providerSilent: "Fikk ikke svar fra betalingsleverandøren. Prøv igjen om litt.",

    confirmKicker: "Kvittering sendt på e-post",
    confirmHeading: "Velkommen opp",
    confirmBody: (date) =>
      `Prøveperioden er i gang og varer til ${date}. Alle turguider, GPX-filer og skredterreng er nå åpne.`,
    confirmOpenMap: "Åpne kartet",
    confirmAccount: "Min side",

    plans: {
      maned: { planLabel: "Toppkart månedlig", perLabel: "per måned" },
      ar: { planLabel: "Toppkart årlig", perLabel: "per år — to måneder gratis" },
    },
  },

  en: {
    metaTitle: "Checkout",
    metaDescription:
      "Start your Toppkart trial: 14 days free, then 29 kr/month. Card required at signup, no lock-in.",

    navNote: "Secure payment via Stripe",

    kicker: "Step 2 of 2 · Checkout",
    heading: "Start your free trial",

    summaryHeading: "Summary",
    trialRow: (days) => `${days}-day free trial`,
    dueToday: "Due today",
    firstCharge: (price, date) =>
      `First charge (${price}) on ${date}. Cancel before then and you won't be charged.`,

    stripeNextStep: "You'll enter your card details with Stripe in the next step.",
    googleButton: "Continue with Google",
    googleRedirecting: "Taking you to Google …",
    orDivider: "or",
    googleNote:
      "We store the email address from your Google account, and use it only for receipts.",
    signInFirst:
      "Sign in first, so the subscription attaches to your account right away. One click, and you come straight back here.",
    signedInAs: "The subscription will be attached to",
    notSignedIn: "Sign in with Google before starting the subscription.",
    cardNumberLabel: "Card number",
    cardNumberPlaceholder: "1234 1234 1234 1234",
    expiryLabel: "Expiry date",
    expiryPlaceholder: "MM / YY",
    cvcLabel: "CVC",
    cvcPlaceholder: "123",
    cardNameLabel: "Name on card",
    cardNamePlaceholder: "Jane Doe",
    submit: "Start free trial — 0 kr today",
    submitBusy: "Starting your trial …",
    reassurance:
      "Card details are handled by Stripe and never stored by Toppkart. No lock-in — cancel anytime from My account. A receipt is emailed after every charge.",

    emailInvalid: "Enter a valid email address.",
    startFailed: "We couldn't start your trial. Please try again in a moment.",
    networkFailed: "We couldn't reach the server. Please try again in a moment.",
    unknownPlan: "Unknown subscription. Choose monthly or yearly.",
    priceUnavailable: "The price for this subscription isn't set up yet. Please try again later.",
    providerSilent: "The payment provider didn't respond. Please try again in a moment.",

    confirmKicker: "Receipt sent by email",
    confirmHeading: "Welcome up",
    confirmBody: (date) =>
      `Your trial is running and lasts until ${date}. Every guide, GPX file and avalanche terrain map is now open to you.`,
    confirmOpenMap: "Open the map",
    confirmAccount: "My account",

    plans: {
      maned: { planLabel: "Toppkart monthly", perLabel: "per month" },
      ar: { planLabel: "Toppkart annual", perLabel: "per year — two months free" },
    },
  },
};

export function checkoutDict(lang: Lang): CheckoutDict {
  return pick(CHECKOUT, lang);
}

/* — prices — */

/** `29` → `"29 kr"`. Identical in both languages: the currency does not change
 *  with the language, so only the amount is a variable.
 *
 *  `PRICE` in `lib/config.ts` carries both the numeric `amount` and a set of
 *  Norwegian label strings. The amount stays the single source of truth and is
 *  read from there; the words around it (`planLabel`, `perLabel`, and this
 *  label) are copy, so their NO/EN pair lives in this dictionary and is picked
 *  at render time instead. */
export function priceLabel(amount: number): string {
  return `${amount} kr`;
}

/** The visible name and cadence for a plan, in `lang`. */
export function planCopy(plan: PlanKey, lang: Lang): PlanCopy {
  return checkoutDict(lang).plans[plan];
}

/* — API error codes — */

/** `app/api/checkout` replies with one of these codes rather than a sentence.
 *  The route runs on the server and has no business deciding which language the
 *  reader wants; the client already knows, and owns the wording. */
export type CheckoutErrorCode =
  | "unknown_plan"
  | "not_signed_in"
  | "invalid_email"
  | "price_unavailable"
  | "provider_silent"
  | "checkout_failed";

/** Resolve a code from the API into copy. Anything unrecognised — an old client,
 *  a proxy rewriting the body — falls back to the generic failure. */
export function checkoutError(code: unknown, lang: Lang): string {
  const t = checkoutDict(lang);
  switch (code) {
    case "unknown_plan":
      return t.unknownPlan;
    case "not_signed_in":
      return t.notSignedIn;
    case "invalid_email":
      return t.emailInvalid;
    case "price_unavailable":
      return t.priceUnavailable;
    case "provider_silent":
      return t.providerSilent;
    default:
      return t.startFailed;
  }
}
