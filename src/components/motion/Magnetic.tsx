"use client";

import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";

/** Gently pulls its child toward the cursor (fine pointers only). */
export function Magnetic({ children, strength = 0.35, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !motionOK() || !window.matchMedia("(pointer: fine)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "expo.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "expo.out" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`inline-block ${className ?? ""}`}>
      {children}
    </div>
  );
}
