import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Résumé + company-media + EM-document uploads go through Server Actions;
    // raise the default 1 MB limit to comfortably fit an 8 MB document.
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
};

export default nextConfig;
