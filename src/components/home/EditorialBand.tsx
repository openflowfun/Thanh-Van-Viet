"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { SplitHeading } from "@/components/motion/SplitHeading";

const STILLS = [
  { src: IMG.lanternHoiAn, cap: "Hội An, dusk", tall: true },
  { src: IMG.whiteBicycle, cap: "Hà Nội, a school morning" },
  { src: IMG.silkShop, cap: "Choosing the silk", tall: true },
  { src: IMG.lotusLeaves, cap: "Sen, the lotus" },
  { src: IMG.familyCanal, cap: "Áo ngũ thân by the canal", tall: true },
  { src: IMG.nonLaRiver, cap: "The nón lá" },
  { src: IMG.orangePillar, cap: "Saffron jacquard", tall: true },
];

const STILLS_B = [
  { src: IMG.whiteBraid, cap: "A braid and white linen", tall: true },
  { src: IMG.lanternStreet, cap: "Lanterns over the old town" },
  { src: IMG.redCafe, cap: "Red silk, Sài Gòn café", tall: true },
  { src: IMG.familyStreet, cap: "Family, walking together" },
  { src: IMG.blackHat, cap: "Ink black and pearls", tall: true },
  { src: IMG.lotusPinkDark, cap: "Sen at night" },
  { src: IMG.bridgeFlower, cap: "A painted panel", tall: true },
];

/**
 * "From Việt Nam to Melbourne": two rows of film stills drifting in
 * opposite directions as the page scrolls vertically.
 */
export function EditorialBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionOK()) return;
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 };
      gsap.fromTo("[data-track-a]", { xPercent: 0 }, { xPercent: -28, ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-track-b]", { xPercent: -24 }, { xPercent: 0, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-dark grain relative overflow-hidden bg-ink py-24 text-ivory lg:py-36">
      <div className="container-x relative z-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p data-reveal className="eyebrow text-gold">
            Editorial
          </p>
          <SplitHeading text="From Việt Nam to Melbourne" className="display mt-4 text-[clamp(2.4rem,6vw,5.6rem)] leading-[1]" />
        </div>
        <p data-reveal className="max-w-md leading-relaxed text-ivory/70 lg:col-span-5">
          We travel back each year to the workshops and markets we buy from — Hà Nội, Huế, Hội An and Sài Gòn — and bring home only what we would give to our own family.
        </p>
      </div>

      <div className="relative z-10 mt-16 space-y-4 lg:mt-24 lg:space-y-6">
        <div data-track-a className="flex w-max gap-4 pl-4 lg:gap-6 lg:pl-14">
          {STILLS.map((s, i) => (
            <Still key={i} {...s} />
          ))}
        </div>
        <div data-track-b className="flex w-max gap-4 pl-4 lg:gap-6 lg:pl-14">
          {STILLS_B.map((s, i) => (
            <Still key={i} {...s} tall={!s.tall} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Still({ src, cap, tall }: { src: string; cap: string; tall?: boolean }) {
  return (
    <figure className="shrink-0">
      <div className={`relative overflow-hidden bg-ink-soft ${tall ? "h-[46vw] w-[34vw] lg:h-[30vw] lg:w-[22vw]" : "h-[46vw] w-[62vw] lg:h-[30vw] lg:w-[40vw]"}`}>
        <Image src={src} alt={cap} fill sizes="(min-width:1024px) 40vw, 62vw" className="object-cover opacity-90 grayscale-[20%]" />
      </div>
      <figcaption className="mt-3 text-[0.62rem] uppercase tracking-[0.26em] text-ivory/50">{cap}</figcaption>
    </figure>
  );
}
