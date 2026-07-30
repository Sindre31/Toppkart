/** English editorial content for the tours and the written guides.
 *
 *  `lib/tours.ts` and `lib/guides.ts` stay the Norwegian source of truth — they
 *  are the seed for the Supabase rows and must keep matching them. This module
 *  is the English overlay: teasers keyed by slug, guide prose keyed by slug, and
 *  two `localize*` helpers that hand a page a fully translated object.
 *
 *  Both overlays are populated: all 24 tour teasers and the full `kirketaket`
 *  guide. When a tour is added to `lib/tours.ts`, add its teaser here too — the
 *  fallbacks below keep the page rendering, but it renders in Norwegian.
 *
 *  Peak names (`Store Blåmann`), region names (`Lyngen`) and place names inside
 *  the prose are proper nouns and stay Norwegian in both languages. Elevations
 *  and distances stay metric; only the unit and the decimal separator change
 *  (`moh` → `m`, `5,5 km` → `5.5 km`).
 *
 *  Anything missing here falls back to Norwegian rather than rendering blank, so
 *  a tour added to `lib/tours.ts` without a translation still works.
 *
 *  ⚠️  The guide prose carries the same caveat as `lib/guides.ts`: it is sample
 *  content transcribed from the prototype and is not quality-assured tour
 *  information. Translating it does not make it fit for use in the field.
 */

import { getGuide } from "@/lib/guides";
import { getTour } from "@/lib/tours";
import type { Tour, TourGuide } from "@/lib/types";
import {
  aspectLabel,
  decimalLabel,
  durationLabel,
  rewriteElevationUnit,
  seasonLabel,
} from "./format";
import type { Lang } from "./index";

/* — tour teasers — */

/** English teasers, keyed by tour slug. Mirrors `TOURS` in `lib/tours.ts`. */
export const TOUR_TEASER_EN: Record<string, string> = {
  tromsdalstinden:
    "Tromsø's signature peak: a long, even climb out of Tromsdalen with a big view across to Lyngen.",
  "store-blamann":
    "Kvaløya's steepest classic profile — it asks for stable conditions and careful planning.",
  storgalten:
    "Fjord to summit in outer Lyngen: 1219 metres of vertical straight up from sea level.",
  rornestinden:
    "The friendliest way into the Lyngen Alps — an easy-angled ridge and a roomy descent.",
  kavringtinden:
    "An inner-Lyngen gem where north-facing snow keeps its quality well into May.",
  "hesten-segla":
    "Short tour, big postcard: a descent with Segla in your lap and the sea underneath.",
  rombakstotta:
    "Narvik's pointed landmark — a varied climb and a fine, sustained descent.",
  himmeltindan:
    "Vestvågøy's highest: alpine in character, with lines straight at the Arctic Ocean.",
  stornappstinden:
    "A Lofoten classic in manageable format — plenty of mountain for the vertical.",
  kirketaket:
    "Perhaps Norway's most popular ski tour: a broad ridge, safe line choices, a long season.",
  slogen:
    "Queen of the Sunnmøre Alps — a serious tour for the experienced, in the right window.",
  kolastinden:
    "An alpine classic out of Standaldalen, with a well-known couloir and a grand finish.",
  skala:
    "1848 unbroken metres of vertical from the fjord at Loen — one of the longest descents in the country.",
  fanaraken:
    "A high-mountain tour from Sognefjellet: glacier views and reliable spring snow.",
  steindalsnosi:
    "A 2000er for most people: short, gentle and sun-facing from Sognefjellsveien.",
  galdhopiggen:
    "The roof of Norway on skis — glacier, rope and real altitude; usually done from Juvasshytta.",
  synshorn:
    "Short and safe from Valdresflye — a perfect first tour, and a weather-window tour.",
  bitihorn:
    "A marked horn with a simple normal route and a fine view over Bygdin.",
  rondslottet:
    "Rondane's highest: quiet high-mountain terrain and a reliable spring season.",
  snohetta:
    "Grand and airy, but surprisingly good-natured — once Snøheimvegen opens.",
  storehorn:
    "Hemsedal's local ski-touring hill — a short walk from the car, and no shortage of lines.",
  oksen: "Fjord views in every direction and a steady climb from Tjoflot.",
  melderskin:
    "The great classic of the Rosendal Alps, from the sea to 1426 m.",
  gaustatoppen:
    "Southern Norway's most striking summit — if you can see it, it can see you.",
};

export function teaserFor(slug: string, lang: Lang): string {
  const tour = getTour(slug);
  if (!tour) return "";
  if (lang === "no") return tour.teaser;
  return TOUR_TEASER_EN[slug] ?? tour.teaser;
}

/** A tour with every user-visible field rendered in `lang`: the teaser from the
 *  overlay above, the structured tokens through `./format`. Name and region are
 *  proper nouns and are left alone. */
