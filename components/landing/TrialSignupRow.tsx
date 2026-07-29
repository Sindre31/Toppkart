"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** «04 · Abonnement» — e-postpåmelding. Adressen sendes videre til
 *  /betaling?email=… slik at kassen kan forhåndsutfylle feltet. */
export function TrialSignupRow() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function start() {
    const value = email.trim();
    if (!value) {
      router.push("/betaling");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Skriv inn en gyldig e-postadresse.");
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
          placeholder="din@epost.no"
          aria-label="E-postadresse"
          aria-invalid={error ? true : undefined}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" type="submit">
          Start prøveperiode
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
