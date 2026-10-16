"""Bilder av toppene, fra Wikimedia Commons — kilden til `lib/photos.ts`.

Skriptet henter alle fjell med bilde (P18) i Wikidata innenfor Norges
utstrekning, i bånd på én breddegrad, og velger for hver tur i `lib/tours.ts` det
nærmeste innen `RADIUS_KM` fra toppunktet med samme navn som turen. Bare navnesamsvar teller: «nærmeste ting med et bilde» kan
like gjerne være en hytte, en innsjø eller nabotoppen, og et bilde av feil fjell
er verre enn ingen bilde.

Så hentes lisens og opphav fra Commons. Bare frie lisenser tas med (CC0,
offentlig eie, CC BY, CC BY-SA); kreditering står under bildet på sida.

    python3 scripts/peak-photos/fetch_photos.py > lib/photos.ts

Bildene lenkes fra upload.wikimedia.org, ikke kopiert inn i repoet. Kjøres på
nytt når det kommer nye turer.
"""

import html
import json
import math
import os
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request

UA = "ToppkartBot/1.0 (https://github.com/Sindre31/Toppkart)"
RADIUS_KM = 1.5
THUMB_WIDTH = 1280
FREE = re.compile(r"^(CC0|Public domain|PD|CC BY(-SA)? \d(\.\d)?( \w+)?)", re.I)


def get(url: str, params: dict) -> dict:
    full = f"{url}?{urllib.parse.urlencode(params)}"
    for attempt in range(8):
        req = urllib.request.Request(full, headers={"User-Agent": UA, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=120) as res:
                # `strict=False`: Wikidata-etiketter kan inneholde rå kontrolltegn.
                return json.loads(res.read().decode("utf-8"), strict=False)
        except urllib.error.HTTPError as err:
            if err.code in (429, 503) and attempt < 7:
                wait = int(err.headers.get("Retry-After") or 0) or 10 * (attempt + 1)
                print(f"  {err.code}, waiting {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            raise
    raise RuntimeError("unreachable")


def tours() -> list[dict]:
    src = open("lib/tours.ts", encoding="utf-8").read()
    out = []
    for m in re.finditer(r'\{ slug: "([^"]+)", name: "([^"]+)", region: "[^"]*", lat: ([\d.]+), lng: ([\d.]+)', src):
        out.append({"slug": m[1], "name": m[2], "lat": float(m[3]), "lng": float(m[4])})
    return out


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s.lower())
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.replace("ø", "o").replace("æ", "ae").replace("å", "a")
    return re.sub(r"[^a-z0-9]", "", s)


# Fastlandet med margin, som i `scripts/map-coverage`.
SOUTH, WEST, NORTH, EAST = 57.5, 4.0, 71.5, 31.5
# Fjell, topp, ås/høyde, fjellkjede, rygg, nunatak, tind.
KINDS = "wd:Q8502 wd:Q207326 wd:Q54050 wd:Q46831 wd:Q740445 wd:Q193457 wd:Q1595289"
BAND = 1.0  # grader breddegrad per spørring


def peaks_in(south: float, north: float) -> list[dict]:
    """Fjell med bilde i ett breddegradsbånd over hele utstrekningen."""
    query = f"""
    SELECT ?item ?img ?label ?coord WHERE {{
      VALUES ?kind {{ {KINDS} }}
      SERVICE wikibase:box {{
        ?item wdt:P625 ?coord .
        bd:serviceParam wikibase:cornerSouthWest "Point({WEST} {south})"^^geo:wktLiteral ;
                        wikibase:cornerNorthEast "Point({EAST} {north})"^^geo:wktLiteral .
      }}
      ?item wdt:P31 ?kind ; wdt:P18 ?img ; rdfs:label ?label .
      FILTER(LANG(?label) IN ("nb", "nn", "no", "en", "se", "mul"))
    }}"""
    res = get("https://query.wikidata.org/sparql", {"query": query, "format": "json"})
    out = []
    for b in res["results"]["bindings"]:
        lng, lat = map(float, re.findall(r"-?[\d.]+", b["coord"]["value"])[:2])
        out.append(
            {
                "item": b["item"]["value"].rsplit("/", 1)[1],
                "file": urllib.parse.unquote(b["img"]["value"].rsplit("/", 1)[1]),
                "label": b["label"]["value"],
                "lat": lat,
                "lng": lng,
            }
        )
    return out


def all_peaks(cache: str | None) -> list[dict]:
    """Alle fjell med bilde innenfor utstrekningen, i bånd på `BAND` grader.

    Hele landet i én spørring ble kuttet av Wikidatas 60-sekundersgrense, og en
    per tur var 185 spørringer — begge deler endte i struping. Hvert bånd lagres
    i `cache` så snart det er inne, så en 429 halvveis ikke koster de ferdige."""
    done: dict[str, list[dict]] = {}
    if cache and os.path.exists(cache):
        done = json.load(open(cache, encoding="utf-8"))
    lat = SOUTH
    while lat < NORTH:
        key = f"{lat:.1f}"
        if key not in done:
            done[key] = peaks_in(lat, min(lat + BAND, NORTH))
            print(f"  band {key}: {len(done[key])} rows", file=sys.stderr)
            if cache:
                json.dump(done, open(cache, "w", encoding="utf-8"), ensure_ascii=False)
            time.sleep(5)
        lat += BAND
    return [p for rows in done.values() for p in rows]


def km(a_lat: float, a_lng: float, b_lat: float, b_lng: float) -> float:
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp, dl = p2 - p1, math.radians(b_lng - a_lng)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))


