import { Resend } from "resend";
import { PRICE, SITE, TRIAL_DAYS, adminEmails, env, isResendConfigured } from "@/lib/config";
import { htmlLang, type Lang } from "@/lib/i18n";
import { siteMeta } from "@/lib/i18n/common";
import { systemDict } from "@/lib/i18n/system";

/** Transactional email via Resend.
 *
 *  Three messages to readers, in the product's voice: calm, factual, no
 *  exclamation marks, no marketing. Each one is written in the reader's
 *  language — every send function takes an optional `lang`, defaulting to
 *  Norwegian so a caller that has no language to hand keeps sending exactly
 *  what it always sent.
 *
 *  And one to the operator: `sendFeedbackNotice`. It is the odd one out on
 *  purpose — always Norwegian, addressed off `ADMIN_EMAILS` rather than to a
 *  subscriber, and the only message that carries text somebody else wrote.
 *  That last part is why every string the layout renders goes through
 *  `escapeHtml`; it did before, but now it matters.
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

const dateFormat: Record<Lang, Intl.DateTimeFormat> = {
  no: new Intl.DateTimeFormat(htmlLang("no"), { day: "numeric", month: "long", year: "numeric" }),
  en: new Intl.DateTimeFormat(htmlLang("en"), { day: "numeric", month: "long", year: "numeric" }),
};

/** «12. august 2026» / «12 August 2026». Returns null for missing or
 *  unparseable input. */
function formatDate(value: string | Date | null | undefined, lang: Lang): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return dateFormat[lang].format(date);
}

/** Minor units to «29,00 kr» / «29.00 kr». The currency stays NOK in both
 *  languages — it is what the card is charged, not copy — so English only
 *  changes the decimal separator and grouping. */
function formatAmount(minorUnits: number, currency: string, lang: Lang): string {
  if (lang === "no") {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: currency.toUpperCase(),
      currencyDisplay: "code",
    })
      .format(minorUnits / 100)
      .replace(/\s*NOK\s*/, " kr")
      .trim();
  }
  const amount = new Intl.NumberFormat(htmlLang(lang), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
  return `${amount} ${currency.toLowerCase() === "nok" ? "kr" : currency.toUpperCase()}`;
}

/** The Norwegian plan names live in `PRICE` — they are product constants, not
 *  copy — so only the English half comes from the dictionary. */
function planLabel(plan: "maned" | "ar", lang: Lang): string {
  if (lang === "no") return plan === "ar" ? PRICE.yearly.planLabel : PRICE.monthly.planLabel;
  const t = systemDict(lang);
  return plan === "ar" ? t.emailPlanYearly : t.emailPlanMonthly;
}

