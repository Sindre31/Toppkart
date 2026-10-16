import type { Lang } from "@/lib/i18n";
import { photoDict } from "@/lib/i18n/photos";
import type { PeakPhoto as Photo } from "@/lib/peak-photos";

/** Et bilde av toppen, med fotograf og lisens under.
 *
 *  Bildene er fra Wikimedia Commons under frie lisenser, og alle krever at
 *  opphavet står ved bildet — ikke i en bunntekst et annet sted. Lenka går til
 *  bildets side på Commons, der full lisens og originalen ligger.
 *
 *  Vanlig `<img>` og ikke `next/image`: Commons leverer allerede miniatyren i
 *  bredden vi ber om, og en optimaliserer foran ville bare hentet den samme fila
 *  en gang til. Høyde og bredde står på elementet, så sida ikke hopper når
 *  bildet kommer. */
export function PeakPhoto({
  photo,
  peak,
  lang,
  aspect = "16 / 9",
  priority = false,
  className,
}: {
  photo: Photo;
  peak: string;
  lang: Lang;
  /** Utsnittet bildet beskjæres til. */
  aspect?: string;
  /** Øverst på sida: last med en gang, ikke når det rulles fram. */
  priority?: boolean;
  className?: string;
}) {
  const t = photoDict(lang);
  return (
    <figure className={className} style={{ margin: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={t.alt(peak)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          aspectRatio: aspect,
          objectFit: "cover",
          background: "var(--color-divider)",
        }}
      />
      <figcaption className="note" style={{ margin: "6px 0 0", fontSize: 11 }}>
        {photo.author ? `${t.by}: ${photo.author} · ` : null}
        {photo.licenseUrl ? (
          <a href={photo.licenseUrl} rel="license noopener" target="_blank">
            {photo.license}
          </a>
        ) : (
          photo.license
        )}{" "}
        ·{" "}
        <a href={photo.page} rel="noopener" target="_blank">
          {t.source}
        </a>
      </figcaption>
    </figure>
  );
}
