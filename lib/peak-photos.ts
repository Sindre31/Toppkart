/** Oppslag i bildene av toppene (`lib/photos.ts`, generert).
 *
 *  Commons lager miniatyrer ved å bytte tallet i adressa, men bare i faste
 *  bredder (`ThumbWidth`); 640 svarer 400. Kartpanelet trenger bare en liten. */

import { PHOTOS, type PeakPhoto } from "./photos";

export type { PeakPhoto };

export function photoFor(slug: string): PeakPhoto | undefined {
  return PHOTOS[slug];
}

/** Bredder Commons lager miniatyrer i. Andre bredder svarer 400. */
export type ThumbWidth = 330 | 500 | 960 | 1280 | 1920;

/** Den samme miniatyren i en annen bredde. Adresser uten bredde — originaler
 *  som allerede er smalere enn det vi ba om — kommer tilbake uendret. */
export function atWidth(photo: PeakPhoto, width: ThumbWidth): PeakPhoto {
  if (!/\/\d+px-/.test(photo.src) || width >= photo.width) return photo;
  return {
    ...photo,
    src: photo.src.replace(/\/\d+px-/, `/${width}px-`),
    width,
    height: Math.round((photo.height * width) / photo.width),
  };
}
