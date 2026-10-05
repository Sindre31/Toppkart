import { NextResponse } from "next/server";
import { getTour } from "@/lib/tours";
import { getWeatherForecast } from "@/lib/weather";

/** GET /api/vaer?tur=<slug> — MET Norways varsel for toppen, oppsummert.
 *
 *  Tar en slug og ikke en koordinat, av samme grunn som `/api/skredvarsel`:
 *  kallet kommer fra nettleseren, og `lat`/`lon` i adressen ville gjort sida
 *  til en åpen mellomstasjon mot api.met.no under vår `User-Agent`. En slug kan
 *  bare bli en av toppene vi har.
 *
 *  Svaret er språknøytralt — symbolkoder og tall. Panelet gjør dem til tekst,
 *  så det samme svaret kan bufres for begge språk.
 *
 *  Svarer 200 med `state: "unavailable"` når MET ikke svarer; panelet sier det
 *  selv. Den eneste 400-en er en slug som ikke er vår. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const tour = getTour(url.searchParams.get("tur") ?? "");
  if (!tour) {
    return NextResponse.json({ error: "unknown_tour" }, { status: 400 });
  }

  const forecast = await getWeatherForecast(tour.lat, tour.lng, tour.summitM);

  return NextResponse.json(forecast, {
    // Samme vindu som hentingen mot MET, så en CDN foran oss ikke kan servere
    // et varsel eldre enn det vi selv var villige til å holde på.
    headers: { "cache-control": "public, max-age=0, s-maxage=1800" },
  });
}
