import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },         // required for static export on GH Pages
  basePath: "",                          // ← root (user site)
  assetPrefix: "",                       // ← root (user site)
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: "" },    // safe to keep; resolves to empty
};

export default config;
