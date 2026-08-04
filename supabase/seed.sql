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
  ('storgalten',      'Storgalten',      'Lyngen',     69.88543, 20.25257, 1219, 1219, '5–7 t', 3, 'NV', 'feb–mai', 'Fjord-til-topp i ytre Lyngen: 1219 høydemeter rett opp fra havnivå.', true),
  ('store-blamann',   'Store Blåmann',   'Troms',      69.73502, 18.59147, 1044, 1040, '4–6 t', 3, 'S',  'feb–mai', 'Kvaløyas brattest profilerte klassiker — krever stabile forhold og god planlegging.', true),
  ('tromsdalstinden', 'Tromsdalstinden', 'Troms',      69.6071, 19.14585, 1238, 1200, '5–7 t', 2, 'V',  'des–mai', 'Tromsøs signaturtopp: lang, jevn oppstigning fra Tromsdalen med storslått utsikt mot Lyngen.', true),
  ('rornestinden',    'Rørnestinden',    'Lyngen',     69.57329, 20.11187, 1041, 1000, '4–6 t', 2, 'V',  'jan–mai', 'Den vennligste inngangen til Lyngsalpene, med slak rygg og romslig nedkjøring.', true),
  ('hamperokken', 'Hamperokken', 'Troms', 69.5621, 19.35872, 1397, 1400, '5–7 t', 4, 'NV', 'feb–mai', '1400 høydemeter fra Fv91, men skiene settes igjen på Middagsaksla 1076 moh – siste 1,4 km er eksponert rygg til fots.', true),
  ('kavringtinden',   'Kavringtinden',   'Lyngen',     69.54704, 20.12428, 1289, 1240, '5–7 t', 3, 'N',  'mar–mai', 'Indre Lyngen-perle med nordvendt snø som holder seg langt ut i mai.', true),
  ('hesten-segla',    'Hesten (Segla)',  'Senja',      69.51388, 17.58462,  556,  510, '2–4 t', 2, 'S',  'jan–apr', 'Kort tur, stort postkort: nedkjøring med Segla i fanget og havet under.', true),
  ('keipen', 'Keipen', 'Senja', 69.4953, 17.72324, 938, 840, '3–5 t', 3, 'S', 'jan–mai', '837 høydemeter fra Medfjordbotnvatnan gjennom skåla sør for toppen, jevnt 33 grader opp mot toppryggen.', true),
  ('breitinden', 'Breitinden', 'Senja', 69.45168, 17.65623, 1007, 1020, '4–6 t', 4, 'SV', 'jan–apr', '1020 høydemeter fra Svarthola via Svartholvatnet og Breitindvatnet; de siste 140 er klyving på sørvestryggen.', true),
  ('rombakstotta',    'Rombakstøtta',    'Narvik',     68.43312, 17.58324, 1243, 1100, '5–7 t', 3, 'SV', 'feb–mai', 'Narviks spisse landemerke — variert oppstigning og fin, vedvarende nedkjøring.', true),
  ('geitgaljen', 'Geitgaljen', 'Lofoten', 68.34434, 14.81302, 1085, 1070, '4–6 t', 4, 'NV', 'feb–apr', '1065 høydemeter fra Liland opp Lilandsdalen; renna fra 250 til 360 moh er 35 grader, og toppen krever stegjern.', true),
  ('himmeltindan',    'Himmeltindan',    'Lofoten',    68.22041, 13.57328,  962,  960, '4–6 t', 3, 'Ø',  'feb–apr', 'Vestvågøys høyeste, med alpint preg og linjer rett mot Nordishavet.', true),
  ('stornappstinden', 'Stornappstinden', 'Lofoten',    68.1441, 13.41493,  740,  680, '3–5 t', 2, 'N',  'jan–apr', 'Lofot-klassiker i overkommelig format — mye fjell for høydemeterne.', true),
  ('kirketaket',      'Kirketaket',      'Romsdal',    62.61158,  7.90672, 1439, 1270, '5–6 t', 2, 'SV', 'des–mai', 'Norges kanskje mest populære topptur: bred rygg, trygge linjevalg, lang sesong.', true),
  ('snohetta',        'Snøhetta',        'Dovrefjell', 62.31992,  9.26747, 2286,  820, '5–7 t', 2, 'Ø',  'apr–jun', 'Storslått og luftig, men overraskende snill — når Snøheimvegen åpner.', true),
  ('kolastinden',     'Kolåstinden',     'Sunnmøre',   62.25886,  6.31102, 1432, 1080, '5–7 t', 3, 'N',  'feb–mai', 'Alpin klassiker fra Standaldalen med velkjent renne og storslått finish.', true),
  ('saudehornet', 'Saudehornet', 'Sunnmøre', 62.23578, 6.14246, 1303, 1160, '4–6 t', 3, 'SV', 'jan–mai', '1154 høgdemeter frå vassverket i Ørsta, og sørryggen held 33–39° dei siste 170.', true),
  ('slogen',          'Slogen',          'Sunnmøre',   62.20818,  6.67306, 1564, 1480, '6–8 t', 4, 'V',  'mar–mai', 'Sunnmørsalpenes dronning — en alvorlig tur for erfarne, i riktig vindu.', true),
  ('jakta', 'Jakta', 'Sunnmøre', 62.1711, 6.61671, 1589, 1560, '6–8 t', 3, 'SØ', 'feb–mai', '1560 høgdemeter frå Norang: slak stigning inn Konedalen, så ei 33-graders side opp på den smale toppryggen.', true),
  ('skarasalen', 'Skårasalen', 'Sunnmøre', 62.16566, 6.48583, 1542, 1440, '6–8 t', 3, 'V', 'jan–mai', '1438 høgdemeter frå bommen på Kvistadvegen, med det brattaste opp mot skaret på 1074 moh.', true),
  ('rondslottet',     'Rondslottet',     'Rondane',    61.9149,  9.8512, 2178, 1240, '6–8 t', 2, 'S',  'mar–mai', 'Rondanes høyeste: rolig høyfjellsterreng og stabil vårsesong.', true),
  ('storronden', 'Storronden', 'Rondane', 61.8917, 9.86198, 2139, 1140, '6–8 t', 2, 'SV', 'mars–mai', '1140 høydemeter fra Spranget: seks kilometer innmarsj til Rondvassbu, så 2,6 km jevn vestrygg fra stidelet på 1440 moh.', true),
  ('skala',           'Skåla',           'Nordfjord',  61.86923,  6.97251, 1848, 1820, '6–8 t', 3, 'SV', 'mar–jun', '1848 sammenhengende høydemeter fra fjorden i Loen — en av landets lengste nedkjøringer.', true),
  ('glittertinden', 'Glittertinden', 'Jotunheimen', 61.65138, 8.5575, 2451, 1180, '7–9 t', 3, 'SØ', 'juni–juli', '12,6 km og 1180 høydemeter fra Veodalen: 7 km flat innmarsj til Glitterheim, så jevn stigning øst for Glitterbrean.', true),
  ('galdhopiggen',    'Galdhøpiggen',    'Jotunheimen',61.63644,  8.31243, 2469, 630, '6–8 t', 3, 'N',  'apr–jun', 'Norges tak på ski — bre, tau og stor høyde; vanligvis gått fra Juvasshytta.', true),
  ('steindalsnosi',   'Steindalsnosi',   'Sogn',       61.52696,  7.90076, 2025,  760, '3–5 t', 1, 'S',  'apr–jun', '2000-meter for de fleste: kort, slak og solvendt fra Sognefjellsveien.', true),
  ('besshoe', 'Besshø', 'Jotunheimen', 61.51791, 8.68712, 2257, 1300, '6–8 t', 3, 'Ø', 'mars–mai', '1296 høydemeter fra Bessheim: seks kilometer langs Bessvatnet før Grotådalen, og til slutt den slake austryggen over Brue.', true),
  ('fanaraken',       'Fanaråken',       'Sogn',       61.51669,  7.90825, 2068,  760, '5–7 t', 2, 'N',  'apr–jun', 'Høyfjellstur fra Sognefjellet med breutsikt og pålitelig vårsnø.', true),
  ('rasletinden', 'Rasletinden', 'Jotunheimen', 61.39514, 8.69944, 2104, 750, '4–6 t', 2, 'Ø', 'apr–mai', '750 høydemeter og 6 km fra Valdresflye: flatt de første 1,2 km, så en kneik til 1530 moh og slak rygg østfra mot toppen.', true),
  ('synshorn',        'Synshorn',        'Valdres',    61.34011,  8.79727, 1475,  420, '2–3 t', 1, 'Ø',  'feb–mai', 'Kort og trygg tur fra Valdresflye — perfekt førstetur og værvindu-tur.', true),
  ('bitihorn',        'Bitihorn',        'Valdres',    61.29435,  8.79947, 1607,  550, '2–4 t', 1, 'S',  'feb–mai', 'Markert horn med enkel normalrute og fin utsikt over Bygdin.', true),
  ('skogshorn', 'Skogshorn', 'Hemsedal', 60.88148, 8.69482, 1729, 840, '3–5 t', 2, 'Ø', 'feb–mai', '836 høgdemeter frå Trefta opp den breie austryggen; brattaste måling er 28,5 grader.', true),
  ('storehorn',       'Storehorn',       'Hemsedal',   60.81506,  8.59566, 1478,  470, '3–4 t', 2, 'Ø',  'des–apr', 'Hemsedals husfjell for topptur — kort vei fra bilen, mange linjevalg.', true),
  ('lonahorgi', 'Lønahorgi', 'Voss', 60.69383, 6.41489, 1412, 1300, '6–8 t', 2, 'NØ', 'feb–april', '1300 høgdemeter frå Høyland via Bergsstølen og Breiming, med dei siste 107 opp nordryggen frå punkt 1305.', true),
  ('folarskardnuten', 'Folarskardnuten', 'Hallingdal', 60.61336, 7.79146, 1927, 950, '6–8 t', 3, 'S', 'mars–mai', 'Nær 12 km inn frå Haugastøl og 950 høgdemeter, med eit kort 37-graders trinn opp frå Folarskardet.', true),
  ('oksen',           'Oksen',           'Hardanger',  60.45983,  6.68301, 1241, 960, '4–6 t', 2, 'SV', 'jan–apr', 'Fjordutsikt i alle retninger og jevn stigning fra Tjoflot.', true),
  ('vesoldo', 'Vesoldo', 'Hardanger', 60.31237, 6.09197, 1046, 840, '3–5 t', 2, 'SV', 'feb–apr', '834 høgdemeter frå Byrkjenes, skog opp til Fadnastølen og open sørvestrygg over; nord- og vestsida av toppen fell 48–55°.', true),
  ('melderskin',      'Melderskin',      'Hardanger',  60.00623,  6.08261, 1426, 1270, '6–8 t', 3, 'V',  'feb–mai', 'Rosendalsalpenes storslåtte klassiker, fra sjøen til 1426 moh.', true),
  ('gaustatoppen',    'Gaustatoppen',    'Telemark',   59.8542,  8.64928, 1883,  970, '4–6 t', 2, 'NV', 'des–mai', 'Sør-Norges mest markante topp — ser du den, ser den deg.', true)
;
-- The conflict clause refreshes the free columns only. description_up,
-- description_down, avalanche_notes and gpx_path are never touched here, so
-- re-seeding can never overwrite editorial work.

-- ============================================================================
-- Written guides — all 24 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

-- ============================================================================
-- Written guides — all 39 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

-- ============================================================================
-- Written guides — all 39 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

-- ============================================================================
-- Written guides — all 39 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

-- ============================================================================
-- Written guides — all 39 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

-- ============================================================================
-- Written guides — all 39 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

-- ============================================================================
-- Written guides — all 39 tours
-- ----------------------------------------------------------------------------
-- Generated by scripts/build-routes/emit_guides.py alongside lib/guides.ts, so
-- the database seed and the local fallback cannot drift apart. Paragraphs in
-- the description columns are separated by a blank line.
--
-- The prose is written against the real route geometry: the numbers in it come
-- from Kartverket's 1 m terrain model along the line in lib/routes.ts. It is
-- still not a substitute for the day's avalanche forecast.
-- ============================================================================

-- ============================================================================
-- Written guides — all 39 tours
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
  description_up   = 'Start ved Sandneset, der Galtelva renner ut i fjorden på 14 moh. Det finnes ingen opparbeidet parkering her — du står i veikanten på Fv7922, Lenangsveien, rett ved elveosen. Herfra går du rett inn i Galtdalen nord for Lassofjellet og holder sørsiden av elva, det vil si høyre side på vei opp. Bjørkeskogen slipper taket allerede rundt 70 moh; resten av turen er åpent terreng.

Rund nordsiden av Lassofjellet og ta sikte på skaret mellom Litle-Galten og Storgalten. Du skal ikke helt opp i skaret. Det bunner på 626 moh, og går du dit, gir du fra deg høyde du nettopp har tatt. Legg deg inn på ribben et par hundre meter sør for skaret i stedet — det er der oppstigninga begynner.

Mellom 800 og 860 moh reiser flanken seg til 30–35 grader, og bratteste steg på hele linja ligger her: 29,2 grader mellom 803 og 820 moh. Er snøen avblåst og hard, er stegjern verdt vekta. Over 880 moh brer ryggen seg ut, men den slutter ikke å stige — de siste drøyt 300 høydemeterne holder rundt 20 grader i snitt, med ett steg på 26 rundt 1000 moh. Hold deg på vestsida av ryggkanten hele veien: øst- og nordøstsiden faller 36–43 grader i snitt ned i Kalddalen mot Kalddalsvatnet på 477 moh, med enkeltpartier på 53–58.',
  description_down = 'Ned samme vei. Fra toppflata følger du den brede ryggen nordover tilbake til ribben sør for skaret og videre ut i vestflanken; derfra og ned til dalbunnen er det sammenhengende åpent terreng uten skog å bremse i. Vil du ha mer plass, traverserer du sørvestover like før den siste nedkjøringa mot skaret — der ligger en stor, slak flate som tåler store svinger.

Vanligste feil: å slippe seg rett vestover fra toppflata i stedet for å følge ryggen nordover ned til ribben. Langs hele vestsiden av Storgalten går det rennesystemer, og de bratteste partiene måler 40–50 grader. Fra ryggen ser du ikke hvor de begynner, og inngangen er vanskelig å lese ovenfra — skal du kjøre dem, går du dem opp først. Skaret er ikke faren her; vestflanken sør for ribben er det.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Normalruta går i vestflanken, i løsne- og utløpsterreng. Det bratteste på linja er partiet mellom 800 og 860 moh på 30–35 grader, med bratteste steg målt til 29,2 mellom 803 og 820. Hundremeteren fra 800 til 900 moh er den bratteste på hele ruta, 21,9 grader i snitt. Under den er flanken åpen fra 70 moh og ned til fjorden, uten skog som bremser.'
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
  description_up   = 'Fra parkeringen ved skytebanen innerst i Turistvegen følger du skogsbilvegen sørøstover inn i Tromsdalen. Hold vestsida av Tromsdalselva hele veien; bjørka slipper taket allerede rundt 220 moh, og derfra ligger dalen åpen foran deg. Sommerruta tar NNV-ryggen ut av dalen lenger nede — det er gåruta, ikke skiruta.

