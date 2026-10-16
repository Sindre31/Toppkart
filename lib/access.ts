import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getDemoEmail } from "@/lib/demo-session";
import type { Identity } from "@/lib/types";

/** Hvem er logget inn — om noen.
 *
 *  Toppkart er gratis og har ingen brukerkontoer for lesere: alle guidene er
 *  åpne for alle. Innlogging finnes bare for driftssidene under `/admin`, som
 *  slipper inn adressene i `ADMIN_EMAILS` (se `lib/admin.ts`). */

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

/** Hvem leseren er. Memoisert per forespørsel: rotlayouten (tilbakemeldings-
 *  dialogen) og admin-sidene spør begge, og svaret kan ikke endre seg innenfor
 *  samme forespørsel. */
export const getIdentity = cache(loadIdentity);
