/** Turene sortert etter hvor mye de leses om på Wikipedia (`lib/popularity.ts`).
 *
 *  Stabil: turer med like mange visninger — og alle turer uten artikkel, som
 *  regnes som null — beholder den redaksjonelle rekkefølgen seg imellom, nord
 *  til sør. Er tabellen tom, kommer lista tilbake uendret. */
export function byPopularity<T extends { slug: string }>(
  tours: readonly T[],
  views: Readonly<Record<string, { views: number }>>,
): T[] {
  return [...tours].sort((a, b) => (views[b.slug]?.views ?? 0) - (views[a.slug]?.views ?? 0));
}
