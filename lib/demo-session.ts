import { cookies } from "next/headers";
import { DEMO_COOKIE } from "@/lib/config";

/** Demo mode: the session Supabase would own, kept in an httpOnly cookie so
 *  the admin sign-in is walkable without keys. Live mode never reads this.
 *  Nothing here is a security boundary. */

export async function getDemoEmail(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(DEMO_COOKIE.session)?.value ?? null;
}

export async function setDemoEmail(email: string) {
  const jar = await cookies();
  jar.set(DEMO_COOKIE.session, email, {
    httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearDemoSession() {
  const jar = await cookies();
  jar.delete(DEMO_COOKIE.session);
}
