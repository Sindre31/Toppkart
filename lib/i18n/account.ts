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
  googleButton: string;
  googleRedirecting: string;
  /** Standing note under the button: Google is the only way in. */
  googleOnlyNote: string;
  /** Trailing question + link under the card, for readers without an account. */
  newHere: string;
  newHereLink: string;
  /* — sign-in: errors — */
  /** Google handed back an error, or the provider is not enabled in Supabase. */
  errGoogleFailed: string;
  /** The round-trip came back but the session exchange failed. */
  errSignInFailed: string;

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
  /** Oppsagt, men perioden løper enda: «Avsluttes 22. august 2026».
   *
   *  Egen tilstand fordi merket ellers sier «Avsluttet» i det sekundet noen
   *  sier opp, med to uker igjen av tilgangen. Notatet under sa riktig nok
   *  «tilgang ut perioden», men et merke leses for seg, og «Avsluttet» leses
   *  som at guidene er stengt nå. */
  statusEnding: (date: string) => string;
  /** Samme tilstand uten dato — vi vet at den avsluttes, ikke når. */
  statusEndingUndated: string;
  statusCancelled: string;
  statusPastDue: string;
  noteNone: string;
  noteTrialUntil: (date: string, price: string) => string;
  noteTrial: (price: string) => string;
  noteRenewsMonthly: string;
  noteRenewsYearly: string;
  noteEnding: string;
  noteCancelled: string;
  notePastDue: string;
  startTrial: string;
  /* — account: the subscription table — */
  rowNextCharge: string;
  rowPaymentMethod: string;
  rowMemberSince: string;
  nextChargeNone: string;
  /** Oppsagt, men perioden løper: det kommer ingen trekk, og abonnementet er
   *  ikke avsluttet ennå — så «Ingen — abonnementet er avsluttet» ville vært
   *  feil på begge halvdeler. */
  nextChargeEnding: string;
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
  /* — account: the e-mail card, read-only — */
  emailCardTitle: string;
  emailCardNote: string;
  signOutCardTitle: string;
  signOutCardNote: string;
  signOutCardAction: string;
  /* — account: footer — */
  aboutSubscription: string;
}

const ACCOUNT: Translated<AccountDict> = {
  no: {
    loginMetaTitle: "Logg inn",
    loginMetaDescription:
      "Logg inn på Toppkart med Google-kontoen din — ingen passord å huske.",
    loginKicker: "Logg inn",
    loginHeading: "Uten passord",
    loginIntro:
      "Logg inn med Google-kontoen din. Ingen passord, ingen ny konto å opprette.",
    googleButton: "Fortsett med Google",
    googleRedirecting: "Sender deg til Google …",
    googleOnlyNote:
      "Google er eneste innloggingsmåte. Vi lagrer e-postadressen fra Google-kontoen din, og bruker den bare til kvitteringer.",
    newHere: "Ny her?",
    newHereLink: "Prøv gratis i 14 dager — deretter 29 kr/mnd",
    errGoogleFailed:
      "Vi fikk ikke kontakt med Google, eller innlogginga ble avbrutt. Prøv igjen.",
    errSignInFailed: "Vi klarte ikke å fullføre innlogginga. Prøv igjen.",

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
    statusEnding: (date) => `Avsluttes ${date}`,
    statusEndingUndated: "Avsluttes ved periodeslutt",
    statusCancelled: "Avsluttet",
    statusPastDue: "Betaling mangler",
    noteNone:
      "Du har ikke et aktivt abonnement — start prøveperioden for å låse opp turguidene.",
    noteTrialUntil: (date, price) => `Gratis til ${date} — deretter ${price}.`,
    noteTrial: (price) => `Gratis prøveperiode — deretter ${price}.`,
    noteRenewsMonthly: "Fornyes automatisk hver måned.",
    noteRenewsYearly: "Fornyes automatisk hvert år.",
    noteEnding: "Tilgang ut perioden — ingen flere trekk.",
    noteCancelled: "Abonnementet er avsluttet, og turguidene er låst igjen.",
    notePastDue: "Vi fikk ikke trukket siste betaling — oppdater betalingsmetoden.",
    startTrial: "Start gratis prøveperiode",
    rowNextCharge: "Neste trekk",
    rowPaymentMethod: "Betalingsmetode",
    rowMemberSince: "Medlem siden",
    nextChargeNone: "Ingen — abonnementet er avsluttet",
    nextChargeEnding: "Ingen flere trekk",
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
    emailCardNote:
      "Adressen kommer fra Google-kontoen du logger inn med, og kan ikke endres her. Endrer du den hos Google, følger den etter.",
    signOutCardTitle: "Logg ut",
    signOutCardNote:
      "Logger deg ut på denne enheten. Abonnementet løper som før, og du kommer inn igjen med Google når du vil.",
    signOutCardAction: "Logg ut",
    aboutSubscription: "Om abonnementet",
  },
  en: {
    loginMetaTitle: "Log in",
    loginMetaDescription:
      "Sign in to Toppkart with your Google account — no password to remember.",
    loginKicker: "Log in",
    loginHeading: "No password",
    loginIntro:
      "Sign in with your Google account. No password, no new account to create.",
    googleButton: "Continue with Google",
    googleRedirecting: "Taking you to Google …",
    googleOnlyNote:
      "Google is the only way to sign in. We store the email address from your Google account, and use it only for receipts.",
    newHere: "New here?",
    newHereLink: "Try free for 14 days — then 29 kr/month",
    errGoogleFailed:
      "We could not reach Google, or the sign-in was cancelled. Try again.",
    errSignInFailed: "We could not complete the sign-in. Try again.",

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
    statusEnding: (date) => `Ends ${date}`,
    statusEndingUndated: "Ends at the end of the period",
    statusCancelled: "Cancelled",
    statusPastDue: "Payment due",
    noteNone:
      "You do not have an active subscription — start the free trial to unlock the guides.",
    noteTrialUntil: (date, price) => `Free until ${date} — then ${price}.`,
    noteTrial: (price) => `Free trial — then ${price}.`,
    noteRenewsMonthly: "Renews automatically every month.",
    noteRenewsYearly: "Renews automatically every year.",
    noteEnding: "Access runs to the end of the period — no further charges.",
    noteCancelled: "The subscription has ended, and the guides are locked again.",
    notePastDue: "The last payment did not go through — update your payment method.",
    startTrial: "Start free trial",
    rowNextCharge: "Next charge",
    rowPaymentMethod: "Payment method",
    rowMemberSince: "Member since",
    nextChargeNone: "None — the subscription has ended",
    nextChargeEnding: "No further charges",
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
    emailCardNote:
      "This address comes from the Google account you sign in with, and cannot be changed here. Change it at Google and it follows.",
    signOutCardTitle: "Log out",
    signOutCardNote:
      "Signs you out on this device. The subscription carries on as before, and Google lets you back in whenever you like.",
    signOutCardAction: "Log out",
    aboutSubscription: "About the subscription",
  },
};

export function accountDict(lang: Lang): AccountDict {
  return pick(ACCOUNT, lang);
}
