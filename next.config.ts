import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000/api';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['seudevelopment.grena.ge', 'http://localhost:3000'],
  images: {
    // Serve modern formats — project renders are large photos/renders that
    // shrink dramatically as AVIF/WebP vs the original JPEG/PNG.
    formats: ['image/avif', 'image/webp'],
    // Stored files are content-addressed by UUID (immutable), so keep optimized
    // outputs cached long-term — repeat visits reuse them instead of
    // re-optimizing the multi-MB source each time.
    minimumCacheTTL: 2592000, // 30 days
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
