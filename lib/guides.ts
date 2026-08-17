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
      "Fjord til topp i ytre Lyngen: 1215 høydemeter fra veikanten der Galtelva renner ut i Nord-Lenangen, til varden på 1219. Kort linje, åpent fjell fra 70 moh og opp, og fjorden i ryggen fra første stigning.",
    ascent: [
      "Start ved Sandneset, der Galtelva renner ut i fjorden på 14 moh, rett ved Fv7922 Lenangsveien. Parkeringa er uskiltet: det som finnes er plassen på nordsida av elveosen og veikanten langs fylkesveien. Sett bilen godt utenfor kjørebanen — dette er brøytet vinterveg. Herfra går du rett inn i Galtdalen nord for Lassofjellet og holder sørsiden av elva, det vil si høyre side på vei opp. Bjørkeskogen slipper taket allerede rundt 70 moh; resten av turen er åpent terreng.",
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
      "578 høydemeter og 4,11 km fra Finnvikvatnet til radaren på 790 moh — en av Kvaløyas mest besøkte topper, og et fjell uten et eneste bratt parti på ruta. Brattaste hundremetersband er 12,6 grader mellom 300 og 400 moh, og brattaste steg 24,9 mellom 605 og 620. Det bratte på Kjølen ligger nord, og ruta går øst.",
    ascent: [
      "Start sør for Finnvikvatnet, 224 moh, som er der ut.no startet: «Vi parkerte på sørsiden av Finvikvatnet, et av mange startpunkter.» Den kartlagte parkeringa ligger 640 meter lenger nord ved østenden av vatnet, og derfra går det an å gå, men ikke over isen — vassflata ligger på 229 moh og landet øst for den 254 til 265, så det er rundt og ikke over. Fri Flyt beskriver fire startsteder for dette fjellet og kaller dette «et litt kortere alternativ med mindre stigning».",
      "Turen går over skoggrensa nesten fra bilen: Kartverket fører siste skog på 218 moh, 40 meter inn på linja, og åpent terreng fra 219 og hele vegen opp. De første 904 metrene innover Finnvikdalen stiger 5,1 grader. Så kommer turens bratteste strekk, og det er ikke bratt: 12,6 grader fra 300 til 400 moh over 450 meter grunn. Over det slakner det igjen — 8,4 grader fra 400 til 500, 6,9 fra 500 til 600, 9,5 fra 600 til 700 og 7,3 til topps — med korridorpunktene på 440, 572 og 703 moh underveis.",
      "Det eneste stedet linja virkelig reiser seg er mellom 605 og 620 moh, der brattaste 30-metersvindu måler 24,9 grader. Fri Flyt oppgir bratteste punkt under 27 grader for alle fire rutene på fjellet. Toppflata nås på 774 moh, og derfra er det flatt bort til den store radaren og varmebua Troms Turlag reiste på dugnad i 2010. Begge står i kartet: radaren er OSM-noden «Stor-Kjølen Radar» 46 meter fra toppcella, og bua «Varmebua på Kjølen» 41 meter fra henne.",
    ],
    descent: [
      "Ned samme vegen, ned Finnvikdalen. Retninga fra toppen til startpunktet er 62 grader, mellom øst og nordøst, og de to radialene måler 9,8 og 10,0 grader i snitt ut til en kilometer — det er hele historien om den sida. Fri Flyt mener for øvrig at den beste skikjøringa på fjellet ligger et annet sted: rutene fra Kvaløysletta og Slettaelva, «der siste del nedover Finnlandsfjellet bare er å nyte i store og herlige svinger». Dette er den korte vegen opp, ikke den fineste vegen ned.",
      "Ut.no er tydelig på hva turen er og ikke er: «Ikke en topp for deg som må ha kvasse egger og bratte nedkjøringer, men en fin topp som gir god skikjøring.» Advarselen deres gjelder ikke bratthet, men det som ligger under snøen: «Snømengden avgjør mulighetene dine på vei ned. Følg snøfeltene så langt det lar seg gjøre, unngå åpenbare terrengfeller og bekkedaler.»",
      "Nordover er det en annen sak. Nordflanken måler 20,9 grader i snitt ut til en kilometer med et 36,7-graders vindu 710 til 770 meter ut — den eneste retninga fra denne toppen som holder over 20 grader i snitt. Toppflata er bred, radaren er det eneste haldepunktet i dårlig sikt, og faller du for fristelsen til å ta en ny linje nedover nordover, er det den flanken du kommer inn i.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "578 høydemeter der brattaste band er 12,6 grader og brattaste steg 24,9. Fri Flyt fører alle sine fire ruter på fjellet som KAST 1 – Enkelt, og ut.no fører denne som moderate. Ingen av dem oppgir et faremoment på oppstigninga.",
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
      "450 høydemeter og 2,32 km fra Storelva skistadion til toppen på 470 moh — den mest besøkte toppen rundt Tromsø, og en tur for alle anledninger. Brattaste hundremetersband er 15,1 grader mellom 300 og 400 moh, og brattaste steg 24,2 grader mellom 429 og 447. Det eneste virkelig bratte på fjellet ligger sørøst for varden, og ruta går ikke i det.",
    ascent: [
      "Start ved Storelva skistadion på Kvaløysletta, 20 moh, der det er kartlagt parkering ved anlegget. Fri Flyt oppgir 2,8 km for turen og ut.nos egen linje måler 2,52; den routa linja her er 2,32 km. Fjellet heter Rødtinden på norsk og Ruksesvárri på nordsamisk, og begge navnene er vedtatt i Kartverkets register.",
      "Den første kilometeren følger lysløypa oppover Storelvdalen — de første 942 metrene av linja stiger 5,1 grader i snitt — og på 96 moh forlater ruta løypa og legger seg inn i lia, og fra da av er stigninga påfallende jevn: 14,5 grader fra 100 til 200 moh, 15,0 fra 200 til 300, 15,1 fra 300 til 400 og 14,9 over det. Turen gir ikke tilbake en eneste høydemeter på hele oppstigninga.",
      "Kartverket fører skog til 208 moh og åpent terreng fra 218, men skogen her er bjørk med myr imellom — terrengklassen langs linja veksler mellom Skog og Myr på 53, 156 og 241 moh. Over den er det bare å velge spor. Fri Flyt: «Etter hvert kommer man over skogen og det er bare å legge sporet etter behag. (Men det skal godt gjøres hvis det ikke er et spor å følge).» De siste hundre høydemeterne holder ruta godt mot vest der ryggen er slakest, og brattaste steget på turen ligger her — 24,2 grader mellom 429 og 447 moh.",
    ],
    descent: [
      "Ned samme vegen, sørøstover mot skistadion. Vest for varden måler flanken 3,3 grader i snitt ut til en kilometer og sørvest 15,1, så velger du feil kant er det ikke bratthet som straffer deg, det er at du havner i feil dal.",
      "Det ene stedet fjellet er bratt, ligger sørøst for varden, og det ligger nært. Radialen på 135 grader, lest av punkt-API-et hver tiende meter, går 469,6 – 467,7 – 464,6 – 459,5 – 452,7 – 448,8 – 437,0 – 430,6 – 426,6 moh de første 80 meterne: brattaste 60-metersvindu er 32,3 grader mellom 20 og 80 meter ut, og det brattaste enkeltsteget 49,7 grader mellom 50 og 60. Fri Flyts «heng med bratthet opp mot 40 grader» er altså riktig, og under de tjue metrene der det er brattest, forsiktig.",
      "Nordvestover er problemet det motsatte. Toppen er en rund skulder og ikke et toppunkt i terrengmodellen: bakken stiger videre uten sadel — 479,6 moh 200 meter ut, 488,5 på 400 og 491,0 på 600 — og fortsetter til 567,0 moh ved registerpunktet for Storbogtinden 728 meter unna. I flatt lys går du forbi varden uten å merke det, og fortsetter inn på et fjell med en annen tur.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "450 høydemeter der ikke ett hundremetersband måler over 15,1 grader og brattaste steg er 24,2. Fri Flyt fører turen som KAST 1 – Enkelt med bratteste punkt under 25 grader, og skriver at sporet her kan legges helt utenom skredterreng. Det forutsetter at det holder seg vest for toppryggen på slutten.",
      },
      {
        title: "Henget mot sørøst",
        body: "Det henget er turens eneste faremoment, og det er brattere enn tallet Fri Flyt oppgir: 49,7 grader på ti meter mellom 50 og 60 meter fra varden, og 32,3 grader over hele vinduet fra 20 til 80. Fra toppen ser det ut som en naturlig linje ned mot skistadion, og det er den korteste vegen hjem. Østsida er den samme historien i mindre målestokk: 15,0 grader i snitt, med et 28,6-graders vindu som ligger 50 til 110 meter ut — lenger fra varden enn på sørøstsida, og derfor lettere å komme borti uten å ha bestemt seg for det.",
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
  fastdalstinden: {
    slug: "fastdalstinden",
    intro:
      "1271 høgdemeter og 7,32 km frå vegenden på Varto — ein Lyngen-klassikar med lang anmarsj og eit magasin midt i turen. Fri Flyt gjev normalruta KAST 2 og brattaste punkt 25–30 grader, og målinga av lina er snillare enn ryktet: brattaste hundremetersbeltet 19,5 grader mellom 200 og 300 moh, brattaste samanhengande parti 25,5. Grad 3 på kortet er skalaen, ikkje bratthenget: dette er ein 6–8-timarstur der terrenget ikring — skavlar, utløpsområde og ei sørside med dødsulukker i historikken — er ein annan klasse enn sporet.",
    ascent: [
      "Frå fv7920 ved Rottenvik tek Vardoveien av og klatrar om lag ein kilometer til vegenden på 123 moh — Fri Flyts «parkeringsplass på Varto» — registerets Varto (Høyde) står 1,8 km aust på 187 moh, og namnet som er registrert ved sjølve vegenden, er Vardoveien. Anleggsvegen held fram vestover og oppover: han er kartlagd heile vegen til dammen på 515 moh, og dei fyrste fire hundre høgdemetrane er unnagjort på veg. Skogen sluttar alt på 363 moh etter Kartverkets klassar.",
      "Dammen fortener si eiga setning: Rottenvikvatnet er eit magasin — regulert, med terrengklasse deretter — og isen på eit regulert vatn skal ikkje brukast. Lina går difor slik kjelda seier, langs vest- og seinare nordsida av vatnet, på land heile vegen: vestbredda på 566, nordvestbredda på 572, nordenden på 589 moh. Det er målt mot både terrengklassane og OSM-polygonet: 0 meter på vatn.",
      "Frå nordenden av vatnet stig terrenget til flata Fri Flyt set på 650 moh — målt 650 på metern. Vidare vestover passerer lina nord for det vesle vatnet på 697, og så kjem ryggformasjonen kjelda ber deg vera vaken på: «Her er det små områder som er rundt 30 grader, så bruk litt tid på å gjøre gode veivalg». Lina held 815 → 1070 på ryggen, med linevalet som verktøyet.",
      "Frå ryggen er det rett mot toppen, slik kjelda seier. Varden står på 1275 moh, og søraustsida du kom opp er den slakaste sektoren fjellet har: 16,0 grader i snitt og 28,4 som brattaste 60 m-vindauge dei fyrste hundre metrane.",
    ],
    descent: [
      "Same trasé ned som opp er kjeldas råd, og tala er med han: søraust og sør er dei einaste sektorane utan eit 30-gradersvindauge i sveipet — 28,4 og 28,2 grader som brattaste 60 m — og lina sjølv peiler 169 til 180 grader ned. Ned ryggen, forbi det vesle vatnet, ned på flata og rundt magasinet på land att — 119 høgdemeter å gje tilbake har turen samla, det meste rundt vatnet og på anleggsvegen.",
      "Sørsidenedfarten Fri Flyt nemner — 35–45 grader ned mot Rottenvikvatnet — er ikkje denne lina, og kjelda seier sjølv kvifor med uvanleg tunge ord — «Sørsiden av fjellet har vært åsted for et par tragiske skredulykker med dødelig utfall», skriv han, og han skriv det i skildringa av normalruta, ikkje om varianten: steinparti kring 1000 moh må identifiserast på veg opp, og utkøyringa krev sikker is på eit vatn som er regulert. Denne guiden teiknar henne ikkje.",
      "Ver òg vaken vest og sørvest for varden: sveipa måler 34,3 og 32,5 grader i snitt der, med 46,6 og 51,6 som brattaste vindauge — fjordsida er alpin, og i flatt lys er kanten lett å koma for nær.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts faremoment er «utløpsområder og skavler», og det er presist: sjølve lina held 25,5 grader som brattaste samanhengande parti, men ho kryssar under brattare flanker — ryggformasjonen har småbratte parti kring 30 grader, og Normalruta II lenger nord er eksponert for løysneområde ovanfrå mellom 700 og 900 moh. Vel ryggen med augo oppover, ikkje berre nedover.",
      },
      {
        title: "Sørsida",
        body: "«Sørsiden av fjellet har vært åsted for et par tragiske skredulykker med dødelig utfall», skriv Fri Flyt — og han skriv det midt i skildringa av normalruta, rett etter flata på 650, ikkje om varianten. Åtvaringa gjeld heile sørsida slik du ser henne frå ryggen du går opp; nedfartsvarianten på 35–45 grader mot Rottenvikvatnet fører han sjølv som «Ned sørsiden ➌ Komplekst». Han ligg rett ved normalruta og freistar på veg ned. Målingane frå varden seier at alt vest om sør er alpint: SV 51,6 grader som brattaste vindauge, V 46,6, NV 41,0.",
      },
      {
        title: "Magasinet",
        body: "Rottenvikvatnet er regulert, og regulert is skal ikkje brukast — trekt ned vinterstid legg han seg i sprekker og holrom langs land. Lina går rundt vatnet på land i begge retningar, målt punkt for punkt, og den einaste grunnen til å vera på isen er å ha valt feil. Anleggsvegen og dammen er der fordi dette er eit kraftmagasin; les landskapet deretter.",
      },
      {
        title: "Før du går",
        body: "Fastdalstinden ligg i varslingsregionen Lyngen, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts eigen. Tida er ikkje: han set 5–6 timar, medan kortet ber 6–8 — appens eiga skala for 1270 høgdemeter og 7,3 km. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,187 L55,165 L77,151 L99,144 L125,137 L151,136 L181,137 L214,138 L225,138 L229,138 L233,138 L235,138 L252,138 L278,135 L304,138 L317,134 L344,130 L365,129 L381,119 L411,114 L433,111 L463,102 L488,86 L509,73 L530,59 L555,45 L585,27 L600,18",
      startLabel: "123 moh",
      endLabel: "1275 moh",
      distanceLabel: "7,3 km",
      caption: "1271 høgdemeter og 7,32 km frå Varto — anleggsveg, magasin rundt på land, og ryggen rett mot toppen på 1275.",
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
      "En middels skitur med en eksperts avslutning. 1390 høydemeter fra Fv91 opp en bred nordvestrygg som aldri blir brattere enn 26 grader — og så 1,7 kilometer eksponert rygg til fots fra Middagsaksla, med stegjern, isøks og et siste trinn som lokalt måler over 45 grader.",
    ascent: [
      "Fra parkeringa ved Fv91 nedenfor Vartavarhaugen, 65 moh, går ruta østover over Vartavarhaugen på 159 moh og krysser Tverrelva. Bjørka slipper taket rundt 390 moh, og over 403 moh er terrenget åpent hele veien.",
      "Derfra følger skisporet den brede nordvestryggen sammenhengende oppover. Terrengmodellen gir jevne 16 til 26 grader fra rundt 350 moh til Middagsaksla, uten bratte trinn: bandene mellom 500 og 1000 moh ligger alle på 19 til 21 grader i snitt. Det er en lang, jevn skitur, og den er lite skredutsatt så lenge du blir på ryggen. Flankene på begge sider er noe annet, og de er terrengfeller i dårlig sikt.",
      "På Middagsaksla, 1076 moh, stopper skituren. Mange setter fra seg skiene her; noen bærer dem til forvarden på rundt 1190 moh og lar dem ligge der. Turrapportene fra vinterbestigninger er samstemte om at ryggen videre går til fots — «over ca. 1100 moh måtte skiene byttes mot stegjern og isøks».",
      "De siste 1,7 kilometerne er eksponert nordvestrygg. Ryggkammen bølger seg oppover fra 1076 til 1393 moh med korte motfall underveis — 47 høydemeter til sammen over Middagsaksla, og ingen av dem mer enn ti om gangen på linja. Det er luftige parti, korte klyvepartier, og helt til slutt ei renne og en bratt topppyramide: den bratteste hundremeteren på hele turen ligger mellom 1300 og 1400 moh og måler 23,7 grader i snitt, mens det bratteste sammenhengende partiet er 33,3 grader og siste trinn lokalt er over 45.",
    ],
    descent: [
      "Ryggen tilbake til fots til Middagsaksla, og derfra ned nordvestryggen på ski til Vartavarhaugen og bilen. Fallretningen ned ryggen er målt til nordvest, 293 grader, og hellinga er 16 til 26 grader hele veien — jevn, oversiktlig kjøring uten trange partier.",
      "Vanligste feil: å behandle Middagsaksla som en pause i stedet for et vedtak. Er ryggen isete, eller er sikta dårlig, er det her turen slutter — skituren er uansett over, og det som ligger foran er 1,4 kilometer der en glipp ikke har noen utgang til sida. Å snu på Middagsaksla er ikke en avbrutt tur; det er en fullverdig tur i seg selv, og den riktige når ryggen er isete.",
      "Den andre feilen er å slippe seg ned en av flankene fra ryggen for å korte inn. Begge sider av nordvestryggen er bratte og samler snø; ryggen selv er linja, både opp og ned.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skituren opp nordvestryggen er lite skredutsatt: 16 til 26 grader jevnt fra rundt 350 moh til Middagsaksla, uten bratte trinn. Flankene på begge sider av ryggen er derimot bratte, og de er terrengfeller — i dårlig sikt er det å holde ryggen selve navigasjonsoppgaven. Over Middagsaksla er det ikke lenger skiterreng: bratteste sammenhengende parti måler 33,3 grader, siste trinn lokalt over 45, og bratteste hundremeter, 1300 til 1400 moh, 23,7 grader i snitt.",
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
      path: "M0,200 L29,192 L48,187 L72,188 L96,188 L120,183 L144,175 L158,169 L173,162 L197,155 L219,147 L240,140 L252,134 L273,126 L288,121 L307,112 L321,105 L345,94 L367,84 L382,76 L397,71 L417,62 L443,62 L469,59 L488,52 L514,51 L536,43 L555,40 L578,30 L594,24 L600,18",
      startLabel: "65 moh",
      endLabel: "1397 moh",
      distanceLabel: "5,6 km",
      caption: "1390 høydemeter og 5,42 km fra Fv91. Skituren slutter på Middagsaksla 1076 moh; de siste 1,7 km til fots gir tilbake 47 høydemeter underveis.",
    },
  },
  kavringtinden: {
    slug: "kavringtinden",
    intro:
      "Lyngseidets hustopp, og 1252 høydemeter rett opp fra fjorden. Rygg opp, Østrenna ned — den store, østvendte renna nord for toppen samler den beste snøen på fjellet og holder på den langt ut i mai.",
    ascent: [
      "Fra parkeringen ved Eidebakken, 62 moh, følger du skogsveien opp østsida av Gjerdelva. Du passerer Rødsteinen i bjørkeskogen rundt 200 moh og fortsetter opp ryggen øst for elva. Ruta krysser aldri Gjerdelva — går du over vann, har du gått feil.",
      "Skogen slipper taket ved 301 moh, og du går forbi Skihytta på 317. Mellom Rødsteinen og Skihytta må du gjennom et grunt søkk før stigningen tar seg opp igjen, og terrenget blir først ordentlig oversiktlig rundt 400. Skogsveiene fra Karnes, Solhov, Marieslett og Jensbakk kommer opp på den samme hylla, så hvilken du velger nede i bygda spiller mindre rolle. Herfra legger du kursen vestover mot nordøstryggen og kommer opp på kammen rundt 780 moh.",
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
      path: "M0,200 L23,200 L36,200 L60,200 L84,199 L109,199 L132,198 L145,194 L169,186 L182,183 L194,177 L213,172 L230,166 L255,158 L279,151 L303,141 L327,134 L340,131 L364,123 L376,119 L388,113 L412,101 L423,96 L430,92 L444,85 L461,78 L477,72 L486,67 L497,60 L510,56 L534,47 L546,43 L568,36 L580,29 L595,20 L600,18",
      startLabel: "48 moh",
      endLabel: "556 moh",
      distanceLabel: "2,2 km",
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
      "Fra skåla på rundt 595 moh skal du ikke rett nord opp fallinja. Målt rett nordover holder bakken 29 til 36 grader de første 180 høydemetrene, og mellom 713 og 814 moh måler den 38 til 52. Sporet legger seg i stedet østover i stigende skrå til rundt 670 moh og tilbake mot vestnordvest opp på skulderen ved 813 moh; slik holder linja seg under 30 grader. Bratteste hundremeteren på ruta ligger mellom 800 og 900 moh og måler 22,2 grader i snitt; bratteste sammenhengende parti på linja er 28,1 grader.",
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
      path: "M0,200 L32,189 L49,182 L73,173 L98,168 L121,158 L145,150 L161,144 L177,135 L193,129 L216,123 L234,121 L261,121 L289,121 L314,119 L338,117 L355,110 L377,101 L392,94 L411,91 L435,90 L459,84 L476,76 L500,65 L521,57 L540,47 L556,39 L578,29 L591,22 L600,18",
      startLabel: "102 moh",
      endLabel: "938 moh",
      distanceLabel: "3,4 km",
      caption: "840 høydemeter og 3,35 km fra Medfjordbotnvatnan; ruta går skrått opp fra skåla og holder 28,1 grader der fallinja ved siden av måler over 40.",
    },
  },
  breitinden: {
    slug: "breitinden",
    intro:
      "Senjas høyeste, 1049 høydemeter fra rasteplassen ved fjorden. Skituren slutter på skulderen 763 moh; de siste 244 høydemeterne er eksponert klyving på sørvestryggen, og det er den avslutningen som gir turen grad 4.",
    ascent: [
      "Start på rasteplassen i Svarthola langs Fv862, 30 moh, knappe seks kilometer øst for Senjahopen. De første to hundre høydemeterne går rett opp til nordenden av Svartholvatnet på 207 moh, og derfra østover over ryggen mellom vatnet og Breitindvatnet — et parti på rundt 400 moh der linja legger seg flatt før den stiger igjen. Ved Breitindvatnet følger linja nordbredden, over 467 moh og 500 moh, i stedet for å gå rett over isen. Den gjorde det siste inntil nylig: 315 meter på vatnet på 474 moh, opptil 40 meter fra land, under den flanken guiden selv kaller en terrengfelle. Vatnet er naturlig og uregulert, men det finnes ingen skirutebeskrivelse som sender deg ut på det, og her er vatnet så smalt at land ligger 80 meter unna.",
      "Fra nordøstsida av Breitindvatnet på 481 moh begynner vestflanken. Nederst er den slak — rundt 24 grader opp til 550 moh og 29 videre til 620 — men over det bratner den: 36 grader i snitt mellom 620 og 680 moh, 41 mellom 680 og 720, og rett under skulderen måler fallinja 50 til 59 grader. Sommerbeskrivelsen kaller det samme partiet smale og utsatte berghyller, og vatnet ligger under hele henget. Den bratteste hundremeteren på ruta ligger mellom 600 og 700 moh og måler 22,2 grader i snitt; bratteste sammenhengende parti på linja er 39,4 grader, og det ligger i toppblokka.",
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
      path: "M0,200 L26,190 L48,180 L63,172 L83,167 L102,166 L125,167 L153,158 L185,144 L211,137 L242,129 L268,132 L287,124 L313,119 L344,115 L370,115 L389,112 L408,106 L434,95 L457,87 L472,77 L489,67 L507,58 L529,49 L555,41 L568,34 L586,26 L600,18",
      startLabel: "30 moh",
      endLabel: "1007 moh",
      distanceLabel: "4,2 km",
      caption: "1031 høydemeter og 4,21 km fra Svarthola; skiene blir igjen på skulderen 763 moh, 244 høydemeter under toppen.",
    },
  },
  "tredje-svanfjell": {
    slug: "tredje-svanfjell",
    intro:
      "664 høgdemeter og 2,85 km rett frå parkeringslomma i Kaperdalen — «Tredje Svanfjell er en klassiker i Kaperdalen. Fin tur for nyfrelste toppturister, som også er en flott mørketidstur», skriv Fri Flyt, og tala er samde: brattaste hundremetersbeltet 23,4 grader mellom 500 og 600 moh, brattaste samanhengande parti 29,9, og lina gjev att null høgdemeter. Namnet finst ikkje i registeret — Svanfjella er uformelt nummererte — men Fri Flyt publiserer sin eigen GPS-posisjon for toppen, og han les 898 i terrengmodellen på metern.",
    ascent: [
      "Parker i lomma langs vegen gjennom Kaperdalen — Fri Flyt skriv «Fv.232», men vegen heiter i dag fv. 7862 Kaperdalsveien; lomma les 236 moh, og kjeldas 660 høgdemeter impliserer nøyaktig denne starten. Skogen sluttar tidleg, og terrenget opnar seg mot aust.",
      "Fyrste delen går opp mot det vesle skaret nord for punkt 504, slik kjelda seier — punktet les 479 og skaret 582 i terrengmodellen. Lia opp dit ber det brattaste hundremetersbeltet på turen, 23,4 grader i snitt mellom 500 og 600 moh.",
      "Frå skaret stig terrenget jamt mot fortoppen — småkupert, med stigning under 30 grader heile vegen, og målinga stadfester det: 29,9 som brattaste samanhengande parti. Fortoppen kjelda set på 870 les 862,9.",
      "Frå fortoppen står att om lag 30–40 høgdemeter, seier kjelda — målt 36. Han nemner eit lite fall over fortoppen; lina her går over skuldra på 862,9 og gjev ikkje att noko målbart — og varden på 899 har Senjas ytterkyst på den eine sida og Ånderdalen på den andre. I desember er dette mørketidsturen kjelda lovar: kort, open og med heimveg det ikkje går an å rota vekk.",
    ],
    descent: [
      "Ned same trasé som opp, med variasjonsrom etter ønske, slik kjelda seier. Køyringa vender vest, heim mot Kaperdalen — Fri Flyts faktaboks seier S-SØ, men normalruta hans går opp frå vest og ned same veg, og kortet ber det målte.",
      "Variasjonsrommet har ein kant: søraustsida fell 56,3 grader på det brattaste berre 180–240 m frå varden, og austsida 43,3 på same avstand. Dei høyrer ikkje til denne turen — vestflanken du kom opp er køyringa, og ho er open og jamn heile vegen ned til lomma. Kjelda skildrar sjølv ein brattare variant: «det er mulig å legge linjer mer rett sør ned i gryta sørvest for toppen … terreng som er 30–40 grader … vær også obs på at det her er noen klippepartier». Sveipet er samd — sørvest måler 26,7 grader i snitt med 37,0 som brattaste vindauge — og klippepartia er grunnen kjelda sjølv gjev for å la henne vera.",
      "Null høgdemeter å gje att og under tre kilometer kvar veg: dette er turen der heile dagen er stigning og køyring, og difor klassikaren for fyrstegongs toppturistar — og for desemberdagar med to timar lys.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt set KAST 1 – Enkelt med faremoment «ingen spesielle», og målinga er samd for sjølve lina: 29,9 grader som brattaste samanhengande parti, 23,4 som brattaste hundremetersbelte mellom 500 og 600 moh. Det er så snilt som ein 660-meterstur får vorte — men KAST 1 er ei linevurdering, ikkje eit fripass: lia opp mot skaret er bratt nok til å gli i hardt føre.",
      },
      {
        title: "Kantane",
        body: "Alvoret ligg utanfor sporet: søraustsida fell 56,3 grader på det brattaste 180–240 m frå varden og austsida 43,3 grader på same avstand. I mørketid og flatt lys er kantane poenget med kompasset — vestflanken du kom opp er einaste køyresida, og ho er grei å finna att: ned mot dalen, ikkje mot havet.",
      },
      {
        title: "Mørketidsturen",
        body: "Kjelda kallar turen «en flott mørketidstur», og desember–mai er hans eigen publiserte sesong. Mørketid er si eiga vurdering: to timar dagslys gjev lite margin for feil, og eit fjell utan spesielle faremoment i mars kan vera eit navigasjonsfjell i desember. Kort tur og null attgjeven høgd er nettopp det som gjer han rett for dei mørke vekene — med hovudlykt i sekken likevel.",
      },
      {
        title: "Før du går",
        body: "Tredje Svanfjell ligg i varslingsregionen Sør-Troms, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–mai er Fri Flyts eiga. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L19,197 L48,186 L67,176 L95,168 L114,160 L142,148 L161,145 L180,143 L209,137 L228,134 L256,133 L275,131 L294,124 L306,117 L323,107 L335,102 L358,91 L378,88 L389,88 L408,83 L427,77 L437,74 L456,65 L477,55 L503,42 L522,34 L541,28 L556,26 L579,22 L598,18 L600,18",
      startLabel: "236 moh",
      endLabel: "899 moh",
      distanceLabel: "2,8 km",
      caption: "664 høgdemeter og 2,85 km frå Kaperdalen — skaret nord for punkt 504, fortoppen på 870, og null høgdemeter å gje att.",
    },
  },
  istinden: {
    slug: "istinden",
    intro:
      "1432 høgdemeter og 5,24 km frå Tindelva ved Iselvmoen til Vestre Istinden, det høgaste av Istindan og landemerket i Indre Troms. Turen er lang og høg meir enn han er bratt: brattaste hundremetersbeltet måler 21,6 grader mellom 1400 og 1500 moh, og brattaste samanhengande parti 27,7 grader — men ruta går på ein rygg med Fri Flyts «nordveggen» på den eine sida og botnen med breen på den andre, og det er kantane, ikkje snitta, som avgjer dagen.",
    ascent: [
      "Frå den store parkeringa der Tindelva kjem ned ved Iselvmoen på vegen mot Fjellstad, 80 moh. Fjellstadvegen er kartlagd som offentleg veg med fast dekke, så starten er brøytt året rundt. Lina går på sørsida av elva, slik båe kjeldene seier, og følgjer den kartlagde stien opp den bratte bjørkelia — same sti ut.no kallar «tydelig og bra, men bratt», og som er skilta med grønt turskilt frå parkeringa. Belta måler 18,2 grader frå 100 til 200 moh, 21,0 frå 200 til 300 og 19,2 frå 300 til 400.",
      "Skogen sluttar på 558 moh etter Kartverkets klassar, med ope område frå 568, og skoggrensa kjem 1,81 km ute. Her flatar det av: beltet frå 500 til 600 moh måler 13,9 grader og beltet frå 700 til 800 berre 8,4 over 650 meter grunn. Det er kvilesteget ut.no skildrar ved skuldra, og det er staden å sjå seg om — nordveggen står rett i front herfrå.",
      "Frå 2,93 km og 788 moh går lina innover i gryta under veggen nokre hundre meter, slik Fri Flyt seier, før ho tek opp på ryggen. Ryggen går på vestsida av veggen, og han går òg vest for breen i botnen. Det er ikkje ein detalj: både Fri Flyt («ryggen som går opp på vestsiden av veggen») og ut.no («til høyre for bekken og breen») sender deg utanom isen, og brepolygonet ligg 898 til 1155 moh rett aust for lina. Næraste passering er 14 meter frå brekanten, på 4,27 km og 1152 moh. Lina har 0 meter på breen, kontrollert både mot Kartverkets terrengklasse og mot OSMs brepolygon.",
      "Over 1200 moh reiser ryggen seg jamt — 17,5 grader frå 1200 til 1300, 21,2 frå 1300 til 1400 og 21,6 frå 1400 til 1500, det brattaste beltet på turen. Det brattaste samanhengande partiet ligg i same høgdelaget: 27,7 grader mellom 1286 og 1304 moh, 4,73 km ute, altså ein knapp halvkilometer før varden.",
      "Fri Flyt åtvarar: «Hold god avstand fra hengeskavlene ut over Nordveggen», og målinga seier kvifor — nordsveipen frå varden held 34,8 grader i snitt og 60,9 som brattaste 60 meter berre 50 til 110 meter ut. Varden på 1489 moh, som registeret fører som Vestre Istinden. Siste stykket er ofte avblåst, og då må skia kanskje berast — det er kjeldas eiga formulering, og det er den vanlegaste grunnen til at dagen tek lengre tid enn tala tilseier.",
    ],
    descent: [
      "Ned same ryggen. Merk retninga: dei fyrste hundre metrane frå varden går lina vestover, 262 til 276 grader, før ho svingar nordvestover ned ryggen — over heile fallet til skoggrensa peikar ho 344 grader. I skodde er det den fyrste vestlege biten som må sitje, for nordsida av kammen er nordveggen.",
      "Frå varden til skoggrensa er det 931 høgdemeter, mot dei «omtrent 900 meter» Fri Flyt oppgir ned til skogen. Så er det bjørkelia att, den same du gjekk opp, og 23 høgdemeter er alt turen gjev tilbake undervegs.",
      "Fri Flyt si vanlegaste nedkøyring er ei anna linje enn denne: renna på 30–35 grader mot sørvest frå toppen. Sørvestsveipen frå varden måler 30,6 grader i snitt over 800 meter, som stemmer med kjelda, men brattaste 60 meter i han held 40,0 grader 60 til 120 meter ut. Den renna er ikkje målt som eiga rute her, og kortets aspekt gjeld ruta si eiga nedkøyring. Toppegg-varianten frå Søre Istinden er heller ikkje denne ruta — det er berre for den Fri Flyt nemner isøks og stegjern.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts eige faremoment er presist om kva som er kva: «Skredfare må vurderes nøye på nedkjøringene i botnen mellom Søndre og Vestre Istind og ned fra Søndre Istind. Ryggen opp normalveien er relativt skredsikker. Hold god avstand fra hengeskavlene ut over Nordveggen.» Ruta her er ryggen, altså den delen kjelda kallar relativt skredsikker — men «relativt» er kjeldas ord, ikkje ein garanti, og botnen han åtvarar mot ligg 14 meter frå lina på det næraste.",
      },
      {
        title: "Nordveggen og skavlane",
        body: "Nordsveipen frå varden held 34,8 grader i snitt dei fyrste 800 metrane, med 60,9 grader som brattaste 60 meter berre 50 til 110 meter ut; nordaustsida måler 30,5 i snitt og nordvestsida 28,0 med 65,1 grader 190 til 250 meter ut. Skavlane byggjer ut over denne kanten, og dei er det Fri Flyt ber deg halde god avstand frå. Ryggen er brei nok til å gå, men kanten er ikkje der augo trur når det er flatt lys.",
      },
      {
        title: "Breen i botnen",
        body: "Botnen mellom Vestre og Søre Istinden ber ein bre — Kartverket klassar han som SnøIsbre, OSM har polygonet way/375260442 mellom 898 og 1155 moh, og ut.no nemner han i vegskildringa. Lina går utanom, vest for han, med 14 meter som næraste passering. Ho er ikkje lagd for å krysse is, og ho skal ikkje brukast som om ho var det: nedkøyring i botnen er den eine staden Fri Flyt namngir som skredfarleg.",
      },
      {
        title: "Før du går",
        body: "Vestre Istinden ligg i varslingsregionen Indre Troms, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer skisesong for denne turen: ut.nos jul–sep gjeld fotturen, og Fri Flyt har ikkje sesongfelt. Kortets feb–mai er difor redaksjonell. Kortets 5–7 t er pipelinens eiga utrekning; Fri Flyt oppgir 6–7 timer. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L36,199 L64,191 L88,182 L109,173 L135,163 L150,157 L165,151 L186,144 L217,135 L243,128 L266,119 L289,115 L313,109 L336,108 L356,104 L376,99 L392,91 L413,84 L434,77 L459,71 L489,61 L506,57 L529,49 L546,42 L558,37 L581,27 L600,18",
      startLabel: "80 moh",
      endLabel: "1489 moh",
      distanceLabel: "5,2 km",
      caption: "1432 høgdemeter og 5,24 km frå Tindelva, med det brattaste — 27,7 grader mellom 1286 og 1304 moh — på ryggen ein knapp halvkilometer før varden.",
    },
  },
  moysalen: {
    slug: "moysalen",
    intro:
      "Fra 23 moh til 1264, og 1596 høydemeter for å komme dit — 355 av dem gir du fra deg underveis, og 120 av dem på ett strekk ned til Grønnvatnet. Vesterålens høyeste er en av de få turene i denne appen som starter ved sjøen og ender på en rygg der folk tar av seg skiene. Friflyt setter den til KAST 3, 11 til 18 timer, og krever isøks og stegjern.",
    ascent: [
      "Fra den store parkeringa langs E10 på sørsida av Litlvatnet, 23 moh, går ruta nordover gjennom vassdraget. E10 er helårsveg, og dette er startpunktet Friflyt bruker — de guida sommerturene fra Møysalen Nasjonalparksenter begynner med båt fra Hennes inn i Lonkanfjorden, men det er en annen tur. De første to kilometrene er flate: bandet 100 til 200 moh måler 2,9 grader over 2165 meter grunn. Skogen slipper taket sent for å være Vesterålen: siste vertex med terrengklasse Skog ligger på 234 moh, 2900 meter ute, og neste vertex, 240 moh, er myr. Bjørka nede i dalen står i lag med myra, så du går inn og ut av den hele veien opp — 55 av rutas 333 punkter er skog, fra 12 til 234 moh.",
      "På 154 moh går linja 90 meter over Forkledalsvatnan, høyst 14 meter fra land, og på 391 moh 247 meter over Rundvatnet, høyst 71 meter fra land. Begge er naturlige vann — DTM1 gir terrengklasse Innsjø, og OSM-polygonene bærer ingen reservoartagger. På 328 moh kommer den tredje: 225 meter over Grønnvatnet, opptil 86 meter fra land. Det er det største av de tre, og det er også vannet rutebeskrivelsen navngir.",
      "Å komme til Grønnvatnet koster deg 120 høydemeter. Linja går over høyde 450 — 450,7 moh målt — og faller så fra 448 til 328 over 736 meter grunn, det største sammenhengende fallet på veg opp. Dette er ikke en feil i linja, det er turen: netto stigning fra sjøen til toppen er 1241 meter, men det du faktisk går er 1596, og differansen er denne høyden og ryggene etter den.",
      "Fra Grønnvatnet stiger ruta jevnt, og her er det samme høyde 450 du nettopp gikk over som er holdepunktet: Friflyt sier at du skal ha den til høyre, altså øst for deg. Det er én høyde og ikke to — et åttevegs sveip fra punktet viser at bakken faller mot nord, nordøst og nordvest, ned mot vatnet, og stiger mot sør og sørøst til 513 og 516 moh. Det er en bred skulder, ikke et skar. Videre opp bekkedraget er den lange arbeidsstrekninga: bandet 800 til 900 moh måler 21,0 grader over 253 meter grunn og bandet 900 til 1000 moh 21,0 grader over 242, og det bratteste 400-metersvinduet på hele turen ligger her, 22,0 grader fra 774 til 939 moh.",
      "Isen ligger lavere enn du kanskje venter. Linja går over mark klassifisert som SnøIsbre fra 752 til 898 moh, sammenhengende over 405 meter grunn mellom 7700 og 8100 meter ute, uten et eneste bart punkt imellom. Peilinga fra toppen til den strekninga er 184 til 216 grader — sør til sørvest — og avstanden 422 til 582 meter. Korridorforskinga kalte vegpunktet «breen sørøst for Møysalen, ~1025 moh»; på det punktet gir terrengmodellen 1026,59 moh med terrengklasse ÅpentOmråde, og ringprøver 300, 500, 700 og 900 meter ut fra toppen finner SnøIsbre bare mot øst og mot sørvest. Sørøst er bar mark hele veien. Friflyt skriver at «selv om det kalles bre er det ikke åpne sprekker», og at den går normalt uten tau. Det bratteste 30-meterssteget oppover, 41,9 grader fra 1036 til 1063 moh, ligger 8500 meter ute — altså over isen og ikke under den.",
      "Over isen fortsetter ruta nordvest opp toppryggen, og ryggen er ikke jevn. 9332 meter ute stiger linja til 1170 moh og faller så 51 meter til 1119 over 27,3 meter grunn — et hakk, ikke en målefeil: tolv DTM1-punkt med 2,3 meters mellomrom gjennom fallet gir en sammenhengende kurve fra 1170,0 til 1119,2, og et rutenett på 40 meter til hver side gir fra 1186 til 1055 moh, så nabolinjene er ikke slakere. Det er dette som gjør at største steg langs ruta måler 45,9 grader, og det er her isøksa og stegjerna hører hjemme. De siste 500 metrene går på peiling 333 grader og stiger 124 meter; det bratteste 200-metersvinduet på turen, 24,3 grader fra 1189 til 1264 moh, er selve toppryggen.",
    ],
    descent: [
      "Ned samme vei. Fallvekta gjennomsnittsretning er 193 grader — sør — og det stemmer med kilden: Friflyt kaller nettopp Vestryggen «sørvendt bratt terreng», og beskriver alle de andre linjene på fjellet som sørvendte eller sydvendte. Kortet sa lenge sørøst; det tallet hvilte på et vegpunkt som ble kalt bre og ikke er det, og er rettet. Over hakket i ryggen går de fleste til fots.",
      "Vanligste feil er å regne turen i høydemeter i stedet for i timer. 1596 høydemeter og 9,75 kilometer hver veg, med et bratt parti under breen og en rygg som ofte er avblåst og hard, er 11 til 18 timer etter Friflyt. Snur du på breen, har du fortsatt 120 høydemeter opp fra Grønnvatnet igjen på hjemvegen. Den andre feilen er å tro at et sørvendt bratt parti på 21 grader over lang strekning holder seg stabilt gjennom dagen: tidspunktet avgjør om du møter gjennomvåt eller gjennomfrossen snø der.",
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
      path: "M0,198 L25,195 L44,180 L69,179 L94,178 L119,182 L140,179 L163,175 L188,164 L211,158 L235,154 L260,145 L288,138 L308,140 L330,153 L357,152 L385,143 L407,133 L427,122 L446,105 L468,95 L493,76 L506,64 L523,51 L537,54 L554,43 L571,37 L587,30 L600,18",
      startLabel: "23 moh",
      endLabel: "1264 moh",
      distanceLabel: "9,7 km",
      caption: "1596 høydemeter fra E10 ved Litlvatnet til 1264 moh, 355 av dem gitt fra seg underveis og et 51 meters hakk i toppryggen.",
    },
  },
  strandtinden: {
    slug: "strandtinden",
    intro:
      "1156 høydemeter og 5,86 km fra E10 ved havet til toppen på 1076 moh — Harstad-områdets store klassiker, og et fjell uten en slak side. Brattaste hundremetersband på ruta er 19,8 grader mellom 600 og 700 moh og brattaste steg 29,1 mellom 736 og 761, men flankene rundt måler 40 til 64 grader i sine brattaste vindu. Ruta tar toppen fra vest fordi vest er den eneste kanten som ikke gjør det.",
    ascent: [
      "Start langs E10 der vegen er nærmest utløpet av Heggedalen, 21 moh. Kilden gir ikke ett punkt, men en strekning: «Her er det flere muligheter langs E10, avhengig hvor mye som er brøytet», med en advarsel som er verdt å ta med seg — «dette er en høyt trafikkert vei med 80 km/t og få rette strekninger så vær forsiktig langs vei og parker heller litt lengre sør og traverser på øversiden av veien enn å skape farlige situasjoner langs veien». Vegen under fjellet heter Strandstindvegen, etter fjellet.",
      "Normalruta følger Heggedalen på ryggen mellom de to elvene. Rundt 146 moh går ruta over på nordsida av elva, og de to punkthøgdene rutebeskrivelsen navigerer etter dukker opp der de skal: slukta ved «høyde 505» måler 509,6 moh og «høyde 570» måler 570,3 — 234 meter fra hverandre. Kartverket fører siste skog på 143 moh og åpent terreng fra 157, så mesteparten av turen går i åpen fjellside. De første hundre høydemeterne er de bratteste i dalbunnen, 14,7 grader, og så slakner det til 8,0 og 10,6.",
      "Fra 570 svinger ruta sørover og holder østsida av bollen. Der ligger brattaste bandet på turen — 19,8 grader fra 600 til 700 moh over 270 meter grunn — og brattaste steget, 29,1 grader mellom 736 og 761. Bollen flater ut rundt 805 moh, og der gjør ruta det Fri Flyt sier: «Letteste vei til toppen er å holde høyre (vest) fra nå og bestige toppen via ryggen fra høyre (vest).» Linja går vestover langs benken — 1092 meter grunn på 5,4 grader mellom 700 og 800 moh — kommer opp på nordvestryggen ved 886 moh og følger ryggen over 952 og 1040 til toppen. De siste 600 metrene peker 135 grader: du kommer opp fra nordvest.",
    ],
    descent: [
      "Ned samme vegen: ryggen ned til benken, benken østover og nordsida ned Heggedalen. Det er linja fjellet er kjent for — «nedkjøringen er samme rute som opp og er klassikeren der du kan dundre på og oppnå virkelig fri flyt og brede glis» — og i sesongen kjører man helt ned til veien ved havet. Snøen på nordsida ligger lenge nok til at midnattssol i juni ikke er uvanlig.",
      "Å gå rundt koster det å gå rundt koster. Den første korridoren tok toppen rett opp nordaustribba, og den linja var 4,77 km med 1090 høydemeter; over vestryggen er turen 5,86 km med 1156 og 101 meter gitt tilbake underveis. Fri Flyt er tydelig på hvorfor: «Det er helt klart mulig å gå opp på andre siden, men den er mer eksponert.» Ribba måler 1010,2 moh 150 meter fra toppen mot nordøst der ryggen måler 1039,8 mot nordvest — den er brattere hele vegen opp.",
      "Rett nord for varden er det uansett bratt: 40,9 grader i brattaste 60-metersvindu bare 20 til 80 meter ut, med 24,8 grader i snitt ut til en kilometer. Der ligger også snøen som blir liggende — Kartverket fører terrengklassen SnøIsbre på nordsida fra rundt 1050 moh og nedover, mens ryggen ruta går på er bar mark i alle de seksten siste vertexene. De tre andre kantene er alvorlige: sør måler 30,6 grader i snitt med 63,9 grader i vinduet 20 til 80 meter fra varden, sørøst 30,9 med 62,5, øst 29,0 med 54,9, og sørvest 24,1 med 56,0. Fri Flyts to andre linjer — Kvanntoa i nordøst og Kvannto i øst — har partier på 45 grader og rappellfeste, og de er ikke ruta dette kortet beskriver.",
    ],
    avalanche: [
      {
        title: "Bollen",
        body: "Fri Flyt har ett faremoment på normalruta, og det er utvetydig: «I bollen er det flere ganger gått store skred, så velg dager med stabil snø.» Bollen er søkket ruta krysser mellom høyde 570 og benken på 805 moh, og det er der brattaste bandet på turen ligger — 19,8 grader fra 600 til 700 moh. Rutebeskrivelsen sender deg langs østsida av den, ikke gjennom midten.",
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
      path: "M0,200 L20,194 L41,184 L60,180 L83,179 L106,168 L129,163 L147,157 L169,149 L193,143 L216,135 L239,130 L258,123 L276,117 L294,107 L324,98 L345,85 L368,79 L391,71 L405,66 L432,69 L460,66 L479,59 L501,50 L524,50 L541,42 L553,39 L577,28 L600,18",
      startLabel: "21 moh",
      endLabel: "1076 moh",
      distanceLabel: "5,9 km",
      caption: "1156 høydemeter og 5,86 km fra E10 på 21 moh gjennom Heggedalen over 146, forbi slukta på 510 og høyde 570, over bollen til 805 og vestover benken til nordvestryggen på 886, 952 og 1040.",
    },
  },
  rombakstotta: {
    slug: "rombakstotta",
    intro:
      "Narviks landemerke, og en lang dag i fire tydelige etapper — skog, vann, dalføre og rygg. Turen krever at du er komfortabel med en kort klatring på toppblokka.",
    ascent: [
      "Parkeringen er ved veibommen i Forselvveien over Djupvik. Gå forbi bommen og fram til veien slutter i det gamle steinbruddet på 141 moh, og hundre meter videre i samme retning før du legger deg inn i skogen. De første tre hundre høydemeterne er bratte og tette; følg det gradvis slakere terrenget opp mot venstre til du står ved Pumpvatnet på 325 moh.",
      "Kryss vatnet på isen og forlat det i sørøstre hjørne, der en gammel skogsvei tar deg inn i bekkedalen langs Forsneselva mot Forsnesvatnet. Skogen slipper taket på 457 moh, og resten av dalen går i åpent terreng. Ved dalhodet rundt 650 moh, nord for Forsnesvatnet, svinger du østover inn i den lille dalen mot Isvatnet.",
      "Isvatnet ligger på 820 moh. Rund det på nordsida — der går en sammenhengende benk på fire til tjuefire grader som tar deg østover fra 850 til 950 moh uten å berøre noe bratt. Hold benken hele veien. Skulderen rett øst for vatnet, nede til høyre for deg, er et bergband som måler 53 til 63 grader.",
      "Fra 950 moh fortsetter benken østover til du kommer opp på sørøstryggen rundt 1145 moh. Derfra følger du krona nordvestover til toppen. De siste tretti meterne er ikke skiterreng: et kort, bratt snøfelt og to korte partier med enkel klatring. Isøks er verdt å ha med, og stegjern hvis snøen er hard; tau trenger du ikke.",
    ],
    descent: [
      "Ned igjen samme vei. Kjøringen er delt opp i mange korte bakker heller enn én lang — fra ryggen ned til Isvatnet, over benken, ned den lille dalen og gjennom bekkedalen til Pumpvatnet. Vil du ha noe brattere, starter Rombaksrennene i skaret på 1070 moh rett øst for toppen. De ser brattere ut enn de er, men de er skredterreng, og de faller nordover mot Rombaken — ikke tilbake til Isvatnet.",
      "Vanligste feil: å tro at det går an å kjøre rett av toppen. Det gjør det ikke. Nordsida er Rombaks-S'en, og den måler 52 grader i snitt de første fire hundre meterne, med partier over 70 — videre 41 grader hele veien ned mot Rombaken. Den er så eksponert at et fall kan bli fatalt, og den er en linje for folk som har kjørt den før. Nordøst og øst er nesten like bratt, 48 og 44 grader, og fører ned i Rombaksrennene. Og vest, som ser ut som en snarvei tilbake til benken, går inn i et bergband på over 60 grader mellom 1060 og 1090 moh. Hold krona sørøstover til du er nede på 1145 moh og ser Isvatnet.",
      "Under skoggrensa på 457 moh blir det tett igjen. Følg oppsporet ned til veienden — skogen her er bratt og uoversiktlig, og det går fortere i eget spor enn å lete etter en bedre linje.",
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
  "varden-smaatindan": {
    slug: "varden-smaatindan",
    intro:
      "825 høgdemeter og 5,04 km frå Eidet ved Kabelvåg til toppen Fri Flyt kallar den mest populære toppturen på øygruppa. Kortet ber begge namna fjellet har i registeret — Varden og Småtindan — og tala er ærlege om kva turen er: brattaste hundremetersbeltet måler 22,8 grader mellom 600 og 700 moh, det brattaste samanhengande partiet 32,3, og lina gjev tilbake 127 høgdemeter undervegs, det meste av det i skaret rundt Ørntinden og på eidet mellom to vatn som ikkje kan føresetjast frosne.",
    ascent: [
      "Frå E10 vest for Kabelvåg tek du over brua med skilt mot Eidet; den kartlagde Karlsvågen-parkeringa ligg om lag 400 meter frå hovudvegen, på 2 moh. Lysløypa — Damveien — byrjar 120 m nordaust og går nordover dalen langs austsida av Karlsvatnet.",
      "Vatna avgjer den fyrste kilometeren, og dei fortener kvar si setning: Karlsvatnet ligg på 12 moh ein snau kilometer frå havet, og Stor-Kongsvatnet innanfor er regulert — begge er målt, og lina står ikkje på nokon av dei. Ho forlèt løypa før vatnet og kryssar det tørre eidet mellom dei to på 29 moh, over myra vest for det på 24, og bort til foten av Aksla på 20 moh. 0 meter på vatn, målt mot Kartverkets klassar og OSM-polygona.",
      "Aksla er ryggen opp: frå foten på 20 moh til 141, vidare til rett under Ørntinden på 342 — skogen sluttar alt på 219 moh etter Kartverkets klassar, så mesteparten av ryggen er open. Fri Flyt seier «Hold til høyre rundt toppen av Aksla» — ryggen han kallar Aksla står som Ørntindaksla i registeret og toppar på 316 moh — og målinga seier kva omvegen kostar: skaret vest for han les 293 moh, om lag 24 høgdemeter å gje att mot å klyva over. Ørntinden sjølv, 398 moh, ligg sør for skaret og vert liggjande att.",
      "Frå skaret held lina vestover flanken: 341, 441 og 565 moh på veg mot toppen, med det brattaste hundremetersbeltet — 22,8 grader i snitt — mellom 600 og 700. Fri Flyt åtvarar om at henget kring den øvre lina stig 35–40 grader; sporet held seg slakare, men flankane ved sidan av gjer ikkje. Ein kartlagd sti går òg til toppen, og lina er ikkje på han her: mellom 3,87 og 4,34 km ute ligg ho opp til 367 meter frå stien, før dei møtest att på 602 moh. Stien står som fotsti i OSM utan vinterstatus, og i sjiktet 330 til 470 moh er han den slakaste av dei to — brattaste tretti-metersteget hans måler 20,8 grader mot linas 24,9.",
      "Varden på 700 moh — registeret har både Varden (Ås) og Småtindan (Fjell) på toppunktet, og den klatra cella les 700,5 mot publiserte 700. Massivets høgaste punkt er forresten ein annan tind — Stortinden, 732 moh, 600 meter lenger sørvest; turmålet er Varden, og det er dit skisporet går.",
    ],
    descent: [
      "«Samme rute ned for maksimal sikkerhet», seier kjelda, og nedkøyringa byrjar forsiktig: rett kring varden stuper det i nesten alle retningar — nordvest 60,7 grader og vest 53,8 berre 20–80 m ut, aust 49,3 grader 10–70 m ut. Fri Flyt seier sjølv at køyringa byrjar om lag 50 meter under toppen, og målingane er samde.",
      "Frå flanken er det jamn køyring ned til skaret og rundt Ørntinden — beste partiet er frå toppen ned mot Aksla, seier kjelda — og så ryggen ned til eidet. Hugs att-stigninga: skaret og eidet gjev deg om lag 50 og 20 høgdemeter å ta att på heimvegen.",
      "Vestsidevarianten mot Lyngvær, som kjelda nemner, krev tilrettelagd transport frå Olderfjorden og er ikkje denne lina. Frå eidet er det løypa langs Karlsvatnet attende til parkeringa — på land heile vegen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt set KAST 2 – Utfordrende, og målinga av lina seier 32,3 grader som brattaste samanhengande parti — det ligg lågt, mellom 127 og 155 moh på ryggen opp — og 22,8 grader som brattaste hundremetersbelte, mellom 600 og 700 moh. Hans eiga åtvaring gjeld flankane: «i øvre deler stiger henget 35-40 grader bratt» — det er terrenget kring sporet, og linevalet på den øvre flanken er der dagen vert avgjord.",
      },
      {
        title: "Kolbeindalen og skytebanen",
        body: "Fri Flyts faremoment for nettopp denne ruta er lina sjølv: «Skredutsatte områder i øvre deler ned fra salen». Salen er skaret på 293 moh, og dei øvre delane er flanken lina går opp og ned — brattaste hundremetersbeltet 22,8 grader, og flankane ved sidan av 35–40 etter Fri Flyt sjølv. Den andre skildringa hans legg til dalen nord for ryggen: «Skredfare i Kolbeindalen», skytebane i botnen, og «midt i dalen – der elva renner – er det tidvis svært stor skredfare». Varianten «inn til Store Kongsvatnet» går inn i han; denne lina gjer det ikkje — men salen ho kryssar er kjeldas eige skredpunkt.",
      },
      {
        title: "Toppen",
        body: "Varden er ein tind, ikkje ei hei: nordvestsida fell 60,7 grader og vestsida 53,8 berre 20–80 m frå varden, austsida 49,3 grader 10–70 m ut, og sørsida 57,9 grader 220–280 m ut. I skodde er toppartiet ein stad å snu tidleg — det finst ingen slak sektor å rota seg ut i.",
      },
      {
        title: "Vatna og vêret",
        body: "Karlsvatnet ligg på 12 moh ved kysten og Stor-Kongsvatnet er regulert — isen på det fyrste kan ikkje føresetjast, og på det andre skal han ikkje brukast. Lina kryssar eidet mellom dei på land, målt punkt for punkt. Varden ligg i varslingsregionen Lofoten og Vesterålen, ein A-region med dagleg skredvarsel — sjekk varsom.no. Ingen kjelde publiserer sesongmånader; kortets jan–apr er lånt frå appens andre Lofoten-turar, og guiden seier det. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,199 L46,196 L69,195 L92,195 L113,196 L139,195 L166,191 L192,194 L215,196 L235,192 L257,178 L275,165 L299,147 L319,132 L338,125 L358,114 L374,113 L394,122 L414,123 L439,119 L460,107 L480,96 L503,91 L530,73 L552,59 L572,44 L588,30 L600,18",
      startLabel: "2 moh",
      endLabel: "700 moh",
      distanceLabel: "5,0 km",
      caption: "825 høgdemeter og 5,04 km frå Eidet ved Kabelvåg — langs Karlsvatnet på land, rundt Ørntindaksla, og austflanken til varden på 700.",
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
  midtitinden: {
    slug: "midtitinden",
    intro:
      "1050 høgdemeter og 4,15 km, kvar einaste meter av fjellet frå havnivå: parkeringa ved Sagelva på rv80 les 11 moh, og varden 1060. Fri Flyt kallar Midtitinden — eller Mjønestinden — ein av dei mest populære skitoppane rundt Bodø, og tala forklarar kvifor: brattaste hundremetersbeltet måler 19,1 grader mellom 900 og 1000 moh, det brattaste samanhengande partiet 26,9, og lina gjev tilbake to meter på heile turen. Registeret ber begge punkta: Topp-punktet Midtitinden står 294 m nordaust og les berre 983 moh, medan Fjell-punktet Mjønestindan står 15 m frå det høgaste punktet og les 1057. Fri Flyts «Mjønestinden» er altså registerets eige namn på sjølve toppen — og det er dit lina går.",
    ascent: [
      "Start ved den store avkøyringa på rv80 ved Kleivberget, nordaust for utløpet av Sagelva — parkeringslomma er kartlagd og les 11 moh. Gå nordover gjennom hyttefeltet til den øvste hytta, den Fri Flyt kallar Geilo, på 54 moh — skogen her er den einaste på turen, og Kartverkets klassar seier han sluttar alt på 191 moh.",
      "Frå hytta held du nordnordaust i om lag ein kilometer, slik kjelda seier, og følgjer dei naturlege rampene forbi brattpartia — lina passerer 270 og 420 moh på veg mot Innertinden. Ved 536 moh, på flanken mot Innertinden, kjem du inn på militærløypemerkinga kjelda plasserer ved 560.",
      "Vestover langs merkinga til søraustryggen som kjem ned frå Midtitinden — kjelda seier omtrent 720, og ryggfoten les 728. Frå 800 moh går ryggen over i det Fri Flyt ber deg vera merksam på: «den konvekse overgangen som begynner på 800 moh». Målinga er samd om kvar han ligg — det brattaste samanhengande partiet på turen, 26,9 grader, ligg mellom 877 og 893 moh, og det brattaste hundremetersbeltet, 19,1 grader i snitt, mellom 900 og 1000.",
      "Ved 1026 moh — kjelda seier 980 — rundar lina mot nord og inn på nordaustryggen. Dei siste metrane til varden er slake, og du står på 1060 moh med heile Saltfjorden og tindane rundt deg.",
      "Registeret fortener ei setning: Topp-punktet for Midtitinden står 294 m nordaust for det høgaste punktet og les 983 moh — 75 meter for lågt. Sjølve toppen har eit anna registernamn, Mjønestindan (Fjell), 15 m frå den klatra cella. Toppsøket klatra til 1059,5 — publisert 1058 — og kortet ber den målte cella.",
    ],
    descent: [
      "Normalvegen ned er same veg som opp: nordaustryggen, søraustryggen og rampene attende til militærløypa og hyttefeltet. Med 26,9 grader som brattaste samanhengande parti er det open køyring frå topp til fjøre — men den konvekse overgangen ved 800 moh er der på veg ned òg, og du ser ikkje kva som ligg under han før du er i han.",
      "Fri Flyt skildrar fleire variantar frå lett til krevjande — søraustflankane, austover mot vatnet på 627, og nordover mot Stordalen på 450 med retur over skardet. Ingen av dei er denne lina, og målingane frå varden seier kvifor dei krev sitt: nordaustsida fell 69,2 grader på det brattaste 390–450 m ut, sørsida 56,7 grader 70–130 m ut og sørvestsida 60,8 grader 90–150 m ut. Vel variant i god sikt, ikkje i skodde.",
      "Sida turen går i vender sør-søraust og får sol frå morgonen: det som er mjukt midt på dagen, kan vera skare att når du kjem ned att seint. To meter å gje tilbake har lina samla, så heimvegen er rein køyring.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts eige tal for normalvegen er brattaste punkt under 30 grader, og målinga stadfestar det for denne lina: 26,9 grader som brattaste samanhengande parti, med det brattaste hundremetersbeltet 19,1 grader mellom 900 og 1000 moh. Men under-30 gjeld sporet, ikkje fjellet: rett sør, søraust og nord for toppen står det 39,5 til 56,7 grader berre 60–130 m frå varden.",
      },
      {
        title: "Variantane",
        body: "Nedfartsvariantane Fri Flyt graderer frå lett til krevjande går i terreng målinga har tal på: nordsida mot Stordalen måler 28,1 grader i snitt med 40,4 grader som brattaste 60 m berre 60–120 m frå varden, sørvestsida 60,8 grader 90–150 m ut og vestsida 55,4 grader 140–200 m ut. Nordaustsida, som ingen av variantane går i, fell 69,2 grader 390–450 m ut. Det er skredterreng med konsekvens, og det er nettopp valfridomen som gjer fjellet populært — vel etter forholda, ikkje etter lysta. Fri Flyt legg sine eigne åtvaringar på variantane, og dei står att her: det er «registrert store flakskred i øst hellingen ned mot vatnet på 627 moh»; renna skal køyrast «én og én»; det er skavlkant på skikøyrars venstre langs NV-ryggen frå toppen; og «på dager med skredfare 3 bør du ikke la deg friste til å avvike fra sporet».",
      },
      {
        title: "Solvendt frå havet",
        body: "Heile turen står sør-søraust-vendt frå havnivå til 1060 moh. Det gjev tidleg sol og rask oppmjuking om våren — og dagleg gjenfrysing. På ein 1050-metersflanke rekk tilhøva å endra seg frå fjøra til varden; det som ber deg ved 300 moh om morgonen, kan vera våt snø ved 900 midt på dagen.",
      },
      {
        title: "Før du går",
        body: "Midtitinden ligg i varslingsregionen Salten, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer sesongmånader for denne turen; kortets jan–apr er lånt frå appens Lofoten-turar på same breiddegrad, og guiden seier det. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,196 L50,191 L65,186 L91,179 L117,172 L130,167 L143,163 L165,156 L182,150 L202,143 L227,134 L243,129 L267,122 L293,116 L306,111 L332,108 L356,101 L377,93 L403,85 L429,79 L449,76 L467,68 L488,60 L514,51 L527,47 L547,39 L566,32 L585,24 L600,18",
      startLabel: "11 moh",
      endLabel: "1060 moh",
      distanceLabel: "4,2 km",
      caption: "1050 høgdemeter og 4,15 km frå Sagelva på rv80 — havnivå til 1060 moh, med 26,9 grader som brattaste samanhengande parti.",
    },
  },
  sandhornet: {
    slug: "sandhornet",
    intro:
      "1021 høgdemeter og 5,01 km frå fjæra på Horsdal — øyfjellet sørvest for Bodø som Fri Flyt kallar ein av dei vakraste kysttoppane i området. Fjellet står i Gildeskål; kortet ber Bodø slik Strandtinden ber Harstad, for det er derifrå dagen startar. Lina held seg under 30 grader så nær som dei siste femti høgdemetrane — og det brattaste samanhengande partiet på lina, 32,5 grader, ligg ikkje der oppe i det heile — det ligg i trappene mellom 26 og 51 moh, der skia uansett er på sekken — og fareteksten hos kjelda gjeld ikkje brattleiken, men utløpssonene lina kryssar i Stjerndalen.",
    ascent: [
      "Frå garden på Horsdal, 10 moh, følgjer du den merkte stien langs fjæra søraustover om lag ein kilometer — 28 moh på det høgaste, med sjøen rett ved. Så dreier stien nordaust og stig bratt via trappene; her ber du skia. Der trappene endar flatar terrenget på om lag 190 moh — målt 189 — og skia kan på.",
      "Strekket vidare inn Stjerndalen er turens faretekst, og kjelda er ordrett: dalen går i utløpssoner for skredflanker, spesielt vest- og sørvestflankane under Isvasstinden — fjellet rett aust, som registeret stadfester. Ver OBS på dagar med markert skredfare og utover våren; flata er ikkje faresonefri berre fordi ho er flat.",
      "Frå dalen held du nordover mot 450 — «øst for Stjernelva hele veien», seier kjelda — lina les 463 — og så vestover i slakt terreng nord for punkt 592: 662 og 752 moh i jamn stigning. Skogen slutta alt på 267, så alt dette er open fjellside med utsyn over Saltfjorden.",
      "Til slutt nordover opp toppflanken: hundremetersbeltet 900–1000 held 21,3 grader i snitt og 22,9 som brattaste samanhengande parti på lina. Kjelda skriv «i grenseland til 30 grader de siste 50 høydemeterne», og det er fallinja han les: sør for varden måler sveipet 32,8 grader i brattaste 60 m-vindauge, 70–130 m ut. Varden står på 993 moh, med havet på tre kantar.",
    ],
    descent: [
      "Same veg ned, med rom for austlege variantar som gjev brattare køyring i toppflanken — same 30-gradersklassa, seier kjelda. Frå flata i Stjerndalen gjeld faresona att: kryss utløpsområda kjapt og éin om gongen på dagar med markert fare.",
      "Ravika-ruta på nordaustsida er fullt skildra hos Fri Flyt — skogsvegen frå den grøne garasjen, myrdraga langs Ravikelva, ramp til toppeggen — men nedfarten hennar har eit 40-gradersparti mellom 920 og 840 moh og skaret 300 m søraust for toppen som inngang. Ho er varianten, ikkje normalvegen, og han som vel ho, har valt ein annan tur.",
      "Ned trappene ber du skia att, og stien langs fjæra tek deg heim til Horsdal — 38 høgdemeter å gje att har heile turen, så det meste av dagen er rein stigning og rein køyring.",
    ],
    avalanche: [
      {
        title: "Stjerndalen",
        body: "Kjeldas faremerknad gjeld dalen, ikkje toppen: turen går i utløpssoner for skredflanker, spesielt vest- og sørvestflankane under Isvasstinden, og åtvaringa gjeld dagar med markert skredfare og våren. Utløpssoner er flate — det er heile poenget med dei — og einaste verktøyet er tempo, avstand og å velja ein annan dag når varselet seier det.",
      },
      {
        title: "Toppflanken og kantane",
        body: "Dei siste femti høgdemetrane måler 22,9 grader som brattaste samanhengande parti på lina, og kjelda kallar dei «i grenseland til 30 grader»; lina sitt brattaste, 32,5, ligg nede i trappene. Men Sandhornet er eit øyfjell med vegger: vestsida fell 59,0 grader på det brattaste berre 110–170 m frå varden, nordvestsida 59,9 og nordsida 61,8 grader 70–130 m ut. Mot havet er kanten absolutt; i skodde er sør heimvegen — lina peiler 189 grader dei fyrste femhundre metrane, og Horsdal ligg 200 grader frå varden.",
      },
      {
        title: "Før du går",
        body: "Sandhornet ligg i varslingsregionen Svartisen, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer sesongmånader; kortets jan–apr er lånt frå appens andre nordlandsturar, og guiden seier det. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L28,200 L49,197 L75,195 L98,196 L119,198 L141,198 L162,192 L177,184 L200,170 L222,163 L243,157 L270,152 L292,146 L313,138 L329,128 L351,119 L375,115 L397,108 L413,97 L437,89 L459,80 L483,70 L502,64 L524,59 L540,51 L561,40 L581,29 L600,18",
      startLabel: "10 moh",
      endLabel: "993 moh",
      distanceLabel: "5,0 km",
      caption: "1021 høgdemeter og 5,01 km frå fjæra på Horsdal — trappene til Stjerndalen, slake rygger, og 32,5 grader i dei siste femti høgdemetrane.",
    },
  },
  tomskjevelen: {
    slug: "tomskjevelen",
    intro:
      "951 høgdemeter og 3,86 km frå åkeren ved Forsland — på ei øy. Tomskjevelen står midt i havet på Tomma, med ferje frå Nesna som einaste veg til start, og Fri Flyt skriv at «mange regner Tomskjevelen som en av de absolutt fineste toppene på hele Helgelandskysten». Registeret skriv Tommskjevelen og har punktet sitt på vestknausen på 756 moh; sjølve toppen — 922 — ligg 330 m aust, og det er dit lina går. Sporet er snilt — brattaste hundremetersbeltet 21,8 grader mellom 800 og 900 moh, brattaste samanhengande parti 27,9 — men fjellet ikring er det ikkje, og sesongen er ustabil med varierande snøtilhøve, slik kjelda sjølv seier.",
    ascent: [
      "Ta ferja frå Nesna til Tomma og køyr mot Forsland; Forslandsvegen endar ved garden, og du parkerer ved åkeren før Forslandsvatnet, slik kjelda seier — jordet ved stistarten les 47 moh. Sjekk rutetidene begge vegar: ferja er ein del av turen.",
      "Stien vestover er kartlagd og fører opp til høgda der Forslandsvatnet ligg, på 148 moh. Tjernet er naturleg, men det ligg lågt på ei øy i havet, og isen kan ikkje føresetjast: lina går rundt nordbredda på land — 161, 177 og 150 moh på pinnane — og passerer òg nord for småtjerna og Tinnvatnet. Det er målt: 0 meter av lina står på vatn.",
      "Frå myra nordvest for vatnet tek den nordvestgåande ryggen til, slik kjelda seier — heilt til toppen. Ryggen er jamn: 283 ved foten, 492, 656, 768, 843 og 884 moh oppover, med det brattaste hundremetersbeltet — 21,8 grader i snitt — mellom 800 og 900. Falllinja i midtpartiet held 32–33 grader; sporet sikksakkar slakare.",
      "Varden står på 922 moh med hav på alle kantar — Atlanterhavet i vest, Svartisen i aust. Og alle kantane er ekte: frå toppen fell alle åtte sektorane 31 til 44 grader i snitt, med 69,4 grader som brattaste vindauge mot nordaust. Toppen er eit horn, og i skodde er ryggen du kom opp einaste heimvegen.",
    ],
    descent: [
      "Den normale nedkøyringa følgjer same ruta som oppstigninga, slik kjelda seier — ryggen ned, rundt vatnet på land, og stien til åkeren. 74 høgdemeter å gje att har turen samla, det meste i småkuperinga rundt tjerna.",
      "Fri Flyt nemner òg den austvende nedkøyringa i søkket som samlar snø — faktaboksen hans fører inga himmelretning, og den målte peilinga ned ryggen les 134 til 147 grader. Søkket er fjellet sitt beste snølager og samstundes bratteste terreng: austsektoren fell 34,4 grader i snitt med 64,1 som brattaste vindauge. Han som vel søkket, har valt snøvurderinga som følgjer med.",
      "Hugs ferja: ho set tidsramma for dagen, og ho går frå fjæra — heile nedkøyringa har havet som mål, og det er den einaste turen i appen der «heilt ned» tyder heilt ned til ei ferjekai.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt publiserer korkje KAST eller brattaste punkt for denne turen, og målinga får stå åleine: 27,9 grader som brattaste samanhengande parti, 21,8 som brattaste hundremetersbelte, mellom 800 og 900 moh. Falllinja i midtpartiet av ryggen held 32–33 grader — sporvalet er slakare enn henget, og det skal det halda fram med å vera.",
      },
      {
        title: "Hornet",
        body: "Frå varden fell alle åtte sektorane mellom 31 og 44 grader i snitt: nordaust 69,4 grader i brattaste vindauget, nord 63,7, aust 64,1, nordvest 61,4. Det finst ingen slak utveg frå toppen anna enn ryggen du kom opp — i skodde er kompasskursen søraust langs ryggen absolutt — lina peiler 134 til 147 grader ned.",
      },
      {
        title: "Havet og snøen",
        body: "Kjelda skriv at «som andre kysttopper på Helgeland er sesongen ustabil og snøforholdene varierende» — i innleiinga, ikkje i faktaboksen, og ho er heile klimahistoria: eit 922-metersfjell omgjeve av hav får snøen sin i byger og mister han i mildvêr, og det austvende søkket som samlar snø, samlar han av vinden — fokksnø over kystskare er den lokale kombinasjonen. Vurder snødekket frå ferja: du ser heile fjellet frå sjøen.",
      },
      {
        title: "Før du går",
        body: "Tomskjevelen ligg i varslingsregionen Helgeland, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer sesongmånader; kortets jan–apr er lånt frå appens andre nordlandsturar, og guiden seier det. Ferja frå Nesna er einaste tilkomst — sjekk rutetidene. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L34,194 L58,183 L83,172 L111,176 L137,179 L146,178 L163,177 L184,173 L208,177 L240,178 L275,171 L292,163 L314,150 L341,142 L369,132 L387,123 L403,115 L423,107 L441,98 L456,89 L478,79 L496,71 L513,62 L531,50 L555,41 L576,30 L591,22 L600,18",
      startLabel: "45 moh",
      endLabel: "922 moh",
      distanceLabel: "3,9 km",
      caption: "951 høgdemeter og 3,86 km frå Forsland på Tomma — rundt Forslandsvatnet på land, og den nordvestgåande ryggen til hornet på 922.",
    },
  },
  vassfjellet: {
    slug: "vassfjellet",
    intro:
      "560 høydemeter og 4,92 km fra Markavollen til varden på 711 moh — den nærmeste toppturen til Trondheim. Det bratte ligger samlet mellom 500 og 700 moh: 11,5 grader fra 500 til 600 og 12,3 fra 600 til 700, som er bratteste hundremeteren. Brattaste sammenhengende steg er 23,0 grader mellom 251 og 270 moh, og det er også det brattaste hele linja måler.",
    ascent: [
      "Start på parkeringa på Markavollen, 184 moh. Ut.no oppgir p-avgift, og terrengmodellen leser plassen til 184 moh — nøyaktig den starthøyda beskrivelsen oppgir. Ut.no sender deg langs skiløypene «merka S, deretter Ø og S igjen»; linja på kartet er terrenglinja gjennom det samme løypenettet og ikke løypa selv — 2205 av 4744 meter ligger mer enn 50 meter fra en kartlagt trasé, med største avvik 175 meter. Første halvdel er flat i en topptur å være: bandet fra 300 til 400 moh måler 5,2 grader over 1036 meter grunn, og 400 til 500 moh 3,2 grader over 1710.",
      "På 445 moh streifer linja kanten av Lomtjønna. Vassfjellhytta ligger på 507 moh, og rett etter den kommer stigninga: 11,5 grader fra 500 til 600 moh over 495 meter grunn, og linjas brattaste steg måler 23,0 grader mellom 251 og 270 moh. Skogen slipper taket på 586 moh, og fra 594 er terrenget åpent.",
      "Over skoggrensa holder det 12,3 grader fra 600 til 700 moh, og du treffer anleggsvegen ut.no sender deg inn på — Vassfjellvegen, som ligger 16 meter fra linja og går helt opp til Melhus hovedsender, kommunikasjonsmasta som står 131 meter fra varden på 709 moh. De siste metrene dreier linja nordover. Varden selv står på 711, og terrengmodellen måler den til 710,9.",
    ],
    descent: [
      "Ned samme vegen. Første 200 meter fra varden peiler 255 grader — vest — ned til 676 moh, og 500 meter ned peiler 249. Det er flanken kortet fører: vestsida måler 12,0 grader i snitt over 400 meter med et 26,2 graders vindu 230 til 290 meter ut, og 12,3 grader i snitt når sveipet går ut til en kilometer.",
      "Ut.no advarer mot «diverse brattheng både under og over tregrensa», og sveipet sier hvor de er. Nordvest har det brattaste enkeltvinduet: 33,3 grader 190 til 250 meter ut, mot et snitt på 13,8. Søraust er den jamnast bratte sida med 13,9 grader i snitt og 26,7 i brattaste vindu, og vest måler 12,0 og 26,2. Nordaust, mot heisene, måler 3,9 — men det du kommer ned i der er alpinbakken i Vassfjellet skisenter, ikke fjellet.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "541 høydemeter der bandene under 500 moh måler 3,2 og 5,2 grader, og bandet fra 500 til 600 måler 11,5 over 495 meter grunn. Brattaste punkt på hele den routede linja er 23,0 grader, mellom 251 og 270 moh, og ruta gir tilbake 33 høydemeter på 4,92 km. Det er en løypetur med ett bratt parti i, ikke en flankeoppstigning. Den routede linja stiger 541 høydemeter over 4,74 km, mot ut.nos oppgitte 526 og 6,7 km: høydemeterne stemmer, kilometerne ikke. Løypa svinger seg sørover, østover og sørover igjen, og linja på kartet tar den korteste vegen gjennom de samme punktene.",
      },
      {
        title: "Terrenget utenfor",
        body: "Fjellet har bratte sider; de ligger bare ikke der løypa går. Innafor 400 meter av varden måler nordvest 33,3 grader i brattaste 60-metersvindu, søraust 26,7 og vest 26,2. Det er høyt og bratt nok til at et enkeltheng kan løsne, og det er akkurat de linjene som frister når du står på toppen med skiene på.",
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
      "471 høydemeter og 9,60 km fra Håen til kommunetoppen i Trondheim. Det er en lang, slak dag: bandet fra 400 til 500 moh måler 1,2 grader over 4505 meter grunn, og det brattaste stedet på hele linja er 16,1 grader mellom 467 og 480 moh.",
    ascent: [
      "Start på parkeringa ved Håen, 411 moh — bomveg fra Lundamo, og normalt brøytet de 18 kilometerne inn. Her slutter brøytinga, men ikke vegen: Lundadalsvegen fortsetter ubrøytet 2,6 kilometer østover langs nordsida av vatnet, og det er den skogsbilvegen ut.no sender deg langs — «skogsbilveien eller strandlinja N på Håen rett Ø». Linja på kartet følger vegen.",
      "Grunnen til at den gjør det står i vatnet ved sida av. Vassflata på Håen måler 433 moh og er klassifisert som regulert innsjø: magasinet tappes ned hver vinter, parkeringa ligger 22 meter under full vassflate, og ut.no ber deg holde deg unna usikker is langs kanten. Vegen ligger på land hele vegen, fra 411 moh ved bilen til 435 ved austenden.",
      "Etter knapt tre kilometer kommer du til Kråklivollen, 452 moh, der vegen slutter og ruta går opp i skogen, opp Kråklia og vest for Samsjølia. Skogen slipper taket på 570 moh, og fra 574 er du i åpent terreng. Bandet fra 400 til 500 moh måler 1,2 grader over 4505 meter grunn — det er avstanden, ikke stigninga, som er turen her.",
      "Rundtjønnin ligger på 526 moh, og det er kontrollmålet på at ruta ligger der beskrivelsen sier: ut.no oppgir 525. Videre nord og nordaust følger du rygger eller søkk i samme retning, avhengig av snø og føre, til ruta dreier mot nord og nordvest opp mot toppen. Bandene over Rundtjønnin måler 2,4, 3,6, 6,0 og 5,7 grader, og det siste av dem dekker bare 149 meter grunn.",
      "Varden står på 815 moh. Kråkfjellet ble kommunetopp i Trondheim etter sammenslåinga med Klæbu, og publiserte tall sier 817; terrengmodellen leser 814,9 på det høyeste punktet, og kortet fører målinga.",
    ],
    descent: [
      "Ned samme vegen. Første 200 meter fra toppen peiler 202 grader, ned til 792 moh, og 500 meter ned peiler 199. Parkeringa ligger 7,4 km unna, på peiling 225 grader, så det meste av nedturen er å gå, ikke å kjøre — og de siste tre kilometerne er skogsbilvegen tilbake.",
      "Sveipet finner ingen bratt side på dette fjellet: brattaste 60-metersvindu i noen retning er 21,8 grader mot aust, i vinduet 260 til 320 meter ut, nordaust måler 13,1 grader i snitt og nord 2,0. Det ut.no advarer mot er noe annet enn skred — «høye skavler i le-retningen» som du kan falle ned fra i dårlig lys når du krysser ryggene i området.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ni og en halv kilometer der bandene måler 1,2, 2,4, 3,6, 6,0 og 5,7 grader, og brattaste sammenhengende steg er 16,1 grader mellom 467 og 480 moh. Ruta gir tilbake 67 høydemeter og stiger 468 mot ut.nos oppgitte 519 og «ca 140» tapte. Resten av forskjellen ligger i linjevalget mellom ryggene, som beskrivelsen selv overlater til snøen og føret.",
      },
      {
        title: "Terrenget utenfor",
        body: "Brattaste måling rundt toppen er 21,8 grader mot aust. Nord er nesten flatt, 2,0 grader i snitt over 400 meter. De to tingene som kan gå galt her er derfor ikke skred i seg selv: skavlene ut.no beskriver, som er et fallproblem i dårlig lys, og isen på Håen, som er regulert og tappes ned hver vinter. Ruta er lagt på skogsbilvegen og ikke ut på magasinet, men strandlinja ligger hele tida rett ved sida av linja.",
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
      "699 høydemeter og 11,33 km fra Håen til Melhus' høyeste punkt, med 168 av høydemeterne gitt tilbake underveis. Stigninga kommer sist: brattaste hundremetersband er 11,6 grader fra 700 til 800 moh, og brattaste sammenhengende steg 19,7 grader mellom 663 og 679.",
    ascent: [
      "Start på parkeringa ved Håen, 411 moh — de samme tre første kilometerne som Kråkfjellet. Brøytinga slutter ved bilen, men Lundadalsvegen gjør det ikke: den fortsetter ubrøytet 2,6 kilometer østover langs nordsida av vatnet, og linja følger den. Vassflata på Håen ligger på 433 moh, magasinet tappes ned hver vinter, og ut.no ber deg holde deg unna usikker is langs kanten.",
      "Kråklivollen ligger på 452 moh, der vegen slutter. Videre opp Kråklia og vest for Samsjølia, forbi Rundtjønnin på 526 moh. Ut.no oppgir 525 for dette vatnet og terrengmodellen leser 526 — det er kontrollen på at korridoren følger den beskrevne løypa. Bandene hit måler 1,2 og 1,4 grader, over 4460 og 4096 meter grunn.",
      "Så krysser ruta Oksdalen på 532 moh. Punktet er ikke navngitt i noen kilde: dalen er registrert med representasjonspunkt 3,95 km unna på peiling 15, altså nord-nordaust, og kryssinga er lest ut av terrengmodellen som lavlinja sørover derfra. Skogen slipper taket på 562 moh, og fra 569 er du i åpent terreng.",
      "Etter Oksdalen begynner de siste fire kilometerne. Bandet fra 600 til 700 moh måler 6,1 grader, og det er her det brattaste sammenhengende steget ligger — 19,7 grader mellom 663 og 679 moh. Videre måler 700 til 800 moh 11,6 grader over 495 meter grunn, og så slakner det til 5,7 og 6,5 mot varden på 942 moh. Rensfjellet er grensetopp mellom Melhus, Midtre Gauldal og Selbu; ut.no noterer at den «mangler bare 2,1 km mot N-NV på å inkludere også Trondheim i den klubben».",
    ],
    descent: [
      "Ned samme vegen, vestover: første 200 meter fra toppen peiler 253 grader ned til 920 moh, og 500 meter ned 254. Parkeringa ligger 10,2 km unna, på peiling 254 grader. Ut.no gir ett alternativ — å styre ned mot Samsjøen etter Oksdalen — og setter to betingelser: at føret utenfor oppkjørte løyper er godt, eller at du har et spor å gå i.",
      "Sveipet finner ingen bratt side innafor 400 meter av varden: aust måler 11,0 grader i snitt med 17,8 i brattaste vindu, søraust 3,4 og nordvest 2,5. Ut.nos «bratte enkeltheng som er høye nok til at det kan gå skred» ligger lenger ute enn sveipet rekker, og beskrivelsen sier selv at de er mulige å unngå.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Elleve kilometer der de to lange bandene måler 1,2 og 1,4 grader over drøye fire kilometer hver, og all stigninga ligger i de siste fire. Brattaste sammenhengende steg er 19,7 grader mellom 663 og 679 moh, brattaste hundremetersband 11,6 fra 700 til 800. Ruta gir tilbake 168 høydemeter mot ut.nos oppgitte «ca 130» — det er den samme terrengformen, rygger og søkk som må krysses.",
      },
      {
        title: "Terrenget utenfor",
        body: "Innafor 400 meter av varden er brattaste måling 17,8 grader mot aust. Det som gjør turen krevende er lengden og orienteringa: elleve kilometer over myr, skogsveg og rygger, 168 høydemeter gitt tilbake på vegen inn og de samme igjen på vegen ut. Ut.no advarer om skavler i le-retningen, som er et fallproblem i dårlig lys, og om enkeltheng som finnes, men kan omgås. Nede ved starten er det isen på det nedtappede magasinet som er faren, og ruta er lagt på skogsbilvegen for å holde seg unna den.",
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
      "1268 høydemeter og 10,22 km fra Gråhaugen til det høyeste fjellet nord i Trollheimen. Ruta går i skredterreng fra Litj-Snota og opp, krysser 404 meter bre mellom 1364 og 1463 moh, og toppflanken faller 48,1 grader mot aust.",
    ascent: [
      "Start på parkeringa ved dammen på Gråsjøen, 495 moh — 15 km bomveg opp Folldalsvegen, betaling med kort. Følg vegtraséen langs vatnet til sommerstien skrår opp lia, og ikke tidligere: ut.no advarer om at det kan gå skred fra fonna på Gråhaugfjellet, og at de enkelte år går helt ut på vatnet.",
      "Opp lia sør–sørvest, gjennom 686 moh, med bandene 10,3, 6,3 og 7,0 grader. Så flater det ut på platået øst for Midtveggen, 931 moh: bandet fra 800 til 900 moh måler 3,2 grader over 1979 meter grunn, og 900 til 1000 måler 2,2 over 2250. Her gir ruta tilbake høyde, fra 931 ned til Svartvatnet på 888 moh — ut.no fører «ca 100» tapte høydemeter opp, og den routede linja gir tilbake 95.",
      "Fra Svartvatnet kommer du til foten av Litj-Snota og runder den i aust, 1026 moh — de siste 90 metrene inn dit går over et lite unavngitt vatn på 1024. Herfra og opp er du i utløpsområder og i kortere partier i løsneområder over 30 grader, som ut.no skriver at det ikke er mulig å omgå. Bandene stiger til 7,1, 15,7 og 15,3 grader.",
      "På 1352 moh flater det ut, og den bratte bakken rett imot i vest er breen. Kartverket klasser elleve punkter på linja som breterreng, fra 1364 til 1463 moh, og strekket måler 404 meter — med to bare punkter på 1414 og 1421 moh midt i, der isen er brutt. Punktene rett før og etter, 1369 og 1471 moh, er åpent område. Ut.no oppgir «fra ca 1380 moh ... i ca 500 m» og ber deg sjekke med lokalkjente at det er nok snø. Brattaste sammenhengende steg på hele turen ligger her: 28,9 grader mellom 1414 og 1434 moh.",
      "Over breen, på 1516 moh, kommer du opp på toppflanken, og ruta dreier sørvest, sør og til slutt sør–søraust til toppunktet på 1668 moh.",
    ],
    descent: [
      "Ned samme sporet — ut.no kaller det det beste valget i de fleste tilfeller, og legger til at faren for våte løssnøskred øker utover dagen på varme vårdager. Første 200 meter fra toppen peiler 320 grader, altså nordvest, ned til 1653 moh, og 500 meter ned 328: ruta går tilbake langs toppflanken før den faller austover ned breen. Parkeringa ligger 8,0 km unna, på peiling 13 grader.",
      "Det er verdt å vite hvorfor det første trekket går nordvest. Aust fra toppunktet måler 48,1 grader i snitt over 400 meter med et 57,9 graders vindu 130 til 190 meter ut — det er «toppflanken er stupbratt mot Ø» i tall. Sør og søraust måler 42,0 og 36,5 i snitt, med vindu på 71,4 og 71,0 grader bare 10 til 70 meter ut, og nordaust 42,0 med 64,2. Vest og nordvest, der ruta kommer opp og går ned, måler 14,8 og 9,4.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "1268 høydemeter og 10,22 km, med 95 gitt tilbake. Ut.no fører ruta som skredterreng — «både løsneområder over 30 grader bratt og utløpsområder som det ikke er mulig å omgå» — og terrengklassen som KAST 2, utfordrende. Brattaste hundremetersband på den routede linja er 15,7 grader fra 1100 til 1200 moh og brattaste steg 28,9 grader mellom 1414 og 1434, men de tallene beskriver skisporet, ikke sidene det går under.",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppflanken mot aust måler 48,1 grader i snitt med 57,9 i brattaste vindu, og sør og søraust har vindu på 71,4 og 71,0 grader bare 10 til 70 meter ut fra toppunktet. Den andre er fonna på Gråhaugfjellet, nede ved starten: ut.no skriver at skred derfra enkelte år går helt ut på vatnet, og at turen ikke bør gås ved fare for store, naturlig utløste skred i østlige heng.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen. Breen mellom 1364 og 1463 moh krever nok snø, og ut.no ber deg sjekke med lokalkjente på forhånd. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,191 L45,181 L66,175 L87,170 L111,163 L135,154 L158,146 L182,136 L203,132 L222,132 L243,132 L264,132 L290,138 L314,139 L338,138 L362,138 L385,124 L407,116 L430,113 L446,100 L468,86 L486,71 L507,64 L528,52 L549,42 L570,29 L596,19 L600,18",
      startLabel: "495 moh",
      endLabel: "1668 moh",
      distanceLabel: "10,2 km",
      caption: "1268 høydemeter og 10,22 km fra Gråhaugen om platået øst for Midtveggen på 931 moh, Svartvatnet på 888 og flata på 1352, med breen fra 1364 til 1463 moh.",
    },
  },
  storbekkhoa: {
    slug: "storbekkhoa",
    intro:
      "897 høydemeter og 5,92 km fra Storli til varden på 1504 moh. Oppstigninga er slak — brattaste hundremetersband er 15,8 grader — og sørøstveggen rett ved toppen er ikke: den måler 34,1 grader i snitt med et 46,9 graders vindu 20 til 80 meter ut fra varden.",
    ascent: [
      "Start på parkeringa ved Storli, 623 moh — avgiftsbelagt, 30 kroner i kassa, og taggd for ski. Ut.no: «Fra Storli parkering spenner du på deg skia ved bilen.» Gå rett nordover mot Storbekkdalen gjennom bjørkelia. Her spriker kildene: ut.no legger ruta på høgresida av Veslebekken, mens Fri Flyt skriver at ruta følger Storbekken nordover fra Storli gjennom bjørkeskogen. Linja følger den oppmerkede stien, som gjør litt av begge deler — den krysser Veslebekken nede i bjørkelia og ligger 7 til 967 meter fra Storbekken på veg opp dalen. Bandet fra 700 til 800 moh er det brattaste på hele turen, 15,8 grader over 360 meter grunn, og det brattaste sammenhengende steget på linja ligger like under: 25,8 grader mellom 661 og 683 moh.",
      "Skogen slipper taket på 912 moh, og fra 915 er du i åpent terreng og myr. Linja krysser Storbekken første gang alt på 644 moh, og fletter seg så over bekken åtte ganger til der den slynger seg over den flate dalbotnen mellom 968 og 997 moh — bandet fra 900 til 1000 måler 3,4 grader over 1703 meter grunn. Det er her ruta legger seg vestover opp mot ryggen.",
      "Ryggen vest for bekken ligger på 1211 moh, og bandet fra 1000 til 1100 moh opp mot den måler 12,6 grader. Videre nordover langs ryggen til den bratte sørøstveggen står rett imot deg — da går du et stykke lenger vest og opp gjennom skaret på 1313 moh.",
      "Fra skaret følger ruta det slake terrenget i en halvsirkel til varden på 1504 moh, der kassa med gjesteboka står. Bandene her måler 9,7 og 15,7 grader. Kildene er uenige om høydemeterne — Fri Flyt oppgir 600, ut.no 900 — og den routede linja stiger 893 fra en parkering terrengmodellen leser til 623 moh. Fri Flyts egen GPS-posisjon for toppunktet lander 27 meter fra det punktet summitsøket klatrer til.",
    ],
    descent: [
      "Ned samme vegen, og de første metrene går vestover, ikke mot bilen: første 200 meter fra varden peiler 276 grader, ned til 1458 moh, og 500 meter ned 236. Parkeringa ligger 4,2 km unna, på peiling 170 grader. Halvsirkelen må gås ferdig før ruta snur sørover, og i dårlig sikt er det den detaljen som betyr noe her.",
      "Sørøstveggen er den Fri Flyt advarer mot, og sveipet bekrefter den: 34,1 grader i snitt over 400 meter med et 46,9 graders vindu 20 til 80 meter ut fra varden. Sør måler 25,5 med samme 46,9 i vinduet 30 til 90 meter, og aust 24,9 med 35,5. Nordvest — der ruta kommer opp — måler 3,7 grader i snitt, med 7,7 som brattaste vindu.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "897 høydemeter der brattaste hundremetersband er 15,8 grader, fra 700 til 800 moh, og brattaste sammenhengende steg 25,8 grader mellom 661 og 683. Fri Flyt skriver at hele oppstigninga går i terreng under 30 grader og fører turen som KAST 1. Ruta gir tilbake 16 høydemeter på 5,92 km.",
      },
      {
        title: "Terrenget utenfor",
        body: "Fri Flyt fører ett utløpsområde og «den bratte sørøstsiden av toppen. Her kan det være skumle skavler.» Sveipet måler den sida til 34,1 grader i snitt og 46,9 i brattaste vindu 20 til 80 meter ut, og sørsida til 25,5 med samme 46,9 i vinduet 30 til 90. Nedkjøring mot Storbekkdalen er brattere enn oppstigninga, og Fri Flyt kaller det skredfarlig terreng.",
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
      "1025 høydemeter og 5,99 km fra Dalen i Storlidalen til Snydda, 1582 moh — toppunktet på Okla-massivet, der varden og turboka står. Brattaste hundremetersband er 19,8 grader fra 700 til 800 moh, og brattaste steg 26,1 grader mellom 1481 og 1499. Nordsida er en annen sak: 44,7 grader i snitt mot nordvest.",
    ascent: [
      "Start på parkeringa i Dalen, 599 moh — avgiftsbelagt og taggd for ski, nede ved Storlidalsvegen. Fri Flyt beskriver den samme starten som «brua mellom Dalsvatnet og Ångårdsvatnet»; brua ligger 300 meter unna. Opp går det med en gang: 11,8 grader fra 600 til 700 moh og 19,8 fra 700 til 800, gjennom bjørkeskogen som slipper taket på 961 moh.",
      "Videre slakt på skrå oppover mot Korgtjønna, 1151 moh. Bandene måler 15,3 og 12,8 grader, og bandet fra 1000 til 1100 moh måler 15,1 grader over 405 meter grunn.",
      "Fra Korgtjønna flater det ut — 3,4 grader fra 1100 til 1200 moh over 1800 meter grunn — og ruta dreier vestover. Linja går over sjølve tjønna, 720 meter på 1151 moh; det er dit ut.no sender deg, men det er et vatn, og det skal vurderes som et vatn.",
      "Så runder du Mjølkskåla. Ut.no sier det presist — «rund eggen med vatnet Mjølkskåla under deg» — og linja gjør det: over skuldra aust for vatnet på 1275 moh, videre over eggen nord for det på 1290, og opp mot 1324 moh før siste stigning. Vatnet ligger på 1277 moh og blir liggende under deg.",
      "Siste stigning måler 19,5 grader fra 1400 til 1500 moh og 17,0 videre, med et steg på 26,1 grader mellom 1481 og 1499 moh. Toppen heter Snydda i place-navneregisteret og måler 1582,3 moh; ut.no publiserer 1580 og Fri Flyt 1564, og kortet fører målinga. Punktet som er registrert som Okla ligger 2,4 km rett vest, på peiling 267, og er 1458,8 moh — fjellet heter Okla, men varden står på Snydda.",
    ],
    descent: [
      "Ned samme vegen, og første trekk fra varden går austover langs ryggen, ikke ned: første 200 meter peiler 73 grader ned til 1510 moh, og 500 meter ned 71. Parkeringa ligger 3,4 km unna, på peiling 167 grader.",
      "Grunnen til at det trekket betyr noe er nordsida. Nordvest måler 44,7 grader i snitt over 400 meter med et 57,1 graders vindu 200 til 260 meter ut, og nord 43,6 med 50,9. Det er der Fri Flyts alternative nedkjøring mot Gjevilvatnet går, og de kaller den «svært bratt og seriøst» — den ender dessuten langt fra bilen. Sørvest, langs Okla-ryggen, måler 3,4 grader i snitt: det er det flate topplatået beskrivelsene omtaler, og i dårlig sikt er det navigeringa som er problemet.",
      "Sørsida er den kortet fører, og den er ikke slak heller: sør måler 27,4 grader i snitt med 34,0 i brattaste vindu, søraust 33,1 med 39,4. Fri Flyt om oppstigningssida: «Dette er en side der det legger seg mye snø, så vurdér skredfaren nøye», og om bekkedalen langs Sandbekken at den «bør bare kjøres under svært stabile forhold».",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "1025 høydemeter der brattaste hundremetersband er 19,8 grader fra 700 til 800 moh og brattaste sammenhengende steg 26,1 grader mellom 1481 og 1499. Ruta gir tilbake 41 høydemeter. Fri Flyt skriver at Okla ikke er en bratt topptur, og terrengmålinga er enig — det er snømengden på sørsida, ikke vinkelen, som er problemet her.",
      },
      {
        title: "Terrenget utenfor",
        body: "Sørsida, som er både oppstigning og nedkjøring, måler 27,4 grader i snitt med 34,0 i brattaste vindu, og søraust 33,1 med 39,4 — nok til at det løsner, og Fri Flyt sier selv at det legger seg mye snø her. Nord og nordvest er en helt annen kant av fjellet: 43,6 og 44,7 grader i snitt, med vindu på 50,9 og 57,1, og du ender ved Gjevilvatnet i stedet for ved bilen.",
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
      "936 høydemeter og 5,01 km på den merkede vinterløypa fra Bree til steinbua på 1589 moh. Jevn er ordet, og målinga er enig: ingen hundremetersband måler mer enn 13,1 grader, brattaste sammenhengende steg er 20,5 grader mellom 1463 og 1480 moh, og ruta gir ikke tilbake en eneste høydemeter. Det bratte på fjellet ligger på nordaustsida, bak toppen.",
    ascent: [
      "Start på den avgiftsbelagte parkeringa ved Bree, 653 moh — ti plasser, taggd for både ski og fottur, og Fri Flyt sender deg dit med «følg veien som går til venstre etter butikken og kjør ca 1,3 kilometer». Herfra og til varden følger linja den kartlagte vinterløypa, en sammenhengende skitour-trasé på 5,13 km som ender 25 meter fra toppunktet; største avvik mellom linja og løypa er 166 meter.",
      "Løypa er hogd ut gjennom skogen og svinger seg opp gjennom hyttefeltet i Hornlia — 113 hytter ligger innafor 300 meter av linja. Bandene måler 8,6 og 9,9 grader fra 600 til 800 moh. Skogen slipper taket på 921 moh, og fra 931 er du på åpent fjell.",
      "Over tregrensa fortsetter løypa mot nordvest, og den holder kursen resten av vegen. Bandene måler 12,4, 11,4, 9,6, 10,7, 11,8 og 9,6 grader oppover, og det brattaste av dem alle er 13,1 grader fra 1400 til 1500 moh, over 465 meter grunn. Det brattaste sammenhengende steget på hele turen ligger også her: 20,5 grader mellom 1463 og 1480 moh. Det er en stigning uten kneiker.",
      "På 1589 moh står steinbua fra 1946, med gjestebok. Dette er den best kontrollerte toppen i runden: terrengmodellen gir 1589,0 moh mot publiserte 1589, og Fri Flyts egen GPS-posisjon for toppunktet lander 10 meter fra det punktet. Linja stiger 936 høydemeter mot ut.nos oppgitte 928 og Fri Flyts 900, og måler 4,84 km mot ut.nos 5,2 og Fri Flyts 5,3.",
    ],
    descent: [
      "Ned samme vegen — det er linja Fri Flyt anbefaler. Første 200 meter fra bua peiler 153 grader, ned til 1567 moh, og 500 meter ned 145. Parkeringa ligger 4,7 km unna, på peiling 135 grader, så nedkjøringa følger oppstigninga hele vegen.",
      "Det bratte på dette fjellet ligger bak deg når du står ved bua. Nordaust måler 30,7 grader i snitt over 400 meter, med et 46,2 graders vindu bare 10 til 70 meter ut; nord 22,2 med 37,7 i vinduet 20 til 80, og aust 23,1 med 34,4. Sør og sørvest, der løypa kommer opp, måler 6,0 og 0,4 grader i snitt.",
      "Fri Flyts eget faremoment peker sørover: «Hvis du velger å oppsøke det bratte terrenget rundt Omnråa sør for toppen må du ta hensyn til både eksponert terreng og skredfare.» Det er en reell advarsel, og den ligger lenger ute enn du ser fra bua. Sørover er det platå i halvannen kilometer — under ti grader hele vegen — og så bryter terrenget av: fra rundt 1490 meter ut måler 60-metersvinduene 37 til 40 grader, det brattaste 39,7 grader 1610 til 1670 meter ut, og enkelttrinn på ti meter går opp i 48. Ved to kilometer har du mistet 339 høydemeter. Det er kanten over Omnråa, og den er ikke slak — den er bare langt unna. Kanten du kan gå ut på uten å ha gått langt, er nordaust.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "936 høydemeter der ingen del av den routede linja måler mer enn 20,5 grader, og brattaste hundremetersband er 13,1 fra 1400 til 1500 moh. Fri Flyt fører bratteste punkt som under 25 grader og klassifiserer turen som KAST 1, enkelt. Ruta gir ikke tilbake en høydemeter på 4,84 km — den stiger uavbrutt fra bilen til bua, på en trasé som er kartlagt som vinterløype hele vegen.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nordaustsida er den som teller der du står: 30,7 grader i snitt over 400 meter og 46,2 grader i vinduet 10 til 70 meter ut fra toppen, med nord på 22,2 og aust på 23,1. Sørsida, som Fri Flyt navngir i faremomentet sitt, måler 6,0 grader i snitt de første 400 meterne — men den er ikke ufarlig, den er bare langt unna: fra rundt 1490 meter ut faller den 37 til 40 grader ned mot botnen Omnråa. To ulike ting, og det er nordaust som ligger ved bua.",
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
      "Ved rundt 420 moh forlater du Måsvassbu-sporet og går nordøst opp gjennom åpen bjørkeskog. Skogen slipper taket akkurat der: over 421 moh er det åpent terreng resten av veien. Målet er Vesttoppen på Steinberget, 766 moh.",
      "Fra Vesttoppen følger du kammen østover til Steinberget, 981 moh. Ryggen henger sammen og stiger jevnt, men rett nord for Steinberget faller den 19 meter i et søkk før den reiser seg igjen. De 19 meterne må du opp igjen på vei tilbake — de er med i turens 1277 høydemeter.",
      "Herfra går sørvestryggen nord-nordøstover mot toppen. Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1400 og 1500 moh og holder 22,1° i snitt; sjiktet under, 1300 til 1400 moh, måler 20,5°. Det bratteste enkelttrinnet ligger i det same høgdelaget, mellom 1411 og 1433 moh, og måler 30,3°. Skavler henger ut på både øst- og vestsida av toppryggen; hold deg på ryggen og klar av begge kanter helt inn til varden på 1439.",
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
      caption: "185 til 1439 moh på 6,2 kilometer: bomvei, bjørkeskog til 421, så rygg hele veien — 1277 høydemeter medregnet søkket nord for Steinberget.",
    },
  },
  auskjeret: {
    slug: "auskjeret",
    intro:
      "870 høgdemeter på 3,83 km frå Fausaskiftet, jamn stigning nordover heile vegen — om lag femten grader i snitt. Heilårsopen veg fram til starten er grunnen til at dette er ein av dei fyrste turane som går i Sykkylven kvar vinter.",
    ascent: [
      "Start ved Fausaskiftet ved enden av Nysætervatnet, 333 moh, der Fausavegen tek av frå vegnettet om lag fire kilometer forbi skianlegget. Vegen hit er open heile året.",
      "Ta på skia og gå nordover. Dei fyrste 671 metrane grunn ligg på 6,2 grader i snitt, og skogen held til 553 moh.",
      "Over skogen held stigninga fram jamt og utan trinn: 14,2 grader frå 500 til 600 moh, 11,4 frå 600 til 700 og 11,7 frå 700 til 800. Ved 685 moh er du ute i den opne sida, og rett over ligg brattaste partiet på turen — 26,4 grader over tretti meter, mellom 862 og 884 moh, i bandet som måler 18,6 grader i snitt.",
      "Frå 900 moh og opp er det jamn rygg heile vegen: 16,1 grader frå 900 til 1000 moh, 18,1 frå 1000 til 1100 og 15,1 frå 1100 til 1200, med varden på 1203 moh.",
    ],
    descent: [
      "Ned same ryggen, søraustover mot Nysætervatnet, i moderat og oversiktleg skiterreng. Følgjer du ryggen opp og ned, held ruta seg under 30 grader heile vegen.",
      "Vanlegaste feil: å tru at det brattaste ligg mot aust. Målingane seier noko anna. Frå tre punkt på ryggen — 896, 1000 og 1103 moh — måler austsida 7,5, 7,0 og 8,9 grader i snitt over 400 meter, og frå varden 18,9. Det bratte ligg nord og nordaust for toppen: 30,6 og 35,8 grader i snitt, med 60-metersvindauge på 58,9 og 50,5. Ryggen opp er den slake linja, og terrenget bak toppen er det du ikkje ser frå han.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn stigning på om lag femten grader i snitt. Brattaste hundremeteren, 800 til 900 moh, måler 18,6 grader, og brattaste samanhengande parti 26,4 grader mellom 862 og 884 moh. Ryggen er brei, og det er den som er ruta både opp og ned.",
      },
      {
        title: "Terrenget rundt",
        body: "Researchen for denne turen sa at fjellet har eit brattheng mot aust over 30 grader. Det finn ikkje terrengmodellen: aust frå ryggen måler 7 til 9 grader i snitt og aust frå varden 18,9, med det brattaste 60-metersvindauget på 31,1 grader heile 280 til 340 meter ut. Det som faktisk er bratt, er nord og nordaust for toppen — 30,6 og 35,8 grader i snitt med vindauge på 58,9 og 50,5. Det er lengda og den sida, ikkje austsida, som skil turen frå ein rein nybyrjartur.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,199 L56,195 L84,190 L105,185 L133,177 L154,172 L175,165 L197,159 L211,153 L225,148 L246,142 L274,136 L295,131 L309,126 L330,117 L352,108 L380,104 L408,95 L422,89 L443,80 L464,72 L482,65 L499,58 L521,48 L535,42 L556,33 L577,24 L600,18",
      startLabel: "333 moh",
      endLabel: "1203 moh",
      distanceLabel: "3,8 km",
      caption: "870 høgdemeter og 3,83 km frå Fausaskiftet ved Nysætervatnet, med skoggrensa på 553 moh og brattaste hundremeteren mellom 800 og 900 moh.",
    },
  },
  snohetta: {
    slug: "snohetta",
    intro:
      "Norges høyeste fjell utenfor Jotunheimen, og et av de snilleste i sin klasse: østryggen er staket hele veien, og bratteste parti på linja måler 23,5°. Det som avgjør dagen er ikke fjellet, men hvordan du kommer deg inn til Snøheim.",
    ascent: [
      "Snøheim turisthytte, 1474 moh, ligger ved enden av Snøheimvegen. Vegen er stengt for privatbil, og sykling er bare tillatt i vinduet 1. juni–15. juli av hensyn til villreinen — el-sykkel er forbudt hele året. Bussen fra Hjerkinn går først når hytta åpner rundt St. Hans. I skisesongen tar du altså de fjorten kilometerne inn fra Hjerkinn for egen maskin — det er den delen av dagen folk undervurderer. Fra hytta følger du sporet et par hundre meter vestover til gangbrua over Stridåe. Brua ligger i sørøsthjørnet av tjernet rett vest for hytta; du går rundt sørsida av tjernet, ikke over det.",
      "Etter brua svinger du umiddelbart til høyre inn på Forsvarets gamle traktorveg, sperret for kjøring med store steiner. Den tar deg jevnt oppover til Gamle Reinheim, ruinen på 1670 moh. Ingen skog noe sted på denne turen — du er over tregrensa fra hytta og oppover, og ser hele ryggen foran deg hele veien.",
      "Fra Gamle Reinheim stiger det bratt, delvis på snøfonner, opp på østryggen. Oppe på kammen ligger stidelet mot Reinheim i Stroplsjødalen, inngangen for dem som kommer østfra. Hold avstand til det bratte terrenget mot nord i starten av stigningen; ryggen er bred nok til at du kan gå midt på den.",
      "Det bratteste hundremeterbeltet ligger mellom 1700 og 1800 moh og holder 16,0° i snitt — beltet over, 1800 til 1900 moh, måler 13,8° — og bratteste parti på linja måler 21,7°. Herfra er det staker og varder hele veien, og øverst går det på snøfonner opp til Stortoppen, 2286 moh, der radiolinkstasjonen står. I dårlig sikt er det stakene som holder deg på kammen — den øvre delen er bred nok til at du mister følelsen av hvor ryggen går.",
    ],
    descent: [
      "Samme vei ned. Fra Stortoppen til Gamle Reinheim gir østryggen drøyt 600 sammenhengende høydemeter, og de siste 200 tar traktorvegen. Under 1800 moh slakner det så mye at det blir mer gliding enn svinger. Vil du ha mer helning og bedre snø, legger du noe av nedkjøringen sør for oppoversporet — men da står du i 30–40°-terreng i stedet for 20°.",
      "Vanligste feil kommer helt til slutt: å forlate traktorvegen for tidlig og sikte rett mot Snøheim. Da har du tjernet vest for hytta i veien, og utløpsbekken bak det. Følg vegen helt ned til enden ved sørvesthjørnet av tjernet og ta stien østover derfra — gangbrua er den eneste kryssinga, og fra brua er det 230 meter igjen til hytta.",
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
      "1428 høgdemeter frå 107 moh over Rametinden, og dei siste hundre på smal egg til varden på det fjellet lokalt heiter Ramoen. Brattaste samanhengande parti måler 33,7 grader, og skia blir normalt sette igjen på ryggen.",
    ascent: [
      "Start i Vollane ved Tverrelva, 107 moh, øvst i gardsvegen frå Molladalsvegen. Gå gjennom stålgrinda ved elva og følg stien oppover, fyrst på venstre og så på høgre side av elva.",
      "Den fyrste delen er den brattaste av dei låge banda: 19,6 grader frå 200 til 300 moh og 19,3 frå 300 til 400. Terrenget legg seg ved Vollesætra på 411 moh, og skogen held til 463.",
      "Frå setra går det i relativt slakt terreng opp mot Rametinden, 1197 moh — bandet frå 700 til 800 moh måler 12,1 grader og 900 til 1000 moh 15,2. Frå Rametinden fell ryggen til skaret på 1089 moh; det er 108 høgdemeter du gjev frå deg på veg opp, og linja hentar dei inn att med bandet frå 1100 til 1200 moh på 5,2 grader over 1019 meter grunn.",
      "Frå skaret stig ryggen 328 høgdemeter til toppen, og det er her turen skiftar karakter: bandet frå 1200 til 1300 moh måler 18,5 grader, brattaste samanhengande parti 33,7 grader mellom 1165 og 1185 moh, og sjølve toppen er ein haug av store steinblokker. Dei siste hundre høgdemetrane går på egg, og dei fleste set skia igjen på ryggen.",
    ],
    descent: [
      "Ned same ryggen: over skaret, opp att den vesle kneiken til Rametinden og ned nordryggen til Vollesætra og Vollane. Fallretninga er nord.",
      "Vanlegaste feil: å ta Jønshornrenna ned i Molladalen utan å ha ordna transport. Fri Flyt skildrar den runden, og ho held opp mot 45 grader — men ho endar i ein annan dal enn den du parkerte i, og krev to bilar. Den andre er å rekne egga som ein del av skituren: ho er hundre høgdemeter til fots på eksponert rygg.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn oppstigning til Rametinden og alvor over skaret. Brattaste samanhengande parti måler 33,7 grader mellom 1165 og 1185 moh, og bandet frå 1200 til 1300 moh 18,5 grader. Sidene ned frå ryggen mellom Rametinden og toppen er skredterreng.",
      },
      {
        title: "Terrenget rundt",
        body: "Jønshornrenna mot Molladalen held opp mot 45 grader og er skredterreng. Egga dei siste hundre høgdemetrane er eksponert, og der er det fallhøgda og ikkje snødekket som er faren — hardt føre gjer henne til ei anna oppgåve enn laussnø.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,195 L52,190 L71,183 L89,176 L104,168 L119,161 L136,153 L155,145 L180,138 L209,127 L223,121 L242,112 L266,108 L289,100 L318,90 L341,82 L365,73 L387,65 L402,57 L422,50 L445,55 L464,62 L488,64 L506,59 L523,50 L540,43 L556,36 L570,29 L592,22 L600,18",
      startLabel: "107 moh",
      endLabel: "1417 moh",
      distanceLabel: "5,7 km",
      caption: "1428 høgdemeter og 5,68 km frå Vollane over Vollesætra og Rametinden, med skaret på 1089 moh mellom Rametinden og toppryggen.",
    },
  },
  ytstevasshornet: {
    slug: "ytstevasshornet",
    intro:
      "833 høgdemeter på 4,19 km frå Svartevatnet, bratt opp Vassdalen til vatna på 976 moh og så nordvest mot ein smal topprygg. Brattaste samanhengande parti måler 25,0 grader, og dei siste metrane blir gjerne gått utan ski.",
    ascent: [
      "Start på parkeringa ved Svartevatnet, 538 moh, ved hovudvegen mellom Sykkylven og Stranda. Dei fyrste 904 metrane grunn er flate — 4,3 grader — og dei går langs austbredden, ikkje over vatnet. Svartevatnet er eit magasin: vassflata måler 526 moh, tolv meter under parkeringa, og linja held land heile vegen rundt nordenden og ned til sørenden på 524.",
      "Gå vestover, på venstre side av elva, opp Vassdalen. Her er den bratte delen av turen: 18,2 grader frå 600 til 700 moh, 22,4 frå 700 til 800 over berre 225 meter grunn, og 20,5 frå 800 til 900, med brattaste samanhengande parti på 25,0 grader mellom 728 og 749 moh. Skogen held til 691 moh, og frå 706 er du i ope terreng.",
      "Ved dei små fjellvatna på 976 moh flatar det ut igjen — bandet frå 900 til 1000 moh måler 6,3 grader over 945 meter grunn. Det er her du ser resten av ruta, og det er òg den naturlege staden å snu om vinden har bygd skavl på ryggen over.",
      "Derfrå held du nordvestover mot toppryggen: 11,8 grader frå 1000 til 1100 moh og 18,0 frå 1100 til 1200. Dei siste metrane opp til 1331 moh blir gjerne gått utan ski.",
    ],
    descent: [
      "Ned same vegen, austover gjennom Vassdalen til Svartevatnet. Fallretninga er aust, og Vassdalen er både det brattaste og det mest skredutsette på turen.",
      "Vanlegaste feil: å runde skavlen mellom førtoppen og hovudtoppen på oversida. Det dannar seg normalt ei stor skavl der, og ein skal køyre ned i sida når ein rundar henne — ikkje følgje kanten.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Flat start, bratt midtdel og eit flatt parti før toppryggen: brattaste hundremeteren, 700 til 800 moh, måler 22,4 grader over 225 meter grunn, og brattaste samanhengande parti 25,0 grader mellom 728 og 749 moh. Vassdalen er skredterreng frå 600 moh og opp. Nede ved starten er faren ei anna: isen på eit magasin, og ruta er lagd på land utanom han.",
      },
      {
        title: "Terrenget rundt",
        body: "Skavlar langs toppryggen — det dannar seg normalt ei stor skavl mellom førtoppen og hovudtoppen, og ho skal rundast på nedsida. Sida ned frå hovudtoppen er skredterreng, og nordsida er den brattaste: 43,2 grader i snitt over 500 meter med eit 67,3-graders vindauge alt 10 til 70 meter ut frå varden, og nordaust 56,3 grader dei fyrste 60. Aust — vegen ned Vassdalen — måler 9,8 grader i snitt, og Vassdalen er likevel skredterreng og den einaste vegen ned til bilen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L21,198 L46,198 L65,199 L91,197 L111,189 L136,179 L151,170 L174,158 L194,145 L207,137 L226,126 L252,112 L278,103 L303,100 L326,102 L349,102 L372,94 L394,86 L413,80 L439,72 L461,62 L483,49 L510,43 L536,36 L568,25 L594,20 L600,18",
      startLabel: "538 moh",
      endLabel: "1331 moh",
      distanceLabel: "4,2 km",
      caption: "833 høgdemeter og 3,93 km frå Svartevatnet langs austbredden og opp Vassdalen til vatna på 976 moh, med skogen som slepper taket på 691.",
    },
  },
  rana: {
    slug: "rana",
    intro:
      "1602 høgdemeter frå 63 moh — fjord til topp på 8,61 km, med eit av dei eldste namna i Sunnmørsalpane på skiltet. Brattaste samanhengande parti måler 38,0 grader og ligg heilt oppe på toppkammen, mellom 1530 og 1554 moh.",
    ascent: [
      "Start ved Urkegjerdet, 63 moh, der grusvegen tek av frå hovudvegen ved Urke Landhandel. Vegen vidare mot Haukåssætra er vinterstengd, og det er difor turen startar nede ved fjorden og ikkje oppe ved sætra på 230 moh — Fri Flyts «5 timar frå Haukåssætra» er tida frå eit punkt du sjeldan kjem til med bil om vinteren.",
      "Følg vegen opp gjennom skogen — Kartverket fører skog til 231 moh — forbi Haukåssætra og inn i dalen mot Nordkopen på 501 moh. Bandet frå 400 til 500 moh måler 11,7 grader, og elles er heile innmarsjen slak: 5,5 grader frå 100 til 200 moh og 6,5 frå 200 til 300.",
      "Frå kopen sikksakkar ruta bratt opp mot egga i nord, og du tek inn på henne til høgre for ein markert hammar. Botnen ligg på 987 moh og eggkammen på 1331. Bandet frå 1200 til 1300 moh er brattaste hundremeteren, 19,2 grader i snitt, og partiet frå 700 til 1000 moh under det ligg på 16 til 19 grader.",
      "Derfrå følgjer du toppryggen nordover. Han er brei og slakar av mot 1400 moh — 7,2 grader frå 1300 til 1400 — før den siste stigninga langs kammen frå 1531 og 1562 moh til varden på 1587. Det er her det brattaste ligg: 38,0 grader over tretti meter mellom 1530 og 1554 moh.",
    ],
    descent: [
      "Ned same vegen: kammen, den breie toppryggen, ned egga til Nordkopen og ut dalen til Urkegjerdet. Kortet fører fallretninga som søraust; linja heim peilar 182 grader, altså rett sør, og kammen blir halden på vestsida der skavlane ikkje er. Nedkøyringa er lang — 1602 høgdemeter i eitt strekk frå toppen til fjorden.",
      "Vanlegaste feil: å halde seg aust på toppryggen. Det ligg store skavlar på austsida av ryggen, og ein flankemåling frå toppen viser at fjellet er bratt i alle retningar: 22 til 41 grader i snitt over dei fyrste 400 metrane, med 60-metersvindauge på 53 til 66 grader. Hald vest for kammen.",
      "Den andre er tidspunktet. Ruta går gjennom skredterreng både inn mot Nordkopen og i sida opp mot egga, og i vårsnø utover ettermiddagen er det den delen av turen som endrar seg raskast.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak innmarsj og bratt midtdel: bandet frå 1200 til 1300 moh måler 19,2 grader i snitt, og sida opp frå Nordkopen til egga er skredterreng. Sjølve toppkammen er brattaste partiet med 38,0 grader over tretti meter mellom 1530 og 1554 moh, og det er òg der skavlane ligg.",
      },
      {
        title: "Terrenget rundt",
        body: "Store skavlar på austsida av den breie toppryggen. Flankemålinga frå toppen gjev 22 til 41 grader i snitt over 400 meter i alle åtte retningar, med 60-metersvindauge mellom 53 og 66 grader — det finst ingen slak side å sleppe seg ned på her, berre kammen ein kom opp.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,198 L47,196 L72,193 L97,190 L122,183 L142,180 L163,177 L185,171 L210,163 L237,155 L257,148 L280,143 L300,134 L322,126 L339,119 L354,110 L370,101 L392,88 L414,80 L439,73 L455,63 L470,54 L498,46 L514,47 L534,39 L558,33 L580,26 L595,25 L600,18",
      startLabel: "63 moh",
      endLabel: "1587 moh",
      distanceLabel: "8,6 km",
      caption: "1602 høgdemeter og 8,61 km frå Urkegjerdet over Haukåssætra, Nordkopen og egga, med det brattaste på dei siste hundre høgdemetrane.",
    },
  },
  kolastinden: {
    slug: "kolastinden",
    intro:
      "Sunnmøres mest kjente skitopp. Slak dalgang hele veien inn, så en nordvendt passasje over 45°, bre — og en topp som er halvannen meter bred.",
    ascent: [
      "Fra parkeringen ved Standaleidet, 376 moh, følger du den ryddede traseen nordover mot Fossane under Søre Sætretind. Skogen slipper allerede på 410 moh, og fossen markerer inngangen til Kvanndalen.",
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
      path: "M0,200 L33,194 L56,194 L81,195 L108,184 L128,171 L152,164 L175,157 L199,154 L227,153 L246,148 L270,140 L294,134 L317,123 L336,113 L360,102 L378,103 L398,95 L422,82 L438,74 L454,70 L474,67 L493,58 L526,48 L553,38 L575,30 L588,25 L600,18",
      startLabel: "376 moh",
      endLabel: "1432 moh",
      distanceLabel: "5,7 km",
      caption: "376 moh ved Standaleidet til 1432 på Kolåstinden — 1120 høydemeter på 5,70 kilometer, med bre fra 1173 moh.",
    },
  },
  vassdalstinden: {
    slug: "vassdalstinden",
    intro:
      "1212 høgdemeter frå 92 moh i Nupen, gjennom Bukkedalen og opp ein lang flanke som held 23,6 grader i snitt dei siste hundre. Brattaste samanhengande parti måler 36,2 grader og ligg mellom 1205 og 1238 moh.",
    ascent: [
      "Start ved bilparkeringa etter bommen i Nupen, 92 moh. Fri Flyt oppgjev «3 timar frå Vallasætra» og «4 timar frå Nupen», og skilnaden er reell: sætra ligg på 324 moh, og den vidare vegen dit er bomveg som berre gjeld «viss vegen er open».",
      "Følg Engesetvegen oppover og austover til Vallasætra. Dei fyrste 766 metrane grunn er flate — 0,7 grader — og så tek vegen til: 5,3 grader frå 100 til 200 moh, 9,2 frå 200 til 300 og eit brattare parti på 19,9 og 21,8 grader mellom 400 og 600 moh. Skogen held til 581 moh.",
      "Frå setra går ein nokre hundre meter inn Langedalen og deretter bratt opp kneiken til Bukkedalen, 791 moh — eventuelt med skia på sekken. Bandet frå 700 til 800 moh er slakt, 8,9 grader over 632 meter grunn, og gjev deg pusterommet før flanken.",
      "Følg dalbotnen innover til 960 moh, der den bratte, lange flanken tek til. Herifrå stig linja jamt og hardt: 19,5 grader frå 1000 til 1100 moh, 22,5 frå 1100 til 1200 og 23,6 frå 1200 til 1300, med brattaste samanhengande parti på 36,2 grader mellom 1205 og 1238 moh. Toppen står på 1278. Like før flanken tek til går linja 97 meter over eit tjern på 946 moh, opptil 40 meter frå land. Det er naturleg og uregulert, og utan namn i registeret.",
    ],
    descent: [
      "Ned same flanken til dalbotnen, ut Bukkedalen og ned kneiken til Vallasætra og Nupen. Fallretninga er aust, og flanken er både oppstigninga og nedkøyringa.",
      "Vanlegaste feil: å navigere seg vestover frå toppen i dårleg sikt. Frå skaret nord for toppen fell Vestrenna 700 høgdemeter i 45 til 50 grader ned i Nupadalen. Ho er ei dokumentert ekspertlinje for dei som vel henne med opne auge, og ein alvorleg feil for dei som ikkje veit at ho er der.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "To bratte parti med eit slakt mellomspel: kneiken opp til Bukkedalen mellom 400 og 600 moh (19,9 og 21,8 grader i snitt) og flanken frå 960 moh til toppen, der bandet frå 1200 til 1300 moh måler 23,6 grader og brattaste samanhengande parti 36,2. Begge er skredterreng.",
      },
      {
        title: "Terrenget rundt",
        body: "Vestrenna frå skaret nord for toppen stuper 700 høgdemeter i 45 til 50 grader ned i Nupadalen. Ho er ikkje ruta, men ho er nær nok toppen til at feil retning i skodde tek deg dit.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L33,200 L62,199 L93,196 L121,194 L142,192 L170,185 L191,177 L220,169 L245,167 L274,165 L299,163 L317,154 L333,145 L353,132 L370,120 L387,111 L411,103 L436,94 L461,90 L482,79 L507,68 L530,63 L553,50 L569,42 L586,29 L600,18",
      startLabel: "92 moh",
      endLabel: "1278 moh",
      distanceLabel: "6,5 km",
      caption: "1212 høgdemeter og 6,50 km frå Nupen over Vallasætra og Bukkedalen, med skoggrensa på 581 moh og flanken frå dalbotnen på 960 moh til toppen.",
    },
  },
  saudehornet: {
    slug: "saudehornet",
    intro:
      "1161 høgdemeter rett opp frå Ørsta sentrum, og Fri Flyt graderer turen «Komplekst» av ein grunn: ryggkammen held rundt 32 grader i snitt dei siste 170 høgdemetrane med det brattaste partiet på 37, og på hard snø gir ei utglidning der lang utløpsbane. Fri Flyt reknar med at mange tek skia på sekken det siste stykket.",
    ascent: [
      "Frå parkeringa ved vasshuset øvst i Vikegeila, 149 moh, følgjer du anleggsvegen oppover Skåla. Skogen sluttar rundt 339 moh og terrenget er ope frå 344. Ved om lag 395 moh går ein av vegen der ein kartlagd sti tek av — det er same staden Fri Flyt skildrar med «på skrå mot Vikeelva, kryss elva».",
      "Over elva siktar du mot det lågaste punktet på ryggen mellom Vallahornet og Saudehornet, 812 moh. Skaret ligg lenger aust enn ei rett linje mellom dei to toppane skulle tilseia; ryggkammen sjølv har lågaste punkt der, og ein kartlagd sti følgjer han om lag tretti meter unna.",
      "Over skaret følgjer du sørryggen om lag 490 høgdemeter opp til toppen på 1303 moh. Stigninga er jamn til rundt 1137 moh og bratnar så. Målt langs sjølve ryggkammen frå 1135 moh og opp er stega 33, 30, 37 og 25 grader over om lag seksti meter: ryggen er brattast midtvegs, rundt 1266 moh, og slakkar inn mot toppkulen. Fri Flyt reknar med at mange tek skia på sekken dei siste 200 høgdemetrane.",
      "Langs toppeggja ligg det skavl. Du kan ikkje gå heilt ut på kanten, og det er verdt å vita før du står der og vil ha utsikta mot Hjørundfjorden.",
    ],
    descent: [
      "Vanlegaste nedkøyringa går same vegen, men gjerne på flanken på skiløparen si høgre side av renna — sørvestflanken, som held om lag 37 grader i 600 høgdemeter. Frå toppen fell terrenget 1303 til 1031 til 834 til 717 moh mot sørvest, altså 36 til 38 grader over dei fyrste 470 høgdemetrane. Det er samanhengande bratt køyring i eitt strekk.",
      "Vanlegaste feil: å tru at «rett ned mot Ørsta» er vest. Rett vest for skaret er hellinga 14 til 17 grader, men det gjeld berre nede ved skaret: frå 1270 moh og opp måler vestflanken 24 til 45 grader, og rett vest for toppen 32 til 47. Vest er uansett ei anna side av fjellet enn den som fører deg ned til bilen. Nedkøyringa er sørvestvend, og Fri Flyt nemner moglege sprekker i rennene på vestsida.",
      "Den andre feilen er å måla turen etter kor kort han er. 1157 høgdemeter frå sentrum av ein by gjer ikkje fjellet snilt — skredterrenget byrjar i Skåla og held fram heile vegen opp.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Det er skredterreng frå Skåla og heile vegen opp. Sørryggen er bratt nok til at ei utglidning på hard snø får lang utløpsbane: ryggkammen frå 1135 moh og opp held rundt 32 grader i snitt, med det brattaste partiet rundt 1266 moh på 37 grader. Tala for sjølve skisporet er lågare — 33,7 grader som brattaste parti og 23,2 i snitt for bandet 1200 til 1300 moh — fordi sporet sikk-sakkar over ryggen.",
      },
      {
        title: "Terrenget rundt",
        body: "Langs toppeggja ligg det skavl, så kanten er ikkje ein utsiktsplass. Sørvestflanken, som er nedkøyringa, held om lag 37 grader i 600 høgdemeter — 36 til 38 grader over dei fyrste 470 frå toppen. Fri Flyt nemner moglege sprekker i rennene på vestsida. Fjellet ligg rett over Ørsta sentrum, men det er ikkje ein snilltur, og det er for erfarne.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L33,192 L66,184 L93,177 L119,170 L146,163 L172,157 L192,157 L212,149 L238,140 L258,134 L275,128 L289,122 L307,114 L321,108 L341,101 L357,97 L384,94 L410,92 L436,84 L450,78 L470,71 L490,62 L503,56 L516,50 L529,44 L543,40 L551,37 L567,31 L582,24 L595,20 L600,18",
      startLabel: "149 moh",
      endLabel: "1303 moh",
      distanceLabel: "4,1 km",
      caption: "1157 høgdemeter og 4,00 km frå vasshuset i Ørsta, med dei siste 170 høgdemetrane på sørryggen i 33–39 grader.",
    },
  },
  slogen: {
    slug: "slogen",
    intro:
      "Sunnmørsalpenes dronning, og en av de mest alvorlige turene i landsdelen. 1535 høydemeter fra Norangsdalen til en topp de fleste går de siste 350 metrene til fots.",
    ascent: [
      "Fra veilomma ved Skylstad i Norangsdalen, 85 moh, går du rett opp Brekkheida. Hold deg vest for Brekkeelva gjennom hele skogen — elva ligger et par hundre meter øst for linja, og du kommer først inn på elvefaret oppe på flata rundt 700 moh. Dette er den bratteste delen av skogen: de hundre metrene mellom 200 og 300 moh ligger på 21,9° i snitt, og de under, 100 til 200 moh, på 19,0°.",
      "Skoggrensa slipper på 659 moh. Videre følger du sporet mot Patchellhytta inn på flata sørvest for hytta, drøyt 795 moh. Her forlater du hyttesporet. Sving vest opp østryggen før du krysser 1000-meteren — går du lenger inn mot Steinreset, må du hente igjen høyden på feil side av ryggen.",
      "Pukkelen topper på 1143 moh. Derfra faller ryggen 26 meter til et skar før den stiger til høgde 1204, og videre er det 56 meter ned til kolen på 1148 før selve toppryggen. Hold deg til høyre for ura.",
      "De siste 350 høydemeterne går de fleste til fots. Toppryggen smalner for hvert steg: 40 høydemeter under toppen faller nordsiden 43° og sørsiden 50°, og fra selve toppen måler nordflanken 57° og sørflanken 49° over de første 200 metrene ut. De øverste 70 meterne er knivegg. Toppen er 1564 moh.",
    ],
    descent: [
      "Ned går samme vei: til fots ned toppryggen, på ski igjen fra kolen på 1148 moh, tilbake over høgde 1204 og Pukkelen og ned østryggen til flata ved 795 moh. Derfra ned Brekkheida til Skylstad.",
      "Vanligste feil: å la seg friste av snøfeltene på flankene i stedet for å holde egga. Begge sider er brattest rett under kammen. Nordsiden går 57° over de første 200 metrene og holder over 50° i 300 høydemeter før den slaker av i ura rundt 1080 moh; sørsiden faller 49°, med et hamreband mellom 1530 og 1395 moh der enkelttrinn måler 78°. Det er her det har gått alvorlige ulykker. Hold ryggen til du er tilbake på Pukkelen.",
      "Sørsiden rett ned mot Norangsdalen ser kort ut fra toppen. Den faller nær 1500 høydemeter til dalbunnen og ligger på 44° i snitt fra 1200 moh og ned til 350, med enkelttrinn over 50°. Sommerråsa fra Øye-parkeringen går ikke her — den følger sørøstryggen på 25–33° og kommer inn på østryggen ved høgde 1204. Sørsiden er ingen nedkjøring.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skogpartiet over Brekkheida er brattest mellom 200 og 300 moh, 21,9° i snitt. Det bratteste enkelttrinnet på hele linja måler 46,9°, og det ligger ikke i skogen — det er toppblokka over 1520 moh, den delen skiene uansett bæres opp. Ryggen fra Pukkelen til høgde 1204 er snill: flankene der ligger på 26–35°. Det er de øverste 250 høydemeterne som er egg — nordsiden 43–57°, sørsiden 49–50°. Der er utglidning den reelle faren, og det er derfor skia blir båret.",
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
      path: "M0,199 L21,200 L45,199 L67,191 L81,185 L100,175 L119,165 L137,157 L162,147 L183,139 L203,131 L228,127 L257,121 L286,116 L307,113 L328,110 L348,101 L377,93 L398,90 L423,84 L444,74 L464,70 L485,65 L510,62 L525,56 L539,47 L551,42 L566,34 L585,26 L600,18",
      startLabel: "85 moh",
      endLabel: "1564 moh",
      distanceLabel: "6,5 km",
      caption: "85 moh ved Skylstad til 1564 på Slogen — 1520 høydemeter på 5,81 kilometer, de siste 350 til fots.",
    },
  },
  torvloysa: {
    slug: "torvloysa",
    intro:
      "1469 høgdemeter på 11,13 km frå Hatlestad — ein av dei lengste turane i Norddal, og ein av dei slakaste. Brattaste samanhengande parti måler 27,2 grader, og fem kilometer av ruta ligg på ryggen frå Daurmålsfjellet til toppen.",
    ascent: [
      "Start på den kartfeste parkeringa på Hatlestad, 453 moh, over Norddalen. Fri Flyt skriv at ein parkerer på 350 moh; terrengmodellen les gardane til 412 og p-plassen til 453, og differansen er grunnen til at turen her måler 1469 høgdemeter og ikkje 1500.",
      "Gå slakt inn i munningen av Dyrdalen og opp til Rellingsætra på 557 moh. Dei to fyrste banda er nesten flate — 3,0 grader frå 400 til 500 moh og 2,1 over 2656 meter grunn frå 500 til 600.",
      "Frå setra tek kneiken opp på Daurmålsfjellet, 825 moh: 15,4 grader frå 600 til 700 moh og 15,5 frå 700 til 800. Skogen held til 800 moh. Dette er den bratte delen av turen, og han er kort.",
      "Så følgjer ryggen. Fem kilometer i slakt terreng, over ryggpunktet på 1186 moh, med band mellom 7 og 16 grader heile vegen: 7,0 frå 1000 til 1100 moh, 15,5 frå 1200 til 1300, 16,4 frå 1700 til 1800 — brattaste hundremeteren — og 9,9 dei siste hundre til varden på 1851 moh. Kartverket registrerer ikkje breterreng nokon stad på sjølve linja: kvart punkt mellom 1380 og 1520 moh er ope område. Den næraste cella som er klassa SnøIsbre ligg om lag 300 meter frå ruta, på 1482 moh.",
    ],
    descent: [
      "Ned same ryggen: nordover til Daurmålsfjellet, ned kneiken til Rellingsætra og ut Dyrdalen til Hatlestad. Fallretninga er nord, og nedkøyringa er lang og jamn heller enn bratt.",
      "Vanlegaste feil: å vende for seint. Ti kilometer utan ly, med det meste av høgda langt frå bilen, gjer at eit verskifte kostar meir her enn på ein kort tur — vendinga må avgjerast tidleg, ikkje når du står på ryggen og ser at det trekkjer til.",
      "Den andre er sidene av ryggen. Han er brei nok til at ein ikkje tenkjer på kantane, men han fell av utanfor: frå varden måler vest 40,9 grader i snitt over 500 meter, sørvest 36,2 og søraust 35,2, med 60-metersvindauge på 49,3, 54,4 og 47,5. Nord og aust, som er vegen heim, held 9,0 og 9,3 grader. Ti kilometer i skodde på ein rygg som er slak i to retningar og bratt i seks er ei orienteringsoppgåve, ikkje ein tur ein improviserer.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak i begge endar og bratt eitt einaste stad: kneiken frå Rellingsætra opp på Daurmålsfjellet. Brattaste hundremeteren, 1700 til 1800 moh, måler 16,4 grader og brattaste samanhengande parti 26,9 grader mellom 1488 og 1508 moh. Ryggen elles ligg mellom 7 og 16 grader.",
      },
      {
        title: "Terrenget rundt",
        body: "Ryggen er brei og slak, men sidene er det ikkje: vest 40,9 grader i snitt frå varden, sørvest 36,2 og søraust 35,2. Nord og aust — vegen heim — held 9 grader. Det er lengda og orienteringa som er den reelle faren her: ti kilometer frå bilen i dårleg ver er ein annan tur enn ti kilometer i sol.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,199 L48,198 L66,190 L91,187 L115,185 L136,188 L162,187 L185,186 L204,179 L224,163 L243,154 L265,152 L287,148 L309,143 L333,137 L355,127 L377,119 L403,113 L423,105 L440,101 L461,87 L481,76 L503,69 L522,60 L546,50 L568,36 L590,23 L600,18",
      startLabel: "453 moh",
      endLabel: "1851 moh",
      distanceLabel: "11,1 km",
      caption: "1469 høgdemeter og 11,13 km frå Hatlestad over Rellingsætra og Daurmålsfjellet, med skoggrensa på 803 moh og ryggen frå 1186 moh til varden.",
    },
  },
  skarene: {
    slug: "skarene",
    intro:
      "1226 høgdemeter på 6,59 km frå Korsmyra, med to kilometer flat dalbotn før den store snøflanken tek til. Flanken held 18 til 21 grader i band etter band frå 900 til 1700 moh — og han er samanhengande skredterreng heile vegen.",
    ascent: [
      "Start på biloppstillingsplassen på Korsmyra, 621 moh, ved hovudvegen mellom Eidsdal og Geiranger. Tilkomsten står under Eidshornet hos Fri Flyt, og det er den same plassen.",
      "Følg setervegen inn til Grandesætra på 648 moh og vidare slakt inn og oppover Gråsteindalen, 721 moh. Dei to fyrste banda er nesten flate: 3,7 grader over 1268 meter grunn frå 600 til 700 moh og 3,6 over 1575 meter frå 800 til 900.",
      "Komen inn mot botnen av dalen på 940 moh tek den store snøflanken til, og han held same karakter heilt opp: 17,9 grader frå 900 til 1000 moh, 20,5 frå 1000 til 1100, 19,6 frå 1300 til 1400, 21,2 frå 1500 til 1600 og 21,2 frå 1600 til 1700 — dei to brattaste hundremetrane. Brattaste samanhengande parti måler 27,9 grader mellom 1528 og 1544 moh.",
      "Dei siste hundre høgdemetrane slakar av til 9,6 grader og fører fram til varden på 1830 moh, eit av dei høgaste punkta i fjella over Eidsdal. Registeret skriv fjellet Skorene.",
    ],
    descent: [
      "Ned same flanken og ut Gråsteindalen til Grandesætra og Korsmyra. Fri Flyt kallar dette flott skiterreng med snille hellingsvinklar, og tala er einige: ingen band over 21,3 grader.",
      "Vanlegaste feil: å lese dei snille hellingsvinklane som ein grunn til å gå på ein ustabil dag. Heile strekket frå botnen av Gråsteindalen og opp er skredterreng, flanken er stor og samanhengande, og det finst inga line rundt han — turen bør gåast på stabile dagar, og det er heile vurderinga.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ein samanhengande snøflanke frå 940 moh til toppen, med band mellom 17,9 og 21,2 grader og brattaste samanhengande parti på 27,9 grader mellom 1528 og 1544 moh. Hellinga er moderat; det er storleiken og samanhengen som er problemet.",
      },
      {
        title: "Terrenget rundt",
        body: "Skredterreng frå botnen av Gråsteindalen og heile vegen opp til toppen. Flanken er stor og samanhengande, og det finst inga line rundt han: går du turen, går du i han. Og toppen er ikkje slak på baksida: vest måler 40,0 grader i snitt over 500 meter med eit 67,7-graders vindauge, nordvest 29,5 med 70,4 og nordaust 37,7 med 65,6. Sør og søraust — flanken du kom opp — held 13 grader.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,198 L50,198 L77,194 L107,190 L136,185 L161,181 L184,176 L210,171 L236,169 L266,169 L292,168 L316,165 L345,156 L365,145 L382,135 L398,125 L427,112 L446,102 L470,88 L488,77 L505,67 L521,56 L534,48 L554,36 L579,24 L600,18",
      startLabel: "621 moh",
      endLabel: "1830 moh",
      distanceLabel: "6,6 km",
      caption: "1219 høgdemeter og 6,44 km frå Korsmyra over Grandesætra og Gråsteindalen, med snøflanken frå dalbotnen på 940 moh til varden på 1830.",
    },
  },
  melshornet: {
    slug: "melshornet",
    intro:
      "565 høgdemeter på 3,30 km frå Helgatun, opp ei preparert og merkt løype som blir gått i mørket heile vinteren. Brattaste samanhengande parti måler 23,8 grader, og det ligg nede rett over skoggrensa på 454 moh — ikkje oppe under varden.",
    ascent: [
      "Start på den store parkeringsplassen ved Helgatun på Krøvelseidet, 252 moh, på fv5894 Vikebygdvegen mellom Volda og Åmdalen. Løypa tek av frå plassen og går rett inn i skogen. Ho er tidvis preparert med trakkemaskin, og den siste bakken er merkt med brøytestikker.",
      "Dei fyrste hundre og femti høgdemetrane er slake: bandet frå 200 til 300 moh måler 5,3 grader i snitt over 580 meter grunn, og 300 til 400 moh 12,0 grader. Skogen slepper taket ved 454 moh, og brattaste steget på heile turen ligg like under skoggrensa — 23,8 grader over tretti meter, mellom 458 og 472 moh.",
      "Over skoggrensa flatar det ut mot ryggen ved 519 moh. Bandet frå 500 til 600 moh er det slakaste på turen, 6,7 grader over 855 meter grunn, og herifrå ser du kvar resten av ruta går.",
      "Ryggen stig jamt til topps: 12,9 grader frå 600 til 700 moh og 13,1 frå 700 til 800. Dei siste høgdemetrane til varden på 809 moh er flate — bandet over 800 moh måler 7,0 grader.",
    ],
    descent: [
      "Ned same løypa, søraustover. Det er den same lia du gjekk opp, kort og oversiktleg, og du har bilen i sikte det meste av vegen ned.",
      "Vanlegaste feilen på dette fjellet er ikkje eit linjeval, men eit tidsval: turen blir gått i mørket gjennom heile vinteren, og då er traseen og brøytestikkene navigasjonen. Forlèt du løypa, er sidene av Grøthornet skredterreng, og nær toppen kan det liggje skavl ut mot Ørsta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Preparert og merkt løype i slakt terreng. Brattaste samanhengande parti måler 23,8 grader og ligg lågt, mellom 458 og 472 moh rett under skoggrensa; over 500 moh er turen på sitt slakaste med 6,7 grader i snitt frå 500 til 600 moh, og brattaste hundremeteren, 400 til 500 moh, måler 13,6.",
      },
      {
        title: "Terrenget rundt",
        body: "Sidene av Grøthornet er skredterreng, og nær toppen kan det liggje skavl mot Ørsta. Begge deler ligg utanfor løypetraseen — og begge blir aktuelle i same augeblikk som du forlèt han i dårleg sikt eller i mørket.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,198 L48,194 L65,191 L81,188 L106,182 L130,176 L147,170 L163,165 L186,156 L202,151 L212,147 L237,137 L253,128 L278,118 L287,113 L310,109 L327,110 L343,111 L359,111 L384,105 L400,98 L417,92 L434,85 L458,76 L474,73 L499,60 L515,51 L531,43 L556,34 L572,28 L589,21 L600,18",
      startLabel: "252 moh",
      endLabel: "809 moh",
      distanceLabel: "3,3 km",
      caption: "559 høgdemeter og 3,00 km frå Helgatun på Krøvelseidet, med skoggrensa på 454 moh og brattaste hundremeteren mellom 400 og 500 moh.",
    },
  },
  jakta: {
    slug: "jakta",
    intro:
      "1569 høgdemeter frå fjorden på under fem kilometer, og det meste av dei kjem i eitt strekk. Frå Konedalen går ei side opp på ein smal topprygg — 25 til 33 grader nedst, 40 til 50 dei siste 200 høgdemetrane som har skavl mot Konedalen og ein om lag 80 grader bratt vegg ned mot Hjørundfjorden på hi sida.",
    ascent: [
      "Frå vegenden ved Lisjeholen sør for Norang-gardane, 61 moh, tek du den bratte stien opp til Konedalen med skia på sekken — fyrst på venstre side av elva, så over på høgre. Skogen sluttar rundt 296 moh og terrenget er ope frå om lag 400. Dette er den delen av turen som ikkje er skitur, og ho stig 20 til 22 grader i snitt.",
      "Oppe i dalen tek du på deg skia og følgjer det slake dalføret sørvestover til om lag 740 moh. Hald deg på søraustre side på veg inn: det kan gå skred frå Jakta heile vegen inn Konedalen, og dalbotnen er utløpssona.",
      "Ved 740 moh svingar du til høgre og sikk-sakkar opp sida i nordvest til du når toppryggen ved 1240 moh. Sida er ikkje jamn: nedst held ho 25 til 33 grader, men dei siste 200 høgdemetrane opp mot ryggen måler fallinja 40 til 50. Dette er den store skredfella på turen: eit samanhengande heng på 300 til 400 høgdemeter, og det er også nedkøyringa. Linja slik ho er teikna held 35,0 grader som brattaste samanhengande parti — sikk-sakken er kva som gjer talet lågare enn fallinja.",
      "Ryggen blir følgd sørvestover heilt til topps på 1589 moh. Hald deg midt på han. Den bratteste hundremeteren på turen ligg mellom 1500 og 1600 moh og måler 24,6 grader i snitt, men det er ikkje hellinga som er problemet på ryggen — det er breidda: ein kryssprofil ved 62,1715 nord gjev 1556 moh på ryggen og 1265 moh berre 52 meter nordvest for han.",
    ],
    descent: [
      "Vanlegaste nedkøyring er same vegen tilbake: 45 til 50 grader dei fyrste 200 høgdemetrane frå ryggen, så 30 til 35 ned mot Konedalen og slakare vidare ut dalen, og til slutt stien ned til Lisjeholen med skia på sekken igjen. Sida ned frå ryggen er den beste køyringa på turen og samstundes det brattaste og mest skredutsette du er innom.",
      "Vanlegaste feil: å lesa skavlane etter «høgre og venstre» i staden for etter kompasset. Fri Flyt skriv om skavlar både til høgre ned mot Konedalen og til venstre ned nordveggen, men det gjeld nedstiginga — på veg opp ligg Konedalen i søraust og fjordveggen i nordvest. Nordvestsida er ikkje ei felle du kan korrigera for undervegs: DTM1 måler om lag 80 grader rett under toppen, og fallet er nær 290 høgdemeter på 52 meter grunn.",
      "Den andre feilen er å gå for langt inn i dalen før du tek av. Ruta svingar opp ved om lag 740 moh, 1,6 kilometer frå vegenden. Fyrste utkastet av denne ruta svinga opp mot dalbotnen lenger inne, og den linja måler 40 til 44 grader mellom 1030 og 1205 moh. Sida ved 62,174 til 62,176 nord er den som held 33 til 36 heile vegen til ryggen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Sida frå Konedalen opp til toppryggen er den store skredfella: 25 til 33 grader nedst og 40 til 50 dei øvste 200 høgdemetrane, i eit samanhengande heng på over 400, og du må gjennom henne både opp og ned. Det kan gå skred frå Jakta heile vegen inn Konedalen, så hald deg på søraustre side på veg inn dalen. Brattaste samanhengande parti på linja måler 35,0 grader, og brattaste hundremeter, 1500 til 1600 moh, 24,6 grader i snitt.",
      },
      {
        title: "Terrenget rundt",
        body: "Toppryggen har skavl til begge sider — mot Konedalen i søraust, og mot nordvestveggen ned mot Hjørundfjorden, der DTM1 måler om lag 80 grader rett under toppen: 1556 moh på ryggen og 1265 moh 52 meter nordvest. Ein skavl som brest på den sida har ingen utgang. Held du deg midt på kammen frå 1240 moh og opp, er det den einaste linja som ikkje har eit stup eller eit 35-graders heng under seg.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L34,194 L62,187 L84,179 L104,172 L120,167 L140,159 L163,151 L175,147 L203,135 L225,128 L248,121 L282,112 L310,106 L329,99 L344,95 L368,86 L395,78 L413,71 L429,66 L456,60 L474,56 L502,49 L525,42 L544,36 L567,32 L587,23 L600,18",
      startLabel: "61 moh",
      endLabel: "1589 moh",
      distanceLabel: "4,8 km",
      caption: "1569 høgdemeter og 4,78 km frå Norang, med den 33–36 grader bratte sida frå Konedalen opp til toppryggen som turens nøkkelparti.",
    },
  },
  skarasalen: {
    slug: "skarasalen",
    intro:
      "1452 høgdemeter i eitt strekk frå bommen i Bondalen, og storhellinga midt på turen går rett ved sida av ei renne som tømmer seg mot setervegen kvar vinter. Toppplatået er lettvint når du fyrst står på det — det er vegen dit og skavlane over austveggen som gjer turen krevjande.",
    ascent: [
      "Frå bommen på Kvistadvegen ovanfor Kvistad-gardane, 104 moh, følgjer du den vinterstengde setervegen om lag 3,7 kilometer sørover og innover Kvistaddalen til parkeringa framfor Kvistadsætra og Årsetsætra, 509 moh. Dei 405 høgdemetrane opp setervegen er slake — bandet frå 100 til 500 moh ligg på 5 til 7 grader i snitt — og opnar bommen seint i april eller tidleg i mai, kan du køyra dei og kutta både kilometrane og høgdemetrane.",
      "Frå setrene går ruta nordaustover opp gjennom open bjørkeskog. Skogen held til rundt 693 moh og terrenget er ope frå 696.",
      "Så kjem storhellinga: opp mot skaret mellom Blåhornet og Skårasalen, 1074 moh, nord for og langsmed skredrenna aust for Blåhornet. Hellinga held 30 til 40 grader frå om lag 800 til 1100 moh. Linja slik ho er teikna sikk-sakkar og held 26,7 grader som brattaste samanhengande parti, med bandet frå 900 til 1000 moh på 19,3 grader i snitt — men renna ved sida av deg er den same uansett kor fint sporet ligg.",
      "Over skaret svingar du aust-nordaust opp hovudhellinga mot ryggen og inn på toppplatået ved 1448 moh, og siste stykket sørover langs platået til toppen på 1542 moh. Linja kjem inn på platået frå nordvest med vilje: aust for eggja fell fjellet 300 høgdemeter på 74 meter grunn, om lag 76 grader, ned i Skåradalen.",
    ],
    descent: [
      "Ned same vegen: nordvestover av toppen ned på platået, vestover langs platået og ned hovudhellinga til skaret, storhellinga ned mot setrene og setervegen ut. Sett av tid til dei siste 3,7 kilometrane — dei er flate nok til at du stakar dei.",
      "Vanlegaste feil: å halda for langt aust på toppplatået — og å tru at sørvest er vegen ned. Sørvest for toppen ligg Vestrennene på 45 grader; linja går nordvest. Skavlane ligg mot aust, og under dei fell austveggen 300 høgdemeter på 74 meter. I flatt lys er eggja ikkje synleg, og platået gir ingen andre haldepunkt.",
      "Vestrennene ned til Årsetsætra er 45 grader og er ikkje ein del av denne ruta. Den tredje dokumenterte nedkøyringa, Lisje Skåradalen mot Skår ved Hjørundfjorden, er 25 til 30 grader krusterreng — men han endar ved fjorden, ikkje ved bilen din i Bondalen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Renna aust for Blåhornet går vanlegvis eitt eller fleire store skred ned mot setervegen kvar vinter, og oppstiginga går rett ved sida av henne. Hellinga held 30 til 40 grader frå om lag 800 til 1100 moh, og det er turens nøkkelparti både opp og ned. Sjølve linja måler 26,7 grader som brattaste samanhengande parti fordi ho sikk-sakkar; det endrar ikkje kva som ligg over sporet.",
      },
      {
        title: "Terrenget rundt",
        body: "På toppplatået ligg det store skavlar mot aust, der fjellet fell 300 høgdemeter på 74 meter ned i Skåradalen — om lag 76 grader. Hald god avstand frå eggja. Vestrennene, som er ei dokumentert nedkøyring for andre parti, er 45 grader og ligg utanfor denne ruta.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,196 L55,192 L83,186 L112,183 L138,179 L163,173 L185,169 L210,165 L235,160 L261,157 L286,155 L312,149 L337,146 L359,138 L384,125 L409,111 L425,104 L438,96 L454,87 L474,78 L496,71 L514,61 L529,52 L545,42 L565,32 L594,21 L600,18",
      startLabel: "104 moh",
      endLabel: "1542 moh",
      distanceLabel: "7,5 km",
      caption: "1438 høgdemeter og 7,62 km frå bommen på Kvistadvegen, der dei fyrste 3,7 kilometrane er stengd seterveg og 405 høgdemeter.",
    },
  },
  kvitegga: {
    slug: "kvitegga",
    intro:
      "1477 høgdemeter på 6,05 km frå Nibbedalen til det høgste fjellet i midtre Sunnmørsalpane. Brattaste samanhengande parti måler 38,1 grader — det er Brattbakken, og han er den eine tekniske delen av turen.",
    ascent: [
      "Start i grustaket i Nibbedalen, 324 moh, der sidevegen tek av frå fv655. Er vegen ikkje brøytt, parkerer ein langs fylkesvegen. Dei fyrste 771 metrane grunn ligg på 5,9 grader.",
      "Følg grusvegen eit lite stykke og deretter sommarstien sørvestover inn Snødalen — rutebeskrivinga seier vestover, men etappen måler 210 grader. Stigninga er jamn og vedvarande: 20,1 grader frå 500 til 600 moh, 19,6 frå 600 til 700 og 19,0 frå 700 til 800. Ved 925 moh er du inne i sjølve dalen.",
      "Innerst tek Brattbakken til — bakken opp mot 1316 moh som rutebeskrivinga set til om lag 35 grader. Terrengmodellen måler bandet frå 1100 til 1200 moh til 22,5 grader i snitt og det brattaste samanhengande partiet til 38,1 grader mellom 1265 og 1292 moh. Kartverket registrerer breterreng frå 1290 moh.",
      "Over bakken flatar det brelagde platået ut: 10,2 grader frå 1200 til 1300 moh og 5,6 frå 1500 til 1600 over 1036 meter grunn. Du følgjer det til høgda på 1583 moh, går ned eit lite skar og nordover langs ryggen til toppen på 1700 moh. Den publiserte høgda 1717 er snøkuppelen; terrengmodellen les fjellet til 1700.",
    ],
    descent: [
      "Ned same vegen: sørover langs ryggen, over platået og ned Brattbakken til Snødalen. Fallretninga er aust — men det er retninga heim, ikkje det fyrste steget: frå varden går ruta sørover langs ryggen til høgda på 1583 moh før ho svingar ned. Rett aust for toppen måler flanken 39,2 grader i snitt med eit 73,1-graders vindauge 190 til 250 meter ut, og det er ikkje ein nedkøyring. Brattbakken er den delen av den rette nedkøyringa som avgjer om dagen er ein skitur eller ei øving i kantsikring.",
      "Vanlegaste feil: å gå på breen utan å ta han på alvor. Ruta kryssar breterreng frå 1290 moh, og sprekkene er der uansett kor slakt platået måler. Den andre er skavlane langs toppryggen — hald avstand til kantane, særleg i dårleg sikt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn stigning på 19 til 20 grader gjennom Snødalen, og så Brattbakken: bandet frå 1100 til 1200 moh måler 22,5 grader i snitt og brattaste samanhengande parti 38,1 grader mellom 1265 og 1292 moh. Bakken er skredterreng, og han er den einaste vegen opp på platået.",
      },
      {
        title: "Terrenget rundt",
        body: "Breterreng frå 1290 moh med sprekker seinvinters og utover våren. Store skavlar langs toppryggen — hald avstand til kantane. Platået er slakt nok til at ein sluttar å lese terrenget, og det er nettopp der breen ligg.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade, og breutstyr — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L27,199 L54,196 L81,187 L108,182 L130,171 L150,162 L162,156 L180,148 L197,139 L218,133 L234,126 L255,115 L274,106 L295,96 L317,84 L342,73 L357,72 L384,72 L406,64 L429,53 L451,43 L469,36 L493,35 L513,37 L540,34 L571,25 L598,18 L600,18",
      startLabel: "324 moh",
      endLabel: "1700 moh",
      distanceLabel: "6,1 km",
      caption: "1477 høgdemeter og 6,05 km frå grustaket i Nibbedalen gjennom Snødalen, over Brattbakken og høgda på 1583 moh til toppen.",
    },
  },
  hornindalsrokken: {
    slug: "hornindalsrokken",
    intro:
      "1466 høgdemeter på 7,29 km frå Langøylia, over ein sørrygg som går opp og ned — 327 høgdemeter blir gjevne frå seg på veg opp. Dei siste 103 går på smal, eksponert rygg der brattaste samanhengande parti måler 46,6 grader, og der set dei fleste skia igjen.",
    ascent: [
      "Start ved vestenden av hyttevegen i Langøylia, 388 moh, mellom Hellesylt og Hornindal. Gå opp lia gjennom open lauvskog, aust for Gjøelva; skogen held til 673 moh, og bandet frå 600 til 700 moh måler 18,9 grader.",
      "Ved Aksla på 921 moh er du oppe på ryggen. Følg han nordvestover til Trollaksla, 1255 moh, og deretter sørryggen nordover til Sætrenibba på 1370 moh. Ryggen går opp og ned heile vegen: banda frå 1100 til 1300 moh måler 3,7 og 3,5 grader over til saman meir enn tre kilometer grunn, og turen gjev frå seg 327 høgdemeter samla.",
      "Frå skaret nord for Sætrenibba, 1226 moh, rundar ein austover inn i sida som fell mot Kjellstaddalen og traverserer henne opp mot ryggen aust for toppen. Dette er skredterreng, og det er den same sida ein køyrer ned.",
      "Ved om lag 1424 moh er du på austribba, og der tek dei fleste av seg skia. Dei siste 103 høgdemetrane er smal og eksponert rygg: bandet frå 1400 til 1500 moh måler 23,3 grader i snitt, brattaste samanhengande parti 46,6 grader mellom 1476 og 1508 moh, og terrengmodellen gjev om lag 55 grader rett aust for ryggen og 75 rett vest.",
    ],
    descent: [
      "Vanlegaste nedkøyring er Kjellstaddalen: nesten tusen høgdemeter i 25 til 35 grader ned til Kjellstadsætra, og deretter eit par flate kilometer ut dalen og vestover attende til bilen. Fallretninga er aust.",
      "Vanlegaste feil: å tru at toppryggen er skiterreng. Dei siste 103 høgdemetrane er ein rygg med 55 grader ned den eine sida og 75 ned den andre — eit feiltrinn der er ikkje til å rette opp, og isøks er vanleg når snøen er hard.",
      "Den andre er å starte for seint. Turen er lang, ryggen går opp og ned, og traversen over austsida ovanfor Kjellstaddalen er skredterreng som endrar seg med sola. Vending må avgjerast tidleg.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ein lang rygg som går opp og ned, og ein travers over austsida ovanfor Kjellstaddalen. Bandet frå 1400 til 1500 moh måler 23,3 grader i snitt, og brattaste samanhengande parti 46,6 grader mellom 1476 og 1508 moh — det siste er austribba, ikkje skisporet.",
      },
      {
        title: "Terrenget rundt",
        body: "Skredterreng i botnen av Kjellstaddalen og i heile austsida opp mot toppryggen — det er både traversen på veg opp og nedkøyringa. Toppryggen er smal og skavlete: om lag 55 grader rett aust og 75 rett vest dei siste hundre høgdemetrane.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade, og isøks når snøen er hard — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,192 L58,179 L84,164 L100,154 L118,142 L136,131 L155,122 L174,115 L196,106 L218,96 L244,85 L269,75 L288,63 L314,68 L336,76 L357,77 L377,73 L399,76 L422,68 L444,56 L459,45 L477,55 L500,65 L522,65 L544,58 L559,47 L581,36 L595,21 L600,18",
      startLabel: "388 moh",
      endLabel: "1527 moh",
      distanceLabel: "7,3 km",
      caption: "1466 høgdemeter og 7,29 km frå Langøylia over Aksla, Trollaksla og Sætrenibba, med austribba frå 1424 moh som stykket dei fleste går til fots.",
    },
  },
  sunndalsnipa: {
    slug: "sunndalsnipa",
    intro:
      "989 høgdemeter på 5,56 km frå Grøndalsvatnet, opp ein søraustrygg og ut på eit platå der dei siste 1261 metrane grunn ligg på 4,2 grader. Solvend og tilgjengeleg gjennom heile vinteren — vegen inn er open året rundt.",
    ascent: [
      "Start ved vegenden ved Grøndalsvatnet, 437 moh, opp bakkane frå Osdalen. Dei fyrste 638 metrane grunn er slake, 5,7 grader, og går over myr og inn i open lauvskog.",
      "Gå nordover gjennom skogen — Kartverket fører skog til 722 moh — og opp på søraustryggen. Stigninga aukar jamt: 14,7 grader frå 500 til 600 moh, 15,6 frå 600 til 700 og 19,6 frå 700 til 800, som er brattaste hundremeteren på turen.",
      "Ved skogkanten på 839 moh flatar det ut markert: bandet frå 800 til 900 moh måler 5,2 grader over 1035 meter grunn. Så tek ryggen til igjen, 14,0 grader frå 900 til 1000 moh og 17,3 frå 1100 til 1200, med brattaste samanhengande parti på 29,0 grader mellom 1073 og 1094 moh.",
      "Frå 1280 moh er du på platået, og derfrå er det om lag ein kilometer nordover til toppvarden på 1395 moh — bandet frå 1300 til 1400 moh måler 4,2 grader. Hald deg midt på platået: både vest- og austsida fell bratt.",
    ],
    descent: [
      "Ned same ryggen, sørover over platået og ned gjennom lauvskogen til Grøndalsvatnet. Fallretninga er sør, og det er den solvende sida — føret skiftar fort utover dagen om våren.",
      "Vanlegaste feil: å ta ut mot kanten på platået i skodde. Både vest- og austveggen fell bratt frå platået, og på ein flate som ligg på 4,2 grader finst det ingen helling som fortel deg at du er på veg feil.",
      "Den andre er sørflanken. Fri Flyt nemner henne som ei brattare nedkøyring på stabile dagar; ho er skredterreng, og ho er eit eige val — ikkje ein snarveg ned frå platået.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak i begge endar og jamn i midten: brattaste hundremeteren, 700 til 800 moh, måler 19,6 grader, og brattaste samanhengande parti 29,0 grader mellom 1073 og 1094 moh. Platået frå 1300 til 1400 moh ligg på 4,2 grader over 1261 meter grunn.",
      },
      {
        title: "Terrenget rundt",
        body: "Bratte vestre og austre vegger frå platået — det er ei orienteringsfelle i skodde og snødrev heller enn eit skredproblem i seg sjølv. Sørflanken er den brattare nedkøyringa, og ho er skredterreng.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,198 L49,193 L74,186 L89,179 L113,168 L132,160 L150,149 L166,138 L181,130 L200,123 L221,123 L244,122 L259,121 L283,117 L301,106 L321,96 L346,91 L365,84 L380,76 L395,67 L410,57 L438,48 L457,39 L472,32 L493,27 L511,26 L532,24 L554,23 L579,19 L600,18",
      startLabel: "437 moh",
      endLabel: "1395 moh",
      distanceLabel: "5,6 km",
      caption: "989 høgdemeter og 5,56 km frå Grøndalsvatnet opp søraustryggen, med skoggrensa på 722 moh og ein kilometer flatt platå fram til varden.",
    },
  },
  eidskyrkja: {
    slug: "eidskyrkja",
    intro:
      "1115 høgdemeter på 4,56 km frå Skinnviksætra opp Blåbreen, ei jamn bre som legg seg gradvis slakare mot toppplatået. Brattaste samanhengande parti måler 22,9 grader — det er sprekkene og orienteringa, ikkje hellinga, som gjer denne turen kompleks.",
    ascent: [
      "Start på setervegen ved Skinnviksætra, 368 moh, på nordsida av Austefjorden. Vegen inn er bomveg, og turen reknar ein som tilgjengeleg etter at han opnar — det er difor sesongen står som mars til mai.",
      "Gå sørover og opp mot breen. Terrenget er ope heile vegen; det er ingen skog på denne ruta. Stigninga er jamn: 14,1 grader frå 400 til 500 moh, 15,5 frå 500 til 600 og 16,1 frå 700 til 800.",
      "Frå om lag 1197 moh er du inne på Blåbreen. Brattaste hundremeteren ligg like under, 1000 til 1100 moh med 18,3 grader i snitt, og brattaste samanhengande parti måler 22,9 grader mellom 1166 og 1179 moh. Kartverket registrerer breterreng på linja frå 1409 moh.",
      "Den siste kilometeren er slak stigning sørover mot toppvarden på 1482 moh: 13,9 grader frå 1300 til 1400 moh og 11,0 over det. Hald deg midt på breen.",
    ],
    descent: [
      "Ned same linja, nordover over breen og ned til Skinnviksætra. Fallretninga er nord, og på vårføre kan ein òg traversere mot Lisje Eidskyrkja — det er ein variant, ikkje normalruta.",
      "Vanlegaste feil: å sleppe seg vestover på breen. Sprekkene ligg vest på breen, og der er òg utløpsområda for skred. Held du deg midt på, er hellinga moderat heile vegen; forlèt du midtlinja, byter turen karakter.",
      "Den andre er toppområdet i skodde eller snødrev. Platået er vidt og flatt, og orienteringa der oppe er den eine tekniske oppgåva turen faktisk stiller.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Moderat helling og bre. Brattaste hundremeteren, 1000 til 1100 moh, måler 18,3 grader og brattaste samanhengande parti 22,9 grader mellom 1166 og 1179 moh; breterrenget er registrert frå 1409 moh på linja. Skredfaren er liten om ein held seg midt på Blåbreen.",
      },
      {
        title: "Terrenget rundt",
        body: "Sprekker vest på breen, og utløpsområde for skred i det same området. Toppplatået er ei orienteringsfelle ved skodde eller snødrev — det er der turen krev mest av deg, og det er ikkje hellinga som er grunnen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade, og breutstyr — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L30,195 L53,189 L75,183 L101,174 L119,167 L142,160 L172,155 L195,149 L213,143 L231,137 L255,129 L278,119 L298,111 L320,108 L337,102 L361,93 L385,83 L402,76 L414,72 L431,65 L444,62 L462,56 L480,51 L501,45 L527,38 L550,30 L572,23 L598,18 L600,18",
      startLabel: "368 moh",
      endLabel: "1482 moh",
      distanceLabel: "4,6 km",
      caption: "1115 høgdemeter og 4,56 km frå Skinnviksætra over Blåbreen, med breterreng registrert frå 1409 moh og eit vidt toppplatå øvst.",
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
      "906 høgdemeter på 4,45 km frå idrettsanlegget i Randabygd, sørvend og jamn heile vegen. Brattaste samanhengande parti på linja måler 23,8 grader — det er ein dagstur i høgdemeter og ein enkel tur i helling.",
    ascent: [
      "Start på parkeringa ved idrettsanlegget i Randabygd, 398 moh på Ålandsleite. Følg grusvegen nordaustover; det fyrste kilometeret er nesten flatt, med bandet frå 400 til 500 moh på 5,4 grader over 1125 meter grunn.",
      "Ved Djupegrova på 487 moh svingar ruta nordover og nordvestover, og held seg på vestsida av grova heile vegen. Her kjem det fyrste brattare partiet: 15,7 grader i snitt frå 500 til 600 moh.",
      "Skogen held til 748 moh. Over den flatar det ut ei stund før stigninga tek seg opp att mot skaret: 15,7 grader frå 800 til 900 moh og 18,5 frå 900 til 1000, som er brattaste hundremeteren på turen. Brattaste samanhengande parti måler 23,8 grader og ligg mellom 1280 og 1297 moh.",
      "Frå det markerte skaret held du austover mot toppen. Dei siste hundre høgdemetrane er slakare igjen, 11,6 grader frå 1200 til 1300 moh, og varden står på 1297.",
    ],
    descent: [
      "Ned same vegen: austover ned til skaret, sørvestover ned den opne sida og attende langs Djupegrova til idrettsanlegget. Sørvendinga gjer at føret kan skifte fort utover dagen om våren.",
      "Vanlegaste feil: å køyre rett ned frå toppen i staden for å ta seg tilbake til skaret. Rett under toppen av Glitregga er terrenget bratt, og det er den eine staden på turen der linja må vere den skildra.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn og oversiktleg: brattaste hundremeteren, 900 til 1000 moh, måler 18,5 grader, og brattaste samanhengande parti 23,8 grader mellom 1280 og 1297 moh. Det er lengda og dei 901 høgdemetrane som gjer turen krevjande, ikkje hellinga.",
      },
      {
        title: "Terrenget rundt",
        body: "Det bratte under toppen ligg mot nord: 26,3 grader i snitt over 500 meter med eit 37,8-graders vindauge 250 til 310 meter ut, og nordvest og nordaust 20,3 og 21,0. Sør, aust og vest er nesten flate — 2,8, 8,9 og 1,8 grader — så det er nordsida, og berre henne, linja over skaret held deg unna både opp og ned. Sida ned mot Djupegrova er den andre staden der eit linjeval får konsekvensar, for grova samlar snø frå heile flanken over.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L24,199 L49,196 L73,191 L97,187 L122,183 L146,181 L167,181 L188,175 L213,165 L233,156 L261,146 L285,140 L310,134 L334,127 L364,115 L388,106 L413,94 L437,82 L449,76 L473,66 L491,58 L510,51 L534,40 L558,30 L583,25 L600,18",
      startLabel: "398 moh",
      endLabel: "1297 moh",
      distanceLabel: "4,5 km",
      caption: "901 høgdemeter og 4,38 km frå Randabygd idrettsanlegg, med skoggrensa på 748 moh og brattaste hundremeteren mellom 900 og 1000 moh.",
    },
  },
  storronden: {
    slug: "storronden",
    intro:
      "1145 høydemeter fra Spranget, men fjellet begynner først etter seks kilometer: innmarsjen til Rondvassbu stiger 132 høydemeter, og resten kommer på 2,6 kilometer opp vestryggen. Enklere enn Rondslottet fra samme parkering — ingen egg, ingen gjenstigning.",
    ascent: [
      "Fra Spranget p-plass, 1082 moh, følger du Rondvassbu-vegen seks kilometer nordøstover: over 1137 moh, gjennom dalen sørvest for hytta og fram til Rondvassbu på 1214 moh. Bandet mellom 1100 og 1200 moh måler 1,3 grader i snitt over fire og en halv kilometer. Rundt vika ved Lonin i sørenden av Rondvatnet holder du deg på land i stedet for å ta snarvegen over isen.",
      "Merk startpunktet: bomvegen til Spranget brøytes ikke, og parkeringa er offisielt åpen fra midten av juni. I mars–mai er Mysusæter siste brøytepunkt — det er 4,5 kilometer og hundre høydemeter lenger ned, og de kommer i tillegg til alt som står her.",
      "Bak hytta stiger det bratt mot nordøst opp til stidelet på 1440 moh. Her deler turen lag med Rondslottet: den ruta fortsetter nordover inn i Rondholet, mens Storronden tar av mot høyre og østover opp på vestryggen.",
      "Fra stidelet til toppen er det 698 høydemeter på 2,85 kilometer langs linja, monotont stigende og uten gjenstigning. Den bratteste hundremeteren ligger mellom 1900 og 2000 moh og måler 20,7 grader i snitt; bratteste sammenhengende parti på linja er 25,7 grader. Ryggen er steinete, og ur blåser ofte bar — da bæres skiene den siste biten til varden på 2139 moh.",
    ],
    descent: [
      "Ned vestryggen til stidelet, ned bakken til Rondvassbu og deretter de seks kilometerne ut til Spranget. Nedkjøringa er sørvestvendt: peilinger mellom 225 og 255 grader holder 26 til 32 grader, og det er den sektoren ruta bruker.",
      "Vanligste feil: å slippe seg rett vest fra toppen fordi det er den vegen bilen står. Rett vest ser slakt ut fra varden — under 26 grader de første seks hundre metrene — og bryter så av i 46 til 57. Nordover er fella den samme: fire–fem hundre meter på under 20 grader, og så 48 til 64 ned i Rondholet. Øst og sørøst er brattest og nærmest, 56 til 67 grader like ved den slake ryggen du kom opp. Den andre feilen er å la seg dra nordover mot Rondholet fra toppen.",
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
      path: "M0,199 L26,200 L50,198 L76,196 L100,195 L123,191 L149,190 L171,189 L194,187 L221,188 L242,187 L263,186 L289,185 L313,184 L339,178 L362,173 L386,166 L410,155 L431,140 L452,121 L478,107 L497,91 L520,82 L543,66 L563,42 L581,28 L599,25 L600,18",
      startLabel: "1082 moh",
      endLabel: "2139 moh",
      distanceLabel: "10,3 km",
      caption: "1145 høydemeter og 10,26 km fra Spranget, der 698 av høydemetrene kommer på de siste 2,85 kilometerne opp vestryggen.",
    },
  },
  skala: {
    slug: "skala",
    intro:
      "Fra Tjugen i Loen til 1848 moh: 1818 høydemeter i én sammenhengende stigning, og en av landets lengste nedkjøringer. Turen krever kondisjon og sikt, ikke bratt teknikk.",
    ascent: [
      "Fra parkeringen på Tjugen ved Lodalsvegen, 34 moh, følger du traktorvegen som etter hvert blir til Kloumannstien og går oppover i Fosdalen. Plassen er avgiftsbelagt og betales med Vipps til Skåla Parkering — det er den samme plassen som brukes under Skåla Opp. De første 540 meterne går på veg; deretter tar stien over. Skogen slipper taket rundt 426 moh, ved Tyvasætra, og fra midten av mai må du regne med å bære skiene opp til Tjugensætra rundt 750 moh.",
      "Elva krysser du rundt 650 moh. Stien svinger nordover et stykke før den tar seg tilbake sørover — følg den; juvet nedenfor er ikke noe å skjære over. Så følger rundt 400 høydemeter jevn stigning opp mot Skålavatnet. Stien svinger seg opp gjennom hellinga, og ingen hundremeter på dette strekket holder mer enn 18°.",
      "Du passerer Skålavatnet på nordvestsida, 1141 moh, og fortsetter sørøstover inn i botnen. Derfra tar du opp til venstre mot den brede ryggen mot Sandsnibba. Den bratteste hundremeteren på hele linja ligger mellom 1500 og 1600 moh og holder 21,2° i snitt, med 20,2° i sjiktet under; det bratteste enkelttrinnet måler 26,9°.",
      "Skålabu og Skålatårnet står på 1835 moh, der stien formelt slutter. Toppunktet ligger 370 meter lenger øst, flatt platå hele vegen. Ved dårlig sikt: hold ryggen. Den er slak å gå, men den faller bratt til begge sider — 56° i snitt de første 200 metrene mot nordvest, 42° mot sør — og skavlen henger ut over nordvestkanten.",
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
      "1219 høgdemeter på 5,84 km frå Innvikdalen, opp ein rygg som held seg jamn frå skoggrensa til varden. Brattaste samanhengande parti måler 25,0 grader og ligg nede ved 520 moh; over 800 moh kjem linja aldri over 16 grader i noko hundremetersband.",
    ascent: [
      "Start ved grinda på Dragesetvegen innerst i Innvikdalen, 349 moh, inn dalen frå Innvik. Traktorvegen tek deg opp til Remestøylen på 596 moh; bandet frå 300 til 400 moh måler 7,1 grader og 400 til 500 moh 10,6.",
      "Frå setra held du vest-sørvestover opp den tydelege ryggen, med Innvikdalen på høgre hand. Brattaste hundremeteren på turen ligg her, 600 til 700 moh med 17,3 grader i snitt, og brattaste samanhengande parti måler 25,0 grader mellom 520 og 541 moh.",
      "Forbi Hestehytta på 864 moh sluttar skogen — Kartverket fører terrenget som skog til 805 moh — og resten er open rygg. Frå Hestehytta til toppen stig linja 864 til 1567 moh over 3,3 kilometer, om lag tolv grader i snitt.",
      "Ryggen er jamn heile vegen opp: 13,6 grader frå 900 til 1000 moh, 15,4 frå 1000 til 1100 og 15,9 frå 1100 til 1200. Over 1400 moh flatar han ut mot varden på 1567 — bandet frå 1400 til 1500 moh måler 8,3 grader over 675 meter grunn.",
    ],
    descent: [
      "Ned same ryggen, vestover mot Remestøylen og Dragesetvegen — oppstigninga går austover, og Remestøylen ligg på peiling 289 frå toppen. Ryggen er brei og oversiktleg, og fallretninga er vest.",
      "Vanlegaste feil: å velje ei anna linje ned enn den du gjekk opp. Fjellet har fleire skredutsette nedkøyringsalternativ til sidene av ryggen, og det er lett å følgje spor som ikkje endar der du parkerte. Følg oppstigningsryggen, ikkje andre sine spor.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ein lang, brei rygg utan tekniske parti. Brattaste hundremeteren, 600 til 700 moh, måler 17,3 grader, og brattaste samanhengande parti 25,0 grader mellom 520 og 541 moh — begge nede i skogsdelen. Frå Hestehytta og opp held linja om lag tolv grader i snitt.",
      },
      {
        title: "Terrenget rundt",
        body: "Sidene av ryggen er skredutsette, og no veit vi kva for nokre: sør og sørvest, ned mot Innvikdalen. Frå ryggpunktet på 1096 moh måler sørsida 26,9 grader i snitt over 400 meter med eit 45,5-graders vindauge, og sørvest 28,8 med 49,3. Frå 1275 moh gir sørvest 32,9 grader i snitt og eit 67,5-graders vindauge 320 til 380 meter ut. Nord og vest frå den same ryggen held 10 til 15 grader. Sjølve toppen er slak i alle åtte retningar — 2,5 til 11,3 grader i snitt — så vurderinga ligg ikkje der du står med varden, men i kva du vel når du er komen eit stykke ned.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,197 L46,192 L64,185 L80,183 L100,178 L116,170 L144,164 L162,158 L182,149 L204,139 L227,132 L246,125 L268,121 L287,114 L310,107 L325,101 L343,94 L362,86 L381,79 L398,71 L421,63 L449,56 L467,49 L491,42 L514,37 L537,33 L565,26 L582,22 L600,18",
      startLabel: "349 moh",
      endLabel: "1567 moh",
      distanceLabel: "5,8 km",
      caption: "1219 høgdemeter og 5,84 km frå Dragesetvegen i Innvikdalen, over Remestøylen og Hestehytta, med skoggrensa på 805 moh.",
    },
  },
  lodalskapa: {
    slug: "lodalskapa",
    intro:
      "1526 høgdemeter på 10,62 km til det einaste 2000-metersfjellet i Nordfjord. To tredjedelar av turen er slak innmarsj; resten er bre med djupe sprekker, og brattaste samanhengande parti måler 27,3 grader mellom 2000 og 2023 moh.",
    ascent: [
      "Start på parkeringa ved Bødalssætra, 584 moh, snaut tretti kilometer frå Stryn forbi Loen og langs Lovatnet. Vegen inn Bødalen er stengd om vinteren og opnar i mai eller juni — dette er ein vårskitur, og sesongen står deretter.",
      "Gå austover langs nordaustsida av dalen mot osen av Sætrevatnet, 606 moh, og følg elva vidare innover. Innmarsjen er lang og flat: bandet frå 500 til 600 moh måler 0,6 grader over 1628 meter grunn, 600 til 700 moh 4,0 grader over 1413, og 1200 til 1300 moh 2,2 grader over 2633 meter.",
      "Ved Kåpevatnet, 1211 moh, svingar ruta sørover og opp Brattebakkane inn på Bohrsbreen. Herifrå er det bre: Kartverket registrerer breterreng på linja frå 1825 moh, og Fri Flyt skildrar svært djupe sprekker på Bohrsbreen. Bandet frå 1300 til 1400 moh måler 20,5 grader, det brattaste hundremeteren på turen.",
      "Vidare opp mot ryggen og ein travers under Veslekåpa før det siste stykket til toppen på 2082 moh. Bandet frå 1900 til 2000 moh måler 17,1 grader, og brattaste samanhengande parti 27,3 grader mellom 2000 og 2023. Breutstyr, stegjern og isøks høyrer med.",
    ],
    descent: [
      "Ned same vegen: under Veslekåpa, ned breen og Brattebakkane til Kåpevatnet, og deretter den lange, flate innmarsjen ut Bødalen. Fallretninga er vest.",
      "Vanlegaste feil: å behandle Bohrsbreen som ein snøbakke. Sprekkene er djupe, tau og breutstyr er ikkje valfritt, og på veg ned går ein fortare over dei same brøane som ein gjekk sakte over på veg opp.",
      "Den andre er å undervurdere innmarsjen. Fem av ti kilometer ligg under 5 grader; det er lite motstand på ski, men det er òg to timar heimatt etter at dagens høgdemeter er brukte.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Lang, flat innmarsj og ein bratt topp: brattaste hundremeteren, 1300 til 1400 moh, måler 20,5 grader, og brattaste samanhengande parti 27,3 grader mellom 2000 og 2023 moh. Brattebakkane opp mot breen er skredterreng.",
      },
      {
        title: "Terrenget rundt",
        body: "Svært djupe sprekker på Bohrsbreen — det er den faren som skil denne turen frå ein vanleg vårtur, og han er ikkje avhengig av skredvarselet. Stegjern og isøks når snøen er hard, og tau over breen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottakar, søkjestang og spade, og breutstyr — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,200 L46,199 L72,198 L97,198 L121,197 L143,197 L166,190 L186,177 L206,169 L227,162 L247,149 L269,135 L288,126 L313,124 L336,124 L364,124 L394,124 L420,124 L440,112 L454,101 L471,89 L486,80 L509,70 L532,59 L547,49 L565,40 L582,28 L600,18",
      startLabel: "584 moh",
      endLabel: "2082 moh",
      distanceLabel: "10,6 km",
      caption: "1526 høgdemeter og 10,62 km frå Bødalssætra over Sætrevatnet, Kåpevatnet og Bohrsbreen, med det brattaste på dei siste hundre høgdemetrane.",
    },
  },
  snonipa: {
    slug: "snonipa",
    intro:
      "1494 høgdemeter på 8,45 km frå Stardalen til det høgste fjellet i Sunnfjord, opp Haugadalen og midt i brefallet på Haugabreen. Brattaste samanhengande parti måler 27,6 grader, og turen går på bre frå 887 moh og opp.",
    ascent: [
      "Start ved campingplassen i Stardalen, 351 moh — frå Skei følgjer du E39 nordover og tek av på Klakegg. Fri Flyt viser til utkøyringsplassar langs grusvegen eller parkering nede ved fylkesvegen.",
      "Følg skogsvegen innover Haugadalen til Haugastøylen på 659 moh. Det flate partiet langs skogsvegen er særleg utsett for naturleg utløyste skred når snødekket blir varma opp — det er ikkje der ein ventar det, og det er verdt å hugse.",
      "Vidare opp dalen til brefallet. Kartverket registrerer breterreng på linja alt frå 887 moh, og Haugabreen sjølv ligg på 1100 moh. Ein går opp midt i fallet; store sprekker er den styrande faren her.",
      "Oppe på platået traverserer ein nordvestover og kjem opp på toppen frå nordvest. Stigninga er jamn: 15,6 grader frå 1200 til 1300 moh, 19,4 frå 1300 til 1400 — brattaste hundremeteren — og 17,8 frå 1700 til 1800, med varden på 1827 moh. Kring 1687 moh er føret ofte vindavblåst og hardt.",
    ],
    descent: [
      "Ned same vegen: over platået, ned brefallet og ut Haugadalen. Fallretninga er søraust.",
      "Vanlegaste feil: å velje Veitebergsdalen ned fordi ho ser kortare ut på kartet. Det er ei anna rute frå ein annan dal — Fri Flyt fører henne som eigen tur over Sollirinden — og ho endar ikkje der bilen står.",
      "Den andre er timinga på det flate partiet nedst: det er der naturleg utløyste skred kjem når sola har stått på, og det er den delen av turen ein går sist.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn stigning over bre. Brattaste hundremeteren, 1300 til 1400 moh, måler 19,4 grader og brattaste samanhengande parti 27,6 grader; breterrenget er registrert frå 887 moh. Store sprekker på Haugabreen er den styrande faren, ikkje hellinga.",
      },
      {
        title: "Terrenget rundt",
        body: "Det flate partiet langs skogsvegen mot Haugastøylen er særleg utsett for naturleg utløyste skred ved oppvarming av snødekket. Kring 1687 moh er det ofte vindavblåst og hardt, og det avgjer meir om dagen enn brattleiken gjer.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottakar, søkjestang og spade, og breutstyr — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,192 L39,183 L58,181 L80,181 L103,179 L122,176 L138,167 L160,163 L183,163 L205,160 L231,158 L256,149 L275,138 L298,135 L318,132 L342,121 L365,112 L387,105 L413,100 L435,98 L461,90 L478,82 L496,71 L512,64 L537,50 L560,40 L580,30 L600,18",
      startLabel: "351 moh",
      endLabel: "1827 moh",
      distanceLabel: "8,4 km",
      caption: "1494 høgdemeter og 8,45 km frå Stardalen over Haugastøylen og Haugabreen, med breterreng frå 887 moh og skoggrensa på 649.",
    },
  },
  glittertinden: {
    slug: "glittertinden",
    intro:
      "Norges nest høyeste, og en overraskende slak tur: bratteste sammenhengende parti på hele linja måler 18,5 grader. Det som koster er avstanden — 13,32 km én vei, hvorav sju bare er innmarsj i Veodalen — og at øvre del ligger på Glitterbrean.",
    ascent: [
      "Start på grusparkeringa ved nasjonalparkgrensa i Veodalen, 1297 moh. Herfra følger du den bilfrie vegen sørvestover langs Veo i sju kilometer inn til Glitterheim på 1385 moh. Sju kilometer for 88 høydemeter: bandet mellom 1300 og 1400 moh måler 0,9 grader i snitt over nesten sju kilometer, og det er det flateste partiet på noen av turene i denne appen. Regn med at innmarsjen tar en drøy time hver vei før fjellet begynner.",
      "Bak hytta legger ruta seg nordvestover opp nordsida av Steinbudalen. Ikke følg dalbunnen vestover over Steinbuvatna: utgangen av dalen mot breen har steg på 37 til 41 grader, mens nordflanken — der den merkede stien går — holder 9 til 13 grader i snitt, med enkeltsteg opp mot 19. Den bratteste hundremeteren på ruta ligger mellom 1600 og 1700 moh og holder 13,2 grader i snitt.",
      "Fra rundt 2010 moh går ruta inn på ryggen øst for Glitterbrean, opp forbi 2222 moh og 2357 moh på øvre del av breen, og til slutt vestover opp den siste kneika til toppen på 2451 moh. Ut.no beskriver ruta som jevn stigning hele veien i terreng under 30 grader, med valget mellom sommerstien øst for breen og selve breen. Terrengmodellen er enig: bratteste sammenhengende parti på linja er 18,5 grader.",
      "Sesongen er satt av vegen, ikke av snøen. Bomvegen fra Randsverk inn til Veodalen brøytes ikke og åpner sammen med Glitterheim midt i juni. Vil du gå den klassiske vårturen i mars–mai, må du enten gå de vel 24 kilometerne inn på ski eller forhåndsbestille beltebil hos hytta — linja er den samme, men de første sju kilometerne er da en del av en mye lengre innmarsj.",
    ],
    descent: [
      "Ned samme vei: østryggen og breen ned til rundt 2010 moh, nordsida av Steinbudalen ned til Glitterheim, og så de sju kilometerne ut Veodalen. De siste sju er ikke nedkjøring. I juni og juli er Veodalen bar, så skiene bæres de sju kilometerne ut — regn med halvannen time til fots, eller tre kvarter om du har sykkel stående ved bommen.",
      "Vanligste feil: å dra for langt nord på det brede topplatået i dårlig sikt. Toppen har bare én slak side. Nord, nordøst, vest og nordvest faller 52 til 70 grader ned mot Grjotbrean og Glitterholet, og sør og sørvest — peilinger mellom 165 og 230 grader — faller 42 til 64 ned i Steinbudalen. Bare sektoren mellom 105 og 160 grader er slak, og det er den vegen du kom. Ta ut kursen på toppen. Kanten er dessuten skavlet: ut.no melder dokumenterte overhengende skavler mot nordvest, så kanten du ser er ikke kanten som bærer.",
      "Glitterbrean er en bre. Sprekker og snøbroer er reelle, og i juni og juli — den eneste perioden denne ruta er beskrevet for — er snøbroene på sitt tynneste. Turen hører hjemme i tau og bresele hele sesongen. Det er en annen vurdering enn skredvurderingen, og den gjøres før du går ut på breen, ikke når du står midt på den.",
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
  steindalsnosi: {
    slug: "steindalsnosi",
    intro:
      "764 høydemeter fra Sognefjellsvegen til 2025 moh, alt over skoggrensa. Normalvegen går opp vestsida; nordsida av det samme fjellet er en helt annen tur, og skillet mellom dem går på topplatået.",
    ascent: [
      "Fra den brøytede plassen ved Gjuvvatnet på fv55 Sognefjellsvegen, 1274 moh, går du østover inn i dalsøkket. Vegen hit er vinterstengt over høyfjellet og brøytes opp ved påsketider — i 2026 åpnet den 1. april — og de første ukene etter åpning er strekninga nattestengt fra 20 til 08. Det er vegen, ikke snøen, som setter sesongen. Hold sørsida av vatnet — der er det fast grunn hele veien, og du slipper å miste de tretti meterne ned på isen. Er vegkanten full, ligger alternativet ved Galgebergstjørnane et par kilometer nordover; korridoren fungerer derfra også.",
      "Dalsøkket tar deg rett østover forbi et lite vatn på 1428 moh. Her er det åpent terreng fra første skritt til toppen — ingen skog, ingen skoggrense å ta hensyn til. Ved rundt 1500 moh trekker du nordøstover ut av søkket og opp mot en svak, vestvendt ryggformasjon. Den ryggen er hele resten av turen.",
      "Ryggen stiger jevnt. Hundremetersbåndet mellom 1700 og 1800 moh ligger på 19,1 grader i snitt, og det bratteste steget på veg opp er 30,3 grader over tretti meter mellom 1828 og 1848 moh. Hold ryggkammen gjennom det partiet. Trekker du nordover her, faller terrenget 100 til 180 meter bort under deg, og du kommer inn under nordsida.",
      "Toppen er et platå på 2025 moh. Varden ligger helt på kanten av nordsida — gå fram til den, ikke forbi den. Skavlene bygger seg ut mot nord og øst. Rett under varden stuper nordsida: de første 120 høydemetrene faller på nær 60 grader. Så slakner den til en hylle rundt 1840 moh, før den setter utfor igjen — 42 til 45 grader fra 1620 til 1500 moh, med bre og klipper under det.",
    ],
    descent: [
      "Ned går du samme veg, vestover. Den store skålforma under ryggen er det morsomste på turen: 25 til 30 grader jevnt, korte partier over 30, og det bratteste steget på linja — 30,3 grader — rett under ryggen. Derfra er det slakt ned dalsøkket til Gjuvvatnet.",
      "Vanligste feil: å la seg dra sørover fra toppen, ned Steindalen. Det er fin skikjøring, men det er en annen tur — 1025 høydemeter ned til Helgedalen, og bilen din står på Sognefjellsvegen. Hold vestryggen til du ser vatnet.",
      "Vestsida er hard om morgenen i april og mai, og sola trenger noen timer på den. Går du tidlig, tar du med stegjern; det bratte partiet ved 1840 moh er ikke morsomt på blank skare, verken opp eller ned.",
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
      "Derfra går ruta rett vestover opp Grotådalen, mellom Bukkehøe i nord og austryggen til Besshø i sør, i jevn stigning til rundt 1745 moh. Den bratteste hundremeteren på hele turen ligger mellom 1900 og 2000 moh og måler 18,0 grader i snitt; bratteste sammenhengende parti på linja er 28,1 grader. Så sørvestover opp på ryggen ved Brue på 2047 moh, og vest-sørvest langs den slake ryggen de siste 210 høydemeterne. Ikke gå opp Besshøbrean til Brue, slik hyttas egen beskrivelse kan leses: overgangen fra breen til ryggen stiger fra 2004 til 2050 moh på 26 meter grunn, altså rundt 60 grader.",
      "Toppen er et stort platå på 2257 moh. Peiling 75 grader fra varden — austryggen du kom opp — holder 17,8 grader. Peilinger på 60 og 90 grader kjennes like slake i fem hundre til åtte hundre meter — og bryter så av i 55 til 60 grader. Det er hele turens problem: femten grader feil peiling merkes ikke under skia før det er for seint.",
    ],
    descent: [
      "Ned samme vei: aust-nordaust ned til Brue — peiling 78 grader fra varden, ned Grotådalen til Grotåosen, og så de tre og en halv flate kilometerne østover langs Bessvatnet. Regn med å stake hele vatnet — det er ikke nedkjøring, det er transport, og det tar tid du må ha igjen av dagen.",
      "Vanligste feil: å forlate topplatået i feil retning. Nord-, nordvest- og vestsida faller 55 til 70 grader rett ned mot Russvatnet og Gjende, og fra et rundt platå i dårlig sikt ser alle retninger like slake ut de første stegene. Ta ut kompasskurs på varden, ikke to hundre meter ut. Ryggen inn mot Brue er også smalere enn den kjennes: nordsida bryter av i 50 til 60 grader ned mot Besshøbrean innen to hundre meter fra sporet, mens sørsida er slak og bred de første tre hundre.",
      "Sørrennene brukes som nedkjøring av dem som kjenner fjellet. De holder 35 til 40 grader med korte parti på 45, og er steinete og isete i dårlige forhold. Friflyts sørøstrenne ned mot Memurubu er en gjennomgangstur — den ender ikke ved bilen din.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigningen er lite bratt terreng: bratteste sammenhengende parti på linja måler 28,1 grader, og den bratteste hundremeteren, 1900 til 2000 moh, holder 18,0 grader i snitt. Austryggen selv ligger på 18 til 20 grader. Det som teller på ruta er ryggen inn mot Brue, der nordsida bryter av i 50 til 60 grader ned mot Besshøbrean innen to hundre meter fra sporet, mens sørsida er slak og bred — et spor som trekker nordover mot le er et annet spor enn det du planla.",
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
      "Sikt deg inn mot 1688-høgda øst for Fannaråknosi og rund den. Ikke hold høyde over breen: går du for høyt før du svinger opp, blir passasjen opp på austryggen vesentlig brattere. Den bratteste hundremeteren ligger mellom 1800 og 1900 moh og holder 19,8° i snitt over 317 meter grunn, og det bratteste enkelttrinnet på linja måler 27,1° mellom 1859 og 1882 moh.",
      "Rundt knausen kommer du inn på søraustryggen og sommerstien fra Keisarpasset. Følg den over Fannaråknosi og videre langs austryggen til Fanaråken. Det henger store skavler på nordsida hele vegen, og nordsida faller 55–58° i de øverste 90 metrene under kammen — hold deg på sørsida, også når sikten er god.",
    ],
    descent: [
      "Ned følger du samme linja — øst- og nordøstvendt, jevnt og slakt, med pålitelig vårsnø langt ut i sesongen. Den andre dokumenterte ruta, fra Turtagrø gjennom Helgedalen, gir 1196 høydemeter og er en annen dag.",
      "Vanligste feil: å holde høyde over breen på vei ned, slik at du havner for høyt vest for 1688-høgda og må ned der det er brattest. Slipp deg ned rundt knausen slik du kom opp. Og husk at siste strekket ikke er gratis: fra demninga på 1343 moh stiger det tilbake til Korpen på 1397, og vestsida bølger — 113 høydemeter til sammen på vegen inn, og de samme igjen på vegen ut.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalvegen er slak — bratteste hundremeter holder 19,8° i snitt mellom 1800 og 1900 moh, over 317 meter grunn, og det bratteste enkelttrinnet på linja måler 27,1° mellom 1859 og 1882 moh. På Fannaråkbreen er sprekkene faren like mye som snøen. Nede ved starten er faren en annen og enklere å beskrive: isen på et magasin som tappes ned, og ruta er lagt på land utenom den.",
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
  kvamshesten: {
    slug: "kvamshesten",
    intro:
      "830 høgdemeter på 5,34 km frå Rytnavegen, det meste av det slakt — og så ei skål på slutten som måler om lag 36 grader i snitt frå Grunnevatnet til toppen. Isøks og stegjern står i utstyrslista av den grunn.",
    ascent: [
      "Start ved vegenden på Rytnavegen, 404 moh — den private vegen som er skilta mot parkering til Storehesten, som er det lokale namnet på det same fjellet. Fri Flyt oppgjev to vertikalar for dette fjellet, og dei er to ulike startar: 960 høgdemeter frå Rytnane nede i dalen, og 810 herifrå.",
      "Følg skogsvegen oppover mot Kårstadstølen på 495 moh, og hald deretter aust mot Rabbane på 512. Ruta går austover før ho snur nordover — det ser ut som ein omveg på kartet, og det er den skildra vegen.",
      "Frå Rabbane går det nordover mot skaret aust for Skaravatnet på 715 moh. Partiet mellom 700 og 800 moh er det slakaste på turen, 3,8 grader over 1439 meter grunn. Ruta går vestover langs nordsida av vatnet og forbi Grunnevatnet på 785 moh — og linja ligg på isen undervegs: om lag 240 meter på Skaravatnet, 58 meter på eit unamngjeve tjern på 726 moh i skaret, og om lag 260 meter på Grunnevatnet, opptil om lag 40 meter frå land. Alle tre er naturlege fjellvatn, ikkje magasin, men det er vatn under snøen og skal vurderast som det.",
      "Vest for Grunnevatnet tek du litt høgde og følgjer så den markerte skålformasjonen sørover heilt opp. Bandet frå 1000 til 1100 moh måler 11,1 grader i snitt over 537 meter grunn; brattaste hundremeteren er 13,8 frå 900 til 1000 moh, og brattaste samanhengande parti 22,7 grader mellom 639 og 669 moh. Frå Grunnevatnet til varden på 1209 moh er det 424 høgdemeter på 581 meter grunn — om lag 36 grader i snitt over heile skåla.",
    ],
    descent: [
      "Ned same skåla og attende over Grunnevatnet, Skaravatnet og Rabbane. Fallretninga er nord, og skåla er både oppstigninga og nedkøyringa.",
      "Vanlegaste feil: å gå opp skåla på hardt føre utan isøks og stegjern. Fri Flyt fører begge delar som naudsynt utstyr på denne turen, og grunnen står i tala — 36 grader i snitt over dei siste 424 høgdemetrane er ikkje ein bakke ein sklir kontrollert nedover.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak til 900 moh og bratt over. Skålformasjonen sør for Grunnevatnet er skredterreng: bandet frå 1000 til 1100 moh måler 11,1 grader i snitt, brattaste samanhengande parti 22,7 grader mellom 639 og 669 moh, og heile strekket frå Grunnevatnet til toppen ligg på om lag 36 grader.",
      },
      {
        title: "Terrenget rundt",
        body: "Skåla er den eine store vurderinga på turen, og ho har ingen omveg: ruta går opp gjennom henne. Hardt føre gjer siste stigninga til ei klyving heller enn ein skitur, og det er då isøks og stegjern går frå å vere utstyr i sekken til å vere det du står på. Toppen sjølv har ei side det ikkje går an å halde seg på: sør og søraust måler 48,9 og 47,1 grader i snitt over 500 meter, med 60-metersvindauge på 74,0 og 74,3. Aust og vest, 15,1 og 13,8 grader, er dei slake, og skåla kjem opp frå nord.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,190 L45,183 L71,177 L101,175 L121,166 L141,157 L162,153 L184,147 L202,134 L227,130 L247,127 L268,126 L288,126 L308,118 L333,114 L358,113 L385,104 L399,96 L421,89 L441,80 L462,69 L485,54 L510,43 L530,44 L546,36 L566,31 L589,20 L600,18",
      startLabel: "404 moh",
      endLabel: "1209 moh",
      distanceLabel: "5,3 km",
      caption: "830 høgdemeter og 5,34 km frå Rytnavegen over Kårstadstølen, Skaravatnet og Grunnevatnet, med den bratte skåla mellom 1000 og 1100 moh.",
    },
  },
  rasletinden: {
    slug: "rasletinden",
    intro:
      "En 2104-meter for de fleste: 778 høydemeter fra Valdresflye, og bratteste sammenhengende parti på linja måler 21,7 grader. Det som gjør turen krevende er været og vidda — den blir vanskelig i dårlig sikt, ikke i dårlig føre.",
    ascent: [
      "Start på parkeringa på østsida av fv51 der Valdresflya vandrerhjem sto før brannen i 2015, 1391 moh. Vegen er det som setter sesongen: fv51 er brøytet vinteren gjennom bare til Bygdin, og strekninga nordover forbi vandrerheimen åpner normalt rundt 1. april.",
      "Herfra går ruta vestover ut på vidda, sør for Fisketjerne. De første 1,2 kilometerne er helt flate og faller faktisk ti høydemeter — du kommer til å stake dem, og du kommer til å stake dem hjem igjen. Vidda er samtidig helt åpen og gir ingen ly. Undervegs går linja over is to ganger: 135 meter på 1379 moh, opptil 50 meter fra land, og 225 meter på 1377 moh, opptil 100 meter fra land. Ingen av de to har navn i registeret — Fisketjerne ligger 824 meter unna — og begge er naturlige tjern, ikke regulerte. På ei flate der resten er fast mark er de verdt å vite om.",
      "Så stiger det jevnt mot den første kneika på rundt 1530 moh og videre opp på ryggen ved 1736 moh. Ryggen følges vestover, sør for Øystre Rasletinden (2011 moh), til rundt 1890 moh. Merk at sporet her ikke ligger på en rygg i skredfaglig forstand: mellom 1810 og 1890 moh går det under sørsida av Øystre Rasletinden, som stiger 130 høydemeter rett over deg med et parti på 47 grader. Ikke gå over Øystre Rasletinden: aust- og sørøstsida av den toppen måler 42 til 50 grader, og linjer inn dit fra aust får steg på 51 til 63.",
      "Til slutt den korte kneika opp mot toppplatået. I fallinja måler den 31 til 35 grader mellom 1910 og 1960 moh; over 1960 slakner den til 16 til 20 inn mot platået. Det er ett av to steder på ruta med et samlet bratt heng over deg — det andre kommer lenger nede, på ryggen under Øystre Rasletinden. Linja som er tegnet legger seg på skrå over den og holder 21,7 grader som bratteste sammenhengende parti; den bratteste hundremeteren, 1900 til 2000 moh, måler 15,1 grader i snitt. Over kneika er det ut på platået og de siste hundre meterne til 2104 moh.",
    ],
    descent: [
      "Ned samme vei: kneika, ryggen østover sør for Øystre Rasletinden, ned til 1736 og videre ned første kneik til vidda. Under første kneik, fra 1531 moh, er det slutt på kjøringa — de siste to kilometerne over vidda er flate, og de ti høydemeterne du fikk gratis på vei ut skal betales tilbake.",
      "Vanligste feil: å ta ut kursen nordover fra toppplatået fordi det ser slakt ut. Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare aust og nordaust er slake — aust måler 26 grader, nordaust 32 — og det er den vegen du kom.",
      "Waypointet på 1890 moh ligger på det terrengmodellen klassifiserer som snø og is. Det er en permanent snøfonn, ikke en sprukken bre: Leirungsbrean og Kalvehøgdbreene ligger fire kilometer lenger vest og sør.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nesten hele ruta er slak: første kneik måler 22 til 24 grader, ryggen 23, og bratteste sammenhengende parti på linja 21,7 grader. To steder har et samlet bratt heng over seg. Kneika under toppplatået måler 31 til 35 grader i fallinja mellom 1910 og 1960 moh. Og ryggtraversen mellom 1810 og 1890 moh går under sørsida av Øystre Rasletinden: 130 høydemeter rett over sporet, 34 grader i snitt og 47 på det brattaste. Begge steder legger sporet seg på skrå, men snøen over deg bryr seg ikke om sporet — og et sørvendt heng i april er nettopp det du vurderer tidlig på dagen.",
      },
      {
        title: "Terrenget utenfor",
        body: "Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare aust (26 grader) og nordaust (32) er slake, og de er ruta. Øystre Rasletinden, 2011 moh, ser ut som en naturlig del av ryggen, men aust- og sørøstsida av den måler 42 til 50 grader — skiruta går sør for toppen, ikke over den.",
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
      "341 høydemeter og 2,73 km fra Bånsetra opp på en fjellrygg med stup mot sør. Ruta selv er slak — brattaste hundremetersband er 14,0 grader fra 900 til 1000 moh, og brattaste steg 22,1 grader mellom 986 og 1000 — men sørøstsida under eggen måler 25,5 grader i snitt med 45,2 i vinduet 30 til 90 meter ut.",
    ascent: [
      "Start på Bånsetra, 913 moh — setervollen der Bånsetervegen ender. Ut.no oppgir 914 for samme punkt. Vegen inn er skiltet fra fylkesveg 319 sør for brua over Lågen i Fåvang, og det er et setergrend- og hyttefelt med eget vegnett: Bånsetervegen, Svarttjønnvegen, Tutlidalsvegen og Årnesfeltet er alle kartlagt.",
      "Rett vestover og opp lia er det korteste bratte partiet på turen: 14,0 grader fra 900 til 1000 moh over 348 meter grunn, med et steg på 22,1 grader mellom 986 og 1000. Skogen slipper taket allerede på 954 moh og terrenget er åpent fra 961 — dette er en tur som er over tregrensa etter tre hundre meter.",
      "Videre skrår linja sørvestover: 12,5 grader fra 1000 til 1100 moh over 461 meter grunn, forbi 1110 moh, og inn på selve ryggen på 1195. Der er det slutt på stigninga. Bandet fra 1100 til 1200 moh måler 3,1 grader over 1807 meter grunn — det er eggen, og den er nesten vannrett.",
      "Vestover langs kanten til høyeste punkt, 1196,1 moh. Ut.no fører 1202 for samme sted, og det er det største avviket mellom kort og terrengmodell i denne runden; kortet fører målinga. Utsikten går til Jotunheimen i vest og Rondane i nord, og ned på fem seterområder i sør.",
    ],
    descent: [
      "Ned samme vegen, nordøstover. Den sida måler 6,3 grader i snitt over 400 meter med et bratteste 60-metersvindu på 10,6 — det er den slake halvsirkelen ruta ligger i, og vest måler 3,9 med 12,8.",
      "Sørsida er en annen sak, og den er grunnen til at denne turen har en gradering i det hele tatt. Ut.no skriver om «bratte stup mot sør» og «fjellrygger som går stupbratt et par hundre meter ned», og sveipet setter tall på det: sørøst 25,5 grader i snitt med 45,2 i vinduet 30 til 90 meter ut, sør 23,0 med 39,8 i 40 til 100, øst 21,0 med 38,0 i 30 til 90, og sørvest 18,7 med 42,5 lenger ute, 180 til 240.",
      "Om sommeren går det tydelig sti langs kanten av fjellhamrene, og ut.no skriver at man går trygt der. Under snø er den kanten en skavlkant, og den er ikke til å se i flatt lys. Hold nordsida av ryggen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "341 høydemeter der brattaste band er 14,0 grader og brattaste steg 22,1. Ruta gir tilbake 58 høydemeter på 2,73 km, det meste av det på selve ryggen, som måler 3,1 grader over 1807 meter grunn. Oppstigninga i seg selv er ikke et skredproblem.",
      },
      {
        title: "Eggen",
        body: "Hele graderinga ligger i kanten. Sørøst måler 45,2 grader i brattaste 60-metersvindu bare 30 til 90 meter fra toppen, sør 39,8 og øst 38,0. Det er ikke terreng du kommer tilbake fra hvis du går ut på skavlen, og på en rygg som ellers måler 2,7 grader er det ingenting som varsler deg om at kanten kommer.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Oppland sør på varsom.no. Oppland sør er en B-region: den varsles bare når faregraden ventes å bli 4 eller 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Begge ut.no-beskrivelsene er sommerbeskrivelser og fører sesong juni til september; sesongen på kortet er lest ut av at Bånsetra er et hyttefelt med brøytt vegnett. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,184 L59,163 L76,145 L89,131 L105,123 L128,107 L156,91 L178,80 L198,78 L217,70 L237,69 L265,73 L277,66 L287,55 L317,44 L336,34 L366,29 L390,18 L415,21 L435,24 L456,31 L475,39 L495,37 L519,45 L534,40 L564,33 L584,28 L600,21",
      startLabel: "913 moh",
      endLabel: "1196 moh",
      distanceLabel: "2,7 km",
      caption: "341 høydemeter og 2,73 km fra Bånsetra opp lia til 1110 moh og inn på fjellryggen på 1195, med skogen som slipper taket på 955 moh.",
    },
  },
  molden: {
    slug: "molden",
    intro:
      "623 høgdemeter på 3,31 km frå Mollandsmarki opp sørvestryggen, med Lustrafjorden under seg heile vegen. Brattaste hundremeteren måler 16,3 grader, og brattaste samanhengande parti 23,3 — det ligg nede i skogen, ikkje på ryggen.",
    ascent: [
      "Start på den kartfeste parkeringa på Mollandsmarki, 501 moh, over Marifjøra i Luster. Dei fyrste hundre metrane grunn er flate — bandet frå 400 til 500 moh måler 0,5 grader — før vegen mot Garden tek til å stiga.",
      "Følg vegen og deretter sommarstien opp gjennom skogen. Stigninga er jamn og utan overraskingar: 10,0 grader frå 500 til 600 moh, 11,6 frå 600 til 700 og 14,3 frå 700 til 800. Brattaste samanhengande parti på heile turen ligg her nede, 23,3 grader over tretti meter mellom 704 og 718 moh.",
      "Skogen held til 851 moh. Over tregrensa, ved om lag 816 moh, tek du inn på sørvestryggen, og han fører heile vegen opp. Brattaste hundremeteren er 900 til 1000 moh med 16,3 grader i snitt — det er dei bratte punkta rutebeskrivinga varslar om, og dei er korte.",
      "Frå 1000 moh slakkar det av att: 7,9 grader frå 1000 til 1100 moh og 6,5 over det, med varden på 1120 moh. Austtoppen på same høgd ligg like ved for den som vil ha utsikta frå begge.",
    ],
    descent: [
      "Ned same ryggen, sørvestover. Ryggen er brei, og på stabile dagar kan ein òg køyre rett vestover frå toppen.",
      "Vanlegaste feil: å velje den vestlege linja utan å tenkje på kvar ho endar. Går du vestover i staden for å følgje ryggen ned, hamnar du i den tette skogen under 851 moh, og det er ein lang og lite triveleg måte å komme attende til bilen på.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Brei sørvestrygg med jamn stigning. Brattaste hundremeteren, 900 til 1000 moh, måler 16,3 grader, og brattaste samanhengande parti 23,3 grader mellom 704 og 718 moh — nede i skogen, der terrenget er kort og oversiktleg.",
      },
      {
        title: "Terrenget rundt",
        body: "Sørvestryggen har eit par brattare punkt den siste biten opp, og dei er verdt å sjå på når snøen er ustabil. Vestsida under toppen er den andre vurderinga: ho blir køyrd på stabile dagar, og ho endar i tett skog. Den tredje er fjordsida, og ho er ikkje ei vurdering men ei grense: aust og søraust frå varden måler 46,1 og 46,4 grader i snitt over 500 meter, med 60-metersvindauge på 62,4 og 63,6. Utsikta ned mot Lustrafjorden kjem frå ein kant, ikkje frå ei helling.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Sogn på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L29,199 L54,192 L82,185 L106,175 L123,170 L140,163 L172,151 L196,143 L221,135 L237,130 L266,119 L286,110 L303,102 L322,101 L343,97 L360,90 L382,79 L400,71 L425,60 L441,51 L457,46 L482,40 L507,36 L531,31 L558,28 L582,20 L600,18",
      startLabel: "501 moh",
      endLabel: "1120 moh",
      distanceLabel: "3,3 km",
      caption: "623 høgdemeter og 3,01 km frå Mollandsmarki, med skoggrensa på 851 moh og brattaste hundremeteren mellom 900 og 1000 moh.",
    },
  },
  synshorn: {
    slug: "synshorn",
    intro:
      "Kort tur rett opp fra Bygdin, med 360 graders utsikt fra toppen — Jotunheimen i nord, Bygdin i vest, Bitihorn i sør. 428 høydemeter på knapt to kilometer gjør dette til turen du tar når værvinduet er kort.",
    ascent: [
      "Start på parkeringen ved Fagerstrand på østsida av Bygdin, like ved Bygdinstøga og Bygdin Høifjellshotell. Plassen er privat og avgiftsbelagt, og betales med Vipps til nummeret på skiltet. Satsen er oppgitt både som 60 og 80 kroner i ulike kilder, så les skiltet framfor å regne med et beløp. Fv51 er vinterstengt nordover, så Bygdin er den brøytede enden av vegen og plassen er tilgjengelig hele våren. Du er over skoggrensa fra første skritt, og stigningen begynner med en gang.",
      "Legg sporet vest- og nordvestover inn mot den nedre delen av Fagerdalen framfor å gå rett mot toppen. Toppen ser nær ut herfra, men rett nord for parkeringen ligger et trinn som holder rundt 40 grader mellom 1090 og 1220 moh, og østsida av Synshorn faller enda lenger: 31 grader i snitt de første fire hundre metrene ned mot Fv51, med et parti på 57 grader. Ingen av dem er oppstigning. Hold deg vest for fjellet til du er over 1400 moh.",
      "Flanken du går på ligger stort sett mellom 10 og 20 grader, i åpent terreng uten en trestamme. De siste hundre høydemeterne, fra 1400 til 1475, ligger i snitt på 16,6 grader, og bratteste enkeltparti på hele ruta måler 22,1 grader. Toppen tas fra sørvest, over den slake platåkanten.",
      "Ved dårlig sikt: ikke gå øst eller nordøst fra toppen. Der slutter fjellet med en gang — østsida måler 31 grader i snitt, nordøstsida 33, og begge har partier over 50 grader innen to hundre meter fra toppryggen. Sørover er fella den motsatte: platået fortsetter nesten flatt og drar deg utover.",
    ],
    descent: [
      "Ned samme flanke som opp. Sørvestflanken er bred og jevn — 16 grader i snitt, 23 på det bratteste — og med vårsnø går den rent hele vegen ned mot Fagerdalen.",
      "Vanligste feil: å slippe seg rett sørover fra toppen fordi det er der parkeringen ligger. Sørsida frister nettopp fordi den er slak: 4,5 grader i snitt de første fire hundre metrene, ikke over 23 grader noe sted. Så tar den slutt. Rundt 1425 moh, en snau halvkilometer sør for toppen, faller sørveggen 223 høydemeter på 120 meter — 117 av dem på 56 meter der den er brattest, mellom 1330 og 1210 moh. Hold sørvestflanken i stedet, ned til rundt 1120 moh, og følg sporet øst- og sørøstover tilbake til Fagerstrand.",
      "Ryggen nordvestover mot Heimre Fagerdalshøe (1510) er en forlengelse av turen, ikke en annen veg ned: 1,6 kilometer over et skar på rundt 1360 moh. Nedkjøringen derfra ned i Fagerdalen er brattere enn fra Synshorn og hører til dem som kjenner terrenget.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigningen går i åpent terreng hele vegen, uten skog å bremse noe. Bratteste enkeltparti på linja måler 22,1 grader, og de øverste hundre høydemeterne ligger i snitt på 16,6 grader. Selve sporet er altså slakt; det du må vurdere er hva som henger over deg når du kommer inn mot toppen fra sørvest.",
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
      "780 høgdemeter og 2,64 km — Togga er ein av dei kortaste vegane til ein topp i Sogndalsdalen, og det er nett difor fjellet er så mykje brukt: null anmarsj frå toppturparkeringa på Brandhaugane ved rv5, skogskøyring og ope terreng i same tur, og seks nedfartar hos Fri Flyt. Kortet ber grad 3, og grunnen står i kjeldas eiga åtvaring: på søraustryggen — normalvegen — har skiløparar løyst ut skred under opptur i ustabile forhold. Lina målar 27,5 grader som brattaste samanhengande parti; henget ho går i, gjev Fri Flyt 33–35.",
    ascent: [
      "Start på toppturparkeringa på Brandhaugane, 427 moh ved rv5 nokre kilometer før skisenteret — registeret har Brandhaugane som haug i skogen rett ved, og Fri Flyts 785 høgdemeter impliserer nøyaktig denne starten. Gå mot søraustryggen og følg han oppover gjennom skogen; lina passerer 542 moh i skogen, som etter Kartverkets klassar sluttar på 765.",
      "Over skoggrensa kjem det brattare partiet — 744 moh på veg inn i det, og det brattaste hundremetersbeltet på turen, 22,5 grader i snitt mellom 800 og 900 moh. Dette er staden kjeldas skredåtvaring gjeld: her har skiløparar løyst ut skred på veg OPP. Sikksakk med vit, og snu her om snøen seier frå.",
      "Ved Orraleiken flatar terrenget ut, slik kjelda seier — registerpunktet les 1042 moh i ope terreng. Pusterom, og så den siste stigninga: lina passerer 1155 og varden står på 1204 moh, målt mot registerets 1203 og Fri Flyts publiserte 1205.",
      "Registeret fortener ei setning her òg: utan styring klatrar toppsøket forbi namnet og vidare vestover, for ryggen stig utan skar mot høgare fjell — 1236 berre 280 meter vest, 1354 knapt kilometeren ute. Togga er det namngjevne punktet, ikkje det høgaste på ryggen, og kortet ber det namngjevne.",
    ],
    descent: [
      "Normalvegen ned er same veg som opp: siste stigninga, Orraleiken, og det brattare partiet ned i skogen. Det brattare partiet er same henget som på veg opp — det som kan løysast ut under opptur, kan løysast ut under nedkøyring, og linevalet frå oppturen er fasiten.",
      "Fri Flyt skildrar fem nedfartar — søraustryggen, to på sørsida og to austover, med utgangar mot Laugadalen, Gunvordalen og Vatnasete. Ingen av dei er denne lina, og målingane frå varden seier kva dei krev: dei to austvariantane måler 50,5 og 51,1 grader i brattaste 60 m-vindauge og sørsida 41,9. Nordsida, som ingen av dei går ned, fell 44,8 grader 210–270 m ut. Det er ekte alpine alternativ på eit fjell med kort veg heim — vel etter snøen, ikkje etter lista.",
      "Vestover skal ingen: ryggen stig vidare mot høgare fjell, og i skodde er det den vegen ein hamnar om ein berre «følgjer ryggen». Kompasskurs søraust frå varden.",
    ],
    avalanche: [
      {
        title: "Normalvegen",
        body: "Fri Flyts eiga åtvaring er uvanleg konkret, og han skal sitera nesten ordrett: på søraustryggen er det eit brattare parti der skiløparar har løyst ut snøskred under opptur når det er ustabile snøforhold. Det partiet ligg mellom skoggrensa på 765 og Orraleiken på 1042, med beltet 800–900 moh som det brattaste målte. Kjeldas brattaste punkt er 33–35 grader; lina sikksakkar slakare, men henget er det same.",
      },
      {
        title: "Variantane",
        body: "Fri Flyt legg sin eigen NB på austflanken: «Skiløparar har fleire gongar løyst ut flakskred i denne austlege flanken», og nedfarten ved Høgde 1140 «krev stabile snøforhold». Fem nedfartar gjev fem måtar å auka innsatsen på: nord-, nordaust- og austsida måler 44,8 til 51,1 grader i sine brattaste 60 m-vindauge, sørsida 41,9. Kort veg til bilen gjer det freistande å ta ein variant til — det er nett då snøvurderinga frå i stad skal gjelda enno.",
      },
      {
        title: "Ryggen som stig",
        body: "Vest for varden stig ryggen vidare utan skar — snittet vestover er negativt fordi terrenget går opp. I godt vêr er det openbert; i skodde er det felle: den som følgjer ryggen vidare, går inn i brattare og villare fjell, ikkje ned. Søraust er heimvegen, alltid.",
      },
      {
        title: "Før du går",
        body: "Togga ligg i varslingsregionen Indre Sogn, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt publiserer ingen sesongmånader for Togga; Sogndal-sida hans set sesongen frå november til mai. Kortets desember–mars er appens eiga innsnevring til midtvintermånadene, og guiden seier det. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L21,200 L50,200 L80,194 L103,188 L121,181 L138,177 L152,173 L172,165 L183,161 L203,154 L223,146 L238,141 L264,130 L285,125 L305,117 L326,108 L342,101 L356,95 L377,87 L391,82 L416,73 L428,68 L449,58 L464,52 L488,47 L506,42 L520,37 L532,33 L551,28 L571,23 L590,20 L600,18",
      startLabel: "427 moh",
      endLabel: "1204 moh",
      distanceLabel: "2,6 km",
      caption: "780 høgdemeter og 2,64 km frå Brandhaugane — søraustryggen med det skredutsette brattpartiet, Orraleiken, og varden på 1204.",
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
      "Vanligste feil: å slippe seg østover fra toppen mot vegen du ser under deg. Der ligger østveggen over Fv51 — 43 grader i snitt, og 65 til 74 rett under toppryggen — og sørøstover skaret mot Nørdre Båtskardet, 41 grader og oppbrutt. Hold nordvestskuldra til terrenget flater ut, og ta så platået tilbake til parkeringen.",
      "Sørruta fra Båtskaret finnes — 454 høydemeter på halvannen kilometer — men den er dokumentert som fottur, ikke som skioppstigning. Den er ikke vegen ned herfra.",
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
  ulvsjoberget: {
    slug: "ulvsjoberget",
    intro:
      "295 høydemeter og 2,17 km fra Vestby til toppen på 854 moh — den høyeste toppen i Trysil med en publisert rutebeskrivelse som ikke går i alpinanlegget. Brattaste hundremetersband er 12,3 grader fra 500 til 600 moh over 193 meter grunn, og brattaste steg 18,6 grader mellom 582 og 597. Nesten hele stigninga ligger i skog.",
    ascent: [
      "Start i Vestby, 559 moh, rett ved Misjonshuset. Ut.no oppgir 558 for samme punkt. Vegen inn er fylkesveg 2160 fra Trysil sentrum — ut.no skriver fv 563, som er det gamle nummeret — 17 km og tjue minutters kjøring, og det er skiltet til parkering.",
      "Det bratteste ligger med en gang: 12,3 grader fra 500 til 600 moh over 193 meter grunn, med turens eneste virkelige steg på 18,6 grader mellom 582 og 597 moh. Over det slakner det til 8,0 grader fra 600 til 700 og 8,4 fra 700 til 800, og linja passerer 676 og 801 moh. Alt dette går i skogsterreng.",
      "Skogen slipper ikke taket før på 826 moh, og terrenget er åpent fra 832. Ut.no beskriver overgangen slik: «På toppen åpner terrenget seg, og du har vid utsikt i alle himmelretninger.» De siste 20 høydemeterne måler 5,4 grader fra 800 til 900 moh over 555 meter grunn, og toppen ligger på 854,2 moh mot ut.nos oppgitte 851.",
    ],
    descent: [
      "Ned samme vegen, sørøstover. Den sida måler 5,0 grader i snitt over 400 meter med et bratteste 60-metersvindu på 9,3 — det slakeste av alle åtte retningene fra toppen, og det er den ruta går i.",
      "Det ene stedet fjellet er bratt ligger 400 meter unna og på motsatt kant. Sørvest måler 23,9 grader i snitt med et 49,2-graders vindu 330 til 390 meter ut, og vest 13,0 med 24,5 i 340 til 400. Det er Stygghammeren, og ut.no er tydelig: «Fra Ulvsjøberget er det gammel skilting ned til Stygghammeren, hvor du får flott utsikt over Ulvsjøen. Hit går du på eget ansvar, og vi anbefaler ikke at du tar med små barn hit, da det er en bratt, usikret fjellhylle.»",
      "Under snø er den hylla ikke til å se. Korridoren går ikke dit, og skiltinga som gjør det, er gammel.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "295 høydemeter der brattaste band er 12,4 grader og brattaste steg 17,5. Ruta gir ikke tilbake en eneste høydemeter på 2,14 km. Ut.no fører turen som tough, og det er ikke terrenget som gjør den det — det er at hele stigninga går i skog uten sti å se under snøen.",
      },
      {
        title: "Stygghammeren",
        body: "Sørvest for toppen måler flanken 49,2 grader i brattaste 60-metersvindu, 330 til 390 meter ut, med 23,9 grader i snitt hele veien. Det er den usikrede hylla ut.no advarer mot, og den ligger utenfor ruta — men den ligger nær nok til at en linje valgt på slump fra toppen kan finne den, og under snø er kanten ikke synlig.",
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
      "268 høydemeter og 4,22 km fra Nordseter til Nevelhytta på 1090 moh. Ingenting på denne turen er bratt: brattaste hundremetersband er 4,3 grader fra 1000 til 1100 moh over 1167 meter grunn, og brattaste sammenhengende steg 17,0 grader mellom 966 og 988. Det bratteste 60-metersvinduet i hele flankesveipet er 19,3 grader.",
    ascent: [
      "Start på parkeringa på Nordseter, 828 moh — avgiftsplass tagget for ski i OSM, 135 meter fra Nordseter Fjellstue. Ut.no: «På oppkjørte løyper nordover fra parkeringsplassen på Nordseter mot foten av toppen.» Nordsetervegen fra Lillehammer er brøytet hele vinteren, og bussen går dit.",
      "Første to kilometerne er flate — bandet fra 800 til 900 moh måler 2,5 grader over 1655 meter grunn — nordover forbi 897 moh. Så kommer Nevelvatnet, og her er det verdt å vite hvor løypa går: linja runder sørenden på 905 moh og går opp på vestsida på 915. Ut.nos egen løypelinje gjør det samme, og terrengmodellen gir Skog på begge punktene. Går du rett over vatnet, går du på is.",
      "Videre nordvestover over Nevelåsen, 992 moh, der terrenget åpner seg. Bandet fra 900 til 1000 moh måler 4,2 grader over 1395 meter grunn; det brattaste steget ligger her, 17,0 grader mellom 966 og 988 moh. Skogen slipper taket på 966 moh og terrenget er åpent fra 972.",
      "Siste kilometeren måler 4,3 grader fra 1000 til 1100 moh over 1167 meter grunn. Ut.no gir to linjevalg inn mot toppen: «Ta av rett opp mot toppen, som inntegnet eller gå løypa på toppens østside og følg ryggen vestover mot toppen.» På 1090 moh står Nevelhytta — Røde Kors' åpne bu med ovn og plass til seks–åtte, sjelden låst, restaurert i 2021 — og en siktskive som navngir toppene fra Jotunheimen til Rondane.",
    ],
    descent: [
      "Ned samme vegen, østover. Den sida måler 3,8 grader i snitt over 400 meter med et bratteste 60-metersvindu på 8,5, og vest 3,4 med 8,2. Det er ikke en nedkjøring, det er en retur — og ut.no sier det selv: «det er ikke lenger opp enn at man kan trappe seg fram selv med smale langrennski».",
      "Det bratteste fjellet har å by på ligger mot nord: 11,1 grader i snitt med et 19,3-graders vindu 160 til 220 meter ut. Ingen retning fra toppen har et 60-metersvindu over 20 grader. Faren her er derfor ikke helningen, det er avstanden og likheten: fem kilometer over et løypenett som ser likt ut overalt, og en topp som er det eneste holdepunktet når lyset flater ut. Ut.no peker på at løypa opp til selve toppen ikke er kjørt opp — den siste kilometeren er du alene om sporet.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "268 høydemeter der brattaste band er 4,8 grader og brattaste steg 12,6. Ruta gir tilbake 6 høydemeter på 4,07 km. Det finnes ikke et skredproblem på denne linja, og flankesveipet finner ikke noe rundt toppen heller — 19,3 grader er det brattaste 60-metersvinduet i noen retning.",
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
      "474 høgdemeter og 2,50 km frå rv 52 ved Eldrevatn til varden på 1592 moh. Brattaste hundremetersbandet er det øvste — 17,7 grader frå 1500 til 1600 moh over 285 meter grunn — og brattaste samanhengande steg er 22,5 grader mellom 1527 og 1546. Ruta ligg over skoggrensa heile vegen.",
    ascent: [
      "Start på den opparbeidde plassen ved fylkesgrensa ved Eldrevatn, 1122 moh, rett ved rv 52 over Hemsedalsfjellet. Fri Flyt seier det så kort som det går an: «Parkér på parkeringsplassen like før Eldrevann og sett kursen mot sørøst. Herfra gir ruta seg selv til toppen av Slettind.»",
      "Den første kilometeren er flat — bandet frå 1100 til 1200 moh måler 4,1 grader over 1132 meter grunn — og så tek flanken til. Frå 1200 til 1300 moh måler han 13,7 grader over 405 meter grunn, frå 1300 til 1400 16,6 over 360, og linja passerer 1325 moh der stigninga er etablert. Ut.no skildrar det same: «terrenget er jevnt og passe bratt mellom 20-25 grader».",
      "Vidare opp held det fram med å bli litt brattare for kvart band: 16,1 grader frå 1400 til 1500 moh over 315 meter grunn, og 17,7 frå 1500 til 1600 over 285 — det brattaste på turen. Brattaste enkeltsteget er 22,5 grader mellom 1527 og 1546 moh. Toppen måler 1592,0 moh på terrengmodellen, som er nøyaktig det Fri Flyt publiserer; ut.no fører 1589.",
    ],
    descent: [
      "Ned nordvestflanken, same vegen. Fri Flyt: «Ta utgangspunkt i ruta opp og legg sporet i den brede fjellsida på vei ned.» Flanken måler 18,0 grader i snitt over 400 meter med eit 27,2-graders vindauge 110 til 170 meter ut, og han er brei nok til at du kan legge sporet der du vil i han.",
      "Faremomentet Fri Flyt fører opp peikar til høgre: «Skredterreng nord for toppen, så ikke dra for langt til skikjørers høyre i starten av nedkjøringen.» Nord måler 13,8 grader i snitt med eit 25,7-graders vindauge 100 til 160 meter ut, og 11,0 grader i snitt når sveipet går ut til ein kilometer — altså reelt skredterreng, akkurat som åtvaringa seier.",
      "Det brattaste på fjellet ligg likevel til den andre handa. Vest måler 23,9 grader i snitt ut til ein kilometer, med eit 52,5-graders vindauge 660 til 720 meter ut, og sørvest 23,6 med 49,5 i vindauget 360 til 420. Begge fell mot Mørkedalen, langt frå linja ned mot bilen — men dei er der, og dei er det du kjem inn i om du held for langt sør på det breie platået i dårleg sikt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "474 høgdemeter der brattaste band er 18,6 grader og brattaste steg 20,6. Fri Flyt fører KAST 1 – enkelt med bratteste punkt under 30 grader, ut.no fører easy, og ut.no legg til: «Ingen spesiell skredfare hvis man følger de slake partiene, men det er noen helninger som er over 30 grader.» Linja gir tilbake 4 høgdemeter på 2,48 km.",
      },
      {
        title: "Terrenget utanfor",
        body: "Nord for toppen er det Fri Flyt åtvarar mot, og målinga gir dei rett: 25,7 grader i brattaste 60-metersvindauge 100 til 160 meter ut. Vest og sørvest er brattare igjen — 52,5 og 49,5 grader i vindauge nokre hundre meter ute — og fell mot Mørkedalen. Aust og nordaust er slake: 5,6 og 8,5 grader i snitt.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er ein A-region og blir varsla kvar dag i sesongen. Sjekk òg at rv 52 over Hemsedalsfjellet er open — det er ein fjellovergang som kan stengje eller gå i kolonne i uvêr, og på denne turen er det vêret som avlyser dagen, ikkje terrenget. Ta med sendar/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L17,200 L34,200 L56,200 L77,199 L99,197 L121,194 L131,192 L153,188 L175,185 L185,184 L207,180 L229,177 L250,173 L272,168 L294,161 L315,154 L326,150 L337,146 L359,135 L369,129 L391,119 L402,115 L423,106 L434,101 L456,88 L463,84 L477,77 L488,72 L499,67 L521,57 L532,53 L553,43 L564,36 L574,30 L586,24 L597,19 L600,18",
      startLabel: "1122 moh",
      endLabel: "1592 moh",
      distanceLabel: "2,5 km",
      caption: "474 høgdemeter og 2,48 km frå Eldrevatn opp nordvestflanken via 1325 moh, i ope terreng frå første steg.",
    },
  },
  kyrkjebonosi: {
    slug: "kyrkjebonosi",
    intro:
      "998 høgdemeter og 4,77 km frå grustaket ved Kyrkjebøen til det høgste punktet på 1670 moh, med fortoppen på 1608 og eit skar på 1589 imellom. Brattaste hundremetersbandet er 20,9 grader frå 1400 til 1500 moh, og brattaste steg 24,1 grader mellom 1422 og 1442. Nordaustsida er noko heilt anna: 33,0 grader i snitt, med 48,0 i vindauget 0 til 60 meter ut.",
    ascent: [
      "Start i grustaket ovanfor garden Kyrkjebøen, 722 moh. Ut.no forklarer vegen dit: i sentrum følgjer du vegen til venstre for Skogstad Hotell, og etter 1,4 km står skiltet mot Kyrkjebønnøse på høgre side — vidare bak låven og opp til grustaket. Fri Flyt kallar staden sandtaket og oppgir parkering ved informasjonsskiltet.",
      "Frå grustaket går traktorvegen og sommarstien nordover gjennom skogen. Løypa er merkt og svingar bratt til venstre etter om lag ein kilometer, opp Gravarbakkane, der linja passerer 1010 moh. Bandtabellen for denne delen er jamn og moderat: 9,7 grader frå 700 til 800 moh over 455 meter grunn, 14,6 frå 800 til 900 over 396, 13,8 frå 900 til 1000 over 414, og 14,0 frå 1000 til 1100 over 393.",
      "Skogen slepper taket på 1107 moh og terrenget er ope frå 1121. Rett over skoggrensa ligg ein liten topp på 1299 moh, og Fri Flyt er tydeleg på kva du gjer med han: «gå på vestsiden av den lille toppen rett etter tregrensen. Derfra svinger du igjen østover og følger ryggen opp til toppen.» Linja går 1288 moh på vestsida av han. Her ligg òg det brattaste steget på turen, 24,1 grader mellom 1422 og 1442 moh.",
      "Vidare opp ryggen stig det jamt til det brattaste bandet, 20,9 grader frå 1400 til 1500 moh over 272 meter grunn, og linja passerer 1465 moh i det. Fortoppen kjem på 1608 moh — den ut.no fører som «den første på 1610 moh». Frå han fell ryggen 20 meter ned i skaret på 1589, og så er det flatt: bandet frå 1500 til 1600 moh måler 4,4 grader over 1306 meter grunn og 1600 til 1700 måler 6,5 over 535. «Den siste delen av ryggen mot toppen er lang og flat», skriv Fri Flyt, og det er 400 meter nordover til varden på 1670,5 moh — 1671 etter begge kjeldene.",
    ],
    descent: [
      "Standardnedkøyringa går ikkje tilbake same vegen frå toppen. Fri Flyt: «Den vanligste ruta går fra toppen på omlag 1600 moh og vestover ned den store hvite flanken. Skal du ned til bilen, tar du av sørover rett før tregrensen og kommer inn på den samme ruta som oppstigningen.» Vestflanken måler 11,3 grader i snitt over 400 meter og sørvest 12,3 — det er den store, opne flanken, og det er difor kortet fører V.",
      "Den alternative renna er ei anna sak, og sveipet forklarer kvifor. Aust frå toppen måler 28,9 grader i snitt med 46,0 i vindauget 10 til 70 meter ut, og nordaust 33,0 med 48,0 allereie frå kanten. Det er renna Fri Flyt gir «500 høydemeter med bratt og fin skikjøring» — og det er same kant som skavlen står på. Kjem du for langt ned mot elva i Trøimsbotn, seier Fri Flyt at det er «bratt og ulendt terreng for å komme tilbake til stien som leder ned til sandtaket».",
      "Nedst går det gjennom skogen. Fri Flyt skildrar den delen presist: open bjørkeskog først, tettare etter kvart, og då er det stien ned til parkeringsplassen som er det beste alternativet.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "1002 høgdemeter der brattaste band er 20,6 grader og brattaste steg 26,8. Linja gir tilbake 54 høgdemeter, og 20 av dei er skaret mellom fortoppen på 1608 og toppryggen på 1589. Sjølve oppstigningsruta er ikkje bratt; det som gjer turen til ein treiar er lengda opp frå bygda og at toppryggen er skavla.",
      },
      {
        title: "Skavlen og renna",
        body: "Fri Flyt fører to faremoment og dei ligg på same kant: «Toppskavl og skredfare på den alternative nedkjøringen.» Sveipet frå toppen måler nordaust til 33,0 grader i snitt med eit 48,0-graders vindauge 0 til 60 meter ut, og aust 28,9 med 46,0 i 10 til 70. Det vil seie at kanten fell bratt av med ein gong — det er der skavlen byggjer seg, og det er der renna mot Trøimsbotn startar. Nord måler 27,5 med 34,2 lenger ute. Vest og sørvest, der standardnedkøyringa går, måler 11,3 og 12,3.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er ein A-region og blir varsla kvar dag i sesongen. Ingen av kjeldene oppgir ein sesong for denne turen; kortet fører feb–mai etter naboturane på same fjellside. Ta med sendar/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,196 L49,189 L69,179 L91,172 L114,164 L142,150 L162,145 L187,137 L216,124 L244,114 L266,103 L284,95 L297,88 L308,82 L334,69 L352,58 L370,49 L391,40 L414,32 L442,35 L465,37 L493,33 L513,30 L544,34 L572,28 L600,18",
      startLabel: "722 moh",
      endLabel: "1670 moh",
      distanceLabel: "4,8 km",
      caption: "1002 høgdemeter og 4,62 km frå grustaket ved Kyrkjebøen over Gravarbakkane på 1010 moh og fortoppen på 1608, med skogen som slepper taket på 1107 moh.",
    },
  },
  nibbi: {
    slug: "nibbi",
    intro:
      "803 høgdemeter og 2,93 km frå Lykkjastølen til varden på 1740 moh — nesten alt av det på under tre kilometer. Brattaste hundremetersbandet er 21,4 grader frå 1200 til 1300 moh over 224 meter grunn, og brattaste samanhengande steg 24,2 grader mellom 1249 og 1269. Austsida av toppen er ei anna sak: 27,6 grader i snitt, med 32,5 i brattaste vindauget.",
    ascent: [
      "Start ved Lykkjastølen, 939 moh. Ut.no oppgir 941 for same punktet, og bomavgifta dekkjer parkeringa — betaling i postkassa ved Ulsåkstølen Fjellstue. Frå bilen ser du fossen eit stykke opp i lia, og både Fri Flyt og ut.no seier det same om han: hald vestsida. Fossen sjølv er ikkje kartlagd nokon stad; bekken han kjem i er Nordrestølbekken, som er den einaste namngitte bekken linja går forbi, så namnet er ei slutning frå bekken og ikkje frå fossen. Vegpunktet i korridoren ligg 60 meter vest for bekken, på 1075 moh.",
      "Opp langs fossen stig det jamt: bandet frå 900 til 1000 moh måler 12,9 grader over 311 meter grunn, 1000 til 1100 måler 13,6 over 405, og 1100 til 1200 måler 18,6 over 315. Det brattaste steget på heile linja ligg her, 24,2 grader mellom 1249 og 1269 moh. Skogen slepper taket på 1054 moh og terrenget er ope frå 1066.",
      "Vidare følgjer du dalen — «det faller seg naturlig å følge dalen oppover», skriv ut.no, og Fri Flyt kallar det den naturlege renneformasjonen du går i eller til høgre for. Bandet frå 1300 til 1400 moh måler 20,8 grader over 271 meter grunn — nest brattast på turen, etter bandet under, og linja passerer 1364 moh midt i det. Over det slaknar det til 18,3 og 15,4 grader.",
      "Dei siste 300 metrane går ikkje rett fram. Ut.no sin eigen linje kjem opp vest for toppen, på 1708 moh, og snur austover langs toppryggen — «så får man toppen i front/til høyre av traséen». Bandet frå 1700 til 1800 moh måler 5,4 grader over 412 meter grunn, som er det flate toppartiet. Varden står på 1741 etter kjeldene og 1740,3 etter terrengmodellen, og kortet fører målinga.",
    ],
    descent: [
      "Fri Flyt er kort: «Den enkleste nedkjøringen følger den samme ruta ned som oppstigningen.» Det er sørflanken, og han måler 20,7 grader i snitt over 400 meter med eit 25,8-graders vindauge 190 til 250 meter ut — same tal som bandtabellen gir oppstigninga.",
      "Ut.no seier at det finst brattare og meir krevjande nedkøyringar for dei erfarne, og sveipet seier kvar dei ligg. Aust måler 27,6 grader i snitt med 32,5 i vindauget 90 til 150 meter ut, og søraust 22,8 med 30,0 lenger ute, 240 til 300. Vest og nordvest er det motsette — 6,9 og 10,6 grader i snitt — og nord berre 4,5. Vil du ha den bratte linja, ligg ho på austsida, og ut.no sitt vilkår står ved lag: «riktig utstyr og erfaring i fjellet, og at forholdene er bra».",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "803 høgdemeter der brattaste hundremetersbandet er 20,4 grader og brattaste steg 23,7. Fri Flyt fører turen som KAST 1 – enkelt med bratteste punkt under 30 grader, og målinga er samd. Linja gir tilbake 2 høgdemeter på 2,97 km, så det er ei rein stigning frå bilen til varden.",
      },
      {
        title: "Terrengfellene nedst",
        body: "Det einaste faremomentet Fri Flyt fører opp er «terrengfeller i den nedre delen av oppstigningen», og det er ikkje ein vinkel — det er forma. Renna og bekkedalen du følgjer opp frå 1075 moh samlar snø frå heile lia over, og har ingen veg ut til sidene. Bandet frå 1100 til 1200 moh måler 18,6 grader over 315 meter grunn: nok til at noko over deg kan losne, og med eit samletrau under.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er ein A-region og blir varsla kvar dag i sesongen, så her finst det ei vurdering å lese. Ta med sendar/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,195 L45,191 L73,180 L83,177 L108,171 L123,168 L147,162 L174,153 L193,146 L220,134 L239,125 L261,116 L282,107 L294,102 L307,97 L322,91 L340,83 L366,73 L386,65 L405,58 L426,53 L442,46 L460,39 L488,32 L516,27 L533,26 L543,25 L562,24 L589,20 L600,18",
      startLabel: "939 moh",
      endLabel: "1740 moh",
      distanceLabel: "2,9 km",
      caption: "803 høgdemeter og 2,97 km frå Lykkjastølen vest for fossen på 1075 moh og opp dalen til 1364, med skogen som slepper taket på 1054 moh.",
    },
  },
  raskarfjellet: {
    slug: "raskarfjellet",
    intro:
      "685 høgdemeter og 3,26 km frå Sildegjerdet ved rv 52 til varden på 1610 moh — ein av dei mest populære toppturfjella i Hemsedal, kjend berre som «1609». Brattaste hundremetersband er 20,1 grader mellom 1100 og 1200 moh og brattaste steg 24,0 mellom 1348 og 1368. Toppen sjølv er eit platå, og faren her er å finne fram.",
    ascent: [
      "Start ved den brøytte parkeringslomma ved stølsområdet Sildegjerdet, 938 moh. Fri Flyt: «Følg RV52 vestover fra Hemsedal sentrum i 19,5 km og parker i brøytet parkeringslomme på venstre side, 1,5 km etter brua på RV52.» Parkeringa er kartlagd og avgiftsfri. Rv 52 over Hemsedalsfjellet er vinteropen, men kan gå i kolonne eller stengje i uvêr.",
      "Dei første 885 metrane er flate — 4,1 grader — og linja kryssar elva 224 meter inne, der terrengmodellen svarer terrengklasse Elv på 926,1 moh. Så byrjar sjølve oppstigninga gjennom glissen bjørkeskog og inn i den vide dalen til Rupebekken, med korridorpunktet på 1051 moh. Kartverket fører siste skog på 1115 moh og ope terreng frå 1133. Her ligg det bratte på turen: 18,9 grader frå 1000 til 1100 moh og 20,1 frå 1100 til 1200, som er brattaste bandet.",
      "Over det flatar det av til 14,5 grader frå 1200 til 1300 og reiser seg ein gong til, 19,3 frå 1300 til 1400, med brattaste steget på 24,0 grader mellom 1348 og 1368 moh. Flata Fri Flyt lovar kjem på 1397 moh — hundre meter høgare enn dei skriv — og dei siste 212 høgdemetrane stig 14,3 og så 7,8 grader over 698 meter grunn til varden.",
    ],
    descent: [
      "Ned same vegen, nordaustover. Nordaust måler 10,5 grader i snitt ut til ein kilometer og aust 14,5, så det er slakt heile vegen tilbake. Fri Flyt oppgir at «du kan enten gå ned samme vei eller i rennene du så på vei opp», og rennene er skredterreng.",
      "Toppen er eit platå, og det er den viktigaste opplysninga om fjellet. Sørvest måler −0,2 grader i snitt ut til ein kilometer fordi bakken stig vidare, søraust 0,6 og sør 3,8. Frå varden ser fire retningar like flate ut, og tre av dei fører ingen stad du vil.",
      "Det bratte ligg langt frå ruta. Nordflanken har eit 60-metersvindu på 41,1 grader, men det er 940 til 1000 meter ut — nede der fjellet endeleg fell mot dalen. Nærmare varden er det brattaste ein finn 26,1 grader mot aust 60 til 120 meter ut og 27,0 mot sør 30 til 90 meter ut.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt fører turen som KAST 1 – Enkelt med bratteste punkt under 30 grader, og skriv likevel at «du beveger deg i skredterreng til du kommer opp på 1300 meter». Begge deler er sanne: brattaste bandet på linja er 20,1 grader og brattaste steg 24,0, men det er lia rundt som er brattare enn linja. Kortet fører turen som grad 2 av den grunnen.",
      },
      {
        title: "Sikt",
        body: "Fri Flyts andre åtvaring handlar ikkje om snø: «Dersom det er dårlig sikt, er det lite terrengformasjoner å orientere etter. Du trenger god sikt. Mye skredterreng rundt deg.» Flankesveipet seier det same med tal — søraust 0,6 grader i snitt, sørvest −0,2, nordvest 2,6 — eit platå utan hald for auget. Bekkedalen du kom opp er den einaste forma i terrenget som fører tilbake til bilen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no, ein A-region med varsel kvar dag i sesongen. Korkje Fri Flyt eller artikkelen deira oppgir sesong for dette fjellet; kortets feb–mai er det same vindauget dei tre andre Hemsedal-turane i appen ber, og det er ei slutning. Ta med sendar/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L25,199 L41,200 L66,197 L91,193 L116,190 L132,187 L157,182 L172,176 L190,168 L199,162 L215,154 L240,141 L251,134 L266,128 L281,120 L298,112 L323,103 L339,99 L353,93 L364,88 L381,78 L402,69 L415,66 L431,61 L447,54 L463,46 L480,41 L497,40 L513,36 L538,33 L555,31 L579,22 L596,19 L600,18",
      startLabel: "938 moh",
      endLabel: "1610 moh",
      distanceLabel: "3,3 km",
      caption: "685 høgdemeter og 3,26 km frå Sildegjerdet på 938 moh, inn bekkedalen på 1051 og over flata på 1397 til varden.",
    },
  },
  skogshorn: {
    slug: "skogshorn",
    intro:
      "836 høgdemeter på 3,93 km frå Trefta, jamnt og breitt heile vegen: brattaste samanhengande parti på linja måler 23,2 grader. Ei god fyrste toppturhelg i Hemsedal — så lenge du ikkje forvekslar normalruta med Skogshornrenna.",
    ascent: [
      "Start på den store parkeringa ved Hyndra bru nedanfor Trefta på Lykkjavegen, 893 moh. Plassen er avgiftsbelagt og betalast med SMS eller Vipps etter skiltinga på staden. Dei fyrste sju hundre metrane deler grunn med preparerte langrennsspor; ruta forlèt løypetraseen så snart ho byrjar å stiga. Kryss elva og gå opp lia på vestsida.",
      "Vidare nordvestover over det opne beltet på 1000 til 1100 moh. Bjørka held til rundt 996 moh, og over 1003 er alt ope. Både den kartlagde skitur-traseen og den merkte sommarstien går her, 200 til 400 meter nord for sjølve ryggkammen, på den breie nordaustskuldra — det er den linja som er teikna, og ho er slakare enn kammen.",
      "Ved om lag 1320 moh kjem du inn på foten av austryggen, og han blir følgd heile vegen til topps. Stigninga er jamn: bandet frå 1300 til 1600 moh ligg på 19 til 20 grader i snitt, og brattaste hundremeteren, 1500 til 1600 moh, måler 19,7 grader. Toppryggen sjølv er slak, og dei siste 130 høgdemetrane til 1729 moh går i 11 grader.",
      "Toppryggen er ofte avblåsen og hard. Det er ikkje eit skredproblem i seg sjølv, men det avgjer om dei siste hundre metrane er behagelege eller ikkje.",
    ],
    descent: [
      "Ned same vegen, austover ned ryggen og lia til Trefta. Fallretninga på nedkøyringa er aust — den fallvekta gjennomsnittsretninga måler 84 grader. Det er den breie nordaustvende fjellsida under austryggen som er nedkøyringa, og ho er også den sida som samlar flakskavl etter vestleg vind. Det er den eine vurderinga turen faktisk krev.",
      "Vanlegaste feil: å ta Skogshornrenna fordi ho ser ut som ei snarare linje ned. Renna har innsteg på flata på vesttoppen og fell sørover: målt derifrå held sørsida 39,5 grader i snitt med 56 grader på det brattaste, medan nordsida er 9,4. Ho er ei eiga ekspertlinje og skredutsett — ho er ikkje normalruta, og ho endar ikkje der bilen står. Fri Flyt nemner òg ei renne rett nord frå toppen ned til flata på 1100 moh med retur sørover til parkeringa; det er ein variant for dei som veit kva dei vel.",
      "Nede att kjem du inn på langrennssporet dei siste sju hundre metrane. Gå ved sida av det preparerte sporet, ikkje i det.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn, brei stigning utan tekniske parti eller trange passasjar: brattaste samanhengande parti på linja måler 23,2 grader, og brattaste hundremeteren, 1500 til 1600 moh, 19,7 grader i snitt. Den breie nordaustvende fjellsida under austryggen samlar flakskavl etter vestleg vind, og det er nettopp der ein køyrer ned — så vindhistoria dei siste dagane betyr meir enn hellinga på denne turen.",
      },
      {
        title: "Terrenget rundt",
        body: "Skogshornrenna har innsteg på flata på vesttoppen og fell sørover — 39,5 grader i snitt, 56 på det brattaste. Ho må ikkje forvekslast med normalruta, og heller ikkje med Fri Flyts nordvariant, som går ned den slake nordsida. Toppryggen er ofte avblåsen og hard. Elles er fjellet breitt og oversiktleg — dette er ein tur der feilen ein gjer er å velja feil linje ned, ikkje å bli overraska på veg opp.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,197 L41,194 L61,192 L82,188 L102,185 L123,181 L151,176 L178,170 L199,164 L219,160 L246,153 L267,148 L288,143 L309,137 L326,131 L350,121 L370,112 L391,102 L412,94 L429,85 L446,77 L460,70 L480,59 L501,48 L508,45 L535,33 L554,30 L577,24 L600,18",
      startLabel: "893 moh",
      endLabel: "1729 moh",
      distanceLabel: "3,9 km",
      caption: "836 høgdemeter og 3,77 km frå Trefta, med brattaste hundremeteren på 19,7 grader mellom 1500 og 1600 moh.",
    },
  },
  finnbufjellet: {
    slug: "finnbufjellet",
    intro:
      "620 høgdemeter og 4,37 km frå leirplassen på toppen av Halsabakkane — fjellet Fri Flyt-indeksen kallar staden der skisesongen på Voss vert opna og avslutta. Heile lina går i ope terreng over skoggrensa, og tala er snille: brattaste hundremetersbeltet måler 13,2 grader mellom 900 og 1000 moh, og det brattaste samanhengande partiet 23,3 grader. Namna treng ei setning: Fri Flyt kallar fjellet Finnbufjellet og oppgjev 1358 moh, men toppen sjølv heiter Finnbunuten i registeret, og terrengmodellen les 1357 — same mønsteret som Kirketaket, der guidebok og register ber kvar sitt namn.",
    ascent: [
      "Starten er flata der rv13 toppar hårnålssvingane i Halsabakkane og møter Sendo-elva — leirplassen ved Sendo, 766–779 moh på open mark. Kjeldene ser ut til å motseia kvarandre her, og terrenget avgjer: Fri Flyts faktaboks seier «Høydemeter: 770», Utemagasinet-versjonen av same skildringa seier 588 høgdemeter frå same parkeringa — og vegen passerer 770 moh nøyaktig der bakkane flatar ut. 770 er starthøgda, ikkje stigninga; den ruta lina samlar 620 høgdemeter.",
      "Kryss brua over Sendo-elva og hald sørover. Elva du kryssar renn austover langs flata og stuper så gjennom fossen ned i Kvassdalen, dalen rv13 kjem opp frå — dalbotnen der nede les 574 moh. Vest for deg skjer Finnbu-bekkene juv ned mot elva, med Finnbuene-stølen på vestbredda. Ryggen mellom juvet og Kvassdalen er ruta: det er han Fri Flyt peikar på som det sikraste alternativet, og han er den einaste ryggen aust for juvet.",
      "Ryggen er jamn og open: 793 moh ved foten, 871 midtvegs, 992 der han breier seg ut. Det brattaste hundremetersbeltet på turen ligg her — 13,2 grader i snitt mellom 900 og 1000 moh — og det er framleis slakt nok til å gå beint opp i dei fleste føre.",
      "På skuldra ved 1090 moh kjem alternativtilkomsten frå Myrkdalen skisenter opp — «etter en times gange», seier Fri Flyt, og møtepunktet er der ryggen flatar ut. Vidare går lina vestover på breie flanken: 1146, 1221 og 1302 moh på ryggen mot toppen, med brattaste samanhengande partiet på 23,3 grader undervegs.",
      "Varden står på 1357 moh. Terrengmodellen og registeret er samde om at dette er Finnbunuten — det høgaste punktet i massivet, mot publiserte 1358 — og at registeret sitt eige Finnbufjellet-punkt lenger nord les 1331 og ikkje er toppen. Nordover ligg ryggen nesten flat — 2,7 grader i snitt den fyrste kilometeren — og vest- og nordvestsida stuper: hald deg på austsida av varden når det blæs.",
    ],
    descent: [
      "Sikraste nedfarten er same veg som opp, seier kjelda, og målinga er samd: austflanken du kom opp held 6,9 grader i snitt frå varden mot nordaust, med 23,7 grader som brattaste 60 m-vindauge 650–710 m ut, målt 800 meter frå varden. Fin cruising heile ryggen ned til skuldra, og ryggen vidare ned mot Sendo.",
      "Fri Flyt nemner «en rekke nedkjøringsalternativer» utan å skildra dei, og målingane seier kvifor linevalet må vera vake utanfor ruta: vestsida fell 50,3 grader på det brattaste 440–500 m frå varden, og nordvestsida 56,7 grader 420–480 m ut — ned i Finnbugjuvet og juva vest for ryggen. Søraustsida måler 28,1 grader 690–750 m ut og austsida 28,4 grader 660–720 m ut, så òg dei slakare sektorane har heng i seg lenger ute.",
      "Frå skuldra att er det ryggen ned til brua og dei siste metrane over elva til leirplassen — 34 høgdemeter å gje tilbake har turen samla, så nedfarten er rein.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt set KAST 1 – Enkelt, og det gjeld ryggen, ikkje flankane ved sidan av: sjølve lina har 23,3 grader som brattaste samanhengande parti og 13,2 grader som brattaste hundremetersbelte, mellom 900 og 1000 moh. Ho går i ope, vindutsett terreng frå fyrste meter — her finst ingen skog å gå i le av.",
      },
      {
        title: "Nordeggen og juvet",
        body: "«Nordeggen har et par utsatte områder hvor ferdigheter og skredfare må vurderes», skriv Fri Flyt — nordeggen er ikkje denne ruta, og det må seiast, for han ligg rett ved: frå varden mot nord er snittet berre 2,7 grader dei fyrste 800 metrane, og det er nettopp det flate som gjer at ein hamnar der utan å velja det. Vest for ryggen samlar Finnbujuvet fokksnø — det er difor fjellet opnar og avsluttar sesongen — og vest- og nordvestsida under toppen fell 50,3 og 56,7 grader på det brattaste. I flatt lys er kanten mot juvet den eine tingen å halda styr på.",
      },
      {
        title: "Vegen",
        body: "Tilkomsten er sin eigen faktor: rv13 over Vikafjellet er eit vêrutsett høgfjellssamband, og leirplassen ligg på brøytekanten av det. Fri Flyt kallar tilkomsten lett — og det er ho når vegen er open. Sjekk vegmeldingane same dag, og rekn med at det som stengjer vegen òg er vêret som lastar Finnbujuvet.",
      },
      {
        title: "Før du går",
        body: "Finnbufjellet ligg i varslingsregionen Voss, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer sesongmånader for denne turen; kortets jan–apr er lånt frå dei andre Voss-turane i appen, og Fri Flyt-indeksen seier at fjellet opnar og avsluttar sesongen på Voss — han strekkjer seg altså i begge endar når snøen ligg. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L19,198 L44,192 L62,185 L92,172 L105,162 L124,147 L145,135 L164,128 L186,126 L204,122 L223,111 L247,101 L266,98 L289,100 L308,100 L328,96 L347,89 L359,80 L375,68 L396,65 L415,64 L439,62 L458,61 L483,59 L507,52 L526,38 L545,36 L576,30 L600,18",
      startLabel: "772 moh",
      endLabel: "1357 moh",
      distanceLabel: "4,4 km",
      caption: "620 høgdemeter og 4,37 km frå leirplassen ved Sendo — open rygg heile vegen, med 23,3 grader som brattaste samanhengande parti.",
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
      "742 høgdemeter på 4,67 km frå Ljosno: open bjørkeskog nedst, og eit vidt platå over Eggjane der bandet frå 1100 til 1200 moh måler 3,4 grader over 1784 meter grunn. Brattaste hundremeteren ligg mellom 1000 og 1100 moh og måler 18,4 grader.",
    ascent: [
      "Start ved vegenden på Ljosnavegen i Brandsetdalen, 510 moh, aust for Voss. Dei fyrste 726 metrane grunn er tilnærma flate — bandet frå 500 til 600 moh måler 7,1 grader i snitt.",
      "Følg bjørkeskogen oppover mot nordsida av Middagshovden. Skogen held til 857 moh, og over det er alt ope. Kartverket fører terrenget mellom 877 og 957 moh som skytefelt; sjekk skiltinga lokalt før du legg turen dit.",
      "Før toppen av hovden tek du av mot Eggjane. Brattaste hundremeteren på turen ligg her, 1000 til 1100 moh med 18,4 grader i snitt, og brattaste samanhengande parti måler 24,5 grader mellom 1079 og 1093 moh.",
      "Frå Eggjane på 1179 moh er det halvanna kilometer platå vestover til Storanosi, 1205 moh. Bandet frå 1100 til 1200 moh måler 3,4 grader over 1784 meter grunn — det er den delen av turen som gjer han lang heller enn bratt, og linja gjev til saman 40 høgdemeter attende undervegs.",
    ],
    descent: [
      "Ned same vegen, nordaustover over platået og ned gjennom bjørkeskogen til Ljosno. Fjellet er kjent for tørrsnø når austavinden har stått på i fleire dagar, og det er platået og den opne skogen som held på den snøen.",
      "Vanlegaste feil: å ta den austlege renna frå toppen fordi ho ser ut som ei kortare veg ned. Renna er 30 grader bratt og er ei eiga vurdering — ho er ikkje normalruta, og ho endar ikkje der bilen står.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak heile vegen: brattaste hundremeteren, 1000 til 1100 moh, måler 18,4 grader, og brattaste samanhengande parti 24,5 grader mellom 1079 og 1093 moh. Platået frå 1100 til 1200 moh ligg på 3,4 grader — det er orienteringa i dårleg sikt, ikkje hellinga, som er utfordringa der oppe.",
      },
      {
        title: "Terrenget rundt",
        body: "Den austlege renna frå Storanosi er 30 grader bratt og skredutsett; vurder henne for seg om du vil køyre der. Kartverket fører òg terrenget mellom 877 og 957 moh på oppstigninga som skytefelt.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L24,194 L47,188 L70,183 L99,174 L116,169 L134,163 L163,150 L184,137 L209,123 L238,110 L261,97 L286,84 L313,78 L336,70 L353,59 L371,45 L394,32 L417,26 L440,26 L463,30 L492,29 L515,23 L533,21 L556,22 L579,20 L600,18",
      startLabel: "510 moh",
      endLabel: "1205 moh",
      distanceLabel: "4,7 km",
      caption: "735 høgdemeter og 4,43 km frå Ljosno i Brandsetdalen, med skoggrensa på 857 moh og halvanna kilometer slakt platå frå Eggjane til varden.",
    },
  },
  lonahorgi: {
    slug: "lonahorgi",
    intro:
      "1307 høgdemeter frå 139 moh — ein av dei lengste samanhengande stigningane på Voss, og teknisk sett ein av dei enklaste. Brattaste samanhengande parti på linja måler 28,9 grader, og nordryggen dei siste 107 høgdemetrane er nesten flat.",
    ascent: [
      "Frå E16 ved Grotlandsbrua, om lag ein kilometer nord for enden av Lønavatnet, tek du av mot vest og køyrer Høylandsvegen opp til den nedlagde garden Høyland, 139 moh. Der tek skogsbilvegen over. Merk at brøyting heilt fram ikkje er dokumentert — det er ein grusveg til ein nedlagd gard, ikkje ein vinterveg.",
      "Følg skogsbilvegen sørvestover til Bergsstølen på 380 moh og vidare opp det trange dalføret ved Breiming, 610 moh. Skogen held til rundt 563 moh og terrenget er ope frå 583. Det trange partiet ved Breiming er skredterreng — det er den eine staden på turen der du står i eit søkk med sider over deg.",
      "Vidare følgjer du slakaste veg nordvestover mot Svartahorgi, til venstre for det trigonometriske punktet 834, og rundar sjølve Svartahorgi (1037 moh; SSR-punktet ligg 41 meter frå toppen og les 1029) før du kjem inn på ryggen på om lag 1003 moh. Brattaste hundremeteren på turen ligg mellom 800 og 900 moh og måler 18,6 grader i snitt.",
      "Ryggen blir følgd vestover og deretter sørover over punkt 1305 — som ligg på nøyaktig 1305 moh — og opp nordryggen til toppen på 1412 moh. Dei siste 107 høgdemetrane tek 1,1 kilometer grunn, og linja fell 17 meter frå punkt 1305 før ho stig att: brei, slak rygg, og ofte avblåsen og hard fordi han er vindutsett. Dei fleste som går Lønahorgi startar frå toppen av Horgaletten-heisen på om lag 920 moh og har då 490 høgdemeter att; denne ruta er den lange varianten frå bilvegen, og det er òg den Fri Flyt kallar den finaste nedturen.",
    ],
    descent: [
      "Ned same linja: nordryggen til punkt 1305, austover over Svartahorgi og ned til Breiming og Bergsstølen, og til slutt skogsbilvegen ned til Høyland. Fallretninga på nedkøyringa er nordaust. Nedste delen er tynn: snødekket ved Høyland og Bergsstølen er kortvarig, og utpå våren er det verdt å gå av tidleg heller enn å skrapa dei siste hundre høgdemetrane.",
      "Vanlegaste feil: å tru at Bodegaen er nedkøyringa på denne turen. Den kjende frikøyringssida ligg søraust på fjellet og matar tilbake i heissystemet i Bavallen — ho endar ikkje ved bilen din på Høyland. Den dokumenterte varianten frå denne ruta er å ta seg ned i Årdalen frå punkt 1307 ved stabile forhold, og Årdalen er austsida, den bratte delen av fjellet.",
      "Den andre feilen er å bruka det trange dalføret ved Breiming som nedkøyringslinje utan å tenkja på kva som ligg over. Store svaskred losnar seint på våren her og går langt.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja er teknisk enkel: brattaste samanhengande parti måler 28,9 grader og brattaste hundremeteren, 800 til 900 moh, 18,6 grader i snitt. Det trange dalføret ved Breiming er den eine staden ruta går inn i skredterreng, og det er òg der ho er smalast. Ryggen frå punkt 1307 og opp er brei og slak mot vest — under éin grad dei fyrste fire hundre metrane — men han er samstundes vestkanten av Årdalsida: aust for linja måler flanken 33 grader i snitt over fire hundre meter, med 48 til 52 på det brattaste. Ryggen er vindutsett og ofte avblåsen, og då ligg snøen han har mist på nettopp den lesida.",
      },
      {
        title: "Terrenget rundt",
        body: "Austsida ned mot Årdalen er den bratte delen av fjellet, og ruta følgjer kanten av henne den siste kilometeren, og store svaskred losnar der seint på våren og går langt. Årdalen ligg nordaust for toppen på om lag 930 moh og er ei dokumentert nedkøyring for dei som vel ho med opne auge — ikkje ein snarveg heim. Snødekket nede ved Høyland og Bergsstølen er tynt og kortvarig.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,189 L48,183 L72,176 L92,170 L116,162 L133,156 L153,150 L172,143 L192,131 L217,128 L241,119 L257,111 L277,102 L296,92 L324,78 L347,76 L369,74 L393,71 L414,69 L434,58 L454,51 L478,40 L506,34 L526,35 L550,32 L572,27 L595,19 L600,18",
      startLabel: "139 moh",
      endLabel: "1412 moh",
      distanceLabel: "6,7 km",
      caption: "1307 høgdemeter og 6,71 km frå Høyland, med dei siste 107 høgdemetrane fordelte på 1,1 km slak nordrygg.",
    },
  },
  vatnaknausen: {
    slug: "vatnaknausen",
    intro:
      "980 høgdemeter og 7,48 km frå Tverrberg, og nesten halve vegen på veg: bomvegen frå Selheim endar på parkeringa på 383 moh, og vegkjeda vidare inn Budalen ber deg om Øvraset til Nyestølen på 707 før fjellet tek over. Tala på sjølve lina er snille — brattaste hundremetersbeltet 13,9 grader mellom 700 og 800 moh, brattaste samanhengande parti 21,9 — men Fri Flyt set KAST 2 – Utfordrende, og det handlar om linevalet i det småkuperte terrenget over skoggrensa, ikkje om noko enkelt brattheng. Frå varden: panoramautsikta over Voss turen vert seld på.",
    ascent: [
      "Følg vegen til Selheim gard, betal bomavgifta og krabb bratt opp til Tverrberg «eller til egnet stoppested nær snøkanten», slik kjelda seier — den kartlagde parkeringa les 383 moh, men snøkanten avgjer kvar turen faktisk byrjar, og ein lågare start legg høgdemeter på. Til fots vidare: Tverrbergsvegen held fram sørover til vegdelet på 475 moh, der Øvraset-vegen tek av austover.",
      "Øvraset-vegen ber deg inn Budalen: 533 moh undervegs, Øvraset på 639, og dalbotnen på 670 — myr og glissen skog der dalen opnar seg. Vegen sluttar og stølsterrenget tek over opp til Nyestølen på 707 moh. Registeret har 27 Nyestølen-ar; denne er den i Budalen.",
      "Frå Nyestølen tek du rett nord etter skoggrensa, slik kjelda seier — skogen sluttar på 822 moh etter Kartverkets klassar. Det brattaste på heile turen ligg under den grensa, ikkje over: hundremetersbeltet mellom 700 og 800 moh måler 13,9 grader i snitt, og det brattaste samanhengande partiet — 21,9 grader — ligg mellom 738 og 756 moh, i skogen rett over stølen. Over skoggrensa slakkar det til 11,2 grader opp mot eggi, og då er det linevalet i det småkuperte, ikkje bratthenget, som krev vitet.",
      "Opp på eggi vest for Rjupetjørnane, slik kjelda rår til: lina går opp på 978 moh, følgjer eggi over 1031, og passerer tjørnene — dei ligg på 1089 — på nordsida i ope terreng på 1103 moh. Derifrå austover: platået ber deg over 1215 mot toppen.",
      "Varden står på 1302 moh, mot publiserte 1303. Registeret ber to Vatnaknausen-punkt — Topp og Berg, det siste på 1199 — og toppsøket klatra frå Topp-punktet dei siste metrane. Utsikta over Voss er grunnen til at turen finst.",
    ],
    descent: [
      "Same veg ned, seier kjelda, og han sel solnedgangen — turen er vestvend, og ettermiddagssola mjuknar snøen heile vegen heim. Ver klar over kva det tyder: det som er mjukt klokka fire, gjenfrys når sola går ned, og vestvende heng endrar seg raskast akkurat då.",
      "Nedkøyringa byrjar vestover av platået, for rett ved varden stuper det i dei andre retningane: austsida fell 40,6 grader berre 50–110 m ut, søraustsida 46,7 grader 40–100 m ut, og nordaustsida 43,8 grader 340–400 m ut. Knausen i namnet er reell — hald vest til du er nede på eggi att.",
      "Frå eggi same veg attende: ned flanken til Nyestølen, og vegkjeda ut Budalen til Tverrberg. 60 høgdemeter å gje tilbake har turen samla, det meste i småkuperinga på platået og vegens eigne slakkar.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyt set KAST 2 – Utfordrende med den grunngjevinga kjelda sjølv gjev: «En del brattere småkupert terreng», der innsatsen ligg i å leggja sporet under 30 grader. Målinga av den valde lina seier kvar det brattaste faktisk ligg: hundremetersbeltet 13,9 grader mellom 700 og 800 moh og det brattaste samanhengande partiet 21,9 grader mellom 738 og 756 — begge under skoggrensa på 822, mellom Nyestølen og skogkanten. Flanken opp mot eggi måler 11,2 grader. Det er linevalet, ikkje lina, som er utfordringa — går du utanom, finn du fort 30-gradersheng i det småkuperte.",
      },
      {
        title: "Toppknausen",
        body: "Frå varden fell det brått i tre retningar: 40,6 grader mot aust berre 50–110 m ut, 46,7 mot søraust 40–100 m ut, og 43,8 mot nordaust 340–400 m ut. I godt sikt er det openbert; i skodde er den flate austsektoren — snittet mot aust er −0,3 grader dei fyrste 800 metrane fordi platået held fram — ei felle som leier deg utpå kanten. Kompasskurs vestover frå varden, alltid.",
      },
      {
        title: "Vestvendt",
        body: "Heile fjellsida turen går i vender mot vest og sørvest. Det gjev solmjuk snø om ettermiddagen og solnedgangen kjelda sel turen på — og det gjev òg dagleg gjennomvæting og gjenfrysing utover våren. Vurder tidspunktet som ein del av linevalet: flanken under skoggrensa er brattast, og platået over får sola sist.",
      },
      {
        title: "Før du går",
        body: "Vatnaknausen ligg i varslingsregionen Voss, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer sesongmånader for denne turen; kortets jan–apr er lånt frå dei andre Voss-turane i appen, og guiden seier det. Bomvegen til Tverrberg har avgift. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,195 L44,190 L63,192 L82,185 L102,180 L127,179 L152,183 L174,179 L199,174 L225,167 L250,158 L272,151 L293,149 L315,144 L344,140 L368,131 L387,116 L415,105 L441,88 L467,79 L488,71 L506,66 L528,53 L553,41 L579,28 L600,18",
      startLabel: "383 moh",
      endLabel: "1302 moh",
      distanceLabel: "7,5 km",
      caption: "980 høgdemeter og 7,48 km frå Tverrberg — veg inn Budalen til Nyestølen, eggi vest for Rjupetjørnane, og 21,9 grader som brattaste samanhengande parti.",
    },
  },
  horndalsnuten: {
    slug: "horndalsnuten",
    intro:
      "1121 høgdemeter på 5,93 km frå Skiple i Raundalen, med halvannan kilometer flat innmarsj før terrenget tek til å stiga. Brattaste samanhengande parti måler 31,4 grader og ligg mellom 1093 og 1116 moh — nordvend, og siste kneika til toppen er brattaste delen av ruta.",
    ascent: [
      "Start ved den kartfeste parkeringa ved brua over Raundalselvi ved Skiple, 398 moh, om lag tjue kilometer aust for Voss. Dei fyrste 1490 metrane grunn er tilnærma flate — bandet frå 300 til 400 moh måler 0,8 grader — og ruta kryssar elva tidleg.",
      "Følg traktorvegen forbi Horndalsbruni og inn i Horndalsbotnen på 757 moh. Skogen held til 781 moh, og i den øvre lia mot Bjørnsetstølen er det skredbaner; hald deg i skogen der nede.",
      "Frå botnen stig ruta mot skuldra. Bandet frå 900 til 1000 moh måler 16,9 grader og 1000 til 1100 moh 21,4, som er brattaste hundremeteren. Brattaste samanhengande parti på heile turen ligg her, 31,4 grader over tretti meter mellom 1093 og 1116 moh.",
      "Over skuldra på 1153 moh flatar det ut ei stund, 13,3 grader frå 1100 til 1200 moh, før den siste kneika: 20,6 grader frå 1200 til 1300 moh, og deretter jamnare terreng til varden på 1462.",
    ],
    descent: [
      "Ned same vegen, nordover gjennom Horndalsbotnen og ut den flate innmarsjen til Skiple. Fallretninga er nord, og fjellet held difor kaldt føre lenge — det er også grunnen til at det sjeldan er vårføre å hente her.",
      "Vanlegaste feil: å legge nedkøyringa i den øvre lia mot Bjørnsetstølen fordi ho ser open ut. Der er det skredbaner. Den andre er å undervurdere innmarsjen: 1490 meter tilnærma flat grunn er tungt å gå attende i mjuk snø, og turen er lengre enn høgdemetrane tilseier.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Flat innmarsj, jamn midtdel og ei bratt kneik til slutt. Brattaste hundremeteren, 1000 til 1100 moh, måler 21,4 grader, og brattaste samanhengande parti 31,4 grader mellom 1093 og 1116 moh. Heile fjellsida er nordvend.",
      },
      {
        title: "Terrenget rundt",
        body: "Den øvre lia mot Bjørnsetstølen er skredbaner — det er den staden på turen der ein skal halde seg i skogen heller enn i det opne. Fri Flyt skildrar òg ein sørleg start frå Skaftedalen via Skytjeset; det er ei anna rute på det same fjellet, ikkje eit alternativ midtvegs.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,194 L25,198 L47,197 L69,198 L96,197 L123,196 L151,190 L169,185 L196,176 L228,162 L255,154 L282,147 L305,139 L327,134 L351,129 L374,122 L396,114 L419,103 L437,96 L455,85 L473,72 L487,70 L506,60 L524,49 L542,39 L560,34 L583,26 L600,18",
      startLabel: "398 moh",
      endLabel: "1462 moh",
      distanceLabel: "5,9 km",
      caption: "1121 høgdemeter og 5,93 km frå Skiple gjennom Horndalsbotnen, med skoggrensa på 781 moh og skuldra på 1153 moh før toppkneika.",
    },
  },
  folarskardnuten: {
    slug: "folarskardnuten",
    intro:
      "Buskeruds høgaste, og ein tur der 13,06 km og 997 høgdemeter kjem nesten heilt utan bratt terreng. Det einaste trinnet som krev noko står ut av Folarskardet, og det er kort — resten er lang, jamn innmarsj over Hallingskarvet.",
    ascent: [
      "Frå p-plassen ved Rv7 på Haugastøl, 1007 moh, følgjer du den kvista DNT-vinterruta mot Raggsteindalen nordover. Dei fyrste elleve kilometrane er innmarsj: over stigninga på 1212 moh, ut på flatene under Folarskardet på 1326 moh, og i alt rundt 600 høgdemeter fordelte så tynt at bandet mellom 1200 og 1300 moh måler 2,1 grader i snitt. Det er stakelende, ikkje skinnlende. Undervegs går linja over is tre gonger: Tjørngravtjørni på 1098 moh to gonger, 135 og 45 meter, og eit unamngjeve tjern på 1230 moh på 45. Ingen av dei er regulerte og ingen kryssing går meir enn 48 meter frå land — det er små høgfjellstjern den kvista ruta går tvers over — men på ein tur der resten av innmarsjen er fast mark er dei verdt å vite om.",
      "Ved Lordehytta i Folarskardet, 1620 moh, går du av merkinga. Hytta er frå 1880 og står i sjølve skardet; tjørna like ved ligg på 1603 moh og er vatn under snøen — linja går 270 meter over henne, opptil 84 meter frå land, og det er den fjerde og lengste iskryssinga på turen. Rutebeskrivinga seier at ein forlèt merkinga ved tjørna og følgjer varder oppover, og det er den linja som er teikna her — ikkje straklinja frå hytta mot toppen, som måler 40,3 grader som verste steg.",
      "Trinnet ut av skardet er turens einaste bratte parti: 35 til 40 grader, målt til 36,7 grader over 41 meter på den slakaste ramma nokon finn. Linja skrår over trinnet i staden for å ta det rett på, og les difor lågare: 29,2 grader over det brattaste 30-metersvindauget, mellom 1775 og 1795 moh. Bandsnittet på 18,7 grader for 1700 til 1800 moh er eit snitt over 337 meter grunn og skjuler trinnet heilt. Er snøen hard eller avblåsen, er det her folk tek på seg stegjern.",
      "Over trinnet, på om lag 1830 moh, flatar det ut att, og dei siste 702 metrane går vest-sørvestover — peiling 253 grader — opp til toppen på 1932 moh, jamt frå 0,5 til 17,5 grader. Merk at varden i rutebeskrivingane står på nordausttoppen: 1927 moh, 821 meter unna på peiling 36 grader, med eit skar på 1900 moh imellom. Terrengmodellen gjev 1932,2 på toppunktet og 1927,3 på nordausttoppen, mot 1933 i den førte høgda. Toppplatået er ope og har lite å navigere etter.",
    ],
    descent: [
      "Ned same veg: over kanten av trinnet, ned ramma til Lordehytta, og deretter dei elleve kilometrane tilbake til Haugastøl. Nedkøyringa er sørvend — fallvekta gjennomsnittsretning er 154 grader — men ho er òg kort. Under skardet er det lang, slak transport, og har du motvind på flatene tek heimvegen like lang tid som innmarsjen.",
      "Vanlegaste feil: å gå ut på nordsida av skarvet for å finne ei betre linje ned. Skavlane på nordsida heng langt ut over Raggsteindalen, og kanten er ikkje synleg frå platået i flatt lys. Den andre feilen er å undervurdera vêrvindauget: turen er ikkje bratt, men han er lang, og ein snuoperasjon på toppplatået i dårleg sikt betyr elleve kilometer att i motvind.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Trinnet opp frå Folarskardet er 35 til 40 grader og er det einaste verkelege skredterrenget på turen. Linja som er teikna går over trinnet, ikkje utanom det. Tala for henne — 27,2 grader som brattaste parti, 18,7 i snitt for bandet 1700 til 1800 moh — gjeld sporet og ikkje ramma: linja skrår over trinnet, medan fallinja der måler 36,7 grader over 41 meter. Bommar du på ramma, måler nærliggjande linjer 40 til 46 grader. Trinnet kan òg vera avblåse og isete, og då er det stegjern og ikkje skredvurdering som er problemet.",
      },
      {
        title: "Terrenget rundt",
        body: "Skavlane på nordsida av Hallingskarvet heng langt ut over Raggsteindalen, og toppplatået er ope og navigasjonskrevjande i dårleg sikt — det er lett å gå mot ein kant ein ikkje ser. Vestsida er Hellevassfonn og Finse-traversen, ei anna rute enn denne. Den lange innmarsjen gjer at vêret betyr meir enn hellinga: elleve kilometer er langt å snu på.",
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
      caption: "997 høgdemeter og 13,06 km frå Haugastøl, der elleve av kilometrane er innmarsj og eitt kort trinn ut av Folarskardet er alt som er bratt.",
    },
  },
  prestholtskarvet: {
    slug: "prestholtskarvet",
    intro:
      "963 høydemeter og 11,63 km fra Havsdalen til det høyeste punktet på 1860 moh, tolv kilometer inn på Hallingskarvet. Åtte av dem er flate: bandet fra 1200 til 1300 moh måler 1,3 grader over 5130 meter grunn. Alt det bratte ligger i Prestholtskardet — 17,6 grader fra 1500 til 1600 moh over 315 meter grunn, med et steg på 24,8 grader mellom 1323 og 1344.",
    ascent: [
      "Start på parkeringa nederst i Havsdalen, 963 moh — tre avgiftsplasser ved siden av hverandre, alle med access=yes i OSM. Ut.no tegner turen sin fra toppen av skisenteret, 1070 moh, som er lettvint hvis heisen går; korridoren her starter der bilen står, og det er forskjellen mellom de to startpunktene som gjør at høydemeterne på kortet er større enn ut.nos oppgitte 855. Skogen slipper taket på 1048 moh og terrenget er åpent fra 1051.",
      "Fra 1058 moh er du inne på den merkede løypa vestover. Ut.no: «følg merket løype til Prestholtseter (åtte km). Løypa blir tråkket daglig og er følgelig i meget god standard med både klassisk- og skøytespor.» Det er en flat innmarsj i ordets rette forstand — bandet fra 1000 til 1100 moh måler 3,3 grader over 1711 meter grunn, 1100 til 1200 måler 4,6 over 1216, og 1200 til 1300 måler 1,3 over 5130. Linja passerer 1240 moh og holder det nivået i fem kilometer.",
      "Prestholtstølan ligger på 1243 moh, rett under sørsiden av skarvet. Herfra begynner turen på nytt: 16,3 grader fra 1300 til 1400 moh over 315 meter grunn, 17,2 fra 1400 til 1500 over 316, og 17,6 fra 1500 til 1600 over 315 — det brattaste bandet. Det brattaste steget på hele linja ligger lavere, 24,8 grader mellom 1323 og 1344 moh. Det er Prestholtskardet, og registerpunktet for skardet måler 1640 moh.",
      "Oppe på skarvet slakner det brått: 10,3 grader fra 1600 til 1700 moh over 540 meter grunn, 7,1 fra 1700 til 1800 over 855, og 4,2 fra 1800 til 1900 over 742. De siste to kilometerne går vestover over vidt, åpent platå til det høyeste punktet, 1860,4 moh. Registerpunktet for Prestholtskarvet ligger 550 meter nordøst, mellom to topper som måler 1860,4 og 1857,5; ut.nos egen linje ender 20 meter fra den høyeste, og det er den kortet fører.",
    ],
    descent: [
      "Ned samme vegen: vestover platået, ned Prestholtskardet og ut løypa. Sørflanken er den kortet fører, og den er ikke slak — sør måler 18,1 grader i snitt ut til halvannen kilometer med et 51,1-graders vindu 925 til 975 meter ut, sørøst 14,7 med 66,0 i vinduet 1225 til 1275, og sørvest 11,2 med 49,3 i 475 til 525. Det er veggen over Prestholt, og Prestholtskardet er det ene stedet den brytes.",
      "Intuisjonen om at stupet må ligge på den andre siden er feil her. Nord måler 2,0 grader i snitt ut til halvannen kilometer med et bratteste 60-metersvindu på 6,6, og nordøst 4,3 med 12,0 — skarvet fortsetter bare. Innafor 400 meter av toppen er hver eneste peiling under 10 grader. Det er et platå, og faren på det er ikke helning, det er sikt: du står på 1860 moh med tolv kilometer hjem og ingen holdepunkter.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "963 høydemeter der brattaste band er 22,0 grader og brattaste steg 25,2, begge i Prestholtskardet. Ruta gir tilbake 66 høydemeter på 11,63 km. Ut.no fører turen som krevende skitur og 21,6 km tur/retur fra heistoppen, og skriver at den «blir oftest gått utpå seinvinter/vår når snøen har satt seg» — det er skardet den setningen handler om.",
      },
      {
        title: "Terrenget utenfor",
        body: "Sørveggen under skarvet måler 66,0 grader i brattaste 60-metersvindu mot sørøst, 51,1 mot sør og 49,3 mot sørvest. Du kommer opp gjennom det ene bruddet i den. Vest for toppen ligger et trinn på 30,1 grader 425 til 475 meter ut. Nordover er platået flatt så langt sveipet går, men kanten er der et sted, og i flatt lys finner du den før du ser den.",
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
      "666 høydemeter på 5,36 km fra Vikerkoia, 661 moh, til Ringerikes høyeste punkt på 1127. Differansen mellom de to tallene er søkket: ruta klatrer opp på Svarttjernskollen, 1054 moh, faller ned mot Fjelldalen og går opp igjen, og gir tilbake 200 høydemeter som kommer igjen som stigning på vegen hjem.",
    ascent: [
      "Start på parkeringa ved Vikerkoia på Vikerseterveien, 661 moh — Kartverket klasser punktet som myr, og det er en presis beskrivelse av Vikerfjell. De første høydemeterne er slake, 5,1 grader fra 600 til 700 moh, før skogen tar over ved 698 moh.",
      "Stigningen opp mot Svarttjernskollen er den bratteste på turen: 15,4 grader fra 700 til 800 moh over 360 meter grunn, med bratteste sammenhengende parti 24,9 grader mellom 767 og 788 moh. Skogen holder helt til 946 moh, og fra 948 er du ute i åpent terreng.",
      "Svarttjernskollen ligger på 1054 moh, og ut.no oppgir 1054 — det er kontrollen på at du er på rett rygg. Herfra ser du Vikerfjellplatået i sør og Gyranfisen i vest. Så går det ned igjen: linja passerer 1002, 961, 904 og 922 moh, og Kartverket klasser flere av dem som skog. Du er under tregrensa på nytt, midt i turen.",
      "Venekollen, 982 moh, passeres på høyre hånd, og waypointet i korridoren ligger vest for toppen på 949 moh, der ruta faktisk går. Fra bunnen av søkket stiger det jevnt igjen — 4,1 grader fra 1000 til 1100 moh over 1207 meter grunn, og 8,0 grader det siste bandet — til varden på 1127 moh. Treknatten, 1098 moh, ligger 4,20 km nord-nordvest, på peiling 340.",
    ],
    descent: [
      "Ned samme vegen, sørøstover, og du skal opp igjen underveis. Det er turens egenart: 200 høydemeter gitt tilbake på veg opp betyr 200 høydemeter å klatre på veg ned, og det er verdt å ha spart krefter til dem.",
      "Fjellet er slakt i alle retninger. Radialmålinger fra varden gir 4,8 til 12,6 grader i snitt over 500 meter, og bratteste 60-metersvindu på hele toppen er 29,9 grader mot nordaust, 410 til 470 meter ut. Vestsida — den mot Vidalen — måler 5,7 grader i snitt helt ut til halvannen kilometer, med bratteste vindu 20,9 grader. Stupene du ser den vegen tilhører Bukollen, Gråfjell og Storrustefjell på andre sida av dalen, ikke fjellet du står på.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slakt terreng med én kneik: 15,4 grader fra 700 til 800 moh over 360 meter grunn, og bratteste sammenhengende parti 24,9 grader mellom 767 og 788 moh. De andre bandene måler 2,3 til 10,5 grader i snitt. Skredfaren er lav; det som kan gå galt er lengden, søkket og at siste stykket opp er umerket.",
      },
      {
        title: "Terrenget utenfor",
        body: "Ingen retning fra varden måler over 12,6 grader i snitt de første 500 meterne. Ryggen fra Svarttjernskollen er avblåst i vind, og søkket mot Fjelldalen og Steintjern må krysses begge veger. Løypene til Gyranfisen og Treknatten blir kjørt bare når forholdene tillater det og prioriteres i vinter- og påskeferien — utenom det er ruta usporet myr og fjell. Deler av området ligger i Vikerfjell naturreservat.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,193 L45,189 L69,174 L86,159 L106,133 L127,109 L141,95 L166,79 L186,66 L203,61 L224,48 L242,49 L262,62 L286,80 L302,82 L327,94 L346,102 L368,108 L388,110 L408,96 L428,93 L448,89 L463,98 L484,103 L500,95 L516,79 L539,62 L554,49 L579,29 L600,18",
      startLabel: "661 moh",
      endLabel: "1127 moh",
      distanceLabel: "5,4 km",
      caption: "666 høydemeter og 5,36 km fra Vikerkoia over Svarttjernskollen, med skoggrensa på 946 moh og 200 høydemeter gitt tilbake i søkket underveis.",
    },
  },
  oksen: {
    slug: "oksen",
    intro:
      "967 høydemeter i ett strekk, fra Tjoflot nede ved fjorden til en topp som ser ut over Hardangerfjorden, Granvinsfjorden, Sørfjorden og Eidfjorden. Turen krever kondisjon mer enn teknikk.",
    ascent: [
      "Fra avgiftsparkeringen øverst på Tjoflotvegen, 276 moh, følger du traktorveien et kort stykke før stien tar over. Regn med å bære ski gjennom skogen: skoggrensa ligger på 538 moh, og de fleste spenner dem først på oppe ved Vindhovden.",
      "Skogen er det bratteste partiet før flanken. Fallinja mellom 335 og 405 moh måler 30° i snitt og tar 51° over de bratteste seksti meterne; stien tar den i svinger — ingen hundremeter i skogen holder mer enn 21° — og topper på 29° rundt 490 moh. Følg svingene — det finnes ingen snarvei her som lønner seg.",
      "Ved stølen Vindhovden på 586 moh åpner det seg. Herfra følger du sørvestsida østover mot toppen, langs skulderen under ryggen. Rundt 900 moh strammer det til: spennet 900–1000 moh ligger på 24,3° i snitt og 1000–1100 på 19,0°, og det bratteste enkeltpartiet på linja, 29,1°, ligger lenger nede, rundt 490 moh i skogen. Grunnen blir samtidig steinete.",
      "Over 1100 moh slakner linja igjen, og de siste høydemeterne er rolig terreng inn mot toppen. Men hold linja: noen titalls meter sør for deg ruller skulderen over. Ved 1146 moh faller sørsida 40° i snitt de neste 340 høydemeterne, med et enkelttrinn på 66°. Nord for linja er det motsatt — der slakner det ut i 2–5°, og det er den sida som lurer deg av ruta.",
    ],
    descent: [
      "Flanken kjører like godt ned som den går opp: over 650 sammenhengende høydemeter fra toppen til Vindhovden, med fjorden foran deg hele veien. Du har bredde å velge i, men ikke ubegrenset — et par hundre meter sørover ruller skulderen over i 35–40°.",
      "Vanligste feil: å følge fallinja. Tåka legger seg ofte på toppen her, og i flatt lys trekker den deg sørover av skulderen, ned i 35–40° med trinn opp mot 57°. Retter du for mye tilbake, havner du i det slake nord for linja — der ligger Hamreskredane, 530 meter nord for ruta på 758 moh, og under den faller terrenget 33° videre mot Granvinsfjorden. Sikt på Vindhovden, og hold høyden på skulderen hele veien ned.",
      "Under Vindhovden er kjøringen over. Skoggrensa på 538 moh er der skiene går på sekken, og de siste drøyt 260 høydemeterne ned til Tjoflot går på beina, i de samme svingene du kom opp.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ruta stiger 967 høydemeter på 3,66 km, og den bratteste delen ligger mellom 900 og 1100 moh: 24,3° i snitt over det første hundremeterspennet, 19,0° over det neste. Det bratteste enkeltpartiet på linja måler 29,1° og ligger rundt 490 moh, i skogen under Vindhovden. Det er over grensa der snø løsner, og partiet er langt nok til at du bør vurdere det for seg.",
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
      path: "M0,200 L22,194 L44,188 L66,180 L81,176 L103,166 L113,163 L125,157 L140,152 L161,143 L177,141 L196,137 L214,131 L243,127 L262,123 L280,117 L302,112 L324,108 L346,104 L361,100 L383,92 L392,89 L408,82 L421,76 L435,68 L456,60 L479,49 L494,43 L509,39 L531,32 L553,27 L579,20 L600,18",
      startLabel: "276 moh",
      endLabel: "1241 moh",
      distanceLabel: "3,7 km",
      caption: "276 moh ved Tjoflot til toppen av Oksen — 967 høydemeter på 3,66 km, uten en meter tilbake.",
    },
  },
  ustetind: {
    slug: "ustetind",
    intro:
      "416 høydemeter og 4,38 km fra Ustaoset til den store varden på 1376 moh. Ingenting på ruta er bratt: brattaste hundremetersband er 9,7 grader fra 1100 til 1200 moh over 614 meter grunn, og brattaste sammenhengende steg 18,5 grader mellom 1343 og 1355. Hele turen ligger på nordøstkanten av Hardangervidda, og det er været og ikke helningen som avgjør dagen.",
    ascent: [
      "Start på parkeringa ved Ustaoset, 989 moh. Ut.no tegner turen sin fra et punkt 320 meter lenger nord, oppe i hyttefeltet på 1005 moh; plassen som er kartlagt i OSM ligger nede ved vegen, og det er den korridoren bruker. Rv 7 forbi Ustaoset er vinteråpen, og det går tog til stasjonen 692 meter nordvest.",
      "Første kilometeren er nesten flat — bandet fra 900 til 1000 moh måler 0,9 grad over 906 meter grunn — forbi setra Sisseldalen og sørover. Så tar det seg litt opp: 4,5 grader fra 1000 til 1100 moh over 1231 meter grunn. Linja passerer 1104 moh vest for Måfådalen. Skogen slipper taket på 1070 moh og terrenget er åpent fra 1078.",
      "Over tregrensa kommer den ene stigninga som fortjener navnet: 9,7 grader fra 1100 til 1200 moh over 614 meter grunn. Ut.no beskriver det samme fra den andre siden — «før Tindevatnet starter en jevn stigning». Linja passerer vatnet på østsida, 1317 moh, og over det slakner det igjen til 7,4 og 4,9 grader.",
      "Den siste kilometeren er slak rygg til varden på 1376 moh, med det brattaste steget på hele turen underveis: 18,5 grader mellom 1343 og 1355 moh. På toppen står to varder. Den lille har en metallplate med piler og stedsnavn; den store er fra 1899, verneverdig, og ble brukt som trigonometrisk punkt — ut.no ber deg uttrykkelig la være å legge på stein.",
    ],
    descent: [
      "Ned samme vegen mot nord. Nordflanken måler 9,9 grader i snitt over 400 meter med et 15,2-graders vindu 70 til 130 meter ut, og nordvest 10,8 med 22,2 i vinduet 90 til 150. Det er slakt nok til at nedkjøringa er en tur og ikke en linje, og det er også hele poenget med fjellet: bergen365 kaller det en topptur for tidlig og sein sesong, når snøen blir varm og våt lenger vest.",
      "Ingen retning fra toppen er bratt. Det brattaste 60-metersvinduet i hele sveipet er 28,9 grader mot sørøst, 110 til 170 meter ut, og sørvest måler 27,5 i vinduet 160 til 220. Snittet ligger mellom 8,8 og 13,0 grader i alle åtte retninger.",
      "Turen kan òg gjøres fra den private turisthytta Tuva i sør, som ut.no oppgir til halvannen time opp mot drøyt to fra Ustaoset. Bergen365 beskriver en tredje variant, fra dammen på Ustevatnet via Verpestølvegen, med rundt 400 høydemeter.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "416 høydemeter der brattaste band er 9,7 grader og brattaste steg 18,5. Ruta gir tilbake 29 høydemeter på 4,38 km. Ut.no fører turen som moderate og barnevennlig. Det er ikke helningen som er problemet her.",
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
      "1068 høgdemeter og 5,03 km frå støls- og hyttetunet i Fitjadalen til Skrott, fjellet som stuper mot Hardangerfjorden i sørenden av Kvamskogen. Lina følgjer den kartlagde stien heile vegen: gangbrua over Kjølo, den bratte skogslia til Håsete, skihytta på 1110 moh og skaret mellom Glynt og toppen. Det brattaste hundremetersbeltet måler 17,4 grader mellom 800 og 900 moh, og det brattaste samanhengande partiet 28,2 grader mellom 1158 og 1182 moh — men det som pregar turen, er skrentene i skogen og den bratte toppklossen, ikkje snitta.",
    ascent: [
      "Frå parkeringa ved støls- og hyttetunet i Fitjadalen, 272 moh, om lag åtte kilometer frå Øystese. Oppstigninga byrjar ved gangbrua over elva Kjølo og følgjer i hovudsak sommarstien — fyrst gjennom granskog i knotete terreng, så over ei flate, og opp ei li der Fri Flyts eiga åtvaring gjeld: «stygge skrenter i skogen». Belta måler 14,9 grader frå 300 til 400 moh og 17,0 frå 500 til 600, og stien er der av ein grunn — han går utanom skrentene.",
      "Skogen sluttar på 676 moh etter Kartverkets klassar, med ope område frå 686, og like over kjem du inn i dalføret som leier til Håsete — stølen ligg på 754 moh der registeret har han, mot dei «rundt 800 meter» kjelda oppgir. Herfrå held du nordvestover med jamn stigning: beltet frå 800 til 900 moh er turens brattaste med 17,4 grader i snitt over 348 meter grunn.",
      "Den vesle skihytta står på 1109,8 moh målt — Fri Flyt kallar henne «omtrent 1000 moh», westcoastpeaks «the hut at 1100 m», og terrengmodellen avgjer. Frå hytta går normalvegen nordover opp i skaret mellom Glynt og sjølve toppen. Det brattaste samanhengande partiet på lina ligg her, 28,2 grader mellom 1158 og 1182 moh, før skaret slepper deg opp på skuldra.",
      "Fri Flyt nemner òg ei alternativ oppstigning frå skihytta: sommarstien på eit system av skråhyller og opp ein liten kneik over kanten. Kjelda åtvarar sjølv mot henne ved hardt føre eller vestvende skavlar, og Westcoastpeaks tilrår isøks og stegjern på dei same hyllene vinterstid, og legg til at i isete forhold trengst isøks og stegjern òg for å kome ned frå sjølve toppen. Korridoren her er skaret, ikkje hyllene, men isøksa gjeld toppen like fullt.",
      "Skuldra der sommarstien kryssar, 85 meter nord for varden, måler 1300,6 moh, og dei siste meterane sørover til varden er lett terreng, nett slik kjelda seier — beltet frå 1300 til 1400 måler 6,4 grader. 1320 moh, med Hardangerfjorden framfor deg — Fri Flyt skriv at fjellet «stuper rett i Hardangerfjorden», men næraste fjordvatn ligg 8 km unna ved Øystese, og terrenget 3 km vest og sørvest for varden står framleis i 550 til 800 moh.",
    ],
    descent: [
      "Terrenget frå toppen ned mot Håsete innbyr til variasjonar over oppturen — det er Fri Flyts eigne ord, og søraust- og sørsveipa frå varden måler 38,9 og 39,5 grader i sine brattaste 60 m-vindauge 580 til 720 meter ut, så det finst bratt skikøyring å hente. Seint på våren nemner kjelda bollane og ryggane litt austover frå varden, fremst på kanten og derfrå mot Håsete.",
      "Det som ikkje skal køyrast, er vest og sørvest frå varden: vestsida fell 49,0 grader berre 10 til 70 meter ut, og sørvestsida 45,4 grader 160 til 220 meter ut. Nordvest er heller ikkje vegen heim — ho fell 49,8 grader i snitt dei fyrste tjue metrane og 34,8 ut til 160, og dei 7,0 gradene over 800 meter er berre fallet ned i skaret jamna mot stiginga opp att mot Glynt. Skuldra du kom opp ligg rett nord, og måler 17,5 grader i snitt dei fyrste 400 metrane — frå varden ser dei to sidene like ut i flatt lys, og dei er det ikkje.",
      "Frå Håsete er rådet frå kjelda å følgje omtrent same vegen som opp: «lett å kjøre seg fast i kronglete terreng» er Fri Flyts formulering om skogslia, og skrentene som forma opphavsvegen finst framleis under deg.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts faremoment er «Skredfare i øvre del. Stygge skrenter i skogen.» Den øvre delen er flanken frå Håsete til skaret — brattaste beltet 17,4 grader mellom 800 og 900 moh, brattaste samanhengande parti 28,2 grader mellom 1158 og 1182 — og skrentene i skogen ligg i belta på 14,9 til 17,0 grader under tregrensa på 676 moh, der stien er einaste fornuftige linevalet. ut.no seier det same med andre ord: turen er primært ein fottur, og som skitur går nokre stader så bratt at kunnskap om skredfare er nødvendig.",
      },
      {
        title: "Toppklossen",
        body: "Vestsida fell 49,0 grader berre 10 til 70 meter frå varden og sørvestsida 45,4 grader 160 til 220 meter ut, medan nordskuldra lina brukar måler 17,5 grader i snitt dei fyrste 400 metrane. Skråhyllene på alternativvegen er kjeldas eiga åtvaring ved hardt føre eller vestvende skavlar, og westcoastpeaks tilrår isøks og stegjern der vinterstid. På denne toppen er det ikkje snittbrattheita som er faren, men kantane.",
      },
      {
        title: "Før du går",
        body: "Skrott ligg i varslingsregionen Voss, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer skisesong for denne turen: ut.nos sesongfelt gjeld fotturen (mai til juli og september), og kortets jan–apr er lånt frå ut.nos Tveitakvitingen-skildring på same massivet. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L28,198 L53,192 L70,184 L91,177 L112,170 L127,163 L142,157 L160,147 L177,142 L197,134 L210,130 L236,117 L257,115 L279,109 L299,101 L316,92 L335,86 L359,77 L381,70 L397,63 L429,56 L450,53 L473,48 L493,50 L515,42 L536,38 L558,31 L574,24 L588,21 L600,18",
      startLabel: "272 moh",
      endLabel: "1320 moh",
      distanceLabel: "5,0 km",
      caption: "1068 høgdemeter og 5,03 km frå Fitjadalen, med det brattaste — 28,2 grader mellom 1158 og 1182 moh — i skaret mellom Glynt og toppen.",
    },
  },
  sata: {
    slug: "sata",
    intro:
      "895 høgdemeter og 6,6 km frå den innarste parkeringa ved Eikedalen skisenter til toppen registeret fører under to namn: Såta og Iendefjell. Turen er to turar i éin — ein nesten flat anmarsj inn Skeiskvanndalen, der beltet frå 500 til 600 moh måler 1,8 grader i snitt over 3,15 km grunn, og så sjølve fjellet: frå Rosselandsbotnen austover reiser flanken seg, med det brattaste hundremetersbeltet på 18,4 grader mellom 1100 og 1200 moh og eit brattaste samanhengande parti på 32,5 grader mellom 1139 og 1168 moh, rett under skaret.",
    ascent: [
      "Frå den innarste parkeringa ved Eikedalen skisenter, 459 moh, på Kråvegen. Fri Flyt sender deg opp ein seterveg dei fyrste hundre høgdemetrane, og det er Kråvegen austover og stien vidare: lina følgjer den kartlagde vegen og stien til om lag 555 moh, der dalen flatar ut.",
      "Så kjem den lange, flate anmarsjen inn Skeiskvanndalen — 1,8 grader i snitt gjennom beltet frå 500 til 600 moh, over 3,15 km grunn. Skogen sluttar på 629 moh etter Kartverkets klassar, med ope område frå 631, så mesteparten av dalen går i glissen fjellskog og myr. Dalbotnen ber to naturlege vatn på 551 moh — ei namnlaus tjørn og Skeiskvanndalsvatnet — og lina held den tørre nordvestsida forbi begge. Det er målt, ikkje vona: 0 meter av lina står på vatn.",
      "Rosselandsbotnen er vendepunktet. Sjølve registerpunktet for botnen står på tjørna der — 661 moh, klasse innsjø — og lina passerer sørbredda på fast mark. Her forlèt du dalbotnen, tek til høgre slik kjelda seier, og byrjar den bratte stigninga: belta ovanfor måler 16,1 grader frå 700 til 800 moh, 17,7 frå 900 til 1000 og 18,4 frå 1100 til 1200, det brattaste på turen.",
      "Sikt mot skaret til venstre for — altså nord for — sjølve toppen. Det måler 1224 moh, 190 meter nord-nordvest for varden, og det brattaste samanhengande partiet på heile lina ligg rett under det: 32,5 grader mellom 1139 og 1168 moh. Øvste delen av skaret og toppryggen er ofte avblåsen og hard, og Fri Flyt nemner isøks som føremon — det er den delen av turen som avgjer om dagen er innanfor.",
      "Frå skaret går toppryggen sørover til varden, forbi 1248 moh — beltet frå 1200 til 1300 måler 9,1 grader, så det bratte er gjort når du står i skaret. 1260 moh, og Kvamskogen, Fuglafjellet og fjorden under deg.",
    ],
    descent: [
      "Vanlegaste nedkøyringa er same vegen: nordover av toppryggen, ned gjennom skaret, og vestflanken ned mot Rosselandsbotnen. Flanken du køyrer er den same du gjekk opp — 25,4 grader i snitt frå varden mot vest, med 53,0 grader som brattaste 60 m-vindauge 740 til 800 meter ut — så line-vala på veg opp er line-vala på veg ned.",
      "Fri Flyt skildrar òg den sørvestvendte renna mellom Såterindane. Kjelda seier du skal fortsetje forbi toppvarden for å finne henne, og registeret set Såterindane 837 meter sørvest for varden; det bratte rett under varden — 43,4 grader 110 til 170 meter ut i sørvestsveipen — er skuldra på toppen, ikkje inngangen til renna. Kjelda er tydeleg på avslutninga: ta til høgre før botnen av renna, før Såtedalen, og køyr tilbake mot oppstigningsruta. Vestflanken rett ned frå toppen nemner kjelda berre for dagar med svært stabilt snødekke.",
      "Frå Rosselandsbotnen att er det dei 3 km flate ut dalen og setervegen ned til parkeringa — 94 høgdemeter å gje tilbake har turen samla, det meste av det i den kuperte dalbotnen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts eige faremoment er «Skred både opp og ned, og klipper», og målingane seier kvar: belta frå 700 moh og opp vekslar mellom 9,1 og 18,4 grader i snitt, med 16,1 frå 700 til 800, 17,7 frå 900 til 1000 og 18,4 frå 1100 til 1200 som dei brattaste, det brattaste samanhengande partiet er 32,5 grader mellom 1139 og 1168 moh, og fallet held fram forbi varden — vestsida 53,0 grader på det brattaste 740 til 800 meter ut, nordvestsida 53,6 grader 690 til 750 meter ut. Flanken frå Rosselandsbotnen til skaret er skredterreng i begge retningar, og han er einaste vegen på denne ruta.",
      },
      {
        title: "Toppen og skaret",
        body: "Øvste delen av skaret og toppryggen er ofte avblåsen og hard — Fri Flyt nemner isøks, og det er her han meiner. Sørvestsveipen frå varden måler 43,4 grader på det brattaste 110 til 170 meter ut, og det er skuldra på toppen — renna mellom Såterindane ligg 837 meter lenger sørvest; søraustsida måler 35,7 grader 440 til 500 meter ut og sørsida 37,3 grader 740 til 800 meter ut. Den slakaste sektoren frå varden er nordaust, 13,7 grader i snitt — men det er ikkje den vegen ruta går.",
      },
      {
        title: "Vatna",
        body: "Dei to vatna i dalbotnen — den namnlause tjørna og Skeiskvanndalsvatnet, begge på 551 moh — ligg ein snau time frå Bergen, lågt og kystnært, og isen på dei kan ikkje føresetjast. Lina held difor den tørre nordvestsida forbi begge, målt mot Kartverkets terrengklassar og OSMs vasspolygon: 0 meter på vatn. Registerpunktet for Rosselandsbotnen står òg på vatn, på tjørna på 661 moh; lina passerer sørbredda på fast mark.",
      },
      {
        title: "Før du går",
        body: "Såta ligg i varslingsregionen Voss, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kjelde publiserer sesong for denne turen; kortets jan–apr er lånt frå ut.nos skildring av Tveitakvitingen 12,6 km sør, på andre sida av Kvamskogen. Ta med sender/mottakar, søkjestong og spade, og isøks til skaret når det er avblåse. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,196 L50,190 L74,182 L99,179 L115,179 L144,178 L167,179 L193,178 L217,175 L242,179 L258,176 L287,179 L307,173 L332,170 L351,161 L373,155 L397,152 L415,135 L434,122 L454,112 L470,103 L484,95 L499,84 L516,69 L536,56 L561,38 L577,26 L600,18",
      startLabel: "459 moh",
      endLabel: "1260 moh",
      distanceLabel: "6,6 km",
      caption: "895 høgdemeter og 6,6 km frå Eikedalen, med det brattaste — 32,5 grader mellom 1139 og 1168 moh — rett under skaret nord for toppen.",
    },
  },
  gullfjellstoppen: {
    slug: "gullfjellstoppen",
    intro:
      "839 høgdemeter og 7,8 km frå vegenden ved Osavatnet til Bergens høgaste punkt. Dette er den slakaste turen i samlinga: ingen hundremeter av linja held meir enn 8,1 grader i snitt, og det brattaste samanhengande partiet er eit einaste trinn på 27,4 grader. Faren ligg ikkje i ruta, men i dei siste hundre metrane av han — toppkuppelen er slak, og vestsida fell 59,0 grader 200 til 260 meter frå varden.",
    ascent: [
      "Frå avgiftsparkeringa ved vegenden på Gullfjellsvegen, 307 moh, innerst i Bjørndalen. Dei fyrste to kilometrane går på grusveg og er så godt som flate: beltet frå 300 til 400 moh måler 2,5 grader i snitt over 2,1 km grunn. Skogen sluttar alt på 324 moh, og alt over det klassar Kartverket som ope område — dette er ein tur utan tregrense å snakke om.",
      "Ved 2,47 km står du ved sørenden av Svartavatnet, 410 moh. Fri Flyt skildrar vegen som «til høyre for Svartavatnet», og det er der linja går: på land, heile vegen forbi. Svartavatnet er registrert som regulert vatn. Fri Flyt oppgir 392 moh, terrengmodellen les vassflata til 408, og skilnaden er ikkje nedtapping — ho er den nye dammen: Bergen kommune bygde dam nedstraums i 2012–2014 og heva høgste regulerte vasstand med 20 meter.",
      "Redningshytta ligg 18 meter frå linja, 4,23 km ute; sjølve hyttepunktet måler 597,5 moh og linja der ho passerer 592, mot dei «600 moh» kjelda oppgir. Rett etter kjem den vesle unnabakken kjeldene nemner, og han er reell: linja mistar 50 høgdemeter, frå 605 til 555 moh over 252 meter grunn, mellom 4,11 og 4,36 km. Det er 50 av dei 159 høgdemetrane turen gir tilbake undervegs.",
      "Frå 555 moh stig det jamt att, og det brattaste på heile turen ligg her: eit trinn på 27,4 grader mellom 709 og 727 moh. Det er kort, og det er den brattaste tretti-metaren på linja.",
      "Over tjørna på 769 moh, 6,21 km ute, flatar det ut i det kjelda kallar eit kupert høgdedrag. Det brattaste hundremeterbeltet på turen ligg her, mellom 800 og 900 moh, og det måler 8,1 grader i snitt over 720 meter grunn. Så gjennom Middagsdalen på 939 moh, 7,40 km ute, og opp til varden på 987.",
    ],
    descent: [
      "Ned same linja: gjennom Middagsdalen, over høgdedraget, forbi tjørna og ned til Redningshytta. Under hytta ventar dei 50 høgdemetrane du mista på veg opp, denne gongen som stigning. Frå Svartavatnet og ut er det grusveg og 2,5 grader — dei siste to kilometrane går du.",
      "Vanlegaste feilen på dette fjellet er å ta av vestover eller nordvestover frå varden. Toppkuppelen er så slak at overgangen ikkje kjennest på skia: nordsida fell 45,8 grader berre 30 til 90 meter frå varden, nordvestsida 61,2 grader 90 til 150 meter ut, og vestsida 59,0 grader 200 til 260 meter ut. Sørsida, som er den du kom opp, held 4,9 grader i snitt dei fyrste 800 metrane. I flatt lys er skilnaden usynleg.",
      "Fri Flyt skildrar òg nedkøyringar frå hovudtoppen om Gullfjellshalsen og Vossevardane til Svartavatnet. Det er andre linjer enn denne, og dei er ikkje målte her.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja er slak heile vegen. Det brattaste hundremeterbeltet, 800 til 900 moh, måler 8,1 grader i snitt, og ingen av dei seks andre belta held meir enn 6,9. Brattaste samanhengande parti er trinnet på 27,4 grader mellom 709 og 727 moh. Det som skifter med vêret her er ikkje bratthenget, men føret: turen startar på 307 moh ved kysten, og snøgrensa ligg ofte over parkeringa. Fri Flyts eige faremoment gjeld ikkje denne linja, men gjela i massivet: «Hele Glumragjelet, samt de to rennene, er veldig skredutsatt vinterstid, og på våren kommer det ofte is og stein ned fra de stupbratte fjellsidene.» Registeret skriv namnet Glamregjelet og set juvet 663 meter rett vest for varden, på 576 moh — under den vestsida ruta ikkje køyrer, men står rett over.",
      },
      {
        title: "Toppen",
        body: "Heile turen er ei oppvarming til dei siste hundre metrane. Frå varden fell nordsida 45,8 grader 30 til 90 meter ut, nordvestsida 61,2 grader 90 til 150 meter ut og vestsida 59,0 grader 200 til 260 meter ut; austsida måler 41,3 grader 740 til 800 meter ut og søraustsida 30,6 grader 380 til 440 meter ut. Sørsida, oppstiginga, held 4,9 grader i snitt. Ein slak kuppel over bratte sider er nettopp det terrenget der ei feilpeiling i skodde kostar mest.",
      },
      {
        title: "Isen",
        body: "Osavatnet ligg på 307 moh ved kysten på Bergens breiddegrad, og Svartavatnet er registrert som regulert. Linja er difor lagd på land heile vegen: 0 meter av 7 803 står på vatn, kontrollert mot Kartverkets terrengklasse kvar andre meter langs heile linja — 3 769 punkt — og mot OSMs vasspolygon. Eit regulert vatn blir tappa ned om vinteren, og is som blir liggjande att over tomrom ber ingenting.",
      },
      {
        title: "Før du går",
        body: "Gullfjellstoppen ligg i varslingsregionen Hordalandskysten, som er ein B-region: det blir ikkje laga dagleg skredvarsel for dette fjellet. Næraste A-region er Voss, og han dekkjer eit anna og meir innlandsprega fjellparti — les han som kontekst, ikkje som varsel for Gullfjellet. Ta med sender/mottakar, søkjestang og spade. Ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L26,195 L48,199 L72,199 L97,194 L117,185 L142,186 L166,174 L191,173 L200,172 L225,160 L252,145 L277,137 L304,122 L327,129 L350,135 L372,126 L391,114 L412,97 L434,88 L457,76 L474,77 L477,76 L496,66 L520,61 L541,48 L565,31 L590,23 L600,18",
      startLabel: "307 moh",
      endLabel: "987 moh",
      distanceLabel: "7,8 km",
      caption: "839 høgdemeter og 7,8 km frå Osavatnet, med det brattaste — eit trinn på 27,4 grader mellom 709 og 727 moh — midtvegs opp.",
    },
  },
  tveitakvitingen: {
    slug: "tveitakvitingen",
    intro:
      "995 høgdemeter og 8,56 km éin veg frå Furedalen alpinsenter til Tveitakvitingen — den lengste av dei fire Kvamskogen-turane, og den slakaste: brattaste hundremetersbeltet er 16,4 grader mellom 800 og 900 moh, og brattaste samanhengande parti 25,0 grader mellom 817 og 838. ut.no graderer turen svært krevjande likevel, og det er lengda og platået som ber grada — 17 km tur-retur over vidt fjell der vêret og navigasjonen er vanskegraden, ikkje henga. Lina her er trekt av ut.no si eiga GPX-linje, som endar 8 meter frå det målte toppunktet.",
    ascent: [
      "Frå parkeringa ved Furedalen alpinsenter, 382 moh. Namnet i kjelda — «Furudalen» — finst ikkje i registeret; staden heiter Furedalen, og parkeringa er kartlagd som «Furedalen alpin». Dei fyrste hundre metrane kryssar flata ved anlegget, så er du på Mødalsvegen: dei preparerte løypene kjelda nemner er langrennsspor, kartlagde med klassisk og skøyting heile vegen til Mødal, og alpintraséane ligg vest for lina.",
      "Mødalsvegen sørover er nesten flat — belta frå 400 til 600 moh måler 3,5 grader i snitt — og forbi dei innarste sela i Mødalen tek stigninga til. Lina passerer Svartatjørna på 86 meters avstand og 621 moh; sjølve tjørna les 618 moh, og skogen sluttar på 586 moh etter Kartverkets klassar, med ope område frå 587.",
      "Så kjem dei bratte kliva kjelda skildrar, opp mot fjellet ho kallar Såta — den lokale Såta på 802 moh sør for fylkesvegen, ikkje appens Såta på 1260 på nordsida av Kvamskogen. Beltet frå 800 til 900 moh er turens brattaste med 16,4 grader i snitt, og det brattaste samanhengande partiet ligg her: 25,0 grader mellom 817 og 838 moh, opp det kjelda kallar Stoveveggen — eit namn korkje registeret eller kartet ber, så det står her som kjeldas.",
      "Over veggen flatar platået ut — beltet frå 900 til 1000 moh måler 4,7 grader over 1,3 km grunn — og lina går sør for Gråskorvenuten, gjennom søkket kjelda kallar Middagshola (heller ikkje det i registeret): lina toppar på 1017 moh og gjev tilbake 36 meter til 981 før ryggen tek til. Turen gjev tilbake 78 høgdemeter samla, det meste her.",
      "Siste biten går langs ryggen — beltet frå 1100 til 1200 moh måler 14,8 grader — og så slakare til varden på 1299. Toppen er slak i alle retningar: ingen av dei åtte sveipa frå varden held meir enn 14,2 grader i snitt dei fyrste 800 metrane.",
    ],
    descent: [
      "Retur same vegen. Ryggen og platået fyrst — og det er her dagen skal planleggjast: i skodde eller snøfokk er det navigasjonen over det vide platået mellom Middagshola og kliva som er vanskegraden, for terrengformene å styre etter er få og like. Kliva ned frå 838 til 817 er det brattaste du køyrer.",
      "Frå varden er den brattaste sektoren sørvest, 37,5 grader i det brattaste 60 m-vindauget 690 til 750 meter ut — utanfor ruta, men verd å vite om i dårleg sikt. Elles er fallet frå toppen slakt: 5,5 grader i snitt mot søraust, 6,8 mot sør.",
      "Frå Mødal er det langrennsspora på Mødalsvegen tilbake til Furedalen — flatt nok til at det er staking og skøyting meir enn køyring, og dei siste hundre metrane kryssar du flata ved anlegget til parkeringa.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "ut.no seier at enkelte parti kan vere skredutsette, og målingane peikar på kliva: beltet frå 800 til 900 moh held 16,4 grader i snitt med det brattaste samanhengande partiet på 25,0 grader mellom 817 og 838 moh, og beltet frå 1100 til 1200 på ryggen 14,8. Resten av lina er slakare enn 10 grader i snitt i kvart belte. Terrenget er målt slakt, og det skal seiast slakt — men 17 km tur-retur er lang eksponering for vêrskifte, og fjellski med stålkant er kjeldas eiga tilråding.",
      },
      {
        title: "Platået",
        body: "Frå 900 moh og innover er dette vidt fjell med få former: beltet frå 900 til 1000 måler 4,7 grader over 1,3 km, og søkket kjelda kallar Middagshola er einaste tydelege haldepunktet før ryggen. I flatt lys og skodde er det her turen blir vanskeleg — ikkje i henga. Toppen sjølv er slak i alle åtte retningar; den brattaste sektoren, sørvest med 37,5 grader 690 til 750 meter ut, ligg utanfor ruta.",
      },
      {
        title: "Før du går",
        body: "Tveitakvitingen ligg i varslingsregionen Voss, ein A-region med dagleg skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar til april er ut.nos eiga. Ta med sender/mottakar, søkjestong og spade, og rekne turen som ein heildagstur: 17 km tur-retur med 995 høgdemeter. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L25,194 L44,191 L69,187 L94,178 L119,177 L138,176 L164,171 L187,166 L208,161 L230,158 L252,154 L274,146 L296,133 L321,119 L343,102 L369,94 L384,88 L406,77 L425,74 L448,81 L473,76 L497,67 L517,56 L542,37 L565,24 L589,21 L600,18",
      startLabel: "382 moh",
      endLabel: "1299 moh",
      distanceLabel: "8,6 km",
      caption: "995 høgdemeter og 8,56 km éin veg frå Furedalen, med det brattaste — 25,0 grader mellom 817 og 838 moh — i kliva kjelda kallar Stoveveggen.",
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
      "Løypa fortsetter nordover til den deler seg rundt 1282 moh, og grenen som dreier østover går opp på Gråfjell. Bandet fra 1300 til 1400 moh er det bratteste, 10,0 grader over 585 meter grunn, og det siste bandet, over 1400 moh, måler 6,4 grader. Varden står på 1466 moh, 4,5 km nordvest for Høgevarde.",
    ],
    descent: [
      "Ned samme vegen — men ikke sørover fra varden. Ruta kommer inn på toppen fra nordvest, så den første kilometeren ned går tilbake dit løypa delte seg på 1282 moh, og først derfra svinger du sørover mot Donkelitjenn. Toppen er rund og flat, og det er verdt å vite hvor rund: radialmålinger fra varden gir 5,2 til 18,3 grader i snitt over 500 meter i alle åtte retninger, og det bratteste 60-metersvinduet på hele fjellet måler 30,2 grader.",
      "Det er derfor Gråfjell er en navigasjonstur og ikke en skredtur. Går du feil ned fra et rundt topplatå i skodde, ender du ikke i en henging — du ender i feil dal, med fem kilometer myr og tjern mellom deg og bilen. Ta peiling på toppen mens du kan se, og hold løypa tilbake over Donkelitjenn.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slakt høyfjell hele vegen. Bratteste sammenhengende parti måler 22,9 grader, mellom 1283 og 1302 moh, og bratteste hundremeteren, 1300 til 1400 moh, holder 10,0 grader over 585 meter grunn. Tre av punktene Kartverket sampler langs linja er innsjø: Istjenn på 950 moh og Donkelitjenn på 1152 og 1156. Vinterstid er de flate sletter, og de er en del av ruta — men de er is, og isen er ikke terrengmodellens ansvar.",
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
      "838 høgdemeter frå Byrkjenes, og ein tur som blir slakare dess høgare du kjem: bratt skogsli nedst, open og jamn rygg over. Toppkuppelen er lettvint å gå — men han ligg eit par hundre meter over stupa mot vest og nordvest, og ein halv kilometer over dei mot nord, og i flatt lys er kanten ikkje synleg.",
    ascent: [
      "Frå parkeringa ved Byrkjenes, 211 moh, innerst på Tordalsvegen nord for Strandebarm, går du opp den bratte skogkledde lia mot Fadnastølen, 498 moh. Dette er den brattaste delen av turen: brattaste hundremeteren ligg mellom 300 og 400 moh og måler 16,5 grader i snitt. Tordalsvegen er privat bomveg, og brøyting heilt fram til parkeringa er ikkje garantert — ring eller sjekk før du køyrer langt.",
      "Over stølen opnar terrenget seg, med skog i flekkar opp til rundt 577 moh. Ruta held nordaustover inn på den breie sørvestryggen ved 629 moh.",
      "Derfrå følgjer du ryggen samanhengande nordover — 791 moh, så skulderen på 977 moh. Heile den øvre delen ligg på 10 til 13 grader: det er slakare enn sørfallet like ved, som held 20,8 grader i snitt med eit 33,7-graders belte 580 til 640 meter ute frå toppen. Sørvestryggen måler 9,5 grader i snitt, og det er grunnen til at linja ligg der ho ligg.",
      "Dei siste hundre metrane svingar nordaustover opp den slake toppkuppelen til varden på 1046 moh. Brattaste samanhengande parti på heile linja måler 28,9 grader, og det ligg nede i skogslia.",
    ],
    descent: [
      "Ned same ryggen: sørover over skuldra på 977 moh og 791 moh, ned til 629 og vidare til Fadnastølen. Frå stølen og ned er det skogsli — bratt nok til å vera fin køyring, og bratt nok til å gå laus etter mildvêr og regn.",
      "Vanlegaste feil: å gå for langt vest eller nord frå varden. Nord, nordvest og vest fell 19 til 26 grader i snitt, men bryt av i 48 til 55 grader eit halvt kilometer ute frå varden, og toppkuppelen er så slak at du ikkje kjenner det på skia før kanten er der. I flatt lys er det den einaste reelle faren på turen.",
      "Den andre feilen er å ta sørfallet ned frå toppen i staden for sørvestryggen. Sør held 20,8 grader i snitt, men har eit belte på 33,7 grader 580 til 640 meter ute — det er ikkje same linja som ryggen, og det er ikkje der ruta går.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nedste halvdelen er bratt skogsli, rundt 19 grader i snitt frå parkeringa til Fadnastølen, medan heile den øvre ryggen ligg på 10 til 13 grader. Brattaste samanhengande parti på linja måler 28,9 grader. Den skogkledde lia over Byrkjenes er bratt nok til å gå laus etter mildvêr og regn — det er den delen av ruta som endrar seg med vêret, ikkje ryggen.",
      },
      {
        title: "Terrenget rundt",
        body: "Hald deg på sørvestryggen heilt opp. I snitt over dei fyrste 800 metrane frå varden fell nordsida 19 grader, nordvestsida 25 og vestsida 26 — men snittet skjuler kanten. Brattaste seksti meter måler 55 grader mot nord (520 til 580 meter ute), 55 mot nordvest (500 til 560) og 48 mot vest (620 til 680), og det er kanten som tel. Sørfallet held 20,8 grader i snitt, men med eit 33,7-graders belte 580 til 640 meter ute. Sørvestryggen sjølv måler 9,5 grader i snitt, og skilnaden mellom han og nabosidene er heile poenget med linjevalet på dette fjellet.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,194 L41,187 L58,180 L80,173 L96,163 L109,156 L140,146 L160,139 L179,135 L198,125 L218,117 L237,110 L256,106 L277,102 L295,95 L320,83 L352,75 L374,74 L397,65 L417,60 L437,54 L455,50 L481,45 L509,39 L526,33 L552,31 L577,25 L600,18",
      startLabel: "211 moh",
      endLabel: "1046 moh",
      distanceLabel: "4,2 km",
      caption: "838 høgdemeter og 4,25 km frå Byrkjenes, med det brattaste — 16,5 grader mellom 300 og 400 moh — nede i skogslia.",
    },
  },
  ranten: {
    slug: "ranten",
    intro:
      "532 høydemeter på 5,82 km fra Tempelseter til den taggete ryggen Th. Kittelsen malte som Soria Moria. Oppstigningen fra Raudmyra er slak — bratteste sammenhengende parti måler 19,6 grader — og sørsida ser slak ut de første hundre meterne fra varden. Så bryter den av i 47 til 60 grader, og det er den vegen den merkede stien går ned.",
    ascent: [
      "Start på parkeringa ved Tempelseter, 910 moh, og følg den T-merkede og blåmerkede ruta over fossen i retning Høgevarde. Skogen slipper taket ved 938 moh, og de neste tre kilometerne er nesten flate: 4,0 grader fra 900 til 1000 moh over 1301 meter grunn, 4,6 fra 1000 til 1100 over 1304 meter, og 3,3 fra 1200 til 1300 over 1666.",
      "Stikrysset på Raudmyra ligger på 1229 moh, og navnet er ikke tilfeldig: Kartverket klasser både punktet på 1216 og punktet på 1229 moh som myr. Her tar du av til venstre, mot Gråfjell, og forlater Høgevarde-løypa.",
      "Nå kommer turen. Bandet fra 1300 til 1400 moh måler 10,8 grader over 566 meter grunn — det er halve stigningen på en drøy halv kilometer — og mellom 1354 og 1370 moh ligger bratteste sammenhengende parti, 19,6 grader.",
      "Det siste bandet, over 1400 moh, måler 5,7 grader over 120 meter grunn, og der står varden på 1416 moh. Toppen er en smal, taggete rygg, og profilen som gjør fjellet lett å kjenne igjen nedenfra er den samme profilen som gjør at det ikke er mye plass på den.",
    ],
    descent: [
      "Den slake vegen ned er den du kom opp: østover mot Raudmyra, der flanken måler 13,3 grader i snitt over 500 meter. Nord, vest og nordvest er også slake — 10,4, 11,9 og 10,8 grader i snitt, med bratteste 60-metersvinduer på 19,6, 18,8 og 16,8 grader — men de fører deg vekk fra bilen.",
      "Den merkede stien går bratt sørover til Fetjenn på 990 moh, og som skilinje er det en helt annen tur enn oppstigningen — men den ser ikke slik ut fra toppen. Punktmålinger hver tretti meter rett sørover gir først en skulder: 1415,6, 1399,2, 1393,9 og 1395,5 moh, altså 28,6 grader det første steget og så noe som er flatt og til og med stiger litt. Der skulderen slutter, 120 meter ut, faller det 47,2 og 54,5 grader. På peiling 195, som er retningen til Fetjenn, er skulderen enda tydeligere — bakken stiger igjen på 90 meter — og bruddet måler 60,0 grader. Det er rennene randofolk.no mener når de kaller Ranten «en mer alpin topp med brattere nedkjøring» enn Høgevarde. Ta ikke bakken over bruddet som et mål på det som ligger under: kjør dem hvis dette er terreng du kjører til vanlig, og hvis varselet og snøen sier ja; ellers går du tilbake den vegen du kom.",
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
      "Over anlegget stiger det jevnt — 8,8 grader fra 1000 til 1100 moh og 7,8 fra 1100 til 1200 — og et sted der inne, mellom 1179 og 1195 moh, ligger bratteste sammenhengende parti på hele turen: 19,5 grader. Ingen av punktene Kartverket sampler langs ruta er klasset som skog. Du starter over skoggrensa og ser hvor du skal hele vegen, og det er en fordel helt til sikten forsvinner. Merk at det er den nedste delen som er oppkjørt. Linja følger løypenettet tett de første 1,2 kilometerne og de siste 1,5, men mellom 1,5 og 3,7 km ut går den sin egen veg over ryggen — verst 572 meter fra nærmeste kartlagte spor, ved 1283 moh. Det som er kartlagt der er umerkte langrennsløyper, ikke en merket toppruta, så det er ikke noe spor å følge over ryggen.",
      "Fra ryggen på rundt 1190 moh svinger ruta nordøstover mot hytta. Bandet fra 1200 til 1300 moh er det bratteste på turen, 11,8 grader over 496 meter grunn, og over det flater det ut igjen: 7,7 grader fra 1300 til 1400.",
      "DNT-hytta Høgevarde ligger på 1397 moh, og toppen 560 meter lenger nordøst, på 1461. Det siste bandet, over 1400 moh, måler 3,5 grader over 810 meter grunn — flatt, og samtidig den mest værutsatte delen av turen. Gamle Høgevarde turisthytte har kafé i vinterferiene og påsken, og skilt nederst i bakken sier om den er åpen. Merk at linja går over Høgevardtjenn på 1378 moh på veg mot toppen — 68 meter på Tempelseter-ruta, opptil 60 meter fra land, og 45 meter på Norefjellstua-ruta, opptil 20 meter fra land. Det er et lite tjern, naturlig og uregulert, og begge linjene skjærer et hjørne av det.",
    ],
    descent: [
      "Ned samme vegen, sørvestover. Det er den slake sida av fjellet, og målingene sier hvor slak: 7,1 grader i snitt mot vest og 8,6 mot sørvest over 500 meter, med bratteste 60-metersvindu på 25,6 og 23,8 grader. Den andre dokumenterte ruta, høyfjellsruta fra Norefjellstua over Norefjellsryggen, gir 826 høydemeter på 11,67 km og er en annen dag.",
      "Fristelsen er å ta av mot øst, mot Norefjell skisenter som er godt synlig fra varden. Det er ikke rett nedenfor: anlegget ligger 9,85 kilometer unna på peiling 148, altså sørøst. Å sette kursen dit fra toppen er å velge den bratteste sektoren på fjellet — øst måler 25 grader i snitt og bryter av i 41,5 grader 70 til 130 meter ut fra varden, nordøst gir 41,3, og sørøst, som er retningen mot anlegget, 51,2 grader i vinduet 420 til 480 meter ut. Toppryggen er ofte avblåst mens snøen ligger fin 200 meter lenger nede, og det er nettopp da linjevalget flyttes uten at noen bestemmer seg for det.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstaket og som regel oppkjørt løype i slakt terreng hele vegen. Bratteste sammenhengende parti måler 19,5 grader og ligger mellom 1179 og 1195 moh; bratteste hundremeteren, 1200 til 1300 moh, holder 11,8 grader over 496 meter grunn. Staking er ikke kvisting — ut.no minner om at løypa tidlig i sesongen ikke alltid er supplert med kvist, og over skoggrensa er det ingenting annet å navigere etter.",
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
      "1267 høgdemeter frå 90 moh — fjord til topp på 5,96 km, med Folgefonna rett framfor deg på ryggen. Brattaste samanhengande parti måler 25,4 grader, så det er lengda og ikkje hellinga som avgjer dagen.",
    ascent: [
      "Start der anleggsvegen tek av oppover frå Ænes, 90 moh; kyrkja som rutebeskrivinga nemner ligg på 41 moh nede ved fjorden. Dei fyrste hundre høgdemetrane går på 6,3 grader, og så tek vegen fatt: 11,3 grader frå 100 til 200 moh og 12,9 frå 200 til 300.",
      "Følg stien vidare mot Gygrastølvatnet på 492 moh. Bandet frå 400 til 500 moh er det slakaste på turen, 5,6 grader over 1035 meter grunn — det er flata rundt vatnet.",
      "Frå vatnet går du opp på sjølve ryggen og følgjer han. Skogen held til 590 moh; over det er alt ope. Stigninga er jamn og aukar gradvis: 16,8 grader frå 600 til 700 moh, 19,4 frå 800 til 900 og 19,8 frå 1000 til 1100, som er brattaste hundremeteren. Brattaste samanhengande parti måler 25,4 grader mellom 1042 og 1063 moh.",
      "Over 1300 moh legg ryggen seg nesten flat — 4,7 grader over 565 meter grunn — og fører fram til toppen på 1347 moh.",
    ],
    descent: [
      "Ned same ryggen, nordover mot Gygrastølvatnet og vidare ned anleggsvegen til Ænes. Nedste delen er skogskøyring, og ho er tung når snøen er blaut.",
      "Vanlegaste feil: å velje nordvestflanken fordi han er brattare og kortare. Han er eit dokumentert alternativ, men han er skredterreng, og han er ikkje den linja ruta går. Den andre er å tru at ein får med seg begge toppane: mellom dei krevst lett klatring og sikringsutstyr, og normalruta går til hovudtoppen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ein lang rygg med jamn stigning: brattaste hundremeteren, 1000 til 1100 moh, måler 19,8 grader, og brattaste samanhengande parti 25,4 grader mellom 1042 og 1063 moh. Ryggen er linja både opp og ned.",
      },
      {
        title: "Terrenget rundt",
        body: "Nordvestflanken er skredterreng og eit brattare alternativ for dei som vel det med opne auge. Mellom hovudtoppen og nabotoppen krevst lett klatring og sikringsutstyr — det er ikkje ein forlenging av skituren.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L28,195 L51,188 L73,180 L96,172 L123,163 L146,157 L173,151 L200,144 L224,142 L250,141 L282,136 L300,129 L327,118 L351,108 L370,100 L386,93 L404,83 L422,76 L437,70 L449,64 L467,54 L481,50 L501,39 L526,30 L549,24 L576,23 L595,19 L600,18",
      startLabel: "90 moh",
      endLabel: "1347 moh",
      distanceLabel: "6,0 km",
      caption: "1267 høgdemeter og 5,96 km frå Ænes over Gygrastølvatnet, med skoggrensa på 590 moh og ryggen over 1300 moh på 4,7 grader.",
    },
  },
  juklavasstinden: {
    slug: "juklavasstinden",
    intro:
      "1341 høgdemeter på 7,16 km frå Myrdalsvatnet — og 347 av dei blir gjevne frå seg undervegs. Ruta går opp på ryggen over Omnetjørnene, aust ned mot Møsetjørna og opp nordryggen til ein topp som ber skavl.",
    ascent: [
      "Start ved vegen ved Myrdalsvatnet, 367 moh, i Uskedalen. Følg vegen litt tilbake til ein traktorveg og følg denne til Nipelva kjem til syne. Skogen held til 668 moh.",
      "Følg elva oppover til ryggen over Omnatjørnane — registeret skriv dei slik, ikkje Omnetjørnene, og «over» er berre halve historia: linja går 269 meter rett over vatna på 1066 moh, opptil 100 meter frå land. Dei ligg på sjølve ryggen, og dei er naturlege. Det er her stigninga står: 18,4 grader frå 500 til 600 moh og 20,0 frå 600 til 700, med brattaste samanhengande parti på 30,8 grader mellom 995 og 1022 moh. Ryggen toppar seg på 1033 moh.",
      "Derfrå held ein austover mot Møsetjørnene med Juklavasstinden framfor seg. Terrenget fell til 755 moh ved vatnet — Fri Flyts 988 høgdemeter er toppen minus starten, medan den rutede linja samlar 1341 fordi ho må ned hit fyrst.",
      "Frå bollen går ein opp den nordlege ryggen til topps; det er den slakaste av dei dokumenterte linjene på fjellet — den vestlege renna ved sida av held 40 grader. Bandet frå 1100 til 1200 moh måler 20,5 grader, 1200 til 1300 moh 17,8 og 1300 til 1400 moh 21,5, med varden på 1361 moh.",
    ],
    descent: [
      "Ned nordryggen, over bollen ved Møsetjørna og attende over ryggen til Nipelva og Myrdalsvatnet. Fallretninga er nordvest, og turen har ei kneik att på veg heim — det er den same ryggen ein kom over.",
      "Vanlegaste feil: å ta den vestlege renna ned. Ho er 40 grader og eit eige val; nordryggen er den linja rutebeskrivinga peikar på. Den andre er toppskavlen — turen kan krevje stegjern og isøks, og skavlen er grunnen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "To stigningar med ei nedstigning imellom. Brattaste samanhengande parti måler 30,8 grader mellom 995 og 1022 moh, og bandet frå 1300 til 1400 moh 21,5 grader. Nordryggen er den slakaste av dei dokumenterte linjene — 20,5 grader mot 40 i den vestlege renna — og ho er den korridoren følgjer.",
      },
      {
        title: "Terrenget rundt",
        body: "Toppen ber skavl. Den vestlege nedkøyringa held 40 grader og er eit val for seg. Bollen mellom ryggen og nordryggen er der ein mistar høgd på veg opp — og der ein må hente henne inn att på veg heim, med det tidsbruket det gjev.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L27,194 L57,188 L84,180 L104,170 L119,156 L140,140 L159,124 L181,108 L201,95 L218,83 L238,71 L268,72 L301,70 L328,88 L355,106 L381,117 L407,129 L432,128 L450,126 L475,109 L494,94 L517,80 L532,70 L551,56 L566,43 L587,30 L600,18",
      startLabel: "367 moh",
      endLabel: "1361 moh",
      distanceLabel: "7,2 km",
      caption: "1341 høgdemeter og 7,16 km frå Myrdalsvatnet over ryggen på 1033 moh og Møsetjørna på 755, med nordryggen frå 865 moh til varden.",
    },
  },
  melderskin: {
    slug: "melderskin",
    intro:
      "Rosendalsalpenes klassiker — 1272 høydemeter fra gårdstunet på Kletta til varden, uten en meter tilbake underveis. En lang dag for den som vil ha hele fjellet fra bunnen av.",
    ascent: [
      "Fra parkeringen ved Kletta, 154 moh, følger du veien 300 meter før stien svinger opp mot Skarshaug. Første strekket går over innmark og videre inn i blandingsskogen; sporet er tydelig, og du stiger jevnt gjennom skogen til rundt 520 moh.",
      "Over tregrensa reiser lia seg. Mellom 600 og 700 moh holder den 22,6° i snitt over hundre høydemeter, og det bratteste hundremeterspennet på turen kommer like over: 23,9° mellom 800 og 900 moh, med 22,2° mellom 900 og 1000. Begge er noe du vil ha unnagjort tidlig på dagen. Toppen av bakken er Skarshaug, 806 moh, halvveis til Melderskin.",
      "Nordøstover flater det ut i Rindane, de små ryggene og søkkene du siger gjennom mot Holo. Holo er flata på 1211 moh; Kartverket klassifiserer den som myr, og det er det ene stedet på ruta der linja flater helt ut. Her svinger den nordøst før den vender tilbake østover — den svingen holder deg på hylla og utenfor den bratte sør- og sørvestsiden rett under toppen.",
      "Siste stigningen fra Holo til varden er 215 høydemeter på ni hundre meter: 13° i snitt, 25° der den er brattest. Øverst ligger skavlene langs toppkanten, og er snøen avblåst og hard, tar du på deg stegjern og har isøksa i hånda de siste meterne.",
    ],
    descent: [
      "Ned igjen følger du oppstigningen: vestover fra varden til Holo, så sørvest gjennom Rindane og over Skarshaug, og til slutt ned lia og gjennom skogen til Kletta.",
      "Vanligste feil: å slippe seg rett ned fra toppen i stedet for å gå tilbake til Holo først. Fallinja fra varden går sørover, og der stuper det — sørflanken snitter 44° over de tre første hundre metrene, med et bergband på 60° i de øverste sytti. Hold vestover til du står på hylla ved Holo, og gå ned oppstigningssporet derfra.",
      "Under Skarshaug møter du bakken mellom 600 og 700 moh igjen, nå vestvendt og med sol på seg fra midt på dagen. Kjør den mens snøen fortsatt bærer; senere blir den tung og våt helt ned i skogen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Den bratteste hundremeteren ligger mellom 800 og 900 moh og holder 23,9°; bratteste enkeltsteg på linja måler 30,6°, mellom 720 og 744 moh. Linja selv passerer aldri 30°, men den ligger i lia du må gjennom uansett, og lia er brattere enn sporet gjennom den. Ta den vurderingen nede ved skogkanten, mens det ikke koster deg noe å snu.",
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
      "1237 høgdemeter og 8,64 km frå Musland i Uskedalen — eit skikkeleg vestlandsfjell der turen er større enn tala: Fri Flyt kallar han vanskeleg, med skredutsett terreng, vanskeleg navigering og utglidingsfare som faremoment, og 35 grader på enklaste vegen. Sjølve lina måler snillare — brattaste hundremetersbeltet 21,1 grader mellom 300 og 400 moh, brattaste samanhengande parti 30,1 — men ho gjev att 185 høgdemeter undervegs, ber skia i stykke av skogen, og toppryggen har skavlar ut over Limomnen. Grad 3 på kortet er summen.",
    ascent: [
      "Køyr til Uskedalen og ta av mot Musland; parker ved fyrste garden — tunet ligg på 148 moh, og ver varsam med traktortrafikken, slik kjelda ber om. Traktorvegen held fram nordvestover, og den merkte stien tek til venstre inn i skogen — vegen og stinettet er kartlagde, og fyrste stykket ber du gjerne skia på godt opptrakka sti.",
      "Stien kryssar dalen — botnen les 140 til 183 moh — før flanken mot Såta tek til. Det er dalens pris: mesteparten av dei 185 attgjevne høgdemetrane ligg her og i bulkane på ryggen vidare. Skogen sluttar på 526 moh etter Kartverkets klassar, og flanken opp mot Såta held 507 og 625 på veg til knausen på 651.",
      "Frå Såta går du sør opp den bratte ryggen, slik kjelda seier — og ryggen leverer: 869, 1032, 1126 og 1184 moh i jamn, bratt stigning, med 29,3 grader som brattaste samanhengande parti på sjølve ryggen, mellom 765 og 788 moh — turens brattaste, 30,1 grader, ligg lenger nede, i flanken opp frå dalkryssinga mellom 312 og 330 moh. Dette er navigasjonsstrekket i skodde: ryggen er logisk i godt vêr og diffus i flatt lys.",
      "Toppen står på 1200 moh. Heile vegen langs toppryggen: hald avstand til austkanten — skavlane heng ut over Limomnen, botnen på 889 rett under, og nordaustflanken fell 55,5 grader på det brattaste berre 200–260 m frå varden.",
    ],
    descent: [
      "Normalvegen ned er ryggen attende mot Såta, der dei bratte sidene byr på nedkøyring — same linevalsdisiplin som opp, med skavlkanten mot Limomnen som den faste regelen: køyr vest for kammen.",
      "Frå Hjorteklett — kjeldas skrivemåte; registeret fører knausen som Hjortaklett (Ås, 59.91905/5.85858), 460 m nord for Såta — må skia vanlegvis berast eit stykke. Ved gode snøtilhøve nemner kjelda ei flott nedkøyring langs bekken aust for Såta; ho er variant, ikkje normalveg, og «ved gode snøforhold» er vilkåret som står ved.",
      "Så dalen attende: kryssinga kostar deg dei siste motbakkane heim til stien og traktorvegen ned til Musland. Utglidingsfaren kjelda nemner høyrer dette strekket til — bratt, tett vestlandsskog med hard snø er sitt eige faremoment.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fri Flyts faremoment er «skredutsatt terreng, vanskelig navigering og utglidningsfare», og alle tre er målbare på denne lina: flanken mot Såta og sørryggen held 21 til 30 grader med brattare sider tett på, ryggen er diffus i flatt lys, og skogstykka ber hard snø over bratt botn. 35-gradarane på enklaste vegen ligg i flankeval nær toppen — sporet kan leggjast slakare, og målinga viser at det går.",
      },
      {
        title: "Skavlane mot Limomnen",
        body: "Toppryggen ber skavlar ut over austsida, der Limomnen ligg 300 høgdemeter under. Nordaustflanken fell 55,5 grader på det brattaste 200–260 m frå varden og nordflanken 49,7 berre 100–160 m ut. Kanten er lengre ute enn han ser ut til i fokk — hald vest for kammen heile toppstrekket.",
      },
      {
        title: "Før du går",
        body: "Englafjell ligg i varslingsregionen Hordalandskysten, ein B-region utan dagleg skredvarsel — næraste A-region med dagleg varsel er Hardanger, aust for Folgefonna. Det er ein grunn til meir varsemd, ikkje mindre: vurderinga er di. Ingen kjelde publiserer sesongmånader; kortets jan–apr er lånt frå appens andre Hardanger-turar, og guiden seier det. Ta med sender/mottakar, søkjestong og spade. Ei tom varselside er ikkje det same som eit trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,194 L25,197 L53,198 L78,198 L100,191 L123,195 L152,198 L178,199 L200,199 L221,197 L246,180 L262,166 L278,151 L293,139 L316,124 L341,114 L367,108 L387,112 L407,109 L428,96 L447,81 L465,66 L484,55 L512,41 L534,38 L559,31 L584,21 L600,18",
      startLabel: "148 moh",
      endLabel: "1200 moh",
      distanceLabel: "8,6 km",
      caption: "1237 høgdemeter og 8,64 km frå Musland — over dalen, opp til Såta, og den bratte sørryggen med skavlar mot Limomnen.",
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
  "store-ble": {
    slug: "store-ble",
    intro:
      "672 høydemeter på 6,69 km fra Nordstulvatnet: nesten to kilometer flat skog, en kneik gjennom Langedalen der bandet fra 800 til 900 moh måler 11,2 grader, og et høyfjellsplatå over. Bratteste sammenhengende parti, 35,2 grader mellom 1228 og 1251 moh, ligger i toppanløpet — og det er den sida beskrivelsene sier du kan måtte klatre opp i lite snø.",
    ascent: [
      "Start på den store parkeringa ved Nordstulvatnet, 714 moh. Ruta går slakt oppover gjennom åpen skog og krysser elva som renner ut av Sønstevatn, 746 moh; randofolk.no beskriver ei bru der. Bandet fra 700 til 800 moh måler 2,9 grader over 1785 meter grunn — det er den flate innmarsjen, og den er lengre enn den ser ut på kartet.",
      "Så kommer stigningen. 11,2 grader fra 800 til 900 moh over 512 meter grunn, som er bratteste hundremeteren på turen, og 7,0 grader fra 900 til 1000. Skogen slipper taket ved 945 moh, og først på 952 moh er du i åpent terreng for godt. Det er her T-ruta deler seg: opp Langedalen, eller utsiktsløypa om Sigridsbu.",
      "Sigridsbu ligger på 1175 moh, og fra hytta flater det ut. Bandet fra 1100 til 1200 moh måler 3,1 grader over 1890 meter grunn — nesten to kilometer platå med vidåpen utsikt, og linja krysser et tjern på 1162 moh på vegen. Litt før det går linja også 45 meter over et tjern på 1177 moh, men bare 10 meter fra land — der skjærer den et hjørne. Begge tjerna er naturlige.",
      "Toppanløpet er det bratte. Mellom 1290 og 1314 moh måler bratteste sammenhengende parti 35,2 grader, og det er sørsida av toppen randofolk.no beskriver som å «karre deg opp» når snøen er tynn. Alternativet i beskrivelsen er å gå langs fjellet og opp fra nordsida, som måler 5,8 grader i snitt. Varden står på 1343 moh.",
    ],
    descent: [
      "To nedkjøringer er beskrevet, og de er ikke like. Samme veg tilbake går ned Langedalen og videre gjennom skogen mot Nordstulvatnet — randofolk.no skriver «vær oppmerksom på utløpssoner!» om akkurat den dalen, både på veg opp og på veg ned. Den andre går ned nordsida og østover mot Kongtjønn på 1225 moh, med et kort stykke til fots før det åpner seg.",
      "Sørøstflanken rett under toppen bryter av i 41,5 grader i 60-metersvinduet 60 til 120 meter ut, og vest gir 45,0 grader lenger nede. Nord og nordvest er de slake, 16,0 og 19,6 grader i bratteste vindu. Blefjell er kupert, og kupert betyr her at linjevalget teller mer enn hellinga du står i: det er utløpet under deg som bestemmer.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti måler 35,2 grader og ligger i toppanløpet, mellom 1228 og 1251 moh. Bratteste hundremeteren er 800 til 900 moh med 11,2 grader over 512 meter grunn — kneika opp mot skoggrensa. Resten av ruta er slak: 2,9 grader på innmarsjen og 3,1 grader over platået fra 1100 til 1200 moh.",
      },
      {
        title: "Terrenget utenfor",
        body: "Langedalen er stedet på dette fjellet der skred faktisk teller, og kilden sier det selv to ganger: utløpssoner, både i oppstigningen og i nedkjøringa. Rutas eget bratteste steg, 35,2 grader, ligger på sørsida snaut 500 meter fra varden; sørøstradialen ved sida av måler 41,5 grader i bratteste 60-metersvindu, 60 til 120 meter ut, og vestflanken 45,0 grader 430 til 490 meter ut. Nordsida er den slake vegen opp og ned. Over tregrensa er berget hardt og jordlaget tynt, og vinden pakker snøen deretter.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Telemark sør på varsom.no. Telemark sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L20,194 L40,189 L60,191 L85,190 L105,190 L129,186 L153,179 L173,164 L198,151 L219,137 L246,128 L270,120 L294,110 L319,96 L343,86 L363,80 L391,74 L411,63 L432,66 L448,66 L466,60 L485,59 L509,62 L532,55 L550,54 L567,37 L585,21 L600,18",
      startLabel: "714 moh",
      endLabel: "1343 moh",
      distanceLabel: "6,7 km",
      caption: "672 høydemeter og 6,69 km fra Nordstul, med skoggrensa på 945 moh, Sigridsbu på 1175 og bratteste hundremeteren mellom 800 og 900 moh.",
    },
  },
  surloytenuten: {
    slug: "surloytenuten",
    intro:
      "456 høydemeter på 6,10 km fra Nordstul, og den slakeste turen i denne delen av Blefjell: bratteste hundremeteren måler 5,3 grader. Ruta går nordover forbi toppen til Vassholet på 993 moh og kommer tilbake sørover langs Surløyterinden — det er derfor de siste kilometerne føles som en rygg og ikke som en bakke.",
    ascent: [
      "Fra nordenden av parkeringa ved Nordstul, 714 moh, går stien ned til høyre og over Esperåa på bru, 730 moh. Hold til høyre og følg den kloppelagte stien til setervollen Sudstul, 727 moh, der DNT-ruta mellom Selsli og Sigridsbu krysser.",
      "Rett før siste hytta på vollen tar du av til høyre på umerket, men godt synlig sti. Nå går det nordover og oppover gjennom skog og myr: bandet fra 700 til 800 moh måler 2,7 grader over 1841 meter grunn og 800 til 900 moh 4,2 grader over 1346. Skogen slipper taket ved 951 moh.",
      "Ved Vassholet, 993 moh, snur ruta. Herfra følger du det ytre høydedraget sørover langs Surløyterinden, 1085 moh, og bratteste sammenhengende parti på hele turen ligger i kneika opp dit: 24,9 grader mellom 994 og 1014 moh. I selve søkket går linja 45 meter over et tjern på 1068 moh, 10 meter fra land — et hjørnekutt, og tjernet er naturlig og uten navn i registeret.",
      "Ryggen sørover er nesten flat — bandet fra 1000 til 1100 moh måler 2,8 grader over 1697 meter grunn — og ender ved varden på 1097 moh. I nordvest ser du Tverrgrønuten, Blerinden og Bletoppen.",
    ],
    descent: [
      "Samme vegen tilbake er nordover langs ryggen først, og den er så slak som en rygg blir: 2,2 grader i snitt over 500 meter, med bratteste 60-metersvindu på 5,7 grader. Det er ikke en nedkjøring, det er en gåtur med ski på.",
      "Den andre returen i beskrivelsen er bratt nedstigning mot sør til DNT-stien, og den er nedkjøringa: sørflanken måler 13,5 grader i snitt over 500 meter med bratteste 60-metersvindu på 29,5 grader, 400 til 460 meter ut. Austsida gir 25,1 grader nærmere toppen. Blefjell har en sårbar villreinstamme, og ut.no ber uttrykkelig om at det tas hensyn — det er en god grunn til å holde seg til de to beskrevne linjene framfor å legge egne spor over platået.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slakt terreng nesten hele vegen. Bratteste hundremeteren, 900 til 1000 moh, måler 5,3 grader over 1216 meter grunn, og bratteste sammenhengende parti 24,9 grader mellom 994 og 1014 moh — kneika opp mot Vassholet. Ruta gir tilbake 73 høydemeter underveis, og de ligger i søkket ved Vassholet som beskrivelsen går gjennom.",
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
      path: "M0,200 L26,193 L40,193 L62,193 L87,196 L106,195 L123,193 L141,178 L159,170 L185,156 L208,148 L225,143 L247,138 L269,130 L287,117 L309,112 L332,107 L354,95 L377,85 L398,75 L419,69 L433,57 L455,35 L473,24 L492,29 L509,46 L531,38 L553,32 L575,24 L597,19 L600,18",
      startLabel: "714 moh",
      endLabel: "1097 moh",
      distanceLabel: "6,1 km",
      caption: "456 høydemeter og 6,10 km fra Nordstul om Sudstul og Vassholet, med skoggrensa på 951 moh og varden på 1097.",
    },
  },
  styggemann: {
    slug: "styggemann",
    intro:
      "549 høydemeter på 9,61 km fra Ravalsjø til Skrims høyeste topp, og de fleste av dem kommer til slutt: de første seks kilometerne holder under 2 grader i snitt per hundremeter. Toppen er den bratte delen — 15,1 grader fra 800 til 900 moh, og austsida rett under varden faller 48,5 grader.",
    ascent: [
      "Start på parkeringa ved Ravalsjø, 483 moh, og følg skilting og merking forbi Ormetangen, 476 moh, og opp lia øst for vatnet. Dette er skogsterreng med oppkjørte løyper, og de er det som gjør turen til en dagstur: bandet fra 400 til 500 moh måler 0,6 grader over 1848 meter grunn.",
      "Videre forbi Skrimsetra, 591 moh, og over Fugleleikskarva, 635 moh. Bandet fra 500 til 600 moh måler 1,8 grader over 3285 meter grunn og 600 til 700 moh 1,4 grader over 3826 — det er over sju kilometer skog og myr mellom 483 og 700 moh. Kartverket klasser punktet på 611 moh som dyrket mark — det er setervollen på Sørmyrseter, like før hytta.",
      "Fem steder går linja over is, 1541 av de 9608 meterne. Den lengste kommer med en gang: 630 meter tvers over Ravalsjø på 475 moh, forbi holmen Kjelen, før ruta tar opp lia øst for vatnet. Så Skrimsvannet på 575 moh to ganger, 191 og 270 meter, Urdstjerna på 594 moh på 225 og Stulstjernet på 602 moh på 225. Alle fem er naturlige vatn, ingen av dem regulert, og ingen kryssing går mer enn 99 meter fra land — dette er smale skogsvatn løypa går tvers over, og DNTs egen vinterkjede fra Ravalsjø går gjennom det samme terrenget. Men is er is: det er de eneste stedene på en ellers rolig løypetur der underlaget ikke er bakke, og tidlig og sent i sesongen er de verdt et blikk før du går ut på dem.",
      "Sørmyrseter ligger på 620 moh, og herfra oppgir DNT rundt 240 høydemeter opp til Styggemann. Nå begynner turen å stige på ordentlig: 14,6 grader fra 700 til 800 moh over 404 meter grunn, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Skogen slipper taket ved 700 moh, og på 820 moh er du i åpent terreng.",
      "Det siste bandet, 800 til 900 moh, er det bratteste: 15,1 grader over bare 244 meter grunn. Ut.no kaller oppstigningen «temmelig bratt». Rådet deres om å sette igjen sekken i stikrysset gjelder den andre adkomsten, fra Ivarsbu i øst, der krysset ligger vest på Jotefjell — 1,26 km sørøst for varden. Varden står på 871 moh, og Styggemannshytta ligger rett ved.",
    ],
    descent: [
      "Ned samme vegen, sørover og så vestover langs løypa. Peilinga fra varden til Sørmyrseter er 172 grader, og akkurat den radialen måler 29,1 grader i bratteste 60-metersvindu, 70 til 130 meter ut, med et steg på 35,1 grader mellom 120 og 150 meter. Noen få grader til hver side endrer tallet mye: 165 grader gir 36,8 og 180 gir 25,1. Fallinja til setra er altså ikke det mildeste valget, og driver du vestover fra den blir det brattere, ikke slakere.",
      "De andre sidene av toppen er ikke det. Aust måler 48,5 grader i 60-metersvinduet 30 til 90 meter under varden, sørøst 45,3 grader 20 til 80 meter ut, og nordaust 43,9 grader. Det er innenfor hundre meter av der du står med kaffekoppen. Sørvest ser slakt ut med 9,0 grader i snitt, men har et 38,6 graders vindu 160 til 220 meter ut — det er den fella på dette fjellet som ikke ser ut som en felle.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Sju kilometer skogsterreng under 2 grader, og så en kilometer som stiger: 14,6 grader fra 700 til 800 moh og 15,1 fra 800 til 900, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Ruta gir tilbake 161 høydemeter over de rullende skogsryggene mellom Ravalsjø og Sørmyrseter. Ruta krysser dessuten 1541 meter is fordelt på fem vatn mellom 475 og 602 moh — ikke skredterreng, men heller ikke bakke.",
      },
      {
        title: "Terrenget utenfor",
        body: "Toppen er brattest der ingen har tenkt seg: aust 48,5 grader, sørøst 45,3 og nordaust 43,9 i bratteste 60-metersvindu, alle i vinduer som starter 20 til 40 meter ut fra varden. Ruta kommer fra sørsørøst: peiling 172 mot Sørmyrseter måler 29,1 grader i bratteste 60-metersvindu, og rett sør, 180 grader, 25,1 grader i vinduet 130 til 190 meter ut. Skrim ligger lavt nok til at snøen kommer og går — ut.no fører skisesongen som januar til mars — og de oppkjørte løypene mellom Ravalsjø og Sørmyrseter er det som gjør turen gjennomførbar på en dag.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,195 L23,196 L42,199 L68,199 L90,197 L113,188 L138,166 L158,164 L183,157 L203,155 L225,153 L245,147 L270,154 L292,145 L315,145 L337,130 L360,126 L379,126 L399,127 L423,130 L447,140 L467,137 L486,121 L509,106 L531,115 L551,112 L566,79 L582,54 L597,23 L600,18",
      startLabel: "483 moh",
      endLabel: "871 moh",
      distanceLabel: "9,6 km",
      caption: "549 høydemeter og 9,61 km fra Ravalsjø om Skrimsetra, Fugleleikskarva og Sørmyrseter, med skoggrensa på 700 moh og all stigningen over 700 moh.",
    },
  },
  saebyggjenuten: {
    slug: "saebyggjenuten",
    intro:
      "Agders høgaste — så vidt det er: fylkesgrensa kryssar sjølve toppen, og det registrerte toppunktet på 1506 moh ligg i Tokke i Telemark, ti meter aust for Agder-sida, som når 1504. Ein tur der talet som betyr noko er 11,31 km og ikkje 851 høgdemeter. Ingen sti, ingen merking, tre skar og eit vatn undervegs, og eit terreng så slakt at det brattaste 400-metersvindauget måler 13,7 grader. Det einaste bratte på fjellet vender nord, og du skal ikkje dit.",
    ascent: [
      "Frå parkeringa ved bommen innerst i Berdalen hyttegrend, 810 moh, går ruta austover. Peilinga frå parkeringa til toppen er 82 grader — Berdalen ligg vest for fjellet, og du går inn mot det heile dagen. Riksveg 9 mellom Bykle og Hovden er brøytt heile vinteren, og ut.no presiserer at du ikkje skal køyre den siste kilometeren etter bommen: «Veien er privat.» Den fyrste kilometeren deler trasé med oppkøyrde løyper i Berdalen; linja her er terrenglinja og ikkje løypa.",
      "Forbi Langemyr på 891 moh går det jamt oppover mot Tverrheiskaret på 1028 moh. Dette er den einaste stigninga på turen som kjennest som ei stigning: brattaste 30 meter måler 26,2 grader mellom 1000 og 1022 moh, 2350 meter ute, og brattaste 400 meter 13,7 grader frå 963 til 1062 moh. Skogen står høgt her: DTM1 gjev terrengklasse Skog i sjølve Tverrheiskaret på 1028 moh. Kor høgt han går på denne linja er ikkje målt punkt for punkt — Kartverket sitt punkt-API låg nede då dette vart kontrollert — så guiden seier det som er målt og ikkje meir.",
      "Over Tverrheii og Tverrheitjønnane held du aust til Tverrheiskardet på 1156 moh. Her er ei felle verdt å kjenne: SSR har tre skarpunkt på strekninga, og to av dei heiter Tverrheiskaret — det du gjekk over på 1028 moh, og eit til på 1091 moh som ligg berre 305 meter frå Tverrheiskardet på 1156. Det er det siste paret som er lett å blande, ikkje det fyrste. Bandet 1100 til 1200 moh måler 1,3 grader over 4455 meter grunn — det er over fire kilometer nesten flatt høgfjell, og det er her ein tur utan merking blir ein navigasjonsjobb.",
      "Frå Tverrheiskardet fell linja 47 meter over 535 meter grunn ned i Gjuvvatn-bassenget, og så 32 meter til, ned på Midtre Gjuvvatn. Der går ho 720 meter over vatnet på 1124 moh, høgst 55 meter frå land — den einaste iskryssinga på turen. Vatnet er naturleg: DTM1 gjev terrengklasse Innsjø, og OSM-relasjonen (name=Midtre Gjuvvatn, ele=1124, ref:nve:vann=13750) ber ingen reservoartaggar. Turskildringane går same vegen.",
      "Frå austenden av vatnet på 1137 moh stig ruta jamt austover forbi vegpunktet på 1225 moh — det ligg på fast mark like vest for det nedste av dei to små vatna, ikkje på vatnet sjølv — og siste kilometeren går opp vestflanken. Bandet 1400 til 1500 moh måler 11,9 grader over 499 meter grunn, det brattaste på heile turen. Dei siste 500 metrane går på peiling 78 grader og stig 115 meter til toppen på 1506 moh. ut.no fører 1507; DTM1 gjev 1506,49 på det registrerte punktet, og ein halv meter er ikkje ei usemje verdt namnet.",
    ],
    descent: [
      "Ned same veg, og ned vestsida. Fallvekta gjennomsnittsretning er 258 grader, altså vest-sørvest, som er den flanken du kom opp. Sveipet frå toppen gjev 9,8 grader i snitt vestover og 9,2 sørvestover ut til 1000 meter — det er slakt nok til at nedkøyringa mest er transport, men òg slakt nok til at du ikkje treng leite etter noko betre.",
      "Og det er poenget. Den einaste bratte sida på Sæbyggjenuten er nordsida, og ho er skavlkanta: 15,0 grader i snitt nordover mot 9,8 vestover, med eit brattaste 60-metersvindauge på 41,9 grader 460 til 520 meter ute, 42,3 grader nordaustover og 46,1 grader på peiling 10 grader. Skavlen står på dei siste høgdemetrane, og i flatt lys ligg kanten der utan at terrenget varslar. Kom opp vestsida og gå ned vestsida.",
      "Den andre feilen er lengda. Elleve kilometer inn — 11,31 km måler linja — med over fire kilometer flatt høgfjell mellom 1100 og 1200 moh, betyr at vêrvindauget og ikkje hellinga styrer turen. Merking finst ikkje; sti finst så vidt. ut.no skriv «Gå stien inn til Langemyr», og OSM har éin umerkt traktorveg på den fyrste strekninga — etter det er det terreng. Snur du på Gjuvvatn, har du sju kilometer att til bilen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja har lite skredterreng i seg. Brattaste 30-meterssteg er 26,2 grader i oppgangen til Tverrheiskaret, brattaste 60 meter 19,6 grader, brattaste 200 meter 16,1 og brattaste 400 meter 13,7. Det brattaste heile høgdebandet, 1400 til 1500 moh, måler 11,9 grader over 499 meter grunn. Det som kan gå gale på sjølve linja er isen på Midtre Gjuvvatn seint i sesongen, og at 720 meter er langt å vere ute på han.",
      },
      {
        title: "Terrenget rundt",
        body: "Vest, sørvest, sør og søraust ligg alle mellom 6,5 og 9,2 grader i snitt ut til 1000 meter frå toppen. Nord og nordaust gjer ikkje det: 15,0 og 14,3 grader i snitt, med brattaste 60-metersvindauge på 41,9 og 42,3 grader, og 46,1 grader på peiling 10 grader 430 til 490 meter ute. Skavlen på nordkanten er dokumentert på dei siste høgdemetrane. Toppen er ei enkel, slak kuppel frå tre kantar og noko heilt anna frå den fjerde.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Kortet seier Setesdal, og det er dalen du startar i — parkeringa i Berdalen ligg i Bykle i Agder — men toppunktet ligg i Tokke i Telemark, så Varsom-regionen stemmer nøyaktig med koordinaten. Søkjer du på Setesdal, finn du ingenting. Ta med sendar/mottakar, søkjestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,189 L46,179 L70,179 L91,175 L117,158 L139,134 L158,133 L180,137 L201,132 L225,127 L248,107 L270,108 L297,107 L316,104 L343,97 L366,109 L387,115 L409,118 L431,117 L452,106 L471,98 L495,92 L519,76 L545,55 L564,50 L585,35 L600,18",
      startLabel: "810 moh",
      endLabel: "1506 moh",
      distanceLabel: "11,3 km",
      caption: "851 høgdemeter og 11,31 km frå Berdalen over Tverrheiskara og Midtre Gjuvvatn, der alt bratt vender nord og ruta held seg vest.",
    },
  },
  kjerag: {
    slug: "kjerag",
    intro:
      "Ein topp som ikkje er ein topp. Kjerag er eit platå, og toppunktet er ein flekk på det: 200 meter sør for det ligg bakken 1,5 meter høgare, og linja går sjølv over 1129 moh før ho gjev frå seg 66 høgdemeter og stig tilbake til 1124. 620 høgdemeter og 7,36 km, og det einaste som er alvorleg på turen ligg to kilometer unna og har ingenting med hellinga å gjere.",
    ascent: [
      "Frå parkeringa på Øygardstøl, 641 moh, følgjer du Lysevegen sørover. Vegen er vinterstengd — OSM har motor_vehicle:conditional=no @ Nov-May og snowplowing=no på fylkesveg 4224, og Sirdal kommune stadfestar det — så dette er ein vårtur og ikkje ein vintertur. Linja her ligg aldri meir enn 100 meter frå kartlagd veg, men ho kuttar hårnålssvingane: det brattaste 30-meterssteget på heile ruta, 24,4 grader mellom 673 og 687 moh, ligg 86 meter frå vegbanen og er ein sving og ikkje ei stigning.",
      "Ved Stølsdalen bru på 850 moh tek anleggsvegen mot Langavatn av, og du følgjer Langvassvegen sørvestover. På 925 moh går linja 225 meter over eit umerkt vatn like ved vegen, høgst 24 meter frå land. Terrengklassen i DTM1 er Innsjø og ikkje InnsjøRegulert, og OSM-polygonet (way 1312542069, ref:nve:vann 195944) ber ingen reservoartaggar — det er eit naturleg vatn, ikkje eit magasin. Vegen er den eigentlege ferdselslinja her; vatnet ligg der linja skjer svingen.",
      "På 944 moh forlèt du vegen og held vest inn på Kjeragplatået. Peilinga frå vegpunktet til toppunktet er 265 grader — rett vest. (Korridorforskinga oppgav 271; ho målte mot eit toppunkt som ligg 338 meter frå det registrerte.) Turskildringane skriv «mot nordvest», og nordvest derfrå fører til Kjeragbolten, som ligg 1921 meter frå toppunktet på peiling 10 grader. Det er eit anna mål og ei anna rute — og varden turskildringane snakkar om står oppe ved bolten, ikkje der linja endar; ut.no skriv at «Kjeragbolten ligger ca. 300 meter sør for varden».",
      "Over platået er det slakt heile vegen: bandet 900 til 1000 moh måler 4,2 grader i snitt over 1441 meter grunn, bandet 1000 til 1100 moh 2,3 grader over 2746 meter. Linja går tvers over fire vatn til: 45 meter på 975 moh, 45 meter på 1064 moh, 686 meter på 1075 moh med høgst 32 meter til land, og 90 meter på 1080 moh. Alle er naturlege. Til saman går ruta 1091 av 7362 meter på vatn. Det som gjer platået krevjande er ikkje hellinga, men at det er svaberg utan merking, med korte brå kantar mellom slake parti — det brattaste 60-metersvindauget rett vest for toppunktet måler 38,1 grader og ligg berre 90 meter ute.",
      "Siste etappe kjem inn frå aust over litt høgare mark. Linja toppar på 1129 moh 6640 meter ute, fell 66 meter til 1063, og stig så 21,2 grader over 60 meter frå 1077 til 1112 moh — det brattaste samanhengande partiet på turen — før dei siste 500 metrane går på peiling 294 grader og stig 59 meter til toppunktet på 1124 moh. Høgste mark på heile platået er 1163,7 moh og ligg 1347 meter aust-nordaust; toppunktet her er det registrerte Kjerag-punktet, ikkje det høgaste.",
    ],
    descent: [
      "Same veg tilbake. Fallvekta gjennomsnittsretning for nedkøyringa er 49 grader, altså nordaust, og med berre 620 høgdemeter fordelte over 7,4 kilometer er dette meir transport enn nedkøyring. Det gode partiet er dei to kilometrane ned Langvassvegen og Lysevegen, som er brei og jamn så lenge det ligg snø på han.",
      "Vanlegaste feil på platået: å gå nordover for å sjå ned i Lysefjorden. Rett nord frå toppunktet held platået seg på 1008 til 1016 moh heilt ut til 1850 meter — det er flatt, det ser ut som meir platå, og du merkar ingenting. Så fell terrenget 71,4 grader over dei neste femti metrane og 77,4 grader over dei femti etter det, og på 2000 meter ute er bakken under 800 moh. Sjøen ligg 2,6 kilometer nord. Den teikna linja kjem aldri nærare enn 1675 meter frå bakke under 800 moh, og det næraste punktet er sjølve toppunktet. Kanten kjem utan varsel i tåke og flatt lys, og det er den eine feilen som ikkje går an å rette opp.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skredterreng i vanleg meining finst nesten ikkje på denne linja. Brattaste 30-meterssteg er 24,4 grader og ligg på ein vegsving på 673 moh; brattaste 60 meter er 21,2 grader mellom 1077 og 1112 moh; brattaste 100 meter er 19,5 grader og brattaste 400 meter 11,3 grader. Ingen av dei sju høgdebanda over 700 moh måler meir enn 5,8 grader i snitt. Det som faktisk kan gå gale her er å tråkke gjennom is på eit av dei fem vatna seint i sesongen, og å bomme på kanten mot nord.",
      },
      {
        title: "Terrenget rundt",
        body: "Frå toppunktet ligg sju av åtte retningar under 13 grader i snitt innanfor 200 meter, og sør måler minus 0,4 grader. Lenger ut skil to seg ut: vest fell 38,1 grader i det brattaste 60-metersvindauget alt 90 meter frå toppunktet, og sørvest 54,8 grader 800 meter ute. Begge er korte skrentar i svaberget, ikkje samlefelt — men i flatt lys ser dei ut som resten av platået heilt til du står på dei. Nordsida er noko anna: det er ei vegg på over tusen meter ned i Lysefjorden, og ho byrjar 1850 meter nord for toppunktet utan at terrenget varslar.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Heiane på varsom.no. Ta med sendar/mottakar, søkjestang og spade. Sjekk òg om Lysevegen er open. ut.no seier det slik: «Rv500 mellom Sirdal og Lysebotn stenges når første snøfall kommer i okt/nov og åpner ikke før mai/juni.» Utan open veg er det ingen tur.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L22,193 L41,171 L59,165 L83,157 L103,150 L125,135 L147,125 L167,117 L188,109 L213,95 L235,94 L257,89 L279,84 L298,72 L321,58 L345,41 L367,36 L390,36 L411,33 L433,38 L459,38 L481,34 L499,36 L521,24 L543,22 L569,37 L585,22 L600,20",
      startLabel: "641 moh",
      endLabel: "1124 moh",
      distanceLabel: "7,4 km",
      caption: "620 høgdemeter og 7,4 km over Kjeragplatået, der brattaste 30 meter er 24,4 grader på ein vegsving og det farlege ligg 1850 meter nord for toppunktet.",
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
