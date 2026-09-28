"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, motionOK } from "@/lib/gsap";
import { useStore } from "@/lib/store";
import { formatAUD, SITE } from "@/lib/format";
import { chartsFor, HOW_TO_MEASURE } from "@/lib/size-charts";
import type { Product } from "@/lib/products";
import { SizeChartTable } from "@/components/shop/SizeChartTable";
import { HeartIcon } from "@/components/shop/ProductCard";
import { TLink } from "@/components/motion/PageTransition";

export function ProductDetail({ product: p }: { product: Product }) {
  const { add, wishlist, toggleWish } = useStore();
  const [colour, setColour] = useState(p.colours[0].name);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [groupSizes, setGroupSizes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const wished = wishlist.includes(p.slug);
  const charts = chartsFor(p.sizeChartKey);

  // Desktop: gallery stays pinned while details scroll; images cross-fade with progress.
  useGSAP(
    () => {
      if (!motionOK() || p.images.length < 2) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const frames = gsap.utils.toArray<HTMLElement>("[data-frame]");
        gsap.set(frames.slice(1), { opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-pdp-details]",
            start: "top 20%",
            end: "bottom 80%",
            scrub: 0.6,
            onUpdate: (self) => setActive(Math.min(frames.length - 1, Math.floor(self.progress * frames.length))),
          },
        });
        frames.forEach((f, i) => {
          if (i === 0) return;
          tl.to(f, { opacity: 1, duration: 1, ease: "power2.inOut" }, i - 0.5);
          tl.fromTo(f.querySelector("img"), { scale: 1.08 }, { scale: 1, duration: 1.5, ease: "none" }, i - 0.5);
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [p.slug] },
  );

  const variantSize = p.sizeGroups ? p.sizeGroups.map((g) => `${g.label} ${groupSizes[g.label] ?? "?"}`).join(" · ") : size ?? "";

  const onAdd = () => {
    if (p.sizeGroups) {
      const missing = p.sizeGroups.find((g) => !groupSizes[g.label]);
      if (missing) return setError(`Please choose a size for ${missing.label.toLowerCase()}.`);
    } else if (!size) {
      return setError("Please choose a size.");
    }
    setError(null);
    add({ slug: p.slug, colour, size: variantSize });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div ref={root} className="container-x pt-20 lg:pt-[76px]">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Gallery */}
        <div className="-mx-4 sm:mx-0 lg:col-span-6">
          {/* Mobile / tablet: swipe gallery */}
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:hidden" aria-label="Product images">
            {p.images.map((src, i) => (
              <div key={src} className="relative aspect-[3/4] w-full shrink-0 snap-center bg-rice sm:w-[70%]">
                <Image src={src} alt={i === 0 ? `${p.name}` : `${p.name} — view ${i + 1}`} fill priority={i === 0} sizes="(min-width:640px) 70vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
          {p.images.length > 1 && (
            <p className="mt-3 px-4 text-center text-[0.6rem] uppercase tracking-[0.3em] text-stone sm:px-0 lg:hidden">Swipe · {p.images.length} images</p>
          )}

          {/* Desktop: pinned, scrubbed gallery */}
          <div className="sticky top-[76px] hidden h-[calc(100svh-76px)] py-6 lg:block">
            <div className="relative h-full overflow-hidden bg-rice">
              {p.images.map((src, i) => (
                <div key={src} data-frame className="absolute inset-0">
                  <Image src={src} alt={i === 0 ? p.name : `${p.name} — view ${i + 1}`} fill priority={i === 0} quality={85} sizes="50vw" className="object-cover" />
                </div>
              ))}
              {p.images.length > 1 && (
                <div className="absolute bottom-5 left-5 flex gap-2" aria-hidden>
                  {p.images.map((_, i) => (
                    <span key={i} className={`h-px w-8 transition-colors duration-500 ${i === active ? "bg-ivory" : "bg-ivory/35"}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div data-pdp-details className="lg:col-span-5 lg:col-start-8 lg:pb-24 lg:pt-16">
          <nav aria-label="Breadcrumb" className="text-[0.6rem] uppercase tracking-[0.24em] text-stone">
            <TLink href="/shop" className="hover:text-ink">
              Shop
            </TLink>
            <span className="mx-2">/</span>
            <TLink href={`/collections/${{ womens: "womens-ao-dai", kids: "kids-ao-dai", family: "family-sets", accessories: "accessories" }[p.category]}`} className="hover:text-ink">
              {{ womens: "Women’s Áo Dài", kids: "Kids Áo Dài", family: "Family Sets", accessories: "Accessories" }[p.category]}
            </TLink>
          </nav>

          {p.badge && <p className="eyebrow mt-8 text-crimson">{p.badge}</p>}
          <h1 className={`display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.04] ${p.badge ? "mt-3" : "mt-8"}`}>{p.name}</h1>
          <p className="mt-4 flex items-baseline gap-3 text-lg">
            <span>{formatAUD(p.price)}</span>
            {p.compareAt && <span className="text-sm text-stone line-through">{formatAUD(p.compareAt)}</span>}
            <span className="text-xs text-stone">AUD, incl. GST</span>
          </p>
          <p className="mt-6 leading-relaxed text-ink/80">{p.short}</p>

          {/* Colour */}
          <fieldset className="mt-9">
            <legend className="eyebrow mb-3">
              Colour <span className="ml-2 normal-case tracking-normal text-stone">{colour}</span>
            </legend>
            <div className="flex gap-3">
              {p.colours.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setColour(c.name)}
                  aria-pressed={colour === c.name}
                  aria-label={c.name}
                  className={`h-9 w-9 rounded-full p-[3px] ring-1 transition ${colour === c.name ? "ring-ink" : "ring-line hover:ring-stone"}`}
                >
                  <span className="block h-full w-full rounded-full ring-1 ring-ink/10" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </fieldset>

          {/* Size(s) */}
          {p.sizeGroups ? (
            p.sizeGroups.map((g) => (
              <SizePicker
                key={g.label}
                label={`${g.label}’s size`}
                options={g.options}
                value={groupSizes[g.label] ?? null}
                onChange={(v) => setGroupSizes((s) => ({ ...s, [g.label]: v }))}
              />
            ))
          ) : p.sizes.length > 1 ? (
            <SizePicker label="Size" options={p.sizes} value={size} onChange={setSize} />
          ) : (
            <p className="mt-8 text-sm text-stone">Size: {p.sizes[0]}</p>
          )}
          {charts.length > 0 && (
            <a
              href="#size-chart"
              onClick={() => {
                const d = document.getElementById("size-chart") as HTMLDetailsElement | null;
                if (d) d.open = true;
              }}
              className="link-underline mt-3 inline-block text-xs text-stone hover:text-ink">
              Size chart in cm — bust, waist, hip, height
            </a>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={onAdd} className="btn-primary flex-1 py-5">
              {added ? "Added to bag ✓" : `Add to bag — ${formatAUD(p.price)}`}
            </button>
            <button
              type="button"
              onClick={() => toggleWish(p.slug)}
              aria-pressed={wished}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex w-16 items-center justify-center border transition-colors ${wished ? "border-crimson text-crimson" : "border-line hover:border-ink"}`}
            >
              <HeartIcon filled={wished} />
            </button>
          </div>
          <p role="alert" className="mt-3 min-h-5 text-sm text-crimson">
            {error}
          </p>

          <ul className="mt-2 space-y-2 border-y border-line py-5 text-sm text-ink/80">
            <li>Delivered in 3–7 business days, Australia-wide.</li>
            <li>Free shipping over {formatAUD(SITE.freeShippingThreshold)}. New Zealand coming soon.</li>
            <li>
              Unsure about fit?{" "}
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Fit note — ${p.name}`)}`} className="link-underline text-crimson">
                Email us for a fit note
              </a>
              .
            </li>
          </ul>

          {/* Story */}
          <div className="mt-10 space-y-4 leading-relaxed text-ink/80">
            {p.description.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Accordions */}
          <div className="mt-10 divide-y divide-line border-y border-line">
            <Accordion title="What’s included" open>
              <ul className="list-inside list-disc space-y-1 marker:text-crimson">
                {p.included.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Fabric & occasion">
              <dl className="grid grid-cols-[7rem_1fr] gap-y-3">
                <dt className="text-stone">Fabric</dt>
                <dd>{p.fabric}</dd>
                <dt className="text-stone">Wear it for</dt>
                <dd>{p.occasions.join(" · ")}</dd>
              </dl>
            </Accordion>
            <Accordion title="Care">
              <ul className="space-y-1">
                {p.care.map((c) => (
                  <li key={c}>— {c}</li>
                ))}
              </ul>
            </Accordion>
            {charts.length > 0 && (
              <Accordion title="Size chart (cm)" id="size-chart">
                <div className="space-y-10">
                  {charts.map((c) => (
                    <div key={c.key}>
                      {charts.length > 1 && <p className="eyebrow mb-3 text-crimson">{c.title}</p>}
                      <SizeChartTable chart={c} compact />
                    </div>
                  ))}
                  {p.sizeChartKey !== "slippers" && (
                    <div>
                      <p className="eyebrow mb-3">How to measure</p>
                      <dl className="space-y-2">
                        {HOW_TO_MEASURE.map((m) => (
                          <div key={m.part}>
                            <dt className="inline font-medium">{m.part}. </dt>
                            <dd className="inline text-ink/75">{m.how}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                  <TLink href="/size-guide" className="link-underline text-xs text-crimson">
                    Full size guide →
                  </TLink>
                </div>
              </Accordion>
            )}
            <Accordion title="Shipping & returns">
              <p>
                Dispatched from Melbourne within 1–2 business days and delivered in 3–7 business days across Australia. Unworn pieces with tags may be returned within 14 days.{" "}
                <TLink href="/shipping-returns" className="link-underline text-crimson">
                  Full details
                </TLink>
              </p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

function SizePicker({ label, options, value, onChange }: { label: string; options: string[]; value: string | null; onChange: (v: string) => void }) {
  return (
    <fieldset className="mt-8">
      <legend className="eyebrow mb-3">
        {label} {value && <span className="ml-2 normal-case tracking-normal text-stone">{value}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            aria-pressed={value === s}
            className={`min-w-12 border px-3 py-2.5 text-sm transition-colors ${value === s ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"}`}
          >
            {s}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Accordion({ title, children, open, id }: { title: string; children: React.ReactNode; open?: boolean; id?: string }) {
  return (
    <details id={id} className="group scroll-mt-28" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow">{title}</span>
        <span className="relative h-3 w-3" aria-hidden>
          <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
          <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-500 group-open:scale-y-0" />
        </span>
      </summary>
      <div className="pb-6 text-sm leading-relaxed">{children}</div>
    </details>
  );
}
