import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Use `npx next build` for the inner step so `npm run build` can be the full OpenNext
// pipeline without recursively calling itself (Cloudflare default is `npm run build`).
export default {
  ...defineCloudflareConfig({}),
  buildCommand: "npx next build",
};
