"use client";

import { Check, Star } from "lucide-react";

import { formatDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { marksDict } from "@/lib/i18n/marks";
import type { MarkPatch } from "@/lib/tour-marks";
import type { MarksState } from "./useTourMarks";
import s from "./marks.module.css";

/** «Favoritt» og «Har gått» for én tur — to av/på-knapper, lagret på
 *  enheten. Mens lista leses, og om den ikke kan leses, står de av: en knapp
 *  som ikke vet om turen er favoritt, kan ikke vise det.
 *
 *  To utforminger. `guide`: stjerna som rund ikonknapp og «Har gått» som pill
 *  med tekst, i raden med handlinger øverst i turguiden. `float`: to små
 *  ikonknapper som flyter over bildet i kartpanelet. Trykket inn er begge
 *  blekk-fylt. */
export function MarkButtons({
  slug,
  lang,
  state,
  failed,
  onChange,
  variant = "guide",
}: {
  slug: string;
  lang: Lang;
  state: MarksState;
  failed: string | null;
  onChange: (slug: string, patch: MarkPatch) => void;
  variant?: "guide" | "float";
}) {
  const t = marksDict(lang);

  const ready = state.status === "ready";
  const mark = ready ? state.marks.get(slug) : undefined;
  const favorite = mark?.favorite ?? false;
  const doneOn = mark?.doneOn ?? null;
  const doneLabel = doneOn ? t.doneOn(formatDate(doneOn, lang)) : t.done;
  const iconSize = variant === "float" ? 15 : 16;

  return (
    <>
      <span className={s.row} data-variant={variant}>
        <button
          type="button"
          className={`${s.btn} ${s.icon}`}
          aria-pressed={favorite}
          aria-label={t.favorite}
          title={t.favorite}
          disabled={!ready}
          onClick={() => onChange(slug, { favorite: !favorite })}
        >
          <Star
            size={iconSize}
            strokeWidth={1.75}
            fill={favorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          className={`${s.btn} ${variant === "float" ? s.icon : s.pill}`}
          aria-pressed={Boolean(doneOn)}
          aria-label={variant === "float" ? doneLabel : undefined}
          title={variant === "float" ? doneLabel : undefined}
          disabled={!ready}
          onClick={() => onChange(slug, { done: !doneOn })}
        >
          <Check
            size={15}
            strokeWidth={variant === "float" ? 2.25 : doneOn ? 2.5 : 1.75}
            aria-hidden="true"
          />
          {variant === "float" ? null : doneLabel}
        </button>
      </span>
      {failed === slug ? (
        <p className={s.error} role="status">
          {t.saveFailed}
        </p>
      ) : null}
    </>
  );
}
