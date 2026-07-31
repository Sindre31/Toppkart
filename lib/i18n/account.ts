/** NO/EN dictionary for sign-in (`/logg-inn`) and the account page
 *  (`/min-side`) — headings, form copy, subscription state, billing actions and
 *  every error the two pages can show.
 *
 *  Subscription *state* is never translated: `Subscription["status"]` and the
 *  plan ids (`"maned"` / `"ar"`) stay exactly as the database and Stripe write
 *  them. Only the label a reader sees is picked from here.
 *
 *  Keys that carry data — a date, a price, an email address — are functions, so
 *  the sentence order stays translatable instead of being glued together in JSX.
 *  Receipt rows are localised separately, in `@/lib/invoices`, because their
 *  strings come from Stripe rather than from the page.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface AccountDict {
  /* — sign-in: metadata — */
  loginMetaTitle: string;
  loginMetaDescription: string;
  /* — sign-in: the form — */
  loginKicker: string;
  loginHeading: string;
  loginIntro: string;
  emailLabel: string;
  emailPlaceholder: string;
  sendLink: string;
  sending: string;
  /* — sign-in: Google — */
  googleButton: string;
  googleRedirecting: string;
  /** Separator between the Google button and the email form. */
  orDivider: string;
  /** Trailing question + link under the card, for readers without an account. */
  newHere: string;
  newHereLink: string;
  /* — sign-in: errors — */
  errInvalidEmail: string;
  errSendFailed: string;
  errLinkExpired: string;
  /** Google handed back an error, or the provider is not enabled in Supabase. */
  errGoogleFailed: string;
  /* — sign-in: the «check your inbox» state — */
  sentKicker: string;
  sentHeading: string;
  /** Split around the address, which renders bold between the two halves. */
  sentBodyBefore: string;
  sentBodyAfter: string;
  openAccountDemo: string;
  sendAgain: string;

  /* — account: metadata and header — */
  accountMetaTitle: string;
  accountMetaDescription: string;
  accountHeading: string;
  signedInAs: string;
  /* — account: section kickers — */
  kickerSubscription: string;
  kickerReceipts: string;
  kickerAccount: string;
  /* — account: the plan plate — */
  planTitle: (price: string) => string;
  pricePerMonth: string;
  pricePerYear: string;
  statusNone: string;
  statusTrialing: string;
  statusActive: string;
  statusCancelled: string;
  statusPastDue: string;
  noteNone: string;
  noteTrialUntil: (date: string, price: string) => string;
  noteTrial: (price: string) => string;
  noteRenewsMonthly: string;
  noteRenewsYearly: string;
  noteCancelled: string;
  notePastDue: string;
  startTrial: string;
  /* — account: the subscription table — */
  rowNextCharge: string;
  rowPaymentMethod: string;
  rowMemberSince: string;
  nextChargeNone: string;
  nextChargeOn: (price: string, date: string) => string;
  nextChargeAfterTrial: (price: string) => string;
  nextChargeAtRenewal: (price: string) => string;
  noPaymentMethod: string;
  /** `("Visa", "4242", "08/28")` → «Visa •••• 4242 (utløper 08/28)». */
  cardLine: (brand: string, last4: string, expiry: string) => string;
  stripeNote: string;
  /* — account: billing actions and the cancel dialog — */
  changePaymentMethod: string;
  resumeSubscription: string;
  cancelSubscription: string;
  portalDemoNote: string;
  errPortalFailed: string;
  errSubscriptionFailed: string;
  cancelDialogTitle: string;
  cancelDialogBody: (periodEnd: string) => string;
  keepSubscription: string;
  confirmCancel: string;
  /** Stands in for the period end when no date is known. */
  periodEndFallback: string;
  /* — account: receipts — */
  receiptDate: string;
  receiptDescription: string;
  receiptAmount: string;
  receiptStatus: string;
  receiptPdf: string;
  receiptsEmpty: string;
  /* — account: the e-mail card — */
  emailCardTitle: string;
  changeEmail: string;
  errSameEmail: string;
  errEmailChangeFailed: string;
  emailChangeSent: (email: string) => string;
  emailCardNote: string;
  /* — account: footer — */
  aboutSubscription: string;
}

