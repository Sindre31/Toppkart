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
      "Start ved Sandneset, der Galtelva renner ut i fjorden på 14 moh. Det finnes ingen opparbeidet parkering her — du står i veikanten på Fv7922, Lenangsveien, rett ved elveosen. Herfra går du rett inn i Galtdalen nord for Lassofjellet og holder sørsiden av elva, det vil si høyre side på vei opp. Bjørkeskogen slipper taket allerede rundt 70 moh; resten av turen er åpent terreng.",
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
  tromsdalstinden: {
    slug: "tromsdalstinden",
    intro:
      "Tromsøs signaturtopp, og 1209 høydemeter i strekk fra skytebanen i Tromsdalen til varden. Sporet holder seg under 27 grader hele veien — det er lengden, ikke bratthet, som gjør turen.",
    ascent: [
      "Fra parkeringen ved skytebanen innerst i Turistvegen følger du skogsbilvegen sørøstover inn i Tromsdalen. Hold vestsida av Tromsdalselva hele veien; bjørka slipper taket allerede rundt 220 moh, og derfra ligger dalen åpen foran deg. Sommerruta tar NNV-ryggen ut av dalen lenger nede — det er gåruta, ikke skiruta.",
      "Innerst flater dalen ut ved Dalbotnvatnet på 311 moh. Rett før botnen reiser Svarthammaren seg på vestsida — et nordvendt stup som taper nær 100 høydemeter på seksti meter. Hold dalbunnen øst for det og styr mot skaret. Bakken opp til Salen på 740 moh er turens største lastflate: sporet legger seg på skrå over den og holder 12 til 13 grader, mens fallinja måler 30 til 35 om du tar den rett på.",
      "Fra Salen slakner det av. Følg sørryggen nordøstover mot varden. Beltet mellom 1000 og 1100 moh er det bratteste på selve ryggen, 19,2 grader i snitt, og turens bratteste enkeltparti ligger her: 26,9 grader mellom 1063 og 1081 moh. Over 1100 moh er østkanten av ryggen skavlet — gå på vestsida av kammen, også når sporet frister lenger ut.",
    ],
    descent: [
      "Ned samme vei: sørryggen til Salen, så vestover ned i indre Tromsdalen og ut dalen til bilen. Fra Salen faller flanken jevnt vestover mot Dalbotnvatnet, og det er der de beste svingene ligger.",
      "Vanligste feil: å slippe seg rett ned vestsida fra toppen. Fra varden ruller vestflanken av på 20 til 35 grader, og det er hele problemet — den ser gåbar ut oppe. Under rundt 1080 moh er du på Fronten: hundre høydemeter med 45 til 58 grader, og ingen vei ut til sida. Hold ryggen sørover til Salen før du legger deg over mot vest.",
      "De siste kilometerne er skogsbilveg. Fallet er slakt — under fem grader hele veien ut — så regn med å stake.",
    ],
    avalanche: [
      {
        title: "Selve ruta",
        body: "Sporet passerer 25 grader ett sted, mellom 1063 og 1081 moh på sørryggen, der det måler 26,9; beltet 1000 til 1100 moh holder 19,2 grader i snitt. Bakken opp til Salen er partiet du må lese. Den vender vest og nordvest, og fallinja måler 30 til 35 grader i snitt med parti over 40: sporet legger seg på skrå over den, men snøen bryr seg ikke om sporet. Det er en lastflate i østlig og sørøstlig vind, ikke i vestlig. Over 1100 moh er østkanten av ryggen skavlet hele veien til varden.",
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
      path: "M0,199 L27,199 L53,198 L79,197 L102,195 L122,192 L151,186 L181,179 L204,176 L223,173 L250,167 L269,160 L289,157 L315,154 L335,144 L361,135 L381,123 L397,113 L417,103 L435,94 L453,89 L476,75 L499,61 L519,47 L538,34 L562,25 L584,20 L600,18",
      startLabel: "38 moh",
      endLabel: "1238 moh",
      distanceLabel: "8,2 km",
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
      path: "M0,200 L30,192 L49,185 L69,179 L91,174 L109,166 L128,158 L153,156 L173,155 L191,152 L207,147 L229,137 L252,127 L273,118 L296,113 L316,108 L336,101 L362,99 L380,97 L398,98 L420,101 L441,101 L464,91 L484,81 L498,77 L518,67 L536,55 L550,48 L568,35 L587,24 L600,18",
      startLabel: "62 moh",
      endLabel: "1030 moh",
      distanceLabel: "5,5 km",
      caption: "Fra 62 moh ved Eidebakken til 1030 på toppen — 1008 høydemeter på 5,5 kilometer, med et søkk ved Rørneshytta.",
    },
  },
  hamperokken: {
    slug: "hamperokken",
    intro:
      "En middels skitur med en eksperts avslutning. 1390 høydemeter fra Fv91 opp en bred nordvestrygg som aldri blir brattere enn 26 grader — og så 1,7 kilometer eksponert rygg til fots fra Middagsaksla, med stegjern, isøks og et siste trinn som lokalt måler over 45 grader.",
    ascent: [
      "Fra parkeringa ved Fv91 nedenfor Vartavarhaugen, 65 moh, går ruta østover over Vartavarhaugen på 159 moh og krysser Tverrelva. Bjørka slipper taket rundt 424 moh, og over 542 moh er terrenget åpent hele veien.",
      "Derfra følger skisporet den brede nordvestryggen sammenhengende oppover. Terrengmodellen gir jevne 16 til 26 grader fra rundt 350 moh til Middagsaksla, uten bratte trinn: bandene mellom 500 og 1000 moh ligger alle på 19 til 21 grader i snitt. Det er en lang, jevn skitur, og den er lite skredutsatt så lenge du blir på ryggen. Flankene på begge sider er noe annet, og de er terrengfeller i dårlig sikt.",
      "På Middagsaksla, 1076 moh, stopper skituren. Mange setter fra seg skiene her; noen bærer dem til forvarden på rundt 1190 moh og lar dem ligge der. Turrapportene fra vinterbestigninger er samstemte om at ryggen videre går til fots — «over ca. 1100 moh måtte skiene byttes mot stegjern og isøks».",
      "De siste 1,7 kilometerne er eksponert nordvestrygg. Ryggkammen bølger seg oppover fra 1076 til 1393 moh med korte motfall underveis — 47 høydemeter til sammen over Middagsaksla, og ingen av dem mer enn ti om gangen på linja. Det er luftige parti, korte klyvepartier, og helt til slutt ei renne og en bratt topppyramide: den bratteste hundremeteren på hele turen ligger mellom 1300 og 1400 moh og måler 23,7 grader i snitt, mens det bratteste sammenhengende partiet er 36 grader og siste trinn lokalt er over 45.",
    ],
    descent: [
      "Ryggen tilbake til fots til Middagsaksla, og derfra ned nordvestryggen på ski til Vartavarhaugen og bilen. Fallretningen ned ryggen er målt til nordvest, 293 grader, og hellinga er 16 til 26 grader hele veien — jevn, oversiktlig kjøring uten trange partier.",
      "Vanligste feil: å behandle Middagsaksla som en pause i stedet for et vedtak. Er ryggen isete, eller er sikta dårlig, er det her turen slutter — skituren er uansett over, og det som ligger foran er 1,4 kilometer der en glipp ikke har noen utgang til sida. Å snu på Middagsaksla er ikke en avbrutt tur; det er en fullverdig tur i seg selv, og den riktige når ryggen er isete.",
      "Den andre feilen er å slippe seg ned en av flankene fra ryggen for å korte inn. Begge sider av nordvestryggen er bratte og samler snø; ryggen selv er linja, både opp og ned.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Skituren opp nordvestryggen er lite skredutsatt: 16 til 26 grader jevnt fra rundt 350 moh til Middagsaksla, uten bratte trinn. Flankene på begge sider av ryggen er derimot bratte, og de er terrengfeller — i dårlig sikt er det å holde ryggen selve navigasjonsoppgaven. Over Middagsaksla er det ikke lenger skiterreng: bratteste sammenhengende parti måler 36 grader, siste trinn lokalt over 45, og bratteste hundremeter, 1300 til 1400 moh, 23,7 grader i snitt.",
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
      path: "M0,200 L30,192 L55,186 L85,188 L110,183 L132,176 L159,168 L184,158 L206,151 L224,144 L244,135 L259,128 L276,121 L294,112 L319,101 L343,90 L364,82 L376,76 L399,67 L417,62 L444,60 L471,55 L491,51 L518,49 L540,41 L558,38 L582,29 L598,22 L600,18",
      startLabel: "65 moh",
      endLabel: "1397 moh",
      distanceLabel: "5,4 km",
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
      "Videre følger du ryggen sørover, på eller like øst for kammen. Mellom 900 og 950 moh reiser østsida seg i partier over 30 grader, og bratteste enkeltsteget på linja måler 34. Vestsida er ikke et alternativ: der faller det 40 til 80 høydemeter per hundre meter rett ned mot Gjerdelva.",
      "Toppryggen smalner inn de siste hundre meterne, og rundt nitti meter før varden tar et grunt skar tilbake et par høydemeter. Her henger skavlene ut mot øst, over Østrenna: kammen faller 30 til 41 grader på østsida og 21 til 31 på vestsida. Skift side i god tid og gå det siste stykket vest for skavlekanten, fram til varden på 1289.",
    ],
    descent: [
      "Den store renneformasjonen rett nord for toppen er nedkjøringen. Den heter Østrenna og ligger øst for kammen. De øverste to hundre metrene måler 33 til 42 grader, 37 i snitt, og renna er vid nok til nesten å være en flanke — den ligger i le, fylles av fokksnø mens det blåser på toppryggen, og har som regel den beste snøen på fjellet. Vel nede skrår du nordover tilbake på oppstigningsruta.",
      "Vanligste feil: å ta sats utfor skavlen rett fra toppen, og sent på dagen. Den store skavlen over renna slipper i vårsola nesten hvert år, og løsner den, går den i renna du står i. Renna vender øst og får sola først av alt her oppe, så kjør tidlig — og gå inn gjennom det grunne skaret nitti meter nord for varden. Det er det naturlige innsteget, den samme renna du kommer bort i like før toppen.",
      "Vil du ikke inn i renna, kjører du ned nordøstryggen du kom opp. Den er brattest mellom 900 og 800 moh, 24,9 grader i snitt, og er ofte avblåst; regn med hard snø der ryggen er smalest.",
    ],
    avalanche: [
      {
        title: "Ruta opp",
        body: "Nordøstryggen er det slakeste av de dokumenterte linjevalgene på fjellet, men flat er den ikke. Østsida under kammen går i partier over 30 grader mellom 900 og 950 moh, bratteste hundremeteren på selve linja ligger mellom 800 og 900 moh på 24,9 grader i snitt, og bratteste steget måler 30,3. Ryggen er ofte avblåst hele veien opp — det gir hard snø på kammen og fokksnø i lesidene rett ved siden av.",
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
      path: "M0,200 L30,195 L59,185 L83,181 L108,181 L137,178 L161,169 L190,163 L210,159 L239,149 L263,140 L281,132 L305,123 L327,116 L351,110 L380,110 L400,107 L424,95 L443,84 L463,73 L482,62 L499,54 L515,46 L531,36 L550,28 L575,25 L595,20 L600,18",
      startLabel: "62 moh",
      endLabel: "1289 moh",
      distanceLabel: "5,5 km",
      caption: "1252 høydemeter fra Eidebakken til varden; bratteste hundremeteren ligger mellom 800 og 900 moh, 24,9 grader i snitt.",
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
      "Start på grusparkeringa ved Medfjordbotnvatnan langs Fv862, 102 moh. Følg Keipelva nordover i jevnt stigende terreng til rundt 225 moh. Skogen slipper taket ved 250 moh, og over 333 er du i åpent terreng resten av turen.",
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
      "Senjas høyeste, 1031 høydemeter fra rasteplassen ved fjorden. Skituren slutter på skulderen 763 moh; de siste 244 høydemeterne er eksponert klyving på sørvestryggen, og det er den avslutningen som gir turen grad 4.",
    ascent: [
      "Start på rasteplassen i Svarthola langs Fv862, 30 moh, knappe seks kilometer øst for Senjahopen. De første to hundre høydemeterne går rett opp til nordenden av Svartholvatnet på 207 moh, og derfra østover over ryggen mellom vatnet og Breitindvatnet — et parti på rundt 400 moh der linja legger seg flatt før den stiger igjen.",
      "Fra nordøstsida av Breitindvatnet på 481 moh begynner vestflanken. Nederst er den slak — rundt 24 grader opp til 550 moh og 29 videre til 620 — men over det bratner den: 36 grader i snitt mellom 620 og 680 moh, 41 mellom 680 og 720, og rett under skulderen måler fallinja 50 til 59 grader. Sommerbeskrivelsen kaller det samme partiet smale og utsatte berghyller, og vatnet ligger under hele henget. Den bratteste hundremeteren på ruta ligger mellom 600 og 700 moh og måler 23,4 grader i snitt; bratteste sammenhengende parti på linja er 37,8 grader, og det ligger i toppblokka.",
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
        body: "Vestflanken opp fra Breitindvatnet er 24 til 29 grader nederst, 36 til 41 grader over 620 moh, og fallinja rett under skulderen måler 50 til 59 — med vatnet som terrengfelle under hele henget — det er turens skredterreng, og du må gjennom det både opp og ned. Bratteste hundremeter på linja, 600 til 700 moh, måler 23,4 grader i snitt. Over skulderen går ruta over i klyving: eggen måler 54 grader i det bratteste hundremetersvinduet, og 763 moh til toppen er 44,4 grader over 249 meter.",
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
      path: "M0,200 L26,190 L48,180 L63,172 L84,167 L103,166 L126,167 L154,158 L186,144 L212,137 L244,129 L269,132 L289,124 L314,119 L346,117 L378,117 L393,110 L419,101 L448,90 L462,84 L476,74 L498,63 L513,56 L540,48 L563,36 L577,28 L596,23 L600,18",
      startLabel: "30 moh",
      endLabel: "1007 moh",
      distanceLabel: "4,2 km",
      caption: "1031 høydemeter og 4,21 km fra Svarthola; skiene blir igjen på skulderen 763 moh, 244 høydemeter under toppen.",
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
        body: "Linja som er tegnet holder seg under 30 grader hele veien. Bratteste hundremeteren ligger mellom 500 og 600 moh med 18,8 grader i snitt, og bratteste enkeltsteg måler 26,3 grader. Benken nord for Isvatnet ligger på fire til tjuefire grader. Toppblokka er unntaket — den er klatring, ikke skiterreng.",
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
      path: "M0,200 L16,193 L35,185 L50,180 L70,170 L87,171 L109,169 L134,169 L153,168 L183,162 L203,158 L222,148 L247,144 L271,134 L291,123 L311,113 L334,111 L350,104 L368,96 L390,92 L414,86 L429,78 L444,71 L464,64 L488,57 L508,51 L519,44 L538,35 L557,30 L577,26 L600,18",
      startLabel: "141 moh",
      endLabel: "1231 moh",
      distanceLabel: "5,5 km",
      caption: "5,49 km og 1103 høydemeter fra steinbruddet i Forselvveien; bratteste hundremeteren ligger mellom 500 og 600 moh.",
    },
  },
  geitgaljen: {
    slug: "geitgaljen",
    intro:
      "1071 høydemeter fra fjorden på 3,82 km, og hele linja ligger i skredterreng. Topptursentralen setter turen til KAST 4 — ekstremt, og de øverste 157 høydemetrene er 42 grader i snitt og krever stegjern og isøks.",
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
      path: "M0,200 L29,195 L51,194 L86,191 L116,188 L147,179 L171,172 L192,166 L213,157 L227,151 L249,142 L270,134 L291,128 L310,120 L329,114 L348,105 L369,100 L391,93 L414,84 L432,78 L454,70 L468,66 L489,58 L510,52 L529,48 L546,41 L560,35 L578,28 L593,20 L600,18",
      startLabel: "20 moh",
      endLabel: "1085 moh",
      distanceLabel: "3,8 km",
      caption: "1071 høydemeter og 3,82 km fra Liland; renna på 250–360 moh er 35 grader, og de øverste 174 metrene 42.",
    },
  },
  himmeltindan: {
    slug: "himmeltindan",
    intro:
      "Vestvågøys høyeste fjell, med start i fjæra på Haukland og 988 høydemeter opp på knapt fire kilometer. Kort tur, men siste tredjedel er bratt og toppryggen er smal.",
    ascent: [
      "Fra parkeringen på Hauklandstranda, seks meter over havet, går du nordover mot søndre munning av tunnelen til Utakleiv. Ikke gjennom tunnelen: ta serviceveien som klatrer nordøstover over den, forbi Klumpan, og følg den til den flater ut på benken på 150 moh ved munningen av Durmålsdalen. Her starter den merkede stien, og den går hele veien opp til varden på 931.",
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
  kirketaket: {
    slug: "kirketaket",
    intro:
      "Norges kanskje mest populære topptur — bred rygg, oversiktlige linjevalg og lang sesong. En tur som gir mye fjell for pengene, både for førstegangsturen og for hundredegangen.",
    ascent: [
      "Fra parkeringen på Hellerøra (Øvre Kavli), 185 moh, følger du bomveien nordover den første kilometeren, til den krysser Heiaelva. Rundt svingen og videre inn på sporet mot Kavlisetra og Måsvassbu.",
      "Ved rundt 420 moh forlater du Måsvassbu-sporet og går nordøst opp gjennom åpen bjørkeskog. Skogen slipper taket akkurat der: over 421 moh er det åpent terreng resten av veien. Målet er Vesttoppen på Steinberget, 766 moh.",
      "Fra Vesttoppen følger du kammen østover til Steinberget, 981 moh. Ryggen henger sammen og stiger jevnt, men rett nord for Steinberget faller den 19 meter i et søkk før den reiser seg igjen. De 19 meterne må du opp igjen på vei tilbake — de er med i turens 1277 høydemeter.",
      "Herfra går sørvestryggen nord-nordøstover mot toppen. Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1300 og 1400 moh og holder 20,8° i snitt. Det bratteste enkelttrinnet ligger høyere, mellom 1411 og 1428 moh, og måler 29,4°. Skavler henger ut på både øst- og vestsida av toppryggen; hold deg på ryggen og klar av begge kanter helt inn til varden på 1439.",
    ],
    descent: [
      "Standardnedkjøringen går sørover fra toppen, ned sørflanken til Kavliheian — 950 sammenhengende høydemeter — og derfra i oppkjørte spor tilbake til Øvre Kavli. Øverste del kan skjule stein tidlig i sesongen; den beste snøen ligger lenger ned. Sørflanken er også det første stedet i området som blir oppkjørt etter snøfall, så vær tidlig ute om du vil ha den urørt.",
      "Vanligste feil: å ta sørflanken som standard uansett forhold. Øverste del holder 30–35°, og skredterrenget ligger i to belter, 1300–1400 moh og 950–1050 moh — begge går du gjennom på vei opp også. Holder ikke varselet til det, går du tilbake over Steinberget, samme vei som opp, og opp igjen gjennom søkket.",
      "Vestrenna er den andre linja ned: jevnt 42–48°, med et 60 meter langt parti på rundt 55° der renna er smalest, og videre ut dalen til Loftskarsetra og ned gjennom skogen til parkeringen. Den krever stabil vårsnø eller stabile vinterforhold og en helt egen vurdering — snøkvaliteten i renna er vanskeligere å vurdere enn å kjøre den. Det er ikke noe du velger på toppen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigninga over Steinberget er den slake linja på fjellet, men den er ikke skredfri. Skredterrenget ligger i beltene 950–1050 moh og 1300–1400 moh, og du går gjennom begge på vei til toppen. Bratteste hundremeterssjikt på oppstigninga er nettopp 1300–1400 moh, med 20,8° i snitt; det bratteste enkelttrinnet ligger like over, mellom 1411 og 1428 moh, og måler 29,4°.",
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
      path: "M0,200 L30,198 L52,194 L80,189 L100,180 L117,173 L143,160 L165,150 L186,140 L205,131 L221,124 L247,115 L277,111 L299,109 L325,105 L349,103 L377,100 L407,91 L434,84 L459,84 L485,76 L511,66 L524,58 L545,49 L563,40 L576,33 L594,22 L600,18",
      startLabel: "185 moh",
      endLabel: "1439 moh",
      distanceLabel: "6,2 km",
      caption: "185 til 1439 moh på 6,2 kilometer: bomvei, bjørkeskog til 421, så rygg hele veien — 1277 høydemeter medregnet søkket nord for Steinberget.",
    },
  },
  auskjeret: {
    slug: "auskjeret",
    intro:
      "870 høgdemeter på 3,83 km frå Fausaskiftet, jamn stigning nordover heile vegen — om lag femten grader i snitt. Heilårsopen veg fram til starten er grunnen til at dette er ein av dei fyrste turane som går i Sykkylven kvar vinter.",
    ascent: [
      "Start ved Fausaskiftet ved enden av Nysætervatnet, 333 moh, der Fausavegen tek av frå vegnettet om lag fire kilometer forbi skianlegget. Vegen hit er open heile året.",
      "Ta på skia og gå nordover. Dei fyrste 671 metrane grunn ligg på 6,2 grader i snitt, og skogen held til 527 moh.",
      "Over skogen held stigninga fram jamt og utan trinn: 14,2 grader frå 500 til 600 moh, 11,4 frå 600 til 700 og 11,7 frå 700 til 800. Ved 685 moh er du ute i den opne sida, og rett over ligg brattaste partiet på turen — 26,4 grader over tretti meter, mellom 862 og 884 moh, i bandet som måler 18,6 grader i snitt.",
      "Frå 900 moh og opp er det jamn rygg heile vegen: 16,1 grader frå 900 til 1000 moh, 18,1 frå 1000 til 1100 og 15,1 frå 1100 til 1200, med varden på 1203 moh.",
    ],
    descent: [
      "Ned same ryggen, søraustover mot Nysætervatnet, i moderat og oversiktleg skiterreng. Følgjer du ryggen opp og ned, held ruta seg under 30 grader heile vegen.",
      "Vanlegaste feil: å sleppe seg austover frå ryggen fordi sida ser innbydande ut. Fjellet har eit brattheng mot aust som er over 30 grader, og det er den eine staden på turen der linjevalet faktisk avgjer kva slags dag du får.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn stigning på om lag femten grader i snitt. Brattaste hundremeteren, 800 til 900 moh, måler 18,6 grader, og brattaste samanhengande parti 26,4 grader mellom 862 og 884 moh. Ryggen er brei, og det er den som er ruta både opp og ned.",
      },
      {
        title: "Terrenget rundt",
        body: "Braatthenget mot aust er over 30 grader og skal styrast unna i skredver. Det er dette henget, saman med lengda, som skil turen frå ein rein nybyrjartur — sjølve ryggen gjer det ikkje.",
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
      caption: "870 høgdemeter og 3,83 km frå Fausaskiftet ved Nysætervatnet, med skoggrensa på 527 moh og brattaste hundremeteren mellom 800 og 900 moh.",
    },
  },
  snohetta: {
    slug: "snohetta",
    intro:
      "Norges høyeste fjell utenfor Jotunheimen, og et av de snilleste i sin klasse: østryggen er staket hele veien, og bratteste parti på linja måler 23,5°. Det som avgjør dagen er ikke fjellet, men hvordan du kommer deg inn til Snøheim.",
    ascent: [
      "Snøheim turisthytte, 1474 moh, ligger ved enden av Snøheimvegen. Vegen er stengt for privatbil, sykkel er forbudt fram til 1. juni av hensyn til villreinkalvinga, og bussen fra Hjerkinn går først når hytta åpner rundt St. Hans. I skisesongen tar du altså de fjorten kilometerne inn fra Hjerkinn for egen maskin — det er den delen av dagen folk undervurderer. Fra hytta følger du sporet et par hundre meter vestover til gangbrua over Stridåe. Brua ligger i sørøsthjørnet av tjernet rett vest for hytta; du går rundt sørsida av tjernet, ikke over det.",
      "Etter brua svinger du umiddelbart til høyre inn på Forsvarets gamle traktorveg, sperret for kjøring med store steiner. Den tar deg jevnt oppover til Gamle Reinheim, ruinen på 1670 moh. Ingen skog noe sted på denne turen — du er over tregrensa fra hytta og oppover, og ser hele ryggen foran deg hele veien.",
      "Fra Gamle Reinheim stiger det bratt, delvis på snøfonner, opp på østryggen. Oppe på kammen ligger stidelet mot Reinheim i Stroplsjødalen, inngangen for dem som kommer østfra. Hold avstand til det bratte terrenget mot nord i starten av stigningen; ryggen er bred nok til at du kan gå midt på den.",
      "Det bratteste hundremeterbeltet ligger mellom 1800 og 1900 moh og holder 19,0° i snitt; bratteste parti på linja måler 23,5°. Herfra er det staker og varder hele veien, og øverst går det på snøfonner opp til Stortoppen, 2286 moh, der radiolinkstasjonen står. I dårlig sikt er det stakene som holder deg på kammen — den øvre delen er bred nok til at du mister følelsen av hvor ryggen går.",
    ],
    descent: [
      "Samme vei ned. Fra Stortoppen til Gamle Reinheim gir østryggen drøyt 600 sammenhengende høydemeter, og de siste 200 tar traktorvegen. Under 1800 moh slakner det så mye at det blir mer gliding enn svinger. Vil du ha mer helning og bedre snø, legger du noe av nedkjøringen sør for oppoversporet — men da står du i 30–40°-terreng i stedet for 20°.",
      "Vanligste feil kommer helt til slutt: å forlate traktorvegen for tidlig og sikte rett mot Snøheim. Da har du tjernet vest for hytta i veien, og utløpsbekken bak det. Følg vegen helt ned til enden ved sørvesthjørnet av tjernet og ta stien østover derfra — gangbrua er den eneste kryssinga, og fra brua er det 230 meter igjen til hytta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Østryggen er slak etter høyfjellsmålestokk. Det bratteste hundremeterbeltet, mellom 1800 og 1900 moh, holder 19,0° i snitt, og bratteste parti på linja måler 23,5°. Fra Snøheim til Gamle Reinheim går du på gammel traktorveg i åpent, slakt terreng. Det som betyr noe her er ikke det du står på, men hvor nær kanten av kammen du legger sporet.",
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
      path: "M0,199 L23,200 L42,198 L66,196 L94,193 L123,190 L146,189 L170,186 L198,181 L222,174 L246,170 L274,168 L298,163 L321,155 L345,150 L364,144 L379,135 L397,121 L416,107 L435,94 L459,82 L482,74 L501,65 L525,52 L553,39 L577,27 L600,18",
      startLabel: "1474 moh",
      endLabel: "2286 moh",
      distanceLabel: "5,7 km",
      caption: "5,7 km og 817 høydemeter fra Snøheim — jevnt oppover hele veien, og aldri brattere enn 23,5°.",
    },
  },
  jonshornet: {
    slug: "jonshornet",
    intro:
      "1428 høgdemeter frå 107 moh over Rametinden, og dei siste hundre på smal egg til varden på det fjellet lokalt heiter Ramoen. Brattaste samanhengande parti måler 32,2 grader, og skia blir normalt sette igjen på ryggen.",
    ascent: [
      "Start i Vollane ved Tverrelva, 107 moh, øvst i gardsvegen frå Molladalsvegen. Gå gjennom stålgrinda ved elva og følg stien oppover, fyrst på venstre og så på høgre side av elva.",
      "Den fyrste delen er den brattaste av dei låge banda: 19,5 grader frå 200 til 300 moh og 19,1 frå 300 til 400. Terrenget legg seg ved Vollesætra på 411 moh, og skogen held til 426.",
      "Frå setra går det i relativt slakt terreng opp mot Rametinden, 1197 moh — bandet frå 700 til 800 moh måler 12,5 grader og 900 til 1000 moh 15,5. Frå Rametinden fell ryggen til skaret på 1089 moh; det er 108 høgdemeter du gjev frå deg på veg opp, og linja hentar dei inn att med bandet frå 1100 til 1200 moh på 5,7 grader over 1008 meter grunn.",
      "Frå skaret stig ryggen 328 høgdemeter til toppen, og det er her turen skiftar karakter: bandet frå 1200 til 1300 moh måler 18,4 grader, brattaste samanhengande parti 32,2 grader mellom 1165 og 1187 moh, og sjølve toppen er ein haug av store steinblokker. Dei siste hundre høgdemetrane går på egg, og dei fleste set skia igjen på ryggen.",
    ],
    descent: [
      "Ned same ryggen: over skaret, opp att den vesle kneiken til Rametinden og ned nordryggen til Vollesætra og Vollane. Fallretninga er nord.",
      "Vanlegaste feil: å ta Jønshornrenna ned i Molladalen utan å ha ordna transport. Fri Flyt skildrar den runden, og ho held opp mot 45 grader — men ho endar i ein annan dal enn den du parkerte i, og krev to bilar. Den andre er å rekne egga som ein del av skituren: ho er hundre høgdemeter til fots på eksponert rygg.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn oppstigning til Rametinden og alvor over skaret. Brattaste samanhengande parti måler 32,2 grader mellom 1165 og 1187 moh, og bandet frå 1200 til 1300 moh 18,4 grader. Sidene ned frå ryggen mellom Rametinden og toppen er skredterreng.",
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
      path: "M0,200 L34,193 L57,189 L79,179 L94,173 L109,166 L124,159 L141,151 L167,143 L186,136 L205,128 L224,122 L252,109 L281,103 L304,94 L333,85 L357,76 L376,69 L396,60 L423,50 L447,56 L466,62 L489,64 L505,59 L523,50 L542,42 L556,36 L570,29 L594,21 L600,18",
      startLabel: "107 moh",
      endLabel: "1417 moh",
      distanceLabel: "5,7 km",
      caption: "1428 høgdemeter og 5,68 km frå Vollane over Vollesætra og Rametinden, med skaret på 1089 moh mellom Rametinden og toppryggen.",
    },
  },
  ytstevasshornet: {
    slug: "ytstevasshornet",
    intro:
      "835 høgdemeter på 3,87 km frå Svartevatnet, bratt opp Vassdalen til vatna på 976 moh og så nordvest mot ein smal topprygg. Brattaste samanhengande parti måler 25,3 grader, og dei siste metrane blir gjerne gått utan ski.",
    ascent: [
      "Start på parkeringa ved Svartevatnet, 538 moh, ved hovudvegen mellom Sykkylven og Stranda. Dei fyrste 769 metrane grunn er flate langs vatnet — 4,9 grader — før dalen tek til.",
      "Gå vestover, på venstre side av elva, opp Vassdalen. Her er den bratte delen av turen: 18,3 grader frå 600 til 700 moh, 21,2 frå 700 til 800 og 19,2 frå 800 til 900, med brattaste samanhengande parti på 25,3 grader mellom 785 og 813 moh. Skogen held til 663 moh.",
      "Ved dei små fjellvatna på 976 moh flatar det ut igjen — bandet frå 900 til 1000 moh måler 6,3 grader over 855 meter grunn. Det er her du ser resten av ruta, og det er òg den naturlege staden å snu om vinden har bygd skavl på ryggen over.",
      "Derfrå held du nordvestover mot toppryggen: 16,3 grader frå 1000 til 1100 moh og 19,7 frå 1100 til 1200. Dei siste metrane opp til 1331 moh blir gjerne gått utan ski.",
    ],
    descent: [
      "Ned same vegen, austover gjennom Vassdalen til Svartevatnet. Fallretninga er aust, og Vassdalen er både det brattaste og det mest skredutsette på turen.",
      "Vanlegaste feil: å runde skavlen mellom førtoppen og hovudtoppen på oversida. Det dannar seg normalt ei stor skavl der, og ein skal køyre ned i sida når ein rundar henne — ikkje følgje kanten.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Flat start, bratt midtdel og eit flatt parti før toppryggen: brattaste hundremeteren, 700 til 800 moh, måler 21,2 grader, og brattaste samanhengande parti 25,3 grader mellom 785 og 813 moh. Vassdalen er skredterreng frå 600 moh og opp.",
      },
      {
        title: "Terrenget rundt",
        body: "Skavlar langs toppryggen — det dannar seg normalt ei stor skavl mellom førtoppen og hovudtoppen, og ho skal rundast på nedsida. Sida ned frå hovudtoppen er skredterreng, og det same er sjølve Vassdalen, som er den einaste vegen ned til bilen.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,197 L21,199 L49,200 L77,198 L93,192 L119,182 L137,174 L154,166 L168,159 L182,151 L196,144 L210,135 L227,126 L245,116 L259,110 L280,103 L302,100 L322,98 L336,102 L357,102 L378,95 L399,88 L417,81 L427,77 L448,64 L462,56 L483,47 L510,41 L531,36 L552,30 L573,23 L600,18",
      startLabel: "538 moh",
      endLabel: "1331 moh",
      distanceLabel: "3,9 km",
      caption: "835 høgdemeter og 3,87 km frå Svartevatnet opp Vassdalen, med skoggrensa på 663 moh og vatna på 976 moh som det flate midtpunktet.",
    },
  },
  rana: {
    slug: "rana",
    intro:
      "1595 høgdemeter frå 63 moh — fjord til topp på 8,12 km, med eit av dei eldste namna i Sunnmørsalpane på skiltet. Brattaste samanhengande parti måler 37,5 grader og ligg heilt oppe på toppkammen, mellom 1530 og 1555 moh.",
    ascent: [
      "Start ved Urkegjerdet, 63 moh, der grusvegen tek av frå hovudvegen ved Urke Landhandel. Vegen vidare mot Haukåssætra er vinterstengd, og det er difor turen startar nede ved fjorden og ikkje oppe ved sætra på 230 moh — Fri Flyts «5 timar frå Haukåssætra» er tida frå eit punkt du sjeldan kjem til med bil om vinteren.",
      "Følg vegen opp gjennom skogen — Kartverket fører skog til 257 moh — forbi Haukåssætra og inn i dalen mot Nordkopen på 501 moh. Bandet frå 400 til 500 moh måler 17,3 grader, og elles er heile innmarsjen slak: 5,8 grader frå 100 til 200 moh og 6,6 frå 200 til 300.",
      "Frå kopen sikksakkar ruta bratt opp mot egga i nord, og du tek inn på henne til høgre for ein markert hammar. Botnen ligg på 987 moh og eggkammen på 1331. Bandet frå 1000 til 1100 moh er brattaste hundremeteren, 21,0 grader i snitt, og partiet frå 600 til 800 moh under det ligg på 18 til 20 grader.",
      "Derfrå følgjer du toppryggen nordover. Han er brei og slakar av mot 1400 moh — 6,9 grader frå 1300 til 1400 — før den siste stigninga langs kammen frå 1531 og 1562 moh til varden på 1587. Det er her det brattaste ligg: 37,5 grader over tretti meter mellom 1530 og 1555 moh.",
    ],
    descent: [
      "Ned same vegen: kammen, den breie toppryggen, ned egga til Nordkopen og ut dalen til Urkegjerdet. Fallretninga er søraust, og nedkøyringa er lang — 1595 høgdemeter i eitt strekk frå toppen til fjorden.",
      "Vanlegaste feil: å halde seg aust på toppryggen. Det ligg store skavlar på austsida av ryggen, og ein flankemåling frå toppen viser at fjellet er bratt i alle retningar: 22 til 41 grader i snitt over dei fyrste 400 metrane, med 60-metersvindauge på 53 til 66 grader. Hald vest for kammen.",
      "Den andre er tidspunktet. Ruta går gjennom skredterreng både inn mot Nordkopen og i sida opp mot egga, og i vårsnø utover ettermiddagen er det den delen av turen som endrar seg raskast.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak innmarsj og bratt midtdel: bandet frå 1000 til 1100 moh måler 21,0 grader i snitt, og sida opp frå Nordkopen til egga er skredterreng. Sjølve toppkammen er brattaste partiet med 37,5 grader over tretti meter mellom 1530 og 1555 moh, og det er òg der skavlane ligg.",
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
      path: "M0,200 L30,197 L57,195 L80,192 L103,189 L128,182 L150,177 L170,175 L190,171 L220,163 L246,155 L262,148 L286,144 L306,136 L328,125 L345,115 L365,104 L388,93 L402,85 L420,73 L439,68 L457,58 L472,48 L495,47 L512,46 L535,37 L559,32 L579,26 L592,22 L600,18",
      startLabel: "63 moh",
      endLabel: "1587 moh",
      distanceLabel: "8,1 km",
      caption: "1595 høgdemeter og 8,12 km frå Urkegjerdet over Haukåssætra, Nordkopen og egga, med det brattaste på dei siste hundre høgdemetrane.",
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
      "Følg Engesetvegen oppover og austover til Vallasætra. Dei fyrste 766 metrane grunn er flate — 0,7 grader — og så tek vegen til: 5,3 grader frå 100 til 200 moh, 9,2 frå 200 til 300 og eit brattare parti på 19,9 og 21,8 grader mellom 400 og 600 moh. Skogen held til 529 moh.",
      "Frå setra går ein nokre hundre meter inn Langedalen og deretter bratt opp kneiken til Bukkedalen, 791 moh — eventuelt med skia på sekken. Bandet frå 700 til 800 moh er slakt, 8,9 grader over 632 meter grunn, og gjev deg pusterommet før flanken.",
      "Følg dalbotnen innover til 960 moh, der den bratte, lange flanken tek til. Herifrå stig linja jamt og hardt: 19,5 grader frå 1000 til 1100 moh, 22,5 frå 1100 til 1200 og 23,6 frå 1200 til 1300, med brattaste samanhengande parti på 36,2 grader mellom 1205 og 1238 moh. Toppen står på 1278.",
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
      caption: "1212 høgdemeter og 6,50 km frå Nupen over Vallasætra og Bukkedalen, med skoggrensa på 529 moh og flanken frå dalbotnen på 960 moh til toppen.",
    },
  },
  saudehornet: {
    slug: "saudehornet",
    intro:
      "1157 høgdemeter rett opp frå Ørsta sentrum, og Fri Flyt graderer turen «Komplekst» av ein grunn: ryggkammen held rundt 32 grader i snitt dei siste 170 høgdemetrane med det brattaste partiet på 37, og på hard snø gir ei utglidning der lang utløpsbane. Fri Flyt reknar med at mange tek skia på sekken det siste stykket.",
    ascent: [
      "Frå parkeringa ved vasshuset øvst i Vikegeila, 149 moh, følgjer du anleggsvegen oppover Skåla. Skogen sluttar rundt 339 moh og terrenget er ope frå 423. Ved om lag 395 moh går ein av vegen der ein kartlagd sti tek av — det er same staden Fri Flyt skildrar med «på skrå mot Vikeelva, kryss elva».",
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
      path: "M0,200 L34,192 L67,184 L94,177 L121,170 L148,163 L175,157 L196,157 L216,149 L243,140 L263,133 L285,124 L310,113 L330,105 L351,99 L378,94 L405,93 L432,85 L448,79 L465,72 L486,63 L499,57 L518,50 L533,45 L546,41 L566,33 L583,25 L600,18",
      startLabel: "149 moh",
      endLabel: "1303 moh",
      distanceLabel: "4,0 km",
      caption: "1157 høgdemeter og 4,00 km frå vasshuset i Ørsta, med dei siste 170 høgdemetrane på sørryggen i 33–39 grader.",
    },
  },
  slogen: {
    slug: "slogen",
    intro:
      "Sunnmørsalpenes dronning, og en av de mest alvorlige turene i landsdelen. 1520 høydemeter fra Norangsdalen til en topp de fleste går de siste 350 metrene til fots.",
    ascent: [
      "Fra veilomma ved Skylstad i Norangsdalen, 85 moh, går du rett opp Brekkheida. Hold deg vest for Brekkeelva gjennom hele skogen — elva ligger et par hundre meter øst for linja, og du kommer først inn på elvefaret oppe på flata rundt 700 moh. Dette er den bratteste delen av skogen: de hundre metrene mellom 100 og 200 moh ligger på 22,8° i snitt.",
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
        body: "Skogpartiet over Brekkheida er brattest mellom 100 og 200 moh, 22,8° i snitt. Det bratteste enkelttrinnet på hele linja måler 46,9°, og det ligger ikke i skogen — det er toppblokka over 1520 moh, den delen skiene uansett bæres opp. Ryggen fra Pukkelen til høgde 1204 er snill: flankene der ligger på 26–35°. Det er de øverste 250 høydemeterne som er egg — nordsiden 43–57°, sørsiden 49–50°. Der er utglidning den reelle faren, og det er derfor skia blir båret.",
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
      path: "M0,198 L33,199 L61,189 L84,179 L100,174 L114,170 L130,163 L149,154 L164,147 L186,142 L213,134 L237,129 L265,125 L302,118 L329,112 L353,101 L376,92 L400,83 L420,74 L446,70 L468,64 L496,62 L519,53 L539,47 L558,39 L578,31 L595,23 L600,18",
      startLabel: "85 moh",
      endLabel: "1564 moh",
      distanceLabel: "5,8 km",
      caption: "85 moh ved Skylstad til 1564 på Slogen — 1520 høydemeter på 5,81 kilometer, de siste 350 til fots.",
    },
  },
  torvloysa: {
    slug: "torvloysa",
    intro:
      "1461 høgdemeter på 10,61 km frå Hatlestad — ein av dei lengste turane i Norddal, og ein av dei slakaste. Brattaste samanhengande parti måler 27,2 grader, og fem kilometer av ruta ligg på ryggen frå Daurmålsfjellet til toppen.",
    ascent: [
      "Start på den kartfeste parkeringa på Hatlestad, 453 moh, over Norddalen. Fri Flyt skriv at ein parkerer på 350 moh; terrengmodellen les gardane til 412 og p-plassen til 453, og differansen er grunnen til at turen her måler 1461 høgdemeter og ikkje 1500.",
      "Gå slakt inn i munningen av Dyrdalen og opp til Rellingsætra på 557 moh. Dei to fyrste banda er nesten flate — 3,0 grader frå 400 til 500 moh og 2,1 over 2656 meter grunn frå 500 til 600.",
      "Frå setra tek kneiken opp på Daurmålsfjellet, 825 moh: 16,9 grader frå 600 til 700 moh og 15,2 frå 700 til 800. Skogen held til 748 moh. Dette er den bratte delen av turen, og han er kort.",
      "Så følgjer ryggen. Fem kilometer i slakt terreng, over ryggpunktet på 1186 moh, med band mellom 7 og 20 grader heile vegen: 8,4 frå 1000 til 1100 moh, 14,1 frå 1200 til 1300, 20,2 frå 1400 til 1500 — brattaste hundremeteren — og 9,0 dei siste hundre til varden på 1851 moh. Kartverket registrerer breterreng kring 1437 moh.",
    ],
    descent: [
      "Ned same ryggen: nordover til Daurmålsfjellet, ned kneiken til Rellingsætra og ut Dyrdalen til Hatlestad. Fallretninga er nord, og nedkøyringa er lang og jamn heller enn bratt.",
      "Vanlegaste feil: å vende for seint. Ti kilometer utan ly, med det meste av høgda langt frå bilen, gjer at eit verskifte kostar meir her enn på ein kort tur — vendinga må avgjerast tidleg, ikkje når du står på ryggen og ser at det trekkjer til.",
      "Den andre er breterrenget kring 1437 moh: det har sprekker seinvinters, og på ein rygg som elles er så slak er det lett å slutte å tenkje på kva ein går på.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak i begge endar og bratt eitt einaste stad: kneiken frå Rellingsætra opp på Daurmålsfjellet. Brattaste hundremeteren, 1400 til 1500 moh, måler 20,2 grader og brattaste samanhengande parti 27,2 grader mellom 1396 og 1419 moh. Ryggen elles ligg mellom 7 og 18 grader.",
      },
      {
        title: "Terrenget rundt",
        body: "Breterrenget kring 1437 moh har sprekker seinvinters. Ryggen er brei, men han er lang og utan ly, og det er lengda som er den reelle faren her: ti kilometer frå bilen i dårleg ver er ein annan tur enn ti kilometer i sol.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,199 L50,198 L69,190 L96,187 L120,185 L143,188 L171,187 L194,185 L219,174 L236,162 L258,154 L280,151 L301,149 L324,144 L347,139 L371,129 L392,121 L418,114 L441,105 L466,98 L487,85 L504,71 L525,57 L550,47 L570,32 L593,20 L600,18",
      startLabel: "453 moh",
      endLabel: "1851 moh",
      distanceLabel: "10,6 km",
      caption: "1461 høgdemeter og 10,61 km frå Hatlestad over Rellingsætra og Daurmålsfjellet, med skoggrensa på 748 moh og ryggen frå 1186 moh til varden.",
    },
  },
  skarene: {
    slug: "skarene",
    intro:
      "1219 høgdemeter på 6,44 km frå Korsmyra, med to kilometer flat dalbotn før den store snøflanken tek til. Flanken held 18 til 21 grader i band etter band frå 900 til 1700 moh — og han er samanhengande skredterreng heile vegen.",
    ascent: [
      "Start på biloppstillingsplassen på Korsmyra, 621 moh, ved hovudvegen mellom Eidsdal og Geiranger. Tilkomsten står under Eidshornet hos Fri Flyt, og det er den same plassen.",
      "Følg setervegen inn til Grandesætra på 648 moh og vidare slakt inn og oppover Gråsteindalen, 721 moh. Dei to fyrste banda er nesten flate: 3,7 grader over 1268 meter grunn frå 600 til 700 moh og 3,6 over 1575 meter frå 800 til 900.",
      "Komen inn mot botnen av dalen på 940 moh tek den store snøflanken til, og han held same karakter heilt opp: 18,1 grader frå 900 til 1000 moh, 20,5 frå 1000 til 1100, 20,0 frå 1300 til 1400, 21,2 frå 1500 til 1600 og 21,3 frå 1600 til 1700 — brattaste hundremeteren. Brattaste samanhengande parti måler 26,8 grader mellom 1528 og 1544 moh.",
      "Dei siste hundre høgdemetrane slakar av til 9,6 grader og fører fram til varden på 1830 moh, eit av dei høgaste punkta i fjella over Eidsdal. Registeret skriv fjellet Skorene.",
    ],
    descent: [
      "Ned same flanken og ut Gråsteindalen til Grandesætra og Korsmyra. Fri Flyt kallar dette flott skiterreng med snille hellingsvinklar, og tala er einige: ingen band over 21,3 grader.",
      "Vanlegaste feil: å lese dei snille hellingsvinklane som ein grunn til å gå på ein ustabil dag. Heile strekket frå botnen av Gråsteindalen og opp er skredterreng, flanken er stor og samanhengande, og det finst inga line rundt han — turen bør gåast på stabile dagar, og det er heile vurderinga.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ein samanhengande snøflanke frå 940 moh til toppen, med band mellom 18,1 og 21,3 grader og brattaste samanhengande parti på 26,8 grader mellom 1528 og 1544 moh. Hellinga er moderat; det er storleiken og samanhengen som er problemet.",
      },
      {
        title: "Terrenget rundt",
        body: "Skredterreng frå botnen av Gråsteindalen og heile vegen opp til toppen. Flanken er stor og samanhengande, og det finst inga line rundt han: går du turen, går du i han.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L23,198 L51,195 L72,193 L93,192 L118,188 L144,183 L172,177 L193,173 L219,169 L244,169 L273,169 L298,166 L323,163 L347,152 L361,145 L378,135 L394,125 L415,117 L436,106 L457,94 L473,85 L491,74 L508,64 L520,56 L533,48 L549,38 L566,29 L591,20 L600,18",
      startLabel: "621 moh",
      endLabel: "1830 moh",
      distanceLabel: "6,4 km",
      caption: "1219 høgdemeter og 6,44 km frå Korsmyra over Grandesætra og Gråsteindalen, med snøflanken frå dalbotnen på 940 moh til varden på 1830.",
    },
  },
  melshornet: {
    slug: "melshornet",
    intro:
      "559 høgdemeter på 3,00 km frå Helgatun, opp ei preparert og merkt løype som blir gått i mørket heile vinteren. Brattaste samanhengande parti måler 21,7 grader, og det ligg nede ved skoggrensa på 441 moh — ikkje oppe under varden.",
    ascent: [
      "Start på den store parkeringsplassen ved Helgatun på Krøvelseidet, 252 moh, på vegen mellom Volda og Ørsta. Løypa tek av frå plassen og går rett inn i skogen. Ho er tidvis preparert med trakkemaskin, og den siste bakken er merkt med brøytestikker.",
      "Dei fyrste hundre og femti høgdemetrane er slake: bandet frå 200 til 300 moh måler 5,3 grader i snitt over 580 meter grunn, og 300 til 400 moh 12,0 grader. Skogen slepper taket ved 441 moh, og det er der brattaste steget på heile turen ligg — 21,7 grader over tretti meter, mellom 423 og 441 moh.",
      "Over skoggrensa flatar det ut mot ryggen ved 519 moh. Bandet frå 500 til 600 moh er det slakaste på turen, 7,2 grader over 810 meter grunn, og herifrå ser du kvar resten av ruta går.",
      "Ryggen stig jamt til topps: 12,7 grader frå 600 til 700 moh og 17,8 frå 700 til 800, som er brattaste hundremeteren. Dei siste høgdemetrane til varden på 809 moh er flate — bandet over 800 moh måler 7,0 grader.",
    ],
    descent: [
      "Ned same løypa, søraustover. Det er den same lia du gjekk opp, kort og oversiktleg, og du har bilen i sikte det meste av vegen ned.",
      "Vanlegaste feilen på dette fjellet er ikkje eit linjeval, men eit tidsval: turen blir gått i mørket gjennom heile vinteren, og då er traseen og brøytestikkene navigasjonen. Forlèt du løypa, er sidene av Grøthornet skredterreng, og nær toppen kan det liggje skavl ut mot Ørsta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Preparert og merkt løype i slakt terreng. Brattaste samanhengande parti måler 21,7 grader og ligg lågt, mellom 423 og 441 moh rett under skoggrensa; over 500 moh er turen på sitt slakaste med 7,2 grader i snitt frå 500 til 600 moh, og brattaste hundremeteren, 700 til 800 moh, måler 17,8.",
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
      path: "M0,200 L26,198 L53,194 L71,192 L98,187 L125,180 L143,174 L170,165 L192,157 L215,148 L233,138 L251,128 L268,121 L280,118 L296,111 L317,108 L332,109 L350,109 L377,106 L404,98 L422,92 L440,85 L467,70 L485,69 L508,63 L521,57 L539,47 L566,33 L593,19 L600,18",
      startLabel: "252 moh",
      endLabel: "809 moh",
      distanceLabel: "3,0 km",
      caption: "559 høgdemeter og 3,00 km frå Helgatun på Krøvelseidet, med skoggrensa på 441 moh og brattaste hundremeteren mellom 700 og 800 moh.",
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
      "1438 høgdemeter i eitt strekk frå bommen i Bondalen, og storhellinga midt på turen går rett ved sida av ei renne som tømmer seg mot setervegen kvar vinter. Toppplatået er lettvint når du fyrst står på det — det er vegen dit og skavlane over austveggen som gjer turen krevjande.",
    ascent: [
      "Frå bommen på Kvistadvegen ovanfor Kvistad-gardane, 104 moh, følgjer du den vinterstengde setervegen om lag 3,7 kilometer sørover og innover Kvistaddalen til parkeringa framfor Kvistadsætra og Årsetsætra, 509 moh. Dei 405 høgdemetrane opp setervegen er slake — bandet frå 100 til 500 moh ligg på 5 til 7 grader i snitt — og opnar bommen seint i april eller tidleg i mai, kan du køyra dei og kutta både kilometrane og høgdemetrane.",
      "Frå setrene går ruta nordaustover opp gjennom open bjørkeskog. Skogen held til rundt 613 moh og terrenget er ope frå 790.",
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
      path: "M0,200 L25,196 L53,192 L82,186 L110,183 L135,179 L160,173 L181,169 L206,165 L230,160 L255,157 L280,155 L305,149 L330,146 L354,136 L376,125 L397,113 L415,104 L427,98 L443,88 L461,79 L479,73 L502,62 L521,57 L542,45 L560,35 L585,26 L600,18",
      startLabel: "104 moh",
      endLabel: "1542 moh",
      distanceLabel: "7,6 km",
      caption: "1438 høgdemeter og 7,62 km frå bommen på Kvistadvegen, der dei fyrste 3,7 kilometrane er stengd seterveg og 405 høgdemeter.",
    },
  },
  kvitegga: {
    slug: "kvitegga",
    intro:
      "1477 høgdemeter på 6,05 km frå Nibbedalen til det høgste fjellet i midtre Sunnmørsalpane. Brattaste samanhengande parti måler 38,1 grader — det er Brattbakken, og han er den eine tekniske delen av turen.",
    ascent: [
      "Start i grustaket i Nibbedalen, 324 moh, der sidevegen tek av frå fv655. Er vegen ikkje brøytt, parkerer ein langs fylkesvegen. Dei fyrste 771 metrane grunn ligg på 5,9 grader.",
      "Følg grusvegen eit lite stykke og deretter sommarstien vestover inn Snødalen. Stigninga er jamn og vedvarande: 20,1 grader frå 500 til 600 moh, 19,6 frå 600 til 700 og 19,0 frå 700 til 800. Ved 925 moh er du inne i sjølve dalen.",
      "Innerst tek Brattbakken til — bakken opp mot 1316 moh som rutebeskrivinga set til om lag 35 grader. Terrengmodellen måler bandet frå 1100 til 1200 moh til 22,5 grader i snitt og det brattaste samanhengande partiet til 38,1 grader mellom 1265 og 1292 moh. Kartverket registrerer breterreng frå 1290 moh.",
      "Over bakken flatar det brelagde platået ut: 10,2 grader frå 1200 til 1300 moh og 5,6 frå 1500 til 1600 over 1036 meter grunn. Du følgjer det til høgda på 1583 moh, går ned eit lite skar og nordover langs ryggen til toppen på 1700 moh. Den publiserte høgda 1717 er snøkuppelen; terrengmodellen les fjellet til 1700.",
    ],
    descent: [
      "Ned same vegen: sørover langs ryggen, over platået og ned Brattbakken til Snødalen. Fallretninga er aust, og Brattbakken er den delen av nedkøyringa som avgjer om dagen er ein skitur eller ei øving i kantsikring.",
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
      "Start ved vestenden av hyttevegen i Langøylia, 388 moh, mellom Hellesylt og Hornindal. Gå opp lia gjennom open lauvskog, aust for Gjøelva; skogen held til 521 moh, og bandet frå 600 til 700 moh måler 18,9 grader.",
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
      "Gå nordover gjennom skogen — Kartverket fører skog til 673 moh — og opp på søraustryggen. Stigninga aukar jamt: 14,7 grader frå 500 til 600 moh, 15,6 frå 600 til 700 og 19,6 frå 700 til 800, som er brattaste hundremeteren på turen.",
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
      caption: "989 høgdemeter og 5,56 km frå Grøndalsvatnet opp søraustryggen, med skoggrensa på 673 moh og ein kilometer flatt platå fram til varden.",
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
      "Fra Spranget p-plass, 1082 moh, er det seks kilometer inn til Rondvassbu. Tjønnbakkvegen inn hit er bomveg, og midtvinters er Mysusæter siste brøytepunkt — da blir turen tilsvarende lengre. Du er over tregrensa fra første meter, så det er åpent fjell hele veien inn. Hold deg på land rundt vika ved Lonin i sørenden av Rondvatnet i stedet for å ta snarveien over isen; dette er utløpsenden, og der er isen tynnest.",
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
      path: "M0,200 L27,200 L49,197 L75,196 L98,194 L123,190 L145,189 L169,188 L193,188 L215,187 L241,185 L263,186 L292,185 L310,170 L336,157 L358,140 L382,141 L404,135 L428,133 L449,125 L467,104 L487,82 L509,64 L526,45 L546,47 L568,44 L588,28 L600,18",
      startLabel: "1082 moh",
      endLabel: "2178 moh",
      distanceLabel: "12,3 km",
      caption: "12,3 km og 1281 høydemeter fra Spranget. Hundre av dem gis bort i Slottsbrue og må tas igjen opp eggen.",
    },
  },
  glitregga: {
    slug: "glitregga",
    intro:
      "901 høgdemeter på 4,38 km frå idrettsanlegget i Randabygd, sørvend og jamn heile vegen. Brattaste samanhengande parti på linja måler 21,4 grader — det er ein dagstur i høgdemeter og ein enkel tur i helling.",
    ascent: [
      "Start på parkeringa ved idrettsanlegget i Randabygd, 398 moh på Ålandsleite. Følg grusvegen nordaustover; det fyrste kilometeret er nesten flatt, med bandet frå 400 til 500 moh på 5,4 grader over 1125 meter grunn.",
      "Ved Djupegrova på 487 moh svingar ruta nordover og nordvestover, og held seg på vestsida av grova heile vegen. Her kjem det fyrste brattare partiet: 16,0 grader i snitt frå 500 til 600 moh.",
      "Skogen held til 737 moh. Over den flatar det ut ei stund før stigninga tek seg opp att mot skaret: 16,0 grader frå 800 til 900 moh og 18,4 frå 900 til 1000, som er brattaste hundremeteren på turen. Brattaste samanhengande parti måler 21,4 grader og ligg mellom 1044 og 1063 moh.",
      "Frå det markerte skaret held du austover mot toppen. Dei siste hundre høgdemetrane er slakare igjen, 11,9 grader frå 1200 til 1300 moh, og varden står på 1297.",
    ],
    descent: [
      "Ned same vegen: austover ned til skaret, sørvestover ned den opne sida og attende langs Djupegrova til idrettsanlegget. Sørvendinga gjer at føret kan skifte fort utover dagen om våren.",
      "Vanlegaste feil: å køyre rett ned frå toppen i staden for å ta seg tilbake til skaret. Rett under toppen av Glitregga er terrenget bratt, og det er den eine staden på turen der linja må vere den skildra.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn og oversiktleg: brattaste hundremeteren, 900 til 1000 moh, måler 18,4 grader, og brattaste samanhengande parti 21,4 grader mellom 1044 og 1063 moh. Det er lengda og dei 901 høgdemetrane som gjer turen krevjande, ikkje hellinga.",
      },
      {
        title: "Terrenget rundt",
        body: "Rett under toppen av Glitregga er terrenget bratt — hald deg til linja over skaret både opp og ned. Sida ned mot Djupegrova er den andre staden der eit linjeval får konsekvensar, for grova samlar snø frå heile flanken over.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L18,200 L43,198 L62,195 L84,193 L105,191 L123,189 L148,183 L166,181 L191,172 L209,165 L228,157 L246,150 L265,145 L288,139 L308,134 L326,129 L351,119 L376,111 L391,105 L413,94 L431,85 L443,79 L462,71 L475,65 L491,58 L505,54 L523,45 L542,36 L560,29 L579,24 L597,19 L600,18",
      startLabel: "398 moh",
      endLabel: "1297 moh",
      distanceLabel: "4,4 km",
      caption: "901 høgdemeter og 4,38 km frå Randabygd idrettsanlegg, med skoggrensa på 737 moh og brattaste hundremeteren mellom 900 og 1000 moh.",
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
      "Fra parkeringen på Tjugen ved Lodalsvegen, 34 moh, følger du traktorvegen som etter hvert blir til Kloumannstien og går oppover i Fosdalen. De første 540 meterne går på veg; deretter tar stien over. Skogen slipper taket rundt 426 moh, ved Tyvasætra, og fra midten av mai må du regne med å bære skiene opp til Tjugensætra rundt 750 moh.",
      "Elva krysser du rundt 650 moh. Stien svinger nordover et stykke før den tar seg tilbake sørover — følg den; juvet nedenfor er ikke noe å skjære over. Så følger rundt 400 høydemeter jevn stigning opp mot Skålavatnet. Stien svinger seg opp gjennom hellinga, og ingen hundremeter på dette strekket holder mer enn 18°.",
      "Du passerer Skålavatnet på nordvestsida, 1141 moh, og fortsetter sørøstover inn i botnen. Derfra tar du opp til venstre mot den brede ryggen mot Sandsnibba. Den bratteste hundremeteren på hele linja ligger mellom 1400 og 1500 moh og holder 20,3° i snitt; det bratteste enkelttrinnet måler 29,1°.",
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
      path: "M0,200 L33,196 L55,190 L70,184 L83,179 L103,173 L117,168 L134,163 L157,156 L183,148 L205,141 L227,135 L249,128 L275,120 L294,115 L320,108 L342,100 L365,92 L390,85 L417,78 L438,68 L457,61 L475,53 L493,46 L517,37 L539,28 L562,21 L585,18 L600,18",
      startLabel: "34 moh",
      endLabel: "1848 moh",
      distanceLabel: "7,3 km",
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
      "Forbi Hestehytta på 864 moh sluttar skogen — Kartverket fører terrenget som skog til 800 moh — og resten er open rygg. Frå Hestehytta til toppen stig linja 864 til 1567 moh over 3,3 kilometer, om lag tolv grader i snitt.",
      "Ryggen er jamn heile vegen opp: 13,6 grader frå 900 til 1000 moh, 15,4 frå 1000 til 1100 og 15,9 frå 1100 til 1200. Over 1400 moh flatar han ut mot varden på 1567 — bandet frå 1400 til 1500 moh måler 8,3 grader over 675 meter grunn.",
    ],
    descent: [
      "Ned same ryggen, austover mot Remestøylen og Dragesetvegen. Ryggen er brei og oversiktleg, og fallretninga er vest.",
      "Vanlegaste feil: å velje ei anna linje ned enn den du gjekk opp. Fjellet har fleire skredutsette nedkøyringsalternativ til sidene av ryggen, og det er lett å følgje spor som ikkje endar der du parkerte. Følg oppstigningsryggen, ikkje andre sine spor.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Ein lang, brei rygg utan tekniske parti. Brattaste hundremeteren, 600 til 700 moh, måler 17,3 grader, og brattaste samanhengande parti 25,0 grader mellom 520 og 541 moh — begge nede i skogsdelen. Frå Hestehytta og opp held linja om lag tolv grader i snitt.",
      },
      {
        title: "Terrenget rundt",
        body: "Sidene av ryggen er skredutsette, og fleire av dei ser ut som freistande nedkøyringar frå toppen. Det er der vurderinga ligg på dette fjellet: ikkje i ruta opp, men i kva ein vel når ein står på 1567 moh og ser ned.",
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
      caption: "1219 høgdemeter og 5,84 km frå Dragesetvegen i Innvikdalen, over Remestøylen og Hestehytta, med skoggrensa på 800 moh.",
    },
  },
  lodalskapa: {
    slug: "lodalskapa",
    intro:
      "1524 høgdemeter på 10,43 km til det einaste 2000-metersfjellet i Nordfjord. To tredjedelar av turen er slak innmarsj; resten er bre med djupe sprekker, og brattaste samanhengande parti måler 35,6 grader mellom 1975 og 2008 moh.",
    ascent: [
      "Start på parkeringa ved Bødalssætra, 584 moh, snaut tretti kilometer frå Stryn forbi Loen og langs Lovatnet. Vegen inn Bødalen er stengd om vinteren og opnar i mai eller juni — dette er ein vårskitur, og sesongen står deretter.",
      "Gå austover langs nordaustsida av dalen mot osen av Sætrevatnet, 606 moh, og følg elva vidare innover. Innmarsjen er lang og flat: bandet frå 500 til 600 moh måler 0,6 grader over 1583 meter grunn, 600 til 700 moh 4,5 grader over 1345, og 1200 til 1300 moh 2,3 grader over 2429 meter.",
      "Ved Kåpevatnet, 1211 moh, svingar ruta sørover og opp Brattebakkane inn på Bohrsbreen. Herifrå er det bre: Kartverket registrerer breterreng på linja frå 1860 moh, og Fri Flyt skildrar svært djupe sprekker på Bohrsbreen. Bandet frå 1300 til 1400 moh måler 20,5 grader, det brattaste hundremeteren på turen.",
      "Vidare opp mot ryggen og ein travers under Veslekåpa før det siste stykket til toppen på 2082 moh. Bandet frå 1900 til 2000 moh måler 19,8 grader, og brattaste samanhengande parti 35,6 grader mellom 1975 og 2008. Breutstyr, stegjern og isøks høyrer med.",
    ],
    descent: [
      "Ned same vegen: under Veslekåpa, ned breen og Brattebakkane til Kåpevatnet, og deretter den lange, flate innmarsjen ut Bødalen. Fallretninga er vest.",
      "Vanlegaste feil: å behandle Bohrsbreen som ein snøbakke. Sprekkene er djupe, tau og breutstyr er ikkje valfritt, og på veg ned går ein fortare over dei same brøane som ein gjekk sakte over på veg opp.",
      "Den andre er å undervurdere innmarsjen. Fem av ti kilometer ligg under 5 grader; det er lite motstand på ski, men det er òg to timar heimatt etter at dagens høgdemeter er brukte.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Lang, flat innmarsj og ein bratt topp: brattaste hundremeteren, 1300 til 1400 moh, måler 20,5 grader, og brattaste samanhengande parti 35,6 grader mellom 1975 og 2008 moh. Brattebakkane opp mot breen er skredterreng.",
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
      path: "M0,200 L26,200 L52,199 L76,199 L102,197 L126,197 L153,192 L179,178 L202,167 L226,158 L249,149 L275,138 L296,126 L320,124 L345,124 L376,124 L404,124 L430,119 L444,108 L459,98 L475,86 L495,77 L518,67 L539,56 L554,45 L577,33 L593,20 L600,18",
      startLabel: "584 moh",
      endLabel: "2082 moh",
      distanceLabel: "10,4 km",
      caption: "1524 høgdemeter og 10,43 km frå Bødalssætra over Sætrevatnet, Kåpevatnet og Bohrsbreen, med det brattaste på dei siste hundre høgdemetrane.",
    },
  },
  snonipa: {
    slug: "snonipa",
    intro:
      "1493 høgdemeter på 8,29 km frå Stardalen til det høgste fjellet i Sunnfjord, opp Haugadalen og midt i brefallet på Haugabreen. Brattaste samanhengande parti måler 26,0 grader, og turen går på bre frå 922 moh og opp.",
    ascent: [
      "Start ved campingplassen i Stardalen, 351 moh — frå Skei følgjer du E39 nordover og tek av på Klakegg. Fri Flyt viser til utkøyringsplassar langs grusvegen eller parkering nede ved fylkesvegen.",
      "Følg skogsvegen innover Haugadalen til Haugastøylen på 659 moh. Det flate partiet langs skogsvegen er særleg utsett for naturleg utløyste skred når snødekket blir varma opp — det er ikkje der ein ventar det, og det er verdt å hugse.",
      "Vidare opp dalen til brefallet. Kartverket registrerer breterreng på linja alt frå 922 moh, og Haugabreen sjølv ligg på 1100 moh. Ein går opp midt i fallet; store sprekker er den styrande faren her.",
      "Oppe på platået traverserer ein nordvestover og kjem opp på toppen frå nordvest. Stigninga er jamn: 15,9 grader frå 1200 til 1300 moh, 19,2 frå 1300 til 1400 — brattaste hundremeteren — og 18,2 frå 1700 til 1800, med varden på 1827 moh. Kring 1687 moh er føret ofte vindavblåst og hardt.",
    ],
    descent: [
      "Ned same vegen: over platået, ned brefallet og ut Haugadalen. Fallretninga er søraust.",
      "Vanlegaste feil: å velje Veitebergsdalen ned fordi ho ser kortare ut på kartet. Det er ei anna rute frå ein annan dal — Fri Flyt fører henne som eigen tur over Sollirinden — og ho endar ikkje der bilen står.",
      "Den andre er timinga på det flate partiet nedst: det er der naturleg utløyste skred kjem når sola har stått på, og det er den delen av turen ein går sist.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Jamn stigning over bre. Brattaste hundremeteren, 1300 til 1400 moh, måler 19,2 grader og brattaste samanhengande parti 26,0 grader; breterrenget er registrert frå 922 moh. Store sprekker på Haugabreen er den styrande faren, ikkje hellinga.",
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
      path: "M0,200 L17,192 L36,184 L58,181 L78,181 L101,178 L119,174 L137,165 L160,162 L186,161 L212,159 L232,158 L258,149 L277,137 L300,135 L323,127 L349,118 L368,108 L394,101 L420,99 L440,97 L464,88 L482,78 L498,69 L521,58 L544,46 L567,35 L589,24 L600,18",
      startLabel: "351 moh",
      endLabel: "1827 moh",
      distanceLabel: "8,3 km",
      caption: "1493 høgdemeter og 8,29 km frå Stardalen over Haugastøylen og Haugabreen, med breterreng frå 922 moh og skoggrensa på 589.",
    },
  },
  glittertinden: {
    slug: "glittertinden",
    intro:
      "Norges nest høyeste, og en overraskende slak tur: bratteste sammenhengende parti på hele linja måler 19,6 grader. Det som koster er avstanden — 12,88 km én vei, hvorav sju bare er innmarsj i Veodalen — og at øvre del ligger på Glitterbrean.",
    ascent: [
      "Start på grusparkeringa ved nasjonalparkgrensa i Veodalen, 1297 moh. Herfra følger du den bilfrie vegen sørvestover langs Veo i sju kilometer inn til Glitterheim på 1385 moh. Sju kilometer for 88 høydemeter: bandet mellom 1300 og 1400 moh måler 0,9 grader i snitt over nesten sju kilometer, og det er det flateste partiet på noen av turene i denne appen. Regn med at innmarsjen tar en drøy time hver vei før fjellet begynner.",
      "Bak hytta legger ruta seg nordvestover opp nordsida av Steinbudalen. Ikke følg dalbunnen vestover over Steinbuvatna: utgangen av dalen mot breen har steg på 37 til 41 grader, mens nordflanken — der den merkede stien går — holder 9 til 16 grader i snitt, med enkeltsteg opp mot 23. Den bratteste hundremeteren på ruta ligger mellom 1400 og 1500 moh og holder 13,5 grader i snitt.",
      "Fra rundt 2010 moh går ruta inn på ryggen øst for Glitterbrean, opp forbi 2222 moh og 2357 moh på øvre del av breen, og til slutt vestover opp den siste kneika til toppen på 2451 moh. Ut.no beskriver ruta som jevn stigning hele veien i terreng under 30 grader, med valget mellom sommerstien øst for breen og selve breen. Terrengmodellen er enig: bratteste sammenhengende parti på linja er 19,6 grader.",
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
        body: "Linja er slak hele veien: bratteste sammenhengende parti måler 19,6 grader, og den bratteste hundremeteren, 1400 til 1500 moh, holder 13,5 grader i snitt. Skredterreng er ikke det som gjør denne turen krevende. Det er breen, høyden og lengden — og at det slake terrenget over 2200 moh er breterreng, ikke fast fjell. Går du dalbunnen vestover over Steinbuvatna i stedet for nordflanken, får du derimot steg på 37 til 41 grader.",
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
      path: "M0,200 L21,200 L46,199 L69,198 L94,196 L115,194 L136,194 L157,194 L180,193 L203,193 L224,192 L247,190 L272,187 L293,185 L311,185 L331,186 L350,177 L371,160 L394,144 L413,133 L436,117 L461,102 L484,84 L501,72 L522,56 L545,48 L566,39 L582,29 L600,18",
      startLabel: "1297 moh",
      endLabel: "2451 moh",
      distanceLabel: "12,9 km",
      caption: "1181 høydemeter og 12,88 km fra Veodalen, der de sju første kilometerne til Glitterheim stiger 0,9 grader i snitt.",
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
      path: "M0,200 L21,200 L46,199 L61,197 L82,195 L102,193 L122,192 L145,185 L167,176 L193,173 L213,165 L233,156 L254,151 L275,149 L299,148 L314,148 L334,146 L360,138 L385,130 L410,124 L426,121 L446,118 L471,111 L486,99 L512,83 L531,70 L547,56 L567,45 L582,32 L597,20 L600,18",
      startLabel: "1841 moh",
      endLabel: "2469 moh",
      distanceLabel: "5,3 km",
      caption: "639 høydemeter over 5,3 kilometer fra Juvasshytta — 1,6 av dem på Styggebrean, i taulag.",
    },
  },
  steindalsnosi: {
    slug: "steindalsnosi",
    intro:
      "764 høydemeter fra Sognefjellsvegen til 2025 moh, alt over skoggrensa. Normalvegen går opp vestsida; nordsida av det samme fjellet er en helt annen tur, og skillet mellom dem går på topplatået.",
    ascent: [
      "Fra den brøytede plassen ved Gjuvvatnet på Sognefjellsvegen, 1274 moh, går du østover inn i dalsøkket. Hold sørsida av vatnet — der er det fast grunn hele veien, og du slipper å miste de tretti meterne ned på isen. Er vegkanten full, ligger alternativet ved Galgebergstjørnane et par kilometer nordover; korridoren fungerer derfra også.",
      "Dalsøkket tar deg rett østover forbi et lite vatn på 1428 moh. Her er det åpent terreng fra første skritt til toppen — ingen skog, ingen skoggrense å ta hensyn til. Ved rundt 1500 moh trekker du nordøstover ut av søkket og opp mot en svak, vestvendt ryggformasjon. Den ryggen er hele resten av turen.",
      "Ryggen stiger jevnt. Hundremetersbåndet mellom 1700 og 1800 moh ligger på 19,1 grader i snitt, og det bratteste steget på veg opp er 40 meter med 35 grader mellom 1820 og 1860 moh. Hold ryggkammen gjennom det partiet. Trekker du nordover her, faller terrenget 100 til 180 meter bort under deg, og du kommer inn under nordsida.",
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
      caption: "764 høydemeter over 4,0 kilometer fra Gjuvvatnet, alt over skoggrensa. Bratteste parti på oppstigninga: 35 grader mellom 1820 og 1860 moh.",
    },
  },
  besshoe: {
    slug: "besshoe",
    intro:
      "1305 høydemeter fra Bessheim, og en drøy tredjedel av turen er flat: tre og en halv kilometer ligger på isen på Bessvatnet. Selve stigningen er slak hele veien, og det som gjør Besshø krevende er lengden og et stort, rundt topplatå som ikke viser hvor det slutter.",
    ascent: [
      "Fra parkeringa ved Bessheim fjellstue på 961 moh følger du den merkede ruta vestover og opp de 413 høydemeterne til nordøstenden av Bessvatnet på 1374 moh. Dette er turens første kneik og den holder 10–14 grader — jevnt, men det er her du gjør unna stigningen før flata. Fv51 over Valdresflye er vinterstengt sør for Maurvangen, men Bessheim ligger nord for stengsla og nås hele vinteren via Sjoa, Heidal og Randsverk.",
      "Ute på Bessvatnet slutter turen å stige. Vatnet ligger på 1372 moh, og de neste tre og en halv kilometerne vestover faller og stiger til sammen ikke mer enn et par meter — i høydeprofilen er det den lange, flate midtdelen. Isen er normal vinterveg her, men linja på kartet er lagt på land i begge ender. Innerst, ved Grotåosen på 1385 moh, begynner fjellet på nytt.",
      "Derfra går ruta rett vestover opp Grotådalen, mellom Bukkehøe i nord og austryggen til Besshø i sør, i jevn stigning til rundt 1745 moh. Den bratteste hundremeteren på hele turen ligger mellom 1900 og 2000 moh og måler 17,0 grader i snitt; bratteste sammenhengende parti på linja er 23,2 grader. Så sørvestover opp på ryggen ved Brue på 2047 moh, og vest-sørvest langs den slake ryggen de siste 210 høydemeterne. Ikke gå opp Besshøbrean til Brue, slik hyttas egen beskrivelse kan leses: overgangen fra breen til ryggen stiger fra 2004 til 2050 moh på 26 meter grunn, altså rundt 60 grader.",
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
        body: "Oppstigningen er lite bratt terreng: bratteste sammenhengende parti på linja måler 23,2 grader, og den bratteste hundremeteren, 1900 til 2000 moh, holder 17,0 grader i snitt. Austryggen selv ligger på 18 til 20 grader. Det som teller på ruta er ryggen inn mot Brue, der nordsida bryter av i 50 til 60 grader ned mot Besshøbrean innen to hundre meter fra sporet, mens sørsida er slak og bred — et spor som trekker nordover mot le er et annet spor enn det du planla.",
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
      path: "M0,200 L23,192 L47,184 L67,170 L95,159 L120,149 L143,144 L165,142 L188,142 L213,142 L239,142 L267,142 L295,142 L323,142 L351,142 L374,142 L394,137 L414,126 L436,113 L454,101 L470,91 L492,77 L512,65 L537,48 L560,38 L577,27 L599,18 L600,18",
      startLabel: "961 moh",
      endLabel: "2257 moh",
      distanceLabel: "9,6 km",
      caption: "1305 høydemeter og 9,58 km fra Bessheim til toppen, der tre og en halv kilometer av dem er flatt vatn på 1372 moh.",
    },
  },
  fanaraken: {
    slug: "fanaraken",
    intro:
      "Høyfjellstur fra Sognefjellsvegen til 2068 moh, med Fannaråkhytta på selve toppunktet. Få høydemeter og slake vinkler — men ruta går over bre, og det bestemmer utstyret.",
    ascent: [
      "Du starter på Korpen, parkeringen på rv55 ved Prestesteinsvatnet, 1397 moh. Første kilometeren og litt til går nedover: følg vestsida av vatnet ned til demninga ved utløpet på 1343 moh. Du gir fra deg 53 høydemeter før du har begynt å stige. Hold land langs vestsida — ikke skjær over isen.",
      "Forbi demninga trekker du opp i søkket øst for nordryggen til Steindalsnosi og inn på Fannaråkbreen rundt 1550 moh. Hold deg lavt og i den slake delen av breen. Den er oppsprukket, og du går den i tau.",
      "Sikt deg inn mot 1688-høgda øst for Fannaråknosi og rund den. Ikke hold høyde over breen: går du for høyt før du svinger opp, blir passasjen opp på austryggen vesentlig brattere. Den bratteste hundremeteren ligger mellom 1800 og 1900 moh og holder 19,7° i snitt, og det bratteste enkelttrinnet på linja måler 42,7°.",
      "Rundt knausen kommer du inn på søraustryggen og sommerstien fra Keisarpasset. Følg den over Fannaråknosi og videre langs austryggen til Fanaråken. Det henger store skavler på nordsida hele vegen, og nordsida faller 55–58° i de øverste 90 metrene under kammen — hold deg på sørsida, også når sikten er god.",
    ],
    descent: [
      "Ned følger du samme linja — øst- og nordøstvendt, jevnt og slakt, med pålitelig vårsnø langt ut i sesongen. Den andre dokumenterte ruta, fra Turtagrø gjennom Helgedalen, gir 1196 høydemeter og er en annen dag.",
      "Vanligste feil: å holde høyde over breen på vei ned, slik at du havner for høyt vest for 1688-høgda og må ned der det er brattest. Slipp deg ned rundt knausen slik du kom opp. Og husk at siste strekket ikke er gratis: fra demninga stiger det 53 høydemeter tilbake til Korpen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalvegen er slak — bratteste hundremeter holder 19,7° i snitt mellom 1800 og 1900 moh. Det bratteste enkelttrinnet på linja måler 42,7°, og det ligger i overgangen fra breen opp på austryggen rett øst for Fannaråknosi; går du for høyt over breen, blir den passasjen brattere enn den trenger å være. På Fannaråkbreen er sprekkene faren like mye som snøen.",
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
      path: "M0,183 L21,187 L45,188 L70,188 L93,190 L114,193 L136,197 L158,199 L183,190 L199,185 L221,176 L240,172 L264,161 L286,156 L305,148 L325,142 L349,138 L378,135 L402,131 L422,117 L447,101 L468,81 L483,69 L500,51 L516,39 L536,37 L557,33 L581,26 L600,18",
      startLabel: "1397 moh",
      endLabel: "2068 moh",
      distanceLabel: "6,6 km",
      caption: "763 høydemeter fra Korpen til toppen — 89 av dem gir du fra deg, de fleste før stigningen begynner.",
    },
  },
  kvamshesten: {
    slug: "kvamshesten",
    intro:
      "838 høgdemeter på 4,93 km frå Rytnavegen, det meste av det slakt — og så ei skål på slutten som måler om lag 36 grader i snitt frå Grunnevatnet til toppen. Isøks og stegjern står i utstyrslista av den grunn.",
    ascent: [
      "Start ved vegenden på Rytnavegen, 404 moh — den private vegen som er skilta mot parkering til Storehesten. Fri Flyt oppgjev to vertikalar for dette fjellet, og dei er to ulike startar: 960 høgdemeter frå Rytnane nede på 209 moh, og 810 herifrå.",
      "Følg skogsvegen oppover mot Kårstadstølen på 495 moh, og hald deretter aust mot Rabbane på 512. Ruta går austover før ho snur nordover — det ser ut som ein omveg på kartet, og det er den skildra vegen.",
      "Frå Rabbane går det nordover mot skaret aust for Skaravatnet på 715 moh. Partiet mellom 700 og 800 moh er det slakaste på turen, 3,9 grader over 1485 meter grunn. Ruta held nordsida av vatnet vestover og rundar Grunnevatnet på 785 moh.",
      "Vest for Grunnevatnet tek du litt høgde og følgjer så den markerte skålformasjonen sørover heilt opp. Dette er den bratte delen: bandet frå 1000 til 1100 moh måler 22,8 grader i snitt over 237 meter grunn, og brattaste samanhengande parti 27,4 grader mellom 997 og 1015 moh. Frå Grunnevatnet til varden på 1209 moh er det 424 høgdemeter på 581 meter grunn — om lag 36 grader i snitt over heile skåla.",
    ],
    descent: [
      "Ned same skåla og attende over Grunnevatnet, Skaravatnet og Rabbane. Fallretninga er nord, og skåla er både oppstigninga og nedkøyringa.",
      "Vanlegaste feil: å gå opp skåla på hardt føre utan isøks og stegjern. Fri Flyt fører begge delar som naudsynt utstyr på denne turen, og grunnen står i tala — 36 grader i snitt over dei siste 424 høgdemetrane er ikkje ein bakke ein sklir kontrollert nedover.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak til 900 moh og bratt over. Skålformasjonen sør for Grunnevatnet er skredterreng: bandet frå 1000 til 1100 moh måler 22,8 grader i snitt, brattaste samanhengande parti 27,4 grader mellom 997 og 1015 moh, og heile strekket frå Grunnevatnet til toppen ligg på om lag 36 grader.",
      },
      {
        title: "Terrenget rundt",
        body: "Skåla er den eine store vurderinga på turen, og ho har ingen omveg: ruta går opp gjennom henne. Hardt føre gjer siste stigninga til ei klyving heller enn ein skitur, og det er då isøks og stegjern går frå å vere utstyr i sekken til å vere det du står på.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,198 L22,197 L44,192 L60,183 L79,179 L93,174 L115,172 L137,169 L164,164 L186,152 L209,145 L224,134 L252,129 L279,126 L301,125 L328,124 L345,119 L378,113 L405,110 L422,103 L448,89 L464,79 L482,72 L502,65 L520,52 L542,36 L564,30 L588,21 L600,18",
      startLabel: "404 moh",
      endLabel: "1209 moh",
      distanceLabel: "4,9 km",
      caption: "838 høgdemeter og 4,93 km frå Rytnavegen over Kårstadstølen, Skaravatnet og Grunnevatnet, med den bratte skåla mellom 1000 og 1100 moh.",
    },
  },
  rasletinden: {
    slug: "rasletinden",
    intro:
      "En 2104-meter for de fleste: 746 høydemeter fra Valdresflye, og bratteste sammenhengende parti på linja måler 21,6 grader. Det som gjør turen krevende er været og vidda — den blir vanskelig i dårlig sikt, ikke i dårlig føre.",
    ascent: [
      "Start på parkeringa på østsida av fv51 der Valdresflya vandrerhjem sto før brannen i 2015, 1391 moh. Vegen er det som setter sesongen: fv51 er brøytet vinteren gjennom bare til Bygdin, og strekninga nordover forbi vandrerheimen åpner normalt rundt 1. april.",
      "Herfra går ruta vestover ut på vidda, sør for Fisketjerne. De første 1,2 kilometerne er helt flate og faller faktisk ti høydemeter — du kommer til å stake dem, og du kommer til å stake dem hjem igjen. Vidda er samtidig helt åpen og gir ingen ly.",
      "Så stiger det jevnt mot den første kneika på rundt 1530 moh og videre opp på ryggen ved 1736 moh. Ryggen følges vestover, sør for Øystre Rasletinden (2011 moh), til rundt 1890 moh. Merk at sporet her ikke ligger på en rygg i skredfaglig forstand: mellom 1810 og 1890 moh går det under sørsida av Øystre Rasletinden, som stiger 130 høydemeter rett over deg med et parti på 47 grader. Ikke gå over Øystre Rasletinden: aust- og sørøstsida av den toppen måler 42 til 50 grader, og linjer inn dit fra aust får steg på 51 til 63.",
      "Til slutt den korte kneika opp mot toppplatået. I fallinja måler den 31 til 35 grader mellom 1910 og 1960 moh; over 1960 slakner den til 16 til 20 inn mot platået. Det er ett av to steder på ruta med et samlet bratt heng over deg — det andre kommer lenger nede, på ryggen under Øystre Rasletinden. Linja som er tegnet legger seg på skrå over den og holder 21,6 grader som bratteste sammenhengende parti; den bratteste hundremeteren, 1900 til 2000 moh, måler 17,6 grader i snitt. Over kneika er det ut på platået og de siste hundre meterne til 2104 moh.",
    ],
    descent: [
      "Ned samme vei: kneika, ryggen østover sør for Øystre Rasletinden, ned til 1736 og videre ned første kneik til vidda. Under første kneik, fra 1531 moh, er det slutt på kjøringa — de siste to kilometerne over vidda er flate, og de ti høydemeterne du fikk gratis på vei ut skal betales tilbake.",
      "Vanligste feil: å ta ut kursen nordover fra toppplatået fordi det ser slakt ut. Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare aust og nordaust er slake — aust måler 26 grader, nordaust 32 — og det er den vegen du kom.",
      "Waypointet på 1890 moh ligger på det terrengmodellen klassifiserer som snø og is. Det er en permanent snøfonn, ikke en sprukken bre: Leirungsbrean og Kalvehøgdbreene ligger fire kilometer lenger vest og sør.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nesten hele ruta er slak: første kneik måler 22 til 24 grader, ryggen 23, og bratteste sammenhengende parti på linja 21,6 grader. To steder har et samlet bratt heng over seg. Kneika under toppplatået måler 31 til 35 grader i fallinja mellom 1910 og 1960 moh. Og ryggtraversen mellom 1810 og 1890 moh går under sørsida av Øystre Rasletinden: 130 høydemeter rett over sporet, 34 grader i snitt og 47 på det brattaste. Begge steder legger sporet seg på skrå, men snøen over deg bryr seg ikke om sporet — og et sørvendt heng i april er nettopp det du vurderer tidlig på dagen.",
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
      path: "M0,196 L28,197 L53,198 L78,199 L99,200 L127,199 L148,197 L177,192 L197,187 L218,179 L244,166 L263,149 L284,135 L304,118 L325,110 L347,109 L370,112 L395,108 L420,101 L445,98 L465,90 L486,84 L506,69 L524,54 L548,37 L572,29 L597,19 L600,18",
      startLabel: "1391 moh",
      endLabel: "2104 moh",
      distanceLabel: "6,6 km",
      caption: "746 høydemeter og 6,55 km fra Valdresflye, der de første 1,2 kilometerne er flate og faller ti meter.",
    },
  },
  molden: {
    slug: "molden",
    intro:
      "623 høgdemeter på 3,01 km frå Mollandsmarki opp sørvestryggen, med Lustrafjorden under seg heile vegen. Brattaste hundremeteren måler 14,8 grader, og brattaste samanhengande parti 24,8 — det ligg nede i skogen, ikkje på ryggen.",
    ascent: [
      "Start på den kartfeste parkeringa på Mollandsmarki, 501 moh, over Marifjøra i Luster. Dei fyrste hundre metrane grunn er flate — bandet frå 400 til 500 moh måler 0,5 grader — før vegen mot Garden tek til å stiga.",
      "Følg vegen og deretter sommarstien opp gjennom skogen. Stigninga er jamn og utan overraskingar: 10,7 grader frå 500 til 600 moh, 14,4 frå 600 til 700 og 14,2 frå 700 til 800. Brattaste samanhengande parti på heile turen ligg her nede, 24,8 grader over tretti meter mellom 725 og 746 moh.",
      "Skogen held til 849 moh. Over tregrensa, ved om lag 816 moh, tek du inn på sørvestryggen, og han fører heile vegen opp. Brattaste hundremeteren er 900 til 1000 moh med 14,8 grader i snitt — det er dei bratte punkta rutebeskrivinga varslar om, og dei er korte.",
      "Frå 1000 moh slakkar det av att: 8,9 grader frå 1000 til 1100 moh og 6,5 over det, med varden på 1120 moh. Austtoppen på same høgd ligg like ved for den som vil ha utsikta frå begge.",
    ],
    descent: [
      "Ned same ryggen, sørvestover. Ryggen er brei, og på stabile dagar kan ein òg køyre rett vestover frå toppen.",
      "Vanlegaste feil: å velje den vestlege linja utan å tenkje på kvar ho endar. Går du vestover i staden for å følgje ryggen ned, hamnar du i den tette skogen under 849 moh, og det er ein lang og lite triveleg måte å komme attende til bilen på.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Brei sørvestrygg med jamn stigning. Brattaste hundremeteren, 900 til 1000 moh, måler 14,8 grader, og brattaste samanhengande parti 24,8 grader mellom 725 og 746 moh — nede i skogen, der terrenget er kort og oversiktleg.",
      },
      {
        title: "Terrenget rundt",
        body: "Sørvestryggen har eit par brattare punkt den siste biten opp, og dei er verdt å sjå på når snøen er ustabil. Vestsida under toppen er den andre vurderinga: ho blir køyrd på stabile dagar, og ho endar i tett skog.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Indre Sogn på varsom.no. Ta med sender/mottakar, søkjestang og spade — ei tom side betyr ikkje trygt fjell.",
      },
    ],
    elevationProfile: {
      path: "M0,199 L28,200 L45,195 L72,188 L90,184 L108,178 L126,171 L144,164 L165,156 L180,150 L207,141 L225,134 L243,126 L260,119 L269,117 L287,112 L314,103 L332,93 L350,87 L376,77 L395,68 L407,62 L431,56 L449,50 L466,42 L484,38 L511,35 L529,31 L554,28 L574,21 L592,19 L600,18",
      startLabel: "501 moh",
      endLabel: "1120 moh",
      distanceLabel: "3,0 km",
      caption: "623 høgdemeter og 3,01 km frå Mollandsmarki, med skoggrensa på 849 moh og brattaste hundremeteren mellom 900 og 1000 moh.",
    },
  },
  synshorn: {
    slug: "synshorn",
    intro:
      "Kort tur rett opp fra Bygdin, med 360 graders utsikt fra toppen — Jotunheimen i nord, Bygdin i vest, Bitihorn i sør. 428 høydemeter på knapt to kilometer gjør dette til turen du tar når værvinduet er kort.",
    ascent: [
      "Start på parkeringen ved Fagerstrand på østsida av Bygdin, like ved Bygdinstøga og Bygdin Høifjellshotell. Avgift 80 kroner, betales med Vipps. Fv51 er vinterstengt nordover, så Bygdin er den brøytede enden av vegen og plassen er tilgjengelig hele våren. Du er over skoggrensa fra første skritt, og stigningen begynner med en gang.",
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
  skogshorn: {
    slug: "skogshorn",
    intro:
      "836 høgdemeter på 3,77 km frå Trefta, jamnt og breitt heile vegen: brattaste samanhengande parti på linja måler 23,2 grader. Ei god fyrste toppturhelg i Hemsedal — så lenge du ikkje forvekslar normalruta med Skogshornrenna.",
    ascent: [
      "Start på den store parkeringa ved Hyndra bru nedanfor Trefta på Lykkjavegen, 893 moh. Dei fyrste sju hundre metrane deler grunn med preparerte langrennsspor; ruta forlèt løypetraseen så snart ho byrjar å stiga. Kryss elva og gå opp lia på vestsida.",
      "Vidare nordvestover over det opne beltet på 1000 til 1100 moh. Bjørka held til rundt 951 moh, og over 1000 er alt ope. Både den kartlagde skitur-traseen og den merkte sommarstien går her, 200 til 400 meter nord for sjølve ryggkammen, på den breie nordaustskuldra — det er den linja som er teikna, og ho er slakare enn kammen.",
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
      path: "M0,200 L21,198 L49,194 L71,191 L92,187 L121,181 L143,177 L171,169 L193,163 L219,156 L236,153 L257,148 L279,143 L300,138 L322,130 L343,121 L364,112 L386,102 L403,94 L422,86 L443,76 L457,69 L479,57 L497,48 L508,44 L536,32 L552,30 L579,24 L600,18",
      startLabel: "893 moh",
      endLabel: "1729 moh",
      distanceLabel: "3,8 km",
      caption: "836 høgdemeter og 3,77 km frå Trefta, med brattaste hundremeteren på 19,7 grader mellom 1500 og 1600 moh.",
    },
  },
  storehorn: {
    slug: "storehorn",
    intro:
      "Kort vei fra bilen til en topp som ser ut over hele Hemsedal. Turen starter allerede over skoggrensa, og terrenget er åpent fra første steg — en fin førstetur på ski i dalen, og en rask formiddagstopp for den som kjenner den.",
    ascent: [
      "Fra Hornslie, der Torsetstølvegen ender på 1056 moh, går du rett opp den første bakken. Den er kortere enn den ser ut — den første hundremeteren, 1000–1100 moh, ligger på 18,8° i snitt — og over kanten flater det ut. Her er ingen skog å forholde seg til: hele turen går i åpent terreng.",
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
      path: "M0,200 L17,188 L45,171 L65,155 L81,150 L108,138 L126,132 L153,124 L171,124 L198,127 L216,130 L234,129 L251,130 L270,132 L296,137 L315,140 L343,142 L370,142 L397,142 L415,139 L433,126 L446,121 L460,112 L469,106 L484,93 L496,85 L514,81 L523,74 L535,66 L550,54 L560,47 L577,33 L588,25 L600,18",
      startLabel: "1056 moh",
      endLabel: "1478 moh",
      distanceLabel: "3,0 km",
      caption: "471 høydemeter og 2,99 km fra Hornslie til toppen, med 45 meter gitt tilbake i Hødnetjedne-bassenget.",
    },
  },
  storanosi: {
    slug: "storanosi",
    intro:
      "735 høgdemeter på 4,43 km frå Ljosno: open bjørkeskog nedst, og eit vidt platå over Eggjane der bandet frå 1100 til 1200 moh måler 3,1 grader over 1756 meter grunn. Brattaste hundremeteren ligg mellom 1000 og 1100 moh og måler 18,8 grader.",
    ascent: [
      "Start ved vegenden på Ljosnavegen i Brandsetdalen, 510 moh, aust for Voss. Dei fyrste 587 metrane grunn er tilnærma flate — bandet frå 500 til 600 moh måler 8,9 grader i snitt.",
      "Følg bjørkeskogen oppover mot nordsida av Middagshovden. Skogen held til 795 moh, og over det er alt ope. Kartverket fører terrenget mellom 877 og 957 moh som skytefelt; sjekk skiltinga lokalt før du legg turen dit.",
      "Før toppen av hovden tek du av mot Eggjane. Brattaste hundremeteren på turen ligg her, 1000 til 1100 moh med 18,8 grader i snitt, og brattaste samanhengande parti måler 26,3 grader mellom 1085 og 1107 moh.",
      "Frå Eggjane på 1179 moh er det halvanna kilometer platå vestover til Storanosi, 1205 moh. Bandet frå 1100 til 1200 moh måler 3,1 grader over 1756 meter grunn — det er den delen av turen som gjer han lang heller enn bratt, og linja gjev til saman 40 høgdemeter attende undervegs.",
    ],
    descent: [
      "Ned same vegen, nordaustover over platået og ned gjennom bjørkeskogen til Ljosno. Fjellet er kjent for tørrsnø når austavinden har stått på i fleire dagar, og det er platået og den opne skogen som held på den snøen.",
      "Vanlegaste feil: å ta den austlege renna frå toppen fordi ho ser ut som ei kortare veg ned. Renna er 30 grader bratt og er ei eiga vurdering — ho er ikkje normalruta, og ho endar ikkje der bilen står.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slak heile vegen: brattaste hundremeteren, 1000 til 1100 moh, måler 18,8 grader, og brattaste samanhengande parti 26,3 grader mellom 1085 og 1107 moh. Platået frå 1100 til 1200 moh ligg på 3,1 grader — det er orienteringa i dårleg sikt, ikkje hellinga, som er utfordringa der oppe.",
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
      path: "M0,200 L25,195 L43,189 L67,181 L86,173 L104,164 L122,157 L141,148 L165,134 L183,125 L208,114 L226,106 L244,97 L269,84 L287,80 L311,74 L330,66 L348,54 L360,44 L380,34 L402,27 L419,25 L439,27 L458,31 L482,30 L500,25 L519,22 L537,22 L555,23 L576,20 L592,20 L600,18",
      startLabel: "510 moh",
      endLabel: "1205 moh",
      distanceLabel: "4,4 km",
      caption: "735 høgdemeter og 4,43 km frå Ljosno i Brandsetdalen, med skoggrensa på 795 moh og halvanna kilometer slakt platå frå Eggjane til varden.",
    },
  },
  lonahorgi: {
    slug: "lonahorgi",
    intro:
      "1307 høgdemeter frå 139 moh — ein av dei lengste samanhengande stigningane på Voss, og teknisk sett ein av dei enklaste. Brattaste samanhengande parti på linja måler 28,9 grader, og nordryggen dei siste 107 høgdemetrane er nesten flat.",
    ascent: [
      "Frå E16 ved Grotlandsbrua, om lag ein kilometer nord for enden av Lønavatnet, tek du av mot vest og køyrer Høylandsvegen opp til den nedlagde garden Høyland, 139 moh. Der tek skogsbilvegen over. Merk at brøyting heilt fram ikkje er dokumentert — det er ein grusveg til ein nedlagd gard, ikkje ein vinterveg.",
      "Følg skogsbilvegen sørvestover til Bergsstølen på 380 moh og vidare opp det trange dalføret ved Breiming, 610 moh. Skogen held til rundt 544 moh og terrenget er ope frå 646. Det trange partiet ved Breiming er skredterreng — det er den eine staden på turen der du står i eit søkk med sider over deg.",
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
  horndalsnuten: {
    slug: "horndalsnuten",
    intro:
      "1121 høgdemeter på 5,93 km frå Skiple i Raundalen, med halvannan kilometer flat innmarsj før terrenget tek til å stiga. Brattaste samanhengande parti måler 31,4 grader og ligg mellom 1093 og 1116 moh — nordvend, og siste kneika til toppen er brattaste delen av ruta.",
    ascent: [
      "Start ved den kartfeste parkeringa ved brua over Raundalselvi ved Skiple, 398 moh, om lag tjue kilometer aust for Voss. Dei fyrste 1490 metrane grunn er tilnærma flate — bandet frå 300 til 400 moh måler 0,8 grader — og ruta kryssar elva tidleg.",
      "Følg traktorvegen forbi Horndalsbruni og inn i Horndalsbotnen på 757 moh. Skogen held til 731 moh, og i den øvre lia mot Bjørnsetstølen er det skredbaner; hald deg i skogen der nede.",
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
      caption: "1121 høgdemeter og 5,93 km frå Skiple gjennom Horndalsbotnen, med skoggrensa på 731 moh og skuldra på 1153 moh før toppkneika.",
    },
  },
  folarskardnuten: {
    slug: "folarskardnuten",
    intro:
      "Buskeruds høgaste, og ein tur der 12,61 km og 967 høgdemeter kjem nesten heilt utan bratt terreng. Det einaste trinnet som krev noko står ut av Folarskardet, og det er kort — resten er lang, jamn innmarsj over Hallingskarvet.",
    ascent: [
      "Frå p-plassen ved Rv7 på Haugastøl, 1007 moh, følgjer du den kvista DNT-vinterruta mot Raggsteindalen nordover. Dei fyrste elleve kilometrane er innmarsj: over stigninga på 1212 moh, ut på flatene under Folarskardet på 1326 moh, og i alt rundt 600 høgdemeter fordelte så tynt at bandet mellom 1200 og 1300 moh måler 1,6 grader i snitt. Det er stakelende, ikkje skinnlende.",
      "Ved Lordehytta i Folarskardet, 1620 moh, går du av merkinga. Hytta er frå 1880 og står i sjølve skardet; tjørna like ved ligg på 1603 moh og er vatn under snøen. Rutebeskrivinga seier at ein forlèt merkinga ved tjørna og følgjer varder oppover, og det er den linja som er teikna her — ikkje straklinja frå hytta mot toppen, som måler 40,3 grader som verste steg.",
      "Trinnet ut av skardet er turens einaste bratte parti: 35 til 40 grader, målt til 36,7 grader over 41 meter på den slakaste ramma nokon finn. Linja skrår over trinnet i staden for å ta det rett på, og les difor lågare: 27,2 grader over det brattaste 30-metersvindauget, mellom 1775 og 1808 moh. Bandsnittet på 18,7 grader for 1700 til 1800 moh er eit snitt over 320 meter grunn og skjuler trinnet heilt. Er snøen hard eller avblåsen, er det her folk tek på seg stegjern.",
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
      path: "M0,200 L18,187 L42,182 L63,180 L87,176 L108,174 L134,169 L158,167 L183,164 L205,161 L226,158 L245,157 L267,157 L293,156 L316,153 L338,147 L361,143 L383,140 L402,132 L423,124 L445,119 L468,113 L492,96 L515,83 L539,74 L556,49 L574,37 L599,18 L600,18",
      startLabel: "1007 moh",
      endLabel: "1932 moh",
      distanceLabel: "12,6 km",
      caption: "967 høgdemeter og 12,61 km frå Haugastøl, der elleve av kilometrane er innmarsj og eitt kort trinn ut av Folarskardet er alt som er bratt.",
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
  vesoldo: {
    slug: "vesoldo",
    intro:
      "838 høgdemeter frå Byrkjenes, og ein tur som blir slakare dess høgare du kjem: bratt skogsli nedst, open og jamn rygg over. Toppkuppelen er lettvint å gå — men han ligg eit par hundre meter over stupa mot vest og nordvest, og ein halv kilometer over dei mot nord, og i flatt lys er kanten ikkje synleg.",
    ascent: [
      "Frå parkeringa ved Byrkjenes, 211 moh, innerst på Tordalsvegen nord for Strandebarm, går du opp den bratte skogkledde lia mot Fadnastølen, 498 moh. Dette er den brattaste delen av turen: brattaste hundremeteren ligg mellom 300 og 400 moh og måler 16,7 grader i snitt. Tordalsvegen er privat bomveg, og brøyting heilt fram til parkeringa er ikkje garantert — ring eller sjekk før du køyrer langt.",
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
      path: "M0,200 L23,194 L40,187 L57,180 L79,173 L95,163 L114,153 L139,146 L162,137 L182,134 L203,127 L228,125 L244,120 L257,113 L269,106 L291,100 L311,92 L336,82 L367,75 L387,72 L413,63 L438,54 L463,49 L484,44 L508,38 L527,33 L559,30 L584,22 L600,18",
      startLabel: "211 moh",
      endLabel: "1046 moh",
      distanceLabel: "4,2 km",
      caption: "838 høgdemeter og 4,25 km frå Byrkjenes, med det brattaste — 16,7 grader mellom 300 og 400 moh — nede i skogslia.",
    },
  },
  gygrastolen: {
    slug: "gygrastolen",
    intro:
      "1267 høgdemeter frå 90 moh — fjord til topp på 5,96 km, med Folgefonna rett framfor deg på ryggen. Brattaste samanhengande parti måler 25,4 grader, så det er lengda og ikkje hellinga som avgjer dagen.",
    ascent: [
      "Start der anleggsvegen tek av oppover frå Ænes, 90 moh; kyrkja som rutebeskrivinga nemner ligg på 41 moh nede ved fjorden. Dei fyrste hundre høgdemetrane går på 6,3 grader, og så tek vegen fatt: 11,3 grader frå 100 til 200 moh og 12,9 frå 200 til 300.",
      "Følg stien vidare mot Gygrastølvatnet på 492 moh. Bandet frå 400 til 500 moh er det slakaste på turen, 5,6 grader over 1035 meter grunn — det er flata rundt vatnet.",
      "Frå vatnet går du opp på sjølve ryggen og følgjer han. Skogen held til 577 moh; over det er alt ope. Stigninga er jamn og aukar gradvis: 16,8 grader frå 600 til 700 moh, 19,4 frå 800 til 900 og 19,8 frå 1000 til 1100, som er brattaste hundremeteren. Brattaste samanhengande parti måler 25,4 grader mellom 1042 og 1063 moh.",
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
      caption: "1267 høgdemeter og 5,96 km frå Ænes over Gygrastølvatnet, med skoggrensa på 577 moh og ryggen over 1300 moh på 4,7 grader.",
    },
  },
  juklavasstinden: {
    slug: "juklavasstinden",
    intro:
      "1341 høgdemeter på 7,16 km frå Myrdalsvatnet — og 347 av dei blir gjevne frå seg undervegs. Ruta går opp på ryggen over Omnetjørnene, aust ned mot Møsetjørna og opp nordryggen til ein topp som ber skavl.",
    ascent: [
      "Start ved vegen ved Myrdalsvatnet, 367 moh, i Uskedalen. Følg vegen litt tilbake til ein traktorveg og følg denne til Nipelva kjem til syne. Skogen held til 531 moh.",
      "Følg elva oppover til ryggen over Omnetjørnene. Det er her stigninga står: 18,4 grader frå 500 til 600 moh og 20,0 frå 600 til 700, med brattaste samanhengande parti på 30,8 grader mellom 995 og 1022 moh. Ryggen toppar seg på 1033 moh.",
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
      "Over tregrensa reiser lia seg. Mellom 600 og 700 moh holder den 20,3° i snitt over hundre høydemeter, og det bratteste hundremeterspennet på turen kommer høyere: 22,5° mellom 900 og 1000 moh. Begge er noe du vil ha unnagjort tidlig på dagen. Toppen av bakken er Skarshaug, 806 moh, halvveis til Melderskin.",
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
        body: "Den bratteste hundremeteren ligger mellom 900 og 1000 moh og holder 22,5°; bratteste enkeltsteg på linja måler 27,3°. Linja selv passerer aldri 30°, men den ligger i lia du må gjennom uansett, og lia er brattere enn sporet gjennom den. Ta den vurderingen nede ved skogkanten, mens det ikke koster deg noe å snu.",
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
      path: "M0,200 L22,197 L54,193 L75,186 L98,179 L123,172 L139,165 L155,158 L170,151 L186,144 L213,133 L232,125 L250,116 L274,106 L293,102 L312,93 L330,84 L351,74 L367,67 L388,61 L415,56 L442,52 L468,49 L493,47 L521,43 L537,38 L553,31 L580,21 L600,18",
      startLabel: "154 moh",
      endLabel: "1426 moh",
      distanceLabel: "5,1 km",
      caption: "154 til 1426 moh på 5,1 km. Bratteste hundremeteren ligger mellom 900 og 1000, over Skarshaug.",
    },
  },
  gaustatoppen: {
    slug: "gaustatoppen",
    intro:
      "Sør-Norges mest markante topp, og en av de snilleste å gå på ski: 973 høydemeter fra Langefonn, og ikke et steg over 25° på hele oppstigningen.",
    ascent: [
      "Fra parkeringen ved Langefonn turisthytte, 922 moh, følger du den vinterstengte veien mot Stavsro. Etter 850 meter står du ved Svineroisetra, 1021 moh — det er kilometeren beskrivelsene snakker om. Bjørkebeltet slipper taket rundt 970 moh, og derfra er alt åpent fjell. Østryggen kan også nås fra Stavsro med 706 høydemeter, men veien dit er vinterstengt.",
      "Ved setra tar du av veien svakt til høyre, sørvest, og setter kursen mot det laveste punktet på Himmelranden — toppen av Langefonn, 1455 moh. Ikke gå rett opp mot varden herfra. Fallinja fra Svineroisetra rett mot toppen holder 35–37° i øverste tredjedel; traversen mot Langefonn stiger jevnt på 12–16° og passerer aldri 25°, og det er den linja denne ruta følger.",
      "Fra det laveste punktet vender du vest-nordvest og følger eggen. Stigningen er jevn: den bratteste hundremeteren på hele turen ligger mellom 1700 og 1800 moh og måler 15,8°, og bratteste enkeltsteg er 24,0°. Underveis kommer du inn på sommerstien fra Stavsro.",
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
        body: "Linja fra Langefonn holder seg under 25° hele veien til varden: bratteste enkeltsteg måler 24,0°, og den bratteste hundremeteren, mellom 1700 og 1800 moh, holder 15,8°. Selve oppstigningen er lite skredterreng. Det som flytter regnestykket er vinden — den blåser eggen bar og legger snøen i rennene på østsiden.",
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
  gyranfisen: {
    slug: "gyranfisen",
    intro:
      "666 høydemeter på 5,36 km fra Vikerkoia, 661 moh, til Ringerikes høyeste punkt på 1127. Differansen mellom de to tallene er søkket: ruta klatrer opp på Svarttjernskollen, 1054 moh, faller ned mot Fjelldalen og går opp igjen, og gir tilbake 200 høydemeter som kommer igjen som stigning på vegen hjem.",
    ascent: [
      "Start på parkeringa ved Vikerkoia på Vikerseterveien, 661 moh — Kartverket klasser punktet som myr, og det er en presis beskrivelse av Vikerfjell. De første høydemeterne er slake, 5,1 grader fra 600 til 700 moh, før skogen tar over ved 698 moh.",
      "Stigningen opp mot Svarttjernskollen er den bratteste på turen: 15,4 grader fra 700 til 800 moh over 360 meter grunn, med bratteste sammenhengende parti 24,9 grader mellom 767 og 788 moh. Ved 916 moh er du fortsatt i skog, og på 1050 moh er du ute i åpent terreng.",
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
      caption: "666 høydemeter og 5,36 km fra Vikerkoia over Svarttjernskollen, med skoggrensa på 911 moh og 200 høydemeter gitt tilbake i søkket underveis.",
    },
  },
  grafjell: {
    slug: "grafjell",
    intro:
      "581 høydemeter på 7,84 km fra Tempelsetra til Norefjells høyeste punkt. Ruta er slakere enn nabotoppene — bratteste hundremeteren, 1300 til 1400 moh, måler 10,0 grader — og lengre enn dem alle. Vanskeligheten er ikke hellinga, men at orienteringspunktene på de første fem kilometerne er tjern.",
    ascent: [
      "Start bak Tempelsetra kafè, 910 moh, og følg løypa mot Istjenn. Skogen slipper taket allerede ved 937 moh, og på 950 moh går ruta ut på Istjenn — Kartverket klasser punktet som innsjø, og det er det første av to vann ruta går ut på isen på — Donkelitjenn er det andre.",
      "Videre nordover forbi Vesletjenn på 1095 moh. Dette er den flate delen: bandet fra 900 til 1000 moh måler 2,2 grader over 2472 meter grunn, 1000 til 1100 måler 3,6 over 1564, og 1100 til 1200 bare 2,9 over 1902 meter. Fem kilometer går med før du står på 1156 moh, og i dårlig sikt er det her turen faktisk er krevende.",
      "Ved Donkelitjenn, 1156 moh, kaller ut.no turen halvgått, og oppgir at det er 313 høydemeter igjen. Det er deres løype som er halv der; den routede linja her er kortere og har vannet på to tredeler. Uansett er det herfra det stiger: 7,4 grader fra 1200 til 1300 moh, og et sted mellom 1275 og 1292 moh ligger bratteste sammenhengende parti på turen, 20,7 grader.",
      "Løypa fortsetter nordover til den deler seg rundt 1282 moh, og grenen som dreier østover går opp på Gråfjell. Bandet fra 1300 til 1400 moh er det bratteste, 10,0 grader over 596 meter grunn, og det siste bandet, over 1400 moh, måler 6,4 grader. Varden står på 1466 moh, 4,5 km nordvest for Høgevarde.",
    ],
    descent: [
      "Ned samme vegen — men ikke sørover fra varden. Ruta kommer inn på toppen fra nordvest, så den første kilometeren ned går tilbake dit løypa delte seg på 1282 moh, og først derfra svinger du sørover mot Donkelitjenn. Toppen er rund og flat, og det er verdt å vite hvor rund: radialmålinger fra varden gir 5,2 til 18,3 grader i snitt over 500 meter i alle åtte retninger, og det bratteste 60-metersvinduet på hele fjellet måler 30,2 grader.",
      "Det er derfor Gråfjell er en navigasjonstur og ikke en skredtur. Går du feil ned fra et rundt topplatå i skodde, ender du ikke i en henging — du ender i feil dal, med fem kilometer myr og tjern mellom deg og bilen. Ta peiling på toppen mens du kan se, og hold løypa tilbake over Donkelitjenn.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Slakt høyfjell hele vegen. Bratteste sammenhengende parti måler 20,7 grader, mellom 1275 og 1292 moh, og bratteste hundremeteren, 1300 til 1400 moh, holder 10,0 grader over 596 meter grunn. Tre av punktene Kartverket sampler langs linja er innsjø: Istjenn på 950 moh og Donkelitjenn på 1152 og 1156. Vinterstid er de flate sletter, og de er en del av ruta — men de er is, og isen er ikke terrengmodellens ansvar.",
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
      path: "M0,200 L19,197 L38,193 L58,186 L82,187 L103,187 L126,187 L144,186 L168,179 L193,165 L213,150 L237,148 L261,145 L279,139 L298,139 L316,137 L337,132 L361,121 L385,120 L409,119 L430,116 L454,105 L475,99 L489,90 L509,81 L525,60 L547,46 L571,30 L595,21 L600,18",
      startLabel: "910 moh",
      endLabel: "1466 moh",
      distanceLabel: "7,8 km",
      caption: "581 høydemeter og 7,84 km fra Tempelsetra over Istjenn, Vesletjenn og Donkelitjenn, med skoggrensa på 937 moh og bratteste hundremeteren mellom 1300 og 1400 moh.",
    },
  },
  ranten: {
    slug: "ranten",
    intro:
      "527 høydemeter på 5,56 km fra Tempelseter til den taggete ryggen Th. Kittelsen malte som Soria Moria. Oppstigningen fra Raudmyra er slak — bratteste sammenhengende parti måler 27,1 grader — og sørsida ser slak ut de første hundre meterne fra varden. Så bryter den av i 47 til 60 grader, og det er den vegen den merkede stien går ned.",
    ascent: [
      "Start på parkeringa ved Tempelseter, 910 moh, og følg den T-merkede og blåmerkede ruta over fossen i retning Høgevarde. Skogen slipper taket ved 931 moh, og de neste tre kilometerne er nesten flate: 4,8 grader fra 900 til 1000 moh over 1075 meter grunn, 4,0 fra 1000 til 1100 over 1440 meter, og 3,9 fra 1200 til 1300 over 1516.",
      "Stikrysset på Raudmyra ligger på 1229 moh, og navnet er ikke tilfeldig: Kartverket klasser både punktet på 1216 og punktet på 1229 moh som myr. Her tar du av til venstre, mot Gråfjell, og forlater Høgevarde-løypa.",
      "Nå kommer turen. Bandet fra 1300 til 1400 moh måler 13,9 grader over 405 meter grunn — det er halve stigningen på under en halv kilometer — og mellom 1322 og 1338 moh ligger bratteste sammenhengende parti, 27,1 grader.",
      "Det siste bandet, over 1400 moh, måler 5,7 grader over 120 meter grunn, og der står varden på 1416 moh. Toppen er en smal, taggete rygg, og profilen som gjør fjellet lett å kjenne igjen nedenfra er den samme profilen som gjør at det ikke er mye plass på den.",
    ],
    descent: [
      "Den slake vegen ned er den du kom opp: østover mot Raudmyra, der flanken måler 13,3 grader i snitt over 500 meter. Nord, vest og nordvest er også slake — 10,4, 11,9 og 10,8 grader i snitt, med bratteste 60-metersvinduer på 19,6, 18,8 og 16,8 grader — men de fører deg vekk fra bilen.",
      "Den merkede stien går bratt sørover til Fetjenn på 990 moh, og som skilinje er det en helt annen tur enn oppstigningen — men den ser ikke slik ut fra toppen. Punktmålinger hver tretti meter rett sørover gir først en skulder: 1415,6, 1399,2, 1393,9 og 1395,5 moh, altså 28,6 grader det første steget og så noe som er flatt og til og med stiger litt. Der skulderen slutter, 120 meter ut, faller det 47,2 og 54,5 grader. På peiling 195, som er retningen til Fetjenn, er skulderen enda tydeligere — bakken stiger igjen på 90 meter — og bruddet måler 60,0 grader. Det er rennene randofolk.no mener når de kaller Ranten «en mer alpin topp med brattere nedkjøring» enn Høgevarde. Ta ikke bakken over bruddet som et mål på det som ligger under: kjør dem hvis dette er terreng du kjører til vanlig, og hvis varselet og snøen sier ja; ellers går du tilbake den vegen du kom.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigningen fra Raudmyra er en jevn skråning: 13,9 grader i snitt fra 1300 til 1400 moh, og bratteste sammenhengende parti 27,1 grader mellom 1322 og 1338 moh. De første fire kilometerne fra Tempelseter holder under 6 grader. Ruta i seg selv er ikke problemet på dette fjellet.",
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
      path: "M0,200 L19,199 L38,195 L48,186 L72,177 L92,174 L116,167 L138,164 L155,162 L179,156 L199,153 L218,149 L242,141 L266,133 L284,126 L305,120 L325,114 L344,109 L364,101 L380,96 L398,90 L422,87 L441,85 L461,89 L485,86 L505,78 L526,63 L548,54 L563,41 L582,26 L600,18",
      startLabel: "910 moh",
      endLabel: "1416 moh",
      distanceLabel: "5,6 km",
      caption: "527 høydemeter og 5,56 km fra Tempelseter over stikrysset på Raudmyra, 1229 moh, med skoggrensa på 931 moh og all stigningen i de siste to kilometerne.",
    },
  },
  hogevarde: {
    slug: "hogevarde",
    intro:
      "598 høydemeter på 4,78 km fra Tempelseter, i en oppstaket og som regel oppkjørt løype. Ingen del av oppstigningen er bratt: bratteste sammenhengende parti måler 19,5 grader, mellom 1179 og 1195 moh, og bratteste hundremeteren, 1200 til 1300 moh, holder 11,8 grader i snitt. Det du planlegger etter her er været og østsida, ikke hellinga i sporet.",
    ascent: [
      "Start på parkeringa ved Tempelseter, 910 moh, og gå opp til høyre for skibakken. Løypa er stukket og som regel kjørt, og de første hundre høydemeterne er det slakeste på turen: bandet fra 900 til 1000 moh måler 3,9 grader over 1305 meter grunn.",
      "Over anlegget stiger det jevnt — 8,8 grader fra 1000 til 1100 moh og 7,8 fra 1100 til 1200 — og et sted der inne, mellom 1179 og 1195 moh, ligger bratteste sammenhengende parti på hele turen: 19,5 grader. Ingen av punktene Kartverket sampler langs ruta er klasset som skog. Du starter over skoggrensa og ser hvor du skal hele vegen, og det er en fordel helt til sikten forsvinner.",
      "Fra ryggen på rundt 1190 moh svinger ruta nordøstover mot hytta. Bandet fra 1200 til 1300 moh er det bratteste på turen, 11,8 grader over 496 meter grunn, og over det flater det ut igjen: 7,7 grader fra 1300 til 1400.",
      "DNT-hytta Høgevarde ligger på 1397 moh, og toppen 560 meter lenger nordøst, på 1461. Det siste bandet, over 1400 moh, måler 3,5 grader over 810 meter grunn — flatt, og samtidig den mest værutsatte delen av turen. Gamle Høgevarde turisthytte har kafé i vinterferiene og påsken, og skilt nederst i bakken sier om den er åpen.",
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
  "store-ble": {
    slug: "store-ble",
    intro:
      "670 høydemeter på 6,26 km fra Nordstulvatnet: nesten to kilometer flat skog, en kneik gjennom Langedalen der bandet fra 900 til 1000 moh måler 16,7 grader, og et høyfjellsplatå over. Bratteste sammenhengende parti, 35,2 grader mellom 1290 og 1314 moh, ligger i toppanløpet — og det er den sida beskrivelsene sier du kan måtte klatre opp i lite snø.",
    ascent: [
      "Start på den store parkeringa ved Nordstulvatnet, 714 moh. Ruta går slakt oppover gjennom åpen skog og krysser elva som renner ut av Sønstevatn, 746 moh; randofolk.no beskriver ei bru der. Bandet fra 700 til 800 moh måler 2,9 grader over 1785 meter grunn — det er den flate innmarsjen, og den er lengre enn den ser ut på kartet.",
      "Så kommer stigningen. 10,7 grader fra 800 til 900 moh, og 16,7 grader fra 900 til 1000 over bare 360 meter grunn, som er bratteste hundremeteren på turen. Skogen slipper taket ved 914 moh, og først på 1047 moh er du i åpent terreng for godt. Det er her T-ruta deler seg: opp Langedalen, eller utsiktsløypa om Sigridsbu.",
      "Sigridsbu ligger på 1175 moh, og fra hytta flater det ut. Bandet fra 1100 til 1200 moh måler 3,1 grader over 1890 meter grunn — nesten to kilometer platå med vidåpen utsikt, og linja krysser et tjern på 1162 moh på vegen.",
      "Toppanløpet er det bratte. Mellom 1290 og 1314 moh måler bratteste sammenhengende parti 35,2 grader, og det er sørsida av toppen randofolk.no beskriver som å «karre deg opp» når snøen er tynn. Alternativet i beskrivelsen er å gå langs fjellet og opp fra nordsida, som måler 5,8 grader i snitt. Varden står på 1343 moh.",
    ],
    descent: [
      "To nedkjøringer er beskrevet, og de er ikke like. Samme veg tilbake går ned Langedalen og videre gjennom skogen mot Nordstulvatnet — randofolk.no skriver «vær oppmerksom på utløpssoner!» om akkurat den dalen, både på veg opp og på veg ned. Den andre går ned nordsida og østover mot Kongtjønn på 1225 moh, med et kort stykke til fots før det åpner seg.",
      "Sørøstflanken rett under toppen bryter av i 41,5 grader i 60-metersvinduet 60 til 120 meter ut, og vest gir 45,0 grader lenger nede. Nord og nordvest er de slake, 16,0 og 19,6 grader i bratteste vindu. Blefjell er kupert, og kupert betyr her at linjevalget teller mer enn hellinga du står i: det er utløpet under deg som bestemmer.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Bratteste sammenhengende parti måler 35,2 grader og ligger i toppanløpet, mellom 1290 og 1314 moh. Bratteste hundremeteren er 900 til 1000 moh med 16,7 grader over 360 meter grunn — kneika opp mot skoggrensa. Resten av ruta er slak: 2,9 grader på innmarsjen og 3,1 grader over platået fra 1100 til 1200 moh.",
      },
      {
        title: "Terrenget utenfor",
        body: "Langedalen er stedet på dette fjellet der skred faktisk teller, og kilden sier det selv to ganger: utløpssoner, både i oppstigningen og i nedkjøringa. Rutas eget bratteste steg, 35,2 grader, ligger på sørsida 300 meter fra varden; sørøstradialen ved sida av måler 41,5 grader i bratteste 60-metersvindu, 60 til 120 meter ut, og vestflanken 45,0 grader 430 til 490 meter ut. Nordsida er den slake vegen opp og ned. Over tregrensa er berget hardt og jordlaget tynt, og vinden pakker snøen deretter.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Telemark sør på varsom.no. Telemark sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L29,192 L49,191 L69,191 L90,190 L112,190 L142,186 L164,179 L184,164 L202,155 L228,142 L254,115 L276,104 L297,100 L323,87 L340,72 L370,70 L392,66 L415,66 L433,67 L452,63 L474,59 L500,60 L521,58 L543,56 L560,40 L577,24 L600,18",
      startLabel: "714 moh",
      endLabel: "1343 moh",
      distanceLabel: "6,3 km",
      caption: "670 høydemeter og 6,26 km fra Nordstul, med skoggrensa på 914 moh, Sigridsbu på 1175 og bratteste hundremeteren mellom 900 og 1000 moh.",
    },
  },
  surloytenuten: {
    slug: "surloytenuten",
    intro:
      "456 høydemeter på 6,10 km fra Nordstul, og den slakeste turen i denne delen av Blefjell: bratteste hundremeteren måler 5,3 grader. Ruta går nordover forbi toppen til Vassholet på 993 moh og kommer tilbake sørover langs Surløyterinden — det er derfor de siste kilometerne føles som en rygg og ikke som en bakke.",
    ascent: [
      "Fra nordenden av parkeringa ved Nordstul, 714 moh, går stien ned til høyre og over Esperåa på bru, 730 moh. Hold til høyre og følg den kloppelagte stien til setervollen Sudstul, 727 moh, der DNT-ruta mellom Selsli og Sigridsbu krysser.",
      "Rett før siste hytta på vollen tar du av til høyre på umerket, men godt synlig sti. Nå går det nordover og oppover gjennom skog og myr: bandet fra 700 til 800 moh måler 2,7 grader over 1841 meter grunn og 800 til 900 moh 4,2 grader over 1346. Skogen slipper taket ved 943 moh.",
      "Ved Vassholet, 993 moh, snur ruta. Herfra følger du det ytre høydedraget sørover langs Surløyterinden, 1085 moh, og bratteste sammenhengende parti på hele turen ligger i kneika opp dit: 24,9 grader mellom 994 og 1014 moh.",
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
      caption: "456 høydemeter og 6,10 km fra Nordstul om Sudstul og Vassholet, med skoggrensa på 943 moh og varden på 1097.",
    },
  },
  styggemann: {
    slug: "styggemann",
    intro:
      "549 høydemeter på 9,61 km fra Ravalsjø til Skrims høyeste topp, og de fleste av dem kommer til slutt: de første seks kilometerne holder under 2 grader i snitt per hundremeter. Toppen er den bratte delen — 15,1 grader fra 800 til 900 moh, og austsida rett under varden faller 48,5 grader.",
    ascent: [
      "Start på parkeringa ved Ravalsjø, 483 moh, og følg skilting og merking forbi Ormetangen, 476 moh, og opp lia øst for vatnet. Dette er skogsterreng med oppkjørte løyper, og de er det som gjør turen til en dagstur: bandet fra 400 til 500 moh måler 0,6 grader over 1848 meter grunn.",
      "Videre forbi Skrimsetra, 591 moh, og over Fugleleikskarva, 635 moh. Bandet fra 500 til 600 moh måler 1,8 grader over 3285 meter grunn og 600 til 700 moh 1,4 grader over 3826 — det er over sju kilometer skog og myr mellom 483 og 676 moh. Kartverket klasser punktet på 611 moh som dyrket mark — det er setervollen på Sørmyrseter, like før hytta.",
      "Sørmyrseter ligger på 620 moh, og herfra oppgir DNT rundt 240 høydemeter opp til Styggemann. Nå begynner turen å stige på ordentlig: 14,6 grader fra 700 til 800 moh over 404 meter grunn, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Skogen slipper taket ved 676 moh, og på 820 moh er du i åpent terreng.",
      "Det siste bandet, 800 til 900 moh, er det bratteste: 15,1 grader over bare 244 meter grunn. Ut.no kaller oppstigningen «temmelig bratt». Rådet deres om å sette igjen sekken i stikrysset gjelder den andre adkomsten, fra Ivarsbu i øst, der krysset ligger vest på Jotefjell — 1,26 km sørøst for varden. Varden står på 871 moh, og Styggemannshytta ligger rett ved.",
    ],
    descent: [
      "Ned samme vegen, sørover og så vestover langs løypa. Peilinga fra varden til Sørmyrseter er 172 grader, og akkurat den radialen måler 29,1 grader i bratteste 60-metersvindu, 70 til 130 meter ut, med et steg på 35,1 grader mellom 120 og 150 meter. Noen få grader til hver side endrer tallet mye: 165 grader gir 36,8 og 180 gir 25,1. Fallinja til setra er altså ikke det mildeste valget, og driver du vestover fra den blir det brattere, ikke slakere.",
      "De andre sidene av toppen er ikke det. Aust måler 48,5 grader i 60-metersvinduet 30 til 90 meter under varden, sørøst 45,3 grader 20 til 80 meter ut, og nordaust 43,9 grader. Det er innenfor hundre meter av der du står med kaffekoppen. Sørvest ser slakt ut med 9,0 grader i snitt, men har et 38,6 graders vindu 160 til 220 meter ut — det er den fella på dette fjellet som ikke ser ut som en felle.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Sju kilometer skogsterreng under 2 grader, og så en kilometer som stiger: 14,6 grader fra 700 til 800 moh og 15,1 fra 800 til 900, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Ruta gir tilbake 161 høydemeter over de rullende skogsryggene mellom Ravalsjø og Sørmyrseter.",
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
      caption: "549 høydemeter og 9,61 km fra Ravalsjø om Skrimsetra, Fugleleikskarva og Sørmyrseter, med skoggrensa på 676 moh og all stigningen over 700 moh.",
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
