"use server";

import { revalidatePath } from "next/cache";

import { assertAdminAction } from "@/lib/admin";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

/** Mark one message handled, or put it back.
 *
 *  A Server Action driven by a plain `<form>`, so the buttons work without any
 *  client JavaScript — the same shape as the sign-out form on Min side.
 *
 *  `assertAdminAction()` runs here rather than relying on the page's gate: an
 *  action is its own endpoint, and a POST to it never passes through the page
 *  that rendered the form.
 */
export async function setHandled(formData: FormData): Promise<void> {
  await assertAdminAction();

  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Mangler id.");

  /* The form sends the state it wants, not a toggle. Two people with the page
     open would otherwise flip each other's change: a toggle applies whatever
     the row was when the page was rendered, which may no longer be true. */
  const handled = formData.get("handled") === "1";

  const admin = getSupabaseAdminClient();
  if (!admin) throw new Error("Supabase er ikke konfigurert.");

  const { error } = await admin
    .from("tk_feedback")
    .update({ handled_at: handled ? new Date().toISOString() : null })
    .eq("id", id);

  if (error) {
    console.error("[admin/tilbakemeldinger] kunne ikke oppdatere status:", error.message);
    throw new Error("Klarte ikke å lagre statusen.");
  }

  revalidatePath("/admin/tilbakemeldinger");
}
