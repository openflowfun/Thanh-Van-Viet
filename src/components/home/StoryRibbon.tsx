"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { IMG } from "@/lib/images";

const LINES = ["Silk from Vietnam.", "Cut for Australian life.", "Worn for the days you remember."];

/**
 * Pinned "story ribbon": a length of crimson silk pans slowly while three
 * short lines hand over to one another.
 */
export function StoryRibbon() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionOK()) return;
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");
      gsap.set(lines, { opacity: 0, yPercent: 40 });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const el = root.current?.querySelector("[data-count]");
            if (el) el.textContent = String(Math.min(3, Math.floor(self.progress * 3) + 1)).padStart(2, "0");
          },
        },
      });
      tl.fromTo("[data-silk]", { scale: 1.35, xPercent: -6, rotate: -2 }, { scale: 1.05, xPercent: 6, rotate: 1, duration: 3, ease: "none" }, 0)
        .fromTo("[data-garment]", { yPercent: 30, opacity: 0 }, { yPercent: -12, opacity: 1, duration: 3, ease: "none" }, 0)
        .to("[data-progress]", { scaleX: 1, duration: 3, ease: "none" }, 0);

      lines.forEach((line, i) => {
        const at = i * 1;
        tl.to(line, { opacity: 1, yPercent: 0, duration: 0.45 }, at + 0.05);
        if (i < lines.length - 1) tl.to(line, { opacity: 0, yPercent: -40, duration: 0.4 }, at + 0.75);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Our story in three lines" className="on-dark relative h-[100svh] overflow-hidden bg-crimson-deep text-ivory">
      <div data-silk className="absolute -inset-[8%]">
        <Image src={IMG.silkRed} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink/60" />

      {/* A garment drifting through the silk (desktop) */}
      <div data-garment className="absolute bottom-[8%] right-[7%] hidden aspect-[3/4] w-[22vw] max-w-[340px] overflow-hidden shadow-2xl lg:block">
        <Image src={IMG.whiteSeated} alt="Ivory silk áo dài" fill sizes="340px" className="object-cover" />
      </div>

      <div className="container-x relative flex h-full flex-col justify-center">
        <p className="eyebrow mb-8 flex items-center gap-4 text-ivory/70">
          <span data-count>01</span>
          <span className="relative h-px w-24 bg-ivory/25">
            <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-ivory" />
          </span>
          <span>03</span>
        </p>
        {/* Stacked by default (no JS / reduced motion); layered when animated. */}
        <div className="ribbon-lines space-y-3 text-[clamp(2.2rem,7.5vw,6.8rem)] leading-[1.02] lg:max-w-[64%] lg:text-[clamp(3rem,6vw,6.2rem)]">
          {LINES.map((l) => (
            <p key={l} data-line className="display max-w-[16ch]">
              {l}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
