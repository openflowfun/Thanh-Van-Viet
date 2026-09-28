import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export → `npm run build` writes the whole site to /out as
  // plain .html/.css/.js files that any static host can serve.
  output: "export",
  trailingSlash: true,
  images: {
    // Product & editorial photography is served from Unsplash's image CDN
    // (imgix) with on-the-fly resizing. Swap this loader when real product
    // photography moves to your own CDN / Shopify / Sanity etc.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [60, 70, 75, 85],
  },
};

export default nextConfig;
