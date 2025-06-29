/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['images.pexels.com']
  },
  // Remove output: 'export' to fix the generateStaticParams error
  // output: 'export',
};

module.exports = nextConfig;