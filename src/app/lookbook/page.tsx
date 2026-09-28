import type { Metadata } from "next";
import Image from "next/image";
import { IMG } from "@/lib/images";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Parallax } from "@/components/motion/Parallax";
import { TLink } from "@/components/motion/PageTransition";
import { LotusDivider } from "@/components/ui/Lotus";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "The Thanh Van Viet lookbook — áo dài for Tết, Hội An at dusk, ivory silk and the whole family, photographed.",
  alternates: { canonical: "/lookbook" },
};

type Frame = { src: string; alt: string; span: string; aspect: string; speed?: number };

const CHAPTERS: { n: string; title: string; line: string; href: string; frames: Frame[] }[] = [
  {
    n: "I",
    title: "Tết",
    line: "Peach blossom, red envelopes and the first morning of the year.",
    href: "/shop?occasion=T%E1%BA%BFt",
    frames: [
      { src: IMG.redPeachBlossom, alt: "A woman in a red áo dài among peach blossom", span: "col-span-12 lg:col-span-5", aspect: "aspect-[3/4]", speed: 10 },
      { src: IMG.redBlossomSmile, alt: "Smiling in red silk among blossom", span: "col-span-7 lg:col-span-4 lg:mt-40", aspect: "aspect-[4/5]", speed: -8 },
      { src: IMG.lanternRed, alt: "Red paper lanterns", span: "col-span-5 lg:col-span-3 mt-20 lg:mt-12", aspect: "aspect-[3/5]", speed: 14 },
    ],
  },
  {
    n: "II",
    title: "Hội An, dusk",
    line: "Saffron jacquard under lantern light on the Thu Bồn river.",
    href: "/product/hoi-an-saffron-ao-dai",
    frames: [
      { src: IMG.orangeLantern, alt: "Saffron áo dài beneath a silk lantern", span: "col-span-6 lg:col-span-4 lg:mt-24", aspect: "aspect-[3/4]", speed: -10 },
      { src: IMG.orangePorch, alt: "On a wooden porch in Hội An", span: "col-span-6 lg:col-span-4", aspect: "aspect-[3/4]", speed: 8 },
      { src: IMG.lanternHoiAn, alt: "A ceiling of silk lanterns", span: "col-span-12 lg:col-span-4 lg:mt-48", aspect: "aspect-[4/5]", speed: 12 },
    ],
  },
  {
    n: "III",
    title: "In white",
    line: "The quietest áo dài: ivory silk, lilies, a nón lá.",
    href: "/product/ngoc-ivory-silk-ao-dai",
    frames: [
      { src: IMG.whiteLiliesPark, alt: "White áo dài with an armful of lilies", span: "col-span-12 lg:col-span-7", aspect: "aspect-[4/5] lg:aspect-[5/6]", speed: 8 },
      { src: IMG.whiteHatLilies, alt: "Holding a nón lá and lilies", span: "col-span-6 lg:col-span-5 lg:mt-32", aspect: "aspect-[3/4]", speed: -12 },
      { src: IMG.whiteSteps, alt: "Seated on temple steps in ivory silk", span: "col-span-6 lg:col-span-5 lg:col-start-3 mt-16 lg:mt-0", aspect: "aspect-[4/5]", speed: 10 },
    ],
  },
  {
    n: "IV",
    title: "Together",
    line: "Áo ngũ thân for the whole family, by the old bridge.",
    href: "/collections/family-sets",
    frames: [
      { src: IMG.familyLanterns, alt: "A family in heritage tunics beneath lanterns", span: "col-span-12 lg:col-span-5", aspect: "aspect-[3/4]", speed: 10 },
      { src: IMG.familyBridgeWide, alt: "Walking together by the Japanese Covered Bridge", span: "col-span-12 lg:col-span-7 lg:mt-40", aspect: "aspect-[16/11]", speed: -8 },
      { src: IMG.coupleAlley, alt: "A couple in heritage tunics in a narrow lane", span: "col-span-7 lg:col-span-4 lg:col-start-2", aspect: "aspect-[3/4]", speed: 12 },
      { src: IMG.girlRedLake, alt: "A little girl in red by Hoàn Kiếm lake", span: "col-span-5 lg:col-span-3 mt-24", aspect: "aspect-[3/4]", speed: -10 },
    ],
  },
];

export default function LookbookPage() {
  return (
    <>
      <section className="on-dark grain relative flex h-[100svh] min-h-[600px] items-end overflow-hidden bg-ink text-ivory">
        <Parallax speed={18} scale={[1.12, 1.12]} className="absolute inset-0">
          <Image src={IMG.lotusField} alt="A woman in a white áo dài and nón lá in a field of lotus" fill priority sizes="100vw" className="object-cover object-[60%_40%]" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-ink/30" />
        <div className="container-x relative z-10 pb-16 lg:pb-24">
          <p data-reveal className="eyebrow text-gold">
            Lookbook · Spring / Tết
          </p>
          <SplitHeading as="h1" trigger="mount" text="Made to be remembered" className="display mt-5 max-w-[12ch] text-[clamp(3rem,10vw,9rem)] leading-[0.94]" />
        </div>
      </section>

      {CHAPTERS.map((c) => (
        <section key={c.n} className="container-x py-24 lg:py-36">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <p data-reveal className="display text-7xl italic text-crimson lg:col-span-2 lg:text-8xl">
              {c.n}
            </p>
            <div className="lg:col-span-6">
              <SplitHeading text={c.title} className="display text-[clamp(2.6rem,6vw,5.4rem)] leading-none" />
              <p data-reveal className="mt-4 max-w-md text-stone">
                {c.line}
              </p>
            </div>
            <TLink data-reveal href={c.href} className="link-underline eyebrow lg:col-span-4 lg:justify-self-end">
              Shop the look →
            </TLink>
          </div>
          <div className="mt-14 grid grid-cols-12 gap-3 sm:gap-6 lg:mt-20">
            {c.frames.map((f) => (
              <figure key={f.src} data-reveal className={f.span}>
                <div className={`relative overflow-hidden bg-rice ${f.aspect}`}>
                  <Parallax speed={f.speed ?? 10} scale={[1.14, 1.14]} className="absolute inset-0">
                    <Image src={f.src} alt={f.alt} fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
                  </Parallax>
                </div>
              </figure>
            ))}
          </div>
        </section>
      ))}

      <section className="border-t border-line py-24 text-center lg:py-32">
        <div className="container-x flex flex-col items-center">
          <LotusDivider className="max-w-[240px]" />
          <SplitHeading text="Find your piece" className="display mt-10 text-[clamp(2.3rem,5vw,4.4rem)]" />
          <div data-reveal className="mt-10 flex flex-wrap justify-center gap-4">
            <TLink href="/shop" className="btn-primary">
              Shop all
            </TLink>
            <TLink href="/size-guide" className="btn-outline">
              Size guide
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
