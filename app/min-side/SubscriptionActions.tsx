"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { accountDict } from "@/lib/i18n/account";

/** «01 · Abonnement» — knapperaden og avslutt-dialogen.
 *  Alt som endrer abonnementet går via /api/subscription, som slår opp
 *  abonnementet på nytt fra sesjonen. */
export function SubscriptionActions({
  cancelled,
  periodEnd,
  lang,
}: {
  /** True når abonnementet allerede er avsluttet / avsluttes ved periodeslutt. */
  cancelled: boolean;
  /** Ferdig formatert dato, f.eks. «12. august 2026» — already localised by the
   *  page, so the dialog only has to drop it into the sentence. */
  periodEnd: string;
  /** Read from the cookie by the server component above. */
  lang: Lang;
}) {
  const t = accountDict(lang);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const keepRef = useRef<HTMLButtonElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const closeDialog = useCallback(() => {
    setOpen(false);
    const previous = restoreRef.current;
    restoreRef.current = null;
    if (previous) previous.focus();
  }, []);

  function openDialog() {
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setNote(null);
    setOpen(true);
  }

  // Flytt fokus inn i dialogen når den åpnes.
  useEffect(() => {
    if (open) keepRef.current?.focus();
  }, [open]);

  // Escape lukker dialogen.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeDialog]);

  async function openPortal() {
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch("/api/portal", { method: "POST" });
      const data = (await response.json()) as { url?: string; demo?: boolean };
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.demo) {
        setNote(t.portalDemoNote);
        return;
      }
      setNote(t.errPortalFailed);
    } catch {
      setNote(t.errPortalFailed);
    } finally {
      setBusy(false);
    }
  }

  async function submit(action: "cancel" | "resume") {
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        setNote(t.errSubscriptionFailed);
        return;
      }
      if (action === "cancel") closeDialog();
      router.refresh();
    } catch {
      setNote(t.errSubscriptionFailed);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "16px 24px" }}>
        <button className="btn btn-secondary" type="button" disabled={busy} onClick={openPortal}>
          {t.changePaymentMethod}
        </button>
        {cancelled ? (
          <button className="btn btn-primary" type="button" disabled={busy} onClick={() => submit("resume")}>
            {t.resumeSubscription}
          </button>
        ) : (
          <button className="btn btn-ghost" type="button" disabled={busy} onClick={openDialog}>
            {t.cancelSubscription}
          </button>
        )}
      </div>
      {note ? (
        <p className="note" role="status" style={{ margin: 0, padding: "0 24px 16px" }}>
          {note}
        </p>
      ) : null}

      {open ? (
        <div
          className="dialog-backdrop"
          style={{ zIndex: 100 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div
            className="dialog elev-lg blueprint"
            role="dialog"
            aria-modal="true"
            aria-labelledby="avslutt-dialog-tittel"
            style={{ position: "relative", background: "var(--color-bg)" }}
          >
            <i className="corner tl" />
            <i className="corner tr" />
            <i className="corner bl" />
            <i className="corner br" />
            <div className="dialog-title" id="avslutt-dialog-tittel">
              {t.cancelDialogTitle}
            </div>
            <p className="dialog-body" style={{ margin: 0 }}>
              {t.cancelDialogBody(periodEnd)}
            </p>
            <div className="dialog-actions">
              <button
                className="btn btn-secondary"
                type="button"
                ref={keepRef}
                disabled={busy}
                onClick={closeDialog}
              >
                {t.keepSubscription}
              </button>
              <button
                className="btn btn-primary"
                type="button"
                disabled={busy}
                onClick={() => submit("cancel")}
              >
                {t.confirmCancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
