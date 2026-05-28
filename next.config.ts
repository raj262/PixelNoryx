import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/archive", permanent: true },
      { source: "/blog/:slug", destination: "/archive/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
