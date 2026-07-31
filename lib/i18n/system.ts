/** NO/EN dictionary for the system surfaces — the pages the reader never asks
 *  for (404, unexpected error), the sign-in endpoint's replies, and the
 *  transactional email sent by `lib/email.ts`.
 *
 *  These strings sit outside the marketing pages, but they are still read by
 *  the same person, so they follow the same voice: calm, factual, no
 *  exclamation marks. Strings that interpolate runtime values are exposed as
 *  small functions rather than templates with placeholders, so the argument
 *  order is checked by the compiler.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface SystemDict {
  /* — 404 — */
  notFoundMetaTitle: string;
  notFoundKicker: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundMap: string;
  notFoundHome: string;
  /* — unexpected error — */
  errorKicker: string;
  errorTitle: string;
  errorBody: string;
  errorRetry: string;
  errorMap: string;
  /* — email: shared chrome — */
  emailFooterReason: (site: string) => string;
  emailPlanMonthly: string;
  emailPlanYearly: string;
  emailPerMonth: string;
  emailPerYear: string;
  emailRowPlan: string;
  emailRowPrice: string;
  emailRowAmount: string;
  emailRowReceiptNumber: string;
  emailRowFirstCharge: string;
  emailRowNextCharge: string;
  /* — email: welcome — */
  welcomeSubject: string;
  welcomeKicker: string;
  welcomeHeading: string;
  welcomeIntro: (days: number, trialEnd: string | null) => string;
  welcomeBodyGuides: string;
  welcomeBodyCancel: string;
  welcomeCta: string;
  welcomeFootnote: string;
  /* — email: receipt — */
  receiptSubject: (site: string, amount: string) => string;
  receiptKicker: string;
  receiptHeading: string;
  receiptIntro: (amount: string, plan: string) => string;
  receiptBodyCharged: string;
  receiptBodyPdf: (url: string) => string;
  receiptBodyArchive: string;
  receiptCtaInvoice: string;
  receiptCtaAccount: string;
  receiptFootnote: string;
  /* — email: trial ending — */
  trialEndingSubject: string;
  trialEndingKicker: string;
  trialEndingHeading: string;
  trialEndingIntro: (trialEnd: string | null, price: string) => string;
  trialEndingBodyContinue: string;
  trialEndingBodyCancel: string;
  trialEndingCta: string;
  trialEndingFootnote: string;
}

