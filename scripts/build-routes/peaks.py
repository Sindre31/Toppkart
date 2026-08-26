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
    # Corrected in the sixth round. The registry pointed at a 1459 m Istinden in
    # inner Sørdalen on the Nordland border — a real mountain the register knows,
    # but not the tour: the only description of it is a summer fell-running
    # report. The Istind everyone means is **Vestre Istinden**, 1489 m, the
    # landmark of Indre Troms, and Fri Flyt publishes a full ski description for
    # it. Same slug, right mountain, 50 km north.
    ("istinden", "Vestre Istinden", ["Bardu"], 1489, 68.94986, 18.56679),
    ("fastdalstinden", "Fastdalstinden", ["Lyngen"], 1275, 69.629, 20.169),
    ("store-kjostinden", "Store Kjostinden", ["Lyngen"], 1488, 69.606, 20.130),
    ("breitinden", "Breitinden", ["Senja"], 1001, 69.455, 17.649),
    ("keipen", "Keipen", ["Senja"], 938, 69.495, 17.723),
    ("moysalen", "Møysalen", ["Lødingen", "Sortland - Suortá"], 1262, 68.526, 15.452),
    ("geitgaljen", "Geitgallien", ["Vågan"], 1085, 68.344, 14.813),
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
    #
    # — the Oslo round. The register spells three of these differently than the
    #   route descriptions do: the mountain is Høgevard and the DNT hut on its
    #   shoulder is Høgevarde, Bletoppen is registered as Store Ble, and
    #   Styggemann as Styggmann. `near` is the SSR representation point, which on
    #   all seven sits on or within a few hundred metres of the top. —
    ("hogevarde", "Høgevard", ["Krødsherad", "Flå"], 1459, 60.29741, 9.46728),
    ("grafjell", "Gråfjell", ["Sigdal"], 1466, 60.31753, 9.39595),
    ("ranten", "Ranten", ["Sigdal"], 1419, 60.30228, 9.41905),
    ("store-ble", "Store Ble", ["Tinn", "Notodden", "Flesberg"], 1341, 59.80767, 9.15277),
    ("surloytenuten", "Surløytenuten", ["Notodden"], 1096, 59.79453, 9.20624),
    ("gyranfisen", "Gyranfisen", ["Ringerike"], 1127, 60.47199, 9.89037),
    ("styggemann", "Styggmann", ["Kongsberg"], 871, 59.52074, 9.64325),
    #
    # — the Trondheim round: the fjells a car from Trondheim reaches in one to
    #   two hours. Okla is looked up as **Snydda**, which is what the register
    #   calls the massif's high point and where the cairn and the summit book
    #   are; the point registered as Okla, 2,4 km due west, is a 1460 m
    #   shoulder. `near` is the SSR representation point for all six. —
    ("vassfjellet", "Vassfjellet", ["Melhus"], 710, 63.26183, 10.35606),
    ("krakfjellet", "Kråkfjellet", ["Trondheim", "Melhus"], 817, 63.16317, 10.63236),
    ("rensfjellet", "Rensfjellet", ["Melhus", "Selbu", "Midtre Gauldal"], 941, 63.14214, 10.72183),
    ("storhornet", "Storhornet", ["Oppdal"], 1589, 62.64811, 9.39909),
    ("storbekkhoa", "Storbekkhøa", ["Oppdal"], 1504, 62.73018, 9.08053),
    ("okla", "Snydda", ["Oppdal"], 1580, 62.68968, 9.26195),
    #
    # — the alpine-resort round: the fjells you reach from Hemsedal, Trysil,
    #   Kvitfjell, Hafjell and Geilo. Three of the names are spelled differently
    #   in the register than in the route descriptions — Kyrkjebønosi is
    #   **Kyrkjebønøse**, Bånsæterkampen is written with æ and the tour
    #   descriptions with e, and Nevelfjell is registered without the definite
    #   article the guidebooks give it. `near` is the SSR representation point
    #   except on two, where the register point is too coarse to say which top
    #   the tour goes to and a published route says it instead:
    #
    #   - **Nibbi** takes Fri Flyt's own GPS position for the summit. The
    #     register point sits 1,2 km south-south-west of the top on 1648 m
    #     ground, 93 m below the published height.
    #   - **Prestholtskarvet** takes the last vertex of ut.no's ski line. Two
    #     tops 650 m apart on the Hallingskarvet plateau read 1859.5 and 1857.5,
    #     the register point sits between them 554 m from the higher one, and
    #     against a published 1859 the tie rule in `resolve_top` handed the tour
    #     to the *nearer* one. The route's own endpoint is 20 m from the higher
    #     top and 660 m from the lower, and the register has no other Fjell name
    #     within 2 km. —
    ("nibbi", "Nibbi", ["Hemsedal"], 1741, 60.88668, 8.65014),
    ("slettind", "Slettind", ["Hemsedal"], 1592, 60.96894, 8.18398),
    ("kyrkjebonosi", "Kyrkjebønøse", ["Hemsedal"], 1671, 60.89983, 8.55075),
    ("prestholtskarvet", "Prestholtskarvet", ["Hol"], 1859, 60.55829, 8.01297),
    ("ustetind", "Ustetind", ["Hol"], 1376, 60.45843, 8.09028),
    ("banseterkampen", "Bånsæterkampen", ["Ringebu", "Gausdal"], 1202, 61.39240, 10.10840),
    ("nevelfjell", "Nevelfjell", ["Lillehammer", "Øyer"], 1089, 61.20445, 10.56701),
    ("trysilfjellet", "Trysilfjellet", ["Trysil"], 1132, 61.30773, 12.17303),
    ("ulvsjoberget", "Ulvsjøberget", ["Trysil"], 851, 61.26538, 12.01805),
    #
    # — the popularity round: the mountains a published source calls the most
    #   visited or most popular ski tour of its area. Two of the five are spelled
    #   differently in the register than in the route descriptions — Strandtinden
    #   is **Strandstinden** and it is registered in Lødingen rather than in the
    #   Tjeldsund the guidebook files it under, and Råskarfjellet is
    #   **Råskardfjellet**, which Fri Flyt indexes by its height, «1609». `near`
    #   is Fri Flyt's own GPS position for the summit on the four it publishes
    #   one for, and the SSR representation point for Strandtinden. On Kjølen the
    #   two disagree by 700 m and 90 vertical metres: the register point sits on
    #   a shoulder, and the disc search would have to grow that far to see the
    #   top, so the published position is the seed. —
    ("rodtinden", "Rødtinden", ["Tromsø"], 470, 69.70149, 18.75253),
    ("kjolen", "Kjølen", ["Tromsø"], 790, 69.73368, 18.78696),
    ("ullstinden", "Ullstinden", ["Tromsø"], 1078, 69.79580, 19.66870),
    ("strandtinden", "Strandstinden", ["Lødingen"], 1076, 68.50435, 16.03420),
    ("raskarfjellet", "Råskardfjellet", ["Hemsedal"], 1609, 60.88433, 8.20885),
    #
    # — the Bergen round, continued: the Kvamskogen candidates bergen_research.json
    #   left «ready to route». Såta is registered as **Iendefjell** at the same
    #   coordinate — the register carries both names, which corroborates Fri
    #   Flyt's «Såta, som mange kaller Iendafjellet» rather than leaving it as a
    #   claim about local usage. Tveitakvitingen's register point is 8 m from
    #   where ut.no's own GPX line ends. —
    ("sata", "Såta", ["Kvam"], 1260, 60.43158, 5.98895),
    ("skrott", "Skrott", ["Kvam"], 1320, 60.45728, 6.14436),
    ("tveitakvitingen", "Tveitakvitingen", ["Kvam", "Samnanger", "Bjørnafjorden"], 1299, 60.32527, 5.90835),
    #
    # — the Voss round: the two tours on Fri Flyt's skiturer-voss index the app
    #   did not already carry. Fri Flyt calls the first one Finnbufjellet, but
    #   the register's Finnbufjellet point (Fjell, 60.88774/6.44335) reads
    #   1330,8 m against a published 1358, and the top itself is registered
    #   **Finnbunuten** — 1357,0 m at 60.88067/6.44088, the Kirketaket pattern
    #   again. The app bears Fri Flyt's name, the summit search the register's. —
    ("finnbufjellet", "Finnbunuten", ["Voss"], 1358, 60.88067, 6.44088),
    ("vatnaknausen", "Vatnaknausen", ["Voss"], 1303, 60.64957, 6.64765),
    #
    # — the popularity round, continued: two more mountains a published source
    #   calls the most popular of their area. Fri Flyt's second Småtindan
    #   description calls Varden «den mest populære toppturen på øygruppa», and
    #   its Midtitinden page «en av de mest populære skitoppene rundt Bodø».
    #   Varden is the Hesten (Segla) pattern — the register carries both Varden
    #   (Ås) and Småtindan (Fjell) at the top, and a 732 m neighbour 600 m SW is
    #   why the claim-tiebreak matters. Midtitinden's register point reads 983,5
    #   against a published 1058; the top is 190 m SW at 1059,2 — the
    #   Gullfjellstoppen pattern. —
    #   The resolver searches by name, and a bare «Varden» never reaches Vågan
    #   inside SSR's first page — the register's Fjell-name Småtindan (13 m from
    #   the top cell) is the seed instead, exactly like Kyrkjetaket seeds
    #   Kirketaket.
    ("varden-smaatindan", "Småtindan", ["Vågan"], 700, 68.23324, 14.38798),
    ("midtitinden", "Midtitinden", ["Bodø"], 1058, 67.34397, 15.00963),
    #
    # — round 4: a backlog name with a full description (Englafjell was already
    #   here), and Sandhornet from Fri Flyt's Bodø index — the mountain stands
    #   in Gildeskål, the card keeps Fri Flyt's Bodø the way Strandtinden keeps
    #   Harstad. —
    ("sandhornet", "Sandhornet", ["Gildeskål"], 993, 67.11117, 14.06776),
    #
    # — round five: Helgeland, a new region, and the island tour Fri Flyt says
    #   «regnes av mange som Helgelands fineste skifjell». The register spells
    #   it **Tommskjevelen** and its point sits on a 756 m west knoll; the top
    #   itself — 920,2 against a published 922 — is 330 m east, and the growing
    #   disc with the claims tiebreak is what finds it. —
    ("tomskjevelen", "Tommskjevelen", ["Nesna"], 922, 66.27898, 12.84673),
    #
    # — round six: the Kaperdalen classic on Senja. «Tredje Svanfjell» has no
    #   register name of its own; the resolver seeds on Fri Flyt's published
    #   GPS position via SUMMIT_SEED, and the register's Svanfjellet (the
    #   massif, 2,2 km SE) supplies the searchable name. —
    ("tredje-svanfjell", "Svanfjellet", ["Senja"], 898, 69.29947, 17.40356),
    ("husfjellet", "Husfjellet", ["Senja"], 632, 69.47024, 17.27304),
    #
    # — the five-route round: the rest of Fri Flyt's Senja index and the two
    #   buildable names on its Helgeland index. Fri Flyt publishes a UTM33 GPS
    #   point for each of the Senja tops, which converts to within 10 m of the
    #   register point in both cases — so the register name and the published
    #   position agree here, which is not the rule in this file. Lonketinden is
    #   the register spelling; Fri Flyt writes «Lonketind» in the title and
    #   «Lunketind» once in the body. —
    ("lonketind", "Lonketinden", ["Senja"], 848, 69.09398, 16.91556),
    ("skolpan", "Skolpan", ["Senja"], 779, 69.40883, 17.45355),
    # Lukttinden's expected height is ut.no's 1348, not Fri Flyt's 1342: the
    # summit search resolves 1347,8 on the register point, and the card carries
    # 1348. Leaving 1342 here made the resolver report a +5,8 m delta against a
    # figure this round had already found to be the weaker of the two.
    ("lukttinden", "Lukttinden", ["Vefsn"], 1348, 65.99044, 13.54468),
    ("tortenviktinden", "Tortenviktinden", ["Lurøy"], 1027, 66.34217, 13.23361),
    #
    # — the Romsdal round: five classics around Isfjorden, Skorgedalen, Måndalen
    #   and Innfjorden, all from Fri Flyt's Romsdalen index. The register point
    #   for Skarven falls within 13 m of Fri Flyt's published UTM33 GPS point.
    #   Blånebba's and Øspetinden's register points read 48 and 25 m below the
    #   published heights — both are representation points a hillclimb has to
    #   walk uphill from, like most of this file. —
    ("skarven", "Skarven", ["Rauma"], 1048, 62.60740, 7.60177),
    ("blanebba", "Blånebba", ["Rauma"], 1320, 62.52646, 7.79221),
    ("mjolvafjellet", "Mjølvafjellet", ["Rauma"], 1216, 62.54165, 7.76342),
    ("ospetinden", "Øspetinden", ["Rauma"], 1228, 62.51559, 7.25049),
    ("middagstinden", "Middagstinden", ["Rauma"], 1569, 62.46028, 7.44046),
    #
    # — the Troms round: five around Tromsø — Breivikeidet, Ramfjord and
    #   Ringvassøya — from Fri Flyt's Troms index (Espen Nordahl's book behind
    #   most of it). Gabrielfjellet is the Kirketaket case: the mountain skiers
    #   name is registered as Iverfjellet (47 m from Fri Flyt's published GPS
    #   point), while SSR's own «Gabrielfjellet» is a shoulder 3,2 km northeast.
    #   Storfjellet's register row exists but sits beyond the SSR API's default
    #   page — queried directly with knr=5501 it lands 46 m from the published
    #   point. —
    ("skarlitinden", "Skarlitinden", ["Tromsø"], 857, 69.63314, 19.33569),
    ("storfjellet", "Storfjellet", ["Tromsø"], 1089, 69.64913, 19.39432),
    ("gabrielfjellet", "Iverfjellet", ["Tromsø"], 1213, 69.57798, 19.37878),
    ("fagerfjellet", "Fagerfjellet", ["Tromsø"], 957, 69.55065, 19.26398),
    ("store-skalltinden", "Store Skalltinden", ["Karlsøy"], 900, 69.87098, 19.29279),
    #
    # — the Lofoten round: five on Austvågøya and Vestvågøy from Fri Flyt's
    #   Lofoten index — an older page format with no KAST field and no GPS
    #   point on most tours, so the register and the terrain model carry more
    #   of the verification than usual. —
    ("justadtinden", "Justadtinden", ["Vestvågøy"], 738, 68.18215, 13.80365),
    ("rundfjellet", "Rundfjellet", ["Vågan"], 803, 68.28943, 14.56506),
    ("torskmannen", "Torskmannen", ["Vågan"], 755, 68.33678, 14.60382),
    ("pilan", "Pilan", ["Vågan", "Hadsel"], 828, 68.36880, 14.66378),
    ("kleppstadheia", "Kleppstadheia", ["Vågan"], 534, 68.26802, 14.31167),
    #
    # — the Narvik round: five from Fri Flyt's Narvik chapter — Håkvikdalen,
    #   Beisfjord/Djupvik, Skjomen and Gratangsfjellet. Skjomtinden is the
    #   Sovende dronning; Litletind is registered Litletinden. —
    ("skjomtinden", "Skjomtinden", ["Narvik"], 1575, 68.34352, 17.35470),
    ("litletind", "Litletinden", ["Narvik"], 1096, 68.36063, 17.33620),
    ("beisfjordtotta", "Beisfjordtøtta", ["Narvik"], 1448, 68.40588, 17.57398),
    ("spanstinden", "Spanstinden", ["Loabák - Lavangen", "Lavangen"], 1457, 68.69988, 17.86830),
    ("gangnesaksla", "Gangnesaksla", ["Narvik"], 1318, 68.19956, 17.26234),
    #
    # — the Sør-Troms round: Kvæfjord and Ibestad (Andørja and Rolla) from Fri
    #   Flyt's Harstad section — a chapter where nearly everything is KAST 3
    #   with ice axe and crampons on the list, which is why the region held one
    #   tour. Snytindan is the register spelling of Fri Flyt's Snøtindan. —
    ("snotinden", "Snøtinden", ["Ibestad"], 1215, 68.83674, 17.30609),
    ("stortinden-rolla", "Stortinden", ["Ibestad"], 1021, 68.79232, 17.03672),
    ("reinspalen", "Reinspælen", ["Kvæfjord"], 1118, 68.59348, 15.69887),
    ("snotindan", "Snytindan", ["Kvæfjord"], 996, 68.54323, 15.61677),
    ("storhornet-kvafjord", "Storhornet", ["Kvæfjord"], 722, 68.82460, 16.21305),
    #
    # — the Tjeldsund round: five from Fri Flyt's Tjeldsund chapter, on both
    #   sides of Tjeldsundet where Strandtinden has stood alone since the
    #   backlog round. Two KAST 1 ridges (Sætertinden, Haukebøtinden) and the
    #   three KAST 2 summits around Kongsvikdalen and Fiskefjorden. Jakobstinden
    #   sits on the Kvæfjord/Tjeldsund border; the rest answer to Harstad and
    #   Tjeldsund kommune. —
    ("satertinden", "Sætertinden", ["Harstad - Hárstták", "Harstad"], 1095, 68.58672, 16.36231),
    ("haukebotinden", "Haukebøtinden", ["Harstad - Hárstták", "Harstad"], 906, 68.59658, 16.39742),
    ("kongsviktinden", "Kongsviktinden", ["Dielddanuorri - Tjeldsund", "Tjeldsund"], 977, 68.58263, 16.26399),
    ("jakobstinden", "Jakobstinden", ["Kvæfjord", "Dielddanuorri - Tjeldsund"], 975, 68.61630, 16.18078),
    ("taraldsviktinden", "Taraldsviktinden", ["Dielddanuorri - Tjeldsund", "Tjeldsund"], 777, 68.54904, 16.16311),
    #
    # — the Lofast round: five more from the Harstad book, around Gullesfjorden
    #   and west of Fiskefjorden — four of the five start on the E10 (Lofast).
    #   Snytinden is the register spelling of Fri Flyt's Snøtinden, the app's
    #   second qualified duplicate name (i Tjeldsund). Tverrfjellet above Melåa
    #   carries no register name on its summit — see SUMMIT_SEED in
    #   resolve_summits.py. Fiskefjordtindan's published 967 sits ~29 m under
    #   the laser scan's top. —
    ("snotinden-tjeldsund", "Snytinden", ["Dielddanuorri - Tjeldsund", "Tjeldsund", "Lødingen"], 980, 68.56794, 16.03015),
    ("fiskefjordtindan", "Fiskefjordtindan", ["Lødingen"], 967, 68.53225, 16.01086),
    ("nonstinden", "Nonstinden", ["Kvæfjord"], 930, 68.54891, 15.68146),
    ("tverrfjellet", "Tverrfjellet", ["Kvæfjord"], 899, 68.70180, 16.13526),
    ("middagsfjellet", "Middagsfjellet", ["Lødingen", "Kvæfjord"], 811, 68.50876, 15.78226),
    #
    # — the Grytøya and Kvæfjord-vest round: ten from the Harstad book — the
    #   island chapter reached by the free Stornes–Bjørnerå ferry, and the
    #   summits ringing Vebbestadvatnet plus Melåaksla above Austerfjorden.
    #   Litjetussen is the register spelling of Fri Flyt's Litletussen; the
    #   923 Middagstinden is the app's third qualified duplicate name; and
    #   Melåaksla's register point sits on a 747 m shoulder while the tour's
    #   915 top is 1.3 km south-east — see SUMMIT_SEED. Middagstinden i
    #   Kvæfjord is the 922-knoll the Lofast round's Tverrfjellet work proved
    #   to be a separate mountain across the 576 m col. —
    ("nona", "Nona", ["Harstad - Hárstták", "Harstad"], 1012, 68.92155, 16.45066),
    ("trolltinden", "Trolltinden", ["Harstad - Hárstták", "Harstad"], 919, 68.91393, 16.48952),
    ("stortussen", "Stortussen", ["Harstad - Hárstták", "Harstad"], 941, 68.97430, 16.36663),
    ("litletussen", "Litjetussen", ["Harstad - Hárstták", "Harstad"], 796, 68.96361, 16.40396),
    ("hattfjellet", "Hattfjellet", ["Harstad - Hárstták", "Harstad"], 856, 68.97455, 16.32605),
    ("slattheia", "Slåttheia", ["Harstad - Hárstták", "Harstad"], 690, 68.95156, 16.34051),
    ("middagstinden-kvafjord", "Middagstinden", ["Kvæfjord"], 923, 68.71173, 16.15584),
    ("horntindan", "Horntindan", ["Kvæfjord"], 910, 68.70284, 16.09521),
    ("hemmestadfjellet", "Hemmestadfjellet", ["Kvæfjord"], 687, 68.71780, 16.10741),
    ("melaaksla", "Melåaksla", ["Kvæfjord"], 915, 68.63268, 16.13913),
    # — Ibestad-runden: Andørja og Rolla. Langlitinden er Nordens høyeste
    #   øytopp; Sula på Rolla er rundens KAST 1-inngang. —
    ("langlitinden", "Langlitinden", ["Ibestad"], 1276, 68.86787, 17.38736),
    ("skartinden", "Skartinden", ["Ibestad"], 1150, 68.87759, 17.33604),
    ("krakrotinden", "Kråkrøtinden", ["Ibestad"], 1187, 68.86263, 17.40069),
    ("ristinden", "Ristinden", ["Ibestad"], 1055, 68.84254, 17.25275),
    ("sula", "Sula", ["Ibestad"], 848, 68.76811, 17.05898),
    # — Tjeldøya-runden: fire på Tjeldøya (Ofoten-regionen, ny i appen) og
    #   Sebortinden ved Lofast, som deler parkering med Møysalen. —
    ("trollfjellet", "Trollfjellet", ["Dielddanuorri - Tjeldsund", "Tjeldsund"], 1010, 68.47701, 16.27419),
    ("jotind", "Jotinden", ["Dielddanuorri - Tjeldsund", "Tjeldsund"], 980, 68.50073, 16.32669),
    ("helligtinden", "Helligtinden", ["Dielddanuorri - Tjeldsund", "Tjeldsund"], 948, 68.46410, 16.33448),
    ("siriskolten", "Siriskolten", ["Dielddanuorri - Tjeldsund", "Tjeldsund"], 658, 68.48050, 16.42229),
    ("sebortinden", "Sebortinden", ["Lødingen"], 834, 68.47520, 15.42635),
]
