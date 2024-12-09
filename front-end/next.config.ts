import type { NextConfig } from "next";
const nextConfig = {
  env: {
    WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID ?? "",
    ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY ?? "",
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    return config;
  },
};

export default nextConfig;
