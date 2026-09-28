import type { MetadataRoute } from "next";
import { PRODUCTS, categoryFromSlug } from "@/lib/products";
import { SITE } from "@/lib/format";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/shop", "/lookbook", "/about", "/contact", "/size-guide", "/shipping-returns"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...Object.keys(categoryFromSlug).map((s) => ({ url: `${SITE.url}/collections/${s}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE.url}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
