/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  agentRules: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 310, 384, 480, 560],
    qualities: [50, 55, 70, 75, 90],
  },
}

export default nextConfig
