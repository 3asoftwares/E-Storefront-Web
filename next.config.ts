import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Note: 'standalone' is for Docker deployments; Vercel handles output automatically
  output: 'standalone',
  transpilePackages: ['@3asoftwares/ui', '@3asoftwares/types', '@3asoftwares/utils'],
  // Turbopack configuration with workspace root to fix lockfile warning
  turbopack: {
    root: __dirname,
  },
  // Fallback for Node.js modules that can't be bundled for browser
  webpack: (config, { isServer }) => {
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
