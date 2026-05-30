import type { NextConfig } from "next";

function apiImageHost(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
    "https://admin.rajeshcodes.in";
  try {
    return new URL(raw).hostname;
  } catch {
    return "admin.rajeshcodes.in";
  }
}

function apiProxyTarget(): string {
  const raw =
    process.env.API_PROXY_TARGET ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
    "https://admin.rajeshcodes.in";
  return raw.replace(/\/$/, "");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: apiImageHost() },
    ],
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/archive", permanent: true },
      { source: "/blog/:slug", destination: "/archive/:slug", permanent: true },
    ];
  },
  async rewrites() {
    const target = apiProxyTarget();
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