Innerst flater dalen ut ved Dalbotnvatnet på 311 moh. Rett før botnen reiser Svarthammaren seg på vestsida — et nordvendt stup som taper nær 100 høydemeter på seksti meter. Hold dalbunnen øst for det og styr mot skaret. Bakken opp til Salen på 740 moh er turens bratteste enkeltparti: rundt 24 grader der sporet legger seg på skrå over den, 30 til 35 i fallinja om du tar den rett på.

Fra Salen slakner det av. Følg sørryggen nordøstover mot varden. Det bratteste sammenhengende beltet på turen ligger mellom 1000 og 1100 moh, med et snitt på 20 grader. Over 1100 moh er østkanten av ryggen skavlet — gå på vestsida av kammen, også når sporet frister lenger ut.',
  description_down = 'Ned samme vei: sørryggen til Salen, så vestover ned i indre Tromsdalen og ut dalen til bilen. Fra Salen faller flanken jevnt vestover mot Dalbotnvatnet, og det er der de beste svingene ligger.

Vanligste feil: å slippe seg rett ned vestsida fra toppen. Fra varden ruller vestflanken av på 20 til 35 grader, og det er hele problemet — den ser gåbar ut oppe. Under rundt 1080 moh er du på Fronten: hundre høydemeter med 45 til 58 grader, og ingen vei ut til sida. Hold ryggen sørover til Salen før du legger deg over mot vest.

De siste kilometerne er skogsbilveg. Fallet er slakt — under fem grader hele veien ut — så regn med å stake.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Selve ruta',
      'body',  'Sporet passerer aldri 25 grader, og det bratteste sammenhengende beltet — 1000 til 1100 moh — holder 20 grader i snitt. Bakken opp til Salen er partiet du må lese. Den vender vest og nordvest, og fallinja måler 30 til 35 grader i snitt med parti over 40: sporet legger seg på skrå over den, men snøen bryr seg ikke om sporet. Det er en lastflate i østlig og sørøstlig vind, ikke i vestlig. Over 1100 moh er østkanten av ryggen skavlet hele veien til varden.'
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
  description_up   = 'Start fra parkeringa ved Eidebakken i utkanten av Lyngseidet, på 62 moh, i området ved plastfabrikken og skytebanen. Følg skogsveien innover og opp mot Hyttehaugen på 286 moh, videre forbi Skihytta. Bjørkeskogen slipper rundt 310 moh, og derfra ser du resten av turen foran deg.

Videre vestover mot Rørneshytta, hele tiden på sørsiden av Gjerdelva — en variant følger ryggen nord for elva opp til flata rundt 600 moh når snødekket tillater det, men normalruta holder sørsiden. Uansett hvilken side du går: ikke gå for langt ned i elvedalen mot Gjerdelva. Sidene ned i den bryter av på 34–37 grader der de ovenfra leser som flatt, og bunnen er ei terrengfelle. Hytta ligger på 604 moh, og det er der folk stopper.

Fra hytta går du litt ned før du går opp igjen. Du krysser Gjerdelva rundt 590 moh, et søkk på en femtentalls høydemeter; turen gir fra seg 38 høydemeter til sammen på vei opp. Så følger du østsiden av flanken oppover til rundt 850 moh og svinger derfra mot toppen.

Langs linja på kartet er bratteste steg 25,9 grader, og hundremeteren mellom 800 og 900 moh går i 21,7 i snitt. Flanken rundt deg er brattere: mellom 800 og 920 moh ligger partier på 30–35 grader, og målt 400 meter ut fra sporet ved 910 moh holder østsiden 31 grader i snitt, nordsiden 34. Legger du deg for direkte mot toppen, er det dem du står i. Øverst flater det ut til den brede toppflata på 1030.',
  description_down = 'Ned samme vei. Toppflata er romslig nok til å legge svingene der du vil — så lenge du holder deg sør og øst på den. Nord- og nordvestkanten faller av på 40–47 grader i snitt med steg på 50–57, og det er der det bygger skavler. Østflanken ned mot 850 moh er den lengste sammenhengende nedkjøringa på normalruta, 20–23 grader langs sporet. Under det holder du oppstigningssporet ned til Rørneshytta og videre østover mot Skihytta og skogsveien.

Vanligste feil: å la nedkjøringa trekke ned i elvedalen mot Gjerdelva. Ryggen nord for elva er i seg selv en dokumentert variant og går fint å kjøre — det er bunnen som er problemet. Elvedalen er ei stor terrengfelle der det omkom en person vinteren 2017, og sidene ned i den måler 34–37 grader selv om de leser som flatt ovenfra. Hold høyden til du er ute av dalen.

De brattere linjene fra toppen er egne turer, ikke varianter av normalruta. Topphenget er ei rett linje fra toppen med partier på 35–40 grader. Skredbekken tar ut mot Gjerdaksla etter topphenget og følger søkket nord for den ned mot Sollia, med partier på 30–40 grader; folk har løst ut skred der før, og du kommer ned langt fra bilen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigninga går gjennom utløpsområder fra 800 moh og opp. Selve sporet er slakt — bratteste steg måler 25,9 grader, og båndet 800–900 moh går i 21,7 i snitt — men flanken over og ved siden av holder 30–35 grader mellom 800 og 920 moh, målt til 31 grader i snitt i øst og 34 i nord. Det er den som eventuelt løsner over deg.'
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
  description_up   = 'Fra parkeringa ved Fv91 nedenfor Vartavarhaugen, 65 moh, går ruta østover over Vartavarhaugen på 159 moh og krysser Tverrelva. Bjørka slipper taket rundt 424 moh, og over 542 moh er terrenget åpent hele veien.

Derfra følger skisporet den brede nordvestryggen sammenhengende oppover. Terrengmodellen gir jevne 16 til 26 grader fra rundt 350 moh til Middagsaksla, uten bratte trinn: bandene mellom 500 og 1000 moh ligger alle på 19 til 21 grader i snitt. Det er en lang, jevn skitur, og den er lite skredutsatt så lenge du blir på ryggen. Flankene på begge sider er noe annet, og de er terrengfeller i dårlig sikt.

På Middagsaksla, 1076 moh, stopper skituren. Her setter de fleste fra seg skiene; noen bærer dem til forvarden på rundt 1190 moh og lar dem ligge der. Turrapportene fra vinterbestigninger er samstemte om at ryggen videre går til fots — «over ca. 1100 moh måtte skiene byttes mot stegjern og isøks».

De siste 1,4 kilometerne er eksponert nordvestrygg. Ryggkammen bølger — 1076, 1157, 1093, 1190, 1219, 1208, 1256, 1331 og til slutt 1393 moh — og linja gir til sammen tilbake 66 høydemeter på veien. Det er luftige parti, korte klyvepartier, og helt til slutt ei renne og en bratt topppyramide: den bratteste hundremeteren på hele turen ligger mellom 1300 og 1400 moh og måler 23,7 grader i snitt, mens det bratteste sammenhengende partiet er 36 grader og siste trinn lokalt er over 45.',
  description_down = 'Ryggen tilbake til fots til Middagsaksla, og derfra ned nordvestryggen på ski til Vartavarhaugen og bilen. Fallretningen ned ryggen er målt til nordvest, 293 grader, og hellinga er 16 til 26 grader hele veien — jevn, oversiktlig kjøring uten trange partier.

Vanligste feil: å behandle Middagsaksla som en pause i stedet for et vedtak. Er ryggen isete, eller er sikta dårlig, er det her turen slutter — skituren er uansett over, og det som ligger foran er 1,4 kilometer der en glipp ikke har noen utgang til sida. Å snu på Middagsaksla er ikke en avbrutt tur; det er den turen de fleste faktisk går.

Den andre feilen er å slippe seg ned en av flankene fra ryggen for å korte inn. Begge sider av nordvestryggen er bratte og samler snø; ryggen selv er linja, både opp og ned.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Skituren opp nordvestryggen er lite skredutsatt: 16 til 26 grader jevnt fra rundt 350 moh til Middagsaksla, uten bratte trinn. Flankene på begge sider av ryggen er derimot bratte, og de er terrengfeller — i dårlig sikt er det å holde ryggen selve navigasjonsoppgaven. Over Middagsaksla er det ikke lenger skiterreng: bratteste sammenhengende parti måler 36 grader, siste trinn lokalt over 45, og bratteste hundremeter, 1300 til 1400 moh, 23,7 grader i snitt.'
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

Skogen slipper taket ved 301 moh, og du går forbi Skihytta på 317. Mellom Rødsteinen og Skihytta må du gjennom et grunt søkk før stigningen tar seg opp igjen, og terrenget blir først ordentlig oversiktlig rundt 400. Skogsveiene fra Karnes, Solhov, Marieslett og Jensbakk kommer opp på den samme hylla, så hvilken du velger nede i bygda spiller mindre rolle. Herfra legger du kursen vestover mot nordøstryggen og kommer opp på kammen rundt 780 moh.

Videre følger du ryggen sørover, på eller like øst for kammen. Mellom 900 og 950 moh reiser østsida seg i partier over 30 grader, og bratteste enkeltsteget på linja måler 34. Vestsida er ikke et alternativ: der faller det 40 til 80 høydemeter per hundre meter rett ned mot Gjerdelva.

Toppryggen smalner inn de siste hundre meterne, og rundt nitti meter før varden tar et grunt skar tilbake et par høydemeter. Her henger skavlene ut mot øst, over Østrenna: kammen faller 30 til 41 grader på østsida og 21 til 31 på vestsida. Skift side i god tid og gå det siste stykket vest for skavlekanten, fram til varden på 1289.',
  description_down = 'Den store renneformasjonen rett nord for toppen er nedkjøringen. Den heter Østrenna og ligger øst for kammen. De øverste to hundre metrene måler 33 til 42 grader, 37 i snitt, og renna er vid nok til nesten å være en flanke — den ligger i le, fylles av fokksnø mens det blåser på toppryggen, og har som regel den beste snøen på fjellet. Vel nede skrår du nordover tilbake på oppstigningsruta.

Vanligste feil: å ta sats utfor skavlen rett fra toppen, og sent på dagen. Den store skavlen over renna slipper i vårsola nesten hvert år, og løsner den, går den i renna du står i. Renna vender øst og får sola først av alt her oppe, så kjør tidlig — og gå inn gjennom det grunne skaret nitti meter nord for varden. Det er det naturlige innsteget, den samme renna du kommer bort i like før toppen.

Vil du ikke inn i renna, kjører du ned nordøstryggen du kom opp. Den er brattest mellom 900 og 800 moh, 24,5 grader i snitt, og er ofte avblåst; regn med hard snø der ryggen er smalest.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta opp',
      'body',  'Nordøstryggen er det tryggeste linjevalget på fjellet, men flat er den ikke. Østsida under kammen går i partier over 30 grader mellom 900 og 950 moh, bratteste hundremeteren på selve linja ligger mellom 800 og 900 moh på 24,5 grader i snitt, og bratteste steget måler 30,3. Ryggen er ofte avblåst hele veien opp — det gir hard snø på kammen og fokksnø i lesidene rett ved siden av.'
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
  description_up   = 'Start på grusparkeringa ved Medfjordbotnvatnan langs Fv862, 102 moh. Følg Keipelva nordover i jevnt stigende terreng til rundt 225 moh. Skogen slipper taket ved 250 moh, og over 333 er du i åpent terreng resten av turen.

Drei mot vestnordvest og følg fjellsida oppover forbi 385 moh. Rundt 470 moh flater det ut i et parti som strekker seg nesten en kilometer med 6 grader i snitt — den eneste pusten på turen — før terrenget stiger inn i den store skåla sør for toppen på rundt 595 moh.

Fra skåla på rundt 595 moh skal du ikke rett nord opp fallinja. Målt rett nordover holder bakken 29 til 36 grader de første 180 høydemetrene, og mellom 713 og 814 moh måler den 38 til 52. Sporet legger seg i stedet østover i stigende skrå til rundt 670 moh og tilbake mot vestnordvest opp på skulderen ved 813 moh; slik holder linja seg under 30 grader. Bratteste hundremeteren på ruta ligger mellom 800 og 900 moh og måler 22,2 grader i snitt; bratteste sammenhengende parti på linja er 27,1 grader.

Fra skulderen følger du ryggformasjonen sørvest for toppen nordover til varden på 938 moh. De øverste hundre høydemeterne er ofte vindherjet og harde. Hold deg på sørsida av ryggen — nordsida faller 60 grader rett under egget, og det er der skavlene henger.',
  description_down = 'Ned samme vei: sørover langs ryggen, ned på skulderen og ut den skrå linja mot skåla, og derfra fjellsida mot Keipelva og parkeringa. Ruta selv måler 27,1 grader på det bratteste. Legger du deg i fallinja rett sør fra skulderen i stedet, står du i det partiet som måler 38 til 52 grader ned til 713 moh, med skåla under som samler alt som løsner.

Vanligste feil: å legge seg for langt nord på ryggen fordi kanten ser ut til å gi bedre snø. Rett nord for toppen faller terrenget 60 grader og deretter 52,5 — skavlene ligger nordover, og de bygger seg opp gjennom hele vinteren. Sørsida ned i skåla er 32 grader, og det er den sida ruta bruker.

Friflyt nevner også en litt brattere variant ned en liten dalformasjon fra ryggen. Den er ikke målt opp her, og sørsida har partier på 38 til 52 grader — velger du den, er det en egen vurdering, ikke den samme som normalruta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Skåla sør for toppen er både løsneområde og utløpsområde, og du må gjennom den både opp og ned. Selve linja er slakere enn terrenget rundt: bratteste sammenhengende parti måler 27,1 grader og bratteste hundremeter, 800 til 900 moh, 22,2 grader i snitt. Det er den skrå føringa østover som gir de tallene. Fallinja rett nord opp fra skåla måler 38 til 52 grader mellom 713 og 814 moh, og den ligger over deg hele veien opp henget.'
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
  description_up   = 'Start på rasteplassen i Svarthola langs Fv862, 30 moh, knappe seks kilometer øst for Senjahopen. De første to hundre høydemeterne går rett opp til nordenden av Svartholvatnet på 207 moh, og derfra østover over ryggen mellom vatnet og Breitindvatnet — et parti på rundt 400 moh der linja legger seg flatt før den stiger igjen.

Fra nordøstsida av Breitindvatnet på 481 moh begynner vestflanken. Den er et sammenhengende heng på 25 til 32 grader hele veien opp til rundt 760 moh, uten hyller å hvile på og med vatnet rett under seg. Den bratteste hundremeteren på ruta ligger mellom 600 og 700 moh og måler 23,2 grader i snitt; bratteste sammenhengende parti på linja er 38,8 grader, og det ligger i toppblokka.

