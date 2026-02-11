import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "standalone",
  async redirects() {
    return [
      { source: "/catalog", destination: "/#catalog", permanent: false },
      { source: "/contacts", destination: "/#contacts", permanent: false },
    ];
  },
};

export default nextConfig;
