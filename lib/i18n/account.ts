/** NO/EN dictionary for sign-in (`/logg-inn`).
 *
 *  Toppkart has no reader accounts. The sign-in page is the way into `/admin`
 *  for the addresses in `ADMIN_EMAILS`, and is linked from nowhere on the site.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface AccountDict {
  /* — sign-in: metadata — */
  loginMetaTitle: string;
  loginMetaDescription: string;
  /* — sign-in: the form — */
  loginKicker: string;
  loginHeading: string;
  loginIntro: string;
  googleButton: string;
  googleRedirecting: string;
  /** Standing note under the button. */
  googleOnlyNote: string;
  /* — sign-in: errors — */
  /** Google handed back an error, or the provider is not enabled in Supabase. */
  errGoogleFailed: string;
  /** The round-trip came back but the session exchange failed. */
  errSignInFailed: string;
}

const ACCOUNT: Translated<AccountDict> = {
  no: {
    loginMetaTitle: "Logg inn",
    loginMetaDescription: "Innlogging for drift av Toppkart.",
    loginKicker: "Drift",
    loginHeading: "Logg inn",
    loginIntro:
      "Denne innloggingen er bare for drift av Toppkart. Du trenger ingen konto for å bruke Toppkart — alle turene og guidene er åpne.",
    googleButton: "Fortsett med Google",
    googleRedirecting: "Sender deg til Google …",
    googleOnlyNote: "Bare adresser med drifttilgang slipper inn.",
    errGoogleFailed:
      "Vi fikk ikke kontakt med Google, eller innlogginga ble avbrutt. Prøv igjen.",
    errSignInFailed: "Vi klarte ikke å fullføre innlogginga. Prøv igjen.",
  },
  en: {
    loginMetaTitle: "Log in",
    loginMetaDescription: "Sign-in for running Toppkart.",
    loginKicker: "Admin",
    loginHeading: "Log in",
    loginIntro:
      "This sign-in is only for running Toppkart. You need no account to use Toppkart — every tour and guide is open.",
    googleButton: "Continue with Google",
    googleRedirecting: "Taking you to Google …",
    googleOnlyNote: "Only addresses with admin access get in.",
    errGoogleFailed:
      "We could not reach Google, or the sign-in was cancelled. Try again.",
    errSignInFailed: "We could not complete the sign-in. Try again.",
  },
};

export function accountDict(lang: Lang): AccountDict {
  return pick(ACCOUNT, lang);
}
