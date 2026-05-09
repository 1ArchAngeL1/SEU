import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.100.5'],
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.100.5',
        port: '4000',
        pathname: '/api/files/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
