/** NO/EN strings for the floating «Gi tilbakemelding» button and its dialog.
 *
 *  Same voice as the rest: calm, factual, no exclamation marks. The failure
 *  copy matters more than usual here — if the send fails, the reader has just
 *  written something and must not be left thinking it arrived. Every failure
 *  path names the support address so the text can still get somewhere. */

import { SITE } from "@/lib/config";
import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface FeedbackDict {
  /** Floating button, and the dialog's accessible name. */
  open: string;
  title: string;
  intro: string;
  label: string;
  placeholder: string;
  /** Shown under the textarea when signed in. */
  fromSignedIn: (email: string) => string;
  fromAnonymous: string;
  send: string;
  sending: string;
  cancel: string;
  close: string;
  doneTitle: string;
  doneBody: string;
  errorEmpty: string;
  errorTooLong: string;
  /** Too many messages from the same sender inside the hour.
   *
   *  Written for the person who hits it by accident rather than the one it is
   *  aimed at, because those are the only two people who ever see it and only
   *  one of them is reading. It says the text is not lost and names the address
   *  that has no limit on it. */
  errorTooMany: string;
  /** Resend not configured, or it rejected the message. */
  errorUnsent: string;
}

const FEEDBACK: Translated<FeedbackDict> = {
  no: {
    open: "Gi tilbakemelding",
    title: "Gi tilbakemelding",
    intro:
      "Fant du noe som er feil, uklart eller mangler? Skriv det her — det går rett til den som lager Toppkart.",
    label: "Hva vil du si?",
    placeholder: "Skriv det som det er.",
    fromSignedIn: (email) => `Sendes fra ${email}, så du kan få svar.`,
    fromAnonymous: `Du er ikke innlogget, så vi har ingen adresse å svare på. Vil du ha svar, skriv til ${SITE.supportEmail} i stedet.`,
    send: "Send",
    sending: "Sender…",
    cancel: "Avbryt",
    close: "Lukk",
    doneTitle: "Takk",
    doneBody: "Den er mottatt, og den blir lest.",
    errorEmpty: "Skriv noe først.",
    errorTooLong: "Det ble litt langt. Kort det ned, eller send det på e-post.",
    errorTooMany: `Du har sendt en del den siste timen. Teksten står igjen i feltet — vent litt, eller send den til ${SITE.supportEmail}.`,
    errorUnsent: `Vi fikk ikke sendt den. Teksten står igjen i feltet — kopier den og send til ${SITE.supportEmail}.`,
  },
  en: {
    open: "Give feedback",
    title: "Give feedback",
    intro:
      "Found something wrong, unclear or missing? Write it here — it goes straight to the person who makes Toppkart.",
    label: "What would you like to say?",
    placeholder: "Say it plainly.",
    fromSignedIn: (email) => `Sent from ${email}, so you can get a reply.`,
    fromAnonymous: `You are not signed in, so we have no address to reply to. If you want an answer, write to ${SITE.supportEmail} instead.`,
    send: "Send",
    sending: "Sending…",
    cancel: "Cancel",
    close: "Close",
    doneTitle: "Thank you",
    doneBody: "It arrived, and it will be read.",
    errorEmpty: "Write something first.",
    errorTooLong: "That got a bit long. Shorten it, or send it by e-mail.",
    errorTooMany: `You have sent a fair few in the last hour. Your text is still in the field — wait a while, or send it to ${SITE.supportEmail}.`,
    errorUnsent: `We could not send it. Your text is still in the field — copy it and send it to ${SITE.supportEmail}.`,
  },
};

export function feedbackDict(lang: Lang): FeedbackDict {
  return pick(FEEDBACK, lang);
}

/** Longest message the API accepts. Anything past this is a pasted document,
 *  not feedback, and e-mail is the better channel for it. */
export const FEEDBACK_MAX_LENGTH = 4000;
