"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import type { Lang } from "@/lib/i18n";
import { FEEDBACK_MAX_LENGTH, feedbackDict } from "@/lib/i18n/feedback";

/** Floating «Gi tilbakemelding» button, bottom right, on every page but one.
 *
 *  `/kart` is excluded deliberately. Its map pane is fixed to the bottom-right
 *  corner, and Leaflet renders the OpenStreetMap attribution there — a credit
 *  the tile licence requires to stay visible. A button floating over it would
 *  cover the one thing on the page that is not ours to hide.
 *
 *  The email is passed down from the server layout rather than fetched here:
 *  the dialog says who the message will be sent as, and a client component has
 *  no session to read.
 */

type State = "idle" | "sending" | "done";

export function Feedback({ lang, email }: { lang: Lang; email: string | null }) {
  const t = feedbackDict(lang);
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
    /* Return focus to the button that opened the dialog, or a keyboard user is
       dropped at the top of the document with no idea where they were. */
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    textareaRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (pathname?.startsWith("/kart")) return null;

  async function submit() {
    const trimmed = message.trim();
    if (!trimmed) {
      setError(t.errorEmpty);
      textareaRef.current?.focus();
      return;
    }
    if (trimmed.length > FEEDBACK_MAX_LENGTH) {
      setError(t.errorTooLong);
      return;
    }

    setState("sending");
    setError(null);
    try {
      const response = await fetch("/api/tilbakemelding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, path: pathname, lang, selskap: "" }),
      });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => ({}));
        const code = (body as { error?: string })?.error;
        setState("idle");
        /* The text stays in the textarea on every failure. Someone has just
           written something; clearing it would be the worst possible response. */
        setError(code === "too_long" ? t.errorTooLong : code === "empty" ? t.errorEmpty : t.errorUnsent);
        return;
      }
      setState("done");
      setMessage("");
    } catch {
      setState("idle");
      setError(t.errorUnsent);
    }
  }

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className="btn btn-secondary feedback-fab"
        onClick={() => {
          setState("idle");
          setError(null);
          setOpen(true);
        }}
      >
        {t.open}
      </button>

      {open && (
        <div
          className="dialog-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="dialog feedback-dialog" role="dialog" aria-modal="true" aria-label={t.title}>
            {state === "done" ? (
              <>
                <h2 className="dialog-title">{t.doneTitle}</h2>
                <p className="dialog-body">{t.doneBody}</p>
                <div className="dialog-actions">
                  <button type="button" className="btn btn-primary" onClick={close}>
                    {t.close}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="dialog-title">{t.title}</h2>
                <p className="dialog-body" style={{ margin: "8px 0 0" }}>
                  {t.intro}
                </p>

                <div className="field" style={{ marginTop: 16 }}>
                  <label htmlFor="tilbakemelding">{t.label}</label>
                  <textarea
                    ref={textareaRef}
                    id="tilbakemelding"
                    className="input"
                    rows={6}
                    maxLength={FEEDBACK_MAX_LENGTH}
                    value={message}
                    placeholder={t.placeholder}
                    onChange={(event) => setMessage(event.target.value)}
                  />
                </div>

                {/* Honeypot: off-screen rather than display:none, which some
                    form-fillers skip, and never announced to a screen reader. */}
                <div aria-hidden className="feedback-trap">
                  <label htmlFor="selskap">Selskap</label>
                  <input id="selskap" name="selskap" tabIndex={-1} autoComplete="off" />
                </div>

                <p className="note-sm" style={{ margin: "10px 0 0" }}>
                  {email ? t.fromSignedIn(email) : t.fromAnonymous}
                </p>

                {error && (
                  <p className="note-sm" style={{ margin: "10px 0 0", color: "var(--color-accent-800)" }}>
                    {error}
                  </p>
                )}

                <div className="dialog-actions">
                  <button type="button" className="btn btn-secondary" onClick={close} disabled={state === "sending"}>
                    {t.cancel}
                  </button>
                  <button type="button" className="btn btn-primary" onClick={submit} disabled={state === "sending"}>
                    {state === "sending" ? t.sending : t.send}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
