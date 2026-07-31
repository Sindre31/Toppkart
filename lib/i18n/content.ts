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
  oksen:
    "Fjord views in every direction and a steady climb from Tjoflot.",
  melderskin:
    "The great classic of the Rosendal Alps, from the sea to 1426 m.",
  gaustatoppen:
    "Southern Norway's most striking summit — if you can see it, it can see you.",
  keipen:
    "837 metres of ascent from Medfjordbotnvatnan through the bowl south of Keipen, a steady 33 degrees up to the summit ridge.",
  skarasalen:
    "1438 metres of ascent from the gate on Kvistadvegen, the steepest of it up to the 1074 m col.",
  saudehornet:
    "1154 metres of ascent from the waterworks in Ørsta, and the south ridge holds 33–39° for the last 170.",
  glittertinden:
    "12.6 km and 1180 m of climbing from Veodalen: 7 km of flat approach to Glitterheim, then a steady rise east of Glitterbrean.",
  besshoe:
    "1296 m of climbing from Bessheim: six kilometres along Bessvatnet before Grotådalen, then the gentle east ridge over Brue.",
  rasletinden:
    "750 m and 6 km from Valdresflye: flat for the first 1.2 km, then a step to 1530 m and a gentle ridge from the east.",
  storronden:
    "1140 m of climbing from Spranget: six kilometres of approach to Rondvassbu, then 2.6 km of steady west ridge from the 1440 m junction.",
  skogshorn:
    "836 m of ascent from Trefta up the broad east ridge of Skogshorn; steepest measured step 28.5 degrees.",
  folarskardnuten:
    "Nearly 12 km in from Haugastøl and 950 m of ascent, with one short 37-degree step up out of Folarskardet.",
  lonahorgi:
    "1300 m of ascent from Høyland via Bergsstølen and Breiming, the last 107 up the north ridge from point 1305.",
  vesoldo:
    "834 m of ascent from Byrkjenes, forest up to Fadnastølen and an open south-west shoulder above; the north and west sides fall 48–55°.",
  hamperokken:
    "1400 m of ascent from Fv91, but the skis stay on Middagsaksla at 1076 m – the last 1.4 km is an exposed ridge on foot.",
  breitinden:
    "1020 metres of ascent from Svarthola past Svartholvatnet and Breitindvatnet; the last 140 are a scramble on the summit ridge.",
  geitgaljen:
    "1065 metres of ascent from Liland up Lilandsdalen; the gully from 250 to 360 m runs at 35 degrees and the summit needs crampons.",
  jakta:
    "1560 m of ascent from Norang: a steady climb into Konedalen, then a 33° flank onto the narrow summit ridge.",

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
  tromsdalstinden: {
    intro:
      "Tromsø's signature peak, and 1206 vertical metres in one push from the shooting range in Tromsdalen to the summit cairn. The track stays under 25 degrees the whole way — it is the length, not the steepness, that makes the day.",
    ascent: [
      "From the parking at the shooting range at the end of Turistvegen, follow the forest road southeast into Tromsdalen. Stay on the west side of Tromsdalselva the whole way; the birch lets go already around 220 m, and from there the valley lies open in front of you. Sommerruta takes the NNW ridge out of the valley lower down — that is the walking route, not the ski route.",
      "At its head the valley flattens out by Dalbotnvatnet at 311 m. Just before the basin Svarthammaren rises on the west side — a north-facing cliff that loses close to 100 vertical metres in sixty. Keep to the valley floor east of it and aim for the saddle. The slope up to Salen at 740 m is the steepest single pitch of the tour: around 25 degrees where the track cuts across it, 30 to 35 in the fall line if you take it head on.",
      "From Salen it eases off. Follow the south ridge northeast towards the cairn. The steepest continuous band on the tour lies between 1000 and 1100 m, at a mean of 21 degrees. Above 1100 m the east edge of the ridge is corniced — stay on the west side of the crest, also when the track tempts you further out.",
    ],
    descent: [
      "Back the same way: the south ridge to Salen, then west down into inner Tromsdalen and out the valley to the car. From Salen the flank falls evenly west towards Dalbotnvatnet, and that is where the best turns are.",
      "The common mistake: dropping straight down the west side from the summit. From the cairn the west flank rolls off at 20 to 35 degrees, and that is the whole problem — it looks skiable from up there. Below about 1080 m you are on Fronten: a hundred vertical metres of 45 to 58 degrees, with no way out to either side. Hold the ridge south to Salen before you commit west.",
      "The last kilometres are forest road. The fall is slack — under five degrees the whole way out — so expect to pole.",
    ],
    avalanche: [
      {
        title: "The route itself",
        body: "The track never passes 25 degrees, and the steepest continuous band — 1000 to 1100 m — holds a mean of 21 degrees. The slope up to Salen is the part you have to read. It faces west and northwest, and the fall line measures a mean of 30 to 35 degrees with sections past 40: the track cuts across it, but the snow does not care about the track. It loads in easterly and southeasterly wind, not westerly. Above 1100 m the east edge of the ridge is corniced all the way to the cairn.",
      },
      {
        title: "The terrain off it",
        body: "The west face directly below the summit is Fronten — the guidebook calls it 150 vertical metres of 35 to 50 degrees, and the terrain model agrees. It is a trap because it starts gently: 20 to 35 degrees for the first hundred and fifty metres from the cairn, then 35 to 40, and only below about 1080 m does it run at 45 to 58. The east ridge is steeper than it looks from the track, a mean of 35 degrees and up towards 40. Down in the valley Svarthammaren drops away to the north just before Dalbotn; the route passes it on the valley floor to the east.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Tromsø at varsom.no. Bring transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "38 m",
      endLabel: "1238 m",
      distanceLabel: "8.1 km",
      caption: "8.1 km and 1206 vertical metres: forest road to Dalbotnvatnet, the slope up to Salen, the south ridge to the cairn.",
    },
  },
  "store-blamann": {
    intro:
      "Kvaløya's highest, and a tour that stands apart from the rest of the Tromsø peaks: 1031 vertical metres in three kilometres, with a summit section most people take their skis off for.",
    ascent: [
      "From the parking at Slettneset on Fjordvegen (fv 7768) the marked Blåmann trail heads west straight from the shoreline. The first hundred metres run on duckboards over bog; the forest lets go immediately, and from 56 m upwards you are in open terrain the rest of the way.",
      "The trail climbs evenly west to the shoulder at around 230 m, then swings southwest and gains the ridge above Steet. From 475 m upwards the crest is the entire route. The first three hundred vertical metres up there are broad and forgiving — the flanks fall at only 10 to 25 degrees, and the mountain feels easier than it is. That lasts to about 800 m.",
      "From there you follow the east-southeast ridge west, with the south flank dropping into Blåmannsvikdalen. A flatter intermediate section gives you a breather around 670 m. From about 800 m it tightens on both sides: the south flank goes from 20 to a mean of 42 degrees, with sections past 55, and the north side starts to fall away. The steepest hundred-metre band on the line lies between 900 and 1000 m at a mean of 28.6 degrees, and the steepest single step measures 36.5.",
      "The last 160 vertical metres are steep and airy, with light scrambling towards the cairn. This is where the skis go on the pack. In hard snow or ice you need crampons and an axe, and a helmet belongs with them.",
    ],
    descent: [
      "Back the same way. Downclimb the summit section before you put the skis back on — from the cairn there is no line down the east or north side that does not end in cliffs.",
      "The common mistake: committing to the south flank below the summit because it looks open. It holds 35 to 48 degrees directly under the cairn, and where the route crosses 800 m it averages 42 degrees with sections past 55. It carries straight down into Blåmannsvikdalen. Hold the crest until you are back on the shoulder at 230 m, then follow the trail out.",
      "At around 475 m the route meets the old path from Blåmannsvika. It goes, but it comes out at a different car park than the one you drove to — stay with the marking towards Slettneset.",
    ],
    avalanche: [
      {
        title: "The route itself",
        body: "The route sits on the crest from 475 m upwards, and that is what makes it possible. Up to around 800 m the ridge is broad and the flanks are gentle, 10 to 25 degrees. Above 800 that is over: the south flank averages 42 degrees, the north side 38 and up. The steepest hundred-metre band on the line, 900 to 1000 m, holds a mean of 28.6 degrees, and single steps measure 36.5. The summit section above 880 m is steep and exposed; in hard snow it is a climb, not a ski tour.",
      },
      {
        title: "The terrain off it",
        body: "The summit block falls steeply on every side but west. The north face is the extreme one: 350 vertical metres at 60 to 85 degrees directly below the cairn, one of the country's well-known big walls and nothing you get down. Immediately east and northeast of the cairn the ground falls away in cliffs, with sections at 70 to 80 degrees. The south face holds 35 to 48 degrees down towards Blåmannsvikdalen. Only the west ridge towards Hollendaren is gentle, and it leads away from the car. Ordalen on the north side is a separate cirque and has nothing to do with this route.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Tromsø at varsom.no. Bring transceiver, probe and shovel — and crampons, an axe and a helmet for the summit section.",
      },
    ],
    elevationProfile: {
      startLabel: "9 m",
      endLabel: "1044 m",
      distanceLabel: "3.1 km",
      caption: "3.1 km and 1031 vertical metres: the duckboards at Slettneset, the ridge above Steet, and the steep summit section.",
    },
  },
  storgalten: {
    intro:
      "Fjord to summit in outer Lyngen: 1210 metres of climbing from the roadside where Galtelva runs out into Nord-Lenangen, to the cairn at 1219. A short line, open mountain from 70 m up, and the fjord behind you from the first step.",
    ascent: [
      "Start at Sandneset, where Galtelva runs out into the fjord at 14 m. There is no proper car park here — you pull in at the roadside on Fv7922, Lenangsveien, right by the river mouth. From here go straight into Galtdalen north of Lassofjellet and keep the south bank of the river, which is the right-hand side going up. The birch forest gives up at around 70 m; the rest of the tour is open terrain.",
      "Round the north side of Lassofjellet and aim for the col between Litle-Galten and Storgalten. You do not go all the way up into the col. It bottoms out at 626 m, and going there hands back height you have just gained. Get onto the rib a couple of hundred metres south of the col instead — that is where the climb begins.",
      "Between 800 and 860 m the flank steepens to 30–35 degrees, and the steepest step on the whole line is here: 35.6 degrees between 823 and 849 m. If the snow is wind-scoured and hard, crampons earn their weight. Above 880 m the ridge broadens, but it does not stop climbing — the last 300-odd metres of ascent average about 22 degrees, with a single 32-degree step around 1100 m. Stay on the west side of the crest the whole way: the east and northeast sides fall 36–43 degrees on average into Kalddalen toward Kalddalsvatnet at 477 m, with individual sections at 53–58.",
    ],
    descent: [
      "Back down the same way. From the summit plateau follow the broad ridge north back to the rib south of the col and out into the west flank; from there to the valley floor it is continuous open terrain with no forest to slow you. For more room, traverse southwest just before the final drop toward the col — there is a large flat bowl there that stays under 20 degrees and takes big turns.",
      "The mistake people make: dropping straight west off the summit plateau instead of following the ridge north down to the rib. Gully systems run the whole length of Storgalten's west side, and the steepest sections measure 40–50 degrees. From the ridge you cannot see where they begin, and the entry is hard to read from above — if you mean to ski them, climb them first. The col is not the danger here; the west flank south of the rib is.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The normal route runs in the west flank, in start and runout terrain. The steepest part of the line is the 30–35 degree section between 800 and 860 m, with the steepest step measured at 35.6 between 823 and 849. The hundred metres from 800 to 900 m is the steepest band on the whole route, averaging 26.5 degrees. Below it the flank is open from 70 m down to the fjord, with no forest to slow anything down.",
      },
      {
        title: "The terrain off it",
        body: "Gully systems run the whole length of Storgalten's west side, with sections at 40–50 degrees; the guidebook warns that several of them are steep enough to slide and that the entry is hard to find from above. Cornices build at the summit. The edge that matters is the eastern one: east and northeast of the ridge the ground falls 36–43 degrees on average toward Kalddalsvatnet, with steps of 53–58.",
      },
      {
        title: "Before you go",
        body: "Check the day's avalanche forecast for Lyngen at varsom.no. Bring transceiver, probe and shovel. Crampons are worth the space in the pack for the steep section at 800–860 m.",
      },
    ],
    elevationProfile: {
      startLabel: "14 m",
      endLabel: "1219 m",
      distanceLabel: "3.9 km",
      caption: "From 14 m at Galtelva's mouth to 1219 at the top — 1210 metres of climbing over 3.9 kilometres, with the steepest ground between 800 and 860.",
    },
  },
  rornestinden: {
    intro:
      "The friendliest way into the Lyngen Alps: forest road at the bottom, an easy-angled flank above, and a broad summit plateau to put your turns on. The tour for your first Lyngen day, and for the day the rest of the range is too much.",
    ascent: [
      "Start from the car park at Eidebakken on the edge of Lyngseidet, at 62 m, in the area by the plastics factory and the shooting range. Follow the forest road inland and up toward Hyttehaugen at 286 m, then on past Skihytta. The birch forest gives up at around 310 m, and from there you can see the rest of the tour ahead of you.",
      "Continue west toward Rørneshytta, staying on the south side of Gjerdelva throughout — a variant follows the ridge north of the river up to the flat at around 600 m when the snow cover allows, but the normal route keeps to the south bank. Whichever side you are on: do not go far down into the river valley toward Gjerdelva. The sides dropping into it break at 34–37 degrees where they read as flat from above, and the bottom is a terrain trap. The hut sits at 604 m, and that is where people stop.",
      "From the hut you drop a little before climbing again. You cross Gjerdelva at around 590 m, a dip of some fifteen metres; the tour gives back 38 metres in total on the way up. Then follow the east side of the flank upward to about 850 m and turn from there toward the summit.",
      "Along the line on the map the steepest step is 24.6 degrees, and the hundred metres between 800 and 900 m average 23.5. The flank around you is steeper: between 800 and 920 m there are sections at 30–35 degrees, and measured 400 m out from the track at 910 m the east side runs 31 degrees on average and the north side 34. Take too direct a line for the top and those are what you are standing in. Higher up it flattens out onto the broad summit plateau at 1030.",
    ],
    descent: [
      "Back down the same way. The summit plateau is roomy enough to put your turns where you like — as long as you stay on its south and east side. The north and northwest edges fall away at 40–47 degrees on average with steps of 50–57, and that is where the cornices build. The east flank down to 850 m is the longest continuous run on the normal route, 20–23 degrees along the track. Below that, hold the ascent track down to Rørneshytta and on east toward Skihytta and the forest road.",
      "The mistake people make: letting the descent pull you down into the river valley toward Gjerdelva. The ridge north of the river is itself a documented variant and skis fine — it is the bottom that is the problem. The river valley is a large terrain trap where a person was killed in the winter of 2017, and the sides dropping into it measure 34–37 degrees even though they read as flat from above. Hold your height until you are out of the valley.",
      "The steeper lines off the summit are tours in their own right, not variants of the normal route. Topphenget is a straight line from the summit with sections at 35–40 degrees. Skredbekken heads out toward Gjerdaksla after Topphenget and follows the gully north of it down toward Sollia, with sections at 30–40 degrees; people have triggered slides there before, and you finish a long way from your car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The ascent passes through runout zones from 800 m up. The track itself is easy-angled — the steepest step measures 24.6 degrees, and the 800–900 m band averages 23.5 — but the flank above and beside you holds 30–35 degrees between 800 and 920 m, measured at 31 degrees on average to the east and 34 to the north. That is what releases over you.",
      },
      {
        title: "The terrain off it",
        body: "Cornices are a listed hazard for this tour, and the edge that matters is the north and northwest side of the summit plateau: it falls 40–47 degrees on average with steps of 50–57. Keep off it in poor visibility. The river valley toward Gjerdelva is a large terrain trap where a person was killed in the winter of 2017; the sides dropping into it hold 34–37 degrees. The descent alternatives Topphenget and Skredbekken have sections at 35–40 and 30–40 degrees respectively, and people have triggered slides in Skredbekken before.",
      },
      {
        title: "Before you go",
        body: "Check the day's avalanche forecast for Lyngen at varsom.no. Bring transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "62 m",
      endLabel: "1030 m",
      distanceLabel: "5.3 km",
      caption: "From 62 m at Eidebakken to 1030 at the top — 1004 metres of climbing over 5.3 kilometres, with a dip at Rørneshytta.",
    },
  },
  kavringtinden: {
    intro:
      "Lyngseidet's home peak, and 1243 metres of climbing straight up from the fjord. Ridge on the way up, Østrenna on the way down — the big east-facing gully north of the summit gathers the best snow on the mountain and holds it well into May.",
    ascent: [
      "From the car park at Eidebakken, 63 m, follow the forest road up the east side of Gjerdelva. You pass Rødsteinen in the birch forest around 200 m and carry on up the ridge east of the river. The route never crosses Gjerdelva — if you are crossing water, you are off the line.",
      "The forest lets go at 301 m, and you pass Skihytta at 317. Between Rødsteinen and Skihytta there is a shallow dip to cross before the climbing picks up again, and the terrain only really opens out around 400. The forest roads from Karnes, Solhov, Marieslett and Jensbakk come up onto the same shelf, so which one you pick down in the village matters less than it looks. From here you set a course west toward the northeast ridge and gain the crest around 780 m.",
      "From there follow the ridge south, on or just east of the crest. Between 900 and 950 m the east side stands up past 30 degrees in places, and the steepest single step on the line measures 34. The west side is not an option: it drops 40 to 80 metres per hundred straight down toward Gjerdelva.",
      "The summit ridge narrows over the last hundred metres, and about ninety metres before the cairn a shallow notch takes back a couple of metres of height. This is where the cornices hang out east, over Østrenna: the crest falls 30 to 41 degrees on the east side and 21 to 31 on the west. Change sides in good time and walk the last stretch west of the cornice edge, up to the cairn at 1289.",
    ],
    descent: [
      "The large gully formation directly north of the summit is the descent. It is called Østrenna and it lies east of the crest. The top two hundred metres run 33 to 42 degrees, 37 on average, and the gully is wide enough to be almost a flank — it sits in the lee, fills with wind-blown snow while the summit ridge is being scoured, and usually holds the best snow on the mountain. At the bottom you angle north to get back on the ascent route.",
      "The common mistake: launching off the cornice straight from the summit, and late in the day. The big cornice above the gully releases in the spring sun most years, and when it goes, it goes into the gully you are standing in. The gully faces east and catches the sun before anything else up here, so ski it early — and enter through the shallow notch ninety metres north of the cairn. That is the natural way in, the same gully you meet just before the top.",
      "If you would rather stay out of the gully, ski the northeast ridge you came up. It is steepest between 900 and 800 m, 26 degrees on average, and is often wind-scoured; expect hard snow where the ridge is narrowest.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The northeast ridge is the safest line choice on the mountain, but it is not flat. The east side below the crest runs past 30 degrees in places between 900 and 950 m, the steepest hundred metres on the line itself lies between 800 and 900 m at 26 degrees on average, and the steepest step measures 34. The ridge is often wind-scoured the whole way up — that means hard snow on the crest and wind slab in the lee slopes right beside it.",
      },
      {
        title: "The terrain off it",
        body: "Østrenna lies east of the crest north of the summit and holds 37 degrees on average over its top two hundred metres, with a cornice across its whole head; locals reckon on it running every year when the biggest cornice lets go in the spring sun. The cornices on the summit ridge hang out east, not west — the east side of the crest is the steep one, 30 to 41 degrees against 21 to 31 on the west. West of the northeast ridge the ground falls 40 to 80 metres per hundred down toward Gjerdelva. South of the cairn the flank runs 29 degrees on average and up to 34, the southeast side 36 to 39.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Lyngen on varsom.no. Carry a transceiver, probe and shovel. The ascent is often wind-scoured from the treeline up, so keep crampons in the pack.",
      },
    ],
    elevationProfile: {
      startLabel: "63 m",
      endLabel: "1289 m",
      distanceLabel: "5.2 km",
      caption: "1243 metres from Eidebakken to the cairn; the steepest hundred lies between 800 and 900 m, at 26 degrees on average.",
    },
  },
  "hesten-segla": {
    intro:
      "Senja's shortest big day: 506 metres from Fjordgård up a broad southeast-facing flank, with Segla right in front of you from the summit ridge. Two to four hours car to car.",
    ascent: [
      "From the pay car park in Fjordgård, 48 m, walk up the road named Segla and on up the old alpine slope. The first half-kilometre is flat, and the path is well boardwalked where the ground is wet. At upper Fjordgård, 49 m, the sign marks where the waymarked path leaves — that is where the tour really starts.",
      "The path climbs steadily through the birch of Fjordgardlia and across a couple of streams, and the forest lets go at 204 m. From there the whole flank lies open. The steepest hundred metres is 300 to 400 m, and it averages 20 degrees: broad, even, unbroken.",
      "At 440 m you reach the saddle between Hesten and Stavelitippen. Here you turn west onto the east ridge. It runs almost level for the first hundred metres before it starts to climb, and the top step is short and sharp: fifty metres of height in fifty-odd of horizontal, around 40 degrees, rock and scrambling. Leave the skis at the saddle. The 556 m summit is taken on foot.",
    ],
    descent: [
      "Back down the same way. From the saddle the flank falls evenly in the fall line toward Fjordgård, four hundred metres of height without a break, and you run out into the birch and on down the old alpine slope to the car.",
      "The common mistake: putting the skis on at the summit. Directly west of the cairn the mountain drops 435 metres in 160 — the first sixty at 77 degrees — and carries straight on into Medfjorden, and the east ridge is rock under the snow. Click in at the saddle, not before.",
      "The other mistake comes in flat light. From the saddle the ground also tilts north, down toward Korkedalen, and that is the wrong side of the mountain. Due south is not the way home either: it puts you out on the shelf at Seggelskaret, and below that the mountain drops 60 degrees into Medfjorden. The fall line to Fjordgård points southeast from the saddle and swings east below the treeline. Follow it and you come out in the village on your own.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The flank is broad and even. The steepest hundred metres, 300 to 400 m, averages 20 degrees, and the steepest single step on the line measures 31.5. There is no cliff band on the line itself. The flank faces southeast where it is steepest and swings east lower down, so it takes the sun early in the day — late in the season the good hours are short.",
      },
      {
        title: "The terrain off it",
        body: "From west round to south there is no runout: directly west of the cairn the mountain drops 435 metres in 160 and straight into Medfjorden, and southwest and south are just as steep. Northwest, by contrast, is gentle — a ridge that stays above 480 m — so it is the west and south sides you keep away from. The summit knob and the east ridge are exposed rock, often iced. North of the saddle the ground tilts toward Korkedalen, away from the village.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sør-Troms on varsom.no. Carry a transceiver, probe and shovel. The summit knob is often iced, so bring crampons if you want the top — and be ready to turn around at the saddle.",
      },
    ],
    elevationProfile: {
      startLabel: "48 m",
      endLabel: "556 m",
      distanceLabel: "2.1 km",
      caption: "506 metres from Fjordgård; the flank averages 20 degrees where it is steepest, between 300 and 400 m.",
    },
  },
  rombakstotta: {
    intro:
      "Narvik's landmark peak, and a long day in four distinct stages — forest, lake, valley and ridge. The tour asks you to be comfortable with a short scramble on the summit block.",
    ascent: [
      "Parking is at the road barrier in Forselvveien above Djupvik. Walk past the barrier to where the road ends in the old quarry at 141 m, then a hundred metres further in the same direction before you head into the forest. The first three hundred metres of climbing are steep and dense; follow the gradually easing ground up and to the left until you stand at Pumpvatnet at 325 m.",
      "Cross the lake on the ice and leave it at the south-east corner, where an old forest track takes you into the stream valley along Forsneselva toward Forsnesvatnet. The forest lets go at 457 m and the rest of the valley is open ground. At the valley head around 650 m, north of Forsnesvatnet, turn east into the small dale that leads to Isvatnet.",
      "Isvatnet lies at 820 m. Round it on the north side — there is a continuous bench there, four to twenty-four degrees, that carries you east from 850 to 950 m without touching anything steep. Hold the bench the whole way. The shoulder immediately east of the lake, below and to your right, is a crag band measuring 53 to 63 degrees.",
      "From 950 m the bench runs on east until you gain the south-east ridge at about 1145 m. From there follow the crest north-west to the summit. The last thirty metres are not ski terrain: a short steep snowfield and two short passages of easy climbing. An ice axe is worth carrying, and crampons if the snow is hard; you do not need a rope.",
    ],
    descent: [
      "Back down the same way. The skiing is broken into many short pitches rather than one long one — off the ridge to Isvatnet, across the bench, down the small dale and through the stream valley to Pumpvatnet. If you want something steeper, Rombaksrennene start from the col at 1070 m immediately east of the summit. They look steeper than they are, but they are avalanche terrain, and they fall north toward Rombaken — not back to Isvatnet.",
      "The common mistake: assuming you can ski straight off the summit. You cannot. The north side is Rombaks-S'en, and it measures 52 degrees on average over the first four hundred metres, with sections over 70 — then 41 degrees the whole way down toward Rombaken. It is exposed enough that a fall can be fatal, and it is a line for people who have skied it before. North-east and east are nearly as steep, 48 and 44 degrees, and feed into Rombaksrennene. And west, which looks like a shortcut back to the bench, runs into a crag band over 60 degrees between 1060 and 1090 m. Hold the crest south-east until you are down at 1145 m and can see Isvatnet.",
      "Below the treeline at 457 m it gets tight again. Follow your ascent track down to the road end — the forest here is steep and hard to read, and your own track is faster than hunting for a better line.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line as drawn stays under 30 degrees the whole way. The steepest hundred metres sit between 500 and 600 m at a mean of 19.8 degrees, and the steepest single step measures 27.9 degrees. The bench north of Isvatnet runs at four to twenty-four degrees. The summit block is the exception — that is climbing, not ski terrain.",
      },
      {
        title: "The terrain around it",
        body: "The summit falls away steeply on every side except the south-east ridge you came up. Measured four hundred metres out from the top: north 52 degrees on average, north-west 48, north-east 48, east 44 — against 13 on the south-east ridge. The north side is Rombaks-S'en, and Rombaksrennene start from the col at 1070 m east of the summit. The west side holds a crag band over 60 degrees between 1060 and 1090 m, and the crag band immediately east of Isvatnet measures 53 to 63. All of it lies off the route, and all of it is easy to drift into when the visibility goes.",
      },
      {
        title: "Before you go",
        body: "Check the day's avalanche forecast for Ofoten at varsom.no. Bring a transceiver, probe and shovel — plus an ice axe for the summit block, and crampons if the snow is hard.",
      },
    ],
    elevationProfile: {
      startLabel: "141 m",
      endLabel: "1231 m",
      distanceLabel: "5.2 km",
      caption: "5.19 km and 1095 m of climbing from the quarry in Forselvveien; the steepest hundred metres sit between 500 and 600 m.",
    },
  },
  himmeltindan: {
    intro:
      "Vestvågøy's highest mountain, starting on the shore at Haukland and climbing 982 m in three and a half kilometres. A short tour, but the last third is steep and the summit ridge is narrow.",
    ascent: [
      "From the car park at Hauklandstranda, six metres above the sea, head north toward the southern portal of the tunnel to Utakleiv. Not through the tunnel: take the service road that climbs north-east over it, past Klumpan, and follow it until it levels out on the bench at 150 m at the mouth of Durmålsdalen. The marked path starts here, and it runs all the way up to the cairn at 931.",
      "Continue north-east up the south side of Durmålsdalen. The ground is open the whole way — there is no forest on this tour — and the line settles into long zig-zags up toward the shoulder at Molheia. It steepens from 700 m: the hundred metres between 700 and 800 m run at a mean of 28.6 degrees, and the steepest step on the line measures 36.1 degrees. Do not cut straight up the west flank of the summit ridge; it runs at 34 to 37 degrees on average with sections to 46. You take the height on the shoulder on the south side.",
      "From Molheia at around 800 m it is only thirty metres up to the 830 m sub-peak and the small flat there. That is the last wide ground on the tour — south-east of the flat the terrain falls at 38 degrees on average. From here on you are on the ridge.",
      "From the flat the ridge runs north, and it is narrow. Follow the crest to the cairn at 931. Do not step out onto the east side — large cornices hang there over very steep ground: below the cairn the east flank measures 42 degrees on average, the south-east flank 44, with sections of 54 to 57. Further north the ridge drops to 898 m and then rises to the main top, which measures 956 m in the terrain model. A military radar installation stands on the ridge at 936 m, a hundred metres or so below the top; the ground around it is closed, so follow the crest past it and obey the signs on site.",
    ],
    descent: [
      "Back along the ridge to the sub-peak, on the crest or just west of it. From there you have close to seven hundred unbroken metres down the wide Durmålsdalen to the bench at 150 m. For a variation, turn right into Øvredalen just before the sub-peak and follow the flank between the valleys until it eases at around 600 m, then back left into Durmålsdalen.",
      "The common mistake: following Durmålsdalen all the way down. That puts you out on the Utakleiv side with the tunnel between you and the car. Keep right where the valley flattens at around 150 m and take the service road over the tunnel back to Haukland.",
      "The lee slopes to the east and south are steep and sit directly under the cornices on the summit ridge. They fall eight hundred metres to the access road on the south and east sides of the mountain, which runs between 75 and 180 m — not into Durmålsdalen. Choose them deliberately, not because you came off the ridge on the wrong side.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The lower half is gentle and open. It steepens from 700 m: the hundred metres between 700 and 800 m run at a mean of 28.6 degrees, and the steepest step on the line measures 36.1 degrees. From the sub-peak north the ridge is narrow, with a drop to 898 m and fifty metres of re-climb before the main top.",
      },
      {
        title: "The terrain around it",
        body: "The east side of the summit ridge carries large, permanent cornices over very steep ground. Measured from the cairn, the east flank falls at 42 degrees on average and the south-east flank at 44, with individual sections of 54 to 57. Stay on the crest or just west of it the whole way from the sub-peak north. The west flank above Durmålsdalen runs at 34 to 37 degrees on average with sections to 46, and is not to be cut directly, going up or coming down.",
      },
      {
        title: "Before you go",
        body: "Check the day's avalanche forecast for Lofoten og Vesterålen at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "6 m",
      endLabel: "956 m",
      distanceLabel: "3.6 km",
      caption: "982 m of climbing from the shore at Haukland over 3.55 km; the steep ground sits between 700 and 800 m.",
    },
  },
  stornappstinden: {
    intro:
      "The Lofoten classic in manageable format: 680 vertical metres from the roadside to a cairn standing right on the edge of the cliff. Short enough for an afternoon, big enough to become a favourite.",
    ascent: [
      "From the car park at the ski tow in Nappskaret, a kilometre west of Napp, head north and keep left of the lift. Just above the top pylon, at 139 m, the paths from the various car parks converge into one track — if you start from the western car park a little over 250 metres away, you join the same track here. From 61 m and upwards you are above the treeline the whole way; there is no forest on this route.",
      "The track swings northeast into the valley between Okstinden and Litlnappstinden and crosses Myrlandselva at around 215 m. Continue up the valley to the hollow at Skarvatnet, the frozen tarn at 341 m. Keep left towards Middagstinden, then work right where the terrain lies gentlest — that is the line that takes you up without touching the south flank.",
      "Above 500 m the ground rears up into a short, steep step onto the ridge at 560 m. The steepest 100-metre band on the route still lies between 400 and 500 m and averages 21.6°; the steepest single step on the whole line measures 34°. Above the step it eases, and from around 724 m the broad summit plateau runs east as a 13-degree ramp to the cairn.",
      "The cairn at 740 m stands on the lip of the east face. Stop at the cairn. The summit carries big cornices to the east, and the east and northeast sides above Napp and Perklubben fall at 42–43° on average with rock bands over 60° — that is cliff, not a line.",
    ],
    descent: [
      "Back the way you came. The valley between Okstinden and Litlnappstinden gives varied skiing, and from the hollow at Skarvatnet it is open all the way down to the lift.",
      "The common mistake: dropping south off the summit plateau because it looks shorter. The south side directly below the summit falls at close to 39° on average, with sections over 50°, and that is where the slides run on this mountain. Hold west instead — west is the gentlest side of the mountain, 22° on average — and follow the ascent back to the hollow.",
      "Fifty metres out from the cairn you turn left, due south, into the gully: 40° and 400 metres long, and it opens into a wider section right above Litlnappstinden. That is a decision of its own, not a shortcut.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The climb through the valley is gentle: the steepest 100-metre band is 400–500 m at an average of 21.6°. But the average hides the steepest single step on the line, which measures 34°, and the step onto the ridge at 560 m is short and steep. Those are the parts of the normal route that can release.",
      },
      {
        title: "The terrain around it",
        body: "The summit carries big cornices to the east, and the east and northeast sides above Napp and Perklubben fall at 42–43° on average with rock bands over 60°. The south flank directly below the summit holds close to 39°, and the gully south of the cairn 40° over 400 metres. West is the gentlest side, 22° on average. Leave the normal route and those are what you are choosing between.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Lofoten og Vesterålen at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "61 m",
      endLabel: "740 m",
      distanceLabel: "2.8 km",
      caption: "61 to 740 m over 2.8 kilometres: steady climbing through the valley, one steep step, then flat ground to the cairn.",
    },
  },
  kirketaket: {
    intro:
      "Possibly Norway's most popular ski tour — a broad ridge, safe line choices and a long season. A tour that gives you a lot of mountain for the money, both the first time and the hundredth.",
    ascent: [
      "From the car park at Hellerøra (Øvre Kavli), 185 m, follow the toll road north for the first kilometre, until it crosses Heiaelva. Round the bend and onto the track towards Kavlisetra and Måsvassbu.",
      "At around 420 m you leave the Måsvassbu track and climb northeast through open birch. The forest lets go right there: above 421 m it is open ground the rest of the way. The objective is Vesttoppen på Steinberget, 766 m.",
      "From Vesttoppen follow the crest east to Steinberget, 981 m. The ridge is continuous and rises steadily, but just north of Steinberget it drops 18 metres into a notch before rising again. You climb those 18 metres back on the way out — they are part of the tour's 1271 vertical metres.",
      "From here the southwest ridge runs north-northeast to the top. The steepest 100-metre band of the whole ascent lies between 1300 and 1400 m: 26° on average, with a single step of 30°. Cornices hang out on both the east and the west side of the summit ridge; stay on the ridge and clear of both edges all the way to the cairn at 1439.",
    ],
    descent: [
      "The standard descent runs south off the summit, down the south flank to Kavliheian — 950 unbroken vertical metres — and from there in groomed tracks back to Øvre Kavli. The upper part can hide rocks early in the season; the best snow is lower down. The south flank is also the first place in the area to get tracked out after a snowfall, so be early if you want it untouched.",
      "The common mistake: treating the south flank as the default regardless of conditions. The upper part holds 30–35°, and the avalanche terrain sits in two bands, 1300–1400 m and 950–1050 m — and you pass through both on the way up as well. If the forecast does not allow it, you go back over Steinberget, the way you came, and back up through the notch.",
      "Vestrenna is the other way down: a steady 42–48°, with a 60-metre section of about 55° where the gully is narrowest, then out down the valley to Loftskarsetra and through the forest to the car park. It needs stable spring snow or stable winter conditions and an assessment of its own — the snow quality in the gully is harder to judge than it is to ski. It is not something you choose on the summit.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The climb over Steinberget is the gentle line on this mountain, but it is not avalanche-free. The avalanche terrain sits in the bands 950–1050 m and 1300–1400 m, and you pass through both on the way to the top. The steepest 100-metre band of the ascent is exactly 1300–1400 m, averaging 26° with a single step of 30°.",
      },
      {
        title: "The terrain around it",
        body: "The summit ridge carries cornices on both the east and the west side, and what is under them is not gentle: the northeast side falls at 44° on average, the north and southeast sides at 36°, and all three have rock bands over 60°. The south flank below the summit is 30–35° at the top, and Vestrenna 42–48° with a 60-metre section of about 55°. Northwest of the Steinberget ridge the ground falls away towards Loftskarsetra at around 27° on average, with steps up to 46°.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Romsdal at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "185 m",
      endLabel: "1439 m",
      distanceLabel: "5.9 km",
      caption: "185 to 1439 m over 5.9 kilometres: toll road, birch forest to 421, then ridge all the way — 1271 vertical metres including the notch north of Steinberget.",
    },
  },
  slogen: {
    intro:
      "The queen of the Sunnmøre Alps, and one of the most serious tours in the region. 1482 vertical metres from Norangsdalen to a summit most people walk the last 350 metres to.",
    ascent: [
      "From the lay-by at Skylstad in Norangsdalen, 84 m, you climb straight up Brekkheida. Stay west of Brekkeelva the whole way through the forest — the river runs a couple of hundred metres east of the line, and you only meet the watercourse up on the flat around 700 m. This is the steepest part of the forest: the hundred metres between 400 and 500 m average 29.5°.",
      "The treeline lets go at 659 m. From there you follow the Patchellhytta trail onto the flat southwest of the hut, just over 795 m. Leave the hut track here. Turn west up the east ridge before you cross the 1000 m level — go further in toward Steinreset and you give the height back on the wrong side of the ridge.",
      "Pukkelen tops out at 1143 m. From there the ridge drops 26 metres to a notch before rising to høgde 1204, and beyond that it is 56 metres down to the col at 1148 before the summit ridge proper. Keep to the right of the ura, the boulder field.",
      "Most people walk the last 350 vertical metres. The summit ridge narrows with every step: 40 vertical metres below the top the north side falls 43° and the south side 50°, and from the summit itself the north flank measures 57° and the south flank 49° over the first 200 metres out. The top 70 metres are a knife edge. The summit is 1564 m.",
    ],
    descent: [
      "Back down the same line: on foot down the summit ridge, on skis again from the col at 1148 m, back over høgde 1204 and Pukkelen and down the east ridge to the flat at 795 m. From there down Brekkheida to Skylstad.",
      "The common mistake: being tempted onto the snowfields on the flanks instead of holding the crest. Both sides are steepest directly under the ridge. The north side runs 57° over the first 200 metres and holds over 50° for 300 vertical metres before easing into the ura around 1080 m; the south side falls 49°, with a crag band between 1530 and 1395 m where single steps measure 78°. This is where the serious accidents have happened. Hold the ridge until you are back on Pukkelen.",
      "The south side straight down to Norangsdalen looks short from the top. It drops close to 1500 vertical metres to the valley floor and averages 44° from 1200 m down to 350, with single steps over 50°. The summer råse from the Øye car park does not go here — it follows the southeast ridge at 25–33° and joins the east ridge at høgde 1204. The south side is not a descent.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The forest section above Brekkheida is steepest between 400 and 500 m, averaging 29.5°, and the steepest single step on the line measures 40.7°. The ridge from Pukkelen to høgde 1204 is mild: its flanks run 26–35°. It is the top 250 vertical metres that are a crest — 43–57° on the north side, 49–50° on the south. There the real hazard is a slip rather than a slab, and that is why the skis get carried.",
      },
      {
        title: "The terrain off it",
        body: "East of Brekkheida lie Karvigrova and Smørskredene, a gully and a whole mountainside, both emptying down toward Norangsdalen. Karvigrova runs barely a hundred metres east of the line down in the forest; drift east on the way down and you are in it. The south side of the mountain, directly above Norangsdalen, drops close to 1500 vertical metres and averages 44° through its middle third.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring transceiver, probe and shovel, and an ice axe: the summit ridge is walked, and the snow flanks below it demand a self-arrest technique.",
      },
    ],
    elevationProfile: {
      startLabel: "84 m",
      endLabel: "1564 m",
      distanceLabel: "5.2 km",
      caption: "84 m at Skylstad to 1564 on Slogen — 1482 vertical metres over 5.22 kilometres, the last 350 on foot.",
    },
  },
  kolastinden: {
    intro:
      "Sunnmøre's best-known ski summit. A gentle valley the whole way in, then a north-facing passage over 40°, a glacier — and a summit a metre and a half wide.",
    ascent: [
      "From the car park at Standaleidet, 376 m, you follow the cleared track north toward Fossane below Søre Sætretind. The forest lets go already at 410 m, and the waterfall marks the mouth of Kvanndalen.",
      "Follow the valley floor along the riverbed northward. The terrain is gentle: the steepest hundred-metre band, between 800 and 900 m, averages 18.5°. Do not turn west where the valley opens around 650 m — that gorge leads up into the glacier's outflow. Hold north to Appelsinhaugen at 950 m, the natural rest point halfway.",
      "From Appelsinhaugen you head west-southwest onto the flat in Kvanndalsskardet, just over 1020 m. From here up to Stretet it is steep: measured steps on the north-facing side pass 45°. Stretet sits at 1140 m, a narrow passage on the edge, and above it you see the summit.",
      "Above Stretet you are on Kolåsbreen, glacier from 1173 to 1355 m. Follow the glacier edge under the crest southwest toward the top. Most people take the skis off around 1350 m and walk the final pitch, which measures 47°. The summit is 1432 m, one and a half to two metres wide and ten metres long, with a cornice to the east — stay in the middle — and a west side that drops 260 vertical metres in 160, with steps over 65°.",
    ],
    descent: [
      "Back down the same line you meet the two steep steps in reverse order: the summit pitch from 1432 to 1350, which measures 47°, and the north-facing side from Stretet down toward Kvanndalsskardet, where measured steps pass 45°. Take both on a traverse and with spacing between people. From Kvanndalsskardet down, the terrain stays under 30° the whole way out of Kvanndalen.",
      "The common mistake: drifting too far west on the way down from Appelsinhaugen. That puts you in the gorge draining the glacier out of Kvanndalen — narrow, with steep sides above it. Hold the riverbed in the valley floor until you see Fossane.",
      "On days without avalanche danger Kolåsbreen gives a wider descent with several line choices. The bergschrund between the glacier and the summit slope opens as the season goes on: covered in midwinter, open by the time spring comes in.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The valley through Kvanndalen is gentle, averaging 18.5° over its steepest hundred-metre band. Steep terrain comes in two places: the north-facing side from Kvanndalsskardet up to Stretet, where measured steps pass 45°, and the summit slope above 1350 m at 47°. Both face north.",
      },
      {
        title: "The terrain off it",
        body: "The east side of Kvanndalen takes the avalanche paths off Sætretindane, and their runout zones lie in the valley floor you are travelling — several of them are crossed on the way in. To the west, where the valley opens around 650 m, runs the outflow gorge from Kolåsbreen: narrow, with steep sides above it.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring transceiver, probe and shovel. An ice axe belongs above Stretet, and crampons when the snow is hard.",
      },
    ],
    elevationProfile: {
      startLabel: "376 m",
      endLabel: "1432 m",
      distanceLabel: "5.4 km",
      caption: "376 m at Standaleidet to 1432 on Kolåstinden — 1076 vertical metres over 5.35 kilometres, glacier from 1173 m.",
    },
  },
  skala: {
    intro:
      "From Tjugen in Loen to 1848 m: 1815 vertical metres in one unbroken climb, and one of the longest descents in the country. The tour asks for fitness and visibility, not steep-skiing technique.",
    ascent: [
      "From the Tjugen car park on Lodalsvegen, 34 m, follow the tractor road that becomes Kloumannstien and climbs into Fosdalen. The first 540 metres are on road; then the path takes over. The forest lets go at around 426 m, at Tyvasætra, and from mid-May reckon on carrying your skis up to Tjugensætra at about 750 m.",
      "You cross the river at around 650 m. The path swings north for a stretch before working back south — follow it; the gorge below is not something to cut across. Then come about 400 vertical metres of steady climbing up toward Skålavatnet. The path works up the hillside in bends, and no hundred metres on this stretch holds more than 18°.",
      "You pass Skålavatnet on its northwest side, 1141 m, and continue southeast into the basin. From there take up to the left onto the broad ridge toward Sandsnibba. The steepest hundred metres on the whole line sit between 1400 and 1500 m and hold 22.8° on average; the steepest single step measures 29.1°.",
      "Skålabu and Skålatårnet stand at 1835 m, where the path formally ends. The summit is 370 metres further east, flat plateau the whole way. In poor visibility: hold the ridge. It is easy walking, but it falls steeply on both sides — 56° on average over the first 200 metres to the northwest, 42° to the south — and the cornice hangs out over the northwest edge.",
    ],
    descent: [
      "You go down the same line: across the plateau, out along the ridge, into the basin and past Skålavatnet on the northwest side, then down Fosdalen. 1815 vertical metres in one run. If you want something steeper, follow the summit ridge further out and set your line in the southwest-facing flank — that is the usual variation. Directly southwest of the tower stands a rock step of 60–66°, so you have to get out along the crest before you drop in; from there the flank holds 24–26° on average with steps of 39–44°, against 22.8° on the ascent.",
      "The most common mistake: leaving the crest too early. The north and northwest sides directly below the summit are cliff — 64° in the first 80 metres — and the south side is not much kinder at 42°. Hold the crest until you are down in the basin, then keep northwest of Skålavatnet and down into Fosdalen. Drift west of the lake and you are standing above rock bands that measure 68° down toward Loen. From mid-May the snow ends around Tjugensætra, and the last 750 vertical metres are on foot.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line itself is gentle — steepest hundred metres 22.8° on average, steepest single step 29.1°. The danger is what you travel beneath: slides run along Fosdøla and Skålelva, and on the north side of the summer route once you have passed Skålavatnet.",
      },
      {
        title: "The terrain off it",
        body: "Directly below the summit the northwest side falls 56° on average over the first 200 metres, 64° at the top, and the north side 51°; the south side falls 42°. It is over the northwest edge that the cornice hangs, and there is no way out in either direction. West of Skålavatnet the mountainside down toward Loen breaks up into rock bands of 68°. The southwest-facing flank out along the summit ridge is gentler, 24–26° on average, and that is where the steeper descent variation runs.",
      },
      {
        title: "Before you go",
        body: "Check the day's avalanche forecast for Indre Fjordane at varsom.no. Bring transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "34 m",
      endLabel: "1848 m",
      distanceLabel: "6.9 km",
      caption: "1815 vertical metres from Tjugen to the summit — the steepest hundred sit between 1400 and 1500 m.",
    },
  },
  fanaraken: {
    intro:
      "A high-mountain tour from Sognefjellsvegen to 2068 m, with Fannaråkhytta standing on the summit itself. Few vertical metres and gentle angles — but the route crosses a glacier, and that decides your kit.",
    ascent: [
      "You start at Korpen, the car park on rv55 by Prestesteinsvatnet, 1397 m. The first kilometre and a bit goes downhill: follow the west shore of the lake down to the dam at the outlet, 1343 m. You give back 53 vertical metres before you have started climbing. Stay on land along the west shore — do not cut across the ice.",
      "Past the dam you pull up into the hollow east of Steindalsnosi's north ridge and onto Fannaråkbreen at around 1550 m. Keep low and on the gentle part of the glacier. It is crevassed, and you cross it roped.",
      "Aim for the 1688 knoll east of Fannaråknosi and round it. Do not hold height above the glacier: go too high before you turn up and the passage onto the east ridge becomes substantially steeper. The steepest hundred metres sit between 1800 and 1900 m and hold 27.5° on average, and the steepest single step on the line measures 42.7°.",
      "Round the knoll you come onto the southeast ridge and the summer path from Keisarpasset. Follow it over Fannaråknosi and on along the east ridge to Fanaråken. Large cornices hang on the north side the whole way, and the north side falls 55–58° in the top 90 metres below the crest — keep to the south of it, also when the visibility is good.",
    ],
    descent: [
      "You follow the same line down — east and northeast facing, even and gentle, with reliable spring snow well into the season. The other documented route, from Turtagrø through Helgedalen, gives 1196 vertical metres and is a different day.",
      "The most common mistake: holding height above the glacier on the way down, so you end up too high west of the 1688 knoll and have to come down where it is steepest. Drop around the knoll the way you came up. And remember the last stretch is not free: from the dam it climbs 53 vertical metres back to Korpen.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The normal route is gentle — the steepest hundred metres hold 27.5° on average between 1800 and 1900 m. The steepest single step on the line measures 42.7°, and it lies in the transition from the glacier up onto the east ridge just east of Fannaråknosi; go too high across the glacier and that passage gets steeper than it needs to be. On Fannaråkbreen the crevasses are as much of a hazard as the snow.",
      },
      {
        title: "The terrain off it",
        body: "The north side of Fanaråken carries large permanent cornices and falls 55–58° in the top 90 metres below the crest — that side is not an option, up or down. The west and southwest sides down toward Marangsgjelet hold 34° steadily, with 38–40° between 1360 and 1420 m; that is where the Helgedalen route runs, a separate documented line, not a way out of the normal route.",
      },
      {
        title: "Before you go",
        body: "Check the day's avalanche forecast for Jotunheimen at varsom.no. Bring transceiver, probe and shovel — and rope and a glacier harness, the route crosses Fannaråkbreen.",
      },
    ],
    elevationProfile: {
      startLabel: "1397 m",
      endLabel: "2068 m",
      distanceLabel: "6.4 km",
      caption: "757 vertical metres from Korpen to the summit — 89 of them you give back, most before the climbing starts.",
    },
  },
  steindalsnosi: {
    intro:
      "758 metres of climbing from Sognefjellsvegen to 2025 m, all of it above the treeline. The normal route takes the west side; the north side of the same mountain is another tour entirely, and the line between them runs across the summit plateau.",
    ascent: [
      "From the plowed pull-out at Gjuvvatnet on Sognefjellsvegen, 1274 m, head east into the valley hollow. Keep to the south shore of the lake — it is solid ground the whole way, and you avoid giving back the thirty metres down onto the ice. If the roadside is full, the alternative is the parking at Galgebergstjørnane a couple of kilometres north; the corridor works from there too.",
      "The hollow takes you due east past a small lake at 1428 m. This is open ground from the first step to the summit — no forest, no treeline to work around. At roughly 1500 m you pull northeast out of the hollow and up towards a faint, west-facing ridge formation. That ridge is the rest of the tour.",
      "The ridge climbs steadily. The 100-metre band between 1700 and 1800 m averages 23.6 degrees, and the steepest step on the way up is 40 metres at 35 degrees between 1820 and 1860 m. Hold the crest through that section. Drift north here and the ground falls 100 to 180 metres away beneath you, and you end up under the north side.",
      "The top is a plateau at 2025 m. The cairn sits right on the edge of the north face — walk up to it, not past it. Cornices build out to the north and east. Directly below the cairn the north side plunges: the first 120 vertical metres fall at close to 60 degrees. Then it eases onto a shelf around 1840 m before it drops away again — 42 to 45 degrees from 1620 down to 1500 m, with glacier and cliffs below that.",
    ],
    descent: [
      "You go down the way you came, westward. The big bowl below the ridge is the best of the tour: a steady 25 to 30 degrees, short pitches over 30, and one 36-degree step between 1880 and 1860 m. From there it is gentle down the hollow to Gjuvvatnet.",
      "The common mistake: letting yourself be drawn south off the summit, down Steindalen. It is good skiing, but it is a different tour — 1025 metres down to Helgedalen, and your car is on Sognefjellsvegen. Hold the west ridge until you can see the lake.",
      "The west side is hard in the morning through April and May, and the sun needs a few hours on it. Start early and you bring crampons; the steep section at 1840 m is no fun on bare crust, going up or coming down.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The normal route sits in gentle to moderately steep terrain. The hollow up to 1500 m is flat in itself, but it runs beneath the west flank of the mountain. Above 1700 m it steepens: 23.6 degrees on average through the 1700–1800 m band, and the steepest single step along the line measures 36.5 degrees. The key section between 1820 and 1860 m is the place on the route where a slab releases.",
      },
      {
        title: "The terrain off it",
        body: "The summit plateau is corniced to the north and east, and the cairn stands on the edge itself. Stay on the south side of the plateau. Directly below the cornices the north side is at its steepest: the first 120 vertical metres down from the cairn fall at close to 60 degrees. Below that lies a shelf around 1840 m, and then the next step — 42 to 45 degrees over 120 vertical metres, from 1620 down to 1500 m, with glacier, avalanche terrain and cliffs in the runout. The southwest ridge over point 1936 is an ascent variant, not a descent: narrow and steep in places, 38 degrees over 40 vertical metres between 1580 and 1620 m.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Jotunheimen at varsom.no. Bring a transceiver, probe and shovel. Crampons if you set off before the sun has worked the west side.",
      },
    ],
    elevationProfile: {
      startLabel: "1274 m",
      endLabel: "2025 m",
      distanceLabel: "3.8 km",
      caption: "758 metres of climbing over 3.8 kilometres from Gjuvvatnet, all above the treeline. Steepest section on the climb: 35 degrees between 1820 and 1860 m.",
    },
  },
  galdhopiggen: {
    intro:
      "The highest point in Norway, and from Juvasshytta it is only 632 metres of climbing. The arithmetic lies: between you and the summit lies Styggebrean, and you cross it roped up.",
    ascent: [
      "The tour starts at Juvasshytta, 1841 m, at the top of Galdhøpiggvegen. Road and hut open around 30 May. If you ski it in April or May, the tour starts where the plowing stops, and both the distance and the vertical come out larger than the figures here.",
      "From the hut you follow the staked route southwest across Juvflye. 2.8 kilometres and around 200 metres of climbing over stony, open ground bring you to the glacier edge of Styggebrean. This is the part of the tour you cover quickly.",
      "At the glacier edge you put on the harness and tie in. Styggebrean is crevassed, and the name is not an accident — stygg means dangerous. The crossing is a good 1.6 kilometres and takes forty-five minutes to an hour, with the rope kept tight between each person. Without glacier experience you go with a guide; this section is what makes the tour grade 3, not the vertical.",
      "Off the glacier and onto solid ground, the route joins the east ridge. Hold the ridge southeast of Piggebrean rather than going out onto the glacier itself; the first pitch is steep enough that many carry their skis. From there the ridge climbs steadily over the 2354 m shoulder and on to the summit. Note that the line does not drop: from 2196 m up to 2469 m it rises the whole way. Descriptions that have you going over Keilhaus topp and back down before the final climb are describing a different line — Keilhaus topp lies a good 450 metres southeast of the staked route.",
    ],
    descent: [
      "Down is the same way. The east ridge first, taken calmly — there is rock and ice in places. The ridge is lopsided: the south side is gentle, while the north side falls at 25 to 35 degrees on average, with steps of 50 to 65 degrees down onto Piggebrean. The north side is the one you stay off. Take the skis off where you carried them up.",
      "Then back across Styggebrean, roped. This is where people get sloppy: the summit is done, it is downhill, and the temptation to untie and spread out across the glacier is strong. The crevasses do not care that you are on your way home. Keep the rope team until you are standing on solid ground at the glacier edge.",
      "The other mistake is dropping south off the summit towards Svellnosbrean. The flank is south-facing and good skiing — 25 to 30 degrees on average over the 430 metres down to the glacier, with individual steps of 40 to 45 degrees — but it is the route to Spiterstulen. 1434 metres down into Visdalen, and your car is at Juvasshytta.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line itself is gentle. The steepest 100-metre band, 2400–2500 m, averages 16.5 degrees, and the steepest single step along the route measures 24.5 degrees. Avalanche terrain is not what makes this tour demanding — the crevasses in Styggebrean and the altitude are. The east ridge is narrow and catches wind slab on the lee side.",
      },
      {
        title: "The terrain off it",
        body: "Piggebrean lies north of the east ridge and Styggebrean below it. Both are crevassed, and if you come off the track on the north side of the ridge, glacier is what you land on: that side measures 25 to 35 degrees on average with steps of 50 to 65 degrees, while the south side of the ridge is gentle. The south flank down towards Svellnosbrean holds 25 to 30 degrees on average over the 430 metres down to the glacier, with individual steps of 40 to 45 degrees — one large, connected slope that is not part of this route.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Jotunheimen at varsom.no. Bring a transceiver, probe and shovel — and rope, harness and crevasse rescue gear. Styggebrean is crossed roped; if you do not have glacier experience yourself, book a glacier guide through Juvasshytta.",
      },
    ],
    elevationProfile: {
      startLabel: "1841 m",
      endLabel: "2469 m",
      distanceLabel: "5.3 km",
      caption: "632 metres of climbing over 5.3 kilometres from Juvasshytta — 1.6 of them on Styggebrean, roped.",
    },
  },
  synshorn: {
    intro:
      "A short tour straight up from Bygdin, with a 360-degree view from the top — Jotunheimen to the north, Bygdin to the west, Bitihorn to the south. 424 metres of ascent over barely two kilometres makes this the tour you take when the weather window is short.",
    ascent: [
      "Start at the car park at Fagerstrand on the east shore of Bygdin, next to Bygdinstøga and Bygdin Høifjellshotell. Parking is 80 kroner, paid by Vipps. Fv51 is closed for the winter north of here, so Bygdin is the plowed end of the road and the car park stays reachable all spring. You are above the treeline from the first step, and the climb begins straight away.",
      "Set the track west and north-west towards the lower part of Fagerdalen rather than heading straight at the summit. The top looks close from here, but directly north of the car park there is a step holding around 40 degrees between 1090 and 1220 m, and the east side of Synshorn falls further still: 31 degrees on average over the first four hundred metres down towards Fv51, with a section of 57. Neither is a way up. Stay west of the mountain until you are above 1400 m.",
      "The flank you climb sits mostly between 10 and 20 degrees, in open terrain without a single tree. The last hundred metres of ascent, from 1400 to 1475, average 16.6 degrees, and the steepest single step on the route measures 24.6 degrees. The summit is gained from the south-west, over the gentle edge of the plateau.",
      "In poor visibility: do not walk east or north-east from the summit. That is where the mountain ends immediately — the east side averages 31 degrees, the north-east 33, and both have sections over 50 within two hundred metres of the summit ridge. To the south the trap is the opposite one: the plateau runs on almost level and draws you out onto it.",
    ],
    descent: [
      "Down the same flank you came up. The south-west flank is broad and even — 16 degrees on average, 23 at its steepest — and in spring snow it runs cleanly all the way down towards Fagerdalen.",
      "The common mistake: dropping straight south from the summit because that is where the car park is. The south side tempts you precisely because it is gentle: 4.5 degrees on average over the first four hundred metres, nowhere above 23. Then it stops. At about 1425 m, a short half-kilometre south of the top, the south wall falls 223 metres in 120 — 117 of them in 56 where it is steepest, between 1330 and 1210 m. Hold the south-west flank instead, down to about 1120 m, and follow your ascent track east and south-east back to Fagerstrand.",
      "The ridge north-west to Heimre Fagerdalshøe (1510) is a continuation of the tour, not another way down: 1.6 kilometres over a saddle at about 1360 m. The descent from there into Fagerdalen is steeper than the one off Synshorn and belongs to people who know the terrain.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The ascent runs in open terrain the whole way, with no forest to slow anything down. The steepest single step on the line measures 24.6 degrees, and the top hundred metres of ascent average 16.6 degrees. The track itself is gentle; what you have to judge is what hangs above you as you come in on the summit from the south-west.",
      },
      {
        title: "The terrain around it",
        body: "The east side towards Fv51 falls 31 degrees on average over the first four hundred metres from the top, down to about 1230 m, with a 60-metre section at 57 degrees. The north-east side averages 33 degrees and 51 at its steepest, the north side 28 and 44. The south side is the gentlest of them all, 4.5 degrees — right up until the plateau ends a short half-kilometre south of the summit and drops 223 metres in 120. None of them is a line you choose on the way down.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Jotunheimen at varsom.no. Bring transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1060 m",
      endLabel: "1475 m",
      distanceLabel: "2.0 km",
      caption: "1060 to 1475 m in barely two kilometres — an even climb in open terrain, steepest over the last hundred metres.",
    },
  },
  bitihorn: {
    intro:
      "Bitihorn stands alone south of Bygdin and is visible from the whole of Øystre Slidre. The normal route goes up the back — 549 metres of even climbing, flat for the first kilometre and marked with iron poles at the top.",
    ascent: [
      "Start at the car park on Fv51, one kilometre south of Bygdin Høifjellshotell. The fee is 60 kroner a day. You are above the treeline from the car. The first kilometre crosses the flat plateau west of Stavtjerne and gives only about thirty metres of height, over a stretch of bog that lies covered once there is snow to ski on.",
      "Past the plateau you round the foot of the north ridge and pass the gate in the reindeer fence. From here set the track up the broad north-west shoulder. It sits mostly at 15 to 22 degrees, and the steepest hundred metres of ascent, from 1300 to 1400, average 18.9 degrees.",
      "The upper section is marked with iron poles. They are there for the crew who maintain the telecom installation on the summit, and they are worth their weight in flat light. The steepest single step on the line measures 27.5 degrees, and it is up here, above 1500 m. The summit is 1607 m, with Bygdin to the north and Jotunheimen behind it.",
      "Hold the shoulder. To the east, towards Fv51, the mountain falls 43 degrees on average over the first four hundred metres, and between 1580 and 1420 m — directly below the top — it runs 65 to 74 degrees. To the south-east, towards Nørdre Båtskardet, the average is 41 degrees and the steepest section 63. The south side is gentle at the top, about 16 degrees for the first two hundred metres, and then breaks into a step of 40 to 59 degrees between 1535 and 1435 m. The Televerket winter line swings further west, up from Raudfjorden onto the west ridge, and only meets this line up near the summit; both are on the same north and north-west side.",
    ],
    descent: [
      "Down the same shoulder. The iron poles take you through the top hundred metres in poor visibility, and below that the shoulder is broad enough that you can pick your own line.",
      "The common mistake: letting yourself drift east off the summit towards the road you can see below. That is where the east wall above Fv51 sits — 43 degrees on average, and 65 to 74 directly under the summit ridge — and south-east of it the notch towards Nørdre Båtskardet, 41 degrees and broken. Hold the north-west shoulder until the ground flattens out, then take the plateau back to the car park.",
      "The south route from Båtskaret exists — 454 metres of ascent over a kilometre and a half — but it is documented as a walking route, not a ski ascent. It is not the way down from here.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The north-west shoulder sits mostly at 15 to 22 degrees, the steepest hundred metres of ascent average 18.9 degrees, and the steepest single step is 27.5 degrees, up above 1500 m. Visit Valdres describes several line choices under 30 degrees on this side, but with terrain traps and runout zones in the hollows. Choose your line by today's forecast, not by the track that is already there.",
      },
      {
        title: "The terrain around it",
        body: "The east wall above Fv51 falls 43 degrees on average from the summit, and 65 to 74 degrees between 1580 and 1420 m. To the south-east towards Nørdre Båtskardet the average is 41 degrees with a section at 63. The south side is gentle for the first two hundred metres and then falls 40 to 59 degrees between 1535 and 1435 m. The summit section sits between them, and none of them is a descent line on this tour.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Jotunheimen at varsom.no. Bring transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1061 m",
      endLabel: "1607 m",
      distanceLabel: "3.2 km",
      caption: "1061 to 1607 m: flat for the first kilometre, then an even climb up the north-west shoulder to the iron poles.",
    },
  },
  rondslottet: {
    intro:
      "Rondane's highest. A long day where the first six kilometres are pure approach — the mountain starts behind Rondvassbu, and the last 240 metres of climbing run along a narrow ridge.",
    ascent: [
      "From Spranget p-plass, 1082 m, it is six kilometres in to Rondvassbu. Tjønnbakkvegen is a toll road, and in midwinter Mysusæter is the last ploughed point — the tour lengthens accordingly. You are above the treeline from the first metre, so it is open mountain the whole way in. Keep to land around the Lonin bay at the southern end of Rondvatnet rather than taking the shortcut across the ice; this is the outlet end, and that is where the ice is thinnest.",
      "Behind Rondvassbu, 1169 m, it climbs steeply to the north-east. The path junction for Storronden comes early, and your line is the one continuing north into Rondholet. The cirque sits at around 1500 m and is flat — it is the last flat ground you get before the summit.",
      "Out of Rondholet it goes very steeply up through scree towards Firkløvereggen, the ridge between Storronden and Vinjeronden at 1869 m. The steepest hundred-metre band of the whole ascent is here, between 1600 and 1700 m, holding a mean 23°. If the scree is blown bare, carry the skis up to the ridge.",
      "From there it rises to Vinjeronden, 2043 m. The route then drops a good hundred metres into Slottsbrue, the col at 1939 m, before climbing the ridge to Rondslottet, 2178 m. The ridge is good going, but it is narrow: stay in the middle of it. The ground falls 33–38° to the west and over 45° to the east.",
    ],
    descent: [
      "Back the same way — over the ridge, down into Slottsbrue, and up the hundred metres to Vinjeronden again. That re-ascent comes late in the day and takes longer than it looks; account for it before you decide how long to stay on top.",
      "The common mistake: dropping west off the ridge to avoid the re-ascent over Vinjeronden. The west side of the ridge between Slottsbrue and the summit falls 33–38° for close to three hundred vertical metres, down into Styggebotn and on towards Rondvatnet. It does not ease off until below 1700 m, and until then you are hanging in one continuous steep flank under a ridge. It is no shortcut — hold the ridge until you are back in the col.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "From Spranget in to Rondholet the terrain is open and gentle, and you are above the treeline throughout. The steepest hundred-metre band on the ascent lies between 1600 and 1700 m and holds a mean 23° — the scree up towards Firkløvereggen. Past Vinjeronden the route drops into Slottsbrue and climbs back onto a narrow ridge, with steep flanks immediately either side of the track.",
      },
      {
        title: "The terrain around it",
        body: "The west side of the ridge between Slottsbrue and the summit falls 33–38° for close to three hundred vertical metres down towards Styggebotn; the east side falls over 45° into Storbotn. The south-west flank of the summit itself is far gentler, around 26° over the first four hundred metres, but it does not lead down into Rondholet — that cirque is two and a half kilometres away, on the far side of Vinjeronden. In Rondholet you move through a cirque whose walls run 20–26° on average with sections up to 38°, from the north-west and from Firkløvereggen to the south-east. It is the longest continuous stretch of the tour with something above you.",
      },
      {
        title: "Before you go",
        body: "Rondane sits in the Nord-Gudbrandsdalen forecast region. It is a B-region on varsom.no: an avalanche forecast is published only when danger level 4 or 5 is expected, so an empty page does not mean a safe mountain. Read the weather history and the observations for the region yourself, and carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1082 m",
      endLabel: "2178 m",
      distanceLabel: "12.1 km",
      caption: "12.1 km and 1245 vertical metres from Spranget. A hundred of them are given back at Slottsbrue and have to be re-climbed on the ridge.",
    },
  },
  snohetta: {
    intro:
      "Norway's highest mountain outside Jotunheimen, and one of the kindest in its class: the east ridge is staked the whole way and the line never passes 29°. What decides the day is not the mountain but how you get in to Snøheim.",
    ascent: [
      "Snøheim turisthytte, 1474 m, sits at the end of Snøheimvegen. The road is closed to private cars, cycling is banned until 1 June for the reindeer calving, and the bus from Hjerkinn only runs once the hut opens around midsummer. In the ski season you therefore cover the fourteen kilometres in from Hjerkinn under your own steam — that is the part of the day people underestimate. From the hut follow the track a couple of hundred metres west to the footbridge over Stridåe. The bridge is at the south-east corner of the tarn just west of the hut; you go around the tarn's southern shore, not across it.",
      "After the bridge you turn immediately right onto the army's old tractor road, blocked to vehicles with large boulders. It takes you steadily up to Gamle Reinheim, the ruin at 1670 m. No forest anywhere on this tour — you are above the treeline from the hut upwards, with the whole ridge in front of you the entire way.",
      "From Gamle Reinheim it climbs steeply, partly on snowfields, onto the east ridge. Up on the crest is the path junction for Reinheim in Stroplsjødalen, the way in for those coming from the east. Keep your distance from the steep terrain to the north at the start of the climb; the ridge is broad enough that you can walk up the middle of it.",
      "The steepest hundred-metre band lies between 1800 and 1900 m and holds a mean 19.6°; no part of the line passes 29°. From here there are stakes and cairns the whole way, and the top goes on snowfields up to Stortoppen, 2286 m, where the radio link station stands. In poor visibility it is the stakes that keep you on the crest — the upper section is broad enough that you lose the feel of where the ridge runs.",
    ],
    descent: [
      "Back down the same way. From Stortoppen to Gamle Reinheim the east ridge gives a good 600 vertical metres in one go, and the tractor road takes the last 200. Below 1800 m it slackens enough that it becomes more glide than turns. If you want more pitch and better snow, put part of the descent south of the up-track — but that has you standing on 30–40° ground instead of 20°.",
      "The common mistake comes right at the end: leaving the tractor road too early and aiming straight for Snøheim. That puts the tarn west of the hut in your way, and its outlet stream behind that. Follow the road all the way down to its end at the tarn's south-west corner and take the path east from there — the footbridge is the only crossing, and from the bridge it is 230 metres to the hut.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The east ridge is gentle by high-mountain standards. The steepest hundred-metre band, between 1800 and 1900 m, holds a mean 19.6°, and no part of the line passes 29°. From Snøheim to Gamle Reinheim you are on an old tractor road in open, easy-angled terrain. What matters here is not what you are standing on but how close to the edge of the crest you put the track.",
      },
      {
        title: "The terrain around it",
        body: "North of the crest it looks gentle, and for the first three hundred metres it is — the ground flattens and even rises a little. Then it breaks: four to five hundred metres north of the track the edge drops over 55° and a good 130 vertical metres, onto the flats running towards Leirpullan and Larsurda. You cannot see it from the ridge. Directly below Stortoppen the north side is steep all the way down: a mean 31° over the first five hundred metres, with sections over 50°. The south side falls more evenly, around 30° on average, but with sections of 37–46° between 1950 and 1800 m. The gully running east from Vesttoppen is a different tour — over 30° on average, steepest right below the lip, and with a glacier lip at its foot.",
      },
      {
        title: "Before you go",
        body: "Dovrefjell sits in the Nord-Gudbrandsdalen forecast region. It is a B-region on varsom.no: an avalanche forecast is published only when danger level 4 or 5 is expected, so an empty page does not mean a safe mountain. Read the weather history and the observations for the region yourself, and carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1474 m",
      endLabel: "2286 m",
      distanceLabel: "5.6 km",
      caption: "5.6 km and 819 vertical metres from Snøheim — steadily uphill the whole way, and never over 29°.",
    },
  },
  storehorn: {
    intro:
      "A short walk from the car to a summit that looks out over the whole of Hemsedal. The tour starts above the treeline and the ground is open from the first step — a good first ski tour in the valley, and a quick morning summit once you know it.",
    ascent: [
      "From Hornslie, where Torsetstølvegen ends at 1056 m, you climb the first pitch straight off. It is shorter than it looks — the steepest hundred-metre band on the whole route, 1000–1100 m, averages 18.8° — and it flattens out over the lip. There is no forest to deal with: the entire tour runs in open terrain.",
      "Over the lip the Hødnetjedne basin opens up — Horntjerne on the Kartverket map — and you give back 48 metres down to the lake at 1191 m. In winter the line runs straight across the frozen water; the summer path keeps to the left side. On the far bank the route splits into two marked lines: one longer and gentler out onto the northwest shoulder, one shorter and steeper up the east ridge. This description follows the east ridge.",
      "From the east ridge it is steady climbing west to the summit, with Veslehødn — Veslehorn on the map — and the whole of Hemsedalen behind you. The summit plateau is small, and its southern edge is closer to the cairn than it looks: eighty metres south of the top the ground drops 96 metres in twenty metres of ground. The southeast edge does the same, 63° over the steepest sixty metres, and the southwest edge 57°. Hold the ridge to the cairn, and stay north of the edge once you are standing there.",
    ],
    descent: [
      "Same way down. The east ridge gives even, open skiing back to Hødnetjedne, and the basin below is the flattest ground on the tour — expect to pole.",
      "The usual mistake: letting the terrain pull you northeast toward Veslehødn instead of turning down toward Hornslie. East of Veslehødn, Hydnefossen falls 155 metres free — the elevation model takes 151 of them in a single twenty-metre step — and below the fall the ground holds 50° on down. From the lake the way home runs southeast, and remember the 48 metres of climbing back out of the basin before the last pitch down to the car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line itself is gentle. The steepest hundred-metre band, 1000–1100 m on the first pitch above Hornslie, averages 18.8°. The steepest single step does not come until the final ridge, between 1394 and 1415 m, and it measures 29.8°. No part of the line goes over 30°.",
      },
      {
        title: "The terrain off it",
        body: "The summit plateau is small, and rock bands frame it to the south, southeast and southwest: 96 metres of drop in twenty metres of ground directly south of the cairn, 63° over the steepest sixty metres to the southeast and 57° to the southwest, with single steps up to 79°. The west side is nearly flat for 260 metres and then falls away in a band that averages 47° down to 1320 m, 60–70° at its steepest. The northwest shoulder is the gentle side, 13° on average. East of Veslehødn the mountainside drops 71–76° over its top 235 metres, and Hydnefossen falls 155 metres free down it. All of it lies off the route, and that is where it stays.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1056 m",
      endLabel: "1478 m",
      distanceLabel: "2.9 km",
      caption: "473 metres of climbing and 2.87 km from Hornslie to the summit, with 48 metres given back in the Hødnetjedne basin.",
    },
  },
  oksen: {
    intro:
      "963 metres of climbing in one go, from Tjoflot down by the fjord to a summit that looks out over Hardangerfjorden, Granvinsfjorden, Sørfjorden and Eidfjorden. The tour asks for fitness more than technique.",
    ascent: [
      "From the pay parking at the top of Tjoflotvegen, 277 m, you follow the tractor road a short way before the path takes over. Expect to carry skis through the forest: the treeline is at 538 m, and most people put them on up at Vindhovden.",
      "The forest is the steepest section before the flank. Between 335 and 405 m the fall line averages 30° and hits 51° over the steepest sixty metres; the path takes it in switchbacks, stays under 25° per hundred-metre band and tops out at 33° around 480 m. Follow the switchbacks — there is no shortcut here that pays.",
      "At the summer farm at Vindhovden, 586 m, it opens up. From here you follow the southwest side east toward the summit, along the shoulder below the ridge. Around 900 m it tightens: the 900–1000 m band averages 26.7° and the 1000–1100 m band 24.7°, and the steepest single step on the line — 34.8° — comes at about 1080 m. The ground turns rocky at the same time.",
      "Above 1100 m the line eases again, and the last metres are quiet ground in to the summit. But hold the line: a few tens of metres south of you the shoulder rolls over. At 1146 m the south side falls 40° on average for the next 340 metres, with a single step of 66°. North of the line it is the opposite — it eases off to 2–5°, and that is the side that pulls you off the route.",
    ],
    descent: [
      "The flank skis as well as it climbs: over 650 unbroken metres from the summit down to Vindhovden, with the fjord in front of you the whole way. You have width to choose from, but not unlimited — a couple of hundred metres south the shoulder rolls over into 35–40°.",
      "The usual mistake: following the fall line. Fog settles on this summit often, and in flat light it draws you south off the shoulder, down into 35–40° with steps up to 57°. Correct back too far and you end up in the gentle ground north of the line — that is where Hamreskredane sits, 530 metres north of the route at 758 m, and below it the terrain falls 33° on toward Granvinsfjorden. Aim for Vindhovden, and hold your height on the shoulder all the way down.",
      "Below Vindhovden the skiing is over. The treeline at 538 m is where the skis go on the pack, and the last 260-odd metres down to Tjoflot are on foot, in the same switchbacks you came up.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The route climbs 963 metres in 3.39 km, and its steepest part lies between 900 and 1100 m: 26.7° on average over the first hundred-metre band, 24.7° over the next. The steepest single step on the line measures 34.8° and sits at about 1080 m. That is above the angle at which snow releases, and the section is long enough that it deserves its own judgement call.",
      },
      {
        title: "The terrain off it",
        body: "The steep ground is south of the line, not north. Measured out from the route, the south side falls 28–40° on average over the first four hundred metres at every point from Vindhovden up to 1146 m, with 42–57° over the steepest sixty — steepest high up, where the line itself is steepest. North of the line it eases off to 2–17°, and that is the side that catches you out: five hundred metres north lies Hamreskredane at 758 m, and from there the ground falls 33° on average toward Granvinsfjorden. In the forest below Vindhovden the fall line measures 30° between 335 and 405 m, with 51° over the steepest sixty; the path goes around it in switchbacks.",
      },
      {
        title: "Before you go",
        body: "Oksen sits in the Voss forecast region, not Hardanger. Check today's avalanche forecast for Voss at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "277 m",
      endLabel: "1241 m",
      distanceLabel: "3.4 km",
      caption: "277 m at Tjoflot to the summit of Oksen — 963 metres of climbing over 3.39 km, without a metre given back.",
    },
  },
  melderskin: {
    intro:
      "The classic of the Rosendal alps — 1,272 metres of climbing from the farmyard at Kletta to the cairn, without giving back a single metre on the way. A long day for anyone who wants the whole mountain from the bottom up.",
    ascent: [
      "From the car park at Kletta, 153 m, follow the road for 300 metres before the path turns up towards Skarshaug. The first stretch crosses farmland and then enters mixed forest; the track is clear, and you climb steadily through the trees to around 520 m.",
      "Above the treeline the slope stands up. Between 600 and 700 m it averages 31.8° over a hundred vertical metres — the steepest sustained section of the whole tour, and the one you want behind you early in the day. The top of that slope is Skarshaug, 806 m, halfway to Melderskin.",
      "North-east from there the ground eases into Rindane, the small ridges and hollows you thread through towards Holo. Holo is the flat at 1,211 m; Kartverket classes it as bog, and it is the one place on the route where the line simply runs level. Here it swings north-east before turning back east — that dogleg keeps you on the bench and off the steep south and south-west ground directly below the summit.",
      "The final climb from Holo to the cairn is 215 vertical metres over nine hundred: 13° on average, 25° where it is steepest. Cornices sit along the summit edge, and when the snow up there is wind-scoured and hard you put on crampons and carry the axe for the last stretch.",
    ],
    descent: [
      "Coming down you retrace the ascent: west from the cairn to Holo, then south-west through Rindane and over Skarshaug, and finally down the slope and through the forest to Kletta.",
      "The common mistake: dropping straight off the summit instead of going back to Holo first. The fall line from the cairn runs south, and south is where it drops away — the south flank averages 44° over the first three hundred metres, with a 60° rock band in the top seventy. Hold west until you are standing on the bench at Holo, and take your ascent track down from there.",
      "Below Skarshaug you meet the 600 to 700 m slope again, west-facing now and with the sun on it from midday. Ski it while the snow still carries; later it turns heavy and wet all the way down into the forest.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The steepest hundred metres lies between 600 and 700 m and holds 31.8°; the steepest single step on the line measures 36.3°. That is avalanche terrain, and it sits in the slope you have to cross either way. Make the call down at the forest edge, while turning round still costs you nothing.",
      },
      {
        title: "The terrain off it",
        body: "The steep ground is south of the summit, not west. The south flank directly below the cairn averages 44° over the first three hundred metres and holds a 60° rock band in the top seventy; the south-east side runs 33° with 59° at its steepest. The west side, where the route goes, is among the gentlest ground on the mountain — 17° on average. But the line straight from Rindane to the cairn, the one the route avoids, hits a 42° step a hundred metres out from the top, and that is the whole reason the Holo dogleg exists. The north side holds the gullies: Midtrenna at 45° and Høyrenna at 40°, and Nordvestrenna, which friflyt calls a known avalanche path in late winter. Measured from the summit, the north and north-east flanks fall at 30° on average with 44–50° in their steepest sections. That is a different tour from this one, and it takes an axe and crampons.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hardanger on varsom.no. Carry a transceiver, probe and shovel, plus crampons and an axe for the summit section when the snow is hard.",
      },
    ],
    elevationProfile: {
      startLabel: "153 m",
      endLabel: "1426 m",
      distanceLabel: "4.6 km",
      caption: "153 to 1,425 m over 4.6 km. The steepest hundred metres lies between 600 and 700, on the climb to Skarshaug.",
    },
  },
  gaustatoppen: {
    intro:
      "The most prominent peak in southern Norway, and one of the gentlest to climb on skis: 965 metres of ascent from Langefonn, and not a single step over 25° on the way up.",
    ascent: [
      "From the car park at Langefonn turisthytte, 921 m, follow the winter-closed road towards Stavsro. After 850 metres you are at Svineroisetra, 1,021 m — that is the kilometre the descriptions mean. The birch belt lets go at around 970 m, and from there it is open mountain. The east ridge can also be reached from Stavsro with 706 metres of climbing, but that road is closed in winter.",
      "At the seter you leave the road slightly right, south-west, and head for the lowest point on Himmelranden — the top of Langefonn, 1,455 m. Do not go straight up at the cairn from here. The fall line from Svineroisetra direct to the summit holds 35–37° in its top third; the traverse towards Langefonn climbs steadily at 12–16° and never passes 25°, and that is the line this route follows.",
      "From the low point you turn west-north-west and follow the ridge. The climb is steady: the steepest hundred metres of the whole tour lies between 1,700 and 1,800 m and measures 17.3°, and the steepest single step is 23.4°. Partway along you join the summer path from Stavsro.",
      "At 1,831 m you come out onto the summit plateau at Gaustatoppen turisthytte, and from there it is a good five hundred metres north-west over boulder ground to the cairn. The plateau is open and stony and gives you little to steer by; in poor visibility the hut is the handrail you navigate on, going up and coming down.",
    ],
    descent: [
      "Coming down you follow your own track: east-south-east along the ridge to the lowest point on Himmelranden, then down the flank north-north-east to Svineroisetra, and the road back to Langefonn.",
      "The common mistake: dropping straight off the plateau towards Svineroisetra instead of following the ridge back to the low point first. The north-east flank directly below the cairn averages 35° over the first four hundred metres and holds 46° at its steepest — the same numbers the fall line from Svineroisetra gives in its top third. The flank down from the ridge at 1,455 is another matter entirely: 16–21°. Hold the ridge until you are standing at 1,455, then take the flank from there.",
      "The seven gullies running east off the summit ridge are something else. Friflyt gives an average just under 40°, and measured from the cairn the east-north-east flank falls at 31° over eight hundred metres with 45° in its steepest section. Friflyt states plainly that they can be avalanche-prone and that several skiers have been killed by avalanches on Gaustatoppen. If you ski them, traverse south out of the runout, back to the first plateau you came up to, and down through the birch belt to Svineroisetra.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line from Langefonn stays under 25° all the way to the cairn: the steepest single step measures 23.4°, and the steepest hundred metres, between 1,700 and 1,800 m, holds 17.3°. The ascent itself is barely avalanche terrain. What changes the sum is wind — it scours the ridge bare and loads the snow into the gullies on the east side.",
      },
      {
        title: "The terrain off it",
        body: "Three places lie off the route and should stay that way. The east side of the summit tower with its seven gullies, where avalanches have killed. The north-east flank directly below the cairn, 35° on average over four hundred metres and 46° at its steepest — that is the fall line towards Svineroisetra, and it is what you land in if you drop straight off the plateau. And the north-west side towards Rjukan: gentle at the top, 14° for the first four hundred metres, but it runs 1,350 vertical metres down into the valley and steepens past 50° low down. The gentleness up top is the trap.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Vest-Telemark on varsom.no. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "921 m",
      endLabel: "1883 m",
      distanceLabel: "4.3 km",
      caption: "921 to 1,879 m over 4.35 km. The steepest hundred metres measures 17.3°, and nothing on the line passes 25°.",
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