Skiene settes igjen på skulderen sørvest for toppblokka, 763 moh. Derfra til toppen er det 44,4 grader over 249 meter, og ryggstegene over rundt 800 moh måler 45 til 52 grader i hundremetersvinduer. Det er ikke skispor. De siste 140 høydemeterne er utsatt klyving på sørvestryggen med korte eksponerte parti — hold deg på sørvestsida av kammen. Toppen du står på er den sørøstre, 1007 moh; SSR-punktet som heter Breitinden ligger 0,46 km nordvest og er 24 meter lavere.

Ingen publisert skiruteskildring finnes for Breitinden — kildene beskriver normalruta i sommerform. Innmarsjdalen er den samme uansett, og det finnes ingen annen farbar veg inn fra Fv862, men det betyr at linja over skulderen er terrengmodellens og ikke en gjengivelse av en skrevet skirute.',
  description_down = 'Ned igjen klyver du sørvestryggen tilbake til skulderen, tar på skiene og kjører vestflanken ned til Breitindvatnet. Flanken er den beste kjøringen på turen og den mest alvorlige delen av den samtidig: 25 til 32 grader sammenhengende, med vatnet som terrengfelle under hele henget.

Vanligste feil: å tro at nordsida er en veg ned fordi den ser kortere ut fra toppen. Nord- og nordøstsida faller 53 til 70 grader rett under egget, og det er der skavlene henger. Fra vatnet følger du oppstigningen tilbake vestover over ryggen til Svartholvatnet og ned til Fv862 — de nederste to hundre høydemeterne er de brattest kjørte på hjemvegen, 16 til 18 grader i snitt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Vestflanken opp fra Breitindvatnet er et sammenhengende heng på 25 til 32 grader med vatnet som terrengfelle nedenfor — det er turens skredterreng, og du må gjennom det både opp og ned. Bratteste hundremeter på linja, 600 til 700 moh, måler 23,2 grader i snitt. Over 800 moh går ruta over i klyving: ryggstegene måler 45 til 52 grader, og 763 moh til toppen er 44,4 grader over 249 meter.'
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
  description_up   = 'Parkeringen er ved veibommen i Forselvveien over Djupvik. Gå forbi bommen og fram til veien slutter i det gamle steinbruddet på 141 moh, og hundre meter videre i samme retning før du legger deg inn i skogen. De første tre hundre høydemeterne er bratte og tette; følg det gradvis slakere terrenget opp mot venstre til du står ved Pumpvatnet på 325 moh.

Kryss vatnet på isen og forlat det i sørøstre hjørne, der en gammel skogsvei tar deg inn i bekkedalen langs Forsneselva mot Forsnesvatnet. Skogen slipper taket på 457 moh, og resten av dalen går i åpent terreng. Ved dalhodet rundt 650 moh, nord for Forsnesvatnet, svinger du østover inn i den lille dalen mot Isvatnet.

Isvatnet ligger på 820 moh. Rund det på nordsida — der går en sammenhengende benk på fire til tjuefire grader som tar deg østover fra 850 til 950 moh uten å berøre noe bratt. Hold benken hele veien. Skulderen rett øst for vatnet, nede til høyre for deg, er et bergband som måler 53 til 63 grader.

Fra 950 moh fortsetter benken østover til du kommer opp på sørøstryggen rundt 1145 moh. Derfra følger du krona nordvestover til toppen. De siste tretti meterne er ikke skiterreng: et kort, bratt snøfelt og to korte partier med enkel klatring. Isøks er verdt å ha med, og stegjern hvis snøen er hard; tau trenger du ikke.',
  description_down = 'Ned igjen samme vei. Kjøringen er delt opp i mange korte bakker heller enn én lang — fra ryggen ned til Isvatnet, over benken, ned den lille dalen og gjennom bekkedalen til Pumpvatnet. Vil du ha noe brattere, starter Rombaksrennene i skaret på 1070 moh rett øst for toppen. De ser brattere ut enn de er, men de er skredterreng, og de faller nordover mot Rombaken — ikke tilbake til Isvatnet.

Vanligste feil: å tro at det går an å kjøre rett av toppen. Det gjør det ikke. Nordsida er Rombaks-S''en, og den måler 52 grader i snitt de første fire hundre meterne, med partier over 70 — videre 41 grader hele veien ned mot Rombaken. Den er så eksponert at et fall kan bli fatalt, og den er en linje for folk som har kjørt den før. Nordøst og øst er nesten like bratt, 48 og 44 grader, og fører ned i Rombaksrennene. Og vest, som ser ut som en snarvei tilbake til benken, går inn i et bergband på over 60 grader mellom 1060 og 1090 moh. Hold krona sørøstover til du er nede på 1145 moh og ser Isvatnet.

Under skoggrensa på 457 moh blir det tett igjen. Følg oppsporet ned til veienden — skogen her er bratt og uoversiktlig, og det går fortere i eget spor enn å lete etter en bedre linje.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja som er tegnet holder seg under 30 grader hele veien. Bratteste hundremeteren ligger mellom 500 og 600 moh med 18,6 grader i snitt, og bratteste enkeltsteg måler 24,5 grader. Benken nord for Isvatnet ligger på fire til tjuefire grader. Toppblokka er unntaket — den er klatring, ikke skiterreng.'
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
  description_up   = 'Start ved vegenden i Geitgallien ved Skinvollen innerst i Austnesfjorden, 20 moh. Følg lysløypa et stykke og videre inn i Lilandsdalen gjennom bjørkeskogen. De første åtte hundre meterne stiger knapt — 6 grader i snitt — og det er den eneste flate delen av turen.

Fra rundt 250 moh bratner dalen til ei renne som holder 35 grader opp til 360 moh; den kartlagte stien måler 34,8 grader mellom 290 og 350 moh. Over renna slakner det igjen, og du følger dalen oppover i 17 til 20 grader til rundt 620 moh, der elveleiet bratter til. Dalbunnen under renna er terrengfelle: går det noe over deg her, er det ingen veg til sida.

Der elveleiet bratter til går en tydelig rampe opp mot høyre inn i den store skålformasjonen på rundt 845 moh — toppen av sørrenna. Dette er et klassisk utløpsområde, og stoppestedet velges her, ikke midt i skåla. Videre mot skaret og opp til 928 moh, der det bratter til for godt: bratteste sammenhengende parti på linja måler 32,2 grader, og den bratteste hundremeteren, 1000 til 1100 moh, holder 21,6 grader i snitt.

De siste 174 høydemeterne til toppen på 1085 moh måler 41,9 grader. Det er klyving med stegjern og isøks, ikke skikjøring. Rett sør for varden faller terrenget 64 grader.',
  description_down = 'Har du én bil, kjører du ned samme vei: fra toppen ned til 928 moh til fots, så skåla, rampa ned til dalen på 620 moh, renna fra 360 til 250 moh og ut Lilandsdalen. Renna er den delen som må vurderes på nytt på vei ned — den har vært over deg hele veien opp, og i sola kan den ha endret seg mens du var på toppen.

Vanligste feil: å ta sørrenna uten å ha ordnet transport. Den er den dokumenterte nedkjøringa, rundt seks hundre høydemeter på 35 til 40 grader, men den kommer ut i en annen dal og krever bil nummer to. Den andre feilen er å regne toppen som mål uansett forhold: er ryggen isete, er de siste 174 metrene en klyvetur på 42 grader med ski på sekken, og snuvedtaket tas på 928 moh.

Området går store skred flere ganger hver vinter. Det er ikke en tur du tar på et middels varsel fordi du har reist langt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Hele ruta ligger i skredterreng. Renna på 250 til 360 moh er 35 grader med dalbunnen som terrengfelle under, skålformasjonen over sørrenna er et klassisk utløpsområde, og de øverste 174 høydemetrene ligger på 41,9 grader. På selve linja måler bratteste sammenhengende parti 32,2 grader og bratteste hundremeter, 1000 til 1100 moh, 21,6 grader i snitt — men gjennomsnitt er feil verktøy her: problemet er at det ikke finnes noe sted på ruta der du ikke har noe over deg.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Rett sør for toppen faller terrenget 64 grader. Sørrenna, som brukes som nedkjøring, holder 35 til 40 grader over rundt seks hundre høydemeter og ender i en annen dal enn den du kom opp. Topptursentralen graderer linja KAST 4 — ekstremt, og skriver at den ikke anbefales uten guide. Området går store skred flere ganger hver vinter.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Lofoten og Vesterålen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'geitgaljen';

update public.tk_tours set
  description_up   = 'Fra parkeringen på Hauklandstranda, seks meter over havet, går du nordover mot søndre munning av tunnelen til Utakleiv. Ikke gjennom tunnelen: ta serviceveien som klatrer nordøstover over den, forbi Klumpan, og følg den til den flater ut på benken på 150 moh ved munningen av Durmålsdalen. Her starter den merkede stien, og den går hele veien opp til varden på 931.

Videre nordøstover opp sørsida av Durmålsdalen. Terrenget er åpent hele veien — det er ingen skog på denne turen — og linja legger seg i lange sikksakk opp mot skulderen ved Molheia. Det brattner fra 700 moh: hundremeteren mellom 700 og 800 moh ligger på 28,6 grader i snitt, og bratteste steget på linja måler 36,1 grader. Ikke skjær rett opp vestflanken av toppryggen; den ligger på 34 til 37 grader i snitt med partier opp mot 46. Høyden tas på skulderen på sørsida.

Fra Molheia rundt 800 moh er det bare tretti meter opp til fortoppen på 830 og den vesle flata der. Det er det siste brede stedet på turen — sørøst for flata faller terrenget 38 grader i snitt. Herfra og ut er du på rygg.

Fra flata går ryggen nordover, og den er smal. Følg krona til varden på 931. Ikke gå ut på østsida — der ligger store hengskavler over svært bratt lende: østflanken under varden måler 42 grader i snitt, sørøstflanken 44, med partier på 54 til 57. Videre nordover faller ryggen til 898 moh og stiger så mot hovedtoppen, som måler 956 moh i terrengmodellen. Et militært radaranlegg står på ryggen på 936 moh, vel hundre meter før toppen; området rundt det er sperret, så følg krona forbi og rett deg etter skilting på stedet.',
  description_down = 'Tilbake langs ryggen til fortoppen, på krona eller like vest for den. Derfra har du snaut sju hundre sammenhengende høydemeter ned den brede Durmålsdalen til benken på 150 moh. Vil du ha en variant, svinger du til høyre ned i Øvredalen like før fortoppen og følger ryggsida mellom dalene til det flater ut rundt 600 moh, og derfra tilbake til venstre inn i Durmålsdalen.

Vanligste feil: å følge Durmålsdalen helt ned. Da kommer du ut på Utakleiv-sida med tunnelen mellom deg og bilen. Hold til høyre når dalen flater ut rundt 150 moh og ta serviceveien over tunnelen tilbake til Haukland.

Lehengene mot øst og sør er bratte og ligger rett under skavlene på toppryggen. De faller åtte hundre høydemeter ned til anleggsveien på sør- og østsida av fjellet, som ligger mellom 75 og 180 moh — ikke i Durmålsdalen. Velg dem bevisst, ikke fordi du kom skjevt ut fra ryggen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nedre halvdel er slak og åpen. Det brattner fra 400 moh: hundremeteren mellom 400 og 500 moh ligger på 24,2 grader i snitt, og over 500 moh holder beltene 20 til 21 grader helt til toppflata. Bratteste steget på linja måler 28,8 grader. Fra fortoppen og nordover er ryggen smal, med et fall til 898 moh og femti meter opp igjen før hovedtoppen.'
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
  description_up   = 'Fra parkeringen ved skianlegget i Nappskaret, en kilometer vest for Napp, går du nordover og holder deg til venstre for skitrekket. Rett over øvre trekkstolpe, ved 139 moh, samles stiene fra de ulike parkeringene til ett spor — starter du fra den vestre parkeringen drøyt 250 meter unna, kommer du inn på det samme sporet her. Fra 61 moh og opp er du over skoggrensa hele veien; det finnes ikke skog på denne ruta.

Sporet svinger nordøst inn i dalen mellom Okstinden og Litlnappstinden og krysser Myrlandselva rundt 215 moh. Videre opp dalen til søkket ved Skarvatnet, det islagte tjernet på 341 moh. Hold til venstre opp mot Middagstinden, og legg deg deretter mot høyre der terrenget heller slakest — det er den linja som tar deg opp uten å komme borti sørflanken.

Over 500 moh reiser terrenget seg til et kort, bratt trinn opp på ryggen ved 560 moh. Det bratteste hundremeterssjiktet på ruta ligger lenger nede, mellom 200 og 300 moh, og holder 17,3° i snitt; bratteste enkelttrinn på hele linja måler 24,4° og ligger i det samme sjiktet. Over trinnet flater det ut, og fra rundt 724 moh går den brede toppflata østover som en 13 graders rampe inn mot varden.

Varden på 741 moh står på kanten av østveggen. Stopp ved varden. Toppen bærer store hengskavler mot øst, og øst- og nordøstsida over Napp og Perklubben faller 42–43° i snitt med bergband over 60° — det er stup, ikke en linje.',
  description_down = 'Ned samme vei. Dalen mellom Okstinden og Litlnappstinden gir variert kjøring, og fra søkket ved Skarvatnet er det åpent hele veien ned til trekket.

Vanligste feil: å slippe seg sørover fra toppflata fordi det ser kortere ut. Sørsida rett under toppen faller nær 39° i snitt, med partier over 50°, og det er der skredene går på dette fjellet. Hold vestover i stedet — vest er den slakeste sida av fjellet, 22° i snitt — og følg oppstigninga tilbake til søkket.

Femti meter fra varden tar du til venstre, rett sør, inn i renna: 40° og 400 meter lang, og den munner ut i et bredere parti rett over Litlnappstinden. Det er en egen avgjørelse, ikke en snarvei.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigninga gjennom dalen er slak: bratteste hundremeterssjikt er 200–300 moh med 17,3° i snitt. Men snittet skjuler det bratteste enkelttrinnet på linja, som måler 24,4°, og trinnet opp på ryggen ved 560 moh er kort og bratt. Det er de partiene som kan løsne på normalruta.'
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
  description_up   = 'Fra parkeringen på Hellerøra (Øvre Kavli), 185 moh, følger du bomveien nordover den første kilometeren, til den krysser Heiaelva. Rundt svingen og videre inn på sporet mot Kavlisetra og Måsvassbu.

Ved rundt 420 moh forlater du Måsvassbu-sporet og går nordøst opp gjennom åpen bjørkeskog. Skogen slipper taket akkurat der: over 421 moh er det åpent terreng resten av veien. Målet er Vesttoppen på Steinberget, 766 moh.

Fra Vesttoppen følger du kammen østover til Steinberget, 981 moh. Ryggen henger sammen og stiger jevnt, men rett nord for Steinberget faller den 19 meter i et søkk før den reiser seg igjen. De 19 meterne må du opp igjen på vei tilbake — de er med i turens 1275 høydemeter.

