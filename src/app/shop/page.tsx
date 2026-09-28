import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { CATEGORIES, OCCASIONS, PRODUCTS, type Category, type Occasion } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Shop Vietnamese áo dài, kids’ áo dài, family sets and silk accessories. Filter by occasion — Tết, wedding, tea ceremony — colour and price. Prices in AUD.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const cat = typeof sp.category === "string" && CATEGORIES.some((c) => c.key === sp.category) ? (sp.category as Category) : null;
  const occ = typeof sp.occasion === "string" && OCCASIONS.includes(sp.occasion as Occasion) ? (sp.occasion as Occasion) : null;

  return (
    <>
      <PageHeader
        eyebrow="The shop"
        title="Everything in the house"
        kicker="Áo dài for women and children, family sets, and the small silk things that finish a look. Every piece is sized in centimetres."
        crumbs={[{ href: "/shop", label: "Shop" }]}
      />
      <ShopGrid products={PRODUCTS} initialCategory={cat} initialOccasion={occ} />
    </>
  );
}
