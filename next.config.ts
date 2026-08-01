import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Résumé uploads go through a Server Action; raise the default 1 MB limit.
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
