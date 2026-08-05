"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Navigasjonslenkene, samlet bak én knapp på telefon.
 *
 *  Raden hadde vokst med hver lenke som ble lagt i den, og med «Turene» kom den
 *  over grensa overalt: 438px innhold mot 390px skjerm på en iPhone 15, mot
 *  360px på de vanligste Android-ene, mot 430px på den største iPhonen som
 *  finnes. Den var altså for lang på hver eneste telefon, ikke bare på de
 *  smale. Å stramme padding og skriftstørrelse enda et hakk — som er det som er
 *  gjort de to forrige gangene raden ble for lang — kjøper tjue piksler av de
 *  førtiåtte, og gjør det på bekostning av trykkflatene.
 *
 *  Her forsvinner problemet i stedet for å bli utsatt: raden holder merket,
 *  denne knappen og språkvelgeren, og *slutter å vokse med antall lenker*. Det
 *  som ligger i menyen kan bli så mange lenker det vil.
 *
 *  På skjermer over 620px finnes ikke knappen. Der løser `display: contents`
 *  opp både denne innpakningen og panelet, slik at lenkene er flex-elementer i
 *  navigasjonsraden akkurat som før — samme DOM, samme rad, ingen kopi av
 *  markupen som kan drive fra hverandre.
 */
export function NavMenu({
  label,
  closeLabel,
  children,
}: {
  label: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  /* Escape og trykk utenfor. En meny som bare kan lukkes med knappen den ble
     åpnet med er den vanligste måten en slik panel blir stående i veien. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="nav-menu" ref={root} data-open={open || undefined}>
      <button
        type="button"
        className="btn btn-secondary btn-icon nav-menu-toggle"
        aria-expanded={open}
        aria-controls="nav-menu-panel"
        aria-label={open ? closeLabel : label}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        {open ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
      </button>

      {/* Et trykk i panelet er enten en lenke eller ved siden av en. Begge deler
          betyr at menyen har gjort jobben sin: en klientnavigasjon lar dette
          treet stå, så uten dette blir panelet liggende åpent over den nye
          sida. */}
      <div className="nav-menu-panel" id="nav-menu-panel" onClick={() => setOpen(false)}>
        {children}
      </div>
    </div>
  );
}
