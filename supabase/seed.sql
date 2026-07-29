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
  ('tromsdalstinden', 'Tromsdalstinden', 'Troms',      69.618, 19.078, 1238, 1200, '5–7 t', 2, 'V',  'des–mai', 'Tromsøs signaturtopp: lang, jevn oppstigning fra Tromsdalen med storslått utsikt mot Lyngen.', true),
  ('store-blamann',   'Store Blåmann',   'Troms',      69.663, 18.510, 1044, 1040, '4–6 t', 3, 'S',  'feb–mai', 'Kvaløyas brattest profilerte klassiker — krever stabile forhold og god planlegging.', true),
  ('storgalten',      'Storgalten',      'Lyngen',     69.795, 20.285, 1219, 1219, '5–7 t', 3, 'NV', 'feb–mai', 'Fjord-til-topp i ytre Lyngen: 1219 høydemeter rett opp fra havnivå.', true),
  ('rornestinden',    'Rørnestinden',    'Lyngen',     69.712, 20.049, 1041, 1041, '4–6 t', 2, 'V',  'jan–mai', 'Den vennligste inngangen til Lyngsalpene, med slak rygg og romslig nedkjøring.', true),
  ('kavringtinden',   'Kavringtinden',   'Lyngen',     69.556, 20.166, 1289, 1150, '5–7 t', 3, 'N',  'mar–mai', 'Indre Lyngen-perle med nordvendt snø som holder seg langt ut i mai.', true),
  ('hesten-segla',    'Hesten (Segla)',  'Senja',      69.503, 17.652,  626,  620, '2–4 t', 2, 'S',  'jan–apr', 'Kort tur, stort postkort: nedkjøring med Segla i fanget og havet under.', true),
  ('rombakstotta',    'Rombakstøtta',    'Narvik',     68.428, 17.703, 1243, 1100, '5–7 t', 3, 'SV', 'feb–mai', 'Narviks spisse landemerke — variert oppstigning og fin, vedvarende nedkjøring.', true),
  ('himmeltindan',    'Himmeltindan',    'Lofoten',    68.115, 13.435,  962,  960, '4–6 t', 3, 'Ø',  'feb–apr', 'Vestvågøys høyeste, med alpint preg og linjer rett mot Nordishavet.', true),
  ('stornappstinden', 'Stornappstinden', 'Lofoten',    68.080, 13.630,  740,  730, '3–5 t', 2, 'N',  'jan–apr', 'Lofot-klassiker i overkommelig format — mye fjell for høydemeterne.', true),
  ('kirketaket',      'Kirketaket',      'Romsdal',    62.583,  7.831, 1439, 1380, '5–6 t', 2, 'SV', 'des–mai', 'Norges kanskje mest populære topptur: bred rygg, trygge linjevalg, lang sesong.', true),
  ('slogen',          'Slogen',          'Sunnmøre',   62.085,  6.898, 1564, 1560, '6–8 t', 4, 'V',  'mar–mai', 'Sunnmørsalpenes dronning — en alvorlig tur for erfarne, i riktig vindu.', true),
  ('kolastinden',     'Kolåstinden',     'Sunnmøre',   62.255,  6.432, 1432, 1150, '5–7 t', 3, 'N',  'feb–mai', 'Alpin klassiker fra Standaldalen med velkjent renne og storslått finish.', true),
  ('skala',           'Skåla',           'Nordfjord',  61.862,  6.937, 1848, 1840, '6–8 t', 3, 'SV', 'mar–jun', '1848 sammenhengende høydemeter fra fjorden i Loen — en av landets lengste nedkjøringer.', true),
  ('fanaraken',       'Fanaråken',       'Sogn',       61.517,  7.899, 2068,  950, '5–7 t', 2, 'N',  'apr–jun', 'Høyfjellstur fra Sognefjellet med breutsikt og pålitelig vårsnø.', true),
  ('steindalsnosi',   'Steindalsnosi',   'Sogn',       61.453,  7.938, 2025,  620, '3–5 t', 1, 'S',  'apr–jun', '2000-meter for de fleste: kort, slak og solvendt fra Sognefjellsveien.', true),
  ('galdhopiggen',    'Galdhøpiggen',    'Jotunheimen',61.636,  8.313, 2469, 1100, '6–8 t', 3, 'N',  'apr–jun', 'Norges tak på ski — bre, tau og stor høyde; vanligvis gått fra Juvasshytta.', true),
  ('synshorn',        'Synshorn',        'Valdres',    61.437,  8.928, 1475,  400, '2–3 t', 1, 'Ø',  'feb–mai', 'Kort og trygg tur fra Valdresflye — perfekt førstetur og værvindu-tur.', true),
  ('bitihorn',        'Bitihorn',        'Valdres',    61.303,  8.792, 1607,  500, '2–4 t', 1, 'S',  'feb–mai', 'Markert horn med enkel normalrute og fin utsikt over Bygdin.', true),
  ('rondslottet',     'Rondslottet',     'Rondane',    61.911,  9.841, 2178, 1050, '6–8 t', 2, 'S',  'mar–mai', 'Rondanes høyeste: rolig høyfjellsterreng og stabil vårsesong.', true),
  ('snohetta',        'Snøhetta',        'Dovrefjell', 62.320,  9.266, 2286,  800, '5–7 t', 2, 'Ø',  'apr–jun', 'Storslått og luftig, men overraskende snill — når Snøheimvegen åpner.', true),
  ('storehorn',       'Storehorn',       'Hemsedal',   60.832,  8.325, 1478,  630, '3–4 t', 2, 'Ø',  'des–apr', 'Hemsedals husfjell for topptur — kort vei fra bilen, mange linjevalg.', true),
  ('oksen',           'Oksen',           'Hardanger',  60.452,  6.749, 1241, 1240, '4–6 t', 2, 'SV', 'jan–apr', 'Fjordutsikt i alle retninger og jevn stigning fra Tjoflot.', true),
  ('melderskin',      'Melderskin',      'Hardanger',  60.017,  6.130, 1426, 1420, '6–8 t', 3, 'V',  'feb–mai', 'Rosendalsalpenes storslåtte klassiker, fra sjøen til 1426 moh.', true),
  ('gaustatoppen',    'Gaustatoppen',    'Telemark',   59.852,  8.648, 1883,  950, '4–6 t', 2, 'NV', 'des–mai', 'Sør-Norges mest markante topp — ser du den, ser den deg.', true)
