"use client";

import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

import f from "./FilterSelect.module.css";

export type FilterOption<V extends string> = { value: V; label: string };

/** Nedtrekkslistene i kartpanelet — region, himmelretning, høydemeter og egne turer.
 *
 *  De var native `<select>`: pillen kunne styles, men lista som åpnet seg var
 *  operativsystemets, grå og i systemfonten, midt i et panel som ellers er papir,
 *  serif og plomme. Her er lista vår egen og ser ut som resten av sida: et kort
 *  under pillen på store skjermer, et ark nedenfra på telefon.
 *
 *  Tastaturet oppfører seg som en vanlig listeboks (WAI-ARIA «select-only
 *  combobox»): piltastene og Home/End flytter, Enter og mellomrom velger,
 *  Escape og Tab lukker, og en bokstav hopper til første valg som begynner
 *  på den.
 *
 *  Arket på telefon rendres i `document.body`. Panelet er en egen stablingskontekst
 *  (z-index 1100), og inne i den ville arket havnet under bryteren «Kart/Liste»
 *  og tilbakemeldingsknappen (1300) uansett hvor høy z-index det fikk.
 */
export function FilterSelect<V extends string>({
  label,
  value,
  options,
  onChange,
  strong = false,
}: {
  /** Tilgjengelig navn, og overskriften på arket på telefon. */
  label: string;
  value: V;
  /** Første valg er «alle» — det som gjør at filteret ikke er satt. */
  options: readonly FilterOption<V>[];
  onChange: (value: V) => void;
  /** Regionen står som gradbrikkene; de andre er dempet til de settes. */
  strong?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [alignEnd, setAlignEnd] = useState(false);
  const sheet = useSheet();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const id = useId();

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const selected = options[selectedIndex];
  const isSet = selectedIndex > 0;

  const openList = useCallback(() => {
    setActive(selectedIndex);
    // Kortet åpner mot høyre når det er plass, ellers mot venstre fra pillens høyrekant.
    const box = button.current?.getBoundingClientRect();
    const panel = button.current?.closest("aside")?.getBoundingClientRect();
    if (box) setAlignEnd(box.left + 240 > (panel?.right ?? window.innerWidth) - 12);
    setOpen(true);
  }, [selectedIndex]);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) button.current?.focus();
  }, []);

  const choose = useCallback(
    (index: number) => {
      onChange(options[index].value);
      close(true);
    },
    [onChange, options, close],
  );

  // Trykk utenfor lukker. På telefon dekker bakteppet resten, så det gjelder kortet.
  useEffect(() => {
    if (!open || sheet) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, sheet, close]);

  // Fokus inn i lista når den åpner, og det aktive valget i bildet når lista ruller.
  useEffect(() => {
    if (open) list.current?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openList();
    }
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const last = options.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        return;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        return;
      case "Home":
        event.preventDefault();
        setActive(0);
        return;
      case "End":
        event.preventDefault();
        setActive(last);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        return;
      case "Escape":
        event.preventDefault();
        close(true);
        return;
      case "Tab":
        close(false);
        return;
    }
    if (event.key.length === 1 && /\S/.test(event.key)) {
      const key = event.key.toLocaleLowerCase();
      const order = [...options.slice(active + 1), ...options.slice(0, active + 1)];
      const hit = order.find((o) => o.label.toLocaleLowerCase().startsWith(key));
      if (hit) setActive(options.indexOf(hit));
    }
  };

  const listbox = (
    <ul
      ref={list}
      id={`${id}-list`}
      role="listbox"
      aria-label={label}
      tabIndex={-1}
      aria-activedescendant={`${id}-${active}`}
      className={f.list}
      onKeyDown={onListKeyDown}
    >
      {options.map((option, index) => (
        <li
          key={option.value || "all"}
          id={`${id}-${index}`}
          data-index={index}
          role="option"
          aria-selected={index === selectedIndex}
          data-active={index === active || undefined}
          className={f.option}
          onPointerMove={() => setActive(index)}
          onClick={() => choose(index)}
        >
          <span>{option.label}</span>
          {index === selectedIndex ? <Check size={16} strokeWidth={2} aria-hidden="true" /> : null}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={f.root} ref={root} data-strong={strong || undefined}>
      <button
        ref={button}
        type="button"
        className={f.pill}
        data-strong={strong || undefined}
        data-on={isSet || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={`${label}: ${selected.label}`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onButtonKeyDown}
      >
        <span className={f.pillLabel}>{selected.label}</span>
        <ChevronDown className={f.chevron} size={14} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && !sheet ? (
        <div className={f.popover} data-align={alignEnd ? "end" : "start"}>
          {listbox}
        </div>
      ) : null}

      {open && sheet
        ? createPortal(
            <div className={f.backdrop} onClick={() => close(true)}>
              <div className={f.sheet} onClick={(event) => event.stopPropagation()}>
                <div className={f.sheetHead}>
                  <span className={f.sheetGrip} aria-hidden="true" />
                  <span className={f.sheetTitle}>{label}</span>
                </div>
                {listbox}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

/** Telefonbredde — samme grense som kartsidas eget oppsett. */
const SHEET_QUERY = "(max-width: 760px)";

function useSheet(): boolean {
  const [sheet, setSheet] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(SHEET_QUERY);
    const update = () => setSheet(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return sheet;
}
