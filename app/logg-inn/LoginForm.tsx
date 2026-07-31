"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Blueprint } from "@/components/Blueprint";
import { GoogleMark } from "@/components/GoogleMark";
import type { Lang } from "@/lib/i18n";
import { accountDict } from "@/lib/i18n/account";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm({
  initialEmail,
  next,
  demoMode,
  linkFailed,
  googleFailed,
  lang,
}: {
  initialEmail: string;
  /** Validated, same-origin path the magic link should land on. */
  next: string;
  /** Supabase is not configured — the sign-in call opened a demo session, so
   *  the demo shortcut is the way through. */
  demoMode: boolean;
  /** Arrived back from /auth/callback with ?feil=1. */
  linkFailed: boolean;
  /** Arrived back from /auth/callback with ?feil=google — Google refused, or
   *  the provider is not enabled in Supabase. */
  googleFailed: boolean;
  /** Read from the cookie by the server component above. */
  lang: Lang;
}) {
  const t = accountDict(lang);
  const [email, setEmail] = useState(initialEmail);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    googleFailed ? t.errGoogleFailed : linkFailed ? t.errLinkExpired : null,
  );
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  /** A full navigation, not fetch: the response is a redirect to Google. */
  const googleHref = `/api/auth/google?next=${encodeURIComponent(next)}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError(t.errInvalidEmail);
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
        setError(typeof data.error === "string" ? data.error : t.errSendFailed);
        return;
      }
      setSentTo(value);
    } catch {
      setError(t.errSendFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <Blueprint style={{ padding: "28px 28px 24px", background: "var(--color-bg)" }}>
      {sentTo === null ? (
        <form onSubmit={onSubmit} noValidate>
          <span className="kicker">{t.loginKicker}</span>
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              margin: "10px 0 0",
            }}
          >
            {t.loginHeading}
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            {t.loginIntro}
          </p>

          <a
            className="btn btn-block"
            href={googleHref}
            aria-disabled={googlePending}
            onClick={() => setGooglePending(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              margin: "20px 0 0",
            }}
          >
            <GoogleMark />
            {googlePending ? t.googleRedirecting : t.googleButton}
          </a>

          <div
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "18px 0 0",
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-soft, #6b7785)",
            }}
          >
            <span style={{ flex: 1, height: 1, background: "var(--color-rule, #d8dee5)" }} />
            {t.orDivider}
            <span style={{ flex: 1, height: 1, background: "var(--color-rule, #d8dee5)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <input
              className="input"
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              aria-label={t.emailLabel}
              aria-invalid={error !== null}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
            />
            <button className="btn btn-primary btn-block" style={{ margin: 0 }} type="submit" disabled={pending}>
              {pending ? t.sending : t.sendLink}
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
          <span className="kicker">{t.sentKicker}</span>
          <h1
            style={{
              fontSize: 30,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              margin: "10px 0 0",
            }}
          >
            {t.sentHeading}
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            {t.sentBodyBefore}{" "}
            <strong style={{ color: "var(--color-text)" }}>{sentTo}</strong>
            {t.sentBodyAfter}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
            {demoMode && (
              <Link className="btn btn-primary" href="/min-side">
                {t.openAccountDemo}
              </Link>
            )}
            <button className="btn btn-ghost" type="button" onClick={() => setSentTo(null)}>
              {t.sendAgain}
            </button>
          </div>
        </div>
      )}
    </Blueprint>
  );
}
