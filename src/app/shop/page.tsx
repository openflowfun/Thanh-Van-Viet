import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Shop Vietnamese áo dài, kids’ áo dài, family sets and silk accessories. Filter by occasion — Tết, wedding, tea ceremony — colour and price. Prices in AUD.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="The shop"
        title="Everything in the house"
        kicker="Áo dài for women and children, family sets, and the small silk things that finish a look. Every piece is sized in centimetres."
        crumbs={[{ href: "/shop", label: "Shop" }]}
      />
      <ShopGrid products={PRODUCTS} readQuery />
    </>
  );
}
