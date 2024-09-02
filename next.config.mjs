import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8001',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tse3.mm.bing.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8001/api/v1/:path*',
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // suppress Sentry errors during the build process
};

// wrap existing configuration with Sentry
const configWithSentry = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

export default withNextIntl(configWithSentry);
