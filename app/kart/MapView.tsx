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
import { flushSync } from "react-dom";
import { Check, ChevronDown, Locate, LocateFixed, Search, SlidersHorizontal, Star, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NavMenu } from "@/components/NavMenu";
import { GRADE_COLORS } from "@/lib/config";
import type { RouteMeta } from "@/lib/tours";
import type { Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";
import { mapDict, type Dict } from "@/lib/i18n/map";
import type { Grade, Tour } from "@/lib/types";
import {
  ASPECT_SECTORS,
  VERTICAL_BANDS,
  distanceM,
  formatDistance,
  inVerticalBand,
  matchesAspect,
  type AspectSector,
  type VerticalBand,
} from "@/lib/map-filters";
import { CapsText } from "@/components/CapsText";
import { PeakPhoto } from "@/components/PeakPhoto";
import type { PeakPhoto as PeakPhotoData } from "@/lib/peak-photos";
import { WeatherPanel } from "@/components/weather/WeatherPanel";
import { MarkButtons } from "@/components/marks/MarkButtons";
import { useTourMarks } from "@/components/marks/useTourMarks";
import { marksDict } from "@/lib/i18n/marks";
import { AvalanchePanel } from "./AvalanchePanel";
import { useGeolocation, type GeoState } from "./useGeolocation";
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

function TourMeta({
  tour,
  t,
  showSummit,
  distance,
}: {
  tour: Tour;
  t: Dict;
  showSummit?: boolean;
  /** Ferdig formatert avstand, når leseren har delt posisjonen. */
  distance?: string;
}) {
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
      {distance ? <span className={s.distance}>{t.distanceAway(distance)}</span> : null}
    </div>
  );
}

/** Det som skal stå om posisjonen akkurat nå, eller null når det ikke er noe å
 *  si. */
function geoMessage(state: GeoState, t: Dict): string | null {
  if (state.status === "locating") return t.locating;
  if (state.status !== "error") return null;
  if (state.error === "denied") return t.geoDenied;
  if (state.error === "unsupported") return t.geoUnsupported;
  return t.geoUnavailable;
}

/** Posisjonsknappen. Den samme tilstanden har to knapper: «Nær meg» ved søket,
 *  der den sorterer lista, og en ikonknapp på kartet, der den tegner prikken.
 *  På telefon ser man bare én rute av gangen, og begge stedene er et naturlig
 *  sted å lete. */
function LocateToggle({
  state,
  onToggle,
  t,
  variant,
}: {
  state: GeoState;
  onToggle: () => void;
  t: Dict;
  variant: "side" | "map";
}) {
  const active = state.status === "on" || state.status === "locating";
  const Icon = state.status === "on" ? LocateFixed : Locate;
  const label = active ? t.locateStop : t.locate;
  return (
    <button
      type="button"
      className={variant === "map" ? s.locateBtn : s.nearBtn}
      aria-pressed={active}
      aria-label={variant === "map" ? label : undefined}
      title={label}
      data-status={state.status}
      onClick={onToggle}
    >
      <Icon size={variant === "map" ? 18 : 16} strokeWidth={1.5} aria-hidden="true" />
      {variant === "side" ? t.nearMe : null}
    </button>
  );
}