def pick(t: dict, peaks: list[dict]) -> dict | None:
    """Nærmeste fjell innen `RADIUS_KM` med samme navn som turen."""
    want = norm(t["name"])
    near = [(km(t["lat"], t["lng"], p["lat"], p["lng"]), p) for p in peaks if norm(p["label"]) == want]
    near = [(d, p) for d, p in near if d <= RADIUS_KM]
    return min(near, key=lambda dp: dp[0])[1] if near else None


def strip_tags(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def commons_info(files: list[str]) -> dict[str, dict]:
    info: dict[str, dict] = {}
    for i in range(0, len(files), 50):
        batch = files[i : i + 50]
        res = get(
            "https://commons.wikimedia.org/w/api.php",
            {
                "action": "query",
                "format": "json",
                "prop": "imageinfo",
                "iiprop": "url|extmetadata|size",
                "iiurlwidth": THUMB_WIDTH,
                "titles": "|".join(f"File:{f}" for f in batch),
            },
        )
        norm_map = {n["to"]: n["from"] for n in res["query"].get("normalized", [])}
        for page in res["query"]["pages"].values():
            if "imageinfo" not in page:
                continue
            ii = page["imageinfo"][0]
            meta = ii.get("extmetadata", {})
            title = norm_map.get(page["title"], page["title"])
            info[title.removeprefix("File:")] = {
                "src": ii.get("thumburl") or ii["url"],
                "width": ii.get("thumbwidth") or ii["width"],
                "height": ii.get("thumbheight") or ii["height"],
                "page": ii["descriptionurl"],
                "author": strip_tags(meta.get("Artist", {}).get("value", "")),
                "license": strip_tags(meta.get("LicenseShortName", {}).get("value", "")),
                "licenseUrl": strip_tags(meta.get("LicenseUrl", {}).get("value", "")),
            }
        time.sleep(3)
    return info


def main() -> None:
    # Wikidata-treffene kan mellomlagres mellom kjøringer: PHOTO_CACHE=sti.json
    cache_path = os.environ.get("PHOTO_CACHE")
    all_tours = tours()
    if cache_path and os.path.exists(cache_path):
        chosen = json.load(open(cache_path, encoding="utf-8"))
    else:
        peaks = all_peaks(cache_path + ".bands" if cache_path else None)
        print(f"{len(peaks)} peaks with an image in Wikidata", file=sys.stderr)
        chosen = {}
        for t in all_tours:
            c = pick(t, peaks)
            if c:
                chosen[t["slug"]] = c
        if cache_path:
            json.dump(chosen, open(cache_path, "w", encoding="utf-8"), ensure_ascii=False)
    print(f"{len(chosen)} tours matched a Wikidata peak with an image", file=sys.stderr)
    info = commons_info(sorted({c["file"] for c in chosen.values()}))

    photos = {}
    for slug, c in chosen.items():
        i = info.get(c["file"])
        if not i or not FREE.match(i["license"]):
            print(f"skip {slug}: {c['file']} ({i and i['license']})", file=sys.stderr)
            continue
        photos[slug] = {"wikidata": c["item"], "file": c["file"], **i}
    print(f"{len(photos)} of {len(all_tours)} tours have a photo", file=sys.stderr)

    print('''/** Bilder av toppene, fra Wikimedia Commons. Generert av
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
''')
    print("export const PHOTOS: Readonly<Record<string, PeakPhoto>> = " + json.dumps(photos, ensure_ascii=False, indent=2) + ";")


if __name__ == "__main__":
    main()
