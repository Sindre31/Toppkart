"""Shared helpers: Kartverket place names, DTM point lookups, DTM raster tiles."""

import json
import math
import os
import time
import urllib.parse
import urllib.request

import numpy as np
import rasterio

CACHE = os.path.join(os.path.dirname(__file__), "cache")
os.makedirs(CACHE, exist_ok=True)


def _get(url, timeout=120, retries=4):
    last = None
    for i in range(retries):
        try:
            return urllib.request.urlopen(url, timeout=timeout).read()
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(2 * (i + 1))
    raise RuntimeError(f"GET failed {url}: {last}")


def stedsnavn(name, objtype=None, fuzzy=False):
    # One page of 50 is not the register: «Storfjellet» alone has hundreds of
    # rows, and the Breivikeidet one this pipeline needed sat beyond page 1 —
    # which is how storfjellet resolved onto a 1424 m namesake 24 km away.
    # Page through the result, bounded so a fuzzy search cannot run away.
    out = []
    rows = []
    for side in range(1, 9):
        q = {
            "sok": name,
            "fuzzy": "true" if fuzzy else "false",
            "treffPerSide": 100,
            "side": side,
            "utkoordsys": 4258,
        }
        if objtype:
            q["navneobjekttype"] = objtype
        url = "https://ws.geonorge.no/stedsnavn/v1/navn?" + urllib.parse.urlencode(q)
        d = json.loads(_get(url, timeout=60))
        page = d.get("navn", [])
        rows.extend(page)
        if len(page) < 100:
            break
    for x in rows:
        p = x.get("representasjonspunkt") or {}
        if p.get("nord") is None:
            continue
        out.append(
            {
                "name": x.get("skrivemåte"),
                "type": x.get("navneobjekttype"),
                "lat": p["nord"],
                "lng": p["øst"],
                "kommune": [k.get("kommunenavn") for k in x.get("kommuner", [])],
            }
        )
    return out


def dtm_point(lat, lng):
    """Single-point DTM1 elevation, metres. Also returns terrain class."""
    url = "https://ws.geonorge.no/hoydedata/v1/punkt?" + urllib.parse.urlencode(
        {"ost": f"{lng:.6f}", "nord": f"{lat:.6f}", "koordsys": 4258}
    )
    d = json.loads(_get(url, timeout=60))
    pts = d.get("punkter") or []
    if not pts:
        return None, None
    return pts[0].get("z"), pts[0].get("terreng")


def _tile_path(key):
    return os.path.join(CACHE, key + ".tif")


def dem_tile(key, minlng, minlat, maxlng, maxlat, width, height):
    """Fetch (and cache) a DTM GeoTIFF for a lon/lat bbox."""
    path = _tile_path(key)
    if not os.path.exists(path) or os.path.getsize(path) < 1024:
        url = "https://wcs.geonorge.no/skwms1/wcs.hoyde-dtm-nhm-25833?" + urllib.parse.urlencode(
            {
                "service": "WCS",
                "version": "1.0.0",
                "request": "GetCoverage",
                "coverage": "nhm_dtm_topo_25833",
                "CRS": "EPSG:4326",
                "BBOX": f"{minlng},{minlat},{maxlng},{maxlat}",
                "WIDTH": str(width),
                "HEIGHT": str(height),
                "FORMAT": "GeoTIFF",
            }
        )
        data = _get(url, timeout=300)
        if len(data) < 1024:
            raise RuntimeError(f"tiny WCS response for {key}: {data[:300]!r}")
        with open(path, "wb") as f:
            f.write(data)
    return path


class Dem:
    """A lon/lat-gridded DEM patch with metric scale factors."""

    def __init__(self, path):
        with rasterio.open(path) as src:
            self.z = src.read(1).astype("float64")
            self.transform = src.transform
            self.height, self.width = self.z.shape
        # Nodata / sea artefacts come back as very negative numbers.
        self.z[self.z < -1000] = np.nan
        a = self.transform
        self.lng0 = a.c
        self.lat0 = a.f
        self.dlng = a.a
        self.dlat = a.e  # negative
        self.midlat = self.lat0 + self.dlat * self.height / 2
        # metres per pixel
        self.mx = abs(self.dlng) * 111320.0 * math.cos(math.radians(self.midlat))
        self.my = abs(self.dlat) * 110540.0

    def rc(self, lat, lng):
        col = (lng - self.lng0) / self.dlng
        row = (lat - self.lat0) / self.dlat
        return int(round(row)), int(round(col))

    def latlng(self, row, col):
        return self.lat0 + self.dlat * (row + 0.5), self.lng0 + self.dlng * (col + 0.5)

    def at(self, row, col):
        if 0 <= row < self.height and 0 <= col < self.width:
            return self.z[row, col]
        return np.nan


def haversine(lat1, lng1, lat2, lng2):
    r = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lng2 - lng1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))
