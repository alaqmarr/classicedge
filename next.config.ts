import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/classicconcepts',
        destination: 'https://classicconcepts.in',
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-723d911c6a3442c78b2f69b731577d2b.r2.dev',
      },
    ],
  },
};

export default nextConfig;
