/** Bilder av toppene, fra Wikimedia Commons. Generert av
 *  `scripts/peak-photos/fetch_photos.py` — ikke rediger for hånd.
 *
 *  Bare turer der Wikidata har et fjell med samme navn innen 1,5 km fra
 *  toppunktet, og bare frie lisenser. Fotograf og lisens skal stå synlig ved
 *  bildet. */

export interface PeakPhoto {
  /** Wikidata-elementet bildet er hentet fra. */
  wikidata: string;
  /** Filnavnet på Commons. */
  file: string;
  /** Miniatyr fra upload.wikimedia.org. */
  src: string;
  width: number;
  height: number;
  /** Bildets side på Commons, der full lisens og opphav står. */
  page: string;
  author: string;
  license: string;
  licenseUrl: string;
}

export const PHOTOS: Readonly<Record<string, PeakPhoto>> = {
  "storgalten": {
    "wikidata": "Q19390703",
    "file": "Storgalten_sett_fra_Lenangsøyra.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Storgalten_sett_fra_Lenangs%C3%B8yra.JPG/1280px-Storgalten_sett_fra_Lenangs%C3%B8yra.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 851,
    "page": "https://commons.wikimedia.org/wiki/File:Storgalten_sett_fra_Lenangs%C3%B8yra.JPG",
    "author": "Eieka",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "store-blamann": {
    "wikidata": "Q851969",
    "file": "Store_Blåmann_southeast_face_over_Kaldfjorden,_2012_March.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0c/Store_Bl%C3%A5mann_southeast_face_over_Kaldfjorden%2C_2012_March.jpg/1280px-Store_Bl%C3%A5mann_southeast_face_over_Kaldfjorden%2C_2012_March.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Store_Bl%C3%A5mann_southeast_face_over_Kaldfjorden,_2012_March.jpg",
    "author": "Ximonic (Simo Räsänen)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "tromsdalstinden": {
    "wikidata": "Q2487508",
    "file": "Tromssa_Tromsdalstinden.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Tromssa_Tromsdalstinden.jpg/1280px-Tromssa_Tromsdalstinden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Tromssa_Tromsdalstinden.jpg",
    "author": "kallerna",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "hamperokken": {
    "wikidata": "Q3358573",
    "file": "Hamperokken_Troms_Norway.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Hamperokken_Troms_Norway.jpg/1280px-Hamperokken_Troms_Norway.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Hamperokken_Troms_Norway.jpg",
    "author": "ArneEide",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "fagerfjellet": {
    "wikidata": "Q31695361",
    "file": "Fagerfjellet_from_southern_trail_to_the_top_of_Tromsdalstinden_2022-09-07_01.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Fagerfjellet_from_southern_trail_to_the_top_of_Tromsdalstinden_2022-09-07_01.jpg/1280px-Fagerfjellet_from_southern_trail_to_the_top_of_Tromsdalstinden_2022-09-07_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 857,
    "page": "https://commons.wikimedia.org/wiki/File:Fagerfjellet_from_southern_trail_to_the_top_of_Tromsdalstinden_2022-09-07_01.jpg",
    "author": "Leonhard Lenz",
    "license": "CC0",
    "licenseUrl": "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  "breitinden": {
    "wikidata": "Q4960418",
    "file": "Breidtinden_by_Mefjordbotn_in_Senja,_Troms_og_Finnmark,_Norway,_2022_August.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Breidtinden_by_Mefjordbotn_in_Senja%2C_Troms_og_Finnmark%2C_Norway%2C_2022_August.jpg/1280px-Breidtinden_by_Mefjordbotn_in_Senja%2C_Troms_og_Finnmark%2C_Norway%2C_2022_August.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Breidtinden_by_Mefjordbotn_in_Senja,_Troms_og_Finnmark,_Norway,_2022_August.jpg",
    "author": "Ximonic (Simo Räsänen)",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "nona": {
    "wikidata": "Q11253018",
    "file": "Grytøya,_south_coast_mountains,_October.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Gryt%C3%B8ya%2C_south_coast_mountains%2C_October.JPG/1280px-Gryt%C3%B8ya%2C_south_coast_mountains%2C_October.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 344,
    "page": "https://commons.wikimedia.org/wiki/File:Gryt%C3%B8ya,_south_coast_mountains,_October.JPG",
    "author": "Ximonic, Simo Räsänen & Tauno Räsänen",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "spanstinden": {
    "wikidata": "Q11252991",
    "file": "Spanstind-1.JPG",
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Spanstind-1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 1715,
    "page": "https://commons.wikimedia.org/wiki/File:Spanstind-1.JPG",
    "author": "Zig",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "reinspalen": {
    "wikidata": "Q19386417",
    "file": "Reinspelen.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/0/03/Reinspelen.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 952,
    "page": "https://commons.wikimedia.org/wiki/File:Reinspelen.jpg",
    "author": "Asbjørn",
    "license": "Public domain",
    "licenseUrl": ""
  },
  "satertinden": {
    "wikidata": "Q11237837",
    "file": "Saetertinden.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Saetertinden.jpg/1280px-Saetertinden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Saetertinden.jpg",
    "author": "Jakro64",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "snotindan": {
    "wikidata": "Q29577977",
    "file": "Mountains_of_Vesterdalen_in_Kvæfjord,_Hinnøya,_Norway,_2015_April_-_2.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Mountains_of_Vesterdalen_in_Kv%C3%A6fjord%2C_Hinn%C3%B8ya%2C_Norway%2C_2015_April_-_2.jpg/1280px-Mountains_of_Vesterdalen_in_Kv%C3%A6fjord%2C_Hinn%C3%B8ya%2C_Norway%2C_2015_April_-_2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Mountains_of_Vesterdalen_in_Kv%C3%A6fjord,_Hinn%C3%B8ya,_Norway,_2015_April_-_2.jpg",
    "author": "Ximonic (Simo Räsänen)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "moysalen": {
    "wikidata": "Q1834081",
    "file": "Moysalen.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/08/Moysalen.JPG/1280px-Moysalen.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 730,
    "page": "https://commons.wikimedia.org/wiki/File:Moysalen.JPG",
    "author": "Harald Haugland",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "sebortinden": {
    "wikidata": "Q31668563",
    "file": "Sebortinden_depuis_Øksfjorden.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Sebortinden_depuis_%C3%98ksfjorden.jpg/1280px-Sebortinden_depuis_%C3%98ksfjorden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Sebortinden_depuis_%C3%98ksfjorden.jpg",
    "author": "Patrice78500",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "rombakstotta": {
    "wikidata": "Q11891173",
    "file": "Rombakstøtta.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Rombakst%C3%B8tta.JPG/1280px-Rombakst%C3%B8tta.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 713,
    "page": "https://commons.wikimedia.org/wiki/File:Rombakst%C3%B8tta.JPG",
    "author": "Ximonic, Simo Räsänen",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "geitgaljen": {
    "wikidata": "Q11860342",
    "file": "Geitgallien_as_seen_from_Sildpollneset,_Austvågøya,_Lofoten,_Norway,_2015_April_-_3.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Geitgallien_as_seen_from_Sildpollneset%2C_Austv%C3%A5g%C3%B8ya%2C_Lofoten%2C_Norway%2C_2015_April_-_3.jpg/1280px-Geitgallien_as_seen_from_Sildpollneset%2C_Austv%C3%A5g%C3%B8ya%2C_Lofoten%2C_Norway%2C_2015_April_-_3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 1920,
    "page": "https://commons.wikimedia.org/wiki/File:Geitgallien_as_seen_from_Sildpollneset,_Austv%C3%A5g%C3%B8ya,_Lofoten,_Norway,_2015_April_-_3.jpg",
    "author": "Ximonic (Simo Räsänen)",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "skjomtinden": {
    "wikidata": "Q11245113",
    "file": "Skjomtinden_-_May.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/88/Skjomtinden_-_May.JPG/1280px-Skjomtinden_-_May.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 722,
    "page": "https://commons.wikimedia.org/wiki/File:Skjomtinden_-_May.JPG",
    "author": "Ximonic, Simo Räsänen",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "himmeltindan": {
    "wikidata": "Q11862658",
    "file": "Himmeltindan_in_Vestvågøy,_Nordland,_Norway,_2022_June.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Himmeltindan_in_Vestv%C3%A5g%C3%B8y%2C_Nordland%2C_Norway%2C_2022_June.jpg/1280px-Himmeltindan_in_Vestv%C3%A5g%C3%B8y%2C_Nordland%2C_Norway%2C_2022_June.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Himmeltindan_in_Vestv%C3%A5g%C3%B8y,_Nordland,_Norway,_2022_June.jpg",
    "author": "Ximonic (Simo Räsänen)",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "sandhornet": {
    "wikidata": "Q19387612",
    "file": "SandhornetFromBodo.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/SandhornetFromBodo.JPG/1280px-SandhornetFromBodo.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:SandhornetFromBodo.JPG",
    "author": "Kefi",
    "license": "Public domain",
    "licenseUrl": ""
  },
  "lukttinden": {
    "wikidata": "Q6513579",
    "file": "Lukttinden.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Lukttinden.JPG/1280px-Lukttinden.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Lukttinden.JPG",
    "author": "",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "vassfjellet": {
    "wikidata": "Q4576120",
    "file": "VassfjelletFromStorheia.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/VassfjelletFromStorheia.jpg/1280px-VassfjelletFromStorheia.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 583,
    "page": "https://commons.wikimedia.org/wiki/File:VassfjelletFromStorheia.jpg",
    "author": "Håvard Berland",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "snota": {
    "wikidata": "Q4588106",
    "file": "SnotaFromVassnebba.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/9/91/SnotaFromVassnebba.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 847,
    "page": "https://commons.wikimedia.org/wiki/File:SnotaFromVassnebba.jpg",
    "author": "Håvard Berland",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "kirketaket": {
    "wikidata": "Q4579605",
    "file": "KyrkjetaketFromHestberget.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/b2/KyrkjetaketFromHestberget.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 918,
    "page": "https://commons.wikimedia.org/wiki/File:KyrkjetaketFromHestberget.jpg",
    "author": "No machine-readable author provided. Berland assumed (based on copyright claims).",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "snohetta": {
    "wikidata": "Q979569",
    "file": "Snohetta.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Snohetta.jpg/1280px-Snohetta.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Snohetta.jpg",
    "author": "Kjetil Kjernsmo",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "jonshornet": {
    "wikidata": "Q12717873",
    "file": "Mountain_peak_in_norway.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Mountain_peak_in_norway.jpg/1280px-Mountain_peak_in_norway.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Mountain_peak_in_norway.jpg",
    "author": "per from Norway",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0"
  },
  "rana": {
    "wikidata": "Q6516521",
    "file": "Råna3.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/R%C3%A5na3.jpg/1280px-R%C3%A5na3.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 1267,
    "page": "https://commons.wikimedia.org/wiki/File:R%C3%A5na3.jpg",
    "author": "Pmt",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "kolastinden": {
    "wikidata": "Q3357059",
    "file": "Kolåstinden_fra_follestadalen.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/84/Kol%C3%A5stinden_fra_follestadalen.jpg/1280px-Kol%C3%A5stinden_fra_follestadalen.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 931,
    "page": "https://commons.wikimedia.org/wiki/File:Kol%C3%A5stinden_fra_follestadalen.jpg",
    "author": "Jan Idar",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "vassdalstinden": {
    "wikidata": "Q3441040",
    "file": "Vassdalstinden.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Vassdalstinden.jpg/1280px-Vassdalstinden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 953,
    "page": "https://commons.wikimedia.org/wiki/File:Vassdalstinden.jpg",
    "author": "Andreas Vartdal",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "saudehornet": {
    "wikidata": "Q3430927",
    "file": "SaudehornetFromHelgehornet.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/SaudehornetFromHelgehornet.jpg/1280px-SaudehornetFromHelgehornet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 547,
    "page": "https://commons.wikimedia.org/wiki/File:SaudehornetFromHelgehornet.jpg",
    "author": "",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "slogen": {
    "wikidata": "Q3357108",
    "file": "Slogen_from_Lekneset_over_Norangsfjorden,_Ørsta,_Møre_og_Romsdal,_Norway,_2025_June.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Slogen_from_Lekneset_over_Norangsfjorden%2C_%C3%98rsta%2C_M%C3%B8re_og_Romsdal%2C_Norway%2C_2025_June.jpg/1280px-Slogen_from_Lekneset_over_Norangsfjorden%2C_%C3%98rsta%2C_M%C3%B8re_og_Romsdal%2C_Norway%2C_2025_June.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Slogen_from_Lekneset_over_Norangsfjorden,_%C3%98rsta,_M%C3%B8re_og_Romsdal,_Norway,_2025_June.jpg",
    "author": "Ximonic (Simo Räsänen)",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "jakta": {
    "wikidata": "Q3368511",
    "file": "JaktaFromSlogen.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/e/e5/JaktaFromSlogen.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 1297,
    "page": "https://commons.wikimedia.org/wiki/File:JaktaFromSlogen.jpg",
    "author": "No machine-readable author provided. Berland assumed (based on copyright claims).",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "skarasalen": {
    "wikidata": "Q3357104",
    "file": "Skårasalen.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Sk%C3%A5rasalen.jpg/1280px-Sk%C3%A5rasalen.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Sk%C3%A5rasalen.jpg",
    "author": "Andrva",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "kvitegga": {
    "wikidata": "Q1808799",
    "file": "Kvitegga_from_Nibbedalen,_Stranda,_Møre_og_Romsdal,_Norway,_2025_June.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Kvitegga_from_Nibbedalen%2C_Stranda%2C_M%C3%B8re_og_Romsdal%2C_Norway%2C_2025_June.jpg/1280px-Kvitegga_from_Nibbedalen%2C_Stranda%2C_M%C3%B8re_og_Romsdal%2C_Norway%2C_2025_June.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Kvitegga_from_Nibbedalen,_Stranda,_M%C3%B8re_og_Romsdal,_Norway,_2025_June.jpg",
    "author": "Ximonic (Simo Räsänen)",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "hornindalsrokken": {
    "wikidata": "Q3357649",
    "file": "Hornindalsrokken_2008_August.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Hornindalsrokken_2008_August.jpg/1280px-Hornindalsrokken_2008_August.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 976,
    "page": "https://commons.wikimedia.org/wiki/File:Hornindalsrokken_2008_August.jpg",
    "author": "Ximonic, Simo Räsänen",
    "license": "CC BY 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.5"
  },
  "rondslottet": {
    "wikidata": "Q4131042",
    "file": "RondslottetFromVeslesmeden.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/13/RondslottetFromVeslesmeden.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 1020,
    "page": "https://commons.wikimedia.org/wiki/File:RondslottetFromVeslesmeden.jpg",
    "author": "No machine-readable author provided. Berland assumed (based on copyright claims).",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "storronden": {
    "wikidata": "Q2173169",
    "file": "StorrondenFromRondslottet.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/StorrondenFromRondslottet.jpg/1280px-StorrondenFromRondslottet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 350,
    "page": "https://commons.wikimedia.org/wiki/File:StorrondenFromRondslottet.jpg",
    "author": "No machine-readable author provided. Berland assumed (based on copyright claims).",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "lodalskapa": {
    "wikidata": "Q1026479",
    "file": "Lodalskopa1.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Lodalskopa1.JPG/1280px-Lodalskopa1.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 835,
    "page": "https://commons.wikimedia.org/wiki/File:Lodalskopa1.JPG",
    "author": "The original uploader was Slimguy at German Wikipedia.\n(Original text: Slimguy)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "glittertinden": {
    "wikidata": "Q397876",
    "file": "Glittertind.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/c/ce/Glittertind.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Glittertind.jpg",
    "author": "Sigmund",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "galdhopiggen": {
    "wikidata": "Q203942",
    "file": "Galdhopiggen_2004.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/4/41/Galdhopiggen_2004.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 941,
    "page": "https://commons.wikimedia.org/wiki/File:Galdhopiggen_2004.jpg",
    "author": "Jojo",
    "license": "Public domain",
    "licenseUrl": ""
  },
  "besshoe": {
    "wikidata": "Q4573297",
    "file": "BesshøFromVeslfjellet.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Bessh%C3%B8FromVeslfjellet.jpg/1280px-Bessh%C3%B8FromVeslfjellet.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 372,
    "page": "https://commons.wikimedia.org/wiki/File:Bessh%C3%B8FromVeslfjellet.jpg",
    "author": "No machine-readable author provided. Berland assumed (based on copyright claims).",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "kvamshesten": {
    "wikidata": "Q11235346",
    "file": "Storehesten.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9d/Storehesten.jpg/1280px-Storehesten.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 851,
    "page": "https://commons.wikimedia.org/wiki/File:Storehesten.jpg",
    "author": "Takktakk",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "rasletinden": {
    "wikidata": "Q4590439",
    "file": "Rasletind-2.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/b/b0/Rasletind-2.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Rasletind-2.jpg",
    "author": "Jancr0207 at English Wikipedia",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "banseterkampen": {
    "wikidata": "Q59651968",
    "file": "Gausdal_Ringebu_IMG_6634_baansaeterkampen_1214m_1202m.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Gausdal_Ringebu_IMG_6634_baansaeterkampen_1214m_1202m.jpg/1280px-Gausdal_Ringebu_IMG_6634_baansaeterkampen_1214m_1202m.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Gausdal_Ringebu_IMG_6634_baansaeterkampen_1214m_1202m.jpg",
    "author": "Bjoertvedt",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "bitihorn": {
    "wikidata": "Q878811",
    "file": "Valdres_-_Bitihorn.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Valdres_-_Bitihorn.JPG/1280px-Valdres_-_Bitihorn.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 958,
    "page": "https://commons.wikimedia.org/wiki/File:Valdres_-_Bitihorn.JPG",
    "author": "The original uploader was Johannes1024 at German Wikipedia.\n\n(Original text: de:Benutzer:Johannes1024)",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "http://creativecommons.org/licenses/by-sa/3.0/"
  },
  "nevelfjell": {
    "wikidata": "Q4582749",
    "file": "Nevelstuen_2.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Nevelstuen_2.JPG/1280px-Nevelstuen_2.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Nevelstuen_2.JPG",
    "author": "Skvattram",
    "license": "Public domain",
    "licenseUrl": ""
  },
  "skogshorn": {
    "wikidata": "Q1770118",
    "file": "Skogshorn_sett_fra_sør-vest.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Skogshorn_sett_fra_s%C3%B8r-vest.jpg/1280px-Skogshorn_sett_fra_s%C3%B8r-vest.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 853,
    "page": "https://commons.wikimedia.org/wiki/File:Skogshorn_sett_fra_s%C3%B8r-vest.jpg",
    "author": "Botnen",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0"
  },
  "storehorn": {
    "wikidata": "Q4494773",
    "file": "StorhornVeslehornHemsedalSummer.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e7/StorhornVeslehornHemsedalSummer.jpg/1280px-StorhornVeslehornHemsedalSummer.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:StorhornVeslehornHemsedalSummer.jpg",
    "author": "Nathanael Fogh Nordentoft (Nathanaelfoghnordentoft)",
    "license": "Public domain",
    "licenseUrl": ""
  },
  "folarskardnuten": {
    "wikidata": "Q1435305",
    "file": "Folarskarskarven_fra_Raksteindalen.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Folarskarskarven_fra_Raksteindalen.jpg/1280px-Folarskarskarven_fra_Raksteindalen.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 599,
    "page": "https://commons.wikimedia.org/wiki/File:Folarskarskarven_fra_Raksteindalen.jpg",
    "author": "John Bernhard Rekstad",
    "license": "Public domain",
    "licenseUrl": ""
  },
  "hogevarde": {
    "wikidata": "Q6516393",
    "file": "HogevardePlate.jpg",
    "src": "https://upload.wikimedia.org/wikipedia/commons/1/14/HogevardePlate.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail_unscaled",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:HogevardePlate.jpg",
    "author": "No machine-readable author provided. Berland assumed (based on copyright claims).",
    "license": "CC BY-SA 2.5",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.5"
  },
  "melderskin": {
    "wikidata": "Q11236492",
    "file": "Melderskin_frå_Stussvikhovda.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Melderskin_fr%C3%A5_Stussvikhovda.JPG/1280px-Melderskin_fr%C3%A5_Stussvikhovda.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Melderskin_fr%C3%A5_Stussvikhovda.JPG",
    "author": "Christoffer H. Støle",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  },
  "gaustatoppen": {
    "wikidata": "Q1496308",
    "file": "P1000821Gaustatoppen.JPG",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/57/P1000821Gaustatoppen.JPG/1280px-P1000821Gaustatoppen.JPG?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 1707,
    "page": "https://commons.wikimedia.org/wiki/File:P1000821Gaustatoppen.JPG",
    "author": "G.Lanting",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0"
  },
  "store-ble": {
    "wikidata": "Q4926392",
    "file": "Bletoppen.jpg",
    "src": "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Bletoppen.jpg/1280px-Bletoppen.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail",
    "width": 1280,
    "height": 960,
    "page": "https://commons.wikimedia.org/wiki/File:Bletoppen.jpg",
    "author": "Toreroraas",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0"
  }
};
