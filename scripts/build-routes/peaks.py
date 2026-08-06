"""Every tour, as a name the place-name register knows.

`lookup` is the name as spelled in Kartverket's place-name register (SSR), which
is not always the name the tour goes by: Kirketaket is registered as
Kyrkjetaket, Store Blåmann as Store Blåmannen, Trollhetta as Trollhøtta.

`near` is a coordinate to disambiguate by — for the first 24 it is the one that
was stored in lib/tours.ts, for the batch below it is the SSR representation
point the name resolves to. Either is far too coarse to draw a route from, but
plenty to tell apart a name that repeats across the country (there are four
mountains called Hesten on Senja alone, and two called Urdalsknuten in Sirdal).

The expected height decides how far `snap_summit` grows its search disc, so it
has to be the published summit height, not a guess. Where the register's own
point already sits on the top, the two agree within a metre or two.
"""

PEAKS = [
    # slug, lookup name, kommune hints, expected summit m, near lat, near lng
    #
    # — the first 24: corridors researched and independently audited, guides written —
    ("tromsdalstinden", "Tromsdalstinden", ["Tromsø"], 1238, 69.618, 19.078),
    ("store-blamann", "Store Blåmannen", ["Tromsø"], 1044, 69.663, 18.510),
    ("storgalten", "Storgalten", ["Lyngen"], 1219, 69.795, 20.285),
    ("rornestinden", "Rørnestinden", ["Lyngen"], 1041, 69.712, 20.049),
    ("kavringtinden", "Kavringtinden", ["Lyngen"], 1289, 69.556, 20.166),
    ("hesten-segla", "Hesten", ["Senja"], 556, 69.503, 17.652),
    ("rombakstotta", "Rombakstøtta", ["Narvik"], 1243, 68.428, 17.703),
    ("himmeltindan", "Himmeltindan", ["Vestvågøy"], 962, 68.115, 13.435),
    ("stornappstinden", "Stornappstinden", ["Flakstad"], 740, 68.080, 13.630),
    ("kirketaket", "Kyrkjetaket", ["Rauma", "Vestnes"], 1439, 62.583, 7.831),
    ("slogen", "Slogen", ["Ørsta"], 1564, 62.085, 6.898),
    ("kolastinden", "Kolåstinden", ["Ørsta"], 1432, 62.255, 6.432),
    ("skala", "Skåla", ["Stryn"], 1848, 61.862, 6.937),
    ("fanaraken", "Fannaråki", ["Luster"], 2068, 61.517, 7.899),
    ("steindalsnosi", "Steindalsnosi", ["Luster"], 2025, 61.453, 7.938),
    ("galdhopiggen", "Galdhøpiggen", ["Lom"], 2469, 61.636, 8.313),
    ("synshorn", "Synshorn", ["Vang", "Vågå"], 1475, 61.437, 8.928),
    ("bitihorn", "Bitihorn", ["Vang", "Øystre Slidre"], 1607, 61.303, 8.792),
    ("rondslottet", "Rondslottet", ["Dovre", "Folldal"], 2178, 61.911, 9.841),
    ("snohetta", "Snøhetta", ["Dovre"], 2286, 62.320, 9.266),
    ("storehorn", "Storehorn", ["Hemsedal"], 1478, 60.832, 8.325),
    ("oksen", "Oksen", ["Voss", "Ullensvang", "Ulvik"], 1241, 60.452, 6.749),
    ("melderskin", "Melderskin", ["Kvinnherad"], 1426, 60.017, 6.130),
    ("gaustatoppen", "Gaustatoppen", ["Tinn"], 1883, 59.852, 8.648),
    #
    # — added later: summit and route are terrain data, the corridor is a mapped
    #   trailhead rather than an audited route description, and no guide is
    #   written yet. See README, «The second batch». —
    ("hamperokken", "Hamperokken", ["Tromsø"], 1404, 69.562, 19.358),
    ("istinden", "Istinden", ["Bardu"], 1459, 68.573, 18.082),
    ("fastdalstinden", "Fastdalstinden", ["Lyngen"], 1275, 69.629, 20.169),
    ("store-kjostinden", "Store Kjostinden", ["Lyngen"], 1488, 69.606, 20.130),
    ("breitinden", "Breitinden", ["Senja"], 1001, 69.455, 17.649),
    ("keipen", "Keipen", ["Senja"], 938, 69.495, 17.723),
    ("moysalen", "Møysalen", ["Lødingen", "Sortland - Suortá"], 1262, 68.526, 15.452),
    ("geitgaljen", "Geitgallien", ["Vågan"], 1085, 68.344, 14.813),
    ("skjomtinden", "Skjomtinden", ["Narvik"], 1575, 68.344, 17.355),
    ("storsteinsfjellet", "Storsteinsfjellet", ["Narvik"], 1894, 68.232, 17.877),
    ("storsylen", "Storsylen", ["Tydal"], 1762, 63.020, 12.199),
    ("fongen", "Fongen", ["Selbu", "Tydal", "Meråker"], 1441, 63.181, 11.631),
    ("snota", "Snota", ["Surnadal"], 1668, 62.848, 9.095),
    ("trollhetta", "Trollhøtta", ["Surnadal", "Rindal"], 1616, 62.852, 9.324),
    ("blahoa", "Blåhøa", ["Oppdal"], 1671, 62.754, 9.332),
    ("storskrymten", "Storskrymten", ["Sunndal", "Lesja", "Oppdal"], 1985, 62.373, 9.062),
    ("bispen", "Bispen", ["Rauma"], 1462, 62.462, 7.650),
    ("skarasalen", "Skårasalen", ["Ørsta"], 1542, 62.166, 6.486),
    ("saudehornet", "Saudehornet", ["Ørsta"], 1303, 62.236, 6.142),
    ("jakta", "Jakta", ["Ørsta", "Volda"], 1588, 62.171, 6.617),
    ("hornindalsrokken", "Hornindalsrokken", ["Volda"], 1529, 62.072, 6.658),
    ("glittertinden", "Glittertinden", ["Lom"], 2452, 61.651, 8.558),
    ("besshoe", "Besshøe", ["Vågå"], 2258, 61.518, 8.687),
    ("rasletinden", "Rasletinden", ["Vang"], 2105, 61.395, 8.699),
    ("storronden", "Storronden", ["Sel", "Dovre"], 2138, 61.892, 9.862),
    ("skogshorn", "Skogshorn", ["Hemsedal"], 1728, 60.882, 8.695),
    ("reineskarvet", "Reineskarvet", ["Ål", "Hol"], 1791, 60.783, 8.161),
    ("folarskardnuten", "Folarskardnuten", ["Hol"], 1933, 60.613, 7.786),
    ("lonahorgi", "Lønahorgi", ["Voss"], 1410, 60.694, 6.415),
    ("vesoldo", "Vesoldo", ["Kvam"], 1046, 60.312, 6.092),
    ("saebyggjenuten", "Sæbyggjenuten", ["Bykle", "Tokke"], 1507, 59.462, 7.626),
    ("kjerag", "Kjerag", ["Sandnes"], 1110, 59.021, 6.580),
    ("grubba", "Grubbå", ["Sirdal"], 1184, 58.94971, 6.99479),
    #
    # — the Sunnmøre round: every peak Fri Flyt publishes a full route
    #   description for that starts at a road, cross-checked against a second
    #   source. `near` is the SSR representation point, which on these sits well
    #   off the top — Råna's reads 1562 m against a published 1586, Kvitegga's
    #   1451 against 1717 — so the height below is the published one and the disc
    #   search is what finds the summit. —
    ("jonshornet", "Jønshornet", ["Ørsta"], 1419, 62.31676, 6.33388),
    ("auskjeret", "Auskjeret", ["Sykkylven", "Stranda"], 1203, 62.37739, 6.77488),
    ("ytstevasshornet", "Ytstevasshornet", ["Sykkylven", "Ålesund"], 1330, 62.28256, 6.74254),
    ("rana", "Råna", ["Ørsta"], 1586, 62.27519, 6.57437),
    ("vassdalstinden", "Vassdalstinden", ["Ørsta"], 1277, 62.24479, 6.18813),
    ("torvloysa", "Torvløysa", ["Fjord"], 1850, 62.18331, 7.28006),
    ("skarene", "Skorene", ["Fjord", "Stranda"], 1829, 62.19164, 7.19670),
    ("melshornet", "Melshornet", ["Ørsta", "Volda"], 807, 62.17409, 6.14309),
    # Two mountains called Kvitegga are documented within 9 km of each other, and
    # the register has nine of the name. This is the 1717 m one above Snødalen,
    # registered in Volda; the Stranda point 62.13855,6.86486 tops out at 1488 m
    # and is the 1489 m Kvitegga skied from Ljøen — a different tour.
    ("kvitegga", "Kvitegga", ["Volda"], 1717, 62.09473, 6.70223),
    ("eidskyrkja", "Eidskyrkja", ["Volda"], 1482, 62.01697, 6.26245),
    ("sunndalsnipa", "Sunndalsnipa", ["Volda"], 1396, 62.00999, 6.31721),
    #
    # — the Vestland round, on the same four conditions as the Sunnmøre one.
    #   Fri Flyt indexes the county by district rather than by fylke, so the
    #   research came from five of them: skiturer-stryn, -sunnfjord, -sogn,
    #   -voss and -rosendal. —
    ("skarsteinfjellet", "Skarsteinsfjellet", ["Stryn"], 1566, 61.83096, 6.73422),
    ("glitregga", "Glitregga", ["Stryn"], 1297, 61.90726, 6.37298),
    ("lodalskapa", "Lodalskåpa", ["Stryn", "Luster"], 2082, 61.79061, 7.20465),
    ("snonipa", "Snønipa", ["Sunnfjord", "Gloppen"], 1827, 61.67808, 6.69054),
    ("kvamshesten", "Kvamshesten", ["Sunnfjord", "Askvoll"], 1209, 61.40128, 5.62742),
    ("molden", "Molden", ["Luster"], 1116, 61.34560, 7.31798),
    ("togga", "Togga", ["Sogndal"], 1205, 61.33508, 6.89296),
    ("storanosi", "Storanosi", ["Voss"], 1205, 60.76643, 6.62281),
    ("horndalsnuten", "Horndalsnuten", ["Voss"], 1461, 60.64227, 6.67533),
    ("gygrastolen", "Gygrastolen", ["Kvinnherad"], 1339, 60.05918, 6.16160),
    ("juklavasstinden", "Juklavasstinden", ["Kvinnherad"], 1360, 60.00844, 6.13299),
    ("englafjell", "Englafjell", ["Kvinnherad"], 1200, 59.89635, 5.87561),
]