on conflict (slug) do update set
  name       = excluded.name,
  region     = excluded.region,
  lat        = excluded.lat,
  lng        = excluded.lng,
  summit_m   = excluded.summit_m,
  vertical_m = excluded.vertical_m,
  duration   = excluded.duration,
  grade      = excluded.grade,
  aspect     = excluded.aspect,
  season     = excluded.season,
  teaser     = excluded.teaser,
  published  = excluded.published;
-- The conflict clause refreshes the free columns only. description_up,
-- description_down, avalanche_notes and gpx_path are never touched here, so
-- re-seeding can never overwrite editorial work.

-- ============================================================================
-- Kirketaket — the one tour with a written guide
-- ----------------------------------------------------------------------------
-- Text is lifted verbatim from design-reference/Turguide Kirketaket.dc.html.
-- The prototype itself states this is example content, not a real trip
-- description: it must be rewritten and quality-assured before launch.
-- Paragraphs in the description columns are separated by a blank line.
-- ============================================================================

update public.tk_tours set
  description_up =
    'Fra vinterparkeringen i Skarbakkane følger du den brede ryggen mot sørvest. Sporet er som regel godt tråkket; hold høyre der skogen tynnes ut, så unngår du de bratteste kulene i skoggrensa.' || E'\n\n' ||
    'Over skoggrensa åpner terrenget seg. Ryggen er slak og trygg i normale forhold — det bratteste partiet kommer mellom 900 og 1200 moh, der mange legger slakere sikksakk. Toppflata er stor og godslig; varden står lengst sørøst.' || E'\n\n' ||
    'Ved dårlig sikt: hold ryggen. Terrenget på begge sider faller brattere enn det ser ut til fra sporet.',
  description_down =
    'Normalvegen ned følger oppstigningen — bred, jevn og med god flyt hele veien til skoggrensa. Ved gode forhold er den sørvestvendte flanken et naturlig linjevalg, men den samler fokksnø etter vind fra nordvest.' || E'\n\n' ||
    'Vanligste feil: å dra for langt mot sør på vei ned. Da havner du over de bratte partiene mot dalen — hold sporet til du ser parkeringen.',
  avalanche_notes = jsonb_build_array(
    jsonb_build_object(
      'title', 'Normalruta',
      'body',  'Holder seg under 30° hele veien i normale forhold. Ingen kjente utløpssoner krysser ruta.'
    ),
    jsonb_build_object(
      'title', 'Utenfor ruta',
      'body',  'Flankene mot sør og sørvest passerer 30–40° og samler fokksnø. Vurder kun ved stabile forhold.'
    ),
    jsonb_build_object(
      'title', 'Før du går',
      'body',  'Sjekk dagens skredvarsel for Romsdal på varsom.no. Ta med sender/mottaker, søkestang og spade.'
    )
  )
where slug = 'kirketaket';

-- gpx_path stays NULL everywhere: there is no real route geometry yet. The map
-- draws a schematic line (routeFor() in lib/tours.ts) until GPX files are
-- uploaded to Supabase Storage and referenced here.