const SYSTEM: Translated<SystemDict> = {
  no: {
    notFoundMetaTitle: "Siden finnes ikke",
    notFoundKicker: "Feil 404",
    notFoundTitle: "Utenfor kartet",
    notFoundBody:
      "Siden du leter etter finnes ikke. Den kan ha flyttet seg, eller lenken kan være skrevet feil.",
    notFoundMap: "Åpne kartet",
    notFoundHome: "Til forsiden",
    errorKicker: "Noe gikk galt",
    errorTitle: "Uventet feil",
    errorBody:
      "Vi klarte ikke å laste siden. Prøv på nytt — hjelper det ikke, gå tilbake til kartet.",
    errorRetry: "Prøv på nytt",
    errorMap: "Åpne kartet",
    emailFooterReason: (site) => `Du får denne e-posten fordi du har et abonnement hos ${site}.`,
    emailPlanMonthly: "Toppkart månedlig",
    emailPlanYearly: "Toppkart årlig",
    emailPerMonth: "per måned",
    emailPerYear: "per år — to måneder gratis",
    emailRowPlan: "Abonnement",
    emailRowPrice: "Pris",
    emailRowAmount: "Beløp",
    emailRowReceiptNumber: "Kvitteringsnummer",
    emailRowFirstCharge: "Første trekk",
    emailRowNextCharge: "Neste trekk",
    welcomeSubject: "Velkommen opp — prøveperioden har startet",
    welcomeKicker: "Prøveperiode",
    welcomeHeading: "Velkommen opp",
    welcomeIntro: (days, trialEnd) =>
      trialEnd
        ? `Prøveperioden er i gang og varer i ${days} dager, til ${trialEnd}. Hele kartet og alle turguidene er åpne fra nå.`
        : `Prøveperioden er i gang og varer i ${days} dager. Hele kartet og alle turguidene er åpne fra nå.`,
    welcomeBodyGuides:
      "Turguidene gir deg rutebeskrivelse opp og ned, høydeprofil, GPX-fil og en gjennomgang av skredterrenget. Sjekk alltid dagens skredvarsel på varsom.no før du går.",
    welcomeBodyCancel:
      "Du kan avslutte når som helst på Min side. Avslutter du i prøveperioden, blir du ikke belastet.",
    welcomeCta: "Åpne kartet",
    welcomeFootnote: "Kvittering kommer på e-post ved hvert trekk. Ingen binding.",
    receiptSubject: (site, amount) => `Kvittering fra ${site} — ${amount}`,
    receiptKicker: "Kvittering",
    receiptHeading: "Takk for betalingen",
    receiptIntro: (amount, plan) => `Vi har mottatt ${amount} for ${plan.toLowerCase()}.`,
    receiptBodyCharged: "Beløpet er trukket fra betalingskortet du registrerte hos Stripe.",
    receiptBodyPdf: (url) => `Kvitteringen som PDF: ${url}`,
    receiptBodyArchive: "Du finner alle kvitteringer under «Kvitteringer» på Min side.",
    receiptCtaInvoice: "Se kvitteringen",
    receiptCtaAccount: "Min side",
    receiptFootnote: "Ingen binding. Du kan avslutte abonnementet når som helst på Min side.",
    trialEndingSubject: "Prøveperioden går mot slutten",
    trialEndingKicker: "Prøveperiode",
    trialEndingHeading: "Prøveperioden går mot slutten",
    trialEndingIntro: (trialEnd, price) =>
      trialEnd
        ? `Prøveperioden din varer til ${trialEnd}. Da starter abonnementet, og kortet ditt blir belastet ${price}.`
        : `Prøveperioden din nærmer seg slutten. Da starter abonnementet, og kortet ditt blir belastet ${price}.`,
    trialEndingBodyContinue:
      "Vil du fortsette, trenger du ikke gjøre noe. Abonnementet løper videre, og du beholder tilgangen til kartet og turguidene.",
    trialEndingBodyCancel:
      "Vil du ikke fortsette, avslutter du på Min side før prøveperioden er ute. Da blir du ikke belastet, og du beholder tilgangen ut perioden.",
    trialEndingCta: "Min side",
    trialEndingFootnote: "Ingen binding.",
  },
  en: {
    notFoundMetaTitle: "Page not found",
    notFoundKicker: "Error 404",
    notFoundTitle: "Off the map",
    notFoundBody:
      "The page you are looking for does not exist. It may have moved, or the link may be mistyped.",
    notFoundMap: "Open the map",
    notFoundHome: "Back to the front page",
    errorKicker: "Something went wrong",
    errorTitle: "Unexpected error",
    errorBody:
      "We could not load the page. Try again — if that does not help, head back to the map.",
    errorRetry: "Try again",
    errorMap: "Open the map",
    emailFooterReason: (site) => `You are getting this email because you have a ${site} subscription.`,
    emailPlanMonthly: "Toppkart monthly",
    emailPlanYearly: "Toppkart yearly",
    emailPerMonth: "per month",
    emailPerYear: "per year — two months free",
    emailRowPlan: "Subscription",
    emailRowPrice: "Price",
    emailRowAmount: "Amount",
    emailRowReceiptNumber: "Receipt number",
    emailRowFirstCharge: "First charge",
    emailRowNextCharge: "Next charge",
    welcomeSubject: "Welcome up — your trial has started",
    welcomeKicker: "Free trial",
    welcomeHeading: "Welcome up",
    welcomeIntro: (days, trialEnd) =>
      trialEnd
        ? `Your trial is running and lasts ${days} days, until ${trialEnd}. The whole map and every guide are open to you from now.`
        : `Your trial is running and lasts ${days} days. The whole map and every guide are open to you from now.`,
    welcomeBodyGuides:
      "Each guide gives you the route up and down, an elevation profile, a GPX file and a walk-through of the avalanche terrain. Always check the day's avalanche forecast at varsom.no before you set off.",
    welcomeBodyCancel:
      "You can cancel whenever you like from My account. Cancel during the trial and you are never charged.",
    welcomeCta: "Open the map",
    welcomeFootnote: "We email a receipt for every charge. No lock-in.",
    receiptSubject: (site, amount) => `Receipt from ${site} — ${amount}`,
    receiptKicker: "Receipt",
    receiptHeading: "Thank you for your payment",
    receiptIntro: (amount, plan) => `We have received ${amount} for ${plan}.`,
    receiptBodyCharged: "The amount was charged to the card you registered with Stripe.",
    receiptBodyPdf: (url) => `The receipt as a PDF: ${url}`,
    receiptBodyArchive: "Every receipt is kept under “Receipts” on My account.",
    receiptCtaInvoice: "View the receipt",
    receiptCtaAccount: "My account",
    receiptFootnote: "No lock-in. You can cancel your subscription whenever you like from My account.",
    trialEndingSubject: "Your trial is coming to an end",
    trialEndingKicker: "Free trial",
    trialEndingHeading: "Your trial is coming to an end",
    trialEndingIntro: (trialEnd, price) =>
      trialEnd
        ? `Your trial runs until ${trialEnd}. After that the subscription starts and your card is charged ${price}.`
        : `Your trial is nearly over. After that the subscription starts and your card is charged ${price}.`,
    trialEndingBodyContinue:
      "If you want to carry on, there is nothing to do. The subscription continues and you keep access to the map and the guides.",
    trialEndingBodyCancel:
      "If you would rather stop, cancel from My account before the trial runs out. You are not charged, and you keep access for the rest of the period.",
    trialEndingCta: "My account",
    trialEndingFootnote: "No lock-in.",
  },
};

export function systemDict(lang: Lang): SystemDict {
  return pick(SYSTEM, lang);
}
