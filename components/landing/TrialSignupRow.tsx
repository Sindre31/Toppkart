"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Lang } from "@/lib/i18n";
import { landingDict } from "@/lib/i18n/landing";

/** «04 · Abonnement» — e-postpåmelding. Adressen sendes videre til
 *  /betaling?email=… slik at kassen kan forhåndsutfylle feltet. */
export function TrialSignupRow({ lang }: { lang: Lang }) {
  const router = useRouter();
  const t = landingDict(lang);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function start() {
    const value = email.trim();
    if (!value) {
      router.push("/betaling");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError(t.emailInvalid);
      return;
    }
    setError(null);
    router.push(`/betaling?email=${encodeURIComponent(value)}`);
  }

  return (
    <>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          start();
        }}
        style={{ display: "flex", gap: 10, alignItems: "stretch", maxWidth: 460, marginTop: 24 }}
      >
        <input
          className="input"
          type="email"
          name="email"
          placeholder={t.emailPlaceholder}
          aria-label={t.emailLabel}
          aria-invalid={error ? true : undefined}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" type="submit">
          {t.emailSubmit}
        </button>
      </form>
      {error ? (
        <p className="note" role="alert" style={{ color: "var(--color-accent-800)", margin: "8px 0 0" }}>
          {error}
        </p>
      ) : null}
    </>
  );
}
