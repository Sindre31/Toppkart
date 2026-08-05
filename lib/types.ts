/** Domain types shared by every page. Mirrors the `tours` table sketched in
 *  the design handoff (see design-reference/README.md → «Datamodell»). */

export type Grade = 1 | 2 | 3 | 4;

/** Free fields — readable by everyone, rendered on the map and in teasers. */
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

/** Gated fields — only served to trialing/active subscribers. */
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

export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export interface Subscription {
  status: SubscriptionStatus;
  /** Set while the subscription is scheduled to end at period end. */
  cancelAtPeriodEnd: boolean;
  /** ISO date of the next charge / end of access. */
  currentPeriodEnd: string | null;
  /** ISO date the trial ends, when trialing. */
  trialEnd: string | null;
  memberSince: string | null;
  paymentMethod: { brand: string; last4: string; expMonth: number; expYear: number } | null;
  plan: "maned" | "ar";
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: string;
  pdfUrl: string | null;
}

/** Hvem leseren er — det som kan avgjøres fra sesjonen alene, uten å slå opp
 *  noe. Navigasjonen og tilbakemeldingsdialogen trenger bare dette. */
export interface Identity {
  email: string | null;
  userId: string | null;
}

export interface Viewer extends Identity {
  subscription: Subscription | null;
  /** True when the viewer may read gated guide content. */
  hasAccess: boolean;
}
