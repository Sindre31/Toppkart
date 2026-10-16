"use client";

import { useEffect, useState } from "react";

import { VIPPS } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { supportDict } from "@/lib/i18n/support";

/** «Vipps 966 40 540» with a copy button.
 *
 *  Vipps has no public link that opens a payment to a private number, so the
 *  number itself is the way in: readable at a glance, and one press puts it on
 *  the clipboard ready to paste into the Vipps app. */
export function VippsNumber({ lang }: { lang: Lang }) {
  const t = supportDict(lang);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(VIPPS.number);
      setCopied(true);
    } catch {
      /* No clipboard (insecure context, denied permission): the number is
         right there to read, so there is nothing to recover. */
    }
  }

  return (
    <div className="vipps">
      <span className="vipps-label">{t.vipps}</span>
      <span className="vipps-number">{VIPPS.label}</span>
      <button type="button" className="btn btn-secondary" onClick={copy} aria-live="polite">
        {copied ? t.copied : t.copy}
      </button>
    </div>
  );
}
