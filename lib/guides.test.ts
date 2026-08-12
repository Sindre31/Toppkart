import { describe, expect, it } from "vitest";

import { GUIDES } from "@/lib/guides";
import { GUIDE_EN } from "@/lib/i18n/content";
import { TOURS, routeProfile } from "@/lib/tours";

/** The guide prose against the line it describes.
 *
 *  Every guide opens by stating what the tour is: so many metres of climbing
 *  over so many kilometres. Those two numbers are measurements of the drawn
 *  line, and they are the only numbers in the whole guide a reader meets before
 *  deciding whether to go — which makes them the ones least able to afford
 *  being stale.
 *
 *  They went stale anyway. When the router learned to follow mapped trails, it
 *  moved twenty-odd lines; some intros were rewritten with them and some were
 *  not, and the ones that were not kept the length the line used to have —
 *  Molden and Melshornet by about 300 metres. Nothing failed. `check_guides.py`
 *  reads a km figure as sourced if it lands within 150 m of *any* number in the
 *  research, and with hundreds of numbers in scope almost anything does, so the
 *  route's own length was in practice unchecked.
 *
 *  This is that check, tied to the one value it should have been tied to all
 *  along, and it runs in CI rather than in a script somebody has to remember.
 *  It is also now visible to readers: the figure on a tour page prints the
 *  line's real distance in its caption, directly under the prose.
 */

/** The first number followed by a `km` unit — the route's own length. */
function statedKm(intro: string): number | null {
  const m = intro.match(/(\d+)[.,](\d+)\s*km/);
  return m ? Number(`${m[1]}.${m[2]}`) : null;
}

/** Words that turn a climbing figure into something other than the total.
 *
 *  Rondslottet's intro says «de siste 240 høydemeterne går på en smal egg» —
 *  a true sentence about the last stretch, and not a claim about the tour's
 *  1283 metres. A check that cannot tell those apart reports the guide as
 *  wrong, which is the failure mode that gets checks switched off. */
const PARTIAL =
  /(\b(siste|første|øverste|nederste|last|first|final|top|upper|lower)\b|gjev frå seg|gir fra seg|giv(?:es|ing) back)[^.]{0,20}$/i;

/** The route's own climb, in either language.
 *
 *  Tolerates the thousands separator English writes and Norwegian does not:
 *  «1,272 metres of climbing» is one number, and reading it as 272 is how a
 *  correct guide gets reported as disagreeing with itself. */
function statedGain(intro: string): number | null {
  const re =
    /(\d{1,3}(?:[,  ]\d{3})+|\d{2,4})\s*(?:høgdemeter|høydemeter|(?:metres|meters|m) of climbing|vertical (?:metres|meters))/g;
  const totals: number[] = [];
  for (const m of intro.matchAll(re)) {
    if (PARTIAL.test(intro.slice(Math.max(0, m.index - 32), m.index))) continue;
    totals.push(Number(m[1].replace(/[,  ]/g, "")));
  }
  /* The largest of what is left. A climbing figure in an intro is either the
     tour's total or some smaller part of it, so the total is the maximum — and
     taking the first match instead read Kjerag's 66-metre give-back as the
     whole climb. */
  return totals.length ? Math.max(...totals) : null;
}

const GUIDED = TOURS.filter((tour) => GUIDES[tour.slug]);

describe("the guide intros", () => {
  it("covers every tour that claims to have a guide", () => {
    for (const tour of TOURS.filter((t) => t.hasGuide)) {
      expect(GUIDES[tour.slug], tour.slug).toBeTruthy();
      expect(GUIDE_EN[tour.slug], `${tour.slug} (en)`).toBeTruthy();
    }
  });

  it("states the distance the line actually is", () => {
    /* Two centimetres of a kilometre either way — the rounding in «3,31 km»
       and nothing more. */
    for (const tour of GUIDED) {
      const km = routeProfile(tour)!.distanceM / 1000;
      for (const [lang, intro] of [
        ["no", GUIDES[tour.slug].intro],
        ["en", GUIDE_EN[tour.slug]?.intro],
      ] as const) {
        if (!intro) continue;
        const stated = statedKm(intro);
        if (stated === null) continue;
        expect(Math.abs(stated - km), `${tour.slug} [${lang}] says ${stated} km, line is ${km}`)
          .toBeLessThanOrEqual(0.011);
      }
    }
  });

  it("states the climb the line actually has", () => {
    /* Looser than the distance, and deliberately: an intro may quote the card's
       rounded `verticalM` rather than the line's exact `gainM`, and those two
       are allowed to differ by a few metres. What this catches is the drift a
       re-route leaves behind, which was 14 to 23 metres. */
    for (const tour of GUIDED) {
      const gain = routeProfile(tour)!.gainM;
      for (const [lang, intro] of [
        ["no", GUIDES[tour.slug].intro],
        ["en", GUIDE_EN[tour.slug]?.intro],
      ] as const) {
        if (!intro) continue;
        const stated = statedGain(intro);
        if (stated === null) continue;
        expect(
          Math.abs(stated - gain),
          `${tour.slug} [${lang}] says ${stated} m, line gains ${gain} m`,
        ).toBeLessThan(4);
      }
    }
  });

  it("says the same numbers in both languages", () => {
    /* The two halves are written by different passes and drift apart the same
       way the prose drifted from the line. Comparing the opening figures is
       cheap and catches the case where one language is corrected and the other
       is forgotten. */
    for (const tour of GUIDED) {
      const en = GUIDE_EN[tour.slug]?.intro;
      if (!en) continue;
      const no = GUIDES[tour.slug].intro;
      const a = statedKm(no);
      const b = statedKm(en);
      if (a !== null && b !== null) {
        expect(Math.abs(a - b), `${tour.slug} km: no=${a} en=${b}`).toBeLessThanOrEqual(0.011);
      }
      const ga = statedGain(no);
      const gb = statedGain(en);
      if (ga !== null && gb !== null) {
        expect(ga, `${tour.slug} gain: no=${ga} en=${gb}`).toBe(gb);
      }
    }
  });
});
