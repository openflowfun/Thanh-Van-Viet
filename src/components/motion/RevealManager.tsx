"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Any element with a `data-reveal` attribute (server or client rendered)
 * fades/rises into view once. A MutationObserver picks up elements that
 * mount later (route changes, filtered grids), so pages stay server-friendly.
 *
 *   data-reveal            → rise + fade
 *   data-reveal="fade"     → fade only
 *   data-reveal-delay="0.2"
 */
export function RevealManager() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion-ok")) return;

    const triggers: ScrollTrigger[] = [];
    let raf = 0;

    const scan = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal-bound])"));
      if (!els.length) return;
      els.forEach((el) => el.setAttribute("data-reveal-bound", ""));
      triggers.push(
        ...ScrollTrigger.batch(els, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.09,
              delay: (i, t: HTMLElement) => Number(t.dataset.revealDelay ?? 0),
              overwrite: true,
            }),
        }),
      );
    };

    scan();
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return null;
}
