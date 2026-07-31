import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getViewer } from "@/lib/access";
import { getInvoices } from "@/lib/invoices";
import { formatDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { accountDict, type AccountDict } from "@/lib/i18n/account";
import { commonDict } from "@/lib/i18n/common";
import type { Subscription } from "@/lib/types";
import { EmailCard } from "./EmailCard";
import { SubscriptionActions } from "./SubscriptionActions";

export async function generateMetadata(): Promise<Metadata> {
  const t = accountDict(await getLang());
  return { title: t.accountMetaTitle, description: t.accountMetaDescription };
}

const MUTED_70 = "color-mix(in srgb, var(--color-text) 70%, transparent)";
const MUTED_60 = "color-mix(in srgb, var(--color-text) 60%, transparent)";
const HAIRLINE = "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)";

/** The plate is a *view* of the subscription: `cancelled` folds together a
 *  canceled status and one that merely ends at period end. The underlying
 *  `Subscription["status"]` values are never rewritten. */
type PlateState = "none" | "trialing" | "active" | "cancelled" | "past_due";

function stateOf(sub: Subscription | null): PlateState {
  if (!sub || sub.status === "none") return "none";
  if (sub.status === "canceled" || sub.cancelAtPeriodEnd) return "cancelled";
  if (sub.status === "trialing") return "trialing";
  if (sub.status === "past_due") return "past_due";
  return "active";
}

function dateLabel(iso: string | null | undefined, lang: Lang): string | null {
  return iso ? formatDate(iso, lang) : null;
}

function cardLabel(method: Subscription["paymentMethod"], t: AccountDict): string {
  if (!method) return t.noPaymentMethod;
  const month = String(method.expMonth).padStart(2, "0");
  const year = String(method.expYear).slice(-2);
  return t.cardLine(method.brand, method.last4, `${month}/${year}`);
}

export default async function MinSidePage() {
  const viewer = await getViewer();
  if (!viewer.userId) redirect("/logg-inn?next=/min-side");

  const lang = await getLang();
  const t = accountDict(lang);
  const c = commonDict(lang);

  const sub = viewer.subscription;
  const state = stateOf(sub);
  const yearly = sub?.plan === "ar";
  const priceLabel = yearly ? "290 kr" : "29 kr";
  const planTitle = t.planTitle(yearly ? t.pricePerYear : t.pricePerMonth);

  const trialDate = dateLabel(sub?.trialEnd ?? sub?.currentPeriodEnd, lang);
  const periodDate = dateLabel(sub?.currentPeriodEnd, lang);
  const dialogDate = (state === "trialing" ? trialDate : periodDate) ?? t.periodEndFallback;

  const plate: { label: string; tag: string; note: string } = {
    none: {
      label: t.statusNone,
      tag: "tag-neutral",
      note: t.noteNone,
    },
    trialing: {
      label: t.statusTrialing,
      tag: "tag-accent",
      note: trialDate
        ? t.noteTrialUntil(trialDate, yearly ? t.pricePerYear : t.pricePerMonth)
        : t.noteTrial(yearly ? t.pricePerYear : t.pricePerMonth),
    },
    active: {
      label: t.statusActive,
      tag: "tag-accent",
      note: yearly ? t.noteRenewsYearly : t.noteRenewsMonthly,
    },
    cancelled: {
      label: t.statusCancelled,
      tag: "tag-neutral",
      note: t.noteCancelled,
    },
    past_due: {
      label: t.statusPastDue,
      tag: "tag-neutral",
      note: t.notePastDue,
    },
  }[state];

  const nextCharge =
    state === "cancelled"
      ? t.nextChargeNone
      : state === "trialing"
        ? trialDate
          ? t.nextChargeOn(priceLabel, trialDate)
          : t.nextChargeAfterTrial(priceLabel)
        : periodDate
          ? t.nextChargeOn(priceLabel, periodDate)
          : t.nextChargeAtRenewal(priceLabel);

  const subRows: { l: string; v: string }[] = [
    { l: t.rowNextCharge, v: nextCharge },
    { l: t.rowPaymentMethod, v: cardLabel(sub?.paymentMethod ?? null, t) },
    { l: t.rowMemberSince, v: dateLabel(sub?.memberSince, lang) ?? "—" },
  ];

  const invoices = await getInvoices(viewer, lang);

  return (
    <div className="shell">
      <SiteNav lang={lang}>
        <Link href="/kart">{c.map}</Link>
        <Link href="/min-side" aria-current="page" style={{ color: "var(--color-accent-700)" }}>
          {c.account}
        </Link>
        <form action="/api/auth/signout" method="post" style={{ display: "flex", margin: 0 }}>
          <button
            type="submit"
            className="nav-muted"
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              font: "inherit",
              cursor: "pointer",
            }}
          >
            {c.logout}
          </button>
        </form>
      </SiteNav>

      <main className="page page-account">
        <header style={{ padding: "56px 0 40px" }}>
          <h1 className="display" style={{ fontSize: "clamp(38px, 5vw, 56px)" }}>
            {t.accountHeading}
          </h1>
          <p style={{ fontSize: 15, lineHeight: "24px", margin: "14px 0 0", color: MUTED_70 }}>
            {t.signedInAs} <strong style={{ color: "var(--color-text)" }}>{viewer.email}</strong>
          </p>
        </header>

        <section style={{ padding: "0 0 48px" }}>
          <SectionKicker>{t.kickerSubscription}</SectionKicker>
          <Blueprint>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
                alignItems: "center",
                padding: "20px 24px",
                borderBottom: "1px solid var(--color-divider)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginRight: "auto" }}>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: 26,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  {planTitle}
                </span>
                <span style={{ fontSize: 14, color: MUTED_70 }}>{plate.note}</span>
              </div>
              <span
                className={`tag ${plate.tag}`}
                style={{
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  padding: "5px 12px",
                }}
              >
                {plate.label}
              </span>
            </div>

            {state === "none" ? (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "16px 24px" }}>
                <Link className="btn btn-primary" href="/betaling">
                  {t.startTrial}
                </Link>
              </div>
            ) : (
              <>
                <table className="table">
                  <tbody>
                    {subRows.map((row) => (
                      <tr key={row.l}>
                        <td
                          style={{
                            width: "34%",
                            padding: "12px 0 12px 24px",
                            fontSize: 13,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            color: MUTED_60,
                            borderBottom: HAIRLINE,
                          }}
                        >
                          {row.l}
                        </td>
                        <td style={{ padding: "12px 24px 12px 0", fontSize: 15, borderBottom: HAIRLINE }}>
                          {row.v}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <SubscriptionActions
                  cancelled={state === "cancelled"}
                  periodEnd={dialogDate}
                  lang={lang}
                />
              </>
            )}
          </Blueprint>
          <p className="note" style={{ margin: "12px 0 0" }}>
            {t.stripeNote}
          </p>
        </section>

        <section style={{ padding: "0 0 48px" }}>
          <SectionKicker>{t.kickerReceipts}</SectionKicker>
          {invoices.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>{t.receiptDate}</th>
                  <th>{t.receiptDescription}</th>
                  <th>{t.receiptAmount}</th>
                  <th>{t.receiptStatus}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(invoice.date, lang)}</td>
                    <td>{invoice.description}</td>
                    <td style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16 }}>
                      {invoice.amount}
                    </td>
                    <td>
                      <span className="tag tag-accent">{invoice.status}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {invoice.pdfUrl ? (
                        <a href={invoice.pdfUrl} target="_blank" rel="noreferrer">
                          {t.receiptPdf}
                        </a>
                      ) : (
                        <span className="note">{t.receiptPdf}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: 14, color: MUTED_60, margin: 0 }}>{t.receiptsEmpty}</p>
          )}
        </section>

        <section style={{ padding: "0 0 48px" }}>
          <SectionKicker>{t.kickerAccount}</SectionKicker>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(20px, 3vw, 40px)",
            }}
          >
            <EmailCard email={viewer.email ?? ""} lang={lang} />
          </div>
        </section>

        <SiteFooter lang={lang}>
          <Link href="/">{t.aboutSubscription}</Link>
        </SiteFooter>
      </main>
    </div>
  );
}
