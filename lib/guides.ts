/** Redaksjonelt guideinnhold — den delen av en tur som ligger bak abonnement.
 *
 *  Teksten er skrevet mot rutedataene i `lib/routes.ts`: hver høydeprofil er den
 *  faktiske linja kartet tegner, og tallene i prosaen — starthøyde, topp,
 *  distanse, bratteste parti, skoggrense — er hentet fra Kartverkets 1 m
 *  terrengmodell langs den ruta. Terrengbeskrivelsene bygger på ruteresearchen og
 *  revisjonen som ligger i `scripts/build-routes/corridors.json`, som navngir de
 *  skavlene, hammerne og bratthengene som faktisk finnes.
 *
 *  ⚠️  Dette er likevel ikke et kvalitetssikret turkart. Geometrien er beregnet,
 *  ikke gått med GPS, og skredvurderingen for dagen står i skredvarselet — ikke
 *  her. Sjekk varsom.no, og bruk eget hode i felt.
 *
 *  I produksjon ligger disse feltene i `tours`-tabellen i Supabase
 *  (description_up, description_down, avalanche_notes, gpx_path) med RLS som
 *  bare slipper gjennom brukere med status trialing/active. Denne modulen er
 *  seeden og den lokale fallbacken, på linje med `lib/tours.ts`.
 *
 *  Generert — se scripts/build-routes/ for pipelinen.
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
  storgalten: {
    slug: "storgalten",
    intro:
      "Fjord til topp i ytre Lyngen: 1215 høydemeter fra veikanten der Galtelva renner ut i Nord-Lenangen, til varden på 1219. Kort linje, åpent fjell fra 189 moh og opp, og fjorden i ryggen fra første stigning.",
    ascent: [
      "Start ved Sandneset, der Galtelva renner ut i fjorden på 14 moh, rett ved Fv7922 Lenangsveien. Parkeringa er uskiltet: det som finnes er plassen på nordsida av elveosen og veikanten langs fylkesveien. Sett bilen godt utenfor kjørebanen — dette er brøytet vinterveg. Herfra går du rett inn i Galtdalen nord for Lassofjellet og holder sørsiden av elva, det vil si høyre side på vei opp. Bjørkeskogen slipper taket allerede rundt 180 moh; resten av turen er åpent terreng.",
      "Rund nordsiden av Lassofjellet og ta sikte på skaret mellom Litle-Galten og Storgalten. Du skal ikke helt opp i skaret. Det bunner på 626 moh, og går du dit, gir du fra deg høyde du nettopp har tatt. Legg deg inn på ribben et par hundre meter sør for skaret i stedet — det er der oppstigninga begynner.",
      "Mellom 800 og 860 moh reiser flanken seg til 30–35 grader, og bratteste steg på hele linja ligger her: 34,6 grader mellom 802 og 823 moh. Er snøen avblåst og hard, er stegjern verdt vekta. Over 880 moh brer ryggen seg ut, men den slutter ikke å stige — de siste drøyt 300 høydemeterne holder rundt 20 grader i snitt, med ett steg på 26 rundt 1000 moh. Hold deg på vestsida av ryggkanten hele veien: øst- og nordøstsiden faller 36–43 grader i snitt ned i Kalddalen mot Kalddalsvatnet på 477 moh, med enkeltpartier på 53–58.",
    ],
    descent: [
      "Ned samme vei. Fra toppflata følger du den brede ryggen nordover tilbake til ribben sør for skaret og videre ut i vestflanken; derfra og ned til dalbunnen er det sammenhengende åpent terreng uten skog å bremse i. Vil du ha mer plass, traverserer du sørvestover like før den siste nedkjøringa mot skaret — der ligger en stor, slak flate som tåler store svinger.",
      "Vanligste feil: å slippe seg rett vestover fra toppflata i stedet for å følge ryggen nordover ned til ribben. Langs hele vestsiden av Storgalten går det rennesystemer, og de bratteste partiene måler 40–50 grader. Fra ryggen ser du ikke hvor de begynner, og inngangen er vanskelig å lese ovenfra — skal du kjøre dem, går du dem opp først. Skaret er ikke faren her; vestflanken sør for ribben er det.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalruta går i vestflanken, i løsne- og utløpsterreng. Det bratteste på linja er partiet mellom 800 og 860 moh på 30–35 grader, med bratteste steg målt til 34,6 mellom 802 og 823. Hundremeteren fra 800 til 900 moh er den bratteste på hele ruta, 22,3 grader i snitt. Under den er flanken åpen fra 70 moh og ned til fjorden, uten skog som bremser.",
      },
      {
        title: "Terrenget rundt",
        body: "Langs hele vestsiden av Storgalten går det rennesystemer med partier på 40–50 grader; guideboka advarer om at flere av dem er bratte nok til at det kan gå skred, og at inngangen er vanskelig å treffe ovenfra. På toppen bygger det skavler. Kanten som betyr noe er den østlige: øst og nordøst for ryggen faller terrenget 36–43 grader i snitt ned mot Kalddalsvatnet, med steg på 53–58.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade. Stegjern er verdt plassen i sekken til det bratte partiet ved 800–860 moh.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,194 L49,190 L64,186 L90,182 L103,181 L129,175 L148,171 L175,164 L199,159 L224,154 L256,144 L285,134 L301,128 L321,121 L346,114 L373,103 L397,94 L414,89 L430,84 L447,78 L466,69 L487,62 L500,57 L517,51 L544,40 L565,30 L589,21 L600,18",
      startLabel: "14 moh",
      endLabel: "1219 moh",
      distanceLabel: "4,2 km",
      caption: "Fra 14 moh ved Galtelvas utløp til 1219 på toppen — 1215 høydemeter på 4,2 kilometer, med det bratteste mellom 800 og 860.",
    },
  },
  "store-skalltinden": {
    slug: "store-skalltinden",
    intro:
      "981 høydemeter og 6,04 km fra havet i Glimbukta til Store Skalltinden på 901 — hele fjellet fra fjæra, på østsida av Ringvassøya. Fri Flyt gir KAST 2 – Utfordrende med parti på 30–40 grader i de siste 800 metrene mot toppen; linja måler 21,6 grader i bratteste hundremetersbelte og 27,0 i bratteste sammenhengende parti, og den kuperte ryggen gir tilbake 91 høydemeter på veien — det er derfor kortet bærer 980 der kilden regner 900.",
    ascent: [
      "Fra det gamle grustaket i Glimbukta ved fv. 863 — 11,0 moh, vinteråpen fylkesveg. Du går opp lia mot vatnet på 100: skogen slutter allerede på 185 moh etter 1,39 km, med åpent område fra 199. Videre mot Skallvatnet på 320 er det småbratte parti mellom 230 og 300 moh som kilden ber deg navigere med omhu — beltet fra 300 til 400 måler 11,0 grader.",
      "Linja holder land ved sørenden av Skallvatnet, slik kilden legger den, og går opp ryggen vestover. Ryggen er kupert — 91 høydemeter gis tilbake underveis — og fra flata sørvest for punkt 695 sikter du nord-nordvest. Vatnet på 543 moh der er en del av linja: den krysser 103 meter av det, aldri mer enn 18 meter fra land — et naturlig vatn, ikke regulert, og på vinterisen er det ordinær vinterferdsel.",
      "De siste 800 metrene mot toppen er turens alvor: beltet fra 700 til 800 moh måler 21,6 grader over 225 meter grunn med det bratteste sammenhengende partiet på 27,0 mellom 763 og 785, og kilden gir parti på 30–40 grader som krever terrengvurdering — med bratt terreng på begge sider av linja. Varden på 901; registerets Store Skalltinden ligger 31 m fra Fri Flyts publiserte punkt, og toppsøket løser 901,1 mot publiserte 900.",
    ],
    descent: [
      "Ned samme vei, med varianter etter forholdene. Sørøstsektoren linja følger er den slakeste på toppen — 16,5 grader i snitt over 500 meter med 33,7 som bratteste 60-metersvindu 240 til 300 meter ut.",
      "Resten av toppen er en annen historie: nordøst, øst og sørvest faller 40,2, 41,6 og 40,8 grader i snitt. Bjørnskardalen er kildens KAST 3-alternativ og hører til stabile dager. Fjordutsikten fra varden — Lyngsalpene over Ullsfjorden — er den samme uansett hvilken dag du velger; linja ned bør ikke være det.",
      "Den andre ruta kommer fra baksida av fjellet: Bjørnskardalen fra Bjørnskar, 966 høydemeter på 6,13 km, opp til og over Bjørnskarvatnan — Nedre Bjørnskarvatnet på 220 moh og det store vatnet på 250 — og gjennom skardet vest for punkt 621, og videre opp den brede ryggformasjonen som krysser et navnløst tjern på 480. Kilden kaller den «et lengre og mer utfordrende rutevalg med et alpint tilsnitt» og regner med ski på sekken fra skardet, med stegjern vurdert etter forholdene. Bratteste steget måler 32,1 grader mellom 701 og 726 moh mot normalrutas 27,0. Vatnene er ikke regulerte — DTM1 leser dem som Innsjø på 250 — og det er kilden selv som sender deg over isen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, faremomenter løsneområder, utløpsområder og skavler. Linja måler 27,0 grader der den er brattest, men kilden gir parti på 30–40 i de siste 800 metrene — og mellom 600 og 800 står bratt terreng på begge sider av linja. Grad 3 står av samme grunn: sjø til topp med tre faremomenter er mer enn en helningsvinkel.",
      },
      {
        title: "De småbratte partiene",
        body: "Mellom 230 og 300 moh, over Skallvatnet-trinnet, ligger de små bratte partiene kilden ber deg navigere med omhu. De er korte — og de er tidlig på turen, før dagens stabilitet har vist seg. Les dem som en prøve på resten.",
      },
      {
        title: "Vatnet på 543",
        body: "Linja krysser 103 meter av det naturlige vatnet sørvest for punkt 695, aldri mer enn 18 meter fra land. Vinteris på et lite fjellvatn er ordinær vinterferdsel — men det er verdt å vite at det er et vatn du står på, særlig tidlig og seint i sesongen.",
      },
      {
        title: "Før du går",
        body: "Store Skalltinden ligger i varslingsregionen Tromsø, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,193 L43,180 L62,173 L78,177 L103,174 L125,169 L152,156 L174,147 L192,145 L214,137 L234,129 L250,123 L273,118 L295,115 L313,112 L335,108 L355,99 L379,89 L401,91 L418,91 L439,91 L463,82 L487,81 L510,75 L532,62 L553,46 L568,35 L582,24 L600,18",
      startLabel: "11 moh",
      endLabel: "901 moh",
      distanceLabel: "6,0 km",
      caption: "981 høydemeter og 6,04 km fra Glimbukta om Skallvatnet og den kuperte ryggen, med skoggrensa på 185 moh og det bratteste — 27,0 grader mellom 763 og 785 moh — i de siste 800 metrene.",
    },
  },
  "store-blamann": {
    slug: "store-blamann",
    intro:
      "Kvaløyas høyeste, og en tur som skiller seg fra resten av Tromsø-toppene: 1035 høydemeter på tre kilometer, med et toppparti de fleste tar av seg skiene på.",
    ascent: [
      "Fra parkeringen ved Slettneset på Fjordvegen (fv 7768) tar den merka Blåmann-stien vestover rett fra sjøkanten. De første hundre metrene går på klopper over myr; skogen slipper med en gang, og fra 56 moh og opp går du i åpent terreng resten av veien.",
      "Stien stiger jevnt vestover til skulderen på rundt 230 moh, svinger så sørvest og tar seg opp på ryggen ovenfor Steet. Fra 475 moh og opp er ryggkammen hele ruta. De første tre hundre høydemeterne der oppe er brede og snille — flankene faller bare 10 til 25 grader, og fjellet føles lettere enn det er. Det varer til rundt 800 moh.",
      "Videre følger du østsørøst-ryggen vestover, med sørflanken fallende ned i Blåmannsvikdalen. Et flatere mellomparti gir pusterom rundt 670 moh. Fra rundt 800 moh strammer det til på begge sider: sørflanken går fra 20 til 42 grader i snitt, med parti over 55, og nordsida begynner å falle bort. Det bratteste hundremetersbeltet på linja ligger mellom 900 og 1000 moh med et snitt på 22,2 grader, og det bratteste enkeltpartiet måler 36,5.",
      "De siste 160 høydemeterne er bratte og luftige, med lett klyving mot varden. Det er her skiene går på sekken. I hard snø eller is trenger du stegjern og isøks, og hjelm hører med.",
    ],
    descent: [
      "Ned samme vei. Klyv ned toppartiet før du tar på skiene igjen — fra varden finnes det ingen linje ned østsida eller nordsida som ikke ender i stup.",
      "Vanligste feil: å legge seg ut på sørflanken under toppen fordi den ser åpen ut. Den holder 35 til 48 grader rett under varden, og der ruta krysser 800 moh er den 42 grader i snitt med parti over 55. Den fortsetter rett ned i Blåmannsvikdalen. Hold ryggkammen til du er nede på skulderen ved 230 moh, og følg stien ut.",
      "Rundt 475 moh møter ruta den gamle stien fra Blåmannsvika. Den er farbar, men kommer ut på en annen parkering enn den du kjørte til — hold merkinga mot Slettneset.",
    ],
    avalanche: [
      {
        title: "Selve ruta",
        body: "Ruta ligger på ryggkammen fra 475 moh og opp, og det er det som gjør den mulig. Opp til rundt 800 moh er ryggen bred og flankene slake, 10 til 25 grader. Over 800 er det slutt: sørflanken holder 42 grader i snitt, nordsida 38 og oppover. Det bratteste hundremetersbeltet på linja, 900 til 1000 moh, holder 22,2 grader i snitt, og enkeltpartier måler 36,5. Toppartiet over 880 moh er bratt og eksponert; i hard snø er det en klatretur, ikke en skitur.",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppblokka faller bratt til alle kanter unntatt vest. Nordveggen er det ekstreme: 350 høydemeter i 60 til 85 grader rett under varden, en av landets kjente storvegger og ikke noe du kommer deg ned. Rett øst og nordøst for varden faller terrenget i stup, med parti på 70 til 80 grader. Sørveggen holder 35 til 48 grader ned mot Blåmannsvikdalen. Bare vestryggen mot Hollendaren er slak, og den fører bort fra bilen. Ordalen på nordsida er en egen botn og hører ikke til denne ruta.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Tromsø på varsom.no. Ta med sender/mottaker, søkestang og spade — og stegjern, isøks og hjelm til toppartiet.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,194 L62,187 L94,180 L117,174 L141,168 L164,161 L188,155 L220,145 L251,135 L277,130 L298,124 L321,115 L338,110 L358,104 L377,97 L401,89 L424,81 L448,75 L466,69 L487,61 L502,55 L518,50 L542,41 L557,36 L569,30 L589,22 L600,18",
      startLabel: "9 moh",
      endLabel: "1044 moh",
      distanceLabel: "3,4 km",
      caption: "3,4 km og 1035 høydemeter: kloppene ved Slettneset, ryggen ovenfor Steet, og det bratte toppartiet.",
    },
  },
  kjolen: {
    slug: "kjolen",
    intro:
      "578 høydemeter og 4,11 km fra Finnvikvatnet til radaren på 790 moh — en av Kvaløyas mest besøkte topper, og et fjell uten et eneste bratt parti på ruta. Bratteste hundremetersband er 12,6 grader mellom 300 og 400 moh, og bratteste steg 24,9 mellom 605 og 620. Det bratte på Kjølen ligger nord, og ruta går øst.",
    ascent: [
      "Start sør for Finnvikvatnet, 224 moh, som er der ut.no startet: «Vi parkerte på sørsiden av Finvikvatnet, et av mange startpunkter.» Den kartlagte parkeringa ligger 640 meter lenger nord ved østenden av vatnet, og derfra går det an å gå, men ikke over isen — vassflata ligger på 229 moh og landet øst for den 254 til 265, så det er rundt og ikke over. Fri Flyt beskriver fire startsteder for dette fjellet og kaller dette «et litt kortere alternativ med mindre stigning».",
      "Turen går over skoggrensa nesten fra bilen: Kartverket fører siste skog på 218 moh, 40 meter inn på linja, og åpent terreng fra 219 og hele veien opp. De første 904 metrene innover Finnvikdalen stiger 5,1 grader. Så kommer turens bratteste strekk, og det er ikke bratt: 12,6 grader fra 300 til 400 moh over 450 meter grunn. Over det slakner det igjen — 8,4 grader fra 400 til 500, 6,9 fra 500 til 600, 9,5 fra 600 til 700 og 7,3 til topps — med korridorpunktene på 440, 572 og 703 moh underveis.",
      "Det eneste stedet linja virkelig reiser seg er mellom 605 og 620 moh, der bratteste 30-metersvindu måler 24,9 grader. Fri Flyt oppgir bratteste punkt under 27 grader for alle fire rutene på fjellet. Toppflata nås på 774 moh, og derfra er det flatt bort til den store radaren og varmebua Troms Turlag reiste på dugnad i 2010. Begge står i kartet: radaren er OSM-noden «Stor-Kjølen Radar» 46 meter fra toppcella, og bua «Varmebua på Kjølen» 41 meter fra den.",
    ],
    descent: [
      "Ned samme veien, ned Finnvikdalen. Retninga fra toppen til startpunktet er 62 grader, mellom øst og nordøst, og de to radialene måler 9,8 og 10,0 grader i snitt ut til en kilometer — det er hele historien om den sida. Fri Flyt mener for øvrig at den beste skikjøringa på fjellet ligger et annet sted: rutene fra Kvaløysletta og Slettaelva, «der siste del nedover Finnlandsfjellet bare er å nyte i store og herlige svinger». Dette er den korte veien opp, ikke den fineste veien ned.",
      "Ut.no er tydelig på hva turen er og ikke er: «Ikke en topp for deg som må ha kvasse egger og bratte nedkjøringer, men en fin topp som gir god skikjøring.» Advarselen deres gjelder ikke bratthet, men det som ligger under snøen: «Snømengden avgjør mulighetene dine på vei ned. Følg snøfeltene så langt det lar seg gjøre, unngå åpenbare terrengfeller og bekkedaler.»",
      "Nordover er det en annen sak. Nordflanken måler 20,9 grader i snitt ut til en kilometer med et 36,7-graders vindu 710 til 770 meter ut — den eneste retninga fra denne toppen som holder over 20 grader i snitt. Toppflata er bred, radaren er det eneste holdepunktet i dårlig sikt, og faller du for fristelsen til å ta en ny linje nedover nordover, er det den flanken du kommer inn i.",
      "Fri Flyt gir fire startsteder for Kjølen, og kortet bærer nå tre av dem. Fra Kvaløysletta sykehjem er det 805 høydemeter og 6,76 km opp gjennom byggefeltet til det lille alpinanlegget, over Slaktarhaugen på 220 moh og Finnlandsfjellet på 494, forbi Litje-Kjølen på 652 — den slakeste av de tre, med bratteste steg 23,1 grader mellom 130 og 149 moh. Fra Slettaelva er det 813 høydemeter og 6,29 km etter anleggsveien opp Svarthammardalen, 376 moh, og vest for Amundvatnet. Den linja har et steg på 34,7 grader mellom 350 og 371 moh — godt over «Bratteste punkt: Under 27 grader», som er tallene kilden oppgir for fjellet og som normalruta fra Finnvikdalen holder seg innenfor.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "578 høydemeter der bratteste band er 12,6 grader og bratteste steg 24,9. Fri Flyt fører alle sine fire ruter på fjellet som KAST 1 – Enkelt, og ut.no fører denne som moderate. Ingen av dem oppgir et faremoment på oppstigninga.",
      },
      {
        title: "Nordsida og toppflata",
        body: "Sju av åtte retninger fra toppen måler under 12 grader i snitt: nordøst 10,0, øst 9,8, sørøst 9,9, sør 11,3, sørvest 7,9, vest 4,8 og nordvest 8,0. Nord måler 20,9 med 35,5 grader i vinduet 720 til 780 meter ut. Det er den ene kanten det er verdt å vite om, og den er lettest å finne i dårlig sikt, når toppflata ikke gir deg noe å navigere etter og radaren blir borte bak deg.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Tromsø på varsom.no — en A-region med varsel hver dag i sesongen. Ut.no oppgir sesong januar til mai og Fri Flyt november til juni; kortet fører overlappet, november til mai. Varmebua på toppen er ulåst, men den er en rasteplass og en nødbu, ikke en grunn til å gå ut i vær du ellers ville snudd i. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L17,199 L40,198 L60,194 L79,191 L97,186 L112,180 L132,172 L152,163 L167,158 L184,146 L204,138 L230,132 L250,126 L270,117 L284,113 L303,107 L322,104 L339,102 L359,97 L381,91 L401,82 L421,75 L434,66 L460,58 L484,53 L506,44 L526,38 L546,33 L565,27 L584,23 L600,18",
      startLabel: "224 moh",
      endLabel: "790 moh",
      distanceLabel: "4,1 km",
      caption: "578 høydemeter og 4,11 km fra sør for Finnvikvatnet på 224 moh, innover dalen over 440 og opp østsida over 572 og 703 til toppflata på 774.",
    },
  },
  rodtinden: {
    slug: "rodtinden",
    intro:
      "450 høydemeter og 2,32 km fra Storelva skistadion til toppen på 470 moh — den mest besøkte toppen rundt Tromsø, og en tur for alle anledninger. Bratteste hundremetersband er 15,1 grader mellom 300 og 400 moh, og bratteste steg 24,2 grader mellom 429 og 447. Det eneste virkelig bratte på fjellet ligger sørøst for varden, og ruta går ikke i det.",
    ascent: [
      "Start ved Storelva skistadion på Kvaløysletta, 20 moh, der det er kartlagt parkering ved anlegget. Fri Flyt oppgir 2,8 km for turen og ut.nos egen linje måler 2,52; den routa linja her er 2,32 km. Fjellet heter Rødtinden på norsk og Ruksesvárri på nordsamisk, og begge navnene er vedtatt i Kartverkets register.",
      "Den første kilometeren følger lysløypa oppover Storelvdalen — de første 942 metrene av linja stiger 5,1 grader i snitt — og på 96 moh forlater ruta løypa og legger seg inn i lia, og fra da av er stigninga påfallende jevn: 14,5 grader fra 100 til 200 moh, 15,0 fra 200 til 300, 15,1 fra 300 til 400 og 14,9 over det. Turen gir ikke tilbake en eneste høydemeter på hele oppstigninga.",
      "Kartverket fører skog til 208 moh og åpent terreng fra 218, men skogen her er bjørk med myr imellom — terrengklassen langs linja veksler mellom Skog og Myr på 53, 156 og 241 moh. Over den er det bare å velge spor. Fri Flyt: «Etter hvert kommer man over skogen og det er bare å legge sporet etter behag. (Men det skal godt gjøres hvis det ikke er et spor å følge).» De siste hundre høydemeterne holder ruta godt mot vest der ryggen er slakest, og bratteste steget på turen ligger her — 24,2 grader mellom 429 og 447 moh.",
    ],
    descent: [
      "Ned samme veien, sørøstover mot skistadion. Vest for varden måler flanken 3,3 grader i snitt ut til en kilometer og sørvest 15,1, så velger du feil kant er det ikke bratthet som straffer deg, det er at du havner i feil dal.",
      "Det ene stedet fjellet er bratt, ligger sørøst for varden, og det ligger nært. Radialen på 135 grader, lest av punkt-API-et hver tiende meter, går 469,6 – 467,7 – 464,6 – 459,5 – 452,7 – 448,8 – 437,0 – 430,6 – 426,6 moh de første 80 meterne: bratteste 60-metersvindu er 32,3 grader mellom 20 og 80 meter ut, og det bratteste enkeltsteget 49,7 grader mellom 50 og 60. Fri Flyts «heng med bratthet opp mot 40 grader» er altså riktig, og under de tjue metrene der det er brattest, forsiktig.",
      "Nordvestover er problemet det motsatte. Toppen er en rund skulder og ikke et toppunkt i terrengmodellen: bakken stiger videre uten sadel — 479,6 moh 200 meter ut, 488,5 på 400 og 491,0 på 600 — og fortsetter til 567,0 moh ved registerpunktet for Storbogtinden 728 meter unna. I flatt lys går du forbi varden uten å merke det, og fortsetter inn på et fjell med en annen tur.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "450 høydemeter der ikke ett hundremetersband måler over 15,1 grader og bratteste steg er 24,2. Fri Flyt fører turen som KAST 1 – Enkelt med bratteste punkt under 25 grader, og skriver at sporet her kan legges helt utenom skredterreng. Det forutsetter at det holder seg vest for toppryggen på slutten.",
      },
      {
        title: "Henget mot sørøst",
        body: "Det henget er turens eneste faremoment, og det er brattere enn tallet Fri Flyt oppgir: 49,7 grader på ti meter mellom 50 og 60 meter fra varden, og 32,3 grader over hele vinduet fra 20 til 80. Fra toppen ser det ut som en naturlig linje ned mot skistadion, og det er den korteste veien hjem. Østsida er den samme historien i mindre målestokk: 15,0 grader i snitt, med et 28,6-graders vindu som ligger 50 til 110 meter ut — lenger fra varden enn på sørøstsida, og derfor lettere å komme borti uten å ha bestemt seg for det.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Tromsø på varsom.no. Tromsø er en A-region og varsles hver dag gjennom sesongen, i motsetning til mange av fjellene lenger sør i appen. Ingen av kildene oppgir sesong for Rødtinden; kortets des–mai er lest ut av høyden — toppen er 470 moh — og av at Fri Flyt gir Kjølen på 790 moh november til juni. Ta med sender/mottaker, søkestang og spade selv på husfjellet.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,199 L34,198 L48,197 L69,195 L92,194 L116,192 L139,188 L162,184 L185,179 L205,176 L220,171 L243,166 L258,162 L278,154 L301,145 L313,140 L336,129 L348,124 L371,115 L383,111 L406,101 L418,95 L441,85 L457,77 L476,69 L499,59 L520,50 L534,46 L557,37 L570,35 L581,27 L600,18",
      startLabel: "20 moh",
      endLabel: "470 moh",
      distanceLabel: "2,3 km",
      caption: "450 høydemeter og 2,32 km fra Storelva skistadion på 20 moh, ut av lysløypa på 96 moh og opp den åpne sørøstsida over 303 og 431.",
    },
  },
  storfjellet: {
    slug: "storfjellet",
    intro:
      "1053 høydemeter på bare 3,27 km — Storfjellet reiser seg rett opp fra Breivikeidet, og linja er deretter: jevnt bratt fra skogen og opp, med beltet fra 500 til 600 moh på 29,7 grader og det bratteste sammenhengende partiet på 42,4. Fri Flyt gir KAST 2 – Utfordrende med 30–40 grader mellom 950 og 1040, en renne som fungerer som terrengfelle i dalen — og et østheng med en skredulykke fra 1997 som tok to liv. Et anonymt fjell, sier andrekilden, med varierte nedkjøringer og fin utsikt.",
    ascent: [
      "Fra fv. 91 i området der den krysser Storelva — 41 moh på Breivikeidvegen, og 1089 minus 41 forliker kildens 1050 høydemeter. Du går mot Russevankskardet langs nordøstsida av elvedalen: beltet fra 200 til 300 moh måler 21,1 grader, og renna i dalen er kildens eget faremoment — den fungerer som samletrakt for skred fra hengene omkring, så linja holder seg på dalsida, ikke i botnen. Skogen slutter på 455 moh etter 1,8 km, med åpent område fra 463.",
      "På rundt 400 svinger du mot nord og øst, opp på sørryggen som kommer ned fra toppen. Overgangen er turens bratteste: beltet fra 500 til 600 moh måler 29,7 grader over bare 198 meter grunn, med det bratteste sammenhengende partiet — 42,4 grader — mellom 536 og 565 moh.",
      "Ryggen tar deg til topps: 24,9 grader fra 800 til 900 moh og 23,7 fra 900 til 1000, som er linjas svar på kildens «30–40 grader mellom 950 og 1040» — ryggen skrår der flanken står. Varden på 1088; registerets Storfjellet ligger 46 m fra Fri Flyts publiserte punkt, og toppsøket løser 1088,2 mot publiserte 1089.",
    ],
    descent: [
      "Normalen følger ruta opp — sørvestsektoren er den slakeste på toppen, 26,2 grader i snitt med 37,0 som bratteste 60-metersvindu, og det er den eneste: sørøst faller 34,8 i snitt med et vindu på 59,9, sør 36,3 med 53,1, og nordsiden har 53,9 grader bare 100 til 160 meter ut.",
      "Østhenget fra Krokenga er kildens KAST 3-alternativ, med lang eksponering i både løsne- og utløpsområder og 30–40 grader fra 240 moh og opp. Skredulykken i 1997, som tok to liv, gikk her. Det er ikke linja på dette kortet, og det er ikke en vei ned man tar på følelsen.",
      "Den andre ruta går opp østsida fra Krokenga: 1074 høydemeter på 3,66 km, langs sørvestsida av Sauskarbekken til 578 moh og så vestover mot toppen. Kilden skriver den med utropstegn — «Denne oppstigningen krever sikre snøforhold!!!» og «Fra 240 moh. og helt opp er terrenget i store områder 30–40 grader!!» — og daterer et skred: i 1997 gikk et selvutløst skred langt oppe i fjellet over fv. 91 og tok livet av to personer i et hus på Krokenga. Bratteste steget på linja måler 30,7 grader mellom 350 og 368 moh; normalruta fra Storelva er brattere i et enkeltsteg, 42,4, men ligger kortere tid i skredterreng.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, med 30–40 grader mellom 950 og 1040 på flanken og linjas eget bratteste på 42,4 grader i overgangen opp på ryggen. Nesten hele turen ligger i eller inntil terreng over 30 grader — dette er en tur for stabile forhold.",
      },
      {
        title: "Renna i dalen",
        body: "Kildens eget faremoment: renna fungerer som samletrakt for skred fra hengene omkring. Dalen inn mot skardet er mottakerterreng — hold linja på dalsida og avstanden til hengene som en del av sporvalget.",
      },
      {
        title: "Østhenget",
        body: "KAST 3 – Komplekst, lang eksponering i løsne- og utløpsområder, 30–40 grader fra 240 moh — og en skredulykke i 1997 som tok to liv. Historien er en del av fjellet, og den er grunnen til at normalruta går på ryggen.",
      },
      {
        title: "Før du går",
        body: "Storfjellet ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L32,196 L65,195 L98,193 L131,189 L172,179 L193,171 L213,162 L230,156 L258,150 L285,141 L305,137 L315,133 L338,127 L359,120 L376,111 L392,103 L407,95 L425,87 L437,82 L453,74 L478,67 L497,60 L515,51 L536,43 L551,36 L569,29 L587,23 L600,18",
      startLabel: "41 moh",
      endLabel: "1088 moh",
      distanceLabel: "3,3 km",
      caption: "1053 høydemeter og 3,27 km fra Breivikeidet opp sørryggen, med skoggrensa på 455 moh og det bratteste — 42,4 grader mellom 536 og 565 moh — i overgangen opp på ryggen.",
    },
  },
  skarlitinden: {
    slug: "skarlitinden",
    intro:
      "937 høydemeter og 6,34 km fra Sandeggen på Breivikeidet til varden på 857 — en KAST 1-tur med bratteste punkt under 27 grader på selve ruta, der terrenget rundt er historien: elvedalen du følger kan fungere som terrengfelle for skred fra hengene i nord, og rennene på sørøstsiden faller 41 grader i snitt mot dalen du kom fra. Linja samler et hundretall høydemeter mer enn kildens 835, fordi skaret og platået gir tilbake 110 på veien.",
    ascent: [
      "Fra skogsvegen ved Sandeggen — 31 moh på Breivikeidvegen, fv. 91, vinteråpen hovedveg — følger du veien inn og tar av langs nordsida av Russevankelva, opp gjennom storsteinet terreng. Beltet fra 100 til 200 moh måler 14,7 grader; skogen slutter allerede på 318 moh etter 2,42 km, med åpent område fra 327.",
      "På rundt 400 flater det ut inn i Russevankskaret — 452 moh der linja går, og registerets Russevankskaret leser 446. Her er kildens terrengfelle: dalen samler utløp fra hengene i nord, så avstanden til dem er en del av sporvalget. Ved punkt 511 svinger du mot sør-sørøst, og linja gir tilbake det bratteste partiet sitt her — 30,5 grader ned mellom 539 og 516 moh, dippen etter skaret som er grunnen til at turen samler 937 høydemeter der kilden regner 835.",
      "Fra svingen stiger det jevnt mot toppplatået: beltet fra 600 til 700 moh er turens bratteste oppover, 21,1 grader over 269 meter grunn, og over 700 slakner det til 13,1 og 8,1. Platået passerer 847 før varden på 857 — Fri Flyts publiserte GPS-punkt, registerets punkt (som har både Skarlitinden og Skardlitinden) og terrengmodellens 857,5 faller sammen.",
    ],
    descent: [
      "Normalen er sporet ditt opp, og platåsiden er slak: nordvest måler 3,3 grader i snitt og vest 11,0. Hold igjen mot kanten i sørøst — den faller 41,4 grader i snitt med 52,5 som bratteste 60-metersvindu 120 til 180 meter ut fra varden, og sørsiden 36,1 med 48,8 bare 50 til 110 meter ut.",
      "Østerenna er kildens alternativ ned mot øst: KAST 3 – Komplekst, 30–45 grader mellom 760 og 380 moh. Østsiden måler 21,5 grader i snitt med 45,2 som bratteste vindu 340 til 400 meter ut — skikjøring i skredterreng, og et valg som tas på stabilitet, ikke på fristelse.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, bratteste punkt under 27 grader på oppturen — og linjas eget bratteste parti er faktisk en nedoverbakke, 30,5 grader i dippen etter punkt 511. Kortet bærer grad 2: terrenget rundt linja er det som krever hodet.",
      },
      {
        title: "Terrengfella",
        body: "Fri Flyts faremoment er «Terrengfelle. Skavler». Elvedalen langs Russevankelva samler utløp fra hengene i nord — du går i mottakerterreng, og avstanden til hengene er en del av sporvalget hele veien inn skaret.",
      },
      {
        title: "Kanten og rennene",
        body: "Sørøst- og sørsiden av platået faller 41,4 og 36,1 grader i snitt mot Breivikeidet, med vinduer på 52,5 og 48,8 grader nær varden — og skavlene bygger ut over kanten. I flatt lys er platåkanten stedet å ha tenkt gjennom før du står der.",
      },
      {
        title: "Før du går",
        body: "Skarlitinden ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L25,197 L46,195 L67,199 L93,198 L118,193 L140,188 L161,175 L182,163 L208,147 L233,134 L255,128 L280,116 L306,112 L328,107 L351,107 L373,104 L392,98 L405,86 L421,98 L446,100 L468,97 L488,83 L506,69 L519,57 L536,44 L557,33 L574,27 L600,18 L600,18",
      startLabel: "31 moh",
      endLabel: "858 moh",
      distanceLabel: "6,3 km",
      caption: "937 høydemeter og 6,34 km fra Sandeggen gjennom Russevankskaret, med skoggrensa på 318 moh og det bratteste — 30,5 grader — i dippen etter punkt 511.",
    },
  },
  fastdalstinden: {
    slug: "fastdalstinden",
    intro:
      "1271 høydemeter og 7,21 km fra veienden på Varto — en Lyngen-klassiker med lang anmarsj og et magasin midt i turen. Fri Flyt gir normalruta KAST 2 og bratteste punkt 25–30 grader, og målingen av linja er snillere enn ryktet: bratteste hundremetersbeltet 19,5 grader mellom 200 og 300 moh, bratteste sammenhengende parti 25,5. Grad 3 på kortet er skalaen, ikke bratthenget: dette er en 6–8-timerstur der terrenget omkring — skavler, utløpsområder og en sørside med dødsulykker i historikken — er en annen klasse enn sporet.",
    ascent: [
      "Fra fv7920 ved Rottenvik tar Vardoveien av og klatrer omtrent en kilometer til veienden på 123 moh — Fri Flyts «parkeringsplass på Varto» — registerets Varto (Høyde) står 1,8 km øst på 187 moh, og navnet som er registrert ved selve veienden, er Vardoveien. Anleggsveien fortsetter vestover og oppover: den er kartlagt hele veien til dammen på 515 moh, og de første fire hundre høydemetrene er unnagjort på vei. Skogen slutter allerede på 363 moh etter Kartverkets klasser.",
      "Dammen fortjener sin egen setning: Rottenvikvatnet er et magasin — regulert, med terrengklasse deretter — og isen på et regulert vann skal ikke brukes. Linja går derfor slik kilden sier, langs vest- og senere nordsida av vannet, på land hele veien: vestbredden på 566, nordvestbredden på 572, nordenden på 589 moh. Det er målt mot både terrengklassene og OSM-polygonet: 0 meter på vann.",
      "Fra nordenden av vannet stiger terrenget til flata Fri Flyt setter på 650 moh — målt 650 på metern. Videre vestover passerer linja nord for det vesle vatnet på 697, og så kommer ryggformasjonen kilden ber deg være våken på: «Her er det små områder som er rundt 30 grader, så bruk litt tid på å gjøre gode veivalg». Linja holder 815 → 1070 på ryggen, med linjevalget som verktøyet.",
      "Fra ryggen er det rett mot toppen, slik kilden sier. Varden står på 1275 moh, og sørøstsida du kom opp er den slakeste sektoren fjellet har: 16,0 grader i snitt og 28,4 som bratteste 60 m-vindu de første hundre metrene.",
    ],
    descent: [
      "Samme trasé ned som opp er kildens råd, og tallene er med den: sørøst og sør er de eneste sektorene uten et 30-gradersvindu i sveipet — 28,4 og 28,2 grader som bratteste 60 m — og linja selv peiler 169 til 180 grader ned. Ned ryggen, forbi det vesle vatnet, ned på flata og rundt magasinet på land igjen — 119 høydemeter å gi tilbake har turen samlet, det meste rundt vatnet og på anleggsveien.",
      "Sørsidenedfarten Fri Flyt nevner — 35–45 grader ned mot Rottenvikvatnet — er ikke denne linja, og kilden sier selv hvorfor med uvanlig tunge ord — «Sørsiden av fjellet har vært åsted for et par tragiske skredulykker med dødelig utfall», skriver den, og den skriver det i beskrivelsen av normalruta, ikke om varianten: steinparti rundt 1000 moh må identifiseres på vei opp, og utkjøringa krever sikker is på et vann som er regulert. Denne guiden tegner den ikke.",
      "Vær også våken vest og sørvest for varden: sveipene måler 34,3 og 32,5 grader i snitt der, med 46,6 og 51,6 som bratteste vindu — fjordsida er alpin, og i flatt lys er kanten lett å komme for nær.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts faremoment er «utløpsområder og skavler», og det er presist: selve linja holder 25,5 grader som bratteste sammenhengende parti, men den krysser under brattere flanker — ryggformasjonen har småbratte partier rundt 30 grader, og Normalruta II lenger nord er eksponert for løsneområder ovenfra mellom 700 og 900 moh. Velg ryggen med øynene oppover, ikke bare nedover.",
      },
      {
        title: "Sørsida",
        body: "«Sørsiden av fjellet har vært åsted for et par tragiske skredulykker med dødelig utfall», skriver Fri Flyt — og den skriver det midt i beskrivelsen av normalruta, rett etter flata på 650, ikke om varianten. Advarselen gjelder hele sørsida slik du ser den fra ryggen du går opp; nedfartsvarianten på 35–45 grader mot Rottenvikvatnet fører den selv som «Ned sørsiden ➌ Komplekst». Den ligger rett ved normalruta og frister på vei ned. Målingene fra varden sier at alt vest om sør er alpint: SV 51,6 grader som bratteste vindu, V 46,6, NV 41,0.",
      },
      {
        title: "Magasinet",
        body: "Rottenvikvatnet er regulert, og regulert is skal ikke brukes — trukket ned vinterstid legger den seg i sprekker og hulrom langs land. Linja går rundt vatnet på land i begge retninger, målt punkt for punkt, og den eneste grunnen til å være på isen er å ha valgt feil. Anleggsveien og dammen er der fordi dette er et kraftmagasin; les landskapet deretter.",
      },
      {
        title: "Før du går",
        body: "Fastdalstinden ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts egen. Tiden er ikke: den setter 5–6 timer, mens kortet bærer 6–8 — appens egen skala for 1270 høydemeter og 7,3 km. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,188 L48,170 L70,156 L90,145 L112,142 L138,135 L165,138 L191,136 L221,138 L231,138 L254,138 L279,131 L301,138 L313,134 L337,130 L358,130 L374,122 L393,117 L416,115 L442,108 L471,96 L489,84 L509,72 L529,59 L551,48 L580,30 L600,18",
      startLabel: "123 moh",
      endLabel: "1275 moh",
      distanceLabel: "7,2 km",
      caption: "1271 høydemeter og 7,21 km fra Varto — anleggsvei, magasin rundt på land, og ryggen rett mot toppen på 1275.",
    },
  },
  tromsdalstinden: {
    slug: "tromsdalstinden",
    intro:
      "Tromsøs signaturtopp, og 1209 høydemeter i strekk fra skytebanen i Tromsdalen til varden. Sporet holder seg under 27 grader hele veien — det er lengden, ikke bratthet, som gjør turen.",
    ascent: [
      "Fra parkeringen ved skytebanen innerst i Turistvegen følger du skogsbilvegen sørøstover inn i Tromsdalen. Hold vestsida av Tromsdalselva hele veien; bjørka slipper taket allerede rundt 220 moh, og derfra ligger dalen åpen foran deg. Sommerruta tar NNV-ryggen ut av dalen lenger nede — det er gåruta, ikke skiruta.",
      "Innerst flater dalen ut ved Dalbotnvatnet på 311 moh. Rett før botnen reiser Svarthammaren seg på vestsida — et nordvendt stup som taper nær 100 høydemeter på seksti meter. Hold dalbunnen øst for det og styr mot skaret. Bakken opp til Salen på 740 moh er turens største lastflate: sporet legger seg på skrå over den og holder 12 til 13 grader, mens fallinja måler 30 til 35 om du tar den rett på.",
      "Fra Salen slakner det av. Følg sørryggen nordøstover mot varden. Beltet mellom 1000 og 1100 moh er det bratteste på selve ryggen, 20,1 grader i snitt; turens bratteste enkeltparti ligger nede i bakken opp mot Salen, 26,3 grader mellom 547 og 569 moh. Over 1100 moh er østkanten av ryggen skavlet — gå på vestsida av kammen, også når sporet frister lenger ut.",
    ],
    descent: [
      "Ned samme vei: sørryggen til Salen, så vestover ned i indre Tromsdalen og ut dalen til bilen. Fra Salen faller flanken jevnt vestover mot Dalbotnvatnet, og det er der de beste svingene ligger.",
      "Vanligste feil: å slippe seg rett ned vestsida fra toppen. Fra varden ruller vestflanken av på 20 til 35 grader, og det er hele problemet — den ser gåbar ut oppe. Under rundt 1080 moh er du på Fronten: hundre høydemeter med 45 til 58 grader, og ingen vei ut til sida. Hold ryggen sørover til Salen før du legger deg over mot vest.",
      "De siste kilometerne er skogsbilveg. Fallet er slakt — under fem grader hele veien ut — så regn med å stake.",
    ],
    avalanche: [
      {
        title: "Selve ruta",
        body: "Sporet passerer 25 grader ett sted, mellom 547 og 569 moh i bakken opp mot Salen, der det måler 26,3; beltet 1000 til 1100 moh holder 20,1 grader i snitt. Bakken opp til Salen er partiet du må lese. Den vender vest og nordvest, og fallinja måler 30 til 35 grader i snitt med parti over 40: sporet legger seg på skrå over den, men snøen bryr seg ikke om sporet. Det er en lastflate i østlig og sørøstlig vind, ikke i vestlig. Over 1100 moh er østkanten av ryggen skavlet hele veien til varden.",
      },
      {
        title: "Terrenget utenfor",
        body: "Vestveggen rett under toppen er Fronten — guideboka kaller den 150 høydemeter med 35 til 50 grader, og terrengmodellen er enig. Den er en felle fordi den begynner slakt: 20 til 35 grader de første hundre og femti metrene fra varden, så 35 til 40, og først under rundt 1080 moh går den i 45 til 58. Østryggen er brattere enn den ser ut fra sporet, 35 grader i snitt og opp mot 40. Nede i dalen stuper Svarthammaren nordover rett før Dalbotn; ruta går forbi på dalbunnen øst for den.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Tromsø på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L21,200 L43,198 L66,197 L95,194 L121,191 L144,187 L169,182 L196,177 L222,172 L248,166 L271,159 L294,156 L320,152 L343,141 L366,132 L382,122 L402,110 L421,102 L441,93 L464,82 L483,71 L506,56 L523,44 L545,32 L568,22 L588,20 L600,18",
      startLabel: "38 moh",
      endLabel: "1238 moh",
      distanceLabel: "8,3 km",
      caption: "8,2 km og 1209 høydemeter: skogsbilveg til Dalbotnvatnet, bakken opp til Salen, sørryggen til varden.",
    },
  },
  gabrielfjellet: {
    slug: "gabrielfjellet",
    intro:
      "1139 høydemeter og 4,39 km fra Stormo ved fv. 91 til toppen skifolket kaller Gabrielfjellet — og registeret kaller Iverfjellet. Fri Flyt gir KAST 2 – Utfordrende med bratteste parti 30–35 grader; linja måler 24,9 grader i bratteste hundremetersbelte og 29,2 i bratteste sammenhengende parti, og over det bratte venter store flak: beltet fra 900 til 1000 moh måler 9,0 grader over 631 meter grunn. Én lang stigning, sier andrekilden, med den bratteste delen på midten — og det stemmer på tallene.",
    ascent: [
      "Fra den nordligste av de to Stormo-gårdene langs fv. 91 — registerets Stormo leser 75,9 moh, og parkeringa er langs veien slik kilden sier. Du går sørover gjennom glissen skog: beltet fra 100 til 200 moh måler 13,0 grader, og skogen slutter allerede på 420 moh etter 1,4 km, med åpent område fra 437.",
      "Fra de åpne partiene dreier ruta mer mot øst, og mellom 400 og 850 moh er terrenget rullende rygger med flate parti imellom — 17,3 grader fra 400 til 500, 14,3 fra 500 til 600. Så kommer det bratteste: beltet fra 600 til 700 moh måler 24,9 grader over 226 meter grunn, med det bratteste sammenhengende partiet på 29,2 mellom 663 og 680. Kilden gir 30–35 grader her og ber om bevisst linjevalg — flanken står brattere enn diagonalene linja skjærer den i.",
      "Over 850 slakner det mot toppen, og de store flakene tar over: 9,0 grader fra 900 til 1000 moh over 631 meter grunn, så 15,6 og 14,7 opp de siste ryggene til varden på 1214. Fri Flyts publiserte GPS-punkt ligger 47 m fra registerets Iverfjellet, og toppsøket løser 1213,7 mot publiserte 1213 — registerets eget «Gabrielfjellet» er en skulder 3,2 km nordøst, og outdooractive fører turen under begge navnene.",
    ],
    descent: [
      "Nedfarten er nordover, samme vei som opp — og nordsiden er den slake sektoren på toppen: 13,5 grader i snitt over 500 meter med 17,8 som bratteste 60-metersvindu. Med stabilitet i orden gir det bratteste partiet fin kjøring med variantmuligheter; uten den kjører du flakene over og traverserer forbi.",
      "Hold igjen mot øst og sørøst fra varden: 40,8 og 38,8 grader i snitt, med 50,3 og 48,1 som bratteste vinduer rett under toppen. Vestsiden — kildens KAST 3-alternativ — måler 31,2 i snitt med parti på 40–45 i kildens egen beskrivelse.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, bratteste parti 30–35 grader med krav til linjevalg. Linja måler 29,2 grader der den er brattest, mellom 663 og 680 moh — det er partiet som avgjør om dagen har stabiliteten turen trenger, og det kan traverseres slakere enn fallinja.",
      },
      {
        title: "Løsne- og utløpsområder",
        body: "Kildens faremomenter. Det bratte beltet mellom 600 og 700 ligger midt i linja, så utløpet ditt er terrenget du selv skal videre opp i — les flanken over deg før du går inn i den, og ta de flate partiene mellom ryggene som lesepunkter.",
      },
      {
        title: "Østkanten",
        body: "Øst- og sørøstsiden av toppen faller 40,8 og 38,8 grader i snitt med vinduer over 48 rett under varden. Flakene mot toppen er store og oversiktlige — kanten der de slutter er det ikke. I flatt lys er det verdt å vite hvor den er før du står på den.",
      },
      {
        title: "Før du går",
        body: "Gabrielfjellet ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,193 L50,186 L75,179 L99,172 L124,167 L149,162 L166,155 L183,147 L204,140 L216,135 L234,128 L253,122 L278,116 L293,108 L308,99 L321,95 L337,88 L351,86 L370,81 L384,75 L407,68 L438,60 L460,57 L481,54 L505,48 L531,39 L549,35 L579,24 L600,18",
      startLabel: "76 moh",
      endLabel: "1214 moh",
      distanceLabel: "4,4 km",
      caption: "1139 høydemeter og 4,39 km fra Stormo, med skoggrensa på 420 moh, det bratteste — 29,2 grader mellom 663 og 680 moh — på midten, og store flak mot toppen.",
    },
  },
  rornestinden: {
    slug: "rornestinden",
    intro:
      "Den vennligste inngangen til Lyngsalpene: skogsvei nederst, slak flanke oppover og en bred toppflate å legge svingene på. Turen for den første Lyngen-dagen, og for dagen resten av alpene er for mye.",
    ascent: [
      "Start fra parkeringa ved Eidebakken i utkanten av Lyngseidet, på 62 moh, i området ved plastfabrikken og skytebanen. Følg skogsveien innover og opp mot Hyttehaugen på 286 moh, videre forbi Skihytta. Bjørkeskogen slipper rundt 310 moh, og derfra ser du resten av turen foran deg.",
      "Videre vestover mot Rørneshytta, hele tiden på sørsiden av Gjerdelva — en variant følger ryggen nord for elva opp til flata rundt 600 moh når snødekket tillater det, men normalruta holder sørsiden. Uansett hvilken side du går: ikke gå for langt ned i elvedalen mot Gjerdelva. Sidene ned i den bryter av på 34–37 grader der de ovenfra leser som flatt, og bunnen er ei terrengfelle. Hytta ligger på 604 moh, og det er der folk stopper.",
      "Fra hytta går du litt ned før du går opp igjen. Du krysser Gjerdelva rundt 590 moh, et søkk på en femtentalls høydemeter; turen gir fra seg 38 høydemeter til sammen på vei opp. Så følger du østsiden av flanken oppover til rundt 850 moh og svinger derfra mot toppen.",
      "Langs linja på kartet er bratteste steg 27,3 grader, og hundremeteren mellom 800 og 900 moh går i 21,4 i snitt. Flanken rundt deg er brattere, og snittet skjuler hvor mye: målt 400 meter ut fra sporet ved 907 moh holder østsiden 30 grader i snitt og nordsiden 33, men nordsiden faller i steg på 41 til 58 grader mellom 928 og 692 moh, og østsiden i steg på 44 til 48 under 794. Legger du deg for direkte mot toppen, er det dem du står i. Øverst flater det ut til den brede toppflata på 1030.",
    ],
    descent: [
      "Ned samme vei. Toppflata er romslig nok til å legge svingene der du vil — så lenge du holder deg sør og øst på den. Nord- og nordvestkanten faller av på 40–47 grader i snitt med steg på 50–57, og det er der det bygger skavler. Østflanken ned mot 850 moh er den lengste sammenhengende nedkjøringa på normalruta, 20–23 grader langs sporet. Under det holder du oppstigningssporet ned til Rørneshytta og videre østover mot Skihytta og skogsveien.",
      "Vanligste feil: å la nedkjøringa trekke ned i elvedalen mot Gjerdelva. Ryggen nord for elva er i seg selv en dokumentert variant og går fint å kjøre — det er bunnen som er problemet. Elvedalen er ei stor terrengfelle der det omkom en person vinteren 2017, og sidene ned i den måler 34–37 grader selv om de leser som flatt ovenfra. Hold høyden til du er ute av dalen.",
      "De brattere linjene fra toppen er egne turer, ikke varianter av normalruta. Topphenget er ei rett linje fra toppen med partier på 35–40 grader. Skredbekken tar ut mot Gjerdaksla etter topphenget og følger søkket nord for den ned mot Sollia, med partier på 30–40 grader; folk har løst ut skred der før, og du kommer ned langt fra bilen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigninga går gjennom utløpsområder fra 800 moh og opp. Selve sporet er slakt — bratteste steg måler 27,3 grader, og båndet 800–900 moh går i 21,4 i snitt — men flanken over og ved siden av måler 30 grader i snitt i øst og 33 i nord fra 907 moh, med enkeltsteg på 44 til 58. Det er den som eventuelt løsner over deg.",
      },
      {
        title: "Terrenget rundt",
        body: "Skavler står oppført som faremoment for turen, og kanten som betyr noe er nord- og nordvestsiden av toppflata: den faller 40–47 grader i snitt med steg på 50–57. Hold avstand til den i dårlig sikt. Elvedalen mot Gjerdelva er ei stor terrengfelle der det omkom en person vinteren 2017; sidene ned i den holder 34–37 grader. Nedkjøringsalternativene Topphenget og Skredbekken har partier på henholdsvis 35–40 og 30–40 grader, og i Skredbekken har folk løst ut skred tidligere.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L28,197 L56,185 L74,181 L100,172 L121,160 L144,159 L167,157 L188,152 L206,146 L228,137 L247,128 L270,117 L293,112 L312,105 L335,98 L368,94 L391,97 L411,98 L438,101 L465,90 L489,81 L512,72 L535,59 L553,47 L572,34 L596,21 L600,18",
      startLabel: "62 moh",
      endLabel: "1030 moh",
      distanceLabel: "5,8 km",
      caption: "Fra 62 moh ved Eidebakken til 1030 på toppen — 1008 høydemeter på 5,5 kilometer, med et søkk ved Rørneshytta.",
    },
  },
  hamperokken: {
    slug: "hamperokken",
    intro:
      "En middels skitur med en eksperts avslutning. 1383 høydemeter fra Fv91 opp en bred nordvestrygg som aldri blir brattere enn 26 grader — og så 1,7 kilometer eksponert rygg til fots fra Middagsaksla, med stegjern, isøks og et toppsteg på 38 grader.",
    ascent: [
      "Fra parkeringa ved Fv91 nedenfor Vartavarhaugen, 65 moh, går ruta østover over Vartavarhaugen på 159 moh og krysser Tverrelva. Bjørka slipper taket rundt 390 moh, og over 403 moh er terrenget åpent hele veien.",
      "Derfra følger skisporet den brede nordvestryggen sammenhengende oppover. Terrengmodellen gir jevne 16 til 26 grader fra rundt 350 moh til Middagsaksla, uten bratte trinn: bandene mellom 500 og 1000 moh ligger alle på 19 til 21 grader i snitt. Det er en lang, jevn skitur, og den er lite skredutsatt så lenge du blir på ryggen. Flankene på begge sider er noe annet, og de er terrengfeller i dårlig sikt.",
      "På Middagsaksla, 1076 moh, stopper skituren. Mange setter fra seg skiene her; noen bærer dem til forvarden på rundt 1190 moh og lar dem ligge der. Turrapportene fra vinterbestigninger er samstemte om at ryggen videre går til fots — «over ca. 1100 moh måtte skiene byttes mot stegjern og isøks».",
      "De siste 1,7 kilometerne er eksponert nordvestrygg. Ryggkammen bølger seg oppover fra 1076 til 1393 moh med korte motfall underveis — 47 høydemeter til sammen over Middagsaksla, og ingen av dem mer enn ti om gangen på linja. Det er luftige parti, korte klyvepartier, og helt til slutt ei renne og en bratt topppyramide: den bratteste hundremeteren på hele turen ligger mellom 1300 og 1400 moh og måler 23,9 grader i snitt, mens det bratteste sammenhengende partiet er selve toppsteget: 46,2 grader over tretti meter mellom 1365 og 1397 moh.",
    ],
    descent: [
      "Ryggen tilbake til fots til Middagsaksla, og derfra ned nordvestryggen på ski til Vartavarhaugen og bilen. Fallretningen ned ryggen er målt til nordvest, 293 grader, og hellinga er 16 til 26 grader hele veien — jevn, oversiktlig kjøring uten trange partier.",
      "Vanligste feil: å behandle Middagsaksla som en pause i stedet for et vedtak. Er ryggen isete, eller er sikta dårlig, er det her turen slutter — skituren er uansett over, og det som ligger foran er 1,4 kilometer der en glipp ikke har noen utgang til sida. Å snu på Middagsaksla er ikke en avbrutt tur; det er en fullverdig tur i seg selv, og den riktige når ryggen er isete.",
      "Den andre feilen er å slippe seg ned en av flankene fra ryggen for å korte inn. Begge sider av nordvestryggen er bratte og samler snø; ryggen selv er linja, både opp og ned.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skituren opp nordvestryggen er lite skredutsatt: 16 til 26 grader jevnt fra rundt 350 moh til Middagsaksla, uten bratte trinn. Flankene på begge sider av ryggen er derimot bratte, og de er terrengfeller — i dårlig sikt er det å holde ryggen selve navigasjonsoppgaven. Over Middagsaksla er det ikke lenger skiterreng: bratteste sammenhengende parti er toppsteget på 46,2 grader mellom 1365 og 1397 moh, og bratteste hundremeter, 1300 til 1400 moh, 23,9 grader i snitt.",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppryggen er den reelle faren på denne turen, og den er ikke først og fremst en skredfare: den er luftig, delvis skavlet mot nordøst, og har isete klyvepartier som krever stegjern, isøks og en vurdering av om tau hører hjemme i sekken. Nordvarianten fra Stormo, opp dalen mellom Gabrielfjellet og Middagsaksla, går ei renne på rundt 40 grader til skavlet rygg — det er en annen tur enn denne, og ikke normalruta.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade, og stegjern og isøks om du skal videre fra Middagsaksla.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,192 L48,187 L72,188 L96,188 L120,183 L144,175 L158,169 L173,162 L197,155 L219,147 L240,140 L252,134 L273,126 L288,121 L307,112 L321,105 L345,94 L367,84 L383,76 L398,71 L417,62 L444,62 L470,59 L489,52 L514,51 L537,43 L555,40 L579,30 L594,24 L600,18",
      startLabel: "65 moh",
      endLabel: "1397 moh",
      distanceLabel: "5,6 km",
      caption: "1383 høydemeter og 5,64 km fra Fv91. Skituren slutter på Middagsaksla 1076 moh; de siste 1,7 km til fots gir tilbake 47 høydemeter underveis.",
    },
  },
  kavringtinden: {
    slug: "kavringtinden",
    intro:
      "Lyngseidets hustopp, og 1252 høydemeter rett opp fra fjorden. Rygg opp, Østrenna ned — den store, østvendte renna nord for toppen samler den beste snøen på fjellet og holder på den langt ut i mai.",
    ascent: [
      "Fra parkeringen ved Eidebakken, 62 moh, følger du skogsveien opp østsida av Gjerdelva. Du passerer Rødsteinen i bjørkeskogen rundt 200 moh og fortsetter opp ryggen øst for elva. Ruta krysser aldri Gjerdelva — går du over vann, har du gått feil.",
      "Du går forbi Skihytta på 317, og skogen slipper taket ved 320 moh. Mellom Rødsteinen og Skihytta må du gjennom et grunt søkk før stigningen tar seg opp igjen, og terrenget blir først ordentlig oversiktlig rundt 400. Skogsveiene fra Karnes, Solhov, Marieslett og Jensbakk kommer opp på den samme hylla, så hvilken du velger nede i bygda spiller mindre rolle. Herfra legger du kursen vestover mot nordøstryggen og kommer opp på kammen rundt 780 moh.",
      "Videre følger du ryggen sørover, på eller like øst for kammen. Mellom 900 og 950 moh reiser østsida seg i partier over 30 grader, og bratteste enkeltsteget på linja måler 33,5. Vestsida er ikke et alternativ: der faller det 40 til 80 høydemeter per hundre meter rett ned mot Gjerdelva.",
      "Toppryggen smalner inn de siste hundre meterne, og rundt nitti meter før varden tar et grunt skar tilbake et par høydemeter. Her henger skavlene ut mot øst, over Østrenna: kammen faller 30 til 41 grader på østsida og 21 til 31 på vestsida. Skift side i god tid og gå det siste stykket vest for skavlekanten, fram til varden på 1289.",
    ],
    descent: [
      "Den store renneformasjonen rett nord for toppen er nedkjøringen. Den heter Østrenna og ligger øst for kammen. De øverste to hundre metrene måler 33 til 42 grader, 37 i snitt, og renna er vid nok til nesten å være en flanke — den ligger i le, fylles av fokksnø mens det blåser på toppryggen, og har som regel den beste snøen på fjellet. Vel nede skrår du nordover tilbake på oppstigningsruta.",
      "Vanligste feil: å ta sats utfor skavlen rett fra toppen, og sent på dagen. Den store skavlen over renna slipper i vårsola nesten hvert år, og løsner den, går den i renna du står i. Renna vender øst og får sola først av alt her oppe, så kjør tidlig — og gå inn gjennom det grunne skaret nitti meter nord for varden. Det er det naturlige innsteget, den samme renna du kommer bort i like før toppen.",
      "Vil du ikke inn i renna, kjører du ned nordøstryggen du kom opp. Den er brattest mellom 900 og 800 moh, 24,5 grader i snitt, og er ofte avblåst; regn med hard snø der ryggen er smalest.",
    ],
    avalanche: [
      {
        title: "Ruta opp",
        body: "Nordøstryggen er det slakeste av de dokumenterte linjevalgene på fjellet, men flat er den ikke. Østsida under kammen går i partier over 30 grader mellom 900 og 950 moh, bratteste hundremeteren på selve linja ligger mellom 800 og 900 moh på 24,5 grader i snitt, og bratteste steget måler 33,5. Ryggen er ofte avblåst hele veien opp — det gir hard snø på kammen og fokksnø i lesidene rett ved siden av.",
      },
      {
        title: "Terrenget rundt",
        body: "Østrenna ligger øst for kammen nord for toppen og holder 37 grader i snitt over de øverste to hundre metrene, med skavl over hele hodet; lokalkjente regner med at den går hvert år når den største skavlen slipper i vårsola. Skavlene på toppryggen henger ut mot øst, ikke mot vest — det er østsida av kammen som er den bratte, 30 til 41 grader mot 21 til 31 på vestsida. Vest for nordøstryggen faller terrenget 40 til 80 høydemeter per hundre meter ned mot Gjerdelva. Sør for varden ligger flanken på 29 grader i snitt og opp mot 34, sørøstsida på 36 til 39.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade. Oppstigningen er ofte avblåst fra skoggrensa og opp, så ha stegjern i sekken.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,195 L58,185 L82,181 L106,181 L135,178 L154,172 L183,164 L202,161 L222,153 L246,147 L270,137 L289,130 L313,121 L337,113 L361,110 L385,110 L409,103 L433,91 L449,81 L467,72 L486,61 L504,52 L520,44 L534,34 L553,28 L577,25 L600,18",
      startLabel: "62 moh",
      endLabel: "1289 moh",
      distanceLabel: "5,6 km",
      caption: "1252 høydemeter fra Eidebakken til varden; bratteste hundremeteren ligger mellom 800 og 900 moh, 24,5 grader i snitt.",
    },
  },
  fagerfjellet: {
    slug: "fagerfjellet",
    intro:
      "947 høydemeter og 4,30 km fra skolen på Fagernes til toppen på 957 — en populær og lett tilgjengelig KAST 1-tur med tidlig snø, der ingen hundremeter måler mer enn 17,2 grader og det bratteste sammenhengende partiet er 25,6, nede i skogen. Faren står på én side: skavlene mot nordøst bygger ut over vegger som måler over 70 grader i de bratteste vinduene. De fleste snur ved varden på 871, sier kilden selv — toppen ligger et småkupert stykke lenger inn.",
    ascent: [
      "Fra parkeringa på vestsida av skolen på Fagernes — 20,7 moh på flata, ved E8/fv. 91 i Ramfjorden. Du runder skoleområdet, opp den dyrka marka og inn i skogen med kurs for punkt 459. Beltet fra 100 til 200 moh er turens bratteste, 17,2 grader over 361 meter grunn, og det bratteste sammenhengende partiet ligger her: 25,6 grader mellom 193 og 215 moh. Skogen slutter på 519 moh etter 2,16 km, med åpent område fra 528.",
      "Over skoggrensa svinger du østover langs den naturlige forsenkningen: 16,4 grader fra 500 til 600 moh og 16,3 fra 600 til 700, så flater det ut — 8,5 og 8,4 grader over beltene fra 700 til 900, den brede ryggen andrekildene beskriver. Varden på 871 er der de fleste snur, og utsikten over Ramfjorden er allerede hel.",
      "Vil du videre går det i småkupert terreng mot 912 på vestsida og opp den siste stigningen — 12,8 grader i beltet over 900 — til toppen på 957. Fri Flyts publiserte GPS-punkt leser 956,1 på DTM1, og toppsøket løser 957,3 mot publiserte 957.",
    ],
    descent: [
      "Ned samme vei. Vestsiden er målt slak — 14,6 grader i snitt over 500 meter med 17,8 som bratteste 60-metersvindu — og forsenkningen og skogen gir jevn kjøring hele veien til den dyrka marka.",
      "Henrikskaret er kildens KAST 3-alternativ fra Fagerelvas utløp, med 30–35 grader mellom 660 og 740 moh gjennom tett skog inn i skardet. Det hører til stabile dager — og det er ikke linja på dette kortet.",
      "Den andre dokumenterte ruta går inn Henrikskaret fra utløpet av Fagerelva: 929 høydemeter på 3,09 km, mot normalrutas 947 på 4,30 — samme fjell på to tredjedeler av lengden. Skaret selv er registerført og leser 596 moh der linja passerer. Fri Flyt setter ruta til KAST 3 – Komplekst mot normalrutas KAST 1, og skriver at det er partier på 30–35 grader mellom 660 og 740 moh; bratteste steget på linja måler 30,0 grader mellom 340 og 360.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, bratteste punkt under 27 grader — og linja holder det: 25,6 grader på det bratteste, i skogen. Over skoggrensa er ryggen bred og slak. Dette er turen for dager da varselet sier at bratt terreng ikke er stedet å være.",
      },
      {
        title: "Skavlene",
        body: "Kildens faremoment, og målingen sier hvor alvorlig det er: nordøst- og østsiden faller 53,2 og 48,6 grader i snitt, med 71,2 og 70,4 grader som bratteste 60-metersvinduer 60 til 140 meter ut fra toppunktet. Skavlene bygger ut over den kanten. Hold avstand til kanten mot nordøst hele veien langs ryggen — i flatt lys er det den ene regelen turen har.",
      },
      {
        title: "Før du går",
        body: "Fagerfjellet ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen november–mai er Fri Flyts, og tidlig snø er en del av fjellets rykte. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L28,196 L50,189 L76,179 L94,170 L113,162 L126,159 L145,150 L170,142 L201,133 L220,127 L234,122 L258,118 L282,107 L301,103 L320,94 L339,85 L353,77 L377,69 L396,63 L420,60 L446,54 L476,47 L498,41 L521,39 L540,35 L559,32 L572,26 L596,19 L600,18",
      startLabel: "21 moh",
      endLabel: "957 moh",
      distanceLabel: "4,3 km",
      caption: "947 høydemeter og 4,30 km fra Fagernes om punkt 459 og varden på 871, med skoggrensa på 519 moh og det bratteste — 25,6 grader mellom 193 og 215 moh — nede i skogen.",
    },
  },
  "hesten-segla": {
    slug: "hesten-segla",
    intro:
      "Senjas korteste store tur: 512 høydemeter fra Fjordgård opp en bred, sørøstvendt flanke, med Segla rett foran deg fra toppryggen. To til fire timer fra bilen og tilbake.",
    ascent: [
      "Fra avgiftsparkeringen i Fjordgård, 48 moh, går du opp veien som heter Segla og videre opp den gamle alpinbakken. Den første halvkilometeren er flat, og stien er fint kloppet der bakken er våt. Ved øvre Fjordgård, 49 moh, står skiltet der den merka stien tar av — det er her turen egentlig begynner.",
      "Stien stiger jevnt gjennom bjørka i Fjordgardlia og over et par bekker, og skogen slipper ved 204 moh. Derfra ligger hele flanken åpen. Bratteste hundremeteren er 300 til 400 moh, og den ligger på 20 grader i snitt: bredt, jevnt og uten brudd.",
      "Ved 440 moh kommer du opp i skaret mellom Hesten og Stavelitippen. Her svinger du vestover inn på østryggen. Den går nesten flatt den første hundremeteren før den begynner å stige, og toppsteget er kort og krast: femti høydemeter på drøye femti meter, rundt 40 grader, stein og klyv. Sett igjen skiene i skaret. Toppen på 556 tas til fots.",
    ],
    descent: [
      "Ned igjen er samme vei. Fra skaret faller flanken jevnt i fallinja mot Fjordgård, fire hundre høydemeter uten brudd, og du renner ut i bjørka og videre ned den gamle alpinbakken til bilen.",
      "Vanligste feil: å ta på seg skiene på toppen. Rett vest for varden faller fjellet 435 høydemeter på 160 meter — de første seksti på 77 grader — og videre rett i Medfjorden, og østryggen er stein under snøen. Klikk inn i skaret, ikke før.",
      "Den andre feilen kommer i dårlig sikt. Fra skaret heller terrenget nordover også, ned mot Korkedalen, og det er feil side av fjellet. Rett sørover er heller ikke veien hjem: der legger du deg ut på hylla ved Seggelskaret, og under den stuper fjellet 60 grader i Medfjorden. Fallinja mot Fjordgård peker sørøst fra skaret og dreier mot øst under skoggrensa. Følg den, så kommer du ut i bygda av deg selv.",
    ],
    avalanche: [
      {
        title: "Ruta opp",
        body: "Flanken er bred og jevn. Bratteste hundremeteren, 300 til 400 moh, ligger på 20 grader i snitt, og bratteste enkeltsteget på linja måler 31,5. Det er ingen bergbånd på selve linja. Flanken vender sørøst der den er brattest og dreier mot øst lenger nede, så den får sola tidlig på dagen — utpå ettervinteren blir de gode timene korte.",
      },
      {
        title: "Terrenget rundt",
        body: "Fra vest rundt til sør finnes det ikke utløp: rett vest for varden går fjellet 435 høydemeter ned på 160 meter og rett i Medfjorden, og sørvest og sør er like bratt. Nordvest er derimot slakt — en rygg som holder seg over 480 moh — så det er vest- og sørsida du skal holde deg fra. Toppknausen og østryggen er eksponert stein, ofte isete. Nord for skaret heller terrenget mot Korkedalen, bort fra bygda.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sør-Troms på varsom.no. Ta med sender/mottaker, søkestang og spade. Toppknausen er ofte islagt, så ha stegjern med hvis du vil helt opp — og vær innstilt på å snu i skaret.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,200 L35,200 L58,200 L82,199 L105,199 L128,198 L149,191 L162,186 L176,179 L184,179 L198,173 L220,170 L242,166 L265,158 L289,151 L312,141 L336,134 L348,131 L371,123 L383,119 L395,113 L418,101 L428,96 L435,92 L449,85 L465,78 L480,72 L490,67 L501,60 L512,56 L536,47 L548,43 L569,36 L580,29 L595,20 L600,18",
      startLabel: "48 moh",
      endLabel: "556 moh",
      distanceLabel: "2,3 km",
      caption: "512 høydemeter fra Fjordgård; flanken er 20 grader i snitt der den er brattest, mellom 300 og 400 moh.",
    },
  },
  keipen: {
    slug: "keipen",
    intro:
      "840 høydemeter fra Medfjordbotnvatnan, og en tur som avgjøres i den øvre tredjedelen: skåla sør for toppen er både løsne- og utløpsområde, og henget opp fra den er brattere enn ruta selv. Friflyt setter turen til KAST 2 — utfordrende, med skavler på toppryggen.",
    ascent: [
      "Start på grusparkeringa ved Medfjordbotnvatnan langs Fv862, 102 moh. Følg Keipelva nordover i jevnt stigende terreng til rundt 225 moh. Skogen slipper taket ved 282 moh, og over 297 er du i åpent terreng resten av turen.",
      "Drei mot vestnordvest og følg fjellsida oppover forbi 385 moh. Rundt 470 moh flater det ut i et parti som strekker seg nesten en kilometer med 6 grader i snitt — den eneste pusten på turen — før terrenget stiger inn i den store skåla sør for toppen på rundt 595 moh.",
      "Fra skåla på rundt 595 moh skal du ikke rett nord opp fallinja. Målt rett nordover holder bakken 29 til 36 grader de første 180 meterne, og mellom 713 og 814 moh måler den 38 til 52. Sporet legger seg i stedet østover i stigende skrå til rundt 670 moh og tilbake mot vestnordvest opp på skulderen ved 813 moh; slik holder linja seg under 30 grader. Bratteste hundremeteren på ruta ligger mellom 800 og 900 moh og måler 22,2 grader i snitt; bratteste sammenhengende parti på linja er 28,1 grader.",
      "Fra skulderen følger du ryggformasjonen sørvest for toppen nordover til varden på 938 moh. De øverste hundre høydemeterne er ofte vindherjet og harde. Hold deg på sørsida av ryggen — nordsida faller 60 grader rett under egget, og det er der skavlene henger.",
    ],
    descent: [
      "Ned samme vei: sørover langs ryggen, ned på skulderen og ut den skrå linja mot skåla, og derfra fjellsida mot Keipelva og parkeringa. Ruta selv måler 28,1 grader på det bratteste. Legger du deg i fallinja rett sør fra skulderen i stedet, står du i det partiet som måler 38 til 52 grader ned til 713 moh, med skåla under som samler alt som løsner.",
      "Vanligste feil: å legge seg for langt nord på ryggen fordi kanten ser ut til å gi bedre snø. Rett nord for toppen faller terrenget 60 grader og deretter 52,5 — skavlene ligger nordover, og de bygger seg opp gjennom hele vinteren. Sørsida ned i skåla er 32 grader, og det er den sida ruta bruker.",
      "Friflyt nevner også en litt brattere variant ned en liten dalformasjon fra ryggen. Den er ikke målt opp her, og sørsida har partier på 38 til 52 grader — velger du den, er det en egen vurdering, ikke den samme som normalruta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skåla sør for toppen er både løsneområde og utløpsområde, og du må gjennom den både opp og ned. Selve linja er slakere enn terrenget rundt: bratteste sammenhengende parti måler 28,1 grader og bratteste hundremeter, 800 til 900 moh, 22,2 grader i snitt. Det er den skrå føringa østover som gir de tallene. Fallinja rett nord opp fra skåla måler 38 til 52 grader mellom 713 og 814 moh, og den ligger over deg hele veien opp henget.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nordsida av toppen faller 60 grader rett under egget og deretter 52,5, og skavlene henger nordover. Toppryggen skal gås på sørsida. De øverste hundre høydemetrene er ofte avblåste og harde, noe som gjør skavlkanten vanskeligere å lese enn den ville vært i mykt føre.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sør-Troms på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L17,197 L40,188 L65,179 L89,172 L113,164 L136,154 L160,148 L172,141 L184,135 L208,126 L223,122 L247,121 L271,121 L295,121 L322,119 L343,117 L363,109 L382,100 L398,93 L420,91 L445,89 L465,82 L485,72 L506,63 L525,56 L545,44 L564,36 L581,28 L596,19 L600,18",
      startLabel: "102 moh",
      endLabel: "938 moh",
      distanceLabel: "3,4 km",
      caption: "840 høydemeter og 3,40 km fra Medfjordbotnvatnan; ruta går skrått opp fra skåla og holder 28,1 grader der fallinja ved siden av måler over 40.",
    },
  },
  husfjellet: {
    slug: "husfjellet",
    intro:
      "640 høydemeter og 3,29 km fra kirka på Skaland til Husfjellet, fjellet Fri Flyt kaller «det fjellet i Norge som gir mest utsikt for minst innsats». Turen starter i fjæra på 3 moh og holder seg slak hele veien: bratteste hundremetersbeltet måler 17,1 grader mellom 100 og 200 moh, og bratteste sammenhengende parti 19,6 — godt innenfor Fri Flyts «Bratteste punkt: Under 27 grader». Faren ligger ikke i ruta, men i den siste eggen og i skavlene.",
    ascent: [
      "Fra kirka på Skaland, 3 moh, på fv. 862 — hovedveien til Senjahopen og Mefjord, brøytet hele året. Linja følger Dronningstien slik kilden sier, og den er kartlagt: stikjeden fra parkeringa til varden ligger i OSM, og korridoren er festet til den. De første hundre høydemeterne er det bratteste turen har — beltet fra 100 til 200 moh måler 17,1 grader over 335 meter grunn, og det bratteste sammenhengende partiet ligger her: 19,6 grader mellom 124 og 140 moh, 0,63 km ute. Det er altså i skogen, ikke på fjellet, at det bratte er.",
      "Skogen slutter på 209 moh etter Kartverkets klasser, med åpent område fra 221, og skoggrensa kommer alt 0,9 km ute. Over den slakker det av: beltet fra 200 til 300 moh måler 11,0 grader og beltet fra 300 til 400 bare 6,0 over 1 035 meter grunn. Det er den rydda skogstraséen og Sommerdalen, og det er her turen er en spasertur.",
      "Sommerdalhaugen er holdepunktet kilden gir, og den stemmer: prøvepunktet på stikjeden leser 327,6 moh mot de «327 moh» Fri Flyt oppgir. Herfra går ryggen jevnt stigende — 13,9 grader fra 400 til 500 moh og 15,5 fra 500 til 600 — mot toppen.",
      "Varden på 632 moh. Fri Flyt oppgir «785 høydemeter», som er mer enn hele fjellet er høyt; kortet bærer den rutede stigninga på 640. Den siste eggen ut mot toppunktet er ofte avblåst, og da krever den gode forhold — kilden sier det rett ut, og målinga sier hvorfor: nordøstsida faller 36,8 grader i snitt med 71,4 grader som bratteste 60 meter bare 50 til 110 meter ut, og østsida 35,8 grader med 67,9 grader 20 til 80 meter ut.",
    ],
    descent: [
      "Ned samme traséen. Fri Flyt er utvetydig om alternativene: «Ikke la deg friste å velge annen rute ned fra toppen. Utsatt terreng.» Målingene sier hva han mener — fra varden er bare sørvest, sør og vest slake nok til å kalles kjøring, og nordøst, øst og nord faller 36,8, 35,8 og 28,0 grader i snitt med 71,4, 67,9 og 58,3 grader som bratteste 60 meter.",
      "Kilden nevner én eneste variasjon: rett ned mot sør fra pausesteinen for noen ekstra høydemeter i åpen skog, og så felle på igjen opp til ryggen på Sommerdalhaugen. Sørsveipet fra varden måler 20,2 grader i snitt, så det er reelt — men han advarer selv om at det blir «mye knot tett skog» om du holder fram nedover.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt gir turen KAST 1 – Enkelt og «Bratteste punkt: Under 27 grader», og den ferdige linja holder seg innenfor: ingen hundremeter måler mer enn 17,1 grader i snitt, og bratteste sammenhengende parti er 19,6 grader mellom 124 og 140 moh. Læringspunktet hans er å legge spor under 25–30 grader og lese utløpsområdene gjennom Sommerdalen, og det er nettopp den øvelsen terrenget her er laget for.",
      },
      {
        title: "Eggen og skavlene",
        body: "Faremomentet Fri Flyt oppgir er «Skavler», og han er presis om hvor: hengeskavler på ryggen mot nord, og «Siste egga ut mot toppunktet er ofte avblåst og krever gode forhold da begge sidene her er bratte.» Målinga bekrefter begge sider — nordøst 36,8 grader i snitt med 71,4 grader som bratteste 60 meter 50 til 110 meter ut, øst 35,8 med 67,9 grader 20 til 80 meter ut, og nord 28,0 med 58,3 grader 60 til 120 meter ut. En egg med det på begge kanter er ikke stedet å være når den er avblåst.",
      },
      {
        title: "Utløpsområdene",
        body: "Kilden navngir dem: utløpsområder opp mot Litje Brusen og Store Brusen. Registeret har Storbrusen som fjell 1,7 km øst for varden, og de ligger ikke på ruta — men de ligger i det samme fjellsida-systemet, og Fri Flyt ber deg observere dem på vei opp gjennom Sommerdalen.",
      },
      {
        title: "Før du går",
        body: "Husfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts egen. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,196 L47,194 L65,189 L82,181 L102,170 L118,163 L136,153 L155,144 L180,133 L192,130 L212,124 L237,116 L245,114 L270,113 L286,112 L311,110 L335,112 L352,111 L368,108 L385,101 L409,96 L425,89 L442,81 L458,77 L475,71 L492,63 L512,53 L524,50 L540,42 L559,33 L578,24 L598,19 L600,18",
      startLabel: "3 moh",
      endLabel: "632 moh",
      distanceLabel: "3,3 km",
      caption: "640 høydemeter og 3,29 km fra Skaland, med det bratteste — 19,6 grader mellom 124 og 140 moh — nede i skogen, 0,63 km ute.",
    },
  },
  breitinden: {
    slug: "breitinden",
    intro:
      "Senjas høyeste, 1049 høydemeter fra rasteplassen ved fjorden. Skituren slutter på skulderen 763 moh; de siste 244 høydemeterne er eksponert klyving på sørvestryggen, og det er den avslutningen som gir turen grad 4.",
    ascent: [
      "Start på rasteplassen i Svarthola langs Fv862, 30 moh, knappe seks kilometer øst for Senjahopen. De første to hundre høydemeterne går rett opp til nordenden av Svartholvatnet på 207 moh, og derfra østover over ryggen mellom vatnet og Breitindvatnet — et parti på rundt 400 moh der linja legger seg flatt før den stiger igjen. Ved Breitindvatnet følger linja nordbredden, over 467 moh og 500 moh, i stedet for å gå rett over isen. Den gjorde det siste inntil nylig: 315 meter på vatnet på 474 moh, opptil 40 meter fra land, under den flanken guiden selv kaller en terrengfelle. Vatnet er naturlig og uregulert, men det finnes ingen skirutebeskrivelse som sender deg ut på det, og her er vatnet så smalt at land ligger 80 meter unna.",
      "Fra nordøstsida av Breitindvatnet på 481 moh begynner vestflanken. Nederst er den slak — rundt 24 grader opp til 550 moh og 29 videre til 620 — men over det bratner den: 36 grader i snitt mellom 620 og 680 moh, 41 mellom 680 og 720, og rett under skulderen måler fallinja 50 til 59 grader. Sommerbeskrivelsen kaller det samme partiet smale og utsatte berghyller, og vatnet ligger under hele henget. Hundremeteren fra 600 til 700 moh måler 22,1 grader i snitt, men den bratteste på ruta er toppblokkas egen, 900 til 1000 moh med 22,7; bratteste sammenhengende parti på linja er 45,9 grader — de siste tretti meterne opp på blokka.",
      "Skiene settes igjen på skulderen sørvest for toppblokka, 763 moh. Derfra til toppen er det 44,4 grader over 249 meter, og eggen over 800 moh måler 54 grader i det bratteste hundremetersvinduet og over 60 i de korteste stega. Det er ikke skispor. De siste 244 høydemeterne er utsatt klyving på sørvestryggen med korte eksponerte parti — hold deg på sørvestsida av kammen. Toppen du står på er den sørøstre, 1007 moh; SSR-punktet som heter Breitinden ligger 0,46 km nordvest og er 24 meter lavere.",
      "Ingen publisert skiruteskildring finnes for Breitinden — kildene beskriver normalruta i sommerform. Innmarsjdalen er den samme uansett, og det finnes ingen annen farbar veg inn fra Fv862, men det betyr at linja over skulderen er terrengmodellens og ikke en gjengivelse av en skrevet skirute.",
    ],
    descent: [
      "Ned igjen klyver du sørvestryggen tilbake til skulderen, tar på skiene og kjører vestflanken ned til Breitindvatnet. Flanken er den mest alvorlige delen av turen. De første hundre høydemetrene under skulderen er 50 til 59 grader, deretter 36 til 41 ned til rundt 620 moh, og først under det slakner det til 24 til 29. Vatnet ligger som terrengfelle under hele henget.",
      "Vanligste feil: å tro at nordsida er en veg ned fordi den ser kortere ut fra toppen. Nord- og nordøstsida faller 53 til 70 grader rett under egget, og det er der skavlene henger. Fra vatnet følger du oppstigningen tilbake vestover over ryggen til Svartholvatnet og ned til Fv862 — de nederste to hundre høydemeterne er de brattest kjørte på hjemvegen, 17 til 20 grader i snitt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Vestflanken opp fra Breitindvatnet er 24 til 29 grader nederst, 36 til 41 grader over 620 moh, og fallinja rett under skulderen måler 50 til 59 — med vatnet som terrengfelle under hele henget — det er turens skredterreng, og du må gjennom det både opp og ned. Bratteste hundremeter på linja, 600 til 700 moh, måler 22,2 grader i snitt. Over skulderen går ruta over i klyving: eggen måler 54 grader i det bratteste hundremetersvinduet, og 763 moh til toppen er 44,4 grader over 249 meter.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nord- og nordøstsida av toppen faller 53 til 70 grader rett under egget, så skavlene ligger der. Hold deg på sørvestsida av ryggen hele veien. Merk også at kildene beskriver denne ruta i sommerform: linja over skulderen er lagt etter terrengmodellen, og over 850 moh skal alt regnes som klyving, ikke skiterreng.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sør-Troms på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,190 L48,180 L63,172 L83,167 L103,166 L126,167 L154,158 L186,144 L211,137 L243,129 L269,132 L288,124 L314,119 L346,115 L371,115 L390,112 L410,106 L435,95 L458,87 L474,77 L491,67 L509,58 L531,49 L557,41 L572,34 L590,26 L600,18",
      startLabel: "30 moh",
      endLabel: "1007 moh",
      distanceLabel: "4,2 km",
      caption: "1031 høydemeter og 4,22 km fra Svarthola; skiene blir igjen på skulderen 763 moh, 244 høydemeter under toppen.",
    },
  },
  skolpan: {
    slug: "skolpan",
    intro:
      "607 høydemeter og 2,31 km fra fv. 862 i Krokelvdalen til Skolpan — den korteste turen i samlingas nordlige hjørne, og en av de slakeste. Bratteste hundremetersbeltet måler 17,7 grader og bratteste sammenhengende parti 27,1, som er akkurat innenfor Fri Flyts «Bratteste punkt: 27-30 grader». Faren her er ikke ruta, men hengene ved siden av den.",
    ascent: [
      "Fra parkeringa langs fv. 862 i Krokelvdalen, 170 moh. Fv. 862 er hovedveien på ytre Senja og er brøytet hele året; registerpunktet for Krokelvdalen ligger 494 meter unna. Fri Flyt oppgir 580 høydemeter, den routede linja stiger 607 — 27 meter i forskjell, og kortet bærer den routede.",
      "Første biten går gjennom småskogen kilden nevner: beltet fra 100 til 200 moh måler 11,6 grader og beltet fra 200 til 300 13,2. Skogen slutter allerede på 317 moh etter Kartverkets klasser, med åpent område fra 331, og skoggrensa kommer 0,63 km ute — en fjerdedel av turen.",
      "Over skogen stiger det jevnt: 17,7 grader fra 300 til 400 moh og 12,3 fra 400 til 500. Ved 465 moh kommer flata kilden beskriver — «Fra 500 moh. flater det litt ut» — og her dreier linja nordvestover inn på ryggen, akkurat slik den sier.",
      "På ryggen ligger det bratteste turen har: 27,1 grader mellom 693 og 714 moh, 2,03 km ute. Fri Flyt skriver «Mellom 600–740 moh. er det partier som er 27–30 grader», og det er dette partiet. Så er det bare sjarmøretappen bort til høyeste punktet — 777 moh på den klatrede cella mot publiserte 779.",
    ],
    descent: [
      "Ned samme traséen, «med mulige variasjoner etter ønsker og behov», som kilden sier. Det bratteste du kjører er de samme 27,1 gradene mellom 693 og 714 moh, rett under ryggen.",
      "Fra varden er nordvest den klart slakeste sektoren med 6,0 grader i snitt — det er ryggen du kom opp. Vestsida måler 32,2 grader i snitt, nordsida 27,5 med 65,2 grader som bratteste 60 meter bare 30 til 90 meter ut, og nordøstsida 24,1 med 69,2 grader 20 til 80 meter ut. Skillet mellom ryggen og nordsida er sytti grader på under hundre meter.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt gir KAST 1 – Enkelt og «Bratteste punkt: 27-30 grader»; linja måler 27,1 grader som bratteste sammenhengende parti, mellom 693 og 714 moh, og ingen hundremeter holder mer enn 17,7 grader i snitt. Faremomentet kilden oppgir er «Noen små litt bratte», og det er en presis beskrivelse av en linje som er slak i snitt og har et par korte kast.",
      },
      {
        title: "Hengene du skal unngå",
        body: "Kildens egen advarsel gjelder ikke ruta, men terrenget ved siden av den: «Det finnes noen små heng oppover som er 30–40 grader, så les terrenget godt slik at du unngår disse.» Det er derfor linjevalget er hele øvelsen på dette fjellet — utfordringen er «å kunne legge sporet i terreng under 30 grader», og hengene finnes rett ved sporet som holder seg under.",
      },
      {
        title: "Toppen",
        body: "Ryggen fra nordvest er 6,0 grader i snitt, og rett nord for varden faller det 27,5 grader i snitt med 65,2 grader som bratteste 60 meter 30 til 90 meter ut; nordøst måler 24,1 med 69,2 grader 20 til 80 meter ut. Toppen er liten og slak, og kantene er nære.",
      },
      {
        title: "Før du går",
        body: "Skolpan ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts egen. Ingen uavhengig kilde beskriver ruta; Peakbook bekrefter bare høyden. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L35,192 L70,184 L93,176 L116,171 L140,166 L151,160 L173,152 L187,146 L200,140 L222,133 L245,127 L261,121 L285,118 L315,114 L338,106 L362,98 L387,86 L409,76 L432,72 L455,62 L479,54 L502,49 L520,45 L536,37 L550,32 L572,25 L600,18",
      startLabel: "170 moh",
      endLabel: "777 moh",
      distanceLabel: "2,3 km",
      caption: "607 høydemeter og 2,31 km fra Krokelvdalen, med det bratteste — 27,1 grader mellom 693 og 714 moh — oppe på ryggen, 0,28 km før toppen.",
    },
  },
  "tredje-svanfjell": {
    slug: "tredje-svanfjell",
    intro:
      "664 høydemeter og 2,85 km rett fra parkeringslomma i Kaperdalen — «Tredje Svanfjell er en klassiker i Kaperdalen. Fin tur for nyfrelste toppturister, som også er en flott mørketidstur», skriver Fri Flyt, og tallene er enige: bratteste hundremetersbeltet 23,4 grader mellom 500 og 600 moh, bratteste sammenhengende parti 29,9, og linja gir tilbake null høydemeter. Navnet fins ikke i registeret — Svanfjella er uformelt nummererte — men Fri Flyt publiserer sin egen GPS-posisjon for toppen, og den leser 898 i terrengmodellen på meteren.",
    ascent: [
      "Parker i lomma langs veien gjennom Kaperdalen — Fri Flyt skriver «Fv.232», men veien heter i dag fv. 7862 Kaperdalsveien; lomma leser 236 moh, og kildens 660 høydemeter impliserer nøyaktig denne starten. Skogen slutter tidlig, og terrenget åpner seg mot øst.",
      "Første delen går opp mot det lille skaret nord for punkt 504, slik kilden sier — punktet leser 479 og skaret 582 i terrengmodellen. Lia opp dit bærer det bratteste hundremetersbeltet på turen, 23,4 grader i snitt mellom 500 og 600 moh.",
      "Fra skaret stiger terrenget jevnt mot fortoppen — småkupert, med stigning under 30 grader hele veien, og målingen bekrefter det: 29,9 som bratteste sammenhengende parti. Fortoppen kilden setter på 870 leser 862,9.",
      "Fra fortoppen står det igjen om lag 30–40 høydemeter, sier kilden — målt 36. Den nevner et lite fall over fortoppen; linja her går over skuldra på 862,9 og gir ikke tilbake noe målbart — og varden på 899 har Senjas ytterkyst på den ene sida og Ånderdalen på den andre. I desember er dette mørketidsturen kilden lover: kort, åpen og med hjemvei det ikke går an å rote bort.",
    ],
    descent: [
      "Ned samme trasé som opp, med variasjonsrom etter ønske, slik kilden sier. Kjøringa vender vest, hjem mot Kaperdalen — Fri Flyts faktaboks sier S-SØ, men normalruta hans går opp fra vest og ned samme vei, og kortet bærer det målte.",
      "Variasjonsrommet har en kant: sørøstsida faller 56,3 grader på det bratteste bare 180–240 m fra varden, og østsida 43,3 på samme avstand. De hører ikke til denne turen — vestflanken du kom opp er kjøringa, og den er åpen og jevn hele veien ned til lomma. Kilden beskriver selv en brattere variant: «det er mulig å legge linjer mer rett sør ned i gryta sørvest for toppen … terreng som er 30–40 grader … vær også obs på at det her er noen klippepartier». Sveipet er enig — sørvest måler 26,7 grader i snitt med 37,0 som bratteste vindu — og klippepartiene er grunnen kilden selv gir for å la den være.",
      "Null høydemeter å gi tilbake og under tre kilometer hver vei: dette er turen der hele dagen er stigning og kjøring, og derfor klassikeren for førstegangs toppturister — og for desemberdager med to timer lys.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt setter KAST 1 – Enkelt med faremoment «ingen spesielle», og målingen er enig for selve linja: 29,9 grader som bratteste sammenhengende parti, 23,4 som bratteste hundremetersbelte mellom 500 og 600 moh. Det er så snilt som en 660-meterstur kan bli — men KAST 1 er en linjevurdering, ikke et fripass: lia opp mot skaret er bratt nok til å gli i hardt føre.",
      },
      {
        title: "Kantene",
        body: "Alvoret ligger utenfor sporet: sørøstsida faller 56,3 grader på det bratteste 180–240 m fra varden og østsida 43,3 grader på samme avstand. I mørketid og flatt lys er kantene poenget med kompasset — vestflanken du kom opp er eneste kjøresida, og den er grei å finne igjen: ned mot dalen, ikke mot havet.",
      },
      {
        title: "Mørketidsturen",
        body: "Kilden kaller turen «en flott mørketidstur», og desember–mai er hans egen publiserte sesong. Mørketid er sin egen vurdering: to timer dagslys gir lite margin for feil, og et fjell uten spesielle faremoment i mars kan være et navigasjonsfjell i desember. Kort tur og null tilbakegitt høyde er nettopp det som gjør den rett for de mørke ukene — med hodelykt i sekken likevel.",
      },
      {
        title: "Før du går",
        body: "Tredje Svanfjell ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–mai er Fri Flyts egen. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L19,197 L48,186 L67,176 L95,168 L114,160 L142,148 L161,145 L180,143 L209,137 L228,134 L256,133 L275,131 L294,124 L306,117 L323,107 L335,102 L358,91 L378,88 L389,88 L408,83 L427,77 L437,74 L456,65 L477,55 L503,42 L522,34 L541,28 L556,26 L579,22 L598,18 L600,18",
      startLabel: "236 moh",
      endLabel: "899 moh",
      distanceLabel: "2,8 km",
      caption: "664 høydemeter og 2,85 km fra Kaperdalen — skaret nord for punkt 504, fortoppen på 870, og null høydemeter å gi tilbake.",
    },
  },
  lonketind: {
    slug: "lonketind",
    intro:
      "784 høydemeter og 3,06 km fra vannbassenget ved Finnelva til Lonketinden, det høyeste fjellet i sitt område på sørspissen av Senja. Turen er kort og bratt heller enn lang: bratteste hundremetersbeltet måler 23,4 grader mellom 500 og 600 moh, og bratteste sammenhengende parti 30,0 — nettopp det Fri Flyt oppgir som «Bratteste punkt: 30-35 grader (kort parti)», og nettopp der den sier det ligger.",
    ascent: [
      "Fra veienden ved vannbassenget ved Finnelva, 66 moh. Det er den høyeste veienden i dalen, og den forklarer kildens tall: 848 minus 66 er 782, mot de «785 høydemeter» Fri Flyt oppgir. Registerpunktet for Finnelva ligger 170 meter unna.",
      "Første kilometeren er det flate myrterrenget kilden beskriver: beltet fra 0 til 100 moh måler 8,8 grader og beltet fra 100 til 200 bare 8,2 over 720 meter grunn. Skogen slutter på 330 moh etter Kartverkets klasser, med åpent område fra 341, og skoggrensa kommer 1,3 km ute.",
      "Så tar ryggen mot Lonketuva til. Registeret fører Lonketuva som ås på 361 moh, og det er ryggfoten. Beltet fra 200 til 300 moh måler 19,6 grader og beltet fra 400 til 500 20,6 — kilden kaller dette «småkupert med partier på 27–30 grader», og det er de partiene snittet er satt sammen av.",
      "Toppryggen blir gradvis brattere, akkurat som kilden sier, og det korte bratte partiet den lover finnes: 30,0 grader mellom 564 og 588 moh, 2,14 km ute. Fri Flyt skriver «Rundt 550 moh. er det et kort parti som er 30–35 grader» — målingen og kilden peker på de samme tjue høydemetrene.",
      "Over det flater det ut mot varden, slik kilden sier: beltet fra 800 til 900 moh måler 11,6 grader, det slakeste over skoggrensa. 845 moh på den klatra cella mot publiserte 848.",
    ],
    descent: [
      "Ned samme traséen. Det bratte partiet på 30,0 grader mellom 564 og 588 moh er det bratteste du kjører, og det kommer tidlig i nedturen — 0,9 km før du er tilbake på myra.",
      "Fri Flyts eneste advarsel for toppryggen gjelder skavler: «Vær obs på skavler på toppryggen.» Fra varden er nordvest den slakeste sektoren med 18,8 grader i snitt, mens nordøst måler 34,4, sørvest 33,9 og sør 30,2 — dette er en topp som faller bratt i nesten alle retninger, og ryggen er den ene veien som ikke gjør det.",
      "Fra ryggfoten ved Lonketuva er det myra ut igjen, og turen gir bare 5 høydemeter tilbake underveis.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt gir turen KAST 1 – Enkelt, men oppgir samtidig «Bratteste punkt: 30-35 grader (kort parti)» — og det partiet er reelt: 30,0 grader mellom 564 og 588 moh, 2,14 km ute. Resten av linja er slakere; bratteste hundremetersbeltet er 23,4 grader mellom 500 og 600 moh. Læringspunktet kilden gir er å legge sporet under 30 grader og kjenne igjen enkle terrengfeller, og det korte partiet er der du må gjøre det.",
      },
      {
        title: "Toppryggen og skavlene",
        body: "«Vær obs på skavler på toppryggen» er kildens egen advarsel, og målingene sier hva som ligger under dem: nordsida faller 23,7 grader i snitt med 56,5 grader som bratteste 60 meter bare 40 til 100 meter fra varden, østsida 31,5 med 54,1 grader, og sørsida 30,2 med 54,0. Den slakeste sektoren er nordvest med 18,8 grader — men ruta går ikke den veien.",
      },
      {
        title: "Før du går",
        body: "Lonketinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts egen, og den skriver at snøen legger seg litt senere på denne delen av øya. Ingen uavhengig kilde beskriver ruta: Fri Flyt publiserer den på to adresser, og begge bygger på Espen Nordahls «Toppturer i Troms». Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,195 L52,192 L70,189 L96,187 L114,183 L132,181 L148,181 L167,174 L179,169 L193,164 L211,156 L238,146 L250,140 L264,135 L282,131 L308,128 L326,125 L352,116 L370,109 L388,100 L401,93 L421,84 L432,77 L450,70 L475,59 L490,55 L511,47 L529,41 L556,30 L571,24 L584,23 L600,18 L600,18",
      startLabel: "66 moh",
      endLabel: "845 moh",
      distanceLabel: "3,1 km",
      caption: "784 høydemeter og 3,06 km fra Finnelva, med det bratteste — 30,0 grader mellom 564 og 588 moh — nettopp der kilden sier det korte partiet ligger.",
    },
  },
  hattfjellet: {
    slug: "hattfjellet",
    intro:
      "829 høydemeter og 3,97 km fra Grøtavær — lengst fra ferja, med utsikt mot Andøya — til Hattfjellet: toppen løser 857,2 mot publiserte 856. Traktorveien opp Bjørndalen, venstre der det flater, og sørsida til topps; kilden gir sørsida 30–35 grader i nedkjøringa. KAST 2 – Utfordrende med alpinøks og stegjern. Grad 3.",
    ascent: [
      "Fra veien til skytebanen på Grøtavær — 81 moh der linja tar til — er det bratt fra første meter: beltet fra 0 til 100 måler 26,0 grader over den korte kneika, før traktorveien i Bjørndalen tar over på 121 moh.",
      "Traktorveien opp Bjørndalen til øvre Bjørndalen på 339 — skoggrensa ligger på 378 etter 2,12 km — og venstre der terrenget flater, på 706 moh slik korridoren står.",
      "Sørsida til topps fra 800: det bratteste enkeltpartiet på linja, 31,4 grader, ligger allerede mellom 351 og 371 moh nede i lia, og beltet fra 500 til 600 er det bratteste i snitt med 21,6. Varden på 857 har Andøya i horisonten.",
    ],
    descent: [
      "Sørsida er kildens nedkjøring: 30–35 grader. Sydrenna (35–40), østsida med det trange partiet, og nordlinjene Goldfishrenna og Frogman — 45–50 grader og rappell fra skavlen — er variantene for andre dager og andre folk.",
      "Flankemålinga er tydelig på hvor du ikke skal: østflanken måler 66,6 grader og SE 69,3 i sine bratteste vindu, mens V og NV er de slake sidene med 9,1–10,7 i snitt — og sørsida ruta bruker, 12,0.",
    ],
    avalanche: [
      {
        title: "Sørsida",
        body: "Kilden gir nedkjøringa 30–35 grader — skredterreng når snøen er ustabil. Det bratteste enkeltpartiet på modellens linje ligger lavt, 31,4 grader mellom 351 og 371 moh i skogslia — heng som må vurderes også på vei opp.",
      },
      {
        title: "Nord og øst",
        body: "Goldfishrenna og Frogman i nord måler 45–50 grader og krever rappell fra skavlen; østflanken leser 66,6 og SE 69,3 i sine bratteste vindu. Normalruta har ingen grunn til å nærme seg noen av dem.",
      },
      {
        title: "Før du går",
        body: "Hattfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,190 L42,189 L76,188 L96,185 L124,186 L144,189 L164,192 L189,187 L205,178 L225,167 L246,160 L267,148 L290,140 L310,138 L325,128 L344,117 L368,105 L385,97 L402,87 L416,78 L430,70 L450,60 L477,54 L491,46 L518,40 L545,31 L572,25 L595,20 L600,18",
      startLabel: "81 moh",
      endLabel: "857 moh",
      distanceLabel: "4,0 km",
      caption: "829 høydemeter og 3,97 km fra Grøtavær: traktorveien opp Bjørndalen fra 121, venstre der det flater på 706 — og sørsida til varden på 857, med utsikt mot Andøya.",
    },
  },
  stortussen: {
    slug: "stortussen",
    intro:
      "1024 høydemeter og 5,55 km fra Dale til Stortussen: toppsøket løser 944,8 der kilden skriver 941. Sommerstien til Storvatnet og Trollvatnet, det slakeste terrenget opp og ryggen nordover — og et topparti som krever ekstra fokus: ski kan settes igjen, og 30 m tau nevnes for vanskelige forhold. KAST 2 – Utfordrende med alpinøks og stegjern. Grad 3, i den tunge enden.",
    ascent: [
      "Fra Dale på 58 moh følger du sommerstien nordover — 294 moh der linja står i den — og passerer Trollvatnet på land på østbredden, 337 moh. Skoggrensa kommer allerede på 311 etter 1,67 km, og beltet fra 300 til 400 måler 4,1 grader over nesten halvannen kilometer vann og myrer.",
      "Opp der terrenget er slakest, mellom høydene på 406, og inn på ryggen fra 587: ryggen reiser seg der, men det bratteste enkeltpartiet på linja, 43,9 grader, er et fall ned i et søkk lenger nord, fra 649 til 615 moh.",
      "Ryggen nordover — 740 moh der korridoren peker mot varden — og sluttpartiet som krever ekstra fokus: ski kan settes igjen, og kilden nevner 30 m tau og litt utstyr for vanskelige forhold. Beltet fra 800 til 900 er det bratteste i snitt med 18,9 grader; varden står på 945.",
    ],
    descent: [
      "Sør er den slake sida: flankemålinga gir 20,0 grader i snitt der sydryggen kommer, mot 46,1 i nord — med 66,5-vindu 30–90 m ut — og 69,3 mot nordøst. Nedkjøringsvariantene måler 35–40 grader (nordrenna og østsida) og opp mot 50 øverst på vestsida: vurder snøen før valg.",
      "Linja gir tilbake 137 av de 1024 meterne den vinner — undulasjonen langs vannene og ryggen, som også bærer Fri Flyts 1080 høydemeter. Regn hjemturen som kupert: felle av og på langs Trollvatnet og Storvatnet før sporet ned til Dale.",
    ],
    avalanche: [
      {
        title: "Toppartiet",
        body: "Toppstøtet krever ekstra fokus, sier kilden — ski kan settes igjen, og 30 m tau med litt utstyr nevnes for vanskelige forhold. Nordflanken måler 46,1 i snitt og nordøst har et 69,3-vindu: kom fra sør, og bli der.",
      },
      {
        title: "Variantene",
        body: "Nordrenna og østsida måler 35–40 grader og vestsida opp mot 50 øverst — skredterreng som krever et bevisst valg av dag. Sydryggen, med 20,0 i snitt fra varden, er linja med minst eksponering opp og ned.",
      },
      {
        title: "Før du går",
        body: "Stortussen ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,198 L54,186 L83,172 L107,159 L131,155 L156,151 L175,148 L200,147 L226,144 L253,143 L282,142 L311,138 L326,128 L350,113 L371,103 L387,90 L402,77 L420,69 L436,82 L454,91 L479,80 L493,72 L512,65 L538,58 L556,45 L576,33 L600,18",
      startLabel: "58 moh",
      endLabel: "945 moh",
      distanceLabel: "5,6 km",
      caption: "1024 høydemeter og 5,55 km fra Dale: sommerstien til 294, Trollvatnet på land på 337 — og ryggen nordover fra 587, med det bratteste enkeltpartiet, 43,9 grader, ned i et søkk fra 649 til 615 moh.",
    },
  },
  litletussen: {
    slug: "litletussen",
    intro:
      "765 høydemeter og 4,09 km fra Dale til Litletussen — registeret skriver Litjetussen, kilden Litletussen, og toppen løser 795,0 mot publiserte 796. Sommerstien mot Storvatnet, rundt vatnet på land, glissen skog nordøst og sørryggen som slakeste inngang. KAST 2 – Utfordrende med alpinøks og stegjern; første henget i nedkjøringa er brattere enn 30 grader. Grad 3.",
    ascent: [
      "Fra Dale på 58 moh går sommerstien mot Storvatnet, og linja runder vatnet på land på 274 moh — kilden krysser isen, linja holder land. Myrene nordøst ligger på 262, og beltet fra 200 til 300 måler 3,1 grader over halvannen kilometer nesten flatt.",
      "Nordøst gjennom glissen skog — skoggrensa på 347 etter 2,61 km — og utenom skredterrenget i sørflanken slik kilden ber om: beltet fra 300 til 400 er det bratteste i snitt med 18,9 grader, opp mot lia på 461.",
      "Sørryggen fra 689 er den slakeste inngangen til toppen på 795: det bratteste enkeltpartiet herfra måler 22,4 grader, mellom 679 og 692 moh — rett under ryggfestet. På hele linja er det bratteste 22,8 grader, nede på stien mellom 127 og 146 moh.",
    ],
    descent: [
      "Første henget i nedkjøringa er brattere enn 30 grader, sier kilden — unntaket på en linje der 20–30-terrenget ellers tar over. SE/S/SV fra toppen, der ruta går, måler 16,6–27,2 grader i snitt.",
      "Vestsida — 30–40 grader sammenhengende — er klassa Komplekst hos kilden og en annen linje. Og NE-flanken måler 67,3 grader i vinduet 400–460 m ut: sørflankens skredterreng har en tvilling mot nordøst. Hold ryggen og skogen du kom opp.",
    ],
    avalanche: [
      {
        title: "Sørflanken",
        body: "Kilden ber deg unngå skredterrenget i sørflanken på vei opp — linja legger seg nordøst i glissen skog i stedet. Første henget i nedkjøringa er brattere enn 30 grader; resten av linja måler 22,8 på det bratteste enkeltpartiet.",
      },
      {
        title: "Nordøst",
        body: "NE-flanken måler 67,3 grader i vinduet 400–460 m ut fra toppen — en like alvorlig tvilling til sørflanken. Ruta berører ingen av dem: SE/S/SV, der linja går, måler 16,6–27,2 i snitt.",
      },
      {
        title: "Før du går",
        body: "Litletussen ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,200 L41,196 L67,183 L80,176 L100,166 L114,158 L133,152 L152,149 L171,146 L189,147 L207,147 L224,147 L244,148 L270,151 L290,151 L310,151 L330,146 L353,143 L373,134 L389,125 L405,115 L416,108 L429,103 L449,96 L475,83 L495,75 L508,67 L522,59 L541,49 L555,42 L574,32 L600,18",
      startLabel: "58 moh",
      endLabel: "795 moh",
      distanceLabel: "4,1 km",
      caption: "765 høydemeter og 4,09 km fra Dale: sommerstien, rundt Storvatnet på land på 274 — kilden krysser isen, linja holder land — og sørryggen fra 689 til toppen på 795.",
    },
  },
  slattheia: {
    slug: "slattheia",
    intro:
      "638 høydemeter og 2,47 km fra Dale til Slåttheia — 694,0 på skjermen mot publiserte 690, og en utrolig flott topp for nybegynnere, sier kilden. Sommerstien mot Storvatnet, venstre der det flater, forbi 342-høyden og opp den store sørøstvendte lia; nedkjøringa holder 20–30 grader, og ruta går utenom det meste av skredterrenget. KAST 2 hos Fri Flyt, men Grytøyas innsteg: grad 2.",
    ascent: [
      "Fra Dale på 58 moh etter sommerstien, og venstre (vest) der terrenget flater på 340 moh — skoggrensa ligger på 364 etter 1,44 km, og beltet fra 100 til 200 måler 14,3 grader gjennom skogslia.",
      "Forbi 342-høyden og inn i den store sørøstvendte lia fra 593: beltet fra 500 til 600 er det bratteste i snitt med 21,8 grader, og det bratteste enkeltpartiet, 25,0 grader, ligger mellom 603 og 624 moh.",
      "Så flater det mot varden på 694 — beltet over 600 måler 14,5 i snitt. Linja gir tilbake to meter på hele turen: opp er opp.",
    ],
    descent: [
      "Samme lia hjem: 20–30 grader hos kilden, 20,7 i snitt på SE-målinga — kjøring for ferske i godt vær. Stegjern kan være nyttig på skare.",
      "Nybegynnertoppen har voksne kanter: SV og NE måler 35–38 grader i snitt, og ruta går utenom dem slik kilden sier. Hold deg i den store lia — flankene omkring er brattere.",
    ],
    avalanche: [
      {
        title: "Lia",
        body: "Ruta går utenom det meste av skredterrenget, sier kilden, og modellen er enig: 21,8 grader i det bratteste beltet og 25,0 i det bratteste enkeltpartiet. Men sørøstvendt snø får sol tidlig — start tidlig på varme dager.",
      },
      {
        title: "Kantene",
        body: "SV og NE måler 35–38 grader i snitt — voksne kanter på en nybegynnertopp. I skodde er det flankene du skal vite om: hold retningen på lia og 342-høyden.",
      },
      {
        title: "Før du går",
        body: "Slåttheia ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L22,199 L55,197 L77,191 L96,185 L118,179 L131,178 L164,167 L186,159 L208,151 L221,146 L238,138 L251,134 L273,127 L295,124 L327,119 L350,112 L372,105 L394,96 L417,88 L438,79 L449,75 L466,66 L481,59 L508,47 L536,35 L558,28 L591,20 L600,18",
      startLabel: "58 moh",
      endLabel: "694 moh",
      distanceLabel: "2,5 km",
      caption: "638 høydemeter og 2,47 km fra Dale: sommerstien til 340, forbi 342-høyden — og den store sørøstvendte lia fra 593 til varden på 694 — 25,0 grader på det bratteste.",
    },
  },
  istinden: {
    slug: "istinden",
    intro:
      "1435 høydemeter og 5,36 km fra Tindelva ved Iselvmoen til Vestre Istinden, det høyeste av Istindan og landemerket i Indre Troms. Turen er lang og høy mer enn den er bratt: bratteste hundremetersbeltet måler 21,6 grader mellom 1400 og 1500 moh, og bratteste sammenhengende parti 27,7 grader — men ruta går på en rygg med Fri Flyts «nordveggen» på den ene sida og botnen med breen på den andre, og det er kantene, ikke snittene, som avgjør dagen.",
    ascent: [
      "Fra den store parkeringa der Tindelva kommer ned ved Iselvmoen på veien mot Fjellstad, 80 moh. Fjellstadvegen er kartlagt som offentlig vei med fast dekke, så starten er brøytet året rundt. Linja går på sørsida av elva, slik begge kildene sier, og følger den kartlagte stien opp den bratte bjørkelia — samme sti ut.no kaller «tydelig og bra, men bratt», og som er skiltet med grønt turskilt fra parkeringa. Beltene måler 18,0 grader fra 100 til 200 moh, 19,0 fra 200 til 300 og 20,7 fra 300 til 400.",
      "Skogen slutter på 558 moh etter Kartverkets klasser, med åpent område fra 568, og skoggrensa kommer 1,93 km ute. Her flater det av: beltet fra 500 til 600 moh måler 13,9 grader og beltet fra 700 til 800 bare 8,4 over 650 meter grunn. Det er hvilesteget ut.no beskriver ved skulderen, og det er stedet å se seg om — nordveggen står rett i front herfra.",
      "Fra 2,93 km og 788 moh går linja innover i gryta under veggen noen hundre meter, slik Fri Flyt sier, før den tar opp på ryggen. Ryggen går på vestsida av veggen, og den går også vest for breen i botnen. Det er ikke en detalj: både Fri Flyt («ryggen som går opp på vestsiden av veggen») og ut.no («til høyre for bekken og breen») sender deg utenom isen, og brepolygonet ligger 898 til 1155 moh rett øst for linja. Nærmeste passering er 14 meter fra brekanten, på 4,27 km og 1152 moh. Linja har 0 meter på breen, kontrollert både mot Kartverkets terrengklasse og mot OSMs brepolygon.",
      "Over 1200 moh reiser ryggen seg jevnt — 17,5 grader fra 1200 til 1300, 21,2 fra 1300 til 1400 og 21,6 fra 1400 til 1500, det bratteste beltet på turen. Det bratteste sammenhengende partiet ligger i samme høydelag: 27,7 grader mellom 1286 og 1304 moh, 4,73 km ute, altså en knapp halvkilometer før varden.",
      "Fri Flyt advarer: «Hold god avstand fra hengeskavlene ut over Nordveggen», og målingen sier hvorfor — nordsveipen fra varden holder 34,8 grader i snitt og 60,9 som bratteste 60 meter bare 50 til 110 meter ut. Varden på 1489 moh, som registeret fører som Vestre Istinden. Siste stykket er ofte avblåst, og da må skiene kanskje bæres — det er kildens egen formulering, og det er den vanligste grunnen til at dagen tar lengre tid enn tallene tilsier.",
    ],
    descent: [
      "Ned samme ryggen. Merk retningen: de første hundre meterne fra varden går linja vestover, 262 til 276 grader, før den svinger nordvestover ned ryggen — over hele fallet til skoggrensa peker den 344 grader. I skodde er det den første vestlige biten som må sitte, for nordsida av kammen er nordveggen.",
      "Fra varden til skoggrensa er det 931 høydemeter, mot de «omtrent 900 meter» Fri Flyt oppgir ned til skogen. Så er det bjørkelia igjen, den samme du gikk opp, og 26 høydemeter er alt turen gir tilbake underveis.",
      "Fri Flyts vanligste nedkjøring er en annen linje enn denne: renna på 30–35 grader mot sørvest fra toppen. Sørvestsveipen fra varden måler 30,6 grader i snitt over 800 meter, som stemmer med kilden, men bratteste 60 meter i den holder 40,0 grader 60 til 120 meter ut. Den renna er ikke målt som egen rute her, og kortets aspekt gjelder rutas egen nedkjøring. Toppegg-varianten fra Søre Istinden er heller ikke denne ruta — det er bare for den Fri Flyt nevner isøks og stegjern.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts eget faremoment er presist om hva som er hva: «Skredfare må vurderes nøye på nedkjøringene i botnen mellom Søndre og Vestre Istind og ned fra Søndre Istind. Ryggen opp normalveien er relativt skredsikker. Hold god avstand fra hengeskavlene ut over Nordveggen.» Ruta her er ryggen, altså den delen kilden kaller relativt skredsikker — men «relativt» er kildens ord, ikke en garanti, og botnen den advarer mot ligger 14 meter fra linja på det nærmeste.",
      },
      {
        title: "Nordveggen og skavlene",
        body: "Nordsveipen fra varden holder 34,8 grader i snitt de første 800 meterne, med 60,9 grader som bratteste 60 meter bare 50 til 110 meter ut; nordøstsida måler 30,5 i snitt og nordvestsida 28,0 med 65,1 grader 190 til 250 meter ut. Skavlene bygger ut over denne kanten, og de er det Fri Flyt ber deg holde god avstand fra. Ryggen er bred nok til å gå, men kanten er ikke der øynene tror når det er flatt lys.",
      },
      {
        title: "Breen i botnen",
        body: "Botnen mellom Vestre og Søre Istinden bærer en bre — Kartverket klasser den som SnøIsbre, OSM har polygonet way/375260442 mellom 898 og 1155 moh, og ut.no nevner den i veibeskrivelsen. Linja går utenom, vest for den, med 14 meter som nærmeste passering. Den er ikke lagt for å krysse is, og den skal ikke brukes som om den var det: nedkjøring i botnen er det ene stedet Fri Flyt navngir som skredfarlig.",
      },
      {
        title: "Før du går",
        body: "Vestre Istinden ligger i varslingsregionen Indre Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer skisesong for denne turen: ut.nos jul–sep gjelder fotturen, og Fri Flyt har ikke sesongfelt. Kortets feb–mai er derfor redaksjonell. Kortets 5–7 t er pipelinens egen utregning; Fri Flyt oppgir 6–7 timer. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L32,200 L51,198 L77,191 L100,181 L115,174 L135,168 L155,159 L168,155 L186,147 L213,139 L241,131 L262,124 L286,116 L312,111 L332,108 L352,105 L376,101 L391,93 L409,85 L427,81 L458,73 L483,62 L498,61 L518,52 L539,46 L554,39 L572,31 L598,19 L600,18",
      startLabel: "80 moh",
      endLabel: "1489 moh",
      distanceLabel: "5,4 km",
      caption: "1435 høydemeter og 5,36 km fra Tindelva, med det bratteste — 27,7 grader mellom 1286 og 1304 moh — på ryggen en knapp halvkilometer før varden.",
    },
  },
  skjellesvikgalten: {
    slug: "skjellesvikgalten",
    intro:
      "1019 høydemeter og 4,11 km fra Skjellesvika til Skjellesvikgalten — og et fjell kilden og registeret måler ulikt: Fri Flyt skriver 800 moh, men registerets Skjellesvikgalten, med Storgalten som undernavn, er 987-toppen, og DTM1 er enig på desimeteren. Ingen egen topp på 800 finnes på østryggen — bare ei skulder. Kortet bærer registerhøyden. KAST 3 – Komplekst med alpinøks og stegjern. Grad 4.",
    ascent: [
      "Fra lomma på fv. 8670 Grytøyveien ved Skjellesvika småbåthavn — 6 moh — følger du traktorvegen vestover fra havna: 33 moh der linja står i den, og skoggrensa på 298 etter 1,53 km.",
      "Opp ryggen fra 151 og den store slake østryggen vestover — 617 moh der korridoren er festet. Beltet fra 500 til 600 er det bratteste i snitt med 21,5 grader, og det bratteste enkeltpartiet, 39,0 grader, ligger høyere, mellom 778 og 803 moh under skuldra.",
      "Ryggen fortsetter til varden på 987 — skuldra på rundt 800 underveis er høyden kilden navngir, men terrenget stiger videre uten søkk: NE-målinga, der ryggen kommer, er den slake sida med 15,3 grader i snitt.",
    ],
    descent: [
      "Samme rygg hjem: hard vindpakket snø er normalen, sier kilden — det er den øksa og stegjerna er for. Store skavler bygger seg over rygglinjene og kan kollapse: gå der du gikk opp, ikke der utsikten er best.",
      "Sydrennene (30–45 grader) er variantene for stabil snø — E har 54,6-vindu 30–90 m ut og S 48,7, det er dit rennene hører. Nordsida mot Skipsdalen er utveien når sørsnøen er usikker.",
    ],
    avalanche: [
      {
        title: "Sydrennene",
        body: "Kilden dokumenterer en dødsulykke i februar 2008 i sydrennene — ett menneske omkom. Rennene holder 30–45 grader og bor i vinduene på 48,7–54,6 fra varden: de krever stabil snø, og nordsida mot Skipsdalen er utveien kilden selv peker på.",
      },
      {
        title: "Skavlene",
        body: "Store skavler bygger seg over rygglinjene og kan kollapse, sier kilden — på en rygg der hard vindpakket snø er normalen. Hold sporet fra oppturen og avstand til østkanten, som leser 54,6 i sitt bratteste vindu.",
      },
      {
        title: "Før du går",
        body: "Skjellesvikgalten ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L33,197 L59,195 L92,188 L118,181 L144,173 L164,170 L190,158 L204,153 L221,147 L250,143 L268,134 L289,125 L309,118 L329,111 L355,101 L380,88 L394,82 L420,72 L440,64 L460,56 L480,53 L493,55 L507,52 L525,45 L546,34 L566,30 L592,19 L600,18",
      startLabel: "6 moh",
      endLabel: "987 moh",
      distanceLabel: "4,1 km",
      caption: "1019 høydemeter og 4,11 km fra Skjellesvika: traktorvegen fra havna, den store slake østryggen — og varden på 987, toppen kilden kaller 800 og registeret måler høyere.",
    },
  },
  nona: {
    slug: "nona",
    intro:
      "1016 høydemeter og 5,43 km fra Dale til Grytøyas høyeste: Nona leser 1008,9 på skjermen mot kildens 1012, og var yndlingsfjellet til Olav Solberg ifølge Fri Flyt. Linja følger skitursporet innover Dalsdalen og tar den breieste renna mot toppen — kilden gir renna 30–45 grader sammenhengende, KAST 3 – Komplekst, og alpinøks og stegjern hører med. Grad 4 — kongen på Grytøya, for stabile dager.",
    ascent: [
      "Fra Dale på vestsida av øya — 58 moh, like før skogsveien starter — følger du skitursporet innover Dalsdalen: skogsveien på 97, dalbotnen på 118, og skoggrensa allerede på 287 moh etter 3,21 km slak innmarsj. De to første hundremeterbeltene måler 1,9 og 3,7 grader: dette er transport, ikke klatring.",
      "Gjennom øvre Dalsdalen på 280 og inn i renna på 453 moh. Kilden gir renna 30–45 grader sammenhengende ned til vann 428; på modellens linje ligger det bratteste enkeltpartiet, 38,4 grader, mellom 587 og 612 moh, og beltet fra 700 til 800 måler 22,7 i snitt.",
      "Renna slipper deg ut på 843 moh, og de siste hundremeterne mot varden på 1009 flater ut — beltet over 1000 måler 13,0 grader. Skjermens 1008,9 mot kildens 1012 er registerets og bokas vanlige avstand på en topp målt før laserskanninga.",
    ],
    descent: [
      "Ned igjen der du kom opp — og bare der: flankemålingene rundt toppen gir N/NE/E 45,7–49,1 grader i snitt med vindu på 57–66, og SV, den snilleste, 27,8. Renna i vestruta og Syd direkte ligger i flanker som måler 37,9 og 34,7 i snitt; Syd direkte gir kilden 35–50 grader, for stabil snø og presis veivalg.",
      "Vurder snødekket før nedkjøring — terrenget er skredterreng i alle varianter, sier kilden. Renna gir kjøring hele veien ned mot Dalsdalen; under skoggrensa på 287 er det sporet hjem til Dale.",
      "Den andre dokumenterte ruta går opp sørsida fra Vaskinn — 997 høydemeter på 4,65 km, og den mildeste veien på fjellet: bratteste steget måler 34,0 grader mot vestsidas 36,2. Den følger sommerstien opp gjennom skogen langs Vaskinnelva og forbi Vadskinndalsvatnet inn i den søndre bollen. Kilden sier det er lettere å finne linja om du går opp samme ruta som du kjører ned.",
    ],
    avalanche: [
      {
        title: "Renna",
        body: "Kilden gir renna 30–45 grader sammenhengende ned til vann 428 — KAST 3 – Komplekst, med alpinøks og stegjern i lista. Modellens linje måler 36,2 på det bratteste, men ei renne samler alt som losner over deg: her er det snøen som bestemmer dagen.",
      },
      {
        title: "Toppflankene",
        body: "Ingen slak side på Grytøyas konge: N/NE/E måler 45,7–49,1 grader i snitt med vindu på 57–66, og SV 27,8. Skredterreng i alle varianter — og Syd direkte (35–50) er ekspertlinja, ikke denne.",
      },
      {
        title: "Før du går",
        body: "Nona ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L31,197 L55,194 L85,193 L120,192 L155,192 L190,190 L221,189 L250,187 L280,183 L310,176 L335,165 L360,154 L384,139 L404,125 L414,128 L440,124 L452,115 L472,103 L488,91 L505,81 L517,72 L535,59 L551,51 L565,42 L576,34 L600,19 L600,18",
      startLabel: "58 moh",
      endLabel: "1009 moh",
      distanceLabel: "5,4 km",
      caption: "1016 høydemeter og 5,43 km fra Dale: skitursporet innover Dalsdalen til skoggrensa på 287, renna fra 453 til 843 moh — og det bratteste enkeltpartiet, 38,4 grader mellom 587 og 612 moh, midt i renna.",
    },
  },
  trolltinden: {
    slug: "trolltinden",
    intro:
      "940 høydemeter og 4,7 km fra ferjeleiet på Bjørnerå — 2 moh, gratisferge fra Stornes, og kilden anbefaler å la bilen stå — til prinsen mot Nonas konge: Trolltinden leser 917,9 mot publiserte 919. Slake Bjørnrådalen mellom bratte vegger, ryggen til skulderen, og toppstøtet til fots med skavler å passe. KAST 2 – Utfordrende, med alpinøks og stegjern for hard skare på ryggene. Grad 3.",
    ascent: [
      "Fra ferjekaia går linja vestover inn Bjørnrådalen — 190 moh der korridoren står i dalen — i slakt terreng flankert av bratte vegger: beltet fra 0 til 100 måler 5,5 grader, og skoggrensa ligger på 410 moh etter 2,45 km.",
      "Gjennom øvre dalen på 450 og opp på ryggen fra 650: beltet fra 300 til 400 er det bratteste i snitt med 21,0 grader, og ryggene er ofte hard skare — det er her øksa og stegjerna i lista hører hjemme.",
      "Fra skulderen på 757 er det toppstøtet til fots: det bratteste enkeltpartiet på linja, 36,4 grader, ligger mellom 875 og 908 moh rett under varden på 918. Aldri eksponert og bratt, sier kilden — men skavlene skal passes.",
    ],
    descent: [
      "Samme vei ned: SV-flanken fra toppen, der ryggruta kommer, måler 13,4 grader i snitt, mens E/SE/S måler 33–36 og NV 35,8. S-renna (45 grader øverst), Bollen (30–40) og Østrenna (30–45) er variantene for stabil snø — ikke normalruta.",
      "Kilden dokumenterer en dødsulykke 10. mars 2019 i renna øst for Storelva på Storfjellet: unngå den innerste nordvestbollen, der store skred har gått før. Hold ryggen og dalbotnen hjem til ferjekaia.",
    ],
    avalanche: [
      {
        title: "Ryggene",
        body: "KAST 2 – Utfordrende hos Fri Flyt: alpinøks og stegjern for hard skare på ryggene, og skavler ved toppstøtet. Det bratteste enkeltpartiet måler 36,4 grader mellom 875 og 908 moh — til fots, med skiene på sekken.",
      },
      {
        title: "Nordvestbollen",
        body: "Dødsulykken 10. mars 2019 gikk i renna øst for Storelva på Storfjellet, og kilden ber deg unngå den innerste nordvestbollen der store skred har gått. Variantene S-renna, Bollen og Østrenna (30–45 grader) krever stabil snø.",
      },
      {
        title: "Før du går",
        body: "Trolltinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,193 L51,189 L74,188 L97,187 L120,184 L143,176 L166,169 L189,165 L206,160 L235,151 L258,146 L275,141 L299,128 L313,119 L330,111 L344,105 L362,102 L384,96 L402,88 L419,77 L436,71 L456,69 L476,62 L499,48 L518,40 L540,36 L563,36 L586,27 L600,18",
      startLabel: "2 moh",
      endLabel: "918 moh",
      distanceLabel: "4,7 km",
      caption: "940 høydemeter og 4,7 km fra ferjeleiet på Bjørnerå: Bjørnrådalen til 450, ryggen over skulderen på 757 — og toppstøtet til fots, 36,4 grader på det bratteste mellom 875 og 908 moh.",
    },
  },
  arbostadtinden: {
    slug: "arbostadtinden",
    intro:
      "1171 høydemeter på 3,98 km fra fv. 7804 til Årbostadtinden — og én eneste høydemeter gitt fra deg på hele linja. Skrårenna til topps er landemerket her, den mange har stått på ski ned både tidlig og seint i sesongen, og Fri Flyt holder den «mesteparten mellom 30-40 grader». KAST 3 – Komplekst med alpinøks og stegjern: grad 4.",
    ascent: [
      "Fra lomma langs fv. 7804 der Storelva renner ut — 9 moh — følger linja traktorveien som snirkler seg sørover fra den gamle skolen: 52 moh der korridoren står i den. Hele ruta er kartlagt som sti i OpenStreetMap, fra veien til 40 meter fra varden, og terrengmodellen langs den gir nøyaktig de 1170 høydemetrene kilden oppgir.",
      "Videre oppover på høyresida — vest — for Storelva: 327 moh, og skogen slipper på 386 etter 1,12 km. Over skoggrensa på 593 og opp på flata ved hytta, 689 moh, der fjellet endelig viser seg. Beltet fra 600 til 700 er det slakeste på hele linja med 8,4 grader over 674 meter grunn — det er flata, og det er der du ser hva du har igjen.",
      "Så renna: 978 moh der korridoren er festet, og beltet fra 900 til 1000 er det bratteste i snitt med 23,5 grader over 244 meter grunn. Det bratteste enkeltsteget, 29,0 grader, ligger mellom 901 og 924 moh — inne i renna. Varden er 1179, og utsikten går til Senja og Dyrøy.",
    ],
    descent: [
      "Ned renna samme veien. Kilden forteller om en frikjører som kjørte hele renna rett ned under en av Andørjas Freeride-konkurranser; for de fleste er det 30–40 grader jevnt fra toppen, og det ligger vårsnø i renna til mai og juni.",
      "Sørsida er den andre veien ned: nede på flata før Rundtinden finner du den enkleste nedkjøringa sørover, i bratt terreng på 30–45 grader, til veien som stopper ved Vasskaret. Nord og nordøst er ikke en retur — flankesveipet måler 49,2 til 50,3 grader i snitt der, med vinduer på 66,8 og 74,7.",
      "Den andre dokumenterte ruta kommer sørfra, fra veienden ved Holte i Vasskaret — 998 høydemeter på 3,86 km, og 173 mindre å stige enn renna fordi veienden ligger på 204 moh og ikke på 9. Den går opp til flata før Rundtinden og deretter østover langs sørsida av den store vestvendte flanken; bratteste steget er 26,7 grader mot rennas 29,0.",
    ],
    avalanche: [
      {
        title: "Renna",
        body: "Renna er turen, og den er også det som gjør den KAST 3 – Komplekst. Den holder 30–40 grader mesteparten av veien, den samler det som kommer ovenfra, og den har ingen sideflukt: går det, går det der du står. Snøen må være stabil, og alpinøks og stegjern står på kildens liste av samme grunn.",
      },
      {
        title: "Fjellsida rundt",
        body: "Bare sørvest er mild: 22,1 grader i snitt med 29,6 som bratteste vindu, og vest 30,7 med 37,1 — kildens store vestvendte flanke øverst på fjellet. Nord og nordøst måler 49,2 og 50,3 i snitt med vinduer på 66,8 og 74,7, og øst 62,4 bare 20 til 80 meter ute. Det er én vei opp og ned herfra.",
      },
      {
        title: "Før du går",
        body: "Årbostadtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts, men renna holder vårsnø lenge etter det. Sender/mottaker, søkestang og spade — og alpinøks og stegjern. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,195 L41,189 L61,182 L75,177 L95,169 L109,165 L129,157 L145,150 L163,143 L173,140 L189,133 L211,127 L231,118 L258,111 L279,108 L306,107 L333,103 L366,100 L387,94 L407,91 L428,83 L442,79 L462,70 L483,61 L500,53 L516,46 L534,39 L554,31 L570,25 L597,18 L600,18",
      startLabel: "9 moh",
      endLabel: "1179 moh",
      distanceLabel: "4,0 km",
      caption: "1171 høydemeter på 3,98 km fra Årbostad: traktorveien fra den gamle skolen, vest for Storelva til flata ved hytta — og skrårenna til varden på 1179.",
    },
  },
  klaptinden: {
    slug: "klaptinden",
    intro:
      "839 høydemeter og 3,83 km fra Himmelberget til Klåptinden — 997,6 på skjermen mot publiserte 998, og en start som allerede ligger på 175 moh: fv. 7804 går høyt langs nordkysten av Andørja. Opp fra Klåpvatnet og mer eller mindre sommerruta til topps, steinete under skoggrensa og avblåst over. KAST 2 – Utfordrende, med parti i skogen rundt 40 grader. Grad 3.",
    ascent: [
      "Fra lomma langs fv. 7804 Andørjaveien ved Himmelberget — 175 moh, og kilden oppgir selv vegnummeret — runder linja sør for Klåpvatnet på 177: vatnet passeres på land, og skoggrensa ligger på 359 etter 1,04 km. Kilden advarer: steinete her nede når snøen er tynn — hold til høyre (sør) om dekket ikke bærer.",
      "Sommerruta står i linja på 375, og beltet fra 400 til 500 måler 18,3 grader gjennom den øvre skogslia — det er her kildens parti rundt 40 grader bor i fallinja, mens sporet krysser slakere.",
      "Ryggen fra 674 og opp: beltet fra 800 til 900 er det bratteste i snitt med 21,3 grader, og det bratteste enkeltpartiet, 26,0 grader mellom 806 og 828 moh, ligger rett under den ofte avblåste toppen på 998.",
    ],
    descent: [
      "Ryggen hjem på 20–30 grader, sier kilden — NV-flanka, der ruta ligger, er den slake målingen med 14,3 grader i snitt. Flott skikjøring og veldig bra utsikt i gode snøvintre, lover kilden.",
      "Sørsida mot Vassmyran ved Vasskarvatnet er varianten: 30–40 grader, brattere og oftest bedre snø. NE og E fra varden faller 47,2 og 37,1 i snitt med vindu på 68,6 og 71,1 — de kantene er ikke til å kjøre, og i skodde skal du vite hvor de er.",
      "Den andre dokumenterte ruta kommer sørfra, fra lomma på Vasskarveien ved Vassmyran — 808 høydemeter på 3,09 km, den korteste linja til denne toppen. Kilden peker på den når vestsida er snau: «hvis man ser på avstand at det er for lite snø på vestsiden, går man heller opp fra sørsiden». Brattere også — 31,7 grader mot vestsidas 26,0.",
    ],
    avalanche: [
      {
        title: "Skogslia",
        body: "Kildens parti rundt 40 grader ligger i skogen — bratt nok til å bære flak, og med steinete underlag som gjør tynt dekke til et føre- og skadeproblem, ikke bare et skredproblem. Hold til høyre (sør) når snøen er tynn, som kilden sier.",
      },
      {
        title: "Kantene",
        body: "NE-flanka faller 47,2 grader i snitt med et 68,6-vindu og østsida 37,1 med 71,1 rett under varden — toppen er ofte avblåst, og skare mot de kantene er stedet å være våken. Sørsida-varianten (30–40 grader) krever stabil snø.",
      },
      {
        title: "Før du går",
        body: "Klåptinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,200 L49,199 L71,192 L100,181 L123,171 L142,163 L170,158 L192,153 L207,153 L222,145 L243,135 L268,125 L290,116 L319,107 L347,100 L368,94 L396,90 L425,87 L453,82 L481,73 L495,67 L519,59 L538,48 L559,37 L580,29 L600,18",
      startLabel: "175 moh",
      endLabel: "998 moh",
      distanceLabel: "3,8 km",
      caption: "839 høydemeter og 3,83 km fra Himmelberget: sør for Klåpvatnet på land, sommerruta fra 375 — og ryggen fra 674 til den avblåste toppen på 998.",
    },
  },
  toppen: {
    slug: "toppen",
    intro:
      "721 høydemeter og 2,64 km fra Toppentunnelen til Toppen — 758,6 på skjermen mot publiserte 759, og Grytøyas sjuende tur i appen: øya som begynte med Nona er nå komplett fra Dale til Skjellesvika. Østsida av Hallevikelva, sør for Toppskarvatnet på land, og ryggen sørover. KAST 3 – Komplekst med alpinøks og stegjern; ruta krysser skredterreng. Grad 4.",
    ascent: [
      "Fra lomma på fv. 7756 Toppsundveien rett før Toppentunnelen — 40 moh; kildens F15 er dagens fylkesveg, fjerde vegnummer-notat i arkivet — går linja opp østsida av Hallevikelva: skoggrensa allerede på 278 etter 0,68 km, og det bratteste enkeltpartiet, 29,2 grader mellom 154 og 179 moh, ligger i den første lia.",
      "Beltet fra 200 til 300 er det bratteste i snitt med 21,1 grader, opp mot 336 der korridoren står i dalsida. Kilden er ærlig om dalen: terrengfeller i Hallevikelva — varianten om Dale og Nonskarvatnan har lavere eksponering.",
      "Sør for Toppskarvatnet på land — 516 moh, tjernet ligger på 489 — og ryggen sørover fra 611 til varden på 759. Beltet over 700 måler 19,9 grader i sluttbakken.",
    ],
    descent: [
      "Samme vei ned — og hold nord: N-flanka mot Toppskarvatnet er den eneste slake målinga med 12,7 grader i snitt. S, SV og V faller 50,8–56,5 grader i snitt med vindu på 70,4–76,7 — Rakkrenna og sjøklippene, og SV-radialen når helt til havet.",
      "Rakkrenna i sørvest er ekspertlinja: 40–50 grader til havnivå når snøen tillater det, med rappell inn på rundt 500. Det er en annen tur, for andre dager — normalruta går tilbake om Toppskarvatnet.",
    ],
    avalanche: [
      {
        title: "Hallevikelva-dalen",
        body: "Ruta krysser skredterreng, og dalen har terrengfeller — kildens egne ord, og grunnen til KAST 3 – Komplekst. Varianten om Dale og Nonskarvatnan har lavere eksponering og er svaret på dager med usikker snø.",
      },
      {
        title: "Sørkantene",
        body: "S/SV/V faller 50,8–56,5 grader i snitt med vindu opp mot 76,7 — fjellet stuper i sjøen på tre sider. I skodde er kompasskursen fra varden nord, mot Toppskarvatnet: alt annet ender i Rakkrenna-terrenget.",
      },
      {
        title: "Før du går",
        body: "Toppen ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,195 L41,189 L62,179 L82,171 L98,163 L113,159 L125,153 L146,144 L174,132 L185,129 L205,124 L225,123 L251,120 L277,117 L297,114 L328,110 L348,104 L368,96 L379,93 L399,86 L419,80 L432,76 L451,69 L461,63 L482,58 L501,55 L512,51 L533,43 L553,36 L572,30 L594,21 L600,18",
      startLabel: "40 moh",
      endLabel: "759 moh",
      distanceLabel: "2,6 km",
      caption: "721 høydemeter og 2,64 km fra Toppentunnelen: østsida av Hallevikelva, sør for Toppskarvatnet på 516 — og ryggen sørover fra 611 til varden på 759.",
    },
  },
  lundenesgalten: {
    slug: "lundenesgalten",
    intro:
      "788 høydemeter og 4,78 km fra Lundenes kirke til Lundenesgalten — den store fjellsida du ser fra Harstad, og som mange vokser opp med som drømmefjellet sitt. Fri Flyt gir KAST 2 – Utfordrende, setter alpinøks og stegjern på lista, og daterer et dødsskred på den samme sida: påsken 1969. Grad 3.",
    ascent: [
      "Fra den lille parkeringsplassen ved Lundenes kirke — 5 moh — går traktorveien langs Forselva innover, og den er kartlagt: linja ligger på vei fra 13 til 184 moh. Beltet fra 0 til 100 moh måler 3,5 grader over 1646 meter grunn, og fra 100 til 200 er det 4,8 over 1133. Den første halvtimen er innmarsj, ikke stigning.",
      "Traktorveien ved Forselva er 47 moh, Storskogbakkan 212. Der tar den virkelige oppstigningen til, og kilden lover at du ikke trenger ta ned hælstøtten på lenge. Over det holder du høyresida — østsida, 364 moh — og trekker gradvis mot venstre, vestover, over 502 og 621. Skogen slipper på 287 moh etter 3,14 km.",
      "Det bratteste hundremetersbeltet måler 20,5 grader mellom 400 og 500 moh, over 246 meter grunn, og det bratteste enkeltsteget, 26,2 grader, ligger mellom 675 og 692. Toppen er 787 på DTM1. Fri Flyt skriver 782, og kortet bærer terrengmodellens tall som overalt ellers.",
    ],
    descent: [
      "Ned samme sida. Kilden kaller den kontinuerlig mellom 25 og 35 grader, og gir deg valget: øv på store svinger og høy fart, eller ta det rolig og bli lenger. Langs linja måler beltet fra 500 til 600 moh 15,2 grader, 600 til 700 måler 16,0 og 700 til 800 måler 16,5 — sporet selv holder seg slakere enn sida rundt det.",
      "Radialene fra toppen sier hvorfor det er sørsida du kjører. Sørøst måler 16,5 grader i snitt og sørvest 17,7. Nordøst måler 34,3 med et 60,8-vindu bare 100 til 160 meter ute, vest 39,6 med 52,6 på 200 til 260, og nordvest 36,6 med 51,1 på 160 til 220. Den alpine varianten over Nordtinden går der.",
    ],
    avalanche: [
      {
        title: "Påsken 1969",
        body: "Fri Flyt daterer skredet: «I påsken 1969 gikk det skred på vestsiden av Galten sin sydside, to ble tatt av skredet og en mann omkom.» Det er den vestre kanten av den samme sida turen går opp og ned. Vestradialen fra toppen måler 39,6 grader i snitt med et 52,6-vindu 200 til 260 meter ute: sida blir brattere jo lenger vest du kommer, og det er den grensen setningen handler om.",
      },
      {
        title: "En sammenhengende flate",
        body: "Kilden skriver at nedkjøringa er kontinuerlig mellom 25 og 35 grader. Det er en stor, sammenhengende flate uten rygg eller rabbe til å bryte et flak på, og lengden gjør at det som løsner høyt har hele sida å gå på. Alpinøks og stegjern står på kildens utstyrsliste for dette fjellet, og hard skare på en slik side er grunnen.",
      },
      {
        title: "Før du går",
        body: "Lundenesgalten ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det. Den alpine ruta over Nordtinden krever 30 meter tau og et lite sikringsrack i tillegg, og er ikke ruta dette kortet beskriver. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L22,199 L50,194 L73,191 L96,190 L116,188 L139,186 L156,185 L178,183 L207,176 L235,167 L260,164 L283,162 L299,162 L326,158 L349,154 L366,148 L383,142 L399,130 L422,117 L439,108 L462,93 L473,85 L491,79 L513,66 L535,54 L557,44 L575,31 L592,21 L600,18",
      startLabel: "5 moh",
      endLabel: "787 moh",
      distanceLabel: "4,8 km",
      caption: "788 høydemeter og 4,78 km fra Lundenes kirke: traktorveien langs Forselva til Storskogbakkan på 212 — og hele den store sørsida opp til 787.",
    },
  },
  "middagstinden-andorja": {
    slug: "middagstinden-andorja",
    intro:
      "618 høydemeter og 2,95 km fra Slettneset til Middagstinden på Andørja — 630,3 på skjermen mot publiserte 629, og den fjerde kvalifiserte navnedubletten i appen, etter Romsdal, Kvæfjord og Tjeldsund-området. Kort tur, KAST 1 – Enkelt på normalruta — men kilden er uvanlig tydelig: det har gått skred på alle nedkjøringene som beskrives. Grad 2, og varselet veier tyngst.",
    ascent: [
      "Fra vegenden på Langnesveien ved Slettneset — 12 moh — går sommerruta sørover: 93 moh der linja står i den, og skoggrensa på 377 etter 1,84 km. Beltet fra 0 til 100 måler 6,0 grader over den første snaue kilometeren.",
      "Høyre (vest) og opp langs Mølnelva utenom de bratte partiene, slik kilden ber om — 380 moh der linja er festet. Beltene fra 100 til 400 ligger jevnt på 15,4–16,4 grader: jevn skinnegang i åpen li.",
      "Ryggen som tar til nord for toppen fra 508: beltet fra 500 til 600 er det bratteste i snitt med 18,5 grader, og det bratteste enkeltpartiet, 28,2 grader mellom 514 og 538 moh, ligger der ryggen reiser seg. Varden står på 630 — og SE-målinga stiger svakt videre: ryggen fortsetter mot Middagsaksla.",
    ],
    descent: [
      "Normalnedkjøringa går nordøst ned fra toppen og vest for Remmelbergan langs Mølnelva tilbake til Slettneset — heng på 30 grader hører med, og N/NV-flankene måler 17,5–18,0 grader i snitt.",
      "Bjørndalen-varianten — sørvest langs ryggen til Middagsaksla og nord ned — er KAST 3: 30–40 grader først, med utsatt 40-gradersterreng og dokumentert skredaktivitet. SV og V fra varden faller 35–36 i snitt med 58,9-vindu: Mølnelva-sidas kanter.",
    ],
    avalanche: [
      {
        title: "Alle nedkjøringene",
        body: "Det har gått skred på alle nedkjøringene som beskrives her, sier kilden rett ut — naturlig utløste og skiløperutløste, de siste årene. KAST 1-klassa gjelder terrengformen på normalruta; historikken gjelder fjellet. Les varselet som om turen var gradert hardere.",
      },
      {
        title: "Vindtransporten",
        body: "Sørvest–nordøst-orienteringa gjør at vind fra sørvest laster nordøstsida — nettopp der normalnedkjøringa går. Etter vind er det ferske flaket i nedkjøringa problemet, ikke bratthet: 28,2 grader er det bratteste enkeltpartiet på hele linja.",
      },
      {
        title: "Før du går",
        body: "Middagstinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L28,195 L55,191 L81,188 L101,186 L125,182 L147,178 L168,177 L192,167 L211,159 L229,151 L247,142 L261,135 L281,129 L293,126 L309,118 L320,113 L339,108 L352,104 L366,96 L377,92 L393,84 L412,80 L434,74 L450,71 L476,62 L494,57 L512,45 L523,40 L540,31 L558,26 L586,19 L600,18",
      startLabel: "12 moh",
      endLabel: "630 moh",
      distanceLabel: "3,0 km",
      caption: "618 høydemeter og 2,95 km fra Slettneset: sommerruta sørover, opp langs Mølnelva fra 380 — og ryggen nord for toppen fra 508 til varden på 630.",
    },
  },
  skartinden: {
    slug: "skartinden",
    intro:
      "1193 høydemeter og 3,92 km fra Vang til Skartinden på 1149 — samme snuplass som Langlitinden, motsatt retning: opp elvedalen til Ytterholla, skardet mellom Vasskartinden og Skartinden, og ryggen eller den store flata østover til toppen. KAST 3 – Komplekst med alpinøks og stegjern; nedkjøringa er 30–40 grader øverst med 60-graders klipper rundt Ytterholla. Grad 4.",
    ascent: [
      "Fra snuplassen ved Vang — 8 moh — går linja nordover opp elvedalen: 195 moh der korridoren står i dalen, og skoggrensa allerede på 492 etter 1,62 km. Beltet fra 300 til 400 måler 20,9 grader gjennom lia.",
      "Ytterholla — søkket på 497 — og opp holla om snøen tillater det, opp mot skardet mellom Vasskartinden og Skartinden — botnen ligger på 795, linja går over skuldra på 867 uten å gå ned i det. Beltet fra 800 til 900 måler 9,4 grader over flata bak skardet: en halv kilometer pust før sluttstøtet.",
      "Ryggen eller flata østover fra 844: beltet fra 1000 til 1100 er det bratteste i snitt med 24,8 grader, og det bratteste enkeltpartiet, 38,1 grader mellom 869 og 895 moh, ligger der flata reiser seg mot toppartiet. Varden står på 1149.",
    ],
    descent: [
      "Nedkjøringa er 30–40 grader øverst og 35–40 over Ytterholla — omkranset av 60-graders klipper, sier kilden, og målingen bekrefter dem: NV faller 48,8 grader i snitt med 69,8-vindu, N 45,4 med 63,0. Presis veivalg, særlig i flatt lys.",
      "Linja gir tilbake 52 av de 1193 meterne den vinner — skardet og flata skal krysses begge veier. Vest, der ruta ligger, er den slakeste målingen med 30,8 i snitt, og det bratte vinduet (35,0) kommer først 330–390 m ut fra varden.",
    ],
    avalanche: [
      {
        title: "Ytterholla",
        body: "Holla er rutas nålöye: 30–40 grader øverst, 35–40 over Ytterholla, og 60-graders klipper på begge sider — terreng der et lite flak får store konsekvenser. KAST 3 – Komplekst: opp holla bare om snøen tillater det, som kilden selv sier, og samme dom gjelder ned.",
      },
      {
        title: "Nord og nordvest",
        body: "NV-flanka faller 48,8 grader i snitt med et 69,8-vindu, og N 45,4 med 63,0 — klippene ligger tett på varden. I skodde er skardet på 795 retningspunktet: derfra fører elvedalen hjem uten kanter.",
      },
      {
        title: "Før du går",
        body: "Skartinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,197 L54,190 L83,183 L111,173 L145,163 L165,155 L185,147 L207,139 L227,132 L242,125 L274,116 L310,105 L331,98 L351,90 L384,85 L413,76 L434,69 L456,67 L484,66 L504,63 L519,54 L536,47 L553,39 L565,34 L587,23 L600,18",
      startLabel: "8 moh",
      endLabel: "1149 moh",
      distanceLabel: "3,9 km",
      caption: "1193 høydemeter og 3,92 km fra Vang: elvedalen til Ytterholla på 497, over skardet — linja på 867, botnen på 795 — og flata østover til varden på 1149, med det bratteste enkeltpartiet, 38,1 grader, mellom 869 og 895 moh.",
    },
  },
  langlitinden: {
    slug: "langlitinden",
    intro:
      "1305 høydemeter og 5,59 km fra snuplassen ved Vang til Nordens høyeste øytopp: Langlitinden er Andørjas høyeste, og hele fjellet — fjord til varde — er primærfaktoren. Sommerruta langs Bjørndalselva, flata med vatnet, og traversen på 800–900 der kilden gir skredhistorikk. KAST 3 – Komplekst med alpinøks og stegjern. Grad 4 — for stabile dager.",
    ascent: [
      "Fra snuplassen der Straumbotnveien ender ved Vang — 8 moh — følger du vestsida av Bjørndalselva innover: stien står i linja på 267, og skoggrensa ligger på 435 etter 2,1 km. Beltet fra 400 til 500 er det bratteste i snitt med 21,5 grader, og det bratteste enkeltpartiet, 33,5 grader mellom 496 og 517 moh, ligger i sommerruta opp mot flata.",
      "Over elva og opp sommerruta til flata med det vesle vatnet — 666 moh der linja er festet; vatnet passeres på land. Beltet fra 500 til 600 måler 6,2 grader over den lange flata: pusterommet mellom skogslia og traversen.",
      "Så høyredreining sørover på 800–900 — partiet kilden gir skredhistorikk, og vestflanka måler 39,4 grader i snitt med det bratteste vinduet (52,9) 300–360 m ut fra varden — traversen opp mot 1033-høyden (DTM1 leser 1036,2), og venstre nordover på den store siden til toppen på 1276. De siste 20 metrene kan være avblåst.",
    ],
    descent: [
      "For det meste 20–25 grader hjem, med parti på 35, sier kilden — samme vei som opp, og sørflanka fra varden er den snilleste målingen med 20,5 i snitt. Traversen på 800–900 er stedet der nedturen krever samme fokus som oppturen.",
      "NE og E måler 30,7–31,1 grader i snitt med vindu på 59,6–66,0 rett under varden — Blåisen- og Langlia-linjene bor der. Storeflaska på nordsiden er vedvarende bratt med parti på 45 grader; Lilleflaska, Rytteran, Rytterrenna og Rytterkløfta er de andre variantene. Alt dette er andre turer enn denne.",
      "Den andre ruta går inn fra Vasskaret i sør: 1148 høydemeter på 6,73 km fra enden av traktorveien, østover mot Mørkevatnet — registerets tjern leser 299 moh der kilden skriver 301, og linja klipper 90 meter av isen på sørenden — og så rett sørover opp Rytterkløfta. Kilden er tydelig på hva det koster: «Kan være mye is første delen så stegjern og øks må tidlig frem men ta med skiene på sekken», og «Sørg for at det er stabile snøforhold når du går opp her siden dette er skredterreng og terrengfelle.» Over kløfta blir det slakere, 30 til 35 grader, til du er på 900 moh; det bratteste 30-metersvinduet på linja er selve sluttstøtet, 37,5 grader mellom 1251 og 1276. Normalruta fra Vang er 1305 høydemeter på 5,59 km med bratteste steg 33,5.",
    ],
    avalanche: [
      {
        title: "Traversen",
        body: "Partiet på 800–900 moh er rutas mest utsatte, med historikk for store skred — kilden sier det, og målingen er enig: vestflanka holder 39,4 grader i snitt med et 52,9-vindu. KAST 3 – Komplekst. Traversen tas én og én på dager med usikker snø, og droppes når varselet peker mot vestvendte heng.",
      },
      {
        title: "Kantene",
        body: "NE og E faller 59,6–66,0 grader i sine bratteste vindu rett under varden, og toppen kan være avblåst is de siste 20 metrene — øksa og stegjerna i lista er til toppstøtet, ikke pynt. Hold vestsiden og flata på vei ned.",
      },
      {
        title: "Før du går",
        body: "Langlitinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,194 L46,185 L69,179 L98,172 L123,167 L142,164 L170,157 L199,148 L219,139 L233,132 L251,123 L282,118 L306,118 L314,118 L317,118 L326,115 L345,106 L371,98 L386,92 L405,83 L431,74 L459,67 L488,65 L512,58 L531,50 L551,42 L571,34 L592,23 L600,18",
      startLabel: "8 moh",
      endLabel: "1276 moh",
      distanceLabel: "5,6 km",
      caption: "1305 høydemeter og 5,59 km fra snuplassen ved Vang: sommerruta langs Bjørndalselva, flata med vatnet på 666 — og traversen på 800–900 mot 1033-høyden, før den store siden til varden på 1276.",
    },
  },
  krakrotinden: {
    slug: "krakrotinden",
    intro:
      "1193 høydemeter og 5,23 km fra Fornes til Kråkrøtinden — 1186,5 på skjermen mot publiserte 1187. Nordruta går opp dalen mot Blåisen, holder morenen sør for isen og tar 40-graderspassasjen til toppen. KAST 3 – Komplekst med alpinøks og stegjern; kildens eget tall — 1270 — bærer undulasjonen i dalen. Grad 4.",
    ascent: [
      "Fra den lille asfaltparkeringa ved Fornes, vest for Storelva — 16 moh — går linja opp dalen: 325 moh der korridoren står i den, og skoggrensa på 374 etter 1,66 km. Beltet fra 200 til 300 er det bratteste i snitt med 21,6 grader, i skogslia.",
      "Mot Blåisen fra 659: Blåisen er en isbre, og linja holder moreneterrenget sør for isen — 997 moh der korridoren svinger sørover. Beltet fra 900 til 1000 måler 8,5 grader over morenen.",
      "Passasjen fra 1059: kilden gir den 40 grader, og målingen legger den i NV/V-vinduene på 42,5–48,0 rett under toppen — mens modellens egen linje gjennom aldri måler mer enn 32,5 i noe enkeltparti. Det er forskjellen på fallinja og sporet: passasjen krysses skrått. Varden står på 1186.",
    ],
    descent: [
      "Samme vei ned: NV og V, der nordruta ligger, måler 14,0 og 11,4 grader i snitt — men med de bratte vinduene rett under toppen, så passasjen tas kontrollert før terrenget åpner seg. Østflanka faller 63,9 grader i vinduet 30–90 m ut: hold vest.",
      "Sørruta er brattere — 30–40 grader og mer skredutsatt, sier kilden — og varianten mot Reintinden på 587 fra Blåisen er en annen linje. Fra morenen er dalen hjem til Fornes ren transport.",
    ],
    avalanche: [
      {
        title: "Passasjen",
        body: "Kilden gir passasjen 40 grader, og den ligger i NV/V-vinduene på 42,5–48,0 rett under toppen — kort, men bratt nok til å bære flak, og med øks og stegjern i lista for skare. KAST 3 – Komplekst: passasjen er stedet der dagen avgjøres.",
      },
      {
        title: "Østsida og sørruta",
        body: "Østflanka faller 63,9 grader i sitt bratteste vindu, og sørruta (30–40 grader) er mer skredutsatt enn nordruta, sier kilden. Blåisen er en isbre — linja holder morenen sør for isen, og det gjør du også i skodde.",
      },
      {
        title: "Før du går",
        body: "Kråkrøtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L30,195 L55,191 L73,184 L97,172 L113,165 L130,154 L149,145 L175,146 L201,142 L231,136 L252,128 L273,120 L289,115 L315,107 L334,101 L356,95 L376,87 L402,81 L420,73 L441,64 L459,59 L479,58 L505,51 L521,47 L541,44 L562,34 L583,25 L598,19 L600,18",
      startLabel: "16 moh",
      endLabel: "1186 moh",
      distanceLabel: "5,2 km",
      caption: "1193 høydemeter og 5,23 km fra Fornes: dalen til skoggrensa på 374, morenen sør for Blåisen på 997 — og passasjen fra 1059 til varden på 1186.",
    },
  },
  ristinden: {
    slug: "ristinden",
    intro:
      "1052 høydemeter og 4,11 km fra skolen på Ånstad til Ristinden — 1055,9 på skjermen mot publiserte 1055, og et fjell uten slak side: alle åtte flankemålingene gir 26,4–42,3 grader i snitt. Sørsiden om Breilifatet, med rampa på sørvestsiden til toppen. KAST 3 – Komplekst med alpinøks og stegjern; nedkjøringa er 30–40 grader før skrårenna på opp mot 45. Grad 4.",
    ascent: [
      "Fra parkeringa ved idrettsanlegget og skolen på Ånstad — 44 moh — går linja nordøst over lia på 87 og opp mot myrene på 296. Beltet fra 0 til 100 måler 3,2 grader over den første drøye kilometeren: rolig start på et fjell som ikke er det.",
      "Fra myrene mot Breilifatet — berget på 724 — og skoggrensa på 425 etter 2,4 km. Beltene fra 500 og oppover ligger jevnt på 19,8–23,9 grader: lia opp mot fatet er jevnt bratt hele veien.",
      "Rampa på sørvestsiden fra Breilifatet: det bratteste enkeltpartiet, 38,3 grader mellom 646 og 670 moh, ligger i inngangen til rampa, og beltet fra 800 til 900 er det bratteste i snitt med 23,9. SV-flanka måler 38,4 i snitt — men det bratteste vinduet (52,3) kommer først 270–330 m ut: rampa treffer terrenget der det gir etter. Varden står på 1056.",
    ],
    descent: [
      "Nedkjøringa er ca. 30–40 grader før skrårenna, som er opp mot 45, sier kilden — Breilifatet-linja krever stabil snø fra første sving. Johammarrenna, renna mellom Ristinden og naboen, holder rundt 45 og er reservevalget; Risenrenna på nordsiden måler også rundt 45.",
      "Østflanka faller 69,3 grader i vinduet 50–110 m ut og NE 60,1 rett under varden — det er dit du ikke skal. Ned samme rampe som opp, og fra myrene er det slake lia hjem til skolen.",
    ],
    avalanche: [
      {
        title: "Rampa og skrårenna",
        body: "30–40 grader før skrårenna på opp mot 45 — hele nedkjøringa ligger i skredterreng, og KAST 3 – Komplekst med alpinøks og stegjern er kildens dom. Et fjell uten slak side: alle åtte peilingene måler 26,4–42,3 i snitt. Stabil snø er inngangsbilletten, ikke et ønske.",
      },
      {
        title: "Rennene",
        body: "Johammarrenna og Risenrenna holder rundt 45 grader, og østflanka faller 69,3 i sitt bratteste vindu — variantene er for erfarne på utvalgte dager. I flatt lys er Breilifatet på 724 retningspunktet ned mot myrene.",
      },
      {
        title: "Før du går",
        body: "Ristinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L27,197 L54,199 L80,195 L113,194 L139,193 L165,190 L186,183 L211,173 L236,164 L257,156 L277,151 L304,144 L331,137 L344,132 L363,125 L382,118 L399,110 L412,104 L427,94 L437,91 L455,84 L465,80 L488,68 L501,61 L521,50 L539,41 L553,36 L564,30 L580,23 L600,18",
      startLabel: "44 moh",
      endLabel: "1056 moh",
      distanceLabel: "4,1 km",
      caption: "1052 høydemeter og 4,11 km fra skolen på Ånstad: lia og myrene til Breilifatet på 724 — og rampa på sørvestsiden, med det bratteste enkeltpartiet, 38,3 grader, mellom 646 og 670 moh.",
    },
  },
  snotinden: {
    slug: "snotinden",
    intro:
      "1242 høydemeter og 6,87 km fra Ånstad til den store klassikeren på Andørja — øya Fri Flyt kaller tettpakket med fjelltopper. Kilden gir KAST 3 – Komplekst med alpinøks og stegjern i utstyrslista og fem navngitte nedfarter der flere holder 45 grader; Vestsiden, linja på dette kortet, er den mildeste av dem, og selve oppturen måler 22,7 grader i bratteste hundremetersbelte og 28,1 i bratteste sammenhengende parti. Kortet bærer grad 4: fjellet rundt linja er grunnen.",
    ascent: [
      "Fra idrettsanlegget ved skolen på Ånstad — 9 moh på dyrket mark ved fylkesveien. Du følger veien mot Kvantobotn (91 moh der linja tar av), krysser Kvantoelva og går opp skogen øst for Snøfjellelva: beltene fra 100 til 400 moh måler 7 grader over veien og myrene, så bratner det — 20,9 grader fra 400 til 500 og turens bratteste belte, 22,7 grader over 253 meter grunn, fra 500 til 600, med det bratteste sammenhengende partiet på 28,1 mellom 630 og 648 moh. Skogen slutter på 402 moh etter 4,38 km.",
      "Over skogen passerer linja sør og sørøst for Snøfjellvatnet — på land hele veien; den første løsningen krysset 90 meter av vannet, og omrutingen står i forskningsposten — og tar vestflanken derfra: 15–18 grader i beltene fra 700 til 1000.",
      "De siste tre hundre høydemetrene holder 18–20 grader opp til varden på 1215. Registeret løser 1214,8, og rundt deg står Andørja-traversens tinder — Stortinden, Botntinden, Langlitinden — med fjorden på alle kanter.",
    ],
    descent: [
      "Vestsiden ned er sporet ditt opp — 20 til 35 grader mot Snøfjellvatnet ifølge kilden, og sørvestsektoren er målt til 15,8 grader i snitt, den slakeste på toppen. Lenger nede venter 30–40 grader med 45-graders parti der linja fra vannet faller mot skogen.",
      "De fire andre navngitte nedfartene — Bananene og Skreddalen, Sydsiden, Nordøstrenna (45–50 grader), Østbratta — henger i kanter som måler 31 til 41 grader i snitt med vinduer på 54 til 63 rett under varden. De er dokumenterte ekspertlinjer med dokumentert skredhistorikk, og de velges dagen etter stabiliteten, ikke omvendt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 3 – Komplekst hos Fri Flyt, alpinøks og stegjern i utstyrslista — og grad 4 på kortet selv om Vestsiden måler 28,1 på det bratteste: nedfarten passerer terreng på 30–40 grader med 45-graders parti, og alt rundt linja er brattere enn linja.",
      },
      {
        title: "Skredhistorikken",
        body: "Kilden dokumenterer skredhistorikk på de sørvendte hengene og vest for høyde 1018 — på selve normalveiens side av fjellet. Isingen nær tregrensa kommer i tillegg. Dette er en tur der varselet leses før bilen starter.",
      },
      {
        title: "Snøfjellvatnet",
        body: "Linja holder land sør for vannet. Naturlig vann og vinteris er ordinær ferdsel, men med 1215 meter fjell over deg er bredden det eneste stedet å stå når noe losner høyere oppe.",
      },
      {
        title: "Før du går",
        body: "Snøtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og alpinøks og stegjern, som kilden selv krever.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,198 L54,197 L75,193 L102,189 L121,191 L145,191 L173,186 L193,184 L214,182 L241,173 L269,165 L292,160 L320,155 L351,151 L378,144 L394,134 L408,124 L428,109 L443,100 L457,92 L474,83 L492,76 L508,68 L536,56 L551,45 L571,35 L587,24 L600,18",
      startLabel: "9 moh",
      endLabel: "1215 moh",
      distanceLabel: "6,9 km",
      caption: "1242 høydemeter og 6,87 km fra Ånstad øst for Snøfjellelva og sør for Snøfjellvatnet, med skoggrensa på 402 moh og det bratteste — 28,1 grader mellom 630 og 648 moh — i skoglia.",
    },
  },
  "storhornet-kvafjord": {
    slug: "storhornet-kvafjord",
    intro:
      "658 høydemeter og 8,22 km fra Kvæfjordeidet — solturen i rundelen, etter det kilden kaller Harstads alltid best preparerte løype opp til Koven og en slak, sørvendt rygg videre. Ingen hundremeter måler mer enn 9,5 grader, det bratteste sammenhengende partiet er 25,8, og toppen har ingen bratt side: alle åtte kanter måler 6 til 18 grader i snitt. Det bratte i turen finnes — sidene langs Vikelandselva — og løypa går ikke i dem.",
    ascent: [
      "Fra den store parkeringsplassen ved starten av Kvæfjordløypene, vest for Bjørklund — 175 moh. Løypa, preparert av entusiastene i Kvæfjordløyper, tar deg innover: beltene fra 200 til 400 moh måler 2 til 6 grader over kilometervis, og skogen slutter på 417 moh etter 6,11 km — mesteparten av turen er løypetur.",
      "Koven passeres på 415 moh — ut.no beskriver samme løype fra Kvæfjordeidet — og ryggen videre mot Storhornet er turens eneste stigning å snakke om: 9,5 grader i beltet fra 500 til 600, med det bratteste sammenhengende partiet på 25,8 mellom 476 og 494 moh der ryggen setter i gang.",
      "Varden på 722 — registeret løser 722,2 — med Kvæfjorden og Gullesfjorden under deg og appelsinen og kvikklunsjen kilden foreskriver på Koven. Ryggen gir tilbake 111 meter underveis, så hjemturen har sine egne små motbakker.",
    ],
    descent: [
      "Ned ryggen og løypa igjen — sørvendt og solfylt, og med 26,8 grader som det bratteste 60-metersvinduet på hele toppen er dette kjøring for alle føreforhold og de fleste bein.",
      "Kildens ene regel: ikke gå opp i de bratte fjellsidene langs Vikelandselva — det er skredterreng, og løypa holder seg unna dem. Følg den.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Enkelt hos Fri Flyt, og målingen er enig: 9,5 grader i bratteste belte, 25,8 i bratteste parti, og ingen bratt side på toppen. Dette er turen for dager da varselet sier at bratt terreng ikke er stedet å være — og øvingsturen for alle andre dager.",
      },
      {
        title: "Vikelandselva",
        body: "Kildens navngitte farepunkt: de bratte sidene langs elva er skredterreng. Løypa går ikke i dem, og sporet ditt trenger ikke gjøre det heller — snarveier her sparer minutter og satser resten.",
      },
      {
        title: "Før du går",
        body: "Storhornet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen november–april er Fri Flyts, med tidlig løypestart som en del av fjellets rykte. Sender/mottaker, søkestang og spade — også på løypetur.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,194 L48,183 L71,171 L94,171 L114,159 L134,157 L154,160 L173,162 L196,164 L219,160 L239,159 L262,155 L282,150 L298,134 L318,125 L337,135 L357,137 L377,136 L403,131 L423,126 L445,121 L465,105 L483,79 L502,63 L521,54 L544,47 L564,45 L587,25 L600,18",
      startLabel: "175 moh",
      endLabel: "722 moh",
      distanceLabel: "8,2 km",
      caption: "658 høydemeter og 8,22 km fra Kvæfjordeidet etter løypa til Koven og ryggen til varden, med skoggrensa på 417 moh og det bratteste — 25,8 grader mellom 476 og 494 moh — der ryggen setter i gang.",
    },
  },
  vetefjellet: {
    slug: "vetefjellet",
    intro:
      "392 høydemeter og 2,85 km over Olaåsen til Vetefjellet — et lekent skifjell med kort anmarsj, fin skogskjøring og noen brattheng over skoggrensa. KAST 1 – Enkelt på ruta over Helgevallan hos Fri Flyt. Grad 2.",
    ascent: [
      "Kilden gir to startsteder. Den nærmeste er en liten parkering ved hyttefeltet, på privat grunn, der kilden ber om godkjenning fra grunneier. Den andre er den store brøytede plassen ved skiløypene 1,5 kilometer lenger vest, med skogsvei over Olaåsen. Linja går derfra — 167 moh — fordi det er den av de to som finnes på kartet. Hyttefeltet ligger 1488 meter unna, som er de 1,5 kilometerne kilden oppgir, og veiene der leser 185 til 203 moh: Fri Flyts 350 høydemeter er regnet derfra, ikke herfra.",
      "Olaåsen er 221 moh, Helgevallan 297. Beltet fra 200 til 300 moh måler 4,9 grader over 1170 meter grunn: over en kilometer nesten flatt gjennom skogen, og det er den skogskjøringa kilden roser på vei ned. Fra Helgevallan går du mot høyde 361, som DTM1 leser til 362.",
      "Skogen slipper først på 419 moh etter 2,33 km, sent på en tur som er 2,85 kilometer lang. Flanken over er 445 moh. Det bratteste hundremetersbeltet måler 15,3 grader mellom 400 og 500 moh, over 344 meter grunn, og det bratteste enkeltsteget, 19,8 grader, ligger mellom 459 og 475. Toppen er 547.",
    ],
    descent: [
      "Ned samme veien: «fint åpent terreng i starten og det er mulig å holde høy fart i skogen også», skriver kilden. Over skoggrensa ligger de hengene kilden kaller morsomme å leke seg med — de ligger ved siden av linja, ikke på den, og kilden setter et vilkår om forholdene før du oppsøker dem.",
      "Toppflata er flat. Nordvest måler 1,9 grader i snitt over 500 meter og vest 3,8. Den bratteste radialen ut fra toppen er sør med 14,4 grader i snitt og et 29,5-vindu 260 til 320 meter ute, og nordøst 10,4 med 27,6 på 250 til 310.",
    ],
    avalanche: [
      {
        title: "Sidene, ikke ruta",
        body: "«På siden av denne ruten er det skrenter og partier som er skredutsatt så ruta må følges når det er skredfare», skriver Fri Flyt. Det er en instruks om å holde linja, ikke et råd. Målingen viser hvorfor det er lett å bomme: toppflata er nesten vannrett — 1,9 grader nordvest, 3,8 vest — så det finnes ingen helling som styrer deg tilbake på ruta i dårlig sikt.",
      },
      {
        title: "To grader på det samme fjellet",
        body: "Rute 1.8.1 over Helgevallan og høyde 361 er KAST 1 – Enkelt. Rute 1.8.2, den jevnere nedfarten via den samme høyden, er KAST 2 – Utfordrende og holder 20 til 25 grader hele veien. Samme fjell, samme høyde, ulik linje — og det er den andre kilden henger skrent-advarselen på. Kortet beskriver den første.",
      },
      {
        title: "Før du går",
        body: "Vetefjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,196 L47,190 L75,188 L99,185 L123,181 L150,174 L170,172 L198,164 L227,157 L247,152 L264,144 L283,141 L309,145 L331,141 L350,135 L373,130 L397,117 L416,107 L435,108 L463,94 L489,79 L511,67 L524,57 L539,45 L555,39 L577,30 L600,18",
      startLabel: "167 moh",
      endLabel: "547 moh",
      distanceLabel: "2,9 km",
      caption: "392 høydemeter og 2,85 km over Olaåsen: skogsveien, Helgevallan på 297 og høyde 361 — og toppflata på 547.",
    },
  },
  storlitinden: {
    slug: "storlitinden",
    intro:
      "446 høydemeter og 2,76 km fra den brøyta parkeringa ved Kvæfjordløypene til Storlitinden — fjellet ved sida av Vetefjellet, og den enklere av de to. KAST 1 – Enkelt hos Fri Flyt, som kaller det turen for deg som vil lett opp og lett ned. Grad 1.",
    ascent: [
      "Fra den store, alltid brøyta kommunale parkeringsplassen ved starten av Kvæfjordløypene — 167 moh — følger du traktorveien forbi Kvilheim, 214 moh, og går nordover over dyrka mark. Det er et par gjerdekryssinger underveis. Fri Flyt oppgir 400 høydemeter for turen, og det er fra Kvilheim: 613 minus 400 er 213, og Kvilheim leser 214. Beltet fra 100 til 200 moh måler 3,8 grader, og fra 200 til 300 er det 6,1 over 1012 meter grunn: den første kilometeren er nesten flat.",
      "På 285 moh går du på vestsida av Reingjerdhågen og svinger så til høyre, mellom granfeltene. Skogen slipper på 406 moh etter 1,87 km, like under punktet på 413. Over det følger linja den jevne skråninga som også er sommerruta — 543 moh — til toppen på 613.",
      "Det bratteste hundremetersbeltet måler 16,9 grader mellom 400 og 500 moh, over 360 meter grunn. Det bratteste enkeltsteget på hele linja er 19,8 grader mellom 454 og 470, og beltet fra 500 til 600 moh måler 10,5 grader over 496 meter grunn: toppartiet er en flate.",
    ],
    descent: [
      "Ned samme veien, og kildens egen advarsel gjelder sida: «Området til venstre (vest) er atskillig brattere og må ikke kjøres.» Målt fra toppen er sørvest 14,8 grader i snitt, men med et 33,6-vindu 250 til 310 meter ute, og sør 17,6 med 32,5 på 370 til 430. Det blir bratt der ute, ikke der linja går.",
      "Rutas egen side er den slake: nordøst måler 5,0 grader i snitt, nord 6,7, øst 9,0 og sørøst 10,9. Kilden er ærlig om hva slags topp dette er — «selv om det ikke er en skikkelig tind» — og målingen er enig.",
    ],
    avalanche: [
      {
        title: "Sida som ikke skal kjøres",
        body: "«Området til venstre (vest) er atskillig brattere og må ikke kjøres», skriver Fri Flyt, og målingen finner det. Sørvest holder 33,6 grader i et 60-metersvindu 250 til 310 meter ute fra toppen, og sør 32,5 på 370 til 430 — inne i det spennet der flakskred løsner oftest. Ruta holder seg øst for det hele veien, og det er hele forskjellen mellom denne turen og den ved sida av.",
      },
      {
        title: "Grad 1 er et valg om hvor du går",
        body: "Linjas bratteste enkeltsteg er 19,8 grader, og ingen del av ruta er brattere. Det tar ikke bort at du har en 33-graders side vest for deg når du kommer opp i beltet mellom 400 og 500 moh. En grad 1 er en egenskap ved sporet, ikke ved fjellet, og den holder bare så lenge du blir på det.",
      },
      {
        title: "Før du går",
        body: "Storlitinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen desember–april er Fri Flyts, og den lengste av de fem i denne runden. Sender/mottaker, søkestang og spade. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,195 L49,193 L68,191 L88,189 L107,187 L127,185 L146,181 L162,180 L191,172 L220,166 L240,163 L269,160 L298,153 L318,147 L337,136 L357,126 L386,111 L408,102 L426,93 L445,83 L465,70 L494,56 L514,48 L533,41 L553,33 L582,24 L600,18",
      startLabel: "167 moh",
      endLabel: "613 moh",
      distanceLabel: "2,8 km",
      caption: "446 høydemeter og 2,76 km fra Kvæfjordløypene: traktorveien forbi Kvilheim på 214, vest for Reingjerdhågen — og den jevne skråninga opp til 613.",
    },
  },
  "stortinden-rolla": {
    slug: "stortinden-rolla",
    intro:
      "984 høydemeter og 7,26 km fra Indre Forså til Rollas høyeste — Fri Flyt gir KAST 3 – Komplekst med alpinøks og stegjern, ofte skavlet topp, og ei renne på jevnt 30–40 grader som normalvei. Linja måler 21,4 grader i bratteste hundremetersbelte og 27,8 i bratteste sammenhengende parti, rett under toppen. Kildens oppgitte stigning, 1021, er toppens høyde duplisert inn i gain-feltet — kortet bærer linjas egne 980. Mevatnet er regulert, og linja runder det på land.",
    ascent: [
      "Fra Indre Forså ved fv. 848 på vestsida av Rolla — 85 moh, med begrenset parkering som krever grunneiers samtykke ifølge kilden; spør først, det er en del av turen. Innover myrene er det flatt: beltene fra 100 til 400 moh måler 2 til 5 grader, og skogen slutter først på 485 moh etter 5,67 km — en lang, stille inngang.",
      "Linja passerer sørenden av Mevatnet i skogen på østsida og følger så østbredden på land — vannet er regulert, og de to omrutingene som skulle til står i forskningsposten. Fra 500 bratner det: 14,8, 20,3 og 21,4 grader i beltene opp mot renna.",
      "Renna sør for toppen er nøkkelen: jevnt 30–40 grader ifølge kilden, og linjas bratteste sammenhengende parti måler 27,8 grader mellom 967 og 991 moh der den skrår inn. Toppen er ofte skavlet — varden på 1020 med Andørja i nord og havet i vest. Registeret løser 1020,0.",
    ],
    descent: [
      "Ned renna igjen når snøen er stabil — bratt, flott kjøring i terreng som er jevnt mellom 30 og 40 grader, sier kilden, og så de lange, slake myrene hjem. Sørøst- og nordvestsektoren er målt til 24 grader i snitt; renna i vest er 39,9.",
      "Drangen på østsida er den bratteste nedkjøringen uten tvil, sier kilden: starten er over 50 grader — målt 46,6 i snitt med 62,6 som bratteste vindu — og dagen for å kjøre her velges med omhu. Fra denne linja er den en annen tur.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 3 – Komplekst hos Fri Flyt, alpinøks og stegjern, og ei renne på 30–40 grader som normalvei — grad 4 på kortet selv om linjas skrålinje måler 27,8: renna krever stabil snø, og det finnes ingen slak vei opp det siste.",
      },
      {
        title: "Skavlen",
        body: "Toppen er ofte skavlet, sier kilden. Kanten henger mot øst — mot Drangen-sida, der det måler 62,6 grader i det første vinduet. Varden besøkes fra vest, og i flatt lys med god margin.",
      },
      {
        title: "Mevatnet",
        body: "Regulert vann — linja holder østbredden på land, og det bør sporet ditt også. Regulert is sprekker langs land når magasinet tappes, og myrene rundt gir tørt land hele veien.",
      },
      {
        title: "Før du går",
        body: "Stortinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og alpinøks og stegjern.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,194 L44,190 L68,186 L89,178 L119,171 L141,167 L161,173 L186,164 L204,163 L230,161 L256,162 L281,163 L305,162 L331,160 L357,155 L379,152 L401,149 L423,143 L450,135 L464,123 L487,110 L509,96 L523,84 L539,69 L556,52 L571,41 L587,28 L598,19 L600,18",
      startLabel: "85 moh",
      endLabel: "1020 moh",
      distanceLabel: "7,3 km",
      caption: "984 høydemeter og 7,26 km fra Indre Forså over myrene og langs østsida av Mevatnet, med skoggrensa på 485 moh og det bratteste — 27,8 grader mellom 967 og 991 moh — i renna sør for toppen.",
    },
  },
  rundtind: {
    slug: "rundtind",
    intro:
      "880 høydemeter og 5,97 km fra Holtet til Rundtind — den enkleste veien opp på en av toppene på Drangen-ryggen, med pinakkelen Tottålen rett øst for varden. KAST 3 – Komplekst hos Fri Flyt, men uten øks og stegjern på lista: det som gjør den kompleks er hvor lenge den ligger i utløpssone. Grad 3.",
    ascent: [
      "Fra Holtet, der traktorveien tar av og går opp til hyttefeltet — 30 moh. Kilden er tydelig på parkeringa: det er få plasser her, så ha en plan, og få godkjenning fra grunneieren. Beltet fra 0 til 100 moh måler 18,8 grader over 214 meter grunn — svingene opp fra fjorden er det bratteste på hele den nedre halvdelen.",
      "Veien er Mevassveien opp til 161 moh og Drangenveien videre fra 225 til veienden på 246, ved Sandvatnet. Beltet fra 200 til 300 moh måler 2,2 grader over 2654 meter grunn: to og en halv kilometer nesten vannrett, først vei og så myr. Ruta går rundt magasinet, ikke over, og så innover myrene til 317 moh nordøst for Skavbakkan.",
      "Derfra tar oppstigninga til, over skoggrensa på 475 moh. Skogen slipper på 426 moh etter 4,36 km. Det bratteste hundremetersbeltet måler 19,2 grader mellom 500 og 600 moh, over 278 meter grunn, og det bratteste enkeltsteget, 24,8 grader, ligger mellom 615 og 635. Så er det ryggen mot Mellatinden — 732 moh — og toppen på 872.",
    ],
    descent: [
      "Ned samme veien. Kilden lover «flott cruising ned der man kan få høy fart og virkelig nyte sola», og sier i samme åndedrag at nedkjøringa har noen få heng brattere enn 30 grader. Målt langs linja er beltet fra 600 til 700 moh 16,4 grader, 700 til 800 er 17,6 og 800 til 900 er 14,2.",
      "Fra toppryggen kan du fortsette til Mellatinden og videre til Stortinden, sier kilden. Radialen nordover fra varden måler 1,0 grader i snitt over 500 meter, som er hvorfor det er mulig. Øst er den bratte sida: 33,5 grader i snitt med et 56,3-vindu på de første seksti meterne, og det er der Tottålen står.",
    ],
    avalanche: [
      {
        title: "Tida i utløpssona",
        body: "«Man tilbringer noe tid i utløpssone for skred», skriver Fri Flyt om denne ruta, og det er hele begrunnelsen for KAST 3 – Komplekst på et fjell uten øks og stegjern på lista. Linja selv er slak — 19,2 grader i det bratteste hundremetersbeltet — men vestsida over den måler 31,2 grader i snitt med et 38,8-vindu tjue til åtti meter fra varden. Det er ikke hvor bratt du står som avgjør her, det er hva som henger over deg.",
      },
      {
        title: "Sandvatnet er et magasin",
        body: "Veienden ved hyttefeltet ligger ved Sandvatnet, som NVE fører som magasin 743: høyeste regulerte vannstand 240 moh, laveste 231. Ni meter regulering betyr at isen kan være hul, oppbrukket eller borte, og den ser lik ut ovenfra uansett. Kilden går ikke over vatnet — den sier «gå innover myrene» — og linja her gjør det samme, med null meter på is.",
      },
      {
        title: "Før du går",
        body: "Rundtind ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Østruta fra Selset er ikke beskrevet med en linje i kilden, bare med «bare å velge og vrake» — den er ikke denne. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,184 L44,173 L67,166 L87,159 L111,158 L130,155 L157,152 L185,149 L212,151 L234,152 L257,151 L284,153 L316,151 L338,142 L361,138 L384,136 L406,130 L433,117 L456,109 L476,99 L492,87 L511,74 L533,60 L554,44 L574,32 L596,19 L600,18",
      startLabel: "30 moh",
      endLabel: "872 moh",
      distanceLabel: "6,0 km",
      caption: "880 høydemeter og 5,97 km fra Holtet: Mevassveien og Drangenveien til veienden på 246, rundt Sandvatnet og over myrene — og opp nordøst for Skavbakkan til 872.",
    },
  },
  sula: {
    slug: "sula",
    intro:
      "827 høydemeter og 3,82 km fra Breivoll til Sula på Rolla — M-fjellet, som sammen med naboen Sæta tegner formasjonen du ser fra Harstad. Den jevne traktorveien, opp Skogsheia der skogen tynnes, og nesten rett linje til toppen på 848. KAST 1 – Enkelt hos Fri Flyt, med heng på litt over 20 grader — og modellen er enig: 21,9 på det bratteste enkeltpartiet. Grad 2, i den lette enden — og populær fordi fjellski også duger.",
    ascent: [
      "Fra den lille parkeringa der skogsveien tar av fra Ibestadveien nær Breivoll småbåthavn — 22 moh — følger du den jevne, fine traktorveien: 48 moh der linja står i den, og krysset på 68 der veien videre velges. Beltet fra 0 til 100 måler 6,1 grader over den første snaue kilometeren.",
      "Der veien begynner å bikke nedover tar du av oppover Skogsheia — 514 moh der linja er festet — og skogen tynnes: skoggrensa ligger på 458 etter 2,11 km. Hold litt til venstre for det bratte terrenget rett fram, som kilden sier.",
      "Så er det nesten rett linje til toppen: lia fra 668, beltet fra 700 til 800 som det bratteste i snitt med 17,0 grader — og det bratteste enkeltpartiet på hele turen, 21,9 grader mellom 771 og 789 moh, rett under varden på 848.",
    ],
    descent: [
      "Et stort område å boltre seg på, sier kilden — åpen flankekjøring og lett skogskjøring, mye langs samme vei som opp. SE-flanka fra varden, der ruta ligger, måler 14,7 grader i snitt, og det bratteste vinduet (20,5) kommer først 180–240 m ut.",
      "Men M-fjellet har stup rundt hele toppen utenom ruta: de andre kantene måler 24,1–36,4 grader i snitt med vindu på 50–69 tett på varden. Gå ned dit du kom opp — sørøst — før du slipper skiene.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, heng på litt over 20 grader — og modellen er enig: 17,0 i det bratteste beltet, 21,9 i det bratteste enkeltpartiet. Kildens ord om at Sula brukes når skredfaren truer andre topper står som kildens vurdering — varselet leses uansett.",
      },
      {
        title: "Kantene",
        body: "Utenom ruta har toppen vindu på 50–69 grader tett på varden — NE, SV og V faller bratt fra første meter. I skodde er retningen alt: sørøst fra varden, mot Skogsheia, og traktorveien tar imot.",
      },
      {
        title: "Før du går",
        body: "Sula ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,197 L49,195 L70,193 L89,190 L112,184 L134,178 L155,170 L177,161 L198,152 L212,147 L234,142 L254,135 L273,128 L293,120 L315,112 L329,105 L353,96 L374,92 L395,88 L417,82 L445,75 L467,68 L493,58 L513,53 L530,46 L551,38 L572,28 L596,19 L600,18",
      startLabel: "22 moh",
      endLabel: "848 moh",
      distanceLabel: "3,8 km",
      caption: "827 høydemeter og 3,82 km fra Breivoll: traktorveien til krysset på 68, opp Skogsheia fra 514 — og nesten rett linje til varden på 848, med 21,9 grader som det bratteste enkeltpartiet.",
    },
  },
  heia: {
    slug: "heia",
    intro:
      "466 høydemeter og 2,19 km fra fotballbanen ved Krafthallen til Heia — den gamle alpinbakken i Harstad, og den turen byen faktisk går. Kilden skriver at det som regel står lys i bakken om kvelden når det er snø, og at fjellet har effektive høydemeter og en hytte underveis som er verdt mer enn et besøk. KAST 1 – Enkelt. Grad 1.",
    ascent: [
      "Fra parkeringa ved fotballbanen — 63 moh — går ruta langs venstresida av myra på sti i skogen: 113 moh der korridoren står. Så ut av skogen og opp det åpne feltet der sommerstien går, 205 moh.",
      "Maistua ligger halvveis, på 321 moh. Den var radiolink før, ble pusset opp høsten 2018, og krever DNT-nøkkel; kilden kaller utsikten fantastisk og stedet et moderne avslapningssted uten sidestykke. Det bratteste hundremetersbeltet måler 20,2 grader mellom 200 og 300 moh, over 263 meter grunn, og det bratteste enkeltsteget på hele linja, 25,0 grader, ligger mellom 260 og 281 moh — altså rett under hytta.",
      "Etter det flate partiet ved Maistua skrår ruta opp litt sørover, og skogen slipper på 375 moh etter 1,35 km. Over tregrensa følger du ryggen — 481 moh der korridoren er festet — til varden på 527. Ryggen kan være avblåst og bar eller vindpåvirket, og kilden sier at de fleste derfor stopper et stykke nord for toppen.",
    ],
    descent: [
      "Samme vei ned, men helt ned langs det åpne feltet, over gjerdet under kraftlinja og gjennom skogen til fotballbanen. Mange går flere runder — kilden beskriver treningsøkter med tre turer på en kveld, feller på og av, og 1200 høydemeter til sammen. Kilden gir to varianter til: østsida av toppen, der snøen er best, ned heistraseen; og en linje sørøstover ned den ryddede sommerstien i Blåbæråsen til barnehagen ved Høgholtet.",
      "Alle tre er KAST 1 og for det meste 20–30 grader. Men kilden er like tydelig på det som ligger utenfor dem: der kan du «enkelt oppsøke heng på 40 grader». Flankesveipet finner dem — nord for varden ligger et 40,6-vindu 170–230 meter ute og nordvest 46,0 på 160–220.",
    ],
    avalanche: [
      {
        title: "Førti grader, en sving unna",
        body: "Heia er et KAST 1-fjell med KAST 3-terreng ved siden av seg. Kilden skriver rett ut at utenfor de tre beskrevne rutene kan du lett finne heng på 40 grader, og at det bare skal gjøres når snøen er stabil. Målinga bekrefter det: 40,6 grader nord for toppen og 46,0 nordvest. De tre rutene holder seg på 20–30.",
      },
      {
        title: "Toppryggen",
        body: "De siste meterne er ofte avblåste, bare eller vindpåvirkede, og kilden sier at de fleste stopper et stykke nord for toppen. Det er ikke en skredadvarsel, men en forklaring på hvorfor sporet stopper der det gjør — og på godværsdager er varden verdt de siste meterne til fots.",
      },
      {
        title: "Før du går",
        body: "Heia ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen desember–april er Fri Flyts, og den lengste i runden — dette er fjellet som holder snø når byen ikke gjør det. Sender/mottaker, søkestang og spade, også på en kveldstur ti minutter fra bilen. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,195 L37,195 L62,192 L87,188 L99,185 L111,185 L126,180 L148,171 L161,166 L185,154 L208,149 L217,145 L226,141 L242,133 L259,123 L284,109 L296,104 L309,99 L318,99 L333,96 L345,91 L364,81 L382,73 L395,69 L407,62 L419,58 L432,53 L444,47 L456,42 L481,36 L495,34 L518,31 L542,27 L565,22 L577,22 L592,20 L600,18",
      startLabel: "63 moh",
      endLabel: "527 moh",
      distanceLabel: "2,2 km",
      caption: "466 høydemeter og 2,19 km fra Krafthallen: myra, det åpne feltet og Maistua på 321 — og ryggen over tregrensa til varden på 527.",
    },
  },
  hinnstein: {
    slug: "hinnstein",
    intro:
      "510 høydemeter og 2,90 km fra Breivikhaugen til Hinnstein — et av de mest brukte turområdene i Harstad, på linje med Heia, og et fjell med bratte sider. Kilden er kort og alvorlig om den mest populære av dem: «det er sørøstsiden som tiltrekker flest skikjørere, men vær obs på at flere er tatt av skred der.» KAST 3 – Komplekst. Grad 3.",
    ascent: [
      "Fra den lille parkeringa øverst i Breivikhaugen — 51 moh, og ikke steng snuplassen — følger ruta skogsveien som grunneierne etablerte i 2016: 154 moh der korridoren står i den. Forbi gapahuken på 220.",
      "Derfra sikter du på skråningen mellom Litle Hinnstein og Hinnstein — 457 moh — som i gamle dager ble brukt til hoppbakke. Litle Hinnstein er et eget registerført punkt og måler 502 moh; det er den lavere av de to.",
      "Så stien opp på sørvestsida av Hinnstein, 531 moh der korridoren er festet, til varden på 560. Skogen slipper først på 496 moh etter 2,51 km — nesten hele turen går i skog. Det bratteste hundremetersbeltet måler 13,6 grader mellom 400 og 500 moh, over 426 meter grunn, og det bratteste enkeltsteget, 23,7 grader, ligger mellom 394 og 408.",
    ],
    descent: [
      "Kilden er ærlig om starten: nedkjøringa fra Hinnstein gir lite flyt i begynnelsen på grunn av kratt, lite snø og steiner, og mange setter skiene igjen og går ned samme veien. Etter det er det slak cruising i terreng som ikke er brattere enn 30 grader.",
      "Framsida er en annen sak. Sørøst 2 holder 35–45 grader, med det enkleste lengst sør på fjellet og rett ned mot skogsveien. Flankesveipet plasserer resten: nordvest faller 50,5 grader bare 10–70 meter fra varden, nord 44,3 på 30–90 og vest 42,8 på 20–80. Sørvest, der ruta går, er den slake sida med 12,6 grader i snitt.",
    ],
    avalanche: [
      {
        title: "Sørøstsida",
        body: "Dette er sida flest kjører, og kildens egen setning om den er at flere er tatt av skred der. Den måler 26,9 grader i snitt med et 40,4-vindu 180–240 meter ute, og Sørøst 2 på framsida holder 35–45. Ingen av tallene er ekstreme; historikken er poenget, og den hører til et fjell femten minutter fra byen.",
      },
      {
        title: "Nordvestsida er avskåret",
        body: "Toppen har en side som ikke er en vei: nordvest faller 50,5 grader innenfor de første 70 metrene fra varden, og nord og vest 44,3 og 42,8 like tett på. Ruta kommer opp sørvestsida, som er slak — men på en topp så liten er kanten nærmere enn den ser ut.",
      },
      {
        title: "Før du går",
        body: "Hinnstein ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Skogsveien fra 2016 er grunneiernes gave til turfolket — parker der du skal, og la snuplassen være åpen. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L18,199 L45,192 L64,190 L84,184 L101,174 L127,165 L139,159 L159,154 L185,149 L206,145 L232,139 L260,131 L278,124 L297,120 L315,113 L334,107 L362,100 L381,98 L409,94 L423,85 L437,76 L455,64 L481,57 L493,55 L508,48 L521,41 L536,32 L551,27 L567,22 L595,19 L600,18",
      startLabel: "51 moh",
      endLabel: "560 moh",
      distanceLabel: "2,9 km",
      caption: "510 høydemeter og 2,90 km fra Breivikhaugen: skogsveien fra 2016, gapahuken og den gamle hoppbakken — og sørvestsida til varden på 560.",
    },
  },
  lasselitinden: {
    slug: "lasselitinden",
    intro:
      "863 høydemeter og 3,62 km fra Storelvas utløp til Lasselitinden vest på Rolla — 895,8 på skjermen mot publiserte 896. Rollryggen: opp lia fra fv. 848 og sørryggen til topps på 20–30 grader. KAST 2 – Utfordrende med alpinøks og stegjern — grad 3 etter Gråfjell-regelen, og skavlene i Djupedalen er grunnen til å holde sporet.",
    ascent: [
      "Fra den vesle parkeringa på nedsida av fv. 848 der Storelva renner ut i havet — 39 moh — går linja opp lia østover: skoggrensa ligger på 327 etter 1,62 km, og beltet fra 0 til 100 måler 4,4 grader langs elva før lia tar til.",
      "Opp lia til 435 og inn på Rollryggen fra 682: beltet fra 500 til 600 er det bratteste i snitt med 24,2 grader, og det bratteste enkeltpartiet, 31,3 grader mellom 565 og 597 moh, ligger i innsteget til ryggen.",
      "Sørryggen mot toppen fra 798 — kjøring for ferske på stabile dager, sier kilden om ryggen, og målinga er enig: Rollryggen fra sør leser 15,0 grader i snitt. Varden står på 896, og N/NV stiger svakt videre — ryggen fortsetter.",
    ],
    descent: [
      "Samme rygg hjem: 20–30 grader hos kilden. Vestsida mot Brustindvatnet på 629 er den slake varianten; Heimerdalen (30–40) krever mer, og Djupedalen (45–50, ofte skavl som må hoppes) er for erfarne på utvalgte dager.",
      "NE-flanka faller 29,7 grader i snitt med 51,7-vindu 190–250 m ut — det er dit Djupedalen og skavlene hører. Hold ryggen i skodde: kantene mot nordøst kommer før du ser dem.",
    ],
    avalanche: [
      {
        title: "Skavlene",
        body: "Skavler er gjennomgangstemaet på Lasselitinden — Djupedalen-variantene starter ofte med skavlhopp, og NE-flanka leser 51,7 i sitt bratteste vindu. Øksa og stegjerna i lista er for skare på ryggen; avstanden til kanten er din egen.",
      },
      {
        title: "Variantene",
        body: "Heimerdalen (30–40 grader) og Djupedalen (45–50) er skredterreng som krever stabil snø — Rollryggen på 20–30 er linja som alltid går, og vestsida mot Brustindvatnet er utveien når været stenger ryggen.",
      },
      {
        title: "Før du går",
        body: "Lasselitinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,198 L45,197 L60,197 L82,195 L97,191 L112,189 L129,188 L149,184 L172,177 L191,170 L209,161 L231,150 L247,146 L268,139 L284,132 L306,125 L330,119 L350,115 L365,109 L380,104 L400,96 L411,90 L422,81 L433,77 L455,68 L471,64 L485,56 L515,50 L545,42 L567,33 L585,25 L600,18",
      startLabel: "39 moh",
      endLabel: "896 moh",
      distanceLabel: "3,6 km",
      caption: "863 høydemeter og 3,62 km fra Storelvas utløp på fv. 848: opp lia til 435, Rollryggen fra 682 — og sørryggen til varden på 896, med det bratteste enkeltpartiet, 31,3 grader, i innsteget.",
    },
  },
  hemmestadfjellet: {
    slug: "hemmestadfjellet",
    intro:
      "679 høydemeter og 3,88 km fra Vebbestadsætran til Hemmestadfjellet — 686,5 på skjermen mot publiserte 687, og KAST 1 – Enkelt hos Fri Flyt på nordruta: jevn og lett kjøring med parti på 20 grader, fin for ferske. Traktorveien gjennom granfeltet og ryggen vest for Vebbestadvatnet til topps. Grad 2 — vestruta fra Skommesvik er KAST 3 og en annen linje.",
    ascent: [
      "Fra lomma ved Vebbestadsætran langs fv. 850 — 38 moh — går traktorveien gjennom granfeltet: 359 moh der linja står i den, og skoggrensa ligger på 412 etter 2,39 km. Beltene fra 100 til 300 måler 18,4 og 20,3 grader gjennom skogslia.",
      "Ryggen vest for Vebbestadvatnet fra 418: beltet fra 300 til 400 måler 5,2 grader over en drøy kilometer — velg terrenget med best snødekke over tregrensa, sier kilden.",
      "Sluttbakken: beltet fra 500 til 600 er det bratteste i snitt med 25,2 grader, og det bratteste enkeltpartiet, 34,9, ligger mellom 570 og 592 moh — rett under toppflata på 686.",
    ],
    descent: [
      "Nordruta hjem er jevn og lett kjøring med parti på 20 grader — fin for ferske, sier kilden, og V/NV-flankene måler 7,8–9,7 i snitt. SV mot Horntindan er flat: 0,5 grader i snitt langs ryggen.",
      "Østsida mot Vebbestadvatnet måler 30,5 i snitt, og nordsida har et 52,7-vindu — vestruta fra Skommesvik holder over 30 grader og er klasset Komplekst. Grad 2-turen er nordruta, og bare den.",
      "Vestsida er den andre ruta: 668 høydemeter på 2,44 km fra lomma ved Gammelgårdsbukta, forbi Skommesvik på 74 moh og opp gjennom lia til T-krysset på kraftlinja, 341. Kilden kaller den «en mye brattere variant enn nordsiden» der «over 30 grader er normalt»; linja her måler 26,2 grader i det bratteste steget mellom 450 og 470 moh og 23,0 i det bratteste hundremetersbeltet mellom 400 og 500. At den blir gått opp og ikke bare ned, står i nabofjellets tekst: Horntindan-ruta åpner «Parker ved Skommesvik, gå opp mot Hemmestadfjellet og deretter ryggen sørover til Horntindan.»",
    ],
    avalanche: [
      {
        title: "Sluttbakken",
        body: "Det bratteste på linja ligger samlet mellom 500 og 600: 25,2 grader i snitt og 34,9 i det bratteste enkeltpartiet. Kort, men bratt nok til å bære flak — vurder bakken før du går inn i den, og ta ryggen utenom om snøen kjennes usikker.",
      },
      {
        title: "Østsida",
        body: "Østsida mot Vebbestadvatnet måler 30,5 grader i snitt, og nordsida har et 52,7-vindu. Nordruta ligger vest for vatnet — kanten mot øst er grunnen til at KAST 1-klassen gjelder ruta, ikke fjellet.",
      },
      {
        title: "Før du går",
        body: "Hemmestadfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L28,199 L49,198 L77,189 L98,182 L113,174 L131,165 L140,159 L153,148 L167,139 L195,122 L216,113 L237,109 L258,103 L279,99 L297,99 L317,99 L341,99 L356,94 L382,95 L404,98 L419,99 L445,90 L457,84 L473,78 L494,68 L510,54 L522,43 L543,36 L564,29 L585,22 L600,18",
      startLabel: "38 moh",
      endLabel: "686 moh",
      distanceLabel: "3,9 km",
      caption: "679 høydemeter og 3,88 km fra Vebbestadsætran: traktorveien gjennom granfeltet, ryggen vest for Vebbestadvatnet — og sluttbakken, 34,9 grader på det bratteste mellom 570 og 592 moh.",
    },
  },
  "middagstinden-kvafjord": {
    slug: "middagstinden-kvafjord",
    intro:
      "910 høydemeter og 4,1 km fra Hundstadsætran til Middagstinden i Kvæfjord — 921,9 på skjermen mot publiserte 923, og 922-kulen fra forrige rundes Tverrfjellet-arbeid: to kandidattopper skilt av et skar på rundt 576 viste seg å være to fjell, og nå har begge hver sin tur, fra hver sin fjord. KAST 3 – Komplekst med alpinøks og stegjern; partiet over den store steinen holder 45–50 grader og er ofte hard skare. Grad 4.",
    ascent: [
      "Fra parkeringa ved Hundstadsætran — 20 moh langs fv. 850 Revsnesveien; kildens F83 er dagens fylkesveg — skrått mot Vebbestadelva på 207 og inn på traktorveien: skoggrensa ligger på 346 allerede etter 1,39 km.",
      "Traktorveien opp til Vebbestadvatnet — linja holder land i nordenden, 400 moh — og østover fra 617: beltet fra 400 til 500 måler 7,3 grader over vatnet-platået, før fjellet reiser seg.",
      "Toppflanken fra 854: etter den store steinen blir det brattere — ofte hard skare, og kilden gir partiet 45–50 grader. Det bratteste enkeltpartiet i modellen ligger mellom 650 og 675 moh og måler 31,4; kildens 45–50 bor i NV-vinduet, som måler 41,9.",
    ],
    descent: [
      "Vestsida er favoritten når sør- og østvendte fjell er avblåst, sier kilden: 30–50 grader ned mot traktorveien vest for Salelva. Vest, der ruta kommer, er slakest på flankemålinga med 24,0 i snitt.",
      "Østlinjene Mellomrenna, Varderenna og Håvards Drøm (30–50 grader) krever stabil snø; NE og E måler 38–39 i snitt med 55,9-vindu rett under varden. Ned samme vei som opp er linja med færrest spørsmål.",
    ],
    avalanche: [
      {
        title: "Steinen",
        body: "Partiet over den store steinen holder 45–50 grader og er ofte hard skare — KAST 3 – Komplekst, alpinøks og stegjern. Et fall her stopper ikke av seg selv: vent på dagen der skara har sluppet, eller snu ved steinen.",
      },
      {
        title: "Østlinjene",
        body: "Mellomrenna, Varderenna og Håvards Drøm måler 30–50 grader, og NE/E-flanken leser 38–39 i snitt med 55,9-vindu rett under varden. Varden står på kanten av dem — gå ikke lenger øst enn du må.",
      },
      {
        title: "Før du går",
        body: "Middagstinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,193 L59,182 L81,172 L105,162 L138,150 L164,145 L191,139 L214,131 L237,124 L266,123 L283,123 L302,123 L322,122 L335,115 L353,111 L375,99 L401,89 L434,83 L454,78 L467,73 L486,58 L500,52 L516,44 L532,35 L555,29 L578,22 L600,18",
      startLabel: "20 moh",
      endLabel: "922 moh",
      distanceLabel: "4,1 km",
      caption: "910 høydemeter og 4,1 km fra Hundstadsætran: traktorveien til Vebbestadvatnet på land i nordenden, østover fra 617 — og partiet over den store steinen, 45–50 grader hos kilden, mot toppen på 922.",
    },
  },
  nattmalsfjellet: {
    slug: "nattmalsfjellet",
    intro:
      "479 høydemeter og 2,69 km fra Kilkam idrettsanlegg til Nattmålsfjellet — det nærmeste skifjellet i Kilbotn, og det i runden der kilden er tydeligst om at inntrykket lyver. «Selv om Nattmålsfjellet ser enkelt ut er det flere plasser det kan gå skred, og det har også gått skred der.» KAST 2 – Utfordrende på normalruta; alle andre oppstigninger på nordsida er KAST 3. Grad 3.",
    ascent: [
      "Fra den store parkeringa ved idrettsanlegget — 85 moh — følger du skisporet forbi barnehagen: 89 moh der korridoren står, nesten flatt. Beltet fra 0 til 100 moh måler 1,7 grader, over 673 meter grunn.",
      "Så av sporet sørover der fjellet er nærmest, på åsryggen før Nattmålsfjellvatnet — 237 moh. Skogen slipper på 284 etter 1,68 km. Nærmere tregrensa holder du på høyresida, vestsida, av en liten kolle: 279 moh der korridoren er festet.",
      "Derfra det store åpne området opp mot toppen. De siste hundre høydemeterne går i en slukt som er forlengelsen av elva ned mot sørsida av Nattmålsfjellvatnet — 393 moh der korridoren står i den. Det bratteste hundremetersbeltet måler 15,1 grader mellom 300 og 400 moh, over 392 meter grunn, og det bratteste enkeltsteget, 22,0 grader, ligger mellom 422 og 441. Varden er 546.",
    ],
    descent: [
      "Ned samme veien. Nedkjøringa er ikke brattere enn 30 grader, sier kilden — men den er omgitt av brattere områder, og du befinner deg av og til i utløpssoner. Det er en annen setning enn «slak», og den er verdt å lese to ganger.",
      "Flankesveipet viser samme bildet: selve toppen er slak til alle kanter — 3,3 grader i snitt mot sørøst, 5,1 mot sørvest, 5,3 mot sør — mens de bratteste vinduene ligger langt ute, 34,5 grader 300–360 meter mot nordøst og 35,3 på 440–500 mot sørøst. Det er dem du kan havne under, ikke dem du står i.",
    ],
    avalanche: [
      {
        title: "Utløpssonene",
        body: "Dette er fjellet der terrengfella ikke er under skia dine, men over dem. Nedkjøringa holder seg under 30 grader og toppen er slak, men rundt ligger brattere områder, og kilden sier at du av og til er i utløpssoner. Målinga finner de bratteste partiene 300 til 500 meter ute på nordøst- og sørøstsida. Vurder hva som henger over sporet, ikke bare hva du står på.",
      },
      {
        title: "Nord 2 og resten av nordsida",
        body: "Alle andre ruter opp på nordsida enn Nord 1 er KAST 3, sier kilden. Nord 2 går ned bratte slukter og søkk mot det åpne området over lysløypa. På det området ligger Okshola, en om lag 300 meter lang grotte med en elv gjennom seg og en utgang som til vanlig er fylt med vann — verdt et besøk, men ikke en utvei.",
      },
      {
        title: "Før du går",
        body: "Nattmålsfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og på dette fjellet særlig: det har gått skred her, og det ser ikke slik ut. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L20,198 L40,200 L60,200 L90,198 L114,198 L140,193 L160,188 L180,184 L200,178 L215,170 L234,157 L252,148 L281,138 L301,129 L331,119 L351,117 L371,121 L384,114 L401,105 L421,95 L441,88 L462,78 L482,72 L502,70 L518,59 L527,53 L542,45 L562,34 L592,20 L600,18",
      startLabel: "85 moh",
      endLabel: "546 moh",
      distanceLabel: "2,7 km",
      caption: "479 høydemeter og 2,69 km fra Kilkam: skisporet forbi barnehagen, åsryggen sørover — og slukta sør for Nattmålsfjellvatnet til varden på 546.",
    },
  },
  horntindan: {
    slug: "horntindan",
    intro:
      "934 høydemeter og 3,9 km fra Skommesvik til Horntindan — 910,9 på skjermen mot publiserte 910, og horna som ga fjellet navn måler 61,8–64,0 grader i sine første vindu mot nord og nordøst. Opp mot Hemmestadfjellet og ryggen sørover, samme rygg som Hemmestadfjellet-turen bruker. KAST 3 – Komplekst med alpinøks og stegjern; normalnedkjøringa over Hornflata måler 35–40 grader. Grad 4.",
    ascent: [
      "Starten er servicevegen fra fv. 850 Revsnesveien ved Skommesvik — 22 moh; registerpunktet for garden lå over 250 m fra kartlagt veg, og kilden nevner også parkering ved Gammelgårdsbukta. Opp lia til 469: beltet fra 400 til 500 er det bratteste i snitt med 21,8 grader, og skoggrensa ligger på 396 etter 1,28 km.",
      "Sør for Hemmestadfjellet på 673 og inn på ryggen sørover fra 699 — beltet fra 600 til 700 måler 6,3 grader over nesten en kilometer: ryggen er transportetappen mellom de to fjellene.",
      "Toppstøtet: det bratteste enkeltpartiet på linja, 29,4 grader, ligger mellom 870 og 889 moh rett under varden på 911. SE-flanken der ryggen kommer måler 10,1 i snitt — inngangen er snillere enn navnet.",
    ],
    descent: [
      "Normalnedkjøringa går nordvest over Hornflata og ned renna — 35–40 grader, og den ender i bekkeformasjon ved tregrensa, sier kilden. NV-flanken måler 12,8 i snitt, men med et 49,4-vindu nær toppen: kjør Hornflata på stabil snø, eller ta ryggen tilbake.",
      "Vestrenna er den bratteste nedkjøringa i området — bare for erfarne, på stabil snø. N/NE-flankene måler 61,8–64,0 grader i sine første vindu: horna er til å se på, ikke å kjøre.",
    ],
    avalanche: [
      {
        title: "Hornflata",
        body: "Normalnedkjøringa over Hornflata og ned renna måler 35–40 grader og ender i bekkeformasjon ved tregrensa — terrengfella kilden selv peker på. KAST 3 – Komplekst: flata og renna henger sammen, og snø som losner over flata samles i renna.",
      },
      {
        title: "Horna",
        body: "N/NE-flankene måler 61,8–64,0 grader i sine første vindu — det er horna som ga fjellet navn. Ryggen fra Hemmestadfjellet, med 10,1 i snitt fra SE, er inngangen som holder deg unna dem begge.",
      },
      {
        title: "Før du går",
        body: "Horntindan ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L28,193 L50,185 L84,174 L98,167 L125,159 L153,147 L167,139 L188,130 L201,121 L222,112 L243,99 L264,89 L298,75 L326,67 L354,64 L386,63 L416,62 L430,57 L458,49 L479,41 L502,37 L520,30 L534,23 L553,23 L576,28 L594,20 L600,18",
      startLabel: "22 moh",
      endLabel: "911 moh",
      distanceLabel: "3,9 km",
      caption: "934 høydemeter og 3,9 km fra Skommesvik: opp lia til skoggrensa på 396, sør for Hemmestadfjellet på 673 — og ryggen sørover til toppstøtet, 29,4 grader mellom 870 og 889 moh.",
    },
  },
  tverrfjellet: {
    slug: "tverrfjellet",
    intro:
      "885 høydemeter og 5,53 km fra fjorden ved Melåa til et fjell registeret ikke har navn på: Tverrfjellet er kildens og nabolagets navn — Tverrfjellelva drenerer det og Tverrelvfoten står under det — og toppen leser 888,9 mot bokas 899. Ingen hundremeter måler mer enn 14,0 grader, det bratteste enkeltpartiet er 23,9, og linja gir tilbake åtte meter på hele turen. KAST 1, sørvendt — enkel men morsom skikjøring, akkurat som kilden sier.",
    ascent: [
      "Fra lommene langs Austerfjordveien ved Melåa — 12 moh; kildens F104 heter i dag fv. 7784 — følger du traktorveien på nordsida av Melåelva: 23 moh der linja står i den, og kraftlinja krysses på myrene på 171. Beltet fra 0 til 100 måler 4,7 grader over den første drøye kilometeren.",
      "Skogen slutter først på 419 moh etter 3,24 km — rundens høyeste skoggrense — og Tverrelvfoten, åsen på 577, passeres på vestsida slik kilden sier. Beltet fra 200 til 300 er turens bratteste med 14,0 grader; det bratteste enkeltpartiet, 23,9 mellom 242 og 262 moh, ligger i skogslia.",
      "Så åpner det flotte området seg rett opp mot toppen: 650 og 766 moh der linja er festet, og varden på 889. Nordover faller fjellet 49,7 grader mot skaret som skiller det fra 921-kulen — det er et annet fjell, og grensen mellom dem er grunnen til at høyden i boka og høyden på skjermen ikke er samme tall.",
    ],
    descent: [
      "Sørvendt kjøring på 15–25 grader hele veien hjem — enkel men morsom, sier kilden, og flankemålingen er enig: sørøst og sørvest fra toppen måler 5,6 til 5,8 grader i snitt, sør 13,0. Dette er turen for ferske med litt lengde i beina, og for alle på solblanke marsdager.",
      "Den ene regelen: ikke skyt over toppen. Nord for varden faller fjellet 49,7 grader i vinduet 80 til 140 meter ut, ned mot skaret — i flatt lys er det kanten å vite om på et ellers snilt fjell.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, og terrengmodellen er enig: 14,0 grader i bratteste belte, 23,9 i bratteste parti, og en sørside som måler 13,0 i snitt fra varden. Dette er rundens snilleste linje på papiret — og varselet skal likevel leses, for myrene og lia samler snø fra terrenget over.",
      },
      {
        title: "Nordsida",
        body: "Toppens ene bratte kant vender nord, mot skaret: 49,7 grader i det bratteste vinduet. Nedkjøringen går sør, og har ingen grunn til å nærme seg den — men i skodde er varden og kanten nærmere hverandre enn kartfølelsen sier.",
      },
      {
        title: "Før du går",
        body: "Tverrfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — alene i runden: de fire andre toppene svarer til Lofoten og Vesterålen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — også på en KAST 1-tur.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L23,200 L44,199 L68,197 L88,191 L112,184 L132,178 L151,178 L171,170 L190,166 L210,155 L229,145 L254,135 L274,131 L303,124 L332,118 L361,113 L386,104 L405,94 L425,83 L448,75 L469,68 L488,63 L508,53 L532,46 L553,38 L571,27 L600,18",
      startLabel: "12 moh",
      endLabel: "889 moh",
      distanceLabel: "5,5 km",
      caption: "885 høydemeter og 5,53 km fra Melåa langs traktorveien, over myrene ved kraftlinja og vest for Tverrelvfoten — skoggrensa på 419 moh, og det bratteste, 23,9 grader mellom 242 og 262 moh, i skogslia.",
    },
  },
  spanstinden: {
    slug: "spanstinden",
    intro:
      "1047 høydemeter og 5,24 km fra Bukkemyrvatnet på Gratangsfjellet — en klassiker så populær at du på soldager nesten kan regne med folk på fjellet, sier ut.no. Fri Flyt gir KAST 1 – Enkel, og linja holder det: bratteste hundremetersbelte 18,8 grader og bratteste sammenhengende parti 31,0. Toppen og de siste meterne fram til den er veldig spektakulære, sier kilden — og målingen forklarer hvorfor: alt annet enn fonna du kommer opp er 42 til 47 grader i snitt.",
    ascent: [
      "Fra parkeringa ved Bukkemyrvatnet på E6, høyeste punkt på Gratangsfjellet — 424 moh, med Lapphaugen turiststasjon som kildens alternative start lenger nord. Linja krysser 90 meter av Bukkemyrvatnet, aldri mer enn 25 meter fra land: et naturlig vann på 418 moh som kildens egen rute går over — ordinær vinterferdsel, og sagt her fordi det er et vann du står på. Skogen slutter allerede på 476 moh etter 1,03 km.",
      "Nordover mot det bratte og klippete Sølvfjellet går det i småkuler og terrasser: 10,2 grader fra 500 til 600 moh, 14,3 og 16,4 i de neste beltene — følg gamle spor når de finnes, sier kilden, for terrassene skjuler linja i flatt lys. Mellom Sølvfjellet og Spanstinden — 851 moh der linja passerer — åpner den store fonna sørøst for toppen seg.",
      "Fonna tas med den slakeste stigninga til høyre (øst), slik kilden sier: beltet fra 1300 til 1400 måler 18,8 grader, turens bratteste, og det bratteste sammenhengende partiet er 31,0 grader nede mellom 863 og 883. Så de spektakulære siste meterne: varden på 1457 — registeret løser 1457,4 — med fallene på alle andre kanter som kulisse.",
    ],
    descent: [
      "Ned fonna igjen — sørøstsektoren måler 14,1 grader i snitt over 500 meter med 28,9 i det første vinduet, stor og lesbar kjøring tilbake mot terrassene. Kilden beskriver fire nedfartsvarianter fra lett terrassekjøring til middels krevende via Tjuvhola-botnen mot Moen.",
      "Hold fonna til du er av toppen: nord, nordøst og sørvest faller 44,1, 47,5 og 42,0 grader i snitt, med et vindu på 71,4 grader på nordøstsiden. Det spektakulære og det farlige er samme kant her.",
      "Lapphaugen er ikke bare et alternativ i forbifarten — det er start B i kildens egen veibeskrivelse, og rute 6.8.2 går derfra: «Gå forbi husvognene på campingen og opp gjennom skogen ved toppen av campingen … Etter hvert går du litt på skrå til høyre til du kommer over tregrensen … Snart kommer du opp til et platå under toppen. Gå opp snøfeltet ovenfor platået for å komme til 6.8.1, og toppen.» Fra parkeringa ved turiststasjonen på 350 moh går linja over campingen på 383, opp gjennom skogen på 525, over tregrensa på 852, opp de bratte bakkene på 1004 og inn på platået under toppen på 1159 — der den møter fonna normalruta kommer opp. 1111 høydemeter på 4,80 km mot 1047 på 5,24 km fra Bukkemyrvatnet: mer klatring på kortere linje, og kilden graderer den «Middels vanskelig» der 6.8.1 er «Enkel». Bratteste hundremetersbelte er 19,7 grader fra 700 til 800 moh, og det bratteste 30-metersvinduet 28,5 grader mellom 756 og 776, mot 31,0 på normalruta. Skogen slipper på 576 moh etter 1,33 km. Området der det flate over campingen går over i brattere bakker er skredutsatt, sier kilden — og det er de første høydemetrene av turen, ikke de siste. Denne linja går ikke over noe vann.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkel hos Fri Flyt, og linja måler deretter: 18,8 grader i bratteste belte, 31,0 i bratteste parti. Skredterrenget ligger i de brattere partiene over skoggrensa ved siden av linja — vær varsom der de flate partiene går over i bratte heng, sier kilden.",
      },
      {
        title: "Toppkanten",
        body: "Alt annet enn fonna er bratt: 42 til 47 grader i snitt mot nord, nordøst og sørvest. De siste meterne er spektakulære fordi kantene er nære — i flatt lys går sporet midt på fonna, og varden besøkes med respekt for hva som er under snøen på kanten.",
      },
      {
        title: "Bukkemyrvatnet",
        body: "Linja krysser 90 meter av vannet, aldri mer enn 25 meter fra land. Naturlig vann, vinteris, ordinær ferdsel — men et vann er et vann, særlig først og sist i sesongen.",
      },
      {
        title: "Før du går",
        body: "Spanstinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no; fjellet står i Narvik-kapittelet hos kilden, men varslet det svarer til er Sør-Troms. Sesongen februar–juni er Fri Flyts. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L31,200 L56,200 L82,199 L98,198 L118,190 L143,184 L159,179 L180,173 L201,167 L221,158 L242,152 L257,144 L278,136 L299,129 L317,125 L329,119 L345,111 L371,100 L396,90 L420,81 L443,73 L466,69 L484,62 L510,54 L536,43 L556,32 L582,21 L600,18",
      startLabel: "424 moh",
      endLabel: "1457 moh",
      distanceLabel: "5,2 km",
      caption: "1047 høydemeter og 5,24 km fra Bukkemyrvatnet om terrassene mot Sølvfjellet og fonna sørøst for toppen, med skoggrensa på 476 moh og det bratteste beltet — 18,8 grader — mellom 1300 og 1400 moh.",
    },
  },
  sorvikfjellet: {
    slug: "sorvikfjellet",
    intro:
      "560 høydemeter og 3,60 km fra Kilbotnveien til Sørvikfjellet — et bratt skifjell nær byen med flere linjer og høy fart, og med kildens klareste skredsetning i runden: «vær obs på at det går skred på det bratteste henget hvert år.» KAST 3 – Komplekst, alpinøks og stegjern på lista. Grad 4.",
    ascent: [
      "Fra lomma langs Kilbotnveien — 61 moh — til avkjøringa på Nordvikmyra mot Kilbotn, 57 moh. Derfra er instruksen kildens egen: sikt inn mot toppvarden og følg det enkleste terrenget litt sør for toppen. Beltet fra 0 til 100 moh måler 1,5 grader, over 1595 meter grunn — myra tar den første kilometeren nesten flatt.",
      "På senvinteren kan Nordvikelva like ved veien være bred, og kilden foreslår gummistøvler de første hundre metrene og skifte til skisko etter det. Videre gjennom lia mot fjellet, 63 moh, og opp over skogen på 201.",
      "Skogen slipper på 362 moh etter 2,61 km. Det bratteste hundremetersbeltet måler 20,6 grader mellom 400 og 500 moh, over 266 meter grunn, og det bratteste enkeltsteget, 26,1 grader, ligger mellom 487 og 512. Varden er 607 — registeret og kilden er ikke helt enige her, for Fri Flyt skriver 600, og kortet bærer DTM1-høyden som overalt ellers.",
    ],
    descent: [
      "Nedkjøringa følger om lag samme vei som opp. Kjører du noen hundre meter sørover finner du en bratt renne på om lag 150 høydemeter som kilden mener er verdt turen — men det er en linje, ikke returen.",
      "Grunnen til at ruta går inn litt sør for toppen står i målingen: sør er den slake sida med 5,4 grader i snitt, sørvest 6,6 og nordvest 8,6. Nordøst måler 33,9 i snitt med et 45,3-vindu 180–240 meter ute, og øst 32,4 med 44,7 på 350–410.",
    ],
    avalanche: [
      {
        title: "Henget som går hvert år",
        body: "Kilden skriver at det går skred på det bratteste henget hvert år. Målingen finner det: nordøstsida holder 33,9 grader i snitt med et 45,3-vindu 180 til 240 meter ute — midt i det spennet der flakskred løsner oftest. Ruta går inn fra øst og runder sør for toppen nettopp for å holde seg unna, og det er ikke en detalj å improvisere bort på vei ned.",
      },
      {
        title: "Renna sør for ruta",
        body: "Noen hundre meter sør for oppstigningen ligger en renne på om lag 150 høydemeter som kilden kaller virkelig verdt å kjøre. Den er en renne: den samler det som kommer ovenfra og har ingen sideflukt. Alpinøks og stegjern står på kildens liste for dette fjellet, og det er her de hører hjemme.",
      },
      {
        title: "Før du går",
        body: "Sørvikfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L23,199 L45,199 L67,199 L90,199 L120,200 L149,200 L172,200 L202,197 L225,195 L240,189 L262,185 L279,177 L307,166 L330,158 L352,150 L374,136 L396,127 L412,116 L427,103 L449,89 L472,81 L482,73 L498,61 L509,52 L524,43 L547,40 L573,32 L592,21 L600,18",
      startLabel: "61 moh",
      endLabel: "607 moh",
      distanceLabel: "3,6 km",
      caption: "560 høydemeter og 3,60 km fra Kilbotnveien: avkjøringa på Nordvikmyra, myra og lia — og inn mot varden på 607 litt sør for toppen.",
    },
  },
  melaaksla: {
    slug: "melaaksla",
    intro:
      "965 høydemeter og 5,99 km fra Melå til Melåaksla — en topp det tok tre kandidater å finne: registerets navn står på 747-skuldra i nord, det første såkornet gikk på 959,6-toppen i sørøst, og publiserte 915 er toppen på 915,7 midt mellom dem. Traktorveien på sørsida av elva til Dalbotnen, forbi hytta og den lange ryggen sørover. Nedkjøring på 15–25 grader med noen parti på 30 — flott variert terreng, sier kilden. Grad 2.",
    ascent: [
      "Fra lommene ved Melå — 11 moh; traktorveien går på sørsida av Melåelva, i motsetning til Tverrfjellet-turens nordside — og bratt gjennom skogslia først: beltet fra 100 til 200 er linjas bratteste i snitt med 23,7 grader. Skoggrensa ligger på 355 etter 2,58 km.",
      "Traktorveien står i linja på 230 og Dalbotnen på 296 — beltet fra 200 til 300 måler 3,7 grader over halvannen kilometer — så til høyre (sør) mot 505-høyda og forbi den vesle slitne hytta.",
      "Ryggen sørover fra 590, vest for tjernet på 717 — og opp mot varden på 916: beltet fra 800 til 900 måler 22,1 grader, og det bratteste enkeltpartiet, 35,5, ligger mellom 872 og 901 moh. SE-flanken stiger videre: ryggen fortsetter mot 959-toppen, neste fjell i kjeda.",
    ],
    descent: [
      "15–25 grader med noen parti på 30 hjem, og ryggen er ren kjøring, sier kilden — med utsikt over Austerfjorden, Jonsheimen og Gullesfjorden hele veien.",
      "Hold ryggen: østsida mot Austerfjorden er brattere, og ryggen hjemover måler 27,9 grader i snitt de første 500 m fra toppen, med 47-vindu 110–170 m ut. Tjernet på 717 passeres på vestsida, som på vei opp.",
    ],
    avalanche: [
      {
        title: "Ryggen",
        body: "Nedkjøringa holder 15–25 grader med parti på 30 hos kilden, men nærmest toppen måler ryggen 27,9 i snitt med et 47-vindu 110–170 m ut — de bratteste meterne kommer først, og østsida mot Austerfjorden er brattere enn ryggen.",
      },
      {
        title: "Skogslia",
        body: "Beltet fra 100 til 200 måler 23,7 grader — linjas bratteste snitt ligger nederst, i skogen over Melå. På dager med varsel om flakskred i lavlandet er det lia her som skal vurderes, ikke bare toppen.",
      },
      {
        title: "Før du går",
        body: "Melåaksla ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,195 L51,187 L67,174 L82,161 L105,149 L127,143 L154,146 L177,146 L195,146 L217,146 L236,142 L258,131 L284,121 L303,115 L330,102 L347,106 L356,106 L382,99 L408,88 L430,84 L453,82 L472,78 L499,66 L522,63 L544,56 L567,43 L586,31 L600,18",
      startLabel: "11 moh",
      endLabel: "916 moh",
      distanceLabel: "6,0 km",
      caption: "965 høydemeter og 5,99 km fra Melå: traktorveien til Dalbotnen, forbi hytta mot 505-høyda — og den lange ryggen sørover til varden på 916, vest for tjernet på 717.",
    },
  },
  "rundfjellet-harstad": {
    slug: "rundfjellet-harstad",
    intro:
      "779 høydemeter og 6,86 km fra DNT-hytta på Bjørnhaugen til Rundfjellet — rundens lengste tur og kapittel 1s største fjell. Kilden kaller det «noe anmarsj og fin kjøring i cruiseterreng», og terrengmodellen er enig: det bratteste beltet på hele linja måler 18,5 grader. Navnet er kvalifisert fordi appen allerede har et Rundfjellet, det 803 meter høye i Vågan. KAST 1 – Enkelt. Grad 2.",
    ascent: [
      "Fra den store parkeringa ved DNT-hytta — 212 moh — faller linja mot Storvatnet og følger vestsida sørover: 155, 145 og 140 moh der korridoren er festet. Vatnet er stort, og de 123 høydemetrene du gir fra deg her er halve forklaringen på at kilden oppgir 800 for et fjell som ligger 656 meter over hytta.",
      "Kilden skriver «Gå over Rundfjellvannet», men linja går på land nord for tjernet — samme regel som ellers i appen. Fra sørvestenden av Storvatnet stiger ruta opp bekkedalen på nordsida av høyde 339, som terrengmodellen måler til 337,7. Midt i dalen er ikke en tilfeldig formulering: det er skredterreng på begge sider, og det er den eneste hazard-instruksen kilden gir.",
      "Over Rundfjellvatnet på 300 moh og opp på nordøstryggen — 602 der korridoren står i den. Skogen slipper først på 344 moh etter 4,97 km, den lengste skogsmarsjen i runden. Det bratteste hundremetersbeltet måler 18,5 grader mellom 700 og 800 moh, over 325 meter grunn, og det bratteste enkeltsteget, 23,9 grader, ligger mellom 509 og 529 moh.",
    ],
    descent: [
      "Samme ryggen hjem. Kilden lover «for det meste 20-25 graders kjøring, men noen partier er 30 grader», og linja holder seg under det hele veien: ingen av beltene måler over 18,5 grader i snitt.",
      "Flankesveipet plasserer det bratte der kilden ikke sender deg: sør for varden ligger et 54,6-vindu 20–80 meter ute og sørøst 50,3 bare 10–70 meter ute. Sørvest er den slake sida med 8,8 grader i snitt. Ryggen nordøstover er ruta, og den måler 20,2.",
    ],
    avalanche: [
      {
        title: "Bekkedalen",
        body: "Kilden ber deg gå midt i bekkedalen nord for høyde 339 for å unngå skredterreng på begge sider. Det er en instruks om plassering, ikke om vinkel: selve dalbotnen er slak, men den ligger mellom to sider som kan levere. Hold midten, og les snøen i sidene før du går inn.",
      },
      {
        title: "Toppen har en bratt side",
        body: "Nordøstryggen er slak — 20,2 grader i snitt — men sør og sørøst for varden faller fjellet 54,6 og 50,3 grader i sine bratteste vinduer, og sørøst bare 10 til 70 meter fra toppen. På et fjell kilden kaller cruiseterreng er det verdt å vite hvor kanten går.",
      },
      {
        title: "Før du går",
        body: "Rundfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Turen er lang for graden — nesten sju kilometer inn — så tidspunktet avgjør hvilken snø du møter på returen. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,181 L28,186 L52,195 L71,197 L96,198 L122,197 L142,197 L162,199 L187,199 L209,199 L231,199 L252,199 L278,190 L302,176 L323,165 L348,159 L362,159 L380,157 L408,159 L431,151 L451,134 L469,117 L490,107 L512,89 L534,70 L553,50 L573,32 L600,18",
      startLabel: "212 moh",
      endLabel: "868 moh",
      distanceLabel: "6,9 km",
      caption: "779 høydemeter og 6,86 km fra Bjørnhaugen: vestsida av Storvatnet, bekkedalen nord for høyde 339 — og nordøstryggen til varden på 868.",
    },
  },
  jakobstinden: {
    slug: "jakobstinden",
    intro:
      "1017 høydemeter og 7,40 km fra samme Y-kryss som Kongsviktinden — fire kilometer vinterstengt vei der beltet under 100 moh måler 1,2 grader, så myrene ved Sætran, den brede rampa og platået til toppen med pinakkelen. Det bratteste enkeltpartiet, 31,0 grader mellom 741 og 768 moh, ligger akkurat der rampa møter ryggen — og der skavlen kan stå, sier kilden: hold venstre, mot sør. KAST 2 hos Fri Flyt, alpinøks og stegjern, og et fjell så lite trafikkert at urørt snø er sannsynlig.",
    ascent: [
      "Fra Y-krysset på 25 moh følger du den vinterstengte veien cirka 4 km innover Kongsvikdalen — linja krysser den flettede Kongsvikelva der veien gjør det, på bruene. Ved Sætran tar du til høyre og nordøstover: over myrene på 262 moh, der beltet fra 100 til 200 er turens bratteste hundremeter med 18,0 grader.",
      "Så kommer rampa: 394 moh der linja tar den, øvre rampa på 502, og skoggrensa på 388 moh etter 5,03 km. Over rampa mot ryggen kan skavlen stå — hold venstre, sør, gjennom partiet, akkurat der det bratteste enkeltpartiet måler 31,0 grader mellom 741 og 768 moh.",
      "Platået på 720 bærer deg de siste meterne til toppen på 976 — registeret løser 976,0 på grensa mellom Kvæfjord og Tjeldsund. Pinakkelen står nord for varden: M3-klyving for den som vil, med 25 meter tau til rappellen — den er utsikten, ikke turen. 66 meter gir du tilbake underveis.",
    ],
    descent: [
      "Samme vei ned: 15–30 grader hos Fri Flyt, med fin flyt tilbake mot Kongsvikdalen — og fordi fjellet er lite trafikkert er sjansen god for at linjene dine er de eneste der. I pudder er rampa og myrene sammenhengende kjøring nesten til veien.",
      "Sørkanten av platået er grensen å respektere: flankemålingen gir 54,1 grader mot sør og 52,3 mot sørvest — platået slutter brått, og i flatt lys er kanten nærmere enn den ser ut. Nordsiden mot pinakkelen måler 42,3 i sitt bratteste vindu og er heller ingen nedkjøring.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, med alpinøks og stegjern i utstyrslista. Terrenget langs linja er moderat — 18,0 grader i bratteste belte — men skavlpartiet på 31,0 der rampa møter ryggen er stedet dagen avgjøres: hold sør, og snu når snøen sier nei. Grad 3 på kortet.",
      },
      {
        title: "Skavlen og sørkanten",
        body: "Kildens navngitte farepunkt er skavlen som kan danne seg over rampa — passeres på sørsiden. Sørkanten av platået måler 54,1 grader i flankemålingen; avstand til kanten i dårlig sikt er billig forsikring på et fjell der sporene dine gjerne er de første.",
      },
      {
        title: "Før du går",
        body: "Jakobstinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L23,199 L44,197 L50,199 L57,199 L64,199 L80,199 L94,198 L123,195 L152,193 L182,192 L207,191 L233,192 L255,192 L283,189 L306,180 L328,164 L350,152 L371,151 L397,137 L422,122 L446,114 L464,104 L486,91 L499,79 L521,71 L543,57 L568,42 L590,24 L600,18",
      startLabel: "25 moh",
      endLabel: "976 moh",
      distanceLabel: "7,4 km",
      caption: "1017 høydemeter og 7,40 km fra Y-krysset i Kongsvik over myrene ved Sætran og opp den brede rampa — skoggrensa på 388 moh, og det bratteste partiet, 31,0 grader mellom 741 og 768 moh, der skavlen kan stå.",
    },
  },
  "stortinden-sortland": {
    slug: "stortinden-sortland",
    intro:
      "1009 høydemeter og 3,37 km fra Vangpollen kraftstasjon til Stortinden — en av Hinnøyas tusenmetere, og en av de få som gir sammenhengende bratt kjøring helt ned til havet. KAST 3 – Komplekst hos Fri Flyt, alpinøks og stegjern på lista. Grad 4.",
    ascent: [
      "Fra parkeringa ved kraftstasjonen — 13 moh — og rett inn i dalen. Kildens beskrivelse er kort: «følg den bratte dalen som blir brattere og brattere.» Beltet fra 0 til 100 moh måler 11,8 grader over 458 meter grunn, og fra 100 til 200 er det 16,0 over 318. Dalmunnen er 92 moh, dalen 274.",
      "Skogen slipper alt på 333 moh etter 1,16 km, en tredjedel inn på en tur som er 3,37 kilometer lang. På 530 moh flater dalen ut: beltet fra 500 til 600 moh måler 9,6 grader over 542 meter grunn, og det er hylla under det kilden kaller «et brattere parti, nesten som et bånd som går over hele siden».",
      "Her skifter du retning til høyre, sørover, og går opp på ryggen — 617 moh. Derfra følger linja ryggen over 811 til toppen på 1020. Det bratteste hundremetersbeltet måler 21,4 grader mellom 300 og 400 moh, over 267 meter grunn, og det bratteste enkeltsteget, 28,9 grader, ligger mellom 933 og 958.",
    ],
    descent: [
      "Kildens hovedvei ned er vestsida: «bratt og sammenhengende skikjøring i fantastisk område», det meste mellom 30 og 40 grader. Radialen vestover fra toppen måler 32,5 grader i snitt med et 38,7-vindu 400 til 460 meter ute — kildens egne tall, målt.",
      "Sørsida er den slake med 21,1 grader i snitt, og sørøst 28,2. Nord måler 39,9 med et 62,6-vindu 150 til 210 meter ute, øst 36,3 med 64,4 på 100 til 160, og nordøst 34,9 med 62,2 på 50 til 110. Toppen er avskåret mot nord og øst, og ryggen du kom opp er kanten mellom dem.",
    ],
    avalanche: [
      {
        title: "Bandet på 600",
        body: "Kilden sier det rett ut: «På ca 600 moh kommer man til et brattere parti, nesten som et bånd som går over hele siden.» Instruksen er å skifte retning til høyre, sørover, for å komme lettere opp på ryggen — ikke å gå rett på. Linja gjør det, og derfor måler beltet fra 500 til 600 moh bare 9,6 grader: ruta går rundt bandet, ikke gjennom det.",
      },
      {
        title: "En dal som blir brattere",
        body: "«Sjekk jevnlig snøen og om den er stabil, forholdene kan endre seg oppover», skriver kilden om oppstigninga. En dal som blir brattere og brattere er et samleområde med voksende fangstflate over deg: det som løsner har én vei ned, og du står i den. Alpinøks og stegjern er på lista, og den harde skaren i et slikt trangt parti er grunnen.",
      },
      {
        title: "Før du går",
        body: "Stortinden i Sortland ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Sørøstruta fra Langvatnet starter ved et gårdsbruk og krever godkjenning fra grunneier — den er ikke denne. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L33,197 L56,191 L73,185 L100,178 L118,171 L138,166 L153,160 L172,154 L190,148 L222,136 L246,126 L270,120 L294,113 L326,106 L358,104 L389,97 L401,92 L423,84 L452,72 L463,68 L486,59 L510,53 L526,46 L541,40 L550,37 L571,26 L590,21 L600,18",
      startLabel: "13 moh",
      endLabel: "1020 moh",
      distanceLabel: "3,4 km",
      caption: "1009 høydemeter og 3,37 km fra Vangpollen: den bratte dalen, hylla på 530 under bandet — og ryggen sørfra opp til 1020.",
    },
  },
  haukebotinden: {
    slug: "haukebotinden",
    intro:
      "863 høydemeter og 4,43 km fra Gausvik kirke — rundens korteste dag, med sesong fra desember og en østside som måler 8,6 grader i snitt fra toppen. Skogen slutter allerede på 199 moh etter 1,17 km, det bratteste hundremetersbeltet er 18,0 grader mellom 800 og 900 moh, og linja gir tilbake fire meter på hele turen. KAST 1 hos Fri Flyt — og de bratte variantene ligger nord og sør for denne ruta, ikke i den.",
    ascent: [
      "Fra den store parkeringsplassen ved Gausvik kirke — 46 moh — går du mot demningen på 65, krysser elva der forholdene tillater det, og følger østsida av Heimetverrelva oppover, gjennom grinda ved den store furua. Beltet fra 100 til 200 moh måler 14,1 grader, og på 199 moh er skogen allerede bak deg.",
      "Videre er det minst krevende terrenget rett mot toppen: lia på 410, 613 og toppflanken på 725 er punktene ruta er festet i, og beltene imellom holder 9,7 til 13,3 grader — jevn skinning uten ett eneste parti å planlegge rundt.",
      "Det bratteste kommer til slutt: beltet fra 800 til 900 måler 18,0 grader, med turens bratteste enkeltparti — 24,8 grader — mellom 787 og 802 moh. Varden står på 905, registeret løser 905,1, og under deg ligger Tjeldsundet med Sætertinden som nabo over Sagtindene.",
    ],
    descent: [
      "Samme vei ned, og det er poenget med østsiden: kjøring som passer ferske så lenge du unngår heng brattere enn 30 grader — og på selve linja målte modellen aldri mer enn 24,8. Fin flyt helt til grinda, og løssnø i skogen på gode dager.",
      "Variantene er en annen tur: nordøstvarianten mot Storlægda holder 30–45 grader og krever øks og stegjern, og nordsiden — 35–50 grader, skavl og rappellfeste, med utgang over brua ved pumpehuset ved Haukebøvatnet — er den mest krevende linja på fjellet. Sagtind-traversen mot Sætertinden er eksponert og krever øks, stegjern og tau.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, og målingen er enig: 18,0 grader i bratteste belte, 24,8 i bratteste parti, og en østside som fra toppen måler 8,6 grader i snitt. Regelen fra kilden er enkel — unngå heng brattere enn 30 grader — og normalruta har ingen å tilby.",
      },
      {
        title: "Sørsida og variantene",
        body: "Flankemålingen viser 56,6 grader i vinduet 70–130 meter ut mot sør og 49,8 mot sørvest — bratt terreng rett utenfor normalruta. Nordøst- og nordvariantene er ekspertlinjer med skavl og rappellfeste, og dagen for dem velges etter snødekket, ikke etter kalenderen.",
      },
      {
        title: "Før du går",
        body: "Haukebøtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — alene i runden: nabotoppene over Sagtindene svarer til Lofoten og Vesterålen. Sjekk varsom.no. Sesongen desember–april er Fri Flyts, den lengste i runden. Sender/mottaker, søkestang og spade — også på en KAST 1-tur.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,197 L49,196 L73,194 L98,190 L123,183 L147,172 L171,162 L195,152 L220,143 L238,139 L256,131 L274,125 L293,116 L317,107 L344,101 L372,92 L402,82 L421,77 L439,69 L464,64 L488,60 L512,56 L527,52 L546,44 L561,37 L573,30 L591,20 L600,18",
      startLabel: "46 moh",
      endLabel: "905 moh",
      distanceLabel: "4,4 km",
      caption: "863 høydemeter og 4,43 km fra Gausvik kirke over demningen og opp østsida av Heimetverrelva — skoggrensa på 199 moh, og det bratteste, 24,8 grader mellom 787 og 802 moh, rett under varden.",
    },
  },
  reinspalen: {
    slug: "reinspalen",
    intro:
      "1367 høydemeter og 7,85 km for en 1118-topp — Reinspælen er Kvæfjords høyeste, og ryggene dit samler 255 meter gitt tilbake underveis: mye opp og ned, som både kilden og turrapportene sier. KAST 3 – Komplekst med isøks og stegjern; linja måler 21,0 grader i bratteste hundremetersbelte, og det bratteste sammenhengende partiet — 37,9 grader mellom 331 og 357 moh — sitter i steget opp på Kobberyggen, mens alvoret sitter i overgangen til den eksponerte toppryggen, der rapportene beskriver klyving.",
    ascent: [
      "Fra Våtvoll ved fv. 85 langs Gullesfjorden — 5 moh, parkering i lommene langs veien slik kilden sier. Opp Kobberyggen: beltet fra 0 til 100 måler 8,9 grader og skogen slutter på 378 moh etter 2,30 km, før ryggen gir tilbake det første søkket — 86 meter ned til 335 før Geitryggen tar over.",
      "Geitryggen er turens rygg: 20,5 grader i beltet fra 500 til 600, flatt over 600, og så jevn stigning — 21,0 grader fra 800 til 900, turens bratteste belte — mot toppryggen. Undulasjonen er grunnen til at kortet bærer 1400 høydemeter for en 1118-topp.",
      "Toppryggen er alvoret: eksponert travers med skavler og skredterreng mot Litjedalen, der ryggen reiser seg mot varden; linjas bratteste parti ligger lenger nede, 37,9 grader mellom 331 og 357 moh i steget opp på Kobberyggen. Isøksa og stegjerna er for disse meterne; turrapportene kaller det klyving. Registeret løser 1117,4 mot publiserte 1118.",
    ],
    descent: [
      "Ned samme vei — ryggene tilbake med motbakkene i revers; sørsektoren fra toppen måler 18,9 grader i snitt, men med et 60-metersvindu på 60,5 grader bare 20 til 80 meter ut: traversen har vegg på begge sider, og sporet ned er sporet opp.",
      "Vestrennene (30–50 grader) er terrengfeller ved ustabilitet, sier kilden, og Norddalen på nordøstruta krever egen stabilitetsvurdering. Ingen av dem er linja her.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 3 – Komplekst hos Fri Flyt. Ryggene er snille — 21 grader på det bratteste beltet — og alt alvor er samlet i toppryggen: skavler og vegg på begge sider av traversen — linjas bratteste 30 meter, 37,9 grader, ligger lavt på Kobberyggen. Grad 4 på kortet.",
      },
      {
        title: "Toppryggen",
        body: "Skavlene og skredterrenget mot Litjedalen er kildens egne ord. Sidene måler 60,5 (S) og 64,1 (SØ) grader i de første vinduene fra varden — traversen gås med isøks i hånd og god margin til kanten, og i flatt lys venter den på bedre sikt.",
      },
      {
        title: "Opp-og-ned-regnskapet",
        body: "255 meter gis tilbake på ryggene — det er 255 meter som skal klatres igjen på hjemveien. Regn timene deretter: kilden gir 6–7, og de er ærlige.",
      },
      {
        title: "Før du går",
        body: "Reinspælen ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — Kvæfjord-fjella svarer til det varselet, ikke til Sør-Troms. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og isøks og stegjern.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L31,194 L58,182 L86,178 L119,172 L144,166 L159,154 L176,139 L195,129 L223,125 L243,133 L264,146 L285,153 L315,154 L326,154 L351,153 L378,144 L396,131 L407,120 L426,106 L444,94 L471,88 L492,83 L509,73 L533,53 L554,37 L574,25 L597,20 L600,18",
      startLabel: "5 moh",
      endLabel: "1117 moh",
      distanceLabel: "7,9 km",
      caption: "1367 høydemeter og 7,85 km fra Våtvoll over Kobberyggen og Geitryggen, med skoggrensa på 378 moh og det bratteste — 37,9 grader mellom 331 og 357 moh — i steget opp på Kobberyggen.",
    },
  },
  satertinden: {
    slug: "satertinden",
    intro:
      "1116 høydemeter og 6,12 km fra Sandtorg idrettsanlegg på Årbogen til Tjeldsunds høyeste — staket fra 500 moh, med telefonstolpene som los de siste 200 høydemetrene og nødbu på ryggen ved 700. Det bratteste hundremetersbeltet måler 21,2 grader mellom 900 og 1000 moh, det bratteste sammenhengende partiet 26,9 mellom 827 og 850 — KAST 1 hos Fri Flyt, og målingen er enig. Toppens bratte sider finnes, men de vender sør og vest, dit normalruta ikke går.",
    ascent: [
      "Fra den store parkeringsplassen ved Sandtorg idrettsanlegg — 15 moh, og rundens eneste startplass med kartlagt parkering i OSM — følger du traktorveien på sørsida av Årbogelva, 63 moh der linja bruker den. Skogen slutter allerede på 348 moh etter 2,86 km; beltet fra 200 til 300 moh måler 5,2 grader, så innmarsjen er slak.",
      "Årbogvatnet passeres på sørsida — vatnet ligger på 258 moh og er Innsjø i terrengmodellen, og linja holder land hele veien. Så tar østryggen over: 522 moh der ruta står på den, forbi nødbua — linja passerer den på 653 — og videre til 785. Fra 500 moh er ruta staket, og de siste 200 høydemetrene følger telefonstolpene til sambandsanlegget.",
      "Beltet fra 800 til 900 måler 20,5 grader og beltet fra 900 til 1000 er turens bratteste med 21,2 — det bratteste enkeltpartiet, 26,9 grader mellom 827 og 850 moh, ligger der ryggen reiser seg mot platået. Varden og de låste sambandsbyggene står på 1095 — registeret løser 1094,9 — og dronefoto er forbudt på toppen etter NSM-regelverket. Ryggen gir bare tilbake 36 meter på hele turen.",
    ],
    descent: [
      "Samme vei ned: 15–25 grader i hovedsak hos Fri Flyt, og målingen bekrefter at ingen hundremeter langs linja passerer 21,2 i snitt. Med staking og stolper er dette turen som går i flatt lys — men ryggen er vindutsatt, og hard skare kan gjøre stegjern kjekt å ha.",
      "Hold ryggen. Ved nedkjøring til venstre — nord — er to personer gravd fram av skred, i 2017 og i 2019. Sørrenna med sine nesten 1100 sammenhengende metre mot havet og vestrennene er komplekse ekspertlinjer med egen snøvurdering, og de er ikke denne ruta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, og terrengmodellen er enig: 21,2 grader i bratteste belte, 26,9 i bratteste parti. Flankemålingen fra toppen viser de slake sidene mot nord, nordvest og vest — og 60,1 grader i sørøst, der ekspertlinjene bor. Normalruta holder seg på den snille siden av det skillet.",
      },
      {
        title: "Nordsida",
        body: "De to dokumenterte hendelsene på fjellet — gravd-fram i 2017 og 2019 — kom begge ved nedkjøring nord for normalruta. Små vannspeil kan stå åpne i søkkene om våren. Ryggen er svaret i begge tilfeller: den er staket fordi den er linja.",
      },
      {
        title: "Før du går",
        body: "Sætertinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — grensetoppen over Tjeldsundet svarer til det varselet, ikke til Sør-Troms. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og stegjern på skaredager.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,197 L44,193 L66,193 L97,188 L121,182 L139,173 L158,168 L180,162 L205,158 L231,153 L253,154 L268,151 L285,141 L306,131 L329,127 L351,122 L368,114 L389,111 L408,104 L433,97 L452,92 L474,86 L496,76 L514,70 L533,61 L549,51 L568,37 L584,28 L600,18",
      startLabel: "15 moh",
      endLabel: "1095 moh",
      distanceLabel: "6,1 km",
      caption: "1116 høydemeter og 6,12 km fra Sandtorg idrettsanlegg langs traktorveien, sør for Årbogvatnet og opp den stakede østryggen — skoggrensa på 348 moh, og det bratteste beltet, 21,2 grader, mellom 900 og 1000 moh.",
    },
  },
  kongsviktinden: {
    slug: "kongsviktinden",
    intro:
      "1055 høydemeter og 8,08 km fra Y-krysset før bommen — nesten halve turen er den vinterstengte veien innover Kongsvikdalen, der beltet under 100 moh måler 1,4 grader over 3625 meter grunn. Så tar fjellet over: sommerstien ved Sætran, sørkonturen over platået, og en topp som samler 1055 meter for sine 980 fordi platået bølger — 100 gir du tilbake underveis. KAST 2 hos Fri Flyt, med alpinøks og stegjern i utstyrslista for fokksnøen og isingen nær toppen.",
    ascent: [
      "Fra Y-krysset — 25 moh, cirka 150 meter før bommen — følger du den vinterstengte veien innover Kongsvikdalen, ofte med skuterspor å gå i. Linja krysser den flettede Kongsvikelva der veien gjør det, på bruene. Ved Sætran på 57 moh tar du av østover etter sommerstien, og stigningen begynner: 186 moh der linja står i den.",
      "Lia sørøstover er turens bratteste enkeltparti — 31,6 grader mellom 291 og 310 moh, i skogen — og skoggrensa kommer på 317 moh etter 5,43 km. Så legger sørkonturen seg til rette: sør for tjernet på 278, gjennom senkninga på 387 — tjernet på platået er Innsjø i terrengmodellen, og linja holder land sør for det.",
      "Fra senkninga reiser toppflanken seg: 763 moh der ruta står i den, med beltet fra 500 til 600 som turens bratteste hundremeter på 17,9 grader. Toppen løser 980,1 — toppsøket klatret 60 meter fra registerpunktet til den høyeste cella — og under deg ligger hele Tjeldsundet, med Sætertinden rett over sundet.",
    ],
    descent: [
      "Nordsiden ned er grunnen til å gå her: 20–25 grader i hovedsak hos Fri Flyt, med to brattere partier på 30 — og skjermet pudder når de andre himmelretningene er avblåst, som er akkurat de dagene øksa og stegjerna i sekken gjør nytte for seg på den harde flanken opp.",
      "Sørøstsida er skredsida: flere store skred årlig på 30–40 grader, og kilden er utvetydig — den skal ikke kjøres, det finnes tryggere bratt i nærheten. Flankemålingen er enig: 51,0 grader i det første vinduet fra toppen mot sørøst. Vestrenna er ekspertlinja for stabile dager, med øks og stegjern og nedkjøring nordsiden.",
      "Den andre dokumenterte ruta går opp Østsia fra bensinstasjonen i Kongsvik — 923 høydemeter på 4,38 km, under halve normalrutas lengde, opp scootersporet i Håkadalen og den store skrårampa. Kilden beskriver den nedover og legger til at du selvsagt kan gå opp den også; det meste er 20–30 grader, med bratteste steg 30,9.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, og det er ikke helningen som bærer klassifiseringen — bratteste belte langs linja måler 17,9 grader — men fokksnøen og isingen nær toppen som setter alpinøks og stegjern i utstyrslista, og det bratte partiet på 31,6 i skogslia. Grad 3 på kortet, Gråfjell-regelen.",
      },
      {
        title: "Sørøstsida",
        body: "Kildens navngitte skredside, med flere store skred årlig — og flankemålingen gir den 51,0 grader i første vindu og 39,5 i snitt. Nedkjøringen går nordsiden, og toppskavlene over sørøstsida er en grunn til å holde avstand fra kanten i flatt lys.",
      },
      {
        title: "Før du går",
        body: "Kongsviktinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L22,199 L48,196 L73,199 L85,198 L110,196 L138,193 L168,192 L194,191 L221,192 L248,192 L271,182 L291,169 L318,163 L338,150 L362,152 L389,150 L405,140 L429,128 L449,119 L472,104 L489,91 L509,76 L534,62 L548,50 L566,39 L587,26 L600,18",
      startLabel: "25 moh",
      endLabel: "980 moh",
      distanceLabel: "8,1 km",
      caption: "1055 høydemeter og 8,08 km fra Y-krysset i Kongsvik: den vinterstengte veien til Sætran, sommerstien og sørkonturen over platået — skoggrensa på 317 moh, det bratteste partiet, 31,6 grader, mellom 291 og 310 moh.",
    },
  },
  "snotinden-tjeldsund": {
    slug: "snotinden-tjeldsund",
    intro:
      "979 høydemeter og 4,26 km fra Dalelvas utløp i Fiskefjorden — samme parkering som Taraldsviktinden, motsatt side av dalen. Traktorveien opp Norddalen tar unna det bratteste: beltet fra 100 til 200 moh måler 21,7 grader og turens bratteste enkeltparti, 27,5 grader, ligger mellom 284 og 307. Så flater det langstrakte Marsslottfjellet ut, og ryggen bærer sørvestover til toppen. KAST 1 hos Fri Flyt — men kilden gir 7–8 timer, så regn dagen deretter.",
    ascent: [
      "Fra den store parkeringsplassen ved Dalelvas utløp — 5 moh — går du først som mot Taraldsviktinden, og tar så traktorveien opp Norddalen: 219 moh der linja står i dalen, skoggrensa på 307 etter 1,34 km, og 412 øverst i dalen. Det bratteste enkeltpartiet, 27,5 grader mellom 284 og 307 moh, ligger her.",
      "Marsslottfjellet — registerets skrivemåte, med to s-er — er turens karakter: langstrakt og åpent, 632 moh der linja tar det og 798 der ryggen svinger sørvestover. Beltet fra 500 til 600 måler 10,0 grader og beltet fra 700 til 800 10,1 — kilometervis med jevn skinning.",
      "Ryggen sørvestover passerer 855, toppflanken leser 938, og varden står på 980 — registeret skriver Snytinden og løser 979,7. Bare 4 meter gir du tilbake på hele turen, og beltet fra 900 til 1000 måler 13,7 grader inn mot toppen.",
    ],
    descent: [
      "Samme vei ned, og det er poenget med nordøstsiden: bare tre heng på rundt 25 grader i hele nedkjøringen, sier kilden — og målingen er enig: ingen hundremeter over 21,7. Flyt over Marsslottfjellet, og fart helt ned Norddalen når skogen har snø.",
      "Sørvestsiden — om Snytindlemman mot Revskarvatnet og over Bollfjellet, alle tre registerets navn — er den krevende varianten med egen snøvurdering. Flankemålingen gir sørøstsida 49,8 grader og sørvest 42,7; hold deg på ryggen du kom opp.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, og terrengmodellen er enig: 21,7 grader i bratteste belte — i skogen lavt på turen — og 29,0 i bratteste parti. Oppe på Marsslottfjellet er det slakere enn noe annet fjell i rundelen. Stegjern kjekt å ha på skaredager, sier kilden.",
      },
      {
        title: "Sør- og østsidene",
        body: "Flankemålingen fra toppen gir 49,8 grader mot sørøst og 42,7 mot sørvest — de bratte sidene vender bort fra normalruta, mot Snytindlemman og Revskarvatnet. Nord og nordvest, der ruta går, måler 11,6 til 12,1 i snitt.",
      },
      {
        title: "Før du går",
        body: "Snøtinden i Tjeldsund ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts, og kildens 7–8 timer gjør dette til rundens lengste dag tross korte kilometer. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L31,198 L56,197 L78,193 L94,187 L119,174 L137,165 L151,160 L170,154 L189,144 L197,139 L218,131 L243,124 L267,113 L282,107 L307,104 L331,102 L351,93 L365,87 L385,79 L408,69 L427,64 L446,58 L465,54 L484,52 L503,49 L529,41 L554,33 L573,25 L592,19 L600,18",
      startLabel: "5 moh",
      endLabel: "980 moh",
      distanceLabel: "4,3 km",
      caption: "979 høydemeter og 4,26 km fra Dalelvas utløp opp Norddalen og over det langstrakte Marsslottfjellet — skoggrensa på 307 moh, og det bratteste, 27,5 grader mellom 284 og 307 moh, i dalen der traktorveien slutter.",
    },
  },
  taraldsviktinden: {
    slug: "taraldsviktinden",
    intro:
      "779 høydemeter og 4,53 km fra fjæra innerst i Fiskefjorden — start på 5 moh ved utløpet av Dalelva, og hele fjellet over deg. Traktorveien øst for Gårdselva tar deg til skogsbeltene på 10,5 til 13,5 grader, Mølnskaret slipper deg inn på nordryggen — og ryggen bærer isøks og stegjern i utstyrslista: kilden gir ryggpartiet 30 grader, mens den slakeste linja langs den måler 22,9 på det meste. KAST 2 hos Fri Flyt, og grad 3 på kortet.",
    ascent: [
      "Fra den store parkeringsplassen ved Dalelvas utløp — 5 moh, E10 krysser elva på Dalelvbrua like ved — følger du traktorveien øst for Gårdselva: 56 moh der linja tar den, 107 lenger opp. Kilden sier av veien omtrent 150 meter før kraftlinja krysser; alternativet ved Sjøvoll krever grunneiers samtykke, så bruk plassen ved elva.",
      "Så bærer det til høyre og opp: mellom vegetasjonen på 241, mot Mølnskaret på 360 — skogen slutter på 368 moh etter 2,88 km — og inn i selve skaret på 538, der registeret har navnet og ryggen begynner.",
      "Nordryggen sørover er turens finale: 669 moh der linja står på den, beltet fra 600 til 700 er turens bratteste med 19,0 grader i snitt, og det bratteste enkeltpartiet — 22,9 grader — ligger mellom 624 og 643 moh. Toppen løser 775,8 mot publiserte 777; varden på 774 som kilden nevner står på vestsida.",
    ],
    descent: [
      "Samme vei ned: i hovedsak 15–25 grader hos Fri Flyt, med to partier på 30 og et ryggparti på 30 — det er de partiene som setter isøks og stegjern i sekken, for på hard fokksnø er ryggen et annet fjell enn i løssnø. Linja langs ryggen måler aldri mer enn 22,9, så det bratte er valgfritt, ikke obligatorisk.",
      "Østsiden med Tunellen — 30–40 grader ned mot steintunnelen på rundt 450 moh — er ekspertlinja med utløpssoner å regne med, og vestsiden forbi 774-varden har sitt eget parti over 30. Begge er en annen dag og en annen snø enn normalruta.",
      "Den andre dokumenterte ruta tar østsida fra båthamna i Kongsvik — 792 høydemeter på 4,94 km, forbi Tunellen på 453 moh, den kilden setter til «ca. 450». Den er brattere enn nordryggen: 33,5 grader i bratteste steget mot 22,9, og over Tunellen ligger 30–40 grader. Kilden sier selv at du kan gå opp den for å se Tunellen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, og det er ryggen som bærer klassifiseringen: kilden gir ryggpartiet 30 grader, terrengmodellen måler den slakeste linja langs den til 22,9. Begge tallene står her, for det er avstanden mellom dem som er marginen din når snøen er hard.",
      },
      {
        title: "Øst og sørøst",
        body: "Flankemålingen fra toppen viser 53,3 grader mot øst og 60,5 mot sørøst — Tunellen-sida er bratt fra første meter, og sørvest er den eneste slake kanten med 5,5 grader i snitt. Nedkjøring østover er en stabilitetsvurdering, ikke en snarvei.",
      },
      {
        title: "Før du går",
        body: "Taraldsviktinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og isøks og stegjern for ryggen, som utstyrslista sier.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L24,199 L51,200 L71,192 L95,188 L119,187 L143,185 L167,182 L190,179 L208,174 L229,169 L250,161 L280,151 L306,144 L328,136 L357,123 L381,114 L399,105 L429,91 L453,83 L476,76 L495,73 L512,63 L528,55 L546,43 L560,36 L578,26 L600,18",
      startLabel: "5 moh",
      endLabel: "776 moh",
      distanceLabel: "4,5 km",
      caption: "779 høydemeter og 4,53 km fra Dalelvas utløp i Fiskefjorden langs traktorveien, gjennom Mølnskaret på 538 og sørover nordryggen — skoggrensa på 368 moh, og det bratteste beltet, 19,0 grader, mellom 600 og 700 moh.",
    },
  },
  nonstinden: {
    slug: "nonstinden",
    intro:
      "973 høydemeter og 5,72 km fra rundkjøringa i Gullesfjordbotn til en topp uten én slak side: alle åtte flankepeilinger måler 21,5 til 38,9 grader i snitt, og kildens fire bratte nedkjøringer er nettopp det. Normalruta går vest for botn, opp ryggen fra 155 og vest inn i den bratte renna — turens bratteste parti, 31,1 grader, ligger mellom 542 og 563 moh der renna leverer mot platået. Komplekst hos Fri Flyt, alpinøks og stegjern, grad 4.",
    ascent: [
      "Fra den store parkeringsplassen ved rundkjøringa — 49 moh — går du vest rundt botn, forbi parkeringa på vestsida, og gir fra deg 46 meter ned mot fjæra før ryggfoten tar imot på 75. Skogen slutter allerede på 125 moh etter 2,77 km — det meste av skituren er over tregrensa.",
      "Ryggen nordover er førsteakten: 289 moh der linja står på den, med beltet fra 100 til 200 på 20,5 grader. Før det brattere partiet svinger du vest inn i renna på 376 — og det er her fjellet viser seg: beltet fra 500 til 600 måler 24,1 grader, med turens bratteste enkeltparti, 31,1, mellom 542 og 563.",
      "Renna leverer deg på platået vest for 685-høyden — 475 moh der linja tar det — og traversen vestover passerer 793 før varden på 930; registeret løser 929,9. 92 meter gir du tilbake underveis, fjæra rundt botn medregnet.",
    ],
    descent: [
      "Samme vei ned er normalen: 25–40 grader hos Fri Flyt, og renna krever den samme snøen ned som opp. De tre andre — nordsiden med parti på 30–40, vestsida mot Løbergsdalen på 30–40, og Karirenna — er grunnene til at fjellet står i denne boka.",
      "Karirenna mot nordøst er ekspertlinja: 45–50 grader med stor steinsprangfare i øvre del, og kilden krever stabil snø med god fylling. Flankemålingen gir nordøstflanken 50,3 grader — dagen for den velges med omhu, og den velges sjelden.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Komplekst hos Fri Flyt, og målingen forklarer hvorfor: ingen av toppens åtte kanter måler under 21,5 grader i snitt, og normalruta selv holder 24,1 i bratteste belte med renna på 31,1. Alpinøks og stegjern i utstyrslista. Dette er rundens alvorligste fjell — grad 4.",
      },
      {
        title: "Renna og skavlene",
        body: "Renna i normalruta er terrengfella på oppturen: bratt nok til å skli, samlende nok til å begrave. Gå den én og én, og snu når snøen sier nei. Karirenna har i tillegg steinsprang i øvre del — den er en annen kategori enn resten av fjellet.",
      },
      {
        title: "Før du går",
        body: "Nonstinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.",
      },
    ],
    elevationProfile: {
      path: "M0,191 L32,193 L61,198 L67,199 L74,199 L88,200 L100,199 L129,199 L152,200 L159,200 L182,200 L211,199 L234,200 L263,195 L285,182 L302,166 L329,151 L351,145 L371,135 L395,129 L419,124 L444,111 L466,97 L483,82 L499,71 L524,68 L554,52 L579,33 L600,18",
      startLabel: "49 moh",
      endLabel: "930 moh",
      distanceLabel: "5,7 km",
      caption: "973 høydemeter og 5,72 km fra rundkjøringa i Gullesfjordbotn vest for botn, opp ryggen og den bratte renna til platået — skoggrensa på 125 moh, og det bratteste, 31,1 grader mellom 542 og 563 moh, i selve renna.",
    },
  },
  snotindan: {
    slug: "snotindan",
    intro:
      "1544 høydemeter og 8,80 km for en 996-topp — Snøtindan er turen der skaret koster mer enn toppen: 561 meter gis tilbake underveis, over Løbergskaret og tjernshyllene, og linja holder land forbi alle vatnene der kilden krysser på isen. KAST 3 – Komplekst med alpinøks og stegjern, 8–9 timer hos kilden, og et toppheng på 30–40 grader til slutt. Registeret skriver Snytindan; ut.no skriver Stor Snytindan; kortet følger Fri Flyt.",
    ascent: [
      "Fra parkeringa langs fv. 85 ved Løbergsbukta — 13 moh der veien runder bukta. Løbergsdalen har utløpssoner på begge sider, og kildens regel er presis: gå midt i dalen. Beltene fra 100 til 400 måler 20 til 22 grader — turens bratteste hundremetersbelte, 22,1, ligger her — og skogen slutter allerede på 287 moh etter 1,3 km.",
      "Linja passerer sør for det øvre tjernet i dalen og går over Løbergskaret på 746 — så gis høyden tilbake: ned forbi tjernet på 573 (på land, sør for det; omrutingene står i forskningsposten) til hyllene på 560-nivået. Beltene her måler 2 til 4 grader over kilometervis av flate — det er langt, og det er poenget med 8–9-timersanslaget.",
      "Fra hyllene tar toppflanken over: 13,9 og 18,1 grader i beltene fra 800, og det bratteste sammenhengende partiet — 33,8 grader mellom 947 og 974 moh — i topphenget kilden gir 30–40 grader med mulig toppskavl. Varden på 996 står på trippelpunktet der Kvæfjord, Lødingen og Sortland møtes; registeret løser 996,2.",
    ],
    descent: [
      "Ned samme vei — topphenget først, mens du vet hva snøen gjorde på veien opp, så hyllene og motbakken opp igjen til Løbergskaret: 185 av de 561 metrene du gir fra deg, skal klatres på hjemveien. Nordsektoren fra toppen måler 13,6 grader i snitt — veien linja kom.",
      "Sør- og østsida er en annen historie: 39,1 og 38,6 grader i snitt med vinduer på 59,7 og 52,8. Og i dalen gjelder samme regel ned som opp: midt i, mellom utløpssonene.",
      "Kilden gir to startsteder, ikke ett: «Egen parkeringsplass langs R85, rett på sørsiden av elveutløpet. For østruta parkeres det på Gullesfjordbotn camping.» Østruta er den andre, og den kommer inn fra motsatt side av fjellet. Fra campingen på 3 moh holder linja nordsiden av Vesterelva forbi 86 og 91, over vatnet på 76 — 121 der linja går — og videre mellom vatnene på 167 til vatnet på 113, som krysses vestover på 278. Så den bratte traseen kilden setter til 30–40 grader, opp forbi 293 og 326 til vatnet på 289 på 332, og sørover langs den slake ryggen på 440 til høyda 667. Derfra under toppen av Vestbotntinden — linja går over skuldra på 864, ikke over toppen på 935 — og ned 259 høydemeter til Øvre Storelvvatnet på 605, over vatnet, og opp igjen på 652 og 803 inn på ruta fra Snytindhytta som runder toppen på vestsiden. 1360 høydemeter på 8,52 km mot 1544 på 8,80 km fra Løbergsbukta: litt kortere, mindre klatring, 367 meter tilbake mot 561 — det er to traverser av samme fjell fra hver sin fjord. Linja står på is fire steder, og alle fire er kildens egne: 135 meter over vatnet på 76, 90 meter over vatnet på 115 — kildens «vann 113» — 191 meter over vatnet på 274, og 150 meter over Øvre Storelvvatnet på 590. «Krysset vann 76», «vann 113 krysses vestover», «stak over vannet», skriver den. Skogen slipper på 212 moh etter 2,46 km. Beltet fra 400 til 500 moh måler 21,1 grader og det bratteste 30-metersvinduet 36,5 mellom 973 og 996, i topphenget. Alpinøks og stegjern står i faktaboksen for begge rutene.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 3 – Komplekst hos Fri Flyt, alpinøks og stegjern. Linja er lang før den er bratt: alt over 30 grader er samlet i topphenget (33,8 målt, 30–40 hos kilden, mulig toppskavl) — og Løbergsdalen med utløpssoner på begge sider er inngangsbilletten begge veier. Grad 4.",
      },
      {
        title: "Dalen",
        body: "Gå midt i dalen — kildens egne ord, og terrenget forklarer dem: sidene er utløpssoner, og midten er marginen. På dager med dårlig stabilitet er dalen stengt, og da er turen det også.",
      },
      {
        title: "Vatnene",
        body: "Linja holder land forbi alle tre vatnene — tjernet i dalen, tjernet på 573 og vatnene ved hyllene — der kilden krysser på isen. Det koster høydemeter (kortet bærer 1550 mot kildens 1250–1350), og det er derfor tallet er større enn fjellet.",
      },
      {
        title: "Før du går",
        body: "Snøtindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — trippelpunkt-fjellet svarer til det varselet. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og alpinøks og stegjern.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,194 L55,184 L81,157 L101,136 L122,119 L140,105 L158,112 L184,112 L199,96 L223,82 L245,78 L266,84 L290,82 L315,63 L337,69 L361,65 L379,63 L404,79 L427,95 L450,97 L474,97 L496,96 L518,85 L538,71 L557,56 L574,40 L596,22 L600,18",
      startLabel: "13 moh",
      endLabel: "996 moh",
      distanceLabel: "8,8 km",
      caption: "1544 høydemeter og 8,80 km fra Løbergsbukta midt i Løbergsdalen, over Løbergskaret og forbi vatnene på land, med skoggrensa på 287 moh og det bratteste — 33,8 grader mellom 947 og 974 moh — i topphenget.",
    },
  },
  fiskefjordtindan: {
    slug: "fiskefjordtindan",
    intro:
      "1044 høydemeter og 7,27 km fra Kanstadbotn til en topp med to sannheter: registerpunktet står på nordtoppen, som terrengmodellen leser 998,9 — men Fri Flyts 967 er sørtoppen, som klatrer til 964,7, og det er dit ruta går. Sørvestsiden er snill — beltet fra 500 til 600 måler 4,0 grader — men østryggen til slutt er eksponert, med turens bratteste parti på 32,8 grader like under varden og en østside som måler 67,2 der den er brattest. Øks og stegjern i sekken.",
    ascent: [
      "Fra parkeringslomma ved Kobbedalselv bru i Kanstadbotn — 15 moh — følger du sommerstien nordøstover: 176 moh der linja tar den, skoggrensa allerede på 225 etter 1,58 km, og lia på 369. Beltet fra 300 til 400 måler 5,9 grader — dette er slak, åpen skinning.",
      "Ryggen mellom vatnene er turens midtparti: 578 moh der linja står mellom Kobbedalsvatna, 702 videre oppover, og beltet fra 500 til 600 er turens slakeste med 4,0 grader over 1582 meter grunn. Undulasjonen her er grunnen til at turen samler 1044 meter for en 965-topp — 94 gir du tilbake.",
      "Vestflanken på 856 leverer deg til finalen: ryggen østover, eksponert slik kilden sier, med det bratteste enkeltpartiet — 32,8 grader mellom 885 og 907 moh — like under toppen. Varden står på 965; nordtoppen med registerpunktet og sine 998,9 ligger 900 meter lenger nord, på andre sida av et skar, og er ikke turen.",
    ],
    descent: [
      "Samme vei ned: behagelige 20–25 grader hos Fri Flyt når østryggen er bak deg, og målingen er enig — ingen hundremeter under toppartiet passerer 15,2. Vestflanken og ryggen mellom vatnene er kjøring for alle bein.",
      "Nordøstruta ned østsida går i ei fin renne på opptil 40 grader med mye utløpssoner — flankemålingen gir østsida 67,2 grader der den er brattest og sør 62,7. Den krever stabil snø, og den er en annen tur enn denne.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, og det meste av linja er enig: 15,2 grader i bratteste belte, og slakere enn det i timevis. Men alpinøks og stegjern står i kildens utstyrsliste for østryggen — 32,8 grader målt, eksponert mot ei østside på 67 — og det er Gråfjell-regelen som setter grad 3 på kortet.",
      },
      {
        title: "Østsida",
        body: "Renna i nordøstruta holder opptil 40 grader med mye utløpssoner, og flankemålingen gir hele østflanken 58,9 til 67,2 grader i sine bratteste vindu. På toppen er avstand til østkanten billig forsikring — særlig i flatt lys, og særlig med skavl.",
      },
      {
        title: "Før du går",
        body: "Fiskefjordtindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,197 L49,193 L71,183 L90,176 L112,169 L134,159 L164,146 L186,138 L212,135 L235,128 L257,125 L283,119 L301,106 L319,94 L339,90 L356,93 L376,90 L398,93 L422,94 L439,79 L458,68 L479,58 L498,55 L521,48 L536,37 L558,29 L578,23 L599,19 L600,18",
      startLabel: "15 moh",
      endLabel: "965 moh",
      distanceLabel: "7,3 km",
      caption: "1044 høydemeter og 7,27 km fra Kanstadbotn over ryggen mellom Kobbedalsvatna til sørtoppen på 965 — skoggrensa på 225 moh, og det bratteste, 32,8 grader mellom 885 og 907 moh, på den eksponerte østryggen.",
    },
  },
  moysalen: {
    slug: "moysalen",
    intro:
      "Fra 23 moh til 1264, og 1602 høydemeter for å komme dit — 361 av dem gir du fra deg underveis, og 120 av dem på ett strekk ned til Grønnvatnet. Vesterålens høyeste er en av de få turene i denne appen som starter ved sjøen og ender på en rygg der folk tar av seg skiene. Friflyt setter den til KAST 3, 11 til 18 timer, og krever isøks og stegjern.",
    ascent: [
      "Fra den store parkeringa langs E10 på sørsida av Litlvatnet, 23 moh, går ruta nordover gjennom vassdraget. E10 er helårsveg, og dette er startpunktet Friflyt bruker — de guida sommerturene fra Møysalen Nasjonalparksenter begynner med båt fra Hennes inn i Lonkanfjorden, men det er en annen tur. De første to kilometrene er flate: bandet 100 til 200 moh måler 2,9 grader over 2165 meter grunn. Skogen slipper taket sent for å være Vesterålen: siste vertex med terrengklasse Skog ligger på 234 moh, 2900 meter ute, og neste vertex, 240 moh, er myr. Bjørka nede i dalen står i lag med myra, så du går inn og ut av den hele veien opp — 55 av rutas 333 punkter er skog, fra 12 til 234 moh.",
      "På 154 moh går linja 90 meter over Forkledalsvatnan, høyst 14 meter fra land, og på 391 moh 247 meter over Rundvatnet, høyst 71 meter fra land. Begge er naturlige vann — DTM1 gir terrengklasse Innsjø, og OSM-polygonene bærer ingen reservoartagger. På 328 moh kommer den tredje: 225 meter over Grønnvatnet, opptil 86 meter fra land. Det er det største av de tre, og det er også vannet rutebeskrivelsen navngir.",
      "Å komme til Grønnvatnet koster deg 120 høydemeter. Linja går over høyde 450 — 450,7 moh målt — og faller så fra 448 til 328 over 736 meter grunn, det største sammenhengende fallet på veg opp. Dette er ikke en feil i linja, det er turen: netto stigning fra sjøen til toppen er 1241 meter, men det du faktisk går er 1596, og differansen er denne høyden og ryggene etter den.",
      "Fra Grønnvatnet stiger ruta jevnt, og her er det samme høyde 450 du nettopp gikk over som er holdepunktet: Friflyt sier at du skal ha den til høyre, altså øst for deg. Det er én høyde og ikke to — et åttevegs sveip fra punktet viser at bakken faller mot nord, nordøst og nordvest, ned mot vatnet, og stiger mot sør og sørøst til 513 og 516 moh. Det er en bred skulder, ikke et skar. Videre opp bekkedraget er den lange arbeidsstrekninga: bandet 800 til 900 moh måler 21,0 grader over 253 meter grunn og bandet 900 til 1000 moh 21,0 grader over 242, og det bratteste 400-metersvinduet på hele turen ligger her, 22,0 grader fra 774 til 939 moh.",
      "Isen ligger lavere enn du kanskje venter. Linja går over mark klassifisert som SnøIsbre fra 752 til 898 moh, sammenhengende over 405 meter grunn mellom 7700 og 8100 meter ute, uten et eneste bart punkt imellom. Peilinga fra toppen til den strekninga er 184 til 216 grader — sør til sørvest — og avstanden 422 til 582 meter. Korridorforskinga kalte vegpunktet «breen sørøst for Møysalen, ~1025 moh»; på det punktet gir terrengmodellen 1026,59 moh med terrengklasse ÅpentOmråde, og ringprøver 300, 500, 700 og 900 meter ut fra toppen finner SnøIsbre bare mot øst og mot sørvest. Sørøst er bar mark hele veien. Friflyt skriver at «selv om det kalles bre er det ikke åpne sprekker», og at den går normalt uten tau. Det bratteste 30-meterssteget oppover, 41,9 grader fra 1036 til 1063 moh, ligger 8500 meter ute — altså over isen og ikke under den.",
      "Over isen fortsetter ruta nordvest opp toppryggen, og ryggen er ikke jevn. 9332 meter ute stiger linja til 1170 moh og faller så 51 meter til 1119 over 27,3 meter grunn — et hakk, ikke en målefeil: tolv DTM1-punkt med 2,3 meters mellomrom gjennom fallet gir en sammenhengende kurve fra 1170,0 til 1119,2, og et rutenett på 40 meter til hver side gir fra 1186 til 1055 moh, så nabolinjene er ikke slakere. Det er dette som gjør at største steg langs ruta måler 62,9 grader, og det er her isøksa og stegjerna hører hjemme. De siste 500 metrene går på peiling 333 grader og stiger 124 meter; det bratteste 200-metersvinduet på turen, 24,3 grader fra 1189 til 1264 moh, er selve toppryggen.",
    ],
    descent: [
      "Ned samme vei. Fallvekta gjennomsnittsretning er 193 grader — sør — og det stemmer med kilden: Friflyt kaller nettopp Vestryggen «sørvendt bratt terreng», og beskriver alle de andre linjene på fjellet som sørvendte eller sydvendte. Kortet sa lenge sørøst; det tallet hvilte på et vegpunkt som ble kalt bre og ikke er det, og er rettet. Over hakket i ryggen går de fleste til fots.",
      "Vanligste feil er å regne turen i høydemeter i stedet for i timer. 1602 høydemeter og 9,77 kilometer hver veg, med et bratt parti under breen og en rygg som ofte er avblåst og hard, er 11 til 18 timer etter Friflyt. Snur du på breen, har du fortsatt 120 høydemeter opp fra Grønnvatnet igjen på hjemvegen. Den andre feilen er å tro at et sørvendt bratt parti på 21 grader over lang strekning holder seg stabilt gjennom dagen: tidspunktet avgjør om du møter gjennomvåt eller gjennomfrossen snø der.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "To partier bærer risikoen. Stigninga fra Grønnvatnet til breen ligger på 21,0 grader i snitt over begge bandene mellom 800 og 1000 moh og har brattere trinn i seg — 41,9 grader over det bratteste 30-metersvinduet, 8500 meter ute. Toppryggen er det andre: 24,3 grader over 200 meter, med et hakk der linja faller 51 meter over 27,3 meter grunn. Friflyt setter turen til KAST 3 og krever isøks og stegjern; breen beskrives som sprekkfri og går normalt uten tau.",
      },
      {
        title: "Terrenget rundt",
        body: "Møysalen har ingen slake sider. Et sveip 1000 meter ut i alle åtte retninger fra toppen gir 24,5 grader i snitt som det slakeste — det er sør — og 40,2 grader som det bratteste, mot øst. De bratteste 60-metersvinduene ligger på 55,9 grader i vest og 70,8 grader i øst, det siste allerede 10 meter fra toppen. Går du av ryggen, er det ingen retning som tar imot deg mildt. Det er derfor ruta følger ryggen hele veien og ikke leter etter en snarveg ned.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade, og isøks og stegjern i tillegg — på denne turen er de ikke valgfrie.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L23,198 L43,182 L68,179 L93,178 L118,182 L140,179 L162,176 L187,166 L211,158 L234,156 L258,145 L286,139 L308,140 L328,152 L355,152 L383,143 L405,133 L427,121 L444,107 L466,96 L491,79 L504,65 L523,51 L537,54 L553,43 L568,36 L585,31 L600,18",
      startLabel: "23 moh",
      endLabel: "1264 moh",
      distanceLabel: "9,8 km",
      caption: "1602 høydemeter fra E10 ved Litlvatnet til 1264 moh, 361 av dem gitt fra seg underveis og et 51 meters hakk i toppryggen.",
    },
  },
  forselvtinden: {
    slug: "forselvtinden",
    intro:
      "1180 høydemeter og 8,29 km fra Møysalens parkering på E10 til Forselvtinden — den lengste turen i runden, og den eneste ruta i appen som går over toppen av en annen tur på veien. Kildens egen beskrivelse starter med «følg ruta opp på Lakselvtindan», og det er 747 moh du står på før du går videre vestover. 296 av høydemeterne gir du fra deg. Fri Flyt gir KAST 2 – Utfordrende, men ber deg vurdere om skiene skal være med opp: grad 4.",
    ascent: [
      "Fra parkeringa — 23 moh — som på Lakselvtindan: nordsida av Storvatnet på 85, nord for høyde 258, og 217 moh der Lakselva krysses mot øst. Skogen slipper på 220 moh etter 2,48 km, og beltet fra 300 til 400 er det bratteste i snitt med 19,0 grader over 313 meter grunn.",
      "Opp på Lakselvtindan, 747 moh, og så vestover langs høydedraget til du står rett nord av høyde 790 — DTM1 måler 790,6, og korridoren står på 754 rett nord av den. Mellom 700 og 800 moh ligger to kilometer nesten flatt høyfjell: beltet måler 2,1 grader i snitt over 1955 meter grunn.",
      "Videre nordover holder ruta seg på nedsida — vestsida — av draget, 668 moh der korridoren er festet, fordi det er bratte partier rett før oppstigningen tar til. Så sydryggen: det bratteste steget på hele linja, 33,1 grader, ligger mellom 834 og 863 moh, rett under varden på 907.",
    ],
    descent: [
      "Samme veien hjem, for det meste under 20 grader med et par partier på 25–30, sier kilden. Men hjemveien er også en ny oppstigning: de 296 høydemeterne du ga fra deg skal tas igjen, og Lakselvtindan står i veien en gang til.",
      "Flankesveipet forklarer hvorfor sydryggen er den eneste veien opp og ned. S måler 22,5 grader i snitt med et 40,8-vindu 70 til 130 meter ute — det bratte partiet kilden nevner. N, NE, V og NV ligger på 46,9 til 48,6 i snitt med vinduer fra 60,6 til 75,9, og øst har 76,8 bare 30 til 90 meter ute.",
    ],
    avalanche: [
      {
        title: "Partiet før toppen",
        body: "Kilden kaller sydryggen et flott luftig parti med ett bratt parti før toppen, og ber deg vurdere om skiene skal være med opp. Målingen er enig: 40,8 grader i vinduet 70 til 130 meter ute, og 33,1 grader i det bratteste enkeltsteget linja faktisk går, mellom 834 og 863. Stegjern og alpinøks er anbefalt, og mange bærer skiene den siste biten.",
      },
      {
        title: "Vestsida av høydedraget",
        body: "Nordover langs draget skal du holde deg på nedsida, altså vestsida. Kilden er tydelig på hvorfor: det er bratte partier rett før oppstigningen på ryggen mot Forselvtinden tar til, og linja går rundt dem og ikke over. Øst for draget faller terrenget 76,8 grader i sitt bratteste vindu.",
      },
      {
        title: "Før du går",
        body: "Forselvtinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts, og 8,29 km med 296 høydemeter tilbake gjør dette til en tur der tidspunktet på dagen avgjør hvilken snø du møter på returen. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L23,200 L48,199 L72,192 L96,185 L117,179 L141,171 L164,156 L186,158 L209,160 L238,148 L256,132 L274,119 L297,103 L317,92 L343,80 L365,58 L382,51 L402,57 L419,62 L437,59 L463,59 L486,49 L505,61 L528,66 L551,50 L577,36 L597,21 L600,18",
      startLabel: "23 moh",
      endLabel: "907 moh",
      distanceLabel: "8,3 km",
      caption: "1180 høydemeter og 8,29 km fra Lofast: over Lakselvtindan på 747, vestover til nord for høyde 790 — og sydryggen til varden på 907.",
    },
  },
  middagsfjellet: {
    slug: "middagsfjellet",
    intro:
      "762 høydemeter og 2,91 km fra rundkjøringa i Gullesfjordbotn — rundens korteste tur, og en øvelse i å velge riktig: normalruta holder seg under 30 grader hele veien, med 20,6 som bratteste belte og 27,3 som bratteste parti, mens terrenget rundt måler 30–40 og vestsida mot Storskardet 54,4 der den er brattest. KAST 3 – Komplekst hos Fri Flyt, nettopp fordi den slakeste traseen er omgitt av det brattere.",
    ascent: [
      "Fra den store parkeringsplassen ved rundkjøringa — 49 moh, samme start som Nonstinden — går du opp den snødekte lia vest for Tverrelva: 194 moh der linja står i den, med skoggrensa på 265 etter 1,04 km. Beltet fra 100 til 200 måler 17,4 grader.",
      "Over skoggrensa fortsetter den jevne stigningen: 461 moh der linja er festet, og beltene fra 200 til 700 måler 18,2 til 20,6 grader — aldri slakt, aldri bratt, men omgitt av brattere: kilden er tydelig på at den slakeste traseen skal velges, for ruta er omkranset av mer skredfarlig terreng.",
      "Blåberget — kildens navn; registeret har ikke navnet her — passeres på 708, toppflanken leser 767, og varden står på 810; registeret løser 809,8. Turens bratteste enkeltparti, 27,3 grader mellom 437 og 454 moh, ligger midt i lia. Én meter gir du tilbake på hele turen.",
    ],
    descent: [
      "Samme vei ned, eller Tverrelva-dalen når snødekket er godt — og med mulig ising over tregrensa er stegjern verdt å vurdere, sier kilden. Nordsiden fra toppen måler 9,5 grader i snitt: kjøringen er snill der linja går.",
      "Vestsida mot Storskardet er den brattere varianten med mer skjermet snø — og skredterreng som krever egne vurderinger: flankemålingen gir vest 54,4 grader i vinduet 60–120 meter ut og sørvest 49,3. Øst måler 40,9. Det snille på dette fjellet er smalt, og det er poenget med det.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 3 – Komplekst hos Fri Flyt — ikke fordi normallinja er bratt, men fordi den er omgitt: linja måler 20,6 grader i bratteste belte og 27,3 i bratteste parti, mens terrenget rundt holder 30–40. Velg den slakeste traseen, sier kilden, og det er hele turen i én setning. Grad 3.",
      },
      {
        title: "Isingen og sidene",
        body: "Over tregrensa kan det ise — vurder stegjern, eller snu. Vestsida mot Storskardet måler 54,4 grader der den er brattest og er skredterreng med egne vurderinger; østsida måler 40,9. Nedkjøringen i Tverrelva-dalen krever godt snødekke og de samme vurderingene.",
      },
      {
        title: "Før du går",
        body: "Middagsfjellet ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–april er Fri Flyts, den lengste i runden sammen med Haukebøtinden-klassen. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,200 L47,199 L75,194 L95,191 L121,182 L140,176 L165,169 L176,164 L196,155 L214,148 L227,143 L242,137 L259,129 L279,122 L298,115 L309,109 L318,105 L333,98 L341,94 L354,90 L381,79 L390,75 L400,71 L415,65 L428,59 L438,54 L456,48 L479,41 L502,36 L520,34 L547,28 L563,24 L585,19 L600,18",
      startLabel: "49 moh",
      endLabel: "810 moh",
      distanceLabel: "2,9 km",
      caption: "762 høydemeter og 2,91 km fra rundkjøringa i Gullesfjordbotn opp lia vest for Tverrelva og over Blåberget — skoggrensa på 265 moh, og det bratteste, 27,3 grader mellom 437 og 454 moh, midt i lia.",
    },
  },
  strandtinden: {
    slug: "strandtinden",
    intro:
      "1144 høydemeter og 5,79 km fra E10 ved havet til toppen på 1076 moh — Harstad-områdets store klassiker, og et fjell uten en slak side. Bratteste hundremetersband på ruta er 19,8 grader mellom 600 og 700 moh og bratteste steg 29,1 mellom 736 og 761, men flankene rundt måler 40 til 64 grader i sine bratteste vindu. Ruta tar toppen fra vest fordi vest er den eneste kanten som ikke gjør det.",
    ascent: [
      "Start langs E10 der veien er nærmest utløpet av Heggedalen, 21 moh. Kilden gir ikke ett punkt, men en strekning: «Her er det flere muligheter langs E10, avhengig hvor mye som er brøytet», med en advarsel som er verdt å ta med seg — «dette er en høyt trafikkert vei med 80 km/t og få rette strekninger så vær forsiktig langs vei og parker heller litt lengre sør og traverser på øversiden av veien enn å skape farlige situasjoner langs veien». Veien under fjellet heter Strandstindvegen, etter fjellet.",
      "Normalruta følger Heggedalen på ryggen mellom de to elvene. Rundt 146 moh går ruta over på nordsida av elva, og de to punkthøydene rutebeskrivelsen navigerer etter dukker opp der de skal: slukta ved «høyde 505» måler 509,6 moh og «høyde 570» måler 570,3 — 234 meter fra hverandre. Kartverket fører siste skog på 143 moh og åpent terreng fra 157, så mesteparten av turen går i åpen fjellside. De første hundre høydemeterne er de bratteste i dalbunnen, 14,7 grader, og så slakner det til 8,0 og 10,6.",
      "Fra 570 svinger ruta sørover og holder østsida av bollen. Der ligger bratteste bandet på turen — 19,8 grader fra 600 til 700 moh over 270 meter grunn — og bratteste steget, 29,1 grader mellom 736 og 761. Bollen flater ut rundt 805 moh, og der gjør ruta det Fri Flyt sier: «Letteste vei til toppen er å holde høyre (vest) fra nå og bestige toppen via ryggen fra høyre (vest).» Linja går vestover langs benken — 1092 meter grunn på 5,4 grader mellom 700 og 800 moh — kommer opp på nordvestryggen ved 886 moh og følger ryggen over 952 og 1040 til toppen. De siste 600 metrene peker 135 grader: du kommer opp fra nordvest.",
    ],
    descent: [
      "Ned samme veien: ryggen ned til benken, benken østover og nordsida ned Heggedalen. Det er linja fjellet er kjent for — «nedkjøringen er samme rute som opp og er klassikeren der du kan dundre på og oppnå virkelig fri flyt og brede glis» — og i sesongen kjører man helt ned til veien ved havet. Snøen på nordsida ligger lenge nok til at midnattssol i juni ikke er uvanlig.",
      "Å gå rundt koster det å gå rundt koster. Den første korridoren tok toppen rett opp nordøstribba, og den linja var 4,77 km med 1090 høydemeter; over vestryggen er turen 5,79 km med 1156 og 89 meter gitt tilbake underveis. Fri Flyt er tydelig på hvorfor: «Det er helt klart mulig å gå opp på andre siden, men den er mer eksponert.» Ribba måler 1010,2 moh 150 meter fra toppen mot nordøst der ryggen måler 1039,8 mot nordvest — den er brattere hele veien opp.",
      "Rett nord for varden er det uansett bratt: 40,9 grader i bratteste 60-metersvindu bare 20 til 80 meter ut, med 24,8 grader i snitt ut til en kilometer. Der ligger også snøen som blir liggende — Kartverket fører terrengklassen SnøIsbre på nordsida fra rundt 1050 moh og nedover, mens ryggen ruta går på er bar mark i alle de seksten siste vertexene. De tre andre kantene er alvorlige: sør måler 30,6 grader i snitt med 63,9 grader i vinduet 20 til 80 meter fra varden, sørøst 30,9 med 62,5, øst 29,0 med 54,9, og sørvest 24,1 med 56,0. Fri Flyts to andre linjer — Kvanntoa i nordøst og Kvannto i øst — har partier på 45 grader og rappellfeste, og de er ikke ruta dette kortet beskriver.",
      "To av kildens sju linjer er egne oppstigninger med egen parkering, og begge møter turen først på høyde 779 — 787 moh der linja passerer — der de siste 300 høydemeterne nordøstover er felles. Fra Kåringen er det 1063 høydemeter og 8,18 km over Nordfjellaksla på 344 moh: den lengste og slakeste av de tre, med bratteste steg 32,2 grader mellom 973 og 994 moh, og kilden kaller den «en meget populær skitur med fjellski» der du oftest kan følge skispor fra veien. Fra Kanstadbotn er det 1140 høydemeter og 7,68 km, nord for høyde 519 og sør for Trollvatnan på 418 — kildens «sprekere variant», med et steg på 30,8 grader mellom 776 og 799.",
    ],
    avalanche: [
      {
        title: "Bollen",
        body: "Fri Flyt har ett faremoment på normalruta, og det er utvetydig: «I bollen er det flere ganger gått store skred, så velg dager med stabil snø.» Bollen er søkket ruta krysser mellom høyde 570 og benken på 805 moh, og det er der bratteste bandet på turen ligger — 19,8 grader fra 600 til 700 moh. Rutebeskrivelsen sender deg langs østsida av den, ikke gjennom midten.",
      },
      {
        title: "Fjellet har ingen slak side",
        body: "Ingen av de åtte retningene fra toppen måler under 17,0 grader i snitt ut til en kilometer, og fire av dem har 60-metersvindu over 50 grader. Vest er den slakeste — 17,0 grader i snitt, med 37,7 grader i vinduet 120 til 180 meter ut — og vest er ryggen ruta tar toppen fra. Fri Flyt fører turen som KAST 3 – Komplekst og lister alpinøks og stegjern som ekstra utstyr: «Det kan være greit med stegjern og alpinøks på dager med hard skare.»",
      },
      {
        title: "Før du går",
        body: "Skredvarselet for dette fjellet er Lofoten og Vesterålen på varsom.no, ikke en Harstad-region — toppen ligger i Lødingen kommune, og Varsom svarer på koordinaten. Det er en A-region med varsel hver dag i sesongen. Fri Flyt oppgir januar til juni. Kortet fører Harstad som region fordi det er derfra turen gås, og fordi det er slik begge kildene plasserer den; registeret kaller toppen Strandstinden og Djupfesttinden, og ingen av dem Strandtinden. Ta med sender/mottaker, søkestang og spade, og alpinøks og stegjern når skaren er hard.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,194 L41,184 L61,180 L84,179 L107,168 L130,163 L149,157 L172,149 L196,143 L219,135 L242,130 L261,123 L280,117 L298,107 L329,98 L350,85 L373,79 L396,71 L410,66 L438,69 L466,66 L486,59 L508,50 L533,47 L547,40 L561,35 L589,22 L600,18",
      startLabel: "21 moh",
      endLabel: "1076 moh",
      distanceLabel: "5,8 km",
      caption: "1144 høydemeter og 5,79 km fra E10 på 21 moh gjennom Heggedalen over 146, forbi slukta på 510 og høyde 570, over bollen til 805 og vestover benken til nordvestryggen på 886, 952 og 1040.",
    },
  },
  jotind: {
    slug: "jotind",
    intro:
      "1048 høydemeter og 6,34 km fra Mølnneset til Jotind — registerets Jotinden løser 979,4 mot publiserte 980. Østryggen: ryggen over Spannbogen, henget rett før 600 der skiene gjerne bæres, og en topprygg som smalner så mye at kilden anbefaler sommerruta på sørsida — eller tau. KAST 3 – Komplekst med alpinøks og stegjern. Grad 4.",
    ascent: [
      "Fra lomma på fv. 7548 Tjeldøyveien ved Mølnneset — 10 moh; kildens F711 — går linja opp fra neset og på ryggen over Spannbogen, 246 moh der korridoren står. Skoggrensa kommer allerede på 111 etter 0,48 km: dette er en rygg i havgapet, ikke en skogstur.",
      "Henget rett før 600 er stedet skiene gjerne bæres — kilden gir det 40 grader i fallinja, og modellens linje krysser det med 31,9 grader som bratteste enkeltparti, mellom 621 og 649 moh. Beltet fra 600 til 700 er det bratteste i snitt med 17,1.",
      "Østryggen fra 605 mot toppen: rett under varden smalner ryggen — sommerruta på sørsida er utveien, eller tau og litt utstyr på selve ryggen, sier kilden. SV-målinga, der sommerruta runder, er den eneste slake med 6,1 grader i snitt; N/NE/E har 46,4–54,3-vindu i de første 60 metrene.",
    ],
    descent: [
      "Samme vei ned, og vindutsatt: ett parti på 40 grader, resten 15–20, sier kilden. Linja gir tilbake 79 av de 1048 meterne den vinner — ryggen bølger, og fellene kan på igjen før Spannbogen.",
      "Nordsida via Svartvasshompen mot Trollvatnet og Storforrdalen er KAST 2-varianten — utenom skredterrenget langs scooterløypene, men en annen tur. NV-flanka fra varden faller 33,1 grader i snitt: østryggen er linja, ikke fallinjene rundt den.",
    ],
    avalanche: [
      {
        title: "Henget og toppryggen",
        body: "Henget før 600 er 40 grader hos kilden — skiene bæres, og øksa og stegjerna er for skare på ryggen. Toppryggen smalner: N/NE/E har 46,4–54,3-vindu i de første 60 metrene fra varden, og sommerruta på sørsida er utveien kilden selv anbefaler.",
      },
      {
        title: "Vinden",
        body: "Ryggen er vindutsatt hele veien, sier kilden — skavler og avblåst skare hører til, og tau nevnes for toppryggen på vanskelige dager. Snu ved henget om skaren ikke gir feste: resten av ryggen blir ikke lettere.",
      },
      {
        title: "Før du går",
        body: "Jotind ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,193 L46,181 L67,176 L88,178 L108,172 L126,168 L148,167 L169,163 L190,158 L209,150 L224,139 L246,128 L271,117 L297,109 L313,106 L332,104 L353,97 L373,95 L395,92 L422,90 L443,87 L463,72 L483,65 L502,62 L522,50 L538,39 L557,35 L582,22 L599,18 L600,18",
      startLabel: "10 moh",
      endLabel: "979 moh",
      distanceLabel: "6,3 km",
      caption: "1048 høydemeter og 6,34 km fra Mølnneset: ryggen over Spannbogen på 246, henget før 600 — og østryggen fra 605 til den smale toppen på 979, med sommerruta på sørsida som utveien.",
    },
  },
  forkledalstindan: {
    slug: "forkledalstindan",
    intro:
      "983 høydemeter og 5,48 km fra E10 ved Litlvatnet til Forkledalstindan — en tur som skifter karakter midtveis. Fri Flyt gir sydsida KAST 2 – Utfordrende opp til toppen på 700, og der snur mange og kjører ned; traversen videre til hovedtoppen på 901 er KAST 3 – Komplekst, med nedklatring på snø eller berg avhengig av forholdene. Kildens «700 høydemeter» er skituren, ikke fjellet. Grad 4.",
    ascent: [
      "Fra parkeringa på Ingelsfjordeidet — 23 moh — samme start som Lakselvtindan: nordsida av Storvatnet på stien, og opp til nord for høyde 258. Linja holder seg på land der kilden krysser isen, slik bokas egen Forkledalen-rute fra samme parkering gjør.",
      "Derfra går oppstigningen vestover i det slakeste terrenget, over nordsida av høyde 462 — DTM1 måler 461,1 — på 400 moh der korridoren står, og videre opp fjellsida på 509. Skogen slipper på 226 moh etter 2,51 km, og beltet fra 400 til 500 er det bratteste i snitt med 21,2 grader over 260 meter grunn.",
      "Toppen på 700 — 707 moh på linja — er der kildens skitur ender. Traversen videre over fortoppen er den alpine delen: det bratteste enkeltsteget på ruta, 45,0 grader, ligger mellom 869 og 901 moh, i det siste stykket opp til varden. Siste stykket opp til varden på 901 tar du med fordel på østsida i starten, sier kilden — der slipper du den vanskelige klatringen.",
    ],
    descent: [
      "105 av de 985 høydemetrene gir du fra deg underveis. Mange starter nedkjøringa allerede fra 700-toppen, i slakt terreng med et brattheng som kan gås utenom, og det er den turen kildens høydemetertall beskriver.",
      "Fra hovedtoppen er nordvestsida linja: den starter mellom 902 og sørtoppen og er 20–25 grader med brattheng på 30–40 i nedre del. Nordøstsida er 30–40 grader og følger etter hvert vestruta til Lakselvtindan ned i Forkledalen. Begge går eksponert for skred fra høyereliggende terreng nesten hele veien.",
    ],
    avalanche: [
      {
        title: "Traversen",
        body: "Fra 700 til 901 er graderingen KAST 3 – Komplekst. Avhengig av snøforholdene må du kanskje klatre litt ned på snø eller berg for å komme videre, og siste delen er svært bratt og eksponert: det bratteste steget måler 45,0 grader mellom 869 og 901. Kilden viser et bilde av flakskred tett under toppen, og skriver at mye snø blir satt i bevegelse og at det er lett å bli begravd.",
      },
      {
        title: "Alle sider er bratte",
        body: "Flankesveipet finner et vindu mellom 37,7 og 60,0 grader innenfor de første 100 metrene av varden i alle åtte retninger. Nordøst er mildest med 37,7 og 23,5 i snitt; sørvest er slak de første 340 metrene og har så 46,4. Henget ned fra høyde 790 til vann 355 på nordsida er KAST 3 i kildens egen vurdering.",
      },
      {
        title: "Før du går",
        body: "Forkledalstindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade, og alpinøks og stegjern — her er de ikke en anbefaling, men det traversen krever. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L25,199 L55,200 L75,199 L99,198 L130,193 L147,185 L170,188 L191,179 L215,178 L240,165 L265,155 L289,157 L309,152 L324,142 L353,126 L373,125 L392,115 L416,98 L435,88 L452,77 L466,69 L482,61 L500,56 L517,49 L539,41 L559,31 L583,29 L600,18",
      startLabel: "23 moh",
      endLabel: "901 moh",
      distanceLabel: "5,5 km",
      caption: "983 høydemeter og 5,48 km fra Litlvatnet: nordsida av høyde 462, fjellsida til toppen på 700 — og traversen videre til varden på 901.",
    },
  },
  lakselvtindan: {
    slug: "lakselvtindan",
    intro:
      "822 høydemeter og 5,55 km fra Møysalens parkering på E10 til Lakselvtindan — den mildeste toppen i denne runden. Flankesveipet måler 5,4 grader i snitt mot nordvest og 17,7 mot sørvest, der ryggen kommer, og ingen av peilingene har et brattere vindu enn 50,4. Fri Flyt gir KAST 2 – Utfordrende og setter alpinøks og stegjern på utstyrslista; grad 3 kommer av utstyret og skaren kilden advarer mot, ikke av bratthet.",
    ascent: [
      "Fra den store parkeringa på Ingelsfjordeidet — 23 moh — går linja langs nordsida av Storvatnet, på stien. Kilden skriver «kryss Storvatnet», men bokas egen rutebeskrivelse for Forkledalen fra samme parkering sier «følger man Nordsiden av Storvatnet». Kartet bærer landlinja; isen er ikke en forutsetning.",
      "Opp mellom Tverrelva og Lakselva — 158 moh — og nord for høyde 258, som DTM1 måler til 258,3. Skogen slipper på 220 moh etter 2,62 km, og beltet fra 300 til 400 er det bratteste i snitt med 20,0 grader over 261 meter grunn.",
      "Så flater det ut innover: 217 moh der Lakselva krysses mot øst, og derfra ryggen — 481 moh der korridoren står i den — helt opp til varden på 747. Det bratteste enkeltsteget på hele linja, 25,5 grader, ligger oppe på ryggen mellom 656 og 674 moh; nede i lia over parkeringa, der linja følger stien, er det 21,1 grader mellom 68 og 80 moh.",
    ],
    descent: [
      "Samme ryggen hjem. 98 av de 822 høydemeterne gir du fra deg på vei opp, det meste i det flate partiet før Lakselva, og ingen av beltene på linja måler over 20,0 grader i snitt. Kilden nevner skare, og skarejern hører med i sekken sammen med øksa og stegjerna.",
      "Variantene er en annen sak enn normalruta. Rødhammarrenna på østsida er KAST 3: skåla vest for normalruta er 30–40 grader, så et brattheng på 45 ned mot renna, og skredterreng hele veien gjennom. Vestsida ned til vann 355 mellom Forselvtinden og Forkledalstinden har et bratt parti på 30–40 grader.",
    ],
    avalanche: [
      {
        title: "Rødhammarrenna",
        body: "Østsida er ikke normalruta. Kilden gir den KAST 3 og beskriver et brattheng på 45 grader ned mot renna, med skredterreng hele renna gjennom fordi sidene omkring kan bære mye snø. Selve renna er 15–20 grader med noen partier på 25–30 — det er innsteget og det som henger over, ikke utløpet, som avgjør om den går.",
      },
      {
        title: "Skare og vind",
        body: "Dette er en tur der problemet like ofte er hardt underlag som ustabil snø. Kilden ber deg ha skarejern med, og fra 481 moh og opp er ryggen avblåst og vindpakket — det er der alpinøksa og stegjerna på utstyrslista hører hjemme.",
      },
      {
        title: "Før du går",
        body: "Lakselvtindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts egen. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L24,198 L45,198 L73,199 L87,200 L104,198 L130,191 L152,181 L179,178 L200,175 L225,164 L249,150 L269,145 L293,149 L322,152 L346,150 L366,140 L391,126 L409,110 L434,94 L458,84 L465,84 L488,78 L513,67 L541,52 L557,40 L576,26 L600,18",
      startLabel: "23 moh",
      endLabel: "747 moh",
      distanceLabel: "5,6 km",
      caption: "822 høydemeter og 5,55 km fra Lofast: nordsida av Storvatnet, opp mellom elvene forbi høyde 258 — og ryggen øst for Lakselva til varden på 747.",
    },
  },
  siriskolten: {
    slug: "siriskolten",
    intro:
      "669 høydemeter og 3,27 km fra grustaket til Siriskolten — 659,2 på skjermen mot publiserte 658, og Tjeldøyas innsteg: KAST 1 – Enkelt, 10–15 grader øverst og et parti på 20–25, ideell for ferske, sier kilden. Sommerruta fra nordsida gjennom slakt, kupert terreng med glissen skog. Grad 1.",
    ascent: [
      "Fra lomma ved grustaket på fv. 7548 Myklebostadveien — 7 moh; kildens F711 — følger du sommerruta sørvestover: OSM-stien starter på punktet, og skoggrensa ligger på 110 etter 0,4 km. Beltet fra 0 til 100 måler 14,7 grader i den korte skogslia.",
      "Gjennom det slake, kuperte terrenget — 411 moh der linja står i sommerruta — og bekken sør for 414-høyden: beltet fra 300 til 400 er det bratteste i snitt med 18,6 grader, kildens parti på 20–25.",
      "Vestover mot toppen fra 631: beltet over 600 måler 7,2 grader, og hele turens bratteste enkeltparti, 23,5 grader, ligger helt nederst mellom 23 og 41 moh — over skoggrensa er dette fjellet aldri bratt. Varden står på 659.",
    ],
    descent: [
      "10–15 grader øverst, 20–25 forbi 414-høyden, og så det slake kuperte terrenget hjem — kjøring for ferske, og for dager da varselet stenger de store fjellene. NE og V fra varden måler 7,9–9,2 grader i snitt.",
      "Kilden krever én ting: navigasjon og god sikt. Terrenget er kupert med glissen skog, og S/SE-flankene faller 26,9–27,7 grader i snitt med 47–49-vindu — kantene mot sør er de eneste å vite om, og i skodde er de nære.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, og modellen er enig: 18,6 grader i det bratteste beltet, 23,5 i det bratteste enkeltpartiet — nederst i skogen. Kildens ord om at toppen brukes når skredfaren truer andre fjell står som kildens vurdering; varselet leses uansett.",
      },
      {
        title: "Sørkantene",
        body: "S og SE faller 26,9–27,7 grader i snitt med vindu på 47–49 — også nybegynnertoppen har kanter. Ruta kommer fra nord og har ingen grunn til å nærme seg dem; i skodde er kompasskursen hjem nordøst, mot grustaket.",
      },
      {
        title: "Før du går",
        body: "Siriskolten ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L16,196 L32,187 L49,181 L65,174 L90,165 L106,159 L131,151 L156,141 L172,134 L182,130 L194,125 L213,115 L224,109 L240,101 L252,94 L271,87 L288,90 L304,89 L329,89 L348,86 L366,79 L387,70 L403,64 L428,58 L444,55 L466,50 L486,45 L502,40 L524,31 L543,28 L558,27 L571,22 L584,20 L600,18",
      startLabel: "7 moh",
      endLabel: "659 moh",
      distanceLabel: "3,3 km",
      caption: "669 høydemeter og 3,27 km fra grustaket på fv. 7548: sommerruta gjennom det kuperte terrenget, bekken sør for 414-høyden — og vestover fra 631 til varden på 659.",
    },
  },
  trollfjellet: {
    slug: "trollfjellet",
    intro:
      "1028 høydemeter og 6,62 km fra Valvågen til Tjeldøyas eneste topp over 1000 — og til en navnefelle: øya har to registerførte Trollfjellet, en 660-kolle i nordøst og denne, som løser 1008,9 mot publiserte 1010. Vestbredden av Forsdalselva mellom furuene, øst for Kjerstadtinden og ryggen til topps. KAST 1 – Enkelt hos Fri Flyt: 10–15 grader med parti på 30 på ryggen. Grad 2 — sol og slak fin kjøring, ettermiddagsturen på øya.",
    ascent: [
      "Fra lomma på fv. 7548 Tjeldøyveien ved Valvågpollen — 3 moh; kildens F711 er dagens fylkesveg — går linja over elva og opp mellom furuene på vestbredden av Forsdalselva, 109 moh der korridoren står i lia. Skoggrensa ligger på 204 etter 2,43 km, og beltet fra 0 til 100 måler 3,9 grader over den lange innmarsjen.",
      "Mellom skredterrenget mot østsida av Kjerstadtinden — 651 moh der linja er festet — og forbi vatnet på 672 i bollen under ryggen. Beltet fra 400 til 500 er det bratteste i snitt med 17,9 grader, og det bratteste enkeltpartiet, 26,1 grader mellom 326 og 348 moh, ligger i lia over skogen.",
      "Ryggen fra 981 til varden på 1009: beltet over 1000 måler 1,8 grader — toppen er ei vidde. Kildens parti på 30 på ryggen bor i N-vinduet, som måler 39,1 på flankemålinga.",
    ],
    descent: [
      "Sol og slak fin kjøring, sier kilden — 10–15 grader med parti på 30, samme vei som opp. SV og V fra varden er de slakeste målingene med 4,9 og 14,1 grader i snitt: vestsiden er fjellets snille akse.",
      "SE faller 31,4 grader i snitt med 58,3-vindu, og varianten på nordvestsida (30–40 grader) er KAST 2 og en annen linje. Hold vestaksen hjem — og hold igjen ved vatnet, så slipper du å felle om for de siste metrene opp fra bollen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, og modellen er enig: 17,9 grader i det bratteste beltet, 26,1 i det bratteste enkeltpartiet. Linja er lagt mellom skredterrenget mot østsida av Kjerstadtinden — den passasjen er grunnen til at ruta går der den går, også i skodde.",
      },
      {
        title: "Kantene",
        body: "SE-flanka faller 31,4 grader i snitt med et 58,3-vindu, og østsida måler 22,8 med 54,9-vindu — øyas snilleste tusenmeter har voksne kanter mot øst og sørøst. Nordvestvarianten (30–40 grader) er for stabile dager.",
      },
      {
        title: "Før du går",
        body: "Trollfjellet ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L20,199 L43,200 L61,199 L90,198 L110,191 L130,183 L151,175 L175,167 L198,166 L220,163 L240,155 L262,146 L279,137 L302,126 L314,118 L338,102 L359,90 L375,81 L400,81 L424,78 L445,69 L465,56 L485,49 L506,42 L526,32 L546,28 L569,22 L591,19 L600,18",
      startLabel: "3 moh",
      endLabel: "1009 moh",
      distanceLabel: "6,6 km",
      caption: "1028 høydemeter og 6,62 km fra Valvågen: vestbredden av Forsdalselva, øst for Kjerstadtinden på 651 — og ryggen fra 981 til varden på 1009, Tjeldøyas eneste topp over 1000.",
    },
  },
  sebortinden: {
    slug: "sebortinden",
    intro:
      "899 høydemeter og 4,02 km fra parkeringa langs E10 sør for Litlvatnet — samme plass som Møysalen — til Sebortinden: 830,8 på skjermen mot publiserte 834. Nordsida: opp Forkledalen, sørsida av bekken langs ryggen, og traversen på østryggens flanke mot framtoppen øst for punkt 799. KAST 3 – Komplekst med alpinøks og stegjern; sluttstøtet er rundt 30 grader. Grad 4.",
    ascent: [
      "Fra den store parkeringa langs E10 — 23 moh, Møysalens plass — går linja opp Forkledalen, 136 moh der korridoren står i dalen. Skoggrensa ligger på 195 etter 2,10 km, og beltet fra 100 til 200 måler 3,8 grader over den lange dalbotnen.",
      "Der renna med bekken tar av til venstre følger du sørsida av bekken langs ryggen — 194 moh — og før 400 legger linja seg på det slakeste av østryggens flanke: beltet fra 300 til 400 er det bratteste i snitt med 24,2 grader, og det bratteste enkeltpartiet, 31,7 grader, ligger mellom 312 og 338 moh.",
      "Traversen mot framtoppen øst for punkt 799 — 619 moh der linja er festet — og sluttstøtet på rundt 30 grader, der stegjern og øks avgjør på hard skare. Varden står på 831.",
    ],
    descent: [
      "Samme vei ned — fin cruising, sier kilden, men nedturen krysser skredterreng, og linja gir tilbake 91 av de 899 meterne den vinner på ryggens bølger.",
      "Variantene er alvorlige: Sebortindrenna i sørvest — 47,8 grader i snitt på flankemålinga, med 69,0-vindu — går med skred hvert eneste år, sier kilden. Forkleet på østsida når opp mot 45 forbi granittveggen på 120 meter, og Vinkelrenna holder 30–45 med svært utsatt topparti. Alt dette er andre turer.",
    ],
    avalanche: [
      {
        title: "Nordsida",
        body: "Normalruta krysser skredterreng, sier kilden — KAST 3 – Komplekst, med alpinøks og stegjern for sluttstøtet på rundt 30 grader. N-flanka leser 46,1 i sitt bratteste vindu: framtoppen er stedet å vurdere resten av dagen fra.",
      },
      {
        title: "Rennene",
        body: "Sebortindrenna går med skred hvert eneste år — kildens egne ord, og målinga er enig: 47,8 grader i snitt, 69,0 i vinduet. Forkleet (opp mot 45) og Vinkelrenna (30–45, svært utsatt øverst) er for erfarne på utvalgte dager, og et fall øverst i Vinkelrenna er ikke til å overleve, sier kilden.",
      },
      {
        title: "Før du går",
        body: "Sebortinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — samme region som Møysalen, som deler parkeringa. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L26,197 L46,200 L72,191 L92,179 L112,169 L139,163 L165,168 L187,168 L213,168 L239,167 L260,172 L287,168 L307,161 L334,158 L350,149 L367,138 L382,125 L394,117 L407,111 L421,104 L440,93 L458,84 L474,76 L495,65 L517,64 L535,55 L552,45 L568,36 L588,23 L600,18",
      startLabel: "23 moh",
      endLabel: "831 moh",
      distanceLabel: "4,0 km",
      caption: "899 høydemeter og 4,02 km fra Møysalens parkering på E10: Forkledalen, sørsida av bekken — og traversen på østryggens flanke mot framtoppen øst for 799, før sluttstøtet til varden på 831.",
    },
  },
  helligtinden: {
    slug: "helligtinden",
    intro:
      "954 høydemeter og 5,04 km fra Breivikbotn til Helligtinden — 948,0 på skjermen mot publiserte 948, på desimeteren. Nordryggen: hyttefeltet ved Krokelva, Finnvatnet, sørvest utenom skredterrenget, og nordøstryggen av Litletinden med en liten nedkjøring før det siste støtet. KAST 2 – Utfordrende, med stegjern og øks for hard skare — grad 3.",
    ascent: [
      "Fra lomma på fv. 7548 Myklebostadveien i Breivikbotn — 9 moh; kildens F711 — går servicevegen til hyttefeltet ved Krokelva på 59. Skoggrensa ligger allerede på 57 etter 0,4 km, og beltet fra 0 til 100 måler 9,3 grader: åpent terreng nesten fra bilen.",
      "Opp til Finnvatnet på 282, og sørvest for å unngå skredterrenget slik kilden ber om — 479 moh der linja svinger. Beltet fra 600 til 700 måler 8,3 grader opp mot ryggen.",
      "Nordøstryggen av Litletinden fra 645, ryggen sørover med en liten nedkjøring — og det siste støtet: beltet fra 800 til 900 er det bratteste i snitt med 19,9 grader, og det bratteste enkeltpartiet på linja, 28,2 grader mellom 646 og 665 moh, ligger under de 30 kilden gir ryggens to bratteste parti — linja legger seg slakere enn ryggkammen der. Varden står på 948.",
    ],
    descent: [
      "For det meste 10–20 grader hjem, med to parti over 30 langs Litletind-ryggen, sier kilden — jevn kjøring, fin for ferske på stabile dager. N-målinga fra varden er den slake sida med 5,5 grader i snitt: ryggen er hjemveien.",
      "Østskåla mellom Helligtinden og Litletinden er varianten: 31–35 grader ned mot slakere terreng langs sørsida av Tverrelva. Østflanka måler 28,4 i snitt med 57,2-vindu 100–160 m ut — skåla krever stabil snø, og linja gir uansett tilbake 15 av de 954 meterne på ryggens bølger.",
    ],
    avalanche: [
      {
        title: "Ryggen",
        body: "To parti over 30 grader langs Litletind-ryggen, og stegjern og øks kan trengs på hard skare — KAST 2 – Utfordrende, grad 3 etter utstyrslista. Linja legger seg sørvest etter Finnvatnet nettopp for å gå utenom skredterrenget over vatnet.",
      },
      {
        title: "Østskåla",
        body: "Skåla mellom Helligtinden og Litletinden holder 31–35 grader, og østflanka leser 57,2 i sitt bratteste vindu — varianten er for stabile dager, ikke for skare. Nordryggen er linja som alltid går.",
      },
      {
        title: "Før du går",
        body: "Helligtinden ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,198 L37,195 L64,184 L86,177 L108,168 L129,162 L148,158 L171,154 L187,147 L204,143 L220,140 L241,134 L257,128 L275,123 L295,117 L315,109 L332,105 L354,100 L375,91 L396,83 L418,78 L437,76 L451,72 L472,66 L494,62 L520,61 L542,52 L558,43 L574,32 L592,22 L600,18",
      startLabel: "9 moh",
      endLabel: "948 moh",
      distanceLabel: "5,0 km",
      caption: "954 høydemeter og 5,04 km fra Breivikbotn: Krokelva-hyttene, Finnvatnet på 282, sørvest utenom skredterrenget — og Litletind-ryggen fra 645 til varden på 948.",
    },
  },
  kvasstinden: {
    slug: "kvasstinden",
    intro:
      "933 høydemeter og 4,08 km fra E10 ved Austerstraumen til Kvasstinden — og et navn Lødingen har to av. Den sørøstre Kvasstinden måler 913 moh i terrengmodellen; denne, den nordvestre, klatrer til 831,6 mot Fri Flyts 831. Publisert høyde navngir toppen. KAST 1 – Enkelt, men med alpinøks og stegjern på utstyrslista og en luftig topp: grad 2.",
    ascent: [
      "Fra den store parkeringa øst for Austerstraumen bru — 3 moh — sørover langs myrene med jevn stigning: 146 moh der korridoren står. Boka skriver også «fra parkeringa på Husjordøya», men Husjordøya ligger mellom Vesterstraumen og Austerstraumen, og den kartlagte parkeringa ligger øst for brua. Det er parkeringsteksten som lar seg etterprøve.",
      "Overgangen til Trolldalen går rett nord av høyde 146 — terrengmodellen måler 148,4 — på 144 moh, og så faller linja ned i dalen til 96. 104 av de 933 høydemeterne gir du fra deg der, og det er dem kildens 910 høydemeter har med som differansen mellom sjø og topp ikke har. Skogen slipper på 242 moh etter 2,17 km.",
      "Opp dalen mot sørøst og inn på vestryggen — 554 moh der korridoren er festet. Beltet fra 700 til 800 er det bratteste i snitt med 22,3 grader over 244 meter grunn, mens det bratteste enkeltsteget, 28,5 grader, ligger helt nede mellom 113 og 131 moh. De siste høydemeterne til toppen på 832 går du på ryggen fra vestsida.",
    ],
    descent: [
      "Ned samme veien: noen parti over 30 grader, men det aller meste rundt 20–25, sier kilden. Mye vind- og solpåvirket snø er normalen, og under gode forhold — særlig på ettermiddagen seinvinters, i kveldssol — er dette turen kilden skryter mest av.",
      "Toppen selv er luftig, og kilden ber deg vurdere om skia skal settes igjen eller tas med opp. Flankesveipet viser hvorfor det er et spørsmål: vest, der ryggen kommer, har et vindu på 44,6 grader 90 til 150 meter ute, og sørvest måler 38,7 i snitt. Øst er den slake sida med 15,9.",
    ],
    avalanche: [
      {
        title: "Nordsida",
        body: "Den brattere varianten ned fra toppen er KAST 3 i kildens egen vurdering, med toppheng på 30–40 grader. Den gir flott kjøring under gode forhold, men den er ikke veien du kom, og den er ikke et valg du tar på toppen uten å ha lest snøen på vei opp.",
      },
      {
        title: "Vind, sol og brøyting",
        body: "Mye vind- og solpåvirket snø er normalen på denne ryggen, og sørvestflanken under den måler 38,7 grader i snitt med et 53,8-vindu 60 til 120 meter ute. Parkeringa er heller ikke alltid brøytet tidlig i sesongen — det er verdt å vite før du kjører helt hit.",
      },
      {
        title: "Før du går",
        body: "Kvasstinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som står på kildens liste selv om turen er KAST 1. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,197 L47,193 L72,187 L93,180 L113,173 L137,168 L160,170 L183,171 L206,181 L233,189 L253,183 L266,177 L284,165 L302,157 L319,148 L339,137 L359,129 L378,121 L405,109 L423,100 L445,88 L460,80 L485,73 L504,62 L524,53 L547,45 L564,34 L579,25 L600,18",
      startLabel: "3 moh",
      endLabel: "832 moh",
      distanceLabel: "4,1 km",
      caption: "933 høydemeter og 4,08 km fra Austerstraumen: myrene sørover, ned i Trolldalen nord for høyde 146 — og vestryggen til den luftige toppen på 832.",
    },
  },
  rombakstotta: {
    slug: "rombakstotta",
    intro:
      "Narviks landemerke, og en lang dag i fire tydelige etapper — skog, vann, dalføre og rygg. Turen krever at du er komfortabel med en kort klatring på toppblokka.",
    ascent: [
      "Parkeringen er ved veibommen i Forselvveien over Djupvik. Gå forbi bommen og fram til veien slutter i det gamle steinbruddet på 141 moh, og hundre meter videre i samme retning før du legger deg inn i skogen. De første tre hundre høydemeterne er bratte og tette; følg det gradvis slakere terrenget opp mot venstre til du står ved Pumpvatnet på 325 moh.",
      "Kryss vatnet på isen og forlat det i sørøstre hjørne, der en gammel skogsvei tar deg inn i bekkedalen langs Forsneselva mot Forsnesvatnet. Skogen slipper taket på 494 moh, og resten av dalen går i åpent terreng. Ved dalhodet rundt 650 moh, nord for Forsnesvatnet, svinger du østover inn i den lille dalen mot Isvatnet.",
      "Isvatnet ligger på 820 moh. Rund det på nordsida — der går en sammenhengende benk på fire til tjuefire grader som tar deg østover fra 850 til 950 moh uten å berøre noe bratt. Hold benken hele veien. Skulderen rett øst for vatnet, nede til høyre for deg, er et bergband som måler 53 til 63 grader.",
      "Fra 950 moh fortsetter benken østover til du kommer opp på sørøstryggen rundt 1145 moh. Derfra følger du krona nordvestover til toppen. De siste tretti meterne er ikke skiterreng: et kort, bratt snøfelt og to korte partier med enkel klatring. Isøks er verdt å ha med, og stegjern hvis snøen er hard; tau trenger du ikke.",
    ],
    descent: [
      "Ned igjen samme vei. Kjøringen er delt opp i mange korte bakker heller enn én lang — fra ryggen ned til Isvatnet, over benken, ned den lille dalen og gjennom bekkedalen til Pumpvatnet. Vil du ha noe brattere, starter Rombaksrennene i skaret på 1070 moh rett øst for toppen. De ser brattere ut enn de er, men de er skredterreng, og de faller nordover mot Rombaken — ikke tilbake til Isvatnet.",
      "Vanligste feil: å tro at det går an å kjøre rett av toppen. Det gjør det ikke. Nordsida er Rombaks-S'en, og den måler 52 grader i snitt de første fire hundre meterne, med partier over 70 — videre 41 grader hele veien ned mot Rombaken. Den er så eksponert at et fall kan bli fatalt, og den er en linje for folk som har kjørt den før. Nordøst og øst er nesten like bratt, 48 og 44 grader, og fører ned i Rombaksrennene. Og vest, som ser ut som en snarvei tilbake til benken, går inn i et bergband på over 60 grader mellom 1060 og 1090 moh. Hold krona sørøstover til du er nede på 1145 moh og ser Isvatnet.",
      "Under skoggrensa på 494 moh blir det tett igjen. Følg oppsporet ned til veienden — skogen her er bratt og uoversiktlig, og det går fortere i eget spor enn å lete etter en bedre linje.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja som er tegnet holder seg under 30 grader hele veien. Bratteste hundremeteren ligger mellom 500 og 600 moh med 16,1 grader i snitt, og bratteste enkeltsteg måler 27,1 grader. Benken nord for Isvatnet ligger på fire til tjuefire grader. Toppblokka er unntaket — den er klatring, ikke skiterreng.",
      },
      {
        title: "Terrenget rundt",
        body: "Toppen står bratt av på alle kanter unntatt sørøstryggen du kom opp. Målt fire hundre meter ut fra toppunktet: nord 52 grader i snitt, nordvest 48, nordøst 48, øst 44 — mot 13 på sørøstryggen. Nordsida er Rombaks-S'en, og i skaret på 1070 moh øst for toppen starter Rombaksrennene. Vestsida har et bergband på over 60 grader mellom 1060 og 1090 moh, og bergbandet rett øst for Isvatnet måler 53 til 63. Alt dette ligger utenfor ruta, og alt er lett å drive inn i når sikten går.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Ofoten på varsom.no. Ta med sender/mottaker, søkestang og spade — og isøks til toppblokka, stegjern hvis snøen er hard.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L17,193 L41,182 L64,172 L83,171 L106,169 L134,168 L157,165 L186,160 L203,152 L226,146 L245,136 L268,125 L291,118 L314,113 L337,109 L360,97 L380,88 L400,82 L421,83 L439,74 L458,65 L476,58 L499,55 L527,44 L539,37 L555,31 L576,27 L600,18",
      startLabel: "141 moh",
      endLabel: "1231 moh",
      distanceLabel: "5,8 km",
      caption: "5,83 km og 1129 høydemeter fra steinbruddet i Forselvveien; bratteste hundremeteren ligger mellom 500 og 600 moh.",
    },
  },
  beisfjordtotta: {
    slug: "beisfjordtotta",
    intro:
      "1428 høydemeter og 7,19 km fra bommen over Djupvik til fjellet Fri Flyt kaller et fjell med mange hemmeligheter. Normalruta over skaret er den tålmodige veien inn i dem: bratteste hundremetersbelte 22,7 grader, og det bratteste sammenhengende partiet — 38,4 grader mellom 1414 og 1445 moh — er selve toppblokka. KAST 2 – Utfordrende hos kilden; alternativene (Isvannsrenna, Isbreen på ~45 grader) er en annen liga, og de er ikke linja her. Både Forsnesvatnet og Isvatnet er regulerte, og linja holder land hele veien.",
    ascent: [
      "Fra veibommen på Forselvveien over Djupvik — 60 moh, parkering ved bommen slik kilden sier — går du veien til veienden på 141 og opp den bratte skogen til vannverksveien. Skogen slutter på 502 moh etter 2,94 km. De fire første vegpunktene deler geometri med Rombakstøttas reviderte linje: dette er audited grunn.",
      "Forbi Pumpvatnet på nordsida — vannet er naturlig tross navnet, 325 moh, og linja runder det på land etter tre omrutinger som står i forskningsposten — og opp bekkedalen mot Forsnesvatnet: 18,1 grader i beltet fra 500 til 600. Fri Flyts rute krysser Forsnesvatn på isen; vannet er regulert, så linja her tar østsida på land — beltene fra 800 til 1100 måler 18,4, 20,8 og 22,7 grader, turens jevnt bratteste strekk.",
      "Fra flaten på 1200-nivået — beltet måler 4,2 grader over 1,3 kilometer — går det opp mot skaret mellom Moskočohkka og Tøtta, 1257 moh der linja tar det, og ryggen sørover til toppblokka: 38,4 grader mellom 1414 og 1445, de meterne som avgjør dagen. Varden på 1448; registeret løser 1447,8.",
    ],
    descent: [
      "Ned samme vei — ryggen fra nordvest er den slake sektoren på toppen, 12,7 grader i snitt over 500 meter. Toppblokka tas i samme spor som opp, og flaten under skaret gir pusterom før de lange beltene ned mot Forsnesvatnet.",
      "Sørøst-, sør- og østsiden faller 34,6 til 44,8 grader i snitt med 72 til 76 grader i de første 60-metersvinduene fra varden — kanten mot Beisfjorden er vegg. Isvannsrenna mot Straumsnes og Isbreen-nedfarten (~45 grader, med bre og kløfter) er kildens alternativer for stabile dager med følge som kan terrenget.",
      "Kilden gir et annet startpunkt enn Djupvik: «man kan også starte turen fra Narvik og følge den populære turstien som leder inn i Tøttdalen fra minikraftverket nordøst for skiheisene. Stien fører fram til Pumpvatn. Herfra kan du følge turbeskrivelsen videre mot Beisfjordtøtta.» Den stien er kartlagt hele veien. Fra parkeringa ved Taraldsvikfossen på 205 moh går linja inn i Tøttadalen på 252 og 264, videre inn dalen på 306, og når Pumpvatnet på 331 — 4,85 km med skog, mot 300 meter opp den bratte lia fra Djupvik. Derfra er det samme rute: rundt vannet på land på 325 og 329, bekkedalen på 449, Forsnesvatnet på 655 og 858, opp mot skaret på 1135 og 1257, og ryggen sørover over 1317 og 1418 til varden. 1353 høydemeter på 9,07 km mot 1428 på 7,19 km fra bommen: 145 meter høyere start, nesten to kilometer lengre, og et mye mildere fjell underveis — bratteste hundremetersbelte 21,2 grader fra 1000 til 1100 moh, bratteste 30-metersvindu 27,0 grader mellom 884 og 904 mot 38,4 på normalruta. Toget eller taxien tilbake er ikke nødvendig herfra; bilen står i byen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt. Normalruta er den tålmodige linja på et fjell der alternativene har renner, is og bre — 22,7 grader i bratteste belte, og toppblokkas 38,4-graderssteg som eneste alvor. Skredfaren i rennene og ispartiene hører til variantene; les dem som grenser, ikke muligheter.",
      },
      {
        title: "De regulerte vannene",
        body: "Forsnesvatnet og Isvatnet er begge regulerte. Fri Flyts rute krysser Forsnesvatn på isen — linja her går østsida på land, og det koster noen minutter og null risiko. Regulert is får sprekker langs land når magasinet tappes; det er ikke is å lære seg å kjenne.",
      },
      {
        title: "Kanten mot Beisfjorden",
        body: "Fra varden faller sørøst 76 grader i det første 60-metersvinduet. I flatt lys er kanten og flaten like hvite — retningen ned er nordvest, tilbake mot skaret, og den er verdt å ha i kompasset før toppen.",
      },
      {
        title: "Før du går",
        body: "Beisfjordtøtta ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–juni er Fri Flyts. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,193 L44,188 L63,179 L87,169 L107,167 L132,165 L159,164 L183,161 L207,153 L233,146 L254,138 L278,125 L297,121 L323,111 L345,100 L365,89 L386,76 L403,65 L425,54 L451,48 L474,46 L500,46 L527,41 L553,34 L579,22 L600,18",
      startLabel: "60 moh",
      endLabel: "1448 moh",
      distanceLabel: "7,2 km",
      caption: "1428 høydemeter og 7,19 km fra bommen over Djupvik om Pumpvatnet og østsida av Forsnesvatnet, med skoggrensa på 502 moh og det bratteste — 38,4 grader mellom 1414 og 1445 moh — i toppblokka.",
    },
  },
  pilan: {
    slug: "pilan",
    intro:
      "844 høydemeter og 4,09 km fra Laupstad på den stille nordsida av Austvågøya, med utsikten inn i Vesterålen fra varden. Fri Flyt gir KAST 1 – Enkelt med bratteste punkt under 30 grader, og det meste av linja holder det — bratteste hundremetersbelte 21,9 grader. Men toppkjegla måler 35,3 grader i det bratteste 30-metersvinduet, mellom 763 og 786 moh, og målingen er sjekken for graden: kortet bærer 3, ikke kildens tall. Ryggen gir tilbake 23 høydemeter, og turen går fra fjorden.",
    ascent: [
      "Fra Laupstad ved fylkesvegen — 5 moh, forbi bebyggelsen og opp dalen mot vest. Skogen slutter på 233 moh etter 1,66 km, og dalen tar deg til vannet på 289: beltet fra 100 til 200 moh måler 14,4 grader, og fra 200 til 300 bare 8,8.",
      "Fra vannet fortsetter du mot høyre mot Morfjordskaret — registerets Morfjordskaret ligger i Hadsel, for her går kommunegrensa over fjellet — til den brede flanken som går opp mot Pilan. Beltet fra 400 til 500 måler 18,9 grader, så flater det av: 9,6 og 7,5 over de neste to hundre.",
      "Toppkjegla er turens alvor: beltet fra 700 til 800 moh måler 21,8 grader over 275 meter grunn, og det bratteste sammenhengende partiet — 35,3 grader mellom 763 og 786 — sitter her. Sonderingene rundt kjegla sier at steget er terreng og ikke ruting: sør og sørvest måler 22,7 og 20,9 grader i snitt, nord og vest 42,3 og 46,5. Varden på 826; registeret leser 826,0 mot publiserte 828 — endå et smalt topparti der laserskannet leser et par meter lavt. Sautinden er tvillingtoppen samme tur kan kombinere.",
    ],
    descent: [
      "Ned samme vei — den brede flanken mot sør-øst er store, oversiktlige linjer, og fra flata under kjegla er det slak kjøring tilbake til vannet og dalen. Steget i kjegla tas der du gikk opp, mens snøen ennå er der du leste den.",
      "Hold flanken: nordsida mot Morfjorddalen er kildens eget farepunkt, og den måler 42,3 grader i snitt med 57,7 som bratteste vindu. Vest er samme historie — 46,5 i snitt. Det brede og snille terrenget har kanter, og de er alle på den andre sida.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 1 – Enkelt hos Fri Flyt, bratteste punkt under 30 grader — og det stemmer for det meste av linja, men ikke for toppkjegla: 35,3 grader i det bratteste 30-metersvinduet mellom 763 og 786 moh. Kortet bærer grad 3 på den målingen. Under 700 er dette en av de snilleste linjene i rundelen.",
      },
      {
        title: "Kjegla",
        body: "Steget sitter rett under toppen, der snøen enten er innblåst eller avblåst. Med innblåst snø er det et lite, bratt heng med utløp mot flata; avblåst er det et par harde takter. Begge deler leses på ti sekunder fra flata under — gjør det før du står i det.",
      },
      {
        title: "Mot Morfjorddalen",
        body: "Brattere terreng ned mot Morfjorddalen, sier kilden, og målingen gir 42,3 grader i snitt mot nord. Fra varden i flatt lys er flanken du kom opp og nordsida lette å forveksle de første metrene — retningen ned er sør-øst, og det er verdt å ha kompasskursen klar før skodda tar utsikten.",
      },
      {
        title: "Før du går",
        body: "Pilan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; feb–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,199 L59,196 L92,193 L118,183 L138,172 L151,165 L175,159 L198,155 L218,151 L250,146 L270,138 L284,130 L309,118 L323,113 L345,102 L369,90 L395,83 L415,84 L435,80 L451,69 L468,60 L491,58 L517,55 L537,54 L557,45 L576,36 L590,27 L600,18",
      startLabel: "5 moh",
      endLabel: "826 moh",
      distanceLabel: "4,1 km",
      caption: "844 høydemeter og 4,09 km fra Laupstad om vannet på 289 og Morfjordskaret, med skoggrensa på 233 moh og det bratteste — 35,3 grader mellom 763 og 786 moh — i toppkjegla.",
    },
  },
  litletind: {
    slug: "litletind",
    intro:
      "916 høydemeter og 5,21 km fra Nervatnet til fortoppen med byutsikten — Litletind er forfjellet til Sovende dronning og en av Narviks mest populære lokalturer, med Narvik og Rombaksfjorden under varden. Fri Flyt gir KAST 2 – Utfordrende; linja måler 19,9 grader i bratteste hundremetersbelte og 32,8 i bratteste sammenhengende parti, oppe i toppartiet. Registeret skriver Litletinden, og toppsøket løser 1099,6 mot kildens 1096.",
    ascent: [
      "Samme start som dronninga: parkeringa etter brua ved Nervatnet, 223 moh. Nervatnet er regulert — linja holder stien langs vannkanten på land, over myra sør for vannet og opp gjennom den glisne skogen. Skogen slutter på 532 moh etter 2,93 km, og de to første stigningsbeltene måler 14,9 og 16,4 grader.",
      "Like etter tregrensa dreier du til høyre (nordvest) opp ryggen som leder til Litletind. Beltene fra 700 til 1000 måler 19,5, 17,9 og 19,9 grader — jevn skinning på åpen rygg med utsikten voksende bak deg.",
      "Toppartiet er kildens ene forbehold: ryggen mot toppen er ofte avblåst og steinete, så den siste biten kan være kronglete. Det bratteste sammenhengende partiet måler 32,8 grader mellom 1045 og 1066 moh, og på hardpakke er det de meterne du merker. Varden på 1100 med Narvik, Rombaksfjorden og dronningprofilen bak deg.",
    ],
    descent: [
      "Ned samme vei — sør- og sørvestsektoren linja bruker er den slakeste på toppen, 16,8 og 20,6 grader i snitt over 500 meter. Fri Flyts nedfart er oppstykkede fonner i lett varierende terreng.",
      "Hold igjen mot øst og nordøst: 37,4 og 36,9 grader i snitt med vinduer på 57,7 og 49,0 rett under toppen — kanten mot Håkvikdalen. Sløret, den bratte fonna mellom Litletind og Dronninga, er skredterreng med stein i bunnen og hører til variantene, ikke normalturen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt. Linja selv er snill — 19,9 grader i bratteste belte, 32,8 i bratteste parti — og det som krever hodet er kantene: øst- og nordøstsiden faller 37 grader i snitt med vinduer over 49 rett under varden.",
      },
      {
        title: "Toppartiet",
        body: "Ofte avblåst og steinete — skliproblem, ikke skredproblem. På hard vestavindsskare kan de siste 60 meterne være stedet skiene står igjen.",
      },
      {
        title: "Reindrifta og vannet",
        body: "Området brukes i reindriftsnæringen — hold avstand og band på hunden. Og Nervatnet er regulert: stien langs land begge veier, uansett hvor fin isen ser ut.",
      },
      {
        title: "Før du går",
        body: "Litletind ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L26,200 L47,199 L72,198 L93,197 L119,199 L140,200 L166,199 L192,195 L223,188 L249,179 L275,168 L301,153 L319,144 L342,132 L368,124 L394,119 L410,111 L432,108 L455,100 L467,94 L486,80 L500,72 L519,61 L534,51 L554,39 L570,25 L586,18 L600,18",
      startLabel: "223 moh",
      endLabel: "1100 moh",
      distanceLabel: "5,2 km",
      caption: "916 høydemeter og 5,21 km fra Nervatnet opp ryggen fra tregrensa, med skoggrensa på 532 moh og det bratteste — 32,8 grader mellom 1045 og 1066 moh — i det avblåste toppartiet.",
    },
  },
  geitgaljen: {
    slug: "geitgaljen",
    intro:
      "1071 høydemeter fra fjorden på 3,80 km, og hele linja ligger i skredterreng. Topptursentralen setter turen til KAST 4 — ekstremt, og de øverste 157 høydemetrene er 42 grader i snitt og krever stegjern og isøks.",
    ascent: [
      "Start ved vegenden i Geitgallien ved Skinvollen innerst i Austnesfjorden, 20 moh. Følg lysløypa et stykke og videre inn i Lilandsdalen gjennom bjørkeskogen. De første åtte hundre meterne stiger knapt — 6 grader i snitt — og det er den eneste flate delen av turen.",
      "Fra rundt 250 moh bratner dalen til ei renne som holder 35 grader opp til 360 moh; den kartlagte stien måler 34,8 grader mellom 290 og 350 moh. Over renna slakner det igjen, og du følger dalen oppover i 17 til 20 grader til rundt 620 moh, der elveleiet bratter til. Dalbunnen under renna er terrengfelle: går det noe over deg her, er det ingen veg til sida.",
      "Der elveleiet bratter til går en tydelig rampe opp mot høyre inn i den store skålformasjonen på rundt 845 moh — toppen av sørrenna. Dette er et klassisk utløpsområde, og stoppestedet velges her, ikke midt i skåla. Videre mot skaret og opp til 928 moh, der det bratter til for godt: bratteste sammenhengende parti på skisporet måler 34,8 grader. Over 1000 moh er tallene for skisporet ikke lenger tall for terrenget: fallinja der måler 33 til 50 grader.",
      "De siste 157 høydemeterne til toppen på 1085 moh ligger på 42 grader i snitt, men snittet skjuler toppblokka: de øverste seksti høydemetrene måler 40 til 50 grader. Det er klyving med stegjern og isøks, ikke skikjøring. Rett sør for varden faller terrenget nær 70 grader.",
    ],
    descent: [
      "Har du én bil, kjører du ned samme vei: fra toppen ned til 928 moh til fots, så skåla, rampa ned til dalen på 620 moh, renna fra 360 til 250 moh og ut Lilandsdalen. Renna er den delen som må vurderes på nytt på vei ned — den har vært over deg hele veien opp, og i sola kan den ha endret seg mens du var på toppen.",
      "Vanligste feil: å ta sørrenna uten å ha ordnet transport. Den er den dokumenterte nedkjøringa, rundt seks hundre høydemeter på 35 til 40 grader, men den kommer ut i en annen dal og krever bil nummer to. Den andre feilen er å regne toppen som mål uansett forhold: er ryggen isete, er de siste 174 metrene en klyvetur på 42 grader med ski på sekken, og snuvedtaket tas på 928 moh.",
      "Området går store skred flere ganger hver vinter. Det er ikke en tur du tar på et middels varsel fordi du har reist langt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Hele ruta ligger i skredterreng. Renna på 250 til 360 moh er 35 grader med dalbunnen som terrengfelle under, skålformasjonen over sørrenna er et klassisk utløpsområde, og de øverste 157 høydemetrene ligger på 42 grader i snitt, de siste seksti på 40 til 50. På selve linja måler bratteste sammenhengende parti 34,8 grader, men de tallene gjelder skisporet opp dalen. Over 1000 moh måler fallinja 33 til 50 grader, og gjennomsnitt er uansett feil verktøy her: det finnes ikke noe sted på ruta der du ikke har noe over deg.",
      },
      {
        title: "Terrenget utenfor",
        body: "Rett sør for toppen faller terrenget nær 70 grader — 65 til 72 målt i tjuemeterssteg de første hundre høydemetrene. Sørrenna, som brukes som nedkjøring, holder 35 til 40 grader over rundt seks hundre høydemeter og ender i en annen dal enn den du kom opp. Topptursentralen graderer linja KAST 4 — ekstremt, og fører opp snøskred, utløpssone og terrengfelle som farer. Området går store skred flere ganger hver vinter.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,196 L51,194 L79,192 L108,190 L136,184 L157,178 L184,170 L203,163 L221,154 L238,147 L257,140 L279,130 L296,123 L316,118 L335,108 L361,101 L379,94 L399,88 L425,79 L449,73 L463,68 L477,64 L505,55 L528,51 L548,41 L567,32 L582,25 L598,18 L600,18",
      startLabel: "20 moh",
      endLabel: "1085 moh",
      distanceLabel: "3,8 km",
      caption: "1071 høydemeter og 3,82 km fra Liland; renna på 250–360 moh er 35 grader, og de øverste 174 metrene 42.",
    },
  },
  skjomtinden: {
    slug: "skjomtinden",
    intro:
      "1386 høydemeter og 7,17 km fra Nervatnet i Håkvikdalen til Den sovende dronning — profilen alle i Narvik kjenner fra Bjerkvik-siden, og en av områdets fineste turer. Fri Flyt gir KAST 2 – Utfordrende, men utstyrslista sier isøks og stegjern, vestsidene er tidvis bare og steinete, og linja gir tilbake 33 høydemeter på traversen — kortet bærer grad 4. Bratteste hundremetersbelte måler 20,3 grader; det bratteste sammenhengende partiet, 33,7 grader, sitter i renna mellom 1439 og 1462 moh.",
    ascent: [
      "Fra parkeringa etter brua ved Nervatnet — 223 moh, E6 sørover fra Narvik og inn Håkvikdalen; lokalbussen til brua er kildens eget alternativ. Nervatnet er regulert, så linja holder stien langs vannkanten på land — kilden tilbyr isen «om den er stabil», og det tilbudet takker dette produktet alltid nei til. Over myra sør for vannet og opp gjennom den glisne skogen: skogen slutter på 546 moh etter 2,96 km.",
      "Like etter tregrensa dreier du til høyre opp ryggen mot Litletind, følger forsenkningen rundt den og traverserer på skrå opp til ryggen mellom Litletind og Dronninga — 945 moh der linja tar den. Beltene er tålmodige: 12–13 grader fra 600 til 900, så turens bratteste hundremeter, 20,3 grader fra 1000 til 1100.",
      "Fra rundt 1200 traverseres det inn på vestsidene. Her er terrenget tidvis bart og steinete — regn med å gå til fots i partier, og det er her isøksa og stegjerna i sekken slutter å være pynt. Snørenna leder opp til ryggen nordvest for hovedtoppen: det bratteste sammenhengende partiet måler 33,7 grader mellom 1439 og 1462 moh, og beltet fra 1400 er ellers slakt fordi traversen skrår. Varden på 1576 — registeret løser 1575,8 mot publiserte 1575 — med Ofoten, Frostisen og havet rundt deg.",
    ],
    descent: [
      "Ned samme vei: renna, traversen, ryggen. Ryggen nordvest for toppen er den eneste slake sektoren på fjellet — 13,2 grader i snitt over 500 meter — og alt annet faller 23 til 45 grader i snitt med vinduer på 43 til 68. Traversen tas i samme spor som opp, mens du fortsatt vet hvor steinene var.",
      "«Øyet» er kildens alternative nedfart: en trang snørenne på 45–50 grader med is og eksponerte klipper, der rutevalget er kritisk. Den står her fordi den finnes — ikke fordi den anbefales fra dette kortet.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, men graden på kortet er 4: bare, steinete vestsider med gange til fots, isøks og stegjern i utstyrslista, 33 høydemeter gitt tilbake på traversen, og en snørenne på 33,7 grader som siste nøkkel. Dette er Slogen-klassen — en fjelltur på ski, ikke en skitur med topp.",
      },
      {
        title: "Renna og vestsidene",
        body: "Renna mellom 1439 og 1462 moh er bratt nok til å skride, og vestsidene samler snøen etter østavind. Bart berg og is veksler med fonner — vurder hver overgang, og snu der føret sier snu; dronninga ligger der neste helg også.",
      },
      {
        title: "Nervatnet",
        body: "Vannet er regulert, og regulert is er upålitelig is: linja holder stien langs land, og det bør sporet ditt også — begge veier, også når isen «ser fin ut» i mars.",
      },
      {
        title: "Før du går",
        body: "Skjomtinden ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts. Sender/mottaker, søkestang, spade — og isøks og stegjern, som kilden selv krever.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L24,200 L46,199 L72,199 L98,200 L129,198 L155,195 L189,185 L212,174 L230,165 L257,153 L282,148 L306,140 L332,132 L358,120 L384,115 L404,105 L426,98 L445,88 L460,80 L479,71 L498,61 L516,51 L534,44 L551,39 L574,29 L590,21 L600,18",
      startLabel: "223 moh",
      endLabel: "1576 moh",
      distanceLabel: "7,2 km",
      caption: "1386 høydemeter og 7,17 km fra Nervatnet om ryggen mellom Litletind og Dronninga og traversen på vestsidene, med skoggrensa på 546 moh og det bratteste — 33,7 grader mellom 1439 og 1462 moh — i renna.",
    },
  },
  torskmannen: {
    slug: "torskmannen",
    intro:
      "754 høydemeter og 3,00 km fra Kvitfossen kraftstasjon i Vestpollen — en lokal favoritt der snøen ofte ligger skjermet i dalen når det er vindherjet andre steder. Fri Flyt gir KAST 2 – Utfordrende med bratteste punkt 35 grader; linja opp dalen og ut i skaret til høyre for toppen måler 21,6 grader i bratteste hundremetersbelte og 28,1 i bratteste sammenhengende parti, som er de siste metrene mot varden. Toppen er ofte avblåst og hard.",
    ascent: [
      "Fra kraftstasjonen ved E10 — OSM har Kvitfossen kraftverk kartlagt på Midnattsolveien, med busstopp ved veien, og fjorden leser 5 moh. Du sikter mot toppen i retning nordvest og går inn marka mot dalbunnen: beltet fra 0 til 100 moh måler 5,5 grader over den første kilometeren, og skogen slutter på 262 moh etter 1,54 km.",
      "Så tidlig som mulig inn i dalen og opp langs venstresida mot vannet i forsenkinga — prøvepunktet ved linja leser 352,9 moh der kildens «lite vann» ligger. Beltene er jevne: 19,6 grader fra 100 til 200, 20,4 fra 300 til 400, 19,4 fra 400 til 500 — dalen er en trapp, og den er grunnen til at snøen ligger her.",
      "Fra vannet krysser du mot skaret til høyre for toppen — 568 moh der linja tar det — og følger ryggen den siste biten. Beltet fra 700 til 800 er turens bratteste, 21,6 grader, med det bratteste sammenhengende partiet på 28,1 mellom 721 og 745 moh. Varden på 755; registeret har to Torskmannen i Vågan, og denne — toppsøket løser 755,2 — er den kilden beskriver; navnebroren lenger sørvest leser 717,6.",
    ],
    descent: [
      "Normalen er dalen tilbake — sporene fra turen opp, sier kilden. Nedfartsaspektet er sørøst: flanken måler 30,8 grader i snitt med 49,2 som bratteste vindu 40 til 100 meter ut, så de første svingene fra ryggen tas med høyde for hvor du slipper deg ut.",
      "Sørvest- og vestsida er en annen verden: 40,7 og 40,0 grader i snitt med vinduer på 67,4 og 62,7 rett under toppen. Nedfartsalternativene fra ryggen ligger i skredterreng, sier kilden — de er der for dager som tåler dem.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, bratteste punkt 35 grader — og linja måler 28,1 der den er brattest, fordi den tar skaret og ryggen i stedet for flanken direkte. Dalen er skjermet for vind, og det betyr også at den samler snøen vinden flytter: les innlastingen i hengene over deg på veien opp.",
      },
      {
        title: "Toppen",
        body: "De siste metrene mot varden er ofte avblåste og harde — glatt berg og hardpakke, ikke skredproblem men skliproblem. Nordøstsektoren linja kommer fra er den slake (12,7 grader i snitt); alt vest og sør for varden faller 40 grader eller mer i snitt.",
      },
      {
        title: "Nedfartsalternativene",
        body: "Fra ryggen finnes brattere varianter rett ned — kilden kaller det skredterreng, og sørøstflanken under toppen har et vindu på 49,2 grader. Normalturen har ikke noe der å gjøre; variantene hører til stabilitet du har målt, ikke håpet på.",
      },
      {
        title: "Før du går",
        body: "Torskmannen ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,199 L53,198 L89,195 L125,193 L158,184 L179,182 L206,176 L224,168 L241,159 L260,153 L287,144 L305,139 L323,132 L341,123 L359,117 L380,106 L404,94 L422,88 L446,77 L467,68 L485,65 L509,56 L530,49 L552,39 L566,34 L593,20 L600,18",
      startLabel: "5 moh",
      endLabel: "755 moh",
      distanceLabel: "3,0 km",
      caption: "754 høydemeter og 3,00 km fra Kvitfossen opp dalen og skaret til høyre for toppen, med skoggrensa på 262 moh og det bratteste — 28,1 grader mellom 721 og 745 moh — på ryggen mot varden.",
    },
  },
  rundfjellet: {
    slug: "rundfjellet",
    intro:
      "840 høydemeter og 4,78 km fra havet ved Vatterfjordpollen til Svolværs nærmeste klassiker — en enkel topp med mange varianter ifølge utemagasinet, der linja langs ryggen er poenget: hold deg på toppen av den, sier Fri Flyt, for området rundt er skredutsatt, og målingen er enig — sørsektoren ryggen bruker måler 13,7 grader i snitt der alle de andre kantene av toppen har vinduer på 40 til 65. Ryggen gir tilbake 44 høydemeter på veien, og det er derfor kortet bærer 840 der kilden regner 800.",
    ascent: [
      "Fra parkeringsplassen ved Vatterfjordpollen på E10, ti kilometer fra Svolvær mot Fiskebøl. Linja på kartet begynner på vestsida av den lille brua over strømmen — terrengmodellen fører sundet som sjø, og brua finnes ikke i den, så spaserturen over brua fra parkeringa står her i stedet for i geometrien. Så langs høyresida av pollen og innover marka mot fjellfoten: beltet fra 0 til 100 moh måler 3,1 grader over nesten to kilometer, og skogen slutter allerede på 94 moh etter 1,88 km.",
      "Fra fjellfoten opp på sørryggen — beltet fra 100 til 200 moh er turens bratteste, 18,4 grader over 271 meter grunn — og så nordover langs ryggen til den dreier vest. Ryggen er kupert: 44 høydemeter gis tilbake underveis, og beltene ligger på 10 til 15,2 grader — jevn, lesbar skinning med Austnesfjorden på den ene sida og Higravstindan i synsranda.",
      "Der ryggen dreier vest — 641 moh der linja tar svingen — venter det siste: 15,1 grader i beltet fra 700 til 800, med det bratteste sammenhengende partiet, 29,1 grader, mellom 644 og 663 moh. Varden på 803; registeret og toppsøket løser 802,6.",
    ],
    descent: [
      "Normalen er ryggen tilbake — sørsektoren måler 13,7 grader i snitt over 500 meter, og de mange variantene er grunnen til at turen tåler å gås igjen. Hold igjen der ryggen slutter: nedkjøringen mot Vatterfjordpollen kan være skredutsatt, brattest om du tar tidlig av ryggen mot venstre på sørsida, sier kilden.",
      "Fra Kudalen på nordsida ligger det ofte hard is mot slutten — kilden ber deg ta med stegjern og isøks om du skal den veien. Nordvestsida har et 60-metersvindu på 64,8 grader; det er ikke en side man improviserer på.",
      "Kildens startsted-linje navngir Kudalsheia først og setter Vatterfjordpollen — ruta over — som «alternativ startsted». Fra avkjørselen mot Kudalsheia er det 797 høydemeter og 3,29 km: opp på heia, 406 moh, langs ryggen til den forsvinner inn i fjellet, opp dalen og gjennom skaret på 716 til siste ryggen mot toppen. Det er halvannen kilometer kortere enn ruta fra Vatterfjordpollen, og bratteste steget måler 28,1 grader mellom 664 og 680 moh mot 29,1 på hovedruta. Faremomentet kilden nevner for denne sida er føret: «Fra Kudalen på nordsiden er det ofte steinhard skare siste kneika, ta med stegjern og isøks.»",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ingen KAST hos Fri Flyt (eldre sideformat), men regelen hans er presis: hold deg på toppen av ryggen, for området rundt er skredutsatt. Målingen sier det samme — sørsektoren 13,7 grader i snitt, alle andre kanter med vinduer på 40 til 65.",
      },
      {
        title: "Nedkjøringen mot pollen",
        body: "Kildens eget farepunkt: brattest der man tar tidlig av ryggen mot venstre på sørsida. Sørsidas bratteste vindu ligger 350 til 410 meter ut fra toppen og måler 38,2 grader — det er dit den fristende snarveien fører. Ryggen hele veien ned koster ti minutter og ingenting annet.",
      },
      {
        title: "Isen fra Kudalen",
        body: "Nordsida bærer ofte hard is mot slutten — stegjern og isøks om du skal den veien, sier kilden. Det er variantterreng, ikke normalveien, og det står her fordi den som leser dette i Svolvær kommer til å høre om den.",
      },
      {
        title: "Før du går",
        body: "Rundfjellet ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L21,200 L50,199 L74,199 L102,199 L123,199 L151,198 L174,198 L197,198 L220,188 L242,175 L265,161 L285,153 L310,147 L333,136 L355,125 L378,118 L402,111 L417,102 L440,93 L469,80 L491,71 L511,60 L524,56 L541,46 L559,37 L586,25 L600,18",
      startLabel: "6 moh",
      endLabel: "803 moh",
      distanceLabel: "4,8 km",
      caption: "840 høydemeter og 4,78 km fra Vatterfjordpollen opp sørryggen og ryggtoppen hele veien, med skoggrensa på 94 moh og det bratteste — 29,1 grader mellom 644 og 663 moh — der ryggen dreier vest.",
    },
  },
  kleppstadheia: {
    slug: "kleppstadheia",
    intro:
      "525 høydemeter og 2,19 km fra Kleppstadveien sør for Gimsøybrua — turen Fri Flyt selv bruker som øving i sporvalg: «Bruk av terrenget for å legge fornuftig og godt spor.» Den slake, breie flata mot toppen holder det den lover — 20,9 grader i bratteste hundremetersbelte — og det bratteste sammenhengende partiet, 32,9 grader mellom 111 og 136 moh, ligger nede i skogbrattet. Fra varden ser du Gimsøya, Vestfjorden og Himmeltindan i vest.",
    ascent: [
      "Fra parkeringa langs Kleppstadveien på sørsida før Gimsøybrua — 16 moh, med registerets Kleppstad et par hundre meter unna. Du legger sporet opp langs ryggen mot punkt 156: her sitter turens bratteste parti, 32,9 grader mellom 111 og 136 moh, i skogen — beltet fra 100 til 200 måler 20,2 grader, og skogen slutter på 232 moh etter 1,17 km.",
      "Over skogen er det flata som eier turen: 20,9 grader fra 200 til 300 moh, 19,1 fra 300 til 400, og så slaker det av mot toppen — 7,9 grader i det siste beltet. Brei rygg, valgfritt spor, og terrenget som læremester: hver kul og hvert søkk er en beslutning om hvor sporet skal ligge.",
      "Varden på 534 — Fri Flyts publiserte GPS-punkt er registerets Kleppstadheia på meteren, og toppsøket løser 533,9. Prominensen er beskjeden, utsikten er det ikke.",
    ],
    descent: [
      "Ned samme vei, med sporvalget i revers: flata tåler alt, og skogbrattet nederst er den ene plassen svingene skal sitte. Sørvest er nedfartsaspektet, og sektoren måler 12,8 grader i snitt.",
      "Kildens farepunkt er partiene med bratt terreng langs sørsida av ryggen lenger nede — og ved toppen er det nord-, nordøst- og østsida som er kantene: 34,6 til 37,9 grader i snitt med vinduer på 45 til 56. Normalsporet på ryggen og flata er unna alt sammen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Enkel hos Fri Flyt, bratteste punkt under 30 grader på flata — linjas 32,9-graderssteg ligger i skogen nederst, kort og lesbart. Dette er turen for dager da varselet fraråder bratt terreng, og øvingsturen for alle andre dager.",
      },
      {
        title: "Kantene",
        body: "Kilden peker på bratte parti langs sørsida av ryggen; målingen ved toppen legger til at nord-, nordøst- og østsida faller 34,6 til 37,9 grader i snitt med vinduer opp mot 56. Flata er romslig — bruk rommet, og hold kantene på armlengdes avstand i flatt lys.",
      },
      {
        title: "Før du går",
        body: "Kleppstadheia ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade — også på øvingsturen.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L25,197 L38,194 L62,191 L75,190 L90,188 L112,185 L136,178 L149,176 L173,172 L185,172 L198,172 L223,169 L235,166 L245,157 L260,150 L272,144 L284,138 L297,134 L308,129 L321,123 L334,118 L350,108 L358,104 L383,92 L395,88 L407,82 L420,78 L444,66 L469,55 L494,45 L518,35 L543,28 L565,23 L580,20 L595,19 L600,18",
      startLabel: "16 moh",
      endLabel: "534 moh",
      distanceLabel: "2,2 km",
      caption: "525 høydemeter og 2,19 km fra Kleppstadveien opp ryggen mot punkt 156 og den breie flata, med skoggrensa på 232 moh og det bratteste — 32,9 grader mellom 111 og 136 moh — nede i skogen.",
    },
  },
  "varden-smaatindan": {
    slug: "varden-smaatindan",
    intro:
      "763 høydemeter og 4,82 km fra Eidet ved Kabelvåg til toppen Fri Flyt kaller den mest populære toppturen på øygruppa. Kortet bærer begge navnene fjellet har i registeret — Varden og Småtindan — og tallene er ærlige om hva turen er: bratteste hundremetersbeltet måler 22,8 grader mellom 600 og 700 moh, det bratteste sammenhengende partiet 38,3, og linja gir tilbake 65 høydemeter underveis, det meste av det i skaret rundt Ørntinden og på eidet mellom to vann som ikke kan forutsettes frosne.",
    ascent: [
      "Fra E10 vest for Kabelvåg tar du over brua med skilt mot Eidet; den kartlagte Karlsvågen-parkeringa ligger om lag 400 meter fra hovedveien, på 2 moh. Lysløypa — Damveien — begynner 120 m nordøst og går nordover dalen langs østsida av Karlsvatnet.",
      "Vannene avgjør den første kilometeren, og de fortjener hver sin setning: Karlsvatnet ligger på 12 moh en snau kilometer fra havet, og Stor-Kongsvatnet innenfor er regulert — begge er målt, og linja står ikke på noen av dem. Den forlater løypa før vatnet og krysser det tørre eidet mellom de to på 29 moh, over myra vest for det på 24, og bort til foten av Aksla på 20 moh. 0 meter på vann, målt mot Kartverkets klasser og OSM-polygonene.",
      "Aksla er ryggen opp: fra foten på 20 moh til 141, videre til rett under Ørntinden på 342 — skogen slutter allerede på 219 moh etter Kartverkets klasser, så mesteparten av ryggen er åpen. Fri Flyt sier «Hold til høyre rundt toppen av Aksla» — ryggen han kaller Aksla står som Ørntindaksla i registeret og topper på 316 moh — og målinga sier hva omveien koster: skaret vest for den leser 293 moh, om lag 24 høydemeter å gi tilbake mot å klyve over. Ørntinden selv, 398 moh, ligger sør for skaret og blir liggende igjen.",
      "Fra skaret holder linja vestover flanken: 341, 441 og 565 moh på vei mot toppen, med det bratteste hundremetersbeltet — 22,8 grader i snitt — mellom 600 og 700. Fri Flyt advarer om at henget rundt den øvre linja stiger 35–40 grader; sporet holder seg slakere, men flankene ved siden av gjør ikke. En kartlagt sti går også til toppen, og linja er ikke på den her: mellom 3,87 og 4,34 km ute ligger den opptil 367 meter fra stien, før de møtes igjen på 602 moh. Stien står som fotsti i OSM uten vinterstatus, og i sjiktet 330 til 470 moh er den den slakeste av de to — bratteste tretti-metersteget dens måler 20,8 grader mot linjas 24,9.",
      "Varden på 700 moh — registeret har både Varden (Ås) og Småtindan (Fjell) på toppunktet, og den klatra cella leser 700,5 mot publiserte 700. Massivets høyeste punkt er forresten en annen tind — Stortinden, 732 moh, 600 meter lenger sørvest; turmålet er Varden, og det er dit skisporet går.",
    ],
    descent: [
      "«Samme rute ned for maksimal sikkerhet», sier kilden, og nedkjøringa begynner forsiktig: rett rundt varden stuper det i nesten alle retninger — nordvest 60,7 grader og vest 53,8 bare 20–80 m ut, øst 49,3 grader 10–70 m ut. Fri Flyt sier selv at kjøringa begynner om lag 50 meter under toppen, og målingene er enige.",
      "Fra flanken er det jevn kjøring ned til skaret og rundt Ørntinden — beste partiet er fra toppen ned mot Aksla, sier kilden — og så ryggen ned til eidet. Husk gjenstigningen: skaret og eidet gir deg om lag 50 og 20 høydemeter å ta igjen på hjemveien.",
      "Vestsidevarianten mot Lyngvær, som kilden nevner, krever tilrettelagt transport fra Olderfjorden og er ikke denne linja. Fra eidet er det løypa langs Karlsvatnet tilbake til parkeringa — på land hele veien.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt setter KAST 2 – Utfordrende, og målinga av linja sier 38,3 grader som bratteste sammenhengende parti — det ligger lavt, mellom 129 og 156 moh på ryggen opp — og 22,8 grader som bratteste hundremetersbelte, mellom 600 og 700 moh. Hans egen advarsel gjelder flankene: «i øvre deler stiger henget 35-40 grader bratt» — det er terrenget rundt sporet, og linjevalget på den øvre flanken er der dagen blir avgjort.",
      },
      {
        title: "Kolbeindalen og skytebanen",
        body: "Fri Flyts faremoment for nettopp denne ruta er linja selv: «Skredutsatte områder i øvre deler ned fra salen». Salen er skaret på 293 moh, og de øvre delene er flanken linja går opp og ned — bratteste hundremetersbeltet 22,8 grader, og flankene ved siden av 35–40 etter Fri Flyt selv. Den andre beskrivelsen hans legger til dalen nord for ryggen: «Skredfare i Kolbeindalen», skytebane i botnen, og «midt i dalen – der elva renner – er det tidvis svært stor skredfare». Varianten «inn til Store Kongsvatnet» går inn i den; denne linja gjør det ikke — men salen den krysser er kildens eget skredpunkt.",
      },
      {
        title: "Toppen",
        body: "Varden er en tind, ikke en hei: nordvestsida faller 60,7 grader og vestsida 53,8 bare 20–80 m fra varden, østsida 49,3 grader 10–70 m ut, og sørsida 57,9 grader 220–280 m ut. I skodde er toppartiet et sted å snu tidlig — det finnes ingen slak sektor å rote seg ut i.",
      },
      {
        title: "Vannene og været",
        body: "Karlsvatnet ligger på 12 moh ved kysten og Stor-Kongsvatnet er regulert — isen på det første kan ikke forutsettes, og på det andre skal den ikke brukes. Linja krysser eidet mellom dem på land, målt punkt for punkt. Varden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — sjekk varsom.no. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre Lofoten-turer, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,199 L48,196 L72,195 L96,195 L118,196 L145,195 L173,191 L201,194 L225,196 L246,192 L269,178 L287,165 L313,147 L334,132 L354,125 L376,120 L395,122 L420,122 L442,112 L465,101 L487,94 L512,79 L537,66 L565,48 L582,33 L597,22 L600,18",
      startLabel: "2 moh",
      endLabel: "700 moh",
      distanceLabel: "4,8 km",
      caption: "763 høydemeter og 4,82 km fra Eidet ved Kabelvåg — langs Karlsvatnet på land, rundt Ørntindaksla, og østflanken til varden på 700.",
    },
  },
  himmeltindan: {
    slug: "himmeltindan",
    intro:
      "Vestvågøys høyeste fjell, med start i fjæra på Haukland og 988 høydemeter opp på knapt fire kilometer. Kort tur, men siste tredjedel er bratt og toppryggen er smal.",
    ascent: [
      "Fra parkeringen på Hauklandstranda, seks meter over havet, går du nordover mot søndre munning av tunnelen til Utakleiv. Ikke gjennom tunnelen: ta serviceveien som klatrer nordøstover over den, forbi Klumpan, og følg den til den flater ut på benken på 150 moh ved munningen av Durmålsdalen. Her starter den merkede stien, og den går hele veien opp til varden på 931. Parkeringa er avgiftsbelagt året rundt og betales i automat eller app; den er timepriset og tidsbegrenset for å holde omløpet oppe på stranda, så betal for hele turen før du går.",
      "Videre nordøstover opp sørsida av Durmålsdalen. Terrenget er åpent hele veien — det er ingen skog på denne turen — og linja legger seg i lange sikksakk opp mot skulderen ved Molheia. Det brattner fra 300 moh: beltene fra 300 til 700 moh ligger på 21,7 til 23,2 grader i snitt, og bratteste steget på linja måler 28,4 grader, mellom 666 og 687 moh. Ikke skjær rett opp vestflanken av toppryggen; den ligger på 34 til 37 grader i snitt med partier opp mot 46. Høyden tas på skulderen på sørsida.",
      "Fra Molheia rundt 800 moh er det bare tretti meter opp til fortoppen på 830 og den vesle flata der. Det er det siste brede stedet på turen — sørøst for flata faller terrenget 38 grader i snitt. Herfra og ut er du på rygg.",
      "Fra flata går ryggen nordover, og den er smal. Følg krona til varden på 931. Ikke gå ut på østsida — der ligger store hengskavler over svært bratt lende: østflanken under varden måler 42 grader i snitt, sørøstflanken 44, med partier på 54 til 57. Videre nordover faller ryggen til 898 moh og stiger så mot hovedtoppen, som måler 956 moh i terrengmodellen. Et militært radaranlegg står på ryggen på 936 moh, vel hundre meter før toppen; området rundt det er sperret, så følg krona forbi og rett deg etter skilting på stedet.",
    ],
    descent: [
      "Tilbake langs ryggen til fortoppen, på krona eller like vest for den. Derfra har du snaut sju hundre sammenhengende høydemeter ned den brede Durmålsdalen til benken på 150 moh. Vil du ha en variant, svinger du til høyre ned i Øvredalen like før fortoppen og følger ryggsida mellom dalene til det flater ut rundt 600 moh, og derfra tilbake til venstre inn i Durmålsdalen.",
      "Vanligste feil: å følge Durmålsdalen helt ned. Da kommer du ut på Utakleiv-sida med tunnelen mellom deg og bilen. Hold til høyre når dalen flater ut rundt 150 moh og ta serviceveien over tunnelen tilbake til Haukland.",
      "Lehengene mot øst og sør er bratte og ligger rett under skavlene på toppryggen. De faller åtte hundre høydemeter ned til anleggsveien på sør- og østsida av fjellet, som ligger mellom 75 og 180 moh — ikke i Durmålsdalen. Velg dem bevisst, ikke fordi du kom skjevt ut fra ryggen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nedre halvdel er slak og åpen. Det brattner fra 300 moh: beltene fra 300 til 800 moh holder 19,4 til 23,2 grader i snitt, brattest mellom 500 og 600 moh. Bratteste steget på linja måler 28,4 grader, mellom 666 og 687 moh. Fra fortoppen og nordover er ryggen smal, med et fall til 898 moh og femti meter opp igjen før hovedtoppen.",
      },
      {
        title: "Terrenget rundt",
        body: "Østsida av toppryggen bærer store, permanente hengskavler over svært bratt lende. Målt fra varden faller østflanken 42 grader i snitt og sørøstflanken 44, med enkeltpartier på 54 til 57. Hold deg på krona eller like vest for den hele veien fra fortoppen og nordover. Vestflanken over Durmålsdalen ligger på 34 til 37 grader i snitt med partier opp mot 46, og skal ikke skjæres direkte, verken opp eller ned.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L34,198 L62,194 L90,185 L109,177 L118,172 L145,171 L166,171 L187,169 L214,161 L238,153 L270,142 L298,128 L314,120 L330,113 L346,104 L360,96 L374,89 L395,80 L411,72 L429,63 L444,56 L464,47 L492,41 L513,34 L536,25 L557,28 L584,23 L600,18",
      startLabel: "7 moh",
      endLabel: "956 moh",
      distanceLabel: "3,9 km",
      caption: "988 høydemeter fra fjæra på Haukland på 3,89 km; det bratteste ligger mellom 500 og 600 moh.",
    },
  },
  gangnesaksla: {
    slug: "gangnesaksla",
    intro:
      "1306 høydemeter og 4,92 km fra kraftstasjonen i Sørskjomen — nesten hele fjellet fra fjorden, med Frostisens 25 kvadratkilometer i utsikten og renna lokalavisa kaller Norges lengste under kanten i nordøst. Fri Flyt gir KAST 2 – Utfordrende; normalruta på sørsida måler 20,0 grader i bratteste hundremetersbelte og 26,0 i bratteste sammenhengende parti. Renna er variantterreng med egen utstyrsliste, og den er ikke linja på kortet.",
    ascent: [
      "Fra parkeringa utenfor kraftstasjonen — OSM har Skarelva kraftverk kartlagt, stasjonen med glass- og natursteinsfasaden kilden beskriver, 20 moh. Anleggsveien følger Vesterskarelva opp dalen: beltet fra 100 til 200 moh måler 17,4 grader, og du følger bekken til den lille dammen ved tregrensa på 539. Skogen slutter på 600 moh etter 2,59 km.",
      "Fra dammen dreier du til høyre gjennom skogen mot nordvest, og over tregrensa går det diagonalt til den tydelige hylla på rundt 800 moh — prøvepunktet over hylla leser 1067. Beltene fra 700 til 1000 måler 19,2, 19,6 og 20,0 grader: jevnt, aldri bratt, alltid oppover.",
      "Fra hylla holder du samme retning på de slakeste bakkene og tar toppen via nordøstryggen. Det bratteste sammenhengende partiet måler 26,0 grader mellom 1155 og 1174 moh. Varden på 1318 — registeret løser 1318,5, koordinaten flyttet 200 meter fra representasjonspunktet til toppunktet — med Frostisen i sør og Skjomen under deg.",
    ],
    descent: [
      "Normalruta ned er sporet ditt opp — en fin rute med god plass ovenfor tregrensa, sier kilden, og sørvestsektoren måler 9,6 grader i snitt. Se opp for skred sør for toppen og hull i bekken seint i sesongen — kildens egne ord, og bekkedalen er der begge bor.",
      "Gangnesrenna er kapittelet for seg: rundt 40 grader i starten, ispartier fra bekkeløpet og skredaktivitet lenger nede, isøks, stegjern og eventuelt tau i kildens utstyrsliste, og en labyrintisk utgang langs fjordkanten til Skjombotn. Kanten mot renna måler 59,9 grader i det første 60-metersvinduet. Tusen meter rett ned mot fjorden — for dager og folk som har målt seg mot mindre først.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt. Normalruta på sørsida er jevn — 20,0 grader i bratteste belte, 26,0 i bratteste parti — og farene kilden navngir er skred sør for toppen og hull i bekken seint i sesongen. Bekkedalen er både oppspor og utløp; les hengene over den.",
      },
      {
        title: "Gangnesrenna",
        body: "Rundt 40 grader øverst, is fra bekkeløpet, skredaktivitet nederst — og 59,9 grader i det første vinduet fra kanten. Renna har egen utstyrsliste hos kilden (isøks, stegjern, eventuelt tau) og eget alvor. Fra normalruta er den en utsikt, ikke en snarvei.",
      },
      {
        title: "Før du går",
        body: "Gangnesaksla ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L33,197 L60,193 L85,186 L107,179 L131,169 L151,163 L178,162 L195,157 L222,147 L248,138 L272,131 L298,123 L321,117 L343,111 L370,100 L387,93 L405,86 L423,79 L441,71 L464,62 L485,54 L513,48 L531,42 L551,34 L573,26 L586,21 L600,18",
      startLabel: "20 moh",
      endLabel: "1318 moh",
      distanceLabel: "4,9 km",
      caption: "1306 høydemeter og 4,92 km fra kraftstasjonen i Sørskjomen om dammen ved tregrensa og hylla på 800, med skoggrensa på 600 moh og det bratteste — 26,0 grader mellom 1155 og 1174 moh — under nordøstryggen.",
    },
  },
  justadtinden: {
    slug: "justadtinden",
    intro:
      "733 høydemeter og 2,88 km fra gården Justad til den høyeste toppen på østsida av Vestvågøy — slakt og lekent skiterreng ifølge kildene, med Vågakallen og Henningsvær under deg fra varden. Ingen hundremeter måler mer enn 22,6 grader, og det bratteste sammenhengende partiet er 29,8. Fri Flyts Lofoten-sider er eldre og bærer ingen KAST; det de bærer er farepunktene, og de er målbare: hengskavlene mot nordøst henger over en side som faller 41 grader i snitt.",
    ascent: [
      "Fra gården Justad ved fv. 815 — 14 moh på dyrket mark, med parkering langs veien slik kilden sier. Lia over gården er åpen praktisk talt fra fjæra: terrengklassene langs linja har ingen sammenhengende skog i det hele tatt, så hele turen er lesbar fra bilen. Beltet fra 0 til 100 moh måler 11,7 grader.",
      "Linja følger ryggformasjonen nordover over Skjærheia: beltet fra 300 til 400 moh er turens bratteste, 22,6 grader over 250 meter grunn, med det bratteste sammenhengende partiet — 29,8 grader — mellom 363 og 389 moh. Over 400 slakner det til 11,0 før de øvre beltene legger seg på 17–20 grader.",
      "Toppartiet er lekent: småformasjoner og valgfrie linjer opp mot varden på 736 — registeret leser 735,7 der Fri Flyt og kartet skriver 738, et smalt topparti der laserskannet leser et par meter under det publiserte tallet. Hold deg vest for kanten: nordøstsida under varden faller 41,0 grader i snitt med 64,9 grader som bratteste 60-metersvindu bare 10 til 70 meter ut.",
    ],
    descent: [
      "Normalen er sporet ditt opp, og vestsida er den slakeste sektoren — 21,7 grader i snitt med 30,1 som bratteste vindu. Oktoberflanken midt på ryggen er kildens nedfartsvariant for mer fall per sving.",
      "Sørnedfarten er der kilden sier de større skredene går, og målingen er enig: 34,8 grader i snitt med 50,0 grader som bratteste vindu 110 til 170 meter ut. Den hører til stabile dager — og hengskavlene mot nordøst gjør kanten til noe du holder avstand fra uansett føre.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ingen KAST hos Fri Flyt — Lofoten-sidene er eldre enn klassifiseringen — men linjas egne tall er snille: 22,6 grader i bratteste belte, 29,8 i bratteste parti. Terrenget rundt er det som krever hodet, og det er grunnen til at kortet bærer grad 2.",
      },
      {
        title: "Skavlene mot nordøst",
        body: "Kildens eget farepunkt: hengskavler mot de brattere partiene mot nordøst. Nordøstsida faller 41,0 grader i snitt med 64,9 som bratteste vindu rett under varden — en skavl som losner der har vegg under seg. I flatt lys går sporet et par svingemonner vest for kanten.",
      },
      {
        title: "Sørsida",
        body: "De større skredene går på sørnedfarten, sier kilden — 34,8 grader i snitt, bratteste vindu 50,0. Etter pålagring fra nord og vest er sørsida lesida, og da er oppsporet langs ryggen den eneste linja turen trenger.",
      },
      {
        title: "Før du går",
        body: "Justadtinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell og hentet fra naboturene, og det står her. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L36,197 L56,189 L75,181 L93,176 L112,169 L140,159 L159,158 L183,154 L216,153 L244,150 L259,144 L275,137 L292,131 L317,121 L332,114 L351,103 L375,94 L403,85 L431,83 L450,78 L461,74 L488,64 L507,56 L526,46 L544,40 L573,30 L591,21 L600,18",
      startLabel: "14 moh",
      endLabel: "736 moh",
      distanceLabel: "2,9 km",
      caption: "733 høydemeter og 2,88 km fra Justad over Skjærheia, uten skog å snakke om langs linja, med det bratteste — 29,8 grader mellom 363 og 389 moh — midt på ryggen.",
    },
  },
  stornappstinden: {
    slug: "stornappstinden",
    intro:
      "Lofot-klassikeren i overkommelig format: 685 høydemeter fra veikanten til en varde som står rett på stupkanten. Kort nok til en ettermiddag, stor nok til å bli en favoritt.",
    ascent: [
      "Fra parkeringen ved skianlegget i Nappskaret, en kilometer vest for Napp, går du nordover og holder deg til venstre for skitrekket. Rett over øvre trekkstolpe, ved 139 moh, samles stiene fra de ulike parkeringene til ett spor — starter du fra den vestre parkeringen drøyt 250 meter unna, kommer du inn på det samme sporet her. Fra 61 moh og opp er du over skoggrensa hele veien; det finnes ikke skog på denne ruta.",
      "Sporet svinger nordøst inn i dalen mellom Okstinden og Litlnappstinden og krysser Myrlandselva rundt 215 moh. Videre opp dalen til søkket ved Skarvatnet, det islagte tjernet på 341 moh. Hold til venstre opp mot Middagstinden, og legg deg deretter mot høyre der terrenget heller slakest — det er den linja som tar deg opp uten å komme borti sørflanken.",
      "Over 500 moh reiser terrenget seg til et kort, bratt trinn opp på ryggen ved 560 moh. Hundremeterssjiktene ligger tett på hverandre: det bratteste, 600 til 700 moh, holder 17,1° i snitt, og nede i dalen mellom 200 og 300 moh er det 16,7°. Bratteste enkelttrinn på hele linja måler 25,1°, og det ligger nettopp her — mellom 498 og 530 moh. Over trinnet flater det ut, og fra rundt 724 moh går den brede toppflata østover som en 13 graders rampe inn mot varden.",
      "Varden på 741 moh står på kanten av østveggen. Stopp ved varden. Toppen bærer store hengskavler mot øst, og øst- og nordøstsida over Napp og Perklubben faller 42–43° i snitt med bergband over 60° — det er stup, ikke en linje.",
    ],
    descent: [
      "Ned samme vei. Dalen mellom Okstinden og Litlnappstinden gir variert kjøring, og fra søkket ved Skarvatnet er det åpent hele veien ned til trekket.",
      "Vanligste feil: å slippe seg sørover fra toppflata fordi det ser kortere ut. Sørsida rett under toppen faller nær 39° i snitt, med partier over 50°, og det er der skredene går på dette fjellet. Hold vestover i stedet — vest er den slakeste sida av fjellet, 22° i snitt — og følg oppstigninga tilbake til søkket.",
      "Femti meter fra varden tar du til venstre, rett sør, inn i renna: 40° og 400 meter lang, og den munner ut i et bredere parti rett over Litlnappstinden. Det er en egen avgjørelse, ikke en snarvei.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigninga gjennom dalen er slak: ingen hundremeterssjikt på ruta holder mer enn 17,1°, og det bratteste er 600–700 moh. Men snittet skjuler trinnet opp på ryggen: bratteste enkelttrinn på linja måler 25,1° mellom 498 og 530 moh, kort og bratt. Det er de partiene som kan løsne på normalruta.",
      },
      {
        title: "Terrenget rundt",
        body: "Toppen bærer store hengskavler mot øst, og øst- og nordøstsida over Napp og Perklubben faller 42–43° i snitt med bergband over 60°. Sørflanken rett under toppen holder nær 39°, og renna sør for varden 40° over 400 meter. Vestover er fjellet slakest, 22° i snitt. Går du utenom normalruta, er det disse du velger mellom.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,197 L61,190 L87,184 L117,176 L140,172 L167,170 L188,165 L211,156 L228,147 L246,140 L270,133 L292,131 L320,126 L343,124 L369,115 L387,106 L396,102 L414,94 L444,83 L467,72 L492,63 L519,51 L543,43 L563,35 L581,25 L600,18",
      startLabel: "61 moh",
      endLabel: "740 moh",
      distanceLabel: "3,1 km",
      caption: "61 til 741 moh på 3,1 kilometer: jevn stigning gjennom dalen, ett bratt trinn, så flatt inn til varden.",
    },
  },
  heggmotinden: {
    slug: "heggmotinden",
    intro:
      "773 høydemeter på 3,39 km fra bommen ved Heggmoen: skogsvegen og sporet vestover, opp ryggen vest for søkket og langs vestkanten av halfpipen på sørsida, og vestryggen fra 700 moh til toppen på 797 moh. Bratteste bandet er 16,8 grader mellom 500 og 600 moh, og bratteste sammenhengende parti 25,1 grader mellom 159 og 180. Fri Flyt: «Heggmotinden er den nærmeste skitoppen til Bodø by.» Hele lia ligger i Heggmoen skytefelt.",
    ascent: [
      "Start ved bommen ved Heggmoen, 24 moh, der skogsvegen tar av fra Vatnveien. Fri Flyt: «Parkér ved bommen og følg skogsveien nordover ca 1,5 km til du treffer et veikryss med skiltet «Advarsel. Isen usikker». Ta inn veien til venstre, følg forbi et lite pumpehus og fortsett sti/åpent spor ca 300 meter til en stor åpen slette.» Det krysset er der skogsvegen ender etter 1,44 km og vegen mot dammen ved Heggmovatnet går til venstre. Linja tar av tidligere: den forlater skogsvegen 0,9 km før krysset, der et spor går til venstre ved 0,53 km og 95 moh, følger sporet vestover og er ved foten av ryggen vest for søkket ved 1,03 km og 196 moh. Pumpehuset og sletta ligger på Fri Flyts trasé, ikke på linja.",
      "Fri Flyt: «Vurder forholdene i søkkformasjonen mellom 300-400 moh med tanke på skred. Alternativt trekk ut på ryggen heiskars venstre for søkket.» Linja går den ryggen, og søkket ligger øst for den. Bratteste sammenhengende parti på turen er nederst på ryggen, 25,1 grader mellom 159 og 180 moh. Bandene fra 300 til 500 moh måler 15,1 og 15,9 grader, og 49 meter sørøst for linja ved 263 moh står celler på 59,2 grader.",
      "Fra 430 moh går linja langs vestkanten av halfpipen, ikke i den: bakken faller 25 til 43 meter innen 100 meter mot øst og sørøst, mens den er flat eller stiger mot vest. Fri Flyt: «Følg skålformasjonen til 700 moh». Peakbook om halfpipen: «Et lite søkk som samler mye snø. Lang er den også.» Fra 542 moh går linja 6 til 46 meter fra den kartlagte sommerstien, helt til toppen. Bandet fra 500 til 600 moh er det bratteste, 16,8 grader.",
      "På 700 moh står klippefremspringet. Fri Flyt: «På 700 moh kan du nå toppen via sørvestflanken (høyre side av klippefremspring) eller vestryggen (venstre side av klippefremspring).» Linja går vestryggen, til venstre, fra 709 moh ved 3,07 km; sørvestflanken er Fri Flyts 30-gradersalternativ. Ved fremspringet går linja tett på kanten: bakke på 45 grader eller brattere står 10 til 15 meter øst for linja mellom 708 og 718 moh, og ved 717–724 moh krysser linja 16 meter bakke på 35 grader eller mer, med bratteste celle 38 grader. Fri Flyt: «Vær oppmerksom på skavlkanten på toppeggen.» Fra 777 moh til toppen står bakke på 45 grader eller brattere 21 til 29 meter nord og nordøst for linja; hold deg sør for kanten. Ut.no: «pass deg for kanten mot nord».",
    ],
    descent: [
      "Fri Flyt: «Følger samme vei ned som alternativet du valgte opp.» Går du ned linja, er det vestryggen og ryggen vest for søkket. Fri Flyts nedkjøring 1.2 går sørvestflanken øverst: «Sørvestflanken like under toppen er 30 grader bratt. Følg denne ned men hold skikjørers høyre og rund under klippefremspringet og hold høyden i en travers mot høyre til starten av skålformasjonen (halfpipen).» og «I enden av halfpipen på 400 moh bør du velge skikjørers høyre for søkkformasjonen videre dersom skredforholdene er uoversiktlige». Fri Flyt: «På 200 moh bør du begynne å tenke skikjørers høyre for å holde høyden slik at du kan gli ut til skogsveien som tar deg ned til parkeringen.»",
      "Toppen faller bratt mot nord og nordøst: 58,9 grader 40 til 100 meter ut mot nord og 55,8 grader 20 til 80 meter ut mot nordøst. Mot vest er den slak, 13,8 grader i snitt over 500 meter. Sydrenna mot Heggmovatnet er en egen nedkjøring, «Moderat», 35 grader mellom 500 og 300 moh og en terrengfelle. Fri Flyt om den: «Sent på sesongen må du spesielt ta hensyn til vårskred».",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 25,1 grader mellom 159 og 180 moh, og bratteste bandet 16,8 grader fra 500 til 600. Bakken under linja er 35 grader eller brattere i ett strekk på 16 meter ved 717–724 moh, ved klippefremspringet. Fri Flyt oppgir 30 grader mellom 300 og 400 moh, og mellom 700 og 770 moh «hvis SV flanken på høyre side av klippefremspring velges», og graderer turen «Lett/Moderat».",
      },
      {
        title: "Terrenget utenfor",
        body: "Fri Flyt: «Unngå bekkefaret på 300 moh på dager med skredfare.» Søkket mellom 300 og 400 moh samler snø; linja går ryggen vest for det. Ved klippefremspringet står bratt bakke 10 til 15 meter øst for linja, og toppeggen har skavlkant mot nord, 21 til 29 meter fra linja det siste stykket opp; nord- og nordøstsida er 55,8 til 58,9 grader. Fri Flyt om nedkjøringen til Stormyra: «Tidlig og sent på sesongen kan snøen dekke dårlig de nederste 200 høydemeterne».",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Salten på varsom.no. Salten er en A-region og varsles daglig i sesongen. Lia ligger i Heggmoen skytefelt — sjekk skyteplanen før du går. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L31,194 L55,189 L73,185 L95,183 L125,179 L143,176 L163,170 L183,160 L207,153 L232,146 L246,141 L265,135 L286,129 L310,120 L330,114 L347,106 L366,99 L390,91 L406,83 L422,78 L443,71 L461,62 L483,54 L501,49 L525,42 L541,39 L554,35 L573,27 L585,22 L600,18",
      startLabel: "24 moh",
      endLabel: "797 moh",
      distanceLabel: "3,4 km",
      caption: "773 høydemeter og 3,39 km fra Heggmoen, med foten av ryggen på 196 moh, halfpipen øst for linja og vestryggen fra 709.",
    },
  },
  kvalhornet: {
    slug: "kvalhornet",
    intro:
      "902 høydemeter på 4,39 km fra parkeringa ved Bringsliveien: langs sørsida av Grytåga, opp ryggen til Søndre Nattmålstuva på 490 moh, forbi Nattmålstuva og nordvestover inn på toppryggen til Kvalhornet, 965 moh. Bratteste bandet er 18,4 grader mellom 300 og 400 moh, og bratteste sammenhengende parti 24,1 grader mellom 160 og 174, i skogen nederst. Fri Flyt: «For mange i Bodø er disse toppene de største klassikerne.»",
    ascent: [
      "Start på parkeringa Kvalhornet ved Bringsliveien, 63 moh, 2 km fra rv. 80 ved Nordvika. Fri Flyt: «Ta hensyn til brøytebilen. Parkér derfor godt ut i kanten.» Fri Flyt: «Fra parkeringen 60 moh følger du flatt terreng NØ ca 200 meter før du dreier nord og følger sørsiden (heiskars venstre) av Grytåga.» Skogen slipper ved 160 moh, 0,55 km fra start, og bratteste parti på turen ligger her, 24,1 grader mellom 160 og 174 moh.",
      "Fri Flyt: «På 240 moh kommer du til en overbygd sittebenk. Herfra følg den markerte ryggen sør for Grytåga opp mot Søndre Nattmålstuva til 490 moh. Her flater det markant ut.» Grytåga renner 36 til 355 meter nordøst for linja de første 1,3 km, nærmest 36 meter ved 160 moh og 53 meter ved 355 moh. Den er det Fri Flyt advarer mot: «Grytåga har to markerte dropp (fine isklatre fosser) og bratte Ø-NØ vendte heng som ender i en åpenbar terrengfelle». Nord og nordøst for linja står celler på 65,5 grader 52 meter unna ved 174 moh og 36,8 til 38,8 grader 44 til 51 meter unna ved 305–363 moh. Bandet fra 300 til 400 moh er det bratteste, 18,4 grader. Søndre Nattmålstuva når du på 493 moh etter 1,62 km.",
      "Fri Flyt 7.1: «Skal du på Kvalhornet går du 6.1 opp til 490 moh og fortsetter videre forbi s.Nattmålstuva (634 moh) som passeres på østsiden (heiskars høyre) og fortsetter på en NV kurs 1,5 km til topps i slakt terreng». Det er slakt her: 10,1 grader fra 500 til 600 moh, 8,6 fra 600 til 700 og 8,5 fra 700 til 800, over 1935 meter grunn til sammen. Linja passerer Nattmålstuva på østsida, nærmest ved 2,21 km og 594 moh, 411 meter øst for toppen. Kildene bruker navnet om to steder; Fri Flyt: «Egentlig er det overgangen på 490 moh som blir omtalt som Nattmålstuva.» Den kartlagte stien «Kvalhornet» følger linja innen 68 meter de første 3,64 km.",
      "Fri Flyt: «mellom 880-940 moh er det 30 grader bratt. Dette henget kan omgås ved å legge sporet vest-over (heiskars venstre) inn på toppryggen.» Linja gjør det: den går vest for henget, med celler på 42,3 grader 46 meter nordøst for linja ved 904 moh, og kommer inn på toppryggen ved 953 moh, 4,24 km fra start. Stien går rett opp henget, 61 til 137 meter øst for linja mellom 828 og 956 moh. Bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende. Ut.no: «Dagene med vind på toppen er vel i flertallet.»",
    ],
    descent: [
      "Fri Flyt: «Følger samme vei ned som opp.» og «Ikke kom for langt skikjørers venstre mellom 420-280 moh.» Det er Grytåga og terrengfella. På svært tidlig sesongstart skriver Fri Flyt at terrenget fra 300 moh og ned «bør da forseres med forsiktighet og fartsavpassing. Det er lett å hekte i busker eller treffe bekkehull.»",
      "Toppen er slak mot sør, sørvest og vest, 10,4 til 17,0 grader i snitt over 500 meter. Mot øst og sørøst faller den 50,4 og 47,7 grader i bratteste vindu 40 til 120 meter ut, og mot nord 58,7 grader. Fri Flyts østflanke (7.2) til Leiråga er «Moderat», og «Sørg for å passere hengeskavlene langs toppeggen før du drar skikjørers venstre ned østflanken.» Fri Flyt oppgir «32 grader 700-570 moh» og «Terrenget høyre og venstre for traseen rett øst er brattere enn 32 grader», og: «Dette er et typisk leheng for vestlige vinder.»",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste bandet er 18,4 grader mellom 300 og 400 moh, og bratteste sammenhengende parti 24,1 grader mellom 160 og 174 moh. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter. Fri Flyt oppgir 30 grader som bratteste punkt, i henget mellom 880 og 940 moh som linja går vest for, og graderer turen «Lett»; ut.no kaller den middels.",
      },
      {
        title: "Terrenget utenfor",
        body: "Grytåga nordøst for linja har bratte øst- og nordøstvendte heng som ender i en terrengfelle; hold deg på ryggen sør for den, særlig mellom 280 og 420 moh på vei ned. Toppen har hengeskavler langs toppeggen, og øst- og nordsida er 47,7 til 58,7 grader.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Salten på varsom.no. Salten er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L18,199 L36,194 L55,188 L75,180 L91,173 L110,166 L129,157 L147,148 L166,139 L180,132 L202,121 L221,113 L239,110 L264,106 L283,101 L307,92 L325,89 L343,86 L360,81 L381,75 L404,70 L418,68 L436,64 L455,60 L473,57 L492,52 L516,45 L535,39 L547,34 L559,30 L578,22 L600,18",
      startLabel: "63 moh",
      endLabel: "965 moh",
      distanceLabel: "4,4 km",
      caption: "902 høydemeter og 4,39 km fra Bringsliveien, med skoggrensa på 160 moh, Søndre Nattmålstuva på 493 og bratteste bandet mellom 300 og 400.",
    },
  },
  kistrandtindan: {
    slug: "kistrandtindan",
    intro:
      "976 høydemeter på 3,94 km fra havet på Kistrand: gjennom skogen og opp ryggen sør for Mølnelva til flata ved 480 moh, og nordover til 979-toppen i Kistrandtindan, 982 moh på Kartverkets terrengmodell. Bratteste bandet er 19,1 grader mellom 700 og 800 moh, og bratteste sammenhengende parti 25,8 grader mellom 69 og 89, i skogen nederst. Fri Flyt: «Den sydvendte skiflanken er to kilometer bred!»",
    ascent: [
      "Start ved busslomma på Kistrand ved rv. 80, 7 moh. Fri Flyt: «Etter 26,3 km parkerer du på busslommen ved Holmen hø side av vei». Ut.no: «Turen starter fra fotoboksen på rv. 80 på Kistrand.» Lomma er kartlagt som et busstopp i bruk, og der er parkering ikke tillatt. Nærmeste kartlagte parkeringsplass ligger 863 meter vest, og Fri Flyt viser til Dinesodden lenger øst: «fortsetter videre 1,2 km til Dinesodden med stor parkering på høyre side av veien». Ny trasé for rv. 80 er under bygging 82 meter sør for starten, så lomma og fotoboksen kan bli flyttet.",
      "Fri Flyt: «Fra parkeringen, gå i nord-nordvestlig retning med sikte på kraftledningen. Når du treffer kratfledningen, drei nordøst 2-300 meter til du treffer starten på ryggformasjonen sør for Mølnelva.» Ut.no: «De første 220 høydemeterne går gjennom skogen og på sørvestsiden av Mølnelva.» Skogen slipper ved 207 moh, 0,94 km fra start. Bratteste parti på turen er nederst, 25,8 grader mellom 69 og 89 moh, og bandet fra 100 til 200 moh måler 16,0 grader. Nord og nordøst for linja står bakke på 45 grader eller brattere 12 til 53 meter unna mellom 176 og 271 moh: det er kanten av juvet.",
      "Mølnelva er nærmest ved 1,74 km og 373 moh, 46 meter nordnordøst for linja. Ut.no: «Mølnelva har dannet et markant juv som en kan krysse litt lenger opp ved ca. 430 moh.» Ut.no-sporet krysser juvet og går nordøstover til en topp ut.no kaller Kistrandtinden, 853 meter øst for 979-toppen; Fri Flyts linje holder seg vest for juvet og går rundt toppen av det. Der, mellom 453 og 493 moh, står bakke på 45 grader eller brattere 19 til 46 meter fra linja. Fri Flyt: «Følg ryggen til flata med tre bjørketrær på 480 moh.» Flata når du på 476 moh etter 2,11 km.",
      "Fri Flyt: «Fra flata følg jevnt 25 grader bratt terreng i retning nord mot toppen.» Bandene fra 500 til 700 moh måler 16,4 og 13,1 grader, og 700 til 800 er det bratteste, 19,1 grader over 298 meter grunn. Bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende, men ved siden av den står celler på 38,6 til 41,6 grader 11 til 32 meter unna mellom 558 og 651 moh. Toppen er slak mot sør, 15,6 grader i snitt over 500 meter, og nesten flat mot øst.",
    ],
    descent: [
      "Fri Flyt: «Følger samme vei ned som opp.» Ut.no: «På tur nedover anbefales det å krysset juvet/Mølnelva ved ca. 200 moh. Derfra er det litt enklere å ta seg ned gjennomskogen.» Det gjelder ut.no-linja nord for juvet; går du ned der du gikk opp, er du på sørsida hele veien.",
      "Toppen faller bratt mot nord, nordvest og vest: 56,9 grader 20 til 80 meter ut mot nord, 56,2 mot nordvest og 48,7 mot vest. Selve toppunktet står 15 meter fra bakke på 61 grader mot nordnordvest; hold deg sør for kanten. Fri Flyt om p970-ruta (5.2): terrenget vest for sporet der er «rundt 30+ grader i hele den sørøstvendte flanken fra 400-700 moh», og «På dager med skredfaregrad 3 må du holde behørig avstand til sørøstflankene som starter på 400-700 moh.»",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 25,8 grader mellom 69 og 89 moh, og bratteste bandet 19,1 grader fra 700 til 800. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter. Fri Flyt oppgir 30 grader mellom 350 og 400 moh som bratteste punkt og graderer turen «Lett/Moderat»; ut.no kaller den middels.",
      },
      {
        title: "Terrenget utenfor",
        body: "Mølnelva har et markant juv nord for linja, og bakke på 45 grader eller brattere står 12 til 53 meter fra linja langs juvkanten mellom 176 og 271 moh. Sørflanken er bred med mange valg, men Fri Flyt advarer i nedkjøring 5.3 om at du utenfor sporet fra 700 til 400 moh «vil … komme inn i terreng som alltid har enkeltheng brattere enn 30 grader». Nord- og vestsida av toppen er 48,7 til 56,9 grader, og kanten står 15 meter fra toppunktet.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Salten på varsom.no. Salten er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,197 L54,190 L75,183 L109,174 L125,168 L143,163 L164,157 L192,151 L219,145 L246,137 L264,132 L285,123 L309,115 L332,110 L356,103 L383,92 L404,86 L431,80 L459,70 L479,62 L493,56 L514,47 L534,40 L558,34 L582,24 L600,18",
      startLabel: "7 moh",
      endLabel: "982 moh",
      distanceLabel: "3,9 km",
      caption: "976 høydemeter og 3,94 km fra Kistrand, med skoggrensa på 207 moh, flata ved 476 og bratteste bandet mellom 700 og 800.",
    },
  },
  midtitinden: {
    slug: "midtitinden",
    intro:
      "1050 høydemeter og 4,15 km, hver eneste meter av fjellet fra havnivå: parkeringa ved Sagelva på rv80 leser 11 moh, og varden 1060. Fri Flyt kaller Midtitinden — eller Mjønestinden — en av de mest populære skitoppene rundt Bodø, og tallene forklarer hvorfor: bratteste hundremetersbeltet måler 19,1 grader mellom 900 og 1000 moh, det bratteste sammenhengende partiet 26,9, og linja gir tilbake to meter på hele turen. Registeret bærer begge punktene: Topp-punktet Midtitinden står 294 m nordøst og leser bare 983 moh, mens Fjell-punktet Mjønestindan står 15 m fra det høyeste punktet og leser 1057. Fri Flyts «Mjønestinden» er altså registerets eget navn på selve toppen — og det er dit linja går.",
    ascent: [
      "Start ved den store avkjøringa på rv80 ved Kleivberget, nordøst for utløpet av Sagelva — parkeringslomma er kartlagt og leser 11 moh. Gå nordover gjennom hyttefeltet til den øverste hytta, den Fri Flyt kaller Geilo, på 54 moh — skogen her er den eneste på turen, og Kartverkets klasser sier den slutter allerede på 191 moh.",
      "Fra hytta holder du nordnordøst i om lag en kilometer, slik kilden sier, og følger de naturlige rampene forbi brattpartiene — linja passerer 270 og 420 moh på vei mot Innertinden. Ved 536 moh, på flanken mot Innertinden, kommer du inn på militærløypemerkingen kilden plasserer ved 560.",
      "Vestover langs merkingen til sørøstryggen som kommer ned fra Midtitinden — kilden sier omtrent 720, og ryggfoten leser 728. Fra 800 moh går ryggen over i det Fri Flyt ber deg være oppmerksom på: «den konvekse overgangen som begynner på 800 moh». Målingen er enig om hvor den ligger — det bratteste sammenhengende partiet på turen, 26,9 grader, ligger mellom 877 og 893 moh, og det bratteste hundremetersbeltet, 19,1 grader i snitt, mellom 900 og 1000.",
      "Ved 1026 moh — kilden sier 980 — runder linja mot nord og inn på nordøstryggen. De siste meterne til varden er slake, og du står på 1060 moh med hele Saltfjorden og tindene rundt deg.",
      "Registeret fortjener en setning: Topp-punktet for Midtitinden står 294 m nordøst for det høyeste punktet og leser 983 moh — 75 meter for lavt. Selve toppen har et annet registernavn, Mjønestindan (Fjell), 15 m fra den klatrede cella. Toppsøket klatret til 1059,5 — publisert 1058 — og kortet bærer den målte cella.",
    ],
    descent: [
      "Normalveien ned er samme vei som opp: nordøstryggen, sørøstryggen og rampene tilbake til militærløypa og hyttefeltet. Med 26,9 grader som bratteste sammenhengende parti er det åpen kjøring fra topp til fjære — men den konvekse overgangen ved 800 moh er der på vei ned også, og du ser ikke hva som ligger under den før du er i den.",
      "Fri Flyt beskriver flere varianter fra lett til krevende — sørøstflankene, østover mot vatnet på 627, og nordover mot Stordalen på 450 med retur over skardet. Ingen av dem er denne linja, og målingene fra varden sier hvorfor de krever sitt: nordøstsida faller 69,2 grader på det bratteste 390–450 m ut, sørsida 56,7 grader 70–130 m ut og sørvestsida 60,8 grader 90–150 m ut. Velg variant i god sikt, ikke i skodde.",
      "Sida turen går i vender sør-sørøst og får sol fra morgenen: det som er mykt midt på dagen, kan være skare igjen når du kommer ned igjen sent. To meter å gi tilbake har linja samlet, så hjemveien er ren kjøring.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts eget tall for normalveien er bratteste punkt under 30 grader, og målingen bekrefter det for denne linja: 26,9 grader som bratteste sammenhengende parti, med det bratteste hundremetersbeltet 19,1 grader mellom 900 og 1000 moh. Men under-30 gjelder sporet, ikke fjellet: rett sør, sørøst og nord for toppen står det 39,5 til 56,7 grader bare 60–130 m fra varden.",
      },
      {
        title: "Variantene",
        body: "Nedfartsvariantene Fri Flyt graderer fra lett til krevende går i terreng målingen har tall på: nordsida mot Stordalen måler 28,1 grader i snitt med 40,4 grader som bratteste 60 m bare 60–120 m fra varden, sørvestsida 60,8 grader 90–150 m ut og vestsida 55,4 grader 140–200 m ut. Nordøstsida, som ingen av variantene går i, faller 69,2 grader 390–450 m ut. Det er skredterreng med konsekvens, og det er nettopp valgfriheten som gjør fjellet populært — velg etter forholdene, ikke etter lysten. Fri Flyt legger sine egne advarsler på variantene, og de står igjen her: det er «registrert store flakskred i øst hellingen ned mot vatnet på 627 moh»; renna skal kjøres «én og én»; det er skavlkant på skikjørers venstre langs NV-ryggen fra toppen; og «på dager med skredfare 3 bør du ikke la deg friste til å avvike fra sporet».",
      },
      {
        title: "Solvendt fra havet",
        body: "Hele turen står sør-sørøst-vendt fra havnivå til 1060 moh. Det gir tidlig sol og rask oppmykning om våren — og daglig gjenfrysing. På en 1050-metersflanke rekker forholdene å endre seg fra fjæra til varden; det som bærer deg ved 300 moh om morgenen, kan være våt snø ved 900 midt på dagen.",
      },
      {
        title: "Før du går",
        body: "Midtitinden ligger i varslingsregionen Salten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder for denne turen; kortets jan–apr er lånt fra appens Lofoten-turer på samme breddegrad, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,196 L50,191 L65,186 L91,179 L117,172 L130,167 L143,163 L165,156 L182,150 L202,143 L227,134 L243,129 L267,122 L293,116 L306,111 L332,108 L356,101 L377,93 L403,85 L429,79 L449,76 L467,68 L488,60 L514,51 L527,47 L547,39 L566,32 L585,24 L600,18",
      startLabel: "11 moh",
      endLabel: "1060 moh",
      distanceLabel: "4,2 km",
      caption: "1050 høydemeter og 4,15 km fra Sagelva på rv80 — havnivå til 1060 moh, med 26,9 grader som bratteste sammenhengende parti.",
    },
  },
  sandhornet: {
    slug: "sandhornet",
    intro:
      "1021 høydemeter og 5,01 km fra fjæra på Horsdal — øyfjellet sørvest for Bodø som Fri Flyt kaller en av de vakreste kysttoppene i området. Fjellet står i Gildeskål; kortet bærer Bodø slik Strandtinden bærer Harstad, for det er derfra dagen starter. Linja holder seg under 30 grader så nær som de siste femti høydemeterne — og det bratteste sammenhengende partiet på linja, 32,5 grader, ligger ikke der oppe i det hele tatt — det ligger i trappene mellom 26 og 51 moh, der skia uansett er på sekken — og fareteksten hos kilden gjelder ikke brattheten, men utløpssonene linja krysser i Stjerndalen.",
    ascent: [
      "Fra gården på Horsdal, 10 moh, følger du den merkede stien langs fjæra sørøstover om lag en kilometer — 28 moh på det høyeste, med sjøen rett ved. Så dreier stien nordøst og stiger bratt via trappene; her bærer du skia. Der trappene ender flater terrenget ut på om lag 190 moh — målt 189 — og skia kan på.",
      "Strekket videre inn Stjerndalen er turens faretekst, og kilden er ordrett: dalen går i utløpssoner for skredflanker, spesielt vest- og sørvestflankene under Isvasstinden — fjellet rett øst, som registeret bekrefter. Vær OBS på dager med markert skredfare og utover våren; flata er ikke faresonefri bare fordi den er flat.",
      "Fra dalen holder du nordover mot 450 — «øst for Stjernelva hele veien», sier kilden — linja leser 463 — og så vestover i slakt terreng nord for punkt 592: 662 og 752 moh i jevn stigning. Skogen sluttet allerede på 267, så alt dette er åpen fjellside med utsyn over Saltfjorden.",
      "Til slutt nordover opp toppflanken: hundremetersbeltet 900–1000 holder 21,3 grader i snitt og 22,9 som bratteste sammenhengende parti på linja. Kilden skriver «i grenseland til 30 grader de siste 50 høydemeterne», og det er fallinja den leser: sør for varden måler sveipet 32,8 grader i bratteste 60 m-vindu, 70–130 m ut. Varden står på 993 moh, med havet på tre kanter.",
    ],
    descent: [
      "Samme vei ned, med rom for østlige varianter som gir brattere kjøring i toppflanken — samme 30-gradersklassen, sier kilden. Fra flata i Stjerndalen gjelder faresonen igjen: kryss utløpsområdene kjapt og én om gangen på dager med markert fare.",
      "Ravika-ruta på nordøstsida er fullt beskrevet hos Fri Flyt — skogsveien fra den grønne garasjen, myrdragene langs Ravikelva, rampe til toppeggen — men nedfarten dens har et 40-gradersparti mellom 920 og 840 moh og skaret 300 m sørøst for toppen som inngang. Den er varianten, ikke normalveien, og den som velger den, har valgt en annen tur.",
      "Ned trappene bærer du skia igjen, og stien langs fjæra tar deg hjem til Horsdal — 38 høydemeter å gi tilbake har hele turen, så det meste av dagen er ren stigning og ren kjøring.",
      "Kilden gir nordøstsida egen adkomstbeskrivelse og egen parkering i Ravika, og sier rett ut at du kan velge å gå opp fra den sida. Det er 1018 høydemeter og 5,28 km: skogsveien sørvest langs vestsida av Ravikelva, myrene ved Hornkroken på 252 moh, punkt 385 og det slakere området sør for punkt 580 — og til slutt det ene snøfeltet som når helt opp på toppeggen. Bratteste steget måler 36,1 grader mellom 806 og 830 moh mot 32,5 på ruta fra Horsdal. Kilden oppgir 40 grader mellom 840 og 920 og legger til stegjern og isøks på hardt føre, innblåst snø i utsteget av rampa og skavler langs toppeggen.",
    ],
    avalanche: [
      {
        title: "Stjerndalen",
        body: "Kildens faremerknad gjelder dalen, ikke toppen: turen går i utløpssoner for skredflanker, spesielt vest- og sørvestflankene under Isvasstinden, og advarselen gjelder dager med markert skredfare og våren. Utløpssoner er flate — det er hele poenget med dem — og eneste verktøyet er tempo, avstand og å velge en annen dag når varselet sier det.",
      },
      {
        title: "Toppflanken og kantene",
        body: "De siste femti høydemeterne måler 22,9 grader som bratteste sammenhengende parti på linja, og kilden kaller dem «i grenseland til 30 grader»; linjas bratteste, 32,5, ligger nede i trappene. Men Sandhornet er et øyfjell med vegger: vestsida faller 59,0 grader på det bratteste bare 110–170 m fra varden, nordvestsida 59,9 og nordsida 61,8 grader 70–130 m ut. Mot havet er kanten absolutt; i skodde er sør hjemveien — linja peiler 189 grader de første femhundre meterne, og Horsdal ligger 200 grader fra varden.",
      },
      {
        title: "Før du går",
        body: "Sandhornet ligger i varslingsregionen Svartisen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre nordlandsturer, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L28,200 L49,197 L75,195 L98,196 L119,198 L141,198 L162,192 L177,184 L200,170 L222,163 L243,157 L270,152 L292,146 L313,138 L329,128 L351,119 L375,115 L397,108 L413,97 L437,89 L459,80 L483,70 L502,64 L524,59 L540,51 L561,40 L581,29 L600,18",
      startLabel: "10 moh",
      endLabel: "993 moh",
      distanceLabel: "5,0 km",
      caption: "1021 høydemeter og 5,01 km fra fjæra på Horsdal — trappene til Stjerndalen, slake rygger, og 32,5 grader i de siste femti høydemeterne.",
    },
  },
  tortenviktinden: {
    slug: "tortenviktinden",
    intro:
      "1023 høydemeter og 5,57 km fra Neset ved Flostrand til Tortenviktinden — fra havflata til tusen meter i én eneste linje, med hele Helgelandskysten under seg. Turen er lang heller enn bratt: bratteste hundremetersbeltet måler 18,6 grader mellom 900 og 1000 moh, og bratteste sammenhengende parti 23,7. Det er lengden og den ustabile kystsesongen som avgjør dagen.",
    ascent: [
      "Fra gården Neset ved Flostrand, 15 moh, på E12 kystriksvegen. Registeret setter Tortenviktinden i Lurøy, mens tilkomsten fra Flostrand ligger i Rana — fjellet og startstedet er i hver sin kommune. Visit Helgeland fører samme ruta med 5,2 km og 1 025 høydemeter én vei; linja måler 5,57 km og 1 023.",
      "Første kilometeren er nesten flat: beltet fra 0 til 100 moh måler 6,7 grader over 761 meter grunn og beltet fra 100 til 200 bare 4,5 over 1 233 meter. Skogen slutter på 152 moh etter Kartverkets klasser, med åpent område fra 158, og skoggrensa kommer 1,66 km ute. Fri Flyt sier «rett opp til du kommer over skogen i nord-nordvestlig retning», og det er den biten.",
      "Over skogen går linja vestover på rabbene, slik kilden sier. Beltene fra 200 til 500 moh ligger jevnt mellom 12,3 og 13,2 grader. Så kommer det flatere partiet den beskriver som «noe ulendt, med små bekkedaler på tvers av fjellet»: beltene fra 700 til 900 moh måler 10,4 og 8,8 grader over til sammen 1 170 meter grunn — det slakeste over skoggrensa, og det lengste. Det er her turen kjennes lang. Her ligger en klynge tjern på 785 til 792 moh, og linja går sør om hele klynga: 0 meter på vann, målt mot OSMs vannpolygon.",
      "«Herfra ser du ikke selve Tortenviktinden, men toppen ligger rett bak det høyeste punktet du ser», sier Fri Flyt. Bak det stiger den siste helninga: beltet fra 900 til 1000 moh måler 18,6 grader, det bratteste på turen, og det bratteste sammenhengende partiet ligger her — 23,7 grader mellom 971 og 994 moh, 5,39 km ute, altså under to hundre meter før varden. 1028 moh mot publiserte 1027.",
    ],
    descent: [
      "Ned samme ruta. Det bratteste du kjører er de 23,7 gradene rett under toppen, og så blir det slakere hele veien ut — noe som gjør at de siste kilometerne er staking mer enn kjøring.",
      "Nordsida skal du ikke bort i. Fra varden faller den 43,3 grader i snitt med 62,2 grader som bratteste 60 meter 80 til 140 meter ut, og nordvestsida 35,2 med 60,0 grader 230 til 290 meter ut. Ruta kommer opp fra sørøst, som måler 15,3 grader i snitt, og vestsida er 11,9 — kontrasten mellom de to sidene av denne toppen er det eneste du trenger å vite om den i dårlig sikt.",
      "Fri Flyt nevner at fjellet gir «mulighet for bratt rennekjøring», og Visit Helgeland fører en alternativrute på 4,3 km og 1 005 høydemeter med brattere oppstigning og mindre traversering. Ingen av dem er målt som egne ruter her.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ingen av kildene gir et bratthetsfelt, og Fri Flyt klassifiserer ikke turen etter KAST. Målinga fyller hullet: ingen hundremeter av linja holder mer enn 18,6 grader i snitt, og bratteste sammenhengende parti er 23,7 grader mellom 971 og 994 moh. Visit Helgeland graderer turen «Challenging, long», og det er lengden graden handler om — 5,57 km og tusen høydemeter fra havflata.",
      },
      {
        title: "Grøveldalen",
        body: "Fri Flyts eneste navngitte faremoment er et annet sted enn ruta: «Grøveldalen har høye og bratte sva på begge sider som kan løsne, særlig om våren.» Registeret fører Grøveldalen som botn 2,5 km sør for varden, og linja går ikke der. Advarselen står her fordi den er kildens egen og fordi dalen ligger i samme fjellsida — ikke fordi ruta berører den.",
      },
      {
        title: "Nordsida",
        body: "Fra varden faller nordsida 43,3 grader i snitt over de første 800 meterne, med 62,2 grader som bratteste 60 meter 80 til 140 meter ut; nordøst måler 33,3 med 68,3 grader 50 til 110 meter ut og nordvest 35,2 med 60,0 grader. Oppstigninga kommer fra sørøst på 15,3 grader. Visit Helgeland peker på at terrenget er «mostly free of trees», og på en topp der to sider skiller seg med tretti grader er det nettopp mangelen på holdepunkt som gjør forskjellen farlig.",
      },
      {
        title: "Før du går",
        body: "Tortenviktinden ligger i varslingsregionen Svartisen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder: Fri Flyt skriver at «den kystnære beliggenheten … gjør også at sesongen er ustabil med varierende snøforhold», og Visit Helgeland fører hovedruta som vintertur med alternativruta tilgjengelig etter påske. Kortets feb–mai er derfor redaksjonell. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,198 L48,191 L72,186 L96,182 L121,178 L144,178 L166,177 L190,173 L213,167 L232,159 L252,152 L271,145 L296,134 L321,127 L341,120 L359,112 L378,102 L397,91 L417,81 L441,73 L456,66 L475,63 L494,58 L516,55 L534,50 L554,42 L577,30 L596,19 L600,18",
      startLabel: "15 moh",
      endLabel: "1028 moh",
      distanceLabel: "5,6 km",
      caption: "1023 høydemeter og 5,57 km fra Neset, med det bratteste — 23,7 grader mellom 971 og 994 moh — i den siste helninga, knappe 200 meter før varden.",
    },
  },
  tomskjevelen: {
    slug: "tomskjevelen",
    intro:
      "951 høydemeter og 3,86 km fra åkeren ved Forsland — på en øy. Tomskjevelen står midt i havet på Tomma, med ferje fra Nesna som eneste vei til start, og Fri Flyt skriver at «mange regner Tomskjevelen som en av de absolutt fineste toppene på hele Helgelandskysten». Registeret skriver Tommskjevelen og har punktet sitt på vestknausen på 756 moh; selve toppen — 922 — ligger 330 m øst, og det er dit linja går. Sporet er snilt — bratteste hundremetersbeltet 21,8 grader mellom 800 og 900 moh, bratteste sammenhengende parti 27,9 — men fjellet omkring er det ikke, og sesongen er ustabil med varierende snøforhold, slik kilden selv sier.",
    ascent: [
      "Ta ferja fra Nesna til Tomma og kjør mot Forsland; Forslandsvegen ender ved gården, og du parkerer ved åkeren før Forslandsvatnet, slik kilden sier — jordet ved stistarten leser 47 moh. Sjekk rutetidene begge veier: ferja er en del av turen.",
      "Stien vestover er kartlagt og fører opp til høyden der Forslandsvatnet ligger, på 148 moh. Tjernet er naturlig, men det ligger lavt på en øy i havet, og isen kan ikke forutsettes: linja går rundt nordbredden på land — 161, 177 og 150 moh på pinnene — og passerer også nord for småtjerna og Tinnvatnet. Det er målt: 0 meter av linja står på vann.",
      "Fra myra nordvest for vatnet begynner den nordvestgående ryggen, slik kilden sier — helt til toppen. Ryggen er jevn: 283 ved foten, 492, 656, 768, 843 og 884 moh oppover, med det bratteste hundremetersbeltet — 21,8 grader i snitt — mellom 800 og 900. Falllinja i midtpartiet holder 32–33 grader; sporet sikksakker slakere.",
      "Varden står på 922 moh med hav på alle kanter — Atlanterhavet i vest, Svartisen i øst. Og alle kantene er ekte: fra toppen faller alle åtte sektorene 31 til 44 grader i snitt, med 69,4 grader som bratteste vindu mot nordøst. Toppen er et horn, og i skodde er ryggen du kom opp eneste veien hjem.",
    ],
    descent: [
      "Den normale nedkjøringa følger samme ruta som oppstigninga, slik kilden sier — ryggen ned, rundt vatnet på land, og stien til åkeren. 74 høydemeter å gi tilbake har turen samlet, det meste i småkuperingen rundt tjerna.",
      "Fri Flyt nevner også den østvendte nedkjøringa i søkket som samler snø — faktaboksen hans fører ingen himmelretning, og den målte peilinga ned ryggen leser 134 til 147 grader. Søkket er fjellets beste snølager og samtidig bratteste terreng: østsektoren faller 34,4 grader i snitt med 64,1 som bratteste vindu. Den som velger søkket, har valgt snøvurderingen som følger med.",
      "Husk ferja: den setter tidsrammen for dagen, og den går fra fjæra — hele nedkjøringa har havet som mål, og det er den eneste turen i appen der «helt ned» betyr helt ned til en ferjekai.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt publiserer verken KAST eller bratteste punkt for denne turen, og målinga får stå alene: 27,9 grader som bratteste sammenhengende parti, 21,8 som bratteste hundremetersbelte, mellom 800 og 900 moh. Falllinja i midtpartiet av ryggen holder 32–33 grader — sporvalget er slakere enn henget, og det skal det fortsette med å være.",
      },
      {
        title: "Hornet",
        body: "Fra varden faller alle åtte sektorene mellom 31 og 44 grader i snitt: nordøst 69,4 grader i bratteste vinduet, nord 63,7, øst 64,1, nordvest 61,4. Det finnes ingen slak utvei fra toppen annet enn ryggen du kom opp — i skodde er kompasskursen sørøst langs ryggen absolutt — linja peiler 134 til 147 grader ned.",
      },
      {
        title: "Havet og snøen",
        body: "Kilden skriver at «som andre kysttopper på Helgeland er sesongen ustabil og snøforholdene varierende» — i innledningen, ikke i faktaboksen, og den er hele klimahistorien: et 922-metersfjell omgitt av hav får snøen sin i byger og mister den i mildvær, og det østvendte søkket som samler snø, samler den av vinden — fokksnø over kystskare er den lokale kombinasjonen. Vurder snødekket fra ferja: du ser hele fjellet fra sjøen.",
      },
      {
        title: "Før du går",
        body: "Tomskjevelen ligger i varslingsregionen Helgeland, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre nordlandsturer, og guiden sier det. Ferja fra Nesna er eneste tilkomst — sjekk rutetidene. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L34,194 L58,183 L83,172 L111,176 L137,179 L146,178 L163,177 L184,173 L208,177 L240,178 L275,171 L292,163 L314,150 L341,142 L369,132 L387,123 L403,115 L423,107 L441,98 L456,89 L478,79 L496,71 L513,62 L531,50 L555,41 L576,30 L591,22 L600,18",
      startLabel: "45 moh",
      endLabel: "922 moh",
      distanceLabel: "3,9 km",
      caption: "951 høydemeter og 3,86 km fra Forsland på Tomma — rundt Forslandsvatnet på land, og den nordvestgående ryggen til hornet på 922.",
    },
  },
  lukttinden: {
    slug: "lukttinden",
    intro:
      "1129 høydemeter og 3,99 km fra gården på Kammen til Lukttinden — den største stigninga i denne runden, og et fjell ut.no kaller «av mange ansett som den flotteste og mest spektakulære toppen i Vefsn». Linja stiger usedvanlig jevnt: hvert hundremetersbelte fra 500 moh og opp ligger mellom 17,4 og 19,6 grader, og bratteste sammenhengende parti er 28,1 grader. Faren ligger i kantene og i hvilket alternativ du velger opp på ryggen.",
    ascent: [
      "Fra veienden ved gården på Kammen, 230 moh. Fri Flyt sier «Følg traktorveien videre fra parkeringen i omtrent 300-400 meter», og ut.no det samme: sporet starter på skogsveien ved gården. Beltet fra 200 til 300 moh måler 11,0 grader og beltet fra 300 til 400 like slakt over 586 meter grunn.",
      "Skogen slutter på 379 moh etter Kartverkets klasser, med åpent område fra 386, og skoggrensa kommer 0,82 km ute. Over den går linja inn i dalen mot bekken mellom Nordtinden og Lukttinden — ut.no setter den til «ca 400moh», og linja passerer der.",
      "Her deler kilden seg, og det er den viktigste avgjørelsen på fjellet. ut.no gir to veier opp på ryggen: alternativ 1 rett opp det bratte henget, «ganske bratt, med opptil 40 grader helning», og alternativ 2 videre inn i dalen mot sørøst og så «den noe mindre bratte ryggen opp til høyre, som er en vanlig rute sommerstid… opp i 30 grader». **Denne linja går alternativ 2.** Bratteste sammenhengende parti på hele turen ligger i det steget: 28,1 grader mellom 633 og 650 moh, 1,88 km ute — innenfor det ut.no oppgir for alternativ 2, og godt under de 40 gradene i alternativ 1. Den advarer selv om at alternativ 2 har «overhengende skavler med utløpsområde mot denne ryggen».",
      "Oppe på ryggen — ut.no sier «ca 720 moh» — er turen enkel og lang. Beltene fra 700 moh og opp måler 18,3, 18,2, 18,8, 18,1, 19,6 og 18,0 grader; det bratteste er 19,6 mellom 1100 og 1200 moh. ut.no beskriver den samme jevnheten: «Det er jevnt bratt oppover, mellom ca 20-30 grader.»",
      "Varden på 1348 moh. Det er ut.nos tall, ikke Fri Flyts — Fri Flyt oppgir 1342, og toppsøket løser 1347,8 på registerpunktet. ut.no nevner et siste bratt heng «på ca 35 grader for å nå toppen», som «ofte ganske isete»; den rutede linja finner ikke 35 grader noe sted, og det høyeste beltet, 1300 til 1400 moh, måler 18,5. Det er et reelt avvik mellom kilden og linja, og det står her fordi det gjelder de siste meterne.",
    ],
    descent: [
      "Ned samme ryggen. ut.no er tydelig på hva som er nedkjøringas poeng: «I de svakt konkave helningene som følger nesten hele fjellsiden nedover kan det samles mye fin snø. Siden er også nordvendt, som betyr at du kan være heldig og nyte puddersnø godt ut i juni.» Kortets aspekt er NV, målt fra linjas egen nedkjøring, og det stemmer med at sida er nordvendt.",
      "To kanter skal holdes unna. På vei opp: «Unngå å gå på kanten til høyre (SV), her er det stupbratt» — vestsveipen fra varden måler 32,2 grader i snitt med 38,8 grader som bratteste 60 meter 110 til 170 meter ut. Og på toppen: «Vær obs på skavlen som dannes på nordøstsiden av varden. Skavler bryter 45 grader i snøen og kan dra deg med selv om du står på fast grunn. Det er stup på begge sider.» Nordøstsveipen måler 19,8 grader i snitt — men 63,4 grader som bratteste 60 meter bare 60 til 120 meter ut. Snittet er det som lurer; kanten er det som gjelder.",
      "Den slakeste sektoren fra varden er sørvest med 9,7 grader og sør med 13,3 — men det er ikke veien hjem, og øst og sørøst faller 35,0 og 31,3 grader i snitt med 65,5 og 68,8 grader tett på varden.",
    ],
    avalanche: [
      {
        title: "Ruta og de to alternativene",
        body: "Fri Flyt gir ikke noe bratthetsfelt for denne turen og klassifiserer den ikke etter KAST; den sier bare at «Toppen av Lukttinden er ikke omkranset av bre og er dermed en teknisk enklere tur enn Okstindene.» ut.no er den strenge kilden, og den er utvetydig: «På grunn av bratthet bør den ikke gåes ved skredfare.» Korridoren her er lagt på dens alternativ 2, den slakere ryggen — bratteste sammenhengende parti måler 28,1 grader mellom 633 og 650 moh — og ikke på alternativ 1, som er dens eget inntegnede spor og «opptil 40 grader».",
      },
      {
        title: "Skavlen på varden",
        body: "«Vær obs på skavlen som dannes på nordøstsiden av varden. Skavler bryter 45 grader i snøen og kan dra deg med selv om du står på fast grunn. Det er stup på begge sider.» Det er ut.nos ord, og målinga står bak dem: nordøstsveipen holder 19,8 grader i snitt over 800 meter, men 63,4 grader i sine bratteste 60 meter, 60 til 120 meter fra varden. En skavl som bryter bakover tar med seg fast grunn, og et snitt på nitten grader sier ingenting om det.",
      },
      {
        title: "Isen på slutten",
        body: "ut.no beskriver et siste heng «på ca 35 grader for å nå toppen» og at det «ofte er ganske isete». Den rutede linja måler ikke 35 grader — det høyeste beltet, 1300 til 1400 moh, holder 18,5 grader, og bratteste sammenhengende parti på hele turen er 28,1 lenger nede. Avviket er notert heller enn bortforklart: kilden har gått fjellet og linja er regnet, og det siste stykket er der de to ikke er enige.",
      },
      {
        title: "Før du går",
        body: "Lukttinden ligger i varslingsregionen Helgeland, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen april–juni er ut.nos egen, og den fører turen som skitur; Fri Flyt har ikke sesongfelt for den. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,195 L42,192 L69,186 L89,180 L109,178 L136,172 L160,165 L177,160 L204,157 L217,157 L241,148 L265,141 L283,134 L305,124 L321,119 L346,110 L373,101 L393,93 L420,83 L447,74 L473,65 L495,57 L516,49 L535,41 L562,33 L579,26 L600,18",
      startLabel: "230 moh",
      endLabel: "1348 moh",
      distanceLabel: "4,0 km",
      caption: "1129 høydemeter og 3,99 km fra Kammen, med det bratteste — 28,1 grader mellom 633 og 650 moh — i steget opp på ryggen, 2,1 km før varden.",
    },
  },
  vassfjellet: {
    slug: "vassfjellet",
    intro:
      "560 høydemeter og 4,92 km fra Markavollen til varden på 711 moh — den nærmeste toppturen til Trondheim. Det bratte ligger samlet mellom 500 og 700 moh: 11,5 grader fra 500 til 600 og 12,3 fra 600 til 700, som er bratteste hundremeteren. Bratteste sammenhengende steg er 29,0 grader mellom 252 og 270 moh, og det er også det bratteste hele linja måler.",
    ascent: [
      "Start på parkeringa på Markavollen, 184 moh. Ut.no oppgir p-avgift, og terrengmodellen leser plassen til 184 moh — nøyaktig den starthøyda beskrivelsen oppgir. Ut.no sender deg langs skiløypene «merka S, deretter Ø og S igjen»; linja på kartet er terrenglinja gjennom det samme løypenettet og ikke løypa selv — 2205 av 4744 meter ligger mer enn 50 meter fra en kartlagt trasé, med største avvik 175 meter. Første halvdel er flat i en topptur å være: bandet fra 300 til 400 moh måler 5,2 grader over 1036 meter grunn, og 400 til 500 moh 3,2 grader over 1710.",
      "På 445 moh streifer linja kanten av Lomtjønna. Vassfjellhytta ligger på 507 moh, og rett etter den kommer stigninga: 11,5 grader fra 500 til 600 moh over 495 meter grunn, og linjas bratteste steg måler 29,0 grader mellom 252 og 270 moh. Skogen slipper taket på 586 moh, og fra 594 er terrenget åpent.",
      "Over skoggrensa holder det 12,3 grader fra 600 til 700 moh, og du treffer anleggsvegen ut.no sender deg inn på — Vassfjellvegen, som ligger 16 meter fra linja og går helt opp til Melhus hovedsender, kommunikasjonsmasta som står 131 meter fra varden på 709 moh. De siste metrene dreier linja nordover. Varden selv står på 711, og terrengmodellen måler den til 710,9.",
    ],
    descent: [
      "Ned samme veien. Første 200 meter fra varden peiler 255 grader — vest — ned til 676 moh, og 500 meter ned peiler 249. Det er flanken kortet fører: vestsida måler 12,0 grader i snitt over 400 meter med et 26,2 graders vindu 230 til 290 meter ut, og 12,3 grader i snitt når sveipet går ut til en kilometer.",
      "Ut.no advarer mot «diverse brattheng både under og over tregrensa», og sveipet sier hvor de er. Nordvest har det bratteste enkeltvinduet: 33,3 grader 190 til 250 meter ut, mot et snitt på 13,8. Sørøst er den jevnest bratte sida med 13,9 grader i snitt og 26,7 i bratteste vindu, og vest måler 12,0 og 26,2. Nordøst, mot heisene, måler 3,9 — men det du kommer ned i der er alpinbakken i Vassfjellet skisenter, ikke fjellet.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "541 høydemeter der bandene under 500 moh måler 3,2 og 5,2 grader, og bandet fra 500 til 600 måler 11,5 over 495 meter grunn. Bratteste punkt på hele den routede linja er 29,0 grader, mellom 252 og 270 moh, og ruta gir tilbake 33 høydemeter på 4,92 km. Det er en løypetur med ett bratt parti i, ikke en flankeoppstigning. Den routede linja stiger 541 høydemeter over 4,74 km, mot ut.nos oppgitte 526 og 6,7 km: høydemeterne stemmer, kilometerne ikke. Løypa svinger seg sørover, østover og sørover igjen, og linja på kartet tar den korteste veien gjennom de samme punktene.",
      },
      {
        title: "Terrenget utenfor",
        body: "Fjellet har bratte sider; de ligger bare ikke der løypa går. Innafor 400 meter av varden måler nordvest 33,3 grader i bratteste 60-metersvindu, sørøst 26,7 og vest 26,2. Det er høyt og bratt nok til at et enkeltheng kan løsne, og det er akkurat de linjene som frister når du står på toppen med skiene på.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sør-Trøndelag på varsom.no. Sør-Trøndelag er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,192 L46,185 L66,177 L93,167 L115,165 L137,153 L165,146 L192,140 L214,133 L238,134 L260,123 L280,111 L307,109 L329,110 L354,102 L373,95 L396,95 L422,91 L449,93 L472,91 L494,77 L515,63 L537,49 L563,37 L581,22 L600,18",
      startLabel: "184 moh",
      endLabel: "711 moh",
      distanceLabel: "4,9 km",
      caption: "541 høydemeter og 4,74 km fra Markavollen forbi Vassfjellhytta på 507 moh, med skogen som slipper taket på 586 og åpent terreng fra 594 moh.",
    },
  },
  krakfjellet: {
    slug: "krakfjellet",
    intro:
      "471 høydemeter og 9,60 km fra Håen til kommunetoppen i Trondheim. Det er en lang, slak dag: bandet fra 400 til 500 moh måler 1,2 grader over 4505 meter grunn, og det bratteste stedet på hele linja er 16,1 grader mellom 467 og 480 moh.",
    ascent: [
      "Start på parkeringa ved Håen, 411 moh — bomvei fra Lundamo, og normalt brøytet de 18 kilometerne inn. Her slutter brøytinga, men ikke veien: Lundadalsvegen fortsetter ubrøytet 2,6 kilometer østover langs nordsida av vatnet, og det er den skogsbilvegen ut.no sender deg langs — «skogsbilveien eller strandlinja N på Håen rett Ø». Linja på kartet følger veien.",
      "Grunnen til at den gjør det står i vatnet ved sida av. Vannflata på Håen måler 433 moh og er klassifisert som regulert innsjø: magasinet tappes ned hver vinter, parkeringa ligger 22 meter under full vannflate, og ut.no ber deg holde deg unna usikker is langs kanten. Veien ligger på land hele veien, fra 411 moh ved bilen til 435 ved østenden.",
      "Etter knapt tre kilometer kommer du til Kråklivollen, 452 moh, der veien slutter og ruta går opp i skogen, opp Kråklia og vest for Samsjølia. Skogen slipper taket på 570 moh, og fra 574 er du i åpent terreng. Bandet fra 400 til 500 moh måler 1,2 grader over 4505 meter grunn — det er avstanden, ikke stigninga, som er turen her.",
      "Rundtjønnin ligger på 526 moh, og det er kontrollmålet på at ruta ligger der beskrivelsen sier: ut.no oppgir 525. Videre nord og nordøst følger du rygger eller søkk i samme retning, avhengig av snø og føre, til ruta dreier mot nord og nordvest opp mot toppen. Bandene over Rundtjønnin måler 2,4, 3,6, 6,0 og 5,7 grader, og det siste av dem dekker bare 149 meter grunn.",
      "Varden står på 815 moh. Kråkfjellet ble kommunetopp i Trondheim etter sammenslåinga med Klæbu, og publiserte tall sier 817; terrengmodellen leser 814,9 på det høyeste punktet, og kortet fører målinga.",
    ],
    descent: [
      "Ned samme veien. Første 200 meter fra toppen peiler 202 grader, ned til 792 moh, og 500 meter ned peiler 199. Parkeringa ligger 7,4 km unna, på peiling 225 grader, så det meste av nedturen er å gå, ikke å kjøre — og de siste tre kilometerne er skogsbilvegen tilbake.",
      "Sveipet finner ingen bratt side på dette fjellet: bratteste 60-metersvindu i noen retning er 21,8 grader mot øst, i vinduet 260 til 320 meter ut, nordøst måler 13,1 grader i snitt og nord 2,0. Det ut.no advarer mot er noe annet enn skred — «høye skavler i le-retningen» som du kan falle ned fra i dårlig lys når du krysser ryggene i området.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ni og en halv kilometer der bandene måler 1,2, 2,4, 3,6, 6,0 og 5,7 grader, og bratteste sammenhengende steg er 16,1 grader mellom 467 og 480 moh. Ruta gir tilbake 67 høydemeter og stiger 468 mot ut.nos oppgitte 519 og «ca 140» tapte. Resten av forskjellen ligger i linjevalget mellom ryggene, som beskrivelsen selv overlater til snøen og føret.",
      },
      {
        title: "Terrenget utenfor",
        body: "Bratteste måling rundt toppen er 21,8 grader mot øst. Nord er nesten flatt, 2,0 grader i snitt over 400 meter. De to tingene som kan gå galt her er derfor ikke skred i seg selv: skavlene ut.no beskriver, som er et fallproblem i dårlig lys, og isen på Håen, som er regulert og tappes ned hver vinter. Ruta er lagt på skogsbilvegen og ikke ut på magasinet, men strandlinja ligger hele tida rett ved sida av linja.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sør-Trøndelag på varsom.no. Sør-Trøndelag er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,196 L45,187 L70,184 L90,187 L113,187 L134,186 L155,189 L174,190 L197,183 L215,182 L235,182 L256,175 L279,162 L304,155 L326,149 L346,148 L371,146 L391,142 L416,122 L439,114 L464,103 L490,98 L515,82 L537,67 L563,53 L582,33 L600,18",
      startLabel: "411 moh",
      endLabel: "815 moh",
      distanceLabel: "9,6 km",
      caption: "471 høydemeter og 9,60 km fra Håen om Kråklivollen på 452 moh og Rundtjønnin på 526, med de siste 149 meterne grunn over 800 moh.",
    },
  },
  rensfjellet: {
    slug: "rensfjellet",
    intro:
      "699 høydemeter og 11,33 km fra Håen til Melhus' høyeste punkt, med 168 av høydemeterne gitt tilbake underveis. Stigninga kommer sist: bratteste hundremetersband er 11,6 grader fra 700 til 800 moh, og bratteste sammenhengende steg 27,9 grader mellom 661 og 679.",
    ascent: [
      "Start på parkeringa ved Håen, 411 moh — de samme tre første kilometerne som Kråkfjellet. Brøytinga slutter ved bilen, men Lundadalsvegen gjør det ikke: den fortsetter ubrøytet 2,6 kilometer østover langs nordsida av vatnet, og linja følger den. Vassflata på Håen ligger på 433 moh, magasinet tappes ned hver vinter, og ut.no ber deg holde deg unna usikker is langs kanten.",
      "Kråklivollen ligger på 452 moh, der veien slutter. Videre opp Kråklia og vest for Samsjølia, forbi Rundtjønnin på 526 moh. Ut.no oppgir 525 for dette vatnet og terrengmodellen leser 526 — det er kontrollen på at korridoren følger den beskrevne løypa. Bandene hit måler 1,2 og 1,4 grader, over 4460 og 4096 meter grunn.",
      "Så krysser ruta Oksdalen på 532 moh. Punktet er ikke navngitt i noen kilde: dalen er registrert med representasjonspunkt 3,95 km unna på peiling 15, altså nord-nordøst, og kryssinga er lest ut av terrengmodellen som lavlinja sørover derfra. Skogen slipper taket på 562 moh, og fra 569 er du i åpent terreng.",
      "Etter Oksdalen begynner de siste fire kilometerne. Bandet fra 600 til 700 moh måler 6,1 grader, og det er her det bratteste sammenhengende steget ligger — 27,9 grader mellom 661 og 679 moh. Videre måler 700 til 800 moh 11,6 grader over 495 meter grunn, og så slakner det til 5,7 og 6,5 mot varden på 942 moh. Rensfjellet er grensetopp mellom Melhus, Midtre Gauldal og Selbu; ut.no noterer at den «mangler bare 2,1 km mot N-NV på å inkludere også Trondheim i den klubben».",
    ],
    descent: [
      "Ned samme veien, vestover: første 200 meter fra toppen peiler 253 grader ned til 920 moh, og 500 meter ned 254. Parkeringa ligger 10,2 km unna, på peiling 254 grader. Ut.no gir ett alternativ — å styre ned mot Samsjøen etter Oksdalen — og setter to betingelser: at føret utenfor oppkjørte løyper er godt, eller at du har et spor å gå i.",
      "Sveipet finner ingen bratt side innafor 400 meter av varden: øst måler 11,0 grader i snitt med 17,8 i bratteste vindu, sørøst 3,4 og nordvest 2,5. Ut.nos «bratte enkeltheng som er høye nok til at det kan gå skred» ligger lenger ute enn sveipet rekker, og beskrivelsen sier selv at de er mulige å unngå.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Elleve kilometer der de to lange bandene måler 1,2 og 1,4 grader over drøye fire kilometer hver, og all stigninga ligger i de siste fire. Bratteste sammenhengende steg er 27,9 grader mellom 661 og 679 moh, bratteste hundremetersband 11,6 fra 700 til 800. Ruta gir tilbake 168 høydemeter mot ut.nos oppgitte «ca 130» — det er den samme terrengformen, rygger og søkk som må krysses.",
      },
      {
        title: "Terrenget utenfor",
        body: "Innafor 400 meter av varden er bratteste måling 17,8 grader mot øst. Det som gjør turen krevende er lengden og orienteringa: elleve kilometer over myr, skogsveg og rygger, 168 høydemeter gitt tilbake på veien inn og de samme igjen på veien ut. Ut.no advarer om skavler i le-retningen, som er et fallproblem i dårlig lys, og om enkeltheng som finnes, men kan omgås. Nede ved starten er det isen på det nedtappede magasinet som er faren, og ruta er lagt på skogsbilvegen for å holde seg unna den.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sør-Trøndelag på varsom.no. Sør-Trøndelag er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,196 L44,192 L64,188 L86,190 L110,191 L131,191 L150,192 L171,187 L196,186 L220,175 L243,168 L267,161 L291,161 L313,159 L336,160 L360,158 L382,151 L403,155 L425,159 L446,146 L468,128 L489,114 L510,91 L534,65 L556,56 L577,37 L599,19 L600,18",
      startLabel: "411 moh",
      endLabel: "942 moh",
      distanceLabel: "11,3 km",
      caption: "699 høydemeter og 11,33 km fra Håen om Kråklivollen på 452 moh, Rundtjønnin på 526 og krysset av Oksdalen på 532, med skogen som slipper taket på 562 moh.",
    },
  },
  snota: {
    slug: "snota",
    intro:
      "1268 høydemeter og 10,22 km fra Gråhaugen til det høyeste fjellet nord i Trollheimen. Ruta går i skredterreng fra Litj-Snota og opp, krysser 404 meter bre mellom 1364 og 1463 moh, og toppflanken faller 48,1 grader mot øst.",
    ascent: [
      "Start på parkeringa ved dammen på Gråsjøen, 495 moh — 15 km bomveg opp Folldalsvegen, betaling med kort. Følg vegtraséen langs vatnet til sommerstien skrår opp lia, og ikke tidligere: ut.no advarer om at det kan gå skred fra fonna på Gråhaugfjellet, og at de enkelte år går helt ut på vatnet.",
      "Opp lia sør–sørvest, gjennom 686 moh, med bandene 10,3, 6,3 og 7,0 grader. Så flater det ut på platået øst for Midtveggen, 931 moh: bandet fra 800 til 900 moh måler 3,2 grader over 1979 meter grunn, og 900 til 1000 måler 2,2 over 2250. Her gir ruta tilbake høyde, fra 931 ned til Svartvatnet på 888 moh — ut.no fører «ca 100» tapte høydemeter opp, og den routede linja gir tilbake 95.",
      "Fra Svartvatnet kommer du til foten av Litj-Snota og runder den i øst, 1026 moh — de siste 90 metrene inn dit går over et lite unavngitt vatn på 1024. Herfra og opp er du i utløpsområder og i kortere partier i løsneområder over 30 grader, som ut.no skriver at det ikke er mulig å omgå. Bandene stiger til 7,1, 15,7 og 15,3 grader.",
      "På 1352 moh flater det ut, og den bratte bakken rett imot i vest er breen. Kartverket klasser elleve punkter på linja som breterreng, fra 1364 til 1463 moh, og strekket måler 404 meter — med to bare punkter på 1414 og 1421 moh midt i, der isen er brutt. Punktene rett før og etter, 1369 og 1471 moh, er åpent område. Ut.no oppgir «fra ca 1380 moh ... i ca 500 m» og ber deg sjekke med lokalkjente at det er nok snø. Bratteste sammenhengende steg på hele turen ligger her: 35,2 grader mellom 1413 og 1436 moh.",
      "Over breen, på 1516 moh, kommer du opp på toppflanken, og ruta dreier sørvest, sør og til slutt sør–sørøst til toppunktet på 1668 moh.",
    ],
    descent: [
      "Ned samme sporet — ut.no kaller det det beste valget i de fleste tilfeller, og legger til at faren for våte løssnøskred øker utover dagen på varme vårdager. Første 200 meter fra toppen peiler 320 grader, altså nordvest, ned til 1653 moh, og 500 meter ned 328: ruta går tilbake langs toppflanken før den faller østover ned breen. Parkeringa ligger 8,0 km unna, på peiling 13 grader.",
      "Det er verdt å vite hvorfor det første trekket går nordvest. Øst fra toppunktet måler 48,1 grader i snitt over 400 meter med et 57,9 graders vindu 130 til 190 meter ut — det er «toppflanken er stupbratt mot Ø» i tall. Sør og sørøst måler 42,0 og 36,5 i snitt, med vindu på 71,4 og 71,0 grader bare 10 til 70 meter ut, og nordøst 42,0 med 64,2. Vest og nordvest, der ruta kommer opp og går ned, måler 14,8 og 9,4.",
      "Den andre ruta kommer fra øst, fra Trollheimshytta: 1320 høydemeter på 11,36 km, over bruene på Slettåa og Folda, forbi Bossvasshøgda på 811 moh og opp i botnen vest for den. Ved 993 moh kommer den inn på den samme vinterruta fra Gråhaugen som resten av dette kortet beskriver, og derfra deler de to hylla under Litj-Snota, breen og toppflanken. Kilden er den samme forfatteren, og advarselen står uendret: ruta går i skredterreng, «både løsneområder over 30 grader bratt og utløpsområder som det ikke er mulig å omgå», og toppflanken er stupbratt mot øst. Linja fra Trollheimshytta gir fra seg 185 høydemeter underveis mot 95 fra Gråhaugen, og bratteste steget måler 35,3 grader mellom 1490 og 1514 moh.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "1268 høydemeter og 10,22 km, med 95 gitt tilbake. Ut.no fører ruta som skredterreng — «både løsneområder over 30 grader bratt og utløpsområder som det ikke er mulig å omgå» — og terrengklassen som KAST 2, utfordrende. Bratteste hundremetersband på den routede linja er 15,7 grader fra 1100 til 1200 moh og bratteste steg 35,2 grader mellom 1413 og 1436, men de tallene beskriver skisporet, ikke sidene det går under.",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppflanken mot øst måler 48,1 grader i snitt med 57,9 i bratteste vindu, og sør og sørøst har vindu på 71,4 og 71,0 grader bare 10 til 70 meter ut fra toppunktet. Den andre er fonna på Gråhaugfjellet, nede ved starten: ut.no skriver at skred derfra enkelte år går helt ut på vatnet, og at turen ikke bør gås ved fare for store, naturlig utløste skred i østlige heng.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen. Breen mellom 1364 og 1463 moh krever nok snø, og ut.no ber deg sjekke med lokalkjente på forhånd. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,191 L46,180 L69,174 L90,169 L113,162 L137,154 L161,145 L182,136 L203,132 L224,133 L246,132 L267,133 L293,139 L317,139 L340,139 L364,137 L386,124 L409,117 L431,112 L449,98 L470,84 L486,71 L510,65 L531,51 L552,41 L573,27 L597,19 L600,18",
      startLabel: "495 moh",
      endLabel: "1668 moh",
      distanceLabel: "10,2 km",
      caption: "1268 høydemeter og 10,22 km fra Gråhaugen om platået øst for Midtveggen på 931 moh, Svartvatnet på 888 og flata på 1352, med breen fra 1364 til 1463 moh.",
    },
  },
  storbekkhoa: {
    slug: "storbekkhoa",
    intro:
      "897 høydemeter og 5,92 km fra Storli til varden på 1504 moh. Oppstigninga er slak — bratteste hundremetersband er 15,8 grader — og sørøstveggen rett ved toppen er ikke: den måler 34,1 grader i snitt med et 46,9 graders vindu 20 til 80 meter ut fra varden.",
    ascent: [
      "Start på parkeringa ved Storli, 623 moh — avgiftsbelagt, 30 kroner i kassa, og taggd for ski. Ut.no: «Fra Storli parkering spenner du på deg skia ved bilen.» Gå rett nordover mot Storbekkdalen gjennom bjørkelia. Her spriker kildene: ut.no legger ruta på høgresida av Veslebekken, mens Fri Flyt skriver at ruta følger Storbekken nordover fra Storli gjennom bjørkeskogen. Linja følger den oppmerkede stien, som gjør litt av begge deler — den krysser Veslebekken nede i bjørkelia og ligger 7 til 967 meter fra Storbekken på veg opp dalen. Bandet fra 700 til 800 moh er det bratteste på hele turen, 15,8 grader over 360 meter grunn, og det bratteste sammenhengende steget på linja ligger like under: 25,8 grader mellom 661 og 683 moh.",
      "Skogen slipper taket på 912 moh, og fra 915 er du i åpent terreng og myr. Linja krysser Storbekken første gang alt på 644 moh, og fletter seg så over bekken åtte ganger til der den slynger seg over den flate dalbotnen mellom 968 og 997 moh — bandet fra 900 til 1000 måler 3,4 grader over 1703 meter grunn. Det er her ruta legger seg vestover opp mot ryggen.",
      "Ryggen vest for bekken ligger på 1211 moh, og bandet fra 1000 til 1100 moh opp mot den måler 12,6 grader. Videre nordover langs ryggen til den bratte sørøstveggen står rett imot deg — da går du et stykke lenger vest og opp gjennom skaret på 1313 moh.",
      "Fra skaret følger ruta det slake terrenget i en halvsirkel til varden på 1504 moh, der kassa med gjesteboka står. Bandene her måler 9,7 og 15,7 grader. Kildene er uenige om høydemeterne — Fri Flyt oppgir 600, ut.no 900 — og den routede linja stiger 893 fra en parkering terrengmodellen leser til 623 moh. Fri Flyts egen GPS-posisjon for toppunktet lander 27 meter fra det punktet summitsøket klatrer til.",
    ],
    descent: [
      "Ned samme veien, og de første metrene går vestover, ikke mot bilen: første 200 meter fra varden peiler 276 grader, ned til 1458 moh, og 500 meter ned 236. Parkeringa ligger 4,2 km unna, på peiling 170 grader. Halvsirkelen må gås ferdig før ruta snur sørover, og i dårlig sikt er det den detaljen som betyr noe her.",
      "Sørøstveggen er den Fri Flyt advarer mot, og sveipet bekrefter den: 34,1 grader i snitt over 400 meter med et 46,9 graders vindu 20 til 80 meter ut fra varden. Sør måler 25,5 med samme 46,9 i vinduet 30 til 90 meter, og øst 24,9 med 35,5. Nordvest — der ruta kommer opp — måler 3,7 grader i snitt, med 7,7 som bratteste vindu.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "897 høydemeter der bratteste hundremetersband er 15,8 grader, fra 700 til 800 moh, og bratteste sammenhengende steg 25,8 grader mellom 661 og 683. Fri Flyt skriver at hele oppstigninga går i terreng under 30 grader og fører turen som KAST 1. Ruta gir tilbake 16 høydemeter på 5,92 km.",
      },
      {
        title: "Terrenget utenfor",
        body: "Fri Flyt fører ett utløpsområde og «den bratte sørøstsiden av toppen. Her kan det være skumle skavler.» Sveipet måler den sida til 34,1 grader i snitt og 46,9 i bratteste vindu 20 til 80 meter ut, og sørsida til 25,5 med samme 46,9 i vinduet 30 til 90. Nedkjøring mot Storbekkdalen er brattere enn oppstigninga, og Fri Flyt kaller det skredfarlig terreng.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,194 L46,182 L65,171 L90,157 L109,146 L132,140 L164,132 L190,129 L214,125 L237,124 L260,123 L291,122 L318,115 L336,102 L351,93 L374,86 L397,82 L421,79 L439,78 L465,76 L497,63 L519,57 L538,53 L559,41 L579,27 L600,18",
      startLabel: "623 moh",
      endLabel: "1504 moh",
      distanceLabel: "5,9 km",
      caption: "897 høydemeter og 5,92 km fra Storli opp Storbekkdalen på 1000 moh, over ryggen vest for Storbekken på 1211 og gjennom skaret på 1313 moh.",
    },
  },
  okla: {
    slug: "okla",
    intro:
      "1025 høydemeter og 5,99 km fra Dalen i Storlidalen til Snydda, 1582 moh — toppunktet på Okla-massivet, der varden og turboka står. Bratteste hundremetersband er 19,8 grader fra 700 til 800 moh, og bratteste steg 26,1 grader mellom 1481 og 1499. Nordsida er en annen sak: 44,7 grader i snitt mot nordvest.",
    ascent: [
      "Start på parkeringa i Dalen, 599 moh — avgiftsbelagt og taggd for ski, nede ved Storlidalsvegen. Fri Flyt beskriver den samme starten som «brua mellom Dalsvatnet og Ångårdsvatnet»; brua ligger 300 meter unna. Opp går det med en gang: 11,8 grader fra 600 til 700 moh og 19,8 fra 700 til 800, gjennom bjørkeskogen som slipper taket på 961 moh.",
      "Videre slakt på skrå oppover mot Korgtjønna, 1151 moh. Bandene måler 15,3 og 12,8 grader, og bandet fra 1000 til 1100 moh måler 15,1 grader over 405 meter grunn.",
      "Fra Korgtjønna flater det ut — 3,4 grader fra 1100 til 1200 moh over 1800 meter grunn — og ruta dreier vestover. Linja går over selve tjønna, 720 meter på 1151 moh; det er dit ut.no sender deg, men det er et vatn, og det skal vurderes som et vatn.",
      "Så runder du Mjølkskåla. Ut.no sier det presist — «rund eggen med vatnet Mjølkskåla under deg» — og linja gjør det: over skuldra øst for vatnet på 1275 moh, videre over eggen nord for det på 1290, og opp mot 1324 moh før siste stigning. Vatnet ligger på 1277 moh og blir liggende under deg.",
      "Siste stigning måler 19,5 grader fra 1400 til 1500 moh og 17,0 videre, med et steg på 26,1 grader mellom 1481 og 1499 moh. Toppen heter Snydda i place-navneregisteret og måler 1582,3 moh; ut.no publiserer 1580 og Fri Flyt 1564, og kortet fører målinga. Punktet som er registrert som Okla ligger 2,4 km rett vest, på peiling 267, og er 1458,8 moh — fjellet heter Okla, men varden står på Snydda.",
    ],
    descent: [
      "Ned samme veien, og første trekk fra varden går østover langs ryggen, ikke ned: første 200 meter peiler 73 grader ned til 1510 moh, og 500 meter ned 71. Parkeringa ligger 3,4 km unna, på peiling 167 grader.",
      "Grunnen til at det trekket betyr noe er nordsida. Nordvest måler 44,7 grader i snitt over 400 meter med et 57,1 graders vindu 200 til 260 meter ut, og nord 43,6 med 50,9. Det er der Fri Flyts alternative nedkjøring mot Gjevilvatnet går, og de kaller den «svært bratt og seriøst» — den ender dessuten langt fra bilen. Sørvest, langs Okla-ryggen, måler 3,4 grader i snitt: det er det flate topplatået beskrivelsene omtaler, og i dårlig sikt er det navigeringa som er problemet.",
      "Sørsida er den kortet fører, og den er ikke slak heller: sør måler 27,4 grader i snitt med 34,0 i bratteste vindu, sørøst 33,1 med 39,4. Fri Flyt om oppstigningssida: «Dette er en side der det legger seg mye snø, så vurdér skredfaren nøye», og om bekkedalen langs Sandbekken at den «bør bare kjøres under svært stabile forhold».",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "1025 høydemeter der bratteste hundremetersband er 19,8 grader fra 700 til 800 moh og bratteste sammenhengende steg 26,1 grader mellom 1481 og 1499. Ruta gir tilbake 41 høydemeter. Fri Flyt skriver at Okla ikke er en bratt topptur, og terrengmålinga er enig — det er snømengden på sørsida, ikke vinkelen, som er problemet her.",
      },
      {
        title: "Terrenget utenfor",
        body: "Sørsida, som er både oppstigning og nedkjøring, måler 27,4 grader i snitt med 34,0 i bratteste vindu, og sørøst 33,1 med 39,4 — nok til at det løsner, og Fri Flyt sier selv at det legger seg mye snø her. Nord og nordvest er en helt annen kant av fjellet: 43,6 og 44,7 grader i snitt, med vindu på 50,9 og 57,1, og du ender ved Gjevilvatnet i stedet for ved bilen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,194 L43,186 L58,176 L81,161 L99,153 L117,142 L138,133 L157,126 L177,117 L193,108 L216,97 L237,91 L258,94 L275,98 L302,98 L327,98 L351,97 L373,89 L392,79 L410,76 L432,74 L455,73 L473,72 L495,71 L518,65 L540,56 L552,48 L566,37 L585,24 L600,18",
      startLabel: "598 moh",
      endLabel: "1582 moh",
      distanceLabel: "6,0 km",
      caption: "1025 høydemeter og 5,99 km fra Dalen om Korgtjønna på 1151 moh og eggen nord for Mjølkskåla på 1290, med skogen som slipper taket på 961 moh.",
    },
  },
  storhornet: {
    slug: "storhornet",
    intro:
      "936 høydemeter og 5,01 km på den merkede vinterløypa fra Bree til steinbua på 1589 moh. Jevn er ordet, og målinga er enig: ingen hundremetersband måler mer enn 13,1 grader, bratteste sammenhengende steg er 20,5 grader mellom 1463 og 1480 moh, og ruta gir ikke tilbake en eneste høydemeter. Det bratte på fjellet ligger på nordøstsida, bak toppen.",
    ascent: [
      "Start på den avgiftsbelagte parkeringa ved Bree, 653 moh — ti plasser, taggd for både ski og fottur, og Fri Flyt sender deg dit med «følg veien som går til venstre etter butikken og kjør ca 1,3 kilometer». Herfra og til varden følger linja den kartlagte vinterløypa, en sammenhengende skitour-trasé på 5,13 km som ender 25 meter fra toppunktet; største avvik mellom linja og løypa er 166 meter.",
      "Løypa er hogd ut gjennom skogen og svinger seg opp gjennom hyttefeltet i Hornlia — 113 hytter ligger innafor 300 meter av linja. Bandene måler 8,6 og 9,9 grader fra 600 til 800 moh. Skogen slipper taket på 921 moh, og fra 931 er du på åpent fjell.",
      "Over tregrensa fortsetter løypa mot nordvest, og den holder kursen resten av veien. Bandene måler 12,4, 11,4, 9,6, 10,7, 11,8 og 9,6 grader oppover, og det bratteste av dem alle er 13,1 grader fra 1400 til 1500 moh, over 465 meter grunn. Det bratteste sammenhengende steget på hele turen ligger også her: 20,5 grader mellom 1463 og 1480 moh. Det er en stigning uten kneiker.",
      "På 1589 moh står steinbua fra 1946, med gjestebok. Dette er den best kontrollerte toppen i runden: terrengmodellen gir 1589,0 moh mot publiserte 1589, og Fri Flyts egen GPS-posisjon for toppunktet lander 10 meter fra det punktet. Linja stiger 936 høydemeter mot ut.nos oppgitte 928 og Fri Flyts 900, og måler 4,84 km mot ut.nos 5,2 og Fri Flyts 5,3.",
    ],
    descent: [
      "Ned samme veien — det er linja Fri Flyt anbefaler. Første 200 meter fra bua peiler 153 grader, ned til 1567 moh, og 500 meter ned 145. Parkeringa ligger 4,7 km unna, på peiling 135 grader, så nedkjøringa følger oppstigninga hele veien.",
      "Det bratte på dette fjellet ligger bak deg når du står ved bua. Nordøst måler 30,7 grader i snitt over 400 meter, med et 46,2 graders vindu bare 10 til 70 meter ut; nord 22,2 med 37,7 i vinduet 20 til 80, og øst 23,1 med 34,4. Sør og sørvest, der løypa kommer opp, måler 6,0 og 0,4 grader i snitt.",
      "Fri Flyts eget faremoment peker sørover: «Hvis du velger å oppsøke det bratte terrenget rundt Omnråa sør for toppen må du ta hensyn til både eksponert terreng og skredfare.» Det er en reell advarsel, og den ligger lenger ute enn du ser fra bua. Sørover er det platå i halvannen kilometer — under ti grader hele veien — og så bryter terrenget av: fra rundt 1490 meter ut måler 60-metersvinduene 37 til 40 grader, det bratteste 39,7 grader 1610 til 1670 meter ut, og enkelttrinn på ti meter går opp i 48. Ved to kilometer har du mistet 339 høydemeter. Det er kanten over Omnråa, og den er ikke slak — den er bare langt unna. Kanten du kan gå ut på uten å ha gått langt, er nordøst.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "936 høydemeter der ingen del av den routede linja måler mer enn 20,5 grader, og bratteste hundremetersband er 13,1 fra 1400 til 1500 moh. Fri Flyt fører bratteste punkt som under 25 grader og klassifiserer turen som KAST 1, enkelt. Ruta gir ikke tilbake en høydemeter på 4,84 km — den stiger uavbrutt fra bilen til bua, på en trasé som er kartlagt som vinterløype hele veien.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nordøstsida er den som teller der du står: 30,7 grader i snitt over 400 meter og 46,2 grader i vinduet 10 til 70 meter ut fra toppen, med nord på 22,2 og øst på 23,1. Sørsida, som Fri Flyt navngir i faremomentet sitt, måler 6,0 grader i snitt de første 400 meterne — men den er ikke ufarlig, den er bare langt unna: fra rundt 1490 meter ut faller den 37 til 40 grader ned mot botnen Omnråa. To ulike ting, og det er nordøst som ligger ved bua.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen, så her finnes det en vurdering å lese. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,195 L43,190 L64,183 L83,178 L108,171 L129,162 L151,156 L173,148 L199,139 L221,132 L244,126 L264,120 L290,113 L312,106 L334,101 L355,93 L377,84 L393,79 L420,71 L447,67 L469,59 L490,53 L510,46 L528,37 L550,29 L571,22 L593,19 L600,18",
      startLabel: "653 moh",
      endLabel: "1589 moh",
      distanceLabel: "5,0 km",
      caption: "936 høydemeter og 4,84 km på den kartlagte vinterløypa fra Bree gjennom hyttefeltet i Hornlia, med skogen som slipper taket på 921 moh og åpent fjell fra 931.",
    },
  },
  kirketaket: {
    slug: "kirketaket",
    intro:
      "Norges kanskje mest populære topptur — bred rygg, oversiktlige linjevalg og lang sesong. En tur som gir mye fjell for pengene, både for førstegangsturen og for hundredegangen.",
    ascent: [
      "Fra parkeringen på Hellerøra (Øvre Kavli), 185 moh, følger du bomveien nordover den første kilometeren, til den krysser Heiaelva. Rundt svingen og videre inn på sporet mot Kavlisetra og Måsvassbu.",
      "Ved rundt 420 moh forlater du Måsvassbu-sporet og går nordøst opp gjennom åpen bjørkeskog. Skogen slipper taket på 632 moh, og derfra er det åpent terreng resten av veien. Målet er Vesttoppen på Steinberget, 766 moh.",
      "Fra Vesttoppen følger du kammen østover til Steinberget, 981 moh. Ryggen henger sammen og stiger jevnt, men rett nord for Steinberget faller den 19 meter i et søkk før den reiser seg igjen. De 19 meterne må du opp igjen på vei tilbake — de er med i turens 1277 høydemeter.",
      "Herfra går sørvestryggen nord-nordøstover mot toppen. Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1400 og 1500 moh og holder 22,1° i snitt; sjiktet under, 1300 til 1400 moh, måler 20,5°. Det bratteste enkelttrinnet ligger i det samme høydelaget, mellom 1411 og 1433 moh, og måler 30,3°. Skavler henger ut på både øst- og vestsida av toppryggen; hold deg på ryggen og klar av begge kanter helt inn til varden på 1439.",
    ],
    descent: [
      "Standardnedkjøringen går sørover fra toppen, ned sørflanken til Kavliheian — 950 sammenhengende høydemeter — og derfra i oppkjørte spor tilbake til Øvre Kavli. Øverste del kan skjule stein tidlig i sesongen; den beste snøen ligger lenger ned. Sørflanken er også det første stedet i området som blir oppkjørt etter snøfall, så vær tidlig ute om du vil ha den urørt.",
      "Vanligste feil: å ta sørflanken som standard uansett forhold. Øverste del holder 30–35°, og skredterrenget ligger i to belter, 1300–1400 moh og 950–1050 moh — begge går du gjennom på vei opp også. Holder ikke varselet til det, går du tilbake over Steinberget, samme vei som opp, og opp igjen gjennom søkket.",
      "Vestrenna er den andre linja ned: jevnt 42–48°, med et 60 meter langt parti på rundt 55° der renna er smalest, og videre ut dalen til Loftskarsetra og ned gjennom skogen til parkeringen. Den krever stabil vårsnø eller stabile vinterforhold og en helt egen vurdering — snøkvaliteten i renna er vanskeligere å vurdere enn å kjøre den. Det er ikke noe du velger på toppen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigninga over Steinberget er den slake linja på fjellet, men den er ikke skredfri. Skredterrenget ligger i beltene 950–1050 moh og 1300–1400 moh, og du går gjennom begge på vei til toppen. Sjiktet 1300–1400 moh måler 20,5° i snitt, og hundremeteren over det — 1400–1500 moh, 22,1° — er den bratteste på oppstigninga; det bratteste enkelttrinnet ligger i den, mellom 1411 og 1433 moh, og måler 30,3°.",
      },
      {
        title: "Terrenget rundt",
        body: "Toppryggen bærer skavler på både øst- og vestsida, og under dem er det ikke slakt: nordøstsida faller 44° i snitt, nord- og sørøstsida 36°, og alle tre har bergband over 60°. Sørflanken under toppen er 30–35° øverst, og Vestrenna 42–48° med et 60 meter langt parti på rundt 55°. Nordvest for ryggen over Steinberget faller det av mot Loftskarsetra, rundt 27° i snitt med trinn opp mot 46°.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Romsdal på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L28,198 L49,195 L76,191 L97,184 L122,176 L139,167 L155,160 L173,151 L191,143 L207,134 L224,127 L238,120 L262,114 L296,109 L317,106 L342,103 L363,102 L389,99 L418,87 L444,85 L469,81 L494,75 L516,65 L532,56 L550,48 L566,38 L582,29 L598,19 L600,18",
      startLabel: "185 moh",
      endLabel: "1439 moh",
      distanceLabel: "6,4 km",
      caption: "185 til 1439 moh på 6,2 kilometer: bomvei, bjørkeskog til 632, så rygg hele veien — 1277 høydemeter medregnet søkket nord for Steinberget.",
    },
  },
  skarven: {
    slug: "skarven",
    intro:
      "744 høydemeter og 3,34 km fra parkeringsplassen i Skorgedalen til en av Romsdalens store klassikere — turen ut.no kaller en av de korteste i området og likevel en av de store. Fri Flyt gir den KAST 1 – Enkelt med bratteste punkt under 30 grader, og den ferdige linja holder seg innenfor: bratteste hundremetersbelte måler 20,5 grader mellom 400 og 500 moh, og bratteste sammenhengende parti 27,7. Det som krever hodet er ikke linja opp, men østflanken under fortoppen — den kilden selv sier du ikke skal krysse.",
    ascent: [
      "Fra parkeringsplassen i Skorgedalen, 307 moh på bomvegen fra Skorga på E136 — vinteråpen, og kartlagt som parkeringsplass i OSM. Fra plassens nordvestre hjørne går du over flata — myr etter Kartverkets klasser, 350 moh der linja krysser — nord for Kjerringhaugen og DNT-hytta Skorgedalsbu. Så opp bjørkeskogen: beltet fra 400 til 500 moh er turens bratteste, 20,5 grader over 295 meter grunn, og skogen slutter på 556 moh etter 1,35 km, med åpent område fra 557.",
      "Over skoggrensa runder du sør for topp 588 og følger en svak ryggformasjon — 572 moh der linja tar den — mot Skarvens sørlige fortopp på 788. Beltene her måler 16,4 grader fra 600 til 700 moh og 15,7 fra 700 til 800: jevn skinning på åpen rygg, med utsikten østover mot Romsdalen og vestover mot Romsdalsfjorden og Molde voksende for hvert belte.",
      "Fra fortoppen følger ryggen videre over 892 moh til varden. Det bratteste sammenhengende partiet på hele turen ligger her — 27,7 grader mellom 937 og 960 moh — og beltet fra 900 til 1000 måler 19,3 grader. Varden står på 1048 moh: Fri Flyts publiserte GPS-punkt, registerets fjellnavn og terrengmodellens 1048,1 faller sammen på meteren.",
    ],
    descent: [
      "Normalveien ned er sporet ditt opp, og sørøstflanken den følger er den slakeste sektoren på toppen: 19,6 grader i snitt mot sør og 26,3 mot sørøst, med 35,9 og 34,4 grader som bratteste 60-metersvinduer 90 til 180 meter ut fra varden. God, jevn kjøring som svært ofte har god snø, sier ut.no.",
      "Alternativene er brattere og hører til i god stabilitet: NM-løypa fra 1940 ned sørøstflanken mot Skarvebotn måler 33 grader over hundre høydemeter mellom 1020 og 920 moh, og Vasslia direkte mot Selsetervatnet 40–42 grader med passasjer på 45. Hold deg unna nordvestsiden — den måler 43,3 grader i snitt med 55,0 grader som bratteste 60 meter bare 80 til 140 meter ut.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt gir turen KAST 1 – Enkelt og bratteste punkt under 30 grader, og linja måler 20,5 grader i bratteste belte og 27,7 i bratteste parti. Kortet bærer likevel grad 2: tallene ligger over det grad 1-turene i appen måler, og fjellet har sider der feil koster.",
      },
      {
        title: "Østflanken",
        body: "Fri Flyt er direkte: «Ikke kryss østflanken under Skarvens fortopp. Dette er et av få områder på denne siden av fjellet som kan være skredutsatt.» Målingen sier hvorfor — østsiden faller 34,4 grader i snitt med 49,7 grader som bratteste 60-metersvindu 220 til 280 meter ut fra varden. Normalveien holder ryggen og har ikke noe der å gjøre.",
      },
      {
        title: "Vind og sol",
        body: "Kilden peker på skredfare i de øvre delene etter vind fra nordvest, og på at sørøstflanken er soleksponert — på vårdager løsner det her når sola har stått på. Tidlig start er svaret begge steder.",
      },
      {
        title: "Før du går",
        body: "Skarven ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–april er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,198 L56,196 L81,192 L113,186 L137,178 L153,169 L177,157 L193,149 L218,145 L234,140 L250,139 L274,137 L304,135 L331,129 L355,124 L379,115 L395,105 L417,95 L429,88 L452,83 L475,72 L492,65 L517,55 L541,45 L553,38 L570,29 L589,19 L600,18",
      startLabel: "307 moh",
      endLabel: "1048 moh",
      distanceLabel: "3,3 km",
      caption: "744 høydemeter og 3,34 km fra Skorgedalen om Kjerringhaugen og den sørlige fortoppen, med skoggrensa på 556 moh og det bratteste — 27,7 grader mellom 937 og 960 moh — oppe på ryggen.",
    },
  },
  mjolvafjellet: {
    slug: "mjolvafjellet",
    intro:
      "1220 høydemeter og 5,15 km fra fjorden til toppen som henger over Romsdalen — turen starter på idrettsplassen i Isfjorden, 6 moh, og slutter på 1215. Fri Flyt gir den KAST 2 – Utfordrende med bratteste punkt 28 grader på normalveien; den ferdige linja måler 21,0 grader i bratteste hundremetersbelte og 31,5 i det bratteste sammenhengende partiet, som ligger nede i lia mellom 279 og 300 moh. Det er en lang tur der lengden er vanskelighetsgraden — og der rutefinningen i dårlig sikt er det kilden advarer mest om.",
    ascent: [
      "Fra Isfjorden stadion — OSM har banen kartlagt, og terrengmodellen svarer 5,7 moh med klassen SportIdrettPlass, samme sjeldne treklang av guidebok, kartobjekt og terrengmodell som Glitreggas idrettsanlegg. Traktorvegen tar deg opp sørøstlia forbi fotballbanen: beltet fra 0 til 100 moh måler 7,9 grader, og så bratner det til — 21,0 grader fra 200 til 300 moh over 261 meter grunn, med turens bratteste sammenhengende parti, 31,5 grader, mellom 279 og 300 moh. Det bratteste på hele turen ligger altså i skogen.",
      "Skogen åpner seg mot sørvest under Litlehestens bratte vegg — 454 moh der linja passerer foten — og du krysser Steinselva på 536. Skogen slutter på 673 moh etter 2,75 km, med åpent område fra 683. Så sikter du mot den slakeste ryggformasjonen mot Høgnosa: beltet fra 800 til 900 moh måler 12,7 grader, og fra 900 til 1000 14,0.",
      "Fra Høgnosa går ryggen sørover mot toppen — 1060 moh der linja tar den, og beltene over 1000 måler 12,3 og 8,0 grader før den siste kneiken på 14,1. Varden står på 1215 moh med Romsdalseggen mot Blånebba og Store Venjetinden i sør og Romsdalsfjorden i nord. Registeret leser 1206 på representasjonspunktet; toppsøket klatrer til 1215,3 mot publiserte 1216.",
    ],
    descent: [
      "Normalveien ned er sporet ditt opp, og retningen av toppen er nord — ryggen mot Høgnosa er den eneste slake sektoren der oppe, 4,2 grader i snitt over 500 meter med 21,1 grader som bratteste 60-metersvindu. Alt annet er bratt: sør og sørvest faller 43,7 og 42,4 grader i snitt med vinduer på 61,0 og 58,5, og nordøstsiden rett under toppen har et 60-metersvindu på 61,7 grader bare 30 til 90 meter ut.",
      "Fri Flyt dokumenterer brattere nedfarter mot Jamnåbotn og Storhestvatnet, 30 til 45 grader med aspekt nord til øst-nordøst. De hører til i god stabilitet og med sporvalget lagt før du står i henget.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, bratteste punkt 28 grader på normalveien — og den ferdige linja måler 31,5 grader i det bratteste partiet, nede i skogen mellom 279 og 300 moh. Over skoggrensa holder ryggen seg slak: ingen belte over 900 måler mer enn 14,1 grader.",
      },
      {
        title: "Leheng og skavler",
        body: "Kilden peker på skredfare i leheng etter vind fra sør og vest, og på skavler på de østvendte hengene. Ryggen du følger har det bratte tett inntil seg — nordøstsiden under toppen måler 61,7 grader i bratteste vindu — så linja er god fordi den holder seg der den er, ikke fordi terrenget rundt er snilt.",
      },
      {
        title: "Sikten",
        body: "Rutefinningen er kildens eget varsku: i dårlig sikt er det krevende å holde ryggformasjonen, og feil retning av toppen setter deg over heng på 45 grader eller mer. Retningen ned fra varden er nord, mot Høgnosa — det er verdt å merke seg før skodda kommer, ikke etter.",
      },
      {
        title: "Før du går",
        body: "Mjølvafjellet ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Ta med sender/mottaker, søkestang og spade. Merk at ut.no beskriver fjellet fra Venjesdalen — en annen start enn denne; linja her er Fri Flyts, og andrekilden dekker fjellet, ikke linja.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L32,199 L53,194 L71,187 L90,182 L111,178 L138,172 L158,163 L179,153 L195,145 L214,135 L231,130 L258,123 L277,116 L300,108 L317,101 L331,94 L348,85 L368,77 L384,72 L407,67 L436,58 L461,49 L483,43 L499,38 L520,32 L538,27 L565,24 L588,22 L600,18",
      startLabel: "6 moh",
      endLabel: "1215 moh",
      distanceLabel: "5,1 km",
      caption: "1220 høydemeter og 5,15 km fra Isfjorden stadion om Steinselva og ryggen ved Høgnosa, med skoggrensa på 673 moh og det bratteste — 31,5 grader mellom 279 og 300 moh — nede i skogen.",
    },
  },
  blanebba: {
    slug: "blanebba",
    intro:
      "934 høydemeter og 4,04 km fra Venjesdalssetra til kanten som ser rett ned i Romsdalen — fra varden har du Trollveggen, Romsdalshorn og Vengetindene på første rad. Fri Flyt gir turen KAST 2 – Utfordrende med bratteste punkt 40 grader i toppryggen; linja her tar det slakere alternativet kilden selv beskriver, om skaret på 1245 moh, og måler 22,2 grader i bratteste hundremetersbelte og 27,4 i bratteste sammenhengende parti. Kanten du står på til slutt faller 71 grader — den er utsikten, og den er faren.",
    ascent: [
      "Fra parkeringa der bomvegen opp Venjesdalen ender, ved Venjesdalssetra — OSM har setra som eget punkt, og DTM1 leser 418 moh der Fri Flyt oppgir 380. Du går sørover etter Romsdalseggen-merkinga gjennom rydda skoggater på nordsida av Tverrelva: beltet fra 400 til 500 moh måler bare 7,3 grader, og skogen slutter allerede på 553 moh etter 1,2 km, med åpent område fra 559.",
      "Over skoggrensa åpner flata mellom Blånebba og Storhesten seg — 681 moh der linja krysser. Herfra holder du vestover i slak stigning til du finner nordøstflanken som leder opp mot det laveste punktet på ryggen mellom Blånebba og punkt 1178. Flanken er turens bratteste del: beltet fra 800 til 900 moh måler 22,2 grader over 269 meter grunn, og det bratteste sammenhengende partiet ligger her, 27,4 grader mellom 972 og 999 moh.",
      "Skaret leser 1245 moh på terrengmodellen, 230 meter vest-nordvest for toppen, og hovedryggen følges østover derfra til varden på 1317 — beltet fra 1200 til 1300 måler 17,2 grader. Fri Flyts direkteveg gjennom toppryggen er den andre muligheten, rundt 40 grader ifølge kilden; linja her er traversen han beskriver som det slakere valget rundt 1000 moh. Registeret leser 1272 på representasjonspunktet, toppsøket klatrer til 1317,0 mot publiserte 1320 — et skarpt topp-punkt der laserskannet leser tre meter under den publiserte høyden, samme klasse som Rørnestinden.",
    ],
    descent: [
      "Normalnedfarten er nordøstflanken du kom opp — 35 til 40 grader ifølge Fri Flyt, og målt 36,2 grader i snitt over 500 meter med 43,6 grader som bratteste 60-metersvindu 140 til 200 meter ut. Ryggen mot nordvest, tilbake mot skaret, er den eneste slake sektoren på toppen: 16,5 grader i snitt.",
      "Nordryggen er kildens avanserte alternativ — 38 til 43 grader med passasjer på 45, aspekt nord til øst. Og hold varden mellom deg og Romsdalen når du snur: sør- og sørvestsiden faller 71,4 og 72,0 grader i de første 60 metrene fra toppen. Det er kanten du kom for å se utover, ikke utfor.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, faremomenter skred og skavl. Linja måler 22,2 grader i bratteste belte og 27,4 i bratteste parti — under de 30 der de store skredene løsner, men flanken du krysser mellom 800 og 1000 moh ligger i le for nordvestlig vind, og terrenget rundt er omkranset av steinheng med store konsekvensområder.",
      },
      {
        title: "Skavlene",
        body: "Skavleksponeringen er mot nord, og ut.no legger til at partiene nær toppen er smale med store skavler. På ryggen fra skaret østover til varden går du med nordsiden under skavl og sørsiden 71 grader ned mot Romsdalen — hold deg på linja, særlig i flatt lys.",
      },
      {
        title: "Sesongen",
        body: "Fri Flyt gir mars–mai, ut.no desember–april. Kortet bærer Fri Flyts, som er primærkilden for linja — uenigheten står her heller enn å midles bort. Bomvegen opp Venjesdalen brøytes; setra er vinterstart for både Blånebba og naboturene.",
      },
      {
        title: "Før du går",
        body: "Blånebba ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,195 L27,199 L52,199 L80,197 L109,193 L139,185 L158,176 L178,168 L200,157 L220,149 L247,141 L267,133 L294,123 L314,112 L330,104 L353,93 L369,83 L383,78 L401,73 L434,69 L458,64 L483,60 L503,51 L534,41 L561,32 L581,23 L600,18",
      startLabel: "418 moh",
      endLabel: "1317 moh",
      distanceLabel: "4,0 km",
      caption: "934 høydemeter og 4,04 km fra Venjesdalssetra om flata under Storhesten og skaret på 1245 moh, med skoggrensa på 553 moh og det bratteste — 27,4 grader mellom 972 og 999 moh — i nordøstflanken.",
    },
  },
  ospetinden: {
    slug: "ospetinden",
    intro:
      "1061 høydemeter og 6,88 km fra bomkassa på Venås til pyramiden innerst i Måndalen — fjellet du ser reise seg foran deg fra første steg, sier morotur. Fri Flyt gir turen KAST 2 – Utfordrende med bratteste punkt rundt 35 grader øverst i botnen; linja her trekker ut på nordøstryggen fra flata på rundt 900 moh, slik kilden anbefaler for skred, og måler 22,4 grader i bratteste hundremetersbelte og 25,6 i bratteste sammenhengende parti. Toppen er ofte snøfri — skiene settes vanligvis igjen noen meter under den.",
    ascent: [
      "Fra bomkassa ved gården Venås innerst i Måndalen, 201 moh, følger du bomveien til Venåssetra — beltene fra 200 til 400 moh måler 3,0 og 3,7 grader over nesten tre og en halv kilometer veg, jevn og fin stigning innover dalen. Setra er et godt hvilepunkt på finværsdager, sier morotur. Terrengmodellen leser 393 moh der; Fri Flyts «ca 700» for setra er feil, registeret og terrengmodellen er enige.",
      "Fra setra går du rett vest over myra — 414 moh — og krysser Stavvasselva, så sikter du mot den store østvendte botnen. Skogen slutter på 694 moh etter 4,77 km, men linja streifer skogholt helt opp til 805 moh og er åpen for godt fra 813, og botnen har jevnt stigende bratthet: 15,4 grader fra 600 til 700 moh, og så turens bratteste belte, 22,4 grader fra 700 til 800 over 225 meter grunn, med det bratteste sammenhengende partiet — 25,6 grader — mellom 764 og 779 moh.",
      "Fra flata på rundt 900 moh — 948 der linja tar den — er det vanlig å trekke ut mot nordøstryggen, og det er det linja gjør: beltet fra 900 til 1000 måler bare 8,5 grader på traversen ut. Ryggen tar deg vestover mot varden — 19,0 grader fra 1100 til 1200 — med utsikten over fjordene mot Molde og havet bak deg. Registeret leser 1203 på representasjonspunktet; toppsøket klatrer til 1227,5 mot publiserte 1228. Selve toppen er ofte avblåst med bart berg og hardpakke — det første 60-metersvinduet ned nordøstryggen måler 45,3 grader, så skiene blir stående der du satte dem.",
    ],
    descent: [
      "Normalnedfarten er østflanken: rett ned gir jevnt 30 grader ifølge Fri Flyt, og målingen er enig — østsiden måler 27,5 grader i snitt over 500 meter med 31,9 grader som bratteste 60-metersvindu 70 til 130 meter ut. Fra flata på rundt 900 moh følger du vanligvis sporene fra turen opp.",
      "Sørflanken er alternativet: 400 høydemeter jevnt bratt ned mot Øspevatnet, 33 til 40 grader ifølge kilden — og målt 33,9 grader i snitt med 37,3 som bratteste vindu rett under toppen. Den hører til i god stabilitet, og den ender et annet sted enn bilen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 2 – Utfordrende hos Fri Flyt, bratteste punkt rundt 35 grader øverst i botnen der kildens direktelinje går. Linja her går ut på nordøstryggen fra flata i stedet — det er sporvalget kilden selv legger med tanke på skred etter vind og snø fra nord — og måler 25,6 grader der den er brattest.",
      },
      {
        title: "Lehengene",
        body: "Kilden er konkret om vinden: sørøst- og nordøstryggene danner leheng i henholdsvis sørlig og nordlig vind. Botnen du krysser er østvendt og samler snø etter vestavær — les hengene over deg gjennom hele stigningen fra 700 til 900.",
      },
      {
        title: "Toppen",
        body: "Toppen er ofte snøfri med bart berg og hardpakke, og glifare er kildens eget ord. Det første 60-metersvinduet ned nordøstryggen måler 45,3 grader — skiene settes igjen noen meter under toppen, og de siste metrene går til fots.",
      },
      {
        title: "Før du går",
        body: "Øspetinden ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,199 L43,198 L75,195 L98,191 L126,188 L146,185 L173,181 L197,177 L228,172 L251,166 L275,168 L299,165 L326,158 L346,146 L369,133 L393,126 L412,115 L436,97 L460,78 L477,68 L499,66 L522,58 L542,55 L562,44 L577,34 L597,19 L600,18",
      startLabel: "201 moh",
      endLabel: "1228 moh",
      distanceLabel: "6,9 km",
      caption: "1061 høydemeter og 6,88 km fra Venås om Venåssetra og den østvendte botnen, med skoggrensa på 805 moh og det bratteste — 25,6 grader mellom 764 og 779 moh — i botnen.",
    },
  },
  middagstinden: {
    slug: "middagstinden",
    intro:
      "1291 høydemeter og 6,04 km fra Herdslan i Innfjorden til en alpin topp som er bratt på alle kanter — Fri Flyt gir turen KAST 3 – Komplekst med bratteste punkt 39 grader, og normalveien kjennes luftig og eksponert. Linja måler 25,1 grader i bratteste hundremetersbelte og 30,0 i det bratteste sammenhengende partiet, som er de siste metrene opp den vestvendte toppflanken. Eggen dit er ofte avblåst: ski på sekken, og stegjern og isøks kan trengs. Dette er rundens alvorligste tur, og den sier det selv.",
    ascent: [
      "Fra Herdslan på bomvegen mot Bøstølen — registerets Herdslan er ei slette ved veien, og myrflata der bilene står leser 348,7 moh mot Fri Flyts oppgitte 360. Veien følges vestover på sørsiden av Berillvatnet, som er regulert: linja runder hele vannet på land, om vestenden på 403 moh, og krysser elva vest for vatnet på egnet sted slik kilden sier — 390 moh der linja tar den. Beltet fra 300 til 400 moh måler 3,4 grader over halvannen kilometer veg.",
      "Fra skogen vest for vatnet — 410 moh — går det opp bekkedalen mot skaret øst for punkt 943, ved Tindevatnet. Skogen slutter på 740 moh etter 3,33 km, med åpent område fra 759, og dalen bratner jevnt: 21,0 grader fra 500 til 600 moh, 19,2 fra 600 til 700 og turens bratteste belte, 25,1 grader over 170 meter grunn, fra 700 til 800. Øvre del av bekkedalen er bratt og skredutsatt — det er kildens egen formulering, og det er her turen krever sin stabilitet.",
      "Skaret leser 937 moh der linja tar det, med Tindevatnet på 804 under deg i vest. Herfra travereres ryggen østover mot toppen — 17,3 grader fra 1000 til 1100, 21,3 fra 1200 til 1300 — og den er lite skredutsatt, men ofte avblåst: skiene på sekken, og stegjern og isøks kan trengs. Når ryggen flater ut nordover kan skiene ofte på igjen langs vestsiden.",
      "Den siste vestvendte flanken før toppen er bratt — 37 grader ifølge Fri Flyt, ofte avblåst, og med liten plass. Linja måler 30,0 grader i det bratteste sammenhengende partiet mellom 1549 og 1568 moh, og beltet fra 1500 til 1600 måler 23,8. Varden står på 1568 moh; registeret leser 1547 på representasjonspunktet, og toppsøket klatrer til 1568,3 mot publiserte 1569. Landet har 49 fjell som heter Middagstinden — dette er Raumas.",
    ],
    descent: [
      "Normalnedfarten er den store vestvendte flanken fra toppen, først mellom steinutslag — kilden peker særlig på de øverste hundre metrene — og med en travers sørover før kjøringen begynner. Rundt 700 meter bratt kjøring ned mot skaret, så 500 meter skogskjøring. Vestsiden måler 31,6 grader i snitt over 500 meter med 38,3 grader som bratteste 60-metersvindu 10 til 70 meter ut — det stemmer med kildens 37.",
      "Gullkoppen-variantene er kildens avanserte alternativer: en travers på snørampa øst for Gullkoppens bratte vegg fra rundt 1360 moh med heng opptil 45 grader, og en direkte 50-graders flanke på sørsiden av undertoppen rundt 1300. Begge hører til seint på vinteren med gjennomfrossen snø — og ingen av dem er linja på kartet her.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "KAST 3 – Komplekst hos Fri Flyt, bratteste punkt 39 grader. Terrenget gir ikke rom for feil på de eksponerte partiene, sier kilden — øvre del av bekkedalen er bratt og skredutsatt, og skredterreng i heng over 30 grader står i selve rutebeskrivelsen. Dette er en tur for tørr, stabil vintersnø eller gjennomfrossen vårsnø med kalde netter.",
      },
      {
        title: "Eggen og flanken",
        body: "Ryggen fra skaret er lite skredutsatt men ofte avblåst — ski på sekken, stegjern og isøks kan trengs, og den siste vestvendte flanken har liten plass. Målingen sier hvor smal marginen er: fra varden faller sør, sørvest og sørøst 75,7, 73,4 og 71,5 grader i de første 60 metrene, og bare vest er kjørbar — 31,6 grader i snitt.",
      },
      {
        title: "Steinutslag",
        body: "Kilden peker på stein særlig i de øverste hundre metrene av vestflanken, og seint i sesongen tar sola de lavere delene. Tidlig start og en plan for hvor du snur er del av utstyret her.",
      },
      {
        title: "Før du går",
        body: "Middagstinden ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Ta med sender/mottaker, søkestang og spade i tillegg til stegjern og isøks — og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,197 L45,192 L72,191 L94,191 L116,191 L143,190 L167,192 L189,194 L215,197 L239,189 L255,182 L282,168 L297,161 L313,152 L327,144 L344,132 L367,123 L390,116 L411,108 L428,106 L449,97 L471,87 L489,78 L507,68 L534,52 L556,41 L574,32 L592,24 L600,18",
      startLabel: "349 moh",
      endLabel: "1568 moh",
      distanceLabel: "6,0 km",
      caption: "1291 høydemeter og 6,04 km fra Herdslan rundt Berillvatnet og opp bekkedalen til skaret ved Tindevatnet, med skoggrensa på 740 moh og det bratteste — 30,0 grader mellom 1549 og 1568 moh — i den vestvendte toppflanken.",
    },
  },
  auskjeret: {
    slug: "auskjeret",
    intro:
      "870 høydemeter på 3,83 km fra Fausaskiftet, jevn stigning nordover hele veien — om lag femten grader i snitt. Helårsåpen vei fram til starten er grunnen til at dette er en av de første turene som går i Sykkylven hver vinter.",
    ascent: [
      "Start ved Fausaskiftet ved enden av Nysætervatnet, 333 moh, der Fausavegen tar av fra veinettet om lag fire kilometer forbi skianlegget. Veien hit er åpen hele året.",
      "Ta på skia og gå nordover. De første 671 meterne grunn ligger på 6,2 grader i snitt, og skogen holder til 553 moh.",
      "Over skogen fortsetter stigninga jevnt og uten trinn: 14,2 grader fra 500 til 600 moh, 11,4 fra 600 til 700 og 11,7 fra 700 til 800. Ved 685 moh er du ute i den åpne sida, og rett over ligger bratteste partiet på turen — 26,4 grader over tretti meter, mellom 862 og 884 moh, i bandet som måler 18,6 grader i snitt.",
      "Fra 900 moh og opp er det jevn rygg hele veien: 16,1 grader fra 900 til 1000 moh, 18,1 fra 1000 til 1100 og 15,1 fra 1100 til 1200, med varden på 1203 moh.",
    ],
    descent: [
      "Ned samme ryggen, sørøstover mot Nysætervatnet, i moderat og oversiktlig skiterreng. Følger du ryggen opp og ned, holder ruta seg under 30 grader hele veien.",
      "Vanligste feil: å tro at det bratteste ligger mot øst. Målingene sier noe annet. Fra tre punkter på ryggen — 896, 1000 og 1103 moh — måler østsida 7,5, 7,0 og 8,9 grader i snitt over 400 meter, og fra varden 18,9. Det bratte ligger nord og nordøst for toppen: 30,6 og 35,8 grader i snitt, med 60-metersvinduer på 58,9 og 50,5. Ryggen opp er den slake linja, og terrenget bak toppen er det du ikke ser fra den.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jevn stigning på om lag femten grader i snitt. Bratteste hundremeteren, 800 til 900 moh, måler 18,6 grader, og bratteste sammenhengende parti 26,4 grader mellom 862 og 884 moh. Ryggen er bred, og det er den som er ruta både opp og ned.",
      },
      {
        title: "Terrenget rundt",
        body: "Researchen for denne turen sa at fjellet har et brattheng mot øst over 30 grader. Det finner ikke terrengmodellen: øst fra ryggen måler 7 til 9 grader i snitt og øst fra varden 18,9, med det bratteste 60-metersvinduet på 31,1 grader hele 280 til 340 meter ut. Det som faktisk er bratt, er nord og nordøst for toppen — 30,6 og 35,8 grader i snitt med vinduer på 58,9 og 50,5. Det er lengden og den sida, ikke østsida, som skiller turen fra en ren nybegynnertur.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,199 L56,195 L84,190 L105,185 L133,177 L154,172 L175,165 L197,159 L211,153 L225,148 L246,142 L274,136 L295,131 L309,126 L330,117 L352,108 L380,104 L408,95 L422,89 L443,80 L464,72 L482,65 L499,58 L521,48 L535,42 L556,33 L577,24 L600,18",
      startLabel: "333 moh",
      endLabel: "1203 moh",
      distanceLabel: "3,8 km",
      caption: "870 høydemeter og 3,83 km fra Fausaskiftet ved Nysætervatnet, med skoggrensa på 553 moh og bratteste hundremeteren mellom 800 og 900 moh.",
    },
  },
  snohetta: {
    slug: "snohetta",
    intro:
      "Norges høyeste fjell utenfor Jotunheimen, og et av de snilleste i sin klasse: østryggen er staket hele veien, og bratteste parti på linja måler 23,5°. Det som avgjør dagen er ikke fjellet, men hvordan du kommer deg inn til Snøheim.",
    ascent: [
      "Snøheim turisthytte, 1474 moh, ligger ved enden av Snøheimvegen. Veien er stengt for privatbil, og sykling er bare tillatt i vinduet 1. juni–15. juli av hensyn til villreinen — el-sykkel er forbudt hele året. Bussen fra Hjerkinn går først når hytta åpner rundt St. Hans. I skisesongen tar du altså de fjorten kilometerne inn fra Hjerkinn for egen maskin — det er den delen av dagen folk undervurderer. Fra hytta følger du sporet et par hundre meter vestover til gangbrua over Stridåe. Brua ligger i sørøsthjørnet av tjernet rett vest for hytta; du går rundt sørsida av tjernet, ikke over det.",
      "Etter brua svinger du umiddelbart til høyre inn på Forsvarets gamle traktorveg, sperret for kjøring med store steiner. Den tar deg jevnt oppover til Gamle Reinheim, ruinen på 1670 moh. Ingen skog noe sted på denne turen — du er over tregrensa fra hytta og oppover, og ser hele ryggen foran deg hele veien.",
      "Fra Gamle Reinheim stiger det bratt, delvis på snøfonner, opp på østryggen. Oppe på kammen ligger stidelet mot Reinheim i Stroplsjødalen, inngangen for dem som kommer østfra. Hold avstand til det bratte terrenget mot nord i starten av stigningen; ryggen er bred nok til at du kan gå midt på den.",
      "Det bratteste hundremeterbeltet ligger mellom 1700 og 1800 moh og holder 16,0° i snitt — beltet over, 1800 til 1900 moh, måler 13,8° — og bratteste parti på linja måler 21,7°. Herfra er det staker og varder hele veien, og øverst går det på snøfonner opp til Stortoppen, 2286 moh, der radiolinkstasjonen står. I dårlig sikt er det stakene som holder deg på kammen — den øvre delen er bred nok til at du mister følelsen av hvor ryggen går.",
    ],
    descent: [
      "Samme vei ned. Fra Stortoppen til Gamle Reinheim gir østryggen drøyt 600 sammenhengende høydemeter, og de siste 200 tar traktorvegen. Under 1800 moh slakner det så mye at det blir mer gliding enn svinger. Vil du ha mer helning og bedre snø, legger du noe av nedkjøringen sør for oppoversporet — men da står du i 30–40°-terreng i stedet for 20°.",
      "Vanligste feil kommer helt til slutt: å forlate traktorvegen for tidlig og sikte rett mot Snøheim. Da har du tjernet vest for hytta i veien, og utløpsbekken bak det. Følg veien helt ned til enden ved sørvesthjørnet av tjernet og ta stien østover derfra — gangbrua er den eneste kryssinga, og fra brua er det 230 meter igjen til hytta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Østryggen er slak etter høyfjellsmålestokk. Det bratteste hundremeterbeltet, mellom 1700 og 1800 moh, holder 16,0° i snitt, og bratteste parti på linja måler 21,7°. Fra Snøheim til Gamle Reinheim går du på gammel traktorveg i åpent, slakt terreng. Det som betyr noe her er ikke det du står på, men hvor nær kanten av kammen du legger sporet.",
      },
      {
        title: "Terrenget rundt",
        body: "Nord for kammen ser det slakt ut, og de første tre hundre meterne er det — terrenget flater ut og stiger til og med litt. Så bryter det: fire–fem hundre meter nord for sporet faller kanten over 55° og drøyt 130 høydemeter, ned på flatene som strekker seg mot Leirpullan og Larsurda. Du ser den ikke fra ryggen. Rett under Stortoppen er nordsida bratt hele veien: 31° i snitt over de første fem hundre meterne, med partier over 50°. Sørsida faller jevnere, rundt 30° i snitt, men med partier på 37–46° mellom 1950 og 1800 moh. Renna østover fra Vesttoppen er en annen tur — over 30° i snitt, brattest rett under kanten, og med en bregleppe nederst.",
      },
      {
        title: "Før du går",
        body: "Dovrefjell ligger i varslingsregion Nord-Gudbrandsdalen. Det er en B-region på varsom.no: skredvarsel publiseres bare når faregraden ventes å bli 4 eller 5, så en tom side betyr ikke trygt fjell. Les værhistorikken og observasjonene i regionen selv, og ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L18,200 L41,198 L64,196 L87,194 L115,190 L138,189 L156,187 L179,184 L202,178 L230,170 L253,167 L276,166 L295,161 L317,155 L340,150 L358,138 L377,127 L400,120 L418,107 L437,93 L464,79 L483,73 L496,67 L519,55 L538,44 L556,37 L575,28 L594,19 L600,18",
      startLabel: "1474 moh",
      endLabel: "2286 moh",
      distanceLabel: "5,9 km",
      caption: "5,7 km og 817 høydemeter fra Snøheim — jevnt oppover hele veien, og aldri brattere enn 23,5°.",
    },
  },
  jonshornet: {
    slug: "jonshornet",
    intro:
      "1428 høydemeter fra 107 moh over Rametinden, og de siste hundre på smal egg til varden på det fjellet lokalt heter Ramoen. Bratteste sammenhengende parti måler 33,7 grader, og skia blir normalt satt igjen på ryggen.",
    ascent: [
      "Start i Vollane ved Tverrelva, 107 moh, øverst i gårdsveien fra Molladalsvegen. Gå gjennom stålgrinda ved elva og følg stien oppover, først på venstre og så på høyre side av elva.",
      "Den første delen er den bratteste av de lave bandene: 19,6 grader fra 200 til 300 moh og 19,3 fra 300 til 400. Terrenget legger seg ved Vollesætra på 411 moh, og skogen holder til 463.",
      "Fra setra går det i relativt slakt terreng opp mot Rametinden, 1197 moh — bandet fra 700 til 800 moh måler 12,1 grader og 900 til 1000 moh 15,2. Fra Rametinden faller ryggen til skaret på 1089 moh; det er 108 høydemeter du gir fra deg på vei opp, og linja henter dem inn igjen med bandet fra 1100 til 1200 moh på 5,2 grader over 1019 meter grunn.",
      "Fra skaret stiger ryggen 328 høydemeter til toppen, og det er her turen skifter karakter: bandet fra 1200 til 1300 moh måler 18,5 grader, bratteste sammenhengende parti 33,7 grader mellom 1165 og 1185 moh, og selve toppen er en haug av store steinblokker. De siste hundre høydemeterne går på egg, og de fleste setter skia igjen på ryggen.",
    ],
    descent: [
      "Ned samme ryggen: over skaret, opp igjen den lille kneika til Rametinden og ned nordryggen til Vollesætra og Vollane. Fallretninga er nord.",
      "Vanligste feil: å ta Jønshornrenna ned i Molladalen uten å ha ordnet transport. Fri Flyt beskriver den runden, og den holder opp mot 45 grader — men den ender i en annen dal enn den du parkerte i, og krever to biler. Den andre er å regne egga som en del av skituren: den er hundre høydemeter til fots på eksponert rygg.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jevn oppstigning til Rametinden og alvor over skaret. Bratteste sammenhengende parti måler 33,7 grader mellom 1165 og 1185 moh, og bandet fra 1200 til 1300 moh 18,5 grader. Sidene ned fra ryggen mellom Rametinden og toppen er skredterreng.",
      },
      {
        title: "Terrenget rundt",
        body: "Jønshornrenna mot Molladalen holder opp mot 45 grader og er skredterreng. Egga de siste hundre høydemeterne er eksponert, og der er det fallhøyden og ikke snødekket som er faren — hardt føre gjør den til en annen oppgave enn løssnø.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,195 L52,190 L71,183 L89,176 L104,168 L119,161 L136,153 L155,145 L180,138 L209,127 L223,121 L242,112 L266,108 L289,100 L318,90 L341,82 L365,73 L387,65 L402,57 L422,50 L445,55 L464,62 L488,64 L506,59 L523,50 L540,43 L556,36 L570,29 L592,22 L600,18",
      startLabel: "107 moh",
      endLabel: "1417 moh",
      distanceLabel: "5,7 km",
      caption: "1428 høydemeter og 5,68 km fra Vollane over Vollesætra og Rametinden, med skaret på 1089 moh mellom Rametinden og toppryggen.",
    },
  },
  ytstevasshornet: {
    slug: "ytstevasshornet",
    intro:
      "816 høydemeter på 3,79 km fra Svartevatnet, bratt opp Vassdalen forbi vannene på 976 moh og så nordvest mot en smal topprygg. Bratteste sammenhengende parti måler 25,0 grader, og de siste metrene blir gjerne gått uten ski.",
    ascent: [
      "Start på parkeringa ved Svartevatnet, 538 moh, ved hovedveien mellom Sykkylven og Stranda. De første 904 metrene grunn er flate — 4,3 grader — og de går langs østbredden, ikke over vatnet. Svartevatnet er et magasin: vannflata måler 526 moh, tolv meter under parkeringa, og linja holder land hele veien rundt nordenden og ned til sørenden på 524.",
      "Gå vestover, på venstre side av elva, opp Vassdalen. Her er den bratte delen av turen: 18,2 grader fra 600 til 700 moh, 22,4 fra 700 til 800 over bare 225 meter grunn, og 20,5 fra 800 til 900, med bratteste sammenhengende parti på 25,0 grader mellom 728 og 749 moh. Skogen holder til 691 moh, og fra 706 er du i åpent terreng.",
      "Ved de små fjellvannene — de ligger på 976 moh, linja passerer dem på 955 — flater det ut igjen: bandet fra 900 til 1000 moh måler 10,8 grader over 546 meter grunn. Det er her du ser resten av ruta, og det er også det naturlige stedet å snu om vinden har bygd skavl på ryggen over.",
      "Derfra holder du nordvestover mot toppryggen: 11,8 grader fra 1000 til 1100 moh og 18,0 fra 1100 til 1200. De siste metrene opp til 1331 moh blir gjerne gått uten ski.",
    ],
    descent: [
      "Ned samme veien, østover gjennom Vassdalen til Svartevatnet. Fallretninga er øst, og Vassdalen er både det bratteste og det mest skredutsatte på turen.",
      "Vanligste feil: å runde skavlen mellom fortoppen og hovedtoppen på oversida. Det danner seg normalt en stor skavl der, og du skal kjøre ned i sida når du runder den — ikke følge kanten.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Flat start, bratt midtdel og et flatt parti før toppryggen: bratteste hundremeteren, 700 til 800 moh, måler 22,4 grader over 225 meter grunn, og bratteste sammenhengende parti 25,0 grader mellom 728 og 749 moh. Vassdalen er skredterreng fra 600 moh og opp. Nede ved starten er faren en annen: isen på et magasin, og ruta er lagt på land utenom den.",
      },
      {
        title: "Terrenget rundt",
        body: "Skavler langs toppryggen — det danner seg normalt en stor skavl mellom fortoppen og hovedtoppen, og den skal rundes på nedsida. Sida ned fra hovedtoppen er skredterreng, og nordsida er den bratteste: 43,2 grader i snitt over 500 meter med et 67,3-graders vindu alt 10 til 70 meter ut fra varden, og nordøst 56,3 grader de første 60. Øst — veien ned Vassdalen — måler 9,8 grader i snitt, og Vassdalen er likevel skredterreng og den eneste veien ned til bilen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L22,198 L36,198 L58,198 L79,200 L100,197 L122,190 L143,182 L157,175 L172,168 L193,158 L214,145 L222,141 L241,131 L256,123 L278,112 L300,104 L322,102 L344,94 L365,89 L379,83 L401,80 L422,72 L443,63 L461,53 L479,47 L507,41 L529,36 L557,28 L580,20 L600,18",
      startLabel: "538 moh",
      endLabel: "1331 moh",
      distanceLabel: "3,8 km",
      caption: "816 høydemeter og 3,79 km fra Svartevatnet langs østbredden og opp Vassdalen forbi vannene på 976 moh, med skogen som slipper taket på 691.",
    },
  },
  rana: {
    slug: "rana",
    intro:
      "1559 høydemeter fra 63 moh — fjord til topp på 8,59 km, med et av de eldste navnene i Sunnmørsalpane på skiltet. Bratteste sammenhengende parti måler 28,4 grader og ligger på egga, mellom 1210 og 1232 moh — toppkammen er smal, men linja følger den inn fra sørvest og er slakere enn den ser ut.",
    ascent: [
      "Start ved Urkegjerdet, 63 moh, der grusveien tar av fra hovedveien ved Urke Landhandel. Veien videre mot Haukåssætra er vinterstengt, og det er derfor turen starter nede ved fjorden og ikke oppe ved sætra på 230 moh — Fri Flyts «5 timer fra Haukåssætra» er tida fra et punkt du sjelden kommer til med bil om vinteren.",
      "Følg veien opp gjennom skogen — Kartverket fører skog til 231 moh — forbi Haukåssætra og inn i dalen mot Nordkopen på 501 moh. Bandet fra 400 til 500 moh måler 11,7 grader, og ellers er hele innmarsjen slak: 5,5 grader fra 100 til 200 moh og 6,5 fra 200 til 300.",
      "Fra kopen sikksakker ruta bratt opp mot egga i nord, og du tar inn på den til høyre for en markert hammer. Botnen ligger på 987 moh og eggkammen på 1331. Bandet fra 1200 til 1300 moh er bratteste hundremeteren, 19,2 grader i snitt, og partiet fra 700 til 1000 moh under det ligger på 16 til 19 grader.",
      "Derfra følger du toppryggen nordover. Den er bred og slaker av mot 1400 moh — 7,2 grader fra 1300 til 1400 — før den siste stigninga langs kammen fra 1531 og 1562 moh til varden på 1587. Kammen kommer inn fra sørvest, og linja holder den de siste 120 meterne — 1572, 1579 og 1586 moh — i stedet for å gå rundt på østsida. Det bratteste på ruta ligger lenger nede, på egga: 28,4 grader over tretti meter mellom 1210 og 1232 moh.",
    ],
    descent: [
      "Ned samme veien: kammen, den brede toppryggen, ned egga til Nordkopen og ut dalen til Urkegjerdet. Kortet fører fallretninga som sørøst; linja hjem peiler 182 grader, altså rett sør, og kammen blir holdt på vestsida der skavlene ikke er. Nedkjøringa er lang — 1559 høydemeter i ett strekk fra toppen til fjorden.",
      "Vanligste feil: å holde seg øst på toppryggen. Det ligger store skavler på østsida av ryggen, og en flankemåling fra toppen viser at fjellet er bratt i alle retninger: 22 til 41 grader i snitt over de første 400 meterne, med 60-metersvinduer på 53 til 66 grader. Hold vest for kammen.",
      "Den andre er tidspunktet. Ruta går gjennom skredterreng både inn mot Nordkopen og i sida opp mot egga, og i vårsnø utover ettermiddagen er det den delen av turen som endrer seg raskest.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak innmarsj og bratt midtdel: bandet fra 1200 til 1300 moh måler 19,2 grader i snitt, og sida opp fra Nordkopen til egga er skredterreng. Selve toppkammen er smal, og det er der skavlene ligger — men linja langs den fra sørvest er ikke rutas bratteste: det er egga, 28,4 grader over tretti meter mellom 1210 og 1232 moh.",
      },
      {
        title: "Terrenget rundt",
        body: "Store skavler på østsida av den brede toppryggen. Flankemålinga fra toppen gir 22 til 41 grader i snitt over 400 meter i alle åtte retninger, med 60-metersvinduer mellom 53 og 66 grader — det fins ingen slak side å slippe seg ned på her, bare kammen du kom opp.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,198 L47,196 L72,193 L98,190 L123,183 L142,180 L164,177 L186,171 L211,163 L238,155 L258,148 L281,143 L301,134 L323,126 L340,119 L356,110 L371,101 L393,88 L415,80 L440,73 L456,63 L472,54 L499,46 L516,47 L536,39 L560,33 L582,26 L600,18",
      startLabel: "63 moh",
      endLabel: "1587 moh",
      distanceLabel: "8,6 km",
      caption: "1559 høydemeter og 8,59 km fra Urkegjerdet over Haukåssætra, Nordkopen og egga, med det bratteste på de siste hundre høydemeterne.",
    },
  },
  kolastinden: {
    slug: "kolastinden",
    intro:
      "Sunnmøres mest kjente skitopp. Slak dalgang hele veien inn, så en nordvendt passasje over 45°, bre — og en topp som er halvannen meter bred.",
    ascent: [
      "Fra parkeringen ved Standaleidet, 376 moh, følger du den ryddede traseen nordover mot Fossane under Søre Sætretind. Skogen slipper på 474 moh, og fossen markerer inngangen til Kvanndalen.",
      "Følg dalbunnen langs elvefaret nordover. Terrenget er slakt: det bratteste hundremeterspennet, mellom 800 og 900 moh, ligger på 17,6° i snitt. Ikke sving vest der dalen åpner seg rundt 650 moh — det juvet fører opp i breens utløp. Hold nordover til Appelsinhaugen på 950 moh, den naturlige rasten halvveis.",
      "Fra Appelsinhaugen går du vest-sørvestover inn på flata i Kvanndalsskardet, drøyt 1020 moh. Herfra og opp til Stretet er det bratt: målte trinn i den nordvendte siden går over 45°. Stretet ligger på 1140 moh, en trang passasje på egga, og over den ser du toppen.",
      "Over Stretet er du på Kolåsbreen, som ligger som bre fra 1173 til 1355 moh. Følg brekanten under egga sørvestover mot toppen. De fleste tar av skia rundt 1350 moh og går den siste kneika, som måler 47°. Toppen er 1432 moh, halvannen til to meter bred og ti meter lang, med skavl mot øst — hold deg midt på — og en vestside som faller 260 høydemeter på 180, med tjuemeterssteg opp mot 75°.",
    ],
    descent: [
      "Ned samme vei møter du de to bratte trinnene i motsatt rekkefølge: toppslippet fra 1432 til 1350, som måler 47°, og den nordvendte siden fra Stretet ned mot Kvanndalsskardet, der målte trinn går over 45°. Begge tas på skrå og med avstand mellom folk. Fra Kvanndalsskardet og ned holder terrenget seg under 30° hele veien ut Kvanndalen.",
      "Vanligste feil: å legge seg for langt vest på vei ned fra Appelsinhaugen. Da havner du i juvet som drenerer breen ut av Kvanndalen — trangt, med bratte sider over seg. Hold elvefaret i dalbunnen til du ser Fossane.",
      "På dager uten skredfare gir Kolåsbreen en videre nedkjøring med flere linjevalg. Bresprekken mellom breen og toppslippet åpner seg utover sesongen: dekt i høyvinteren, åpen når det lir mot vår.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Dalgangen gjennom Kvanndalen er slak, 17,6° i snitt over det bratteste hundremeterspennet. Bratt terreng møter du to steder: den nordvendte siden fra Kvanndalsskardet opp til Stretet, der målte trinn går over 45°, og toppslippet over 1350 moh på 47°. Begge vender nord.",
      },
      {
        title: "Terrenget rundt",
        body: "Østsiden av Kvanndalen tar imot skredløpene fra Sætretindane, og utløpssonene ligger i dalbunnen du går i — flere av dem krysses på vei inn. Vestover, der dalen åpner seg rundt 650 moh, går utløpsjuvet fra Kolåsbreen: trangt, med bratte sider over seg.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade. Isøks hører med over Stretet, og stegjern når snøen er hard.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L33,194 L56,194 L81,195 L109,184 L129,171 L153,164 L176,157 L200,154 L229,153 L248,148 L272,140 L296,134 L319,123 L338,113 L362,102 L380,103 L400,95 L424,82 L441,74 L457,70 L477,67 L496,58 L529,48 L557,38 L579,30 L592,25 L600,18",
      startLabel: "376 moh",
      endLabel: "1432 moh",
      distanceLabel: "5,7 km",
      caption: "376 moh ved Standaleidet til 1432 på Kolåstinden — 1120 høydemeter på 5,67 kilometer, med bre fra 1173 moh.",
    },
  },
  vassdalstinden: {
    slug: "vassdalstinden",
    intro:
      "1214 høydemeter fra 92 moh i Nupen, gjennom Bukkedalen og opp en lang flanke som holder 27,8 grader i snitt de siste hundre. Bratteste sammenhengende parti måler 50,6 grader og ligger høyt i flanken under toppen, mellom 1133 og 1171 moh.",
    ascent: [
      "Start ved bilparkeringa etter bommen i Nupen, 92 moh. Fri Flyt oppgir «3 timer fra Vallasætra» og «4 timer fra Nupen», og forskjellen er reell: setra ligger på 324 moh, og den videre veien dit er bomvei som bare gjelder «hvis veien er åpen».",
      "Følg Engesetvegen oppover og østover til Vallasætra. De første 766 metrene grunn er flate — 0,7 grader — og så begynner veien: 5,3 grader fra 100 til 200 moh, 9,2 fra 200 til 300 og et brattere parti på 20,3 og 21,8 grader mellom 400 og 600 moh. Skogen holder til 581 moh langs linja. Derfra går den i åpent terreng langs kanten av et skogholt som den streifer på 637 moh, og fra 640 moh er det åpent for godt.",
      "Fra setra går du noen hundre meter inn Langedalen og deretter bratt opp kneiken til Bukkedalen, 791 moh — eventuelt med skiene på sekken. Bandet fra 700 til 800 moh er slakt, 8,9 grader over 632 meter grunn, og gir deg pusterommet før flanken.",
      "Følg dalbunnen innover til 960 moh, der den bratte, lange flanken begynner. Herfra stiger linja jevnt og hardt: 19,5 grader fra 1000 til 1100 moh, 22,5 fra 1100 til 1200 og 24,4 fra 1200 til 1300, med bratteste sammenhengende parti på 50,6 grader mellom 1133 og 1171 moh, i flanken under toppen. Toppen står på 1278. Like før flanken begynner går linja 97 meter over et tjern på 946 moh, opptil 40 meter fra land. Det er naturlig og uregulert, og uten navn i registeret.",
    ],
    descent: [
      "Ned samme flanken til dalbunnen, ut Bukkedalen og ned kneiken til Vallasætra og Nupen. Fallretningen er øst, og flanken er både oppstigningen og nedkjøringen.",
      "Vanligste feil: å navigere seg vestover fra toppen i dårlig sikt. Fra skaret nord for toppen faller Vestrenna 700 høydemeter i 45 til 50 grader ned i Nupadalen. Den er en dokumentert ekspertlinje for dem som velger den med åpne øyne, og en alvorlig feil for dem som ikke vet at den er der.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "To bratte partier med et slakt mellomspill: kneiken opp til Bukkedalen mellom 400 og 600 moh (20,3 og 21,8 grader i snitt) og flanken fra 960 moh til toppen, der bandet fra 1200 til 1300 moh måler 24,4 grader og bratteste sammenhengende parti 50,6. Begge er skredterreng.",
      },
      {
        title: "Terrenget rundt",
        body: "Vestrenna fra skaret nord for toppen stuper 700 høydemeter i 45 til 50 grader ned i Nupadalen. Den er ikke ruta, men den er nær nok toppen til at feil retning i skodde tar deg dit.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L33,200 L61,199 L91,196 L118,194 L139,192 L167,185 L187,177 L216,169 L240,167 L269,165 L298,163 L316,159 L330,149 L346,141 L366,126 L379,117 L403,106 L424,101 L448,92 L472,87 L497,72 L517,69 L542,57 L562,46 L575,38 L597,23 L600,18",
      startLabel: "92 moh",
      endLabel: "1278 moh",
      distanceLabel: "6,6 km",
      caption: "1214 høydemeter og 6,63 km fra Nupen over Vallasætra og Bukkedalen, med skoggrensa på 637 moh og flanken fra dalbunnen på 960 moh til toppen.",
    },
  },
  saudehornet: {
    slug: "saudehornet",
    intro:
      "1161 høydemeter rett opp fra Ørsta sentrum, og Fri Flyt graderer turen «Komplekst» av en grunn: ryggkammen holder rundt 32 grader i snitt de siste 170 høydemeterne med det bratteste partiet på 37, og på hard snø gir en utglidning der lang utløpsbane. Fri Flyt regner med at mange tar skia på sekken det siste stykket.",
    ascent: [
      "Fra parkeringa ved vasshuset øverst i Vikegeila, 149 moh, følger du anleggsveien oppover Skåla. Skogen slutter rundt 456 moh og terrenget er åpent fra 473. Ved om lag 395 moh går du av veien der en kartlagt sti tar av — det er samme stedet Fri Flyt beskriver med «på skrå mot Vikeelva, kryss elva».",
      "Over elva sikter du mot det laveste punktet på ryggen mellom Vallahornet og Saudehornet, 812 moh. Skaret ligger lenger øst enn en rett linje mellom de to toppene skulle tilsi; ryggkammen selv har laveste punkt der, og en kartlagt sti følger den om lag tretti meter unna.",
      "Over skaret følger du sørryggen om lag 490 høydemeter opp til toppen på 1303 moh. Stigninga er jevn til rundt 1137 moh og blir så brattere. Målt langs selve ryggkammen fra 1135 moh og opp er stegene 33, 30, 37 og 25 grader over om lag seksti meter: ryggen er brattest midtveis, rundt 1266 moh, og slakker inn mot toppkulen. Fri Flyt regner med at mange tar skia på sekken de siste 200 høydemeterne.",
      "Langs toppeggen ligger det skavl. Du kan ikke gå helt ut på kanten, og det er verdt å vite før du står der og vil ha utsikten mot Hjørundfjorden.",
    ],
    descent: [
      "Vanligste nedkjøringa går samme veien, men gjerne på flanken på skiløperens høyre side av renna — sørvestflanken, som holder om lag 37 grader i 600 høydemeter. Fra toppen faller terrenget 1303 til 1031 til 834 til 717 moh mot sørvest, altså 36 til 38 grader over de første 470 høydemeterne. Det er sammenhengende bratt kjøring i ett strekk.",
      "Vanligste feil: å tro at «rett ned mot Ørsta» er vest. Rett vest for skaret er hellinga 14 til 17 grader, men det gjelder bare nede ved skaret: fra 1270 moh og opp måler vestflanken 24 til 45 grader, og rett vest for toppen 32 til 47. Vest er uansett en annen side av fjellet enn den som fører deg ned til bilen. Nedkjøringa er sørvestvendt, og Fri Flyt nevner mulige sprekker i rennene på vestsida.",
      "Den andre feilen er å måle turen etter hvor kort den er. 1157 høydemeter fra sentrum av en by gjør ikke fjellet snilt — skredterrenget begynner i Skåla og holder fram hele veien opp.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Det er skredterreng fra Skåla og hele veien opp. Sørryggen er bratt nok til at en utglidning på hard snø får lang utløpsbane: ryggkammen fra 1135 moh og opp holder rundt 32 grader i snitt, med det bratteste partiet rundt 1266 moh på 37 grader. Tallene for selve skisporet er lavere — 33,7 grader som bratteste parti og 23,2 i snitt for bandet 1200 til 1300 moh — fordi sporet sikk-sakker over ryggen.",
      },
      {
        title: "Terrenget rundt",
        body: "Langs toppeggen ligger det skavl, så kanten er ikke en utsiktsplass. Sørvestflanken, som er nedkjøringa, holder om lag 37 grader i 600 høydemeter — 36 til 38 grader over de første 470 fra toppen. Fri Flyt nevner mulige sprekker i rennene på vestsida. Fjellet ligger rett over Ørsta sentrum, men det er ikke en snilltur, og det er for erfarne.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L33,192 L66,184 L93,177 L119,170 L146,163 L172,157 L192,157 L212,149 L238,140 L258,134 L275,128 L289,122 L307,114 L321,108 L341,101 L357,97 L384,94 L410,92 L436,84 L450,78 L470,71 L490,62 L503,56 L516,50 L529,44 L543,40 L551,37 L567,31 L582,24 L595,20 L600,18",
      startLabel: "149 moh",
      endLabel: "1303 moh",
      distanceLabel: "4,1 km",
      caption: "1157 høydemeter og 4,00 km fra vasshuset i Ørsta, med de siste 170 høydemeterne på sørryggen i 33–39 grader.",
    },
  },
  slogen: {
    slug: "slogen",
    intro:
      "Sunnmørsalpenes dronning, og en av de mest alvorlige turene i landsdelen. 1536 høydemeter fra Norangsdalen til en topp de fleste går de siste 350 metrene til fots.",
    ascent: [
      "Fra veilomma ved Skylstad i Norangsdalen, 85 moh, går du rett opp Brekkheida. Hold deg vest for Brekkeelva gjennom hele skogen — elva ligger et par hundre meter øst for linja, og du kommer først inn på elvefaret oppe på flata rundt 700 moh. Dette er den bratteste delen av skogen: de hundre metrene mellom 200 og 300 moh ligger på 21,9° i snitt, og de under, 100 til 200 moh, på 19,0°.",
      "Skoggrensa slipper på 681 moh. Videre følger du sporet mot Patchellhytta inn på flata sørvest for hytta, drøyt 795 moh. Her forlater du hyttesporet. Sving vest opp østryggen før du krysser 1000-meteren — går du lenger inn mot Steinreset, må du hente igjen høyden på feil side av ryggen.",
      "Pukkelen topper på 1143 moh. Derfra faller ryggen 26 meter til et skar før den stiger til høyde 1204, og videre er det 56 meter ned til kolen på 1148 før selve toppryggen. Hold deg til høyre for ura.",
      "De siste 350 høydemeterne går de fleste til fots. Toppryggen smalner for hvert steg: 40 høydemeter under toppen faller nordsiden 43° og sørsiden 50°, og fra selve toppen måler nordflanken 57° og sørflanken 49° over de første 200 metrene ut. De øverste 70 meterne er knivegg. Toppen er 1564 moh.",
    ],
    descent: [
      "Ned går samme vei: til fots ned toppryggen, på ski igjen fra kolen på 1148 moh, tilbake over høyde 1204 og Pukkelen og ned østryggen til flata ved 795 moh. Derfra ned Brekkheida til Skylstad.",
      "Vanligste feil: å la seg friste av snøfeltene på flankene i stedet for å holde egga. Begge sider er brattest rett under kammen. Nordsiden går 57° over de første 200 metrene og holder over 50° i 300 høydemeter før den slaker av i ura rundt 1080 moh; sørsiden faller 49°, med et hamreband mellom 1530 og 1395 moh der enkelttrinn måler 78°. Det er her det har gått alvorlige ulykker. Hold ryggen til du er tilbake på Pukkelen.",
      "Sørsiden rett ned mot Norangsdalen ser kort ut fra toppen. Den faller nær 1500 høydemeter til dalbunnen og ligger på 44° i snitt fra 1200 moh og ned til 350, med enkelttrinn over 50°. Sommerråsa fra Øye-parkeringen går ikke her — den følger sørøstryggen på 25–33° og kommer inn på østryggen ved høyde 1204. Sørsiden er ingen nedkjøring.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skogpartiet over Brekkheida er brattest mellom 200 og 300 moh, 21,9° i snitt. Det bratteste enkelttrinnet på hele linja måler 46,9°, og det ligger ikke i skogen — det er toppblokka over 1520 moh, den delen skiene uansett bæres opp. Ryggen fra Pukkelen til høyde 1204 er snill: flankene der ligger på 26–35°. Det er de øverste 250 høydemeterne som er egg — nordsiden 43–57°, sørsiden 49–50°. Der er utglidning den reelle faren, og det er derfor skia blir båret.",
      },
      {
        title: "Terrenget rundt",
        body: "Øst for Brekkheida ligger Karvigrova og Smørskredene, ei grov og en hel fjellside som begge tømmer seg ned mot Norangsdalen. Karvigrova går bare drøyt hundre meter øst for linja nede i skogen; driver du østover på vei ned, er du i den. Sørsiden av fjellet, rett over Norangsdalen, faller nær 1500 høydemeter og ligger på 44° i snitt gjennom midtpartiet.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og isøks: toppryggen går til fots, og snøflankene under den krever bremseteknikk.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L22,200 L46,199 L68,191 L83,185 L102,175 L122,165 L146,153 L164,145 L185,138 L207,130 L233,124 L262,119 L286,115 L309,113 L330,106 L355,97 L381,92 L404,89 L427,81 L449,71 L470,71 L491,63 L512,61 L529,53 L542,45 L558,38 L571,31 L590,24 L600,18",
      startLabel: "85 moh",
      endLabel: "1564 moh",
      distanceLabel: "6,4 km",
      caption: "85 moh ved Skylstad til 1564 på Slogen — 1520 høydemeter på 5,81 kilometer, de siste 350 til fots.",
    },
  },
  torvloysa: {
    slug: "torvloysa",
    intro:
      "1469 høydemeter på 11,13 km fra Hatlestad — en av de lengste turene i Norddal, og en av de slakeste. Bratteste sammenhengende parti måler 27,2 grader, og fem kilometer av ruta ligger på ryggen fra Daurmålsfjellet til toppen.",
    ascent: [
      "Start på den kartfestede parkeringa på Hatlestad, 453 moh, over Norddalen. Fri Flyt skriver at du parkerer på 350 moh; terrengmodellen leser gårdene til 412 og p-plassen til 453, og differansen er grunnen til at turen her måler 1469 høydemeter og ikke 1500.",
      "Gå slakt inn i munningen av Dyrdalen og opp til Rellingsætra på 557 moh. De to første bandene er nesten flate — 3,0 grader fra 400 til 500 moh og 2,1 over 2656 meter grunn fra 500 til 600.",
      "Fra setra tar kneiken opp på Daurmålsfjellet, 825 moh: 15,4 grader fra 600 til 700 moh og 15,5 fra 700 til 800. Skogen holder til 800 moh. Dette er den bratte delen av turen, og den er kort.",
      "Så følger ryggen. Fem kilometer i slakt terreng, over ryggpunktet på 1186 moh, med band mellom 7 og 16 grader hele veien: 7,0 fra 1000 til 1100 moh, 15,5 fra 1200 til 1300, 16,4 fra 1700 til 1800 — bratteste hundremeteren — og 9,9 de siste hundre til varden på 1851 moh. Kartverket registrerer ikke breterreng noe sted på selve linja: hvert punkt mellom 1380 og 1520 moh er åpent område. Den nærmeste cella som er klassifisert SnøIsbre ligger omtrent 300 meter fra ruta, på 1482 moh.",
    ],
    descent: [
      "Ned samme ryggen: nordover til Daurmålsfjellet, ned kneiken til Rellingsætra og ut Dyrdalen til Hatlestad. Fallretninga er nord, og nedkjøringa er lang og jevn heller enn bratt.",
      "Vanligste feil: å vende for seint. Ti kilometer uten ly, med det meste av høyden langt fra bilen, gjør at et værskifte koster mer her enn på en kort tur — vendinga må avgjøres tidlig, ikke når du står på ryggen og ser at det trekker til.",
      "Den andre er sidene av ryggen. Den er bred nok til at du ikke tenker på kantene, men den faller av utenfor: fra varden måler vest 40,9 grader i snitt over 500 meter, sørvest 36,2 og sørøst 35,2, med 60-metersvinduer på 49,3, 54,4 og 47,5. Nord og øst, som er veien hjem, holder 9,0 og 9,3 grader. Ti kilometer i skodde på en rygg som er slak i to retninger og bratt i seks er en orienteringsoppgave, ikke en tur du improviserer.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak i begge ender og bratt ett eneste sted: kneiken fra Rellingsætra opp på Daurmålsfjellet. Bratteste hundremeteren, 1700 til 1800 moh, måler 16,4 grader og bratteste sammenhengende parti 26,9 grader mellom 1488 og 1508 moh. Ryggen ellers ligger mellom 7 og 16 grader.",
      },
      {
        title: "Terrenget rundt",
        body: "Ryggen er bred og slak, men sidene er det ikke: vest 40,9 grader i snitt fra varden, sørvest 36,2 og sørøst 35,2. Nord og øst — veien hjem — holder 9 grader. Det er lengden og orienteringa som er den reelle faren her: ti kilometer fra bilen i dårlig vær er en annen tur enn ti kilometer i sol.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,199 L48,198 L66,190 L91,187 L115,185 L136,188 L162,187 L185,186 L204,179 L224,163 L243,154 L265,152 L287,148 L309,143 L333,137 L355,127 L377,119 L403,113 L423,105 L440,101 L461,87 L481,76 L503,69 L522,60 L546,50 L568,36 L590,23 L600,18",
      startLabel: "453 moh",
      endLabel: "1851 moh",
      distanceLabel: "11,1 km",
      caption: "1469 høydemeter og 11,13 km fra Hatlestad over Rellingsætra og Daurmålsfjellet, med skoggrensa på 803 moh og ryggen fra 1186 moh til varden.",
    },
  },
  skarene: {
    slug: "skarene",
    intro:
      "1226 høydemeter på 6,59 km fra Korsmyra, med to kilometer flat dalbotn før den store snøflanken tar til. Flanken holder 18 til 21 grader i band etter band fra 900 til 1700 moh — og den er sammenhengende skredterreng hele veien.",
    ascent: [
      "Start på biloppstillingsplassen på Korsmyra, 621 moh, ved hovedveien mellom Eidsdal og Geiranger. Tilkomsten står under Eidshornet hos Fri Flyt, og det er den samme plassen.",
      "Følg seterveien inn til Grandesætra på 648 moh og videre slakt inn og oppover Gråsteindalen, 721 moh. De to første bandene er nesten flate: 3,7 grader over 1268 meter grunn fra 600 til 700 moh og 3,6 over 1575 meter fra 800 til 900.",
      "Kommet inn mot botnen av dalen på 940 moh tar den store snøflanken til, og den holder samme karakter helt opp: 17,9 grader fra 900 til 1000 moh, 20,5 fra 1000 til 1100, 19,6 fra 1300 til 1400, 21,2 fra 1500 til 1600 og 21,2 fra 1600 til 1700 — de to bratteste hundremetrene. Bratteste sammenhengende parti måler 27,9 grader mellom 1528 og 1544 moh.",
      "De siste hundre høydemetrene slaker av til 9,6 grader og fører fram til varden på 1830 moh, et av de høyeste punktene i fjellene over Eidsdal. Registeret skriver fjellet Skorene.",
    ],
    descent: [
      "Ned samme flanken og ut Gråsteindalen til Grandesætra og Korsmyra. Fri Flyt kaller dette flott skiterreng med snille hellingsvinkler, og tallene er enige: ingen band over 21,3 grader.",
      "Vanligste feil: å lese de snille hellingsvinklene som en grunn til å gå på en ustabil dag. Hele strekket fra botnen av Gråsteindalen og opp er skredterreng, flanken er stor og sammenhengende, og det finnes ingen linje rundt den — turen bør gås på stabile dager, og det er hele vurderingen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "En sammenhengende snøflanke fra 940 moh til toppen, med band mellom 17,9 og 21,2 grader og bratteste sammenhengende parti på 27,9 grader mellom 1528 og 1544 moh. Hellinga er moderat; det er størrelsen og sammenhengen som er problemet.",
      },
      {
        title: "Terrenget rundt",
        body: "Skredterreng fra botnen av Gråsteindalen og hele veien opp til toppen. Flanken er stor og sammenhengende, og det finnes ingen linje rundt den: går du turen, går du i den. Og toppen er ikke slak på baksida: vest måler 40,0 grader i snitt over 500 meter med et 67,7-graders vindu, nordvest 29,5 med 70,4 og nordøst 37,7 med 65,6. Sør og sørøst — flanken du kom opp — holder 13 grader.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,198 L50,198 L77,194 L107,190 L136,185 L161,181 L184,176 L210,171 L236,169 L266,169 L292,168 L316,165 L345,156 L365,145 L382,135 L398,125 L427,112 L446,102 L470,88 L488,77 L505,67 L521,56 L534,48 L554,36 L579,24 L600,18",
      startLabel: "621 moh",
      endLabel: "1830 moh",
      distanceLabel: "6,6 km",
      caption: "1219 høydemeter og 6,44 km fra Korsmyra over Grandesætra og Gråsteindalen, med snøflanken fra dalbotnen på 940 moh til varden på 1830.",
    },
  },
  melshornet: {
    slug: "melshornet",
    intro:
      "565 høydemeter på 3,30 km fra Helgatun, opp en preparert og merket løype som blir gått i mørket hele vinteren. Bratteste sammenhengende parti måler 23,8 grader, og det ligger nede i skogen, mellom 458 og 472 moh — ikke oppe under varden.",
    ascent: [
      "Start på den store parkeringsplassen ved Helgatun på Krøvelseidet, 252 moh, på fv5894 Vikebygdvegen mellom Volda og Åmdalen. Løypa tar av fra plassen og går rett inn i skogen. Den er tidvis preparert med tråkkemaskin, og den siste bakken er merket med brøytestikker.",
      "De første hundre og femti høydemetrene er slake: bandet fra 200 til 300 moh måler 5,3 grader i snitt over 580 meter grunn, og 300 til 400 moh 12,0 grader. Bratteste steget på hele turen ligger i skogen — 23,8 grader over tretti meter, mellom 458 og 472 moh.",
      "Mot ryggen ved 519 moh flater det ut, og ved 545 moh slipper skogen taket. Bandet fra 500 til 600 moh er det slakeste på turen, 6,7 grader over 855 meter grunn, og herfra ser du hvor resten av ruta går.",
      "Ryggen stiger jevnt til topps: 12,9 grader fra 600 til 700 moh og 13,1 fra 700 til 800. De siste høydemetrene til varden på 809 moh er flate — bandet over 800 moh måler 7,0 grader.",
    ],
    descent: [
      "Ned samme løypa, sørøstover. Det er den samme lia du gikk opp, kort og oversiktlig, og du har bilen i sikte det meste av veien ned.",
      "Vanligste feilen på dette fjellet er ikke et linjevalg, men et tidsvalg: turen blir gått i mørket gjennom hele vinteren, og da er traseen og brøytestikkene navigasjonen. Forlater du løypa, er sidene av Grøthornet skredterreng, og nær toppen kan det ligge skavl ut mot Ørsta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Preparert og merket løype i slakt terreng. Bratteste sammenhengende parti måler 23,8 grader og ligger lavt, mellom 458 og 472 moh, nede i skogen; over 500 moh er turen på sitt slakeste med 6,7 grader i snitt fra 500 til 600 moh, og bratteste hundremeteren, 400 til 500 moh, måler 13,6.",
      },
      {
        title: "Terrenget rundt",
        body: "Sidene av Grøthornet er skredterreng, og nær toppen kan det ligge skavl mot Ørsta. Begge deler ligger utenfor løypetraseen — og begge blir aktuelle i samme øyeblikk som du forlater den i dårlig sikt eller i mørket.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,198 L48,194 L65,191 L81,188 L106,182 L130,176 L147,170 L163,165 L186,156 L202,151 L212,147 L237,137 L253,128 L278,118 L287,113 L310,109 L327,110 L343,111 L359,111 L384,105 L400,98 L417,92 L434,85 L458,76 L474,73 L499,60 L515,51 L531,43 L556,34 L572,28 L589,21 L600,18",
      startLabel: "252 moh",
      endLabel: "809 moh",
      distanceLabel: "3,3 km",
      caption: "559 høydemeter og 3,00 km fra Helgatun på Krøvelseidet, med skoggrensa på 545 moh og bratteste hundremeteren mellom 400 og 500 moh.",
    },
  },
  jakta: {
    slug: "jakta",
    intro:
      "1569 høydemeter fra fjorden på under fem kilometer, og det meste av dem kommer i ett strekk. Fra Konedalen går en side opp på en smal topprygg — 25 til 33 grader nederst, 40 til 50 de siste 200 høydemetrene som har skavl mot Konedalen og en om lag 80 grader bratt vegg ned mot Hjørundfjorden på andre sida.",
    ascent: [
      "Fra veienden ved Lisjeholen sør for Norang-gårdene, 61 moh, tar du den bratte stien opp til Konedalen med skiene på sekken — først på venstre side av elva, så over på høyre. Skogen slutter rundt 395 moh og terrenget er åpent fra 398. Dette er den delen av turen som ikke er skitur, og den stiger 20 til 22 grader i snitt.",
      "Oppe i dalen tar du på deg skiene og følger det slake dalføret sørvestover til om lag 740 moh. Hold deg på sørøstre side på vei inn: det kan gå skred fra Jakta hele veien inn Konedalen, og dalbunnen er utløpssona.",
      "Ved 740 moh svinger du til høyre og sikk-sakker opp sida i nordvest til du når toppryggen ved 1240 moh. Sida er ikke jevn: nederst holder den 25 til 33 grader, men de siste 200 høydemetrene opp mot ryggen måler fallinja 40 til 50. Dette er den store skredfella på turen: et sammenhengende heng på 300 til 400 høydemeter, og det er også nedkjøringa. Linja slik den er tegnet holder 43,1 grader som bratteste sammenhengende parti, mellom 1244 og 1272 moh der den når ryggen — sikk-sakken er det som gjør tallet lavere enn fallinja.",
      "Ryggen følges sørvestover helt til topps på 1589 moh. Hold deg midt på den. Den bratteste hundremeteren på turen ligger mellom 1500 og 1600 moh og måler 24,6 grader i snitt, men det er ikke hellinga som er problemet på ryggen — det er bredden: en kryssprofil ved 62,1715 nord gir 1556 moh på ryggen og 1265 moh bare 52 meter nordvest for den.",
    ],
    descent: [
      "Vanligste nedkjøring er samme veien tilbake: 45 til 50 grader de første 200 høydemetrene fra ryggen, så 30 til 35 ned mot Konedalen og slakere videre ut dalen, og til slutt stien ned til Lisjeholen med skiene på sekken igjen. Sida ned fra ryggen er den beste kjøringa på turen og samtidig det bratteste og mest skredutsatte du er innom.",
      "Vanligste feil: å lese skavlene etter «høyre og venstre» i stedet for etter kompasset. Fri Flyt skriver om skavler både til høyre ned mot Konedalen og til venstre ned nordveggen, men det gjelder nedstigningen — på vei opp ligger Konedalen i sørøst og fjordveggen i nordvest. Nordvestsida er ikke en felle du kan korrigere for underveis: DTM1 måler om lag 80 grader rett under toppen, og fallet er nær 290 høydemeter på 52 meter grunn.",
      "Den andre feilen er å gå for langt inn i dalen før du tar av. Ruta svinger opp ved om lag 740 moh, 1,6 kilometer fra veienden. Første utkastet av denne ruta svingte opp mot dalbunnen lenger inne, og den linja måler 40 til 44 grader mellom 1030 og 1205 moh. Sida ved 62,174 til 62,176 nord er den som holder 33 til 36 hele veien til ryggen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Sida fra Konedalen opp til toppryggen er den store skredfella: 25 til 33 grader nederst og 40 til 50 de øverste 200 høydemetrene, i et sammenhengende heng på over 400, og du må gjennom den både opp og ned. Det kan gå skred fra Jakta hele veien inn Konedalen, så hold deg på sørøstre side på vei inn dalen. Bratteste sammenhengende parti på linja måler 43,1 grader, og bratteste hundremeter, 1500 til 1600 moh, 24,6 grader i snitt.",
      },
      {
        title: "Terrenget rundt",
        body: "Toppryggen har skavl til begge sider — mot Konedalen i sørøst, og mot nordvestveggen ned mot Hjørundfjorden, der DTM1 måler om lag 80 grader rett under toppen: 1556 moh på ryggen og 1265 moh 52 meter nordvest. En skavl som brekker på den sida har ingen utgang. Holder du deg midt på kammen fra 1240 moh og opp, er det den eneste linja som ikke har et stup eller et 35-graders heng under seg.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L34,194 L66,184 L83,179 L102,173 L121,167 L141,160 L160,152 L176,147 L200,137 L222,131 L244,122 L278,113 L311,106 L328,100 L344,95 L368,86 L393,79 L413,71 L426,67 L454,59 L472,57 L497,51 L524,42 L542,36 L565,32 L581,26 L600,18",
      startLabel: "61 moh",
      endLabel: "1589 moh",
      distanceLabel: "4,8 km",
      caption: "1569 høydemeter og 4,82 km fra Norang, med den 33–36 grader bratte sida fra Konedalen opp til toppryggen som turens nøkkelparti.",
    },
  },
  skarasalen: {
    slug: "skarasalen",
    intro:
      "1454 høydemeter i ett strekk fra bommen i Bondalen, og storhellinga midt på turen går rett ved siden av en renne som tømmer seg mot seterveien hver vinter. Toppplatået er lettvint når du først står på det — det er veien dit og skavlene over østveggen som gjør turen krevende.",
    ascent: [
      "Fra bommen på Kvistadvegen ovenfor Kvistad-gårdene, 104 moh, følger du den vinterstengte seterveien om lag 3,7 kilometer sørover og innover Kvistaddalen til parkeringa foran Kvistadsætra og Årsetsætra, 509 moh. De 405 høydemeterne opp seterveien er slake — bandet fra 100 til 500 moh ligger på 5 til 7 grader i snitt — og åpner bommen sent i april eller tidlig i mai, kan du kjøre dem og kutte både kilometerne og høydemeterne.",
      "Fra setrene går ruta nordøstover opp gjennom åpen bjørkeskog. Skogen holder til rundt 693 moh og terrenget er åpent fra 696.",
      "Så kommer storhellinga: opp mot skaret mellom Blåhornet og Skårasalen, 1074 moh, nord for og langsmed skredrenna øst for Blåhornet. Hellinga holder 30 til 40 grader fra om lag 800 til 1100 moh. Linja slik den er tegnet sikk-sakker og holder 26,7 grader som bratteste sammenhengende parti, med bandet fra 900 til 1000 moh på 19,3 grader i snitt — men renna ved siden av deg er den samme uansett hvor fint sporet ligger.",
      "Over skaret svinger du øst-nordøst opp hovedhellinga mot ryggen og inn på toppplatået ved 1448 moh, og siste stykket sørover langs platået til toppen på 1542 moh. Linja kommer inn på platået fra nordvest med vilje: øst for egga faller fjellet 300 høydemeter på 74 meter grunn, om lag 76 grader, ned i Skåradalen.",
    ],
    descent: [
      "Ned samme veien: nordvestover av toppen ned på platået, vestover langs platået og ned hovedhellinga til skaret, storhellinga ned mot setrene og seterveien ut. Sett av tid til de siste 3,7 kilometerne — de er flate nok til at du staker dem.",
      "Vanligste feil: å holde for langt øst på toppplatået — og å tro at sørvest er veien ned. Sørvest for toppen ligger Vestrennene på 45 grader; linja går nordvest. Skavlene ligger mot øst, og under dem faller østveggen 300 høydemeter på 74 meter. I flatt lys er egga ikke synlig, og platået gir ingen andre holdepunkter.",
      "Vestrennene ned til Årsetsætra er 45 grader og er ikke en del av denne ruta. Den tredje dokumenterte nedkjøringa, Lisje Skåradalen mot Skår ved Hjørundfjorden, er 25 til 30 grader krusterreng — men den ender ved fjorden, ikke ved bilen din i Bondalen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Renna øst for Blåhornet går vanligvis ett eller flere store skred ned mot seterveien hver vinter, og oppstigningen går rett ved siden av den. Hellinga holder 30 til 40 grader fra om lag 800 til 1100 moh, og det er turens nøkkelparti både opp og ned. Selve linja måler 26,7 grader som bratteste sammenhengende parti fordi den sikk-sakker; det endrer ikke hva som ligger over sporet.",
      },
      {
        title: "Terrenget rundt",
        body: "På toppplatået ligger det store skavler mot øst, der fjellet faller 300 høydemeter på 74 meter ned i Skåradalen — om lag 76 grader. Hold god avstand fra egga. Vestrennene, som er en dokumentert nedkjøring for andre partier, er 45 grader og ligger utenfor denne ruta.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L19,198 L46,194 L73,189 L96,184 L127,176 L148,171 L173,166 L196,161 L223,157 L245,156 L272,152 L295,149 L315,149 L340,146 L361,138 L386,125 L411,111 L427,104 L440,96 L455,87 L475,78 L498,71 L515,61 L530,52 L546,42 L566,32 L594,21 L600,18",
      startLabel: "104 moh",
      endLabel: "1542 moh",
      distanceLabel: "7,5 km",
      caption: "1438 høydemeter og 7,62 km fra bommen på Kvistadvegen, der de første 3,7 kilometerne er stengt setervei og 405 høydemeter.",
    },
  },
  kvitegga: {
    slug: "kvitegga",
    intro:
      "1391 høydemeter på 5,33 km fra Nibbedalen til det høyeste fjellet i midtre Sunnmørsalpane. Brattbakken er den ene tekniske delen av turen: bandet fra 1100 til 1200 moh måler 22,5 grader i snitt, og rutebeskrivelsen setter bakken til om lag 35 grader.",
    ascent: [
      "Start i grustaket i Nibbedalen, 324 moh, der sideveien tar av fra fv655. Er veien ikke brøytet, parkerer du langs fylkesveien. De første 771 meterne grunn ligger på 5,9 grader.",
      "Følg grusveien et lite stykke og deretter sommerstien sørvestover inn Snødalen — rutebeskrivelsen sier vestover, men etappen måler 210 grader. Stigninga er jevn og vedvarende: 20,1 grader fra 500 til 600 moh, 19,6 fra 600 til 700 og 19,0 fra 700 til 800. Ved 925 moh er du inne i selve dalen.",
      "Innerst tar Brattbakken til — bakken opp mot 1316 moh som rutebeskrivelsen setter til om lag 35 grader. Terrengmodellen måler bandet fra 1100 til 1200 moh til 22,5 grader i snitt og det bratteste 30-metersvinduet i bakken til 29,9 grader mellom 1200 og 1218 moh. Bratteste sammenhengende parti på hele turen, 33,5 grader mellom 883 og 903 moh, ligger lenger nede i Snødalen. Kartverket registrerer breterreng fra 1224 moh.",
      "Bakken fortsetter til om lag 1300 moh — bandet fra 1200 til 1300 måler 20,4 grader over 271 meter grunn — og over den flater det brelagte platået ut: 7,7 grader fra 1500 til 1600 moh over 757 meter grunn. Du følger det under høyden på 1583 moh, gjennom et lite skar og nordover langs ryggen til toppen på 1700 moh. Den publiserte høyden 1717 er snøkuppelen; terrengmodellen leser fjellet til 1700.",
    ],
    descent: [
      "Ned samme veien: sørover langs ryggen, over platået og ned Brattbakken til Snødalen. Fallretninga er øst — men det er retninga hjem, ikke det første steget: fra varden går ruta sørover langs ryggen til skaret under høyden på 1583 moh før den svinger ned. Rett øst for toppen måler flanken 39,2 grader i snitt med et 73,1-graders vindu 190 til 250 meter ut, og det er ikke en nedkjøring. Brattbakken er den delen av den rette nedkjøringa som avgjør om dagen er en skitur eller en øvelse i kantsikring.",
      "Vanligste feil: å gå på breen uten å ta den på alvor. Ruta krysser breterreng fra 1290 moh, og sprekkene er der uansett hvor slakt platået måler. Den andre er skavlene langs toppryggen — hold avstand til kantene, særlig i dårlig sikt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jevn stigning på 19 til 20 grader gjennom Snødalen, og så Brattbakken: bandet fra 1100 til 1200 moh måler 22,5 grader i snitt og bratteste 30-metersvindu i bakken 29,9 grader mellom 1200 og 1218 moh. Bakken er skredterreng, og den er den eneste veien opp på platået.",
      },
      {
        title: "Terrenget rundt",
        body: "Breterreng fra 1290 moh med sprekker senvinters og utover våren. Store skavler langs toppryggen — hold avstand til kantene. Platået er slakt nok til at du slutter å lese terrenget, og det er nettopp der breen ligger.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L28,200 L56,197 L82,190 L107,185 L132,178 L153,169 L172,162 L184,156 L203,148 L221,141 L239,136 L259,129 L274,121 L295,113 L314,105 L335,96 L355,87 L375,76 L394,70 L416,62 L442,51 L462,43 L480,36 L496,37 L522,35 L552,28 L577,23 L600,18",
      startLabel: "324 moh",
      endLabel: "1700 moh",
      distanceLabel: "5,3 km",
      caption: "1391 høydemeter og 5,33 km fra grustaket i Nibbedalen gjennom Snødalen, over Brattbakken og under høyden på 1583 moh til toppen.",
    },
  },
  hornindalsrokken: {
    slug: "hornindalsrokken",
    intro:
      "1460 høydemeter på 7,28 km fra Langøylia, over en sørrygg som går opp og ned — 327 høydemeter blir gitt fra seg på vei opp. De siste 103 går på smal, eksponert rygg der bratteste sammenhengende parti måler 40,5 grader, og der setter de fleste skia igjen.",
    ascent: [
      "Start ved vestenden av hytteveien i Langøylia, 388 moh, mellom Hellesylt og Hornindal. Gå opp lia gjennom åpen løvskog, øst for Gjøelva; skogen holder til 798 moh, og bandet fra 600 til 700 moh måler 18,9 grader.",
      "Ved Aksla på 921 moh er du oppe på ryggen. Følg den nordvestover til Trollaksla, 1255 moh, og deretter sørryggen nordover til Sætrenibba på 1370 moh. Ryggen går opp og ned hele veien: bandene fra 1100 til 1300 moh måler 3,7 og 3,5 grader over til sammen mer enn tre kilometer grunn, og turen gir fra seg 327 høydemeter samlet.",
      "Fra skaret nord for Sætrenibba, 1226 moh, runder du østover inn i sida som faller mot Kjellstaddalen og traverserer den opp mot ryggen øst for toppen. Dette er skredterreng, og det er den samme sida du kjører ned.",
      "Ved om lag 1424 moh er du på østribba, og der tar de fleste av seg skia. De siste 103 høydemeterne er smal og eksponert rygg: bandet fra 1400 til 1500 moh måler 24,2 grader i snitt, bratteste sammenhengende parti 40,5 grader mellom 1482 og 1508 moh, og terrengmodellen gir om lag 55 grader rett øst for ryggen og 75 rett vest.",
    ],
    descent: [
      "Vanligste nedkjøring er Kjellstaddalen: nesten tusen høydemeter i 25 til 35 grader ned til Kjellstadsætra, og deretter et par flate kilometer ut dalen og vestover tilbake til bilen. Fallretninga er øst.",
      "Vanligste feil: å tro at toppryggen er skiterreng. De siste 103 høydemeterne er en rygg med 55 grader ned den ene sida og 75 ned den andre — et feiltrinn der er ikke til å rette opp, og isøks er vanlig når snøen er hard.",
      "Den andre er å starte for sent. Turen er lang, ryggen går opp og ned, og traversen over østsida ovenfor Kjellstaddalen er skredterreng som endrer seg med sola. Vending må avgjøres tidlig.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "En lang rygg som går opp og ned, og en travers over østsida ovenfor Kjellstaddalen. Bandet fra 1400 til 1500 moh måler 24,2 grader i snitt, og bratteste sammenhengende parti 40,5 grader mellom 1482 og 1508 moh — det siste er østribba, ikke skisporet.",
      },
      {
        title: "Terrenget rundt",
        body: "Skredterreng i bunnen av Kjellstaddalen og i hele østsida opp mot toppryggen — det er både traversen på vei opp og nedkjøringa. Toppryggen er smal og skavlete: om lag 55 grader rett øst og 75 rett vest de siste hundre høydemeterne.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og isøks når snøen er hard — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,192 L58,179 L84,164 L100,154 L118,142 L136,131 L155,122 L174,115 L196,106 L218,96 L244,85 L269,75 L289,63 L315,68 L337,76 L357,77 L378,73 L400,76 L422,68 L444,56 L459,45 L478,55 L501,65 L523,65 L545,58 L559,47 L581,36 L595,21 L600,18",
      startLabel: "388 moh",
      endLabel: "1527 moh",
      distanceLabel: "7,3 km",
      caption: "1460 høydemeter og 7,28 km fra Langøylia over Aksla, Trollaksla og Sætrenibba, med østribba fra 1424 moh som stykket de fleste går til fots.",
    },
  },
  sunndalsnipa: {
    slug: "sunndalsnipa",
    intro:
      "989 høydemeter på 5,56 km fra Grøndalsvatnet, opp en sørøstrygg og ut på et platå der de siste 1261 metrene grunn ligger på 4,2 grader. Solvendt og tilgjengelig gjennom hele vinteren — veien inn er åpen året rundt.",
    ascent: [
      "Start ved veienden ved Grøndalsvatnet, 437 moh, opp bakkene fra Osdalen. De første 638 metrene grunn er slake, 5,7 grader, og går over myr og inn i åpen løvskog.",
      "Gå nordover gjennom skogen — Kartverket fører skog til 722 moh — og opp på sørøstryggen. Stigningen øker jevnt: 14,7 grader fra 500 til 600 moh, 15,6 fra 600 til 700 og 19,6 fra 700 til 800, som er bratteste hundremeteren på turen.",
      "Ved skogkanten på 839 moh flater det ut markert: bandet fra 800 til 900 moh måler 5,2 grader over 1035 meter grunn. Så tar ryggen til igjen, 14,0 grader fra 900 til 1000 moh og 17,3 fra 1100 til 1200, med bratteste sammenhengende parti på 29,0 grader mellom 1073 og 1094 moh.",
      "Fra 1280 moh er du på platået, og derfra er det om lag en kilometer nordover til toppvarden på 1395 moh — bandet fra 1300 til 1400 moh måler 4,2 grader. Hold deg midt på platået: både vest- og østsida faller bratt.",
    ],
    descent: [
      "Ned samme ryggen, sørover over platået og ned gjennom løvskogen til Grøndalsvatnet. Fallretningen er sør, og det er den solvendte sida — føret skifter fort utover dagen om våren.",
      "Vanligste feil: å ta ut mot kanten på platået i skodde. Både vest- og østveggen faller bratt fra platået, og på en flate som ligger på 4,2 grader fins det ingen helling som forteller deg at du er på vei feil.",
      "Den andre er sørflanken. Fri Flyt nevner den som en brattere nedkjøring på stabile dager; den er skredterreng, og den er et eget valg — ikke en snarvei ned fra platået.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak i begge ender og jevn i midten: bratteste hundremeteren, 700 til 800 moh, måler 19,6 grader, og bratteste sammenhengende parti 29,0 grader mellom 1073 og 1094 moh. Platået fra 1300 til 1400 moh ligger på 4,2 grader over 1261 meter grunn.",
      },
      {
        title: "Terrenget rundt",
        body: "Bratte vestre og østre vegger fra platået — det er en orienteringsfelle i skodde og snødrev heller enn et skredproblem i seg selv. Sørflanken er den brattere nedkjøringa, og den er skredterreng.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,198 L49,193 L74,186 L89,179 L113,168 L132,160 L150,149 L166,138 L181,130 L200,123 L221,123 L244,122 L259,121 L283,117 L301,106 L321,96 L346,91 L365,84 L380,76 L395,67 L410,57 L438,48 L457,39 L472,32 L493,27 L511,26 L532,24 L554,23 L579,19 L600,18",
      startLabel: "437 moh",
      endLabel: "1395 moh",
      distanceLabel: "5,6 km",
      caption: "989 høydemeter og 5,56 km fra Grøndalsvatnet opp sørøstryggen, med skoggrensa på 722 moh og en kilometer flatt platå fram til varden.",
    },
  },
  eidskyrkja: {
    slug: "eidskyrkja",
    intro:
      "1115 høydemeter på 4,56 km fra Skinnviksætra opp Blåbreen, en jevn bre som legger seg gradvis slakere mot toppplatået. Bratteste sammenhengende parti måler 33,6 grader — det er sprekkene og orienteringen, ikke hellinga, som gjør denne turen kompleks.",
    ascent: [
      "Start på seterveien ved Skinnviksætra, 368 moh, på nordsida av Austefjorden. Veien inn er bomvei, og turen regner man som tilgjengelig etter at den åpner — det er derfor sesongen står som mars til mai.",
      "Gå sørover og opp mot breen. Terrenget er åpent hele veien; det er ingen skog på denne ruta. Stigningen er jevn: 14,1 grader fra 400 til 500 moh, 15,5 fra 500 til 600 og 16,1 fra 700 til 800.",
      "Fra om lag 1197 moh er du inne på Blåbreen. Bratteste hundremeteren ligger like under, 1000 til 1100 moh med 18,3 grader i snitt, og bratteste sammenhengende parti måler 33,6 grader mellom 1126 og 1147 moh. Kartverket registrerer breterreng på linja fra 1409 moh.",
      "Den siste kilometeren er slak stigning sørover mot toppvarden på 1482 moh: 13,9 grader fra 1300 til 1400 moh og 11,0 over det. Hold deg midt på breen.",
    ],
    descent: [
      "Ned samme linja, nordover over breen og ned til Skinnviksætra. Fallretninga er nord, og på vårføre kan du også traversere mot Lisje Eidskyrkja — det er en variant, ikke normalruta.",
      "Vanligste feil: å slippe seg vestover på breen. Sprekkene ligger vest på breen, og der er også utløpsområdene for skred. Holder du deg midt på, er hellinga moderat hele veien; forlater du midtlinja, skifter turen karakter.",
      "Den andre er toppområdet i skodde eller snødrev. Platået er vidt og flatt, og orienteringen der oppe er den ene tekniske oppgaven turen faktisk stiller.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Moderat helling og bre. Bratteste hundremeteren, 1000 til 1100 moh, måler 18,3 grader og bratteste sammenhengende parti 33,6 grader mellom 1126 og 1147 moh; breterrenget er registrert fra 1409 moh på linja. Skredfaren er liten om du holder deg midt på Blåbreen.",
      },
      {
        title: "Terrenget rundt",
        body: "Sprekker vest på breen, og utløpsområder for skred i det samme området. Toppplatået er en orienteringsfelle ved skodde eller snødrev — det er der turen krever mest av deg, og det er ikke hellinga som er grunnen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L30,195 L53,189 L75,183 L101,174 L119,167 L142,160 L172,155 L195,149 L213,143 L231,137 L255,129 L278,119 L298,111 L320,108 L337,102 L361,93 L385,83 L402,76 L414,72 L431,65 L444,62 L462,56 L480,51 L501,45 L527,38 L550,30 L572,23 L598,18 L600,18",
      startLabel: "368 moh",
      endLabel: "1482 moh",
      distanceLabel: "4,6 km",
      caption: "1115 høydemeter og 4,56 km fra Skinnviksætra over Blåbreen, med breterreng registrert fra 1409 moh og et vidt toppplatå øverst.",
    },
  },
  rondslottet: {
    slug: "rondslottet",
    intro:
      "Rondanes høyeste. En lang dag der de første seks kilometerne bare er innmarsj — fjellet begynner bak Rondvassbu, og de siste 240 høydemeterne går på en smal egg.",
    ascent: [
      "Fra Spranget p-plass, 1082 moh, er det seks kilometer inn til Rondvassbu. Tjønnbakkvegen inn hit er bomveg, og midtvinters er Mysusæter siste brøytepunkt — da blir turen tilsvarende lengre. Du er over tregrensa fra første meter, så det er åpent fjell hele veien inn. Hold deg på land rundt vika ved Lonin i sørenden av Rondvatnet i stedet for å ta snarveien over isen; dette er utløpsenden, og der er isen tynnest. Linja her er lagt om for å gjøre nettopp det: den går vest for vika, over land, og har ikke lenger en eneste vertex på vatn. Det hadde den før — nitti meter på isen, opptil femti meter fra land, sytti meter fra Lonin — under akkurat den setningen.",
      "Bak Rondvassbu, 1169 moh, stiger det bratt mot nordøst. Stidelet mot Storronden kommer tidlig, og din vei er den som fortsetter nordover inn i Rondholet. Botnen ligger på rundt 1500 moh og er flat — det er det siste flate partiet du får før toppen.",
      "Fra Rondholet går det meget bratt opp i ur mot Firkløvereggen, eggen mellom Storronden og Vinjeronden på 1869 moh. Det bratteste hundremeterbeltet på hele oppstigningen ligger her, mellom 1600 og 1700 moh, og holder 22° i snitt. Er ura avblåst, bærer du skiene til du er oppe på eggen.",
      "Videre stiger det til Vinjeronden, 2043 moh. Herfra faller ruta vel hundre høydemeter ned i Slottsbrue, skaret på 1939 moh, før den går opp igjen på eggen mot Rondslottet, 2178 moh. Eggen er fin å gå på, men den er smal: hold deg midt på ryggen. Terrenget faller 33–38° mot vest og over 45° mot øst.",
    ],
    descent: [
      "Samme vei tilbake — over eggen, ned i Slottsbrue, opp igjen de hundre høydemeterne til Vinjeronden. Den gjenstigningen kommer sent på dagen og tar lengre tid enn den ser ut til; legg inn tida før du bestemmer deg for hvor lenge du blir på toppen.",
      "Vanligste feil: å slippe seg vestover fra eggen for å slippe unna gjenstigningen over Vinjeronden. Vestsida av eggen mellom Slottsbrue og toppen faller 33–38° i nesten tre hundre høydemeter, ned i Styggebotn og videre mot Rondvatnet. Det slakner ikke før under 1700 moh, og til da henger du i én sammenhengende bratt flanke under en egg. Det er ingen snarvei — hold eggen til du er tilbake i skaret.",
      "Bjørnhollia er det tredje startstedet på Rondslottet og det eneste i øst: 1541 høydemeter på 12,36 km fra hyttedøra, nordover langs dalen og inn i Langglupdalen mot Dørålseter, forbi brua over Langglupå og stiskillet til Høgronden, og vestover fra stiskillet på 1764 moh. ut.no gir den 22,4 km tur/retur og minst fem timer opp. Den starter lavest av de tre — 913 moh mot Sprangets 1082 og Nedre Dørålseters 1043 — og gir fra seg 276 høydemeter underveis. Det bratteste 30-metersvinduet ligger derfor ikke i stigninga i det hele tatt: 45,8 grader mellom 913 og 880 moh, i søkket ned mot dalmunnen, halvannen kilometer inn. En kilometer inn, på 942 moh i skogen ovenfor hytta, står linja 45 meter på et lite naturlig tjern som OpenStreetMap ikke har kartlagt — to vertex på is, ikke et magasin.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fra Spranget inn til Rondholet er terrenget åpent og slakt, og du ligger over tregrensa hele veien. Det bratteste hundremeterbeltet på oppstigningen ligger mellom 1600 og 1700 moh og holder 22° i snitt — det er ura opp mot Firkløvereggen. Over Vinjeronden går ruta ned i Slottsbrue og opp igjen på en smal egg, med bratte flanker rett ved sporet på begge sider.",
      },
      {
        title: "Terrenget rundt",
        body: "Vestsida av eggen mellom Slottsbrue og toppen faller 33–38° i nesten tre hundre høydemeter ned mot Styggebotn; østsida faller over 45° ned i Storbotn. Sørvestflanken av selve toppen er langt slakere, rundt 26° over de første fire hundre metrene, men den fører ikke ned i Rondholet — botnen ligger to og en halv kilometer unna, på andre sida av Vinjeronden. I Rondholet går du gjennom en botn med sider på 20–26° i snitt og partier opp mot 38°, fra nordvest og fra Firkløvereggen i sørøst. Det er det lengste sammenhengende partiet på turen der du har noe over deg.",
      },
      {
        title: "Før du går",
        body: "Rondane ligger i varslingsregion Nord-Gudbrandsdalen. Det er en B-region på varsom.no: skredvarsel publiseres bare når faregraden ventes å bli 4 eller 5, så en tom side betyr ikke trygt fjell. Les værhistorikken og observasjonene i regionen selv, og ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,200 L48,197 L75,196 L98,194 L123,190 L145,189 L169,188 L193,188 L215,187 L241,185 L263,186 L289,185 L307,172 L331,160 L355,140 L377,142 L399,136 L423,132 L445,128 L466,108 L482,89 L504,71 L522,50 L543,45 L563,50 L585,31 L600,18",
      startLabel: "1082 moh",
      endLabel: "2178 moh",
      distanceLabel: "12,3 km",
      caption: "12,3 km og 1281 høydemeter fra Spranget. Hundre av dem gis bort i Slottsbrue og må tas igjen opp eggen.",
    },
  },
  glitregga: {
    slug: "glitregga",
    intro:
      "906 høydemeter på 4,45 km fra idrettsanlegget i Randabygd, sørvendt og jevn hele veien. Bratteste sammenhengende parti på linja måler 23,8 grader — det er en dagstur i høydemeter og en enkel tur i helling.",
    ascent: [
      "Start på parkeringa ved idrettsanlegget i Randabygd, 398 moh på Ålandsleite. Følg grusveien nordøstover; den første kilometeren er nesten flat, med bandet fra 400 til 500 moh på 5,4 grader over 1125 meter grunn.",
      "Ved Djupegrova på 487 moh svinger ruta nordover og nordvestover, og holder seg på vestsida av grova hele veien. Her kommer det første brattere partiet: 15,7 grader i snitt fra 500 til 600 moh.",
      "Skogen holder til 748 moh. Over den flater det ut en stund før stigningen tar seg opp igjen mot skaret: 15,7 grader fra 800 til 900 moh og 18,5 fra 900 til 1000, som er bratteste hundremeteren på turen. Bratteste sammenhengende parti måler 23,8 grader og ligger mellom 1280 og 1297 moh.",
      "Fra det markerte skaret holder du østover mot toppen. De siste hundre høydemetrene er slakere igjen, 11,6 grader fra 1200 til 1300 moh, og varden står på 1297.",
    ],
    descent: [
      "Ned samme veien: østover ned til skaret, sørvestover ned den åpne sida og tilbake langs Djupegrova til idrettsanlegget. Sørvendingen gjør at føret kan skifte fort utover dagen om våren.",
      "Vanligste feil: å kjøre rett ned fra toppen i stedet for å ta seg tilbake til skaret. Rett under toppen av Glitregga er terrenget bratt, og det er det ene stedet på turen der linja må være den beskrevne.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jevn og oversiktlig: bratteste hundremeteren, 900 til 1000 moh, måler 18,5 grader, og bratteste sammenhengende parti 23,8 grader mellom 1280 og 1297 moh. Det er lengden og de 901 høydemetrene som gjør turen krevende, ikke hellinga.",
      },
      {
        title: "Terrenget rundt",
        body: "Det bratte under toppen ligger mot nord: 26,3 grader i snitt over 500 meter med et 37,8-graders vindu 250 til 310 meter ut, og nordvest og nordøst 20,3 og 21,0. Sør, øst og vest er nesten flate — 2,8, 8,9 og 1,8 grader — så det er nordsida, og bare den, linja over skaret holder deg unna både opp og ned. Sida ned mot Djupegrova er det andre stedet der et linjevalg får konsekvenser, for grova samler snø fra hele flanken over.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L24,199 L49,196 L73,191 L97,187 L122,183 L146,181 L167,181 L188,175 L213,165 L233,156 L261,146 L285,140 L310,134 L334,127 L364,115 L388,106 L413,94 L437,82 L449,76 L473,66 L491,58 L510,51 L534,40 L558,30 L583,25 L600,18",
      startLabel: "398 moh",
      endLabel: "1297 moh",
      distanceLabel: "4,5 km",
      caption: "901 høydemeter og 4,38 km fra Randabygd idrettsanlegg, med skoggrensa på 748 moh og bratteste hundremeteren mellom 900 og 1000 moh.",
    },
  },
  storronden: {
    slug: "storronden",
    intro:
      "1108 høydemeter fra Spranget, men fjellet begynner først etter seks kilometer: innmarsjen til Rondvassbu stiger 132 høydemeter, og resten kommer på 2,6 kilometer opp vestryggen. Enklere enn Rondslottet fra samme parkering — ingen egg, ingen gjenstigning.",
    ascent: [
      "Fra Spranget p-plass, 1082 moh, følger du Rondvassbu-vegen seks kilometer nordøstover: over 1137 moh, gjennom dalen sørvest for hytta og fram til Rondvassbu på 1214 moh. Bandet mellom 1100 og 1200 moh måler 1,3 grader i snitt over fire og en halv kilometer. Rundt vika ved Lonin i sørenden av Rondvatnet holder du deg på land i stedet for å ta snarvegen over isen.",
      "Merk startpunktet: bomvegen til Spranget brøytes ikke, og parkeringa er offisielt åpen fra midten av juni. I mars–mai er Mysusæter siste brøytepunkt — det er 4,5 kilometer og hundre høydemeter lenger ned, og de kommer i tillegg til alt som står her.",
      "Bak hytta stiger det bratt mot nordøst opp til stidelet på 1440 moh. Her deler turen lag med Rondslottet: den ruta fortsetter nordover inn i Rondholet, mens Storronden tar av mot høyre og østover opp på vestryggen.",
      "Fra stidelet til toppen er det 698 høydemeter på 2,85 kilometer langs linja, monotont stigende og uten gjenstigning. Den bratteste hundremeteren ligger mellom 1900 og 2000 moh og måler 20,7 grader i snitt; bratteste sammenhengende parti på linja er 25,7 grader. Ryggen er steinete, og ur blåser ofte bar — da bæres skiene den siste biten til varden på 2139 moh.",
    ],
    descent: [
      "Ned vestryggen til stidelet, ned bakken til Rondvassbu og deretter de seks kilometerne ut til Spranget. Nedkjøringa er sørvestvendt: peilinger mellom 225 og 255 grader holder 26 til 32 grader, og det er den sektoren ruta bruker.",
      "Vanligste feil: å slippe seg rett vest fra toppen fordi det er den veien bilen står. Rett vest ser slakt ut fra varden — under 26 grader de første seks hundre metrene — og bryter så av i 46 til 57. Nordover er fella den samme: fire–fem hundre meter på under 20 grader, og så 48 til 64 ned i Rondholet. Øst og sørøst er brattest og nærmest, 56 til 67 grader like ved den slake ryggen du kom opp. Den andre feilen er å la seg dra nordover mot Rondholet fra toppen.",
      "De siste seks kilometerne er flate. Regn med å stake dem, og regn med at de tar lengre tid enn de ser ut til når du står på toppen og ser hytta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Vestryggen er slak og oversiktlig: 698 høydemeter på 2,85 kilometer, bratteste sammenhengende parti 25,7 grader, og bratteste hundremeteren, 1900 til 2000 moh, 20,7 grader i snitt. Det er ingen egg og ingen gjenstigning på ruta. Hold deg på ryggen fra stidelet og oppover — det er den ene slake sida av fjellet.",
      },
      {
        title: "Terrenget utenfor",
        body: "Øst og sørøst faller 56 til 67 grader rett ved varden. Nord og vest er en annen sak, og en farligere: begge ser slake ut fra toppen — nord holder under 20 grader i fire–fem hundre meter og vest under 26 i seks hundre — før de bryter av i 48 til 64 grader ned mot Rondholet og 46 til 57 mot vest. Det er terrengfeller, ikke vegger du ser. Rondane ligger i varslingsregion Nord-Gudbrandsdalen, som er en B-region på varsom.no: der publiseres skredvarsel bare ved faregrad 4–5, og en tom side betyr altså ikke at faren er vurdert og funnet lav. Det gjør egen observasjon viktigere her enn i regionene med daglig varsel.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Nord-Gudbrandsdalen på varsom.no, og husk at regionen bare varsles ved faregrad 4–5. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L26,200 L45,199 L71,197 L92,195 L113,194 L137,191 L157,189 L179,188 L198,187 L223,188 L242,187 L261,186 L285,184 L308,185 L332,182 L353,175 L372,171 L395,161 L417,152 L435,137 L456,119 L480,107 L497,92 L517,84 L538,71 L557,52 L572,34 L593,21 L600,18",
      startLabel: "1082 moh",
      endLabel: "2139 moh",
      distanceLabel: "10,2 km",
      caption: "1108 høydemeter og 10,23 km fra Spranget, der 698 av høydemetrene kommer på de siste 2,85 kilometerne opp vestryggen.",
    },
  },
  skala: {
    slug: "skala",
    intro:
      "Fra Tjugen i Loen til 1848 moh: 1818 høydemeter i én sammenhengende stigning, og en av landets lengste nedkjøringer. Turen krever kondisjon og sikt, ikke bratt teknikk.",
    ascent: [
      "Fra parkeringen på Tjugen ved Lodalsvegen, 34 moh, følger du traktorvegen som etter hvert blir til Kloumannstien og går oppover i Fosdalen. Plassen er avgiftsbelagt og betales med Vipps til Skåla Parkering — det er den samme plassen som brukes under Skåla Opp. De første 540 meterne går på veg; deretter tar stien over. Skogen slipper taket rundt 698 moh, og fra midten av mai må du regne med å bære skiene opp til Tjugensætra rundt 750 moh.",
      "Elva krysser du rundt 650 moh. Stien svinger nordover et stykke før den tar seg tilbake sørover — følg den; juvet nedenfor er ikke noe å skjære over. Så følger rundt 400 høydemeter jevn stigning opp mot Skålavatnet. Stien svinger seg opp gjennom hellinga, og ingen hundremeter på dette strekket holder mer enn 18°.",
      "Du passerer Skålavatnet på nordvestsida, 1141 moh, og fortsetter sørøstover inn i botnen. Derfra tar du opp til venstre mot den brede ryggen mot Sandsnibba. Den bratteste hundremeteren på hele linja ligger mellom 1500 og 1600 moh og holder 21,2° i snitt, med 20,2° i sjiktet under; det bratteste enkelttrinnet måler 26,9°.",
      "Skålabu og Skålatårnet står på 1835 moh, der stien formelt slutter. Toppunktet ligger 370 meter lenger øst, flatt platå hele veien. Ved dårlig sikt: hold ryggen. Den er slak å gå, men den faller bratt til begge sider — 56° i snitt de første 200 metrene mot nordvest, 42° mot sør — og skavlen henger ut over nordvestkanten.",
    ],
    descent: [
      "Ned går du samme linja: over platået, ut ryggen, ned i botnen og forbi Skålavatnet på nordvestsida, så ned Fosdalen. 1818 høydemeter i ett strekk. Vil du ha noe brattere, følger du toppeggen lenger ut og legger linja i den sørvestvendte fjellsida — det er den vanlige varianten. Rett sørvest for tårnet står et bergtrinn på 60–66°, så du må ut på eggen før du slipper deg ned; derfra holder sida 24–26° i snitt med trinn på 39–44°, mot 20,3° på oppstigningen.",
      "Vanligste feil: å forlate ryggen for tidlig. Nord- og nordvestsida rett under toppen er stup — 64° i de første 80 metrene — og sørsida er ikke stort snillere med sine 42°. Hold kammen til du er nede i botnen, og hold deretter nordvest for Skålavatnet og ned i Fosdalen. Trekker du vest for vatnet, står du over bergband som måler 68° ned mot Loen. Fra midten av mai slutter snøen rundt Tjugensætra, og de siste 750 høydemeterne går på beina.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja i seg selv er slak — bratteste hundremeter 20,3° i snitt, bratteste enkelttrinn 29,1°. Faren ligger i det du går under: det går skred langs Fosdøla og Skålelva, og nord for sommerruta etter at du har passert Skålavatnet.",
      },
      {
        title: "Terrenget rundt",
        body: "Rett under toppen faller nordvestsida 56° i snitt over de første 200 metrene, 64° øverst, og nordsida 51°; sørsida faller 42°. Det er over nordvestkanten skavlen henger, og det er ingen utveg noen av vegene. Vest for Skålavatnet bryter fjellsida ned mot Loen opp i bergband på 68°. Den sørvestvendte fjellsida ute på toppeggen er slakere, 24–26° i snitt, og det er der den brattere nedkjøringsvarianten går.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,198 L49,192 L68,185 L79,182 L105,173 L120,166 L146,158 L165,152 L191,144 L210,138 L229,132 L252,125 L276,119 L296,115 L318,108 L338,100 L360,92 L382,86 L406,80 L431,72 L446,65 L465,58 L480,51 L495,44 L520,36 L543,27 L566,20 L592,19 L600,18",
      startLabel: "34 moh",
      endLabel: "1848 moh",
      distanceLabel: "7,2 km",
      caption: "1818 høydemeter fra Tjugen til toppen — bratteste hundremeteren ligger mellom 1400 og 1500 moh.",
    },
  },
  skarsteinfjellet: {
    slug: "skarsteinfjellet",
    intro:
      "1219 høydemeter på 5,84 km fra Innvikdalen, opp en rygg som holder seg jevn fra skoggrensa til varden. Bratteste sammenhengende parti måler 31,9 grader og ligger oppe på ryggen, mellom 1321 og 1340 moh; over 800 moh kommer linja ellers aldri over 16 grader i noe hundremetersband.",
    ascent: [
      "Start ved grinda på Dragesetvegen innerst i Innvikdalen, 349 moh, inn dalen fra Innvik. Traktorveien tar deg opp til Remestøylen på 596 moh; bandet fra 300 til 400 moh måler 7,1 grader og 400 til 500 moh 10,6.",
      "Fra setra holder du vest-sørvestover opp den tydelige ryggen, med Innvikdalen på høyre hånd. Bratteste hundremeteren på turen ligger her, 600 til 700 moh med 17,3 grader i snitt; bratteste sammenhengende parti ligger høyere, 31,9 grader mellom 1321 og 1340 moh på ryggen.",
      "Forbi Hestehytta på 864 moh slutter skogen — Kartverket fører terrenget som skog til 805 moh — og resten er åpen rygg. Fra Hestehytta til toppen stiger linja 864 til 1567 moh over 3,3 kilometer, om lag tolv grader i snitt.",
      "Ryggen er jevn hele veien opp: 13,6 grader fra 900 til 1000 moh, 15,4 fra 1000 til 1100 og 15,9 fra 1100 til 1200. Over 1400 moh flater den ut mot varden på 1567 — bandet fra 1400 til 1500 moh måler 8,3 grader over 675 meter grunn.",
    ],
    descent: [
      "Ned samme ryggen, vestover mot Remestøylen og Dragesetvegen — oppstigningen går østover, og Remestøylen ligger på peiling 289 fra toppen. Ryggen er bred og oversiktlig, og fallretninga er vest.",
      "Vanligste feil: å velge en annen linje ned enn den du gikk opp. Fjellet har flere skredutsatte nedkjøringsalternativer til sidene av ryggen, og det er lett å følge spor som ikke ender der du parkerte. Følg oppstigningsryggen, ikke andres spor.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "En lang, bred rygg uten tekniske partier. Bratteste hundremeteren, 600 til 700 moh, måler 17,3 grader, og bratteste sammenhengende parti 31,9 grader mellom 1321 og 1340 moh — det første nede i skogsdelen, det andre oppe på ryggen. Fra Hestehytta og opp holder linja om lag tolv grader i snitt.",
      },
      {
        title: "Terrenget rundt",
        body: "Sidene av ryggen er skredutsatte, og nå vet vi hvilke: sør og sørvest, ned mot Innvikdalen. Fra ryggpunktet på 1096 moh måler sørsida 26,9 grader i snitt over 400 meter med et 45,5-graders vindu, og sørvest 28,8 med 49,3. Fra 1275 moh gir sørvest 32,9 grader i snitt og et 67,5-graders vindu 320 til 380 meter ut. Nord og vest fra den samme ryggen holder 10 til 15 grader. Selve toppen er slak i alle åtte retninger — 2,5 til 11,3 grader i snitt — så vurderingen ligger ikke der du står med varden, men i hva du velger når du har kommet et stykke ned.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,197 L46,192 L64,185 L80,183 L100,178 L116,170 L144,164 L162,158 L182,149 L204,139 L227,132 L246,125 L268,121 L287,114 L310,107 L325,101 L343,94 L362,86 L381,79 L398,71 L421,63 L449,56 L467,49 L491,42 L514,37 L537,33 L565,26 L582,22 L600,18",
      startLabel: "349 moh",
      endLabel: "1567 moh",
      distanceLabel: "5,8 km",
      caption: "1219 høydemeter og 5,84 km fra Dragesetvegen i Innvikdalen, over Remestøylen og Hestehytta, med skoggrensa på 805 moh.",
    },
  },
  lodalskapa: {
    slug: "lodalskapa",
    intro:
      "1526 høydemeter på 10,63 km til det eneste 2000-metersfjellet i Nordfjord. To tredjedeler av turen er slak innmarsj; resten er bre med dype sprekker, og bratteste sammenhengende parti måler 46,4 grader mellom 1973 og 2005 moh.",
    ascent: [
      "Start på parkeringa ved Bødalssætra, 584 moh, snaut tretti kilometer fra Stryn forbi Loen og langs Lovatnet. Veien inn Bødalen er stengt om vinteren og åpner i mai eller juni — dette er en vårskitur, og sesongen står deretter.",
      "Gå østover langs nordøstsida av dalen mot osen av Sætrevatnet, 606 moh, og følg elva videre innover. Innmarsjen er lang og flat: bandet fra 500 til 600 moh måler 0,6 grader over 1628 meter grunn, 600 til 700 moh 4,0 grader over 1413, og 1200 til 1300 moh 2,2 grader over 2633 meter.",
      "Ved Kåpevatnet, 1211 moh, svinger ruta sørover og opp Brattebakkane inn på Bohrsbreen. Herfra er det bre: Kartverket registrerer breterreng på linja fra 1825 moh, og Fri Flyt beskriver svært dype sprekker på Bohrsbreen. Bandet fra 1300 til 1400 moh måler 20,5 grader, den bratteste hundremeteren på turen.",
      "Videre opp mot ryggen og en travers under Veslekåpa før det siste stykket til toppen på 2082 moh. Bandet fra 1900 til 2000 moh måler 17,1 grader, og det bratteste sammenhengende partiet på ruta ligger her, 46,4 grader mellom 1973 og 2005 moh, under toppen. Breutstyr, stegjern og isøks hører med.",
    ],
    descent: [
      "Ned samme veien: under Veslekåpa, ned breen og Brattebakkane til Kåpevatnet, og deretter den lange, flate innmarsjen ut Bødalen. Fallretningen er vest.",
      "Vanligste feil: å behandle Bohrsbreen som en snøbakke. Sprekkene er dype, tau og breutstyr er ikke valgfritt, og på vei ned går du fortere over de samme snøbroene som du gikk sakte over på vei opp.",
      "Den andre er å undervurdere innmarsjen. Fem av ti kilometer ligger under 5 grader; det er lite motstand på ski, men det er også to timer hjem igjen etter at dagens høydemeter er brukt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Lang, flat innmarsj og en bratt topp: bratteste hundremeteren, 1300 til 1400 moh, måler 20,5 grader, og bratteste sammenhengende parti 46,4 grader mellom 1973 og 2005 moh. Brattebakkane opp mot breen er skredterreng.",
      },
      {
        title: "Terrenget rundt",
        body: "Svært dype sprekker på Bohrsbreen — det er den faren som skiller denne turen fra en vanlig vårtur, og den er ikke avhengig av skredvarselet. Stegjern og isøks når snøen er hard, og tau over breen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,200 L46,199 L72,198 L97,198 L121,197 L143,197 L166,190 L186,177 L206,169 L227,162 L247,149 L269,135 L287,126 L313,124 L336,124 L364,124 L394,124 L420,124 L440,112 L453,101 L470,89 L486,80 L508,70 L531,59 L547,49 L564,40 L582,28 L600,18",
      startLabel: "584 moh",
      endLabel: "2082 moh",
      distanceLabel: "10,6 km",
      caption: "1526 høydemeter og 10,63 km fra Bødalssætra over Sætrevatnet, Kåpevatnet og Bohrsbreen, med det bratteste på de siste hundre høydemeterne.",
    },
  },
  snonipa: {
    slug: "snonipa",
    intro:
      "1494 høydemeter på 8,45 km fra Stardalen til det høyeste fjellet i Sunnfjord, opp Haugadalen og midt i brefallet på Haugabreen. Bratteste sammenhengende parti måler 27,6 grader, og turen går på bre fra 887 moh og opp.",
    ascent: [
      "Start ved campingplassen i Stardalen, 351 moh — fra Skei følger du E39 nordover og tar av på Klakegg. Fri Flyt viser til utkjøringsplasser langs grusveien eller parkering nede ved fylkesveien.",
      "Følg skogsveien innover Haugadalen til Haugastøylen på 659 moh. Det flate partiet langs skogsveien er særlig utsatt for naturlig utløste skred når snødekket blir varmet opp — det er ikke der du venter det, og det er verdt å huske.",
      "Videre opp dalen til brefallet. Kartverket registrerer breterreng på linja alt fra 887 moh, og Haugabreen selv ligger på 1100 moh. Du går opp midt i fallet; store sprekker er den styrende faren her.",
      "Oppe på platået traverserer du nordvestover og kommer opp på toppen fra nordvest. Stigningen er jevn: 15,6 grader fra 1200 til 1300 moh, 19,4 fra 1300 til 1400 — bratteste hundremeteren — og 17,8 fra 1700 til 1800, med varden på 1827 moh. Rundt 1687 moh er føret ofte vindavblåst og hardt.",
    ],
    descent: [
      "Ned samme veien: over platået, ned brefallet og ut Haugadalen. Fallretningen er sørøst.",
      "Vanligste feil: å velge Veitebergsdalen ned fordi den ser kortere ut på kartet. Det er en annen rute fra en annen dal — den finner du som egen linje på dette kortet — og den ender ikke der bilen står.",
      "Den andre er timingen på det flate partiet nederst: det er der naturlig utløste skred kommer når sola har stått på, og det er den delen av turen du går sist.",
      "Veitebergsdalen er nå en egen rute på kartet, ikke bare en nedkjøringsvariant. Fri Flyts 4.8.2 starter på Veiteberg, ved skogsveien som går opp i dalen — 290 moh, akkurat det boka fører som starthøyde — og går veien til endes på 521, skrått opp skogen mot moreneryggen Sollirinden, opp ryggen til Sollibotnen på 894, rundt brevatnet og opp brefallet, og flatt innover breen øst for høyden 1687 til topps. 1682 høydemeter på 9,37 km mot 1494 på 8,45 km fra Stardalen: den lengste og største av de to. Skogen slipper på 781 moh etter 3,38 km. Bratteste hundremetersbeltet er 20,3 grader fra 600 til 700 moh. Det bratteste 30-metersvinduet, 30,3 grader, går nedover — fra 1139 til 1113, der linja faller mot utløpet av brevatnet på 1103 og må opp igjen; det er også mesteparten av de 145 høydemetrene ruta gir tilbake. Kilden sanksjonerer ingen kryssing av vatnet, så linja runder det på østsida, på land.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jevn stigning over bre. Bratteste hundremeteren, 1300 til 1400 moh, måler 19,4 grader og bratteste sammenhengende parti 27,6 grader; breterrenget er registrert fra 887 moh. Store sprekker på Haugabreen er den styrende faren, ikke hellinga.",
      },
      {
        title: "Terrenget rundt",
        body: "Det flate partiet langs skogsveien mot Haugastøylen er særlig utsatt for naturlig utløste skred ved oppvarming av snødekket. Rundt 1687 moh er det ofte vindavblåst og hardt, og det avgjør mer om dagen enn brattheten gjør.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,192 L39,183 L58,181 L80,181 L103,179 L122,176 L138,167 L160,163 L183,163 L205,160 L231,158 L256,149 L275,138 L298,135 L318,132 L342,121 L365,112 L387,105 L413,100 L435,98 L461,90 L478,82 L496,71 L512,64 L537,50 L560,40 L580,30 L600,18",
      startLabel: "351 moh",
      endLabel: "1827 moh",
      distanceLabel: "8,4 km",
      caption: "1494 høydemeter og 8,45 km fra Stardalen over Haugastøylen og Haugabreen, med breterreng fra 887 moh og skoggrensa på 649.",
    },
  },
  glittertinden: {
    slug: "glittertinden",
    intro:
      "Norges nest høyeste, og en overraskende slak tur: bratteste sammenhengende parti på hele linja måler 18,5 grader. Det som koster er avstanden — 13,32 km én vei, hvorav sju bare er innmarsj i Veodalen — og at øvre del ligger på Glitterbrean.",
    ascent: [
      "Start på grusparkeringa ved nasjonalparkgrensa i Veodalen, 1297 moh. Herfra følger du den bilfrie veien sørvestover langs Veo i sju kilometer inn til Glitterheim på 1385 moh. Sju kilometer for 88 høydemeter: bandet mellom 1300 og 1400 moh måler 0,9 grader i snitt over nesten sju kilometer, og det er det flateste partiet på noen av turene i denne appen. Regn med at innmarsjen tar en drøy time hver vei før fjellet begynner.",
      "Bak hytta legger ruta seg nordvestover opp nordsida av Steinbudalen. Ikke følg dalbunnen vestover over Steinbuvatna: utgangen av dalen mot breen har steg på 37 til 41 grader, mens nordflanken — der den merkede stien går — holder 9 til 13 grader i snitt, med enkeltsteg opp mot 19. Den bratteste hundremeteren på ruta ligger mellom 1600 og 1700 moh og holder 13,2 grader i snitt.",
      "Fra rundt 2010 moh går ruta inn på ryggen øst for Glitterbrean, opp forbi 2222 moh og 2357 moh på øvre del av breen, og til slutt vestover opp den siste kneika til toppen på 2451 moh. Ut.no beskriver ruta som jevn stigning hele veien i terreng under 30 grader, med valget mellom sommerstien øst for breen og selve breen. Terrengmodellen er enig: bratteste sammenhengende parti på linja er 18,5 grader.",
      "Sesongen er satt av veien, ikke av snøen. Bomvegen fra Randsverk inn til Veodalen brøytes ikke og åpner sammen med Glitterheim midt i juni. Vil du gå den klassiske vårturen i mars–mai, må du enten gå de vel 24 kilometerne inn på ski eller forhåndsbestille beltebil hos hytta — linja er den samme, men de første sju kilometerne er da en del av en mye lengre innmarsj.",
    ],
    descent: [
      "Ned samme vei: østryggen og breen ned til rundt 2010 moh, nordsida av Steinbudalen ned til Glitterheim, og så de sju kilometerne ut Veodalen. De siste sju er ikke nedkjøring. I juni og juli er Veodalen bar, så skiene bæres de sju kilometerne ut — regn med halvannen time til fots, eller tre kvarter om du har sykkel stående ved bommen.",
      "Vanligste feil: å dra for langt nord på det brede topplatået i dårlig sikt. Toppen har bare én slak side. Nord, nordøst, vest og nordvest faller 52 til 70 grader ned mot Grjotbrean og Glitterholet, og sør og sørvest — peilinger mellom 165 og 230 grader — faller 42 til 64 ned i Steinbudalen. Bare sektoren mellom 105 og 160 grader er slak, og det er den veien du kom. Ta ut kursen på toppen. Kanten er dessuten skavlet: ut.no melder dokumenterte overhengende skavler mot nordvest, så kanten du ser er ikke kanten som bærer.",
      "Glitterbrean er en bre. Sprekker og snøbroer er reelle, og i juni og juli — den eneste perioden denne ruta er beskrevet for — er snøbroene på sitt tynneste. Turen hører hjemme i tau og bresele hele sesongen. Det er en annen vurdering enn skredvurderingen, og den gjøres før du går ut på breen, ikke når du står midt på den.",
      "Den andre dokumenterte ruta kommer fra den andre sida av fjellet. Fra Spiterstulen er det 1390 høydemeter på 10,24 km — tre kilometer kortere enn normalruta og 162 høydemeter lengre — nordøst over Skautkampan på 1440 moh, over Skauta på 1477 og langs Steindalselve på 1547, alle tre registerførte og alle tre på linja. ut.no gir den 19,0 km tur/retur, 1378 høydemeter og ni timer, sesong juni–september. Bratteste steget måler 25,2 grader mellom 1755 og 1771 moh mot normalrutas 18,5, og det bratteste hundremetersbeltet 21,2 mellom 1900 og 2000. Faremomentet er det samme fra begge sider, og kilden sier det med tre ord: «Tidvis overhengende toppskavl.»",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja er slak hele veien: bratteste sammenhengende parti måler 18,5 grader, og den bratteste hundremeteren, 1600 til 1700 moh, holder 13,2 grader i snitt. Skredterreng er ikke det som gjør denne turen krevende. Det er breen, høyden og lengden — og at det slake terrenget over 2200 moh er breterreng, ikke fast fjell. Går du dalbunnen vestover over Steinbuvatna i stedet for nordflanken, får du derimot steg på 37 til 41 grader.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nord, nordøst, vest og nordvest faller 52 til 70 grader fra toppen ned mot Grjotbrean og Glitterholet, og sør og sørvest 42 til 64 grader ned i Steinbudalen. Kanten mot nordvest er skavlet. Topplatået er bredt og gir ingen holdepunkter i dårlig sikt, og det er der de tre bratte sidene blir farlige — ikke fordi de er skredterreng du velger, men fordi de er kanter du kan gå ut på. Sørøst, mellom 105 og 160 grader, er den ene slake sida, og den du kom opp.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade — og tau, sele og bresikringsutstyr. Glitterbrean går du i taulag; har du ikke breerfaring selv, går du med fører.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,198 L44,198 L68,197 L91,195 L115,192 L133,194 L151,193 L170,192 L194,191 L216,191 L237,190 L259,187 L285,184 L305,183 L328,185 L348,184 L372,165 L393,149 L413,134 L437,118 L459,107 L482,89 L502,75 L522,58 L541,50 L565,40 L585,27 L600,18",
      startLabel: "1297 moh",
      endLabel: "2451 moh",
      distanceLabel: "13,3 km",
      caption: "1228 høydemeter og 13,32 km fra Veodalen, der de sju første kilometerne til Glitterheim stiger 0,9 grader i snitt.",
    },
  },
  galdhopiggen: {
    slug: "galdhopiggen",
    intro:
      "Norges høyeste punkt, og fra Juvasshytta er det bare 639 høydemeter. Regnestykket lyver: mellom deg og toppen ligger Styggebrean, og den krysser du i taulag.",
    ascent: [
      "Turen starter ved Juvasshytta, 1841 moh, øverst på Galdhøpiggvegen. Veg og hytte åpner rundt 30. mai. Går du på ski i april eller mai, starter turen der brøytinga stopper, og da blir både lengden og høydemeterne større enn tallene her.",
      "Fra hytta følger du den stakede ruta sørvestover over Juvflye. 2,8 kilometer og rundt 200 høydemeter i steinete, åpent terreng tar deg til brekanten på Styggebrean. Dette er den delen av turen du går fort.",
      "På brekanten tar du på selen og binder inn. Styggebrean er sprukken, og navnet er ikke tilfeldig — stygg betyr farlig. Kryssinga er drøyt 1,6 kilometer og tar tre kvarter til en time, med stramt tau mellom hver mann. Har du ikke breerfaring, går du med fører; det er dette partiet som gjør turen til grad 3, ikke høydemeterne.",
      "Av breen og opp på fast grunn går ruta inn på østryggen. Hold ryggen sørøst for Piggebrean framfor å gå ut på breen selv; det første partiet opp er bratt nok til at mange bærer ski. Derfra stiger ryggen jevnt over skulderen på 2354 moh og videre til toppen. Merk deg at linja ikke faller: fra 2196 moh og opp til 2469 moh stiger den hele veien. Beskrivelser som sier at du går over Keilhaus topp og ned igjen før siste stigning, beskriver en annen linje — Keilhaus topp ligger vel 450 meter sørøst for den stakede ruta.",
    ],
    descent: [
      "Ned er samme veg. Østryggen først, rolig — det er stein og is i partier. Ryggen er skjev: sørsida er slak, mens nordsida faller 25 til 35 grader i snitt, med steg på 50 til 65 grader ned mot Piggebrean. Det er nordsida du holder deg unna. Ta av ski der du bar dem opp.",
      "Så tilbake i taulag over Styggebrean. Det er her folk slurver: toppen er tatt, det går nedover, og fristelsen til å knyte opp og kjøre spredt utover breen er stor. Sprekkene bryr seg ikke om at du er på vei hjem. Behold taulaget til du står på fast grunn ved brekanten.",
      "Den andre feilen er å slippe seg sørover fra toppen, ned mot Svellnosbrean. Flanken er sørvendt og god skikjøring — 25 til 30 grader i snitt over de 430 høydemeterne ned til breen, med enkeltsteg på 40 til 45 grader — men det er ruta til Spiterstulen. 1434 høydemeter ned i Visdalen, og bilen din står ved Juvasshytta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Selve linja er slak. Det bratteste hundremetersbåndet, 2400–2500 moh, ligger på 17,1 grader i snitt, og det bratteste enkeltsteget langs ruta måler 25,8 grader. Skredterreng er ikke det som gjør denne turen krevende — det er sprekkene i Styggebrean og høyden. Østryggen er smal og fanger fokksnø på lesida.",
      },
      {
        title: "Terrenget utenfor",
        body: "Piggebrean ligger nord for østryggen og Styggebrean under den. Begge er sprukne, og faller du ut av sporet på nordsida av ryggen, er det bre du havner på: den sida måler 25 til 35 grader i snitt, med steg på 50 til 65 grader, mens sørsida av ryggen er slak. Sørflanken ned mot Svellnosbrean holder 25 til 30 grader i snitt de 430 høydemeterne ned til breen, med enkeltsteg på 40 til 45 grader — et stort, samlet heng som ikke er en del av denne ruta.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade — og tau, sele og bresikringsutstyr. Styggebrean krysses i taulag; har du ikke breerfaring selv, bestiller du breføring hos Juvasshytta.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,200 L46,197 L61,195 L81,192 L103,190 L126,190 L145,186 L162,178 L187,173 L207,168 L223,160 L246,153 L267,148 L292,147 L313,146 L333,146 L358,139 L383,131 L408,125 L428,121 L450,117 L474,110 L494,93 L519,77 L534,70 L554,54 L572,41 L585,30 L600,18",
      startLabel: "1841 moh",
      endLabel: "2469 moh",
      distanceLabel: "5,4 km",
      caption: "639 høydemeter over 5,3 kilometer fra Juvasshytta — 1,6 av dem på Styggebrean, i taulag.",
    },
  },
  nautgardstinden: {
    slug: "nautgardstinden",
    intro:
      "1387 høydemeter på 9,60 km fra Russlie i Sjodalen: vestover mot Steinhøe, nord for Russlirundhøe, over den lange flata og opp østryggen til toppen på 2257 moh. Fri Flyt oppgir 1260 høydemeter og 10 km uten starthøyde; linja starter på 874 moh. Det meste er slakt — bandene fra 1600 til 1800 moh er 2,2 km grunn på 5,1 grader — og det bratte er det siste: 18,3 grader fra 2100 til 2200 moh og bratteste sammenhengende parti 30,0 grader mellom 2175 og 2194, på østryggen. Fri Flyt: «Det kan være greit å sette fra seg skiene før det siste bratte partiet mot toppen.»",
    ascent: [
      "Start på parkeringa ved Russlie, 874 moh, ved Fv51 Sjodalsvegen. Fri Flyt: «Det er flere mulige startsteder for toppturen til Nautgardstinden, men et greit utgangspunkt er Russlie ved veien som går fra Vågå mot Valdresflye.» Skogen slipper ved 1013 moh, 0,61 km fra start.",
      "Fri Flyt: «Start med å gå vestover mot Steinhøe og hold til høyre for det brattere terrenget under Russlirundhøe, før du kommer inn på et flatere parti.» Linja passerer 165 meter nord for Steinhøe ved 3,14 km og 1449 moh. Mellom 4,6 og 4,9 km, 1554 til 1635 moh, går den opp et steinete trinn under nordøstsida av Russlirundhøe-massivet — celler på 45,1 grader 39 meter nord for linja ved 1594 moh og 36,4 grader 19 meter fra den ved 1635. Det er sannsynligvis det brattere terrenget Fri Flyt ber deg holde til høyre for; trekk ikke mot venstre her, verken opp eller ned. Russlirundhøe selv er nærmest ved 6,11 km og 1711 moh, 956 meter rett sør for linja. Bratteste bandet under 2000 moh er 16,1 grader fra 1000 til 1100, tidlig på turen.",
      "Så kommer flata. Bandene fra 1600 til 1700 og fra 1700 til 1800 moh måler 5,1 grader hver over 1044 og 1170 meter grunn, og topp 1743 ligger 332 meter sør for linja ved 6,73 km. Fri Flyt: «Herfra stiger det brattere opp mot Nautgardstindene. Austre Nautgardstinden ligger til høyre, hovedtoppen til venstre.» Austre Nautgardstinden ligger 724 meter nordnordvest for linja ved 8,65 km.",
      "Linja går opp østryggen fra 2028 moh ved 8,90 km — 16,1 grader fra 2000 til 2100 og 18,3 fra 2100 til 2200. Bratteste sammenhengende parti er 30,0 grader mellom 2175 og 2194 moh, og ved 2226–2243 moh krysser linja 21 meter bakke på 35 grader eller mer, med bratteste celle 43 grader. Baxter om vinterruta fra Heimsand: «The last section of the east ridge is relatively steep but should not be a problem in the summer or winter (provided it is not icy).» Fri Flyt anbefaler å gå det siste til fots. Nord for ryggen ligger nordbotnen: der faller bakken 45 grader og mer, 50 til 130 meter fra linja på det siste stykket og 30 meter fra toppen. Hold deg på ryggen og sørsida av den, godt unna kanten.",
    ],
    descent: [
      "Fri Flyt: «Følg ruta fra oppstigningen det første strekket fra toppen. Derfra kan du velge linje i det slake terrenget mot bilen. Vær oppmerksom på det bratte partiet under Russlirundhøe.»",
      "Toppen faller bratt mot nord, nordvest og vest: 60,7 grader 20 til 80 meter ut mot nord, 66,4 mot nordvest og 52,3 mot vest. Fri Flyt: «Bratt terreng rundt toppen. Hold god avstand til skavel på nordvestsiden.» Baxter om kanten av nordbotnen, som hans rute fra Glitterheim følger: «During the spring, the rim of this corrie sports some huge cornices and a respectful distance should be maintained to avoid plunging through them, especially in poor weather.» Kjør ned østryggen der du gikk opp, og trekk ikke nordover mot kanten.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 30,0 grader mellom 2175 og 2194 moh, på østryggen, og ved 2226–2243 moh er bakken under linja 35 grader eller brattere i 21 meter. Under 2000 moh er bratteste bandet 16,1 grader fra 1000 til 1100, og trinnet ved 1554–1635 moh har 45 grader 39 meter fra linja. Fri Flyt graderer turen «KAST 1 – Enkelt» med bratteste punkt under 25 grader; her er den grad 2 for lengden, høyden og det siste bratte stykket, som du går til fots.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nord-, nordvest- og vestsida av toppen er 52,3 til 66,4 grader i bratteste vindu like under toppen. Fri Flyt: «Vær oppmerksom på det bratte partiet under Russlirundhøe.» Fri Flyts læringspunkt er vindtransport av snø: «Se hvordan snøen legger seg i søkk og bekkedaler.»",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Jotunheimen er en A-region og varsles daglig i sesongen. Fv51 er åpen fra Vågå til Gjendesheim hele året; strekningen over Valdresflye sør for Maurvangen er vinterstengt. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,191 L50,175 L69,166 L92,159 L116,151 L137,142 L165,133 L190,125 L212,124 L235,121 L261,117 L286,111 L306,101 L325,95 L351,93 L379,90 L404,88 L424,84 L443,76 L466,68 L486,62 L508,59 L531,55 L553,50 L573,38 L590,26 L600,18",
      startLabel: "874 moh",
      endLabel: "2257 moh",
      distanceLabel: "9,6 km",
      caption: "1387 høydemeter og 9,60 km fra Russlie, med skoggrensa på 1013 moh, flata mellom 1600 og 1800 og østryggen fra 2028.",
    },
  },
  gronlifjellet: {
    slug: "gronlifjellet",
    intro:
      "1155 høydemeter på 8,10 km fra toppturparkeringa på Ålhus: nesten fire kilometer skogsveg til Gotdalsstøylen, opp i Tolsbotnen og Litlebotn, og den smale sørøstryggen til Grønlifjellet på 1386 moh. Bratteste sammenhengende parti på linja er 23,8 grader mellom 1050 og 1073 moh, i kneika opp på ryggen — men Fri Flyt advarer om at egga «kan opplevast brattare enn målingane tilseier», fordi den er smal og har skavler mot øst.",
    ascent: [
      "Start på toppturparkeringa ved brua mellom Indrebø og Dalebø, 277 moh — samme parkering som Gotdalsnipa. Første del er skogsvegen nordover langs elva, forbi Brekka og videre til Gotdalsstøylen. Bandet fra 300 til 400 moh måler 4,5 grader over 1260 meter grunn. Bandet fra 500 til 600 moh måler 3,4 grader over 1664 meter. Støylen kommer etter 3,86 km, på 563 moh. Seint på våren kan du ifølge Fri Flyt kjøre lenger inn på skogsvegen mot bompenger.",
      "Fra støylen går Fri Flyt «noko nordaustover» for det slakeste terrenget og opp i Tolsbotnen, 802 moh etter 5,35 km. Fri Flyt holder høyden derfra over i Litlebotn; linja stiger vestover fra bunnen av Tolsbotnen og gir fra seg ned til 868 moh i Litlebotn, som registeret fører på 900 moh, før stigningen. Litlebottsegga ligger 790 meter nord for linja; det er nabotoppen og en egen tur.",
      "Fra Litlebotn går du opp på sørøstryggen og følger den mot nordvest til toppen. Kneika opp på ryggen er linjas bratteste sammenhengende parti, 23,8 grader mellom 1050 og 1073 moh — og det er sporets stigning; bakken sporet krysser er brattere, 35 til 50 grader over 35 og 20 meter ved 1044 og 1068–1075 moh — og Fri Flyt oppgir 27 til 30 grader både mellom 900 og 1000 og mellom 1230 og 1340 moh. Bandet fra 1200 til 1300 moh måler 19,2 grader over 270 meter grunn og er det bratteste bandet på turen.",
      "Øvre del av ryggen er smal. Innenfor 50 meter av linja måler terrenget 49 til 65 grader mot øst og nordøst mellom 1153 og 1335 moh — det er der skavlene henger. Hold avstand til eggkanten mot øst. I hard snø sier Fri Flyt at du kan måtte bruke skarejern eller gå til fots, og at «Utgliding eller fall kan ved nokre tilhøve utgjere betydeleg risiko». Toppen er på 1386 moh.",
    ],
    descent: [
      "Fri Flyt beskriver nedkjøringa ned østsida mot Litlebotnen med mange linjer av ulik bratthet, og den slakeste går først nordøstover ned ryggen mot Litlebottsegga, så lengst nord i sida og ned en forsenkning til Litlebotnen. Nordøstradialen fra toppen er den slake: 15,2 grader i snitt og 24,9 grader i bratteste vindu. Men «Dei første ti høgdemetrane frå toppen kan vere bratte, 35-40 grader avhengig av snøforhold/skavldanning», og lenger nede oppgir kilden 34 til 36 grader mellom 1070 og 1000 moh og 29 til 32 grader mellom 860 og 750 moh. Østsida av toppen måler 37,6 grader i bratteste vindu 160 til 220 meter ut, og sørøstsida 35,2 grader.",
      "Fra Litlebotnen kjører du ned øst for elva fra botnen og ut til Gotdalsstøylen, og så skogsvegen tilbake. Det er nord-, nordvest- og sørsida som ikke er nedkjøringer: Nordsida av toppen måler 57,6 grader 40 til 100 meter ut og nordvestsida 61,8 grader; sørsida 42,2 grader 170 til 230 meter ut.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti på linja er 23,8 grader mellom 1050 og 1073 moh, og bratteste hundremeteren er 1200 til 1300 moh med 19,2 grader. Bakken under linja er 35 grader eller brattere på to korte strekk i kneika opp på ryggen, 35 og 20 meter, med bratteste celle 50 grader.",
      },
      {
        title: "Terrenget utenfor",
        body: "Egga har skavler mot øst, og terrenget under dem måler 49 til 65 grader innenfor 50 meter av linja. Nordsida og nordvestsida av toppen er hamrer på 57,6 og 61,8 grader. Nedkjøringa østover har 34 til 36 grader mellom 1070 og 1000 moh. Skogsvegen går i dalbunnen under lisider som måler 35 til 68 grader i bratteste vindu på begge sider, 160 til 640 meter ut, mellom 1,2 og 3,6 km. Skifantomet: «Kommer i løpet vinteren store snøskred ned i Ålhusdalen ifrå fjellsidene (Blåfjellet, Sølvet og Trollet).» Ålhusdalen ligger 784 meter sørvest for linja, og vegen passerer Brekka, der skifantomets nedkjøring fra den dalen kommer ut.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Det er en lang dag — Fri Flyt setter 5 til 10 timer. Ta med sender/mottaker, søkestang og spade, og skarejern.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,197 L56,196 L83,194 L108,192 L132,184 L150,177 L173,170 L196,164 L219,158 L243,156 L269,154 L296,152 L319,148 L339,140 L366,130 L388,119 L409,110 L433,98 L453,97 L473,103 L493,91 L513,75 L536,60 L559,47 L579,31 L600,18",
      startLabel: "277 moh",
      endLabel: "1386 moh",
      distanceLabel: "8,1 km",
      caption: "1155 høydemeter og 8,10 km fra Ålhus, med Gotdalsstøylen på 563 moh, Litlebotn på 900 og bratteste hundremeteren mellom 1200 og 1300 moh.",
    },
  },
  gotdalsnipa: {
    slug: "gotdalsnipa",
    intro:
      "998 høydemeter på 5,25 km fra toppturparkeringa på Ålhus: skoglia over Dalebø, Fjellstøylen på 590 moh, østsida av Fossgrova og ryggen over Nonsnipa til Gotdalsnipa på 1248 moh. Bratteste sammenhengende parti på linja er 24,3 grader mellom 1172 og 1197 moh, i toppryggen — det bratte på dette fjellet er nedkjøringa sørover i Steinbotnen, ikke oppturen.",
    ascent: [
      "Toppturparkeringa ligger ved brua mellom Indrebø og Dalebø, 277 moh, og Fri Flyt sier parkering mot avgift. Gå over brua til Dalebø og ta av fra traktorvegen til høyre — kilden sier etter «vel 200 meter» — og legg sporet skrått opp lia mot nordøst.",
      "Lia er skogsterreng, og den er ujevnere enn snittet viser. Bandet fra 300 til 400 moh måler 13,3 grader. Bandet fra 400 til 500 moh måler også 13,3 grader. Innenfor 50 meter av linja står knauser på opptil 69 grader, og Fri Flyt oppgir 25 til 28 grader som det bratteste mellom 370 og 560 moh. Fjellstøylen kommer på 590 moh etter 1,66 km, og skogen slipper ved 682 moh.",
      "Over Fjellstøylen holder du samme retning mot Fossgrova og følger den oppover på østsida, slik Fri Flyt beskriver. Linja er på 906 moh på østsida av grova etter 3,41 km. Høgemannsholten ligger 371 meter vest for linja, på den andre sida av grova; skifantomet beskriver ruta over den, Fri Flyt østsida, og linja følger Fri Flyt.",
      "Grova fører deg opp mot Nonsnipa, 1105 moh, og linja passerer like ved toppen. Herfra følger du ryggen mot nordvest til Gotdalsnipa. Det siste stykket over 1200 moh måler 15,4 grader over 167 meter grunn og er det bratteste bandet på turen, og det bratteste sammenhengende partiet, 24,3 grader mellom 1172 og 1197 moh, ligger like under toppen. Toppen er på 1248 moh.",
    ],
    descent: [
      "Fri Flyt beskriver nedkjøringa rett sør fra toppen ned i Steinbotnen som «Utfordrande», med 30 til 34 grader mellom 1140 og 980 moh. Sørradialen fra toppen måler 23,0 grader i snitt og 33,0 grader i bratteste vindu, 410 til 470 meter ut. Vil du ha slakere terreng, følger du ryggen ned mot skaret før Nonsnipa. Fra Steinbotnen renner du vestover mot Gotdalsstøylen og følger traktorvegen tilbake til Indrebø — samme parkering, og samme veg som Grønlifjellet går opp, under bratte lisider på begge sider.",
      "Fjord Norway skriver at den beste nedkjøringa fra toppen er nordvendt. Nordsida måler 40,2 grader i bratteste vindu 80 til 140 meter ut, og nordøstsida 46,3 grader — det er brattere enn noe på oppturen, og ingen av kildene beskriver en linje der. Samme veg ned som opp er alltid et alternativ: ryggen over Nonsnipa og ned østsida av Fossgrova.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti på linja er 24,3 grader mellom 1172 og 1197 moh, og bratteste bandet er stykket over 1200 moh med 15,4 grader. Bakken under linja har ingen strekk over 35 grader. Fri Flyt oppgir 25 til 28 grader i skoglia mellom 370 og 560 moh, der linja går mellom knauser.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nord- og nordøstsida av toppen måler 40,2 og 46,3 grader i bratteste vindu, vestsida 46,3 grader 310 til 370 meter ut, og nedkjøringa i Steinbotnen 30 til 34 grader ifølge Fri Flyt. Skifantomet advarer mot dalen vest for ruta: «Kommer i løpet vinteren store snøskred ned i Ålhusdalen ifrå fjellsidene». Oppturen går ikke der, men returen fra Gotdalsstøylen følger skogsvegen forbi Brekka, der skifantomets nedkjøring fra Ålhusdalen kommer ut, og lisidene over vegen måler 35 til 68 grader i bratteste vindu.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L26,197 L51,190 L72,182 L93,173 L118,164 L137,156 L154,149 L177,141 L193,141 L216,139 L242,135 L262,126 L293,117 L314,109 L339,99 L370,87 L396,77 L422,72 L447,61 L463,54 L488,48 L514,47 L540,44 L565,36 L581,27 L600,18",
      startLabel: "277 moh",
      endLabel: "1248 moh",
      distanceLabel: "5,3 km",
      caption: "998 høydemeter og 5,25 km fra Ålhus, med skoggrensa på 682 moh, Fjellstøylen på 590 og Nonsnipa på 1105.",
    },
  },
  steindalsnosi: {
    slug: "steindalsnosi",
    intro:
      "764 høydemeter fra Sognefjellsvegen til 2025 moh, alt over skoggrensa. Normalvegen går opp vestsida; nordsida av det samme fjellet er en helt annen tur, og skillet mellom dem går på topplatået.",
    ascent: [
      "Fra den brøytede plassen ved Gjuvvatnet på fv55 Sognefjellsvegen, 1274 moh, går du østover inn i dalsøkket. Veien hit er vinterstengt over høyfjellet og brøytes opp ved påsketider — i 2026 åpnet den 1. april — og de første ukene etter åpning er strekninga nattestengt fra 20 til 08. Det er veien, ikke snøen, som setter sesongen. Hold sørsida av vatnet — der er det fast grunn hele veien, og du slipper å miste de tretti meterne ned på isen. Er vegkanten full, ligger alternativet ved Galgebergstjørnane et par kilometer nordover; korridoren fungerer derfra også.",
      "Dalsøkket tar deg rett østover forbi et lite vatn på 1428 moh. Her er det åpent terreng fra første skritt til toppen — ingen skog, ingen skoggrense å ta hensyn til. Ved rundt 1500 moh trekker du nordøstover ut av søkket og opp mot en svak, vestvendt ryggformasjon. Den ryggen er hele resten av turen.",
      "Ryggen stiger jevnt. Hundremetersbåndet mellom 1700 og 1800 moh ligger på 19,1 grader i snitt, og det bratteste steget på veg opp er 30,3 grader over tretti meter mellom 1828 og 1848 moh. Hold ryggkammen gjennom det partiet. Trekker du nordover her, faller terrenget 100 til 180 meter bort under deg, og du kommer inn under nordsida.",
      "Toppen er et platå på 2025 moh. Varden ligger helt på kanten av nordsida — gå fram til den, ikke forbi den. Skavlene bygger seg ut mot nord og øst. Rett under varden stuper nordsida: de første 120 høydemetrene faller på nær 60 grader. Så slakner den til en hylle rundt 1840 moh, før den setter utfor igjen — 42 til 45 grader fra 1620 til 1500 moh, med bre og klipper under det.",
    ],
    descent: [
      "Ned går du samme veg, vestover. Den store skålforma under ryggen er det morsomste på turen: 25 til 30 grader jevnt, korte partier over 30, og det bratteste steget på linja — 30,3 grader — rett under ryggen. Derfra er det slakt ned dalsøkket til Gjuvvatnet.",
      "Vanligste feil: å la seg dra sørover fra toppen, ned Steindalen, uten å ha planlagt for det. Det er fin skikjøring, og den linja ligger på dette kortet som egen rute, men det er en annen tur — 1025 høydemeter ned til Helgedalen, og bilen din står på Sognefjellsvegen. Hold vestryggen til du ser vatnet.",
      "Vestsida er hard om morgenen i april og mai, og sola trenger noen timer på den. Går du tidlig, tar du med stegjern; det bratte partiet ved 1840 moh er ikke morsomt på blank skare, verken opp eller ned.",
      "Sørsida er nå en egen rute på kartet, og den er ikke bare en variant: «Før Sognefjellet åpner, er det best å gå sørsida opp fra Helgedalen», skriver kilden i sin egen når-linje. Normalruta starter ved Gjuvvatnet på Sognefjellsvegen, som er vinterstengt — så fram til veien åpner er dette veien opp. Fra Turtagrø på 884 moh går linja inn Helgedalen forbi 910 og 1026, opp mot Steindøla på 1202 og 1338, langs vestsida av elva på 1434 og 1520, inn i Steindalen på 1704, og over inngangen til sørsida på 1893 til vestkanten av topplatået på 1931 — det punktet normalruta også kommer opp på. 1174 høydemeter på 7,88 km mot 764 på 3,99 km fra Gjuvvatnet: nesten dobbelt så mye klatring og nesten dobbelt så langt, fordi turen starter 390 meter lavere. Skogen slipper på 1037 moh etter 3,98 km. Beltet fra 1700 til 1800 moh måler 21,3 grader, turens bratteste, og det bratteste 30-metersvinduet er 28,4 mellom 1658 og 1675. Kilden advarer om Steindøla: elva åpner seg en gang i mai.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalvegen ligger i slakt til middels bratt terreng. Dalsøkket opp til 1500 moh er flatt i seg selv, men det går under vestflanken av fjellet. Over 1700 moh blir det brattere: 19,1 grader i snitt gjennom båndet 1700–1800 moh, og det bratteste enkeltsteget langs linja måler 30,3 grader. Nøkkelpartiet mellom 1820 og 1860 moh er stedet på ruta der et flak løsner.",
      },
      {
        title: "Terrenget utenfor",
        body: "Topplatået er skavlet mot nord og øst, og varden står på selve kanten. Hold deg på sørsida av platået. Rett under skavlene er nordsida på sitt bratteste: de første 120 høydemetrene ned fra varden faller på nær 60 grader. Under det ligger en hylle rundt 1840 moh, og så neste trinn — 42 til 45 grader over 120 høydemeter, fra 1620 til 1500 moh, med bre, skredterreng og klipper i utløpet. Sørvestryggen over topp 1936 er en oppstigningsvariant, ikke en nedkjøring: stedvis smal og bratt, 38 grader over 40 høydemeter mellom 1580 og 1620 moh.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade. Stegjern hvis du starter før sola har tatt vestsida.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L21,198 L44,200 L61,200 L82,196 L106,193 L129,188 L149,179 L167,171 L190,166 L224,163 L251,160 L278,158 L305,152 L325,143 L352,134 L373,122 L393,115 L420,106 L435,98 L454,89 L472,77 L488,68 L501,59 L522,49 L543,40 L569,28 L596,20 L600,18",
      startLabel: "1274 moh",
      endLabel: "2025 moh",
      distanceLabel: "4,0 km",
      caption: "764 høydemeter over 4,0 kilometer fra Gjuvvatnet, alt over skoggrensa. Bratteste parti på oppstigninga: 30,3 grader mellom 1828 og 1848 moh.",
    },
  },
  besshoe: {
    slug: "besshoe",
    intro:
      "1328 høydemeter fra Bessheim, og en drøy tredjedel av turen er flat: tre og en halv kilometer ligger på isen på Bessvatnet. Selve stigningen er slak hele veien, og det som gjør Besshø krevende er lengden og et stort, rundt topplatå som ikke viser hvor det slutter.",
    ascent: [
      "Fra parkeringa ved Bessheim fjellstue på 961 moh følger du den merkede ruta vestover og opp de 413 høydemeterne til nordøstenden av Bessvatnet på 1374 moh. Dette er turens første kneik og den holder 10–14 grader — jevnt, men det er her du gjør unna stigningen før flata. Fv51 over Valdresflye er vinterstengt sør for Maurvangen, men Bessheim ligger nord for stengsla og nås hele vinteren via Sjoa, Heidal og Randsverk.",
      "Ute på Bessvatnet slutter turen å stige. Vatnet ligger på 1372 moh, og de neste tre og en halv kilometerne vestover faller og stiger til sammen ikke mer enn et par meter — i høydeprofilen er det den lange, flate midtdelen. Isen er normal vinterveg her, men linja på kartet er lagt på land i begge ender. Innerst, ved Grotåosen på 1385 moh, begynner fjellet på nytt.",
      "Derfra går ruta rett vestover opp Grotådalen, mellom Bukkehøe i nord og østryggen til Besshø i sør, i jevn stigning til rundt 1745 moh. Den bratteste hundremeteren på hele turen ligger mellom 1900 og 2000 moh og måler 18,0 grader i snitt; bratteste sammenhengende parti på linja er 28,1 grader. Så sørvestover opp på ryggen ved Brue på 2047 moh, og vest-sørvest langs den slake ryggen de siste 210 høydemeterne. Ikke gå opp Besshøbrean til Brue, slik hyttas egen beskrivelse kan leses: overgangen fra breen til ryggen stiger fra 2004 til 2050 moh på 26 meter grunn, altså rundt 60 grader.",
      "Toppen er et stort platå på 2257 moh. Peiling 75 grader fra varden — østryggen du kom opp — holder 17,8 grader. Peilinger på 60 og 90 grader kjennes like slake i fem hundre til åtte hundre meter — og bryter så av i 55 til 60 grader. Det er hele turens problem: femten grader feil peiling merkes ikke under skia før det er for seint.",
    ],
    descent: [
      "Ned samme vei: øst-nordøst ned til Brue — peiling 78 grader fra varden, ned Grotådalen til Grotåosen, og så de tre og en halv flate kilometerne østover langs Bessvatnet. Regn med å stake hele vatnet — det er ikke nedkjøring, det er transport, og det tar tid du må ha igjen av dagen.",
      "Vanligste feil: å forlate topplatået i feil retning. Nord-, nordvest- og vestsida faller 55 til 70 grader rett ned mot Russvatnet og Gjende, og fra et rundt platå i dårlig sikt ser alle retninger like slake ut de første stegene. Ta ut kompasskurs på varden, ikke to hundre meter ut. Ryggen inn mot Brue er også smalere enn den kjennes: nordsida bryter av i 50 til 60 grader ned mot Besshøbrean innen to hundre meter fra sporet, mens sørsida er slak og bred de første tre hundre.",
      "Sørrennene brukes som nedkjøring av dem som kjenner fjellet. De holder 35 til 40 grader med korte parti på 45, og er steinete og isete i dårlige forhold. Friflyts sørøstrenne ned mot Memurubu er en gjennomgangstur — den ender ikke ved bilen din.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigningen er lite bratt terreng: bratteste sammenhengende parti på linja måler 28,1 grader, og den bratteste hundremeteren, 1900 til 2000 moh, holder 18,0 grader i snitt. Østryggen selv ligger på 18 til 20 grader. Det som teller på ruta er ryggen inn mot Brue, der nordsida bryter av i 50 til 60 grader ned mot Besshøbrean innen to hundre meter fra sporet, mens sørsida er slak og bred — et spor som trekker nordover mot le er et annet spor enn det du planla.",
      },
      {
        title: "Terrenget utenfor",
        body: "Topplatået er stort og rundt, og nord-, nordvest- og vestsida faller 55 til 70 grader ned mot Russvatnet og Gjende. I dårlig sikt er det her turen blir farlig, ikke i oppstigningen. Radialmålinger fra varden viser hvorfor feilen gjøres: 75 grader peiling holder 17,8 grader, men 60 og 90 kjennes like slake i fem hundre til åtte hundre meter og bryter så av i 55 til 60. Overgangen fra Besshøbrean opp på Brue er rundt 60 grader og skal ikke gås. Sørrennene holder 35 til 40 grader med parti på 45.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,191 L47,182 L69,171 L93,160 L117,149 L139,145 L160,143 L182,142 L206,142 L229,141 L252,141 L272,141 L295,140 L322,140 L346,139 L365,139 L389,140 L410,133 L429,120 L445,112 L464,99 L483,88 L499,75 L520,62 L544,46 L568,35 L585,23 L600,18",
      startLabel: "961 moh",
      endLabel: "2257 moh",
      distanceLabel: "10,0 km",
      caption: "1305 høydemeter og 9,58 km fra Bessheim til toppen, der tre og en halv kilometer av dem er flatt vatn på 1372 moh.",
    },
  },
  fanaraken: {
    slug: "fanaraken",
    intro:
      "Høyfjellstur fra Sognefjellsvegen til 2068 moh, med Fannaråkhytta på selve toppunktet. Få høydemeter og slake vinkler — men ruta går over bre, og det bestemmer utstyret.",
    ascent: [
      "Du starter på Korpen, parkeringen på fv55 ved Prestesteinsvatnet, 1397 moh. Sognefjellsvegen er vinterstengt over høyfjellet og brøytes opp ved påsketider — i 2026 åpnet den 1. april — og de første ukene etter åpning er strekninga nattestengt fra 20 til 08. Åpningsdatoen setter sesongen, så sjekk vegstatus før du kjører. De første halvannen kilometerne går nedover og over land: linja følger vestsida forbi to små tjønner på 1384 og 1381 moh, videre vest for magasinet og ned til demninga ved utløpet på 1343 moh. Hold land langs vestsida — ikke skjær over isen. Prestesteinsvatnet er et magasin, og den flate snarvegen rett over er den ene flata på hele turen du ikke vet bæreevnen til.",
      "Å gå rundt koster: linja gir fra seg 113 høydemeter før den begynner å stige for alvor, mot de 54 en rett strek fra bilen til demninga ville gitt. Land bølger, is gjør det ikke. Forbi demninga trekker du opp i søkket øst for nordryggen til Steindalsnosi og inn på Fannaråkbreen rundt 1550 moh. Hold deg lavt og i den slake delen av breen. Den er oppsprukket, og du går den i tau.",
      "Sikt deg inn mot 1688-høyden øst for Fannaråknosi og rund den. Ikke hold høyde over breen: går du for høyt før du svinger opp, blir passasjen opp på østryggen vesentlig brattere. Den bratteste hundremeteren ligger mellom 1800 og 1900 moh og holder 19,8° i snitt over 317 meter grunn, og det bratteste enkelttrinnet på linja måler 36,8° mellom 1859 og 1884 moh.",
      "Rundt knausen kommer du inn på sørøstryggen og sommerstien fra Keisarpasset. Følg den over Fannaråknosi og videre langs østryggen til Fanaråken. Det henger store skavler på nordsida hele veien, og nordsida faller 55–58° i de øverste 90 metrene under kammen — hold deg på sørsida, også når sikten er god.",
    ],
    descent: [
      "Ned følger du samme linja — øst- og nordøstvendt, jevnt og slakt, med pålitelig vårsnø langt ut i sesongen. Den andre dokumenterte ruta, fra Turtagrø gjennom Helgedalen, gir 1228 høydemeter og er en annen dag.",
      "Vanligste feil: å holde høyde over breen på vei ned, slik at du havner for høyt vest for 1688-høyden og må ned der det er brattest. Slipp deg ned rundt knausen slik du kom opp. Og husk at siste strekket ikke er gratis: fra demninga på 1343 moh stiger det tilbake til Korpen på 1397, og vestsida bølger — 113 høydemeter til sammen på veien inn, og de samme igjen på veien ut.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalvegen er slak — bratteste hundremeter holder 19,8° i snitt mellom 1800 og 1900 moh, over 317 meter grunn, og det bratteste enkelttrinnet på linja måler 36,8° mellom 1859 og 1884 moh. På Fannaråkbreen er sprekkene faren like mye som snøen. Nede ved starten er faren en annen og enklere å beskrive: isen på et magasin som tappes ned, og ruta er lagt på land utenom den.",
      },
      {
        title: "Terrenget rundt",
        body: "Nordsida av Fanaråken bærer store, permanente skavler og faller 55–58° i de øverste 90 metrene under ryggkammen — den sida er ikke et alternativ, verken opp eller ned. Vest- og sørvestsida ned mot Marangsgjelet holder 34° jevnt, med 38–40° mellom 1360 og 1420 moh; det er Helgedalen-ruta som går der, en egen dokumentert linje, ikke en utveg fra normalvegen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade — og tau og bresele, ruta går over Fannaråkbreen.",
      },
    ],
    elevationProfile: {
      path: "M0,183 L24,184 L44,185 L65,186 L81,185 L101,187 L125,192 L149,200 L177,193 L197,186 L214,182 L234,172 L258,164 L281,158 L298,152 L319,144 L343,139 L367,136 L391,134 L415,122 L436,109 L464,88 L476,75 L492,60 L510,44 L525,41 L548,35 L569,30 L597,20 L600,18",
      startLabel: "1397 moh",
      endLabel: "2068 moh",
      distanceLabel: "6,7 km",
      caption: "783 høydemeter og 6,70 km fra Korpen til toppen — 113 av dem gir du fra deg langs vestsida av magasinet, før stigningen begynner.",
    },
  },
  heimdalshoe: {
    slug: "heimdalshoe",
    intro:
      "879 høydemeter på 6,32 km fra Maurvangen: opp gjennom bjørkeskogen langs Brurskardbekken, opp på Molflyhalsen og ryggen østover til toppen på 1843 moh. Fri Flyt oppgir 1000 meter stigning og 5,2 km. Linja er slak — bratteste bandet er 14,3 grader mellom 1300 og 1400 moh, og bratteste sammenhengende parti 19,3 grader mellom 1383 og 1398. Fri Flyt: «Slakt og oversiktlig terreng, der det sjelden ligger mye snø.»",
    ascent: [
      "Start ved Maurvangen Fjellpark, 970 moh, ved Fv51 i Sjodalen. Fri Flyt: «Startsted: Maurvangen Fjellpark. Prat med vertskapet om parkering.» Rasteplassen Maurvangen og en parkeringsplass ligger 430 meter nord. Bessheim: «The starting point is at Besseggen Fjellpark Maurvangen.»",
      "Fri Flyt: «Turen begynner i skogen innenfor Maurvangen. Du kan følge oppkjørt og stikket trase opp gjennom skogen, men det er ofte like fint å finne eget spor opp gjennom fjellbjørkeskogen.» Den stikkede løypa er kartlagt i OSM, og linja går 31 til 152 meter fra den mellom 0,63 og 2,22 km. Linja går sørover gjennom skogen på østsida av Brurskardbekken, og skogen slipper ved 1036 moh, 1,17 km fra start. Brurskardbekken renner 132 meter vest for linja ved 1,62 km.",
      "Ved 1181 moh, 2,22 km fra start, svinger linja østover. Ut.no beskriver sommerstien, som kommer inn fra vest, slik: «På snaut 1200 moh forlater man stien, krysser Brurskardbekken på egnet sted og skrår oppover mot Mollflyhalsen.» Her er turen på sitt bratteste — 12,5 grader fra 1200 til 1300 moh og 14,3 fra 1300 til 1400, med bratteste parti på 19,3 grader mellom 1383 og 1398. Her går linja langs et bekkefar: 70 til 80 meter nord for den, ved 1371–1399 moh, faller sida 45 til 57 grader — det er den typen bekkefar Fri Flyt advarer mot. Hold avstand til kanten. Molflyhalsen når du på 1447 moh etter 3,60 km.",
      "Ut.no: «Denne ryggen følges så opp til vel 1600 moh.» Over 1600 er det nesten flatt — bandet fra 1600 til 1700 moh måler 4,4 grader over 1214 meter grunn — og ut.no skriver at terrenget blir «overveiende steinete». Like over Molflyhalsen står celler på 39 til 42 grader 20 meter sør for linja ved 1502 moh. Bakken under linja er aldri 35 grader eller brattere. Toppen er et platå: 3,7 til 15,9 grader i snitt til alle kanter over 500 meter. Bessheims vinterlinje følger den stikkede løypa til Brurskaret, og derfra en merket trasé «steep to the top»; Brurskardet ligger 902 meter sørvest for denne linja, og løypa går dit: ved 4,81 km og 1661 moh er linja 1481 meter fra den.",
    ],
    descent: [
      "Fri Flyt: «Nedkjøring samme veg som opp, evt ned mellom Heimdalshø og 1732 moh. Her er det ofte har betre føre. Ettersom terrenget er slakt hele vegen, er ikke turen like spennende etter store snøfall.» Topp 1732 ligger 582 meter sørvest for linja.",
      "Bollen mellom Heimdalshøe og 1732 er den Fri Flyt advarer mot: den «kan samle store mengder snø, og bør bare kjøres på senvinteren og våren». Sadelen mellom toppene ligger på 1669 moh, og mellom 5,40 og 5,76 km går linja 406 til 454 meter nord for den, over øvre del av den nordvendte sida — det kan være øvre del av bollen. Vil du ha den enkle turen, kjører du samme vei ned og holder deg på ryggen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste bandet er 14,3 grader mellom 1300 og 1400 moh, og bratteste sammenhengende parti 19,3 grader mellom 1383 og 1398. Bakken under linja er ikke 35 grader eller brattere noe sted. Fri Flyt graderer turen «KAST 1 – Enkelt» med bratteste punkt under 30 grader.",
      },
      {
        title: "Terrenget utenfor",
        body: "Fri Flyt: «Vær obs på trange og dype bekkefar som samler lange, harde og bratte skavler.» Bekkefaret nord for linja ved 1371–1399 moh har sider på 45 til 57 grader. Den nordvendte bollen mellom toppen og 1732 kan samle store mengder snø, og linja krysser øvre del av den nordvendte sida nord for sadelen. Over skogen er det snaufjell uten ly, og toppen er et steinete platå.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Jotunheimen er en A-region og varsles daglig i sesongen. Fv51 er åpen fra Vågå til Gjendesheim hele året; strekningen over Valdresflye sør for Maurvangen er vinterstengt. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,198 L38,196 L60,195 L77,192 L101,189 L124,182 L145,176 L171,168 L192,162 L211,156 L231,148 L251,137 L265,131 L283,118 L299,111 L323,103 L342,101 L355,94 L372,86 L392,74 L410,65 L427,63 L449,58 L470,54 L491,52 L513,50 L538,42 L560,33 L585,23 L600,18",
      startLabel: "970 moh",
      endLabel: "1843 moh",
      distanceLabel: "6,3 km",
      caption: "879 høydemeter og 6,32 km fra Maurvangen, med skoggrensa på 1036 moh, Molflyhalsen på 1447 og bratteste bandet mellom 1300 og 1400.",
    },
  },
  eggja: {
    slug: "eggja",
    intro:
      "680 høydemeter på 2,83 km fra toppen av Rørvikfjellet: forbi Fjelltjønna, opp ryggformasjonen og over kammen til Eggja på 1204 moh, østtoppen på Rimmane. Fri Flyt kaller toppen Ørnafjellet og ut.no «den austlege toppen på fjellpartiet Rimmane»; kartet kaller den Eggja, og registerets Ørnafjellet er en annen topp 1121 meter lenger øst. Bratteste sammenhengende parti på linja er 25,3 grader mellom 916 og 940 moh — men det er sporets stigning, og bakken det krysser er brattere.",
    ascent: [
      "Parkeringa ligger på toppen av Rørvikfjellet, 542 moh, 100 meter fra Rørvik fjellstove mot Førde. Det er her Fri Flyt sier du kan spenne på skia ved bilen, og at turen derfor er snøsikker fra tidlig i sesongen; Fjord Norway skriver at lokale går den allerede i november og desember.",
      "Gå nordover og forbi Fjelltjønna med tjernet på venstre side — linja går øst for det, 70 meter fra registerpunktet. Så et lite stykke nordøst til ryggformasjonen, 647 moh etter 937 meter, som du følger mot nordvest. Der linja tar østover inn på ryggen, krysser den 50 meter bakke på 35 grader eller brattere, med en celle på 61 grader — et brattheng du ser og velger linje gjennom selv. Ut.no-stien går «inn i skogen over fjelltjønna»; langs linja er terrengklassen åpent fjell nesten fra start.",
      "Ryggen er det bratte. Bandet fra 700 til 800 moh måler 17,3 grader. Bandet fra 800 til 900 moh måler 20,0 grader over 263 meter grunn og er det bratteste på turen. Bandet fra 900 til 1000 moh måler 19,9 grader. Bandet fra 1000 til 1100 moh måler 19,3 grader. Det bratteste sammenhengende partiet, 25,3 grader mellom 916 og 940 moh, ligger midt på ryggen — der bakken under sporet er 35 til 47 grader over 39 meter — og Fri Flyt oppgir bratteste punkt til 27–32 grader, øverst på ryggen over 1000 moh. Innenfor 50 meter av linja står knauser og hamrer på 41 til 67 grader; sommerstien på ut.no går gjennom «ei rås i ein bratt berghammar» og gir en veg rundt den. Vinterlinja følger ryggformasjonen.",
      "Ved 1134 moh flater det ut, og du legger sporet nordover til kammen og så østover til toppen etter 2,83 km. Terrengmodellen leser 1204 moh; Fri Flyt, ut.no og kartet sier 1209. Kammen fortsetter østover over et skar på 1111 moh til registerets Ørnafjellet, 1228 moh — den toppen Fri Flyt fører som Blåfjellet, 1226 moh, med egen tur fra Hårklau, og foreslår som rundtur herfra.",
    ],
    descent: [
      "Fri Flyt: samme veg ned, eller en av mange linjer mellom toppen og høyden på 1125 moh langs Rimmane. Sørsida av toppen måler 14,2 grader i snitt og 26,1 grader i bratteste vindu, 230 til 290 meter ut, og vestover mot Rimmane er kammen slak, 8,2 grader i snitt. Fri Flyt skriver at de sørvendte sidene gir sol på kalde vinterdager.",
      "Nordsida er hamrer: 52,3 grader i bratteste vindu 390 til 450 meter ut, og nordvestsida 48,0 grader. Sørvest måler 39,5 grader 440 til 500 meter ut. Kjør ned sørover, ikke nordover.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti på linja er 25,3 grader mellom 916 og 940 moh, og bratteste hundremeteren er 800 til 900 moh med 20,0 grader. Det er stigningen langs sporet. Bakken sporet krysser er 35 grader eller brattere over 50 meter ved 628–644 moh, med en celle på 61 grader, og over 39 meter ved 921–940 moh. Fri Flyt oppgir bratteste punkt til 27–32 grader, øverst på ryggen over 1000 moh.",
      },
      {
        title: "Terrenget utenfor",
        body: "Ryggen har knauser og hamrer på 41 til 67 grader innenfor 50 meter av linja, og nordsida av toppen bryter av i 52,3 grader. Sørsida, der nedkjøringene går, ligger i sola — det er det Fri Flyt selger turen på, og det er også det som varmer snøen når dagen blir lang.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Rørvikfjellet er tilgjengelig om vinteren; det er Nasjonal turistveg Gaularfjellet som ifølge Fjord Norway vanligvis åpner i månedsskiftet april/mai. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L27,200 L56,197 L76,195 L104,189 L124,190 L151,180 L180,173 L206,170 L218,164 L234,159 L266,146 L285,140 L300,134 L316,126 L342,115 L361,104 L376,97 L397,85 L419,78 L440,70 L467,57 L491,44 L510,37 L534,32 L555,27 L582,22 L600,18",
      startLabel: "542 moh",
      endLabel: "1204 moh",
      distanceLabel: "2,8 km",
      caption: "680 høydemeter og 2,83 km fra Rørvikfjellet, i åpent fjell nesten fra bilen og med bratteste hundremeteren mellom 800 og 900 moh.",
    },
  },
  kvamshesten: {
    slug: "kvamshesten",
    intro:
      "830 høydemeter på 5,34 km fra Rytnavegen, det meste av det slakt — og så en skål på slutten som måler om lag 36 grader i snitt fra Grunnevatnet til toppen. Isøks og stegjern står i utstyrslista av den grunn.",
    ascent: [
      "Start ved veienden på Rytnavegen, 404 moh — den private veien som er skiltet mot parkering til Storehesten, som er det lokale navnet på det samme fjellet. Fri Flyt oppgir to vertikaler for dette fjellet, og de er to ulike starter: 960 høydemeter fra Rytnane nede i dalen, og 810 herfra.",
      "Følg skogsveien oppover mot Kårstadstølen på 495 moh, og hold deretter øst mot Rabbane på 512. Ruta går østover før den snur nordover — det ser ut som en omvei på kartet, og det er den beskrevne veien.",
      "Fra Rabbane går det nordover mot skaret øst for Skaravatnet på 715 moh. Partiet mellom 700 og 800 moh er det slakeste på turen, 3,8 grader over 1439 meter grunn. Ruta går vestover langs nordsida av vatnet og forbi Grunnevatnet på 785 moh — og linja ligger på isen underveis: om lag 240 meter på Skaravatnet, 58 meter på et navnløst tjern på 726 moh i skaret, og om lag 260 meter på Grunnevatnet, opptil om lag 40 meter fra land. Alle tre er naturlige fjellvatn, ikke magasin, men det er vatn under snøen og skal vurderes som det.",
      "Vest for Grunnevatnet tar du litt høyde og følger så den markerte skålformasjonen sørover helt opp. Bandet fra 1000 til 1100 moh måler 11,1 grader i snitt over 537 meter grunn; bratteste hundremeteren er 13,8 fra 900 til 1000 moh, og bratteste sammenhengende parti 36,2 grader mellom 665 og 688 moh. Fra Grunnevatnet til varden på 1209 moh er det 424 høydemeter på 581 meter grunn — om lag 36 grader i snitt over hele skåla.",
    ],
    descent: [
      "Ned samme skåla og tilbake over Grunnevatnet, Skaravatnet og Rabbane. Fallretninga er nord, og skåla er både oppstigninga og nedkjøringa.",
      "Vanligste feil: å gå opp skåla på hardt føre uten isøks og stegjern. Fri Flyt fører begge deler som nødvendig utstyr på denne turen, og grunnen står i tallene — 36 grader i snitt over de siste 424 høydemeterne er ikke en bakke du sklir kontrollert nedover.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak til 900 moh og bratt over. Skålformasjonen sør for Grunnevatnet er skredterreng: bandet fra 1000 til 1100 moh måler 11,1 grader i snitt, bratteste sammenhengende parti 36,2 grader mellom 665 og 688 moh, og hele strekket fra Grunnevatnet til toppen ligger på om lag 36 grader.",
      },
      {
        title: "Terrenget rundt",
        body: "Skåla er den ene store vurderinga på turen, og den har ingen omvei: ruta går opp gjennom den. Hardt føre gjør siste stigninga til en klyving heller enn en skitur, og det er da isøks og stegjern går fra å være utstyr i sekken til å være det du står på. Toppen selv har en side det ikke går an å holde seg på: sør og sørøst måler 48,9 og 47,1 grader i snitt over 500 meter, med 60-metersvinduer på 74,0 og 74,3. Øst og vest, 15,1 og 13,8 grader, er de slake, og skåla kommer opp fra nord.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,190 L45,183 L71,177 L101,175 L121,166 L141,157 L162,153 L184,147 L202,134 L227,130 L247,127 L268,126 L288,126 L308,118 L333,114 L358,113 L385,104 L399,96 L421,89 L441,80 L462,69 L485,54 L510,43 L530,44 L546,36 L566,31 L589,20 L600,18",
      startLabel: "404 moh",
      endLabel: "1209 moh",
      distanceLabel: "5,3 km",
      caption: "830 høydemeter og 5,34 km fra Rytnavegen over Kårstadstølen, Skaravatnet og Grunnevatnet, med den bratte skåla mellom 1000 og 1100 moh.",
    },
  },
  rasletinden: {
    slug: "rasletinden",
    intro:
      "En 2104-meter for de fleste: 778 høydemeter fra Valdresflye, og bratteste sammenhengende parti på linja måler 21,7 grader. Det som gjør turen krevende er været og vidda — den blir vanskelig i dårlig sikt, ikke i dårlig føre.",
    ascent: [
      "Start på parkeringa på østsida av fv51 der Valdresflya vandrerhjem sto før brannen i 2015, 1391 moh. Veien er det som setter sesongen: fv51 er brøytet vinteren gjennom bare til Bygdin, og strekninga nordover forbi vandrerhjemmet åpner normalt rundt 1. april.",
      "Herfra går ruta vestover ut på vidda, sør for Fisketjerne. De første 1,2 kilometerne er helt flate og faller faktisk ti høydemeter — du kommer til å stake dem, og du kommer til å stake dem hjem igjen. Vidda er samtidig helt åpen og gir ingen ly. Underveis går linja over is to ganger: 135 meter på 1379 moh, opptil 50 meter fra land, og 225 meter på 1377 moh, opptil 100 meter fra land. Ingen av de to har navn i registeret — Fisketjerne ligger 824 meter unna — og begge er naturlige tjern, ikke regulerte. På ei flate der resten er fast mark er de verdt å vite om.",
      "Så stiger det jevnt mot den første kneika på rundt 1530 moh og videre opp på ryggen ved 1736 moh. Ryggen følges vestover, sør for Øystre Rasletinden (2011 moh), til rundt 1890 moh. Merk at sporet her ikke ligger på en rygg i skredfaglig forstand: mellom 1810 og 1890 moh går det under sørsida av Øystre Rasletinden, som stiger 130 høydemeter rett over deg med et parti på 47 grader. Ikke gå over Øystre Rasletinden: øst- og sørøstsida av den toppen måler 42 til 50 grader, og linjer inn dit fra øst får steg på 51 til 63.",
      "Til slutt den korte kneika opp mot toppplatået. I fallinja måler den 31 til 35 grader mellom 1910 og 1960 moh; over 1960 slakner den til 16 til 20 inn mot platået. Det er ett av to steder på ruta med et samlet bratt heng over deg — det andre kommer lenger nede, på ryggen under Øystre Rasletinden. Linja som er tegnet legger seg på skrå over den og holder 21,7 grader som bratteste sammenhengende parti; den bratteste hundremeteren, 1900 til 2000 moh, måler 15,1 grader i snitt. Over kneika er det ut på platået og de siste hundre meterne til 2104 moh.",
    ],
    descent: [
      "Ned samme vei: kneika, ryggen østover sør for Øystre Rasletinden, ned til 1736 og videre ned første kneik til vidda. Under første kneik, fra 1531 moh, er det slutt på kjøringa — de siste to kilometerne over vidda er flate, og de ti høydemeterne du fikk gratis på vei ut skal betales tilbake.",
      "Vanligste feil: å ta ut kursen nordover fra toppplatået fordi det ser slakt ut. Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare øst og nordøst er slake — øst måler 26 grader, nordøst 32 — og det er den veien du kom.",
      "Waypointet på 1890 moh ligger på det terrengmodellen klassifiserer som snø og is. Det er en permanent snøfonn, ikke en sprukken bre: Leirungsbrean og Kalvehøgdbreene ligger fire kilometer lenger vest og sør.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nesten hele ruta er slak: første kneik måler 22 til 24 grader, ryggen 23, og bratteste sammenhengende parti på linja 21,7 grader. To steder har et samlet bratt heng over seg. Kneika under toppplatået måler 31 til 35 grader i fallinja mellom 1910 og 1960 moh. Og ryggtraversen mellom 1810 og 1890 moh går under sørsida av Øystre Rasletinden: 130 høydemeter rett over sporet, 34 grader i snitt og 47 på det bratteste. Begge steder legger sporet seg på skrå, men snøen over deg bryr seg ikke om sporet — og et sørvendt heng i april er nettopp det du vurderer tidlig på dagen.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare øst (26 grader) og nordøst (32) er slake, og de er ruta. Øystre Rasletinden, 2011 moh, ser ut som en naturlig del av ryggen, men øst- og sørøstsida av den måler 42 til 50 grader — skiruta går sør for toppen, ikke over den.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,196 L19,196 L41,197 L64,199 L82,200 L101,200 L118,198 L143,197 L169,193 L189,185 L209,174 L225,168 L244,159 L267,153 L285,147 L303,136 L323,129 L342,122 L363,109 L387,118 L402,117 L424,107 L447,99 L466,94 L488,85 L503,72 L526,53 L548,40 L571,30 L594,21 L600,18",
      startLabel: "1391 moh",
      endLabel: "2104 moh",
      distanceLabel: "7,2 km",
      caption: "778 høydemeter og 7,18 km fra Valdresflye, der de første 1,2 kilometerne er flate og faller ti meter.",
    },
  },
  banseterkampen: {
    slug: "banseterkampen",
    intro:
      "301 høydemeter og 1,83 km fra Bånsetra opp på en fjellrygg med stup mot sør. Ruta selv er slak — bratteste hundremetersband er 14,0 grader fra 900 til 1000 moh, og bratteste steg 22,1 grader mellom 986 og 1000 — men sørsida under toppen måler 30,8 grader i snitt med 54,6 i vinduet 50 til 110 meter ut.",
    ascent: [
      "Start på Bånsetra, 913 moh — setervollen der Bånsetervegen ender. Ut.no oppgir 914 for samme punkt. Veien inn er skiltet fra fylkesveg 319 sør for brua over Lågen i Fåvang, og det er et setergrend- og hyttefelt med eget vegnett: Bånsetervegen, Svarttjønnvegen, Tutlidalsvegen og Årnesfeltet er alle kartlagt.",
      "Rett vestover og opp lia er det korteste bratte partiet på turen: 14,0 grader fra 900 til 1000 moh over 348 meter grunn, med et steg på 22,1 grader mellom 986 og 1000. Skogen slipper taket allerede på 954 moh og terrenget er åpent fra 961 — dette er en tur som er over tregrensa etter tre hundre meter.",
      "Videre skrår linja sørvestover: 12,5 grader fra 1000 til 1100 moh over 461 meter grunn, og så opp på ryggen. Bandet fra 1100 til 1200 moh måler 5,8 grader over 967 meter grunn — ryggen stiger jevnt og slakt helt til toppen.",
      "Toppen er en bred kuppel på 1202,4 moh, og det er den ut.no fører med 1202 som høyeste punkt på Bånsæterkampen. Ryggen fortsetter vestover langs kanten til en lavere topp på 1196,1 moh, 890 meter unna bak et søkk — den toppen kortet tidligere førte. Utsikten går til Jotunheimen i vest og Rondane i nord, og ned på fem seterområder i sør.",
    ],
    descent: [
      "Ned samme veien, nordøstover. Den sida måler 5,7 grader i snitt over 400 meter med et bratteste 60-metersvindu på 10,1 — det er den slake ryggen ruta kom opp — og nord måler 7,4 med 11,0.",
      "Sørsida er en annen sak, og den er grunnen til at denne turen har en gradering i det hele tatt. Ut.no skriver om «bratte stup mot sør» og «fjellrygger som går stupbratt et par hundre meter ned», og sveipet setter tall på det: sørøst 31,0 grader i snitt med 54,1 i vinduet 40 til 100 meter ut, sør 30,8 med 54,6 i 50 til 110, øst 28,2 med 41,7 i 140 til 200, og sørvest 20,1 med 32,4 lenger ute, 200 til 260.",
      "Om sommeren går det tydelig sti langs kanten av fjellhamrene, og ut.no skriver at man går trygt der. Under snø er den kanten en skavlkant, og den er ikke til å se i flatt lys. Hold nordsida av ryggen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "301 høydemeter der bratteste band er 14,0 grader og bratteste steg 22,1. Ruta gir tilbake 12 høydemeter på 1,83 km, og ryggen opp mot toppen måler 5,8 grader over 967 meter grunn. Oppstigninga i seg selv er ikke et skredproblem.",
      },
      {
        title: "Eggen",
        body: "Hele graderinga ligger i kanten. Sør og sørøst måler 54,6 og 54,1 grader i bratteste 60-metersvindu bare 40 til 110 meter fra toppen, og øst 41,7. Det er ikke terreng du kommer tilbake fra hvis du går ut på skavlen, og på en rygg som ellers måler 5,8 grader er det ingenting som varsler deg om at kanten kommer.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Oppland sør på varsom.no. Oppland sør er en B-region: den varsles bare når faregraden ventes å bli 4 eller 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Begge ut.no-beskrivelsene er sommerbeskrivelser og fører sesong juni til september; sesongen på kortet er lest ut av at Bånsetra er et hyttefelt med brøytt vegnett. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,191 L58,174 L88,163 L102,154 L117,142 L132,131 L147,126 L161,121 L191,107 L221,96 L235,90 L265,81 L279,80 L304,77 L323,71 L338,69 L368,73 L394,73 L406,71 L414,66 L427,56 L456,49 L486,39 L501,36 L530,32 L559,24 L581,19 L600,18",
      startLabel: "913 moh",
      endLabel: "1202 moh",
      distanceLabel: "1,8 km",
      caption: "301 høydemeter og 1,83 km fra Bånsetra opp lia til 1100 moh og opp ryggen til toppen på 1202, med skogen som slipper taket på 955 moh.",
    },
  },
  venevassegga: {
    slug: "venevassegga",
    intro:
      "533 høydemeter på 4,68 km fra Rørvik fjellstove: en lang, avrundet rygg sørvestover, nord for Svartenova, opp i Jakobskardet der ryggen deler seg, og ryggen sørover til Venevassegga på 1024 moh. Bratteste sammenhengende parti er 26,2 grader mellom 679 og 701 moh, tidlig på ryggen; resten er slakt, og Fri Flyt skriver at turen «passar også fint som fjellskitur».",
    ascent: [
      "Start ved parkeringa på toppen av Rørvikfjellet, 542 moh, 100 meter fra Rørvik fjellstove mot Førde — samme parkering som Eggja. Fri Flyt starter turen ved fjellstova og går sørvestover langs en lang, avrundet rygg i oversiktlig terreng.",
      "Den første kneika er den bratte. Fra parkeringa opp til 600 moh måler linja 14,1 grader over 230 meter grunn, og Fri Flyt oppgir 26 til 30 grader mellom 575 og 600 moh. Linjas bratteste 30-metersvindu, 26,2 grader, ligger litt høyere, mellom 679 og 701 moh. Skogen slipper ved 592 moh. Bakken under linja er brattere enn sporet på noen korte strekk her: 20 og 33 meter på 35 grader eller mer ved 702–713 moh, med en celle på 54 grader, og 36 meter ved 732–735 moh — knauser du ser og velger linje rundt.",
      "Over det er ryggen slak: bandet fra 700 til 800 moh måler 3,9 grader over 1531 meter grunn. Linja passerer nord for Svartenova — toppen ligger 142 meter sørøst for linja — og går opp i skaret der ryggen deler seg, Jakobskardet, 853 moh etter 3,06 km. Skaret er sadelen mellom Venevassegga og Rundenova; grenen mot nordvest går til Rundenova, 721 meter fra linja, og Venevassegga ligger sørover.",
      "Fra skaret følger du ryggen sørover. Bandet fra 900 til 1000 moh måler 7,3 grader. Ved 906–908 moh krysser linja 17 meter bakke på rundt 40 grader, og langs ryggen står knauser og hamrer på 53 grader og mer innenfor 50 meter av linja — små brattheng i et ellers slakt fjell. Toppen er på 1024 moh etter 4,68 km.",
    ],
    descent: [
      "Fri Flyt: «Det er vanleg å køyre ned same vegen som du gjekk opp.» Toppen er slak på nesten alle sider — 6,1 til 11,9 grader i snitt mot nord, øst og vest over 500 meter — og nordsida, som er den ruta vender mot, måler 7,3 grader.",
      "Sørvestsida er unntaket: 36,3 grader i bratteste vindu 270 til 330 meter ut, og mot nordvest bryter terrenget av i 52,7 grader 440 til 500 meter ut. Kjør tilbake langs ryggen til Jakobskardet og videre mot fjellstova.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti på linja er 26,2 grader mellom 679 og 701 moh, og bratteste bandet er stykket under 600 moh med 14,1 grader. Bakken under sporet er 35 grader eller brattere på fire korte strekk på 17 til 36 meter, med bratteste celle 54 grader. Fri Flyt graderer turen som «Lett».",
      },
      {
        title: "Terrenget utenfor",
        body: "Terrenget er slakt, men ikke uten brattheng: knauser og små hamrer langs ryggen, og sørvest- og nordvestsida av toppen på 36,3 og 52,7 grader. Ryggen er snaufjell uten ly, og i skodde er det orienteringen som er det vanskelige — de avrundede ryggene ligner hverandre.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Rørvikfjellet er tilgjengelig om vinteren; Nasjonal turistveg Gaularfjellet åpner ifølge Fjord Norway vanligvis i månedsskiftet april/mai. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,188 L34,174 L57,168 L80,161 L98,160 L126,157 L144,149 L163,137 L182,128 L195,129 L218,130 L236,131 L259,132 L278,126 L294,120 L320,120 L340,110 L357,97 L380,83 L397,80 L420,72 L438,71 L460,65 L478,53 L501,44 L524,38 L547,32 L564,25 L587,20 L600,18",
      startLabel: "542 moh",
      endLabel: "1024 moh",
      distanceLabel: "4,7 km",
      caption: "533 høydemeter og 4,68 km fra Rørvikfjellet, med skoggrensa på 592 moh, Jakobskardet på 853 og bratteste bandet under 600 moh.",
    },
  },
  molden: {
    slug: "molden",
    intro:
      "623 høydemeter på 3,31 km fra Mollandsmarki opp sørvestryggen, med Lustrafjorden under seg hele veien. Bratteste hundremeteren måler 16,3 grader, og bratteste sammenhengende parti 23,3 — det ligger nede i skogen, ikke på ryggen.",
    ascent: [
      "Start på den kartfestede parkeringa på Mollandsmarki, 501 moh, over Marifjøra i Luster. De første hundre metrene grunn er flate — bandet fra 400 til 500 moh måler 0,5 grader — før veien mot Garden begynner å stige.",
      "Følg veien og deretter sommerstien opp gjennom skogen. Stigningen er jevn og uten overraskelser: 10,0 grader fra 500 til 600 moh, 11,6 fra 600 til 700 og 14,3 fra 700 til 800. Bratteste sammenhengende parti på hele turen ligger her nede, 23,3 grader over tretti meter mellom 704 og 718 moh.",
      "Skogen holder til 851 moh. Over tregrensa, ved omtrent 816 moh, tar du inn på sørvestryggen, og den fører hele veien opp. Bratteste hundremeteren er 900 til 1000 moh med 16,3 grader i snitt — det er de bratte punktene rutebeskrivelsen varsler om, og de er korte.",
      "Fra 1000 moh slakker det av igjen: 7,9 grader fra 1000 til 1100 moh og 6,5 over det, med varden på 1120 moh. Østtoppen på samme høyde ligger like ved for den som vil ha utsikten fra begge.",
    ],
    descent: [
      "Ned samme ryggen, sørvestover. Ryggen er bred, og på stabile dager kan du også kjøre rett vestover fra toppen.",
      "Vanligste feil: å velge den vestlige linja uten å tenke på hvor den ender. Går du vestover i stedet for å følge ryggen ned, havner du i den tette skogen under 851 moh, og det er en lang og lite trivelig måte å komme tilbake til bilen på.",
      "Fra kaia i Marifjøra får du hele fjellet: 1131 høydemeter på 5,29 km mot normalrutas 626 på 3,31 km — Molden fra fjorden i stedet for fra Mollandsmarki på 501 moh. Kildens beskrivelse er kort og treffer: traktorvei og grusvei, «etter 1,5 km går bratt oppover i skogen til Steinkveane», videre til den nedlagte stølen Svolsete på 724 moh og så fjellterreng med noen bratte bakker til topps. Det bratteste steget ligger nettopp der, 36,3 grader mellom 108 og 140 moh, rett over veien; høyere oppe måler det bratteste hundremetersbeltet 21,0 mellom 300 og 400. ut.no: 12,5 km, 1106 høydemeter, fem timer, juni–oktober.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bred sørvestrygg med jevn stigning. Bratteste hundremeteren, 900 til 1000 moh, måler 16,3 grader, og bratteste sammenhengende parti 23,3 grader mellom 704 og 718 moh — nede i skogen, der terrenget er kort og oversiktlig.",
      },
      {
        title: "Terrenget rundt",
        body: "Sørvestryggen har et par brattere punkter den siste biten opp, og de er verdt å se på når snøen er ustabil. Vestsida under toppen er den andre vurderingen: den blir kjørt på stabile dager, og den ender i tett skog. Den tredje er fjordsida, og den er ikke en vurdering men en grense: øst og sørøst fra varden måler 46,1 og 46,4 grader i snitt over 500 meter, med 60-metersvinduer på 62,4 og 63,6. Utsikten ned mot Lustrafjorden kommer fra en kant, ikke fra en helling.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Sogn på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L29,199 L54,192 L82,185 L106,175 L123,170 L140,163 L172,151 L196,143 L221,135 L237,130 L266,119 L286,110 L303,102 L322,101 L343,97 L360,90 L382,79 L400,71 L425,60 L441,51 L457,46 L482,40 L507,36 L531,31 L558,28 L582,20 L600,18",
      startLabel: "501 moh",
      endLabel: "1120 moh",
      distanceLabel: "3,3 km",
      caption: "623 høydemeter og 3,01 km fra Mollandsmarki, med skoggrensa på 851 moh og bratteste hundremeteren mellom 900 og 1000 moh.",
    },
  },
  synshorn: {
    slug: "synshorn",
    intro:
      "Kort tur rett opp fra Bygdin, med 360 graders utsikt fra toppen — Jotunheimen i nord, Bygdin i vest, Bitihorn i sør. 428 høydemeter på knapt to kilometer gjør dette til turen du tar når værvinduet er kort.",
    ascent: [
      "Start på parkeringen ved Fagerstrand på østsida av Bygdin, like ved Bygdinstøga og Bygdin Høifjellshotell. Plassen er privat og avgiftsbelagt, og betales med Vipps til nummeret på skiltet. Satsen er oppgitt både som 60 og 80 kroner i ulike kilder, så les skiltet framfor å regne med et beløp. Fv51 er vinterstengt nordover, så Bygdin er den brøytede enden av veien og plassen er tilgjengelig hele våren. Du er over skoggrensa fra første skritt, og stigningen begynner med en gang.",
      "Legg sporet vest- og nordvestover inn mot den nedre delen av Fagerdalen framfor å gå rett mot toppen. Toppen ser nær ut herfra, men rett nord for parkeringen ligger et trinn som holder rundt 40 grader mellom 1090 og 1220 moh, og østsida av Synshorn faller enda lenger: 31 grader i snitt de første fire hundre metrene ned mot Fv51, med et parti på 57 grader. Ingen av dem er oppstigning. Hold deg vest for fjellet til du er over 1400 moh.",
      "Flanken du går på ligger stort sett mellom 10 og 20 grader, i åpent terreng uten en trestamme. De siste hundre høydemeterne, fra 1400 til 1475, ligger i snitt på 16,6 grader, og bratteste enkeltparti på hele ruta måler 22,1 grader. Toppen tas fra sørvest, over den slake platåkanten.",
      "Ved dårlig sikt: ikke gå øst eller nordøst fra toppen. Der slutter fjellet med en gang — østsida måler 31 grader i snitt, nordøstsida 33, og begge har partier over 50 grader innen to hundre meter fra toppryggen. Sørover er fella den motsatte: platået fortsetter nesten flatt og drar deg utover.",
    ],
    descent: [
      "Ned samme flanke som opp. Sørvestflanken er bred og jevn — 16 grader i snitt, 23 på det bratteste — og med vårsnø går den rent hele veien ned mot Fagerdalen.",
      "Vanligste feil: å slippe seg rett sørover fra toppen fordi det er der parkeringen ligger. Sørsida frister nettopp fordi den er slak: 4,5 grader i snitt de første fire hundre metrene, ikke over 23 grader noe sted. Så tar den slutt. Rundt 1425 moh, en snau halvkilometer sør for toppen, faller sørveggen 223 høydemeter på 120 meter — 117 av dem på 56 meter der den er brattest, mellom 1330 og 1210 moh. Hold sørvestflanken i stedet, ned til rundt 1120 moh, og følg sporet øst- og sørøstover tilbake til Fagerstrand.",
      "Ryggen nordvestover mot Heimre Fagerdalshøe (1510) er en forlengelse av turen, ikke en annen veg ned: 1,6 kilometer over et skar på rundt 1360 moh. Nedkjøringen derfra ned i Fagerdalen er brattere enn fra Synshorn og hører til dem som kjenner terrenget.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigningen går i åpent terreng hele veien, uten skog å bremse noe. Bratteste enkeltparti på linja måler 22,1 grader, og de øverste hundre høydemeterne ligger i snitt på 16,6 grader. Selve sporet er altså slakt; det du må vurdere er hva som henger over deg når du kommer inn mot toppen fra sørvest.",
      },
      {
        title: "Terrenget rundt",
        body: "Østsida mot Fv51 faller 31 grader i snitt de første fire hundre metrene fra toppen, ned til rundt 1230 moh, med et 60-metersparti på 57 grader. Nordøstsida måler 33 grader i snitt og 51 på det bratteste, nordsida 28 og 44. Sørsida er den slakeste av alle, 4,5 grader, helt til platået tar slutt en snau halvkilometer sør for toppen og faller 223 høydemeter på 120 meter. Ingen av dem er linjer du velger på veg ned.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,200 L51,196 L76,191 L90,186 L102,181 L120,170 L134,175 L151,175 L167,172 L179,170 L200,161 L218,153 L231,149 L257,140 L269,134 L295,127 L308,124 L334,122 L347,121 L372,118 L385,113 L398,106 L411,99 L437,87 L450,82 L475,78 L501,64 L516,57 L528,51 L543,43 L565,32 L591,21 L600,18",
      startLabel: "1060 moh",
      endLabel: "1475 moh",
      distanceLabel: "2,1 km",
      caption: "1060 til 1475 moh på knapt to kilometer — jevn stigning i åpent terreng, brattest de siste hundre høydemeterne.",
    },
  },
  togga: {
    slug: "togga",
    intro:
      "780 høydemeter og 2,60 km — Togga er en av de korteste veiene til en topp i Sogndalsdalen, og det er nettopp derfor fjellet er så mye brukt: null anmarsj fra toppturparkeringa på Brandhaugane ved rv5, skogskjøring og åpent terreng i samme tur, og seks nedfarter hos Fri Flyt. Kortet bærer grad 3, og grunnen står i kildens egen advarsel: på sørøstryggen — normalveien — har skiløpere løst ut skred under opptur i ustabile forhold. Linja måler 27,6 grader som bratteste sammenhengende parti; henget den går i, gir Fri Flyt 33–35.",
    ascent: [
      "Start på toppturparkeringa på Brandhaugane, 427 moh ved rv5 noen kilometer før skisenteret — registeret har Brandhaugane som haug i skogen rett ved, og Fri Flyts 785 høydemeter impliserer nøyaktig denne starten. Gå mot sørøstryggen og følg den oppover gjennom skogen; linja passerer 542 moh i skogen, som etter Kartverkets klasser slutter på 775.",
      "Over skoggrensa kommer det brattere partiet, og det bratteste hundremetersbeltet på turen, 22,5 grader i snitt mellom 800 og 900 moh. Dette er stedet kildens skredadvarsel gjelder: her har skiløpere løst ut skred på vei OPP. Sikksakk med vett, og snu her om snøen sier fra.",
      "Ved Orraleiken flater terrenget ut, slik kilden sier — registerpunktet leser 1042 moh i åpent terreng. Pusterom, og så den siste stigningen: linja passerer 1155 og varden står på 1204 moh, målt mot registerets 1203 og Fri Flyts publiserte 1205.",
      "Registeret fortjener en setning her også: uten styring klatrer toppsøket forbi navnet og videre vestover, for ryggen stiger uten skar mot høyere fjell — 1236 bare 280 meter vest, 1354 knapt kilometeren ute. Togga er det navngitte punktet, ikke det høyeste på ryggen, og kortet bærer det navngitte.",
    ],
    descent: [
      "Normalveien ned er samme vei som opp: siste stigningen, Orraleiken, og det brattere partiet ned i skogen. Det brattere partiet er samme henget som på vei opp — det som kan løses ut under opptur, kan løses ut under nedkjøring, og linjevalget fra oppturen er fasiten.",
      "Fri Flyt beskriver fem nedfarter — sørøstryggen, to på sørsida og to østover, med utganger mot Laugadalen, Gunvordalen og Vatnasete. Ingen av dem er denne linja, og målingene fra varden sier hva de krever: de to østvariantene måler 50,5 og 51,1 grader i bratteste 60 m-vindu og sørsida 41,9. Nordsida, som ingen av dem går ned, faller 44,8 grader 210–270 m ut. Det er ekte alpine alternativ på et fjell med kort vei hjem — velg etter snøen, ikke etter lista.",
      "Vestover skal ingen: ryggen stiger videre mot høyere fjell, og i skodde er det den veien du havner om du bare «følger ryggen». Kompasskurs sørøst fra varden.",
    ],
    avalanche: [
      {
        title: "Normalveien",
        body: "Fri Flyts egen advarsel er uvanlig konkret, og den skal siteres nesten ordrett: på sørøstryggen er det et brattere parti der skiløpere har løst ut snøskred under opptur når det er ustabile snøforhold. Det partiet ligger mellom skoggrensa på 775 og Orraleiken på 1042, med beltet 800–900 moh som det bratteste målte. Kildens bratteste punkt er 33–35 grader; linja sikksakker slakere, men henget er det samme.",
      },
      {
        title: "Variantene",
        body: "Fri Flyt legger sin egen NB på østflanken: «Skiløpere har flere ganger løst ut flakskred i denne østlige flanken», og nedfarten ved høyde 1140 «krever stabile snøforhold». Fem nedfarter gir fem måter å øke innsatsen på: nord-, nordøst- og østsida måler 44,8 til 51,1 grader i sine bratteste 60 m-vinduer, sørsida 41,9. Kort vei til bilen gjør det fristende å ta en variant til — det er nettopp da snøvurderingen fra i stad skal gjelde ennå.",
      },
      {
        title: "Ryggen som stiger",
        body: "Vest for varden stiger ryggen videre uten skar — snittet vestover er negativt fordi terrenget går opp. I godt vær er det åpenbart; i skodde er det en felle: den som følger ryggen videre, går inn i brattere og villere fjell, ikke ned. Sørøst er hjemveien, alltid.",
      },
      {
        title: "Før du går",
        body: "Togga ligger i varslingsregionen Indre Sogn, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt publiserer ingen sesongmåneder for Togga; Sogndal-sida deres setter sesongen fra november til mai. Kortets desember–mars er appens egen innsnevring til midtvintermånedene, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,200 L51,200 L82,194 L105,188 L123,181 L140,177 L154,173 L175,165 L186,161 L207,154 L227,146 L242,141 L263,132 L277,126 L297,118 L304,115 L329,104 L342,99 L357,93 L379,84 L394,80 L415,72 L435,63 L450,57 L467,50 L487,46 L508,40 L519,37 L540,30 L550,28 L574,22 L592,20 L600,18",
      startLabel: "427 moh",
      endLabel: "1204 moh",
      distanceLabel: "2,6 km",
      caption: "780 høydemeter og 2,60 km fra Brandhaugane — sørøstryggen med det skredutsatte brattpartiet, Orraleiken, og varden på 1204.",
    },
  },
  bitihorn: {
    slug: "bitihorn",
    intro:
      "Bitihorn står alene sør for Bygdin og ses fra hele Øystre Slidre. Normalruta går opp baksida — 554 høydemeter i jevn stigning, flatt den første kilometeren og merket med jernstenger øverst.",
    ascent: [
      "Start på parkeringen ved Fv51, en kilometer sør for Bygdin Høifjellshotell. Avgift 60 kroner dagen. Du er over skoggrensa allerede fra bilen. Den første kilometeren går over det flate platået vest for Stavtjerne og gir bare rundt tretti høydemeter, med et myrdrag som ligger dekket når det er skiføre.",
      "Etter platået runder du foten av nordryggen og passerer grinda i reingjerdet. Herfra legger du sporet opp den brede nordvestskuldra. Den ligger stort sett på 15 til 22 grader, og de bratteste hundre høydemeterne, fra 1300 til 1400, ligger i snitt på 18,9 grader.",
      "Øverst er ruta merket med jernstenger. De står der for folkene som vedlikeholder sambandsanlegget på toppen, og de er verdt gull i flatt lys. Bratteste enkeltparti på hele linja måler 23,8 grader, og det ligger her oppe, over 1500 moh. Toppen er 1607 moh, med Bygdin i nord og Jotunheimen bak.",
      "Hold skuldra. Østover, mot Fv51, faller fjellet 43 grader i snitt de første fire hundre metrene, og mellom 1580 og 1420 moh — rett under toppen — går det 65 til 74 grader. Sørøstover, mot Nørdre Båtskardet, er snittet 41 grader og bratteste parti 63. Sørsida er slak øverst, rundt 16 grader de første to hundre metrene, og går så over i et trinn på 40 til 59 grader mellom 1535 og 1435 moh. Televerkets vinterløype svinger lenger vest, opp fra Raudfjorden på vestryggen, og møter denne linja først oppe under toppen; begge ligger på samme nord- og nordvestside.",
    ],
    descent: [
      "Ned samme skulder. Jernstengene tar deg ned de øverste hundre høydemeterne i dårlig sikt, og under det er skuldra bred nok til at du kan velge linje selv.",
      "Vanligste feil: å slippe seg østover fra toppen mot veien du ser under deg. Der ligger østveggen over Fv51 — 43 grader i snitt, og 65 til 74 rett under toppryggen — og sørøstover skaret mot Nørdre Båtskardet, 41 grader og oppbrutt. Hold nordvestskuldra til terrenget flater ut, og ta så platået tilbake til parkeringen.",
      "Sørruta fra Båtskaret finnes — 454 høydemeter på halvannen kilometer — men den er dokumentert som fottur, ikke som skioppstigning. Den er ikke veien ned herfra.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nordvestskuldra ligger stort sett på 15 til 22 grader, de bratteste hundre høydemeterne 18,9 grader i snitt, og bratteste enkeltparti 23,8 grader oppe over 1500 moh. Visit Valdres beskriver flere linjevalg under 30 grader på denne sida, men med terrengfeller og utløpssoner i forsenkningene. Velg linje etter dagens varsel, ikke etter sporet som allerede ligger der.",
      },
      {
        title: "Terrenget rundt",
        body: "Østveggen over Fv51 faller 43 grader i snitt fra toppen, og 65 til 74 grader mellom 1580 og 1420 moh. Sørøstover mot Nørdre Båtskardet er snittet 41 grader med et parti på 63. Sørsida er slak de første to hundre metrene og faller så 40 til 59 grader mellom 1535 og 1435 moh. Toppartiet ligger mellom dem, og ingen av dem er nedkjøringslinjer på denne turen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,197 L50,197 L74,197 L107,197 L140,195 L165,190 L190,186 L207,180 L231,174 L256,167 L281,157 L305,157 L333,152 L355,144 L380,132 L405,124 L421,115 L446,101 L462,89 L487,75 L507,66 L528,54 L543,43 L561,32 L582,24 L600,18",
      startLabel: "1061 moh",
      endLabel: "1607 moh",
      distanceLabel: "3,3 km",
      caption: "1061 til 1607 moh: flatt den første kilometeren, så jevn stigning opp nordvestskuldra til jernstengene.",
    },
  },
  tylderingen: {
    slug: "tylderingen",
    intro:
      "612 høydemeter på 3,00 km fra Fretland i Sogndalsdalen: over jordet til stølen Tråna, opp lia og den sørligste ryggen, og på vestsida av ryggen det siste stykket til toppen på 1104 moh. Bratteste bandet er 15,4 grader mellom 900 og 1000 moh, og bratteste sammenhengende parti 23,8 grader mellom 691 og 707. Fri Flyt: «Sørsida til Tylderingen er ein flott topptur i vintersola med god utsikt og ope landskap som er skivenleg.»",
    ascent: [
      "Start på parkeringa ved gardene på Fretland, 495 moh. Fri Flyt starter ved den vestligste garden; parkeringa ligger øst i tunet, og Stavateig, lenger vest, ligger 346 meter unna. Fri Flyt: «Ta av ved skiltet Fretland og parker oppe ved gardane på egna plassar.» og «Vis omsyn når ein parkerer ved gardane.»",
      "Fri Flyt: «Frå den vestlegaste garden går ein over jordet til stølen Tråna. Herfrå er det ope kulturlandskap opp til tregrensa.» Linja går nordover over jordet og passerer stølen Tråna 69 meter unna ved 0,79 km og Stokksete 80 meter unna ved 1,34 km. Bandene fra 500 til 900 moh måler 9,4 til 14,0 grader, og bratteste parti på turen, 23,8 grader, ligger mellom 691 og 707 moh. Ved 714–723 moh krysser linja 23 meter bakke på 35 grader eller mer, med bratteste celle 42 grader. Skogen slipper ved 860 moh, 1,82 km fra start.",
      "Fri Flyt: «Oppturen følgje den sørlegaste ryggformasjonen oppover. Kring 1050 moh går ein på vestsida av ryggen til ein kjem til toppen.» Bandet fra 900 til 1000 moh er det bratteste, 15,4 grader over 385 meter grunn. Linja er på vestsida av ryggen ved 1062 moh, 2,56 km fra start, og toppen er 230 meter lenger inne. Ved siden av ryggen står celler på 51,9 grader 27 meter nordnordvest for linja ved 1006 moh og 56,3 grader 27 meter sør for den ved 1076 moh — brattere knauser og hyller langs ryggen.",
    ],
    descent: [
      "Fri Flyt: «Nedfarten frå Tylderingen gjev god utsikt frå ryggen og sola i ansiktet. Ein kan følgje same veg ned som ein har gått opp. Det er mykje ope kulturlandskap slik at ein har god plass til å boltre seg i snøen.»",
      "Toppen er slak mot nord, nordøst og sørvest, 5,5 til 10,3 grader i snitt over 500 meter. Mot vest og nordvest faller den 41,9 og 44,9 grader i bratteste vindu 250 til 370 meter ut, og mot øst 35,6 grader 220 til 280 meter ut. Hold deg på sørsida.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 23,8 grader mellom 691 og 707 moh, og bratteste bandet 15,4 grader fra 900 til 1000. Bakken under linja er 35 grader eller brattere i ett strekk på 23 meter ved 714–723 moh. Fri Flyt graderer turen «Lett», med bratteste punkt under 30 grader og «Farar: Ingen».",
      },
      {
        title: "Terrenget utenfor",
        body: "Vest-, nordvest- og østsida av toppen er brattere enn ruta — 35,6 til 44,9 grader i bratteste vindu. Fri Flyt om vanskegraden: «Ved spesielle tilhøve (glasert skare eller liknande) kan ei utgliding eller eit fall utgjere ein risiko.» Sørsida er solvendt; Fri Flyt: «ikkje vent for lenge på sesongen før ein tek turen».",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Sogn på varsom.no. Indre Sogn er en A-region og varsles daglig i sesongen. Ta av fra Dalavegen ved skiltet Fretland og parker på egnede plasser ved gardene. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L19,197 L44,190 L66,185 L77,183 L103,178 L121,172 L136,167 L150,164 L167,161 L188,156 L201,151 L219,145 L238,137 L249,131 L265,126 L292,118 L308,112 L328,103 L346,96 L365,91 L382,85 L404,79 L427,70 L440,66 L459,57 L472,52 L484,46 L504,42 L526,37 L544,33 L571,24 L589,20 L600,18",
      startLabel: "495 moh",
      endLabel: "1104 moh",
      distanceLabel: "3,0 km",
      caption: "612 høydemeter og 3,00 km fra Fretland, med skoggrensa på 860 moh og bratteste bandet mellom 900 og 1000.",
    },
  },
  ulvsjoberget: {
    slug: "ulvsjoberget",
    intro:
      "295 høydemeter og 2,17 km fra Vestby til toppen på 854 moh — den høyeste toppen i Trysil med en publisert rutebeskrivelse som ikke går i alpinanlegget. Bratteste hundremetersband er 12,3 grader fra 500 til 600 moh over 193 meter grunn, og bratteste steg 18,6 grader mellom 582 og 597. Nesten hele stigninga ligger i skog.",
    ascent: [
      "Start i Vestby, 559 moh, rett ved Misjonshuset. Ut.no oppgir 558 for samme punkt. Veien inn er fylkesveg 2160 fra Trysil sentrum — ut.no skriver fv 563, som er det gamle nummeret — 17 km og tjue minutters kjøring, og det er skiltet til parkering.",
      "Det bratteste ligger med en gang: 12,3 grader fra 500 til 600 moh over 193 meter grunn, med turens eneste virkelige steg på 18,6 grader mellom 582 og 597 moh. Over det slakner det til 8,0 grader fra 600 til 700 og 8,4 fra 700 til 800, og linja passerer 676 og 801 moh. Alt dette går i skogsterreng.",
      "Skogen slipper ikke taket før på 826 moh, og terrenget er åpent fra 832. Ut.no beskriver overgangen slik: «På toppen åpner terrenget seg, og du har vid utsikt i alle himmelretninger.» De siste 20 høydemeterne måler 5,4 grader fra 800 til 900 moh over 555 meter grunn, og toppen ligger på 854,2 moh mot ut.nos oppgitte 851.",
    ],
    descent: [
      "Ned samme veien, sørøstover. Den sida måler 5,0 grader i snitt over 400 meter med et bratteste 60-metersvindu på 9,3 — det slakeste av alle åtte retningene fra toppen, og det er den ruta går i.",
      "Det ene stedet fjellet er bratt ligger 400 meter unna og på motsatt kant. Sørvest måler 23,9 grader i snitt med et 49,2-graders vindu 330 til 390 meter ut, og vest 13,0 med 24,5 i 340 til 400. Det er Stygghammeren, og ut.no er tydelig: «Fra Ulvsjøberget er det gammel skilting ned til Stygghammeren, hvor du får flott utsikt over Ulvsjøen. Hit går du på eget ansvar, og vi anbefaler ikke at du tar med små barn hit, da det er en bratt, usikret fjellhylle.»",
      "Under snø er den hylla ikke til å se. Korridoren går ikke dit, og skiltinga som gjør det, er gammel.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "295 høydemeter der bratteste band er 12,4 grader og bratteste steg 17,5. Ruta gir ikke tilbake en eneste høydemeter på 2,14 km. Ut.no fører turen som tough, og det er ikke terrenget som gjør den det — det er at hele stigninga går i skog uten sti å se under snøen.",
      },
      {
        title: "Stygghammeren",
        body: "Sørvest for toppen måler flanken 49,2 grader i bratteste 60-metersvindu, 330 til 390 meter ut, med 23,9 grader i snitt hele veien. Det er den usikrede hylla ut.no advarer mot, og den ligger utenfor ruta — men den ligger nær nok til at en linje valgt på slump fra toppen kan finne den, og under snø er kanten ikke synlig.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hedmark på varsom.no. Hedmark er en B-region: den varsles bare når faregraden ventes å bli 4 eller 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ut.no fører turen som «Vandringsrute 47» i Trysil kommunes eget fjellturprogram og oppgir sesong mai til oktober; sesongen på kortet er lest ut av at fylkesveg 2160 til Vestby er brøytet hele året. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,195 L31,189 L49,177 L62,169 L75,163 L97,154 L111,152 L136,144 L150,142 L173,135 L198,126 L217,123 L235,117 L260,109 L285,103 L302,96 L322,89 L335,85 L360,80 L385,72 L410,66 L422,61 L447,50 L472,44 L497,40 L510,38 L534,36 L559,30 L571,27 L596,19 L600,18",
      startLabel: "559 moh",
      endLabel: "854 moh",
      distanceLabel: "2,2 km",
      caption: "295 høydemeter og 2,14 km fra Vestby opp lia til 676 moh og gjennom skogen til 801, med skogen som slipper taket først på 826 moh.",
    },
  },
  nevelfjell: {
    slug: "nevelfjell",
    intro:
      "268 høydemeter og 4,22 km fra Nordseter til Nevelhytta på 1090 moh. Ingenting på denne turen er bratt: bratteste hundremetersband er 4,3 grader fra 1000 til 1100 moh over 1167 meter grunn, og bratteste sammenhengende steg 17,0 grader mellom 966 og 988. Det bratteste 60-metersvinduet i hele flankesveipet er 19,3 grader.",
    ascent: [
      "Start på parkeringa på Nordseter, 828 moh — avgiftsplass tagget for ski i OSM, 135 meter fra Nordseter Fjellstue. Ut.no: «På oppkjørte løyper nordover fra parkeringsplassen på Nordseter mot foten av toppen.» Nordsetervegen fra Lillehammer er brøytet hele vinteren, og bussen går dit.",
      "Første to kilometerne er flate — bandet fra 800 til 900 moh måler 2,5 grader over 1655 meter grunn — nordover forbi 897 moh. Så kommer Nevelvatnet, og her er det verdt å vite hvor løypa går: linja runder sørenden på 905 moh og går opp på vestsida på 915. Ut.nos egen løypelinje gjør det samme, og terrengmodellen gir Skog på begge punktene. Går du rett over vatnet, går du på is.",
      "Videre nordvestover over Nevelåsen, 992 moh, der terrenget åpner seg. Bandet fra 900 til 1000 moh måler 4,2 grader over 1395 meter grunn; det bratteste steget ligger her, 17,0 grader mellom 966 og 988 moh. Skogen slipper taket på 966 moh og terrenget er åpent fra 972.",
      "Siste kilometeren måler 4,3 grader fra 1000 til 1100 moh over 1167 meter grunn. Ut.no gir to linjevalg inn mot toppen: «Ta av rett opp mot toppen, som inntegnet eller gå løypa på toppens østside og følg ryggen vestover mot toppen.» På 1090 moh står Nevelhytta — Røde Kors' åpne bu med ovn og plass til seks–åtte, sjelden låst, restaurert i 2021 — og en siktskive som navngir toppene fra Jotunheimen til Rondane.",
    ],
    descent: [
      "Ned samme veien, østover. Den sida måler 3,8 grader i snitt over 400 meter med et bratteste 60-metersvindu på 8,5, og vest 3,4 med 8,2. Det er ikke en nedkjøring, det er en retur — og ut.no sier det selv: «det er ikke lenger opp enn at man kan trappe seg fram selv med smale langrennski».",
      "Det bratteste fjellet har å by på ligger mot nord: 11,1 grader i snitt med et 19,3-graders vindu 160 til 220 meter ut. Ingen retning fra toppen har et 60-metersvindu over 20 grader. Faren her er derfor ikke helningen, det er avstanden og likheten: fem kilometer over et løypenett som ser likt ut overalt, og en topp som er det eneste holdepunktet når lyset flater ut. Ut.no peker på at løypa opp til selve toppen ikke er kjørt opp — den siste kilometeren er du alene om sporet.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "268 høydemeter der bratteste band er 4,8 grader og bratteste steg 12,6. Ruta gir tilbake 6 høydemeter på 4,07 km. Det finnes ikke et skredproblem på denne linja, og flankesveipet finner ikke noe rundt toppen heller — 19,3 grader er det bratteste 60-metersvinduet i noen retning.",
      },
      {
        title: "Vatnet og lyset",
        body: "To ting er verdt å ta på alvor. Det ene er Nevelvatnet: linja går rundt det, sør og vest, fordi løypa gjør det — den første versjonen av den routede linja gikk 180 meter tvers over vatnet på 904 moh, og det er is, ikke mark. Det andre er sikten. Nevelhytta står åpen på toppen nettopp for de dagene, og det er ikke tilfeldig at den er der.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Oppland sør på varsom.no. Oppland sør er en B-region: den varsles bare når faregraden ventes å bli 4 eller 5, så de fleste vinterdager finnes det ingen vurdering å lese. Ta med sender/mottaker, søkestang og spade — på denne turen mest fordi vanen er verdt noe, ikke fordi linja krever det.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L18,197 L43,189 L63,183 L82,184 L101,181 L126,169 L143,161 L165,156 L188,153 L206,153 L229,151 L248,149 L274,144 L293,140 L312,133 L331,129 L351,126 L370,113 L383,97 L405,86 L421,87 L447,76 L466,72 L492,63 L517,49 L540,37 L556,28 L575,24 L600,18",
      startLabel: "828 moh",
      endLabel: "1090 moh",
      distanceLabel: "4,2 km",
      caption: "268 høydemeter og 4,07 km fra Nordseter rundt Nevelvatnet på 905 moh og over Nevelåsen på 992, med skogen som slipper taket på 966 moh.",
    },
  },
  slettind: {
    slug: "slettind",
    intro:
      "474 høydemeter og 2,50 km fra rv 52 ved Eldrevatn til varden på 1592 moh. Bratteste hundremetersbandet er det øverste — 17,7 grader fra 1500 til 1600 moh over 285 meter grunn — og bratteste sammenhengende steg er 22,5 grader mellom 1527 og 1546. Ruta ligger over skoggrensa hele veien.",
    ascent: [
      "Start på den opparbeidede plassen ved fylkesgrensa ved Eldrevatn, 1122 moh, rett ved rv 52 over Hemsedalsfjellet. Fri Flyt sier det så kort som det går an: «Parkér på parkeringsplassen like før Eldrevann og sett kursen mot sørøst. Herfra gir ruta seg selv til toppen av Slettind.»",
      "Den første kilometeren er flat — bandet fra 1100 til 1200 moh måler 4,1 grader over 1132 meter grunn — og så tar flanken til. Fra 1200 til 1300 moh måler den 13,7 grader over 405 meter grunn, fra 1300 til 1400 16,6 over 360, og linja passerer 1325 moh der stigningen er etablert. Ut.no beskriver det samme: «terrenget er jevnt og passe bratt mellom 20-25 grader».",
      "Videre opp fortsetter det med å bli litt brattere for hvert band: 16,1 grader fra 1400 til 1500 moh over 315 meter grunn, og 17,7 fra 1500 til 1600 over 285 — det bratteste på turen. Bratteste enkeltsteget er 22,5 grader mellom 1527 og 1546 moh. Toppen måler 1592,0 moh på terrengmodellen, som er nøyaktig det Fri Flyt publiserer; ut.no fører 1589.",
    ],
    descent: [
      "Ned nordvestflanken, samme veien. Fri Flyt: «Ta utgangspunkt i ruta opp og legg sporet i den brede fjellsida på vei ned.» Flanken måler 18,0 grader i snitt over 400 meter med et 27,2-graders vindu 110 til 170 meter ut, og den er bred nok til at du kan legge sporet der du vil i den.",
      "Faremomentet Fri Flyt fører opp peker til høyre: «Skredterreng nord for toppen, så ikke dra for langt til skikjørers høyre i starten av nedkjøringen.» Nord måler 13,8 grader i snitt med et 25,7-graders vindu 100 til 160 meter ut, og 11,0 grader i snitt når sveipet går ut til en kilometer — altså reelt skredterreng, akkurat som advarselen sier.",
      "Det bratteste på fjellet ligger likevel til den andre handa. Vest måler 23,9 grader i snitt ut til en kilometer, med et 52,5-graders vindu 660 til 720 meter ut, og sørvest 23,6 med 49,5 i vinduet 360 til 420. Begge faller mot Mørkedalen, langt fra linja ned mot bilen — men de er der, og de er det du kommer inn i om du holder for langt sør på det brede platået i dårlig sikt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "474 høydemeter der bratteste band er 18,6 grader og bratteste steg 20,6. Fri Flyt fører KAST 1 – enkelt med bratteste punkt under 30 grader, ut.no fører easy, og ut.no legger til: «Ingen spesiell skredfare hvis man følger de slake partiene, men det er noen helninger som er over 30 grader.» Linja gir tilbake 4 høydemeter på 2,48 km.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nord for toppen er det Fri Flyt advarer mot, og målingen gir dem rett: 25,7 grader i bratteste 60-metersvindu 100 til 160 meter ut. Vest og sørvest er brattere igjen — 52,5 og 49,5 grader i vinduer noen hundre meter ute — og faller mot Mørkedalen. Øst og nordøst er slake: 5,6 og 8,5 grader i snitt.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og blir varslet hver dag i sesongen. Sjekk også at rv 52 over Hemsedalsfjellet er åpen — det er en fjellovergang som kan stenge eller gå i kolonne i uvær, og på denne turen er det været som avlyser dagen, ikke terrenget. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L17,200 L34,200 L56,200 L77,199 L99,197 L121,194 L131,192 L153,188 L175,185 L185,184 L207,180 L229,177 L250,173 L272,168 L294,161 L315,154 L326,150 L337,146 L359,135 L369,129 L391,119 L402,115 L423,106 L434,101 L456,88 L463,84 L477,77 L488,72 L499,67 L521,57 L532,53 L553,43 L564,36 L574,30 L586,24 L597,19 L600,18",
      startLabel: "1122 moh",
      endLabel: "1592 moh",
      distanceLabel: "2,5 km",
      caption: "474 høydemeter og 2,48 km fra Eldrevatn opp nordvestflanken via 1325 moh, i åpent terreng fra første steg.",
    },
  },
  kyrkjebonosi: {
    slug: "kyrkjebonosi",
    intro:
      "998 høydemeter og 4,77 km fra grustaket ved Kyrkjebøen til det høyeste punktet på 1670 moh, med fortoppen på 1608 og et skar på 1589 imellom. Bratteste hundremetersbandet er 20,9 grader fra 1400 til 1500 moh, og bratteste steg 30,0 grader mellom 811 og 829. Nordøstsida er noe helt annet: 33,0 grader i snitt, med 48,0 i vinduet 0 til 60 meter ut.",
    ascent: [
      "Start i grustaket ovenfor gården Kyrkjebøen, 722 moh. Ut.no forklarer veien dit: i sentrum følger du veien til venstre for Skogstad Hotell, og etter 1,4 km står skiltet mot Kyrkjebønnøse på høyre side — videre bak låven og opp til grustaket. Fri Flyt kaller stedet sandtaket og oppgir parkering ved informasjonsskiltet.",
      "Fra grustaket går traktorveien og sommerstien nordover gjennom skogen. Løypa er merket og svinger bratt til venstre etter om lag en kilometer, opp Gravarbakkane, der linja passerer 1010 moh. Bandtabellen for denne delen er jevn og moderat: 9,7 grader fra 700 til 800 moh over 455 meter grunn, 14,6 fra 800 til 900 over 396, 13,8 fra 900 til 1000 over 414, og 14,0 fra 1000 til 1100 over 393.",
      "Skogen slipper taket på 1107 moh og terrenget er åpent fra 1121. Rett over skoggrensa ligger en liten topp på 1299 moh, og Fri Flyt er tydelig på hva du gjør med den: «gå på vestsiden av den lille toppen rett etter tregrensen. Derfra svinger du igjen østover og følger ryggen opp til toppen.» Linja går 1288 moh på vestsida av den. Det bratteste steget på turen ligger likevel lavt, 30,0 grader mellom 811 og 829 moh, i den første halvkilometeren.",
      "Videre opp ryggen stiger det jevnt til det bratteste bandet, 20,9 grader fra 1400 til 1500 moh over 272 meter grunn, og linja passerer 1465 moh i det. Fortoppen kommer på 1608 moh — den ut.no fører som «den første på 1610 moh». Fra den faller ryggen 20 meter ned i skaret på 1589, og så er det flatt: bandet fra 1500 til 1600 moh måler 4,4 grader over 1306 meter grunn og 1600 til 1700 måler 6,5 over 535. «Den siste delen av ryggen mot toppen er lang og flat», skriver Fri Flyt, og det er 400 meter nordover til varden på 1670,5 moh — 1671 etter begge kildene.",
    ],
    descent: [
      "Standardnedkjøringa går ikke tilbake samme veien fra toppen. Fri Flyt: «Den vanligste ruta går fra toppen på omlag 1600 moh og vestover ned den store hvite flanken. Skal du ned til bilen, tar du av sørover rett før tregrensen og kommer inn på den samme ruta som oppstigningen.» Vestflanken måler 11,3 grader i snitt over 400 meter og sørvest 12,3 — det er den store, åpne flanken, og det er derfor kortet fører V.",
      "Den alternative renna er en annen sak, og sveipet forklarer hvorfor. Øst fra toppen måler 28,9 grader i snitt med 46,0 i vinduet 10 til 70 meter ut, og nordøst 33,0 med 48,0 allerede fra kanten. Det er renna Fri Flyt gir «500 høydemeter med bratt og fin skikjøring» — og det er samme kant som skavlen står på. Kommer du for langt ned mot elva i Trøimsbotn, sier Fri Flyt at det er «bratt og ulendt terreng for å komme tilbake til stien som leder ned til sandtaket».",
      "Nederst går det gjennom skogen. Fri Flyt beskriver den delen presist: åpen bjørkeskog først, tettere etter hvert, og da er det stien ned til parkeringsplassen som er det beste alternativet.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "1002 høydemeter der bratteste band er 20,6 grader og bratteste steg 26,8. Linja gir tilbake 54 høydemeter, og 20 av dem er skaret mellom fortoppen på 1608 og toppryggen på 1589. Selve oppstigningsruta er ikke bratt; det som gjør turen til en treer er lengden opp fra bygda og at toppryggen er skavlet.",
      },
      {
        title: "Skavlen og renna",
        body: "Fri Flyt fører to faremomenter og de ligger på samme kant: «Toppskavl og skredfare på den alternative nedkjøringen.» Sveipet fra toppen måler nordøst til 33,0 grader i snitt med et 48,0-graders vindu 0 til 60 meter ut, og øst 28,9 med 46,0 i 10 til 70. Det vil si at kanten faller bratt av med en gang — det er der skavlen bygger seg, og det er der renna mot Trøimsbotn starter. Nord måler 27,5 med 34,2 lenger ute. Vest og sørvest, der standardnedkjøringa går, måler 11,3 og 12,3.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og blir varslet hver dag i sesongen. Ingen av kildene oppgir en sesong for denne turen; kortet fører feb–mai etter naboturene på samme fjellside. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,196 L49,189 L69,179 L91,172 L114,164 L142,150 L162,145 L187,137 L216,124 L244,114 L266,103 L284,95 L297,88 L308,82 L334,69 L352,58 L370,49 L391,40 L414,32 L442,35 L465,37 L493,33 L513,30 L544,34 L572,28 L600,18",
      startLabel: "722 moh",
      endLabel: "1670 moh",
      distanceLabel: "4,8 km",
      caption: "1002 høydemeter og 4,62 km fra grustaket ved Kyrkjebøen over Gravarbakkane på 1010 moh og fortoppen på 1608, med skogen som slipper taket på 1107 moh.",
    },
  },
  nibbi: {
    slug: "nibbi",
    intro:
      "803 høydemeter og 2,93 km fra Lykkjastølen til varden på 1740 moh — nesten alt av det på under tre kilometer. Bratteste hundremetersbandet er 21,4 grader fra 1200 til 1300 moh over 224 meter grunn, og bratteste sammenhengende steg 24,2 grader mellom 1249 og 1269. Østsida av toppen er en annen sak: 27,6 grader i snitt, med 32,5 i bratteste vinduet.",
    ascent: [
      "Start ved Lykkjastølen, 939 moh. Ut.no oppgir 941 for samme punktet, og bomavgiften dekker parkeringa — betaling i postkassa ved Ulsåkstølen Fjellstue. Fra bilen ser du fossen et stykke opp i lia, og både Fri Flyt og ut.no sier det samme om den: hold vestsida. Fossen selv er ikke kartlagt noe sted; bekken den kommer i er Nordrestølbekken, som er den eneste navngitte bekken linja går forbi, så navnet er en slutning fra bekken og ikke fra fossen. Veipunktet i korridoren ligger 60 meter vest for bekken, på 1075 moh.",
      "Opp langs fossen stiger det jevnt: bandet fra 900 til 1000 moh måler 12,9 grader over 311 meter grunn, 1000 til 1100 måler 13,6 over 405, og 1100 til 1200 måler 18,6 over 315. Det bratteste steget på hele linja ligger her, 24,2 grader mellom 1249 og 1269 moh. Skogen slipper taket på 1054 moh og terrenget er åpent fra 1066.",
      "Videre følger du dalen — «det faller seg naturlig å følge dalen oppover», skriver ut.no, og Fri Flyt kaller det den naturlige renneformasjonen du går i eller til høyre for. Bandet fra 1300 til 1400 moh måler 20,8 grader over 271 meter grunn — nest brattest på turen, etter bandet under, og linja passerer 1364 moh midt i det. Over det slakner det til 18,3 og 15,4 grader.",
      "De siste 300 metrene går ikke rett fram. Ut.no sin egen linje kommer opp vest for toppen, på 1708 moh, og snur østover langs toppryggen — «så får man toppen i front/til høyre av traséen». Bandet fra 1700 til 1800 moh måler 5,4 grader over 412 meter grunn, som er det flate toppartiet. Varden står på 1741 etter kildene og 1740,3 etter terrengmodellen, og kortet fører målinga.",
    ],
    descent: [
      "Fri Flyt er kort: «Den enkleste nedkjøringen følger den samme ruta ned som oppstigningen.» Det er sørflanken, og den måler 20,7 grader i snitt over 400 meter med et 25,8-graders vindu 190 til 250 meter ut — samme tall som bandtabellen gir oppstigninga.",
      "Ut.no sier at det finnes brattere og mer krevende nedkjøringer for de erfarne, og sveipet sier hvor de ligger. Øst måler 27,6 grader i snitt med 32,5 i vinduet 90 til 150 meter ut, og sørøst 22,8 med 30,0 lenger ute, 240 til 300. Vest og nordvest er det motsatte — 6,9 og 10,6 grader i snitt — og nord bare 4,5. Vil du ha den bratte linja, ligger den på østsida, og ut.no sitt vilkår står ved lag: «riktig utstyr og erfaring i fjellet, og at forholdene er bra».",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "803 høydemeter der bratteste hundremetersbandet er 20,4 grader og bratteste steg 23,7. Fri Flyt fører turen som KAST 1 – enkelt med bratteste punkt under 30 grader, og målinga er enig. Linja gir tilbake 2 høydemeter på 2,97 km, så det er en ren stigning fra bilen til varden.",
      },
      {
        title: "Terrengfellene nederst",
        body: "Det eneste faremomentet Fri Flyt fører opp er «terrengfeller i den nedre delen av oppstigningen», og det er ikke en vinkel — det er formen. Renna og bekkedalen du følger opp fra 1075 moh samler snø fra hele lia over, og har ingen vei ut til sidene. Bandet fra 1100 til 1200 moh måler 18,6 grader over 315 meter grunn: nok til at noe over deg kan løsne, og med et samletrau under.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og blir varslet hver dag i sesongen, så her finnes det en vurdering å lese. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,195 L45,191 L73,180 L83,177 L108,171 L123,168 L147,162 L174,153 L193,146 L220,134 L239,125 L261,116 L282,107 L294,102 L307,97 L322,91 L340,83 L366,73 L386,65 L405,58 L426,53 L442,46 L460,39 L488,32 L516,27 L533,26 L543,25 L562,24 L589,20 L600,18",
      startLabel: "939 moh",
      endLabel: "1740 moh",
      distanceLabel: "2,9 km",
      caption: "803 høydemeter og 2,97 km fra Lykkjastølen vest for fossen på 1075 moh og opp dalen til 1364, med skogen som slipper taket på 1054 moh.",
    },
  },
  raskarfjellet: {
    slug: "raskarfjellet",
    intro:
      "685 høydemeter og 3,26 km fra Sildegjerdet ved rv 52 til varden på 1610 moh — et av de mest populære toppturfjellene i Hemsedal, kjent bare som «1609». Bratteste hundremetersband er 20,1 grader mellom 1100 og 1200 moh og bratteste steg 29,0 mellom 1164 og 1181. Toppen selv er et platå, og faren her er å finne fram.",
    ascent: [
      "Start ved den brøytede parkeringslomma ved stølsområdet Sildegjerdet, 938 moh. Fri Flyt: «Følg RV52 vestover fra Hemsedal sentrum i 19,5 km og parker i brøytet parkeringslomme på venstre side, 1,5 km etter brua på RV52.» Parkeringa er kartlagt og avgiftsfri. Rv 52 over Hemsedalsfjellet er vinteråpen, men kan gå i kolonne eller stenge i uvær.",
      "De første 885 metrene er flate — 4,1 grader — og linja krysser elva 224 meter inne, der terrengmodellen svarer terrengklasse Elv på 926,1 moh. Så begynner selve oppstigninga gjennom glissen bjørkeskog og inn i den vide dalen til Rupebekken, med korridorpunktet på 1051 moh. Kartverket fører siste skog på 1115 moh og åpent terreng fra 1133. Her ligger det bratte på turen: 18,9 grader fra 1000 til 1100 moh og 20,1 fra 1100 til 1200, som er bratteste bandet, med bratteste steget på 29,0 grader mellom 1164 og 1181 moh.",
      "Over det flater det av til 14,5 grader fra 1200 til 1300 og reiser seg en gang til, 19,3 fra 1300 til 1400. Flata Fri Flyt lover kommer på 1397 moh — hundre meter høyere enn de skriver — og de siste 212 høydemeterne stiger 14,3 og så 7,8 grader over 698 meter grunn til varden.",
    ],
    descent: [
      "Ned samme veien, nordøstover. Nordøst måler 10,5 grader i snitt ut til en kilometer og øst 14,5, så det er slakt hele veien tilbake. Fri Flyt oppgir at «du kan enten gå ned samme vei eller i rennene du så på vei opp», og rennene er skredterreng.",
      "Toppen er et platå, og det er den viktigste opplysninga om fjellet. Sørvest måler −0,2 grader i snitt ut til en kilometer fordi bakken stiger videre, sørøst 0,6 og sør 3,8. Fra varden ser fire retninger like flate ut, og tre av dem fører ingen steder du vil.",
      "Det bratte ligger langt fra ruta. Nordflanken har et 60-metersvindu på 41,1 grader, men det er 940 til 1000 meter ut — nede der fjellet endelig faller mot dalen. Nærmere varden er det bratteste du finner 26,1 grader mot øst 60 til 120 meter ut og 27,0 mot sør 30 til 90 meter ut.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt fører turen som KAST 1 – Enkelt med bratteste punkt under 30 grader, og skriver likevel at «du beveger deg i skredterreng til du kommer opp på 1300 meter». Begge deler er sanne: bratteste bandet på linja er 20,1 grader og bratteste steg 29,0, men det er lia rundt som er brattere enn linja. Kortet fører turen som grad 2 av den grunnen.",
      },
      {
        title: "Sikt",
        body: "Fri Flyts andre advarsel handler ikke om snø: «Dersom det er dårlig sikt, er det lite terrengformasjoner å orientere etter. Du trenger god sikt. Mye skredterreng rundt deg.» Flankesveipet sier det samme med tall — sørøst 0,6 grader i snitt, sørvest −0,2, nordvest 2,6 — et platå uten holdepunkt for øyet. Bekkedalen du kom opp er den eneste formen i terrenget som fører tilbake til bilen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no, en A-region med varsel hver dag i sesongen. Verken Fri Flyt eller artikkelen deres oppgir sesong for dette fjellet; kortets feb–mai er det samme vinduet de tre andre Hemsedal-turene i appen bærer, og det er en slutning. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L25,199 L41,200 L66,197 L91,193 L116,190 L132,187 L157,182 L172,176 L190,168 L199,162 L215,154 L240,141 L251,134 L266,128 L281,120 L298,112 L323,103 L339,99 L353,93 L364,88 L381,78 L402,69 L415,66 L431,61 L447,54 L463,46 L480,41 L497,40 L513,36 L538,33 L555,31 L579,22 L596,19 L600,18",
      startLabel: "938 moh",
      endLabel: "1610 moh",
      distanceLabel: "3,3 km",
      caption: "685 høydemeter og 3,26 km fra Sildegjerdet på 938 moh, inn bekkedalen på 1051 og over flata på 1397 til varden.",
    },
  },
  skogshorn: {
    slug: "skogshorn",
    intro:
      "836 høydemeter på 3,93 km fra Trefta, jevnt og bredt hele veien: bratteste sammenhengende parti på linja måler 23,2 grader. En god første toppturhelg i Hemsedal — så lenge du ikke forveksler normalruta med Skogshornrenna.",
    ascent: [
      "Start på den store parkeringa ved Hyndra bru nedenfor Trefta på Lykkjavegen, 893 moh. Plassen er avgiftsbelagt og betales med SMS eller Vipps etter skiltingen på stedet. De første sju hundre metrene deler grunn med preparerte langrennsspor; ruta forlater løypetraseen så snart den begynner å stige. Kryss elva og gå opp lia på vestsida.",
      "Videre nordvestover over det åpne beltet på 1000 til 1100 moh. Bjørka holder til rundt 996 moh, og over 1003 er alt åpent. Både den kartlagte skitur-traseen og den merkede sommerstien går her, 200 til 400 meter nord for selve ryggkammen, på den brede nordøstskuldra — det er den linja som er tegnet, og den er slakere enn kammen.",
      "Ved om lag 1320 moh kommer du inn på foten av østryggen, og den følges hele veien til topps. Stigningen er jevn: bandet fra 1300 til 1600 moh ligger på 19 til 20 grader i snitt, og bratteste hundremeteren, 1500 til 1600 moh, måler 19,7 grader. Toppryggen selv er slak, og de siste 130 høydemetrene til 1729 moh går i 11 grader.",
      "Toppryggen er ofte avblåst og hard. Det er ikke et skredproblem i seg selv, men det avgjør om de siste hundre metrene er behagelige eller ikke.",
    ],
    descent: [
      "Ned samme veien, østover ned ryggen og lia til Trefta. Fallretningen på nedkjøringa er øst — den fallvektede gjennomsnittsretningen måler 84 grader. Det er den brede nordøstvendte fjellsida under østryggen som er nedkjøringa, og den er også den sida som samler flakskavl etter vestlig vind. Det er den ene vurderingen turen faktisk krever.",
      "Vanligste feil: å ta Skogshornrenna fordi den ser ut som en snarere linje ned. Renna har innsteg på flata på vesttoppen og faller sørover: målt derfra holder sørsida 39,5 grader i snitt med 56 grader på det bratteste, mens nordsida er 9,4. Den er en egen ekspertlinje og skredutsatt — den er ikke normalruta, og den ender ikke der bilen står. Fri Flyt nevner også en renne rett nord fra toppen ned til flata på 1100 moh med retur sørover til parkeringa; det er en variant for dem som vet hva de velger.",
      "Nede igjen kommer du inn på langrennssporet de siste sju hundre metrene. Gå ved siden av det preparerte sporet, ikke i det.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jevn, bred stigning uten tekniske parti eller trange passasjer: bratteste sammenhengende parti på linja måler 23,2 grader, og bratteste hundremeteren, 1500 til 1600 moh, 19,7 grader i snitt. Den brede nordøstvendte fjellsida under østryggen samler flakskavl etter vestlig vind, og det er nettopp der du kjører ned — så vindhistorien de siste dagene betyr mer enn hellinga på denne turen.",
      },
      {
        title: "Terrenget rundt",
        body: "Skogshornrenna har innsteg på flata på vesttoppen og faller sørover — 39,5 grader i snitt, 56 på det bratteste. Den må ikke forveksles med normalruta, og heller ikke med Fri Flyts nordvariant, som går ned den slake nordsida. Toppryggen er ofte avblåst og hard. Ellers er fjellet bredt og oversiktlig — dette er en tur der feilen du gjør er å velge feil linje ned, ikke å bli overrasket på vei opp.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,197 L41,194 L61,192 L82,188 L102,185 L123,181 L151,176 L178,170 L199,164 L219,160 L246,153 L267,148 L288,143 L309,137 L326,131 L350,121 L370,112 L391,102 L412,94 L429,85 L446,77 L460,70 L480,59 L501,48 L508,45 L535,33 L554,30 L577,24 L600,18",
      startLabel: "893 moh",
      endLabel: "1729 moh",
      distanceLabel: "3,9 km",
      caption: "836 høydemeter og 3,77 km fra Trefta, med bratteste hundremeteren på 19,7 grader mellom 1500 og 1600 moh.",
    },
  },
  finnbufjellet: {
    slug: "finnbufjellet",
    intro:
      "620 høydemeter og 4,37 km fra leirplassen på toppen av Halsabakkane — fjellet Fri Flyt-indeksen kaller stedet der skisesongen på Voss blir åpnet og avsluttet. Hele linja går i åpent terreng over skoggrensa, og tallene er snille: bratteste hundremetersbeltet måler 13,2 grader mellom 900 og 1000 moh, og det bratteste sammenhengende partiet 23,3 grader. Navnene trenger en setning: Fri Flyt kaller fjellet Finnbufjellet og oppgir 1358 moh, men toppen selv heter Finnbunuten i registeret, og terrengmodellen leser 1357 — samme mønsteret som Kirketaket, der guidebok og register bærer hvert sitt navn.",
    ascent: [
      "Starten er flata der rv13 topper hårnålssvingene i Halsabakkane og møter Sendo-elva — leirplassen ved Sendo, 766–779 moh på åpen mark. Kildene ser ut til å motsi hverandre her, og terrenget avgjør: Fri Flyts faktaboks sier «Høydemeter: 770», Utemagasinet-versjonen av samme beskrivelsen sier 588 høydemeter fra samme parkeringa — og veien passerer 770 moh nøyaktig der bakkene flater ut. 770 er starthøyden, ikke stigningen; den routede linja samler 620 høydemeter.",
      "Kryss brua over Sendo-elva og hold sørover. Elva du krysser renner østover langs flata og stuper så gjennom fossen ned i Kvassdalen, dalen rv13 kommer opp fra — dalbunnen der nede leser 574 moh. Vest for deg skjærer Finnbu-bekkene juv ned mot elva, med Finnbuene-stølen på vestbredden. Ryggen mellom juvet og Kvassdalen er ruta: det er den Fri Flyt peker på som det sikreste alternativet, og den er den eneste ryggen øst for juvet.",
      "Ryggen er jevn og åpen: 793 moh ved foten, 871 midtveis, 992 der den brer seg ut. Det bratteste hundremetersbeltet på turen ligger her — 13,2 grader i snitt mellom 900 og 1000 moh — og det er fremdeles slakt nok til å gå rett opp i de fleste føre.",
      "På skuldra ved 1090 moh kommer alternativtilkomsten fra Myrkdalen skisenter opp — «etter en times gange», sier Fri Flyt, og møtepunktet er der ryggen flater ut. Videre går linja vestover på den brede flanken: 1146, 1221 og 1302 moh på ryggen mot toppen, med bratteste sammenhengende parti på 23,3 grader underveis.",
      "Varden står på 1357 moh. Terrengmodellen og registeret er enige om at dette er Finnbunuten — det høyeste punktet i massivet, mot publiserte 1358 — og at registeret sitt eget Finnbufjellet-punkt lenger nord leser 1331 og ikke er toppen. Nordover ligger ryggen nesten flat — 2,7 grader i snitt den første kilometeren — og vest- og nordvestsida stuper: hold deg på østsida av varden når det blåser.",
    ],
    descent: [
      "Sikreste nedfarten er samme vei som opp, sier kilden, og målinga er enig: østflanken du kom opp holder 6,9 grader i snitt fra varden mot nordøst, med 23,7 grader som bratteste 60 m-vindu 650–710 m ut, målt 800 meter fra varden. Fin cruising hele ryggen ned til skuldra, og ryggen videre ned mot Sendo.",
      "Fri Flyt nevner «en rekke nedkjøringsalternativer» uten å beskrive dem, og målingene sier hvorfor linjevalget må være våkent utenfor ruta: vestsida faller 50,3 grader på det bratteste 440–500 m fra varden, og nordvestsida 56,7 grader 420–480 m ut — ned i Finnbugjuvet og juvene vest for ryggen. Sørøstsida måler 28,1 grader 690–750 m ut og østsida 28,4 grader 660–720 m ut, så også de slakere sektorene har heng i seg lenger ute.",
      "Fra skuldra igjen er det ryggen ned til brua og de siste metrene over elva til leirplassen — 34 høydemeter å gi tilbake har turen samlet, så nedfarten er ren.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt setter KAST 1 – Enkelt, og det gjelder ryggen, ikke flankene ved siden av: selve linja har 23,3 grader som bratteste sammenhengende parti og 13,2 grader som bratteste hundremetersbelte, mellom 900 og 1000 moh. Den går i åpent, vindutsatt terreng fra første meter — her finnes ingen skog å gå i le av.",
      },
      {
        title: "Nordeggen og juvet",
        body: "«Nordeggen har et par utsatte områder hvor ferdigheter og skredfare må vurderes», skriver Fri Flyt — nordeggen er ikke denne ruta, og det må sies, for den ligger rett ved: fra varden mot nord er snittet bare 2,7 grader de første 800 metrene, og det er nettopp det flate som gjør at du havner der uten å velge det. Vest for ryggen samler Finnbujuvet fokksnø — det er derfor fjellet åpner og avslutter sesongen — og vest- og nordvestsida under toppen faller 50,3 og 56,7 grader på det bratteste. I flatt lys er kanten mot juvet den ene tingen å holde styr på.",
      },
      {
        title: "Veien",
        body: "Tilkomsten er sin egen faktor: rv13 over Vikafjellet er et værutsatt høyfjellssamband, og leirplassen ligger på brøytekanten av det. Fri Flyt kaller tilkomsten lett — og det er den når veien er åpen. Sjekk veimeldingene samme dag, og regn med at det som stenger veien også er været som laster Finnbujuvet.",
      },
      {
        title: "Før du går",
        body: "Finnbufjellet ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder for denne turen; kortets jan–apr er lånt fra de andre Voss-turene i appen, og Fri Flyt-indeksen sier at fjellet åpner og avslutter sesongen på Voss — den strekker seg altså i begge ender når snøen ligger. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L19,198 L44,192 L62,185 L92,172 L105,162 L124,147 L145,135 L164,128 L186,126 L204,122 L223,111 L247,101 L266,98 L289,100 L308,100 L328,96 L347,89 L359,80 L375,68 L396,65 L415,64 L439,62 L458,61 L483,59 L507,52 L526,38 L545,36 L576,30 L600,18",
      startLabel: "772 moh",
      endLabel: "1357 moh",
      distanceLabel: "4,4 km",
      caption: "620 høydemeter og 4,37 km fra leirplassen ved Sendo — åpen rygg hele veien, med 23,3 grader som bratteste sammenhengende parti.",
    },
  },
  storehorn: {
    slug: "storehorn",
    intro:
      "Kort vei fra bilen til en topp som ser ut over hele Hemsedal. Turen starter allerede over skoggrensa, og terrenget er åpent fra første steg — en fin førstetur på ski i dalen, og en rask formiddagstopp for den som kjenner den.",
    ascent: [
      "Veien inn til Hornslie er bomveg med kortbetaling: fra Hemsedal sentrum følger du rv52 østover mot Gol og tar av mot Torsetstølane, og over skoggrensa tar du til høyre og følger veien til den stopper på parkeringa. Fra Hornslie, der Leinestølvegen ender på 1056 moh, går du rett opp den første bakken. Den er kortere enn den ser ut — den første hundremeteren, 1000–1100 moh, ligger på 18,8° i snitt — og over kanten flater det ut. Her er ingen skog å forholde seg til: hele turen går i åpent terreng.",
      "Over kanten åpner Hødnetjedne-bassenget seg — Horntjerne på Kartverkets kart — og du gir tilbake 45 høydemeter ned mot vannet på 1191 moh. Om vinteren går linja rett over det frosne vannet; sommerstien holder venstre side. På andre sida deler ruta seg i to merkede linjer: én lengre og slakere ut på nordvestskulderen, én kortere og brattere opp østryggen. Denne beskrivelsen følger østryggen.",
      "Fra østryggen er det jevn stigning vestover til toppen, med Veslehødn — Veslehorn på kartet — og hele Hemsedalen i ryggen. Toppflata er liten, og sørkanten ligger nærmere varden enn den ser ut: åtti meter sør for toppunktet faller terrenget 96 høydemeter på tjue meter grunn. Sørøstkanten gjør det samme, 63° over de bratteste seksti meterne, og sørvestkanten 57°. Hold ryggen inn til varden, og hold deg nord for kanten når du står der.",
    ],
    descent: [
      "Samme vei ned. Østryggen gir jevn, oversiktlig kjøring ned mot Hødnetjedne, og bassenget under er det slakeste terrenget på turen — regn med å stake.",
      "Vanligste feil: å la terrenget dra deg nordøstover mot Veslehødn i stedet for å svinge ned mot Hornslie. Øst for Veslehødn stuper Hydnefossen 155 meter fritt — høydemodellen tar 151 av dem i ett eneste tjuemeterssteg — og under fossen holder terrenget 50° videre ned. Fra vannet går hjemveien sørøstover, og husk de 45 høydemeterne opp av bassenget før den siste bakken ned til bilen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Selve linja er slak. Det bratteste hundremeterspennet er 1400–1500 moh, den siste stigninga mot varden, på 19,0° i snitt; den første bakken opp fra Hornslie ligger på 18,8°. Det bratteste enkeltpartiet ligger mellom 1370 og 1385 moh og måler 25,6° — ingen del av linja passerer 30°.",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppflata er liten, og bergband rammer den inn mot sør, sørøst og sørvest: 96 høydemeter på tjue meter grunn rett sør for varden, 63° over de bratteste seksti meterne mot sørøst og 57° mot sørvest, med enkelttrinn opp mot 79°. Vestsiden er nesten flat i 260 meter og faller så av i et belte som holder 47° i snitt ned til 1320 moh, 60–70° på det bratteste. Nordvestskulderen er den slake sida, 13° i snitt. Øst for Veslehødn faller fjellsiden 71–76° over de øverste 235 høydemetrene, og Hydnefossen stuper 155 meter fritt ned den. Alt dette ligger utenfor ruta, og der skal det bli.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L19,185 L44,170 L63,155 L80,149 L107,137 L125,132 L152,124 L179,125 L204,127 L224,129 L233,129 L251,131 L269,132 L287,135 L314,141 L332,142 L349,142 L368,142 L385,142 L403,142 L421,137 L439,125 L449,121 L465,110 L475,101 L487,92 L502,85 L520,78 L535,66 L547,56 L560,47 L574,35 L588,25 L600,18",
      startLabel: "1056 moh",
      endLabel: "1482 moh",
      distanceLabel: "3,0 km",
      caption: "471 høydemeter og 2,99 km fra Hornslie til toppen, med 45 meter gitt tilbake i Hødnetjedne-bassenget.",
    },
  },
  storanosi: {
    slug: "storanosi",
    intro:
      "742 høydemeter på 4,67 km fra Ljosno: åpen bjørkeskog nederst, og et vidt platå over Eggjane der bandet fra 1100 til 1200 moh måler 3,4 grader over 1784 meter grunn. Bratteste hundremeteren ligger mellom 1000 og 1100 moh og måler 18,4 grader.",
    ascent: [
      "Start ved veienden på Ljosnavegen i Brandsetdalen, 510 moh, øst for Voss. De første 726 meterne grunn er tilnærmet flate — bandet fra 500 til 600 moh måler 7,1 grader i snitt.",
      "Følg bjørkeskogen oppover mot nordsida av Middagshovden. Skogen holder til 857 moh, og over det er alt åpent. Kartverket fører terrenget mellom 877 og 957 moh som skytefelt; sjekk skiltinga lokalt før du legger turen dit.",
      "Før toppen av hovden tar du av mot Eggjane. Bratteste hundremeteren på turen ligger her, 1000 til 1100 moh med 18,4 grader i snitt, og bratteste sammenhengende parti måler 24,5 grader mellom 1079 og 1093 moh.",
      "Fra Eggjane på 1179 moh er det halvannen kilometer platå vestover til Storanosi, 1205 moh. Bandet fra 1100 til 1200 moh måler 3,4 grader over 1784 meter grunn — det er den delen av turen som gjør den lang heller enn bratt, og linja gir til sammen 40 høydemeter tilbake underveis.",
    ],
    descent: [
      "Ned samme veien, nordøstover over platået og ned gjennom bjørkeskogen til Ljosno. Fjellet er kjent for tørrsnø når østavinden har stått på i flere dager, og det er platået og den åpne skogen som holder på den snøen.",
      "Vanligste feil: å ta den østlige renna fra toppen fordi den ser ut som en kortere vei ned. Renna er 30 grader bratt og er en egen vurdering — den er ikke normalruta, og den ender ikke der bilen står.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak hele veien: bratteste hundremeteren, 1000 til 1100 moh, måler 18,4 grader, og bratteste sammenhengende parti 24,5 grader mellom 1079 og 1093 moh. Platået fra 1100 til 1200 moh ligger på 3,4 grader — det er orienteringa i dårlig sikt, ikke hellinga, som er utfordringa der oppe.",
      },
      {
        title: "Terrenget rundt",
        body: "Den østlige renna fra Storanosi er 30 grader bratt og skredutsatt; vurder den for seg om du vil kjøre der. Kartverket fører også terrenget mellom 877 og 957 moh på oppstigninga som skytefelt.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,194 L47,188 L70,183 L99,174 L116,169 L134,163 L163,150 L184,137 L209,123 L238,110 L261,97 L286,84 L313,78 L336,70 L353,59 L371,45 L394,32 L417,26 L440,26 L463,30 L492,29 L515,23 L533,21 L556,22 L579,20 L600,18",
      startLabel: "510 moh",
      endLabel: "1205 moh",
      distanceLabel: "4,7 km",
      caption: "735 høydemeter og 4,43 km fra Ljosno i Brandsetdalen, med skoggrensa på 857 moh og halvannen kilometer slakt platå fra Eggjane til varden.",
    },
  },
  lonahorgi: {
    slug: "lonahorgi",
    intro:
      "1298 høydemeter fra 139 moh — en av de lengste sammenhengende stigningene på Voss, og teknisk sett en av de enkleste. Bratteste sammenhengende parti på linja måler 28,9 grader, og nordryggen de siste 107 høydemeterne er nesten flat.",
    ascent: [
      "Fra E16 ved Grotlandsbrua, om lag en kilometer nord for enden av Lønavatnet, tar du av mot vest og kjører Høylandsvegen opp til den nedlagte gården Høyland, 139 moh. Der tar skogsbilveien over. Merk at brøyting helt fram ikke er dokumentert — det er en grusvei til en nedlagt gård, ikke en vinterveg.",
      "Følg skogsbilveien sørvestover til Bergsstølen på 380 moh og videre opp det trange dalføret ved Breiming, 610 moh. Skogen holder til rundt 563 moh og terrenget er åpent fra 583. Det trange partiet ved Breiming er skredterreng — det er det ene stedet på turen der du står i et søkk med sider over deg.",
      "Videre følger du slakeste vei nordvestover mot Svartahorgi, til venstre for det trigonometriske punktet 834, og runder selve Svartahorgi (1037 moh; SSR-punktet ligger 41 meter fra toppen og leser 1029) før du kommer inn på ryggen på om lag 1011 moh. Bratteste hundremeteren på turen ligger mellom 800 og 900 moh og måler 18,6 grader i snitt. På ryggen nordvest for Svartahorgi er linja opptil 1549 meter fra nærmeste kartlagte sti, på 1037 moh — der er det ingen sti å navigere etter.",
      "Ryggen blir fulgt vestover og deretter sørover over punkt 1305 — som ligger på nøyaktig 1305 moh — og opp nordryggen til toppen på 1412 moh. De siste 107 høydemeterne tar 1,1 kilometer grunn, og linja faller 17 meter fra punkt 1305 før den stiger igjen: bred, slak rygg, og ofte avblåst og hard fordi den er vindutsatt. De fleste som går Lønahorgi starter fra toppen av Horgaletten-heisen på om lag 920 moh og har da 490 høydemeter igjen; denne ruta er den lange varianten fra bilveien, og det er også den Fri Flyt kaller den fineste nedturen.",
    ],
    descent: [
      "Ned samme linja: nordryggen til punkt 1305, østover over Svartahorgi og ned til Breiming og Bergsstølen, og til slutt skogsbilveien ned til Høyland. Fallretninga på nedkjøringa er nordøst. Nederste delen er tynn: snødekket ved Høyland og Bergsstølen er kortvarig, og utpå våren er det verdt å gå av tidlig heller enn å skrape de siste hundre høydemeterne.",
      "Vanligste feil: å tro at Bodegaen er nedkjøringa på denne turen. Den kjente frikjøringssida ligger sørøst på fjellet og mater tilbake i heissystemet i Bavallen — den ender ikke ved bilen din på Høyland. Den dokumenterte varianten fra denne ruta er å ta seg ned i Årdalen fra punkt 1307 ved stabile forhold, og Årdalen er østsida, den bratte delen av fjellet.",
      "Den andre feilen er å bruke det trange dalføret ved Breiming som nedkjøringslinje uten å tenke på hva som ligger over. Store svaskred løsner sent på våren her og går langt.",
      "Appens rute er den kilden kaller den andre. Faktaboksen fører to startsteder — «Voss Fjellheiser, øverst i Horgaletten, eller den nedlagte gården Høyland sør for Tvinne» — med hver sin tid, «2 timer fra Horgaletten, 4 timer fra Høyland», og OPP-teksten er tydelig på hva folk faktisk gjør: «De aller fleste besøkende velger å benytte seg av heissystemet. Øverst i Horgaletten-heisen, ved rundt 920 meters høyde, er det bare å feste feller under skiene. Deretter labbe i vei langs de tydelige stakene som leder langs Vådalseggi til topps.» Den ruta ligger nå på kortet. Startstedet er toppstasjonen på Horgaletten-trekket, 948 moh — ikke en parkeringsplass, men et startsted du kommer til med heis, slik Reinheim, Bjørnhollia og Trollheimshytta er startsteder du kommer til på ski. Derfra 506 høydemeter på 3,66 km: opp fra heisen på 979, over Vådalseggi på 1051, inn på den merkede ruta på 1088 og videre langs stakene på 1164, 1284, 1344 og 1378 til varden. Mot normalrutas 1298 høydemeter på 6,45 km er det under halve turen, og det bratteste 30-metersvinduet er 24,4 grader mellom 1025 og 1041 mot 28,9. Ruta gir tilbake 42 høydemeter der ryggen dukker.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja er teknisk enkel: bratteste sammenhengende parti måler 28,9 grader og bratteste hundremeteren, 800 til 900 moh, 18,6 grader i snitt. Det trange dalføret ved Breiming er det ene stedet ruta går inn i skredterreng, og det er også der den er smalest. Ryggen fra punkt 1307 og opp er bred og slak mot vest — under én grad de første fire hundre meterne — men den er samtidig vestkanten av Årdalsida: øst for linja måler flanken 33 grader i snitt over fire hundre meter, med 48 til 52 på det bratteste. Ryggen er vindutsatt og ofte avblåst, og da ligger snøen den har mistet på nettopp den lesida.",
      },
      {
        title: "Terrenget rundt",
        body: "Østsida ned mot Årdalen er den bratte delen av fjellet, og ruta følger kanten av den på den siste kilometeren, og store svaskred løsner der sent på våren og går langt. Årdalen ligger nordøst for toppen på om lag 930 moh og er en dokumentert nedkjøring for dem som velger den med åpne øyne — ikke en snarvei hjem. Snødekket nede ved Høyland og Bergsstølen er tynt og kortvarig.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,189 L49,183 L75,176 L96,170 L121,162 L139,156 L160,150 L179,143 L200,131 L225,128 L251,119 L267,111 L288,102 L308,92 L337,78 L356,75 L381,71 L404,69 L424,59 L444,52 L470,41 L498,33 L520,35 L544,33 L569,27 L592,21 L600,18",
      startLabel: "139 moh",
      endLabel: "1412 moh",
      distanceLabel: "6,5 km",
      caption: "1298 høydemeter og 6,45 km fra Høyland, med de siste 107 høydemeterne fordelt på 1,1 km slak nordrygg.",
    },
  },
  vatnaknausen: {
    slug: "vatnaknausen",
    intro:
      "980 høydemeter og 7,48 km fra Tverrberg, og nesten halve veien på vei: bomveien fra Selheim ender på parkeringa på 383 moh, og veikjeden videre inn Budalen bærer deg om Øvraset til Nyestølen på 707 før fjellet tar over. Tallene på selve linja er snille — bratteste hundremetersbeltet 13,9 grader mellom 700 og 800 moh, bratteste sammenhengende parti 21,9 — men Fri Flyt setter KAST 2 – Utfordrende, og det handler om linjevalget i det småkuperte terrenget over skoggrensa, ikke om noe enkelt brattheng. Fra varden: panoramautsikten over Voss turen blir solgt på.",
    ascent: [
      "Følg veien til Selheim gård, betal bomavgiften og krabb bratt opp til Tverrberg «eller til egnet stoppested nær snøkanten», slik kilden sier — den kartlagte parkeringa leser 383 moh, men snøkanten avgjør hvor turen faktisk begynner, og en lavere start legger høydemeter på. Til fots videre: Tverrbergsvegen fortsetter sørover til veidelet på 475 moh, der Øvraset-vegen tar av østover.",
      "Øvraset-vegen bærer deg inn Budalen: 533 moh underveis, Øvraset på 639, og dalbunnen på 670 — myr og glissen skog der dalen åpner seg. Veien slutter og stølsterrenget tar over opp til Nyestølen på 707 moh. Registeret har 27 Nyestølen-er; denne er den i Budalen.",
      "Fra Nyestølen tar du rett nord etter skoggrensa, slik kilden sier — skogen slutter på 822 moh etter Kartverkets klasser. Det bratteste på hele turen ligger under den grensa, ikke over: hundremetersbeltet mellom 700 og 800 moh måler 13,9 grader i snitt, og det bratteste sammenhengende partiet — 21,9 grader — ligger mellom 738 og 756 moh, i skogen rett over stølen. Over skoggrensa slakker det til 11,2 grader opp mot eggen, og da er det linjevalget i det småkuperte, ikke bratthenget, som krever vettet.",
      "Opp på eggen vest for Rjupetjørnane, slik kilden råder til: linja går opp på 978 moh, følger eggen over 1031, og passerer tjernene — de ligger på 1089 — på nordsida i åpent terreng på 1103 moh. Derfra østover: platået bærer deg over 1215 mot toppen.",
      "Varden står på 1302 moh, mot publiserte 1303. Registeret har to Vatnaknausen-punkt — Topp og Berg, det siste på 1199 — og toppsøket klatret fra Topp-punktet de siste metrene. Utsikten over Voss er grunnen til at turen fins.",
    ],
    descent: [
      "Samme vei ned, sier kilden, og den selger solnedgangen — turen er vestvendt, og ettermiddagssola mykner snøen hele veien hjem. Vær klar over hva det betyr: det som er mykt klokka fire, gjenfryser når sola går ned, og vestvendte heng endrer seg raskest akkurat da.",
      "Nedkjøringa begynner vestover av platået, for rett ved varden stuper det i de andre retningene: østsida faller 40,6 grader bare 50–110 m ut, sørøstsida 46,7 grader 40–100 m ut, og nordøstsida 43,8 grader 340–400 m ut. Knausen i navnet er reell — hold vest til du er nede på eggen igjen.",
      "Fra eggen samme vei tilbake: ned flanken til Nyestølen, og veikjeden ut Budalen til Tverrberg. 60 høydemeter å gi tilbake har turen samlet, det meste i småkuperingen på platået og veiens egne slakker.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt setter KAST 2 – Utfordrende med den begrunnelsen kilden selv gir: «En del brattere småkupert terreng», der innsatsen ligger i å legge sporet under 30 grader. Målingen av den valgte linja sier hvor det bratteste faktisk ligger: hundremetersbeltet 13,9 grader mellom 700 og 800 moh og det bratteste sammenhengende partiet 21,9 grader mellom 738 og 756 — begge under skoggrensa på 822, mellom Nyestølen og skogkanten. Flanken opp mot eggen måler 11,2 grader. Det er linjevalget, ikke linja, som er utfordringen — går du utenom, finner du fort 30-gradersheng i det småkuperte.",
      },
      {
        title: "Toppknausen",
        body: "Fra varden faller det brått i tre retninger: 40,6 grader mot øst bare 50–110 m ut, 46,7 mot sørøst 40–100 m ut, og 43,8 mot nordøst 340–400 m ut. I god sikt er det åpenbart; i skodde er den flate østsektoren — snittet mot øst er −0,3 grader de første 800 metrene fordi platået fortsetter — en felle som leder deg ut på kanten. Kompasskurs vestover fra varden, alltid.",
      },
      {
        title: "Vestvendt",
        body: "Hele fjellsida turen går i vender mot vest og sørvest. Det gir solmyk snø om ettermiddagen og solnedgangen kilden selger turen på — og det gir også daglig gjennomvæting og gjenfrysing utover våren. Vurder tidspunktet som en del av linjevalget: flanken under skoggrensa er brattest, og platået over får sola sist.",
      },
      {
        title: "Før du går",
        body: "Vatnaknausen ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder for denne turen; kortets jan–apr er lånt fra de andre Voss-turene i appen, og guiden sier det. Bomveien til Tverrberg har avgift. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,195 L44,190 L63,192 L82,185 L102,180 L127,179 L152,183 L174,179 L199,174 L225,167 L250,158 L272,151 L293,149 L315,144 L344,140 L368,131 L387,116 L415,105 L441,88 L467,79 L488,71 L506,66 L528,53 L553,41 L579,28 L600,18",
      startLabel: "383 moh",
      endLabel: "1302 moh",
      distanceLabel: "7,5 km",
      caption: "980 høydemeter og 7,48 km fra Tverrberg — vei inn Budalen til Nyestølen, eggen vest for Rjupetjørnane, og 21,9 grader som bratteste sammenhengende parti.",
    },
  },
  horndalsnuten: {
    slug: "horndalsnuten",
    intro:
      "1124 høydemeter på 6,02 km fra Skiple i Raundalen, med halvannen kilometer flat innmarsj før terrenget tar til å stige. Bratteste sammenhengende parti måler 31,4 grader og ligger mellom 1093 og 1116 moh — nordvendt, og siste kneika til toppen er bratteste delen av ruta.",
    ascent: [
      "Start ved den kartfestede parkeringa ved brua over Raundalselvi ved Skiple, 398 moh, omtrent tjue kilometer øst for Voss. De første 1490 metrene grunn er tilnærmet flate — bandet fra 300 til 400 moh måler 0,8 grader — og ruta krysser elva tidlig.",
      "Følg traktorveien forbi Horndalsbruni og inn i Horndalsbotnen på 757 moh. Skogen holder til 781 moh, og i den øvre lia mot Bjørnsetstølen er det skredbaner; hold deg i skogen der nede.",
      "Fra botnen stiger ruta mot skuldra. Bandet fra 900 til 1000 moh måler 16,9 grader og 1000 til 1100 moh 21,4, som er bratteste hundremeteren. Bratteste sammenhengende parti på hele turen ligger her, 31,4 grader over tretti meter mellom 1093 og 1116 moh.",
      "Over skuldra på 1153 moh flater det ut en stund, 13,3 grader fra 1100 til 1200 moh, før den siste kneika: 20,6 grader fra 1200 til 1300 moh, og deretter jevnere terreng til varden på 1462.",
    ],
    descent: [
      "Ned samme veien, nordover gjennom Horndalsbotnen og ut den flate innmarsjen til Skiple. Fallretninga er nord, og fjellet holder derfor kaldt føre lenge — det er også grunnen til at det sjelden er vårføre å hente her.",
      "Vanligste feil: å legge nedkjøringa i den øvre lia mot Bjørnsetstølen fordi den ser åpen ut. Der er det skredbaner. Den andre er å undervurdere innmarsjen: 1490 meter tilnærmet flat grunn er tungt å gå tilbake i myk snø, og turen er lengre enn høydemetrene tilsier.",
      "Kilden fører to startsteder, ett på hver side av fjellet: «Oppstigningen fra nord starter ved Skiple i Raundalen, snaut tjue kilometer øst fra Voss. Oppstigningen fra sør starter i Skaftedalen.» Og den sier hvorfor: «Det er to gode utgangspunkt for denne turen, et på den skyggefulle nordsiden, og et som ligger solvendt mot sør.» Appens rute er nordruta; sørruta ligger nå ved siden av den. Fra enden av Skaftedalsvegen på 486 moh går linja i slakt terreng nordøstover opp dalen forbi 662 og 766 til stølen Skytjeset på 882 — kildens «omtrent 890 moh» — og derfra på ryggformasjonen over 1063, flanken på 1249 og 1368 til topps. 1022 høydemeter på 6,13 km mot 1124 på 6,02 km fra Skiple: nesten samme tur, motsatt sol. Skogen slipper på 758 moh etter 2,91 km, mot 781 på nordruta. Bratteste hundremetersbeltet er 19,5 grader fra 900 til 1000 moh, og bratteste 30-metersvinduet 33,2 mellom 1211 og 1231, mot 31,4 på nordruta. Kilden gir et valg øverst — enten det bratte, markerte dalsøkket eller ryggformasjonen og flanken; linja her er ryggen, som er den kilden beskriver helt til topps.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Flat innmarsj, jevn midtdel og en bratt kneik til slutt. Bratteste hundremeteren, 1000 til 1100 moh, måler 21,4 grader, og bratteste sammenhengende parti 31,4 grader mellom 1093 og 1116 moh. Hele fjellsida er nordvendt.",
      },
      {
        title: "Terrenget rundt",
        body: "Den øvre lia mot Bjørnsetstølen er skredbaner — det er det stedet på turen der du skal holde deg i skogen heller enn i det åpne. Fri Flyt beskriver også en sørlig start fra Skaftedalen via Skytjeset; det er en annen rute på det samme fjellet, ikke et alternativ midtveis.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,194 L24,198 L46,197 L68,198 L95,197 L122,196 L148,190 L166,185 L193,176 L225,162 L252,154 L278,146 L299,139 L316,136 L337,133 L359,128 L381,120 L406,111 L427,101 L443,93 L462,83 L478,71 L494,67 L512,58 L529,46 L545,37 L565,32 L592,22 L600,18",
      startLabel: "398 moh",
      endLabel: "1462 moh",
      distanceLabel: "6,0 km",
      caption: "1124 høydemeter og 6,02 km fra Skiple gjennom Horndalsbotnen, med skoggrensa på 781 moh og skuldra på 1153 moh før toppkneika.",
    },
  },
  folarskardnuten: {
    slug: "folarskardnuten",
    intro:
      "Buskeruds høyeste, og en tur der 13,06 km og 997 høydemeter kommer nesten helt uten bratt terreng. Det eneste trinnet som krever noe står ut av Folarskardet, og det er kort — resten er lang, jevn innmarsj over Hallingskarvet.",
    ascent: [
      "Fra p-plassen ved Rv7 på Haugastøl, 1007 moh, følger du den kvista DNT-vinterruta mot Raggsteindalen nordover. De første elleve kilometerne er innmarsj: over stigninga på 1212 moh, ut på flatene under Folarskardet på 1326 moh, og i alt rundt 600 høydemeter fordelt så tynt at bandet mellom 1200 og 1300 moh måler 2,1 grader i snitt. Det er stakelende, ikke skinnlende. Underveis går linja over is tre ganger: Tjørngravtjørni på 1098 moh to ganger, 135 og 45 meter, og et navnløst tjern på 1230 moh på 45. Ingen av dem er regulerte og ingen kryssing går mer enn 48 meter fra land — det er små høyfjellstjern den kvista ruta går tvers over — men på en tur der resten av innmarsjen er fast mark er de verdt å vite om.",
      "Ved Lordehytta i Folarskardet, 1620 moh, går du av merkinga. Hytta er fra 1880 og står i selve skaret; tjørna like ved ligger på 1603 moh og er vatn under snøen — linja går 270 meter over den, opptil 84 meter fra land, og det er den fjerde og lengste iskryssinga på turen. Rutebeskrivelsen sier at du forlater merkinga ved tjørna og følger varder oppover, og det er den linja som er tegnet her — ikke rettlinja fra hytta mot toppen, som måler 40,3 grader som verste steg.",
      "Trinnet ut av skaret er turens eneste bratte parti: 35 til 40 grader, målt til 36,7 grader over 41 meter på den slakeste ramma noen finner. Linja skrår over trinnet i stedet for å ta det rett på, og leser derfor lavere: 29,2 grader over det bratteste 30-metersvinduet, mellom 1775 og 1795 moh. Bandsnittet på 18,7 grader for 1700 til 1800 moh er et snitt over 337 meter grunn og skjuler trinnet helt. Er snøen hard eller avblåst, er det her folk tar på seg stegjern.",
      "Over trinnet, på om lag 1830 moh, flater det ut igjen, og de siste 702 metrene går vest-sørvestover — peiling 253 grader — opp til toppen på 1932 moh, jevnt fra 0,5 til 17,5 grader. Merk at varden i rutebeskrivelsene står på nordøsttoppen: 1927 moh, 821 meter unna på peiling 36 grader, med et skar på 1900 moh imellom. Terrengmodellen gir 1932,2 på toppunktet og 1927,3 på nordøsttoppen, mot 1933 i den førte høyden. Toppplatået er åpent og har lite å navigere etter.",
    ],
    descent: [
      "Ned samme vei: over kanten av trinnet, ned ramma til Lordehytta, og deretter de elleve kilometerne tilbake til Haugastøl. Nedkjøringa er sørvendt — fallvektet gjennomsnittsretning er 154 grader — men den er også kort. Under skaret er det lang, slak transport, og har du motvind på flatene tar hjemveien like lang tid som innmarsjen.",
      "Vanligste feil: å gå ut på nordsida av skarvet for å finne en bedre linje ned. Skavlene på nordsida henger langt ut over Raggsteindalen, og kanten er ikke synlig fra platået i flatt lys. Den andre feilen er å undervurdere værvinduet: turen er ikke bratt, men den er lang, og en snuoperasjon på toppplatået i dårlig sikt betyr elleve kilometer igjen i motvind.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Trinnet opp fra Folarskardet er 35 til 40 grader og er det eneste virkelige skredterrenget på turen. Linja som er tegnet går over trinnet, ikke utenom det. Tallene for den — 27,2 grader som bratteste parti, 18,7 i snitt for bandet 1700 til 1800 moh — gjelder sporet og ikke ramma: linja skrår over trinnet, mens fallinja der måler 36,7 grader over 41 meter. Bommer du på ramma, måler nærliggende linjer 40 til 46 grader. Trinnet kan også være avblåst og isete, og da er det stegjern og ikke skredvurdering som er problemet.",
      },
      {
        title: "Terrenget rundt",
        body: "Skavlene på nordsida av Hallingskarvet henger langt ut over Raggsteindalen, og toppplatået er åpent og navigasjonskrevende i dårlig sikt — det er lett å gå mot en kant du ikke ser. Vestsida er Hellevassfonn og Finse-traversen, en annen rute enn denne. Den lange innmarsjen gjør at været betyr mer enn hellinga: elleve kilometer er langt å snu på.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,184 L44,182 L70,177 L93,173 L113,172 L136,169 L163,167 L188,162 L209,159 L231,163 L254,158 L274,156 L299,151 L322,143 L347,137 L370,135 L394,136 L417,125 L444,119 L471,113 L494,96 L516,83 L537,76 L555,54 L574,37 L600,18",
      startLabel: "1007 moh",
      endLabel: "1932 moh",
      distanceLabel: "13,1 km",
      caption: "997 høydemeter og 13,06 km fra Haugastøl, der elleve av kilometerne er innmarsj og ett kort trinn ut av Folarskardet er alt som er bratt.",
    },
  },
  prestholtskarvet: {
    slug: "prestholtskarvet",
    intro:
      "963 høydemeter og 11,63 km fra Havsdalen til det høyeste punktet på 1860 moh, tolv kilometer inn på Hallingskarvet. Åtte av dem er flate: bandet fra 1200 til 1300 moh måler 1,3 grader over 5130 meter grunn. Alt det bratte ligger i Prestholtskardet — 17,6 grader fra 1500 til 1600 moh over 315 meter grunn, med et steg på 24,8 grader mellom 1323 og 1344.",
    ascent: [
      "Start på parkeringa nederst i Havsdalen, 963 moh — tre avgiftsplasser ved siden av hverandre, alle med access=yes i OSM. Ut.no tegner turen sin fra toppen av skisenteret, 1070 moh, som er lettvint hvis heisen går; korridoren her starter der bilen står, og det er forskjellen mellom de to startpunktene som gjør at høydemeterne på kortet er større enn ut.nos oppgitte 855. Skogen slipper taket på 1048 moh og terrenget er åpent fra 1051.",
      "Fra 1058 moh er du inne på den merkede løypa vestover. Ut.no: «følg merket løype til Prestholtseter (åtte km). Løypa blir tråkket daglig og er følgelig i meget god standard med både klassisk- og skøytespor.» Det er en flat innmarsj i ordets rette forstand — bandet fra 1000 til 1100 moh måler 3,3 grader over 1711 meter grunn, 1100 til 1200 måler 4,6 over 1216, og 1200 til 1300 måler 1,3 over 5130. Linja passerer 1240 moh og holder det nivået i fem kilometer.",
      "Prestholtstølan ligger på 1243 moh, rett under sørsiden av skarvet. Herfra begynner turen på nytt: 16,3 grader fra 1300 til 1400 moh over 315 meter grunn, 17,2 fra 1400 til 1500 over 316, og 17,6 fra 1500 til 1600 over 315 — det bratteste bandet. Det bratteste steget på hele linja ligger lavere, 24,8 grader mellom 1323 og 1344 moh. Det er Prestholtskardet, og registerpunktet for skardet måler 1640 moh.",
      "Oppe på skarvet slakner det brått: 10,3 grader fra 1600 til 1700 moh over 540 meter grunn, 7,1 fra 1700 til 1800 over 855, og 4,2 fra 1800 til 1900 over 742. De siste to kilometerne går vestover over vidt, åpent platå til det høyeste punktet, 1860,4 moh. Registerpunktet for Prestholtskarvet ligger 550 meter nordøst, mellom to topper som måler 1860,4 og 1857,5; ut.nos egen linje ender 20 meter fra den høyeste, og det er den kortet fører.",
    ],
    descent: [
      "Ned samme veien: vestover platået, ned Prestholtskardet og ut løypa. Sørflanken er den kortet fører, og den er ikke slak — sør måler 18,1 grader i snitt ut til halvannen kilometer med et 51,1-graders vindu 925 til 975 meter ut, sørøst 14,7 med 66,0 i vinduet 1225 til 1275, og sørvest 11,2 med 49,3 i 475 til 525. Det er veggen over Prestholt, og Prestholtskardet er det ene stedet den brytes.",
      "Intuisjonen om at stupet må ligge på den andre siden er feil her. Nord måler 2,0 grader i snitt ut til halvannen kilometer med et bratteste 60-metersvindu på 6,6, og nordøst 4,3 med 12,0 — skarvet fortsetter bare. Innafor 400 meter av toppen er hver eneste peiling under 10 grader. Det er et platå, og faren på det er ikke helning, det er sikt: du står på 1860 moh med tolv kilometer hjem og ingen holdepunkter.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "963 høydemeter der bratteste band er 22,0 grader og bratteste steg 25,2, begge i Prestholtskardet. Ruta gir tilbake 66 høydemeter på 11,63 km. Ut.no fører turen som krevende skitur og 21,6 km tur/retur fra heistoppen, og skriver at den «blir oftest gått utpå seinvinter/vår når snøen har satt seg» — det er skardet den setningen handler om.",
      },
      {
        title: "Terrenget utenfor",
        body: "Sørveggen under skarvet måler 66,0 grader i bratteste 60-metersvindu mot sørøst, 51,1 mot sør og 49,3 mot sørvest. Du kommer opp gjennom det ene bruddet i den. Vest for toppen ligger et trinn på 30,1 grader 425 til 475 meter ut. Nordover er platået flatt så langt sveipet går, men kanten er der et sted, og i flatt lys finner du den før du ser den.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og varsles hver dag i sesongen. Ut.no fører sesongen januar til april og kaller turen overkommelig i godvær for alle med noe langrennserfaring — «i godvær» er den delen som bærer setningen. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,195 L44,184 L67,182 L88,178 L111,173 L130,171 L151,158 L172,153 L200,145 L220,144 L241,144 L265,145 L285,144 L306,145 L330,145 L353,144 L376,144 L397,145 L418,143 L443,127 L460,108 L481,81 L499,65 L520,49 L543,38 L566,26 L590,22 L600,18",
      startLabel: "963 moh",
      endLabel: "1860 moh",
      distanceLabel: "11,6 km",
      caption: "963 høydemeter og 11,63 km fra Havsdalen forbi Prestholtstølan på 1243 moh og opp Prestholtskardet på 1640, med skogen som slipper taket på 1038 moh.",
    },
  },
  gyranfisen: {
    slug: "gyranfisen",
    intro:
      "666 høydemeter på 5,55 km fra Vikerkoia, 661 moh, til Ringerikes høyeste punkt på 1127. Differansen mellom de to tallene er søkket: ruta klatrer opp på Svarttjernskollen, 1054 moh, faller ned mot Fjelldalen og går opp igjen, og gir tilbake 200 høydemeter som kommer igjen som stigning på veien hjem.",
    ascent: [
      "Start på parkeringa ved Vikerkoia på Vikerseterveien, 661 moh — Kartverket klasser punktet som myr, og det er en presis beskrivelse av Vikerfjell. De første høydemeterne er slake, 5,1 grader fra 600 til 700 moh, før skogen tar over ved 698 moh.",
      "Stigningen opp mot Svarttjernskollen er den bratteste på turen: 15,4 grader fra 700 til 800 moh over 360 meter grunn, med bratteste sammenhengende parti 24,9 grader mellom 767 og 788 moh. Skogen slipper allerede på 857 moh etter 1,04 km, og fra 872 er du ute i åpent terreng.",
      "Svarttjernskollen ligger på 1054 moh, og ut.no oppgir 1054 — det er kontrollen på at du er på rett rygg. Herfra ser du Vikerfjellplatået i sør og Gyranfisen i vest. Så går det ned igjen: linja passerer 1002, 961, 904 og 922 moh, og Kartverket klasser flere av dem som skog. Du er under tregrensa på nytt, midt i turen.",
      "Venekollen, 982 moh, passeres på høyre hånd, og waypointet i korridoren ligger vest for toppen på 949 moh, der ruta faktisk går. Fra bunnen av søkket stiger det jevnt igjen — 4,3 grader fra 1000 til 1100 moh over 1129 meter grunn, og 8,0 grader det siste bandet — til varden på 1127 moh. Treknatten, 1098 moh, ligger 4,20 km nord-nordvest, på peiling 340.",
    ],
    descent: [
      "Ned samme veien, sørøstover, og du skal opp igjen underveis. Det er turens egenart: 200 høydemeter gitt tilbake på veg opp betyr 200 høydemeter å klatre på veg ned, og det er verdt å ha spart krefter til dem.",
      "Fjellet er slakt i alle retninger. Radialmålinger fra varden gir 4,8 til 12,6 grader i snitt over 500 meter, og bratteste 60-metersvindu på hele toppen er 29,9 grader mot nordøst, 410 til 470 meter ut. Vestsida — den mot Vidalen — måler 5,7 grader i snitt helt ut til halvannen kilometer, med bratteste vindu 20,9 grader. Stupene du ser den veien tilhører Bukollen, Gråfjell og Storrustefjell på andre sida av dalen, ikke fjellet du står på.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slakt terreng med én kneik: 15,4 grader fra 700 til 800 moh over 360 meter grunn, og bratteste sammenhengende parti 24,9 grader mellom 767 og 788 moh. De andre bandene måler 2,1 til 10,5 grader i snitt. Skredfaren er lav; det som kan gå galt er lengden, søkket og at siste stykket opp er umerket.",
      },
      {
        title: "Terrenget utenfor",
        body: "Ingen retning fra varden måler over 12,6 grader i snitt de første 500 meterne. Ryggen fra Svarttjernskollen er avblåst i vind, og søkket mot Fjelldalen og Steintjern må krysses begge veger. Løypene til Gyranfisen og Treknatten blir kjørt bare når forholdene tillater det og prioriteres i vinter- og påskeferien — utenom det er ruta usporet myr og fjell. Deler av området ligger i Vikerfjell naturreservat. Over ryggen fra Svarttjernskollen går linja sin egen veg, opptil 443 meter fra den kartlagte løypa ved 1039 moh — der er løypa ikke noe å navigere etter.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,192 L53,183 L78,166 L97,138 L117,118 L136,96 L159,81 L189,66 L209,56 L233,47 L249,54 L264,72 L288,81 L312,85 L337,93 L361,103 L385,109 L410,98 L434,93 L454,89 L478,102 L497,102 L517,82 L541,62 L561,45 L585,24 L600,18",
      startLabel: "661 moh",
      endLabel: "1127 moh",
      distanceLabel: "5,6 km",
      caption: "666 høydemeter og 5,55 km fra Vikerkoia over Svarttjernskollen, med skoggrensa på 857 moh og 200 høydemeter gitt tilbake i søkket underveis.",
    },
  },
  oksen: {
    slug: "oksen",
    intro:
      "968 høydemeter i ett strekk, fra Tjoflot nede ved fjorden til en topp som ser ut over Hardangerfjorden, Granvinsfjorden, Sørfjorden og Eidfjorden. Turen krever kondisjon mer enn teknikk.",
    ascent: [
      "Fra avgiftsparkeringen øverst på Tjoflotvegen, 276 moh, følger du traktorveien et kort stykke før stien tar over. Regn med å bære ski gjennom skogen: skoggrensa ligger på 580 moh, og de fleste spenner dem først på oppe ved Vindhovden.",
      "Skogen er det bratteste partiet før flanken. Fallinja mellom 335 og 405 moh måler 30° i snitt og tar 51° over de bratteste seksti meterne; stien tar den i svinger — ingen hundremeter i skogen holder mer enn 21° — og topper på 26° mellom 461 og 478 moh. Følg svingene — det finnes ingen snarvei her som lønner seg.",
      "Ved stølen Vindhovden på 586 moh åpner det seg. Herfra følger du sørvestsida østover mot toppen, langs skulderen under ryggen. Rundt 900 moh strammer det til: spennet 900–1000 moh ligger på 24,3° i snitt og 1000–1100 på 19,0°, og det bratteste enkeltpartiet på linja, 28,2°, ligger her, mellom 902 og 920 moh. Grunnen blir samtidig steinete.",
      "Over 1100 moh slakner linja igjen, og de siste høydemeterne er rolig terreng inn mot toppen. Men hold linja: noen titalls meter sør for deg ruller skulderen over. Ved 1146 moh faller sørsida 40° i snitt de neste 340 høydemeterne, med et enkelttrinn på 66°. Nord for linja er det motsatt — der slakner det ut i 2–5°, og det er den sida som lurer deg av ruta.",
    ],
    descent: [
      "Flanken kjører like godt ned som den går opp: over 650 sammenhengende høydemeter fra toppen til Vindhovden, med fjorden foran deg hele veien. Du har bredde å velge i, men ikke ubegrenset — et par hundre meter sørover ruller skulderen over i 35–40°.",
      "Vanligste feil: å følge fallinja. Tåka legger seg ofte på toppen her, og i flatt lys trekker den deg sørover av skulderen, ned i 35–40° med trinn opp mot 57°. Retter du for mye tilbake, havner du i det slake nord for linja — der ligger Hamreskredane, 530 meter nord for ruta på 758 moh, og under den faller terrenget 33° videre mot Granvinsfjorden. Sikt på Vindhovden, og hold høyden på skulderen hele veien ned.",
      "Under Vindhovden er kjøringen over. Skoggrensa på 580 moh er der skiene går på sekken, og de siste drøyt 300 høydemeterne ned til Tjoflot går på beina, i de samme svingene du kom opp.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ruta stiger 968 høydemeter på 3,75 km, og den bratteste delen ligger mellom 900 og 1100 moh: 24,3° i snitt over det første hundremeterspennet, 19,0° over det neste. Det bratteste enkeltpartiet på linja måler 28,2° og ligger i dette spennet, mellom 902 og 920 moh. Lenger nede, i skogen under Vindhovden, tar stien lia i svinger og topper på 26,3° mellom 461 og 478 moh. Begge er bratte nok til at snø kan løsne, og hver av dem bør vurderes for seg.",
      },
      {
        title: "Terrenget utenfor",
        body: "Det bratte ligger sør for linja, ikke nord. Målt fra ruta faller sørsida 28–40° i snitt over de første fire hundre meterne på hvert eneste punkt fra Vindhovden opp til 1146 moh, med 42–57° over de bratteste seksti meterne — brattest øverst, der linja selv er brattest. Nord for linja slakner det ut i 2–17°, og det er den sida som lurer: fem hundre meter nordover ligger Hamreskredane på 758 moh, og fra den faller terrenget 33° i snitt mot Granvinsfjorden. I skogen under Vindhovden måler fallinja 30° mellom 335 og 405 moh, med 51° over de bratteste seksti; stien går utenom i svinger.",
      },
      {
        title: "Før du går",
        body: "Oksen ligger i varslingsregion Voss, ikke Hardanger. Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,193 L50,186 L78,176 L97,168 L111,162 L140,153 L158,150 L180,142 L201,137 L223,131 L253,126 L281,120 L302,114 L331,108 L356,104 L376,97 L396,89 L413,82 L428,74 L452,62 L475,52 L497,43 L513,38 L547,28 L576,21 L600,18",
      startLabel: "276 moh",
      endLabel: "1241 moh",
      distanceLabel: "3,8 km",
      caption: "276 moh ved Tjoflot til toppen av Oksen — 968 høydemeter på 3,75 km, uten en meter tilbake.",
    },
  },
  ustetind: {
    slug: "ustetind",
    intro:
      "416 høydemeter og 4,38 km fra Ustaoset til den store varden på 1376 moh. Ingenting på ruta er bratt: bratteste hundremetersband er 9,7 grader fra 1100 til 1200 moh over 614 meter grunn, og bratteste sammenhengende steg 18,5 grader mellom 1343 og 1355. Hele turen ligger på nordøstkanten av Hardangervidda, og det er været og ikke helningen som avgjør dagen.",
    ascent: [
      "Start på parkeringa ved Ustaoset, 989 moh. Ut.no tegner turen sin fra et punkt 320 meter lenger nord, oppe i hyttefeltet på 1005 moh; plassen som er kartlagt i OSM ligger nede ved veien, og det er den korridoren bruker. Rv 7 forbi Ustaoset er vinteråpen, og det går tog til stasjonen 692 meter nordvest.",
      "Første kilometeren er nesten flat — bandet fra 900 til 1000 moh måler 0,9 grad over 906 meter grunn — forbi setra Sisseldalen og sørover. Så tar det seg litt opp: 4,5 grader fra 1000 til 1100 moh over 1231 meter grunn. Linja passerer 1104 moh vest for Måfådalen. Skogen slipper taket på 1070 moh og terrenget er åpent fra 1078.",
      "Over tregrensa kommer den ene stigninga som fortjener navnet: 9,7 grader fra 1100 til 1200 moh over 614 meter grunn. Ut.no beskriver det samme fra den andre siden — «før Tindevatnet starter en jevn stigning». Linja passerer vatnet på østsida, 1317 moh, og over det slakner det igjen til 7,4 og 4,9 grader.",
      "Den siste kilometeren er slak rygg til varden på 1376 moh, med det bratteste steget på hele turen underveis: 18,5 grader mellom 1343 og 1355 moh. På toppen står to varder. Den lille har en metallplate med piler og stedsnavn; den store er fra 1899, verneverdig, og ble brukt som trigonometrisk punkt — ut.no ber deg uttrykkelig la være å legge på stein.",
    ],
    descent: [
      "Ned samme veien mot nord. Nordflanken måler 9,9 grader i snitt over 400 meter med et 15,2-graders vindu 70 til 130 meter ut, og nordvest 10,8 med 22,2 i vinduet 90 til 150. Det er slakt nok til at nedkjøringa er en tur og ikke en linje, og det er også hele poenget med fjellet: bergen365 kaller det en topptur for tidlig og sein sesong, når snøen blir varm og våt lenger vest.",
      "Ingen retning fra toppen er bratt. Det bratteste 60-metersvinduet i hele sveipet er 28,9 grader mot sørøst, 110 til 170 meter ut, og sørvest måler 27,5 i vinduet 160 til 220. Snittet ligger mellom 8,8 og 13,0 grader i alle åtte retninger.",
      "Turen kan også gjøres fra den private turisthytta Tuva i sør, som ut.no oppgir til halvannen time opp mot drøyt to fra Ustaoset. Bergen365 beskriver en tredje variant, fra dammen på Ustevatnet via Verpestølvegen, med rundt 400 høydemeter.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "416 høydemeter der bratteste band er 9,7 grader og bratteste steg 18,5. Ruta gir tilbake 29 høydemeter på 4,38 km. Ut.no fører turen som moderate og barnevennlig. Det er ikke helningen som er problemet her.",
      },
      {
        title: "Det som faktisk er farlig",
        body: "Bergen365 navngir tre ting på denne ruta, og ingen av dem er en vinkel: skjult vassdrag under snøen fra bekkene som krysser lia, ustabil vindtransportert snø over tregrensa, og terrengfeller. De skriver at skredvurdering hører hjemme her selv om hellingene er moderate, og at vær og vind skifter raskt på dette nivået. Ut.nos sommerbeskrivelse nevner tett vierkratt og myrete partier i lia — under snø er det samme sak: ujevnt underlag og åpne bekker.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og varsles hver dag i sesongen. Ingen av ut.no-beskrivelsene er vinterbeskrivelser — begge fører sesong mai til oktober — så sesongen på kortet er lest ut av bergen365 og løypesesongen på vidda, ikke av en kilde for denne ruta. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,196 L19,198 L44,200 L63,200 L81,198 L106,196 L124,189 L147,184 L166,177 L184,166 L198,167 L217,160 L235,159 L254,157 L278,150 L293,145 L316,130 L334,120 L359,112 L377,96 L402,83 L420,75 L445,65 L464,55 L488,49 L507,44 L525,48 L550,52 L568,42 L586,28 L600,18",
      startLabel: "989 moh",
      endLabel: "1376 moh",
      distanceLabel: "4,4 km",
      caption: "416 høydemeter og 4,38 km fra Ustaoset vest for Måfådalen på 1104 moh og forbi Tindevatnet på 1317, med skogen som slipper taket på 1084 moh.",
    },
  },
  skrott: {
    slug: "skrott",
    intro:
      "1070 høydemeter og 5,12 km fra støls- og hyttetunet i Fitjadalen til Skrott, fjellet som stuper mot Hardangerfjorden i sørenden av Kvamskogen. Linja følger den kartlagte stien hele veien: gangbrua over Kjølo, den bratte skogslia til Håsete, skihytta på 1110 moh og skaret mellom Glynt og toppen. Det bratteste hundremetersbeltet måler 17,4 grader mellom 800 og 900 moh, og det bratteste sammenhengende partiet 28,2 grader mellom 1158 og 1182 moh — men det som preger turen, er skrentene i skogen og den bratte toppklossen, ikke snittene.",
    ascent: [
      "Fra parkeringa ved støls- og hyttetunet i Fitjadalen, 272 moh, om lag åtte kilometer fra Øystese. Oppstigninga begynner ved gangbrua over elva Kjølo og følger i hovedsak sommerstien — først gjennom granskog i knudrete terreng, så over en flate, og opp en li der Fri Flyts egen advarsel gjelder: «stygge skrenter i skogen». Beltene måler 14,4 grader fra 300 til 400 moh og 17,0 fra 500 til 600, og stien er der av en grunn — den går utenom skrentene.",
      "Skogen slutter på 676 moh etter Kartverkets klasser, med åpent område fra 686, og like over kommer du inn i dalføret som leder til Håsete — stølen ligger på 754 moh der registeret har den, mot de «rundt 800 meter» kilden oppgir. Herfra holder du nordvestover med jevn stigning: beltet fra 800 til 900 moh er turens bratteste med 17,4 grader i snitt over 348 meter grunn.",
      "Den vesle skihytta står på 1109,8 moh målt — Fri Flyt kaller den «omtrent 1000 moh», westcoastpeaks «the hut at 1100 m», og terrengmodellen avgjør. Fra hytta går normalveien nordover opp i skaret mellom Glynt og selve toppen. Det bratteste sammenhengende partiet på linja ligger her, 28,2 grader mellom 1158 og 1182 moh, før skaret slipper deg opp på skuldra.",
      "Fri Flyt nevner også en alternativ oppstigning fra skihytta: sommerstien på et system av skråhyller og opp en liten kneik over kanten. Kilden advarer selv mot den ved hardt føre eller vestvendte skavler, og Westcoastpeaks anbefaler isøks og stegjern på de samme hyllene vinterstid, og legger til at i isete forhold trengs isøks og stegjern også for å komme ned fra selve toppen. Korridoren her er skaret, ikke hyllene, men isøksa gjelder toppen like fullt.",
      "Skuldra der sommerstien krysser, 85 meter nord for varden, måler 1300,6 moh, og de siste meterne sørover til varden er lett terreng, akkurat slik kilden sier — beltet fra 1300 til 1400 måler 6,4 grader. 1320 moh, med Hardangerfjorden foran deg — Fri Flyt skriver at fjellet «stuper rett i Hardangerfjorden», men nærmeste fjordvann ligger 8 km unna ved Øystese, og terrenget 3 km vest og sørvest for varden står fremdeles i 550 til 800 moh.",
    ],
    descent: [
      "Terrenget fra toppen ned mot Håsete innbyr til variasjoner over oppturen — det er Fri Flyts egne ord, og sørøst- og sørsveipene fra varden måler 38,9 og 39,5 grader i sine bratteste 60 m-vinduer 580 til 720 meter ut, så det fins bratt skikjøring å hente. Sent på våren nevner kilden bollene og ryggene litt østover fra varden, fremst på kanten og derfra mot Håsete.",
      "Det som ikke skal kjøres, er vest og sørvest fra varden: vestsida faller 49,0 grader bare 10 til 70 meter ut, og sørvestsida 45,4 grader 160 til 220 meter ut. Nordvest er heller ikke veien hjem — den faller 49,8 grader i snitt de første tjue meterne og 34,8 ut til 160, og de 7,0 gradene over 800 meter er bare fallet ned i skaret jevnet mot stigninga opp igjen mot Glynt. Skuldra du kom opp ligger rett nord, og måler 17,5 grader i snitt de første 400 meterne — fra varden ser de to sidene like ut i flatt lys, og de er det ikke.",
      "Fra Håsete er rådet fra kilden å følge omtrent samme veien som opp: «lett å kjøre seg fast i kronglete terreng» er Fri Flyts formulering om skogslia, og skrentene som formet veien opp, finnes fremdeles under deg.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts faremoment er «Skredfare i øvre del. Stygge skrenter i skogen.» Den øvre delen er flanken fra Håsete til skaret — bratteste beltet 17,4 grader mellom 800 og 900 moh, bratteste sammenhengende parti 28,2 grader mellom 1158 og 1182 — og skrentene i skogen ligger i beltene på 14,4 til 17,0 grader under tregrensa på 676 moh, der stien er eneste fornuftige linjevalget. ut.no sier det samme med andre ord: turen er primært en fottur, og som skitur går noen steder så bratt at kunnskap om skredfare er nødvendig.",
      },
      {
        title: "Toppklossen",
        body: "Vestsida faller 49,0 grader bare 10 til 70 meter fra varden og sørvestsida 45,4 grader 160 til 220 meter ut, mens nordskuldra linja bruker måler 17,5 grader i snitt de første 400 meterne. Skråhyllene på alternativveien er kildens egen advarsel ved hardt føre eller vestvendte skavler, og westcoastpeaks anbefaler isøks og stegjern der vinterstid. På denne toppen er det ikke snittbrattheten som er faren, men kantene.",
      },
      {
        title: "Før du går",
        body: "Skrott ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer skisesong for denne turen: ut.nos sesongfelt gjelder fotturen (mai til juli og september), og kortets jan–apr er lånt fra ut.nos Tveitakvitingen-beskrivelse på samme massivet. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L31,198 L58,189 L74,182 L95,177 L114,173 L132,166 L150,157 L168,147 L191,140 L211,132 L232,122 L261,116 L284,109 L305,101 L326,89 L353,80 L376,74 L395,65 L432,56 L458,53 L484,48 L506,48 L527,40 L556,33 L574,24 L590,21 L600,18",
      startLabel: "272 moh",
      endLabel: "1320 moh",
      distanceLabel: "5,1 km",
      caption: "1070 høydemeter og 5,12 km fra Fitjadalen, med det bratteste — 28,2 grader mellom 1158 og 1182 moh — i skaret mellom Glynt og toppen.",
    },
  },
  sata: {
    slug: "sata",
    intro:
      "895 høydemeter og 6,6 km fra den innerste parkeringa ved Eikedalen skisenter til toppen registeret fører under to navn: Såta og Iendefjell. Turen er to turer i én — en nesten flat anmarsj inn Skeiskvanndalen, der beltet fra 500 til 600 moh måler 1,8 grader i snitt over 3,15 km grunn, og så selve fjellet: fra Rosselandsbotnen østover reiser flanken seg, med det bratteste hundremetersbeltet på 18,4 grader mellom 1100 og 1200 moh og et bratteste sammenhengende parti på 32,5 grader mellom 1139 og 1168 moh, rett under skaret.",
    ascent: [
      "Fra den innerste parkeringa ved Eikedalen skisenter, 459 moh, på Kråvegen. Fri Flyt sender deg opp en setervei de første hundre høydemetrene, og det er Kråvegen østover og stien videre: linja følger den kartlagte veien og stien til om lag 555 moh, der dalen flater ut.",
      "Så kommer den lange, flate anmarsjen inn Skeiskvanndalen — 1,8 grader i snitt gjennom beltet fra 500 til 600 moh, over 3,15 km grunn. Skogen slutter på 629 moh etter Kartverkets klasser, med åpent område fra 631, så mesteparten av dalen går i glissen fjellskog og myr. Dalbotnen bærer to naturlige vatn på 551 moh — et navnløst tjern og Skeiskvanndalsvatnet — og linja holder den tørre nordvestsida forbi begge. Det er målt, ikke håpet: 0 meter av linja står på vatn.",
      "Rosselandsbotnen er vendepunktet. Selve registerpunktet for botnen står på tjernet der — 661 moh, klasse innsjø — og linja passerer sørbredden på fast mark. Her forlater du dalbotnen, tar til høyre slik kilden sier, og begynner den bratte stigningen: beltene ovenfor måler 16,1 grader fra 700 til 800 moh, 17,7 fra 900 til 1000 og 18,4 fra 1100 til 1200, det bratteste på turen.",
      "Sikt mot skaret til venstre for — altså nord for — selve toppen. Det måler 1224 moh, 190 meter nord-nordvest for varden, og det bratteste sammenhengende partiet på hele linja ligger rett under det: 32,5 grader mellom 1139 og 1168 moh. Øverste delen av skaret og toppryggen er ofte avblåst og hard, og Fri Flyt nevner isøks som en fordel — det er den delen av turen som avgjør om dagen er innenfor.",
      "Fra skaret går toppryggen sørover til varden, forbi 1248 moh — beltet fra 1200 til 1300 måler 9,1 grader, så det bratte er gjort når du står i skaret. 1260 moh, og Kvamskogen, Fuglafjellet og fjorden under deg.",
    ],
    descent: [
      "Vanligste nedkjøringa er samme veien: nordover av toppryggen, ned gjennom skaret, og vestflanken ned mot Rosselandsbotnen. Flanken du kjører er den samme du gikk opp — 25,4 grader i snitt fra varden mot vest, med 53,0 grader som bratteste 60 m-vindu 740 til 800 meter ut — så linjevalgene på vei opp er linjevalgene på vei ned.",
      "Fri Flyt beskriver også den sørvestvendte renna mellom Såterindane. Kilden sier du skal fortsette forbi toppvarden for å finne den, og registeret setter Såterindane 837 meter sørvest for varden; det bratte rett under varden — 43,4 grader 110 til 170 meter ut i sørvestsveipet — er skuldra på toppen, ikke inngangen til renna. Kilden er tydelig på avslutningen: ta til høyre før botnen av renna, før Såtedalen, og kjør tilbake mot oppstigningsruta. Vestflanken rett ned fra toppen nevner kilden bare for dager med svært stabilt snødekke.",
      "Fra Rosselandsbotnen tilbake er det de 3 km flate ut dalen og seterveien ned til parkeringa — 94 høydemeter å gi tilbake har turen samlet, det meste av det i den kuperte dalbotnen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts eget faremoment er «Skred både opp og ned, og klipper», og målingene sier hvor: beltene fra 700 moh og opp veksler mellom 9,1 og 18,4 grader i snitt, med 16,1 fra 700 til 800, 17,7 fra 900 til 1000 og 18,4 fra 1100 til 1200 som de bratteste, det bratteste sammenhengende partiet er 32,5 grader mellom 1139 og 1168 moh, og fallet fortsetter forbi varden — vestsida 53,0 grader på det bratteste 740 til 800 meter ut, nordvestsida 53,6 grader 690 til 750 meter ut. Flanken fra Rosselandsbotnen til skaret er skredterreng i begge retninger, og den er eneste veien på denne ruta.",
      },
      {
        title: "Toppen og skaret",
        body: "Øverste delen av skaret og toppryggen er ofte avblåst og hard — Fri Flyt nevner isøks, og det er her den mener. Sørvestsveipet fra varden måler 43,4 grader på det bratteste 110 til 170 meter ut, og det er skuldra på toppen — renna mellom Såterindane ligger 837 meter lenger sørvest; sørøstsida måler 35,7 grader 440 til 500 meter ut og sørsida 37,3 grader 740 til 800 meter ut. Den slakeste sektoren fra varden er nordøst, 13,7 grader i snitt — men det er ikke den veien ruta går.",
      },
      {
        title: "Vatnene",
        body: "De to vatnene i dalbotnen — det navnløse tjernet og Skeiskvanndalsvatnet, begge på 551 moh — ligger en snau time fra Bergen, lavt og kystnært, og isen på dem kan ikke forutsettes. Linja holder derfor den tørre nordvestsida forbi begge, målt mot Kartverkets terrengklasser og OSMs vannpolygon: 0 meter på vatn. Registerpunktet for Rosselandsbotnen står også på vatn, på tjernet på 661 moh; linja passerer sørbredden på fast mark.",
      },
      {
        title: "Før du går",
        body: "Såta ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesong for denne turen; kortets jan–apr er lånt fra ut.nos beskrivelse av Tveitakvitingen 12,6 km sør, på andre sida av Kvamskogen. Ta med sender/mottaker, søkestang og spade, og isøks til skaret når det er avblåst. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,196 L50,190 L74,182 L99,179 L115,179 L144,178 L167,179 L193,178 L217,175 L242,179 L258,176 L287,179 L307,173 L332,170 L351,161 L373,155 L397,152 L415,135 L434,122 L454,112 L470,103 L484,95 L499,84 L516,69 L536,56 L561,38 L577,26 L600,18",
      startLabel: "459 moh",
      endLabel: "1260 moh",
      distanceLabel: "6,6 km",
      caption: "895 høydemeter og 6,6 km fra Eikedalen, med det bratteste — 32,5 grader mellom 1139 og 1168 moh — rett under skaret nord for toppen.",
    },
  },
  gullfjellstoppen: {
    slug: "gullfjellstoppen",
    intro:
      "839 høydemeter og 7,8 km fra veienden ved Osavatnet til Bergens høyeste punkt. Dette er den slakeste turen i samlinga: ingen hundremeter av linja holder mer enn 8,1 grader i snitt, og det bratteste sammenhengende partiet er ett eneste trinn på 27,4 grader. Faren ligger ikke i ruta, men i de siste hundre metrene av den — toppkuppelen er slak, og vestsida faller 59,0 grader 200 til 260 meter fra varden.",
    ascent: [
      "Fra avgiftsparkeringa ved veienden på Gullfjellsvegen, 307 moh, innerst i Bjørndalen. De første to kilometerne går på grusvei og er så godt som flate: beltet fra 300 til 400 moh måler 2,5 grader i snitt over 2,1 km grunn. Skogen slutter allerede på 324 moh, og alt over det klassifiserer Kartverket som åpent område — dette er en tur uten tregrense å snakke om.",
      "Ved 2,47 km står du ved sørenden av Svartavatnet, 410 moh. Fri Flyt beskriver veien som «til høyre for Svartavatnet», og det er der linja går: på land, hele veien forbi. Svartavatnet er registrert som regulert vann. Fri Flyt oppgir 392 moh, terrengmodellen leser vannflata til 408, og forskjellen er ikke nedtapping — den er den nye dammen: Bergen kommune bygde dam nedstrøms i 2012–2014 og hevet høyeste regulerte vannstand med 20 meter.",
      "Redningshytta ligger 18 meter fra linja, 4,23 km ute; selve hyttepunktet måler 597,5 moh og linja der den passerer 592, mot de «600 moh» kilden oppgir. Rett etter kommer den vesle unnabakken kildene nevner, og den er reell: linja mister 50 høydemeter, fra 605 til 555 moh over 252 meter grunn, mellom 4,11 og 4,36 km. Det er 50 av de 159 høydemetrene turen gir tilbake underveis.",
      "Fra 555 moh stiger det jevnt igjen, og det bratteste på hele turen ligger her: et trinn på 27,4 grader mellom 709 og 727 moh. Det er kort, og det er den bratteste tretti-meteren på linja.",
      "Over tjørna på 769 moh, 6,21 km ute, flater det ut i det kilden kaller et kupert høydedrag. Det bratteste hundremeterbeltet på turen ligger her, mellom 800 og 900 moh, og det måler 8,1 grader i snitt over 720 meter grunn. Så gjennom Middagsdalen på 939 moh, 7,40 km ute, og opp til varden på 987.",
    ],
    descent: [
      "Ned samme linja: gjennom Middagsdalen, over høydedraget, forbi tjørna og ned til Redningshytta. Under hytta venter de 50 høydemetrene du mistet på vei opp, denne gangen som stigning. Fra Svartavatnet og ut er det grusvei og 2,5 grader — de siste to kilometerne går du.",
      "Vanligste feilen på dette fjellet er å ta av vestover eller nordvestover fra varden. Toppkuppelen er så slak at overgangen ikke kjennes på skia: nordsida faller 45,8 grader bare 30 til 90 meter fra varden, nordvestsida 61,2 grader 90 til 150 meter ut, og vestsida 59,0 grader 200 til 260 meter ut. Sørsida, som er den du kom opp, holder 4,9 grader i snitt de første 800 metrene. I flatt lys er forskjellen usynlig.",
      "Fri Flyt beskriver også nedkjøringer fra hovedtoppen om Gullfjellshalsen og Vossevardane til Svartavatnet. Det er andre linjer enn denne, og de er ikke målt her.",
      "Fri Flyt fører tre startsteder for Gullfjellet, og nordruta har sin egen beskrivelse: fra den nedlagte Gullbotn Turistheim ved Trengereid, «følg merkingen opp i selve Gullbotn nord for Mannaleitnipa (593 moh) og videre til Gullfjellshalsen». Merkinga er kartlagt hele veien. Fra parkeringa på 244 moh tar stien av på 293, går gjennom selve Gullbotn på 447 nord for Mannaleitnipa, over 699 og opp på Gullfjellhalsen — registerført som rygg, 941 moh — og derfra de siste metrene til varden. 753 høydemeter på 3,96 km mot 839 på 7,80 km fra Osavatnet: halve lengden, nesten samme stigningen, og ingen grusvei. Det koster bratthet. Beltet fra 600 til 700 moh måler 19,4 grader mot 8,1 i det bratteste beltet på vestruta, og det bratteste 30-metersvinduet er 26,1 grader mellom 607 og 629 mot 27,4. Det er ikke et enkelt vindu som skiller dem — det er at stigningen her kommer på under halve lengden. Skogen slipper på 406 moh etter 1,4 km. Ruta gir bare 10 høydemeter tilbake, mot 159 på vestruta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja er slak hele veien. Det bratteste hundremeterbeltet, 800 til 900 moh, måler 8,1 grader i snitt, og ingen av de seks andre beltene holder mer enn 6,9. Bratteste sammenhengende parti er trinnet på 27,4 grader mellom 709 og 727 moh. Det som skifter med været her er ikke bratthenget, men føret: turen starter på 307 moh ved kysten, og snøgrensa ligger ofte over parkeringa. Fri Flyts eget faremoment gjelder ikke denne linja, men gjelet i massivet: «Hele Glumragjelet, samt de to rennene, er veldig skredutsatt vinterstid, og på våren kommer det ofte is og stein ned fra de stupbratte fjellsidene.» Registeret skriver navnet Glamregjelet og setter juvet 663 meter rett vest for varden, på 576 moh — under den vestsida ruta ikke kjører, men står rett over.",
      },
      {
        title: "Toppen",
        body: "Hele turen er en oppvarming til de siste hundre metrene. Fra varden faller nordsida 45,8 grader 30 til 90 meter ut, nordvestsida 61,2 grader 90 til 150 meter ut og vestsida 59,0 grader 200 til 260 meter ut; østsida måler 41,3 grader 740 til 800 meter ut og sørøstsida 30,6 grader 380 til 440 meter ut. Sørsida, oppstigningen, holder 4,9 grader i snitt. En slak kuppel over bratte sider er nettopp det terrenget der en feilpeiling i skodde koster mest.",
      },
      {
        title: "Isen",
        body: "Osavatnet ligger på 307 moh ved kysten på Bergens breddegrad, og Svartavatnet er registrert som regulert. Linja er derfor lagt på land hele veien: 0 meter av 7 803 står på vann, kontrollert mot Kartverkets terrengklasse hver andre meter langs hele linja — 3 769 punkt — og mot OSMs vannpolygon. Et regulert vann blir tappet ned om vinteren, og is som blir liggende igjen over tomrom bærer ingenting.",
      },
      {
        title: "Før du går",
        body: "Gullfjellstoppen ligger i varslingsregionen Hordalandskysten, som er en B-region: det blir ikke laget daglig skredvarsel for dette fjellet. Nærmeste A-region er Voss, og den dekker et annet og mer innlandspreget fjellparti — les den som kontekst, ikke som varsel for Gullfjellet. Ta med sender/mottaker, søkestang og spade. En tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,195 L48,199 L72,199 L97,194 L117,185 L142,186 L166,174 L191,173 L200,172 L225,160 L252,145 L277,137 L304,122 L327,129 L350,135 L372,126 L391,114 L412,97 L434,88 L457,76 L474,77 L477,76 L496,66 L520,61 L541,48 L565,31 L590,23 L600,18",
      startLabel: "307 moh",
      endLabel: "987 moh",
      distanceLabel: "7,8 km",
      caption: "839 høydemeter og 7,8 km fra Osavatnet, med det bratteste — et trinn på 27,4 grader mellom 709 og 727 moh — midtveis opp.",
    },
  },
  tveitakvitingen: {
    slug: "tveitakvitingen",
    intro:
      "995 høydemeter og 8,56 km én vei fra Furedalen alpinsenter til Tveitakvitingen — den lengste av de fire Kvamskogen-turene, og den slakeste: bratteste hundremetersbeltet er 16,4 grader mellom 800 og 900 moh, og bratteste sammenhengende parti 25,0 grader mellom 817 og 838. ut.no graderer turen svært krevende likevel, og det er lengden og platået som bærer graden — 17 km tur-retur over vidt fjell der været og navigasjonen er vanskegraden, ikke hengene. Linja her er trukket av ut.nos egen GPX-linje, som ender 8 meter fra det målte toppunktet.",
    ascent: [
      "Fra parkeringa ved Furedalen alpinsenter, 382 moh. Navnet i kilden — «Furudalen» — finnes ikke i registeret; stedet heter Furedalen, og parkeringa er kartlagt som «Furedalen alpin». De første hundre meterne krysser flata ved anlegget, så er du på Mødalsvegen: de preparerte løypene kilden nevner er langrennsspor, kartlagt med klassisk og skøyting hele veien til Mødal, og alpintraséene ligger vest for linja.",
      "Mødalsvegen sørover er nesten flat — beltene fra 400 til 600 moh måler 3,5 grader i snitt — og forbi de innerste sela i Mødalen tar stigninga til. Linja passerer Svartatjørna på 86 meters avstand og 621 moh; selve tjørna leser 618 moh, og skogen slutter på 586 moh etter Kartverkets klasser, med åpent område fra 587.",
      "Så kommer de bratte kliva kilden beskriver, opp mot fjellet den kaller Såta — den lokale Såta på 802 moh sør for fylkesveien, ikke appens Såta på 1260 på nordsida av Kvamskogen. Beltet fra 800 til 900 moh er turens bratteste med 16,4 grader i snitt, og det bratteste sammenhengende partiet ligger her: 25,0 grader mellom 817 og 838 moh, opp det kilden kaller Stoveveggen — et navn verken registeret eller kartet bærer, så det står her som kildens.",
      "Over veggen flater platået ut — beltet fra 900 til 1000 moh måler 4,7 grader over 1,3 km grunn — og linja går sør for Gråskorvenuten, gjennom søkket kilden kaller Middagshola (heller ikke det i registeret): linja topper på 1017 moh og gir tilbake 36 meter til 981 før ryggen tar til. Turen gir tilbake 78 høydemeter samlet, det meste her.",
      "Siste biten går langs ryggen — beltet fra 1100 til 1200 moh måler 14,8 grader — og så slakere til varden på 1299. Toppen er slak i alle retninger: ingen av de åtte sveipene fra varden holder mer enn 14,2 grader i snitt de første 800 meterne.",
    ],
    descent: [
      "Retur samme veien. Ryggen og platået først — og det er her dagen skal planlegges: i skodde eller snøfokk er det navigasjonen over det vide platået mellom Middagshola og kliva som er vanskegraden, for terrengformene å styre etter er få og like. Kliva ned fra 838 til 817 er det bratteste du kjører.",
      "Fra varden er den bratteste sektoren sørvest, 37,5 grader i det bratteste 60 m-vinduet 690 til 750 meter ut — utenfor ruta, men verdt å vite om i dårlig sikt. Ellers er fallet fra toppen slakt: 5,5 grader i snitt mot sørøst, 6,8 mot sør.",
      "Fra Mødal er det langrennssporene på Mødalsvegen tilbake til Furedalen — flatt nok til at det er staking og skøyting mer enn kjøring, og de siste hundre meterne krysser du flata ved anlegget til parkeringa.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "ut.no sier at enkelte partier kan være skredutsatte, og målingene peker på kliva: beltet fra 800 til 900 moh holder 16,4 grader i snitt med det bratteste sammenhengende partiet på 25,0 grader mellom 817 og 838 moh, og beltet fra 1100 til 1200 på ryggen 14,8. Resten av linja er slakere enn 10 grader i snitt i hvert belte. Terrenget er målt slakt, og det skal sies slakt — men 17 km tur-retur er lang eksponering for værskifte, og fjellski med stålkant er kildens egen anbefaling.",
      },
      {
        title: "Platået",
        body: "Fra 900 moh og innover er dette vidt fjell med få former: beltet fra 900 til 1000 måler 4,7 grader over 1,3 km, og søkket kilden kaller Middagshola er eneste tydelige holdepunktet før ryggen. I flatt lys og skodde er det her turen blir vanskelig — ikke i hengene. Toppen selv er slak i alle åtte retninger; den bratteste sektoren, sørvest med 37,5 grader 690 til 750 meter ut, ligger utenfor ruta.",
      },
      {
        title: "Før du går",
        body: "Tveitakvitingen ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar til april er ut.nos egen. Ta med sender/mottaker, søkestang og spade, og regn turen som en heldagstur: 17 km tur-retur med 995 høydemeter. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,194 L44,191 L69,187 L94,178 L119,177 L138,176 L164,171 L187,166 L208,161 L230,158 L252,154 L274,146 L296,133 L321,119 L343,102 L369,94 L384,88 L406,77 L425,74 L448,81 L473,76 L497,67 L517,56 L542,37 L565,24 L589,21 L600,18",
      startLabel: "382 moh",
      endLabel: "1299 moh",
      distanceLabel: "8,6 km",
      caption: "995 høydemeter og 8,56 km én vei fra Furedalen, med det bratteste — 25,0 grader mellom 817 og 838 moh — i kliva kilden kaller Stoveveggen.",
    },
  },
  grafjell: {
    slug: "grafjell",
    intro:
      "595 høydemeter på 8,04 km fra Tempelsetra til Norefjells høyeste punkt. Ruta er slakere enn nabotoppene — bratteste hundremeteren, 1300 til 1400 moh, måler 10,0 grader — og lengre enn dem alle. Vanskeligheten er ikke hellinga, men at orienteringspunktene på de første fem kilometerne er tjern.",
    ascent: [
      "Start bak Tempelsetra kafè, 910 moh, og følg løypa mot Istjenn. Skogen slipper taket allerede ved 971 moh, og på 950 moh går ruta ut på Istjenn — Kartverket klasser punktet som innsjø, og det er det første av to vann ruta går ut på isen på — Donkelitjenn er det andre.",
      "Videre nordover forbi Vesletjenn på 1095 moh. Dette er den flate delen: bandet fra 900 til 1000 moh måler 2,3 grader over 2517 meter grunn, 1000 til 1100 måler 3,7 over 1441, og 1100 til 1200 bare 2,7 over 2070 meter. Fem kilometer går med før du står på 1156 moh, og i dårlig sikt er det her turen faktisk er krevende.",
      "Ved Donkelitjenn, 1156 moh, kaller ut.no turen halvgått, og oppgir at det er 313 høydemeter igjen. Det er deres løype som er halv der; den routede linja her er kortere og har vannet på to tredeler. Uansett er det herfra det stiger: 6,3 grader fra 1200 til 1300 moh, og et sted mellom 1283 og 1302 moh ligger bratteste sammenhengende parti på turen, 22,9 grader.",
      "Løypa fortsetter nordover til den deler seg rundt 1282 moh, og grenen som dreier østover går opp på Gråfjell. Bandet fra 1300 til 1400 moh er det bratteste, 10,0 grader over 585 meter grunn, og det siste bandet, over 1400 moh, måler 6,4 grader. Varden står på 1466 moh, 4,5 km nordvest for Høgevarde. De siste tre hundre meterne under toppen, fra 1328 til 1378 moh, går linja opptil 292 meter fra den kartlagte løypa.",
    ],
    descent: [
      "Ned samme veien — men ikke sørover fra varden. Ruta kommer inn på toppen fra nordvest, så den første kilometeren ned går tilbake dit løypa delte seg på 1282 moh, og først derfra svinger du sørover mot Donkelitjenn. Toppen er rund og flat, og det er verdt å vite hvor rund: radialmålinger fra varden gir 5,2 til 18,3 grader i snitt over 500 meter i alle åtte retninger, og det bratteste 60-metersvinduet på hele fjellet måler 30,2 grader.",
      "Det er derfor Gråfjell er en navigasjonstur og ikke en skredtur. Går du feil ned fra et rundt topplatå i skodde, ender du ikke i en henging — du ender i feil dal, med fem kilometer myr og tjern mellom deg og bilen. Ta peiling på toppen mens du kan se, og hold løypa tilbake over Donkelitjenn.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slakt høyfjell hele veien. Bratteste sammenhengende parti måler 22,9 grader, mellom 1283 og 1302 moh, og bratteste hundremeteren, 1300 til 1400 moh, holder 10,0 grader over 585 meter grunn. Tre av punktene Kartverket sampler langs linja er innsjø: Istjenn på 950 moh og Donkelitjenn på 1152 og 1156. Vinterstid er de flate sletter, og de er en del av ruta — men de er is, og isen er ikke terrengmodellens ansvar.",
      },
      {
        title: "Terrenget utenfor",
        body: "Det er lite av det. Ingen retning fra varden måler over 18,3 grader i snitt de første 500 meterne, og de bratteste 60-metersvinduene ligger på 30,2 grader mot sørøst og sør. Faren på Gråfjell er vær, avstand og sikt: toppen er det høyeste punktet på Norefjell og fanger vind og skodde før resten av platået, og ut.no fører sesongen som desember til mars.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,197 L43,189 L64,187 L90,187 L114,187 L137,187 L161,180 L181,175 L204,152 L228,142 L248,143 L275,139 L295,138 L315,136 L335,128 L362,121 L386,120 L410,117 L436,107 L460,102 L483,90 L507,84 L523,63 L547,46 L574,29 L597,20 L600,18",
      startLabel: "910 moh",
      endLabel: "1466 moh",
      distanceLabel: "8,0 km",
      caption: "581 høydemeter og 7,84 km fra Tempelsetra over Istjenn, Vesletjenn og Donkelitjenn, med skoggrensa på 971 moh og bratteste hundremeteren mellom 1300 og 1400 moh.",
    },
  },
  vesoldo: {
    slug: "vesoldo",
    intro:
      "838 høydemeter fra Byrkjenes, og en tur som blir slakere jo høyere du kommer: bratt skogsli nederst, åpen og jevn rygg over. Toppkuppelen er lettvint å gå — men den ligger et par hundre meter over stupene mot vest og nordvest, og en halv kilometer over dem mot nord, og i flatt lys er kanten ikke synlig.",
    ascent: [
      "Fra parkeringa ved Byrkjenes, 211 moh, innerst på Tordalsvegen nord for Strandebarm, går du opp den bratte skogkledde lia mot Fadnastølen, 498 moh. Dette er den bratteste delen av turen: bratteste hundremeteren ligger mellom 300 og 400 moh og måler 16,5 grader i snitt. Tordalsvegen er privat bomvei, og brøyting helt fram til parkeringa er ikke garantert — ring eller sjekk før du kjører langt.",
      "Over stølen åpner terrenget seg, med skog i flekker opp til rundt 577 moh. Ruta holder nordøstover inn på den brede sørvestryggen ved 629 moh.",
      "Derfra følger du ryggen sammenhengende nordover — 791 moh, så skulderen på 977 moh. Hele den øvre delen ligger på 10 til 13 grader: det er slakere enn sørfallet like ved, som holder 20,8 grader i snitt med et 33,7-graders belte 580 til 640 meter ute fra toppen. Sørvestryggen måler 9,5 grader i snitt, og det er grunnen til at linja ligger der den ligger.",
      "De siste hundre metrene svinger nordøstover opp den slake toppkuppelen til varden på 1046 moh. Bratteste sammenhengende parti på hele linja måler 28,9 grader, og det ligger nede i skogslia.",
    ],
    descent: [
      "Ned samme ryggen: sørover over skuldra på 977 moh og 791 moh, ned til 629 og videre til Fadnastølen. Fra stølen og ned er det skogsli — bratt nok til å være fin kjøring, og bratt nok til å gå løs etter mildvær og regn.",
      "Vanligste feil: å gå for langt vest eller nord fra varden. Nord, nordvest og vest faller 19 til 26 grader i snitt, men bryter av i 48 til 55 grader en halv kilometer ute fra varden, og toppkuppelen er så slak at du ikke kjenner det på skia før kanten er der. I flatt lys er det den eneste reelle faren på turen.",
      "Den andre feilen er å ta sørfallet ned fra toppen i stedet for sørvestryggen. Sør holder 20,8 grader i snitt, men har et belte på 33,7 grader 580 til 640 meter ute — det er ikke samme linja som ryggen, og det er ikke der ruta går.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nederste halvdelen er bratt skogsli, rundt 19 grader i snitt fra parkeringa til Fadnastølen, mens hele den øvre ryggen ligger på 10 til 13 grader. Bratteste sammenhengende parti på linja måler 28,9 grader. Den skogkledde lia over Byrkjenes er bratt nok til å gå løs etter mildvær og regn — det er den delen av ruta som endrer seg med været, ikke ryggen.",
      },
      {
        title: "Terrenget rundt",
        body: "Hold deg på sørvestryggen helt opp. I snitt over de første 800 metrene fra varden faller nordsida 19 grader, nordvestsida 25 og vestsida 26 — men snittet skjuler kanten. Bratteste seksti meter måler 55 grader mot nord (520 til 580 meter ute), 55 mot nordvest (500 til 560) og 48 mot vest (620 til 680), og det er kanten som teller. Sørfallet holder 20,8 grader i snitt, men med et 33,7-graders belte 580 til 640 meter ute. Sørvestryggen selv måler 9,5 grader i snitt, og forskjellen mellom den og nabosidene er hele poenget med linjevalget på dette fjellet.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,194 L41,187 L58,180 L80,173 L96,163 L109,156 L140,146 L160,139 L179,135 L198,125 L218,117 L237,110 L256,106 L277,102 L295,95 L320,83 L352,75 L374,74 L397,65 L417,60 L437,54 L455,50 L481,45 L509,39 L526,33 L552,31 L577,25 L600,18",
      startLabel: "211 moh",
      endLabel: "1046 moh",
      distanceLabel: "4,2 km",
      caption: "838 høydemeter og 4,25 km fra Byrkjenes, med det bratteste — 16,5 grader mellom 300 og 400 moh — nede i skogslia.",
    },
  },
  ranten: {
    slug: "ranten",
    intro:
      "532 høydemeter på 5,82 km fra Tempelseter til den taggete ryggen Th. Kittelsen malte som Soria Moria. Oppstigningen fra Raudmyra er slak — bratteste sammenhengende parti måler 19,6 grader — og sørsida ser slak ut de første hundre meterne fra varden. Så bryter den av i 47 til 60 grader, og det er den veien den merkede stien går ned.",
    ascent: [
      "Start på parkeringa ved Tempelseter, 910 moh, og følg den T-merkede og blåmerkede ruta over fossen i retning Høgevarde. Skogen slipper taket ved 938 moh, og de neste tre kilometerne er nesten flate: 4,0 grader fra 900 til 1000 moh over 1301 meter grunn, 4,6 fra 1000 til 1100 over 1304 meter, og 3,3 fra 1200 til 1300 over 1666.",
      "Stikrysset på Raudmyra ligger på 1229 moh, og navnet er ikke tilfeldig: Kartverket klasser både punktet på 1216 og punktet på 1229 moh som myr. Her tar du av til venstre, mot Gråfjell, og forlater Høgevarde-løypa.",
      "Nå kommer turen. Bandet fra 1300 til 1400 moh måler 10,8 grader over 566 meter grunn — det er halve stigningen på en drøy halv kilometer — og mellom 1354 og 1370 moh ligger bratteste sammenhengende parti, 19,6 grader.",
      "Det siste bandet, over 1400 moh, måler 5,7 grader over 120 meter grunn, og der står varden på 1416 moh. Toppen er en smal, taggete rygg, og profilen som gjør fjellet lett å kjenne igjen nedenfra er den samme profilen som gjør at det ikke er mye plass på den.",
    ],
    descent: [
      "Den slake veien ned er den du kom opp: østover mot Raudmyra, der flanken måler 13,3 grader i snitt over 500 meter. Nord, vest og nordvest er også slake — 10,4, 11,9 og 10,8 grader i snitt, med bratteste 60-metersvinduer på 19,6, 18,8 og 16,8 grader — men de fører deg vekk fra bilen.",
      "Den merkede stien går bratt sørover til Fetjenn på 990 moh, og som skilinje er det en helt annen tur enn oppstigningen — men den ser ikke slik ut fra toppen. Punktmålinger hver tretti meter rett sørover gir først en skulder: 1415,6, 1399,2, 1393,9 og 1395,5 moh, altså 28,6 grader det første steget og så noe som er flatt og til og med stiger litt. Der skulderen slutter, 120 meter ut, faller det 47,2 og 54,5 grader. På peiling 195, som er retningen til Fetjenn, er skulderen enda tydeligere — bakken stiger igjen på 90 meter — og bruddet måler 60,0 grader. Det er rennene randofolk.no mener når de kaller Ranten «en mer alpin topp med brattere nedkjøring» enn Høgevarde. Ta ikke bakken over bruddet som et mål på det som ligger under: kjør dem hvis dette er terreng du kjører til vanlig, og hvis varselet og snøen sier ja; ellers går du tilbake den veien du kom.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigningen fra Raudmyra er en jevn skråning: 10,8 grader i snitt fra 1300 til 1400 moh, og bratteste sammenhengende parti 19,6 grader mellom 1354 og 1370 moh. De første fire kilometerne fra Tempelseter holder under 6 grader. Ruta i seg selv er ikke problemet på dette fjellet.",
      },
      {
        title: "Terrenget utenfor",
        body: "Sørsida er problemet, og den er farligere enn tallene alene sier. Fra varden faller den 40,2 til 54,8 grader i 60-metersvinduene 90 til 170 meter ut, på alle peilinger fra 150 til 210 grader — hele sektoren fra sørøst til sørvest. Men de første hundre meterne er en skulder på rundt ti grader, som på peiling 195 til og med stiger igjen, så bruddet er ikke synlig fra der du står. Toppryggen er smal, og skavl bygger seg ut over den kanten i vestavind. Nord- og vestsida er det motsatte, 10 til 12 grader i snitt.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,197 L41,190 L60,181 L83,174 L106,171 L129,169 L153,164 L171,161 L199,152 L222,147 L250,137 L273,128 L296,118 L324,108 L352,96 L375,90 L394,89 L417,88 L440,87 L468,87 L487,75 L510,67 L529,60 L546,41 L566,25 L581,26 L600,18",
      startLabel: "910 moh",
      endLabel: "1416 moh",
      distanceLabel: "5,8 km",
      caption: "532 høydemeter og 5,82 km fra Tempelseter over stikrysset på Raudmyra, 1229 moh, med skoggrensa på 938 moh og all stigningen i de siste to kilometerne.",
    },
  },
  hogevarde: {
    slug: "hogevarde",
    intro:
      "598 høydemeter på 4,78 km fra Tempelseter, i en oppstaket og som regel oppkjørt løype. Ingen del av oppstigningen er bratt: bratteste sammenhengende parti måler 19,5 grader, mellom 1179 og 1195 moh, og bratteste hundremeteren, 1200 til 1300 moh, holder 11,8 grader i snitt. Det du planlegger etter her er været og østsida, ikke hellinga i sporet.",
    ascent: [
      "Start på parkeringa ved Tempelseter, 910 moh, og gå opp til høyre for skibakken. Løypa er stukket og som regel kjørt, og de første hundre høydemeterne er det slakeste på turen: bandet fra 900 til 1000 moh måler 3,9 grader over 1305 meter grunn.",
      "Over anlegget stiger det jevnt — 8,8 grader fra 1000 til 1100 moh og 7,8 fra 1100 til 1200 — og et sted der inne, mellom 1179 og 1195 moh, ligger bratteste sammenhengende parti på hele turen: 19,5 grader. Ingen av punktene Kartverket sampler langs ruta er klasset som skog. Du starter over skoggrensa og ser hvor du skal hele veien, og det er en fordel helt til sikten forsvinner. Merk at det er den nederste delen som er oppkjørt. Linja følger løypenettet tett de første 1,2 kilometerne og de siste 1,5, men mellom 1,5 og 3,7 km ut går den sin egen veg over ryggen — verst 572 meter fra nærmeste kartlagte spor, ved 1283 moh. Det som er kartlagt der er umerkte langrennsløyper, ikke en merket toppruta, så det er ikke noe spor å følge over ryggen.",
      "Fra ryggen på rundt 1190 moh svinger ruta nordøstover mot hytta. Bandet fra 1200 til 1300 moh er det bratteste på turen, 11,8 grader over 496 meter grunn, og over det flater det ut igjen: 7,7 grader fra 1300 til 1400.",
      "DNT-hytta Høgevarde ligger på 1397 moh, og toppen 560 meter lenger nordøst, på 1461. Det siste bandet, over 1400 moh, måler 3,5 grader over 810 meter grunn — flatt, og samtidig den mest værutsatte delen av turen. Gamle Høgevarde turisthytte har kafé i vinterferiene og påsken, og skilt nederst i bakken sier om den er åpen. Merk at linja går over Høgevardtjenn på 1378 moh på veg mot toppen — 68 meter på Tempelseter-ruta, opptil 60 meter fra land, og 45 meter på Norefjellstua-ruta, opptil 20 meter fra land. Det er et lite tjern, naturlig og uregulert, og begge linjene skjærer et hjørne av det.",
    ],
    descent: [
      "Ned samme veien, sørvestover. Det er den slake sida av fjellet, og målingene sier hvor slak: 7,1 grader i snitt mot vest og 8,6 mot sørvest over 500 meter, med bratteste 60-metersvindu på 25,6 og 23,8 grader. Den andre dokumenterte ruta, høyfjellsruta fra Norefjellstua over Norefjellsryggen, gir 827 høydemeter på 11,86 km og er en annen dag. Den følger løypenettet i endene, men går sin egen veg tre steder — verst 427 meter fra nærmeste kartlagte spor ved 1119 moh, og 317 og 364 meter unna over Norefjellsryggen ved 1315 og 1340 moh.",
      "Fristelsen er å ta av mot øst, mot Norefjell skisenter som er godt synlig fra varden. Det er ikke rett nedenfor: anlegget ligger 9,85 kilometer unna på peiling 148, altså sørøst. Å sette kursen dit fra toppen er å velge den bratteste sektoren på fjellet — øst måler 25 grader i snitt og bryter av i 41,5 grader 70 til 130 meter ut fra varden, nordøst gir 41,3, og sørøst, som er retningen mot anlegget, 51,2 grader i vinduet 420 til 480 meter ut. Toppryggen er ofte avblåst mens snøen ligger fin 200 meter lenger nede, og det er nettopp da linjevalget flyttes uten at noen bestemmer seg for det.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstaket og som regel oppkjørt løype i slakt terreng hele veien. Bratteste sammenhengende parti måler 19,5 grader og ligger mellom 1179 og 1195 moh; bratteste hundremeteren, 1200 til 1300 moh, holder 11,8 grader over 496 meter grunn. Staking er ikke kvisting — ut.no minner om at løypa tidlig i sesongen ikke alltid er supplert med kvist, og over skoggrensa er det ingenting annet å navigere etter.",
      },
      {
        title: "Terrenget utenfor",
        body: "Fjellet er slakt på tre kanter og bratt på én. Øst og nordøst under toppen måler 25 grader i snitt med 60-metersvinduer på 41,5 og 41,3 grader, 70 til 160 meter ut fra varden, og sørøst 51,2 grader i vinduet 420 til 480 meter ut. Vest, sørvest og nordvest holder 7,1 til 8,6 grader i snitt. Det er hele fjellet i én setning: gå og kjør på vestsida.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L23,198 L39,198 L62,188 L83,183 L102,179 L124,176 L144,170 L159,168 L181,165 L201,158 L226,145 L254,132 L277,127 L305,120 L330,107 L350,96 L373,83 L395,71 L416,60 L435,47 L454,36 L480,37 L503,36 L525,38 L545,45 L570,39 L593,22 L600,18",
      startLabel: "910 moh",
      endLabel: "1461 moh",
      distanceLabel: "4,8 km",
      caption: "598 høydemeter og 4,78 km fra Tempelseter, hele ruta over skoggrensa, med DNT-hytta på 1397 moh og toppen 560 meter lenger nordøst.",
    },
  },
  gygrastolen: {
    slug: "gygrastolen",
    intro:
      "1267 høydemeter fra 90 moh — fjord til topp på 5,96 km, med Folgefonna rett framfor deg på ryggen. Bratteste sammenhengende parti måler 36,0 grader, men det er et kort steg rett under toppen; ellers er det lengden og ikke hellinga som avgjør dagen.",
    ascent: [
      "Start der anleggsveien tar av oppover fra Ænes, 90 moh; kirka som rutebeskrivelsen nevner ligger på 41 moh nede ved fjorden. De første hundre høydemetrene går på 6,3 grader, og så tar veien fatt: 11,3 grader fra 100 til 200 moh og 12,9 fra 200 til 300.",
      "Følg stien videre mot Gygrastølvatnet på 492 moh. Bandet fra 400 til 500 moh er det slakeste på turen, 5,6 grader over 1035 meter grunn — det er flata rundt vatnet. Anleggsveien ender ved vatnet, og over det finnes det ingen kartlagt sti der linja går: den nærmeste ligger opptil 526 meter unna, ved 566 moh, så ryggen er ditt eget veivalg.",
      "Fra vatnet går du opp på selve ryggen og følger den. Skogen holder til 590 moh; over det er alt åpent. Stigningen er jevn og øker gradvis: 16,8 grader fra 600 til 700 moh, 19,4 fra 800 til 900 og 19,8 fra 1000 til 1100, som er bratteste hundremeteren. Bratteste sammenhengende parti, 36,0 grader mellom 1322 og 1345 moh, er det korte steget rett under toppen.",
      "Over 1300 moh legger ryggen seg nesten flat — 4,7 grader over 565 meter grunn — og fører fram til toppen på 1347 moh.",
    ],
    descent: [
      "Ned samme ryggen, nordover mot Gygrastølvatnet og videre ned anleggsveien til Ænes. Nederste delen er skogskjøring, og den er tung når snøen er bløt.",
      "Vanligste feil: å velge nordvestflanken fordi den er brattere og kortere. Den er et dokumentert alternativ, men den er skredterreng, og den er ikke den linja ruta går. Den andre er å tro at du får med deg begge toppene: mellom dem kreves lett klatring og sikringsutstyr, og normalruta går til hovedtoppen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "En lang rygg med jevn stigning: bratteste hundremeteren, 1000 til 1100 moh, måler 19,8 grader, og bratteste sammenhengende parti 36,0 grader mellom 1322 og 1345 moh. Ryggen er linja både opp og ned.",
      },
      {
        title: "Terrenget rundt",
        body: "Nordvestflanken er skredterreng og et brattere alternativ for dem som velger det med åpne øyne. Mellom hovedtoppen og nabotoppen kreves lett klatring og sikringsutstyr — det er ikke en forlengelse av skituren.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L28,195 L51,188 L73,180 L96,172 L123,163 L146,157 L173,151 L200,144 L224,142 L250,141 L282,136 L300,129 L327,118 L351,108 L370,100 L386,93 L404,83 L422,76 L437,70 L449,64 L467,54 L481,50 L501,39 L526,30 L549,24 L576,23 L595,19 L600,18",
      startLabel: "90 moh",
      endLabel: "1347 moh",
      distanceLabel: "6,0 km",
      caption: "1267 høydemeter og 5,96 km fra Ænes over Gygrastølvatnet, med skoggrensa på 590 moh og ryggen over 1300 moh på 4,7 grader.",
    },
  },
  mellomkollen: {
    slug: "mellomkollen",
    intro:
      "400 høydemeter på 4,13 km fra Skar: langs Maridalsveien over Skarselva, et flatt stykke langs vegen og sporene, og så skog hele vegen til Mellomkollen på 537 moh — den høyeste kollen i denne delen av Nordmarka. Bratteste sammenhengende parti er 21,9 grader mellom 300 og 317 moh, men det som gjør turen krevende er ikke hellinga: det er krattet, knausene og en nedkjøring kilden kaller «byksete».",
    ascent: [
      "Bussen stopper ved Skar utfartsparkering, og linja starter like ved, på 186 moh. Første del går ned: langs Maridalsveien og over Skarselva på Vaggesteinbrua, der vegen ligger på 160 moh, forbi Nedre Vaggestein og østover til Kroken på 183. Ut.no-sporet går fra parkeringa via Nedre Vaggestein og Kroken før det svinger nordover, men har bare en rett strek over elva; vegen over Vaggesteinbrua er der du faktisk kommer over.",
      "Fra Kroken går linja nordover. Bandet fra 100 til 200 moh måler 0,6 grader over 1353 meter grunn — vegen og flata — og fra 200 til 300 moh 6,7 grader over 857 meter, opp til Rollveien på 301 moh.",
      "Etter Rollveien begynner lia mot Jondalen, og herfra er det den samme rytmen til toppen: korte kneiker og flate partier. Bandet fra 300 til 400 moh måler 7,3 grader i snitt. Bandet fra 400 til 500 moh måler 6,6 grader. Snittet skjuler terrenget. Innenfor 50 meter av linja står knauser på 40 til 55 grader mange steder, og det bratteste 30-metersvinduet på selve linja, 21,9 grader, ligger mellom 300 og 317 moh; i lia over Jondalen er det 19,8 grader mellom 491 og 507 moh.",
      "Linja passerer 270 meter vest for Midtkollen og går rett nord mot toppen. På det siste stykket går den forbi et stup OpenStreetMap kartfester 49 meter fra linja, og midten av Svartputten ligger 205 meter øst. Toppen, 537 moh, er skogkledd; ut.no beskriver utsikten derfra mot Lillomarka, Maridalsvannet og Oslofjorden i det fjerne.",
    ],
    descent: [
      "Nedkjøringa er vanskeligere enn oppturen, og kilden sier det rett ut: «Nedkjøringen kan fort bli ganske teknisk og byksete om man ikke har sett seg ut noen åpne felt på forkant.» Rådet er å se etter åpne skogsfelt på veg opp, og ellers følge sommerstiene — kilden nevner den blåmerkede ned til Øyungen, som tar deg til et annet sted enn bussen. Ut.no-sporet selv kjører samme side ned til 461 moh, går opp igjen én gang, og slutter under toppen.",
      "Mellomkollen er slak på toppen — 3,3 til 11,6 grader i snitt på alle sider over 500 meter — men brattest mot sørvest, 36,2 grader 210 til 270 meter ut. Kilden advarer mot stupene på sørsida av Gaupekollen: de måler 38,7 grader 240 til 300 meter sør for den toppen, 632 meter nordøst for linja. Kollene ligner hverandre, og «plutselig står du på Mellomkollen når du trodde du var på Midtkollen» — ha kart og kompass.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti på linja er 21,9 grader mellom 300 og 317 moh, og bratteste hundremeteren er 300 til 400 moh med 7,3 grader. Etter jordene ved Kroken er det skog hele vegen, til og med 537 moh.",
      },
      {
        title: "Terrenget utenfor",
        body: "Brattkantene her er korte, ikke store fjellsider: knausene langs linja måler 40 til 55 grader innenfor 50 meter, og et lite flak i en slik kant ender i kratt og stein. Stupene på sørsida av Gaupekollen, 38,7 grader, er det kilden selv advarer mot. Elver ligger under snøen, og kilden nevner både elver og tette kratt som hindringer.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Oslo på varsom.no. Oslo er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke at terrenget er uten fare. Toppen ligger i Mellomkollen naturreservat — «et fredet naturreservat og en skal derfor ta ekstra hensyn», skriver kilden. Snøen i Oslomarka kommer og går; kilden fører turen fra desember til mars og lister hjelm, spade, kart, kompass og hodelykt.",
      },
    ],
    elevationProfile: {
      path: "M0,187 L20,190 L46,195 L66,198 L86,192 L105,191 L125,188 L151,184 L177,182 L199,180 L216,175 L236,171 L255,160 L275,145 L298,134 L315,132 L334,130 L353,130 L372,132 L386,124 L399,114 L425,93 L445,81 L470,69 L490,56 L507,59 L526,47 L548,42 L566,32 L585,22 L600,18",
      startLabel: "186 moh",
      endLabel: "537 moh",
      distanceLabel: "4,1 km",
      caption: "400 høydemeter og 4,13 km fra Skar, i skog fra Kroken til toppen, med bratteste hundremeteren mellom 300 og 400 moh.",
    },
  },
  juklavasstinden: {
    slug: "juklavasstinden",
    intro:
      "1343 høydemeter på 7,42 km fra Myrdalsvatnet — og 349 av dem blir gitt fra seg underveis. Ruta går opp på ryggen over Omnetjørnene, øst ned mot Møsetjørna og opp nordryggen til en topp som bærer skavl.",
    ascent: [
      "Start ved veien ved Myrdalsvatnet, 367 moh, i Uskedalen. Følg veien litt tilbake til en traktorvei og følg denne til Nipelva kommer til syne. Skogen holder til 668 moh.",
      "Følg elva oppover til ryggen over Omnatjørnane — registeret skriver dem slik, ikke Omnetjørnene, og «over» er bare halve historien: linja går 269 meter rett over vatnene på 1066 moh, opptil 100 meter fra land. De ligger på selve ryggen, og de er naturlige. Det er her stigningen står: 21,9 grader fra 500 til 600 moh og 19,0 fra 600 til 700, med bratteste sammenhengende parti på 30,8 grader mellom 995 og 1022 moh. Ryggen topper seg på 1033 moh.",
      "Derfra holder du østover mot Møsetjørnene med Juklavasstinden foran deg. Terrenget faller til 755 moh ved vatnet — Fri Flyts 988 høydemeter er toppen minus starten, mens den rutede linja samler 1341 fordi den må ned hit først.",
      "Fra bollen går du opp den nordlige ryggen til topps; det er den slakeste av de dokumenterte linjene på fjellet — den vestlige renna ved siden av holder 40 grader. Bandet fra 1100 til 1200 moh måler 20,5 grader, 1200 til 1300 moh 17,8 og 1300 til 1400 moh 21,5, med varden på 1361 moh.",
    ],
    descent: [
      "Ned nordryggen, over bollen ved Møsetjørna og tilbake over ryggen til Nipelva og Myrdalsvatnet. Fallretninga er nordvest, og turen har en kneik igjen på vei hjem — det er den samme ryggen du kom over.",
      "Vanligste feil: å ta den vestlige renna ned. Den er 40 grader og et eget valg; nordryggen er den linja rutebeskrivelsen peker på. Den andre er toppskavlen — turen kan kreve stegjern og isøks, og skavlen er grunnen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "To stigninger med en nedstigning imellom. Bratteste sammenhengende parti måler 30,8 grader mellom 995 og 1022 moh, og bandet fra 1300 til 1400 moh 21,5 grader. Nordryggen er den slakeste av de dokumenterte linjene — 20,5 grader mot 40 i den vestlige renna — og den er den korridoren følger.",
      },
      {
        title: "Terrenget rundt",
        body: "Toppen bærer skavl. Den vestlige nedkjøringa holder 40 grader og er et valg for seg. Bollen mellom ryggen og nordryggen er der du mister høyde på vei opp — og der du må hente den inn igjen på vei hjem, med den tidsbruken det gir.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,194 L55,188 L80,181 L103,178 L124,166 L142,150 L159,137 L177,122 L196,108 L218,94 L232,82 L254,70 L283,72 L312,69 L341,92 L367,107 L392,119 L418,129 L439,128 L458,126 L483,106 L499,93 L520,80 L537,67 L555,54 L568,43 L589,28 L600,18",
      startLabel: "367 moh",
      endLabel: "1361 moh",
      distanceLabel: "7,4 km",
      caption: "1343 høydemeter og 7,42 km fra Myrdalsvatnet over ryggen på 1033 moh og Møsetjørna på 755, med nordryggen fra 865 moh til varden.",
    },
  },
  melderskin: {
    slug: "melderskin",
    intro:
      "Rosendalsalpenes klassiker — 1272 høydemeter fra gårdstunet på Kletta til varden, uten en meter tilbake underveis. En lang dag for den som vil ha hele fjellet fra bunnen av.",
    ascent: [
      "Fra parkeringen ved Kletta, 154 moh, følger du veien 300 meter før stien svinger opp mot Skarshaug. Første strekket går over innmark og videre inn i blandingsskogen; sporet er tydelig, og du stiger jevnt gjennom skogen til rundt 618 moh.",
      "Over tregrensa reiser lia seg. Mellom 600 og 700 moh holder den 22,6° i snitt over hundre høydemeter, og det bratteste hundremeterspennet på turen kommer like over: 23,9° mellom 800 og 900 moh, med 22,2° mellom 900 og 1000. Begge er noe du vil ha unnagjort tidlig på dagen. Toppen av bakken er Skarshaug, 806 moh, halvveis til Melderskin.",
      "Nordøstover flater det ut i Rindane, de små ryggene og søkkene du siger gjennom mot Holo. Holo er flata på 1211 moh; Kartverket klassifiserer den som myr, og det er det ene stedet på ruta der linja flater helt ut. Her svinger den nordøst før den vender tilbake østover — den svingen holder deg på hylla og utenfor den bratte sør- og sørvestsiden rett under toppen.",
      "Siste stigningen fra Holo til varden er 215 høydemeter på ni hundre meter: 13° i snitt, 25° der den er brattest. Øverst ligger skavlene langs toppkanten, og er snøen avblåst og hard, tar du på deg stegjern og har isøksa i hånda de siste meterne.",
    ],
    descent: [
      "Ned igjen følger du oppstigningen: vestover fra varden til Holo, så sørvest gjennom Rindane og over Skarshaug, og til slutt ned lia og gjennom skogen til Kletta.",
      "Vanligste feil: å slippe seg rett ned fra toppen i stedet for å gå tilbake til Holo først. Fallinja fra varden går sørover, og der stuper det — sørflanken snitter 44° over de tre første hundre metrene, med et bergband på 60° i de øverste sytti. Hold vestover til du står på hylla ved Holo, og gå ned oppstigningssporet derfra.",
      "Under Skarshaug møter du bakken mellom 600 og 700 moh igjen, nå vestvendt og med sol på seg fra midt på dagen. Kjør den mens snøen fortsatt bærer; senere blir den tung og våt helt ned i skogen.",
      "Fri Flyt går ikke opp Melderskin fra Kletta i det hele tatt. Startstedet deres er Myrdalsvatnet på 367 moh — det samme som Juklavasstinden går fra — og ruta følger grusveien litt tilbake til en traktorvei på 430, videre til Nipeelva på 525, opp langs elva og så den tydelige ryggen over Omnetjørnene på 1033 til Omnen på 1155 og toppryggen på 1204. 1104 høydemeter på 5,13 km, mot 1273 på 4,90 km fra Kletta: kortere klatring, lengre linje, og 1,88 km med skog mot 1,76 — furua slipper på 659 moh her mot 618 der. Beltet fra 600 til 700 moh måler 21,8 grader og det bratteste 30-metersvinduet 39,7 grader mellom 1317 og 1345 — brattere enn de 36,5 normalruta måler. Omnetjørnene ligger øst for ryggen — til venstre når du går sørover, som kilden sier — og linja går ikke over dem. «Ta med stegjern og øks» står i faktaboksen til denne ruta, ikke til den andre.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Den bratteste hundremeteren ligger mellom 800 og 900 moh og holder 23,9°; bratteste enkeltsteg på linja måler 36,5°, mellom 848 og 874 moh. Linja selv passerer aldri 30°, men den ligger i lia du må gjennom uansett, og lia er brattere enn sporet gjennom den. Ta den vurderingen nede ved skogkanten, mens det ikke koster deg noe å snu.",
      },
      {
        title: "Terrenget rundt",
        body: "Det bratte ligger sør for toppen, ikke vest. Sørflanken rett under varden snitter 44° over de tre første hundre metrene og har et bergband på 60° i de øverste sytti; sørøstsiden ligger på 33° med 59° i det bratteste partiet. Vestsiden, der ruta går, er blant det slakeste på fjellet — 17° i snitt. Men linja rett fra Rindane mot varden, den ruta går utenom, treffer et trinn på 42° hundre meter ut fra toppen, og det er hele grunnen til at svingen ved Holo finnes. Nordsiden har rennene: Midtrenna på 45° og Høyrenna på 40°, og Nordvestrenna, som friflyt kaller en kjent skredbane på seinvinteren. Målt fra toppen faller nord- og nordøstflanken 30° i snitt med 44–50° i de bratteste partiene. Det er en annen tur enn denne, og den krever isøks og stegjern.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottaker, søkestang og spade, og stegjern og isøks for toppartiet når snøen er hard.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L33,195 L61,191 L77,187 L100,181 L122,175 L139,168 L156,161 L171,153 L182,148 L199,140 L221,130 L237,123 L253,116 L271,109 L285,101 L298,95 L315,87 L337,77 L355,69 L375,61 L403,57 L430,53 L458,49 L486,48 L513,44 L535,38 L552,32 L568,25 L596,18 L600,18",
      startLabel: "154 moh",
      endLabel: "1426 moh",
      distanceLabel: "4,9 km",
      caption: "154 til 1426 moh på 4,9 km. Bratteste hundremeteren ligger mellom 900 og 1000, over Skarshaug.",
    },
  },
  englafjell: {
    slug: "englafjell",
    intro:
      "1237 høydemeter og 8,64 km fra Musland i Uskedalen — et skikkelig vestlandsfjell der turen er større enn tallene: Fri Flyt kaller det vanskelig, med skredutsatt terreng, vanskelig navigering og utglidningsfare som faremoment, og 35 grader på enkleste veien. Selve linja måler snillere — bratteste hundremetersbeltet 21,1 grader mellom 300 og 400 moh, bratteste sammenhengende parti 30,1 — men den gir tilbake 185 høydemeter underveis, bærer skia i deler av skogen, og toppryggen har skavler ut over Limomnen. Grad 3 på kortet er summen.",
    ascent: [
      "Kjør til Uskedalen og ta av mot Musland; parker ved første gården — tunet ligger på 148 moh, og vær varsom med traktortrafikken, slik kilden ber om. Traktorveien fortsetter nordvestover, og den merkede stien tar til venstre inn i skogen — veien og stinettet er kartlagt, og første stykket bærer du gjerne skia på godt opptråkket sti.",
      "Stien krysser dalen — botnen leser 140 til 183 moh — før flanken mot Såta tar til. Det er dalens pris: mesteparten av de 185 høydemeterne du gir fra deg, ligger her og i bulkene på ryggen videre. Skogen slutter på 526 moh etter Kartverkets klasser, og flanken opp mot Såta holder 507 og 625 på vei til knausen på 651.",
      "Fra Såta går du sør opp den bratte ryggen, slik kilden sier — og ryggen leverer: 869, 1032, 1126 og 1184 moh i jevn, bratt stigning, med 29,3 grader som bratteste sammenhengende parti på selve ryggen, mellom 765 og 788 moh — turens bratteste, 30,1 grader, ligger lenger nede, i flanken opp fra dalkryssinga mellom 312 og 330 moh. Dette er navigasjonsstrekket i tåke: ryggen er logisk i godt vær og diffus i flatt lys.",
      "Toppen står på 1200 moh. Hele veien langs toppryggen: hold avstand til østkanten — skavlene henger ut over Limomnen, botnen på 889 rett under, og nordøstflanken faller 55,5 grader på det bratteste bare 200–260 m fra varden.",
    ],
    descent: [
      "Normalveien ned er ryggen tilbake mot Såta, der de bratte sidene byr på nedkjøring — samme linjevalgsdisiplin som opp, med skavlkanten mot Limomnen som den faste regelen: kjør vest for kammen.",
      "Fra Hjorteklett — kildens skrivemåte; registeret fører knausen som Hjortaklett (Ås, 59.91905/5.85858), 460 m nord for Såta — må skia vanligvis bæres et stykke. Ved gode snøforhold nevner kilden en flott nedkjøring langs bekken øst for Såta; den er variant, ikke normalvei, og «ved gode snøforhold» er vilkåret som står ved.",
      "Så dalen tilbake: kryssinga koster deg de siste motbakkene hjem til stien og traktorveien ned til Musland. Utglidningsfaren kilden nevner hører dette strekket til — bratt, tett vestlandsskog med hard snø er sitt eget faremoment.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts faremoment er «skredutsatt terreng, vanskelig navigering og utglidningsfare», og alle tre er målbare på denne linja: flanken mot Såta og sørryggen holder 21 til 30 grader med brattere sider tett på, ryggen er diffus i flatt lys, og skogstykkene bærer hard snø over bratt botn. 35-graderne på enkleste veien ligger i flankevalg nær toppen — sporet kan legges slakere, og målinga viser at det går.",
      },
      {
        title: "Skavlene mot Limomnen",
        body: "Toppryggen bærer skavler ut over østsida, der Limomnen ligger 300 høydemeter under. Nordøstflanken faller 55,5 grader på det bratteste 200–260 m fra varden og nordflanken 49,7 bare 100–160 m ut. Kanten er lenger ute enn den ser ut til i fokk — hold vest for kammen hele toppstrekket.",
      },
      {
        title: "Før du går",
        body: "Englafjell ligger i varslingsregionen Hordalandskysten, en B-region uten daglig skredvarsel — nærmeste A-region med daglig varsel er Hardanger, øst for Folgefonna. Det er en grunn til mer varsomhet, ikke mindre: vurderinga er din. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre Hardanger-turer, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,194 L25,197 L53,198 L78,198 L100,191 L123,195 L152,198 L178,199 L200,199 L221,197 L246,180 L262,166 L278,151 L293,139 L316,124 L341,114 L367,108 L387,112 L407,109 L428,96 L447,81 L465,66 L484,55 L512,41 L534,38 L559,31 L584,21 L600,18",
      startLabel: "148 moh",
      endLabel: "1200 moh",
      distanceLabel: "8,6 km",
      caption: "1237 høydemeter og 8,64 km fra Musland — over dalen, opp til Såta, og den bratte sørryggen med skavler mot Limomnen.",
    },
  },
  stavsnuten: {
    slug: "stavsnuten",
    intro:
      "612 høydemeter på 3,60 km fra Holbubekk: bekkedalen østover inn Holebudalen, til venstre inn i bollen mellom undertoppene 1567 og 1603, og opp på platået inn til varden på 1661 moh. Bratteste bandet er 20,2 grader mellom 1400 og 1500 moh, og bratteste sammenhengende parti er 23,8 grader mellom 1507 og 1527. Ut.no kaller den «kanskje den best kjente, og den mest kjørte toppturen i nærområdet rundt Haukeliseter» — og bollen den går gjennom, er omkranset av brattere sider. Varden står på kanten av sørsida.",
    ascent: [
      "Start på parkeringa ved Holbubekk, 1054 moh, der E134 krysser bekken på bru, 1 km vest for Haukelitunnelen. Fri Flyt: «Parker ved parkeringsplass noen hundre meter etter tunellen ved en bekkedal og en bro.» Ut.no starter sporet ved Midtlæger, ved tunnelmunningen; de to linjene møtes inne i Holebudalen. Det er snaufjell fra første meter.",
      "Følg bekkedalen østover. Det er slakt: bandet fra 1100 til 1200 moh måler 5,2 grader over 1080 meter grunn, og etter 1,27 km er du inne i Holebudalen på 1141 moh. Fri Flyt ber deg holde høyden til du ser Stavsnuten og bollen; ut.no: «Anmarsjen går inn Holebudalen i slakt terreng før man dreier mot venstre.»",
      "Linja dreier nordover inn mot bollen ved 1256 moh, 2,03 km fra start. Ut.no: «Normalruten går inn \"bollen\" og fortsetter oppover midt mellom de bratte sidene. Hold til venstre for undertoppen (1603 m.o.h.) under oppstigning for mest behagelig og sikker tur da det mot høyre er helninger i overkant av 30 grader som kan være skredutsatt.» Linja går mellom de to undertoppene: 1567 ligger 408 meter vest for den, og 1603 ligger 279 meter øst. Det er her turen er bratt — 18,7 grader fra 1300 til 1400 moh og 20,2 fra 1400 til 1500. Bakken under sporet er aldri 35 grader eller brattere i 15 meter sammenhengende, men 35 til 62 meter fra det står celler på 40 til 46 grader mellom 1383 og 1540 moh. Ut.no advarer om at du her går gjennom utløpssoner, men at det er mulig å unngå løsneområdene.",
      "Over 1500 moh slakker det av — 12,6 grader i bandet fra 1500 til 1600, med bratteste parti på 23,8 grader mellom 1507 og 1527 — og ved 1608 moh, 3,25 km fra start, er du oppe på platået. Ut.no: «Det kan virke som man er på toppunktet når man kommer opp på platået, men herfra går det slakt innover enda et stykke mot toppen som er markert med en varde (1661 m.o.h.).» Varden er 350 meter lenger inne. Den står på kanten av sørsida: mot sør og sørsørvest faller bakken 38,4 til 43,3 grader 10 til 90 meter fra varden, og ved 1640 moh står celler på 53,2 grader 61 meter sørøst for linja. Linja går inn langs nordsida av platået, slik ut.no-sporet gjør — hold deg der, og i dårlig sikt anbefaler ut.no å stoppe på platået.",
    ],
    descent: [
      "Fri Flyt: «Den opplagte turen ned er veien du gikk opp. Her får du muligheter til dropp og hopp fra steiner, og du sklir helt ned til bilen igjen.» Ut.no: «Mellom undertoppene (1567 m.o.h. og 1603 m.o.h.) er det mulighet for store svinger, samt dropp og hopp fra steiner.» Husk anmarsjen: ut.no ber deg «beholde litt fart på vei ned Holebudalen igjen».",
      "Fri Flyt har to nedkjøringer til. Flanken fra venstretoppen, 1567, er «jevn og bratt», og «Hvis du ikke er nøye med veivalget kan det bli brattere enn 35 grader» — sørøst fra 1567 måler den 41,4 grader i bratteste vindu. Nordvestflanken bak Stavsnuten har små renner og flanker, men om vinteren må du gå opp igjen for å komme til bilen. Fra toppen måler sørsida 46,9 grader 410 til 470 meter ut og nordøstsida 31,8 grader 420 til 480 meter ut; vest og nordvest er slake, 9,9 og 9,3 grader i snitt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste bandet er 20,2 grader mellom 1400 og 1500 moh, i bollen, og bratteste sammenhengende parti 23,8 grader mellom 1507 og 1527. Fri Flyt oppgir 30 grader som bratteste punkt og graderer turen «Lett»; ut.no kaller den krevende. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter.",
      },
      {
        title: "Terrenget utenfor",
        body: "Ut.no: til høyre for 1603 er det helninger over 30 grader som kan være skredutsatt, og i bollen går du gjennom utløpssoner. Sørsida av 1603 måler 51,1 grader og sørvestsida 45,7 i bratteste vindu. Sørsida av toppen begynner ved varden, 38,4 til 43,3 grader de første 90 meterne. Fri Flyt: ved østlig vind kan Stavsnuten bli litt avblåst, og for å nå begge toppene «kreves det lett klatring og sikringsutstyr mellom toppene».",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Hardanger er en A-region og varsles daglig i sesongen. Starten ligger ved E134 over Haukelifjell; sjekk vegmeldingene før du kjører. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,199 L46,195 L68,191 L91,187 L112,184 L136,178 L159,178 L181,175 L211,174 L226,173 L256,167 L279,156 L301,148 L324,143 L346,138 L369,126 L391,113 L410,101 L421,94 L444,79 L459,69 L474,58 L489,50 L512,40 L530,39 L549,32 L565,24 L587,21 L600,18",
      startLabel: "1054 moh",
      endLabel: "1661 moh",
      distanceLabel: "3,6 km",
      caption: "612 høydemeter og 3,60 km fra Holbubekk, med Holebudalen på 1141 moh, bollen fra 1256 og bratteste bandet mellom 1400 og 1500.",
    },
  },
  "vesle-nup": {
    slug: "vesle-nup",
    intro:
      "595 høydemeter på 5,93 km fra Ulevå: bekkedalen opp til flata ved 1200, sørøst forbi punkt 1206, opp skaret mellom Vesle Nup og topp 1469, og ryggen østover til varden på 1510 moh. Det er slakt nesten hele veien — bratteste bandet er 7,8 grader mellom 1400 og 1500 moh, og bratteste sammenhengende parti er en kort kneik ned i søkket sørøst for punkt 1206 — 27,1 grader mellom 1197 og 1179 moh — og Fri Flyt kaller den «toppen for deg som er som fersk på topptur og ønsker en rolig start».",
    ascent: [
      "Start på parkeringa ved Ulevå, 982 moh, ved E134 vest for Haukeliseter fjellstue. Fri Flyt: «Parker langs veien ved Ulevå, 2,5 km før Haukeliseter fjellstue når du kommer fra vest. Følg bekkedalen oppover til det flater ut ved 1200 høydemeter. Nå ser du toppen.» Ut.no beskriver samme linje som sin rute C, og to ruter til fra fjellstua som møter denne nordvest for Loftsdokktjønn.",
      "Bekkedalen stiger jevnt — 6,2 grader i bandet fra 1000 til 1100 moh — og etter 1,75 km er du på flata, 1171 moh. Herfra ser du Vesle Nup i nordøst. Bandet fra 1100 til 1200 moh er 2002 meter grunn på 3,1 grader, nesten flatt. Ut.no: «Forsett i retning mot toppen mellom punkt 1206 og Loftdokkstjønn.» Linja går sør for 1206 og passerer 79 meter sørøst for punktet ved 2,61 km.",
      "Mellom 1206 og Loftsdokktjønn gir linja fra seg 33 høydemeter, fra 1201 moh ved 2,61 km ned til 1168 ved 2,91 km — det bratteste partiet på turen, 27,1 grader mellom 1197 og 1179, er på vei ned hit — før den svinger nordover langs Ålmannvegen, stien fra fjellstua, mot skaret. Bakken under sporet er bratt bare ett sted, 17 meter på 35 grader eller mer ved 1190–1198 moh. Skaret mellom Vesle Nup og topp 1469 når du på 1352 moh etter 4,44 km; topp 1469 ligger 727 meter nordvest for linja.",
      "Ut.no: «Her tar du av til høyre og følger fjellryggen østover omtrent 1 km til selve toppen.» Ryggen er 1,48 km fra skaret til varden. Linja passerer 100 meter sørvest for topp 1393 og stiger slakt — 5,6 grader fra 1300 til 1400 moh og 7,8 fra 1400 til 1500. Det siste stykket opp mot varden er det bratteste på ryggen.",
    ],
    descent: [
      "Fri Flyt: «Kjør ned den første flanken. Hold høyden etter dette slik at du ikke må gå over flaten. Kjør ned bekkedalen mot bilen.» Ut.no viser til rute C som den med «mest sammenhengende nedkjøring for deg som går på toppturski».",
      "Toppen er spiss, og den faller bratt mot nord og øst: 52,5 grader 30 til 90 meter ut mot nord, 58,2 og 57,1 grader 10 til 70 meter ut mot nordøst og øst, 49,8 mot sørøst. Ryggen du kom opp, mot vest, er den slake siden — 10,4 grader i snitt over 500 meter.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 27,1 grader mellom 1197 og 1179 moh, en kort kneik ned i søkket sørøst for 1206, og bratteste bandet 7,8 grader fra 1400 til 1500. Bakken under sporet er 35 grader eller brattere bare i ett strekk på 17 meter, ved 1190–1198 moh. Fri Flyt oppgir 25 grader som bratteste punkt og graderer turen «Lett».",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppen faller 49,8 til 58,2 grader mot nord, nordøst, øst og sørøst like under varden; hold deg på ryggen fra vest. Resten av turen går over snaufjell på høyfjellsplatået helt sør på Hardangervidda, uten ly og med få landemerker, og i skodde er det navigasjonen som er det vanskelige. Fri Flyt: «Det er en veldig populær tur på fjellski, men så lenge det ikke er snorkelføre gir den en flott opplevelse på randoutstyr også.»",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Vest-Telemark er en A-region og varsles daglig i sesongen. Starten ligger ved E134 over Haukelifjell; sjekk vegmeldingene før du kjører. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,195 L50,190 L68,183 L91,181 L109,173 L127,162 L155,147 L173,136 L191,132 L209,131 L228,127 L242,126 L264,125 L281,131 L297,136 L317,129 L337,127 L355,122 L373,117 L396,107 L415,94 L437,80 L456,70 L478,70 L501,69 L525,53 L547,44 L570,35 L588,24 L600,18",
      startLabel: "982 moh",
      endLabel: "1510 moh",
      distanceLabel: "5,9 km",
      caption: "595 høydemeter og 5,93 km fra Ulevå, med flata ved 1171 moh, skaret på 1352 og bratteste bandet under toppen.",
    },
  },
  gaustatoppen: {
    slug: "gaustatoppen",
    intro:
      "Sør-Norges mest markante topp, og en av de snilleste å gå på ski: 973 høydemeter fra Langefonn, og ikke et steg over 25° på hele oppstigningen.",
    ascent: [
      "Fra parkeringen ved Langefonn turisthytte, 922 moh, følger du den vinterstengte veien mot Stavsro. Etter 850 meter står du ved Svineroisetra, 1021 moh — det er kilometeren beskrivelsene snakker om. Bjørkebeltet slipper taket rundt 970 moh, og derfra er alt åpent fjell. Østryggen kan også nås fra Stavsro med 706 høydemeter, men veien dit er vinterstengt.",
      "Ved setra tar du av veien svakt til høyre, sørvest, og setter kursen mot det laveste punktet på Himmelranden — toppen av Langefonn, 1455 moh. Ikke gå rett opp mot varden herfra. Fallinja fra Svineroisetra rett mot toppen holder 35–37° i øverste tredjedel; traversen mot Langefonn stiger jevnt på 12–16° og passerer aldri 25°, og det er den linja denne ruta følger.",
      "Fra det laveste punktet vender du vest-nordvest og følger eggen. Stigningen er jevn: den bratteste hundremeteren på hele turen ligger mellom 1700 og 1800 moh og måler 17,5°, og bratteste enkeltsteg er 24,0°. Underveis kommer du inn på sommerstien fra Stavsro.",
      "På 1831 moh går du ut på toppflata ved Gaustatoppen turisthytte, og derfra er det vel fem hundre meter nordvestover over blokkmark til varden. Flata er åpen og steinete og gir lite å styre etter; i dårlig sikt er hytta holdepunktet du navigerer på, både på vei opp og på vei ned.",
    ],
    descent: [
      "Ned igjen følger du sporet ditt: øst-sørøst langs eggen til det laveste punktet på Himmelranden, så ned flanken mot nord-nordøst til Svineroisetra, og veien tilbake til Langefonn.",
      "Vanligste feil: å slippe seg rett ned fra toppflata mot Svineroisetra i stedet for å følge eggen tilbake til det lave punktet først. Nordøstflanken rett under varden snitter 35° over de første fire hundre metrene og har 46° i det bratteste partiet — det er de samme tallene fallinja fra Svineroisetra gir i øverste tredjedel. Flanken ned fra eggen ved 1455 er en helt annen sak: 16–21°. Hold eggen til du står på 1455, så tar du flanken derfra.",
      "De sju rennene østover fra toppryggen er noe annet. Friflyt oppgir et snitt like under 40°, og målt fra varden faller østnordøstflanken 31° i snitt over åtte hundre meter med 45° i det bratteste partiet. Friflyt skriver rett ut at rennene kan være skredutsatte, og at flere skikjørere har mistet livet i skred på Gaustatoppen. Kjører du dem, traverserer du sørover etter utløpet, tilbake til det første platået du kom opp på, og ned gjennom bjørkebeltet til Svineroisetra.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja fra Langefonn holder seg under 25° hele veien til varden: bratteste enkeltsteg måler 24,0°, og den bratteste hundremeteren, mellom 1700 og 1800 moh, holder 17,5°. Selve oppstigningen er lite skredterreng. Det som flytter regnestykket er vinden — den blåser eggen bar og legger snøen i rennene på østsiden.",
      },
      {
        title: "Terrenget rundt",
        body: "Tre steder ligger utenfor ruta og skal bli der. Østsiden av topptårnet med de sju rennene, der skred har tatt liv. Nordøstflanken rett under varden, 35° i snitt over fire hundre meter og 46° på det bratteste — det er fallinja mot Svineroisetra, og den du havner i om du slipper deg rett ned fra toppflata. Og nordvestsiden mot Rjukan: øverst er den slak, 14° de første fire hundre metrene, men den fortsetter nær 1600 høydemeter ned i dalen — 1878 til 284 moh på 3,6 km — og bratner til over 50° på veien. Det er slakheten øverst som er fella.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,195 L45,190 L61,187 L86,184 L110,179 L135,174 L165,163 L190,154 L214,147 L232,143 L257,136 L275,129 L292,122 L307,115 L330,108 L355,97 L373,90 L397,79 L422,69 L440,62 L465,52 L483,46 L502,37 L520,28 L544,23 L568,22 L593,20 L600,18",
      startLabel: "922 moh",
      endLabel: "1883 moh",
      distanceLabel: "4,4 km",
      caption: "922 til 1882 moh på 4,42 km. Bratteste hundremeteren måler 15,8°, og ingenting på linja passerer 25°.",
    },
  },
  heddersfjell: {
    slug: "heddersfjell",
    intro:
      "406 høydemeter på 5,14 km fra Gaustabanen: et stykke langs skisporet, nesten to kilometer flatt over isen på Heddersvatn, og 325 høydemeter opp vestsida til Blånipa, toppen av Heddersfjell på 1462 moh. Bratteste sammenhengende parti er 21,7 grader mellom 1169 og 1187 moh, i kneika rett opp fra vatnet — og det er der kilden ber deg finne fram Varsom-appen.",
    ascent: [
      "Start på gratisparkeringa ved Gaustabanen, 1132 moh, 170 meter øst for nedre stasjon. Turen begynner med å gå ned: 49 høydemeter til skisporet på 1083 moh, som du følger sørøstover opp til 1160 moh på flata vest for Heddersvatn. Det er sporet kilden mener med «følge skisporet et stykke og knekke ned til vannet».",
      "Fra sporet tar linja av ned til vestenden av Heddersvatn på 1137 moh, og så går den på isen: 1846 meter flatt og opptil 213 meter fra land, forbi odden fra sørbreidda, som linja passerer 202 meter nord for. Heddersvatn er et naturlig vatn, ikke et regulert magasin, og kilden går over det — men det betyr at isen må bære, og det er din vurdering den dagen, ikke kartets.",
      "Etter odden begynner stigningen, fra nordøstbreidda på 1143 moh. Den første kneika er den bratteste på turen: 21,7 grader mellom 1169 og 1187 moh, og terrenget på begge sider er brattere enn linja — innenfor 50 meter måler det 35 til 39 grader, både over og under deg, mellom 1159 og 1216 moh. Det er det nærmeste terrengmodellen kommer kildens «et parti der som kan være utsatt». Kilden sier ikke nøyaktig hvor partiet er.",
      "Over kneika går det i trinn: bandet fra 1200 til 1300 moh måler 11,6 grader, og fra 1300 til 1400 moh 16,6 grader over 378 meter grunn, som er det bratteste bandet på turen. Toppkjegla er brattere enn ruta på flere sider — 41 til 45 grader 23 til 48 meter fra linja over 1375 moh, mot sør nederst og mot vest og sørvest mellom 1428 og 1440 moh — så hold linja. Den kommer opp på toppen fra nord. Blånipa står på 1462 moh, med Gaustatoppen i vest-nordvest.",
    ],
    descent: [
      "Kilden kjører ned samme veg og skriver: «Husk hvor du gikk opp og pass deg for området som er utsatt for rasfare.» Det er ned mot Heddersvatn med Gaustatoppen foran deg. Rett vest fra toppen måler terrenget 18,7 grader i snitt over 700 meter, med 29,5 grader som bratteste 60-metersvindu, 60 til 120 meter ut — det er fjellsida ved sida av linja, ikke linja selv. Kneika ned mot isen er den samme som på veg opp, med det samme brattere terrenget på sidene.",
      "Ikke ta snarveien sørvestover. Den sida er hamaren ned mot Heddersvatn der Hulderhola ligger, 429 meter sør for linja — 46,9 grader i bratteste vindu, 520 til 580 meter ut fra toppen. Fra vatnet er det samme veg tilbake over isen og opp til sporet, og de 76 høydemeterne du tapte på veg inn, går du opp igjen på veg ut.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 21,7 grader mellom 1169 og 1187 moh, i den første kneika opp fra isen, og bratteste hundremeteren er 1300 til 1400 moh med 16,6 grader. Linja selv er ikke bratt. Det er terrenget rett ved sida av den som er det.",
      },
      {
        title: "Terrenget utenfor",
        body: "Kilden ber deg finne fram Varsom-appen der stigningen begynner, etter odden, og velge partiet du går opp etter forholdene. Terrengmodellen viser hvorfor: i kneika mellom 1159 og 1216 moh måler terrenget 35 til 39 grader innenfor 50 meter på begge sider av linja, og 94 meter over linja står en knaus på 59 grader. Sørvestsida er hamaren ned mot vatnet, 46,9 grader, og østsida har et vindu på 39,5 grader 440 til 500 meter ut. Under stigningen ligger vatnet: det som løsner i lia over deg, går over linja og ut på isen. Ikke samle gruppa på isen under lia.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Vest-Telemark er en A-region og varsles daglig i sesongen. Sjekk isen på Heddersvatn også: turen går 1846 meter på den. Platået er snaufjell uten ly. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,176 L17,189 L39,200 L59,199 L85,197 L106,188 L132,171 L153,164 L174,163 L195,169 L211,170 L227,174 L248,174 L269,174 L295,174 L321,174 L342,174 L369,174 L384,174 L405,174 L426,174 L447,174 L469,157 L489,131 L510,123 L531,98 L547,81 L568,56 L589,29 L600,18",
      startLabel: "1132 moh",
      endLabel: "1462 moh",
      distanceLabel: "5,1 km",
      caption: "406 høydemeter og 5,14 km fra Gaustabanen, med 1846 meter på isen av Heddersvatn og bratteste hundremeteren mellom 1300 og 1400 moh.",
    },
  },
  sveigen: {
    slug: "sveigen",
    intro:
      "556 høydemeter på 2,61 km rett fra E134: fra Pepparsteinen ved østre munning av Haukelitunnelen går du opp skaret sør for vegen, og der det flater ut, vestover til toppen på 1543 moh. Bratteste bandet er 18,6 grader fra 1000 til 1100 moh, rett over vegen, og bratteste sammenhengende parti er 27,2 grader mellom 1115 og 1132. Fri Flyt: «Denne veien har absolutt ingen anmarsj.»",
    ascent: [
      "Start på rasteplassen ved E134 rett øst for Haukelitunnelen, 994 moh. Pepparsteinen, som har gitt stedet navn, ligger i lia over, 33 meter fra linja ved 0,45 km. Fri Flyt: «Rett opp fra parkeringen går det et lite skar mellom Sveigen (1543moh.) og p1490. Når det begynner å flate ut tar du vest mot toppen.» Ut.no beskriver samme side som «Sveigen Nord»: den «kan nås fra Pepparsteinen ved øståpning av Haukelitunnelen, og har så å si ingen anmarsj». Ut.no sin hovedrute er en annen — østsida fra Ulevå over Ståvatn.",
      "Skaret begynner med en gang. Bandet fra 1000 til 1100 moh måler 18,6 grader over 304 meter grunn, og det bratteste partiet på hele linja, 27,2 grader, ligger mellom 1115 og 1132 moh. Her er bakken under sporet brattere enn sporet: 22, 62 og 28 meter på 35 grader eller mer mellom 1084 og 1130 moh, med bratteste celle 54 grader. Ved siden av linja står enkeltceller på 51 til 62 grader — berg og kanter — 42 til 64 meter fra den mellom 1074 og 1304 moh.",
      "Over 1200 moh slakker skaret av: 14,3 grader fra 1200 til 1300 og 8,9 fra 1300 til 1400. Ved 1400 moh, 1,59 km fra start, flater det ut, og linja svinger vestover. Den siste kilometeren til toppen stiger jevnt over åpent fjell, 10,4 grader fra 1400 til 1500 moh.",
      "Toppen er nordtoppen, 1543 moh, der Kartverkets stedsnavnregister og Fri Flyt setter Sveigen. Massivets høyeste punkt ligger 659 meter lenger sør, 1560 moh, bak et søkk på 1513; ut.no oppgir 1561 og går dit. Toppflata er slak: 0,3 til 11,1 grader i snitt til alle kanter over 500 meter.",
    ],
    descent: [
      "Fri Flyts letteste nedkjøring er samme vei ned som du gikk opp. «Ønsker du mer utfordring legger du sporet mer direkte ned. Hvis du gjør sistnevnte kan det bli brattere enn 35 grader.»",
      "Nordrenna er den kjente linja, og den nås fra vest: Fri Flyts alternativ 1 følger gamlevegen fra Haukelitunnelen inn i Dyrskaret. Fri Flyt: «Nedkjøringen er smal med høye kantvegger. Renna er brattest på toppen.» Den er 35 grader noen meter øverst og ellers 30, og «Ved mye vind fylles ofte denne renna med snø, og du må kunne vurdere snøkvaliteten før du setter utfor.» Ut.no: «Helningen på nordsiden er over 30 grader, og bør kun kjøres under optimale forhold.»",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 27,2 grader mellom 1115 og 1132 moh, og bratteste bandet 18,6 grader fra 1000 til 1100. Bakken under sporet er 35 grader eller brattere på tre strekk på 22 til 62 meter mellom 1084 og 1130 moh, med bratteste celle 54 grader. Fri Flyt oppgir 30 grader som bratteste punkt og graderer turen «Moderat»; her er den grad 3, fordi skaret går rett opp i skredterreng uten anmarsj.",
      },
      {
        title: "Terrenget utenfor",
        body: "Ut.no: «Hele fjellet er et potensielt skredområde vinterstid, og på vår/sommer kan det være utglidningsfare om det er hardt føre.» Nordsida er ifølge ut.no «noe mer krevende og mer skredutsatt» enn østruta. Skaret ligger rett over vegen og parkeringa, så du har ingen anmarsj å bli kjent med snøen på før du står i det bratte. Ut.no: «Kunnskap om skred og snøforhold er nødvendig.»",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Hardanger er en A-region og varsles daglig i sesongen. Starten ligger ved E134 over Haukelifjell; sjekk vegmeldingene før du kjører. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L21,198 L42,189 L62,181 L73,173 L104,160 L114,154 L135,145 L155,137 L166,131 L178,125 L189,119 L218,116 L238,107 L259,97 L280,86 L300,81 L311,78 L331,74 L352,71 L373,67 L393,67 L424,63 L445,54 L466,45 L487,39 L518,34 L538,29 L559,26 L588,20 L600,18",
      startLabel: "994 moh",
      endLabel: "1543 moh",
      distanceLabel: "2,6 km",
      caption: "556 høydemeter og 2,61 km fra Pepparsteinen, med skaret mellom 1051 og 1400 moh og bratteste bandet nederst.",
    },
  },
  fjetlandsnuten: {
    slug: "fjetlandsnuten",
    intro:
      "900 høydemeter på 5,67 km fra Odlandsvegen i Røldal: Blåbergdalsvegen i hårnålssvinger opp Tveitlia, nordover gjennom henget ved 750 moh, og langs Gjertrabekk — Fri Flyts «vestvendte bekken» — opp til masta på toppen, 1285 moh. Skogen slipper ved 937 moh. Bratteste sammenhengende parti er 25,0 grader mellom 746 og 762 moh, i henget, og bratteste bandet 13,9 grader fra 700 til 800. Fri Flyt graderer turen «Lett»; ut.no nevner ett kort parti med mulig skredfare, i henget, og advarer mot meget bratt terreng nord for bekken.",
    ascent: [
      "Start i krysset der Blåbergdalsvegen går ut fra Odlandsvegen ved Røldal kraftverk, 396 moh, på østsida av Røldalsvatnet. Ut.no: «Start ved kraftstasjonen på østsiden av Røldalsvatnet, og følg veien oppover Tveitlia til litt forbi fjerde hårnålssving.» Fri Flyt starter ved Tveita: «Kjør inn til Tveita og parker nede ved veien hvis snøen ligger langt nok ned. Hvis ikke kjører du bilen opp anleggsveien og parkerer i ei passende lomme.» Det er ingen kartlagt parkeringsplass her. Linja passerer Tveita 132 meter unna ved 0,77 km.",
      "Blåbergdalsvegen er anleggsvegen, og linja følger den gjennom fire hårnålssvinger: den første ved 1,01 km og 497 moh, den andre ved 1,52 km og 555, den tredje ved 2,16 km og 623 og den fjerde ved 2,44 km og 656. Det er slakt — 6,2 grader i bandet fra 400 til 500 moh og 5,7 fra 500 til 600. Lia over vegen er ikke slak: østover fra vegen ved 437 moh stiger den 255 meter på 400 meter, 32,5 grader i snitt og over 40 grader 260 til 300 meter ut. Den er skogkledd, men den ligger over deg hele veien opp svingene. Terrengmodellen leser vegskjæringer og fyllinger som korte strekk på 35 grader eller mer under linja mellom 405 og 542 moh; det er vegkanten, ikke lia.",
      "Litt forbi fjerde sving, ved 2,75 km og 700 moh, forlater linja vegen og dreier nordover. Ut.no: «i henget ca 750 moh bør det foretas skredvurdering før eventuelt videre oppstigning, her er et kort parti med mulig skredfare.» Henget når du ved 3,02 km og 760 moh, og det er det bratteste på turen: 25,0 grader mellom 746 og 762 moh, og 13,9 grader i bandet fra 700 til 800.",
      "Over henget går linja inn til bekken. Fri Flyt: «Følg den vestvendte bekken så langt den går, herfra ser du toppmasta.» Bekken er Gjertrabekk i stedsnavnregisteret; registerpunktet ligger på bekken i OSM. Fra 0,50 km har linja ligget sør for den. Ved 866 moh, 3,51 km fra start, krysser linja over til nordsida, og derfra følger den nordbredden eller bekkefaret oppover — slik ut.no-sporet gjør. Her er det bratt rett ved siden av: terreng på 40 grader og mer ligger 20 til 170 meter vest og nordvest for linja mellom 849 og 997 moh. Skogen slipper ved 937 moh. Ved 4,95 km og 1172 moh er linja 52 meter fra øverste kartlagte punkt på bekken.",
      "Derfra er det 719 meter igjen til masta, med 13,9 grader i bandet fra 1100 til 1200 moh. Toppen er slak mot sør og sørvest, 8,2 og 9,5 grader i snitt over 500 meter, og det er den siden du kommer opp. Fri Flyt: «På varme dager varmer sola metallet på masta slik at isen fra masta faller ned.» Masta står 17 meter fra der linja ender; hold avstand til den på varme dager.",
    ],
    descent: [
      "Fri Flyt: «Fra toppen kjører du mot bekken. Følg denne ned igjen. Det er ikke så bratt, men det er morsom og hyggelig kjøring tilbake til bilen. Hvis snøen ligger helt ned kjører du mot gården på Tveita.» Ut.no: «Returen kan legges mange veier, men hold deg syd for Gjertrabekk om du ikke vil ut i meget bratt terreng.» Linja ligger på nordsida av bekken fra toppen ned til 866 moh, der den krysser. Senest der skal du over på sørsida — fortsetter du nedover nord for bekken, kommer du ut i terrenget på 40 grader og mer vest og nordvest for linja.",
      "Nord og vest for toppen er Fjetlandsnuten bratt: 52,8 grader 300 til 360 meter ut mot nord, 54,7 grader 420 til 480 meter ut mot nordvest og 35,8 mot vest. Fri Flyts Gravgjel-renne går ned vestsida: «Fra toppen kjører du først sørvestover ca. 600 meter før du dreier rett vest over en slak flanke. Etter 1, 4 km fra toppen finner du inngangen på renna her.» Den beskrivelsen følger denne linja ned — 1,4 km fra toppen er linja ved 1029 moh, og 300 meter nord for den står terreng på 56,4 grader. Renna er «Vanskelig», 55 grader øverst, med 550 meter fall og fare for skred og steinfall; «Den er brattest i toppen, og det bygger seg opp skavler her». Den er en egen nedkjøring for stabile forhold, ikke en del av denne turen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti er 25,0 grader mellom 746 og 762 moh, i henget ut.no ber deg vurdere før du går videre, og bratteste bandet 13,9 grader fra 700 til 800. Langs vegen opp Tveitlia er det vegkanten terrengmodellen leser som bratt. Fri Flyt oppgir 30 grader som bratteste punkt og graderer turen «Lett»; ut.no kaller den krevende.",
      },
      {
        title: "Terrenget utenfor",
        body: "Lia over Blåbergdalsvegen er 32,5 grader i snitt og over 40 grader i partier. Mellom 849 og 997 moh ligger terreng på 40 grader og mer 20 til 170 meter vest og nordvest for linja, og nord- og vestsida av toppen måler 52,8 og 54,7 grader i bratteste vindu. Ut.no advarer mot «meget bratt terreng» nord for Gjertrabekk på returen. Fri Flyt: isen faller av masta på varme dager.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Hardanger er en A-region og varsles daglig i sesongen. Ut.no: «Tidlig og sent på sesongen kan det hende noe av veien er snøfri, og turen blir da noe kortere.» Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,194 L47,190 L67,186 L96,182 L115,177 L139,172 L167,166 L196,161 L218,156 L238,152 L258,147 L286,140 L310,131 L329,120 L353,107 L376,102 L395,93 L417,84 L437,76 L457,69 L476,61 L501,53 L529,39 L553,32 L574,28 L600,18",
      startLabel: "396 moh",
      endLabel: "1285 moh",
      distanceLabel: "5,7 km",
      caption: "900 høydemeter og 5,67 km fra Odlandsvegen, med henget ved 760 moh, skoggrensa på 937 og Gjertrabekk fra 866.",
    },
  },
  "store-ble": {
    slug: "store-ble",
    intro:
      "664 høydemeter på 6,33 km fra Nordstulvatnet: nesten to kilometer flat skog, en kneik gjennom Langedalen der bandet fra 800 til 900 moh måler 11,2 grader, og et høyfjellsplatå over. Bratteste sammenhengende parti, 35,2 grader mellom 1228 og 1251 moh, ligger i toppanløpet — og det er den sida beskrivelsene sier du kan måtte klatre opp i lite snø.",
    ascent: [
      "Start på den store parkeringa ved Nordstulvatnet, 714 moh. Ruta går slakt oppover gjennom åpen skog og krysser elva som renner ut av Sønstevatn, 746 moh; randofolk.no beskriver ei bru der. Bandet fra 700 til 800 moh måler 2,9 grader over 1785 meter grunn — det er den flate innmarsjen, og den er lengre enn den ser ut på kartet.",
      "Så kommer stigningen. 11,2 grader fra 800 til 900 moh over 512 meter grunn, som er bratteste hundremeteren på turen, og 7,0 grader fra 900 til 1000. Skogen slipper taket ved 945 moh, og først på 952 moh er du i åpent terreng for godt. Det er her T-ruta deler seg: opp Langedalen, eller utsiktsløypa om Sigridsbu. Linja går opp Langedalen.",
      "Øverst i Langedalen passerer linja 180 meter nord for Sigridsbu, som ligger på 1175 moh, og derfra flater det ut. Bandet fra 1100 til 1200 moh måler 3,8 grader over 1529 meter grunn — halvannen kilometer platå med vidåpen utsikt.",
      "Toppanløpet er det bratte. Mellom 1290 og 1314 moh måler bratteste sammenhengende parti 35,2 grader, og det er sørsida av toppen randofolk.no beskriver som å «karre deg opp» når snøen er tynn. Alternativet i beskrivelsen er å gå langs fjellet og opp fra nordsida, som måler 5,8 grader i snitt. Varden står på 1343 moh.",
    ],
    descent: [
      "To nedkjøringer er beskrevet, og de er ikke like. Samme veg tilbake går ned Langedalen og videre gjennom skogen mot Nordstulvatnet — randofolk.no skriver «vær oppmerksom på utløpssoner!» om akkurat den dalen, både på veg opp og på veg ned. Den andre går ned nordsida og østover mot Kongtjønn på 1225 moh, med et kort stykke til fots før det åpner seg.",
      "Sørøstflanken rett under toppen bryter av i 41,5 grader i 60-metersvinduet 60 til 120 meter ut, og vest gir 45,0 grader lenger nede. Nord og nordvest er de slake, 16,0 og 19,6 grader i bratteste vindu. Blefjell er kupert, og kupert betyr her at linjevalget teller mer enn hellinga du står i: det er utløpet under deg som bestemmer.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti måler 35,2 grader og ligger i toppanløpet, mellom 1228 og 1251 moh. Bratteste hundremeteren er 800 til 900 moh med 11,2 grader over 512 meter grunn — kneika opp mot skoggrensa. Resten av ruta er slak: 2,9 grader på innmarsjen og 3,8 grader over platået fra 1100 til 1200 moh.",
      },
      {
        title: "Terrenget utenfor",
        body: "Langedalen er stedet på dette fjellet der skred faktisk teller, og kilden sier det selv to ganger: utløpssoner, både i oppstigningen og i nedkjøringa. Rutas eget bratteste steg, 35,2 grader, ligger på sørsida snaut 500 meter fra varden; sørøstradialen ved sida av måler 41,5 grader i bratteste 60-metersvindu, 60 til 120 meter ut, og vestflanken 45,0 grader 430 til 490 meter ut. Nordsida er den slake veien opp og ned. Over tregrensa er berget hardt og jordlaget tynt, og vinden pakker snøen deretter.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Telemark sør på varsom.no. Telemark sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,194 L42,189 L64,191 L89,190 L111,190 L136,186 L162,179 L183,164 L209,151 L232,137 L260,128 L285,120 L311,110 L337,96 L363,86 L384,80 L414,74 L435,63 L452,64 L473,59 L499,60 L520,59 L541,56 L559,42 L580,22 L600,18",
      startLabel: "714 moh",
      endLabel: "1343 moh",
      distanceLabel: "6,3 km",
      caption: "664 høydemeter og 6,33 km fra Nordstul, med skoggrensa på 945 moh, Sigridsbu på 1175 og bratteste hundremeteren mellom 800 og 900 moh.",
    },
  },
  surloytenuten: {
    slug: "surloytenuten",
    intro:
      "459 høydemeter på 6,16 km fra Nordstul, og den slakeste turen i denne delen av Blefjell: bratteste hundremeteren måler 5,3 grader. Ruta går nordover forbi toppen til Vassholet på 993 moh og kommer tilbake sørover langs Surløyterinden — det er derfor de siste kilometerne føles som en rygg og ikke som en bakke.",
    ascent: [
      "Fra nordenden av parkeringa ved Nordstul, 714 moh, går stien ned til høyre og over Esperåa på bru, 730 moh. Hold til høyre og følg den kloppelagte stien til setervollen Sudstul, 727 moh, der DNT-ruta mellom Selsli og Sigridsbu krysser.",
      "Rett før siste hytta på vollen tar du av til høyre på umerket, men godt synlig sti. Nå går det nordover og oppover gjennom skog og myr: bandet fra 700 til 800 moh måler 2,6 grader over 1904 meter grunn og 800 til 900 moh 4,2 grader over 1346. Skogen slipper taket ved 951 moh.",
      "Ved Vassholet, 993 moh, snur ruta. Herfra følger du det ytre høydedraget sørover langs Surløyterinden, 1085 moh, og bratteste sammenhengende parti på hele turen ligger i kneika opp dit: 24,9 grader mellom 994 og 1014 moh. I selve søkket går linja 45 meter over et tjern på 1068 moh, 10 meter fra land — et hjørnekutt, og tjernet er naturlig og uten navn i registeret.",
      "Ryggen sørover er nesten flat — bandet fra 1000 til 1100 moh måler 2,8 grader over 1697 meter grunn — og ender ved varden på 1097 moh. I nordvest ser du Tverrgrønuten, Blerinden og Bletoppen.",
    ],
    descent: [
      "Samme veien tilbake er nordover langs ryggen først, og den er så slak som en rygg blir: 2,2 grader i snitt over 500 meter, med bratteste 60-metersvindu på 5,7 grader. Det er ikke en nedkjøring, det er en gåtur med ski på.",
      "Den andre returen i beskrivelsen er bratt nedstigning mot sør til DNT-stien, og den er nedkjøringa: sørflanken måler 13,5 grader i snitt over 500 meter med bratteste 60-metersvindu på 29,5 grader, 400 til 460 meter ut. Østsida gir 25,1 grader nærmere toppen. Blefjell har en sårbar villreinstamme, og ut.no ber uttrykkelig om at det tas hensyn — det er en god grunn til å holde seg til de to beskrevne linjene framfor å legge egne spor over platået.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slakt terreng nesten hele veien. Bratteste hundremeteren, 900 til 1000 moh, måler 5,3 grader over 1216 meter grunn, og bratteste sammenhengende parti 24,9 grader mellom 994 og 1014 moh — kneika opp mot Vassholet. Ruta gir tilbake 76 høydemeter underveis, og de ligger i søkket ved Vassholet som beskrivelsen går gjennom.",
      },
      {
        title: "Terrenget utenfor",
        body: "Den bratte nedstigningen mot sør er det ene stedet hellinga teller: 29,5 grader i bratteste 60-metersvindu, 400 til 460 meter ut fra varden, og den er samtidig det anbefalte returalternativet. Velg den etter forholdene, ikke etter kartet. Ryggen langs Surløyterinden er avblåst i vind og kan være hard og isete mens sørsida er myk.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Telemark sør på varsom.no. Telemark sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,193 L39,193 L61,193 L86,196 L106,195 L125,190 L138,181 L155,175 L177,164 L198,153 L220,146 L242,139 L262,135 L282,123 L299,114 L321,111 L347,103 L369,89 L389,80 L409,73 L429,66 L448,44 L468,28 L485,24 L501,38 L523,40 L545,33 L566,26 L588,19 L600,18",
      startLabel: "714 moh",
      endLabel: "1097 moh",
      distanceLabel: "6,2 km",
      caption: "459 høydemeter og 6,16 km fra Nordstul om Sudstul og Vassholet, med skoggrensa på 951 moh og varden på 1097.",
    },
  },
  styggemann: {
    slug: "styggemann",
    intro:
      "547 høydemeter på 9,58 km fra Ravalsjø til Skrims høyeste topp, og de fleste av dem kommer til slutt: de første seks kilometerne holder under 2 grader i snitt per hundremeter. Toppen er den bratte delen — 15,1 grader fra 800 til 900 moh, og østsida rett under varden faller 48,5 grader.",
    ascent: [
      "Start på parkeringa ved Ravalsjø, 483 moh, og følg skilting og merking forbi Ormetangen, 476 moh, og opp lia øst for vatnet. Dette er skogsterreng med oppkjørte løyper, og de er det som gjør turen til en dagstur: bandet fra 400 til 500 moh måler 0,6 grader over 1848 meter grunn.",
      "Videre forbi Skrimsetra, 591 moh, og over Fugleleikskarva, 635 moh. Bandet fra 500 til 600 moh måler 1,7 grader over 3392 meter grunn og 600 til 700 moh 1,5 grader over 3695 — det er nesten sju kilometer skog og myr mellom 483 og 700 moh. Kartverket klasser punktet på 611 moh som dyrket mark — det er setervollen på Sørmyrseter, like før hytta.",
      "Fem steder går linja over is, 1541 av de 9608 meterne. Den lengste kommer med en gang: 630 meter tvers over Ravalsjø på 475 moh, forbi holmen Kjelen, før ruta tar opp lia øst for vatnet. Så Skrimsvannet på 575 moh to ganger, 191 og 270 meter, Urdstjerna på 594 moh på 225 og Stulstjernet på 602 moh på 225. Alle fem er naturlige vatn, ingen av dem regulert, og ingen kryssing går mer enn 99 meter fra land — dette er smale skogsvatn løypa går tvers over, og DNTs egen vinterkjede fra Ravalsjø går gjennom det samme terrenget. Men is er is: det er de eneste stedene på en ellers rolig løypetur der underlaget ikke er bakke, og tidlig og sent i sesongen er de verdt et blikk før du går ut på dem.",
      "Sørmyrseter ligger på 620 moh, og herfra oppgir DNT rundt 240 høydemeter opp til Styggemann. Nå begynner turen å stige på ordentlig: 14,6 grader fra 700 til 800 moh over 404 meter grunn, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Skogen slipper taket ved 700 moh, og på 830 moh er du i åpent terreng.",
      "Det siste bandet, 800 til 900 moh, er det bratteste: 15,1 grader over bare 244 meter grunn. Ut.no kaller oppstigningen «temmelig bratt». Rådet deres om å sette igjen sekken i stikrysset gjelder den andre adkomsten, fra Ivarsbu i øst, der krysset ligger vest på Jotefjell, sørøst for varden. Varden står på 871 moh, og Styggemannshytta ligger rett ved.",
    ],
    descent: [
      "Ned samme veien, sørover og så vestover langs løypa. Peilinga fra varden til Sørmyrseter er 172 grader, og akkurat den radialen måler 29,1 grader i bratteste 60-metersvindu, 70 til 130 meter ut, med et steg på 35,1 grader mellom 120 og 150 meter. Noen få grader til hver side endrer tallet mye: 165 grader gir 36,8 og 180 gir 25,1. Fallinja til setra er altså ikke det mildeste valget, og driver du vestover fra den blir det brattere, ikke slakere.",
      "De andre sidene av toppen er ikke det. Øst måler 48,5 grader i 60-metersvinduet 30 til 90 meter under varden, sørøst 45,3 grader 20 til 80 meter ut, og nordøst 43,9 grader. Det er innenfor hundre meter av der du står med kaffekoppen. Sørvest ser slakt ut med 9,0 grader i snitt, men har et 38,6 graders vindu 160 til 220 meter ut — det er den fella på dette fjellet som ikke ser ut som en felle.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Sju kilometer skogsterreng under 2 grader, og så en kilometer som stiger: 14,6 grader fra 700 til 800 moh og 15,1 fra 800 til 900, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Ruta gir tilbake 159 høydemeter over de rullende skogsryggene mellom Ravalsjø og Sørmyrseter. Ruta krysser dessuten 1541 meter is fordelt på fem vatn mellom 475 og 602 moh — ikke skredterreng, men heller ikke bakke.",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppen er brattest der ingen har tenkt seg: øst 48,5 grader, sørøst 45,3 og nordøst 43,9 i bratteste 60-metersvindu, alle i vinduer som starter 20 til 40 meter ut fra varden. Ruta kommer fra sørsørøst: peiling 172 mot Sørmyrseter måler 29,1 grader i bratteste 60-metersvindu, og rett sør, 180 grader, 25,1 grader i vinduet 130 til 190 meter ut. Skrim ligger lavt nok til at snøen kommer og går — ut.no fører skisesongen som januar til mars — og de oppkjørte løypene mellom Ravalsjø og Sørmyrseter er det som gjør turen gjennomførbar på en dag.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,195 L26,196 L48,199 L75,199 L99,195 L124,179 L150,164 L175,159 L192,155 L215,154 L241,153 L260,153 L289,143 L311,144 L339,134 L365,126 L384,127 L407,127 L432,133 L458,140 L478,136 L500,112 L523,107 L548,114 L565,80 L582,54 L599,19 L600,18",
      startLabel: "483 moh",
      endLabel: "871 moh",
      distanceLabel: "9,6 km",
      caption: "547 høydemeter og 9,58 km fra Ravalsjø om Skrimsetra, Fugleleikskarva og Sørmyrseter, med skoggrensa på 700 moh og all stigningen over 700 moh.",
    },
  },
  saebyggjenuten: {
    slug: "saebyggjenuten",
    intro:
      "Agders høyeste — så vidt det er: fylkesgrensa krysser selve toppen, og det registrerte toppunktet på 1506 moh ligger i Tokke i Telemark, ti meter øst for Agder-sida, som når 1504. En tur der tallet som betyr noe er 11,31 km og ikke 851 høydemeter. Ingen sti, ingen merking, tre skar og et vann underveis, og et terreng så slakt at det bratteste 400-metersvinduet måler 13,7 grader. Det eneste bratte på fjellet vender nord, og du skal ikke dit.",
    ascent: [
      "Fra parkeringa ved bommen innerst i Berdalen hyttegrend, 810 moh, går ruta østover. Peilinga fra parkeringa til toppen er 82 grader — Berdalen ligger vest for fjellet, og du går inn mot det hele dagen. Riksveg 9 mellom Bykle og Hovden er brøytet hele vinteren, og ut.no presiserer at du ikke skal kjøre den siste kilometeren etter bommen: «Veien er privat.» Den første kilometeren deler trasé med oppkjørte løyper i Berdalen; linja her er terrenglinja og ikke løypa.",
      "Forbi Langemyr på 891 moh går det jevnt oppover mot Tverrheiskaret på 1028 moh. Dette er den eneste stigninga på turen som kjennes som en stigning: bratteste 30 meter måler 26,2 grader mellom 1000 og 1022 moh, 2350 meter ute, og bratteste 400 meter 13,7 grader fra 963 til 1062 moh. Skogen står høyt her: DTM1 gir terrengklasse Skog i selve Tverrheiskaret på 1028 moh. Langs linja står skogen til 1044 moh, og fra 1052 er det åpent.",
      "Over Tverrheii og Tverrheitjønnane holder du øst til Tverrheiskardet på 1156 moh. Her er en felle verdt å kjenne: SSR har tre skarpunkt på strekninga, og to av dem heter Tverrheiskaret — det du gikk over på 1028 moh, og ett til på 1091 moh som ligger bare 305 meter fra Tverrheiskardet på 1156. Det er det siste paret som er lett å blande, ikke det første. Bandet 1100 til 1200 moh måler 1,3 grader over 4455 meter grunn — det er over fire kilometer nesten flatt høyfjell, og det er her en tur uten merking blir en navigasjonsjobb.",
      "Fra Tverrheiskardet faller linja 47 meter over 535 meter grunn ned i Gjuvvatn-bassenget, og så 32 meter til, ned på Midtre Gjuvvatn. Der går den 720 meter over vatnet på 1124 moh, høyst 55 meter fra land — den eneste iskryssinga på turen. Vatnet er naturlig: DTM1 gir terrengklasse Innsjø, og OSM-relasjonen (name=Midtre Gjuvvatn, ele=1124, ref:nve:vann=13750) bærer ingen reservoartagger. Turskildringene går samme veien.",
      "Fra østenden av vatnet på 1137 moh stiger ruta jevnt østover forbi vegpunktet på 1225 moh — det ligger på fast mark like vest for det nederste av de to små vannene, ikke på vatnet selv — og siste kilometeren går opp vestflanken. Bandet 1400 til 1500 moh måler 11,9 grader over 499 meter grunn, det bratteste på hele turen. De siste 500 meterne går på peiling 78 grader og stiger 115 meter til toppen på 1506 moh. ut.no fører 1507; DTM1 gir 1506,49 på det registrerte punktet, og en halv meter er ikke en uenighet verdt navnet.",
    ],
    descent: [
      "Ned samme vei, og ned vestsida. Fallvektet gjennomsnittsretning er 258 grader, altså vest-sørvest, som er den flanken du kom opp. Sveipet fra toppen gir 9,8 grader i snitt vestover og 9,2 sørvestover ut til 1000 meter — det er slakt nok til at nedkjøringa mest er transport, men også slakt nok til at du ikke trenger lete etter noe bedre.",
      "Og det er poenget. Den eneste bratte sida på Sæbyggjenuten er nordsida, og den er skavlkantet: 15,0 grader i snitt nordover mot 9,8 vestover, med et bratteste 60-metersvindu på 41,9 grader 460 til 520 meter ute, 42,3 grader nordøstover og 46,1 grader på peiling 10 grader. Skavlen står på de siste høydemeterne, og i flatt lys ligger kanten der uten at terrenget varsler. Kom opp vestsida og gå ned vestsida.",
      "Den andre feilen er lengden. Elleve kilometer inn — 11,31 km måler linja — med over fire kilometer flatt høyfjell mellom 1100 og 1200 moh, betyr at værvinduet og ikke hellinga styrer turen. Merking finnes ikke; sti finnes så vidt. ut.no skriver «Gå stien inn til Langemyr», og OSM har én umerket traktorvei på den første strekninga — etter det er det terreng. Snur du på Gjuvvatn, har du sju kilometer igjen til bilen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja har lite skredterreng i seg. Bratteste 30-meterssteg er 26,2 grader i oppgangen til Tverrheiskaret, bratteste 60 meter 19,6 grader, bratteste 200 meter 16,1 og bratteste 400 meter 13,7. Det bratteste hele høydebandet, 1400 til 1500 moh, måler 11,9 grader over 499 meter grunn. Det som kan gå galt på selve linja er isen på Midtre Gjuvvatn sent i sesongen, og at 720 meter er langt å være ute på den.",
      },
      {
        title: "Terrenget rundt",
        body: "Vest, sørvest, sør og sørøst ligger alle mellom 6,5 og 9,2 grader i snitt ut til 1000 meter fra toppen. Nord og nordøst gjør ikke det: 15,0 og 14,3 grader i snitt, med bratteste 60-metersvindu på 41,9 og 42,3 grader, og 46,1 grader på peiling 10 grader 430 til 490 meter ute. Skavlen på nordkanten er dokumentert på de siste høydemeterne. Toppen er en enkel, slak kuppel fra tre kanter og noe helt annet fra den fjerde.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Kortet sier Setesdal, og det er dalen du starter i — parkeringa i Berdalen ligger i Bykle i Agder — men toppunktet ligger i Tokke i Telemark, så Varsom-regionen stemmer nøyaktig med koordinaten. Søker du på Setesdal, finner du ingenting. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,189 L46,179 L70,179 L91,175 L117,158 L139,134 L158,133 L180,137 L201,132 L225,127 L248,107 L270,108 L297,107 L316,104 L343,97 L366,109 L387,115 L409,118 L431,117 L452,106 L471,98 L495,92 L519,76 L545,55 L564,50 L585,35 L600,18",
      startLabel: "810 moh",
      endLabel: "1506 moh",
      distanceLabel: "11,3 km",
      caption: "851 høydemeter og 11,31 km fra Berdalen over Tverrheiskara og Midtre Gjuvvatn, der alt bratt vender nord og ruta holder seg vest.",
    },
  },
  kjerag: {
    slug: "kjerag",
    intro:
      "En topp som ikke er en topp. Kjerag er et platå, og toppunktet er en flekk på det: 200 meter sør for det ligger bakken 1,5 meter høyere, og linja går selv over 1129 moh før den gir fra seg 66 høydemeter og stiger tilbake til 1124. 620 høydemeter og 7,36 km, og det eneste som er alvorlig på turen ligger to kilometer unna og har ingenting med helninga å gjøre.",
    ascent: [
      "Fra parkeringa på Øygardstøl, 641 moh, følger du Lysevegen sørover. Veien er vinterstengt — OSM har motor_vehicle:conditional=no @ Nov-May og snowplowing=no på fylkesvei 4224, og Sirdal kommune bekrefter det — så dette er en vårtur og ikke en vintertur. Linja her ligger aldri mer enn 100 meter fra kartlagt vei, men den kutter hårnålssvingene — svinger, ikke stigning. Det bratteste 30-meterssteget på hele ruta ligger oppe: 29,6 grader mellom 1083 og 1102 moh, på Kjeragplatået.",
      "Ved Stølsdalen bru på 850 moh tar anleggsveien mot Langavatn av, og du følger Langvassvegen sørvestover. På 925 moh går linja 225 meter over et umerket vatn like ved veien, høyst 24 meter fra land. Terrengklassen i DTM1 er Innsjø og ikke InnsjøRegulert, og OSM-polygonet (way 1312542069, ref:nve:vann 195944) bærer ingen reservoartagger — det er et naturlig vatn, ikke et magasin. Veien er den egentlige ferdselslinja her; vatnet ligger der linja skjærer svingen.",
      "På 944 moh forlater du veien og holder vest inn på Kjeragplatået. Peilinga fra veipunktet til toppunktet er 265 grader — rett vest. (Korridorforskninga oppga 271; den målte mot et toppunkt som ligger 338 meter fra det registrerte.) Turbeskrivelsene skriver «mot nordvest», og nordvest derfra fører til Kjeragbolten, som ligger 1921 meter fra toppunktet på peiling 10 grader. Det er et annet mål og en annen rute — og varden turbeskrivelsene snakker om står oppe ved bolten, ikke der linja ender; ut.no skriver at «Kjeragbolten ligger ca. 300 meter sør for varden».",
      "Over platået er det slakt hele veien: bandet 900 til 1000 moh måler 4,2 grader i snitt over 1441 meter grunn, bandet 1000 til 1100 moh 2,3 grader over 2746 meter. Linja går tvers over fire vatn til: 45 meter på 975 moh, 45 meter på 1064 moh, 686 meter på 1075 moh med høyst 32 meter til land, og 90 meter på 1080 moh. Alle er naturlige. Til sammen går ruta 1091 av 7362 meter på vatn. Det som gjør platået krevende er ikke helninga, men at det er svaberg uten merking, med korte brå kanter mellom slake parti — det bratteste 60-metersvinduet rett vest for toppunktet måler 38,1 grader og ligger bare 90 meter ute.",
      "Siste etappe kommer inn fra øst over litt høyere mark. Linja topper på 1129 moh 6640 meter ute, faller 66 meter til 1063, og stiger så 21,2 grader over 60 meter fra 1077 til 1112 moh — det bratteste sammenhengende partiet på turen — før de siste 500 meterne går på peiling 294 grader og stiger 59 meter til toppunktet på 1124 moh. Høyeste mark på hele platået er 1163,7 moh og ligger 1347 meter øst-nordøst; toppunktet her er det registrerte Kjerag-punktet, ikke det høyeste.",
    ],
    descent: [
      "Samme vei tilbake. Fallvektet gjennomsnittsretning for nedkjøringa er 49 grader, altså nordøst, og med bare 620 høydemeter fordelt over 7,4 kilometer er dette mer transport enn nedkjøring. Det gode partiet er de to kilometerne ned Langvassvegen og Lysevegen, som er bred og jevn så lenge det ligger snø på den.",
      "Vanligste feil på platået: å gå nordover for å se ned i Lysefjorden. Rett nord fra toppunktet holder platået seg på 1008 til 1016 moh helt ut til 1850 meter — det er flatt, det ser ut som mer platå, og du merker ingenting. Så faller terrenget 71,4 grader over de neste femti meterne og 77,4 grader over de femti etter det, og på 2000 meter ute er bakken under 800 moh. Sjøen ligger 2,6 kilometer nord. Den tegnede linja kommer aldri nærmere enn 1675 meter fra bakke under 800 moh, og det nærmeste punktet er selve toppunktet. Kanten kommer uten varsel i tåke og flatt lys, og det er den ene feilen som ikke går an å rette opp.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skredterreng i vanlig mening fins nesten ikke på denne linja. Bratteste 30-meterssteg er 29,6 grader mellom 1083 og 1102 moh, på platået; bratteste 60 meter er 24,9 grader og bratteste 100 meter 22,8, begge i et søkk på platået ned til 1067 moh, og bratteste 400 meter 11,8 grader. Ingen av de sju høydebandene over 700 moh måler mer enn 5,8 grader i snitt. Det som faktisk kan gå galt her er å tråkke gjennom is på et av de fem vatnene sent i sesongen, og å bomme på kanten mot nord.",
      },
      {
        title: "Terrenget rundt",
        body: "Fra toppunktet ligger sju av åtte retninger under 13 grader i snitt innenfor 200 meter, og sør måler minus 0,4 grader. Lenger ut skiller to seg ut: vest faller 38,1 grader i det bratteste 60-metersvinduet allerede 90 meter fra toppunktet, og sørvest 54,8 grader 800 meter ute. Begge er korte skrenter i svaberget, ikke samlefelt — men i flatt lys ser de ut som resten av platået helt til du står på dem. Nordsida er noe annet: det er en vegg på over tusen meter ned i Lysefjorden, og den begynner 1850 meter nord for toppunktet uten at terrenget varsler.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Heiane på varsom.no. Ta med sender/mottaker, søkestang og spade. Sjekk også om Lysevegen er åpen. ut.no sier det slik: «Rv500 mellom Sirdal og Lysebotn stenges når første snøfall kommer i okt/nov og åpner ikke før mai/juni.» Uten åpen vei er det ingen tur.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,193 L41,171 L59,165 L83,157 L103,150 L125,135 L147,125 L167,117 L188,109 L213,95 L235,94 L257,89 L279,84 L298,72 L321,58 L345,41 L367,36 L390,36 L411,33 L433,38 L459,38 L481,34 L499,36 L521,24 L543,22 L569,37 L585,22 L600,20",
      startLabel: "641 moh",
      endLabel: "1124 moh",
      distanceLabel: "7,4 km",
      caption: "620 høydemeter og 7,4 km over Kjeragplatået, der bratteste 30 meter er 29,6 grader, oppe på platået, og det farlige ligger 1850 meter nord for toppunktet.",
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