Herfra går sørvestryggen nord-nordøstover mot toppen. Bratteste hundremeterssjikt på hele oppstigninga ligger mellom 1300 og 1400 moh: 20,8° i snitt, med et enkelttrinn på 28°. Skavler henger ut på både øst- og vestsida av toppryggen; hold deg på ryggen og klar av begge kanter helt inn til varden på 1439.',
  description_down = 'Standardnedkjøringen går sørover fra toppen, ned sørflanken til Kavliheian — 950 sammenhengende høydemeter — og derfra i oppkjørte spor tilbake til Øvre Kavli. Øverste del kan skjule stein tidlig i sesongen; den beste snøen ligger lenger ned. Sørflanken er også det første stedet i området som blir oppkjørt etter snøfall, så vær tidlig ute om du vil ha den urørt.

Vanligste feil: å ta sørflanken som standard uansett forhold. Øverste del holder 30–35°, og skredterrenget ligger i to belter, 1300–1400 moh og 950–1050 moh — begge går du gjennom på vei opp også. Holder ikke varselet til det, går du tilbake over Steinberget, samme vei som opp, og opp igjen gjennom søkket.

Vestrenna er den andre linja ned: jevnt 42–48°, med et 60 meter langt parti på rundt 55° der renna er smalest, og videre ut dalen til Loftskarsetra og ned gjennom skogen til parkeringen. Den krever stabil vårsnø eller stabile vinterforhold og en helt egen vurdering — snøkvaliteten i renna er vanskeligere å vurdere enn å kjøre den. Det er ikke noe du velger på toppen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigninga over Steinberget er den slake linja på fjellet, men den er ikke skredfri. Skredterrenget ligger i beltene 950–1050 moh og 1300–1400 moh, og du går gjennom begge på vei til toppen. Bratteste hundremeterssjikt på oppstigninga er nettopp 1300–1400 moh, med 20,8° i snitt og et enkelttrinn på 28°.'
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
  description_up   = 'Snøheim turisthytte, 1474 moh, ligger ved enden av Snøheimvegen. Vegen er stengt for privatbil, sykkel er forbudt fram til 1. juni av hensyn til villreinkalvinga, og bussen fra Hjerkinn går først når hytta åpner rundt St. Hans. I skisesongen tar du altså de fjorten kilometerne inn fra Hjerkinn for egen maskin — det er den delen av dagen folk undervurderer. Fra hytta følger du sporet et par hundre meter vestover til gangbrua over Stridåe. Brua ligger i sørøsthjørnet av tjernet rett vest for hytta; du går rundt sørsida av tjernet, ikke over det.

Etter brua svinger du umiddelbart til høyre inn på Forsvarets gamle traktorveg, sperret for kjøring med store steiner. Den tar deg jevnt oppover til Gamle Reinheim, ruinen på 1670 moh. Ingen skog noe sted på denne turen — du er over tregrensa fra hytta og oppover, og ser hele ryggen foran deg hele veien.

Fra Gamle Reinheim stiger det bratt, delvis på snøfonner, opp på østryggen. Oppe på kammen ligger stidelet mot Reinheim i Stroplsjødalen, inngangen for dem som kommer østfra. Hold avstand til det bratte terrenget mot nord i starten av stigningen; ryggen er bred nok til at du kan gå midt på den.

Det bratteste hundremeterbeltet ligger mellom 1800 og 1900 moh og holder 18,6° i snitt; bratteste parti på linja måler 23,0°. Herfra er det staker og varder hele veien, og øverst går det på snøfonner opp til Stortoppen, 2286 moh, der radiolinkstasjonen står. I dårlig sikt er det stakene som holder deg på kammen — den øvre delen er bred nok til at du mister følelsen av hvor ryggen går.',
  description_down = 'Samme vei ned. Fra Stortoppen til Gamle Reinheim gir østryggen drøyt 600 sammenhengende høydemeter, og de siste 200 tar traktorvegen. Under 1800 moh slakner det så mye at det blir mer gliding enn svinger. Vil du ha mer helning og bedre snø, legger du noe av nedkjøringen sør for oppoversporet — men da står du i 30–40°-terreng i stedet for 20°.

Vanligste feil kommer helt til slutt: å forlate traktorvegen for tidlig og sikte rett mot Snøheim. Da har du tjernet vest for hytta i veien, og utløpsbekken bak det. Følg vegen helt ned til enden ved sørvesthjørnet av tjernet og ta stien østover derfra — gangbrua er den eneste kryssinga, og fra brua er det 230 meter igjen til hytta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Østryggen er slak etter høyfjellsmålestokk. Det bratteste hundremeterbeltet, mellom 1800 og 1900 moh, holder 18,6° i snitt, og og bratteste parti på linja måler 23,0°. Fra Snøheim til Gamle Reinheim går du på gammel traktorveg i åpent, slakt terreng. Det som betyr noe her er ikke det du står på, men hvor nær kanten av kammen du legger sporet.'
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
  description_up   = 'Fra parkeringen ved Standaleidet, 376 moh, følger du den ryddede traseen nordover mot Fossane under Søre Sætretind. Skogen slipper allerede på 410 moh, og fossen markerer inngangen til Kvanndalen.

Følg dalbunnen langs elvefaret nordover. Terrenget er slakt: det bratteste hundremeterspennet, mellom 800 og 900 moh, ligger på 17,8° i snitt. Ikke sving vest der dalen åpner seg rundt 650 moh — det juvet fører opp i breens utløp. Hold nordover til Appelsinhaugen på 950 moh, den naturlige rasten halvveis.

Fra Appelsinhaugen går du vest-sørvestover inn på flata i Kvanndalsskardet, drøyt 1020 moh. Herfra og opp til Stretet er det bratt: målte trinn i den nordvendte siden går over 45°. Stretet ligger på 1140 moh, en trang passasje på egga, og over den ser du toppen.

Over Stretet er du på Kolåsbreen, som ligger som bre fra 1173 til 1355 moh. Følg brekanten under egga sørvestover mot toppen. De fleste tar av skia rundt 1350 moh og går den siste kneika, som måler 47°. Toppen er 1432 moh, halvannen til to meter bred og ti meter lang, med skavl mot øst — hold deg midt på — og en vestside som faller 260 høydemeter på 160, med trinn over 65°.',
  description_down = 'Ned samme vei møter du de to bratte trinnene i motsatt rekkefølge: toppslippet fra 1432 til 1350, som måler 47°, og den nordvendte siden fra Stretet ned mot Kvanndalsskardet, der målte trinn går over 45°. Begge tas på skrå og med avstand mellom folk. Fra Kvanndalsskardet og ned holder terrenget seg under 30° hele veien ut Kvanndalen.

Vanligste feil: å legge seg for langt vest på vei ned fra Appelsinhaugen. Da havner du i juvet som drenerer breen ut av Kvanndalen — trangt, med bratte sider over seg. Hold elvefaret i dalbunnen til du ser Fossane.

På dager uten skredfare gir Kolåsbreen en videre nedkjøring med flere linjevalg. Bresprekken mellom breen og toppslippet åpner seg utover sesongen: dekt i høyvinteren, åpen når det lir mot vår.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Dalgangen gjennom Kvanndalen er slak, 17,8° i snitt over det bratteste hundremeterspennet. Bratt terreng møter du to steder: den nordvendte siden fra Kvanndalsskardet opp til Stretet, der målte trinn går over 45°, og toppslippet over 1350 moh på 47°. Begge vender nord.'
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
  description_up   = 'Frå parkeringa ved vasshuset øvst i Vikegeila, 149 moh, følgjer du anleggsvegen oppover Skåla. Skogen sluttar rundt 339 moh og terrenget er ope frå 423. Ved om lag 395 moh går ein av vegen der ein kartlagd sti tek av — det er same staden Fri Flyt skildrar med «på skrå mot Vikeelva, kryss elva».

Over elva siktar du mot det lågaste punktet på ryggen mellom Vallahornet og Saudehornet, 812 moh. Skaret ligg lenger aust enn ei rett linje mellom dei to toppane skulle tilseia; ryggkammen sjølv har lågaste punkt der, og ein kartlagd sti følgjer han om lag tretti meter unna.

Over skaret følgjer du sørryggen om lag 490 høgdemeter opp til toppen på 1303 moh. Stigninga er jamn til rundt 1137 moh og bratnar så: målt frå 1137 moh og opp er stega 33,5, 32,5, 33,5 og 38,6 grader over 56 til 65 meter. Brattaste hundremeteren på ruta ligg mellom 1200 og 1300 moh og måler 23,2 grader i snitt; brattaste samanhengande parti på linja er 33,7 grader. Bratt, men under 42 — heile ruta er skibar.

Langs toppeggja ligg det skavl. Du kan ikkje gå heilt ut på kanten, og det er verdt å vita før du står der og vil ha utsikta mot Hjørundfjorden.',
  description_down = 'Vanlegaste nedkøyringa går same vegen, men gjerne på flanken på skiløparen si høgre side av renna — sørvestflanken, som held om lag 37 grader i 600 høgdemeter. Frå toppen fell terrenget 1303 til 1031 til 834 til 717 moh mot sørvest, altså 36 til 38 grader over dei fyrste 470 høgdemetrane. Det er samanhengande bratt køyring i eitt strekk.

Vanlegaste feil: å tru at «rett ned mot Ørsta» er vest. Rett vest for ryggen mellom skaret og toppen er hellinga berre 12 til 15 grader, og det er ei anna side av fjellet enn den som fører deg ned til bilen. Nedkøyringa er sørvestvend, og Fri Flyt nemner moglege sprekker i rennene på vestsida.

Den andre feilen er å måla turen etter kor kort han er. 1158 høgdemeter frå sentrum av ein by gjer ikkje fjellet snilt — skredterrenget byrjar i Skåla og held fram heile vegen opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Det er skredterreng frå Skåla og heile vegen opp. Sørryggen er bratt nok til at ei utglidning på hard snø får lang utløpsbane: dei siste 170 høgdemetrane held 33 til 39 grader, med enkeltsteg målte til 33,5, 32,5, 33,5 og 38,6. Brattaste samanhengande parti på linja er 33,7 grader og brattaste hundremeteren, 1200 til 1300 moh, 23,2 grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Langs toppeggja ligg det skavl, så kanten er ikkje ein utsiktsplass. Sørvestflanken, som er nedkøyringa, held om lag 37 grader i 600 høgdemeter — 36 til 38 grader over dei fyrste 470 frå toppen. Fri Flyt nemner moglege sprekker i rennene på vestsida. Fjellet ligg rett over Ørsta sentrum, men det er ikkje ein snilltur, og det er for erfarne.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade.'
    )
  )
where slug = 'saudehornet';

update public.tk_tours set
  description_up   = 'Fra veilomma ved Skylstad i Norangsdalen, 85 moh, går du rett opp Brekkheida. Hold deg vest for Brekkeelva gjennom hele skogen — elva ligger et par hundre meter øst for linja, og du kommer først inn på elvefaret oppe på flata rundt 700 moh. Dette er den bratteste delen av skogen: de hundre metrene mellom 100 og 200 moh ligger på 22,8° i snitt.

Skoggrensa slipper på 659 moh. Videre følger du sporet mot Patchellhytta inn på flata sørvest for hytta, drøyt 795 moh. Her forlater du hyttesporet. Sving vest opp østryggen før du krysser 1000-meteren — går du lenger inn mot Steinreset, må du hente igjen høyden på feil side av ryggen.

Pukkelen topper på 1143 moh. Derfra faller ryggen 26 meter til et skar før den stiger til høgde 1204, og videre er det 56 meter ned til kolen på 1148 før selve toppryggen. Hold deg til høyre for ura.

De siste 350 høydemeterne går de fleste til fots. Toppryggen smalner for hvert steg: 40 høydemeter under toppen faller nordsiden 43° og sørsiden 50°, og fra selve toppen måler nordflanken 57° og sørflanken 49° over de første 200 metrene ut. De øverste 70 meterne er knivegg. Toppen er 1564 moh.',
  description_down = 'Ned går samme vei: til fots ned toppryggen, på ski igjen fra kolen på 1148 moh, tilbake over høgde 1204 og Pukkelen og ned østryggen til flata ved 795 moh. Derfra ned Brekkheida til Skylstad.

Vanligste feil: å la seg friste av snøfeltene på flankene i stedet for å holde egga. Begge sider er brattest rett under kammen. Nordsiden går 57° over de første 200 metrene og holder over 50° i 300 høydemeter før den slaker av i ura rundt 1080 moh; sørsiden faller 49°, med et hamreband mellom 1530 og 1395 moh der enkelttrinn måler 78°. Det er her det har gått alvorlige ulykker. Hold ryggen til du er tilbake på Pukkelen.

Sørsiden rett ned mot Norangsdalen ser kort ut fra toppen. Den faller nær 1500 høydemeter til dalbunnen og ligger på 44° i snitt fra 1200 moh og ned til 350, med enkelttrinn over 50°. Sommerråsa fra Øye-parkeringen går ikke her — den følger sørøstryggen på 25–33° og kommer inn på østryggen ved høgde 1204. Sørsiden er ingen nedkjøring.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Skogpartiet over Brekkheida er brattest mellom 100 og 200 moh, 22,8° i snitt. Det bratteste enkelttrinnet på hele linja måler 49,3°, og det ligger ikke i skogen — det er toppblokka over 1520 moh, den delen skiene uansett bæres opp. Ryggen fra Pukkelen til høgde 1204 er snill: flankene der ligger på 26–35°. Det er de øverste 250 høydemeterne som er egg — nordsiden 43–57°, sørsiden 49–50°. Der er utglidning den reelle faren, og det er derfor skia blir båret.'
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
  description_up   = 'Frå vegenden ved Lisjeholen sør for Norang-gardane, 61 moh, tek du den bratte stien opp til Konedalen med skia på sekken — fyrst på venstre side av elva, så over på høgre. Skogen sluttar rundt 296 moh og terrenget er ope frå om lag 400. Dette er den delen av turen som ikkje er skitur, og ho stig 20 til 22 grader i snitt.

Oppe i dalen tek du på deg skia og følgjer det slake dalføret sørvestover til om lag 740 moh. Hald deg på søraustre side på veg inn: det kan gå skred frå Jakta heile vegen inn Konedalen, og dalbotnen er utløpssona.

Ved 740 moh svingar du til høgre og sikk-sakkar opp den 33 til 36 grader bratte sida i nordvest til du når toppryggen ved 1240 moh. Dette er den store skredfella på turen: eit samanhengande heng på 300 til 400 høgdemeter, og det er også nedkøyringa. Linja slik ho er teikna held 34,5 grader som brattaste samanhengande parti — sikk-sakken er kva som gjer talet lågare enn fallinja.

Ryggen blir følgd sørvestover heilt til topps på 1589 moh. Hald deg midt på han. Den bratteste hundremeteren på turen ligg mellom 1500 og 1600 moh og måler 24,6 grader i snitt, men det er ikkje hellinga som er problemet på ryggen — det er breidda: ein kryssprofil ved 62,1715 nord gjev 1556 moh på ryggen og 1265 moh berre 52 meter nordvest for han.',
  description_down = 'Vanlegaste nedkøyring er same vegen tilbake: 35 grader frå ryggen ned mot Konedalen, slakare vidare ut dalen, og til slutt stien ned til Lisjeholen med skia på sekken igjen. Sida ned frå ryggen er den beste køyringa på turen og samstundes det brattaste og mest skredutsette du er innom.

