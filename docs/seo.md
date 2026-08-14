# Search engines

What the site does for crawlers, what it deliberately does not, and — the part worth writing
down — which fixes were tried and failed. The negative results are the expensive ones to
rediscover.

`docs/deploy.md` §3c covers the operational side: verifying the property, submitting the sitemap,
what to expect in the first weeks. This document is about the code.

---

## The Bing incident, August 2026

Bing Webmaster Tools reported **"Discovered but not crawled — URL cannot appear on Bing"** for
`https://toppkart.no/tur/slogen`, discovered 6 Aug 2026. The site was audited against the
[Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a).

One outright violation was found and fixed. Three other findings are real but were left alone on
purpose; they are written up below with what it would actually cost to change them.

### Fixed: soft 404 under `/tur/*`

`/tur/finnesikke` answered **`200 OK`**. The body was right — "Turen finnes ikke", `noindex` — but
the status line said everything was fine. `/tur/*` is an unbounded URL space, so every typo, every
truncated link and every stray search term under `/tur/` was a valid page to fetch. Bing counts
that against the site, and a directory full of them is a directory it does not pay to crawl —
which is what "Discovered but not crawled" describes.

`notFound()` was already in the page component. It did not set the status, and the reason is
`app/loading.tsx`: a `loading` boundary makes the route a Suspense boundary, and Next then streams
the response. The head is sent — with `200` — before the page component has looked the slug up,
and a throw from there can only replace the body, not a status code already on the wire.

The decision therefore lives in `generateMetadata`, which runs before the stream opens because
`<head>` must be complete before the first byte.

| | `/tur/slogen` | `/tur/finnesikke` |
| --- | --- | --- |
| before | 200 | **200** |
| without `app/loading.tsx` | 200 | 404 |
| now | 200 | **404** |

Two alternatives were tried and rejected. Deleting `app/loading.tsx` works, and costs prefetch on
every dynamic route — the exact thing the file was added to fix. `export const dynamicParams =
false` does nothing at all: no page is prerendered (they all read cookies), so Next renders anyway
and the status is already out.

`lib/seo.test.ts` guards the invariant this created. Until the fix, the sitemap *could not* promise
a URL that failed, because everything under `/tur/` answered 200. Now it can, so the test asserts
that every sitemap URL exists in `TOURS` and appears in the list `/tur/[slug]` is built from.

---

## Nothing is cached, and why it stays that way

Every page route is `ƒ` in the build output. Only `robots.txt`, `sitemap.xml` and the icons
prerender. Each HTML response carries:

```
cache-control: private, no-cache, no-store, max-age=0, must-revalidate
x-vercel-cache: MISS
```

Vercel's CDN will not store a response carrying `no-store`, so every crawl and every first visit
runs a function.

### What it costs

Measured on one warm connection, steady state, from a US host:

| | TTFB |
| --- | --- |
| CDN hit (`x-vercel-cache: HIT`) | ~61 ms |
| Page route (`no-store`, MISS) | ~235 ms |
| First request / cold function | ~700 ms |

Roughly 4×, plus the cold-start spikes. The absolute numbers are inflated by the measuring host's
network path; the ratio is the signal. The render itself is not the problem — the same page builds
in ~20 ms against a local production server, so most of the gap is the round trip to `arn1`, which
`vercel.json` pins as the only function region.

Worth keeping in proportion: ~235 ms is a fine response time. This is a real inefficiency, but it
is unlikely to be what stopped Bing from crawling.

### Why it is dynamic

`app/layout.tsx` reads cookies in both `generateMetadata` (`getLang()`) and the layout body
(`getLang()`, `getIdentity()`), and `AccountNav` in `components/SiteChrome.tsx` reads
`getIdentity()`. A `cookies()` call anywhere in a route's tree makes the whole route dynamic, so
this opts out *every* page — `/vilkar` and `/personvern` included, which are otherwise static legal
text.

### Four fixes that do not work

**Set the header in middleware.** Tested: `response.headers.set("Cache-Control", "public,
s-maxage=60, …")` plus `Vary: Cookie`, built, served. Next replaces both headers on the way out.
The response still said `private, no-cache, no-store`.

