import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getDemoEmail, getDemoSubscription } from "@/lib/demo-session";
import type { Identity, Subscription, Viewer } from "@/lib/types";

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

const ANONYMOUS: Identity = { email: null, userId: null };

/** Uncached body. Everything should call the memoised `getIdentity` below. */
async function loadIdentity(): Promise<Identity> {
  if (!isSupabaseConfigured) {
    const email = await getDemoEmail();
    return { email, userId: email ? `demo:${email}` : null };
  }

  const supabase = await getSupabaseServerClient();
  /* `getClaims()` framfor `getUser()`. Begge svarer på det samme spørsmålet —
     hvem er dette, og kan vi stole på det — men de betaler ulikt for svaret.
     `getUser()` er alltid en rundtur til auth-serveren, og den lå i veien for
     hver eneste sidevisning: ingenting ble rendret før den kom tilbake.
     `getClaims()` verifiserer signaturen lokalt mot prosjektets JWKS når
     prosjektet bruker asymmetriske nøkler, altså uten nettverk i det hele tatt,
     og fornyer sesjonen selv om tokenet er i ferd med å gå ut.
     Sikkerheten er den samme: signaturen kontrolleres, et forfalsket
     informasjonskapsel-token slipper ikke gjennom noen av veiene. Bruker
     prosjektet fortsatt den symmetriske hemmeligheten, gjør `getClaims()` det
     samme kallet som før — da er dette uendret, ikke dårligere. */
  const { data } = (await supabase!.auth.getClaims()) ?? { data: null };
  const claims = data?.claims;
  if (!claims?.sub) return ANONYMOUS;

  return { email: claims.email ?? null, userId: claims.sub };
}

/** Hvem leseren er, uten å spørre om abonnementet.
 *
 *  Kontodelen av navigasjonen står på hver eneste side og trenger bare å vite om
 *  noen er logget inn; tilbakemeldingsdialogen i rotlayouten trenger bare
 *  adressa. Ingen av dem har bruk for abonnementsraden, men de fikk den likevel
 *  så lenge `getViewer()` var det eneste spørsmålet som fantes — én
 *  databasespørring per sidevisning på sider som ikke leser svaret.
 *
 *  Memoisert per forespørsel, og `getViewer()` bygger videre på den, så en side
 *  som spør om begge deler betaler for identiteten én gang. */
export const getIdentity = cache(loadIdentity);

/** Uncached body. Everything should call the memoised `getViewer` below. */
async function loadViewer(): Promise<Viewer> {
  const identity = await getIdentity();

  if (!isSupabaseConfigured) {
    const subscription = identity.userId ? await getDemoSubscription() : null;
    return { ...identity, subscription, hasAccess: grantsAccess(subscription) };
  }

  if (!identity.userId) return { ...ANONYMOUS, subscription: null, hasAccess: false };

  const supabase = await getSupabaseServerClient();
  const { data: row } = await supabase!
    .from("tk_subscriptions")
    .select(
      "status, plan, cancel_at_period_end, current_period_end, trial_end, created_at, card_brand, card_last4, card_exp_month, card_exp_year",
    )
    .eq("user_id", identity.userId)
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

  return { ...identity, subscription, hasAccess: grantsAccess(subscription) };
}

/** Memoised for the lifetime of one request.
 *
 *  Every page that shows the account nav asks this question, and several ask it
 *  again for their own gate: `/tur/[slug]` reads `hasAccess`, `/min-side` reads
 *  the whole subscription, and both also render `AccountNav`. Uncached, that is
 *  two auth calls and two subscription queries for one page — each one a round
 *  trip to Supabase, and none of them able to return a different answer within
 *  the same request.
 *
 *  `cache()` collapses them to one. It is per-request, not a shared cache:
 *  nothing survives into the next request, so a sign-in or a webhook landing
 *  mid-session is seen immediately. */
export const getViewer = cache(loadViewer);
