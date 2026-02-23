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
      }
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion', 
      'axios',
      '@radix-ui/react-slot',
      'clsx',
      'tailwind-merge'
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Turbopack optimizations
  transpilePackages: ['lucide-react'],
};

export default nextConfig;
