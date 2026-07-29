import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getViewer } from "@/lib/access";
import { getInvoices } from "@/lib/invoices";
import { formatNorwegianDate } from "@/lib/dates";
import type { Subscription } from "@/lib/types";
import { EmailCard } from "./EmailCard";
import { SubscriptionActions } from "./SubscriptionActions";

export const metadata: Metadata = { title: "Min side" };

const MUTED_70 = "color-mix(in srgb, var(--color-text) 70%, transparent)";
const MUTED_60 = "color-mix(in srgb, var(--color-text) 60%, transparent)";
const HAIRLINE = "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)";

type PlateState = "none" | "trialing" | "active" | "cancelled" | "past_due";

function stateOf(sub: Subscription | null): PlateState {
  if (!sub || sub.status === "none") return "none";
  if (sub.status === "canceled" || sub.cancelAtPeriodEnd) return "cancelled";
  if (sub.status === "trialing") return "trialing";
  if (sub.status === "past_due") return "past_due";
  return "active";
}

function dateLabel(iso: string | null | undefined): string | null {
  return iso ? formatNorwegianDate(iso) : null;
}

function cardLabel(method: Subscription["paymentMethod"]): string {
  if (!method) return "Ingen betalingsmetode registrert";
  const month = String(method.expMonth).padStart(2, "0");
  const year = String(method.expYear).slice(-2);
  return `${method.brand} •••• ${method.last4} (utløper ${month}/${year})`;
}

export default async function MinSidePage() {
  const viewer = await getViewer();
  if (!viewer.userId) redirect("/logg-inn?next=/min-side");

  const sub = viewer.subscription;
  const state = stateOf(sub);
  const yearly = sub?.plan === "ar";
  const priceLabel = yearly ? "290 kr" : "29 kr";
  const planTitle = `Toppkart — ${yearly ? "290 kr/år" : "29 kr/mnd"}`;
  const cadence = yearly ? "hvert år" : "hver måned";

  const trialDate = dateLabel(sub?.trialEnd ?? sub?.currentPeriodEnd);
  const periodDate = dateLabel(sub?.currentPeriodEnd);
  const dialogDate = (state === "trialing" ? trialDate : periodDate) ?? "periodeslutt";

  const plate: { label: string; tag: string; note: string } = {
    none: {
      label: "Ingen abonnement",
      tag: "tag-neutral",
      note: "Du har ikke et aktivt abonnement — start prøveperioden for å låse opp turguidene.",
    },
    trialing: {
      label: "Prøveperiode",
      tag: "tag-accent",
      note: trialDate
        ? `Gratis til ${trialDate} — deretter ${yearly ? "290 kr/år" : "29 kr/mnd"}.`
        : `Gratis prøveperiode — deretter ${yearly ? "290 kr/år" : "29 kr/mnd"}.`,
    },
    active: {
      label: "Aktiv",
      tag: "tag-accent",
      note: `Fornyes automatisk ${cadence}.`,
    },
    cancelled: {
      label: "Avsluttet",
      tag: "tag-neutral",
      note: "Tilgang ut perioden — ingen flere trekk.",
    },
    past_due: {
      label: "Betaling mangler",
      tag: "tag-neutral",
      note: "Vi fikk ikke trukket siste betaling — oppdater betalingsmetoden.",
    },
  }[state];

  const nextCharge =
    state === "cancelled"
      ? "Ingen — abonnementet er avsluttet"
      : state === "trialing"
        ? trialDate
          ? `${priceLabel} den ${trialDate}`
          : `${priceLabel} når prøveperioden er over`
        : periodDate
          ? `${priceLabel} den ${periodDate}`
          : `${priceLabel} ved neste fornyelse`;

  const subRows: { l: string; v: string }[] = [
    { l: "Neste trekk", v: nextCharge },
    { l: "Betalingsmetode", v: cardLabel(sub?.paymentMethod ?? null) },
    { l: "Medlem siden", v: dateLabel(sub?.memberSince) ?? "—" },
  ];

  const invoices = await getInvoices(viewer);

  return (
    <div className="shell">
      <SiteNav>
        <Link href="/kart">Kartet</Link>
        <Link href="/min-side" aria-current="page" style={{ color: "var(--color-accent-700)" }}>
          Min side
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
            Logg ut
          </button>
        </form>
      </SiteNav>

      <main className="page page-account">
        <header style={{ padding: "56px 0 40px" }}>
          <h1 className="display" style={{ fontSize: "clamp(38px, 5vw, 56px)" }}>
            Min side
          </h1>
          <p style={{ fontSize: 15, lineHeight: "24px", margin: "14px 0 0", color: MUTED_70 }}>
            Innlogget som <strong style={{ color: "var(--color-text)" }}>{viewer.email}</strong>
          </p>
        </header>

        <section style={{ padding: "0 0 48px" }}>
          <SectionKicker>01 · Abonnement</SectionKicker>
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
                  Start gratis prøveperiode
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
                <SubscriptionActions cancelled={state === "cancelled"} periodEnd={dialogDate} />
              </>
            )}
          </Blueprint>
          <p className="note" style={{ margin: "12px 0 0" }}>
            Betaling og kort håndteres sikkert av Stripe. Kvittering sendes på e-post etter hvert trekk.
          </p>
        </section>

        <section style={{ padding: "0 0 48px" }}>
          <SectionKicker>02 · Kvitteringer</SectionKicker>
          {invoices.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Dato</th>
                  <th>Beskrivelse</th>
                  <th>Beløp</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{formatNorwegianDate(invoice.date)}</td>
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
                          PDF
                        </a>
                      ) : (
                        <span className="note">PDF</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ fontSize: 14, color: MUTED_60, margin: 0 }}>
              Ingen kvitteringer ennå — første trekk kommer etter prøveperioden.
            </p>
          )}
        </section>

        <section style={{ padding: "0 0 48px" }}>
          <SectionKicker>03 · Konto</SectionKicker>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "clamp(20px, 3vw, 40px)",
            }}
          >
            <EmailCard email={viewer.email ?? ""} />
          </div>
        </section>

        <SiteFooter>
          <Link href="/">Om abonnementet</Link>
        </SiteFooter>
      </main>
    </div>
  );
}
