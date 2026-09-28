"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

/** Lotus petals (centred at x=180) — shared by the divider and the preloader. */
export const LOTUS_PATHS = [
  "M180 6 C189 19 189 35 180 48 C171 35 171 19 180 6 Z",
  "M180 48 C166 45 158 33 160 17 C171 23 178 35 180 48 Z",
  "M180 48 C194 45 202 33 200 17 C189 23 182 35 180 48 Z",
  "M180 48 C162 51 148 43 142 30 C157 29 171 37 180 48 Z",
  "M180 48 C198 51 212 43 218 30 C203 29 189 37 180 48 Z",
];

/**
 * Lotus divider: the two hairlines and five petals draw themselves when
 * scrolled into view — a nod to the divider in the brand lockup.
 */
export function LotusDivider({ className = "", tone = "crimson" }: { className?: string; tone?: "crimson" | "ivory" | "gold" }) {
  const ref = useRef<SVGSVGElement>(null);
  const colour = tone === "ivory" ? "#F7F3EE" : tone === "gold" ? "#C4A574" : "#8B1A1A";

  useGSAP(
    () => {
      if (!ref.current || !motionOK()) return;
      const strokes = ref.current.querySelectorAll<SVGPathElement>("[data-draw]");
      const fills = ref.current.querySelectorAll<SVGPathElement>("[data-petal]");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(fills, { fillOpacity: 0 });
      gsap
        .timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } })
        .to(strokes, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.06 })
        .to(fills, { fillOpacity: 1, duration: 0.8, ease: "power2.out", stagger: 0.05 }, "-=0.6");
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 360 56" className={`h-auto w-full max-w-[360px] ${className}`} aria-hidden fill="none">
      <path data-draw d="M10 48 H138" stroke={colour} strokeWidth="1" />
      <path data-draw d="M222 48 H350" stroke={colour} strokeWidth="1" />
      {LOTUS_PATHS.map((d, i) => (
        <g key={i}>
          <path data-petal d={d} fill={colour} />
          <path data-draw d={d} stroke={colour} strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}
