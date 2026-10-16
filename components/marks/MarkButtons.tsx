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
 *  som ikke vet om turen er favoritt, kan ikke vise det. */
export function MarkButtons({
  slug,
  lang,
  state,
  failed,
  onChange,
}: {
  slug: string;
  lang: Lang;
  state: MarksState;
  failed: string | null;
  onChange: (slug: string, patch: MarkPatch) => void;
}) {
  const t = marksDict(lang);

  const ready = state.status === "ready";
  const mark = ready ? state.marks.get(slug) : undefined;
  const favorite = mark?.favorite ?? false;
  const doneOn = mark?.doneOn ?? null;

  return (
    <>
      <span className={s.row}>
        <button
          type="button"
          className={`btn btn-secondary ${s.btn}`}
          aria-pressed={favorite}
          disabled={!ready}
          onClick={() => onChange(slug, { favorite: !favorite })}
        >
          <Star
            size={14}
            strokeWidth={1.5}
            fill={favorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
          {t.favorite}
        </button>
        <button
          type="button"
          className={`btn btn-secondary ${s.btn}`}
          aria-pressed={Boolean(doneOn)}
          disabled={!ready}
          onClick={() => onChange(slug, { done: !doneOn })}
        >
          <Check size={14} strokeWidth={doneOn ? 2.5 : 1.5} aria-hidden="true" />
          {doneOn ? t.doneOn(formatDate(doneOn, lang)) : t.done}
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
