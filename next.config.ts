import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
  },

  // This helps with the route group issue on Vercel
  experimental: {
    serverComponentsExternalPackages: [],
  },

  // Output standalone build for better compatibility with Vercel
  output: 'standalone',
};

export default nextConfig;