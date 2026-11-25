import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { TLink } from "@/components/motion/PageTransition";
import { byCategory, categoryFromSlug, type Category } from "@/lib/products";
import { IMG } from "@/lib/images";
import { absoluteImage } from "@/lib/media";
import { SITE } from "@/lib/format";

const COPY: Record<Category, { eyebrow: string; title: string; kicker: string; image: string; alt: string; note: { title: string; body: string; href: string; cta: string } }> = {
  womens: {
    eyebrow: "Women’s Áo Dài",
    title: "The long dress, worn with ease",
    kicker: "Brocade, satin, organza and chiffon — ten áo dài, each live on eBay in sizes S to L and measured in centimetres.",
    image: "/products/suong-ivory-organza-ao-dai/01.webp",
    alt: "A woman in an ivory organza áo dài holding a lace fan",
    note: { title: "Between sizes?", body: "These áo dài are cut to Vietnamese sizing and run smaller than Australian sizes. Check bust and waist in cm — or email us and we’ll help you choose.", href: "/size-guide", cta: "Read the size guide" },
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
    eyebrow: "Bags & Accessories",
    title: "Carry the story with you",
    kicker: "Woven elephant tapestries, embroidered áo dài girls on canvas and a few playful cats — eight bags, each live on eBay.",
    image: "/products/cream-elephant-tapestry-tote/05.webp",
    alt: "A woman carrying the cream elephant tapestry tote",
    note: { title: "Giving a gift?", body: "The áo dài girls totes are our favourite present for anyone far from Việt Nam. Write to us for gift notes.", href: "/product/ao-dai-girls-embroidered-tote-denim", cta: "See the áo dài girls tote" },
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
    openGraph: { title: `${c.eyebrow} · Thanh Van Viet`, description: c.kicker, images: [{ url: absoluteImage(c.image) }] },
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
      <ShopGrid
        products={products}
        initialCategory={cat}
        lockCategory
        comingSoon={
          <div className="grid items-center gap-10 border-y border-line py-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-crimson">Arriving soon</p>
              <p className="display mt-4 text-[clamp(2rem,4vw,3.4rem)] leading-[1.05]">The {c.eyebrow.toLowerCase()} are being chosen now.</p>
              <p className="mt-5 max-w-lg text-stone">
                We’re selecting the first pieces for this collection. Tell us the occasion, the date and the sizes you need, and we’ll write to you as soon as they land — or source them for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:col-span-5 lg:justify-end">
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`${c.eyebrow} — please let me know`)}`} className="btn-primary">
                Ask to be told first
              </a>
              <TLink href="/ebay" className="btn-outline">
                See all 28 eBay listings
              </TLink>
            </div>
          </div>
        }
      />
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
