"""Hvilke flisruter Kartverket dekker helt — kilden til `lib/map-coverage.ts`.

Kartverkets topografiske fliser er gjennomsiktige utenfor Norge, og
OpenStreetMap ligger under for å fylle resten av verden. Inne i Norge er OSM
bortkastet: flisene hentes, betales i båndbredde, og fordi de ofte er raskere
enn Kartverkets, blinker et annet kart fram under hver flytur før Kartverket
legger seg over.

En rute regnes som dekket når under `MAX_HOLES` av pikslene har alfa under
`MIN_ALPHA`. Helt ugjennomsiktige er flisene ikke — kantutjevning og enkelte
symboler gir noen titalls gjennomsiktige piksler også midt inne i landet — men
der utlandet eller havet begynner, er det tusenvis.

Norge er langt og smalt, så de fleste nivå-8-rutene berører kyst eller grense.
Derfor forfines det: en rute som er delvis dekket, deles i fire på neste nivå,
ned til `MAX_Z`. Helt tomme ruter (utlandet) forfines ikke.

    python3 scripts/map-coverage/build_coverage.py > lib/map-coverage.ts

Krever Pillow. Kjøres på nytt bare hvis Kartverket endrer dekningen.
"""

import io
import math
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor

from PIL import Image

MIN_Z = 8
MAX_Z = 10
URL = "https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png"
# Fastlandet med margin; Svalbard og Jan Mayen har ingen turer.
SOUTH, WEST, NORTH, EAST = 57.5, 4.0, 71.5, 31.5
MIN_ALPHA = 64
MAX_HOLES = 0.005  # andel av flisens piksler


def tile_x(lng: float, z: int) -> int:
    return int((lng + 180) / 360 * 2**z)


def tile_y(lat: float, z: int) -> int:
    r = math.radians(lat)
    return int((1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * 2**z)


def holes(cell: tuple[int, int, int]) -> tuple[tuple[int, int, int], float]:
    z, x, y = cell
    req = urllib.request.Request(URL.format(z=z, x=x, y=y), headers={"User-Agent": "Toppkart coverage script"})
    with urllib.request.urlopen(req, timeout=30) as res:
        img = Image.open(io.BytesIO(res.read())).convert("RGBA")
    return cell, sum(img.split()[3].histogram()[:MIN_ALPHA]) / (img.width * img.height)


def main() -> None:
    cells = [
        (MIN_Z, x, y)
        for x in range(tile_x(WEST, MIN_Z), tile_x(EAST, MIN_Z) + 1)
        for y in range(tile_y(NORTH, MIN_Z), tile_y(SOUTH, MIN_Z) + 1)
    ]
    covered: list[tuple[int, int, int]] = []
    checked = 0
    with ThreadPoolExecutor(6) as pool:
        while cells:
            checked += len(cells)
            partial = []
            for cell, frac in pool.map(holes, cells):
                if frac <= MAX_HOLES:
                    covered.append(cell)
                elif frac < 1 and cell[0] < MAX_Z:
                    partial.append(cell)
            cells = [
                (z + 1, 2 * x + dx, 2 * y + dy) for z, x, y in partial for dx in (0, 1) for dy in (0, 1)
            ]
    covered.sort()
    print(f"checked {checked} tiles, {len(covered)} covered cells", file=sys.stderr)

    keys = [f"{z}/{x}/{y}" for z, x, y in covered]
    lines = ["  " + " ".join(keys[i : i + 8]) for i in range(0, len(keys), 8)]
    body = "\n".join(lines)
    print(f'''/** Flisrutene Kartverket dekker helt, som «z/x/y» på nivå {MIN_Z}–{MAX_Z}.
 *  Generert av `scripts/map-coverage/build_coverage.py` — ikke rediger for hånd.
 *
 *  OSM-laget under Kartverket hopper over fliser som ligger inne i en av disse
 *  rutene; der ville de uansett vært skjult. Se `coveredByKartverket` i
 *  `lib/map-tiles.ts`. */

export const COVERAGE_MIN_ZOOM = {MIN_Z};
export const COVERAGE_MAX_ZOOM = {MAX_Z};

export const COVERED: ReadonlySet<string> = new Set(
  `
{body}
`
    .split(/\\s+/)
    .filter(Boolean),
);''')


if __name__ == "__main__":
    main()
