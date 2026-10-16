"""Bilder av toppene, fra Wikimedia Commons — kilden til `lib/photos.ts`.

For hver tur i `lib/tours.ts` søker skriptet i Wikidata etter elementer med
turens navn, og velger det nærmeste innen `RADIUS_KM` fra toppunktet som har et
bilde (P18). Bare navnesamsvar teller: «nærmeste ting med et bilde» kan like
gjerne være en hytte, en innsjø eller nabotoppen, og et bilde av feil fjell er
verre enn ingen bilde.

Spørretjenesten (WDQS) er ikke brukt: Norge har hundretusener av
fjellelementer, og både geo- og landsspørringer gikk ut på tid og brukte opp
kvoten. Det vanlige API-et med ett navnesøk per tur og `wbgetentities` i
batcher på 50 er lett, og `PAUSE` holder tempoet nede.

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
PAUSE = 1.5  # sekunder mellom kall
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


API = "https://www.wikidata.org/w/api.php"


def search(name: str) -> list[str]:
    """Wikidata-elementer som heter `name`, på bokmål."""
    res = get(
        API,
        {
            "action": "wbsearchentities",
            "search": name,
            "language": "nb",
            "uselang": "nb",
            "type": "item",
            "limit": 20,
            "format": "json",
        },
    )
    return [hit["id"] for hit in res.get("search", [])]


def claim(entity: dict, prop: str):
    for c in entity.get("claims", {}).get(prop, []):
        value = c.get("mainsnak", {}).get("datavalue", {}).get("value")
        if value is not None:
            return value
    return None


def entities(ids: list[str]) -> dict[str, dict]:
    """Koordinat, bilde og navn for elementene, 50 om gangen."""
    out: dict[str, dict] = {}
    for i in range(0, len(ids), 50):
        res = get(
            API,
            {
                "action": "wbgetentities",
                "ids": "|".join(ids[i : i + 50]),
                "props": "claims|labels|aliases",
                "languages": "nb|nn|no|en|se|mul",
                "format": "json",
            },
        )
        for qid, e in res.get("entities", {}).items():
            coord, img = claim(e, "P625"), claim(e, "P18")
            if not coord or not img:
                continue
            names = [v["value"] for v in e.get("labels", {}).values()]
            names += [a["value"] for vs in e.get("aliases", {}).values() for a in vs]
            out[qid] = {
                "item": qid,
                "file": img.replace(" ", "_"),
                "names": names,
                "lat": coord["latitude"],
                "lng": coord["longitude"],
            }
        time.sleep(PAUSE)
    return out


def candidates(all_tours: list[dict], cache: str | None) -> dict[str, list[str]]:
    """Søketreffene per tur. Lagres underveis i `cache`, så en struping
    halvveis ikke koster de turene som er ferdige."""
    done: dict[str, list[str]] = {}
    if cache and os.path.exists(cache):
        done = json.load(open(cache, encoding="utf-8"))
    for t in all_tours:
        if t["slug"] in done:
            continue
        done[t["slug"]] = search(t["name"])
        if cache:
            json.dump(done, open(cache, "w", encoding="utf-8"), ensure_ascii=False)
        time.sleep(PAUSE)
    return done


def km(a_lat: float, a_lng: float, b_lat: float, b_lng: float) -> float:
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp, dl = p2 - p1, math.radians(b_lng - a_lng)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))


def pick(t: dict, peaks: list[dict]) -> dict | None:
    """Nærmeste element innen `RADIUS_KM` som heter det samme som turen."""
    want = norm(t["name"])
    near = [
        (km(t["lat"], t["lng"], p["lat"], p["lng"]), p)
        for p in peaks
        if any(norm(n) == want for n in p["names"])
    ]
    near = [(d, p) for d, p in near if d <= RADIUS_KM]
    return min(near, key=lambda dp: dp[0])[1] if near else None


def strip_tags(s: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", "", s or "")).strip()


def clean_author(s: str) -> str:
    """Fotografens navn, uten Commons' standardfraser rundt.

    «No machine-readable author provided. Berland assumed (…)» blir «Berland»,
    «The original uploader was Slimguy at German Wikipedia. (…)» blir
    «Slimguy». Ingen fotograf gir tom streng; da står lisensen og lenka til
    Commons alene."""
    s = re.sub(r"\s+", " ", s).strip()
    m = re.match(r"No machine-readable author provided\. (.+?) assumed", s)
    if m:
        return m[1]
    m = re.match(r"The original uploader was (.+?) at ", s)
    if m:
        return m[1]
    return s


def clean_src(url: str) -> str:
    """Miniatyradressen uten Commons' sporingsparametre (`utm_*`)."""
    return url.split("?", 1)[0]


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
                "src": clean_src(ii.get("thumburl") or ii["url"]),
                "width": ii.get("thumbwidth") or ii["width"],
                "height": ii.get("thumbheight") or ii["height"],
                "page": ii["descriptionurl"],
                "author": clean_author(strip_tags(meta.get("Artist", {}).get("value", ""))),
                "license": strip_tags(meta.get("LicenseShortName", {}).get("value", "")),
                "licenseUrl": strip_tags(meta.get("LicenseUrl", {}).get("value", "")),
            }
        time.sleep(3)
    return info


def main() -> None:
    # Mellomresultatene kan lagres mellom kjøringer: PHOTO_CACHE=sti.json
    cache_path = os.environ.get("PHOTO_CACHE")
    all_tours = tours()
    hits = candidates(all_tours, cache_path + ".search" if cache_path else None)
    ids = sorted({qid for qids in hits.values() for qid in qids})
    found = entities(ids)
    chosen = {}
    for t in all_tours:
        c = pick(t, [found[q] for q in hits.get(t["slug"], []) if q in found])
        if c:
            chosen[t["slug"]] = c
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
