"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { VippsNumber } from "@/components/VippsNumber";
import type { Lang } from "@/lib/i18n";
import { supportDict } from "@/lib/i18n/support";
import { nextVisit } from "@/lib/support-prompt";

/** The one-time «Toppkart er gratis — støtt gjerne med Vipps» prompt.
 *
 *  Shown on the third time the reader opens the app, and never again: once is
 *  an invitation, every visit is nagging. «Opens the app» means a new browser
 *  session — a tab or an installed-app launch — not every page view inside it;
 *  see `lib/support-prompt.ts` for the counting.
 *
 *  Everything lives in the reader's own browser. There are no accounts, and
 *  nothing about who saw the prompt is worth sending anywhere. */
const PROMPT_DELAY_MS = 1500;

export function SupportPrompt({ lang }: { lang: Lang }) {
  const t = supportDict(lang);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  /* A moment after the page is up, not on top of it: the reader came for the
     map, and a dialog that lands before the first paint reads as a wall. */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (nextVisit(window.localStorage, window.sessionStorage)) setOpen(true);
    }, PROMPT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      className="dialog-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        className="dialog support-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="stott-tittel"
      >
        <h2 className="dialog-title" id="stott-tittel">
          {t.promptTitle}
        </h2>
        <p className="dialog-body">{t.promptBody}</p>
        <VippsNumber lang={lang} />
        <div className="dialog-actions">
          <button ref={closeRef} type="button" className="btn btn-primary" onClick={close}>
            {t.promptClose}
          </button>
        </div>
      </div>
    </div>
  );
}
