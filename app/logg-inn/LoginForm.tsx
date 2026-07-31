"use client";

import { useState } from "react";
import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { accountDict } from "@/lib/i18n/account";

/** Google's mark, inlined rather than fetched: the sign-in page must render
 *  the same with no network, and Google's brand guidance wants the four-colour
 *  «G» rather than a monochrome stand-in. */
function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

/** Sign-in is Google and nothing else.
 *
 *  The one piece of state here is whether the browser is on its way to Google,
 *  which is why this is a client component at all: the button is a plain link
 *  to `/api/auth/google`, and a redirect gives no feedback of its own.
 */
export default function LoginForm({
  next,
  failure,
  lang,
}: {
  /** Validated, same-origin path to land on once signed in. */
  next: string;
  /** Came back from `/auth/callback` with `?feil=` — `"google"` when Google
   *  refused or the visitor cancelled, `"1"` when the session exchange failed. */
  failure: "google" | "1" | null;
  /** Read from the cookie by the server component above. */
  lang: Lang;
}) {
  const t = accountDict(lang);
  const [pending, setPending] = useState(false);

  const error =
    failure === "google" ? t.errGoogleFailed : failure === "1" ? t.errSignInFailed : null;

  return (
    <Blueprint style={{ padding: "28px 28px 24px", background: "var(--color-bg)" }}>
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
        className="btn btn-primary btn-block"
        href={`/api/auth/google?next=${encodeURIComponent(next)}`}
        aria-disabled={pending}
        onClick={() => setPending(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          margin: "20px 0 0",
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
        {pending ? t.googleRedirecting : t.googleButton}
      </a>

      {error !== null && (
        <p
          role="alert"
          style={{ fontSize: 13, color: "var(--color-accent-800)", margin: "12px 0 0" }}
        >
          {error}
        </p>
      )}

      <p className="note" style={{ margin: "16px 0 0" }}>
        {t.googleOnlyNote}
      </p>
    </Blueprint>
  );
}
