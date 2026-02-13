import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upleex.2min.cloud',
        pathname: '/upload/**',
      },
    ],
  },
};

export default nextConfig;
