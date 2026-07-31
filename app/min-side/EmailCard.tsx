"use client";

import { useState } from "react";
import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { accountDict } from "@/lib/i18n/account";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

/** «03 · Konto» — e-postkortet. Endring bekreftes med en lenke til den nye
 *  adressen (Supabase sender den i live-modus; i demo-modus vises bare
 *  bekreftelsen). Ingen nyhetsbrev eller varsler — bevisst fjernet. */
export function EmailCard({ email, lang }: { email: string; lang: Lang }) {
  const t = accountDict(lang);
  const [value, setValue] = useState(email);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function change() {
    const next = value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
      setMessage({ tone: "error", text: t.errInvalidEmail });
      return;
    }
    if (next.toLowerCase() === email.trim().toLowerCase()) {
      setMessage({ tone: "error", text: t.errSameEmail });
      return;
    }

    const confirmation = t.emailChangeSent(next);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage({ tone: "ok", text: confirmation });
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ email: next });
    setBusy(false);
    setMessage(
      error
        ? { tone: "error", text: t.errEmailChangeFailed }
        : { tone: "ok", text: confirmation },
    );
  }

  return (
    <Blueprint style={{ padding: "20px 24px" }}>
      <h2 style={{ fontSize: 18, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 12px" }}>
        {t.emailCardTitle}
      </h2>
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void change();
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          className="input"
          type="email"
          value={value}
          aria-label={t.emailLabel}
          onChange={(event) => {
            setValue(event.target.value);
            if (message) setMessage(null);
          }}
          style={{ flex: 1 }}
        />
        <button className="btn btn-secondary" type="submit" disabled={busy}>
          {t.changeEmail}
        </button>
      </form>
      {message ? (
        <p
          className="note"
          role="status"
          style={{
            margin: "10px 0 0",
            color: message.tone === "error" ? "var(--color-accent-800)" : undefined,
          }}
        >
          {message.text}
        </p>
      ) : null}
      <p className="note" style={{ margin: "10px 0 0" }}>
        {t.emailCardNote}
      </p>
    </Blueprint>
  );
}
