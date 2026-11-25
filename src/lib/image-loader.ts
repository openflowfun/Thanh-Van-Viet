"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * - /products/** — the catalogue photography (saved from the eBay listings) ships in
 *   two sizes: NN.webp (1600px) and NN-sm.webp (720px). Small slots get the light file.
 * - Other local files (e.g. /brand/*.png) are returned untouched.
 * - Remote Unsplash/imgix sources get width + quality params.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("/products/")) {
    return `${BASE}${width <= 720 ? src.replace(/\.webp$/, "-sm.webp") : src}`;
  }
  if (src.startsWith("/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}
