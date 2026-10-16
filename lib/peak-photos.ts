/** Oppslag i bildene av toppene (`lib/photos.ts`, generert).
 *
 *  Commons lager miniatyrer i den bredden man ber om, ved å bytte tallet i
 *  adressa. Kartpanelet trenger bare en liten. */

import { PHOTOS, type PeakPhoto } from "./photos";

export type { PeakPhoto };

export function photoFor(slug: string): PeakPhoto | undefined {
  return PHOTOS[slug];
}

/** Den samme miniatyren i en annen bredde. Adresser uten bredde — originaler
 *  som allerede er smalere enn det vi ba om — kommer tilbake uendret. */
export function atWidth(photo: PeakPhoto, width: number): PeakPhoto {
  if (!/\/\d+px-/.test(photo.src) || width >= photo.width) return photo;
  return {
    ...photo,
    src: photo.src.replace(/\/\d+px-/, `/${width}px-`),
    width,
    height: Math.round((photo.height * width) / photo.width),
  };
}
