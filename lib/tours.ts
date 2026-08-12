import { ROUTES, type TourRoute } from "./routes";
import type { Tour } from "./types";

/** The 24 tours from the prototype (`design-reference/kart.html` → TOURS).
 *
 *  Summit coordinates are now real: each one is resolved through Kartverket's
 *  place-name register, snapped to the highest cell of the 1 m terrain model and
 *  cross-checked against the published height. The teasers are still editorial
 *  drafts. In production these rows live in Supabase; this module is the seed
 *  and the local fallback.
 */
export const TOURS: Tour[] = [
  { slug: "storgalten", name: "Storgalten", region: "Lyngen", lat: 69.88543, lng: 20.25257, summitM: 1219, verticalM: 1219, duration: "5–7 t", grade: 3, aspect: "NV", season: "feb–mai", hasGuide: true, teaser: "Fjord-til-topp i ytre Lyngen: 1219 høydemeter rett opp fra havnivå." },
  { slug: "store-blamann", name: "Store Blåmann", region: "Troms", lat: 69.73502, lng: 18.59147, summitM: 1044, verticalM: 1040, duration: "4–6 t", grade: 3, aspect: "S", season: "feb–mai", hasGuide: true, teaser: "Kvaløyas brattest profilerte klassiker — krever stabile forhold og god planlegging." },
  { slug: "kjolen", name: "Kjølen", region: "Troms", lat: 69.73349, lng: 18.78773, summitM: 790, verticalM: 580, duration: "3–5 t", grade: 1, aspect: "NØ", season: "nov–mai", teaser: "580 høydemeter fra Finnvikvatnet innover dalen til radaren og varmebua — en av Kvaløyas mest besøkte topper." },
  { slug: "rodtinden", name: "Rødtinden", region: "Troms", lat: 69.70147, lng: 18.75254, summitM: 470, verticalM: 450, duration: "2–4 t", grade: 1, aspect: "SØ", season: "des–mai", teaser: "450 høydemeter fra Storelva skistadion opp den åpne sørøstsida — den mest besøkte toppen rundt Tromsø." },
  { slug: "tromsdalstinden", name: "Tromsdalstinden", region: "Troms", lat: 69.6071, lng: 19.14585, summitM: 1238, verticalM: 1212, duration: "5–7 t", grade: 2, aspect: "V", season: "des–mai", hasGuide: true, teaser: "Tromsøs signaturtopp: lang, jevn oppstigning fra Tromsdalen med storslått utsikt mot Lyngen." },
  { slug: "rornestinden", name: "Rørnestinden", region: "Lyngen", lat: 69.57329, lng: 20.11187, summitM: 1030, verticalM: 1018, duration: "4–6 t", grade: 2, aspect: "V", season: "jan–mai", hasGuide: true, teaser: "Den vennligste inngangen til Lyngsalpene, med slak rygg og romslig nedkjøring." },
  { slug: "hamperokken", name: "Hamperokken", region: "Troms", lat: 69.5621, lng: 19.35872, summitM: 1397, verticalM: 1389, duration: "5–7 t", grade: 4, aspect: "NV", season: "feb–mai", hasGuide: true, teaser: "1400 høydemeter fra Fv91, men skiene settes igjen på Middagsaksla 1076 moh – siste 1,4 km er eksponert rygg til fots." },
  { slug: "kavringtinden", name: "Kavringtinden", region: "Lyngen", lat: 69.54704, lng: 20.12428, summitM: 1289, verticalM: 1250, duration: "5–7 t", grade: 3, aspect: "N", season: "mar–mai", hasGuide: true, teaser: "Indre Lyngen-perle med nordvendt snø som holder seg langt ut i mai." },
  { slug: "hesten-segla", name: "Hesten (Segla)", region: "Senja", lat: 69.51388, lng: 17.58462, summitM: 556, verticalM: 510, duration: "2–4 t", grade: 2, aspect: "S", season: "jan–apr", hasGuide: true, teaser: "Kort tur, stort postkort: nedkjøring med Segla i fanget og havet under." },
  { slug: "keipen", name: "Keipen", region: "Senja", lat: 69.4953, lng: 17.72324, summitM: 938, verticalM: 840, duration: "3–5 t", grade: 3, aspect: "S", season: "jan–mai", hasGuide: true, teaser: "840 høydemeter fra Medfjordbotnvatnan gjennom skåla sør for toppen; ruta skrår opp, mens fallinja ved sida av måler 38–52 grader." },
  { slug: "breitinden", name: "Breitinden", region: "Senja", lat: 69.45168, lng: 17.65623, summitM: 1007, verticalM: 1050, duration: "4–6 t", grade: 4, aspect: "SV", season: "jan–apr", hasGuide: true, teaser: "1050 høydemeter fra Svarthola via Svartholvatnet og nordbredden av Breitindvatnet; de siste 244 er klyving på sørvestryggen." },
  { slug: "moysalen", name: "Møysalen", region: "Vesterålen", lat: 68.52598, lng: 15.45215, summitM: 1264, verticalM: 1600, duration: "7–9 t", grade: 4, aspect: "S", season: "jan–mai", hasGuide: true, teaser: "1600 høydemeter fra E10 ved Litlvatnet: 355 av dem gir du fra deg underveis, 120 av dem ned til Grønnvatnet på 328." },
  { slug: "strandtinden", name: "Strandtinden", region: "Harstad", lat: 68.50455, lng: 16.03441, summitM: 1076, verticalM: 1090, duration: "4–6 t", grade: 3, aspect: "N", season: "jan–jun", teaser: "1090 høydemeter fra E10 ved havet gjennom Heggedalen — Harstad-områdets store klassiker, og fjellet flest går der." },
  { slug: "rombakstotta", name: "Rombakstøtta", region: "Narvik", lat: 68.43312, lng: 17.58324, summitM: 1231, verticalM: 1129, duration: "5–7 t", grade: 3, aspect: "SV", season: "feb–mai", hasGuide: true, teaser: "Narviks spisse landemerke — variert oppstigning og fin, vedvarende nedkjøring." },
  { slug: "geitgaljen", name: "Geitgaljen", region: "Lofoten", lat: 68.34434, lng: 14.81302, summitM: 1085, verticalM: 1070, duration: "4–6 t", grade: 4, aspect: "NV", season: "feb–apr", hasGuide: true, teaser: "1071 høydemeter fra Liland opp Lilandsdalen; renna fra 250 til 360 moh er 35 grader, og toppen krever stegjern." },
  { slug: "himmeltindan", name: "Himmeltindan", region: "Lofoten", lat: 68.22101, lng: 13.57307, summitM: 956, verticalM: 980, duration: "4–6 t", grade: 3, aspect: "Ø", season: "feb–apr", hasGuide: true, teaser: "Vestvågøys høyeste, med alpint preg og linjer rett mot Nordishavet." },
  { slug: "stornappstinden", name: "Stornappstinden", region: "Lofoten", lat: 68.1441, lng: 13.41493, summitM: 740, verticalM: 680, duration: "3–5 t", grade: 2, aspect: "N", season: "jan–apr", hasGuide: true, teaser: "Lofot-klassiker i overkommelig format — mye fjell for høydemeterne." },
  { slug: "vassfjellet", name: "Vassfjellet", region: "Trøndelag", lat: 63.26205, lng: 10.35659, summitM: 711, verticalM: 560, duration: "3–5 t", grade: 1, aspect: "V", season: "des–apr", hasGuide: true, teaser: "560 høydemeter fra Markavollen forbi Vassfjellhytta — den nærmeste toppturen til Trondheim, i løype hele vegen." },
  { slug: "krakfjellet", name: "Kråkfjellet", region: "Trøndelag", lat: 63.16336, lng: 10.63219, summitM: 815, verticalM: 470, duration: "4–6 t", grade: 2, aspect: "S", season: "des–apr", hasGuide: true, teaser: "Kommunetoppen i Trondheim: 470 høydemeter og ti kilometer fra Håen over Kråklivollen og Rundtjønnin." },
  { slug: "rensfjellet", name: "Rensfjellet", region: "Trøndelag", lat: 63.14219, lng: 10.72186, summitM: 942, verticalM: 700, duration: "5–7 t", grade: 2, aspect: "V", season: "des–apr", hasGuide: true, teaser: "700 høydemeter og elleve kilometer fra Håen over Rundtjønnin og Oksdalen til Melhus' høyeste punkt." },
  { slug: "snota", name: "Snota", region: "Trollheimen", lat: 62.84778, lng: 9.09428, summitM: 1668, verticalM: 1270, duration: "6–8 t", grade: 3, aspect: "Ø", season: "feb–mai", hasGuide: true, teaser: "1270 høydemeter fra Gråhaugen over Svartvatnet og rundt Litj-Snota til det høyeste fjellet nord i Trollheimen." },
  { slug: "storbekkhoa", name: "Storbekkhøa", region: "Trollheimen", lat: 62.73022, lng: 9.08038, summitM: 1504, verticalM: 890, duration: "4–6 t", grade: 2, aspect: "S", season: "des–mai", hasGuide: true, teaser: "890 høydemeter fra Storli opp Storbekkdalen og gjennom skaret vest for den bratte sørøstveggen." },
  { slug: "okla", name: "Okla", region: "Trollheimen", lat: 62.68955, lng: 9.26225, summitM: 1582, verticalM: 1020, duration: "4–6 t", grade: 2, aspect: "S", season: "des–apr", hasGuide: true, teaser: "1020 høydemeter fra Dalen i Storlidalen opp til Snydda — varden på toppen av Okla-massivet." },
  { slug: "storhornet", name: "Storhornet", region: "Trollheimen", lat: 62.64779, lng: 9.39918, summitM: 1589, verticalM: 940, duration: "4–6 t", grade: 2, aspect: "SØ", season: "des–mai", hasGuide: true, teaser: "940 høydemeter på merket vinterløype fra Bree gjennom Hornlia til steinbua på Oppdals mest besøkte topp." },
  { slug: "kirketaket", name: "Kirketaket", region: "Romsdal", lat: 62.61158, lng: 7.90672, summitM: 1439, verticalM: 1270, duration: "5–6 t", grade: 2, aspect: "SV", season: "des–mai", hasGuide: true, teaser: "Norges kanskje mest populære topptur: bred rygg, trygge linjevalg, lang sesong." },
  { slug: "auskjeret", name: "Auskjeret", region: "Sunnmøre", lat: 62.37746, lng: 6.77458, summitM: 1203, verticalM: 870, duration: "3–5 t", grade: 2, aspect: "SØ", season: "des–apr", hasGuide: true, teaser: "870 høgdemeter frå Fausaskiftet i jamn stigning nordover — heilårsopen veg og moderate hellingar." },
  { slug: "snohetta", name: "Snøhetta", region: "Dovrefjell", lat: 62.31992, lng: 9.26747, summitM: 2286, verticalM: 820, duration: "5–7 t", grade: 2, aspect: "Ø", season: "apr–jun", hasGuide: true, teaser: "Storslått og luftig, men overraskende snill — når Snøheimvegen åpner." },
  { slug: "jonshornet", name: "Jønshornet", region: "Sunnmøre", lat: 62.31695, lng: 6.33395, summitM: 1417, verticalM: 1430, duration: "6–8 t", grade: 4, aspect: "N", season: "feb–mai", hasGuide: true, teaser: "1430 høgdemeter frå Vollane over Rametinden, og dei siste hundre på smal egg til varden på Ramoen." },
  { slug: "ytstevasshornet", name: "Ytstevasshornet", region: "Sunnmøre", lat: 62.28014, lng: 6.73548, summitM: 1331, verticalM: 830, duration: "3–5 t", grade: 3, aspect: "Ø", season: "jan–mai", hasGuide: true, teaser: "830 høgdemeter frå Svartevatnet: bratt opp Vassdalen til vatna på 950 moh, så nordvest mot ein smal og skavlete topprygg." },
  { slug: "rana", name: "Råna", region: "Sunnmøre", lat: 62.27554, lng: 6.57479, summitM: 1587, verticalM: 1600, duration: "7–9 t", grade: 3, aspect: "SØ", season: "mars–mai", hasGuide: true, teaser: "1600 høgdemeter frå Urkegjerdet ved fjorden: inn dalen til Nordkopen, bratt opp på egga og nordover den breie toppryggen." },
  { slug: "kolastinden", name: "Kolåstinden", region: "Sunnmøre", lat: 62.25886, lng: 6.31102, summitM: 1432, verticalM: 1120, duration: "5–7 t", grade: 3, aspect: "N", season: "feb–mai", hasGuide: true, teaser: "Alpin klassiker fra Standaldalen med velkjent renne og storslått finish." },
  { slug: "vassdalstinden", name: "Vassdalstinden", region: "Sunnmøre", lat: 62.24405, lng: 6.18966, summitM: 1278, verticalM: 1210, duration: "5–7 t", grade: 3, aspect: "Ø", season: "feb–mai", hasGuide: true, teaser: "1210 høgdemeter frå Nupen: seterveg til Vallasætra, kneiken opp i Bukkedalen og ein lang flanke til topps." },
  { slug: "saudehornet", name: "Saudehornet", region: "Sunnmøre", lat: 62.23578, lng: 6.14246, summitM: 1303, verticalM: 1160, duration: "4–6 t", grade: 3, aspect: "SV", season: "jan–mai", hasGuide: true, teaser: "1157 høgdemeter frå vassverket i Ørsta, og ryggkammen held rundt 32° i snitt dei siste 170, med det brattaste på 37." },
  { slug: "slogen", name: "Slogen", region: "Sunnmøre", lat: 62.20818, lng: 6.67306, summitM: 1564, verticalM: 1535, duration: "6–8 t", grade: 4, aspect: "V", season: "mar–mai", hasGuide: true, teaser: "Sunnmørsalpenes dronning — en alvorlig tur for erfarne, i riktig vindu." },
  { slug: "torvloysa", name: "Torvløysa", region: "Sunnmøre", lat: 62.1834, lng: 7.28026, summitM: 1851, verticalM: 1460, duration: "7–9 t", grade: 2, aspect: "N", season: "mars–mai", hasGuide: true, teaser: "1460 høgdemeter og ti kilometer frå Hatlestad over Rellingsætra og Daurmålsfjellet, mest slak rygg." },
  { slug: "skarene", name: "Skårene", region: "Sunnmøre", lat: 62.17982, lng: 7.19977, summitM: 1830, verticalM: 1220, duration: "5–7 t", grade: 3, aspect: "S", season: "mars–mai", hasGuide: true, teaser: "1220 høgdemeter frå Korsmyra opp Gråsteindalen og den store snøflanken til ein av dei høgaste toppane over Eidsdal." },
  { slug: "melshornet", name: "Melshornet", region: "Sunnmøre", lat: 62.17381, lng: 6.14287, summitM: 809, verticalM: 560, duration: "2–4 t", grade: 1, aspect: "SØ", season: "des–apr", hasGuide: true, teaser: "560 høgdemeter på preparert løype frå Helgatun — husfjellet som blir gått i mørket heile vinteren." },
  { slug: "jakta", name: "Jakta", region: "Sunnmøre", lat: 62.1711, lng: 6.61671, summitM: 1589, verticalM: 1560, duration: "6–8 t", grade: 3, aspect: "SØ", season: "feb–mai", hasGuide: true, teaser: "1560 høgdemeter frå Norang: slak stigning inn Konedalen, så ei 33-graders side opp på den smale toppryggen." },
  { slug: "skarasalen", name: "Skårasalen", region: "Sunnmøre", lat: 62.16566, lng: 6.48583, summitM: 1542, verticalM: 1452, duration: "6–8 t", grade: 3, aspect: "V", season: "jan–mai", hasGuide: true, teaser: "1438 høgdemeter frå bommen på Kvistadvegen, med det brattaste opp mot skaret på 1074 moh." },
  { slug: "kvitegga", name: "Kvitegga", region: "Sunnmøre", lat: 62.0948, lng: 6.7022, summitM: 1700, verticalM: 1480, duration: "6–8 t", grade: 3, aspect: "Ø", season: "mars–mai", hasGuide: true, teaser: "1480 høgdemeter frå Nibbedalen gjennom Snødalen og over Brattbakken til det høgste fjellet i midtre Sunnmørsalpane." },
  { slug: "hornindalsrokken", name: "Hornindalsrokken", region: "Sunnmøre", lat: 62.07148, lng: 6.65766, summitM: 1527, verticalM: 1470, duration: "6–8 t", grade: 4, aspect: "Ø", season: "mars–mai", hasGuide: true, teaser: "1470 høgdemeter frå Langøylia over Aksla, Trollaksla og Sætrenibba; dei siste 103 går på utsett rygg." },
  { slug: "sunndalsnipa", name: "Sunndalsnipa", region: "Sunnmøre", lat: 62.01816, lng: 6.32162, summitM: 1395, verticalM: 990, duration: "4–6 t", grade: 2, aspect: "S", season: "des–apr", hasGuide: true, teaser: "990 høgdemeter frå Grøndalsvatnet opp søraustryggen, og ein kilometer flatt platå fram til varden." },
  { slug: "eidskyrkja", name: "Eidskyrkja", region: "Sunnmøre", lat: 62.01709, lng: 6.2624, summitM: 1482, verticalM: 1120, duration: "4–6 t", grade: 3, aspect: "N", season: "mars–mai", hasGuide: true, teaser: "1120 høgdemeter frå Skinnviksætra opp Blåbreen: 25 grader nedst på breen og eit vidt toppplatå øvst." },
  { slug: "rondslottet", name: "Rondslottet", region: "Rondane", lat: 61.9149, lng: 9.8512, summitM: 2178, verticalM: 1280, duration: "6–8 t", grade: 2, aspect: "S", season: "mar–mai", hasGuide: true, teaser: "Rondanes høyeste: rolig høyfjellsterreng og stabil vårsesong." },
  { slug: "glitregga", name: "Glitregga", region: "Nordfjord", lat: 61.90741, lng: 6.37278, summitM: 1297, verticalM: 900, duration: "4–6 t", grade: 2, aspect: "S", season: "des–apr", hasGuide: true, teaser: "900 høgdemeter frå idrettsanlegget i Randabygd, sørvend og slak heile vegen opp." },
  { slug: "storronden", name: "Storronden", region: "Rondane", lat: 61.8917, lng: 9.86198, summitM: 2139, verticalM: 1140, duration: "6–8 t", grade: 2, aspect: "SV", season: "mars–mai", hasGuide: true, teaser: "1140 høydemeter fra Spranget: seks kilometer innmarsj til Rondvassbu, så 2,6 km jevn vestrygg fra stidelet på 1440 moh." },
  { slug: "skala", name: "Skåla", region: "Nordfjord", lat: 61.86923, lng: 6.97251, summitM: 1848, verticalM: 1820, duration: "6–8 t", grade: 3, aspect: "SV", season: "mar–jun", hasGuide: true, teaser: "1848 sammenhengende høydemeter fra fjorden i Loen — en av landets lengste nedkjøringer." },
  { slug: "skarsteinfjellet", name: "Skarsteinsfjellet", region: "Nordfjord", lat: 61.83055, lng: 6.73533, summitM: 1567, verticalM: 1220, duration: "5–7 t", grade: 2, aspect: "V", season: "jan–apr", hasGuide: true, teaser: "1220 høgdemeter opp ein jamn rygg over Innvikdalen — heile ruta i terreng under 30 grader." },
  { slug: "lodalskapa", name: "Lodalskåpa", region: "Nordfjord", lat: 61.79051, lng: 7.20475, summitM: 2082, verticalM: 1520, duration: "7–9 t", grade: 4, aspect: "V", season: "mai–jun", hasGuide: true, teaser: "1520 høgdemeter frå Bødalssætra over Kåpevatnet og Bohrsbreen til det einaste 2000-metersfjellet i Nordfjord." },
  { slug: "snonipa", name: "Snønipa", region: "Sunnfjord", lat: 61.67808, lng: 6.69055, summitM: 1827, verticalM: 1490, duration: "7–9 t", grade: 3, aspect: "SØ", season: "feb–mai", hasGuide: true, teaser: "1490 høgdemeter opp Haugadalen og midt i brefallet på Haugabreen til det høgste fjellet i Sunnfjord." },
  { slug: "glittertinden", name: "Glittertinden", region: "Jotunheimen", lat: 61.65138, lng: 8.5575, summitM: 2451, verticalM: 1228, duration: "7–9 t", grade: 3, aspect: "SØ", season: "juni–juli", hasGuide: true, teaser: "13,3 km og 1228 høydemeter fra Veodalen: 7 km flat innmarsj til Glitterheim, så jevn stigning øst for Glitterbrean." },
  { slug: "galdhopiggen", name: "Galdhøpiggen", region: "Jotunheimen", lat: 61.63644, lng: 8.31243, summitM: 2469, verticalM: 642, duration: "6–8 t", grade: 3, aspect: "N", season: "apr–jun", hasGuide: true, teaser: "Norges tak på ski — bre, tau og stor høyde; vanligvis gått fra Juvasshytta." },
  { slug: "steindalsnosi", name: "Steindalsnosi", region: "Sogn", lat: 61.52696, lng: 7.90076, summitM: 2025, verticalM: 760, duration: "3–5 t", grade: 1, aspect: "S", season: "apr–jun", hasGuide: true, teaser: "2000-meter for de fleste: kort, slak og solvendt fra Sognefjellsveien." },
  { slug: "besshoe", name: "Besshø", region: "Jotunheimen", lat: 61.51791, lng: 8.68712, summitM: 2257, verticalM: 1328, duration: "6–8 t", grade: 3, aspect: "Ø", season: "mars–mai", hasGuide: true, teaser: "1328 høydemeter fra Bessheim: tre og en halv kilometer langs Bessvatnet før Grotådalen, og til slutt den slake austryggen over Brue." },
  { slug: "fanaraken", name: "Fanaråken", region: "Sogn", lat: 61.51669, lng: 7.90825, summitM: 2068, verticalM: 780, duration: "5–7 t", grade: 2, aspect: "N", season: "apr–jun", hasGuide: true, teaser: "Høyfjellstur fra Sognefjellet med breutsikt og pålitelig vårsnø." },
  { slug: "kvamshesten", name: "Kvamshesten", region: "Sunnfjord", lat: 61.40141, lng: 5.62732, summitM: 1209, verticalM: 840, duration: "4–6 t", grade: 3, aspect: "N", season: "des–mai", hasGuide: true, teaser: "840 høgdemeter frå Rytnavegen forbi Skaravatnet og Grunnevatnet, med ei 36-graders skål til slutt." },
  { slug: "rasletinden", name: "Rasletinden", region: "Jotunheimen", lat: 61.39514, lng: 8.69944, summitM: 2104, verticalM: 778, duration: "4–6 t", grade: 2, aspect: "Ø", season: "apr–mai", hasGuide: true, teaser: "778 høydemeter og 7,2 km fra Valdresflye: flatt de første 2,2 km, så en kneik til 1530 moh og slak rygg østfra mot toppen." },
  { slug: "banseterkampen", name: "Bånsæterkampen", region: "Ringebufjellet", lat: 61.39144, lng: 10.10642, summitM: 1196, verticalM: 341, duration: "2–4 t", grade: 2, aspect: "NØ", season: "jan–apr", hasGuide: true, teaser: "330 høydemeter fra Bånsetra opp på en fjellrygg med stup mot sør — Kvitfjells nærmeste fjell, tvers over Lågen." },
  { slug: "molden", name: "Molden", region: "Sogn", lat: 61.34417, lng: 7.31973, summitM: 1120, verticalM: 620, duration: "2–4 t", grade: 1, aspect: "SV", season: "feb–apr", hasGuide: true, teaser: "620 høgdemeter frå Mollandsmarki opp sørvestryggen, med Lustrafjorden under seg heile vegen." },
  { slug: "synshorn", name: "Synshorn", region: "Valdres", lat: 61.34011, lng: 8.79727, summitM: 1475, verticalM: 420, duration: "2–3 t", grade: 1, aspect: "Ø", season: "feb–mai", hasGuide: true, teaser: "Kort og trygg tur fra Valdresflye — perfekt førstetur og værvindu-tur." },
  { slug: "bitihorn", name: "Bitihorn", region: "Valdres", lat: 61.29435, lng: 8.79947, summitM: 1607, verticalM: 550, duration: "2–4 t", grade: 1, aspect: "S", season: "feb–mai", hasGuide: true, teaser: "Markert horn med enkel normalrute og fin utsikt over Bygdin." },
  { slug: "ulvsjoberget", name: "Ulvsjøberget", region: "Trysil", lat: 61.26561, lng: 12.018, summitM: 854, verticalM: 300, duration: "1–3 t", grade: 2, aspect: "SØ", season: "jan–apr", hasGuide: true, teaser: "300 høydemeter fra Vestby opp gjennom skogen til det åpne fjellet — den høyeste toppen i Trysil utenfor alpinanlegget." },
  { slug: "nevelfjell", name: "Nevelfjell", region: "Øyerfjellet", lat: 61.20491, lng: 10.56762, summitM: 1090, verticalM: 270, duration: "2–4 t", grade: 1, aspect: "Ø", season: "des–apr", hasGuide: true, teaser: "270 høydemeter fra Nordseter over Nevelåsen til Lillehammerfjellets mest besøkte topp, med åpen bu og siktskive på 1089." },
  { slug: "slettind", name: "Slettind", region: "Hemsedal", lat: 60.96896, lng: 8.18399, summitM: 1592, verticalM: 470, duration: "2–4 t", grade: 1, aspect: "NV", season: "jan–mai", hasGuide: true, teaser: "470 høgdemeter frå rv 52 ved Eldrevatn opp ei jamn 20–25-graders flanke — nybegynnartoppen på Hemsedalsfjellet." },
  { slug: "kyrkjebonosi", name: "Kyrkjebønosi", region: "Hemsedal", lat: 60.90555, lng: 8.55601, summitM: 1670, verticalM: 1000, duration: "4–6 t", grade: 3, aspect: "V", season: "feb–mai", hasGuide: true, teaser: "1000 høgdemeter frå grustaket ved Kyrkjebøen over den første toppen på 1610 og nordover den lange, flate ryggen." },
  { slug: "nibbi", name: "Nibbi", region: "Hemsedal", lat: 60.88661, lng: 8.6501, summitM: 1740, verticalM: 800, duration: "3–5 t", grade: 2, aspect: "S", season: "feb–mai", hasGuide: true, teaser: "800 høgdemeter frå Lykkjastølen vest for fossen og opp dalen — Hemsedals mest gåtte vårtopp." },
  { slug: "raskarfjellet", name: "Råskarfjellet", region: "Hemsedal", lat: 60.88427, lng: 8.20901, summitM: 1610, verticalM: 680, duration: "3–5 t", grade: 2, aspect: "NØ", season: "feb–mai", teaser: "680 høgdemeter frå Sildegjerdet ved rv 52 opp bekkedalen — hemsedølenes eigen klassikar, kjend berre som «1609»." },
  { slug: "skogshorn", name: "Skogshorn", region: "Hemsedal", lat: 60.88148, lng: 8.69482, summitM: 1729, verticalM: 840, duration: "3–5 t", grade: 2, aspect: "Ø", season: "feb–mai", hasGuide: true, teaser: "836 høgdemeter frå Trefta opp den breie austryggen; brattaste måling er 28,5 grader." },
  { slug: "storehorn", name: "Storehorn", region: "Hemsedal", lat: 60.81506, lng: 8.59566, summitM: 1482, verticalM: 470, duration: "3–4 t", grade: 2, aspect: "Ø", season: "des–apr", hasGuide: true, teaser: "Hemsedals husfjell for topptur — kort vei fra bilen, mange linjevalg." },
  { slug: "storanosi", name: "Storanosi", region: "Voss", lat: 60.7663, lng: 6.62341, summitM: 1205, verticalM: 740, duration: "3–5 t", grade: 2, aspect: "NØ", season: "jan–apr", hasGuide: true, teaser: "740 høgdemeter frå Ljosno gjennom open bjørkeskog og ut på platået over Brandsetdalen." },
  { slug: "lonahorgi", name: "Lønahorgi", region: "Voss", lat: 60.69383, lng: 6.41489, summitM: 1412, verticalM: 1300, duration: "6–8 t", grade: 2, aspect: "NØ", season: "feb–april", hasGuide: true, teaser: "1300 høgdemeter frå Høyland via Bergsstølen og Breiming, med dei siste 107 opp nordryggen frå punkt 1305." },
  { slug: "horndalsnuten", name: "Horndalsnuten", region: "Voss", lat: 60.64218, lng: 6.67655, summitM: 1462, verticalM: 1120, duration: "5–7 t", grade: 3, aspect: "N", season: "jan–apr", hasGuide: true, teaser: "1120 høgdemeter frå Skiple gjennom Horndalsbotnen, med den bratte kneika frå skuldra til slutt." },
  { slug: "folarskardnuten", name: "Folarskardnuten", region: "Hallingdal", lat: 60.60742, lng: 7.78251, summitM: 1932, verticalM: 997, duration: "6–8 t", grade: 3, aspect: "S", season: "mars–mai", hasGuide: true, teaser: "Over 13 km inn frå Haugastøl og 997 høgdemeter, med eit kort 29-graders trinn opp frå Folarskardet." },
  { slug: "prestholtskarvet", name: "Prestholtskarvet", region: "Geilo", lat: 60.55843, lng: 8.0126, summitM: 1860, verticalM: 960, duration: "6–8 t", grade: 3, aspect: "S", season: "jan–apr", hasGuide: true, teaser: "Elleve kilometer og 960 høydemeter fra Havsdalen forbi Prestholtstølan og opp Prestholtskardet til Hallingskarvets sørskarv." },
  { slug: "gyranfisen", name: "Gyranfisen", region: "Vikerfjell", lat: 60.47203, lng: 9.89027, summitM: 1127, verticalM: 670, duration: "3–5 t", grade: 2, aspect: "Ø", season: "jan–apr", hasGuide: true, teaser: "670 høydemeter fra Vikerkoia over Svarttjernskollen, med 200 av dem gitt tilbake i søkket før Ringerikes høyeste punkt." },
  { slug: "oksen", name: "Oksen", region: "Hardanger", lat: 60.45983, lng: 6.68301, summitM: 1241, verticalM: 960, duration: "4–6 t", grade: 2, aspect: "SV", season: "jan–apr", hasGuide: true, teaser: "Fjordutsikt i alle retninger og jevn stigning fra Tjoflot." },
  { slug: "ustetind", name: "Ustetind", region: "Geilo", lat: 60.45856, lng: 8.0902, summitM: 1376, verticalM: 410, duration: "2–4 t", grade: 2, aspect: "N", season: "feb–mai", hasGuide: true, teaser: "410 høydemeter fra Ustaoset forbi Tindevatnet til varden fra 1899, med Hardangervidda i sør og Hallingskarvet i nord." },
  { slug: "grafjell", name: "Gråfjell", region: "Norefjell", lat: 60.31831, lng: 9.39572, summitM: 1466, verticalM: 595, duration: "4–6 t", grade: 2, aspect: "S", season: "des–mars", hasGuide: true, teaser: "580 høydemeter og 7,8 km fra Tempelsetra forbi Istjenn og Donkelitjenn til Norefjells høyeste topp." },
  { slug: "vesoldo", name: "Vesoldo", region: "Hardanger", lat: 60.31237, lng: 6.09197, summitM: 1046, verticalM: 840, duration: "3–5 t", grade: 2, aspect: "SV", season: "feb–apr", hasGuide: true, teaser: "838 høgdemeter frå Byrkjenes, skog opp til Fadnastølen og open sørvestrygg over; nord- og vestsida av toppen fell 48–55°." },
  { slug: "ranten", name: "Ranten", region: "Norefjell", lat: 60.30259, lng: 9.41922, summitM: 1416, verticalM: 530, duration: "3–5 t", grade: 2, aspect: "S", season: "jan–apr", hasGuide: true, teaser: "530 høydemeter fra Tempelseter om stikrysset på Raudmyra og vestover opp på den taggete ryggen Kittelsen malte som Soria Moria." },
  { slug: "hogevarde", name: "Høgevarde", region: "Norefjell", lat: 60.2972, lng: 9.46662, summitM: 1461, verticalM: 600, duration: "3–5 t", grade: 1, aspect: "SV", season: "jan–apr", hasGuide: true, teaser: "600 høydemeter fra Tempelseter opp den oppstakede løypa til DNT-hytta på 1397, og de siste 560 metrene ut på ryggen til sikteplata." },
  { slug: "gygrastolen", name: "Gygrastolen", region: "Hardanger", lat: 60.05949, lng: 6.16031, summitM: 1347, verticalM: 1270, duration: "5–7 t", grade: 3, aspect: "N", season: "feb–apr", hasGuide: true, teaser: "1270 høgdemeter frå fjorden i Ænes opp ryggen over Gygrastølvatnet, rett mot Folgefonna." },
  { slug: "juklavasstinden", name: "Juklavasstinden", region: "Hardanger", lat: 60.00853, lng: 6.13296, summitM: 1361, verticalM: 1340, duration: "6–8 t", grade: 3, aspect: "NV", season: "mars–mai", hasGuide: true, teaser: "1340 høgdemeter frå Myrdalsvatnet: opp ryggen, ned mot Møsetjørna og opp nordryggen til ein skavla topp." },
  { slug: "melderskin", name: "Melderskin", region: "Hardanger", lat: 60.00623, lng: 6.08261, summitM: 1426, verticalM: 1270, duration: "6–8 t", grade: 3, aspect: "V", season: "feb–mai", hasGuide: true, teaser: "Rosendalsalpenes storslåtte klassiker, fra sjøen til 1426 moh." },
  { slug: "gaustatoppen", name: "Gaustatoppen", region: "Telemark", lat: 59.8542, lng: 8.64928, summitM: 1883, verticalM: 970, duration: "4–6 t", grade: 2, aspect: "NV", season: "des–mai", hasGuide: true, teaser: "Sør-Norges mest markante topp — ser du den, ser den deg." },
  { slug: "store-ble", name: "Store Ble", region: "Blefjell", lat: 59.80825, lng: 9.15349, summitM: 1343, verticalM: 670, duration: "4–6 t", grade: 2, aspect: "SØ", season: "jan–apr", hasGuide: true, teaser: "670 høydemeter fra Nordstulvatnet gjennom skogen og opp om Sigridsbu — utløpssonene ligger i Langedalen ved sida av." },
  { slug: "surloytenuten", name: "Surløytenuten", region: "Blefjell", lat: 59.79473, lng: 9.20603, summitM: 1097, verticalM: 460, duration: "3–5 t", grade: 2, aspect: "S", season: "jan–apr", hasGuide: true, teaser: "460 høydemeter fra Nordstul om Sudstul og Vassholet, og sørover det ytre høydedraget langs Surløyterinden til varden." },
  { slug: "styggemann", name: "Styggemann", region: "Skrim", lat: 59.52064, lng: 9.64361, summitM: 871, verticalM: 550, duration: "4–6 t", grade: 2, aspect: "SV", season: "jan–mars", hasGuide: true, teaser: "550 høydemeter og 9,6 km fra Ravalsjø om Sørmyrseter, med de siste 240 rett opp på Skrims høyeste topp." },
  { slug: "saebyggjenuten", name: "Sæbyggjenuten", region: "Setesdal", lat: 59.46181, lng: 7.62568, summitM: 1506, verticalM: 850, duration: "6–8 t", grade: 3, aspect: "V", season: "feb–apr", hasGuide: true, teaser: "850 høgdemeter og 11,3 km inn frå Berdalen over Tverrheiskara og Gjuvvatna; nordsida av toppen fell 42° og er ofte skavla." },
  { slug: "kjerag", name: "Kjerag", region: "Rogaland", lat: 59.01672, lng: 6.58762, summitM: 1124, verticalM: 620, duration: "4–6 t", grade: 2, aspect: "Ø", season: "mai–juni", hasGuide: true, teaser: "620 høgdemeter frå Øygardstøl om Langvassvegen og Kjeragplatået; brattaste 30 meter er 24,4 grader på ein vegsving, men Lysevegen opnar først i mai." },
];

