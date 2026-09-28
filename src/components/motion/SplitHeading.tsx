"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** "scroll" reveals when in view; "intro" waits for the preloader. */
  trigger?: "scroll" | "intro" | "mount";
  delay?: number;
  stagger?: number;
};

/**
 * Letter-by-letter headline reveal (letters rise out of a mask).
 * Screen readers get the plain text via aria-label.
 */
export function SplitHeading({ text, as: Tag = "h2", className, trigger = "scroll", delay = 0, stagger = 0.022 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motionOK() || !ref.current) return;
      const chars = ref.current.querySelectorAll<HTMLElement>("[data-char]");
      gsap.set(chars, { yPercent: 115 });
      const play = () =>
        gsap.to(chars, { yPercent: 0, duration: 1.25, ease: "expo.out", stagger, delay });

      if (trigger === "scroll") {
        gsap.to(chars, {
          yPercent: 0,
          duration: 1.25,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      } else if (trigger === "intro") {
        const w = window as Window & { __tvvIntroDone?: boolean };
        if (w.__tvvIntroDone) play();
        else window.addEventListener("tvv:intro-done", play, { once: true });
        return () => window.removeEventListener("tvv:intro-done", play);
      } else play();
    },
    { scope: ref },
  );

  const words = text.split(" ");
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom">
              <span data-char className="inline-block will-change-transform">
                {ch}
              </span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
