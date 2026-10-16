"""Hvor mye toppene leses om på Wikipedia — kilden til `lib/popularity.ts`.

Turlista sorteres etter dette. Det er et mål på hvor kjent en topp er, ikke på
hvor mange som går den, men det er et tall som finnes for alle turene og som
ingen av oss har skrevet inn.

For hver tur slås turens navn opp på norsk (bokmål og nynorsk) Wikipedia.
Artikkelen godtas bare når den ikke er en pekerside og koordinatene ligger
innen `RADIUS_KM` fra toppunktet: «Storfjellet» finnes mange steder. Uten treff
prøves «Navn (Region)» og «Navn (fjell)». Visningene er summen av siste
`MONTHS` hele måneder fra Wikimedias statistikk-API, bare mennesker
(`user`), alle plattformer.

    python3 scripts/wiki-popularity/fetch_popularity.py > lib/popularity.ts

Kjøres av `.github/workflows/wiki-data.yml`, eller for hånd.
"""

import datetime as dt
import json
import math
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

UA = "ToppkartBot/1.0 (https://github.com/Sindre31/Toppkart)"
WIKIS = ["no", "nn"]
RADIUS_KM = 3.0
MONTHS = 12
PAUSE = 1.0


def get(url: str, params: dict | None = None) -> dict | None:
    full = f"{url}?{urllib.parse.urlencode(params)}" if params else url
    for attempt in range(6):
        req = urllib.request.Request(full, headers={"User-Agent": UA, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=60) as res:
                return json.loads(res.read().decode("utf-8"), strict=False)
        except urllib.error.HTTPError as err:
            if err.code == 404:
                return None
            if err.code in (429, 503) and attempt < 5:
                wait = int(err.headers.get("Retry-After") or 0) or 10 * (attempt + 1)
                print(f"  {err.code}, waiting {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            raise
    raise RuntimeError("unreachable")


def tours() -> list[dict]:
    src = open("lib/tours.ts", encoding="utf-8").read()
    return [
        {"slug": m[1], "name": m[2], "region": m[3], "lat": float(m[4]), "lng": float(m[5])}
        for m in re.finditer(
            r'\{ slug: "([^"]+)", name: "([^"]+)", region: "([^"]*)", lat: ([\d.]+), lng: ([\d.]+)', src
        )
    ]


def km(a_lat: float, a_lng: float, b_lat: float, b_lng: float) -> float:
    p1, p2 = math.radians(a_lat), math.radians(b_lat)
    dp, dl = p2 - p1, math.radians(b_lng - a_lng)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 12742 * math.asin(math.sqrt(h))


def lookup(wiki: str, titles: list[str]) -> dict[str, dict]:
    """Slår opp titlene (følger omdirigeringer) og gir for hver tittel som ble
    spurt om: endelig tittel, om det er en pekerside, og koordinatene."""
    out: dict[str, dict] = {}
    for i in range(0, len(titles), 50):
        batch = titles[i : i + 50]
        res = get(
            f"https://{wiki}.wikipedia.org/w/api.php",
            {
                "action": "query",
                "titles": "|".join(batch),
                "redirects": 1,
                "prop": "coordinates|pageprops",
                "ppprop": "disambiguation",
                "coprimary": "primary",
                "colimit": "max",
                "format": "json",
            },
        )
        q = (res or {}).get("query", {})
        hop = {n["from"]: n["to"] for n in q.get("normalized", [])}
        hop.update({r["from"]: r["to"] for r in q.get("redirects", [])})
        pages = {p["title"]: p for p in q.get("pages", {}).values() if "missing" not in p}
        for asked in batch:
            title = asked
            for _ in range(3):
                title = hop.get(title, title)
            page = pages.get(title)
            if not page:
                continue
            coords = page.get("coordinates", [])
            out[asked] = {
                "title": title,
                "disambiguation": "disambiguation" in page.get("pageprops", {}),
                "coord": (coords[0]["lat"], coords[0]["lon"]) if coords else None,
            }
        time.sleep(PAUSE)
    return out


def articles(all_tours: list[dict]) -> dict[str, list[str]]:
    """Artiklene som handler om hver tur, som «wiki:Tittel»."""
    found: dict[str, list[str]] = {t["slug"]: [] for t in all_tours}
    for wiki in WIKIS:
        pending = list(all_tours)
        for pattern in ("{name}", "{name} ({region})", "{name} (fjell)"):
            asked = {pattern.format(**t): t for t in pending}
            pages = lookup(wiki, list(asked))
            matched = set()
            for title, t in asked.items():
                page = pages.get(title)
                if not page or page["disambiguation"] or not page["coord"]:
                    continue
                if km(t["lat"], t["lng"], *page["coord"]) <= RADIUS_KM:
                    found[t["slug"]].append(f"{wiki}:{page['title']}")
                    matched.add(t["slug"])
            pending = [t for t in pending if t["slug"] not in matched]
    return found


def views(article: str, start: str, end: str) -> int:
    wiki, title = article.split(":", 1)
    path = urllib.parse.quote(title.replace(" ", "_"), safe="")
    res = get(
        "https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/"
        f"{wiki}.wikipedia/all-access/user/{path}/monthly/{start}/{end}"
    )
    return sum(item["views"] for item in (res or {}).get("items", []))


def main() -> None:
    today = dt.date.today()
    last = today.replace(day=1) - dt.timedelta(days=1)  # siste dag i forrige måned
    months_back = last.year * 12 + last.month - 1 - (MONTHS - 1)
    first = dt.date(months_back // 12, months_back % 12 + 1, 1)
    start, end = first.strftime("%Y%m%d"), last.strftime("%Y%m%d")

    all_tours = tours()
    found = articles(all_tours)
    result = {}
    for t in all_tours:
        names = found[t["slug"]]
        if not names:
            continue
        total = 0
        for a in names:
            total += views(a, start, end)
            time.sleep(PAUSE)
        result[t["slug"]] = {"views": total, "articles": names}
    print(f"{len(result)} of {len(all_tours)} tours have a Wikipedia article", file=sys.stderr)

    print(f'''/** Hvor mye toppene leses om på Wikipedia, {first:%Y-%m}–{last:%Y-%m}. Generert av
 *  `scripts/wiki-popularity/fetch_popularity.py` — ikke rediger for hånd.
 *
 *  Visninger av turens artikkel på norsk Wikipedia (bokmål og nynorsk), bare
 *  mennesker. Turer uten artikkel står ikke her og sorteres sist. */

export interface Popularity {{
  views: number;
  /** Artiklene tallet er summen av, som «wiki:Tittel». */
  articles: readonly string[];
}}

export const POPULARITY_PERIOD: {{ from: string; to: string }} | null = {{ from: "{first:%Y-%m}", to: "{last:%Y-%m}" }};

export const POPULARITY: Readonly<Record<string, Popularity>> = ''' + json.dumps(result, ensure_ascii=False, indent=2) + ";")


if __name__ == "__main__":
    main()
