import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ["jioeyqgkaazhqeanehtt.supabase.co"],
  },

  allowedDevOrigins: ["http://192.168.1.33", "http://localhost:3000"],
};

export default nextConfig;
