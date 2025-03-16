import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone", // Ensures the app works on platforms like Render
};

export default nextConfig;
