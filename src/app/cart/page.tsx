import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CartView } from "@/components/shop/CartView";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Your bag" title="Ready when you are" crumbs={[{ href: "/cart", label: "Bag" }]} />
      <CartView />
    </>
  );
}
