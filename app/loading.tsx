/** Det leseren ser i det de trykker på en lenke.
 *
 *  Alle rutene her er dynamiske — de leser `tk_lang` og sesjonen — og en
 *  dynamisk rute uten en `loading`-grense blir ikke prefetchet i det hele tatt.
 *  Det var det som gjorde navigasjon treg å *se på*: hele runden til serveren
 *  lå mellom trykket og det første pikselet, og fram til da stod den gamle sida
 *  urørt igjen, som om trykket ikke hadde registrert seg.
 *
 *  Med denne fila hentes skallet på forhånd og tegnes umiddelbart, og sida
 *  strømmer inn i det. Den gjelder hver rute som ikke har sin egen; `/kart` har
 *  det, fordi kartet har en annen ramme enn resten.
 *
 *  Alt her må kunne bygges statisk, ellers er det ingenting å hente på forhånd:
 *  ingen `cookies()`, ingen sesjon, ingen ordbok. Ordmerket er det ene ordet som
 *  er det samme på begge språk, og derfor det ene som står her.
 */
export default function Loading() {
  return (
    <div className="shell" aria-hidden="true">
      <div className="skeleton-bar">
        <span className="skeleton-brand">Toppkart</span>
        <span className="skeleton-block" style={{ width: 56, height: 14 }} />
        <span className="skeleton-block" style={{ width: 44, height: 14 }} />
        <span className="skeleton-block" style={{ width: 70, height: 30 }} />
      </div>

      <main className="page skeleton-main">
        <span className="skeleton-block" style={{ width: 120, height: 13 }} />
        <span className="skeleton-block" style={{ width: "min(560px, 90%)", height: 52 }} />
        <span className="skeleton-block" style={{ width: "min(420px, 75%)", height: 52 }} />
        <span className="skeleton-block" style={{ width: "min(48ch, 90%)", height: 16, marginTop: 18 }} />
        <span className="skeleton-block" style={{ width: "min(42ch, 85%)", height: 16 }} />
      </main>
    </div>
  );
}
