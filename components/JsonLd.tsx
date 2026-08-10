/** Ett `<script type="application/ld+json">` med det objektet det får inn.
 *
 *  Strukturerte data er den ene delen av en side som ikke skrives for lesere:
 *  det er de samme opplysningene siden allerede viser, sagt en gang til i et
 *  format en søkerobot kan lese uten å gjette. Google leser det for å avgjøre
 *  *hva* en side handler om — her: at `/tur/slogen` er en artikkel om et fjell
 *  med koordinater og høyde, ikke bare en side med ordet «Slogen» på seg.
 *
 *  `dangerouslySetInnerHTML` er den eneste veien: React ville ellers rømt
 *  anførselstegnene i JSON-en, og en robot som venter JSON får `&quot;`.
 *  Til gjengjeld må vi selv gjøre det React ellers gjorde. Én tegnsekvens er
 *  farlig inne i et `<script>`, og det er `</script>` — nettleseren avslutter
 *  taggen der uansett hva JSON-syntaksen mener, og alt etter den leses som
 *  markup. Vi rømmer derfor hver `<` til `<`, som er lovlig JSON og betyr
 *  nøyaktig det samme tegnet for den som parser det. Det dekker `</script>` og
 *  `<!--` i samme slengen — begge må begynne med en `<`.
 *
 *  Objektene bygges i `lib/structured-data.ts`; her er det bare utskriften.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
