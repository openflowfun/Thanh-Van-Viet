import Image from "next/image";
import { TLink } from "@/components/motion/PageTransition";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Parallax } from "@/components/motion/Parallax";
import { LotusDivider } from "@/components/ui/Lotus";
import { Newsletter } from "@/components/ui/Newsletter";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES, THIS_SEASON, byCategory, getProduct } from "@/lib/products";
import { IMG } from "@/lib/images";
import { formatAUD } from "@/lib/format";
import { asset } from "@/lib/asset";

export function SectionHead({
  eyebrow,
  title,
  kicker,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  align?: "left" | "center";
  action?: { href: string; label: string };
}) {
  return (
    <div className={`flex flex-col gap-6 ${align === "center" ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between"}`}>
      <div className={align === "center" ? "flex flex-col items-center" : ""}>
        <p data-reveal className="eyebrow text-crimson">
          {eyebrow}
        </p>
        <SplitHeading text={title} className="display mt-4 max-w-[18ch] text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.02]" />
        {kicker && (
          <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-stone sm:text-base">
            {kicker}
          </p>
        )}
      </div>
      {action && (
        <TLink data-reveal href={action.href} className="link-underline eyebrow shrink-0 self-start lg:self-auto">
          {action.label} →
        </TLink>
      )}
    </div>
  );
}

const TILE_IMAGES = {
  womens: "/products/anh-kim-metallic-lace-ao-dai/01.webp",
  kids: IMG.girlRedLake,
  family: IMG.familySeatedTall,
  accessories: "/products/sunbathing-cat-tapestry-tote/01.webp",
} as const;

export function CollectionTiles() {
  return (
    <section className="container-x py-24 lg:py-36">
      <SectionHead
        eyebrow="The collections"
        title="Four rooms of the house"
        kicker="Ten áo dài and eight bags are live now, photographed as they really are. Kids’ áo dài and family sets are being chosen for the next season."
      />
      <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-20 lg:grid-cols-12 lg:gap-6">
        {CATEGORIES.map((c, i) => {
          const layout = ["col-span-2 lg:col-span-7 lg:row-span-2", "lg:col-span-5", "lg:col-span-5", "col-span-2 lg:col-span-12"][i];
          const aspect = ["aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-full", "aspect-[3/4] lg:aspect-[5/4]", "aspect-[3/4] lg:aspect-[5/4]", "aspect-[16/10] lg:aspect-[16/6]"][i];
          const count = byCategory(c.key).length;
          return (
            <TLink key={c.key} href={c.href} data-reveal className={`group relative block overflow-hidden bg-rice ${layout}`}>
              <div className={`relative w-full ${aspect}`}>
                <Parallax speed={10} scale={[1.12, 1.12]} className="absolute inset-0">
                  <Image
                    src={TILE_IMAGES[c.key]}
                    alt=""
                    fill
                    sizes={i === 3 ? "100vw" : "(min-width:1024px) 50vw, 50vw"}
                    className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
                  />
                </Parallax>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-ivory sm:p-7">
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-ivory/70">
                      {String(i + 1).padStart(2, "0")} · {count ? `${count} pieces · live on eBay` : "Arriving soon"}
                    </p>
                    <h3 className="display mt-2 text-[1.45rem] leading-tight sm:text-4xl">{c.label}</h3>
                    <p className="mt-2 hidden max-w-xs text-sm text-ivory/80 sm:block">{c.blurb}</p>
                  </div>
                  <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory/50 transition-colors duration-500 group-hover:bg-ivory group-hover:text-ink sm:flex">
                    →
                  </span>
                </div>
              </div>
            </TLink>
          );
        })}
      </div>
    </section>
  );
}

