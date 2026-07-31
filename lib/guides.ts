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
  tromsdalstinden: {
    slug: "tromsdalstinden",
    intro:
      "Tromsøs signaturtopp, og 1206 høydemeter i strekk fra skytebanen i Tromsdalen til varden. Sporet holder seg under 25 grader hele veien — det er lengden, ikke bratthet, som gjør turen.",
    ascent: [
      "Fra parkeringen ved skytebanen innerst i Turistvegen følger du skogsbilvegen sørøstover inn i Tromsdalen. Hold vestsida av Tromsdalselva hele veien; bjørka slipper taket allerede rundt 220 moh, og derfra ligger dalen åpen foran deg. Sommerruta tar NNV-ryggen ut av dalen lenger nede — det er gåruta, ikke skiruta.",
      "Innerst flater dalen ut ved Dalbotnvatnet på 311 moh. Rett før botnen reiser Svarthammaren seg på vestsida — et nordvendt stup som taper nær 100 høydemeter på seksti meter. Hold dalbunnen øst for det og styr mot skaret. Bakken opp til Salen på 740 moh er turens bratteste enkeltparti: rundt 25 grader der sporet legger seg på skrå over den, 30 til 35 i fallinja om du tar den rett på.",
      "Fra Salen slakner det av. Følg sørryggen nordøstover mot varden. Det bratteste sammenhengende beltet på turen ligger mellom 1000 og 1100 moh, med et snitt på 21 grader. Over 1100 moh er østkanten av ryggen skavlet — gå på vestsida av kammen, også når sporet frister lenger ut.",
    ],
    descent: [
      "Ned samme vei: sørryggen til Salen, så vestover ned i indre Tromsdalen og ut dalen til bilen. Fra Salen faller flanken jevnt vestover mot Dalbotnvatnet, og det er der de beste svingene ligger.",
      "Vanligste feil: å slippe seg rett ned vestsida fra toppen. Fra varden ruller vestflanken av på 20 til 35 grader, og det er hele problemet — den ser gåbar ut oppe. Under rundt 1080 moh er du på Fronten: hundre høydemeter med 45 til 58 grader, og ingen vei ut til sida. Hold ryggen sørover til Salen før du legger deg over mot vest.",
      "De siste kilometerne er skogsbilveg. Fallet er slakt — under fem grader hele veien ut — så regn med å stake.",
    ],
    avalanche: [
      {
        title: "Selve ruta",
        body: "Sporet passerer aldri 25 grader, og det bratteste sammenhengende beltet — 1000 til 1100 moh — holder 21 grader i snitt. Bakken opp til Salen er partiet du må lese. Den vender vest og nordvest, og fallinja måler 30 til 35 grader i snitt med parti over 40: sporet legger seg på skrå over den, men snøen bryr seg ikke om sporet. Det er en lastflate i østlig og sørøstlig vind, ikke i vestlig. Over 1100 moh er østkanten av ryggen skavlet hele veien til varden.",
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
      path: "M0,199 L24,199 L47,198 L70,197 L93,195 L117,193 L140,188 L163,184 L186,179 L210,175 L233,172 L256,166 L279,159 L302,157 L325,151 L349,140 L372,131 L395,114 L418,103 L441,93 L464,81 L487,69 L510,53 L533,35 L557,28 L580,20 L600,18",
      startLabel: "38 moh",
      endLabel: "1238 moh",
      distanceLabel: "8,1 km",
      caption: "8,1 km og 1206 høydemeter: skogsbilveg til Dalbotnvatnet, bakken opp til Salen, sørryggen til varden.",
    },
  },
  "store-blamann": {
    slug: "store-blamann",
    intro:
      "Kvaløyas høyeste, og en tur som skiller seg fra resten av Tromsø-toppene: 1031 høydemeter på tre kilometer, med et toppparti de fleste tar av seg skiene på.",
    ascent: [
      "Fra parkeringen ved Slettneset på Fjordvegen (fv 7768) tar den merka Blåmann-stien vestover rett fra sjøkanten. De første hundre metrene går på klopper over myr; skogen slipper med en gang, og fra 56 moh og opp går du i åpent terreng resten av veien.",
      "Stien stiger jevnt vestover til skulderen på rundt 230 moh, svinger så sørvest og tar seg opp på ryggen ovenfor Steet. Fra 475 moh og opp er ryggkammen hele ruta. De første tre hundre høydemeterne der oppe er brede og snille — flankene faller bare 10 til 25 grader, og fjellet føles lettere enn det er. Det varer til rundt 800 moh.",
      "Videre følger du østsørøst-ryggen vestover, med sørflanken fallende ned i Blåmannsvikdalen. Et flatere mellomparti gir pusterom rundt 670 moh. Fra rundt 800 moh strammer det til på begge sider: sørflanken går fra 20 til 42 grader i snitt, med parti over 55, og nordsida begynner å falle bort. Det bratteste hundremetersbeltet på linja ligger mellom 900 og 1000 moh med et snitt på 28,6 grader, og det bratteste enkeltpartiet måler 36,5.",
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
        body: "Ruta ligger på ryggkammen fra 475 moh og opp, og det er det som gjør den mulig. Opp til rundt 800 moh er ryggen bred og flankene slake, 10 til 25 grader. Over 800 er det slutt: sørflanken holder 42 grader i snitt, nordsida 38 og oppover. Det bratteste hundremetersbeltet på linja, 900 til 1000 moh, holder 28,6 grader i snitt, og enkeltpartier måler 36,5. Toppartiet over 880 moh er bratt og eksponert; i hard snø er det en klatretur, ikke en skitur.",
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
      path: "M0,200 L17,197 L34,193 L52,190 L70,187 L87,183 L105,179 L122,175 L140,171 L158,168 L175,162 L192,158 L210,153 L228,149 L245,144 L263,138 L281,134 L298,130 L316,127 L333,121 L350,115 L366,108 L383,104 L399,98 L416,92 L433,86 L450,80 L467,76 L485,71 L501,64 L515,56 L529,48 L546,42 L561,34 L578,26 L594,20 L600,18",
      startLabel: "9 moh",
      endLabel: "1044 moh",
      distanceLabel: "3,1 km",
      caption: "3,1 km og 1031 høydemeter: kloppene ved Slettneset, ryggen ovenfor Steet, og det bratte toppartiet.",
    },
  },
  storgalten: {
    slug: "storgalten",
    intro:
      "Fjord til topp i ytre Lyngen: 1210 høydemeter fra veikanten der Galtelva renner ut i Nord-Lenangen, til varden på 1219. Kort linje, åpent fjell fra 70 moh og opp, og fjorden i ryggen fra første stigning.",
    ascent: [
      "Start ved Sandneset, der Galtelva renner ut i fjorden på 14 moh. Det finnes ingen opparbeidet parkering her — du står i veikanten på Fv7922, Lenangsveien, rett ved elveosen. Herfra går du rett inn i Galtdalen nord for Lassofjellet og holder sørsiden av elva, det vil si høyre side på vei opp. Bjørkeskogen slipper taket allerede rundt 70 moh; resten av turen er åpent terreng.",
      "Rund nordsiden av Lassofjellet og ta sikte på skaret mellom Litle-Galten og Storgalten. Du skal ikke helt opp i skaret. Det bunner på 626 moh, og går du dit, gir du fra deg høyde du nettopp har tatt. Legg deg inn på ribben et par hundre meter sør for skaret i stedet — det er der oppstigninga begynner.",
      "Mellom 800 og 860 moh reiser flanken seg til 30–35 grader, og bratteste steg på hele linja ligger her: 35,6 grader mellom 823 og 849 moh. Er snøen avblåst og hard, er stegjern verdt vekta. Over 880 moh brer ryggen seg ut, men den slutter ikke å stige — de siste drøyt 300 høydemeterne holder rundt 22 grader i snitt, med ett steg på 32 rundt 1100 moh. Hold deg på vestsida av ryggkanten hele veien: øst- og nordøstsiden faller 36–43 grader i snitt ned i Kalddalen mot Kalddalsvatnet på 477 moh, med enkeltpartier på 53–58.",
    ],
    descent: [
      "Ned samme vei. Fra toppflata følger du den brede ryggen nordover tilbake til ribben sør for skaret og videre ut i vestflanken; derfra og ned til dalbunnen er det sammenhengende åpent terreng uten skog å bremse i. Vil du ha mer plass, traverserer du sørvestover like før den siste nedkjøringa mot skaret — der ligger en stor flate som holder seg under 20 grader og tåler store svinger.",
      "Vanligste feil: å slippe seg rett vestover fra toppflata i stedet for å følge ryggen nordover ned til ribben. Langs hele vestsiden av Storgalten går det rennesystemer, og de bratteste partiene måler 40–50 grader. Fra ryggen ser du ikke hvor de begynner, og inngangen er vanskelig å lese ovenfra — skal du kjøre dem, går du dem opp først. Skaret er ikke faren her; vestflanken sør for ribben er det.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalruta går i vestflanken, i løsne- og utløpsterreng. Det bratteste på linja er partiet mellom 800 og 860 moh på 30–35 grader, med bratteste steg målt til 35,6 mellom 823 og 849. Hundremeteren fra 800 til 900 moh er den bratteste på hele ruta, 26,5 grader i snitt. Under den er flanken åpen fra 70 moh og ned til fjorden, uten skog som bremser.",
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
      path: "M0,200 L21,196 L42,192 L62,187 L82,183 L102,182 L123,177 L143,172 L164,168 L184,163 L205,160 L226,156 L246,150 L267,144 L287,138 L307,130 L327,122 L347,117 L368,111 L388,102 L408,94 L428,87 L446,81 L464,71 L484,63 L504,55 L523,47 L544,41 L564,30 L584,22 L600,18",
      startLabel: "14 moh",
      endLabel: "1219 moh",
      distanceLabel: "3,9 km",
      caption: "Fra 14 moh ved Galtelvas utløp til 1219 på toppen — 1210 høydemeter på 3,9 kilometer, med det bratteste mellom 800 og 860.",
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
      "Langs linja på kartet er bratteste steg 24,6 grader, og hundremeteren mellom 800 og 900 moh går i 23,5 i snitt. Flanken rundt deg er brattere: mellom 800 og 920 moh ligger partier på 30–35 grader, og målt 400 meter ut fra sporet ved 910 moh holder østsiden 31 grader i snitt, nordsiden 34. Legger du deg for direkte mot toppen, er det dem du står i. Øverst flater det ut til den brede toppflata på 1041.",
    ],
    descent: [
      "Ned samme vei. Toppflata er romslig nok til å legge svingene der du vil — så lenge du holder deg sør og øst på den. Nord- og nordvestkanten faller av på 40–47 grader i snitt med steg på 50–57, og det er der det bygger skavler. Østflanken ned mot 850 moh er den lengste sammenhengende nedkjøringa på normalruta, 20–23 grader langs sporet. Under det holder du oppstigningssporet ned til Rørneshytta og videre østover mot Skihytta og skogsveien.",
      "Vanligste feil: å la nedkjøringa trekke ned i elvedalen mot Gjerdelva. Ryggen nord for elva er i seg selv en dokumentert variant og går fint å kjøre — det er bunnen som er problemet. Elvedalen er ei stor terrengfelle der det omkom en person vinteren 2017, og sidene ned i den måler 34–37 grader selv om de leser som flatt ovenfra. Hold høyden til du er ute av dalen.",
      "De brattere linjene fra toppen er egne turer, ikke varianter av normalruta. Topphenget er ei rett linje fra toppen med partier på 35–40 grader. Skredbekken tar ut mot Gjerdaksla etter topphenget og følger søkket nord for den ned mot Sollia, med partier på 30–40 grader; folk har løst ut skred der før, og du kommer ned langt fra bilen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigninga går gjennom utløpsområder fra 800 moh og opp. Selve sporet er slakt — bratteste steg måler 24,6 grader, og båndet 800–900 moh går i 23,5 i snitt — men flanken over og ved siden av holder 30–35 grader mellom 800 og 920 moh, målt til 31 grader i snitt i øst og 34 i nord. Det er den som eventuelt løsner over deg.",
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
      path: "M0,200 L20,197 L41,189 L61,180 L81,176 L101,171 L121,160 L141,159 L162,156 L182,154 L202,148 L222,140 L242,131 L262,122 L282,116 L303,112 L323,105 L343,100 L364,99 L384,96 L404,98 L424,101 L444,100 L465,92 L485,82 L505,74 L525,65 L544,51 L565,37 L585,26 L600,18",
      startLabel: "62 moh",
      endLabel: "1041 moh",
      distanceLabel: "5,3 km",
      caption: "Fra 62 moh ved Eidebakken til 1041 på toppen — 1004 høydemeter på 5,3 kilometer, med et søkk ved Rørneshytta.",
    },
  },
  kavringtinden: {
    slug: "kavringtinden",
    intro:
      "Lyngseidets hustopp, og 1243 høydemeter rett opp fra fjorden. Rygg opp, Østrenna ned — den store, østvendte renna nord for toppen samler den beste snøen på fjellet og holder på den langt ut i mai.",
    ascent: [
      "Fra parkeringen ved Eidebakken, 63 moh, følger du skogsveien opp østsida av Gjerdelva. Du passerer Rødsteinen i bjørkeskogen rundt 200 moh og fortsetter opp ryggen øst for elva. Ruta krysser aldri Gjerdelva — går du over vann, har du gått feil.",
      "Skogen slipper taket ved 301 moh, og du går forbi Skihytta på 317. Mellom Rødsteinen og Skihytta må du gjennom et grunt søkk før stigningen tar seg opp igjen, og terrenget blir først ordentlig oversiktlig rundt 400. Skogsveiene fra Karnes, Solhov, Marieslett og Jensbakk kommer opp på den samme hylla, så hvilken du velger nede i bygda spiller mindre rolle. Herfra legger du kursen vestover mot nordøstryggen og kommer opp på kammen rundt 780 moh.",
      "Videre følger du ryggen sørover, på eller like øst for kammen. Mellom 900 og 950 moh reiser østsida seg i partier over 30 grader, og bratteste enkeltsteget på linja måler 34. Vestsida er ikke et alternativ: der faller det 40 til 80 høydemeter per hundre meter rett ned mot Gjerdelva.",
      "Toppryggen smalner inn de siste hundre meterne, og rundt nitti meter før varden tar et grunt skar tilbake et par høydemeter. Her henger skavlene ut mot øst, over Østrenna: kammen faller 30 til 41 grader på østsida og 21 til 31 på vestsida. Skift side i god tid og gå det siste stykket vest for skavlekanten, fram til varden på 1289.",
    ],
    descent: [
      "Den store renneformasjonen rett nord for toppen er nedkjøringen. Den heter Østrenna og ligger øst for kammen. De øverste to hundre metrene måler 33 til 42 grader, 37 i snitt, og renna er vid nok til nesten å være en flanke — den ligger i le, fylles av fokksnø mens det blåser på toppryggen, og har som regel den beste snøen på fjellet. Vel nede skrår du nordover tilbake på oppstigningsruta.",
      "Vanligste feil: å ta sats utfor skavlen rett fra toppen, og sent på dagen. Den store skavlen over renna slipper i vårsola nesten hvert år, og løsner den, går den i renna du står i. Renna vender øst og får sola først av alt her oppe, så kjør tidlig — og gå inn gjennom det grunne skaret nitti meter nord for varden. Det er det naturlige innsteget, den samme renna du kommer bort i like før toppen.",
      "Vil du ikke inn i renna, kjører du ned nordøstryggen du kom opp. Den er brattest mellom 900 og 800 moh, 26 grader i snitt, og er ofte avblåst; regn med hard snø der ryggen er smalest.",
    ],
    avalanche: [
      {
        title: "Ruta opp",
        body: "Nordøstryggen er det tryggeste linjevalget på fjellet, men flat er den ikke. Østsida under kammen går i partier over 30 grader mellom 900 og 950 moh, bratteste hundremeteren på selve linja ligger mellom 800 og 900 moh på 26 grader i snitt, og bratteste steget måler 34. Ryggen er ofte avblåst hele veien opp — det gir hard snø på kammen og fokksnø i lesidene rett ved siden av.",
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
      path: "M0,200 L21,197 L42,192 L63,185 L84,181 L104,180 L125,182 L145,177 L166,169 L187,165 L207,161 L228,155 L249,147 L269,140 L289,131 L310,124 L331,117 L352,111 L372,110 L393,110 L414,105 L433,94 L453,84 L473,71 L493,60 L513,49 L530,35 L551,27 L571,25 L592,22 L600,18",
      startLabel: "63 moh",
      endLabel: "1289 moh",
      distanceLabel: "5,2 km",
      caption: "1243 høydemeter fra Eidebakken til varden; bratteste hundremeteren ligger mellom 800 og 900 moh, 26 grader i snitt.",
    },
  },
  "hesten-segla": {
    slug: "hesten-segla",
    intro:
      "Senjas korteste store tur: 506 høydemeter fra Fjordgård opp en bred, sørøstvendt flanke, med Segla rett foran deg fra toppryggen. To til fire timer fra bilen og tilbake.",
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
      path: "M0,199 L12,200 L24,200 L37,200 L49,200 L62,200 L75,199 L87,199 L100,199 L112,199 L125,197 L137,195 L150,192 L163,189 L175,185 L188,180 L200,175 L213,172 L225,168 L238,164 L250,160 L263,156 L275,153 L288,148 L301,143 L313,138 L326,134 L338,132 L351,128 L363,124 L376,120 L388,115 L401,109 L413,103 L426,97 L438,90 L450,84 L462,78 L475,74 L487,68 L498,59 L509,54 L522,48 L535,45 L547,40 L560,36 L572,31 L584,24 L600,18",
      startLabel: "48 moh",
      endLabel: "556 moh",
      distanceLabel: "2,1 km",
      caption: "506 høydemeter fra Fjordgård; flanken er 20 grader i snitt der den er brattest, mellom 300 og 400 moh.",
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
        body: "Linja som er tegnet holder seg under 30 grader hele veien. Bratteste hundremeteren ligger mellom 500 og 600 moh med 19,8 grader i snitt, og bratteste enkeltsteg måler 27,9 grader. Benken nord for Isvatnet ligger på fire til tjuefire grader. Toppblokka er unntaket — den er klatring, ikke skiterreng.",
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
      path: "M0,200 L20,191 L41,183 L62,174 L78,170 L98,169 L119,169 L140,168 L161,165 L182,162 L202,157 L223,148 L244,144 L264,138 L285,126 L305,116 L326,111 L346,106 L367,96 L388,91 L409,89 L429,79 L450,69 L470,62 L491,57 L512,50 L532,39 L551,31 L572,27 L592,20 L600,18",
      startLabel: "141 moh",
      endLabel: "1243 moh",
      distanceLabel: "5,2 km",
      caption: "5,19 km og 1095 høydemeter fra steinbruddet i Forselvveien; bratteste hundremeteren ligger mellom 500 og 600 moh.",
    },
  },
  himmeltindan: {
    slug: "himmeltindan",
    intro:
      "Vestvågøys høyeste fjell, med start i fjæra på Haukland og 965 høydemeter opp på under tre og en halv kilometer. Kort tur, men siste tredjedel er bratt og toppryggen er smal.",
    ascent: [
      "Fra parkeringen på Hauklandstranda, seks meter over havet, går du nordover mot søndre munning av tunnelen til Utakleiv. Ikke gjennom tunnelen: ta serviceveien som klatrer nordøstover over den, forbi Klumpan, og følg den til den flater ut på benken på 150 moh ved munningen av Durmålsdalen. Her starter den merkede stien, og den går hele veien opp til varden på 931.",
      "Videre nordøstover opp sørsida av Durmålsdalen. Terrenget er åpent hele veien — det er ingen skog på denne turen — og linja legger seg i lange sikksakk opp mot skulderen ved Molheia. Det brattner fra 700 moh: hundremeteren mellom 700 og 800 moh ligger på 28,6 grader i snitt, og bratteste steget på linja måler 36,1 grader. Ikke skjær rett opp vestflanken av toppryggen; den ligger på 34 til 37 grader i snitt med partier opp mot 46. Høyden tas på skulderen på sørsida.",
      "Fra Molheia rundt 800 moh er det bare tretti meter opp til fortoppen på 830 og den vesle flata der. Det er det siste brede stedet på turen — sørøst for flata faller terrenget 38 grader i snitt. Herfra og ut er du på rygg.",
      "Fra flata går ryggen nordover, og den er smal. Følg krona til varden på 931. Ikke gå ut på østsida — der ligger store hengskavler over svært bratt lende: østflanken under varden måler 42 grader i snitt, sørøstflanken 44, med partier på 54 til 57. Videre nordover faller ryggen til 898 moh og stiger så femti meter igjen mot hovedtoppen. Det aller høyeste punktet, 962 moh, ligger der oppe og er stengt av militært radaranlegg.",
    ],
    descent: [
      "Tilbake langs ryggen til fortoppen, på krona eller like vest for den. Derfra har du snaut sju hundre sammenhengende høydemeter ned den brede Durmålsdalen til benken på 150 moh. Vil du ha en variant, svinger du til høyre ned i Øvredalen like før fortoppen og følger ryggsida mellom dalene til det flater ut rundt 600 moh, og derfra tilbake til venstre inn i Durmålsdalen.",
      "Vanligste feil: å følge Durmålsdalen helt ned. Da kommer du ut på Utakleiv-sida med tunnelen mellom deg og bilen. Hold til høyre når dalen flater ut rundt 150 moh og ta serviceveien over tunnelen tilbake til Haukland.",
      "Lehengene mot øst og sør er bratte og ligger rett under skavlene på toppryggen. De faller åtte hundre høydemeter ned til anleggsveien på sør- og østsida av fjellet, som ligger mellom 75 og 180 moh — ikke i Durmålsdalen. Velg dem bevisst, ikke fordi du kom skjevt ut fra ryggen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Nedre halvdel er slak og åpen. Det brattner fra 700 moh: hundremeteren mellom 700 og 800 moh ligger på 28,6 grader i snitt, og bratteste steget på linja måler 36,1 grader. Fra fortoppen og nordover er ryggen smal, med et fall til 898 moh og femti meter opp igjen før hovedtoppen.",
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
      path: "M0,200 L23,199 L47,197 L71,194 L95,189 L116,181 L137,171 L161,170 L184,170 L208,165 L232,158 L256,151 L280,145 L304,136 L326,126 L349,113 L372,101 L396,90 L417,79 L439,68 L459,56 L479,44 L503,40 L526,32 L550,23 L570,26 L594,21 L600,18",
      startLabel: "6 moh",
      endLabel: "962 moh",
      distanceLabel: "3,4 km",
      caption: "965 høydemeter fra fjæra på Haukland på 3,39 km; det bratteste ligger mellom 700 og 800 moh.",
    },
  },
  stornappstinden: {
    slug: "stornappstinden",
    intro:
      "Lofot-klassikeren i overkommelig format: 680 høydemeter fra veikanten til en varde som står rett på stupkanten. Kort nok til en ettermiddag, stor nok til å bli en favoritt.",
    ascent: [
      "Fra parkeringen ved skianlegget i Nappskaret, en kilometer vest for Napp, går du nordover og holder deg til venstre for skitrekket. Rett over øvre trekkstolpe, ved 139 moh, samles stiene fra de ulike parkeringene til ett spor — starter du fra den vestre parkeringen drøyt 250 meter unna, kommer du inn på det samme sporet her. Fra 61 moh og opp er du over skoggrensa hele veien; det finnes ikke skog på denne ruta.",
      "Sporet svinger nordøst inn i dalen mellom Okstinden og Litlnappstinden og krysser Myrlandselva rundt 215 moh. Videre opp dalen til søkket ved Skarvatnet, det islagte tjernet på 341 moh. Hold til venstre opp mot Middagstinden, og legg deg deretter mot høyre der terrenget heller slakest — det er den linja som tar deg opp uten å komme borti sørflanken.",
      "Over 500 moh reiser terrenget seg til et kort, bratt trinn opp på ryggen ved 560 moh. Det bratteste hundremeterssjiktet på ruta ligger likevel mellom 400 og 500 moh og holder 21,6° i snitt; bratteste enkelttrinn på hele linja måler 34°. Over trinnet flater det ut, og fra rundt 724 moh går den brede toppflata østover som en 13 graders rampe inn mot varden.",
      "Varden på 740 moh står på kanten av østveggen. Stopp ved varden. Toppen bærer store hengskavler mot øst, og øst- og nordøstsida over Napp og Perklubben faller 42–43° i snitt med bergband over 60° — det er stup, ikke en linje.",
    ],
    descent: [
      "Ned samme vei. Dalen mellom Okstinden og Litlnappstinden gir variert kjøring, og fra søkket ved Skarvatnet er det åpent hele veien ned til trekket.",
      "Vanligste feil: å slippe seg sørover fra toppflata fordi det ser kortere ut. Sørsida rett under toppen faller nær 39° i snitt, med partier over 50°, og det er der skredene går på dette fjellet. Hold vestover i stedet — vest er den slakeste sida av fjellet, 22° i snitt — og følg oppstigninga tilbake til søkket.",
      "Femti meter fra varden tar du til venstre, rett sør, inn i renna: 40° og 400 meter lang, og den munner ut i et bredere parti rett over Litlnappstinden. Det er en egen avgjørelse, ikke en snarvei.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigninga gjennom dalen er slak: bratteste hundremeterssjikt er 400–500 moh med 21,6° i snitt. Men snittet skjuler det bratteste enkelttrinnet på linja, som måler 34°, og trinnet opp på ryggen ved 560 moh er kort og bratt. Det er de partiene som kan løsne på normalruta.",
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
      path: "M0,200 L18,198 L37,195 L56,192 L75,189 L94,184 L113,179 L132,174 L151,172 L170,171 L189,168 L208,161 L227,153 L245,146 L261,137 L280,132 L299,132 L319,128 L338,126 L356,124 L375,118 L394,109 L409,99 L428,91 L447,84 L464,74 L483,68 L499,58 L518,50 L537,44 L556,37 L575,28 L594,20 L600,18",
      startLabel: "61 moh",
      endLabel: "740 moh",
      distanceLabel: "2,8 km",
      caption: "61 til 740 moh på 2,8 kilometer: jevn stigning gjennom dalen, ett bratt trinn, så flatt inn til varden.",
    },
  },
  kirketaket: {
    slug: "kirketaket",
    intro:
      "Norges kanskje mest populære topptur — bred rygg, trygge linjevalg og lang sesong. En tur som gir mye fjell for pengene, både for førstegangsturen og for hundredegangen.",
    ascent: [
      "Fra parkeringen på Hellerøra (Øvre Kavli), 185 moh, følger du bomveien nordover den første kilometeren, til den krysser Heiaelva. Rundt svingen og videre inn på sporet mot Kavlisetra og Måsvassbu.",
      "Ved rundt 420 moh forlater du Måsvassbu-sporet og går nordøst opp gjennom åpen bjørkeskog. Skogen slipper taket akkurat der: over 421 moh er det åpent terreng resten av veien. Målet er Vesttoppen på Steinberget, 766 moh.",
      "Fra Vesttoppen følger du kammen østover til Steinberget, 981 moh. Ryggen henger sammen og stiger jevnt, men rett nord for Steinberget faller den 18 meter i et søkk før den reiser seg igjen. De 18 meterne må du opp igjen på vei tilbake — de er med i turens 1271 høydemeter.",
      "Herfra går sørvestryggen nord-nordøstover mot toppen. Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1300 og 1400 moh: 26° i snitt, med et enkelttrinn på 30°. Skavler henger ut på både øst- og vestsida av toppryggen; hold deg på ryggen og klar av begge kanter helt inn til varden på 1439.",
    ],
    descent: [
      "Standardnedkjøringen går sørover fra toppen, ned sørflanken til Kavliheian — 950 sammenhengende høydemeter — og derfra i oppkjørte spor tilbake til Øvre Kavli. Øverste del kan skjule stein tidlig i sesongen; den beste snøen ligger lenger ned. Sørflanken er også det første stedet i området som blir oppkjørt etter snøfall, så vær tidlig ute om du vil ha den urørt.",
      "Vanligste feil: å ta sørflanken som standard uansett forhold. Øverste del holder 30–35°, og skredterrenget ligger i to belter, 1300–1400 moh og 950–1050 moh — begge går du gjennom på vei opp også. Holder ikke varselet til det, går du tilbake over Steinberget, samme vei som opp, og opp igjen gjennom søkket.",
      "Vestrenna er den andre linja ned: jevnt 42–48°, med et 60 meter langt parti på rundt 55° der renna er smalest, og videre ut dalen til Loftskarsetra og ned gjennom skogen til parkeringen. Den krever stabil vårsnø eller stabile vinterforhold og en helt egen vurdering — snøkvaliteten i renna er vanskeligere å vurdere enn å kjøre den. Det er ikke noe du velger på toppen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Oppstigninga over Steinberget er den slake linja på fjellet, men den er ikke skredfri. Skredterrenget ligger i beltene 950–1050 moh og 1300–1400 moh, og du går gjennom begge på vei til toppen. Bratteste hundremeterssjikt på oppstigninga er nettopp 1300–1400 moh, med 26° i snitt og et enkelttrinn på 30°.",
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
      path: "M0,200 L23,198 L46,196 L68,192 L91,185 L114,176 L136,166 L158,154 L181,144 L202,131 L222,121 L245,115 L268,112 L291,109 L314,106 L336,103 L359,102 L382,100 L405,94 L428,86 L451,86 L474,81 L497,76 L519,67 L541,55 L562,43 L584,29 L600,18",
      startLabel: "185 moh",
      endLabel: "1439 moh",
      distanceLabel: "5,9 km",
      caption: "185 til 1439 moh på 5,9 kilometer: bomvei, bjørkeskog til 421, så rygg hele veien — 1271 høydemeter medregnet søkket nord for Steinberget.",
    },
  },
  slogen: {
    slug: "slogen",
    intro:
      "Sunnmørsalpenes dronning, og en av de mest alvorlige turene i landsdelen. 1482 høydemeter fra Norangsdalen til en topp de fleste går de siste 350 metrene til fots.",
    ascent: [
      "Fra veilomma ved Skylstad i Norangsdalen, 84 moh, går du rett opp Brekkheida. Hold deg vest for Brekkeelva gjennom hele skogen — elva ligger et par hundre meter øst for linja, og du kommer først inn på elvefaret oppe på flata rundt 700 moh. Dette er den bratteste delen av skogen: de hundre metrene mellom 400 og 500 moh ligger på 29,5° i snitt.",
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
        body: "Skogpartiet over Brekkheida er brattest mellom 400 og 500 moh, 29,5° i snitt, og det bratteste enkelttrinnet på linja måler 40,7°. Ryggen fra Pukkelen til høgde 1204 er snill: flankene der ligger på 26–35°. Det er de øverste 250 høydemeterne som er egg — nordsiden 43–57°, sørsiden 49–50°. Der er utglidning den reelle faren, og det er derfor skia blir båret.",
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
      path: "M0,198 L21,200 L42,198 L62,190 L82,180 L100,172 L119,166 L137,156 L154,145 L174,141 L195,136 L215,128 L235,127 L256,124 L277,119 L297,117 L318,113 L339,105 L359,98 L379,90 L400,82 L420,73 L440,68 L460,68 L480,60 L501,61 L522,55 L541,47 L561,39 L579,30 L597,20 L600,18",
      startLabel: "84 moh",
      endLabel: "1564 moh",
      distanceLabel: "5,2 km",
      caption: "84 moh ved Skylstad til 1564 på Slogen — 1482 høydemeter på 5,22 kilometer, de siste 350 til fots.",
    },
  },
  kolastinden: {
    slug: "kolastinden",
    intro:
      "Sunnmøres mest kjente skitopp. Slak dalgang hele veien inn, så en nordvendt passasje over 40°, bre — og en topp som er halvannen meter bred.",
    ascent: [
      "Fra parkeringen ved Standaleidet, 376 moh, følger du den ryddede traseen nordover mot Fossane under Søre Sætretind. Skogen slipper allerede på 410 moh, og fossen markerer inngangen til Kvanndalen.",
      "Følg dalbunnen langs elvefaret nordover. Terrenget er slakt: det bratteste hundremeterspennet, mellom 800 og 900 moh, ligger på 18,5° i snitt. Ikke sving vest der dalen åpner seg rundt 650 moh — det juvet fører opp i breens utløp. Hold nordover til Appelsinhaugen på 950 moh, den naturlige rasten halvveis.",
      "Fra Appelsinhaugen går du vest-sørvestover inn på flata i Kvanndalsskardet, drøyt 1020 moh. Herfra og opp til Stretet er det bratt: målte trinn i den nordvendte siden går over 45°. Stretet ligger på 1140 moh, en trang passasje på egga, og over den ser du toppen.",
      "Over Stretet er du på Kolåsbreen, som ligger som bre fra 1173 til 1355 moh. Følg brekanten under egga sørvestover mot toppen. De fleste tar av skia rundt 1350 moh og går den siste kneika, som måler 47°. Toppen er 1432 moh, halvannen til to meter bred og ti meter lang, med skavl mot øst — hold deg midt på — og en vestside som faller 260 høydemeter på 160, med trinn over 65°.",
    ],
    descent: [
      "Ned samme vei møter du de to bratte trinnene i motsatt rekkefølge: toppslippet fra 1432 til 1350, som måler 47°, og den nordvendte siden fra Stretet ned mot Kvanndalsskardet, der målte trinn går over 45°. Begge tas på skrå og med avstand mellom folk. Fra Kvanndalsskardet og ned holder terrenget seg under 30° hele veien ut Kvanndalen.",
      "Vanligste feil: å legge seg for langt vest på vei ned fra Appelsinhaugen. Da havner du i juvet som drenerer breen ut av Kvanndalen — trangt, med bratte sider over seg. Hold elvefaret i dalbunnen til du ser Fossane.",
      "På dager uten skredfare gir Kolåsbreen en videre nedkjøring med flere linjevalg. Bresprekken mellom breen og toppslippet åpner seg utover sesongen: dekt i høyvinteren, åpen når det lir mot vår.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Dalgangen gjennom Kvanndalen er slak, 18,5° i snitt over det bratteste hundremeterspennet. Bratt terreng møter du to steder: den nordvendte siden fra Kvanndalsskardet opp til Stretet, der målte trinn går over 45°, og toppslippet over 1350 moh på 47°. Begge vender nord.",
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
      path: "M0,200 L20,198 L40,193 L60,194 L81,195 L101,191 L121,178 L141,167 L161,163 L181,157 L201,153 L221,153 L241,152 L261,145 L281,139 L302,135 L322,127 L341,117 L362,106 L380,101 L400,100 L419,87 L439,78 L459,68 L478,67 L498,58 L518,50 L538,46 L558,39 L578,33 L595,22 L600,18",
      startLabel: "376 moh",
      endLabel: "1432 moh",
      distanceLabel: "5,4 km",
      caption: "376 moh ved Standaleidet til 1432 på Kolåstinden — 1076 høydemeter på 5,35 kilometer, med bre fra 1173 moh.",
    },
  },
  skala: {
    slug: "skala",
    intro:
      "Fra Tjugen i Loen til 1848 moh: 1815 høydemeter i én sammenhengende stigning, og en av landets lengste nedkjøringer. Turen krever kondisjon og sikt, ikke bratt teknikk.",
    ascent: [
      "Fra parkeringen på Tjugen ved Lodalsvegen, 34 moh, følger du traktorvegen som etter hvert blir til Kloumannstien og går oppover i Fosdalen. De første 540 meterne går på veg; deretter tar stien over. Skogen slipper taket rundt 426 moh, ved Tyvasætra, og fra midten av mai må du regne med å bære skiene opp til Tjugensætra rundt 750 moh.",
      "Elva krysser du rundt 650 moh. Stien svinger nordover et stykke før den tar seg tilbake sørover — følg den; juvet nedenfor er ikke noe å skjære over. Så følger rundt 400 høydemeter jevn stigning opp mot Skålavatnet. Stien svinger seg opp gjennom hellinga, og ingen hundremeter på dette strekket holder mer enn 18°.",
      "Du passerer Skålavatnet på nordvestsida, 1141 moh, og fortsetter sørøstover inn i botnen. Derfra tar du opp til venstre mot den brede ryggen mot Sandsnibba. Den bratteste hundremeteren på hele linja ligger mellom 1400 og 1500 moh og holder 22,8° i snitt; det bratteste enkelttrinnet måler 29,1°.",
      "Skålabu og Skålatårnet står på 1835 moh, der stien formelt slutter. Toppunktet ligger 370 meter lenger øst, flatt platå hele vegen. Ved dårlig sikt: hold ryggen. Den er slak å gå, men den faller bratt til begge sider — 56° i snitt de første 200 metrene mot nordvest, 42° mot sør — og skavlen henger ut over nordvestkanten.",
    ],
    descent: [
      "Ned går du samme linja: over platået, ut ryggen, ned i botnen og forbi Skålavatnet på nordvestsida, så ned Fosdalen. 1815 høydemeter i ett strekk. Vil du ha noe brattere, følger du toppeggen lenger ut og legger linja i den sørvestvendte fjellsida — det er den vanlige varianten. Rett sørvest for tårnet står et bergtrinn på 60–66°, så du må ut på eggen før du slipper deg ned; derfra holder sida 24–26° i snitt med trinn på 39–44°, mot 22,8° på oppstigningen.",
      "Vanligste feil: å forlate ryggen for tidlig. Nord- og nordvestsida rett under toppen er stup — 64° i de første 80 metrene — og sørsida er ikke stort snillere med sine 42°. Hold kammen til du er nede i botnen, og hold deretter nordvest for Skålavatnet og ned i Fosdalen. Trekker du vest for vatnet, står du over bergband som måler 68° ned mot Loen. Fra midten av mai slutter snøen rundt Tjugensætra, og de siste 750 høydemeterne går på beina.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Linja i seg selv er slak — bratteste hundremeter 22,8° i snitt, bratteste enkelttrinn 29,1°. Faren ligger i det du går under: det går skred langs Fosdøla og Skålelva, og nord for sommerruta etter at du har passert Skålavatnet.",
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
      path: "M0,200 L24,198 L47,193 L70,184 L91,176 L112,167 L134,161 L157,153 L181,147 L204,139 L227,133 L251,126 L274,119 L297,114 L320,106 L343,98 L367,91 L390,85 L413,79 L437,68 L460,59 L481,48 L504,39 L528,30 L551,24 L574,19 L598,18 L600,18",
      startLabel: "34 moh",
      endLabel: "1848 moh",
      distanceLabel: "6,9 km",
      caption: "1815 høydemeter fra Tjugen til toppen — bratteste hundremeteren ligger mellom 1400 og 1500 moh.",
    },
  },
  fanaraken: {
    slug: "fanaraken",
    intro:
      "Høyfjellstur fra Sognefjellsvegen til 2068 moh, med Fannaråkhytta på selve toppunktet. Få høydemeter og slake vinkler — men ruta går over bre, og det bestemmer utstyret.",
    ascent: [
      "Du starter på Korpen, parkeringen på rv55 ved Prestesteinsvatnet, 1397 moh. Første kilometeren og litt til går nedover: følg vestsida av vatnet ned til demninga ved utløpet på 1343 moh. Du gir fra deg 53 høydemeter før du har begynt å stige. Hold land langs vestsida — ikke skjær over isen.",
      "Forbi demninga trekker du opp i søkket øst for nordryggen til Steindalsnosi og inn på Fannaråkbreen rundt 1550 moh. Hold deg lavt og i den slake delen av breen. Den er oppsprukket, og du går den i tau.",
      "Sikt deg inn mot 1688-høgda øst for Fannaråknosi og rund den. Ikke hold høyde over breen: går du for høyt før du svinger opp, blir passasjen opp på austryggen vesentlig brattere. Den bratteste hundremeteren ligger mellom 1800 og 1900 moh og holder 27,5° i snitt, og det bratteste enkelttrinnet på linja måler 42,7°.",
      "Rundt knausen kommer du inn på søraustryggen og sommerstien fra Keisarpasset. Følg den over Fannaråknosi og videre langs austryggen til Fanaråken. Det henger store skavler på nordsida hele vegen, og nordsida faller 55–58° i de øverste 90 metrene under kammen — hold deg på sørsida, også når sikten er god.",
    ],
    descent: [
      "Ned følger du samme linja — øst- og nordøstvendt, jevnt og slakt, med pålitelig vårsnø langt ut i sesongen. Den andre dokumenterte ruta, fra Turtagrø gjennom Helgedalen, gir 1196 høydemeter og er en annen dag.",
      "Vanligste feil: å holde høyde over breen på vei ned, slik at du havner for høyt vest for 1688-høgda og må ned der det er brattest. Slipp deg ned rundt knausen slik du kom opp. Og husk at siste strekket ikke er gratis: fra demninga stiger det 53 høydemeter tilbake til Korpen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalvegen er slak — bratteste hundremeter holder 27,5° i snitt mellom 1800 og 1900 moh. Det bratteste enkelttrinnet på linja måler 42,7°, og det ligger i overgangen fra breen opp på austryggen rett øst for Fannaråknosi; går du for høyt over breen, blir den passasjen brattere enn den trenger å være. På Fannaråkbreen er sprekkene faren like mye som snøen.",
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
      path: "M0,182 L21,187 L42,188 L63,188 L84,189 L105,192 L126,194 L147,199 L168,199 L188,190 L209,183 L230,171 L251,171 L272,161 L292,155 L313,146 L334,140 L355,137 L376,136 L397,134 L418,126 L439,111 L460,96 L480,76 L498,52 L518,39 L539,36 L560,31 L581,25 L600,18",
      startLabel: "1397 moh",
      endLabel: "2068 moh",
      distanceLabel: "6,4 km",
      caption: "757 høydemeter fra Korpen til toppen — 89 av dem gir du fra deg, de fleste før stigningen begynner.",
    },
  },
  steindalsnosi: {
    slug: "steindalsnosi",
    intro:
      "758 høydemeter fra Sognefjellsvegen til 2025 moh, alt over skoggrensa. Normalvegen går opp vestsida; nordsida av det samme fjellet er en helt annen tur, og skillet mellom dem går på topplatået.",
    ascent: [
      "Fra den brøytede plassen ved Gjuvvatnet på Sognefjellsvegen, 1274 moh, går du østover inn i dalsøkket. Hold sørsida av vatnet — der er det fast grunn hele veien, og du slipper å miste de tretti meterne ned på isen. Er vegkanten full, ligger alternativet ved Galgebergstjørnane et par kilometer nordover; korridoren fungerer derfra også.",
      "Dalsøkket tar deg rett østover forbi et lite vatn på 1428 moh. Her er det åpent terreng fra første skritt til toppen — ingen skog, ingen skoggrense å ta hensyn til. Ved rundt 1500 moh trekker du nordøstover ut av søkket og opp mot en svak, vestvendt ryggformasjon. Den ryggen er hele resten av turen.",
      "Ryggen stiger jevnt. Hundremetersbåndet mellom 1700 og 1800 moh ligger på 23,6 grader i snitt, og det bratteste steget på veg opp er 40 meter med 35 grader mellom 1820 og 1860 moh. Hold ryggkammen gjennom det partiet. Trekker du nordover her, faller terrenget 100 til 180 meter bort under deg, og du kommer inn under nordsida.",
      "Toppen er et platå på 2025 moh. Varden ligger helt på kanten av nordsida — gå fram til den, ikke forbi den. Skavlene bygger seg ut mot nord og øst. Rett under varden stuper nordsida: de første 120 høydemetrene faller på nær 60 grader. Så slakner den til en hylle rundt 1840 moh, før den setter utfor igjen — 42 til 45 grader fra 1620 til 1500 moh, med bre og klipper under det.",
    ],
    descent: [
      "Ned går du samme veg, vestover. Den store skålforma under ryggen er det morsomste på turen: 25 til 30 grader jevnt, korte partier over 30, og ett steg på 36 grader mellom 1880 og 1860 moh. Derfra er det slakt ned dalsøkket til Gjuvvatnet.",
      "Vanligste feil: å la seg dra sørover fra toppen, ned Steindalen. Det er fin skikjøring, men det er en annen tur — 1025 høydemeter ned til Helgedalen, og bilen din står på Sognefjellsvegen. Hold vestryggen til du ser vatnet.",
      "Vestsida er hard om morgenen i april og mai, og sola trenger noen timer på den. Går du tidlig, tar du med stegjern; det bratte partiet ved 1840 moh er ikke morsomt på blank skare, verken opp eller ned.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Normalvegen ligger i slakt til middels bratt terreng. Dalsøkket opp til 1500 moh er flatt i seg selv, men det går under vestflanken av fjellet. Over 1700 moh blir det brattere: 23,6 grader i snitt gjennom båndet 1700–1800 moh, og det bratteste enkeltsteget langs linja måler 36,5 grader. Nøkkelpartiet mellom 1820 og 1860 moh er stedet på ruta der et flak løsner.",
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
      path: "M0,197 L22,198 L43,199 L65,200 L86,196 L108,194 L129,190 L150,181 L171,171 L192,166 L214,164 L235,162 L257,160 L278,159 L299,156 L321,150 L342,142 L363,133 L384,121 L405,114 L427,109 L447,97 L466,85 L487,71 L505,56 L525,45 L546,35 L568,26 L589,21 L600,18",
      startLabel: "1274 moh",
      endLabel: "2025 moh",
      distanceLabel: "3,8 km",
      caption: "758 høydemeter over 3,8 kilometer fra Gjuvvatnet, alt over skoggrensa. Bratteste parti på oppstigninga: 35 grader mellom 1820 og 1860 moh.",
    },
  },
  galdhopiggen: {
    slug: "galdhopiggen",
    intro:
      "Norges høyeste punkt, og fra Juvasshytta er det bare 632 høydemeter. Regnestykket lyver: mellom deg og toppen ligger Styggebrean, og den krysser du i taulag.",
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
        body: "Selve linja er slak. Det bratteste hundremetersbåndet, 2400–2500 moh, ligger på 16,5 grader i snitt, og det bratteste enkeltsteget langs ruta måler 24,5 grader. Skredterreng er ikke det som gjør denne turen krevende — det er sprekkene i Styggebrean og høyden. Østryggen er smal og fanger fokksnø på lesida.",
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
      path: "M0,200 L21,200 L41,199 L62,196 L82,194 L102,193 L123,192 L143,187 L163,177 L184,174 L204,169 L224,159 L245,152 L265,149 L286,148 L306,148 L326,147 L347,142 L367,135 L387,129 L408,124 L428,120 L448,117 L469,111 L489,96 L509,85 L530,73 L550,54 L570,41 L591,24 L600,18",
      startLabel: "1841 moh",
      endLabel: "2469 moh",
      distanceLabel: "5,3 km",
      caption: "632 høydemeter over 5,3 kilometer fra Juvasshytta — 1,6 av dem på Styggebrean, i taulag.",
    },
  },
  synshorn: {
    slug: "synshorn",
    intro:
      "Kort tur rett opp fra Bygdin, med 360 graders utsikt fra toppen — Jotunheimen i nord, Bygdin i vest, Bitihorn i sør. 424 høydemeter på knapt to kilometer gjør dette til turen du tar når værvinduet er kort.",
    ascent: [
      "Start på parkeringen ved Fagerstrand på østsida av Bygdin, like ved Bygdinstøga og Bygdin Høifjellshotell. Avgift 80 kroner, betales med Vipps. Fv51 er vinterstengt nordover, så Bygdin er den brøytede enden av vegen og plassen er tilgjengelig hele våren. Du er over skoggrensa fra første skritt, og stigningen begynner med en gang.",
      "Legg sporet vest- og nordvestover inn mot den nedre delen av Fagerdalen framfor å gå rett mot toppen. Toppen ser nær ut herfra, men rett nord for parkeringen ligger et trinn som holder rundt 40 grader mellom 1090 og 1220 moh, og østsida av Synshorn faller enda lenger: 31 grader i snitt de første fire hundre metrene ned mot Fv51, med et parti på 57 grader. Ingen av dem er oppstigning. Hold deg vest for fjellet til du er over 1400 moh.",
      "Flanken du går på ligger stort sett mellom 10 og 20 grader, i åpent terreng uten en trestamme. De siste hundre høydemeterne, fra 1400 til 1475, ligger i snitt på 16,6 grader, og bratteste enkeltparti på hele ruta måler 24,6 grader. Toppen tas fra sørvest, over den slake platåkanten.",
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
        body: "Oppstigningen går i åpent terreng hele vegen, uten skog å bremse noe. Bratteste enkeltparti på linja måler 24,6 grader, og de øverste hundre høydemeterne ligger i snitt på 16,6 grader. Selve sporet er altså slakt; det du må vurdere er hva som henger over deg når du kommer inn mot toppen fra sørvest.",
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
      path: "M0,200 L13,200 L27,200 L41,199 L54,196 L68,195 L82,190 L95,185 L108,178 L121,171 L135,174 L149,175 L162,175 L176,171 L190,169 L203,160 L216,154 L230,150 L243,145 L257,142 L271,135 L285,131 L298,127 L311,122 L325,122 L338,121 L352,121 L366,119 L379,114 L393,108 L406,101 L420,94 L433,88 L447,84 L461,81 L474,78 L488,72 L502,64 L516,57 L528,49 L542,43 L556,37 L569,31 L583,25 L600,18",
      startLabel: "1060 moh",
      endLabel: "1475 moh",
      distanceLabel: "2,0 km",
      caption: "1060 til 1475 moh på knapt to kilometer — jevn stigning i åpent terreng, brattest de siste hundre høydemeterne.",
    },
  },
  bitihorn: {
    slug: "bitihorn",
    intro:
      "Bitihorn står alene sør for Bygdin og ses fra hele Øystre Slidre. Normalruta går opp baksida — 549 høydemeter i jevn stigning, flatt den første kilometeren og merket med jernstenger øverst.",
    ascent: [
      "Start på parkeringen ved Fv51, en kilometer sør for Bygdin Høifjellshotell. Avgift 60 kroner dagen. Du er over skoggrensa allerede fra bilen. Den første kilometeren går over det flate platået vest for Stavtjerne og gir bare rundt tretti høydemeter, med et myrdrag som ligger dekket når det er skiføre.",
      "Etter platået runder du foten av nordryggen og passerer grinda i reingjerdet. Herfra legger du sporet opp den brede nordvestskuldra. Den ligger stort sett på 15 til 22 grader, og de bratteste hundre høydemeterne, fra 1300 til 1400, ligger i snitt på 18,9 grader.",
      "Øverst er ruta merket med jernstenger. De står der for folkene som vedlikeholder sambandsanlegget på toppen, og de er verdt gull i flatt lys. Bratteste enkeltparti på hele linja måler 27,5 grader, og det ligger her oppe, over 1500 moh. Toppen er 1607 moh, med Bygdin i nord og Jotunheimen bak.",
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
        body: "Nordvestskuldra ligger stort sett på 15 til 22 grader, de bratteste hundre høydemeterne 18,9 grader i snitt, og bratteste enkeltparti 27,5 grader oppe over 1500 moh. Visit Valdres beskriver flere linjevalg under 30 grader på denne sida, men med terrengfeller og utløpssoner i forsenkningene. Velg linje etter dagens varsel, ikke etter sporet som allerede ligger der.",
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
      path: "M0,200 L17,197 L34,197 L51,197 L68,197 L85,197 L102,197 L119,197 L136,196 L153,194 L170,190 L186,188 L203,182 L220,177 L237,172 L254,168 L271,162 L288,157 L305,158 L322,156 L338,151 L355,144 L372,136 L389,130 L406,125 L423,115 L440,106 L457,94 L474,85 L491,74 L508,66 L524,57 L541,46 L557,36 L573,25 L590,20 L600,18",
      startLabel: "1061 moh",
      endLabel: "1607 moh",
      distanceLabel: "3,2 km",
      caption: "1061 til 1607 moh: flatt den første kilometeren, så jevn stigning opp nordvestskuldra til jernstengene.",
    },
  },
  rondslottet: {
    slug: "rondslottet",
    intro:
      "Rondanes høyeste. En lang dag der de første seks kilometerne bare er innmarsj — fjellet begynner bak Rondvassbu, og de siste 240 høydemeterne går på en smal egg.",
    ascent: [
      "Fra Spranget p-plass, 1082 moh, er det seks kilometer inn til Rondvassbu. Tjønnbakkvegen inn hit er bomveg, og midtvinters er Mysusæter siste brøytepunkt — da blir turen tilsvarende lengre. Du er over tregrensa fra første meter, så det er åpent fjell hele veien inn. Hold deg på land rundt vika ved Lonin i sørenden av Rondvatnet i stedet for å ta snarveien over isen; dette er utløpsenden, og der er isen tynnest.",
      "Bak Rondvassbu, 1169 moh, stiger det bratt mot nordøst. Stidelet mot Storronden kommer tidlig, og din vei er den som fortsetter nordover inn i Rondholet. Botnen ligger på rundt 1500 moh og er flat — det er det siste flate partiet du får før toppen.",
      "Fra Rondholet går det meget bratt opp i ur mot Firkløvereggen, eggen mellom Storronden og Vinjeronden på 1869 moh. Det bratteste hundremeterbeltet på hele oppstigningen ligger her, mellom 1600 og 1700 moh, og holder 23° i snitt. Er ura avblåst, bærer du skiene til du er oppe på eggen.",
      "Videre stiger det til Vinjeronden, 2043 moh. Herfra faller ruta vel hundre høydemeter ned i Slottsbrue, skaret på 1939 moh, før den går opp igjen på eggen mot Rondslottet, 2178 moh. Eggen er fin å gå på, men den er smal: hold deg midt på ryggen. Terrenget faller 33–38° mot vest og over 45° mot øst.",
    ],
    descent: [
      "Samme vei tilbake — over eggen, ned i Slottsbrue, opp igjen de hundre høydemeterne til Vinjeronden. Den gjenstigningen kommer sent på dagen og tar lengre tid enn den ser ut til; legg inn tida før du bestemmer deg for hvor lenge du blir på toppen.",
      "Vanligste feil: å slippe seg vestover fra eggen for å slippe unna gjenstigningen over Vinjeronden. Vestsida av eggen mellom Slottsbrue og toppen faller 33–38° i nesten tre hundre høydemeter, ned i Styggebotn og videre mot Rondvatnet. Det slakner ikke før under 1700 moh, og til da henger du i én sammenhengende bratt flanke under en egg. Det er ingen snarvei — hold eggen til du er tilbake i skaret.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Fra Spranget inn til Rondholet er terrenget åpent og slakt, og du ligger over tregrensa hele veien. Det bratteste hundremeterbeltet på oppstigningen ligger mellom 1600 og 1700 moh og holder 23° i snitt — det er ura opp mot Firkløvereggen. Over Vinjeronden går ruta ned i Slottsbrue og opp igjen på en smal egg, med bratte flanker rett ved sporet på begge sider.",
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
      path: "M0,200 L23,200 L45,198 L67,197 L89,194 L112,191 L134,190 L156,189 L179,189 L201,188 L223,186 L245,185 L268,186 L290,186 L312,171 L334,160 L357,143 L379,142 L401,137 L423,133 L446,129 L468,107 L489,83 L511,64 L533,41 L555,57 L578,39 L600,18",
      startLabel: "1082 moh",
      endLabel: "2178 moh",
      distanceLabel: "12,1 km",
      caption: "12,1 km og 1245 høydemeter fra Spranget. Hundre av dem gis bort i Slottsbrue og må tas igjen opp eggen.",
    },
  },
  snohetta: {
    slug: "snohetta",
    intro:
      "Norges høyeste fjell utenfor Jotunheimen, og et av de snilleste i sin klasse: østryggen er staket hele veien, og linja passerer aldri 29°. Det som avgjør dagen er ikke fjellet, men hvordan du kommer deg inn til Snøheim.",
    ascent: [
      "Snøheim turisthytte, 1474 moh, ligger ved enden av Snøheimvegen. Vegen er stengt for privatbil, sykkel er forbudt fram til 1. juni av hensyn til villreinkalvinga, og bussen fra Hjerkinn går først når hytta åpner rundt St. Hans. I skisesongen tar du altså de fjorten kilometerne inn fra Hjerkinn for egen maskin — det er den delen av dagen folk undervurderer. Fra hytta følger du sporet et par hundre meter vestover til gangbrua over Stridåe. Brua ligger i sørøsthjørnet av tjernet rett vest for hytta; du går rundt sørsida av tjernet, ikke over det.",
      "Etter brua svinger du umiddelbart til høyre inn på Forsvarets gamle traktorveg, sperret for kjøring med store steiner. Den tar deg jevnt oppover til Gamle Reinheim, ruinen på 1670 moh. Ingen skog noe sted på denne turen — du er over tregrensa fra hytta og oppover, og ser hele ryggen foran deg hele veien.",
      "Fra Gamle Reinheim stiger det bratt, delvis på snøfonner, opp på østryggen. Oppe på kammen ligger stidelet mot Reinheim i Stroplsjødalen, inngangen for dem som kommer østfra. Hold avstand til det bratte terrenget mot nord i starten av stigningen; ryggen er bred nok til at du kan gå midt på den.",
      "Det bratteste hundremeterbeltet ligger mellom 1800 og 1900 moh og holder 19,6° i snitt; ingen del av linja passerer 29°. Herfra er det staker og varder hele veien, og øverst går det på snøfonner opp til Stortoppen, 2286 moh, der radiolinkstasjonen står. I dårlig sikt er det stakene som holder deg på kammen — den øvre delen er bred nok til at du mister følelsen av hvor ryggen går.",
    ],
    descent: [
      "Samme vei ned. Fra Stortoppen til Gamle Reinheim gir østryggen drøyt 600 sammenhengende høydemeter, og de siste 200 tar traktorvegen. Under 1800 moh slakner det så mye at det blir mer gliding enn svinger. Vil du ha mer helning og bedre snø, legger du noe av nedkjøringen sør for oppoversporet — men da står du i 30–40°-terreng i stedet for 20°.",
      "Vanligste feil kommer helt til slutt: å forlate traktorvegen for tidlig og sikte rett mot Snøheim. Da har du tjernet vest for hytta i veien, og utløpsbekken bak det. Følg vegen helt ned til enden ved sørvesthjørnet av tjernet og ta stien østover derfra — gangbrua er den eneste kryssinga, og fra brua er det 230 meter igjen til hytta.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Østryggen er slak etter høyfjellsmålestokk. Det bratteste hundremeterbeltet, mellom 1800 og 1900 moh, holder 19,6° i snitt, og ingen del av linja passerer 29°. Fra Snøheim til Gamle Reinheim går du på gammel traktorveg i åpent, slakt terreng. Det som betyr noe her er ikke det du står på, men hvor nær kanten av kammen du legger sporet.",
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
      path: "M0,199 L19,200 L38,198 L57,197 L77,195 L96,193 L115,190 L134,189 L153,189 L173,186 L192,182 L211,177 L230,172 L250,170 L269,168 L288,167 L307,160 L326,155 L346,151 L365,145 L383,133 L402,118 L421,103 L440,90 L460,82 L479,74 L498,66 L517,55 L536,46 L555,37 L575,27 L594,19 L600,18",
      startLabel: "1474 moh",
      endLabel: "2286 moh",
      distanceLabel: "5,6 km",
      caption: "5,6 km og 819 høydemeter fra Snøheim — jevnt oppover hele veien, og aldri over 29°.",
    },
  },
  storehorn: {
    slug: "storehorn",
    intro:
      "Kort vei fra bilen til en topp som ser ut over hele Hemsedal. Turen starter allerede over skoggrensa, og terrenget er åpent fra første steg — en fin førstetur på ski i dalen, og en rask formiddagstopp for den som kjenner den.",
    ascent: [
      "Fra Hornslie, der Torsetstølvegen ender på 1056 moh, går du rett opp den første bakken. Den er kortere enn den ser ut — det bratteste hundremeterspennet på hele ruta, 1000–1100 moh, ligger på 18,8° i snitt — og over kanten flater det ut. Her er ingen skog å forholde seg til: hele turen går i åpent terreng.",
      "Over kanten åpner Hødnetjedne-bassenget seg — Horntjerne på Kartverkets kart — og du gir tilbake 48 høydemeter ned mot vannet på 1191 moh. Om vinteren går linja rett over det frosne vannet; sommerstien holder venstre side. På andre sida deler ruta seg i to merkede linjer: én lengre og slakere ut på nordvestskulderen, én kortere og brattere opp østryggen. Denne beskrivelsen følger østryggen.",
      "Fra østryggen er det jevn stigning vestover til toppen, med Veslehødn — Veslehorn på kartet — og hele Hemsedalen i ryggen. Toppflata er liten, og sørkanten ligger nærmere varden enn den ser ut: åtti meter sør for toppunktet faller terrenget 96 høydemeter på tjue meter grunn. Sørøstkanten gjør det samme, 63° over de bratteste seksti meterne, og sørvestkanten 57°. Hold ryggen inn til varden, og hold deg nord for kanten når du står der.",
    ],
    descent: [
      "Samme vei ned. Østryggen gir jevn, oversiktlig kjøring ned mot Hødnetjedne, og bassenget under er det slakeste terrenget på turen — regn med å stake.",
      "Vanligste feil: å la terrenget dra deg nordøstover mot Veslehødn i stedet for å svinge ned mot Hornslie. Øst for Veslehødn stuper Hydnefossen 155 meter fritt — høydemodellen tar 151 av dem i ett eneste tjuemeterssteg — og under fossen holder terrenget 50° videre ned. Fra vannet går hjemveien sørøstover, og husk de 48 høydemeterne opp av bassenget før den siste bakken ned til bilen.",
    ],
    avalanche: [
      {
        title: "Ruta",
        body: "Selve linja er slak. Det bratteste hundremeterspennet, 1000–1100 moh i den første bakken opp fra Hornslie, ligger på 18,8° i snitt. Det bratteste enkeltpartiet kommer først på siste rygg, mellom 1394 og 1415 moh, og måler 29,8°. Ingen del av linja går over 30°.",
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
      path: "M0,200 L17,187 L36,176 L55,163 L74,152 L93,146 L111,137 L130,132 L149,125 L168,124 L187,125 L205,127 L224,130 L243,129 L261,131 L280,132 L298,136 L317,138 L336,142 L355,142 L374,142 L392,142 L411,142 L430,135 L449,124 L466,114 L483,98 L502,85 L520,80 L539,62 L556,47 L574,33 L593,21 L600,18",
      startLabel: "1056 moh",
      endLabel: "1478 moh",
      distanceLabel: "2,9 km",
      caption: "473 høydemeter og 2,87 km fra Hornslie til toppen, med 48 meter gitt tilbake i Hødnetjedne-bassenget.",
    },
  },
  oksen: {
    slug: "oksen",
    intro:
      "963 høydemeter i ett strekk, fra Tjoflot nede ved fjorden til en topp som ser ut over Hardangerfjorden, Granvinsfjorden, Sørfjorden og Eidfjorden. Turen krever kondisjon mer enn teknikk.",
    ascent: [
      "Fra avgiftsparkeringen øverst på Tjoflotvegen, 277 moh, følger du traktorveien et kort stykke før stien tar over. Regn med å bære ski gjennom skogen: skoggrensa ligger på 538 moh, og de fleste spenner dem først på oppe ved Vindhovden.",
      "Skogen er det bratteste partiet før flanken. Fallinja mellom 335 og 405 moh måler 30° i snitt og tar 51° over de bratteste seksti meterne; stien tar den i svinger, holder seg under 25° per hundremeterspenn og topper på 33° rundt 480 moh. Følg svingene — det finnes ingen snarvei her som lønner seg.",
      "Ved stølen Vindhovden på 586 moh åpner det seg. Herfra følger du sørvestsida østover mot toppen, langs skulderen under ryggen. Rundt 900 moh strammer det til: spennet 900–1000 moh ligger på 26,7° i snitt og 1000–1100 på 24,7°, og det bratteste enkeltpartiet på linja — 34,8° — kommer rundt 1080 moh. Grunnen blir samtidig steinete.",
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
        body: "Ruta stiger 963 høydemeter på 3,39 km, og den bratteste delen ligger mellom 900 og 1100 moh: 26,7° i snitt over det første hundremeterspennet, 24,7° over det neste. Det bratteste enkeltpartiet på linja måler 34,8° og ligger rundt 1080 moh. Det er over grensa der snø løsner, og partiet er langt nok til at du bør vurdere det for seg.",
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
      path: "M0,200 L23,194 L47,187 L71,179 L95,173 L117,162 L137,151 L160,142 L184,138 L208,131 L232,127 L256,124 L279,118 L303,112 L327,108 L351,104 L375,97 L398,89 L420,77 L442,65 L465,54 L487,43 L510,36 L534,30 L558,25 L582,19 L600,18",
      startLabel: "277 moh",
      endLabel: "1241 moh",
      distanceLabel: "3,4 km",
      caption: "277 moh ved Tjoflot til toppen av Oksen — 963 høydemeter på 3,39 km, uten en meter tilbake.",
    },
  },
  melderskin: {
    slug: "melderskin",
    intro:
      "Rosendalsalpenes klassiker — 1272 høydemeter fra gårdstunet på Kletta til varden, uten en meter tilbake underveis. En lang dag for den som vil ha hele fjellet fra bunnen av.",
    ascent: [
      "Fra parkeringen ved Kletta, 153 moh, følger du veien 300 meter før stien svinger opp mot Skarshaug. Første strekket går over innmark og videre inn i blandingsskogen; sporet er tydelig, og du stiger jevnt gjennom skogen til rundt 520 moh.",
      "Over tregrensa reiser lia seg. Mellom 600 og 700 moh holder den 31,8° i snitt over hundre høydemeter — det bratteste sammenhengende partiet på hele turen, og det du vil ha unnagjort tidlig på dagen. Toppen av bakken er Skarshaug, 806 moh, halvveis til Melderskin.",
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
        body: "Den bratteste hundremeteren ligger mellom 600 og 700 moh og holder 31,8°; bratteste enkeltsteg på linja måler 36,3°. Det er skredterreng, og det ligger i lia du må gjennom uansett. Ta den vurderingen nede ved skogkanten, mens det ikke koster deg noe å snu.",
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
      path: "M0,200 L24,197 L47,194 L71,189 L94,182 L118,177 L140,169 L161,158 L183,147 L206,137 L226,126 L247,113 L269,105 L291,96 L314,85 L337,74 L361,64 L384,60 L407,56 L431,52 L454,49 L478,48 L501,46 L525,43 L547,34 L570,24 L593,18 L600,18",
      startLabel: "153 moh",
      endLabel: "1426 moh",
      distanceLabel: "4,6 km",
      caption: "153 til 1425 moh på 4,6 km. Bratteste hundremeteren ligger mellom 600 og 700, opp mot Skarshaug.",
    },
  },
  gaustatoppen: {
    slug: "gaustatoppen",
    intro:
      "Sør-Norges mest markante topp, og en av de snilleste å gå på ski: 965 høydemeter fra Langefonn, og ikke et steg over 25° på hele oppstigningen.",
    ascent: [
      "Fra parkeringen ved Langefonn turisthytte, 921 moh, følger du den vinterstengte veien mot Stavsro. Etter 850 meter står du ved Svineroisetra, 1021 moh — det er kilometeren beskrivelsene snakker om. Bjørkebeltet slipper taket rundt 970 moh, og derfra er alt åpent fjell. Østryggen kan også nås fra Stavsro med 706 høydemeter, men veien dit er vinterstengt.",
      "Ved setra tar du av veien svakt til høyre, sørvest, og setter kursen mot det laveste punktet på Himmelranden — toppen av Langefonn, 1455 moh. Ikke gå rett opp mot varden herfra. Fallinja fra Svineroisetra rett mot toppen holder 35–37° i øverste tredjedel; traversen mot Langefonn stiger jevnt på 12–16° og passerer aldri 25°, og det er den linja denne ruta følger.",
      "Fra det laveste punktet vender du vest-nordvest og følger eggen. Stigningen er jevn: den bratteste hundremeteren på hele turen ligger mellom 1700 og 1800 moh og måler 17,3°, og bratteste enkeltsteg er 23,4°. Underveis kommer du inn på sommerstien fra Stavsro.",
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
        body: "Linja fra Langefonn holder seg under 25° hele veien til varden: bratteste enkeltsteg måler 23,4°, og den bratteste hundremeteren, mellom 1700 og 1800 moh, holder 17,3°. Selve oppstigningen er lite skredterreng. Det som flytter regnestykket er vinden — den blåser eggen bar og legger snøen i rennene på østsiden.",
      },
      {
        title: "Terrenget rundt",
        body: "Tre steder ligger utenfor ruta og skal bli der. Østsiden av topptårnet med de sju rennene, der skred har tatt liv. Nordøstflanken rett under varden, 35° i snitt over fire hundre meter og 46° på det bratteste — det er fallinja mot Svineroisetra, og den du havner i om du slipper deg rett ned fra toppflata. Og nordvestsiden mot Rjukan: øverst er den slak, 14° de første fire hundre metrene, men den fortsetter 1350 høydemeter ned i dalen og bratner til over 50° nederst. Det er slakheten øverst som er fella.",
      },
      {
        title: "Før du går",
        body: "Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Ta med sender/mottaker, søkestang og spade.",
      },
    ],
    elevationProfile: {
      path: "M0,200 L19,197 L38,191 L56,187 L74,185 L93,182 L112,179 L130,175 L149,169 L168,163 L186,156 L205,149 L224,145 L242,140 L261,135 L279,128 L297,119 L316,112 L334,106 L353,97 L372,91 L390,82 L409,75 L427,67 L446,59 L464,51 L483,45 L502,36 L520,27 L539,23 L557,24 L576,21 L594,20 L600,18",
      startLabel: "921 moh",
      endLabel: "1883 moh",
      distanceLabel: "4,3 km",
      caption: "921 til 1879 moh på 4,35 km. Bratteste hundremeteren måler 17,3°, og ingenting på linja passerer 25°.",
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
