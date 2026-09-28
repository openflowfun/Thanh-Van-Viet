"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { LOTUS_PATHS } from "@/components/ui/Lotus";
import { useLenis } from "@/components/motion/SmoothScroll";

const KEY = "tvv.intro.v1";

function announceDone() {
  (window as Window & { __tvvIntroDone?: boolean }).__tvvIntroDone = true;
  window.dispatchEvent(new Event("tvv:intro-done"));
}

/**
 * First-visit preloader (≤1.2s): a crimson lotus draws itself, the wordmark
 * fades in, then the curtain lifts. Skipped on repeat visits in a session
 * and for reduced-motion users.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setDone(true);
      announceDone();
      return;
    }

    const strokes = el.querySelectorAll<SVGPathElement>("[data-draw]");
    const fills = el.querySelectorAll<SVGPathElement>("[data-petal]");
    strokes.forEach((p) => {
      const len = p.getTotalLength();
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
      },
    });
    tl.to(strokes, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut", stagger: 0.03 })
      .to(fills, { fillOpacity: 1, duration: 0.3, ease: "power2.out" }, 0.4)
      .to("[data-pre-word]", { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.35)
      .add(announceDone, 0.8)
      .to(el, { yPercent: -100, duration: 0.45, ease: "power2.inOut" }, 0.75);
    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (done) lenis.start();
    else lenis.stop();
  }, [done, lenis]);

  if (done) return null;

  return (
    <div
      id="preloader"
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-ink"
      role="status"
      aria-label="Loading Thanh Van Viet"
    >
      <svg viewBox="136 0 88 56" className="w-28" fill="none" aria-hidden>
        {LOTUS_PATHS.map((d, i) => (
          <g key={i}>
            <path data-petal d={d} fill="#8B1A1A" fillOpacity={0} />
            <path data-draw d={d} stroke="#B91C1C" strokeWidth="0.8" />
          </g>
        ))}
      </svg>
      <div data-pre-word className="translate-y-2 opacity-0">
        <Image src="/brand/wordmark-ivory.png" alt="" width={1128} height={153} priority unoptimized className="h-auto w-56 sm:w-72" />
      </div>
    </div>
  );
}
