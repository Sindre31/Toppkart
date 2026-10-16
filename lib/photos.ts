/** Plassholder — erstattes av `scripts/peak-photos/fetch_photos.py`. */

export interface PeakPhoto {
  wikidata: string;
  file: string;
  src: string;
  width: number;
  height: number;
  page: string;
  author: string;
  license: string;
  licenseUrl: string;
}

export const PHOTOS: Readonly<Record<string, PeakPhoto>> = {};
