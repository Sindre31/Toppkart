/** Domain types shared by every page. Mirrors the `tours` table sketched in
 *  the design handoff (see design-reference/README.md → «Datamodell»). */

export type Grade = 1 | 2 | 3 | 4;

/** Key figures — rendered on the map and in teasers. */
export interface Tour {
  slug: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  /** Summit elevation, metres above sea level. */
  summitM: number;
  /** Vertical gain, metres. */
  verticalM: number;
  /** Normal duration, e.g. "5–6 t". */
  duration: string;
  grade: Grade;
  /** Compass aspect: N, S, Ø, V, NV, NØ, SV, SØ. */
  aspect: string;
  /** Season window, e.g. "des–mai". */
  season: string;
  teaser: string;
  /** True when an editorially written guide exists for this tour. */
  hasGuide?: boolean;
}

/** The written guide — route, descent, avalanche terrain, elevation profile. */
export interface TourGuide {
  slug: string;
  /** Short intro under the display title. */
  intro: string;
  ascent: string[];
  descent: string[];
  avalanche: { title: string; body: string }[];
  elevationProfile: {
    /** SVG path over a 0 0 600 220 viewBox. */
    path: string;
    startLabel: string;
    endLabel: string;
    distanceLabel: string;
    caption: string;
  };
  gpxPath?: string;
}

/** Hvem leseren er — det som kan avgjøres fra sesjonen alene, uten å slå opp
 *  noe. Navigasjonen og tilbakemeldingsdialogen trenger bare dette. */
export interface Identity {
  email: string | null;
  userId: string | null;
}
