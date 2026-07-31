import { NextResponse } from "next/server";
import { getAvalancheForecast } from "@/lib/avalanche";
import { toLang } from "@/lib/i18n";
import { getTour } from "@/lib/tours";

/** GET /api/skredvarsel?tur=<slug>&lang=<no|en> — today's Varsom danger level.
 *
 *  Takes a slug rather than a coordinate on purpose. The map is a client
 *  component, so this is called from the browser; accepting `lat`/`lng` there
 *  would let anyone use the site as an open proxy to Varsom for arbitrary
 *  points. A slug can only resolve to one of the 24 peaks we ship.
 *
 *  Answers 200 with a state even when Varsom is unreachable — the panel says
 *  «kunne ikke hentes» rather than the caller having to interpret a status
 *  code. The only 400 is a slug that is not ours.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tour = getTour(url.searchParams.get("tur") ?? "");
  if (!tour) {
    return NextResponse.json({ error: "unknown_tour" }, { status: 400 });
  }

  const lang = toLang(url.searchParams.get("lang"));
  const forecast = await getAvalancheForecast(tour.lat, tour.lng, lang);

  return NextResponse.json(forecast, {
    // Same window as the upstream fetch, so a CDN in front of us cannot serve
    // a forecast older than the one we were willing to cache ourselves.
    headers: { "cache-control": "public, max-age=0, s-maxage=1800" },
  });
}