export function ThisSeason() {
  return (
    <section className="border-t border-line bg-rice/50 py-24 lg:py-36">
      <div className="container-x">
        <SectionHead eyebrow="Live on eBay" title="Chosen for spring and Tết" action={{ href: "/ebay", label: "All 28 listings" }} />
        <div className="mt-14 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:mt-20 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16">
          {THIS_SEASON.map((p, i) => (
            <div key={p.slug} data-reveal data-reveal-delay={(i % 4) * 0.06}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Real photography from the listings: three friends in ivory, blush and silver-blue brocade. */
export function FamilyFeature() {
  const trio = ["ngoc-trai-ivory-pearl-brocade-ao-dai", "hong-ngoc-blush-pearl-brocade-ao-dai", "bang-lam-ice-blue-pearl-brocade-ao-dai"].map((s) => getProduct(s)!);
  const truc = getProduct("truc-bamboo-brocade-ao-dai-tu-than")!;
  return (
    <section className="container-x grid items-center gap-12 py-24 lg:grid-cols-12 lg:gap-8 lg:py-40">
      <div className="relative lg:col-span-7">
        <div data-reveal className="relative aspect-[4/5] w-[82%] overflow-hidden bg-rice">
          <Parallax speed={12} scale={[1.15, 1.15]} className="absolute inset-0">
            <Image src="/products/truc-bamboo-brocade-ao-dai-tu-than/03.webp" alt="Three friends in ivory, blush and silver-blue brocade áo dài beside a cyclo" fill sizes="(min-width:1024px) 45vw, 80vw" className="object-cover" />
          </Parallax>
        </div>
        <div data-reveal data-reveal-delay="0.15" className="absolute -bottom-10 right-0 aspect-[3/4] w-[44%] overflow-hidden border-[6px] border-ivory bg-rice shadow-xl sm:-bottom-14">
          <Parallax speed={-14} scale={[1.15, 1.15]} className="absolute inset-0">
            <Image src="/products/truc-bamboo-brocade-ao-dai-tu-than/04.webp" alt="The three friends laughing together at a magazine kiosk" fill sizes="(min-width:1024px) 25vw, 45vw" className="object-cover" />
          </Parallax>
        </div>
      </div>
      <div className="mt-10 lg:col-span-5 lg:mt-0 lg:pl-10">
        <p data-reveal className="eyebrow text-crimson">
          Chị em · Sisters &amp; best friends
        </p>
        <SplitHeading text="Ivory, blush and ice blue" className="display mt-4 text-[clamp(2.3rem,4.6vw,4rem)] leading-[1.02]" />
        <p data-reveal className="mt-6 max-w-md leading-relaxed text-stone">
          Three brocades with a ring of pearls at the neck, cut alike so they belong together in a photograph — for sisters, bridesmaids or the friends you visit with at Tết. Each colour and size is its own live listing.
        </p>
        <ul data-reveal className="mt-8 divide-y divide-line border-y border-line">
          {trio.map((p) => (
            <li key={p.slug}>
              <TLink href={`/product/${p.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <span className="flex items-center gap-4">
                  <span className="h-6 w-6 rounded-full ring-1 ring-ink/15" style={{ background: p.colours[0].hex }} />
                  <span className="display text-xl group-hover:text-crimson">{p.colours[0].name}</span>
                </span>
                <span className="text-sm text-stone">
                  {p.sizes.join(" · ")} — {formatAUD(p.price)}
                </span>
              </TLink>
            </li>
          ))}
        </ul>
        <div data-reveal className="mt-8 flex flex-wrap gap-4">
          <TLink href={`/product/${truc.slug}`} className="btn-primary">
            Shop the silver-blue tứ thân
          </TLink>
          <TLink href="/ebay" className="btn-outline">
            All 28 listings
          </TLink>
        </div>
      </div>
    </section>
  );
}

const VALUES = [
  { n: "01", t: "Craft", d: "We choose pieces from Vietnamese makers who still cut, bead and embroider by hand — silk, brocade and linen with a real hand-feel." },
  { n: "02", t: "Fit", d: "Every áo dài is measured in centimetres — bust, waist, hip, height — because Vietnamese cuts are not Australian S, M, L." },
  { n: "03", t: "Occasion", d: "Tết, the tea ceremony, a school photo, a wedding. We select for the moment, and tell you what each piece is for." },
  { n: "04", t: "Care", d: "Clear care notes, a reply within two business days, and advice on fit before you buy — by email, from Melbourne." },
];

export function Values() {
  return (
    <section className="border-y border-line py-24 lg:py-32">
      <div className="container-x">
        <div className="flex justify-center">
          <LotusDivider />
        </div>
        <div className="mt-16 grid gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line">
          {VALUES.map((v, i) => (
            <div key={v.t} data-reveal data-reveal-delay={i * 0.08} className="sm:pr-8 lg:px-10 lg:first:pl-0 lg:last:pr-0">
              <p className="text-[0.62rem] tracking-[0.3em] text-crimson">{v.n}</p>
              <h3 className="display mt-3 text-3xl">{v.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-stone">{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STRIP = [IMG.orangeLantern, IMG.whiteHatLilies, IMG.familyBridge, IMG.redPeachBlossom, IMG.blueLake, IMG.pinkArch];

export function LookbookStrip() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-x flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p data-reveal className="eyebrow text-crimson">
            The lookbook
          </p>
          <SplitHeading text="Worn, and remembered" className="display mt-4 text-[clamp(2.1rem,4.4vw,3.8rem)] leading-[1.05]" />
        </div>
        <TLink data-reveal href="/lookbook" className="link-underline eyebrow">
          Open the lookbook →
        </TLink>
      </div>
      <div className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:px-8 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-14">
        {STRIP.map((src, i) => (
          <TLink
            key={src}
            href="/lookbook"
            data-reveal
            data-reveal-delay={i * 0.05}
            className="group relative aspect-square w-[62vw] shrink-0 snap-start overflow-hidden bg-rice sm:w-[38vw] lg:w-auto"
            aria-label="View in the lookbook"
          >
            <Image src={src} alt="" fill sizes="(min-width:1024px) 17vw, 62vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.05]" />
            <span className="absolute inset-0 bg-crimson/0 transition-colors duration-500 group-hover:bg-crimson/25" />
          </TLink>
        ))}
      </div>
    </section>
  );
}

export function SoftCTA() {
  return (
    <section className="on-dark relative overflow-hidden bg-crimson text-ivory">
      <Image src={asset("/brand/mark-ivory.png")} alt="" width={537} height={630} unoptimized className="pointer-events-none absolute -right-20 top-1/2 w-[520px] max-w-[80vw] -translate-y-1/2 opacity-[0.07]" />
      <div className="container-x relative grid gap-12 py-24 lg:grid-cols-2 lg:items-end lg:py-32">
        <div>
          <p data-reveal className="eyebrow text-ivory/70">
            Tết is coming
          </p>
          <SplitHeading text="Let us dress the family for the new year." className="display mt-4 max-w-[16ch] text-[clamp(2.3rem,5vw,4.6rem)] leading-[1.02]" />
        </div>
        <div data-reveal>
          <p className="max-w-md leading-relaxed text-ivory/80">
            One letter a month: new arrivals, Tết ordering dates, and notes on the stories behind the cloth. No noise.
          </p>
          <Newsletter tone="dark" className="mt-8 max-w-md" />
        </div>
      </div>
    </section>
  );
}