Vanlegaste feil: å lesa skavlane etter «høgre og venstre» i staden for etter kompasset. Fri Flyt skriv om skavlar både til høgre ned mot Konedalen og til venstre ned nordveggen, men det gjeld nedstiginga — på veg opp ligg Konedalen i søraust og fjordveggen i nordvest. Nordvestsida er ikkje ei felle du kan korrigera for undervegs: DTM1 måler om lag 80 grader rett under toppen, og fallet er nær 290 høgdemeter på 52 meter grunn.

Den andre feilen er å ta av frå dalen for tidleg. Fyrste utkastet av denne ruta svinga opp mot dalbotnen lenger inne, og den linja måler 40 til 44 grader mellom 1030 og 1205 moh. Sida ved 62,174 til 62,176 nord er den som held 33 til 36 heile vegen til ryggen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Sida frå Konedalen opp til toppryggen er den store skredfella: 33 til 36 grader over 300 til 400 høgdemeter, og du må gjennom henne både opp og ned. Det kan gå skred frå Jakta heile vegen inn Konedalen, så hald deg på søraustre side på veg inn dalen. Brattaste samanhengande parti på linja måler 34,5 grader, og brattaste hundremeter, 1500 til 1600 moh, 24,6 grader i snitt.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Toppryggen har skavl til begge sider — mot Konedalen i søraust, og mot nordvestveggen ned mot Hjørundfjorden, der DTM1 måler om lag 80 grader rett under toppen: 1556 moh på ryggen og 1265 moh 52 meter nordvest. Ein skavl som brest på den sida har ingen utgang. Held du deg midt på kammen frå 1240 moh og opp, er det den einaste linja som ikkje har eit stup eller eit 35-graders heng under seg.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade.'
    )
  )
where slug = 'jakta';

update public.tk_tours set
  description_up   = 'Frå bommen på Kvistadvegen ovanfor Kvistad-gardane, 104 moh, følgjer du den vinterstengde setervegen om lag 3,7 kilometer sørover og innover Kvistaddalen til parkeringa framfor Kvistadsætra og Årsetsætra, 509 moh. Dei 405 høgdemetrane opp setervegen er slake — bandet frå 100 til 500 moh ligg på 5 til 7 grader i snitt — og opnar bommen seint i april eller tidleg i mai, kan du køyra dei og kutta både kilometrane og høgdemetrane.

Frå setrene går ruta nordaustover opp gjennom open bjørkeskog. Skogen held til rundt 613 moh og terrenget er ope frå 790.

Så kjem storhellinga: opp mot skaret mellom Blåhornet og Skårasalen, 1074 moh, nord for og langsmed skredrenna aust for Blåhornet. Hellinga held 30 til 40 grader frå om lag 800 til 1100 moh. Linja slik ho er teikna sikk-sakkar og held 23,9 grader som brattaste samanhengande parti, med brattaste hundremeter, 900 til 1000 moh, på 20,0 grader i snitt — men renna ved sida av deg er den same uansett kor fint sporet ligg.

Over skaret svingar du aust-nordaust opp hovudhellinga mot ryggen og inn på toppplatået ved 1448 moh, og siste stykket sørover langs platået til toppen på 1542 moh. Linja kjem inn på platået frå nordvest med vilje: aust for eggja fell fjellet 300 høgdemeter på 74 meter grunn, om lag 76 grader, ned i Skåradalen.',
  description_down = 'Ned same vegen: sørvestover av platået, ned hovudhellinga til skaret, storhellinga ned mot setrene og setervegen ut. Sett av tid til dei siste 3,7 kilometrane — dei er flate nok til at du stakar dei.

Vanlegaste feil: å halda for langt aust på toppplatået. Skavlane ligg mot aust, og under dei fell austveggen 300 høgdemeter på 74 meter. I flatt lys er eggja ikkje synleg, og platået gir ingen andre haldepunkt.

Vestrennene ned til Årsetsætra er 45 grader og er ikkje ein del av denne ruta. Den tredje dokumenterte nedkøyringa, Lisje Skåradalen mot Skår ved Hjørundfjorden, er 25 til 30 grader krusterreng — men han endar ved fjorden, ikkje ved bilen din i Bondalen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Renna aust for Blåhornet går vanlegvis eitt eller fleire store skred ned mot setervegen kvar vinter, og oppstiginga går rett ved sida av henne. Hellinga held 30 til 40 grader frå om lag 800 til 1100 moh, og det er turens nøkkelparti både opp og ned. Sjølve linja måler 23,9 grader som brattaste samanhengande parti fordi ho sikk-sakkar; det endrar ikkje kva som ligg over sporet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'På toppplatået ligg det store skavlar mot aust, der fjellet fell 300 høgdemeter på 74 meter ned i Skåradalen — om lag 76 grader. Hald god avstand frå eggja. Vestrennene, som er ei dokumentert nedkøyring for andre parti, er 45 grader og ligg utanfor denne ruta.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Sunnmøre på varsom.no. Ta med sender/mottakar, søkjestang og spade.'
    )
  )
where slug = 'skarasalen';

update public.tk_tours set
  description_up   = 'Fra Spranget p-plass, 1082 moh, er det seks kilometer inn til Rondvassbu. Tjønnbakkvegen inn hit er bomveg, og midtvinters er Mysusæter siste brøytepunkt — da blir turen tilsvarende lengre. Du er over tregrensa fra første meter, så det er åpent fjell hele veien inn. Hold deg på land rundt vika ved Lonin i sørenden av Rondvatnet i stedet for å ta snarveien over isen; dette er utløpsenden, og der er isen tynnest.

Bak Rondvassbu, 1169 moh, stiger det bratt mot nordøst. Stidelet mot Storronden kommer tidlig, og din vei er den som fortsetter nordover inn i Rondholet. Botnen ligger på rundt 1500 moh og er flat — det er det siste flate partiet du får før toppen.

Fra Rondholet går det meget bratt opp i ur mot Firkløvereggen, eggen mellom Storronden og Vinjeronden på 1869 moh. Det bratteste hundremeterbeltet på hele oppstigningen ligger her, mellom 1600 og 1700 moh, og holder 20° i snitt. Er ura avblåst, bærer du skiene til du er oppe på eggen.

Videre stiger det til Vinjeronden, 2043 moh. Herfra faller ruta vel hundre høydemeter ned i Slottsbrue, skaret på 1939 moh, før den går opp igjen på eggen mot Rondslottet, 2178 moh. Eggen er fin å gå på, men den er smal: hold deg midt på ryggen. Terrenget faller 33–38° mot vest og over 45° mot øst.',
  description_down = 'Samme vei tilbake — over eggen, ned i Slottsbrue, opp igjen de hundre høydemeterne til Vinjeronden. Den gjenstigningen kommer sent på dagen og tar lengre tid enn den ser ut til; legg inn tida før du bestemmer deg for hvor lenge du blir på toppen.

Vanligste feil: å slippe seg vestover fra eggen for å slippe unna gjenstigningen over Vinjeronden. Vestsida av eggen mellom Slottsbrue og toppen faller 33–38° i nesten tre hundre høydemeter, ned i Styggebotn og videre mot Rondvatnet. Det slakner ikke før under 1700 moh, og til da henger du i én sammenhengende bratt flanke under en egg. Det er ingen snarvei — hold eggen til du er tilbake i skaret.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Fra Spranget inn til Rondholet er terrenget åpent og slakt, og du ligger over tregrensa hele veien. Det bratteste hundremeterbeltet på oppstigningen ligger mellom 1600 og 1700 moh og holder 20° i snitt — det er ura opp mot Firkløvereggen. Over Vinjeronden går ruta ned i Slottsbrue og opp igjen på en smal egg, med bratte flanker rett ved sporet på begge sider.'
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
  description_up   = 'Fra Spranget p-plass, 1082 moh, følger du Rondvassbu-vegen seks kilometer nordøstover: over 1137 moh, gjennom dalen sørvest for hytta og fram til Rondvassbu på 1214 moh. Bandet mellom 1100 og 1200 moh måler 1,3 grader i snitt over fire og en halv kilometer. Rundt vika ved Lonin i sørenden av Rondvatnet holder du deg på land i stedet for å ta snarvegen over isen.

Merk startpunktet: bomvegen til Spranget brøytes ikke, og parkeringa er offisielt åpen fra midten av juni. I mars–mai er Mysusæter siste brøytepunkt — det er 4,5 kilometer og hundre høydemeter lenger ned, og de kommer i tillegg til alt som står her.

Bak hytta stiger det bratt mot nordøst opp til stidelet på 1440 moh. Her deler turen lag med Rondslottet: den ruta fortsetter nordover inn i Rondholet, mens Storronden tar av mot høyre og østover opp på vestryggen.

Fra stidelet til toppen er det 698 høydemeter på 2,62 kilometer, monotont stigende og uten gjenstigning. Den bratteste hundremeteren ligger mellom 1900 og 2000 moh og måler 20,7 grader i snitt; bratteste sammenhengende parti på linja er 25,2 grader. Ryggen er steinete, og ur blåser ofte bar — da bæres skiene den siste biten til varden på 2139 moh.',
  description_down = 'Ned vestryggen til stidelet, ned bakken til Rondvassbu og deretter de seks kilometerne ut til Spranget. Nedkjøringa er sørvestvendt: peilinger mellom 225 og 255 grader holder 26 til 32 grader, og det er den sektoren ruta bruker.

Vanligste feil: å slippe seg rett vest fra toppen fordi det er den vegen bilen står. Rett vest, 270 grader, måler 49,6 grader. Nord faller 63, og øst og sørøst 56 til 67 — det er ikke skiterreng, og det ligger like ved den slake ryggen du kom opp. Den andre feilen er å la seg dra nordover mot Rondholet fra toppen.

De siste seks kilometerne er flate. Regn med å stake dem, og regn med at de tar lengre tid enn de ser ut til når du står på toppen og ser hytta.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Vestryggen er slak og oversiktlig: 698 høydemeter på 2,62 kilometer, bratteste sammenhengende parti 25,2 grader, og bratteste hundremeteren, 1900 til 2000 moh, 20,7 grader i snitt. Det er ingen egg og ingen gjenstigning på ruta. Hold deg på ryggen fra stidelet og oppover — det er den ene slake sida av fjellet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Bare vestryggen er slak. Nord faller 63 grader, øst og sørøst 56 til 67, og rett vest fra toppen 49,6. Rondane ligger i varslingsregion Nord-Gudbrandsdalen, som er en B-region på varsom.no: der publiseres skredvarsel bare ved faregrad 4–5, og en tom side betyr altså ikke at faren er vurdert og funnet lav. Det gjør egen observasjon viktigere her enn i regionene med daglig varsel.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Nord-Gudbrandsdalen på varsom.no, og husk at regionen bare varsles ved faregrad 4–5. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'storronden';

update public.tk_tours set
  description_up   = 'Fra parkeringen på Tjugen ved Lodalsvegen, 34 moh, følger du traktorvegen som etter hvert blir til Kloumannstien og går oppover i Fosdalen. De første 540 meterne går på veg; deretter tar stien over. Skogen slipper taket rundt 426 moh, ved Tyvasætra, og fra midten av mai må du regne med å bære skiene opp til Tjugensætra rundt 750 moh.

Elva krysser du rundt 650 moh. Stien svinger nordover et stykke før den tar seg tilbake sørover — følg den; juvet nedenfor er ikke noe å skjære over. Så følger rundt 400 høydemeter jevn stigning opp mot Skålavatnet. Stien svinger seg opp gjennom hellinga, og ingen hundremeter på dette strekket holder mer enn 18°.

Du passerer Skålavatnet på nordvestsida, 1141 moh, og fortsetter sørøstover inn i botnen. Derfra tar du opp til venstre mot den brede ryggen mot Sandsnibba. Den bratteste hundremeteren på hele linja ligger mellom 1400 og 1500 moh og holder 20,1° i snitt; det bratteste enkelttrinnet måler 29,1°.

Skålabu og Skålatårnet står på 1835 moh, der stien formelt slutter. Toppunktet ligger 370 meter lenger øst, flatt platå hele vegen. Ved dårlig sikt: hold ryggen. Den er slak å gå, men den faller bratt til begge sider — 56° i snitt de første 200 metrene mot nordvest, 42° mot sør — og skavlen henger ut over nordvestkanten.',
  description_down = 'Ned går du samme linja: over platået, ut ryggen, ned i botnen og forbi Skålavatnet på nordvestsida, så ned Fosdalen. 1816 høydemeter i ett strekk. Vil du ha noe brattere, følger du toppeggen lenger ut og legger linja i den sørvestvendte fjellsida — det er den vanlige varianten. Rett sørvest for tårnet står et bergtrinn på 60–66°, så du må ut på eggen før du slipper deg ned; derfra holder sida 24–26° i snitt med trinn på 39–44°, mot 20,1° på oppstigningen.

Vanligste feil: å forlate ryggen for tidlig. Nord- og nordvestsida rett under toppen er stup — 64° i de første 80 metrene — og sørsida er ikke stort snillere med sine 42°. Hold kammen til du er nede i botnen, og hold deretter nordvest for Skålavatnet og ned i Fosdalen. Trekker du vest for vatnet, står du over bergband som måler 68° ned mot Loen. Fra midten av mai slutter snøen rundt Tjugensætra, og de siste 750 høydemeterne går på beina.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja i seg selv er slak — bratteste hundremeter 20,1° i snitt, bratteste enkelttrinn 29,1°. Faren ligger i det du går under: det går skred langs Fosdøla og Skålelva, og nord for sommerruta etter at du har passert Skålavatnet.'
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
  description_up   = 'Start på grusparkeringa ved nasjonalparkgrensa i Veodalen, 1297 moh. Herfra følger du den bilfrie vegen sørvestover langs Veo i sju kilometer inn til Glitterheim på 1385 moh. Sju kilometer for 88 høydemeter: bandet mellom 1300 og 1400 moh måler 0,9 grader i snitt over nesten sju kilometer, og det er det flateste partiet på noen av turene i denne appen. Regn med at innmarsjen tar en drøy time hver vei før fjellet begynner.

Bak hytta legger ruta seg nordvestover opp nordsida av Steinbudalen. Ikke følg dalbunnen vestover over Steinbuvatna: utgangen av dalen mot breen har steg på 37 til 41 grader, mens nordflanken — der den merkede stien går — måler 23 til 32. Den bratteste hundremeteren på ruta ligger mellom 1400 og 1500 moh og holder 13,5 grader i snitt.

Fra rundt 2010 moh går ruta inn på ryggen øst for Glitterbrean, opp forbi 2222 moh og 2357 moh på øvre del av breen, og til slutt vestover opp den siste kneika til toppen på 2451 moh. Ut.no beskriver ruta som jevn stigning hele veien i terreng under 30 grader, med valget mellom sommerstien øst for breen og selve breen. Terrengmodellen er enig: bratteste sammenhengende parti på linja er 21,8 grader.

