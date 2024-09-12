import withVercelToolbar from "@vercel/toolbar/plugins/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.bsky.app",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/user/:path*",
        destination: "/users/:path*",
        permanent: false,
      },
    ];
  },
};

export default withVercelToolbar()(nextConfig);
