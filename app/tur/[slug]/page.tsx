import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";

import { Blueprint } from "@/components/Blueprint";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { ElevationProfile } from "@/components/guide/ElevationProfile";
import { GuideSections } from "@/components/guide/GuideSections";
import { LockedGuide } from "@/components/guide/LockedGuide";
import { getViewer } from "@/lib/access";
import { GRADE_LABELS, getGuide, guideSlugs } from "@/lib/guides";
import { getTour } from "@/lib/tours";
import styles from "./guide.module.css";

/** Turguiden. Kart, nøkkeltall og høydeprofil er åpne for alle; rute-
 *  beskrivelse, nedkjøring, skredterreng og GPX ligger bak abonnement
 *  (`getViewer().hasAccess`). */

export function generateStaticParams(): { slug: string }[] {
  return guideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) return { title: "Turen finnes ikke" };
  return {
    title: `${tour.name}, ${tour.region}`,
    description: getGuide(slug)?.intro ?? tour.teaser,
  };
}

export default async function TourGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = getTour(slug);
  if (!tour) notFound();

  const guide = getGuide(slug);
  const { hasAccess } = await getViewer();
  const mapHref = `/kart?tur=${tour.slug}`;

  const stats: { label: string; value: string }[] = [
    { label: "Topp", value: `${tour.summitM} moh` },
    { label: "Høydemeter", value: `↑ ${tour.verticalM} m` },
    { label: "Normaltid", value: tour.duration },
    { label: "Grad", value: GRADE_LABELS[tour.grade] },
    { label: "Himmelretning", value: tour.aspect },
  ];

  return (
    <div className="shell">
      <SiteNav>
        <Link href="/kart">Kartet</Link>
        <Link className="nav-muted" href="/min-side">
          Min side
        </Link>
      </SiteNav>

      <main className="page page-narrow" style={{ paddingBottom: 64 }}>
        <header style={{ padding: "48px 0 32px" }}>
          <Link href={mapHref} style={{ fontSize: 13, textDecoration: "none" }}>
            ← Tilbake til kartet
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 20, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--color-accent-700)",
              }}
            >
              {tour.region}
            </span>
            <span
              className="tag tag-accent"
              style={{ letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}
            >
              {GRADE_LABELS[tour.grade]}
            </span>
            <span className="tag tag-neutral" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Sesong {tour.season}
            </span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(44px, 6vw, 76px)", margin: "10px 0 0 -0.052em" }}>
            {tour.name}
          </h1>
          <p className="lede" style={{ margin: "18px 0 0" }}>
            {guide?.intro ?? tour.teaser}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            {hasAccess ? (
              <a className="btn btn-primary" href={`/api/gpx/${tour.slug}`} download={`${tour.slug}.gpx`}>
                Last ned GPX
              </a>
            ) : (
              /* Uten abonnement er nedlastingen stengt både her og i API-et —
                 knappen leder dit tilgangen kjøpes. */
              <Link
                className="btn btn-secondary"
                href="/betaling"
                aria-label="Last ned GPX — krever abonnement"
                title="Krever abonnement"
              >
                <Lock size={14} strokeWidth={1.5} />
                Last ned GPX
              </Link>
            )}
            <Link className="btn btn-secondary" href={mapHref}>
              Åpne i kartet
            </Link>
          </div>
        </header>

        <section style={{ padding: "0 0 40px" }}>
          <Blueprint>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid var(--color-divider)",
                    borderBottom: "1px solid var(--color-divider)",
                  }}
                >
                  <div className="stat-l">{s.label}</div>
                  <div className="stat-v" style={{ fontSize: 24 }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </Blueprint>
        </section>

        <section className={styles.split}>
          <Blueprint as="figure" className="duotone" style={{ margin: 0 }}>
            <Image
              src="/assets/kontur.png"
              alt={`Skjematisk kartutsnitt av ruta opp ${tour.name}`}
              width={1500}
              height={1000}
              priority
              style={{ width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover" }}
            />
            <figcaption style={{ padding: "8px 2px 0" }}>
              Skjematisk kartutsnitt i prototypen — <Link href={mapHref}>se turen i kartet</Link>.
            </figcaption>
          </Blueprint>

          {guide ? (
            <ElevationProfile profile={guide.elevationProfile} />
          ) : (
            <Blueprint style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: 18, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 12px" }}>
                Turguide
              </h2>
              <p className="note" style={{ margin: 0 }}>
                Turguiden for denne toppen er under arbeid.
              </p>
            </Blueprint>
          )}
        </section>

        {guide && (hasAccess ? <GuideSections guide={guide} /> : <LockedGuide />)}

        <SiteFooter>
          <span className="push">Eksempelinnhold i prototypen — ikke en reell turbeskrivelse.</span>
        </SiteFooter>
      </main>
    </div>
  );
}