Sesongen er satt av vegen, ikke av snøen. Bomvegen fra Randsverk inn til Veodalen brøytes ikke og åpner sammen med Glitterheim midt i juni. Vil du gå den klassiske vårturen i mars–mai, må du enten gå de vel 24 kilometerne inn på ski eller forhåndsbestille beltebil hos hytta — linja er den samme, men de første sju kilometerne er da en del av en mye lengre innmarsj.',
  description_down = 'Ned samme vei: vestryggen og breen ned til rundt 2010 moh, nordsida av Steinbudalen ned til Glitterheim, og så de sju kilometerne ut Veodalen. De siste sju er ikke nedkjøring — det er null komma ni grader, og du staker dem.

Vanligste feil: å dra for langt nord på det brede topplatået i dårlig sikt. Toppen har bare tre slake sider; nord, nordøst, vest og nordvest faller 52 til 70 grader ned mot Grjotbrean og Glitterholet. Peilinger mellom 105 og 150 grader — sørøst, den vegen du kom — holder 17 til 24 grader. Ta ut kursen på toppen.

Glitterbrean er en bre. Sprekker og snøbroer er reelle, og når snødekket er tynt hører turen hjemme i tau og bresele. Det er en annen vurdering enn skredvurderingen, og den gjøres før du går ut på breen, ikke når du står midt på den.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja er slak hele veien: bratteste sammenhengende parti måler 21,8 grader, og den bratteste hundremeteren, 1400 til 1500 moh, holder 13,5 grader i snitt. Skredterreng er ikke det som gjør denne turen krevende. Det er breen, høyden og lengden — og at det slake terrenget over 2200 moh er breterreng, ikke fast fjell. Går du dalbunnen vestover over Steinbuvatna i stedet for nordflanken, får du derimot steg på 37 til 41 grader.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord, nordøst, vest og nordvest faller 52 til 70 grader fra toppen ned mot Grjotbrean og Glitterholet. Topplatået er bredt og gir ingen holdepunkter i dårlig sikt, og det er der de tre bratte sidene blir farlige — ikke fordi de er skredterreng du velger, men fordi de er kanter du kan gå ut på. Sørøst, mellom 105 og 150 grader, er den slake sida og den du kom opp.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade, og bresele og tau når du går på Glitterbrean.'
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
      'body',  'Selve linja er slak. Det bratteste hundremetersbåndet, 2400–2500 moh, ligger på 17,1 grader i snitt, og det bratteste enkeltsteget langs ruta måler 26,8 grader. Skredterreng er ikke det som gjør denne turen krevende — det er sprekkene i Styggebrean og høyden. Østryggen er smal og fanger fokksnø på lesida.'
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
  description_up   = 'Fra den brøytede plassen ved Gjuvvatnet på Sognefjellsvegen, 1274 moh, går du østover inn i dalsøkket. Hold sørsida av vatnet — der er det fast grunn hele veien, og du slipper å miste de tretti meterne ned på isen. Er vegkanten full, ligger alternativet ved Galgebergstjørnane et par kilometer nordover; korridoren fungerer derfra også.

Dalsøkket tar deg rett østover forbi et lite vatn på 1428 moh. Her er det åpent terreng fra første skritt til toppen — ingen skog, ingen skoggrense å ta hensyn til. Ved rundt 1500 moh trekker du nordøstover ut av søkket og opp mot en svak, vestvendt ryggformasjon. Den ryggen er hele resten av turen.

Ryggen stiger jevnt. Hundremetersbåndet mellom 1700 og 1800 moh ligger på 19,7 grader i snitt, og det bratteste steget på veg opp er 40 meter med 35 grader mellom 1820 og 1860 moh. Hold ryggkammen gjennom det partiet. Trekker du nordover her, faller terrenget 100 til 180 meter bort under deg, og du kommer inn under nordsida.

Toppen er et platå på 2025 moh. Varden ligger helt på kanten av nordsida — gå fram til den, ikke forbi den. Skavlene bygger seg ut mot nord og øst. Rett under varden stuper nordsida: de første 120 høydemetrene faller på nær 60 grader. Så slakner den til en hylle rundt 1840 moh, før den setter utfor igjen — 42 til 45 grader fra 1620 til 1500 moh, med bre og klipper under det.',
  description_down = 'Ned går du samme veg, vestover. Den store skålforma under ryggen er det morsomste på turen: 25 til 30 grader jevnt, korte partier over 30, og ett steg på 26 grader rett under ryggen. Derfra er det slakt ned dalsøkket til Gjuvvatnet.

Vanligste feil: å la seg dra sørover fra toppen, ned Steindalen. Det er fin skikjøring, men det er en annen tur — 1025 høydemeter ned til Helgedalen, og bilen din står på Sognefjellsvegen. Hold vestryggen til du ser vatnet.

Vestsida er hard om morgenen i april og mai, og sola trenger noen timer på den. Går du tidlig, tar du med stegjern; det bratte partiet ved 1840 moh er ikke morsomt på blank skare, verken opp eller ned.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Normalvegen ligger i slakt til middels bratt terreng. Dalsøkket opp til 1500 moh er flatt i seg selv, men det går under vestflanken av fjellet. Over 1700 moh blir det brattere: 19,7 grader i snitt gjennom båndet 1700–1800 moh, og det bratteste enkeltsteget langs linja måler 26,4 grader. Nøkkelpartiet mellom 1820 og 1860 moh er stedet på ruta der et flak løsner.'
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
  description_up   = 'Fra parkeringa ved Bessheim fjellstue på 961 moh følger du den merkede ruta vestover og opp de drøye 400 høydemeterne til nordøstenden av Bessvatnet på 1374 moh. Dette er turens første kneik og den holder 10–14 grader — jevnt, men det er her du gjør unna stigningen før flata. Fv51 over Valdresflye er vinterstengt sør for Maurvangen, men Bessheim ligger nord for stengsla og nås hele vinteren via Sjoa, Heidal og Randsverk.

Ute på Bessvatnet slutter turen å stige. Vatnet ligger på 1372 moh, og de neste seks kilometerne vestover faller og stiger til sammen ikke mer enn et par meter — i høydeprofilen er det den lange, flate midtdelen. Isen er normal vinterveg her, men linja på kartet er lagt på land i begge ender. Innerst, ved Grotåosen på 1385 moh, begynner fjellet på nytt.

Derfra går ruta rett vestover opp Grotådalen, mellom Bukkehøe i nord og austryggen til Besshø i sør, i jevn stigning til rundt 1745 moh. Den bratteste hundremeteren på hele turen ligger mellom 1800 og 1900 moh og måler 17,3 grader i snitt; bratteste sammenhengende parti på linja er 26,1 grader. Så sørvestover opp på ryggen ved Brue på 2047 moh, og vest-sørvest langs den slake ryggen de siste 210 høydemeterne. Ikke gå opp Besshøbrean til Brue, slik hyttas egen beskrivelse kan leses: overgangen fra breen til ryggen stiger fra 2004 til 2050 moh på 26 meter grunn, altså rundt 60 grader.

Toppen er et stort platå på 2257 moh. Peiling 75 grader fra varden — austryggen du kom opp — holder 17,8 grader. Peilinger på 60 og 90 grader måler 54 til 57. Det er hele turens problem i én setning: ryggen er smal nok til at det å bomme på den med tretti grader koster deg tjue grader helning.',
  description_down = 'Ned samme vei: vest-sørvest ned til Brue, ned Grotådalen til Grotåosen, og så de seks flate kilometerne østover langs Bessvatnet. Regn med å stake hele vatnet — det er ikke nedkjøring, det er transport, og det tar tid du må ha igjen av dagen.

Vanligste feil: å forlate topplatået i feil retning. Nord-, nordvest- og vestsida faller 55 til 70 grader rett ned mot Russvatnet og Gjende, og fra et rundt platå i dårlig sikt ser alle retninger like slake ut de første stegene. Ta ut kompasskurs på varden, ikke to hundre meter ut. Ryggen inn mot Brue er også smalere enn den kjennes: sørsida faller 35 til 40 grader mot Gjende, nordsida 25 til 30 ned mot Besshøbrean.

Sørrennene brukes som nedkjøring av dem som kjenner fjellet. De holder 35 til 40 grader med korte parti på 45, og er steinete og isete i dårlige forhold. Friflyts sørøstrenne ned mot Memurubu er en gjennomgangstur — den ender ikke ved bilen din.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigningen er lite bratt terreng: bratteste sammenhengende parti på linja måler 26,1 grader, og den bratteste hundremeteren, 1800 til 1900 moh, holder 17,3 grader i snitt. Austryggen selv ligger på 18 til 20 grader. Det som teller på ruta er ryggen inn mot Brue, der sørsida faller 35 til 40 grader mot Gjende og nordsida 25 til 30 mot Besshøbrean — smalt nok til at et spor som legger seg litt for langt ut på lesida er et annet spor enn det du planla.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Topplatået er stort og rundt, og nord-, nordvest- og vestsida faller 55 til 70 grader ned mot Russvatnet og Gjende. I dårlig sikt er det her turen blir farlig, ikke i oppstigningen. Radialmålinger fra varden viser hvor brått det skifter: 75 grader peiling holder 17,8, mens 60 og 90 grader måler 54 til 57. Overgangen fra Besshøbrean opp på Brue er rundt 60 grader og skal ikke gås. Sørrennene holder 35 til 40 grader med parti på 45.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'besshoe';

update public.tk_tours set
  description_up   = 'Du starter på Korpen, parkeringen på rv55 ved Prestesteinsvatnet, 1397 moh. Første kilometeren og litt til går nedover: følg vestsida av vatnet ned til demninga ved utløpet på 1343 moh. Du gir fra deg 53 høydemeter før du har begynt å stige. Hold land langs vestsida — ikke skjær over isen.

Forbi demninga trekker du opp i søkket øst for nordryggen til Steindalsnosi og inn på Fannaråkbreen rundt 1550 moh. Hold deg lavt og i den slake delen av breen. Den er oppsprukket, og du går den i tau.

Sikt deg inn mot 1688-høgda øst for Fannaråknosi og rund den. Ikke hold høyde over breen: går du for høyt før du svinger opp, blir passasjen opp på austryggen vesentlig brattere. Den bratteste hundremeteren ligger mellom 1800 og 1900 moh og holder 19,9° i snitt, og det bratteste enkelttrinnet på linja måler 42,7°.

Rundt knausen kommer du inn på søraustryggen og sommerstien fra Keisarpasset. Følg den over Fannaråknosi og videre langs austryggen til Fanaråken. Det henger store skavler på nordsida hele vegen, og nordsida faller 55–58° i de øverste 90 metrene under kammen — hold deg på sørsida, også når sikten er god.',
  description_down = 'Ned følger du samme linja — øst- og nordøstvendt, jevnt og slakt, med pålitelig vårsnø langt ut i sesongen. Den andre dokumenterte ruta, fra Turtagrø gjennom Helgedalen, gir 1196 høydemeter og er en annen dag.

Vanligste feil: å holde høyde over breen på vei ned, slik at du havner for høyt vest for 1688-høgda og må ned der det er brattest. Slipp deg ned rundt knausen slik du kom opp. Og husk at siste strekket ikke er gratis: fra demninga stiger det 53 høydemeter tilbake til Korpen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Normalvegen er slak — bratteste hundremeter holder 19,9° i snitt mellom 1800 og 1900 moh. Det bratteste enkelttrinnet på linja måler 42,7°, og det ligger i overgangen fra breen opp på austryggen rett øst for Fannaråknosi; går du for høyt over breen, blir den passasjen brattere enn den trenger å være. På Fannaråkbreen er sprekkene faren like mye som snøen.'
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
  description_up   = 'Start på parkeringa på østsida av fv51 der Valdresflya vandrerhjem sto før brannen i 2015, 1391 moh. Vegen er det som setter sesongen: fv51 er brøytet vinteren gjennom bare til Bygdin, og strekninga nordover forbi vandrerheimen åpner normalt rundt 1. april.

Herfra går ruta vestover ut på vidda, sør for Fisketjerne. De første 1,2 kilometerne er helt flate og faller faktisk ti høydemeter — du kommer til å stake dem, og du kommer til å stake dem hjem igjen. Vidda er samtidig helt åpen og gir ingen ly.

Så stiger det jevnt mot den første kneika på rundt 1530 moh og videre opp på ryggen ved 1736 moh. Ryggen følges vestover, sør for Øystre Rasletinden (2011 moh), til rundt 1890 moh. Ikke gå over Øystre Rasletinden: aust- og sørøstsida av den toppen måler 42 til 50 grader, og linjer inn dit fra aust får steg på 51 til 63.

Til slutt den korte kneika opp mot toppplatået. I fallinja måler den rundt 40 grader mellom 1945 og 1980 moh, og det er det ene stedet på ruta der du har et samlet bratt heng over deg. Linja som er tegnet legger seg på skrå over den og holder 22,1 grader som bratteste sammenhengende parti; den bratteste hundremeteren, 1900 til 2000 moh, måler 17,6 grader i snitt. Over kneika er det ut på platået og de siste hundre meterne til 2104 moh.',
  description_down = 'Ned samme vei: kneika, ryggen østover sør for Øystre Rasletinden, ned til 1736 og videre ned første kneik til vidda. Under første kneik, fra 1531 moh, er det slutt på kjøringa — de siste to kilometerne over vidda er flate, og de ti høydemeterne du fikk gratis på vei ut skal betales tilbake.

Vanligste feil: å ta ut kursen nordover fra toppplatået fordi det ser slakt ut. Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare aust og nordaust er slake — aust måler 26 grader, nordaust 32 — og det er den vegen du kom.

Waypointet på 1890 moh ligger på det terrengmodellen klassifiserer som snø og is. Det er en permanent snøfonn, ikke en sprukken bre: Leirungsbrean og Kalvehøgdbreene ligger fire kilometer lenger vest og sør.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nesten hele ruta er slak: første kneik måler 22 til 24 grader, ryggen 23, og bratteste sammenhengende parti på linja 22,1 grader. Det ene stedet med et samlet bratt heng over deg er kneika under toppplatået, som i fallinja måler rundt 40 grader mellom 1945 og 1980 moh. Der legger sporet seg på skrå, men snøen over deg bryr seg ikke om sporet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget utenfor',
      'body',  'Nord- og nordvestsida av Rasletinden faller 55 til 65 grader ned mot Leirungsdalen, og sørsida 48 til 57. Bare aust (26 grader) og nordaust (32) er slake, og de er ruta. Øystre Rasletinden, 2011 moh, ser ut som en naturlig del av ryggen, men aust- og sørøstsida av den måler 42 til 50 grader — skiruta går sør for toppen, ikke over den.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Jotunheimen på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'rasletinden';

update public.tk_tours set
  description_up   = 'Start på parkeringen ved Fagerstrand på østsida av Bygdin, like ved Bygdinstøga og Bygdin Høifjellshotell. Avgift 80 kroner, betales med Vipps. Fv51 er vinterstengt nordover, så Bygdin er den brøytede enden av vegen og plassen er tilgjengelig hele våren. Du er over skoggrensa fra første skritt, og stigningen begynner med en gang.

