import { isStripeConfigured } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { demoInvoices } from "@/lib/demo-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { Invoice, Viewer } from "@/lib/types";

/** Receipts for «02 · Kvitteringer» on /min-side.
 *
 *  Live mode reads the viewer's Stripe invoices; demo mode falls back to the
 *  sample receipts in lib/demo-session (empty during the trial, as designed).
 *  Never throws — a billing hiccup must not take the account page down.
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

const STATUS_NO: Record<string, string> = {
  paid: "Betalt",
  open: "Ubetalt",
  draft: "Utkast",
  void: "Annullert",
  uncollectible: "Mislyktes",
};

function formatAmount(minor: number, currency: string): string {
  const major = minor / 100;
  const value = Number.isInteger(major) ? String(major) : major.toFixed(2).replace(".", ",");
  return currency.toLowerCase() === "nok" ? `${value} kr` : `${value} ${currency.toUpperCase()}`;
}

/** Receipts for the signed-in viewer, newest first. */
export async function getInvoices(viewer: Viewer): Promise<Invoice[]> {
  if (!viewer.userId) return [];

  const stripe = getStripe();
  if (!isStripeConfigured || !stripe) return demoInvoices(viewer.subscription);

  const { customerId } = await getBillingRefs(viewer.userId);
  if (!customerId) return [];

  try {
    const list = await stripe.invoices.list({ customer: customerId, limit: 12 });
    return list.data.map((invoice) => {
      const line = invoice.lines.data[0];
      const description =
        line?.description ??
        (viewer.subscription?.plan === "ar" ? "Toppkart årlig" : "Toppkart månedlig");
      const amount = invoice.amount_paid > 0 ? invoice.amount_paid : invoice.amount_due;
      return {
        id: invoice.id,
        date: new Date(invoice.created * 1000).toISOString(),
        description,
        amount: formatAmount(amount, invoice.currency),
        status: STATUS_NO[invoice.status ?? ""] ?? "Betalt",
        pdfUrl: invoice.invoice_pdf ?? invoice.hosted_invoice_url ?? null,
      } satisfies Invoice;
    });
  } catch {
    return [];
  }
}
