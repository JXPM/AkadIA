import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fixe la racine du projet (un package-lock.json parent existe sur la machine).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
