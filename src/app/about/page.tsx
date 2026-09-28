import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/lib/images";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Parallax } from "@/components/motion/Parallax";
import { LotusDivider } from "@/components/ui/Lotus";
import { TLink } from "@/components/motion/PageTransition";
import { Marquee } from "@/components/ui/Marquee";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "About",
  description:
    "Thanh Van Viet brings the beauty, elegance and traditions of Vietnam to Australia — Vietnamese fashion and lifestyle pieces, selected in Melbourne.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    t: "Based in Melbourne",
    d: "We choose, check, pack and post every order from Melbourne, and answer every email ourselves. New Zealand is next.",
  },
  {
    t: "Made for family occasions",
    d: "Tết mornings, the tea ceremony, a daughter’s school photo, a grandmother’s birthday. We select for the days families gather.",
  },
  {
    t: "Respect for craft",
    d: "We work with Vietnamese makers who cut, bead and embroider by hand, and we tell you what each piece is made of and how to care for it.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="on-dark grain relative flex h-[88svh] min-h-[560px] items-end overflow-hidden bg-ink text-ivory">
        <Parallax speed={16} scale={[1.1, 1.1]} className="absolute inset-0">
          <Image src={IMG.lanternNight} alt="Red silk lanterns glowing at night" fill priority sizes="100vw" className="object-cover opacity-75" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/20" />
        <div className="container-x relative z-10 pb-20 lg:pb-28">
          <p data-reveal className="eyebrow text-gold">
            About the house
          </p>
          <SplitHeading as="h1" trigger="mount" text="From Việt Nam, with care." className="display mt-5 max-w-[12ch] text-[clamp(3rem,9vw,8rem)] leading-[0.96]" />
        </div>
      </section>

      {/* Story */}
      <section className="container-x grid gap-14 py-24 lg:grid-cols-12 lg:py-40">
        <div className="lg:col-span-4">
          <p data-reveal className="eyebrow text-crimson">
            Our story
          </p>
          <div data-reveal className="relative mt-8 aspect-[3/4] w-full max-w-sm overflow-hidden bg-rice">
            <Image src={IMG.silkShop} alt="Choosing silk in a fabric shop" fill sizes="(min-width:1024px) 30vw, 90vw" className="object-cover" />
          </div>
        </div>
        <div className="lg:col-span-8 lg:pl-8">
          <p data-reveal className="display text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.2]">
            Thanh Van Viet was created to bring the beauty, elegance and traditions of Vietnam to customers in Australia.
          </p>
          <div className="mt-12 grid gap-8 text-ink/80 sm:grid-cols-2 sm:text-lg sm:leading-relaxed">
            <p data-reveal>
              We carefully select Vietnamese fashion and lifestyle pieces that carry Vietnam’s rich culture while fitting naturally into modern Australian life — an áo dài for a Tết lunch in Footscray as much as a tea ceremony in Hà Nội.
            </p>
            <p data-reveal data-reveal-delay="0.1">
              From áo dài to silk accessories, every piece is chosen with an appreciation for Vietnamese craftsmanship, design and tradition. If we would not give it to our own family, it does not come home with us.
            </p>
          </div>
          <div className="mt-16">
            <LotusDivider className="max-w-[240px]" />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-y border-line bg-rice/60 py-24 lg:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-3 lg:gap-16">
          {PILLARS.map((p, i) => (
            <div key={p.t} data-reveal data-reveal-delay={i * 0.08}>
              <p className="text-[0.62rem] tracking-[0.3em] text-crimson">0{i + 1}</p>
              <h2 className="display mt-3 text-3xl sm:text-4xl">{p.t}</h2>
              <p className="mt-4 leading-relaxed text-stone">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Image pair */}
      <section className="container-x grid grid-cols-2 gap-3 py-24 sm:gap-6 lg:py-36">
        <div data-reveal className="relative aspect-[3/4] overflow-hidden bg-rice">
          <Parallax speed={10} scale={[1.12, 1.12]} className="absolute inset-0">
            <Image src={IMG.whiteHatLilies} alt="A woman in a white áo dài holding a nón lá and lilies" fill sizes="50vw" className="object-cover" />
          </Parallax>
        </div>
        <div data-reveal data-reveal-delay="0.1" className="relative mt-16 aspect-[3/4] overflow-hidden bg-rice sm:mt-32">
          <Parallax speed={-12} scale={[1.12, 1.12]} className="absolute inset-0">
            <Image src={IMG.familyBridge} alt="A family in heritage tunics by the Japanese Covered Bridge, Hội An" fill sizes="50vw" className="object-cover" />
          </Parallax>
        </div>
      </section>

      {/* Our family — to be written */}
      <section aria-labelledby="our-family" className="container-x pb-24 lg:pb-36">
        <div data-reveal className="relative grid overflow-hidden border border-line bg-ivory lg:grid-cols-12">
          <div className="relative flex min-h-[280px] items-center justify-center bg-rice lg:col-span-5">
            <Image src={asset("/brand/mark-red.png")} alt="" width={537} height={630} unoptimized className="w-28 opacity-25" />
          </div>
          <div className="p-8 sm:p-12 lg:col-span-7 lg:p-16">
            <p className="eyebrow text-crimson">Our family</p>
            <h2 id="our-family" className="display mt-4 text-4xl leading-tight">
              A longer story, in our own words — soon.
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-stone">
              We are writing the story of the people behind Thanh Van Viet: where we come from, the grandmothers who taught us to tie a khăn vấn, and why we brought these pieces to Melbourne. It will live here.
            </p>
            <TLink href="/contact" className="link-underline eyebrow mt-8 inline-block">
              Say hello in the meantime →
            </TLink>
          </div>
        </div>
      </section>

      <Marquee items={["Melbourne", "Sydney", "Brisbane", "Adelaide", "Perth", "Hobart", "Canberra", "New Zealand — soon"]} tone="ivory" />

      <section className="container-x flex flex-col items-center py-24 text-center lg:py-32">
        <SplitHeading text="Begin with an áo dài." className="display text-[clamp(2.3rem,5vw,4.4rem)]" />
        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-4">
          <TLink href="/collections/womens-ao-dai" className="btn-primary">
            Shop women’s áo dài
          </TLink>
          <TLink href="/lookbook" className="btn-outline">
            View the lookbook
          </TLink>
        </div>
      </section>
    </>
  );
}