const ACCOUNT: Translated<AccountDict> = {
  no: {
    loginMetaTitle: "Logg inn",
    loginMetaDescription:
      "Logg inn på Toppkart med Google eller en engangslenke på e-post — ingen passord å huske.",
    loginKicker: "Logg inn",
    loginHeading: "Uten passord",
    loginIntro:
      "Logg inn med Google, eller få en engangslenke på e-post. Lenken virker i 15 minutter.",
    emailLabel: "E-postadresse",
    emailPlaceholder: "din@epost.no",
    sendLink: "Send innloggingslenke",
    sending: "Sender …",
    googleButton: "Fortsett med Google",
    googleRedirecting: "Sender deg til Google …",
    orDivider: "eller",
    newHere: "Ny her?",
    newHereLink: "Prøv gratis i 14 dager — deretter 29 kr/mnd",
    errInvalidEmail: "Skriv inn en gyldig e-postadresse.",
    errSendFailed: "Vi klarte ikke å sende innloggingslenken. Prøv igjen om litt.",
    errLinkExpired: "Innloggingslenken er ugyldig eller utløpt. Be om en ny lenke.",
    errGoogleFailed:
      "Vi fikk ikke kontakt med Google, eller innlogginga ble avbrutt. Prøv igjen, eller bruk e-post.",
    sentKicker: "Sjekk innboksen",
    sentHeading: "Lenken er sendt",
    sentBodyBefore: "Vi har sendt en innloggingslenke til",
    sentBodyAfter: ". Åpne e-posten og trykk på lenken.",
    openAccountDemo: "Åpne Min side (demo)",
    sendAgain: "Send på nytt",

    accountMetaTitle: "Min side",
    accountMetaDescription: "Abonnement, kvitteringer og kontoinnstillinger for Toppkart.",
    accountHeading: "Min side",
    signedInAs: "Innlogget som",
    kickerSubscription: "01 · Abonnement",
    kickerReceipts: "02 · Kvitteringer",
    kickerAccount: "03 · Konto",
    planTitle: (price) => `Toppkart — ${price}`,
    pricePerMonth: "29 kr/mnd",
    pricePerYear: "290 kr/år",
    statusNone: "Ingen abonnement",
    statusTrialing: "Prøveperiode",
    statusActive: "Aktiv",
    statusCancelled: "Avsluttet",
    statusPastDue: "Betaling mangler",
    noteNone:
      "Du har ikke et aktivt abonnement — start prøveperioden for å låse opp turguidene.",
    noteTrialUntil: (date, price) => `Gratis til ${date} — deretter ${price}.`,
    noteTrial: (price) => `Gratis prøveperiode — deretter ${price}.`,
    noteRenewsMonthly: "Fornyes automatisk hver måned.",
    noteRenewsYearly: "Fornyes automatisk hvert år.",
    noteCancelled: "Tilgang ut perioden — ingen flere trekk.",
    notePastDue: "Vi fikk ikke trukket siste betaling — oppdater betalingsmetoden.",
    startTrial: "Start gratis prøveperiode",
    rowNextCharge: "Neste trekk",
    rowPaymentMethod: "Betalingsmetode",
    rowMemberSince: "Medlem siden",
    nextChargeNone: "Ingen — abonnementet er avsluttet",
    nextChargeOn: (price, date) => `${price} den ${date}`,
    nextChargeAfterTrial: (price) => `${price} når prøveperioden er over`,
    nextChargeAtRenewal: (price) => `${price} ved neste fornyelse`,
    noPaymentMethod: "Ingen betalingsmetode registrert",
    cardLine: (brand, last4, expiry) => `${brand} •••• ${last4} (utløper ${expiry})`,
    stripeNote:
      "Betaling og kort håndteres sikkert av Stripe. Kvittering sendes på e-post etter hvert trekk.",
    changePaymentMethod: "Endre betalingsmetode",
    resumeSubscription: "Gjenoppta abonnement",
    cancelSubscription: "Avslutt abonnement",
    portalDemoNote: "Stripe-portalen åpnes her når betalingsnøklene er satt opp.",
    errPortalFailed: "Vi fikk ikke åpnet betalingsportalen. Prøv igjen om litt.",
    errSubscriptionFailed: "Vi fikk ikke oppdatert abonnementet. Prøv igjen om litt.",
    cancelDialogTitle: "Avslutte abonnementet?",
    cancelDialogBody: (periodEnd) =>
      `Du beholder tilgang ut inneværende periode (${periodEnd}). Etter det låses turguidene, men kontoen og lagrede turer beholdes.`,
    keepSubscription: "Behold abonnement",
    confirmCancel: "Avslutt",
    periodEndFallback: "periodeslutt",
    receiptDate: "Dato",
    receiptDescription: "Beskrivelse",
    receiptAmount: "Beløp",
    receiptStatus: "Status",
    receiptPdf: "PDF",
    receiptsEmpty: "Ingen kvitteringer ennå — første trekk kommer etter prøveperioden.",
    emailCardTitle: "E-post",
    changeEmail: "Endre",
    errSameEmail: "Dette er allerede adressen din.",
    errEmailChangeFailed: "Vi fikk ikke endret adressen. Prøv igjen om litt.",
    emailChangeSent: (email) =>
      `Vi har sendt en bekreftelseslenke til ${email}. Åpne den for å fullføre endringen.`,
    emailCardNote:
      "Du kan logge inn med lenke til denne adressen, eller med Google. Ingen passord. Logger du inn med Google, er det Google-adressen som gjelder.",
    aboutSubscription: "Om abonnementet",
  },
  en: {
    loginMetaTitle: "Log in",
    loginMetaDescription:
      "Sign in to Toppkart with Google or a one-time link sent to your email — no password to remember.",
    loginKicker: "Log in",
    loginHeading: "No password",
    loginIntro:
      "Sign in with Google, or get a one-time link by email. The link works for 15 minutes.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    sendLink: "Send sign-in link",
    sending: "Sending …",
    googleButton: "Continue with Google",
    googleRedirecting: "Taking you to Google …",
    orDivider: "or",
    newHere: "New here?",
    newHereLink: "Try free for 14 days — then 29 kr/month",
    errInvalidEmail: "Enter a valid email address.",
    errSendFailed: "We could not send the sign-in link. Try again in a moment.",
    errLinkExpired: "That sign-in link is invalid or has expired. Ask for a new one.",
    errGoogleFailed:
      "We could not reach Google, or the sign-in was cancelled. Try again, or use email instead.",
    sentKicker: "Check your inbox",
    sentHeading: "Link sent",
    sentBodyBefore: "We have sent a sign-in link to",
    sentBodyAfter: ". Open the email and click the link.",
    openAccountDemo: "Open My account (demo)",
    sendAgain: "Send again",

    accountMetaTitle: "My account",
    accountMetaDescription: "Subscription, receipts and account settings for Toppkart.",
    accountHeading: "My account",
    signedInAs: "Signed in as",
    kickerSubscription: "01 · Subscription",
    kickerReceipts: "02 · Receipts",
    kickerAccount: "03 · Account",
    planTitle: (price) => `Toppkart — ${price}`,
    pricePerMonth: "29 kr/month",
    pricePerYear: "290 kr/year",
    statusNone: "No subscription",
    statusTrialing: "Free trial",
    statusActive: "Active",
    statusCancelled: "Cancelled",
    statusPastDue: "Payment due",
    noteNone:
      "You do not have an active subscription — start the free trial to unlock the guides.",
    noteTrialUntil: (date, price) => `Free until ${date} — then ${price}.`,
    noteTrial: (price) => `Free trial — then ${price}.`,
    noteRenewsMonthly: "Renews automatically every month.",
    noteRenewsYearly: "Renews automatically every year.",
    noteCancelled: "Access runs to the end of the period — no further charges.",
    notePastDue: "The last payment did not go through — update your payment method.",
    startTrial: "Start free trial",
    rowNextCharge: "Next charge",
    rowPaymentMethod: "Payment method",
    rowMemberSince: "Member since",
    nextChargeNone: "None — the subscription has ended",
    nextChargeOn: (price, date) => `${price} on ${date}`,
    nextChargeAfterTrial: (price) => `${price} when the trial ends`,
    nextChargeAtRenewal: (price) => `${price} at the next renewal`,
    noPaymentMethod: "No payment method saved",
    cardLine: (brand, last4, expiry) => `${brand} •••• ${last4} (expires ${expiry})`,
    stripeNote:
      "Payments and card details are handled securely by Stripe. A receipt is emailed after every charge.",
    changePaymentMethod: "Change payment method",
    resumeSubscription: "Resume subscription",
    cancelSubscription: "Cancel subscription",
    portalDemoNote: "The Stripe portal opens here once the payment keys are set up.",
    errPortalFailed: "We could not open the billing portal. Try again in a moment.",
    errSubscriptionFailed: "We could not update your subscription. Try again in a moment.",
    cancelDialogTitle: "Cancel your subscription?",
    cancelDialogBody: (periodEnd) =>
      `You keep access until the end of the current period (${periodEnd}). After that the guides lock again, but your account and saved tours stay.`,
    keepSubscription: "Keep subscription",
    confirmCancel: "Cancel subscription",
    periodEndFallback: "the end of the period",
    receiptDate: "Date",
    receiptDescription: "Description",
    receiptAmount: "Amount",
    receiptStatus: "Status",
    receiptPdf: "PDF",
    receiptsEmpty: "No receipts yet — the first charge comes after the trial.",
    emailCardTitle: "Email",
    changeEmail: "Change",
    errSameEmail: "That is already your address.",
    errEmailChangeFailed: "We could not change your address. Try again in a moment.",
    emailChangeSent: (email) =>
      `We have sent a confirmation link to ${email}. Open it to finish the change.`,
    emailCardNote:
      "You can sign in with a link sent to this address, or with Google. No password. If you sign in with Google, the Google address is the one that counts.",
    aboutSubscription: "About the subscription",
  },
};

export function accountDict(lang: Lang): AccountDict {
  return pick(ACCOUNT, lang);
}
