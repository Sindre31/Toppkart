import { NextResponse } from "next/server";

import { getViewer } from "@/lib/access";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { guideDict } from "@/lib/i18n/guide";
import { getTour, routeFor } from "@/lib/tours";
import type { Tour } from "@/lib/types";

/** GPX-nedlasting for én tur.
 *
 *  NB: Sporet som genereres her er den samme **skjematiske** rutelinja som
 *  kartet tegner (`routeFor`) — en illustrasjon, ikke en reell rute. I
 *  produksjon serveres ekte, innspilt GPX fra Supabase Storage (`gpx_path` på
 *  `tours`), signert per forespørsel etter samme tilgangssjekk som under.
 *  Ingen skal navigere etter denne fila i felt.
 *
 *  Gaten er serverside: uten aktivt abonnement eller prøveperiode sendes du
 *  til /betaling, slik at fila aldri kan hentes ved å gjette URL-en.
 *
 *  The strings inside the file follow the reader's language: the description
 *  and the summit waypoint type are read in whatever GPS app the file is opened
 *  in, so they are localised like any other user-visible copy. The filename and
 *  the geometry stay language-neutral.
 */

function xml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildGpx(tour: Tour, lang: Lang): string {
  const t = guideDict(lang);
  const points = routeFor(tour);
  const base = tour.summitM - tour.verticalM;
  const last = Math.max(points.length - 1, 1);

  const trkpts = points
    .map(([lat, lng], i) => {
      const ele = Math.round(base + (tour.summitM - base) * (i / last));
      return `      <trkpt lat="${lat.toFixed(6)}" lon="${lng.toFixed(6)}"><ele>${ele}</ele></trkpt>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Toppkart" xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${xml(tour.name)}</name>
    <desc>${xml(t.gpxDesc(tour.name, tour.region))}</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <wpt lat="${tour.lat.toFixed(6)}" lon="${tour.lng.toFixed(6)}">
    <ele>${tour.summitM}</ele>
    <name>${xml(tour.name)}</name>
    <type>${xml(t.gpxSummitType)}</type>
  </wpt>
  <trk>
    <name>${xml(tour.name)}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>
`;
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const tour = getTour(slug);
  if (!tour) {
    return new NextResponse(guideDict(lang).gpxNotFound, {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { hasAccess } = await getViewer();
  if (!hasAccess) {
    return NextResponse.redirect(new URL("/betaling", request.url), 303);
  }

  return new NextResponse(buildGpx(tour, lang), {
    status: 200,
    headers: {
      "Content-Type": "application/gpx+xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.gpx"`,
      "Cache-Control": "private, no-store",
    },
  });
}
