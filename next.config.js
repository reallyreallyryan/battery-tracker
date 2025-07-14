const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Add this for proper sitemap generation
  trailingSlash: false,
  async rewrites() {
    return [];
  },
  env: {
    NEXT_PUBLIC_DOMAIN: 'https://voltahome.app'
  }
};
