import { describe, expect, it } from "vitest";

import {
  TILE_BUDGET,
  boundsOf,
  padBounds,
  planOverviewTiles,
  planTourTiles,
  staticRefs,
  tileAt,
  tileRefs,
  tilesAlong,
  tilesInBounds,
  topoTileUrl,
} from "@/lib/offline/plan";
import { ROUTES } from "@/lib/routes";

/** Rutelinjene som `[lat, lng]`-par, slik `lib/routes` lagrer dem som tripler. */
function linesOf(slug: string): [number, number][][] {
  return (ROUTES[slug] ?? []).map((r) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < r.line.length; i += 3) pts.push([r.line[i], r.line[i + 1]]);
    return pts;
  });
}

describe("tileAt", () => {
  it("agrees with the slippy-map formula on independently computed tiles", () => {
    /* Oslo sentrum og Tromsø, regnet ut med OSM-wikiens asinh-form,
       `(1 − asinh(tan φ) / π) / 2 · 2^z` — en annen skrivemåte enn den i
       `tileAt`, så de to kan ikke ta feil på samme måte. */
    expect(tileAt(59.9139, 10.7522, 12)).toEqual({ x: 2170, y: 1191 });
    expect(tileAt(69.6492, 18.9553, 10)).toEqual({ x: 565, y: 232 });
  });

  it("puts north at small y — the axis a swapped formula gets backwards", () => {
    expect(tileAt(70, 15, 8).y).toBeLessThan(tileAt(60, 15, 8).y);
  });

  it("writes the URL as z/y/x, which is Kartverket's order", () => {
    expect(topoTileUrl(12, 2200, 1080)).toBe(
      "https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/12/1080/2200.png",
    );
  });
});

describe("tile plans", () => {
  it("covers every point of a route, at every detail level kept", () => {
    const lines = linesOf("slogen");
    expect(lines.length).toBeGreaterThan(0);
    const urls = new Set(planTourTiles(lines));
    for (const z of [10, 13, 14, 15]) {
      for (const [lat, lng] of lines.flat()) {
        const { x, y } = tileAt(lat, lng, z);
        expect(urls.has(topoTileUrl(z, x, y)), `${z} ${lat},${lng}`).toBe(true);
      }
    }
  });

  it("keeps the corridor inside the padded rectangle", () => {
    const lines = linesOf("slogen");
    const box = new Set(tilesInBounds(padBounds(boundsOf(lines.flat()), 1), 15));
    for (const key of tilesAlong(lines.flat(), 15)) expect(box.has(key), key).toBe(true);
  });

  it("stays inside the budget for every tour, and never drops the overview", () => {
    for (const slug of Object.keys(ROUTES)) {
      const urls = planTourTiles(linesOf(slug));
      expect(urls.length, slug).toBeLessThanOrEqual(TILE_BUDGET);
      expect(new Set(urls).size, slug).toBe(urls.length);
      expect(urls.some((u) => u.includes("/webmercator/13/")), slug).toBe(true);
    }
  });

  it("keeps the national overview to a few dozen tiles", () => {
    const n = planOverviewTiles().length;
    expect(n).toBeGreaterThan(5);
    expect(n).toBeLessThan(60);
  });
});

describe("staticRefs", () => {
  it("finds script and stylesheet links in HTML", () => {
    const html = `<link rel="stylesheet" href="/_next/static/chunks/0n8kzvw2z_6as.css" data-precedence="next"/><script src="/_next/static/chunks/0e0fz-0xrg-ow.js" async=""></script>`;
    expect(staticRefs(html, "/kart").sort()).toEqual([
      "/_next/static/chunks/0e0fz-0xrg-ow.js",
      "/_next/static/chunks/0n8kzvw2z_6as.css",
    ]);
  });

  it("finds the chunks a lazy import loads, written without /_next/", () => {
    /* Klippet ut av en bygd chunk: slik peker `next/dynamic` på kartets
       Leaflet-del, som ikke står i HTML-en. */
    const js = `romise.all(["static/chunks/3znhmp7a1mko4.js","static/chunks/1o6st8y_2dap2.js","static/chunks/0n8kzvw2z_6as.css"].map(t=>o.l(t))`;
    expect(staticRefs(js, "/_next/static/chunks/0e0fz-0xrg-ow.js").sort()).toEqual([
      "/_next/static/chunks/0n8kzvw2z_6as.css",
      "/_next/static/chunks/1o6st8y_2dap2.js",
      "/_next/static/chunks/3znhmp7a1mko4.js",
    ]);
  });

  it("does not count a /_next/static path twice through the bare pattern", () => {
    expect(staticRefs(`"/_next/static/chunks/a.js"`, "/")).toEqual(["/_next/static/chunks/a.js"]);
  });

  it("resolves CSS url() against the stylesheet and skips data and VML", () => {
    const css = `a{background:url(../media/layers.3muxcl8sz6330.png)}b{behavior:url(#default#VML)}c{src:url("../media/x.woff2") format("woff2")}d{x:url(data:image/png;base64,AAA)}`;
    expect(staticRefs(css, "/_next/static/chunks/0n8kzvw2z_6as.css").sort()).toEqual([
      "/_next/static/media/layers.3muxcl8sz6330.png",
      "/_next/static/media/x.woff2",
    ]);
  });
});

describe("tileRefs", () => {
  it("finds the route figure's tiles in the guide page", () => {
    const html = `<img src="https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/webmercator/13/2162/4345.png" alt=""/><img src="https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/webmercator/13/2162/4345.png"/>`;
    expect(tileRefs(html)).toEqual([
      "https://cache.kartverket.no/v1/wmts/1.0.0/topograatone/default/webmercator/13/2162/4345.png",
    ]);
  });
});
