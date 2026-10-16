/** Hvor mye toppene leses om på Wikipedia, 2025-10–2026-09. Generert av
 *  `scripts/wiki-popularity/fetch_popularity.py` — ikke rediger for hånd.
 *
 *  Visninger av turens artikkel på norsk Wikipedia (bokmål og nynorsk), bare
 *  mennesker. Turer uten artikkel står ikke her og sorteres sist. */

export interface Popularity {
  views: number;
  /** Artiklene tallet er summen av, som «wiki:Tittel». */
  articles: readonly string[];
}

export const POPULARITY_PERIOD: { from: string; to: string } | null = { from: "2025-10", to: "2026-09" };

export const POPULARITY: Readonly<Record<string, Popularity>> = {
  "storgalten": {
    "views": 135,
    "articles": [
      "no:Storgalten"
    ]
  },
  "store-blamann": {
    "views": 889,
    "articles": [
      "no:Store Blåmann",
      "nn:Store Blåmann"
    ]
  },
  "rodtinden": {
    "views": 144,
    "articles": [
      "no:Rødtinden"
    ]
  },
  "tromsdalstinden": {
    "views": 1702,
    "articles": [
      "no:Tromsdalstinden",
      "nn:Tromsdalstinden"
    ]
  },
  "hamperokken": {
    "views": 1155,
    "articles": [
      "no:Hamperokken",
      "nn:Hamperokken"
    ]
  },
  "breitinden": {
    "views": 474,
    "articles": [
      "no:Breidtinden (Senja)"
    ]
  },
  "istinden": {
    "views": 13,
    "articles": [
      "no:Vestre Istinden"
    ]
  },
  "nona": {
    "views": 308,
    "articles": [
      "no:Nona",
      "nn:Nona"
    ]
  },
  "langlitinden": {
    "views": 414,
    "articles": [
      "no:Langlitinden",
      "nn:Langlitinden"
    ]
  },
  "hinnstein": {
    "views": 183,
    "articles": [
      "no:Hinnstein",
      "nn:Hinnstein"
    ]
  },
  "horntindan": {
    "views": 75,
    "articles": [
      "no:Horntindan"
    ]
  },
  "spanstinden": {
    "views": 609,
    "articles": [
      "no:Spanstinden",
      "nn:Spanstinden"
    ]
  },
  "jakobstinden": {
    "views": 49,
    "articles": [
      "no:Jakobstinden"
    ]
  },
  "reinspalen": {
    "views": 141,
    "articles": [
      "no:Reinspælen"
    ]
  },
  "satertinden": {
    "views": 465,
    "articles": [
      "no:Sætertinden",
      "nn:Sætertinden"
    ]
  },
  "snotindan": {
    "views": 38,
    "articles": [
      "no:Snøtindan"
    ]
  },
  "moysalen": {
    "views": 2342,
    "articles": [
      "no:Møysalen",
      "nn:Møysalen"
    ]
  },
  "strandtinden": {
    "views": 53,
    "articles": [
      "no:Strandstinden"
    ]
  },
  "trollfjellet": {
    "views": 23,
    "articles": [
      "nn:Trollfjellet"
    ]
  },
  "skjomtinden": {
    "views": 769,
    "articles": [
      "no:Sovande dronning",
      "nn:Sovande dronning"
    ]
  },
  "himmeltindan": {
    "views": 959,
    "articles": [
      "no:Himmeltindan"
    ]
  },
  "sandhornet": {
    "views": 467,
    "articles": [
      "no:Sandhornet"
    ]
  },
  "tomskjevelen": {
    "views": 243,
    "articles": [
      "no:Tomskjevelen",
      "nn:Tomskjevelen"
    ]
  },
  "lukttinden": {
    "views": 230,
    "articles": [
      "no:Lukttinden",
      "nn:Lukttinden"
    ]
  },
  "vassfjellet": {
    "views": 1227,
    "articles": [
      "no:Vassfjellet",
      "nn:Vassfjellet"
    ]
  },
  "krakfjellet": {
    "views": 24,
    "articles": [
      "nn:Kråkfjellet"
    ]
  },
  "rensfjellet": {
    "views": 327,
    "articles": [
      "no:Rensfjellet"
    ]
  },
  "snota": {
    "views": 850,
    "articles": [
      "no:Snota",
      "nn:Snota"
    ]
  },
  "kirketaket": {
    "views": 337,
    "articles": [
      "no:Kyrkjetaket",
      "nn:Kyrkjetaket"
    ]
  },
  "middagstinden": {
    "views": 25,
    "articles": [
      "nn:Middagstinden"
    ]
  },
  "snohetta": {
    "views": 8130,
    "articles": [
      "no:Snøhetta",
      "nn:Snøhetta"
    ]
  },
  "jonshornet": {
    "views": 939,
    "articles": [
      "no:Ramoen",
      "nn:Ramoen"
    ]
  },
  "rana": {
    "views": 610,
    "articles": [
      "no:Råna",
      "nn:Råna"
    ]
  },
  "kolastinden": {
    "views": 9755,
    "articles": [
      "no:Kolåstinden",
      "nn:Kolåstinden"
    ]
  },
  "vassdalstinden": {
    "views": 279,
    "articles": [
      "no:Vassdalstinden",
      "nn:Vassdalstinden"
    ]
  },
  "saudehornet": {
    "views": 409,
    "articles": [
      "no:Saudehornet",
      "nn:Saudehornet"
    ]
  },
  "slogen": {
    "views": 2388,
    "articles": [
      "no:Slogen",
      "nn:Slogen"
    ]
  },
  "torvloysa": {
    "views": 249,
    "articles": [
      "no:Torvløysa",
      "nn:Torvløysa"
    ]
  },
  "jakta": {
    "views": 380,
    "articles": [
      "no:Jakta",
      "nn:Jakta"
    ]
  },
  "skarasalen": {
    "views": 809,
    "articles": [
      "no:Skårasalen",
      "nn:Skårasalen"
    ]
  },
  "kvitegga": {
    "views": 945,
    "articles": [
      "no:Kvitegga",
      "nn:Kvitegga"
    ]
  },
  "hornindalsrokken": {
    "views": 1118,
    "articles": [
      "no:Hornindalsrokken",
      "nn:Hornindalsrokken"
    ]
  },
  "sunndalsnipa": {
    "views": 138,
    "articles": [
      "no:Sunndalsnipa"
    ]
  },
  "eidskyrkja": {
    "views": 208,
    "articles": [
      "no:Eidskyrkja",
      "nn:Eidskyrkja"
    ]
  },
  "rondslottet": {
    "views": 2559,
    "articles": [
      "no:Rondslottet",
      "nn:Rondslottet"
    ]
  },
  "glitregga": {
    "views": 219,
    "articles": [
      "no:Glitregga",
      "nn:Glitregga"
    ]
  },
  "storronden": {
    "views": 668,
    "articles": [
      "no:Storronden",
      "nn:Storronden"
    ]
  },
  "skala": {
    "views": 105,
    "articles": [
      "nn:Skåla"
    ]
  },
  "lodalskapa": {
    "views": 1120,
    "articles": [
      "no:Lodalskåpa",
      "nn:Lodalskåpa"
    ]
  },
  "snonipa": {
    "views": 578,
    "articles": [
      "no:Snønipa",
      "nn:Snønipa"
    ]
  },
  "glittertinden": {
    "views": 6427,
    "articles": [
      "no:Glittertinden",
      "nn:Glittertinden"
    ]
  },
  "galdhopiggen": {
    "views": 29097,
    "articles": [
      "no:Galdhøpiggen",
      "nn:Galdhøpiggen"
    ]
  },
  "steindalsnosi": {
    "views": 20,
    "articles": [
      "nn:Steindalsnosi"
    ]
  },
  "fanaraken": {
    "views": 3328,
    "articles": [
      "no:Fannaråki",
      "nn:Fannaråki"
    ]
  },
  "kvamshesten": {
    "views": 557,
    "articles": [
      "no:Kvamshesten",
      "nn:Kvamshesten"
    ]
  },
  "rasletinden": {
    "views": 1168,
    "articles": [
      "no:Rasletinden",
      "nn:Rasletinden"
    ]
  },
  "molden": {
    "views": 68,
    "articles": [
      "nn:Molden"
    ]
  },
  "bitihorn": {
    "views": 3651,
    "articles": [
      "no:Bitihorn",
      "nn:Bitihorn"
    ]
  },
  "nevelfjell": {
    "views": 1199,
    "articles": [
      "no:Nevelfjell",
      "nn:Nevelfjell"
    ]
  },
  "kyrkjebonosi": {
    "views": 75,
    "articles": [
      "no:Kyrkjebønøse",
      "nn:Kyrkjebønøse"
    ]
  },
  "nibbi": {
    "views": 164,
    "articles": [
      "no:Nibbi",
      "nn:Nibbi"
    ]
  },
  "skogshorn": {
    "views": 3668,
    "articles": [
      "no:Skogshorn",
      "nn:Skogshorn"
    ]
  },
  "lonahorgi": {
    "views": 705,
    "articles": [
      "no:Lønahorgi"
    ]
  },
  "folarskardnuten": {
    "views": 1356,
    "articles": [
      "no:Folarskardnuten"
    ]
  },
  "prestholtskarvet": {
    "views": 360,
    "articles": [
      "no:Prestholtskarvet",
      "nn:Prestholtskarvet"
    ]
  },
  "gyranfisen": {
    "views": 621,
    "articles": [
      "no:Gyranfisen",
      "nn:Gyranfisen"
    ]
  },
  "ustetind": {
    "views": 210,
    "articles": [
      "no:Ustetind"
    ]
  },
  "tveitakvitingen": {
    "views": 856,
    "articles": [
      "no:Tveitakvitingen",
      "nn:Tveitakvitingen"
    ]
  },
  "hogevarde": {
    "views": 30,
    "articles": [
      "nn:Høgevard"
    ]
  },
  "gygrastolen": {
    "views": 263,
    "articles": [
      "no:Gygrastolen"
    ]
  },
  "melderskin": {
    "views": 1573,
    "articles": [
      "no:Melderskin",
      "nn:Melderskin"
    ]
  },
  "gaustatoppen": {
    "views": 19295,
    "articles": [
      "no:Gaustatoppen",
      "nn:Gaustatoppen"
    ]
  },
  "styggemann": {
    "views": 1396,
    "articles": [
      "no:Styggmann",
      "nn:Styggmann"
    ]
  },
  "saebyggjenuten": {
    "views": 629,
    "articles": [
      "no:Sæbyggjenuten",
      "nn:Sæbyggjenuten"
    ]
  },
  "kjerag": {
    "views": 4851,
    "articles": [
      "no:Kjerag",
      "nn:Kjerag"
    ]
  }
};
