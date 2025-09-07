import type { NextConfig } from "next";

const isCI = process.env.GITHUB_ACTIONS === "true";
const repo = "nguyen-lisa.github.io";           // your repo name
const basePath = isCI ? `/${repo}` : ""; // only prefix on CI/Pages

const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath + "/",
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
export default config;
