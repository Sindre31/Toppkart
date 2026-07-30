"use client";

/** `/kart` — the core of the product. React port of `design-reference/kart.html`:
 *  56px topbar, 372px tour list on the left, full-bleed Leaflet map on the right,
 *  the shared NO/EN switcher, and a detail panel that draws the tour's ascent
 *  line. The language arrives as a prop from the server, which reads the
 *  `tk_lang` cookie — it is never local state. Switching refetches this route
 *  rather than navigating, so the filters, the selected tour and the live
 *  Leaflet instance all survive the change. */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Check, Lock, Unlock } from "lucide-react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GRADE_COLORS } from "@/lib/config";
import { REGIONS, TOURS } from "@/lib/tours";
import type { Lang } from "@/lib/i18n";
import { localizeTours } from "@/lib/i18n/content";
import { mapDict, type Dict } from "@/lib/i18n/map";
import type { Grade, Tour } from "@/lib/types";
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
  initialSlug,
}: {
  lang: Lang;
  hasAccess: boolean;
  initialSlug: string | null;
}) {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState(0);
  const [region, setRegion] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug);
  const detailRef = useRef<HTMLDivElement>(null);

  const t = mapDict(lang);

  /* Teaser, aspect, season and duration come out translated; peak and region
     names are proper nouns and stay Norwegian, so search and the region filter
     keep matching what the map shows. */
  const tours = useMemo(() => localizeTours(TOURS, lang), [lang]);

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

  /* Deep link both ways: `/kart?tur=<slug>` opens a tour, and selecting one
     rewrites the URL so the guide page can link straight back in. */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedSlug) url.searchParams.set("tur", selectedSlug);
    else url.searchParams.delete("tur");
    window.history.replaceState(window.history.state, "", url);
  }, [selectedSlug]);

  useEffect(() => {
    if (selectedSlug && detailRef.current) detailRef.current.scrollTop = 0;
  }, [selectedSlug]);

  const openTour = useCallback((slug: string) => setSelectedSlug(slug), []);

  return (
    <div className={s.page}>
      <header className={s.topbar}>
        <Link className={s.brand} href="/">
          Toppkart
        </Link>
        <Link className={s.loginLink} href="/logg-inn">
          {t.login}
        </Link>
        <Link className="btn btn-primary" href="/betaling" style={PRIMARY_LINK}>
          {t.trial}
        </Link>
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
              {REGIONS.map((r) => (
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

              {selected.hasGuide ? (
                <Link className={`btn btn-secondary ${s.guideLink}`} href={`/tur/${selected.slug}`}>
                  {t.openGuide} →
                </Link>
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
            onSelect={openTour}
            lang={lang}
          />
        </Suspense>
      </div>
    </div>
  );
}
