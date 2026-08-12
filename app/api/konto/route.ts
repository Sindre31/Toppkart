import { NextResponse } from "next/server";

import { getViewer } from "@/lib/access";
import { alertOps } from "@/lib/alerts";
import { isSupabaseConfigured } from "@/lib/config";
import { clearDemoSession } from "@/lib/demo-session";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient, getSupabaseServerClient } from "@/lib/supabase/server";

/** DELETE /api/konto — sletter kontoen.
 *
 *  Personvernerklæringa har alltid lova sletting; fram til nå skjedde det ved
 *  at noen skrev til support og noen andre gjorde det for hånd. Det er lovlig,
 *  men det er en dårlig avtale for begge: leseren må be om noe hen har rett på,
 *  og den som drifter må huske hvilke fire tabeller det står i.
 *
 *  **Rekkefølgen er ikke tilfeldig.** Stripe først, databasen sist. Slår vi av
 *  abonnementet og feiler på slettinga, står leseren igjen med en konto uten
 *  abonnement — kjedelig, men synlig og rettbart. Sletter vi først og feiler på
 *  Stripe, er kontoen borte mens kortet fortsetter å bli trukket hver måned, og
 *  det finnes ikke lenger en konto å finne kunden gjennom. Bare den ene av de to
 *  feilene koster penger etter at den har skjedd.
 *
 *  **Hva som blir igjen, og hvorfor.** Abonnementet blir sagt opp umiddelbart —
 *  ikke ved periodeslutt, for det er ingen igjen til å bruke resten av perioden.
 *  Kundeobjektet og fakturaene hos Stripe står. Det er regnskapsmateriale, og
 *  bokføringsloven krever fem år; erklæringa sier det samme. Alt appen selv har
 *  — profil, abonnementsrad, kvitteringsspeil og tilbakemeldinger — går med
 *  brukeren gjennom `on delete cascade` i `supabase/schema.sql`.
 */
export const runtime = "nodejs";

export async function DELETE() {
  const viewer = await getViewer();
  if (!viewer.userId) {
    return NextResponse.json({ error: "not_signed_in" }, { status: 401 });
  }

  /* Demomodus: det finnes ingen konto å slette, bare to informasjonskapsler.
     Å svare «ok» her er ikke å late som — kapslene *er* kontoen i demomodus, og
     de blir borte. */
  if (!isSupabaseConfigured) {
    await clearDemoSession();
    return NextResponse.json({ ok: true });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    console.error("[konto] SUPABASE_SERVICE_ROLE_KEY mangler — kan ikke slette bruker");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  // ---- Stripe først -------------------------------------------------------

  const stripe = getStripe();
  if (stripe) {
    const { data: row } = await admin
      .from("tk_subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", viewer.userId)
      .maybeSingle();

    const subscriptionId = row?.stripe_subscription_id;
    if (subscriptionId) {
      try {
        await stripe.subscriptions.cancel(subscriptionId);
      } catch (error) {
        /* `resource_missing` betyr at abonnementet alt er borte — sagt opp
           tidligere, eller utløpt. Da er vi der vi ville. Alt annet stopper
           slettinga, for et abonnement som lever videre uten en konto foran seg
           er nettopp det denne rekkefølgen finnes for å unngå. */
        const code = (error as { code?: string })?.code;
        if (code !== "resource_missing") {
          const message = error instanceof Error ? error.message : String(error);
          await alertOps({
            subject: "Kontosletting stoppet på Stripe",
            key: "delete-account-stripe",
            lines: [
              "En leser ba om å få kontoen slettet, og abonnementet kunne ikke sies opp.",
              "Ingenting er slettet — kontoen står som før, og kortet blir fortsatt trukket.",
              "",
              `Bruker:     ${viewer.userId}`,
              `Abonnement: ${subscriptionId}`,
              `Feil:       ${message}`,
            ],
          });
          return NextResponse.json({ error: "stripe_failed" }, { status: 502 });
        }
      }
    }
  }

  // ---- Så databasen -------------------------------------------------------

  /* Én sletting. `tk_profiles`, `tk_subscriptions`, `tk_invoices` og
     `tk_feedback` peker alle på `auth.users` med `on delete cascade`, så raden
     her tar med seg alt appen har lagret om leseren. */
  const { error } = await admin.auth.admin.deleteUser(viewer.userId);
  if (error) {
    await alertOps({
      subject: "Kontosletting stoppet på Supabase",
      key: "delete-account-supabase",
      lines: [
        "Abonnementet er sagt opp, men brukeren ble ikke slettet.",
        "Leseren sitter igjen med en konto uten abonnement og har bedt om å bli glemt.",
        "",
        `Bruker: ${viewer.userId}`,
        `Feil:   ${error.message}`,
      ],
    });
    return NextResponse.json({ error: "delete_failed" }, { status: 502 });
  }

  /* Sesjonen peker nå på en bruker som ikke finnes. Den ryddes bort her framfor
     å la den stå og feile på neste navigasjon. */
  const supabase = await getSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
