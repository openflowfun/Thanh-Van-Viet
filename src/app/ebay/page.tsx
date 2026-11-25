import type { Metadata } from "next";
import { EbayEdit } from "@/components/ebay/EbayEdit";
import { ALL_LISTINGS, PRODUCTS } from "@/lib/products";
import { EBAY_STORE } from "@/lib/catalog-data";
import { SITE } from "@/lib/format";
import { absoluteImage } from "@/lib/media";

export const metadata: Metadata = {
  title: "Live on eBay — all 28 listings",
  description: `Every Thanh Van Viet piece live on eBay right now: ${PRODUCTS.length} pieces across ${ALL_LISTINGS.length} listings — áo dài in sizes S to L and woven tapestry bags, shipped from Victoria.`,
  alternates: { canonical: "/ebay" },
  openGraph: {
    title: `Live on eBay · ${SITE.wordmark}`,
    description: `${ALL_LISTINGS.length} listings, photographed as they really are.`,
    images: [{ url: absoluteImage("/products/truc-bamboo-brocade-ao-dai-tu-than/03.webp") }],
  },
};

export default function EbayPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Thanh Van Viet — live eBay listings",
    numberOfItems: ALL_LISTINGS.length,
    itemListElement: ALL_LISTINGS.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: EBAY_STORE.itemUrl(l.id),
      name: l.title,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EbayEdit />
    </>
  );
}
