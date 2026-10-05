import type { NextConfig } from "next";
import { TOUR_SLUGS_ENV } from "./lib/tour-paths";
import { TOURS } from "./lib/tours";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Stripe webhook needs the raw request body; Next's App Router gives us
  // that via request.text(), so no body-parser opt-out is required here.

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
