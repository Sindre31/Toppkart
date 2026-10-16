/** Plassholder — erstattes av `scripts/wiki-popularity/fetch_popularity.py`
 *  (kjøres av `.github/workflows/wiki-data.yml`). Så lenge den er tom, står
 *  turlista i redaksjonell rekkefølge. */

export interface Popularity {
  views: number;
  /** Artiklene tallet er summen av, som «wiki:Tittel». */
  articles: readonly string[];
}

export const POPULARITY_PERIOD: { from: string; to: string } | null = null;

export const POPULARITY: Readonly<Record<string, Popularity>> = {};
