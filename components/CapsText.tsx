/** Tekst som settes med versaler, med Barlow Condenseds altfor brede store Ø strammet inn.
 *
 *  Skriften gir `Oslash` en bredde på 597 enheter mot 467 for `O` i SemiBold —
 *  0,13 em tomrom til høyre for en glyf som ikke er bredere enn en O — og
 *  familien har ingen kerningpar for tegnet i det hele tatt, så nettleseren har
 *  ingenting å rette det opp med. Siden hele designsystemet setter overskrifter
 *  i versaler, kommer «Jønshornet» ut som «JØ NSHORNET» og «Sunnmøre» som
 *  «SUNNMØ RE». Det ser ut som en skrivefeil i dataene, og er det ikke:
 *  `lib/tours.ts` inneholder ett tegn, U+00F8, og HTML-en serverer det samme.
 *
 *  Her pakkes hver ø inn så overskuddet kan tas tilbake i CSS. Bruk den overalt der
 *  en streng — fjellnavn, region eller fast etikett — havner i en versalsatt
 *  overskrift; «HØ YDEPROFIL» er den samme feilen som «JØ NSHORNET». Korreksjonen
 *  ligger på `.oslash` og gjelder bare der teksten faktisk settes med versaler —
 *  liten ø har bare 0,03 em å gå på, og skal ikke røres.
 *
 *  Alternativet var å hoste en rettet skriftfil selv. Det er en større endring
 *  enn feilen fortjener: `next/font` henter Barlow ved bygging, og det er en
 *  avgjørelse som står for seg selv.
 */

const SPLIT_OSLASH = /([øØ])/;

export function CapsText({ children }: { children: string }) {
  const parts = children.split(SPLIT_OSLASH);
  if (parts.length === 1) return <>{children}</>;
  return (
    <>
      {parts.map((part, i) =>
        part === "ø" || part === "Ø" ? (
          <span className="oslash" key={i}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
