/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.bsky.app',
      }
    ]
  }
};

export default nextConfig;
