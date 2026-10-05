import { cookies } from "next/headers";

import { osloDate } from "@/lib/avalanche";
import { DEMO_COOKIE, isSupabaseConfigured } from "@/lib/config";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  applyMark,
  decodeDemoMarks,
  encodeDemoMarks,
  type MarkPatch,
  type TourMark,
} from "@/lib/tour-marks";
import type { Identity } from "@/lib/types";

/** Favoritter og gåtte turer, lest og skrevet for den innloggede leseren.
 *
 *  I live-modus går alt gjennom leserens egen Supabase-økt, ikke
 *  service-rollen: RLS på `tk_tour_marks` er det som sier at en leser bare når
 *  sine egne rader, og den skal være det som faktisk står i veien. I demomodus
 *  ligger markeringene i en informasjonskapsel, som resten av demoen.
 *
 *  Feil fra databasen kastes. Lesingen fanger dem selv der den brukes (en
 *  side uten markeringer er bedre enn en side som ikke rendres); skrivingen
 *  lar API-ruta svare 503, så knappen kan si at det ikke ble lagret. */

interface Row {
  slug: string;
  favorite: boolean;
  done_on: string | null;
}

const fromRow = (r: Row): TourMark => ({ slug: r.slug, favorite: r.favorite, doneOn: r.done_on });

export async function getMarks(identity: Identity): Promise<TourMark[]> {
  if (!identity.userId) return [];

  if (!isSupabaseConfigured) {
    const jar = await cookies();
    return decodeDemoMarks(jar.get(DEMO_COOKIE.marks)?.value);
  }

  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase!
    .from("tk_tour_marks")
    .select("slug, favorite, done_on")
    .eq("user_id", identity.userId);
  if (error) throw error;
  return (data as Row[]).map(fromRow);
}

/** Lagrer én endring og svarer med markeringen slik den nå er (null: borte). */
export async function saveMark(
  identity: Identity,
  slug: string,
  patch: MarkPatch,
  now: Date = new Date(),
): Promise<TourMark | null> {
  if (!identity.userId) throw new Error("not signed in");
  const today = osloDate(now);

  if (!isSupabaseConfigured) {
    const jar = await cookies();
    const marks = decodeDemoMarks(jar.get(DEMO_COOKIE.marks)?.value);
    const next = applyMark(
      marks.find((m) => m.slug === slug),
      slug,
      patch,
      today,
    );
    const rest = marks.filter((m) => m.slug !== slug);
    jar.set(DEMO_COOKIE.marks, encodeDemoMarks(next ? [...rest, next] : rest), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return next;
  }

  const supabase = (await getSupabaseServerClient())!;
  const { data: prevRow, error: readError } = await supabase
    .from("tk_tour_marks")
    .select("slug, favorite, done_on")
    .eq("user_id", identity.userId)
    .eq("slug", slug)
    .maybeSingle();
  if (readError) throw readError;

  const next = applyMark(prevRow ? fromRow(prevRow as Row) : undefined, slug, patch, today);
  if (!next) {
    const { error } = await supabase
      .from("tk_tour_marks")
      .delete()
      .eq("user_id", identity.userId)
      .eq("slug", slug);
    if (error) throw error;
    return null;
  }

  const { error } = await supabase.from("tk_tour_marks").upsert(
    {
      user_id: identity.userId,
      slug,
      favorite: next.favorite,
      done_on: next.doneOn,
      updated_at: now.toISOString(),
    },
    { onConflict: "user_id,slug" },
  );
  if (error) throw error;
  return next;
}
