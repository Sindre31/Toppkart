"""The 24 tours.

`lookup` is the name as spelled in Kartverket's place-name register (SSR), which
is not always the name the tour goes by: Kirketaket is registered as
Kyrkjetaket, and Store Blåmann as Store Blåmannen.

`near` is the coordinate currently stored in lib/tours.ts. Every one of them is
within ~20 km of the real peak, which is far too coarse to draw a route from but
plenty to disambiguate a name that repeats across the country (there are four
mountains called Hesten on Senja alone).
"""

PEAKS = [
    # slug, lookup name, kommune hints, expected summit m, near lat, near lng
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
]
