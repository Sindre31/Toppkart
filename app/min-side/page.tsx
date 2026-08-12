import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getViewer } from "@/lib/access";
import { getInvoices } from "@/lib/invoices";
import { formatDate, toDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { accountDict, type AccountDict } from "@/lib/i18n/account";
import type { Subscription } from "@/lib/types";
import { DeleteAccountCard } from "./DeleteAccountCard";
import { EmailCard } from "./EmailCard";
import { SignOutCard } from "./SignOutCard";
import { SubscriptionActions } from "./SubscriptionActions";

export async function generateMetadata(): Promise<Metadata> {
  const t = accountDict(await getLang());
  /* Kontoside: ingenting å søke opp, og den redirecter uansett en utlogget
     leser videre. `follow` står på, så lenkene herfra (kartet, vilkårene)
     fortsatt teller. */
  return {
    title: t.accountMetaTitle,
    description: t.accountMetaDescription,
    robots: { index: false, follow: true },
  };
}

const MUTED_70 = "color-mix(in srgb, var(--color-text) 70%, transparent)";
const MUTED_60 = "color-mix(in srgb, var(--color-text) 60%, transparent)";

/** The plate is a *view* of the subscription. The underlying
 *  `Subscription["status"]` values are never rewritten.
 *
 *  `ending` and `cancelled` used to be one state, and that was wrong in the
 *  place it is read fastest. Say opp midt i prøveperioden og merket sa
 *  «Avsluttet» med fjorten dagers tilgang igjen. Notatet under sa riktig nok
 *  «tilgang ut perioden», men et statusmerke leses for seg — det er hele
 *  poenget med et merke — og «Avsluttet» ved siden av låste guider er den
 *  naturlige slutninga.
 *
 *  Skillet går på om perioden faktisk er over, ikke på hvilket flagg Stripe
 *  har satt: et abonnement med `cancelAtPeriodEnd` og to uker igjen er ikke
 *  avsluttet, og et med status `canceled` og perioden bak seg er det. */
type PlateState = "none" | "trialing" | "active" | "ending" | "cancelled" | "past_due";

function stateOf(sub: Subscription | null): PlateState {
  if (!sub || sub.status === "none") return "none";
  if (sub.status === "canceled" || sub.cancelAtPeriodEnd) {
    /* Samme dato `grantsAccess` dømmer etter, så merket og tilgangen ikke kan
       si hver sin ting. `trialEnd` er reserven: i en oppsagt prøveperiode er
       de to like, men raden kan mangle den ene. */
    const endsAt = toDate(sub.currentPeriodEnd ?? sub.trialEnd);
    return endsAt && endsAt.getTime() > Date.now() ? "ending" : "cancelled";
  }
  if (sub.status === "trialing") return "trialing";
  if (sub.status === "past_due") return "past_due";
  return "active";
}

/** Hvilken vei videre knapperaden skal tilby.
 *
 *  Ikke det samme skillet som merket over, og det er poenget. Merket spør om
 *  perioden er ute; denne spør om det finnes et abonnement hos Stripe å endre.
 *  De faller fra hverandre i ett tilfelle: sier man opp med umiddelbar virkning
 *  gjennom Stripes egen portal, blir status `canceled` mens tilgangen løper ut
 *  perioden. Merket sier da riktig «Avsluttes 22. august», men abonnementet er
 *  borte, og «Gjenoppta» ville ikke hatt noe å skru av.
 */
function actionOf(sub: Subscription | null, state: PlateState): "cancel" | "resume" | "restart" {
  if (state === "cancelled") return "restart";
  if (state === "ending") return sub?.status === "canceled" ? "restart" : "resume";
  return "cancel";
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

  const sub = viewer.subscription;
  const state = stateOf(sub);
  const yearly = sub?.plan === "ar";
  const priceLabel = yearly ? "290 kr" : "29 kr";
  const planTitle = t.planTitle(yearly ? t.pricePerYear : t.pricePerMonth);

  const trialDate = dateLabel(sub?.trialEnd ?? sub?.currentPeriodEnd, lang);
  const periodDate = dateLabel(sub?.currentPeriodEnd, lang);
  const dialogDate = (state === "trialing" ? trialDate : periodDate) ?? t.periodEndFallback;
  /* Dagen tilgangen faktisk tar slutt, formatert for «Avsluttes …». Samme kilde
     og samme rekkefølge som `stateOf` dømmer etter. */
  const endDate = periodDate ?? trialDate;

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
    ending: {
      label: endDate ? t.statusEnding(endDate) : t.statusEndingUndated,
      /* Aksent, ikke nøytral: fargen skiller «du har tilgang» fra «du har det
         ikke» på de fire andre tilstandene, og her har man det. Datoen i
         etiketten er det som sier at den tar slutt. */
      tag: "tag-accent",
      note: t.noteEnding,
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
      : state === "ending"
        ? t.nextChargeEnding
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
      <SiteNav lang={lang} current="/min-side" />

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
                {/* Cellestilen ligger i `.table-kv` (globals) framfor i `style`
                    her: på telefon skal nøkkelen stå over verdien, og en
                    inline-regel kan ingen mediespørring nå. */}
                <table className="table table-kv">
                  <tbody>
                    {subRows.map((row) => (
                      <tr key={row.l}>
                        <td className="kv-l">{row.l}</td>
                        <td className="kv-v">{row.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <SubscriptionActions
                  mode={actionOf(sub, state)}
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
            /* Fem kolonner får ikke plass på en telefon uansett hva vi gjør med
               dem, og valget står mellom å skrenge her eller å skrenge hele
               sida. Her. */
            <div className="table-scroll">
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
            </div>
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
            <SignOutCard lang={lang} />
            <DeleteAccountCard lang={lang} />
          </div>
        </section>

        {/* «Om abonnementet» pekte til forsida, som selger abonnementet til
            noen som allerede har det — og navigasjonen øverst har uansett veien
            dit. Bunnlinja er den samme som overalt ellers nå. */}
        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