Legg sporet vest- og nordvestover inn mot den nedre delen av Fagerdalen framfor å gå rett mot toppen. Toppen ser nær ut herfra, men rett nord for parkeringen ligger et trinn som holder rundt 40 grader mellom 1090 og 1220 moh, og østsida av Synshorn faller enda lenger: 31 grader i snitt de første fire hundre metrene ned mot Fv51, med et parti på 57 grader. Ingen av dem er oppstigning. Hold deg vest for fjellet til du er over 1400 moh.

Flanken du går på ligger stort sett mellom 10 og 20 grader, i åpent terreng uten en trestamme. De siste hundre høydemeterne, fra 1400 til 1475, ligger i snitt på 16,6 grader, og bratteste enkeltparti på hele ruta måler 21,3 grader. Toppen tas fra sørvest, over den slake platåkanten.

Ved dårlig sikt: ikke gå øst eller nordøst fra toppen. Der slutter fjellet med en gang — østsida måler 31 grader i snitt, nordøstsida 33, og begge har partier over 50 grader innen to hundre meter fra toppryggen. Sørover er fella den motsatte: platået fortsetter nesten flatt og drar deg utover.',
  description_down = 'Ned samme flanke som opp. Sørvestflanken er bred og jevn — 16 grader i snitt, 23 på det bratteste — og med vårsnø går den rent hele vegen ned mot Fagerdalen.

Vanligste feil: å slippe seg rett sørover fra toppen fordi det er der parkeringen ligger. Sørsida frister nettopp fordi den er slak: 4,5 grader i snitt de første fire hundre metrene, ikke over 23 grader noe sted. Så tar den slutt. Rundt 1425 moh, en snau halvkilometer sør for toppen, faller sørveggen 223 høydemeter på 120 meter — 117 av dem på 56 meter der den er brattest, mellom 1330 og 1210 moh. Hold sørvestflanken i stedet, ned til rundt 1120 moh, og følg sporet øst- og sørøstover tilbake til Fagerstrand.

Ryggen nordvestover mot Heimre Fagerdalshøe (1510) er en forlengelse av turen, ikke en annen veg ned: 1,6 kilometer over et skar på rundt 1360 moh. Nedkjøringen derfra ned i Fagerdalen er brattere enn fra Synshorn og hører til dem som kjenner terrenget.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Oppstigningen går i åpent terreng hele vegen, uten skog å bremse noe. Bratteste enkeltparti på linja måler 21,3 grader, og de øverste hundre høydemeterne ligger i snitt på 16,6 grader. Selve sporet er altså slakt; det du må vurdere er hva som henger over deg når du kommer inn mot toppen fra sørvest.'
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
  description_up   = 'Start på parkeringen ved Fv51, en kilometer sør for Bygdin Høifjellshotell. Avgift 60 kroner dagen. Du er over skoggrensa allerede fra bilen. Den første kilometeren går over det flate platået vest for Stavtjerne og gir bare rundt tretti høydemeter, med et myrdrag som ligger dekket når det er skiføre.

Etter platået runder du foten av nordryggen og passerer grinda i reingjerdet. Herfra legger du sporet opp den brede nordvestskuldra. Den ligger stort sett på 15 til 22 grader, og de bratteste hundre høydemeterne, fra 1300 til 1400, ligger i snitt på 18,9 grader.

Øverst er ruta merket med jernstenger. De står der for folkene som vedlikeholder sambandsanlegget på toppen, og de er verdt gull i flatt lys. Bratteste enkeltparti på hele linja måler 22,9 grader, og det ligger her oppe, over 1500 moh. Toppen er 1607 moh, med Bygdin i nord og Jotunheimen bak.

Hold skuldra. Østover, mot Fv51, faller fjellet 43 grader i snitt de første fire hundre metrene, og mellom 1580 og 1420 moh — rett under toppen — går det 65 til 74 grader. Sørøstover, mot Nørdre Båtskardet, er snittet 41 grader og bratteste parti 63. Sørsida er slak øverst, rundt 16 grader de første to hundre metrene, og går så over i et trinn på 40 til 59 grader mellom 1535 og 1435 moh. Televerkets vinterløype svinger lenger vest, opp fra Raudfjorden på vestryggen, og møter denne linja først oppe under toppen; begge ligger på samme nord- og nordvestside.',
  description_down = 'Ned samme skulder. Jernstengene tar deg ned de øverste hundre høydemeterne i dårlig sikt, og under det er skuldra bred nok til at du kan velge linje selv.

Vanligste feil: å slippe seg østover fra toppen mot vegen du ser under deg. Der ligger østveggen over Fv51 — 43 grader i snitt, og 65 til 74 rett under toppryggen — og sørøstover skaret mot Nørdre Båtskardet, 41 grader og oppbrutt. Hold nordvestskuldra til terrenget flater ut, og ta så platået tilbake til parkeringen.

Sørruta fra Båtskaret finnes — 454 høydemeter på halvannen kilometer — men den er dokumentert som fottur, ikke som skioppstigning. Den er ikke vegen ned herfra.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nordvestskuldra ligger stort sett på 15 til 22 grader, de bratteste hundre høydemeterne 18,9 grader i snitt, og bratteste enkeltparti 22,9 grader oppe over 1500 moh. Visit Valdres beskriver flere linjevalg under 30 grader på denne sida, men med terrengfeller og utløpssoner i forsenkningene. Velg linje etter dagens varsel, ikke etter sporet som allerede ligger der.'
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
  description_up   = 'Start på den store parkeringa ved Hyndra bru nedanfor Trefta på Lykkjavegen, 893 moh. Dei fyrste sju hundre metrane deler grunn med preparerte langrennsspor; ruta forlèt løypetraseen så snart ho byrjar å stiga. Kryss elva og gå opp lia på vestsida.

Vidare nordvestover over det opne beltet på 1000 til 1100 moh. Bjørka held til rundt 951 moh, og over 1000 er alt ope. Både den kartlagde skitur-traseen og den merkte sommarstien går her, 200 til 400 meter nord for sjølve ryggkammen, på den breie nordaustskuldra — det er den linja som er teikna, og ho er slakare enn kammen.

Ved om lag 1320 moh kjem du inn på foten av austryggen, og han blir følgd heile vegen til topps. Stigninga er jamn: bandet frå 1300 til 1600 moh ligg på 19 til 20 grader i snitt, og brattaste hundremeteren, 1500 til 1600 moh, måler 20,3 grader. Toppryggen sjølv er slak, og dei siste 130 høgdemetrane til 1729 moh går i 11 grader.

Toppryggen er ofte avblåsen og hard. Det er ikkje eit skredproblem i seg sjølv, men det avgjer om dei siste hundre metrane er behagelege eller ikkje.',
  description_down = 'Ned same vegen, austover ned ryggen og lia til Trefta. Fallretninga på nedkøyringa er aust — den fallvekta gjennomsnittsretninga måler 84 grader. Det er den breie nordaustvende fjellsida under austryggen som er nedkøyringa, og ho er også den sida som samlar flakskavl etter vestleg vind. Det er den eine vurderinga turen faktisk krev.

Vanlegaste feil: å ta Skogshornrenna fordi ho ser ut som ei snarare linje ned. Renna vest og nord for toppen er ei eiga ekspertlinje på rundt 40 grader og er skredutsett — ho er ikkje normalruta, og ho endar ikkje der bilen står. Fri Flyt nemner òg ei renne rett nord frå toppen ned til flata på 1100 moh med retur sørover til parkeringa; det er ein variant for dei som veit kva dei vel.

Nede att kjem du inn på langrennssporet dei siste sju hundre metrane. Gå ved sida av det preparerte sporet, ikkje i det.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Jamn, brei stigning utan tekniske parti eller trange passasjar: brattaste samanhengande parti på linja måler 24,3 grader, og brattaste hundremeteren, 1500 til 1600 moh, 20,3 grader i snitt. Den breie nordaustvende fjellsida under austryggen samlar flakskavl etter vestleg vind, og det er nettopp der ein køyrer ned — så vindhistoria dei siste dagane betyr meir enn hellinga på denne turen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skogshornrenna vest og nord for toppen er ei eiga, skredutsett ekspertlinje på rundt 40 grader og må ikkje forvekslast med normalruta. Toppryggen er ofte avblåsen og hard. Elles er fjellet breitt og oversiktleg — dette er ein tur der feilen ein gjer er å velja feil linje ned, ikkje å bli overraska på veg opp.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottakar, søkjestang og spade.'
    )
  )
where slug = 'skogshorn';

update public.tk_tours set
  description_up   = 'Fra Hornslie, der Torsetstølvegen ender på 1056 moh, går du rett opp den første bakken. Den er kortere enn den ser ut — det bratteste hundremeterspennet på hele ruta, 1000–1100 moh, ligger på 17,2° i snitt — og over kanten flater det ut. Her er ingen skog å forholde seg til: hele turen går i åpent terreng.

Over kanten åpner Hødnetjedne-bassenget seg — Horntjerne på Kartverkets kart — og du gir tilbake 48 høydemeter ned mot vannet på 1191 moh. Om vinteren går linja rett over det frosne vannet; sommerstien holder venstre side. På andre sida deler ruta seg i to merkede linjer: én lengre og slakere ut på nordvestskulderen, én kortere og brattere opp østryggen. Denne beskrivelsen følger østryggen.

Fra østryggen er det jevn stigning vestover til toppen, med Veslehødn — Veslehorn på kartet — og hele Hemsedalen i ryggen. Toppflata er liten, og sørkanten ligger nærmere varden enn den ser ut: åtti meter sør for toppunktet faller terrenget 96 høydemeter på tjue meter grunn. Sørøstkanten gjør det samme, 63° over de bratteste seksti meterne, og sørvestkanten 57°. Hold ryggen inn til varden, og hold deg nord for kanten når du står der.',
  description_down = 'Samme vei ned. Østryggen gir jevn, oversiktlig kjøring ned mot Hødnetjedne, og bassenget under er det slakeste terrenget på turen — regn med å stake.

Vanligste feil: å la terrenget dra deg nordøstover mot Veslehødn i stedet for å svinge ned mot Hornslie. Øst for Veslehødn stuper Hydnefossen 155 meter fritt — høydemodellen tar 151 av dem i ett eneste tjuemeterssteg — og under fossen holder terrenget 50° videre ned. Fra vannet går hjemveien sørøstover, og husk de 48 høydemeterne opp av bassenget før den siste bakken ned til bilen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Selve linja er slak. Det bratteste hundremeterspennet, 1000–1100 moh i den første bakken opp fra Hornslie, ligger på 17,2° i snitt. Det bratteste enkeltpartiet ligger i bakken opp fra Hødnetjedne, mellom 1200 og 1230 moh, og måler 32,0° — det eneste stedet på linja som passerer 30°.'
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
  description_up   = 'Frå E16 ved Grotlandsbrua, om lag ein kilometer nord for enden av Lønavatnet, tek du av mot vest og køyrer Høylandsvegen opp til den nedlagde garden Høyland, 139 moh. Der tek skogsbilvegen over. Merk at brøyting heilt fram ikkje er dokumentert — det er ein grusveg til ein nedlagd gard, ikkje ein vinterveg.

Følg skogsbilvegen sørvestover til Bergsstølen på 380 moh og vidare opp det trange dalføret ved Breiming, 610 moh. Skogen held til rundt 544 moh og terrenget er ope frå 646. Det trange partiet ved Breiming er skredterreng — det er den eine staden på turen der du står i eit søkk med sider over deg.

Vidare følgjer du slakaste veg nordvestover mot Svartahorgi, til venstre for det trigonometriske punktet 834, og rundar sjølve Svartahorgi (1029 moh) før du kjem inn på ryggen på om lag 1003 moh. Brattaste hundremeteren på turen ligg mellom 800 og 900 moh og måler 18,6 grader i snitt.

Ryggen blir følgd vestover og deretter sørover over punkt 1305 — som ligg på nøyaktig 1305 moh — og opp nordryggen til toppen på 1412 moh. Dei siste 107 høgdemetrane tek 893 meter grunn: brei, slak rygg, og ofte avblåsen og hard fordi han er vindutsett. Dei fleste som går Lønahorgi startar frå toppen av Horgaletten-heisen på om lag 920 moh og har då 490 høgdemeter att; denne ruta er den lange varianten frå bilvegen, og det er òg den Fri Flyt kallar den finaste nedturen.',
  description_down = 'Ned same linja: nordryggen til punkt 1305, austover over Svartahorgi og ned til Breiming og Bergsstølen, og til slutt skogsbilvegen ned til Høyland. Fallretninga på nedkøyringa er nordaust. Nedste delen er tynn: snødekket ved Høyland og Bergsstølen er kortvarig, og utpå våren er det verdt å gå av tidleg heller enn å skrapa dei siste hundre høgdemetrane.

Vanlegaste feil: å tru at Bodegaen er nedkøyringa på denne turen. Den kjende frikøyringssida ligg søraust på fjellet og matar tilbake i heissystemet i Bavallen — ho endar ikkje ved bilen din på Høyland. Den dokumenterte varianten frå denne ruta er å ta seg ned i Årdalen frå punkt 1305 ved stabile forhold, og Årdalen er austsida, den bratte delen av fjellet.

Den andre feilen er å bruka det trange dalføret ved Breiming som nedkøyringslinje utan å tenkja på kva som ligg over. Store svaskred losnar seint på våren her og går langt.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja er teknisk enkel: brattaste samanhengande parti måler 30,8 grader og brattaste hundremeteren, 800 til 900 moh, 18,6 grader i snitt. Det trange dalføret ved Breiming er den eine staden ruta går inn i skredterreng, og det er òg der ho er smalast. Ryggen frå punkt 1305 og opp er brei og slak, men vindutsett og ofte avblåsen og hard — der er problemet feste, ikkje flak.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Austsida ned mot Årdalen er den bratte delen av fjellet, og store svaskred losnar der seint på våren og går langt. Årdalen ligg nordaust for toppen på om lag 930 moh og er ei dokumentert nedkøyring for dei som vel ho med opne auge — ikkje ein snarveg heim. Snødekket nede ved Høyland og Bergsstølen er tynt og kortvarig.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottakar, søkjestang og spade.'
    )
  )
where slug = 'lonahorgi';

update public.tk_tours set
  description_up   = 'Frå p-plassen ved Rv7 på Haugastøl, 1007 moh, følgjer du den kvista DNT-vinterruta mot Raggsteindalen nordover. Dei fyrste elleve kilometrane er innmarsj: over stigninga på 1212 moh, ut på flatene under Folarskardet på 1326 moh, og i alt rundt 600 høgdemeter fordelte så tynt at bandet mellom 1200 og 1300 moh måler 1,5 grader i snitt. Det er stakelende, ikkje skinnlende.

