"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // House easing: restrained, no bounce.
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

export const motionOK = () =>
  typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, useGSAP };
