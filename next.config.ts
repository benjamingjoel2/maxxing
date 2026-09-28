import type { NextConfig } from "next";

// The site has no server-side logic, so it builds to plain static files in `out/`.
// NEXT_PUBLIC_BASE_PATH lets a build be hosted under a sub-path (e.g. a preview at /site).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
};

export default nextConfig;
