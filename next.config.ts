import type { NextConfig } from "next";
const isCI = process.env.GITHUB_ACTIONS === "true";
const repo = "my-portfolio";
const basePath = isCI ? `/${repo}` : "";

const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath + "/",
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default config;
