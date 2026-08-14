import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Absolute project root — parent C:\Users\sergi also has package-lock.json + app/,
// which makes Turbopack infer the wrong workspace and 404 routes like /consulta.
const projectRoot = path.resolve(
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))
);

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [
      {
        source: "/clinical-tests/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
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
