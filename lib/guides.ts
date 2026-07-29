/** Redaksjonelt guideinnhold — den delen av en tur som ligger bak abonnement.
 *
 *  ⚠️  NB: Teksten under er **eksempelinnhold**, transkribert ordrett fra
 *  prototypen (`design-reference/Turguide Kirketaket.dc.html`). Handoffen er
 *  eksplisitt på dette: «turteksten er eksempelinnhold — reelle beskrivelser
 *  må skrives/kvalitetssikres redaksjonelt» før lansering. Ingen av
 *  beskrivelsene her er kvalitetssikret som turinformasjon, og de må ikke
 *  brukes som beslutningsgrunnlag i felt.
 *
 *  I produksjon ligger disse feltene i `tours`-tabellen i Supabase
 *  (description_up, description_down, avalanche_notes, gpx_path) med RLS som
 *  bare slipper gjennom brukere med status trialing/active. Denne modulen er
 *  seeden og den lokale fallbacken, på linje med `lib/tours.ts`.
 */

import type { Grade, TourGuide } from "./types";

/** Gradskalaen slik den vises i kartet og på guidesiden (grad 1–4). */
export const GRADE_LABELS: Record<Grade, string> = {
  1: "Enkel",
  2: "Middels",
  3: "Krevende",
  4: "Ekspert",
};

export const GUIDES: Record<string, TourGuide> = {
  kirketaket: {
    slug: "kirketaket",
    intro:
      "Norges kanskje mest populære topptur — bred rygg, trygge linjevalg og lang sesong. En tur som gir mye fjell for pengene, både for førstegangsturen og for hundredegangen.",
    ascent: [
      "Fra vinterparkeringen i Skarbakkane følger du den brede ryggen mot sørvest. Sporet er som regel godt tråkket; hold høyre der skogen tynnes ut, så unngår du de bratteste kulene i skoggrensa.",
      "Over skoggrensa åpner terrenget seg. Ryggen er slak og trygg i normale forhold — det bratteste partiet kommer mellom 900 og 1200 moh, der mange legger slakere sikksakk. Toppflata er stor og godslig; varden står lengst sørøst.",
      "Ved dårlig sikt: hold ryggen. Terrenget på begge sider faller brattere enn det ser ut til fra sporet.",
    ],
    descent: [
      "Normalvegen ned følger oppstigningen — bred, jevn og med god flyt hele veien til skoggrensa. Ved gode forhold er den sørvestvendte flanken et naturlig linjevalg, men den samler fokksnø etter vind fra nordvest.",
      "Vanligste feil: å dra for langt mot sør på vei ned. Da havner du over de bratte partiene mot dalen — hold sporet til du ser parkeringen.",
    ],
    avalanche: [
      {
        title: "Normalruta",
        body: "Holder seg under 30° hele veien i normale forhold. Ingen kjente utløpssoner krysser ruta.",
      },
      {
        title: "Utenfor ruta",
        body: "Flankene mot sør og sørvest passerer 30–40° og samler fokksnø. Vurder kun ved stabile forhold.",
      },
      {
        // «varsom.no» lenkes opp i visningen (Turguide → AvalancheBody).
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Romsdal på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      // Linja i høydeprofilen, tegnet over viewBox «0 0 600 220». Arealet
      // under kurven lukkes i visningen ved å føye til nedre kant.
      path: "M0,200 L70,184 L130,158 L200,138 L260,104 L330,86 L400,62 L470,44 L545,26 L600,18",
      startLabel: "60 moh",
      endLabel: "1439 moh",
      distanceLabel: "5,5 km",
      caption: "Jevn stigning hele veien; brattest mellom 900 og 1200 moh.",
    },
  },
};

export function getGuide(slug: string): TourGuide | undefined {
  return GUIDES[slug];
}

/** Slugs som faktisk har en skrevet guide — brukes av `generateStaticParams`. */
export function guideSlugs(): string[] {
  return Object.keys(GUIDES);
}
