import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "",
  assetPrefix: "",
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: "" },
};

export default withContentlayer(config);