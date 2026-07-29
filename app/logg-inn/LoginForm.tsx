"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Blueprint } from "@/components/Blueprint";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY = {
  invalid: "Skriv inn en gyldig e-postadresse.",
  failed: "Vi klarte ikke å sende innloggingslenken. Prøv igjen om litt.",
  expired: "Innloggingslenken er ugyldig eller utløpt. Be om en ny lenke.",
  sending: "Sender …",
};

export default function LoginForm({
  initialEmail,
  next,
  demoMode,
  linkFailed,
}: {
  initialEmail: string;
  /** Validated, same-origin path the magic link should land on. */
  next: string;
  /** Supabase is not configured — the sign-in call opened a demo session, so
   *  the demo shortcut is the way through. */
  demoMode: boolean;
  /** Arrived back from /auth/callback with ?feil=1. */
  linkFailed: boolean;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(linkFailed ? COPY.expired : null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError(COPY.invalid);
      return;
    }
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: value, next }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : COPY.failed);
        return;
      }
      setSentTo(value);
    } catch {
      setError(COPY.failed);
    } finally {
      setPending(false);
    }
  }

  return (
    <Blueprint style={{ padding: "28px 28px 24px", background: "var(--color-bg)" }}>
      {sentTo === null ? (
        <form onSubmit={onSubmit} noValidate>
          <span className="kicker">Logg inn</span>
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              margin: "10px 0 0",
            }}
          >
            Uten passord
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            Skriv inn e-postadressen din, så sender vi en innloggingslenke. Lenken virker i 15
            minutter.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            <input
              className="input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="din@epost.no"
              aria-label="E-postadresse"
              aria-invalid={error !== null}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />
            <button className="btn btn-primary btn-block" style={{ margin: 0 }} type="submit" disabled={pending}>
              {pending ? COPY.sending : "Send innloggingslenke"}
            </button>
          </div>
          {error !== null && (
            <p
              role="alert"
              style={{ fontSize: 13, color: "var(--color-accent-800)", margin: "10px 0 0" }}
            >
              {error}
            </p>
          )}
        </form>
      ) : (
        <div>
          <span className="kicker">Sjekk innboksen</span>
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              margin: "10px 0 0",
            }}
          >
            Lenken er sendt
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            Vi har sendt en innloggingslenke til{" "}
            <strong style={{ color: "var(--color-text)" }}>{sentTo}</strong>. Åpne e-posten og trykk
            på lenken.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            {demoMode && (
              <Link className="btn btn-primary" href="/min-side">
                Åpne Min side (demo)
              </Link>
            )}
            <button className="btn btn-ghost" type="button" onClick={() => setSentTo(null)}>
              Send på nytt
            </button>
          </div>
        </div>
      )}
    </Blueprint>
  );
}
