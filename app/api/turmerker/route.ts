import { NextResponse } from "next/server";

import { getIdentity } from "@/lib/access";
import { getMarks, saveMark } from "@/lib/marks";
import { parseMarkRequest } from "@/lib/tour-marks";
import { getTour } from "@/lib/tours";

/** GET  /api/turmerker — leserens favoritter og gåtte turer.
 *  POST /api/turmerker — `{ slug, favorite?, done? }`, én endring om gangen.
 *
 *  Personlige data, så ingenting her bufres: `private, no-store` på begge.
 *
 *  GET svarer 200 også utlogget, med `signedIn: false` og en tom liste —
 *  kartet spør uansett, og knappene skal vite at de skal sende til innlogging
 *  i stedet for å lagre. POST krever innlogging (401), en tur vi har (400), og
 *  svarer 503 når databasen ikke tar imot, så knappen kan si fra i stedet for
 *  å vise en endring som ikke ble lagret. */

const PRIVATE = { "cache-control": "private, no-store" };

export async function GET() {
  const identity = await getIdentity();
  if (!identity.userId) {
    return NextResponse.json({ signedIn: false, marks: [] }, { headers: PRIVATE });
  }
  try {
    const marks = await getMarks(identity);
    return NextResponse.json({ signedIn: true, marks }, { headers: PRIVATE });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: PRIVATE });
  }
}

export async function POST(request: Request) {
  const identity = await getIdentity();
  if (!identity.userId) {
    return NextResponse.json({ error: "not_signed_in" }, { status: 401, headers: PRIVATE });
  }

  const req = parseMarkRequest(await request.json().catch(() => null));
  if (!req || !getTour(req.slug)) {
    return NextResponse.json({ error: "bad_request" }, { status: 400, headers: PRIVATE });
  }

  try {
    const { slug, ...patch } = req;
    const mark = await saveMark(identity, slug, patch);
    return NextResponse.json({ slug, mark }, { headers: PRIVATE });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: PRIVATE });
  }
}
