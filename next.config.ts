import type { NextConfig } from "next";
import { TOUR_SLUGS_ENV } from "./lib/tour-paths";
import { TOURS } from "./lib/tours";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* Toppkart er gratis og har ingen kontoer. Gamle lenker til kassa og
     kontosida — i gamle e-poster og bokmerker — lander på
     forsida og «Mine turer» i stedet for på en 404. */
  async redirects() {
    return [
      { source: "/betaling", destination: "/", permanent: true },
      { source: "/min-side", destination: "/mine-turer", permanent: true },
      /* Turlista er borte; kartet er lista. */
      { source: "/turer", destination: "/", permanent: true },
    ];
  },

  /* Forsida er kartet. `/` serveres av `app/kart` uten å bytte adresse, så
     `/?tur=<slug>` er lenka man deler. `/kart` virker fortsatt — gamle lenker,
     og den lagrede kopien offline-lagringa henter — og peker canonical hit. */
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/kart" }], afterFiles: [], fallback: [] };
  },

  /* Turene som finnes, til middleware, som svarer 404 på alle andre under
     `/tur/`. Den kan ikke importere `lib/tours` selv — den kjører på Edge, og
     modulen drar med seg all rutegeometrien — så lista bygges her, fra den
     samme `TOURS` sidene leser, og legges inn i bunten ved bygging. Ingen
     andre lister å holde i takt. Se `lib/tour-paths.ts`. */
  env: {
    [TOUR_SLUGS_ENV]: TOURS.map((t) => t.slug).join(","),
  },
};

export default nextConfig;
