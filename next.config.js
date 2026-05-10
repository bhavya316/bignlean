/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bignlean.synoventum.site",
      },
      {
        protocol: "https",
        hostname: "bignlean-api.synoventum.site",
      },
      {
        protocol: "https",
        hostname: "api.bignlean.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3002",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3002",
      },
    ],
  },
};

module.exports = nextConfig;
