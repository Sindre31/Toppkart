"use client";

/** `/kart` — the core of the product. React port of `design-reference/kart.html`:
 *  56px topbar, 372px tour list on the left, full-bleed Leaflet map on the right,
 *  the shared NO/EN switcher, and a detail panel that draws the tour's ascent
 *  line. The language arrives as a prop from the server, which reads the
 *  `tk_lang` cookie — it is never local state. Switching refetches this route
 *  rather than navigating, so the filters, the selected tour and the live
 *  Leaflet instance all survive the change. */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Check, Lock, Unlock } from "lucide-react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NavMenu } from "@/components/NavMenu";
import { GRADE_COLORS } from "@/lib/config";
import type { RouteMeta } from "@/lib/tours";
import type { Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";
import { mapDict, type Dict } from "@/lib/i18n/map";
import type { Grade, Tour } from "@/lib/types";
import { AvalanchePanel } from "./AvalanchePanel";
import s from "./kart.module.css";

/* One lazy wrapper, created once at module scope. A wrapper per language would
   hand React a different component type whenever `lang` changes, which unmounts
   the Leaflet map and refetches every tile just to retranslate the tooltips.
   The canvas takes `lang` as a prop, and the loading placeholder comes from the
   Suspense boundary at the render site — so both stay translated without the
   component's identity depending on the language. */
const MapCanvas = dynamic(() => import("./MapCanvas"), { ssr: false });

/** `.btn-primary` sets `color: var(--color-bg)`, but globals' `a:hover` rule is
 *  more specific for links — pin the colour inline so CTAs stay legible. */
const PRIMARY_LINK: React.CSSProperties = { color: "var(--color-bg)" };

const GRADE_FILTERS = [1, 2, 3, 4] as const;

function GradeDot({ grade, t }: { grade: Grade; t: Dict }) {
  return (
    <span className={s.grade}>
      <span className={s.dot} style={{ background: GRADE_COLORS[grade - 1] }} />
      {t.grades[grade]}
    </span>
  );
}

function TourMeta({ tour, t, showSummit }: { tour: Tour; t: Dict; showSummit?: boolean }) {
  return (
    <div className={s.meta}>
      <GradeDot grade={tour.grade} t={t} />
      <span>{tour.region}</span>
      {showSummit ? (
        <span>
          {tour.summitM} {t.moh}
        </span>
      ) : (
        <span>↑ {tour.verticalM} m</span>
      )}
      {showSummit ? null : <span>{tour.duration}</span>}
    </div>
  );
}

export default function MapView({
  lang,
  hasAccess,
  nav,
  tours,
  regions,
  routeMeta,
  initialSlug,
  initialRouteId,
}: {
  lang: Lang;
  hasAccess: boolean;
  /** Turene, ferdig oversatt av serveren.
   *
   *  De ble tidligere hentet fra `lib/tours` og kjørt gjennom `localizeTours`
   *  her. Begge modulene er store — den engelske overlay-en drar med seg all
   *  guideprosa — og de havnet i bunten som må lastes og kjøres før sida
   *  reagerer på et trykk. Oversettelsen er ren funksjon av språket, og språket
   *  er allerede kjent på serveren, så den hører hjemme der. Språkbyttet gjør
   *  `router.refresh()` og ikke en navigasjon, så disse kommer oversatt tilbake
   *  uten at Leaflet rives ned. */
  tours: Tour[];
  /** Regionene i filteret, i redaksjonell rekkefølge. */
  regions: string[];
  /** Rutene per tur uten geometrien — det rutevelgeren viser. Punktene tegnes av
   *  `MapCanvas`, som laster dem i sin egen bunt. */
  routeMeta: Record<string, RouteMeta[]>;
  /** Menylenkene, rendret på serveren av `NavLinks` og sendt inn ferdige.
   *
   *  Topbaren her er den eneste navigasjonen på nettstedet som ikke er
   *  `SiteNav`, og den drev fra resten: mens de andre sidene fikk «Turene»,
   *  «Kartet» og kontodelen, hadde kartet bare en innloggingslenke og en
   *  prøveknapp. Den avgjorde dessuten kontoenden ut fra et `signedIn`-flagg
   *  som måtte holdes i takt med `AccountNav` for hånd.
   *
   *  Nå er det den samme funksjonen som lager lenkene begge steder. Den er en
   *  serverkomponent og kan ikke kalles herfra, men den ferdige noden kan
   *  sendes inn som en hvilken som helst annen prop. */
  nav: ReactNode;
  initialSlug: string | null;
  initialRouteId: string | null;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState(0);
  const [region, setRegion] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug);
  /** Narrow screens show one pane at a time. The panel is opaque and nearly
   *  full width there, so side-by-side just means the map is permanently
   *  behind it — on the one page whose whole point is the map. Above the
   *  breakpoint this state is inert; the CSS ignores it. */
  const [mobilePane, setMobilePane] = useState<"list" | "map">("list");
  /* Which of the peak's routes is drawn. Null means "the tour's own route", so a
     peak with one route needs no state and picking a tour never has to guess. */
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(initialRouteId);
  const detailRef = useRef<HTMLDivElement>(null);

  const t = mapDict(lang);
  /* Menyknappens etiketter er sidechromets, ikke kartets — samme knapp, samme
     ord som på de andre sidene. */
  const c = commonDict(lang);

  /* The prototype sets `body { overflow: hidden }` globally; scope it to this
     route so the other pages keep scrolling normally. */
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter(
      (tour) =>
        (!q ||
          tour.name.toLowerCase().includes(q) ||
          tour.region.toLowerCase().includes(q)) &&
        (!grade || tour.grade === grade) &&
        (!region || tour.region === region),
    );
  }, [tours, query, grade, region]);

  const visible = useMemo(() => new Set(rows.map((tour) => tour.slug)), [rows]);

  const selected = useMemo(
    () => tours.find((tour) => tour.slug === selectedSlug) ?? null,
    [tours, selectedSlug],
  );

  const routes = useMemo(
    () => (selected ? (routeMeta[selected.slug] ?? []) : []),
    [routeMeta, selected],
  );
  const activeRouteId = useMemo(() => {
    if (!routes.length) return null;
    return routes.some((r) => r.id === selectedRouteId) ? selectedRouteId : routes[0].id;
  }, [routes, selectedRouteId]);

  /* Deep link both ways: `/kart?tur=<slug>&rute=<id>` opens a tour on a given
     route, and choosing either rewrites the URL so a link can be shared and the
     guide page can link straight back in. */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedSlug) url.searchParams.set("tur", selectedSlug);
    else url.searchParams.delete("tur");
    /* Only pin the route when it is not the tour's own — keeps the common link short. */
    if (selectedSlug && activeRouteId && routes.length > 1 && activeRouteId !== routes[0].id) {
      url.searchParams.set("rute", activeRouteId);
    } else {
      url.searchParams.delete("rute");
    }
    window.history.replaceState(window.history.state, "", url);
  }, [selectedSlug, activeRouteId, routes]);

  useEffect(() => {
    if (selectedSlug && detailRef.current) detailRef.current.scrollTop = 0;
  }, [selectedSlug]);

  const openTour = useCallback((slug: string) => {
    setSelectedSlug(slug);
    /* A route id belongs to one peak; carrying it across would pick an unrelated
       route or silently fall back. */
    setSelectedRouteId(null);
    /* Deliberately does not touch `mobilePane`. Picking a peak off the map
       should draw its route and leave you looking at it — the facts are one tap
       away in the bar below, not forced over the thing you just asked to see.
       From the list there is nothing to do either: that pane is already open,
       and the detail replaces the list in place. */
  }, []);

  return (
    <div className={s.page} data-pane={mobilePane}>
      <header className={s.topbar}>
        <Link className={s.brand} href="/">
          Toppkart
        </Link>
        <NavMenu label={c.menu} closeLabel={c.menuClose}>
          {nav}
        </NavMenu>
        <LanguageSwitcher lang={lang} />
      </header>

      <aside className={s.side} data-mode={selected ? "detail" : "list"}>
        <div className={s.sideHead}>
          <input
            className="input"
            type="search"
            placeholder={t.search}
            aria-label={t.searchLabel}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className={s.filters}>
            <div className="seg" role="group" aria-label={t.gradeGroup}>
              <label className="seg-opt">
                <input
                  type="radio"
                  name="g"
                  value={0}
                  checked={grade === 0}
                  onChange={() => setGrade(0)}
                />
                <span>{t.all}</span>
              </label>
              {GRADE_FILTERS.map((g) => (
                /* The visible label is the bare number, as in the prototype —
                   the grade name rides along for screen readers. */
                <label className="seg-opt" key={g}>
                  <input
                    type="radio"
                    name="g"
                    value={g}
                    aria-label={t.grades[g]}
                    checked={grade === g}
                    onChange={() => setGrade(g)}
                  />
                  {g}
                </label>
              ))}
            </div>
            <label className={s.srOnly} htmlFor="kart-region">
              {t.regionLabel}
            </label>
            <select
              id="kart-region"
              className={`input ${s.regionSelect}`}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="">{t.allRegions}</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className={s.count}>
            {rows.length} {rows.length === 1 ? t.tour : t.tours} · {t.approx}
          </div>
        </div>

        <div className={s.list}>
          {rows.map((tour) => (
            <button
              type="button"
              key={tour.slug}
              className={`${s.tour}${selectedSlug === tour.slug ? ` ${s.sel}` : ""}`}
              onClick={() => openTour(tour.slug)}
            >
              <h3>
                <span>{tour.name}</span>
                <span className={s.moh}>
                  {tour.summitM} {t.moh}
                </span>
              </h3>
              <TourMeta tour={tour} t={t} />
            </button>
          ))}
        </div>

        {selected ? (
          <div className={s.detail} ref={detailRef}>
            <div className={s.dHead}>
              <button
                type="button"
                className={`btn btn-ghost ${s.backBtn}`}
                onClick={() => setSelectedSlug(null)}
              >
                {t.back}
              </button>
              <h2 className={s.dTitle}>{selected.name}</h2>
              <TourMeta tour={selected} t={t} showSummit />
            </div>

            <div className={s.dBody}>
              <p className={s.teaser}>{selected.teaser}</p>

              {/* Open to everyone, subscription or not. A danger level is
                  safety information about the mountain someone is looking at
                  right now; putting it behind the paywall would be the one
                  thing on this page it is not defensible to withhold. */}
              <AvalanchePanel slug={selected.slug} lang={lang} />

              {selected.hasGuide ? (
                <Link className={`btn btn-secondary ${s.guideLink}`} href={`/tur/${selected.slug}`}>
                  {t.openGuide} →
                </Link>
              ) : null}

              {routes.length > 1 ? (
                <div className={s.routes}>
                  <div className={s.routesHead}>{t.routesLabel}</div>
                  <div className={s.routeList} role="radiogroup" aria-label={t.routesGroup}>
                    {routes.map((route) => (
                      <label
                        key={route.id}
                        className={`${s.route}${route.id === activeRouteId ? ` ${s.routeSel}` : ""}`}
                      >
                        <input
                          type="radio"
                          name="rute"
                          value={route.id}
                          checked={route.id === activeRouteId}
                          onChange={() => setSelectedRouteId(route.id)}
                        />
                        <span className={s.routeName}>{route.name}</span>
                        <span className={s.routeMeta}>
                          ↑ {route.gainM} m · {(route.distanceM / 1000).toFixed(1)} km ·{" "}
                          {route.trailhead}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className={s.stats}>
                <div className={s.stat}>
                  <div className={s.statL}>{t.stHm}</div>
                  <div className={s.statV}>↑ {selected.verticalM} m</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statL}>{t.stTime}</div>
                  <div className={s.statV}>{selected.duration}</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statL}>{t.stGrade}</div>
                  <div className={s.statV}>{t.grades[selected.grade]}</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statL}>{t.stAsp}</div>
                  <div className={s.statV}>{selected.aspect}</div>
                </div>
                <div className={`${s.stat} ${s.statWide}`}>
                  <div className={s.statL}>{t.stSea}</div>
                  <div className={s.statV}>{selected.season}</div>
                </div>
              </div>

              <p className={s.schematic}>{t.schematicNote}</p>

              {hasAccess ? (
                <div className="locked">
                  <div className={`${s.lockmsg} ${s.lockmsgFlush}`}>
                    <span className={`kicker ${s.lockKicker}`}>
                      <Unlock size={14} strokeWidth={1.5} />
                      {t.unlockedTitle}
                    </span>
                    <p className={s.lockText}>{t.unlockedBody}</p>
                    <div className="chips">
                      {t.chips.map((chip) => (
                        <span className={`chip ${s.chipOn}`} key={chip}>
                          <Check size={12} strokeWidth={1.5} />
                          {chip}
                        </span>
                      ))}
                    </div>
                    {selected.hasGuide ? (
                      <Link
                        className="btn btn-primary"
                        href={`/tur/${selected.slug}`}
                        style={PRIMARY_LINK}
                      >
                        {t.openGuide} →
                      </Link>
                    ) : (
                      <p className={s.lockText}>{t.guidePending}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="locked">
                  <div className="bars" aria-hidden="true">
                    <i style={{ width: "92%" }} />
                    <i style={{ width: "100%" }} />
                    <i style={{ width: "86%" }} />
                    <i style={{ width: "95%" }} />
                    <i style={{ width: "64%" }} />
                    <i style={{ width: 0, height: 6 }} />
                    <i style={{ width: "97%" }} />
                    <i style={{ width: "78%" }} />
                  </div>
                  <div className={s.lockmsg}>
                    <span className={`kicker ${s.lockKicker}`}>
                      <Lock size={14} strokeWidth={1.5} />
                      {t.lockTitle}
                    </span>
                    <p className={s.lockText}>{t.lockBody}</p>
                    <div className="chips">
                      {t.chips.map((chip) => (
                        <span className="chip" key={chip}>
                          {chip}
                        </span>
                      ))}
                    </div>
                    <Link className="btn btn-primary" href="/betaling" style={PRIMARY_LINK}>
                      {t.lockCta}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </aside>

      <div className={s.map}>
        <Suspense fallback={<div className={s.mapLoading}>{t.mapLoading}</div>}>
          <MapCanvas
            tours={tours}
            visible={visible}
            selectedSlug={selectedSlug}
            selectedRouteId={activeRouteId}
            onSelect={openTour}
            onSelectRoute={setSelectedRouteId}
            lang={lang}
          />
        </Suspense>
      </div>

      {/* Phone only — hidden by CSS above the breakpoint, where both panes are
          visible at once and there is nothing to toggle between. */}
      <button
        type="button"
        className={s.paneToggle}
        onClick={() => setMobilePane((pane) => (pane === "map" ? "list" : "map"))}
      >
        {mobilePane === "map" ? t.showList : t.showMap}
      </button>

      {/* Looking at the map with a peak picked: its route is drawn, and this is
          the offer to read about it. Also phone-only — on a wide screen the
          detail is already beside the map. */}
      {selected ? (
        <div className={s.peakBar}>
          <button
            type="button"
            className={s.peakBarOpen}
            onClick={() => setMobilePane("list")}
          >
            <span className={s.peakBarName}>{selected.name}</span>
            <span className={s.peakBarCta}>{t.showInfo}</span>
          </button>
          <button
            type="button"
            className={s.peakBarClose}
            aria-label={t.clearPeak}
            onClick={() => setSelectedSlug(null)}
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  );
}
