import { Resend } from "resend";
import { PRICE, SITE, TRIAL_DAYS, env, isResendConfigured } from "@/lib/config";

/** Transactional email via Resend.
 *
 *  Three messages, all in Norwegian and in the product's voice: calm, factual,
 *  no exclamation marks, no marketing.
 *
 *  When `RESEND_API_KEY` is absent (demo mode) every function logs what it would
 *  have sent and resolves successfully. Nothing here ever throws — a failed
 *  receipt must never take down a Stripe webhook.
 */

export interface EmailResult {
  /** True when Resend accepted the message. */
  sent: boolean;
  /** True when Resend is not configured and the mail was only logged. */
  skipped: boolean;
  error?: string;
}

let cached: Resend | null = null;

function getResend(): Resend | null {
  if (!isResendConfigured) return null;
  cached ??= new Resend(env.resendApiKey);
  return cached;
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const dateFormat = new Intl.DateTimeFormat("nb-NO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** «12. august 2026». Returns null for missing or unparseable input. */
function formatDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormat.format(date);
}

/** Minor units to «29,00 kr». */
function formatAmount(minorUnits: number, currency = "nok"): string {
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: "code",
  })
    .format(minorUnits / 100)
    .replace(/\s*NOK\s*/, " kr")
    .trim();
}

function planLabel(plan: "maned" | "ar"): string {
  return plan === "ar" ? PRICE.yearly.planLabel : PRICE.monthly.planLabel;
}

function planPrice(plan: "maned" | "ar"): string {
  return plan === "ar"
    ? `${PRICE.yearly.label} ${PRICE.yearly.perLabel}`
    : `${PRICE.monthly.label} ${PRICE.monthly.perLabel}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ---------------------------------------------------------------------------
// Layout — the «Industry» design system, reduced to what email clients render:
// straight corners, one hairline border, one accent, no images, no webfonts.
// ---------------------------------------------------------------------------

const HAIRLINE = "#d8d8da";
const TEXT = "#1d1f20";
const MUTED = "#5d5d60";
const ACCENT = "#416180";
const BG = "#f2f2f3";
const FONT = "'Barlow', 'Helvetica Neue', Helvetica, Arial, sans-serif";

interface Row {
  label: string;
  value: string;
}

interface LayoutOptions {
  kicker: string;
  heading: string;
  intro: string;
  rows?: Row[];
  paragraphs?: string[];
  cta?: { label: string; href: string };
  footnote?: string;
}

function renderRows(rows: Row[]): string {
  return rows
    .map(
      (row) => `
        <tr>
          <td style="padding:11px 18px;border-top:1px solid ${HAIRLINE};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${MUTED};width:45%;">${escapeHtml(row.label)}</td>
          <td style="padding:11px 18px;border-top:1px solid ${HAIRLINE};font-size:15px;color:${TEXT};">${escapeHtml(row.value)}</td>
        </tr>`,
    )
    .join("");
}

function layout(options: LayoutOptions): string {
  const { kicker, heading, intro, rows = [], paragraphs = [], cta, footnote } = options;

  const rowsBlock = rows.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid ${HAIRLINE};border-collapse:collapse;margin:0 0 24px;">
         ${renderRows(rows).replace(`border-top:1px solid ${HAIRLINE};`, "")}
       </table>`
    : "";

  const paragraphsBlock = paragraphs
    .map(
      (text) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:24px;color:${TEXT};">${escapeHtml(text)}</p>`,
    )
    .join("");

  const ctaBlock = cta
    ? `<p style="margin:0 0 24px;">
         <a href="${escapeHtml(cta.href)}" style="display:inline-block;background:#5980a6;color:#ffffff;text-decoration:none;padding:12px 22px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;">${escapeHtml(cta.label)}</a>
       </p>`
    : "";

  const footnoteBlock = footnote
    ? `<p style="margin:0;font-size:13px;line-height:20px;color:${MUTED};">${escapeHtml(footnote)}</p>`
    : "";

  return `<div style="margin:0;padding:32px 16px;background:${BG};font-family:${FONT};">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:${BG};border-collapse:collapse;">
    <tr>
      <td style="padding:0 0 24px;font-size:14px;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;color:${TEXT};">${escapeHtml(SITE.name)}</td>
    </tr>
    <tr>
      <td style="border:1px solid ${HAIRLINE};padding:28px 24px;">
        <span style="display:block;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;color:${ACCENT};margin:0 0 10px;">${escapeHtml(kicker)}</span>
        <h1 style="margin:0 0 16px;font-size:26px;line-height:1.1;letter-spacing:0.02em;text-transform:uppercase;font-weight:600;color:${TEXT};">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 24px;font-size:15px;line-height:24px;color:${TEXT};">${escapeHtml(intro)}</p>
        ${rowsBlock}
        ${paragraphsBlock}
        ${ctaBlock}
        ${footnoteBlock}
      </td>
    </tr>
    <tr>
      <td style="padding:20px 0 0;border-top:1px solid ${HAIRLINE};font-size:12px;line-height:20px;color:${MUTED};">
        ${escapeHtml(SITE.name)} — ${escapeHtml(SITE.tagline)}<br>
        Du får denne e-posten fordi du har et abonnement hos ${escapeHtml(SITE.name)}.
      </td>
    </tr>
  </table>
</div>`;
}

