import { cookies } from "next/headers";
import { DEMO_COOKIE, TRIAL_DAYS } from "@/lib/config";
import type { Invoice, Subscription, SubscriptionStatus } from "@/lib/types";

/** Demo mode: everything Supabase and Stripe would own, kept in two httpOnly
 *  cookies so the flow is walkable without keys. Live mode never reads these.
 *  Nothing here is a security boundary — demo mode gates sample content only. */

interface DemoSub {
  status: SubscriptionStatus;
  plan: "maned" | "ar";
  startedAt: string;
  cancelAtPeriodEnd: boolean;
}

const DAY = 86_400_000;

export async function getDemoEmail(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(DEMO_COOKIE.session)?.value ?? null;
}

export async function setDemoEmail(email: string, provider: DemoProvider = "email") {
  const jar = await cookies();
  const opts = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30 };
  jar.set(DEMO_COOKIE.session, email, opts);
  jar.set(DEMO_COOKIE.provider, provider, opts);
}

/** Which way the demo session was opened. Live mode reads this off the
 *  Supabase identities instead; the cookie only stands in for that. */
export type DemoProvider = "email" | "google";

export async function getDemoProvider(): Promise<DemoProvider> {
  const jar = await cookies();
  return jar.get(DEMO_COOKIE.provider)?.value === "google" ? "google" : "email";
}

export async function clearDemoSession() {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE.session);
  jar.delete(DEMO_COOKIE.subscription);
  jar.delete(DEMO_COOKIE.provider);
}

export async function getDemoSubscription(): Promise<Subscription | null> {
  const jar = await cookies();
  const raw = jar.get(DEMO_COOKIE.subscription)?.value;
  if (!raw) return null;
  let sub: DemoSub;
  try {
    sub = JSON.parse(raw) as DemoSub;
  } catch {
    return null;
  }
  const started = new Date(sub.startedAt);
  const trialEnd = new Date(started.getTime() + TRIAL_DAYS * DAY);
  const periodEnd =
    sub.status === "trialing"
      ? trialEnd
      : new Date(started.getTime() + (sub.plan === "ar" ? 365 : 30) * DAY);
  return {
    status: sub.status,
    plan: sub.plan,
    cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
    currentPeriodEnd: periodEnd.toISOString(),
    trialEnd: sub.status === "trialing" ? trialEnd.toISOString() : null,
    memberSince: sub.startedAt,
    paymentMethod: { brand: "Visa", last4: "4242", expMonth: 8, expYear: 2028 },
  };
}

export async function startDemoSubscription(plan: "maned" | "ar") {
  const jar = await cookies();
  const sub: DemoSub = {
    status: "trialing",
    plan,
    startedAt: new Date().toISOString(),
    cancelAtPeriodEnd: false,
  };
  jar.set(DEMO_COOKIE.subscription, JSON.stringify(sub), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
  });
}

export async function updateDemoSubscription(patch: Partial<DemoSub>) {
  const jar = await cookies();
  const raw = jar.get(DEMO_COOKIE.subscription)?.value;
  if (!raw) return;
  const sub = { ...(JSON.parse(raw) as DemoSub), ...patch };
  jar.set(DEMO_COOKIE.subscription, JSON.stringify(sub), {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
  });
}

/** Sample receipts — empty during the trial, as the design specifies. */
export function demoInvoices(sub: Subscription | null): Invoice[] {
  if (!sub || sub.status === "trialing" || sub.status === "none") return [];
  const amount = sub.plan === "ar" ? "290 kr" : "29 kr";
  const desc = sub.plan === "ar" ? "Toppkart årlig" : "Toppkart månedlig";
  const start = sub.memberSince ? new Date(sub.memberSince) : new Date();
  return [0, 1, 2].map((i) => ({
    id: `demo_${i}`,
    date: new Date(start.getTime() - i * 30 * DAY).toISOString(),
    description: desc,
    amount,
    status: "Betalt",
    pdfUrl: null,
  }));
}
