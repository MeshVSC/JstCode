import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
