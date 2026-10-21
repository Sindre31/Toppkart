-- ============================================================================
-- Toppkart — seed data
-- ----------------------------------------------------------------------------
-- Run after supabase/schema.sql. Idempotent: re-running refreshes the free
-- columns and leaves editorial content untouched.
--
-- The 24 tours below are the same set as lib/tours.ts, which is the local
-- fallback the app renders in demo mode. Keep the two in step.
--
-- NB, straight from the handoff (design-reference/README.md):
--   * The coordinates are APPROXIMATE and must be replaced with quality-assured
--     data and real GPX geometry before launch.
--   * The teasers are editorial drafts.
--   * EDITORIAL CONTENT IS PENDING. description_up, description_down,
--     avalanche_notes and gpx_path are deliberately left NULL for 23 of the 24
--     tours — a real route description has to be written and quality-assured by
--     an editor, not generated. Only Kirketaket has copy, and even that is the
--     prototype's example text, not a usable trip description.
-- ============================================================================

insert into public.tk_tours
  (slug, name, region, lat, lng, summit_m, vertical_m, duration, grade, aspect, season, teaser, published)
values
  ('gievdnerassa', 'Gievdnerášša', 'Vest-Finnmark', 70.13487, 22.59386, 898, 880, '4–6 t', 2, 'SV', 'des–mai', '880 høydemeter fra Øksfjordbotn: sommervegen østover sør for Nordelva-vatnet, opp lia øst for Skárpavággi og over et platå som Fri Flyt sammenligner med en bre — med utsikt mot Finnmarksalpene.', true),
  ('stortinden-langfjord', 'Stortinden i Langfjorden', 'Vest-Finnmark', 70.09225, 22.30233, 936, 1010, '5–7 t', 3, 'S', 'nov–mai', '1010 høydemeter fra E6 i Langfjordbotn, med motbakkene langs ryggen: bjørkeskog, en brei rygg over 839 og 920-toppen, og toppryggen til Stortinden — Finnmarks snøsikre sesongåpner.', true),
  ('laslettind', 'Laslettind', 'Vest-Finnmark', 70.04458, 22.00059, 822, 660, '3–5 t', 1, 'Ø', 'nov–mai', '660 høydemeter fra Jøkelfjordeidet: rett vestover opp en brei østrygg som får snø tidlig — den tryggeste turen i Koppartind-massivet.', true),
  ('vassnestind', 'Vassnestind', 'Vest-Finnmark', 70.03148, 21.88364, 896, 880, '3–5 t', 2, 'N', 'jan–mai', '880 høydemeter fra fjorden i Jøkelfjord: glissen skog vest for Golpeelva, en brei rygg og et vidt topplatå med hav på alle kanter.', true),
  ('storgalten',      'Storgalten',      'Lyngen',     69.88543, 20.25257, 1219, 1219, '5–7 t', 3, 'NV', 'feb–mai', 'Fjord-til-topp i ytre Lyngen: 1219 høydemeter rett opp fra havnivå.', true),
  ('store-skalltinden', 'Store Skalltinden', 'Troms', 69.87096, 19.29283, 901, 980, '4–6 t', 3, 'SØ', 'jan–mai', '980 høydemeter fra havet i Glimbukta: opp forbi Skallvatnet på 320, den kuperte ryggen vestover — og de siste 800 metrene mot toppen med bratt terreng på begge sider.', true),
  ('store-blamann',   'Store Blåmann',   'Troms',      69.73502, 18.59147, 1044, 1040, '4–6 t', 3, 'S',  'feb–mai', 'Kvaløyas brattest profilerte klassiker — krever stabile forhold og god planlegging.', true),
  ('kjolen', 'Kjølen', 'Troms', 69.73349, 18.78773, 790, 580, '3–5 t', 1, 'NØ', 'nov–mai', '580 høydemeter fra Finnvikvatnet innover dalen til radaren og varmebua — en av Kvaløyas mest besøkte topper.', true),
  ('rodtinden', 'Rødtinden', 'Troms', 69.70147, 18.75254, 470, 450, '2–4 t', 1, 'SØ', 'des–mai', '450 høydemeter fra Storelva skistadion opp den åpne sørøstsida — den mest besøkte toppen rundt Tromsø.', true),
  ('storfjellet', 'Storfjellet', 'Troms', 69.6491, 19.39317, 1088, 1050, '4–6 t', 3, 'SØ', 'jan–mai', '1050 høydemeter rett opp fra Breivikeidet: langs elvedalen mot Russevankskardet, opp på sørryggen på rundt 400 — og ryggen til topps med det bratteste mellom 950 og 1040.', true),
  ('skarlitinden', 'Skarlitinden', 'Troms', 69.63305, 19.33467, 858, 940, '4–6 t', 2, 'N', 'jan–mai', '940 høydemeter fra Sandeggen på Breivikeidet: langs Russevankelva inn i Russevankskaret, sving mot sør-sørøst ved punkt 511 — og et langt toppplatå til varden med rennene under.', true),
  ('fastdalstinden', 'Fastdalstinden', 'Lyngen', 69.62935, 20.16792, 1275, 1270, '6–8 t', 3, 'SØ', 'jan–mai', '1270 høydemeter fra veienden på Varto: anleggsveien til dammen, på land rundt det regulerte Rottenvikvatnet, flata på 650 og ryggen rett mot toppen.', true),
  ('tromsdalstinden', 'Tromsdalstinden', 'Troms',      69.6071, 19.14585, 1238, 1213, '5–7 t', 2, 'V',  'des–mai', 'Tromsøs signaturtopp: lang, jevn oppstigning fra Tromsdalen med storslått utsikt mot Lyngen.', true),
  ('gabrielfjellet', 'Gabrielfjellet', 'Troms', 69.57821, 19.37987, 1214, 1140, '4–6 t', 3, 'N', 'des–mai', '1140 høydemeter fra Stormo ved fv. 91: glissen skog sørover, rullende rygger fra 400 til 850 — og store flak helt til varden på fjellet registeret kaller Iverfjellet.', true),
  ('rornestinden',    'Rørnestinden',    'Lyngen',     69.57329, 20.11187, 1030, 1022, '4–6 t', 2, 'Ø',  'jan–mai', 'Den vennligste inngangen til Lyngsalpene, med slak rygg og romslig nedkjøring.', true),
  ('hamperokken', 'Hamperokken', 'Troms', 69.5621, 19.35872, 1397, 1389, '5–7 t', 4, 'NV', 'feb–mai', '1400 høydemeter fra Fv91, men skiene settes igjen på Middagsaksla 1076 moh – siste 1,4 km er eksponert rygg til fots.', true),
  ('kavringtinden',   'Kavringtinden',   'Lyngen',     69.54704, 20.12428, 1289, 1260, '5–7 t', 3, 'N',  'mar–mai', 'Indre Lyngen-perle med nordvendt snø som holder seg langt ut i mai.', true),
  ('fagerfjellet', 'Fagerfjellet', 'Troms', 69.54528, 19.27811, 957, 950, '4–6 t', 2, 'V', 'nov–mai', '950 høydemeter fra skolen på Fagernes: dyrka mark, skogen mot punkt 459 og søkket østover til varden på 871 der de fleste snur — toppen ligger et småkupert stykke lenger inn.', true),
  ('hesten-segla',    'Hesten (Segla)',  'Senja',      69.51388, 17.58462,  556,  520, '2–4 t', 2, 'S',  'jan–apr', 'Kort tur, stort postkort: nedkjøring med Segla i fanget og havet under.', true),
  ('keipen', 'Keipen', 'Senja', 69.4953, 17.72324, 938, 840, '3–5 t', 3, 'S', 'jan–mai', '840 høydemeter fra Medfjordbotnvatnan gjennom skåla sør for toppen; ruta skrår opp, mens fallinja ved sida av måler 38–52 grader.', true),
  ('husfjellet', 'Husfjellet', 'Senja', 69.4696, 17.27193, 632, 640, '3–5 t', 1, 'SØ', 'feb–mai', '640 høydemeter fra kirka på Skaland: Dronningstien til Grillbua, skogstraséen opp Sommerdalen og ryggen over Sommerdalhaugen — mest utsikt for minst innsats, sier kilden.', true),
  ('breitinden', 'Breitinden', 'Senja', 69.45168, 17.65623, 1007, 1050, '4–6 t', 4, 'SV', 'jan–apr', '1050 høydemeter fra Svarthola via Svartholvatnet og nordbredden av Breitindvatnet; de siste 244 er klyving på sørvestryggen.', true),
  ('skolpan', 'Skolpan', 'Senja', 69.40894, 17.45379, 777, 610, '2–4 t', 1, 'S', 'feb–mai', '607 høydemeter fra fv. 862 i Krokelvdalen: jevnt stigende gjennom småskogen, over flata på 465 moh og nordvestover inn på ryggen til Skolpan.', true),
  ('tredje-svanfjell', 'Tredje Svanfjell', 'Senja', 69.29949, 17.40362, 899, 660, '3–5 t', 2, 'V', 'des–mai', '660 høydemeter rett fra parkeringslomma i Kaperdalen: skaret nord for punkt 504, jevnt opp til fortoppen på 870, og de siste 36 metrene til klassikeren på Senja.', true),
  ('lonketind', 'Lonketinden', 'Senja', 69.09401, 16.9161, 845, 780, '3–5 t', 2, 'S', 'feb–mai', '784 høydemeter fra vannbassenget ved Finnelva: det flate myrterrenget, ryggen mot Lonketuva og toppryggen som gradvis blir brattere til Senjas Lonketinden.', true),
  ('hattfjellet', 'Hattfjellet', 'Harstad', 68.97467, 16.32649, 857, 830, '3–5 t', 3, 'S', 'feb–apr', '830 høydemeter fra Grøtavær: traktorveien opp Bjørndalen, venstre der det flater — og sørsida til topps, med utsikt mot Andøya fra øyas ytterste tur.', true),
  ('stortussen', 'Stortussen', 'Harstad', 68.97434, 16.36664, 945, 1020, '4–6 t', 3, 'S', 'feb–apr', '1020 høydemeter fra Dale: sommerstien til Storvatnet og Trollvatnet, det slakeste terrenget opp — og ryggen nordover til toppen, der ski kan settes igjen før det siste støtet.', true),
  ('litletussen', 'Litletussen', 'Harstad', 68.96367, 16.40377, 795, 760, '3–5 t', 3, 'SØ', 'feb–apr', '760 høydemeter fra Dale: sommerstien mot Storvatnet, rundt vatnet på land — og glissen skog nordøst til sørryggen, den slakeste inngangen til toppen.', true),
  ('slattheia', 'Slåttheia', 'Harstad', 68.95164, 16.3404, 694, 640, '2–4 t', 2, 'SØ', 'feb–apr', '640 høydemeter fra Dale: sommerstien mot Storvatnet, forbi 342-høyden — og den store sørøstvendte lia til topps, utenom det meste av skredterrenget. Grytøyas innsteg.', true),
  ('istinden', 'Vestre Istinden', 'Troms', 68.94986, 18.5668, 1489, 1430, '5–7 t', 3, 'NV', 'feb–mai', '1432 høydemeter fra Tindelva ved Iselvmoen: den bratte bjørkelia, inn i gryta under nordveggen, og opp ryggen vest for breen til det høyeste av Istindan.', true),
  ('skjellesvikgalten', 'Skjellesvikgalten', 'Harstad', 68.92499, 16.54688, 987, 1020, '4–6 t', 4, 'Ø', 'feb–apr', '1020 høydemeter fra Skjellesvika: traktorvegen fra havna og den store slake østryggen vestover — til toppen kilden kaller 800 og registeret måler 987.', true),
  ('nona', 'Nona', 'Harstad', 68.92158, 16.45062, 1009, 1020, '4–6 t', 4, 'V', 'feb–apr', '1020 høydemeter fra Dale: skitursporet innover Dalsdalen, over Dalselva — og den breieste renna til Grytøyas høyeste, 30–45 grader sammenhengende med øks og stegjern i sekken.', true),
  ('trolltinden', 'Trolltinden', 'Harstad', 68.91391, 16.48921, 918, 940, '4–6 t', 3, 'S', 'jan–apr', '940 høydemeter fra ferjeleiet på Bjørnerå: slake Bjørnrådalen mellom bratte vegger, ryggen til skulderen — og toppstøtet til fots, med skavler å passe.', true),
  ('arbostadtinden', 'Årbostadtinden', 'Harstad', 68.90861, 17.3481, 1179, 1170, '4–6 t', 4, 'V', 'feb–apr', '1170 høydemeter på fire kilometer fra fv. 7804: traktorveien sørover fra den gamle skolen, vest for Storelva til flata ved hytta — og skrårenna som er landemerket, 30–40 grader helt til varden.', true),
  ('klaptinden', 'Klåptinden', 'Harstad', 68.9085, 17.27856, 998, 840, '3–5 t', 3, 'V', 'feb–apr', '840 høydemeter fra Himmelberget: opp fra Klåpvatnet på sommerruta — steinete under skogen, avblåst over — og ryggen til topps, med kjøring på 20–30 grader hjem.', true),
  ('toppen', 'Toppen', 'Harstad', 68.90812, 16.40556, 759, 720, '3–5 t', 4, 'Ø', 'feb–apr', '720 høydemeter fra Toppentunnelen: østsida av Hallevikelva, sør for Toppskarvatnet på land — og ryggen sørover til Toppen, fjellet som ga tunnelen navn.', true),
  ('lundenesgalten', 'Lundenesgalten', 'Harstad', 68.90377, 16.53122, 787, 790, '3–5 t', 3, 'S', 'jan–apr', '790 høydemeter fra Lundenes kirke: traktorveien langs Forselva til Storskogbakkan, og så hele den store sørsida — sammenhengende 25–35 grader, fjellet halve Harstad ser på.', true),
  ('middagstinden-andorja', 'Middagstinden på Andørja', 'Harstad', 68.88625, 17.15247, 630, 620, '2–4 t', 2, 'NØ', 'feb–apr', '620 høydemeter fra Slettneset: sommerruta sørover, opp langs Mølnelva utenom de bratte partiene — og ryggen nord for toppen. Kort tur, men kilden er tydelig: det har gått skred på alle nedkjøringene.', true),
  ('skartinden', 'Skartinden', 'Harstad', 68.87745, 17.33598, 1149, 1190, '5–7 t', 4, 'V', 'jan–apr', '1190 høydemeter fra Vang: elvedalen til Ytterholla, skaret mellom Vasskartinden og Skartinden — og flata østover til toppen, med 60-graders klipper å styre unna i nedkjøringa.', true),
  ('langlitinden', 'Langlitinden', 'Harstad', 68.86785, 17.38742, 1276, 1300, '5–7 t', 4, 'V', 'jan–apr', '1300 høydemeter fra snuplassen ved Vang til Nordens høyeste øytopp: sommerruta langs Bjørndalselva, flata med vatnet på land — og traversen på 800–900, partiet med skredhistorikk, før toppflanken.', true),
  ('krakrotinden', 'Kråkrøtinden', 'Harstad', 68.86266, 17.40083, 1186, 1190, '5–7 t', 4, 'N', 'feb–apr', '1190 høydemeter fra Fornes: dalen mot Blåisen, morenen sør for isen — og 40-graderspassasjen til toppen, med øks og stegjern i sekken.', true),
  ('ristinden', 'Ristinden', 'Harstad', 68.84241, 17.25256, 1056, 1050, '4–6 t', 4, 'SV', 'feb–apr', '1050 høydemeter fra skolen på Ånstad: lia og myrene til Breilifatet — og rampa på sørvestsiden til toppen, der Johammarrenna og Risenrenna venter på stabile dager.', true),
  ('snotinden', 'Snøtinden', 'Harstad', 68.83669, 17.30588, 1215, 1220, '5–7 t', 4, 'V', 'feb–apr', '1220 høydemeter fra Ånstad til Andørjas store klassiker: skogen øst for Snøfjellelva, Snøfjellvatnet og vestflanken — fem navngitte nedfarter, og øks og stegjern i sekken.', true),
  ('storhornet-kvafjord', 'Storhornet i Kvæfjord', 'Harstad', 68.8246, 16.21309, 722, 660, '4–6 t', 1, 'S', 'nov–apr', '660 høydemeter fra Kvæfjordeidet etter Harstads alltid best preparerte løype til Koven — og en slak, sørvendt rygg videre til varden. Solturen i rundelen.', true),
  ('vetefjellet', 'Vetefjellet', 'Harstad', 68.80013, 16.34039, 547, 390, '2–4 t', 2, 'S', 'feb–apr', '390 høydemeter over Olaåsen: skogsveien inn til traktorveien, Helgevallan og høyde 361 i lett terreng — et lekent skifjell med kort anmarsj og fin skogskjøring.', true),
  ('storlitinden', 'Storlitinden', 'Harstad', 68.79801, 16.31034, 613, 450, '2–4 t', 1, 'S', 'des–apr', '450 høydemeter fra den brøyta parkeringa ved Kvæfjordløypene: traktorveien forbi Kvilheim, vest for Reingjerdhågen og opp den jevne skråninga som også er sommerruta — lett og sikker hele veien.', true),
  ('stortinden-rolla', 'Stortinden på Rolla', 'Harstad', 68.79234, 17.03681, 1020, 980, '5–7 t', 4, 'V', 'feb–apr', '980 høydemeter fra Indre Forså til Rollas høyeste: myrene, østsida av Mevatnet på land — og renna sør for toppen, jevnt 30–40 grader, med Drangen som ekspertkulisse.', true),
  ('rundtind', 'Rundtinden', 'Harstad', 68.77916, 17.05198, 872, 910, '4–6 t', 3, 'V', 'feb–apr', '910 høydemeter fra Holtet: traktorveien opp til hyttefeltet ved Sandvatnet, rundt magasinet og over myrene til oppstigninga nordøst for Skavbakkan — den enkleste veien opp på en av Drangens topper, med pinakkelen Tottålen på østsida.', true),
  ('sula', 'Sula', 'Harstad', 68.76819, 17.05909, 848, 830, '3–5 t', 2, 'SØ', 'feb–apr', '830 høydemeter fra Breivoll: den jevne traktorveien, opp Skogsheia der skogen tynnes — og nesten rett linje til M-fjellets topp, på heng som måler litt over 20 grader.', true),
  ('heia', 'Heia', 'Harstad', 68.75594, 16.50177, 527, 470, '2–4 t', 1, 'Ø', 'des–apr', '470 høydemeter fra fotballbanen ved Krafthallen opp den gamle alpinbakken: myra, det åpne feltet og Maistua på 321 — og ryggen over tregrensa. Harstads ettermiddagstur, med lys i bakken på hverdagskvelder.', true),
  ('hinnstein', 'Hinnstein', 'Harstad', 68.74726, 16.50311, 560, 510, '2–4 t', 3, 'SØ', 'jan–apr', '510 høydemeter fra Breivikhaugen: skogsveien grunneierne bygde i 2016, forbi gapahuken og opp den gamle hoppbakken mellom Litle Hinnstein og Hinnstein — og stien opp sørvestsida, den slake sida av et fjell som er avskåret mot nordvest.', true),
  ('lasselitinden', 'Lasselitinden', 'Harstad', 68.74548, 16.90057, 896, 860, '3–5 t', 3, 'S', 'feb–apr', '860 høydemeter fra Storelvas utløp på fv. 848: opp lia til Rollryggen — og sørryggen til topps på 20–30 grader, med Djupedalens skavler som naboer du holder avstand til.', true),
  ('hemmestadfjellet', 'Hemmestadfjellet', 'Harstad', 68.71739, 16.10727, 686, 680, '3–5 t', 2, 'N', 'jan–apr', '680 høydemeter fra Vebbestadsætran: traktorveien gjennom granfeltet — og ryggen vest for Vebbestadvatnet til topps, jevn og lett kjøring som er fin for ferske.', true),
  ('middagstinden-kvafjord', 'Middagstinden i Kvæfjord', 'Harstad', 68.71035, 16.15845, 922, 910, '4–6 t', 4, 'V', 'feb–apr', '910 høydemeter fra Hundstadsætran: traktorveien til Vebbestadvatnet, østover forbi den store steinen — og et toppparti på 45–50 grader, ofte hard skare, med øks og stegjern.', true),
  ('nattmalsfjellet', 'Nattmålsfjellet', 'Harstad', 68.70959, 16.4571, 546, 480, '2–4 t', 3, 'N', 'feb–apr', '480 høydemeter fra Kilkam idrettsanlegg: skisporet forbi barnehagen, av sporet sørover på åsryggen — og slukta de siste hundre metrene. Ser enkelt ut, men det har gått skred her.', true),
  ('horntindan', 'Horntindan', 'Harstad', 68.70296, 16.09495, 911, 930, '4–6 t', 4, 'NV', 'feb–apr', '930 høydemeter fra Skommesvik: opp mot Hemmestadfjellet og ryggen sørover til Horntindan — med normalnedkjøringa over Hornflata på 35–40 grader for stabile dager.', true),
  ('tverrfjellet', 'Tverrfjellet', 'Harstad', 68.70181, 16.13535, 889, 880, '4–6 t', 2, 'S', 'feb–apr', '880 høydemeter fra fjorden ved Melåa: traktorveien langs Melåelva, myrene ved kraftlinja, vest for Tverrelvfoten — og det åpne området rett opp mot toppen, med sørvendt kjøring på 15–25 grader hjem.', true),
  ('spanstinden', 'Spanstinden', 'Narvik', 68.69987, 17.86829, 1457, 1050, '4–6 t', 2, 'SØ', 'feb–jun', '1050 høydemeter fra Bukkemyrvatnet på Gratangsfjellet: terrassene mot Sølvfjellet, fonna sørøst for toppen — og de spektakulære siste meterne til varden.', true),
  ('sorvikfjellet', 'Sørvikfjellet', 'Harstad', 68.69461, 16.47892, 607, 560, '2–4 t', 4, 'Ø', 'jan–apr', '560 høydemeter fra Kilbotnveien: avkjøringa på Nordvikmyra og rett inn mot toppvarden, i det enkleste terrenget litt sør for toppen — utenom henget nordøst der det går skred hvert år.', true),
  ('melaaksla', 'Melåaksla', 'Harstad', 68.63266, 16.13919, 916, 960, '4–6 t', 2, 'N', 'feb–apr', '960 høydemeter fra Melå: traktorveien til Dalbotnen, forbi hytta ved 505-høyden — og den lange ryggen sørover til toppen, med 15–25 graders kjøring hjem mot Austerfjorden.', true),
  ('rundfjellet-harstad', 'Rundfjellet i Harstad', 'Harstad', 68.63249, 16.27351, 868, 770, '4–6 t', 2, 'NØ', 'feb–apr', '770 høydemeter og nesten sju kilometer fra DNT-hytta på Bjørnhaugen: vestsida av Storvatnet, bekkedalen nord for høyde 339 med skredterreng på begge sider — og nordøstryggen til topps i cruiseterreng.', true),
  ('jakobstinden', 'Jakobstinden', 'Harstad', 68.61628, 16.18072, 976, 1020, '5–7 t', 3, 'SØ', 'jan–apr', '1020 høydemeter fra samme Y-kryss som Kongsviktinden: fire kilometer innover Kongsvikdalen, myrene ved Sætran, den brede rampa — hold sør for skavlen — og det brede platået til toppen med pinakkelen.', true),
  ('stortinden-sortland', 'Stortinden i Sortland', 'Vesterålen', 68.60306, 15.62987, 1020, 1010, '4–6 t', 4, 'V', 'jan–apr', '1010 høydemeter fra Vangpollen kraftstasjon: den bratte dalen som blir brattere og brattere, til høyre under bandet på 600 moh og opp ryggen — en av Hinnøyas tusenmetringer, med bratt kjøring helt ned til havet.', true),
  ('haukebotinden', 'Haukebøtinden', 'Harstad', 68.59662, 16.39746, 905, 860, '4–6 t', 2, 'Ø', 'des–apr', '860 høydemeter fra Gausvik kirke: over demningen, opp østsida av Heimetverrelva — og det minst krevende terrenget rett mot toppen. Rundens korteste dag, med sesong fra desember.', true),
  ('reinspalen', 'Reinspælen', 'Harstad', 68.59341, 15.69923, 1117, 1370, '6–8 t', 4, 'S', 'jan–apr', '1370 høydemeter fra Våtvoll til Kvæfjords høyeste — Kobberyggen og Geitryggen med mye opp og ned, og en eksponert ryggtravers med vegg på begge sider til slutt.', true),
  ('satertinden', 'Sætertinden', 'Harstad', 68.58656, 16.36195, 1095, 1110, '5–7 t', 2, 'Ø', 'feb–apr', '1110 høydemeter fra Sandtorg idrettsanlegg på Årbogen: traktorveien langs Årbogelva, sør for Årbogvatnet — og den staka østryggen forbi nødbua, med telefonstolpene som los mot toppen.', true),
  ('kongsviktinden', 'Kongsviktinden', 'Harstad', 68.58291, 16.26536, 980, 1050, '6–8 t', 3, 'N', 'jan–apr', '1050 høydemeter fra Y-krysset før bommen: den vinterstengte veien innover Kongsvikdalen, sommerstien ved Sætran og sørkonturen over platået — det slakeste terrenget mot den sørøstlige toppen, med øks og stegjern i sekken.', true),
  ('snotinden-tjeldsund', 'Snøtinden i Tjeldsund', 'Harstad', 68.56784, 16.02992, 980, 980, '4–6 t', 2, 'NØ', 'feb–apr', '980 høydemeter fra Dalelvas utløp i Fiskefjorden: traktorveien opp Norddalen, det langstrakte Marsslottfjellet — og ryggen sørvestover til toppen, med bare tre heng på rundt 25 grader i hele nedkjøringen.', true),
  ('taraldsviktinden', 'Taraldsviktinden', 'Harstad', 68.55162, 16.16806, 776, 780, '3–5 t', 3, 'N', 'feb–apr', '780 høydemeter fra fjæra innerst i Fiskefjorden: traktorveien øst for Gårdselva, mot Mølnskaret — og nordryggen til topps, med isøks og stegjern for ryggpartiet på 30 grader.', true),
  ('nonstinden', 'Nonstinden', 'Harstad', 68.54904, 15.68189, 930, 980, '4–6 t', 4, 'Ø', 'jan–apr', '980 høydemeter fra rundkjøringa i Gullesfjordbotn: ryggen nordover vest for botn, den bratte renna til platået — og traversen til en topp uten én slak side: fire bratte nedkjøringer, og øks og stegjern i sekken.', true),
  ('snotindan', 'Snøtindan', 'Harstad', 68.54343, 15.61609, 996, 1550, '7–9 t', 4, 'Ø', 'jan–apr', '1550 høydemeter fra Løbergsbukta for en 996-topp: midt i Løbergsdalen mellom utløpssonene, over Løbergskaret, mellom vatna — og topphenget på 30–40 grader til slutt.', true),
  ('fiskefjordtindan', 'Fiskefjordtindan', 'Harstad', 68.53218, 16.01129, 965, 1040, '5–7 t', 3, 'SV', 'jan–apr', '1040 høydemeter fra Kanstadbotn: sommerstien, ryggen mellom Kobbedalsvatna — og den eksponerte østryggen til slutt, med øks og stegjern i sekken og en østside som måler 67 grader der den er brattest.', true),
  ('moysalen', 'Møysalen', 'Vesterålen', 68.52598, 15.45215, 1264, 1600, '7–9 t', 4, 'S', 'jan–mai', '1600 høydemeter fra E10 ved Litlvatnet: 355 av dem gir du fra deg underveis, 120 av dem ned til Grønnvatnet på 328.', true),
  ('forselvtinden', 'Forselvtinden', 'Vesterålen', 68.50934, 15.50105, 907, 1190, '6–8 t', 4, 'S', 'feb–apr', '1190 høydemeter og 8,4 kilometer fra Lofast, over toppen av en annen tur i katalogen: opp Lakselvtindan først, vestover til rett nord av høyde 790 — og sydryggen til slutt, med 296 høydemeter gitt fra deg underveis.', true),
  ('middagsfjellet', 'Middagsfjellet', 'Harstad', 68.50879, 15.78279, 810, 760, '3–5 t', 3, 'N', 'des–apr', '760 høydemeter fra rundkjøringa i Gullesfjordbotn — rundens korteste tur, og den slakeste traseen er hele poenget: lia vest for Tverrelva og Blåberget, med brattere skredterreng på alle kanter.', true),
  ('strandtinden', 'Strandtinden', 'Harstad', 68.50455, 16.03441, 1076, 1140, '5–7 t', 3, 'N', 'jan–jun', '1140 høydemeter fra E10 ved havet gjennom Heggedalen og opp vestryggen — Harstad-områdets store klassiker, og fjellet flest går der.', true),
  ('jotind', 'Jotind', 'Harstad', 68.50087, 16.32663, 979, 1050, '5–7 t', 4, 'Ø', 'feb–apr', '1050 høydemeter fra Mølnneset: ryggen over Spannbogen, henget før 600 der skiene gjerne bæres — og den smale toppryggen, med sommerruta på sørsida som utveien.', true),
  ('forkledalstindan', 'Forkledalstindan', 'Vesterålen', 68.49422, 15.49073, 901, 980, '4–6 t', 4, 'S', 'feb–apr', '980 høydemeter fra E10 ved Litlvatnet: nordsida av høyde 462 og fjellsida opp til toppen på 700, der kildens skitur snur — og traversen videre over fortoppen, med østsida som utveien fra den vanskelige klatringa.', true),
  ('lakselvtindan', 'Lakselvtindan', 'Vesterålen', 68.4926, 15.53235, 747, 820, '4–6 t', 3, 'SV', 'feb–apr', '820 høydemeter fra Møysalens parkering på E10: nordsida av Storvatnet, opp mellom Tverrelva og Lakselva, forbi høyde 258 — og ryggen øst for Lakselva til topps, det mildeste toppartiet i runden.', true),
  ('siriskolten', 'Siriskolten', 'Harstad', 68.47962, 16.42142, 659, 670, '3–5 t', 1, 'N', 'feb–apr', '670 høydemeter fra grustaket ved fv. 7548: sommerruta gjennom slakt terreng, bekken sør for 414-høyden — og vestover til toppen. Tjeldøyas innsteg, ideell for ferske, sier kilden.', true),
  ('trollfjellet', 'Trollfjellet', 'Harstad', 68.47689, 16.27383, 1009, 1030, '5–7 t', 2, 'V', 'feb–apr', '1030 høydemeter fra Valvågen til Tjeldøyas eneste topp over 1000: vestbredden av Forsdalselva mellom furuene, øst for Kjerstadtinden — og ryggen til topps, med sol og slak fin kjøring hele veien hjem.', true),
  ('sebortinden', 'Sebortinden', 'Vesterålen', 68.47522, 15.42604, 831, 890, '4–6 t', 4, 'N', 'feb–apr', '890 høydemeter fra Møysalens parkering på E10: opp Forkledalen, sørsida av bekken — og traversen på østryggens flanke mot framtoppen, med øks og stegjern til sluttstøtet.', true),
  ('helligtinden', 'Helligtinden', 'Harstad', 68.46412, 16.33452, 948, 950, '4–6 t', 3, 'N', 'feb–apr', '950 høydemeter fra Breivikbotn: hyttefeltet ved Krokelva, Finnvatnet — og nordøstryggen av Litletinden til Helligtinden, med jevn kjøring på 10–20 grader hjem.', true),
  ('kvasstinden', 'Kvasstinden', 'Vesterålen', 68.43483, 15.55651, 832, 930, '4–6 t', 2, 'V', 'feb–apr', '930 høydemeter fra E10 ved Austerstraumen: myrene sørover, ned i Trolldalen nord for høyde 146 — og vestryggen til den luftige toppen, der 20–25 grader er regelen og øksa er for de siste metrene.', true),
  ('rombakstotta',    'Rombakstøtta',    'Narvik',     68.43312, 17.58324, 1231, 1129, '5–7 t', 3, 'SV', 'feb–mai', 'Narviks spisse landemerke — variert oppstigning og fin, vedvarende nedkjøring.', true),
  ('beisfjordtotta', 'Beisfjordtøtta', 'Narvik', 68.40588, 17.57409, 1448, 1430, '6–8 t', 3, 'N', 'feb–jun', '1430 høydemeter fra bommen over Djupvik: vannverksveien forbi Pumpvatnet, østsida av Forsnesvatnet på land — og skaret før ryggen sørover til fjellet med de mange hemmelighetene.', true),
  ('pilan', 'Pilan', 'Lofoten', 68.3688, 14.66384, 826, 850, '3–5 t', 3, 'SØ', 'feb–apr', '850 høydemeter fra Laupstad på nordsida av Austvågøya: dalen til vannet på 289, mot Morfjordskaret og den brede flanken — med et målt steg på 39 grader i toppkjegla.', true),
  ('litletind', 'Litletind', 'Narvik', 68.35964, 17.33611, 1100, 920, '4–6 t', 2, 'NØ', 'feb–mai', '920 høydemeter fra Nervatnet til fortoppen med byutsikten: myra sør for vannet, den glisne skogen og ryggen — Narvik og Rombaksfjorden under deg fra varden.', true),
  ('geitgaljen', 'Geitgaljen', 'Lofoten', 68.34434, 14.81302, 1085, 1070, '4–6 t', 4, 'NV', 'feb–apr', '1071 høydemeter fra Liland opp Lilandsdalen; renna fra 250 til 360 moh er 35 grader, og toppen krever stegjern.', true),
  ('skjomtinden', 'Skjomtinden', 'Narvik', 68.34341, 17.35491, 1576, 1390, '6–8 t', 4, 'N', 'feb–mai', '1390 høydemeter fra Nervatnet i Håkvikdalen til Den sovende dronning: forsenkningen rundt Litletind, ryggen mot Dronninga, traversen på vestsidene — og snørenna opp på eggen. Isøks og stegjern i sekken.', true),
  ('torskmannen', 'Torskmannen', 'Lofoten', 68.3368, 14.60386, 755, 760, '3–5 t', 3, 'SØ', 'jan–apr', '760 høydemeter fra Kvitfossen kraftstasjon i Vestpollen: dalen der snøen ligger skjermet, vannet i forsenkinga og skaret til høyre for toppen — og ryggen den siste biten.', true),
  ('rundfjellet', 'Rundfjellet', 'Lofoten', 68.2894, 14.56524, 803, 840, '4–6 t', 2, 'S', 'jan–apr', '840 høydemeter fra havet ved Vatterfjordpollen: langs nordsida av pollen, opp på sørryggen og ryggtoppen hele veien — Svolværs nærmeste klassiker, med varianter til alle kanter.', true),
  ('kleppstadheia', 'Kleppstadheia', 'Lofoten', 68.26826, 14.31161, 534, 520, '2–4 t', 1, 'SV', 'jan–apr', '520 høydemeter fra Kleppstadveien sør for Gimsøybrua: ryggen mot punkt 156 og den slake, breie flata til topps — turen kilden selv bruker som øving i sporvalg.', true),
  ('varden-smaatindan', 'Varden (Småtindan)', 'Lofoten', 68.23317, 14.38794, 700, 760, '4–6 t', 2, 'Ø', 'jan–apr', '760 høydemeter fra Eidet ved Kabelvåg: lysløypa langs Karlsvatnet, over eidet mot Ørntindaksla og gjennom skaret vest for den, og østflanken til toppen av øygruppas mest gåtte skitur.', true),
  ('himmeltindan',    'Himmeltindan',    'Lofoten',    68.22101, 13.57307,  956,  980, '4–6 t', 3, 'SV', 'feb–apr', 'Vestvågøys høyeste, med alpint preg og linjer rett mot Nordishavet.', true),
  ('gangnesaksla', 'Gangnesaksla', 'Narvik', 68.20105, 17.26504, 1318, 1310, '5–7 t', 3, 'S', 'feb–mai', '1310 høydemeter fra kraftstasjonen i Sørskjomen: anleggsveien langs Vesterskarelva, dammen ved tregrensa og hylla på 800 — med Frostisen i utsikten og Gangnesrenna under kanten.', true),
  ('justadtinden', 'Justadtinden', 'Lofoten', 68.18216, 13.80369, 736, 730, '3–5 t', 2, 'S', 'jan–apr', '730 høydemeter fra gården Justad ved fv. 815: lia, ryggen over Skjærheia og det leikne toppartiet — Vestvågøys høyeste østside, med Vågakallen og Henningsvær under deg.', true),
  ('stornappstinden', 'Stornappstinden', 'Lofoten',    68.1441, 13.41493,  740,  680, '3–5 t', 2, 'SV', 'jan–apr', 'Lofot-klassiker i overkommelig format — mye fjell for høydemeterne.', true),
  ('heggmotinden', 'Heggmotinden', 'Bodø', 67.37541, 14.87934, 797, 770, '3–5 t', 2, 'SV', 'des–apr', '770 høydemeter fra bommen ved Heggmoen: skogsvegen, ryggen vest for søkket og langs halfpipen på sørsida, og vestryggen til toppen — den nærmeste skitoppen fra Bodø by.', true),
  ('kvalhornet', 'Kvalhornet', 'Bodø', 67.37358, 15.15777, 965, 900, '4–6 t', 2, 'SØ', 'des–mai', '900 høydemeter fra Bringsliveien: langs Grytåga, opp ryggen til Søndre Nattmålstuva og nordvestover inn på toppryggen — en av Bodø-klassikerne i Fri Flyts bok.', true),
  ('kistrandtindan', 'Kistrandtindan', 'Bodø', 67.34935, 15.06775, 982, 980, '4–6 t', 2, 'S', 'feb–mai', '970 høydemeter fra havet på Kistrand: gjennom skogen og ryggen sør for Mølnelva til flata ved 480, og jevnt nordover til 979-toppen i Kistrandtindan.', true),
  ('midtitinden', 'Midtitinden', 'Bodø', 67.34238, 15.00416, 1060, 1050, '4–6 t', 2, 'SØ', 'jan–apr', '1050 høydemeter fra havnivå ved Sagelva: gjennom hyttefeltet, rampene mot Innertinden, militærløypemerkinga vestover og ryggene til topps.', true),
  ('sandhornet', 'Sandhornet', 'Bodø', 67.11124, 14.06789, 993, 1030, '4–6 t', 2, 'S', 'jan–apr', '1030 høydemeter fra fjæra på Horsdal: stien langs sjøen, trappene til Stjerndalen, og slake rygger til varden på øyfjellet over Saltfjorden.', true),
  ('tortenviktinden', 'Tortenviktinden', 'Helgeland', 66.3421, 13.23387, 1028, 1020, '4–6 t', 2, 'SØ', 'feb–mai', '1023 høydemeter fra Neset ved Flostrand: rett opp gjennom skogen, vestover på rabbene over det ulendte flatpartiet og opp den slake helninga til utsikta over Helgelandskysten.', true),
  ('tomskjevelen', 'Tomskjevelen', 'Helgeland', 66.27901, 12.84655, 922, 950, '4–6 t', 2, 'S', 'jan–apr', '950 høydemeter fra åkeren ved Forsland på Tomma: stien til Forslandsvatnet, rundt tjernet på land, og den nordvestgående ryggen helt til topps på øyfjellet Fri Flyt kaller en av de fineste toppene på Helgelandskysten.', true),
  ('lukttinden', 'Lukttinden', 'Helgeland', 65.99015, 13.54443, 1348, 1130, '4–6 t', 2, 'NV', 'apr–jun', '1129 høydemeter fra gården på Kammen: traktorveien, skogen mot bekken mellom Nordtinden og Lukttinden, og den slake ryggen opp til Vefsns mest markerte topp.', true),
  ('vassfjellet', 'Vassfjellet', 'Trøndelag', 63.26205, 10.35659, 711, 560, '3–5 t', 1, 'V', 'des–apr', '560 høydemeter fra Markavollen forbi Vassfjellhytta — den nærmeste toppturen til Trondheim, i løype hele vegen.', true),
  ('krakfjellet', 'Kråkfjellet', 'Trøndelag', 63.16336, 10.63219, 815, 470, '4–6 t', 2, 'S', 'des–apr', 'Kommunetoppen i Trondheim: 470 høydemeter og ti kilometer fra Håen over Kråklivollen og Rundtjønnin.', true),
  ('rensfjellet', 'Rensfjellet', 'Trøndelag', 63.14219, 10.72186, 942, 700, '5–7 t', 2, 'V', 'des–apr', '700 høydemeter og elleve kilometer fra Håen over Rundtjønnin og Oksdalen til Melhus'' høyeste punkt.', true),
  ('snota', 'Snota', 'Trollheimen', 62.84778, 9.09428, 1668, 1270, '6–8 t', 3, 'Ø', 'feb–mai', '1270 høydemeter fra Gråhaugen over Svartvatnet og rundt Litj-Snota til det høyeste fjellet nord i Trollheimen.', true),
  ('storbekkhoa', 'Storbekkhøa', 'Trollheimen', 62.73022, 9.08038, 1504, 890, '4–6 t', 2, 'S', 'des–mai', '890 høydemeter fra Storli opp Storbekkdalen og gjennom skaret vest for den bratte sørøstveggen.', true),
  ('okla', 'Okla', 'Trollheimen', 62.68955, 9.26225, 1582, 1020, '4–6 t', 2, 'S', 'des–apr', '1020 høydemeter fra Dalen i Storlidalen opp til Snydda — varden på toppen av Okla-massivet.', true),
  ('storhornet', 'Storhornet', 'Trollheimen', 62.64779, 9.39918, 1589, 940, '4–6 t', 2, 'SØ', 'des–mai', '940 høydemeter på merket vinterløype fra Bree gjennom Hornlia til steinbua på Oppdals mest besøkte topp.', true),
  ('kirketaket',      'Kirketaket',      'Romsdal',    62.61158,  7.90672, 1439, 1270, '5–6 t', 2, 'SV', 'des–mai', 'Norges kanskje mest populære topptur: bred rygg, trygge linjevalg, lang sesong.', true),
  ('skarven', 'Skarven', 'Romsdal', 62.60775, 7.60201, 1048, 740, '3–5 t', 2, 'SØ', 'des–apr', '740 høydemeter fra bomvegen i Skorgedalen til en av Romsdalens store klassikere: myra ved Kjerringhaugen og Skorgedalsbu, sør for topp 588, og ryggen over den sørlige fortoppen til fjordutsikten på varden.', true),
  ('mjolvafjellet', 'Mjølvafjellet', 'Romsdal', 62.54172, 7.76405, 1215, 1220, '5–7 t', 2, 'N', 'jan–apr', '1220 høydemeter fra fjorden: traktorvegen fra Isfjorden stadion, skogen under Litlehesten, over Steinselva og den slake ryggen om Høgnosa — så sørover til toppen som henger over Romsdalen.', true),
  ('blanebba', 'Blånebba', 'Romsdal', 62.52627, 7.79275, 1317, 940, '4–6 t', 3, 'NØ', 'mar–mai', '940 høydemeter fra Venjesdalssetra til kanten som ser rett ned i Romsdalen: Romsdalseggen-merkinga langs Tverrelva, flata under Storhesten, nordøstflanken til skaret på 1245 — og hovedryggen østover til varden.', true),
  ('ospetinden', 'Øspetinden', 'Romsdal', 62.51586, 7.25081, 1228, 1060, '5–7 t', 3, 'Ø', 'des–mai', '1060 høydemeter fra bomkassa på Venås: setervegen til Venåssetra, myra over Stavvasselva, den store østvendte botnen — og nordøstryggen til pyramiden innerst i Måndalen.', true),
  ('middagstinden', 'Middagstinden', 'Romsdal', 62.46024, 7.44099, 1568, 1310, '5–7 t', 4, 'V', 'jan–apr', '1310 høydemeter fra Herdslan i Innfjorden: vegen langs Berillvatnet, bekkedalen til skaret ved Tindevatnet — og en ofte avblåst egg med ski på sekken før den vestvendte toppflanken.', true),
  ('auskjeret', 'Auskjeret', 'Sunnmøre', 62.37746, 6.77458, 1203, 870, '3–5 t', 2, 'SØ', 'des–apr', '870 høydemeter fra Fausaskiftet i jevn stigning nordover — helårsåpen vei og moderate hellinger.', true),
  ('snohetta',        'Snøhetta',        'Dovrefjell', 62.31992,  9.26747, 2286,  820, '5–7 t', 2, 'Ø',  'apr–jun', 'Storslått og luftig, men overraskende snill — når Snøheimvegen åpner.', true),
  ('jonshornet', 'Jønshornet', 'Sunnmøre', 62.31695, 6.33395, 1417, 1430, '6–8 t', 4, 'N', 'feb–mai', '1430 høydemeter fra Vollane over Rametinden, og de siste hundre på smal egg til varden på Ramoen.', true),
  ('ytstevasshornet', 'Ytstevasshornet', 'Sunnmøre', 62.28014, 6.73548, 1331, 820, '3–5 t', 3, 'Ø', 'jan–mai', '820 høydemeter fra Svartevatnet: bratt opp Vassdalen til vatnene på 950 moh, så nordvest mot en smal og skavlete topprygg.', true),
  ('rana', 'Råna', 'Sunnmøre', 62.27554, 6.57479, 1587, 1560, '7–9 t', 3, 'SØ', 'mar–mai', '1560 høydemeter fra Urkegjerdet ved fjorden: inn dalen til Nordkopen, bratt opp på egga og nordover den brede toppryggen.', true),
  ('kolastinden',     'Kolåstinden',     'Sunnmøre',   62.25886,  6.31102, 1432, 1100, '5–7 t', 3, 'N',  'feb–mai', 'Alpin klassiker fra Standaldalen med velkjent renne og storslått finish.', true),
  ('vassdalstinden', 'Vassdalstinden', 'Sunnmøre', 62.24405, 6.18966, 1278, 1230, '5–7 t', 3, 'Ø', 'feb–mai', '1230 høydemeter fra Nupen: setervei til Vallasætra, kneiken opp i Bukkedalen og en lang flanke til topps.', true),
  ('saudehornet', 'Saudehornet', 'Sunnmøre', 62.23578, 6.14246, 1303, 1160, '4–6 t', 3, 'SV', 'jan–mai', '1157 høydemeter fra vannverket i Ørsta, og ryggkammen holder rundt 32° i snitt de siste 170, med det bratteste på 37.', true),
  ('slogen',          'Slogen',          'Sunnmøre',   62.20818,  6.67306, 1564, 1536, '6–8 t', 4, 'Ø',  'mar–mai', 'Sunnmørsalpenes dronning — en alvorlig tur for erfarne, i riktig vindu.', true),
  ('torvloysa', 'Torvløysa', 'Sunnmøre', 62.1834, 7.28026, 1851, 1470, '7–9 t', 2, 'N', 'mar–mai', '1470 høydemeter og ti kilometer fra Hatlestad over Rellingsætra og Daurmålsfjellet, mest slak rygg.', true),
  ('skarene', 'Skårene', 'Sunnmøre', 62.17982, 7.19977, 1830, 1240, '5–7 t', 3, 'S', 'mar–mai', '1240 høydemeter fra Korsmyra opp Gråsteindalen og den store snøflanken til en av de høyeste toppene over Eidsdal.', true),
  ('melshornet', 'Melshornet', 'Sunnmøre', 62.17381, 6.14287, 809, 560, '2–4 t', 1, 'SØ', 'des–apr', '560 høydemeter på preparert løype fra Helgatun — husfjellet som blir gått i mørket hele vinteren.', true),
  ('jakta', 'Jakta', 'Sunnmøre', 62.1711, 6.61671, 1589, 1560, '6–8 t', 3, 'SØ', 'feb–mai', '1560 høydemeter fra Norang: slak stigning inn Konedalen, så en 33-graders side opp på den smale toppryggen.', true),
  ('skarasalen', 'Skårasalen', 'Sunnmøre', 62.16566, 6.48583, 1542, 1452, '6–8 t', 3, 'V', 'jan–mai', '1438 høydemeter fra bommen på Kvistadvegen, med det bratteste opp mot skaret på 1074 moh.', true),
  ('kvitegga', 'Kvitegga', 'Sunnmøre', 62.0948, 6.7022, 1700, 1390, '5–7 t', 3, 'Ø', 'mar–mai', '1390 høydemeter fra Nibbedalen gjennom Snødalen og over Brattbakken til det høyeste fjellet i midtre Sunnmørsalpane.', true),
  ('hornindalsrokken', 'Hornindalsrokken', 'Sunnmøre', 62.07148, 6.65766, 1527, 1470, '6–8 t', 4, 'Ø', 'mar–mai', '1470 høydemeter fra Langøylia over Aksla, Trollaksla og Sætrenibba; de siste 103 går på utsatt rygg.', true),
  ('sunndalsnipa', 'Sunndalsnipa', 'Sunnmøre', 62.01816, 6.32162, 1395, 990, '4–6 t', 2, 'S', 'des–apr', '990 høydemeter fra Grøndalsvatnet opp sørøstryggen, og en kilometer flatt platå fram til varden.', true),
  ('eidskyrkja', 'Eidskyrkja', 'Sunnmøre', 62.01709, 6.2624, 1482, 1120, '4–6 t', 3, 'N', 'mar–mai', '1120 høydemeter fra Skinnviksætra opp Blåbreen: 25 grader nederst på breen og et vidt toppplatå øverst.', true),
  ('rondslottet',     'Rondslottet',     'Rondane',    61.9149,  9.8512, 2178, 1300, '6–8 t', 2, 'S',  'mar–mai', 'Rondanes høyeste: rolig høyfjellsterreng og stabil vårsesong.', true),
  ('glitregga', 'Glitregga', 'Nordfjord', 61.90741, 6.37278, 1297, 900, '4–6 t', 2, 'S', 'des–apr', '900 høydemeter fra idrettsanlegget i Randabygd, sørvendt og slak hele veien opp.', true),
  ('storronden', 'Storronden', 'Rondane', 61.8917, 9.86198, 2139, 1110, '6–8 t', 2, 'SV', 'mar–mai', '1110 høydemeter fra Spranget: seks kilometer innmarsj til Rondvassbu, så 2,6 km jevn vestrygg fra stidelet på 1440 moh.', true),
  ('skala',           'Skåla',           'Nordfjord',  61.86923,  6.97251, 1848, 1820, '6–8 t', 3, 'SV', 'mar–jun', '1848 sammenhengende høydemeter fra fjorden i Loen — en av landets lengste nedkjøringer.', true),
  ('skarsteinfjellet', 'Skarsteinsfjellet', 'Nordfjord', 61.83055, 6.73533, 1567, 1220, '5–7 t', 2, 'V', 'jan–apr', '1220 høydemeter opp en jevn rygg over Innvikdalen — hele ruta i terreng under 30 grader.', true),
  ('lodalskapa', 'Lodalskåpa', 'Nordfjord', 61.79051, 7.20475, 2082, 1520, '7–9 t', 4, 'V', 'mai–jun', '1520 høydemeter fra Bødalssætra over Kåpevatnet og Bohrsbreen til det eneste 2000-metersfjellet i Nordfjord.', true),
  ('snonipa', 'Snønipa', 'Sunnfjord', 61.67808, 6.69055, 1827, 1500, '7–9 t', 3, 'SØ', 'feb–mai', '1500 høydemeter opp Haugadalen og midt i brefallet på Haugabreen til det høyeste fjellet i Sunnfjord.', true),
  ('glittertinden', 'Glittertinden', 'Jotunheimen', 61.65138, 8.5575, 2451, 1233, '7–9 t', 3, 'SØ', 'jun–jul', '13,4 km og 1233 høydemeter fra Veodalen: 7 km flat innmarsj til Glitterheim, så jevn stigning øst for Glitterbrean.', true),
  ('galdhopiggen',    'Galdhøpiggen',    'Jotunheimen',61.63644,  8.31243, 2469, 642, '6–8 t', 3, 'N',  'apr–jun', 'Norges tak på ski — bre, tau og stor høyde; vanligvis gått fra Juvasshytta.', true),
  ('nautgardstinden', 'Nautgardstinden', 'Jotunheimen', 61.60324, 8.75936, 2257, 1390, '7–9 t', 2, 'Ø', 'feb–mai', '1390 høydemeter fra Russlie i Sjodalen: vestover mot Steinhøe, nord for Russlirundhøe og opp østryggen til toppen på 2257 moh — slakt det meste av veien, bratt det siste stykket.', true),
  ('gronlifjellet', 'Grønlifjellet', 'Sunnfjord', 61.59718, 6.22043, 1386, 1160, '6–8 t', 3, 'SØ', 'jan–apr', '1160 høydemeter fra Ålhus: fire kilometer skogsveg til Gotdalsstøylen, opp i Tolsbotnen og Litlebotn, og den smale sørøstryggen til toppen — med skavler mot øst.', true),
  ('gotdalsnipa', 'Gotdalsnipa', 'Sunnfjord', 61.58912, 6.27909, 1248, 1000, '4–6 t', 2, 'S', 'des–apr', '1000 høydemeter fra toppturparkeringa på Ålhus: skoglia forbi Fjellstøylen, opp østsida av Fossgrova og over Nonsnipa til toppen, med Jølstravatnet under deg.', true),
  ('steindalsnosi',   'Steindalsnosi',   'Sogn',       61.52696,  7.90076, 2025,  760, '3–5 t', 1, 'V',  'apr–jun', '2000-meter for de fleste: kort, slak og solvendt fra Sognefjellsveien.', true),
  ('besshoe', 'Besshø', 'Jotunheimen', 61.51791, 8.68712, 2257, 1329, '6–8 t', 3, 'Ø', 'mar–mai', '1329 høydemeter fra Bessheim: tre og en halv kilometer langs Bessvatnet før Grotådalen, og til slutt den slake østryggen over Brue.', true),
  ('fanaraken',       'Fanaråken',       'Sogn',       61.51669,  7.90825, 2068,  780, '5–7 t', 2, 'N',  'apr–jun', 'Høyfjellstur fra Sognefjellet med breutsikt og pålitelig vårsnø.', true),
  ('heimdalshoe', 'Heimdalshøe', 'Jotunheimen', 61.45438, 8.90219, 1843, 880, '4–6 t', 1, 'NV', 'des–apr', '880 høydemeter fra Maurvangen: opp gjennom bjørkeskogen, langs Brurskardbekken og opp Molflyhalsen-ryggen til toppen — slakt og oversiktlig, med utsikt over Jotunheimen.', true),
  ('eggja', 'Eggja', 'Sunnfjord', 61.42301, 6.22375, 1204, 680, '3–5 t', 2, 'S', 'des–apr', '680 høydemeter fra toppen av Rørvikfjellet: forbi Fjelltjønna og opp ryggen til østtoppen på Rimmane, den Fri Flyt kaller Ørnafjellet — snøsikker fra tidlig i sesongen.', true),
  ('kvamshesten', 'Kvamshesten', 'Sunnfjord', 61.40141, 5.62732, 1209, 840, '4–6 t', 3, 'N', 'des–mai', '840 høydemeter fra Rytnavegen forbi Skaravatnet og Grunnevatnet, med en 36-graders skål til slutt.', true),
  ('rasletinden', 'Rasletinden', 'Jotunheimen', 61.39514, 8.69944, 2104, 778, '4–6 t', 2, 'Ø', 'apr–mai', '778 høydemeter og 7,2 km fra Valdresflye: flatt de første 2,2 km, så en kneik til 1530 moh og slak rygg østfra mot toppen.', true),
  ('banseterkampen', 'Bånsæterkampen', 'Ringebufjellet', 61.3947, 10.12085, 1202, 300, '1–3 t', 2, 'NØ', 'jan–apr', '300 høydemeter fra Bånsetra opp på en fjellrygg med stup mot sør — Kvitfjells nærmeste fjell, tvers over Lågen.', true),
  ('venevassegga', 'Venevassegga', 'Sunnfjord', 61.37516, 6.18333, 1024, 530, '3–5 t', 1, 'N', 'des–mai', '530 høydemeter fra Rørvik fjellstove: en lang, avrundet rygg nord for Svartenova, opp i Jakobskardet og ryggen sørover til toppen — den enkle turen på Rørvikfjellet.', true),
  ('molden', 'Molden', 'Sogn', 61.34417, 7.31973, 1120, 620, '2–4 t', 1, 'SV', 'feb–apr', '620 høydemeter fra Mollandsmarki opp sørvestryggen, med Lustrafjorden under seg hele veien.', true),
  ('synshorn',        'Synshorn',        'Valdres',    61.34011,  8.79727, 1475,  420, '2–3 t', 1, 'SV', 'feb–mai', 'Kort og trygg tur fra Valdresflye — perfekt førstetur og værvindu-tur.', true),
  ('togga', 'Togga', 'Sogn', 61.33505, 6.89289, 1204, 780, '3–5 t', 3, 'SØ', 'des–mar', '780 høydemeter rett fra toppturparkeringa på Brandhaugane: sørøstryggen gjennom skogen, flata ved Orraleiken, og siste stigninga til varden.', true),
  ('bitihorn',        'Bitihorn',        'Valdres',    61.29435,  8.79947, 1607,  550, '2–4 t', 1, 'NV', 'feb–mai', 'Markert horn med enkel normalrute og fin utsikt over Bygdin.', true),
  ('tylderingen', 'Tylderingen', 'Sogn', 61.29215, 7.03255, 1104, 610, '2–4 t', 1, 'S', 'des–apr', '610 høydemeter fra Fretland i Sogndalsdalen: over jordet og opp den sørlige ryggen gjennom åpent kulturlandskap til toppen — kort og sørvendt, med sola i ansiktet.', true),
  ('ulvsjoberget', 'Ulvsjøberget', 'Trysil', 61.26561, 12.018, 854, 300, '1–3 t', 2, 'SØ', 'jan–apr', '300 høydemeter fra Vestby opp gjennom skogen til det åpne fjellet — den høyeste toppen i Trysil utenfor alpinanlegget.', true),
  ('nevelfjell', 'Nevelfjell', 'Øyerfjellet', 61.20491, 10.56762, 1090, 270, '2–4 t', 1, 'Ø', 'des–apr', '270 høydemeter fra Nordseter over Nevelåsen til Lillehammerfjellets mest besøkte topp, med åpen bu og siktskive på 1089.', true),
  ('slettind', 'Slettind', 'Hemsedal', 60.96896, 8.18399, 1592, 470, '2–4 t', 1, 'NV', 'jan–mai', '470 høydemeter fra rv 52 ved Eldrevatn opp en jevn 20–25-graders flanke — nybegynnertoppen på Hemsedalsfjellet.', true),
  ('kyrkjebonosi', 'Kyrkjebønosi', 'Hemsedal', 60.90555, 8.55601, 1670, 1000, '4–6 t', 3, 'V', 'feb–mai', '1000 høydemeter fra grustaket ved Kyrkjebøen over den første toppen på 1610 og nordover den lange, flate ryggen.', true),
  ('nibbi', 'Nibbi', 'Hemsedal', 60.88661, 8.6501, 1740, 800, '3–5 t', 2, 'S', 'feb–mai', '800 høydemeter fra Lykkjastølen vest for fossen og opp dalen — Hemsedals mest gåtte vårtopp.', true),
  ('raskarfjellet', 'Råskarfjellet', 'Hemsedal', 60.88427, 8.20901, 1610, 680, '3–5 t', 2, 'NØ', 'feb–mai', '680 høydemeter fra Sildegjerdet ved rv 52 opp bekkedalen — hemsedølenes egen klassiker, kjent bare som «1609».', true),
  ('skogshorn', 'Skogshorn', 'Hemsedal', 60.88148, 8.69482, 1729, 840, '3–5 t', 2, 'Ø', 'feb–mai', '836 høydemeter fra Trefta opp den brede østryggen; bratteste måling er 28,5 grader.', true),
  ('finnbufjellet', 'Finnbufjellet', 'Voss', 60.88074, 6.44081, 1357, 620, '3–5 t', 2, 'NØ', 'jan–apr', '620 høydemeter fra leirplassen på toppen av Halsabakkane: over Sendo-elva og opp ryggen øst for Finnbujuvet, dit skisesongen på Voss blir åpnet og avsluttet.', true),
  ('storehorn',       'Storehorn',       'Hemsedal',   60.81506,  8.59566, 1482,  470, '3–4 t', 2, 'Ø',  'des–apr', 'Hemsedals husfjell for topptur — kort vei fra bilen, mange linjevalg.', true),
  ('storanosi', 'Storanosi', 'Voss', 60.7663, 6.62341, 1205, 740, '3–5 t', 2, 'NØ', 'jan–apr', '740 høydemeter fra Ljosno gjennom åpen bjørkeskog og ut på platået over Brandsetdalen.', true),
  ('lonahorgi', 'Lønahorgi', 'Voss', 60.69383, 6.41489, 1412, 1300, '5–7 t', 2, 'NØ', 'feb–apr', '1300 høydemeter fra Høyland via Bergsstølen og Breiming, med de siste 107 opp nordryggen fra punkt 1305.', true),
  ('vatnaknausen', 'Vatnaknausen', 'Voss', 60.64948, 6.649, 1302, 990, '5–7 t', 2, 'V', 'jan–apr', '990 høydemeter fra Tverrberg: bomveien inn Budalen til Nyestølen, opp på egga vest for Rjupetjørnane, og østover platået til utsikta over Voss.', true),
  ('horndalsnuten', 'Horndalsnuten', 'Voss', 60.64218, 6.67655, 1462, 1120, '5–7 t', 3, 'N', 'jan–apr', '1120 høydemeter fra Skiple gjennom Horndalsbotnen, med den bratte kneika fra skuldra til slutt.', true),
  ('folarskardnuten', 'Folarskardnuten', 'Hallingdal', 60.60742, 7.78251, 1932, 998, '6–8 t', 3, 'S', 'mar–mai', 'Over 13 km inn fra Haugastøl og 998 høydemeter, med et kort 29-graders trinn opp fra Folarskardet.', true),
  ('prestholtskarvet', 'Prestholtskarvet', 'Geilo', 60.55843, 8.0126, 1860, 960, '6–8 t', 3, 'S', 'jan–apr', 'Elleve kilometer og 960 høydemeter fra Havsdalen forbi Prestholtstølan og opp Prestholtskardet til Hallingskarvets sørskarv.', true),
  ('gyranfisen', 'Gyranfisen', 'Vikerfjell', 60.47203, 9.89027, 1127, 670, '3–5 t', 2, 'Ø', 'jan–apr', '670 høydemeter fra Vikerkoia over Svarttjernskollen, med 200 av dem gitt tilbake i søkket før Ringerikes høyeste punkt.', true),
  ('oksen',           'Oksen',           'Hardanger',  60.45983,  6.68301, 1241, 960, '4–6 t', 2, 'SV', 'jan–apr', 'Fjordutsikt i alle retninger og jevn stigning fra Tjoflot.', true),
  ('ustetind', 'Ustetind', 'Geilo', 60.45856, 8.0902, 1376, 410, '2–4 t', 2, 'N', 'feb–mai', '410 høydemeter fra Ustaoset forbi Tindevatnet til varden fra 1899, med Hardangervidda i sør og Hallingskarvet i nord.', true),
  ('skrott', 'Skrott', 'Kvamskogen', 60.45804, 6.14387, 1320, 1070, '4–6 t', 3, 'S', 'jan–apr', '1068 høydemeter fra støls- og hyttetunet i Fitjadalen: gangbru over Kjølo, bratt skogsli til Håsete, skihytta på 1110 moh og skaret mellom Glynt og toppen.', true),
  ('sata', 'Såta', 'Kvamskogen', 60.43136, 5.99001, 1260, 910, '4–6 t', 3, 'SV', 'jan–apr', '895 høydemeter fra den innerste parkeringa ved Eikedalen skisenter: setervei, flat anmarsj inn Skeiskvanndalen, og bratt flanke opp i skaret nord for toppen registeret også kaller Iendefjell.', true),
  ('gullfjellstoppen', 'Gullfjellstoppen', 'Bergen', 60.38756, 5.59037, 987, 840, '5–7 t', 2, 'SV', 'jan–apr', '839 høydemeter fra veienden ved Osavatnet, forbi Redningshytta og opp Middagsdalen til Bergens høyeste punkt.', true),
  ('tveitakvitingen', 'Tveitakvitingen', 'Kvamskogen', 60.3254, 5.90858, 1299, 1000, '5–7 t', 3, 'NØ', 'jan–apr', '996 høydemeter og 8,6 km fra Furedalen alpinsenter: langrennssporene på Mødalsvegen til Mødal, bratte kliv forbi Gråskorvenuten og en langstrakt rygg til varden.', true),
  ('grafjell', 'Gråfjell', 'Norefjell', 60.31831, 9.39572, 1466, 596, '4–6 t', 2, 'S', 'des–mar', '600 høydemeter og 8,1 km fra Tempelsetra forbi Istjenn og Donkelitjenn til Norefjells høyeste topp.', true),
  ('vesoldo', 'Vesoldo', 'Hardanger', 60.31237, 6.09197, 1046, 840, '3–5 t', 2, 'SV', 'feb–apr', '838 høydemeter fra Byrkjenes, skog opp til Fadnastølen og åpen sørvestrygg over; nord- og vestsida av toppen faller 48–55°.', true),
  ('ranten', 'Ranten', 'Norefjell', 60.30259, 9.41922, 1416, 530, '3–5 t', 2, 'S', 'jan–apr', '530 høydemeter fra Tempelseter om stikrysset på Raudmyra og vestover opp på den taggete ryggen Kittelsen malte som Soria Moria.', true),
  ('hogevarde', 'Høgevarde', 'Norefjell', 60.2972, 9.46662, 1461, 600, '3–5 t', 1, 'SV', 'jan–apr', '600 høydemeter fra Tempelseter opp den oppstakede løypa til DNT-hytta på 1397, og de siste 560 metrene ut på ryggen til sikteplata.', true),
  ('gygrastolen', 'Gygrastolen', 'Hardanger', 60.05949, 6.16031, 1347, 1270, '5–7 t', 3, 'N', 'feb–apr', '1270 høydemeter fra fjorden i Ænes opp ryggen over Gygrastølvatnet, rett mot Folgefonna.', true),
  ('mellomkollen', 'Mellomkollen', 'Oslo', 60.0506, 10.76836, 537, 410, '2–4 t', 1, 'SØ', 'des–mar', '410 høydemeter fra bussen på Skar: over Skarselva og gjennom skogen i Maridalsalpene til Mellomkollen, den høyeste kollen i denne delen av Nordmarka — en topptur innenfor bygrensa.', true),
  ('juklavasstinden', 'Juklavasstinden', 'Hardanger', 60.00853, 6.13296, 1361, 1340, '6–8 t', 3, 'NV', 'mar–mai', '1340 høydemeter fra Myrdalsvatnet: opp ryggen, ned mot Møsetjørna og opp nordryggen til en skavlet topp.', true),
  ('melderskin',      'Melderskin',      'Hardanger',  60.00623,  6.08261, 1426, 1280, '6–8 t', 3, 'V',  'feb–mai', 'Rosendalsalpenes storslåtte klassiker, fra sjøen til 1426 moh.', true),
  ('englafjell', 'Englafjell', 'Hardanger', 59.89637, 5.87533, 1200, 1220, '6–8 t', 3, 'N', 'jan–apr', '1220 høydemeter fra Musland i Uskedalen: traktorvei og merket sti, over dalen, opp til Såta og sørover den bratte ryggen — med skavlene mot Limomnen som følge til topps.', true),
  ('stavsnuten', 'Stavsnuten', 'Haukeli', 59.85961, 7.0101, 1661, 610, '3–5 t', 2, 'S', 'feb–mai', '610 høydemeter fra Holbubekk: bekkedalen inn Holebudalen, bollen mellom undertoppene 1567 og 1603 og platået inn til varden — en av de mest kjørte toppturene ved Haukeliseter.', true),
  ('vesle-nup', 'Vesle Nup', 'Haukeli', 59.85855, 7.23287, 1510, 600, '3–5 t', 1, 'SV', 'des–mai', '600 høydemeter fra Ulevå: bekkedalen opp til flata ved 1200, skaret mot topp 1469 og ryggen østover til varden — den rolige starten på Haukeli.', true),
  ('gaustatoppen',    'Gaustatoppen',    'Telemark',   59.8542,  8.64928, 1883,  980, '4–6 t', 2, 'NØ', 'des–mai', 'Sør-Norges mest markante topp — ser du den, ser den deg.', true),
  ('heddersfjell', 'Heddersfjell', 'Telemark', 59.83821, 8.75924, 1462, 410, '2–4 t', 2, 'V', 'des–mai', '410 høydemeter fra Gaustabanen: langs skisporet, over isen på Heddersvatn forbi odden og opp vestsida til Blånipa — det høyeste fjellet mellom Tuddal og Tinnsjå, med Gaustatoppen i ryggen.', true),
  ('sveigen', 'Sveigen', 'Haukeli', 59.83683, 7.07817, 1543, 560, '2–4 t', 3, 'N', 'jan–apr', '560 høydemeter rett fra Pepparsteinen ved Haukelitunnelen: skaret mellom Sveigen og p1490, og vestover til toppen der det flater ut — uten anmarsj.', true),
  ('fjetlandsnuten', 'Fjetlandsnuten', 'Røldal', 59.82294, 6.85402, 1285, 900, '4–6 t', 2, 'SV', 'des–mai', '900 høydemeter fra Røldal: anleggsvegen opp Tveitlia, henget ved 750 og den vestvendte bekken opp til masta — bygdefjellet midt i Røldal.', true),
  ('store-ble', 'Store Ble', 'Blefjell', 59.80825, 9.15349, 1343, 670, '4–6 t', 2, 'SØ', 'jan–apr', '670 høydemeter fra Nordstulvatnet gjennom skogen og opp om Sigridsbu — utløpssonene ligger i Langedalen ved sida av.', true),
  ('surloytenuten', 'Surløytenuten', 'Blefjell', 59.79473, 9.20603, 1097, 460, '3–5 t', 2, 'S', 'jan–apr', '460 høydemeter fra Nordstul om Sudstul og Vassholet, og sørover det ytre høydedraget langs Surløyterinden til varden.', true),
  ('styggemann', 'Styggemann', 'Skrim', 59.52064, 9.64361, 871, 550, '4–6 t', 2, 'SV', 'jan–mar', '550 høydemeter og 9,6 km fra Ravalsjø om Sørmyrseter, med de siste 240 rett opp på Skrims høyeste topp.', true),
  ('saebyggjenuten', 'Sæbyggjenuten', 'Setesdal', 59.46181, 7.62568, 1506, 850, '6–8 t', 3, 'V', 'feb–apr', '850 høydemeter og 11,3 km inn fra Berdalen over Tverrheiskara og Gjuvvatna; nordsida av toppen faller 42° og er ofte skavlet.', true),
  ('kjerag', 'Kjerag', 'Rogaland', 59.01672, 6.58762, 1124, 620, '4–6 t', 2, 'Ø', 'mai–jun', '620 høydemeter fra Øygardstøl om Langvassvegen og Kjeragplatået; bratteste 30 meter er 24,4 grader på en veisving, men Lysevegen åpner først i mai.', true),
  ('hilleknuten', 'Hilleknuten', 'Sirdal', 58.97985, 6.96807, 1209, 690, '3–5 t', 2, 'V', 'des–apr', '690 høydemeter fra fv. 450 ved Storekvæven: opp langs Bekkene, sørover over myra og østover opp bakkene til «kinahuset» på Hilleknuten — en av de lengste nedkjøringene i området.', true),
  ('grubba', 'Grubbå', 'Sirdal', 58.9492, 6.98547, 1184, 500, '2–4 t', 1, 'V', 'des–apr', '500 høydemeter fra Fidjeland: østover inn i skaret ved vatnet og opp den vestvendte flanken til Grubbå.', true),
  ('roseknuten', 'Røseknuten', 'Sirdal', 58.90747, 6.79035, 1022, 350, '1–3 t', 2, 'SV', 'des–apr', '350 høydemeter fra Hunnedalsveien: opp ryggen ved Finndokkje og langs renna til toppen — men linja går nær kanten der skavlen henger over Røsehola.', true)
;
-- The conflict clause refreshes the free columns only. description_up,
-- description_down, avalanche_notes and gpx_path are never touched here, so
-- re-seeding can never overwrite editorial work.

-- ============================================================================
-- Written guides — all 208 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

update public.tk_tours set
  description_up   = 'Start på parkeringa ved skolen i Øksfjordbotn, 58 moh, ved busstoppet. Fri Flyt starter «ved den gamle leirskolen», og Peakbook: «Parkerte ved Gammelveien nær Øksfjordbotn skole (e-verket).» Linja følger Gammelveien og sommervegen Geassegeaidnu østover, og stien videre mot Rivarbukteidet. Vegen er merket skuterløype om vinteren, Tappeluftløypa, og Peakbook skriver: «Stor scooter-trafikk hadde inntatt Kjeldalen i påsken.» Det er nesten flatt: bandene under 200 moh er 1225 og 1531 meter grunn på 2,1 og 3,8 grader. Linja går sør for vatnet på 111 moh som Nordelva renner ut av, 103 meter fra det, og øst for tjernet på 123 moh, 72 meter fra det, før den tar opp i lia øst for et ulendt steg.

Linja går så nordover den linja Peakbook gikk: «Forlot sommerveien ved noen hytter i Rivarbukteidet og valgte oppgangen øst for Skarpavaggi.» Den passerer 168 meter øst for navnepunktet Skárpavággi ved 513 moh. Fri Flyts «rygg som går nordøstover» fra «den gamle leirskolen» går rett opp over Nordelva-juvet og bratte heng fra skolen; linja møter først den ryggen høyere oppe. Bandet fra 200 til 300 moh er det bratteste, 17,3 grader over 315 meter grunn, og bratteste sammenhengende parti er 29,1 grader mellom 266 og 284 moh. Skogen slipper ved 215 moh, 2,8 km fra start. Mellom 181 og 647 moh står små bergsteg på 45 grader eller brattere 3 til 15 meter fra linja, men bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende.

Bandene fra 300 til 700 moh måler 11,4 til 14,1 grader. Fri Flyt: «Her går du opp en jevn fin bakke, før det blir slakere mot toppen av Gievdnerassa.» Over 700 moh slakner det: 6,6 og 7,8 grader i de to øverste bandene, over 844 og 713 meter grunn. Fri Flyt: «Topplåtået er som å komme på en bre med overraskende godt føre selv når det blåser surt ned i dalen fra sørøst.» Toppen er slak til alle kanter, 3,6 til 13,4 grader i snitt over 500 meter.',
  description_down = 'Fri Flyt anbefaler samme rute ned: «Nedkjøringen mot sør der det er enklest å komme opp, gir et langt sammenhengende nedrenn.» Nederst går linja over i sommervegen igjen, og det er nesten flatt de siste kilometerne tilbake til skolen.

Fri Flyt: «I dårlig sikt er det lett å gli ned i små og store heng brattere enn 30 grader.» og «Turen gir litt utfordrende mikroterreng å orientere seg i på vei opp og ned, særlig hvis sikten er begrenset og sporene blåser igjen.» Platået er stort og likt i alle retninger; ha med deg kart og kompass eller GPS.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 29,1 grader mellom 266 og 284 moh, og bratteste bandet 17,3 grader fra 200 til 300. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter. Fri Flyt setter turen til KAST 1 – Enkelt og skriver at hele ruta kan gås i terreng under 30 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Det står små bergsteg langs lia, 3 til 15 meter fra linja mellom 181 og 647 moh. Fri Flyt: «I dårlig sikt er det lett å gli ned i små og store heng brattere enn 30 grader.» Platået er stort og flatt, og sporene blåser fort igjen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Finnmark på varsom.no. Vest-Finnmark er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'gievdnerassa';

update public.tk_tours set
  description_up   = 'Start ved kafeen ved krysset der vegen mot Øksfjord tar av fra E6 i Langfjordbotn, 40 moh. Kafeen er bare åpen om sommeren, og det er ingen kartlagt parkering her. Fri Flyt: «Start ved den lokale kafeen hundre meter nordøst der E-6 og veien mot Øksjord danner et kryss. Gå rett nordover gjennom grov bjørkeskog.» De første 708 metrene stiger 5,6 grader i snitt, og så kommer lia: 19,6 grader fra 100 til 200 moh, det bratteste bandet på turen. Skogen slipper ved 301 moh, 1,3 km fra start. Fri Flyt: «Ved startstedet i Langfjordbotn er det normalt at det ligger rundt halvannen meter snø helt ned mot fjordnivå.»

Fri Flyt: «Over tregrensen er fjellet en brei ryggformasjon. Følg ryggen til toppen, dersom du har tenkt deg helt opp.» Bandene fra 200 til 600 moh måler 16,8 til 17,9 grader. Bratteste sammenhengende parti er 26,3 grader mellom 552 og 577 moh, og like over, ved 596–609 moh, krysser linja et bratt belte som går tvers over ryggen: 26 meter bakke på 35 grader eller mer, med bratteste celle 42 grader. Mellom 555 og 617 moh står bakke på 45 grader eller brattere 18 til 29 meter fra linja. Over beltet holder linja seg øst for den bratte vestkanten opp til forhøyningen på 839, som du når etter 3,14 km.

Fri Flyt: «De fleste nøyer seg med å gå opp til toppryggen for å nyte skikjøringen derfra i stedet for å gå helt til toppen.» Videre nordover er ryggen smalere. Ved 880–888 moh, 4,07 km fra start, krysser linja et kort bergsteg: 13 meter bakke på 35 grader eller mer, med bratteste celle 56 grader. Over steget går linja på en smal rygg der østkanten står 13 til 27 meter fra linja ved 891–892 moh og faller bratt mot gryta; øst for ryggen står celler på 66,5 og 67,8 grader 59 og 45 meter unna. Fri Flyt skriver at det kan komme «store mengder snø på nordvest», og da er østkanten leside og kan ha skavl. Hold deg minst 20 meter vest for kanten. 920-toppen når du på 916 moh etter 4,92 km. Fri Flyt: «Fortsetter du videre mot toppen på 920 moh, kan du slippe deg 500 høydemeter ned i en østvendt gryte mot Øvre Møllevatn.» Det er en nedkjøring, ikke linja.

Fra 920-toppen går linja langs toppryggen. Den er slak, men går opp og ned: ned til 866 moh etter 5,62 km, opp over 918-toppen etter 6,47 km, ned til 889 moh etter 7,06 km og 47 høydemeter opp de siste 346 meterne til Stortinden. Fra 920-toppen til toppen gir linja tilbake 86 høydemeter. Toppen er slak mot nord, vest og nordvest, 3,3 til 12,5 grader i snitt over 500 meter, og faller mot sørøst og sør: 52,1 grader 140 til 200 meter ut mot sørøst og 44,1 grader 260 til 320 meter ut mot sør.',
  description_down = 'Fri Flyt: «Den normale nedkjøringen følger ruta til oppstigningen og byr på bra kjøring fra den første toppen på 839 meter og ned til havet. Skogskjøringen gir ofte dyp og fin løssnø. Kjøringen blir brattere hvis du trekker østover i skogen.» Går du helt til toppen, må du tilbake langs toppryggen, gjennom dumpene og over 920-toppen, før den nedkjøringen begynner.

Fri Flyts alternativer er brattere. Gryta mot Øvre Møllevatn har «flere bratte nedkjøringer som er svært eksponerte», og flankene mot Russelvdalen «bør vurderes ovenfra og kan by på 500 høydemeter med bratt og vurderingsmessig krevende storfjellskjøring».',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 26,3 grader mellom 552 og 577 moh, og bratteste bandet 19,6 grader fra 100 til 200. Bakken under linja er 35 grader eller brattere i to korte strekk: 26 meter ved 596–609 moh og 13 meter ved 880–888 moh, et bergsteg på ryggen. Fri Flyt setter turen til KAST 3 – Komplekst og skriver: «Krevende skredvurdering vest og sør for toppryggen».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Vestsida av ryggen er bratt fra 555 moh og opp. Ved 880–892 moh er ryggen smal, og østkanten står 13 til 27 meter fra linja og kan ha skavl; hold deg minst 20 meter vest for den. Øst for 920-toppen ligger gryta mot Øvre Møllevatn, og toppen faller 44,1 til 52,1 grader mot sør og sørøst. Hold deg på ryggen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Finnmark på varsom.no. Vest-Finnmark er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'stortinden-langfjord';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Jøkelfjordveien, 163 moh, der ut.no-turen starter. Ut.no: «Se etter parkeringsplass på venstre side av veien etter ca. 2 km. Her finner du startpunktet for turen med skilt. Følg stien. Helt i starten av turen krysser du en bekk.» Fri Flyt: «Start fra den vestligste parkeringsplassen ved Jøkelfjordeidet og gå vestover.» Skogen slipper ved 180 moh, 0,27 km fra start, etter Kartverkets terrengklasser; Fri Flyt skriver om Kvænangen at «Skoggrensa ligger på rundt 350 moh».

Ut.no: «Etter dette går du opp langs ryggen på Laslettind. Hold deg til høyre for vardene.» Fri Flyt: «Ruta opp Laslettind går opp en bred rygg som får snø tidlig og holder på den lenge.» Bandene fra 200 til 400 moh måler 10,3 og 19,6 grader; 300 til 400 er det bratteste, med bratteste sammenhengende parti 22,1 grader mellom 377 og 398 moh. Over det holder ryggen 14,5 til 17,8 grader opp til 800 moh. Bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende.

Varden når du på 808 moh etter 2,66 km; Kartverket og ut.no setter navnet Laslettind der. Toppen ligger 0,31 km lenger nordvest, på 822 moh, og det er den Fri Flyts GPS-punkt viser; bandet fra 800 til 900 moh er 314 meter grunn på 2,7 grader. Sør, sørvest og vest for toppen faller fjellet bratt, 29,1 til 31,3 grader i snitt over 500 meter, med 43,1 grader 250 til 310 meter ut mot sørvest, og bakke på 40 grader eller brattere står 41 meter vest-sørvest for toppunktet. Mot nordvest er det nesten flatt, 2,5 grader, mot Olderbakkfjellet; Fri Flyt om den turen: «Skavler på toppen».',
  description_down = 'Fri Flyt anbefaler samme rute ned. Fri Flyt om Kvænangen: «Vi kjørte store svinger ned den lange åpne østsiden av Laslettind og ned i skogen under.» Fri Flyt: «Himmelretningen gir ofte godt føre pga leside for vinden fra vest og nord vest.»

Fri Flyt: «Laslettind er omkranset av stup og bratt renneterreng sør og nord for toppen og ryggen.» Sørvest for linja står celler på 51,5 og 46,9 grader 45 og 57 meter unna ved 650 og 698 moh. Hold deg på ryggen på vei ned.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 22,1 grader mellom 377 og 398 moh, og bratteste bandet 19,6 grader fra 300 til 400. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter, og nærmeste bakke på 45 grader står 33 meter fra linja, ved 686 moh. Fri Flyt setter turen til KAST 1 – Enkelt, med bratteste punkt under 25 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Stup og bratt renneterreng ligger både nord og sør for ryggen og toppen. Sør-, sørvest- og vestsida av toppen er 29,1 til 31,3 grader i snitt, og bakke på 40 grader står 41 meter fra toppunktet. Fri Flyt advarer om skavler på Olderbakkfjellet, nordvest for toppen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Finnmark på varsom.no. Vest-Finnmark er en A-region og varsles daglig i sesongen. Fri Flyt: «Bor du i Finnmark og skal gå topptur før jul er hodelykt greit å ha.» Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'laslettind';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Hamnebuktveien i Jøkelfjord, 22 moh, vest for Golpeelva; busstoppet ligger på andre sida av elva. Fri Flyt oppgir to startsteder. Teksten sier «Fra Ytre Hamnebukta, der veien langs sørsiden av Jøkelfjorden stopper», men faktaboksen sier «Startsted/parkering: Jøkelfjord. Parkering i grustak på sørsiden av Fv.365», og ruta går «langs vestsiden av Golpeelva», som renner ut i Jøkelfjord. Linja starter derfor her; Ytre Hamnebukta ligger 2,9 km lenger vest-sørvest, under en bratt li. Fri Flyts «Følg denne østover til toppen av Vassnestind» passer bare på det siste stykket: linja går rett sørover og dreier mot øst-sørøst den siste halve kilometeren.

Fri Flyt: «Første delen av ruta opp gjennom glissen skog går langs vestsiden av Golpeelva.» Elva renner 18 til 149 meter øst for linja de første 0,74 km. Nederst går den i et gjel med bratte sider, åpent vann og snøbruer; linja holder seg på vestsida av gjelet, og du skal ikke ned i det. Fri Flyt: «I skoggrensen mellom 220-240 moh. er det et litt brattere parti så her anbefales å lese terrenget litt nøye for å legge et hensiktsmessig spor.» Skogen slipper ved 241 moh, 0,92 km fra start, og bandet fra 200 til 300 moh måler 17,4 grader.

Fri Flyt: «Vel over er det småkupert videre oppover. Mellom 440-600 moh. finnes små partier som er litt brattere enn 30 grader. Bruk og les terrengformasjoner.» Bandet fra 400 til 500 moh er det bratteste, 19,2 grader over 281 meter grunn. Ved 440–448 og 471–479 moh krysser linja to korte strekk, 15 og 16 meter, med bakke på 35 grader eller mer, og mellom 457 og 493 moh står bakke på 45 grader eller brattere 2 til 30 meter fra den. Bratteste sammenhengende parti er 26,0 grader mellom 523 og 545 moh.

Over 600 moh slakner ryggen: 9,6 grader fra 600 til 700 moh over 588 meter grunn, og 13,0 fra 700 til 800. Topplatået når du på 871 moh etter 3,51 km. Fri Flyt: «Vel oppe flater det ut og man sporer bortover det brede topplatået til varden for å nyte matpakke og utsikt.» Bandet fra 800 til 900 moh er 781 meter grunn på 7,0 grader. Ved 3,76–3,80 km går linja 17 til 24 meter fra toppen av et gjel på nordsida; hold avstand til kanten.',
  description_down = 'Fri Flyt: «Nedturen følger i samme trase som opp. Der kan man velge spor på fine store flater.»

Fri Flyt: «Hold avstand til det bratte terrenget mot sør og nord.» Toppen faller bratt mot nord, nordøst og øst: 40,3 grader 210 til 270 meter ut mot nord, 52,9 mot nordøst og 50,6 mot øst. Mot sør er den 19,5 grader i snitt, med 28,5 grader 330 til 390 meter ut, og mot vest og nordvest nesten flat. Bakke på 40 grader eller brattere står mer enn 60 meter fra varden.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 26,0 grader mellom 523 og 545 moh, og bratteste bandet 19,2 grader fra 400 til 500. Bakken under linja er 35 grader eller brattere i to korte strekk på 15 og 16 meter ved 440–448 og 471–479 moh. Fri Flyt setter turen til KAST 1 – Enkelt, med «Bratteste parti: 30 grader (kort parti)».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nederst går Golpeelva i et gjel med åpent vann og snøbruer øst for linja. Mellom 440 og 600 moh er det små partier brattere enn 30 grader ved linja; ved 457–493 moh står bratt bakke 2 til 30 meter fra den, og ved 3,76–3,80 km går linja 17 til 24 meter fra toppen av et gjel på nordsida. Nord-, nordøst- og østsida av toppen er 40,3 til 52,9 grader, og Fri Flyt ber deg holde avstand til det bratte terrenget mot sør og nord.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Finnmark på varsom.no. Vest-Finnmark er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'vassnestind';

update public.tk_tours set
  description_up   = 'Start ved Sandneset, der Galtelva renner ut i fjorden på 14 moh, rett ved Fv7922 Lenangsveien. Parkeringa er uskiltet: det som finnes er plassen på nordsida av elveosen og veikanten langs fylkesveien. Sett bilen godt utenfor kjørebanen — dette er brøytet vinterveg. Herfra går du rett inn i Galtdalen nord for Lassofjellet og holder sørsiden av elva, det vil si høyre side på vei opp. Bjørkeskogen slipper taket allerede rundt 180 moh; resten av turen er åpent terreng.

Rund nordsiden av Lassofjellet og ta sikte på skaret mellom Litle-Galten og Storgalten. Du skal ikke helt opp i skaret. Det bunner på 626 moh, og går du dit, gir du fra deg høyde du nettopp har tatt. Legg deg inn på ribben et par hundre meter sør for skaret i stedet — det er der oppstigninga begynner.

Mellom 800 og 860 moh reiser flanken seg til 30–35 grader, og bratteste steg på hele linja ligger her: 34,6 grader mellom 802 og 823 moh. Er snøen avblåst og hard, er stegjern verdt vekta. Over 880 moh brer ryggen seg ut, men den slutter ikke å stige — de siste drøyt 300 høydemeterne holder rundt 20 grader i snitt, med ett steg på 26 rundt 1000 moh. Hold deg på vestsida av ryggkanten hele veien: øst- og nordøstsiden faller 36–43 grader i snitt ned i Kalddalen mot Kalddalsvatnet på 477 moh, med enkeltpartier på 53–58.',
  description_down = 'Ned samme vei. Fra toppflata følger du den brede ryggen nordover tilbake til ribben sør for skaret og videre ut i vestflanken; derfra og ned til dalbunnen er det sammenhengende åpent terreng uten skog å bremse i. Vil du ha mer plass, traverserer du sørvestover like før den siste nedkjøringa mot skaret — der ligger en stor, slak flate som tåler store svinger.

Vanligste feil: å slippe seg rett vestover fra toppflata i stedet for å følge ryggen nordover ned til ribben. Langs hele vestsiden av Storgalten går det rennesystemer, og de bratteste partiene måler 40–50 grader. Fra ryggen ser du ikke hvor de begynner, og inngangen er vanskelig å lese ovenfra — skal du kjøre dem, går du dem opp først. Skaret er ikke faren her; vestflanken sør for ribben er det.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Normalruta går i vestflanken, i løsne- og utløpsterreng. Det bratteste på linja er partiet mellom 800 og 860 moh på 30–35 grader, med bratteste steg målt til 34,6 mellom 802 og 823. Hundremeteren fra 800 til 900 moh er den bratteste på hele ruta, 22,3 grader i snitt. Under den er flanken åpen fra 70 moh og ned til fjorden, uten skog som bremser.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Langs hele vestsiden av Storgalten går det rennesystemer med partier på 40–50 grader; guideboka advarer om at flere av dem er bratte nok til at det kan gå skred, og at inngangen er vanskelig å treffe ovenfra. På toppen bygger det skavler. Kanten som betyr noe er den østlige: øst og nordøst for ryggen faller terrenget 36–43 grader i snitt ned mot Kalddalsvatnet, med steg på 53–58.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade. Stegjern er verdt plassen i sekken til det bratte partiet ved 800–860 moh.'
    )
  )
where slug = 'storgalten';

update public.tk_tours set
  description_up   = 'Fra det gamle grustaket i Glimbukta ved fv. 863 — 11,0 moh, vinteråpen fylkesveg. Du går opp lia mot vatnet på 100: skogen slutter allerede på 185 moh etter 1,39 km, med åpent område fra 199. Videre mot Skallvatnet på 320 er det småbratte parti mellom 230 og 300 moh som kilden ber deg navigere med omhu — beltet fra 300 til 400 måler 11,0 grader.

Linja holder land ved sørenden av Skallvatnet, slik kilden legger den, og går opp ryggen vestover. Ryggen er kupert — 91 høydemeter gis tilbake underveis — og fra flata sørvest for punkt 695 sikter du nord-nordvest. Vatnet på 543 moh der er en del av linja: den krysser 103 meter av det, aldri mer enn 18 meter fra land — et naturlig vatn, ikke regulert, og på vinterisen er det ordinær vinterferdsel.

De siste 800 metrene mot toppen er turens alvor: beltet fra 700 til 800 moh måler 21,6 grader over 225 meter grunn med det bratteste sammenhengende partiet på 27,0 mellom 763 og 785, og kilden gir parti på 30–40 grader som krever terrengvurdering — med bratt terreng på begge sider av linja. Varden på 901; registerets Store Skalltinden ligger 31 m fra Fri Flyts publiserte punkt, og toppsøket løser 901,1 mot publiserte 900.',
  description_down = 'Ned samme vei, med varianter etter forholdene. Sørøstsektoren linja følger er den slakeste på toppen — 16,5 grader i snitt over 500 meter med 33,7 som bratteste 60-metersvindu 240 til 300 meter ut.

Resten av toppen er en annen historie: nordøst, øst og sørvest faller 40,2, 41,6 og 40,8 grader i snitt. Bjørnskardalen er kildens KAST 3-alternativ og hører til stabile dager. Fjordutsikten fra varden — Lyngsalpene over Ullsfjorden — er den samme uansett hvilken dag du velger; linja ned bør ikke være det.

Den andre ruta kommer fra baksida av fjellet: Bjørnskardalen fra Bjørnskar, 966 høydemeter på 6,13 km, opp til og over Bjørnskarvatnan — Nedre Bjørnskarvatnet på 220 moh og det store vatnet på 250 — og gjennom skardet vest for punkt 621, og videre opp den brede ryggformasjonen som krysser et navnløst tjern på 480. Kilden kaller den «et lengre og mer utfordrende rutevalg med et alpint tilsnitt» og regner med ski på sekken fra skardet, med stegjern vurdert etter forholdene. Bratteste steget måler 32,1 grader mellom 701 og 726 moh mot normalrutas 27,0. Vatnene er ikke regulerte — DTM1 leser dem som Innsjø på 250 — og det er kilden selv som sender deg over isen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, faremomenter løsneområder, utløpsområder og skavler. Linja måler 27,0 grader der den er brattest, men kilden gir parti på 30–40 i de siste 800 metrene — og mellom 600 og 800 står bratt terreng på begge sider av linja. Grad 3 står av samme grunn: sjø til topp med tre faremomenter er mer enn en helningsvinkel.'
    ),
    jsonb_build_object(
      'title', 'De småbratte partiene',
      'body',  'Mellom 230 og 300 moh, over Skallvatnet-trinnet, ligger de små bratte partiene kilden ber deg navigere med omhu. De er korte — og de er tidlig på turen, før dagens stabilitet har vist seg. Les dem som en prøve på resten.'
    ),
    jsonb_build_object(
      'title', 'Vatnet på 543',
      'body',  'Linja krysser 103 meter av det naturlige vatnet sørvest for punkt 695, aldri mer enn 18 meter fra land. Vinteris på et lite fjellvatn er ordinær vinterferdsel — men det er verdt å vite at det er et vatn du står på, særlig tidlig og seint i sesongen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Store Skalltinden ligger i varslingsregionen Tromsø, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'store-skalltinden';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved Slettneset på Fjordvegen (fv 7768) tar den merka Blåmann-stien vestover rett fra sjøkanten. De første hundre metrene går på klopper over myr; skogen slipper med en gang, og fra 56 moh og opp går du i åpent terreng resten av veien.

Stien stiger jevnt vestover til skulderen på rundt 230 moh, svinger så sørvest og tar seg opp på ryggen ovenfor Steet. Fra 475 moh og opp er ryggkammen hele ruta. De første tre hundre høydemeterne der oppe er brede og snille — flankene faller bare 10 til 25 grader, og fjellet føles lettere enn det er. Det varer til rundt 800 moh.

Videre følger du østsørøst-ryggen vestover, med sørflanken fallende ned i Blåmannsvikdalen. Et flatere mellomparti gir pusterom rundt 670 moh. Fra rundt 800 moh strammer det til på begge sider: sørflanken går fra 20 til 42 grader i snitt, med parti over 55, og nordsida begynner å falle bort. Det bratteste hundremetersbeltet på linja ligger mellom 900 og 1000 moh med et snitt på 22,2 grader, og det bratteste enkeltpartiet måler 36,5.

De siste 160 høydemeterne er bratte og luftige, med lett klyving mot varden. Det er her skiene går på sekken. I hard snø eller is trenger du stegjern og isøks, og hjelm hører med.',
  description_down = 'Ned samme vei. Klyv ned toppartiet før du tar på skiene igjen — fra varden finnes det ingen linje ned østsida eller nordsida som ikke ender i stup.

Vanligste feil: å legge seg ut på sørflanken under toppen fordi den ser åpen ut. Den holder 35 til 48 grader rett under varden, og der ruta krysser 800 moh er den 42 grader i snitt med parti over 55. Den fortsetter rett ned i Blåmannsvikdalen. Hold ryggkammen til du er nede på skulderen ved 230 moh, og følg stien ut.

Rundt 475 moh møter ruta den gamle stien fra Blåmannsvika. Den er farbar, men kommer ut på en annen parkering enn den du kjørte til — hold merkinga mot Slettneset.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Selve ruta',
      'body',  'Ruta ligger på ryggkammen fra 475 moh og opp, og det er det som gjør den mulig. Opp til rundt 800 moh er ryggen bred og flankene slake, 10 til 25 grader. Over 800 er det slutt: sørflanken holder 42 grader i snitt, nordsida 38 og oppover. Det bratteste hundremetersbeltet på linja, 900 til 1000 moh, holder 22,2 grader i snitt, og enkeltpartier måler 36,5. Toppartiet over 880 moh er bratt og eksponert; i hard snø er det en klatretur, ikke en skitur.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Toppblokka faller bratt til alle kanter unntatt vest. Nordveggen er det ekstreme: 350 høydemeter i 60 til 85 grader rett under varden, en av landets kjente storvegger og ikke noe du kommer deg ned. Rett øst og nordøst for varden faller terrenget i stup, med parti på 70 til 80 grader. Sørveggen holder 35 til 48 grader ned mot Blåmannsvikdalen. Bare vestryggen mot Hollendaren er slak, og den fører bort fra bilen. Ordalen på nordsida er en egen botn og hører ikke til denne ruta.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Tromsø på varsom.no. Ta med sender/mottaker, søkestang og spade — og stegjern, isøks og hjelm til toppartiet.'
    )
  )
where slug = 'store-blamann';

update public.tk_tours set
  description_up   = 'Start sør for Finnvikvatnet, 224 moh, som er der ut.no startet: «Vi parkerte på sørsiden av Finvikvatnet, et av mange startpunkter.» Den kartlagte parkeringa ligger 640 meter lenger nord ved østenden av vatnet, og derfra går det an å gå, men ikke over isen — vassflata ligger på 229 moh og landet øst for den 254 til 265, så det er rundt og ikke over. Fri Flyt beskriver fire startsteder for dette fjellet og kaller dette «et litt kortere alternativ med mindre stigning».

Turen går over skoggrensa nesten fra bilen: Kartverket fører siste skog på 218 moh, 40 meter inn på linja, og åpent terreng fra 219 og hele veien opp. De første 904 metrene innover Finnvikdalen stiger 5,1 grader. Så kommer turens bratteste strekk, og det er ikke bratt: 12,6 grader fra 300 til 400 moh over 450 meter grunn. Over det slakner det igjen — 8,4 grader fra 400 til 500, 6,9 fra 500 til 600, 9,5 fra 600 til 700 og 7,3 til topps — med korridorpunktene på 440, 572 og 703 moh underveis.

Det eneste stedet linja virkelig reiser seg er mellom 605 og 620 moh, der bratteste 30-metersvindu måler 24,9 grader. Fri Flyt oppgir bratteste punkt under 27 grader for alle fire rutene på fjellet. Toppflata nås på 774 moh, og derfra er det flatt bort til den store radaren og varmebua Troms Turlag reiste på dugnad i 2010. Begge står i kartet: radaren er OSM-noden «Stor-Kjølen Radar» 46 meter fra toppcella, og bua «Varmebua på Kjølen» 41 meter fra den.',
  description_down = 'Ned samme veien, ned Finnvikdalen. Retninga fra toppen til startpunktet er 62 grader, mellom øst og nordøst, og de to radialene måler 9,8 og 10,0 grader i snitt ut til en kilometer — det er hele historien om den sida. Fri Flyt mener for øvrig at den beste skikjøringa på fjellet ligger et annet sted: rutene fra Kvaløysletta og Slettaelva, «der siste del nedover Finnlandsfjellet bare er å nyte i store og herlige svinger». Dette er den korte veien opp, ikke den fineste veien ned.

Ut.no er tydelig på hva turen er og ikke er: «Ikke en topp for deg som må ha kvasse egger og bratte nedkjøringer, men en fin topp som gir god skikjøring.» Advarselen deres gjelder ikke bratthet, men det som ligger under snøen: «Snømengden avgjør mulighetene dine på vei ned. Følg snøfeltene så langt det lar seg gjøre, unngå åpenbare terrengfeller og bekkedaler.»

Nordover er det en annen sak. Nordflanken måler 20,9 grader i snitt ut til en kilometer med et 36,7-graders vindu 710 til 770 meter ut — den eneste retninga fra denne toppen som holder over 20 grader i snitt. Toppflata er bred, radaren er det eneste holdepunktet i dårlig sikt, og faller du for fristelsen til å ta en ny linje nedover nordover, er det den flanken du kommer inn i.

Fri Flyt gir fire startsteder for Kjølen, og kortet bærer nå tre av dem. Fra Kvaløysletta sykehjem er det 808 høydemeter og 6,83 km opp stiene øst for byggefeltet til det lille alpinanlegget, forbi Slaktarhaugen på 220 moh, over Finnlandsfjellet på 494 og forbi Litje-Kjølen på 652 — den slakeste av de tre, med bratteste steg 23,1 grader mellom 130 og 149 moh. Fra Slettaelva er det 813 høydemeter og 6,29 km etter anleggsveien opp Svarthammardalen, 376 moh, og vest for Amundvatnet. Den linja har et steg på 34,7 grader mellom 350 og 371 moh — godt over «Bratteste punkt: Under 27 grader», som er tallene kilden oppgir for fjellet og som normalruta fra Finnvikdalen holder seg innenfor.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '578 høydemeter der bratteste band er 12,6 grader og bratteste steg 24,9. Fri Flyt fører alle sine fire ruter på fjellet som KAST 1 – Enkelt, og ut.no fører denne som moderate. Ingen av dem oppgir et faremoment på oppstigninga.'
    ),
    jsonb_build_object(
      'title', 'Nordsida og toppflata',
      'body',  'Sju av åtte retninger fra toppen måler under 12 grader i snitt: nordøst 10,0, øst 9,8, sørøst 9,9, sør 11,3, sørvest 7,9, vest 4,8 og nordvest 8,0. Nord måler 20,9 med 35,5 grader i vinduet 720 til 780 meter ut. Det er den ene kanten det er verdt å vite om, og den er lettest å finne i dårlig sikt, når toppflata ikke gir deg noe å navigere etter og radaren blir borte bak deg.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Tromsø på varsom.no — en A-region med varsel hver dag i sesongen. Ut.no oppgir sesong januar til mai og Fri Flyt november til juni; kortet fører overlappet, november til mai. Varmebua på toppen er ulåst, men den er en rasteplass og en nødbu, ikke en grunn til å gå ut i vær du ellers ville snudd i. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'kjolen';

update public.tk_tours set
  description_up   = 'Start ved Storelva skistadion på Kvaløysletta, 20 moh, der det er kartlagt parkering ved anlegget. Fri Flyt oppgir 2,8 km for turen og ut.nos egen linje måler 2,52; den routa linja her er 2,32 km. Fjellet heter Rødtinden på norsk og Ruksesvárri på nordsamisk, og begge navnene er vedtatt i Kartverkets register.

Den første kilometeren følger lysløypa oppover Storelvdalen — de første 944 metrene av linja stiger 5,1 grader i snitt — og på 96 moh forlater ruta løypa og legger seg inn i lia, og fra da av er stigninga påfallende jevn: 14,5 grader fra 100 til 200 moh, 15,0 fra 200 til 300, 15,1 fra 300 til 400 og 14,9 over det. Turen gir ikke tilbake en eneste høydemeter på hele oppstigninga.

Kartverket fører skog til 208 moh og åpent terreng fra 218, men skogen her er bjørk med myr imellom — terrengklassen langs linja veksler mellom Skog og Myr på 53, 156 og 241 moh. Over den er det bare å velge spor. Fri Flyt: «Etter hvert kommer man over skogen og det er bare å legge sporet etter behag. (Men det skal godt gjøres hvis det ikke er et spor å følge).» De siste hundre høydemeterne holder ruta godt mot vest der ryggen er slakest, og bratteste steget på turen ligger her — 24,2 grader mellom 429 og 447 moh.',
  description_down = 'Ned samme veien, sørøstover mot skistadion. Vest for varden måler flanken 3,3 grader i snitt ut til en kilometer og sørvest 15,1, så velger du feil kant er det ikke bratthet som straffer deg, det er at du havner i feil dal.

Det ene stedet fjellet er bratt, ligger sørøst for varden, og det ligger nært. Radialen på 135 grader, lest av punkt-API-et hver tiende meter, går 469,6 – 467,7 – 464,6 – 459,5 – 452,7 – 448,8 – 437,0 – 430,6 – 426,6 moh de første 80 meterne: bratteste 60-metersvindu er 32,3 grader mellom 20 og 80 meter ut, og det bratteste enkeltsteget 49,7 grader mellom 50 og 60. Fri Flyts «heng med bratthet opp mot 40 grader» er altså riktig, og under de tjue metrene der det er brattest, forsiktig.

Nordvestover er problemet det motsatte. Toppen er en rund skulder og ikke et toppunkt i terrengmodellen: bakken stiger videre uten sadel — 479,6 moh 200 meter ut, 488,5 på 400 og 491,0 på 600 — og fortsetter til 567,0 moh ved registerpunktet for Storbogtinden 728 meter unna. I flatt lys går du forbi varden uten å merke det, og fortsetter inn på et fjell med en annen tur.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '450 høydemeter der ikke ett hundremetersband måler over 15,1 grader og bratteste steg er 24,2. Fri Flyt fører turen som KAST 1 – Enkelt med bratteste punkt under 25 grader, og skriver at sporet her kan legges helt utenom skredterreng. Det forutsetter at det holder seg vest for toppryggen på slutten.'
    ),
    jsonb_build_object(
      'title', 'Henget mot sørøst',
      'body',  'Det henget er turens eneste faremoment, og det er brattere enn tallet Fri Flyt oppgir: 49,7 grader på ti meter mellom 50 og 60 meter fra varden, og 32,3 grader over hele vinduet fra 20 til 80. Fra toppen ser det ut som en naturlig linje ned mot skistadion, og det er den korteste veien hjem. Østsida er den samme historien i mindre målestokk: 15,0 grader i snitt, med et 28,6-graders vindu som ligger 50 til 110 meter ut — lenger fra varden enn på sørøstsida, og derfor lettere å komme borti uten å ha bestemt seg for det.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Tromsø på varsom.no. Tromsø er en A-region og varsles hver dag gjennom sesongen, i motsetning til mange av fjellene lenger sør i appen. Ingen av kildene oppgir sesong for Rødtinden; kortets des–mai er lest ut av høyden — toppen er 470 moh — og av at Fri Flyt gir Kjølen på 790 moh november til juni. Ta med sender/mottaker, søkestang og spade selv på husfjellet.'
    )
  )
where slug = 'rodtinden';

update public.tk_tours set
  description_up   = 'Fra fv. 91 i området der den krysser Storelva — 41 moh på Breivikeidvegen, og 1089 minus 41 forliker kildens 1050 høydemeter. Du går mot Russevankskardet langs nordøstsida av elvedalen: beltet fra 200 til 300 moh måler 21,1 grader, og renna i dalen er kildens eget faremoment — den fungerer som samletrakt for skred fra hengene omkring, så linja holder seg på dalsida, ikke i botnen. Skogen slutter på 455 moh etter 1,8 km, med åpent område fra 463.

På rundt 400 svinger du mot nord og øst, opp på sørryggen som kommer ned fra toppen. Overgangen er turens bratteste: beltet fra 500 til 600 moh måler 29,7 grader over bare 198 meter grunn, med det bratteste sammenhengende partiet — 42,4 grader — mellom 536 og 565 moh.

Ryggen tar deg til topps: 24,9 grader fra 800 til 900 moh og 23,7 fra 900 til 1000, som er linjas svar på kildens «30–40 grader mellom 950 og 1040» — ryggen skrår der flanken står. Varden på 1088; registerets Storfjellet ligger 46 m fra Fri Flyts publiserte punkt, og toppsøket løser 1088,2 mot publiserte 1089.',
  description_down = 'Normalen følger ruta opp — sørvestsektoren er den slakeste på toppen, 26,2 grader i snitt med 37,0 som bratteste 60-metersvindu, og det er den eneste: sørøst faller 34,8 i snitt med et vindu på 59,9, sør 36,3 med 53,1, og nordsiden har 53,9 grader bare 100 til 160 meter ut.

Østhenget fra Krokenga er kildens KAST 3-alternativ, med lang eksponering i både løsne- og utløpsområder og 30–40 grader fra 240 moh og opp. Skredulykken i 1997, som tok to liv, gikk her. Det er ikke linja på dette kortet, og det er ikke en vei ned man tar på følelsen.

Den andre ruta går opp østsida fra Krokenga: 1074 høydemeter på 3,66 km, langs sørvestsida av Sauskarbekken til 578 moh og så vestover mot toppen. Kilden skriver den med utropstegn — «Denne oppstigningen krever sikre snøforhold!!!» og «Fra 240 moh. og helt opp er terrenget i store områder 30–40 grader!!» — og daterer et skred: i 1997 gikk et selvutløst skred langt oppe i fjellet over fv. 91 og tok livet av to personer i et hus på Krokenga. Bratteste steget på linja måler 30,7 grader mellom 350 og 368 moh; normalruta fra Storelva er brattere i et enkeltsteg, 42,4, men ligger kortere tid i skredterreng.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, med 30–40 grader mellom 950 og 1040 på flanken og linjas eget bratteste på 42,4 grader i overgangen opp på ryggen. Nesten hele turen ligger i eller inntil terreng over 30 grader — dette er en tur for stabile forhold.'
    ),
    jsonb_build_object(
      'title', 'Renna i dalen',
      'body',  'Kildens eget faremoment: renna fungerer som samletrakt for skred fra hengene omkring. Dalen inn mot skardet er mottakerterreng — hold linja på dalsida og avstanden til hengene som en del av sporvalget.'
    ),
    jsonb_build_object(
      'title', 'Østhenget',
      'body',  'KAST 3 – Komplekst, lang eksponering i løsne- og utløpsområder, 30–40 grader fra 240 moh — og en skredulykke i 1997 som tok to liv. Historien er en del av fjellet, og den er grunnen til at normalruta går på ryggen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Storfjellet ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'storfjellet';

update public.tk_tours set
  description_up   = 'Fra skogsvegen ved Sandeggen — 30 moh på Breivikeidvegen, fv. 91, vinteråpen hovedveg — følger du veien inn og tar av langs nordsida av Russevankelva, opp gjennom storsteinet terreng. Beltet fra 100 til 200 moh måler 14,7 grader; skogen slutter allerede på 318 moh etter 2,42 km, med åpent område fra 327.

På rundt 400 flater det ut inn i Russevankskaret — 452 moh der linja går, og registerets Russevankskaret leser 446. Her er kildens terrengfelle: dalen samler utløp fra hengene i nord, så avstanden til dem er en del av sporvalget. Ved punkt 511 svinger du mot sør-sørøst, og linja gir tilbake det bratteste partiet sitt her — 30,5 grader ned mellom 539 og 516 moh, dippen etter skaret som er grunnen til at turen samler 939 høydemeter der kilden regner 835.

Fra svingen stiger det jevnt mot toppplatået: beltet fra 600 til 700 moh er turens bratteste oppover, 21,1 grader over 269 meter grunn, og over 700 slakner det til 13,1 og 8,1. Platået passerer 847 før varden på 857 — Fri Flyts publiserte GPS-punkt, registerets punkt (som har både Skarlitinden og Skardlitinden) og terrengmodellens 857,5 faller sammen.',
  description_down = 'Normalen er sporet ditt opp, og platåsiden er slak: nordvest måler 3,3 grader i snitt og vest 11,0. Hold igjen mot kanten i sørøst — den faller 41,4 grader i snitt med 52,5 som bratteste 60-metersvindu 120 til 180 meter ut fra varden, og sørsiden 36,1 med 48,8 bare 50 til 110 meter ut.

Østerenna er kildens alternativ ned mot øst: KAST 3 – Komplekst, 30–45 grader mellom 760 og 380 moh. Østsiden måler 21,5 grader i snitt med 45,2 som bratteste vindu 340 til 400 meter ut — skikjøring i skredterreng, og et valg som tas på stabilitet, ikke på fristelse.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, bratteste punkt under 27 grader på oppturen — og linjas eget bratteste parti er faktisk en nedoverbakke, 30,5 grader i dippen etter punkt 511. Kortet bærer grad 2: terrenget rundt linja er det som krever hodet.'
    ),
    jsonb_build_object(
      'title', 'Terrengfella',
      'body',  'Fri Flyts faremoment er «Terrengfelle. Skavler». Elvedalen langs Russevankelva samler utløp fra hengene i nord — du går i mottakerterreng, og avstanden til hengene er en del av sporvalget hele veien inn skaret.'
    ),
    jsonb_build_object(
      'title', 'Kanten og rennene',
      'body',  'Sørøst- og sørsiden av platået faller 41,4 og 36,1 grader i snitt mot Breivikeidet, med vinduer på 52,5 og 48,8 grader nær varden — og skavlene bygger ut over kanten. I flatt lys er platåkanten stedet å ha tenkt gjennom før du står der.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skarlitinden ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'skarlitinden';

update public.tk_tours set
  description_up   = 'Fra fv7920 ved Rottenvik tar Vardoveien av og klatrer omtrent en kilometer til veienden på 123 moh — Fri Flyts «parkeringsplass på Varto» — registerets Varto (Høyde) står 1,8 km øst på 187 moh, og navnet som er registrert ved selve veienden, er Vardoveien. Anleggsveien fortsetter vestover og oppover: den er kartlagt hele veien til dammen på 515 moh, og de første fire hundre høydemetrene er unnagjort på vei. Skogen slutter allerede på 363 moh etter Kartverkets klasser.

Dammen fortjener sin egen setning: Rottenvikvatnet er et magasin — regulert, med terrengklasse deretter — og isen på et regulert vann skal ikke brukes. Linja går derfor slik kilden sier, langs vest- og senere nordsida av vannet, på land hele veien: vestbredden på 566, nordvestbredden på 572, nordenden på 589 moh. Det er målt mot både terrengklassene og OSM-polygonet: 0 meter på vann.

Fra nordenden av vannet stiger terrenget til flata Fri Flyt setter på 650 moh — målt 650 på metern. Videre vestover passerer linja nord for det vesle vatnet på 697, og så kommer ryggformasjonen kilden ber deg være våken på: «Her er det små områder som er rundt 30 grader, så bruk litt tid på å gjøre gode veivalg». Linja holder 815 → 1070 på ryggen, med linjevalget som verktøyet.

Fra ryggen er det rett mot toppen, slik kilden sier. Varden står på 1275 moh, og sørøstsida du kom opp er den slakeste sektoren fjellet har: 16,0 grader i snitt og 28,4 som bratteste 60 m-vindu de første hundre metrene.',
  description_down = 'Samme trasé ned som opp er kildens råd, og tallene er med den: sørøst og sør er de eneste sektorene uten et 30-gradersvindu i sveipet — 28,4 og 28,2 grader som bratteste 60 m — og linja selv peiler 169 til 180 grader ned. Ned ryggen, forbi det vesle vatnet, ned på flata og rundt magasinet på land igjen — 119 høydemeter å gi tilbake har turen samlet, det meste rundt vatnet og på anleggsveien.

Sørsidenedfarten Fri Flyt nevner — 35–45 grader ned mot Rottenvikvatnet — er ikke denne linja, og kilden sier selv hvorfor med uvanlig tunge ord — «Sørsiden av fjellet har vært åsted for et par tragiske skredulykker med dødelig utfall», skriver den, og den skriver det i beskrivelsen av normalruta, ikke om varianten: steinparti rundt 1000 moh må identifiseres på vei opp, og utkjøringa krever sikker is på et vann som er regulert. Denne guiden tegner den ikke.

Vær også våken vest og sørvest for varden: sveipene måler 34,3 og 32,5 grader i snitt der, med 46,6 og 51,6 som bratteste vindu — fjordsida er alpin, og i flatt lys er kanten lett å komme for nær.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyts faremoment er «utløpsområder og skavler», og det er presist: selve linja holder 25,5 grader som bratteste sammenhengende parti, men den krysser under brattere flanker — ryggformasjonen har småbratte partier rundt 30 grader, og Normalruta II lenger nord er eksponert for løsneområder ovenfra mellom 700 og 900 moh. Velg ryggen med øynene oppover, ikke bare nedover.'
    ),
    jsonb_build_object(
      'title', 'Sørsida',
      'body',  '«Sørsiden av fjellet har vært åsted for et par tragiske skredulykker med dødelig utfall», skriver Fri Flyt — og den skriver det midt i beskrivelsen av normalruta, rett etter flata på 650, ikke om varianten. Advarselen gjelder hele sørsida slik du ser den fra ryggen du går opp; nedfartsvarianten på 35–45 grader mot Rottenvikvatnet fører den selv som «Ned sørsiden ➌ Komplekst». Den ligger rett ved normalruta og frister på vei ned. Målingene fra varden sier at alt vest om sør er alpint: SV 51,6 grader som bratteste vindu, V 46,6, NV 41,0.'
    ),
    jsonb_build_object(
      'title', 'Magasinet',
      'body',  'Rottenvikvatnet er regulert, og regulert is skal ikke brukes — trukket ned vinterstid legger den seg i sprekker og hulrom langs land. Linja går rundt vatnet på land i begge retninger, målt punkt for punkt, og den eneste grunnen til å være på isen er å ha valgt feil. Anleggsveien og dammen er der fordi dette er et kraftmagasin; les landskapet deretter.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Fastdalstinden ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–mai er Fri Flyts egen. Tiden er ikke: den setter 5–6 timer, mens kortet bærer 6–8 — appens egen skala for 1270 høydemeter og 7,3 km. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'fastdalstinden';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved skytebanen innerst i Turistvegen følger du skogsbilvegen sørøstover inn i Tromsdalen. Hold vestsida av Tromsdalselva hele veien; bjørka slipper taket allerede rundt 220 moh, og derfra ligger dalen åpen foran deg. Sommerruta tar NNV-ryggen ut av dalen lenger nede — det er gåruta, ikke skiruta.

Innerst flater dalen ut ved Dalbotnvatnet på 311 moh. Rett før botnen reiser Svarthammaren seg på vestsida — et nordvendt stup som taper nær 100 høydemeter på seksti meter. Hold dalbunnen øst for det og styr mot skaret. Bakken opp til Salen på 740 moh er turens største lastflate: sporet legger seg på skrå over den og holder 12 til 13 grader, mens fallinja måler 30 til 35 om du tar den rett på.

Fra Salen slakner det av. Følg sørryggen nordøstover mot varden. Beltet mellom 1000 og 1100 moh er det bratteste på selve ryggen, 20,1 grader i snitt; turens bratteste enkeltparti ligger nede i bakken opp mot Salen, 26,3 grader mellom 547 og 569 moh. Over 1100 moh er østkanten av ryggen skavlet — gå på vestsida av kammen, også når sporet frister lenger ut.',
  description_down = 'Ned samme vei: sørryggen til Salen, så vestover ned i indre Tromsdalen og ut dalen til bilen. Fra Salen faller flanken jevnt vestover mot Dalbotnvatnet, og det er der de beste svingene ligger.

Vanligste feil: å slippe seg rett ned vestsida fra toppen. Fra varden ruller vestflanken av på 20 til 35 grader, og det er hele problemet — den ser gåbar ut oppe. Under rundt 1080 moh er du på Fronten: hundre høydemeter med 45 til 58 grader, og ingen vei ut til sida. Hold ryggen sørover til Salen før du legger deg over mot vest.

De siste kilometerne er skogsbilveg. Fallet er slakt — under fem grader hele veien ut — så regn med å stake.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Selve ruta',
      'body',  'Sporet passerer 25 grader ett sted, mellom 547 og 569 moh i bakken opp mot Salen, der det måler 26,3; beltet 1000 til 1100 moh holder 20,1 grader i snitt. Bakken opp til Salen er partiet du må lese. Den vender vest og nordvest, og fallinja måler 30 til 35 grader i snitt med parti over 40: sporet legger seg på skrå over den, men snøen bryr seg ikke om sporet. Det er en lastflate i østlig og sørøstlig vind, ikke i vestlig. Over 1100 moh er østkanten av ryggen skavlet hele veien til varden.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Vestveggen rett under toppen er Fronten — guideboka kaller den 150 høydemeter med 35 til 50 grader, og terrengmodellen er enig. Den er en felle fordi den begynner slakt: 20 til 35 grader de første hundre og femti metrene fra varden, så 35 til 40, og først under rundt 1080 moh går den i 45 til 58. Østryggen er brattere enn den ser ut fra sporet, 35 grader i snitt og opp mot 40. Nede i dalen stuper Svarthammaren nordover rett før Dalbotn; ruta går forbi på dalbunnen øst for den.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Tromsø på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'tromsdalstinden';

update public.tk_tours set
  description_up   = 'Fra den nordligste av de to Stormo-gårdene langs fv. 91 — registerets Stormo leser 75,9 moh, og parkeringa er langs veien slik kilden sier. Du går sørover gjennom glissen skog: beltet fra 100 til 200 moh måler 13,0 grader, og skogen slutter allerede på 420 moh etter 1,4 km, med åpent område fra 437.

Fra de åpne partiene dreier ruta mer mot øst, og mellom 400 og 850 moh er terrenget rullende rygger med flate parti imellom — 17,3 grader fra 400 til 500, 14,3 fra 500 til 600. Så kommer det bratteste: beltet fra 600 til 700 moh måler 24,9 grader over 226 meter grunn, med det bratteste sammenhengende partiet på 29,2 mellom 663 og 680. Kilden gir 30–35 grader her og ber om bevisst linjevalg — flanken står brattere enn diagonalene linja skjærer den i.

Over 850 slakner det mot toppen, og de store flakene tar over: 9,0 grader fra 900 til 1000 moh over 631 meter grunn, så 15,6 og 14,7 opp de siste ryggene til varden på 1214. Fri Flyts publiserte GPS-punkt ligger 47 m fra registerets Iverfjellet, og toppsøket løser 1213,7 mot publiserte 1213 — registerets eget «Gabrielfjellet» er en skulder 3,2 km nordøst, og outdooractive fører turen under begge navnene.',
  description_down = 'Nedfarten er nordover, samme vei som opp — og nordsiden er den slake sektoren på toppen: 13,5 grader i snitt over 500 meter med 17,8 som bratteste 60-metersvindu. Med stabilitet i orden gir det bratteste partiet fin kjøring med variantmuligheter; uten den kjører du flakene over og traverserer forbi.

Hold igjen mot øst og sørøst fra varden: 40,8 og 38,8 grader i snitt, med 50,3 og 48,1 som bratteste vinduer rett under toppen. Vestsiden — kildens KAST 3-alternativ — måler 31,2 i snitt med parti på 40–45 i kildens egen beskrivelse.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, bratteste parti 30–35 grader med krav til linjevalg. Linja måler 29,2 grader der den er brattest, mellom 663 og 680 moh — det er partiet som avgjør om dagen har stabiliteten turen trenger, og det kan traverseres slakere enn fallinja.'
    ),
    jsonb_build_object(
      'title', 'Løsne- og utløpsområder',
      'body',  'Kildens faremomenter. Det bratte beltet mellom 600 og 700 ligger midt i linja, så utløpet ditt er terrenget du selv skal videre opp i — les flanken over deg før du går inn i den, og ta de flate partiene mellom ryggene som lesepunkter.'
    ),
    jsonb_build_object(
      'title', 'Østkanten',
      'body',  'Øst- og sørøstsiden av toppen faller 40,8 og 38,8 grader i snitt med vinduer over 48 rett under varden. Flakene mot toppen er store og oversiktlige — kanten der de slutter er det ikke. I flatt lys er det verdt å vite hvor den er før du står på den.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Gabrielfjellet ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'gabrielfjellet';

update public.tk_tours set
  description_up   = 'Start fra parkeringa ved Eidebakken i utkanten av Lyngseidet, på 62 moh, i området ved plastfabrikken og skytebanen. Følg skogsveien innover og opp mot Hyttehaugen på 286 moh, videre forbi Skihytta. Bjørkeskogen slipper rundt 310 moh, og derfra ser du resten av turen foran deg.

Videre vestover mot Rørneshytta, hele tiden på sørsiden av Gjerdelva — en variant følger ryggen nord for elva opp til flata rundt 600 moh når snødekket tillater det, men normalruta holder sørsiden. Uansett hvilken side du går: ikke gå for langt ned i elvedalen mot Gjerdelva. Sidene ned i den bryter av på 34–37 grader der de ovenfra leser som flatt, og bunnen er ei terrengfelle. Hytta ligger på 604 moh, og det er der folk stopper.

Fra hytta går du litt ned før du går opp igjen. Du krysser Gjerdelva rundt 590 moh, et søkk på en femtentalls høydemeter; turen gir fra seg 38 høydemeter til sammen på vei opp. Så følger du østsiden av flanken oppover til rundt 850 moh og svinger derfra mot toppen.

Langs linja på kartet er bratteste steg 27,3 grader, og hundremeteren mellom 800 og 900 moh går i 21,4 i snitt. Flanken rundt deg er brattere, og snittet skjuler hvor mye: målt 400 meter ut fra sporet ved 907 moh holder østsiden 30 grader i snitt og nordsiden 33, men nordsiden faller i steg på 41 til 58 grader mellom 928 og 692 moh, og østsiden i steg på 44 til 48 under 794. Legger du deg for direkte mot toppen, er det dem du står i. Øverst flater det ut til den brede toppflata på 1030.',
  description_down = 'Ned samme vei. Toppflata er romslig nok til å legge svingene der du vil — så lenge du holder deg sør og øst på den. Nord- og nordvestkanten faller av på 40–47 grader i snitt med steg på 50–57, og det er der det bygger skavler. Østflanken ned mot 850 moh er den lengste sammenhengende nedkjøringa på normalruta, 20–23 grader langs sporet. Under det holder du oppstigningssporet ned til Rørneshytta og videre østover mot Skihytta og skogsveien.

Vanligste feil: å la nedkjøringa trekke ned i elvedalen mot Gjerdelva. Ryggen nord for elva er i seg selv en dokumentert variant og går fint å kjøre — det er bunnen som er problemet. Elvedalen er ei stor terrengfelle der det omkom en person vinteren 2017, og sidene ned i den måler 34–37 grader selv om de leser som flatt ovenfra. Hold høyden til du er ute av dalen.

De brattere linjene fra toppen er egne turer, ikke varianter av normalruta. Topphenget er ei rett linje fra toppen med partier på 35–40 grader. Skredbekken tar ut mot Gjerdaksla etter topphenget og følger søkket nord for den ned mot Sollia, med partier på 30–40 grader; folk har løst ut skred der før, og du kommer ned langt fra bilen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigninga går gjennom utløpsområder fra 800 moh og opp. Selve sporet er slakt — bratteste steg måler 27,3 grader, og båndet 800–900 moh går i 21,4 i snitt — men flanken over og ved siden av måler 30 grader i snitt i øst og 33 i nord fra 907 moh, med enkeltsteg på 44 til 58. Det er den som eventuelt løsner over deg.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skavler står oppført som faremoment for turen, og kanten som betyr noe er nord- og nordvestsiden av toppflata: den faller 40–47 grader i snitt med steg på 50–57. Hold avstand til den i dårlig sikt. Elvedalen mot Gjerdelva er ei stor terrengfelle der det omkom en person vinteren 2017; sidene ned i den holder 34–37 grader. Nedkjøringsalternativene Topphenget og Skredbekken har partier på henholdsvis 35–40 og 30–40 grader, og i Skredbekken har folk løst ut skred tidligere.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'rornestinden';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved Fv91 nedenfor Vartavarhaugen, 65 moh, går ruta østover over Vartavarhaugen på 159 moh og krysser Tverrelva. Bjørka slipper taket rundt 390 moh, og over 403 moh er terrenget åpent hele veien.

Derfra følger skisporet den brede nordvestryggen sammenhengende oppover. Terrengmodellen gir jevne 16 til 26 grader fra rundt 350 moh til Middagsaksla, uten bratte trinn: bandene mellom 500 og 1000 moh ligger alle på 19 til 21 grader i snitt. Det er en lang, jevn skitur, og den er lite skredutsatt så lenge du blir på ryggen. Flankene på begge sider er noe annet, og de er terrengfeller i dårlig sikt.

På Middagsaksla, 1076 moh, stopper skituren. Mange setter fra seg skiene her; noen bærer dem til forvarden på rundt 1190 moh og lar dem ligge der. Turrapportene fra vinterbestigninger er samstemte om at ryggen videre går til fots — «over ca. 1100 moh måtte skiene byttes mot stegjern og isøks».

De siste 1,7 kilometerne er eksponert nordvestrygg. Ryggkammen bølger seg oppover fra 1076 til 1393 moh med korte motfall underveis — 47 høydemeter til sammen over Middagsaksla, og ingen av dem mer enn ti om gangen på linja. Det er luftige parti, korte klyvepartier, og helt til slutt ei renne og en bratt topppyramide: den bratteste hundremeteren på hele turen ligger mellom 1300 og 1400 moh og måler 23,9 grader i snitt, mens det bratteste sammenhengende partiet er selve toppsteget: 46,2 grader over tretti meter mellom 1365 og 1397 moh.',
  description_down = 'Ryggen tilbake til fots til Middagsaksla, og derfra ned nordvestryggen på ski til Vartavarhaugen og bilen. Fallretningen ned ryggen er målt til nordvest, 293 grader, og hellinga er 16 til 26 grader hele veien — jevn, oversiktlig kjøring uten trange partier.

Vanligste feil: å behandle Middagsaksla som en pause i stedet for et vedtak. Er ryggen isete, eller er sikta dårlig, er det her turen slutter — skituren er uansett over, og det som ligger foran er 1,4 kilometer der en glipp ikke har noen utgang til sida. Å snu på Middagsaksla er ikke en avbrutt tur; det er en fullverdig tur i seg selv, og den riktige når ryggen er isete.

Den andre feilen er å slippe seg ned en av flankene fra ryggen for å korte inn. Begge sider av nordvestryggen er bratte og samler snø; ryggen selv er linja, både opp og ned.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Skituren opp nordvestryggen er lite skredutsatt: 16 til 26 grader jevnt fra rundt 350 moh til Middagsaksla, uten bratte trinn. Flankene på begge sider av ryggen er derimot bratte, og de er terrengfeller — i dårlig sikt er det å holde ryggen selve navigasjonsoppgaven. Over Middagsaksla er det ikke lenger skiterreng: bratteste sammenhengende parti er toppsteget på 46,2 grader mellom 1365 og 1397 moh, og bratteste hundremeter, 1300 til 1400 moh, 23,9 grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Toppryggen er den reelle faren på denne turen, og den er ikke først og fremst en skredfare: den er luftig, delvis skavlet mot nordøst, og har isete klyvepartier som krever stegjern, isøks og en vurdering av om tau hører hjemme i sekken. Nordvarianten fra Stormo, opp dalen mellom Gabrielfjellet og Middagsaksla, går ei renne på rundt 40 grader til skavlet rygg — det er en annen tur enn denne, og ikke normalruta.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade, og stegjern og isøks om du skal videre fra Middagsaksla.'
    )
  )
where slug = 'hamperokken';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved Eidebakken, 62 moh, følger du skogsveien opp østsida av Gjerdelva. Du passerer Rødsteinen i bjørkeskogen rundt 200 moh og fortsetter opp ryggen øst for elva. Ruta krysser aldri Gjerdelva — går du over vann, har du gått feil.

Du går forbi Skihytta på 317, og skogen slipper taket ved 320 moh. Mellom Rødsteinen og Skihytta må du gjennom et grunt søkk før stigningen tar seg opp igjen, og terrenget blir først ordentlig oversiktlig rundt 400. Skogsveiene fra Karnes, Solhov, Marieslett og Jensbakk kommer opp på den samme hylla, så hvilken du velger nede i bygda spiller mindre rolle. Herfra legger du kursen vestover mot nordøstryggen og kommer opp på kammen rundt 780 moh.

Videre følger du ryggen sørover, på eller like øst for kammen. Mellom 900 og 950 moh reiser østsida seg i partier over 30 grader, og bratteste enkeltsteget på linja måler 33,5. Vestsida er ikke et alternativ: der faller det 40 til 80 høydemeter per hundre meter rett ned mot Gjerdelva.

Toppryggen smalner inn de siste hundre meterne, og rundt nitti meter før varden tar et grunt skar tilbake et par høydemeter. Her henger skavlene ut mot øst, over Østrenna: kammen faller 30 til 41 grader på østsida og 21 til 31 på vestsida. Skift side i god tid og gå det siste stykket vest for skavlekanten, fram til varden på 1289.',
  description_down = 'Den store renneformasjonen rett nord for toppen er nedkjøringen. Den heter Østrenna og ligger øst for kammen. De øverste to hundre metrene måler 33 til 42 grader, 37 i snitt, og renna er vid nok til nesten å være en flanke — den ligger i le, fylles av fokksnø mens det blåser på toppryggen, og har som regel den beste snøen på fjellet. Vel nede skrår du nordover tilbake på oppstigningsruta.

Vanligste feil: å ta sats utfor skavlen rett fra toppen, og sent på dagen. Den store skavlen over renna slipper i vårsola nesten hvert år, og løsner den, går den i renna du står i. Renna vender øst og får sola først av alt her oppe, så kjør tidlig — og gå inn gjennom det grunne skaret nitti meter nord for varden. Det er det naturlige innsteget, den samme renna du kommer bort i like før toppen.

Vil du ikke inn i renna, kjører du ned nordøstryggen du kom opp. Den er brattest mellom 900 og 800 moh, 24,5 grader i snitt, og er ofte avblåst; regn med hard snø der ryggen er smalest.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta opp',
      'body',  'Nordøstryggen er det slakeste av de dokumenterte linjevalgene på fjellet, men flat er den ikke. Østsida under kammen går i partier over 30 grader mellom 900 og 950 moh, bratteste hundremeteren på selve linja ligger mellom 800 og 900 moh på 24,5 grader i snitt, og bratteste steget måler 33,5. Ryggen er ofte avblåst hele veien opp — det gir hard snø på kammen og fokksnø i lesidene rett ved siden av.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Østrenna ligger øst for kammen nord for toppen og holder 37 grader i snitt over de øverste to hundre metrene, med skavl over hele hodet; lokalkjente regner med at den går hvert år når den største skavlen slipper i vårsola. Skavlene på toppryggen henger ut mot øst, ikke mot vest — det er østsida av kammen som er den bratte, 30 til 41 grader mot 21 til 31 på vestsida. Vest for nordøstryggen faller terrenget 40 til 80 høydemeter per hundre meter ned mot Gjerdelva. Sør for varden ligger flanken på 29 grader i snitt og opp mot 34, sørøstsida på 36 til 39.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lyngen på varsom.no. Ta med sender/mottaker, søkestang og spade. Oppstigningen er ofte avblåst fra skoggrensa og opp, så ha stegjern i sekken.'
    )
  )
where slug = 'kavringtinden';

update public.tk_tours set
  description_up   = 'Fra parkeringa på vestsida av skolen på Fagernes — 20,7 moh på flata, ved E8/fv. 91 i Ramfjorden. Du runder skoleområdet, opp den dyrka marka og inn i skogen med kurs for punkt 459. Beltet fra 100 til 200 moh er turens bratteste, 17,2 grader over 361 meter grunn, og det bratteste sammenhengende partiet ligger her: 25,6 grader mellom 193 og 215 moh. Skogen slutter på 519 moh etter 2,16 km, med åpent område fra 528.

Over skoggrensa svinger du østover langs den naturlige forsenkningen: 16,4 grader fra 500 til 600 moh og 16,3 fra 600 til 700, så flater det ut — 8,5 og 8,4 grader over beltene fra 700 til 900, den brede ryggen andrekildene beskriver. Varden på 871 er der de fleste snur, og utsikten over Ramfjorden er allerede hel.

Vil du videre går det i småkupert terreng mot 912 på vestsida og opp den siste stigningen — 12,8 grader i beltet over 900 — til toppen på 957. Fri Flyts publiserte GPS-punkt leser 956,1 på DTM1, og toppsøket løser 957,3 mot publiserte 957.',
  description_down = 'Ned samme vei. Vestsiden er målt slak — 14,6 grader i snitt over 500 meter med 17,8 som bratteste 60-metersvindu — og forsenkningen og skogen gir jevn kjøring hele veien til den dyrka marka.

Henrikskaret er kildens KAST 3-alternativ fra Fagerelvas utløp, med 30–35 grader mellom 660 og 740 moh gjennom tett skog inn i skardet. Det hører til stabile dager — og det er ikke linja på dette kortet.

Den andre dokumenterte ruta går inn Henrikskaret fra utløpet av Fagerelva: 929 høydemeter på 3,09 km, mot normalrutas 947 på 4,30 — samme fjell på to tredjedeler av lengden. Skaret selv er registerført og leser 596 moh der linja passerer. Fri Flyt setter ruta til KAST 3 – Komplekst mot normalrutas KAST 1, og skriver at det er partier på 30–35 grader mellom 660 og 740 moh; bratteste steget på linja måler 30,0 grader mellom 340 og 360.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, bratteste punkt under 27 grader — og linja holder det: 25,6 grader på det bratteste, i skogen. Over skoggrensa er ryggen bred og slak. Dette er turen for dager da varselet sier at bratt terreng ikke er stedet å være.'
    ),
    jsonb_build_object(
      'title', 'Skavlene',
      'body',  'Kildens faremoment, og målingen sier hvor alvorlig det er: nordøst- og østsiden faller 53,2 og 48,6 grader i snitt, med 71,2 og 70,4 grader som bratteste 60-metersvinduer 60 til 140 meter ut fra toppunktet. Skavlene bygger ut over den kanten. Hold avstand til kanten mot nordøst hele veien langs ryggen — i flatt lys er det den ene regelen turen har.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Fagerfjellet ligger i varslingsregionen Lyngen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen november–mai er Fri Flyts, og tidlig snø er en del av fjellets rykte. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'fagerfjellet';

update public.tk_tours set
  description_up   = 'Fra avgiftsparkeringen i Fjordgård, 48 moh, går du opp veien som heter Segla og videre opp den gamle alpinbakken. Den første halvkilometeren er flat, og stien er fint kloppet der bakken er våt. Ved øvre Fjordgård, 49 moh, står skiltet der den merka stien tar av — det er her turen egentlig begynner.

Stien stiger jevnt gjennom bjørka i Fjordgardlia og over et par bekker, og skogen slipper ved 204 moh. Derfra ligger hele flanken åpen. Bratteste hundremeteren er 300 til 400 moh, og den ligger på 20 grader i snitt: bredt, jevnt og uten brudd.

Ved 440 moh kommer du opp i skaret mellom Hesten og Stavelitippen. Her svinger du vestover inn på østryggen. Den går nesten flatt den første hundremeteren før den begynner å stige, og toppsteget er kort og krast: femti høydemeter på drøye femti meter, rundt 40 grader, stein og klyv. Sett igjen skiene i skaret. Toppen på 556 tas til fots.',
  description_down = 'Ned igjen er samme vei. Fra skaret faller flanken jevnt i fallinja mot Fjordgård, fire hundre høydemeter uten brudd, og du renner ut i bjørka og videre ned den gamle alpinbakken til bilen.

Vanligste feil: å ta på seg skiene på toppen. Rett vest for varden faller fjellet 435 høydemeter på 160 meter — de første seksti på 77 grader — og videre rett i Medfjorden, og østryggen er stein under snøen. Klikk inn i skaret, ikke før.

Den andre feilen kommer i dårlig sikt. Fra skaret heller terrenget nordover også, ned mot Korkedalen, og det er feil side av fjellet. Rett sørover er heller ikke veien hjem: der legger du deg ut på hylla ved Seggelskaret, og under den stuper fjellet 60 grader i Medfjorden. Fallinja mot Fjordgård peker sørøst fra skaret og dreier mot øst under skoggrensa. Følg den, så kommer du ut i bygda av deg selv.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta opp',
      'body',  'Flanken er bred og jevn. Bratteste hundremeteren, 300 til 400 moh, ligger på 20 grader i snitt, og bratteste enkeltsteget på linja måler 31,5. Det er ingen bergbånd på selve linja. Flanken vender sørøst der den er brattest og dreier mot øst lenger nede, så den får sola tidlig på dagen — utpå ettervinteren blir de gode timene korte.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Fra vest rundt til sør finnes det ikke utløp: rett vest for varden går fjellet 435 høydemeter ned på 160 meter og rett i Medfjorden, og sørvest og sør er like bratt. Nordvest er derimot slakt — en rygg som holder seg over 480 moh — så det er vest- og sørsida du skal holde deg fra. Toppknausen og østryggen er eksponert stein, ofte isete. Nord for skaret heller terrenget mot Korkedalen, bort fra bygda.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sør-Troms på varsom.no. Ta med sender/mottaker, søkestang og spade. Toppknausen er ofte islagt, så ha stegjern med hvis du vil helt opp — og vær innstilt på å snu i skaret.'
    )
  )
where slug = 'hesten-segla';

update public.tk_tours set
  description_up   = 'Start på grusparkeringa ved Medfjordbotnvatnan langs Fv862, 102 moh. Følg Keipelva nordover i jevnt stigende terreng til rundt 225 moh. Skogen slipper taket ved 282 moh, og over 297 er du i åpent terreng resten av turen.

Drei mot vestnordvest og følg fjellsida oppover forbi 385 moh. Rundt 470 moh flater det ut i et parti som strekker seg nesten en kilometer med 6 grader i snitt — den eneste pusten på turen — før terrenget stiger inn i den store skåla sør for toppen på rundt 595 moh.

Fra skåla på rundt 595 moh skal du ikke rett nord opp fallinja. Målt rett nordover holder bakken 29 til 36 grader de første 180 meterne, og mellom 713 og 814 moh måler den 38 til 52. Sporet legger seg i stedet østover i stigende skrå til rundt 670 moh og tilbake mot vestnordvest opp på skulderen ved 813 moh; slik holder linja seg under 30 grader. Bratteste hundremeteren på ruta ligger mellom 800 og 900 moh og måler 22,2 grader i snitt; bratteste sammenhengende parti på linja er 28,1 grader.

Fra skulderen følger du ryggformasjonen sørvest for toppen nordover til varden på 938 moh. De øverste hundre høydemeterne er ofte vindherjet og harde. Hold deg på sørsida av ryggen — nordsida faller 60 grader rett under egget, og det er der skavlene henger.',
  description_down = 'Ned samme vei: sørover langs ryggen, ned på skulderen og ut den skrå linja mot skåla, og derfra fjellsida mot Keipelva og parkeringa. Ruta selv måler 28,1 grader på det bratteste. Legger du deg i fallinja rett sør fra skulderen i stedet, står du i det partiet som måler 38 til 52 grader ned til 713 moh, med skåla under som samler alt som løsner.

Vanligste feil: å legge seg for langt nord på ryggen fordi kanten ser ut til å gi bedre snø. Rett nord for toppen faller terrenget 60 grader og deretter 52,5 — skavlene ligger nordover, og de bygger seg opp gjennom hele vinteren. Sørsida ned i skåla er 32 grader, og det er den sida ruta bruker.

Friflyt nevner også en litt brattere variant ned en liten dalformasjon fra ryggen. Den er ikke målt opp her, og sørsida har partier på 38 til 52 grader — velger du den, er det en egen vurdering, ikke den samme som normalruta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Skåla sør for toppen er både løsneområde og utløpsområde, og du må gjennom den både opp og ned. Selve linja er slakere enn terrenget rundt: bratteste sammenhengende parti måler 28,1 grader og bratteste hundremeter, 800 til 900 moh, 22,2 grader i snitt. Det er den skrå føringa østover som gir de tallene. Fallinja rett nord opp fra skåla måler 38 til 52 grader mellom 713 og 814 moh, og den ligger over deg hele veien opp henget.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nordsida av toppen faller 60 grader rett under egget og deretter 52,5, og skavlene henger nordover. Toppryggen skal gås på sørsida. De øverste hundre høydemetrene er ofte avblåste og harde, noe som gjør skavlkanten vanskeligere å lese enn den ville vært i mykt føre.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sør-Troms på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'keipen';

update public.tk_tours set
  description_up   = 'Fra kirka på Skaland, 3 moh, på fv. 862 — hovedveien til Senjahopen og Mefjord, brøytet hele året. Linja følger Dronningstien slik kilden sier, og den er kartlagt: stikjeden fra parkeringa til varden ligger i OSM, og korridoren er festet til den. De første hundre høydemeterne er det bratteste turen har — beltet fra 100 til 200 moh måler 17,1 grader over 335 meter grunn, og det bratteste sammenhengende partiet ligger her: 19,6 grader mellom 124 og 140 moh, 0,63 km ute. Det er altså i skogen, ikke på fjellet, at det bratte er.

Skogen slutter på 209 moh etter Kartverkets klasser, med åpent område fra 221, og skoggrensa kommer alt 0,9 km ute. Over den slakker det av: beltet fra 200 til 300 moh måler 11,0 grader og beltet fra 300 til 400 bare 6,0 over 1 035 meter grunn. Det er den rydda skogstraséen og Sommerdalen, og det er her turen er en spasertur.

Sommerdalhaugen er holdepunktet kilden gir, og den stemmer: prøvepunktet på stikjeden leser 327,6 moh mot de «327 moh» Fri Flyt oppgir. Herfra går ryggen jevnt stigende — 13,9 grader fra 400 til 500 moh og 15,5 fra 500 til 600 — mot toppen.

Varden på 632 moh. Fri Flyt oppgir «785 høydemeter», som er mer enn hele fjellet er høyt; kortet bærer den rutede stigninga på 640. Den siste eggen ut mot toppunktet er ofte avblåst, og da krever den gode forhold — kilden sier det rett ut, og målinga sier hvorfor: nordøstsida faller 36,8 grader i snitt med 71,4 grader som bratteste 60 meter bare 50 til 110 meter ut, og østsida 35,8 grader med 67,9 grader 20 til 80 meter ut.',
  description_down = 'Ned samme traséen. Fri Flyt er utvetydig om alternativene: «Ikke la deg friste å velge annen rute ned fra toppen. Utsatt terreng.» Målingene sier hva han mener — fra varden er bare sørvest, sør og vest slake nok til å kalles kjøring, og nordøst, øst og nord faller 36,8, 35,8 og 28,0 grader i snitt med 71,4, 67,9 og 58,3 grader som bratteste 60 meter.

Kilden nevner én eneste variasjon: rett ned mot sør fra pausesteinen for noen ekstra høydemeter i åpen skog, og så felle på igjen opp til ryggen på Sommerdalhaugen. Sørsveipet fra varden måler 20,2 grader i snitt, så det er reelt — men han advarer selv om at det blir «mye knot tett skog» om du holder fram nedover.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt gir turen KAST 1 – Enkelt og «Bratteste punkt: Under 27 grader», og den ferdige linja holder seg innenfor: ingen hundremeter måler mer enn 17,1 grader i snitt, og bratteste sammenhengende parti er 19,6 grader mellom 124 og 140 moh. Læringspunktet hans er å legge spor under 25–30 grader og lese utløpsområdene gjennom Sommerdalen, og det er nettopp den øvelsen terrenget her er laget for.'
    ),
    jsonb_build_object(
      'title', 'Eggen og skavlene',
      'body',  'Faremomentet Fri Flyt oppgir er «Skavler», og han er presis om hvor: hengeskavler på ryggen mot nord, og «Siste egga ut mot toppunktet er ofte avblåst og krever gode forhold da begge sidene her er bratte.» Målinga bekrefter begge sider — nordøst 36,8 grader i snitt med 71,4 grader som bratteste 60 meter 50 til 110 meter ut, øst 35,8 med 67,9 grader 20 til 80 meter ut, og nord 28,0 med 58,3 grader 60 til 120 meter ut. En egg med det på begge kanter er ikke stedet å være når den er avblåst.'
    ),
    jsonb_build_object(
      'title', 'Utløpsområdene',
      'body',  'Kilden navngir dem: utløpsområder opp mot Litje Brusen og Store Brusen. Registeret har Storbrusen som fjell 1,7 km øst for varden, og de ligger ikke på ruta — men de ligger i det samme fjellsida-systemet, og Fri Flyt ber deg observere dem på vei opp gjennom Sommerdalen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Husfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts egen. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'husfjellet';

update public.tk_tours set
  description_up   = 'Start på rasteplassen i Svarthola langs Fv862, 30 moh, knappe seks kilometer øst for Senjahopen. De første to hundre høydemeterne går rett opp til nordenden av Svartholvatnet på 207 moh, og derfra østover over ryggen mellom vatnet og Breitindvatnet — et parti på rundt 400 moh der linja legger seg flatt før den stiger igjen. Ved Breitindvatnet følger linja nordbredden, over 467 moh og 500 moh, i stedet for å gå rett over isen. Den gjorde det siste inntil nylig: 315 meter på vatnet på 474 moh, opptil 40 meter fra land, under den flanken guiden selv kaller en terrengfelle. Vatnet er naturlig og uregulert, men det finnes ingen skirutebeskrivelse som sender deg ut på det, og her er vatnet så smalt at land ligger 80 meter unna.

Fra nordøstsida av Breitindvatnet på 481 moh begynner vestflanken. Nederst er den slak — rundt 24 grader opp til 550 moh og 29 videre til 620 — men over det bratner den: 36 grader i snitt mellom 620 og 680 moh, 41 mellom 680 og 720, og rett under skulderen måler fallinja 50 til 59 grader. Sommerbeskrivelsen kaller det samme partiet smale og utsatte berghyller, og vatnet ligger under hele henget. Hundremeteren fra 600 til 700 moh måler 22,1 grader i snitt, men den bratteste på ruta er toppblokkas egen, 900 til 1000 moh med 22,7; bratteste sammenhengende parti på linja er 45,9 grader — de siste tretti meterne opp på blokka.

Skiene settes igjen på skulderen sørvest for toppblokka, 763 moh. Derfra til toppen er det 44,4 grader over 249 meter, og eggen over 800 moh måler 54 grader i det bratteste hundremetersvinduet og over 60 i de korteste stega. Det er ikke skispor. De siste 244 høydemeterne er utsatt klyving på sørvestryggen med korte eksponerte parti — hold deg på sørvestsida av kammen. Toppen du står på er den sørøstre, 1007 moh; SSR-punktet som heter Breitinden ligger 0,46 km nordvest og er 24 meter lavere.

Ingen publisert skiruteskildring finnes for Breitinden — kildene beskriver normalruta i sommerform. Innmarsjdalen er den samme uansett, og det finnes ingen annen farbar veg inn fra Fv862, men det betyr at linja over skulderen er terrengmodellens og ikke en gjengivelse av en skrevet skirute.',
  description_down = 'Ned igjen klyver du sørvestryggen tilbake til skulderen, tar på skiene og kjører vestflanken ned til Breitindvatnet. Flanken er den mest alvorlige delen av turen. De første hundre høydemetrene under skulderen er 50 til 59 grader, deretter 36 til 41 ned til rundt 620 moh, og først under det slakner det til 24 til 29. Vatnet ligger som terrengfelle under hele henget.

Vanligste feil: å tro at nordsida er en veg ned fordi den ser kortere ut fra toppen. Nord- og nordøstsida faller 53 til 70 grader rett under egget, og det er der skavlene henger. Fra vatnet følger du oppstigningen tilbake vestover over ryggen til Svartholvatnet og ned til Fv862 — de nederste to hundre høydemeterne er de brattest kjørte på hjemvegen, 17 til 20 grader i snitt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Vestflanken opp fra Breitindvatnet er 24 til 29 grader nederst, 36 til 41 grader over 620 moh, og fallinja rett under skulderen måler 50 til 59 — med vatnet som terrengfelle under hele henget — det er turens skredterreng, og du må gjennom det både opp og ned. Bratteste hundremeter på linja, 600 til 700 moh, måler 22,2 grader i snitt. Over skulderen går ruta over i klyving: eggen måler 54 grader i det bratteste hundremetersvinduet, og 763 moh til toppen er 44,4 grader over 249 meter.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord- og nordøstsida av toppen faller 53 til 70 grader rett under egget, så skavlene ligger der. Hold deg på sørvestsida av ryggen hele veien. Merk også at kildene beskriver denne ruta i sommerform: linja over skulderen er lagt etter terrengmodellen, og over 850 moh skal alt regnes som klyving, ikke skiterreng.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sør-Troms på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'breitinden';

update public.tk_tours set
  description_up   = 'Fra parkeringa langs fv. 862 i Krokelvdalen, 170 moh. Fv. 862 er hovedveien på ytre Senja og er brøytet hele året; registerpunktet for Krokelvdalen ligger 494 meter unna. Fri Flyt oppgir 580 høydemeter, den routede linja stiger 607 — 27 meter i forskjell, og kortet bærer den routede.

Første biten går gjennom småskogen kilden nevner: beltet fra 100 til 200 moh måler 11,6 grader og beltet fra 200 til 300 13,2. Skogen slutter allerede på 317 moh etter Kartverkets klasser, med åpent område fra 331, og skoggrensa kommer 0,63 km ute — en fjerdedel av turen.

Over skogen stiger det jevnt: 17,7 grader fra 300 til 400 moh og 12,3 fra 400 til 500. Ved 465 moh kommer flata kilden beskriver — «Fra 500 moh. flater det litt ut» — og her dreier linja nordvestover inn på ryggen, akkurat slik den sier.

På ryggen ligger det bratteste turen har: 27,1 grader mellom 693 og 714 moh, 2,03 km ute. Fri Flyt skriver «Mellom 600–740 moh. er det partier som er 27–30 grader», og det er dette partiet. Så er det bare sjarmøretappen bort til høyeste punktet — 777 moh på den klatrede cella mot publiserte 779.',
  description_down = 'Ned samme traséen, «med mulige variasjoner etter ønsker og behov», som kilden sier. Det bratteste du kjører er de samme 27,1 gradene mellom 693 og 714 moh, rett under ryggen.

Fra varden er nordvest den klart slakeste sektoren med 6,0 grader i snitt — det er ryggen du kom opp. Vestsida måler 32,2 grader i snitt, nordsida 27,5 med 65,2 grader som bratteste 60 meter bare 30 til 90 meter ut, og nordøstsida 24,1 med 69,2 grader 20 til 80 meter ut. Skillet mellom ryggen og nordsida er sytti grader på under hundre meter.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt gir KAST 1 – Enkelt og «Bratteste punkt: 27-30 grader»; linja måler 27,1 grader som bratteste sammenhengende parti, mellom 693 og 714 moh, og ingen hundremeter holder mer enn 17,7 grader i snitt. Faremomentet kilden oppgir er «Noen små litt bratte», og det er en presis beskrivelse av en linje som er slak i snitt og har et par korte kast.'
    ),
    jsonb_build_object(
      'title', 'Hengene du skal unngå',
      'body',  'Kildens egen advarsel gjelder ikke ruta, men terrenget ved siden av den: «Det finnes noen små heng oppover som er 30–40 grader, så les terrenget godt slik at du unngår disse.» Det er derfor linjevalget er hele øvelsen på dette fjellet — utfordringen er «å kunne legge sporet i terreng under 30 grader», og hengene finnes rett ved sporet som holder seg under.'
    ),
    jsonb_build_object(
      'title', 'Toppen',
      'body',  'Ryggen fra nordvest er 6,0 grader i snitt, og rett nord for varden faller det 27,5 grader i snitt med 65,2 grader som bratteste 60 meter 30 til 90 meter ut; nordøst måler 24,1 med 69,2 grader 20 til 80 meter ut. Toppen er liten og slak, og kantene er nære.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skolpan ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts egen. Ingen uavhengig kilde beskriver ruta; Peakbook bekrefter bare høyden. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'skolpan';

update public.tk_tours set
  description_up   = 'Parker i lomma langs veien gjennom Kaperdalen — Fri Flyt skriver «Fv.232», men veien heter i dag fv. 7862 Kaperdalsveien; lomma leser 236 moh, og kildens 660 høydemeter impliserer nøyaktig denne starten. Skogen slutter tidlig, og terrenget åpner seg mot øst.

Første delen går opp mot det lille skaret nord for punkt 504, slik kilden sier — punktet leser 479 og skaret 582 i terrengmodellen. Lia opp dit bærer det bratteste hundremetersbeltet på turen, 23,4 grader i snitt mellom 500 og 600 moh.

Fra skaret stiger terrenget jevnt mot fortoppen — småkupert, med stigning under 30 grader hele veien, og målingen bekrefter det: 29,9 som bratteste sammenhengende parti. Fortoppen kilden setter på 870 leser 862,9.

Fra fortoppen står det igjen om lag 30–40 høydemeter, sier kilden — målt 36. Den nevner et lite fall over fortoppen; linja her går over skuldra på 862,9 og gir ikke tilbake noe målbart — og varden på 899 har Senjas ytterkyst på den ene sida og Ånderdalen på den andre. I desember er dette mørketidsturen kilden lover: kort, åpen og med hjemvei det ikke går an å rote bort.',
  description_down = 'Ned samme trasé som opp, med variasjonsrom etter ønske, slik kilden sier. Kjøringa vender vest, hjem mot Kaperdalen — Fri Flyts faktaboks sier S-SØ, men normalruta hans går opp fra vest og ned samme vei, og kortet bærer det målte.

Variasjonsrommet har en kant: sørøstsida faller 56,3 grader på det bratteste bare 180–240 m fra varden, og østsida 43,3 på samme avstand. De hører ikke til denne turen — vestflanken du kom opp er kjøringa, og den er åpen og jevn hele veien ned til lomma. Kilden beskriver selv en brattere variant: «det er mulig å legge linjer mer rett sør ned i gryta sørvest for toppen … terreng som er 30–40 grader … vær også obs på at det her er noen klippepartier». Sveipet er enig — sørvest måler 26,7 grader i snitt med 37,0 som bratteste vindu — og klippepartiene er grunnen kilden selv gir for å la den være.

Null høydemeter å gi tilbake og under tre kilometer hver vei: dette er turen der hele dagen er stigning og kjøring, og derfor klassikeren for førstegangs toppturister — og for desemberdager med to timer lys.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt setter KAST 1 – Enkelt med faremoment «ingen spesielle», og målingen er enig for selve linja: 29,9 grader som bratteste sammenhengende parti, 23,4 som bratteste hundremetersbelte mellom 500 og 600 moh. Det er så snilt som en 660-meterstur kan bli — men KAST 1 er en linjevurdering, ikke et fripass: lia opp mot skaret er bratt nok til å gli i hardt føre.'
    ),
    jsonb_build_object(
      'title', 'Kantene',
      'body',  'Alvoret ligger utenfor sporet: sørøstsida faller 56,3 grader på det bratteste 180–240 m fra varden og østsida 43,3 grader på samme avstand. I mørketid og flatt lys er kantene poenget med kompasset — vestflanken du kom opp er eneste kjøresida, og den er grei å finne igjen: ned mot dalen, ikke mot havet.'
    ),
    jsonb_build_object(
      'title', 'Mørketidsturen',
      'body',  'Kilden kaller turen «en flott mørketidstur», og desember–mai er hans egen publiserte sesong. Mørketid er sin egen vurdering: to timer dagslys gir lite margin for feil, og et fjell uten spesielle faremoment i mars kan være et navigasjonsfjell i desember. Kort tur og null tilbakegitt høyde er nettopp det som gjør den rett for de mørke ukene — med hodelykt i sekken likevel.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Tredje Svanfjell ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–mai er Fri Flyts egen. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'tredje-svanfjell';

update public.tk_tours set
  description_up   = 'Fra veienden ved vannbassenget ved Finnelva, 66 moh. Det er den høyeste veienden i dalen, og den forklarer kildens tall: 848 minus 66 er 782, mot de «785 høydemeter» Fri Flyt oppgir. Registerpunktet for Finnelva ligger 170 meter unna.

Første kilometeren er det flate myrterrenget kilden beskriver: beltet fra 0 til 100 moh måler 8,8 grader og beltet fra 100 til 200 bare 8,2 over 720 meter grunn. Skogen slutter på 330 moh etter Kartverkets klasser, med åpent område fra 341, og skoggrensa kommer 1,3 km ute.

Så tar ryggen mot Lonketuva til. Registeret fører Lonketuva som ås på 361 moh, og det er ryggfoten. Beltet fra 200 til 300 moh måler 19,6 grader og beltet fra 400 til 500 20,6 — kilden kaller dette «småkupert med partier på 27–30 grader», og det er de partiene snittet er satt sammen av.

Toppryggen blir gradvis brattere, akkurat som kilden sier, og det korte bratte partiet den lover finnes: 30,0 grader mellom 564 og 588 moh, 2,14 km ute. Fri Flyt skriver «Rundt 550 moh. er det et kort parti som er 30–35 grader» — målingen og kilden peker på de samme tjue høydemetrene.

Over det flater det ut mot varden, slik kilden sier: beltet fra 800 til 900 moh måler 11,6 grader, det slakeste over skoggrensa. 845 moh på den klatra cella mot publiserte 848.',
  description_down = 'Ned samme traséen. Det bratte partiet på 30,0 grader mellom 564 og 588 moh er det bratteste du kjører, og det kommer tidlig i nedturen — 0,9 km før du er tilbake på myra.

Fri Flyts eneste advarsel for toppryggen gjelder skavler: «Vær obs på skavler på toppryggen.» Fra varden er nordvest den slakeste sektoren med 18,8 grader i snitt, mens nordøst måler 34,4, sørvest 33,9 og sør 30,2 — dette er en topp som faller bratt i nesten alle retninger, og ryggen er den ene veien som ikke gjør det.

Fra ryggfoten ved Lonketuva er det myra ut igjen, og turen gir bare 5 høydemeter tilbake underveis.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt gir turen KAST 1 – Enkelt, men oppgir samtidig «Bratteste punkt: 30-35 grader (kort parti)» — og det partiet er reelt: 30,0 grader mellom 564 og 588 moh, 2,14 km ute. Resten av linja er slakere; bratteste hundremetersbeltet er 23,4 grader mellom 500 og 600 moh. Læringspunktet kilden gir er å legge sporet under 30 grader og kjenne igjen enkle terrengfeller, og det korte partiet er der du må gjøre det.'
    ),
    jsonb_build_object(
      'title', 'Toppryggen og skavlene',
      'body',  '«Vær obs på skavler på toppryggen» er kildens egen advarsel, og målingene sier hva som ligger under dem: nordsida faller 23,7 grader i snitt med 56,5 grader som bratteste 60 meter bare 40 til 100 meter fra varden, østsida 31,5 med 54,1 grader, og sørsida 30,2 med 54,0. Den slakeste sektoren er nordvest med 18,8 grader — men ruta går ikke den veien.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Lonketinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts egen, og den skriver at snøen legger seg litt senere på denne delen av øya. Ingen uavhengig kilde beskriver ruta: Fri Flyt publiserer den på to adresser, og begge bygger på Espen Nordahls «Toppturer i Troms». Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'lonketind';

update public.tk_tours set
  description_up   = 'Fra veien til skytebanen på Grøtavær — 81 moh der linja tar til — er det bratt fra første meter: beltet fra 0 til 100 måler 26,0 grader over den korte kneika, før traktorveien i Bjørndalen tar over på 121 moh.

Traktorveien opp Bjørndalen til øvre Bjørndalen på 339 — skoggrensa ligger på 378 etter 2,12 km — og venstre der terrenget flater, på 706 moh slik korridoren står.

Sørsida til topps fra 800: det bratteste enkeltpartiet på linja, 31,4 grader, ligger allerede mellom 351 og 371 moh nede i lia, og beltet fra 500 til 600 er det bratteste i snitt med 21,6. Varden på 857 har Andøya i horisonten.',
  description_down = 'Sørsida er kildens nedkjøring: 30–35 grader. Sydrenna (35–40), østsida med det trange partiet, og nordlinjene Goldfishrenna og Frogman — 45–50 grader og rappell fra skavlen — er variantene for andre dager og andre folk.

Flankemålinga er tydelig på hvor du ikke skal: østflanken måler 66,6 grader og SE 69,3 i sine bratteste vindu, mens V og NV er de slake sidene med 9,1–10,7 i snitt — og sørsida ruta bruker, 12,0.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Sørsida',
      'body',  'Kilden gir nedkjøringa 30–35 grader — skredterreng når snøen er ustabil. Det bratteste enkeltpartiet på modellens linje ligger lavt, 31,4 grader mellom 351 og 371 moh i skogslia — heng som må vurderes også på vei opp.'
    ),
    jsonb_build_object(
      'title', 'Nord og øst',
      'body',  'Goldfishrenna og Frogman i nord måler 45–50 grader og krever rappell fra skavlen; østflanken leser 66,6 og SE 69,3 i sine bratteste vindu. Normalruta har ingen grunn til å nærme seg noen av dem.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Hattfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'hattfjellet';

update public.tk_tours set
  description_up   = 'Fra Dale på 58 moh følger du sommerstien nordover — 294 moh der linja står i den — og passerer Trollvatnet på land på østbredden, 337 moh. Skoggrensa kommer allerede på 311 etter 1,67 km, og beltet fra 300 til 400 måler 4,1 grader over nesten halvannen kilometer vann og myrer.

Opp der terrenget er slakest, mellom høydene på 406, og inn på ryggen fra 587: ryggen reiser seg der, men det bratteste enkeltpartiet på linja, 43,9 grader, er et fall ned i et søkk lenger nord, fra 649 til 615 moh.

Ryggen nordover — 740 moh der korridoren peker mot varden — og sluttpartiet som krever ekstra fokus: ski kan settes igjen, og kilden nevner 30 m tau og litt utstyr for vanskelige forhold. Beltet fra 800 til 900 er det bratteste i snitt med 18,9 grader; varden står på 945.',
  description_down = 'Sør er den slake sida: flankemålinga gir 20,0 grader i snitt der sydryggen kommer, mot 46,1 i nord — med 66,5-vindu 30–90 m ut — og 69,3 mot nordøst. Nedkjøringsvariantene måler 35–40 grader (nordrenna og østsida) og opp mot 50 øverst på vestsida: vurder snøen før valg.

Linja gir tilbake 137 av de 1024 meterne den vinner — undulasjonen langs vannene og ryggen, som også bærer Fri Flyts 1080 høydemeter. Regn hjemturen som kupert: felle av og på langs Trollvatnet og Storvatnet før sporet ned til Dale.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Toppartiet',
      'body',  'Toppstøtet krever ekstra fokus, sier kilden — ski kan settes igjen, og 30 m tau med litt utstyr nevnes for vanskelige forhold. Nordflanken måler 46,1 i snitt og nordøst har et 69,3-vindu: kom fra sør, og bli der.'
    ),
    jsonb_build_object(
      'title', 'Variantene',
      'body',  'Nordrenna og østsida måler 35–40 grader og vestsida opp mot 50 øverst — skredterreng som krever et bevisst valg av dag. Sydryggen, med 20,0 i snitt fra varden, er linja med minst eksponering opp og ned.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Stortussen ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'stortussen';

update public.tk_tours set
  description_up   = 'Fra Dale på 58 moh går sommerstien mot Storvatnet, og linja runder vatnet på land på 274 moh — kilden krysser isen, linja holder land. Myrene nordøst ligger på 262, og beltet fra 200 til 300 måler 3,1 grader over halvannen kilometer nesten flatt.

Nordøst gjennom glissen skog — skoggrensa på 347 etter 2,61 km — og utenom skredterrenget i sørflanken slik kilden ber om: beltet fra 300 til 400 er det bratteste i snitt med 18,9 grader, opp mot lia på 461.

Sørryggen fra 689 er den slakeste inngangen til toppen på 795: det bratteste enkeltpartiet herfra måler 22,4 grader, mellom 679 og 692 moh — rett under ryggfestet. På hele linja er det bratteste 22,8 grader, nede på stien mellom 127 og 146 moh.',
  description_down = 'Første henget i nedkjøringa er brattere enn 30 grader, sier kilden — unntaket på en linje der 20–30-terrenget ellers tar over. SE/S/SV fra toppen, der ruta går, måler 16,6–27,2 grader i snitt.

Vestsida — 30–40 grader sammenhengende — er klassa Komplekst hos kilden og en annen linje. Og NE-flanken måler 67,3 grader i vinduet 400–460 m ut: sørflankens skredterreng har en tvilling mot nordøst. Hold ryggen og skogen du kom opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Sørflanken',
      'body',  'Kilden ber deg unngå skredterrenget i sørflanken på vei opp — linja legger seg nordøst i glissen skog i stedet. Første henget i nedkjøringa er brattere enn 30 grader; resten av linja måler 22,8 på det bratteste enkeltpartiet.'
    ),
    jsonb_build_object(
      'title', 'Nordøst',
      'body',  'NE-flanken måler 67,3 grader i vinduet 400–460 m ut fra toppen — en like alvorlig tvilling til sørflanken. Ruta berører ingen av dem: SE/S/SV, der linja går, måler 16,6–27,2 i snitt.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Litletussen ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'litletussen';

update public.tk_tours set
  description_up   = 'Fra Dale på 58 moh etter sommerstien, og venstre (vest) der terrenget flater på 340 moh — skoggrensa ligger på 364 etter 1,44 km, og beltet fra 100 til 200 måler 14,3 grader gjennom skogslia.

Forbi 342-høyden og inn i den store sørøstvendte lia fra 593: beltet fra 500 til 600 er det bratteste i snitt med 21,8 grader, og det bratteste enkeltpartiet, 25,0 grader, ligger mellom 603 og 624 moh.

Så flater det mot varden på 694 — beltet over 600 måler 14,5 i snitt. Linja gir tilbake to meter på hele turen: opp er opp.',
  description_down = 'Samme lia hjem: 20–30 grader hos kilden, 20,7 i snitt på SE-målinga — kjøring for ferske i godt vær. Stegjern kan være nyttig på skare.

Nybegynnertoppen har voksne kanter: SV og NE måler 35–38 grader i snitt, og ruta går utenom dem slik kilden sier. Hold deg i den store lia — flankene omkring er brattere.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Lia',
      'body',  'Ruta går utenom det meste av skredterrenget, sier kilden, og modellen er enig: 21,8 grader i det bratteste beltet og 25,0 i det bratteste enkeltpartiet. Men sørøstvendt snø får sol tidlig — start tidlig på varme dager.'
    ),
    jsonb_build_object(
      'title', 'Kantene',
      'body',  'SV og NE måler 35–38 grader i snitt — voksne kanter på en nybegynnertopp. I skodde er det flankene du skal vite om: hold retningen på lia og 342-høyden.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Slåttheia ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'slattheia';

update public.tk_tours set
  description_up   = 'Fra den store parkeringa der Tindelva kommer ned ved Iselvmoen på veien mot Fjellstad, 80 moh. Fjellstadvegen er kartlagt som offentlig vei med fast dekke, så starten er brøytet året rundt. Linja går på sørsida av elva, slik begge kildene sier, og følger den kartlagte stien opp den bratte bjørkelia — samme sti ut.no kaller «tydelig og bra, men bratt», og som er skiltet med grønt turskilt fra parkeringa. Beltene måler 18,0 grader fra 100 til 200 moh, 19,0 fra 200 til 300 og 20,7 fra 300 til 400.

Skogen slutter på 558 moh etter Kartverkets klasser, med åpent område fra 568, og skoggrensa kommer 1,93 km ute. Her flater det av: beltet fra 500 til 600 moh måler 13,9 grader og beltet fra 700 til 800 bare 8,4 over 650 meter grunn. Det er hvilesteget ut.no beskriver ved skulderen, og det er stedet å se seg om — nordveggen står rett i front herfra.

Fra 2,93 km og 788 moh går linja innover i gryta under veggen noen hundre meter, slik Fri Flyt sier, før den tar opp på ryggen. Ryggen går på vestsida av veggen, og den går også vest for breen i botnen. Det er ikke en detalj: både Fri Flyt («ryggen som går opp på vestsiden av veggen») og ut.no («til høyre for bekken og breen») sender deg utenom isen, og brepolygonet ligger 898 til 1155 moh rett øst for linja. Nærmeste passering er 14 meter fra brekanten, på 4,27 km og 1152 moh. Linja har 0 meter på breen, kontrollert både mot Kartverkets terrengklasse og mot OSMs brepolygon.

Over 1200 moh reiser ryggen seg jevnt — 17,5 grader fra 1200 til 1300, 21,2 fra 1300 til 1400 og 21,6 fra 1400 til 1500, det bratteste beltet på turen. Det bratteste sammenhengende partiet ligger i samme høydelag: 27,7 grader mellom 1286 og 1304 moh, 4,73 km ute, altså en knapp halvkilometer før varden.

Fri Flyt advarer: «Hold god avstand fra hengeskavlene ut over Nordveggen», og målingen sier hvorfor — nordsveipen fra varden holder 34,8 grader i snitt og 60,9 som bratteste 60 meter bare 50 til 110 meter ut. Varden på 1489 moh, som registeret fører som Vestre Istinden. Siste stykket er ofte avblåst, og da må skiene kanskje bæres — det er kildens egen formulering, og det er den vanligste grunnen til at dagen tar lengre tid enn tallene tilsier.',
  description_down = 'Ned samme ryggen. Merk retningen: de første hundre meterne fra varden går linja vestover, 262 til 276 grader, før den svinger nordvestover ned ryggen — over hele fallet til skoggrensa peker den 344 grader. I skodde er det den første vestlige biten som må sitte, for nordsida av kammen er nordveggen.

Fra varden til skoggrensa er det 931 høydemeter, mot de «omtrent 900 meter» Fri Flyt oppgir ned til skogen. Så er det bjørkelia igjen, den samme du gikk opp, og 26 høydemeter er alt turen gir tilbake underveis.

Fri Flyts vanligste nedkjøring er en annen linje enn denne: renna på 30–35 grader mot sørvest fra toppen. Sørvestsveipen fra varden måler 30,6 grader i snitt over 800 meter, som stemmer med kilden, men bratteste 60 meter i den holder 40,0 grader 60 til 120 meter ut. Den renna er ikke målt som egen rute her, og kortets aspekt gjelder rutas egen nedkjøring. Toppegg-varianten fra Søre Istinden er heller ikke denne ruta — det er bare for den Fri Flyt nevner isøks og stegjern.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyts eget faremoment er presist om hva som er hva: «Skredfare må vurderes nøye på nedkjøringene i botnen mellom Søndre og Vestre Istind og ned fra Søndre Istind. Ryggen opp normalveien er relativt skredsikker. Hold god avstand fra hengeskavlene ut over Nordveggen.» Ruta her er ryggen, altså den delen kilden kaller relativt skredsikker — men «relativt» er kildens ord, ikke en garanti, og botnen den advarer mot ligger 14 meter fra linja på det nærmeste.'
    ),
    jsonb_build_object(
      'title', 'Nordveggen og skavlene',
      'body',  'Nordsveipen fra varden holder 34,8 grader i snitt de første 800 meterne, med 60,9 grader som bratteste 60 meter bare 50 til 110 meter ut; nordøstsida måler 30,5 i snitt og nordvestsida 28,0 med 65,1 grader 190 til 250 meter ut. Skavlene bygger ut over denne kanten, og de er det Fri Flyt ber deg holde god avstand fra. Ryggen er bred nok til å gå, men kanten er ikke der øynene tror når det er flatt lys.'
    ),
    jsonb_build_object(
      'title', 'Breen i botnen',
      'body',  'Botnen mellom Vestre og Søre Istinden bærer en bre — Kartverket klasser den som SnøIsbre, OSM har polygonet way/375260442 mellom 898 og 1155 moh, og ut.no nevner den i veibeskrivelsen. Linja går utenom, vest for den, med 14 meter som nærmeste passering. Den er ikke lagt for å krysse is, og den skal ikke brukes som om den var det: nedkjøring i botnen er det ene stedet Fri Flyt navngir som skredfarlig.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Vestre Istinden ligger i varslingsregionen Indre Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer skisesong for denne turen: ut.nos jul–sep gjelder fotturen, og Fri Flyt har ikke sesongfelt. Kortets feb–mai er derfor redaksjonell. Kortets 5–7 t er pipelinens egen utregning; Fri Flyt oppgir 6–7 timer. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'istinden';

update public.tk_tours set
  description_up   = 'Fra lomma på fv. 8670 Grytøyveien ved Skjellesvika småbåthavn — 6 moh — følger du traktorvegen vestover fra havna: 33 moh der linja står i den, og skoggrensa på 298 etter 1,53 km.

Opp ryggen fra 151 og den store slake østryggen vestover — 617 moh der korridoren er festet. Beltet fra 500 til 600 er det bratteste i snitt med 21,5 grader, og det bratteste enkeltpartiet, 39,0 grader, ligger høyere, mellom 778 og 803 moh under skuldra.

Ryggen fortsetter til varden på 987 — skuldra på rundt 800 underveis er høyden kilden navngir, men terrenget stiger videre uten søkk: NE-målinga, der ryggen kommer, er den slake sida med 15,3 grader i snitt.',
  description_down = 'Samme rygg hjem: hard vindpakket snø er normalen, sier kilden — det er den øksa og stegjerna er for. Store skavler bygger seg over rygglinjene og kan kollapse: gå der du gikk opp, ikke der utsikten er best.

Sydrennene (30–45 grader) er variantene for stabil snø — E har 54,6-vindu 30–90 m ut og S 48,7, det er dit rennene hører. Nordsida mot Skipsdalen er utveien når sørsnøen er usikker.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Sydrennene',
      'body',  'Kilden dokumenterer en dødsulykke i februar 2008 i sydrennene — ett menneske omkom. Rennene holder 30–45 grader og bor i vinduene på 48,7–54,6 fra varden: de krever stabil snø, og nordsida mot Skipsdalen er utveien kilden selv peker på.'
    ),
    jsonb_build_object(
      'title', 'Skavlene',
      'body',  'Store skavler bygger seg over rygglinjene og kan kollapse, sier kilden — på en rygg der hard vindpakket snø er normalen. Hold sporet fra oppturen og avstand til østkanten, som leser 54,6 i sitt bratteste vindu.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skjellesvikgalten ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'skjellesvikgalten';

update public.tk_tours set
  description_up   = 'Fra Dale på vestsida av øya — 58 moh, like før skogsveien starter — følger du skitursporet innover Dalsdalen: skogsveien på 97, dalbotnen på 118, og skoggrensa allerede på 287 moh etter 3,21 km slak innmarsj. De to første hundremeterbeltene måler 1,9 og 3,7 grader: dette er transport, ikke klatring.

Gjennom øvre Dalsdalen på 280 og inn i renna på 453 moh. Kilden gir renna 30–45 grader sammenhengende ned til vann 428; på modellens linje ligger det bratteste enkeltpartiet, 38,4 grader, mellom 587 og 612 moh, og beltet fra 700 til 800 måler 22,7 i snitt.

Renna slipper deg ut på 843 moh, og de siste hundremeterne mot varden på 1009 flater ut — beltet over 1000 måler 13,0 grader. Skjermens 1008,9 mot kildens 1012 er registerets og bokas vanlige avstand på en topp målt før laserskanninga.',
  description_down = 'Ned igjen der du kom opp — og bare der: flankemålingene rundt toppen gir N/NE/E 45,7–49,1 grader i snitt med vindu på 57–66, og SV, den snilleste, 27,8. Renna i vestruta og Syd direkte ligger i flanker som måler 37,9 og 34,7 i snitt; Syd direkte gir kilden 35–50 grader, for stabil snø og presis veivalg.

Vurder snødekket før nedkjøring — terrenget er skredterreng i alle varianter, sier kilden. Renna gir kjøring hele veien ned mot Dalsdalen; under skoggrensa på 287 er det sporet hjem til Dale.

Den andre dokumenterte ruta går opp sørsida fra Vaskinn — 996 høydemeter på 4,63 km, og den mildeste veien på fjellet: bratteste steget måler 34,2 grader mot vestsidas 38,4. Den følger sommerstien opp gjennom skogen langs Vaskinnelva og forbi Vadskinndalsvatnet inn i den søndre bollen. Kilden sier det er lettere å finne linja om du går opp samme ruta som du kjører ned.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Renna',
      'body',  'Kilden gir renna 30–45 grader sammenhengende ned til vann 428 — KAST 3 – Komplekst, med alpinøks og stegjern i lista. Modellens linje måler 38,4 grader på det bratteste, men ei renne samler alt som losner over deg: her er det snøen som bestemmer dagen.'
    ),
    jsonb_build_object(
      'title', 'Toppflankene',
      'body',  'Ingen slak side på Grytøyas konge: N/NE/E måler 45,7–49,1 grader i snitt med vindu på 57–66, og SV 27,8. Skredterreng i alle varianter — og Syd direkte (35–50) er ekspertlinja, ikke denne.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Nona ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'nona';

update public.tk_tours set
  description_up   = 'Fra ferjekaia går linja vestover inn Bjørnrådalen — 190 moh der korridoren står i dalen — i slakt terreng flankert av bratte vegger: beltet fra 0 til 100 måler 5,5 grader, og skoggrensa ligger på 410 moh etter 2,45 km.

Gjennom øvre dalen på 450 og opp på ryggen fra 650: beltet fra 300 til 400 er det bratteste i snitt med 21,0 grader, og ryggene er ofte hard skare — det er her øksa og stegjerna i lista hører hjemme.

Fra skulderen på 757 er det toppstøtet til fots: det bratteste enkeltpartiet på linja, 36,4 grader, ligger mellom 875 og 908 moh rett under varden på 918. Aldri eksponert og bratt, sier kilden — men skavlene skal passes.',
  description_down = 'Samme vei ned: SV-flanken fra toppen, der ryggruta kommer, måler 13,4 grader i snitt, mens E/SE/S måler 33–36 og NV 35,8. S-renna (45 grader øverst), Bollen (30–40) og Østrenna (30–45) er variantene for stabil snø — ikke normalruta.

Kilden dokumenterer en dødsulykke 10. mars 2019 i renna øst for Storelva på Storfjellet: unngå den innerste nordvestbollen, der store skred har gått før. Hold ryggen og dalbotnen hjem til ferjekaia.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ryggene',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt: alpinøks og stegjern for hard skare på ryggene, og skavler ved toppstøtet. Det bratteste enkeltpartiet måler 36,4 grader mellom 875 og 908 moh — til fots, med skiene på sekken.'
    ),
    jsonb_build_object(
      'title', 'Nordvestbollen',
      'body',  'Dødsulykken 10. mars 2019 gikk i renna øst for Storelva på Storfjellet, og kilden ber deg unngå den innerste nordvestbollen der store skred har gått. Variantene S-renna, Bollen og Østrenna (30–45 grader) krever stabil snø.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Trolltinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'trolltinden';

update public.tk_tours set
  description_up   = 'Fra lomma langs fv. 7804 der Storelva renner ut — 9 moh — følger linja traktorveien som snirkler seg sørover fra den gamle skolen: 52 moh der korridoren står i den. Hele ruta er kartlagt som sti i OpenStreetMap, fra veien til 40 meter fra varden, og terrengmodellen langs den gir nøyaktig de 1170 høydemetrene kilden oppgir.

Videre oppover på høyresida — vest — for Storelva: 327 moh, og skogen slipper på 386 etter 1,12 km. Over skoggrensa på 593 og opp på flata ved hytta, 689 moh, der fjellet endelig viser seg. Beltet fra 600 til 700 er det slakeste på hele linja med 8,4 grader over 674 meter grunn — det er flata, og det er der du ser hva du har igjen.

Så renna: 978 moh der korridoren er festet, og beltet fra 900 til 1000 er det bratteste i snitt med 23,5 grader over 244 meter grunn. Det bratteste enkeltsteget, 29,0 grader, ligger mellom 901 og 924 moh — inne i renna. Varden er 1179, og utsikten går til Senja og Dyrøy.',
  description_down = 'Ned renna samme veien. Kilden forteller om en frikjører som kjørte hele renna rett ned under en av Andørjas Freeride-konkurranser; for de fleste er det 30–40 grader jevnt fra toppen, og det ligger vårsnø i renna til mai og juni.

Sørsida er den andre veien ned: nede på flata før Rundtinden finner du den enkleste nedkjøringa sørover, i bratt terreng på 30–45 grader, til veien som stopper ved Vasskaret. Nord og nordøst er ikke en retur — flankesveipet måler 49,2 til 50,3 grader i snitt der, med vinduer på 66,8 og 74,7.

Den andre dokumenterte ruta kommer sørfra, fra veienden ved Holte i Vasskaret — 995 høydemeter på 3,89 km, og 176 mindre å stige enn renna fordi veienden ligger på 204 moh og ikke på 9. Den går opp til flata før Rundtinden og deretter østover langs sørsida av den store vestvendte flanken; bratteste steget er 27,9 grader mot rennas 29,0.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Renna',
      'body',  'Renna er turen, og den er også det som gjør den KAST 3 – Komplekst. Den holder 30–40 grader mesteparten av veien, den samler det som kommer ovenfra, og den har ingen sideflukt: går det, går det der du står. Snøen må være stabil, og alpinøks og stegjern står på kildens liste av samme grunn.'
    ),
    jsonb_build_object(
      'title', 'Fjellsida rundt',
      'body',  'Bare sørvest er mild: 22,1 grader i snitt med 29,6 som bratteste vindu, og vest 30,7 med 37,1 — kildens store vestvendte flanke øverst på fjellet. Nord og nordøst måler 49,2 og 50,3 i snitt med vinduer på 66,8 og 74,7, og øst 62,4 bare 20 til 80 meter ute. Det er én vei opp og ned herfra.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Årbostadtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts, men renna holder vårsnø lenge etter det. Sender/mottaker, søkestang og spade — og alpinøks og stegjern. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'arbostadtinden';

update public.tk_tours set
  description_up   = 'Fra lomma langs fv. 7804 Andørjaveien ved Himmelberget — 175 moh, og kilden oppgir selv vegnummeret — runder linja sør for Klåpvatnet på 177: vatnet passeres på land, og skoggrensa ligger på 359 etter 1,04 km. Kilden advarer: steinete her nede når snøen er tynn — hold til høyre (sør) om dekket ikke bærer.

Sommerruta står i linja på 375, og beltet fra 400 til 500 måler 18,3 grader gjennom den øvre skogslia — det er her kildens parti rundt 40 grader bor i fallinja, mens sporet krysser slakere.

Ryggen fra 674 og opp: beltet fra 800 til 900 er det bratteste i snitt med 21,3 grader, og det bratteste enkeltpartiet, 26,0 grader mellom 806 og 828 moh, ligger rett under den ofte avblåste toppen på 998.',
  description_down = 'Ryggen hjem på 20–30 grader, sier kilden — NV-flanka, der ruta ligger, er den slake målingen med 14,3 grader i snitt. Flott skikjøring og veldig bra utsikt i gode snøvintre, lover kilden.

Sørsida mot Vassmyran ved Vasskarvatnet er varianten: 30–40 grader, brattere og oftest bedre snø. NE og E fra varden faller 47,2 og 37,1 i snitt med vindu på 68,6 og 71,1 — de kantene er ikke til å kjøre, og i skodde skal du vite hvor de er.

Den andre dokumenterte ruta kommer sørfra, fra lomma på Vasskarveien ved Vassmyran — 808 høydemeter på 3,09 km, den korteste linja til denne toppen. Kilden peker på den når vestsida er snau: «hvis man ser på avstand at det er for lite snø på vestsiden, går man heller opp fra sørsiden». Brattere også — 31,7 grader mot vestsidas 26,0.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Skogslia',
      'body',  'Kildens parti rundt 40 grader ligger i skogen — bratt nok til å bære flak, og med steinete underlag som gjør tynt dekke til et føre- og skadeproblem, ikke bare et skredproblem. Hold til høyre (sør) når snøen er tynn, som kilden sier.'
    ),
    jsonb_build_object(
      'title', 'Kantene',
      'body',  'NE-flanka faller 47,2 grader i snitt med et 68,6-vindu og østsida 37,1 med 71,1 rett under varden — toppen er ofte avblåst, og skare mot de kantene er stedet å være våken. Sørsida-varianten (30–40 grader) krever stabil snø.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Klåptinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'klaptinden';

update public.tk_tours set
  description_up   = 'Fra lomma på fv. 7756 Toppsundveien rett før Toppentunnelen — 40 moh; kildens F15 er dagens fylkesveg, fjerde vegnummer-notat i arkivet — går linja opp østsida av Hallevikelva: skoggrensa allerede på 278 etter 0,68 km, og det bratteste enkeltpartiet, 29,2 grader mellom 154 og 179 moh, ligger i den første lia.

Beltet fra 200 til 300 er det bratteste i snitt med 21,1 grader, opp mot 336 der korridoren står i dalsida. Kilden er ærlig om dalen: terrengfeller i Hallevikelva — varianten om Dale og Nonskarvatnan har lavere eksponering.

Sør for Toppskarvatnet på land — 516 moh, tjernet ligger på 489 — og ryggen sørover fra 611 til varden på 759. Beltet over 700 måler 19,9 grader i sluttbakken.',
  description_down = 'Samme vei ned — og hold nord: N-flanka mot Toppskarvatnet er den eneste slake målinga med 12,7 grader i snitt. S, SV og V faller 50,8–56,5 grader i snitt med vindu på 70,4–76,7 — Rakkrenna og sjøklippene, og SV-radialen når helt til havet.

Rakkrenna i sørvest er ekspertlinja: 40–50 grader til havnivå når snøen tillater det, med rappell inn på rundt 500. Det er en annen tur, for andre dager — normalruta går tilbake om Toppskarvatnet.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Hallevikelva-dalen',
      'body',  'Ruta krysser skredterreng, og dalen har terrengfeller — kildens egne ord, og grunnen til KAST 3 – Komplekst. Varianten om Dale og Nonskarvatnan har lavere eksponering og er svaret på dager med usikker snø.'
    ),
    jsonb_build_object(
      'title', 'Sørkantene',
      'body',  'S/SV/V faller 50,8–56,5 grader i snitt med vindu opp mot 76,7 — fjellet stuper i sjøen på tre sider. I skodde er kompasskursen fra varden nord, mot Toppskarvatnet: alt annet ender i Rakkrenna-terrenget.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Toppen ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'toppen';

update public.tk_tours set
  description_up   = 'Fra den lille parkeringsplassen ved Lundenes kirke — 5 moh — går traktorveien langs Forselva innover, og den er kartlagt: linja ligger på vei fra 13 til 184 moh. Beltet fra 0 til 100 moh måler 3,5 grader over 1658 meter grunn, og fra 100 til 200 er det 4,8 over 1134. Den første halvtimen er innmarsj, ikke stigning.

Traktorveien ved Forselva er 47 moh, Storskogbakkan 212. Der tar den virkelige oppstigningen til, og kilden lover at du ikke trenger ta ned hælstøtten på lenge. Over det holder du høyresida — østsida, 364 moh — og trekker gradvis mot venstre, vestover, over 502 og 621. Skogen slipper på 287 moh etter 3,15 km.

Det bratteste hundremetersbeltet måler 20,5 grader mellom 400 og 500 moh, over 246 meter grunn, og det bratteste enkeltsteget, 26,2 grader, ligger mellom 675 og 692. Toppen er 787 på DTM1. Fri Flyt skriver 782, og kortet bærer terrengmodellens tall som overalt ellers.',
  description_down = 'Ned samme sida. Kilden kaller den kontinuerlig mellom 25 og 35 grader, og gir deg valget: øv på store svinger og høy fart, eller ta det rolig og bli lenger. Langs linja måler beltet fra 500 til 600 moh 15,2 grader, 600 til 700 måler 16,0 og 700 til 800 måler 16,5 — sporet selv holder seg slakere enn sida rundt det.

Radialene fra toppen sier hvorfor det er sørsida du kjører. Sørøst måler 16,5 grader i snitt og sørvest 17,7. Nordøst måler 34,3 med et 60,8-vindu bare 100 til 160 meter ute, vest 39,6 med 52,6 på 200 til 260, og nordvest 36,6 med 51,1 på 160 til 220. Den alpine varianten over Nordtinden går der.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Påsken 1969',
      'body',  'Fri Flyt daterer skredet: «I påsken 1969 gikk det skred på vestsiden av Galten sin sydside, to ble tatt av skredet og en mann omkom.» Det er den vestre kanten av den samme sida turen går opp og ned. Vestradialen fra toppen måler 39,6 grader i snitt med et 52,6-vindu 200 til 260 meter ute: sida blir brattere jo lenger vest du kommer, og det er den grensen setningen handler om.'
    ),
    jsonb_build_object(
      'title', 'En sammenhengende flate',
      'body',  'Kilden skriver at nedkjøringa er kontinuerlig mellom 25 og 35 grader. Det er en stor, sammenhengende flate uten rygg eller rabbe til å bryte et flak på, og lengden gjør at det som løsner høyt har hele sida å gå på. Alpinøks og stegjern står på kildens utstyrsliste for dette fjellet, og hard skare på en slik side er grunnen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Lundenesgalten ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det. Den alpine ruta over Nordtinden krever 30 meter tau og et lite sikringsrack i tillegg, og er ikke ruta dette kortet beskriver. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'lundenesgalten';

update public.tk_tours set
  description_up   = 'Fra vegenden på Langnesveien ved Slettneset — 12 moh — går sommerruta sørover: 93 moh der linja står i den, og skoggrensa på 377 etter 1,84 km. Beltet fra 0 til 100 måler 6,0 grader over den første snaue kilometeren.

Høyre (vest) og opp langs Mølnelva utenom de bratte partiene, slik kilden ber om — 380 moh der linja er festet. Beltene fra 100 til 400 ligger jevnt på 15,4–16,4 grader: jevn skinnegang i åpen li.

Ryggen som tar til nord for toppen fra 508: beltet fra 500 til 600 er det bratteste i snitt med 18,5 grader, og det bratteste enkeltpartiet, 28,2 grader mellom 514 og 538 moh, ligger der ryggen reiser seg. Varden står på 630 — og SE-målinga stiger svakt videre: ryggen fortsetter mot Middagsaksla.',
  description_down = 'Normalnedkjøringa går nordøst ned fra toppen og vest for Remmelbergan langs Mølnelva tilbake til Slettneset — heng på 30 grader hører med, og N/NV-flankene måler 17,5–18,0 grader i snitt.

Bjørndalen-varianten — sørvest langs ryggen til Middagsaksla og nord ned — er KAST 3: 30–40 grader først, med utsatt 40-gradersterreng og dokumentert skredaktivitet. SV og V fra varden faller 35–36 i snitt med 58,9-vindu: Mølnelva-sidas kanter.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Alle nedkjøringene',
      'body',  'Det har gått skred på alle nedkjøringene som beskrives her, sier kilden rett ut — naturlig utløste og skiløperutløste, de siste årene. KAST 1-klassa gjelder terrengformen på normalruta; historikken gjelder fjellet. Les varselet som om turen var gradert hardere.'
    ),
    jsonb_build_object(
      'title', 'Vindtransporten',
      'body',  'Sørvest–nordøst-orienteringa gjør at vind fra sørvest laster nordøstsida — nettopp der normalnedkjøringa går. Etter vind er det ferske flaket i nedkjøringa problemet, ikke bratthet: 28,2 grader er det bratteste enkeltpartiet på hele linja.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Middagstinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'middagstinden-andorja';

update public.tk_tours set
  description_up   = 'Fra snuplassen ved Vang — 8 moh — går linja nordover opp elvedalen: 195 moh der korridoren står i dalen, og skoggrensa allerede på 492 etter 1,62 km. Beltet fra 300 til 400 måler 20,9 grader gjennom lia.

Ytterholla — søkket på 497 — og opp holla om snøen tillater det, opp mot skardet mellom Vasskartinden og Skartinden — botnen ligger på 795, linja går over skuldra på 867 uten å gå ned i det. Beltet fra 800 til 900 måler 9,4 grader over flata bak skardet: en halv kilometer pust før sluttstøtet.

Ryggen eller flata østover fra 844: beltet fra 1000 til 1100 er det bratteste i snitt med 24,8 grader, og det bratteste enkeltpartiet, 38,1 grader mellom 869 og 895 moh, ligger der flata reiser seg mot toppartiet. Varden står på 1149.',
  description_down = 'Nedkjøringa er 30–40 grader øverst og 35–40 over Ytterholla — omkranset av 60-graders klipper, sier kilden, og målingen bekrefter dem: NV faller 48,8 grader i snitt med 69,8-vindu, N 45,4 med 63,0. Presis veivalg, særlig i flatt lys.

Linja gir tilbake 52 av de 1193 meterne den vinner — skardet og flata skal krysses begge veier. Vest, der ruta ligger, er den slakeste målingen med 30,8 i snitt, og det bratte vinduet (35,0) kommer først 330–390 m ut fra varden.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ytterholla',
      'body',  'Holla er rutas nålöye: 30–40 grader øverst, 35–40 over Ytterholla, og 60-graders klipper på begge sider — terreng der et lite flak får store konsekvenser. KAST 3 – Komplekst: opp holla bare om snøen tillater det, som kilden selv sier, og samme dom gjelder ned.'
    ),
    jsonb_build_object(
      'title', 'Nord og nordvest',
      'body',  'NV-flanka faller 48,8 grader i snitt med et 69,8-vindu, og N 45,4 med 63,0 — klippene ligger tett på varden. I skodde er skardet på 795 retningspunktet: derfra fører elvedalen hjem uten kanter.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skartinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'skartinden';

update public.tk_tours set
  description_up   = 'Fra snuplassen der Straumbotnveien ender ved Vang — 8 moh — følger du vestsida av Bjørndalselva innover: stien står i linja på 267, og skoggrensa ligger på 435 etter 2,1 km. Beltet fra 400 til 500 er det bratteste i snitt med 21,5 grader, og det bratteste enkeltpartiet, 33,5 grader mellom 496 og 517 moh, ligger i sommerruta opp mot flata.

Over elva og opp sommerruta til flata med det vesle vatnet — 666 moh der linja er festet; vatnet passeres på land. Beltet fra 500 til 600 måler 6,2 grader over den lange flata: pusterommet mellom skogslia og traversen.

Så høyredreining sørover på 800–900 — partiet kilden gir skredhistorikk, og vestflanka måler 39,4 grader i snitt med det bratteste vinduet (52,9) 300–360 m ut fra varden — traversen opp mot 1033-høyden (DTM1 leser 1036,2), og venstre nordover på den store siden til toppen på 1276. De siste 20 metrene kan være avblåst.',
  description_down = 'For det meste 20–25 grader hjem, med parti på 35, sier kilden — samme vei som opp, og sørflanka fra varden er den snilleste målingen med 20,5 i snitt. Traversen på 800–900 er stedet der nedturen krever samme fokus som oppturen.

NE og E måler 30,7–31,1 grader i snitt med vindu på 59,6–66,0 rett under varden — Blåisen- og Langlia-linjene bor der. Storeflaska på nordsiden er vedvarende bratt med parti på 45 grader; Lilleflaska, Rytteran, Rytterrenna og Rytterkløfta er de andre variantene. Alt dette er andre turer enn denne.

Den andre ruta går inn fra Vasskaret i sør: 1148 høydemeter på 6,73 km fra enden av traktorveien, østover mot Mørkevatnet — registerets tjern leser 299 moh der kilden skriver 301, og linja klipper 90 meter av isen på sørenden — og så rett sørover opp Rytterkløfta. Kilden er tydelig på hva det koster: «Kan være mye is første delen så stegjern og øks må tidlig frem men ta med skiene på sekken», og «Sørg for at det er stabile snøforhold når du går opp her siden dette er skredterreng og terrengfelle.» Over kløfta blir det slakere, 30 til 35 grader, til du er på 900 moh; det bratteste 30-metersvinduet på linja er selve sluttstøtet, 37,5 grader mellom 1251 og 1276. Normalruta fra Vang er 1305 høydemeter på 5,59 km med bratteste steg 33,5.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Traversen',
      'body',  'Partiet på 800–900 moh er rutas mest utsatte, med historikk for store skred — kilden sier det, og målingen er enig: vestflanka holder 39,4 grader i snitt med et 52,9-vindu. KAST 3 – Komplekst. Traversen tas én og én på dager med usikker snø, og droppes når varselet peker mot vestvendte heng.'
    ),
    jsonb_build_object(
      'title', 'Kantene',
      'body',  'NE og E faller 59,6–66,0 grader i sine bratteste vindu rett under varden, og toppen kan være avblåst is de siste 20 metrene — øksa og stegjerna i lista er til toppstøtet, ikke pynt. Hold vestsiden og flata på vei ned.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Langlitinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'langlitinden';

update public.tk_tours set
  description_up   = 'Fra den lille asfaltparkeringa ved Fornes, vest for Storelva — 16 moh — går linja opp dalen: 325 moh der korridoren står i den, og skoggrensa på 374 etter 1,66 km. Beltet fra 200 til 300 er det bratteste i snitt med 21,6 grader, i skogslia.

Mot Blåisen fra 659: Blåisen er en isbre, og linja holder moreneterrenget sør for isen — 997 moh der korridoren svinger sørover. Beltet fra 900 til 1000 måler 8,5 grader over morenen.

Passasjen fra 1059: kilden gir den 40 grader, og målingen legger den i NV/V-vinduene på 42,5–48,0 rett under toppen — mens modellens egen linje gjennom aldri måler mer enn 32,5 i noe enkeltparti. Det er forskjellen på fallinja og sporet: passasjen krysses skrått. Varden står på 1186.',
  description_down = 'Samme vei ned: NV og V, der nordruta ligger, måler 14,0 og 11,4 grader i snitt — men med de bratte vinduene rett under toppen, så passasjen tas kontrollert før terrenget åpner seg. Østflanka faller 63,9 grader i vinduet 30–90 m ut: hold vest.

Sørruta er brattere — 30–40 grader og mer skredutsatt, sier kilden — og varianten mot Reintinden på 587 fra Blåisen er en annen linje. Fra morenen er dalen hjem til Fornes ren transport.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Passasjen',
      'body',  'Kilden gir passasjen 40 grader, og den ligger i NV/V-vinduene på 42,5–48,0 rett under toppen — kort, men bratt nok til å bære flak, og med øks og stegjern i lista for skare. KAST 3 – Komplekst: passasjen er stedet der dagen avgjøres.'
    ),
    jsonb_build_object(
      'title', 'Østsida og sørruta',
      'body',  'Østflanka faller 63,9 grader i sitt bratteste vindu, og sørruta (30–40 grader) er mer skredutsatt enn nordruta, sier kilden. Blåisen er en isbre — linja holder morenen sør for isen, og det gjør du også i skodde.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Kråkrøtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'krakrotinden';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved idrettsanlegget og skolen på Ånstad — 44 moh — går linja nordøst over lia på 87 og opp mot myrene på 296. Beltet fra 0 til 100 måler 3,2 grader over den første drøye kilometeren: rolig start på et fjell som ikke er det.

Fra myrene mot Breilifatet — berget på 724 — og skoggrensa på 425 etter 2,4 km. Beltene fra 500 og oppover ligger jevnt på 19,8–23,9 grader: lia opp mot fatet er jevnt bratt hele veien.

Rampa på sørvestsiden fra Breilifatet: det bratteste enkeltpartiet, 38,3 grader mellom 646 og 670 moh, ligger i inngangen til rampa, og beltet fra 800 til 900 er det bratteste i snitt med 23,9. SV-flanka måler 38,4 i snitt — men det bratteste vinduet (52,3) kommer først 270–330 m ut: rampa treffer terrenget der det gir etter. Varden står på 1056.',
  description_down = 'Nedkjøringa er ca. 30–40 grader før skrårenna, som er opp mot 45, sier kilden — Breilifatet-linja krever stabil snø fra første sving. Johammarrenna, renna mellom Ristinden og naboen, holder rundt 45 og er reservevalget; Risenrenna på nordsiden måler også rundt 45.

Østflanka faller 69,3 grader i vinduet 50–110 m ut og NE 60,1 rett under varden — det er dit du ikke skal. Ned samme rampe som opp, og fra myrene er det slake lia hjem til skolen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Rampa og skrårenna',
      'body',  '30–40 grader før skrårenna på opp mot 45 — hele nedkjøringa ligger i skredterreng, og KAST 3 – Komplekst med alpinøks og stegjern er kildens dom. Et fjell uten slak side: alle åtte peilingene måler 26,4–42,3 i snitt. Stabil snø er inngangsbilletten, ikke et ønske.'
    ),
    jsonb_build_object(
      'title', 'Rennene',
      'body',  'Johammarrenna og Risenrenna holder rundt 45 grader, og østflanka faller 69,3 i sitt bratteste vindu — variantene er for erfarne på utvalgte dager. I flatt lys er Breilifatet på 724 retningspunktet ned mot myrene.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Ristinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'ristinden';

update public.tk_tours set
  description_up   = 'Fra idrettsanlegget ved skolen på Ånstad — 9 moh på dyrket mark ved fylkesveien. Du følger veien mot Kvantobotn (91 moh der linja tar av), krysser Kvantoelva og går opp skogen øst for Snøfjellelva: beltene fra 100 til 400 moh måler 7 grader over veien og myrene, så bratner det — 20,9 grader fra 400 til 500 og turens bratteste belte, 22,7 grader over 253 meter grunn, fra 500 til 600, med det bratteste sammenhengende partiet på 28,1 mellom 630 og 648 moh. Skogen slutter på 402 moh etter 4,27 km.

Over skogen passerer linja sør og sørøst for Snøfjellvatnet — på land hele veien; den første løsningen krysset 90 meter av vannet, og omrutingen står i forskningsposten — og tar vestflanken derfra: 15–18 grader i beltene fra 700 til 1000.

De siste tre hundre høydemetrene holder 18–20 grader opp til varden på 1215. Registeret løser 1214,8, og rundt deg står Andørja-traversens tinder — Stortinden, Botntinden, Langlitinden — med fjorden på alle kanter.',
  description_down = 'Vestsiden ned er sporet ditt opp — 20 til 35 grader mot Snøfjellvatnet ifølge kilden, og sørvestsektoren er målt til 15,8 grader i snitt, den slakeste på toppen. Lenger nede venter 30–40 grader med 45-graders parti der linja fra vannet faller mot skogen.

De fire andre navngitte nedfartene — Bananene og Skreddalen, Sydsiden, Nordøstrenna (45–50 grader), Østbratta — henger i kanter som måler 31 til 41 grader i snitt med vinduer på 54 til 63 rett under varden. De er dokumenterte ekspertlinjer med dokumentert skredhistorikk, og de velges dagen etter stabiliteten, ikke omvendt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 3 – Komplekst hos Fri Flyt, alpinøks og stegjern i utstyrslista — og grad 4 på kortet selv om Vestsiden måler 28,1 på det bratteste: nedfarten passerer terreng på 30–40 grader med 45-graders parti, og alt rundt linja er brattere enn linja.'
    ),
    jsonb_build_object(
      'title', 'Skredhistorikken',
      'body',  'Kilden dokumenterer skredhistorikk på de sørvendte hengene og vest for høyde 1018 — på selve normalveiens side av fjellet. Isingen nær tregrensa kommer i tillegg. Dette er en tur der varselet leses før bilen starter.'
    ),
    jsonb_build_object(
      'title', 'Snøfjellvatnet',
      'body',  'Linja holder land sør for vannet. Naturlig vann og vinteris er ordinær ferdsel, men med 1215 meter fjell over deg er bredden det eneste stedet å stå når noe losner høyere oppe.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Snøtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og alpinøks og stegjern, som kilden selv krever.'
    )
  )
where slug = 'snotinden';

update public.tk_tours set
  description_up   = 'Fra den store parkeringsplassen ved starten av Kvæfjordløypene, vest for Bjørklund — 175 moh. Løypa, preparert av entusiastene i Kvæfjordløyper, tar deg innover: beltene fra 200 til 400 moh måler 2 til 6 grader over kilometervis, og skogen slutter på 417 moh etter 6,11 km — mesteparten av turen er løypetur.

Koven passeres på 415 moh — ut.no beskriver samme løype fra Kvæfjordeidet — og ryggen videre mot Storhornet er turens eneste stigning å snakke om: 9,5 grader i beltet fra 500 til 600, med det bratteste sammenhengende partiet på 25,8 mellom 476 og 494 moh der ryggen setter i gang.

Varden på 722 — registeret løser 722,2 — med Kvæfjorden og Gullesfjorden under deg og appelsinen og kvikklunsjen kilden foreskriver på Koven. Ryggen gir tilbake 111 meter underveis, så hjemturen har sine egne små motbakker.',
  description_down = 'Ned ryggen og løypa igjen — sørvendt og solfylt, og med 26,8 grader som det bratteste 60-metersvinduet på hele toppen er dette kjøring for alle føreforhold og de fleste bein.

Kildens ene regel: ikke gå opp i de bratte fjellsidene langs Vikelandselva — det er skredterreng, og løypa holder seg unna dem. Følg den.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Enkelt hos Fri Flyt, og målingen er enig: 9,5 grader i bratteste belte, 25,8 i bratteste parti, og ingen bratt side på toppen. Dette er turen for dager da varselet sier at bratt terreng ikke er stedet å være — og øvingsturen for alle andre dager.'
    ),
    jsonb_build_object(
      'title', 'Vikelandselva',
      'body',  'Kildens navngitte farepunkt: de bratte sidene langs elva er skredterreng. Løypa går ikke i dem, og sporet ditt trenger ikke gjøre det heller — snarveier her sparer minutter og satser resten.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Storhornet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen november–april er Fri Flyts, med tidlig løypestart som en del av fjellets rykte. Sender/mottaker, søkestang og spade — også på løypetur.'
    )
  )
where slug = 'storhornet-kvafjord';

update public.tk_tours set
  description_up   = 'Kilden gir to startsteder. Den nærmeste er en liten parkering ved hyttefeltet, på privat grunn, der kilden ber om godkjenning fra grunneier. Den andre er den store brøytede plassen ved skiløypene 1,5 kilometer lenger vest, med skogsvei over Olaåsen. Linja går derfra — 167 moh — fordi det er den av de to som finnes på kartet. Hyttefeltet ligger 1488 meter unna, som er de 1,5 kilometerne kilden oppgir, og veiene der leser 185 til 203 moh: Fri Flyts 350 høydemeter er regnet derfra, ikke herfra.

Olaåsen er 221 moh, Helgevallan 297. Beltet fra 200 til 300 moh måler 4,9 grader over 1170 meter grunn: over en kilometer nesten flatt gjennom skogen, og det er den skogskjøringa kilden roser på vei ned. Fra Helgevallan går du mot høyde 361, som DTM1 leser til 362.

Skogen slipper først på 419 moh etter 2,33 km, sent på en tur som er 2,85 kilometer lang. Flanken over er 445 moh. Det bratteste hundremetersbeltet måler 15,3 grader mellom 400 og 500 moh, over 344 meter grunn, og det bratteste enkeltsteget, 19,8 grader, ligger mellom 459 og 475. Toppen er 547.',
  description_down = 'Ned samme veien: «fint åpent terreng i starten og det er mulig å holde høy fart i skogen også», skriver kilden. Over skoggrensa ligger de hengene kilden kaller morsomme å leke seg med — de ligger ved siden av linja, ikke på den, og kilden setter et vilkår om forholdene før du oppsøker dem.

Toppflata er flat. Nordvest måler 1,9 grader i snitt over 500 meter og vest 3,8. Den bratteste radialen ut fra toppen er sør med 14,4 grader i snitt og et 29,5-vindu 260 til 320 meter ute, og nordøst 10,4 med 27,6 på 250 til 310.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Sidene, ikke ruta',
      'body',  '«På siden av denne ruten er det skrenter og partier som er skredutsatt så ruta må følges når det er skredfare», skriver Fri Flyt. Det er en instruks om å holde linja, ikke et råd. Målingen viser hvorfor det er lett å bomme: toppflata er nesten vannrett — 1,9 grader nordvest, 3,8 vest — så det finnes ingen helling som styrer deg tilbake på ruta i dårlig sikt.'
    ),
    jsonb_build_object(
      'title', 'To grader på det samme fjellet',
      'body',  'Rute 1.8.1 over Helgevallan og høyde 361 er KAST 1 – Enkelt. Rute 1.8.2, den jevnere nedfarten via den samme høyden, er KAST 2 – Utfordrende og holder 20 til 25 grader hele veien. Samme fjell, samme høyde, ulik linje — og det er den andre kilden henger skrent-advarselen på. Kortet beskriver den første.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Vetefjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'vetefjellet';

update public.tk_tours set
  description_up   = 'Fra den store, alltid brøyta kommunale parkeringsplassen ved starten av Kvæfjordløypene — 167 moh — følger du traktorveien forbi Kvilheim, 214 moh, og går nordover over dyrka mark. Det er et par gjerdekryssinger underveis. Fri Flyt oppgir 400 høydemeter for turen, og det er fra Kvilheim: 613 minus 400 er 213, og Kvilheim leser 214. Beltet fra 100 til 200 moh måler 3,8 grader, og fra 200 til 300 er det 6,1 over 1016 meter grunn: den første kilometeren er nesten flat.

På 285 moh går du på vestsida av Reingjerdhågen og svinger så til høyre, mellom granfeltene. Skogen slipper på 406 moh etter 1,81 km, like under punktet på 413. Over det følger linja den jevne skråninga som også er sommerruta — 543 moh — til toppen på 613.

Det bratteste hundremetersbeltet måler 16,9 grader mellom 400 og 500 moh, over 360 meter grunn. Det bratteste enkeltsteget på hele linja er 19,8 grader mellom 454 og 470, og beltet fra 500 til 600 moh måler 10,5 grader over 496 meter grunn: toppartiet er en flate.',
  description_down = 'Ned samme veien, og kildens egen advarsel gjelder sida: «Området til venstre (vest) er atskillig brattere og må ikke kjøres.» Målt fra toppen er sørvest 14,8 grader i snitt, men med et 33,6-vindu 250 til 310 meter ute, og sør 17,6 med 32,5 på 370 til 430. Det blir bratt der ute, ikke der linja går.

Rutas egen side er den slake: nordøst måler 5,0 grader i snitt, nord 6,7, øst 9,0 og sørøst 10,9. Kilden er ærlig om hva slags topp dette er — «selv om det ikke er en skikkelig tind» — og målingen er enig.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Sida som ikke skal kjøres',
      'body',  '«Området til venstre (vest) er atskillig brattere og må ikke kjøres», skriver Fri Flyt, og målingen finner det. Sørvest holder 33,6 grader i et 60-metersvindu 250 til 310 meter ute fra toppen, og sør 32,5 på 370 til 430 — inne i det spennet der flakskred løsner oftest. Ruta holder seg øst for det hele veien, og det er hele forskjellen mellom denne turen og den ved sida av.'
    ),
    jsonb_build_object(
      'title', 'Grad 1 er et valg om hvor du går',
      'body',  'Linjas bratteste enkeltsteg er 19,8 grader, og ingen del av ruta er brattere. Det tar ikke bort at du har en 33-graders side vest for deg når du kommer opp i beltet mellom 400 og 500 moh. En grad 1 er en egenskap ved sporet, ikke ved fjellet, og den holder bare så lenge du blir på det.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Storlitinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen desember–april er Fri Flyts, og den lengste av de fem i denne runden. Sender/mottaker, søkestang og spade. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'storlitinden';

update public.tk_tours set
  description_up   = 'Fra Indre Forså ved fv. 848 på vestsida av Rolla — 85 moh, med begrenset parkering som krever grunneiers samtykke ifølge kilden; spør først, det er en del av turen. Innover myrene er det flatt: beltene fra 100 til 400 moh måler 2 til 5 grader, og skogen slutter først på 485 moh etter 5,67 km — en lang, stille inngang.

Linja passerer sørenden av Mevatnet i skogen på østsida og følger så østbredden på land — vannet er regulert, og de to omrutingene som skulle til står i forskningsposten. Fra 500 bratner det: 14,8, 20,3 og 21,4 grader i beltene opp mot renna.

Renna sør for toppen er nøkkelen: jevnt 30–40 grader ifølge kilden, og linjas bratteste sammenhengende parti måler 27,8 grader mellom 967 og 991 moh der den skrår inn. Toppen er ofte skavlet — varden på 1020 med Andørja i nord og havet i vest. Registeret løser 1020,0.',
  description_down = 'Ned renna igjen når snøen er stabil — bratt, flott kjøring i terreng som er jevnt mellom 30 og 40 grader, sier kilden, og så de lange, slake myrene hjem. Sørøst- og nordvestsektoren er målt til 24 grader i snitt; renna i vest er 39,9.

Drangen på østsida er den bratteste nedkjøringen uten tvil, sier kilden: starten er over 50 grader — målt 46,6 i snitt med 62,6 som bratteste vindu — og dagen for å kjøre her velges med omhu. Fra denne linja er den en annen tur.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 3 – Komplekst hos Fri Flyt, alpinøks og stegjern, og ei renne på 30–40 grader som normalvei — grad 4 på kortet selv om linjas skrålinje måler 27,8: renna krever stabil snø, og det finnes ingen slak vei opp det siste.'
    ),
    jsonb_build_object(
      'title', 'Skavlen',
      'body',  'Toppen er ofte skavlet, sier kilden. Kanten henger mot øst — mot Drangen-sida, der det måler 62,6 grader i det første vinduet. Varden besøkes fra vest, og i flatt lys med god margin.'
    ),
    jsonb_build_object(
      'title', 'Mevatnet',
      'body',  'Regulert vann — linja holder østbredden på land, og det bør sporet ditt også. Regulert is sprekker langs land når magasinet tappes, og myrene rundt gir tørt land hele veien.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Stortinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og alpinøks og stegjern.'
    )
  )
where slug = 'stortinden-rolla';

update public.tk_tours set
  description_up   = 'Fra Holtet, der traktorveien tar av og går opp til hyttefeltet — 30 moh. Kilden er tydelig på parkeringa: det er få plasser her, så ha en plan, og få godkjenning fra grunneieren. Beltet fra 0 til 100 moh måler 18,8 grader over 214 meter grunn — svingene opp fra fjorden er det bratteste på hele den nedre halvdelen.

Veien er Mevassveien opp til 161 moh og Drangenveien videre fra 225 til veienden på 246, ved Sandvatnet. Beltet fra 200 til 300 moh måler 2,0 grader over 2917 meter grunn: knapt tre kilometer nesten vannrett, først vei og så myr. Ruta går rundt magasinet, ikke over, og så innover myrene til 317 moh nordøst for Skavbakkan.

Derfra tar oppstigninga til, over skoggrensa på 475 moh. Skogen slipper på 426 moh etter 4,36 km. Det bratteste hundremetersbeltet måler 19,2 grader mellom 500 og 600 moh, over 278 meter grunn, og det bratteste enkeltsteget, 24,8 grader, ligger mellom 615 og 635. Så er det ryggen mot Mellatinden — 732 moh — og toppen på 872.',
  description_down = 'Ned samme veien. Kilden lover «flott cruising ned der man kan få høy fart og virkelig nyte sola», og sier i samme åndedrag at nedkjøringa har noen få heng brattere enn 30 grader. Målt langs linja er beltet fra 600 til 700 moh 16,4 grader, 700 til 800 er 17,6 og 800 til 900 er 14,2.

Fra toppryggen kan du fortsette til Mellatinden og videre til Stortinden, sier kilden. Radialen nordover fra varden måler 1,0 grader i snitt over 500 meter, som er hvorfor det er mulig. Øst er den bratte sida: 33,5 grader i snitt med et 56,3-vindu på de første seksti meterne, og det er der Tottålen står.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Tida i utløpssona',
      'body',  '«Man tilbringer noe tid i utløpssone for skred», skriver Fri Flyt om denne ruta, og det er hele begrunnelsen for KAST 3 – Komplekst på et fjell uten øks og stegjern på lista. Linja selv er slak — 19,2 grader i det bratteste hundremetersbeltet — men vestsida over den måler 31,2 grader i snitt med et 38,8-vindu tjue til åtti meter fra varden. Det er ikke hvor bratt du står som avgjør her, det er hva som henger over deg.'
    ),
    jsonb_build_object(
      'title', 'Sandvatnet er et magasin',
      'body',  'Veienden ved hyttefeltet ligger ved Sandvatnet, som NVE fører som magasin 743: høyeste regulerte vannstand 240 moh, laveste 231. Ni meter regulering betyr at isen kan være hul, oppbrukket eller borte, og den ser lik ut ovenfra uansett. Kilden går ikke over vatnet — den sier «gå innover myrene» — og linja her gjør det samme, med null meter på is.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Rundtind ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Østruta fra Selset er ikke beskrevet med en linje i kilden, bare med «bare å velge og vrake» — den er ikke denne. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'rundtind';

update public.tk_tours set
  description_up   = 'Fra den lille parkeringa der skogsveien tar av fra Ibestadveien nær Breivoll småbåthavn — 22 moh — følger du den jevne, fine traktorveien: 48 moh der linja står i den, og krysset på 68 der veien videre velges. Beltet fra 0 til 100 måler 6,0 grader over den første snaue kilometeren.

Der veien begynner å bikke nedover tar du av oppover Skogsheia — 514 moh der linja er festet — og skogen tynnes: skoggrensa ligger på 458 etter 2,11 km. Hold litt til venstre for det bratte terrenget rett fram, som kilden sier.

Så er det nesten rett linje til toppen: lia fra 668, beltet fra 700 til 800 som det bratteste i snitt med 17,0 grader — og det bratteste enkeltpartiet på hele turen, 21,9 grader mellom 771 og 789 moh, rett under varden på 848.',
  description_down = 'Et stort område å boltre seg på, sier kilden — åpen flankekjøring og lett skogskjøring, mye langs samme vei som opp. SE-flanka fra varden, der ruta ligger, måler 14,7 grader i snitt, og det bratteste vinduet (20,5) kommer først 180–240 m ut.

Men M-fjellet har stup rundt hele toppen utenom ruta: de andre kantene måler 24,1–36,4 grader i snitt med vindu på 50–69 tett på varden. Gå ned dit du kom opp — sørøst — før du slipper skiene.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, heng på litt over 20 grader — og modellen er enig: 17,0 i det bratteste beltet, 21,9 i det bratteste enkeltpartiet. Kildens ord om at Sula brukes når skredfaren truer andre topper står som kildens vurdering — varselet leses uansett.'
    ),
    jsonb_build_object(
      'title', 'Kantene',
      'body',  'Utenom ruta har toppen vindu på 50–69 grader tett på varden — NE, SV og V faller bratt fra første meter. I skodde er retningen alt: sørøst fra varden, mot Skogsheia, og traktorveien tar imot.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sula ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — som forrige runde svarer alle toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'sula';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved fotballbanen — 63 moh — går ruta langs venstresida av myra på sti i skogen: 113 moh der korridoren står. Så ut av skogen og opp det åpne feltet der sommerstien går, 205 moh.

Maistua ligger halvveis, på 321 moh. Den var radiolink før, ble pusset opp høsten 2018, og krever DNT-nøkkel; kilden kaller utsikten fantastisk og stedet et moderne avslapningssted uten sidestykke. Det bratteste hundremetersbeltet måler 17,5 grader mellom 200 og 300 moh, over 313 meter grunn, og det bratteste enkeltsteget på hele linja, 24,7 grader, ligger mellom 267 og 282 moh — altså rett under hytta.

Etter det flate partiet ved Maistua skrår ruta opp litt sørover, og skogen slipper på 375 moh etter 1,40 km. Over tregrensa følger du ryggen — 481 moh der korridoren er festet — til varden på 527. Ryggen kan være avblåst og bar eller vindpåvirket, og kilden sier at de fleste derfor stopper et stykke nord for toppen.',
  description_down = 'Samme vei ned, men helt ned langs det åpne feltet, over gjerdet under kraftlinja og gjennom skogen til fotballbanen. Mange går flere runder — kilden beskriver treningsøkter med tre turer på en kveld, feller på og av, og 1200 høydemeter til sammen. Kilden gir to varianter til: østsida av toppen, der snøen er best, ned heistraseen; og en linje sørøstover ned den ryddede sommerstien i Blåbæråsen til barnehagen ved Høgholtet.

Alle tre er KAST 1 og for det meste 20–30 grader. Men kilden er like tydelig på det som ligger utenfor dem: der kan du «enkelt oppsøke heng på 40 grader». Flankesveipet finner dem — nord for varden ligger et 40,6-vindu 170–230 meter ute og nordvest 46,0 på 160–220.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Førti grader, en sving unna',
      'body',  'Heia er et KAST 1-fjell med KAST 3-terreng ved siden av seg. Kilden skriver rett ut at utenfor de tre beskrevne rutene kan du lett finne heng på 40 grader, og at det bare skal gjøres når snøen er stabil. Målinga bekrefter det: 40,6 grader nord for toppen og 46,0 nordvest. De tre rutene holder seg på 20–30.'
    ),
    jsonb_build_object(
      'title', 'Toppryggen',
      'body',  'De siste meterne er ofte avblåste, bare eller vindpåvirkede, og kilden sier at de fleste stopper et stykke nord for toppen. Det er ikke en skredadvarsel, men en forklaring på hvorfor sporet stopper der det gjør — og på godværsdager er varden verdt de siste meterne til fots.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Heia ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen desember–april er Fri Flyts, og den lengste i runden — dette er fjellet som holder snø når byen ikke gjør det. Sender/mottaker, søkestang og spade, også på en kveldstur ti minutter fra bilen. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'heia';

update public.tk_tours set
  description_up   = 'Fra den lille parkeringa øverst i Breivikhaugen — 51 moh, og ikke steng snuplassen — følger ruta skogsveien som grunneierne etablerte i 2016: 154 moh der korridoren står i den. Forbi gapahuken på 220.

Derfra sikter du på skråningen mellom Litle Hinnstein og Hinnstein — 457 moh — som i gamle dager ble brukt til hoppbakke. Litle Hinnstein er et eget registerført punkt og måler 502 moh; det er den lavere av de to.

Så stien opp på sørvestsida av Hinnstein, 531 moh der korridoren er festet, til varden på 560. Skogen slipper først på 496 moh etter 2,51 km — nesten hele turen går i skog. Det bratteste hundremetersbeltet måler 13,6 grader mellom 400 og 500 moh, over 426 meter grunn, og det bratteste enkeltsteget, 23,7 grader, ligger mellom 394 og 408.',
  description_down = 'Kilden er ærlig om starten: nedkjøringa fra Hinnstein gir lite flyt i begynnelsen på grunn av kratt, lite snø og steiner, og mange setter skiene igjen og går ned samme veien. Etter det er det slak cruising i terreng som ikke er brattere enn 30 grader.

Framsida er en annen sak. Sørøst 2 holder 35–45 grader, med det enkleste lengst sør på fjellet og rett ned mot skogsveien. Flankesveipet plasserer resten: nordvest faller 50,5 grader bare 10–70 meter fra varden, nord 44,3 på 30–90 og vest 42,8 på 20–80. Sørvest, der ruta går, er den slake sida med 12,6 grader i snitt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Sørøstsida',
      'body',  'Dette er sida flest kjører, og kildens egen setning om den er at flere er tatt av skred der. Den måler 26,9 grader i snitt med et 40,4-vindu 180–240 meter ute, og Sørøst 2 på framsida holder 35–45. Ingen av tallene er ekstreme; historikken er poenget, og den hører til et fjell femten minutter fra byen.'
    ),
    jsonb_build_object(
      'title', 'Nordvestsida er avskåret',
      'body',  'Toppen har en side som ikke er en vei: nordvest faller 50,5 grader innenfor de første 70 metrene fra varden, og nord og vest 44,3 og 42,8 like tett på. Ruta kommer opp sørvestsida, som er slak — men på en topp så liten er kanten nærmere enn den ser ut.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Hinnstein ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Skogsveien fra 2016 er grunneiernes gave til turfolket — parker der du skal, og la snuplassen være åpen. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'hinnstein';

update public.tk_tours set
  description_up   = 'Fra den vesle parkeringa på nedsida av fv. 848 der Storelva renner ut i havet — 39 moh — går linja opp lia østover: skoggrensa ligger på 327 etter 1,62 km, og beltet fra 0 til 100 måler 4,4 grader langs elva før lia tar til.

Opp lia til 435 og inn på Rollryggen fra 682: beltet fra 500 til 600 er det bratteste i snitt med 24,2 grader, og det bratteste enkeltpartiet, 31,3 grader mellom 565 og 597 moh, ligger i innsteget til ryggen.

Sørryggen mot toppen fra 798 — kjøring for ferske på stabile dager, sier kilden om ryggen, og målinga er enig: Rollryggen fra sør leser 15,0 grader i snitt. Varden står på 896, og N/NV stiger svakt videre — ryggen fortsetter.',
  description_down = 'Samme rygg hjem: 20–30 grader hos kilden. Vestsida mot Brustindvatnet på 629 er den slake varianten; Heimerdalen (30–40) krever mer, og Djupedalen (45–50, ofte skavl som må hoppes) er for erfarne på utvalgte dager.

NE-flanka faller 29,7 grader i snitt med 51,7-vindu 190–250 m ut — det er dit Djupedalen og skavlene hører. Hold ryggen i skodde: kantene mot nordøst kommer før du ser dem.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Skavlene',
      'body',  'Skavler er gjennomgangstemaet på Lasselitinden — Djupedalen-variantene starter ofte med skavlhopp, og NE-flanka leser 51,7 i sitt bratteste vindu. Øksa og stegjerna i lista er for skare på ryggen; avstanden til kanten er din egen.'
    ),
    jsonb_build_object(
      'title', 'Variantene',
      'body',  'Heimerdalen (30–40 grader) og Djupedalen (45–50) er skredterreng som krever stabil snø — Rollryggen på 20–30 er linja som alltid går, og vestsida mot Brustindvatnet er utveien når været stenger ryggen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Lasselitinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — tredje runde på rad der alle toppene svarer til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'lasselitinden';

update public.tk_tours set
  description_up   = 'Fra lomma ved Vebbestadsætran langs fv. 850 — 38 moh — går traktorveien gjennom granfeltet: 359 moh der linja står i den, og skoggrensa ligger på 412 etter 2,39 km. Beltene fra 100 til 300 måler 18,4 og 20,3 grader gjennom skogslia.

Ryggen vest for Vebbestadvatnet fra 418: beltet fra 300 til 400 måler 5,2 grader over en drøy kilometer — velg terrenget med best snødekke over tregrensa, sier kilden.

Sluttbakken: beltet fra 500 til 600 er det bratteste i snitt med 25,2 grader, og det bratteste enkeltpartiet, 34,9, ligger mellom 570 og 592 moh — rett under toppflata på 686.',
  description_down = 'Nordruta hjem er jevn og lett kjøring med parti på 20 grader — fin for ferske, sier kilden, og V/NV-flankene måler 7,8–9,7 i snitt. SV mot Horntindan er flat: 0,5 grader i snitt langs ryggen.

Østsida mot Vebbestadvatnet måler 30,5 i snitt, og nordsida har et 52,7-vindu — vestruta fra Skommesvik holder over 30 grader og er klasset Komplekst. Grad 2-turen er nordruta, og bare den.

Vestsida er den andre ruta: 668 høydemeter på 2,44 km fra lomma ved Gammelgårdsbukta, forbi Skommesvik på 74 moh og opp gjennom lia til T-krysset på kraftlinja, 341. Kilden kaller den «en mye brattere variant enn nordsiden» der «over 30 grader er normalt»; linja her måler 26,2 grader i det bratteste steget mellom 450 og 470 moh og 23,0 i det bratteste hundremetersbeltet mellom 400 og 500. At den blir gått opp og ikke bare ned, står i nabofjellets tekst: Horntindan-ruta åpner «Parker ved Skommesvik, gå opp mot Hemmestadfjellet og deretter ryggen sørover til Horntindan.»',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Sluttbakken',
      'body',  'Det bratteste på linja ligger samlet mellom 500 og 600: 25,2 grader i snitt og 34,9 i det bratteste enkeltpartiet. Kort, men bratt nok til å bære flak — vurder bakken før du går inn i den, og ta ryggen utenom om snøen kjennes usikker.'
    ),
    jsonb_build_object(
      'title', 'Østsida',
      'body',  'Østsida mot Vebbestadvatnet måler 30,5 grader i snitt, og nordsida har et 52,7-vindu. Nordruta ligger vest for vatnet — kanten mot øst er grunnen til at KAST 1-klassen gjelder ruta, ikke fjellet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Hemmestadfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'hemmestadfjellet';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved Hundstadsætran — 20 moh langs fv. 850 Revsnesveien; kildens F83 er dagens fylkesveg — skrått mot Vebbestadelva på 207 og inn på traktorveien: skoggrensa ligger på 346 allerede etter 1,39 km.

Traktorveien opp til Vebbestadvatnet — linja holder land i nordenden, 400 moh — og østover fra 617: beltet fra 400 til 500 måler 7,3 grader over vatnet-platået, før fjellet reiser seg.

Toppflanken fra 854: etter den store steinen blir det brattere — ofte hard skare, og kilden gir partiet 45–50 grader. Det bratteste enkeltpartiet i modellen ligger mellom 650 og 675 moh og måler 31,4; kildens 45–50 bor i NV-vinduet, som måler 41,9.',
  description_down = 'Vestsida er favoritten når sør- og østvendte fjell er avblåst, sier kilden: 30–50 grader ned mot traktorveien vest for Salelva. Vest, der ruta kommer, er slakest på flankemålinga med 24,0 i snitt.

Østlinjene Mellomrenna, Varderenna og Håvards Drøm (30–50 grader) krever stabil snø; NE og E måler 38–39 i snitt med 55,9-vindu rett under varden. Ned samme vei som opp er linja med færrest spørsmål.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Steinen',
      'body',  'Partiet over den store steinen holder 45–50 grader og er ofte hard skare — KAST 3 – Komplekst, alpinøks og stegjern. Et fall her stopper ikke av seg selv: vent på dagen der skara har sluppet, eller snu ved steinen.'
    ),
    jsonb_build_object(
      'title', 'Østlinjene',
      'body',  'Mellomrenna, Varderenna og Håvards Drøm måler 30–50 grader, og NE/E-flanken leser 38–39 i snitt med 55,9-vindu rett under varden. Varden står på kanten av dem — gå ikke lenger øst enn du må.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Middagstinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'middagstinden-kvafjord';

update public.tk_tours set
  description_up   = 'Fra den store parkeringa ved idrettsanlegget — 85 moh — følger du skisporet forbi barnehagen: 89 moh der korridoren står, nesten flatt. Beltet fra 0 til 100 moh måler 1,7 grader, over 675 meter grunn.

Så av sporet sørover der fjellet er nærmest, på åsryggen før Nattmålsfjellvatnet — 237 moh. Skogen slipper på 284 etter 1,68 km. Nærmere tregrensa holder du på høyresida, vestsida, av en liten kolle: 279 moh der korridoren er festet.

Derfra det store åpne området opp mot toppen. De siste hundre høydemeterne går i en slukt som er forlengelsen av elva ned mot sørsida av Nattmålsfjellvatnet — 393 moh der korridoren står i den. Det bratteste hundremetersbeltet måler 15,1 grader mellom 300 og 400 moh, over 392 meter grunn, og det bratteste enkeltsteget, 22,0 grader, ligger mellom 422 og 441. Varden er 546.',
  description_down = 'Ned samme veien. Nedkjøringa er ikke brattere enn 30 grader, sier kilden — men den er omgitt av brattere områder, og du befinner deg av og til i utløpssoner. Det er en annen setning enn «slak», og den er verdt å lese to ganger.

Flankesveipet viser samme bildet: selve toppen er slak til alle kanter — 3,3 grader i snitt mot sørøst, 5,1 mot sørvest, 5,3 mot sør — mens de bratteste vinduene ligger langt ute, 34,5 grader 300–360 meter mot nordøst og 35,3 på 440–500 mot sørøst. Det er dem du kan havne under, ikke dem du står i.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Utløpssonene',
      'body',  'Dette er fjellet der terrengfella ikke er under skia dine, men over dem. Nedkjøringa holder seg under 30 grader og toppen er slak, men rundt ligger brattere områder, og kilden sier at du av og til er i utløpssoner. Målinga finner de bratteste partiene 300 til 500 meter ute på nordøst- og sørøstsida. Vurder hva som henger over sporet, ikke bare hva du står på.'
    ),
    jsonb_build_object(
      'title', 'Nord 2 og resten av nordsida',
      'body',  'Alle andre ruter opp på nordsida enn Nord 1 er KAST 3, sier kilden. Nord 2 går ned bratte slukter og søkk mot det åpne området over lysløypa. På det området ligger Okshola, en om lag 300 meter lang grotte med en elv gjennom seg og en utgang som til vanlig er fylt med vann — verdt et besøk, men ikke en utvei.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Nattmålsfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og på dette fjellet særlig: det har gått skred her, og det ser ikke slik ut. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'nattmalsfjellet';

update public.tk_tours set
  description_up   = 'Starten er servicevegen fra fv. 850 Revsnesveien ved Skommesvik — 22 moh; registerpunktet for garden lå over 250 m fra kartlagt veg, og kilden nevner også parkering ved Gammelgårdsbukta. Opp lia til 469: beltet fra 400 til 500 er det bratteste i snitt med 21,8 grader, og skoggrensa ligger på 396 etter 1,28 km.

Sør for Hemmestadfjellet på 673 og inn på ryggen sørover fra 699 — beltet fra 600 til 700 måler 6,3 grader over nesten en kilometer: ryggen er transportetappen mellom de to fjellene.

Toppstøtet: det bratteste enkeltpartiet på linja, 29,4 grader, ligger mellom 870 og 889 moh rett under varden på 911. SE-flanken der ryggen kommer måler 10,1 i snitt — inngangen er snillere enn navnet.',
  description_down = 'Normalnedkjøringa går nordvest over Hornflata og ned renna — 35–40 grader, og den ender i bekkeformasjon ved tregrensa, sier kilden. NV-flanken måler 12,8 i snitt, men med et 49,4-vindu nær toppen: kjør Hornflata på stabil snø, eller ta ryggen tilbake.

Vestrenna er den bratteste nedkjøringa i området — bare for erfarne, på stabil snø. N/NE-flankene måler 61,8–64,0 grader i sine første vindu: horna er til å se på, ikke å kjøre.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Hornflata',
      'body',  'Normalnedkjøringa over Hornflata og ned renna måler 35–40 grader og ender i bekkeformasjon ved tregrensa — terrengfella kilden selv peker på. KAST 3 – Komplekst: flata og renna henger sammen, og snø som losner over flata samles i renna.'
    ),
    jsonb_build_object(
      'title', 'Horna',
      'body',  'N/NE-flankene måler 61,8–64,0 grader i sine første vindu — det er horna som ga fjellet navn. Ryggen fra Hemmestadfjellet, med 10,1 i snitt fra SE, er inngangen som holder deg unna dem begge.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Horntindan ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'horntindan';

update public.tk_tours set
  description_up   = 'Fra lommene langs Austerfjordveien ved Melåa — 12 moh; kildens F104 heter i dag fv. 7784 — går du nordover langs fylkesvegen, over Melåelva, og tar traktorveien på nordsida av elva der den går inn fra vegen. Kraftlinja krysses på myrene på 171. Beltet fra 0 til 100 måler 3,9 grader over den første drøye kilometeren.

Skogen slutter først på 419 moh etter 3,47 km — rundens høyeste skoggrense — og Tverrelvfoten, åsen på 577, passeres på vestsida slik kilden sier. Beltet fra 200 til 300 er turens bratteste med 14,0 grader; det bratteste enkeltpartiet, 23,9 mellom 242 og 262 moh, ligger i skogslia.

Så åpner det flotte området seg rett opp mot toppen: 650 og 766 moh der linja er festet, og varden på 889. Nordover faller fjellet 49,7 grader mot skaret som skiller det fra 921-kulen — det er et annet fjell, og grensen mellom dem er grunnen til at høyden i boka og høyden på skjermen ikke er samme tall.',
  description_down = 'Sørvendt kjøring på 15–25 grader hele veien hjem — enkel men morsom, sier kilden, og flankemålingen er enig: sørøst og sørvest fra toppen måler 5,6 til 5,8 grader i snitt, sør 13,0. Dette er turen for ferske med litt lengde i beina, og for alle på solblanke marsdager.

Den ene regelen: ikke skyt over toppen. Nord for varden faller fjellet 49,7 grader i vinduet 80 til 140 meter ut, ned mot skaret — i flatt lys er det kanten å vite om på et ellers snilt fjell.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, og terrengmodellen er enig: 14,0 grader i bratteste belte, 23,9 i bratteste parti, og en sørside som måler 13,0 i snitt fra varden. Dette er rundens snilleste linje på papiret — og varselet skal likevel leses, for myrene og lia samler snø fra terrenget over.'
    ),
    jsonb_build_object(
      'title', 'Nordsida',
      'body',  'Toppens ene bratte kant vender nord, mot skaret: 49,7 grader i det bratteste vinduet. Nedkjøringen går sør, og har ingen grunn til å nærme seg den — men i skodde er varden og kanten nærmere hverandre enn kartfølelsen sier.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Tverrfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — alene i runden: de fire andre toppene svarer til Lofoten og Vesterålen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — også på en KAST 1-tur.'
    )
  )
where slug = 'tverrfjellet';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved Bukkemyrvatnet på E6, høyeste punkt på Gratangsfjellet — 424 moh, med Lapphaugen turiststasjon som kildens alternative start lenger nord. Linja krysser 90 meter av Bukkemyrvatnet, aldri mer enn 25 meter fra land: et naturlig vann på 418 moh som kildens egen rute går over — ordinær vinterferdsel, og sagt her fordi det er et vann du står på. Skogen slutter allerede på 476 moh etter 1,03 km.

Nordover mot det bratte og klippete Sølvfjellet går det i småkuler og terrasser: 10,2 grader fra 500 til 600 moh, 14,3 og 16,4 i de neste beltene — følg gamle spor når de finnes, sier kilden, for terrassene skjuler linja i flatt lys. Mellom Sølvfjellet og Spanstinden — 851 moh der linja passerer — åpner den store fonna sørøst for toppen seg.

Fonna tas med den slakeste stigninga til høyre (øst), slik kilden sier: beltet fra 1300 til 1400 måler 18,8 grader, turens bratteste, og det bratteste sammenhengende partiet er 31,0 grader nede mellom 863 og 883. Så de spektakulære siste meterne: varden på 1457 — registeret løser 1457,4 — med fallene på alle andre kanter som kulisse.',
  description_down = 'Ned fonna igjen — sørøstsektoren måler 14,1 grader i snitt over 500 meter med 28,9 i det første vinduet, stor og lesbar kjøring tilbake mot terrassene. Kilden beskriver fire nedfartsvarianter fra lett terrassekjøring til middels krevende via Tjuvhola-botnen mot Moen.

Hold fonna til du er av toppen: nord, nordøst og sørvest faller 44,1, 47,5 og 42,0 grader i snitt, med et vindu på 71,4 grader på nordøstsiden. Det spektakulære og det farlige er samme kant her.

Lapphaugen er ikke bare et alternativ i forbifarten — det er start B i kildens egen veibeskrivelse, og rute 6.8.2 går derfra: «Gå forbi husvognene på campingen og opp gjennom skogen ved toppen av campingen … Etter hvert går du litt på skrå til høyre til du kommer over tregrensen … Snart kommer du opp til et platå under toppen. Gå opp snøfeltet ovenfor platået for å komme til 6.8.1, og toppen.» Fra parkeringa ved turiststasjonen på 350 moh går linja over campingen på 383, opp gjennom skogen på 525, over tregrensa på 852, opp de bratte bakkene på 1004 og inn på platået under toppen på 1159 — der den møter fonna normalruta kommer opp. 1111 høydemeter på 4,80 km mot 1047 på 5,24 km fra Bukkemyrvatnet: mer klatring på kortere linje, og kilden graderer den «Middels vanskelig» der 6.8.1 er «Enkel». Bratteste hundremetersbelte er 19,7 grader fra 700 til 800 moh, og det bratteste 30-metersvinduet 28,5 grader mellom 756 og 776, mot 31,0 på normalruta. Skogen slipper på 576 moh etter 1,33 km. Området der det flate over campingen går over i brattere bakker er skredutsatt, sier kilden — og det er de første høydemetrene av turen, ikke de siste. Denne linja går ikke over noe vann.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkel hos Fri Flyt, og linja måler deretter: 18,8 grader i bratteste belte, 31,0 i bratteste parti. Skredterrenget ligger i de brattere partiene over skoggrensa ved siden av linja — vær varsom der de flate partiene går over i bratte heng, sier kilden.'
    ),
    jsonb_build_object(
      'title', 'Toppkanten',
      'body',  'Alt annet enn fonna er bratt: 42 til 47 grader i snitt mot nord, nordøst og sørvest. De siste meterne er spektakulære fordi kantene er nære — i flatt lys går sporet midt på fonna, og varden besøkes med respekt for hva som er under snøen på kanten.'
    ),
    jsonb_build_object(
      'title', 'Bukkemyrvatnet',
      'body',  'Linja krysser 90 meter av vannet, aldri mer enn 25 meter fra land. Naturlig vann, vinteris, ordinær ferdsel — men et vann er et vann, særlig først og sist i sesongen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Spanstinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no; fjellet står i Narvik-kapittelet hos kilden, men varslet det svarer til er Sør-Troms. Sesongen februar–juni er Fri Flyts. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'spanstinden';

update public.tk_tours set
  description_up   = 'Fra lomma langs Kilbotnveien — 61 moh — til avkjøringa på Nordvikmyra mot Kilbotn, 57 moh. Derfra er instruksen kildens egen: sikt inn mot toppvarden og følg det enkleste terrenget litt sør for toppen. Beltet fra 0 til 100 moh måler 1,5 grader, over 1595 meter grunn — myra tar den første kilometeren nesten flatt.

På senvinteren kan Nordvikelva like ved veien være bred, og kilden foreslår gummistøvler de første hundre metrene og skifte til skisko etter det. Videre gjennom lia mot fjellet, 63 moh, og opp over skogen på 201.

Skogen slipper på 362 moh etter 2,61 km. Det bratteste hundremetersbeltet måler 20,6 grader mellom 400 og 500 moh, over 266 meter grunn, og det bratteste enkeltsteget, 26,1 grader, ligger mellom 487 og 512. Varden er 607 — registeret og kilden er ikke helt enige her, for Fri Flyt skriver 600, og kortet bærer DTM1-høyden som overalt ellers.',
  description_down = 'Nedkjøringa følger om lag samme vei som opp. Kjører du noen hundre meter sørover finner du en bratt renne på om lag 150 høydemeter som kilden mener er verdt turen — men det er en linje, ikke returen.

Grunnen til at ruta går inn litt sør for toppen står i målingen: sør er den slake sida med 5,4 grader i snitt, sørvest 6,6 og nordvest 8,6. Nordøst måler 33,9 i snitt med et 45,3-vindu 180–240 meter ute, og øst 32,4 med 44,7 på 350–410.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Henget som går hvert år',
      'body',  'Kilden skriver at det går skred på det bratteste henget hvert år. Målingen finner det: nordøstsida holder 33,9 grader i snitt med et 45,3-vindu 180 til 240 meter ute — midt i det spennet der flakskred løsner oftest. Ruta går inn fra øst og runder sør for toppen nettopp for å holde seg unna, og det er ikke en detalj å improvisere bort på vei ned.'
    ),
    jsonb_build_object(
      'title', 'Renna sør for ruta',
      'body',  'Noen hundre meter sør for oppstigningen ligger en renne på om lag 150 høydemeter som kilden kaller virkelig verdt å kjøre. Den er en renne: den samler det som kommer ovenfra og har ingen sideflukt. Alpinøks og stegjern står på kildens liste for dette fjellet, og det er her de hører hjemme.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sørvikfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'sorvikfjellet';

update public.tk_tours set
  description_up   = 'Fra lommene ved Melå — 11 moh; traktorveien går på sørsida av Melåelva, i motsetning til Tverrfjellet-turens nordside — og bratt gjennom skogslia først: beltet fra 100 til 200 er linjas bratteste i snitt med 23,7 grader. Skoggrensa ligger på 355 etter 2,58 km.

Traktorveien står i linja på 230 og Dalbotnen på 296 — beltet fra 200 til 300 måler 3,7 grader over halvannen kilometer — så til høyre (sør) mot 505-høyda og forbi den vesle slitne hytta.

Ryggen sørover fra 590, vest for tjernet på 717 — og opp mot varden på 916: beltet fra 800 til 900 måler 22,1 grader, og det bratteste enkeltpartiet, 35,5, ligger mellom 872 og 901 moh. SE-flanken stiger videre: ryggen fortsetter mot 959-toppen, neste fjell i kjeda.',
  description_down = '15–25 grader med noen parti på 30 hjem, og ryggen er ren kjøring, sier kilden — med utsikt over Austerfjorden, Jonsheimen og Gullesfjorden hele veien.

Hold ryggen: østsida mot Austerfjorden er brattere, og ryggen hjemover måler 27,9 grader i snitt de første 500 m fra toppen, med 47-vindu 110–170 m ut. Tjernet på 717 passeres på vestsida, som på vei opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ryggen',
      'body',  'Nedkjøringa holder 15–25 grader med parti på 30 hos kilden, men nærmest toppen måler ryggen 27,9 i snitt med et 47-vindu 110–170 m ut — de bratteste meterne kommer først, og østsida mot Austerfjorden er brattere enn ryggen.'
    ),
    jsonb_build_object(
      'title', 'Skogslia',
      'body',  'Beltet fra 100 til 200 måler 23,7 grader — linjas bratteste snitt ligger nederst, i skogen over Melå. På dager med varsel om flakskred i lavlandet er det lia her som skal vurderes, ikke bare toppen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Melåaksla ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — for første gang svarer alle ti toppene i runden til samme region. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'melaaksla';

update public.tk_tours set
  description_up   = 'Fra den store parkeringa ved DNT-hytta — 212 moh — faller linja mot Storvatnet og følger vestsida sørover: 155, 145 og 140 moh der korridoren er festet. Vatnet er stort, og de 123 høydemetrene du gir fra deg her er halve forklaringen på at kilden oppgir 800 for et fjell som ligger 656 meter over hytta.

Kilden skriver «Gå over Rundfjellvannet», men linja går på land nord for tjernet — samme regel som ellers i appen. Fra sørvestenden av Storvatnet stiger ruta opp bekkedalen på nordsida av høyde 339, som terrengmodellen måler til 337,7. Midt i dalen er ikke en tilfeldig formulering: det er skredterreng på begge sider, og det er den eneste hazard-instruksen kilden gir.

Over Rundfjellvatnet på 300 moh og opp på nordøstryggen — 602 der korridoren står i den. Skogen slipper først på 344 moh etter 4,97 km, den lengste skogsmarsjen i runden. Det bratteste hundremetersbeltet måler 18,5 grader mellom 700 og 800 moh, over 325 meter grunn, og det bratteste enkeltsteget, 23,9 grader, ligger mellom 509 og 529 moh.',
  description_down = 'Samme ryggen hjem. Kilden lover «for det meste 20-25 graders kjøring, men noen partier er 30 grader», og linja holder seg under det hele veien: ingen av beltene måler over 18,5 grader i snitt.

Flankesveipet plasserer det bratte der kilden ikke sender deg: sør for varden ligger et 54,6-vindu 20–80 meter ute og sørøst 50,3 bare 10–70 meter ute. Sørvest er den slake sida med 8,8 grader i snitt. Ryggen nordøstover er ruta, og den måler 20,2.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Bekkedalen',
      'body',  'Kilden ber deg gå midt i bekkedalen nord for høyde 339 for å unngå skredterreng på begge sider. Det er en instruks om plassering, ikke om vinkel: selve dalbotnen er slak, men den ligger mellom to sider som kan levere. Hold midten, og les snøen i sidene før du går inn.'
    ),
    jsonb_build_object(
      'title', 'Toppen har en bratt side',
      'body',  'Nordøstryggen er slak — 20,2 grader i snitt — men sør og sørøst for varden faller fjellet 54,6 og 50,3 grader i sine bratteste vinduer, og sørøst bare 10 til 70 meter fra toppen. På et fjell kilden kaller cruiseterreng er det verdt å vite hvor kanten går.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Rundfjellet ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Turen er lang for graden — nesten sju kilometer inn — så tidspunktet avgjør hvilken snø du møter på returen. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'rundfjellet-harstad';

update public.tk_tours set
  description_up   = 'Fra Y-krysset på 25 moh følger du den vinterstengte veien cirka 4 km innover Kongsvikdalen — linja krysser den flettede Kongsvikelva der veien gjør det, på bruene. Ved Sætran tar du til høyre og nordøstover: over myrene på 262 moh, der beltet fra 100 til 200 er turens bratteste hundremeter med 18,0 grader.

Så kommer rampa: 394 moh der linja tar den, øvre rampa på 502, og skoggrensa på 388 moh etter 5,03 km. Over rampa mot ryggen kan skavlen stå — hold venstre, sør, gjennom partiet, akkurat der det bratteste enkeltpartiet måler 31,0 grader mellom 741 og 768 moh.

Platået på 720 bærer deg de siste meterne til toppen på 976 — registeret løser 976,0 på grensa mellom Kvæfjord og Tjeldsund. Pinakkelen står nord for varden: M3-klyving for den som vil, med 25 meter tau til rappellen — den er utsikten, ikke turen. 66 meter gir du tilbake underveis.',
  description_down = 'Samme vei ned: 15–30 grader hos Fri Flyt, med fin flyt tilbake mot Kongsvikdalen — og fordi fjellet er lite trafikkert er sjansen god for at linjene dine er de eneste der. I pudder er rampa og myrene sammenhengende kjøring nesten til veien.

Sørkanten av platået er grensen å respektere: flankemålingen gir 54,1 grader mot sør og 52,3 mot sørvest — platået slutter brått, og i flatt lys er kanten nærmere enn den ser ut. Nordsiden mot pinakkelen måler 42,3 i sitt bratteste vindu og er heller ingen nedkjøring.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, med alpinøks og stegjern i utstyrslista. Terrenget langs linja er moderat — 18,0 grader i bratteste belte — men skavlpartiet på 31,0 der rampa møter ryggen er stedet dagen avgjøres: hold sør, og snu når snøen sier nei. Grad 3 på kortet.'
    ),
    jsonb_build_object(
      'title', 'Skavlen og sørkanten',
      'body',  'Kildens navngitte farepunkt er skavlen som kan danne seg over rampa — passeres på sørsiden. Sørkanten av platået måler 54,1 grader i flankemålingen; avstand til kanten i dårlig sikt er billig forsikring på et fjell der sporene dine gjerne er de første.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Jakobstinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.'
    )
  )
where slug = 'jakobstinden';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved kraftstasjonen — 13 moh — og rett inn i dalen. Kildens beskrivelse er kort: «følg den bratte dalen som blir brattere og brattere.» Beltet fra 0 til 100 moh måler 11,8 grader over 458 meter grunn, og fra 100 til 200 er det 16,0 over 318. Dalmunnen er 92 moh, dalen 274.

Skogen slipper alt på 333 moh etter 1,16 km, en tredjedel inn på en tur som er 3,37 kilometer lang. På 530 moh flater dalen ut: beltet fra 500 til 600 moh måler 9,6 grader over 542 meter grunn, og det er hylla under det kilden kaller «et brattere parti, nesten som et bånd som går over hele siden».

Her skifter du retning til høyre, sørover, og går opp på ryggen — 617 moh. Derfra følger linja ryggen over 811 til toppen på 1020. Det bratteste hundremetersbeltet måler 21,4 grader mellom 300 og 400 moh, over 267 meter grunn, og det bratteste enkeltsteget, 28,9 grader, ligger mellom 933 og 958.',
  description_down = 'Kildens hovedvei ned er vestsida: «bratt og sammenhengende skikjøring i fantastisk område», det meste mellom 30 og 40 grader. Radialen vestover fra toppen måler 32,5 grader i snitt med et 38,7-vindu 400 til 460 meter ute — kildens egne tall, målt.

Sørsida er den slake med 21,1 grader i snitt, og sørøst 28,2. Nord måler 39,9 med et 62,6-vindu 150 til 210 meter ute, øst 36,3 med 64,4 på 100 til 160, og nordøst 34,9 med 62,2 på 50 til 110. Toppen er avskåret mot nord og øst, og ryggen du kom opp er kanten mellom dem.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Bandet på 600',
      'body',  'Kilden sier det rett ut: «På ca 600 moh kommer man til et brattere parti, nesten som et bånd som går over hele siden.» Instruksen er å skifte retning til høyre, sørover, for å komme lettere opp på ryggen — ikke å gå rett på. Linja gjør det, og derfor måler beltet fra 500 til 600 moh bare 9,6 grader: ruta går rundt bandet, ikke gjennom det.'
    ),
    jsonb_build_object(
      'title', 'En dal som blir brattere',
      'body',  '«Sjekk jevnlig snøen og om den er stabil, forholdene kan endre seg oppover», skriver kilden om oppstigninga. En dal som blir brattere og brattere er et samleområde med voksende fangstflate over deg: det som løsner har én vei ned, og du står i den. Alpinøks og stegjern er på lista, og den harde skaren i et slikt trangt parti er grunnen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Stortinden i Sortland ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade. Sørøstruta fra Langvatnet starter ved et gårdsbruk og krever godkjenning fra grunneier — den er ikke denne. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'stortinden-sortland';

update public.tk_tours set
  description_up   = 'Fra den store parkeringsplassen ved Gausvik kirke — 47 moh — går du mot demningen på 65, krysser elva der forholdene tillater det, og følger østsida av Heimetverrelva oppover, gjennom grinda ved den store furua. Beltet fra 100 til 200 moh måler 14,1 grader, og på 199 moh er skogen allerede bak deg.

Videre er det minst krevende terrenget rett mot toppen: lia på 410, 613 og toppflanken på 725 er punktene ruta er festet i, og beltene imellom holder 9,7 til 13,3 grader — jevn skinning uten ett eneste parti å planlegge rundt.

Det bratteste kommer til slutt: beltet fra 800 til 900 måler 18,0 grader, med turens bratteste enkeltparti — 24,8 grader — mellom 787 og 802 moh. Varden står på 905, registeret løser 905,1, og under deg ligger Tjeldsundet med Sætertinden som nabo over Sagtindene.',
  description_down = 'Samme vei ned, og det er poenget med østsiden: kjøring som passer ferske så lenge du unngår heng brattere enn 30 grader — og på selve linja målte modellen aldri mer enn 24,8. Fin flyt helt til grinda, og løssnø i skogen på gode dager.

Variantene er en annen tur: nordøstvarianten mot Storlægda holder 30–45 grader og krever øks og stegjern, og nordsiden — 35–50 grader, skavl og rappellfeste, med utgang over brua ved pumpehuset ved Haukebøvatnet — er den mest krevende linja på fjellet. Sagtind-traversen mot Sætertinden er eksponert og krever øks, stegjern og tau.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, og målingen er enig: 18,0 grader i bratteste belte, 24,8 i bratteste parti, og en østside som fra toppen måler 8,6 grader i snitt. Regelen fra kilden er enkel — unngå heng brattere enn 30 grader — og normalruta har ingen å tilby.'
    ),
    jsonb_build_object(
      'title', 'Sørsida og variantene',
      'body',  'Flankemålingen viser 56,6 grader i vinduet 70–130 meter ut mot sør og 49,8 mot sørvest — bratt terreng rett utenfor normalruta. Nordøst- og nordvariantene er ekspertlinjer med skavl og rappellfeste, og dagen for dem velges etter snødekket, ikke etter kalenderen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Haukebøtinden ligger i varslingsregionen Sør-Troms, en A-region med daglig skredvarsel — alene i runden: nabotoppene over Sagtindene svarer til Lofoten og Vesterålen. Sjekk varsom.no. Sesongen desember–april er Fri Flyts, den lengste i runden. Sender/mottaker, søkestang og spade — også på en KAST 1-tur.'
    )
  )
where slug = 'haukebotinden';

update public.tk_tours set
  description_up   = 'Fra Våtvoll ved fv. 85 langs Gullesfjorden — 5 moh, parkering i lommene langs veien slik kilden sier. Opp Kobberyggen: beltet fra 0 til 100 måler 8,9 grader og skogen slutter på 378 moh etter 2,30 km, før ryggen gir tilbake det første søkket — 86 meter ned til 335 før Geitryggen tar over.

Geitryggen er turens rygg: 20,5 grader i beltet fra 500 til 600, flatt over 600, og så jevn stigning — 21,0 grader fra 800 til 900, turens bratteste belte — mot toppryggen. Undulasjonen er grunnen til at kortet bærer 1400 høydemeter for en 1118-topp.

Toppryggen er alvoret: eksponert travers med skavler og skredterreng mot Litjedalen, der ryggen reiser seg mot varden; linjas bratteste parti ligger lenger nede, 37,9 grader mellom 331 og 357 moh i steget opp på Kobberyggen. Isøksa og stegjerna er for disse meterne; turrapportene kaller det klyving. Registeret løser 1117,4 mot publiserte 1118.',
  description_down = 'Ned samme vei — ryggene tilbake med motbakkene i revers; sørsektoren fra toppen måler 18,9 grader i snitt, men med et 60-metersvindu på 60,5 grader bare 20 til 80 meter ut: traversen har vegg på begge sider, og sporet ned er sporet opp.

Vestrennene (30–50 grader) er terrengfeller ved ustabilitet, sier kilden, og Norddalen på nordøstruta krever egen stabilitetsvurdering. Ingen av dem er linja her.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 3 – Komplekst hos Fri Flyt. Ryggene er snille — 21 grader på det bratteste beltet — og alt alvor er samlet i toppryggen: skavler og vegg på begge sider av traversen — linjas bratteste 30 meter, 37,9 grader, ligger lavt på Kobberyggen. Grad 4 på kortet.'
    ),
    jsonb_build_object(
      'title', 'Toppryggen',
      'body',  'Skavlene og skredterrenget mot Litjedalen er kildens egne ord. Sidene måler 60,5 (S) og 64,1 (SØ) grader i de første vinduene fra varden — traversen gås med isøks i hånd og god margin til kanten, og i flatt lys venter den på bedre sikt.'
    ),
    jsonb_build_object(
      'title', 'Opp-og-ned-regnskapet',
      'body',  '255 meter gis tilbake på ryggene — det er 255 meter som skal klatres igjen på hjemveien. Regn timene deretter: kilden gir 6–7, og de er ærlige.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Reinspælen ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — Kvæfjord-fjella svarer til det varselet, ikke til Sør-Troms. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og isøks og stegjern.'
    )
  )
where slug = 'reinspalen';

update public.tk_tours set
  description_up   = 'Fra den store parkeringsplassen ved Sandtorg idrettsanlegg — 15 moh, og rundens eneste startplass med kartlagt parkering i OSM — følger du traktorveien på sørsida av Årbogelva, 63 moh der linja bruker den. Skogen slutter allerede på 348 moh etter 2,86 km; beltet fra 200 til 300 moh måler 5,2 grader, så innmarsjen er slak.

Årbogvatnet passeres på sørsida — vatnet ligger på 258 moh og er Innsjø i terrengmodellen, og linja holder land hele veien. Så tar østryggen over: 522 moh der ruta står på den, forbi nødbua — linja passerer den på 653 — og videre til 785. Fra 500 moh er ruta staket, og de siste 200 høydemetrene følger telefonstolpene til sambandsanlegget.

Beltet fra 800 til 900 måler 20,5 grader og beltet fra 900 til 1000 er turens bratteste med 21,2 — det bratteste enkeltpartiet, 26,9 grader mellom 827 og 850 moh, ligger der ryggen reiser seg mot platået. Varden og de låste sambandsbyggene står på 1095 — registeret løser 1094,9 — og dronefoto er forbudt på toppen etter NSM-regelverket. Ryggen gir bare tilbake 36 meter på hele turen.',
  description_down = 'Samme vei ned: 15–25 grader i hovedsak hos Fri Flyt, og målingen bekrefter at ingen hundremeter langs linja passerer 21,2 i snitt. Med staking og stolper er dette turen som går i flatt lys — men ryggen er vindutsatt, og hard skare kan gjøre stegjern kjekt å ha.

Hold ryggen. Ved nedkjøring til venstre — nord — er to personer gravd fram av skred, i 2017 og i 2019. Sørrenna med sine nesten 1100 sammenhengende metre mot havet og vestrennene er komplekse ekspertlinjer med egen snøvurdering, og de er ikke denne ruta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, og terrengmodellen er enig: 21,2 grader i bratteste belte, 26,9 i bratteste parti. Flankemålingen fra toppen viser de slake sidene mot nord, nordvest og vest — og 60,1 grader i sørøst, der ekspertlinjene bor. Normalruta holder seg på den snille siden av det skillet.'
    ),
    jsonb_build_object(
      'title', 'Nordsida',
      'body',  'De to dokumenterte hendelsene på fjellet — gravd-fram i 2017 og 2019 — kom begge ved nedkjøring nord for normalruta. Små vannspeil kan stå åpne i søkkene om våren. Ryggen er svaret i begge tilfeller: den er staket fordi den er linja.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sætertinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — grensetoppen over Tjeldsundet svarer til det varselet, ikke til Sør-Troms. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og stegjern på skaredager.'
    )
  )
where slug = 'satertinden';

update public.tk_tours set
  description_up   = 'Fra Y-krysset — 25 moh, cirka 150 meter før bommen — følger du den vinterstengte veien innover Kongsvikdalen, ofte med skuterspor å gå i. Linja krysser den flettede Kongsvikelva der veien gjør det, på bruene. Ved Sætran på 57 moh tar du av østover etter sommerstien, og stigningen begynner: 186 moh der linja står i den.

Lia sørøstover er turens bratteste enkeltparti — 31,6 grader mellom 291 og 310 moh, i skogen — og skoggrensa kommer på 317 moh etter 5,43 km. Så legger sørkonturen seg til rette: sør for tjernet på 278, gjennom senkninga på 387 — tjernet på platået er Innsjø i terrengmodellen, og linja holder land sør for det.

Fra senkninga reiser toppflanken seg: 763 moh der ruta står i den, med beltet fra 500 til 600 som turens bratteste hundremeter på 17,9 grader. Toppen løser 980,1 — toppsøket klatret 60 meter fra registerpunktet til den høyeste cella — og under deg ligger hele Tjeldsundet, med Sætertinden rett over sundet.',
  description_down = 'Nordsiden ned er grunnen til å gå her: 20–25 grader i hovedsak hos Fri Flyt, med to brattere partier på 30 — og skjermet pudder når de andre himmelretningene er avblåst, som er akkurat de dagene øksa og stegjerna i sekken gjør nytte for seg på den harde flanken opp.

Sørøstsida er skredsida: flere store skred årlig på 30–40 grader, og kilden er utvetydig — den skal ikke kjøres, det finnes tryggere bratt i nærheten. Flankemålingen er enig: 51,0 grader i det første vinduet fra toppen mot sørøst. Vestrenna er ekspertlinja for stabile dager, med øks og stegjern og nedkjøring nordsiden.

Den andre dokumenterte ruta går opp Østsia fra bensinstasjonen i Kongsvik — 923 høydemeter på 4,36 km, under halve normalrutas lengde, opp scootersporet i Håkadalen og den store skrårampa. Kilden beskriver den nedover og legger til at du selvsagt kan gå opp den også; det meste er 20–30 grader, med bratteste steg 30,9.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, og det er ikke helningen som bærer klassifiseringen — bratteste belte langs linja måler 17,9 grader — men fokksnøen og isingen nær toppen som setter alpinøks og stegjern i utstyrslista, og det bratte partiet på 31,6 i skogslia. Grad 3 på kortet, Gråfjell-regelen.'
    ),
    jsonb_build_object(
      'title', 'Sørøstsida',
      'body',  'Kildens navngitte skredside, med flere store skred årlig — og flankemålingen gir den 51,0 grader i første vindu og 39,5 i snitt. Nedkjøringen går nordsiden, og toppskavlene over sørøstsida er en grunn til å holde avstand fra kanten i flatt lys.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Kongsviktinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.'
    )
  )
where slug = 'kongsviktinden';

update public.tk_tours set
  description_up   = 'Fra den store parkeringsplassen ved Dalelvas utløp — 5 moh — går du først som mot Taraldsviktinden, og tar så traktorveien opp Norddalen: 219 moh der linja står i dalen, skoggrensa på 307 etter 1,34 km, og 412 øverst i dalen. Det bratteste enkeltpartiet, 27,5 grader mellom 284 og 307 moh, ligger her.

Marsslottfjellet — registerets skrivemåte, med to s-er — er turens karakter: langstrakt og åpent, 632 moh der linja tar det og 798 der ryggen svinger sørvestover. Beltet fra 500 til 600 måler 10,0 grader og beltet fra 700 til 800 10,1 — kilometervis med jevn skinning.

Ryggen sørvestover passerer 855, toppflanken leser 938, og varden står på 980 — registeret skriver Snytinden og løser 979,7. Bare 4 meter gir du tilbake på hele turen, og beltet fra 900 til 1000 måler 13,7 grader inn mot toppen.',
  description_down = 'Samme vei ned, og det er poenget med nordøstsiden: bare tre heng på rundt 25 grader i hele nedkjøringen, sier kilden — og målingen er enig: ingen hundremeter over 21,7. Flyt over Marsslottfjellet, og fart helt ned Norddalen når skogen har snø.

Sørvestsiden — om Snytindlemman mot Revskarvatnet og over Bollfjellet, alle tre registerets navn — er den krevende varianten med egen snøvurdering. Flankemålingen gir sørøstsida 49,8 grader og sørvest 42,7; hold deg på ryggen du kom opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, og terrengmodellen er enig: 21,7 grader i bratteste belte — i skogen lavt på turen — og 29,0 i bratteste parti. Oppe på Marsslottfjellet er det slakere enn noe annet fjell i rundelen. Stegjern kjekt å ha på skaredager, sier kilden.'
    ),
    jsonb_build_object(
      'title', 'Sør- og østsidene',
      'body',  'Flankemålingen fra toppen gir 49,8 grader mot sørøst og 42,7 mot sørvest — de bratte sidene vender bort fra normalruta, mot Snytindlemman og Revskarvatnet. Nord og nordvest, der ruta går, måler 11,6 til 12,1 i snitt.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Snøtinden i Tjeldsund ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts, og kildens 7–8 timer gjør dette til rundens lengste dag tross korte kilometer. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'snotinden-tjeldsund';

update public.tk_tours set
  description_up   = 'Fra den store parkeringsplassen ved Dalelvas utløp — 5 moh, E10 krysser elva på Dalelvbrua like ved — følger du traktorveien øst for Gårdselva: 56 moh der linja tar den, 107 lenger opp. Kilden sier av veien omtrent 150 meter før kraftlinja krysser; alternativet ved Sjøvoll krever grunneiers samtykke, så bruk plassen ved elva.

Så bærer det til høyre og opp: mellom vegetasjonen på 241, mot Mølnskaret på 360 — skogen slutter på 368 moh etter 2,88 km — og inn i selve skaret på 538, der registeret har navnet og ryggen begynner.

Nordryggen sørover er turens finale: 669 moh der linja står på den, beltet fra 600 til 700 er turens bratteste med 19,0 grader i snitt, og det bratteste enkeltpartiet — 22,9 grader — ligger mellom 624 og 643 moh. Toppen løser 775,8 mot publiserte 777; varden på 774 som kilden nevner står på vestsida.',
  description_down = 'Samme vei ned: i hovedsak 15–25 grader hos Fri Flyt, med to partier på 30 og et ryggparti på 30 — det er de partiene som setter isøks og stegjern i sekken, for på hard fokksnø er ryggen et annet fjell enn i løssnø. Linja langs ryggen måler aldri mer enn 22,9, så det bratte er valgfritt, ikke obligatorisk.

Østsiden med Tunellen — 30–40 grader ned mot steintunnelen på rundt 450 moh — er ekspertlinja med utløpssoner å regne med, og vestsiden forbi 774-varden har sitt eget parti over 30. Begge er en annen dag og en annen snø enn normalruta.

Den andre dokumenterte ruta tar østsida fra båthamna i Kongsvik — 792 høydemeter på 4,94 km, forbi Tunellen på 453 moh, den kilden setter til «ca. 450». Den er brattere enn nordryggen: 33,5 grader i bratteste steget mot 22,9, og over Tunellen ligger 30–40 grader. Kilden sier selv at du kan gå opp den for å se Tunellen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, og det er ryggen som bærer klassifiseringen: kilden gir ryggpartiet 30 grader, terrengmodellen måler den slakeste linja langs den til 22,9. Begge tallene står her, for det er avstanden mellom dem som er marginen din når snøen er hard.'
    ),
    jsonb_build_object(
      'title', 'Øst og sørøst',
      'body',  'Flankemålingen fra toppen viser 53,3 grader mot øst og 60,5 mot sørøst — Tunellen-sida er bratt fra første meter, og sørvest er den eneste slake kanten med 5,5 grader i snitt. Nedkjøring østover er en stabilitetsvurdering, ikke en snarvei.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Taraldsviktinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og isøks og stegjern for ryggen, som utstyrslista sier.'
    )
  )
where slug = 'taraldsviktinden';

update public.tk_tours set
  description_up   = 'Fra den store parkeringsplassen ved rundkjøringa — 49 moh — går du vest rundt botn, forbi parkeringa på vestsida, og gir fra deg 46 meter ned mot fjæra før ryggfoten tar imot på 75. Skogen slutter allerede på 125 moh etter 2,77 km — det meste av skituren er over tregrensa.

Ryggen nordover er førsteakten: 289 moh der linja står på den, med beltet fra 100 til 200 på 20,5 grader. Før det brattere partiet svinger du vest inn i renna på 376 — og det er her fjellet viser seg: beltet fra 500 til 600 måler 24,1 grader, med turens bratteste enkeltparti, 31,1, mellom 542 og 563.

Renna leverer deg på platået vest for 685-høyden — 475 moh der linja tar det — og traversen vestover passerer 793 før varden på 930; registeret løser 929,9. 92 meter gir du tilbake underveis, fjæra rundt botn medregnet.',
  description_down = 'Samme vei ned er normalen: 25–40 grader hos Fri Flyt, og renna krever den samme snøen ned som opp. De tre andre — nordsiden med parti på 30–40, vestsida mot Løbergsdalen på 30–40, og Karirenna — er grunnene til at fjellet står i denne boka.

Karirenna mot nordøst er ekspertlinja: 45–50 grader med stor steinsprangfare i øvre del, og kilden krever stabil snø med god fylling. Flankemålingen gir nordøstflanken 50,3 grader — dagen for den velges med omhu, og den velges sjelden.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Komplekst hos Fri Flyt, og målingen forklarer hvorfor: ingen av toppens åtte kanter måler under 21,5 grader i snitt, og normalruta selv holder 24,1 i bratteste belte med renna på 31,1. Alpinøks og stegjern i utstyrslista. Dette er rundens alvorligste fjell — grad 4.'
    ),
    jsonb_build_object(
      'title', 'Renna og skavlene',
      'body',  'Renna i normalruta er terrengfella på oppturen: bratt nok til å skli, samlende nok til å begrave. Gå den én og én, og snu når snøen sier nei. Karirenna har i tillegg steinsprang i øvre del — den er en annen kategori enn resten av fjellet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Nonstinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.'
    )
  )
where slug = 'nonstinden';

update public.tk_tours set
  description_up   = 'Fra parkeringa langs fv. 85 ved Løbergsbukta — 13 moh der veien runder bukta. Løbergsdalen har utløpssoner på begge sider, og kildens regel er presis: gå midt i dalen. Beltene fra 100 til 400 måler 20 til 22 grader — turens bratteste hundremetersbelte, 22,1, ligger her — og skogen slutter allerede på 287 moh etter 1,3 km.

Linja passerer sør for det øvre tjernet i dalen og går over Løbergskaret på 746 — så gis høyden tilbake: ned forbi tjernet på 573 (på land, sør for det; omrutingene står i forskningsposten) til hyllene på 560-nivået. Beltene her måler 2 til 4 grader over kilometervis av flate — det er langt, og det er poenget med 8–9-timersanslaget.

Fra hyllene tar toppflanken over: 13,9 og 18,1 grader i beltene fra 800, og det bratteste sammenhengende partiet — 33,8 grader mellom 947 og 974 moh — i topphenget kilden gir 30–40 grader med mulig toppskavl. Varden på 996 står på trippelpunktet der Kvæfjord, Lødingen og Sortland møtes; registeret løser 996,2.',
  description_down = 'Ned samme vei — topphenget først, mens du vet hva snøen gjorde på veien opp, så hyllene og motbakken opp igjen til Løbergskaret: 185 av de 561 metrene du gir fra deg, skal klatres på hjemveien. Nordsektoren fra toppen måler 13,6 grader i snitt — veien linja kom.

Sør- og østsida er en annen historie: 39,1 og 38,6 grader i snitt med vinduer på 59,7 og 52,8. Og i dalen gjelder samme regel ned som opp: midt i, mellom utløpssonene.

Kilden gir to startsteder, ikke ett: «Egen parkeringsplass langs R85, rett på sørsiden av elveutløpet. For østruta parkeres det på Gullesfjordbotn camping.» Østruta er den andre, og den kommer inn fra motsatt side av fjellet. Fra campingen på 3 moh holder linja nordsiden av Vesterelva forbi 86 og 91, over vatnet på 76 — 121 der linja går — og videre mellom vatnene på 167 til vatnet på 113, som krysses vestover på 278. Så den bratte traseen kilden setter til 30–40 grader, opp forbi 293 og 326 til vatnet på 289 på 332, og sørover langs den slake ryggen på 440 til høyda 667. Derfra under toppen av Vestbotntinden — linja går over skuldra på 864, ikke over toppen på 935 — og ned 259 høydemeter til Øvre Storelvvatnet på 605, over vatnet, og opp igjen på 652 og 803 inn på ruta fra Snytindhytta som runder toppen på vestsiden. 1360 høydemeter på 8,52 km mot 1544 på 8,80 km fra Løbergsbukta: litt kortere, mindre klatring, 367 meter tilbake mot 561 — det er to traverser av samme fjell fra hver sin fjord. Linja står på is fire steder, og alle fire er kildens egne: 135 meter over vatnet på 76, 90 meter over vatnet på 115 — kildens «vann 113» — 191 meter over vatnet på 274, og 150 meter over Øvre Storelvvatnet på 590. «Krysset vann 76», «vann 113 krysses vestover», «stak over vannet», skriver den. Skogen slipper på 212 moh etter 2,46 km. Beltet fra 400 til 500 moh måler 21,1 grader og det bratteste 30-metersvinduet 36,5 mellom 973 og 996, i topphenget. Alpinøks og stegjern står i faktaboksen for begge rutene.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 3 – Komplekst hos Fri Flyt, alpinøks og stegjern. Linja er lang før den er bratt: alt over 30 grader er samlet i topphenget (33,8 målt, 30–40 hos kilden, mulig toppskavl) — og Løbergsdalen med utløpssoner på begge sider er inngangsbilletten begge veier. Grad 4.'
    ),
    jsonb_build_object(
      'title', 'Dalen',
      'body',  'Gå midt i dalen — kildens egne ord, og terrenget forklarer dem: sidene er utløpssoner, og midten er marginen. På dager med dårlig stabilitet er dalen stengt, og da er turen det også.'
    ),
    jsonb_build_object(
      'title', 'Vatnene',
      'body',  'Linja holder land forbi alle tre vatnene — tjernet i dalen, tjernet på 573 og vatnene ved hyllene — der kilden krysser på isen. Det koster høydemeter (kortet bærer 1550 mot kildens 1250–1350), og det er derfor tallet er større enn fjellet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Snøtindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — trippelpunkt-fjellet svarer til det varselet. Sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang, spade — og alpinøks og stegjern.'
    )
  )
where slug = 'snotindan';

update public.tk_tours set
  description_up   = 'Fra parkeringslomma ved Kobbedalselv bru i Kanstadbotn — 15 moh — følger du sommerstien nordøstover: 176 moh der linja tar den, skoggrensa allerede på 225 etter 1,58 km, og lia på 369. Beltet fra 300 til 400 måler 5,9 grader — dette er slak, åpen skinning.

Ryggen mellom vatnene er turens midtparti: 578 moh der linja står mellom Kobbedalsvatna, 702 videre oppover, og beltet fra 500 til 600 er turens slakeste med 4,0 grader over 1582 meter grunn. Undulasjonen her er grunnen til at turen samler 1044 meter for en 965-topp — 94 gir du tilbake.

Vestflanken på 856 leverer deg til finalen: ryggen østover, eksponert slik kilden sier, med det bratteste enkeltpartiet — 32,8 grader mellom 885 og 907 moh — like under toppen. Varden står på 965; nordtoppen med registerpunktet og sine 998,9 ligger 900 meter lenger nord, på andre sida av et skar, og er ikke turen.',
  description_down = 'Samme vei ned: behagelige 20–25 grader hos Fri Flyt når østryggen er bak deg, og målingen er enig — ingen hundremeter under toppartiet passerer 15,2. Vestflanken og ryggen mellom vatnene er kjøring for alle bein.

Nordøstruta ned østsida går i ei fin renne på opptil 40 grader med mye utløpssoner — flankemålingen gir østsida 67,2 grader der den er brattest og sør 62,7. Den krever stabil snø, og den er en annen tur enn denne.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, og det meste av linja er enig: 15,2 grader i bratteste belte, og slakere enn det i timevis. Men alpinøks og stegjern står i kildens utstyrsliste for østryggen — 32,8 grader målt, eksponert mot ei østside på 67 — og det er Gråfjell-regelen som setter grad 3 på kortet.'
    ),
    jsonb_build_object(
      'title', 'Østsida',
      'body',  'Renna i nordøstruta holder opptil 40 grader med mye utløpssoner, og flankemålingen gir hele østflanken 58,9 til 67,2 grader i sine bratteste vindu. På toppen er avstand til østkanten billig forsikring — særlig i flatt lys, og særlig med skavl.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Fiskefjordtindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som utstyrslista sier.'
    )
  )
where slug = 'fiskefjordtindan';

update public.tk_tours set
  description_up   = 'Fra den store parkeringa langs E10 på sørsida av Litlvatnet, 23 moh, går ruta nordover gjennom vassdraget. E10 er helårsveg, og dette er startpunktet Friflyt bruker — de guida sommerturene fra Møysalen Nasjonalparksenter begynner med båt fra Hennes inn i Lonkanfjorden, men det er en annen tur. De første to kilometrene er flate: bandet 100 til 200 moh måler 2,9 grader over 2165 meter grunn. Skogen slipper taket sent for å være Vesterålen: siste vertex med terrengklasse Skog ligger på 234 moh, 2900 meter ute, og neste vertex, 240 moh, er myr. Bjørka nede i dalen står i lag med myra, så du går inn og ut av den hele veien opp — 55 av rutas 333 punkter er skog, fra 12 til 234 moh.

På 154 moh går linja 90 meter over Forkledalsvatnan, høyst 14 meter fra land, og på 391 moh 247 meter over Rundvatnet, høyst 71 meter fra land. Begge er naturlige vann — DTM1 gir terrengklasse Innsjø, og OSM-polygonene bærer ingen reservoartagger. På 328 moh kommer den tredje: 225 meter over Grønnvatnet, opptil 86 meter fra land. Det er det største av de tre, og det er også vannet rutebeskrivelsen navngir.

Å komme til Grønnvatnet koster deg 120 høydemeter. Linja går over høyde 450 — 450,7 moh målt — og faller så fra 448 til 328 over 736 meter grunn, det største sammenhengende fallet på veg opp. Dette er ikke en feil i linja, det er turen: netto stigning fra sjøen til toppen er 1241 meter, men det du faktisk går er 1596, og differansen er denne høyden og ryggene etter den.

Fra Grønnvatnet stiger ruta jevnt, og her er det samme høyde 450 du nettopp gikk over som er holdepunktet: Friflyt sier at du skal ha den til høyre, altså øst for deg. Det er én høyde og ikke to — et åttevegs sveip fra punktet viser at bakken faller mot nord, nordøst og nordvest, ned mot vatnet, og stiger mot sør og sørøst til 513 og 516 moh. Det er en bred skulder, ikke et skar. Videre opp bekkedraget er den lange arbeidsstrekninga: bandet 800 til 900 moh måler 21,0 grader over 253 meter grunn og bandet 900 til 1000 moh 21,0 grader over 242, og det bratteste 400-metersvinduet på hele turen ligger her, 22,0 grader fra 774 til 939 moh.

Isen ligger lavere enn du kanskje venter. Linja går over mark klassifisert som SnøIsbre fra 752 til 898 moh, sammenhengende over 405 meter grunn mellom 7700 og 8100 meter ute, uten et eneste bart punkt imellom. Peilinga fra toppen til den strekninga er 184 til 216 grader — sør til sørvest — og avstanden 422 til 582 meter. Korridorforskinga kalte vegpunktet «breen sørøst for Møysalen, ~1025 moh»; på det punktet gir terrengmodellen 1026,59 moh med terrengklasse ÅpentOmråde, og ringprøver 300, 500, 700 og 900 meter ut fra toppen finner SnøIsbre bare mot øst og mot sørvest. Sørøst er bar mark hele veien. Friflyt skriver at «selv om det kalles bre er det ikke åpne sprekker», og at den går normalt uten tau. Det bratteste 30-meterssteget oppover, 41,9 grader fra 1036 til 1063 moh, ligger 8500 meter ute — altså over isen og ikke under den.

Over isen fortsetter ruta nordvest opp toppryggen, og ryggen er ikke jevn. 9332 meter ute stiger linja til 1170 moh og faller så 51 meter til 1119 over 27,3 meter grunn — et hakk, ikke en målefeil: tolv DTM1-punkt med 2,3 meters mellomrom gjennom fallet gir en sammenhengende kurve fra 1170,0 til 1119,2, og et rutenett på 40 meter til hver side gir fra 1186 til 1055 moh, så nabolinjene er ikke slakere. Det er dette som gjør at største steg langs ruta måler 62,9 grader, og det er her isøksa og stegjerna hører hjemme. De siste 500 metrene går på peiling 333 grader og stiger 124 meter; det bratteste 200-metersvinduet på turen, 24,3 grader fra 1189 til 1264 moh, er selve toppryggen.',
  description_down = 'Ned samme vei. Fallvekta gjennomsnittsretning er 193 grader — sør — og det stemmer med kilden: Friflyt kaller nettopp Vestryggen «sørvendt bratt terreng», og beskriver alle de andre linjene på fjellet som sørvendte eller sydvendte. Kortet sa lenge sørøst; det tallet hvilte på et vegpunkt som ble kalt bre og ikke er det, og er rettet. Over hakket i ryggen går de fleste til fots.

Vanligste feil er å regne turen i høydemeter i stedet for i timer. 1602 høydemeter og 9,77 kilometer hver veg, med et bratt parti under breen og en rygg som ofte er avblåst og hard, er 11 til 18 timer etter Friflyt. Snur du på breen, har du fortsatt 120 høydemeter opp fra Grønnvatnet igjen på hjemvegen. Den andre feilen er å tro at et sørvendt bratt parti på 21 grader over lang strekning holder seg stabilt gjennom dagen: tidspunktet avgjør om du møter gjennomvåt eller gjennomfrossen snø der.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'To partier bærer risikoen. Stigninga fra Grønnvatnet til breen ligger på 21,0 grader i snitt over begge bandene mellom 800 og 1000 moh og har brattere trinn i seg — 41,9 grader over det bratteste 30-metersvinduet, 8500 meter ute. Toppryggen er det andre: 24,3 grader over 200 meter, med et hakk der linja faller 51 meter over 27,3 meter grunn. Friflyt setter turen til KAST 3 og krever isøks og stegjern; breen beskrives som sprekkfri og går normalt uten tau.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Møysalen har ingen slake sider. Et sveip 1000 meter ut i alle åtte retninger fra toppen gir 24,5 grader i snitt som det slakeste — det er sør — og 40,2 grader som det bratteste, mot øst. De bratteste 60-metersvinduene ligger på 55,9 grader i vest og 70,8 grader i øst, det siste allerede 10 meter fra toppen. Går du av ryggen, er det ingen retning som tar imot deg mildt. Det er derfor ruta følger ryggen hele veien og ikke leter etter en snarveg ned.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade, og isøks og stegjern i tillegg — på denne turen er de ikke valgfrie.'
    )
  )
where slug = 'moysalen';

update public.tk_tours set
  description_up   = 'Fra parkeringa — 23 moh — som på Lakselvtindan: nordsida av Storvatnet på 85, nord for høyde 258, og 217 moh der Lakselva krysses mot øst. Skogen slipper på 220 moh etter 2,57 km, og beltet fra 300 til 400 er det bratteste i snitt med 19,0 grader over 313 meter grunn.

Opp på Lakselvtindan, 747 moh, og så vestover langs høydedraget til du står rett nord av høyde 790 — DTM1 måler 790,6, og korridoren står på 754 rett nord av den. Mellom 700 og 800 moh ligger to kilometer nesten flatt høyfjell: beltet måler 2,1 grader i snitt over 1955 meter grunn.

Videre nordover holder ruta seg på nedsida — vestsida — av draget, 668 moh der korridoren er festet, fordi det er bratte partier rett før oppstigningen tar til. Så sydryggen: det bratteste steget på hele linja, 33,1 grader, ligger mellom 834 og 863 moh, rett under varden på 907.',
  description_down = 'Samme veien hjem, for det meste under 20 grader med et par partier på 25–30, sier kilden. Men hjemveien er også en ny oppstigning: de 309 høydemeterne du ga fra deg skal tas igjen, og Lakselvtindan står i veien en gang til.

Flankesveipet forklarer hvorfor sydryggen er den eneste veien opp og ned. S måler 22,5 grader i snitt med et 40,8-vindu 70 til 130 meter ute — det bratte partiet kilden nevner. N, NE, V og NV ligger på 46,9 til 48,6 i snitt med vinduer fra 60,6 til 75,9, og øst har 76,8 bare 30 til 90 meter ute.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Partiet før toppen',
      'body',  'Kilden kaller sydryggen et flott luftig parti med ett bratt parti før toppen, og ber deg vurdere om skiene skal være med opp. Målingen er enig: 40,8 grader i vinduet 70 til 130 meter ute, og 33,1 grader i det bratteste enkeltsteget linja faktisk går, mellom 834 og 863. Stegjern og alpinøks er anbefalt, og mange bærer skiene den siste biten.'
    ),
    jsonb_build_object(
      'title', 'Vestsida av høydedraget',
      'body',  'Nordover langs draget skal du holde deg på nedsida, altså vestsida. Kilden er tydelig på hvorfor: det er bratte partier rett før oppstigningen på ryggen mot Forselvtinden tar til, og linja går rundt dem og ikke over. Øst for draget faller terrenget 76,8 grader i sitt bratteste vindu.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Forselvtinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts, og 8,38 km med 309 høydemeter tilbake gjør dette til en tur der tidspunktet på dagen avgjør hvilken snø du møter på returen. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'forselvtinden';

update public.tk_tours set
  description_up   = 'Fra den store parkeringsplassen ved rundkjøringa — 49 moh, samme start som Nonstinden — går du opp den snødekte lia vest for Tverrelva: 194 moh der linja står i den, med skoggrensa på 265 etter 1,04 km. Beltet fra 100 til 200 måler 17,4 grader.

Over skoggrensa fortsetter den jevne stigningen: 461 moh der linja er festet, og beltene fra 200 til 700 måler 18,2 til 20,6 grader — aldri slakt, aldri bratt, men omgitt av brattere: kilden er tydelig på at den slakeste traseen skal velges, for ruta er omkranset av mer skredfarlig terreng.

Blåberget — kildens navn; registeret har ikke navnet her — passeres på 708, toppflanken leser 767, og varden står på 810; registeret løser 809,8. Turens bratteste enkeltparti, 27,3 grader mellom 437 og 454 moh, ligger midt i lia. Én meter gir du tilbake på hele turen.',
  description_down = 'Samme vei ned, eller Tverrelva-dalen når snødekket er godt — og med mulig ising over tregrensa er stegjern verdt å vurdere, sier kilden. Nordsiden fra toppen måler 9,5 grader i snitt: kjøringen er snill der linja går.

Vestsida mot Storskardet er den brattere varianten med mer skjermet snø — og skredterreng som krever egne vurderinger: flankemålingen gir vest 54,4 grader i vinduet 60–120 meter ut og sørvest 49,3. Øst måler 40,9. Det snille på dette fjellet er smalt, og det er poenget med det.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 3 – Komplekst hos Fri Flyt — ikke fordi normallinja er bratt, men fordi den er omgitt: linja måler 20,6 grader i bratteste belte og 27,3 i bratteste parti, mens terrenget rundt holder 30–40. Velg den slakeste traseen, sier kilden, og det er hele turen i én setning. Grad 3.'
    ),
    jsonb_build_object(
      'title', 'Isingen og sidene',
      'body',  'Over tregrensa kan det ise — vurder stegjern, eller snu. Vestsida mot Storskardet måler 54,4 grader der den er brattest og er skredterreng med egne vurderinger; østsida måler 40,9. Nedkjøringen i Tverrelva-dalen krever godt snødekke og de samme vurderingene.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Middagsfjellet ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–april er Fri Flyts, den lengste i runden sammen med Haukebøtinden-klassen. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'middagsfjellet';

update public.tk_tours set
  description_up   = 'Start langs E10 der veien er nærmest utløpet av Heggedalen, 21 moh. Kilden gir ikke ett punkt, men en strekning: «Her er det flere muligheter langs E10, avhengig hvor mye som er brøytet», med en advarsel som er verdt å ta med seg — «dette er en høyt trafikkert vei med 80 km/t og få rette strekninger så vær forsiktig langs vei og parker heller litt lengre sør og traverser på øversiden av veien enn å skape farlige situasjoner langs veien». Veien under fjellet heter Strandstindvegen, etter fjellet.

Normalruta følger Heggedalen på ryggen mellom de to elvene. Rundt 146 moh går ruta over på nordsida av elva, og de to punkthøydene rutebeskrivelsen navigerer etter dukker opp der de skal: slukta ved «høyde 505» måler 509,6 moh og «høyde 570» måler 570,3 — 234 meter fra hverandre. Kartverket fører siste skog på 143 moh og åpent terreng fra 157, så mesteparten av turen går i åpen fjellside. De første hundre høydemeterne er de bratteste i dalbunnen, 14,7 grader, og så slakner det til 8,0 og 10,6.

Fra 570 svinger ruta sørover og holder østsida av bollen. Der ligger bratteste bandet på turen — 19,8 grader fra 600 til 700 moh over 270 meter grunn — og bratteste steget, 29,1 grader mellom 736 og 761. Bollen flater ut rundt 805 moh, og der gjør ruta det Fri Flyt sier: «Letteste vei til toppen er å holde høyre (vest) fra nå og bestige toppen via ryggen fra høyre (vest).» Linja går vestover langs benken — 1092 meter grunn på 5,4 grader mellom 700 og 800 moh — kommer opp på nordvestryggen ved 886 moh og følger ryggen over 952 og 1040 til toppen. De siste 600 metrene peker 135 grader: du kommer opp fra nordvest.',
  description_down = 'Ned samme veien: ryggen ned til benken, benken østover og nordsida ned Heggedalen. Det er linja fjellet er kjent for — «nedkjøringen er samme rute som opp og er klassikeren der du kan dundre på og oppnå virkelig fri flyt og brede glis» — og i sesongen kjører man helt ned til veien ved havet. Snøen på nordsida ligger lenge nok til at midnattssol i juni ikke er uvanlig.

Å gå rundt koster det å gå rundt koster. Den første korridoren tok toppen rett opp nordøstribba, og den linja var 4,77 km med 1090 høydemeter; over vestryggen er turen 5,79 km med 1156 og 89 meter gitt tilbake underveis. Fri Flyt er tydelig på hvorfor: «Det er helt klart mulig å gå opp på andre siden, men den er mer eksponert.» Ribba måler 1010,2 moh 150 meter fra toppen mot nordøst der ryggen måler 1039,8 mot nordvest — den er brattere hele veien opp.

Rett nord for varden er det uansett bratt: 40,9 grader i bratteste 60-metersvindu bare 20 til 80 meter ut, med 24,8 grader i snitt ut til en kilometer. Der ligger også snøen som blir liggende — Kartverket fører terrengklassen SnøIsbre på nordsida fra rundt 1050 moh og nedover, mens ryggen ruta går på er bar mark i alle de seksten siste vertexene. De tre andre kantene er alvorlige: sør måler 30,6 grader i snitt med 63,9 grader i vinduet 20 til 80 meter fra varden, sørøst 30,9 med 62,5, øst 29,0 med 54,9, og sørvest 24,1 med 56,0. Fri Flyts to andre linjer — Kvanntoa i nordøst og Kvannto i øst — har partier på 45 grader og rappellfeste, og de er ikke ruta dette kortet beskriver.

To av kildens sju linjer er egne oppstigninger med egen parkering, og begge møter turen først på høyde 779 — 787 moh der linja passerer — der de siste 300 høydemeterne nordøstover er felles. Fra Kåringen er det 1063 høydemeter og 8,18 km over Nordfjellaksla på 344 moh: den lengste og slakeste av de tre, med bratteste steg 32,2 grader mellom 973 og 994 moh, og kilden kaller den «en meget populær skitur med fjellski» der du oftest kan følge skispor fra veien. Fra Kanstadbotn er det 1140 høydemeter og 7,68 km, nord for høyde 519 og sør for Trollvatnan på 418 — kildens «sprekere variant», med et steg på 30,8 grader mellom 776 og 799.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Bollen',
      'body',  'Fri Flyt har ett faremoment på normalruta, og det er utvetydig: «I bollen er det flere ganger gått store skred, så velg dager med stabil snø.» Bollen er søkket ruta krysser mellom høyde 570 og benken på 805 moh, og det er der bratteste bandet på turen ligger — 19,8 grader fra 600 til 700 moh. Rutebeskrivelsen sender deg langs østsida av den, ikke gjennom midten.'
    ),
    jsonb_build_object(
      'title', 'Fjellet har ingen slak side',
      'body',  'Ingen av de åtte retningene fra toppen måler under 17,0 grader i snitt ut til en kilometer, og fire av dem har 60-metersvindu over 50 grader. Vest er den slakeste — 17,0 grader i snitt, med 37,7 grader i vinduet 120 til 180 meter ut — og vest er ryggen ruta tar toppen fra. Fri Flyt fører turen som KAST 3 – Komplekst og lister alpinøks og stegjern som ekstra utstyr: «Det kan være greit med stegjern og alpinøks på dager med hard skare.»'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skredvarselet for dette fjellet er Lofoten og Vesterålen på varsom.no, ikke en Harstad-region — toppen ligger i Lødingen kommune, og Varsom svarer på koordinaten. Det er en A-region med varsel hver dag i sesongen. Fri Flyt oppgir januar til juni. Kortet fører Harstad som region fordi det er derfra turen gås, og fordi det er slik begge kildene plasserer den; registeret kaller toppen Strandstinden og Djupfesttinden, og ingen av dem Strandtinden. Ta med sender/mottaker, søkestang og spade, og alpinøks og stegjern når skaren er hard.'
    )
  )
where slug = 'strandtinden';

update public.tk_tours set
  description_up   = 'Fra lomma på fv. 7548 Tjeldøyveien ved Mølnneset — 10 moh; kildens F711 — går linja opp fra neset og på ryggen over Spannbogen, 246 moh der korridoren står. Skoggrensa kommer allerede på 111 etter 0,48 km: dette er en rygg i havgapet, ikke en skogstur.

Henget rett før 600 er stedet skiene gjerne bæres — kilden gir det 40 grader i fallinja, og modellens linje krysser det med 31,9 grader som bratteste enkeltparti, mellom 621 og 649 moh. Beltet fra 600 til 700 er det bratteste i snitt med 17,1.

Østryggen fra 605 mot toppen: rett under varden smalner ryggen — sommerruta på sørsida er utveien, eller tau og litt utstyr på selve ryggen, sier kilden. SV-målinga, der sommerruta runder, er den eneste slake med 6,1 grader i snitt; N/NE/E har 46,4–54,3-vindu i de første 60 metrene.',
  description_down = 'Samme vei ned, og vindutsatt: ett parti på 40 grader, resten 15–20, sier kilden. Linja gir tilbake 79 av de 1048 meterne den vinner — ryggen bølger, og fellene kan på igjen før Spannbogen.

Nordsida via Svartvasshompen mot Trollvatnet og Storforrdalen er KAST 2-varianten — utenom skredterrenget langs scooterløypene, men en annen tur. NV-flanka fra varden faller 33,1 grader i snitt: østryggen er linja, ikke fallinjene rundt den.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Henget og toppryggen',
      'body',  'Henget før 600 er 40 grader hos kilden — skiene bæres, og øksa og stegjerna er for skare på ryggen. Toppryggen smalner: N/NE/E har 46,4–54,3-vindu i de første 60 metrene fra varden, og sommerruta på sørsida er utveien kilden selv anbefaler.'
    ),
    jsonb_build_object(
      'title', 'Vinden',
      'body',  'Ryggen er vindutsatt hele veien, sier kilden — skavler og avblåst skare hører til, og tau nevnes for toppryggen på vanskelige dager. Snu ved henget om skaren ikke gir feste: resten av ryggen blir ikke lettere.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Jotind ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'jotind';

update public.tk_tours set
  description_up   = 'Fra parkeringa på Ingelsfjordeidet — 23 moh — samme start som Lakselvtindan: nordsida av Storvatnet på stien, og opp til nord for høyde 258. Linja holder seg på land der kilden krysser isen, slik bokas egen Forkledalen-rute fra samme parkering gjør.

Derfra går oppstigningen vestover i det slakeste terrenget, over nordsida av høyde 462 — DTM1 måler 461,1 — på 400 moh der korridoren står, og videre opp fjellsida på 509. Skogen slipper på 226 moh etter 2,51 km, og beltet fra 400 til 500 er det bratteste i snitt med 21,2 grader over 260 meter grunn.

Toppen på 700 — 707 moh på linja — er der kildens skitur ender. Traversen videre over fortoppen er den alpine delen: det bratteste enkeltsteget på ruta, 45,0 grader, ligger mellom 869 og 901 moh, i det siste stykket opp til varden. Siste stykket opp til varden på 901 tar du med fordel på østsida i starten, sier kilden — der slipper du den vanskelige klatringen.',
  description_down = '105 av de 985 høydemetrene gir du fra deg underveis. Mange starter nedkjøringa allerede fra 700-toppen, i slakt terreng med et brattheng som kan gås utenom, og det er den turen kildens høydemetertall beskriver.

Fra hovedtoppen er nordvestsida linja: den starter mellom 902 og sørtoppen og er 20–25 grader med brattheng på 30–40 i nedre del. Nordøstsida er 30–40 grader og følger etter hvert vestruta til Lakselvtindan ned i Forkledalen. Begge går eksponert for skred fra høyereliggende terreng nesten hele veien.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Traversen',
      'body',  'Fra 700 til 901 er graderingen KAST 3 – Komplekst. Avhengig av snøforholdene må du kanskje klatre litt ned på snø eller berg for å komme videre, og siste delen er svært bratt og eksponert: det bratteste steget måler 45,0 grader mellom 869 og 901. Kilden viser et bilde av flakskred tett under toppen, og skriver at mye snø blir satt i bevegelse og at det er lett å bli begravd.'
    ),
    jsonb_build_object(
      'title', 'Alle sider er bratte',
      'body',  'Flankesveipet finner et vindu mellom 37,7 og 60,0 grader innenfor de første 100 metrene av varden i alle åtte retninger. Nordøst er mildest med 37,7 og 23,5 i snitt; sørvest er slak de første 340 metrene og har så 46,4. Henget ned fra høyde 790 til vann 355 på nordsida er KAST 3 i kildens egen vurdering.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Forkledalstindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade, og alpinøks og stegjern — her er de ikke en anbefaling, men det traversen krever. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'forkledalstindan';

update public.tk_tours set
  description_up   = 'Fra den store parkeringa på Ingelsfjordeidet — 23 moh — går linja langs nordsida av Storvatnet, på stien. Kilden skriver «kryss Storvatnet», men bokas egen rutebeskrivelse for Forkledalen fra samme parkering sier «følger man Nordsiden av Storvatnet». Kartet bærer landlinja; isen er ikke en forutsetning.

Opp mellom Tverrelva og Lakselva — 158 moh — og nord for høyde 258, som DTM1 måler til 258,3. Skogen slipper på 220 moh etter 2,62 km, og beltet fra 300 til 400 er det bratteste i snitt med 20,0 grader over 261 meter grunn.

Så flater det ut innover: 217 moh der Lakselva krysses mot øst, og derfra ryggen — 481 moh der korridoren står i den — helt opp til varden på 747. Det bratteste enkeltsteget på hele linja, 25,5 grader, ligger oppe på ryggen mellom 656 og 674 moh; nede i lia over parkeringa, der linja følger stien, er det 21,1 grader mellom 68 og 80 moh.',
  description_down = 'Samme ryggen hjem. 98 av de 822 høydemeterne gir du fra deg på vei opp, det meste i det flate partiet før Lakselva, og ingen av beltene på linja måler over 20,0 grader i snitt. Kilden nevner skare, og skarejern hører med i sekken sammen med øksa og stegjerna.

Variantene er en annen sak enn normalruta. Rødhammarrenna på østsida er KAST 3: skåla vest for normalruta er 30–40 grader, så et brattheng på 45 ned mot renna, og skredterreng hele veien gjennom. Vestsida ned til vann 355 mellom Forselvtinden og Forkledalstinden har et bratt parti på 30–40 grader.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Rødhammarrenna',
      'body',  'Østsida er ikke normalruta. Kilden gir den KAST 3 og beskriver et brattheng på 45 grader ned mot renna, med skredterreng hele renna gjennom fordi sidene omkring kan bære mye snø. Selve renna er 15–20 grader med noen partier på 25–30 — det er innsteget og det som henger over, ikke utløpet, som avgjør om den går.'
    ),
    jsonb_build_object(
      'title', 'Skare og vind',
      'body',  'Dette er en tur der problemet like ofte er hardt underlag som ustabil snø. Kilden ber deg ha skarejern med, og fra 481 moh og opp er ryggen avblåst og vindpakket — det er der alpinøksa og stegjerna på utstyrslista hører hjemme.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Lakselvtindan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts egen. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'lakselvtindan';

update public.tk_tours set
  description_up   = 'Fra lomma ved grustaket på fv. 7548 Myklebostadveien — 7 moh; kildens F711 — følger du sommerruta sørvestover: OSM-stien starter på punktet, og skoggrensa ligger på 110 etter 0,4 km. Beltet fra 0 til 100 måler 14,7 grader i den korte skogslia.

Gjennom det slake, kuperte terrenget — 411 moh der linja står i sommerruta — og bekken sør for 414-høyden: beltet fra 300 til 400 er det bratteste i snitt med 18,6 grader, kildens parti på 20–25.

Vestover mot toppen fra 631: beltet over 600 måler 7,2 grader, og hele turens bratteste enkeltparti, 23,5 grader, ligger helt nederst mellom 23 og 41 moh — over skoggrensa er dette fjellet aldri bratt. Varden står på 659.',
  description_down = '10–15 grader øverst, 20–25 forbi 414-høyden, og så det slake kuperte terrenget hjem — kjøring for ferske, og for dager da varselet stenger de store fjellene. NE og V fra varden måler 7,9–9,2 grader i snitt.

Kilden krever én ting: navigasjon og god sikt. Terrenget er kupert med glissen skog, og S/SE-flankene faller 26,9–27,7 grader i snitt med 47–49-vindu — kantene mot sør er de eneste å vite om, og i skodde er de nære.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, og modellen er enig: 18,6 grader i det bratteste beltet, 23,5 i det bratteste enkeltpartiet — nederst i skogen. Kildens ord om at toppen brukes når skredfaren truer andre fjell står som kildens vurdering; varselet leses uansett.'
    ),
    jsonb_build_object(
      'title', 'Sørkantene',
      'body',  'S og SE faller 26,9–27,7 grader i snitt med vindu på 47–49 — også nybegynnertoppen har kanter. Ruta kommer fra nord og har ingen grunn til å nærme seg dem; i skodde er kompasskursen hjem nordøst, mot grustaket.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Siriskolten ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'siriskolten';

update public.tk_tours set
  description_up   = 'Fra lomma på fv. 7548 Tjeldøyveien ved Valvågpollen — 3 moh; kildens F711 er dagens fylkesveg — går linja over elva og opp mellom furuene på vestbredden av Forsdalselva, 109 moh der korridoren står i lia. Skoggrensa ligger på 204 etter 2,43 km, og beltet fra 0 til 100 måler 3,9 grader over den lange innmarsjen.

Mellom skredterrenget mot østsida av Kjerstadtinden — 651 moh der linja er festet — og forbi vatnet på 672 i bollen under ryggen. Beltet fra 400 til 500 er det bratteste i snitt med 17,9 grader, og det bratteste enkeltpartiet, 26,1 grader mellom 326 og 348 moh, ligger i lia over skogen.

Ryggen fra 981 til varden på 1009: beltet over 1000 måler 1,8 grader — toppen er ei vidde. Kildens parti på 30 på ryggen bor i N-vinduet, som måler 39,1 på flankemålinga.',
  description_down = 'Sol og slak fin kjøring, sier kilden — 10–15 grader med parti på 30, samme vei som opp. SV og V fra varden er de slakeste målingene med 4,9 og 14,1 grader i snitt: vestsiden er fjellets snille akse.

SE faller 31,4 grader i snitt med 58,3-vindu, og varianten på nordvestsida (30–40 grader) er KAST 2 og en annen linje. Hold vestaksen hjem — og hold igjen ved vatnet, så slipper du å felle om for de siste metrene opp fra bollen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, og modellen er enig: 17,9 grader i det bratteste beltet, 26,1 i det bratteste enkeltpartiet. Linja er lagt mellom skredterrenget mot østsida av Kjerstadtinden — den passasjen er grunnen til at ruta går der den går, også i skodde.'
    ),
    jsonb_build_object(
      'title', 'Kantene',
      'body',  'SE-flanka faller 31,4 grader i snitt med et 58,3-vindu, og østsida måler 22,8 med 54,9-vindu — øyas snilleste tusenmeter har voksne kanter mot øst og sørøst. Nordvestvarianten (30–40 grader) er for stabile dager.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Trollfjellet ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'trollfjellet';

update public.tk_tours set
  description_up   = 'Fra den store parkeringa langs E10 — 23 moh, Møysalens plass — går linja opp Forkledalen, 136 moh der korridoren står i dalen. Skoggrensa ligger på 195 etter 2,10 km, og beltet fra 100 til 200 måler 3,8 grader over den lange dalbotnen.

Der renna med bekken tar av til venstre følger du sørsida av bekken langs ryggen — 194 moh — og før 400 legger linja seg på det slakeste av østryggens flanke: beltet fra 300 til 400 er det bratteste i snitt med 24,2 grader, og det bratteste enkeltpartiet, 31,7 grader, ligger mellom 312 og 338 moh.

Traversen mot framtoppen øst for punkt 799 — 619 moh der linja er festet — og sluttstøtet på rundt 30 grader, der stegjern og øks avgjør på hard skare. Varden står på 831.',
  description_down = 'Samme vei ned — fin cruising, sier kilden, men nedturen krysser skredterreng, og linja gir tilbake 91 av de 899 meterne den vinner på ryggens bølger.

Variantene er alvorlige: Sebortindrenna i sørvest — 47,8 grader i snitt på flankemålinga, med 69,0-vindu — går med skred hvert eneste år, sier kilden. Forkleet på østsida når opp mot 45 forbi granittveggen på 120 meter, og Vinkelrenna holder 30–45 med svært utsatt topparti. Alt dette er andre turer.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Nordsida',
      'body',  'Normalruta krysser skredterreng, sier kilden — KAST 3 – Komplekst, med alpinøks og stegjern for sluttstøtet på rundt 30 grader. N-flanka leser 46,1 i sitt bratteste vindu: framtoppen er stedet å vurdere resten av dagen fra.'
    ),
    jsonb_build_object(
      'title', 'Rennene',
      'body',  'Sebortindrenna går med skred hvert eneste år — kildens egne ord, og målinga er enig: 47,8 grader i snitt, 69,0 i vinduet. Forkleet (opp mot 45) og Vinkelrenna (30–45, svært utsatt øverst) er for erfarne på utvalgte dager, og et fall øverst i Vinkelrenna er ikke til å overleve, sier kilden.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sebortinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — samme region som Møysalen, som deler parkeringa. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'sebortinden';

update public.tk_tours set
  description_up   = 'Fra lomma på fv. 7548 Myklebostadveien i Breivikbotn — 9 moh; kildens F711 — går servicevegen til hyttefeltet ved Krokelva på 59. Skoggrensa ligger allerede på 57 etter 0,4 km, og beltet fra 0 til 100 måler 9,3 grader: åpent terreng nesten fra bilen.

Opp til Finnvatnet på 282, og sørvest for å unngå skredterrenget slik kilden ber om — 479 moh der linja svinger. Beltet fra 600 til 700 måler 8,3 grader opp mot ryggen.

Nordøstryggen av Litletinden fra 645, ryggen sørover med en liten nedkjøring — og det siste støtet: beltet fra 800 til 900 er det bratteste i snitt med 19,9 grader, og det bratteste enkeltpartiet på linja, 28,2 grader mellom 646 og 665 moh, ligger under de 30 kilden gir ryggens to bratteste parti — linja legger seg slakere enn ryggkammen der. Varden står på 948.',
  description_down = 'For det meste 10–20 grader hjem, med to parti over 30 langs Litletind-ryggen, sier kilden — jevn kjøring, fin for ferske på stabile dager. N-målinga fra varden er den slake sida med 5,5 grader i snitt: ryggen er hjemveien.

Østskåla mellom Helligtinden og Litletinden er varianten: 31–35 grader ned mot slakere terreng langs sørsida av Tverrelva. Østflanka måler 28,4 i snitt med 57,2-vindu 100–160 m ut — skåla krever stabil snø, og linja gir uansett tilbake 15 av de 954 meterne på ryggens bølger.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ryggen',
      'body',  'To parti over 30 grader langs Litletind-ryggen, og stegjern og øks kan trengs på hard skare — KAST 2 – Utfordrende, grad 3 etter utstyrslista. Linja legger seg sørvest etter Finnvatnet nettopp for å gå utenom skredterrenget over vatnet.'
    ),
    jsonb_build_object(
      'title', 'Østskåla',
      'body',  'Skåla mellom Helligtinden og Litletinden holder 31–35 grader, og østflanka leser 57,2 i sitt bratteste vindu — varianten er for stabile dager, ikke for skare. Nordryggen er linja som alltid går.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Helligtinden ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel — ny i appen med denne runden: Tjeldøyas fire topper er de første som svarer hit. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern der kilden krever det.'
    )
  )
where slug = 'helligtinden';

update public.tk_tours set
  description_up   = 'Fra den store parkeringa øst for Austerstraumen bru — 3 moh — sørover langs myrene med jevn stigning: 146 moh der korridoren står. Boka skriver også «fra parkeringa på Husjordøya», men Husjordøya ligger mellom Vesterstraumen og Austerstraumen, og den kartlagte parkeringa ligger øst for brua. Det er parkeringsteksten som lar seg etterprøve.

Overgangen til Trolldalen går rett nord av høyde 146 — terrengmodellen måler 148,4 — på 144 moh, og så faller linja ned i dalen til 96. 104 av de 933 høydemeterne gir du fra deg der, og det er dem kildens 910 høydemeter har med som differansen mellom sjø og topp ikke har. Skogen slipper på 242 moh etter 2,17 km.

Opp dalen mot sørøst og inn på vestryggen — 554 moh der korridoren er festet. Beltet fra 700 til 800 er det bratteste i snitt med 22,3 grader over 244 meter grunn, mens det bratteste enkeltsteget, 28,5 grader, ligger helt nede mellom 113 og 131 moh. De siste høydemeterne til toppen på 832 går du på ryggen fra vestsida.',
  description_down = 'Ned samme veien: noen parti over 30 grader, men det aller meste rundt 20–25, sier kilden. Mye vind- og solpåvirket snø er normalen, og under gode forhold — særlig på ettermiddagen seinvinters, i kveldssol — er dette turen kilden skryter mest av.

Toppen selv er luftig, og kilden ber deg vurdere om skia skal settes igjen eller tas med opp. Flankesveipet viser hvorfor det er et spørsmål: vest, der ryggen kommer, har et vindu på 44,6 grader 90 til 150 meter ute, og sørvest måler 38,7 i snitt. Øst er den slake sida med 15,9.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Nordsida',
      'body',  'Den brattere varianten ned fra toppen er KAST 3 i kildens egen vurdering, med toppheng på 30–40 grader. Den gir flott kjøring under gode forhold, men den er ikke veien du kom, og den er ikke et valg du tar på toppen uten å ha lest snøen på vei opp.'
    ),
    jsonb_build_object(
      'title', 'Vind, sol og brøyting',
      'body',  'Mye vind- og solpåvirket snø er normalen på denne ryggen, og sørvestflanken under den måler 38,7 grader i snitt med et 53,8-vindu 60 til 120 meter ute. Parkeringa er heller ikke alltid brøytet tidlig i sesongen — det er verdt å vite før du kjører helt hit.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Kvasstinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen. Sjekk varsom.no. Sesongen februar–april er Fri Flyts. Sender/mottaker, søkestang og spade — og alpinøks og stegjern, som står på kildens liste selv om turen er KAST 1. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'kvasstinden';

update public.tk_tours set
  description_up   = 'Parkeringen er ved veibommen i Forselvveien over Djupvik. Gå forbi bommen og fram til veien slutter i det gamle steinbruddet på 141 moh, og hundre meter videre i samme retning før du legger deg inn i skogen. De første tre hundre høydemeterne er bratte og tette; følg det gradvis slakere terrenget opp mot venstre til du står ved Pumpvatnet på 325 moh.

Kryss vatnet på isen og forlat det i sørøstre hjørne, der en gammel skogsvei tar deg inn i bekkedalen langs Forsneselva mot Forsnesvatnet. Skogen slipper taket på 494 moh, og resten av dalen går i åpent terreng. Ved dalhodet rundt 650 moh, nord for Forsnesvatnet, svinger du østover inn i den lille dalen mot Isvatnet.

Isvatnet ligger på 820 moh. Rund det på nordsida — der går en sammenhengende benk på fire til tjuefire grader som tar deg østover fra 850 til 950 moh uten å berøre noe bratt. Hold benken hele veien. Skulderen rett øst for vatnet, nede til høyre for deg, er et bergband som måler 53 til 63 grader.

Fra 950 moh fortsetter benken østover til du kommer opp på sørøstryggen rundt 1145 moh. Derfra følger du krona nordvestover til toppen. De siste tretti meterne er ikke skiterreng: et kort, bratt snøfelt og to korte partier med enkel klatring. Isøks er verdt å ha med, og stegjern hvis snøen er hard; tau trenger du ikke.',
  description_down = 'Ned igjen samme vei. Kjøringen er delt opp i mange korte bakker heller enn én lang — fra ryggen ned til Isvatnet, over benken, ned den lille dalen og gjennom bekkedalen til Pumpvatnet. Vil du ha noe brattere, starter Rombaksrennene i skaret på 1070 moh rett øst for toppen. De ser brattere ut enn de er, men de er skredterreng, og de faller nordover mot Rombaken — ikke tilbake til Isvatnet.

Vanligste feil: å tro at det går an å kjøre rett av toppen. Det gjør det ikke. Nordsida er Rombaks-S''en, og den måler 52 grader i snitt de første fire hundre meterne, med partier over 70 — videre 41 grader hele veien ned mot Rombaken. Den er så eksponert at et fall kan bli fatalt, og den er en linje for folk som har kjørt den før. Nordøst og øst er nesten like bratt, 48 og 44 grader, og fører ned i Rombaksrennene. Og vest, som ser ut som en snarvei tilbake til benken, går inn i et bergband på over 60 grader mellom 1060 og 1090 moh. Hold krona sørøstover til du er nede på 1145 moh og ser Isvatnet.

Under skoggrensa på 494 moh blir det tett igjen. Følg oppsporet ned til veienden — skogen her er bratt og uoversiktlig, og det går fortere i eget spor enn å lete etter en bedre linje.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja som er tegnet holder seg under 30 grader hele veien. Bratteste hundremeteren ligger mellom 500 og 600 moh med 16,1 grader i snitt, og bratteste enkeltsteg måler 27,1 grader. Benken nord for Isvatnet ligger på fire til tjuefire grader. Toppblokka er unntaket — den er klatring, ikke skiterreng.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Toppen står bratt av på alle kanter unntatt sørøstryggen du kom opp. Målt fire hundre meter ut fra toppunktet: nord 52 grader i snitt, nordvest 48, nordøst 48, øst 44 — mot 13 på sørøstryggen. Nordsida er Rombaks-S''en, og i skaret på 1070 moh øst for toppen starter Rombaksrennene. Vestsida har et bergband på over 60 grader mellom 1060 og 1090 moh, og bergbandet rett øst for Isvatnet måler 53 til 63. Alt dette ligger utenfor ruta, og alt er lett å drive inn i når sikten går.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Ofoten på varsom.no. Ta med sender/mottaker, søkestang og spade — og isøks til toppblokka, stegjern hvis snøen er hard.'
    )
  )
where slug = 'rombakstotta';

update public.tk_tours set
  description_up   = 'Fra veibommen på Forselvveien over Djupvik — 60 moh, parkering ved bommen slik kilden sier — går du veien til veienden på 141 og opp den bratte skogen til vannverksveien. Skogen slutter på 502 moh etter 2,94 km. De fire første vegpunktene deler geometri med Rombakstøttas reviderte linje: dette er audited grunn.

Forbi Pumpvatnet på nordsida — vannet er naturlig tross navnet, 325 moh, og linja runder det på land etter tre omrutinger som står i forskningsposten — og opp bekkedalen mot Forsnesvatnet: 18,1 grader i beltet fra 500 til 600. Fri Flyts rute krysser Forsnesvatn på isen; vannet er regulert, så linja her tar østsida på land — beltene fra 800 til 1100 måler 18,4, 20,8 og 22,7 grader, turens jevnt bratteste strekk.

Fra flaten på 1200-nivået — beltet måler 4,2 grader over 1,3 kilometer — går det opp mot skaret mellom Moskočohkka og Tøtta, 1257 moh der linja tar det, og ryggen sørover til toppblokka: 38,4 grader mellom 1414 og 1445, de meterne som avgjør dagen. Varden på 1448; registeret løser 1447,8.',
  description_down = 'Ned samme vei — ryggen fra nordvest er den slake sektoren på toppen, 12,7 grader i snitt over 500 meter. Toppblokka tas i samme spor som opp, og flaten under skaret gir pusterom før de lange beltene ned mot Forsnesvatnet.

Sørøst-, sør- og østsiden faller 34,6 til 44,8 grader i snitt med 72 til 76 grader i de første 60-metersvinduene fra varden — kanten mot Beisfjorden er vegg. Isvannsrenna mot Straumsnes og Isbreen-nedfarten (~45 grader, med bre og kløfter) er kildens alternativer for stabile dager med følge som kan terrenget.

Kilden gir et annet startpunkt enn Djupvik: «man kan også starte turen fra Narvik og følge den populære turstien som leder inn i Tøttdalen fra minikraftverket nordøst for skiheisene. Stien fører fram til Pumpvatn. Herfra kan du følge turbeskrivelsen videre mot Beisfjordtøtta.» Den stien er kartlagt hele veien. Fra parkeringa ved Taraldsvikfossen på 205 moh går linja inn i Tøttadalen på 252 og 264, videre inn dalen på 306, og når Pumpvatnet på 331 — 4,86 km med skog, mot 300 meter opp den bratte lia fra Djupvik. Derfra er det samme rute: rundt vannet på land på 325 og 329, bekkedalen på 449, Forsnesvatnet på 655 og 858, opp mot skaret på 1135 og 1257, og ryggen sørover over 1317 og 1418 til varden. 1350 høydemeter på 9,08 km mot 1428 på 7,19 km fra bommen: 145 meter høyere start, nesten to kilometer lengre, og et mye mildere fjell underveis — bratteste hundremetersbelte 21,2 grader fra 1000 til 1100 moh, bratteste 30-metersvindu 27,0 grader mellom 884 og 904 mot 38,4 på normalruta. Toget eller taxien tilbake er ikke nødvendig herfra; bilen står i byen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt. Normalruta er den tålmodige linja på et fjell der alternativene har renner, is og bre — 22,7 grader i bratteste belte, og toppblokkas 38,4-graderssteg som eneste alvor. Skredfaren i rennene og ispartiene hører til variantene; les dem som grenser, ikke muligheter.'
    ),
    jsonb_build_object(
      'title', 'De regulerte vannene',
      'body',  'Forsnesvatnet og Isvatnet er begge regulerte. Fri Flyts rute krysser Forsnesvatn på isen — linja her går østsida på land, og det koster noen minutter og null risiko. Regulert is får sprekker langs land når magasinet tappes; det er ikke is å lære seg å kjenne.'
    ),
    jsonb_build_object(
      'title', 'Kanten mot Beisfjorden',
      'body',  'Fra varden faller sørøst 76 grader i det første 60-metersvinduet. I flatt lys er kanten og flaten like hvite — retningen ned er nordvest, tilbake mot skaret, og den er verdt å ha i kompasset før toppen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Beisfjordtøtta ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–juni er Fri Flyts. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'beisfjordtotta';

update public.tk_tours set
  description_up   = 'Fra Laupstad ved fylkesvegen — 5 moh, forbi bebyggelsen og opp dalen mot vest. Skogen slutter på 233 moh etter 1,66 km, og dalen tar deg til vannet på 289: beltet fra 100 til 200 moh måler 14,4 grader, og fra 200 til 300 bare 8,8.

Fra vannet fortsetter du mot høyre mot Morfjordskaret — registerets Morfjordskaret ligger i Hadsel, for her går kommunegrensa over fjellet — til den brede flanken som går opp mot Pilan. Beltet fra 400 til 500 måler 18,9 grader, så flater det av: 9,6 og 7,5 over de neste to hundre.

Toppkjegla er turens alvor: beltet fra 700 til 800 moh måler 21,8 grader over 275 meter grunn, og det bratteste sammenhengende partiet — 35,3 grader mellom 763 og 786 — sitter her. Sonderingene rundt kjegla sier at steget er terreng og ikke ruting: sør og sørvest måler 22,7 og 20,9 grader i snitt, nord og vest 42,3 og 46,5. Varden på 826; registeret leser 826,0 mot publiserte 828 — endå et smalt topparti der laserskannet leser et par meter lavt. Sautinden er tvillingtoppen samme tur kan kombinere.',
  description_down = 'Ned samme vei — den brede flanken mot sør-øst er store, oversiktlige linjer, og fra flata under kjegla er det slak kjøring tilbake til vannet og dalen. Steget i kjegla tas der du gikk opp, mens snøen ennå er der du leste den.

Hold flanken: nordsida mot Morfjorddalen er kildens eget farepunkt, og den måler 42,3 grader i snitt med 57,7 som bratteste vindu. Vest er samme historie — 46,5 i snitt. Det brede og snille terrenget har kanter, og de er alle på den andre sida.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 1 – Enkelt hos Fri Flyt, bratteste punkt under 30 grader — og det stemmer for det meste av linja, men ikke for toppkjegla: 35,3 grader i det bratteste 30-metersvinduet mellom 763 og 786 moh. Kortet bærer grad 3 på den målingen. Under 700 er dette en av de snilleste linjene i rundelen.'
    ),
    jsonb_build_object(
      'title', 'Kjegla',
      'body',  'Steget sitter rett under toppen, der snøen enten er innblåst eller avblåst. Med innblåst snø er det et lite, bratt heng med utløp mot flata; avblåst er det et par harde takter. Begge deler leses på ti sekunder fra flata under — gjør det før du står i det.'
    ),
    jsonb_build_object(
      'title', 'Mot Morfjorddalen',
      'body',  'Brattere terreng ned mot Morfjorddalen, sier kilden, og målingen gir 42,3 grader i snitt mot nord. Fra varden i flatt lys er flanken du kom opp og nordsida lette å forveksle de første metrene — retningen ned er sør-øst, og det er verdt å ha kompasskursen klar før skodda tar utsikten.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Pilan ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; feb–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'pilan';

update public.tk_tours set
  description_up   = 'Samme start som dronninga: parkeringa etter brua ved Nervatnet, 223 moh. Nervatnet er regulert — linja holder stien langs vannkanten på land, over myra sør for vannet og opp gjennom den glisne skogen. Skogen slutter på 532 moh etter 2,93 km, og de to første stigningsbeltene måler 14,9 og 16,4 grader.

Like etter tregrensa dreier du til høyre (nordvest) opp ryggen som leder til Litletind. Beltene fra 700 til 1000 måler 19,5, 17,9 og 19,9 grader — jevn skinning på åpen rygg med utsikten voksende bak deg.

Toppartiet er kildens ene forbehold: ryggen mot toppen er ofte avblåst og steinete, så den siste biten kan være kronglete. Det bratteste sammenhengende partiet måler 32,8 grader mellom 1045 og 1066 moh, og på hardpakke er det de meterne du merker. Varden på 1100 med Narvik, Rombaksfjorden og dronningprofilen bak deg.',
  description_down = 'Ned samme vei — sør- og sørvestsektoren linja bruker er den slakeste på toppen, 16,8 og 20,6 grader i snitt over 500 meter. Fri Flyts nedfart er oppstykkede fonner i lett varierende terreng.

Hold igjen mot øst og nordøst: 37,4 og 36,9 grader i snitt med vinduer på 57,7 og 49,0 rett under toppen — kanten mot Håkvikdalen. Sløret, den bratte fonna mellom Litletind og Dronninga, er skredterreng med stein i bunnen og hører til variantene, ikke normalturen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt. Linja selv er snill — 19,9 grader i bratteste belte, 32,8 i bratteste parti — og det som krever hodet er kantene: øst- og nordøstsiden faller 37 grader i snitt med vinduer over 49 rett under varden.'
    ),
    jsonb_build_object(
      'title', 'Toppartiet',
      'body',  'Ofte avblåst og steinete — skliproblem, ikke skredproblem. På hard vestavindsskare kan de siste 60 meterne være stedet skiene står igjen.'
    ),
    jsonb_build_object(
      'title', 'Reindrifta og vannet',
      'body',  'Området brukes i reindriftsnæringen — hold avstand og band på hunden. Og Nervatnet er regulert: stien langs land begge veier, uansett hvor fin isen ser ut.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Litletind ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'litletind';

update public.tk_tours set
  description_up   = 'Start ved vegenden i Geitgallien ved Skinvollen innerst i Austnesfjorden, 20 moh. Følg lysløypa et stykke og videre inn i Lilandsdalen gjennom bjørkeskogen. De første åtte hundre meterne stiger knapt — 6 grader i snitt — og det er den eneste flate delen av turen.

Fra rundt 250 moh bratner dalen til ei renne som holder 35 grader opp til 360 moh; den kartlagte stien måler 34,8 grader mellom 290 og 350 moh. Over renna slakner det igjen, og du følger dalen oppover i 17 til 20 grader til rundt 620 moh, der elveleiet bratter til. Dalbunnen under renna er terrengfelle: går det noe over deg her, er det ingen veg til sida.

Der elveleiet bratter til går en tydelig rampe opp mot høyre inn i den store skålformasjonen på rundt 845 moh — toppen av sørrenna. Dette er et klassisk utløpsområde, og stoppestedet velges her, ikke midt i skåla. Videre mot skaret og opp til 928 moh, der det bratter til for godt: bratteste sammenhengende parti på skisporet måler 34,8 grader. Over 1000 moh er tallene for skisporet ikke lenger tall for terrenget: fallinja der måler 33 til 50 grader.

De siste 157 høydemeterne til toppen på 1085 moh ligger på 42 grader i snitt, men snittet skjuler toppblokka: de øverste seksti høydemetrene måler 40 til 50 grader. Det er klyving med stegjern og isøks, ikke skikjøring. Rett sør for varden faller terrenget nær 70 grader.',
  description_down = 'Har du én bil, kjører du ned samme vei: fra toppen ned til 928 moh til fots, så skåla, rampa ned til dalen på 620 moh, renna fra 360 til 250 moh og ut Lilandsdalen. Renna er den delen som må vurderes på nytt på vei ned — den har vært over deg hele veien opp, og i sola kan den ha endret seg mens du var på toppen.

Vanligste feil: å ta sørrenna uten å ha ordnet transport. Den er den dokumenterte nedkjøringa, rundt seks hundre høydemeter på 35 til 40 grader, men den kommer ut i en annen dal og krever bil nummer to. Den andre feilen er å regne toppen som mål uansett forhold: er ryggen isete, er de siste 174 metrene en klyvetur på 42 grader med ski på sekken, og snuvedtaket tas på 928 moh.

Området går store skred flere ganger hver vinter. Det er ikke en tur du tar på et middels varsel fordi du har reist langt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Hele ruta ligger i skredterreng. Renna på 250 til 360 moh er 35 grader med dalbunnen som terrengfelle under, skålformasjonen over sørrenna er et klassisk utløpsområde, og de øverste 157 høydemetrene ligger på 42 grader i snitt, de siste seksti på 40 til 50. På selve linja måler bratteste sammenhengende parti 34,8 grader, men de tallene gjelder skisporet opp dalen. Over 1000 moh måler fallinja 33 til 50 grader, og gjennomsnitt er uansett feil verktøy her: det finnes ikke noe sted på ruta der du ikke har noe over deg.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Rett sør for toppen faller terrenget nær 70 grader — 65 til 72 målt i tjuemeterssteg de første hundre høydemetrene. Sørrenna, som brukes som nedkjøring, holder 35 til 40 grader over rundt seks hundre høydemeter og ender i en annen dal enn den du kom opp. Topptursentralen graderer linja KAST 4 — ekstremt, og fører opp snøskred, utløpssone og terrengfelle som farer. Området går store skred flere ganger hver vinter.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'geitgaljen';

update public.tk_tours set
  description_up   = 'Fra parkeringa etter brua ved Nervatnet — 223 moh, E6 sørover fra Narvik og inn Håkvikdalen; lokalbussen til brua er kildens eget alternativ. Nervatnet er regulert, så linja holder stien langs vannkanten på land — kilden tilbyr isen «om den er stabil», og det tilbudet takker dette produktet alltid nei til. Over myra sør for vannet og opp gjennom den glisne skogen: skogen slutter på 546 moh etter 2,96 km.

Like etter tregrensa dreier du til høyre opp ryggen mot Litletind, følger forsenkningen rundt den og traverserer på skrå opp til ryggen mellom Litletind og Dronninga — 945 moh der linja tar den. Beltene er tålmodige: 12–13 grader fra 600 til 900, så turens bratteste hundremeter, 20,3 grader fra 1000 til 1100.

Fra rundt 1200 traverseres det inn på vestsidene. Her er terrenget tidvis bart og steinete — regn med å gå til fots i partier, og det er her isøksa og stegjerna i sekken slutter å være pynt. Snørenna leder opp til ryggen nordvest for hovedtoppen: det bratteste sammenhengende partiet måler 33,7 grader mellom 1439 og 1462 moh, og beltet fra 1400 er ellers slakt fordi traversen skrår. Varden på 1576 — registeret løser 1575,8 mot publiserte 1575 — med Ofoten, Frostisen og havet rundt deg.',
  description_down = 'Ned samme vei: renna, traversen, ryggen. Ryggen nordvest for toppen er den eneste slake sektoren på fjellet — 13,2 grader i snitt over 500 meter — og alt annet faller 23 til 45 grader i snitt med vinduer på 43 til 68. Traversen tas i samme spor som opp, mens du fortsatt vet hvor steinene var.

«Øyet» er kildens alternative nedfart: en trang snørenne på 45–50 grader med is og eksponerte klipper, der rutevalget er kritisk. Den står her fordi den finnes — ikke fordi den anbefales fra dette kortet.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, men graden på kortet er 4: bare, steinete vestsider med gange til fots, isøks og stegjern i utstyrslista, 33 høydemeter gitt tilbake på traversen, og en snørenne på 33,7 grader som siste nøkkel. Dette er Slogen-klassen — en fjelltur på ski, ikke en skitur med topp.'
    ),
    jsonb_build_object(
      'title', 'Renna og vestsidene',
      'body',  'Renna mellom 1439 og 1462 moh er bratt nok til å skride, og vestsidene samler snøen etter østavind. Bart berg og is veksler med fonner — vurder hver overgang, og snu der føret sier snu; dronninga ligger der neste helg også.'
    ),
    jsonb_build_object(
      'title', 'Nervatnet',
      'body',  'Vannet er regulert, og regulert is er upålitelig is: linja holder stien langs land, og det bør sporet ditt også — begge veier, også når isen «ser fin ut» i mars.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skjomtinden ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts. Sender/mottaker, søkestang, spade — og isøks og stegjern, som kilden selv krever.'
    )
  )
where slug = 'skjomtinden';

update public.tk_tours set
  description_up   = 'Fra kraftstasjonen ved E10 — OSM har Kvitfossen kraftverk kartlagt på Midnattsolveien, med busstopp ved veien, og fjorden leser 4 moh. Du sikter mot toppen i retning nordvest og går inn marka mot dalbunnen: beltet fra 0 til 100 moh måler 5,5 grader over den første kilometeren, og skogen slutter på 262 moh etter 1,54 km.

Så tidlig som mulig inn i dalen og opp langs venstresida mot vannet i forsenkinga — prøvepunktet ved linja leser 352,9 moh der kildens «lite vann» ligger. Beltene er jevne: 19,6 grader fra 100 til 200, 20,4 fra 300 til 400, 19,4 fra 400 til 500 — dalen er en trapp, og den er grunnen til at snøen ligger her.

Fra vannet krysser du mot skaret til høyre for toppen — 568 moh der linja tar det — og følger ryggen den siste biten. Beltet fra 700 til 800 er turens bratteste, 21,6 grader, med det bratteste sammenhengende partiet på 28,1 mellom 721 og 745 moh. Varden på 755; registeret har to Torskmannen i Vågan, og denne — toppsøket løser 755,2 — er den kilden beskriver; navnebroren lenger sørvest leser 717,6.',
  description_down = 'Normalen er dalen tilbake — sporene fra turen opp, sier kilden. Nedfartsaspektet er sørøst: flanken måler 30,8 grader i snitt med 49,2 som bratteste vindu 40 til 100 meter ut, så de første svingene fra ryggen tas med høyde for hvor du slipper deg ut.

Sørvest- og vestsida er en annen verden: 40,7 og 40,0 grader i snitt med vinduer på 67,4 og 62,7 rett under toppen. Nedfartsalternativene fra ryggen ligger i skredterreng, sier kilden — de er der for dager som tåler dem.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, bratteste punkt 35 grader — og linja måler 28,1 der den er brattest, fordi den tar skaret og ryggen i stedet for flanken direkte. Dalen er skjermet for vind, og det betyr også at den samler snøen vinden flytter: les innlastingen i hengene over deg på veien opp.'
    ),
    jsonb_build_object(
      'title', 'Toppen',
      'body',  'De siste metrene mot varden er ofte avblåste og harde — glatt berg og hardpakke, ikke skredproblem men skliproblem. Nordøstsektoren linja kommer fra er den slake (12,7 grader i snitt); alt vest og sør for varden faller 40 grader eller mer i snitt.'
    ),
    jsonb_build_object(
      'title', 'Nedfartsalternativene',
      'body',  'Fra ryggen finnes brattere varianter rett ned — kilden kaller det skredterreng, og sørøstflanken under toppen har et vindu på 49,2 grader. Normalturen har ikke noe der å gjøre; variantene hører til stabilitet du har målt, ikke håpet på.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Torskmannen ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'torskmannen';

update public.tk_tours set
  description_up   = 'Fra parkeringsplassen ved Vatterfjordpollen på E10, ti kilometer fra Svolvær mot Fiskebøl. Linja på kartet begynner på vestsida av den lille brua over strømmen — terrengmodellen fører sundet som sjø, og brua finnes ikke i den, så spaserturen over brua fra parkeringa står her i stedet for i geometrien. Så langs høyresida av pollen og innover marka mot fjellfoten: beltet fra 0 til 100 moh måler 3,1 grader over nesten to kilometer, og skogen slutter allerede på 94 moh etter 1,88 km.

Fra fjellfoten opp på sørryggen — beltet fra 100 til 200 moh er turens bratteste, 18,4 grader over 271 meter grunn — og så nordover langs ryggen til den dreier vest. Ryggen er kupert: 44 høydemeter gis tilbake underveis, og beltene ligger på 10 til 15,2 grader — jevn, lesbar skinning med Austnesfjorden på den ene sida og Higravstindan i synsranda.

Der ryggen dreier vest — 641 moh der linja tar svingen — venter det siste: 15,1 grader i beltet fra 700 til 800, med det bratteste sammenhengende partiet, 29,1 grader, mellom 644 og 663 moh. Varden på 803; registeret og toppsøket løser 802,6.',
  description_down = 'Normalen er ryggen tilbake — sørsektoren måler 13,7 grader i snitt over 500 meter, og de mange variantene er grunnen til at turen tåler å gås igjen. Hold igjen der ryggen slutter: nedkjøringen mot Vatterfjordpollen kan være skredutsatt, brattest om du tar tidlig av ryggen mot venstre på sørsida, sier kilden.

Fra Kudalen på nordsida ligger det ofte hard is mot slutten — kilden ber deg ta med stegjern og isøks om du skal den veien. Nordvestsida har et 60-metersvindu på 64,8 grader; det er ikke en side man improviserer på.

Kildens startsted-linje navngir Kudalsheia først og setter Vatterfjordpollen — ruta over — som «alternativ startsted». Fra avkjørselen mot Kudalsheia er det 797 høydemeter og 3,29 km: opp på heia, 406 moh, langs ryggen til den forsvinner inn i fjellet, opp dalen og gjennom skaret på 716 til siste ryggen mot toppen. Det er halvannen kilometer kortere enn ruta fra Vatterfjordpollen, og bratteste steget måler 28,1 grader mellom 664 og 680 moh mot 29,1 på hovedruta. Faremomentet kilden nevner for denne sida er føret: «Fra Kudalen på nordsiden er det ofte steinhard skare siste kneika, ta med stegjern og isøks.»',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Ingen KAST hos Fri Flyt (eldre sideformat), men regelen hans er presis: hold deg på toppen av ryggen, for området rundt er skredutsatt. Målingen sier det samme — sørsektoren 13,7 grader i snitt, alle andre kanter med vinduer på 40 til 65.'
    ),
    jsonb_build_object(
      'title', 'Nedkjøringen mot pollen',
      'body',  'Kildens eget farepunkt: brattest der man tar tidlig av ryggen mot venstre på sørsida. Sørsidas bratteste vindu ligger 350 til 410 meter ut fra toppen og måler 38,2 grader — det er dit den fristende snarveien fører. Ryggen hele veien ned koster ti minutter og ingenting annet.'
    ),
    jsonb_build_object(
      'title', 'Isen fra Kudalen',
      'body',  'Nordsida bærer ofte hard is mot slutten — stegjern og isøks om du skal den veien, sier kilden. Det er variantterreng, ikke normalveien, og det står her fordi den som leser dette i Svolvær kommer til å høre om den.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Rundfjellet ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'rundfjellet';

update public.tk_tours set
  description_up   = 'Fra parkeringa langs Kleppstadveien på sørsida før Gimsøybrua — 16 moh, med registerets Kleppstad et par hundre meter unna. Du legger sporet opp langs ryggen mot punkt 156: her sitter turens bratteste parti, 32,9 grader mellom 111 og 136 moh, i skogen — beltet fra 100 til 200 måler 20,2 grader, og skogen slutter på 232 moh etter 1,17 km.

Over skogen er det flata som eier turen: 20,9 grader fra 200 til 300 moh, 19,1 fra 300 til 400, og så slaker det av mot toppen — 7,9 grader i det siste beltet. Brei rygg, valgfritt spor, og terrenget som læremester: hver kul og hvert søkk er en beslutning om hvor sporet skal ligge.

Varden på 534 — Fri Flyts publiserte GPS-punkt er registerets Kleppstadheia på meteren, og toppsøket løser 533,9. Prominensen er beskjeden, utsikten er det ikke.',
  description_down = 'Ned samme vei, med sporvalget i revers: flata tåler alt, og skogbrattet nederst er den ene plassen svingene skal sitte. Sørvest er nedfartsaspektet, og sektoren måler 12,8 grader i snitt.

Kildens farepunkt er partiene med bratt terreng langs sørsida av ryggen lenger nede — og ved toppen er det nord-, nordøst- og østsida som er kantene: 34,6 til 37,9 grader i snitt med vinduer på 45 til 56. Normalsporet på ryggen og flata er unna alt sammen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Enkel hos Fri Flyt, bratteste punkt under 30 grader på flata — linjas 32,9-graderssteg ligger i skogen nederst, kort og lesbart. Dette er turen for dager da varselet fraråder bratt terreng, og øvingsturen for alle andre dager.'
    ),
    jsonb_build_object(
      'title', 'Kantene',
      'body',  'Kilden peker på bratte parti langs sørsida av ryggen; målingen ved toppen legger til at nord-, nordøst- og østsida faller 34,6 til 37,9 grader i snitt med vinduer opp mot 56. Flata er romslig — bruk rommet, og hold kantene på armlengdes avstand i flatt lys.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Kleppstadheia ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell fra naboturene. Ta med sender/mottaker, søkestang og spade — også på øvingsturen.'
    )
  )
where slug = 'kleppstadheia';

update public.tk_tours set
  description_up   = 'Fra E10 vest for Kabelvåg tar du over brua med skilt mot Eidet; den kartlagte Karlsvågen-parkeringa ligger om lag 400 meter fra hovedveien, på 2 moh. Lysløypa — Damveien — begynner 120 m nordøst og går nordover dalen langs østsida av Karlsvatnet.

Vannene avgjør den første kilometeren, og de fortjener hver sin setning: Karlsvatnet ligger på 12 moh en snau kilometer fra havet, og Stor-Kongsvatnet innenfor er regulert — begge er målt, og linja står ikke på noen av dem. Den forlater løypa før vatnet og krysser det tørre eidet mellom de to på 29 moh, over myra vest for det på 24, og bort til foten av Aksla på 20 moh. 0 meter på vann, målt mot Kartverkets klasser og OSM-polygonene.

Aksla er ryggen opp: fra foten på 20 moh til 141, videre til rett under Ørntinden på 342 — skogen slutter allerede på 219 moh etter Kartverkets klasser, så mesteparten av ryggen er åpen. Fri Flyt sier «Hold til høyre rundt toppen av Aksla» — ryggen han kaller Aksla står som Ørntindaksla i registeret og topper på 316 moh — og målinga sier hva omveien koster: skaret vest for den leser 293 moh, om lag 24 høydemeter å gi tilbake mot å klyve over. Ørntinden selv, 398 moh, ligger sør for skaret og blir liggende igjen.

Fra skaret holder linja vestover flanken: 341, 441 og 565 moh på vei mot toppen, med det bratteste hundremetersbeltet — 22,8 grader i snitt — mellom 600 og 700. Fri Flyt advarer om at henget rundt den øvre linja stiger 35–40 grader; sporet holder seg slakere, men flankene ved siden av gjør ikke. En kartlagt sti går også til toppen, og linja er ikke på den her: mellom 3,87 og 4,34 km ute ligger den opptil 367 meter fra stien, før de møtes igjen på 602 moh. Stien står som fotsti i OSM uten vinterstatus, og i sjiktet 330 til 470 moh er den den slakeste av de to — bratteste tretti-metersteget dens måler 20,8 grader mot linjas 24,9.

Varden på 700 moh — registeret har både Varden (Ås) og Småtindan (Fjell) på toppunktet, og den klatra cella leser 700,5 mot publiserte 700. Massivets høyeste punkt er forresten en annen tind — Stortinden, 732 moh, 600 meter lenger sørvest; turmålet er Varden, og det er dit skisporet går.',
  description_down = '«Samme rute ned for maksimal sikkerhet», sier kilden, og nedkjøringa begynner forsiktig: rett rundt varden stuper det i nesten alle retninger — nordvest 60,7 grader og vest 53,8 bare 20–80 m ut, øst 49,3 grader 10–70 m ut. Fri Flyt sier selv at kjøringa begynner om lag 50 meter under toppen, og målingene er enige.

Fra flanken er det jevn kjøring ned til skaret og rundt Ørntinden — beste partiet er fra toppen ned mot Aksla, sier kilden — og så ryggen ned til eidet. Husk gjenstigningen: skaret og eidet gir deg om lag 50 og 20 høydemeter å ta igjen på hjemveien.

Vestsidevarianten mot Lyngvær, som kilden nevner, krever tilrettelagt transport fra Olderfjorden og er ikke denne linja. Fra eidet er det løypa langs Karlsvatnet tilbake til parkeringa — på land hele veien.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt setter KAST 2 – Utfordrende, og målinga av linja sier 38,3 grader som bratteste sammenhengende parti — det ligger lavt, mellom 129 og 156 moh på ryggen opp — og 22,8 grader som bratteste hundremetersbelte, mellom 600 og 700 moh. Hans egen advarsel gjelder flankene: «i øvre deler stiger henget 35-40 grader bratt» — det er terrenget rundt sporet, og linjevalget på den øvre flanken er der dagen blir avgjort.'
    ),
    jsonb_build_object(
      'title', 'Kolbeindalen og skytebanen',
      'body',  'Fri Flyts faremoment for nettopp denne ruta er linja selv: «Skredutsatte områder i øvre deler ned fra salen». Salen er skaret på 293 moh, og de øvre delene er flanken linja går opp og ned — bratteste hundremetersbeltet 22,8 grader, og flankene ved siden av 35–40 etter Fri Flyt selv. Den andre beskrivelsen hans legger til dalen nord for ryggen: «Skredfare i Kolbeindalen», skytebane i botnen, og «midt i dalen – der elva renner – er det tidvis svært stor skredfare». Varianten «inn til Store Kongsvatnet» går inn i den; denne linja gjør det ikke — men salen den krysser er kildens eget skredpunkt.'
    ),
    jsonb_build_object(
      'title', 'Toppen',
      'body',  'Varden er en tind, ikke en hei: nordvestsida faller 60,7 grader og vestsida 53,8 bare 20–80 m fra varden, østsida 49,3 grader 10–70 m ut, og sørsida 57,9 grader 220–280 m ut. I skodde er toppartiet et sted å snu tidlig — det finnes ingen slak sektor å rote seg ut i.'
    ),
    jsonb_build_object(
      'title', 'Vannene og været',
      'body',  'Karlsvatnet ligger på 12 moh ved kysten og Stor-Kongsvatnet er regulert — isen på det første kan ikke forutsettes, og på det andre skal den ikke brukes. Linja krysser eidet mellom dem på land, målt punkt for punkt. Varden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel — sjekk varsom.no. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre Lofoten-turer, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'varden-smaatindan';

update public.tk_tours set
  description_up   = 'Fra parkeringen på Hauklandstranda, seks meter over havet, går du nordover mot søndre munning av tunnelen til Utakleiv. Ikke gjennom tunnelen: ta serviceveien som klatrer nordøstover over den, forbi Klumpan, og følg den til den flater ut på benken på 150 moh ved munningen av Durmålsdalen. Her starter den merkede stien, og den går hele veien opp til varden på 931. Parkeringa er avgiftsbelagt året rundt og betales i automat eller app; den er timepriset og tidsbegrenset for å holde omløpet oppe på stranda, så betal for hele turen før du går.

Videre nordøstover opp sørsida av Durmålsdalen. Terrenget er åpent hele veien — det er ingen skog på denne turen — og linja legger seg i lange sikksakk opp mot skulderen ved Molheia. Det brattner fra 300 moh: beltene fra 300 til 700 moh ligger på 21,7 til 23,2 grader i snitt, og bratteste steget på linja måler 28,4 grader, mellom 666 og 687 moh. Ikke skjær rett opp vestflanken av toppryggen; den ligger på 34 til 37 grader i snitt med partier opp mot 46. Høyden tas på skulderen på sørsida.

Fra Molheia rundt 800 moh er det bare tretti meter opp til fortoppen på 830 og den vesle flata der. Det er det siste brede stedet på turen — sørøst for flata faller terrenget 38 grader i snitt. Herfra og ut er du på rygg.

Fra flata går ryggen nordover, og den er smal. Følg krona til varden på 931. Ikke gå ut på østsida — der ligger store hengskavler over svært bratt lende: østflanken under varden måler 42 grader i snitt, sørøstflanken 44, med partier på 54 til 57. Videre nordover faller ryggen til 898 moh og stiger så mot hovedtoppen, som måler 956 moh i terrengmodellen. Et militært radaranlegg står på ryggen på 936 moh, vel hundre meter før toppen; området rundt det er sperret, så følg krona forbi og rett deg etter skilting på stedet.',
  description_down = 'Tilbake langs ryggen til fortoppen, på krona eller like vest for den. Derfra har du snaut sju hundre sammenhengende høydemeter ned den brede Durmålsdalen til benken på 150 moh. Vil du ha en variant, svinger du til høyre ned i Øvredalen like før fortoppen og følger ryggsida mellom dalene til det flater ut rundt 600 moh, og derfra tilbake til venstre inn i Durmålsdalen.

Vanligste feil: å følge Durmålsdalen helt ned. Da kommer du ut på Utakleiv-sida med tunnelen mellom deg og bilen. Hold til høyre når dalen flater ut rundt 150 moh og ta serviceveien over tunnelen tilbake til Haukland.

Lehengene mot øst og sør er bratte og ligger rett under skavlene på toppryggen. De faller åtte hundre høydemeter ned til anleggsveien på sør- og østsida av fjellet, som ligger mellom 75 og 180 moh — ikke i Durmålsdalen. Velg dem bevisst, ikke fordi du kom skjevt ut fra ryggen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nedre halvdel er slak og åpen. Det brattner fra 300 moh: beltene fra 300 til 800 moh holder 19,4 til 23,2 grader i snitt, brattest mellom 500 og 600 moh. Bratteste steget på linja måler 28,4 grader, mellom 666 og 687 moh. Fra fortoppen og nordover er ryggen smal, med et fall til 898 moh og femti meter opp igjen før hovedtoppen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Østsida av toppryggen bærer store, permanente hengskavler over svært bratt lende. Målt fra varden faller østflanken 42 grader i snitt og sørøstflanken 44, med enkeltpartier på 54 til 57. Hold deg på krona eller like vest for den hele veien fra fortoppen og nordover. Vestflanken over Durmålsdalen ligger på 34 til 37 grader i snitt med partier opp mot 46, og skal ikke skjæres direkte, verken opp eller ned.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'himmeltindan';

update public.tk_tours set
  description_up   = 'Fra parkeringa utenfor kraftstasjonen — OSM har Skarelva kraftverk kartlagt, stasjonen med glass- og natursteinsfasaden kilden beskriver, 19 moh. Anleggsveien følger Vesterskarelva opp dalen: beltet fra 100 til 200 moh måler 17,3 grader, og du følger bekken til den lille dammen ved tregrensa på 539. Skogen slutter på 600 moh etter 2,56 km.

Fra dammen dreier du til høyre gjennom skogen mot nordvest, og over tregrensa går det diagonalt til den tydelige hylla på rundt 800 moh — prøvepunktet over hylla leser 1067. Beltene fra 700 til 1000 måler 19,2, 19,6 og 20,0 grader: jevnt, aldri bratt, alltid oppover.

Fra hylla holder du samme retning på de slakeste bakkene og tar toppen via nordøstryggen. Det bratteste sammenhengende partiet måler 26,0 grader mellom 1155 og 1174 moh. Varden på 1318 — registeret løser 1318,5, koordinaten flyttet 200 meter fra representasjonspunktet til toppunktet — med Frostisen i sør og Skjomen under deg.',
  description_down = 'Normalruta ned er sporet ditt opp — en fin rute med god plass ovenfor tregrensa, sier kilden, og sørvestsektoren måler 9,6 grader i snitt. Se opp for skred sør for toppen og hull i bekken seint i sesongen — kildens egne ord, og bekkedalen er der begge bor.

Gangnesrenna er kapittelet for seg: rundt 40 grader i starten, ispartier fra bekkeløpet og skredaktivitet lenger nede, isøks, stegjern og eventuelt tau i kildens utstyrsliste, og en labyrintisk utgang langs fjordkanten til Skjombotn. Kanten mot renna måler 59,9 grader i det første 60-metersvinduet. Tusen meter rett ned mot fjorden — for dager og folk som har målt seg mot mindre først.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt. Normalruta på sørsida er jevn — 20,0 grader i bratteste belte, 26,0 i bratteste parti — og farene kilden navngir er skred sør for toppen og hull i bekken seint i sesongen. Bekkedalen er både oppspor og utløp; les hengene over den.'
    ),
    jsonb_build_object(
      'title', 'Gangnesrenna',
      'body',  'Rundt 40 grader øverst, is fra bekkeløpet, skredaktivitet nederst — og 59,9 grader i det første vinduet fra kanten. Renna har egen utstyrsliste hos kilden (isøks, stegjern, eventuelt tau) og eget alvor. Fra normalruta er den en utsikt, ikke en snarvei.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Gangnesaksla ligger i varslingsregionen Ofoten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen februar–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'gangnesaksla';

update public.tk_tours set
  description_up   = 'Fra gården Justad ved fv. 815 — 14 moh på dyrket mark, med parkering langs veien slik kilden sier. Lia over gården er åpen praktisk talt fra fjæra: terrengklassene langs linja har ingen sammenhengende skog i det hele tatt, så hele turen er lesbar fra bilen. Beltet fra 0 til 100 moh måler 11,7 grader.

Linja følger ryggformasjonen nordover over Skjærheia: beltet fra 300 til 400 moh er turens bratteste, 22,6 grader over 250 meter grunn, med det bratteste sammenhengende partiet — 29,8 grader — mellom 363 og 389 moh. Over 400 slakner det til 11,0 før de øvre beltene legger seg på 17–20 grader.

Toppartiet er lekent: småformasjoner og valgfrie linjer opp mot varden på 736 — registeret leser 735,7 der Fri Flyt og kartet skriver 738, et smalt topparti der laserskannet leser et par meter under det publiserte tallet. Hold deg vest for kanten: nordøstsida under varden faller 41,0 grader i snitt med 64,9 grader som bratteste 60-metersvindu bare 10 til 70 meter ut.',
  description_down = 'Normalen er sporet ditt opp, og vestsida er den slakeste sektoren — 21,7 grader i snitt med 30,1 som bratteste vindu. Oktoberflanken midt på ryggen er kildens nedfartsvariant for mer fall per sving.

Sørnedfarten er der kilden sier de større skredene går, og målingen er enig: 34,8 grader i snitt med 50,0 grader som bratteste vindu 110 til 170 meter ut. Den hører til stabile dager — og hengskavlene mot nordøst gjør kanten til noe du holder avstand fra uansett føre.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Ingen KAST hos Fri Flyt — Lofoten-sidene er eldre enn klassifiseringen — men linjas egne tall er snille: 22,6 grader i bratteste belte, 29,8 i bratteste parti. Terrenget rundt er det som krever hodet, og det er grunnen til at kortet bærer grad 2.'
    ),
    jsonb_build_object(
      'title', 'Skavlene mot nordøst',
      'body',  'Kildens eget farepunkt: hengskavler mot de brattere partiene mot nordøst. Nordøstsida faller 41,0 grader i snitt med 64,9 som bratteste vindu rett under varden — en skavl som losner der har vegg under seg. I flatt lys går sporet et par svingemonner vest for kanten.'
    ),
    jsonb_build_object(
      'title', 'Sørsida',
      'body',  'De større skredene går på sørnedfarten, sier kilden — 34,8 grader i snitt, bratteste vindu 50,0. Etter pålagring fra nord og vest er sørsida lesida, og da er oppsporet langs ryggen den eneste linja turen trenger.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Justadtinden ligger i varslingsregionen Lofoten og Vesterålen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt oppgir ingen sesong; jan–apr på kortet er redaksjonell og hentet fra naboturene, og det står her. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'justadtinden';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved skianlegget i Nappskaret, en kilometer vest for Napp, går du nordover og holder deg til venstre for skitrekket. Rett over øvre trekkstolpe, ved 139 moh, samles stiene fra de ulike parkeringene til ett spor — starter du fra den vestre parkeringen drøyt 250 meter unna, kommer du inn på det samme sporet her. Fra 61 moh og opp er du over skoggrensa hele veien; det finnes ikke skog på denne ruta.

Sporet svinger nordøst inn i dalen mellom Okstinden og Litlnappstinden og krysser Myrlandselva rundt 215 moh. Videre opp dalen til søkket ved Skarvatnet, det islagte tjernet på 341 moh. Hold til venstre opp mot Middagstinden, og legg deg deretter mot høyre der terrenget heller slakest — det er den linja som tar deg opp uten å komme borti sørflanken.

Over 500 moh reiser terrenget seg til et kort, bratt trinn opp på ryggen ved 560 moh. Hundremeterssjiktene ligger tett på hverandre: det bratteste, 600 til 700 moh, holder 17,1° i snitt, og nede i dalen mellom 200 og 300 moh er det 16,7°. Bratteste enkelttrinn på hele linja måler 25,1°, og det ligger nettopp her — mellom 498 og 530 moh. Over trinnet flater det ut, og fra rundt 724 moh går den brede toppflata østover som en 13 graders rampe inn mot varden.

Varden på 741 moh står på kanten av østveggen. Stopp ved varden. Toppen bærer store hengskavler mot øst, og øst- og nordøstsida over Napp og Perklubben faller 42–43° i snitt med bergband over 60° — det er stup, ikke en linje.',
  description_down = 'Ned samme vei. Dalen mellom Okstinden og Litlnappstinden gir variert kjøring, og fra søkket ved Skarvatnet er det åpent hele veien ned til trekket.

Vanligste feil: å slippe seg sørover fra toppflata fordi det ser kortere ut. Sørsida rett under toppen faller nær 39° i snitt, med partier over 50°, og det er der skredene går på dette fjellet. Hold vestover i stedet — vest er den slakeste sida av fjellet, 22° i snitt — og følg oppstigninga tilbake til søkket.

Femti meter fra varden tar du til venstre, rett sør, inn i renna: 40° og 400 meter lang, og den munner ut i et bredere parti rett over Litlnappstinden. Det er en egen avgjørelse, ikke en snarvei.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigninga gjennom dalen er slak: ingen hundremeterssjikt på ruta holder mer enn 17,1°, og det bratteste er 600–700 moh. Men snittet skjuler trinnet opp på ryggen: bratteste enkelttrinn på linja måler 25,1° mellom 498 og 530 moh, kort og bratt. Det er de partiene som kan løsne på normalruta.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Toppen bærer store hengskavler mot øst, og øst- og nordøstsida over Napp og Perklubben faller 42–43° i snitt med bergband over 60°. Sørflanken rett under toppen holder nær 39°, og renna sør for varden 40° over 400 meter. Vestover er fjellet slakest, 22° i snitt. Går du utenom normalruta, er det disse du velger mellom.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'stornappstinden';

update public.tk_tours set
  description_up   = 'Start ved bommen ved Heggmoen, 24 moh, der skogsvegen tar av fra Vatnveien. Fri Flyt: «Parkér ved bommen og følg skogsveien nordover ca 1,5 km til du treffer et veikryss med skiltet «Advarsel. Isen usikker». Ta inn veien til venstre, følg forbi et lite pumpehus og fortsett sti/åpent spor ca 300 meter til en stor åpen slette.» Det krysset er der skogsvegen ender etter 1,44 km og vegen mot dammen ved Heggmovatnet går til venstre. Linja tar av tidligere: den forlater skogsvegen 0,9 km før krysset, der et spor går til venstre ved 0,53 km og 95 moh, følger sporet vestover og er ved foten av ryggen vest for søkket ved 1,03 km og 196 moh. Pumpehuset og sletta ligger på Fri Flyts trasé, ikke på linja.

Fri Flyt: «Vurder forholdene i søkkformasjonen mellom 300-400 moh med tanke på skred. Alternativt trekk ut på ryggen heiskars venstre for søkket.» Linja går den ryggen, og søkket ligger øst for den. Bratteste sammenhengende parti på turen er nederst på ryggen, 25,1 grader mellom 159 og 180 moh. Bandene fra 300 til 500 moh måler 15,1 og 15,9 grader, og 49 meter sørøst for linja ved 263 moh står celler på 59,2 grader.

Fra 430 moh går linja langs vestkanten av halfpipen, ikke i den: bakken faller 25 til 43 meter innen 100 meter mot øst og sørøst, mens den er flat eller stiger mot vest. Fri Flyt: «Følg skålformasjonen til 700 moh». Peakbook om halfpipen: «Et lite søkk som samler mye snø. Lang er den også.» Fra 542 moh går linja 6 til 46 meter fra den kartlagte sommerstien, helt til toppen. Bandet fra 500 til 600 moh er det bratteste, 16,8 grader.

På 700 moh står klippefremspringet. Fri Flyt: «På 700 moh kan du nå toppen via sørvestflanken (høyre side av klippefremspring) eller vestryggen (venstre side av klippefremspring).» Linja går vestryggen, til venstre, fra 709 moh ved 3,07 km; sørvestflanken er Fri Flyts 30-gradersalternativ. Ved fremspringet går linja tett på kanten: bakke på 45 grader eller brattere står 10 til 15 meter øst for linja mellom 708 og 718 moh, og ved 717–724 moh krysser linja 16 meter bakke på 35 grader eller mer, med bratteste celle 38 grader. Fri Flyt: «Vær oppmerksom på skavlkanten på toppeggen.» Fra 777 moh til toppen står bakke på 45 grader eller brattere 21 til 29 meter nord og nordøst for linja; hold deg sør for kanten. Ut.no: «pass deg for kanten mot nord».',
  description_down = 'Fri Flyt: «Følger samme vei ned som alternativet du valgte opp.» Går du ned linja, er det vestryggen og ryggen vest for søkket. Fri Flyts nedkjøring 1.2 går sørvestflanken øverst: «Sørvestflanken like under toppen er 30 grader bratt. Følg denne ned men hold skikjørers høyre og rund under klippefremspringet og hold høyden i en travers mot høyre til starten av skålformasjonen (halfpipen).» og «I enden av halfpipen på 400 moh bør du velge skikjørers høyre for søkkformasjonen videre dersom skredforholdene er uoversiktlige». Fri Flyt: «På 200 moh bør du begynne å tenke skikjørers høyre for å holde høyden slik at du kan gli ut til skogsveien som tar deg ned til parkeringen.»

Toppen faller bratt mot nord og nordøst: 58,9 grader 40 til 100 meter ut mot nord og 55,8 grader 20 til 80 meter ut mot nordøst. Mot vest er den slak, 13,8 grader i snitt over 500 meter. Sydrenna mot Heggmovatnet er en egen nedkjøring, «Moderat», 35 grader mellom 500 og 300 moh og en terrengfelle. Fri Flyt om den: «Sent på sesongen må du spesielt ta hensyn til vårskred».',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 25,1 grader mellom 159 og 180 moh, og bratteste bandet 16,8 grader fra 500 til 600. Bakken under linja er 35 grader eller brattere i ett strekk på 16 meter ved 717–724 moh, ved klippefremspringet. Fri Flyt oppgir 30 grader som bratteste punkt, i søkket mellom 300 og 400 moh som linja går vest for, og mellom 700 og 770 moh «hvis SV flanken på høyre side av klippefremspring velges», og graderer turen «Lett/Moderat».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Fri Flyt: «Unngå bekkefaret på 300 moh på dager med skredfare.» Søkket mellom 300 og 400 moh samler snø; linja går ryggen vest for det. Ved klippefremspringet står bratt bakke 10 til 15 meter øst for linja, og toppeggen har skavlkant mot nord, 21 til 29 meter fra linja det siste stykket opp; nord- og nordøstsida er 55,8 til 58,9 grader. Fri Flyt om nedkjøringen til Stormyra: «Tidlig og sent på sesongen kan snøen dekke dårlig de nederste 200 høydemeterne».'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Salten på varsom.no. Salten er en A-region og varsles daglig i sesongen. Lia ligger i Heggmoen skytefelt — sjekk skyteplanen før du går. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'heggmotinden';

update public.tk_tours set
  description_up   = 'Start på parkeringa Kvalhornet ved Bringsliveien, 63 moh, 2 km fra rv. 80 ved Nordvika. Fri Flyt: «Ta hensyn til brøytebilen. Parkér derfor godt ut i kanten.» Fri Flyt: «Fra parkeringen 60 moh følger du flatt terreng NØ ca 200 meter før du dreier nord og følger sørsiden (heiskars venstre) av Grytåga.» Skogen slipper ved 160 moh, 0,55 km fra start, og bratteste parti på turen ligger her, 24,1 grader mellom 160 og 174 moh.

Fri Flyt: «På 240 moh kommer du til en overbygd sittebenk. Herfra følg den markerte ryggen sør for Grytåga opp mot Søndre Nattmålstuva til 490 moh. Her flater det markant ut.» Grytåga renner 36 til 355 meter nordøst for linja de første 1,3 km, nærmest 36 meter ved 160 moh og 53 meter ved 355 moh. Den er det Fri Flyt advarer mot: «Grytåga har to markerte dropp (fine isklatre fosser) og bratte Ø-NØ vendte heng som ender i en åpenbar terrengfelle». Nord og nordøst for linja står celler på 65,5 grader 52 meter unna ved 174 moh og 36,8 til 38,8 grader 44 til 51 meter unna ved 305–363 moh. Bandet fra 300 til 400 moh er det bratteste, 18,4 grader. Søndre Nattmålstuva når du på 493 moh etter 1,62 km.

Fri Flyt 7.1: «Skal du på Kvalhornet går du 6.1 opp til 490 moh og fortsetter videre forbi s.Nattmålstuva (634 moh) som passeres på østsiden (heiskars høyre) og fortsetter på en NV kurs 1,5 km til topps i slakt terreng». Det er slakt her: 10,1 grader fra 500 til 600 moh, 8,6 fra 600 til 700 og 8,5 fra 700 til 800, over 1935 meter grunn til sammen. Linja passerer Nattmålstuva på østsida, nærmest ved 2,21 km og 594 moh, 411 meter øst for toppen. Kildene bruker navnet om to steder; Fri Flyt: «Egentlig er det overgangen på 490 moh som blir omtalt som Nattmålstuva.» Den kartlagte stien «Kvalhornet» følger linja innen 68 meter de første 3,64 km.

Fri Flyt: «mellom 880-940 moh er det 30 grader bratt. Dette henget kan omgås ved å legge sporet vest-over (heiskars venstre) inn på toppryggen.» Linja gjør det: den går vest for henget, med celler på 42,3 grader 46 meter nordøst for linja ved 904 moh, og kommer inn på toppryggen ved 953 moh, 4,24 km fra start. Stien går rett opp henget, 61 til 137 meter øst for linja mellom 828 og 956 moh. Bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende. Ut.no: «Dagene med vind på toppen er vel i flertallet.»',
  description_down = 'Fri Flyt: «Følger samme vei ned som opp.» og «Ikke kom for langt skikjørers venstre mellom 420-280 moh.» Det er Grytåga og terrengfella. På svært tidlig sesongstart skriver Fri Flyt at terrenget fra 300 moh og ned «bør da forseres med forsiktighet og fartsavpassing. Det er lett å hekte i busker eller treffe bekkehull.»

Toppen er slak mot sør, sørvest og vest, 10,4 til 17,0 grader i snitt over 500 meter. Mot øst og sørøst faller den 50,4 og 47,7 grader i bratteste vindu 40 til 120 meter ut, og mot nord 58,7 grader. Fri Flyts østflanke (7.2) til Leiråga er «Moderat», og «Sørg for å passere hengeskavlene langs toppeggen før du drar skikjørers venstre ned østflanken.» Fri Flyt oppgir «32 grader 700-570 moh» og «Terrenget høyre og venstre for traseen rett øst er brattere enn 32 grader», og: «Dette er et typisk leheng for vestlige vinder.»',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste bandet er 18,4 grader mellom 300 og 400 moh, og bratteste sammenhengende parti 24,1 grader mellom 160 og 174 moh. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter. Fri Flyt oppgir 30 grader som bratteste punkt, i henget mellom 880 og 940 moh som linja går vest for, og graderer turen «Lett»; ut.no kaller den middels.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Grytåga nordøst for linja har bratte øst- og nordøstvendte heng som ender i en terrengfelle; hold deg på ryggen sør for den, særlig mellom 280 og 420 moh på vei ned. Toppen har hengeskavler langs toppeggen, og øst- og nordsida er 47,7 til 58,7 grader.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Salten på varsom.no. Salten er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'kvalhornet';

update public.tk_tours set
  description_up   = 'Start ved busslomma på Kistrand ved rv. 80, 7 moh. Fri Flyt: «Etter 26,3 km parkerer du på busslommen ved Holmen hø side av vei». Ut.no: «Turen starter fra fotoboksen på rv. 80 på Kistrand.» Lomma er kartlagt som et busstopp i bruk, og der er parkering ikke tillatt. Nærmeste kartlagte parkeringsplass ligger 863 meter vest, og Fri Flyt viser til Dinesodden lenger øst: «fortsetter videre 1,2 km til Dinesodden med stor parkering på høyre side av veien». Ny trasé for rv. 80 er under bygging 82 meter sør for starten, så lomma og fotoboksen kan bli flyttet.

Fri Flyt: «Fra parkeringen, gå i nord-nordvestlig retning med sikte på kraftledningen. Når du treffer kratfledningen, drei nordøst 2-300 meter til du treffer starten på ryggformasjonen sør for Mølnelva.» Ut.no: «De første 220 høydemeterne går gjennom skogen og på sørvestsiden av Mølnelva.» Skogen slipper ved 207 moh, 0,94 km fra start. Bratteste parti på turen er nederst, 25,8 grader mellom 69 og 89 moh, og bandet fra 100 til 200 moh måler 16,0 grader. Nord og nordøst for linja står bakke på 45 grader eller brattere 12 til 53 meter unna mellom 176 og 271 moh: det er kanten av juvet.

Mølnelva er nærmest ved 1,74 km og 373 moh, 46 meter nordnordøst for linja. Ut.no: «Mølnelva har dannet et markant juv som en kan krysse litt lenger opp ved ca. 430 moh.» Ut.no-sporet krysser juvet og går nordøstover til en topp ut.no kaller Kistrandtinden, 853 meter øst for 979-toppen; Fri Flyts linje holder seg vest for juvet og går rundt toppen av det. Der, mellom 453 og 493 moh, står bakke på 45 grader eller brattere 19 til 46 meter fra linja. Fri Flyt: «Følg ryggen til flata med tre bjørketrær på 480 moh.» Flata når du på 476 moh etter 2,11 km.

Fri Flyt: «Fra flata følg jevnt 25 grader bratt terreng i retning nord mot toppen.» Bandene fra 500 til 700 moh måler 16,4 og 13,1 grader, og 700 til 800 er det bratteste, 19,1 grader over 298 meter grunn. Bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende, men ved siden av den står celler på 38,6 til 41,6 grader 11 til 32 meter unna mellom 558 og 651 moh. Toppen er slak mot sør, 15,6 grader i snitt over 500 meter, og nesten flat mot øst.',
  description_down = 'Fri Flyt: «Følger samme vei ned som opp.» Ut.no: «På tur nedover anbefales det å krysset juvet/Mølnelva ved ca. 200 moh. Derfra er det litt enklere å ta seg ned gjennomskogen.» Det gjelder ut.no-linja nord for juvet; går du ned der du gikk opp, er du på sørsida hele veien.

Toppen faller bratt mot nord, nordvest og vest: 56,9 grader 20 til 80 meter ut mot nord, 56,2 mot nordvest og 48,7 mot vest. Selve toppunktet står 15 meter fra bakke på 61 grader mot nordnordvest; hold deg sør for kanten. Fri Flyt om p970-ruta (5.2): terrenget vest for sporet der er «rundt 30+ grader i hele den sørøstvendte flanken fra 400-700 moh», og «På dager med skredfaregrad 3 må du holde behørig avstand til sørøstflankene som starter på 400-700 moh.»',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 25,8 grader mellom 69 og 89 moh, og bratteste bandet 19,1 grader fra 700 til 800. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter. Fri Flyt oppgir 30 grader mellom 350 og 400 moh som bratteste punkt og graderer turen «Lett/Moderat»; ut.no kaller den middels.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Mølnelva har et markant juv nord for linja, og bakke på 45 grader eller brattere står 12 til 53 meter fra linja langs juvkanten mellom 176 og 271 moh. Sørflanken er bred med mange valg, men Fri Flyt advarer i nedkjøring 5.3 om at du utenfor sporet fra 700 til 400 moh «vil … komme inn i terreng som alltid har enkeltheng brattere enn 30 grader». Nord- og vestsida av toppen er 48,7 til 56,9 grader, og kanten står 15 meter fra toppunktet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Salten på varsom.no. Salten er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'kistrandtindan';

update public.tk_tours set
  description_up   = 'Start ved den store avkjøringa på rv80 ved Kleivberget, nordøst for utløpet av Sagelva — parkeringslomma er kartlagt og leser 11 moh. Gå nordover gjennom hyttefeltet til den øverste hytta, den Fri Flyt kaller Geilo, på 54 moh — skogen her er den eneste på turen, og Kartverkets klasser sier den slutter allerede på 191 moh.

Fra hytta holder du nordnordøst i om lag en kilometer, slik kilden sier, og følger de naturlige rampene forbi brattpartiene — linja passerer 270 og 420 moh på vei mot Innertinden. Ved 536 moh, på flanken mot Innertinden, kommer du inn på militærløypemerkingen kilden plasserer ved 560.

Vestover langs merkingen til sørøstryggen som kommer ned fra Midtitinden — kilden sier omtrent 720, og ryggfoten leser 728. Fra 800 moh går ryggen over i det Fri Flyt ber deg være oppmerksom på: «den konvekse overgangen som begynner på 800 moh». Målingen er enig om hvor den ligger — det bratteste sammenhengende partiet på turen, 26,9 grader, ligger mellom 877 og 893 moh, og det bratteste hundremetersbeltet, 19,1 grader i snitt, mellom 900 og 1000.

Ved 1026 moh — kilden sier 980 — runder linja mot nord og inn på nordøstryggen. De siste meterne til varden er slake, og du står på 1060 moh med hele Saltfjorden og tindene rundt deg.

Registeret fortjener en setning: Topp-punktet for Midtitinden står 294 m nordøst for det høyeste punktet og leser 983 moh — 75 meter for lavt. Selve toppen har et annet registernavn, Mjønestindan (Fjell), 15 m fra den klatrede cella. Toppsøket klatret til 1059,5 — publisert 1058 — og kortet bærer den målte cella.',
  description_down = 'Normalveien ned er samme vei som opp: nordøstryggen, sørøstryggen og rampene tilbake til militærløypa og hyttefeltet. Med 26,9 grader som bratteste sammenhengende parti er det åpen kjøring fra topp til fjære — men den konvekse overgangen ved 800 moh er der på vei ned også, og du ser ikke hva som ligger under den før du er i den.

Fri Flyt beskriver flere varianter fra lett til krevende — sørøstflankene, østover mot vatnet på 627, og nordover mot Stordalen på 450 med retur over skardet. Ingen av dem er denne linja, og målingene fra varden sier hvorfor de krever sitt: nordøstsida faller 69,2 grader på det bratteste 390–450 m ut, sørsida 56,7 grader 70–130 m ut og sørvestsida 60,8 grader 90–150 m ut. Velg variant i god sikt, ikke i skodde.

Sida turen går i vender sør-sørøst og får sol fra morgenen: det som er mykt midt på dagen, kan være skare igjen når du kommer ned igjen sent. To meter å gi tilbake har linja samlet, så hjemveien er ren kjøring.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyts eget tall for normalveien er bratteste punkt under 30 grader, og målingen bekrefter det for denne linja: 26,9 grader som bratteste sammenhengende parti, med det bratteste hundremetersbeltet 19,1 grader mellom 900 og 1000 moh. Men under-30 gjelder sporet, ikke fjellet: rett sør, sørøst og nord for toppen står det 39,5 til 56,7 grader bare 60–130 m fra varden.'
    ),
    jsonb_build_object(
      'title', 'Variantene',
      'body',  'Nedfartsvariantene Fri Flyt graderer fra lett til krevende går i terreng målingen har tall på: nordsida mot Stordalen måler 28,1 grader i snitt med 40,4 grader som bratteste 60 m bare 60–120 m fra varden, sørvestsida 60,8 grader 90–150 m ut og vestsida 55,4 grader 140–200 m ut. Nordøstsida, som ingen av variantene går i, faller 69,2 grader 390–450 m ut. Det er skredterreng med konsekvens, og det er nettopp valgfriheten som gjør fjellet populært — velg etter forholdene, ikke etter lysten. Fri Flyt legger sine egne advarsler på variantene, og de står igjen her: det er «registrert store flakskred i øst hellingen ned mot vatnet på 627 moh»; renna skal kjøres «én og én»; det er skavlkant på skikjørers venstre langs NV-ryggen fra toppen; og «på dager med skredfare 3 bør du ikke la deg friste til å avvike fra sporet».'
    ),
    jsonb_build_object(
      'title', 'Solvendt fra havet',
      'body',  'Hele turen står sør-sørøst-vendt fra havnivå til 1060 moh. Det gir tidlig sol og rask oppmykning om våren — og daglig gjenfrysing. På en 1050-metersflanke rekker forholdene å endre seg fra fjæra til varden; det som bærer deg ved 300 moh om morgenen, kan være våt snø ved 900 midt på dagen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Midtitinden ligger i varslingsregionen Salten, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder for denne turen; kortets jan–apr er lånt fra appens Lofoten-turer på samme breddegrad, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'midtitinden';

update public.tk_tours set
  description_up   = 'Fra gården på Horsdal, 10 moh, følger du den merkede stien langs fjæra sørøstover knapt halvannen kilometer til munningen av Stjernåga — 28 moh på det høyeste, med sjøen rett ved. Så dreier stien nordøst, opp østsida av elva, og stiger bratt via trappene; her bærer du skia. Der trappene ender, på 166 moh, flater terrenget ut og skia kan på.

Strekket videre inn Stjerndalen er turens faretekst, og kilden er ordrett: dalen går i utløpssoner for skredflanker, spesielt vest- og sørvestflankene under Isvasstinden — fjellet rett øst, som registeret bekrefter. Vær OBS på dager med markert skredfare og utover våren; flata er ikke faresonefri bare fordi den er flat.

Fra dalen holder du nordover mot 450 — «øst for Stjernelva hele veien», sier kilden — linja leser 463 — og så vestover i slakt terreng nord for punkt 592: 662 og 752 moh i jevn stigning. Skogen sluttet allerede på 324, så alt dette er åpen fjellside med utsyn over Saltfjorden.

Til slutt nordover opp toppflanken: hundremetersbeltet 900–1000 holder 21,3 grader i snitt og 22,9 som bratteste sammenhengende parti på linja. Kilden skriver «i grenseland til 30 grader de siste 50 høydemeterne», og det er fallinja den leser: sør for varden måler sveipet 32,8 grader i bratteste 60 m-vindu, 70–130 m ut. Varden står på 993 moh, med havet på tre kanter.',
  description_down = 'Samme vei ned, med rom for østlige varianter som gir brattere kjøring i toppflanken — samme 30-gradersklassen, sier kilden. Fra flata i Stjerndalen gjelder faresonen igjen: kryss utløpsområdene kjapt og én om gangen på dager med markert fare.

Ravika-ruta på nordøstsida er fullt beskrevet hos Fri Flyt — skogsveien fra den grønne garasjen, myrdragene langs Ravikelva, rampe til toppeggen — men nedfarten dens har et 40-gradersparti mellom 920 og 840 moh og skaret 300 m sørøst for toppen som inngang. Den er varianten, ikke normalveien, og den som velger den, har valgt en annen tur.

Ned trappene bærer du skia igjen, og stien langs fjæra tar deg hjem til Horsdal — 50 høydemeter å gi tilbake har hele turen, så det meste av dagen er ren stigning og ren kjøring.

Kilden gir nordøstsida egen adkomstbeskrivelse og egen parkering i Ravika, og sier rett ut at du kan velge å gå opp fra den sida. Det er 1033 høydemeter og 5,41 km: skogsveien sørvest langs vestsida av Ravikelva, myrene ved Hornkroken på 252 moh, punkt 385 og det slakere området sør for punkt 580 — og til slutt det ene snøfeltet som når helt opp på toppeggen. Bratteste steget måler 36,1 grader mellom 806 og 830 moh mot 40,2 i trappene på ruta fra Horsdal. Kilden oppgir 40 grader mellom 840 og 920 og legger til stegjern og isøks på hardt føre, innblåst snø i utsteget av rampa og skavler langs toppeggen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Stjerndalen',
      'body',  'Kildens faremerknad gjelder dalen, ikke toppen: turen går i utløpssoner for skredflanker, spesielt vest- og sørvestflankene under Isvasstinden, og advarselen gjelder dager med markert skredfare og våren. Utløpssoner er flate — det er hele poenget med dem — og eneste verktøyet er tempo, avstand og å velge en annen dag når varselet sier det.'
    ),
    jsonb_build_object(
      'title', 'Toppflanken og kantene',
      'body',  'De siste femti høydemeterne måler 22,9 grader som bratteste sammenhengende parti på linja, og kilden kaller dem «i grenseland til 30 grader»; linjas bratteste, 40,2, ligger nede i trappene. Men Sandhornet er et øyfjell med vegger: vestsida faller 59,0 grader på det bratteste bare 110–170 m fra varden, nordvestsida 59,9 og nordsida 61,8 grader 70–130 m ut. Mot havet er kanten absolutt; i skodde er sør hjemveien — linja peiler 189 grader de første femhundre meterne, og Horsdal ligger 200 grader fra varden.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sandhornet ligger i varslingsregionen Svartisen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre nordlandsturer, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'sandhornet';

update public.tk_tours set
  description_up   = 'Fra gården Neset ved Flostrand, 15 moh, på E12 kystriksvegen. Registeret setter Tortenviktinden i Lurøy, mens tilkomsten fra Flostrand ligger i Rana — fjellet og startstedet er i hver sin kommune. Visit Helgeland fører samme ruta med 5,2 km og 1 025 høydemeter én vei; linja måler 5,57 km og 1 023.

Første kilometeren er nesten flat: beltet fra 0 til 100 moh måler 6,7 grader over 761 meter grunn og beltet fra 100 til 200 bare 4,5 over 1 233 meter. Skogen slutter på 152 moh etter Kartverkets klasser, med åpent område fra 158, og skoggrensa kommer 1,66 km ute. Fri Flyt sier «rett opp til du kommer over skogen i nord-nordvestlig retning», og det er den biten.

Over skogen går linja vestover på rabbene, slik kilden sier. Beltene fra 200 til 500 moh ligger jevnt mellom 12,3 og 13,2 grader. Så kommer det flatere partiet den beskriver som «noe ulendt, med små bekkedaler på tvers av fjellet»: beltene fra 700 til 900 moh måler 10,4 og 8,8 grader over 495 og 675 meter grunn — det slakeste over skoggrensa, og det lengste. Det er her turen kjennes lang. Her ligger en klynge tjern på 785 til 792 moh, og linja går sør om hele klynga: 0 meter på vann, målt mot OSMs vannpolygon.

«Herfra ser du ikke selve Tortenviktinden, men toppen ligger rett bak det høyeste punktet du ser», sier Fri Flyt. Bak det stiger den siste helninga: beltet fra 900 til 1000 moh måler 18,6 grader, det bratteste på turen, og det bratteste sammenhengende partiet ligger her — 23,7 grader mellom 971 og 994 moh, 5,39 km ute, altså under to hundre meter før varden. 1028 moh mot publiserte 1027.',
  description_down = 'Ned samme ruta. Det bratteste du kjører er de 23,7 gradene rett under toppen, og så blir det slakere hele veien ut — noe som gjør at de siste kilometerne er staking mer enn kjøring.

Nordsida skal du ikke bort i. Fra varden faller den 43,3 grader i snitt med 62,2 grader som bratteste 60 meter 80 til 140 meter ut, og nordvestsida 35,2 med 60,0 grader 230 til 290 meter ut. Ruta kommer opp fra sørøst, som måler 15,3 grader i snitt, og vestsida er 11,9 — kontrasten mellom de to sidene av denne toppen er det eneste du trenger å vite om den i dårlig sikt.

Fri Flyt nevner at fjellet gir «mulighet for bratt rennekjøring», og Visit Helgeland fører en alternativrute på 4,3 km og 1 005 høydemeter med brattere oppstigning og mindre traversering. Ingen av dem er målt som egne ruter her.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Ingen av kildene gir et bratthetsfelt, og Fri Flyt klassifiserer ikke turen etter KAST. Målinga fyller hullet: ingen hundremeter av linja holder mer enn 18,6 grader i snitt, og bratteste sammenhengende parti er 23,7 grader mellom 971 og 994 moh. Visit Helgeland graderer turen «Challenging, long», og det er lengden graden handler om — 5,57 km og tusen høydemeter fra havflata.'
    ),
    jsonb_build_object(
      'title', 'Grøveldalen',
      'body',  'Fri Flyts eneste navngitte faremoment er et annet sted enn ruta: «Grøveldalen har høye og bratte sva på begge sider som kan løsne, særlig om våren.» Registeret fører Grøveldalen som botn 2,5 km sør for varden, og linja går ikke der. Advarselen står her fordi den er kildens egen og fordi dalen ligger i samme fjellsida — ikke fordi ruta berører den.'
    ),
    jsonb_build_object(
      'title', 'Nordsida',
      'body',  'Fra varden faller nordsida 43,3 grader i snitt over de første 800 meterne, med 62,2 grader som bratteste 60 meter 80 til 140 meter ut; nordøst måler 33,3 med 68,3 grader 50 til 110 meter ut og nordvest 35,2 med 60,0 grader. Oppstigninga kommer fra sørøst på 15,3 grader. Visit Helgeland peker på at terrenget er «mostly free of trees», og på en topp der to sider skiller seg med tretti grader er det nettopp mangelen på holdepunkt som gjør forskjellen farlig.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Tortenviktinden ligger i varslingsregionen Svartisen, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder: Fri Flyt skriver at «den kystnære beliggenheten … gjør også at sesongen er ustabil med varierende snøforhold», og Visit Helgeland fører hovedruta som vintertur med alternativruta tilgjengelig etter påske. Kortets feb–mai er derfor redaksjonell. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'tortenviktinden';

update public.tk_tours set
  description_up   = 'Ta ferja fra Nesna til Tomma og kjør mot Forsland; Forslandsvegen ender ved gården, og du parkerer ved åkeren før Forslandsvatnet, slik kilden sier — jordet ved stistarten leser 47 moh. Sjekk rutetidene begge veier: ferja er en del av turen.

Stien vestover er kartlagt og fører opp til høyden der Forslandsvatnet ligger, på 148 moh. Tjernet er naturlig, men det ligger lavt på en øy i havet, og isen kan ikke forutsettes: linja går rundt nordbredden på land — 161, 177 og 150 moh på pinnene — og passerer også nord for småtjerna og Tinnvatnet. Det er målt: 0 meter av linja står på vann.

Fra myra nordvest for vatnet begynner den nordvestgående ryggen, slik kilden sier — helt til toppen. Ryggen er jevn: 283 ved foten, 492, 656, 768, 843 og 884 moh oppover, med det bratteste hundremetersbeltet — 21,8 grader i snitt — mellom 800 og 900. Falllinja i midtpartiet holder 32–33 grader; sporet sikksakker slakere.

Varden står på 922 moh med hav på alle kanter — Atlanterhavet i vest, Svartisen i øst. Og alle kantene er ekte: fra toppen faller alle åtte sektorene 31 til 44 grader i snitt, med 69,4 grader som bratteste vindu mot nordøst. Toppen er et horn, og i skodde er ryggen du kom opp eneste veien hjem.',
  description_down = 'Den normale nedkjøringa følger samme ruta som oppstigninga, slik kilden sier — ryggen ned, rundt vatnet på land, og stien til åkeren. 74 høydemeter å gi tilbake har turen samlet, det meste i småkuperingen rundt tjerna.

Fri Flyt nevner også den østvendte nedkjøringa i søkket som samler snø — faktaboksen hans fører ingen himmelretning, og den målte peilinga ned ryggen leser 134 til 147 grader. Søkket er fjellets beste snølager og samtidig bratteste terreng: østsektoren faller 34,4 grader i snitt med 64,1 som bratteste vindu. Den som velger søkket, har valgt snøvurderingen som følger med.

Husk ferja: den setter tidsrammen for dagen, og den går fra fjæra — hele nedkjøringa har havet som mål, og det er den eneste turen i appen der «helt ned» betyr helt ned til en ferjekai.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt publiserer verken KAST eller bratteste punkt for denne turen, og målinga får stå alene: 27,9 grader som bratteste sammenhengende parti, 21,8 som bratteste hundremetersbelte, mellom 800 og 900 moh. Falllinja i midtpartiet av ryggen holder 32–33 grader — sporvalget er slakere enn henget, og det skal det fortsette med å være.'
    ),
    jsonb_build_object(
      'title', 'Hornet',
      'body',  'Fra varden faller alle åtte sektorene mellom 31 og 44 grader i snitt: nordøst 69,4 grader i bratteste vinduet, nord 63,7, øst 64,1, nordvest 61,4. Det finnes ingen slak utvei fra toppen annet enn ryggen du kom opp — i skodde er kompasskursen sørøst langs ryggen absolutt — linja peiler 134 til 147 grader ned.'
    ),
    jsonb_build_object(
      'title', 'Havet og snøen',
      'body',  'Kilden skriver at «som andre kysttopper på Helgeland er sesongen ustabil og snøforholdene varierende» — i innledningen, ikke i faktaboksen, og den er hele klimahistorien: et 922-metersfjell omgitt av hav får snøen sin i byger og mister den i mildvær, og det østvendte søkket som samler snø, samler den av vinden — fokksnø over kystskare er den lokale kombinasjonen. Vurder snødekket fra ferja: du ser hele fjellet fra sjøen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Tomskjevelen ligger i varslingsregionen Helgeland, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre nordlandsturer, og guiden sier det. Ferja fra Nesna er eneste tilkomst — sjekk rutetidene. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'tomskjevelen';

update public.tk_tours set
  description_up   = 'Fra veienden ved gården på Kammen, 230 moh. Fri Flyt sier «Følg traktorveien videre fra parkeringen i omtrent 300-400 meter», og ut.no det samme: sporet starter på skogsveien ved gården. Beltet fra 200 til 300 moh måler 11,0 grader og beltet fra 300 til 400 like slakt over 586 meter grunn.

Skogen slutter på 379 moh etter Kartverkets klasser, med åpent område fra 386, og skoggrensa kommer 0,82 km ute. Over den går linja inn i dalen mot bekken mellom Nordtinden og Lukttinden — ut.no setter den til «ca 400moh», og linja passerer der.

Her deler kilden seg, og det er den viktigste avgjørelsen på fjellet. ut.no gir to veier opp på ryggen: alternativ 1 rett opp det bratte henget, «ganske bratt, med opptil 40 grader helning», og alternativ 2 videre inn i dalen mot sørøst og så «den noe mindre bratte ryggen opp til høyre, som er en vanlig rute sommerstid… opp i 30 grader». **Denne linja går alternativ 2.** Bratteste sammenhengende parti på hele turen ligger i det steget: 28,1 grader mellom 633 og 650 moh, 1,88 km ute — innenfor det ut.no oppgir for alternativ 2, og godt under de 40 gradene i alternativ 1. Den advarer selv om at alternativ 2 har «overhengende skavler med utløpsområde mot denne ryggen».

Oppe på ryggen — ut.no sier «ca 720 moh» — er turen enkel og lang. Beltene fra 700 moh og opp måler 18,3, 18,2, 18,8, 18,1, 19,6 og 18,0 grader; det bratteste er 19,6 mellom 1100 og 1200 moh. ut.no beskriver den samme jevnheten: «Det er jevnt bratt oppover, mellom ca 20-30 grader.»

Varden på 1348 moh. Det er ut.nos tall, ikke Fri Flyts — Fri Flyt oppgir 1342, og toppsøket løser 1347,8 på registerpunktet. ut.no nevner et siste bratt heng «på ca 35 grader for å nå toppen», som «ofte ganske isete»; den rutede linja finner ikke 35 grader noe sted, og det høyeste beltet, 1300 til 1400 moh, måler 18,5. Det er et reelt avvik mellom kilden og linja, og det står her fordi det gjelder de siste meterne.',
  description_down = 'Ned samme ryggen. ut.no er tydelig på hva som er nedkjøringas poeng: «I de svakt konkave helningene som følger nesten hele fjellsiden nedover kan det samles mye fin snø. Siden er også nordvendt, som betyr at du kan være heldig og nyte puddersnø godt ut i juni.» Kortets aspekt er NV, målt fra linjas egen nedkjøring, og det stemmer med at sida er nordvendt.

To kanter skal holdes unna. På vei opp: «Unngå å gå på kanten til høyre (SV), her er det stupbratt» — vestsveipen fra varden måler 32,2 grader i snitt med 38,8 grader som bratteste 60 meter 110 til 170 meter ut. Og på toppen: «Vær obs på skavlen som dannes på nordøstsiden av varden. Skavler bryter 45 grader i snøen og kan dra deg med selv om du står på fast grunn. Det er stup på begge sider.» Nordøstsveipen måler 19,8 grader i snitt — men 63,4 grader som bratteste 60 meter bare 60 til 120 meter ut. Snittet er det som lurer; kanten er det som gjelder.

Den slakeste sektoren fra varden er sørvest med 9,7 grader og sør med 13,3 — men det er ikke veien hjem, og øst og sørøst faller 35,0 og 31,3 grader i snitt med 65,5 og 68,8 grader tett på varden.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta og de to alternativene',
      'body',  'Fri Flyt gir ikke noe bratthetsfelt for denne turen og klassifiserer den ikke etter KAST; den sier bare at «Toppen av Lukttinden er ikke omkranset av bre og er dermed en teknisk enklere tur enn Okstindene.» ut.no er den strenge kilden, og den er utvetydig: «På grunn av bratthet bør den ikke gåes ved skredfare.» Korridoren her er lagt på dens alternativ 2, den slakere ryggen — bratteste sammenhengende parti måler 28,1 grader mellom 633 og 650 moh — og ikke på alternativ 1, som er dens eget inntegnede spor og «opptil 40 grader».'
    ),
    jsonb_build_object(
      'title', 'Skavlen på varden',
      'body',  '«Vær obs på skavlen som dannes på nordøstsiden av varden. Skavler bryter 45 grader i snøen og kan dra deg med selv om du står på fast grunn. Det er stup på begge sider.» Det er ut.nos ord, og målinga står bak dem: nordøstsveipen holder 19,8 grader i snitt over 800 meter, men 63,4 grader i sine bratteste 60 meter, 60 til 120 meter fra varden. En skavl som bryter bakover tar med seg fast grunn, og et snitt på nitten grader sier ingenting om det.'
    ),
    jsonb_build_object(
      'title', 'Isen på slutten',
      'body',  'ut.no beskriver et siste heng «på ca 35 grader for å nå toppen» og at det «ofte er ganske isete». Den rutede linja måler ikke 35 grader — det høyeste beltet, 1300 til 1400 moh, holder 18,5 grader, og bratteste sammenhengende parti på hele turen er 28,1 lenger nede. Avviket er notert heller enn bortforklart: kilden har gått fjellet og linja er regnet, og det siste stykket er der de to ikke er enige.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Lukttinden ligger i varslingsregionen Helgeland, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen april–juni er ut.nos egen, og den fører turen som skitur; Fri Flyt har ikke sesongfelt for den. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'lukttinden';

update public.tk_tours set
  description_up   = 'Start på parkeringa på Markavollen, 184 moh. Ut.no oppgir p-avgift, og terrengmodellen leser plassen til 184 moh — nøyaktig den starthøyda beskrivelsen oppgir. Ut.no sender deg langs skiløypene «merka S, deretter Ø og S igjen»; linja på kartet er terrenglinja gjennom det samme løypenettet og ikke løypa selv — 2205 av 4744 meter ligger mer enn 50 meter fra en kartlagt trasé, med største avvik 175 meter. Første halvdel er flat i en topptur å være: bandet fra 300 til 400 moh måler 5,2 grader over 1036 meter grunn, og 400 til 500 moh 3,2 grader over 1710.

På 445 moh streifer linja kanten av Lomtjønna. Vassfjellhytta ligger på 507 moh, og rett etter den kommer stigninga: 11,0 grader fra 500 til 600 moh over 521 meter grunn, og linjas bratteste steg måler 29,0 grader mellom 252 og 270 moh. Skogen slipper taket på 586 moh, og fra 594 er terrenget åpent.

Over skoggrensa holder det 12,3 grader fra 600 til 700 moh, og du treffer anleggsvegen ut.no sender deg inn på — Vassfjellvegen, som ligger 16 meter fra linja og går helt opp til Melhus hovedsender, kommunikasjonsmasta som står 131 meter fra varden på 709 moh. De siste metrene dreier linja nordover. Varden selv står på 711, og terrengmodellen måler den til 710,9.',
  description_down = 'Ned samme veien. Første 200 meter fra varden peiler 255 grader — vest — ned til 676 moh, og 500 meter ned peiler 249. Det er flanken kortet fører: vestsida måler 12,0 grader i snitt over 400 meter med et 26,2 graders vindu 230 til 290 meter ut, og 12,3 grader i snitt når sveipet går ut til en kilometer.

Ut.no advarer mot «diverse brattheng både under og over tregrensa», og sveipet sier hvor de er. Nordvest har det bratteste enkeltvinduet: 33,3 grader 190 til 250 meter ut, mot et snitt på 13,8. Sørøst er den jevnest bratte sida med 13,9 grader i snitt og 26,7 i bratteste vindu, og vest måler 12,0 og 26,2. Nordøst, mot heisene, måler 3,9 — men det du kommer ned i der er alpinbakken i Vassfjellet skisenter, ikke fjellet.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '541 høydemeter der bandene under 500 moh måler 3,2 og 5,2 grader, og bandet fra 500 til 600 måler 11,0 over 521 meter grunn. Bratteste punkt på hele den routede linja er 29,0 grader, mellom 252 og 270 moh, og ruta gir tilbake 33 høydemeter på 4,95 km. Det er en løypetur med ett bratt parti i, ikke en flankeoppstigning. Den routede linja stiger 541 høydemeter over 4,74 km, mot ut.nos oppgitte 526 og 6,7 km: høydemeterne stemmer, kilometerne ikke. Løypa svinger seg sørover, østover og sørover igjen, og linja på kartet tar den korteste veien gjennom de samme punktene.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Fjellet har bratte sider; de ligger bare ikke der løypa går. Innafor 400 meter av varden måler nordvest 33,3 grader i bratteste 60-metersvindu, sørøst 26,7 og vest 26,2. Det er høyt og bratt nok til at et enkeltheng kan løsne, og det er akkurat de linjene som frister når du står på toppen med skiene på.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sør-Trøndelag på varsom.no. Sør-Trøndelag er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'vassfjellet';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Håen, 411 moh — bomvei fra Lundamo, og normalt brøytet de 18 kilometerne inn. Her slutter brøytinga, men ikke veien: Lundadalsvegen fortsetter ubrøytet 2,6 kilometer østover langs nordsida av vatnet, og det er den skogsbilvegen ut.no sender deg langs — «skogsbilveien eller strandlinja N på Håen rett Ø». Linja på kartet følger veien.

Grunnen til at den gjør det står i vatnet ved sida av. Vannflata på Håen måler 433 moh og er klassifisert som regulert innsjø: magasinet tappes ned hver vinter, parkeringa ligger 22 meter under full vannflate, og ut.no ber deg holde deg unna usikker is langs kanten. Veien ligger på land hele veien, fra 411 moh ved bilen til 435 ved østenden.

Etter knapt tre kilometer kommer du til Kråklivollen, 452 moh, der veien slutter og ruta går opp i skogen, opp Kråklia og vest for Samsjølia. Skogen slipper taket på 570 moh, og fra 574 er du i åpent terreng. Bandet fra 400 til 500 moh måler 1,2 grader over 4507 meter grunn — det er avstanden, ikke stigninga, som er turen her.

Rundtjønnin ligger på 526 moh, og det er kontrollmålet på at ruta ligger der beskrivelsen sier: ut.no oppgir 525. Videre nord og nordøst følger du rygger eller søkk i samme retning, avhengig av snø og føre, til ruta dreier mot nord og nordvest opp mot toppen. Bandene over Rundtjønnin måler 2,4, 3,6, 6,0 og 5,7 grader, og det siste av dem dekker bare 149 meter grunn.

Varden står på 815 moh. Kråkfjellet ble kommunetopp i Trondheim etter sammenslåinga med Klæbu, og publiserte tall sier 817; terrengmodellen leser 814,9 på det høyeste punktet, og kortet fører målinga.',
  description_down = 'Ned samme veien. Første 200 meter fra toppen peiler 202 grader, ned til 792 moh, og 500 meter ned peiler 199. Parkeringa ligger 7,4 km unna, på peiling 225 grader, så det meste av nedturen er å gå, ikke å kjøre — og de siste tre kilometerne er skogsbilvegen tilbake.

Sveipet finner ingen bratt side på dette fjellet: bratteste 60-metersvindu i noen retning er 21,8 grader mot øst, i vinduet 260 til 320 meter ut, nordøst måler 13,1 grader i snitt og nord 2,0. Det ut.no advarer mot er noe annet enn skred — «høye skavler i le-retningen» som du kan falle ned fra i dårlig lys når du krysser ryggene i området.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Ni og en halv kilometer der bandene måler 1,2, 2,4, 3,6, 6,0 og 5,7 grader, og bratteste sammenhengende steg er 16,1 grader mellom 467 og 480 moh. Ruta gir tilbake 67 høydemeter og stiger 468 mot ut.nos oppgitte 519 og «ca 140» tapte. Resten av forskjellen ligger i linjevalget mellom ryggene, som beskrivelsen selv overlater til snøen og føret.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Bratteste måling rundt toppen er 21,8 grader mot øst. Nord er nesten flatt, 2,0 grader i snitt over 400 meter. De to tingene som kan gå galt her er derfor ikke skred i seg selv: skavlene ut.no beskriver, som er et fallproblem i dårlig lys, og isen på Håen, som er regulert og tappes ned hver vinter. Ruta er lagt på skogsbilvegen og ikke ut på magasinet, men strandlinja ligger hele tida rett ved sida av linja.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sør-Trøndelag på varsom.no. Sør-Trøndelag er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'krakfjellet';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Håen, 411 moh — de samme tre første kilometerne som Kråkfjellet. Brøytinga slutter ved bilen, men Lundadalsvegen gjør det ikke: den fortsetter ubrøytet 2,6 kilometer østover langs nordsida av vatnet, og linja følger den. Vassflata på Håen ligger på 433 moh, magasinet tappes ned hver vinter, og ut.no ber deg holde deg unna usikker is langs kanten.

Kråklivollen ligger på 452 moh, der veien slutter. Videre opp Kråklia og vest for Samsjølia, forbi Rundtjønnin på 526 moh. Ut.no oppgir 525 for dette vatnet og terrengmodellen leser 526 — det er kontrollen på at korridoren følger den beskrevne løypa. Bandene hit måler 1,2 og 1,4 grader, over 4464 og 4096 meter grunn.

Så krysser ruta Oksdalen på 532 moh. Punktet er ikke navngitt i noen kilde: dalen er registrert med representasjonspunkt 3,95 km unna på peiling 15, altså nord-nordøst, og kryssinga er lest ut av terrengmodellen som lavlinja sørover derfra. Skogen slipper taket på 562 moh, og fra 569 er du i åpent terreng.

Etter Oksdalen begynner de siste fire kilometerne. Bandet fra 600 til 700 moh måler 6,1 grader, og det er her det bratteste sammenhengende steget ligger — 27,9 grader mellom 661 og 679 moh. Videre måler 700 til 800 moh 11,6 grader over 495 meter grunn, og så slakner det til 5,7 og 6,5 mot varden på 942 moh. Rensfjellet er grensetopp mellom Melhus, Midtre Gauldal og Selbu; ut.no noterer at den «mangler bare 2,1 km mot N-NV på å inkludere også Trondheim i den klubben».',
  description_down = 'Ned samme veien, vestover: første 200 meter fra toppen peiler 253 grader ned til 920 moh, og 500 meter ned 254. Parkeringa ligger 10,2 km unna, på peiling 254 grader. Ut.no gir ett alternativ — å styre ned mot Samsjøen etter Oksdalen — og setter to betingelser: at føret utenfor oppkjørte løyper er godt, eller at du har et spor å gå i.

Sveipet finner ingen bratt side innafor 400 meter av varden: øst måler 11,0 grader i snitt med 17,8 i bratteste vindu, sørøst 3,4 og nordvest 2,5. Ut.nos «bratte enkeltheng som er høye nok til at det kan gå skred» ligger lenger ute enn sveipet rekker, og beskrivelsen sier selv at de er mulige å unngå.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Elleve kilometer der de to lange bandene måler 1,2 og 1,4 grader over drøye fire kilometer hver, og all stigninga ligger i de siste fire. Bratteste sammenhengende steg er 27,9 grader mellom 661 og 679 moh, bratteste hundremetersband 11,6 fra 700 til 800. Ruta gir tilbake 168 høydemeter mot ut.nos oppgitte «ca 130» — det er den samme terrengformen, rygger og søkk som må krysses.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Innafor 400 meter av varden er bratteste måling 17,8 grader mot øst. Det som gjør turen krevende er lengden og orienteringa: elleve kilometer over myr, skogsveg og rygger, 168 høydemeter gitt tilbake på veien inn og de samme igjen på veien ut. Ut.no advarer om skavler i le-retningen, som er et fallproblem i dårlig lys, og om enkeltheng som finnes, men kan omgås. Nede ved starten er det isen på det nedtappede magasinet som er faren, og ruta er lagt på skogsbilvegen for å holde seg unna den.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sør-Trøndelag på varsom.no. Sør-Trøndelag er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'rensfjellet';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved dammen på Gråsjøen, 495 moh — 15 km bomveg opp Folldalsvegen, betaling med kort. Følg vegtraséen langs vatnet til sommerstien skrår opp lia, og ikke tidligere: ut.no advarer om at det kan gå skred fra fonna på Gråhaugfjellet, og at de enkelte år går helt ut på vatnet.

Opp lia sør–sørvest, gjennom 686 moh, med bandene 10,3, 6,3 og 7,0 grader. Så flater det ut på platået øst for Midtveggen, 931 moh: bandet fra 800 til 900 moh måler 3,2 grader over 1979 meter grunn, og 900 til 1000 måler 2,2 over 2250. Her gir ruta tilbake høyde, fra 931 ned til Svartvatnet på 888 moh — ut.no fører «ca 100» tapte høydemeter opp, og den routede linja gir tilbake 95.

Fra Svartvatnet kommer du til foten av Litj-Snota og runder den i øst, 1026 moh — de siste 90 metrene inn dit går over et lite unavngitt vatn på 1024. Herfra og opp er du i utløpsområder og i kortere partier i løsneområder over 30 grader, som ut.no skriver at det ikke er mulig å omgå. Bandene stiger til 7,1, 15,7 og 15,3 grader.

På 1352 moh flater det ut, og den bratte bakken rett imot i vest er breen. Kartverket klasser elleve punkter på linja som breterreng, fra 1364 til 1463 moh, og strekket måler 404 meter — med to bare punkter på 1414 og 1421 moh midt i, der isen er brutt. Punktene rett før og etter, 1369 og 1471 moh, er åpent område. Ut.no oppgir «fra ca 1380 moh ... i ca 500 m» og ber deg sjekke med lokalkjente at det er nok snø. Bratteste sammenhengende steg på hele turen ligger her: 35,2 grader mellom 1413 og 1436 moh.

Over breen, på 1516 moh, kommer du opp på toppflanken, og ruta dreier sørvest, sør og til slutt sør–sørøst til toppunktet på 1668 moh.',
  description_down = 'Ned samme sporet — ut.no kaller det det beste valget i de fleste tilfeller, og legger til at faren for våte løssnøskred øker utover dagen på varme vårdager. Første 200 meter fra toppen peiler 320 grader, altså nordvest, ned til 1653 moh, og 500 meter ned 328: ruta går tilbake langs toppflanken før den faller østover ned breen. Parkeringa ligger 8,0 km unna, på peiling 13 grader.

Det er verdt å vite hvorfor det første trekket går nordvest. Øst fra toppunktet måler 48,1 grader i snitt over 400 meter med et 57,9 graders vindu 130 til 190 meter ut — det er «toppflanken er stupbratt mot Ø» i tall. Sør og sørøst måler 42,0 og 36,5 i snitt, med vindu på 71,4 og 71,0 grader bare 10 til 70 meter ut, og nordøst 42,0 med 64,2. Vest og nordvest, der ruta kommer opp og går ned, måler 14,8 og 9,4.

Den andre ruta kommer fra øst, fra Trollheimshytta: 1322 høydemeter på 11,41 km, over bruene på Slettåa og Folda, forbi Bossvasshøgda på 811 moh og opp i botnen vest for den. Ved 993 moh kommer den inn på den samme vinterruta fra Gråhaugen som resten av dette kortet beskriver, og derfra deler de to hylla under Litj-Snota, breen og toppflanken. Kilden er den samme forfatteren, og advarselen står uendret: ruta går i skredterreng, «både løsneområder over 30 grader bratt og utløpsområder som det ikke er mulig å omgå», og toppflanken er stupbratt mot øst. Linja fra Trollheimshytta gir fra seg 185 høydemeter underveis mot 95 fra Gråhaugen, og bratteste steget måler 35,3 grader mellom 1490 og 1514 moh.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '1268 høydemeter og 10,22 km, med 95 gitt tilbake. Ut.no fører ruta som skredterreng — «både løsneområder over 30 grader bratt og utløpsområder som det ikke er mulig å omgå» — og terrengklassen som KAST 2, utfordrende. Bratteste hundremetersband på den routede linja er 15,7 grader fra 1100 til 1200 moh og bratteste steg 35,2 grader mellom 1413 og 1436, men de tallene beskriver skisporet, ikke sidene det går under.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Toppflanken mot øst måler 48,1 grader i snitt med 57,9 i bratteste vindu, og sør og sørøst har vindu på 71,4 og 71,0 grader bare 10 til 70 meter ut fra toppunktet. Den andre er fonna på Gråhaugfjellet, nede ved starten: ut.no skriver at skred derfra enkelte år går helt ut på vatnet, og at turen ikke bør gås ved fare for store, naturlig utløste skred i østlige heng.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen. Breen mellom 1364 og 1463 moh krever nok snø, og ut.no ber deg sjekke med lokalkjente på forhånd. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'snota';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Storli, 623 moh — avgiftsbelagt, 30 kroner i kassa, og taggd for ski. Ut.no: «Fra Storli parkering spenner du på deg skia ved bilen.» Gå rett nordover mot Storbekkdalen gjennom bjørkelia. Her spriker kildene: ut.no legger ruta på høgresida av Veslebekken, mens Fri Flyt skriver at ruta følger Storbekken nordover fra Storli gjennom bjørkeskogen. Linja følger den oppmerkede stien, som gjør litt av begge deler — den krysser Veslebekken nede i bjørkelia og ligger 7 til 967 meter fra Storbekken på veg opp dalen. Bandet fra 700 til 800 moh er det bratteste på hele turen, 15,8 grader over 360 meter grunn, og det bratteste sammenhengende steget på linja ligger like under: 25,8 grader mellom 661 og 683 moh.

Skogen slipper taket på 912 moh, og fra 915 er du i åpent terreng og myr. Linja krysser Storbekken første gang alt på 644 moh, og fletter seg så over bekken åtte ganger til der den slynger seg over den flate dalbotnen mellom 968 og 997 moh — bandet fra 900 til 1000 måler 3,4 grader over 1703 meter grunn. Det er her ruta legger seg vestover opp mot ryggen.

Ryggen vest for bekken ligger på 1211 moh, og bandet fra 1000 til 1100 moh opp mot den måler 12,6 grader. Videre nordover langs ryggen til den bratte sørøstveggen står rett imot deg — da går du et stykke lenger vest og opp gjennom skaret på 1313 moh.

Fra skaret følger ruta det slake terrenget i en halvsirkel til varden på 1504 moh, der kassa med gjesteboka står. Bandene her måler 9,7 og 15,7 grader. Kildene er uenige om høydemeterne — Fri Flyt oppgir 600, ut.no 900 — og den routede linja stiger 893 fra en parkering terrengmodellen leser til 623 moh. Fri Flyts egen GPS-posisjon for toppunktet lander 27 meter fra det punktet summitsøket klatrer til.',
  description_down = 'Ned samme veien, og de første metrene går vestover, ikke mot bilen: første 200 meter fra varden peiler 276 grader, ned til 1458 moh, og 500 meter ned 236. Parkeringa ligger 4,2 km unna, på peiling 170 grader. Halvsirkelen må gås ferdig før ruta snur sørover, og i dårlig sikt er det den detaljen som betyr noe her.

Sørøstveggen er den Fri Flyt advarer mot, og sveipet bekrefter den: 34,1 grader i snitt over 400 meter med et 46,9 graders vindu 20 til 80 meter ut fra varden. Sør måler 25,5 med samme 46,9 i vinduet 30 til 90 meter, og øst 24,9 med 35,5. Nordvest — der ruta kommer opp — måler 3,7 grader i snitt, med 7,7 som bratteste vindu.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '898 høydemeter der bratteste hundremetersband er 15,8 grader, fra 700 til 800 moh, og bratteste sammenhengende steg 25,8 grader mellom 661 og 683. Fri Flyt skriver at hele oppstigninga går i terreng under 30 grader og fører turen som KAST 1. Ruta gir tilbake 16 høydemeter på 5,93 km.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Fri Flyt fører ett utløpsområde og «den bratte sørøstsiden av toppen. Her kan det være skumle skavler.» Sveipet måler den sida til 34,1 grader i snitt og 46,9 i bratteste vindu 20 til 80 meter ut, og sørsida til 25,5 med samme 46,9 i vinduet 30 til 90. Nedkjøring mot Storbekkdalen er brattere enn oppstigninga, og Fri Flyt kaller det skredfarlig terreng.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'storbekkhoa';

update public.tk_tours set
  description_up   = 'Start på parkeringa i Dalen, 599 moh — avgiftsbelagt og taggd for ski, nede ved Storlidalsvegen. Fri Flyt beskriver den samme starten som «brua mellom Dalsvatnet og Ångårdsvatnet»; brua ligger 300 meter unna. Opp går det med en gang: 11,8 grader fra 600 til 700 moh og 19,8 fra 700 til 800, gjennom bjørkeskogen som slipper taket på 961 moh.

Videre slakt på skrå oppover mot Korgtjønna, 1151 moh. Bandene måler 15,3 og 12,8 grader, og bandet fra 1000 til 1100 moh måler 15,1 grader over 405 meter grunn.

Fra Korgtjønna flater det ut — 3,4 grader fra 1100 til 1200 moh over 1800 meter grunn — og ruta dreier vestover. Linja går over selve tjønna, 720 meter på 1151 moh; det er dit ut.no sender deg, men det er et vatn, og det skal vurderes som et vatn.

Så runder du Mjølkskåla. Ut.no sier det presist — «rund eggen med vatnet Mjølkskåla under deg» — og linja gjør det: over skuldra øst for vatnet på 1275 moh, videre over eggen nord for det på 1290, og opp mot 1324 moh før siste stigning. Vatnet ligger på 1277 moh og blir liggende under deg.

Siste stigning måler 19,5 grader fra 1400 til 1500 moh og 17,0 videre, med et steg på 26,1 grader mellom 1481 og 1499 moh. Toppen heter Snydda i place-navneregisteret og måler 1582,3 moh; ut.no publiserer 1580 og Fri Flyt 1564, og kortet fører målinga. Punktet som er registrert som Okla ligger 2,4 km rett vest, på peiling 267, og er 1458,8 moh — fjellet heter Okla, men varden står på Snydda.',
  description_down = 'Ned samme veien, og første trekk fra varden går østover langs ryggen, ikke ned: første 200 meter peiler 73 grader ned til 1510 moh, og 500 meter ned 71. Parkeringa ligger 3,4 km unna, på peiling 167 grader.

Grunnen til at det trekket betyr noe er nordsida. Nordvest måler 44,7 grader i snitt over 400 meter med et 57,1 graders vindu 200 til 260 meter ut, og nord 43,6 med 50,9. Det er der Fri Flyts alternative nedkjøring mot Gjevilvatnet går, og de kaller den «svært bratt og seriøst» — den ender dessuten langt fra bilen. Sørvest, langs Okla-ryggen, måler 3,4 grader i snitt: det er det flate topplatået beskrivelsene omtaler, og i dårlig sikt er det navigeringa som er problemet.

Sørsida er den kortet fører, og den er ikke slak heller: sør måler 27,4 grader i snitt med 34,0 i bratteste vindu, sørøst 33,1 med 39,4. Fri Flyt om oppstigningssida: «Dette er en side der det legger seg mye snø, så vurdér skredfaren nøye», og om bekkedalen langs Sandbekken at den «bør bare kjøres under svært stabile forhold».',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '1025 høydemeter der bratteste hundremetersband er 19,8 grader fra 700 til 800 moh og bratteste sammenhengende steg 26,1 grader mellom 1481 og 1499. Ruta gir tilbake 41 høydemeter. Fri Flyt skriver at Okla ikke er en bratt topptur, og terrengmålinga er enig — det er snømengden på sørsida, ikke vinkelen, som er problemet her.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Sørsida, som er både oppstigning og nedkjøring, måler 27,4 grader i snitt med 34,0 i bratteste vindu, og sørøst 33,1 med 39,4 — nok til at det løsner, og Fri Flyt sier selv at det legger seg mye snø her. Nord og nordvest er en helt annen kant av fjellet: 43,6 og 44,7 grader i snitt, med vindu på 50,9 og 57,1, og du ender ved Gjevilvatnet i stedet for ved bilen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'okla';

update public.tk_tours set
  description_up   = 'Start på den avgiftsbelagte parkeringa ved Bree, 653 moh — ti plasser, taggd for både ski og fottur, og Fri Flyt sender deg dit med «følg veien som går til venstre etter butikken og kjør ca 1,3 kilometer». Herfra og til varden følger linja den kartlagte vinterløypa, en sammenhengende skitour-trasé på 5,13 km som ender 25 meter fra toppunktet; største avvik mellom linja og løypa er 166 meter.

Løypa er hogd ut gjennom skogen og svinger seg opp gjennom hyttefeltet i Hornlia — 113 hytter ligger innafor 300 meter av linja. Bandene måler 8,5 og 9,9 grader fra 600 til 800 moh. Skogen slipper taket på 921 moh, og fra 931 er du på åpent fjell.

Over tregrensa fortsetter løypa mot nordvest, og den holder kursen resten av veien. Bandene måler 12,4, 11,4, 9,6, 10,7, 11,8 og 9,6 grader oppover, og det bratteste av dem alle er 13,1 grader fra 1400 til 1500 moh, over 465 meter grunn. Det bratteste sammenhengende steget på hele turen ligger også her: 20,5 grader mellom 1463 og 1480 moh. Det er en stigning uten kneiker.

På 1589 moh står steinbua fra 1946, med gjestebok. Dette er den best kontrollerte toppen i runden: terrengmodellen gir 1589,0 moh mot publiserte 1589, og Fri Flyts egen GPS-posisjon for toppunktet lander 10 meter fra det punktet. Linja stiger 936 høydemeter mot ut.nos oppgitte 928 og Fri Flyts 900, og måler 4,84 km mot ut.nos 5,2 og Fri Flyts 5,3.',
  description_down = 'Ned samme veien — det er linja Fri Flyt anbefaler. Første 200 meter fra bua peiler 153 grader, ned til 1567 moh, og 500 meter ned 145. Parkeringa ligger 4,7 km unna, på peiling 135 grader, så nedkjøringa følger oppstigninga hele veien.

Det bratte på dette fjellet ligger bak deg når du står ved bua. Nordøst måler 30,7 grader i snitt over 400 meter, med et 46,2 graders vindu bare 10 til 70 meter ut; nord 22,2 med 37,7 i vinduet 20 til 80, og øst 23,1 med 34,4. Sør og sørvest, der løypa kommer opp, måler 6,0 og 0,4 grader i snitt.

Fri Flyts eget faremoment peker sørover: «Hvis du velger å oppsøke det bratte terrenget rundt Omnråa sør for toppen må du ta hensyn til både eksponert terreng og skredfare.» Det er en reell advarsel, og den ligger lenger ute enn du ser fra bua. Sørover er det platå i halvannen kilometer — under ti grader hele veien — og så bryter terrenget av: fra rundt 1490 meter ut måler 60-metersvinduene 37 til 40 grader, det bratteste 39,7 grader 1610 til 1670 meter ut, og enkelttrinn på ti meter går opp i 48. Ved to kilometer har du mistet 339 høydemeter. Det er kanten over Omnråa, og den er ikke slak — den er bare langt unna. Kanten du kan gå ut på uten å ha gått langt, er nordøst.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '936 høydemeter der ingen del av den routede linja måler mer enn 20,5 grader, og bratteste hundremetersband er 13,1 fra 1400 til 1500 moh. Fri Flyt fører bratteste punkt som under 25 grader og klassifiserer turen som KAST 1, enkelt. Ruta gir ikke tilbake en høydemeter på 4,84 km — den stiger uavbrutt fra bilen til bua, på en trasé som er kartlagt som vinterløype hele veien.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nordøstsida er den som teller der du står: 30,7 grader i snitt over 400 meter og 46,2 grader i vinduet 10 til 70 meter ut fra toppen, med nord på 22,2 og øst på 23,1. Sørsida, som Fri Flyt navngir i faremomentet sitt, måler 6,0 grader i snitt de første 400 meterne — men den er ikke ufarlig, den er bare langt unna: fra rundt 1490 meter ut faller den 37 til 40 grader ned mot botnen Omnråa. To ulike ting, og det er nordøst som ligger ved bua.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Trollheimen på varsom.no. Trollheimen er en A-region og varsles hver dag i sesongen, så her finnes det en vurdering å lese. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'storhornet';

update public.tk_tours set
  description_up   = 'Fra parkeringen på Hellerøra (Øvre Kavli), 185 moh, følger du bomveien nordover den første kilometeren, til den krysser Heiaelva. Rundt svingen og videre inn på sporet mot Kavlisetra og Måsvassbu.

Ved rundt 420 moh forlater du Måsvassbu-sporet og går nordøst opp gjennom åpen bjørkeskog. Skogen slipper taket på 632 moh, og derfra er det åpent terreng resten av veien. Målet er Vesttoppen på Steinberget, 766 moh.

Fra Vesttoppen følger du kammen østover til Steinberget, 981 moh. Ryggen henger sammen og stiger jevnt, men rett nord for Steinberget faller den 19 meter i et søkk før den reiser seg igjen. De 19 meterne må du opp igjen på vei tilbake — de er med i turens 1277 høydemeter.

Herfra går sørvestryggen nord-nordøstover mot toppen. Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1400 og 1500 moh og holder 22,1° i snitt; sjiktet under, 1300 til 1400 moh, måler 20,5°. Det bratteste enkelttrinnet ligger i det samme høydelaget, mellom 1411 og 1433 moh, og måler 30,3°. Skavler henger ut på både øst- og vestsida av toppryggen; hold deg på ryggen og klar av begge kanter helt inn til varden på 1439.',
  description_down = 'Standardnedkjøringen går sørover fra toppen, ned sørflanken til Kavliheian — 950 sammenhengende høydemeter — og derfra i oppkjørte spor tilbake til Øvre Kavli. Øverste del kan skjule stein tidlig i sesongen; den beste snøen ligger lenger ned. Sørflanken er også det første stedet i området som blir oppkjørt etter snøfall, så vær tidlig ute om du vil ha den urørt.

Vanligste feil: å ta sørflanken som standard uansett forhold. Øverste del holder 30–35°, og skredterrenget ligger i to belter, 1300–1400 moh og 950–1050 moh — begge går du gjennom på vei opp også. Holder ikke varselet til det, går du tilbake over Steinberget, samme vei som opp, og opp igjen gjennom søkket.

Vestrenna er den andre linja ned: jevnt 42–48°, med et 60 meter langt parti på rundt 55° der renna er smalest, og videre ut dalen til Loftskarsetra og ned gjennom skogen til parkeringen. Den krever stabil vårsnø eller stabile vinterforhold og en helt egen vurdering — snøkvaliteten i renna er vanskeligere å vurdere enn å kjøre den. Det er ikke noe du velger på toppen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigninga over Steinberget er den slake linja på fjellet, men den er ikke skredfri. Skredterrenget ligger i beltene 950–1050 moh og 1300–1400 moh, og du går gjennom begge på vei til toppen. Sjiktet 1300–1400 moh måler 20,5° i snitt, og hundremeteren over det — 1400–1500 moh, 22,1° — er den bratteste på oppstigninga; det bratteste enkelttrinnet ligger i den, mellom 1411 og 1433 moh, og måler 30,3°.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Toppryggen bærer skavler på både øst- og vestsida, og under dem er det ikke slakt: nordøstsida faller 44° i snitt, nord- og sørøstsida 36°, og alle tre har bergband over 60°. Sørflanken under toppen er 30–35° øverst, og Vestrenna 42–48° med et 60 meter langt parti på rundt 55°. Nordvest for ryggen over Steinberget faller det av mot Loftskarsetra, rundt 27° i snitt med trinn opp mot 46°.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Romsdal på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'kirketaket';

update public.tk_tours set
  description_up   = 'Fra parkeringsplassen i Skorgedalen, 307 moh på bomvegen fra Skorga på E136 — vinteråpen, og kartlagt som parkeringsplass i OSM. Fra plassens nordvestre hjørne går du over flata — myr etter Kartverkets klasser, 350 moh der linja krysser — nord for Kjerringhaugen og DNT-hytta Skorgedalsbu. Så opp bjørkeskogen: beltet fra 400 til 500 moh er turens bratteste, 20,5 grader over 295 meter grunn, og skogen slutter på 556 moh etter 1,35 km, med åpent område fra 557.

Over skoggrensa runder du sør for topp 588 og følger en svak ryggformasjon — 572 moh der linja tar den — mot Skarvens sørlige fortopp på 788. Beltene her måler 16,4 grader fra 600 til 700 moh og 15,7 fra 700 til 800: jevn skinning på åpen rygg, med utsikten østover mot Romsdalen og vestover mot Romsdalsfjorden og Molde voksende for hvert belte.

Fra fortoppen følger ryggen videre over 892 moh til varden. Det bratteste sammenhengende partiet på hele turen ligger her — 27,7 grader mellom 937 og 960 moh — og beltet fra 900 til 1000 måler 19,3 grader. Varden står på 1048 moh: Fri Flyts publiserte GPS-punkt, registerets fjellnavn og terrengmodellens 1048,1 faller sammen på meteren.',
  description_down = 'Normalveien ned er sporet ditt opp, og sørøstflanken den følger er den slakeste sektoren på toppen: 19,6 grader i snitt mot sør og 26,3 mot sørøst, med 35,9 og 34,4 grader som bratteste 60-metersvinduer 90 til 180 meter ut fra varden. God, jevn kjøring som svært ofte har god snø, sier ut.no.

Alternativene er brattere og hører til i god stabilitet: NM-løypa fra 1940 ned sørøstflanken mot Skarvebotn måler 33 grader over hundre høydemeter mellom 1020 og 920 moh, og Vasslia direkte mot Selsetervatnet 40–42 grader med passasjer på 45. Hold deg unna nordvestsiden — den måler 43,3 grader i snitt med 55,0 grader som bratteste 60 meter bare 80 til 140 meter ut.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt gir turen KAST 1 – Enkelt og bratteste punkt under 30 grader, og linja måler 20,5 grader i bratteste belte og 27,7 i bratteste parti. Kortet bærer likevel grad 2: tallene ligger over det grad 1-turene i appen måler, og fjellet har sider der feil koster.'
    ),
    jsonb_build_object(
      'title', 'Østflanken',
      'body',  'Fri Flyt er direkte: «Ikke kryss østflanken under Skarvens fortopp. Dette er et av få områder på denne siden av fjellet som kan være skredutsatt.» Målingen sier hvorfor — østsiden faller 34,4 grader i snitt med 49,7 grader som bratteste 60-metersvindu 220 til 280 meter ut fra varden. Normalveien holder ryggen og har ikke noe der å gjøre.'
    ),
    jsonb_build_object(
      'title', 'Vind og sol',
      'body',  'Kilden peker på skredfare i de øvre delene etter vind fra nordvest, og på at sørøstflanken er soleksponert — på vårdager løsner det her når sola har stått på. Tidlig start er svaret begge steder.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skarven ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–april er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'skarven';

update public.tk_tours set
  description_up   = 'Fra Isfjorden stadion — OSM har banen kartlagt, og terrengmodellen svarer 5,7 moh med klassen SportIdrettPlass, samme sjeldne treklang av guidebok, kartobjekt og terrengmodell som Glitreggas idrettsanlegg. Traktorvegen tar deg opp sørøstlia forbi fotballbanen: beltet fra 0 til 100 moh måler 7,9 grader, og så bratner det til — 21,0 grader fra 200 til 300 moh over 261 meter grunn, med turens bratteste sammenhengende parti, 31,5 grader, mellom 279 og 300 moh. Det bratteste på hele turen ligger altså i skogen.

Skogen åpner seg mot sørvest under Litlehestens bratte vegg — 454 moh der linja passerer foten — og du krysser Steinselva på 536. Skogen slutter på 673 moh etter 2,75 km, med åpent område fra 683. Så sikter du mot den slakeste ryggformasjonen mot Høgnosa: beltet fra 800 til 900 moh måler 12,7 grader, og fra 900 til 1000 14,0.

Fra Høgnosa går ryggen sørover mot toppen — 1060 moh der linja tar den, og beltene over 1000 måler 12,3 og 8,0 grader før den siste kneiken på 14,1. Varden står på 1215 moh med Romsdalseggen mot Blånebba og Store Venjetinden i sør og Romsdalsfjorden i nord. Registeret leser 1206 på representasjonspunktet; toppsøket klatrer til 1215,3 mot publiserte 1216.',
  description_down = 'Normalveien ned er sporet ditt opp, og retningen av toppen er nord — ryggen mot Høgnosa er den eneste slake sektoren der oppe, 4,2 grader i snitt over 500 meter med 21,1 grader som bratteste 60-metersvindu. Alt annet er bratt: sør og sørvest faller 43,7 og 42,4 grader i snitt med vinduer på 61,0 og 58,5, og nordøstsiden rett under toppen har et 60-metersvindu på 61,7 grader bare 30 til 90 meter ut.

Fri Flyt dokumenterer brattere nedfarter mot Jamnåbotn og Storhestvatnet, 30 til 45 grader med aspekt nord til øst-nordøst. De hører til i god stabilitet og med sporvalget lagt før du står i henget.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, bratteste punkt 28 grader på normalveien — og den ferdige linja måler 31,5 grader i det bratteste partiet, nede i skogen mellom 279 og 300 moh. Over skoggrensa holder ryggen seg slak: ingen belte over 900 måler mer enn 14,1 grader.'
    ),
    jsonb_build_object(
      'title', 'Leheng og skavler',
      'body',  'Kilden peker på skredfare i leheng etter vind fra sør og vest, og på skavler på de østvendte hengene. Ryggen du følger har det bratte tett inntil seg — nordøstsiden under toppen måler 61,7 grader i bratteste vindu — så linja er god fordi den holder seg der den er, ikke fordi terrenget rundt er snilt.'
    ),
    jsonb_build_object(
      'title', 'Sikten',
      'body',  'Rutefinningen er kildens eget varsku: i dårlig sikt er det krevende å holde ryggformasjonen, og feil retning av toppen setter deg over heng på 45 grader eller mer. Retningen ned fra varden er nord, mot Høgnosa — det er verdt å merke seg før skodda kommer, ikke etter.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Mjølvafjellet ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Ta med sender/mottaker, søkestang og spade. Merk at ut.no beskriver fjellet fra Venjesdalen — en annen start enn denne; linja her er Fri Flyts, og andrekilden dekker fjellet, ikke linja.'
    )
  )
where slug = 'mjolvafjellet';

update public.tk_tours set
  description_up   = 'Fra parkeringa der bomvegen opp Venjesdalen ender, ved Venjesdalssetra — OSM har setra som eget punkt, og DTM1 leser 418 moh der Fri Flyt oppgir 380. Du går sørover etter Romsdalseggen-merkinga gjennom rydda skoggater på nordsida av Tverrelva: beltet fra 400 til 500 moh måler bare 7,2 grader, og skogen slutter allerede på 553 moh etter 1,2 km, med åpent område fra 559.

Over skoggrensa åpner flata mellom Blånebba og Storhesten seg — 681 moh der linja krysser. Herfra holder du vestover i slak stigning til du finner nordøstflanken som leder opp mot det laveste punktet på ryggen mellom Blånebba og punkt 1178. Flanken er turens bratteste del: beltet fra 800 til 900 moh måler 22,2 grader over 269 meter grunn, og det bratteste sammenhengende partiet ligger her, 27,4 grader mellom 972 og 999 moh.

Skaret leser 1245 moh på terrengmodellen, 230 meter vest-nordvest for toppen, og hovedryggen følges østover derfra til varden på 1317 — beltet fra 1200 til 1300 måler 17,2 grader. Fri Flyts direkteveg gjennom toppryggen er den andre muligheten, rundt 40 grader ifølge kilden; linja her er traversen han beskriver som det slakere valget rundt 1000 moh. Registeret leser 1272 på representasjonspunktet, toppsøket klatrer til 1317,0 mot publiserte 1320 — et skarpt topp-punkt der laserskannet leser tre meter under den publiserte høyden, samme klasse som Rørnestinden.',
  description_down = 'Normalnedfarten er nordøstflanken du kom opp — 35 til 40 grader ifølge Fri Flyt, og målt 36,2 grader i snitt over 500 meter med 43,6 grader som bratteste 60-metersvindu 140 til 200 meter ut. Ryggen mot nordvest, tilbake mot skaret, er den eneste slake sektoren på toppen: 16,5 grader i snitt.

Nordryggen er kildens avanserte alternativ — 38 til 43 grader med passasjer på 45, aspekt nord til øst. Og hold varden mellom deg og Romsdalen når du snur: sør- og sørvestsiden faller 71,4 og 72,0 grader i de første 60 metrene fra toppen. Det er kanten du kom for å se utover, ikke utfor.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, faremomenter skred og skavl. Linja måler 22,2 grader i bratteste belte og 27,4 i bratteste parti — under de 30 der de store skredene løsner, men flanken du krysser mellom 800 og 1000 moh ligger i le for nordvestlig vind, og terrenget rundt er omkranset av steinheng med store konsekvensområder.'
    ),
    jsonb_build_object(
      'title', 'Skavlene',
      'body',  'Skavleksponeringen er mot nord, og ut.no legger til at partiene nær toppen er smale med store skavler. På ryggen fra skaret østover til varden går du med nordsiden under skavl og sørsiden 71 grader ned mot Romsdalen — hold deg på linja, særlig i flatt lys.'
    ),
    jsonb_build_object(
      'title', 'Sesongen',
      'body',  'Fri Flyt gir mars–mai, ut.no desember–april. Kortet bærer Fri Flyts, som er primærkilden for linja — uenigheten står her heller enn å midles bort. Bomvegen opp Venjesdalen brøytes; setra er vinterstart for både Blånebba og naboturene.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Blånebba ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'blanebba';

update public.tk_tours set
  description_up   = 'Fra bomkassa ved gården Venås innerst i Måndalen, 201 moh, følger du bomveien til Venåssetra — beltene fra 200 til 400 moh måler 3,0 og 3,7 grader over nesten tre og en halv kilometer veg, jevn og fin stigning innover dalen. Setra er et godt hvilepunkt på finværsdager, sier morotur. Terrengmodellen leser 393 moh der; Fri Flyts «ca 700» for setra er feil, registeret og terrengmodellen er enige.

Fra setra går du rett vest over myra — 414 moh — og krysser Stavvasselva, så sikter du mot den store østvendte botnen. Skogen slutter på 694 moh etter 4,77 km, men linja streifer skogholt helt opp til 805 moh og er åpen for godt fra 813, og botnen har jevnt stigende bratthet: 15,4 grader fra 600 til 700 moh, og så turens bratteste belte, 22,4 grader fra 700 til 800 over 225 meter grunn, med det bratteste sammenhengende partiet — 25,6 grader — mellom 764 og 779 moh.

Fra flata på rundt 900 moh — 948 der linja tar den — er det vanlig å trekke ut mot nordøstryggen, og det er det linja gjør: beltet fra 900 til 1000 måler bare 8,5 grader på traversen ut. Ryggen tar deg vestover mot varden — 19,0 grader fra 1100 til 1200 — med utsikten over fjordene mot Molde og havet bak deg. Registeret leser 1203 på representasjonspunktet; toppsøket klatrer til 1227,5 mot publiserte 1228. Selve toppen er ofte avblåst med bart berg og hardpakke — det første 60-metersvinduet ned nordøstryggen måler 45,3 grader, så skiene blir stående der du satte dem.',
  description_down = 'Normalnedfarten er østflanken: rett ned gir jevnt 30 grader ifølge Fri Flyt, og målingen er enig — østsiden måler 27,5 grader i snitt over 500 meter med 31,9 grader som bratteste 60-metersvindu 70 til 130 meter ut. Fra flata på rundt 900 moh følger du vanligvis sporene fra turen opp.

Sørflanken er alternativet: 400 høydemeter jevnt bratt ned mot Øspevatnet, 33 til 40 grader ifølge kilden — og målt 33,9 grader i snitt med 37,3 som bratteste vindu rett under toppen. Den hører til i god stabilitet, og den ender et annet sted enn bilen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 2 – Utfordrende hos Fri Flyt, bratteste punkt rundt 35 grader øverst i botnen der kildens direktelinje går. Linja her går ut på nordøstryggen fra flata i stedet — det er sporvalget kilden selv legger med tanke på skred etter vind og snø fra nord — og måler 25,6 grader der den er brattest.'
    ),
    jsonb_build_object(
      'title', 'Lehengene',
      'body',  'Kilden er konkret om vinden: sørøst- og nordøstryggene danner leheng i henholdsvis sørlig og nordlig vind. Botnen du krysser er østvendt og samler snø etter vestavær — les hengene over deg gjennom hele stigningen fra 700 til 900.'
    ),
    jsonb_build_object(
      'title', 'Toppen',
      'body',  'Toppen er ofte snøfri med bart berg og hardpakke, og glifare er kildens eget ord. Det første 60-metersvinduet ned nordøstryggen måler 45,3 grader — skiene settes igjen noen meter under toppen, og de siste metrene går til fots.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Øspetinden ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen desember–mai er Fri Flyts. Ta med sender/mottaker, søkestang og spade, og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'ospetinden';

update public.tk_tours set
  description_up   = 'Fra Herdslan på bomvegen mot Bøstølen — registerets Herdslan er ei slette ved veien, og myrflata der bilene står leser 348,7 moh mot Fri Flyts oppgitte 360. Veien følges vestover på sørsiden av Berillvatnet, som er regulert: linja runder hele vannet på land, om vestenden på 403 moh, og krysser elva vest for vatnet på egnet sted slik kilden sier — 390 moh der linja tar den. Beltet fra 300 til 400 moh måler 1,3 grader over 2,4 km veg.

Fra skogen vest for vatnet — 410 moh — går det opp bekkedalen mot skaret øst for punkt 943, ved Tindevatnet. Skogen slutter på 740 moh etter 3,68 km, med åpent område fra 759, og dalen bratner jevnt: 21,0 grader fra 500 til 600 moh, 19,2 fra 600 til 700 og turens bratteste belte, 25,1 grader over 170 meter grunn, fra 700 til 800. Øvre del av bekkedalen er bratt og skredutsatt — det er kildens egen formulering, og det er her turen krever sin stabilitet.

Skaret leser 937 moh der linja tar det, med Tindevatnet på 804 under deg i vest. Herfra travereres ryggen østover mot toppen — 17,3 grader fra 1000 til 1100, 21,3 fra 1200 til 1300 — og den er lite skredutsatt, men ofte avblåst: skiene på sekken, og stegjern og isøks kan trengs. Når ryggen flater ut nordover kan skiene ofte på igjen langs vestsiden.

Den siste vestvendte flanken før toppen er bratt — 37 grader ifølge Fri Flyt, ofte avblåst, og med liten plass. Linja måler 30,0 grader i det bratteste sammenhengende partiet mellom 1549 og 1568 moh, og beltet fra 1500 til 1600 måler 23,8. Varden står på 1568 moh; registeret leser 1547 på representasjonspunktet, og toppsøket klatrer til 1568,3 mot publiserte 1569. Landet har 49 fjell som heter Middagstinden — dette er Raumas.',
  description_down = 'Normalnedfarten er den store vestvendte flanken fra toppen, først mellom steinutslag — kilden peker særlig på de øverste hundre metrene — og med en travers sørover før kjøringen begynner. Rundt 700 meter bratt kjøring ned mot skaret, så 500 meter skogskjøring. Vestsiden måler 31,6 grader i snitt over 500 meter med 38,3 grader som bratteste 60-metersvindu 10 til 70 meter ut — det stemmer med kildens 37.

Gullkoppen-variantene er kildens avanserte alternativer: en travers på snørampa øst for Gullkoppens bratte vegg fra rundt 1360 moh med heng opptil 45 grader, og en direkte 50-graders flanke på sørsiden av undertoppen rundt 1300. Begge hører til seint på vinteren med gjennomfrossen snø — og ingen av dem er linja på kartet her.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'KAST 3 – Komplekst hos Fri Flyt, bratteste punkt 39 grader. Terrenget gir ikke rom for feil på de eksponerte partiene, sier kilden — øvre del av bekkedalen er bratt og skredutsatt, og skredterreng i heng over 30 grader står i selve rutebeskrivelsen. Dette er en tur for tørr, stabil vintersnø eller gjennomfrossen vårsnø med kalde netter.'
    ),
    jsonb_build_object(
      'title', 'Eggen og flanken',
      'body',  'Ryggen fra skaret er lite skredutsatt men ofte avblåst — ski på sekken, stegjern og isøks kan trengs, og den siste vestvendte flanken har liten plass. Målingen sier hvor smal marginen er: fra varden faller sør, sørvest og sørøst 75,7, 73,4 og 71,5 grader i de første 60 metrene, og bare vest er kjørbar — 31,6 grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Steinutslag',
      'body',  'Kilden peker på stein særlig i de øverste hundre metrene av vestflanken, og seint i sesongen tar sola de lavere delene. Tidlig start og en plan for hvor du snur er del av utstyret her.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Middagstinden ligger i varslingsregionen Romsdal, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar–april er Fri Flyts. Ta med sender/mottaker, søkestang og spade i tillegg til stegjern og isøks — og les terrenget selv: et varsel beskriver regionen, ikke flanken du står i.'
    )
  )
where slug = 'middagstinden';

update public.tk_tours set
  description_up   = 'Start ved Fausaskiftet ved enden av Nysætervatnet, 333 moh, der Fausavegen tar av fra veinettet om lag fire kilometer forbi skianlegget. Veien hit er åpen hele året.

Ta på skia og gå nordover. De første 671 meterne grunn ligger på 6,2 grader i snitt, og skogen holder til 553 moh.

Over skogen fortsetter stigninga jevnt og uten trinn: 14,2 grader fra 500 til 600 moh, 11,4 fra 600 til 700 og 11,7 fra 700 til 800. Ved 685 moh er du ute i den åpne sida, og rett over ligger bratteste partiet på turen — 26,4 grader over tretti meter, mellom 862 og 884 moh, i bandet som måler 18,6 grader i snitt.

Fra 900 moh og opp er det jevn rygg hele veien: 16,1 grader fra 900 til 1000 moh, 18,1 fra 1000 til 1100 og 15,1 fra 1100 til 1200, med varden på 1203 moh.',
  description_down = 'Ned samme ryggen, sørøstover mot Nysætervatnet, i moderat og oversiktlig skiterreng. Følger du ryggen opp og ned, holder ruta seg under 30 grader hele veien.

Vanligste feil: å tro at det bratteste ligger mot øst. Målingene sier noe annet. Fra tre punkter på ryggen — 896, 1000 og 1103 moh — måler østsida 7,5, 7,0 og 8,9 grader i snitt over 400 meter, og fra varden 18,9. Det bratte ligger nord og nordøst for toppen: 30,6 og 35,8 grader i snitt, med 60-metersvinduer på 58,9 og 50,5. Ryggen opp er den slake linja, og terrenget bak toppen er det du ikke ser fra den.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Jevn stigning på om lag femten grader i snitt. Bratteste hundremeteren, 800 til 900 moh, måler 18,6 grader, og bratteste sammenhengende parti 26,4 grader mellom 862 og 884 moh. Ryggen er bred, og det er den som er ruta både opp og ned.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Researchen for denne turen sa at fjellet har et brattheng mot øst over 30 grader. Det finner ikke terrengmodellen: øst fra ryggen måler 7 til 9 grader i snitt og øst fra varden 18,9, med det bratteste 60-metersvinduet på 31,1 grader hele 280 til 340 meter ut. Det som faktisk er bratt, er nord og nordøst for toppen — 30,6 og 35,8 grader i snitt med vinduer på 58,9 og 50,5. Det er lengden og den sida, ikke østsida, som skiller turen fra en ren nybegynnertur.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'auskjeret';

update public.tk_tours set
  description_up   = 'Snøheim turisthytte, 1474 moh, ligger ved enden av Snøheimvegen. Veien er stengt for privatbil, og sykling er bare tillatt i vinduet 1. juni–15. juli av hensyn til villreinen — el-sykkel er forbudt hele året. Bussen fra Hjerkinn går først når hytta åpner rundt St. Hans. I skisesongen tar du altså de fjorten kilometerne inn fra Hjerkinn for egen maskin — det er den delen av dagen folk undervurderer. Fra hytta følger du sporet et par hundre meter vestover til gangbrua over Stridåe. Brua ligger i sørøsthjørnet av tjernet rett vest for hytta; du går rundt sørsida av tjernet, ikke over det.

Etter brua svinger du umiddelbart til høyre inn på Forsvarets gamle traktorveg, sperret for kjøring med store steiner. Den tar deg jevnt oppover til Gamle Reinheim, ruinen på 1670 moh. Ingen skog noe sted på denne turen — du er over tregrensa fra hytta og oppover, og ser hele ryggen foran deg hele veien.

Fra Gamle Reinheim stiger det bratt, delvis på snøfonner, opp på østryggen. Oppe på kammen ligger stidelet mot Reinheim i Stroplsjødalen, inngangen for dem som kommer østfra. Hold avstand til det bratte terrenget mot nord i starten av stigningen; ryggen er bred nok til at du kan gå midt på den.

Det bratteste hundremeterbeltet ligger mellom 1700 og 1800 moh og holder 16,0° i snitt — beltet over, 1800 til 1900 moh, måler 13,8° — og bratteste parti på linja måler 21,7°. Herfra er det staker og varder hele veien, og øverst går det på snøfonner opp til Stortoppen, 2286 moh, der radiolinkstasjonen står. I dårlig sikt er det stakene som holder deg på kammen — den øvre delen er bred nok til at du mister følelsen av hvor ryggen går.',
  description_down = 'Samme vei ned. Fra Stortoppen til Gamle Reinheim gir østryggen drøyt 600 sammenhengende høydemeter, og de siste 200 tar traktorvegen. Under 1800 moh slakner det så mye at det blir mer gliding enn svinger. Vil du ha mer helning og bedre snø, legger du noe av nedkjøringen sør for oppoversporet — men da står du i 30–40°-terreng i stedet for 20°.

Vanligste feil kommer helt til slutt: å forlate traktorvegen for tidlig og sikte rett mot Snøheim. Da har du tjernet vest for hytta i veien, og utløpsbekken bak det. Følg veien helt ned til enden ved sørvesthjørnet av tjernet og ta stien østover derfra — gangbrua er den eneste kryssinga, og fra brua er det 230 meter igjen til hytta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Østryggen er slak etter høyfjellsmålestokk. Det bratteste hundremeterbeltet, mellom 1700 og 1800 moh, holder 16,0° i snitt, og bratteste parti på linja måler 21,7°. Fra Snøheim til Gamle Reinheim går du på gammel traktorveg i åpent, slakt terreng. Det som betyr noe her er ikke det du står på, men hvor nær kanten av kammen du legger sporet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Nord for kammen ser det slakt ut, og de første tre hundre meterne er det — terrenget flater ut og stiger til og med litt. Så bryter det: fire–fem hundre meter nord for sporet faller kanten over 55° og drøyt 130 høydemeter, ned på flatene som strekker seg mot Leirpullan og Larsurda. Du ser den ikke fra ryggen. Rett under Stortoppen er nordsida bratt hele veien: 31° i snitt over de første fem hundre meterne, med partier over 50°. Sørsida faller jevnere, rundt 30° i snitt, men med partier på 37–46° mellom 1950 og 1800 moh. Renna østover fra Vesttoppen er en annen tur — over 30° i snitt, brattest rett under kanten, og med en bregleppe nederst.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Dovrefjell ligger i varslingsregion Nord-Gudbrandsdalen. Det er en B-region på varsom.no: skredvarsel publiseres bare når faregraden ventes å bli 4 eller 5, så en tom side betyr ikke trygt fjell. Les værhistorikken og observasjonene i regionen selv, og ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'snohetta';

update public.tk_tours set
  description_up   = 'Start i Vollane ved Tverrelva, 107 moh, øverst i gårdsveien fra Molladalsvegen. Gå gjennom stålgrinda ved elva og følg stien oppover, først på venstre og så på høyre side av elva.

Den første delen er den bratteste av de lave bandene: 19,6 grader fra 200 til 300 moh og 19,3 fra 300 til 400. Terrenget legger seg ved Vollesætra på 411 moh, og skogen holder til 463.

Fra setra går det i relativt slakt terreng opp mot Rametinden, 1197 moh — bandet fra 700 til 800 moh måler 12,1 grader og 900 til 1000 moh 15,2. Fra Rametinden faller ryggen til skaret på 1089 moh; det er 108 høydemeter du gir fra deg på vei opp, og linja henter dem inn igjen med bandet fra 1100 til 1200 moh på 5,2 grader over 1019 meter grunn.

Fra skaret stiger ryggen 328 høydemeter til toppen, og det er her turen skifter karakter: bandet fra 1200 til 1300 moh måler 18,5 grader, bratteste sammenhengende parti 33,7 grader mellom 1165 og 1185 moh, og selve toppen er en haug av store steinblokker. De siste hundre høydemeterne går på egg, og de fleste setter skia igjen på ryggen.',
  description_down = 'Ned samme ryggen: over skaret, opp igjen den lille kneika til Rametinden og ned nordryggen til Vollesætra og Vollane. Fallretninga er nord.

Vanligste feil: å ta Jønshornrenna ned i Molladalen uten å ha ordnet transport. Fri Flyt beskriver den runden, og den holder opp mot 45 grader — men den ender i en annen dal enn den du parkerte i, og krever to biler. Den andre er å regne egga som en del av skituren: den er hundre høydemeter til fots på eksponert rygg.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Jevn oppstigning til Rametinden og alvor over skaret. Bratteste sammenhengende parti måler 33,7 grader mellom 1165 og 1185 moh, og bandet fra 1200 til 1300 moh 18,5 grader. Sidene ned fra ryggen mellom Rametinden og toppen er skredterreng.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Jønshornrenna mot Molladalen holder opp mot 45 grader og er skredterreng. Egga de siste hundre høydemeterne er eksponert, og der er det fallhøyden og ikke snødekket som er faren — hardt føre gjør den til en annen oppgave enn løssnø.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'jonshornet';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Svartevatnet, 538 moh, ved hovedveien mellom Sykkylven og Stranda. De første 904 metrene grunn er flate — 4,3 grader — og de går langs østbredden, ikke over vatnet. Svartevatnet er et magasin: vannflata måler 526 moh, tolv meter under parkeringa, og linja holder land hele veien rundt nordenden og ned til sørenden på 524.

Gå vestover, på venstre side av elva, opp Vassdalen. Her er den bratte delen av turen: 18,2 grader fra 600 til 700 moh, 22,4 fra 700 til 800 over bare 225 meter grunn, og 20,5 fra 800 til 900, med bratteste sammenhengende parti på 25,0 grader mellom 728 og 749 moh. Skogen holder til 691 moh, og fra 706 er du i åpent terreng.

Ved de små fjellvannene — de ligger på 976 moh, linja passerer dem på 955 — flater det ut igjen: bandet fra 900 til 1000 moh måler 10,8 grader over 546 meter grunn. Det er her du ser resten av ruta, og det er også det naturlige stedet å snu om vinden har bygd skavl på ryggen over.

Derfra holder du nordvestover mot toppryggen: 11,8 grader fra 1000 til 1100 moh og 18,0 fra 1100 til 1200. De siste metrene opp til 1331 moh blir gjerne gått uten ski.',
  description_down = 'Ned samme veien, østover gjennom Vassdalen til Svartevatnet. Fallretninga er øst, og Vassdalen er både det bratteste og det mest skredutsatte på turen.

Vanligste feil: å runde skavlen mellom fortoppen og hovedtoppen på oversida. Det danner seg normalt en stor skavl der, og du skal kjøre ned i sida når du runder den — ikke følge kanten.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Flat start, bratt midtdel og et flatt parti før toppryggen: bratteste hundremeteren, 700 til 800 moh, måler 22,4 grader over 225 meter grunn, og bratteste sammenhengende parti 25,0 grader mellom 728 og 749 moh. Vassdalen er skredterreng fra 600 moh og opp. Nede ved starten er faren en annen: isen på et magasin, og ruta er lagt på land utenom den.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skavler langs toppryggen — det danner seg normalt en stor skavl mellom fortoppen og hovedtoppen, og den skal rundes på nedsida. Sida ned fra hovedtoppen er skredterreng, og nordsida er den bratteste: 43,2 grader i snitt over 500 meter med et 67,3-graders vindu alt 10 til 70 meter ut fra varden, og nordøst 56,3 grader de første 60. Øst — veien ned Vassdalen — måler 9,8 grader i snitt, og Vassdalen er likevel skredterreng og den eneste veien ned til bilen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'ytstevasshornet';

update public.tk_tours set
  description_up   = 'Start ved Urkegjerdet, 63 moh, der grusveien tar av fra hovedveien ved Urke Landhandel. Veien videre mot Haukåssætra er vinterstengt, og det er derfor turen starter nede ved fjorden og ikke oppe ved sætra på 230 moh — Fri Flyts «5 timer fra Haukåssætra» er tida fra et punkt du sjelden kommer til med bil om vinteren.

Følg veien opp gjennom skogen — Kartverket fører skog til 231 moh — forbi Haukåssætra og inn i dalen mot Nordkopen på 501 moh. Bandet fra 400 til 500 moh måler 11,7 grader, og ellers er hele innmarsjen slak: 5,5 grader fra 100 til 200 moh og 6,6 fra 200 til 300.

Fra kopen sikksakker ruta bratt opp mot egga i nord, og du tar inn på den til høyre for en markert hammer. Botnen ligger på 987 moh og eggkammen på 1331. Bandet fra 1200 til 1300 moh er bratteste hundremeteren, 19,2 grader i snitt, og partiet fra 700 til 1000 moh under det ligger på 16 til 19 grader.

Derfra følger du toppryggen nordover. Den er bred og slaker av mot 1400 moh — 7,2 grader fra 1300 til 1400 — før den siste stigninga langs kammen fra 1531 og 1562 moh til varden på 1587. Kammen kommer inn fra sørvest, og linja holder den de siste 120 meterne — 1572, 1579 og 1586 moh — i stedet for å gå rundt på østsida. Det bratteste på ruta ligger lenger nede, på egga: 28,4 grader over tretti meter mellom 1210 og 1232 moh.',
  description_down = 'Ned samme veien: kammen, den brede toppryggen, ned egga til Nordkopen og ut dalen til Urkegjerdet. Kortet fører fallretninga som sørøst; linja hjem peiler 182 grader, altså rett sør, og kammen blir holdt på vestsida der skavlene ikke er. Nedkjøringa er lang — 1561 høydemeter i ett strekk fra toppen til fjorden.

Vanligste feil: å holde seg øst på toppryggen. Det ligger store skavler på østsida av ryggen, og en flankemåling fra toppen viser at fjellet er bratt i alle retninger: 22 til 41 grader i snitt over de første 400 meterne, med 60-metersvinduer på 53 til 66 grader. Hold vest for kammen.

Den andre er tidspunktet. Ruta går gjennom skredterreng både inn mot Nordkopen og i sida opp mot egga, og i vårsnø utover ettermiddagen er det den delen av turen som endrer seg raskest.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slak innmarsj og bratt midtdel: bandet fra 1200 til 1300 moh måler 19,2 grader i snitt, og sida opp fra Nordkopen til egga er skredterreng. Selve toppkammen er smal, og det er der skavlene ligger — men linja langs den fra sørvest er ikke rutas bratteste: det er egga, 28,4 grader over tretti meter mellom 1210 og 1232 moh.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Store skavler på østsida av den brede toppryggen. Flankemålinga fra toppen gir 22 til 41 grader i snitt over 400 meter i alle åtte retninger, med 60-metersvinduer mellom 53 og 66 grader — det fins ingen slak side å slippe seg ned på her, bare kammen du kom opp.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'rana';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved Standaleidet, 376 moh, følger du den ryddede traseen nordover mot Fossane under Søre Sætretind. Skogen slipper på 474 moh, og fossen markerer inngangen til Kvanndalen.

Følg dalbunnen langs elvefaret nordover. Terrenget er slakt: det bratteste hundremeterspennet, mellom 800 og 900 moh, ligger på 17,6° i snitt. Ikke sving vest der dalen åpner seg rundt 650 moh — det juvet fører opp i breens utløp. Hold nordover til Appelsinhaugen på 950 moh, den naturlige rasten halvveis.

Fra Appelsinhaugen går du vest-sørvestover inn på flata i Kvanndalsskardet, drøyt 1020 moh. Herfra og opp til Stretet er det bratt: målte trinn i den nordvendte siden går over 45°. Stretet ligger på 1140 moh, en trang passasje på egga, og over den ser du toppen.

Over Stretet er du på Kolåsbreen, som ligger som bre fra 1173 til 1355 moh. Følg brekanten under egga sørvestover mot toppen. De fleste tar av skia rundt 1350 moh og går den siste kneika, som måler 47°. Toppen er 1432 moh, halvannen til to meter bred og ti meter lang, med skavl mot øst — hold deg midt på — og en vestside som faller 260 høydemeter på 180, med tjuemeterssteg opp mot 75°.',
  description_down = 'Ned samme vei møter du de to bratte trinnene i motsatt rekkefølge: toppslippet fra 1432 til 1350, som måler 47°, og den nordvendte siden fra Stretet ned mot Kvanndalsskardet, der målte trinn går over 45°. Begge tas på skrå og med avstand mellom folk. Fra Kvanndalsskardet og ned holder terrenget seg under 30° hele veien ut Kvanndalen.

Vanligste feil: å legge seg for langt vest på vei ned fra Appelsinhaugen. Da havner du i juvet som drenerer breen ut av Kvanndalen — trangt, med bratte sider over seg. Hold elvefaret i dalbunnen til du ser Fossane.

På dager uten skredfare gir Kolåsbreen en videre nedkjøring med flere linjevalg. Bresprekken mellom breen og toppslippet åpner seg utover sesongen: dekt i høyvinteren, åpen når det lir mot vår.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Dalgangen gjennom Kvanndalen er slak, 17,6° i snitt over det bratteste hundremeterspennet. Bratt terreng møter du to steder: den nordvendte siden fra Kvanndalsskardet opp til Stretet, der målte trinn går over 45°, og toppslippet over 1350 moh på 47°. Begge vender nord.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Østsiden av Kvanndalen tar imot skredløpene fra Sætretindane, og utløpssonene ligger i dalbunnen du går i — flere av dem krysses på vei inn. Vestover, der dalen åpner seg rundt 650 moh, går utløpsjuvet fra Kolåsbreen: trangt, med bratte sider over seg.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade. Isøks hører med over Stretet, og stegjern når snøen er hard.'
    )
  )
where slug = 'kolastinden';

update public.tk_tours set
  description_up   = 'Start ved bilparkeringa etter bommen i Nupen, 92 moh. Fri Flyt oppgir «3 timer fra Vallasætra» og «4 timer fra Nupen», og forskjellen er reell: setra ligger på 324 moh, og den videre veien dit er bomvei som bare gjelder «hvis veien er åpen».

Følg Engesetvegen oppover og østover til Vallasætra. De første 753 metrene grunn er flate — 1,1 grader — og så begynner veien: 4,3 grader fra 100 til 200 moh, 6,1 fra 200 til 300 og et brattere parti på 19,9 og 21,8 grader mellom 400 og 600 moh. Skogen holder til 581 moh langs linja. Derfra går den i åpent terreng langs kanten av et skogholt som den streifer på 637 moh, og fra 640 moh er det åpent for godt.

Fra setra går du noen hundre meter inn Langedalen og deretter bratt opp kneiken til Bukkedalen, 791 moh — eventuelt med skiene på sekken. Bandet fra 700 til 800 moh er slakt, 8,9 grader over 632 meter grunn, og gir deg pusterommet før flanken.

Følg dalbunnen innover til 960 moh, der den bratte, lange flanken begynner. Herfra stiger linja jevnt og hardt: 19,5 grader fra 1000 til 1100 moh, 22,5 fra 1100 til 1200 og 24,4 fra 1200 til 1300, med bratteste sammenhengende parti på 50,6 grader mellom 1133 og 1171 moh, i flanken under toppen. Toppen står på 1278. Like før flanken begynner går linja 97 meter over et tjern på 946 moh, opptil 40 meter fra land. Det er naturlig og uregulert, og uten navn i registeret.',
  description_down = 'Ned samme flanken til dalbunnen, ut Bukkedalen og ned kneiken til Vallasætra og Nupen. Fallretningen er øst, og flanken er både oppstigningen og nedkjøringen.

Vanligste feil: å navigere seg vestover fra toppen i dårlig sikt. Fra skaret nord for toppen faller Vestrenna 700 høydemeter i 45 til 50 grader ned i Nupadalen. Den er en dokumentert ekspertlinje for dem som velger den med åpne øyne, og en alvorlig feil for dem som ikke vet at den er der.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'To bratte partier med et slakt mellomspill: kneiken opp til Bukkedalen mellom 400 og 600 moh (19,9 og 21,8 grader i snitt) og flanken fra 960 moh til toppen, der bandet fra 1200 til 1300 moh måler 24,4 grader og bratteste sammenhengende parti 50,6. Begge er skredterreng.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Vestrenna fra skaret nord for toppen stuper 700 høydemeter i 45 til 50 grader ned i Nupadalen. Den er ikke ruta, men den er nær nok toppen til at feil retning i skodde tar deg dit.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'vassdalstinden';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved vasshuset øverst i Vikegeila, 149 moh, følger du anleggsveien oppover Skåla. Skogen slutter rundt 456 moh og terrenget er åpent fra 473. Ved om lag 395 moh går du av veien der en kartlagt sti tar av — det er samme stedet Fri Flyt beskriver med «på skrå mot Vikeelva, kryss elva».

Over elva sikter du mot det laveste punktet på ryggen mellom Vallahornet og Saudehornet, 812 moh. Skaret ligger lenger øst enn en rett linje mellom de to toppene skulle tilsi; ryggkammen selv har laveste punkt der, og en kartlagt sti følger den om lag tretti meter unna.

Over skaret følger du sørryggen om lag 490 høydemeter opp til toppen på 1303 moh. Stigninga er jevn til rundt 1137 moh og blir så brattere. Målt langs selve ryggkammen fra 1135 moh og opp er stegene 33, 30, 37 og 25 grader over om lag seksti meter: ryggen er brattest midtveis, rundt 1266 moh, og slakker inn mot toppkulen. Fri Flyt regner med at mange tar skia på sekken de siste 200 høydemeterne.

Langs toppeggen ligger det skavl. Du kan ikke gå helt ut på kanten, og det er verdt å vite før du står der og vil ha utsikten mot Hjørundfjorden.',
  description_down = 'Vanligste nedkjøringa går samme veien, men gjerne på flanken på skiløperens høyre side av renna — sørvestflanken, som holder om lag 37 grader i 600 høydemeter. Fra toppen faller terrenget 1303 til 1031 til 834 til 717 moh mot sørvest, altså 36 til 38 grader over de første 470 høydemeterne. Det er sammenhengende bratt kjøring i ett strekk.

Vanligste feil: å tro at «rett ned mot Ørsta» er vest. Rett vest for skaret er hellinga 14 til 17 grader, men det gjelder bare nede ved skaret: fra 1270 moh og opp måler vestflanken 24 til 45 grader, og rett vest for toppen 32 til 47. Vest er uansett en annen side av fjellet enn den som fører deg ned til bilen. Nedkjøringa er sørvestvendt, og Fri Flyt nevner mulige sprekker i rennene på vestsida.

Den andre feilen er å måle turen etter hvor kort den er. 1157 høydemeter fra sentrum av en by gjør ikke fjellet snilt — skredterrenget begynner i Skåla og holder fram hele veien opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Det er skredterreng fra Skåla og hele veien opp. Sørryggen er bratt nok til at en utglidning på hard snø får lang utløpsbane: ryggkammen fra 1135 moh og opp holder rundt 32 grader i snitt, med det bratteste partiet rundt 1266 moh på 37 grader. Tallene for selve skisporet er lavere — 33,7 grader som bratteste parti og 23,2 i snitt for bandet 1200 til 1300 moh — fordi sporet sikk-sakker over ryggen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Langs toppeggen ligger det skavl, så kanten er ikke en utsiktsplass. Sørvestflanken, som er nedkjøringa, holder om lag 37 grader i 600 høydemeter — 36 til 38 grader over de første 470 fra toppen. Fri Flyt nevner mulige sprekker i rennene på vestsida. Fjellet ligger rett over Ørsta sentrum, men det er ikke en snilltur, og det er for erfarne.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'saudehornet';

update public.tk_tours set
  description_up   = 'Fra veilomma ved Skylstad i Norangsdalen, 85 moh, går du rett opp Brekkheida. Hold deg vest for Brekkeelva gjennom hele skogen — elva ligger et par hundre meter øst for linja, og du kommer først inn på elvefaret oppe på flata rundt 700 moh. Dette er den bratteste delen av skogen: de hundre metrene mellom 200 og 300 moh ligger på 21,9° i snitt, og de under, 100 til 200 moh, på 19,0°.

Skoggrensa slipper på 681 moh. Videre følger du sporet mot Patchellhytta inn på flata sørvest for hytta, drøyt 795 moh. Her forlater du hyttesporet. Sving vest opp østryggen før du krysser 1000-meteren — går du lenger inn mot Steinreset, må du hente igjen høyden på feil side av ryggen.

Pukkelen topper på 1143 moh. Derfra faller ryggen 26 meter til et skar før den stiger til høyde 1204, og videre er det 56 meter ned til kolen på 1148 før selve toppryggen. Hold deg til høyre for ura.

De siste 350 høydemeterne går de fleste til fots. Toppryggen smalner for hvert steg: 40 høydemeter under toppen faller nordsiden 43° og sørsiden 50°, og fra selve toppen måler nordflanken 57° og sørflanken 49° over de første 200 metrene ut. De øverste 70 meterne er knivegg. Toppen er 1564 moh.',
  description_down = 'Ned går samme vei: til fots ned toppryggen, på ski igjen fra kolen på 1148 moh, tilbake over høyde 1204 og Pukkelen og ned østryggen til flata ved 795 moh. Derfra ned Brekkheida til Skylstad.

Vanligste feil: å la seg friste av snøfeltene på flankene i stedet for å holde egga. Begge sider er brattest rett under kammen. Nordsiden går 57° over de første 200 metrene og holder over 50° i 300 høydemeter før den slaker av i ura rundt 1080 moh; sørsiden faller 49°, med et hamreband mellom 1530 og 1395 moh der enkelttrinn måler 78°. Det er her det har gått alvorlige ulykker. Hold ryggen til du er tilbake på Pukkelen.

Sørsiden rett ned mot Norangsdalen ser kort ut fra toppen. Den faller nær 1500 høydemeter til dalbunnen og ligger på 44° i snitt fra 1200 moh og ned til 350, med enkelttrinn over 50°. Sommerråsa fra Øye-parkeringen går ikke her — den følger sørøstryggen på 25–33° og kommer inn på østryggen ved høyde 1204. Sørsiden er ingen nedkjøring.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Skogpartiet over Brekkheida er brattest mellom 200 og 300 moh, 21,9° i snitt. Det bratteste enkelttrinnet på hele linja måler 46,9°, og det ligger ikke i skogen — det er toppblokka over 1520 moh, den delen skiene uansett bæres opp. Ryggen fra Pukkelen til høyde 1204 er snill: flankene der ligger på 26–35°. Det er de øverste 250 høydemeterne som er egg — nordsiden 43–57°, sørsiden 49–50°. Der er utglidning den reelle faren, og det er derfor skia blir båret.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Øst for Brekkheida ligger Karvigrova og Smørskredene, ei grov og en hel fjellside som begge tømmer seg ned mot Norangsdalen. Karvigrova går bare drøyt hundre meter øst for linja nede i skogen; driver du østover på vei ned, er du i den. Sørsiden av fjellet, rett over Norangsdalen, faller nær 1500 høydemeter og ligger på 44° i snitt gjennom midtpartiet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og isøks: toppryggen går til fots, og snøflankene under den krever bremseteknikk.'
    )
  )
where slug = 'slogen';

update public.tk_tours set
  description_up   = 'Start på den kartfestede parkeringa på Hatlestad, 453 moh, over Norddalen. Fri Flyt skriver at du parkerer på 350 moh; terrengmodellen leser gårdene til 412 og p-plassen til 453, og differansen er grunnen til at turen her måler 1479 høydemeter og ikke 1500.

Gå slakt inn i munningen av Dyrdalen og opp til Rellingsætra på 557 moh. De to første bandene er nesten flate — 2,8 grader fra 400 til 500 moh og 2,1 over 2678 meter grunn fra 500 til 600.

Fra setra tar kneiken opp på Daurmålsfjellet, 825 moh: 15,4 grader fra 600 til 700 moh og 15,5 fra 700 til 800. Skogen holder til 800 moh. Dette er den bratte delen av turen, og den er kort.

Så følger ryggen. Fem kilometer i slakt terreng, over ryggpunktet på 1186 moh, med band mellom 7 og 16 grader hele veien: 7,0 fra 1000 til 1100 moh, 15,5 fra 1200 til 1300, 16,4 fra 1700 til 1800 — bratteste hundremeteren — og 9,9 de siste hundre til varden på 1851 moh. Kartverket registrerer ikke breterreng noe sted på selve linja: hvert punkt mellom 1380 og 1520 moh er åpent område. Den nærmeste cella som er klassifisert SnøIsbre ligger omtrent 300 meter fra ruta, på 1482 moh.',
  description_down = 'Ned samme ryggen: nordover til Daurmålsfjellet, ned kneiken til Rellingsætra og ut Dyrdalen til Hatlestad. Fallretninga er nord, og nedkjøringa er lang og jevn heller enn bratt.

Vanligste feil: å vende for seint. Ti kilometer uten ly, med det meste av høyden langt fra bilen, gjør at et værskifte koster mer her enn på en kort tur — vendinga må avgjøres tidlig, ikke når du står på ryggen og ser at det trekker til.

Den andre er sidene av ryggen. Den er bred nok til at du ikke tenker på kantene, men den faller av utenfor: fra varden måler vest 40,9 grader i snitt over 500 meter, sørvest 36,2 og sørøst 35,2, med 60-metersvinduer på 49,3, 54,4 og 47,5. Nord og øst, som er veien hjem, holder 9,0 og 9,3 grader. Ti kilometer i skodde på en rygg som er slak i to retninger og bratt i seks er en orienteringsoppgave, ikke en tur du improviserer.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slak i begge ender og bratt ett eneste sted: kneiken fra Rellingsætra opp på Daurmålsfjellet. Bratteste hundremeteren, 1700 til 1800 moh, måler 16,4 grader og bratteste sammenhengende parti 26,9 grader mellom 1488 og 1508 moh. Ryggen ellers ligger mellom 7 og 16 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Ryggen er bred og slak, men sidene er det ikke: vest 40,9 grader i snitt fra varden, sørvest 36,2 og sørøst 35,2. Nord og øst — veien hjem — holder 9 grader. Det er lengden og orienteringa som er den reelle faren her: ti kilometer fra bilen i dårlig vær er en annen tur enn ti kilometer i sol.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'torvloysa';

update public.tk_tours set
  description_up   = 'Start på biloppstillingsplassen på Korsmyra, 621 moh, ved hovedveien mellom Eidsdal og Geiranger. Tilkomsten står under Eidshornet hos Fri Flyt, og det er den samme plassen.

Følg seterveien inn til Grandesætra på 648 moh og videre slakt inn og oppover Gråsteindalen, 721 moh. De to første bandene er nesten flate: 3,3 grader over 1431 meter grunn fra 600 til 700 moh og 3,6 over 1575 meter fra 800 til 900.

Kommet inn mot botnen av dalen på 940 moh tar den store snøflanken til, og den holder samme karakter helt opp: 17,9 grader fra 900 til 1000 moh, 20,5 fra 1000 til 1100, 19,6 fra 1300 til 1400, 21,2 fra 1500 til 1600 og 21,2 fra 1600 til 1700 — de to bratteste hundremetrene. Bratteste sammenhengende parti måler 27,9 grader mellom 1528 og 1544 moh.

De siste hundre høydemetrene slaker av til 9,6 grader og fører fram til varden på 1830 moh, et av de høyeste punktene i fjellene over Eidsdal. Registeret skriver fjellet Skorene.',
  description_down = 'Ned samme flanken og ut Gråsteindalen til Grandesætra og Korsmyra. Fri Flyt kaller dette flott skiterreng med snille hellingsvinkler, og tallene er enige: ingen band over 21,3 grader.

Vanligste feil: å lese de snille hellingsvinklene som en grunn til å gå på en ustabil dag. Hele strekket fra botnen av Gråsteindalen og opp er skredterreng, flanken er stor og sammenhengende, og det finnes ingen linje rundt den — turen bør gås på stabile dager, og det er hele vurderingen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'En sammenhengende snøflanke fra 940 moh til toppen, med band mellom 17,9 og 21,2 grader og bratteste sammenhengende parti på 27,9 grader mellom 1528 og 1544 moh. Hellinga er moderat; det er størrelsen og sammenhengen som er problemet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skredterreng fra botnen av Gråsteindalen og hele veien opp til toppen. Flanken er stor og sammenhengende, og det finnes ingen linje rundt den: går du turen, går du i den. Og toppen er ikke slak på baksida: vest måler 40,0 grader i snitt over 500 meter med et 67,7-graders vindu, nordvest 29,5 med 70,4 og nordøst 37,7 med 65,6. Sør og sørøst — flanken du kom opp — holder 13 grader.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'skarene';

update public.tk_tours set
  description_up   = 'Start på den store parkeringsplassen ved Helgatun på Krøvelseidet, 252 moh, på fv5894 Vikebygdvegen mellom Volda og Åmdalen. Løypa tar av fra plassen og går rett inn i skogen. Den er tidvis preparert med tråkkemaskin, og den siste bakken er merket med brøytestikker.

De første hundre og femti høydemetrene er slake: bandet fra 200 til 300 moh måler 5,3 grader i snitt over 580 meter grunn, og 300 til 400 moh 12,0 grader. Bratteste steget på hele turen ligger i skogen — 23,8 grader over tretti meter, mellom 458 og 472 moh.

Mot ryggen ved 519 moh flater det ut, og ved 545 moh slipper skogen taket. Bandet fra 500 til 600 moh er det slakeste på turen, 6,7 grader over 855 meter grunn, og herfra ser du hvor resten av ruta går.

Ryggen stiger jevnt til topps: 12,9 grader fra 600 til 700 moh og 13,1 fra 700 til 800. De siste høydemetrene til varden på 809 moh er flate — bandet over 800 moh måler 7,0 grader.',
  description_down = 'Ned samme løypa, sørøstover. Det er den samme lia du gikk opp, kort og oversiktlig, og du har bilen i sikte det meste av veien ned.

Vanligste feilen på dette fjellet er ikke et linjevalg, men et tidsvalg: turen blir gått i mørket gjennom hele vinteren, og da er traseen og brøytestikkene navigasjonen. Forlater du løypa, er sidene av Grøthornet skredterreng, og nær toppen kan det ligge skavl ut mot Ørsta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Preparert og merket løype i slakt terreng. Bratteste sammenhengende parti måler 23,8 grader og ligger lavt, mellom 458 og 472 moh, nede i skogen; over 500 moh er turen på sitt slakeste med 6,7 grader i snitt fra 500 til 600 moh, og bratteste hundremeteren, 400 til 500 moh, måler 13,6.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Sidene av Grøthornet er skredterreng, og nær toppen kan det ligge skavl mot Ørsta. Begge deler ligger utenfor løypetraseen — og begge blir aktuelle i samme øyeblikk som du forlater den i dårlig sikt eller i mørket.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'melshornet';

update public.tk_tours set
  description_up   = 'Fra veienden ved Lisjeholen sør for Norang-gårdene, 61 moh, tar du den bratte stien opp til Konedalen med skiene på sekken — først på venstre side av elva, så over på høyre. Skogen slutter rundt 395 moh og terrenget er åpent fra 398. Dette er den delen av turen som ikke er skitur, og den stiger 20 til 22 grader i snitt.

Oppe i dalen tar du på deg skiene og følger det slake dalføret sørvestover til om lag 740 moh. Hold deg på sørøstre side på vei inn: det kan gå skred fra Jakta hele veien inn Konedalen, og dalbunnen er utløpssona.

Ved 740 moh svinger du til høyre og sikk-sakker opp sida i nordvest til du når toppryggen ved 1240 moh. Sida er ikke jevn: nederst holder den 25 til 33 grader, men de siste 200 høydemetrene opp mot ryggen måler fallinja 40 til 50. Dette er den store skredfella på turen: et sammenhengende heng på 300 til 400 høydemeter, og det er også nedkjøringa. Linja slik den er tegnet holder 43,1 grader som bratteste sammenhengende parti, mellom 1244 og 1272 moh der den når ryggen — sikk-sakken er det som gjør tallet lavere enn fallinja.

Ryggen følges sørvestover helt til topps på 1589 moh. Hold deg midt på den. Den bratteste hundremeteren på turen ligger mellom 1500 og 1600 moh og måler 24,6 grader i snitt, men det er ikke hellinga som er problemet på ryggen — det er bredden: en kryssprofil ved 62,1715 nord gir 1556 moh på ryggen og 1265 moh bare 52 meter nordvest for den.',
  description_down = 'Vanligste nedkjøring er samme veien tilbake: 45 til 50 grader de første 200 høydemetrene fra ryggen, så 30 til 35 ned mot Konedalen og slakere videre ut dalen, og til slutt stien ned til Lisjeholen med skiene på sekken igjen. Sida ned fra ryggen er den beste kjøringa på turen og samtidig det bratteste og mest skredutsatte du er innom.

Vanligste feil: å lese skavlene etter «høyre og venstre» i stedet for etter kompasset. Fri Flyt skriver om skavler både til høyre ned mot Konedalen og til venstre ned nordveggen, men det gjelder nedstigningen — på vei opp ligger Konedalen i sørøst og fjordveggen i nordvest. Nordvestsida er ikke en felle du kan korrigere for underveis: DTM1 måler om lag 80 grader rett under toppen, og fallet er nær 290 høydemeter på 52 meter grunn.

Den andre feilen er å gå for langt inn i dalen før du tar av. Ruta svinger opp ved om lag 740 moh, 1,6 kilometer fra veienden. Første utkastet av denne ruta svingte opp mot dalbunnen lenger inne, og den linja måler 40 til 44 grader mellom 1030 og 1205 moh. Sida ved 62,174 til 62,176 nord er den som holder 33 til 36 hele veien til ryggen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Sida fra Konedalen opp til toppryggen er den store skredfella: 25 til 33 grader nederst og 40 til 50 de øverste 200 høydemetrene, i et sammenhengende heng på over 400, og du må gjennom den både opp og ned. Det kan gå skred fra Jakta hele veien inn Konedalen, så hold deg på sørøstre side på vei inn dalen. Bratteste sammenhengende parti på linja måler 43,1 grader, og bratteste hundremeter, 1500 til 1600 moh, 24,6 grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Toppryggen har skavl til begge sider — mot Konedalen i sørøst, og mot nordvestveggen ned mot Hjørundfjorden, der DTM1 måler om lag 80 grader rett under toppen: 1556 moh på ryggen og 1265 moh 52 meter nordvest. En skavl som brekker på den sida har ingen utgang. Holder du deg midt på kammen fra 1240 moh og opp, er det den eneste linja som ikke har et stup eller et 35-graders heng under seg.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'jakta';

update public.tk_tours set
  description_up   = 'Fra bommen på Kvistadvegen ovenfor Kvistad-gårdene, 104 moh, følger du den vinterstengte seterveien om lag 3,7 kilometer sørover og innover Kvistaddalen til parkeringa foran Kvistadsætra og Årsetsætra, 509 moh. De 405 høydemeterne opp seterveien er slake — bandet fra 100 til 500 moh ligger på 5 til 7 grader i snitt — og åpner bommen sent i april eller tidlig i mai, kan du kjøre dem og kutte både kilometerne og høydemeterne.

Fra setrene går ruta nordøstover opp gjennom åpen bjørkeskog. Skogen holder til rundt 693 moh og terrenget er åpent fra 696.

Så kommer storhellinga: opp mot skaret mellom Blåhornet og Skårasalen, 1074 moh, nord for og langsmed skredrenna øst for Blåhornet. Hellinga holder 30 til 40 grader fra om lag 800 til 1100 moh. Linja slik den er tegnet sikk-sakker og holder 26,7 grader som bratteste sammenhengende parti, med bandet fra 900 til 1000 moh på 19,3 grader i snitt — men renna ved siden av deg er den samme uansett hvor fint sporet ligger.

Over skaret svinger du øst-nordøst opp hovedhellinga mot ryggen og inn på toppplatået ved 1448 moh, og siste stykket sørover langs platået til toppen på 1542 moh. Linja kommer inn på platået fra nordvest med vilje: øst for egga faller fjellet 300 høydemeter på 74 meter grunn, om lag 76 grader, ned i Skåradalen.',
  description_down = 'Ned samme veien: nordvestover av toppen ned på platået, vestover langs platået og ned hovedhellinga til skaret, storhellinga ned mot setrene og seterveien ut. Sett av tid til de siste 3,7 kilometerne — de er flate nok til at du staker dem.

Vanligste feil: å holde for langt øst på toppplatået — og å tro at sørvest er veien ned. Sørvest for toppen ligger Vestrennene på 45 grader; linja går nordvest. Skavlene ligger mot øst, og under dem faller østveggen 300 høydemeter på 74 meter. I flatt lys er egga ikke synlig, og platået gir ingen andre holdepunkter.

Vestrennene ned til Årsetsætra er 45 grader og er ikke en del av denne ruta. Den tredje dokumenterte nedkjøringa, Lisje Skåradalen mot Skår ved Hjørundfjorden, er 25 til 30 grader krusterreng — men den ender ved fjorden, ikke ved bilen din i Bondalen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Renna øst for Blåhornet går vanligvis ett eller flere store skred ned mot seterveien hver vinter, og oppstigningen går rett ved siden av den. Hellinga holder 30 til 40 grader fra om lag 800 til 1100 moh, og det er turens nøkkelparti både opp og ned. Selve linja måler 26,7 grader som bratteste sammenhengende parti fordi den sikk-sakker; det endrer ikke hva som ligger over sporet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'På toppplatået ligger det store skavler mot øst, der fjellet faller 300 høydemeter på 74 meter ned i Skåradalen — om lag 76 grader. Hold god avstand fra egga. Vestrennene, som er en dokumentert nedkjøring for andre partier, er 45 grader og ligger utenfor denne ruta.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'skarasalen';

update public.tk_tours set
  description_up   = 'Start i grustaket i Nibbedalen, 324 moh, der sideveien tar av fra fv655. Er veien ikke brøytet, parkerer du langs fylkesveien. De første 771 meterne grunn ligger på 5,9 grader.

Følg grusveien et lite stykke og deretter sommerstien sørvestover inn Snødalen — rutebeskrivelsen sier vestover, men etappen måler 210 grader. Stigninga er jevn og vedvarende: 20,1 grader fra 500 til 600 moh, 19,6 fra 600 til 700 og 19,0 fra 700 til 800. Ved 925 moh er du inne i selve dalen.

Innerst tar Brattbakken til — bakken opp mot 1316 moh som rutebeskrivelsen setter til om lag 35 grader. Terrengmodellen måler bandet fra 1100 til 1200 moh til 22,5 grader i snitt og det bratteste 30-metersvinduet i bakken til 29,9 grader mellom 1200 og 1218 moh. Bratteste sammenhengende parti på hele turen, 33,5 grader mellom 883 og 903 moh, ligger lenger nede i Snødalen. Kartverket registrerer breterreng fra 1224 moh.

Bakken fortsetter til om lag 1300 moh — bandet fra 1200 til 1300 måler 20,4 grader over 271 meter grunn — og over den flater det brelagte platået ut: 7,7 grader fra 1500 til 1600 moh over 757 meter grunn. Du følger det under høyden på 1583 moh, gjennom et lite skar og nordover langs ryggen til toppen på 1700 moh. Den publiserte høyden 1717 er snøkuppelen; terrengmodellen leser fjellet til 1700.',
  description_down = 'Ned samme veien: sørover langs ryggen, over platået og ned Brattbakken til Snødalen. Fallretninga er øst — men det er retninga hjem, ikke det første steget: fra varden går ruta sørover langs ryggen til skaret under høyden på 1583 moh før den svinger ned. Rett øst for toppen måler flanken 39,2 grader i snitt med et 73,1-graders vindu 190 til 250 meter ut, og det er ikke en nedkjøring. Brattbakken er den delen av den rette nedkjøringa som avgjør om dagen er en skitur eller en øvelse i kantsikring.

Vanligste feil: å gå på breen uten å ta den på alvor. Ruta krysser breterreng fra 1290 moh, og sprekkene er der uansett hvor slakt platået måler. Den andre er skavlene langs toppryggen — hold avstand til kantene, særlig i dårlig sikt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Jevn stigning på 19 til 20 grader gjennom Snødalen, og så Brattbakken: bandet fra 1100 til 1200 moh måler 22,5 grader i snitt og bratteste 30-metersvindu i bakken 29,9 grader mellom 1200 og 1218 moh. Bakken er skredterreng, og den er den eneste veien opp på platået.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Breterreng fra 1290 moh med sprekker senvinters og utover våren. Store skavler langs toppryggen — hold avstand til kantene. Platået er slakt nok til at du slutter å lese terrenget, og det er nettopp der breen ligger.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'kvitegga';

update public.tk_tours set
  description_up   = 'Start ved vestenden av hytteveien i Langøylia, 388 moh, mellom Hellesylt og Hornindal. Gå opp lia gjennom åpen løvskog, øst for Gjøelva; skogen holder til 798 moh, og bandet fra 600 til 700 moh måler 18,9 grader.

Ved Aksla på 921 moh er du oppe på ryggen. Følg den nordvestover til Trollaksla, 1255 moh, og deretter sørryggen nordover til Sætrenibba på 1370 moh. Ryggen går opp og ned hele veien: bandene fra 1100 til 1300 moh måler 3,7 og 3,5 grader over til sammen mer enn tre kilometer grunn, og turen gir fra seg 327 høydemeter samlet.

Fra skaret nord for Sætrenibba, 1226 moh, runder du østover inn i sida som faller mot Kjellstaddalen og traverserer den opp mot ryggen øst for toppen. Dette er skredterreng, og det er den samme sida du kjører ned.

Ved om lag 1424 moh er du på østribba, og der tar de fleste av seg skia. De siste 103 høydemeterne er smal og eksponert rygg: bandet fra 1400 til 1500 moh måler 24,2 grader i snitt, bratteste sammenhengende parti 40,5 grader mellom 1482 og 1508 moh, og terrengmodellen gir om lag 55 grader rett øst for ryggen og 75 rett vest.',
  description_down = 'Vanligste nedkjøring er Kjellstaddalen: nesten tusen høydemeter i 25 til 35 grader ned til Kjellstadsætra, og deretter et par flate kilometer ut dalen og vestover tilbake til bilen. Fallretninga er øst.

Vanligste feil: å tro at toppryggen er skiterreng. De siste 103 høydemeterne er en rygg med 55 grader ned den ene sida og 75 ned den andre — et feiltrinn der er ikke til å rette opp, og isøks er vanlig når snøen er hard.

Den andre er å starte for sent. Turen er lang, ryggen går opp og ned, og traversen over østsida ovenfor Kjellstaddalen er skredterreng som endrer seg med sola. Vending må avgjøres tidlig.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'En lang rygg som går opp og ned, og en travers over østsida ovenfor Kjellstaddalen. Bandet fra 1400 til 1500 moh måler 24,2 grader i snitt, og bratteste sammenhengende parti 40,5 grader mellom 1482 og 1508 moh — det siste er østribba, ikke skisporet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skredterreng i bunnen av Kjellstaddalen og i hele østsida opp mot toppryggen — det er både traversen på vei opp og nedkjøringa. Toppryggen er smal og skavlete: om lag 55 grader rett øst og 75 rett vest de siste hundre høydemeterne.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og isøks når snøen er hard — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'hornindalsrokken';

update public.tk_tours set
  description_up   = 'Start ved veienden ved Grøndalsvatnet, 437 moh, opp bakkene fra Osdalen. De første 638 metrene grunn er slake, 5,7 grader, og går over myr og inn i åpen løvskog.

Gå nordover gjennom skogen — Kartverket fører skog til 722 moh — og opp på sørøstryggen. Stigningen øker jevnt: 14,7 grader fra 500 til 600 moh, 15,6 fra 600 til 700 og 19,6 fra 700 til 800, som er bratteste hundremeteren på turen.

Ved skogkanten på 839 moh flater det ut markert: bandet fra 800 til 900 moh måler 5,2 grader over 1035 meter grunn. Så tar ryggen til igjen, 14,0 grader fra 900 til 1000 moh og 17,3 fra 1100 til 1200, med bratteste sammenhengende parti på 29,0 grader mellom 1073 og 1094 moh.

Fra 1280 moh er du på platået, og derfra er det om lag en kilometer nordover til toppvarden på 1395 moh — bandet fra 1300 til 1400 moh måler 4,2 grader. Hold deg midt på platået: både vest- og østsida faller bratt.',
  description_down = 'Ned samme ryggen, sørover over platået og ned gjennom løvskogen til Grøndalsvatnet. Fallretningen er sør, og det er den solvendte sida — føret skifter fort utover dagen om våren.

Vanligste feil: å ta ut mot kanten på platået i skodde. Både vest- og østveggen faller bratt fra platået, og på en flate som ligger på 4,2 grader fins det ingen helling som forteller deg at du er på vei feil.

Den andre er sørflanken. Fri Flyt nevner den som en brattere nedkjøring på stabile dager; den er skredterreng, og den er et eget valg — ikke en snarvei ned fra platået.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slak i begge ender og jevn i midten: bratteste hundremeteren, 700 til 800 moh, måler 19,6 grader, og bratteste sammenhengende parti 29,0 grader mellom 1073 og 1094 moh. Platået fra 1300 til 1400 moh ligger på 4,2 grader over 1261 meter grunn.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Bratte vestre og østre vegger fra platået — det er en orienteringsfelle i skodde og snødrev heller enn et skredproblem i seg selv. Sørflanken er den brattere nedkjøringa, og den er skredterreng.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'sunndalsnipa';

update public.tk_tours set
  description_up   = 'Start på seterveien ved Skinnviksætra, 368 moh, på nordsida av Austefjorden. Veien inn er bomvei, og turen regner man som tilgjengelig etter at den åpner — det er derfor sesongen står som mars til mai.

Gå sørover og opp mot breen. Terrenget er åpent hele veien; det er ingen skog på denne ruta. Stigningen er jevn: 14,1 grader fra 400 til 500 moh, 15,5 fra 500 til 600 og 16,1 fra 700 til 800.

Fra om lag 1197 moh er du inne på Blåbreen. Bratteste hundremeteren ligger like under, 1000 til 1100 moh med 18,3 grader i snitt, og bratteste sammenhengende parti måler 33,6 grader mellom 1126 og 1147 moh. Kartverket registrerer breterreng på linja fra 1409 moh.

Den siste kilometeren er slak stigning sørover mot toppvarden på 1482 moh: 13,9 grader fra 1300 til 1400 moh og 11,0 over det. Hold deg midt på breen.',
  description_down = 'Ned samme linja, nordover over breen og ned til Skinnviksætra. Fallretninga er nord, og på vårføre kan du også traversere mot Lisje Eidskyrkja — det er en variant, ikke normalruta.

Vanligste feil: å slippe seg vestover på breen. Sprekkene ligger vest på breen, og der er også utløpsområdene for skred. Holder du deg midt på, er hellinga moderat hele veien; forlater du midtlinja, skifter turen karakter.

Den andre er toppområdet i skodde eller snødrev. Platået er vidt og flatt, og orienteringen der oppe er den ene tekniske oppgaven turen faktisk stiller.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Moderat helling og bre. Bratteste hundremeteren, 1000 til 1100 moh, måler 18,3 grader og bratteste sammenhengende parti 33,6 grader mellom 1126 og 1147 moh; breterrenget er registrert fra 1409 moh på linja. Skredfaren er liten om du holder deg midt på Blåbreen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Sprekker vest på breen, og utløpsområder for skred i det samme området. Toppplatået er en orienteringsfelle ved skodde eller snødrev — det er der turen krever mest av deg, og det er ikke hellinga som er grunnen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'eidskyrkja';

update public.tk_tours set
  description_up   = 'Fra Spranget p-plass, 1082 moh, er det seks kilometer inn til Rondvassbu. Tjønnbakkvegen inn hit er bomveg, og midtvinters er Mysusæter siste brøytepunkt — da blir turen tilsvarende lengre. Du er over tregrensa fra første meter, så det er åpent fjell hele veien inn. Hold deg på land rundt vika ved Lonin i sørenden av Rondvatnet i stedet for å ta snarveien over isen; dette er utløpsenden, og der er isen tynnest. Linja her er lagt om for å gjøre nettopp det: den går vest for vika, over land, og har ikke lenger en eneste vertex på vatn. Det hadde den før — nitti meter på isen, opptil femti meter fra land, sytti meter fra Lonin — under akkurat den setningen.

Bak Rondvassbu, 1169 moh, stiger det bratt mot nordøst. Stidelet mot Storronden kommer tidlig, og din vei er den som fortsetter nordover inn i Rondholet. Botnen ligger på rundt 1500 moh og er flat — det er det siste flate partiet du får før toppen.

Fra Rondholet går det meget bratt opp i ur mot Firkløvereggen, eggen mellom Storronden og Vinjeronden på 1869 moh. Det bratteste hundremeterbeltet på hele oppstigningen ligger her, mellom 1600 og 1700 moh, og holder 22° i snitt. Er ura avblåst, bærer du skiene til du er oppe på eggen.

Videre stiger det til Vinjeronden, 2043 moh. Herfra faller ruta vel hundre høydemeter ned i Slottsbrue, skaret på 1939 moh, før den går opp igjen på eggen mot Rondslottet, 2178 moh. Eggen er fin å gå på, men den er smal: hold deg midt på ryggen. Terrenget faller 33–38° mot vest og over 45° mot øst.',
  description_down = 'Samme vei tilbake — over eggen, ned i Slottsbrue, opp igjen de hundre høydemeterne til Vinjeronden. Den gjenstigningen kommer sent på dagen og tar lengre tid enn den ser ut til; legg inn tida før du bestemmer deg for hvor lenge du blir på toppen.

Vanligste feil: å slippe seg vestover fra eggen for å slippe unna gjenstigningen over Vinjeronden. Vestsida av eggen mellom Slottsbrue og toppen faller 33–38° i nesten tre hundre høydemeter, ned i Styggebotn og videre mot Rondvatnet. Det slakner ikke før under 1700 moh, og til da henger du i én sammenhengende bratt flanke under en egg. Det er ingen snarvei — hold eggen til du er tilbake i skaret.

Bjørnhollia er det tredje startstedet på Rondslottet og det eneste i øst: 1540 høydemeter på 12,35 km fra hyttedøra, nordover langs dalen og inn i Langglupdalen mot Dørålseter, forbi brua over Langglupå og stiskillet til Høgronden, og vestover fra stiskillet på 1764 moh. ut.no gir den 22,4 km tur/retur og minst fem timer opp. Den starter lavest av de tre — 913 moh mot Sprangets 1082 og Nedre Dørålseters 1041 — og gir fra seg 275 høydemeter underveis. Det bratteste 30-metersvinduet ligger derfor ikke i stigninga i det hele tatt: 45,8 grader mellom 913 og 880 moh, i søkket ned mot dalmunnen, halvannen kilometer inn. En kilometer inn, på 942 moh i skogen ovenfor hytta, står linja 45 meter på et lite naturlig tjern som OpenStreetMap ikke har kartlagt — to vertex på is, ikke et magasin.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fra Spranget inn til Rondholet er terrenget åpent og slakt, og du ligger over tregrensa hele veien. Det bratteste hundremeterbeltet på oppstigningen ligger mellom 1600 og 1700 moh og holder 22° i snitt — det er ura opp mot Firkløvereggen. Over Vinjeronden går ruta ned i Slottsbrue og opp igjen på en smal egg, med bratte flanker rett ved sporet på begge sider.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Vestsida av eggen mellom Slottsbrue og toppen faller 33–38° i nesten tre hundre høydemeter ned mot Styggebotn; østsida faller over 45° ned i Storbotn. Sørvestflanken av selve toppen er langt slakere, rundt 26° over de første fire hundre metrene, men den fører ikke ned i Rondholet — botnen ligger to og en halv kilometer unna, på andre sida av Vinjeronden. I Rondholet går du gjennom en botn med sider på 20–26° i snitt og partier opp mot 38°, fra nordvest og fra Firkløvereggen i sørøst. Det er det lengste sammenhengende partiet på turen der du har noe over deg.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Rondane ligger i varslingsregion Nord-Gudbrandsdalen. Det er en B-region på varsom.no: skredvarsel publiseres bare når faregraden ventes å bli 4 eller 5, så en tom side betyr ikke trygt fjell. Les værhistorikken og observasjonene i regionen selv, og ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'rondslottet';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved idrettsanlegget i Randabygd, 398 moh på Ålandsleite. Følg grusveien nordøstover; den første kilometeren er nesten flat, med bandet fra 400 til 500 moh på 5,4 grader over 1125 meter grunn.

Ved Djupegrova på 487 moh svinger ruta nordover og nordvestover, og holder seg på vestsida av grova hele veien. Her kommer det første brattere partiet: 15,7 grader i snitt fra 500 til 600 moh.

Skogen holder til 748 moh. Over den flater det ut en stund før stigningen tar seg opp igjen mot skaret: 15,7 grader fra 800 til 900 moh og 18,5 fra 900 til 1000, som er bratteste hundremeteren på turen. Bratteste sammenhengende parti måler 23,8 grader og ligger mellom 1280 og 1297 moh.

Fra det markerte skaret holder du østover mot toppen. De siste hundre høydemetrene er slakere igjen, 11,6 grader fra 1200 til 1300 moh, og varden står på 1297.',
  description_down = 'Ned samme veien: østover ned til skaret, sørvestover ned den åpne sida og tilbake langs Djupegrova til idrettsanlegget. Sørvendingen gjør at føret kan skifte fort utover dagen om våren.

Vanligste feil: å kjøre rett ned fra toppen i stedet for å ta seg tilbake til skaret. Rett under toppen av Glitregga er terrenget bratt, og det er det ene stedet på turen der linja må være den beskrevne.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Jevn og oversiktlig: bratteste hundremeteren, 900 til 1000 moh, måler 18,5 grader, og bratteste sammenhengende parti 23,8 grader mellom 1280 og 1297 moh. Det er lengden og de 901 høydemetrene som gjør turen krevende, ikke hellinga.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Det bratte under toppen ligger mot nord: 26,3 grader i snitt over 500 meter med et 37,8-graders vindu 250 til 310 meter ut, og nordvest og nordøst 20,3 og 21,0. Sør, øst og vest er nesten flate — 2,8, 8,9 og 1,8 grader — så det er nordsida, og bare den, linja over skaret holder deg unna både opp og ned. Sida ned mot Djupegrova er det andre stedet der et linjevalg får konsekvenser, for grova samler snø fra hele flanken over.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'glitregga';

update public.tk_tours set
  description_up   = 'Fra Spranget p-plass, 1082 moh, følger du Rondvassbu-vegen seks kilometer nordøstover: over 1137 moh, gjennom dalen sørvest for hytta og fram til Rondvassbu på 1214 moh. Bandet mellom 1100 og 1200 moh måler 1,3 grader i snitt over fire og en halv kilometer. Rundt vika ved Lonin i sørenden av Rondvatnet holder du deg på land i stedet for å ta snarvegen over isen.

Merk startpunktet: bomvegen til Spranget brøytes ikke, og parkeringa er offisielt åpen fra midten av juni. I mars–mai er Mysusæter siste brøytepunkt — det er 4,5 kilometer og hundre høydemeter lenger ned, og de kommer i tillegg til alt som står her.

Bak hytta stiger det bratt mot nordøst opp til stidelet på 1440 moh. Her deler turen lag med Rondslottet: den ruta fortsetter nordover inn i Rondholet, mens Storronden tar av mot høyre og østover opp på vestryggen.

Fra stidelet til toppen er det 698 høydemeter på 2,85 kilometer langs linja, monotont stigende og uten gjenstigning. Den bratteste hundremeteren ligger mellom 1900 og 2000 moh og måler 20,7 grader i snitt; bratteste sammenhengende parti på linja er 25,7 grader. Ryggen er steinete, og ur blåser ofte bar — da bæres skiene den siste biten til varden på 2139 moh.',
  description_down = 'Ned vestryggen til stidelet, ned bakken til Rondvassbu og deretter de seks kilometerne ut til Spranget. Nedkjøringa er sørvestvendt: peilinger mellom 225 og 255 grader holder 26 til 32 grader, og det er den sektoren ruta bruker.

Vanligste feil: å slippe seg rett vest fra toppen fordi det er den veien bilen står. Rett vest ser slakt ut fra varden — under 26 grader de første seks hundre metrene — og bryter så av i 46 til 57. Nordover er fella den samme: fire–fem hundre meter på under 20 grader, og så 48 til 64 ned i Rondholet. Øst og sørøst er brattest og nærmest, 56 til 67 grader like ved den slake ryggen du kom opp. Den andre feilen er å la seg dra nordover mot Rondholet fra toppen.

De siste seks kilometerne er flate. Regn med å stake dem, og regn med at de tar lengre tid enn de ser ut til når du står på toppen og ser hytta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Vestryggen er slak og oversiktlig: 698 høydemeter på 2,85 kilometer, bratteste sammenhengende parti 25,7 grader, og bratteste hundremeteren, 1900 til 2000 moh, 20,7 grader i snitt. Det er ingen egg og ingen gjenstigning på ruta. Hold deg på ryggen fra stidelet og oppover — det er den ene slake sida av fjellet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Øst og sørøst faller 56 til 67 grader rett ved varden. Nord og vest er en annen sak, og en farligere: begge ser slake ut fra toppen — nord holder under 20 grader i fire–fem hundre meter og vest under 26 i seks hundre — før de bryter av i 48 til 64 grader ned mot Rondholet og 46 til 57 mot vest. Det er terrengfeller, ikke vegger du ser. Rondane ligger i varslingsregion Nord-Gudbrandsdalen, som er en B-region på varsom.no: der publiseres skredvarsel bare ved faregrad 4–5, og en tom side betyr altså ikke at faren er vurdert og funnet lav. Det gjør egen observasjon viktigere her enn i regionene med daglig varsel.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Nord-Gudbrandsdalen på varsom.no, og husk at regionen bare varsles ved faregrad 4–5. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'storronden';

update public.tk_tours set
  description_up   = 'Fra parkeringen på Tjugen ved Lodalsvegen, 34 moh, følger du traktorvegen som etter hvert blir til Kloumannstien og går oppover i Fosdalen. Plassen er avgiftsbelagt og betales med Vipps til Skåla Parkering — det er den samme plassen som brukes under Skåla Opp. De første 540 meterne går på veg; deretter tar stien over. Skogen slipper taket rundt 698 moh, og fra midten av mai må du regne med å bære skiene opp til Tjugensætra rundt 750 moh.

Elva krysser du rundt 650 moh. Stien svinger nordover et stykke før den tar seg tilbake sørover — følg den; juvet nedenfor er ikke noe å skjære over. Så følger rundt 400 høydemeter jevn stigning opp mot Skålavatnet. Stien svinger seg opp gjennom hellinga, og ingen hundremeter på dette strekket holder mer enn 18°.

Du passerer Skålavatnet på nordvestsida, 1141 moh, og fortsetter sørøstover inn i botnen. Derfra tar du opp til venstre mot den brede ryggen mot Sandsnibba. Den bratteste hundremeteren på hele linja ligger mellom 1500 og 1600 moh og holder 21,2° i snitt, med 20,2° i sjiktet under; det bratteste enkelttrinnet måler 26,9°.

Skålabu og Skålatårnet står på 1835 moh, der stien formelt slutter. Toppunktet ligger 370 meter lenger øst, flatt platå hele veien. Ved dårlig sikt: hold ryggen. Den er slak å gå, men den faller bratt til begge sider — 56° i snitt de første 200 metrene mot nordvest, 42° mot sør — og skavlen henger ut over nordvestkanten.',
  description_down = 'Ned går du samme linja: over platået, ut ryggen, ned i botnen og forbi Skålavatnet på nordvestsida, så ned Fosdalen. 1818 høydemeter i ett strekk. Vil du ha noe brattere, følger du toppeggen lenger ut og legger linja i den sørvestvendte fjellsida — det er den vanlige varianten. Rett sørvest for tårnet står et bergtrinn på 60–66°, så du må ut på eggen før du slipper deg ned; derfra holder sida 24–26° i snitt med trinn på 39–44°, mot 20,3° på oppstigningen.

Vanligste feil: å forlate ryggen for tidlig. Nord- og nordvestsida rett under toppen er stup — 64° i de første 80 metrene — og sørsida er ikke stort snillere med sine 42°. Hold kammen til du er nede i botnen, og hold deretter nordvest for Skålavatnet og ned i Fosdalen. Trekker du vest for vatnet, står du over bergband som måler 68° ned mot Loen. Fra midten av mai slutter snøen rundt Tjugensætra, og de siste 750 høydemeterne går på beina.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja i seg selv er slak — bratteste hundremeter 20,3° i snitt, bratteste enkelttrinn 29,1°. Faren ligger i det du går under: det går skred langs Fosdøla og Skålelva, og nord for sommerruta etter at du har passert Skålavatnet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Rett under toppen faller nordvestsida 56° i snitt over de første 200 metrene, 64° øverst, og nordsida 51°; sørsida faller 42°. Det er over nordvestkanten skavlen henger, og det er ingen utveg noen av vegene. Vest for Skålavatnet bryter fjellsida ned mot Loen opp i bergband på 68°. Den sørvestvendte fjellsida ute på toppeggen er slakere, 24–26° i snitt, og det er der den brattere nedkjøringsvarianten går.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'skala';

update public.tk_tours set
  description_up   = 'Start ved grinda på Dragesetvegen innerst i Innvikdalen, 349 moh, inn dalen fra Innvik. Traktorveien tar deg opp til Remestøylen på 596 moh; bandet fra 300 til 400 moh måler 7,1 grader og 400 til 500 moh 10,6.

Fra setra holder du vest-sørvestover opp den tydelige ryggen, med Innvikdalen på høyre hånd. Bratteste hundremeteren på turen ligger her, 600 til 700 moh med 17,3 grader i snitt; bratteste sammenhengende parti ligger høyere, 31,9 grader mellom 1321 og 1340 moh på ryggen.

Forbi Hestehytta på 864 moh slutter skogen — Kartverket fører terrenget som skog til 805 moh — og resten er åpen rygg. Fra Hestehytta til toppen stiger linja 864 til 1567 moh over 3,3 kilometer, om lag tolv grader i snitt.

Ryggen er jevn hele veien opp: 13,6 grader fra 900 til 1000 moh, 15,4 fra 1000 til 1100 og 15,9 fra 1100 til 1200. Over 1400 moh flater den ut mot varden på 1567 — bandet fra 1400 til 1500 moh måler 8,3 grader over 675 meter grunn.',
  description_down = 'Ned samme ryggen, vestover mot Remestøylen og Dragesetvegen — oppstigningen går østover, og Remestøylen ligger på peiling 289 fra toppen. Ryggen er bred og oversiktlig, og fallretninga er vest.

Vanligste feil: å velge en annen linje ned enn den du gikk opp. Fjellet har flere skredutsatte nedkjøringsalternativer til sidene av ryggen, og det er lett å følge spor som ikke ender der du parkerte. Følg oppstigningsryggen, ikke andres spor.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'En lang, bred rygg uten tekniske partier. Bratteste hundremeteren, 600 til 700 moh, måler 17,3 grader, og bratteste sammenhengende parti 31,9 grader mellom 1321 og 1340 moh — det første nede i skogsdelen, det andre oppe på ryggen. Fra Hestehytta og opp holder linja om lag tolv grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Sidene av ryggen er skredutsatte, og nå vet vi hvilke: sør og sørvest, ned mot Innvikdalen. Fra ryggpunktet på 1096 moh måler sørsida 26,9 grader i snitt over 400 meter med et 45,5-graders vindu, og sørvest 28,8 med 49,3. Fra 1275 moh gir sørvest 32,9 grader i snitt og et 67,5-graders vindu 320 til 380 meter ut. Nord og vest fra den samme ryggen holder 10 til 15 grader. Selve toppen er slak i alle åtte retninger — 2,5 til 11,3 grader i snitt — så vurderingen ligger ikke der du står med varden, men i hva du velger når du har kommet et stykke ned.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'skarsteinfjellet';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Bødalssætra, 584 moh, snaut tretti kilometer fra Stryn forbi Loen og langs Lovatnet. Veien inn Bødalen er stengt om vinteren og åpner i mai eller juni — dette er en vårskitur, og sesongen står deretter.

Gå østover langs nordøstsida av dalen mot osen av Sætrevatnet, 606 moh, og følg elva videre innover. Innmarsjen er lang og flat: bandet fra 500 til 600 moh måler 0,6 grader over 1628 meter grunn, 600 til 700 moh 4,0 grader over 1413, og 1200 til 1300 moh 2,2 grader over 2633 meter.

Ved Kåpevatnet, 1211 moh, svinger ruta sørover og opp Brattebakkane inn på Bohrsbreen. Herfra er det bre: Kartverket registrerer breterreng på linja fra 1825 moh, og Fri Flyt beskriver svært dype sprekker på Bohrsbreen. Bandet fra 1300 til 1400 moh måler 20,5 grader, den bratteste hundremeteren på turen.

Videre opp mot ryggen og en travers under Veslekåpa før det siste stykket til toppen på 2082 moh. Bandet fra 1900 til 2000 moh måler 17,1 grader, og det bratteste sammenhengende partiet på ruta ligger her, 46,4 grader mellom 1973 og 2005 moh, under toppen. Breutstyr, stegjern og isøks hører med.',
  description_down = 'Ned samme veien: under Veslekåpa, ned breen og Brattebakkane til Kåpevatnet, og deretter den lange, flate innmarsjen ut Bødalen. Fallretningen er vest.

Vanligste feil: å behandle Bohrsbreen som en snøbakke. Sprekkene er dype, tau og breutstyr er ikke valgfritt, og på vei ned går du fortere over de samme snøbroene som du gikk sakte over på vei opp.

Den andre er å undervurdere innmarsjen. Fem av ti kilometer ligger under 5 grader; det er lite motstand på ski, men det er også to timer hjem igjen etter at dagens høydemeter er brukt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Lang, flat innmarsj og en bratt topp: bratteste hundremeteren, 1300 til 1400 moh, måler 20,5 grader, og bratteste sammenhengende parti 46,4 grader mellom 1973 og 2005 moh. Brattebakkane opp mot breen er skredterreng.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Svært dype sprekker på Bohrsbreen — det er den faren som skiller denne turen fra en vanlig vårtur, og den er ikke avhengig av skredvarselet. Stegjern og isøks når snøen er hard, og tau over breen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'lodalskapa';

update public.tk_tours set
  description_up   = 'Start ved campingplassen i Stardalen, 351 moh — fra Skei følger du E39 nordover og tar av på Klakegg. Fri Flyt viser til utkjøringsplasser langs grusveien eller parkering nede ved fylkesveien.

Følg skogsveien innover Haugadalen til Haugastøylen på 659 moh. Det flate partiet langs skogsveien er særlig utsatt for naturlig utløste skred når snødekket blir varmet opp — det er ikke der du venter det, og det er verdt å huske.

Videre opp dalen til brefallet. Kartverket registrerer breterreng på linja alt fra 887 moh, og Haugabreen selv ligger på 1100 moh. Du går opp midt i fallet; store sprekker er den styrende faren her.

Oppe på platået traverserer du nordvestover og kommer opp på toppen fra nordvest. Stigningen er jevn: 15,6 grader fra 1200 til 1300 moh, 19,4 fra 1300 til 1400 — bratteste hundremeteren — og 17,8 fra 1700 til 1800, med varden på 1827 moh. Rundt 1687 moh er føret ofte vindavblåst og hardt.',
  description_down = 'Ned samme veien: over platået, ned brefallet og ut Haugadalen. Fallretningen er sørøst.

Vanligste feil: å velge Veitebergsdalen ned fordi den ser kortere ut på kartet. Det er en annen rute fra en annen dal — den finner du som egen linje på dette kortet — og den ender ikke der bilen står.

Den andre er timingen på det flate partiet nederst: det er der naturlig utløste skred kommer når sola har stått på, og det er den delen av turen du går sist.

Veitebergsdalen er nå en egen rute på kartet, ikke bare en nedkjøringsvariant. Fri Flyts 4.8.2 starter på Veiteberg, ved skogsveien som går opp i dalen — 290 moh, akkurat det boka fører som starthøyde — og går veien til endes på 521, skrått opp skogen mot moreneryggen Sollirinden, opp ryggen til Sollibotnen på 894, rundt brevatnet og opp brefallet, og flatt innover breen øst for høyden 1687 til topps. 1670 høydemeter på 9,39 km mot 1501 på 8,53 km fra Stardalen: den lengste og største av de to. Skogen slipper på 781 moh etter 3,29 km. Bratteste hundremetersbeltet er 20,3 grader fra 600 til 700 moh. Det bratteste 30-metersvinduet, 30,3 grader, går nedover — fra 1139 til 1113, der linja faller mot utløpet av brevatnet på 1103 og må opp igjen; det er også mesteparten av de 133 høydemetrene ruta gir tilbake. Kilden sanksjonerer ingen kryssing av vatnet, så linja runder det på østsida, på land.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Jevn stigning over bre. Bratteste hundremeteren, 1300 til 1400 moh, måler 19,4 grader og bratteste sammenhengende parti 27,6 grader; breterrenget er registrert fra 887 moh. Store sprekker på Haugabreen er den styrende faren, ikke hellinga.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Det flate partiet langs skogsveien mot Haugastøylen er særlig utsatt for naturlig utløste skred ved oppvarming av snødekket. Rundt 1687 moh er det ofte vindavblåst og hardt, og det avgjør mer om dagen enn brattheten gjør.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottaker, søkestang og spade, og breutstyr — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'snonipa';

update public.tk_tours set
  description_up   = 'Start på grusparkeringa ved nasjonalparkgrensa i Veodalen, 1297 moh. Herfra følger du den bilfrie veien sørvestover langs Veo i sju kilometer inn til Glitterheim på 1385 moh. Sju kilometer for 88 høydemeter: bandet mellom 1300 og 1400 moh måler 0,9 grader i snitt over nesten sju kilometer, og det er det flateste partiet på noen av turene i denne appen. Regn med at innmarsjen tar en drøy time hver vei før fjellet begynner.

Bak hytta legger ruta seg nordvestover opp nordsida av Steinbudalen. Ikke følg dalbunnen vestover over Steinbuvatna: utgangen av dalen mot breen har steg på 37 til 41 grader, mens nordflanken — der den merkede stien går — holder 9 til 13 grader i snitt, med enkeltsteg opp mot 19. Den bratteste hundremeteren på ruta ligger mellom 1600 og 1700 moh og holder 13,2 grader i snitt.

Fra rundt 2010 moh går ruta inn på ryggen øst for Glitterbrean, opp forbi 2222 moh og 2357 moh på øvre del av breen, og til slutt vestover opp den siste kneika til toppen på 2451 moh. Ut.no beskriver ruta som jevn stigning hele veien i terreng under 30 grader, med valget mellom sommerstien øst for breen og selve breen. Terrengmodellen er enig: bratteste sammenhengende parti på linja er 18,5 grader.

Sesongen er satt av veien, ikke av snøen. Bomvegen fra Randsverk inn til Veodalen brøytes ikke og åpner sammen med Glitterheim midt i juni. Vil du gå den klassiske vårturen i mars–mai, må du enten gå de vel 24 kilometerne inn på ski eller forhåndsbestille beltebil hos hytta — linja er den samme, men de første sju kilometerne er da en del av en mye lengre innmarsj.',
  description_down = 'Ned samme vei: østryggen og breen ned til rundt 2010 moh, nordsida av Steinbudalen ned til Glitterheim, og så de sju kilometerne ut Veodalen. De siste sju er ikke nedkjøring. I juni og juli er Veodalen bar, så skiene bæres de sju kilometerne ut — regn med halvannen time til fots, eller tre kvarter om du har sykkel stående ved bommen.

Vanligste feil: å dra for langt nord på det brede topplatået i dårlig sikt. Toppen har bare én slak side. Nord, nordøst, vest og nordvest faller 52 til 70 grader ned mot Grjotbrean og Glitterholet, og sør og sørvest — peilinger mellom 165 og 230 grader — faller 42 til 64 ned i Steinbudalen. Bare sektoren mellom 105 og 160 grader er slak, og det er den veien du kom. Ta ut kursen på toppen. Kanten er dessuten skavlet: ut.no melder dokumenterte overhengende skavler mot nordvest, så kanten du ser er ikke kanten som bærer.

Glitterbrean er en bre. Sprekker og snøbroer er reelle, og i juni og juli — den eneste perioden denne ruta er beskrevet for — er snøbroene på sitt tynneste. Turen hører hjemme i tau og bresele hele sesongen. Det er en annen vurdering enn skredvurderingen, og den gjøres før du går ut på breen, ikke når du står midt på den.

Den andre dokumenterte ruta kommer fra den andre sida av fjellet. Fra Spiterstulen er det 1391 høydemeter på 10,25 km — tre kilometer kortere enn normalruta og 162 høydemeter lengre — nordøst over Skautkampan på 1440 moh, over Skauta på 1477 og langs Steindalselve på 1547, alle tre registerførte og alle tre på linja. ut.no gir den 19,0 km tur/retur, 1378 høydemeter og ni timer, sesong juni–september. Bratteste steget måler 25,2 grader mellom 1755 og 1771 moh mot normalrutas 18,5, og det bratteste hundremetersbeltet 21,2 mellom 1900 og 2000. Faremomentet er det samme fra begge sider, og kilden sier det med tre ord: «Tidvis overhengende toppskavl.»',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja er slak hele veien: bratteste sammenhengende parti måler 18,5 grader, og den bratteste hundremeteren, 1600 til 1700 moh, holder 13,2 grader i snitt. Skredterreng er ikke det som gjør denne turen krevende. Det er breen, høyden og lengden — og at det slake terrenget over 2200 moh er breterreng, ikke fast fjell. Går du dalbunnen vestover over Steinbuvatna i stedet for nordflanken, får du derimot steg på 37 til 41 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord, nordøst, vest og nordvest faller 52 til 70 grader fra toppen ned mot Grjotbrean og Glitterholet, og sør og sørvest 42 til 64 grader ned i Steinbudalen. Kanten mot nordvest er skavlet. Topplatået er bredt og gir ingen holdepunkter i dårlig sikt, og det er der de tre bratte sidene blir farlige — ikke fordi de er skredterreng du velger, men fordi de er kanter du kan gå ut på. Sørøst, mellom 105 og 160 grader, er den ene slake sida, og den du kom opp.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade — og tau, sele og bresikringsutstyr. Glitterbrean går du i taulag; har du ikke breerfaring selv, går du med fører.'
    )
  )
where slug = 'glittertinden';

update public.tk_tours set
  description_up   = 'Turen starter ved Juvasshytta, 1841 moh, øverst på Galdhøpiggvegen. Veg og hytte åpner rundt 30. mai. Går du på ski i april eller mai, starter turen der brøytinga stopper, og da blir både lengden og høydemeterne større enn tallene her.

Fra hytta følger du den stakede ruta sørvestover over Juvflye. 2,8 kilometer og rundt 200 høydemeter i steinete, åpent terreng tar deg til brekanten på Styggebrean. Dette er den delen av turen du går fort.

På brekanten tar du på selen og binder inn. Styggebrean er sprukken, og navnet er ikke tilfeldig — stygg betyr farlig. Kryssinga er drøyt 1,6 kilometer og tar tre kvarter til en time, med stramt tau mellom hver mann. Har du ikke breerfaring, går du med fører; det er dette partiet som gjør turen til grad 3, ikke høydemeterne.

Av breen og opp på fast grunn går ruta inn på østryggen. Hold ryggen sørøst for Piggebrean framfor å gå ut på breen selv; det første partiet opp er bratt nok til at mange bærer ski. Derfra stiger ryggen jevnt over skulderen på 2354 moh og videre til toppen. Merk deg at linja ikke faller: fra 2196 moh og opp til 2469 moh stiger den hele veien. Beskrivelser som sier at du går over Keilhaus topp og ned igjen før siste stigning, beskriver en annen linje — Keilhaus topp ligger vel 450 meter sørøst for den stakede ruta.',
  description_down = 'Ned er samme veg. Østryggen først, rolig — det er stein og is i partier. Ryggen er skjev: sørsida er slak, mens nordsida faller 25 til 35 grader i snitt, med steg på 50 til 65 grader ned mot Piggebrean. Det er nordsida du holder deg unna. Ta av ski der du bar dem opp.

Så tilbake i taulag over Styggebrean. Det er her folk slurver: toppen er tatt, det går nedover, og fristelsen til å knyte opp og kjøre spredt utover breen er stor. Sprekkene bryr seg ikke om at du er på vei hjem. Behold taulaget til du står på fast grunn ved brekanten.

Den andre feilen er å slippe seg sørover fra toppen, ned mot Svellnosbrean. Flanken er sørvendt og god skikjøring — 25 til 30 grader i snitt over de 430 høydemeterne ned til breen, med enkeltsteg på 40 til 45 grader — men det er ruta til Spiterstulen. 1434 høydemeter ned i Visdalen, og bilen din står ved Juvasshytta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Selve linja er slak. Det bratteste hundremetersbåndet, 2400–2500 moh, ligger på 17,1 grader i snitt, og det bratteste enkeltsteget langs ruta måler 25,8 grader. Skredterreng er ikke det som gjør denne turen krevende — det er sprekkene i Styggebrean og høyden. Østryggen er smal og fanger fokksnø på lesida.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Piggebrean ligger nord for østryggen og Styggebrean under den. Begge er sprukne, og faller du ut av sporet på nordsida av ryggen, er det bre du havner på: den sida måler 25 til 35 grader i snitt, med steg på 50 til 65 grader, mens sørsida av ryggen er slak. Sørflanken ned mot Svellnosbrean holder 25 til 30 grader i snitt de 430 høydemeterne ned til breen, med enkeltsteg på 40 til 45 grader — et stort, samlet heng som ikke er en del av denne ruta.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade — og tau, sele og bresikringsutstyr. Styggebrean krysses i taulag; har du ikke breerfaring selv, bestiller du breføring hos Juvasshytta.'
    )
  )
where slug = 'galdhopiggen';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Russlie, 874 moh, ved Fv51 Sjodalsvegen. Fri Flyt: «Det er flere mulige startsteder for toppturen til Nautgardstinden, men et greit utgangspunkt er Russlie ved veien som går fra Vågå mot Valdresflye.» Skogen slipper ved 1013 moh, 0,61 km fra start.

Fri Flyt: «Start med å gå vestover mot Steinhøe og hold til høyre for det brattere terrenget under Russlirundhøe, før du kommer inn på et flatere parti.» Linja passerer 165 meter nord for Steinhøe ved 3,14 km og 1449 moh. Mellom 4,6 og 4,9 km, 1554 til 1635 moh, går den opp et steinete trinn under nordøstsida av Russlirundhøe-massivet — celler på 45,1 grader 39 meter nord for linja ved 1594 moh og 36,4 grader 19 meter fra den ved 1635. Det er sannsynligvis det brattere terrenget Fri Flyt ber deg holde til høyre for; trekk ikke mot venstre her, verken opp eller ned. Russlirundhøe selv er nærmest ved 6,11 km og 1711 moh, 956 meter rett sør for linja. Bratteste bandet under 2000 moh er 16,1 grader fra 1000 til 1100, tidlig på turen.

Så kommer flata. Bandene fra 1600 til 1700 og fra 1700 til 1800 moh måler 5,1 grader hver over 1044 og 1170 meter grunn, og topp 1743 ligger 332 meter sør for linja ved 6,73 km. Fri Flyt: «Herfra stiger det brattere opp mot Nautgardstindene. Austre Nautgardstinden ligger til høyre, hovedtoppen til venstre.» Austre Nautgardstinden ligger 724 meter nordnordvest for linja ved 8,65 km.

Linja går opp østryggen fra 2028 moh ved 8,90 km — 16,1 grader fra 2000 til 2100 og 18,3 fra 2100 til 2200. Bratteste sammenhengende parti er 30,0 grader mellom 2175 og 2194 moh, og ved 2226–2243 moh krysser linja 21 meter bakke på 35 grader eller mer, med bratteste celle 43 grader. Baxter om vinterruta fra Heimsand: «The last section of the east ridge is relatively steep but should not be a problem in the summer or winter (provided it is not icy).» Fri Flyt anbefaler å gå det siste til fots. Nord for ryggen ligger nordbotnen: der faller bakken 45 grader og mer, 50 til 130 meter fra linja på det siste stykket og 30 meter fra toppen. Hold deg på ryggen og sørsida av den, godt unna kanten.',
  description_down = 'Fri Flyt: «Følg ruta fra oppstigningen det første strekket fra toppen. Derfra kan du velge linje i det slake terrenget mot bilen. Vær oppmerksom på det bratte partiet under Russlirundhøe.»

Toppen faller bratt mot nord, nordvest og vest: 60,7 grader 20 til 80 meter ut mot nord, 66,4 mot nordvest og 52,3 mot vest. Fri Flyt: «Bratt terreng rundt toppen. Hold god avstand til skavel på nordvestsiden.» Baxter om kanten av nordbotnen, som hans rute fra Glitterheim følger: «During the spring, the rim of this corrie sports some huge cornices and a respectful distance should be maintained to avoid plunging through them, especially in poor weather.» Kjør ned østryggen der du gikk opp, og trekk ikke nordover mot kanten.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 30,0 grader mellom 2175 og 2194 moh, på østryggen, og ved 2226–2243 moh er bakken under linja 35 grader eller brattere i 21 meter. Under 2000 moh er bratteste bandet 16,1 grader fra 1000 til 1100, og trinnet ved 1554–1635 moh har 45 grader 39 meter fra linja. Fri Flyt graderer turen «KAST 1 – Enkelt» med bratteste punkt under 25 grader; her er den grad 2 for lengden, høyden og det siste bratte stykket, som du går til fots.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord-, nordvest- og vestsida av toppen er 52,3 til 66,4 grader i bratteste vindu like under toppen. Fri Flyt: «Vær oppmerksom på det bratte partiet under Russlirundhøe.» Fri Flyts læringspunkt er vindtransport av snø: «Se hvordan snøen legger seg i søkk og bekkedaler.»'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Jotunheimen er en A-region og varsles daglig i sesongen. Fv51 er åpen fra Vågå til Gjendesheim hele året; strekningen over Valdresflye sør for Maurvangen er vinterstengt. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'nautgardstinden';

update public.tk_tours set
  description_up   = 'Start på toppturparkeringa ved brua mellom Indrebø og Dalebø, 277 moh — samme parkering som Gotdalsnipa. Første del er skogsvegen nordover langs elva, forbi Brekka og videre til Gotdalsstøylen. Bandet fra 300 til 400 moh måler 4,5 grader over 1260 meter grunn. Bandet fra 500 til 600 moh måler 3,4 grader over 1664 meter. Støylen kommer etter 3,86 km, på 563 moh. Seint på våren kan du ifølge Fri Flyt kjøre lenger inn på skogsvegen mot bompenger.

Fra støylen går Fri Flyt «noko nordaustover» for det slakeste terrenget og opp i Tolsbotnen, 802 moh etter 5,35 km. Fri Flyt holder høyden derfra over i Litlebotn; linja stiger vestover fra bunnen av Tolsbotnen og gir fra seg ned til 868 moh i Litlebotn, som registeret fører på 900 moh, før stigningen. Litlebottsegga ligger 790 meter nord for linja; det er nabotoppen og en egen tur.

Fra Litlebotn går du opp på sørøstryggen og følger den mot nordvest til toppen. Kneika opp på ryggen er linjas bratteste sammenhengende parti, 23,8 grader mellom 1050 og 1073 moh — og det er sporets stigning; bakken sporet krysser er brattere, 35 til 50 grader over 35 og 20 meter ved 1044 og 1068–1075 moh — og Fri Flyt oppgir 27 til 30 grader både mellom 900 og 1000 og mellom 1230 og 1340 moh. Bandet fra 1200 til 1300 moh måler 19,2 grader over 270 meter grunn og er det bratteste bandet på turen.

Øvre del av ryggen er smal. Innenfor 50 meter av linja måler terrenget 49 til 65 grader mot øst og nordøst mellom 1153 og 1335 moh — det er der skavlene henger. Hold avstand til eggkanten mot øst. I hard snø sier Fri Flyt at du kan måtte bruke skarejern eller gå til fots, og at «Utgliding eller fall kan ved nokre tilhøve utgjere betydeleg risiko». Toppen er på 1386 moh.',
  description_down = 'Fri Flyt beskriver nedkjøringa ned østsida mot Litlebotnen med mange linjer av ulik bratthet, og den slakeste går først nordøstover ned ryggen mot Litlebottsegga, så lengst nord i sida og ned en forsenkning til Litlebotnen. Nordøstradialen fra toppen er den slake: 15,2 grader i snitt og 24,9 grader i bratteste vindu. Men «Dei første ti høgdemetrane frå toppen kan vere bratte, 35-40 grader avhengig av snøforhold/skavldanning», og lenger nede oppgir kilden 34 til 36 grader mellom 1070 og 1000 moh og 29 til 32 grader mellom 860 og 750 moh. Østsida av toppen måler 37,6 grader i bratteste vindu 160 til 220 meter ut, og sørøstsida 35,2 grader.

Fra Litlebotnen kjører du ned øst for elva fra botnen og ut til Gotdalsstøylen, og så skogsvegen tilbake. Det er nord-, nordvest- og sørsida som ikke er nedkjøringer: Nordsida av toppen måler 57,6 grader 40 til 100 meter ut og nordvestsida 61,8 grader; sørsida 42,2 grader 170 til 230 meter ut.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti på linja er 23,8 grader mellom 1050 og 1073 moh, og bratteste hundremeteren er 1200 til 1300 moh med 19,2 grader. Bakken under linja er 35 grader eller brattere på to korte strekk i kneika opp på ryggen, 35 og 20 meter, med bratteste celle 50 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Egga har skavler mot øst, og terrenget under dem måler 49 til 65 grader innenfor 50 meter av linja. Nordsida og nordvestsida av toppen er hamrer på 57,6 og 61,8 grader. Nedkjøringa østover har 34 til 36 grader mellom 1070 og 1000 moh. Skogsvegen går i dalbunnen under lisider som måler 35 til 68 grader i bratteste vindu på begge sider, 160 til 640 meter ut, mellom 1,2 og 3,6 km. Skifantomet: «Kommer i løpet vinteren store snøskred ned i Ålhusdalen ifrå fjellsidene (Blåfjellet, Sølvet og Trollet).» Ålhusdalen ligger 784 meter sørvest for linja, og vegen passerer Brekka, der skifantomets nedkjøring fra den dalen kommer ut.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Det er en lang dag — Fri Flyt setter 5 til 10 timer. Ta med sender/mottaker, søkestang og spade, og skarejern.'
    )
  )
where slug = 'gronlifjellet';

update public.tk_tours set
  description_up   = 'Toppturparkeringa ligger ved brua mellom Indrebø og Dalebø, 277 moh, og Fri Flyt sier parkering mot avgift. Gå over brua til Dalebø og ta av fra traktorvegen til høyre — kilden sier etter «vel 200 meter» — og legg sporet skrått opp lia mot nordøst.

Lia er skogsterreng, og den er ujevnere enn snittet viser. Bandet fra 300 til 400 moh måler 13,3 grader. Bandet fra 400 til 500 moh måler også 13,3 grader. Innenfor 50 meter av linja står knauser på opptil 69 grader, og Fri Flyt oppgir 25 til 28 grader som det bratteste mellom 370 og 560 moh. Fjellstøylen kommer på 590 moh etter 1,66 km, og skogen slipper ved 682 moh.

Over Fjellstøylen holder du samme retning mot Fossgrova og følger den oppover på østsida, slik Fri Flyt beskriver. Linja er på 906 moh på østsida av grova etter 3,41 km. Høgemannsholten ligger 371 meter vest for linja, på den andre sida av grova; skifantomet beskriver ruta over den, Fri Flyt østsida, og linja følger Fri Flyt.

Grova fører deg opp mot Nonsnipa, 1105 moh, og linja passerer like ved toppen. Herfra følger du ryggen mot nordvest til Gotdalsnipa. Det siste stykket over 1200 moh måler 15,4 grader over 167 meter grunn og er det bratteste bandet på turen, og det bratteste sammenhengende partiet, 24,3 grader mellom 1172 og 1197 moh, ligger like under toppen. Toppen er på 1248 moh.',
  description_down = 'Fri Flyt beskriver nedkjøringa rett sør fra toppen ned i Steinbotnen som «Utfordrande», med 30 til 34 grader mellom 1140 og 980 moh. Sørradialen fra toppen måler 23,0 grader i snitt og 33,0 grader i bratteste vindu, 410 til 470 meter ut. Vil du ha slakere terreng, følger du ryggen ned mot skaret før Nonsnipa. Fra Steinbotnen renner du vestover mot Gotdalsstøylen og følger traktorvegen tilbake til Indrebø — samme parkering, og samme veg som Grønlifjellet går opp, under bratte lisider på begge sider.

Fjord Norway skriver at den beste nedkjøringa fra toppen er nordvendt. Nordsida måler 40,2 grader i bratteste vindu 80 til 140 meter ut, og nordøstsida 46,3 grader — det er brattere enn noe på oppturen, og ingen av kildene beskriver en linje der. Samme veg ned som opp er alltid et alternativ: ryggen over Nonsnipa og ned østsida av Fossgrova.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti på linja er 24,3 grader mellom 1172 og 1197 moh, og bratteste bandet er stykket over 1200 moh med 15,4 grader. Bakken under linja har ingen strekk over 35 grader. Fri Flyt oppgir 25 til 28 grader i skoglia mellom 370 og 560 moh, der linja går mellom knauser.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord- og nordøstsida av toppen måler 40,2 og 46,3 grader i bratteste vindu, vestsida 46,3 grader 310 til 370 meter ut, og nedkjøringa i Steinbotnen 30 til 34 grader ifølge Fri Flyt. Skifantomet advarer mot dalen vest for ruta: «Kommer i løpet vinteren store snøskred ned i Ålhusdalen ifrå fjellsidene». Oppturen går ikke der, men returen fra Gotdalsstøylen følger skogsvegen forbi Brekka, der skifantomets nedkjøring fra Ålhusdalen kommer ut, og lisidene over vegen måler 35 til 68 grader i bratteste vindu.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'gotdalsnipa';

update public.tk_tours set
  description_up   = 'Fra den brøytede plassen ved Gjuvvatnet på fv55 Sognefjellsvegen, 1274 moh, går du østover inn i dalsøkket. Veien hit er vinterstengt over høyfjellet og brøytes opp ved påsketider — i 2026 åpnet den 1. april — og de første ukene etter åpning er strekninga nattestengt fra 20 til 08. Det er veien, ikke snøen, som setter sesongen. Hold sørsida av vatnet — der er det fast grunn hele veien, og du slipper å miste de tretti meterne ned på isen. Er vegkanten full, ligger alternativet ved Galgebergstjørnane et par kilometer nordover; korridoren fungerer derfra også.

Dalsøkket tar deg rett østover forbi et lite vatn på 1428 moh. Her er det åpent terreng fra første skritt til toppen — ingen skog, ingen skoggrense å ta hensyn til. Ved rundt 1500 moh trekker du nordøstover ut av søkket og opp mot en svak, vestvendt ryggformasjon. Den ryggen er hele resten av turen.

Ryggen stiger jevnt. Hundremetersbåndet mellom 1700 og 1800 moh ligger på 19,1 grader i snitt, og det bratteste steget på veg opp er 30,3 grader over tretti meter mellom 1828 og 1848 moh. Hold ryggkammen gjennom det partiet. Trekker du nordover her, faller terrenget 100 til 180 meter bort under deg, og du kommer inn under nordsida.

Toppen er et platå på 2025 moh. Varden ligger helt på kanten av nordsida — gå fram til den, ikke forbi den. Skavlene bygger seg ut mot nord og øst. Rett under varden stuper nordsida: de første 120 høydemetrene faller på nær 60 grader. Så slakner den til en hylle rundt 1840 moh, før den setter utfor igjen — 42 til 45 grader fra 1620 til 1500 moh, med bre og klipper under det.',
  description_down = 'Ned går du samme veg, vestover. Den store skålforma under ryggen er det morsomste på turen: 25 til 30 grader jevnt, korte partier over 30, og det bratteste steget på linja — 30,3 grader — rett under ryggen. Derfra er det slakt ned dalsøkket til Gjuvvatnet.

Vanligste feil: å la seg dra sørover fra toppen, ned Steindalen, uten å ha planlagt for det. Det er fin skikjøring, og den linja ligger på dette kortet som egen rute, men det er en annen tur — 1025 høydemeter ned til Helgedalen, og bilen din står på Sognefjellsvegen. Hold vestryggen til du ser vatnet.

Vestsida er hard om morgenen i april og mai, og sola trenger noen timer på den. Går du tidlig, tar du med stegjern; det bratte partiet ved 1840 moh er ikke morsomt på blank skare, verken opp eller ned.

Sørsida er nå en egen rute på kartet, og den er ikke bare en variant: «Før Sognefjellet åpner, er det best å gå sørsida opp fra Helgedalen», skriver kilden i sin egen når-linje. Normalruta starter ved Gjuvvatnet på Sognefjellsvegen, som er vinterstengt — så fram til veien åpner er dette veien opp. Fra Turtagrø på 884 moh går linja inn Helgedalen forbi 910 og 1026, opp mot Steindøla på 1202 og 1338, langs vestsida av elva på 1434 og 1520, inn i Steindalen på 1704, og over inngangen til sørsida på 1893 til vestkanten av topplatået på 1931 — det punktet normalruta også kommer opp på. 1178 høydemeter på 7,91 km mot 764 på 3,99 km fra Gjuvvatnet: nesten dobbelt så mye klatring og nesten dobbelt så langt, fordi turen starter 390 meter lavere. Skogen slipper på 1037 moh etter 3,92 km. Beltet fra 1700 til 1800 moh måler 21,3 grader, turens bratteste, og det bratteste 30-metersvinduet er 28,4 mellom 1658 og 1675. Kilden advarer om Steindøla: elva åpner seg en gang i mai.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Normalvegen ligger i slakt til middels bratt terreng. Dalsøkket opp til 1500 moh er flatt i seg selv, men det går under vestflanken av fjellet. Over 1700 moh blir det brattere: 19,1 grader i snitt gjennom båndet 1700–1800 moh, og det bratteste enkeltsteget langs linja måler 30,3 grader. Nøkkelpartiet mellom 1820 og 1860 moh er stedet på ruta der et flak løsner.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Topplatået er skavlet mot nord og øst, og varden står på selve kanten. Hold deg på sørsida av platået. Rett under skavlene er nordsida på sitt bratteste: de første 120 høydemetrene ned fra varden faller på nær 60 grader. Under det ligger en hylle rundt 1840 moh, og så neste trinn — 42 til 45 grader over 120 høydemeter, fra 1620 til 1500 moh, med bre, skredterreng og klipper i utløpet. Sørvestryggen over topp 1936 er en oppstigningsvariant, ikke en nedkjøring: stedvis smal og bratt, 38 grader over 40 høydemeter mellom 1580 og 1620 moh.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade. Stegjern hvis du starter før sola har tatt vestsida.'
    )
  )
where slug = 'steindalsnosi';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved Bessheim fjellstue på 961 moh følger du den merkede ruta vestover og opp de 413 høydemeterne til nordøstenden av Bessvatnet på 1374 moh. Dette er turens første kneik og den holder 10–14 grader — jevnt, men det er her du gjør unna stigningen før flata. Fv51 over Valdresflye er vinterstengt sør for Maurvangen, men Bessheim ligger nord for stengsla og nås hele vinteren via Sjoa, Heidal og Randsverk.

Ute på Bessvatnet slutter turen å stige. Vatnet ligger på 1372 moh, og de neste tre og en halv kilometerne vestover faller og stiger til sammen ikke mer enn et par meter — i høydeprofilen er det den lange, flate midtdelen. Isen er normal vinterveg her, men linja på kartet er lagt på land i begge ender. Innerst, ved Grotåosen på 1385 moh, begynner fjellet på nytt.

Derfra går ruta rett vestover opp Grotådalen, mellom Bukkehøe i nord og østryggen til Besshø i sør, i jevn stigning til rundt 1745 moh. Den bratteste hundremeteren på hele turen ligger mellom 1900 og 2000 moh og måler 18,0 grader i snitt; bratteste sammenhengende parti på linja er 28,1 grader. Så sørvestover opp på ryggen ved Brue på 2047 moh, og vest-sørvest langs den slake ryggen de siste 210 høydemeterne. Ikke gå opp Besshøbrean til Brue, slik hyttas egen beskrivelse kan leses: overgangen fra breen til ryggen stiger fra 2004 til 2050 moh på 26 meter grunn, altså rundt 60 grader.

Toppen er et stort platå på 2257 moh. Peiling 75 grader fra varden — østryggen du kom opp — holder 17,8 grader. Peilinger på 60 og 90 grader kjennes like slake i fem hundre til åtte hundre meter — og bryter så av i 55 til 60 grader. Det er hele turens problem: femten grader feil peiling merkes ikke under skia før det er for seint.',
  description_down = 'Ned samme vei: øst-nordøst ned til Brue — peiling 78 grader fra varden, ned Grotådalen til Grotåosen, og så de tre og en halv flate kilometerne østover langs Bessvatnet. Regn med å stake hele vatnet — det er ikke nedkjøring, det er transport, og det tar tid du må ha igjen av dagen.

Vanligste feil: å forlate topplatået i feil retning. Nord-, nordvest- og vestsida faller 55 til 70 grader rett ned mot Russvatnet og Gjende, og fra et rundt platå i dårlig sikt ser alle retninger like slake ut de første stegene. Ta ut kompasskurs på varden, ikke to hundre meter ut. Ryggen inn mot Brue er også smalere enn den kjennes: nordsida bryter av i 50 til 60 grader ned mot Besshøbrean innen to hundre meter fra sporet, mens sørsida er slak og bred de første tre hundre.

Sørrennene brukes som nedkjøring av dem som kjenner fjellet. De holder 35 til 40 grader med korte parti på 45, og er steinete og isete i dårlige forhold. Friflyts sørøstrenne ned mot Memurubu er en gjennomgangstur — den ender ikke ved bilen din.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigningen er lite bratt terreng: bratteste sammenhengende parti på linja måler 28,1 grader, og den bratteste hundremeteren, 1900 til 2000 moh, holder 18,0 grader i snitt. Østryggen selv ligger på 18 til 20 grader. Det som teller på ruta er ryggen inn mot Brue, der nordsida bryter av i 50 til 60 grader ned mot Besshøbrean innen to hundre meter fra sporet, mens sørsida er slak og bred — et spor som trekker nordover mot le er et annet spor enn det du planla.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Topplatået er stort og rundt, og nord-, nordvest- og vestsida faller 55 til 70 grader ned mot Russvatnet og Gjende. I dårlig sikt er det her turen blir farlig, ikke i oppstigningen. Radialmålinger fra varden viser hvorfor feilen gjøres: 75 grader peiling holder 17,8 grader, men 60 og 90 kjennes like slake i fem hundre til åtte hundre meter og bryter så av i 55 til 60. Overgangen fra Besshøbrean opp på Brue er rundt 60 grader og skal ikke gås. Sørrennene holder 35 til 40 grader med parti på 45.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'besshoe';

update public.tk_tours set
  description_up   = 'Du starter på Korpen, parkeringen på fv55 ved Prestesteinsvatnet, 1397 moh. Sognefjellsvegen er vinterstengt over høyfjellet og brøytes opp ved påsketider — i 2026 åpnet den 1. april — og de første ukene etter åpning er strekninga nattestengt fra 20 til 08. Åpningsdatoen setter sesongen, så sjekk vegstatus før du kjører. De første halvannen kilometerne går nedover og over land: linja følger vestsida forbi to små tjønner på 1384 og 1381 moh, videre vest for magasinet og ned til demninga ved utløpet på 1343 moh. Hold land langs vestsida — ikke skjær over isen. Prestesteinsvatnet er et magasin, og den flate snarvegen rett over er den ene flata på hele turen du ikke vet bæreevnen til.

Å gå rundt koster: linja gir fra seg 113 høydemeter før den begynner å stige for alvor, mot de 54 en rett strek fra bilen til demninga ville gitt. Land bølger, is gjør det ikke. Forbi demninga trekker du opp i søkket øst for nordryggen til Steindalsnosi og inn på Fannaråkbreen rundt 1550 moh. Hold deg lavt og i den slake delen av breen. Den er oppsprukket, og du går den i tau.

Sikt deg inn mot 1688-høyden øst for Fannaråknosi og rund den. Ikke hold høyde over breen: går du for høyt før du svinger opp, blir passasjen opp på østryggen vesentlig brattere. Den bratteste hundremeteren ligger mellom 1800 og 1900 moh og holder 19,8° i snitt over 317 meter grunn, og det bratteste enkelttrinnet på linja måler 36,8° mellom 1859 og 1884 moh.

Rundt knausen kommer du inn på sørøstryggen og sommerstien fra Keisarpasset. Følg den over Fannaråknosi og videre langs østryggen til Fanaråken. Det henger store skavler på nordsida hele veien, og nordsida faller 55–58° i de øverste 90 metrene under kammen — hold deg på sørsida, også når sikten er god.',
  description_down = 'Ned følger du samme linja — øst- og nordøstvendt, jevnt og slakt, med pålitelig vårsnø langt ut i sesongen. Den andre dokumenterte ruta, fra Turtagrø gjennom Helgedalen, gir 1230 høydemeter og er en annen dag.

Vanligste feil: å holde høyde over breen på vei ned, slik at du havner for høyt vest for 1688-høyden og må ned der det er brattest. Slipp deg ned rundt knausen slik du kom opp. Og husk at siste strekket ikke er gratis: fra demninga på 1343 moh stiger det tilbake til Korpen på 1397, og vestsida bølger — 113 høydemeter til sammen på veien inn, og de samme igjen på veien ut.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Normalvegen er slak — bratteste hundremeter holder 19,8° i snitt mellom 1800 og 1900 moh, over 317 meter grunn, og det bratteste enkelttrinnet på linja måler 36,8° mellom 1859 og 1884 moh. På Fannaråkbreen er sprekkene faren like mye som snøen. Nede ved starten er faren en annen og enklere å beskrive: isen på et magasin som tappes ned, og ruta er lagt på land utenom den.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Nordsida av Fanaråken bærer store, permanente skavler og faller 55–58° i de øverste 90 metrene under ryggkammen — den sida er ikke et alternativ, verken opp eller ned. Vest- og sørvestsida ned mot Marangsgjelet holder 34° jevnt, med 38–40° mellom 1360 og 1420 moh; det er Helgedalen-ruta som går der, en egen dokumentert linje, ikke en utveg fra normalvegen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade — og tau og bresele, ruta går over Fannaråkbreen.'
    )
  )
where slug = 'fanaraken';

update public.tk_tours set
  description_up   = 'Start ved Maurvangen Fjellpark, 971 moh, ved Fv51 i Sjodalen. Fri Flyt: «Startsted: Maurvangen Fjellpark. Prat med vertskapet om parkering.» Rasteplassen Maurvangen og en parkeringsplass ligger 430 meter nord. Bessheim: «The starting point is at Besseggen Fjellpark Maurvangen.»

Fri Flyt: «Turen begynner i skogen innenfor Maurvangen. Du kan følge oppkjørt og stikket trase opp gjennom skogen, men det er ofte like fint å finne eget spor opp gjennom fjellbjørkeskogen.» Den stikkede løypa er kartlagt i OSM, og linja går 31 til 152 meter fra den mellom 0,63 og 2,22 km. Linja går sørover gjennom skogen på østsida av Brurskardbekken, og skogen slipper ved 1036 moh, 1,17 km fra start. Brurskardbekken renner 132 meter vest for linja ved 1,62 km.

Ved 1181 moh, 2,22 km fra start, svinger linja østover. Ut.no beskriver sommerstien, som kommer inn fra vest, slik: «På snaut 1200 moh forlater man stien, krysser Brurskardbekken på egnet sted og skrår oppover mot Mollflyhalsen.» Her er turen på sitt bratteste — 12,5 grader fra 1200 til 1300 moh og 14,3 fra 1300 til 1400, med bratteste parti på 19,3 grader mellom 1383 og 1398. Her går linja langs et bekkefar: 70 til 80 meter nord for den, ved 1371–1399 moh, faller sida 45 til 57 grader — det er den typen bekkefar Fri Flyt advarer mot. Hold avstand til kanten. Molflyhalsen når du på 1447 moh etter 3,60 km.

Ut.no: «Denne ryggen følges så opp til vel 1600 moh.» Over 1600 er det nesten flatt — bandet fra 1600 til 1700 moh måler 4,4 grader over 1214 meter grunn — og ut.no skriver at terrenget blir «overveiende steinete». Like over Molflyhalsen står celler på 39 til 42 grader 20 meter sør for linja ved 1502 moh. Bakken under linja er aldri 35 grader eller brattere. Toppen er et platå: 3,7 til 15,9 grader i snitt til alle kanter over 500 meter. Bessheims vinterlinje følger den stikkede løypa til Brurskaret, og derfra en merket trasé «steep to the top»; Brurskardet ligger 902 meter sørvest for denne linja, og løypa går dit: ved 4,81 km og 1661 moh er linja 1481 meter fra den.',
  description_down = 'Fri Flyt: «Nedkjøring samme veg som opp, evt ned mellom Heimdalshø og 1732 moh. Her er det ofte har betre føre. Ettersom terrenget er slakt hele vegen, er ikke turen like spennende etter store snøfall.» Topp 1732 ligger 582 meter sørvest for linja.

Bollen mellom Heimdalshøe og 1732 er den Fri Flyt advarer mot: den «kan samle store mengder snø, og bør bare kjøres på senvinteren og våren». Sadelen mellom toppene ligger på 1669 moh, og mellom 5,40 og 5,76 km går linja 406 til 454 meter nord for den, over øvre del av den nordvendte sida — det kan være øvre del av bollen. Vil du ha den enkle turen, kjører du samme vei ned og holder deg på ryggen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste bandet er 14,3 grader mellom 1300 og 1400 moh, og bratteste sammenhengende parti 19,3 grader mellom 1383 og 1398. Bakken under linja er ikke 35 grader eller brattere noe sted. Fri Flyt graderer turen «KAST 1 – Enkelt» med bratteste punkt under 30 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Fri Flyt: «Vær obs på trange og dype bekkefar som samler lange, harde og bratte skavler.» Bekkefaret nord for linja ved 1371–1399 moh har sider på 45 til 57 grader. Den nordvendte bollen mellom toppen og 1732 kan samle store mengder snø, og linja krysser øvre del av den nordvendte sida nord for sadelen. Over skogen er det snaufjell uten ly, og toppen er et steinete platå.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Jotunheimen er en A-region og varsles daglig i sesongen. Fv51 er åpen fra Vågå til Gjendesheim hele året; strekningen over Valdresflye sør for Maurvangen er vinterstengt. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'heimdalshoe';

update public.tk_tours set
  description_up   = 'Parkeringa ligger på toppen av Rørvikfjellet, 542 moh, 100 meter fra Rørvik fjellstove mot Førde. Det er her Fri Flyt sier du kan spenne på skia ved bilen, og at turen derfor er snøsikker fra tidlig i sesongen; Fjord Norway skriver at lokale går den allerede i november og desember.

Gå nordover og forbi Fjelltjønna med tjernet på venstre side — linja går øst for det, 70 meter fra registerpunktet. Så et lite stykke nordøst til ryggformasjonen, 647 moh etter 937 meter, som du følger mot nordvest. Der linja tar østover inn på ryggen, krysser den 50 meter bakke på 35 grader eller brattere, med en celle på 61 grader — et brattheng du ser og velger linje gjennom selv. Ut.no-stien går «inn i skogen over fjelltjønna»; langs linja er terrengklassen åpent fjell nesten fra start.

Ryggen er det bratte. Bandet fra 700 til 800 moh måler 17,3 grader. Bandet fra 800 til 900 moh måler 20,0 grader over 263 meter grunn og er det bratteste på turen. Bandet fra 900 til 1000 moh måler 19,9 grader. Bandet fra 1000 til 1100 moh måler 19,3 grader. Det bratteste sammenhengende partiet, 25,3 grader mellom 916 og 940 moh, ligger midt på ryggen — der bakken under sporet er 35 til 47 grader over 39 meter — og Fri Flyt oppgir bratteste punkt til 27–32 grader, øverst på ryggen over 1000 moh. Innenfor 50 meter av linja står knauser og hamrer på 41 til 67 grader; sommerstien på ut.no går gjennom «ei rås i ein bratt berghammar» og gir en veg rundt den. Vinterlinja følger ryggformasjonen.

Ved 1134 moh flater det ut, og du legger sporet nordover til kammen og så østover til toppen etter 2,83 km. Terrengmodellen leser 1204 moh; Fri Flyt, ut.no og kartet sier 1209. Kammen fortsetter østover over et skar på 1111 moh til registerets Ørnafjellet, 1228 moh — den toppen Fri Flyt fører som Blåfjellet, 1226 moh, med egen tur fra Hårklau, og foreslår som rundtur herfra.',
  description_down = 'Fri Flyt: samme veg ned, eller en av mange linjer mellom toppen og høyden på 1125 moh langs Rimmane. Sørsida av toppen måler 14,2 grader i snitt og 26,1 grader i bratteste vindu, 230 til 290 meter ut, og vestover mot Rimmane er kammen slak, 8,2 grader i snitt. Fri Flyt skriver at de sørvendte sidene gir sol på kalde vinterdager.

Nordsida er hamrer: 52,3 grader i bratteste vindu 390 til 450 meter ut, og nordvestsida 48,0 grader. Sørvest måler 39,5 grader 440 til 500 meter ut. Kjør ned sørover, ikke nordover.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti på linja er 25,3 grader mellom 916 og 940 moh, og bratteste hundremeteren er 800 til 900 moh med 20,0 grader. Det er stigningen langs sporet. Bakken sporet krysser er 35 grader eller brattere over 50 meter ved 628–644 moh, med en celle på 61 grader, og over 39 meter ved 921–940 moh. Fri Flyt oppgir bratteste punkt til 27–32 grader, øverst på ryggen over 1000 moh.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Ryggen har knauser og hamrer på 41 til 67 grader innenfor 50 meter av linja, og nordsida av toppen bryter av i 52,3 grader. Sørsida, der nedkjøringene går, ligger i sola — det er det Fri Flyt selger turen på, og det er også det som varmer snøen når dagen blir lang.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Rørvikfjellet er tilgjengelig om vinteren; det er Nasjonal turistveg Gaularfjellet som ifølge Fjord Norway vanligvis åpner i månedsskiftet april/mai. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'eggja';

update public.tk_tours set
  description_up   = 'Start ved veienden på Rytnavegen, 404 moh — den private veien som er skiltet mot parkering til Storehesten, som er det lokale navnet på det samme fjellet. Fri Flyt oppgir to vertikaler for dette fjellet, og de er to ulike starter: 960 høydemeter fra Rytnane nede i dalen, og 810 herfra.

Følg skogsveien oppover mot Kårstadstølen på 495 moh, og hold deretter øst mot Rabbane på 512. Ruta går østover før den snur nordover — det ser ut som en omvei på kartet, og det er den beskrevne veien.

Fra Rabbane går det nordover mot skaret øst for Skaravatnet på 715 moh. Partiet mellom 700 og 800 moh er det slakeste på turen, 3,8 grader over 1439 meter grunn. Ruta går vestover langs nordsida av vatnet og forbi Grunnevatnet på 785 moh — og linja ligger på isen underveis: om lag 240 meter på Skaravatnet, 58 meter på et navnløst tjern på 726 moh i skaret, og om lag 260 meter på Grunnevatnet, opptil om lag 40 meter fra land. Alle tre er naturlige fjellvatn, ikke magasin, men det er vatn under snøen og skal vurderes som det.

Vest for Grunnevatnet tar du litt høyde og følger så den markerte skålformasjonen sørover helt opp. Bandet fra 1000 til 1100 moh måler 11,1 grader i snitt over 537 meter grunn; bratteste hundremeteren er 13,8 fra 900 til 1000 moh, og bratteste sammenhengende parti 36,2 grader mellom 665 og 688 moh. Fra Grunnevatnet til varden på 1209 moh er det 424 høydemeter på 581 meter grunn — om lag 36 grader i snitt over hele skåla.',
  description_down = 'Ned samme skåla og tilbake over Grunnevatnet, Skaravatnet og Rabbane. Fallretninga er nord, og skåla er både oppstigninga og nedkjøringa.

Vanligste feil: å gå opp skåla på hardt føre uten isøks og stegjern. Fri Flyt fører begge deler som nødvendig utstyr på denne turen, og grunnen står i tallene — 36 grader i snitt over de siste 424 høydemeterne er ikke en bakke du sklir kontrollert nedover.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slak til 900 moh og bratt over. Skålformasjonen sør for Grunnevatnet er skredterreng: bandet fra 1000 til 1100 moh måler 11,1 grader i snitt, bratteste sammenhengende parti 36,2 grader mellom 665 og 688 moh, og hele strekket fra Grunnevatnet til toppen ligger på om lag 36 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skåla er den ene store vurderinga på turen, og den har ingen omvei: ruta går opp gjennom den. Hardt føre gjør siste stigninga til en klyving heller enn en skitur, og det er da isøks og stegjern går fra å være utstyr i sekken til å være det du står på. Toppen selv har en side det ikke går an å holde seg på: sør og sørøst måler 48,9 og 47,1 grader i snitt over 500 meter, med 60-metersvinduer på 74,0 og 74,3. Øst og vest, 15,1 og 13,8 grader, er de slake, og skåla kommer opp fra nord.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for området på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'kvamshesten';

update public.tk_tours set
  description_up   = 'Start på parkeringa på østsida av fv51 der Valdresflya vandrerhjem sto før brannen i 2015, 1391 moh. Veien er det som setter sesongen: fv51 er brøytet vinteren gjennom bare til Bygdin, og strekninga nordover forbi vandrerhjemmet åpner normalt rundt 1. april.

Herfra går ruta vestover ut på vidda, sør for Fisketjerne. De første 1,2 kilometerne er helt flate og faller faktisk ti høydemeter — du kommer til å stake dem, og du kommer til å stake dem hjem igjen. Vidda er samtidig helt åpen og gir ingen ly. Underveis går linja over is to ganger: 135 meter på 1379 moh, opptil 50 meter fra land, og 225 meter på 1377 moh, opptil 100 meter fra land. Ingen av de to har navn i registeret — Fisketjerne ligger 824 meter unna — og begge er naturlige tjern, ikke regulerte. På ei flate der resten er fast mark er de verdt å vite om.

Så stiger det jevnt mot den første kneika på rundt 1530 moh og videre opp på ryggen ved 1736 moh. Ryggen følges vestover, sør for Øystre Rasletinden (2011 moh), til rundt 1890 moh. Merk at sporet her ikke ligger på en rygg i skredfaglig forstand: mellom 1810 og 1890 moh går det under sørsida av Øystre Rasletinden, som stiger 130 høydemeter rett over deg med et parti på 47 grader. Ikke gå over Øystre Rasletinden: øst- og sørøstsida av den toppen måler 42 til 50 grader, og linjer inn dit fra øst får steg på 51 til 63.

Til slutt den korte kneika opp mot toppplatået. I fallinja måler den 31 til 35 grader mellom 1910 og 1960 moh; over 1960 slakner den til 16 til 20 inn mot platået. Det er ett av to steder på ruta med et samlet bratt heng over deg — det andre kommer lenger nede, på ryggen under Øystre Rasletinden. Linja som er tegnet legger seg på skrå over den og holder 21,7 grader som bratteste sammenhengende parti; den bratteste hundremeteren, 1900 til 2000 moh, måler 15,1 grader i snitt. Over kneika er det ut på platået og de siste hundre meterne til 2104 moh.',
  description_down = 'Ned samme vei: kneika, ryggen østover sør for Øystre Rasletinden, ned til 1736 og videre ned første kneik til vidda. Under første kneik, fra 1531 moh, er det slutt på kjøringa — de siste to kilometerne over vidda er flate, og de ti høydemeterne du fikk gratis på vei ut skal betales tilbake.

Vanligste feil: å ta ut kursen nordover fra toppplatået fordi det ser slakt ut. Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare øst og nordøst er slake — øst måler 26 grader, nordøst 32 — og det er den veien du kom.

Waypointet på 1890 moh ligger på det terrengmodellen klassifiserer som snø og is. Det er en permanent snøfonn, ikke en sprukken bre: Leirungsbrean og Kalvehøgdbreene ligger fire kilometer lenger vest og sør.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nesten hele ruta er slak: første kneik måler 22 til 24 grader, ryggen 23, og bratteste sammenhengende parti på linja 21,7 grader. To steder har et samlet bratt heng over seg. Kneika under toppplatået måler 31 til 35 grader i fallinja mellom 1910 og 1960 moh. Og ryggtraversen mellom 1810 og 1890 moh går under sørsida av Øystre Rasletinden: 130 høydemeter rett over sporet, 34 grader i snitt og 47 på det bratteste. Begge steder legger sporet seg på skrå, men snøen over deg bryr seg ikke om sporet — og et sørvendt heng i april er nettopp det du vurderer tidlig på dagen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare øst (26 grader) og nordøst (32) er slake, og de er ruta. Øystre Rasletinden, 2011 moh, ser ut som en naturlig del av ryggen, men øst- og sørøstsida av den måler 42 til 50 grader — skiruta går sør for toppen, ikke over den.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'rasletinden';

update public.tk_tours set
  description_up   = 'Start på Bånsetra, 913 moh — setervollen der Bånsetervegen ender. Ut.no oppgir 914 for samme punkt. Veien inn er skiltet fra fylkesveg 319 sør for brua over Lågen i Fåvang, og det er et setergrend- og hyttefelt med eget vegnett: Bånsetervegen, Svarttjønnvegen, Tutlidalsvegen og Årnesfeltet er alle kartlagt.

Rett vestover og opp lia er det korteste bratte partiet på turen: 14,0 grader fra 900 til 1000 moh over 348 meter grunn, med et steg på 22,1 grader mellom 986 og 1000. Skogen slipper taket allerede på 954 moh og terrenget er åpent fra 961 — dette er en tur som er over tregrensa etter tre hundre meter.

Videre skrår linja sørvestover: 12,5 grader fra 1000 til 1100 moh over 461 meter grunn, og så opp på ryggen. Bandet fra 1100 til 1200 moh måler 5,8 grader over 967 meter grunn — ryggen stiger jevnt og slakt helt til toppen.

Toppen er en bred kuppel på 1202,4 moh, og det er den ut.no fører med 1202 som høyeste punkt på Bånsæterkampen. Ryggen fortsetter vestover langs kanten til en lavere topp på 1196,1 moh, 890 meter unna bak et søkk — den toppen kortet tidligere førte. Utsikten går til Jotunheimen i vest og Rondane i nord, og ned på fem seterområder i sør.',
  description_down = 'Ned samme veien, nordøstover. Den sida måler 5,7 grader i snitt over 400 meter med et bratteste 60-metersvindu på 10,1 — det er den slake ryggen ruta kom opp — og nord måler 7,4 med 11,0.

Sørsida er en annen sak, og den er grunnen til at denne turen har en gradering i det hele tatt. Ut.no skriver om «bratte stup mot sør» og «fjellrygger som går stupbratt et par hundre meter ned», og sveipet setter tall på det: sørøst 31,0 grader i snitt med 54,1 i vinduet 40 til 100 meter ut, sør 30,8 med 54,6 i 50 til 110, øst 28,2 med 41,7 i 140 til 200, og sørvest 20,1 med 32,4 lenger ute, 200 til 260.

Om sommeren går det tydelig sti langs kanten av fjellhamrene, og ut.no skriver at man går trygt der. Under snø er den kanten en skavlkant, og den er ikke til å se i flatt lys. Hold nordsida av ryggen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '301 høydemeter der bratteste band er 14,0 grader og bratteste steg 22,1. Ruta gir tilbake 12 høydemeter på 1,83 km, og ryggen opp mot toppen måler 5,8 grader over 967 meter grunn. Oppstigninga i seg selv er ikke et skredproblem.'
    ),
    jsonb_build_object(
      'title', 'Eggen',
      'body',  'Hele graderinga ligger i kanten. Sør og sørøst måler 54,6 og 54,1 grader i bratteste 60-metersvindu bare 40 til 110 meter fra toppen, og øst 41,7. Det er ikke terreng du kommer tilbake fra hvis du går ut på skavlen, og på en rygg som ellers måler 5,8 grader er det ingenting som varsler deg om at kanten kommer.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Oppland sør på varsom.no. Oppland sør er en B-region: den varsles bare når faregraden ventes å bli 4 eller 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Begge ut.no-beskrivelsene er sommerbeskrivelser og fører sesong juni til september; sesongen på kortet er lest ut av at Bånsetra er et hyttefelt med brøytt vegnett. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'banseterkampen';

update public.tk_tours set
  description_up   = 'Start ved parkeringa på toppen av Rørvikfjellet, 542 moh, 100 meter fra Rørvik fjellstove mot Førde — samme parkering som Eggja. Fri Flyt starter turen ved fjellstova og går sørvestover langs en lang, avrundet rygg i oversiktlig terreng.

Den første kneika er den bratte. Fra parkeringa opp til 600 moh måler linja 14,1 grader over 230 meter grunn, og Fri Flyt oppgir 26 til 30 grader mellom 575 og 600 moh. Linjas bratteste 30-metersvindu, 26,2 grader, ligger litt høyere, mellom 679 og 701 moh. Skogen slipper ved 592 moh. Bakken under linja er brattere enn sporet på noen korte strekk her: 20 og 33 meter på 35 grader eller mer ved 702–713 moh, med en celle på 54 grader, og 36 meter ved 732–735 moh — knauser du ser og velger linje rundt.

Over det er ryggen slak: bandet fra 700 til 800 moh måler 3,9 grader over 1531 meter grunn. Linja passerer nord for Svartenova — toppen ligger 142 meter sørøst for linja — og går opp i skaret der ryggen deler seg, Jakobskardet, 853 moh etter 3,06 km. Skaret er sadelen mellom Venevassegga og Rundenova; grenen mot nordvest går til Rundenova, 721 meter fra linja, og Venevassegga ligger sørover.

Fra skaret følger du ryggen sørover. Bandet fra 900 til 1000 moh måler 7,3 grader. Ved 906–908 moh krysser linja 17 meter bakke på rundt 40 grader, og langs ryggen står knauser og hamrer på 53 grader og mer innenfor 50 meter av linja — små brattheng i et ellers slakt fjell. Toppen er på 1024 moh etter 4,68 km.',
  description_down = 'Fri Flyt: «Det er vanleg å køyre ned same vegen som du gjekk opp.» Toppen er slak på nesten alle sider — 6,1 til 11,9 grader i snitt mot nord, øst og vest over 500 meter — og nordsida, som er den ruta vender mot, måler 7,3 grader.

Sørvestsida er unntaket: 36,3 grader i bratteste vindu 270 til 330 meter ut, og mot nordvest bryter terrenget av i 52,7 grader 440 til 500 meter ut. Kjør tilbake langs ryggen til Jakobskardet og videre mot fjellstova.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti på linja er 26,2 grader mellom 679 og 701 moh, og bratteste bandet er stykket under 600 moh med 14,1 grader. Bakken under sporet er 35 grader eller brattere på fire korte strekk på 17 til 36 meter, med bratteste celle 54 grader. Fri Flyt graderer turen som «Lett».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Terrenget er slakt, men ikke uten brattheng: knauser og små hamrer langs ryggen, og sørvest- og nordvestsida av toppen på 36,3 og 52,7 grader. Ryggen er snaufjell uten ly, og i skodde er det orienteringen som er det vanskelige — de avrundede ryggene ligner hverandre.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Fjordane på varsom.no. Indre Fjordane er en A-region og varsles daglig i sesongen. Rørvikfjellet er tilgjengelig om vinteren; Nasjonal turistveg Gaularfjellet åpner ifølge Fjord Norway vanligvis i månedsskiftet april/mai. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'venevassegga';

update public.tk_tours set
  description_up   = 'Start på den kartfestede parkeringa på Mollandsmarki, 501 moh, over Marifjøra i Luster. De første hundre metrene grunn er flate — bandet fra 400 til 500 moh måler 0,5 grader — før veien mot Garden begynner å stige.

Følg veien og deretter sommerstien opp gjennom skogen. Stigningen er jevn og uten overraskelser: 10,0 grader fra 500 til 600 moh, 11,6 fra 600 til 700 og 14,3 fra 700 til 800. Bratteste sammenhengende parti på hele turen ligger her nede, 23,3 grader over tretti meter mellom 704 og 718 moh.

Skogen holder til 851 moh. Over tregrensa, ved omtrent 816 moh, tar du inn på sørvestryggen, og den fører hele veien opp. Bratteste hundremeteren er 900 til 1000 moh med 16,3 grader i snitt — det er de bratte punktene rutebeskrivelsen varsler om, og de er korte.

Fra 1000 moh slakker det av igjen: 7,9 grader fra 1000 til 1100 moh og 6,5 over det, med varden på 1120 moh. Østtoppen på samme høyde ligger like ved for den som vil ha utsikten fra begge.',
  description_down = 'Ned samme ryggen, sørvestover. Ryggen er bred, og på stabile dager kan du også kjøre rett vestover fra toppen.

Vanligste feil: å velge den vestlige linja uten å tenke på hvor den ender. Går du vestover i stedet for å følge ryggen ned, havner du i den tette skogen under 851 moh, og det er en lang og lite trivelig måte å komme tilbake til bilen på.

Fra kaia i Marifjøra får du hele fjellet: 1131 høydemeter på 5,29 km mot normalrutas 626 på 3,31 km — Molden fra fjorden i stedet for fra Mollandsmarki på 501 moh. Kildens beskrivelse er kort og treffer: traktorvei og grusvei, «etter 1,5 km går bratt oppover i skogen til Steinkveane», videre til den nedlagte stølen Svolsete på 724 moh og så fjellterreng med noen bratte bakker til topps. Det bratteste steget ligger nettopp der, 36,3 grader mellom 108 og 140 moh, rett over veien; høyere oppe måler det bratteste hundremetersbeltet 21,0 mellom 300 og 400. ut.no: 12,5 km, 1106 høydemeter, fem timer, juni–oktober.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bred sørvestrygg med jevn stigning. Bratteste hundremeteren, 900 til 1000 moh, måler 16,3 grader, og bratteste sammenhengende parti 23,3 grader mellom 704 og 718 moh — nede i skogen, der terrenget er kort og oversiktlig.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Sørvestryggen har et par brattere punkter den siste biten opp, og de er verdt å se på når snøen er ustabil. Vestsida under toppen er den andre vurderingen: den blir kjørt på stabile dager, og den ender i tett skog. Den tredje er fjordsida, og den er ikke en vurdering men en grense: øst og sørøst fra varden måler 46,1 og 46,4 grader i snitt over 500 meter, med 60-metersvinduer på 62,4 og 63,6. Utsikten ned mot Lustrafjorden kommer fra en kant, ikke fra en helling.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Sogn på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'molden';

update public.tk_tours set
  description_up   = 'Start på parkeringen ved Fagerstrand på østsida av Bygdin, like ved Bygdinstøga og Bygdin Høifjellshotell. Plassen er privat og avgiftsbelagt, og betales med Vipps til nummeret på skiltet. Satsen er oppgitt både som 60 og 80 kroner i ulike kilder, så les skiltet framfor å regne med et beløp. Fv51 er vinterstengt nordover, så Bygdin er den brøytede enden av veien og plassen er tilgjengelig hele våren. Du er over skoggrensa fra første skritt, og stigningen begynner med en gang.

Legg sporet vest- og nordvestover inn mot den nedre delen av Fagerdalen framfor å gå rett mot toppen. Toppen ser nær ut herfra, men rett nord for parkeringen ligger et trinn som holder rundt 40 grader mellom 1090 og 1220 moh, og østsida av Synshorn faller enda lenger: 31 grader i snitt de første fire hundre metrene ned mot Fv51, med et parti på 57 grader. Ingen av dem er oppstigning. Hold deg vest for fjellet til du er over 1400 moh.

Flanken du går på ligger stort sett mellom 10 og 20 grader, i åpent terreng uten en trestamme. De siste hundre høydemeterne, fra 1400 til 1475, ligger i snitt på 16,6 grader, og bratteste enkeltparti på hele ruta måler 22,1 grader. Toppen tas fra sørvest, over den slake platåkanten.

Ved dårlig sikt: ikke gå øst eller nordøst fra toppen. Der slutter fjellet med en gang — østsida måler 31 grader i snitt, nordøstsida 33, og begge har partier over 50 grader innen to hundre meter fra toppryggen. Sørover er fella den motsatte: platået fortsetter nesten flatt og drar deg utover.',
  description_down = 'Ned samme flanke som opp. Sørvestflanken er bred og jevn — 16 grader i snitt, 23 på det bratteste — og med vårsnø går den rent hele veien ned mot Fagerdalen.

Vanligste feil: å slippe seg rett sørover fra toppen fordi det er der parkeringen ligger. Sørsida frister nettopp fordi den er slak: 4,5 grader i snitt de første fire hundre metrene, ikke over 23 grader noe sted. Så tar den slutt. Rundt 1425 moh, en snau halvkilometer sør for toppen, faller sørveggen 223 høydemeter på 120 meter — 117 av dem på 56 meter der den er brattest, mellom 1330 og 1210 moh. Hold sørvestflanken i stedet, ned til rundt 1120 moh, og følg sporet øst- og sørøstover tilbake til Fagerstrand.

Ryggen nordvestover mot Heimre Fagerdalshøe (1510) er en forlengelse av turen, ikke en annen veg ned: 1,6 kilometer over et skar på rundt 1360 moh. Nedkjøringen derfra ned i Fagerdalen er brattere enn fra Synshorn og hører til dem som kjenner terrenget.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigningen går i åpent terreng hele veien, uten skog å bremse noe. Bratteste enkeltparti på linja måler 22,1 grader, og de øverste hundre høydemeterne ligger i snitt på 16,6 grader. Selve sporet er altså slakt; det du må vurdere er hva som henger over deg når du kommer inn mot toppen fra sørvest.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Østsida mot Fv51 faller 31 grader i snitt de første fire hundre metrene fra toppen, ned til rundt 1230 moh, med et 60-metersparti på 57 grader. Nordøstsida måler 33 grader i snitt og 51 på det bratteste, nordsida 28 og 44. Sørsida er den slakeste av alle, 4,5 grader, helt til platået tar slutt en snau halvkilometer sør for toppen og faller 223 høydemeter på 120 meter. Ingen av dem er linjer du velger på veg ned.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'synshorn';

update public.tk_tours set
  description_up   = 'Start på toppturparkeringa på Brandhaugane, 427 moh ved rv5 noen kilometer før skisenteret — registeret har Brandhaugane som haug i skogen rett ved, og Fri Flyts 785 høydemeter impliserer nøyaktig denne starten. Gå mot sørøstryggen og følg den oppover gjennom skogen; linja passerer 542 moh i skogen, som etter Kartverkets klasser slutter på 775.

Over skoggrensa kommer det brattere partiet, og det bratteste hundremetersbeltet på turen, 22,5 grader i snitt mellom 800 og 900 moh. Dette er stedet kildens skredadvarsel gjelder: her har skiløpere løst ut skred på vei OPP. Sikksakk med vett, og snu her om snøen sier fra.

Ved Orraleiken flater terrenget ut, slik kilden sier — registerpunktet leser 1042 moh i åpent terreng. Pusterom, og så den siste stigningen: linja passerer 1155 og varden står på 1204 moh, målt mot registerets 1203 og Fri Flyts publiserte 1205.

Registeret fortjener en setning her også: uten styring klatrer toppsøket forbi navnet og videre vestover, for ryggen stiger uten skar mot høyere fjell — 1236 bare 280 meter vest, 1354 knapt kilometeren ute. Togga er det navngitte punktet, ikke det høyeste på ryggen, og kortet bærer det navngitte.',
  description_down = 'Normalveien ned er samme vei som opp: siste stigningen, Orraleiken, og det brattere partiet ned i skogen. Det brattere partiet er samme henget som på vei opp — det som kan løses ut under opptur, kan løses ut under nedkjøring, og linjevalget fra oppturen er fasiten.

Fri Flyt beskriver fem nedfarter — sørøstryggen, to på sørsida og to østover, med utganger mot Laugadalen, Gunvordalen og Vatnasete. Ingen av dem er denne linja, og målingene fra varden sier hva de krever: de to østvariantene måler 50,5 og 51,1 grader i bratteste 60 m-vindu og sørsida 41,9. Nordsida, som ingen av dem går ned, faller 44,8 grader 210–270 m ut. Det er ekte alpine alternativ på et fjell med kort vei hjem — velg etter snøen, ikke etter lista.

Vestover skal ingen: ryggen stiger videre mot høyere fjell, og i skodde er det den veien du havner om du bare «følger ryggen». Kompasskurs sørøst fra varden.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Normalveien',
      'body',  'Fri Flyts egen advarsel er uvanlig konkret, og den skal siteres nesten ordrett: på sørøstryggen er det et brattere parti der skiløpere har løst ut snøskred under opptur når det er ustabile snøforhold. Det partiet ligger mellom skoggrensa på 775 og Orraleiken på 1042, med beltet 800–900 moh som det bratteste målte. Kildens bratteste punkt er 33–35 grader; linja sikksakker slakere, men henget er det samme.'
    ),
    jsonb_build_object(
      'title', 'Variantene',
      'body',  'Fri Flyt legger sin egen NB på østflanken: «Skiløpere har flere ganger løst ut flakskred i denne østlige flanken», og nedfarten ved høyde 1140 «krever stabile snøforhold». Fem nedfarter gir fem måter å øke innsatsen på: nord-, nordøst- og østsida måler 44,8 til 51,1 grader i sine bratteste 60 m-vinduer, sørsida 41,9. Kort vei til bilen gjør det fristende å ta en variant til — det er nettopp da snøvurderingen fra i stad skal gjelde ennå.'
    ),
    jsonb_build_object(
      'title', 'Ryggen som stiger',
      'body',  'Vest for varden stiger ryggen videre uten skar — snittet vestover er negativt fordi terrenget går opp. I godt vær er det åpenbart; i skodde er det en felle: den som følger ryggen videre, går inn i brattere og villere fjell, ikke ned. Sørøst er hjemveien, alltid.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Togga ligger i varslingsregionen Indre Sogn, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Fri Flyt publiserer ingen sesongmåneder for Togga; Sogndal-sida deres setter sesongen fra november til mai. Kortets desember–mars er appens egen innsnevring til midtvintermånedene, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'togga';

update public.tk_tours set
  description_up   = 'Start på parkeringen ved Fv51, en kilometer sør for Bygdin Høifjellshotell. Avgift 60 kroner dagen. Du er over skoggrensa allerede fra bilen. Den første kilometeren går over det flate platået vest for Stavtjerne og gir bare rundt tretti høydemeter, med et myrdrag som ligger dekket når det er skiføre.

Etter platået runder du foten av nordryggen og passerer grinda i reingjerdet. Herfra legger du sporet opp den brede nordvestskuldra. Den ligger stort sett på 15 til 22 grader, og de bratteste hundre høydemeterne, fra 1300 til 1400, ligger i snitt på 18,9 grader.

Øverst er ruta merket med jernstenger. De står der for folkene som vedlikeholder sambandsanlegget på toppen, og de er verdt gull i flatt lys. Bratteste enkeltparti på hele linja måler 23,8 grader, og det ligger her oppe, over 1500 moh. Toppen er 1607 moh, med Bygdin i nord og Jotunheimen bak.

Hold skuldra. Østover, mot Fv51, faller fjellet 43 grader i snitt de første fire hundre metrene, og mellom 1580 og 1420 moh — rett under toppen — går det 65 til 74 grader. Sørøstover, mot Nørdre Båtskardet, er snittet 41 grader og bratteste parti 63. Sørsida er slak øverst, rundt 16 grader de første to hundre metrene, og går så over i et trinn på 40 til 59 grader mellom 1535 og 1435 moh. Televerkets vinterløype svinger lenger vest, opp fra Raudfjorden på vestryggen, og møter denne linja først oppe under toppen; begge ligger på samme nord- og nordvestside.',
  description_down = 'Ned samme skulder. Jernstengene tar deg ned de øverste hundre høydemeterne i dårlig sikt, og under det er skuldra bred nok til at du kan velge linje selv.

Vanligste feil: å slippe seg østover fra toppen mot veien du ser under deg. Der ligger østveggen over Fv51 — 43 grader i snitt, og 65 til 74 rett under toppryggen — og sørøstover skaret mot Nørdre Båtskardet, 41 grader og oppbrutt. Hold nordvestskuldra til terrenget flater ut, og ta så platået tilbake til parkeringen.

Sørruta fra Båtskaret finnes — 454 høydemeter på halvannen kilometer — men den er dokumentert som fottur, ikke som skioppstigning. Den er ikke veien ned herfra.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nordvestskuldra ligger stort sett på 15 til 22 grader, de bratteste hundre høydemeterne 18,9 grader i snitt, og bratteste enkeltparti 23,8 grader oppe over 1500 moh. Visit Valdres beskriver flere linjevalg under 30 grader på denne sida, men med terrengfeller og utløpssoner i forsenkningene. Velg linje etter dagens varsel, ikke etter sporet som allerede ligger der.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Østveggen over Fv51 faller 43 grader i snitt fra toppen, og 65 til 74 grader mellom 1580 og 1420 moh. Sørøstover mot Nørdre Båtskardet er snittet 41 grader med et parti på 63. Sørsida er slak de første to hundre metrene og faller så 40 til 59 grader mellom 1535 og 1435 moh. Toppartiet ligger mellom dem, og ingen av dem er nedkjøringslinjer på denne turen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'bitihorn';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved gardene på Fretland, 495 moh. Fri Flyt starter ved den vestligste garden; parkeringa ligger øst i tunet, og Stavateig, lenger vest, ligger 346 meter unna. Fri Flyt: «Ta av ved skiltet Fretland og parker oppe ved gardane på egna plassar.» og «Vis omsyn når ein parkerer ved gardane.»

Fri Flyt: «Frå den vestlegaste garden går ein over jordet til stølen Tråna. Herfrå er det ope kulturlandskap opp til tregrensa.» Linja går nordover over jordet og passerer stølen Tråna 69 meter unna ved 0,80 km og Stokksete 81 meter unna ved 1,36 km. Bandene fra 500 til 900 moh måler 9,3 til 13,9 grader, og bratteste parti på turen, 23,8 grader, ligger mellom 691 og 707 moh. Ved 714–723 moh krysser linja 23 meter bakke på 35 grader eller mer, med bratteste celle 42 grader. Skogen slipper ved 860 moh, 1,83 km fra start.

Fri Flyt: «Oppturen følgje den sørlegaste ryggformasjonen oppover. Kring 1050 moh går ein på vestsida av ryggen til ein kjem til toppen.» Bandet fra 900 til 1000 moh er det bratteste, 15,4 grader over 385 meter grunn. Linja er på vestsida av ryggen ved 1062 moh, 2,56 km fra start, og toppen er 230 meter lenger inne. Ved siden av ryggen står celler på 51,9 grader 27 meter nordnordvest for linja ved 1006 moh og 56,3 grader 27 meter sør for den ved 1076 moh — brattere knauser og hyller langs ryggen.',
  description_down = 'Fri Flyt: «Nedfarten frå Tylderingen gjev god utsikt frå ryggen og sola i ansiktet. Ein kan følgje same veg ned som ein har gått opp. Det er mykje ope kulturlandskap slik at ein har god plass til å boltre seg i snøen.»

Toppen er slak mot nord, nordøst og sørvest, 5,5 til 10,3 grader i snitt over 500 meter. Mot vest og nordvest faller den 41,9 og 44,9 grader i bratteste vindu 250 til 370 meter ut, og mot øst 35,6 grader 220 til 280 meter ut. Hold deg på sørsida.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 23,8 grader mellom 691 og 707 moh, og bratteste bandet 15,4 grader fra 900 til 1000. Bakken under linja er 35 grader eller brattere i ett strekk på 23 meter ved 714–723 moh. Fri Flyt graderer turen «Lett», med bratteste punkt under 30 grader og «Farar: Ingen».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Vest-, nordvest- og østsida av toppen er brattere enn ruta — 35,6 til 44,9 grader i bratteste vindu. Fri Flyt om vanskegraden: «Ved spesielle tilhøve (glasert skare eller liknande) kan ei utgliding eller eit fall utgjere ein risiko.» Sørsida er solvendt; Fri Flyt: «ikkje vent for lenge på sesongen før ein tek turen».'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Indre Sogn på varsom.no. Indre Sogn er en A-region og varsles daglig i sesongen. Ta av fra Dalavegen ved skiltet Fretland og parker på egnede plasser ved gardene. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'tylderingen';

update public.tk_tours set
  description_up   = 'Start i Vestby, 559 moh, rett ved Misjonshuset. Ut.no oppgir 558 for samme punkt. Veien inn er fylkesveg 2160 fra Trysil sentrum — ut.no skriver fv 563, som er det gamle nummeret — 17 km og tjue minutters kjøring, og det er skiltet til parkering.

Det bratteste ligger med en gang: 12,5 grader fra 500 til 600 moh over 190 meter grunn, med turens eneste virkelige steg på 18,6 grader mellom 582 og 597 moh. Over det slakner det til 8,0 grader fra 600 til 700 og 8,4 fra 700 til 800, og linja passerer 676 og 801 moh. Alt dette går i skogsterreng.

Skogen slipper ikke taket før på 826 moh, og terrenget er åpent fra 832. Ut.no beskriver overgangen slik: «På toppen åpner terrenget seg, og du har vid utsikt i alle himmelretninger.» De siste 20 høydemeterne måler 5,4 grader fra 800 til 900 moh over 555 meter grunn, og toppen ligger på 854,2 moh mot ut.nos oppgitte 851.',
  description_down = 'Ned samme veien, sørøstover. Den sida måler 5,0 grader i snitt over 400 meter med et bratteste 60-metersvindu på 9,3 — det slakeste av alle åtte retningene fra toppen, og det er den ruta går i.

Det ene stedet fjellet er bratt ligger 400 meter unna og på motsatt kant. Sørvest måler 23,9 grader i snitt med et 49,2-graders vindu 330 til 390 meter ut, og vest 13,0 med 24,5 i 340 til 400. Det er Stygghammeren, og ut.no er tydelig: «Fra Ulvsjøberget er det gammel skilting ned til Stygghammeren, hvor du får flott utsikt over Ulvsjøen. Hit går du på eget ansvar, og vi anbefaler ikke at du tar med små barn hit, da det er en bratt, usikret fjellhylle.»

Under snø er den hylla ikke til å se. Korridoren går ikke dit, og skiltinga som gjør det, er gammel.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '295 høydemeter der bratteste band er 12,4 grader og bratteste steg 17,5. Ruta gir ikke tilbake en eneste høydemeter på 2,14 km. Ut.no fører turen som tough, og det er ikke terrenget som gjør den det — det er at hele stigninga går i skog uten sti å se under snøen.'
    ),
    jsonb_build_object(
      'title', 'Stygghammeren',
      'body',  'Sørvest for toppen måler flanken 49,2 grader i bratteste 60-metersvindu, 330 til 390 meter ut, med 23,9 grader i snitt hele veien. Det er den usikrede hylla ut.no advarer mot, og den ligger utenfor ruta — men den ligger nær nok til at en linje valgt på slump fra toppen kan finne den, og under snø er kanten ikke synlig.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hedmark på varsom.no. Hedmark er en B-region: den varsles bare når faregraden ventes å bli 4 eller 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ut.no fører turen som «Vandringsrute 47» i Trysil kommunes eget fjellturprogram og oppgir sesong mai til oktober; sesongen på kortet er lest ut av at fylkesveg 2160 til Vestby er brøytet hele året. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'ulvsjoberget';

update public.tk_tours set
  description_up   = 'Start på parkeringa på Nordseter, 828 moh — avgiftsplass tagget for ski i OSM, 135 meter fra Nordseter Fjellstue. Ut.no: «På oppkjørte løyper nordover fra parkeringsplassen på Nordseter mot foten av toppen.» Nordsetervegen fra Lillehammer er brøytet hele vinteren, og bussen går dit.

Første to kilometerne er flate — bandet fra 800 til 900 moh måler 2,5 grader over 1655 meter grunn — nordover forbi 897 moh. Så kommer Nevelvatnet, og her er det verdt å vite hvor løypa går: linja runder sørenden på 905 moh og går opp på vestsida på 915. Ut.nos egen løypelinje gjør det samme, og terrengmodellen gir Skog på begge punktene. Går du rett over vatnet, går du på is.

Videre nordvestover over Nevelåsen, 992 moh, der terrenget åpner seg. Bandet fra 900 til 1000 moh måler 4,2 grader over 1395 meter grunn; det bratteste steget ligger her, 17,0 grader mellom 966 og 988 moh. Skogen slipper taket på 966 moh og terrenget er åpent fra 972.

Siste kilometeren måler 4,3 grader fra 1000 til 1100 moh over 1167 meter grunn. Ut.no gir to linjevalg inn mot toppen: «Ta av rett opp mot toppen, som inntegnet eller gå løypa på toppens østside og følg ryggen vestover mot toppen.» På 1090 moh står Nevelhytta — Røde Kors'' åpne bu med ovn og plass til seks–åtte, sjelden låst, restaurert i 2021 — og en siktskive som navngir toppene fra Jotunheimen til Rondane.',
  description_down = 'Ned samme veien, østover. Den sida måler 3,8 grader i snitt over 400 meter med et bratteste 60-metersvindu på 8,5, og vest 3,4 med 8,2. Det er ikke en nedkjøring, det er en retur — og ut.no sier det selv: «det er ikke lenger opp enn at man kan trappe seg fram selv med smale langrennski».

Det bratteste fjellet har å by på ligger mot nord: 11,1 grader i snitt med et 19,3-graders vindu 160 til 220 meter ut. Ingen retning fra toppen har et 60-metersvindu over 20 grader. Faren her er derfor ikke helningen, det er avstanden og likheten: fem kilometer over et løypenett som ser likt ut overalt, og en topp som er det eneste holdepunktet når lyset flater ut. Ut.no peker på at løypa opp til selve toppen ikke er kjørt opp — den siste kilometeren er du alene om sporet.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '268 høydemeter der bratteste band er 4,8 grader og bratteste steg 12,6. Ruta gir tilbake 6 høydemeter på 4,07 km. Det finnes ikke et skredproblem på denne linja, og flankesveipet finner ikke noe rundt toppen heller — 19,3 grader er det bratteste 60-metersvinduet i noen retning.'
    ),
    jsonb_build_object(
      'title', 'Vatnet og lyset',
      'body',  'To ting er verdt å ta på alvor. Det ene er Nevelvatnet: linja går rundt det, sør og vest, fordi løypa gjør det — den første versjonen av den routede linja gikk 180 meter tvers over vatnet på 904 moh, og det er is, ikke mark. Det andre er sikten. Nevelhytta står åpen på toppen nettopp for de dagene, og det er ikke tilfeldig at den er der.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Oppland sør på varsom.no. Oppland sør er en B-region: den varsles bare når faregraden ventes å bli 4 eller 5, så de fleste vinterdager finnes det ingen vurdering å lese. Ta med sender/mottaker, søkestang og spade — på denne turen mest fordi vanen er verdt noe, ikke fordi linja krever det.'
    )
  )
where slug = 'nevelfjell';

update public.tk_tours set
  description_up   = 'Start på den opparbeidede plassen ved fylkesgrensa ved Eldrevatn, 1122 moh, rett ved rv 52 over Hemsedalsfjellet. Fri Flyt sier det så kort som det går an: «Parkér på parkeringsplassen like før Eldrevann og sett kursen mot sørøst. Herfra gir ruta seg selv til toppen av Slettind.»

Den første kilometeren er flat — bandet fra 1100 til 1200 moh måler 4,1 grader over 1132 meter grunn — og så tar flanken til. Fra 1200 til 1300 moh måler den 13,7 grader over 405 meter grunn, fra 1300 til 1400 16,6 over 360, og linja passerer 1325 moh der stigningen er etablert. Ut.no beskriver det samme: «terrenget er jevnt og passe bratt mellom 20-25 grader».

Videre opp fortsetter det med å bli litt brattere for hvert band: 16,1 grader fra 1400 til 1500 moh over 315 meter grunn, og 17,7 fra 1500 til 1600 over 285 — det bratteste på turen. Bratteste enkeltsteget er 22,5 grader mellom 1527 og 1546 moh. Toppen måler 1592,0 moh på terrengmodellen, som er nøyaktig det Fri Flyt publiserer; ut.no fører 1589.',
  description_down = 'Ned nordvestflanken, samme veien. Fri Flyt: «Ta utgangspunkt i ruta opp og legg sporet i den brede fjellsida på vei ned.» Flanken måler 18,0 grader i snitt over 400 meter med et 27,2-graders vindu 110 til 170 meter ut, og den er bred nok til at du kan legge sporet der du vil i den.

Faremomentet Fri Flyt fører opp peker til høyre: «Skredterreng nord for toppen, så ikke dra for langt til skikjørers høyre i starten av nedkjøringen.» Nord måler 13,8 grader i snitt med et 25,7-graders vindu 100 til 160 meter ut, og 11,0 grader i snitt når sveipet går ut til en kilometer — altså reelt skredterreng, akkurat som advarselen sier.

Det bratteste på fjellet ligger likevel til den andre handa. Vest måler 23,9 grader i snitt ut til en kilometer, med et 52,5-graders vindu 660 til 720 meter ut, og sørvest 23,6 med 49,5 i vinduet 360 til 420. Begge faller mot Mørkedalen, langt fra linja ned mot bilen — men de er der, og de er det du kommer inn i om du holder for langt sør på det brede platået i dårlig sikt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '474 høydemeter der bratteste band er 18,6 grader og bratteste steg 20,6. Fri Flyt fører KAST 1 – enkelt med bratteste punkt under 30 grader, ut.no fører easy, og ut.no legger til: «Ingen spesiell skredfare hvis man følger de slake partiene, men det er noen helninger som er over 30 grader.» Linja gir tilbake 4 høydemeter på 2,48 km.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord for toppen er det Fri Flyt advarer mot, og målingen gir dem rett: 25,7 grader i bratteste 60-metersvindu 100 til 160 meter ut. Vest og sørvest er brattere igjen — 52,5 og 49,5 grader i vinduer noen hundre meter ute — og faller mot Mørkedalen. Øst og nordøst er slake: 5,6 og 8,5 grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og blir varslet hver dag i sesongen. Sjekk også at rv 52 over Hemsedalsfjellet er åpen — det er en fjellovergang som kan stenge eller gå i kolonne i uvær, og på denne turen er det været som avlyser dagen, ikke terrenget. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'slettind';

update public.tk_tours set
  description_up   = 'Start i grustaket ovenfor gården Kyrkjebøen, 722 moh. Ut.no forklarer veien dit: i sentrum følger du veien til venstre for Skogstad Hotell, og etter 1,4 km står skiltet mot Kyrkjebønnøse på høyre side — videre bak låven og opp til grustaket. Fri Flyt kaller stedet sandtaket og oppgir parkering ved informasjonsskiltet.

Fra grustaket går traktorveien og sommerstien nordover gjennom skogen. Løypa er merket og svinger bratt til venstre etter om lag en kilometer, opp Gravarbakkane, der linja passerer 1010 moh. Bandtabellen for denne delen er jevn og moderat: 9,7 grader fra 700 til 800 moh over 455 meter grunn, 14,6 fra 800 til 900 over 396, 13,8 fra 900 til 1000 over 414, og 14,0 fra 1000 til 1100 over 393.

Skogen slipper taket på 1107 moh og terrenget er åpent fra 1121. Rett over skoggrensa ligger en liten topp på 1299 moh, og Fri Flyt er tydelig på hva du gjør med den: «gå på vestsiden av den lille toppen rett etter tregrensen. Derfra svinger du igjen østover og følger ryggen opp til toppen.» Linja går 1288 moh på vestsida av den. Det bratteste steget på turen ligger likevel lavt, 30,0 grader mellom 811 og 829 moh, i den første halvkilometeren.

Videre opp ryggen stiger det jevnt til det bratteste bandet, 20,9 grader fra 1400 til 1500 moh over 272 meter grunn, og linja passerer 1465 moh i det. Fortoppen kommer på 1608 moh — den ut.no fører som «den første på 1610 moh». Fra den faller ryggen 20 meter ned i skaret på 1589, og så er det flatt: bandet fra 1500 til 1600 moh måler 4,4 grader over 1306 meter grunn og 1600 til 1700 måler 6,5 over 535. «Den siste delen av ryggen mot toppen er lang og flat», skriver Fri Flyt, og det er 400 meter nordover til varden på 1670,5 moh — 1671 etter begge kildene.',
  description_down = 'Standardnedkjøringa går ikke tilbake samme veien fra toppen. Fri Flyt: «Den vanligste ruta går fra toppen på omlag 1600 moh og vestover ned den store hvite flanken. Skal du ned til bilen, tar du av sørover rett før tregrensen og kommer inn på den samme ruta som oppstigningen.» Vestflanken måler 11,3 grader i snitt over 400 meter og sørvest 12,3 — det er den store, åpne flanken, og det er derfor kortet fører V.

Den alternative renna er en annen sak, og sveipet forklarer hvorfor. Øst fra toppen måler 28,9 grader i snitt med 46,0 i vinduet 10 til 70 meter ut, og nordøst 33,0 med 48,0 allerede fra kanten. Det er renna Fri Flyt gir «500 høydemeter med bratt og fin skikjøring» — og det er samme kant som skavlen står på. Kommer du for langt ned mot elva i Trøimsbotn, sier Fri Flyt at det er «bratt og ulendt terreng for å komme tilbake til stien som leder ned til sandtaket».

Nederst går det gjennom skogen. Fri Flyt beskriver den delen presist: åpen bjørkeskog først, tettere etter hvert, og da er det stien ned til parkeringsplassen som er det beste alternativet.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '1002 høydemeter der bratteste band er 20,6 grader og bratteste steg 26,8. Linja gir tilbake 54 høydemeter, og 20 av dem er skaret mellom fortoppen på 1608 og toppryggen på 1589. Selve oppstigningsruta er ikke bratt; det som gjør turen til en treer er lengden opp fra bygda og at toppryggen er skavlet.'
    ),
    jsonb_build_object(
      'title', 'Skavlen og renna',
      'body',  'Fri Flyt fører to faremomenter og de ligger på samme kant: «Toppskavl og skredfare på den alternative nedkjøringen.» Sveipet fra toppen måler nordøst til 33,0 grader i snitt med et 48,0-graders vindu 0 til 60 meter ut, og øst 28,9 med 46,0 i 10 til 70. Det vil si at kanten faller bratt av med en gang — det er der skavlen bygger seg, og det er der renna mot Trøimsbotn starter. Nord måler 27,5 med 34,2 lenger ute. Vest og sørvest, der standardnedkjøringa går, måler 11,3 og 12,3.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og blir varslet hver dag i sesongen. Ingen av kildene oppgir en sesong for denne turen; kortet fører feb–mai etter naboturene på samme fjellside. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'kyrkjebonosi';

update public.tk_tours set
  description_up   = 'Start ved Lykkjastølen, 939 moh. Ut.no oppgir 941 for samme punktet, og bomavgiften dekker parkeringa — betaling i postkassa ved Ulsåkstølen Fjellstue. Fra bilen ser du fossen et stykke opp i lia, og både Fri Flyt og ut.no sier det samme om den: hold vestsida. Fossen selv er ikke kartlagt noe sted; bekken den kommer i er Nordrestølbekken, som er den eneste navngitte bekken linja går forbi, så navnet er en slutning fra bekken og ikke fra fossen. Veipunktet i korridoren ligger 60 meter vest for bekken, på 1075 moh.

Opp langs fossen stiger det jevnt: bandet fra 900 til 1000 moh måler 12,9 grader over 311 meter grunn, 1000 til 1100 måler 13,6 over 405, og 1100 til 1200 måler 18,6 over 315. Det bratteste steget på hele linja ligger her, 24,2 grader mellom 1249 og 1269 moh. Skogen slipper taket på 1054 moh og terrenget er åpent fra 1066.

Videre følger du dalen — «det faller seg naturlig å følge dalen oppover», skriver ut.no, og Fri Flyt kaller det den naturlige renneformasjonen du går i eller til høyre for. Bandet fra 1300 til 1400 moh måler 20,8 grader over 271 meter grunn — nest brattest på turen, etter bandet under, og linja passerer 1364 moh midt i det. Over det slakner det til 18,3 og 15,4 grader.

De siste 300 metrene går ikke rett fram. Ut.no sin egen linje kommer opp vest for toppen, på 1708 moh, og snur østover langs toppryggen — «så får man toppen i front/til høyre av traséen». Bandet fra 1700 til 1800 moh måler 5,4 grader over 412 meter grunn, som er det flate toppartiet. Varden står på 1741 etter kildene og 1740,3 etter terrengmodellen, og kortet fører målinga.',
  description_down = 'Fri Flyt er kort: «Den enkleste nedkjøringen følger den samme ruta ned som oppstigningen.» Det er sørflanken, og den måler 20,7 grader i snitt over 400 meter med et 25,8-graders vindu 190 til 250 meter ut — samme tall som bandtabellen gir oppstigninga.

Ut.no sier at det finnes brattere og mer krevende nedkjøringer for de erfarne, og sveipet sier hvor de ligger. Øst måler 27,6 grader i snitt med 32,5 i vinduet 90 til 150 meter ut, og sørøst 22,8 med 30,0 lenger ute, 240 til 300. Vest og nordvest er det motsatte — 6,9 og 10,6 grader i snitt — og nord bare 4,5. Vil du ha den bratte linja, ligger den på østsida, og ut.no sitt vilkår står ved lag: «riktig utstyr og erfaring i fjellet, og at forholdene er bra».',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '803 høydemeter der bratteste hundremetersbandet er 20,4 grader og bratteste steg 23,7. Fri Flyt fører turen som KAST 1 – enkelt med bratteste punkt under 30 grader, og målinga er enig. Linja gir tilbake 2 høydemeter på 2,97 km, så det er en ren stigning fra bilen til varden.'
    ),
    jsonb_build_object(
      'title', 'Terrengfellene nederst',
      'body',  'Det eneste faremomentet Fri Flyt fører opp er «terrengfeller i den nedre delen av oppstigningen», og det er ikke en vinkel — det er formen. Renna og bekkedalen du følger opp fra 1075 moh samler snø fra hele lia over, og har ingen vei ut til sidene. Bandet fra 1100 til 1200 moh måler 18,6 grader over 315 meter grunn: nok til at noe over deg kan løsne, og med et samletrau under.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og blir varslet hver dag i sesongen, så her finnes det en vurdering å lese. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'nibbi';

update public.tk_tours set
  description_up   = 'Start ved den brøytede parkeringslomma ved stølsområdet Sildegjerdet, 938 moh. Fri Flyt: «Følg RV52 vestover fra Hemsedal sentrum i 19,5 km og parker i brøytet parkeringslomme på venstre side, 1,5 km etter brua på RV52.» Parkeringa er kartlagt og avgiftsfri. Rv 52 over Hemsedalsfjellet er vinteråpen, men kan gå i kolonne eller stenge i uvær.

De første 885 metrene er flate — 4,1 grader — og linja krysser elva 224 meter inne, der terrengmodellen svarer terrengklasse Elv på 926,1 moh. Så begynner selve oppstigninga gjennom glissen bjørkeskog og inn i den vide dalen til Rupebekken, med korridorpunktet på 1051 moh. Kartverket fører siste skog på 1115 moh og åpent terreng fra 1133. Her ligger det bratte på turen: 18,9 grader fra 1000 til 1100 moh og 20,1 fra 1100 til 1200, som er bratteste bandet, med bratteste steget på 29,0 grader mellom 1164 og 1181 moh.

Over det flater det av til 14,5 grader fra 1200 til 1300 og reiser seg en gang til, 19,3 fra 1300 til 1400. Flata Fri Flyt lover kommer på 1397 moh — hundre meter høyere enn de skriver — og de siste 212 høydemeterne stiger 14,3 og så 7,8 grader over 698 meter grunn til varden.',
  description_down = 'Ned samme veien, nordøstover. Nordøst måler 10,5 grader i snitt ut til en kilometer og øst 14,5, så det er slakt hele veien tilbake. Fri Flyt oppgir at «du kan enten gå ned samme vei eller i rennene du så på vei opp», og rennene er skredterreng.

Toppen er et platå, og det er den viktigste opplysninga om fjellet. Sørvest måler −0,2 grader i snitt ut til en kilometer fordi bakken stiger videre, sørøst 0,6 og sør 3,8. Fra varden ser fire retninger like flate ut, og tre av dem fører ingen steder du vil.

Det bratte ligger langt fra ruta. Nordflanken har et 60-metersvindu på 41,1 grader, men det er 940 til 1000 meter ut — nede der fjellet endelig faller mot dalen. Nærmere varden er det bratteste du finner 26,1 grader mot øst 60 til 120 meter ut og 27,0 mot sør 30 til 90 meter ut.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt fører turen som KAST 1 – Enkelt med bratteste punkt under 30 grader, og skriver likevel at «du beveger deg i skredterreng til du kommer opp på 1300 meter». Begge deler er sanne: bratteste bandet på linja er 20,1 grader og bratteste steg 29,0, men det er lia rundt som er brattere enn linja. Kortet fører turen som grad 2 av den grunnen.'
    ),
    jsonb_build_object(
      'title', 'Sikt',
      'body',  'Fri Flyts andre advarsel handler ikke om snø: «Dersom det er dårlig sikt, er det lite terrengformasjoner å orientere etter. Du trenger god sikt. Mye skredterreng rundt deg.» Flankesveipet sier det samme med tall — sørøst 0,6 grader i snitt, sørvest −0,2, nordvest 2,6 — et platå uten holdepunkt for øyet. Bekkedalen du kom opp er den eneste formen i terrenget som fører tilbake til bilen.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no, en A-region med varsel hver dag i sesongen. Verken Fri Flyt eller artikkelen deres oppgir sesong for dette fjellet; kortets feb–mai er det samme vinduet de tre andre Hemsedal-turene i appen bærer, og det er en slutning. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'raskarfjellet';

update public.tk_tours set
  description_up   = 'Start på den store parkeringa ved Hyndra bru nedenfor Trefta på Lykkjavegen, 893 moh. Plassen er avgiftsbelagt og betales med SMS eller Vipps etter skiltingen på stedet. De første sju hundre metrene deler grunn med preparerte langrennsspor; ruta forlater løypetraseen så snart den begynner å stige. Kryss elva og gå opp lia på vestsida.

Videre nordvestover over det åpne beltet på 1000 til 1100 moh. Bjørka holder til rundt 996 moh, og over 1003 er alt åpent. Både den kartlagte skitur-traseen og den merkede sommerstien går her, 200 til 400 meter nord for selve ryggkammen, på den brede nordøstskuldra — det er den linja som er tegnet, og den er slakere enn kammen.

Ved om lag 1320 moh kommer du inn på foten av østryggen, og den følges hele veien til topps. Stigningen er jevn: bandet fra 1300 til 1600 moh ligger på 19 til 20 grader i snitt, og bratteste hundremeteren, 1500 til 1600 moh, måler 19,7 grader. Toppryggen selv er slak, og de siste 130 høydemetrene til 1729 moh går i 11 grader.

Toppryggen er ofte avblåst og hard. Det er ikke et skredproblem i seg selv, men det avgjør om de siste hundre metrene er behagelige eller ikke.',
  description_down = 'Ned samme veien, østover ned ryggen og lia til Trefta. Fallretningen på nedkjøringa er øst — den fallvektede gjennomsnittsretningen måler 84 grader. Det er den brede nordøstvendte fjellsida under østryggen som er nedkjøringa, og den er også den sida som samler flakskavl etter vestlig vind. Det er den ene vurderingen turen faktisk krever.

Vanligste feil: å ta Skogshornrenna fordi den ser ut som en snarere linje ned. Renna har innsteg på flata på vesttoppen og faller sørover: målt derfra holder sørsida 39,5 grader i snitt med 56 grader på det bratteste, mens nordsida er 9,4. Den er en egen ekspertlinje og skredutsatt — den er ikke normalruta, og den ender ikke der bilen står. Fri Flyt nevner også en renne rett nord fra toppen ned til flata på 1100 moh med retur sørover til parkeringa; det er en variant for dem som vet hva de velger.

Nede igjen kommer du inn på langrennssporet de siste sju hundre metrene. Gå ved siden av det preparerte sporet, ikke i det.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Jevn, bred stigning uten tekniske parti eller trange passasjer: bratteste sammenhengende parti på linja måler 23,2 grader, og bratteste hundremeteren, 1500 til 1600 moh, 19,7 grader i snitt. Den brede nordøstvendte fjellsida under østryggen samler flakskavl etter vestlig vind, og det er nettopp der du kjører ned — så vindhistorien de siste dagene betyr mer enn hellinga på denne turen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skogshornrenna har innsteg på flata på vesttoppen og faller sørover — 39,5 grader i snitt, 56 på det bratteste. Den må ikke forveksles med normalruta, og heller ikke med Fri Flyts nordvariant, som går ned den slake nordsida. Toppryggen er ofte avblåst og hard. Ellers er fjellet bredt og oversiktlig — dette er en tur der feilen du gjør er å velge feil linje ned, ikke å bli overrasket på vei opp.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'skogshorn';

update public.tk_tours set
  description_up   = 'Starten er flata der rv13 topper hårnålssvingene i Halsabakkane og møter Sendo-elva — leirplassen ved Sendo, 766–779 moh på åpen mark. Kildene ser ut til å motsi hverandre her, og terrenget avgjør: Fri Flyts faktaboks sier «Høydemeter: 770», Utemagasinet-versjonen av samme beskrivelsen sier 588 høydemeter fra samme parkeringa — og veien passerer 770 moh nøyaktig der bakkene flater ut. 770 er starthøyden, ikke stigningen; den routede linja samler 620 høydemeter.

Kryss brua over Sendo-elva og hold sørover. Elva du krysser renner østover langs flata og stuper så gjennom fossen ned i Kvassdalen, dalen rv13 kommer opp fra — dalbunnen der nede leser 574 moh. Vest for deg skjærer Finnbu-bekkene juv ned mot elva, med Finnbuene-stølen på vestbredden. Ryggen mellom juvet og Kvassdalen er ruta: det er den Fri Flyt peker på som det sikreste alternativet, og den er den eneste ryggen øst for juvet.

Ryggen er jevn og åpen: 793 moh ved foten, 871 midtveis, 992 der den brer seg ut. Det bratteste hundremetersbeltet på turen ligger her — 13,2 grader i snitt mellom 900 og 1000 moh — og det er fremdeles slakt nok til å gå rett opp i de fleste føre.

På skuldra ved 1090 moh kommer alternativtilkomsten fra Myrkdalen skisenter opp — «etter en times gange», sier Fri Flyt, og møtepunktet er der ryggen flater ut. Videre går linja vestover på den brede flanken: 1146, 1221 og 1302 moh på ryggen mot toppen, med bratteste sammenhengende parti på 23,3 grader underveis.

Varden står på 1357 moh. Terrengmodellen og registeret er enige om at dette er Finnbunuten — det høyeste punktet i massivet, mot publiserte 1358 — og at registeret sitt eget Finnbufjellet-punkt lenger nord leser 1331 og ikke er toppen. Nordover ligger ryggen nesten flat — 2,7 grader i snitt den første kilometeren — og vest- og nordvestsida stuper: hold deg på østsida av varden når det blåser.',
  description_down = 'Sikreste nedfarten er samme vei som opp, sier kilden, og målinga er enig: østflanken du kom opp holder 6,9 grader i snitt fra varden mot nordøst, med 23,7 grader som bratteste 60 m-vindu 650–710 m ut, målt 800 meter fra varden. Fin cruising hele ryggen ned til skuldra, og ryggen videre ned mot Sendo.

Fri Flyt nevner «en rekke nedkjøringsalternativer» uten å beskrive dem, og målingene sier hvorfor linjevalget må være våkent utenfor ruta: vestsida faller 50,3 grader på det bratteste 440–500 m fra varden, og nordvestsida 56,7 grader 420–480 m ut — ned i Finnbugjuvet og juvene vest for ryggen. Sørøstsida måler 28,1 grader 690–750 m ut og østsida 28,4 grader 660–720 m ut, så også de slakere sektorene har heng i seg lenger ute.

Fra skuldra igjen er det ryggen ned til brua og de siste metrene over elva til leirplassen — 34 høydemeter å gi tilbake har turen samlet, så nedfarten er ren.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt setter KAST 1 – Enkelt, og det gjelder ryggen, ikke flankene ved siden av: selve linja har 23,3 grader som bratteste sammenhengende parti og 13,2 grader som bratteste hundremetersbelte, mellom 900 og 1000 moh. Den går i åpent, vindutsatt terreng fra første meter — her finnes ingen skog å gå i le av.'
    ),
    jsonb_build_object(
      'title', 'Nordeggen og juvet',
      'body',  '«Nordeggen har et par utsatte områder hvor ferdigheter og skredfare må vurderes», skriver Fri Flyt — nordeggen er ikke denne ruta, og det må sies, for den ligger rett ved: fra varden mot nord er snittet bare 2,7 grader de første 800 metrene, og det er nettopp det flate som gjør at du havner der uten å velge det. Vest for ryggen samler Finnbujuvet fokksnø — det er derfor fjellet åpner og avslutter sesongen — og vest- og nordvestsida under toppen faller 50,3 og 56,7 grader på det bratteste. I flatt lys er kanten mot juvet den ene tingen å holde styr på.'
    ),
    jsonb_build_object(
      'title', 'Veien',
      'body',  'Tilkomsten er sin egen faktor: rv13 over Vikafjellet er et værutsatt høyfjellssamband, og leirplassen ligger på brøytekanten av det. Fri Flyt kaller tilkomsten lett — og det er den når veien er åpen. Sjekk veimeldingene samme dag, og regn med at det som stenger veien også er været som laster Finnbujuvet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Finnbufjellet ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder for denne turen; kortets jan–apr er lånt fra de andre Voss-turene i appen, og Fri Flyt-indeksen sier at fjellet åpner og avslutter sesongen på Voss — den strekker seg altså i begge ender når snøen ligger. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'finnbufjellet';

update public.tk_tours set
  description_up   = 'Veien inn til Hornslie er bomveg med kortbetaling: fra Hemsedal sentrum følger du rv52 østover mot Gol og tar av mot Torsetstølane, og over skoggrensa tar du til høyre og følger veien til den stopper på parkeringa. Fra Hornslie, der Leinestølvegen ender på 1056 moh, går du rett opp den første bakken. Den er kortere enn den ser ut — den første hundremeteren, 1000–1100 moh, ligger på 18,8° i snitt — og over kanten flater det ut. Her er ingen skog å forholde seg til: hele turen går i åpent terreng.

Over kanten åpner Hødnetjedne-bassenget seg — Horntjerne på Kartverkets kart — og du gir tilbake 45 høydemeter ned mot vannet på 1191 moh. Om vinteren går linja rett over det frosne vannet; sommerstien holder venstre side. På andre sida deler ruta seg i to merkede linjer: én lengre og slakere ut på nordvestskulderen, én kortere og brattere opp østryggen. Denne beskrivelsen følger østryggen.

Fra østryggen er det jevn stigning vestover til toppen, med Veslehødn — Veslehorn på kartet — og hele Hemsedalen i ryggen. Toppflata er liten, og sørkanten ligger nærmere varden enn den ser ut: åtti meter sør for toppunktet faller terrenget 96 høydemeter på tjue meter grunn. Sørøstkanten gjør det samme, 63° over de bratteste seksti meterne, og sørvestkanten 57°. Hold ryggen inn til varden, og hold deg nord for kanten når du står der.',
  description_down = 'Samme vei ned. Østryggen gir jevn, oversiktlig kjøring ned mot Hødnetjedne, og bassenget under er det slakeste terrenget på turen — regn med å stake.

Vanligste feil: å la terrenget dra deg nordøstover mot Veslehødn i stedet for å svinge ned mot Hornslie. Øst for Veslehødn stuper Hydnefossen 155 meter fritt — høydemodellen tar 151 av dem i ett eneste tjuemeterssteg — og under fossen holder terrenget 50° videre ned. Fra vannet går hjemveien sørøstover, og husk de 45 høydemeterne opp av bassenget før den siste bakken ned til bilen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Selve linja er slak. Det bratteste hundremeterspennet er 1400–1500 moh, den siste stigninga mot varden, på 19,0° i snitt; den første bakken opp fra Hornslie ligger på 18,8°. Det bratteste enkeltpartiet ligger mellom 1370 og 1385 moh og måler 25,6° — ingen del av linja passerer 30°.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Toppflata er liten, og bergband rammer den inn mot sør, sørøst og sørvest: 96 høydemeter på tjue meter grunn rett sør for varden, 63° over de bratteste seksti meterne mot sørøst og 57° mot sørvest, med enkelttrinn opp mot 79°. Vestsiden er nesten flat i 260 meter og faller så av i et belte som holder 47° i snitt ned til 1320 moh, 60–70° på det bratteste. Nordvestskulderen er den slake sida, 13° i snitt. Øst for Veslehødn faller fjellsiden 71–76° over de øverste 235 høydemetrene, og Hydnefossen stuper 155 meter fritt ned den. Alt dette ligger utenfor ruta, og der skal det bli.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'storehorn';

update public.tk_tours set
  description_up   = 'Start ved veienden på Ljosnavegen i Brandsetdalen, 510 moh, øst for Voss. De første 726 meterne grunn er tilnærmet flate — bandet fra 500 til 600 moh måler 7,1 grader i snitt.

Følg bjørkeskogen oppover mot nordsida av Middagshovden. Skogen holder til 857 moh, og over det er alt åpent. Kartverket fører terrenget mellom 877 og 957 moh som skytefelt; sjekk skiltinga lokalt før du legger turen dit.

Før toppen av hovden tar du av mot Eggjane. Bratteste hundremeteren på turen ligger her, 1000 til 1100 moh med 18,4 grader i snitt, og bratteste sammenhengende parti måler 24,5 grader mellom 1079 og 1093 moh.

Fra Eggjane på 1179 moh er det halvannen kilometer platå vestover til Storanosi, 1205 moh. Bandet fra 1100 til 1200 moh måler 3,4 grader over 1784 meter grunn — det er den delen av turen som gjør den lang heller enn bratt, og linja gir til sammen 40 høydemeter tilbake underveis.',
  description_down = 'Ned samme veien, nordøstover over platået og ned gjennom bjørkeskogen til Ljosno. Fjellet er kjent for tørrsnø når østavinden har stått på i flere dager, og det er platået og den åpne skogen som holder på den snøen.

Vanligste feil: å ta den østlige renna fra toppen fordi den ser ut som en kortere vei ned. Renna er 30 grader bratt og er en egen vurdering — den er ikke normalruta, og den ender ikke der bilen står.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slak hele veien: bratteste hundremeteren, 1000 til 1100 moh, måler 18,4 grader, og bratteste sammenhengende parti 24,5 grader mellom 1079 og 1093 moh. Platået fra 1100 til 1200 moh ligger på 3,4 grader — det er orienteringa i dårlig sikt, ikke hellinga, som er utfordringa der oppe.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Den østlige renna fra Storanosi er 30 grader bratt og skredutsatt; vurder den for seg om du vil kjøre der. Kartverket fører også terrenget mellom 877 og 957 moh på oppstigninga som skytefelt.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'storanosi';

update public.tk_tours set
  description_up   = 'Fra E16 ved Grotlandsbrua, om lag en kilometer nord for enden av Lønavatnet, tar du av mot vest og kjører Høylandsvegen opp til den nedlagte gården Høyland, 139 moh. Der tar skogsbilveien over. Merk at brøyting helt fram ikke er dokumentert — det er en grusvei til en nedlagt gård, ikke en vinterveg.

Følg skogsbilveien sørvestover til Bergsstølen på 380 moh og videre opp det trange dalføret ved Breiming, 610 moh. Skogen holder til rundt 563 moh og terrenget er åpent fra 583. Det trange partiet ved Breiming er skredterreng — det er det ene stedet på turen der du står i et søkk med sider over deg.

Videre følger du slakeste vei nordvestover mot Svartahorgi, til venstre for det trigonometriske punktet 834, og runder selve Svartahorgi (1037 moh; SSR-punktet ligger 41 meter fra toppen og leser 1029) før du kommer inn på ryggen på om lag 1011 moh. Bratteste hundremeteren på turen ligger mellom 800 og 900 moh og måler 18,6 grader i snitt. På ryggen nordvest for Svartahorgi er linja opptil 1549 meter fra nærmeste kartlagte sti, på 1037 moh — der er det ingen sti å navigere etter.

Ryggen blir fulgt vestover og deretter sørover over punkt 1305 — som ligger på nøyaktig 1305 moh — og opp nordryggen til toppen på 1412 moh. De siste 107 høydemeterne tar 1,1 kilometer grunn, og linja faller 17 meter fra punkt 1305 før den stiger igjen: bred, slak rygg, og ofte avblåst og hard fordi den er vindutsatt. De fleste som går Lønahorgi starter fra toppen av Horgaletten-heisen på om lag 920 moh og har da 490 høydemeter igjen; denne ruta er den lange varianten fra bilveien, og det er også den Fri Flyt kaller den fineste nedturen.',
  description_down = 'Ned samme linja: nordryggen til punkt 1305, østover over Svartahorgi og ned til Breiming og Bergsstølen, og til slutt skogsbilveien ned til Høyland. Fallretninga på nedkjøringa er nordøst. Nederste delen er tynn: snødekket ved Høyland og Bergsstølen er kortvarig, og utpå våren er det verdt å gå av tidlig heller enn å skrape de siste hundre høydemeterne.

Vanligste feil: å tro at Bodegaen er nedkjøringa på denne turen. Den kjente frikjøringssida ligger sørøst på fjellet og mater tilbake i heissystemet i Bavallen — den ender ikke ved bilen din på Høyland. Den dokumenterte varianten fra denne ruta er å ta seg ned i Årdalen fra punkt 1307 ved stabile forhold, og Årdalen er østsida, den bratte delen av fjellet.

Den andre feilen er å bruke det trange dalføret ved Breiming som nedkjøringslinje uten å tenke på hva som ligger over. Store svaskred løsner sent på våren her og går langt.

Appens rute er den kilden kaller den andre. Faktaboksen fører to startsteder — «Voss Fjellheiser, øverst i Horgaletten, eller den nedlagte gården Høyland sør for Tvinne» — med hver sin tid, «2 timer fra Horgaletten, 4 timer fra Høyland», og OPP-teksten er tydelig på hva folk faktisk gjør: «De aller fleste besøkende velger å benytte seg av heissystemet. Øverst i Horgaletten-heisen, ved rundt 920 meters høyde, er det bare å feste feller under skiene. Deretter labbe i vei langs de tydelige stakene som leder langs Vådalseggi til topps.» Den ruta ligger nå på kortet. Startstedet er toppstasjonen på Horgaletten-trekket, 948 moh — ikke en parkeringsplass, men et startsted du kommer til med heis, slik Reinheim, Bjørnhollia og Trollheimshytta er startsteder du kommer til på ski. Derfra 506 høydemeter på 3,66 km: opp fra heisen på 979, over Vådalseggi på 1051, inn på den merkede ruta på 1088 og videre langs stakene på 1164, 1284, 1344 og 1378 til varden. Mot normalrutas 1301 høydemeter på 6,46 km er det under halve turen, og det bratteste 30-metersvinduet er 24,4 grader mellom 1025 og 1041 mot 28,9. Ruta gir tilbake 42 høydemeter der ryggen dukker.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja er teknisk enkel: bratteste sammenhengende parti måler 28,9 grader og bratteste hundremeteren, 800 til 900 moh, 18,6 grader i snitt. Det trange dalføret ved Breiming er det ene stedet ruta går inn i skredterreng, og det er også der den er smalest. Ryggen fra punkt 1307 og opp er bred og slak mot vest — under én grad de første fire hundre meterne — men den er samtidig vestkanten av Årdalsida: øst for linja måler flanken 33 grader i snitt over fire hundre meter, med 48 til 52 på det bratteste. Ryggen er vindutsatt og ofte avblåst, og da ligger snøen den har mistet på nettopp den lesida.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Østsida ned mot Årdalen er den bratte delen av fjellet, og ruta følger kanten av den på den siste kilometeren, og store svaskred løsner der sent på våren og går langt. Årdalen ligger nordøst for toppen på om lag 930 moh og er en dokumentert nedkjøring for dem som velger den med åpne øyne — ikke en snarvei hjem. Snødekket nede ved Høyland og Bergsstølen er tynt og kortvarig.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'lonahorgi';

update public.tk_tours set
  description_up   = 'Følg veien til Selheim gård, betal bomavgiften og krabb bratt opp til Tverrberg «eller til egnet stoppested nær snøkanten», slik kilden sier — den kartlagte parkeringa leser 383 moh, men snøkanten avgjør hvor turen faktisk begynner, og en lavere start legger høydemeter på. Til fots videre: Tverrbergsvegen fortsetter sørover til veidelet på 475 moh, der Øvraset-vegen tar av østover.

Øvraset-vegen bærer deg inn Budalen: 533 moh underveis, Øvraset på 639, og dalbunnen på 670 — myr og glissen skog der dalen åpner seg. Veien slutter og stølsterrenget tar over opp til Nyestølen på 707 moh. Registeret har 27 Nyestølen-er; denne er den i Budalen.

Fra Nyestølen tar du rett nord etter skoggrensa, slik kilden sier — skogen slutter på 822 moh etter Kartverkets klasser. Det bratteste på hele turen ligger under den grensa, ikke over: hundremetersbeltet mellom 700 og 800 moh måler 13,3 grader i snitt, og det bratteste sammenhengende partiet — 21,9 grader — ligger mellom 738 og 756 moh, i skogen rett over stølen. Over skoggrensa slakker det til 11,2 grader opp mot eggen, og da er det linjevalget i det småkuperte, ikke bratthenget, som krever vettet.

Opp på eggen vest for Rjupetjørnane, slik kilden råder til: linja går opp på 978 moh, følger eggen over 1031, og passerer tjernene — de ligger på 1089 — på nordsida i åpent terreng på 1103 moh. Derfra østover: platået bærer deg over 1215 mot toppen.

Varden står på 1302 moh, mot publiserte 1303. Registeret har to Vatnaknausen-punkt — Topp og Berg, det siste på 1199 — og toppsøket klatret fra Topp-punktet de siste metrene. Utsikten over Voss er grunnen til at turen fins.',
  description_down = 'Samme vei ned, sier kilden, og den selger solnedgangen — turen er vestvendt, og ettermiddagssola mykner snøen hele veien hjem. Vær klar over hva det betyr: det som er mykt klokka fire, gjenfryser når sola går ned, og vestvendte heng endrer seg raskest akkurat da.

Nedkjøringa begynner vestover av platået, for rett ved varden stuper det i de andre retningene: østsida faller 40,6 grader bare 50–110 m ut, sørøstsida 46,7 grader 40–100 m ut, og nordøstsida 43,8 grader 340–400 m ut. Knausen i navnet er reell — hold vest til du er nede på eggen igjen.

Fra eggen samme vei tilbake: ned flanken til Nyestølen, og veikjeden ut Budalen til Tverrberg. 60 høydemeter å gi tilbake har turen samlet, det meste i småkuperingen på platået og veiens egne slakker.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyt setter KAST 2 – Utfordrende med den begrunnelsen kilden selv gir: «En del brattere småkupert terreng», der innsatsen ligger i å legge sporet under 30 grader. Målingen av den valgte linja sier hvor det bratteste faktisk ligger: hundremetersbeltet 13,3 grader mellom 700 og 800 moh og det bratteste sammenhengende partiet 21,9 grader mellom 738 og 756 — begge under skoggrensa på 822, mellom Nyestølen og skogkanten. Flanken opp mot eggen måler 11,2 grader. Det er linjevalget, ikke linja, som er utfordringen — går du utenom, finner du fort 30-gradersheng i det småkuperte.'
    ),
    jsonb_build_object(
      'title', 'Toppknausen',
      'body',  'Fra varden faller det brått i tre retninger: 40,6 grader mot øst bare 50–110 m ut, 46,7 mot sørøst 40–100 m ut, og 43,8 mot nordøst 340–400 m ut. I god sikt er det åpenbart; i skodde er den flate østsektoren — snittet mot øst er −0,3 grader de første 800 metrene fordi platået fortsetter — en felle som leder deg ut på kanten. Kompasskurs vestover fra varden, alltid.'
    ),
    jsonb_build_object(
      'title', 'Vestvendt',
      'body',  'Hele fjellsida turen går i vender mot vest og sørvest. Det gir solmyk snø om ettermiddagen og solnedgangen kilden selger turen på — og det gir også daglig gjennomvæting og gjenfrysing utover våren. Vurder tidspunktet som en del av linjevalget: flanken under skoggrensa er brattest, og platået over får sola sist.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Vatnaknausen ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesongmåneder for denne turen; kortets jan–apr er lånt fra de andre Voss-turene i appen, og guiden sier det. Bomveien til Tverrberg har avgift. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'vatnaknausen';

update public.tk_tours set
  description_up   = 'Start ved den kartfestede parkeringa ved brua over Raundalselvi ved Skiple, 398 moh, omtrent tjue kilometer øst for Voss. De første 1490 metrene grunn er tilnærmet flate — bandet fra 300 til 400 moh måler 0,8 grader — og ruta krysser elva tidlig.

Følg traktorveien forbi Horndalsbruni og inn i Horndalsbotnen på 757 moh. Skogen holder til 781 moh, og i den øvre lia mot Bjørnsetstølen er det skredbaner; hold deg i skogen der nede.

Fra botnen stiger ruta mot skuldra. Bandet fra 900 til 1000 moh måler 16,9 grader og 1000 til 1100 moh 21,4, som er bratteste hundremeteren. Bratteste sammenhengende parti på hele turen ligger her, 31,4 grader over tretti meter mellom 1093 og 1116 moh.

Over skuldra på 1153 moh flater det ut en stund, 13,3 grader fra 1100 til 1200 moh, før den siste kneika: 20,6 grader fra 1200 til 1300 moh, og deretter jevnere terreng til varden på 1462.',
  description_down = 'Ned samme veien, nordover gjennom Horndalsbotnen og ut den flate innmarsjen til Skiple. Fallretninga er nord, og fjellet holder derfor kaldt føre lenge — det er også grunnen til at det sjelden er vårføre å hente her.

Vanligste feil: å legge nedkjøringa i den øvre lia mot Bjørnsetstølen fordi den ser åpen ut. Der er det skredbaner. Den andre er å undervurdere innmarsjen: 1490 meter tilnærmet flat grunn er tungt å gå tilbake i myk snø, og turen er lengre enn høydemetrene tilsier.

Kilden fører to startsteder, ett på hver side av fjellet: «Oppstigningen fra nord starter ved Skiple i Raundalen, snaut tjue kilometer øst fra Voss. Oppstigningen fra sør starter i Skaftedalen.» Og den sier hvorfor: «Det er to gode utgangspunkt for denne turen, et på den skyggefulle nordsiden, og et som ligger solvendt mot sør.» Appens rute er nordruta; sørruta ligger nå ved siden av den. Fra enden av Skaftedalsvegen på 486 moh går linja i slakt terreng nordøstover opp dalen forbi 662 og 766 til stølen Skytjeset på 882 — kildens «omtrent 890 moh» — og derfra på ryggformasjonen over 1063, flanken på 1249 og 1368 til topps. 1022 høydemeter på 6,13 km mot 1124 på 6,02 km fra Skiple: nesten samme tur, motsatt sol. Skogen slipper på 758 moh etter 2,91 km, mot 781 på nordruta. Bratteste hundremetersbeltet er 19,5 grader fra 900 til 1000 moh, og bratteste 30-metersvinduet 33,2 mellom 1211 og 1231, mot 31,4 på nordruta. Kilden gir et valg øverst — enten det bratte, markerte dalsøkket eller ryggformasjonen og flanken; linja her er ryggen, som er den kilden beskriver helt til topps.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Flat innmarsj, jevn midtdel og en bratt kneik til slutt. Bratteste hundremeteren, 1000 til 1100 moh, måler 21,4 grader, og bratteste sammenhengende parti 31,4 grader mellom 1093 og 1116 moh. Hele fjellsida er nordvendt.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Den øvre lia mot Bjørnsetstølen er skredbaner — det er det stedet på turen der du skal holde deg i skogen heller enn i det åpne. Fri Flyt beskriver også en sørlig start fra Skaftedalen via Skytjeset; det er en annen rute på det samme fjellet, ikke et alternativ midtveis.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'horndalsnuten';

update public.tk_tours set
  description_up   = 'Fra p-plassen ved Rv7 på Haugastøl, 1007 moh, følger du den kvista DNT-vinterruta mot Raggsteindalen nordover. De første elleve kilometerne er innmarsj: over stigninga på 1212 moh, ut på flatene under Folarskardet på 1326 moh, og i alt rundt 600 høydemeter fordelt så tynt at bandet mellom 1200 og 1300 moh måler 2,1 grader i snitt. Det er stakelende, ikke skinnlende. Underveis går linja over is tre ganger: Tjørngravtjørni på 1098 moh to ganger, 135 og 45 meter, og et navnløst tjern på 1230 moh på 45. Ingen av dem er regulerte og ingen kryssing går mer enn 48 meter fra land — det er små høyfjellstjern den kvista ruta går tvers over — men på en tur der resten av innmarsjen er fast mark er de verdt å vite om.

Ved Lordehytta i Folarskardet, 1620 moh, går du av merkinga. Hytta er fra 1880 og står i selve skaret; tjørna like ved ligger på 1603 moh og er vatn under snøen — linja går 270 meter over den, opptil 84 meter fra land, og det er den fjerde og lengste iskryssinga på turen. Rutebeskrivelsen sier at du forlater merkinga ved tjørna og følger varder oppover, og det er den linja som er tegnet her — ikke rettlinja fra hytta mot toppen, som måler 40,3 grader som verste steg.

Trinnet ut av skaret er turens eneste bratte parti: 35 til 40 grader, målt til 36,7 grader over 41 meter på den slakeste ramma noen finner. Linja skrår over trinnet i stedet for å ta det rett på, og leser derfor lavere: 29,2 grader over det bratteste 30-metersvinduet, mellom 1775 og 1795 moh. Bandsnittet på 18,7 grader for 1700 til 1800 moh er et snitt over 337 meter grunn og skjuler trinnet helt. Er snøen hard eller avblåst, er det her folk tar på seg stegjern.

Over trinnet, på om lag 1830 moh, flater det ut igjen, og de siste 702 metrene går vest-sørvestover — peiling 253 grader — opp til toppen på 1932 moh, jevnt fra 0,5 til 17,5 grader. Merk at varden i rutebeskrivelsene står på nordøsttoppen: 1927 moh, 821 meter unna på peiling 36 grader, med et skar på 1900 moh imellom. Terrengmodellen gir 1932,2 på toppunktet og 1927,3 på nordøsttoppen, mot 1933 i den førte høyden. Toppplatået er åpent og har lite å navigere etter.',
  description_down = 'Ned samme vei: over kanten av trinnet, ned ramma til Lordehytta, og deretter de elleve kilometerne tilbake til Haugastøl. Nedkjøringa er sørvendt — fallvektet gjennomsnittsretning er 154 grader — men den er også kort. Under skaret er det lang, slak transport, og har du motvind på flatene tar hjemveien like lang tid som innmarsjen.

Vanligste feil: å gå ut på nordsida av skarvet for å finne en bedre linje ned. Skavlene på nordsida henger langt ut over Raggsteindalen, og kanten er ikke synlig fra platået i flatt lys. Den andre feilen er å undervurdere værvinduet: turen er ikke bratt, men den er lang, og en snuoperasjon på toppplatået i dårlig sikt betyr elleve kilometer igjen i motvind.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Trinnet opp fra Folarskardet er 35 til 40 grader og er det eneste virkelige skredterrenget på turen. Linja som er tegnet går over trinnet, ikke utenom det. Tallene for den — 27,2 grader som bratteste parti, 18,7 i snitt for bandet 1700 til 1800 moh — gjelder sporet og ikke ramma: linja skrår over trinnet, mens fallinja der måler 36,7 grader over 41 meter. Bommer du på ramma, måler nærliggende linjer 40 til 46 grader. Trinnet kan også være avblåst og isete, og da er det stegjern og ikke skredvurdering som er problemet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skavlene på nordsida av Hallingskarvet henger langt ut over Raggsteindalen, og toppplatået er åpent og navigasjonskrevende i dårlig sikt — det er lett å gå mot en kant du ikke ser. Vestsida er Hellevassfonn og Finse-traversen, en annen rute enn denne. Den lange innmarsjen gjør at været betyr mer enn hellinga: elleve kilometer er langt å snu på.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'folarskardnuten';

update public.tk_tours set
  description_up   = 'Start på parkeringa nederst i Havsdalen, 963 moh — tre avgiftsplasser ved siden av hverandre, alle med access=yes i OSM. Ut.no tegner turen sin fra toppen av skisenteret, 1070 moh, som er lettvint hvis heisen går; korridoren her starter der bilen står, og det er forskjellen mellom de to startpunktene som gjør at høydemeterne på kortet er større enn ut.nos oppgitte 855. Skogen slipper taket på 1048 moh og terrenget er åpent fra 1051.

Fra 1058 moh er du inne på den merkede løypa vestover. Ut.no: «følg merket løype til Prestholtseter (åtte km). Løypa blir tråkket daglig og er følgelig i meget god standard med både klassisk- og skøytespor.» Det er en flat innmarsj i ordets rette forstand — bandet fra 1000 til 1100 moh måler 3,3 grader over 1711 meter grunn, 1100 til 1200 måler 4,6 over 1216, og 1200 til 1300 måler 1,3 over 5130. Linja passerer 1240 moh og holder det nivået i fem kilometer.

Prestholtstølan ligger på 1243 moh, rett under sørsiden av skarvet. Herfra begynner turen på nytt: 16,3 grader fra 1300 til 1400 moh over 315 meter grunn, 17,2 fra 1400 til 1500 over 316, og 17,6 fra 1500 til 1600 over 315 — det bratteste bandet. Det bratteste steget på hele linja ligger lavere, 24,8 grader mellom 1323 og 1344 moh. Det er Prestholtskardet, og registerpunktet for skardet måler 1640 moh.

Oppe på skarvet slakner det brått: 10,3 grader fra 1600 til 1700 moh over 540 meter grunn, 7,1 fra 1700 til 1800 over 855, og 4,2 fra 1800 til 1900 over 742. De siste to kilometerne går vestover over vidt, åpent platå til det høyeste punktet, 1860,4 moh. Registerpunktet for Prestholtskarvet ligger 550 meter nordøst, mellom to topper som måler 1860,4 og 1857,5; ut.nos egen linje ender 20 meter fra den høyeste, og det er den kortet fører.',
  description_down = 'Ned samme veien: vestover platået, ned Prestholtskardet og ut løypa. Sørflanken er den kortet fører, og den er ikke slak — sør måler 18,1 grader i snitt ut til halvannen kilometer med et 51,1-graders vindu 925 til 975 meter ut, sørøst 14,7 med 66,0 i vinduet 1225 til 1275, og sørvest 11,2 med 49,3 i 475 til 525. Det er veggen over Prestholt, og Prestholtskardet er det ene stedet den brytes.

Intuisjonen om at stupet må ligge på den andre siden er feil her. Nord måler 2,0 grader i snitt ut til halvannen kilometer med et bratteste 60-metersvindu på 6,6, og nordøst 4,3 med 12,0 — skarvet fortsetter bare. Innafor 400 meter av toppen er hver eneste peiling under 10 grader. Det er et platå, og faren på det er ikke helning, det er sikt: du står på 1860 moh med tolv kilometer hjem og ingen holdepunkter.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '963 høydemeter der bratteste band er 22,0 grader og bratteste steg 25,2, begge i Prestholtskardet. Ruta gir tilbake 66 høydemeter på 11,63 km. Ut.no fører turen som krevende skitur og 21,6 km tur/retur fra heistoppen, og skriver at den «blir oftest gått utpå seinvinter/vår når snøen har satt seg» — det er skardet den setningen handler om.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Sørveggen under skarvet måler 66,0 grader i bratteste 60-metersvindu mot sørøst, 51,1 mot sør og 49,3 mot sørvest. Du kommer opp gjennom det ene bruddet i den. Vest for toppen ligger et trinn på 30,1 grader 425 til 475 meter ut. Nordover er platået flatt så langt sveipet går, men kanten er der et sted, og i flatt lys finner du den før du ser den.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og varsles hver dag i sesongen. Ut.no fører sesongen januar til april og kaller turen overkommelig i godvær for alle med noe langrennserfaring — «i godvær» er den delen som bærer setningen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'prestholtskarvet';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Vikerkoia på Vikerseterveien, 661 moh — Kartverket klasser punktet som myr, og det er en presis beskrivelse av Vikerfjell. De første høydemeterne er slake, 4,9 grader fra 600 til 700 moh, før skogen tar over ved 698 moh.

Stigningen opp mot Svarttjernskollen er den bratteste på turen: 14,9 grader fra 700 til 800 moh over 384 meter grunn, med bratteste sammenhengende parti 24,9 grader mellom 767 og 788 moh. Skogen slipper allerede på 857 moh etter 1,04 km, og fra 872 er du ute i åpent terreng.

Svarttjernskollen ligger på 1054 moh, og ut.no oppgir 1054 — det er kontrollen på at du er på rett rygg. Herfra ser du Vikerfjellplatået i sør og Gyranfisen i vest. Så går det ned igjen: linja passerer 966, 913, 896 og 940 moh, og Kartverket klasser flere av dem som skog. Du er under tregrensa på nytt, midt i turen.

Venekollen, 982 moh, passeres på høyre hånd, og waypointet i korridoren ligger vest for toppen på 949 moh, der ruta faktisk går. Fra bunnen av søkket stiger det jevnt igjen — 4,3 grader fra 1000 til 1100 moh over 1127 meter grunn, og 8,0 grader det siste bandet — til varden på 1127 moh. Treknatten, 1098 moh, ligger 4,20 km nord-nordvest, på peiling 340.',
  description_down = 'Ned samme veien, sørøstover, og du skal opp igjen underveis. Det er turens egenart: 200 høydemeter gitt tilbake på veg opp betyr 200 høydemeter å klatre på veg ned, og det er verdt å ha spart krefter til dem.

Fjellet er slakt i alle retninger. Radialmålinger fra varden gir 4,8 til 12,6 grader i snitt over 500 meter, og bratteste 60-metersvindu på hele toppen er 29,9 grader mot nordøst, 410 til 470 meter ut. Vestsida — den mot Vidalen — måler 5,7 grader i snitt helt ut til halvannen kilometer, med bratteste vindu 20,9 grader. Stupene du ser den veien tilhører Bukollen, Gråfjell og Storrustefjell på andre sida av dalen, ikke fjellet du står på.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slakt terreng med én kneik: 14,9 grader fra 700 til 800 moh over 384 meter grunn, og bratteste sammenhengende parti 24,9 grader mellom 767 og 788 moh. De andre bandene måler 2,1 til 10,5 grader i snitt. Skredfaren er lav; det som kan gå galt er lengden, søkket og at siste stykket opp er umerket.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Ingen retning fra varden måler over 12,6 grader i snitt de første 500 meterne. Ryggen fra Svarttjernskollen er avblåst i vind, og søkket mot Fjelldalen og Steintjern må krysses begge veger. Løypene til Gyranfisen og Treknatten blir kjørt bare når forholdene tillater det og prioriteres i vinter- og påskeferien — utenom det er ruta usporet myr og fjell. Deler av området ligger i Vikerfjell naturreservat. Over ryggen fra Svarttjernskollen går linja sin egen veg, opptil 443 meter fra den kartlagte løypa ved 1039 moh — der er løypa ikke noe å navigere etter.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'gyranfisen';

update public.tk_tours set
  description_up   = 'Fra avgiftsparkeringen øverst på Tjoflotvegen, 276 moh, følger du traktorveien et kort stykke før stien tar over. Regn med å bære ski gjennom skogen: skoggrensa ligger på 580 moh, og de fleste spenner dem først på oppe ved Vindhovden.

Skogen er det bratteste partiet før flanken. Fallinja mellom 335 og 405 moh måler 30° i snitt og tar 51° over de bratteste seksti meterne; stien tar den i svinger — ingen hundremeter i skogen holder mer enn 21° — og topper på 26° mellom 461 og 478 moh. Følg svingene — det finnes ingen snarvei her som lønner seg.

Ved stølen Vindhovden på 586 moh åpner det seg. Herfra følger du sørvestsida østover mot toppen, langs skulderen under ryggen. Rundt 900 moh strammer det til: spennet 900–1000 moh ligger på 24,3° i snitt og 1000–1100 på 19,0°, og det bratteste enkeltpartiet på linja, 28,2°, ligger her, mellom 902 og 920 moh. Grunnen blir samtidig steinete.

Over 1100 moh slakner linja igjen, og de siste høydemeterne er rolig terreng inn mot toppen. Men hold linja: noen titalls meter sør for deg ruller skulderen over. Ved 1146 moh faller sørsida 40° i snitt de neste 340 høydemeterne, med et enkelttrinn på 66°. Nord for linja er det motsatt — der slakner det ut i 2–5°, og det er den sida som lurer deg av ruta.',
  description_down = 'Flanken kjører like godt ned som den går opp: over 650 sammenhengende høydemeter fra toppen til Vindhovden, med fjorden foran deg hele veien. Du har bredde å velge i, men ikke ubegrenset — et par hundre meter sørover ruller skulderen over i 35–40°.

Vanligste feil: å følge fallinja. Tåka legger seg ofte på toppen her, og i flatt lys trekker den deg sørover av skulderen, ned i 35–40° med trinn opp mot 57°. Retter du for mye tilbake, havner du i det slake nord for linja — der ligger Hamreskredane, 530 meter nord for ruta på 758 moh, og under den faller terrenget 33° videre mot Granvinsfjorden. Sikt på Vindhovden, og hold høyden på skulderen hele veien ned.

Under Vindhovden er kjøringen over. Skoggrensa på 580 moh er der skiene går på sekken, og de siste drøyt 300 høydemeterne ned til Tjoflot går på beina, i de samme svingene du kom opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Ruta stiger 968 høydemeter på 3,75 km, og den bratteste delen ligger mellom 900 og 1100 moh: 24,3° i snitt over det første hundremeterspennet, 19,0° over det neste. Det bratteste enkeltpartiet på linja måler 28,2° og ligger i dette spennet, mellom 902 og 920 moh. Lenger nede, i skogen under Vindhovden, tar stien lia i svinger og topper på 26,3° mellom 461 og 478 moh. Begge er bratte nok til at snø kan løsne, og hver av dem bør vurderes for seg.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Det bratte ligger sør for linja, ikke nord. Målt fra ruta faller sørsida 28–40° i snitt over de første fire hundre meterne på hvert eneste punkt fra Vindhovden opp til 1146 moh, med 42–57° over de bratteste seksti meterne — brattest øverst, der linja selv er brattest. Nord for linja slakner det ut i 2–17°, og det er den sida som lurer: fem hundre meter nordover ligger Hamreskredane på 758 moh, og fra den faller terrenget 33° i snitt mot Granvinsfjorden. I skogen under Vindhovden måler fallinja 30° mellom 335 og 405 moh, med 51° over de bratteste seksti; stien går utenom i svinger.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Oksen ligger i varslingsregion Voss, ikke Hardanger. Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'oksen';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Ustaoset, 989 moh. Ut.no tegner turen sin fra et punkt 320 meter lenger nord, oppe i hyttefeltet på 1005 moh; plassen som er kartlagt i OSM ligger nede ved veien, og det er den korridoren bruker. Rv 7 forbi Ustaoset er vinteråpen, og det går tog til stasjonen 692 meter nordvest.

Første kilometeren er nesten flat — bandet fra 900 til 1000 moh måler 0,9 grad over 906 meter grunn — forbi setra Sisseldalen og sørover. Så tar det seg litt opp: 4,5 grader fra 1000 til 1100 moh over 1238 meter grunn. Linja passerer 1104 moh vest for Måfådalen. Skogen slipper taket på 1070 moh og terrenget er åpent fra 1078.

Over tregrensa kommer den ene stigninga som fortjener navnet: 9,7 grader fra 1100 til 1200 moh over 614 meter grunn. Ut.no beskriver det samme fra den andre siden — «før Tindevatnet starter en jevn stigning». Linja passerer vatnet på østsida, 1317 moh, og over det slakner det igjen til 7,4 og 4,9 grader.

Den siste kilometeren er slak rygg til varden på 1376 moh, med det bratteste steget på hele turen underveis: 18,5 grader mellom 1343 og 1355 moh. På toppen står to varder. Den lille har en metallplate med piler og stedsnavn; den store er fra 1899, verneverdig, og ble brukt som trigonometrisk punkt — ut.no ber deg uttrykkelig la være å legge på stein.',
  description_down = 'Ned samme veien mot nord. Nordflanken måler 9,9 grader i snitt over 400 meter med et 15,2-graders vindu 70 til 130 meter ut, og nordvest 10,8 med 22,2 i vinduet 90 til 150. Det er slakt nok til at nedkjøringa er en tur og ikke en linje, og det er også hele poenget med fjellet: bergen365 kaller det en topptur for tidlig og sein sesong, når snøen blir varm og våt lenger vest.

Ingen retning fra toppen er bratt. Det bratteste 60-metersvinduet i hele sveipet er 28,9 grader mot sørøst, 110 til 170 meter ut, og sørvest måler 27,5 i vinduet 160 til 220. Snittet ligger mellom 8,8 og 13,0 grader i alle åtte retninger.

Turen kan også gjøres fra den private turisthytta Tuva i sør, som ut.no oppgir til halvannen time opp mot drøyt to fra Ustaoset. Bergen365 beskriver en tredje variant, fra dammen på Ustevatnet via Verpestølvegen, med rundt 400 høydemeter.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  '416 høydemeter der bratteste band er 9,7 grader og bratteste steg 18,5. Ruta gir tilbake 29 høydemeter på 4,38 km. Ut.no fører turen som moderate og barnevennlig. Det er ikke helningen som er problemet her.'
    ),
    jsonb_build_object(
      'title', 'Det som faktisk er farlig',
      'body',  'Bergen365 navngir tre ting på denne ruta, og ingen av dem er en vinkel: skjult vassdrag under snøen fra bekkene som krysser lia, ustabil vindtransportert snø over tregrensa, og terrengfeller. De skriver at skredvurdering hører hjemme her selv om hellingene er moderate, og at vær og vind skifter raskt på dette nivået. Ut.nos sommerbeskrivelse nevner tett vierkratt og myrete partier i lia — under snø er det samme sak: ujevnt underlag og åpne bekker.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Hallingdal er en A-region og varsles hver dag i sesongen. Ingen av ut.no-beskrivelsene er vinterbeskrivelser — begge fører sesong mai til oktober — så sesongen på kortet er lest ut av bergen365 og løypesesongen på vidda, ikke av en kilde for denne ruta. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'ustetind';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved støls- og hyttetunet i Fitjadalen, 272 moh, om lag åtte kilometer fra Øystese. Oppstigninga begynner ved gangbrua over elva Kjølo og følger i hovedsak sommerstien — først gjennom granskog i knudrete terreng, så over en flate, og opp en li der Fri Flyts egen advarsel gjelder: «stygge skrenter i skogen». Beltene måler 14,9 grader fra 300 til 400 moh og 17,0 fra 500 til 600, og stien er der av en grunn — den går utenom skrentene.

Skogen slutter på 676 moh etter Kartverkets klasser, med åpent område fra 686, og like over kommer du inn i dalføret som leder til Håsete — stølen ligger på 754 moh der registeret har den, mot de «rundt 800 meter» kilden oppgir. Herfra holder du nordvestover med jevn stigning: beltet fra 800 til 900 moh er turens bratteste med 17,4 grader i snitt over 348 meter grunn.

Den vesle skihytta står på 1109,8 moh målt — Fri Flyt kaller den «omtrent 1000 moh», westcoastpeaks «the hut at 1100 m», og terrengmodellen avgjør. Fra hytta går normalveien nordover opp i skaret mellom Glynt og selve toppen. Det bratteste sammenhengende partiet på linja ligger her, 28,2 grader mellom 1158 og 1182 moh, før skaret slipper deg opp på skuldra.

Fri Flyt nevner også en alternativ oppstigning fra skihytta: sommerstien på et system av skråhyller og opp en liten kneik over kanten. Kilden advarer selv mot den ved hardt føre eller vestvendte skavler, og Westcoastpeaks anbefaler isøks og stegjern på de samme hyllene vinterstid, og legger til at i isete forhold trengs isøks og stegjern også for å komme ned fra selve toppen. Korridoren her er skaret, ikke hyllene, men isøksa gjelder toppen like fullt.

Skuldra der sommerstien krysser, 85 meter nord for varden, måler 1300,6 moh, og de siste meterne sørover til varden er lett terreng, akkurat slik kilden sier — beltet fra 1300 til 1400 måler 6,4 grader. 1320 moh, med Hardangerfjorden foran deg — Fri Flyt skriver at fjellet «stuper rett i Hardangerfjorden», men nærmeste fjordvann ligger 8 km unna ved Øystese, og terrenget 3 km vest og sørvest for varden står fremdeles i 550 til 800 moh.',
  description_down = 'Terrenget fra toppen ned mot Håsete innbyr til variasjoner over oppturen — det er Fri Flyts egne ord, og sørøst- og sørsveipene fra varden måler 38,9 og 39,5 grader i sine bratteste 60 m-vinduer 580 til 720 meter ut, så det fins bratt skikjøring å hente. Sent på våren nevner kilden bollene og ryggene litt østover fra varden, fremst på kanten og derfra mot Håsete.

Det som ikke skal kjøres, er vest og sørvest fra varden: vestsida faller 49,0 grader bare 10 til 70 meter ut, og sørvestsida 45,4 grader 160 til 220 meter ut. Nordvest er heller ikke veien hjem — den faller 49,8 grader i snitt de første tjue meterne og 34,8 ut til 160, og de 7,0 gradene over 800 meter er bare fallet ned i skaret jevnet mot stigninga opp igjen mot Glynt. Skuldra du kom opp ligger rett nord, og måler 17,5 grader i snitt de første 400 meterne — fra varden ser de to sidene like ut i flatt lys, og de er det ikke.

Fra Håsete er rådet fra kilden å følge omtrent samme veien som opp: «lett å kjøre seg fast i kronglete terreng» er Fri Flyts formulering om skogslia, og skrentene som formet veien opp, finnes fremdeles under deg.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyts faremoment er «Skredfare i øvre del. Stygge skrenter i skogen.» Den øvre delen er flanken fra Håsete til skaret — bratteste beltet 17,4 grader mellom 800 og 900 moh, bratteste sammenhengende parti 28,2 grader mellom 1158 og 1182 — og skrentene i skogen ligger i beltene på 14,9 til 17,0 grader under tregrensa på 676 moh, der stien er eneste fornuftige linjevalget. ut.no sier det samme med andre ord: turen er primært en fottur, og som skitur går noen steder så bratt at kunnskap om skredfare er nødvendig.'
    ),
    jsonb_build_object(
      'title', 'Toppklossen',
      'body',  'Vestsida faller 49,0 grader bare 10 til 70 meter fra varden og sørvestsida 45,4 grader 160 til 220 meter ut, mens nordskuldra linja bruker måler 17,5 grader i snitt de første 400 meterne. Skråhyllene på alternativveien er kildens egen advarsel ved hardt føre eller vestvendte skavler, og westcoastpeaks anbefaler isøks og stegjern der vinterstid. På denne toppen er det ikke snittbrattheten som er faren, men kantene.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Skrott ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer skisesong for denne turen: ut.nos sesongfelt gjelder fotturen (mai til juli og september), og kortets jan–apr er lånt fra ut.nos Tveitakvitingen-beskrivelse på samme massivet. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'skrott';

update public.tk_tours set
  description_up   = 'Fra den innerste parkeringa ved Eikedalen skisenter, 459 moh, på Kråvegen. Fri Flyt sender deg opp en setervei de første hundre høydemetrene, og det er Kråvegen østover og stien videre: linja følger den kartlagte veien og stien til om lag 555 moh, der dalen flater ut.

Så kommer den lange, flate anmarsjen inn Skeiskvanndalen — 1,8 grader i snitt gjennom beltet fra 500 til 600 moh, over 3,27 km grunn. Skogen slutter på 629 moh etter Kartverkets klasser, med åpent område fra 631, så mesteparten av dalen går i glissen fjellskog og myr. Dalbotnen bærer to naturlige vatn på 551 moh — et navnløst tjern og Skeiskvanndalsvatnet — og linja holder den tørre nordvestsida forbi begge. Det er målt, ikke håpet: 0 meter av linja står på vatn.

Rosselandsbotnen er vendepunktet. Selve registerpunktet for botnen står på tjernet der — 661 moh, klasse innsjø — og linja passerer sørbredden på fast mark. Her forlater du dalbotnen, tar til høyre slik kilden sier, og begynner den bratte stigningen: beltene ovenfor måler 16,1 grader fra 700 til 800 moh, 17,7 fra 900 til 1000 og 18,4 fra 1100 til 1200, det bratteste på turen.

Sikt mot skaret til venstre for — altså nord for — selve toppen. Det måler 1224 moh, 190 meter nord-nordvest for varden, og det bratteste sammenhengende partiet på hele linja ligger rett under det: 32,5 grader mellom 1139 og 1168 moh. Øverste delen av skaret og toppryggen er ofte avblåst og hard, og Fri Flyt nevner isøks som en fordel — det er den delen av turen som avgjør om dagen er innenfor.

Fra skaret går toppryggen sørover til varden, forbi 1248 moh — beltet fra 1200 til 1300 måler 9,1 grader, så det bratte er gjort når du står i skaret. 1260 moh, og Kvamskogen, Fuglafjellet og fjorden under deg.',
  description_down = 'Vanligste nedkjøringa er samme veien: nordover av toppryggen, ned gjennom skaret, og vestflanken ned mot Rosselandsbotnen. Flanken du kjører er den samme du gikk opp — 25,4 grader i snitt fra varden mot vest, med 53,0 grader som bratteste 60 m-vindu 740 til 800 meter ut — så linjevalgene på vei opp er linjevalgene på vei ned.

Fri Flyt beskriver også den sørvestvendte renna mellom Såterindane. Kilden sier du skal fortsette forbi toppvarden for å finne den, og registeret setter Såterindane 837 meter sørvest for varden; det bratte rett under varden — 43,4 grader 110 til 170 meter ut i sørvestsveipet — er skuldra på toppen, ikke inngangen til renna. Kilden er tydelig på avslutningen: ta til høyre før botnen av renna, før Såtedalen, og kjør tilbake mot oppstigningsruta. Vestflanken rett ned fra toppen nevner kilden bare for dager med svært stabilt snødekke.

Fra Rosselandsbotnen tilbake er det de 3 km flate ut dalen og seterveien ned til parkeringa — 104 høydemeter å gi tilbake har turen samlet, det meste av det i den kuperte dalbotnen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyts eget faremoment er «Skred både opp og ned, og klipper», og målingene sier hvor: beltene fra 700 moh og opp veksler mellom 9,1 og 18,4 grader i snitt, med 16,1 fra 700 til 800, 17,7 fra 900 til 1000 og 18,4 fra 1100 til 1200 som de bratteste, det bratteste sammenhengende partiet er 32,5 grader mellom 1139 og 1168 moh, og fallet fortsetter forbi varden — vestsida 53,0 grader på det bratteste 740 til 800 meter ut, nordvestsida 53,6 grader 690 til 750 meter ut. Flanken fra Rosselandsbotnen til skaret er skredterreng i begge retninger, og den er eneste veien på denne ruta.'
    ),
    jsonb_build_object(
      'title', 'Toppen og skaret',
      'body',  'Øverste delen av skaret og toppryggen er ofte avblåst og hard — Fri Flyt nevner isøks, og det er her den mener. Sørvestsveipet fra varden måler 43,4 grader på det bratteste 110 til 170 meter ut, og det er skuldra på toppen — renna mellom Såterindane ligger 837 meter lenger sørvest; sørøstsida måler 35,7 grader 440 til 500 meter ut og sørsida 37,3 grader 740 til 800 meter ut. Den slakeste sektoren fra varden er nordøst, 13,7 grader i snitt — men det er ikke den veien ruta går.'
    ),
    jsonb_build_object(
      'title', 'Vatnene',
      'body',  'De to vatnene i dalbotnen — det navnløse tjernet og Skeiskvanndalsvatnet, begge på 551 moh — ligger en snau time fra Bergen, lavt og kystnært, og isen på dem kan ikke forutsettes. Linja holder derfor den tørre nordvestsida forbi begge, målt mot Kartverkets terrengklasser og OSMs vannpolygon: 0 meter på vatn. Registerpunktet for Rosselandsbotnen står også på vatn, på tjernet på 661 moh; linja passerer sørbredden på fast mark.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Såta ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Ingen kilde publiserer sesong for denne turen; kortets jan–apr er lånt fra ut.nos beskrivelse av Tveitakvitingen 12,6 km sør, på andre sida av Kvamskogen. Ta med sender/mottaker, søkestang og spade, og isøks til skaret når det er avblåst. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'sata';

update public.tk_tours set
  description_up   = 'Fra avgiftsparkeringa ved veienden på Gullfjellsvegen, 307 moh, innerst i Bjørndalen. De første to kilometerne går på grusvei og er så godt som flate: beltet fra 300 til 400 moh måler 2,5 grader i snitt over 2,1 km grunn. Skogen slutter allerede på 324 moh, og alt over det klassifiserer Kartverket som åpent område — dette er en tur uten tregrense å snakke om.

Ved 2,47 km står du ved sørenden av Svartavatnet, 410 moh. Fri Flyt beskriver veien som «til høyre for Svartavatnet», og det er der linja går: på land, hele veien forbi. Svartavatnet er registrert som regulert vann. Fri Flyt oppgir 392 moh, terrengmodellen leser vannflata til 408, og forskjellen er ikke nedtapping — den er den nye dammen: Bergen kommune bygde dam nedstrøms i 2012–2014 og hevet høyeste regulerte vannstand med 20 meter.

Redningshytta ligger 18 meter fra linja, 4,23 km ute; selve hyttepunktet måler 597,5 moh og linja der den passerer 592, mot de «600 moh» kilden oppgir. Rett etter kommer den vesle unnabakken kildene nevner, og den er reell: linja mister 50 høydemeter, fra 605 til 555 moh over 252 meter grunn, mellom 4,11 og 4,36 km. Det er 50 av de 159 høydemetrene turen gir tilbake underveis.

Fra 555 moh stiger det jevnt igjen, og det bratteste på hele turen ligger her: et trinn på 27,4 grader mellom 709 og 727 moh. Det er kort, og det er den bratteste tretti-meteren på linja.

Over tjørna på 769 moh, 6,21 km ute, flater det ut i det kilden kaller et kupert høydedrag. Det bratteste hundremeterbeltet på turen ligger her, mellom 800 og 900 moh, og det måler 8,1 grader i snitt over 720 meter grunn. Så gjennom Middagsdalen på 939 moh, 7,40 km ute, og opp til varden på 987.',
  description_down = 'Ned samme linja: gjennom Middagsdalen, over høydedraget, forbi tjørna og ned til Redningshytta. Under hytta venter de 50 høydemetrene du mistet på vei opp, denne gangen som stigning. Fra Svartavatnet og ut er det grusvei og 2,5 grader — de siste to kilometerne går du.

Vanligste feilen på dette fjellet er å ta av vestover eller nordvestover fra varden. Toppkuppelen er så slak at overgangen ikke kjennes på skia: nordsida faller 45,8 grader bare 30 til 90 meter fra varden, nordvestsida 61,2 grader 90 til 150 meter ut, og vestsida 59,0 grader 200 til 260 meter ut. Sørsida, som er den du kom opp, holder 4,9 grader i snitt de første 800 metrene. I flatt lys er forskjellen usynlig.

Fri Flyt beskriver også nedkjøringer fra hovedtoppen om Gullfjellshalsen og Vossevardane til Svartavatnet. Det er andre linjer enn denne, og de er ikke målt her.

Fri Flyt fører tre startsteder for Gullfjellet, og nordruta har sin egen beskrivelse: fra den nedlagte Gullbotn Turistheim ved Trengereid, «følg merkingen opp i selve Gullbotn nord for Mannaleitnipa (593 moh) og videre til Gullfjellshalsen». Merkinga er kartlagt hele veien. Fra parkeringa på 244 moh tar stien av på 293, går gjennom selve Gullbotn på 447 nord for Mannaleitnipa, over 699 og opp på Gullfjellhalsen — registerført som rygg, 941 moh — og derfra de siste metrene til varden. 753 høydemeter på 3,96 km mot 839 på 7,80 km fra Osavatnet: halve lengden, nesten samme stigningen, og ingen grusvei. Det koster bratthet. Beltet fra 600 til 700 moh måler 19,4 grader mot 8,1 i det bratteste beltet på vestruta, og det bratteste 30-metersvinduet er 26,1 grader mellom 607 og 629 mot 27,4. Det er ikke et enkelt vindu som skiller dem — det er at stigningen her kommer på under halve lengden. Skogen slipper på 406 moh etter 1,4 km. Ruta gir bare 10 høydemeter tilbake, mot 159 på vestruta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja er slak hele veien. Det bratteste hundremeterbeltet, 800 til 900 moh, måler 8,1 grader i snitt, og ingen av de seks andre beltene holder mer enn 6,9. Bratteste sammenhengende parti er trinnet på 27,4 grader mellom 709 og 727 moh. Det som skifter med været her er ikke bratthenget, men føret: turen starter på 307 moh ved kysten, og snøgrensa ligger ofte over parkeringa. Fri Flyts eget faremoment gjelder ikke denne linja, men gjelet i massivet: «Hele Glumragjelet, samt de to rennene, er veldig skredutsatt vinterstid, og på våren kommer det ofte is og stein ned fra de stupbratte fjellsidene.» Registeret skriver navnet Glamregjelet og setter juvet 663 meter rett vest for varden, på 576 moh — under den vestsida ruta ikke kjører, men står rett over.'
    ),
    jsonb_build_object(
      'title', 'Toppen',
      'body',  'Hele turen er en oppvarming til de siste hundre metrene. Fra varden faller nordsida 45,8 grader 30 til 90 meter ut, nordvestsida 61,2 grader 90 til 150 meter ut og vestsida 59,0 grader 200 til 260 meter ut; østsida måler 41,3 grader 740 til 800 meter ut og sørøstsida 30,6 grader 380 til 440 meter ut. Sørsida, oppstigningen, holder 4,9 grader i snitt. En slak kuppel over bratte sider er nettopp det terrenget der en feilpeiling i skodde koster mest.'
    ),
    jsonb_build_object(
      'title', 'Isen',
      'body',  'Osavatnet ligger på 307 moh ved kysten på Bergens breddegrad, og Svartavatnet er registrert som regulert. Linja er derfor lagt på land hele veien: 0 meter av 7 803 står på vann, kontrollert mot Kartverkets terrengklasse hver andre meter langs hele linja — 3 769 punkt — og mot OSMs vannpolygon. Et regulert vann blir tappet ned om vinteren, og is som blir liggende igjen over tomrom bærer ingenting.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Gullfjellstoppen ligger i varslingsregionen Hordalandskysten, som er en B-region: det blir ikke laget daglig skredvarsel for dette fjellet. Nærmeste A-region er Voss, og den dekker et annet og mer innlandspreget fjellparti — les den som kontekst, ikke som varsel for Gullfjellet. Ta med sender/mottaker, søkestang og spade. En tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'gullfjellstoppen';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved Furedalen alpinsenter, 382 moh. Navnet i kilden — «Furudalen» — finnes ikke i registeret; stedet heter Furedalen, og parkeringa er kartlagt som «Furedalen alpin». De første hundre meterne krysser flata ved anlegget, så er du på Mødalsvegen: de preparerte løypene kilden nevner er langrennsspor, kartlagt med klassisk og skøyting hele veien til Mødal, og alpintraséene ligger vest for linja.

Mødalsvegen sørover er nesten flat — beltene fra 400 til 600 moh måler 3,7 og 3,3 grader i snitt — og forbi de innerste sela i Mødalen tar stigninga til. Linja passerer Svartatjørna på 86 meters avstand og 621 moh; selve tjørna leser 618 moh, og skogen slutter på 586 moh etter Kartverkets klasser, med åpent område fra 587.

Så kommer de bratte kliva kilden beskriver, opp mot fjellet den kaller Såta — den lokale Såta på 802 moh sør for fylkesveien, ikke appens Såta på 1260 på nordsida av Kvamskogen. Beltet fra 800 til 900 moh er turens bratteste med 16,4 grader i snitt, og det bratteste sammenhengende partiet ligger her: 25,0 grader mellom 817 og 838 moh, opp det kilden kaller Stoveveggen — et navn verken registeret eller kartet bærer, så det står her som kildens.

Over veggen flater platået ut — beltet fra 900 til 1000 moh måler 4,7 grader over 1,3 km grunn — og linja går sør for Gråskorvenuten, gjennom søkket kilden kaller Middagshola (heller ikke det i registeret): linja topper på 1017 moh og gir tilbake 36 meter til 981 før ryggen tar til. Turen gir tilbake 78 høydemeter samlet, det meste her.

Siste biten går langs ryggen — beltet fra 1100 til 1200 moh måler 14,8 grader — og så slakere til varden på 1299. Toppen er slak i alle retninger: ingen av de åtte sveipene fra varden holder mer enn 14,2 grader i snitt de første 800 meterne.',
  description_down = 'Retur samme veien. Ryggen og platået først — og det er her dagen skal planlegges: i skodde eller snøfokk er det navigasjonen over det vide platået mellom Middagshola og kliva som er vanskegraden, for terrengformene å styre etter er få og like. Kliva ned fra 838 til 817 er det bratteste du kjører.

Fra varden er den bratteste sektoren sørvest, 37,5 grader i det bratteste 60 m-vinduet 690 til 750 meter ut — utenfor ruta, men verdt å vite om i dårlig sikt. Ellers er fallet fra toppen slakt: 5,5 grader i snitt mot sørøst, 6,8 mot sør.

Fra Mødal er det langrennssporene på Mødalsvegen tilbake til Furedalen — flatt nok til at det er staking og skøyting mer enn kjøring, og de siste hundre meterne krysser du flata ved anlegget til parkeringa.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'ut.no sier at enkelte partier kan være skredutsatte, og målingene peker på kliva: beltet fra 800 til 900 moh holder 16,4 grader i snitt med det bratteste sammenhengende partiet på 25,0 grader mellom 817 og 838 moh, og beltet fra 1100 til 1200 på ryggen 14,8. Resten av linja er slakere enn 10 grader i snitt i hvert belte. Terrenget er målt slakt, og det skal sies slakt — men 17 km tur-retur er lang eksponering for værskifte, og fjellski med stålkant er kildens egen anbefaling.'
    ),
    jsonb_build_object(
      'title', 'Platået',
      'body',  'Fra 900 moh og innover er dette vidt fjell med få former: beltet fra 900 til 1000 måler 4,7 grader over 1,3 km, og søkket kilden kaller Middagshola er eneste tydelige holdepunktet før ryggen. I flatt lys og skodde er det her turen blir vanskelig — ikke i hengene. Toppen selv er slak i alle åtte retninger; den bratteste sektoren, sørvest med 37,5 grader 690 til 750 meter ut, ligger utenfor ruta.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Tveitakvitingen ligger i varslingsregionen Voss, en A-region med daglig skredvarsel gjennom sesongen — sjekk varsom.no. Sesongen januar til april er ut.nos egen. Ta med sender/mottaker, søkestang og spade, og regn turen som en heldagstur: 17 km tur-retur med 994 høydemeter. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'tveitakvitingen';

update public.tk_tours set
  description_up   = 'Start bak Tempelsetra kafè, 910 moh, og følg løypa mot Istjenn. Skogen slipper taket allerede ved 971 moh, og på 950 moh går ruta ut på Istjenn — Kartverket klasser punktet som innsjø, og det er det første av to vann ruta går ut på isen på — Donkelitjenn er det andre.

Videre nordover forbi Vesletjenn på 1095 moh. Dette er den flate delen: bandet fra 900 til 1000 moh måler 2,3 grader over 2530 meter grunn, 1000 til 1100 måler 3,7 over 1441, og 1100 til 1200 bare 2,7 over 2070 meter. Fem kilometer går med før du står på 1156 moh, og i dårlig sikt er det her turen faktisk er krevende.

Ved Donkelitjenn, 1156 moh, kaller ut.no turen halvgått, og oppgir at det er 313 høydemeter igjen. Det er deres løype som er halv der; den routede linja her er kortere og har vannet på to tredeler. Uansett er det herfra det stiger: 6,3 grader fra 1200 til 1300 moh, og et sted mellom 1283 og 1302 moh ligger bratteste sammenhengende parti på turen, 22,9 grader.

Løypa fortsetter nordover til den deler seg rundt 1282 moh, og grenen som dreier østover går opp på Gråfjell. Bandet fra 1300 til 1400 moh er det bratteste, 10,0 grader over 585 meter grunn, og det siste bandet, over 1400 moh, måler 6,4 grader. Varden står på 1466 moh, 4,5 km nordvest for Høgevarde. De siste tre hundre meterne under toppen, fra 1328 til 1378 moh, går linja opptil 292 meter fra den kartlagte løypa.',
  description_down = 'Ned samme veien — men ikke sørover fra varden. Ruta kommer inn på toppen fra nordvest, så den første kilometeren ned går tilbake dit løypa delte seg på 1282 moh, og først derfra svinger du sørover mot Donkelitjenn. Toppen er rund og flat, og det er verdt å vite hvor rund: radialmålinger fra varden gir 5,2 til 18,3 grader i snitt over 500 meter i alle åtte retninger, og det bratteste 60-metersvinduet på hele fjellet måler 30,2 grader.

Det er derfor Gråfjell er en navigasjonstur og ikke en skredtur. Går du feil ned fra et rundt topplatå i skodde, ender du ikke i en henging — du ender i feil dal, med fem kilometer myr og tjern mellom deg og bilen. Ta peiling på toppen mens du kan se, og hold løypa tilbake over Donkelitjenn.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slakt høyfjell hele veien. Bratteste sammenhengende parti måler 22,9 grader, mellom 1283 og 1302 moh, og bratteste hundremeteren, 1300 til 1400 moh, holder 10,0 grader over 585 meter grunn. Tre av punktene Kartverket sampler langs linja er innsjø: Istjenn på 950 moh og Donkelitjenn på 1152 og 1156. Vinterstid er de flate sletter, og de er en del av ruta — men de er is, og isen er ikke terrengmodellens ansvar.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Det er lite av det. Ingen retning fra varden måler over 18,3 grader i snitt de første 500 meterne, og de bratteste 60-metersvinduene ligger på 30,2 grader mot sørøst og sør. Faren på Gråfjell er vær, avstand og sikt: toppen er det høyeste punktet på Norefjell og fanger vind og skodde før resten av platået, og ut.no fører sesongen som desember til mars.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'grafjell';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved Byrkjenes, 211 moh, innerst på Tordalsvegen nord for Strandebarm, går du opp den bratte skogkledde lia mot Fadnastølen, 498 moh. Dette er den bratteste delen av turen: bratteste hundremeteren ligger mellom 300 og 400 moh og måler 16,5 grader i snitt. Tordalsvegen er privat bomvei, og brøyting helt fram til parkeringa er ikke garantert — ring eller sjekk før du kjører langt.

Over stølen åpner terrenget seg, med skog i flekker opp til rundt 577 moh. Ruta holder nordøstover inn på den brede sørvestryggen ved 629 moh.

Derfra følger du ryggen sammenhengende nordover — 791 moh, så skulderen på 977 moh. Hele den øvre delen ligger på 10 til 13 grader: det er slakere enn sørfallet like ved, som holder 20,8 grader i snitt med et 33,7-graders belte 580 til 640 meter ute fra toppen. Sørvestryggen måler 9,5 grader i snitt, og det er grunnen til at linja ligger der den ligger.

De siste hundre metrene svinger nordøstover opp den slake toppkuppelen til varden på 1046 moh. Bratteste sammenhengende parti på hele linja måler 28,9 grader, og det ligger nede i skogslia.',
  description_down = 'Ned samme ryggen: sørover over skuldra på 977 moh og 791 moh, ned til 629 og videre til Fadnastølen. Fra stølen og ned er det skogsli — bratt nok til å være fin kjøring, og bratt nok til å gå løs etter mildvær og regn.

Vanligste feil: å gå for langt vest eller nord fra varden. Nord, nordvest og vest faller 19 til 26 grader i snitt, men bryter av i 48 til 55 grader en halv kilometer ute fra varden, og toppkuppelen er så slak at du ikke kjenner det på skia før kanten er der. I flatt lys er det den eneste reelle faren på turen.

Den andre feilen er å ta sørfallet ned fra toppen i stedet for sørvestryggen. Sør holder 20,8 grader i snitt, men har et belte på 33,7 grader 580 til 640 meter ute — det er ikke samme linja som ryggen, og det er ikke der ruta går.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nederste halvdelen er bratt skogsli, rundt 19 grader i snitt fra parkeringa til Fadnastølen, mens hele den øvre ryggen ligger på 10 til 13 grader. Bratteste sammenhengende parti på linja måler 28,9 grader. Den skogkledde lia over Byrkjenes er bratt nok til å gå løs etter mildvær og regn — det er den delen av ruta som endrer seg med været, ikke ryggen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Hold deg på sørvestryggen helt opp. I snitt over de første 800 metrene fra varden faller nordsida 19 grader, nordvestsida 25 og vestsida 26 — men snittet skjuler kanten. Bratteste seksti meter måler 55 grader mot nord (520 til 580 meter ute), 55 mot nordvest (500 til 560) og 48 mot vest (620 til 680), og det er kanten som teller. Sørfallet holder 20,8 grader i snitt, men med et 33,7-graders belte 580 til 640 meter ute. Sørvestryggen selv måler 9,5 grader i snitt, og forskjellen mellom den og nabosidene er hele poenget med linjevalget på dette fjellet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'vesoldo';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Tempelseter, 910 moh, og følg den T-merkede og blåmerkede ruta over fossen i retning Høgevarde. Skogen slipper taket ved 938 moh, og de neste tre kilometerne er nesten flate: 4,0 grader fra 900 til 1000 moh over 1305 meter grunn, 4,6 fra 1000 til 1100 over 1304 meter, og 3,3 fra 1200 til 1300 over 1666.

Stikrysset på Raudmyra ligger på 1229 moh, og navnet er ikke tilfeldig: Kartverket klasser både punktet på 1216 og punktet på 1229 moh som myr. Her tar du av til venstre, mot Gråfjell, og forlater Høgevarde-løypa.

Nå kommer turen. Bandet fra 1300 til 1400 moh måler 10,8 grader over 566 meter grunn — det er halve stigningen på en drøy halv kilometer — og mellom 1354 og 1370 moh ligger bratteste sammenhengende parti, 19,6 grader.

Det siste bandet, over 1400 moh, måler 5,7 grader over 120 meter grunn, og der står varden på 1416 moh. Toppen er en smal, taggete rygg, og profilen som gjør fjellet lett å kjenne igjen nedenfra er den samme profilen som gjør at det ikke er mye plass på den.',
  description_down = 'Den slake veien ned er den du kom opp: østover mot Raudmyra, der flanken måler 13,3 grader i snitt over 500 meter. Nord, vest og nordvest er også slake — 10,4, 11,9 og 10,8 grader i snitt, med bratteste 60-metersvinduer på 19,6, 18,8 og 16,8 grader — men de fører deg vekk fra bilen.

Den merkede stien går bratt sørover til Fetjenn på 990 moh, og som skilinje er det en helt annen tur enn oppstigningen — men den ser ikke slik ut fra toppen. Punktmålinger hver tretti meter rett sørover gir først en skulder: 1415,6, 1399,2, 1393,9 og 1395,5 moh, altså 28,6 grader det første steget og så noe som er flatt og til og med stiger litt. Der skulderen slutter, 120 meter ut, faller det 47,2 og 54,5 grader. På peiling 195, som er retningen til Fetjenn, er skulderen enda tydeligere — bakken stiger igjen på 90 meter — og bruddet måler 60,0 grader. Det er rennene randofolk.no mener når de kaller Ranten «en mer alpin topp med brattere nedkjøring» enn Høgevarde. Ta ikke bakken over bruddet som et mål på det som ligger under: kjør dem hvis dette er terreng du kjører til vanlig, og hvis varselet og snøen sier ja; ellers går du tilbake den veien du kom.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigningen fra Raudmyra er en jevn skråning: 10,8 grader i snitt fra 1300 til 1400 moh, og bratteste sammenhengende parti 19,6 grader mellom 1354 og 1370 moh. De første fire kilometerne fra Tempelseter holder under 6 grader. Ruta i seg selv er ikke problemet på dette fjellet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Sørsida er problemet, og den er farligere enn tallene alene sier. Fra varden faller den 40,2 til 54,8 grader i 60-metersvinduene 90 til 170 meter ut, på alle peilinger fra 150 til 210 grader — hele sektoren fra sørøst til sørvest. Men de første hundre meterne er en skulder på rundt ti grader, som på peiling 195 til og med stiger igjen, så bruddet er ikke synlig fra der du står. Toppryggen er smal, og skavl bygger seg ut over den kanten i vestavind. Nord- og vestsida er det motsatte, 10 til 12 grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'ranten';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Tempelseter, 910 moh, og gå opp til høyre for skibakken. Løypa er stukket og som regel kjørt, og de første hundre høydemeterne er det slakeste på turen: bandet fra 900 til 1000 moh måler 3,9 grader over 1327 meter grunn.

Over anlegget stiger det jevnt — 8,8 grader fra 1000 til 1100 moh og 7,8 fra 1100 til 1200 — og et sted der inne, mellom 1179 og 1195 moh, ligger bratteste sammenhengende parti på hele turen: 19,5 grader. Ingen av punktene Kartverket sampler langs ruta er klasset som skog. Du starter over skoggrensa og ser hvor du skal hele veien, og det er en fordel helt til sikten forsvinner. Merk at det er den nederste delen som er oppkjørt. Linja følger løypenettet tett de første 1,2 kilometerne og de siste 1,5, men mellom 1,5 og 3,7 km ut går den sin egen veg over ryggen — verst 572 meter fra nærmeste kartlagte spor, ved 1283 moh. Det som er kartlagt der er umerkte langrennsløyper, ikke en merket toppruta, så det er ikke noe spor å følge over ryggen.

Fra ryggen på rundt 1190 moh svinger ruta nordøstover mot hytta. Bandet fra 1200 til 1300 moh er det bratteste på turen, 11,8 grader over 496 meter grunn, og over det flater det ut igjen: 7,7 grader fra 1300 til 1400.

DNT-hytta Høgevarde ligger på 1397 moh, og toppen 560 meter lenger nordøst, på 1461. Det siste bandet, over 1400 moh, måler 3,5 grader over 810 meter grunn — flatt, og samtidig den mest værutsatte delen av turen. Gamle Høgevarde turisthytte har kafé i vinterferiene og påsken, og skilt nederst i bakken sier om den er åpen. Merk at linja går over Høgevardtjenn på 1378 moh på veg mot toppen — 68 meter på Tempelseter-ruta, opptil 60 meter fra land, og 45 meter på Norefjellstua-ruta, opptil 20 meter fra land. Det er et lite tjern, naturlig og uregulert, og begge linjene skjærer et hjørne av det.',
  description_down = 'Ned samme veien, sørvestover. Det er den slake sida av fjellet, og målingene sier hvor slak: 7,1 grader i snitt mot vest og 8,6 mot sørvest over 500 meter, med bratteste 60-metersvindu på 25,6 og 23,8 grader. Den andre dokumenterte ruta, høyfjellsruta fra Norefjellstua over Norefjellsryggen, gir 828 høydemeter på 11,71 km og er en annen dag. Den følger løypenettet i endene, men går sin egen veg tre steder — verst 427 meter fra nærmeste kartlagte spor ved 1119 moh, og 317 og 364 meter unna over Norefjellsryggen ved 1315 og 1340 moh.

Fristelsen er å ta av mot øst, mot Norefjell skisenter som er godt synlig fra varden. Det er ikke rett nedenfor: anlegget ligger 9,85 kilometer unna på peiling 148, altså sørøst. Å sette kursen dit fra toppen er å velge den bratteste sektoren på fjellet — øst måler 25 grader i snitt og bryter av i 41,5 grader 70 til 130 meter ut fra varden, nordøst gir 41,3, og sørøst, som er retningen mot anlegget, 51,2 grader i vinduet 420 til 480 meter ut. Toppryggen er ofte avblåst mens snøen ligger fin 200 meter lenger nede, og det er nettopp da linjevalget flyttes uten at noen bestemmer seg for det.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstaket og som regel oppkjørt løype i slakt terreng hele veien. Bratteste sammenhengende parti måler 19,5 grader og ligger mellom 1179 og 1195 moh; bratteste hundremeteren, 1200 til 1300 moh, holder 11,8 grader over 496 meter grunn. Staking er ikke kvisting — ut.no minner om at løypa tidlig i sesongen ikke alltid er supplert med kvist, og over skoggrensa er det ingenting annet å navigere etter.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Fjellet er slakt på tre kanter og bratt på én. Øst og nordøst under toppen måler 25 grader i snitt med 60-metersvinduer på 41,5 og 41,3 grader, 70 til 160 meter ut fra varden, og sørøst 51,2 grader i vinduet 420 til 480 meter ut. Vest, sørvest og nordvest holder 7,1 til 8,6 grader i snitt. Det er hele fjellet i én setning: gå og kjør på vestsida.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'hogevarde';

update public.tk_tours set
  description_up   = 'Start der anleggsveien tar av oppover fra Ænes, 90 moh; kirka som rutebeskrivelsen nevner ligger på 41 moh nede ved fjorden. De første hundre høydemetrene går på 6,3 grader, og så tar veien fatt: 11,3 grader fra 100 til 200 moh og 12,9 fra 200 til 300.

Følg stien videre mot Gygrastølvatnet på 492 moh. Bandet fra 400 til 500 moh er det slakeste på turen, 5,6 grader over 1035 meter grunn — det er flata rundt vatnet. Anleggsveien ender ved vatnet, og over det finnes det ingen kartlagt sti der linja går: den nærmeste ligger opptil 526 meter unna, ved 566 moh, så ryggen er ditt eget veivalg.

Fra vatnet går du opp på selve ryggen og følger den. Skogen holder til 590 moh; over det er alt åpent. Stigningen er jevn og øker gradvis: 16,8 grader fra 600 til 700 moh, 19,4 fra 800 til 900 og 19,8 fra 1000 til 1100, som er bratteste hundremeteren. Bratteste sammenhengende parti, 36,0 grader mellom 1322 og 1345 moh, er det korte steget rett under toppen.

Over 1300 moh legger ryggen seg nesten flat — 4,7 grader over 565 meter grunn — og fører fram til toppen på 1347 moh.',
  description_down = 'Ned samme ryggen, nordover mot Gygrastølvatnet og videre ned anleggsveien til Ænes. Nederste delen er skogskjøring, og den er tung når snøen er bløt.

Vanligste feil: å velge nordvestflanken fordi den er brattere og kortere. Den er et dokumentert alternativ, men den er skredterreng, og den er ikke den linja ruta går. Den andre er å tro at du får med deg begge toppene: mellom dem kreves lett klatring og sikringsutstyr, og normalruta går til hovedtoppen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'En lang rygg med jevn stigning: bratteste hundremeteren, 1000 til 1100 moh, måler 19,8 grader, og bratteste sammenhengende parti 36,0 grader mellom 1322 og 1345 moh. Ryggen er linja både opp og ned.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Nordvestflanken er skredterreng og et brattere alternativ for dem som velger det med åpne øyne. Mellom hovedtoppen og nabotoppen kreves lett klatring og sikringsutstyr — det er ikke en forlengelse av skituren.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'gygrastolen';

update public.tk_tours set
  description_up   = 'Bussen stopper ved Skar utfartsparkering, og linja starter like ved, på 186 moh. Første del går ned: langs Maridalsveien og over Skarselva på Vaggesteinbrua, der vegen ligger på 160 moh, forbi Nedre Vaggestein og østover til Kroken på 183. Ut.no-sporet går fra parkeringa via Nedre Vaggestein og Kroken før det svinger nordover, men har bare en rett strek over elva; vegen over Vaggesteinbrua er der du faktisk kommer over.

Fra Kroken går linja nordover over jordet til skogsbilvegen, vestover på den og så nordover på vegen gjennom tunet på Bergerud, der Rollveien tar over. Hold deg på vegen forbi husene. Bandet fra 100 til 200 moh måler 0,6 grader over 1397 meter grunn — vegen og flata — og fra 200 til 300 moh 7,1 grader over 817 meter, langs Rollveien opp til 301 moh.

Etter Rollveien begynner lia mot Jondalen, og herfra er det den samme rytmen til toppen: korte kneiker og flate partier. Bandet fra 300 til 400 moh måler 6,9 grader i snitt. Bandet fra 400 til 500 moh måler 6,6 grader. Snittet skjuler terrenget. Innenfor 50 meter av linja står knauser på 40 til 55 grader mange steder, og det bratteste 30-metersvinduet på selve linja, 20,3 grader, ligger mellom 300 og 314 moh, i den første kneika etter Rollveien.

Linja passerer 270 meter vest for Midtkollen og går rett nord mot toppen. På det siste stykket går den forbi et stup OpenStreetMap kartfester 49 meter fra linja, og midten av Svartputten ligger 205 meter øst. Toppen, 537 moh, er skogkledd; ut.no beskriver utsikten derfra mot Lillomarka, Maridalsvannet og Oslofjorden i det fjerne.',
  description_down = 'Nedkjøringa er vanskeligere enn oppturen, og kilden sier det rett ut: «Nedkjøringen kan fort bli ganske teknisk og byksete om man ikke har sett seg ut noen åpne felt på forkant.» Rådet er å se etter åpne skogsfelt på veg opp, og ellers følge sommerstiene — kilden nevner den blåmerkede ned til Øyungen, som tar deg til et annet sted enn bussen. Ut.no-sporet selv kjører samme side ned til 461 moh, går opp igjen én gang, og slutter under toppen.

Mellomkollen er slak på toppen — 3,3 til 11,6 grader i snitt på alle sider over 500 meter — men brattest mot sørvest, 36,2 grader 210 til 270 meter ut. Kilden advarer mot stupene på sørsida av Gaupekollen: de måler 38,7 grader 240 til 300 meter sør for den toppen, 632 meter nordøst for linja. Kollene ligner hverandre, og «plutselig står du på Mellomkollen når du trodde du var på Midtkollen» — ha kart og kompass.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti på linja er 20,3 grader mellom 300 og 314 moh, og bratteste hundremeteren er fra 500 moh til toppen med 7,3 grader. Etter jordene ved Kroken og tunet på Bergerud er det skog hele vegen, til og med 537 moh.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Brattkantene her er korte, ikke store fjellsider: knausene langs linja måler 40 til 55 grader innenfor 50 meter, og et lite flak i en slik kant ender i kratt og stein. Stupene på sørsida av Gaupekollen, 38,7 grader, er det kilden selv advarer mot. Elver ligger under snøen, og kilden nevner både elver og tette kratt som hindringer.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Oslo på varsom.no. Oslo er en B-region: den varsles bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke at terrenget er uten fare. Toppen ligger i Mellomkollen naturreservat — «et fredet naturreservat og en skal derfor ta ekstra hensyn», skriver kilden. Snøen i Oslomarka kommer og går; kilden fører turen fra desember til mars og lister hjelm, spade, kart, kompass og hodelykt.'
    )
  )
where slug = 'mellomkollen';

update public.tk_tours set
  description_up   = 'Start ved veien ved Myrdalsvatnet, 367 moh, i Uskedalen. Følg veien litt tilbake til en traktorvei og følg denne til Nipelva kommer til syne. Skogen holder til 668 moh.

Følg elva oppover til ryggen over Omnatjørnane — registeret skriver dem slik, ikke Omnetjørnene, og «over» er bare halve historien: linja går 269 meter rett over vatnene på 1066 moh, opptil 100 meter fra land. De ligger på selve ryggen, og de er naturlige. Det er her stigningen står: 21,9 grader fra 500 til 600 moh og 19,0 fra 600 til 700, med bratteste sammenhengende parti på 30,8 grader mellom 995 og 1022 moh. Ryggen topper seg på 1033 moh.

Derfra holder du østover mot Møsetjørnene med Juklavasstinden foran deg. Terrenget faller til 755 moh ved vatnet — Fri Flyts 988 høydemeter er toppen minus starten, mens den rutede linja samler 1341 fordi den må ned hit først.

Fra bollen går du opp den nordlige ryggen til topps; det er den slakeste av de dokumenterte linjene på fjellet — den vestlige renna ved siden av holder 40 grader. Bandet fra 1100 til 1200 moh måler 20,5 grader, 1200 til 1300 moh 17,8 og 1300 til 1400 moh 21,5, med varden på 1361 moh.',
  description_down = 'Ned nordryggen, over bollen ved Møsetjørna og tilbake over ryggen til Nipelva og Myrdalsvatnet. Fallretninga er nordvest, og turen har en kneik igjen på vei hjem — det er den samme ryggen du kom over.

Vanligste feil: å ta den vestlige renna ned. Den er 40 grader og et eget valg; nordryggen er den linja rutebeskrivelsen peker på. Den andre er toppskavlen — turen kan kreve stegjern og isøks, og skavlen er grunnen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'To stigninger med en nedstigning imellom. Bratteste sammenhengende parti måler 30,8 grader mellom 995 og 1022 moh, og bandet fra 1300 til 1400 moh 21,5 grader. Nordryggen er den slakeste av de dokumenterte linjene — 20,5 grader mot 40 i den vestlige renna — og den er den korridoren følger.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Toppen bærer skavl. Den vestlige nedkjøringa holder 40 grader og er et valg for seg. Bollen mellom ryggen og nordryggen er der du mister høyde på vei opp — og der du må hente den inn igjen på vei hjem, med den tidsbruken det gir.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottaker, søkestang og spade — en tom side betyr ikke trygt fjell.'
    )
  )
where slug = 'juklavasstinden';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved Kletta, 154 moh, følger du veien 300 meter før stien svinger opp mot Skarshaug. Første strekket går over innmark og videre inn i blandingsskogen; sporet er tydelig, og du stiger jevnt gjennom skogen til rundt 618 moh.

Over tregrensa reiser lia seg. Mellom 600 og 700 moh holder den 22,6° i snitt over hundre høydemeter, og det bratteste hundremeterspennet på turen kommer like over: 23,9° mellom 800 og 900 moh, med 22,2° mellom 900 og 1000. Begge er noe du vil ha unnagjort tidlig på dagen. Toppen av bakken er Skarshaug, 806 moh, halvveis til Melderskin.

Nordøstover flater det ut i Rindane, de små ryggene og søkkene du siger gjennom mot Holo. Holo er flata på 1211 moh; Kartverket klassifiserer den som myr, og det er det ene stedet på ruta der linja flater helt ut. Her svinger den nordøst før den vender tilbake østover — den svingen holder deg på hylla og utenfor den bratte sør- og sørvestsiden rett under toppen.

Siste stigningen fra Holo til varden er 215 høydemeter på ni hundre meter: 13° i snitt, 25° der den er brattest. Øverst ligger skavlene langs toppkanten, og er snøen avblåst og hard, tar du på deg stegjern og har isøksa i hånda de siste meterne.',
  description_down = 'Ned igjen følger du oppstigningen: vestover fra varden til Holo, så sørvest gjennom Rindane og over Skarshaug, og til slutt ned lia og gjennom skogen til Kletta.

Vanligste feil: å slippe seg rett ned fra toppen i stedet for å gå tilbake til Holo først. Fallinja fra varden går sørover, og der stuper det — sørflanken snitter 44° over de tre første hundre metrene, med et bergband på 60° i de øverste sytti. Hold vestover til du står på hylla ved Holo, og gå ned oppstigningssporet derfra.

Under Skarshaug møter du bakken mellom 600 og 700 moh igjen, nå vestvendt og med sol på seg fra midt på dagen. Kjør den mens snøen fortsatt bærer; senere blir den tung og våt helt ned i skogen.

Fri Flyt går ikke opp Melderskin fra Kletta i det hele tatt. Startstedet deres er Myrdalsvatnet på 367 moh — det samme som Juklavasstinden går fra — og ruta følger grusveien litt tilbake til en traktorvei på 430, videre til Nipeelva på 525, opp langs elva og så den tydelige ryggen over Omnetjørnene på 1033 til Omnen på 1155 og toppryggen på 1204. 1104 høydemeter på 5,13 km, mot 1275 på 4,92 km fra Kletta: kortere klatring, lengre linje, og 1,88 km med skog mot 1,76 — furua slipper på 659 moh her mot 618 der. Beltet fra 600 til 700 moh måler 21,8 grader og det bratteste 30-metersvinduet 39,7 grader mellom 1317 og 1345 — brattere enn de 36,5 normalruta måler. Omnetjørnene ligger øst for ryggen — til venstre når du går sørover, som kilden sier — og linja går ikke over dem. «Ta med stegjern og øks» står i faktaboksen til denne ruta, ikke til den andre.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Den bratteste hundremeteren ligger mellom 800 og 900 moh og holder 23,9°; bratteste enkeltsteg på linja måler 36,5°, mellom 848 og 874 moh. Linja selv passerer aldri 30°, men den ligger i lia du må gjennom uansett, og lia er brattere enn sporet gjennom den. Ta den vurderingen nede ved skogkanten, mens det ikke koster deg noe å snu.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Det bratte ligger sør for toppen, ikke vest. Sørflanken rett under varden snitter 44° over de tre første hundre metrene og har et bergband på 60° i de øverste sytti; sørøstsiden ligger på 33° med 59° i det bratteste partiet. Vestsiden, der ruta går, er blant det slakeste på fjellet — 17° i snitt. Men linja rett fra Rindane mot varden, den ruta går utenom, treffer et trinn på 42° hundre meter ut fra toppen, og det er hele grunnen til at svingen ved Holo finnes. Nordsiden har rennene: Midtrenna på 45° og Høyrenna på 40°, og Nordvestrenna, som friflyt kaller en kjent skredbane på seinvinteren. Målt fra toppen faller nord- og nordøstflanken 30° i snitt med 44–50° i de bratteste partiene. Det er en annen tur enn denne, og den krever isøks og stegjern.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hardanger på varsom.no. Ta med sender/mottaker, søkestang og spade, og stegjern og isøks for toppartiet når snøen er hard.'
    )
  )
where slug = 'melderskin';

update public.tk_tours set
  description_up   = 'Kjør til Uskedalen og ta av mot Musland; parker ved første gården — tunet ligger på 148 moh, og vær varsom med traktortrafikken, slik kilden ber om. Traktorveien fortsetter nordvestover, og den merkede stien tar til venstre inn i skogen — veien og stinettet er kartlagt, og første stykket bærer du gjerne skia på godt opptråkket sti. Fra traktorveien ved gården går linja 330 meter i kraftgata, der kartet ikke har noen sti, og følger så den merkede stien langs kraftgata innover Uskedalen til traktorveien vestover mot Bergsdalselva.

Stien krysser dalen — botnen leser 140 til 183 moh — før flanken mot Såta tar til. Det er dalens pris: mesteparten av de 173 høydemeterne du gir fra deg, ligger her og i bulkene på ryggen videre. Skogen slutter på 526 moh etter Kartverkets klasser, og flanken opp mot Såta holder 507 og 625 på vei til knausen på 651.

Fra Såta går du sør opp den bratte ryggen, slik kilden sier — og ryggen leverer: 869, 1032, 1126 og 1184 moh i jevn, bratt stigning, med 29,3 grader som bratteste sammenhengende parti på selve ryggen, mellom 765 og 788 moh — turens bratteste, 30,1 grader, ligger lenger nede, i flanken opp fra dalkryssinga mellom 312 og 330 moh. Dette er navigasjonsstrekket i tåke: ryggen er logisk i godt vær og diffus i flatt lys.

Toppen står på 1200 moh. Hele veien langs toppryggen: hold avstand til østkanten — skavlene henger ut over Limomnen, botnen på 889 rett under, og nordøstflanken faller 55,5 grader på det bratteste bare 200–260 m fra varden.',
  description_down = 'Normalveien ned er ryggen tilbake mot Såta, der de bratte sidene byr på nedkjøring — samme linjevalgsdisiplin som opp, med skavlkanten mot Limomnen som den faste regelen: kjør vest for kammen.

Fra Hjorteklett — kildens skrivemåte; registeret fører knausen som Hjortaklett (Ås, 59.91905/5.85858), 460 m nord for Såta — må skia vanligvis bæres et stykke. Ved gode snøforhold nevner kilden en flott nedkjøring langs bekken øst for Såta; den er variant, ikke normalvei, og «ved gode snøforhold» er vilkåret som står ved.

Så dalen tilbake: kryssinga koster deg de siste motbakkene hjem til stien og traktorveien ned til Musland. Utglidningsfaren kilden nevner hører dette strekket til — bratt, tett vestlandsskog med hard snø er sitt eget faremoment.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fri Flyts faremoment er «skredutsatt terreng, vanskelig navigering og utglidningsfare», og alle tre er målbare på denne linja: flanken mot Såta og sørryggen holder 21 til 30 grader med brattere sider tett på, ryggen er diffus i flatt lys, og skogstykkene bærer hard snø over bratt botn. 35-graderne på enkleste veien ligger i flankevalg nær toppen — sporet kan legges slakere, og målinga viser at det går.'
    ),
    jsonb_build_object(
      'title', 'Skavlene mot Limomnen',
      'body',  'Toppryggen bærer skavler ut over østsida, der Limomnen ligger 300 høydemeter under. Nordøstflanken faller 55,5 grader på det bratteste 200–260 m fra varden og nordflanken 49,7 bare 100–160 m ut. Kanten er lenger ute enn den ser ut til i fokk — hold vest for kammen hele toppstrekket.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Englafjell ligger i varslingsregionen Hordalandskysten, en B-region uten daglig skredvarsel — nærmeste A-region med daglig varsel er Hardanger, øst for Folgefonna. Det er en grunn til mer varsomhet, ikke mindre: vurderinga er din. Ingen kilde publiserer sesongmåneder; kortets jan–apr er lånt fra appens andre Hardanger-turer, og guiden sier det. Ta med sender/mottaker, søkestang og spade. En tom varselside er ikke det samme som et trygt fjell.'
    )
  )
where slug = 'englafjell';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Holbubekk, 1054 moh, der E134 krysser bekken på bru, 1 km vest for Haukelitunnelen. Fri Flyt: «Parker ved parkeringsplass noen hundre meter etter tunellen ved en bekkedal og en bro.» Ut.no starter sporet ved Midtlæger, ved tunnelmunningen; de to linjene møtes inne i Holebudalen. Det er snaufjell fra første meter.

Følg bekkedalen østover. Det er slakt: bandet fra 1100 til 1200 moh måler 5,2 grader over 1080 meter grunn, og etter 1,27 km er du inne i Holebudalen på 1141 moh. Fri Flyt ber deg holde høyden til du ser Stavsnuten og bollen; ut.no: «Anmarsjen går inn Holebudalen i slakt terreng før man dreier mot venstre.»

Linja dreier nordover inn mot bollen ved 1256 moh, 2,03 km fra start. Ut.no: «Normalruten går inn "bollen" og fortsetter oppover midt mellom de bratte sidene. Hold til venstre for undertoppen (1603 m.o.h.) under oppstigning for mest behagelig og sikker tur da det mot høyre er helninger i overkant av 30 grader som kan være skredutsatt.» Linja går mellom de to undertoppene: 1567 ligger 408 meter vest for den, og 1603 ligger 279 meter øst. Det er her turen er bratt — 18,7 grader fra 1300 til 1400 moh og 20,2 fra 1400 til 1500. Bakken under sporet er aldri 35 grader eller brattere i 15 meter sammenhengende, men 35 til 62 meter fra det står celler på 40 til 46 grader mellom 1383 og 1540 moh. Ut.no advarer om at du her går gjennom utløpssoner, men at det er mulig å unngå løsneområdene.

Over 1500 moh slakker det av — 12,6 grader i bandet fra 1500 til 1600, med bratteste parti på 23,8 grader mellom 1507 og 1527 — og ved 1608 moh, 3,25 km fra start, er du oppe på platået. Ut.no: «Det kan virke som man er på toppunktet når man kommer opp på platået, men herfra går det slakt innover enda et stykke mot toppen som er markert med en varde (1661 m.o.h.).» Varden er 350 meter lenger inne. Den står på kanten av sørsida: mot sør og sørsørvest faller bakken 38,4 til 43,3 grader 10 til 90 meter fra varden, og ved 1640 moh står celler på 53,2 grader 61 meter sørøst for linja. Linja går inn langs nordsida av platået, slik ut.no-sporet gjør — hold deg der, og i dårlig sikt anbefaler ut.no å stoppe på platået.',
  description_down = 'Fri Flyt: «Den opplagte turen ned er veien du gikk opp. Her får du muligheter til dropp og hopp fra steiner, og du sklir helt ned til bilen igjen.» Ut.no: «Mellom undertoppene (1567 m.o.h. og 1603 m.o.h.) er det mulighet for store svinger, samt dropp og hopp fra steiner.» Husk anmarsjen: ut.no ber deg «beholde litt fart på vei ned Holebudalen igjen».

Fri Flyt har to nedkjøringer til. Flanken fra venstretoppen, 1567, er «jevn og bratt», og «Hvis du ikke er nøye med veivalget kan det bli brattere enn 35 grader» — sørøst fra 1567 måler den 41,4 grader i bratteste vindu. Nordvestflanken bak Stavsnuten har små renner og flanker, men om vinteren må du gå opp igjen for å komme til bilen. Fra toppen måler sørsida 46,9 grader 410 til 470 meter ut og nordøstsida 31,8 grader 420 til 480 meter ut; vest og nordvest er slake, 9,9 og 9,3 grader i snitt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste bandet er 20,2 grader mellom 1400 og 1500 moh, i bollen, og bratteste sammenhengende parti 23,8 grader mellom 1507 og 1527. Fri Flyt oppgir 30 grader som bratteste punkt og graderer turen «Lett»; ut.no kaller den krevende. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Ut.no: til høyre for 1603 er det helninger over 30 grader som kan være skredutsatt, og i bollen går du gjennom utløpssoner. Sørsida av 1603 måler 51,1 grader og sørvestsida 45,7 i bratteste vindu. Sørsida av toppen begynner ved varden, 38,4 til 43,3 grader de første 90 meterne. Fri Flyt: ved østlig vind kan Stavsnuten bli litt avblåst, og for å nå begge toppene «kreves det lett klatring og sikringsutstyr mellom toppene».'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hardanger på varsom.no. Hardanger er en A-region og varsles daglig i sesongen. Starten ligger ved E134 over Haukelifjell; sjekk vegmeldingene før du kjører. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'stavsnuten';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Ulevå, 982 moh, ved E134 vest for Haukeliseter fjellstue. Fri Flyt: «Parker langs veien ved Ulevå, 2,5 km før Haukeliseter fjellstue når du kommer fra vest. Følg bekkedalen oppover til det flater ut ved 1200 høydemeter. Nå ser du toppen.» Ut.no beskriver samme linje som sin rute C, og to ruter til fra fjellstua som møter denne nordvest for Loftsdokktjønn.

Bekkedalen stiger jevnt — 6,2 grader i bandet fra 1000 til 1100 moh — og etter 1,75 km er du på flata, 1171 moh. Herfra ser du Vesle Nup i nordøst. Bandet fra 1100 til 1200 moh er 1925 meter grunn på 3,2 grader, nesten flatt. Ut.no: «Forsett i retning mot toppen mellom punkt 1206 og Loftdokkstjønn.» Linja går sør for 1206 og passerer 79 meter sørøst for punktet ved 2,55 km.

Mellom 1206 og Loftsdokktjønn gir linja fra seg 29 høydemeter, fra 1201 moh ved 2,55 km ned til 1172 ved 2,90 km — det bratteste partiet på turen, 26,5 grader mellom 1197 og 1179, er på vei ned hit — før den svinger nordover langs Ålmannvegen, stien fra fjellstua, mot skaret. Bakken under sporet er bratt bare ett sted, 17 meter på 35 grader eller mer ved 1190–1198 moh. Skaret mellom Vesle Nup og topp 1469 når du på 1350 moh etter 4,33 km; topp 1469 ligger 775 meter nordvest for linja.

Ut.no: «Her tar du av til høyre og følger fjellryggen østover omtrent 1 km til selve toppen.» Ryggen er 1,46 km fra skaret til varden. Linja passerer 100 meter sørvest for topp 1393 og stiger slakt — 6,0 grader fra 1300 til 1400 moh og 7,8 fra 1400 til 1500. Det siste stykket opp mot varden er det bratteste på ryggen.',
  description_down = 'Fri Flyt: «Kjør ned den første flanken. Hold høyden etter dette slik at du ikke må gå over flaten. Kjør ned bekkedalen mot bilen.» Ut.no viser til rute C som den med «mest sammenhengende nedkjøring for deg som går på toppturski».

Toppen er spiss, og den faller bratt mot nord og øst: 52,5 grader 30 til 90 meter ut mot nord, 58,2 og 57,1 grader 10 til 70 meter ut mot nordøst og øst, 49,8 mot sørøst. Ryggen du kom opp, mot vest, er den slake siden — 10,4 grader i snitt over 500 meter.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 26,5 grader mellom 1197 og 1179 moh, en kort kneik ned i søkket sørøst for 1206, og bratteste bandet 7,8 grader fra 1400 til 1500. Bakken under sporet er 35 grader eller brattere bare i ett strekk på 17 meter, ved 1190–1198 moh. Fri Flyt oppgir 25 grader som bratteste punkt og graderer turen «Lett».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Toppen faller 49,8 til 58,2 grader mot nord, nordøst, øst og sørøst like under varden; hold deg på ryggen fra vest. Resten av turen går over snaufjell på høyfjellsplatået helt sør på Hardangervidda, uten ly og med få landemerker, og i skodde er det navigasjonen som er det vanskelige. Fri Flyt: «Det er en veldig populær tur på fjellski, men så lenge det ikke er snorkelføre gir den en flott opplevelse på randoutstyr også.»'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Vest-Telemark er en A-region og varsles daglig i sesongen. Starten ligger ved E134 over Haukelifjell; sjekk vegmeldingene før du kjører. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'vesle-nup';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved Langefonn turisthytte, 922 moh, følger du den vinterstengte veien mot Stavsro, rundt svingen øst for parkeringen og opp gjennom bjørkeskogen. Etter en kilometer står du ved Svineroisetra, 1021 moh — det er kilometeren beskrivelsene snakker om. Bjørkebeltet slipper taket rundt 970 moh, og derfra er alt åpent fjell. Østryggen kan også nås fra Stavsro med 706 høydemeter, men veien dit er vinterstengt.

Ved setra tar du av veien svakt til høyre, sørvest, og setter kursen mot det laveste punktet på Himmelranden — toppen av Langefonn, 1455 moh. Ikke gå rett opp mot varden herfra. Fallinja fra Svineroisetra rett mot toppen holder 35–37° i øverste tredjedel; traversen mot Langefonn stiger jevnt på 12–16° og passerer aldri 25°, og det er den linja denne ruta følger.

Fra det laveste punktet vender du vest-nordvest og følger eggen. Stigningen er jevn: den bratteste hundremeteren på hele turen ligger mellom 1700 og 1800 moh og måler 17,5°, og bratteste enkeltsteg er 24,8°. Underveis kommer du inn på sommerstien fra Stavsro.

På 1831 moh går du ut på toppflata ved Gaustatoppen turisthytte, og derfra er det vel fem hundre meter nordvestover over blokkmark til varden. Flata er åpen og steinete og gir lite å styre etter; i dårlig sikt er hytta holdepunktet du navigerer på, både på vei opp og på vei ned.',
  description_down = 'Ned igjen følger du sporet ditt: øst-sørøst langs eggen til det laveste punktet på Himmelranden, så ned flanken mot nord-nordøst til Svineroisetra, og veien tilbake til Langefonn.

Vanligste feil: å slippe seg rett ned fra toppflata mot Svineroisetra i stedet for å følge eggen tilbake til det lave punktet først. Nordøstflanken rett under varden snitter 35° over de første fire hundre metrene og har 46° i det bratteste partiet — det er de samme tallene fallinja fra Svineroisetra gir i øverste tredjedel. Flanken ned fra eggen ved 1455 er en helt annen sak: 16–21°. Hold eggen til du står på 1455, så tar du flanken derfra.

De sju rennene østover fra toppryggen er noe annet. Friflyt oppgir et snitt like under 40°, og målt fra varden faller østnordøstflanken 31° i snitt over åtte hundre meter med 45° i det bratteste partiet. Friflyt skriver rett ut at rennene kan være skredutsatte, og at flere skikjørere har mistet livet i skred på Gaustatoppen. Kjører du dem, traverserer du sørover etter utløpet, tilbake til det første platået du kom opp på, og ned gjennom bjørkebeltet til Svineroisetra.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja fra Langefonn holder seg under 25° hele veien til varden: bratteste enkeltsteg måler 24,8°, og den bratteste hundremeteren, mellom 1700 og 1800 moh, holder 17,5°. Selve oppstigningen er lite skredterreng. Det som flytter regnestykket er vinden — den blåser eggen bar og legger snøen i rennene på østsiden.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Tre steder ligger utenfor ruta og skal bli der. Østsiden av topptårnet med de sju rennene, der skred har tatt liv. Nordøstflanken rett under varden, 35° i snitt over fire hundre meter og 46° på det bratteste — det er fallinja mot Svineroisetra, og den du havner i om du slipper deg rett ned fra toppflata. Og nordvestsiden mot Rjukan: øverst er den slak, 14° de første fire hundre metrene, men den fortsetter nær 1600 høydemeter ned i dalen — 1878 til 284 moh på 3,6 km — og bratner til over 50° på veien. Det er slakheten øverst som er fella.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'gaustatoppen';

update public.tk_tours set
  description_up   = 'Start på gratisparkeringa ved Gaustabanen, 1132 moh, 170 meter øst for nedre stasjon. Turen begynner med å gå ned: 49 høydemeter til skisporet på 1083 moh, som du følger sørøstover opp til 1160 moh på flata vest for Heddersvatn. Det er sporet kilden mener med «følge skisporet et stykke og knekke ned til vannet».

Fra sporet tar linja av ned til vestenden av Heddersvatn på 1137 moh, og så går den på isen: 1810 meter flatt og opptil 213 meter fra land, forbi odden fra sørbreidda, som linja passerer 202 meter nord for. Heddersvatn er et naturlig vatn, ikke et regulert magasin, og kilden går over det — men det betyr at isen må bære, og det er din vurdering den dagen, ikke kartets.

Etter odden begynner stigningen, fra nordøstbreidda på 1143 moh. Den første kneika er den bratteste på turen: 21,7 grader mellom 1169 og 1187 moh, og terrenget på begge sider er brattere enn linja — innenfor 50 meter måler det 35 til 39 grader, både over og under deg, mellom 1159 og 1216 moh. Det er det nærmeste terrengmodellen kommer kildens «et parti der som kan være utsatt». Kilden sier ikke nøyaktig hvor partiet er.

Over kneika går det i trinn: bandet fra 1200 til 1300 moh måler 11,6 grader, og fra 1300 til 1400 moh 16,6 grader over 378 meter grunn, som er det bratteste bandet på turen. Toppkjegla er brattere enn ruta på flere sider — 41 til 45 grader 23 til 48 meter fra linja over 1375 moh, mot sør nederst og mot vest og sørvest mellom 1428 og 1440 moh — så hold linja. Den kommer opp på toppen fra nord. Blånipa står på 1462 moh, med Gaustatoppen i vest-nordvest.',
  description_down = 'Kilden kjører ned samme veg og skriver: «Husk hvor du gikk opp og pass deg for området som er utsatt for rasfare.» Det er ned mot Heddersvatn med Gaustatoppen foran deg. Rett vest fra toppen måler terrenget 18,7 grader i snitt over 700 meter, med 29,5 grader som bratteste 60-metersvindu, 60 til 120 meter ut — det er fjellsida ved sida av linja, ikke linja selv. Kneika ned mot isen er den samme som på veg opp, med det samme brattere terrenget på sidene.

Ikke ta snarveien sørvestover. Den sida er hamaren ned mot Heddersvatn der Hulderhola ligger, 429 meter sør for linja — 46,9 grader i bratteste vindu, 520 til 580 meter ut fra toppen. Fra vatnet er det samme veg tilbake over isen og opp til sporet, og de 76 høydemeterne du tapte på veg inn, går du opp igjen på veg ut.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 21,7 grader mellom 1169 og 1187 moh, i den første kneika opp fra isen, og bratteste hundremeteren er 1300 til 1400 moh med 16,6 grader. Linja selv er ikke bratt. Det er terrenget rett ved sida av den som er det.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Kilden ber deg finne fram Varsom-appen der stigningen begynner, etter odden, og velge partiet du går opp etter forholdene. Terrengmodellen viser hvorfor: i kneika mellom 1159 og 1216 moh måler terrenget 35 til 39 grader innenfor 50 meter på begge sider av linja, og 94 meter over linja står en knaus på 59 grader. Sørvestsida er hamaren ned mot vatnet, 46,9 grader, og østsida har et vindu på 39,5 grader 440 til 500 meter ut. Under stigningen ligger vatnet: det som løsner i lia over deg, går over linja og ut på isen. Ikke samle gruppa på isen under lia.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Vest-Telemark er en A-region og varsles daglig i sesongen. Sjekk isen på Heddersvatn også: turen går 1810 meter på den. Platået er snaufjell uten ly. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'heddersfjell';

update public.tk_tours set
  description_up   = 'Start på rasteplassen ved E134 rett øst for Haukelitunnelen, 994 moh. Pepparsteinen, som har gitt stedet navn, ligger i lia over, 33 meter fra linja ved 0,45 km. Fri Flyt: «Rett opp fra parkeringen går det et lite skar mellom Sveigen (1543moh.) og p1490. Når det begynner å flate ut tar du vest mot toppen.» Ut.no beskriver samme side som «Sveigen Nord»: den «kan nås fra Pepparsteinen ved øståpning av Haukelitunnelen, og har så å si ingen anmarsj». Ut.no sin hovedrute er en annen — østsida fra Ulevå over Ståvatn.

Skaret begynner med en gang. Bandet fra 1000 til 1100 moh måler 18,6 grader over 304 meter grunn, og det bratteste partiet på hele linja, 27,2 grader, ligger mellom 1115 og 1132 moh. Her er bakken under sporet brattere enn sporet: 22, 62 og 28 meter på 35 grader eller mer mellom 1084 og 1130 moh, med bratteste celle 54 grader. Ved siden av linja står enkeltceller på 51 til 62 grader — berg og kanter — 42 til 64 meter fra den mellom 1074 og 1304 moh.

Over 1200 moh slakker skaret av: 14,3 grader fra 1200 til 1300 og 8,9 fra 1300 til 1400. Ved 1400 moh, 1,59 km fra start, flater det ut, og linja svinger vestover. Den siste kilometeren til toppen stiger jevnt over åpent fjell, 10,7 grader fra 1400 til 1500 moh.

Toppen er nordtoppen, 1543 moh, der Kartverkets stedsnavnregister og Fri Flyt setter Sveigen. Massivets høyeste punkt ligger 659 meter lenger sør, 1560 moh, bak et søkk på 1513; ut.no oppgir 1561 og går dit. Toppflata er slak: 0,3 til 11,1 grader i snitt til alle kanter over 500 meter.',
  description_down = 'Fri Flyts letteste nedkjøring er samme vei ned som du gikk opp. «Ønsker du mer utfordring legger du sporet mer direkte ned. Hvis du gjør sistnevnte kan det bli brattere enn 35 grader.»

Nordrenna er den kjente linja, og den nås fra vest: Fri Flyts alternativ 1 følger gamlevegen fra Haukelitunnelen inn i Dyrskaret. Fri Flyt: «Nedkjøringen er smal med høye kantvegger. Renna er brattest på toppen.» Den er 35 grader noen meter øverst og ellers 30, og «Ved mye vind fylles ofte denne renna med snø, og du må kunne vurdere snøkvaliteten før du setter utfor.» Ut.no: «Helningen på nordsiden er over 30 grader, og bør kun kjøres under optimale forhold.»',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 27,2 grader mellom 1115 og 1132 moh, og bratteste bandet 18,6 grader fra 1000 til 1100. Bakken under sporet er 35 grader eller brattere på tre strekk på 22 til 62 meter mellom 1084 og 1130 moh, med bratteste celle 54 grader. Fri Flyt oppgir 30 grader som bratteste punkt og graderer turen «Moderat»; her er den grad 3, fordi skaret går rett opp i skredterreng uten anmarsj.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Ut.no: «Hele fjellet er et potensielt skredområde vinterstid, og på vår/sommer kan det være utglidningsfare om det er hardt føre.» Nordsida er ifølge ut.no «noe mer krevende og mer skredutsatt» enn østruta. Skaret ligger rett over vegen og parkeringa, så du har ingen anmarsj å bli kjent med snøen på før du står i det bratte. Ut.no: «Kunnskap om skred og snøforhold er nødvendig.»'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hardanger på varsom.no. Hardanger er en A-region og varsles daglig i sesongen. Starten ligger ved E134 over Haukelifjell; sjekk vegmeldingene før du kjører. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'sveigen';

update public.tk_tours set
  description_up   = 'Start i krysset der Blåbergdalsvegen går ut fra Odlandsvegen ved Røldal kraftverk, 396 moh, på østsida av Røldalsvatnet. Ut.no: «Start ved kraftstasjonen på østsiden av Røldalsvatnet, og følg veien oppover Tveitlia til litt forbi fjerde hårnålssving.» Fri Flyt starter ved Tveita: «Kjør inn til Tveita og parker nede ved veien hvis snøen ligger langt nok ned. Hvis ikke kjører du bilen opp anleggsveien og parkerer i ei passende lomme.» Det er ingen kartlagt parkeringsplass her. Linja passerer Tveita 132 meter unna ved 0,77 km.

Blåbergdalsvegen er anleggsvegen, og linja følger den gjennom fire hårnålssvinger: den første ved 1,01 km og 497 moh, den andre ved 1,52 km og 555, den tredje ved 2,16 km og 623 og den fjerde ved 2,44 km og 656. Det er slakt — 6,2 grader i bandet fra 400 til 500 moh og 5,7 fra 500 til 600. Lia over vegen er ikke slak: østover fra vegen ved 437 moh stiger den 255 meter på 400 meter, 32,5 grader i snitt og over 40 grader 260 til 300 meter ut. Den er skogkledd, men den ligger over deg hele veien opp svingene. Terrengmodellen leser vegskjæringer og fyllinger som korte strekk på 35 grader eller mer under linja mellom 405 og 542 moh; det er vegkanten, ikke lia.

Litt forbi fjerde sving, ved 2,75 km og 700 moh, forlater linja vegen og dreier nordover. Ut.no: «i henget ca 750 moh bør det foretas skredvurdering før eventuelt videre oppstigning, her er et kort parti med mulig skredfare.» Henget når du ved 3,02 km og 760 moh, og det er det bratteste på turen: 25,0 grader mellom 746 og 762 moh, og 13,9 grader i bandet fra 700 til 800.

Over henget går linja inn til bekken. Fri Flyt: «Følg den vestvendte bekken så langt den går, herfra ser du toppmasta.» Bekken er Gjertrabekk i stedsnavnregisteret; registerpunktet ligger på bekken i OSM. Fra 0,50 km har linja ligget sør for den. Ved 866 moh, 3,51 km fra start, krysser linja over til nordsida, og derfra følger den nordbredden eller bekkefaret oppover — slik ut.no-sporet gjør. Her er det bratt rett ved siden av: terreng på 40 grader og mer ligger 20 til 170 meter vest og nordvest for linja mellom 849 og 997 moh. Skogen slipper ved 937 moh. Ved 4,94 km og 1172 moh er linja 52 meter fra øverste kartlagte punkt på bekken.

Derfra er det 715 meter igjen til masta, med 13,8 grader i bandet fra 1100 til 1200 moh. Toppen er slak mot sør og sørvest, 8,2 og 9,5 grader i snitt over 500 meter, og det er den siden du kommer opp. Fri Flyt: «På varme dager varmer sola metallet på masta slik at isen fra masta faller ned.» Masta står 17 meter fra der linja ender; hold avstand til den på varme dager.',
  description_down = 'Fri Flyt: «Fra toppen kjører du mot bekken. Følg denne ned igjen. Det er ikke så bratt, men det er morsom og hyggelig kjøring tilbake til bilen. Hvis snøen ligger helt ned kjører du mot gården på Tveita.» Ut.no: «Returen kan legges mange veier, men hold deg syd for Gjertrabekk om du ikke vil ut i meget bratt terreng.» Linja ligger på nordsida av bekken fra toppen ned til 866 moh, der den krysser. Senest der skal du over på sørsida — fortsetter du nedover nord for bekken, kommer du ut i terrenget på 40 grader og mer vest og nordvest for linja.

Nord og vest for toppen er Fjetlandsnuten bratt: 52,8 grader 300 til 360 meter ut mot nord, 54,7 grader 420 til 480 meter ut mot nordvest og 35,8 mot vest. Fri Flyts Gravgjel-renne går ned vestsida: «Fra toppen kjører du først sørvestover ca. 600 meter før du dreier rett vest over en slak flanke. Etter 1, 4 km fra toppen finner du inngangen på renna her.» Den beskrivelsen følger denne linja ned — 1,4 km fra toppen er linja ved 1029 moh, og 300 meter nord for den står terreng på 56,4 grader. Renna er «Vanskelig», 55 grader øverst, med 550 meter fall og fare for skred og steinfall; «Den er brattest i toppen, og det bygger seg opp skavler her». Den er en egen nedkjøring for stabile forhold, ikke en del av denne turen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 25,0 grader mellom 746 og 762 moh, i henget ut.no ber deg vurdere før du går videre, og bratteste bandet 13,9 grader fra 700 til 800. Langs vegen opp Tveitlia er det vegkanten terrengmodellen leser som bratt. Fri Flyt oppgir 30 grader som bratteste punkt og graderer turen «Lett»; ut.no kaller den krevende.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Lia over Blåbergdalsvegen er 32,5 grader i snitt og over 40 grader i partier. Mellom 849 og 997 moh ligger terreng på 40 grader og mer 20 til 170 meter vest og nordvest for linja, og nord- og vestsida av toppen måler 52,8 og 54,7 grader i bratteste vindu. Ut.no advarer mot «meget bratt terreng» nord for Gjertrabekk på returen. Fri Flyt: isen faller av masta på varme dager.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hardanger på varsom.no. Hardanger er en A-region og varsles daglig i sesongen. Ut.no: «Tidlig og sent på sesongen kan det hende noe av veien er snøfri, og turen blir da noe kortere.» Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'fjetlandsnuten';

update public.tk_tours set
  description_up   = 'Start på den store parkeringa ved Nordstulvatnet, 714 moh. Ruta går slakt oppover gjennom åpen skog og krysser elva som renner ut av Sønstevatn, 746 moh; randofolk.no beskriver ei bru der. Bandet fra 700 til 800 moh måler 2,9 grader over 1785 meter grunn — det er den flate innmarsjen, og den er lengre enn den ser ut på kartet.

Så kommer stigningen. 11,2 grader fra 800 til 900 moh over 512 meter grunn, som er bratteste hundremeteren på turen, og 7,0 grader fra 900 til 1000. Skogen slipper taket ved 945 moh, og først på 952 moh er du i åpent terreng for godt. Det er her T-ruta deler seg: opp Langedalen, eller utsiktsløypa om Sigridsbu. Linja går opp Langedalen.

Øverst i Langedalen passerer linja 180 meter nord for Sigridsbu, som ligger på 1175 moh, og derfra flater det ut. Bandet fra 1100 til 1200 moh måler 3,8 grader over 1518 meter grunn — halvannen kilometer platå med vidåpen utsikt.

Toppanløpet er det bratte. Mellom 1290 og 1314 moh måler bratteste sammenhengende parti 35,2 grader, og det er sørsida av toppen randofolk.no beskriver som å «karre deg opp» når snøen er tynn. Alternativet i beskrivelsen er å gå langs fjellet og opp fra nordsida, som måler 5,8 grader i snitt. Varden står på 1343 moh.',
  description_down = 'To nedkjøringer er beskrevet, og de er ikke like. Samme veg tilbake går ned Langedalen og videre gjennom skogen mot Nordstulvatnet — randofolk.no skriver «vær oppmerksom på utløpssoner!» om akkurat den dalen, både på veg opp og på veg ned. Den andre går ned nordsida og østover mot Kongtjønn på 1225 moh, med et kort stykke til fots før det åpner seg.

Sørøstflanken rett under toppen bryter av i 41,5 grader i 60-metersvinduet 60 til 120 meter ut, og vest gir 45,0 grader lenger nede. Nord og nordvest er de slake, 16,0 og 19,6 grader i bratteste vindu. Blefjell er kupert, og kupert betyr her at linjevalget teller mer enn hellinga du står i: det er utløpet under deg som bestemmer.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti måler 35,2 grader og ligger i toppanløpet, mellom 1228 og 1251 moh. Bratteste hundremeteren er 800 til 900 moh med 11,2 grader over 512 meter grunn — kneika opp mot skoggrensa. Resten av ruta er slak: 2,9 grader på innmarsjen og 3,8 grader over platået fra 1100 til 1200 moh.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Langedalen er stedet på dette fjellet der skred faktisk teller, og kilden sier det selv to ganger: utløpssoner, både i oppstigningen og i nedkjøringa. Rutas eget bratteste steg, 35,2 grader, ligger på sørsida snaut 500 meter fra varden; sørøstradialen ved sida av måler 41,5 grader i bratteste 60-metersvindu, 60 til 120 meter ut, og vestflanken 45,0 grader 430 til 490 meter ut. Nordsida er den slake veien opp og ned. Over tregrensa er berget hardt og jordlaget tynt, og vinden pakker snøen deretter.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Telemark sør på varsom.no. Telemark sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'store-ble';

update public.tk_tours set
  description_up   = 'Fra nordenden av parkeringa ved Nordstul, 714 moh, går stien ned til høyre og over Esperåa på bru, 730 moh. Hold til høyre og følg den kloppelagte stien til setervollen Sudstul, 727 moh, der DNT-ruta mellom Selsli og Sigridsbu krysser.

Rett før siste hytta på vollen tar du av til høyre på umerket, men godt synlig sti. Nå går det nordover og oppover gjennom skog og myr: bandet fra 700 til 800 moh måler 2,6 grader over 1889 meter grunn og 800 til 900 moh 4,2 grader over 1346. Skogen slipper taket ved 951 moh.

Ved Vassholet, 993 moh, snur ruta. Herfra følger du det ytre høydedraget sørover langs Surløyterinden, 1085 moh, og bratteste sammenhengende parti på hele turen ligger i kneika opp dit: 24,9 grader mellom 994 og 1014 moh. I selve søkket går linja 45 meter over et tjern på 1068 moh, 10 meter fra land — et hjørnekutt, og tjernet er naturlig og uten navn i registeret.

Ryggen sørover er nesten flat — bandet fra 1000 til 1100 moh måler 2,8 grader over 1697 meter grunn — og ender ved varden på 1097 moh. I nordvest ser du Tverrgrønuten, Blerinden og Bletoppen.',
  description_down = 'Samme veien tilbake er nordover langs ryggen først, og den er så slak som en rygg blir: 2,2 grader i snitt over 500 meter, med bratteste 60-metersvindu på 5,7 grader. Det er ikke en nedkjøring, det er en gåtur med ski på.

Den andre returen i beskrivelsen er bratt nedstigning mot sør til DNT-stien, og den er nedkjøringa: sørflanken måler 13,5 grader i snitt over 500 meter med bratteste 60-metersvindu på 29,5 grader, 400 til 460 meter ut. Østsida gir 25,1 grader nærmere toppen. Blefjell har en sårbar villreinstamme, og ut.no ber uttrykkelig om at det tas hensyn — det er en god grunn til å holde seg til de to beskrevne linjene framfor å legge egne spor over platået.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Slakt terreng nesten hele veien. Bratteste hundremeteren, 900 til 1000 moh, måler 5,3 grader over 1216 meter grunn, og bratteste sammenhengende parti 24,9 grader mellom 994 og 1014 moh — kneika opp mot Vassholet. Ruta gir tilbake 79 høydemeter underveis, og de ligger i søkket ved Vassholet som beskrivelsen går gjennom.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Den bratte nedstigningen mot sør er det ene stedet hellinga teller: 29,5 grader i bratteste 60-metersvindu, 400 til 460 meter ut fra varden, og den er samtidig det anbefalte returalternativet. Velg den etter forholdene, ikke etter kartet. Ryggen langs Surløyterinden er avblåst i vind og kan være hard og isete mens sørsida er myk.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Telemark sør på varsom.no. Telemark sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'surloytenuten';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Ravalsjø, 483 moh, og følg skilting og merking forbi Ormetangen, 476 moh, og opp lia øst for vatnet. Dette er skogsterreng med oppkjørte løyper, og de er det som gjør turen til en dagstur: bandet fra 400 til 500 moh måler 0,6 grader over 1848 meter grunn.

Videre forbi Skrimsetra, 591 moh, og over Fugleleikskarva, 635 moh. Bandet fra 500 til 600 moh måler 1,7 grader over 3359 meter grunn og 600 til 700 moh 1,5 grader over 3685 — det er nesten sju kilometer skog og myr mellom 483 og 700 moh. Kartverket klasser punktet på 611 moh som dyrket mark — det er setervollen på Sørmyrseter, like før hytta.

Fem steder går linja over is, 1541 av de 9608 meterne. Den lengste kommer med en gang: 630 meter tvers over Ravalsjø på 475 moh, forbi holmen Kjelen, før ruta tar opp lia øst for vatnet. Så Skrimsvannet på 575 moh to ganger, 191 og 270 meter, Urdstjerna på 594 moh på 225 og Stulstjernet på 602 moh på 225. Alle fem er naturlige vatn, ingen av dem regulert, og ingen kryssing går mer enn 99 meter fra land — dette er smale skogsvatn løypa går tvers over, og DNTs egen vinterkjede fra Ravalsjø går gjennom det samme terrenget. Men is er is: det er de eneste stedene på en ellers rolig løypetur der underlaget ikke er bakke, og tidlig og sent i sesongen er de verdt et blikk før du går ut på dem.

Sørmyrseter ligger på 620 moh, og herfra oppgir DNT rundt 240 høydemeter opp til Styggemann. Nå begynner turen å stige på ordentlig: 14,6 grader fra 700 til 800 moh over 404 meter grunn, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Skogen slipper taket ved 700 moh, og på 830 moh er du i åpent terreng.

Det siste bandet, 800 til 900 moh, er det bratteste: 15,1 grader over bare 244 meter grunn. Ut.no kaller oppstigningen «temmelig bratt». Rådet deres om å sette igjen sekken i stikrysset gjelder den andre adkomsten, fra Ivarsbu i øst, der krysset ligger vest på Jotefjell, sørøst for varden. Varden står på 871 moh, og Styggemannshytta ligger rett ved.',
  description_down = 'Ned samme veien, sørover og så vestover langs løypa. Peilinga fra varden til Sørmyrseter er 172 grader, og akkurat den radialen måler 29,1 grader i bratteste 60-metersvindu, 70 til 130 meter ut, med et steg på 35,1 grader mellom 120 og 150 meter. Noen få grader til hver side endrer tallet mye: 165 grader gir 36,8 og 180 gir 25,1. Fallinja til setra er altså ikke det mildeste valget, og driver du vestover fra den blir det brattere, ikke slakere.

De andre sidene av toppen er ikke det. Øst måler 48,5 grader i 60-metersvinduet 30 til 90 meter under varden, sørøst 45,3 grader 20 til 80 meter ut, og nordøst 43,9 grader. Det er innenfor hundre meter av der du står med kaffekoppen. Sørvest ser slakt ut med 9,0 grader i snitt, men har et 38,6 graders vindu 160 til 220 meter ut — det er den fella på dette fjellet som ikke ser ut som en felle.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Sju kilometer skogsterreng under 2 grader, og så en kilometer som stiger: 14,6 grader fra 700 til 800 moh og 15,1 fra 800 til 900, med bratteste sammenhengende parti 23,2 grader mellom 700 og 719 moh. Ruta gir tilbake 159 høydemeter over de rullende skogsryggene mellom Ravalsjø og Sørmyrseter. Ruta krysser dessuten 1541 meter is fordelt på fem vatn mellom 475 og 602 moh — ikke skredterreng, men heller ikke bakke.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Toppen er brattest der ingen har tenkt seg: øst 48,5 grader, sørøst 45,3 og nordøst 43,9 i bratteste 60-metersvindu, alle i vinduer som starter 20 til 40 meter ut fra varden. Ruta kommer fra sørsørøst: peiling 172 mot Sørmyrseter måler 29,1 grader i bratteste 60-metersvindu, og rett sør, 180 grader, 25,1 grader i vinduet 130 til 190 meter ut. Skrim ligger lavt nok til at snøen kommer og går — ut.no fører skisesongen som januar til mars — og de oppkjørte løypene mellom Ravalsjø og Sørmyrseter er det som gjør turen gjennomførbar på en dag.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Buskerud sør på varsom.no. Buskerud sør er en B-region: den varslet bare ved faregrad 4 og 5, så de fleste vinterdager finnes det ingen vurdering å lese, og en tom side betyr ikke et trygt fjell. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'styggemann';

update public.tk_tours set
  description_up   = 'Fra parkeringa ved bommen innerst i Berdalen hyttegrend, 810 moh, går ruta østover. Peilinga fra parkeringa til toppen er 82 grader — Berdalen ligger vest for fjellet, og du går inn mot det hele dagen. Riksveg 9 mellom Bykle og Hovden er brøytet hele vinteren, og ut.no presiserer at du ikke skal kjøre den siste kilometeren etter bommen: «Veien er privat.» Den første kilometeren deler trasé med oppkjørte løyper i Berdalen; linja her er terrenglinja og ikke løypa.

Forbi Langemyr på 891 moh går det jevnt oppover mot Tverrheiskaret på 1028 moh. Dette er den eneste stigninga på turen som kjennes som en stigning: bratteste 30 meter måler 26,2 grader mellom 1000 og 1022 moh, 2350 meter ute, og bratteste 400 meter 13,7 grader fra 963 til 1062 moh. Skogen står høyt her: DTM1 gir terrengklasse Skog i selve Tverrheiskaret på 1028 moh. Langs linja står skogen til 1044 moh, og fra 1052 er det åpent.

Over Tverrheii og Tverrheitjønnane holder du øst til Tverrheiskardet på 1156 moh. Her er en felle verdt å kjenne: SSR har tre skarpunkt på strekninga, og to av dem heter Tverrheiskaret — det du gikk over på 1028 moh, og ett til på 1091 moh som ligger bare 305 meter fra Tverrheiskardet på 1156. Det er det siste paret som er lett å blande, ikke det første. Bandet 1100 til 1200 moh måler 1,3 grader over 4455 meter grunn — det er over fire kilometer nesten flatt høyfjell, og det er her en tur uten merking blir en navigasjonsjobb.

Fra Tverrheiskardet faller linja 47 meter over 535 meter grunn ned i Gjuvvatn-bassenget, og så 32 meter til, ned på Midtre Gjuvvatn. Der går den 720 meter over vatnet på 1124 moh, høyst 55 meter fra land — den eneste iskryssinga på turen. Vatnet er naturlig: DTM1 gir terrengklasse Innsjø, og OSM-relasjonen (name=Midtre Gjuvvatn, ele=1124, ref:nve:vann=13750) bærer ingen reservoartagger. Turskildringene går samme veien.

Fra østenden av vatnet på 1137 moh stiger ruta jevnt østover forbi vegpunktet på 1225 moh — det ligger på fast mark like vest for det nederste av de to små vannene, ikke på vatnet selv — og siste kilometeren går opp vestflanken. Bandet 1400 til 1500 moh måler 11,9 grader over 499 meter grunn, det bratteste på hele turen. De siste 500 meterne går på peiling 78 grader og stiger 115 meter til toppen på 1506 moh. ut.no fører 1507; DTM1 gir 1506,49 på det registrerte punktet, og en halv meter er ikke en uenighet verdt navnet.',
  description_down = 'Ned samme vei, og ned vestsida. Fallvektet gjennomsnittsretning er 258 grader, altså vest-sørvest, som er den flanken du kom opp. Sveipet fra toppen gir 9,8 grader i snitt vestover og 9,2 sørvestover ut til 1000 meter — det er slakt nok til at nedkjøringa mest er transport, men også slakt nok til at du ikke trenger lete etter noe bedre.

Og det er poenget. Den eneste bratte sida på Sæbyggjenuten er nordsida, og den er skavlkantet: 15,0 grader i snitt nordover mot 9,8 vestover, med et bratteste 60-metersvindu på 41,9 grader 460 til 520 meter ute, 42,3 grader nordøstover og 46,1 grader på peiling 10 grader. Skavlen står på de siste høydemeterne, og i flatt lys ligger kanten der uten at terrenget varsler. Kom opp vestsida og gå ned vestsida.

Den andre feilen er lengden. Elleve kilometer inn — 11,30 km måler linja — med over fire kilometer flatt høyfjell mellom 1100 og 1200 moh, betyr at værvinduet og ikke hellinga styrer turen. Merking finnes ikke; sti finnes så vidt. ut.no skriver «Gå stien inn til Langemyr», og OSM har én umerket traktorvei på den første strekninga — etter det er det terreng. Snur du på Gjuvvatn, har du sju kilometer igjen til bilen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja har lite skredterreng i seg. Bratteste 30-meterssteg er 26,2 grader i oppgangen til Tverrheiskaret, bratteste 60 meter 19,6 grader, bratteste 200 meter 16,1 og bratteste 400 meter 13,7. Det bratteste hele høydebandet, 1400 til 1500 moh, måler 11,9 grader over 499 meter grunn. Det som kan gå galt på selve linja er isen på Midtre Gjuvvatn sent i sesongen, og at 720 meter er langt å være ute på den.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Vest, sørvest, sør og sørøst ligger alle mellom 6,5 og 9,2 grader i snitt ut til 1000 meter fra toppen. Nord og nordøst gjør ikke det: 15,0 og 14,3 grader i snitt, med bratteste 60-metersvindu på 41,9 og 42,3 grader, og 46,1 grader på peiling 10 grader 430 til 490 meter ute. Skavlen på nordkanten er dokumentert på de siste høydemeterne. Toppen er en enkel, slak kuppel fra tre kanter og noe helt annet fra den fjerde.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Kortet sier Setesdal, og det er dalen du starter i — parkeringa i Berdalen ligger i Bykle i Agder — men toppunktet ligger i Tokke i Telemark, så Varsom-regionen stemmer nøyaktig med koordinaten. Søker du på Setesdal, finner du ingenting. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'saebyggjenuten';

update public.tk_tours set
  description_up   = 'Fra parkeringa på Øygardstøl, 641 moh, følger du Lysevegen sørover. Veien er vinterstengt — OSM har motor_vehicle:conditional=no @ Nov-May og snowplowing=no på fylkesvei 4224, og Sirdal kommune bekrefter det — så dette er en vårtur og ikke en vintertur. Linja her ligger aldri mer enn 100 meter fra kartlagt vei, men den kutter hårnålssvingene — svinger, ikke stigning. Det bratteste 30-meterssteget på hele ruta ligger oppe: 29,6 grader mellom 1083 og 1102 moh, på Kjeragplatået.

Ved Stølsdalen bru på 850 moh tar anleggsveien mot Langavatn av, og du følger Langvassvegen sørvestover. På 925 moh går linja 225 meter over et umerket vatn like ved veien, høyst 24 meter fra land. Terrengklassen i DTM1 er Innsjø og ikke InnsjøRegulert, og OSM-polygonet (way 1312542069, ref:nve:vann 195944) bærer ingen reservoartagger — det er et naturlig vatn, ikke et magasin. Veien er den egentlige ferdselslinja her; vatnet ligger der linja skjærer svingen.

På 944 moh forlater du veien og holder vest inn på Kjeragplatået. Peilinga fra veipunktet til toppunktet er 265 grader — rett vest. (Korridorforskninga oppga 271; den målte mot et toppunkt som ligger 338 meter fra det registrerte.) Turbeskrivelsene skriver «mot nordvest», og nordvest derfra fører til Kjeragbolten, som ligger 1921 meter fra toppunktet på peiling 10 grader. Det er et annet mål og en annen rute — og varden turbeskrivelsene snakker om står oppe ved bolten, ikke der linja ender; ut.no skriver at «Kjeragbolten ligger ca. 300 meter sør for varden».

Over platået er det slakt hele veien: bandet 900 til 1000 moh måler 4,2 grader i snitt over 1433 meter grunn, bandet 1000 til 1100 moh 2,3 grader over 2746 meter. Linja går tvers over fire vatn til: 45 meter på 975 moh, 45 meter på 1064 moh, 686 meter på 1075 moh med høyst 32 meter til land, og 90 meter på 1080 moh. Alle er naturlige. Til sammen går ruta 1091 av 7362 meter på vatn. Det som gjør platået krevende er ikke helninga, men at det er svaberg uten merking, med korte brå kanter mellom slake parti — det bratteste 60-metersvinduet rett vest for toppunktet måler 38,1 grader og ligger bare 90 meter ute.

Siste etappe kommer inn fra øst over litt høyere mark. Linja topper på 1129 moh 6640 meter ute, faller 66 meter til 1063, og stiger så 21,2 grader over 60 meter fra 1077 til 1112 moh — det bratteste sammenhengende partiet på turen — før de siste 500 meterne går på peiling 294 grader og stiger 59 meter til toppunktet på 1124 moh. Høyeste mark på hele platået er 1163,7 moh og ligger 1347 meter øst-nordøst; toppunktet her er det registrerte Kjerag-punktet, ikke det høyeste.',
  description_down = 'Samme vei tilbake. Fallvektet gjennomsnittsretning for nedkjøringa er 49 grader, altså nordøst, og med bare 620 høydemeter fordelt over 7,4 kilometer er dette mer transport enn nedkjøring. Det gode partiet er de to kilometerne ned Langvassvegen og Lysevegen, som er bred og jevn så lenge det ligger snø på den.

Vanligste feil på platået: å gå nordover for å se ned i Lysefjorden. Rett nord fra toppunktet holder platået seg på 1008 til 1016 moh helt ut til 1850 meter — det er flatt, det ser ut som mer platå, og du merker ingenting. Så faller terrenget 71,4 grader over de neste femti meterne og 77,4 grader over de femti etter det, og på 2000 meter ute er bakken under 800 moh. Sjøen ligger 2,6 kilometer nord. Den tegnede linja kommer aldri nærmere enn 1675 meter fra bakke under 800 moh, og det nærmeste punktet er selve toppunktet. Kanten kommer uten varsel i tåke og flatt lys, og det er den ene feilen som ikke går an å rette opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Skredterreng i vanlig mening fins nesten ikke på denne linja. Bratteste 30-meterssteg er 29,6 grader mellom 1083 og 1102 moh, på platået; bratteste 60 meter er 24,9 grader og bratteste 100 meter 22,8, begge i et søkk på platået ned til 1067 moh, og bratteste 400 meter 11,8 grader. Ingen av de sju høydebandene over 700 moh måler mer enn 5,8 grader i snitt. Det som faktisk kan gå galt her er å tråkke gjennom is på et av de fem vatnene sent i sesongen, og å bomme på kanten mot nord.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Fra toppunktet ligger sju av åtte retninger under 13 grader i snitt innenfor 200 meter, og sør måler minus 0,4 grader. Lenger ut skiller to seg ut: vest faller 38,1 grader i det bratteste 60-metersvinduet allerede 90 meter fra toppunktet, og sørvest 54,8 grader 800 meter ute. Begge er korte skrenter i svaberget, ikke samlefelt — men i flatt lys ser de ut som resten av platået helt til du står på dem. Nordsida er noe annet: det er en vegg på over tusen meter ned i Lysefjorden, og den begynner 1850 meter nord for toppunktet uten at terrenget varsler.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Heiane på varsom.no. Ta med sender/mottaker, søkestang og spade. Sjekk også om Lysevegen er åpen. ut.no sier det slik: «Rv500 mellom Sirdal og Lysebotn stenges når første snøfall kommer i okt/nov og åpner ikke før mai/juni.» Uten åpen vei er det ingen tur.'
    )
  )
where slug = 'kjerag';

update public.tk_tours set
  description_up   = 'Linja starter der den forlater fv. 450 ved Storekvæven, 570 moh, nord for Fidjeland. Fri Flyt: «Parker i Store Kvæven og følg Bekkene opp til det flater ut.» Det er ingen kartlagt parkering ved Storekvæven; nærmeste offentlige parkering ligger 1,7 km nord, ved bensinstasjonen. Alternativet er å starte fra Fidjeland, der ut.no-stien går opp langs skiheisen.

Linja går opp langs Bekkene: bandet fra 600 til 700 moh er det bratteste på turen, 13,5 grader over 405 meter grunn, og du er ute av skogen ved 795 moh, 1,4 km fra start. Flata når du på 800 moh etter 1,52 km; et lite tjern ligger 84 meter fra linja like før.

Fri Flyt: «Følg myra sørover før du dreier øst opp bakkene.» Linja gjør det. Bratteste sammenhengende parti er 23,1 grader mellom 842 og 857 moh, og bandet fra 900 til 1000 moh er 855 meter grunn på 6,0 grader. Mellom 916 og 955 moh står små bergkanter på 45 grader eller brattere 8 til 19 meter fra linja. Linja dreier østover ved 1102 moh, etter 3,34 km.

Opp bakkene måler bandene fra 1000 til 1200 moh 12,2 og 9,3 grader, og mellom 1083 og 1117 moh står bergkanter 12 til 20 meter fra linja. Bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende. Fri Flyt: «Det lille bygget som ligner på et kinahus står på toppen av Hilleknuten.» I kartet er det et 23 meter høyt kommunikasjonstårn; hold avstand om vinteren, det kan falle is.

Toppen er slak i snitt mot nord, nordøst, øst, sørøst og sørvest, 6,3 til 10,6 grader over 500 meter, men østkanten har 31,8 grader 20 til 80 meter ut, og toppen faller brattere mot vest og nordvest, 37,0 og 38,2 grader 260 til 380 meter ut, og 39,7 grader 240 til 300 meter ut mot sør.',
  description_down = 'Fri Flyt: «Fra toppen av Hilleknuten kan du kjøre ned flere steder. Hvis du sikter rett på myrene får du en veldig fin nedkjøring.» Vest- og nordvestsida av toppen er 37,0 og 38,2 grader 260 til 380 meter ut; den slakeste vegen ned er linja, sørvestover og ut på myrene.

Fri Flyt: «Når du ankommer flatene ved myra anbefales det å gå opp på den lille toppen p1012 før du kjører ned til myra igjen. Avslutt dagen med å gå opp til Kviturdfjellet, da slipper du å gå over flatene og du får en bra nedkjøring tilbake til bilen.» Og: «Det anbefales at du utforsker området mer enn hva som står i boka.»',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 23,1 grader mellom 842 og 857 moh, og bratteste bandet 13,5 grader fra 600 til 700. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter. Fri Flyt oppgir 35 grader som bratteste punkt og graderer turen «Moderat».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Sør-, vest- og nordvestsida av toppen er 37,0 til 39,7 grader i de bratteste vinduene, og østkanten 31,8 grader like ved toppen. Like under toppen, ved 1186 moh, står en bergkant på 64,1 grader 47 meter øst for linja.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Heiane på varsom.no. Heiane er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'hilleknuten';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Smølåsveien på Fidjeland, 695 moh. Fri Flyt: «Kjør inn ved Leitet og parker i enden av veien.» Smølåsveien ender 0,2 km lenger sør. Fri Flyt: «Gå slik at du kommer inn i skaret mellom p893 og vannet på 850 moh. Det ligger ofte skiløype denne veien.» Linja krysser den kartlagte skiløypa etter 0,28 km og går østover; bratteste sammenhengende parti er 23,1 grader mellom 717 og 732 moh, nederst.

Bandene fra 700 til 900 moh måler 10,3 og 9,4 grader, og du er ute av skogen ved 856 moh, 1,0 km fra start. Skaret, mellom en liten kolle på 885 moh og vatnet, går du gjennom fra 1,04 til 1,20 km på 862–868 moh; vatnet, på 859 moh i kartet, ligger 27 meter fra linja ved 1,09 km. Hold deg på land. Fri Flyts p893 finnes ikke i terrengmodellen; kollen sør for linja er 885 moh, 66 meter unna.

Fri Flyt: «Ta av opp den vestvendte flanken og følg til topps.» Bandet fra 900 til 1000 moh er det bratteste, 17,6 grader over 315 meter grunn, og 1000 til 1100 måler 13,6. Mellom 932 og 1023 moh står små bergkanter på 45 grader eller brattere 4 til 20 meter fra linja, og ved 1046–1051 moh går linja over et bergsteg på 10 meter med bakke på 35 grader eller mer. Det siste bandet, 1100 til 1200, er 424 meter grunn på 11,2 grader opp til toppen. Ut.no skriver om varden: «Det er bygget varde også på det høyeste punktet (1184 moh) litt lenger nordvest (det er vel selve Grubbå).»',
  description_down = 'Fri Flyt: «Kjør ned flanken og hjem samme vei som du kom, eller velg en mer dirkete rute ned mellom ryggen og den nordlige bekkedalen. På slutten får du litt artig skogskjøring før du svinger av til bilen.»

Toppen er slak til alle kanter, 3,0 til 14,5 grader i snitt over 500 meter. Bratteste vindu er 30,6 grader 20 til 80 meter ut mot sørøst.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 23,1 grader mellom 717 og 732 moh, og bratteste bandet 17,6 grader fra 900 til 1000. Bakken under linja er 35 grader eller brattere bare i et bergsteg på 10 meter ved 1046–1051 moh. Fri Flyt oppgir 27 grader som bratteste punkt og graderer turen «Lett».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Små bergkanter langs flanken, 4 til 20 meter fra linja mellom 932 og 1023 moh. Vatnet i skaret ligger 27 meter fra linja; isen kan være svak.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Heiane på varsom.no. Heiane er en A-region og varsles daglig i sesongen. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'grubba';

update public.tk_tours set
  description_up   = 'Start på parkeringa ved Hunnedalsveien, 674 moh. Fri Flyt: «Parker på parkeringsplass ved kraftstasjonen, eller på en større parkering litt lengre nede.» Kraftstasjonen er ikke kartlagt. Fri Flyts startsted er «Gravasstølan/Bekkekrogan», og registerets Bekkekrokan ligger 0,48 km nordvest for parkeringa. Fri Flyt: «Gå opp en svak ryggformasjon ved Finndokje.» Linja går rett nordover på den: bandene fra 700 til 900 moh måler 12,0 og 12,9 grader, og du er ute av skogen ved 803 moh, 0,59 km fra start. Nederst, mellom 688 og 712 moh, står små bergkanter på 45 grader eller brattere 4 til 19 meter fra linja.

Bratteste sammenhengende parti er 24,6 grader mellom 838 og 857 moh. P905 når du på 906 moh etter 1,08 km. Fri Flyt: «Gå opp en liten renne sørøst for p905. Fortsett på ryggen til toppunktet.» Linja holder seg på ryggen på sørkanten av renna, ikke nede i den, fordi renna leder opp mot Røsehola, en hylle i vestsida på 949 moh.

Fri Flyt: «På 990 moh. henger en skavl ut mot Røsehola. Denne knekker mye lenger inn enn du tror, så hold avstand.» Det finnes ingen veg opp som holder seg langt unna den kanten. Fra 1,41 til 1,56 km, ved 989–1007 moh, går linja langs kanten mot Røsehola, og bakke på 37 grader eller brattere står 5 til 31 meter fra linja — der skavlen henger. Hold deg på øst- og sørsida av ryggen der. Sørsida av toppen er også bratt, 39,7 grader 30 til 90 meter ut. Bakken under linja er aldri 35 grader eller brattere i 15 meter sammenhengende.',
  description_down = 'Fri Flyts nedkjøringer er brattere enn linja. Røsehola: «Veien går ned i en spennende gryteformasjon. Her legger det seg lett fin snø da vinden får dårlig tak.» Sørrenna: «Ei herlig sørvendt fordypning går helt ned til veien.» Begge har 35 grader som bratteste punkt, og Røsehola går rett under skavlen.

Toppen er nesten flat mot nord og nordøst, 3,1 og 4,3 grader i snitt over 500 meter, men faller bratt mot sør og sørøst: 39,7 grader bare 30 til 90 meter ut mot sør, og 56,7 grader 390 til 450 meter ut mot sørøst.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Bratteste sammenhengende parti er 24,6 grader mellom 838 og 857 moh, og bandene fra 700 til 1000 moh måler 11,2 til 12,9 grader. Bakken under linja er ikke 35 grader eller brattere i noe sammenhengende strekk på 15 meter. Fri Flyt oppgir 30 grader som bratteste punkt og graderer turen «Lett».'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Skavlen på 990 moh henger ut mot Røsehola og knekker langt inn, og fra 1,41 til 1,56 km går linja 5 til 31 meter fra kanten. Sørsida av toppen er 39,7 grader 30 til 90 meter ut.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Heiane på varsom.no. Heiane er en A-region og varsles daglig i sesongen. Fv. 450 gjennom Hunnedalen kan bli stengt i uvær. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'roseknuten';

-- gpx_path stays NULL everywhere: the GPX served by app/api/gpx/[slug] is
-- generated from lib/routes.ts, not from a recorded track uploaded to
-- Supabase Storage. Set this once surveyed files exist.
