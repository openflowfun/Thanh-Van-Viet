import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProduct } from "@/lib/products";
import { ProductDetail } from "@/components/pdp/ProductDetail";
import { FabricStory } from "@/components/pdp/FabricStory";
import { ProductCard } from "@/components/shop/ProductCard";
import { SectionHead } from "@/components/home/Sections";
import { SITE } from "@/lib/format";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.short} ${p.fabric}. A$${p.price} — delivered across Australia in 3–7 business days.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      title: `${p.name} · ${SITE.wordmark}`,
      description: p.short,
      images: [{ url: `${p.images[0]}?w=1200&h=630&fit=crop&q=70`, width: 1200, height: 630, alt: p.name }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const pair = (p.pairWith ?? []).map(getProduct).filter((x): x is NonNullable<typeof x> => !!x && x.slug !== p.slug).slice(0, 3);
  const more = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug && !pair.includes(x)).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description.join(" "),
    image: p.images.map((i) => `${i}?w=1200&q=75`),
    brand: { "@type": "Brand", name: SITE.wordmark },
    material: p.fabric,
    color: p.colours.map((c) => c.name).join(", "),
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      price: p.price.toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${SITE.url}/product/${p.slug}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={p} />
      <FabricStory product={p} />

      {pair.length > 0 && (
        <section className="container-x py-24 lg:py-32">
          <SectionHead eyebrow="Pair it with" title="To finish the look" />
          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6">
            {pair.map((x) => (
              <div key={x.slug} data-reveal>
                <ProductCard product={x} sizes="(min-width:1024px) 30vw, 50vw" />
              </div>
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="border-t border-line bg-rice/50 py-24 lg:py-32">
          <div className="container-x">
            <SectionHead eyebrow="From the same collection" title="You may also love" />
            <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
              {more.map((x) => (
                <div key={x.slug} data-reveal>
                  <ProductCard product={x} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