function planPrice(plan: "maned" | "ar", lang: Lang): string {
  if (lang === "no") {
    return plan === "ar"
      ? `${PRICE.yearly.label} ${PRICE.yearly.perLabel}`
      : `${PRICE.monthly.label} ${PRICE.monthly.perLabel}`;
  }
  const t = systemDict(lang);
  return plan === "ar"
    ? `${PRICE.yearly.label} ${t.emailPerYear}`
    : `${PRICE.monthly.label} ${t.emailPerMonth}`;
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
  /** Overrides «Du får denne e-posten fordi du har et abonnement hos …» in the
   *  footer. The default is true of the three messages that go to readers and
   *  false of the one that goes to the operator, who gets it because the
   *  address is in `ADMIN_EMAILS`. */
  reason?: string;
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

function layout(options: LayoutOptions, lang: Lang): string {
  const { kicker, heading, intro, rows = [], paragraphs = [], cta, footnote, reason } = options;
  const site = siteMeta(lang);
  const t = systemDict(lang);

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
      <td style="padding:0 0 24px;font-size:14px;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;color:${TEXT};">${escapeHtml(site.name)}</td>
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
        ${escapeHtml(site.name)} — ${escapeHtml(site.tagline)}<br>
        ${escapeHtml(reason ?? t.emailFooterReason(site.name))}<br>
        ${escapeHtml(t.emailFooterSupport)} <a href="mailto:${escapeHtml(SITE.supportEmail)}" style="color:${MUTED};">${escapeHtml(SITE.supportEmail)}</a>
      </td>
    </tr>
  </table>
</div>`;
}

/** Plain-text twin, so the message reads sensibly without HTML. */
function plain(options: LayoutOptions, lang: Lang): string {
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
  const site = siteMeta(lang);
  const t = systemDict(lang);
  parts.push("", `${site.name} — ${site.tagline}`);
  parts.push(`${t.emailFooterSupport} ${SITE.supportEmail}`);
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Send
// ---------------------------------------------------------------------------

async function send(
  to: string,
  subject: string,
  options: LayoutOptions,
  lang: Lang,
  /** Overrides the support mailbox. The feedback notice sets it to the reader
   *  who wrote in, so «svar» goes to the person with the question rather than
   *  to the shared box the operator is already reading. */
  replyTo?: string,
): Promise<EmailResult> {
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
      // Sent from a no-reply address, so point replies at the support mailbox
      // rather than letting them fall into a box nobody opens.
      replyTo: replyTo || SITE.supportEmail,
      to,
      subject,
      html: layout(options, lang),
      text: plain(options, lang),
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
// The three messages to readers
// ---------------------------------------------------------------------------

export interface WelcomeEmailInput {
  to: string;
  /** ISO date the trial ends. */
  trialEnd?: string | null;
  plan?: "maned" | "ar";
  /** Language the message is written in. Norwegian unless told otherwise. */
  lang?: Lang;
}

/** Sent when Stripe Checkout completes — the trial has started. */
export async function sendWelcomeEmail(input: WelcomeEmailInput): Promise<EmailResult> {
  const lang: Lang = input.lang ?? "no";
  const t = systemDict(lang);
  const plan = input.plan ?? "maned";
  const trialEnd = formatDate(input.trialEnd, lang);

  const rows: Row[] = [
    { label: t.emailRowPlan, value: planLabel(plan, lang) },
    { label: t.emailRowPrice, value: planPrice(plan, lang) },
  ];
  if (trialEnd) rows.push({ label: t.emailRowFirstCharge, value: trialEnd });

  return send(
    input.to,
    t.welcomeSubject,
    {
      kicker: t.welcomeKicker,
      heading: t.welcomeHeading,
      intro: t.welcomeIntro(TRIAL_DAYS, trialEnd),
      rows,
      paragraphs: [t.welcomeBodyGuides, t.welcomeBodyCancel],
      cta: { label: t.welcomeCta, href: `${env.siteUrl}/kart` },
      footnote: t.welcomeFootnote,
    },
    lang,
  );
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
  /** Language the message is written in. Norwegian unless told otherwise. */
  lang?: Lang;
}

/** Sent on `invoice.paid` — and once at checkout, so the first charge is
 *  never a surprise. */
export async function sendReceiptEmail(input: ReceiptEmailInput): Promise<EmailResult> {
  const lang: Lang = input.lang ?? "no";
  const t = systemDict(lang);
  const plan = input.plan ?? "maned";
  const amount = formatAmount(input.amountTotal, input.currency ?? "nok", lang);
  const periodEnd = formatDate(input.periodEnd, lang);

  const rows: Row[] = [
    { label: t.emailRowPlan, value: planLabel(plan, lang) },
    { label: t.emailRowAmount, value: amount },
  ];
  if (input.invoiceNumber) rows.push({ label: t.emailRowReceiptNumber, value: input.invoiceNumber });
  if (periodEnd) rows.push({ label: t.emailRowNextCharge, value: periodEnd });

  const paragraphs = [t.receiptBodyCharged];
  if (input.invoicePdf) {
    paragraphs.push(t.receiptBodyPdf(input.invoicePdf));
  }
  paragraphs.push(t.receiptBodyArchive);

  return send(
    input.to,
    t.receiptSubject(siteMeta(lang).name, amount),
    {
      kicker: t.receiptKicker,
      heading: t.receiptHeading,
      intro: t.receiptIntro(amount, planLabel(plan, lang)),
      rows,
      paragraphs,
      cta: {
        label: input.hostedInvoiceUrl ? t.receiptCtaInvoice : t.receiptCtaAccount,
        href: input.hostedInvoiceUrl ?? `${env.siteUrl}/min-side`,
      },
      footnote: t.receiptFootnote,
    },
    lang,
  );
}

export interface TrialEndingEmailInput {
  to: string;
  /** ISO date the trial ends. */
  trialEnd?: string | null;
  plan?: "maned" | "ar";
  /** Language the message is written in. Norwegian unless told otherwise. */
  lang?: Lang;
}

/** Sent a few days before the trial runs out. Stripe's
 *  `customer.subscription.trial_will_end` event is the natural trigger. */
export async function sendTrialEndingEmail(input: TrialEndingEmailInput): Promise<EmailResult> {
  const lang: Lang = input.lang ?? "no";
  const t = systemDict(lang);
  const plan = input.plan ?? "maned";
  const trialEnd = formatDate(input.trialEnd, lang);

  const rows: Row[] = [
    { label: t.emailRowPlan, value: planLabel(plan, lang) },
    { label: t.emailRowPrice, value: planPrice(plan, lang) },
  ];
  if (trialEnd) rows.push({ label: t.emailRowFirstCharge, value: trialEnd });

  return send(
    input.to,
    t.trialEndingSubject,
    {
      kicker: t.trialEndingKicker,
      heading: t.trialEndingHeading,
      intro: t.trialEndingIntro(
        trialEnd,
        plan === "ar" ? PRICE.yearly.label : PRICE.monthly.label,
      ),
      rows,
      paragraphs: [t.trialEndingBodyContinue, t.trialEndingBodyCancel],
      cta: { label: t.trialEndingCta, href: `${env.siteUrl}/min-side` },
      footnote: t.trialEndingFootnote,
    },
    lang,
  );
}

// ---------------------------------------------------------------------------
// The operator's notice
// ---------------------------------------------------------------------------

export interface FeedbackNoticeInput {
  /** What the reader wrote. Passed through the layout's escaping like any other
   *  string — see `escapeHtml` — so it may contain anything a text area can. */
  message: string;
  /** The reader's address, when there was a session. Feedback does not require
   *  one, and the people worth hearing from are often the ones who never signed
   *  up, so this is frequently null. */
  from?: string | null;
  /** Which page they were on when they wrote. */
  path?: string | null;
  /** The language *they* were reading in — a fact about the reader, not the
   *  language this notice is written in. */
  readerLang?: Lang;
  /** Origin to build the admin link from, read off the request so a preview
   *  deployment links to itself rather than to production. */
  origin?: string;
}

/** Tell the operator that feedback landed.
 *
 *  Written in Norwegian regardless of the reader's language, because it is not
 *  product copy: it goes to whoever is in `ADMIN_EMAILS`, and there is no
 *  language preference stored for them to honour. The reader's own language is
 *  a row in the table instead, since it decides which language to answer in.
 *
 *  Nothing here is allowed to matter to the reader. `/api/tilbakemelding` has
 *  already written the row by the time this runs, and the submission is a
 *  success whether or not the notice goes out — see the call site.
 */
export async function sendFeedbackNotice(input: FeedbackNoticeInput): Promise<EmailResult> {
  const recipients = adminEmails();
  if (!recipients.length) {
    // Not a misconfiguration worth shouting about: a deployment with no admins
    // listed is one where nobody asked to be told.
    return { sent: false, skipped: true };
  }

  const origin = input.origin || env.siteUrl;
  const rows: Row[] = [
    { label: "Fra", value: input.from || "Ikke innlogget" },
    { label: "Side", value: input.path || "Ukjent" },
    { label: "Språk", value: input.readerLang === "en" ? "Engelsk" : "Norsk" },
  ];

  /* One send per admin rather than one with everybody in `to`: a single bad
     address in the list would otherwise take the whole notice with it. */
  const results = await Promise.all(
    recipients.map((to) =>
      send(
        to,
        "Ny tilbakemelding på Toppkart",
        {
          kicker: "Tilbakemelding",
          heading: "Noen skrev inn",
          intro: input.from
            ? `${input.from} har sendt en tilbakemelding.`
            : "En leser uten konto har sendt en tilbakemelding.",
          rows,
          paragraphs: [input.message],
          cta: { label: "Åpne tilbakemeldingene", href: `${origin}/admin/tilbakemeldinger` },
          reason: "Du får denne e-posten fordi adressen din står i ADMIN_EMAILS.",
        },
        "no",
        // Reply goes to the reader when there is one to reply to.
        input.from ?? undefined,
      ),
    ),
  );

  return {
    sent: results.some((r) => r.sent),
    skipped: results.every((r) => r.skipped),
  };
}
