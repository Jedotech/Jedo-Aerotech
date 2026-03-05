import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // Tells Next.js to build static HTML files for GitHub
  images: {
    unoptimized: true, // Required because GitHub Pages doesn't support the Next.js image server
  },
};

export default nextConfig;