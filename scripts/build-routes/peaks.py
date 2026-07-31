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
    ("istinden", "Istinden", ["Bardu"], 1494, 68.573, 18.082),
    ("fastdalstinden", "Fastdalstinden", ["Lyngen"], 1275, 69.629, 20.169),
    ("store-kjostinden", "Store Kjostinden", ["Lyngen"], 1488, 69.606, 20.130),
    ("breitinden", "Breitinden", ["Senja"], 1001, 69.455, 17.649),
    ("keipen", "Keipen", ["Senja"], 1042, 69.495, 17.723),
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
    ("urdalsknuten", "Urdalsknuten", ["Sirdal"], 1054, 58.926, 6.973),
]
