"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

/** Scrubbed vertical drift. speed > 0 moves slower than scroll (lags), < 0 faster. */
export function Parallax({
  children,
  speed = 12,
  className,
  scale,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  scale?: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!motionOK() || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { yPercent: -speed / 2, scale: scale?.[0] ?? 1 },
        {
          yPercent: speed / 2,
          scale: scale?.[1] ?? 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