export function localizeTour(tour: Tour, lang: Lang): Tour {
  if (lang === "no") return tour;
  return {
    ...tour,
    teaser: TOUR_TEASER_EN[tour.slug] ?? tour.teaser,
    aspect: aspectLabel(tour.aspect, lang),
    season: seasonLabel(tour.season, lang),
    duration: durationLabel(tour.duration, lang),
  };
}

export function localizeTours(tours: Tour[], lang: Lang): Tour[] {
  return lang === "no" ? tours : tours.map((tour) => localizeTour(tour, lang));
}

/* — regions — */

/** Region names are proper nouns, so the list is identical in both languages.
 *  Exposed as a function anyway so callers need no `lang` special-casing. */
export function localizeRegion(region: string, _lang: Lang): string {
  return region;
}

/* — written guides — */

/** The translatable half of a `TourGuide`. Geometry (`path`) and the GPX link
 *  are language-independent and are copied from the Norwegian source. */
export interface GuideTextEn {
  intro: string;
  ascent: string[];
  descent: string[];
  avalanche: { title: string; body: string }[];
  elevationProfile: {
    startLabel: string;
    endLabel: string;
    distanceLabel: string;
    caption: string;
  };
}

/** English guide prose, keyed by slug. Mirrors `GUIDES` in `lib/guides.ts`.
 *
 *  Array lengths must match the Norwegian source paragraph for paragraph — the
 *  guide page renders whichever array it is handed, so a short translation
 *  silently drops a paragraph rather than falling back to Norwegian.
 *
 *  The literal `varsom.no` in the avalanche text is load-bearing: the display
 *  (`components/guide/GuideSections.tsx` → `AvalancheBody`) finds that exact
 *  substring and turns it into the link. Keep it spelled that way. */
export const GUIDE_EN: Record<string, GuideTextEn> = {
  kirketaket: {
    intro:
      "Perhaps Norway's most popular ski tour — a broad ridge, safe line choices and a long season. A tour that gives you plenty of mountain for the money, whether it is your first time up or your hundredth.",
    ascent: [
      "From the winter parking at Skarbakkane, follow the broad ridge towards the southwest. The skin track is usually well trodden; keep right where the forest thins out and you avoid the steepest rolls at the treeline.",
      "Above the treeline the terrain opens up. The ridge is low-angle and safe in normal conditions — the steepest section comes between 900 and 1200 m, where many put in gentler switchbacks. The summit plateau is broad and good-natured; the cairn stands at its far southeast end.",
      "In poor visibility: stay on the ridge. The ground on either side falls away more steeply than it looks from the track.",
    ],
    descent: [
      "The normal route down follows the ascent — wide, even and with good flow all the way to the treeline. In good conditions the southwest-facing flank is a natural line, but it loads with wind slab after wind from the northwest.",
      "The most common mistake is drifting too far south on the way down. That puts you above the steep ground dropping into the valley — stay with the track until you can see the parking.",
    ],
    avalanche: [
      {
        title: "The normal route",
        body: "Stays below 30° the whole way in normal conditions. No known runout zones cross the route.",
      },
      {
        title: "Off the route",
        body: "The south and southwest flanks reach 30–40° and collect wind slab. Consider them only in stable conditions.",
      },
      {
        // «varsom.no» is turned into a link in the display (Turguide → AvalancheBody).
        title: "Before you go",
        body: "Check the day's avalanche forecast for Romsdal at varsom.no. Bring a beacon, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "60 m",
      endLabel: "1439 m",
      distanceLabel: "5.5 km",
      caption: "A steady climb the whole way; steepest between 900 and 1200 m.",
    },
  },
};

/** A guide rendered in `lang`. Falls back field-by-field, so a partial
 *  translation still shows everything it has. */
export function localizeGuide(guide: TourGuide, lang: Lang): TourGuide {
  if (lang === "no") return guide;
  const en = GUIDE_EN[guide.slug];
  if (!en) {
    // No prose translation yet — still localise the units in the profile
    // labels, which are data rather than editorial text.
    return {
      ...guide,
      elevationProfile: {
        ...guide.elevationProfile,
        startLabel: rewriteElevationUnit(guide.elevationProfile.startLabel, lang),
        endLabel: rewriteElevationUnit(guide.elevationProfile.endLabel, lang),
        distanceLabel: decimalLabel(guide.elevationProfile.distanceLabel, lang),
      },
    };
  }
  return {
    ...guide,
    intro: en.intro,
    ascent: en.ascent,
    descent: en.descent,
    avalanche: en.avalanche,
    elevationProfile: {
      path: guide.elevationProfile.path,
      startLabel: en.elevationProfile.startLabel,
      endLabel: en.elevationProfile.endLabel,
      distanceLabel: en.elevationProfile.distanceLabel,
      caption: en.elevationProfile.caption,
    },
  };
}

/** `getGuide` + `localizeGuide` in one call. */
export function getLocalizedGuide(slug: string, lang: Lang): TourGuide | undefined {
  const guide = getGuide(slug);
  return guide ? localizeGuide(guide, lang) : undefined;
}
