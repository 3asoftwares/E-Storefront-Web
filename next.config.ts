import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  // Note: 'standalone' is for Docker deployments; Vercel handles output automatically
  output: 'standalone',
  transpilePackages: ['@3asoftwares/ui', '@3asoftwares/types', '@3asoftwares/utils'],
  // Turbopack configuration with alias fix for @3asoftwares/ui broken exports
  turbopack: {
    root: __dirname,
    resolveAlias: {
      // Fix for @3asoftwares/ui package exports mismatch (exports point to wrong files)
      '@3asoftwares/ui': './node_modules/@3asoftwares/ui/dist/index.js',
      '@3asoftwares/ui/dist/index.css': './node_modules/@3asoftwares/ui/dist/index.css',
    },
  },
  // Webpack configuration with alias fix for @3asoftwares/ui broken exports
  webpack: (config, { isServer }) => {
    // Fix for @3asoftwares/ui package exports mismatch (exports point to wrong files)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@3asoftwares/ui': path.resolve(__dirname, 'node_modules/@3asoftwares/ui/dist/index.js'),
    };
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http2: false,
        dns: false,
        child_process: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'your-cdn-domain.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