export const REGIONS: string[] = [...new Set(TOURS.map((t) => t.region))];

export function getTour(slug: string): Tour | undefined {
  return TOURS.find((t) => t.slug === slug);
}

/** Turene i én region, eventuelt uten den man allerede står på.
 *
 *  Brukes av «flere turer i …» nederst i hver guide. Regionen er den eneste
 *  slektskapen datasettet faktisk kjenner — «lignende tur» ville vært en
 *  påstand om terreng vi ikke måler. */
export function toursInRegion(region: string, exclude?: string): Tour[] {
  return TOURS.filter((t) => t.region === region && t.slug !== exclude);
}

/** Turene gruppert på region, i den rekkefølgen `TOURS` står i — som er nord
 *  til sør, fra Lyngen til Gaustatoppen. Rekkefølgen er redaksjonell og skal
 *  overleve grupperinga; derfor `REGIONS` og ikke en sortert nøkkelliste. */
export function toursByRegion(): { region: string; tours: Tour[] }[] {
  return REGIONS.map((region) => ({ region, tours: toursInRegion(region) }));
}

/** Ankeret en region får på `/turer`: «Sunnmøre» → `sunnmore`.
 *
 *  Fragmentet havner i adressefeltet og i delte lenker, så det holdes til
 *  ASCII framfor å bli prosentkodet til `#Sunnm%C3%B8re`. */
