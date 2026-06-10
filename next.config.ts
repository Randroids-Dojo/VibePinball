import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: __dirname
  },
  transpilePackages: ["@randroids-dojo/vibekit"]
};

export default nextConfig;
