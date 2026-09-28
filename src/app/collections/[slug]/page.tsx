import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { TLink } from "@/components/motion/PageTransition";
import { byCategory, categoryFromSlug, type Category } from "@/lib/products";
import { IMG } from "@/lib/images";

const COPY: Record<Category, { eyebrow: string; title: string; kicker: string; image: string; alt: string; note: { title: string; body: string; href: string; cta: string } }> = {
  womens: {
    eyebrow: "Women’s Áo Dài",
    title: "The long dress, worn with ease",
    kicker: "Silk, chiffon, brocade and linen — from an everyday white áo dài to wedding red. Sizes S to 3XL, measured in centimetres.",
    image: IMG.whiteSeated,
    alt: "A woman in an ivory silk áo dài, seated",
    note: { title: "Between sizes?", body: "Vietnamese cuts sit closer than Australian sizing. Measure bust, waist and hip, and we’ll help you choose.", href: "/size-guide", cta: "Read the size guide" },
  },
  kids: {
    eyebrow: "Kids Áo Dài",
    title: "Small áo dài for big days",
    kicker: "Soft-lined áo dài for girls and boys aged 2 to 12 — for Tết visiting, school photos, weddings and first festivals.",
    image: IMG.girlRedLake,
    alt: "A little girl in a red áo dài by the lake",
    note: { title: "Growing fast?", body: "Children’s áo dài are sized by height. If in doubt, size up — hems can be taken up now and let down later.", href: "/size-guide#girls", cta: "Children’s size charts" },
  },
  family: {
    eyebrow: "Family Sets",
    title: "Dressed together, remembered together",
    kicker: "Mother–daughter pairs, sisters’ sets and heritage áo ngũ thân for the whole family. Choose a size for each wearer.",
    image: IMG.familySeatedTall,
    alt: "A family seated together in heritage Vietnamese tunics",
    note: { title: "Planning a family portrait?", body: "Tell us who is in the photograph and the date, and we’ll suggest a set and sizes by email.", href: "/contact", cta: "Ask for a fit note" },
  },
  accessories: {
    eyebrow: "Accessories",
    title: "Silk, pearl and palm leaf",
    kicker: "Silk slippers, beaded clutches, freshwater pearls, a hand-woven nón lá and Tết gift boxes — the finishing details.",
    image: IMG.clutchBeaded,
    alt: "A hand-beaded ivory clutch",
    note: { title: "Giving a gift?", body: "Our Tết Lucky Gift Box arrives with ten lì xì envelopes and a card handwritten in Melbourne.", href: "/product/tet-lucky-gift-box", cta: "See the gift box" },
  },
};

export function generateStaticParams() {
  return Object.keys(categoryFromSlug).map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = categoryFromSlug[slug];
  if (!cat) return {};
  const c = COPY[cat];
  return {
    title: c.eyebrow,
    description: c.kicker,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: { title: `${c.eyebrow} · Thanh Van Viet`, description: c.kicker, images: [{ url: `${c.image}?w=1200&h=630&fit=crop&q=70` }] },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const cat = categoryFromSlug[slug];
  if (!cat) notFound();
  const c = COPY[cat];
  const products = byCategory(cat);

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} kicker={c.kicker} image={c.image} imageAlt={c.alt} crumbs={[{ href: "/shop", label: "Shop" }, { href: `/collections/${slug}`, label: c.eyebrow }]} />
      <ShopGrid products={products} initialCategory={cat} lockCategory />
      <aside className="border-t border-line bg-rice/60">
        <div className="container-x flex flex-col items-start justify-between gap-6 py-16 lg:flex-row lg:items-center">
          <div>
            <p className="display text-3xl">{c.note.title}</p>
            <p className="mt-3 max-w-xl text-stone">{c.note.body}</p>
          </div>
          <TLink href={c.note.href} className="btn-outline shrink-0">
            {c.note.cta}
          </TLink>
        </div>
      </aside>
    </>
  );
}
