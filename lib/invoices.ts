import { isStripeConfigured } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { demoInvoices } from "@/lib/demo-session";
import type { Lang } from "@/lib/i18n";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Invoice, Subscription, Viewer } from "@/lib/types";

/** Receipts for «02 · Kvitteringer» on /min-side.
 *
 *  Live mode reads the viewer's Stripe invoices; demo mode falls back to the
 *  sample receipts in lib/demo-session (empty during the trial, as designed).
 *  Never throws — a billing hiccup must not take the account page down.
 *
 *  The two strings a receipt row shows — the status and the plan description —
 *  are localised here rather than in `lib/i18n/account`: they are derived from
 *  Stripe's own status codes and from the plan id, not written for the page.
 */

/** The Stripe ids we keep on the `subscriptions` row. Live mode only. */
export interface BillingRefs {
  customerId: string | null;
  subscriptionId: string | null;
}

export async function getBillingRefs(userId: string): Promise<BillingRefs> {
  const empty: BillingRefs = { customerId: null, subscriptionId: null };
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) return empty;
    const { data } = await supabase
      .from("tk_subscriptions")
      .select("stripe_customer_id, stripe_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!data) return empty;
    const row = data as { stripe_customer_id: string | null; stripe_subscription_id: string | null };
    return {
      customerId: row.stripe_customer_id ?? null,
      subscriptionId: row.stripe_subscription_id ?? null,
    };
  } catch {
    return empty;
  }
}

/** Stripe's invoice statuses, spelled for a reader. Anything unrecognised falls
 *  back to «Betalt» / "Paid", the way it always has. */
const STATUS: Record<Lang, Record<string, string>> = {
  no: {
    paid: "Betalt",
    open: "Ubetalt",
    draft: "Utkast",
    void: "Annullert",
    uncollectible: "Mislyktes",
  },
  en: {
    paid: "Paid",
    open: "Unpaid",
    draft: "Draft",
    void: "Void",
    uncollectible: "Failed",
  },
};

function statusLabel(status: string | null | undefined, lang: Lang): string {
  return STATUS[lang][status ?? ""] ?? STATUS[lang].paid;
}

/** Description for a receipt Stripe did not name itself, and for every demo
 *  receipt. Derived from the plan id, which is never translated. */
const PLAN_DESCRIPTION: Record<Lang, Record<Subscription["plan"], string>> = {
  no: { ar: "Toppkart årlig", maned: "Toppkart månedlig" },
  en: { ar: "Toppkart yearly", maned: "Toppkart monthly" },
};

function planDescription(plan: Subscription["plan"] | undefined, lang: Lang): string {
  return PLAN_DESCRIPTION[lang][plan === "ar" ? "ar" : "maned"];
}

/** Amounts stay in kroner in both languages — the price is never converted. */
function formatAmount(minor: number, currency: string): string {
  const major = minor / 100;
  const value = Number.isInteger(major) ? String(major) : major.toFixed(2).replace(".", ",");
  return currency.toLowerCase() === "nok" ? `${value} kr` : `${value} ${currency.toUpperCase()}`;
}

/** Receipts for the signed-in viewer, newest first. */
export async function getInvoices(viewer: Viewer, lang: Lang = "no"): Promise<Invoice[]> {
  if (!viewer.userId) return [];

  const plan = viewer.subscription?.plan;
  const stripe = getStripe();
  // The demo receipts are generated in Norwegian; their description and status
  // are fully determined by the plan, so both are simply restated per language.
  if (!isStripeConfigured || !stripe) {
    return demoInvoices(viewer.subscription).map((invoice) => ({
      ...invoice,
      description: planDescription(plan, lang),
      status: statusLabel("paid", lang),
    }));
  }

  const { customerId } = await getBillingRefs(viewer.userId);
  if (!customerId) return [];

  try {
    const list = await stripe.invoices.list({ customer: customerId, limit: 12 });
    return list.data.map((invoice) => {
      const line = invoice.lines.data[0];
      // A description Stripe wrote follows the product, not the reader's
      // language; only our own fallback is translated.
      const description = line?.description ?? planDescription(plan, lang);
      const amount = invoice.amount_paid > 0 ? invoice.amount_paid : invoice.amount_due;
      return {
        id: invoice.id,
        date: new Date(invoice.created * 1000).toISOString(),
        description,
        amount: formatAmount(amount, invoice.currency),
        status: statusLabel(invoice.status, lang),
        pdfUrl: invoice.invoice_pdf ?? invoice.hosted_invoice_url ?? null,
      } satisfies Invoice;
    });
  } catch {
    return [];
  }
}
