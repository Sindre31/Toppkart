"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { accountDict } from "@/lib/i18n/account";

/** «03 · Konto» — sletting av kontoen.
 *
 *  Erklæringa har alltid lova dette; her er knappen som holder løftet.
 *
 *  To ting skiller den fra «Avslutt abonnement» ved siden av. Den ene er at
 *  dialogen sier hva som blir borte og hva som blir stående, punkt for punkt,
 *  framfor å oppsummere det: en leser som trykker her har som regel et bestemt
 *  spørsmål — «forsvinner kvitteringene mine?» — og svaret hører hjemme foran
 *  knappen, ikke i erklæringa.
 *
 *  Den andre er at bekreftelsen krever at ordet skrives. Å avslutte et
 *  abonnement kan angres ved å tegne det på nytt; dette kan ikke angres av noen,
 *  heller ikke av oss. Et ekstra trykk er ikke nok av et hinder for en handling
 *  som ikke har en vei tilbake — å måtte skrive ordet gjør at handa må innom
 *  hodet på veien.
 */
export function DeleteAccountCard({ lang }: { lang: Lang }) {
  const t = accountDict(lang);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [typed, setTyped] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const confirmed = typed.trim().toLowerCase() === t.deleteConfirmWord.toLowerCase();

  const closeDialog = useCallback(() => {
    setOpen(false);
    setTyped("");
    const previous = restoreRef.current;
    restoreRef.current = null;
    if (previous) previous.focus();
  }, []);

  function openDialog() {
    restoreRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setNote(null);
    setTyped("");
    setOpen(true);
  }

  /* Fokus lander på «Avbryt», ikke på skrivefeltet. Feltet er det som skal
     koste noe å komme til; utveien skal ikke. */
  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

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

  async function submit() {
    if (!confirmed) return;
    setBusy(true);
    setNote(null);
    try {
      const response = await fetch("/api/konto", { method: "DELETE" });
      if (!response.ok) {
        setNote(t.errDeleteFailed);
        setBusy(false);
        return;
      }
      /* Hard navigasjon, ikke `router.push`. Regelen under har rett for vanlige
         sideskift; dette er ikke et sideskift, det er slutten på en sesjon.
         Kontoen finnes ikke lenger, informasjonskapselen er borte, og alt som
         ligger igjen i klientens router-cache er RSC-nyttelast rendret for en
         leser som ikke er der. En myk navigasjon kan servere den. Å laste sida
         på nytt er den ene måten å være sikker på at ingenting av det følger
         med videre. */
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/");
    } catch {
      setNote(t.errDeleteFailed);
      setBusy(false);
    }
  }

  return (
    <>
      <Blueprint style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
        <h2
          style={{
            fontSize: 18,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            margin: "0 0 12px",
          }}
        >
          {t.deleteCardTitle}
        </h2>
        <p className="note" style={{ margin: 0 }}>
          {t.deleteCardNote}
        </p>
        <div style={{ margin: "16px 0 0" }}>
          <button type="button" className="btn btn-ghost" onClick={openDialog}>
            {t.deleteCardAction}
          </button>
        </div>
        {note && !open ? (
          <p className="note" role="status" style={{ margin: "12px 0 0" }}>
            {note}
          </p>
        ) : null}
      </Blueprint>

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
            aria-labelledby="slett-dialog-tittel"
            style={{ position: "relative", background: "var(--color-bg)" }}
          >
            <i className="corner tl" />
            <i className="corner tr" />
            <i className="corner bl" />
            <i className="corner br" />
            <div className="dialog-title" id="slett-dialog-tittel">
              {t.deleteDialogTitle}
            </div>
            <p className="dialog-body" style={{ margin: 0 }}>
              {t.deleteDialogBody}
            </p>
            <ul className="dialog-body" style={{ margin: "12px 0 0", paddingLeft: "1.2em" }}>
              {t.deleteDialogPoints.map((point) => (
                <li key={point} style={{ margin: "4px 0 0" }}>
                  {point}
                </li>
              ))}
            </ul>

            <label
              className="note"
              htmlFor="slett-bekreft"
              style={{ display: "block", margin: "18px 0 6px" }}
            >
              {t.deleteConfirmLabel(t.deleteConfirmWord)}
            </label>
            <input
              id="slett-bekreft"
              className="input"
              type="text"
              value={typed}
              autoComplete="off"
              disabled={busy}
              onChange={(event) => setTyped(event.target.value)}
              style={{ width: "100%" }}
            />

            {note ? (
              <p className="note" role="status" style={{ margin: "12px 0 0" }}>
                {note}
              </p>
            ) : null}

            <div className="dialog-actions">
              <button
                className="btn btn-secondary"
                type="button"
                ref={cancelRef}
                disabled={busy}
                onClick={closeDialog}
              >
                {t.deleteDialogKeep}
              </button>
              <button
                className="btn btn-primary"
                type="button"
                disabled={busy || !confirmed}
                onClick={submit}
              >
                {busy ? t.deleteDialogBusy : t.deleteDialogConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
