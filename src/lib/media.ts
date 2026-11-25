import { MEDIA } from "./catalog-data";
import { SITE } from "./format";
import { BASE_PATH } from "./asset";

/**
 * How an image should sit in a portrait frame. Model photography fills the frame;
 * square product shots, size charts and landscape images are shown whole on white
 * so nothing (a handle, a measurement) is cropped away.
 */
export function fitClass(src: string) {
  const m = MEDIA[src];
  if (!m) return "object-cover";
  if (m.kind !== "photo" || m.w / m.h > 0.92) return "object-contain bg-white";
  return "object-cover";
}

export const isWhole = (src: string) => fitClass(src) !== "object-cover";

/** Absolute URL for metadata (Open Graph, JSON-LD). */
export function absoluteImage(src: string) {
  if (src.startsWith("http")) return `${src}?w=1200&q=75`;
  return `${SITE.url}${BASE_PATH}${src}`;
}
