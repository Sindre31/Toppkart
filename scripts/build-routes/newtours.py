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
}
