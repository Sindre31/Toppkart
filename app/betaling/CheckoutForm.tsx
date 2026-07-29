"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Confirmation } from "./Confirmation";
import { Summary } from "./Summary";

/** Steg 2 av 2 — oppsummering + betaling.
 *
 *  VIKTIG: kortnummer forlater aldri denne siden. I live-modus (Stripe satt
 *  opp) samler vi ikke inn kortopplysninger i det hele tatt — brukeren sendes
 *  til Stripes egen Checkout-side. I demo-modus er kortskjemaet under en ren
 *  visuell gjengivelse av prototypen: feltene er uten `name`, leses aldri, og
 *  det eneste som sendes til /api/checkout er plan og e-postadresse.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CheckoutResponse {
  url?: string;
  ok?: boolean;
  demo?: boolean;
  error?: string;
}

export function CheckoutForm({
  plan,
  planLabel,
  planPrice,
  trialEndDate,
  initialEmail,
  stripeEnabled,
}: {
  plan: "maned" | "ar";
  planLabel: string;
  planPrice: string;
  trialEndDate: string;
  initialEmail: string;
  stripeEnabled: boolean;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function start(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Skriv inn en gyldig e-postadresse.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Kun plan og e-post — aldri kortdata.
        body: JSON.stringify({ plan, email: value }),
      });
      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok) {
        setError(data.error ?? "Vi fikk ikke startet prøveperioden. Prøv igjen om litt.");
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
      setError("Vi fikk ikke kontakt med serveren. Prøv igjen om litt.");
      setBusy(false);
    }
  }

  if (done) return <Confirmation trialEndDate={trialEndDate} />;

  return (
    <>
      <header style={{ marginBottom: 32 }}>
        <span className="kicker">Steg 2 av 2 · Betaling</span>
        <h1
          className="display"
          style={{
            fontSize: "clamp(32px, 4.5vw, 48px)",
            lineHeight: 1.06,
            margin: "10px 0 0 -0.052em",
          }}
        >
          Start prøveperioden
        </h1>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "clamp(24px, 4vw, 56px)",
          alignItems: "start",
        }}
      >
        <Summary planLabel={planLabel} planPrice={planPrice} firstChargeDate={trialEndDate} />

        <section>
          <form
            noValidate
            onSubmit={start}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {stripeEnabled ? (
              <p className="prose" style={{ margin: 0 }}>
                Kortopplysningene legges inn hos Stripe i neste steg.
              </p>
            ) : null}

            <div className="field">
              <label htmlFor="betaling-epost">E-post</label>
              <input
                id="betaling-epost"
                className="input"
                type="email"
                autoComplete="email"
                placeholder="kari@epost.no"
                aria-label="E-post"
                aria-invalid={error ? true : undefined}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
              />
            </div>

            {/* Kortfeltene finnes bare i demo-modus, og er en ren tegning av
                prototypen: ingen `name`, ingen state, ingen innsending. Ekte
                kortopplysninger håndteres utelukkende av Stripe. */}
            {stripeEnabled ? null : (
              <>
                <div className="field">
                  <label htmlFor="betaling-kortnummer">Kortnummer</label>
                  <input
                    id="betaling-kortnummer"
                    className="input"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="1234 1234 1234 1234"
                    aria-label="Kortnummer"
                    style={{ fontFeatureSettings: "'tnum' 1" }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div className="field">
                    <label htmlFor="betaling-utlopsdato">Utløpsdato</label>
                    <input
                      id="betaling-utlopsdato"
                      className="input"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="MM / ÅÅ"
                      aria-label="Utløpsdato"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="betaling-cvc">CVC</label>
                    <input
                      id="betaling-cvc"
                      className="input"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder="123"
                      aria-label="CVC"
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="betaling-navn">Navn på kortet</label>
                  <input
                    id="betaling-navn"
                    className="input"
                    type="text"
                    autoComplete="off"
                    placeholder="Kari Nordmann"
                    aria-label="Navn på kortet"
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
              {busy ? "Starter prøveperioden …" : "Start prøveperiode — 0 kr i dag"}
            </button>

            {error ? (
              <p className="note" role="alert" style={{ margin: 0, color: "var(--color-accent-800)" }}>
                {error}
              </p>
            ) : null}

            <p className="note-sm" style={{ margin: 0 }}>
              Kortopplysningene behandles av Stripe og lagres aldri hos Toppkart. Ingen binding —
              avslutt når som helst fra Min side. Kvittering sendes på e-post etter hvert trekk.
            </p>
          </form>
        </section>
      </div>
    </>
  );
}
