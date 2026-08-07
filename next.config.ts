import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upleex.2min.cloud',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3688',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'service.digitalks.co.in',
      },
      {
        protocol: 'https',
        hostname: 'www.service.digitalks.co.in',
      },
      {
        protocol: 'http',
        hostname: 'service.digitalks.co.in',
      }
    ],
  },
  experimental: {
    optimizePackageImports: [
      'framer-motion', 
      'axios',
      '@radix-ui/react-slot',
      'clsx',
      'tailwind-merge',
      'react-icons'
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Turbopack optimizations
};

export default nextConfig;