export function regionAnchor(region: string): string {
  return region
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Every documented way up a tour, the tour's own route first.
 *
 *  A peak can have more than one, and they are not variants of one line:
 *  Galdhøpiggen's two standard starts are 737 vertical metres apart. The first
 *  route is the one the tour's `verticalM` and `duration` describe. */
export function routesFor(t: Tour): readonly TourRoute[] {
  return ROUTES[t.slug] ?? [];
}

/** En rute uten geometrien: alt rutevelgeren i panelet viser. */
export type RouteMeta = Omit<TourRoute, "line">;

/** Rutene til hver tur, uten linjene.
 *
 *  Rutevelgeren på `/kart` viser navn, oppstigning, lengde og utgangspunkt — den
 *  har aldri hatt bruk for punktene. Å hente dem derfra kostet likevel hele
 *  `lib/routes` i nettleseren, fordi `routesFor` og geometrien bor i samme
 *  modul: rundt 240 kB terrengpunkter lastet ned og parset før lista til
 *  venstre kunne trykkes på.
 *
 *  Denne kjører på serveren og sendes inn som en prop, så det klienten får er
 *  det den viser. Linjene lastes fortsatt — de skal tegnes — men i Leaflet-bunten
 *  som uansett hentes for seg, og ikke foran alt annet. */
export function routeMeta(): Record<string, RouteMeta[]> {
  const out: Record<string, RouteMeta[]> = {};
  for (const tour of TOURS) {
    const routes = routesFor(tour);
    if (!routes.length) continue;
    out[tour.slug] = routes.map(({ id, name, trailhead, distanceM, gainM }) => ({
      id,
      name,
      trailhead,
      distanceM,
      gainM,
    }));
  }
  return out;
}

/** One route of a tour, by id. Falls back to the tour's own route when `id` is
 *  missing or unknown, so a stale `?rute=` in a shared link still draws. */
export function routeById(t: Tour, id?: string | null): TourRoute | null {
  const routes = routesFor(t);
  if (!routes.length) return null;
  return (id ? routes.find((r) => r.id === id) : undefined) ?? routes[0];
}

/** The detailed ascent line, trailhead first and summit last.
 *
 *  The geometry lives in `./routes` — a least-cost path solved over Kartverket's
 *  1 m terrain model through the corridor the route uses. Empty when a tour has
 *  no route yet, so callers should check before drawing. */
export function routeFor(t: Tour, id?: string | null): [number, number][] {
  const route = routeById(t, id);
  if (!route) return [];
  const out: [number, number][] = [];
  for (let i = 0; i < route.line.length; i += 3) {
    out.push([route.line[i], route.line[i + 1]]);
  }
  return out;
}

/** The same line with its terrain elevations, for the GPX track and the profile.
 *  `points[i]` and `elevations[i]` describe the same place. */
export function routeProfile(
  t: Tour,
  id?: string | null,
): {
  points: [number, number][];
  elevations: number[];
  distanceM: number;
  gainM: number;
  routeId: string;
  routeName: string;
  trailhead: string;
} | null {
  const route = routeById(t, id);
  if (!route) return null;
  const points: [number, number][] = [];
  const elevations: number[] = [];
  for (let i = 0; i < route.line.length; i += 3) {
    points.push([route.line[i], route.line[i + 1]]);
    elevations.push(route.line[i + 2]);
  }
  return {
    points,
    elevations,
    distanceM: route.distanceM,
    gainM: route.gainM,
    routeId: route.id,
    routeName: route.name,
    trailhead: route.trailhead,
  };
}
