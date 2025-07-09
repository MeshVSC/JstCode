import type { NextConfig } from "next";
const withPWA = require("next-pwa");

const nextConfig: NextConfig = {
  // Enable static export
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Optimize for development speed
  experimental: {
    optimizePackageImports: ['@codesandbox/sandpack-react', '@monaco-editor/react'],
  },
  // Turbopack config (stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Better caching
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})(nextConfig);
