"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { GoogleMark } from "@/components/GoogleMark";
import type { Lang } from "@/lib/i18n";
import { checkoutDict, checkoutError } from "@/lib/i18n/checkout";

import { Confirmation } from "./Confirmation";
import { Summary } from "./Summary";

/** Steg 2 av 2 — oppsummering + betaling.
 *
 *  VIKTIG: kortnummer forlater aldri denne siden. I live-modus (Stripe satt
 *  opp) samler vi ikke inn kortopplysninger i det hele tatt — brukeren sendes
 *  til Stripes egen Checkout-side. I demo-modus er kortskjemaet under en ren
 *  visuell gjengivelse av prototypen: feltene er uten `name`, leses aldri, og
 *  det eneste som sendes til /api/checkout er plan og e-postadresse.
 *
 *  `plan` is the value the API validates (`maned` / `ar`) and is never
 *  translated — only `planLabel`, which the server picked for `lang`.
 */

interface CheckoutResponse {
  url?: string;
  ok?: boolean;
  demo?: boolean;
  error?: string;
}

export function CheckoutForm({
  lang,
  plan,
  planLabel,
  planPrice,
  trialEndDate,
  initialEmail,
  stripeEnabled,
  signedIn,
}: {
  lang: Lang;
  plan: "maned" | "ar";
  planLabel: string;
  planPrice: string;
  trialEndDate: string;
  initialEmail: string;
  stripeEnabled: boolean;
  /** Already has a session, so the address is known and Google would be a
   *  detour rather than a shortcut. */
  signedIn: boolean;
}) {
  const t = checkoutDict(lang);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  /** Comes back to this same step with the plan intact, address already
   *  known — a full navigation, since the response redirects to Google. */
  const googleHref = `/api/auth/google?next=${encodeURIComponent(`/betaling?plan=${plan}`)}`;

  async function start(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Kun planen — adressen kommer fra sesjonen, og aldri kortdata.
        body: JSON.stringify({ plan }),
      });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        // /api/checkout answers with Norwegian prose in `error`. Until that
        // route hands back a language-neutral code we only surface its text on
        // the Norwegian site, and fall back to our own message in English.
        setError(checkoutError(data.error, lang));
        setBusy(false);
        return;
      }

      if (data.url) {
        // Videre til Stripe Checkout, der kortet legges inn.
        window.location.href = data.url;
        return;
      }

      setDone(true);
      router.refresh();
    } catch {
      setError(t.networkFailed);
      setBusy(false);
    }
  }

  if (done) return <Confirmation lang={lang} trialEndDate={trialEndDate} />;

  return (
    <>
      <header style={{ marginBottom: 32 }}>
        <span className="kicker">{t.kicker}</span>
        <h1
          className="display"
          style={{
            fontSize: "clamp(32px, 4.5vw, 48px)",
            lineHeight: 1.06,
            margin: "10px 0 0 -0.052em",
          }}
        >
          {t.heading}
        </h1>
      </header>

      <div
        style={{
          display: "grid",
          /* `min(320px, 100%)` rather than a bare 320px: a plain minimum can
             never shrink under it, so on a 320px phone the track stayed 320
             wide inside a 280px container and pushed the page sideways. */
          gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
          gap: "clamp(24px, 4vw, 56px)",
          alignItems: "start",
        }}
      >
        <Summary
          lang={lang}
          planLabel={planLabel}
          planPrice={planPrice}
          firstChargeDate={trialEndDate}
        />

        <section>
          {/* Sign-in first, deliberately. Google is the only way in, so a card
              paid for by someone with no session could not be attached to an
              account afterwards — the Stripe webhook would find no user, log
              the event and drop it, and the customer would have paid for
              nothing. Identity before money. */}
          {signedIn ? null : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <p className="prose" style={{ margin: 0 }}>
                {t.signInFirst}
              </p>
              <a
                className="btn btn-primary btn-block"
                href={googleHref}
                aria-disabled={googlePending}
                onClick={() => setGooglePending(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  margin: 0,
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 22,
                    height: 22,
                    background: "#fff",
                    borderRadius: 2,
                  }}
                >
                  <GoogleMark />
                </span>
                {googlePending ? t.googleRedirecting : t.googleButton}
              </a>
              <p className="note" style={{ margin: 0 }}>
                {t.googleNote}
              </p>
            </div>
          )}

          <form
            noValidate
            onSubmit={start}
            hidden={!signedIn}
            style={{ display: signedIn ? "flex" : "none", flexDirection: "column", gap: 14 }}
          >
            {stripeEnabled ? (
              <p className="prose" style={{ margin: 0 }}>
                {t.stripeNextStep}
              </p>
            ) : null}


            <p className="note" style={{ margin: 0 }}>
              {t.signedInAs} <strong style={{ color: "var(--color-text)" }}>{initialEmail}</strong>
            </p>

            {/* Kortfeltene finnes bare i demo-modus, og er en ren tegning av
                prototypen: ingen `name`, ingen state, ingen innsending. Ekte
                kortopplysninger håndteres utelukkende av Stripe. */}
            {stripeEnabled ? null : (
              <>
                <div className="field">
                  <label htmlFor="betaling-kortnummer">{t.cardNumberLabel}</label>
                  <input
                    id="betaling-kortnummer"
                    className="input"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={t.cardNumberPlaceholder}
                    aria-label={t.cardNumberLabel}
                    style={{ fontFeatureSettings: "'tnum' 1" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label htmlFor="betaling-utlopsdato">{t.expiryLabel}</label>
                    <input
                      id="betaling-utlopsdato"
                      className="input"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={t.expiryPlaceholder}
                      aria-label={t.expiryLabel}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="betaling-cvc">{t.cvcLabel}</label>
                    <input
                      id="betaling-cvc"
                      className="input"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={t.cvcPlaceholder}
                      aria-label={t.cvcLabel}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="betaling-navn">{t.cardNameLabel}</label>
                  <input
                    id="betaling-navn"
                    className="input"
                    type="text"
                    autoComplete="off"
                    placeholder={t.cardNamePlaceholder}
                    aria-label={t.cardNameLabel}
                  />
                </div>
              </>
            )}

            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={busy}
              style={{ margin: "6px 0 0", minHeight: 42 }}
            >
              {busy ? t.submitBusy : t.submit}
            </button>

            {error ? (
              <p className="note" role="alert" style={{ margin: 0, color: "var(--color-accent-800)" }}>
                {error}
              </p>
            ) : null}

            <p className="note-sm" style={{ margin: 0 }}>
              {t.reassurance}
            </p>
          </form>
        </section>
      </div>
    </>
  );
}
