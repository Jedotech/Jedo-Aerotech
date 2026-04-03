import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // DELETE or COMMENT OUT this line:
  // output: 'export', 

  images: {
    unoptimized: true, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;