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
    "840 metres of ascent from Medfjordbotnvatnan through the bowl south of Keipen; the route cuts across, while the fall line beside it measures 38 to 52 degrees.",
  skarasalen:
    "1438 metres of ascent from the gate on Kvistadvegen, the steepest of it up to the 1074 m col.",
  saudehornet:
    "1157 metres of ascent from the waterworks in Ørsta, and the crest holds about 32° on average for the last 170, steepest at 37.",
  glittertinden:
    "12.6 km and 1180 m of climbing from Veodalen: 7 km of flat approach to Glitterheim, then a steady rise east of Glitterbrean.",
  besshoe:
    "1305 m of climbing from Bessheim: three and a half kilometres along Bessvatnet before Grotådalen, then the gentle east ridge over Brue.",
  rasletinden:
    "750 m and 6 km from Valdresflye: flat for the first 1.2 km, then a step to 1530 m and a gentle ridge from the east.",
  storronden:
    "1140 m of climbing from Spranget: six kilometres of approach to Rondvassbu, then 2.6 km of steady west ridge from the 1440 m junction.",
  skogshorn:
    "836 m of ascent from Trefta up the broad east ridge of Skogshorn; steepest measured step 28.5 degrees.",
  folarskardnuten:
    "More than 12 km in from Haugastøl and 970 m of ascent, with one short 37-degree step up out of Folarskardet.",
  lonahorgi:
    "1300 m of ascent from Høyland via Bergsstølen and Breiming, the last 107 up the north ridge from point 1305.",
  vesoldo:
    "838 m of ascent from Byrkjenes, forest up to Fadnastølen and an open south-west shoulder above; the north and west sides fall 48–55°.",
  hamperokken:
    "1400 m of ascent from Fv91, but the skis stay on Middagsaksla at 1076 m – the last 1.4 km is an exposed ridge on foot.",
  breitinden:
    "1050 metres of ascent from Svarthola past Svartholvatnet and the north shore of Breitindvatnet; the last 244 are a scramble on the summit ridge.",
  geitgaljen:
    "1071 metres of ascent from Liland up Lilandsdalen; the gully from 250 to 360 m runs at 35 degrees and the summit needs crampons.",
  jakta:
    "1560 m of ascent from Norang: a steady climb into Konedalen, then a 33° flank onto the narrow summit ridge.",
  hornindalsrokken:
    "1470 m of ascent from Langøylia over Aksla, Trollaksla and Sætrenibba; the last 103 are on an exposed ridge.",
  jonshornet:
    "1430 m of ascent from Vollane over Rametinden, with the last hundred on a narrow arête to the cairn on Ramoen.",
  auskjeret:
    "870 m of ascent from Fausaskiftet in even climbing northward — a road open all year and moderate angles.",
  ytstevasshornet:
    "830 m of ascent from Svartevatnet: steeply up Vassdalen to the tarns at 950 m, then north-west onto a narrow, corniced summit ridge.",
  rana:
    "1600 m of ascent from Urkegjerdet at the fjord: up the valley to Nordkopen, steeply onto the arête and north along the broad summit ridge.",
  vassdalstinden:
    "1210 m of ascent from Nupen: the seter road to Vallasætra, the step up into Bukkedalen and one long flank to the top.",
  torvloysa:
    "1460 m of ascent and ten kilometres from Hatlestad over Rellingsætra and Daurmålsfjellet, mostly gentle ridge.",
  skarene:
    "1220 m of climbing from Korsmyra up Gråsteindalen and the big snow flank to one of the highest peaks above Eidsdal.",
  melshornet:
    "560 m of climbing on a groomed track from Helgatun — the local hill, skied after dark all winter.",
  kvitegga:
    "1480 m of climbing from Nibbedalen through Snødalen and over Brattbakken to the highest mountain in the central Sunnmøre Alps.",
  eidskyrkja:
    "1120 m of climbing from Skinnviksætra up the Blåbreen glacier: 25 degrees low down and a wide summit plateau on top.",
  sunndalsnipa:
    "990 m of ascent from Grøndalsvatnet up the south-east ridge, then a kilometre of flat plateau to the cairn.",
  skarsteinfjellet:
    "1220 m of climbing up an even ridge above Innvikdalen — the whole route in terrain under 30 degrees.",
  glitregga:
    "900 m of ascent from the sports ground in Randabygd, south-facing and gentle the whole way.",
  lodalskapa:
    "1520 m of ascent from Bødalssætra over Kåpevatnet and the Bohrsbreen glacier to the only 2000-metre peak in Nordfjord.",
  snonipa:
    "1490 m of climbing up Haugadalen and through the Haugabreen icefall to the highest mountain in Sunnfjord.",
  kvamshesten:
    "840 m of ascent from Rytnavegen past Skaravatnet and Grunnevatnet, finishing up a 36-degree bowl.",
  molden:
    "620 m of climbing from Mollandsmarki up the south-west ridge, the Lustrafjord below you the whole way.",
  storanosi:
    "740 m of ascent from Ljosno through open birch forest and out onto the plateau above Brandsetdalen.",
  horndalsnuten:
    "1120 m of climbing from Skiple through Horndalsbotnen, with the steep pitch off the shoulder at the end.",
  gygrastolen:
    "1270 m of ascent from the fjord at Ænes up the ridge above Gygrastølvatnet, facing the Folgefonna icecap.",
  juklavasstinden:
    "1340 m of ascent from Myrdalsvatnet: up the ridge, down to Møsetjørna and up the north ridge to a corniced top.",
  hogevarde:
    "600 m of climbing from Tempelseter up the staked track to the DNT hut at 1397 m, then the last 560 metres out along the ridge to the view indicator.",
  grafjell:
    "580 m of climbing and 7.8 km from Tempelsetra past Istjenn and Donkelitjenn to the highest top on Norefjell.",
  ranten:
    "530 m of climbing from Tempelseter by way of the Raudmyra junction and west onto the jagged ridge Kittelsen painted as Soria Moria.",
  "store-ble":
    "670 m of climbing from Nordstulvatnet through the forest and up past Sigridsbu — the avalanche runouts are in Langedalen alongside.",
  surloytenuten:
    "460 m of climbing from Nordstul by Sudstul and Vassholet, then south along the outer ridge of Surløyterinden to the cairn.",
  gyranfisen:
    "670 m of climbing from Vikerkoia over Svarttjernskollen, 200 of them given back in the dip before the highest point in Ringerike.",
  styggemann:
    "550 m of climbing and 9.6 km from Ravalsjø by way of Sørmyrseter, the last 240 straight up to the highest top in Skrim.",
  snota:
    "1270 m of climbing from Gråhaugen across Svartvatnet and around Litj-Snota to the highest mountain in northern Trollheimen.",
  vassfjellet:
    "540 m of climbing from Markavollen past Vassfjellhytta — the closest ski tour to Trondheim, on a marked track the whole way.",
  krakfjellet:
    "The highest point in Trondheim municipality: 470 m of climbing and ten kilometres from Håen past Kråklivollen and Rundtjønnin.",
  rensfjellet:
    "700 m of climbing and eleven kilometres from Håen past Rundtjønnin and Oksdalen to the highest point in Melhus.",
  storhornet:
    "940 m of climbing on a marked winter route from Bree through Hornlia to the stone shelter on the most visited peak in Oppdal.",
  storbekkhoa:
    "890 m of climbing from Storli up Storbekkdalen and through the col west of the steep south-east face.",
  okla:
    "1020 m of climbing from Dalen in Storlidalen to Snydda — the cairn on the high point of the Okla massif.",
  moysalen:
    "1600 cumulative metres of ascent from the E10 at Litlvatnet: 355 given back along the way, 120 of them on the drop to Grønnvatnet at 328 m.",
  saebyggjenuten:
    "850 m of climbing and 11.3 km in from Berdalen over the Tverrheiskar passes and the Gjuvvatn lakes; the north side falls 42° and is often corniced.",
  kjerag:
    "620 m of ascent from Øygardstøl via Langvassvegen and the Kjerag plateau; the steepest 30 metres is 24.4 degrees on a road bend, but Lysevegen only opens in May.",
  nibbi:
    "800 m of climbing from Lykkjastølen, west of the waterfall and up the valley — Hemsedal's most-skied spring summit.",
  slettind:
    "470 m of climbing from the rv 52 at Eldrevatn up an even 20–25° flank — the beginner's summit on Hemsedalsfjellet.",
  kyrkjebonosi:
    "1000 m of climbing from the sandpit at Kyrkjebøen over the first top at 1610 and north along the long, flat ridge.",
  prestholtskarvet:
    "Eleven kilometres and 960 m of climbing from Havsdalen past Prestholtstølan and up Prestholtskardet to the southern rim of Hallingskarvet.",
  ustetind:
    "410 m of climbing from Ustaoset past Tindevatnet to the 1899 cairn, Hardangervidda to the south and Hallingskarvet to the north.",
  banseterkampen:
    "330 m of climbing from Bånsetra onto a ridge that drops away to the south — the nearest real mountain to Kvitfjell, straight across the Lågen.",
  nevelfjell:
    "270 m of climbing from Nordseter over Nevelåsen to the most-visited summit above Lillehammer, with an open hut and a view-finder at 1089.",
  ulvsjoberget:
    "300 m of climbing from Vestby up through the forest to open fell — the highest summit in Trysil outside the ski resort.",
  rodtinden:
    "450 m of climbing from the Storelva ski stadium up the open south-east side — the most-visited summit around Tromsø.",
  kjolen:
    "580 m of climbing from Finnvikvatnet up the valley to the radar and the warming hut — one of Kvaløya's most-visited summits.",
  strandtinden:
    "1160 m from the E10 at sea level up through Heggedalen and the west ridge — the great classic of the Harstad area, and the peak most people there ski.",
  raskarfjellet:
    "680 m of climbing from Sildegjerdet on rv 52 up the stream valley — Hemsedal's own classic, known simply as «1609».",
  gullfjellstoppen:
    "839 metres of ascent from the road end at Osavatnet, past Redningshytta and up Middagsdalen to the highest point in Bergen.",
  sata:
    "895 metres of ascent from the innermost car park at Eikedalen ski centre: a summer road, a flat approach into Skeiskvanndalen, and a steep flank into the notch north of the summit the register also calls Iendefjell.",
  skrott:
    "1068 metres of ascent from the cluster of summer farms in Fitjadalen: a footbridge over the Kjølo, a steep wooded hillside to Håsete, the ski hut at 1110 metres and the notch between Glynt and the summit.",
  tveitakvitingen:
    "995 metres of ascent over 8.6 km from the Furedalen alpine centre: the groomed tracks along Mødalsvegen to Mødal, steep steps past Gråskorvenuten and a long summit ridge to the cairn.",
  finnbufjellet:
    "620 metres of ascent from the camping ground at the top of the Halsabakkane hairpins: across the Sendo river and up the ridge east of Finnbujuvet, where the Voss ski season opens and closes.",
  vatnaknausen:
    "980 metres of ascent from Tverrberg: the toll road into Budalen to Nyestølen, up onto the ridge west of the Rjupetjørnane tarns, and east across the plateau to the view over Voss.",
  "varden-smaatindan":
    "825 metres of ascent from Eidet by Kabelvåg: the lit trail along Karlsvatnet, over the neck towards Ørntindaksla and through the notch west of it, and the east flank to the top of the archipelago's most skied tour.",
  midtitinden:
    "1050 metres of ascent from sea level at Sagelva: through the cabin field, the ramps towards Innertinden, the military route markers westwards and the ridges to the top.",
  fastdalstinden:
    "1270 metres of ascent from the road end at Varto: the works road to the dam, on land around the regulated Rottenvikvatnet, the flat at 650 and the ridge straight at the summit.",
  togga:
    "780 metres of ascent straight from the ski-touring car park at Brandhaugane: the south-east ridge through the forest, the flat at Orraleiken, and the last climb to the cairn.",
  englafjell:
    "1240 metres of ascent from Musland in Uskedalen: tractor road and marked path, across the valley, up to Såta and south along the steep ridge — with the cornices over Limomnen for company to the top.",
  sandhornet:
    "1020 metres of ascent from the shore at Horsdal: the path along the sea, the stairs to Stjerndalen, and gentle ridges to the cairn on the island mountain above Saltfjorden.",
  tomskjevelen:
    "950 metres of ascent from the field at Forsland on Tomma: the path to Forslandsvatnet, around the tarn on land, and the north-west ridge all the way up the island mountain Fri Flyt calls one of the finest peaks on the Helgeland coast.",
  "tredje-svanfjell":
    "660 metres of ascent straight from the lay-by in Kaperdalen: the notch north of point 504, steadily up to the foretop at 870, and the last 36 metres to the Senja classic.",
  istinden:
    "1432 metres of ascent from Tindelva by Iselvmoen: the steep birch hillside, into the cirque below the north wall, and up the ridge west of the glacier to the highest of the Istindan tops.",
  husfjellet:
    "640 metres of ascent from the church at Skaland: Dronningstien to Grillbua, the cleared forest track up Sommerdalen and the ridge over Sommerdalhaugen — the most view for the least effort, the source says.",
  lonketind:
    "784 metres of ascent from the water basin by Finnelva: the flat bog terrain, the ridge toward Lonketuva and the summit ridge that steepens by degrees to Senja's Lonketinden.",
  skolpan:
    "607 metres of ascent from Fv. 862 in Krokelvdalen: a steady climb through the scrub birch, across the shelf at 465 m and north-west onto the ridge to Skolpan.",
  lukttinden:
    "1129 metres of ascent from the farm at Kammen: the tractor road, the forest toward the stream between Nordtinden and Lukttinden, and the gentler ridge to the most striking summit in Vefsn.",
  tortenviktinden:
    "1023 metres of ascent from Neset by Flostrand: straight up through the forest, west along the ribs across the broken shelf, and up the gentle rise to the view over the Helgeland coast.",
  skarven:
    "740 metres of ascent from the toll road in Skorgedalen to one of Romsdalen's great classics: the bog at Kjerringhaugen and the Skorgedalsbu hut, south of point 588, and the ridge over the southern fore-summit to the fjord view at the cairn.",
  blanebba:
    "930 metres of ascent from Venjesdalssetra to the edge that looks straight down into Romsdalen: the Romsdalseggen markers along Tverrelva, the flat below Storhesten, the northeast flank to the 1245 m col — and the main ridge east to the cairn.",
  mjolvafjellet:
    "1220 metres of ascent from the fjord: the tractor road from Isfjorden stadium, the forest below Litlehesten, across Steinselva and the gentle ridge past Høgnosa — then south to the summit hanging over Romsdalen.",
  ospetinden:
    "1060 metres of ascent from the toll booth at Venås: the summer-farm road to Venåssetra, the bog across Stavvasselva, the big east-facing bowl — and the northeast ridge to the pyramid at the head of Måndalen.",
  middagstinden:
    "1310 metres of ascent from Herdslan in Innfjorden: the road along Berillvatnet, the stream gully to the col at Tindevatnet — and an often wind-scoured ridge, skis on the pack, before the west-facing summit flank.",
  skarlitinden:
    "940 metres of ascent from Sandeggen on Breivikeidet: along Russevankelva into Russevankskaret, a turn south-southeast at point 511 — and a long summit plateau to the cairn with the couloirs below.",
  storfjellet:
    "1050 metres of ascent straight up from Breivikeidet: along the river valley toward Russevankskardet, onto the south ridge at about 400 — and the ridge to the top with the steepest ground between 950 and 1040.",
  gabrielfjellet:
    "1140 metres of ascent from Stormo on the fv. 91: sparse forest south, rolling ridges from 400 to 850 — and broad fields all the way to the cairn on the mountain the register calls Iverfjellet.",
  fagerfjellet:
    "950 metres of ascent from the school at Fagernes: farmland, the forest toward point 459 and the hollow east to the cairn at 871 where most people turn — the summit lies a rolling stretch further in.",
  "store-skalltinden":
    "980 metres of ascent from the sea at Glimbukta: up past Skallvatnet at 320, the undulating ridge west — and the last 800 metres toward the summit with steep ground on both sides.",
  justadtinden:
    "730 metres of ascent from the Justad farm on the fv. 815: the hillside, the ridge over Skjærheia and the playful summit ground — the highest on Vestvågøy's east side, with Vågakallen and Henningsvær below.",
  rundfjellet:
    "890 metres of ascent from the sea at Vatterfjordpollen: along the north side of the poll, onto the south ridge and the ridge-top all the way — Svolvær's nearest classic, with variants on every side.",
  torskmannen:
    "750 metres of ascent from the Kvitfossen power station in Vestpollen: the valley where the snow lies sheltered, the lake in the hollow and the col right of the summit — and the ridge for the last stretch.",
  pilan:
    "850 metres of ascent from Laupstad on the north side of Austvågøya: the valley to the lake at 289, toward Morfjordskaret and the broad flank — with a measured 39-degree step in the summit cone.",
  kleppstadheia:
    "520 metres of ascent from Kleppstadveien south of the Gimsøy bridge: the ridge toward point 156 and the gentle, broad field to the top — the tour the source itself uses to practise track-setting.",
  skjomtinden:
    "1490 metres of ascent from Nervatnet in Håkvikdalen to the Sleeping Queen: the hollow around Litletind, the ridge toward Dronninga, the traverse on the west sides — and the snow gully onto the crest. Ice axe and crampons in the pack.",
  litletind:
    "920 metres of ascent from Nervatnet to the fore-summit with the city view: the bog south of the lake, the sparse forest and the ridge — Narvik and Rombaksfjorden below the cairn.",
  beisfjordtotta:
    "1430 metres of ascent from the gate above Djupvik: the waterworks road past Pumpvatnet, the east side of Forsnesvatnet on dry land — and the col before the ridge south to the mountain of many secrets.",
  spanstinden:
    "1050 metres of ascent from Bukkemyrvatnet on Gratangsfjellet: the terraces toward Sølvfjellet, the snowfield southeast of the summit — and the spectacular last metres to the cairn.",
  gangnesaksla:
    "1310 metres of ascent from the power station in Sørskjomen: the works road along Vesterskarelva, the dam at the treeline and the shelf at 800 — with the Frostisen glacier in view and the Gangnesrenna below the edge.",
  snotinden:
    "1240 metres of ascent from Ånstad to Andørja's great classic: the forest east of Snøfjellelva, Snøfjellvatnet and the west flank — five named descents, with axe and crampons in the pack.",
  "stortinden-rolla":
    "980 metres of ascent from Indre Forså to Rolla's highest: the moors, the east side of Mevatnet on land — and the couloir south of the summit, an even 30–40 degrees, with Drangen as the expert backdrop.",
  reinspalen:
    "1400 metres of ascent from Våtvoll to Kvæfjord's highest — Kobberyggen and Geitryggen with plenty of up and down, and an exposed ridge traverse with walls on both sides at the end.",
  snotindan:
    "1550 metres of ascent from Løbergsbukta for a 996 summit: mid-valley between the runout zones of Løbergsdalen, over Løbergskaret, between the lakes — and the 30–40 degree summit slope at the end.",
  "storhornet-kvafjord":
    "660 metres of ascent from Kvæfjordeidet along Harstad's ever-best-groomed trail to Koven — and a gentle, south-facing ridge on to the cairn. The sun tour of the round.",

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
  storgalten: {
    intro:
      "Fjord to summit in outer Lyngen: 1215 metres of climbing from the roadside where Galtelva runs out into Nord-Lenangen, to the cairn at 1219. A short line, open mountain from 70 m up, and the fjord behind you from the first step.",
    ascent: [
      "Start at Sandneset, where Galtelva runs out into the fjord at 14 m, right by Fv7922 Lenangsveien. Parking is unsigned: what there is is the space on the north side of the river mouth and the verge along the county road. Park well clear of the carriageway — this road is plowed all winter. From here go straight into Galtdalen north of Lassofjellet and keep the south bank of the river, which is the right-hand side going up. The birch forest gives up at around 70 m; the rest of the tour is open terrain.",
      "Round the north side of Lassofjellet and aim for the col between Litle-Galten and Storgalten. You do not go all the way up into the col. It bottoms out at 626 m, and going there hands back height you have just gained. Get onto the rib a couple of hundred metres south of the col instead — that is where the climb begins.",
      "Between 800 and 860 m the flank steepens to 30–35 degrees, and the steepest step on the whole line is here: 34.6 degrees between 802 and 823 m. If the snow is wind-scoured and hard, crampons earn their weight. Above 880 m the ridge broadens, but it does not stop climbing — the last 300-odd metres of ascent average about 20 degrees, with a single 26-degree step around 1000 m. Stay on the west side of the crest the whole way: the east and northeast sides fall 36–43 degrees on average into Kalddalen toward Kalddalsvatnet at 477 m, with individual sections at 53–58.",
    ],
    descent: [
      "Back down the same way. From the summit plateau follow the broad ridge north back to the rib south of the col and out into the west flank; from there to the valley floor it is continuous open terrain with no forest to slow you. For more room, traverse southwest just before the final drop toward the col — there is a large, gentle bowl there that takes big turns.",
      "The mistake people make: dropping straight west off the summit plateau instead of following the ridge north down to the rib. Gully systems run the whole length of Storgalten's west side, and the steepest sections measure 40–50 degrees. From the ridge you cannot see where they begin, and the entry is hard to read from above — if you mean to ski them, climb them first. The col is not the danger here; the west flank south of the rib is.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The normal route runs in the west flank, in start and runout terrain. The steepest part of the line is the 30–35 degree section between 800 and 860 m, with the steepest step measured at 34.6 between 802 and 823. The hundred metres from 800 to 900 m is the steepest band on the whole route, averaging 22.3 degrees. Below it the flank is open from 70 m down to the fjord, with no forest to slow anything down.",
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
      distanceLabel: "4.2 km",
      caption: "From 14 m at Galtelva's mouth to 1219 at the top — 1215 metres of climbing over 4.2 kilometres, with the steepest ground between 800 and 860.",
    },
  },
  "store-skalltinden": {
    intro:
      "981 metres of ascent over 6.04 km from the sea at Glimbukta to Store Skalltinden at 901 — the whole mountain from the shore, on the east side of Ringvassøya. Fri Flyt rates it KAST 2 – Challenging with sections of 30–40 degrees in the last 800 metres toward the summit; the line measures 21.6 degrees in its steepest 100 m band and 27.0 in its steepest sustained stretch, and the undulating ridge gives back 91 vertical metres along the way — which is why the card carries 980 where the source counts 900.",
    ascent: [
      "From the old gravel pit at Glimbukta on the fv. 863 — 11.0 m, a winter-open county road. You climb the hillside toward the lake at 100: the forest ends already at 185 m after 1.39 km, with open ground from 199. On toward Skallvatnet at 320 come the small steep sections between 230 and 300 m the source asks you to navigate with care — the band from 300 to 400 measures 11.0 degrees.",
      "The line keeps to land at the south end of Skallvatnet, as the source puts it, and climbs the ridge westward. The ridge undulates — 91 vertical metres are given back along the way — and from the flat southwest of point 695 you aim north-northwest. The lake at 543 m there is part of the line: it crosses 103 metres of it, never more than 18 metres from shore — a natural lake, not regulated, and on winter ice that is ordinary winter travel.",
      "The last 800 metres toward the summit are the serious part: the band from 700 to 800 m measures 21.6 degrees over 225 metres of ground with the steepest sustained stretch at 27.0 between 763 and 785, and the source gives sections of 30–40 degrees requiring terrain assessment — with steep ground on both sides of the line. The cairn at 901; the register's Store Skalltinden lies 31 m from Fri Flyt's published point, and the summit search resolves 901.1 against a published 900.",
    ],
    descent: [
      "Down the same way, with variants by conditions. The southeast sector the line follows is the gentlest on the summit — 16.5 degrees mean over 500 metres with 33.7 as the steepest 60 m window 240 to 300 metres out.",
      "The rest of the summit is another story: northeast, east and southwest fall 40.2, 41.6 and 40.8 degrees mean. Bjørnskardalen is the source's KAST 3 alternative and belongs to stable days. The fjord view from the cairn — the Lyngen Alps across Ullsfjorden — is the same whichever day you choose; the line down should not be.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, hazards release zones, runout zones and cornices. The line measures 27.0 degrees at its steepest, but the source gives sections of 30–40 in the last 800 metres — and between 600 and 800 steep ground stands on both sides of the line. Grade 3 stands for the same reason: sea to summit with three named hazards is more than a slope angle.",
      },
      {
        title: "The small steep sections",
        body: "Between 230 and 300 m, above the Skallvatnet step, sit the small steep sections the source asks you to navigate with care. They are short — and they come early in the tour, before the day's stability has shown itself. Read them as a test of the rest.",
      },
      {
        title: "The lake at 543",
        body: "The line crosses 103 metres of the natural lake southwest of point 695, never more than 18 metres from shore. Winter ice on a small mountain lake is ordinary winter travel — but it is worth knowing there is a lake under you, especially early and late in the season.",
      },
      {
        title: "Before you go",
        body: "Store Skalltinden lies in the Tromsø forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The January–May season is Fri Flyt's. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "11 m",
      endLabel: "901 m",
      distanceLabel: "6.0 km",
      caption: "981 metres of ascent and 6.04 km from Glimbukta via Skallvatnet and the undulating ridge, with the treeline at 185 m and the steepest ground — 27.0 degrees between 763 and 785 m — in the last 800 metres.",
    },
  },
  "store-blamann": {
    intro:
      "Kvaløya's highest, and a tour that stands apart from the rest of the Tromsø peaks: 1035 vertical metres in three kilometres, with a summit section most people take their skis off for.",
    ascent: [
      "From the parking at Slettneset on Fjordvegen (fv 7768) the marked Blåmann trail heads west straight from the shoreline. The first hundred metres run on duckboards over bog; the forest lets go immediately, and from 56 m upwards you are in open terrain the rest of the way.",
      "The trail climbs evenly west to the shoulder at around 230 m, then swings southwest and gains the ridge above Steet. From 475 m upwards the crest is the entire route. The first three hundred vertical metres up there are broad and forgiving — the flanks fall at only 10 to 25 degrees, and the mountain feels easier than it is. That lasts to about 800 m.",
      "From there you follow the east-southeast ridge west, with the south flank dropping into Blåmannsvikdalen. A flatter intermediate section gives you a breather around 670 m. From about 800 m it tightens on both sides: the south flank goes from 20 to a mean of 42 degrees, with sections past 55, and the north side starts to fall away. The steepest hundred-metre band on the line lies between 900 and 1000 m at a mean of 22.2 degrees, and the steepest single step measures 36.5.",
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
        body: "The route sits on the crest from 475 m upwards, and that is what makes it possible. Up to around 800 m the ridge is broad and the flanks are gentle, 10 to 25 degrees. Above 800 that is over: the south flank averages 42 degrees, the north side 38 and up. The steepest hundred-metre band on the line, 900 to 1000 m, holds a mean of 22.2 degrees, and single steps measure 36.5. The summit section above 880 m is steep and exposed; in hard snow it is a climb, not a ski tour.",
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
      distanceLabel: "3.4 km",
      caption: "3.4 km and 1035 vertical metres: the duckboards at Slettneset, the ridge above Steet, and the steep summit section.",
    },
  },
  kjolen: {
    intro:
      "578 metres of climbing and 4.11 km from Finnvikvatnet to the radar at 790 m — one of Kvaløya's most-visited summits, and a mountain with no steep section on the route at all. The steepest hundred-metre band is 12.6 degrees between 300 and 400 m, and the steepest step 24.9 between 605 and 620. What is steep on Kjølen faces north, and the route goes east.",
    ascent: [
      "Start south of Finnvikvatnet, 224 m, which is where ut.no started: «we parked on the south side of Finvikvatnet, one of many starting points.» The mapped car park is 640 metres further north at the east end of the lake, and you can walk from there — but not across the ice: the water surface is 229 m and the land east of it 254 to 265, so the way is round rather than over. Fri Flyt describes four starting points for this mountain and calls this one «a slightly shorter alternative with less climbing».",
      "The tour is above the treeline almost from the car: Kartverket puts the last forest at 218 m, 40 metres along the line, and open ground from 219 all the way to the top. The first 904 metres up Finnvikdalen climb 5.1 degrees. Then comes the steepest stretch of the tour, and it is not steep: 12.6 degrees from 300 to 400 m over 450 metres of ground. Above it the angle eases again — 8.4 degrees from 400 to 500, 6.9 from 500 to 600, 9.5 from 600 to 700 and 7.3 to the top — passing the corridor points at 440, 572 and 703 m.",
      "The only place the line really stands up is between 605 and 620 m, where the steepest 30-metre window measures 24.9 degrees. Fri Flyt gives a steepest point under 27 degrees for all four of its routes on the mountain. The summit plateau is reached at 774 m, and from there it is flat across to the big radar and the warming hut Troms Turlag built by volunteer work in 2010. Both are on the map: the radar is the OSM node «Stor-Kjølen Radar», 46 metres from the summit cell, and the hut «Varmebua på Kjølen», 41 metres from it.",
    ],
    descent: [
      "Back the same way, down Finnvikdalen. The bearing from the summit to the starting point is 62 degrees, between east and north-east, and those two radials measure 9.8 and 10.0 degrees mean out to a kilometre — that is the whole story of that side. Fri Flyt, for its part, puts the best skiing on the mountain somewhere else: the routes from Kvaløysletta and Slettaelva, «where the last stretch down Finnlandsfjellet is simply to be enjoyed in big, glorious turns». This is the short way up, not the finest way down.",
      "Ut.no is clear about what the tour is and is not: «not a summit for anyone who needs sharp ridges and steep descents, but a fine top that gives good skiing.» Its warning is not about gradient but about what lies under the snow: «how much snow there is decides your options on the way down. Follow the snowfields as far as you can, and avoid the obvious terrain traps and stream gullies.»",
      "North is a different matter. The north flank measures 20.9 degrees on average out to a kilometre with a 36.7-degree window 710 to 770 metres out — the only direction from this summit that holds over 20 degrees mean. The plateau is broad, the radar is the only landmark in poor visibility, and if you give in to the urge to take a fresh line down to the north, that flank is what you drop into.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "578 metres of climbing where the steepest band is 12.6 degrees and the steepest step 24.9. Fri Flyt files all four of its routes on the mountain as KAST 1 – simple, and ut.no grades this one moderate. Neither names a hazard on the ascent.",
      },
      {
        title: "The north side and the plateau",
        body: "Seven of the eight directions from the summit measure under 12 degrees mean: north-east 10.0, east 9.8, south-east 9.9, south 11.3, south-west 7.9, west 4.8 and north-west 8.0. North measures 20.9 with 35.5 degrees in the window 720 to 780 metres out. That is the one edge worth knowing about, and it is easiest to find in poor visibility, when the plateau gives you nothing to navigate by and the radar disappears behind you.",
      },
      {
        title: "Before you go",
        body: "Read today's avalanche forecast for Tromsø on varsom.no — an A region, forecast every day in season. Ut.no gives January to May and Fri Flyt November to June; the card carries the overlap, November to May. The hut on top is unlocked, but it is a rest stop and an emergency shelter, not a reason to set out in weather you would otherwise turn back from. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "224 m",
      endLabel: "790 m",
      distanceLabel: "4.1 km",
      caption: "578 metres of climbing and 4.11 km from south of Finnvikvatnet at 224 m, up the valley past 440 and the east side past 572 and 703 to the summit plateau at 774.",
    },
  },
  rodtinden: {
    intro:
      "450 metres of climbing and 2.32 km from the Storelva ski stadium to the summit at 470 m — the most-visited top around Tromsø, and a tour for any occasion. The steepest hundred-metre band is 15.1 degrees between 300 and 400 m, and the steepest step 24.2 degrees between 429 and 447. The one genuinely steep thing on the mountain is south-east of the cairn, and the route does not go in it.",
    ascent: [
      "Start at the Storelva ski stadium on Kvaløysletta, 20 m, where there is mapped parking at the ski stadium. Fri Flyt gives 2.8 km for the tour and ut.no's own line measures 2.52; the line routed here is 2.32 km. The mountain is Rødtinden in Norwegian and Ruksesvárri in Northern Sami, and Kartverket's register carries both.",
      "The first kilometre follows the lit trail up Storelvdalen — the line's first 942 metres climb 5.1 degrees on average — and at 96 m the route leaves the trail for the hillside, and from there the gradient is strikingly even: 14.5 degrees from 100 to 200 m, 15.0 from 200 to 300, 15.1 from 300 to 400 and 14.9 above that. The tour gives back not one metre of height on the way up.",
      "Kartverket carries forest to 208 m and open ground from 218, but the forest here is birch with bog between it — the terrain class along the line alternates between Skog and Myr at 53, 156 and 241 m. Above it you pick your own track. Fri Flyt: «you soon come out above the forest and can lay the track as you please — though you would have to be unlucky not to find one to follow.» The last hundred metres of climbing hold well to the west where the ridge is gentlest, and the steepest step of the tour is here: 24.2 degrees between 429 and 447 m.",
    ],
    descent: [
      "Back the same way, south-east towards the stadium. West of the cairn the flank measures 3.3 degrees on average out to a kilometre and south-west 15.1, so picking the wrong edge does not punish you with steepness — it puts you in the wrong valley.",
      "The one steep thing on this mountain is south-east of the cairn, and it is close. The 135 radial, read off the point API every ten metres, runs 469.6 – 467.7 – 464.6 – 459.5 – 452.7 – 448.8 – 437.0 – 430.6 – 426.6 m over the first 80: the steepest 60-metre window is 32.3 degrees between 20 and 80 metres out, and the steepest single step 49.7 degrees between 50 and 60. Fri Flyt's «slopes of up to 40 degrees» is right, and over the twenty metres where it is steepest, conservative.",
      "To the north-west the problem is the opposite one. The top is a rounded shoulder rather than a summit in the terrain model: the ground keeps rising without a saddle — 479.6 m at 200 metres out, 488.5 at 400 and 491.0 at 600 — and carries on to 567.0 m at the register point for Storbogtinden, 728 metres away. In flat light you walk past the cairn without noticing, onto a mountain with a different tour on it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "450 metres of climbing where no hundred-metre band measures over 15.1 degrees and the steepest step is 24.2. Fri Flyt files the tour as KAST 1 – simple, with the steepest point under 25 degrees, and writes that a track here can be laid entirely clear of avalanche terrain. That holds as long as it stays west of the summit ridge at the end.",
      },
      {
        title: "The south-east slope",
        body: "That slope is the tour's only hazard, and it is steeper than the figure Fri Flyt gives: 49.7 degrees over ten metres between 50 and 60 metres from the cairn, and 32.3 degrees across the whole window from 20 to 80. From the top it looks like the natural line back down to the stadium, and it is the shortest way home. The east side is the same story on a smaller scale: 15.0 degrees mean, with a 28.6-degree window sitting 50 to 110 metres out — further from the cairn than the south-east one, and so easier to wander into without having decided to.",
      },
      {
        title: "Before you go",
        body: "Read today's avalanche forecast for Tromsø on varsom.no. Tromsø is an A region and is forecast every day through the season, unlike many of the mountains further south in this app. No source gives a season for Rødtinden; the card's December to May is read off the height — the summit is 470 m — and off Fri Flyt giving Kjølen at 790 m November to June. Carry a transceiver, probe and shovel, even on the local hill.",
      },
    ],
    elevationProfile: {
      startLabel: "20 m",
      endLabel: "470 m",
      distanceLabel: "2.3 km",
      caption: "450 metres of climbing and 2.32 km from the Storelva ski stadium at 20 m, off the lit trail at 96 m and up the open south-east side past 303 and 431.",
    },
  },
  storfjellet: {
    intro:
      "1053 metres of ascent over only 3.27 km — Storfjellet rises straight out of Breivikeidet, and the line matches: evenly steep from the forest up, with the band from 500 to 600 m at 29.7 degrees and the steepest sustained stretch at 36.5. Fri Flyt rates it KAST 2 – Challenging with 30–40 degrees between 950 and 1040, a gully acting as a terrain trap in the valley — and an east face with a 1997 avalanche that took two lives. An anonymous mountain, says the second source, with varied descents and a fine view.",
    ascent: [
      "From the fv. 91 in the area where it crosses Storelva — 41 m on Breivikeidvegen, and 1089 minus 41 reconciles the source's 1050 vertical metres. You head toward Russevankskardet along the northeast side of the river valley: the band from 200 to 300 m measures 21.1 degrees, and the gully in the valley is the source's own hazard — it acts as a collecting funnel for avalanches off the surrounding slopes, so the line keeps to the valley side, not the floor. The forest ends at 455 m after 1.8 km, with open ground from 463.",
      "At about 400 you swing north and east, onto the south ridge coming down from the summit. The transition is the steepest of the tour: the band from 500 to 600 m measures 29.7 degrees over only 198 metres of ground, with the steepest sustained stretch — 36.5 degrees — between 531 and 554 m.",
      "The ridge takes you to the top: 24.9 degrees from 800 to 900 m and 23.7 from 900 to 1000, which is the line's answer to the source's «30–40 degrees between 950 and 1040» — the ridge slants where the flank stands. The cairn at 1088; the register's Storfjellet lies 46 m from Fri Flyt's published point, and the summit search resolves 1088.2 against a published 1089.",
    ],
    descent: [
      "The normal descent follows the route up — the southwest sector is the gentlest on the summit, 26.2 degrees mean with 37.0 as the steepest 60 m window, and it is the only one: southeast falls 34.8 mean with a window of 59.9, south 36.3 with 53.1, and the north side has 53.9 degrees only 100 to 160 metres out.",
      "The east face from Krokenga is the source's KAST 3 alternative, with long exposure in both release and runout zones and 30–40 degrees from 240 m up. The 1997 avalanche that took two lives ran here. It is not the line on this card, and not a way down you take on a feeling.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, with 30–40 degrees between 950 and 1040 on the flank and the line's own steepest at 36.5 degrees in the transition onto the ridge. Nearly the whole tour sits in or beside terrain over 30 degrees — this is a tour for stable conditions.",
      },
      {
        title: "The gully in the valley",
        body: "The source's own hazard: the gully acts as a collecting funnel for avalanches off the surrounding slopes. The valley toward the col is receiving terrain — keep the line on the valley side and your distance from the slopes as part of the track.",
      },
      {
        title: "The east face",
        body: "KAST 3 – Complex, long exposure in release and runout zones, 30–40 degrees from 240 m — and a 1997 avalanche that took two lives. The history is part of the mountain, and it is why the normal route takes the ridge.",
      },
      {
        title: "Before you go",
        body: "Storfjellet lies in the Lyngen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The January–May season is Fri Flyt's. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "41 m",
      endLabel: "1088 m",
      distanceLabel: "3.3 km",
      caption: "1053 metres of ascent and 3.27 km from Breivikeidet up the south ridge, with the treeline at 455 m and the steepest ground — 36.5 degrees between 531 and 554 m — in the transition onto the ridge.",
    },
  },
  skarlitinden: {
    intro:
      "937 metres of ascent over 6.34 km from Sandeggen on Breivikeidet to the cairn at 857 — a KAST 1 tour with the steepest point under 27 degrees on the route itself, where the surrounding terrain is the story: the river valley you follow can act as a terrain trap for avalanches off the slopes to the north, and the couloirs on the southeast side fall 41 degrees mean toward the valley you came from. The line collects a hundred-odd vertical metres more than the source's 835, because the col and the plateau give back 110 along the way.",
    ascent: [
      "From the forest road at Sandeggen — 31 m on Breivikeidvegen, the fv. 91, a winter-open main road — you follow the road in and branch off along the north side of Russevankelva, up through bouldery ground. The band from 100 to 200 m measures 14.7 degrees; the forest ends already at 318 m after 2.42 km, with open ground from 327.",
      "At about 400 it flattens into Russevankskaret — 452 m where the line runs, and the register's Russevankskaret reads 446. Here is the source's terrain trap: the valley collects runouts from the slopes to the north, so your distance from them is part of the track the whole way in. At point 511 you swing south-southeast, and the line gives back its steepest stretch here — 30.5 degrees down between 539 and 516 m, the dip after the col that is why the tour collects 937 vertical metres where the source counts 835.",
      "From the turn it climbs evenly onto the summit plateau: the band from 600 to 700 m is the tour's steepest upward, 21.1 degrees over 269 metres of ground, easing to 13.1 and 8.1 above 700. The plateau passes 847 before the cairn at 857 — Fri Flyt's published GPS point, the register point (which carries both Skarlitinden and Skardlitinden) and the terrain model's 857.5 coincide.",
    ],
    descent: [
      "The normal way down is your own track, and the plateau side is gentle: northwest measures 3.3 degrees mean and west 11.0. Hold back from the southeast edge — it falls 41.4 degrees mean with 52.5 as the steepest 60 m window 120 to 180 metres out from the cairn, and the south side 36.1 with 48.8 only 50 to 110 metres out.",
      "Østerenna is the source's alternative down to the east: KAST 3 – Complex, 30–45 degrees between 760 and 380 m. The east side measures 21.5 degrees mean with 45.2 as the steepest window 340 to 400 metres out — skiing in avalanche terrain, a choice made on stability, not on temptation.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 1 – Simple by Fri Flyt, steepest point under 27 degrees on the ascent — and the line's own steepest stretch is in fact downhill, 30.5 degrees in the dip after point 511. The card carries grade 2: the terrain beside the line is what needs your head.",
      },
      {
        title: "The terrain trap",
        body: "Fri Flyt's hazards are «Terrengfelle. Skavler» — terrain trap and cornices. The river valley along Russevankelva collects runouts from the slopes to the north — you are travelling in receiving terrain, and your distance from those slopes is part of the track all the way into the col.",
      },
      {
        title: "The edge and the couloirs",
        body: "The southeast and south sides of the plateau fall 41.4 and 36.1 degrees mean toward Breivikeidet, with windows of 52.5 and 48.8 degrees near the cairn — and the cornices build out over the edge. In flat light the plateau rim is something to have thought through before you are standing on it.",
      },
      {
        title: "Before you go",
        body: "Skarlitinden lies in the Lyngen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The January–May season is Fri Flyt's. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "31 m",
      endLabel: "858 m",
      distanceLabel: "6.3 km",
      caption: "937 metres of ascent and 6.34 km from Sandeggen through Russevankskaret, with the treeline at 318 m and the steepest ground — 30.5 degrees — in the dip after point 511.",
    },
  },
  fastdalstinden: {
    intro:
      "1271 metres of ascent and 7.32 km from the road end at Varto — a Lyngen classic with a long approach and a reservoir in the middle of the tour. Fri Flyt rates the normal route KAST 2 with a steepest point of 25–30 degrees, and the measured line is kinder than the reputation: steepest 100-metre band 19.5 degrees between 200 and 300 metres, steepest sustained stretch 25.5. The card's grade 3 is the scale, not the steepness: this is a 6–8 hour tour where the surrounding terrain — cornices, runout zones and a south side with fatal accidents in its history — is a different class from the track.",
    ascent: [
      "From road 7920 at Rottenvik, Vardoveien branches off and climbs about a kilometre to the road end at 123 metres — Fri Flyt's 'car park at Varto' — the register's Varto (Høyde) stands 1.8 km east at 187 metres, and the name registered at the road end itself is Vardoveien. The works road continues west and upwards: it is mapped all the way to the dam at 515 metres, and the first four hundred vertical metres are done on a road. The forest ends already at 363 metres by Kartverket's classes.",
      "The dam deserves its own sentence: Rottenvikvatnet is a reservoir — regulated, with the terrain class to match — and the ice on a regulated lake is not to be used. The line therefore goes as the source says, along the west and later the north side of the lake, on land the whole way: the west shore at 566, the north-west shore at 572, the north end at 589 metres. That is measured against both the terrain classes and the OSM polygon: 0 metres on water.",
      "From the north end of the lake the ground rises to the flat Fri Flyt puts at 650 metres — measured 650 to the metre. Continuing west, the line passes north of the little lake at 697, and then comes the ridge formation the source tells you to stay awake on: 'there are small areas here that are around 30 degrees, so take a little time to make good route choices'. The line holds 815 → 1070 on the ridge, with line choice as the tool.",
      "From the ridge it is straight at the summit, as the source says. The cairn stands at 1275 metres, and the south-east side you came up is the gentlest sector the mountain has: a mean 16.0 degrees, with 28.4 as the steepest 60-metre window in the first hundred metres.",
    ],
    descent: [
      "The same line down as up is the source's advice, and the numbers side with it: south-east and south are the only sectors without a 30-degree window in the sweep — 28.4 and 28.2 degrees as the steepest 60 m — and the line itself bears 169 to 180 degrees down. Down the ridge, past the little lake, onto the flat and around the reservoir on land again — the tour gives back 119 vertical metres in total, most of it around the lake and on the works road.",
      "The south-side descent Fri Flyt mentions — 35–45 degrees down towards Rottenvikvatnet — is not this line, and the source itself says why in unusually heavy words — 'the south side of the mountain has been the scene of a couple of tragic avalanche accidents with fatal outcome', and it writes that inside the description of the normal route, not about the variant: rock sections around 1000 metres must be identified on the way up, and the runout demands solid ice on a lake that is regulated. This guide does not draw it.",
      "Stay awake west and south-west of the cairn too: the sweeps measure a mean 34.3 and 32.5 degrees there, with 46.6 and 51.6 as the steepest windows — the fjord side is alpine, and in flat light the edge is easy to get too close to.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt's stated hazards are 'runout zones and cornices', and that is precise: the line itself holds 25.5 degrees as its steepest sustained stretch, but it crosses beneath steeper flanks — the ridge formation has slightly steep sections around 30 degrees, and Normal Route II further north is exposed to release zones from above between 700 and 900 metres. Choose the ridge with your eyes uphill, not only downhill.",
      },
      {
        title: "The south side",
        body: "'The south side of the mountain has been the scene of a couple of tragic avalanche accidents with fatal outcome', writes Fri Flyt — and he writes it inside the description of the normal route, just after the flat at 650, not about the variant. The warning covers the whole south side as you see it from the ridge you climb; the 35–45 degree descent towards Rottenvikvatnet he files himself as 'Ned sørsiden ➌ Komplekst'. It lies right beside the normal route and tempts on the way down. The measurements from the cairn say that everything west of south is alpine: SW 51.6 degrees as the steepest window, W 46.6, NW 41.0.",
      },
      {
        title: "The reservoir",
        body: "Rottenvikvatnet is regulated, and regulated ice is not to be used — drawn down in winter it settles into cracks and voids along the shore. The line goes around the lake on land in both directions, measured point by point, and the only reason to be on the ice is to have chosen wrong. The works road and the dam are there because this is a power reservoir; read the landscape accordingly.",
      },
      {
        title: "Before you go",
        body: "Fastdalstinden is in the Lyngen forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. The season January–May is Fri Flyt's own. The time is not: it gives 5–6 hours, while the card carries 6–8 — the app's own scale for 1270 metres of ascent and 7.3 km. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "123 m",
      endLabel: "1275 m",
      distanceLabel: "7.3 km",
      caption: "1271 metres of ascent and 7.32 km from Varto — a works road, a reservoir rounded on land, and the ridge straight at the 1275-metre summit.",
    },
  },
  tromsdalstinden: {
    intro:
      "Tromsø's signature peak, and 1209 vertical metres in one push from the shooting range in Tromsdalen to the summit cairn. The track stays under 27 degrees the whole way — it is the length, not the steepness, that makes the day.",
    ascent: [
      "From the parking at the shooting range at the end of Turistvegen, follow the forest road southeast into Tromsdalen. Stay on the west side of Tromsdalselva the whole way; the birch lets go already around 220 m, and from there the valley lies open in front of you. Sommerruta takes the NNW ridge out of the valley lower down — that is the walking route, not the ski route.",
      "At its head the valley flattens out by Dalbotnvatnet at 311 m. Just before the basin Svarthammaren rises on the west side — a north-facing cliff that loses close to 100 vertical metres in sixty. Keep to the valley floor east of it and aim for the saddle. The slope up to Salen at 740 m is the biggest loading surface on the tour: the track cuts across it at 12 to 13 degrees, while the fall line measures 30 to 35 if you take it head on.",
      "From Salen it eases off. Follow the south ridge northeast towards the cairn. The band between 1000 and 1100 m is the steepest on the ridge itself, a mean of 20.1 degrees; the tour's steepest single stretch sits low on the slope up to Salen, 26.3 degrees between 547 and 569 m. Above 1100 m the east edge of the ridge is corniced — stay on the west side of the crest, also when the track tempts you further out.",
    ],
    descent: [
      "Back the same way: the south ridge to Salen, then west down into inner Tromsdalen and out the valley to the car. From Salen the flank falls evenly west towards Dalbotnvatnet, and that is where the best turns are.",
      "The common mistake: dropping straight down the west side from the summit. From the cairn the west flank rolls off at 20 to 35 degrees, and that is the whole problem — it looks skiable from up there. Below about 1080 m you are on Fronten: a hundred vertical metres of 45 to 58 degrees, with no way out to either side. Hold the ridge south to Salen before you commit west.",
      "The last kilometres are forest road. The fall is slack — under five degrees the whole way out — so expect to pole.",
    ],
    avalanche: [
      {
        title: "The route itself",
        body: "The track passes 25 degrees in one place, between 547 and 569 m on the slope up to Salen, where it measures 26.3; the 1000 to 1100 m band holds a mean of 19.2 degrees. The slope up to Salen is the part you have to read. It faces west and northwest, and the fall line measures a mean of 30 to 35 degrees with sections past 40: the track cuts across it, but the snow does not care about the track. It loads in easterly and southeasterly wind, not westerly. Above 1100 m the east edge of the ridge is corniced all the way to the cairn.",
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
      distanceLabel: "8.3 km",
      caption: "8.2 km and 1209 vertical metres: forest road to Dalbotnvatnet, the slope up to Salen, the south ridge to the cairn.",
    },
  },
  gabrielfjellet: {
    intro:
      "1139 metres of ascent over 4.39 km from Stormo on the fv. 91 to the summit skiers call Gabrielfjellet — and the register calls Iverfjellet. Fri Flyt rates it KAST 2 – Challenging with the steepest section at 30–35 degrees; the line measures 24.9 degrees in its steepest 100 m band and 29.2 in its steepest sustained stretch, and above the steep ground wait broad fields: the band from 900 to 1000 m measures 9.0 degrees over 631 metres of ground. One long climb, says the second source, steepest in the middle — and the numbers agree.",
    ascent: [
      "From the northernmost of the two Stormo farms along the fv. 91 — the register's Stormo reads 75.9 m, and the parking is along the road as the source says. You head south through sparse forest: the band from 100 to 200 m measures 13.0 degrees, and the forest ends already at 420 m after 1.4 km, with open ground from 437.",
      "From the open sections the route turns more east, and between 400 and 850 m the terrain is rolling ridges with flats between — 17.3 degrees from 400 to 500, 14.3 from 500 to 600. Then the steepest part: the band from 600 to 700 m measures 24.9 degrees over 226 metres of ground, with the steepest sustained stretch at 29.2 between 663 and 680. The source gives 30–35 degrees here and asks for deliberate line choice — the flank stands steeper than the diagonals the line cuts it in.",
      "Above 850 it eases toward the summit and the big fields take over: 9.0 degrees from 900 to 1000 m over 631 metres of ground, then 15.6 and 14.7 up the last ridges to the cairn at 1214. Fri Flyt's published GPS point lies 47 m from the register's Iverfjellet, and the summit search resolves 1213.7 against a published 1213 — the register's own «Gabrielfjellet» is a shoulder 3.2 km northeast, and outdooractive lists the tour under both names.",
    ],
    descent: [
      "The descent is north, the way you came — and the north side is the gentle sector of the summit: 13.5 degrees mean over 500 metres with 17.8 as the steepest 60 m window. With stability in order the steepest section gives fine skiing with variants; without it you ski the fields above and traverse past.",
      "Hold back from east and southeast off the cairn: 40.8 and 38.8 degrees mean, with 50.3 and 48.1 as the steepest windows directly below the top. The west side — the source's KAST 3 alternative — measures 31.2 mean with sections of 40–45 in the source's own description.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, steepest section 30–35 degrees with line choice required. The line measures 29.2 degrees at its steepest, between 663 and 680 m — that stretch decides whether the day has the stability the tour needs, and it can be traversed at a gentler angle than the fall line.",
      },
      {
        title: "Release and runout zones",
        body: "The source's hazards. The steep band between 600 and 700 sits in the middle of the line, so your runout is the very terrain you are about to climb — read the flank above you before entering it, and use the flats between the ridges as reading points.",
      },
      {
        title: "The east edge",
        body: "The east and southeast sides of the summit fall 40.8 and 38.8 degrees mean with windows over 48 directly below the cairn. The fields toward the top are broad and readable — the edge where they end is not. In flat light it is worth knowing where it is before you are on it.",
      },
      {
        title: "Before you go",
        body: "Gabrielfjellet lies in the Lyngen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The December–May season is Fri Flyt's. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "76 m",
      endLabel: "1214 m",
      distanceLabel: "4.4 km",
      caption: "1139 metres of ascent and 4.39 km from Stormo, with the treeline at 420 m, the steepest ground — 29.2 degrees between 663 and 680 m — in the middle, and broad fields toward the summit.",
    },
  },
  rornestinden: {
    intro:
      "The friendliest way into the Lyngen Alps: forest road at the bottom, an easy-angled flank above, and a broad summit plateau to put your turns on. The tour for your first Lyngen day, and for the day the rest of the range is too much.",
    ascent: [
      "Start from the car park at Eidebakken on the edge of Lyngseidet, at 62 m, in the area by the plastics factory and the shooting range. Follow the forest road inland and up toward Hyttehaugen at 286 m, then on past Skihytta. The birch forest gives up at around 310 m, and from there you can see the rest of the tour ahead of you.",
      "Continue west toward Rørneshytta, staying on the south side of Gjerdelva throughout — a variant follows the ridge north of the river up to the flat at around 600 m when the snow cover allows, but the normal route keeps to the south bank. Whichever side you are on: do not go far down into the river valley toward Gjerdelva. The sides dropping into it break at 34–37 degrees where they read as flat from above, and the bottom is a terrain trap. The hut sits at 604 m, and that is where people stop.",
      "From the hut you drop a little before climbing again. You cross Gjerdelva at around 590 m, a dip of some fifteen metres; the tour gives back 38 metres in total on the way up. Then follow the east side of the flank upward to about 850 m and turn from there toward the summit.",
      "Along the line on the map the steepest step is 27.3 degrees, and the hundred metres between 800 and 900 m average 21.4. The flank around you is steeper, and the average hides how much: measured 400 m out from the track at 907 m the east side runs 30 degrees on average and the north side 33, but the north side falls in steps of 41 to 58 degrees between 928 and 692 m, and the east side in steps of 44 to 48 below 794. Take too direct a line for the top and those are what you are standing in. Higher up it flattens out onto the broad summit plateau at 1030.",
    ],
    descent: [
      "Back down the same way. The summit plateau is roomy enough to put your turns where you like — as long as you stay on its south and east side. The north and northwest edges fall away at 40–47 degrees on average with steps of 50–57, and that is where the cornices build. The east flank down to 850 m is the longest continuous run on the normal route, 20–23 degrees along the track. Below that, hold the ascent track down to Rørneshytta and on east toward Skihytta and the forest road.",
      "The mistake people make: letting the descent pull you down into the river valley toward Gjerdelva. The ridge north of the river is itself a documented variant and skis fine — it is the bottom that is the problem. The river valley is a large terrain trap where a person was killed in the winter of 2017, and the sides dropping into it measure 34–37 degrees even though they read as flat from above. Hold your height until you are out of the valley.",
      "The steeper lines off the summit are tours in their own right, not variants of the normal route. Topphenget is a straight line from the summit with sections at 35–40 degrees. Skredbekken heads out toward Gjerdaksla after Topphenget and follows the gully north of it down toward Sollia, with sections at 30–40 degrees; people have triggered slides there before, and you finish a long way from your car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The ascent passes through runout zones from 800 m up. The track itself is easy-angled — the steepest step measures 27.3 degrees, and the 800–900 m band averages 21.4 — but the flank above and beside you measures 30 degrees on average to the east and 33 to the north from 907 m, with single steps of 44 to 58. That is what releases over you.",
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
      distanceLabel: "5.8 km",
      caption: "From 62 m at Eidebakken to 1030 at the top — 1008 metres of climbing over 5.5 kilometres, with a dip at Rørneshytta.",
    },
  },
  hamperokken: {
    intro:
      "A moderate ski tour with an expert's finish. 1390 metres of climbing from Fv91 up a broad north-west ridge that never exceeds 26 degrees — and then 1.7 kilometres of exposed ridge on foot from Middagsaksla, with crampons, an axe and a final step that locally measures over 45 degrees.",
    ascent: [
      "From the car park on Fv91 below Vartavarhaugen, 65 m, the route runs east over Vartavarhaugen at 159 m and crosses the Tverrelva. The birch gives up at around 390 m, and above 403 m the ground is open the rest of the way.",
      "From there the skin track follows the broad north-west ridge in one unbroken line. The terrain model gives a steady 16 to 26 degrees from about 350 m to Middagsaksla, with no steep steps: the bands between 500 and 1000 m all average 19 to 21 degrees. It is a long, even ski tour, and it is not much exposed to avalanches as long as you stay on the ridge. The flanks on either side are another matter, and they are terrain traps in poor visibility.",
      "At Middagsaksla, 1076 m, the ski tour stops. Many leave their skis here; some carry them to the forward cairn at about 1190 m and leave them there. Winter trip reports agree that the ridge beyond is walked — \"above about 1100 m the skis had to be swapped for crampons and an axe\".",
      "The last 1.7 kilometres are exposed north-west ridge. The crest undulates upward from 1076 to 1393 m with short drops on the way — 47 metres in all above Middagsaksla, and none of them more than ten at a time on the line. There are airy sections, short scrambling steps, and right at the end a gully and a steep summit pyramid: the steepest hundred-metre band on the whole tour lies between 1300 and 1400 m and averages 23.7 degrees, while the steepest sustained section is 33.3 degrees and the final step locally over 45.",
    ],
    descent: [
      "The ridge back on foot to Middagsaksla, and from there down the north-west ridge on skis to Vartavarhaugen and the car. The fall line down the ridge measures north-west, 293 degrees, and the angle is 16 to 26 degrees throughout — even, open skiing with no confined sections.",
      "The usual mistake: treating Middagsaksla as a rest rather than a decision. If the ridge is icy, or the visibility poor, this is where the tour ends — the skiing is over either way, and what lies ahead is 1.4 kilometres where a slip has no way out to the side. Turning round at Middagsaksla is not an aborted tour; it is a complete tour in its own right, and the right one when the ridge is icy.",
      "The second mistake is dropping off one of the flanks from the ridge to cut the descent short. Both sides of the north-west ridge are steep and collect snow; the ridge itself is the line, up and down.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The ski tour up the north-west ridge is not much exposed: a steady 16 to 26 degrees from about 350 m to Middagsaksla, with no steep steps. The flanks on either side of the ridge are steep, though, and they are terrain traps — in poor visibility holding the ridge is the navigation task. Above Middagsaksla it is no longer ski terrain: the steepest sustained section measures 33.3 degrees, the final step locally over 45, and the steepest hundred-metre band, 1300 to 1400 m, 23.7 degrees on average.",
      },
      {
        title: "The terrain off it",
        body: "The summit ridge is the real hazard on this tour, and it is not primarily an avalanche one: it is airy, partly corniced towards the north-east, and has icy scrambling steps that call for crampons, an axe and a judgement about whether a rope belongs in the pack. The northern variant from Stormo, up the valley between Gabrielfjellet and Middagsaksla, climbs a gully of around 40 degrees to a corniced ridge — that is a different tour from this one, and not the normal route.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Lyngen at varsom.no. Bring a transceiver, probe and shovel, and crampons and an axe if you are going beyond Middagsaksla.",
      },
    ],
    elevationProfile: {
      startLabel: "65 m",
      endLabel: "1397 m",
      distanceLabel: "5.6 km",
      caption: "1390 metres of climbing and 5.42 km from Fv91. The skiing ends at Middagsaksla, 1076 m; the last 1.7 km on foot give back 47 metres of height on the way.",
    },
  },
  kavringtinden: {
    intro:
      "Lyngseidet's home peak, and 1252 metres of climbing straight up from the fjord. Ridge on the way up, Østrenna on the way down — the big east-facing gully north of the summit gathers the best snow on the mountain and holds it well into May.",
    ascent: [
      "From the car park at Eidebakken, 62 m, follow the forest road up the east side of Gjerdelva. You pass Rødsteinen in the birch forest around 200 m and carry on up the ridge east of the river. The route never crosses Gjerdelva — if you are crossing water, you are off the line.",
      "The forest lets go at 301 m, and you pass Skihytta at 317. Between Rødsteinen and Skihytta there is a shallow dip to cross before the climbing picks up again, and the terrain only really opens out around 400. The forest roads from Karnes, Solhov, Marieslett and Jensbakk come up onto the same shelf, so which one you pick down in the village matters less than it looks. From here you set a course west toward the northeast ridge and gain the crest around 780 m.",
      "From there follow the ridge south, on or just east of the crest. Between 900 and 950 m the east side stands up past 30 degrees in places, and the steepest single step on the line measures 33.5. The west side is not an option: it drops 40 to 80 metres per hundred straight down toward Gjerdelva.",
      "The summit ridge narrows over the last hundred metres, and about ninety metres before the cairn a shallow notch takes back a couple of metres of height. This is where the cornices hang out east, over Østrenna: the crest falls 30 to 41 degrees on the east side and 21 to 31 on the west. Change sides in good time and walk the last stretch west of the cornice edge, up to the cairn at 1289.",
    ],
    descent: [
      "The large gully formation directly north of the summit is the descent. It is called Østrenna and it lies east of the crest. The top two hundred metres run 33 to 42 degrees, 37 on average, and the gully is wide enough to be almost a flank — it sits in the lee, fills with wind-blown snow while the summit ridge is being scoured, and usually holds the best snow on the mountain. At the bottom you angle north to get back on the ascent route.",
      "The common mistake: launching off the cornice straight from the summit, and late in the day. The big cornice above the gully releases in the spring sun most years, and when it goes, it goes into the gully you are standing in. The gully faces east and catches the sun before anything else up here, so ski it early — and enter through the shallow notch ninety metres north of the cairn. That is the natural way in, the same gully you meet just before the top.",
      "If you would rather stay out of the gully, ski the northeast ridge you came up. It is steepest between 900 and 800 m, 24.5 degrees on average, and is often wind-scoured; expect hard snow where the ridge is narrowest.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The northeast ridge is the gentlest of the documented line choices on the mountain, but it is not flat. The east side below the crest runs past 30 degrees in places between 900 and 950 m, the steepest hundred metres on the line itself lies between 800 and 900 m at 24.5 degrees on average, and the steepest step measures 33.5. The ridge is often wind-scoured the whole way up — that means hard snow on the crest and wind slab in the lee slopes right beside it.",
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
      startLabel: "62 m",
      endLabel: "1289 m",
      distanceLabel: "5.6 km",
      caption: "1252 metres from Eidebakken to the cairn; the steepest hundred lies between 800 and 900 m, at 24.5 degrees on average.",
    },
  },
  fagerfjellet: {
    intro:
      "947 metres of ascent over 4.30 km from the school at Fagernes to the summit at 957 — a popular, accessible KAST 1 tour with early snow, where no hundred-metre band measures more than 17.2 degrees and the steepest sustained stretch is 25.6, down in the forest. The hazard stands on one side: the cornices toward the northeast build out over walls measuring above 70 degrees in their steepest windows. Most people turn at the cairn at 871, the source says itself — the summit lies a rolling stretch further in.",
    ascent: [
      "From the parking on the west side of the school at Fagernes — 20.7 m on the flat, by the E8/fv. 91 in Ramfjorden. You round the school grounds, climb the farmland and enter the forest aiming for point 459. The band from 100 to 200 m is the tour's steepest, 17.2 degrees over 361 metres of ground, and the steepest sustained stretch is here: 25.6 degrees between 193 and 215 m. The forest ends at 519 m after 2.16 km, with open ground from 528.",
      "Above the treeline you swing east along the natural hollow: 16.4 degrees from 500 to 600 m and 16.3 from 600 to 700, then it flattens — 8.5 and 8.4 degrees over the bands from 700 to 900, the broad ridge the second sources describe. The cairn at 871 is where most people turn, and the view over Ramfjorden is already complete.",
      "If you continue, it is rolling ground toward 912 on the west side and up the last climb — 12.8 degrees in the band above 900 — to the summit at 957. Fri Flyt's published GPS point reads 956.1 on DTM1, and the summit search resolves 957.3 against a published 957.",
    ],
    descent: [
      "Down the same way. The west side measures gentle — 14.6 degrees mean over 500 metres with 17.8 as the steepest 60 m window — and the hollow and the forest give even skiing all the way to the farmland.",
      "Henrikskaret is the source's KAST 3 alternative from the mouth of Fagerelva, with 30–35 degrees between 660 and 740 m through dense forest into the col. It belongs to stable days — and it is not the line on this card.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 1 – Simple by Fri Flyt, steepest point under 27 degrees — and the line keeps it: 25.6 degrees at its steepest, in the forest. Above the treeline the ridge is broad and gentle. This is the tour for days when the bulletin says steep terrain is not the place to be.",
      },
      {
        title: "The cornices",
        body: "The source's hazard, and the measurement says how serious it is: the northeast and east sides fall 53.2 and 48.6 degrees mean, with 71.2 and 70.4 degrees as the steepest 60 m windows 60 to 140 metres out from the summit. The cornices build out over that edge. Keep your distance from the northeast edge all along the ridge — in flat light it is the one rule this tour has.",
      },
      {
        title: "Before you go",
        body: "Fagerfjellet lies in the Lyngen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The November–May season is Fri Flyt's, and early snow is part of the mountain's reputation. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "21 m",
      endLabel: "957 m",
      distanceLabel: "4.3 km",
      caption: "947 metres of ascent and 4.30 km from Fagernes via point 459 and the cairn at 871, with the treeline at 519 m and the steepest ground — 25.6 degrees between 193 and 215 m — down in the forest.",
    },
  },
  "hesten-segla": {
    intro:
      "Senja's shortest big day: 512 metres from Fjordgård up a broad southeast-facing flank, with Segla right in front of you from the summit ridge. Two to four hours car to car.",
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
      distanceLabel: "2.2 km",
      caption: "512 metres from Fjordgård; the flank averages 20 degrees where it is steepest, between 300 and 400 m.",
    },
  },
  keipen: {
    intro:
      "840 metres of climbing from Medfjordbotnvatnan, and a tour decided in its upper third: the bowl south of the summit is both a release and a runout zone, and the slope above it is steeper than the route itself. Friflyt grades the tour KAST 2 — challenging, with cornices on the summit ridge.",
    ascent: [
      "Start at the gravel car park at Medfjordbotnvatnan on Fv862, 102 m. Follow the Keipelva north through steadily rising ground to about 225 m. The forest gives up at 282 m, and above 297 you are in open terrain for the rest of the tour.",
      "Turn west-north-west and follow the mountainside up past 385 m. Around 470 m it levels into a stretch running almost a kilometre at 6 degrees — the only breather on the tour — before the ground rises into the large bowl south of the summit at about 595 m.",
      "From the bowl at about 595 m, do not take the fall line due north. Measured straight north the ground holds 29 to 36 degrees for the first 180 metres, and between 713 and 814 m it measures 38 to 52. The track instead rises east on a diagonal to about 670 m and back west-north-west onto the shoulder at 813 m; that is how the line stays under 30 degrees. The steepest hundred-metre band on the route lies between 800 and 900 m and averages 22.2 degrees; the steepest sustained section on the line is 28.1 degrees.",
      "From the shoulder, follow the ridge form south-west of the summit north to the cairn at 938 m. The top hundred metres are often wind-hammered and hard. Stay on the south side of the ridge — the north side falls 60 degrees straight below the crest, and that is where the cornices hang.",
    ],
    descent: [
      "Back the same way: south along the ridge, down onto the shoulder and out along the diagonal towards the bowl, then the mountainside to the Keipelva and the car park. The route itself measures 28.1 degrees at its steepest. Drop into the fall line due south from the shoulder instead and you are in the section measuring 38 to 52 degrees down to 713 m, with the bowl below collecting everything that releases.",
      "The usual mistake: drifting too far north on the ridge because the edge looks like it holds better snow. Due north of the summit the ground falls 60 degrees and then 52.5 — the cornices sit to the north, and they build all winter. The south side into the bowl is 32 degrees, and that is the side the route uses.",
      "Friflyt also mentions a slightly steeper variant down a small valley form from the ridge. It has not been measured here, and the south side has sections of 38 to 52 degrees — choosing it is a judgement of its own, not the same one as the normal route.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The bowl south of the summit is both a release zone and a runout zone, and you pass through it both ways. The line itself is gentler than the ground around it: the steepest sustained section measures 28.1 degrees and the steepest hundred-metre band, 800 to 900 m, 22.2 degrees. It is the eastward diagonal that produces those numbers. The fall line due north out of the bowl measures 38 to 52 degrees between 713 and 814 m, and it is above you the whole way up the slope.",
      },
      {
        title: "The terrain off it",
        body: "The north side of the summit falls 60 degrees straight below the crest and then 52.5, and the cornices hang to the north. The summit ridge is walked on its south side. The top hundred metres are often scoured and hard, which makes the cornice edge harder to read than it would be in soft snow.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sør-Troms at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "102 m",
      endLabel: "938 m",
      distanceLabel: "3.4 km",
      caption: "840 metres of climbing and 3.35 km from Medfjordbotnvatnan; the route climbs diagonally out of the bowl and holds 28.1 degrees where the fall line beside it measures over 40.",
    },
  },
  husfjellet: {
    intro:
      "640 metres of ascent over 3.29 km from the church at Skaland to Husfjellet, the mountain Fri Flyt calls «det fjellet i Norge som gir mest utsikt for minst innsats» — the mountain in Norway that gives the most view for the least effort. The tour starts at the shore at 3 m and stays gentle throughout: the steepest hundred-metre band measures 17.1 degrees between 100 and 200 m, and the steepest sustained stretch 19.6 — well inside Fri Flyt's «Bratteste punkt: Under 27 grader». The hazard is not in the route but in the final arête and the cornices.",
    ascent: [
      "From the church at Skaland, 3 m, on Fv. 862 — the main road to Senjahopen and Mefjord, ploughed year round. The line follows Dronningstien as the source says, and that path is mapped: the chain from the car park to the cairn is in OSM, and the corridor is pinned to it. The first hundred metres of height are the steepest the tour has — the band from 100 to 200 m measures 17.1 degrees over 335 metres of ground, and the steepest sustained stretch sits here: 19.6 degrees between 124 and 140 m, 0.63 km in. So the steep ground is in the forest, not on the mountain.",
      "The forest ends at 209 m by Kartverket's classes, with open ground from 221, and the treeline comes just 0.9 km in. Above it the ground eases: the band from 200 to 300 m measures 11.0 degrees and the band from 300 to 400 only 6.0 over 1,035 metres of ground. This is the cleared forest track and Sommerdalen, and here the tour is a walk.",
      "Sommerdalhaugen is the landmark the source gives, and it checks out: the sample point on the mapped chain reads 327.6 m against the «327 moh» Fri Flyt states. From here the ridge climbs steadily — 13.9 degrees from 400 to 500 m and 15.5 from 500 to 600 — toward the top.",
      "The cairn at 632 m. Fri Flyt gives «785 høydemeter», which is more than the whole mountain is high; the card carries the routed gain of 640. The final arête out to the summit is often wind-scoured, and then it needs good conditions — the source says so plainly, and the measurements say why: the north-east side falls 36.8 degrees on average with 71.4 degrees as its steepest 60 metres only 50 to 110 metres out, and the east side 35.8 degrees with 67.9 degrees 20 to 80 metres out.",
    ],
    descent: [
      "Back down the same track. Fri Flyt is unambiguous about the alternatives: «Ikke la deg friste å velge annen rute ned fra toppen. Utsatt terreng» — do not be tempted to pick another way down from the summit; exposed terrain. The measurements say what he means: from the cairn only south-west, south and west are gentle enough to call skiing, while north-east, east and north fall 36.8, 35.8 and 28.0 degrees on average with 71.4, 67.9 and 58.3 degrees as their steepest 60 metres.",
      "The source names a single variation: straight down to the south from the resting stone for some extra vertical in open forest, then skins back up to the ridge at Sommerdalhaugen. The south sweep from the cairn measures 20.2 degrees on average, so it is real — but he warns himself that it becomes «mye knot tett skog», a lot of fighting through dense forest, if you carry on down.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt grades the tour KAST 1 – Enkelt and «Bratteste punkt: Under 27 grader», and the finished line stays inside that: no hundred metres averages more than 17.1 degrees, and the steepest sustained stretch is 19.6 degrees between 124 and 140 m. His learning point is to lay a track under 25–30 degrees and to read the runout zones through Sommerdalen, and this terrain is made for exactly that exercise.",
      },
      {
        title: "The arête and the cornices",
        body: "The hazard Fri Flyt lists is «Skavler», cornices, and he is precise about where: overhanging cornices on the ridge to the north, and «Siste egga ut mot toppunktet er ofte avblåst og krever gode forhold da begge sidene her er bratte» — the last arête out to the summit is often wind-scoured and needs good conditions, because both sides are steep. The measurements confirm both sides — north-east 36.8 degrees on average with 71.4 degrees as its steepest 60 metres 50 to 110 metres out, east 35.8 with 67.9 degrees 20 to 80 metres out, and north 28.0 with 58.3 degrees 60 to 120 metres out. An arête with that on either side is not the place to be when it is scoured bare.",
      },
      {
        title: "The runout zones",
        body: "The source names them: runout zones up toward Litje Brusen and Store Brusen. The register carries Storbrusen as a mountain 1.7 km east of the cairn, and they are not on the route — but they are part of the same mountainside system, and Fri Flyt asks you to observe them on the way up through Sommerdalen.",
      },
      {
        title: "Before you go",
        body: "Husfjellet lies in the Sør-Troms forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. The season of February to May is Fri Flyt's own. Bring a transceiver, probe and shovel. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "3 m",
      endLabel: "632 m",
      distanceLabel: "3.3 km",
      caption: "640 metres of ascent over 3.29 km from Skaland, with the steepest ground — 19.6 degrees between 124 and 140 m — down in the forest, 0.63 km in.",
    },
  },
  breitinden: {
    intro:
      "Senja's highest peak, 1049 metres of climbing from the lay-by at the fjord. The ski tour ends at the shoulder at 763 m; the last 244 metres are exposed scrambling on the south-west ridge, and that finish is what makes this a grade 4.",
    ascent: [
      "Start at the lay-by in Svarthola on Fv862, 30 m, just under six kilometres east of Senjahopen. The first two hundred metres of climbing go straight up to the north end of Svartholvatnet at 207 m, and from there east over the ridge between that lake and Breitindvatnet — a stretch around 400 m where the line flattens before rising again. At Breitindvatnet the line follows the north shore, over 467 m and 500 m, rather than going straight across the ice. It did the latter until recently: 315 metres on the lake at 474 m, up to 40 metres from shore, beneath the very flank this guide calls a terrain trap. The lake is natural and unregulated, but no ski description sends you out onto it, and here the lake is narrow enough that land is 80 metres away.",
      "From the north-east side of Breitindvatnet at 481 m the west flank begins. Low down it is gentle — about 24 degrees to 550 m and 29 on to 620 — but above that it steepens: a median 36 degrees between 620 and 680 m, 41 between 680 and 720, and directly below the shoulder the fall line measures 50 to 59 degrees. The summer description calls this same ground narrow, exposed rock ledges, and the lake sits below the whole slope. The steepest hundred-metre band on the route lies between 600 and 700 m and averages 22.2 degrees; the steepest sustained section on the line is 39.4 degrees, and it is in the summit block.",
      "Skis are left at the shoulder south-west of the summit block, 763 m. From there to the top is 44.4 degrees over 249 metres, and the crest above 800 m measures 54 degrees in its steepest hundred-metre window and over 60 in the shortest steps. That is not a skin track. The last 244 metres are exposed scrambling on the south-west ridge with short committing sections — stay on the south-west side of the crest. The top you stand on is the south-east one, 1007 m; the SSR point named Breitinden lies 0.46 km north-west and is 24 metres lower.",
      "No published ski-route description exists for Breitinden — the sources describe the normal route in summer form. The approach valley is the same either way, and there is no other feasible way in from Fv862, but it does mean the line above the shoulder is the terrain model's and not a rendering of a written ski route.",
    ],
    descent: [
      "Going down you scramble the south-west ridge back to the shoulder, put the skis on and ride the west flank down to Breitindvatnet. The flank is the most serious part of the tour. The first hundred metres below the shoulder run 50 to 59 degrees, then 36 to 41 down to about 620 m, and only below that does it ease to 24 to 29. The lake is a terrain trap below the whole slope.",
      "The usual mistake: assuming the north side is a way down because it looks shorter from the top. The north and north-east sides fall 53 to 70 degrees straight below the crest, and that is where the cornices hang. From the lake follow the ascent back west over the ridge to Svartholvatnet and down to Fv862 — the bottom two hundred metres are the steepest skiing on the way home, 17 to 20 degrees on average.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The west flank up from Breitindvatnet runs 24 to 29 degrees low down, 36 to 41 above 620 m, and the fall line directly below the shoulder measures 50 to 59 — with the lake as a terrain trap below the whole slope — that is the avalanche terrain on this tour, and you pass through it both ways. The steepest hundred-metre band on the line, 600 to 700 m, averages 22.2 degrees. Above the shoulder the route becomes scrambling: the crest measures 54 degrees in its steepest hundred-metre window, and 763 m to the summit is 44.4 degrees over 249 metres.",
      },
      {
        title: "The terrain off it",
        body: "The north and north-east sides of the summit fall 53 to 70 degrees straight below the crest, so that is where the cornices sit. Stay on the south-west side of the ridge throughout. Note also that the sources describe this route in summer form: the line above the shoulder follows the terrain model, and everything above roughly 850 m should be treated as scrambling, not ski terrain.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sør-Troms at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "30 m",
      endLabel: "1007 m",
      distanceLabel: "4.2 km",
      caption: "1031 metres of climbing and 4.21 km from Svarthola; the skis stay at the shoulder at 763 m, 244 metres below the summit.",
    },
  },
  skolpan: {
    intro:
      "607 metres of ascent over 2.31 km from Fv. 862 in Krokelvdalen to Skolpan — the shortest tour in the collection's northern corner, and one of the gentlest. The steepest hundred-metre band measures 17.7 degrees and the steepest sustained stretch 27.1, just inside Fri Flyt's «Bratteste punkt: 27-30 grader». The hazard here is not the route but the slopes beside it.",
    ascent: [
      "From the parking along Fv. 862 in Krokelvdalen, 170 m. Fv. 862 is the main road on outer Senja and is ploughed year round; the register point for Krokelvdalen lies 494 metres away. Fri Flyt gives 580 metres of ascent, the routed line climbs 607 — 27 metres apart, and the card carries the routed figure.",
      "The first stretch goes through the scrub birch the source mentions: the band from 100 to 200 m measures 11.6 degrees and the band from 200 to 300 13.2. The forest ends at just 317 m by Kartverket's classes, with open ground from 331, and the treeline comes 0.63 km in — a quarter of the tour.",
      "Above the forest it climbs steadily: 17.7 degrees from 300 to 400 m and 12.3 from 400 to 500. At 465 m comes the shelf the source describes — «Fra 500 moh. flater det litt ut» — and here the line turns north-west onto the ridge, exactly as it says.",
      "On the ridge sits the steepest ground of the tour: 27.1 degrees between 693 and 714 m, 2.03 km in. Fri Flyt writes «Mellom 600–740 moh. er det partier som er 27–30 grader», and this is that section. Then only the stroll across to the highest point — 777 m on the climbed cell against a published 779.",
    ],
    descent: [
      "Back down the same track, «med mulige variasjoner etter ønsker og behov» — with variations as you please, as the source puts it. The steepest thing you ski is the same 27.1 degrees between 693 and 714 m, just below the ridge.",
      "From the cairn the north-west is by far the gentlest sector at 6.0 degrees on average — that is the ridge you came up. The west side measures 32.2 degrees on average, the north 27.5 with 65.2 degrees as its steepest 60 metres only 30 to 90 metres out, and the north-east 24.1 with 69.2 degrees 20 to 80 metres out. The difference between the ridge and the north side is seventy degrees inside a hundred metres.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt grades it KAST 1 – Enkelt with «Bratteste punkt: 27-30 grader»; the line measures 27.1 degrees as its steepest sustained stretch, between 693 and 714 m, and no hundred metres averages more than 17.7 degrees. The hazard he lists is «Noen små litt bratte», a few small steepish bits, which is a precise description of a line that is gentle on average with a couple of short pitches.",
      },
      {
        title: "The slopes to avoid",
        body: "The source's own warning is not about the route but about the ground beside it: «Det finnes noen små heng oppover som er 30–40 grader, så les terrenget godt slik at du unngår disse» — there are small slopes on the way up at 30 to 40 degrees, so read the terrain well and avoid them. That is why line choice is the whole exercise on this mountain — his stated challenge is to lay the track in terrain under 30 degrees, and the steeper slopes sit right beside the track that stays under.",
      },
      {
        title: "The summit",
        body: "The ridge from the north-west averages 6.0 degrees, and directly north of the cairn the ground falls 27.5 degrees on average with 65.2 degrees as its steepest 60 metres 30 to 90 metres out; the north-east measures 24.1 with 69.2 degrees 20 to 80 metres out. The summit is small and gentle, and the edges are close.",
      },
      {
        title: "Before you go",
        body: "Skolpan lies in the Sør-Troms forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. The season of February to May is Fri Flyt's own. No independent source describes the route; Peakbook corroborates the height only. Bring a transceiver, probe and shovel. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "170 m",
      endLabel: "777 m",
      distanceLabel: "2.3 km",
      caption: "607 metres of ascent over 2.31 km from Krokelvdalen, with the steepest ground — 27.1 degrees between 693 and 714 m — up on the ridge, 0.28 km before the top.",
    },
  },
  "tredje-svanfjell": {
    intro:
      "664 metres of ascent and 2.85 km straight from the lay-by in Kaperdalen — 'Tredje Svanfjell is a classic in Kaperdalen. A fine tour for newly converted ski tourers, and a splendid polar-night tour too', writes Fri Flyt, and the numbers agree: steepest 100-metre band 23.4 degrees between 500 and 600 metres, steepest sustained stretch 29.9, and the line gives back zero vertical metres. The name is not in the register — the Svanfjell peaks are numbered informally — but Fri Flyt publishes its own GPS position for the summit, and it reads 898 in the terrain model to the metre.",
    ascent: [
      "Park in the lay-by along the road through Kaperdalen — Fri Flyt writes 'Fv.232', but the road is today fv. 7862 Kaperdalsveien; the lay-by reads 236 metres, and the source's 660 vertical metres imply exactly this start. The forest ends early, and the ground opens eastwards.",
      "The first part climbs towards the little notch north of point 504, as the source says — the point reads 479 and the notch 582 in the terrain model. The hillside up to it carries the steepest 100-metre band of the tour, a mean 23.4 degrees between 500 and 600 metres.",
      "From the notch the ground rises steadily towards the foretop — gently broken, with the climbing under 30 degrees the whole way, and the measurement confirms it: 29.9 as the steepest sustained stretch. The foretop the source puts at 870 reads 862.9.",
      "From the foretop about 30–40 vertical metres remain, says the source — measured 36. It mentions a slight drop over the foretop; the line here traverses the shoulder at 862.9 and gives back nothing measurable — and the cairn at 899 has Senja's outer coast on one side and Ånderdalen on the other. In December this is the polar-night tour the source promises: short, open, and with a way home that cannot be misplaced.",
    ],
    descent: [
      "Down the same line as up, with room for variation as you wish, as the source says. The skiing faces west, home towards Kaperdalen — Fri Flyt's fact box says S-SE, but its normal route climbs from the west and descends the same way, and the card carries the measured.",
      "The room for variation has an edge: the south-east side falls 56.3 degrees at its steepest only 180–240 m from the cairn, and the east side 43.3 at the same distance. They do not belong to this tour — the west flank you came up is the skiing, and it is open and even all the way down to the lay-by. The source describes a steeper variant of its own: 'it is possible to lay lines more directly south into the bowl south-west of the summit … terrain that is 30–40 degrees … also note that there are some rock bands here'. The sweep agrees — south-west measures a mean 26.7 degrees with 37.0 as its steepest window — and the rock bands are the reason the source itself gives for leaving it alone.",
      "Zero vertical metres to give back and under three kilometres each way: this is the tour where the whole day is climbing and skiing, and that is why it is the classic for first-time ski tourers — and for December days with two hours of light.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt rates it KAST 1 – easy with 'no particular hazards', and the measurement agrees for the line itself: 29.9 degrees as the steepest sustained stretch, 23.4 as the steepest 100-metre band between 500 and 600 metres. That is as kind as a 660-metre tour gets — but KAST 1 is a line rating, not a free pass: the hillside up to the notch is steep enough to slide on in hard conditions.",
      },
      {
        title: "The edges",
        body: "The seriousness lies off the track: the south-east side falls 56.3 degrees at its steepest 180–240 m from the cairn and the east side 43.3 degrees at the same distance. They do not belong to this tour — in the polar night and in flat light the edges are what the compass is for: the west flank you came up is the only skiing side, and it is easy to find again — down towards the valley, not towards the sea.",
      },
      {
        title: "The polar-night tour",
        body: "The source calls it 'a splendid polar-night tour', and December–May is its own published season. The polar night is its own assessment: two hours of daylight leave little margin for error, and a mountain with no particular hazards in March can be a navigation mountain in December. A short tour with zero height given back is exactly what makes it right for the dark weeks — with a headlamp in the pack all the same.",
      },
      {
        title: "Before you go",
        body: "Tredje Svanfjell is in the Sør-Troms forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. The season December–May is Fri Flyt's own. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "236 m",
      endLabel: "899 m",
      distanceLabel: "2.8 km",
      caption: "664 metres of ascent and 2.85 km from Kaperdalen — the notch north of point 504, the foretop at 870, and zero vertical metres given back.",
    },
  },
  lonketind: {
    intro:
      "784 metres of ascent over 3.06 km from the water basin by Finnelva to Lonketinden, the highest mountain in its corner of southern Senja. The tour is short and steep rather than long: the steepest hundred-metre band measures 23.4 degrees between 500 and 600 m, and the steepest sustained stretch 30.0 — exactly what Fri Flyt gives as «Bratteste punkt: 30-35 grader (kort parti)», and exactly where the source says it lies.",
    ascent: [
      "From the road end at the water basin by Finnelva, 66 m. It is the highest road end in the valley, and it explains the source's figure: 848 minus 66 is 782, against the «785 høydemeter» Fri Flyt states. The register point for Finnelva lies 170 metres away.",
      "The first kilometre is the flat bog terrain the source describes: the band from 0 to 100 m measures 8.8 degrees and the band from 100 to 200 only 8.2 over 720 metres of ground. The forest ends at 330 m by Kartverket's classes, with open ground from 341, and the treeline comes 1.3 km in.",
      "Then the ridge toward Lonketuva begins. The register carries Lonketuva as a hill at 361 m, and that is the foot of the ridge. The band from 200 to 300 m measures 19.6 degrees and the band from 400 to 500 20.6 — the source calls this «småkupert med partier på 27–30 grader», rolling with sections of 27 to 30 degrees, and those sections are what the averages are made of.",
      "The summit ridge steepens by degrees, just as the source says, and the short steep pitch it promises is real: 30.0 degrees between 564 and 588 m, 2.14 km in. Fri Flyt writes «Rundt 550 moh. er det et kort parti som er 30–35 grader» — the measurement and the source point at the same twenty metres of height.",
      "Above it the ground flattens toward the cairn, as the source says: the band from 800 to 900 m measures 11.6 degrees, the gentlest above the treeline. 845 m on the climbed cell against a published 848.",
    ],
    descent: [
      "Back down the same track. The 30.0-degree pitch between 564 and 588 m is the steepest thing you ski, and it comes early in the descent — 0.9 km before you are back on the bog.",
      "Fri Flyt's only warning for the summit ridge is about cornices: «Vær obs på skavler på toppryggen.» From the cairn the north-west is the gentlest sector at 18.8 degrees on average, while the north-east measures 34.4, the south-west 33.9 and the south 30.2 — this is a summit that falls steeply in almost every direction, and the ridge is the one way that does not.",
      "From the foot of the ridge at Lonketuva it is the bog again, and the tour gives back only 5 metres of height along the way.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt grades the tour KAST 1 – Enkelt while also giving «Bratteste punkt: 30-35 grader (kort parti)» — and that pitch is real: 30.0 degrees between 564 and 588 m, 2.14 km in. The rest of the line is gentler; the steepest hundred-metre band is 23.4 degrees between 500 and 600 m. The source's learning point is to lay the track under 30 degrees and to recognise simple terrain traps, and the short pitch is where you have to do it.",
      },
      {
        title: "The summit ridge and the cornices",
        body: "«Vær obs på skavler på toppryggen» — watch for cornices on the summit ridge — is the source's own warning, and the measurements say what lies under them: the north side falls 23.7 degrees on average with 56.5 degrees as its steepest 60 metres only 40 to 100 metres from the cairn, the east side 31.5 with 54.1 degrees, and the south side 30.2 with 54.0. The gentlest sector is the north-west at 18.8 degrees — but the route does not go that way.",
      },
      {
        title: "Before you go",
        body: "Lonketinden lies in the Sør-Troms forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. The season of February to May is Fri Flyt's own, and he notes that the snow settles a little later on this part of the island. No independent source describes the route: Fri Flyt publishes it at two addresses, and both rest on Espen Nordahl's «Toppturer i Troms». Bring a transceiver, probe and shovel. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "66 m",
      endLabel: "845 m",
      distanceLabel: "3.1 km",
      caption: "784 metres of ascent over 3.06 km from Finnelva, with the steepest ground — 30.0 degrees between 564 and 588 m — exactly where the source says the short pitch lies.",
    },
  },
  istinden: {
    intro:
      "1432 metres of ascent over 5.24 km from Tindelva by Iselvmoen to Vestre Istinden, the highest of the Istindan tops and the landmark of Indre Troms. The tour is long and high rather than steep: the steepest hundred-metre band measures 21.6 degrees between 1400 and 1500 m, and the steepest sustained stretch 27.7 degrees — but the route runs along a ridge with what Fri Flyt calls «nordveggen», the north wall, on one side and the cirque holding the glacier on the other, and it is the edges rather than the averages that decide the day.",
    ascent: [
      "From the large car park where Tindelva comes down at Iselvmoen on the road toward Fjellstad, 80 m. Fjellstadveien is mapped as a public sealed road, so the start is ploughed year round. The line takes the south side of the river, as both sources say, and follows the mapped path up the steep birch hillside — the same path ut.no calls «tydelig og bra, men bratt», clear and good but steep, signposted with a green marker from the car park. The bands measure 18.2 degrees from 100 to 200 m, 21.0 from 200 to 300 and 19.2 from 300 to 400.",
      "The forest ends at 558 m by Kartverket's classes, with open ground from 568, and the treeline comes 1.81 km in. Here the ground eases: the band from 500 to 600 m measures 13.9 degrees and the band from 700 to 800 only 8.4 over 650 metres of ground. This is the rest ut.no describes at the shoulder, and it is the place to look around — the north wall stands directly ahead from here.",
      "From 2.93 km and 788 m the line runs into the cirque below the wall for a few hundred metres, as Fri Flyt says, before taking to the ridge. The ridge runs up the west side of the wall, and it also runs west of the glacier in the cirque. That is not a detail: both Fri Flyt («ryggen som går opp på vestsiden av veggen») and ut.no («til høyre for bekken og breen» — to the right of the stream and the glacier) send you around the ice, and the glacier polygon lies between 898 and 1155 m directly east of the line. The closest approach is 14 metres from its edge, at 4.27 km and 1152 m. The line has 0 metres on the glacier, checked against both Kartverket's terrain class and OSM's glacier polygon.",
      "Above 1200 m the ridge rises steadily — 17.5 degrees from 1200 to 1300, 21.2 from 1300 to 1400 and 21.6 from 1400 to 1500, the steepest band of the tour. The steepest sustained stretch sits in the same height range: 27.7 degrees between 1286 and 1304 m, 4.73 km in, a little under half a kilometre before the cairn.",
      "Fri Flyt warns: «Hold god avstand fra hengeskavlene ut over Nordveggen», keep well clear of the cornices out over the north wall, and the measurements say why — the north sweep from the cairn holds 34.8 degrees on average and 60.9 as its steepest 60 metres only 50 to 110 metres out. The cairn at 1489 m, which the register carries as Vestre Istinden. The last stretch is often wind-scoured, and then the skis may have to be carried — that is the source's own phrasing, and it is the commonest reason the day takes longer than the figures suggest.",
    ],
    descent: [
      "Back down the same ridge. Note the bearing: for the first hundred metres from the cairn the line runs west, 262 to 276 degrees, before swinging north-west down the ridge — over the whole drop to the treeline it points 344 degrees. In cloud it is that first westward stretch that has to be right, because the north side of the crest is the north wall.",
      "From the cairn to the treeline is 931 metres of vertical, against the «omtrent 900 meter» Fri Flyt gives down to the forest. Then the birch hillside again, the one you came up, and 23 metres is all the tour gives back along the way.",
      "Fri Flyt's usual descent is a different line from this one: the couloir at 30–35 degrees running south-west from the summit. The south-west sweep from the cairn measures 30.6 degrees on average over 800 metres, which agrees with the source, but its steepest 60 metres hold 40.0 degrees 60 to 120 metres out. That couloir is not measured as a route of its own here, and the card's aspect describes the route's own descent. Nor is the summit-ridge traverse from Søre Istinden this route — it is only for that one that Fri Flyt mentions an ice axe and crampons.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt's own hazard note is precise about which ground is which: «Skredfare må vurderes nøye på nedkjøringene i botnen mellom Søndre og Vestre Istind og ned fra Søndre Istind. Ryggen opp normalveien er relativt skredsikker. Hold god avstand fra hengeskavlene ut over Nordveggen.» Avalanche danger must be weighed carefully on the descents in the cirque and off the southern top; the ridge up the normal route is relatively secure from avalanches; keep well clear of the cornices over the north wall. This route is that ridge — but «relatively» is the source's word, not a guarantee, and the cirque it warns about lies 14 metres from the line at the closest.",
      },
      {
        title: "The north wall and the cornices",
        body: "The north sweep from the cairn holds 34.8 degrees on average over the first 800 metres, with 60.9 degrees as its steepest 60 metres only 50 to 110 metres out; the north-east measures 30.5 on average and the north-west 28.0 with 65.1 degrees 190 to 250 metres out. The cornices build out over this edge, and they are what Fri Flyt tells you to keep well clear of. The ridge is broad enough to walk, but the edge is not where the eye puts it in flat light.",
      },
      {
        title: "The glacier in the cirque",
        body: "The cirque between Vestre and Søre Istinden holds a glacier — Kartverket classes it as SnøIsbre, OSM carries the polygon way/375260442 between 898 and 1155 m, and ut.no names it in the route description. The line goes around it, to the west, with 14 metres as its closest approach. It is not drawn to cross ice and should not be used as though it were: skiing down in the cirque is the one place Fri Flyt names as avalanche ground.",
      },
      {
        title: "Before you go",
        body: "Vestre Istinden lies in the Indre Troms forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes a ski season for this tour: ut.no's July to September belongs to the hike, and Fri Flyt has no season field at all. The card's feb–mai is therefore editorial. The card's 5–7 t is the pipeline's own estimate; Fri Flyt gives 6–7 hours. Bring a transceiver, probe and shovel. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "80 m",
      endLabel: "1489 m",
      distanceLabel: "5.2 km",
      caption: "1432 metres of ascent over 5.24 km from Tindelva, with the steepest ground — 27.7 degrees between 1286 and 1304 m — on the ridge a little under half a kilometre before the cairn.",
    },
  },
  snotinden: {
    intro:
      "1242 metres of ascent over 6.76 km from Ånstad to the great classic of Andørja — the island Fri Flyt calls packed with summits. The source rates it KAST 3 – Complex with ice axe and crampons on the gear list and five named descents, several holding 45 degrees; Vestsiden, the line on this card, is the mildest of them, and the climb itself measures 22.7 degrees in its steepest hundred-metre band and 28.1 in its steepest sustained stretch. The card carries grade 4: the mountain around the line is why.",
    ascent: [
      "From the sports ground by the school at Ånstad — 9 m on farmland by the county road. You follow the road toward Kvantobotn (91 m where the line branches off), cross Kvantoelva and climb the forest east of Snøfjellelva: the bands from 100 to 400 m measure 7 degrees over road and moor, then it steepens — 20.9 degrees from 400 to 500 and the tour's steepest band, 22.7 degrees over 253 metres of ground, from 500 to 600, with the steepest sustained stretch at 28.1 between 630 and 648 m. The forest ends at 402 m after 4.27 km.",
      "Above the forest the line passes south and southeast of Snøfjellvatnet — on land the whole way; the first solve crossed 90 metres of the lake, and the reroute is in the research record — and takes the west flank from there: 15–18 degrees in the bands from 700 to 1000.",
      "The last three hundred vertical metres hold 18–20 degrees up to the cairn at 1215. The register resolves 1214.8, and around you stand the peaks of the Andørja traverse — Stortinden, Botntinden, Langlitinden — with the fjord on every side.",
    ],
    descent: [
      "Vestsiden down is your own track — 20 to 35 degrees toward Snøfjellvatnet by the source, and the southwest sector measures 15.8 degrees mean, the gentlest on the summit. Lower down wait 30–40 degrees with 45-degree sections where the line from the lake drops toward the forest.",
      "The four other named descents — Bananene and Skreddalen, Sydsiden, Nordøstrenna (45–50 degrees), Østbratta — hang in edges measuring 31 to 41 degrees mean with windows of 54 to 63 directly below the cairn. They are documented expert lines with documented avalanche history, and they are chosen after the stability, not before it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 3 – Complex by Fri Flyt, ice axe and crampons on the gear list — and grade 4 on the card even though Vestsiden measures 28.1 at its steepest: the descent passes terrain of 30–40 degrees with 45-degree sections, and everything around the line is steeper than the line.",
      },
      {
        title: "The avalanche history",
        body: "The source documents avalanche history on the south-facing slopes and west of point 1018 — on the normal route's own side of the mountain. The icing near the treeline comes on top. This is a tour where the bulletin is read before the car starts.",
      },
      {
        title: "Snøfjellvatnet",
        body: "The line keeps to land south of the lake. A natural lake and winter ice are ordinary travel, but with 1215 metres of mountain above you, the shore is the only place to stand if something releases higher up.",
      },
      {
        title: "Before you go",
        body: "Snøtinden lies in the Sør-Troms forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The February–April season is Fri Flyt's. Transceiver, probe, shovel — and the ice axe and crampons the source itself requires.",
      },
    ],
    elevationProfile: {
      startLabel: "9 m",
      endLabel: "1215 m",
      distanceLabel: "6.8 km",
      caption: "1242 metres of ascent and 6.76 km from Ånstad east of Snøfjellelva and south of Snøfjellvatnet, with the treeline at 402 m and the steepest ground — 28.1 degrees between 630 and 648 m — in the forest slope.",
    },
  },
  "storhornet-kvafjord": {
    intro:
      "658 metres of ascent over 8.22 km from Kvæfjordeidet — the sun tour of the round, along what the source calls Harstad's ever-best-groomed trail up to Koven and a gentle, south-facing ridge beyond. No hundred-metre band measures more than 9.5 degrees, the steepest sustained stretch is 25.8, and the summit has no steep side: all eight sectors measure 6 to 18 degrees mean. The steep ground on this tour exists — the flanks along Vikelandselva — and the trail does not go in it.",
    ascent: [
      "From the big car park at the start of the Kvæfjord trails, west of Bjørklund — 175 m. The trail, groomed by the enthusiasts of Kvæfjordløyper, takes you in: the bands from 200 to 400 m measure 2 to 6 degrees over kilometres, and the forest ends at 417 m after 6.11 km — most of this tour is trail touring.",
      "Koven is passed at 415 m — ut.no describes the same trail from Kvæfjordeidet — and the ridge on toward Storhornet is the tour's only climb to speak of: 9.5 degrees in the band from 500 to 600, with the steepest sustained stretch at 25.8 between 476 and 494 m where the ridge gets going.",
      "The cairn at 722 — the register resolves 722.2 — with Kvæfjorden and Gullesfjorden below you and the orange and Kvikk Lunsj the source prescribes at Koven. The ridge gives back 111 metres along the way, so the trip home has its own small climbs.",
    ],
    descent: [
      "Down the ridge and the trail again — south-facing and sunny, and with 26.8 degrees as the steepest 60 m window anywhere on the summit this is skiing for all conditions and most legs.",
      "The source's one rule: do not climb into the steep flanks along Vikelandselva — avalanche terrain, and the trail stays out of it. Follow it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Easy by Fri Flyt, and the measurement agrees: 9.5 degrees in the steepest band, 25.8 in the steepest stretch, and no steep side on the summit. This is the tour for days when the bulletin says steep terrain is not the place to be — and the practice tour for every other day.",
      },
      {
        title: "Vikelandselva",
        body: "The source's named hazard: the steep flanks along the river are avalanche terrain. The trail does not go in them, and neither does your track need to — shortcuts here save minutes and stake the rest.",
      },
      {
        title: "Before you go",
        body: "Storhornet lies in the Sør-Troms forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The November–April season is Fri Flyt's, with the early trail start part of the mountain's reputation. Transceiver, probe and shovel — on a trail tour too.",
      },
    ],
    elevationProfile: {
      startLabel: "175 m",
      endLabel: "722 m",
      distanceLabel: "8.2 km",
      caption: "658 metres of ascent and 8.22 km from Kvæfjordeidet along the trail to Koven and the ridge to the cairn, with the treeline at 417 m and the steepest ground — 25.8 degrees between 476 and 494 m — where the ridge begins.",
    },
  },
  "stortinden-rolla": {
    intro:
      "984 metres of ascent over 7.26 km from Indre Forså to Rolla's highest — Fri Flyt rates it KAST 3 – Complex with ice axe and crampons, an often-corniced summit, and a couloir of an even 30–40 degrees as the normal way. The line measures 21.4 degrees in its steepest hundred-metre band and 27.8 in its steepest sustained stretch, directly below the top. The source's stated gain, 1021, is the summit height duplicated into the gain field — the card carries the line's own 980. Mevatnet is regulated, and the line rounds it on land.",
    ascent: [
      "From Indre Forså on the fv. 848 on Rolla's west side — 85 m, with limited parking requiring the landowner's consent according to the source; ask first, it is part of the tour. The moors inland are flat: the bands from 100 to 400 m measure 2 to 5 degrees, and the forest ends only at 485 m after 5.67 km — a long, quiet approach.",
      "The line passes the south end of Mevatnet in the forest on the east side and then follows the east shore on land — the lake is regulated, and the two reroutes it took are in the research record. From 500 it steepens: 14.8, 20.3 and 21.4 degrees in the bands up toward the couloir.",
      "The couloir south of the summit is the key: an even 30–40 degrees by the source, and the line's steepest sustained stretch measures 27.8 degrees between 967 and 991 m where it slants in. The top is often corniced — the cairn at 1020 with Andørja to the north and the sea to the west. The register resolves 1020.0.",
    ],
    descent: [
      "Down the couloir again when the snow is stable — steep, fine skiing in ground of an even 30 to 40 degrees, says the source, then the long gentle moors home. The southeast and northwest sectors measure 24 degrees mean; the couloir to the west is 39.9.",
      "Drangen on the east side is without doubt the steepest descent, says the source: the start is over 50 degrees — measured 46.6 mean with 62.6 as the steepest window — and the day for it is chosen with care. From this line it is another tour.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 3 – Complex by Fri Flyt, ice axe and crampons, and a 30–40 degree couloir as the normal way — grade 4 on the card even though the line's slanting track measures 27.8: the couloir demands stable snow, and there is no gentle way up the last part.",
      },
      {
        title: "The cornice",
        body: "The summit is often corniced, says the source. The lip hangs east — toward the Drangen side, where the first window measures 62.6 degrees. Visit the cairn from the west, and in flat light with a wide margin.",
      },
      {
        title: "Mevatnet",
        body: "A regulated lake — the line keeps the east shore on land, and so should your track. Regulated ice cracks along the shore as the reservoir draws down, and the moors give dry land the whole way.",
      },
      {
        title: "Before you go",
        body: "Stortinden lies in the Sør-Troms forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The February–April season is Fri Flyt's. Transceiver, probe, shovel — and ice axe and crampons.",
      },
    ],
    elevationProfile: {
      startLabel: "85 m",
      endLabel: "1020 m",
      distanceLabel: "7.3 km",
      caption: "984 metres of ascent and 7.26 km from Indre Forså across the moors and along Mevatnet's east side, with the treeline at 485 m and the steepest ground — 27.8 degrees between 967 and 991 m — in the couloir south of the summit.",
    },
  },
  spanstinden: {
    intro:
      "1047 metres of ascent over 5.24 km from Bukkemyrvatnet on Gratangsfjellet — a classic so popular that on sunny days you can almost count on company, says ut.no. Fri Flyt rates it KAST 1 – Easy, and the line keeps it: steepest hundred-metre band 18.8 degrees and steepest sustained stretch 25.0. The summit and the last metres to it are very spectacular, says the source — and the measurement explains why: everything except the snowfield you arrive by is 42 to 47 degrees mean.",
    ascent: [
      "From the parking at Bukkemyrvatnet on the E6, the highest point of Gratangsfjellet — 424 m, with Lapphaugen tourist station as the source's alternative start further north. The line crosses 90 metres of Bukkemyrvatnet, never more than 25 metres from shore: a natural lake at 418 m the source's own route walks across — ordinary winter travel, said here because it is a lake you are standing on. The forest ends already at 476 m after 1.03 km.",
      "North toward the steep, rocky Sølvfjellet it goes in knolls and terraces: 10.2 degrees from 500 to 600 m, 14.3 and 16.4 in the next bands — follow old tracks where they exist, says the source, for the terraces hide the line in flat light. Between Sølvfjellet and Spanstinden — 851 m where the line passes — the big snowfield southeast of the summit opens.",
      "Take the snowfield with the gentlest gradient to the right (east), as the source says: the band from 1300 to 1400 measures 18.8 degrees, the tour's steepest, and the steepest sustained stretch is 25.0 degrees down between 947 and 968. Then the spectacular last metres: the cairn at 1457 — the register resolves 1457.4 — with the drops on every other side as the backdrop.",
    ],
    descent: [
      "Down the snowfield again — the southeast sector measures 14.1 degrees mean over 500 metres with 28.9 in the first window, big readable skiing back toward the terraces. The source describes four descent variants from easy terraced skiing to moderately demanding via the Tjuvhola basin toward Moen.",
      "Keep the snowfield until you are off the summit: north, northeast and southwest fall 44.1, 47.5 and 42.0 degrees mean, with a 71.4-degree window on the northeast side. The spectacular and the dangerous are the same edge here.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 1 – Easy by Fri Flyt, and the line measures accordingly: 18.8 degrees in the steepest band, 25.0 in the steepest stretch. The avalanche terrain sits in the steeper ground beside the line above the treeline — take care where the flats roll over into steep slopes, says the source.",
      },
      {
        title: "The summit edge",
        body: "Everything except the snowfield is steep: 42 to 47 degrees mean to the north, northeast and southwest. The last metres are spectacular because the edges are close — in flat light the track keeps to the middle of the snowfield, and the cairn is visited with respect for what is under the snow at the rim.",
      },
      {
        title: "Bukkemyrvatnet",
        body: "The line crosses 90 metres of the lake, never more than 25 metres from shore. Natural lake, winter ice, ordinary travel — but a lake is a lake, especially early and late in the season.",
      },
      {
        title: "Before you go",
        body: "Spanstinden lies in the Sør-Troms forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no; the mountain sits in the source's Narvik chapter, but the bulletin it answers to is Sør-Troms. The February–June season is Fri Flyt's. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "424 m",
      endLabel: "1457 m",
      distanceLabel: "5.2 km",
      caption: "1047 metres of ascent and 5.24 km from Bukkemyrvatnet via the terraces toward Sølvfjellet and the snowfield southeast of the summit, with the treeline at 476 m and the steepest band — 18.8 degrees — between 1300 and 1400 m.",
    },
  },
  reinspalen: {
    intro:
      "1404 metres of ascent over 8.44 km for a 1118 summit — Reinspælen is Kvæfjord's highest, and the ridges there collect 292 metres given back along the way: plenty of up and down, as both the source and the trip reports say. KAST 3 – Complex with ice axe and crampons; the line measures 21.0 degrees in its steepest hundred-metre band, and the steepest sustained stretch — 41.7 degrees between 1073 and 1104 m — sits in the transition to the exposed summit ridge, where the reports describe scrambling.",
    ascent: [
      "From Våtvoll on the fv. 85 along Gullesfjorden — 5 m, parking in the pockets along the road as the source says. Up Kobberyggen: the band from 0 to 100 measures 8.9 degrees and the forest ends at 378 m after 2.31 km, before the ridge gives back its first notch — 86 metres down to 335 before Geitryggen takes over.",
      "Geitryggen is the tour's spine: 20.5 degrees in the band from 500 to 600, flat above 600, then even climbing — 21.0 degrees from 800 to 900, the tour's steepest band — toward the summit ridge. The undulation is why the card carries 1400 vertical metres for an 1118 summit.",
      "The summit ridge is the serious part: an exposed traverse with cornices and avalanche terrain toward Litjedalen, and the line's steepest stretch — 41.7 degrees between 1073 and 1104 m — where the ridge rears toward the cairn. The axe and crampons are for these metres; the trip reports call it scrambling. The register resolves 1117.4 against a published 1118.",
    ],
    descent: [
      "Down the same way — the ridges back with the climbs in reverse; the south sector from the summit measures 18.9 degrees mean, but with a 60 m window of 60.5 degrees only 20 to 80 metres out: the traverse has walls on both sides, and the track down is the track up.",
      "The west gullies (30–50 degrees) are terrain traps in instability, says the source, and Norddalen on the northeast route needs its own stability assessment. Neither is this line.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 3 – Complex by Fri Flyt. The ridges are kind — 21 degrees in the steepest band — and all the seriousness is gathered in the summit ridge: 41.7 degrees in the transition, cornices, and walls on both sides of the traverse. Grade 4 on the card.",
      },
      {
        title: "The summit ridge",
        body: "The cornices and the avalanche terrain toward Litjedalen are the source's own words. The sides measure 60.5 (S) and 64.1 (SE) degrees in the first windows from the cairn — the traverse is walked with the axe in hand and a wide margin to the edge, and in flat light it waits for better visibility.",
      },
      {
        title: "The up-and-down ledger",
        body: "292 metres are given back on the ridges — 292 metres to be climbed again on the way home. Count the hours accordingly: the source gives 6–7, and they are honest.",
      },
      {
        title: "Before you go",
        body: "Reinspælen lies in the Lofoten og Vesterålen forecast region, an A-region with a daily bulletin — the Kvæfjord mountains answer to that forecast, not Sør-Troms. Check varsom.no. The January–April season is Fri Flyt's. Transceiver, probe, shovel — and ice axe and crampons.",
      },
    ],
    elevationProfile: {
      startLabel: "5 m",
      endLabel: "1117 m",
      distanceLabel: "8.4 km",
      caption: "1404 metres of ascent and 8.44 km from Våtvoll over Kobberyggen and Geitryggen, with the treeline at 378 m and the steepest ground — 41.7 degrees between 1073 and 1104 m — in the transition to the summit ridge.",
    },
  },
  snotindan: {
    intro:
      "1548 metres of ascent over 9.04 km for a 996 summit — Snøtindan is the tour where the col costs more than the top: 565 metres are given back along the way, over Løbergskaret and the tarn shelves, and the line keeps to land past all the lakes where the source crosses on ice. KAST 3 – Complex with ice axe and crampons, 8–9 hours by the source, and a 30–40 degree summit slope at the end. The register writes Snytindan; ut.no writes Stor Snytindan; the card follows Fri Flyt.",
    ascent: [
      "From the parking along the fv. 85 at Løbergsbukta — 13 m where the road rounds the bay. Løbergsdalen has runout zones on both sides, and the source's rule is precise: walk the middle of the valley. The bands from 100 to 400 measure 20 to 22 degrees — the tour's steepest hundred-metre band, 22.1, is here — and the forest ends already at 287 m after 1.3 km.",
      "The line passes south of the upper tarn in the valley and crosses Løbergskaret at 746 — then the height is given back: down past the tarn at 573 (on land, south of it; the reroutes are in the research record) to the shelves at the 560 level. The bands here measure 2 to 4 degrees over kilometres of flat — it is long, and that is the point of the 8–9 hour estimate.",
      "From the shelves the summit flank takes over: 13.9 and 18.1 degrees in the bands from 800, and the steepest sustained stretch — 33.8 degrees between 947 and 974 m — in the summit slope the source gives 30–40 degrees with a possible cornice. The cairn at 996 stands on the triple point where Kvæfjord, Lødingen and Sortland meet; the register resolves 996.2.",
    ],
    descent: [
      "Down the same way — the summit slope first, while you know what the snow did on the way up, then the shelves and the climb back over Løbergskaret: 185 of the 565 given-back metres must be climbed again on the way home. The north sector from the summit measures 13.6 degrees mean — the way the line came.",
      "The south and east sides are another story: 39.1 and 38.6 degrees mean with windows of 59.7 and 52.8. And in the valley the same rule holds down as up: the middle, between the runout zones.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 3 – Complex by Fri Flyt, ice axe and crampons. The line is long before it is steep: everything over 30 degrees is gathered in the summit slope (33.8 measured, 30–40 by the source, possible cornice) — and Løbergsdalen with runout zones on both sides is the entry ticket both ways. Grade 4.",
      },
      {
        title: "The valley",
        body: "Walk the middle of the valley — the source's own words, and the terrain explains them: the sides are runout zones, and the middle is the margin. On days with poor stability the valley is closed, and then so is the tour.",
      },
      {
        title: "The lakes",
        body: "The line keeps to land past all three lakes — the valley tarn, the tarn at 573 and the shelf lakes — where the source crosses on ice. It costs vertical metres (the card carries 1550 against the source's 1250–1350), and that is why the number is bigger than the mountain.",
      },
      {
        title: "Before you go",
        body: "Snøtindan lies in the Lofoten og Vesterålen forecast region, an A-region with a daily bulletin — the triple-point mountain answers to that forecast. Check varsom.no. The January–April season is Fri Flyt's. Transceiver, probe, shovel — and ice axe and crampons.",
      },
    ],
    elevationProfile: {
      startLabel: "13 m",
      endLabel: "996 m",
      distanceLabel: "9.0 km",
      caption: "1548 metres of ascent and 9.04 km from Løbergsbukta up the middle of Løbergsdalen, over Løbergskaret and past the lakes on land, with the treeline at 287 m and the steepest ground — 33.8 degrees between 947 and 974 m — in the summit slope.",
    },
  },
  moysalen: {
    intro:
      "From 23 m to 1264, and 1596 metres of climbing to get there — 355 of them given back along the way, and 120 in one stretch down to Grønnvatnet. Vesterålen's highest is one of the few tours in this app that starts at the sea and ends on a ridge where people take their skis off. Friflyt rates it KAST 3, 11 to 18 hours, and calls for an ice axe and crampons.",
    ascent: [
      "From the large car park on the E10 on the south side of Litlvatnet, 23 m, the route runs north up the drainage. The E10 is a year-round trunk road, and this is the start Friflyt uses — the guided summer ascents from Møysalen Nasjonalparksenter begin with a boat from Hennes into Lonkanfjorden, but that is a different tour. The first two kilometres are flat: the 100 to 200 m band averages 2.9 degrees over 2165 metres of ground. The forest lets go late for Vesterålen: the last vertex with terrain class Skog is at 234 m, 2900 metres in, and the next vertex, 240 m, is bog. The birch down the valley is interleaved with the bog, so you pass in and out of it the whole way up — 55 of the route's 333 points are forest, from 12 to 234 m.",
      "At 154 m the line runs 90 metres across Forkledalsvatnan, at most 14 metres from shore, and at 391 m it runs 247 metres across Rundvatnet, at most 71 metres out. Both are natural — DTM1 gives terrain class Innsjø and the OSM polygons carry no reservoir tags. At 328 m comes the third: 225 metres across Grønnvatnet, up to 86 metres from shore. It is the largest of the three, and it is also the water the route description names.",
      "Reaching Grønnvatnet costs you 120 metres of height. The line crosses height 450 — 450.7 m measured — and then falls from 448 to 328 over 736 metres of ground, the largest continuous drop on the way up. This is not an error in the line, it is the tour: the net gain from sea to summit is 1241 metres, but what you actually climb is 1596, and the difference is this rise and the ridges after it.",
      "From Grønnvatnet the route climbs steadily, and the reference point here is that same height 450 you just crossed: Friflyt tells you to keep it on your right, that is to the east. It is one rise and not two — an eight-direction sweep from the point shows the ground falling north, north-east and north-west, down toward the lake, and rising south and south-east to 513 and 516 m. It is a broad shoulder, not a pass. On up the stream bed is the long working stretch: the 800 to 900 m band averages 21.0 degrees over 253 metres of ground and the 900 to 1000 m band 21.0 over 242, and the steepest 400-metre window of the whole tour is here, 22.0 degrees from 774 to 939 m.",
      "The ice sits lower than you might expect. The line crosses ground classed SnøIsbre from 752 to 898 m, continuously, over 405 metres of ground between 7700 and 8100 metres in, without a single bare point in between. The bearing from the summit to that stretch is 184 to 216 degrees — south to south-west — and the distance 422 to 582 metres. The corridor research called the waypoint «the glacier south-east of Møysalen, ~1025 m»; at that point DTM1 returns 1026.59 m with terrain class ÅpentOmråde, and ring probes 300, 500, 700 and 900 metres out from the summit find SnøIsbre only to the east and to the south-west. South-east is bare ground throughout. Friflyt writes that «selv om det kalles bre er det ikke åpne sprekker», and that it is normally travelled unroped. The steepest 30-metre step upward, 41.9 degrees from 1036 to 1063 m, sits 8500 metres in — above the ice, then, not below it.",
      "Above the ice the route continues north-west up the summit ridge, and the ridge is not even. 9332 metres in, the line rises to 1170 m and then falls 51 metres to 1119 over 27.3 metres of ground — a notch, not a measurement artefact: twelve DTM1 points at 2.3-metre spacing through the drop give a continuous curve from 1170.0 to 1119.2, and a grid 40 metres to either side reads from 1186 to 1055 m, so the neighbouring lines are no gentler. This is why the largest step along the route measures 45.9 degrees, and it is where the axe and crampons belong. The last 500 metres run on a bearing of 333 degrees and rise 124 metres; the steepest 200-metre window of the tour, 24.3 degrees from 1189 to 1264 m, is the summit ridge itself.",
    ],
    descent: [
      "Back the same way. The drop-weighted mean bearing is 193 degrees — south — and that agrees with the source: Friflyt calls the Vestryggen route itself «sørvendt bratt terreng», and describes every other line on the mountain as south-facing too. The card said south-east for a long while; that value rested on a waypoint called a glacier which is not one, and it has been corrected. Over the notch in the ridge most parties walk.",
      "The usual mistake is counting the tour in metres of vertical rather than in hours. 1596 metres and 9.75 kilometres each way, with a steep section under the glacier and a ridge that is often scoured and hard, is 11 to 18 hours by Friflyt's reckoning. Turn around at the glacier and you still have 120 metres to climb out of Grønnvatnet on the way home. The second mistake is assuming a south-facing 21-degree pitch holds its condition through the day: the hour decides whether you meet soaked snow or frozen snow there.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Two sections carry the risk. The climb from Grønnvatnet to the glacier averages 21.0 degrees across both bands between 800 and 1000 m and has steeper steps within it — 41.9 degrees over its steepest 30-metre window, 8500 metres in. The summit ridge is the other: 24.3 degrees over 200 metres, with a notch where the line falls 51 metres over 27.3 metres of ground. Friflyt rates the tour KAST 3 and requires ice axe and crampons; the glacier is described as crevasse-free and is normally travelled unroped.",
      },
      {
        title: "The terrain around it",
        body: "Møysalen has no gentle sides. A sweep 1000 metres out in all eight directions from the summit gives 24.5 degrees as the gentlest average — that is south — and 40.2 degrees as the steepest, to the east. The steepest 60-metre windows read 55.9 degrees west and 70.8 degrees east, the latter only 10 metres from the top. Step off the ridge and no direction catches you kindly. That is why the route stays on the ridge the whole way rather than looking for a shortcut down.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Lofoten og Vesterålen at varsom.no. Bring a transceiver, probe and shovel, and an ice axe and crampons besides — on this tour they are not optional.",
      },
    ],
    elevationProfile: {
      startLabel: "23 m",
      endLabel: "1264 m",
      distanceLabel: "9.7 km",
      caption: "1596 metres of climbing from the E10 at Litlvatnet to 1264 m, 355 of them given back along the way and a 51-metre notch in the summit ridge.",
    },
  },
  strandtinden: {
    intro:
      "1156 metres of climbing and 5.86 km from the E10 at sea level to the summit at 1076 m — the great classic of the Harstad area, and a mountain with no gentle side. The steepest hundred-metre band on the route is 19.8 degrees between 600 and 700 m and the steepest step 29.1 between 736 and 761, but the flanks around it measure 40 to 64 degrees in their steepest windows. The route takes the summit from the west because west is the one edge that does not.",
    ascent: [
      "Start along the E10 where the road comes closest to the mouth of Heggedalen, 21 m. The source gives a stretch rather than a point: «there are several options along the E10, depending on how much has been ploughed», with a warning worth carrying — «this is a busy road with an 80 km/h limit and few straight stretches, so take care along it and park a little further south and traverse above the road rather than create a dangerous situation on it». The road under the mountain is called Strandstindvegen, after the mountain.",
      "The normal route follows Heggedalen on the ridge between the two rivers. At around 146 m it crosses to the north side of the river, and the two spot heights the description navigates by turn up where they should: the gully at «height 505» measures 509.6 m and «height 570» measures 570.3 — 234 metres apart. Kartverket puts the last forest at 143 m and open ground from 157, so most of the tour is on an open hillside. The first hundred metres of climbing are the steepest in the valley floor at 14.7 degrees, and then it eases to 8.0 and 10.6.",
      "From 570 the route swings south and holds the east side of the bowl. The steepest band of the tour is here — 19.8 degrees from 600 to 700 m over 270 metres of ground — and the steepest step, 29.1 degrees between 736 and 761. The bowl flattens at around 805 m, and there the route does what Fri Flyt says: «the easiest way to the top is to keep right (west) from here and climb the summit by the ridge from the right (west).» The line runs west along the bench — 1092 metres of ground at 5.4 degrees between 700 and 800 m — gains the north-west ridge at 886 m and follows it over 952 and 1040 to the top. The last 600 metres bear 135 degrees: you come up from the north-west.",
    ],
    descent: [
      "Back the same way: the ridge down to the bench, the bench east and the north side down Heggedalen. It is the line the mountain is known for — «the descent is the same route as the ascent, and it is the classic: you can let them run and get real flow and a broad grin» — and in season you ski all the way down to the road by the sea. The snow on the north side lies late enough that a midnight-sun tour in June is not unusual.",
      "Going round costs what going round costs. The first corridor took the summit straight up the north-east rib, and that line was 4.77 km with 1090 metres of climbing; by the west ridge the tour is 5.86 km with 1156 and 101 metres given back on the way. Fri Flyt is clear about why: «it is certainly possible to climb the other side, but it is more exposed.» The rib measures 1010.2 m 150 metres from the summit to the north-east where the ridge measures 1039.8 to the north-west — it is steeper the whole way up.",
      "Directly north of the cairn it is steep whatever you do: 40.9 degrees in the steepest 60-metre window only 20 to 80 metres out, with 24.8 degrees mean out to a kilometre. That is also where the snow stays — Kartverket carries the terrain class SnøIsbre on the north side from around 1050 m downwards, while the ridge the route uses is bare ground at all sixteen of its last vertices. The other three edges are serious: south measures 30.6 degrees mean with 63.9 degrees in the window 20 to 80 metres from the cairn, south-east 30.9 with 62.5, east 29.0 with 54.9, and south-west 24.1 with 56.0. Fri Flyt's two other lines — Kvanntoa to the north-east and Kvannto to the east — have sections at 45 degrees and a rappel anchor, and they are not the route this card describes.",
    ],
    avalanche: [
      {
        title: "The bowl",
        body: "Fri Flyt gives one hazard on the normal route, and it is unambiguous: «large avalanches have run in the bowl several times, so pick days with stable snow.» The bowl is the hollow the route crosses between height 570 and the bench at 805 m, and it holds the steepest band of the tour — 19.8 degrees from 600 to 700 m. The description sends you along its east side, not through the middle.",
      },
      {
        title: "The mountain has no gentle side",
        body: "None of the eight directions from the summit measures under 17.0 degrees mean out to a kilometre, and four of them carry 60-metre windows over 50 degrees. West is the gentlest — 17.0 degrees mean, with 37.7 degrees in the window 120 to 180 metres out — and west is the ridge the route takes the summit from. Fri Flyt files the tour as KAST 3 – complex and lists an ice axe and crampons as extra equipment: «crampons and an axe can be worth having on days with a hard crust.»",
      },
      {
        title: "Before you go",
        body: "The forecast for this mountain is Lofoten og Vesterålen on varsom.no, not a Harstad region — the summit lies in Lødingen kommune, and Varsom answers on the coordinate. It is an A region, forecast every day in season. Fri Flyt gives January to June. The card carries Harstad as the region because that is where the day starts and how both sources place the tour; the register calls the top Strandstinden and Djupfesttinden, and neither of them Strandtinden. Carry a transceiver, probe and shovel, and an axe and crampons when the crust is hard.",
      },
    ],
    elevationProfile: {
      startLabel: "21 m",
      endLabel: "1076 m",
      distanceLabel: "5.9 km",
      caption: "1156 metres of climbing and 5.86 km from the E10 at 21 m up through Heggedalen past 146, the gully at 510 and spot height 570, across the bowl to 805 and west along the bench to the north-west ridge at 886, 952 and 1040.",
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
        body: "The line as drawn stays under 30 degrees the whole way. The steepest hundred metres sit between 500 and 600 m at a mean of 16.1 degrees, and the steepest single step measures 27.1 degrees. The bench north of Isvatnet runs at four to twenty-four degrees. The summit block is the exception — that is climbing, not ski terrain.",
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
      distanceLabel: "5.8 km",
      caption: "5.83 km and 1129 m of climbing from the quarry in Forselvveien; the steepest hundred metres sit between 500 and 600 m.",
    },
  },
  beisfjordtotta: {
    intro:
      "1428 metres of ascent over 7.19 km from the gate above Djupvik to the mountain Fri Flyt calls a mountain of many secrets. The normal route over the col is the patient way into them: steepest hundred-metre band 22.7 degrees, and the steepest sustained stretch — 38.4 degrees between 1414 and 1445 m — is the summit block itself. KAST 2 – Challenging by the source; the alternatives (Isvannsrenna, the ~45-degree glacier descent) are another league, and they are not this line. Both Forsnesvatnet and Isvatnet are regulated reservoirs, and the line keeps to land the whole way.",
    ascent: [
      "From the road gate on Forselvveien above Djupvik — 60 m, parking at the gate as the source says — you walk the road to its end at 141 and climb the steep forest to the waterworks road. The trees end at 502 m after 2.94 km. The first four waypoints share geometry with Rombakstøtta's revised line: this is audited ground.",
      "Past Pumpvatnet on its north side — a natural lake despite the name, 325 m, and the line rounds it on land after three reroutes recorded in the research — then up the stream valley toward Forsnesvatnet: 18.1 degrees in the band from 500 to 600. Fri Flyt's route crosses Forsnesvatn on the ice; the lake is regulated, so this line takes the east side on land — the bands from 800 to 1100 measure 18.4, 20.8 and 22.7 degrees, the tour's steadily steepest stretch.",
      "From the flat at the 1200 level — 4.2 degrees over 1.3 kilometres — it climbs toward the col between Moskočohkka and Tøtta, 1257 m where the line takes it, and the ridge south to the summit block: 38.4 degrees between 1414 and 1445, the metres that decide the day. The cairn at 1448; the register resolves 1447.8.",
    ],
    descent: [
      "Down the same way — the ridge from the northwest is the summit's gentle sector, 12.7 degrees mean over 500 metres. Take the summit block in your own track, and the flat below the col gives breathing room before the long bands down toward Forsnesvatnet.",
      "The southeast, south and east sides fall 34.6 to 44.8 degrees mean with 72 to 76 degrees in the first 60 m windows from the cairn — the edge above Beisfjorden is a wall. Isvannsrenna toward Straumsnes and the glacier descent (~45 degrees, with glacier and ravines) are the source's alternatives for stable days with a party that knows the ground.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt. The normal route is the patient line on a mountain whose alternatives hold gullies, ice and a glacier — 22.7 degrees in the steepest band, and the summit block's 38.4-degree step as the only serious move. The avalanche hazard in the gullies and ice sections belongs to the variants; read them as limits, not options.",
      },
      {
        title: "The regulated lakes",
        body: "Forsnesvatnet and Isvatnet are both regulated. Fri Flyt's route crosses Forsnesvatn on the ice — this line takes the east side on land, which costs minutes and no risk. Regulated ice cracks along the shore as the reservoir is drawn down; it is not ice to get acquainted with.",
      },
      {
        title: "The edge above Beisfjorden",
        body: "From the cairn the southeast falls 76 degrees in the first 60 m window. In flat light the edge and the flat are the same white — the way down is northwest, back toward the col, worth setting on the compass before the summit.",
      },
      {
        title: "Before you go",
        body: "Beisfjordtøtta lies in the Ofoten forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The February–June season is Fri Flyt's. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "60 m",
      endLabel: "1448 m",
      distanceLabel: "7.2 km",
      caption: "1428 metres of ascent and 7.19 km from the gate above Djupvik via Pumpvatnet and the east side of Forsnesvatnet, with the treeline at 502 m and the steepest ground — 38.4 degrees between 1414 and 1445 m — in the summit block.",
    },
  },
  pilan: {
    intro:
      "847 metres of ascent over 4.16 km from Laupstad on Austvågøya's quiet north side, with the view into Vesterålen from the cairn. Fri Flyt rates it KAST 1 – Simple with the steepest point under 30 degrees, and most of the line keeps that — steepest 100 m band 21.9 degrees. But the summit cone measures 39.4 degrees in its steepest 30 m window, between 753 and 786 m, and the measurement is the check for the grade: the card carries 3, not the source's number. The ridge gives back 26 vertical metres, and the tour runs from the fjord.",
    ascent: [
      "From Laupstad on the county road — 5 m, past the houses and up the valley heading west. The forest ends at 233 m after 1.66 km, and the valley takes you to the lake at 289: the band from 100 to 200 m measures 14.4 degrees, and from 200 to 300 only 8.8.",
      "From the lake you continue right toward Morfjordskaret — the register's Morfjordskaret lies in Hadsel, because the municipal boundary runs over this mountain — to the broad flank rising toward Pilan. The band from 400 to 500 measures 18.9 degrees, then it flattens: 9.6 and 7.5 over the next two hundred.",
      "The summit cone is the serious part: the band from 700 to 800 m measures 21.9 degrees over 274 metres of ground, and the steepest sustained stretch — 39.4 degrees between 753 and 786 — sits here. The soundings around the cone say the step is terrain, not routing: south and southwest measure 22.7 and 20.9 degrees mean, north and west 42.3 and 46.5. The cairn at 826; the register reads 826.0 against a published 828 — another narrow top where the laser scan reads a couple of metres low. Sautinden is the twin summit the same tour can combine.",
    ],
    descent: [
      "Down the same way — the broad flank to the south-east is big, readable skiing, and from the flat below the cone it is gentle running back to the lake and the valley. Take the step in the cone where you climbed it, while the snow is still what you read on the way up.",
      "Hold the flank: the north side toward Morfjorddalen is the source's own hazard, and it measures 42.3 degrees mean with 57.7 as the steepest window. West is the same story — 46.5 mean. The broad, kind terrain has edges, and they are all on the other side.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 1 – Simple by Fri Flyt, steepest point under 30 degrees — true for most of the line, but not for the summit cone: 39.4 degrees in the steepest 30 m window between 753 and 786 m. The card carries grade 3 on that measurement. Below 700 this is one of the kindest lines of the round.",
      },
      {
        title: "The cone",
        body: "The step sits directly below the summit, where the snow is either wind-loaded or scoured. Loaded, it is a small steep slope with a runout onto the flat; scoured, it is a few hard moves. Either reads in ten seconds from the flat below — do that before you are standing in it.",
      },
      {
        title: "Toward Morfjorddalen",
        body: "Steeper terrain down toward Morfjorddalen, says the source, and the measurement gives 42.3 degrees mean to the north. From the cairn in flat light the flank you climbed and the north side are easy to confuse for the first metres — the direction down is south-east, worth fixing before the fog takes the view.",
      },
      {
        title: "Before you go",
        body: "Pilan lies in the Lofoten og Vesterålen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. Fri Flyt gives no season; the feb–apr on the card is editorial from the neighbouring tours. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "5 m",
      endLabel: "826 m",
      distanceLabel: "4.2 km",
      caption: "847 metres of ascent and 4.16 km from Laupstad via the lake at 289 and Morfjordskaret, with the treeline at 233 m and the steepest ground — 39.4 degrees between 753 and 786 m — in the summit cone.",
    },
  },
  litletind: {
    intro:
      "916 metres of ascent over 5.21 km from Nervatnet to the fore-summit with the city view — Litletind is the Sleeping Queen's foothill and one of Narvik's most popular local tours, with Narvik and Rombaksfjorden below the cairn. Fri Flyt rates it KAST 2 – Challenging; the line measures 19.9 degrees in its steepest hundred-metre band and 26.2 in its steepest sustained stretch, up in the summit ground. The register writes Litletinden, and the summit search resolves 1099.6 against the source's 1096.",
    ascent: [
      "The same start as the queen: the parking after the bridge at Nervatnet, 223 m. Nervatnet is regulated — the line keeps the shoreline path on land, crosses the bog south of the lake and climbs through the sparse forest. The trees end at 532 m after 2.93 km, and the two first climbing bands measure 14.9 and 16.4 degrees.",
      "Just above the treeline you turn right (northwest) up the ridge leading to Litletind. The bands from 700 to 1000 measure 19.5, 17.9 and 19.9 degrees — even skinning on an open ridge with the view growing behind you.",
      "The summit ground is the source's one reservation: the ridge to the top is often wind-scoured and rocky, so the last stretch can be awkward. The steepest sustained stretch measures 26.2 degrees between 1043 and 1064 m, and on hardpack those are the metres you notice. The cairn at 1100 with Narvik, Rombaksfjorden and the queen's profile behind you.",
    ],
    descent: [
      "Down the same way — the south and southwest sector the line uses is the gentlest on the summit, 16.8 and 20.6 degrees mean over 500 metres. Fri Flyt's descent is broken snowfields in easy, varied ground.",
      "Hold back from east and northeast: 37.4 and 36.9 degrees mean with windows of 57.7 and 49.0 directly below the top — the edge above Håkvikdalen. Sløret, the steep snowfield between Litletind and Dronninga, is avalanche terrain with rocks at its base and belongs to the variants, not the normal tour.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt. The line itself is kind — 19.9 degrees in the steepest band, 26.2 in the steepest stretch — and what needs your head is the edges: the east and northeast sides fall 37 degrees mean with windows over 49 directly below the cairn.",
      },
      {
        title: "The summit ground",
        body: "Often wind-scoured and rocky — a slipping problem, not an avalanche problem. On hard westerly crust the last 60 metres can be where the skis stay behind.",
      },
      {
        title: "Reindeer and the lake",
        body: "The area is used for reindeer herding — keep your distance and your dog on a leash. And Nervatnet is regulated: the path on land both ways, however good the ice looks.",
      },
      {
        title: "Before you go",
        body: "Litletind lies in the Ofoten forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The February–May season is Fri Flyt's. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "223 m",
      endLabel: "1100 m",
      distanceLabel: "5.2 km",
      caption: "916 metres of ascent and 5.21 km from Nervatnet up the ridge from the treeline, with the forest limit at 532 m and the steepest ground — 26.2 degrees between 1043 and 1064 m — in the wind-scoured summit ground.",
    },
  },
  geitgaljen: {
    intro:
      "1071 metres of climbing from the fjord in 3.80 km, and the entire line lies in avalanche terrain. Topptursentralen grades the tour KAST 4 — extreme — and the top 157 metres average 42 degrees and require crampons and an axe.",
    ascent: [
      "Start at the road end in Geitgallien by Skinvollen at the head of Austnesfjorden, 20 m. Follow the floodlit trail for a stretch and on into Lilandsdalen through the birch forest. The first eight hundred metres barely climb — 6 degrees on average — and that is the only flat part of the tour.",
      "From around 250 m the valley steepens into a gully holding 35 degrees up to 360 m; the mapped path measures 34.8 degrees between 290 and 350 m. Above the gully it eases again, and you follow the valley upward at 17 to 20 degrees to about 620 m, where the stream bed steepens. The valley floor below the gully is a terrain trap: if something releases above you here, there is no way out to the side.",
      "Where the stream bed steepens, an obvious ramp leads up to the right into the large bowl at about 845 m — the top of the south gully. This is a classic runout zone, and your stopping place is chosen here, not in the middle of the bowl. On towards the col and up to 928 m, where it steepens for good: the steepest sustained section on the skin track measures 34.8 degrees. Above 1000 m the track's figures stop being the terrain's: the fall line there measures 33 to 50 degrees.",
      "The last 157 metres to the summit at 1085 m average 42 degrees, but the average hides the summit block: the top sixty metres measure 40 to 50 degrees. That is scrambling with crampons and an axe, not skiing. Directly south of the cairn the ground falls close to 70 degrees.",
    ],
    descent: [
      "With one car you go down the way you came: from the summit to 928 m on foot, then the bowl, the ramp down to the valley at 620 m, the gully from 360 to 250 m and out through Lilandsdalen. The gully is the part to reassess on the way down — it has been above you the whole way up, and in the sun it may have changed while you were on top.",
      "The usual mistake: taking the south gully without arranging transport. It is the documented descent, some six hundred metres at 35 to 40 degrees, but it comes out in a different valley and needs a second car. The other mistake is treating the summit as the goal regardless of conditions: if the ridge is icy, the last 174 metres are a 42-degree scramble with the skis on your back, and the decision to turn round is taken at 928 m.",
      "Large avalanches run here several times each winter. This is not a tour you take on a middling forecast because you travelled a long way.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The entire route lies in avalanche terrain. The gully at 250 to 360 m is 35 degrees with the valley floor as a terrain trap below it, the bowl above the south gully is a classic runout zone, and the top 157 metres average 42 degrees, the last sixty 40 to 50. On the line itself the steepest sustained section measures 34.8 degrees, but those figures describe the skin track up the valley. Above 1000 m the fall line measures 33 to 50 degrees, and averages are the wrong tool here anyway: there is nowhere on the route with nothing above you.",
      },
      {
        title: "The terrain off it",
        body: "Directly south of the summit the ground falls close to 70 degrees — 65 to 72 measured in twenty-metre steps over the first hundred metres. The south gully, used as a descent, holds 35 to 40 degrees over some six hundred metres and ends in a different valley from the one you climbed. Topptursentralen grades the line KAST 4 — extreme — and lists avalanches, runout zone and terrain trap among its hazards. Large avalanches run in this area several times each winter.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Lofoten og Vesterålen at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "20 m",
      endLabel: "1085 m",
      distanceLabel: "3.8 km",
      caption: "1071 metres of climbing and 3.82 km from Liland; the gully at 250–360 m is 35 degrees, and the top 174 metres 42.",
    },
  },
  skjomtinden: {
    intro:
      "1487 metres of ascent over 7.64 km from Nervatnet in Håkvikdalen to the Sleeping Queen — the profile everyone in Narvik knows from the Bjerkvik side, and one of the area's finest tours. Fri Flyt rates it KAST 2 – Challenging, but the gear list says ice axe and crampons, the west sides are at times bare and rocky, and the line gives back 134 vertical metres on the traverse — the card carries grade 4. The steepest hundred-metre band measures 20.3 degrees; the steepest sustained stretch, 33.7 degrees, sits in the gully between 1439 and 1462 m.",
    ascent: [
      "From the parking after the bridge at Nervatnet — 223 m, E6 south from Narvik and into Håkvikdalen; the local bus to the bridge is the source's own alternative. Nervatnet is a regulated reservoir, so the line keeps the shoreline path on land — the source offers the ice «if it is stable», an offer this product always declines. Across the bog south of the lake and up through the sparse forest: the trees end at 546 m after 2.96 km.",
      "Just above the treeline you turn right up the ridge toward Litletind, follow the hollow around it and traverse diagonally up to the ridge between Litletind and Dronninga — 945 m where the line takes it. The bands are patient: 12–13 degrees from 600 to 900, then the tour's steepest hundred, 20.3 degrees from 1000 to 1100.",
      "From about 1200 you traverse onto the west sides. Here the ground is at times bare and rocky — expect stretches on foot, and this is where the axe and crampons in the pack stop being decoration. The snow gully leads up to the ridge northwest of the main summit: the steepest sustained stretch measures 33.7 degrees between 1439 and 1462 m, and the band above 1400 is otherwise gentle because the traverse slants. The cairn at 1576 — the register resolves 1575.8 against a published 1575 — with Ofoten, the Frostisen glacier and the sea around you.",
    ],
    descent: [
      "Down the same way: the gully, the traverse, the ridge. The ridge northwest of the summit is the mountain's only gentle sector — 13.2 degrees mean over 500 metres — and everything else falls 23 to 45 degrees mean with windows of 43 to 68. Take the traverse in your own track, while you still know where the rocks were.",
      "«Øyet» — the Eye — is the source's alternative descent: a narrow snow gully of 45–50 degrees with ice and exposed cliffs, where route-finding is critical. It is here because it exists — not because this card recommends it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, but the card's grade is 4: bare, rocky west sides with travel on foot, ice axe and crampons on the gear list, 134 vertical metres given back on the traverse, and a 33.7-degree snow gully as the final key. This is the Slogen class — a mountaineering day on skis, not a ski tour with a summit.",
      },
      {
        title: "The gully and the west sides",
        body: "The gully between 1439 and 1462 m is steep enough to slide, and the west sides load after easterly wind. Bare rock and ice alternate with snowfields — judge every transition, and turn where the conditions say turn; the queen will still be there next weekend.",
      },
      {
        title: "Nervatnet",
        body: "The lake is regulated, and regulated ice is unreliable ice: the line keeps the path on land, and so should your track — both ways, even when the ice «looks fine» in March.",
      },
      {
        title: "Before you go",
        body: "Skjomtinden lies in the Ofoten forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The February–May season is Fri Flyt's. Transceiver, probe, shovel — and the ice axe and crampons the source itself requires.",
      },
    ],
    elevationProfile: {
      startLabel: "223 m",
      endLabel: "1576 m",
      distanceLabel: "7.6 km",
      caption: "1487 metres of ascent and 7.64 km from Nervatnet via the ridge between Litletind and Dronninga and the traverse on the west sides, with the treeline at 546 m and the steepest ground — 33.7 degrees between 1439 and 1462 m — in the gully.",
    },
  },
  torskmannen: {
    intro:
      "754 metres of ascent over 3.00 km from the Kvitfossen power station in Vestpollen — a local favourite where the snow often lies sheltered in the valley when everywhere else is wind-hammered. Fri Flyt rates it KAST 2 – Challenging with a steepest point of 35 degrees; the line up the valley and out through the col right of the summit measures 21.6 degrees in its steepest 100 m band and 28.1 in its steepest sustained stretch, which is the last metres to the cairn. The top is often wind-scoured and hard.",
    ascent: [
      "From the power station on the E10 — OSM maps Kvitfossen kraftverk on Midnattsolveien, with a bus stop by the road, and the fjord reads 5 m. You aim northwest toward the summit and cross the moor to the valley floor: the band from 0 to 100 m measures 5.5 degrees over the first kilometre, and the forest ends at 262 m after 1.54 km.",
      "As early as possible into the valley and up its left side toward the lake in the hollow — the probe point by the line reads 352.9 m where the source's «lite vann» lies. The bands are even: 19.6 degrees from 100 to 200, 20.4 from 300 to 400, 19.4 from 400 to 500 — the valley is a staircase, and it is why the snow stays here.",
      "From the lake you cross toward the col right of the summit — 568 m where the line takes it — and follow the ridge the last stretch. The band from 700 to 800 is the tour's steepest, 21.6 degrees, with the steepest sustained stretch at 28.1 between 721 and 745 m. The cairn at 755; the register holds two Torskmannen in Vågan, and this one — the summit search resolves 755.2 — is the one the source describes; the namesake further southwest reads 717.6.",
    ],
    descent: [
      "The normal descent is the valley back — your own skin track, says the source. The descent aspect is southeast: the flank measures 30.8 degrees mean with 49.2 as the steepest window 40 to 100 metres out, so the first turns off the ridge are taken with some thought about where you drop in.",
      "The southwest and west sides are another world: 40.7 and 40.0 degrees mean with windows of 67.4 and 62.7 directly below the summit. The steeper descent options off the ridge sit in avalanche terrain, says the source — they are there for days that can carry them.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, steepest point 35 degrees — and the line measures 28.1 at its steepest, because it takes the col and the ridge instead of the flank direct. The valley is sheltered from the wind, which also means it collects the snow the wind moves: read the loading in the slopes above you on the way up.",
      },
      {
        title: "The summit",
        body: "The last metres to the cairn are often wind-scoured and hard — bare rock and hardpack, a slipping problem rather than an avalanche problem. The northeast sector the line arrives from is the gentle one (12.7 degrees mean); everything west and south of the cairn falls 40 degrees or more on average.",
      },
      {
        title: "The descent variants",
        body: "Steeper lines drop straight off the ridge — the source calls it avalanche terrain, and the southeast flank below the summit has a 49.2-degree window. The normal tour has no business there; the variants belong to stability you have measured, not hoped for.",
      },
      {
        title: "Before you go",
        body: "Torskmannen lies in the Lofoten og Vesterålen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. Fri Flyt gives no season; the jan–apr on the card is editorial from the neighbouring tours. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "5 m",
      endLabel: "755 m",
      distanceLabel: "3.0 km",
      caption: "754 metres of ascent and 3.00 km from Kvitfossen up the valley and the col right of the summit, with the treeline at 262 m and the steepest ground — 28.1 degrees between 721 and 745 m — on the ridge to the cairn.",
    },
  },
  rundfjellet: {
    intro:
      "890 metres of ascent over 5.28 km from the sea at Vatterfjordpollen to Svolvær's nearest classic — a simple summit with many variants according to utemagasinet, where the line along the ridge is the point: stay on top of it, says Fri Flyt, because the surrounding terrain is avalanche-prone, and the measurement agrees — the south sector the ridge uses measures 13.7 degrees mean while every other side of the summit has windows of 40 to 65. The ridge gives back 93 vertical metres along the way, which is why the card carries 890 where the source counts 800.",
    ascent: [
      "From the car park at Vatterfjordpollen on the E10, ten kilometres from Svolvær toward Fiskebøl. The line on the map begins on the west side of the small bridge over the tidal stream — the terrain model records the strait as sea and the bridge does not exist in it, so the walk across from the car park lives here rather than in the geometry. Then along the right side of the poll and in across the moor to the mountain's foot: the band from 0 to 100 m measures 3.0 degrees over nearly two kilometres, and the forest ends already at 94 m after 1.93 km.",
      "From the foot up onto the south ridge — the band from 100 to 200 m is the tour's steepest, 18.4 degrees over 271 metres of ground — then north along the ridge until it turns west. The ridge undulates: 93 vertical metres are given back, and the bands sit at 10 to 12.5 degrees — even, readable skinning with Austnesfjorden on one side and the Higravstindan skyline ahead.",
      "Where the ridge turns west — 604 m where the line takes the bend — the last part waits: 15.1 degrees in the band from 700 to 800, with the steepest sustained stretch, 31.2 degrees, between 624 and 644 m. The cairn at 803; the register and the summit search resolve 802.6.",
    ],
    descent: [
      "The normal descent is the ridge back — the south sector measures 13.7 degrees mean over 500 metres, and the many variants are why this tour bears repeating. Hold back where the ridge ends: the descent toward Vatterfjordpollen can be avalanche-prone, steepest if you cut left off the ridge early on the south side, says the source.",
      "From Kudalen on the north side there is often hard ice near the end — the source asks for crampons and ice axe if you go that way. The northwest side has a 60 m window of 64.8 degrees; not a side to improvise on.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "No KAST from Fri Flyt (older page format), but his rule is precise: stay on top of the ridge, because the surrounding terrain is avalanche-prone. The measurement says the same — the south sector 13.7 degrees mean, every other side with windows of 40 to 65.",
      },
      {
        title: "The descent toward the poll",
        body: "The source's own hazard: steepest where you cut left off the ridge early on the south side. The south side's steepest window sits 350 to 410 metres out from the summit and measures 38.2 degrees — that is where the tempting shortcut leads. The ridge all the way down costs ten minutes and nothing else.",
      },
      {
        title: "The ice from Kudalen",
        body: "The north side often carries hard ice near the top — crampons and ice axe if you go that way, says the source. It is variant terrain, not the normal route, and it is here because anyone reading this in Svolvær will hear about it.",
      },
      {
        title: "Before you go",
        body: "Rundfjellet lies in the Lofoten og Vesterålen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. Fri Flyt gives no season; the jan–apr on the card is editorial from the neighbouring tours. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "6 m",
      endLabel: "803 m",
      distanceLabel: "5.3 km",
      caption: "890 metres of ascent and 5.28 km from Vatterfjordpollen up the south ridge and along the ridge-top, with the treeline at 94 m and the steepest ground — 31.2 degrees between 624 and 644 m — where the ridge turns west.",
    },
  },
  kleppstadheia: {
    intro:
      "525 metres of ascent over 2.19 km from Kleppstadveien south of the Gimsøy bridge — the tour Fri Flyt itself uses to practise track-setting: «using the terrain to set a sensible, good track.» The gentle, broad field toward the summit keeps that promise — 20.9 degrees in the steepest 100 m band — and the steepest sustained stretch, 32.9 degrees between 111 and 136 m, sits down in the forest step. From the cairn you see Gimsøya, Vestfjorden and Himmeltindan to the west.",
    ascent: [
      "From the parking along Kleppstadveien on the south side before the Gimsøy bridge — 16 m, with the register's Kleppstad a couple of hundred metres away. You set the track up the ridge toward point 156: the tour's steepest stretch sits here, 32.9 degrees between 111 and 136 m, in the forest — the band from 100 to 200 measures 20.2 degrees, and the forest ends at 232 m after 1.17 km.",
      "Above the forest the field owns the tour: 20.9 degrees from 200 to 300 m, 19.1 from 300 to 400, then it eases toward the top — 7.9 degrees in the last band. Broad ridge, track wherever you choose, and the terrain as the teacher: every knoll and hollow is a decision about where the track should lie.",
      "The cairn at 534 — Fri Flyt's published GPS point is the register's Kleppstadheia to the metre, and the summit search resolves 533.9. The prominence is modest; the view is not.",
    ],
    descent: [
      "Down the same way, with the track-craft in reverse: the field takes anything, and the forest step at the bottom is the one place the turns have to sit. Southwest is the descent aspect, and that sector measures 12.8 degrees mean.",
      "The source's hazard is the steep ground along the south side of the ridge lower down — and at the summit it is the north, northeast and east sides that are the edges: 34.6 to 37.9 degrees mean with windows of 45 to 56. The normal track on the ridge and the field stays clear of all of it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Simple by Fri Flyt, steepest point under 30 degrees on the field — the line's 32.9-degree step sits in the forest at the bottom, short and readable. This is the tour for days when the bulletin advises against steep terrain, and the practice tour for every other day.",
      },
      {
        title: "The edges",
        body: "The source points at steep ground along the ridge's south side; the measurement at the summit adds that the north, northeast and east sides fall 34.6 to 37.9 degrees mean with windows up to 56. The field is roomy — use the room, and keep the edges at arm's length in flat light.",
      },
      {
        title: "Before you go",
        body: "Kleppstadheia lies in the Lofoten og Vesterålen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. Fri Flyt gives no season; the jan–apr on the card is editorial from the neighbouring tours. Carry transceiver, probe and shovel — on the practice tour too.",
      },
    ],
    elevationProfile: {
      startLabel: "16 m",
      endLabel: "534 m",
      distanceLabel: "2.2 km",
      caption: "525 metres of ascent and 2.19 km from Kleppstadveien up the ridge toward point 156 and the broad field, with the treeline at 232 m and the steepest ground — 32.9 degrees between 111 and 136 m — down in the forest.",
    },
  },
  "varden-smaatindan": {
    intro:
      "825 metres of ascent and 5.04 km from Eidet by Kabelvåg to the top Fri Flyt calls the most popular ski tour in the archipelago. The card carries both names the mountain has in the register — Varden and Småtindan — and the numbers are honest about what the tour is: the steepest 100-metre band measures 22.8 degrees between 600 and 700 metres, the steepest sustained stretch 32.3, and the line gives back 127 vertical metres along the way, most of it in the notch around Ørntinden and on the neck between two lakes whose ice cannot be assumed.",
    ascent: [
      "From the E10 west of Kabelvåg turn across the bridge signed for Eidet; the mapped Karlsvågen car park lies about 400 metres from the main road, at 2 metres. The lit ski trail — Damveien — starts 120 m north-east and runs north up the valley along the east side of Karlsvatnet.",
      "The lakes decide the first kilometre, and they each deserve a sentence: Karlsvatnet lies at 12 metres a short kilometre from the sea, and Stor-Kongsvatnet beyond it is regulated — both are measured, and the line stands on neither. It leaves the trail before the lake and crosses the dry neck between the two at 29 metres, over the bog west of it at 24, and across to the foot of Aksla at 20 metres. 0 metres on water, measured against Kartverket's terrain classes and the OSM polygons.",
      "Aksla is the ridge up: from the foot at 20 metres to 141, on to just below Ørntinden at 342 — the forest ends already at 219 metres by Kartverket's classes, so most of the ridge is open. Fri Flyt says 'keep right around the top of Aksla' — the ridge it calls Aksla is Ørntindaksla in the register and tops out at 316 metres — and the measurement says what the detour costs: the notch west of it reads 293 metres, about 24 vertical metres given back against climbing over. Ørntinden itself, 398 metres, lies south of the notch and is left alone.",
      "From the notch the line holds west along the flank: 341, 441 and 565 metres on the way to the top, with the steepest 100-metre band — a mean 22.8 degrees — between 600 and 700. Fri Flyt warns that the slopes around the upper line rise at 35–40 degrees; the track stays gentler, but the flanks beside it do not. A mapped path also reaches the summit, and the line is not on it here: between 3.87 and 4.34 km out it runs up to 367 metres from the path before the two meet again at 602 m. The path is tagged as a footpath in OSM with no winter status, and through the 330 to 470 m band it is the gentler of the two — its steepest thirty-metre step measures 20.8 degrees against the line's 24.9.",
      "The cairn at 700 metres — the register holds both Varden (Ås) and Småtindan (Fjell) at the summit, and the climbed cell reads 700.5 against a published 700. The highest point of the massif is, incidentally, another peak — Stortinden, 732 metres, 600 metres further south-west; the tour's goal is Varden, and that is where the skin track goes.",
    ],
    descent: [
      "'The same route down for maximum margin', says the source, and the descent starts carefully: right around the cairn the ground plunges in nearly every direction — north-west 60.7 degrees and west 53.8 only 20–80 m out, east 49.3 degrees 10–70 m out. Fri Flyt itself says the skiing starts about 50 metres below the summit, and the measurements agree.",
      "From the flank it is even skiing down to the notch and around Ørntinden — the best stretch is from the top down towards Aksla, says the source — and then the ridge down to the neck. Remember the re-ascents: the notch and the neck give you roughly 50 and 20 vertical metres to regain on the way home.",
      "The west-side variant towards Lyngvær, which the source mentions, requires arranged transport from Olderfjorden and is not this line. From the neck it is the trail along Karlsvatnet back to the car park — on land the whole way.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt rates it KAST 2 – challenging, and the measurement of the line says 32.3 degrees as the steepest sustained stretch — which sits low, between 127 and 155 metres on the ridge up — and 22.8 degrees as the steepest 100-metre band, between 600 and 700 metres. Its own warning concerns the flanks: 'in the upper parts the slope rises at 35-40 degrees' — that is the terrain around the track, and the line choice on the upper flank is where the day is decided.",
      },
      {
        title: "Kolbeindalen and the shooting range",
        body: "Fri Flyt's stated hazard for this very route is the line itself: 'avalanche-prone areas in the upper parts down from the saddle'. The saddle is the notch at 293 metres, and the upper parts are the flank the line climbs and skis — steepest 100-metre band 22.8 degrees, with the flanks beside it at 35–40 by Fri Flyt's own account. Its other description adds the valley north of the ridge: 'avalanche danger in Kolbeindalen', a shooting range at the bottom, and 'in the middle of the valley – where the river runs – the avalanche danger is at times very great'. The 'in to Store Kongsvatnet' variant enters it; this line does not — but the saddle it crosses is the source's own avalanche point.",
      },
      {
        title: "The summit",
        body: "Varden is a peak, not a rounded top: the north-west side falls 60.7 degrees and the west side 53.8 only 20–80 m from the cairn, the east side 49.3 degrees 10–70 m out, and the south side 57.9 degrees 220–280 m out. In fog the summit area is a place to turn early — there is no gentle sector to feel your way down.",
      },
      {
        title: "The lakes and the weather",
        body: "Karlsvatnet lies at 12 metres by the coast and Stor-Kongsvatnet is regulated — the ice on the first cannot be assumed, and on the second it should not be used. The line crosses the neck between them on land, measured point by point. Varden is in the Lofoten og Vesterålen forecast region, an A region with a daily avalanche bulletin — check varsom.no. No source publishes season months; the card's jan–apr is borrowed from the app's other Lofoten tours, and the guide says so. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "2 m",
      endLabel: "700 m",
      distanceLabel: "5.0 km",
      caption: "825 metres of ascent and 5.04 km from Eidet by Kabelvåg — along Karlsvatnet on land, around Ørntindaksla, and the east flank to the cairn at 700.",
    },
  },
  himmeltindan: {
    intro:
      "Vestvågøy's highest mountain, starting on the shore at Haukland and climbing 988 m in just under four kilometres. A short tour, but the last third is steep and the summit ridge is narrow.",
    ascent: [
      "From the car park at Hauklandstranda, six metres above the sea, head north toward the southern portal of the tunnel to Utakleiv. Not through the tunnel: take the service road that climbs north-east over it, past Klumpan, and follow it until it levels out on the bench at 150 m at the mouth of Durmålsdalen. The marked path starts here, and it runs all the way up to the cairn at 931. The car park charges year round, by machine or app; it is priced by the hour and time-limited to keep the beach turning over, so pay for the whole tour before you set off.",
      "Continue north-east up the south side of Durmålsdalen. The ground is open the whole way — there is no forest on this tour — and the line settles into long zig-zags up toward the shoulder at Molheia. It steepens from 300 m: the bands from 300 to 700 m run at a mean of 21.7 to 23.2 degrees, and the steepest step on the line measures 28.4 degrees, between 666 and 687 m. Do not cut straight up the west flank of the summit ridge; it runs at 34 to 37 degrees on average with sections to 46. You take the height on the shoulder on the south side.",
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
        body: "The lower half is gentle and open. It steepens from 300 m: the bands from 300 to 800 m hold 19.4 to 23.2 degrees on average, steepest between 500 and 600 m. The steepest step on the line measures 28.4 degrees, between 666 and 687 m. From the sub-peak north the ridge is narrow, with a drop to 898 m and fifty metres of re-climb before the main top.",
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
      startLabel: "7 m",
      endLabel: "956 m",
      distanceLabel: "3.9 km",
      caption: "988 m of climbing from the shore at Haukland over 3.89 km; the steep ground sits between 500 and 600 m.",
    },
  },
  gangnesaksla: {
    intro:
      "1306 metres of ascent over 4.90 km from the power station in Sørskjomen — nearly the whole mountain from the fjord, with the 25 square kilometres of the Frostisen glacier in view and the couloir the local paper calls Norway's longest below the northeast edge. Fri Flyt rates it KAST 2 – Challenging; the normal route on the south side measures 20.0 degrees in its steepest hundred-metre band and 26.0 in its steepest sustained stretch. The couloir is variant terrain with its own gear list, and it is not the line on this card.",
    ascent: [
      "From the parking outside the power station — OSM maps Skarelva kraftverk, the station with the glass-and-stone facade the source describes, 20 m. The works road follows Vesterskarelva up the valley: the band from 100 to 200 m measures 18.8 degrees, and you follow the stream to the small dam at the treeline at 539. The forest ends at 600 m after 2.56 km.",
      "From the dam you turn right through the forest heading northwest, and above the treeline it runs diagonally to the distinct shelf at about 800 m — the probe above the shelf reads 1067. The bands from 700 to 1000 measure 19.2, 19.6 and 20.0 degrees: even, never steep, always up.",
      "From the shelf you hold the same bearing on the gentlest slopes and take the summit via the northeast ridge. The steepest sustained stretch measures 26.0 degrees between 1155 and 1174 m. The cairn at 1318 — the register resolves 1318.5, the coordinate moved 200 metres from the representation point to the top — with Frostisen to the south and Skjomen below.",
    ],
    descent: [
      "The normal way down is your own track — a fine route with plenty of room above the treeline, says the source, and the southwest sector measures 9.6 degrees mean. Watch for avalanches south of the summit and holes in the stream late in the season — the source's own words, and the stream valley is where both live.",
      "The Gangnesrenna is its own chapter: about 40 degrees at the top, ice from the watercourse, avalanche activity lower down, ice axe, crampons and possibly a rope on the source's gear list, and a labyrinthine exit along the fjord edge to Skjombotn. The rim above the couloir measures 59.9 degrees in the first 60 m window. A thousand metres straight to the fjord — for days and parties that have measured themselves against less first.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt. The normal route on the south side is even — 20.0 degrees in the steepest band, 26.0 in the steepest stretch — and the hazards the source names are avalanches south of the summit and holes in the stream late in the season. The stream valley is both your skin track and a runout; read the slopes above it.",
      },
      {
        title: "The Gangnesrenna",
        body: "About 40 degrees at the top, ice from the watercourse, avalanche activity at the bottom — and 59.9 degrees in the first window off the rim. The couloir has its own gear list in the source (axe, crampons, possibly a rope) and its own seriousness. From the normal route it is a view, not a shortcut.",
      },
      {
        title: "Before you go",
        body: "Gangnesaksla lies in the Ofoten forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The February–May season is Fri Flyt's. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "20 m",
      endLabel: "1318 m",
      distanceLabel: "4.9 km",
      caption: "1306 metres of ascent and 4.90 km from the power station in Sørskjomen via the dam at the treeline and the shelf at 800, with the forest limit at 600 m and the steepest ground — 26.0 degrees between 1155 and 1174 m — below the northeast ridge.",
    },
  },
  justadtinden: {
    intro:
      "733 metres of ascent over 2.88 km from the Justad farm to the highest summit on Vestvågøy's east side — gentle, playful ski terrain by the sources, with Vågakallen and Henningsvær below the cairn. No hundred-metre band measures more than 22.6 degrees, and the steepest sustained stretch is 29.8. Fri Flyt's Lofoten pages are older and carry no KAST; what they carry is the hazards, and they are measurable: the cornices toward the northeast hang over a side falling 41 degrees mean.",
    ascent: [
      "From the Justad farm on the fv. 815 — 14 m on farmland, parking along the road as the source says. The hillside above the farm is open practically from the shore: the terrain classes along the line hold no continuous forest at all, so the whole tour reads from the car. The band from 0 to 100 m measures 11.7 degrees.",
      "The line follows the ridge formation north over Skjærheia: the band from 300 to 400 m is the tour's steepest, 22.6 degrees over 250 metres of ground, with the steepest sustained stretch — 29.8 degrees — between 363 and 389 m. Above 400 it eases to 11.0 before the upper bands settle at 17–20 degrees.",
      "The summit ground is playful: small features and optional lines up to the cairn at 736 — the register reads 735.7 where Fri Flyt and the map write 738, a narrow top where the laser scan reads a couple of metres under the published figure. Stay west of the edge: the northeast side below the cairn falls 41.0 degrees mean with 64.9 degrees as the steepest 60 m window only 10 to 70 metres out.",
    ],
    descent: [
      "The normal descent is your own track, and the west side is the gentlest sector — 21.7 degrees mean with 30.1 as the steepest window. The Oktoberflanken mid-ridge is the source's variant for more fall per turn.",
      "The south descent is where the source says the bigger avalanches run, and the measurement agrees: 34.8 degrees mean with 50.0 degrees as the steepest window 110 to 170 metres out. It belongs to stable days — and the cornices toward the northeast make that edge something you keep your distance from in any conditions.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "No KAST from Fri Flyt — the Lofoten pages predate the classification — but the line's own numbers are kind: 22.6 degrees in the steepest band, 29.8 in the steepest stretch. The surrounding terrain is what needs your head, and it is why the card carries grade 2.",
      },
      {
        title: "The cornices to the northeast",
        body: "The source's own hazard: cornices toward the steeper ground to the northeast. The northeast side falls 41.0 degrees mean with 64.9 as the steepest window directly below the cairn — a cornice that releases there has a wall under it. In flat light the track runs a few turns' width west of the edge.",
      },
      {
        title: "The south side",
        body: "The bigger avalanches run on the south descent, says the source — 34.8 degrees mean, steepest window 50.0. After loading from north and west the south side is the lee — and then the skin track along the ridge is the only line the tour needs.",
      },
      {
        title: "Before you go",
        body: "Justadtinden lies in the Lofoten og Vesterålen forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. Fri Flyt gives no season; the jan–apr on the card is editorial, taken from the neighbouring tours, and it says so here. Carry transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "14 m",
      endLabel: "736 m",
      distanceLabel: "2.9 km",
      caption: "733 metres of ascent and 2.88 km from Justad over Skjærheia, with no forest to speak of along the line, and the steepest ground — 29.8 degrees between 363 and 389 m — mid-ridge.",
    },
  },
  stornappstinden: {
    intro:
      "The Lofoten classic in manageable format: 685 vertical metres from the roadside to a cairn standing right on the edge of the cliff. Short enough for an afternoon, big enough to become a favourite.",
    ascent: [
      "From the car park at the ski tow in Nappskaret, a kilometre west of Napp, head north and keep left of the lift. Just above the top pylon, at 139 m, the paths from the various car parks converge into one track — if you start from the western car park a little over 250 metres away, you join the same track here. From 61 m and upwards you are above the treeline the whole way; there is no forest on this route.",
      "The track swings northeast into the valley between Okstinden and Litlnappstinden and crosses Myrlandselva at around 215 m. Continue up the valley to the hollow at Skarvatnet, the frozen tarn at 341 m. Keep left towards Middagstinden, then work right where the terrain lies gentlest — that is the line that takes you up without touching the south flank.",
      "Above 500 m the ground rears up into a short, steep step onto the ridge at 560 m. The 100-metre bands lie close together: the steepest, 600 to 700 m, averages 17.1°, and down in the valley between 200 and 300 m it is 16.7°. The steepest single step on the whole line measures 25.1°, and it sits right here — between 498 and 530 m. Above the step it eases, and from around 724 m the broad summit plateau runs east as a 13-degree ramp to the cairn.",
      "The cairn at 741 m stands on the lip of the east face. Stop at the cairn. The summit carries big cornices to the east, and the east and northeast sides above Napp and Perklubben fall at 42–43° on average with rock bands over 60° — that is cliff, not a line.",
    ],
    descent: [
      "Back the way you came. The valley between Okstinden and Litlnappstinden gives varied skiing, and from the hollow at Skarvatnet it is open all the way down to the lift.",
      "The common mistake: dropping south off the summit plateau because it looks shorter. The south side directly below the summit falls at close to 39° on average, with sections over 50°, and that is where the slides run on this mountain. Hold west instead — west is the gentlest side of the mountain, 22° on average — and follow the ascent back to the hollow.",
      "Fifty metres out from the cairn you turn left, due south, into the gully: 40° and 400 metres long, and it opens into a wider section right above Litlnappstinden. That is a decision of its own, not a shortcut.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The climb through the valley is gentle: no 100-metre band on the route holds more than 17.1°, and the steepest is 600–700 m. But the average hides the step onto the ridge: the steepest single step on the line measures 25.1° between 498 and 530 m, short and steep. Those are the parts of the normal route that can release.",
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
      distanceLabel: "3.1 km",
      caption: "61 to 741 m over 3.1 kilometres: steady climbing through the valley, one steep step, then flat ground to the cairn.",
    },
  },
  midtitinden: {
    intro:
      "1050 metres of ascent and 4.15 km, every metre of the mountain from sea level: the car park at Sagelva on highway 80 reads 11 metres, and the cairn 1060. Fri Flyt calls Midtitinden — or Mjønestinden — one of the most popular ski peaks around Bodø, and the numbers explain why: the steepest 100-metre band measures 19.1 degrees between 900 and 1000 metres, the steepest sustained stretch 26.9, and the line gives back two metres on the whole tour. The register carries both points: the Topp point Midtitinden stands 294 m to the north-east and reads only 983 metres, while the Fjell point Mjønestindan stands 15 m from the highest ground and reads 1057. Fri Flyt's 'Mjønestinden' is thus the register's own name for the summit itself — and that is where the line goes.",
    ascent: [
      "Start at the big pull-off on highway 80 at Kleivberget, north-east of the mouth of the Sagelva — the parking bay is mapped and reads 11 metres. Walk north through the cabin field to the uppermost cabin, the one Fri Flyt calls Geilo, at 54 metres — the forest here is the only forest on the tour, and Kartverket's classes say it ends already at 191 metres.",
      "From the cabin hold north-north-east for about a kilometre, as the source says, following the natural ramps past the steeper ground — the line passes 270 and 420 metres on its way towards Innertinden. At 536 metres, on the flank towards Innertinden, you meet the military route marking the source places at 560.",
      "West along the marking to the south-east ridge coming down from Midtitinden — the source says roughly 720, and the foot of the ridge reads 728. From 800 metres the ridge rolls over into what Fri Flyt tells you to watch: 'the convex transition that begins at 800 m'. The measurement agrees about where it sits — the steepest sustained stretch of the tour, 26.9 degrees, lies between 877 and 893 metres, and the steepest 100-metre band, a mean 19.1 degrees, between 900 and 1000.",
      "At 1026 metres — the source says 980 — the line rounds north onto the north-east ridge. The last metres to the cairn are gentle, and you stand at 1060 metres with the whole of Saltfjorden and the peaks around you.",
      "The register deserves a sentence: the Topp point for Midtitinden stands 294 m north-east of the highest ground and reads 983 metres — 75 metres too low. The summit itself carries another register name, Mjønestindan (Fjell), 15 m from the climbed cell. The summit search climbed to 1059.5 — published 1058 — and the card carries the measured cell.",
    ],
    descent: [
      "The normal way down is the way you came up: the north-east ridge, the south-east ridge and the ramps back to the military route and the cabin field. With 26.9 degrees as the steepest sustained stretch it is open skiing from summit to shore — but the convex rollover at 800 metres is there on the way down too, and you cannot see what lies below it until you are in it.",
      "Fri Flyt describes several variants from easy to demanding — the south-east flanks, east towards the lake at 627, and north towards Stordalen at 450 with a return over the notch. None of them is this line, and the measurements from the cairn say why they demand their due: the north-east side falls 69.2 degrees at its steepest 390–450 m out, the south side 56.7 degrees 70–130 m out and the south-west side 60.8 degrees 90–150 m out. Choose a variant in good visibility, not in fog.",
      "The side the tour climbs faces south-south-east and gets sun from the morning: what is soft at midday can be crust again when you come down late. The line gives back two metres in total, so the way home is clean skiing.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt's own figure for the normal route is a steepest point under 30 degrees, and the measurement confirms it for this line: 26.9 degrees as the steepest sustained stretch, with the steepest 100-metre band at 19.1 degrees between 900 and 1000 metres. But under-30 applies to the track, not the mountain: just south, south-east and north of the summit the ground stands at 39.5 to 56.7 degrees only 60–130 m from the cairn.",
      },
      {
        title: "The variants",
        body: "The descent variants Fri Flyt grades from easy to demanding run in terrain the measurement has numbers for: the north side towards Stordalen measures a mean 28.1 degrees with 40.4 degrees as its steepest 60 m only 60–120 m from the cairn, the south-west side 60.8 degrees 90–150 m out and the west side 55.4 degrees 140–200 m out. The north-east side, which none of the variants uses, falls 69.2 degrees 390–450 m out. That is avalanche terrain with consequence, and the freedom of choice is exactly what makes the mountain popular — choose by the conditions, not by appetite. Fri Flyt puts its own warnings on the variants, and they stand here: 'large slab avalanches have been recorded on the east slope down towards the lake at 627 m'; the gully is to be skied 'one at a time'; there is a cornice edge on the skier's left along the north-west ridge from the summit; and 'on days with avalanche danger 3 you should not be tempted to leave the track'.",
      },
      {
        title: "Sun-facing from the sea",
        body: "The whole tour stands south-south-east-facing from sea level to 1060 metres. That gives early sun and rapid softening in spring — and daily refreezing. On a 1050-metre flank the conditions have time to change between the shore and the cairn; what carries you at 300 metres in the morning can be wet snow at 900 at midday.",
      },
      {
        title: "Before you go",
        body: "Midtitinden is in the Salten forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes season months for this tour; the card's jan–apr is borrowed from the app's Lofoten tours at the same latitude, and the guide says so. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "11 m",
      endLabel: "1060 m",
      distanceLabel: "4.2 km",
      caption: "1050 metres of ascent and 4.15 km from Sagelva on highway 80 — sea level to 1060 metres, with 26.9 degrees as the steepest sustained stretch.",
    },
  },
  sandhornet: {
    intro:
      "1021 metres of ascent and 5.01 km from the shore at Horsdal — the island mountain south-west of Bodø that Fri Flyt calls one of the most beautiful coastal peaks in the area. The mountain stands in Gildeskål; the card carries Bodø the way Strandtinden carries Harstad, because that is where the day starts. The line stays under 30 degrees except for the last fifty vertical metres — and the steepest sustained stretch on the line, 32.5 degrees, is not up there at all — it is in the stairs between 26 and 51 metres, where the skis are on the pack anyway — and the source's hazard text is not about steepness but about the runout zones the line crosses in Stjerndalen.",
    ascent: [
      "From the farm at Horsdal, 10 metres, follow the marked path along the shore south-east for about a kilometre — 28 metres at its highest, with the sea right beside you. Then the path turns north-east and climbs steeply via the stairs; here the skis go on the pack. Where the stairs end the ground levels at about 190 metres — measured 189 — and the skis go back on.",
      "The stretch on into Stjerndalen is the tour's hazard text, and the source is verbatim: the valley runs in runout zones of avalanche flanks, especially the west and south-west flanks under Isvasstinden — the mountain just east, which the register confirms. Be alert on days with considerable danger and into spring; the flat is not outside the danger zone just because it is flat.",
      "From the valley hold north towards 450 — 'east of the Stjernelva the whole way', says the source — the line reads 463 — and then west in gentle ground north of point 592: 662 and 752 metres in steady climbing. The forest ended already at 267, so all of this is open mountainside with the view over Saltfjorden.",
      "Finally north up the summit flank: the 900–1000 band holds a mean 21.3 degrees and 22.9 as the steepest sustained stretch on the line. The source writes 'on the border of 30 degrees for the last 50 vertical metres', and it is the fall line it reads: south of the cairn the sweep measures 32.8 degrees in its steepest 60-metre window, 70–130 m out. The cairn stands at 993 metres, with the sea on three sides.",
    ],
    descent: [
      "The same way down, with room for easterly variants that give steeper skiing in the summit flank — the same 30-degree class, says the source. From the flat in Stjerndalen the danger zone applies again: cross the runout areas quickly and one at a time on days with considerable danger.",
      "The Ravika route on the north-east side is fully described by Fri Flyt — the forest road from the green garage, the bog stretches along the Ravikelva, a ramp to the summit ridge — but its descent has a 40-degree section between 920 and 840 metres and enters via the notch 300 m south-east of the top. It is the variant, not the normal route, and whoever chooses it has chosen a different tour.",
      "Down the stairs the skis go on the pack again, and the shore path takes you home to Horsdal — the whole tour gives back 38 vertical metres, so most of the day is clean climbing and clean skiing.",
    ],
    avalanche: [
      {
        title: "Stjerndalen",
        body: "The source's hazard note concerns the valley, not the summit: the tour runs in runout zones of avalanche flanks, especially the west and south-west flanks under Isvasstinden, and the warning applies to days with considerable danger and to spring. Runout zones are flat — that is the whole point of them — and the only tools are pace, spacing and choosing another day when the bulletin says so.",
      },
      {
        title: "The summit flank and the edges",
        body: "The last fifty vertical metres measure 22.9 degrees as the steepest sustained stretch on the line, and the source calls them 'on the border of 30 degrees'; the line's own steepest, 32.5, is down in the stairs. But Sandhornet is an island mountain with walls: the west side falls 59.0 degrees at its steepest only 110–170 m from the cairn, the north-west side 59.9 and the north side 61.8 degrees 70–130 m out. Towards the sea the edge is absolute; in fog, south is the way home — the line bears 189 degrees for the first five hundred metres, and Horsdal lies on bearing 200 from the cairn.",
      },
      {
        title: "Before you go",
        body: "Sandhornet is in the Svartisen forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes season months; the card's jan–apr is borrowed from the app's other Nordland tours, and the guide says so. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "10 m",
      endLabel: "993 m",
      distanceLabel: "5.0 km",
      caption: "1021 metres of ascent and 5.01 km from the shore at Horsdal — the stairs to Stjerndalen, gentle ridges, and 32.5 degrees in the last fifty vertical metres.",
    },
  },
  tortenviktinden: {
    intro:
      "1023 metres of ascent over 5.57 km from Neset by Flostrand to Tortenviktinden — from sea level to a thousand metres in a single line, with the whole Helgeland coast below. The tour is long rather than steep: the steepest hundred-metre band measures 18.6 degrees between 900 and 1000 m, and the steepest sustained stretch 23.7. It is the length and the unstable coastal season that decide the day.",
    ascent: [
      "From the farm Neset by Flostrand, 15 m, on the E12 coastal road. The register places Tortenviktinden in Lurøy while the approach from Flostrand lies in Rana — the mountain and the trailhead are in different municipalities. Visit Helgeland carries the same route at 5.2 km and 1,025 metres of ascent one way; the line measures 5.57 km and 1,023.",
      "The first kilometre is all but flat: the band from 0 to 100 m measures 6.7 degrees over 761 metres of ground and the band from 100 to 200 only 4.5 over 1,233 metres. The forest ends at 152 m by Kartverket's classes, with open ground from 158, and the treeline comes 1.66 km in. Fri Flyt says «rett opp til du kommer over skogen i nord-nordvestlig retning» — straight up until you clear the forest, heading north-north-west — and that is this stretch.",
      "Above the forest the line runs west along the ribs, as the source says. The bands from 200 to 500 m sit evenly between 12.3 and 13.2 degrees. Then comes the flatter section it describes as «noe ulendt, med små bekkedaler på tvers av fjellet», somewhat broken with small stream valleys across the mountain: the bands from 700 to 900 m measure 10.4 and 8.8 degrees over 1,170 metres of ground between them — the gentlest above the treeline, and the longest. This is where the tour feels long. A cluster of tarns sits here between 785 and 792 m, and the line passes south of the whole group: 0 metres on water, measured against OSM's water polygons.",
      "«Herfra ser du ikke selve Tortenviktinden, men toppen ligger rett bak det høyeste punktet du ser» — from here you cannot see Tortenviktinden itself, but the summit lies just behind the highest point you can see, says Fri Flyt. Behind it rises the last slope: the band from 900 to 1000 m measures 18.6 degrees, the steepest of the tour, and the steepest sustained stretch sits here — 23.7 degrees between 971 and 994 m, 5.39 km in, under two hundred metres before the cairn. 1028 m against a published 1027.",
    ],
    descent: [
      "Back down the same route. The steepest thing you ski is the 23.7 degrees just below the summit, and it eases the whole way out — which makes the last kilometres poling more than skiing.",
      "The north side is not to be touched. From the cairn it falls 43.3 degrees on average with 62.2 degrees as its steepest 60 metres 80 to 140 metres out, and the north-west 35.2 with 60.0 degrees 230 to 290 metres out. The route comes up from the south-east, which measures 15.3 degrees on average, and the west side is 11.9 — the contrast between the two sides of this summit is the one thing worth knowing about it in poor visibility.",
      "Fri Flyt notes that the mountain offers «mulighet for bratt rennekjøring», the chance of steep couloir skiing, and Visit Helgeland carries an alternative route of 4.3 km and 1,005 metres with a steeper ascent and less traversing. Neither is measured as a route of its own here.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Neither source gives a steepness field, and Fri Flyt does not grade the tour under KAST. The measurement fills the gap: no hundred metres of the line averages more than 18.6 degrees, and the steepest sustained stretch is 23.7 degrees between 971 and 994 m. Visit Helgeland grades the tour «Challenging, long», and it is the length the grade is about — 5.57 km and a thousand metres of ascent from sea level.",
      },
      {
        title: "Grøveldalen",
        body: "Fri Flyt's only named hazard is somewhere other than the route: «Grøveldalen har høye og bratte sva på begge sider som kan løsne, særlig om våren» — Grøveldalen has high, steep slabs on both sides that can release, especially in spring. The register carries Grøveldalen as a cirque 2.5 km south of the cairn, and the line does not go there. The warning stands here because it is the source's own and because the valley is part of the same mountainside — not because the route touches it.",
      },
      {
        title: "The north side",
        body: "From the cairn the north side falls 43.3 degrees on average over the first 800 metres, with 62.2 degrees as its steepest 60 metres 80 to 140 metres out; the north-east measures 33.3 with 68.3 degrees 50 to 110 metres out and the north-west 35.2 with 60.0 degrees. The ascent comes from the south-east at 15.3 degrees. Visit Helgeland points out that the terrain is «mostly free of trees», and on a summit where two sides differ by thirty degrees it is precisely the lack of reference points that makes the difference dangerous.",
      },
      {
        title: "Before you go",
        body: "Tortenviktinden lies in the Svartisen forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes season months: Fri Flyt writes that «den kystnære beliggenheten … gjør også at sesongen er ustabil med varierende snøforhold», the coastal position makes the season unstable with varying snow conditions, and Visit Helgeland carries the main route as a winter tour with the alternative available after Easter. The card's feb–mai is therefore editorial. Bring a transceiver, probe and shovel. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "15 m",
      endLabel: "1028 m",
      distanceLabel: "5.6 km",
      caption: "1023 metres of ascent over 5.57 km from Neset, with the steepest ground — 23.7 degrees between 971 and 994 m — in the final rise, barely 200 metres before the cairn.",
    },
  },
  tomskjevelen: {
    intro:
      "951 metres of ascent and 3.86 km from the field at Forsland — on an island. Tomskjevelen stands in the middle of the sea on Tomma, with the ferry from Nesna as the only way to the start, and Fri Flyt writes that 'many consider Tomskjevelen one of the very finest peaks on the whole Helgeland coast'. The register spells it Tommskjevelen and keeps its point on the west knoll at 756 metres; the top itself — 922 — lies 330 m east, and that is where the line goes. The track is kind — steepest 100-metre band 21.8 degrees between 800 and 900 metres, steepest sustained stretch 27.9 — but the mountain around it is not, and the season is unstable with varying snow conditions, as the source itself says.",
    ascent: [
      "Take the ferry from Nesna to Tomma and drive towards Forsland; Forslandsvegen ends at the farm, and you park at the field before Forslandsvatnet, as the source says — the field by the path start reads 47 metres. Check the timetable both ways: the ferry is part of the tour.",
      "The path west is mapped and leads up to the shelf where Forslandsvatnet lies, at 148 metres. The tarn is natural, but it sits low on an island in the sea, and the ice cannot be assumed: the line goes around the north shore on land — 161, 177 and 150 metres at the pins — and also passes north of the small tarns and Tinnvatnet. It is measured: 0 metres of the line stand on water.",
      "From the bog north-west of the lake the north-west-trending ridge begins, as the source says — all the way to the top. The ridge is even: 283 at the foot, 492, 656, 768, 843 and 884 metres on the way up, with the steepest 100-metre band — a mean 21.8 degrees — between 800 and 900. The fall line in the middle section holds 32–33 degrees; the track switchbacks gentler.",
      "The cairn stands at 922 metres with sea on every side — the Atlantic to the west, the Svartisen ice cap to the east. And every side is real: from the top all eight sectors fall at a mean of 31 to 44 degrees, with 69.4 degrees as the steepest window to the north-east. The summit is a horn, and in fog the ridge you came up is the only way home.",
    ],
    descent: [
      "The normal descent follows the same route as the ascent, as the source says — the ridge down, around the lake on land, and the path to the field. The tour gives back 74 vertical metres in total, most of it in the broken ground around the tarns.",
      "Fri Flyt also mentions the east-facing descent in the hollow that collects snow — its fact box carries no aspect at all, and the measured bearing down the ridge reads 134 to 147 degrees. The hollow is the mountain's best snow store and its steepest ground at once: the east sector falls at a mean 34.4 degrees with 64.1 as the steepest window. Whoever chooses the hollow has chosen the snow assessment that comes with it.",
      "Remember the ferry: it sets the day's timeframe, and it leaves from the shore — the whole descent aims at the sea, and this is the only tour in the app where 'all the way down' means all the way down to a ferry quay.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt publishes neither a KAST rating nor a steepest point for this tour, and the measurement stands alone: 27.9 degrees as the steepest sustained stretch, 21.8 as the steepest 100-metre band, between 800 and 900 metres. The fall line in the middle of the ridge holds 32–33 degrees — the track choice is gentler than the slope, and it should stay that way.",
      },
      {
        title: "The horn",
        body: "From the cairn all eight sectors fall at a mean of between 31 and 44 degrees: north-east 69.4 degrees in the steepest window, north 63.7, east 64.1, north-west 61.4. There is no gentle way off the top other than the ridge you came up — in fog the compass bearing south-east along the ridge is absolute — the line bears 134 to 147 degrees down.",
      },
      {
        title: "The sea and the snow",
        body: "The source writes that 'like other coastal peaks in Helgeland the season is unstable and the snow conditions varying' — in its intro, not in its fact box, and it is the whole climate story: a 922-metre mountain surrounded by sea gets its snow in squalls and loses it in thaws, and the east-facing hollow that collects snow collects it from the wind — wind slab over coastal crust is the local combination. Assess the snowpack from the ferry: you can see the whole mountain from the sea.",
      },
      {
        title: "Before you go",
        body: "Tomskjevelen is in the Helgeland forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes season months; the card's jan–apr is borrowed from the app's other Nordland tours, and the guide says so. The ferry from Nesna is the only access — check the timetable. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "45 m",
      endLabel: "922 m",
      distanceLabel: "3.9 km",
      caption: "951 metres of ascent and 3.86 km from Forsland on Tomma — around Forslandsvatnet on land, and the north-west ridge to the horn at 922.",
    },
  },
  lukttinden: {
    intro:
      "1129 metres of ascent over 3.99 km from the farm at Kammen to Lukttinden — the biggest climb of this round, and a mountain ut.no calls «av mange ansett som den flotteste og mest spektakulære toppen i Vefsn», held by many to be the finest and most spectacular summit in Vefsn. The line climbs unusually evenly: every hundred-metre band from 500 m upward measures between 17.4 and 19.6 degrees, and the steepest sustained stretch is 28.1. The hazard lies in the edges, and in which way you take up onto the ridge.",
    ascent: [
      "From the road end at the farm at Kammen, 230 m. Fri Flyt says «Følg traktorveien videre fra parkeringen i omtrent 300-400 meter» — follow the tractor road on from the parking for some 300 to 400 metres — and ut.no the same: the track starts on the forest road by the farm. The band from 200 to 300 m measures 11.0 degrees and the band from 300 to 400 just as gently over 586 metres of ground.",
      "The forest ends at 379 m by Kartverket's classes, with open ground from 386, and the treeline comes 0.82 km in. Above it the line runs into the valley toward the stream between Nordtinden and Lukttinden — ut.no puts it at «ca 400moh», and the line passes there.",
      "Here the source divides, and it is the most important decision on the mountain. ut.no gives two ways onto the ridge: alternative 1 straight up the steep slope, «ganske bratt, med opptil 40 grader helning» — quite steep, with up to 40 degrees — and alternative 2 further into the valley to the south-east and then «den noe mindre bratte ryggen opp til høyre, som er en vanlig rute sommerstid… opp i 30 grader», the somewhat less steep ridge up to the right, a common summer route, up to 30 degrees. **This line takes alternative 2.** The steepest sustained stretch of the whole tour sits in that step: 28.1 degrees between 633 and 650 m, 1.88 km in — inside what ut.no gives for alternative 2, and well under the 40 degrees of alternative 1. He warns himself that alternative 2 carries «overhengende skavler med utløpsområde mot denne ryggen», overhanging cornices with a runout toward that ridge.",
      "Up on the ridge — ut.no says «ca 720 moh» — the tour is simple and long. The bands from 700 m upward measure 18.3, 18.2, 18.8, 18.1, 19.6 and 18.0 degrees; the steepest is 19.6 between 1100 and 1200 m. ut.no describes the same evenness: «Det er jevnt bratt oppover, mellom ca 20-30 grader.»",
      "The cairn at 1348 m. That is ut.no's figure, not Fri Flyt's — Fri Flyt gives 1342, and the summit search resolves 1347.8 on the register point. ut.no mentions a final steep slope «på ca 35 grader for å nå toppen», often «ganske isete»; the routed line finds 35 degrees nowhere, and the highest band, 1300 to 1400 m, measures 18.5. That is a real disagreement between source and line, and it stands here because it concerns the last few metres.",
    ],
    descent: [
      "Back down the same ridge. ut.no is clear about what the descent is for: «I de svakt konkave helningene som følger nesten hele fjellsiden nedover kan det samles mye fin snø. Siden er også nordvendt, som betyr at du kan være heldig og nyte puddersnø godt ut i juni» — the faintly concave slopes running almost the whole mountainside can gather a lot of good snow, and the side is north-facing, so with luck there is powder well into June. The card's aspect is NW, measured from the line's own descent, which agrees that the side faces north.",
      "Two edges are to be kept away from. On the way up: «Unngå å gå på kanten til høyre (SV), her er det stupbratt» — avoid the edge to the right, it is sheer. The west sweep from the cairn measures 32.2 degrees on average with 38.8 degrees as its steepest 60 metres 110 to 170 metres out. And at the top: «Vær obs på skavlen som dannes på nordøstsiden av varden. Skavler bryter 45 grader i snøen og kan dra deg med selv om du står på fast grunn. Det er stup på begge sider.» The north-east sweep measures 19.8 degrees on average — but 63.4 degrees as its steepest 60 metres only 60 to 120 metres out. The average is what deceives; the edge is what matters.",
      "The gentlest sector from the cairn is the south-west at 9.7 degrees and the south at 13.3 — but that is not the way home, and the east and south-east fall 35.0 and 31.3 degrees on average with 65.5 and 68.8 degrees close in to the cairn.",
    ],
    avalanche: [
      {
        title: "The route and the two alternatives",
        body: "Fri Flyt gives no steepness field for this tour and does not grade it under KAST; he says only that «Toppen av Lukttinden er ikke omkranset av bre og er dermed en teknisk enklere tur enn Okstindene» — the summit is not ringed by glacier and is therefore technically easier than Okstindene. ut.no is the strict source, and he is unambiguous: «På grunn av bratthet bør den ikke gåes ved skredfare» — because of the steepness it should not be done when there is avalanche danger. The corridor here follows his alternative 2, the gentler ridge — steepest sustained stretch 28.1 degrees between 633 and 650 m — and not alternative 1, which is his own drawn track and «up to 40 degrees».",
      },
      {
        title: "The cornice at the cairn",
        body: "«Vær obs på skavlen som dannes på nordøstsiden av varden. Skavler bryter 45 grader i snøen og kan dra deg med selv om du står på fast grunn. Det er stup på begge sider.» Those are ut.no's words — watch the cornice on the north-east side of the cairn; cornices fracture back at 45 degrees into the snow and can take you with them even standing on firm ground; there are cliffs on both sides. The measurement stands behind them: the north-east sweep holds 19.8 degrees on average over 800 metres, but 63.4 degrees in its steepest 60, 60 to 120 metres from the cairn. A cornice that fractures backward takes firm ground with it, and an average of nineteen degrees says nothing about that.",
      },
      {
        title: "The ice at the end",
        body: "ut.no describes a final slope «på ca 35 grader for å nå toppen» that is «often quite icy». The routed line does not measure 35 degrees anywhere — the highest band, 1300 to 1400 m, holds 18.5 degrees, and the steepest sustained stretch of the whole tour is 28.1 lower down. The disagreement is recorded rather than explained away: the source has walked the mountain and the line is computed, and the last stretch is where the two do not agree.",
      },
      {
        title: "Before you go",
        body: "Lukttinden lies in the Helgeland forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. The season of April to June is ut.no's own, and he files the tour as a ski tour; Fri Flyt has no season field for it. Bring a transceiver, probe and shovel. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "230 m",
      endLabel: "1348 m",
      distanceLabel: "4.0 km",
      caption: "1129 metres of ascent over 3.99 km from Kammen, with the steepest ground — 28.1 degrees between 633 and 650 m — in the pull onto the ridge, 2.1 km before the cairn.",
    },
  },
  vassfjellet: {
    intro:
      "560 metres of climbing and 4.92 km from Markavollen to the cairn at 711 m — the closest ski tour to Trondheim. The steep ground sits together between 500 and 700 m: 11.5 degrees from 500 to 600 and 12.3 from 600 to 700, which is the steepest hundred-metre band. The steepest sustained step is 23.0 degrees between 251 and 270 m, and that is also the steepest the whole line measures.",
    ascent: [
      "Start at the car park at Markavollen, 184 m. Ut.no states a parking charge, and the terrain model reads the plot at 184 m — exactly the starting height the description gives. Ut.no sends you along the ski tracks «marked S, then Ø and S again»; the line on the map is the terrain line through that same network of tracks, not the track itself — 2205 of 4744 metres lie more than 50 metres from a mapped trail, with the largest gap 175 metres. The first half is flat for a summit tour: the band from 300 to 400 m measures 5.2 degrees over 1036 metres of ground, and 400 to 500 m 3.2 degrees over 1710.",
      "At 445 m the line brushes the edge of Lomtjønna. Vassfjellhytta sits at 507 m, and right after it the climbing starts: 11.5 degrees from 500 to 600 m over 495 metres of ground, and the line's steepest step measures 23.0 degrees between 251 and 270 m. The forest lets go at 586 m, and from 594 the ground is open.",
      "Above the treeline it holds 12.3 degrees from 600 to 700 m, and you meet the service road ut.no puts you on — Vassfjellvegen, which lies 16 metres from the line and runs all the way up to Melhus hovedsender, the communications mast standing 131 metres from the cairn at 709 m. The last stretch turns north. The cairn itself stands at 711, and the terrain model measures it at 710.9.",
    ],
    descent: [
      "Back down the same way. The first 200 metres off the cairn bear 255 degrees — west — down to 676 m, and 500 metres down bears 249. That is the flank the card carries: the west side measures 12.0 degrees on average over 400 metres with a 26.2-degree window 230 to 290 metres out, and 12.3 degrees on average when the sweep runs out to a kilometre.",
      "Ut.no warns of «various steep pitches both below and above the treeline», and the sweep says where they are. North-west has the steepest single window: 33.3 degrees 190 to 250 metres out, against a mean of 13.8. South-east is the most consistently steep side at 13.9 degrees mean with 26.7 in its steepest window, and west measures 12.0 and 26.2. North-east, toward the lifts, measures 3.9 — but what you come down into there is the piste at Vassfjellet ski centre, not the mountain.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "541 metres of climbing where the bands below 500 m measure 3.2 and 5.2 degrees, and the band from 500 to 600 measures 11.5 over 495 metres of ground. The steepest point on the whole routed line is 23.0 degrees, between 251 and 270 m, and the route gives back 33 metres over 4.92 km. It is a marked-track tour with one steep pitch in it, not a flank ascent. The routed line climbs 541 metres over 4.74 km against ut.no's stated 526 and 6.7 km: the vertical agrees, the kilometres do not. The marked track winds south, east and south again, and the line on the map takes the shortest way through the same points.",
      },
      {
        title: "The terrain off it",
        body: "The mountain has steep sides; they just are not where the track goes. Within 400 metres of the cairn, north-west measures 33.3 degrees in its steepest 60-metre window, south-east 26.7 and west 26.2. That is high enough and steep enough for a single slope to go, and those are exactly the lines that tempt when you are standing on top with skis on.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sør-Trøndelag at varsom.no. Sør-Trøndelag is a B region: it is forecast only at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "184 m",
      endLabel: "711 m",
      distanceLabel: "4.9 km",
      caption: "541 metres of climbing and 4.74 km from Markavollen past Vassfjellhytta at 507 m, with the forest letting go at 586 and open ground from 594 m.",
    },
  },
  krakfjellet: {
    intro:
      "471 metres of climbing and 9.60 km from Håen to the highest point in Trondheim municipality. It is a long, gentle day: the band from 400 to 500 m measures 1.2 degrees over 4505 metres of ground, and the steepest place on the whole line is 16.1 degrees between 467 and 480 m.",
    ascent: [
      "Start at the car park by Håen, 411 m — a toll road from Lundamo, normally ploughed the 18 kilometres in. The ploughing stops here; the road does not. Lundadalsvegen carries on unploughed for 2.6 kilometres east along the north side of the lake, and that is the forest road ut.no sends you along — «the forest road or the shoreline N on Håen due E». The line on the map follows the road.",
      "The reason it does is lying next to it. The water surface of Håen measures 433 m and is classed as a regulated lake: the reservoir is drawn down every winter, the car park sits 22 metres below a full surface, and ut.no tells you to keep off uncertain ice along the edge. The road stays on land the whole way, from 411 m at the car to 435 at its eastern end.",
      "After barely three kilometres you reach Kråklivollen, 452 m, where the road ends and the route climbs into the forest, up Kråklia and west of Samsjølia. The forest lets go at 570 m, and from 574 you are in the open. The band from 400 to 500 m measures 1.2 degrees over 4505 metres of ground — here it is the distance, not the climbing, that is the tour.",
      "Rundtjønnin sits at 526 m, and it is the check that the route runs where the description says: ut.no gives 525. On north and north-east you follow ridges or hollows in the same direction, depending on the snow, until the route turns north and north-west toward the summit. The bands above Rundtjønnin measure 2.4, 3.6, 6.0 and 5.7 degrees, and the last of them covers only 149 metres of ground.",
      "The cairn stands at 815 m. Kråkfjellet became the highest point in Trondheim municipality after the merger with Klæbu, and published figures say 817; the terrain model reads 814.9 at the high point, and the card carries the measurement.",
    ],
    descent: [
      "Back down the same way. The first 200 metres off the top bear 202 degrees, down to 792 m, and 500 metres down bears 199. The car park lies 7.4 km away, on a bearing of 225 degrees, so most of the way back is walking rather than skiing — and the last three kilometres are the forest road again.",
      "The sweep finds no steep side on this mountain: the steepest 60-metre window in any direction is 21.8 degrees to the east, in the window 260 to 320 metres out, with north-east at 13.1 degrees on average and north at 2.0. What ut.no warns about is something other than avalanches — «high cornices on the lee side» that you can fall off in flat light when crossing the ridges here.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Nine and a half kilometres where the bands measure 1.2, 2.4, 3.6, 6.0 and 5.7 degrees, and the steepest sustained step is 16.1 degrees between 467 and 480 m. The route gives back 67 metres and climbs 468 against ut.no's stated 519 and «about 140» given back. The rest of the difference is in the choice of line between the ridges, which the description itself leaves to the snow and the going.",
      },
      {
        title: "The terrain off it",
        body: "The steepest measurement around the summit is 21.8 degrees to the east. North is close to flat, 2.0 degrees on average over 400 metres. The two things that can go wrong here are therefore not avalanches as such: the cornices ut.no describes, which are a fall problem in flat light, and the ice on Håen, which is regulated and drawn down every winter. The route is laid on the forest road rather than out on the reservoir, but the shoreline is right beside the line the whole way.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sør-Trøndelag at varsom.no. Sør-Trøndelag is a B region: it is forecast only at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "411 m",
      endLabel: "815 m",
      distanceLabel: "9.6 km",
      caption: "471 metres of climbing and 9.60 km from Håen by Kråklivollen at 452 m and Rundtjønnin at 526, with the last 149 metres of ground above 800 m.",
    },
  },
  rensfjellet: {
    intro:
      "699 metres of climbing and 11.33 km from Håen to the highest point in Melhus, with 168 of those metres given back along the way. The climbing comes last: the steepest hundred-metre band is 11.6 degrees from 700 to 800 m, and the steepest sustained step 19.7 degrees between 663 and 679.",
    ascent: [
      "Start at the car park by Håen, 411 m — the same first three kilometres as Kråkfjellet. The ploughing stops at the car, but Lundadalsvegen does not: it carries on unploughed for 2.6 kilometres east along the north side of the lake, and the line follows it. The water surface of Håen sits at 433 m, the reservoir is drawn down every winter, and ut.no tells you to keep off uncertain ice along the edge.",
      "Kråklivollen sits at 452 m, where the road ends. On up Kråklia and west of Samsjølia, past Rundtjønnin at 526 m. Ut.no gives 525 for this tarn and the terrain model reads 526 — that is the check that the corridor follows the described route. The bands to here measure 1.2 and 1.4 degrees, over 4460 and 4096 metres of ground.",
      "Then the route crosses Oksdalen at 532 m. The point is not named in any source: the valley is registered with a representation point 3.95 km away on a bearing of 15, north-north-east, and the crossing is read off the terrain model as the low line running south from it. The forest lets go at 562 m, and from 569 you are in the open.",
      "After Oksdalen the last four kilometres begin. The band from 600 to 700 m measures 6.1 degrees, and this is where the steepest sustained step sits — 19.7 degrees between 663 and 679 m. Above it, 700 to 800 m measures 11.6 degrees over 495 metres of ground, then it eases to 5.7 and 6.5 toward the cairn at 942 m. Rensfjellet is a boundary summit between Melhus, Midtre Gauldal and Selbu; ut.no notes that it «is only 2.1 km short toward N-NW of including Trondheim in that club too».",
    ],
    descent: [
      "Back down the same way, westward: the first 200 metres off the top bear 253 degrees down to 920 m, and 500 metres down 254. The car park lies 10.2 km away, on a bearing of 254 degrees. Ut.no gives one alternative — dropping toward Samsjøen after Oksdalen — and attaches two conditions: that the going outside the groomed tracks is good, or that you have a track to follow.",
      "The sweep finds no steep side within 400 metres of the cairn: east measures 11.0 degrees on average with 17.8 in its steepest window, south-east 3.4 and north-west 2.5. Ut.no's «steep single pitches high enough to slide» sit further out than the sweep reaches, and the description itself says they can be avoided.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Eleven kilometres where the two long bands measure 1.2 and 1.4 degrees over four kilometres of ground each, and all the climbing sits in the last four. The steepest sustained step is 19.7 degrees between 663 and 679 m, the steepest hundred-metre band 11.6 from 700 to 800. The route gives back 168 metres against ut.no's stated «about 130» — the same shape of ground, ridges and hollows that have to be crossed.",
      },
      {
        title: "The terrain off it",
        body: "Within 400 metres of the cairn the steepest measurement is 17.8 degrees to the east. What makes the tour demanding is the length and the navigation: eleven kilometres over bog, forest road and ridges, 168 metres given back on the way in and the same again on the way out. Ut.no warns of cornices on the lee side, which are a fall problem in flat light, and of single pitches that exist but can be gone around. Down at the start the hazard is the ice on a drawn-down reservoir, and the route is laid on the forest road to stay off it.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sør-Trøndelag at varsom.no. Sør-Trøndelag is a B region: it is forecast only at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "411 m",
      endLabel: "942 m",
      distanceLabel: "11.3 km",
      caption: "699 metres of climbing and 11.33 km from Håen by Kråklivollen at 452 m, Rundtjønnin at 526 and the crossing of Oksdalen at 532, with the forest letting go at 562 m.",
    },
  },
  snota: {
    intro:
      "1268 metres of climbing and 10.22 km from Gråhaugen to the highest mountain in northern Trollheimen. The route runs in avalanche terrain from Litj-Snota up, crosses 404 metres of glacier between 1364 and 1463 m, and the summit flank falls 48.1 degrees to the east.",
    ascent: [
      "Start at the car park by the dam on Gråsjøen, 495 m — 15 km of toll road up Folldalsvegen, paid by card. Follow the line of the road along the lake until the summer path slants up the hillside, and not earlier: ut.no warns that avalanches run from the snowfield on Gråhaugfjellet, and that in some years they reach the water.",
      "Up the hillside south-south-west, through 686 m, with bands of 10.3, 6.3 and 7.0 degrees. Then it flattens onto the plateau east of Midtveggen, 931 m: the band from 800 to 900 m measures 3.2 degrees over 1979 metres of ground, and 900 to 1000 measures 2.2 over 2250. Here the route gives height back, from 931 down to Svartvatnet at 888 m — ut.no gives «about 100» metres lost on the way up, and the routed line gives back 95.",
      "From Svartvatnet you come to the foot of Litj-Snota and round it on the east, 1026 m — the last 90 metres in go across a small unnamed tarn at 1024. From here up you are in runout zones and, in shorter sections, in start zones over 30 degrees, which ut.no says cannot be avoided. The bands rise to 7.1, 15.7 and 15.3 degrees.",
      "At 1352 m it flattens, and the steep slope straight ahead to the west is the glacier. Kartverket classes eleven points on the line as glacier terrain, from 1364 to 1463 m, and the stretch measures 404 metres — with two bare points at 1414 and 1421 m in the middle of it, where the ice is broken. The points immediately before and after, 1369 and 1471 m, are open ground. Ut.no gives «from about 1380 m ... for about 500 m» and asks you to check with locals that there is enough snow. The steepest sustained step of the whole tour sits here: 28.9 degrees between 1414 and 1434 m.",
      "Above the glacier, at 1516 m, you come onto the summit flank, and the route turns south-west, south and finally south-south-east to the high point at 1668 m.",
    ],
    descent: [
      "Back down your own track — ut.no calls it the best choice in most cases, and adds that the danger of wet loose-snow avalanches rises through the day in warm spring weather. The first 200 metres off the top bear 320 degrees, north-west, down to 1653 m, and 500 metres down 328: the route runs back along the summit flank before it drops east down the glacier. The car park lies 8.0 km away, on a bearing of 13 degrees.",
      "It is worth knowing why that first move goes north-west. East of the high point measures 48.1 degrees on average over 400 metres with a 57.9-degree window 130 to 190 metres out — that is «the summit flank is precipitous to the east» in numbers. South and south-east measure 42.0 and 36.5 on average, with windows of 71.4 and 71.0 degrees only 10 to 70 metres out, and north-east 42.0 with 64.2. West and north-west, where the route comes up and goes down, measure 14.8 and 9.4.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "1268 metres of climbing and 10.22 km, with 95 given back. Ut.no lists the route as avalanche terrain — «both start zones over 30 degrees and runout zones that cannot be avoided» — and the terrain class as KAST 2, challenging. The steepest hundred-metre band on the routed line is 15.7 degrees from 1100 to 1200 m and the steepest step 28.9 degrees between 1414 and 1434, but those figures describe the skin track, not the sides it runs beneath.",
      },
      {
        title: "The terrain off it",
        body: "The summit flank to the east measures 48.1 degrees on average with 57.9 in its steepest window, and south and south-east carry windows of 71.4 and 71.0 degrees only 10 to 70 metres out from the high point. The other one is the snowfield on Gråhaugfjellet, down at the start: ut.no writes that avalanches from it reach the lake in some years, and that the tour should not be attempted when large naturally triggered avalanches are likely on easterly slopes.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Trollheimen at varsom.no. Trollheimen is an A region and is forecast every day in season. The glacier between 1364 and 1463 m needs enough snow, and ut.no asks you to check with locals beforehand. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "495 m",
      endLabel: "1668 m",
      distanceLabel: "10.2 km",
      caption: "1268 metres of climbing and 10.22 km from Gråhaugen by the plateau east of Midtveggen at 931 m, Svartvatnet at 888 and the flat at 1352, with the glacier from 1364 to 1463 m.",
    },
  },
  storbekkhoa: {
    intro:
      "897 metres of climbing and 5.92 km from Storli to the cairn at 1504 m. The ascent is gentle — the steepest hundred-metre band is 15.8 degrees — and the south-east face right by the top is not: it measures 34.1 degrees on average with a 46.9-degree window 20 to 80 metres out from the cairn.",
    ascent: [
      "Start at the car park by Storli, 623 m — pay and display, 30 kroner in the box, and tagged for skiing. Ut.no: «From Storli parking you put your skis on at the car.» Head straight north toward Storbekkdalen through the birch slope. Here the sources part company: ut.no puts the route on the right-hand side of Veslebekken, while Fri Flyt writes that it follows Storbekken north from Storli through the birch forest. The line follows the mapped path, which does a little of both — it crosses Veslebekken down in the birch slope and stays 7 to 967 metres from Storbekken on the way up the valley. The band from 700 to 800 m is the steepest of the whole tour, 15.8 degrees over 360 metres of ground, and the steepest sustained step on the line sits just below it: 25.8 degrees between 661 and 683 m.",
      "The forest lets go at 912 m, and from 915 you are in open ground and bog. The line crosses Storbekken for the first time already at 644 m, then braids back over it eight more times where the stream meanders across the flat valley floor between 968 and 997 m — the band from 900 to 1000 measures 3.4 degrees over 1703 metres of ground. This is where the route swings west up toward the ridge.",
      "The ridge west of the stream sits at 1211 m, and the band from 1000 to 1100 m up toward it measures 12.6 degrees. On north along the ridge until the steep south-east face stands in front of you — then you go a stretch further west and up through the col at 1313 m.",
      "From the col the route follows gentle ground in a half circle to the cairn at 1504 m, where the box with the summit book stands. The bands here measure 9.7 and 15.7 degrees. The sources disagree about the climb — Fri Flyt gives 600 metres, ut.no 900 — and the routed line climbs 893 from a car park the terrain model reads at 623 m. Fri Flyt's own GPS position for the high point lands 27 metres from the cell the summit search climbs to.",
    ],
    descent: [
      "Back down the same way, and the first metres go west, not toward the car: the first 200 metres off the cairn bear 276 degrees, down to 1458 m, and 500 metres down 236. The car park lies 4.2 km away, on a bearing of 170 degrees. The half circle has to be finished before the route turns south, and in flat light that detail is what matters here.",
      "The south-east face is the one Fri Flyt warns about, and the sweep confirms it: 34.1 degrees on average over 400 metres with a 46.9-degree window 20 to 80 metres out from the cairn. South measures 25.5 with the same 46.9 in the window 30 to 90 metres, and east 24.9 with 35.5. North-west — where the route comes up — measures 3.7 degrees on average, with 7.7 as its steepest window.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "897 metres of climbing where the steepest hundred-metre band is 15.8 degrees, from 700 to 800 m, and the steepest sustained step 25.8 degrees between 661 and 683. Fri Flyt writes that the whole ascent is in terrain under 30 degrees and files the tour as KAST 1. The route gives back 16 metres over 5.92 km.",
      },
      {
        title: "The terrain off it",
        body: "Fri Flyt lists one runout zone and «the steep south-east side of the summit. There can be nasty cornices here.» The sweep measures that side at 34.1 degrees on average and 46.9 in its steepest window 20 to 80 metres out, and the south side at 25.5 with the same 46.9 in the window 30 to 90. Skiing down toward Storbekkdalen is steeper than the ascent, and Fri Flyt calls it avalanche terrain.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Trollheimen at varsom.no. Trollheimen is an A region and is forecast every day in season. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "623 m",
      endLabel: "1504 m",
      distanceLabel: "5.9 km",
      caption: "897 metres of climbing and 5.92 km from Storli up Storbekkdalen at 1000 m, over the ridge west of Storbekken at 1211 and through the col at 1313 m.",
    },
  },
  okla: {
    intro:
      "1025 metres of climbing and 5.99 km from Dalen in Storlidalen to Snydda, 1582 m — the high point of the Okla massif, where the cairn and the summit book stand. The steepest hundred-metre band is 19.8 degrees from 700 to 800 m, and the steepest step 26.1 degrees between 1481 and 1499. The north side is another matter: 44.7 degrees on average to the north-west.",
    ascent: [
      "Start at the car park in Dalen, 599 m — a paid plot tagged for skiing, down by Storlidalsvegen. Fri Flyt describes the same start as «the bridge between Dalsvatnet and Ångårdsvatnet»; the bridge is 300 metres away. It climbs from the first step: 11.8 degrees from 600 to 700 m and 19.8 from 700 to 800, through the birch forest that lets go at 961 m.",
      "On at a gentler angle toward Korgtjønna, 1151 m. The bands measure 15.3 and 12.8 degrees, and the band from 1000 to 1100 m measures 15.1 degrees over 405 metres of ground.",
      "Above Korgtjønna it flattens — 3.4 degrees from 1100 to 1200 m over 1800 metres of ground — and the route turns west. The line crosses the tarn itself, 720 metres at 1151 m; that is where ut.no sends you, but it is a lake, and it is to be judged as one.",
      "Then you round Mjølkskåla. Ut.no puts it precisely — «round the rim with the lake Mjølkskåla below you» — and the line does that: over the shoulder east of the water at 1275 m, on over the rim north of it at 1290, and up to 1324 m before the final climb. The water sits at 1277 m and stays below you.",
      "The last climb measures 19.5 degrees from 1400 to 1500 m and 17.0 above that, with a step of 26.1 degrees between 1481 and 1499 m. The summit is called Snydda in the place-name register and measures 1582.3 m; ut.no publishes 1580 and Fri Flyt 1564, and the card carries the measurement. The point registered as Okla lies 2.4 km due west, on a bearing of 267, and is 1458.8 m — the mountain is called Okla, but the cairn stands on Snydda.",
    ],
    descent: [
      "Back down the same way, and the first move off the cairn goes east along the ridge, not down: the first 200 metres bear 73 degrees down to 1510 m, and 500 metres down 71. The car park lies 3.4 km away, on a bearing of 167 degrees.",
      "The reason that move matters is the north side. North-west measures 44.7 degrees on average over 400 metres with a 57.1-degree window 200 to 260 metres out, and north 43.6 with 50.9. That is where Fri Flyt's alternative descent toward Gjevilvatnet goes, and they call it «very steep and serious» — it also ends a long way from the car. South-west, along the Okla ridge, measures 3.4 degrees on average: that is the flat summit plateau the descriptions mention, and in flat light the navigation is the problem.",
      "The south side is the one the card carries, and it is not gentle either: south measures 27.4 degrees on average with 34.0 in its steepest window, south-east 33.1 with 39.4. Fri Flyt on the side you climb: «This is a side where a lot of snow collects, so assess the avalanche danger carefully», and on the gully along Sandbekken that it «should only be skied in very stable conditions».",
    ],
    avalanche: [
      {
        title: "The route",
        body: "1025 metres of climbing where the steepest hundred-metre band is 19.8 degrees from 700 to 800 m and the steepest sustained step 26.1 degrees between 1481 and 1499. The route gives back 41 metres. Fri Flyt writes that Okla is not a steep ski tour, and the terrain measurement agrees — it is the amount of snow on the south side, not the angle, that is the problem here.",
      },
      {
        title: "The terrain off it",
        body: "The south side, which is both the ascent and the descent, measures 27.4 degrees on average with 34.0 in its steepest window, and south-east 33.1 with 39.4 — enough to release, and Fri Flyt says itself that a lot of snow collects here. North and north-west are a different part of the mountain altogether: 43.6 and 44.7 degrees on average, with windows of 50.9 and 57.1, and you end up at Gjevilvatnet instead of at the car.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Trollheimen at varsom.no. Trollheimen is an A region and is forecast every day in season. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "598 m",
      endLabel: "1582 m",
      distanceLabel: "6.0 km",
      caption: "1025 metres of climbing and 5.99 km from Dalen by Korgtjønna at 1151 m and the rim north of Mjølkskåla at 1290, with the forest letting go at 961 m.",
    },
  },
  storhornet: {
    intro:
      "936 metres of climbing and 5.01 km on the marked winter route from Bree to the stone shelter at 1589 m. Even is the word, and the measurement agrees: no hundred-metre band exceeds 13.1 degrees, the steepest sustained step is 20.5 degrees between 1463 and 1480 m, and the route gives back not a single metre. The steep ground on this mountain is on the north-east side, behind the summit.",
    ascent: [
      "Start at the paid car park by Bree, 653 m — ten spaces, tagged for both skiing and walking, and Fri Flyt sends you there with «follow the road that goes left after the shop and drive about 1.3 kilometres». From here to the cairn the line follows the mapped winter route, a continuous ski-touring trail of 5.13 km ending 25 metres from the summit; the largest gap between the line and the trail is 166 metres.",
      "The trail is cut through the forest and winds up through the cabin field at Hornlia — 113 cabins lie within 300 metres of the line. The bands measure 8.6 and 9.9 degrees from 600 to 800 m. The forest lets go at 921 m, and from 931 you are on open mountain.",
      "Above the treeline the trail carries on north-west, and it holds that course the rest of the way. The bands measure 12.4, 11.4, 9.6, 10.7, 11.8 and 9.6 degrees going up, and the steepest of them all is 13.1 degrees from 1400 to 1500 m, over 465 metres of ground. The steepest sustained step of the whole tour sits here too: 20.5 degrees between 1463 and 1480 m. It is a climb without a single kick.",
      "At 1589 m stands the stone shelter from 1946, with a summit book. This is the best-checked summit of the round: the terrain model gives 1589.0 m against a published 1589, and Fri Flyt's own GPS position for the summit lands 10 metres from that point. The line climbs 936 metres against ut.no's stated 928 and Fri Flyt's 900, and measures 4.84 km against ut.no's 5.2 and Fri Flyt's 5.3.",
    ],
    descent: [
      "Back down the same way — it is the line Fri Flyt recommends. The first 200 metres off the shelter bear 153 degrees, down to 1567 m, and 500 metres down 145. The car park lies 4.7 km away, on a bearing of 135 degrees, so the descent follows the ascent the whole way.",
      "The steep ground on this mountain is behind you when you stand at the shelter. North-east measures 30.7 degrees on average over 400 metres, with a 46.2-degree window only 10 to 70 metres out; north 22.2 with 37.7 in the window 20 to 80, and east 23.1 with 34.4. South and south-west, where the trail comes up, measure 6.0 and 0.4 degrees on average.",
      "Fri Flyt's own hazard note points south: «If you choose to seek out the steep terrain around Omnråa south of the summit you must account for both exposed terrain and avalanche danger.» It is a real warning, and it sits further out than you can see from the shelter. Southward it is plateau for a kilometre and a half — under ten degrees the whole way — and then the ground breaks away: from about 1490 metres out the 60-metre windows measure 37 to 40 degrees, the steepest 39.7 degrees 1610 to 1670 metres out, and single ten-metre steps reach 48. By two kilometres you have lost 339 metres of height. That is the rim above Omnråa, and it is not gentle — it is only far away. The edge you can walk out onto without going far is north-east.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "936 metres of climbing where no part of the routed line measures more than 20.5 degrees, and the steepest hundred-metre band is 13.1 from 1400 to 1500 m. Fri Flyt gives the steepest point as under 25 degrees and classifies the tour as KAST 1, easy. The route gives back not a metre over 4.84 km — it climbs without interruption from the car to the shelter, on ground mapped as a winter route the whole way.",
      },
      {
        title: "The terrain off it",
        body: "The north-east side is the one that counts where you stand: 30.7 degrees on average over 400 metres and 46.2 degrees in the window 10 to 70 metres out from the summit, with north at 22.2 and east at 23.1. The south side, which Fri Flyt names in its hazard note, measures 6.0 degrees on average over the first 400 metres — but it is not harmless, it is merely far off: from about 1490 metres out it falls 37 to 40 degrees toward the Omnråa bowl. Two different things, and it is the north-east one that lies by the shelter.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Trollheimen at varsom.no. Trollheimen is an A region and is forecast every day in season, so here there is an assessment to read. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "653 m",
      endLabel: "1589 m",
      distanceLabel: "5.0 km",
      caption: "936 metres of climbing and 4.84 km on the mapped winter route from Bree through the cabin field at Hornlia, with the forest letting go at 921 m and open mountain from 931.",
    },
  },
  kirketaket: {
    intro:
      "Possibly Norway's most popular ski tour — a broad ridge, legible line choices and a long season. A tour that gives you a lot of mountain for the money, both the first time and the hundredth.",
    ascent: [
      "From the car park at Hellerøra (Øvre Kavli), 185 m, follow the toll road north for the first kilometre, until it crosses Heiaelva. Round the bend and onto the track towards Kavlisetra and Måsvassbu.",
      "At around 420 m you leave the Måsvassbu track and climb northeast through open birch. The forest lets go right there: above 421 m it is open ground the rest of the way. The objective is Vesttoppen på Steinberget, 766 m.",
      "From Vesttoppen follow the crest east to Steinberget, 981 m. The ridge is continuous and rises steadily, but just north of Steinberget it drops 19 metres into a notch before rising again. You climb those 19 metres back on the way out — they are part of the tour's 1277 vertical metres.",
      "From here the southwest ridge runs north-northeast to the top. The steepest 100-metre band of the whole ascent lies between 1400 and 1500 m and averages 22.1°; the band below it, 1300 to 1400 m, measures 20.5°. The steepest single step sits in that same band, between 1411 and 1433 m, and measures 30.3°. Cornices hang out on both the east and the west side of the summit ridge; stay on the ridge and clear of both edges all the way to the cairn at 1439.",
    ],
    descent: [
      "The standard descent runs south off the summit, down the south flank to Kavliheian — 950 unbroken vertical metres — and from there in groomed tracks back to Øvre Kavli. The upper part can hide rocks early in the season; the best snow is lower down. The south flank is also the first place in the area to get tracked out after a snowfall, so be early if you want it untouched.",
      "The common mistake: treating the south flank as the default regardless of conditions. The upper part holds 30–35°, and the avalanche terrain sits in two bands, 1300–1400 m and 950–1050 m — and you pass through both on the way up as well. If the forecast does not allow it, you go back over Steinberget, the way you came, and back up through the notch.",
      "Vestrenna is the other way down: a steady 42–48°, with a 60-metre section of about 55° where the gully is narrowest, then out down the valley to Loftskarsetra and through the forest to the car park. It needs stable spring snow or stable winter conditions and an assessment of its own — the snow quality in the gully is harder to judge than it is to ski. It is not something you choose on the summit.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The climb over Steinberget is the gentle line on this mountain, but it is not avalanche-free. The avalanche terrain sits in the bands 950–1050 m and 1300–1400 m, and you pass through both on the way to the top. The 1300–1400 m band averages 20.5°, and the hundred above it — 1400–1500 m at 22.1° — is the steepest of the ascent; the steepest single step sits in it, between 1411 and 1433 m, and measures 30.3°.",
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
      distanceLabel: "6.4 km",
      caption: "185 to 1439 m over 6.2 kilometres: toll road, birch forest to 421, then ridge all the way — 1277 vertical metres including the notch north of Steinberget.",
    },
  },
  skarven: {
    intro:
      "744 metres of ascent over 3.34 km from the car park in Skorgedalen to one of Romsdalen's great classics — the tour ut.no calls one of the shortest in the area and still one of the big ones. Fri Flyt rates it KAST 1 – Simple with the steepest point under 30 degrees, and the finished line stays inside that: the steepest 100 m band measures 20.5 degrees between 400 and 500 m, the steepest sustained stretch 27.7. What needs your head is not the line up but the east flank below the fore-summit — the one the source itself tells you not to cross.",
    ascent: [
      "From the car park in Skorgedalen, 307 m on the toll road from Skorga on the E136 — open in winter, and mapped as a car park in OSM. From its northwest corner you cross the flat — bog in Kartverket's classes, 350 m where the line takes it — north of Kjerringhaugen and the DNT hut Skorgedalsbu. Then up through the birch forest: the band from 400 to 500 m is the steepest of the tour, 20.5 degrees over 295 metres of ground, and the forest ends at 556 m after 1.35 km, with open ground from 557.",
      "Above the treeline you round the south side of point 588 and follow a faint ridge formation — 572 m where the line takes it — toward Skarven's southern fore-summit at 788. The bands here measure 16.4 degrees from 600 to 700 m and 15.7 from 700 to 800: even skinning on an open ridge, with the view growing east into Romsdalen and west over Romsdalsfjorden toward Molde.",
      "From the fore-summit the ridge continues over 892 m to the cairn. The steepest sustained stretch of the whole tour is here — 27.7 degrees between 937 and 960 m — and the band from 900 to 1000 measures 19.3 degrees. The cairn stands at 1048 m: Fri Flyt's published GPS point, the name register's mountain and the terrain model's 1048.1 coincide to the metre.",
    ],
    descent: [
      "The normal way down is your own track, and the southeast flank it follows is the gentlest sector of the summit: 19.6 degrees mean to the south and 26.3 to the southeast, with 35.9 and 34.4 degrees as the steepest 60 m windows 90 to 180 metres out from the cairn. Good, even skiing that very often holds good snow, says ut.no.",
      "The alternatives are steeper and belong to stable days: the NM course from 1940 down the southeast flank toward Skarvebotn measures 33 degrees over a hundred vertical metres between 1020 and 920 m, and Vasslia direct toward Selsetervatnet 40–42 degrees with passages of 45. Stay off the northwest side — it measures 43.3 degrees mean with 55.0 degrees as the steepest 60 metres only 80 to 140 metres out.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt rates the tour KAST 1 – Simple with the steepest point under 30 degrees, and the line measures 20.5 degrees in its steepest band and 27.7 in its steepest stretch. The card still carries grade 2: the numbers sit above what the app's grade 1 tours measure, and the mountain has sides where mistakes cost.",
      },
      {
        title: "The east flank",
        body: "Fri Flyt is direct: «Ikke kryss østflanken under Skarvens fortopp» — do not cross the east flank below Skarven's fore-summit; it is one of the few avalanche-prone areas on this side of the mountain. The measurement says why — the east side falls 34.4 degrees mean with 49.7 degrees as the steepest 60 m window 220 to 280 metres out from the cairn. The normal route keeps to the ridge and has no business there.",
      },
      {
        title: "Wind and sun",
        body: "The source points to avalanche danger in the upper sections after wind from the northwest, and to the sun-exposed southeast flank — on spring days it releases here once the sun has worked it. An early start is the answer in both cases.",
      },
      {
        title: "Before you go",
        body: "Skarven lies in the Romsdal forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The December–April season is Fri Flyt's. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "307 m",
      endLabel: "1048 m",
      distanceLabel: "3.3 km",
      caption: "744 metres of ascent and 3.34 km from Skorgedalen past Kjerringhaugen and the southern fore-summit, with the treeline at 556 m and the steepest ground — 27.7 degrees between 937 and 960 m — up on the ridge.",
    },
  },
  mjolvafjellet: {
    intro:
      "1220 metres of ascent over 5.15 km from the fjord to the summit hanging over Romsdalen — the tour starts at the sports ground in Isfjorden, 6 m above the sea, and ends at 1215. Fri Flyt rates it KAST 2 – Challenging with a steepest point of 28 degrees on the normal route; the finished line measures 21.0 degrees in its steepest 100 m band and 31.5 in its steepest sustained stretch, which sits low on the hillside between 279 and 300 m. It is a long tour where the length is the difficulty — and where route-finding in poor visibility is what the source warns most about.",
    ascent: [
      "From Isfjorden stadium — OSM maps the pitch, and the terrain model answers 5.7 m with the class SportIdrettPlass, the same rare three-way agreement of guidebook, map object and terrain model as Glitregga's sports ground. The tractor road takes you up the southeast hillside past the football pitch: the band from 0 to 100 m measures 7.9 degrees, then it steepens — 21.0 degrees from 200 to 300 m over 261 metres of ground, with the tour's steepest sustained stretch, 31.5 degrees, between 279 and 300 m. The steepest ground of the whole tour is in the forest.",
      "The forest opens toward the southwest below Litlehesten's steep wall — 454 m where the line passes its foot — and you cross Steinselva at 536. The forest ends at 673 m after 2.75 km, with open ground from 683. Then you aim for the gentlest ridge formation toward Høgnosa: the band from 800 to 900 m measures 12.7 degrees, and from 900 to 1000, 14.0.",
      "From Høgnosa the ridge runs south toward the summit — 1060 m where the line takes it, and the bands above 1000 measure 12.3 and 8.0 degrees before the final rise at 14.1. The cairn stands at 1215 m with Romsdalseggen toward Blånebba and Store Venjetinden to the south and Romsdalsfjorden to the north. The register point reads 1206; the summit search climbs to 1215.3 against a published 1216.",
    ],
    descent: [
      "The normal way down is your own track, and the direction off the summit is north — the ridge toward Høgnosa is the only gentle sector up there, 4.2 degrees mean over 500 metres with 21.1 degrees as the steepest 60 m window. Everything else is steep: south and southwest fall 43.7 and 42.4 degrees mean with windows of 61.0 and 58.5, and the northeast side directly below the top has a 60 m window of 61.7 degrees only 30 to 90 metres out.",
      "Fri Flyt documents steeper descents toward Jamnåbotn and Storhestvatnet, 30 to 45 degrees with aspects north to east-northeast. They belong to stable days, with the line chosen before you are standing in the slope.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, steepest point 28 degrees on the normal route — and the finished line measures 31.5 degrees in its steepest stretch, down in the forest between 279 and 300 m. Above the treeline the ridge stays gentle: no band above 900 measures more than 14.1 degrees.",
      },
      {
        title: "Lee slopes and cornices",
        body: "The source points to avalanche danger on lee slopes after wind from the south and west, and to cornices on the east-facing slopes. The ridge you follow has the steep ground close beside it — the northeast side below the summit measures 61.7 degrees in its steepest window — so the line is good because it stays where it is, not because the surrounding terrain is kind.",
      },
      {
        title: "Visibility",
        body: "Route-finding is the source's own warning: in poor visibility holding the ridge formation is demanding, and the wrong direction off the summit puts you above slopes of 45 degrees or more. The direction down from the cairn is north, toward Høgnosa — worth fixing in your head before the fog arrives, not after.",
      },
      {
        title: "Before you go",
        body: "Mjølvafjellet lies in the Romsdal forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The January–April season is Fri Flyt's. Carry transceiver, probe and shovel. Note that ut.no describes the mountain from Venjesdalen — a different start from this one; the line here is Fri Flyt's, and the second source covers the mountain, not the line.",
      },
    ],
    elevationProfile: {
      startLabel: "6 m",
      endLabel: "1215 m",
      distanceLabel: "5.1 km",
      caption: "1220 metres of ascent and 5.15 km from Isfjorden stadium via Steinselva and the ridge at Høgnosa, with the treeline at 673 m and the steepest ground — 31.5 degrees between 279 and 300 m — down in the forest.",
    },
  },
  blanebba: {
    intro:
      "934 metres of ascent over 4.04 km from Venjesdalssetra to the edge that looks straight down into Romsdalen — from the cairn you have Trollveggen, Romsdalshorn and the Vengetind peaks in the front row. Fri Flyt rates the tour KAST 2 – Challenging with a steepest point of 40 degrees in the summit ridge; the line here takes the gentler alternative the source itself describes, via the col at 1245 m, and measures 22.2 degrees in its steepest hundred-metre band and 27.4 in its steepest sustained stretch. The edge you finally stand on falls 71 degrees — it is the view, and it is the hazard.",
    ascent: [
      "From the parking where the toll road up Venjesdalen ends, at Venjesdalssetra — OSM maps the setra as its own node, and DTM1 reads 418 m where Fri Flyt gives 380. You head south following the Romsdalseggen markers through cleared forest lanes on the north side of Tverrelva: the band from 400 to 500 m measures only 7.3 degrees, and the forest ends already at 553 m after 1.2 km, with open ground from 559.",
      "Above the treeline the flat between Blånebba and Storhesten opens up — 681 m where the line crosses. From here you hold west in gentle climbing until you find the northeast flank leading up toward the lowest point on the ridge between Blånebba and point 1178. The flank is the steepest part of the tour: the band from 800 to 900 m measures 22.2 degrees over 269 metres of ground, and the steepest sustained stretch is here, 27.4 degrees between 972 and 999 m.",
      "The col reads 1245 m on the terrain model, 230 metres west-northwest of the summit, and the main ridge is followed east from there to the cairn at 1317 — the band from 1200 to 1300 measures 17.2 degrees. Fri Flyt's direct line through the summit ridge is the other option, around 40 degrees by the source; the line here is the traverse he describes as the gentler choice around 1000 m. The register point reads 1272; the summit search climbs to 1317.0 against a published 1320 — a sharp top where the laser scan reads three metres below the published height, the same class as Rørnestinden.",
    ],
    descent: [
      "The normal descent is the northeast flank you came up — 35 to 40 degrees by Fri Flyt, and measured at 36.2 degrees mean over 500 metres with 43.6 degrees as the steepest 60 m window 140 to 200 metres out. The ridge back northwest toward the col is the only gentle sector of the summit: 16.5 degrees mean.",
      "The north ridge is the source's advanced alternative — 38 to 43 degrees with passages of 45, aspect north to east. And keep the cairn between you and Romsdalen when you turn: the south and southwest sides fall 71.4 and 72.0 degrees in the first 60 metres from the top. That edge is what you came to look over, not down.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, hazards avalanche and cornice. The line measures 22.2 degrees in its steepest band and 27.4 in its steepest stretch — under the 30 where the big releases start, but the flank you cross between 800 and 1000 m sits in the lee of northwest wind, and the surrounding terrain is rimmed by rock bands with large consequence zones.",
      },
      {
        title: "The cornices",
        body: "The cornice exposure is to the north, and ut.no adds that the sections near the summit are narrow with large cornices. On the ridge from the col east to the cairn you walk with the north side corniced and the south side falling 71 degrees toward Romsdalen — stay on the line, especially in flat light.",
      },
      {
        title: "The season",
        body: "Fri Flyt gives March–May, ut.no December–April. The card carries Fri Flyt's, the primary source for the line — the disagreement is stated here rather than averaged away. The toll road up Venjesdalen is ploughed; the setra is the winter start for Blånebba and its neighbours.",
      },
      {
        title: "Before you go",
        body: "Blånebba lies in the Romsdal forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "418 m",
      endLabel: "1317 m",
      distanceLabel: "4.0 km",
      caption: "934 metres of ascent and 4.04 km from Venjesdalssetra via the flat below Storhesten and the col at 1245 m, with the treeline at 553 m and the steepest ground — 27.4 degrees between 972 and 999 m — in the northeast flank.",
    },
  },
  ospetinden: {
    intro:
      "1061 metres of ascent over 6.88 km from the toll booth at Venås to the pyramid at the head of Måndalen — the mountain you see rising ahead of you from the first step, says morotur. Fri Flyt rates the tour KAST 2 – Challenging with a steepest point around 35 degrees at the top of the bowl; the line here pulls out onto the northeast ridge from the flat at about 900 m, as the source recommends with avalanches in mind, and measures 22.4 degrees in its steepest 100 m band and 25.6 in its steepest sustained stretch. The summit itself is often snow-free — skis are usually left a few metres below it.",
    ascent: [
      "From the toll booth at the Venås farm at the head of Måndalen, 201 m, you follow the toll road to Venåssetra — the bands from 200 to 400 m measure 3.0 and 3.7 degrees over nearly three and a half kilometres of road, an even, easy climb up the valley. The setra is a good resting place on fine days, says morotur. The terrain model reads 393 m there; Fri Flyt's «ca 700» for the setra is wrong, and the register and the terrain model agree.",
      "From the setra you head due west across the bog — 414 m — and cross Stavvasselva, then aim for the big east-facing bowl. The forest ends at 668 m after 4.68 km, with open ground from 681, and the bowl steepens evenly: 15.4 degrees from 600 to 700 m, then the tour's steepest band, 22.4 degrees from 700 to 800 over 225 metres of ground, with the steepest sustained stretch — 25.6 degrees — between 764 and 779 m.",
      "From the flat at about 900 m — 948 where the line takes it — the usual move is out onto the northeast ridge, and that is what the line does: the band from 900 to 1000 measures only 8.5 degrees on the traverse out. The ridge takes you west toward the cairn — 19.0 degrees from 1100 to 1200 — with the view over the fjords toward Molde and the sea at your back. The register point reads 1203; the summit search climbs to 1227.5 against a published 1228. The top itself is often wind-scoured, bare rock and hardpack — the first 60 m window down the northeast ridge measures 45.3 degrees, so the skis stay where you left them.",
    ],
    descent: [
      "The normal descent is the east flank: straight down gives an even 30 degrees according to Fri Flyt, and the measurement agrees — the east side measures 27.5 degrees mean over 500 metres with 31.9 degrees as the steepest 60 m window 70 to 130 metres out. From the flat at about 900 m you usually follow your own skin track.",
      "The south flank is the alternative: 400 vertical metres of evenly steep skiing down toward Øspevatnet, 33 to 40 degrees by the source — and measured at 33.9 degrees mean with 37.3 as the steepest window directly below the summit. It belongs to stable days, and it ends somewhere other than your car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 2 – Challenging by Fri Flyt, steepest point around 35 degrees at the top of the bowl where the source's direct line goes. The line here takes the northeast ridge from the flat instead — the track the source itself sets with avalanches in mind after wind and snow from the north — and measures 25.6 degrees at its steepest.",
      },
      {
        title: "The lee slopes",
        body: "The source is concrete about the wind: the southeast and northeast ridges form lee slopes in southerly and northerly winds respectively. The bowl you cross faces east and loads after westerly weather — read the slopes above you through the whole climb from 700 to 900.",
      },
      {
        title: "The summit",
        body: "The top is often snow-free, bare rock and hardpack, and slipping is the source's own word for the hazard. The first 60 m window down the northeast ridge measures 45.3 degrees — skis are left a few metres below the summit, and the last metres go on foot.",
      },
      {
        title: "Before you go",
        body: "Øspetinden lies in the Romsdal forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The December–May season is Fri Flyt's. Carry transceiver, probe and shovel, and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "201 m",
      endLabel: "1228 m",
      distanceLabel: "6.9 km",
      caption: "1061 metres of ascent and 6.88 km from Venås via Venåssetra and the east-facing bowl, with the treeline at 668 m and the steepest ground — 25.6 degrees between 764 and 779 m — in the bowl.",
    },
  },
  middagstinden: {
    intro:
      "1306 metres of ascent over 6.20 km from Herdslan in Innfjorden to an alpine summit that is steep on every side — Fri Flyt rates the tour KAST 3 – Complex with a steepest point of 39 degrees, and the normal route feels airy and exposed. The line measures 25.1 degrees in its steepest 100 m band and 30.0 in its steepest sustained stretch, which is the last metres up the west-facing summit flank. The ridge to it is often wind-scoured: skis on the pack, and crampons and ice axe may be needed. This is the most serious tour of the round, and it says so itself.",
    ascent: [
      "From Herdslan on the toll road toward Bøstølen — the register's Herdslan is a clearing by the road, and the bog flat where the cars stand reads 348.7 m against Fri Flyt's stated 360. The road is followed west along the south side of Berillvatnet, which is a regulated reservoir: the line rounds the whole lake on land, past its west end at 403 m, and crosses the river west of the lake at a suitable spot as the source says — 390 m where the line takes it. The band from 300 to 400 m measures 3.4 degrees over a kilometre and a half of road.",
      "From the forest west of the lake — 410 m — the route climbs the stream gully toward the col east of point 943, at Tindevatnet. The forest ends at 740 m after 3.33 km, with open ground from 759, and the gully steepens evenly: 21.0 degrees from 500 to 600 m, 19.2 from 600 to 700 and the tour's steepest band, 25.1 degrees over 170 metres of ground, from 700 to 800. The upper part of the gully is steep and avalanche-prone — the source's own words, and this is where the tour demands its stability.",
      "The col reads 937 m where the line takes it, with Tindevatnet at 804 below you to the west. From here the ridge is traversed east toward the summit — 17.3 degrees from 1000 to 1100, 21.3 from 1200 to 1300 — and it is not avalanche terrain to speak of, but often wind-scoured: skis on the pack, and crampons and ice axe may be needed. Where the ridge flattens northward the skis can often go back on along the west side.",
      "The final west-facing flank before the summit is steep — 37 degrees by Fri Flyt, often wind-scoured, and short of space. The line measures 30.0 degrees in its steepest sustained stretch between 1549 and 1568 m, and the band from 1500 to 1600 measures 23.8. The cairn stands at 1568 m; the register point reads 1547, and the summit search climbs to 1568.3 against a published 1569. Norway has 49 mountains called Middagstinden — this is Rauma's.",
    ],
    descent: [
      "The normal descent is the big west-facing flank from the summit, first between rock outcrops — the source points especially at the top hundred metres — with a traverse south before the skiing begins. About 700 metres of steep skiing down toward the col, then 500 metres through forest. The west side measures 31.6 degrees mean over 500 metres with 38.3 degrees as the steepest 60 m window 10 to 70 metres out — which agrees with the source's 37.",
      "The Gullkoppen variants are the source's advanced alternatives: a traverse on the snow ramp east of Gullkoppen's steep face from about 1360 m with slopes up to 45 degrees, and a direct 50-degree flank on the south side of the sub-peak around 1300. Both belong to late winter with refrozen snow — and neither is the line on this map.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "KAST 3 – Complex by Fri Flyt, steepest point 39 degrees. The terrain leaves no room for error on the exposed sections, says the source — the upper gully is steep and avalanche-prone, and avalanche terrain on slopes over 30 degrees is written into the route description itself. This is a tour for dry, stable winter snow or refrozen spring snow with cold nights.",
      },
      {
        title: "The ridge and the flank",
        body: "The ridge from the col is not avalanche terrain to speak of but often wind-scoured — skis on the pack, crampons and ice axe may be needed, and the final west-facing flank is short of space. The measurement says how narrow the margin is: from the cairn the south, southwest and southeast sides fall 75.7, 73.4 and 71.5 degrees in the first 60 metres, and only west is skiable — 31.6 degrees mean.",
      },
      {
        title: "Rockfall",
        body: "The source points at rock especially in the top hundred metres of the west flank, and late in the season the sun works the lower sections. An early start and a plan for where you turn around are part of the equipment here.",
      },
      {
        title: "Before you go",
        body: "Middagstinden lies in the Romsdal forecast region, an A-region with a daily avalanche bulletin through the season — check varsom.no. The January–April season is Fri Flyt's. Carry transceiver, probe and shovel in addition to crampons and ice axe — and read the terrain yourself: a bulletin describes the region, not the flank you are standing in.",
      },
    ],
    elevationProfile: {
      startLabel: "349 m",
      endLabel: "1568 m",
      distanceLabel: "6.2 km",
      caption: "1306 metres of ascent and 6.20 km from Herdslan around Berillvatnet and up the stream gully to the col at Tindevatnet, with the treeline at 740 m and the steepest ground — 30.0 degrees between 1549 and 1568 m — in the west-facing summit flank.",
    },
  },
  auskjeret: {
    intro:
      "870 metres of climbing over 3.83 km from Fausaskiftet, an even ascent northward the whole way — about fifteen degrees on average. A road open all year to the start is why this is one of the first tours to go in Sykkylven each winter.",
    ascent: [
      "Start at Fausaskiftet at the end of Nysætervatnet, 333 m, where Fausavegen leaves the road network about four kilometres past the ski centre. The road here is open all year.",
      "Put the skis on and head north. The first 671 metres of ground average 6.2 degrees, and the forest holds to 553 m.",
      "Above the forest the climbing continues evenly and without steps: 14.2 degrees from 500 to 600 m, 11.4 from 600 to 700 and 11.7 from 700 to 800. At 685 m you are out in the open flank, and just above sits the steepest part of the tour — 26.4 degrees over thirty metres, between 862 and 884 m, inside the band that averages 18.6 degrees.",
      "From 900 m upward it is even ridge all the way: 16.1 degrees from 900 to 1000 m, 18.1 from 1000 to 1100 and 15.1 from 1100 to 1200, with the cairn at 1203 m.",
    ],
    descent: [
      "Back down the same ridge, south-east toward Nysætervatnet, in moderate and open ski terrain. Follow the ridge up and down and the route stays below 30 degrees the whole way.",
      "The usual mistake is to assume the steep ground is to the east. The measurements say otherwise. From three points on the ridge — 896, 1000 and 1103 m — the east side measures 7.5, 7.0 and 8.9 degrees on average over 400 metres, and from the cairn 18.9. The steep ground is north and north-east of the summit: 30.6 and 35.8 degrees on average, with 60-metre windows of 58.9 and 50.5. The ridge you climb is the gentle line, and the terrain behind the summit is what you cannot see from it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "An even climb averaging about fifteen degrees. The steepest hundred-metre band, 800 to 900 m, measures 18.6 degrees, and the steepest sustained section 26.4 degrees between 862 and 884 m. The ridge is broad, and it is the route both up and down.",
      },
      {
        title: "The terrain around it",
        body: "The research for this tour said the mountain has an east-facing slope over 30 degrees. The terrain model does not find it: east from the ridge measures 7 to 9 degrees on average and east from the cairn 18.9, with the steepest 60-metre window at 31.1 degrees a full 280 to 340 metres out. What is actually steep is north and north-east of the summit — 30.6 and 35.8 degrees on average with windows of 58.9 and 50.5. It is the length and that side, not the east side, that separates this from a beginner's tour.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "333 m",
      endLabel: "1203 m",
      distanceLabel: "3.8 km",
      caption: "870 metres of climbing and 3.83 km from Fausaskiftet by Nysætervatnet, with the treeline at 553 m and the steepest hundred-metre band between 800 and 900 m.",
    },
  },
  snohetta: {
    intro:
      "Norway's highest mountain outside Jotunheimen, and one of the kindest in its class: the east ridge is staked the whole way and the steepest section on the line measures 23.5°. What decides the day is not the mountain but how you get in to Snøheim.",
    ascent: [
      "Snøheim turisthytte, 1474 m, sits at the end of Snøheimvegen. The road is closed to private cars, cycling is allowed only in the 1 June–15 July window for the sake of the wild reindeer — e-bikes are banned year round. The bus from Hjerkinn only runs once the hut opens around midsummer. In the ski season you therefore cover the fourteen kilometres in from Hjerkinn under your own steam — that is the part of the day people underestimate. From the hut follow the track a couple of hundred metres west to the footbridge over Stridåe. The bridge is at the south-east corner of the tarn just west of the hut; you go around the tarn's southern shore, not across it.",
      "After the bridge you turn immediately right onto the army's old tractor road, blocked to vehicles with large boulders. It takes you steadily up to Gamle Reinheim, the ruin at 1670 m. No forest anywhere on this tour — you are above the treeline from the hut upwards, with the whole ridge in front of you the entire way.",
      "From Gamle Reinheim it climbs steeply, partly on snowfields, onto the east ridge. Up on the crest is the path junction for Reinheim in Stroplsjødalen, the way in for those coming from the east. Keep your distance from the steep terrain to the north at the start of the climb; the ridge is broad enough that you can walk up the middle of it.",
      "The steepest hundred-metre band lies between 1700 and 1800 m and holds a mean 16.0° — the band above it, 1800 to 1900 m, measures 13.8° — and the steepest section on the line measures 21.7°. From here there are stakes and cairns the whole way, and the top goes on snowfields up to Stortoppen, 2286 m, where the radio link station stands. In poor visibility it is the stakes that keep you on the crest — the upper section is broad enough that you lose the feel of where the ridge runs.",
    ],
    descent: [
      "Back down the same way. From Stortoppen to Gamle Reinheim the east ridge gives a good 600 vertical metres in one go, and the tractor road takes the last 200. Below 1800 m it slackens enough that it becomes more glide than turns. If you want more pitch and better snow, put part of the descent south of the up-track — but that has you standing on 30–40° ground instead of 20°.",
      "The common mistake comes right at the end: leaving the tractor road too early and aiming straight for Snøheim. That puts the tarn west of the hut in your way, and its outlet stream behind that. Follow the road all the way down to its end at the tarn's south-west corner and take the path east from there — the footbridge is the only crossing, and from the bridge it is 230 metres to the hut.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The east ridge is gentle by high-mountain standards. The steepest hundred-metre band, between 1700 and 1800 m, holds a mean 16.0°, and the steepest section on the line measures 21.7°. From Snøheim to Gamle Reinheim you are on an old tractor road in open, easy-angled terrain. What matters here is not what you are standing on but how close to the edge of the crest you put the track.",
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
      distanceLabel: "5.9 km",
      caption: "5.7 km and 817 vertical metres from Snøheim — steadily uphill the whole way, and never steeper than 23.5°.",
    },
  },
  jonshornet: {
    intro:
      "1428 metres of climbing from 107 m over Rametinden, and the last hundred on a narrow arête to the cairn on the mountain locally called Ramoen. The steepest sustained section measures 33.7 degrees, and most people leave the skis on the ridge.",
    ascent: [
      "Start in Vollane by Tverrelva, 107 m, at the top of the farm road off Molladalsvegen. Go through the steel gate by the river and follow the path up, first on the left and then on the right bank.",
      "The first stretch is the steepest of the low bands: 19.6 degrees from 200 to 300 m and 19.3 from 300 to 400. The ground levels off at Vollesætra at 411 m, and the forest holds to 463.",
      "From the seter it is relatively gentle ground up to Rametinden, 1197 m — the band from 700 to 800 m measures 12.1 degrees and 900 to 1000 m runs at 15.2. From Rametinden the ridge drops to the col at 1089 m; that is 108 metres given back on the way up, and the line takes them back with the band from 1100 to 1200 m at 5.2 degrees over 1019 metres of ground.",
      "From the col the ridge climbs 328 metres to the summit, and that is where the tour changes character: the band from 1200 to 1300 m measures 18.5 degrees, the steepest sustained section 33.7 degrees between 1165 and 1185 m, and the summit itself is a heap of large blocks. The last hundred metres of climbing are on the arête, and most people leave the skis on the ridge.",
    ],
    descent: [
      "Back down the same ridge: over the col, back up the small rise to Rametinden and down the north ridge to Vollesætra and Vollane. The descent faces north.",
      "The usual mistake: taking Jønshornrenna down into Molladalen without arranging transport. Fri Flyt describes that round trip, and the gully runs up to 45 degrees — but it ends in a different valley from the one you parked in, and it takes two cars. The second is counting the arête as part of the ski tour: it is a hundred metres of climbing on foot on exposed ridge.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "An even climb to Rametinden and seriousness above the col. The steepest sustained section measures 33.7 degrees between 1165 and 1185 m, and the band from 1200 to 1300 m runs at 18.5. The flanks off the ridge between Rametinden and the summit are avalanche terrain.",
      },
      {
        title: "The terrain around it",
        body: "Jønshornrenna toward Molladalen runs up to 45 degrees and is avalanche terrain. The arête on the last hundred metres of climbing is exposed, and there it is the drop and not the snowpack that is the danger — hard snow makes it a different job from powder.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "107 m",
      endLabel: "1417 m",
      distanceLabel: "5.7 km",
      caption: "1428 metres of climbing and 5.68 km from Vollane over Vollesætra and Rametinden, with the col at 1089 m between Rametinden and the summit ridge.",
    },
  },
  ytstevasshornet: {
    intro:
      "833 metres of climbing over 4.19 km from Svartevatnet, steeply up Vassdalen to the tarns at 976 m and then north-west onto a narrow summit ridge. The steepest sustained section measures 25.0 degrees, and the last stretch is usually walked without skis.",
    ascent: [
      "Start at the car park by Svartevatnet, 538 m, on the main road between Sykkylven and Stranda. The first 904 metres of ground are flat — 4.3 degrees — and they run along the east shore, not across the water. Svartevatnet is a reservoir: the surface measures 526 m, twelve metres below the car park, and the line stays on land the whole way round the north end and down to the south end at 524.",
      "Head west, on the left bank of the river, up Vassdalen. This is the steep part of the tour: 18.2 degrees from 600 to 700 m, 22.4 from 700 to 800 over only 225 metres of ground, and 20.5 from 800 to 900, with the steepest sustained section at 25.0 degrees between 728 and 749 m. The forest holds to 691 m, and from 706 you are in the open.",
      "At the small mountain tarns at 976 m it flattens out again — the band from 900 to 1000 m measures 6.3 degrees over 945 metres of ground. This is where you see the rest of the route, and it is also the natural place to turn back if the wind has built a cornice on the ridge above.",
      "From there you keep north-west toward the summit ridge: 11.8 degrees from 1000 to 1100 m and 18.0 from 1100 to 1200. The last stretch up to 1331 m is usually walked without skis.",
    ],
    descent: [
      "Back the same way, east through Vassdalen to Svartevatnet. The descent faces east, and Vassdalen is both the steepest and the most avalanche-prone part of the tour.",
      "The usual mistake: rounding the cornice between the fore-summit and the main top on its upper side. A large cornice normally forms there, and you should drop into the flank to get around it — not follow the edge.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A flat start, a steep middle and a flat section before the summit ridge: the steepest hundred metres, 700 to 800 m, measures 22.4 degrees over 225 metres of ground, and the steepest sustained section 25.0 degrees between 728 and 749 m. Vassdalen is avalanche terrain from 600 m up. Down at the start the hazard is a different one: the ice on a reservoir, and the route is laid on land to keep off it.",
      },
      {
        title: "The terrain around it",
        body: "Cornices along the summit ridge — a large one normally forms between the fore-summit and the main top, and it is rounded from below. The flank down from the main summit is avalanche terrain, and the north side is the steepest: 43.2 degrees on average over 500 metres with a 67.3-degree window as little as 10 to 70 metres out from the cairn, and north-east 56.3 degrees in the first 60. East — the way down Vassdalen — measures 9.8 degrees on average, and Vassdalen is still avalanche terrain and the only way back to the car.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "538 m",
      endLabel: "1331 m",
      distanceLabel: "4.2 km",
      caption: "833 metres of climbing and 3.93 km from Svartevatnet along the east shore and up Vassdalen to the tarns at 976 m, with the forest letting go at 691.",
    },
  },
  rana: {
    intro:
      "1602 metres of climbing from 63 m — fjord to summit over 8.61 km, under one of the oldest names in the Sunnmøre Alps. The steepest sustained section measures 38.0 degrees and sits right up on the summit crest, between 1530 and 1554 m.",
    ascent: [
      "Start at Urkegjerdet, 63 m, where the gravel road leaves the main road by Urke Landhandel. The road on toward Haukåssætra is closed in winter, which is why the tour starts down at the fjord and not up at the seter at 230 m — Fri Flyt's «5 hours from Haukåssætra» is time from a point you rarely reach by car in winter.",
      "Follow the road up through the forest — Kartverket has forest to 231 m — past Haukåssætra and into the valley toward Nordkopen at 501 m. The band from 400 to 500 m measures 11.7 degrees, and otherwise the whole approach is gentle: 5.5 degrees from 100 to 200 m and 6.5 from 200 to 300.",
      "From the basin the route zigzags steeply up toward the arête to the north, which you join to the right of a marked rock band. The basin floor is at 987 m and the crest at 1331. The band from 1200 to 1300 m is the steepest hundred-metre band at 19.2 degrees, and the ground from 700 to 1000 m below it runs at 16 to 19.",
      "From there you follow the summit ridge north. It is broad and eases toward 1400 m — 7.2 degrees from 1300 to 1400 — before the final climb along the crest from 1531 and 1562 m to the cairn at 1587. That is where the steepest ground is: 38.0 degrees over thirty metres between 1530 and 1554 m.",
    ],
    descent: [
      "Back the same way: the crest, the broad summit ridge, down the arête to Nordkopen and out the valley to Urkegjerdet. The card gives the descent aspect as south-east; the line home bears 182 degrees, which is due south, and the crest is held on its west side where the cornices are not. It is long — 1595 metres in one run from the summit to the fjord.",
      "The usual mistake: holding east on the summit ridge. Large cornices sit on the east side, and a flank measurement from the summit shows the mountain is steep in every direction: 22 to 41 degrees on average over the first 400 metres, with 60-metre windows of 53 to 66 degrees. Keep west of the crest.",
      "The second is timing. The route runs through avalanche terrain both into Nordkopen and on the flank up to the arête, and in spring snow through the afternoon that is the part of the tour that changes fastest.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A gentle approach and a steep middle: the band from 1200 to 1300 m averages 19.2 degrees, and the flank up from Nordkopen to the arête is avalanche terrain. The summit crest itself is the steepest part at 38.0 degrees over thirty metres between 1530 and 1554 m, and it is also where the cornices sit.",
      },
      {
        title: "The terrain around it",
        body: "Large cornices on the east side of the broad summit ridge. The flank measurement from the top gives 22 to 41 degrees on average over 400 metres in all eight directions, with 60-metre windows between 53 and 66 degrees — there is no gentle side to drop off here, only the crest you came up.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "63 m",
      endLabel: "1587 m",
      distanceLabel: "8.6 km",
      caption: "1602 metres of climbing and 8.61 km from Urkegjerdet over Haukåssætra, Nordkopen and the arête, with the steepest ground in the last hundred metres of climbing.",
    },
  },
  kolastinden: {
    intro:
      "Sunnmøre's best-known ski summit. A gentle valley the whole way in, then a north-facing passage over 45°, a glacier — and a summit a metre and a half wide.",
    ascent: [
      "From the car park at Standaleidet, 376 m, you follow the cleared track north toward Fossane below Søre Sætretind. The forest lets go already at 410 m, and the waterfall marks the mouth of Kvanndalen.",
      "Follow the valley floor along the riverbed northward. The terrain is gentle: the steepest hundred-metre band, between 800 and 900 m, averages 17.6°. Do not turn west where the valley opens around 650 m — that gorge leads up into the glacier's outflow. Hold north to Appelsinhaugen at 950 m, the natural rest point halfway.",
      "From Appelsinhaugen you head west-southwest onto the flat in Kvanndalsskardet, just over 1020 m. From here up to Stretet it is steep: measured steps on the north-facing side pass 45°. Stretet sits at 1140 m, a narrow passage on the edge, and above it you see the summit.",
      "Above Stretet you are on Kolåsbreen, glacier from 1173 to 1355 m. Follow the glacier edge under the crest southwest toward the top. Most people take the skis off around 1350 m and walk the final pitch, which measures 47°. The summit is 1432 m, one and a half to two metres wide and ten metres long, with a cornice to the east — stay in the middle — and a west side that drops 260 vertical metres in 180, with twenty-metre steps up to 75°.",
    ],
    descent: [
      "Back down the same line you meet the two steep steps in reverse order: the summit pitch from 1432 to 1350, which measures 47°, and the north-facing side from Stretet down toward Kvanndalsskardet, where measured steps pass 45°. Take both on a traverse and with spacing between people. From Kvanndalsskardet down, the terrain stays under 30° the whole way out of Kvanndalen.",
      "The common mistake: drifting too far west on the way down from Appelsinhaugen. That puts you in the gorge draining the glacier out of Kvanndalen — narrow, with steep sides above it. Hold the riverbed in the valley floor until you see Fossane.",
      "On days without avalanche danger Kolåsbreen gives a wider descent with several line choices. The bergschrund between the glacier and the summit slope opens as the season goes on: covered in midwinter, open by the time spring comes in.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The valley through Kvanndalen is gentle, averaging 17.6° over its steepest hundred-metre band. Steep terrain comes in two places: the north-facing side from Kvanndalsskardet up to Stretet, where measured steps pass 45°, and the summit slope above 1350 m at 47°. Both face north.",
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
      distanceLabel: "5.7 km",
      caption: "376 m at Standaleidet to 1432 on Kolåstinden — 1120 vertical metres over 5.70 kilometres, glacier from 1173 m.",
    },
  },
  vassdalstinden: {
    intro:
      "1212 metres of climbing from 92 m at Nupen, through Bukkedalen and up a long flank that averages 23.6 degrees over the last hundred. The steepest sustained section measures 36.2 degrees and sits between 1205 and 1238 m.",
    ascent: [
      "Start at the parking beyond the gate at Nupen, 92 m. Fri Flyt gives «3 hours from Vallasætra» and «4 hours from Nupen», and the difference is real: the seter sits at 324 m, and the road on to it is a toll road that only applies «if the road is open».",
      "Follow Engesetvegen up and east to Vallasætra. The first 766 metres of ground are flat — 0.7 degrees — and then the road gets to work: 5.3 degrees from 100 to 200 m, 9.2 from 200 to 300 and a steeper stretch at 19.9 and 21.8 degrees between 400 and 600 m. The forest holds to 581 m.",
      "From the seter you go a few hundred metres into Langedalen and then steeply up the step into Bukkedalen, 791 m — with the skis on the pack if need be. The band from 700 to 800 m is gentle, 8.9 degrees over 632 metres of ground, and gives you the breather before the flank.",
      "Follow the valley floor in to 960 m, where the long steep flank begins. From here the line climbs evenly and hard: 19.5 degrees from 1000 to 1100 m, 22.5 from 1100 to 1200 and 23.6 from 1200 to 1300, with the steepest sustained section at 36.2 degrees between 1205 and 1238 m. The summit stands at 1278. Just before the flank begins the line runs 97 metres across a tarn at 946 m, up to 40 metres from shore. It is natural and unregulated, and unnamed in the register.",
    ],
    descent: [
      "Back down the same flank to the valley floor, out Bukkedalen and down the step to Vallasætra and Nupen. The descent faces east, and the flank is both the way up and the way down.",
      "The usual mistake: navigating west off the summit in poor visibility. From the col north of the top, Vestrenna drops 700 metres at 45 to 50 degrees into Nupadalen. It is a documented expert line for those who choose it with open eyes, and a serious error for anyone who does not know it is there.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Two steep stretches with a gentle interlude: the step up into Bukkedalen between 400 and 600 m (19.9 and 21.8 degrees on average) and the flank from 960 m to the summit, where the band from 1200 to 1300 m measures 23.6 degrees and the steepest sustained section 36.2. Both are avalanche terrain.",
      },
      {
        title: "The terrain around it",
        body: "Vestrenna from the col north of the summit drops 700 metres at 45 to 50 degrees into Nupadalen. It is not the route, but it is close enough to the top that a wrong bearing in cloud takes you to it.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "92 m",
      endLabel: "1278 m",
      distanceLabel: "6.5 km",
      caption: "1212 metres of climbing and 6.50 km from Nupen over Vallasætra and Bukkedalen, with the treeline at 581 m and the flank from the valley floor at 960 m to the summit.",
    },
  },
  saudehornet: {
    intro:
      "1161 metres of climbing straight up from the centre of Ørsta, and Fri Flyt grades the tour \"complex\" for a reason: the crest holds about 32 degrees on average over the last 170 metres with its steepest section at 37, and on hard snow a slip there has a long runout. Fri Flyt reckons many parties carry their skis for the last stretch.",
    ascent: [
      "From the car park at the waterworks at the top of Vikegeila, 149 m, follow the service road up into Skåla. The forest ends around 339 m and the ground is open from 344. At about 395 m you leave the road where a mapped path branches off — the same place Fri Flyt describes as \"diagonally towards the Vikeelva, cross the river\".",
      "Across the river, aim for the lowest point on the ridge between Vallahornet and Saudehornet, 812 m. The col sits further east than a straight line between the two summits would suggest; the crest itself has its low point there, and a mapped path follows it some thirty metres away.",
      "Over the col, follow the south ridge some 490 metres up to the summit at 1303 m. The climbing is steady to around 1137 m and then steepens. Measured along the crest itself from 1135 m upwards the steps are 33, 30, 37 and 25 degrees over roughly sixty metres each: the ridge is steepest mid-way, around 1266 m, and eases into the summit dome. Fri Flyt reckons many parties carry their skis for the last 200 metres.",
      "There are cornices along the summit crest. You cannot walk right out to the edge, and that is worth knowing before you are standing there wanting the view over the Hjørundfjord.",
    ],
    descent: [
      "The usual descent takes the same way down, but often on the flank to the skier's right of the gully — the south-west flank, which holds about 37 degrees for 600 metres. From the summit the ground falls 1303 to 1031 to 834 to 717 m towards the south-west, that is 36 to 38 degrees over the first 470 metres. It is sustained steep skiing in one run.",
      "The usual mistake: assuming \"straight down towards Ørsta\" means west. Directly west of the col the angle is 14 to 17 degrees, but that holds only down at the col: from 1270 m upwards the west flank measures 24 to 45 degrees, and directly west of the summit 32 to 47. Either way, west is a different side of the mountain from the one that takes you back to the car. The descent faces south-west, and Fri Flyt notes possible crevassing in the gullies on the west side.",
      "The second mistake is measuring the tour by how short it is. 1157 metres of climbing from the centre of a town does not make the mountain gentle — the avalanche terrain starts in Skåla and continues the whole way up.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "It is avalanche terrain from Skåla and all the way up. The south ridge is steep enough that a slip on hard snow has a long runout: the crest from 1135 m upwards holds about 32 degrees on average, with its steepest section around 1266 m at 37 degrees. The figures for the skin track itself are lower — 33.7 degrees at its steepest and 23.2 on average for the 1200 to 1300 m band — because the track switchbacks across the ridge.",
      },
      {
        title: "The terrain around it",
        body: "There are cornices along the summit crest, so the edge is not a viewpoint. The south-west flank, which is the descent, holds about 37 degrees for 600 metres — 36 to 38 degrees over the first 470 from the summit. Fri Flyt notes possible crevassing in the gullies on the west side. The mountain stands directly above the centre of Ørsta, but it is not a gentle tour, and it is for experienced parties.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "149 m",
      endLabel: "1303 m",
      distanceLabel: "4.1 km",
      caption: "1157 metres of climbing and 4.00 km from the waterworks in Ørsta, with the last 170 metres of the south ridge at 33–39 degrees.",
    },
  },
  slogen: {
    intro:
      "The queen of the Sunnmøre Alps, and one of the most serious tours in the region. 1535 vertical metres from Norangsdalen to a summit most people walk the last 350 metres to.",
    ascent: [
      "From the lay-by at Skylstad in Norangsdalen, 85 m, you climb straight up Brekkheida. Stay west of Brekkeelva the whole way through the forest — the river runs a couple of hundred metres east of the line, and you only meet the watercourse up on the flat around 700 m. This is the steepest part of the forest: the hundred metres between 200 and 300 m average 21.9°, and the hundred below, 100 to 200 m, 19.0°.",
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
        body: "The forest section above Brekkheida is steepest between 200 and 300 m, averaging 21.9°. The steepest single step on the whole line measures 46.9°, and it is not in the forest — it is the summit block above 1520 m, the part where the skis are carried anyway. The ridge from Pukkelen to høgde 1204 is mild: its flanks run 26–35°. It is the top 250 vertical metres that are a crest — 43–57° on the north side, 49–50° on the south. There the real hazard is a slip rather than a slab, and that is why the skis get carried.",
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
      startLabel: "85 m",
      endLabel: "1564 m",
      distanceLabel: "6.5 km",
      caption: "85 m at Skylstad to 1564 on Slogen — 1520 vertical metres over 5.81 kilometres, the last 350 on foot.",
    },
  },
  torvloysa: {
    intro:
      "1469 metres of climbing over 11.13 km from Hatlestad — one of the longest tours above Norddal, and one of the gentlest. The steepest sustained section measures 27.2 degrees, and five kilometres of the route lie on the ridge from Daurmålsfjellet to the summit.",
    ascent: [
      "Start at the mapped car park at Hatlestad, 453 m, above Norddalen. Fri Flyt says you park at 350 m; the terrain model reads the farms at 412 and the car park at 453, and that difference is why this tour measures 1469 metres of climbing and not 1500.",
      "Walk gently into the mouth of Dyrdalen and up to Rellingsætra at 557 m. The first two bands are nearly flat — 3.0 degrees from 400 to 500 m and 2.1 over 2656 metres of ground from 500 to 600.",
      "From the seter the step climbs onto Daurmålsfjellet, 825 m: 15.4 degrees from 600 to 700 m and 15.5 from 700 to 800. The forest holds to 800 m. This is the steep part of the tour, and it is short.",
      "Then comes the ridge. Five kilometres of gentle ground, over the ridge point at 1186 m, with bands between 7 and 16 degrees the whole way: 7.0 from 1000 to 1100 m, 15.5 from 1200 to 1300, 16.4 from 1700 to 1800 — the steepest hundred-metre band — and 9.9 for the last hundred to the cairn at 1851 m. Kartverket registers no glacier terrain anywhere on the line itself: every point between 1380 and 1520 m is open ground. The nearest cell classed as glacier lies about 300 metres off the route, at 1482 m.",
    ],
    descent: [
      "Back down the same ridge: north to Daurmålsfjellet, down the step to Rellingsætra and out Dyrdalen to Hatlestad. The descent faces north, and it is long and even rather than steep.",
      "The usual mistake: turning back too late. Ten kilometres without shelter, with most of the height far from the car, means a change in the weather costs more here than on a short tour — the decision to turn has to be made early, not when you are on the ridge watching it close in.",
      "The second is the sides of the ridge. It is broad enough that you stop thinking about its edges, but it falls away beyond them: from the cairn, west measures 40.9 degrees on average over 500 metres, south-west 36.2 and south-east 35.2, with 60-metre windows of 49.3, 54.4 and 47.5. North and east, which is the way home, hold 9.0 and 9.3 degrees. Ten kilometres in cloud on a ridge that is gentle in two directions and steep in six is a navigation problem, not a tour to improvise.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Gentle at both ends and steep in exactly one place: the step from Rellingsætra onto Daurmålsfjellet. The steepest hundred-metre band, 1700 to 1800 m, measures 16.4 degrees and the steepest sustained section 26.9 degrees between 1488 and 1508 m. The rest of the ridge lies between 7 and 16 degrees.",
      },
      {
        title: "The terrain around it",
        body: "The ridge is broad and gentle, but its sides are not: west measures 40.9 degrees on average from the cairn, south-west 36.2 and south-east 35.2. North and east — the way home — hold 9 degrees. It is the length and the navigation that are the real danger here: ten kilometres from the car in bad weather is a different tour from ten kilometres in sunshine.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "453 m",
      endLabel: "1851 m",
      distanceLabel: "11.1 km",
      caption: "1469 metres of climbing and 11.13 km from Hatlestad over Rellingsætra and Daurmålsfjellet, with the treeline at 803 m and the ridge from 1186 m to the cairn.",
    },
  },
  skarene: {
    intro:
      "1226 metres of climbing over 6.59 km from Korsmyra, with two kilometres of flat valley floor before the big snow flank begins. The flank holds 18 to 21 degrees band after band from 900 to 1700 m — and it is continuous avalanche terrain the whole way.",
    ascent: [
      "Start at the car park on Korsmyra, 621 m, on the main road between Eidsdal and Geiranger. Fri Flyt describes the access under Eidshornet, and it is the same place.",
      "Follow the seter road in to Grandesætra at 648 m and on gently into and up Gråsteindalen, 721 m. The first two bands are almost flat: 3.7 degrees over 1268 metres of ground from 600 to 700 m and 3.6 over 1575 metres from 800 to 900.",
      "Coming in toward the head of the valley at 940 m the big snow flank begins, and it holds the same character all the way up: 17.9 degrees from 900 to 1000 m, 20.5 from 1000 to 1100, 19.6 from 1300 to 1400, 21.2 from 1500 to 1600 and 21.2 from 1600 to 1700 — the two steepest hundred-metre bands. The steepest sustained section measures 27.9 degrees between 1528 and 1544 m.",
      "The last hundred metres of climbing ease to 9.6 degrees and lead to the cairn at 1830 m, one of the highest points in the mountains above Eidsdal. The register spells the mountain Skorene.",
    ],
    descent: [
      "Back down the same flank and out Gråsteindalen to Grandesætra and Korsmyra. Fri Flyt calls this fine ski terrain with forgiving angles, and the numbers agree: no band above 21.3 degrees.",
      "The usual mistake: reading those forgiving angles as a reason to go on an unstable day. The whole stretch from the head of Gråsteindalen upward is avalanche terrain, the flank is large and continuous, and there is no line around it — this tour belongs to stable days, and that is the whole assessment.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A continuous snow flank from 940 m to the summit, with bands between 17.9 and 21.2 degrees and a steepest sustained section of 27.9 degrees between 1528 and 1544 m. The angle is moderate; it is the size and the continuity that are the problem.",
      },
      {
        title: "The terrain around it",
        body: "Avalanche terrain from the head of Gråsteindalen all the way to the summit. The flank is large and unbroken, and there is no line around it: if you do this tour, you are on it. And the summit is not gentle on its far side: west measures 40.0 degrees on average over 500 metres with a 67.7-degree window, north-west 29.5 with 70.4 and north-east 37.7 with 65.6. South and south-east — the flank you climbed — hold 13 degrees.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "621 m",
      endLabel: "1830 m",
      distanceLabel: "6.6 km",
      caption: "1219 metres of climbing and 6.44 km from Korsmyra over Grandesætra and Gråsteindalen, with the snow flank from the valley floor at 940 m to the cairn at 1830.",
    },
  },
  melshornet: {
    intro:
      "565 metres of climbing over 3.30 km from Helgatun, on a groomed and marked track that is skied after dark all winter. The steepest sustained section measures 23.8 degrees, and it sits just above the treeline at 454 m — not up under the cairn.",
    ascent: [
      "Start at the large car park by Helgatun on Krøvelseidet, 252 m, on fv5894 Vikebygdvegen between Volda and Åmdalen. The track leaves the car park straight into the forest. It is groomed with a snowcat at times, and the final slope is marked with snow poles.",
      "The first hundred and fifty metres of climbing are gentle: the band from 200 to 300 m averages 5.3 degrees over 580 metres of ground, and 300 to 400 m runs at 12.0. The forest lets go at 454 m, and the steepest step of the whole tour sits just below the treeline — 23.8 degrees over thirty metres, between 458 and 472 m.",
      "Above the treeline it flattens out toward the ridge at 519 m. The band from 500 to 600 m is the gentlest on the tour, 6.7 degrees over 855 metres of ground, and from here you can see where the rest of the route goes.",
      "The ridge climbs evenly to the top: 12.9 degrees from 600 to 700 m and 13.1 from 700 to 800. The last metres to the cairn at 809 m are flat — the band above 800 m measures 7.0 degrees.",
    ],
    descent: [
      "Back down the same track, south-east. It is the same slope you climbed, short and open, and the car is in sight for most of the way down.",
      "The usual mistake on this hill is not a line choice but a timing one: the tour is skied in the dark all winter, and then the trail and the snow poles are the navigation. Leave the track and the flanks of Grøthornet are avalanche terrain, and near the summit there can be a cornice out toward Ørsta.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A groomed, marked track in gentle terrain. The steepest sustained section measures 23.8 degrees and sits low, between 458 and 472 m just below the treeline; above 500 m the tour is at its gentlest with 6.7 degrees on average from 500 to 600 m, and the steepest hundred-metre band, 400 to 500 m, measures 13.6.",
      },
      {
        title: "The terrain around it",
        body: "The flanks of Grøthornet are avalanche terrain, and near the summit a cornice can build out toward Ørsta. Both lie off the trail corridor — and both become relevant the moment you leave it in poor visibility or after dark.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "252 m",
      endLabel: "809 m",
      distanceLabel: "3.3 km",
      caption: "559 metres of climbing and 3.00 km from Helgatun on Krøvelseidet, with the treeline at 454 m and the steepest hundred-metre band between 400 and 500 m.",
    },
  },
  jakta: {
    intro:
      "1569 metres of climbing from the fjord in under five kilometres, most of it in one unbroken push. From Konedalen a flank leads onto a narrow summit ridge — 25 to 33 degrees low down, 40 to 50 over the last 200 metres with cornices towards Konedalen and a roughly 80-degree wall down to the Hjørundfjord on the other side.",
    ascent: [
      "From the road end at Lisjeholen south of the Norang farms, 61 m, take the steep path up to Konedalen with the skis on your pack — first on the left bank of the river, then across to the right. The forest ends around 296 m and the ground is open from about 400. This is the part of the tour that is not a ski tour, and it climbs at 20 to 22 degrees on average.",
      "Up in the valley you put the skis on and follow the gentle valley floor south-west to about 740 m. Keep to the south-east side on the way in: avalanches run off Jakta the whole length of Konedalen, and the valley floor is the runout.",
      "At 740 m you turn right and switchback up the flank to the north-west until you reach the summit ridge at 1240 m. The flank is not uniform: low down it holds 25 to 33 degrees, but over the last 200 metres up to the ridge the fall line measures 40 to 50. This is the big avalanche trap on the tour: a continuous slope of 300 to 400 metres, and it is also the descent. The line as drawn holds 35.0 degrees as its steepest sustained section — the switchbacks are what make that number lower than the fall line.",
      "The ridge is followed south-west all the way to the top at 1589 m. Stay on the crest. The steepest hundred-metre band on the tour lies between 1500 and 1600 m and averages 24.6 degrees, but the angle is not the problem on the ridge — the width is: a cross-section at 62.1715 north gives 1556 m on the crest and 1265 m just 52 metres to the north-west.",
    ],
    descent: [
      "The usual descent is back the same way: 45 to 50 degrees for the first 200 metres off the ridge, then 30 to 35 down towards Konedalen and gentler on out the valley, and finally the path down to Lisjeholen with the skis on your pack again. The flank down from the ridge is the best skiing on the tour and at the same time the steepest and most avalanche-prone ground you touch.",
      "The usual mistake: reading the cornices by \"left and right\" instead of by compass. Fri Flyt writes of cornices both right towards Konedalen and left down the north face, but that describes the descent — on the way up Konedalen lies to the south-east and the fjord wall to the north-west. The north-west side is not a mistake you can correct on the move: DTM1 measures roughly 80 degrees directly below the summit, a drop of nearly 290 metres in 52 metres of ground.",
      "The second mistake is going too far up the valley before turning off. The route turns uphill at about 740 m, 1.6 kilometres from the road end. The first draft of this route turned uphill at the valley head further in, and that line measures 40 to 44 degrees between 1030 and 1205 m. The flank at 62.174 to 62.176 north is the one that holds 33 to 36 all the way to the ridge.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The flank from Konedalen up to the summit ridge is the big avalanche trap: 25 to 33 degrees low down and 40 to 50 over the top 200 metres, in one continuous slope of over 400, and you pass through it both ways. Avalanches run off Jakta the whole length of Konedalen, so keep to the south-east side going in. The steepest sustained section on the line measures 35.0 degrees, and the steepest hundred-metre band, 1500 to 1600 m, 24.6 degrees on average.",
      },
      {
        title: "The terrain around it",
        body: "The summit ridge is corniced on both sides — towards Konedalen to the south-east, and towards the north-west wall down to the Hjørundfjord, where DTM1 measures roughly 80 degrees directly below the summit: 1556 m on the crest and 1265 m 52 metres to the north-west. A cornice failing on that side has no runout you would survive. Staying on the crest from 1240 m upwards is the only line without a cliff or a 35-degree slope beneath it.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "61 m",
      endLabel: "1589 m",
      distanceLabel: "4.8 km",
      caption: "1569 metres of climbing and 4.78 km from Norang, with the 33–36 degree flank from Konedalen up to the summit ridge as the crux.",
    },
  },
  skarasalen: {
    intro:
      "1452 metres of climbing in one push from the toll barrier in Bondalen, and the main slope in the middle of the tour runs right alongside a gully that empties towards the summer-farm road every winter. The summit plateau is easy once you are on it — it is the way there, and the cornices over the east wall, that make this demanding.",
    ascent: [
      "From the barrier on Kvistadvegen above the Kvistad farms, 104 m, follow the winter-closed farm road some 3.7 kilometres south and inland up Kvistaddalen to the car park in front of Kvistadsætra and Årsetsætra, 509 m. Those 405 metres up the road are gentle — the bands from 100 to 500 m average 5 to 7 degrees — and if the barrier has opened in late April or early May you can drive them and cut both the kilometres and the height.",
      "From the farms the route climbs north-east through open birch forest. The forest holds to around 693 m and the ground is open from 696.",
      "Then comes the main slope: up towards the col between Blåhornet and Skårasalen, 1074 m, north of and alongside the avalanche gully east of Blåhornet. The slope holds 30 to 40 degrees from about 800 to 1100 m. The line as drawn switchbacks and holds 26.7 degrees as its steepest sustained section, with the 900 to 1000 m band at 19.3 degrees — but the gully beside you is the same whatever the track does.",
      "Over the col you turn east-north-east up the main slope towards the ridge and onto the summit plateau at 1448 m, and the last stretch south along the plateau to the summit at 1542 m. The line comes onto the plateau from the north-west deliberately: east of the crest the mountain falls 300 metres in 74 metres of ground, roughly 76 degrees, into Skåradalen.",
    ],
    descent: [
      "Back the same way: north-west off the summit onto the plateau, west along the plateau and down the main slope to the col, the big slope down towards the farms and the road out. Allow time for the last 3.7 kilometres — they are flat enough that you pole them.",
      "The usual mistake: holding too far east on the summit plateau — and taking south-west for the way down. South-west of the summit are the Vestrennene at 45 degrees; the line goes north-west. The cornices sit to the east, and beneath them the east wall drops 300 metres in 74. In flat light the crest is invisible, and the plateau offers no other reference.",
      "The Vestrennene gullies down to Årsetsætra are 45 degrees and are not part of this route. The third documented descent, Lisje Skåradalen towards Skår on the Hjørundfjord, is 25 to 30 degree crust terrain — but it ends at the fjord, not at your car in Bondalen.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The gully east of Blåhornet usually runs one or more large avalanches down towards the farm road each winter, and the ascent passes right beside it. The slope holds 30 to 40 degrees from about 800 to 1100 m, and it is the crux of the tour both up and down. The line itself measures 26.7 degrees as its steepest sustained section because it switchbacks; that does not change what lies above the track.",
      },
      {
        title: "The terrain around it",
        body: "Large cornices sit on the east side of the summit plateau, where the mountain falls 300 metres in 74 into Skåradalen — roughly 76 degrees. Keep well back from the crest. The Vestrennene gullies, a documented descent for other parties, are 45 degrees and lie outside this route.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "104 m",
      endLabel: "1542 m",
      distanceLabel: "7.5 km",
      caption: "1438 metres of climbing and 7.62 km from the barrier on Kvistadvegen, the first 3.7 kilometres of it closed farm road and 405 metres of height.",
    },
  },
  kvitegga: {
    intro:
      "1477 metres of climbing over 6.05 km from Nibbedalen to the highest mountain in the central Sunnmøre Alps. The steepest sustained section measures 38.1 degrees — that is Brattbakken, and it is the one technical part of the tour.",
    ascent: [
      "Start in the gravel pit in Nibbedalen, 324 m, where the side road leaves county road 655. If the road is not ploughed, park along the county road. The first 771 metres of ground lie at 5.9 degrees.",
      "Follow the gravel road a short way and then the summer path south-west into Snødalen — the route description says west, but the leg measures 210 degrees. The climbing is even and sustained: 20.1 degrees from 500 to 600 m, 19.6 from 600 to 700 and 19.0 from 700 to 800. At 925 m you are inside the valley itself.",
      "At its head Brattbakken begins — the slope up to 1316 m that the route description puts at about 35 degrees. The terrain model measures the band from 1100 to 1200 m at 22.5 degrees on average and the steepest sustained section at 38.1 degrees between 1265 and 1292 m. Kartverket registers glacier terrain from 1290 m.",
      "Above the slope the glaciated plateau lays back: 10.2 degrees from 1200 to 1300 m and 5.6 from 1500 to 1600 over 1036 metres of ground. Follow it to the 1583 m top, drop through a small col and head north along the ridge to the summit at 1700 m. The published 1717 is the snow dome; the terrain model reads the mountain at 1700.",
    ],
    descent: [
      "Back the same way: south along the ridge, across the plateau and down Brattbakken into Snødalen. The descent faces east — but that is the way home, not the first move: from the cairn the route runs south along the ridge to the high point at 1583 m before it turns down. Due east of the summit the flank measures 39.2 degrees on average with a 73.1-degree window 190 to 250 metres out, and that is not a descent. Brattbakken is the part of the proper descent that decides whether the day is a ski tour or an exercise in edge control.",
      "The usual mistake: treating the glacier casually. The route crosses glacier terrain from 1290 m, and the crevasses are there however gently the plateau measures. The second is the cornices along the summit ridge — keep away from the edges, especially in poor visibility.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "An even 19 to 20 degrees through Snødalen, and then Brattbakken: the band from 1100 to 1200 m averages 22.5 degrees and the steepest sustained section 38.1 degrees between 1265 and 1292 m. The slope is avalanche terrain, and it is the only way up onto the plateau.",
      },
      {
        title: "The terrain around it",
        body: "Glacier terrain from 1290 m with crevasses late in the winter and into spring. Large cornices along the summit ridge — keep away from the edges. The plateau is gentle enough that you stop reading the terrain, and that is exactly where the glacier is.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel, and glacier kit — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "324 m",
      endLabel: "1700 m",
      distanceLabel: "6.1 km",
      caption: "1477 metres of climbing and 6.05 km from the gravel pit in Nibbedalen through Snødalen, over Brattbakken and the 1583 m top to the summit.",
    },
  },
  hornindalsrokken: {
    intro:
      "1466 metres of climbing over 7.29 km from Langøylia, along a south ridge that rises and falls — 327 metres are given back on the way up. The last 103 are on a narrow, exposed rib where the steepest sustained section measures 46.6 degrees, and that is where most people take the skis off.",
    ascent: [
      "Start at the west end of the cabin road in Langøylia, 388 m, between Hellesylt and Hornindal. Climb the slope through open birch forest, east of Gjøelva; the forest holds to 673 m, and the band from 600 to 700 m measures 18.9 degrees.",
      "At Aksla, 921 m, you are on the ridge. Follow it north-west to Trollaksla, 1255 m, and then the south ridge north to Sætrenibba at 1370 m. The ridge rises and falls the whole way: the bands from 1100 to 1300 m measure 3.7 and 3.5 degrees over more than three kilometres of ground between them, and the tour gives back 327 metres of height in total.",
      "From the col north of Sætrenibba, 1226 m, you round east into the flank falling toward Kjellstaddalen and traverse it up to the ridge east of the summit. This is avalanche terrain, and it is the same flank you ski down.",
      "At about 1424 m you are on the east rib, and that is where most people take the skis off. The last 103 metres of climbing are narrow, exposed ridge: the band from 1400 to 1500 m averages 23.3 degrees, the steepest sustained section 46.6 degrees between 1476 and 1508 m, and the terrain model gives about 55 degrees straight east of the crest and 75 straight west.",
    ],
    descent: [
      "The usual descent is Kjellstaddalen: almost a thousand metres at 25 to 35 degrees down to Kjellstadsætra, then a couple of flat kilometres out the valley and west back to the car. The descent faces east.",
      "The usual mistake: treating the summit ridge as ski terrain. The last 103 metres of climbing are a crest with 55 degrees down one side and 75 down the other — a slip there cannot be corrected, and an ice axe is standard when the snow is hard.",
      "The second is starting too late. The tour is long, the ridge rises and falls, and the traverse across the east side above Kjellstaddalen is avalanche terrain that changes with the sun. The decision to turn has to be made early.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A long ridge that rises and falls, and a traverse across the east flank above Kjellstaddalen. The band from 1400 to 1500 m averages 23.3 degrees, and the steepest sustained section measures 46.6 degrees between 1476 and 1508 m — that last one is the east rib, not the skin track.",
      },
      {
        title: "The terrain around it",
        body: "Avalanche terrain in the floor of Kjellstaddalen and across the whole east side up to the summit ridge — that is both the traverse on the way up and the descent. The summit ridge is narrow and corniced: about 55 degrees straight east and 75 straight west over the last hundred metres of climbing.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel, and an ice axe when the snow is hard — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "388 m",
      endLabel: "1527 m",
      distanceLabel: "7.3 km",
      caption: "1466 metres of climbing and 7.29 km from Langøylia over Aksla, Trollaksla and Sætrenibba, with the east rib from 1424 m as the stretch most people walk.",
    },
  },
  sunndalsnipa: {
    intro:
      "989 metres of climbing over 5.56 km from Grøndalsvatnet, up a south-east ridge and out onto a plateau where the last 1261 metres of ground lie at 4.2 degrees. South-facing and reachable all winter — the road in is open year round.",
    ascent: [
      "Start at the end of the road by Grøndalsvatnet, 437 m, up the hills from Osdalen. The first 638 metres of ground are gentle, 5.7 degrees, crossing bog and into open birch forest.",
      "Head north through the forest — Kartverket has forest to 722 m — and up onto the south-east ridge. The climbing increases steadily: 14.7 degrees from 500 to 600 m, 15.6 from 600 to 700 and 19.6 from 700 to 800, the steepest hundred-metre band of the tour.",
      "At the forest edge at 839 m it flattens markedly: the band from 800 to 900 m measures 5.2 degrees over 1035 metres of ground. Then the ridge picks up again, 14.0 degrees from 900 to 1000 m and 17.3 from 1100 to 1200, with the steepest sustained section at 29.0 degrees between 1073 and 1094 m.",
      "From 1280 m you are on the plateau, and from there it is about a kilometre north to the summit cairn at 1395 m — the band from 1300 to 1400 m measures 4.2 degrees. Hold the middle of the plateau: both the west and east sides fall steeply.",
    ],
    descent: [
      "Back down the same ridge, south across the plateau and down through the birch forest to Grøndalsvatnet. The descent faces south, the sunny side — the surface changes quickly through a spring day.",
      "The usual mistake: drifting toward the edge of the plateau in cloud. Both the west and east walls fall steeply from the plateau, and on ground lying at 4.2 degrees there is no slope to tell you that you are going wrong.",
      "The second is the south flank. Fri Flyt mentions it as a steeper descent on stable days; it is avalanche terrain, and it is a choice of its own — not a shortcut off the plateau.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Gentle at both ends and even in the middle: the steepest hundred-metre band, 700 to 800 m, measures 19.6 degrees, and the steepest sustained section 29.0 degrees between 1073 and 1094 m. The plateau from 1300 to 1400 m lies at 4.2 degrees over 1261 metres of ground.",
      },
      {
        title: "The terrain around it",
        body: "Steep west and east walls off the plateau — a navigation trap in cloud and drifting snow rather than an avalanche problem in itself. The south flank is the steeper descent, and it is avalanche terrain.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "437 m",
      endLabel: "1395 m",
      distanceLabel: "5.6 km",
      caption: "989 metres of climbing and 5.56 km from Grøndalsvatnet up the south-east ridge, with the treeline at 722 m and a kilometre of flat plateau to the cairn.",
    },
  },
  eidskyrkja: {
    intro:
      "1115 metres of climbing over 4.56 km from Skinnviksætra up the Blåbreen glacier, an even ice slope that lays back gradually toward the summit plateau. The steepest sustained section measures 22.9 degrees — it is the crevasses and the navigation, not the angle, that make this tour complex.",
    ascent: [
      "Start on the seter road by Skinnviksætra, 368 m, on the north side of Austefjorden. The road in is a toll road, and the tour counts as reachable once it opens — which is why the season reads March to May.",
      "Head south and up toward the glacier. The ground is open the whole way; there is no forest on this route. The climbing is even: 14.1 degrees from 400 to 500 m, 15.5 from 500 to 600 and 16.1 from 700 to 800.",
      "From about 1197 m you are on Blåbreen. The steepest hundred-metre band sits just below, 1000 to 1100 m averaging 18.3 degrees, and the steepest sustained section measures 22.9 degrees between 1166 and 1179 m. Kartverket registers glacier terrain on the line from 1409 m.",
      "The last kilometre is a gentle climb south to the summit cairn at 1482 m: 13.9 degrees from 1300 to 1400 m and 11.0 above that. Hold the middle of the glacier.",
    ],
    descent: [
      "Back down the same line, north across the glacier and down to Skinnviksætra. The descent faces north, and in spring conditions you can also traverse toward Lisje Eidskyrkja — that is a variant, not the normal route.",
      "The usual mistake: drifting west on the glacier. The crevasses lie on the west side, and so do the avalanche runouts. Hold the middle and the angle is moderate the whole way; leave the centre line and the tour changes character.",
      "The second is the summit area in cloud or drifting snow. The plateau is wide and flat, and navigating up there is the one technical demand this tour actually makes.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Moderate angles and a glacier. The steepest hundred-metre band, 1000 to 1100 m, measures 18.3 degrees and the steepest sustained section 22.9 degrees between 1166 and 1179 m; glacier terrain is registered from 1409 m on the line. Avalanche danger is small if you hold the middle of Blåbreen.",
      },
      {
        title: "The terrain around it",
        body: "Crevasses on the west side of the glacier, and avalanche runouts in the same area. The summit plateau is a navigation trap in cloud or drifting snow — that is where the tour asks most of you, and the angle is not the reason.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Sunnmøre at varsom.no. Bring a transceiver, probe and shovel, and glacier kit — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "368 m",
      endLabel: "1482 m",
      distanceLabel: "4.6 km",
      caption: "1115 metres of climbing and 4.56 km from Skinnviksætra over Blåbreen, with glacier terrain registered from 1409 m and a wide summit plateau on top.",
    },
  },
  rondslottet: {
    intro:
      "Rondane's highest. A long day where the first six kilometres are pure approach — the mountain starts behind Rondvassbu, and the last 240 metres of climbing run along a narrow ridge.",
    ascent: [
      "From Spranget car park, 1082 m, it is six kilometres in to Rondvassbu. Tjønnbakkvegen in here is a toll road, and in midwinter Mysusæter is the last ploughed point — which makes the tour correspondingly longer. You are above the treeline from the first metre, so it is open mountain the whole way in. Keep to land around the bay at Lonin at the south end of Rondvatnet rather than taking the shortcut over the ice; this is the outlet end, and the ice is thinnest there. The line here has been moved to do exactly that: it runs west of the bay, over land, and no longer has a single vertex on water. It did have — ninety metres on the ice, up to fifty metres from shore, seventy metres from Lonin — underneath that very sentence.",
      "Behind Rondvassbu, 1169 m, it climbs steeply to the north-east. The path junction for Storronden comes early, and your line is the one continuing north into Rondholet. The cirque sits at around 1500 m and is flat — it is the last flat ground you get before the summit.",
      "Out of Rondholet it goes very steeply up through scree towards Firkløvereggen, the ridge between Storronden and Vinjeronden at 1869 m. The steepest hundred-metre band of the whole ascent is here, between 1600 and 1700 m, holding a mean 22°. If the scree is blown bare, carry the skis up to the ridge.",
      "From there it rises to Vinjeronden, 2043 m. The route then drops a good hundred metres into Slottsbrue, the col at 1939 m, before climbing the ridge to Rondslottet, 2178 m. The ridge is good going, but it is narrow: stay in the middle of it. The ground falls 33–38° to the west and over 45° to the east.",
    ],
    descent: [
      "Back the same way — over the ridge, down into Slottsbrue, and up the hundred metres to Vinjeronden again. That re-ascent comes late in the day and takes longer than it looks; account for it before you decide how long to stay on top.",
      "The common mistake: dropping west off the ridge to avoid the re-ascent over Vinjeronden. The west side of the ridge between Slottsbrue and the summit falls 33–38° for close to three hundred vertical metres, down into Styggebotn and on towards Rondvatnet. It does not ease off until below 1700 m, and until then you are hanging in one continuous steep flank under a ridge. It is no shortcut — hold the ridge until you are back in the col.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "From Spranget in to Rondholet the terrain is open and gentle, and you are above the treeline throughout. The steepest hundred-metre band on the ascent lies between 1600 and 1700 m and holds a mean 22° — the scree up towards Firkløvereggen. Past Vinjeronden the route drops into Slottsbrue and climbs back onto a narrow ridge, with steep flanks immediately either side of the track.",
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
      distanceLabel: "12.3 km",
      caption: "12.3 km and 1281 vertical metres from Spranget. A hundred of them are given back at Slottsbrue and have to be re-climbed on the ridge.",
    },
  },
  glitregga: {
    intro:
      "906 metres of climbing over 4.45 km from the sports ground in Randabygd, south-facing and even the whole way. The steepest sustained section on the line measures 23.8 degrees — a full day in vertical metres and an easy one in angle.",
    ascent: [
      "Start at the car park by the sports ground in Randabygd, 398 m on Ålandsleite. Follow the gravel road north-east; the first kilometre is nearly flat, with the band from 400 to 500 m at 5.4 degrees over 1125 metres of ground.",
      "At Djupegrova, 487 m, the route turns north and north-west and stays on the west side of the gully throughout. The first steeper section comes here: 15.7 degrees on average from 500 to 600 m.",
      "The forest holds to 748 m. Above it the ground eases for a while before the climb picks up again toward the pass: 15.7 degrees from 800 to 900 m and 18.5 from 900 to 1000, which is the steepest hundred-metre band of the tour. The steepest sustained section measures 23.8 degrees and lies between 1280 and 1297 m.",
      "From the marked pass you head east to the summit. The last hundred metres of climbing are gentler again, 11.6 degrees from 1200 to 1300 m, and the cairn stands at 1297 m.",
    ],
    descent: [
      "Back the same way: east down to the pass, south-west down the open flank and back along Djupegrova to the sports ground. Facing south means the surface can change quickly through the day in spring.",
      "The usual mistake: skiing straight off the summit instead of working back to the pass. Directly below the top of Glitregga the ground is steep, and it is the one place on this tour where the line has to be the described one.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Even and open: the steepest hundred-metre band, 900 to 1000 m, measures 18.5 degrees, and the steepest sustained section 23.8 degrees between 1280 and 1297 m. It is the length and the 901 metres of climbing that make this demanding, not the angle.",
      },
      {
        title: "The terrain around it",
        body: "The steep ground below the summit is to the north: 26.3 degrees on average over 500 metres with a 37.8-degree window 250 to 310 metres out, and north-west and north-east 20.3 and 21.0. South, east and west are nearly flat — 2.8, 8.9 and 1.8 degrees — so it is the north side, and only that side, the line over the col keeps you away from, both up and down. The flank into Djupegrova is the other place where a line choice has consequences, because the gully collects snow from the whole face above.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for the area at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "398 m",
      endLabel: "1297 m",
      distanceLabel: "4.5 km",
      caption: "901 metres of climbing and 4.38 km from Randabygd sports ground, with the treeline at 748 m and the steepest hundred-metre band between 900 and 1000 m.",
    },
  },
  storronden: {
    intro:
      "1145 metres of climbing from Spranget, but the mountain only begins after six kilometres: the approach to Rondvassbu gains 132 metres, and the rest comes in 2.6 kilometres up the west ridge. Easier than Rondslottet from the same car park — no arête, no reclimbing.",
    ascent: [
      "From Spranget car park, 1082 m, follow the Rondvassbu road six kilometres north-east: over 1137 m, through the valley south-west of the hut and on to Rondvassbu at 1214 m. The band between 1100 and 1200 m averages 1.3 degrees over four and a half kilometres. Around the bay at Lonin at the south end of Rondvatnet, keep to the land rather than taking the short cut over the ice.",
      "Note the trailhead: the toll road to Spranget is not ploughed, and the car park is officially open from mid-June. In March–May, Mysusæter is the last ploughed point — 4.5 kilometres and a hundred metres lower, and they come on top of everything described here.",
      "Behind the hut it climbs steeply north-east to the path junction at 1440 m. This is where the tour parts company with Rondslottet: that route continues north into Rondholet, while Storronden turns right and east onto the west ridge.",
      "From the junction to the summit is 698 metres over 2.85 kilometres along the line, monotonically rising and with no height given back. The steepest hundred-metre band lies between 1900 and 2000 m and averages 20.7 degrees; the steepest sustained section on the line is 25.7 degrees. The ridge is stony, and the scree often blows bare — then the skis are carried for the last stretch to the cairn at 2139 m.",
    ],
    descent: [
      "Down the west ridge to the junction, down the pitch to Rondvassbu and then the six kilometres out to Spranget. The descent faces south-west: bearings between 225 and 255 degrees hold 26 to 32 degrees, and that is the sector the route uses.",
      "The usual mistake: dropping due west from the summit because that is where the car is. Due west looks gentle from the cairn — under 26 degrees for the first six hundred metres — and then breaks over at 46 to 57. North is the same trap: four or five hundred metres under 20 degrees, then 48 to 64 down into Rondholet. East and south-east are the steepest and the closest, 56 to 67 degrees right beside the gentle ridge you came up. The second mistake is letting the ground pull you north towards Rondholet from the summit.",
      "The last six kilometres are flat. Expect to pole them, and expect them to take longer than they look from the summit when you can see the hut.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The west ridge is gentle and easy to read: 698 metres over 2.85 kilometres, a steepest sustained section of 25.7 degrees, and a steepest hundred-metre band, 1900 to 2000 m, of 20.7 degrees. There is no arête and no reclimbing on the route. Stay on the ridge from the junction upwards — it is the one gentle side of the mountain.",
      },
      {
        title: "The terrain off it",
        body: "East and south-east fall 56 to 67 degrees right beside the cairn. North and west are another matter, and a more dangerous one: both look gentle from the summit — north holds under 20 degrees for four or five hundred metres and west under 26 for six hundred — before breaking over at 48 to 64 degrees down into Rondholet and 46 to 57 to the west. Those are terrain traps, not walls you can see. Rondane lies in the Nord-Gudbrandsdalen forecast region, which is a B region on varsom.no: forecasts there are published only at danger level 4–5, so an empty page does not mean the hazard has been assessed and found low. That makes your own observation matter more here than in the regions with a daily forecast.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Nord-Gudbrandsdalen at varsom.no, and remember the region is only forecast at danger level 4–5. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1082 m",
      endLabel: "2139 m",
      distanceLabel: "10.3 km",
      caption: "1145 metres of climbing and 10.26 km from Spranget, 698 of those metres in the last 2.85 kilometres up the west ridge.",
    },
  },
  skala: {
    intro:
      "From Tjugen in Loen to 1848 m: 1818 vertical metres in one unbroken climb, and one of the longest descents in the country. The tour asks for fitness and visibility, not steep-skiing technique.",
    ascent: [
      "From the Tjugen car park on Lodalsvegen, 34 m, follow the tractor road that becomes Kloumannstien and climbs into Fosdalen. The car park charges, paid by Vipps to Skåla Parkering — it is the same one used for the Skåla Opp race. The first 540 metres are on road; then the path takes over. The forest lets go at around 426 m, at Tyvasætra, and from mid-May reckon on carrying your skis up to Tjugensætra at about 750 m.",
      "You cross the river at around 650 m. The path swings north for a stretch before working back south — follow it; the gorge below is not something to cut across. Then come about 400 vertical metres of steady climbing up toward Skålavatnet. The path works up the hillside in bends, and no hundred metres on this stretch holds more than 18°.",
      "You pass Skålavatnet on its northwest side, 1141 m, and continue southeast into the basin. From there take up to the left onto the broad ridge toward Sandsnibba. The steepest hundred metres on the whole line sit between 1500 and 1600 m and hold 21.2° on average, with 20.2° in the band below; the steepest single step measures 26.9°.",
      "Skålabu and Skålatårnet stand at 1835 m, where the path formally ends. The summit is 370 metres further east, flat plateau the whole way. In poor visibility: hold the ridge. It is easy walking, but it falls steeply on both sides — 56° on average over the first 200 metres to the northwest, 42° to the south — and the cornice hangs out over the northwest edge.",
    ],
    descent: [
      "You go down the same line: across the plateau, out along the ridge, into the basin and past Skålavatnet on the northwest side, then down Fosdalen. 1818 vertical metres in one run. If you want something steeper, follow the summit ridge further out and set your line in the southwest-facing flank — that is the usual variation. Directly southwest of the tower stands a rock step of 60–66°, so you have to get out along the crest before you drop in; from there the flank holds 24–26° on average with steps of 39–44°, against 20.3° on the ascent.",
      "The most common mistake: leaving the crest too early. The north and northwest sides directly below the summit are cliff — 64° in the first 80 metres — and the south side is not much kinder at 42°. Hold the crest until you are down in the basin, then keep northwest of Skålavatnet and down into Fosdalen. Drift west of the lake and you are standing above rock bands that measure 68° down toward Loen. From mid-May the snow ends around Tjugensætra, and the last 750 vertical metres are on foot.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line itself is gentle — steepest hundred metres 20.3° on average, steepest single step 29.1°. The danger is what you travel beneath: slides run along Fosdøla and Skålelva, and on the north side of the summer route once you have passed Skålavatnet.",
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
      distanceLabel: "7.2 km",
      caption: "1818 vertical metres from Tjugen to the summit — the steepest hundred sit between 1400 and 1500 m.",
    },
  },
  skarsteinfjellet: {
    intro:
      "1219 metres of climbing over 5.84 km from Innvikdalen, up a ridge that stays even from the treeline to the cairn. The steepest sustained section measures 25.0 degrees and sits low, at 520 m; above 800 m the line never exceeds 16 degrees in any hundred-metre band.",
    ascent: [
      "Start at the gate on Dragesetvegen at the head of Innvikdalen, 349 m, up the valley from Innvik. The tractor road takes you to Remestøylen at 596 m; the band from 300 to 400 m measures 7.1 degrees and 400 to 500 m runs at 10.6.",
      "From the seter hold west-south-west up the clear ridge, with Innvikdalen on your right. The steepest hundred-metre band of the tour is here, 600 to 700 m averaging 17.3 degrees, and the steepest sustained section measures 25.0 degrees between 520 and 541 m.",
      "Past Hestehytta at 864 m the forest ends — Kartverket classes the ground as forest to 805 m — and the rest is open ridge. From Hestehytta to the summit the line climbs 864 to 1567 m over 3.3 kilometres, about twelve degrees on average.",
      "The ridge is even the whole way up: 13.6 degrees from 900 to 1000 m, 15.4 from 1000 to 1100 and 15.9 from 1100 to 1200. Above 1400 m it flattens toward the cairn at 1567 — the band from 1400 to 1500 m measures 8.3 degrees over 675 metres of ground.",
    ],
    descent: [
      "Back down the same ridge, west toward Remestøylen and Dragesetvegen — the climb goes east, and Remestøylen lies on a bearing of 289 from the summit. The ridge is broad and open, and the descent faces west.",
      "The usual mistake: choosing a different line down from the one you climbed. The mountain has several avalanche-prone descent options off the sides of the ridge, and it is easy to follow tracks that do not end where you parked. Follow the ascent ridge, not other people's tracks.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A long, broad ridge with no technical sections. The steepest hundred-metre band, 600 to 700 m, measures 17.3 degrees, and the steepest sustained section 25.0 degrees between 520 and 541 m — both down in the forested part. From Hestehytta upward the line holds about twelve degrees on average.",
      },
      {
        title: "The terrain around it",
        body: "The sides of the ridge are avalanche terrain, and now we know which: south and south-west, down toward Innvikdalen. From the ridge point at 1096 m the south side measures 26.9 degrees on average over 400 metres with a 45.5-degree window, and south-west 28.8 with 49.3. From 1275 m south-west gives 32.9 degrees on average and a 67.5-degree window 320 to 380 metres out. North and west from the same ridge hold 10 to 15 degrees. The summit itself is gentle in all eight directions — 2.5 to 11.3 degrees on average — so the judgement is not where you stand at the cairn, but in what you choose once you are some way down.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Indre Fjordane at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "349 m",
      endLabel: "1567 m",
      distanceLabel: "5.8 km",
      caption: "1219 metres of climbing and 5.84 km from Dragesetvegen in Innvikdalen, over Remestøylen and Hestehytta, with the treeline at 805 m.",
    },
  },
  lodalskapa: {
    intro:
      "1526 metres of climbing over 10.62 km to the only 2000-metre peak in Nordfjord. Two thirds of the tour is a gentle approach; the rest is glacier with deep crevasses, and the steepest sustained section measures 27.3 degrees between 2000 and 2023 m.",
    ascent: [
      "Start at the car park by Bødalssætra, 584 m, just under thirty kilometres from Stryn past Loen and along Lovatnet. The road into Bødalen is closed in winter and opens in May or June — this is a spring tour, and the season says so.",
      "Head east along the north-east side of the valley toward the outlet of Sætrevatnet, 606 m, and follow the river on in. The approach is long and flat: the band from 500 to 600 m measures 0.6 degrees over 1628 metres of ground, 600 to 700 m runs at 4.0 over 1413, and 1200 to 1300 m at 2.2 over 2633 metres.",
      "At Kåpevatnet, 1211 m, the route turns south and up Brattebakkane onto Bohrsbreen. From here it is glacier: Kartverket registers glacier terrain on the line from 1825 m, and Fri Flyt describes very deep crevasses on Bohrsbreen. The band from 1300 to 1400 m measures 20.5 degrees, the steepest hundred-metre band of the tour.",
      "On up toward the ridge and a traverse below Veslekåpa before the final stretch to the summit at 2082 m. The band from 1900 to 2000 m measures 17.1 degrees, and the steepest sustained section 27.3 degrees between 2000 and 2023. Glacier kit, crampons and an ice axe belong on this tour.",
    ],
    descent: [
      "Back the same way: below Veslekåpa, down the glacier and Brattebakkane to Kåpevatnet, and then the long flat approach out Bødalen. The descent faces west.",
      "The usual mistake: treating Bohrsbreen as a snow slope. The crevasses are deep, rope and glacier kit are not optional, and on the way down you cross the same bridges quickly that you crossed slowly on the way up.",
      "The second is underestimating the approach. Five of the ten kilometres lie below 5 degrees; that is little resistance on skis, but it is also two hours home after the day's vertical is spent.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A long flat approach and a steep top: the steepest hundred-metre band, 1300 to 1400 m, measures 20.5 degrees, and the steepest sustained section 27.3 degrees between 2000 and 2023 m. Brattebakkane up to the glacier is avalanche terrain.",
      },
      {
        title: "The terrain around it",
        body: "Very deep crevasses on Bohrsbreen — that is the hazard that separates this tour from an ordinary spring outing, and it does not depend on the avalanche forecast. Crampons and an ice axe when the snow is hard, and a rope on the glacier.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Indre Fjordane at varsom.no. Bring a transceiver, probe and shovel, and glacier kit — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "584 m",
      endLabel: "2082 m",
      distanceLabel: "10.6 km",
      caption: "1526 metres of climbing and 10.62 km from Bødalssætra over Sætrevatnet, Kåpevatnet and Bohrsbreen, with the steepest ground in the last hundred metres of climbing.",
    },
  },
  snonipa: {
    intro:
      "1494 metres of climbing over 8.45 km from Stardalen to the highest mountain in Sunnfjord, up Haugadalen and straight through the Haugabreen icefall. The steepest sustained section measures 27.6 degrees, and the tour is on glacier from 887 m upward.",
    ascent: [
      "Start by the campsite in Stardalen, 351 m — from Skei follow the E39 north and turn off at Klakegg. Fri Flyt points to pull-outs along the gravel road or parking down by the county road.",
      "Follow the forest road in along Haugadalen to Haugastøylen at 659 m. The flat stretch along the forest road is particularly exposed to naturally released avalanches when the snowpack warms — it is not where you expect it, and it is worth remembering.",
      "On up the valley to the icefall. Kartverket registers glacier terrain on the line from 887 m, and Haugabreen itself lies at 1100 m. You climb through the middle of the fall; large crevasses are the governing hazard here.",
      "Up on the plateau you traverse north-west and come onto the summit from the north-west. The climbing is even: 15.6 degrees from 1200 to 1300 m, 19.4 from 1300 to 1400 — the steepest hundred-metre band — and 17.8 from 1700 to 1800, with the cairn at 1827 m. Around 1687 m the surface is often wind-scoured and hard.",
    ],
    descent: [
      "Back the same way: across the plateau, down the icefall and out Haugadalen. The descent faces south-east.",
      "The usual mistake: choosing Veitebergsdalen for the way down because it looks shorter on the map. That is a different route from a different valley — Fri Flyt lists it as its own tour over Sollirinden — and it does not end where the car is parked.",
      "The second is the timing on the flat stretch at the bottom: that is where naturally released avalanches come once the sun has been on it, and it is the part of the tour you cross last.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Even climbing over glacier. The steepest hundred-metre band, 1300 to 1400 m, measures 19.4 degrees and the steepest sustained section 27.6 degrees; glacier terrain is registered from 887 m. Large crevasses on Haugabreen are the governing hazard, not the angle.",
      },
      {
        title: "The terrain around it",
        body: "The flat stretch along the forest road toward Haugastøylen is particularly exposed to naturally released avalanches as the snowpack warms. Around 1687 m it is often wind-scoured and hard, and that decides more about the day than the steepness does.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for the area at varsom.no. Bring a transceiver, probe and shovel, and glacier kit — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "351 m",
      endLabel: "1827 m",
      distanceLabel: "8.4 km",
      caption: "1494 metres of climbing and 8.45 km from Stardalen over Haugastøylen and Haugabreen, with glacier terrain from 887 m and the treeline at 649.",
    },
  },
  glittertinden: {
    intro:
      "Norway's second highest summit, and a surprisingly gentle tour: the steepest sustained section on the whole line measures 18.5 degrees. What it costs you is distance — 13.32 km each way, seven of them pure approach up Veodalen — and the fact that the upper part lies on Glitterbrean.",
    ascent: [
      "Start at the gravel car park at the national park boundary in Veodalen, 1297 m. From here follow the car-free road south-west along the Veo for seven kilometres to Glitterheim at 1385 m. Seven kilometres for 88 metres of height: the band between 1300 and 1400 m averages 0.9 degrees over nearly seven kilometres, and it is the flattest stretch on any tour in this app. Reckon on an hour or so each way before the mountain begins.",
      "Behind the hut the route turns north-west up the north side of Steinbudalen. Do not follow the valley floor west over the Steinbu lakes: the exit of that valley towards the glacier has steps of 37 to 41 degrees, while the north flank — where the marked path runs — holds 9 to 13 degrees on average, with individual steps up to 19. The steepest hundred-metre band on the route lies between 1600 and 1700 m and averages 13.2 degrees.",
      "From about 2010 m the route joins the ridge east of Glitterbrean, past 2222 m and 2357 m on the upper glacier, and finally west up the last rise to the summit at 2451 m. Ut.no describes the route as a steady climb throughout in terrain under 30 degrees, with a choice between the summer path east of the glacier and the glacier itself. The terrain model agrees: the steepest sustained section on the line is 18.5 degrees.",
      "The season is set by the road, not by the snow. The toll road from Randsverk into Veodalen is not ploughed and opens along with Glitterheim in mid-June. To do the classic spring tour in March–May you either ski the 24-odd kilometres in or book a snowcat with the hut in advance — the line is the same, but the first seven kilometres then form part of a much longer approach.",
    ],
    descent: [
      "Back the same way: the east ridge and the glacier down to about 2010 m, the north side of Steinbudalen down to Glitterheim, and then the seven kilometres out through Veodalen. Those last seven are not skiing. In June and July Veodalen is bare ground, so the skis are carried the seven kilometres out — reckon on an hour and a half on foot, or forty-five minutes if you left a bike at the gate.",
      "The usual mistake: drifting too far north on the broad summit plateau in poor visibility. The summit has only one gentle side. North, north-east, west and north-west fall 52 to 70 degrees down towards Grjotbrean and Glitterholet, and south and south-west — bearings between 165 and 230 degrees — fall 42 to 64 into Steinbudalen. Only the sector between 105 and 160 degrees is gentle, and that is the way you came. Take the bearing at the top. The edge is corniced too: ut.no reports documented overhanging cornices towards the north-west, so the edge you can see is not the edge that will hold you.",
      "Glitterbrean is a glacier. Crevasses and snow bridges are real, and in June and July — the only period this route is described for — the bridges are at their thinnest. The tour belongs on a rope and in a harness for the whole season. That is a different assessment from the avalanche one, and it is made before you step onto the glacier, not once you are standing in the middle of it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line is gentle throughout: the steepest sustained section measures 18.5 degrees, and the steepest hundred-metre band, 1600 to 1700 m, averages 13.2 degrees. Avalanche terrain is not what makes this tour demanding. The glacier, the altitude and the length are — and the fact that the gentle ground above 2200 m is glacier rather than rock. Take the valley floor west over the Steinbu lakes instead of the north flank, however, and you get steps of 37 to 41 degrees.",
      },
      {
        title: "The terrain off it",
        body: "North, north-east, west and north-west fall 52 to 70 degrees from the summit down towards Grjotbrean and Glitterholet, and south and south-west 42 to 64 degrees into Steinbudalen. The north-west edge is corniced. The summit plateau is broad and offers no reference points in poor visibility, and that is where those three steep sides become dangerous — not because they are avalanche terrain you choose, but because they are edges you can walk onto. South-east, between 105 and 160 degrees, is the one gentle side, and the one you came up.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Jotunheimen at varsom.no. Bring a transceiver, probe and shovel — and rope, harness and crevasse rescue gear. Glitterbrean is crossed roped; if you do not have glacier experience yourself, go with a guide.",
      },
    ],
    elevationProfile: {
      startLabel: "1297 m",
      endLabel: "2451 m",
      distanceLabel: "13.3 km",
      caption: "1228 metres of climbing and 13.32 km from Veodalen, where the first seven kilometres to Glitterheim rise at 0.9 degrees.",
    },
  },
  galdhopiggen: {
    intro:
      "The highest point in Norway, and from Juvasshytta it is only 639 metres of climbing. The arithmetic lies: between you and the summit lies Styggebrean, and you cross it roped up.",
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
        body: "The line itself is gentle. The steepest 100-metre band, 2400–2500 m, averages 17.1 degrees, and the steepest single step along the route measures 25.8 degrees. Avalanche terrain is not what makes this tour demanding — the crevasses in Styggebrean and the altitude are. The east ridge is narrow and catches wind slab on the lee side.",
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
      distanceLabel: "5.4 km",
      caption: "639 metres of climbing over 5.3 kilometres from Juvasshytta — 1.6 of them on Styggebrean, roped.",
    },
  },
  steindalsnosi: {
    intro:
      "764 metres of climbing from Sognefjellsvegen to 2025 m, all of it above the treeline. The normal route takes the west side; the north side of the same mountain is another tour entirely, and the line between them runs across the summit plateau.",
    ascent: [
      "From the plowed pull-out at Gjuvvatnet on fv55 Sognefjellsvegen, 1274 m, head east into the valley hollow. The road up here closes for the winter and is plowed open around Easter — in 2026 it opened on 1 April — and for the first weeks after that the pass is closed at night, 20:00 to 08:00. It is the road, not the snow, that sets the season. Keep to the south shore of the lake — it is solid ground the whole way, and you avoid giving back the thirty metres down onto the ice. If the roadside is full, the alternative is the parking at Galgebergstjørnane a couple of kilometres north; the corridor works from there too.",
      "The hollow takes you due east past a small lake at 1428 m. This is open ground from the first step to the summit — no forest, no treeline to work around. At roughly 1500 m you pull northeast out of the hollow and up towards a faint, west-facing ridge formation. That ridge is the rest of the tour.",
      "The ridge climbs steadily. The 100-metre band between 1700 and 1800 m averages 19.1 degrees, and the steepest step on the way up is 30.3 degrees over thirty metres between 1828 and 1848 m. Hold the crest through that section. Drift north here and the ground falls 100 to 180 metres away beneath you, and you end up under the north side.",
      "The top is a plateau at 2025 m. The cairn sits right on the edge of the north face — walk up to it, not past it. Cornices build out to the north and east. Directly below the cairn the north side plunges: the first 120 vertical metres fall at close to 60 degrees. Then it eases onto a shelf around 1840 m before it drops away again — 42 to 45 degrees from 1620 down to 1500 m, with glacier and cliffs below that.",
    ],
    descent: [
      "You go down the way you came, westward. The big bowl below the ridge is the best of the tour: a steady 25 to 30 degrees, short pitches over 30, and the steepest step on the line — 30.3 degrees — right below the ridge. From there it is gentle down the hollow to Gjuvvatnet.",
      "The common mistake: letting yourself be drawn south off the summit, down Steindalen. It is good skiing, but it is a different tour — 1025 metres down to Helgedalen, and your car is on Sognefjellsvegen. Hold the west ridge until you can see the lake.",
      "The west side is hard in the morning through April and May, and the sun needs a few hours on it. Start early and you bring crampons; the steep section at 1840 m is no fun on bare crust, going up or coming down.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The normal route sits in gentle to moderately steep terrain. The hollow up to 1500 m is flat in itself, but it runs beneath the west flank of the mountain. Above 1700 m it steepens: 19.1 degrees on average through the 1700–1800 m band, and the steepest single step along the line measures 30.3 degrees. The key section between 1820 and 1860 m is the place on the route where a slab releases.",
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
      distanceLabel: "4.0 km",
      caption: "764 metres of climbing over 4.0 kilometres from Gjuvvatnet, all above the treeline. Steepest section on the climb: 30.3 degrees between 1828 and 1848 m.",
    },
  },
  besshoe: {
    intro:
      "1328 metres of climbing from Bessheim, and a good third of the tour is flat: three and a half kilometres lie on the ice of Bessvatnet. The climbing itself is gentle throughout, and what makes Besshø demanding is the length and a large, round summit plateau that does not show you where it ends.",
    ascent: [
      "From the car park at Bessheim fjellstue at 961 m, follow the marked route west and up the 413 metres to the north-east end of Bessvatnet at 1374 m. This is the tour's first pitch and it holds 10–14 degrees — steady, but this is where you do the climbing before the flat. Fv51 over Valdresflye is closed in winter south of Maurvangen, but Bessheim lies north of the closure and is reached all winter via Sjoa, Heidal and Randsverk.",
      "Out on Bessvatnet the tour stops climbing. The lake sits at 1372 m, and the next three and a half kilometres west rise and fall no more than a couple of metres in total — in the elevation profile it is the long flat middle. The ice is the normal winter route here, but the line on the map is drawn on land at both ends. At the far end, at Grotåosen at 1385 m, the mountain starts again.",
      "From there the route runs due west up Grotådalen, between Bukkehøe to the north and Besshø's east ridge to the south, climbing steadily to about 1745 m. The steepest hundred-metre band on the whole tour lies between 1900 and 2000 m and averages 18.0 degrees; the steepest sustained section on the line is 28.1 degrees. Then south-west onto the ridge at Brue at 2047 m, and west-south-west along the gentle ridge for the last 210 metres. Do not climb Besshøbrean to Brue, which is one way to read the lodge's own description: the transition from the glacier onto the ridge rises from 2004 to 2050 m over 26 metres of ground, roughly 60 degrees.",
      "The summit is a large plateau at 2257 m. A bearing of 75 degrees from the cairn — the east ridge you came up — holds 17.8 degrees. Bearings of 60 and 90 degrees feel just as gentle for five hundred to eight hundred metres — and then break over at 55 to 60 degrees. That is the whole problem of the tour: fifteen degrees of wrong bearing is unnoticeable underfoot until it is too late.",
    ],
    descent: [
      "Back the same way: east-north-east down to Brue — a bearing of 78 degrees from the cairn, down Grotådalen to Grotåosen, and then the three and a half flat kilometres east along Bessvatnet. Expect to pole the whole lake — it is not skiing, it is transport, and it takes daylight you need to have left.",
      "The usual mistake: leaving the summit plateau on the wrong bearing. The north, north-west and west sides fall 55 to 70 degrees straight down towards Russvatnet and Gjende, and from a round plateau in poor visibility every direction looks equally gentle for the first few steps. Take your bearing at the cairn, not two hundred metres out. The ridge back to Brue is also narrower than it feels: the north side breaks over at 50 to 60 degrees down to Besshøbrean within two hundred metres of the track, while the south side is gentle and broad for the first three hundred.",
      "The south gullies are used as a descent by people who know the mountain. They hold 35 to 40 degrees with short sections at 45, and are rocky and icy in poor conditions. Friflyt's south-east gully down to Memurubu is a traverse — it does not end at your car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The ascent is not steep ground: the steepest sustained section on the line measures 28.1 degrees, and the steepest hundred-metre band, 1900 to 2000 m, averages 18.0 degrees. The east ridge itself runs at 18 to 20 degrees. What counts on the route is the ridge in to Brue, where the north side breaks over at 50 to 60 degrees down to Besshøbrean within two hundred metres of the track, while the south side is gentle and broad — a track drifting north onto the lee is a different track from the one you planned.",
      },
      {
        title: "The terrain off it",
        body: "The summit plateau is large and round, and the north, north-west and west sides fall 55 to 70 degrees down towards Russvatnet and Gjende. In poor visibility this is where the tour becomes dangerous, not on the way up. Radial measurements from the cairn show why the mistake is made: a bearing of 75 degrees holds 17.8 degrees, but 60 and 90 feel just as gentle for five hundred to eight hundred metres and then break over at 55 to 60. The step from Besshøbrean up onto Brue is around 60 degrees and is not to be climbed. The south gullies hold 35 to 40 degrees with sections at 45.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Jotunheimen at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "961 m",
      endLabel: "2257 m",
      distanceLabel: "10.0 km",
      caption: "1305 metres of climbing and 9.58 km from Bessheim to the summit, three and a half of those kilometres flat lake at 1372 m.",
    },
  },
  fanaraken: {
    intro:
      "A high-mountain tour from Sognefjellsvegen to 2068 m, with Fannaråkhytta standing on the summit itself. Few vertical metres and gentle angles — but the route crosses a glacier, and that decides your kit.",
    ascent: [
      "You start at Korpen, the car park on fv55 by Prestesteinsvatnet, 1397 m. Sognefjellsvegen closes for the winter over the high ground and is plowed open around Easter — in 2026 it opened on 1 April — and for the first weeks after that the pass is closed at night, 20:00 to 08:00. The opening date sets the season, so check the road status before you drive. The first kilometre and a half goes downhill and over land: the line follows the west side past two small tarns at 1384 and 1381 m, on west of the reservoir and down to the dam at the outlet, 1343 m. Stay on land along the west shore — do not cut across the ice. Prestesteinsvatnet is a reservoir, and the flat short cut straight over it is the one surface on the whole tour whose bearing strength you cannot know.",
      "Going round costs: the line gives back 113 metres before it begins to climb in earnest, against the 54 a straight line from the car to the dam would have given. Land undulates; ice does not. Past the dam you pull up into the hollow east of Steindalsnosi's north ridge and onto Fannaråkbreen at around 1550 m. Keep low and on the gentle part of the glacier. It is crevassed, and you cross it roped.",
      "Aim for the 1688 knoll east of Fannaråknosi and round it. Do not hold height above the glacier: go too high before you turn up and the passage onto the east ridge becomes substantially steeper. The steepest hundred metres sit between 1800 and 1900 m and hold 19.8° on average over 317 metres of ground, and the steepest single step on the line measures 27.1° between 1859 and 1882 m.",
      "Round the knoll you come onto the southeast ridge and the summer path from Keisarpasset. Follow it over Fannaråknosi and on along the east ridge to Fanaråken. Large cornices hang on the north side the whole way, and the north side falls 55–58° in the top 90 metres below the crest — keep to the south of it, also when the visibility is good.",
    ],
    descent: [
      "You follow the same line down — east and northeast facing, even and gentle, with reliable spring snow well into the season. The other documented route, from Turtagrø through Helgedalen, gives 1196 vertical metres and is a different day.",
      "The commonest mistake: holding height above the glacier on the way down, so you end up too high west of the 1688 knoll and have to come down where it is steepest. Drop round the knoll the way you came up. And remember the last stretch is not free: from the dam at 1343 m it climbs back to Korpen at 1397, and the west side undulates — 113 metres in total on the way in, and the same again on the way out.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The normal route is gentle — the steepest hundred metres hold 19.8° on average between 1800 and 1900 m, over 317 metres of ground, and the steepest single step on the line measures 27.1° between 1859 and 1882 m. On Fannaråkbreen the crevasses are as much the hazard as the snow. Down at the start the hazard is a different and simpler one: the ice on a reservoir that is drawn down, and the route is laid on land to keep off it.",
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
      distanceLabel: "6.7 km",
      caption: "783 metres of climbing and 6.70 km from Korpen to the summit — 113 of them given back along the west side of the reservoir, before the climbing begins.",
    },
  },
  kvamshesten: {
    intro:
      "830 metres of climbing over 5.34 km from Rytnavegen, most of it gentle — and then a bowl at the end averaging about 36 degrees from Grunnevatnet to the summit. That is why an ice axe and crampons are on the equipment list.",
    ascent: [
      "Start at the end of Rytnavegen, 404 m — the private road signed to parking for Storehesten, the local name for the same mountain. Fri Flyt gives two verticals for this mountain, and they are two different starts: 960 metres from Rytnane down in the valley, and 810 from here.",
      "Follow the forest road up toward Kårstadstølen at 495 m, then hold east toward Rabbane at 512. The route runs east before it turns north — it looks like a detour on the map, and it is the described way.",
      "From Rabbane it goes north toward the pass east of Skaravatnet at 715 m. The stretch between 700 and 800 m is the gentlest of the tour, 3.8 degrees over 1439 metres of ground. The route runs west along the north side of the lake and past Grunnevatnet at 785 m — and the line sits on the ice along the way: about 240 metres on Skaravatnet, 58 metres on an unnamed tarn at 726 m in the pass, and about 260 metres on Grunnevatnet, up to about 40 metres from shore. All three are natural mountain tarns, not reservoirs, but they are water under the snow and to be judged as that.",
      "West of Grunnevatnet you take a little height and then follow the marked bowl south all the way up. The band from 1000 to 1100 m averages 11.1 degrees over 537 metres of ground; the steepest hundred-metre band is 13.8 from 900 to 1000 m, and the steepest sustained section 22.7 degrees between 639 and 669 m. From Grunnevatnet to the cairn at 1209 m it is 424 metres of climbing over 581 metres of ground — about 36 degrees across the whole bowl.",
    ],
    descent: [
      "Back down the same bowl and out over Grunnevatnet, Skaravatnet and Rabbane. The descent faces north, and the bowl is both the way up and the way down.",
      "The usual mistake: going up the bowl on hard snow without an ice axe and crampons. Fri Flyt lists both as required equipment on this tour, and the reason is in the numbers — 36 degrees on average over the last 424 metres of climbing is not a slope you slide down under control.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Gentle to 900 m and steep above. The bowl south of Grunnevatnet is avalanche terrain: the band from 1000 to 1100 m averages 11.1 degrees, the steepest sustained section measures 22.7 degrees between 639 and 669 m, and the whole stretch from Grunnevatnet to the top runs at about 36 degrees.",
      },
      {
        title: "The terrain around it",
        body: "The bowl is the one large judgement on this tour, and there is no way around it: the route goes up through it. Hard snow turns the final climb into scrambling rather than skiing, and that is when the ice axe and crampons go from being kit in the pack to being what you stand on. The summit itself has a side there is no staying on: south and south-east measure 48.9 and 47.1 degrees on average over 500 metres, with 60-metre windows of 74.0 and 74.3. East and west, 15.1 and 13.8 degrees, are the gentle ones, and the bowl comes up from the north.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for the area at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "404 m",
      endLabel: "1209 m",
      distanceLabel: "5.3 km",
      caption: "830 metres of climbing and 5.34 km from Rytnavegen over Kårstadstølen, Skaravatnet and Grunnevatnet, with the steep bowl between 1000 and 1100 m.",
    },
  },
  rasletinden: {
    intro:
      "A 2104-metre summit for most people: 778 metres of climbing from Valdresflye, and the steepest sustained section on the line measures 21.7 degrees. What makes the tour demanding is the weather and the plateau — it becomes hard in poor visibility, not in poor snow.",
    ascent: [
      "Start at the car park on the east side of fv51 where the Valdresflya hostel stood before the 2015 fire, 1391 m. The road sets the season: fv51 is ploughed through the winter only as far as Bygdin, and the stretch north past the hostel normally opens around 1 April.",
      "From here the route runs west out onto the plateau, south of Fisketjerne. The first 1.2 kilometres are dead flat and in fact drop ten metres — you will pole them, and you will pole them home again. The plateau is also completely open and gives no shelter. Along the way the line runs on ice twice: 135 metres at 1379 m, up to 50 metres from shore, and 225 metres at 1377 m, up to 100 metres out. Neither has a name in the register — Fisketjerne is 824 metres away — and both are natural tarns rather than regulated ones. On a flat where the rest is firm ground they are worth knowing about.",
      "Then it climbs steadily to the first rise at about 1530 m and on up onto the ridge at 1736 m. The ridge runs west, south of Øystre Rasletinden (2011 m), to about 1890 m. Note that the track here is not on a ridge in any avalanche sense: between 1810 and 1890 m it runs below the south side of Øystre Rasletinden, which rises 130 metres directly above you with a section at 47 degrees. Do not go over Øystre Rasletinden: the east and south-east sides of that top measure 42 to 50 degrees, and lines onto it from the east give steps of 51 to 63.",
      "Finally the short rise to the summit plateau. In the fall line it measures 31 to 35 degrees between 1910 and 1960 m; above 1960 it eases to 16 to 20 into the plateau. It is one of two places on the route with a single steep slope above you — the other comes lower down, on the ridge below Øystre Rasletinden. The line as drawn cuts across it at an angle and holds 21.7 degrees as its steepest sustained section; the steepest hundred-metre band, 1900 to 2000 m, averages 15.1 degrees. Above the rise it is out onto the plateau and the last hundred metres to 2104 m.",
    ],
    descent: [
      "Back the same way: the rise, the ridge east south of Øystre Rasletinden, down to 1736 and on down the first rise to the plateau. Below the first rise, from 1531 m, the skiing is over — the last two kilometres across the plateau are flat, and the ten metres you got for free on the way out have to be paid back.",
      "The usual mistake: taking a bearing north off the summit plateau because it looks gentle. The north and north-west sides of Rasletinden fall 55 to 65 degrees down into Leirungsdalen, and the south side 48 to 57. Only east and north-east are gentle — east measures 26 degrees, north-east 32 — and that is the way you came.",
      "The waypoint at 1890 m sits on what the terrain model classes as snow and ice. It is a permanent snowfield, not a crevassed glacier: Leirungsbrean and the Kalvehøgde glaciers lie four kilometres further west and south.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Almost the whole route is gentle: the first rise measures 22 to 24 degrees, the ridge 23, and the steepest sustained section on the line 21.7 degrees. Two places have a single steep slope above them. The rise below the summit plateau measures 31 to 35 degrees in the fall line between 1910 and 1960 m. And the ridge traverse between 1810 and 1890 m runs below the south side of Øystre Rasletinden: 130 metres directly above the track, 34 degrees on average and 47 at its steepest. At both the track cuts across at an angle, but the snow above takes no notice of the track — and a south-facing slope in April is exactly what you judge early in the day.",
      },
      {
        title: "The terrain off it",
        body: "The north and north-west sides of Rasletinden fall 55 to 65 degrees down into Leirungsdalen, and the south side 48 to 57. Only east (26 degrees) and north-east (32) are gentle, and they are the route. Øystre Rasletinden, 2011 m, looks like a natural part of the ridge, but its east and south-east sides measure 42 to 50 degrees — the ski route passes south of that top, not over it.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Jotunheimen at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1391 m",
      endLabel: "2104 m",
      distanceLabel: "7.2 km",
      caption: "778 metres of climbing and 7.18 km from Valdresflye, where the first 1.2 kilometres are flat and drop ten metres.",
    },
  },
  banseterkampen: {
    intro:
      "341 metres of climbing and 2.73 km from Bånsetra onto a ridge that drops away to the south. The route itself is gentle — the steepest hundred-metre band is 14.0 degrees from 900 to 1000 m, and the steepest step 22.1 degrees between 986 and 1000 — but the south-east side under the edge measures 25.5 degrees on average with 45.2 in the window 30 to 90 metres out.",
    ascent: [
      "Start at Bånsetra, 913 m — the summer-farm meadow where Bånsetervegen ends. Ut.no gives 914 for the same point. The road in is signed from county road 319 south of the bridge over the Lågen at Fåvang, and this is a summer-farm and cabin area with its own road network: Bånsetervegen, Svarttjønnvegen, Tutlidalsvegen and Årnesfeltet are all mapped.",
      "Straight west and up the hillside is the shortest steep stretch on the tour: 14.0 degrees from 900 to 1000 m over 348 metres of ground, with a step of 22.1 degrees between 986 and 1000. The forest lets go at 954 m already and the ground is open from 961 — this is a tour that is above the treeline after three hundred metres.",
      "On up the line slants south-west: 12.5 degrees from 1000 to 1100 m over 461 metres of ground, past 1110 m, and onto the ridge itself at 1195. There the climbing ends. The band from 1100 to 1200 m measures 3.1 degrees over 1807 metres of ground — that is the edge, and it is nearly level.",
      "West along the rim to the high point, 1196.1 m. Ut.no gives 1202 for the same place, the largest disagreement between card and terrain model in this round; the card carries the measurement. The view runs to Jotunheimen in the west and Rondane in the north, and down onto five summer-farm areas in the south.",
    ],
    descent: [
      "Back the same way, north-east. That side measures 6.3 degrees on average over 400 metres with a steepest 60-metre window of 10.6 — the gentle half-circle the route sits in — and west measures 3.9 with 12.8.",
      "The south side is another matter, and it is why this tour carries a grade at all. Ut.no writes of «steep drops to the south» and «ridges that fall sheer a couple of hundred metres», and the sweep puts numbers on it: south-east 25.5 degrees on average with 45.2 in the window 30 to 90 metres out, south 23.0 with 39.8 at 40 to 100, east 21.0 with 38.0 at 30 to 90, and south-west 18.7 with 42.5 further out, 180 to 240.",
      "In summer a clear path runs along the edge of the crags, and ut.no writes that you walk it without risk. Under snow that edge is a cornice edge, and it is not visible in flat light. Keep to the north side of the ridge.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "341 metres of climbing where the steepest band is 14.0 degrees and the steepest step 22.1. The route gives back 58 metres over 2.73 km, most of it on the ridge itself, which measures 3.1 degrees over 1807 metres of ground. The ascent on its own is not an avalanche problem.",
      },
      {
        title: "The edge",
        body: "The whole grade sits in the rim. South-east measures 45.2 degrees in its steepest 60-metre window only 30 to 90 metres from the top, south 39.8 and east 38.0. That is not ground you come back from if you walk out onto the cornice, and on a ridge that otherwise measures 2.7 degrees nothing tells you the edge is coming.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Oppland sør on varsom.no. Oppland sør is a B region: it is only forecast when the danger level is expected to reach 4 or 5, so on most winter days there is no assessment to read, and an empty page does not mean a mountain without danger. Both ut.no descriptions are summer ones and give June to September; the season on the card is read off the fact that Bånsetra is a cabin area with a ploughed road network. Take a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "913 m",
      endLabel: "1196 m",
      distanceLabel: "2.7 km",
      caption: "341 metres of climbing and 2.73 km from Bånsetra up the hillside to 1110 m and onto the ridge at 1195, with the forest letting go at 955 m.",
    },
  },
  molden: {
    intro:
      "623 metres of climbing over 3.31 km from Mollandsmarki up the south-west ridge, the Lustrafjord below you the whole way. The steepest hundred-metre band measures 16.3 degrees, and the steepest sustained section 23.3 — and that one is down in the forest, not on the ridge.",
    ascent: [
      "Start at the mapped car park on Mollandsmarki, 501 m, above Marifjøra in Luster. The first hundred metres of ground are flat — the band from 400 to 500 m measures 0.5 degrees — before the road toward Garden begins to climb.",
      "Follow the road and then the summer path up through the forest. The climbing is even and without surprises: 10.0 degrees from 500 to 600 m, 11.6 from 600 to 700 and 14.3 from 700 to 800. The steepest sustained section of the whole tour is down here, 23.3 degrees over thirty metres between 704 and 718 m.",
      "The forest holds to 851 m. Above the treeline, at about 816 m, you join the south-west ridge, and it carries you all the way. The steepest hundred-metre band is 900 to 1000 m averaging 16.3 degrees — those are the steeper points the route description warns about, and they are short.",
      "From 1000 m it eases again: 7.9 degrees from 1000 to 1100 m and 6.5 above that, with the cairn at 1120 m. The east top at the same height sits close by for anyone who wants the view from both.",
    ],
    descent: [
      "Back down the same ridge, south-west. The ridge is broad, and on stable days you can also ski due west from the summit.",
      "The usual mistake: choosing the western line without thinking about where it ends. Head west instead of following the ridge down and you land in the dense forest below 851 m, which is a long and unpleasant way back to the car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A broad south-west ridge with even climbing. The steepest hundred-metre band, 900 to 1000 m, measures 16.3 degrees, and the steepest sustained section 23.3 degrees between 704 and 718 m — down in the forest, where the terrain is short and open.",
      },
      {
        title: "The terrain around it",
        body: "The south-west ridge has a couple of steeper points on the last stretch up, and they are worth a look when the snow is unstable. The west side below the summit is the other assessment: it gets skied on stable days, and it ends in dense forest. The third is the fjord side, and it is not a judgement but a boundary: east and south-east from the cairn measure 46.1 and 46.4 degrees on average over 500 metres, with 60-metre windows of 62.4 and 63.6. The view down to Lustrafjorden comes off an edge, not a slope.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Indre Sogn at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "501 m",
      endLabel: "1120 m",
      distanceLabel: "3.3 km",
      caption: "623 metres of climbing and 3.01 km from Mollandsmarki, with the treeline at 851 m and the steepest hundred-metre band between 900 and 1000 m.",
    },
  },
  synshorn: {
    intro:
      "A short tour straight up from Bygdin, with a 360-degree view from the top — Jotunheimen to the north, Bygdin to the west, Bitihorn to the south. 428 metres of ascent over barely two kilometres makes this the tour you take when the weather window is short.",
    ascent: [
      "Start at the car park at Fagerstrand on the east shore of Bygdin, next to Bygdinstøga and Bygdin Høifjellshotell. The car park is private and charges, paid by Vipps to the number on the sign. Sources give the rate as both 60 and 80 kroner, so read the sign rather than budget for a figure. Fv51 is closed for the winter north of here, so Bygdin is the plowed end of the road and the car park stays reachable all spring. You are above the treeline from the first step, and the climb begins straight away.",
      "Set the track west and north-west towards the lower part of Fagerdalen rather than heading straight at the summit. The top looks close from here, but directly north of the car park there is a step holding around 40 degrees between 1090 and 1220 m, and the east side of Synshorn falls further still: 31 degrees on average over the first four hundred metres down towards Fv51, with a section of 57. Neither is a way up. Stay west of the mountain until you are above 1400 m.",
      "The flank you climb sits mostly between 10 and 20 degrees, in open terrain without a single tree. The last hundred metres of ascent, from 1400 to 1475, average 16.6 degrees, and the steepest single step on the route measures 22.1 degrees. The summit is gained from the south-west, over the gentle edge of the plateau.",
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
        body: "The ascent runs in open terrain the whole way, with no forest to slow anything down. The steepest single step on the line measures 22.1 degrees, and the top hundred metres of ascent average 16.6 degrees. The track itself is gentle; what you have to judge is what hangs above you as you come in on the summit from the south-west.",
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
      distanceLabel: "2.1 km",
      caption: "1060 to 1475 m in barely two kilometres — an even climb in open terrain, steepest over the last hundred metres.",
    },
  },
  togga: {
    intro:
      "780 metres of ascent and 2.64 km — Togga is one of the shortest ways to a summit in Sogndalsdalen, and that is exactly why the mountain sees so much use: zero approach from the ski-touring car park at Brandhaugane on highway 5, forest skiing and open ground in the same tour, and six descents in Fri Flyt's book. The card carries grade 3, and the reason stands in the source's own warning: on the south-east ridge — the normal route — skiers have triggered avalanches on the way up in unstable conditions. The line measures 27.5 degrees as its steepest sustained stretch; the slope it climbs, Fri Flyt gives 33–35.",
    ascent: [
      "Start at the ski-touring car park at Brandhaugane, 427 metres by highway 5 a few kilometres before the ski centre — the register has Brandhaugane as a knoll in the forest right beside it, and Fri Flyt's 785 vertical metres imply exactly this start. Head for the south-east ridge and follow it up through the forest; the line passes 542 metres in forest, which by Kartverket's classes ends at 765.",
      "Above the treeline comes the steeper section — 744 metres on the way into it, and the steepest 100-metre band of the tour, a mean 22.5 degrees between 800 and 900 metres. This is where the source's avalanche warning applies: here skiers have triggered avalanches on the way UP. Switchback with care, and turn around here if the snow says so.",
      "At Orraleiken the ground levels out, as the source says — the register point reads 1042 metres on open ground. A breather, and then the last climb: the line passes 1155 and the cairn stands at 1204 metres, measured against the register's 1203 and Fri Flyt's published 1205.",
      "The register deserves a sentence here too: unguided, the summit search climbs past the name and on westwards, because the ridge rises without a saddle towards higher mountains — 1236 only 280 metres west, 1354 barely a kilometre out. Togga is the named point, not the highest on the ridge, and the card carries the named one.",
    ],
    descent: [
      "The normal way down is the way up: the last climb, Orraleiken, and the steeper section down into the forest. The steeper section is the same slope as on the ascent — what can be triggered on the way up can be triggered on the way down, and the line choice from the ascent is the answer key.",
      "Fri Flyt describes five descents — the south-east ridge, two on the south side and two eastwards, with exits towards Laugadalen, Gunvordalen and Vatnasete. None of them is this line, and the measurements from the cairn say what they demand: the two eastern variants measure 50.5 and 51.1 degrees in their steepest 60-metre windows and the south side 41.9. The north side, which none of them descends, falls 44.8 degrees 210–270 m out. These are genuinely alpine options on a mountain with a short way home — choose by the snow, not by the list.",
      "Nobody should go west: the ridge rises on towards higher mountains, and in fog that is where you end up if you just 'follow the ridge'. A compass bearing south-east from the cairn.",
    ],
    avalanche: [
      {
        title: "The normal route",
        body: "Fri Flyt's own warning is unusually concrete, and it deserves near-verbatim quoting: on the south-east ridge there is a steeper section where skiers have triggered avalanches during the ascent in unstable snow conditions. That section lies between the treeline at 765 and Orraleiken at 1042, with the 800–900 metre band as the steepest measured. The source's steepest point is 33–35 degrees; the line switchbacks gentler, but the slope is the same.",
      },
      {
        title: "The variants",
        body: "Fri Flyt puts its own NB on the east flank: 'skiers have several times triggered slab avalanches in this eastern flank', and the descent at Høgde 1140 'requires stable snow conditions'. Five descents give five ways to raise the stakes: the north, north-east and east sides measure 44.8 to 51.1 degrees in their steepest 60-metre windows, the south side 41.9. A short way to the car makes one more lap tempting — which is exactly when the snow assessment from earlier still has to hold.",
      },
      {
        title: "The rising ridge",
        body: "West of the cairn the ridge keeps rising without a saddle — the mean westwards is negative because the ground goes up. In clear weather that is obvious; in fog it is a trap: whoever follows the ridge onwards walks into steeper, wilder mountains, not down. South-east is the way home, always.",
      },
      {
        title: "Before you go",
        body: "Togga is in the Indre Sogn forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. Fri Flyt publishes no season months for Togga; its Sogndal page sets the season from November to May. The card's December–March is the app's own narrowing to the midwinter months, and the guide says so. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "427 m",
      endLabel: "1204 m",
      distanceLabel: "2.6 km",
      caption: "780 metres of ascent and 2.64 km from Brandhaugane — the south-east ridge with its avalanche-prone steep section, Orraleiken, and the cairn at 1204.",
    },
  },
  bitihorn: {
    intro:
      "Bitihorn stands alone south of Bygdin and is visible from the whole of Øystre Slidre. The normal route goes up the back — 554 metres of even climbing, flat for the first kilometre and marked with iron poles at the top.",
    ascent: [
      "Start at the car park on Fv51, one kilometre south of Bygdin Høifjellshotell. The fee is 60 kroner a day. You are above the treeline from the car. The first kilometre crosses the flat plateau west of Stavtjerne and gives only about thirty metres of height, over a stretch of bog that lies covered once there is snow to ski on.",
      "Past the plateau you round the foot of the north ridge and pass the gate in the reindeer fence. From here set the track up the broad north-west shoulder. It sits mostly at 15 to 22 degrees, and the steepest hundred metres of ascent, from 1300 to 1400, average 18.9 degrees.",
      "The upper section is marked with iron poles. They are there for the crew who maintain the telecom installation on the summit, and they are worth their weight in flat light. The steepest single step on the line measures 23.8 degrees, and it is up here, above 1500 m. The summit is 1607 m, with Bygdin to the north and Jotunheimen behind it.",
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
        body: "The north-west shoulder sits mostly at 15 to 22 degrees, the steepest hundred metres of ascent average 18.9 degrees, and the steepest single step is 23.8 degrees, up above 1500 m. Visit Valdres describes several line choices under 30 degrees on this side, but with terrain traps and runout zones in the hollows. Choose your line by today's forecast, not by the track that is already there.",
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
      distanceLabel: "3.3 km",
      caption: "1061 to 1607 m: flat for the first kilometre, then an even climb up the north-west shoulder to the iron poles.",
    },
  },
  ulvsjoberget: {
    intro:
      "295 metres of climbing and 2.17 km from Vestby to the summit at 854 m — the highest top in Trysil with a published route description that stays out of the ski resort. The steepest hundred-metre band is 12.3 degrees from 500 to 600 m over 193 metres of ground, and the steepest step 18.6 degrees between 582 and 597. Nearly all of the climb is in forest.",
    ascent: [
      "Start in Vestby, 559 m, right by the mission house. Ut.no gives 558 for the same point. The road in is county road 2160 from Trysil centre — ut.no writes fv 563, the old number — 17 km and twenty minutes' driving, and the parking is signed.",
      "The steepest ground comes first: 12.3 degrees from 500 to 600 m over 193 metres of ground, with the tour's only real step of 18.6 degrees between 582 and 597 m. Above it the angle eases to 8.0 degrees from 600 to 700 and 8.4 from 700 to 800, and the line passes 676 and 801 m. All of this is forest.",
      "The forest does not let go until 826 m, and the ground is open from 832. Ut.no describes the transition: «at the top the terrain opens and you have a wide view in every direction.» The last 20 metres measure 5.4 degrees from 800 to 900 m over 555 metres of ground, and the summit is 854.2 m against ut.no's published 851.",
    ],
    descent: [
      "Back the same way, south-east. That side measures 5.0 degrees on average over 400 metres with a steepest 60-metre window of 9.3 — the gentlest of all eight bearings off the summit, and the one the route uses.",
      "The one place this mountain is steep lies 400 metres away and on the opposite side. South-west measures 23.9 degrees on average with a 49.2-degree window 330 to 390 metres out, and west 13.0 with 24.5 at 340 to 400. That is Stygghammeren, and ut.no is clear: «from Ulvsjøberget there is old signposting down to Stygghammeren, where you get a fine view over Ulvsjøen. You go there at your own risk, and we do not recommend bringing small children, as it is a steep, unguarded rock ledge.»",
      "Under snow that ledge is invisible. The corridor does not go there, and the signposting that does is old.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "295 metres of climbing where the steepest band is 12.4 degrees and the steepest step 17.5. The route gives back not a single metre over 2.14 km. Ut.no grades the tour tough, and it is not the terrain that makes it so — it is that the whole climb goes through forest with no path visible under the snow.",
      },
      {
        title: "Stygghammeren",
        body: "South-west of the summit the flank measures 49.2 degrees in its steepest 60-metre window, 330 to 390 metres out, with 23.9 degrees on average the whole way. That is the unguarded ledge ut.no warns about, and it lies off the route — but near enough that a line picked at random off the top can find it, and under snow the edge is not visible.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hedmark on varsom.no. Hedmark is a B region: it is only forecast when the danger level is expected to reach 4 or 5, so on most winter days there is no assessment to read, and an empty page does not mean a mountain without danger. Ut.no lists the tour as «Vandringsrute 47» in Trysil municipality's own fell-walking programme and gives May to October; the season on the card is read off the fact that county road 2160 to Vestby is ploughed all year. Take a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "559 m",
      endLabel: "854 m",
      distanceLabel: "2.2 km",
      caption: "295 metres of climbing and 2.14 km from Vestby up the hillside to 676 m and through the forest to 801, with the forest letting go only at 826 m.",
    },
  },
  nevelfjell: {
    intro:
      "268 metres of climbing and 4.22 km from Nordseter to Nevelhytta at 1090 m. Nothing on this tour is steep: the steepest hundred-metre band is 4.3 degrees from 1000 to 1100 m over 1167 metres of ground, and the steepest sustained step 17.0 degrees between 966 and 988. The steepest 60-metre window in the whole flank sweep is 19.3 degrees.",
    ascent: [
      "Start at the car park at Nordseter, 828 m — a paid plot tagged for skiing in OSM, 135 metres from Nordseter Fjellstue. Ut.no: «on groomed trails north from the car park at Nordseter toward the foot of the summit.» The Nordseter road from Lillehammer is ploughed all winter, and the bus runs there.",
      "The first two kilometres are flat — the band from 800 to 900 m measures 2.5 degrees over 1655 metres of ground — north past 897 m. Then comes Nevelvatnet, and here it is worth knowing where the trail runs: the line rounds the south end at 905 m and climbs the west side at 915. Ut.no's own trail line does the same, and the terrain model answers forest at both points. Go straight across the water and you are on ice.",
      "On north-west over Nevelåsen, 992 m, where the ground opens up. The band from 900 to 1000 m measures 4.2 degrees over 1395 metres of ground; the steepest step is here, 17.0 degrees between 966 and 988 m. The forest lets go at 966 m and the ground is open from 972.",
      "The last kilometre measures 4.3 degrees from 1000 to 1100 m over 1167 metres of ground. Ut.no gives two line choices into the summit: «turn straight up toward the top, as drawn, or take the trail on the summit's east side and follow the ridge west to the top.» At 1090 m stands Nevelhytta — the Red Cross's open hut with a stove and room for six to eight, rarely locked, restored in 2021 — and a view-finder naming the summits from Jotunheimen to Rondane.",
    ],
    descent: [
      "Back the same way, eastward. That side measures 3.8 degrees on average over 400 metres with a steepest 60-metre window of 8.5, and west 3.4 with 8.2. It is not a descent, it is a return — and ut.no says as much: «it is no further up than that you can step your way there even on narrow cross-country skis».",
      "The steepest thing the mountain has lies to the north: 11.1 degrees on average with a 19.3-degree window 160 to 220 metres out. No bearing off the summit has a 60-metre window over 20 degrees. The danger here is therefore not angle, it is distance and sameness: five kilometres over a trail network that looks the same everywhere, and a summit that is the only landmark once the light goes flat. Ut.no notes that the trail up to the summit itself is not groomed — for the last kilometre the track is yours alone.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "268 metres of climbing where the steepest band is 4.8 degrees and the steepest step 12.6. The route gives back 6 metres over 4.07 km. There is no avalanche problem on this line, and the flank sweep finds none around the summit either — 19.3 degrees is the steepest 60-metre window in any direction.",
      },
      {
        title: "The lake and the light",
        body: "Two things are worth taking seriously. One is Nevelvatnet: the line goes around it, south and west, because the trail does — the first version of the routed line ran 180 metres straight across the water at 904 m, and that is ice, not ground. The other is visibility. Nevelhytta stands open on the summit for exactly those days, and its being there is not an accident.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Oppland sør on varsom.no. Oppland sør is a B region: it is only forecast when the danger level is expected to reach 4 or 5, so on most winter days there is no assessment to read. Take a transceiver, probe and shovel — on this tour mostly because the habit is worth something, not because the line demands it.",
      },
    ],
    elevationProfile: {
      startLabel: "828 m",
      endLabel: "1090 m",
      distanceLabel: "4.2 km",
      caption: "268 metres of climbing and 4.07 km from Nordseter around Nevelvatnet at 905 m and over Nevelåsen at 992, with the forest letting go at 966 m.",
    },
  },
  slettind: {
    intro:
      "474 metres of climbing and 2.50 km from the rv 52 at Eldrevatn to the cairn at 1592 m. The steepest hundred-metre band is the top one — 17.7 degrees from 1500 to 1600 m over 285 metres of ground — and the steepest sustained step is 22.5 degrees between 1527 and 1546. The route is above the treeline the whole way.",
    ascent: [
      "Start on the made-up plot at the county boundary by Eldrevatn, 1122 m, right on the rv 52 over Hemsedalsfjellet. Fri Flyt puts it as briefly as it can be put: «park at the car park just before Eldrevann and set a course south-east. From here the route gives itself to the top of Slettind.»",
      "The first kilometre is flat — the band from 1100 to 1200 m measures 4.1 degrees over 1132 metres of ground — and then the flank begins. From 1200 to 1300 m it measures 13.7 degrees over 405 metres of ground, from 1300 to 1400 16.6 over 360, and the line passes 1325 m where the climb is established. Ut.no describes the same: «the terrain is even and suitably steep, between 20 and 25 degrees».",
      "Above that each band is a little steeper than the last: 16.1 degrees from 1400 to 1500 m over 315 metres of ground, and 17.7 from 1500 to 1600 over 285 — the steepest on the tour. The steepest single step is 22.5 degrees between 1527 and 1546 m. The summit measures 1592.0 m on the terrain model, exactly what Fri Flyt publishes; ut.no gives 1589.",
    ],
    descent: [
      "Down the north-west flank, the same way. Fri Flyt: «take the ascent route as your basis and lay your track in the broad mountainside on the way down». The flank measures 18.0 degrees on average over 400 metres with a 27.2-degree window 110 to 170 metres out, and it is broad enough that you can put the track where you like in it.",
      "The hazard Fri Flyt lists points to the right: «avalanche terrain north of the summit, so do not go too far to the skier's right at the start of the descent». North measures 13.8 degrees on average with a 25.7-degree window 100 to 160 metres out, and 11.0 degrees on average when the sweep runs to a kilometre — real avalanche terrain, exactly as the warning says.",
      "The steepest ground on the mountain is on the other hand, though. West measures 23.9 degrees on average out to a kilometre, with a 52.5-degree window 660 to 720 metres out, and south-west 23.6 with 49.5 in the window 360 to 420. Both fall toward Mørkedalen, well away from the line back to the car — but they are there, and they are what you run into if you hold too far south on the broad plateau in flat light.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "474 metres of climbing where the steepest band is 18.6 degrees and the steepest step 20.6. Fri Flyt grades it KAST 1 – easy with its steepest point under 30 degrees, ut.no grades it easy, and ut.no adds: «no particular avalanche danger if you follow the gentle sections, but there are some slopes over 30 degrees.» The line gives back 4 metres over 2.48 km.",
      },
      {
        title: "The terrain beyond",
        body: "North of the summit is what Fri Flyt warns about, and the measurement backs them: 25.7 degrees in the steepest 60-metre window 100 to 160 metres out. West and south-west are steeper again — 52.5 and 49.5 degrees in windows a few hundred metres out — and fall toward Mørkedalen. East and north-east are gentle: 5.6 and 8.5 degrees on average.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal on varsom.no. Hallingdal is an A region and is forecast every day in season. Check too that the rv 52 over Hemsedalsfjellet is open — it is a mountain pass that can close or run in convoy in bad weather, and on this tour it is the weather that cancels the day, not the terrain. Take a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1122 m",
      endLabel: "1592 m",
      distanceLabel: "2.5 km",
      caption: "474 metres of climbing and 2.48 km from Eldrevatn up the north-west flank via 1325 m, in open ground from the first step.",
    },
  },
  kyrkjebonosi: {
    intro:
      "998 metres of climbing and 4.77 km from the sandpit at Kyrkjebøen to the high point at 1670 m, with a fore-summit at 1608 and a col at 1589 in between. The steepest hundred-metre band is 20.9 degrees from 1400 to 1500 m, and the steepest step 24.1 degrees between 1422 and 1442. The north-east side is something else entirely: 33.0 degrees on average, with 48.0 in the window 0 to 60 metres out.",
    ascent: [
      "Start in the sandpit above the farm at Kyrkjebøen, 722 m. Ut.no gives the way there: in the village follow the road to the left of Skogstad Hotell, and after 1.4 km the sign for Kyrkjebønnøse stands on the right — on behind the barn and up to the sandpit. Fri Flyt calls the place the sandtak and gives parking by the information board.",
      "From the pit the tractor road and summer path run north through the forest. The route is marked and swings steeply left after about a kilometre, up Gravarbakkane, where the line passes 1010 m. The band table for this stretch is even and moderate: 9.7 degrees from 700 to 800 m over 455 metres of ground, 14.6 from 800 to 900 over 396, 13.8 from 900 to 1000 over 414, and 14.0 from 1000 to 1100 over 393.",
      "The forest lets go at 1107 m and the ground is open from 1121. Just above the treeline sits a small top at 1299 m, and Fri Flyt is clear about what you do with it: «go on the west side of the little top just after the treeline. From there you swing east again and follow the ridge up to the summit.» The line runs 1288 m on its west side. The steepest step on the tour is here too, 24.1 degrees between 1422 and 1442 m.",
      "On up the ridge it climbs evenly to the steepest band, 20.9 degrees from 1400 to 1500 m over 272 metres of ground, with the line passing 1465 m inside it. The fore-summit comes at 1608 m — the one ut.no calls «the first at 1610 m». From there the ridge drops 20 metres into the col at 1589, and then it is flat: the band from 1500 to 1600 m measures 4.4 degrees over 1306 metres of ground and 1600 to 1700 measures 6.5 over 535. «The last part of the ridge toward the summit is long and flat», Fri Flyt writes, and it is 400 metres north to the cairn at 1670.5 m — 1671 by both sources.",
    ],
    descent: [
      "The standard descent does not go back the same way from the top. Fri Flyt: «the most common route goes from the summit at about 1600 m and west down the big white flank. To get down to the car you turn off south just before the treeline and come back onto the same route as the ascent.» The west flank measures 11.3 degrees on average over 400 metres and south-west 12.3 — that is the big open flank, and it is why the card carries V.",
      "The alternative gully is another matter, and the sweep explains why. East from the summit measures 28.9 degrees on average with 46.0 in the window 10 to 70 metres out, and north-east 33.0 with 48.0 from the edge itself. That is the gully Fri Flyt credits with «500 metres of steep, fine skiing» — and it is the same side the cornice sits on. Come too far down toward the river in Trøimsbotn and Fri Flyt says it is «steep and rough terrain to get back to the path that leads down to the sandpit».",
      "Low down it goes through the forest. Fri Flyt describes that part precisely: open birch first, denser as you go, and at that point the path down to the car park is the better option.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "1002 metres of climbing where the steepest band is 20.6 degrees and the steepest step 26.8. The line gives back 54 metres, 20 of them the col between the fore-summit at 1608 and the summit ridge at 1589. The ascent route itself is not steep; what makes this a grade 3 is the distance up from the village and the cornice along the summit ridge.",
      },
      {
        title: "The cornice and the gully",
        body: "Fri Flyt lists two hazards and they are on the same side: «summit cornice and avalanche danger on the alternative descent». The sweep from the top measures north-east at 33.0 degrees on average with a 48.0-degree window 0 to 60 metres out, and east 28.9 with 46.0 at 10 to 70. That means the edge drops away immediately — that is where the cornice builds, and where the gully toward Trøimsbotn starts. North measures 27.5 with 34.2 further out. West and south-west, where the standard descent runs, measure 11.3 and 12.3.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal on varsom.no. Hallingdal is an A region and is forecast every day in season. None of the sources gives a season for this tour; the card carries February to May after the neighbouring tours on the same hillside. Take a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "722 m",
      endLabel: "1670 m",
      distanceLabel: "4.8 km",
      caption: "1002 metres of climbing and 4.62 km from the sandpit at Kyrkjebøen over Gravarbakkane at 1010 m and the fore-summit at 1608, with the forest letting go at 1107 m.",
    },
  },
  nibbi: {
    intro:
      "803 metres of climbing and 2.93 km from Lykkjastølen to the cairn at 1740 m — nearly all of it inside three kilometres. The steepest hundred-metre band is 21.4 degrees from 1200 to 1300 m over 224 metres of ground, and the steepest sustained step 24.2 degrees between 1249 and 1269. The east side of the summit is another matter: 27.6 degrees on average, with 32.5 in its steepest window.",
    ascent: [
      "Start at Lykkjastølen, 939 m. Ut.no gives 941 for the same point, and the toll covers the parking — paid into a postbox at Ulsåkstølen Fjellstue. From the car you can see the waterfall some way up the hillside, and Fri Flyt and ut.no say the same thing about it: keep to the west side. The fall itself is not mapped anywhere; the stream it runs in is Nordrestølbekken, the only named stream the line passes, so the name is an inference from the stream and not from the fall. The corridor's waypoint sits 60 metres west of it, at 1075 m.",
      "Alongside the fall it climbs evenly: the band from 900 to 1000 m measures 12.9 degrees over 311 metres of ground, 1000 to 1100 measures 13.6 over 405, and 1100 to 1200 measures 18.6 over 315. The steepest step on the whole line is here, 24.2 degrees between 1249 and 1269 m. The forest lets go at 1054 m and the ground is open from 1066.",
      "On up the valley — «it falls naturally to follow the valley upward», ut.no writes, and Fri Flyt calls it the natural gully formation you climb in or to the right of. The band from 1300 to 1400 m measures 20.8 degrees over 271 metres of ground — the second steepest on the tour, after the one below it, and the line passes 1364 m in the middle of it. Above that it eases to 18.3 and 15.4 degrees.",
      "The last 300 metres do not go straight on. Ut.no's own line comes up west of the summit, at 1708 m, and turns east along the summit ridge — «so the top is in front of you or on your right». The band from 1700 to 1800 m measures 5.4 degrees over 412 metres of ground, which is the flat summit area. The cairn is 1741 by the sources and 1740.3 by the terrain model, and the card carries the measurement.",
    ],
    descent: [
      "Fri Flyt is brief: «the easiest descent follows the same route down as the ascent». That is the south flank, and it measures 20.7 degrees on average over 400 metres with a 25.8-degree window 190 to 250 metres out — the same figures the band table gives the climb.",
      "Ut.no says there are steeper and more demanding descents for the experienced, and the sweep says where they are. East measures 27.6 degrees on average with 32.5 in the window 90 to 150 metres out, and south-east 22.8 with 30.0 further out, 240 to 300. West and north-west are the opposite — 6.9 and 10.6 degrees on average — and north only 4.5. If you want the steep line it is on the east side, and ut.no's condition stands: «the right equipment and experience in the mountains, and good conditions».",
    ],
    avalanche: [
      {
        title: "The route",
        body: "803 metres of climbing where the steepest hundred-metre band is 20.4 degrees and the steepest step 23.7. Fri Flyt grades the tour KAST 1 – easy with its steepest point under 30 degrees, and the measurement agrees. The line gives back 2 metres over 2.97 km, so it is a clean climb from the car to the cairn.",
      },
      {
        title: "The terrain traps low down",
        body: "The only hazard Fri Flyt lists is «terrain traps in the lower part of the ascent», and that is not an angle — it is a shape. The gully and stream bed you follow up from 1075 m collect snow from the whole hillside above, and have no way out to either side. The band from 1100 to 1200 m measures 18.6 degrees over 315 metres of ground: enough for something above you to release, with a collector underneath.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal on varsom.no. Hallingdal is an A region and is forecast every day in season, so there is an assessment to read. Take a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "939 m",
      endLabel: "1740 m",
      distanceLabel: "2.9 km",
      caption: "803 metres of climbing and 2.97 km from Lykkjastølen west of the waterfall at 1075 m and up the valley to 1364, with the forest letting go at 1054 m.",
    },
  },
  raskarfjellet: {
    intro:
      "685 metres of climbing and 3.26 km from Sildegjerdet on rv 52 to the cairn at 1610 m — one of the most popular ski-touring mountains in Hemsedal, known simply as «1609». The steepest hundred-metre band is 20.1 degrees between 1100 and 1200 m and the steepest step 24.0 between 1348 and 1368. The summit itself is a plateau, and the hazard here is finding your way.",
    ascent: [
      "Start at the ploughed lay-by at the summer-farm cluster called Sildegjerdet, 938 m. Fri Flyt: «follow RV52 west from Hemsedal centre for 19.5 km and park in a ploughed lay-by on the left, 1.5 km past the bridge on RV52.» The parking is mapped and free of charge. Rv 52 over Hemsedalsfjellet is open through the winter, but can go to convoy driving or close in bad weather.",
      "The first 885 metres are flat — 4.1 degrees — and the line crosses the river 224 metres in, where the terrain model answers the class Elv at 926.1 m. Then the climb proper begins through open birch forest and into the wide valley of Rupebekken, with the corridor point at 1051 m. Kartverket puts the last forest at 1115 m and open ground from 1133. The steep part of the tour is here: 18.9 degrees from 1000 to 1100 m and 20.1 from 1100 to 1200, which is the steepest band.",
      "Above it the angle eases to 14.5 degrees from 1200 to 1300 and stands up once more, 19.3 from 1300 to 1400, with the steepest step of 24.0 degrees between 1348 and 1368 m. The flat Fri Flyt promises arrives at 1397 m — a hundred metres higher than it writes — and the last 212 metres of climbing rise at 14.3 and then 7.8 degrees over 698 metres of ground to the cairn.",
    ],
    descent: [
      "Back the same way, north-east. North-east measures 10.5 degrees on average out to a kilometre and east 14.5, so it is gentle the whole way back. Fri Flyt notes that «you can either go down the same way or in the gullies you saw on the way up», and those gullies are avalanche terrain.",
      "The summit is a plateau, and that is the most important thing about this mountain. South-west measures −0.2 degrees mean out to a kilometre because the ground keeps rising, south-east 0.6 and south 3.8. From the cairn four directions look equally flat, and three of them lead nowhere you want to go.",
      "What is steep is a long way from the route. The north flank has a 60-metre window of 41.1 degrees, but that is 940 to 1000 metres out — down where the mountain finally falls towards the valley. Closer to the cairn the steepest readings are 26.1 degrees to the east 60 to 120 metres out and 27.0 to the south 30 to 90 metres out.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt files the tour as KAST 1 – simple with the steepest point under 30 degrees, and still writes that «you are moving in avalanche terrain until you reach 1300 metres». Both are true: the steepest band on the line is 20.1 degrees and the steepest step 24.0, but the hillside around it is steeper than the line. That is why the card carries grade 2.",
      },
      {
        title: "Visibility",
        body: "Fri Flyt's other warning is not about snow: «in poor visibility there are few terrain features to navigate by. You need good visibility. There is a lot of avalanche terrain around you.» The flank sweep says the same thing in numbers — south-east 0.6 degrees mean, south-west −0.2, north-west 2.6 — a plateau with nothing for the eye to hold. The stream valley you came up is the only shape in the terrain that leads back to the car.",
      },
      {
        title: "Before you go",
        body: "Read today's avalanche forecast for Hallingdal on varsom.no, an A region forecast every day in season. Neither Fri Flyt's route description nor its article gives a season for this mountain; the card's February to May is the window the app's three other Hemsedal tours carry, and it is an inference. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "938 m",
      endLabel: "1610 m",
      distanceLabel: "3.3 km",
      caption: "685 metres of climbing and 3.26 km from Sildegjerdet at 938 m, into the stream valley at 1051 and over the flat at 1397 to the cairn.",
    },
  },
  skogshorn: {
    intro:
      "836 metres of climbing over 3.93 km from Trefta, even and broad the whole way: the steepest sustained section on the line measures 23.2 degrees. A good first ski-touring weekend in Hemsedal — as long as you do not confuse the normal route with Skogshornrenna.",
    ascent: [
      "Start at the large car park by Hyndra bru below Trefta on Lykkjavegen, 893 m. The car park charges, paid by SMS or Vipps as signed on site. The first seven hundred metres share ground with groomed cross-country tracks; the route leaves the trail corridor as soon as it starts to climb. Cross the river and go up the slope on the west side.",
      "On north-west across the open belt at 1000 to 1100 m. The birch holds to around 996 m, and above 1003 everything is open. Both the mapped ski-touring line and the marked summer path run here, 200 to 400 metres north of the crest itself, on the broad north-east shoulder — that is the line drawn here, and it is gentler than the crest.",
      "At about 1320 m you reach the foot of the east ridge, and it is followed all the way to the top. The climbing is even: the bands from 1300 to 1600 m average 19 to 20 degrees, and the steepest hundred-metre band, 1500 to 1600 m, measures 19.7 degrees. The summit ridge itself is gentle, and the last 130 metres to 1729 m run at 11 degrees.",
      "The summit ridge is often scoured hard. That is not an avalanche problem in itself, but it decides whether the last hundred metres are pleasant or not.",
    ],
    descent: [
      "Back the same way, east down the ridge and the slope to Trefta. The descent faces east — the drop-weighted mean bearing measures 84 degrees. The broad north-east-facing mountainside below the east ridge is the descent, and it is also the side that collects wind slab after westerly wind. That is the one assessment this tour actually demands.",
      "The usual mistake: taking Skogshornrenna because it looks like a quicker way down. The gully drops in from the flat of the west top and falls south: measured from there the south side holds 39.5 degrees on average with 56 at its steepest, while the north side is 9.4. It is a separate, avalanche-prone expert line — it is not the normal route, and it does not end where the car is parked. Fri Flyt also mentions a gully running due north from the summit down to the flat at 1100 m with a return south to the car park; that is a variant for people who know what they are choosing.",
      "Back down you rejoin the cross-country trail for the last seven hundred metres. Walk beside the groomed track, not in it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "An even, broad climb with no technical sections and no confined passages: the steepest sustained section on the line measures 23.2 degrees, and the steepest hundred-metre band, 1500 to 1600 m, 19.7 degrees on average. The broad north-east-facing mountainside below the east ridge collects wind slab after westerly wind, and that is exactly where you ski down — so the wind history of the last few days matters more than the angle on this tour.",
      },
      {
        title: "The terrain around it",
        body: "Skogshornrenna drops in from the flat of the west top and falls south — 39.5 degrees on average, 56 at its steepest. It must not be confused with the normal route, nor with Fri Flyt's north variant, which descends the gentle north side. The summit ridge is often scoured hard. Otherwise the mountain is broad and easy to read — this is a tour where the mistake is choosing the wrong way down, not being surprised on the way up.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "893 m",
      endLabel: "1729 m",
      distanceLabel: "3.9 km",
      caption: "836 metres of climbing and 3.77 km from Trefta, with the steepest hundred-metre band at 19.7 degrees between 1500 and 1600 m.",
    },
  },
  finnbufjellet: {
    intro:
      "620 metres of ascent and 4.37 km from the camping ground at the top of the Halsabakkane hairpins — the mountain Fri Flyt's index calls the place where the Voss ski season opens and closes. The whole line runs on open ground above the treeline, and the numbers are kind: the steepest 100-metre band measures 13.2 degrees between 900 and 1000 metres, and the steepest sustained stretch 23.3 degrees. The names need a sentence: Fri Flyt calls the mountain Finnbufjellet and quotes 1358 metres, but the top itself is registered as Finnbunuten, and the terrain model reads 1357 — the same pattern as Kirketaket, where guidebook and register each carry their own name.",
    ascent: [
      "The start is the flat where highway 13 tops the Halsabakkane hairpins and meets the Sendo river — the camping ground at Sendo, 766–779 metres on open ground. The sources appear to contradict each other here, and the terrain settles it: Fri Flyt's fact box says '770 vertical metres', the Utemagasinet version of the same description says 588 metres of ascent from the same car park — and the road passes 770 metres exactly where the hairpins level out. 770 is the starting elevation, not the climb; the routed line collects 620 metres.",
      "Cross the bridge over the Sendo river and head south. The river you cross runs east along the flat and then plunges through the waterfall into Kvassdalen, the valley highway 13 climbs out of — the valley floor down there reads 574 metres. West of you the Finnbu streams cut ravines down towards the river, with the Finnbuene summer farm on the west bank. The ridge between the ravine and Kvassdalen is the route: it is the one Fri Flyt points to as the soundest alternative, and it is the only ridge east of the ravine.",
      "The ridge is even and open: 793 metres at its foot, 871 midway, 992 where it broadens. The steepest 100-metre band of the tour sits here — a mean 13.2 degrees between 900 and 1000 metres — and it is still gentle enough to skin straight up in most conditions.",
      "On the shoulder at 1090 metres the alternative approach from the Myrkdalen ski resort comes up — 'after an hour's walking', says Fri Flyt, and the meeting point is where the ridge levels out. From there the line runs west on the broad flank: 1146, 1221 and 1302 metres on the ridge towards the summit, with the steepest sustained stretch of 23.3 degrees along the way.",
      "The cairn stands at 1357 metres. The terrain model and the register agree this is Finnbunuten — the highest point of the massif, against a published 1358 — and that the register's own Finnbufjellet point further north reads 1331 and is not the top. Northwards the ridge lies almost flat — a mean 2.7 degrees for the first kilometre — and the west and north-west sides plunge: stay on the east side of the cairn when it blows.",
    ],
    descent: [
      "The soundest way down is the way you came up, says the source, and the measurement agrees: the east flank you climbed holds a mean 6.9 degrees from the cairn towards the north-east, with 23.7 degrees as the steepest 60-metre window 650–710 m out. Fine cruising the whole ridge down to the shoulder, and the ridge on down towards Sendo.",
      "Fri Flyt mentions 'a whole row of descent options' without describing them, and the measurements say why the line choice has to be awake off the route: the west side falls 50.3 degrees at its steepest 440–500 m from the cairn, and the north-west side 56.7 degrees 420–480 m out — down into Finnbugjuvet and the ravines west of the ridge. The south-east side measures 28.1 degrees 690–750 m out and the east side 28.4 degrees 660–720 m out, so even the gentler sectors carry slopes further out.",
      "From the shoulder it is the ridge down to the bridge and the last metres across the river to the camping ground — the tour gives back 34 vertical metres in total, so the descent is clean.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt rates it KAST 1 – easy, and that applies to the ridge, not the flanks beside it: the line itself has 23.3 degrees as its steepest sustained stretch and 13.2 degrees as its steepest 100-metre band, between 900 and 1000 metres. It runs on open, wind-exposed ground from the first metre — there is no forest to shelter in.",
      },
      {
        title: "The north ridge and the ravine",
        body: "'The north ridge has a couple of exposed areas where skills and avalanche danger must be judged', writes Fri Flyt — the north ridge is not this route, and that needs saying, because it lies right beside it: from the cairn northwards the mean is only 2.7 degrees over the first 800 metres, and it is exactly that flatness that puts you there without choosing it. West of the ridge, Finnbujuvet collects wind-blown snow — which is why this mountain opens and closes the season — and the west and north-west sides below the summit fall 50.3 and 56.7 degrees at their steepest. In flat light, the edge above the ravine is the one thing to keep track of.",
      },
      {
        title: "The road",
        body: "The approach is its own factor: highway 13 over Vikafjellet is a weather-exposed mountain crossing, and the camping ground sits on the ploughed edge of it. Fri Flyt calls the access easy — and it is, when the road is open. Check the road reports the same day, and assume that what closes the road is also the weather that loads Finnbujuvet.",
      },
      {
        title: "Before you go",
        body: "Finnbufjellet is in the Voss forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes season months for this tour; the card's jan–apr is borrowed from the app's other Voss tours, and Fri Flyt's index says the mountain opens and closes the Voss season — so it stretches at both ends when the snow is there. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "772 m",
      endLabel: "1357 m",
      distanceLabel: "4.4 km",
      caption: "620 metres of ascent and 4.37 km from the camping ground at Sendo — open ridge the whole way, with 23.3 degrees as the steepest sustained stretch.",
    },
  },
  storehorn: {
    intro:
      "A short walk from the car to a summit that looks out over the whole of Hemsedal. The tour starts above the treeline and the ground is open from the first step — a good first ski tour in the valley, and a quick morning summit once you know it.",
    ascent: [
      "The way in to Hornslie is a toll road paid by card: from Hemsedal centre follow rv52 east toward Gol, turn off for Torsetstølane, and above the treeline keep right and follow the road until it ends at the car park. From Hornslie, where Leinestølvegen ends at 1056 m, you climb the first pitch straight off. It is shorter than it looks — the first hundred-metre band, 1000–1100 m, averages 18.8° — and it flattens out over the lip. There is no forest to deal with: the entire tour runs in open terrain.",
      "Over the lip the Hødnetjedne basin opens up — Horntjerne on the Kartverket map — and you give back 45 metres down to the lake at 1191 m. In winter the line runs straight across the frozen water; the summer path keeps to the left side. On the far bank the route splits into two marked lines: one longer and gentler out onto the northwest shoulder, one shorter and steeper up the east ridge. This description follows the east ridge.",
      "From the east ridge it is steady climbing west to the summit, with Veslehødn — Veslehorn on the map — and the whole of Hemsedalen behind you. The summit plateau is small, and its southern edge is closer to the cairn than it looks: eighty metres south of the top the ground drops 96 metres in twenty metres of ground. The southeast edge does the same, 63° over the steepest sixty metres, and the southwest edge 57°. Hold the ridge to the cairn, and stay north of the edge once you are standing there.",
    ],
    descent: [
      "Same way down. The east ridge gives even, open skiing back to Hødnetjedne, and the basin below is the flattest ground on the tour — expect to pole.",
      "The usual mistake: letting the terrain pull you northeast toward Veslehødn instead of turning down toward Hornslie. East of Veslehødn, Hydnefossen falls 155 metres free — the elevation model takes 151 of them in a single twenty-metre step — and below the fall the ground holds 50° on down. From the lake the way home runs southeast, and remember the 45 metres of climbing back out of the basin before the last pitch down to the car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line itself is gentle. The steepest hundred-metre band is 1400–1500 m, the last rise to the cairn, at 19.0°; the first pitch above Hornslie averages 18.8°. The steepest single step sits between 1370 and 1385 m and measures 25.6° — no part of the line passes 30°.",
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
      endLabel: "1482 m",
      distanceLabel: "3.0 km",
      caption: "471 metres of climbing and 2.99 km from Hornslie to the summit, with 45 metres given back in the Hødnetjedne basin.",
    },
  },
  storanosi: {
    intro:
      "742 metres of climbing over 4.67 km from Ljosno: open birch forest low down, and a wide plateau above Eggjane where the band from 1100 to 1200 m measures 3.4 degrees over 1784 metres of ground. The steepest hundred-metre band sits between 1000 and 1100 m and measures 18.4 degrees.",
    ascent: [
      "Start at the end of Ljosnavegen in Brandsetdalen, 510 m, east of Voss. The first 726 metres of ground are near-flat — the band from 500 to 600 m measures 7.1 degrees on average.",
      "Follow the birch forest up toward the north side of Middagshovden. The forest holds to 857 m, and above that everything is open. Kartverket classes the ground between 877 and 957 m as a firing range; check the local signs before you put the route through there.",
      "Before the top of the hovde you turn off toward Eggjane. The steepest hundred-metre band of the tour is here, 1000 to 1100 m averaging 18.4 degrees, and the steepest sustained section measures 24.5 degrees between 1079 and 1093 m.",
      "From Eggjane at 1179 m it is one and a half kilometres of plateau west to Storanosi, 1205 m. The band from 1100 to 1200 m measures 3.4 degrees over 1784 metres of ground — that is the part that makes this tour long rather than steep, and the line gives back 47 metres of height along the way.",
    ],
    descent: [
      "Back the same way, north-east across the plateau and down through the birch forest to Ljosno. The mountain is known for dry snow after several days of easterly wind, and it is the plateau and the open forest that hold it.",
      "The usual mistake: taking the eastern gully from the summit because it looks like a shorter way down. The gully is 30 degrees steep and is an assessment of its own — it is not the normal route, and it does not end where the car is parked.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Gentle the whole way: the steepest hundred-metre band, 1000 to 1100 m, measures 18.4 degrees, and the steepest sustained section 24.5 degrees between 1079 and 1093 m. The plateau from 1100 to 1200 m lies at 3.4 degrees — up there the challenge is navigation in poor visibility, not the angle.",
      },
      {
        title: "The terrain around it",
        body: "The eastern gully from Storanosi is 30 degrees steep and avalanche-prone; assess it on its own terms if you want to ski it. Kartverket also classes the ground between 877 and 957 m on the ascent as a firing range.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Voss at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "510 m",
      endLabel: "1205 m",
      distanceLabel: "4.7 km",
      caption: "735 metres of climbing and 4.43 km from Ljosno in Brandsetdalen, with the treeline at 857 m and one and a half kilometres of gentle plateau from Eggjane to the cairn.",
    },
  },
  lonahorgi: {
    intro:
      "1307 metres of climbing from 139 m — one of the longest continuous ascents at Voss, and technically one of the easiest. The steepest sustained section on the line measures 28.9 degrees, and the north ridge over the last 107 metres is nearly flat.",
    ascent: [
      "From the E16 at Grotlandsbrua, about a kilometre north of the end of Lønavatnet, turn west and drive Høylandsvegen up to the abandoned farm at Høyland, 139 m. The forest track takes over there. Note that ploughing all the way is not documented — this is a gravel road to a disused farm, not a winter road.",
      "Follow the forest track south-west to Bergsstølen at 380 m and on up the narrow valley at Breiming, 610 m. The forest holds to around 563 m and the ground is open from 583. The narrow section at Breiming is avalanche terrain — it is the one place on the tour where you stand in a trough with sides above you.",
      "Continue by the gentlest line north-west towards Svartahorgi, left of the trigonometric point 834, and round Svartahorgi itself (1037 m; the SSR point sits 41 metres off the top and reads 1029) before joining the ridge at about 1003 m. The steepest hundred-metre band on the tour lies between 800 and 900 m and averages 18.6 degrees.",
      "The ridge is followed west and then south over point 1305 — which reads exactly 1305 m — and up the north ridge to the summit at 1412 m. The final 107 metres take 1.1 km of ground, and the line drops 17 m from point 1305 before it climbs again: a broad, gentle ridge, and often scoured hard because it is exposed to the wind. Most people who climb Lønahorgi start from the top of the Horgaletten lift at about 920 m and have 490 metres left; this route is the long version from the road, and it is also the one Fri Flyt calls the finest way down.",
    ],
    descent: [
      "Down the same line: the north ridge to point 1305, east over Svartahorgi and down to Breiming and Bergsstølen, and finally the forest track down to Høyland. The descent faces north-east. The bottom section is thin: the snow cover at Høyland and Bergsstølen is short-lived, and later in spring it is worth taking the skis off early rather than scraping the last hundred metres.",
      "The usual mistake: assuming Bodegaen is the descent on this tour. That well-known freeride face lies on the south-east side of the mountain and feeds back into the Bavallen lift system — it does not end at your car at Høyland. The documented variant from this route is to drop into Årdalen from point 1307 in stable conditions, and Årdalen is the east side, the steep part of the mountain.",
      "The second mistake is using the narrow valley at Breiming as a descent line without thinking about what lies above it. Large full-depth avalanches release here late in spring and run a long way.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line is technically simple: the steepest sustained section measures 28.9 degrees and the steepest hundred-metre band, 800 to 900 m, 18.6 degrees on average. The narrow valley at Breiming is the one place the route enters avalanche terrain, and it is also where it is most confined. The ridge from point 1307 upwards is broad and gentle to the west — under one degree for the first four hundred metres — but it is also the western rim of the Årdalen face: east of the line the flank measures 33 degrees on average over four hundred metres, with 48 to 52 at its steepest. The crest is wind-exposed and often scoured, and the snow it has lost is sitting on exactly that lee side.",
      },
      {
        title: "The terrain around it",
        body: "The east side down towards Årdalen is the steep part of the mountain, and the route follows its rim for the last kilometre, and large full-depth avalanches release there late in spring and run a long way. Årdalen lies north-east of the summit at about 930 m and is a documented descent for those who choose it deliberately — not a short cut home. The snow cover down at Høyland and Bergsstølen is thin and short-lived.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Voss at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "139 m",
      endLabel: "1412 m",
      distanceLabel: "6.7 km",
      caption: "1307 metres of climbing and 6.71 km from Høyland, with the last 107 metres spread over 1.1 km of gentle north ridge.",
    },
  },
  vatnaknausen: {
    intro:
      "980 metres of ascent and 7.48 km from Tverrberg, and nearly half of it on a road: the toll road from Selheim ends at the car park at 383 metres, and the road chain on into Budalen carries you past Øvraset to Nyestølen at 707 before the mountain takes over. The numbers on the line itself are kind — steepest 100-metre band 13.9 degrees between 700 and 800 metres, steepest sustained stretch 21.9 — but Fri Flyt rates it KAST 2 – challenging, and that is about route-finding in the broken ground above the treeline, not about any single steep slope. From the cairn: the panorama over Voss the tour is sold on.",
    ascent: [
      "Follow the road to Selheim farm, pay the toll and crawl steeply up to Tverrberg 'or to a suitable stopping place near the snow line', as the source puts it — the mapped car park reads 383 metres, but the snow line decides where the tour actually begins, and a lower start adds vertical metres. On foot from there: Tverrbergsvegen continues south to the junction at 475 metres, where the Øvraset road branches east.",
      "The Øvraset road carries you into Budalen: 533 metres along the way, Øvraset at 639, and the valley floor at 670 — bog and thinning forest where the valley opens. The road ends and summer-farm country takes over up to Nyestølen at 707 metres. The register holds 27 Nyestølens; this is the one in Budalen.",
      "From Nyestølen head straight north along the treeline, as the source says — the forest ends at 822 metres by Kartverket's classes. The steepest ground of the whole tour lies below that line, not above it: the 100-metre band between 700 and 800 metres measures a mean 13.9 degrees, and the steepest sustained stretch — 21.9 degrees — sits between 738 and 756 metres, in the trees just above the summer farm. Above the treeline it eases to 11.2 degrees towards the ridge, and from there it is the route-finding in the broken ground, not the steepness, that demands the care.",
      "Up onto the ridge west of the Rjupetjørnane tarns, as the source advises: the line gains the ridge at 978 metres, follows it over 1031, and passes the tarns — they lie at 1089 — on their north side on open ground at 1103 metres. From there east: the plateau carries you over 1215 towards the top.",
      "The cairn stands at 1302 metres, against a published 1303. The register holds two Vatnaknausen points — Topp and Berg, the latter at 1199 — and the summit search climbed the last metres from the Topp point. The view over Voss is the reason the tour exists.",
    ],
    descent: [
      "The same way down, says the source, and it sells the sunset — the tour faces west, and the afternoon sun softens the snow the whole way home. Be clear about what that means: what is soft at four o'clock refreezes when the sun goes down, and west-facing slopes change fastest exactly then.",
      "The descent starts westwards off the plateau, because right by the cairn the ground plunges in the other directions: the east side falls 40.6 degrees only 50–110 m out, the south-east side 46.7 degrees 40–100 m out, and the north-east side 43.8 degrees 340–400 m out. The 'knaus' in the name is real — hold west until you are back down on the ridge.",
      "From the ridge the same way back: down the flank to Nyestølen, and the road chain out of Budalen to Tverrberg. The tour gives back 60 vertical metres in total, most of it in the broken ground on the plateau and the road's own dips.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt rates it KAST 2 – challenging, with the reasoning the source itself gives: 'somewhat steeper broken terrain', where the effort lies in setting the track below 30 degrees. The measurement of the chosen line says where the steepest ground actually is: the 100-metre band at 13.9 degrees between 700 and 800 metres and the steepest sustained stretch at 21.9 degrees between 738 and 756 — both below the treeline at 822, between Nyestølen and the forest edge. The flank up to the ridge measures 11.2 degrees. The route-finding, not the route, is the challenge — step off it and the broken ground offers 30-degree slopes quickly.",
      },
      {
        title: "The summit knoll",
        body: "From the cairn the ground drops abruptly in three directions: 40.6 degrees to the east only 50–110 m out, 46.7 to the south-east 40–100 m out, and 43.8 to the north-east 340–400 m out. In good visibility it is obvious; in fog the flat east sector — the mean eastwards is −0.3 degrees over the first 800 metres because the plateau continues — is a trap that walks you onto the edge. A compass bearing west from the cairn, always.",
      },
      {
        title: "West-facing",
        body: "The whole mountainside the tour climbs faces west and south-west. That gives sun-softened snow in the afternoon and the sunset the source sells the tour on — and it also gives daily soaking and refreezing as spring advances. Treat timing as part of the route choice: the flank below the treeline is the steepest part, and the plateau above it gets the sun last.",
      },
      {
        title: "Before you go",
        body: "Vatnaknausen is in the Voss forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes season months for this tour; the card's jan–apr is borrowed from the app's other Voss tours, and the guide says so. The toll road to Tverrberg carries a fee. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "383 m",
      endLabel: "1302 m",
      distanceLabel: "7.5 km",
      caption: "980 metres of ascent and 7.48 km from Tverrberg — road into Budalen to Nyestølen, the ridge west of the Rjupetjørnane tarns, and 21.9 degrees as the steepest sustained stretch.",
    },
  },
  horndalsnuten: {
    intro:
      "1121 metres of climbing over 5.93 km from Skiple in Raundalen, with a kilometre and a half of flat approach before the ground starts to rise. The steepest sustained section measures 31.4 degrees between 1093 and 1116 m — north-facing, and the final pitch to the summit is the steepest part of the route.",
    ascent: [
      "Start at the mapped car park by the bridge over Raundalselvi at Skiple, 398 m, about twenty kilometres east of Voss. The first 1490 metres of ground are near-flat — the band from 300 to 400 m measures 0.8 degrees — and the route crosses the river early.",
      "Follow the tractor road past Horndalsbruni and into Horndalsbotnen at 757 m. The forest holds to 781 m, and in the upper slope toward Bjørnsetstølen there are avalanche paths; keep to the forest down there.",
      "From the basin the route climbs toward the shoulder. The band from 900 to 1000 m measures 16.9 degrees and 1000 to 1100 m runs at 21.4, the steepest hundred-metre band. The steepest sustained section of the whole tour is here, 31.4 degrees over thirty metres between 1093 and 1116 m.",
      "Above the shoulder at 1153 m it eases for a while, 13.3 degrees from 1100 to 1200 m, before the last pitch: 20.6 degrees from 1200 to 1300 m, and then steadier ground to the cairn at 1462.",
    ],
    descent: [
      "Back the same way, north through Horndalsbotnen and out along the flat approach to Skiple. The descent faces north, so the mountain holds cold snow for a long time — which is also why there is rarely spring corn to be had here.",
      "The usual mistake: putting the descent into the upper slope toward Bjørnsetstølen because it looks open. That ground is avalanche paths. The second is underestimating the approach: 1490 metres of near-flat ground is hard work on the way back in soft snow, and the tour is longer than its vertical suggests.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A flat approach, an even middle and a steep pitch at the end. The steepest hundred-metre band, 1000 to 1100 m, measures 21.4 degrees, and the steepest sustained section 31.4 degrees between 1093 and 1116 m. The whole face is north-facing.",
      },
      {
        title: "The terrain around it",
        body: "The upper slope toward Bjørnsetstølen is avalanche paths — the one place on this tour to stay in the forest rather than in the open. Fri Flyt also describes a southern start from Skaftedalen via Skytjeset; that is a different route on the same mountain, not an option halfway up.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Voss at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "398 m",
      endLabel: "1462 m",
      distanceLabel: "5.9 km",
      caption: "1121 metres of climbing and 5.93 km from Skiple through Horndalsbotnen, with the treeline at 781 m and the shoulder at 1153 m before the summit pitch.",
    },
  },
  folarskardnuten: {
    intro:
      "Buskerud's highest point, and a tour where 13.06 km and 997 metres of climbing come almost entirely without steep ground. The only step that asks anything of you leads out of Folarskardet, and it is short — the rest is a long, even approach across Hallingskarvet.",
    ascent: [
      "From the car park on Rv7 at Haugastøl, 1007 m, you follow the marked DNT winter route toward Raggsteindalen northward. The first eleven kilometres are the approach: over the rise at 1212 m, out onto the flats below Folarskardet at 1326 m, and some 600 metres of climbing spread so thinly that the band between 1200 and 1300 m averages 2.1 degrees. This is poling, not skinning. Along the way the line runs on ice three times: Tjørngravtjørni at 1098 m twice, 135 and 45 metres, and an unnamed tarn at 1230 m for 45. None is regulated and no crossing goes more than 48 metres from shore — these are small high-country tarns the marked route runs straight over — but on a day where the rest of the approach is firm ground they are worth knowing about.",
      "At Lordehytta in Folarskardet, 1620 m, you leave the marking. The hut dates from 1880 and stands in the pass itself; the tarn beside it lies at 1603 m and is water under the snow — the line runs 270 metres across it, up to 84 metres from shore, and that is the fourth and longest ice crossing of the tour. The route description says you leave the markers at the tarn and follow cairns upward, and that is the line drawn here — not the straight line from the hut to the summit, which measures 40.3 degrees at its worst step.",
      "The step out of the pass is the tour's only steep section: 35 to 40 degrees, measured at 36.7 degrees over 41 metres on the gentlest ramp anyone finds. The line cuts across the step rather than taking it head on, and so reads lower: 29.2 degrees over its steepest 30-metre window, between 1775 and 1795 m. The 18.7-degree average for the 1700 to 1800 m band is an average over 337 metres of ground and hides the step entirely. If the snow is hard or wind-scoured, this is where people put crampons on.",
      "Above the step, at about 1830 m, it flattens again, and the last 702 metres run west-south-west — a bearing of 253 degrees — up to the summit at 1932 m, evenly, at 0.5 to 17.5 degrees. Note that the cairn in the route descriptions stands on the north-east top: 1927 m, 821 metres away on a bearing of 36 degrees, with a 1900 m saddle between them. The terrain model gives 1932.2 m at the high point and 1927.3 m on the north-east top, against a published 1933. The summit plateau is open and gives you little to navigate by.",
    ],
    descent: [
      "Back the same way: over the lip of the step, down the ramp to Lordehytta, and then the eleven kilometres back to Haugastøl. The descent faces south — the drop-weighted mean bearing is 154 degrees — but it is also short. Below the pass it is long, gentle transport, and with a headwind on the flats the way home takes as long as the way in.",
      "The usual mistake: wandering onto the north side of the escarpment looking for a better line down. The cornices on the north side hang far out over Raggsteindalen, and the edge is invisible from the plateau in flat light. The second mistake is underestimating the weather window: the tour is not steep, but it is long, and turning around on the summit plateau in poor visibility means eleven kilometres left into the wind.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The step up out of Folarskardet is 35 to 40 degrees and is the only real avalanche terrain on the tour. The line as drawn crosses the step rather than avoiding it. The figures for it — 27.2 degrees at its steepest, 18.7 on average for the 1700 to 1800 m band — describe the track and not the ramp: the line cuts across the step, while the fall line there measures 36.7 degrees over 41 metres. Miss the ramp and neighbouring lines measure 40 to 46 degrees. The step can also be scoured and icy, and then crampons rather than snowpack assessment are the problem.",
      },
      {
        title: "The terrain around it",
        body: "The cornices on the north side of Hallingskarvet hang far out over Raggsteindalen, and the summit plateau is open and hard to navigate in poor visibility — it is easy to walk towards an edge you cannot see. The west side is Hellevassfonn and the Finse traverse, a different route from this one. The long approach means the weather matters more than the angle: eleven kilometres is a long way to turn back.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "1007 m",
      endLabel: "1932 m",
      distanceLabel: "13.1 km",
      caption: "997 metres of climbing and 13.06 km from Haugastøl, eleven of those kilometres approach and one short step out of Folarskardet all there is of steep ground.",
    },
  },
  prestholtskarvet: {
    intro:
      "963 metres of climbing and 11.63 km from Havsdalen to the high point at 1860 m, twelve kilometres onto Hallingskarvet. Eight of them are flat: the band from 1200 to 1300 m measures 1.3 degrees over 5130 metres of ground. All the climbing sits in Prestholtskardet — 17.6 degrees from 1500 to 1600 m over 315 metres of ground, with a step of 24.8 degrees between 1323 and 1344.",
    ascent: [
      "Start at the car park at the bottom of Havsdalen, 963 m — three paid plots side by side, all tagged access=yes in OSM. Ut.no draws its tour from the top of the ski centre, 1070 m, which is convenient when the lift runs; the corridor here starts where the car stands, and the difference between the two starting points is why the climb on the card is larger than ut.no's published 855. The forest lets go at 1048 m and the ground is open from 1051.",
      "From 1058 m you are on the marked trail west. Ut.no: «follow the marked trail to Prestholtseter (eight km). The trail is groomed daily and is accordingly in very good condition, with both classic and skating tracks.» It is a flat approach in the literal sense — the band from 1000 to 1100 m measures 3.3 degrees over 1711 metres of ground, 1100 to 1200 measures 4.6 over 1216, and 1200 to 1300 measures 1.3 over 5130. The line passes 1240 m and holds that level for five kilometres.",
      "Prestholtstølan sits at 1243 m, directly under the south side of the skarv. From here the tour starts again: 16.3 degrees from 1300 to 1400 m over 315 metres of ground, 17.2 from 1400 to 1500 over 316, and 17.6 from 1500 to 1600 over 315 — the steepest band. The steepest step on the whole line sits lower, 24.8 degrees between 1323 and 1344 m. That is Prestholtskardet, and the register point for the pass measures 1640 m.",
      "Up on the skarv it eases abruptly: 10.3 degrees from 1600 to 1700 m over 540 metres of ground, 7.1 from 1700 to 1800 over 855, and 4.2 from 1800 to 1900 over 742. The last two kilometres run west over a wide, open plateau to the high point, 1860.4 m. The register point for Prestholtskarvet lies 550 metres north-east, between two tops measuring 1860.4 and 1857.5; ut.no's own line ends 20 metres from the higher one, and that is the one the card carries.",
    ],
    descent: [
      "Back the same way: west across the plateau, down Prestholtskardet and out along the trail. The south flank is the one the card carries, and it is not gentle — south measures 18.1 degrees on average out to a kilometre and a half with a 51.1-degree window 925 to 975 metres out, south-east 14.7 with 66.0 in the window 1225 to 1275, and south-west 11.2 with 49.3 at 475 to 525. That is the wall above Prestholt, and Prestholtskardet is the one place it breaks.",
      "The intuition that the drop must therefore be on the far side is wrong here. North measures 2.0 degrees on average out to a kilometre and a half with a steepest 60-metre window of 6.6, and north-east 4.3 with 12.0 — the skarv simply carries on. Within 400 metres of the summit every single bearing is under 10 degrees. It is a plateau, and the danger on it is not angle, it is visibility: you are standing at 1860 m with twelve kilometres home and nothing to steer by.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "963 metres of climbing where the steepest band is 22.0 degrees and the steepest step 25.2, both in Prestholtskardet. The route gives back 66 metres over 11.63 km. Ut.no grades the tour a demanding ski tour and 21.6 km return from the lift top, and writes that it «is most often done in late winter or spring once the snow has settled» — that sentence is about the pass.",
      },
      {
        title: "The terrain beyond",
        body: "The south wall under the skarv measures 66.0 degrees in its steepest 60-metre window to the south-east, 51.1 to the south and 49.3 to the south-west. You climb up through the one break in it. West of the summit there is a step of 30.1 degrees 425 to 475 metres out. Northward the plateau is flat as far as the sweep runs, but the edge is out there somewhere, and in flat light you find it before you see it.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal on varsom.no. Hallingdal is an A region and is forecast every day in season. Ut.no gives the season as January to April and calls the tour manageable in good weather for anyone with some cross-country experience — «in good weather» is the part carrying that sentence. Take a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "963 m",
      endLabel: "1860 m",
      distanceLabel: "11.6 km",
      caption: "963 metres of climbing and 11.63 km from Havsdalen past Prestholtstølan at 1243 m and up Prestholtskardet at 1640, with the forest letting go at 1038 m.",
    },
  },
  gyranfisen: {
    intro:
      "666 metres of climbing over 5.36 km from Vikerkoia, 661 m, to the highest point in Ringerike at 1127 m. The difference between those two figures is the dip: the route climbs onto Svarttjernskollen, 1054 m, drops toward Fjelldalen and climbs again, giving back 200 metres that come back as climbing on the way home.",
    ascent: [
      "Start at the car park by Vikerkoia on Vikerseterveien, 661 m — Kartverket classes the point as bog, which is an accurate description of Vikerfjell. The first metres of climbing are gentle, 5.1 degrees from 600 to 700 m, before the forest takes over at 698 m.",
      "The climb up to Svarttjernskollen is the steepest part of the tour: 15.4 degrees from 700 to 800 m over 360 metres of ground, with a steepest sustained section of 24.9 degrees between 767 and 788 m. The forest holds all the way to 946 m, and from 948 you are out in open terrain.",
      "Svarttjernskollen sits at 1054 m, and ut.no gives 1054 — that is the check that you are on the right ridge. From here you see the Vikerfjell plateau to the south and Gyranfisen to the west. Then it goes down again: the line passes 1002, 961, 904 and 922 m, and Kartverket classes several of them as forest. You are below the treeline again, in the middle of the tour.",
      "Venekollen, 982 m, is passed on your right, and the corridor's waypoint sits west of the top at 949 m, where the route actually runs. From the bottom of the dip it climbs evenly again — 4.1 degrees from 1000 to 1100 m over 1207 metres of ground, and 8.0 degrees in the last band — to the cairn at 1127 m. Treknatten, 1098 m, lies 4.20 km north-north-west, on a bearing of 340.",
    ],
    descent: [
      "Back down the same way, south-east, and you will be climbing again on the way. That is the character of this tour: 200 metres given back on the way up means 200 metres to climb on the way down, and it is worth having saved something for them.",
      "The mountain is gentle in every direction. Radial measurements from the cairn give 4.8 to 12.6 degrees on average over 500 metres, and the steepest 60-metre window on the whole summit is 29.9 degrees to the north-east, 410 to 470 metres out. The west side — the one toward Vidalen — measures 5.7 degrees on average all the way out to a kilometre and a half, with a steepest window of 20.9 degrees. The cliffs you see that way belong to Bukollen, Gråfjell and Storrustefjell on the far side of the valley, not to the mountain you are standing on.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Gentle terrain with one pitch: 15.4 degrees from 700 to 800 m over 360 metres of ground, and a steepest sustained section of 24.9 degrees between 767 and 788 m. The other bands measure 2.3 to 10.5 degrees on average. The avalanche hazard is low; what can go wrong is the length, the dip, and that the last stretch to the top is unmarked.",
      },
      {
        title: "The terrain around it",
        body: "No direction from the cairn averages more than 12.6 degrees over the first 500 metres. The ridge from Svarttjernskollen is scoured by wind, and the dip toward Fjelldalen and Steintjern has to be crossed both ways. The tracks to Gyranfisen and Treknatten are only groomed when conditions allow and are prioritised in the winter and Easter holidays — outside that the route is untracked bog and fjell. Part of the area lies within the Vikerfjell nature reserve.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Buskerud sør at varsom.no. Buskerud sør is a B region: it is only forecast at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "661 m",
      endLabel: "1127 m",
      distanceLabel: "5.4 km",
      caption: "666 metres of climbing and 5.36 km from Vikerkoia over Svarttjernskollen, with the treeline at 946 m and 200 metres of height given back in the dip on the way.",
    },
  },
  oksen: {
    intro:
      "967 metres of climbing in one go, from Tjoflot down by the fjord to a summit that looks out over Hardangerfjorden, Granvinsfjorden, Sørfjorden and Eidfjorden. The tour asks for fitness more than technique.",
    ascent: [
      "From the pay parking at the top of Tjoflotvegen, 276 m, you follow the tractor road a short way before the path takes over. Expect to carry skis through the forest: the treeline is at 538 m, and most people put them on up at Vindhovden.",
      "The forest is the steepest section before the flank. Between 335 and 405 m the fall line averages 30° and hits 51° over the steepest sixty metres; the path takes it in switchbacks — no hundred metres in the forest holds more than 21° — and tops out at 29° around 490 m. Follow the switchbacks — there is no shortcut here that pays.",
      "At the summer farm at Vindhovden, 586 m, it opens up. From here you follow the southwest side east toward the summit, along the shoulder below the ridge. Around 900 m it tightens: the 900–1000 m band averages 24.3° and the 1000–1100 m band 19.0°, and the steepest single step on the line, 29.1°, sits lower down, at about 490 m in the forest. The ground turns rocky at the same time.",
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
        body: "The route climbs 967 metres in 3.66 km, and its steepest part lies between 900 and 1100 m: 24.3° on average over the first hundred-metre band, 19.0° over the next. The steepest single step on the line measures 29.1° and sits at about 490 m, in the forest below Vindhovden. That is above the angle at which snow releases, and the section is long enough that it deserves its own judgement call.",
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
      startLabel: "276 m",
      endLabel: "1241 m",
      distanceLabel: "3.7 km",
      caption: "276 m at Tjoflot to the summit of Oksen — 967 metres of climbing over 3.66 km, without a metre given back.",
    },
  },
  ustetind: {
    intro:
      "416 metres of climbing and 4.38 km from Ustaoset to the big cairn at 1376 m. Nothing on the route is steep: the steepest hundred-metre band is 9.7 degrees from 1100 to 1200 m over 614 metres of ground, and the steepest sustained step 18.5 degrees between 1343 and 1355. The whole tour sits on the north-east edge of Hardangervidda, and it is the weather, not the angle, that decides the day.",
    ascent: [
      "Start at the car park at Ustaoset, 989 m. Ut.no draws its tour from a point 320 metres further north, up in the cabin field at 1005 m; the plot mapped in OSM sits down by the road, and that is the one the corridor uses. The rv 7 past Ustaoset is open all winter, and trains stop 692 metres to the north-west.",
      "The first kilometre is nearly flat — the band from 900 to 1000 m measures 0.9 degrees over 906 metres of ground — past the Sisseldalen summer farm and south. Then it picks up a little: 4.5 degrees from 1000 to 1100 m over 1231 metres of ground. The line passes 1104 m west of Måfådalen. The forest lets go at 1070 m and the ground is open from 1078.",
      "Above the treeline comes the one climb that earns the name: 9.7 degrees from 1100 to 1200 m over 614 metres of ground. Ut.no describes the same thing from the other side — «before Tindevatnet an even climb begins». The line passes the tarn on its east side, 1317 m, and above it the angle eases again to 7.4 and 4.9 degrees.",
      "The last kilometre is gentle ridge to the cairn at 1376 m, with the steepest step of the tour on the way: 18.5 degrees between 1343 and 1355 m. Two cairns stand on top. The small one carries a metal plate with arrows and place names; the big one is from 1899, protected, and was used as a trigonometric point — ut.no asks explicitly that you do not add stones to it.",
    ],
    descent: [
      "Back down the same way, northward. The north flank measures 9.9 degrees on average over 400 metres with a 15.2-degree window 70 to 130 metres out, and north-west 10.8 with 22.2 in the window 90 to 150. That is gentle enough that the descent is a tour rather than a line, and it is also the point of the mountain: bergen365 calls it a summit tour for early and late season, when the snow turns warm and wet further west.",
      "No bearing off this summit is steep. The steepest 60-metre window in the whole sweep is 28.9 degrees to the south-east, 110 to 170 metres out, and south-west measures 27.5 in the window 160 to 220. The averages run between 8.8 and 13.0 degrees in all eight directions.",
      "The tour can also be done from the private Tuva lodge to the south, which ut.no gives as an hour and a half up against a little over two from Ustaoset. Bergen365 describes a third variant, from the dam on Ustevatnet via Verpestølvegen, with around 400 metres of climbing.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "416 metres of climbing where the steepest band is 9.7 degrees and the steepest step 18.5. The route gives back 29 metres over 4.38 km. Ut.no grades the tour moderate and child-friendly. The angle is not the problem here.",
      },
      {
        title: "What is actually dangerous",
        body: "Bergen365 names three things on this route, and none of them is an angle: hidden running water under the snow from the streams crossing the hillside, unstable wind-transported snow above the treeline, and terrain traps. They write that avalanche assessment belongs here even though the slopes are moderate, and that weather and wind change fast at this elevation. Ut.no's summer description mentions dense willow scrub and boggy sections in the hillside — under snow that is the same thing: uneven ground and open streams.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hallingdal on varsom.no. Hallingdal is an A region and is forecast every day in season. Neither ut.no description is a winter one — both give May to October — so the season on the card is read off bergen365 and the trail season on the vidda, not off a source for this route. Take a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "989 m",
      endLabel: "1376 m",
      distanceLabel: "4.4 km",
      caption: "416 metres of climbing and 4.38 km from Ustaoset west of Måfådalen at 1104 m and past Tindevatnet at 1317, with the forest letting go at 1084 m.",
    },
  },
  skrott: {
    intro:
      "1068 metres of ascent over 5.03 km from the cluster of summer farms in Fitjadalen to Skrott, the mountain that drops toward Hardangerfjorden at the southern end of Kvamskogen. The line follows the mapped path the whole way: the footbridge over the Kjølo, the steep wooded hillside to Håsete, the ski hut at 1110 m and the notch between Glynt and the summit. The steepest hundred-metre band measures 17.4 degrees between 800 and 900 m and the steepest sustained stretch 28.2 degrees between 1158 and 1182 m — but what shapes the tour is the cliffs in the forest and the steep summit block, not the averages.",
    ascent: [
      "From the car park at the cluster of summer farms in Fitjadalen, 272 m, about eight kilometres from Øystese. The climb starts at the footbridge over the river Kjølo and mostly follows the summer path — first through spruce forest in awkward terrain, then across a flat, and up a hillside where Fri Flyt's own warning applies: «ugly cliffs in the forest». The bands measure 14.9 degrees from 300 to 400 m and 17.0 from 500 to 600, and the path is there for a reason — it goes around the cliffs.",
      "The forest ends at 676 m by Kartverket's classes, with open ground from 686, and just above you enter the small valley leading to Håsete — the summer farm sits at 754 m where the register has it, against the «around 800 metres» the source gives. From here you keep north-west with a steady climb: the band from 800 to 900 m is the tour's steepest at 17.4 degrees on average over 348 metres of ground.",
      "The little ski hut stands at a measured 1109.8 m — Fri Flyt calls it «about 1000 m», westcoastpeaks «the hut at 1100 m», and the terrain model settles it. From the hut the normal way goes north up into the notch between Glynt and the summit itself. The steepest sustained stretch of the line is here, 28.2 degrees between 1158 and 1182 m, before the notch lets you out onto the shoulder.",
      "Fri Flyt also mentions an alternative ascent from the ski hut: the summer path on a system of sloping ledges and up a short steep rise over the edge. The source itself warns against it in hard conditions or with west-facing cornices, and Westcoastpeaks recommends an ice axe and crampons on those same ledges in winter, and adds that in icy conditions axe and crampons are needed to get down from the summit itself. The corridor here is the notch, not the ledges, but the axe applies to the summit all the same.",
      "The shoulder where the summer path crosses, 85 metres north of the cairn, measures 1300.6 m, and the last metres south to the cairn are easy ground, exactly as the source says — the band from 1300 to 1400 measures 6.4 degrees. 1320 m, with Hardangerfjorden ahead of you — Fri Flyt writes that the mountain 'plunges straight into Hardangerfjorden', but the nearest fjord water lies 8 km away at Øystese, and the ground 3 km west and south-west of the cairn still stands at 550 to 800 metres.",
    ],
    descent: [
      "The terrain from the summit down toward Håsete invites variations on the ascent — those are Fri Flyt's own words, and the south-east and south sweeps from the cairn measure 38.9 and 39.5 degrees in their steepest 60 m windows 580 to 720 metres out, so there is steep skiing to be had. In late spring the source names the bowls and ribs a little east of the cairn, at the front of the edge and from there toward Håsete.",
      "What must not be skied is west and south-west from the cairn: the west side falls 49.0 degrees only 10 to 70 metres out, and the south-west side 45.4 degrees 160 to 220 metres out. Nor is north-west the way home — it falls 49.8 degrees on average over the first twenty metres and 34.8 out to 160, and the 7.0 degrees over 800 metres is only that drop into the notch levelled against the climb back up toward Glynt. The shoulder you came up lies due north, and measures 17.5 degrees on average over the first 400 metres — from the cairn the two sides look alike in flat light, and they are not.",
      "From Håsete the source's advice is to follow roughly the same way as up: «easy to get stuck in tangled terrain» is Fri Flyt's phrase for the wooded hillside, and the cliffs that shaped the ascent line are still below you.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt's hazard note is «avalanche danger in the upper part. Ugly cliffs in the forest.» The upper part is the flank from Håsete to the notch — steepest band 17.4 degrees between 800 and 900 m, steepest sustained stretch 28.2 degrees between 1158 and 1182 — and the cliffs in the forest sit in the 14.9 to 17.0 degree bands below the treeline at 676 m, where the path is the only sensible line choice. ut.no says the same in other words: the tour is primarily a hike, and as a ski tour some places are steep enough that avalanche knowledge is necessary.",
      },
      {
        title: "The summit block",
        body: "The west side falls 49.0 degrees only 10 to 70 metres from the cairn and the south-west side 45.4 degrees 160 to 220 metres out, while the north shoulder the line uses measures 17.5 degrees on average over the first 400 metres. The sloping ledges of the alternative way are the source's own warning in hard conditions or with west-facing cornices, and westcoastpeaks recommends an ice axe and crampons there in winter. On this summit the danger is not the average steepness but the edges.",
      },
      {
        title: "Before you go",
        body: "Skrott lies in the Voss forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes a ski season for this tour: ut.no's season field belongs to the hike (May to July and September), and the card's jan–apr is borrowed from ut.no's Tveitakvitingen description on the same massif. Bring a transceiver, probe and shovel. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "272 m",
      endLabel: "1320 m",
      distanceLabel: "5.0 km",
      caption: "1068 metres of ascent over 5.03 km from Fitjadalen, with the steepest ground — 28.2 degrees between 1158 and 1182 m — in the notch between Glynt and the summit.",
    },
  },
  sata: {
    intro:
      "895 metres of ascent over 6.6 km from the innermost car park at Eikedalen ski centre to a summit the register carries under two names: Såta and Iendefjell. It is two tours in one — a nearly flat approach into Skeiskvanndalen, where the band from 500 to 600 m measures 1.8 degrees on average over 3.15 km of ground, and then the mountain itself: from Rosselandsbotnen the flank rears up eastward, with the steepest hundred-metre band at 18.4 degrees between 1100 and 1200 m and the steepest sustained stretch at 32.5 degrees between 1139 and 1168 m, directly below the notch.",
    ascent: [
      "From the innermost car park at Eikedalen ski centre, 459 m, on Kråvegen. Fri Flyt sends you up a summer farm road for the first hundred metres of height, and that is Kråvegen eastward and the path beyond it: the line follows the mapped road and path to about 555 m, where the valley levels out.",
      "Then comes the long, flat approach into Skeiskvanndalen — 1.8 degrees on average through the band from 500 to 600 m, over 3.15 km of ground. The forest ends at 629 m by Kartverket's terrain classes, with open ground from 631, so most of the valley runs through sparse mountain birch and bog. The valley floor holds two natural lakes at 551 m — an unnamed tarn and Skeiskvanndalsvatnet — and the line keeps to the dry north-west side past both. That is measured, not hoped: 0 metres of the line stand on water.",
      "Rosselandsbotnen is the turning point. The register point for the botn itself sits on the tarn there — 661 m, terrain class lake — and the line passes its south shore on firm ground. Here you leave the valley floor, turn right as the source says, and start the steep climb: the bands above measure 16.1 degrees from 700 to 800 m, 17.7 from 900 to 1000 and 18.4 from 1100 to 1200, the steepest of the tour.",
      "Aim for the notch to the left of — that is, north of — the summit itself. It measures 1224 m, 190 metres north-north-west of the cairn, and the steepest sustained stretch of the whole line lies directly below it: 32.5 degrees between 1139 and 1168 m. The upper part of the notch and the summit ridge are often wind-blasted and hard, and Fri Flyt mentions an ice axe as an advantage — this is the part of the tour that decides whether the day is on.",
      "From the notch the summit ridge runs south to the cairn, past 1248 m — the band from 1200 to 1300 measures 9.1 degrees, so the steep ground is behind you once you stand in the notch. 1260 m, with Kvamskogen, Fuglafjellet and the fjord below.",
    ],
    descent: [
      "The usual descent is the same way: north off the summit ridge, down through the notch, and the west flank down toward Rosselandsbotnen. The flank you ski is the one you climbed — 25.4 degrees on average from the cairn westward, with 53.0 degrees as the steepest 60 m window 740 to 800 metres out — so the line choices on the way up are the line choices on the way down.",
      "Fri Flyt also describes the southwest-facing couloir between Såterindane. The source says to continue past the summit cairn to find it, and the register puts Såterindane 837 metres south-west of the cairn; the steep ground directly below the cairn — 43.4 degrees 110 to 170 metres out in the south-west sweep — is the summit shoulder, not the mouth of the couloir. The source is clear about the finish: turn right before the bottom of the couloir, before Såtedalen, and ski back toward the ascent route. The west flank straight off the top the source mentions only for days with a very stable snowpack.",
      "From Rosselandsbotnen it is the 3 km of flat valley out and the farm road down to the car park — the tour gives back 94 metres of height in all, most of it in the undulating valley floor.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt's own hazard note is «avalanches both up and down, and cliffs», and the measurements say where: the bands from 700 m upward range between 9.1 and 18.4 degrees on average, with 16.1 from 700 to 800, 17.7 from 900 to 1000 and 18.4 from 1100 to 1200 as the steepest, the steepest sustained stretch is 32.5 degrees between 1139 and 1168 m, and the steep ground continues past the cairn — the west side at 53.0 degrees at its steepest 740 to 800 metres out, the north-west side 53.6 degrees 690 to 750 metres out. The flank from Rosselandsbotnen to the notch is avalanche terrain in both directions, and it is the only way on this route.",
      },
      {
        title: "The summit and the notch",
        body: "The upper part of the notch and the summit ridge are often wind-blasted and hard — Fri Flyt mentions an ice axe, and this is where it means it. The south-west sweep from the cairn measures 43.4 degrees at its steepest 110 to 170 metres out, and that is the summit shoulder — the couloir between Såterindane lies 837 metres further south-west; the south-east side measures 35.7 degrees 440 to 500 metres out and the south side 37.3 degrees 740 to 800 metres out. The gentlest sector from the cairn is north-east, 13.7 degrees on average — but that is not the way the route goes.",
      },
      {
        title: "The lakes",
        body: "The two lakes on the valley floor — the unnamed tarn and Skeiskvanndalsvatnet, both at 551 m — lie a short hour from Bergen, low and coastal, and their ice cannot be assumed. The line therefore keeps to the dry north-west side past both, measured against Kartverket's terrain classes and OSM's water polygons: 0 metres on water. The register point for Rosselandsbotnen also sits on water, on the tarn at 661 m; the line passes its south shore on firm ground.",
      },
      {
        title: "Before you go",
        body: "Såta lies in the Voss forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. No source publishes a season for this tour; the card's jan–apr is borrowed from ut.no's description of Tveitakvitingen 12.6 km south, on the other side of Kvamskogen. Bring a transceiver, probe and shovel, and an ice axe for the notch when it is wind-blasted. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "459 m",
      endLabel: "1260 m",
      distanceLabel: "6.6 km",
      caption: "895 metres of ascent over 6.6 km from Eikedalen, with the steepest ground — 32.5 degrees between 1139 and 1168 m — directly below the notch north of the summit.",
    },
  },
  gullfjellstoppen: {
    intro:
      "839 metres of climbing and 7.8 km from the road end at Osavatnet to the highest point in Bergen. This is the gentlest tour in the collection: no hundred-metre band of the line averages more than 8.1 degrees, and the steepest sustained section is a single 27.4-degree step. The hazard is not in the route but in its last hundred metres — the summit dome is gentle, and the west side falls 59.0 degrees 200 to 260 metres from the cairn.",
    ascent: [
      "From the paid car park at the end of Gullfjellsvegen, 307 m, at the head of Bjørndalen. The first two kilometres follow a gravel road and are all but flat: the band from 300 to 400 m averages 2.5 degrees over 2.1 km of ground. The forest stops at 324 m, and everything above that is classed as open ground by Kartverket — this is a tour with no treeline to speak of.",
      "At 2.47 km you reach the south end of Svartavatnet, 410 m. Fri Flyt describes the road as running «til høgre for Svartavatnet», to the right of the lake, and that is where the line goes: on land the whole way past. Svartavatnet is registered as a regulated lake. Fri Flyt gives 392 m, the terrain model reads the water surface at 408, and the difference is not drawdown — it is the new dam: Bergen municipality built one downstream in 2012–2014 and raised the highest regulated level by 20 metres.",
      "Redningshytta sits 18 metres off the line, 4.23 km in; the hut point itself measures 597.5 m and the line where it passes 592, against the «600 moh» the source gives. Just after it comes the small dip the descriptions mention, and it is real: the line loses 50 metres, from 605 to 555 m over 252 metres of ground, between 4.11 and 4.36 km. That is 50 of the 159 metres the tour gives back along the way.",
      "From 555 m it climbs steadily again, and the steepest ground on the whole tour is here: a 27.4-degree step between 709 and 727 m. It is short, and it is the steepest thirty metres on the line.",
      "Past the tarn at 769 m, 6.21 km in, the ground levels into what the source calls a broken ridge of high ground. The steepest hundred-metre band of the tour is here, between 800 and 900 m, and it averages 8.1 degrees over 720 metres of ground. Then through Middagsdalen at 939 m, 7.40 km in, and up to the cairn at 987.",
    ],
    descent: [
      "Back down the same line: through Middagsdalen, over the high ground, past the tarn and down to Redningshytta. Below the hut the 50 metres you lost on the way up are waiting, this time as a climb. From Svartavatnet out it is gravel road at 2.5 degrees — you walk the last two kilometres.",
      "The common mistake on this mountain is drifting west or north-west from the cairn. The summit dome is gentle enough that the transition is not felt underfoot: the north side falls 45.8 degrees only 30 to 90 metres from the cairn, the north-west 61.2 degrees 90 to 150 metres out, and the west 59.0 degrees 200 to 260 metres out. The south side, the one you came up, averages 4.9 degrees over the first 800 metres. In flat light the difference is invisible.",
      "Fri Flyt also describes descents from the main summit by way of Gullfjellshalsen and Vossevardane to Svartavatnet. Those are different lines from this one, and they are not measured here.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line is gentle throughout. The steepest hundred-metre band, 800 to 900 m, averages 8.1 degrees, and none of the other six bands exceeds 6.9. The steepest sustained section is the 27.4-degree step between 709 and 727 m. What changes with the weather here is not the angle but the snow: the tour starts at 307 m on the coast, and the snow line often sits above the car park. Fri Flyt's own hazard note is not about this line but about the gullies in the massif: «Hele Glumragjelet, samt de to rennene, er veldig skredutsatt vinterstid, og på våren kommer det ofte is og stein ned fra de stupbratte fjellsidene» — the whole of Glumragjelet and the two runnels are badly avalanche-exposed in winter, and in spring ice and rock come down often from the sheer faces. The register spells the name Glamregjelet and puts the gully 663 metres due west of the cairn, at 576 m — below the west side the route does not ski, but stands directly above.",
      },
      {
        title: "The summit",
        body: "The whole tour is a warm-up for the last hundred metres. From the cairn the north side falls 45.8 degrees 30 to 90 metres out, the north-west 61.2 degrees 90 to 150 metres out and the west 59.0 degrees 200 to 260 metres out; the east measures 41.3 degrees 740 to 800 metres out and the south-east 30.6 degrees 380 to 440 metres out. The south side, the ascent, averages 4.9 degrees. A gentle dome over steep sides is exactly the terrain where a bearing error in cloud costs the most.",
      },
      {
        title: "The ice",
        body: "Osavatnet sits at 307 m on the coast at the latitude of Bergen, and Svartavatnet is registered as regulated. The line is therefore laid on land the whole way: 0 metres of 7 803 stand on water, checked against Kartverket's terrain class every two metres along the whole line — 3 769 points — and against OSM's water polygons. A regulated lake is drawn down in winter, and ice left spanning the void carries nothing.",
      },
      {
        title: "Before you go",
        body: "Gullfjellstoppen lies in the Hordalandskysten warning region, which is a B region: no daily avalanche forecast is issued for this mountain. The nearest A region is Voss, and it covers a different, more inland range — read it as context, not as a forecast for Gullfjellet. Bring a transceiver, probe and shovel. An empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "307 m",
      endLabel: "987 m",
      distanceLabel: "7.8 km",
      caption: "839 metres of climbing and 7.8 km from Osavatnet, with the steepest ground — a 27.4-degree step between 709 and 727 m — halfway up.",
    },
  },
  tveitakvitingen: {
    intro:
      "995 metres of ascent over 8.56 km one way from the Furedalen alpine centre to Tveitakvitingen — the longest of the four Kvamskogen tours, and the gentlest: the steepest hundred-metre band is 16.4 degrees between 800 and 900 m, and the steepest sustained stretch 25.0 degrees between 817 and 838. ut.no still grades the tour very demanding, and it is the length and the plateau that carry the grade — 17 km round trip across wide mountain terrain where the weather and the navigation are the difficulty, not the slopes. The line here is traced from ut.no's own GPX track, which ends 8 metres from the measured summit.",
    ascent: [
      "From the car park at the Furedalen alpine centre, 382 m. The name in the source — «Furudalen» — does not exist in the register; the place is called Furedalen, and the car park is mapped as «Furedalen alpin». The first hundred metres cross the flat by the ski area, then you are on Mødalsvegen: the groomed tracks the source mentions are cross-country trails, mapped with classic and skating grooming all the way to Mødal, and the alpine pistes lie west of the line.",
      "Mødalsvegen southward is nearly flat — the bands from 400 to 600 m measure 3.5 degrees on average — and past the innermost summer farms in Mødalen the climbing begins. The line passes Svartatjørna at 86 metres' distance and 621 m; the tarn itself reads 618 m, and the forest ends at 586 m by Kartverket's classes, with open ground from 587.",
      "Then come the steep steps the source describes, up toward the mountain it calls Såta — the local Såta at 802 m south of the county road, not the app's Såta at 1260 on the north side of Kvamskogen. The band from 800 to 900 m is the tour's steepest at 16.4 degrees on average, and the steepest sustained stretch is here: 25.0 degrees between 817 and 838 m, up what the source calls Stoveveggen — a name neither the register nor the map carries, so it stands here as the source's.",
      "Above the wall the plateau levels out — the band from 900 to 1000 m measures 4.7 degrees over 1.3 km of ground — and the line passes south of Gråskorvenuten, through the dip the source calls Middagshola (also not in the register): the line tops out at 1017 m and gives back 36 metres to 981 before the ridge begins. The tour gives back 78 metres of height in all, most of it here.",
      "The last stretch runs along the ridge — the band from 1100 to 1200 m measures 14.8 degrees — and then more gently to the cairn at 1299. The summit is gentle in every direction: none of the eight sweeps from the cairn holds more than 14.2 degrees on average over the first 800 metres.",
    ],
    descent: [
      "Return the same way. The ridge and the plateau first — and this is where the day should be planned: in fog or drifting snow it is the navigation across the wide plateau between Middagshola and the steps that is the difficulty, because the terrain forms to steer by are few and alike. The steps down from 838 to 817 are the steepest thing you ski.",
      "From the cairn the steepest sector is south-west, 37.5 degrees in the steepest 60 m window 690 to 750 metres out — off the route, but worth knowing about in poor visibility. Otherwise the fall from the summit is gentle: 5.5 degrees on average toward the south-east, 6.8 toward the south.",
      "From Mødal it is the cross-country tracks on Mødalsvegen back to Furedalen — flat enough that it is poling and skating more than skiing, and the last hundred metres cross the flat by the ski area to the car park.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "ut.no says some sections can be avalanche-exposed, and the measurements point to the steps: the band from 800 to 900 m holds 16.4 degrees on average with the steepest sustained stretch at 25.0 degrees between 817 and 838 m, and the band from 1100 to 1200 on the ridge 14.8. The rest of the line is gentler than 10 degrees on average in every band. The terrain measures gentle, and it should be said gently — but 17 km round trip is long exposure to a change in the weather, and mountain skis with steel edges are the source's own recommendation.",
      },
      {
        title: "The plateau",
        body: "From 900 m inward this is wide mountain terrain with few forms: the band from 900 to 1000 measures 4.7 degrees over 1.3 km, and the dip the source calls Middagshola is the only clear handhold before the ridge. In flat light and fog this is where the tour becomes difficult — not on the slopes. The summit itself is gentle on all eight bearings; the steepest sector, south-west at 37.5 degrees 690 to 750 metres out, lies off the route.",
      },
      {
        title: "Before you go",
        body: "Tveitakvitingen lies in the Voss forecast region, an A region with a daily avalanche bulletin through the season — check varsom.no. The season of January to April is ut.no's own. Bring a transceiver, probe and shovel, and treat the tour as a full day: 17 km round trip with 995 metres of ascent. An empty bulletin page is not the same as a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "382 m",
      endLabel: "1299 m",
      distanceLabel: "8.6 km",
      caption: "995 metres of ascent over 8.56 km one way from Furedalen, with the steepest ground — 25.0 degrees between 817 and 838 m — on the steps the source calls Stoveveggen.",
    },
  },
  grafjell: {
    intro:
      "595 metres of climbing over 8.04 km from Tempelsetra to the highest point on Norefjell. The route is gentler than its neighbours — the steepest hundred-metre band, 1300 to 1400 m, measures 10.0 degrees — and longer than all of them. The difficulty is not the gradient but that the landmarks on the first five kilometres are tarns.",
    ascent: [
      "Start behind the Tempelsetra café, 910 m, and follow the track toward Istjenn. The forest lets go already at 971 m, and at 950 m the route goes out onto Istjenn — Kartverket classes the point as lake, and it is the first of two waters the route goes out onto the ice of — Donkelitjenn is the other.",
      "On north past Vesletjenn at 1095 m. This is the flat part: the band from 900 to 1000 m measures 2.3 degrees over 2517 metres of ground, 1000 to 1100 measures 3.7 over 1441, and 1100 to 1200 only 2.7 over 2070 metres. Five kilometres go by before you stand at 1156 m, and in poor visibility this is where the tour is actually demanding.",
      "At Donkelitjenn, 1156 m, ut.no calls the tour half done and states that 313 metres of climbing remain. It is their track that is half done there; the routed line here is shorter and has the tarn at two thirds. Either way this is where it starts to rise: 6.3 degrees from 1200 to 1300 m, and somewhere between 1283 and 1302 m sits the steepest sustained section of the tour, 22.9 degrees.",
      "The track continues north until it splits at around 1282 m, and the branch turning east climbs Gråfjell. The band from 1300 to 1400 m is the steepest, 10.0 degrees over 585 metres of ground, and the last band, above 1400 m, measures 6.4 degrees. The cairn stands at 1466 m, 4.5 km north-west of Høgevarde.",
    ],
    descent: [
      "Back down the same way — but not south from the cairn. The route comes onto the summit from the north-west, so the first kilometre down retraces to where the track split at 1282 m, and only from there do you turn south toward Donkelitjenn. The summit is round and flat, and it is worth knowing how round: radial measurements from the cairn give 5.2 to 18.3 degrees on average over 500 metres in all eight directions, and the steepest 60-metre window on the whole mountain measures 30.2 degrees.",
      "That is why Gråfjell is a navigation tour and not an avalanche one. Come off a round summit plateau the wrong way in cloud and you do not end up in a slab — you end up in the wrong valley, with five kilometres of bog and tarns between you and the car. Take a bearing on top while you can still see, and hold the track back over Donkelitjenn.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Gentle high fjell the whole way. The steepest sustained section measures 22.9 degrees, between 1283 and 1302 m, and the steepest hundred-metre band, 1300 to 1400 m, holds 10.0 degrees over 585 metres of ground. Three of the points Kartverket samples along the line are lake: Istjenn at 950 m and Donkelitjenn at 1152 and 1156. In winter they are flat plains and they are part of the route — but they are ice, and ice is not the terrain model's business.",
      },
      {
        title: "The terrain around it",
        body: "There is little of it. No direction from the cairn averages more than 18.3 degrees over the first 500 metres, and the steepest 60-metre windows measure 30.2 degrees to the south-east and south. The danger on Gråfjell is weather, distance and visibility: the summit is the highest point on Norefjell and catches wind and cloud before the rest of the plateau, and ut.no gives the season as December to March.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Buskerud sør at varsom.no. Buskerud sør is a B region: it is only forecast at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "910 m",
      endLabel: "1466 m",
      distanceLabel: "8.0 km",
      caption: "581 metres of climbing and 7.84 km from Tempelsetra past Istjenn, Vesletjenn and Donkelitjenn, with the treeline at 971 m and the steepest hundred-metre band between 1300 and 1400 m.",
    },
  },
  vesoldo: {
    intro:
      "838 metres of climbing from Byrkjenes, and a tour that gets gentler the higher you go: steep forested slope at the bottom, open even ridge above. The summit dome is easy walking — but it sits a couple of hundred metres above the cliffs to the west and north-west, and half a kilometre above those to the north, and in flat light the edge is invisible.",
    ascent: [
      "From the car park at Byrkjenes, 211 m, at the far end of Tordalsvegen north of Strandebarm, climb the steep forested slope towards Fadnastølen, 498 m. This is the steepest part of the tour: the steepest hundred-metre band lies between 300 and 400 m and averages 16.5 degrees. Tordalsvegen is a private toll road, and ploughing all the way to the car park is not guaranteed — check before you drive far.",
      "Above the summer farm the ground opens up, with patches of forest to around 577 m. The route holds north-east onto the broad south-west ridge at 629 m.",
      "From there you follow the ridge continuously north — 791 m, then the shoulder at 977 m. The whole upper part runs at 10 to 13 degrees: gentler than the south face right beside it, which averages 20.8 degrees with a 33.7-degree belt 580 to 640 metres out from the summit. The south-west ridge measures 9.5 degrees on average, and that is why the line runs where it does.",
      "The last hundred metres curve north-east up the gentle summit dome to the cairn at 1046 m. The steepest sustained section on the whole line measures 28.9 degrees, and it is down in the forested slope.",
    ],
    descent: [
      "Down the same ridge: south over the shoulder at 977 m and 791 m, down to 629 and on to Fadnastølen. From the farm down it is forested slope — steep enough to be good skiing, and steep enough to release after mild weather and rain.",
      "The usual mistake: wandering too far west or north from the cairn. North, north-west and west fall 19 to 26 degrees on average, but break over at 48 to 55 degrees about half a kilometre out from the cairn, and the summit dome is so gentle that you will not feel it underfoot before the edge is there. In flat light that is the only real hazard on the tour.",
      "The second mistake is taking the south face down from the summit instead of the south-west ridge. South averages 20.8 degrees, but has a 33.7-degree belt 580 to 640 metres out — it is not the same line as the ridge, and it is not where the route goes.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The lower half is a steep forested slope, around 19 degrees on average from the car park to Fadnastølen, while the whole upper ridge runs at 10 to 13 degrees. The steepest sustained section on the line measures 28.9 degrees. The forested slope above Byrkjenes is steep enough to release after mild weather and rain — that is the part of the route that changes with the weather, not the ridge.",
      },
      {
        title: "The terrain around it",
        body: "Stay on the south-west ridge all the way up. Averaged over the first 800 metres from the cairn the north side falls 19 degrees, the north-west 25 and the west 26 — but the average hides the edge. The steepest sixty metres measure 55 degrees to the north (520 to 580 metres out), 55 to the north-west (500 to 560) and 48 to the west (620 to 680), and the edge is what counts. The south face averages 20.8 degrees, but with a 33.7-degree belt 580 to 640 metres out. The south-west ridge itself measures 9.5 degrees, and the difference between it and the neighbouring faces is the whole point of the line choice on this mountain.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Voss at varsom.no. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "211 m",
      endLabel: "1046 m",
      distanceLabel: "4.2 km",
      caption: "838 metres of climbing and 4.25 km from Byrkjenes, with the steepest ground — 16.5 degrees between 300 and 400 m — down in the forest.",
    },
  },
  ranten: {
    intro:
      "532 metres of climbing over 5.82 km from Tempelseter to the jagged ridge Th. Kittelsen painted as Soria Moria. The climb from Raudmyra is gentle — the steepest sustained section measures 19.6 degrees — and the south side looks gentle for the first hundred metres from the cairn. Then it breaks off at 47 to 60 degrees, and that is the way the marked path goes down.",
    ascent: [
      "Start at the car park by Tempelseter, 910 m, and follow the T-marked and blue-marked route past the waterfall toward Høgevarde. The forest lets go at 938 m, and the next three kilometres are almost flat: 4.0 degrees from 900 to 1000 m over 1301 metres of ground, 4.6 from 1000 to 1100 over 1304 metres, and 3.3 from 1200 to 1300 over 1666.",
      "The trail junction at Raudmyra sits at 1229 m, and the name — red bog — is not an accident: Kartverket classes both the point at 1216 and the point at 1229 m as bog. Here you turn left toward Gråfjell and leave the Høgevarde track.",
      "Now the tour starts. The band from 1300 to 1400 m measures 10.8 degrees over 566 metres of ground — half the climbing in a good half-kilometre — and between 1354 and 1370 m sits the steepest sustained section, 19.6 degrees.",
      "The last band, above 1400 m, measures 5.7 degrees over 120 metres of ground, and the cairn stands at 1416 m. The top is a narrow, jagged ridge, and the profile that makes the mountain easy to recognise from below is the same profile that means there is not much room on it.",
    ],
    descent: [
      "The gentle way down is the way you came: east toward Raudmyra, where the flank averages 13.3 degrees over 500 metres. North, west and north-west are gentle too — 10.4, 11.9 and 10.8 degrees on average, with steepest 60-metre windows of 19.6, 18.8 and 16.8 degrees — but they take you away from the car.",
      "The marked path drops steeply south to Fetjenn at 990 m, and as a ski line that is a different tour from the ascent — but it does not look like it from the top. Point measurements every thirty metres due south give a shoulder first: 1415.6, 1399.2, 1393.9 and 1395.5 m, meaning 28.6 degrees for the first step and then ground that is flat and even rises slightly. Where the shoulder ends, 120 metres out, it falls at 47.2 and 54.5 degrees. On a bearing of 195, which is the direction of Fetjenn, the shoulder is clearer still — the ground rises again at 90 metres — and the break measures 60.0 degrees. These are the gullies randofolk.no means when it calls Ranten «a more alpine top with a steeper descent» than Høgevarde. Do not read the ground above the break as a measure of what lies below it: ski them if this is terrain you ski routinely, and if the forecast and the snow say yes; otherwise go back the way you came.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The climb from Raudmyra is an even slope: 10.8 degrees on average from 1300 to 1400 m, and a steepest sustained section of 19.6 degrees between 1354 and 1370 m. The first four kilometres from Tempelseter stay below 6 degrees. The route itself is not the problem on this mountain.",
      },
      {
        title: "The terrain around it",
        body: "The south side is, and it is more dangerous than the numbers alone say. From the cairn it falls 40.2 to 54.8 degrees in the 60-metre windows 90 to 170 metres out, on every bearing from 150 to 210 degrees — the whole sector from south-east to south-west. But the first hundred metres are a shoulder at around ten degrees, which on a bearing of 195 even rises again, so the break is not visible from where you stand. The summit ridge is narrow, and cornices build out over that edge in a westerly. North and west are the opposite, 10 to 12 degrees on average.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Buskerud sør at varsom.no. Buskerud sør is a B region: it is only forecast at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "910 m",
      endLabel: "1416 m",
      distanceLabel: "5.8 km",
      caption: "532 metres of climbing and 5.82 km from Tempelseter by the trail junction at Raudmyra, 1229 m, with the treeline at 938 m and all the climbing in the last two kilometres.",
    },
  },
  hogevarde: {
    intro:
      "598 metres of climbing over 4.78 km from Tempelseter, on a staked and usually groomed track. No part of the ascent is steep: the steepest sustained section measures 19.5 degrees, between 1179 and 1195 m, and the steepest hundred-metre band, 1200 to 1300 m, averages 11.8 degrees. What you plan around here is the weather and the east side, not the gradient under your skins.",
    ascent: [
      "Start at the car park by Tempelseter, 910 m, and climb to the right of the ski slope. The track is staked and usually groomed, and the first hundred metres of climbing are the gentlest on the tour: the band from 900 to 1000 m measures 3.9 degrees over 1305 metres of ground.",
      "Above the lift it climbs evenly — 8.8 degrees from 1000 to 1100 m and 7.8 from 1100 to 1200 — and somewhere in there, between 1179 and 1195 m, sits the steepest sustained section of the whole tour: 19.5 degrees. Not one of the points Kartverket samples along this route is classed as forest. You start above the treeline and can see where you are going the whole way, which helps right up until the visibility goes. Note that it is the lower part that is groomed. The line follows the mapped network closely for the first 1.2 kilometres and the last 1.5, but between 1.5 and 3.7 km out it goes its own way over the ridge — at worst 572 metres from the nearest mapped track, at 1283 m. What is mapped there is unmarked cross-country loops rather than a marked summit route, so there is no track to follow over the ridge.",
      "From the ridge at around 1190 m the route swings north-east toward the hut. The band from 1200 to 1300 m is the steepest on the tour, 11.8 degrees over 496 metres of ground, and above it the ground flattens again: 7.7 degrees from 1300 to 1400.",
      "The DNT hut Høgevarde sits at 1397 m, and the summit 560 metres further north-east, at 1461. The last band, above 1400 m, measures 3.5 degrees over 810 metres of ground — flat, and at the same time the most weather-exposed part of the day. The old Høgevarde tourist hut serves waffles in the winter holidays and at Easter, and a sign at the bottom of the slope tells you whether it is open. Note that the line crosses Høgevardtjenn at 1378 m on the way to the top — 68 metres on the Tempelseter route, up to 60 metres from shore, and 45 metres on the Norefjellstua route, up to 20 metres out. It is a small tarn, natural and unregulated, and both lines cut a corner of it.",
    ],
    descent: [
      "Back down the same way, south-west. That is the gentle side of the mountain, and the measurements say how gentle: 7.1 degrees on average to the west and 8.6 to the south-west over 500 metres, with steepest 60-metre windows of 25.6 and 23.8 degrees. The other documented route, the high-mountain track from Norefjellstua over Norefjellsryggen, gives 826 metres of climbing over 11.67 km and is a different day.",
      "The temptation is to head east, toward the Norefjell ski centre you can see clearly from the cairn. It is not just below you: the resort is 9.85 kilometres away on a bearing of 148, which is south-east. Setting a course for it from the summit means choosing the steepest sector of the mountain — east averages 25 degrees and breaks off at 41.5 degrees 70 to 130 metres out from the cairn, north-east gives 41.3, and south-east, the direction of the resort, 51.2 degrees in the window 420 to 480 metres out. The summit ridge is often scoured bare while the snow is good 200 metres lower, and that is exactly when the line choice moves without anyone deciding it.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A staked and usually groomed track in gentle terrain the whole way. The steepest sustained section measures 19.5 degrees and sits between 1179 and 1195 m; the steepest hundred-metre band, 1200 to 1300 m, holds 11.8 degrees over 496 metres of ground. Staking is not brushing — ut.no points out that early in the season the poles are not always supplemented with markers, and above the treeline there is nothing else to navigate by.",
      },
      {
        title: "The terrain around it",
        body: "The mountain is gentle on three sides and steep on one. East and north-east below the summit average 25 degrees with 60-metre windows of 41.5 and 41.3 degrees, 70 to 160 metres out from the cairn, and south-east 51.2 degrees in the window 420 to 480 metres out. West, south-west and north-west hold 7.1 to 8.6 degrees on average. That is the whole mountain in one sentence: climb and ski the west side.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Buskerud sør at varsom.no. Buskerud sør is a B region: it is only forecast at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "910 m",
      endLabel: "1461 m",
      distanceLabel: "4.8 km",
      caption: "598 metres of climbing and 4.78 km from Tempelseter, the whole route above the treeline, with the DNT hut at 1397 m and the summit 560 metres further north-east.",
    },
  },
  gygrastolen: {
    intro:
      "1267 metres of climbing from 90 m — fjord to summit over 5.96 km, with the Folgefonna icecap straight ahead of you on the ridge. The steepest sustained section measures 25.4 degrees, so it is the length and not the angle that decides the day.",
    ascent: [
      "Start where the construction road turns uphill from Ænes, 90 m; the church the route description mentions sits at 41 m down by the fjord. The first hundred metres of climbing run at 6.3 degrees, and then the road gets to work: 11.3 degrees from 100 to 200 m and 12.9 from 200 to 300.",
      "Follow the path on toward Gygrastølvatnet at 492 m. The band from 400 to 500 m is the gentlest of the tour, 5.6 degrees over 1035 metres of ground — that is the flat around the lake.",
      "From the lake you climb onto the ridge itself and follow it. The forest holds to 590 m; above that everything is open. The climbing is even and increases gradually: 16.8 degrees from 600 to 700 m, 19.4 from 800 to 900 and 19.8 from 1000 to 1100, the steepest hundred-metre band. The steepest sustained section measures 25.4 degrees between 1042 and 1063 m.",
      "Above 1300 m the ridge lies almost flat — 4.7 degrees over 565 metres of ground — and carries you to the summit at 1347 m.",
    ],
    descent: [
      "Back down the same ridge, north toward Gygrastølvatnet and on down the construction road to Ænes. The lowest part is forest skiing, and it is hard work when the snow is wet.",
      "The usual mistake: choosing the north-west flank because it is steeper and shorter. It is a documented alternative, but it is avalanche terrain, and it is not the line this route takes. The second is assuming you can take in both summits: between them light climbing and protection are needed, and the normal route goes to the main top.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "A long ridge with even climbing: the steepest hundred-metre band, 1000 to 1100 m, measures 19.8 degrees, and the steepest sustained section 25.4 degrees between 1042 and 1063 m. The ridge is the line both up and down.",
      },
      {
        title: "The terrain around it",
        body: "The north-west flank is avalanche terrain and a steeper option for those who choose it with open eyes. Between the main summit and its neighbour light climbing and protection are required — that is not an extension of the ski tour.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hardanger at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "90 m",
      endLabel: "1347 m",
      distanceLabel: "6.0 km",
      caption: "1267 metres of climbing and 5.96 km from Ænes over Gygrastølvatnet, with the treeline at 590 m and the ridge above 1300 m at 4.7 degrees.",
    },
  },
  juklavasstinden: {
    intro:
      "1341 metres of climbing over 7.16 km from Myrdalsvatnet — and 347 of them are given back along the way. The route climbs onto the ridge above Omnetjørnene, drops east toward Møsetjørna and takes the north ridge to a summit that carries a cornice.",
    ascent: [
      "Start by the road at Myrdalsvatnet, 367 m, in Uskedalen. Follow the road back a little to a tractor road and follow that until Nipelva comes into view. The forest holds to 668 m.",
      "Follow the river up to the ridge above Omnatjørnane — that is the register's spelling, not Omnetjørnene — and «above» is only half the story: the line runs 269 metres straight across the tarns at 1066 m, up to 100 metres from shore. They sit on the ridge itself, and they are natural. This is where the climbing is: 18.4 degrees from 500 to 600 m and 20.0 from 600 to 700, with the steepest sustained section at 30.8 degrees between 995 and 1022 m. The ridge tops out at 1033 m.",
      "From there hold east toward Møsetjørnene with Juklavasstinden in front of you. The ground falls to 755 m at the tarn — Fri Flyt's 988 metres is the summit minus the start, while the routed line collects 1341 because it has to come down here first.",
      "From the basin you climb the north ridge to the top; it is the gentlest of the documented lines on this mountain — the western gully beside it holds 40 degrees. The band from 1100 to 1200 m measures 20.5 degrees, 1200 to 1300 m runs at 17.8 and 1300 to 1400 m at 21.5, with the cairn at 1361 m.",
    ],
    descent: [
      "Down the north ridge, across the basin by Møsetjørna and back over the ridge to Nipelva and Myrdalsvatnet. The descent faces north-west, and the tour has a climb left in it on the way home — the same ridge you came over.",
      "The usual mistake: taking the western gully down. It runs at 40 degrees and is a choice of its own; the north ridge is the line the route description points to. The second is the summit cornice — the tour can call for crampons and an ice axe, and the cornice is why.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Two climbs with a descent in between. The steepest sustained section measures 30.8 degrees between 995 and 1022 m, and the band from 1300 to 1400 m runs at 21.5. The north ridge is the gentlest of the documented lines — 20.5 degrees against 40 in the western gully — and it is the one the corridor follows.",
      },
      {
        title: "The terrain around it",
        body: "The summit carries a cornice. The western descent holds 40 degrees and is a decision of its own. The basin between the ridge and the north ridge is where you lose height on the way up — and where you have to take it back on the way home, with the time that costs.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Hardanger at varsom.no. Bring a transceiver, probe and shovel — an empty page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "367 m",
      endLabel: "1361 m",
      distanceLabel: "7.2 km",
      caption: "1341 metres of climbing and 7.16 km from Myrdalsvatnet over the ridge at 1033 m and Møsetjørna at 755, with the north ridge from 865 m to the cairn.",
    },
  },
  melderskin: {
    intro:
      "The classic of the Rosendal alps — 1,272 metres of climbing from the farmyard at Kletta to the cairn, without giving back a single metre on the way. A long day for anyone who wants the whole mountain from the bottom up.",
    ascent: [
      "From the car park at Kletta, 154 m, follow the road for 300 metres before the path turns up towards Skarshaug. The first stretch crosses farmland and then enters mixed forest; the track is clear, and you climb steadily through the trees to around 520 m.",
      "Above the treeline the slope stands up. Between 600 and 700 m it averages 22.6° over a hundred vertical metres, and the steepest hundred-metre band of the tour comes just above: 23.9° between 800 and 900 m, with 22.2° between 900 and 1000. Both are ground you want behind you early in the day. The top of that slope is Skarshaug, 806 m, halfway to Melderskin.",
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
        body: "The steepest hundred metres lies between 800 and 900 m and holds 23.9°; the steepest single step on the line measures 30.6°, between 720 and 744 m. The line itself never passes 30°, but it sits in the slope you have to cross either way, and the slope is steeper than the track across it. Make the call down at the forest edge, while turning round still costs you nothing.",
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
      startLabel: "154 m",
      endLabel: "1426 m",
      distanceLabel: "4.9 km",
      caption: "154 to 1426 m over 4.9 km. The steepest hundred metres lies between 900 and 1000, above Skarshaug.",
    },
  },
  englafjell: {
    intro:
      "1237 metres of ascent and 8.64 km from Musland in Uskedalen — a proper west-coast mountain where the tour is bigger than its numbers: Fri Flyt calls it difficult, lists avalanche-prone terrain, hard navigation and slip-fall danger as its hazards, and gives 35 degrees on the easiest way. The line itself measures kinder — steepest 100-metre band 21.1 degrees between 300 and 400 metres, steepest sustained stretch 30.1 — but it gives back 185 vertical metres along the way, carries skis through stretches of the forest, and the summit ridge is corniced over Limomnen. The card's grade 3 is the sum.",
    ascent: [
      "Drive to Uskedalen and turn off towards Musland; park at the first farm — the yard sits at 148 metres, and mind the tractor traffic, as the source asks. The tractor road continues north-west, and the marked path turns left into the forest — road and path network are mapped, and the first stretch is usually walked with skis on the pack along a well-trodden path.",
      "The path crosses the valley — the floor reads 140 to 183 metres — before the flank towards Såta begins. That is the valley's price: most of the 185 metres given back sit here and in the bumps on the ridge beyond. The forest ends at 526 metres by Kartverket's classes, and the flank towards Såta holds 507 and 625 on the way to the knoll at 651.",
      "From Såta you head south up the steep ridge, as the source says — and the ridge delivers: 869, 1032, 1126 and 1184 metres in steady, steep climbing, with 29.3 degrees as the steepest sustained stretch on the ridge itself, between 765 and 788 metres — the tour's steepest, 30.1 degrees, lies lower down, in the flank up from the valley crossing between 312 and 330 metres. This is the navigation stretch in fog: logical in clear weather, diffuse in flat light.",
      "The summit stands at 1200 metres. All along the summit ridge: keep your distance from the east edge — the cornices overhang Limomnen, the bowl at 889 directly below, and the north-east flank falls 55.5 degrees at its steepest only 200–260 m from the cairn.",
    ],
    descent: [
      "The normal way down is the ridge back towards Såta, where the steep sides offer the skiing — the same line discipline as on the ascent, with the cornice edge over Limomnen as the standing rule: ski west of the crest.",
      "From Hjorteklett — the source's spelling; the register carries the knoll as Hjortaklett (Ås, 59.91905/5.85858), 460 m north of Såta — skis usually go on the pack for a stretch. In good snow conditions the source mentions a fine descent along the stream east of Såta; it is a variant, not the normal route, and 'in good snow conditions' is the condition that stands.",
      "Then the valley again: the crossing costs you the final uphills home to the path and the tractor road down to Musland. The slip-fall danger the source names belongs to this stretch — steep, dense west-coast forest with hard snow is its own hazard.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Fri Flyt's hazards are 'avalanche-prone terrain, hard navigation and slip-fall danger', and all three are measurable on this line: the flank towards Såta and the south ridge hold 21 to 30 degrees with steeper sides close by, the ridge is diffuse in flat light, and the forest stretches carry hard snow over steep ground. The 35-degree ground on the easiest way sits in flank choices near the top — the track can be laid gentler, and the measurement shows it works.",
      },
      {
        title: "The cornices over Limomnen",
        body: "The summit ridge is corniced over its east side, where Limomnen lies 300 vertical metres below. The north-east flank falls 55.5 degrees at its steepest 200–260 m from the cairn and the north flank 49.7 only 100–160 m out. The edge is further out than it looks in drifting snow — stay west of the crest for the whole summit stretch.",
      },
      {
        title: "Before you go",
        body: "Englafjell is in the Hordalandskysten forecast region, a B region with no daily avalanche bulletin — the nearest A region with a daily forecast is Hardanger, east of the Folgefonna. That is a reason for more caution, not less: the assessment is yours. No source publishes season months; the card's jan–apr is borrowed from the app's other Hardanger tours, and the guide says so. Bring transceiver, probe and shovel. An empty forecast page does not mean a safe mountain.",
      },
    ],
    elevationProfile: {
      startLabel: "148 m",
      endLabel: "1200 m",
      distanceLabel: "8.6 km",
      caption: "1237 metres of ascent and 8.64 km from Musland — across the valley, up to Såta, and the steep south ridge with cornices over Limomnen.",
    },
  },
  gaustatoppen: {
    intro:
      "The most prominent peak in southern Norway, and one of the gentlest to climb on skis: 973 metres of ascent from Langefonn, and not a single step over 25° on the way up.",
    ascent: [
      "From the car park at Langefonn turisthytte, 922 m, follow the winter-closed road towards Stavsro. After 850 metres you are at Svineroisetra, 1,021 m — that is the kilometre the descriptions mean. The birch belt lets go at around 970 m, and from there it is open mountain. The east ridge can also be reached from Stavsro with 706 metres of climbing, but that road is closed in winter.",
      "At the seter you leave the road slightly right, south-west, and head for the lowest point on Himmelranden — the top of Langefonn, 1,455 m. Do not go straight up at the cairn from here. The fall line from Svineroisetra direct to the summit holds 35–37° in its top third; the traverse towards Langefonn climbs steadily at 12–16° and never passes 25°, and that is the line this route follows.",
      "From the low point you turn west-north-west and follow the ridge. The climb is steady: the steepest hundred metres of the whole tour lies between 1,700 and 1,800 m and measures 17.5°, and the steepest single step is 24.0°. Partway along you join the summer path from Stavsro.",
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
        body: "The line from Langefonn stays under 25° all the way to the cairn: the steepest single step measures 24.0°, and the steepest hundred metres, between 1,700 and 1,800 m, holds 17.5°. The ascent itself is barely avalanche terrain. What changes the sum is wind — it scours the ridge bare and loads the snow into the gullies on the east side.",
      },
      {
        title: "The terrain off it",
        body: "Three places lie off the route and should stay that way. The east side of the summit tower with its seven gullies, where avalanches have killed. The north-east flank directly below the cairn, 35° on average over four hundred metres and 46° at its steepest — that is the fall line towards Svineroisetra, and it is what you land in if you drop straight off the plateau. And the north-west side towards Rjukan: gentle at the top, 14° for the first four hundred metres, but it runs close to 1,600 vertical metres down into the valley — 1,878 to 284 m over 3.6 km — and steepens past 50° on the way. The gentleness up top is the trap.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Vest-Telemark on varsom.no. Carry a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "922 m",
      endLabel: "1883 m",
      distanceLabel: "4.4 km",
      caption: "922 to 1,882 m over 4.42 km. The steepest hundred metres measures 15.8°, and nothing on the line passes 25°.",
    },
  },
  "store-ble": {
    intro:
      "672 metres of climbing over 6.69 km from Nordstulvatnet: almost two kilometres of flat forest, a pitch through Langedalen where the band from 800 to 900 m measures 11.2 degrees, and a high plateau above. The steepest sustained section, 35.2 degrees between 1228 and 1251 m, is in the summit slope — and that is the side the descriptions say you may have to scramble in thin snow.",
    ascent: [
      "Start at the large car park by Nordstulvatnet, 714 m. The route climbs gently through open forest and crosses the river running out of Sønstevatn, 746 m; randofolk.no describes a bridge there. The band from 700 to 800 m measures 2.9 degrees over 1785 metres of ground — that is the flat approach, and it is longer than it looks on the map.",
      "Then the climbing starts. 11.2 degrees from 800 to 900 m over 512 metres of ground, which is the steepest hundred-metre band on the tour, and 7.0 degrees from 900 to 1000. The forest lets go at 945 m, and only at 952 m are you in open terrain for good. This is where the T-marked route splits: up Langedalen, or the viewpoint loop past Sigridsbu.",
      "Sigridsbu sits at 1175 m, and from the hut the ground flattens. The band from 1100 to 1200 m measures 3.1 degrees over 1890 metres of ground — almost two kilometres of plateau with the view wide open, and the line crosses a tarn at 1162 m on the way. A little before that the line also runs 45 metres across a tarn at 1177 m, but only 10 metres from shore — there it cuts a corner. Both tarns are natural.",
      "The summit slope is the steep part. Between 1290 and 1314 m the steepest sustained section measures 35.2 degrees, and that is the south side randofolk.no describes as scrambling when the snow is thin. The alternative in the description is to go along the mountain and up from the north side, which averages 5.8 degrees. The cairn stands at 1343 m.",
    ],
    descent: [
      "Two descents are described, and they are not alike. The same way back goes down Langedalen and on through the forest toward Nordstulvatnet — randofolk.no writes «watch out for runout zones!» about that valley specifically, both on the way up and on the way down. The other drops the north side and heads east toward Kongtjønn at 1225 m, with a short section on foot before it opens up.",
      "The south-east flank directly below the summit breaks off at 41.5 degrees in the 60-metre window 60 to 120 metres out, and west gives 45.0 degrees lower down. North and north-west are the gentle ones, 16.0 and 19.6 degrees in the steepest window. Blefjell is broken ground, and here that means the line choice matters more than the slope you are standing on: it is the runout below you that decides.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The steepest sustained section measures 35.2 degrees and sits in the summit slope, between 1228 and 1251 m. The steepest hundred-metre band is 800 to 900 m at 11.2 degrees over 512 metres of ground — the pitch up to the treeline. The rest of the route is gentle: 2.9 degrees on the approach and 3.1 degrees across the plateau from 1100 to 1200 m.",
      },
      {
        title: "The terrain around it",
        body: "Langedalen is where avalanches actually count on this mountain, and the source says so itself twice: runout zones, on the way up and on the way down. The route's own steepest step, 35.2 degrees, is on the south side just under 500 metres from the cairn; the south-east radial beside it measures 41.5 degrees in its steepest 60-metre window, 60 to 120 metres out, and the west flank 45.0 degrees 430 to 490 metres out. The north side is the gentle way up and down. Above the treeline the rock is hard and the soil thin, and the wind packs the snow to match.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Telemark sør at varsom.no. Telemark sør is a B region: it is only forecast at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "714 m",
      endLabel: "1343 m",
      distanceLabel: "6.7 km",
      caption: "672 metres of climbing and 6.69 km from Nordstul, with the treeline at 945 m, Sigridsbu at 1175 and the steepest hundred-metre band between 800 and 900 m.",
    },
  },
  surloytenuten: {
    intro:
      "456 metres of climbing over 6.10 km from Nordstul, and the gentlest tour in this part of Blefjell: the steepest hundred-metre band measures 5.3 degrees. The route runs north past the summit to Vassholet at 993 m and comes back south along Surløyterinden — which is why the last kilometres feel like a ridge rather than a slope.",
    ascent: [
      "From the north end of the car park at Nordstul, 714 m, the path drops right and crosses Esperåa on a bridge, 730 m. Keep right and follow the boardwalked path to the summer farm at Sudstul, 727 m, where the DNT route between Selsli and Sigridsbu crosses.",
      "Just before the last hut on the meadow you turn right onto an unmarked but clear path. Now it goes north and up through forest and bog: the band from 700 to 800 m measures 2.7 degrees over 1841 metres of ground and 800 to 900 m 4.2 degrees over 1346. The forest lets go at 951 m.",
      "At Vassholet, 993 m, the route turns. From here you follow the outer ridge south along Surløyterinden, 1085 m, and the steepest sustained section of the whole tour is in the pitch up to it: 24.9 degrees between 994 and 1014 m. In the dip itself the line runs 45 metres across a tarn at 1068 m, 10 metres from shore — a corner cut, and the tarn is natural and unnamed in the register.",
      "The ridge south is almost flat — the band from 1000 to 1100 m measures 2.8 degrees over 1697 metres of ground — and ends at the cairn at 1097 m. To the north-west you see Tverrgrønuten, Blerinden and Bletoppen.",
    ],
    descent: [
      "The same way back means north along the ridge first, and it is as gentle as a ridge gets: 2.2 degrees on average over 500 metres, with a steepest 60-metre window of 5.7 degrees. That is not a descent, it is a walk with skis on.",
      "The other return in the description is the steep drop south to the DNT path, and that one is the descent: the south flank measures 13.5 degrees on average over 500 metres with a steepest 60-metre window of 29.5 degrees, 400 to 460 metres out. The east side gives 25.1 degrees nearer the top. Blefjell has a vulnerable wild reindeer population and ut.no asks explicitly that it be respected — which is a good reason to hold to the two described lines rather than laying your own track across the plateau.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Gentle terrain almost the whole way. The steepest hundred-metre band, 900 to 1000 m, measures 5.3 degrees over 1216 metres of ground, and the steepest sustained section 24.9 degrees between 994 and 1014 m — the pitch up to Vassholet. The route gives back 73 metres of height on the way, and they are in the dip at Vassholet the description goes through.",
      },
      {
        title: "The terrain around it",
        body: "The steep descent south is the one place the gradient counts: 29.5 degrees in its steepest 60-metre window, 400 to 460 metres out from the cairn, and it is at the same time the recommended way back. Choose it on the conditions, not on the map. The ridge along Surløyterinden is scoured by wind and can be hard and icy while the south side is soft.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Telemark sør at varsom.no. Telemark sør is a B region: it is only forecast at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "714 m",
      endLabel: "1097 m",
      distanceLabel: "6.1 km",
      caption: "456 metres of climbing and 6.10 km from Nordstul by Sudstul and Vassholet, with the treeline at 951 m and the cairn at 1097.",
    },
  },
  styggemann: {
    intro:
      "549 metres of climbing over 9.61 km from Ravalsjø to the highest top in Skrim, and most of them come at the end: the first six kilometres stay below 2 degrees on average per hundred metres. The summit is the steep part — 15.1 degrees from 800 to 900 m, and the east side directly below the cairn falls 48.5 degrees.",
    ascent: [
      "Start at the car park by Ravalsjø, 483 m, and follow the signs and markers past Ormetangen, 476 m, and up the hillside east of the lake. This is forest terrain with groomed tracks, and they are what make the tour a day trip: the band from 400 to 500 m measures 0.6 degrees over 1848 metres of ground.",
      "On past Skrimsetra, 591 m, and over Fugleleikskarva, 635 m. The band from 500 to 600 m measures 1.8 degrees over 3285 metres of ground and 600 to 700 m 1.4 degrees over 3826 — that is over seven kilometres of forest and bog between 483 and 700 m. Kartverket classes the point at 611 m as cultivated land — that is the summer-farm meadow at Sørmyrseter, just before the hut.",
      "In five places the line runs on ice, 1541 of the 9608 metres. The longest comes immediately: 630 metres straight across Ravalsjø at 475 m, past the islet Kjelen, before the route climbs the slope east of the lake. Then Skrimsvannet at 575 m twice, 191 and 270 metres, Urdstjerna at 594 m for 225 and Stulstjernet at 602 m for 225. All five are natural waters, none of them regulated, and no crossing goes more than 99 metres from shore — these are narrow forest lakes the track runs straight over, and DNT's own winter chain from Ravalsjø runs through the same ground. But ice is ice: they are the only places on an otherwise quiet trail day where the surface underneath is not ground, and early and late in the season they are worth a look before you step out on them.",
      "Sørmyrseter sits at 620 m, and from there DNT gives around 240 metres of climbing up to Styggemann. Now the tour starts to rise in earnest: 14.6 degrees from 700 to 800 m over 404 metres of ground, with a steepest sustained section of 23.2 degrees between 700 and 719 m. The forest lets go at 700 m, and by 820 m you are in open terrain.",
      "The last band, 800 to 900 m, is the steepest: 15.1 degrees over only 244 metres of ground. Ut.no calls the climb «rather steep». Its advice to leave your pack at the trail junction belongs to the other approach, from Ivarsbu in the east, where the junction sits west on Jotefjell — 1.26 km south-east of the cairn. The cairn stands at 871 m, with Styggemannshytta right beside it.",
    ],
    descent: [
      "Back down the same way, south and then west along the track. The bearing from the cairn to Sørmyrseter is 172 degrees, and that radial measures 29.1 degrees in its steepest 60-metre window, 70 to 130 metres out, with a 35.1-degree step between 120 and 150 metres. A few degrees either side changes the figure a lot: 165 degrees gives 36.8 and 180 gives 25.1. The fall line to the hut is not the mildest option, and drifting west of it makes the ground steeper, not gentler.",
      "The other sides of the summit are not. East measures 48.5 degrees in the 60-metre window 30 to 90 metres below the cairn, south-east 45.3 degrees 20 to 80 metres out, and north-east 43.9 degrees. That is within a hundred metres of where you are standing with your coffee. South-west looks gentle at 9.0 degrees on average, but has a 38.6-degree window 160 to 220 metres out — the trap on this mountain that does not look like one.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Seven kilometres of forest terrain below 2 degrees, and then a kilometre that climbs: 14.6 degrees from 700 to 800 m and 15.1 from 800 to 900, with a steepest sustained section of 23.2 degrees between 700 and 719 m. The route gives back 161 metres of height over the rolling forest ridges between Ravalsjø and Sørmyrseter. The route also crosses 1541 metres of ice spread over five waters between 475 and 602 m — not avalanche terrain, but not ground either.",
      },
      {
        title: "The terrain around it",
        body: "The summit is steepest where nobody is heading: east 48.5 degrees, south-east 45.3 and north-east 43.9 in the steepest 60-metre windows, all in windows starting 20 to 40 metres out from the cairn. The route comes from the south-south-east: bearing 172 toward Sørmyrseter measures 29.1 degrees in its steepest 60-metre window, and due south, 180 degrees, 25.1 degrees in the window 130 to 190 metres out. Skrim sits low enough that the snow comes and goes — ut.no gives the ski season as January to March — and the groomed tracks between Ravalsjø and Sørmyrseter are what make the tour possible in a day.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Buskerud sør at varsom.no. Buskerud sør is a B region: it is only forecast at danger levels 4 and 5, so on most winter days there is no assessment to read, and an empty page does not mean a safe mountain. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "483 m",
      endLabel: "871 m",
      distanceLabel: "9.6 km",
      caption: "549 metres of climbing and 9.61 km from Ravalsjø by Skrimsetra, Fugleleikskarva and Sørmyrseter, with the treeline at 700 m and all the climbing above 700 m.",
    },
  },
  saebyggjenuten: {
    intro:
      "Agder's highest — barely: the county line crosses the summit itself, and the registered high point at 1506 m lies in Tokke in Telemark, ten metres east of the Agder side, which reaches 1504. A tour where the number that matters is 11.31 km rather than 851 metres of climbing. No path, no marking, three passes and a lake along the way, and terrain so gentle that the steepest 400-metre window measures 13.7 degrees. The only steep ground on the mountain faces north, and you are not going there.",
    ascent: [
      "From the car park at the barrier at the far end of Berdalen hyttegrend, 810 m, the route runs east. The bearing from the car park to the summit is 82 degrees — Berdalen lies west of the mountain, and you head toward it all day. Riksveg 9 between Bykle and Hovden is ploughed all winter, and ut.no is explicit that you do not drive the last kilometre past the barrier: «Veien er privat.» The first kilometre shares ground with the groomed tracks in Berdalen; the line here is the terrain line, not the track.",
      "Past Langemyr at 891 m it climbs steadily to Tverrheiskaret at 1028 m. This is the only rise on the tour that feels like one: the steepest 30 metres measures 26.2 degrees between 1000 and 1022 m, 2350 metres in, and the steepest 400 metres 13.7 degrees from 963 to 1062 m. The forest stands high here: DTM1 gives terrain class Skog in Tverrheiskaret itself, at 1028 m. How much higher it goes on this line has not been measured point by point — Kartverket's point API was down when this was checked — so the guide states what is measured and no more.",
      "Across Tverrheii and the Tverrheitjønnane you hold east to Tverrheiskardet at 1156 m. There is a trap here worth knowing: the place-name register has three passes on this stretch, and two of them are called Tverrheiskaret — the one you crossed at 1028 m, and another at 1091 m that lies only 305 metres from Tverrheiskardet at 1156. It is the second pair that is easy to confuse, not the first. The 1100 to 1200 m band averages 1.3 degrees over 4455 metres of ground — that is over four kilometres of nearly flat high country, and it is where a tour without marking becomes a navigation job.",
      "From Tverrheiskardet the line drops 47 metres over 535 metres of ground into the Gjuvvatn basin, then 32 metres more, down onto Midtre Gjuvvatn. There it runs 720 metres across the lake at 1124 m, at most 55 metres from shore — the only ice crossing of the tour. The lake is natural: DTM1 gives terrain class Innsjø, and the OSM relation (name=Midtre Gjuvvatn, ele=1124, ref:nve:vann=13750) carries no reservoir tags. The route descriptions go the same way.",
      "From the east end of the lake at 1137 m the route climbs steadily east past the waypoint at 1225 m — which sits on firm ground just west of the lower of the two small tarns, not on the tarn itself — and the last kilometre goes up the west flank. The 1400 to 1500 m band averages 11.9 degrees over 499 metres of ground, the steepest on the tour. The final 500 metres run on a bearing of 78 degrees and rise 115 metres to the summit at 1506 m. ut.no publishes 1507; DTM1 gives 1506.49 at the registered point, and half a metre is not a disagreement worth the name.",
    ],
    descent: [
      "Back the same way, and down the west side. The drop-weighted mean bearing is 258 degrees, west-south-west, which is the flank you came up. The sweep from the summit gives 9.8 degrees average to the west and 9.2 to the south-west out to 1000 metres — gentle enough that the descent is mostly transport, but also gentle enough that you do not need to look for anything better.",
      "And that is the point. The only steep side of Sæbyggjenuten is the north side, and it is corniced: 15.0 degrees average northward against 9.8 westward, with a steepest 60-metre window of 41.9 degrees 460 to 520 metres out, 42.3 degrees to the north-east and 46.1 degrees on a bearing of 10 degrees. The cornice sits on the last metres of height, and in flat light the edge is there with nothing in the ground to announce it. Come up the west side and go down the west side.",
      "The other mistake is the distance. Eleven kilometres in — the line measures 11.31 km — with over four kilometres of flat high country between 1100 and 1200 m, means the weather window rather than the angle governs the day. There is no marking; there is barely a path. ut.no says «Gå stien inn til Langemyr», and OSM has one unnamed track on that first stretch — after that it is terrain. Turn around at Gjuvvatn and you have seven kilometres left to the car.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "The line holds little avalanche terrain. The steepest 30-metre step is 26.2 degrees on the climb into Tverrheiskaret, the steepest 60 metres 19.6 degrees, the steepest 200 metres 16.1 and the steepest 400 metres 13.7. The steepest full elevation band, 1400 to 1500 m, averages 11.9 degrees over 499 metres of ground. What can go wrong on the line itself is the ice on Midtre Gjuvvatn late in the season, and that 720 metres is a long way to be out on it.",
      },
      {
        title: "The terrain around it",
        body: "West, south-west, south and south-east all average between 6.5 and 9.2 degrees out to 1000 metres from the summit. North and north-east do not: 15.0 and 14.3 degrees average, with steepest 60-metre windows of 41.9 and 42.3 degrees, and 46.1 degrees on a bearing of 10 degrees 430 to 490 metres out. The cornice on the north edge is documented on the last metres of height. The summit is a simple gentle dome from three sides and something else entirely from the fourth.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Vest-Telemark at varsom.no. The card says Setesdal, which is the valley you start in — the Berdalen car park is in Bykle in Agder — but the high point is in Tokke in Telemark, so the Varsom region matches the coordinate exactly. Search for Setesdal and you will find nothing. Bring a transceiver, probe and shovel.",
      },
    ],
    elevationProfile: {
      startLabel: "810 m",
      endLabel: "1506 m",
      distanceLabel: "11.3 km",
      caption: "851 metres of climbing and 11.31 km from Berdalen over the Tverrheiskar passes and Midtre Gjuvvatn, where everything steep faces north and the route stays west.",
    },
  },
  kjerag: {
    intro:
      "A summit that is not a summit. Kjerag is a plateau and the high point is a spot on it: 200 metres to the south the ground stands 1.5 metres higher, and the line itself crosses 1129 m before giving back 66 metres and climbing again to 1124. 620 metres of ascent over 7.36 km, and the one serious thing on the tour lies two kilometres away and has nothing to do with the angle.",
    ascent: [
      "From the car park at Øygardstøl, 641 m, you follow Lysevegen south. The road is closed in winter — OSM carries motor_vehicle:conditional=no @ Nov-May and snowplowing=no on county road 4224, and Sirdal kommune confirms it — so this is a spring tour and not a winter one. The line here never runs more than 100 metres from mapped road, but it cuts the hairpins: the steepest 30-metre step on the whole route, 24.4 degrees between 673 and 687 m, sits 86 metres off the roadway and is a corner rather than a gradient.",
      "At Stølsdalen bridge, 850 m, the construction road toward Langavatn branches off and you follow Langvassvegen south-west. At 925 m the line runs 225 metres across an unnamed lake beside the road, at most 24 metres from shore. The DTM1 terrain class is Innsjø and not InnsjøRegulert, and the OSM polygon (way 1312542069, ref:nve:vann 195944) carries no reservoir tags — a natural lake, not a drawn-down one. The road is the real travel line here; the water is where the line cuts the corner.",
      "At 944 m you leave the road and hold west onto the Kjerag plateau. The bearing from the road point to the high point is 265 degrees — due west. (The corridor research gave 271; it measured to a summit point 338 metres from the registered one.) The route descriptions say «toward the north-west», and north-west from there leads to Kjeragbolten, which sits 1921 metres from the high point on a bearing of 10 degrees. That is a different objective on a different line — and the cairn the walking descriptions mean stands up by the bolt, not where this line ends; ut.no puts Kjeragbolten «ca. 300 meter sør for varden».",
      "Across the plateau it is gentle throughout: the 900 to 1000 m band averages 4.2 degrees over 1441 metres of ground, the 1000 to 1100 m band 2.3 degrees over 2746 metres. The line crosses four more lakes: 45 metres at 975 m, 45 metres at 1064 m, 686 metres at 1075 m with at most 32 metres to shore, and 90 metres at 1080 m. All are natural. In total the route runs 1091 of its 7362 metres on water. What makes the plateau demanding is not the angle but that it is bare slab without marking, with short abrupt edges between the gentle parts — the steepest 60-metre window due west of the high point measures 38.1 degrees and lies only 90 metres out.",
      "The last stretch comes in from the east over slightly higher ground. The line tops out at 1129 m 6640 metres in, drops 66 metres to 1063, then climbs at 21.2 degrees over 60 metres from 1077 to 1112 m — the steepest sustained section of the tour — before the final 500 metres run on a bearing of 294 degrees and rise 59 metres to the high point at 1124 m. The highest ground on the plateau is 1163.7 m and lies 1347 metres east-north-east; the point here is the registered Kjerag point, not the highest one.",
    ],
    descent: [
      "Back the same way. The drop-weighted mean bearing for the descent is 49 degrees, north-east, and with only 620 metres of vertical spread over 7.4 kilometres this is transport rather than skiing. The good part is the two kilometres down Langvassvegen and Lysevegen, wide and even for as long as there is snow on it.",
      "The usual mistake on the plateau: walking north to look down into Lysefjorden. Due north of the high point the plateau holds 1008 to 1016 m all the way out to 1850 metres — it is flat, it looks like more plateau, and nothing tells you otherwise. Then the ground falls 71.4 degrees over the next fifty metres and 77.4 degrees over the fifty after that, and 2000 metres out it is below 800 m. The sea is 2.6 kilometres north. The line as drawn never comes within 1675 metres of ground below 800 m, and its closest point is the high point itself. In fog and flat light the edge arrives without warning, and it is the one mistake here that cannot be undone.",
    ],
    avalanche: [
      {
        title: "The route",
        body: "Avalanche terrain in the ordinary sense barely exists on this line. The steepest 30-metre step is 24.4 degrees and sits on a road bend at 673 m; the steepest 60 metres is 21.2 degrees between 1077 and 1112 m; the steepest 100 metres is 19.5 degrees and the steepest 400 metres 11.3 degrees. None of the seven elevation bands above 700 m averages more than 5.8 degrees. What can actually go wrong here is putting a ski through the ice on one of the five lakes late in the season, and missing the northern edge.",
      },
      {
        title: "The terrain around it",
        body: "From the high point seven of the eight directions average under 13 degrees within 200 metres, and south reads minus 0.4 degrees. Further out two stand apart: west falls 38.1 degrees in its steepest 60-metre window only 90 metres from the high point, and south-west 54.8 degrees 800 metres out. Both are short steps in the slab rather than collecting terrain — but in flat light they look like the rest of the plateau until you are standing on them. The north side is another matter: a wall of over a thousand metres into Lysefjorden, beginning 1850 metres north of the high point with nothing in the ground to announce it.",
      },
      {
        title: "Before you go",
        body: "Check today's avalanche forecast for Heiane at varsom.no. Bring a transceiver, probe and shovel. Check as well whether Lysevegen is open. ut.no puts it plainly: «Rv500 mellom Sirdal og Lysebotn stenges når første snøfall kommer i okt/nov og åpner ikke før mai/juni.» Without an open road there is no tour.",
      },
    ],
    elevationProfile: {
      startLabel: "641 m",
      endLabel: "1124 m",
      distanceLabel: "7.4 km",
      caption: "620 metres of ascent and 7.4 km across the Kjerag plateau, where the steepest 30 metres is 24.4 degrees on a road bend and the danger lies 1850 metres north of the high point.",
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