**Set it in `next.config.ts` or `vercel.json`.** Vercel documents that a `Cache-Control` returned
by a function overrides route-level headers, and Next's `no-store` is returned by the function.

**Wrap the cookie reads in `<Suspense>`.** Without Partial Prerendering this does nothing — a
`cookies()` read anywhere in the tree is what makes the route dynamic, regardless of boundaries.
Suspense-shaped caching is exactly what PPR was invented for.

**Turn on `cacheComponents: true`** (PPR in Next 16). Not a contained change: the build refuses
`export const runtime` in `app/api/konto`, `app/api/stripe/webhook` and `app/api/tilbakemelding`,
and `export const dynamic` in `app/admin/tilbakemeldinger`. It is a project-wide migration.

### The one that does work, and what it breaks

`export const dynamic = "force-static"` prerenders a route — verified, `/vilkar` went to `○` in the
build table. Under it `cookies()` returns empty, which on these pages means:

- `getLang()` falls back to Norwegian, so a legal page would be **Norwegian for English readers**
- `getIdentity()` returns anonymous, so `AccountNav` would show **"Logg inn / Prøv gratis" to
  signed-in readers**

Tour pages cannot use it at all: `getViewer().hasAccess` picks the paywall, and a frozen page would
serve the locked version to subscribers.

### What a real fix costs

Two things, and they compose:

1. **Locale in the URL.** `<html lang>` is set in the single root layout from `tk_lang`. Under
   `force-static` it freezes to `nb-NO`, so an English page would carry the wrong language
   attribute. Next's way around this is `app/[lang]/layout.tsx` *as* the root layout, which means
   moving every route under a language segment, rewriting internal links, and finding a home for
   the top-level 404.
2. **`cacheComponents` plus Suspense around the personal parts.** Only this lets a tour page have a
   static shell with `hasAccess` as a streamed hole. Get the boundary wrong and paid content lands
   in the cached artifact — this is the part to test explicitly, not eyeball.

Done together it would also make English indexable (below), which is probably the larger prize. It
was priced and deferred in August 2026, not forgotten.

---

## English is not indexable

The language lives in the `tk_lang` cookie, and `?lang=en` 307-redirects to the bare URL. There is
therefore **no address that answers in English**, and no `hreflang` anywhere on the site. A crawler
sees Norwegian and nothing else.

Nothing here is a guideline violation — the canonical, the sitemap and the default all agree that
the indexable site is Norwegian, and that is a coherent position. It just means the English
translation earns no search traffic. Fixing it is item 1 above.

---

## Smaller notes

**Thin pages.** ~1 700 characters of visible text on a tour page. Measured with 6-grams across
three tours, ~80 % of it is unique to that tour, so this is thin rather than duplicate — about 250
words. `PREVIEW_PARAGRAPHS` in `components/guide/GuideSections.tsx` is the dial, and the comment
there already carries the history from the Google round.

**Zoom is disabled.** `maximumScale: 1, userScalable: false` in `app/layout.tsx`. Mobile
friendliness is in the guidelines and this breaks WCAG 1.4.4 on Android; iOS has ignored both since
iOS 10. The comment in the file documents the trade deliberately.

**IndexNow is not wired up.** Bing's own submission channel. Worth little for the problem above —
Bing had already discovered the URLs — but it is the supported way to announce new and changed
pages.

**No `lastmod` in the sitemap.** Deliberate, and compliant: the sitemap is built statically, so the
field would be the build time, i.e. "everything changed" on every deploy. `app/sitemap.ts` explains
it.

---

## Verified and in order

Checked during the same audit, no action needed: `robots.txt`; the sitemap (99 URLs, all of which
resolve); self-referencing canonicals on every public page; unique `<title>` and `<meta
description>`; an `<h1>` per page; HTTPS with HSTS; `www` → apex (301); trailing slash (308); and
structured data that describes what the reader actually sees, paywall included via
`isAccessibleForFree` and `hasPart`.
