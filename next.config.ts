// next.config.ts
import type { NextConfig } from "next";

const isCI = process.env.GITHUB_ACTIONS === "true";
const repo = "my-portfolio"; // <— your repo name
const basePath = isCI ? `/${repo}` : "";

const config: NextConfig = {
  output: "export",           // generate ./out
  images: { unoptimized: true },
  basePath,                   // applied only in CI; local dev unaffected
  assetPrefix: basePath + "/",// ensure static assets resolve on Pages
  trailingSlash: true,        // safer for GH Pages directory hosting
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
export default config;