import path from "path";
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const projectRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  // Parent folder has another Next app + package-lock.json; without this,
  // Turbopack picks C:\Users\sergi as root and nested /admin/* routes 404.
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "klxlzzgrymkexvuelzex.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
