import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdn0.riastatic.com",
      "cdn1.riastatic.com",
      "cdn2.riastatic.com",
      "cdn3.riastatic.com",
    ],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
