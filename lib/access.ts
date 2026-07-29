import { isSupabaseConfigured } from "@/lib/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getDemoEmail, getDemoSubscription } from "@/lib/demo-session";
import type { Subscription, Viewer } from "@/lib/types";

/** The single gate every page asks: who is this, and may they read the guides?
 *
 *  Access rule from the handoff: the map and key figures are open to all;
 *  route description, GPX, elevation profile and avalanche terrain require an
 *  active subscription or a running trial.
 */
export function grantsAccess(sub: Subscription | null): boolean {
  if (!sub) return false;
  if (sub.status === "trialing" || sub.status === "active") return true;
  // A cancelled subscription keeps access until the period it paid for ends.
  if (sub.status === "canceled" && sub.currentPeriodEnd) {
    return new Date(sub.currentPeriodEnd).getTime() > Date.now();
  }
  return false;
}

export async function getViewer(): Promise<Viewer> {
  if (!isSupabaseConfigured) {
    const email = await getDemoEmail();
    const subscription = email ? await getDemoSubscription() : null;
    return { email, userId: email ? `demo:${email}` : null, subscription, hasAccess: grantsAccess(subscription) };
  }

  const supabase = await getSupabaseServerClient();
  const { data } = (await supabase!.auth.getUser()) ?? { data: { user: null } };
  const user = data?.user ?? null;
  if (!user) return { email: null, userId: null, subscription: null, hasAccess: false };

  const { data: row } = await supabase!
    .from("subscriptions")
    .select(
      "status, plan, cancel_at_period_end, current_period_end, trial_end, created_at, card_brand, card_last4, card_exp_month, card_exp_year",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  const subscription: Subscription | null = row
    ? {
        status: row.status,
        plan: row.plan ?? "maned",
        cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
        currentPeriodEnd: row.current_period_end,
        trialEnd: row.trial_end,
        memberSince: row.created_at,
        paymentMethod: row.card_last4
          ? {
              brand: row.card_brand ?? "Kort",
              last4: row.card_last4,
              expMonth: row.card_exp_month ?? 0,
              expYear: row.card_exp_year ?? 0,
            }
          : null,
      }
    : null;

  return {
    email: user.email ?? null,
    userId: user.id,
    subscription,
    hasAccess: grantsAccess(subscription),
  };
}
