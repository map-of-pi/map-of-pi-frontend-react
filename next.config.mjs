import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
ignoreDuringBuilds: true,
  }, 
  images: {
    domains: ['example.com', 'http://localhost:8001'], // images repository domain should be listed here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tse3.mm.bing.net',
        
      },
    ],
  },
};

export default withNextIntl(nextConfig);
