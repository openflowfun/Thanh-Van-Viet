"use client";

type LoaderArgs = { src: string; width: number; quality?: number };

/**
 * Remote Unsplash/imgix sources get width + quality params.
 * Local files (e.g. /brand/*.png) are returned untouched.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("/")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}