export default function MapView({
  lang,
  nav,
  tours,
  regions,
  routeMeta,
  initialSlug,
  initialRouteId,
  photos,
  sortedByPopularity,
}: {
  lang: Lang;
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
  /** Bildene av toppene, som små miniatyrer. Bare de turene som har ett; se
   *  `lib/photos.ts`. */
  photos: Readonly<Record<string, PeakPhotoData>>;
  /** Om `tours` kommer sortert etter popularitet — da sier lista det. */
  sortedByPopularity: boolean;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState(0);
  const [region, setRegion] = useState("");
  const [aspect, setAspect] = useState<AspectSector | "">("");
  const [vertical, setVertical] = useState<VerticalBand | "">("");
  const geo = useGeolocation();
  /** Favoritter og gåtte turer, lagret på enheten. Filteret står bare når
   *  lista er lest. */
  const marks = useTourMarks();
  const [mine, setMine] = useState<"" | "favorites" | "done" | "notDone">("");
  const markMap = marks.state.status === "ready" ? marks.state.marks : null;
  const position = geo.state.status === "on" ? geo.state.position : null;
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug);
  /** Narrow screens show one pane at a time. The panel is opaque and nearly
   *  full width there, so side-by-side just means the map is permanently
   *  behind it — on the one page whose whole point is the map. Above the
   *  breakpoint this state is inert; the CSS ignores it.
   *
   *  Opens on the map: this is the front page, and the map is what it is. The
   *  list is one tap away on the toggle. */
  const [mobilePane, setMobilePane] = useState<"list" | "map">("map");
  /* Which of the peak's routes is drawn. Null means "the tour's own route", so a
     peak with one route needs no state and picking a tour never has to guess. */
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(initialRouteId);
  const detailRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  /** «Flere filtre» åpen eller lukket. Lukket som standard: søk og grad er det
   *  de fleste bruker, og lista skal starte høyt oppe. */
  const [moreOpen, setMoreOpen] = useState(false);

  const t = mapDict(lang);
  /* Menyknappens etiketter er sidechromets, ikke kartets — samme knapp, samme
     ord som på de andre sidene. */
  const c = commonDict(lang);
  const m = marksDict(lang);

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
        (!region || tour.region === region) &&
        (!aspect || matchesAspect(tour.aspect, aspect)) &&
        (!vertical || inVerticalBand(tour.verticalM, vertical)) &&
        (!mine ||
          !markMap ||
          (mine === "favorites" && markMap.get(tour.slug)?.favorite) ||
          (mine === "done" && markMap.get(tour.slug)?.doneOn) ||
          (mine === "notDone" && !markMap.get(tour.slug)?.doneOn)),
    );
  }, [tours, query, grade, region, aspect, vertical, mine, markMap]);

  /* Avstanden til hver topp, og lista sortert etter den, så lenge leseren har
     delt posisjonen. Uten posisjon står lista i rekkefølgen serveren sendte:
     mest leste på Wikipedia først (`lib/popularity.ts`).
     Kartet får den usorterte `rows` gjennom `visible` — rekkefølgen betyr ingen
     ting der. */
  const distances = useMemo(() => {
    if (!position) return null;
    return new Map(tours.map((tour) => [tour.slug, distanceM(position, tour)]));
  }, [tours, position]);

  const listed = useMemo(
    () =>
      distances
        ? [...rows].sort((a, b) => distances.get(a.slug)! - distances.get(b.slug)!)
        : rows,
    [rows, distances],
  );

  const filtered = Boolean(query.trim() || grade || region || aspect || vertical || mine);

  /** Filtrene bak «Flere filtre» som står på, som brikker: hva de heter, og
   *  hvordan de slås av. */
  const activeExtras = useMemo(() => {
    const out: { key: string; label: string; clear: () => void }[] = [];
    if (region) out.push({ key: "region", label: region, clear: () => setRegion("") });
    if (aspect) out.push({ key: "aspect", label: t.aspectSectors[aspect], clear: () => setAspect("") });
    if (vertical) {
      out.push({ key: "vertical", label: t.verticalBands[vertical], clear: () => setVertical("") });
    }
    if (mine) {
      const label = { favorites: m.filterFavorites, done: m.filterDone, notDone: m.filterNotDone }[mine];
      out.push({ key: "mine", label, clear: () => setMine("") });
    }
    return out;
  }, [region, aspect, vertical, mine, t, m]);
  const resetFilters = useCallback(() => {
    setQuery("");
    setGrade(0);
    setRegion("");
    setAspect("");
    setVertical("");
    setMine("");
  }, []);

  /** Øker hver gang leseren ber om startposisjonen; kartet flyr hjem på det. */
  const [homeSignal, setHomeSignal] = useState(0);
  const goHome = useCallback(() => {
    setSelectedSlug(null);
    setSelectedRouteId(null);
    resetFilters();
    setMobilePane("map");
    setHomeSignal((n) => n + 1);
  }, [resetFilters]);

  /** Logoen og «Kartet» lenker til `/` — den sida vi står på. Uten dette gjør et
   *  trykk på dem ingenting synlig: Next navigerer til samme side, og både valgt
   *  topp, filtrene og utsnittet blir stående. Leseren mener «tilbake til
   *  start», så det er det vi gjør, uten navigasjon.
   *
   *  Fanget i capture-fasen, før lenkens egen handler, som lar en
   *  `preventDefault` stå. Med modifikatortast eller midtklikk er det en ny fane
   *  leseren vil ha, og da får lenka gjøre jobben sin. */
  const onTopbarClick = useCallback(
    (event: React.MouseEvent) => {
      const link = (event.target as Element).closest("a");
      if (!link || link.getAttribute("href") !== "/") return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      goHome();
    },
    [goHome],
  );

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
      <header className={s.topbar} onClickCapture={onTopbarClick}>
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
          <div className={s.searchRow}>
            <input
              ref={searchRef}
              className="input"
              type="search"
              placeholder={t.search}
              aria-label={t.searchLabel}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <LocateToggle state={geo.state} onToggle={geo.toggle} t={t} variant="side" />
          </div>

          {/* Graden som navngitte knapper med fargeprikken fra kartet. Før sto
              det «1 2 3 4», og ingenting på sida sa hva tallene — eller
              prikkfargene på kartet — betydde. Nå er filteret også
              tegnforklaringen. */}
          <div className={s.gradeChips} role="group" aria-label={t.gradeGroup}>
            {/* Av/på-knapper, og ingen valgt betyr alle. En egen «Alle»-knapp
                presset den siste graden ned på en ny linje i et 372px-panel. */}
            {GRADE_FILTERS.map((g) => (
              <button
                type="button"
                key={g}
                className={s.gradeChip}
                aria-pressed={grade === g}
                onClick={() => setGrade((current) => (current === g ? 0 : g))}
              >
                <span className={s.dot} style={{ background: GRADE_COLORS[g - 1] }} aria-hidden="true" />
                {t.grades[g]}
              </button>
            ))}
          </div>

          {/* Resten av filtrene bak én knapp. De fire nedtrekkslistene tok tre
              rader — rundt 150px — over lista på hver skjerm, også for den som
              bare ville søke. Knappen sier hvor mange som står på, og brikkene
              under viser hvilke, så ingenting er skjult uten at det synes. */}
          <div className={s.moreRow}>
            <button
              type="button"
              className={s.moreBtn}
              aria-expanded={moreOpen}
              aria-controls="kart-flere-filtre"
              onClick={() => setMoreOpen((open) => !open)}
            >
              <SlidersHorizontal size={15} strokeWidth={1.5} aria-hidden="true" />
              {t.moreFilters}
              {activeExtras.length ? <span className={s.moreCount}>{activeExtras.length}</span> : null}
              <ChevronDown className={s.moreChevron} size={15} strokeWidth={1.5} aria-hidden="true" />
            </button>
            {filtered ? (
              <button type="button" className={s.reset} onClick={resetFilters}>
                {t.resetFilters}
              </button>
            ) : null}
          </div>

          <div id="kart-flere-filtre" className={s.moreGrid} hidden={!moreOpen}>
            <label className={s.field}>
              <span>{t.regionLabel}</span>
              <select className="input" value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">{t.allRegions}</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.field}>
              <span>{t.aspectFilterLabel}</span>
              <select
                className="input"
                value={aspect}
                onChange={(e) => setAspect(e.target.value as AspectSector | "")}
              >
                <option value="">{t.allAspects}</option>
                {ASPECT_SECTORS.map((a) => (
                  <option key={a} value={a}>
                    {t.aspectSectors[a]}
                  </option>
                ))}
              </select>
            </label>
            <label className={s.field}>
              <span>{t.verticalFilterLabel}</span>
              <select
                className="input"
                value={vertical}
                onChange={(e) => setVertical(e.target.value as VerticalBand | "")}
              >
                <option value="">{t.allVertical}</option>
                {VERTICAL_BANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {t.verticalBands[b.id]}
                  </option>
                ))}
              </select>
            </label>
            {markMap ? (
              <label className={s.field}>
                <span>{m.filterLabel}</span>
                <select
                  className="input"
                  value={mine}
                  onChange={(e) => setMine(e.target.value as typeof mine)}
                >
                  <option value="">{m.filterAll}</option>
                  <option value="favorites">{m.filterFavorites}</option>
                  <option value="done">{m.filterDone}</option>
                  <option value="notDone">{m.filterNotDone}</option>
                </select>
              </label>
            ) : null}
          </div>

          {!moreOpen && activeExtras.length ? (
            <ul className={s.activeChips}>
              {activeExtras.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    className={s.activeChip}
                    aria-label={t.removeFilter(chip.label)}
                    onClick={chip.clear}
                  >
                    {chip.label}
                    <X size={13} strokeWidth={2} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <div
            className={s.count}
            title={!distances && sortedByPopularity ? t.sortedByPopularityHint : undefined}
          >
            {rows.length} {rows.length === 1 ? t.tour : t.tours} ·{" "}
            {geoMessage(geo.state, t) ??
              (distances ? t.sortedByDistance : sortedByPopularity ? t.sortedByPopularity : t.approx)}
          </div>
        </div>

        <div className={s.list}>
          {listed.length === 0 ? (
            <div className={s.empty}>
              <p>{t.noMatches}</p>
              <button type="button" className="btn btn-secondary" onClick={resetFilters}>
                {t.resetFilters}
              </button>
            </div>
          ) : null}
          {listed.map((tour) => (
            <button
              type="button"
              key={tour.slug}
              className={`${s.tour}${selectedSlug === tour.slug ? ` ${s.sel}` : ""}`}
              onClick={() => openTour(tour.slug)}
            >
              <h3>
                <span>
                  <CapsText>{tour.name}</CapsText>
                  {markMap?.get(tour.slug)?.favorite ? (
                    <Star
                      className={s.markBadge}
                      size={13}
                      strokeWidth={1.5}
                      fill="currentColor"
                      aria-label={m.badgeFavorite}
                    />
                  ) : null}
                  {markMap?.get(tour.slug)?.doneOn ? (
                    <Check className={s.markBadge} size={14} strokeWidth={2.5} aria-label={m.badgeDone} />
                  ) : null}
                </span>
                <span className={s.moh}>
                  {tour.summitM} {t.moh}
                </span>
              </h3>
              <TourMeta
                tour={tour}
                t={t}
                distance={distances ? formatDistance(distances.get(tour.slug)!, lang) : undefined}
              />
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
              <h2 className={s.dTitle}>
                <CapsText>{selected.name}</CapsText>
              </h2>
              <TourMeta tour={selected} t={t} showSummit />
            </div>

            <div className={s.dBody}>
              {photos[selected.slug] ? (
                <PeakPhoto
                  key={`foto-${selected.slug}`}
                  photo={photos[selected.slug]}
                  peak={selected.name}
                  lang={lang}
                />
              ) : null}
              <p className={s.teaser}>{selected.teaser}</p>

              <div className={s.stats}>
                <div className={s.stat}>
                  <div className={s.statL}>
                    <CapsText>{t.stHm}</CapsText>
                  </div>
                  <div className={s.statV}>↑ {selected.verticalM} m</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statL}>
                    <CapsText>{t.stTime}</CapsText>
                  </div>
                  <div className={s.statV}>{selected.duration}</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statL}>
                    <CapsText>{t.stGrade}</CapsText>
                  </div>
                  <div className={s.statV}>{t.grades[selected.grade]}</div>
                </div>
                <div className={s.stat}>
                  <div className={s.statL}>
                    <CapsText>{t.stAsp}</CapsText>
                  </div>
                  <div className={s.statV}>{selected.aspect}</div>
                </div>
                <div className={`${s.stat} ${s.statWide}`}>
                  <div className={s.statL}>
                    <CapsText>{t.stSea}</CapsText>
                  </div>
                  <div className={s.statV}>{selected.season}</div>
                </div>
              </div>

              {/* Guiden er det panelet peker videre til, så den står rett under
                  tallene — ikke etter vær og skredvarsel. */}
              {selected.hasGuide ? (
                <Link
                  className={`btn btn-primary ${s.guideLink}`}
                  href={`/tur/${selected.slug}`}
                  style={PRIMARY_LINK}
                >
                  {t.openGuide} →
                </Link>
              ) : (
                <p className={s.pending}>{t.guidePending}</p>
              )}

              <div className={s.marks}>
                <MarkButtons
                  slug={selected.slug}
                  lang={lang}
                  state={marks.state}
                  failed={marks.failed}
                  onChange={marks.update}
                />
              </div>

              {routes.length > 1 ? (
                <div className={s.routes}>
                  <div className={s.routesHead}>
                    <CapsText>{t.routesLabel}</CapsText>
                  </div>
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

              {/* `key` er ikke pynt: den gjør at panelet lages på nytt når
                  leseren bytter topp, slik at forrige topps faregrad aldri
                  rekker å stå under det nye navnet. */}
              <AvalanchePanel key={selected.slug} slug={selected.slug} lang={lang} />
              <WeatherPanel
                key={`vaer-${selected.slug}`}
                slug={selected.slug}
                lat={selected.lat}
                lng={selected.lng}
                lang={lang}
                className={s.avalanche}
              />

              <p className={s.schematic}>{t.schematicNote}</p>
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
            position={position}
            lang={lang}
            homeSignal={homeSignal}
          />
        </Suspense>
        {/* Søket rett på kartet, på telefon. Før måtte man vite at «Vis liste»
            var veien til søkefeltet. `flushSync` gjør at lista er synlig før
            `focus()`: iOS åpner bare tastaturet for et felt som fokuseres i
            selve trykket, og et skjult felt kan ikke fokuseres. */}
        <button
          type="button"
          className={s.mapSearch}
          onClick={() => {
            flushSync(() => {
              setSelectedSlug(null);
              setMobilePane("list");
            });
            searchRef.current?.focus();
          }}
        >
          <Search size={16} strokeWidth={1.75} aria-hidden="true" />
          <span>{query.trim() || t.search}</span>
        </button>
        <div className={s.locateBox}>
          <LocateToggle state={geo.state} onToggle={geo.toggle} t={t} variant="map" />
          {geoMessage(geo.state, t) ? (
            <p className={s.locateMsg} role="status">
              {geoMessage(geo.state, t)}
            </p>
          ) : null}
        </div>
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
            <span className={s.peakBarText}>
              <span className={s.peakBarName}>
                <CapsText>{selected.name}</CapsText>
              </span>
              <GradeDot grade={selected.grade} t={t} />
            </span>
            <span className={s.peakBarCta}>{t.showInfo}</span>
          </button>
          {/* Rett til guiden herfra. Før gikk veien om «Vis info», panelet og
              en knapp lenger ned i det — fire trykk fra fjellet man trykket på
              til guiden om det. */}
          {selected.hasGuide ? (
            <Link className={s.peakBarGuide} href={`/tur/${selected.slug}`}>
              {t.guideShort} →
            </Link>
          ) : null}
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
