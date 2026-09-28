"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import type { Product } from "@/lib/products";
import { IMG } from "@/lib/images";

function textureFor(p: Product) {
  const name = p.colours[0].name;
  if (["Lacquer Crimson", "Tết Red", "Coral"].includes(name)) return IMG.silkRed;
  if (["Jade", "Indigo", "Hạ Long Mist", "Huế Purple", "Plum"].includes(name)) return IMG.silkTeal;
  if (["Rice Ivory", "Lotus White", "Pearl"].includes(name)) return IMG.silkIvory;
  return IMG.silkCream;
}

/** Scrubbed colour + cloth story: the texture opens from a narrow slit as you scroll. */
export function FabricStory({ product: p }: { product: Product }) {
  const root = useRef<HTMLElement>(null);
  const dark = ["Lacquer Crimson", "Tết Red", "Coral", "Jade", "Indigo", "Huế Purple", "Plum", "Ink Black", "Saffron"].includes(p.colours[0].name);

  useGSAP(
    () => {
      if (!motionOK()) return;
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 45%", scrub: 0.8 } })
        .fromTo("[data-cloth]", { clipPath: "inset(18% 38% 18% 38%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
        .fromTo("[data-cloth] img", { scale: 1.3 }, { scale: 1, ease: "none" }, 0)
        .fromTo("[data-cloth-copy] > *", { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, ease: "power2.out" }, 0.35);
    },
    { scope: root, dependencies: [p.slug] },
  );

  return (
    <section ref={root} aria-label="Colour and cloth" className="relative mt-24 overflow-hidden lg:mt-10">
      <div data-cloth className="relative h-[80svh] min-h-[520px] w-full">
        <Image src={textureFor(p)} alt="" fill sizes="100vw" className="object-cover" />
        <div className={`absolute inset-0 ${dark ? "bg-ink/35" : "bg-ivory/10"}`} />
      </div>
      <div className={`absolute inset-0 flex items-center ${dark ? "on-dark text-ivory" : "text-ink"}`}>
        <div data-cloth-copy className="container-x grid gap-10 lg:grid-cols-3">
          <div>
            <p className="eyebrow opacity-75">The colour</p>
            <ul className="mt-4 space-y-3">
              {p.colours.map((c) => (
                <li key={c.name} className="flex items-center gap-4">
                  <span className="h-8 w-8 rounded-full ring-1 ring-current/30" style={{ background: c.hex }} />
                  <span className="display text-2xl sm:text-3xl">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow opacity-75">The cloth</p>
            <p className="display mt-4 text-2xl leading-snug sm:text-3xl">{p.fabric}</p>
          </div>
          <div>
            <p className="eyebrow opacity-75">Made for</p>
            <p className="display mt-4 text-2xl italic leading-snug sm:text-3xl">{p.occasions.join(", ")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
