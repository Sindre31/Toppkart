"use client";

/** «Lagre offline» på turguiden — for abonnenter, der det er noe å lagre.
 *
 *  Rendres ikke i det hele tatt før komponenten er montert og vet at
 *  nettleseren kan dette; serveren vet ikke hva som ligger lagret på
 *  telefonen, og en knapp som bytter tilstand ved hydrering er verre enn en
 *  som dukker opp. */

import { useEffect, useState } from "react";
import { Check, Download } from "lucide-react";

import type { Lang } from "@/lib/i18n";
import { guideDict } from "@/lib/i18n/guide";
import {
  SaveError,
  offlineSupported,
  readMeta,
  removeTour,
  saveTour,
  type SavedTour,
} from "@/lib/offline/store";

type State =
  | { kind: "unknown" }
  | { kind: "idle"; error?: SaveError["reason"] }
  | { kind: "saving"; percent: number }
  | { kind: "saved"; tour: SavedTour };

function formatBytes(bytes: number, lang: Lang): string {
  const mb = bytes / 1_000_000;
  const text = mb < 10 ? mb.toFixed(1) : String(Math.round(mb));
  return `${lang === "no" ? text.replace(".", ",") : text} MB`;
}

export function OfflineSave({
  slug,
  name,
  region,
  lines,
  lang,
}: {
  slug: string;
  name: string;
  region: string;
  /** Alle rutene opp, som `[lat, lng]`-par. */
  lines: [number, number][][];
  lang: Lang;
}) {
  const t = guideDict(lang);
  const [state, setState] = useState<State>({ kind: "unknown" });

  useEffect(() => {
    if (!offlineSupported()) return;
    let alive = true;
    readMeta().then((meta) => {
      if (!alive) return;
      const saved = meta.tours[slug];
      setState(saved ? { kind: "saved", tour: saved } : { kind: "idle" });
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  if (state.kind === "unknown") return null;

  const save = async () => {
    setState({ kind: "saving", percent: 0 });
    try {
      const tour = await saveTour({ slug, name, region, lines }, ({ done, total }) =>
        setState({ kind: "saving", percent: total ? Math.floor((done / total) * 100) : 0 }),
      );
      setState({ kind: "saved", tour });
    } catch (err) {
      const reason: SaveError["reason"] =
        err instanceof SaveError
          ? err.reason
          : err instanceof DOMException && err.name === "QuotaExceededError"
            ? "quota"
            : "network";
      setState({ kind: "idle", error: reason });
    }
  };

  const remove = async () => {
    await removeTour(slug);
    setState({ kind: "idle" });
  };

  const error =
    state.kind === "idle" && state.error
      ? {
          network: t.offlineErrorNetwork,
          quota: t.offlineErrorQuota,
          locked: t.offlineErrorLocked,
        }[state.error]
      : null;

  return (
    <>
      {state.kind === "saved" ? (
        <span style={{ display: "inline-flex", gap: 4 }}>
          <span className="btn btn-secondary" style={{ cursor: "default" }} title={t.offlineSavedHint}>
            <Check size={14} strokeWidth={1.5} aria-hidden="true" />
            {t.savedOffline(formatBytes(state.tour.bytes, lang))}
          </span>
          <button type="button" className="btn btn-ghost" onClick={remove}>
            {t.removeOffline}
          </button>
        </span>
      ) : (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={save}
          disabled={state.kind === "saving"}
          title={t.offlineHint}
          aria-live="polite"
        >
          <Download size={14} strokeWidth={1.5} aria-hidden="true" />
          {state.kind === "saving" ? t.savingOffline(state.percent) : t.saveOffline}
        </button>
      )}
      {error || state.kind === "saved" ? (
        /* Egen linje i rada over: knappene står i en `flex-wrap`, og
           `flex-basis: 100%` er det som tvinger meldingen ned under dem. */
        <p className="note" role="status" style={{ flexBasis: "100%", margin: "4px 0 0" }}>
          {error ?? t.offlineSavedHint}
        </p>
      ) : null}
    </>
  );
}
