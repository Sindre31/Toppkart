import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Stripe webhook needs the raw request body; Next's App Router gives us
  // that via request.text(), so no body-parser opt-out is required here.
};

export default nextConfig;