/** Plain-text twin, so the message reads sensibly without HTML. */
function plain(options: LayoutOptions): string {
  const { heading, intro, rows = [], paragraphs = [], cta, footnote } = options;
  const parts: string[] = [heading.toUpperCase(), "", intro];
  if (rows.length) {
    parts.push("");
    rows.forEach((row) => parts.push(`${row.label}: ${row.value}`));
  }
  if (paragraphs.length) {
    parts.push("");
    parts.push(paragraphs.join("\n\n"));
  }
  if (cta) {
    parts.push("");
    parts.push(`${cta.label}: ${cta.href}`);
  }
  if (footnote) {
    parts.push("");
    parts.push(footnote);
  }
  parts.push("", `${SITE.name} — ${SITE.tagline}`);
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

async function send(to: string, subject: string, options: LayoutOptions): Promise<EmailResult> {
  const resend = getResend();

  if (!resend) {
    // Demo mode: no key configured. Log and carry on — never throw, never block
    // the caller (the Stripe webhook has to answer 200 either way).
    console.info(`[email] Resend er ikke konfigurert — hopper over «${subject}» til ${to}`);
    return { sent: false, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: env.fromEmail,
      to,
      subject,
      html: layout(options),
      text: plain(options),
    });
    if (error) {
      console.error(`[email] Resend avviste «${subject}» til ${to}:`, error.message);
      return { sent: false, skipped: false, error: error.message };
    }
    return { sent: true, skipped: false };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error(`[email] Klarte ikke å sende «${subject}» til ${to}:`, message);
    return { sent: false, skipped: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// The three messages
// ---------------------------------------------------------------------------

export interface WelcomeEmailInput {
  to: string;
  /** ISO date the trial ends. */
  trialEnd?: string | null;
  plan?: "maned" | "ar";
}

/** Sent when Stripe Checkout completes — the trial has started. */
export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<EmailResult> {
  const plan = input.plan ?? "maned";
  const trialEnd = formatDate(input.trialEnd);

  const rows: Row[] = [
    { label: "Abonnement", value: planLabel(plan) },
    { label: "Pris", value: planPrice(plan) },
  ];
  if (trialEnd) rows.push({ label: "Første trekk", value: trialEnd });

  return send(input.to, "Velkommen opp — prøveperioden har startet", {
    kicker: "Prøveperiode",
    heading: "Velkommen opp",
    intro: trialEnd
      ? `Prøveperioden er i gang og varer i ${TRIAL_DAYS} dager, til ${trialEnd}. Hele kartet og alle turguidene er åpne fra nå.`
      : `Prøveperioden er i gang og varer i ${TRIAL_DAYS} dager. Hele kartet og alle turguidene er åpne fra nå.`,
    rows,
    paragraphs: [
      "Turguidene gir deg rutebeskrivelse opp og ned, høydeprofil, GPX-fil og en gjennomgang av skredterrenget. Sjekk alltid dagens skredvarsel på varsom.no før du går.",
      "Du kan avslutte når som helst på Min side. Avslutter du i prøveperioden, blir du ikke belastet.",
    ],
    cta: { label: "Åpne kartet", href: `${env.siteUrl}/kart` },
    footnote: "Kvittering kommer på e-post ved hvert trekk. Ingen binding.",
  });
}

export interface ReceiptEmailInput {
  to: string;
  /** Amount in minor units (øre), as Stripe reports it. */
  amountTotal: number;
  /** ISO 4217, lowercase from Stripe. Defaults to nok. */
  currency?: string;
  /** Stripe invoice number, e.g. «A1B2C3D4-0001». */
  invoiceNumber?: string | null;
  /** ISO date the paid period runs to. */
  periodEnd?: string | null;
  hostedInvoiceUrl?: string | null;
  invoicePdf?: string | null;
  plan?: "maned" | "ar";
}

/** Sent on `invoice.paid` — and once at checkout, so the first charge is
 *  never a surprise. */
export async function sendReceiptEmail(input: ReceiptEmailInput): Promise<EmailResult> {
  const plan = input.plan ?? "maned";
  const amount = formatAmount(input.amountTotal, input.currency ?? "nok");
  const periodEnd = formatDate(input.periodEnd);

  const rows: Row[] = [
    { label: "Abonnement", value: planLabel(plan) },
    { label: "Beløp", value: amount },
  ];
  if (input.invoiceNumber) rows.push({ label: "Kvitteringsnummer", value: input.invoiceNumber });
  if (periodEnd) rows.push({ label: "Neste trekk", value: periodEnd });

  const paragraphs = ["Beløpet er trukket fra betalingskortet du registrerte hos Stripe."];
  if (input.invoicePdf) {
    paragraphs.push(`Kvitteringen som PDF: ${input.invoicePdf}`);
  }
  paragraphs.push("Du finner alle kvitteringer under «Kvitteringer» på Min side.");

  return send(input.to, `Kvittering fra ${SITE.name} — ${amount}`, {
    kicker: "Kvittering",
    heading: "Takk for betalingen",
    intro: `Vi har mottatt ${amount} for ${planLabel(plan).toLowerCase()}.`,
    rows,
    paragraphs,
    cta: {
      label: input.hostedInvoiceUrl ? "Se kvitteringen" : "Min side",
      href: input.hostedInvoiceUrl ?? `${env.siteUrl}/min-side`,
    },
    footnote: "Ingen binding. Du kan avslutte abonnementet når som helst på Min side.",
  });
}

export interface TrialEndingEmailInput {
  to: string;
  /** ISO date the trial ends. */
  trialEnd?: string | null;
  plan?: "maned" | "ar";
}

/** Sent a few days before the trial runs out. Stripe's
 *  `customer.subscription.trial_will_end` event is the natural trigger. */
export async function sendTrialEndingEmail(input: TrialEndingEmailInput): Promise<EmailResult> {
  const plan = input.plan ?? "maned";
  const trialEnd = formatDate(input.trialEnd);

  const rows: Row[] = [
    { label: "Abonnement", value: planLabel(plan) },
    { label: "Pris", value: planPrice(plan) },
  ];
  if (trialEnd) rows.push({ label: "Første trekk", value: trialEnd });

  return send(input.to, "Prøveperioden går mot slutten", {
    kicker: "Prøveperiode",
    heading: "Prøveperioden går mot slutten",
    intro: trialEnd
      ? `Prøveperioden din varer til ${trialEnd}. Da starter abonnementet, og kortet ditt blir belastet ${plan === "ar" ? PRICE.yearly.label : PRICE.monthly.label}.`
      : `Prøveperioden din nærmer seg slutten. Da starter abonnementet, og kortet ditt blir belastet ${plan === "ar" ? PRICE.yearly.label : PRICE.monthly.label}.`,
    rows,
    paragraphs: [
      "Vil du fortsette, trenger du ikke gjøre noe. Abonnementet løper videre, og du beholder tilgangen til kartet og turguidene.",
      "Vil du ikke fortsette, avslutter du på Min side før prøveperioden er ute. Da blir du ikke belastet, og du beholder tilgangen ut perioden.",
    ],
    cta: { label: "Min side", href: `${env.siteUrl}/min-side` },
    footnote: "Ingen binding.",
  });
}
