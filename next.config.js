/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  // Disable type checking during build (speeds up build)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build (speeds up build)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 