import { Resend } from "resend";

import { SITE, adminEmailList, env, isResendConfigured } from "@/lib/config";

/** Operational alerts — the one thing in this app that fails expensively and
 *  silently, given a way to say so.
 *
 *  The failure this exists for: the Stripe webhook is the only writer of
 *  `tk_subscriptions`. If it cannot resolve which user a `checkout.session.completed`
 *  belongs to, it logs and answers 200 — deliberately, because Stripe would
 *  otherwise retry a delivery for days whose outcome can never change. But the
 *  reader on the other end has a card that was charged and an account with no
 *  subscription row, and until now the only trace was a line in the Vercel log
 *  that nobody is watching at two in the morning. Everything else in the system
 *  is visible to the person it happens to; this is the case where the only
 *  person who *can* see it is the operator.
 *
 *  This is not error tracking. There are no stack traces, no grouping, no
 *  history — it sends a mail. If the site ever wants tracing, Sentry is the
 *  answer and this module is the thing it replaces. Until then, mail to
 *  `ADMIN_EMAILS` costs one dependency the app already has and covers the case
 *  that actually costs money.
 *
 *  **Nothing here throws.** An alert that takes down the handler it was warning
 *  about is worse than no alert at all, so every path returns quietly.
 */

let cached: Resend | null = null;

function getResend(): Resend | null {
  if (!isResendConfigured) return null;
  cached ??= new Resend(env.resendApiKey);
  return cached;
}

/** Alerts already sent, by key, with the time they went out.
 *
 *  A failing dependency does not fail once. Supabase being unreachable for a
 *  minute is a hundred Stripe retries, and a hundred identical mails is how an
 *  operator learns to filter the alert address into a folder they never open —
 *  at which point this module is worse than useless, because it looks like it
 *  is working.
 *
 *  Per instance and in memory, which is the honest limitation: on Vercel each
 *  lambda holds its own map, so a storm spread over several instances sends one
 *  mail each rather than one in total. That still turns a hundred into a
 *  handful, and the alternative — a shared counter in Postgres — puts a write
 *  in the path of the code that runs when Postgres is the thing that is
 *  broken. */
const lastSent = new Map<string, number>();
const THROTTLE_MS = 10 * 60 * 1000;

function throttled(key: string, now: number): boolean {
  const previous = lastSent.get(key);
  if (previous !== undefined && now - previous < THROTTLE_MS) return true;
  lastSent.set(key, now);
  /* Uten dette vokser kartet med én nøkkel per hendelsestype for alltid. Det er
     en håndfull nøkler i praksis, men en lekkasje er en lekkasje. */
  for (const [entry, time] of lastSent) {
    if (now - time > THROTTLE_MS) lastSent.delete(entry);
  }
  return false;
}

export interface AlertInput {
  /** Kort emne, uten prefiks — «Stripe-webhook feilet» holder. */
  subject: string;
  /** Hva som skjedde, i klartekst. Én linje per punkt. */
  lines: string[];
  /** Throttle-nøkkel. Hendelser som er *samme sak* skal dele nøkkel, ellers blir
   *  demningen aldri tett. Standard er emnet. */
  key?: string;
}

/** Sends an operational alert, or explains in the log why it did not.
 *
 *  Deliberately fire-and-forget from the caller's point of view: it is awaited
 *  so the lambda does not get frozen mid-send, but its result is not something
 *  any caller should branch on. */
export async function alertOps({ subject, lines, key }: AlertInput): Promise<void> {
  try {
    const recipients = adminEmailList();
    const body = lines.join("\n");

    /* Loggen skrives uansett, og først. Den er den eneste kanalen som virker når
       ADMIN_EMAILS ikke er satt, når Resend mangler nøkkel, og når det er
       Resend selv som er nede. */
    console.error(`[alert] ${subject}\n${body}`);

    if (!recipients.length) {
      console.warn("[alert] ADMIN_EMAILS er ikke satt — varselet ble bare logget");
      return;
    }

    const resend = getResend();
    if (!resend) {
      console.warn("[alert] RESEND_API_KEY mangler — varselet ble bare logget");
      return;
    }

    if (throttled(key ?? subject, Date.now())) return;

    const { error } = await resend.emails.send({
      from: env.fromEmail,
      replyTo: SITE.supportEmail,
      to: recipients,
      subject: `[Toppkart] ${subject}`,
      /* Ren tekst, ingen mal. Dette er drift, ikke produkt: mottakeren er den
         som skal fikse det, og skal kunne lime linjene rett inn i et søk. */
      text: `${body}\n\n—\n${env.siteUrl}\n`,
    });
    if (error) console.error("[alert] Resend avviste varselet:", error.message);
  } catch (error) {
    /* Siste skanse. Kommer vi hit, er det varselet selv som er i stykker, og da
       er det viktigste at kalleren aldri merker det. */
    console.error("[alert] varslingen feilet:", error instanceof Error ? error.message : error);
  }
}
