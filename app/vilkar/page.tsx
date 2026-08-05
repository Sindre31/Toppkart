import type { Metadata } from "next";

import { LegalDocument } from "@/components/LegalDocument";
import { getLang } from "@/lib/i18n/server";
import { legalDict } from "@/lib/i18n/legal";

export async function generateMetadata(): Promise<Metadata> {
  const t = legalDict(await getLang()).terms;
  return { title: t.metaTitle, description: t.metaDescription, alternates: { canonical: "/vilkar" } };
}

export default async function VilkarPage() {
  const lang = await getLang();
  return <LegalDocument lang={lang} doc={legalDict(lang).terms} />;
}
