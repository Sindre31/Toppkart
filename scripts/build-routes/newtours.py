"""The peaks added after the first 24: display name and region per slug.

The name is what the app shows, which is not always what the place-name register
calls the mountain (`peaks.py` holds the register spelling: Geitgallien for
Geitgaljen, Trollhøtta for Trollhetta, Besshøe for Besshø).

The region is the name the map's region filter groups by. Eight of them are new —
Vesterålen, Trøndelag, Trollheimen, Hallingdal, Voss, Setesdal, Rogaland and
Sirdal — which is why the front page's region count had to stop being a literal.
"""

NEW_TOURS = {
    "hamperokken": ("Hamperokken", "Troms"),
    "istinden": ("Istinden", "Troms"),
    "fastdalstinden": ("Fastdalstinden", "Lyngen"),
    "store-kjostinden": ("Store Kjostinden", "Lyngen"),
    "breitinden": ("Breitinden", "Senja"),
    "keipen": ("Keipen", "Senja"),
    "moysalen": ("Møysalen", "Vesterålen"),
    "geitgaljen": ("Geitgaljen", "Lofoten"),
    "skjomtinden": ("Skjomtinden", "Narvik"),
    "storsteinsfjellet": ("Storsteinsfjellet", "Narvik"),
    "storsylen": ("Storsylen", "Trøndelag"),
    "fongen": ("Fongen", "Trøndelag"),
    "snota": ("Snota", "Trollheimen"),
    "trollhetta": ("Trollhetta", "Trollheimen"),
    "blahoa": ("Blåhøa", "Trollheimen"),
    "storskrymten": ("Storskrymten", "Dovrefjell"),
    "skarasalen": ("Skårasalen", "Sunnmøre"),
    "saudehornet": ("Saudehornet", "Sunnmøre"),
    "jakta": ("Jakta", "Sunnmøre"),
    "hornindalsrokken": ("Hornindalsrokken", "Sunnmøre"),
    "jonshornet": ("Jønshornet", "Sunnmøre"),
    "auskjeret": ("Auskjeret", "Sunnmøre"),
    "ytstevasshornet": ("Ytstevasshornet", "Sunnmøre"),
    "rana": ("Råna", "Sunnmøre"),
    "vassdalstinden": ("Vassdalstinden", "Sunnmøre"),
    "torvloysa": ("Torvløysa", "Sunnmøre"),
    "skarene": ("Skårene", "Sunnmøre"),
    "melshornet": ("Melshornet", "Sunnmøre"),
    "kvitegga": ("Kvitegga", "Sunnmøre"),
    "eidskyrkja": ("Eidskyrkja", "Sunnmøre"),
    "sunndalsnipa": ("Sunndalsnipa", "Sunnmøre"),
    "skarsteinfjellet": ("Skarsteinsfjellet", "Nordfjord"),
    "glitregga": ("Glitregga", "Nordfjord"),
    "lodalskapa": ("Lodalskåpa", "Nordfjord"),
    "snonipa": ("Snønipa", "Sunnfjord"),
    "kvamshesten": ("Kvamshesten", "Sunnfjord"),
    "molden": ("Molden", "Sogn"),
    "togga": ("Togga", "Sogn"),
    "storanosi": ("Storanosi", "Voss"),
    "horndalsnuten": ("Horndalsnuten", "Voss"),
    "gygrastolen": ("Gygrastolen", "Hardanger"),
    "juklavasstinden": ("Juklavasstinden", "Hardanger"),
    "englafjell": ("Englafjell", "Hardanger"),
    "glittertinden": ("Glittertinden", "Jotunheimen"),
    "besshoe": ("Besshø", "Jotunheimen"),
    "rasletinden": ("Rasletinden", "Jotunheimen"),
    "storronden": ("Storronden", "Rondane"),
    "skogshorn": ("Skogshorn", "Hemsedal"),
    "folarskardnuten": ("Folarskardnuten", "Hallingdal"),
    "lonahorgi": ("Lønahorgi", "Voss"),
    "vesoldo": ("Vesoldo", "Hardanger"),
    "saebyggjenuten": ("Sæbyggjenuten", "Setesdal"),
    "kjerag": ("Kjerag", "Rogaland"),
    "grubba": ("Grubbå", "Sirdal"),
    # — the Oslo round: the fjells a bil-tur from Oslo reaches in one to two
    #   hours. Four more new regions, none of them called Oslo, because the ski
    #   terrain is not in the city — it is on Norefjell, Blefjell, Skrim and
    #   Vikerfjell. —
    "hogevarde": ("Høgevarde", "Norefjell"),
    "grafjell": ("Gråfjell", "Norefjell"),
    "ranten": ("Ranten", "Norefjell"),
    "store-ble": ("Store Ble", "Blefjell"),
    "surloytenuten": ("Surløytenuten", "Blefjell"),
    "gyranfisen": ("Gyranfisen", "Vikerfjell"),
    "styggemann": ("Styggemann", "Skrim"),
    # — the Trondheim round: the fjells a car from Trondheim reaches in one to
    #   two hours. Two regions — Trøndelag for the three tops in Melhus and
    #   Trondheim kommune, Trollheimen for the four in Oppdal and Surnadal. Okla
    #   is the name the tour goes under; its high point is registered as
    #   Snydda. —
    "vassfjellet": ("Vassfjellet", "Trøndelag"),
    "krakfjellet": ("Kråkfjellet", "Trøndelag"),
    "rensfjellet": ("Rensfjellet", "Trøndelag"),
    "storhornet": ("Storhornet", "Trollheimen"),
    "storbekkhoa": ("Storbekkhøa", "Trollheimen"),
    "okla": ("Okla", "Trollheimen"),
}