Ved Lordehytta i Folarskardet, 1620 moh, går du av merkinga. Hytta er frå 1880 og står i sjølve skardet; tjørna like ved ligg på 1603 moh og er vatn under snøen. Rutebeskrivinga seier at ein forlèt merkinga ved tjørna og følgjer varder oppover, og det er den linja som er teikna her — ikkje straklinja frå hytta mot toppen, som måler 40,3 grader som verste steg.

Trinnet ut av skardet er turens einaste bratte parti: 35 til 40 grader, målt til 36,7 grader over 41 meter på den slakaste ramma nokon finn. På linja som er teikna held bratteste samanhengande parti 25,5 grader, og den bratteste hundremeteren, 1700 til 1800 moh, måler 21,4 grader i snitt — skilnaden er at ruteren følgjer ramma i staden for fallinja. Er snøen hard eller avblåsen, er det her folk tek på seg stegjern.

Over trinnet, på om lag 1830 moh, flatar det ut att, og dei siste hundre høgdemetrane nordvestover til varden på 1927 moh går i 5 grader. Toppplatået er ope og har lite å navigere etter.',
  description_down = 'Ned same veg: over kanten av trinnet, ned ramma til Lordehytta, og deretter dei elleve kilometrane tilbake til Haugastøl. Nedkøyringa er sørvend — fallvekta gjennomsnittsretning er 167 grader — men ho er òg kort. Under skardet er det lang, slak transport, og har du motvind på flatene tek heimvegen like lang tid som innmarsjen.

Vanlegaste feil: å gå ut på nordsida av skarvet for å finne ei betre linje ned. Skavlane på nordsida heng langt ut over Raggsteindalen, og kanten er ikkje synleg frå platået i flatt lys. Den andre feilen er å undervurdera vêrvindauget: turen er ikkje bratt, men han er lang, og ein snuoperasjon på toppplatået i dårleg sikt betyr elleve kilometer att i motvind.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Trinnet opp frå Folarskardet er 35 til 40 grader og er det einaste verkelege skredterrenget på turen. Slik linja er teikna held ho seg lågare — bratteste samanhengande parti måler 25,5 grader og den bratteste hundremeteren, 1700 til 1800 moh, 21,4 grader i snitt — fordi ho følgjer ramma vardane går. Bommar du på ramma, måler nærliggjande linjer 40 til 46 grader. Trinnet kan òg vera avblåse og isete, og då er det stegjern og ikkje skredvurdering som er problemet.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Skavlane på nordsida av Hallingskarvet heng langt ut over Raggsteindalen, og toppplatået er ope og navigasjonskrevjande i dårleg sikt — det er lett å gå mot ein kant ein ikkje ser. Vestsida er Hellevassfonn og Finse-traversen, ei anna rute enn denne. Den lange innmarsjen gjer at vêret betyr meir enn hellinga: elleve kilometer er langt å snu på.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Hallingdal på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'folarskardnuten';

update public.tk_tours set
  description_up   = 'Fra avgiftsparkeringen øverst på Tjoflotvegen, 276 moh, følger du traktorveien et kort stykke før stien tar over. Regn med å bære ski gjennom skogen: skoggrensa ligger på 538 moh, og de fleste spenner dem først på oppe ved Vindhovden.

Skogen er det bratteste partiet før flanken. Fallinja mellom 335 og 405 moh måler 30° i snitt og tar 51° over de bratteste seksti meterne; stien tar den i svinger — ingen hundremeter i skogen holder mer enn 21° — og topper på 29° rundt 490 moh. Følg svingene — det finnes ingen snarvei her som lønner seg.

Ved stølen Vindhovden på 586 moh åpner det seg. Herfra følger du sørvestsida østover mot toppen, langs skulderen under ryggen. Rundt 900 moh strammer det til: spennet 900–1000 moh ligger på 23,3° i snitt og 1000–1100 på 19,7°, og det bratteste enkeltpartiet på linja, 29,1°, ligger lenger nede, rundt 490 moh i skogen. Grunnen blir samtidig steinete.

Over 1100 moh slakner linja igjen, og de siste høydemeterne er rolig terreng inn mot toppen. Men hold linja: noen titalls meter sør for deg ruller skulderen over. Ved 1146 moh faller sørsida 40° i snitt de neste 340 høydemeterne, med et enkelttrinn på 66°. Nord for linja er det motsatt — der slakner det ut i 2–5°, og det er den sida som lurer deg av ruta.',
  description_down = 'Flanken kjører like godt ned som den går opp: over 650 sammenhengende høydemeter fra toppen til Vindhovden, med fjorden foran deg hele veien. Du har bredde å velge i, men ikke ubegrenset — et par hundre meter sørover ruller skulderen over i 35–40°.

Vanligste feil: å følge fallinja. Tåka legger seg ofte på toppen her, og i flatt lys trekker den deg sørover av skulderen, ned i 35–40° med trinn opp mot 57°. Retter du for mye tilbake, havner du i det slake nord for linja — der ligger Hamreskredane, 530 meter nord for ruta på 758 moh, og under den faller terrenget 33° videre mot Granvinsfjorden. Sikt på Vindhovden, og hold høyden på skulderen hele veien ned.

Under Vindhovden er kjøringen over. Skoggrensa på 538 moh er der skiene går på sekken, og de siste drøyt 260 høydemeterne ned til Tjoflot går på beina, i de samme svingene du kom opp.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Ruta stiger 965 høydemeter på 3,66 km, og den bratteste delen ligger mellom 900 og 1100 moh: 23,3° i snitt over det første hundremeterspennet, 19,7° over det neste. Det bratteste enkeltpartiet på linja måler 29,1° og ligger rundt 490 moh, i skogen under Vindhovden. Det er over grensa der snø løsner, og partiet er langt nok til at du bør vurdere det for seg.'
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
  description_up   = 'Frå parkeringa ved Byrkjenes, 211 moh, innerst på Tordalsvegen nord for Strandebarm, går du opp den bratte skogkledde lia mot Fadnastølen, 498 moh. Dette er den brattaste delen av turen: brattaste hundremeteren ligg mellom 300 og 400 moh og måler 16,2 grader i snitt. Tordalsvegen er privat bomveg, og brøyting heilt fram til parkeringa er ikkje garantert — ring eller sjekk før du køyrer langt.

Over stølen opnar terrenget seg, med skog i flekkar opp til rundt 577 moh. Ruta held nordaustover inn på den breie sørvestryggen ved 629 moh.

Derfrå følgjer du ryggen samanhengande nordover — 791 moh, så skulderen på 977 moh. Heile den øvre delen ligg på 10 til 13 grader: det er slakare enn sørfallet like ved, som held 20,8 grader i snitt med eit 33,7-graders belte 580 til 640 meter ute frå toppen. Sørvestryggen måler 9,5 grader i snitt, og det er grunnen til at linja ligg der ho ligg.

Dei siste hundre metrane svingar nordaustover opp den slake toppkuppelen til varden på 1046 moh. Brattaste samanhengande parti på heile linja måler 25,8 grader, og det ligg nede i skogslia.',
  description_down = 'Ned same ryggen: sørover over skuldra på 977 moh og 791 moh, ned til 629 og vidare til Fadnastølen. Frå stølen og ned er det skogsli — bratt nok til å vera fin køyring, og bratt nok til å gå laus etter mildvêr og regn.

Vanlegaste feil: å gå for langt vest eller nord frå varden. Nordsida og nordvestsida fell 55 grader og vestsida 48 innanfor 800 meter frå toppen, og toppkuppelen er så slak at du ikkje kjenner det på skia før kanten er der. I flatt lys er det den einaste reelle faren på turen.

Den andre feilen er å ta sørfallet ned frå toppen i staden for sørvestryggen. Sør held 20,8 grader i snitt, men har eit belte på 33,7 grader 580 til 640 meter ute — det er ikkje same linja som ryggen, og det er ikkje der ruta går.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Nedste halvdelen er bratt skogsli, rundt 19 grader i snitt frå parkeringa til Fadnastølen, medan heile den øvre ryggen ligg på 10 til 13 grader. Brattaste samanhengande parti på linja måler 25,8 grader. Den skogkledde lia over Byrkjenes er bratt nok til å gå laus etter mildvêr og regn — det er den delen av ruta som endrar seg med vêret, ikkje ryggen.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Hald deg på sørvestryggen heilt opp. Nordsida og nordvestsida av toppen fell 55 grader og vestsida 48 innanfor 800 meter frå varden. Sørfallet held 20,8 grader i snitt, men med eit 33,7-graders belte 580 til 640 meter ute. Sørvestryggen sjølv måler 9,5 grader i snitt, og skilnaden mellom han og nabosidene er heile poenget med linjevalet på dette fjellet.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Voss på varsom.no. Ta med sender/mottakar, søkjestang og spade.'
    )
  )
where slug = 'vesoldo';

update public.tk_tours set
  description_up   = 'Fra parkeringen ved Kletta, 154 moh, følger du veien 300 meter før stien svinger opp mot Skarshaug. Første strekket går over innmark og videre inn i blandingsskogen; sporet er tydelig, og du stiger jevnt gjennom skogen til rundt 520 moh.

Over tregrensa reiser lia seg. Mellom 600 og 700 moh holder den 20,1° i snitt over hundre høydemeter, og det bratteste hundremeterspennet på turen kommer høyere: 22,7° mellom 900 og 1000 moh. Begge er noe du vil ha unnagjort tidlig på dagen. Toppen av bakken er Skarshaug, 806 moh, halvveis til Melderskin.

Nordøstover flater det ut i Rindane, de små ryggene og søkkene du siger gjennom mot Holo. Holo er flata på 1211 moh; Kartverket klassifiserer den som myr, og det er det ene stedet på ruta der linja flater helt ut. Her svinger den nordøst før den vender tilbake østover — den svingen holder deg på hylla og utenfor den bratte sør- og sørvestsiden rett under toppen.

Siste stigningen fra Holo til varden er 215 høydemeter på ni hundre meter: 13° i snitt, 25° der den er brattest. Øverst ligger skavlene langs toppkanten, og er snøen avblåst og hard, tar du på deg stegjern og har isøksa i hånda de siste meterne.',
  description_down = 'Ned igjen følger du oppstigningen: vestover fra varden til Holo, så sørvest gjennom Rindane og over Skarshaug, og til slutt ned lia og gjennom skogen til Kletta.

Vanligste feil: å slippe seg rett ned fra toppen i stedet for å gå tilbake til Holo først. Fallinja fra varden går sørover, og der stuper det — sørflanken snitter 44° over de tre første hundre metrene, med et bergband på 60° i de øverste sytti. Hold vestover til du står på hylla ved Holo, og gå ned oppstigningssporet derfra.

Under Skarshaug møter du bakken mellom 600 og 700 moh igjen, nå vestvendt og med sol på seg fra midt på dagen. Kjør den mens snøen fortsatt bærer; senere blir den tung og våt helt ned i skogen.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Den bratteste hundremeteren ligger mellom 900 og 1000 moh og holder 22,7°; bratteste enkeltsteg på linja måler 30,9°. Det er skredterreng, og det ligger i lia du må gjennom uansett. Ta den vurderingen nede ved skogkanten, mens det ikke koster deg noe å snu.'
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
  description_up   = 'Fra parkeringen ved Langefonn turisthytte, 922 moh, følger du den vinterstengte veien mot Stavsro. Etter 850 meter står du ved Svineroisetra, 1021 moh — det er kilometeren beskrivelsene snakker om. Bjørkebeltet slipper taket rundt 970 moh, og derfra er alt åpent fjell. Østryggen kan også nås fra Stavsro med 706 høydemeter, men veien dit er vinterstengt.

Ved setra tar du av veien svakt til høyre, sørvest, og setter kursen mot det laveste punktet på Himmelranden — toppen av Langefonn, 1455 moh. Ikke gå rett opp mot varden herfra. Fallinja fra Svineroisetra rett mot toppen holder 35–37° i øverste tredjedel; traversen mot Langefonn stiger jevnt på 12–16° og passerer aldri 25°, og det er den linja denne ruta følger.

Fra det laveste punktet vender du vest-nordvest og følger eggen. Stigningen er jevn: den bratteste hundremeteren på hele turen ligger mellom 1700 og 1800 moh og måler 15,8°, og bratteste enkeltsteg er 24,6°. Underveis kommer du inn på sommerstien fra Stavsro.

På 1831 moh går du ut på toppflata ved Gaustatoppen turisthytte, og derfra er det vel fem hundre meter nordvestover over blokkmark til varden. Flata er åpen og steinete og gir lite å styre etter; i dårlig sikt er hytta holdepunktet du navigerer på, både på vei opp og på vei ned.',
  description_down = 'Ned igjen følger du sporet ditt: øst-sørøst langs eggen til det laveste punktet på Himmelranden, så ned flanken mot nord-nordøst til Svineroisetra, og veien tilbake til Langefonn.

Vanligste feil: å slippe seg rett ned fra toppflata mot Svineroisetra i stedet for å følge eggen tilbake til det lave punktet først. Nordøstflanken rett under varden snitter 35° over de første fire hundre metrene og har 46° i det bratteste partiet — det er de samme tallene fallinja fra Svineroisetra gir i øverste tredjedel. Flanken ned fra eggen ved 1455 er en helt annen sak: 16–21°. Hold eggen til du står på 1455, så tar du flanken derfra.

De sju rennene østover fra toppryggen er noe annet. Friflyt oppgir et snitt like under 40°, og målt fra varden faller østnordøstflanken 31° i snitt over åtte hundre meter med 45° i det bratteste partiet. Friflyt skriver rett ut at rennene kan være skredutsatte, og at flere skikjørere har mistet livet i skred på Gaustatoppen. Kjører du dem, traverserer du sørover etter utløpet, tilbake til det første platået du kom opp på, og ned gjennom bjørkebeltet til Svineroisetra.',
  avalanche_notes  = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ruta',
      'body',  'Linja fra Langefonn holder seg under 25° hele veien til varden: bratteste enkeltsteg måler 24,6°, og den bratteste hundremeteren, mellom 1700 og 1800 moh, holder 15,8°. Selve oppstigningen er lite skredterreng. Det som flytter regnestykket er vinden — den blåser eggen bar og legger snøen i rennene på østsiden.'
    ),
    jsonb_build_object(
      'title', 'Terrenget rundt',
      'body',  'Tre steder ligger utenfor ruta og skal bli der. Østsiden av topptårnet med de sju rennene, der skred har tatt liv. Nordøstflanken rett under varden, 35° i snitt over fire hundre meter og 46° på det bratteste — det er fallinja mot Svineroisetra, og den du havner i om du slipper deg rett ned fra toppflata. Og nordvestsiden mot Rjukan: øverst er den slak, 14° de første fire hundre metrene, men den fortsetter 1350 høydemeter ned i dalen og bratner til over 50° nederst. Det er slakheten øverst som er fella.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Vest-Telemark på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'gaustatoppen';

-- gpx_path stays NULL everywhere: the GPX served by app/api/gpx/[slug] is
-- generated from lib/routes.ts, not from a recorded track uploaded to
-- Supabase Storage. Set this once surveyed files exist.
