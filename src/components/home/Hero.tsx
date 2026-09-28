"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { SITE } from "@/lib/format";
import { TLink } from "@/components/motion/PageTransition";
import { Magnetic } from "@/components/motion/Magnetic";
import { SplitHeading } from "@/components/motion/SplitHeading";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionOK()) return;
      const intro = () => {
        gsap.fromTo("[data-hero-img]", { scale: 1.14 }, { scale: 1, duration: 2.4, ease: "expo.out" });
        gsap.fromTo("[data-hero-veil]", { opacity: 1 }, { opacity: 0, duration: 1.6, ease: "power2.out" });
        gsap.fromTo("[data-hero-fade]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, delay: 0.55 });
      };
      const w = window as Window & { __tvvIntroDone?: boolean };
      gsap.set("[data-hero-fade]", { opacity: 0 });
      if (w.__tvvIntroDone) intro();
      else window.addEventListener("tvv:intro-done", intro, { once: true });

      // Parallax: image drifts slower than the page; copy rises faster and fades.
      gsap.to("[data-hero-layer]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -22,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => window.removeEventListener("tvv:intro-done", intro);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-dark grain relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-ivory">
      {/* Image layer */}
      <div data-hero-layer className="absolute inset-0 lg:left-[36%]">
        <div data-hero-img className="absolute inset-0">
          <Image
            src={IMG.heroRed}
            alt="A woman in a lacquer-red silk áo dài with white quần, holding a branch of red blossom"
            fill
            priority
            quality={85}
            sizes="(min-width:1024px) 64vw, 100vw"
            className="object-cover object-[50%_18%]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/10 lg:bg-gradient-to-r lg:from-ink lg:via-ink/20 lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/70 to-transparent" />
        <div data-hero-veil className="absolute inset-0 bg-ink opacity-0" />
      </div>

      {/* Copy */}
      <div data-hero-copy className="container-x relative z-10 flex h-full flex-col justify-end pb-24 pt-28 lg:justify-center lg:pb-0">
        <p data-hero-fade className="eyebrow text-gold">
          {SITE.wordmark} <span className="mx-2 text-ivory/40">—</span> Melbourne
        </p>
        <SplitHeading
          as="h1"
          trigger="intro"
          delay={0.15}
          text={SITE.hero}
          className="display mt-5 max-w-[11ch] text-[clamp(2.9rem,11vw,4.4rem)] leading-[0.98] sm:max-w-[13ch] lg:max-w-[10.5ch] lg:text-[clamp(4.5rem,6.6vw,7.2rem)]"
        />
        <p data-hero-fade className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/75 sm:text-base">
          Authentic áo dài and Vietnamese lifestyle pieces, thoughtfully selected for Australian life.
        </p>
        <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
          <Magnetic>
            <TLink href="/collections/womens-ao-dai" className="btn-primary px-10 py-5">
              Shop Áo Dài
            </TLink>
          </Magnetic>
          <TLink href="/lookbook" className="link-underline text-[0.7rem] font-medium uppercase tracking-[0.26em] text-ivory/90">
            Explore the Lookbook
          </TLink>
        </div>
      </div>

      {/* Scroll cue */}
      <div data-hero-fade className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex lg:left-auto lg:right-14 lg:translate-x-0">
        <span className="text-[0.58rem] uppercase tracking-[0.34em] text-ivory/60">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-ivory/20">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-ivory" />
        </span>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}60%,100%{transform:translateY(200%)}}`}</style>
    </section>
  );
}
