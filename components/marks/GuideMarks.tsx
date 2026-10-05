"use client";

import type { Lang } from "@/lib/i18n";
import { MarkButtons } from "./MarkButtons";
import { useTourMarks } from "./useTourMarks";

/** Favoritt og gått på turguiden. Sida rendres på serveren; markeringene er
 *  leserens egne og hentes her, så sida kan bufres og lagres offline uten å
 *  bære med seg noens liste. */
export function GuideMarks({ slug, lang }: { slug: string; lang: Lang }) {
  const { state, update, failed } = useTourMarks();
  return (
    <MarkButtons
      slug={slug}
      lang={lang}
      state={state}
      failed={failed}
      onChange={update}
      returnTo={`/tur/${slug}`}
    />
  );
}
