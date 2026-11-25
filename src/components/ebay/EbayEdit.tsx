"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP, motionOK, ScrollTrigger } from "@/lib/gsap";
import { ALL_LISTINGS, PRODUCTS, photosOf, type Product } from "@/lib/products";
import { EBAY_STORE, MEDIA } from "@/lib/catalog-data";
import { fitClass } from "@/lib/media";
import { formatAUD, SITE } from "@/lib/format";
import { TLink } from "@/components/motion/PageTransition";
import { Magnetic } from "@/components/motion/Magnetic";

const AO_DAI = PRODUCTS.filter((p) => p.category === "womens");
const BAGS = PRODUCTS.filter((p) => p.category === "accessories");
const LOWEST = Math.min(...ALL_LISTINGS.map((l) => l.price));

/** Portrait photos only, for the drifting "silk wall" in the hero. */
const WALL = PRODUCTS.flatMap((p) => photosOf(p).filter((src) => MEDIA[src] && MEDIA[src].h > MEDIA[src].w * 1.1).slice(0, 2));
const columns = [0, 1, 2, 3].map((c) => WALL.filter((_, i) => i % 4 === c));

const cover = (p: Product) => photosOf(p).find((src) => MEDIA[src] && MEDIA[src].h > MEDIA[src].w * 1.05) ?? photosOf(p)[0] ?? p.images[0];

type Kind = "all" | "womens" | "accessories";
type SizeFilter = "any" | "S" | "M" | "L" | "One size";

export function EbayEdit() {
  const root = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<Kind>("all");
  const [size, setSize] = useState<SizeFilter>("any");
  const [hover, setHover] = useState<string | null>(null);
  const [plate, setPlate] = useState(1);

  const rows = useMemo(
    () =>
      ALL_LISTINGS.filter((l) => (kind === "all" || l.product.category === kind) && (size === "any" || (l.size || "One size") === size || (size === "One size" && l.size === "Medium"))),
    [kind, size],
  );

  useGSAP(
    () => {
      if (!motionOK()) return;

      // ── Hero intro: counter runs to 28 once the preloader lifts.
      const intro = () => {
        const n = { v: 0 };
        gsap.to(n, {
          v: ALL_LISTINGS.length,
          duration: 2.2,
          ease: "expo.out",
          onUpdate: () => {
            const el = root.current?.querySelector("[data-count]");
            if (el) el.textContent = String(Math.round(n.v)).padStart(2, "0");
          },
        });
        gsap.fromTo("[data-hero-in]", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.2, stagger: 0.09, delay: 0.25 });
        gsap.fromTo("[data-wall]", { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.4, ease: "expo.out" });
      };
      const w = window as Window & { __tvvIntroDone?: boolean };
      gsap.set("[data-hero-in]", { opacity: 0 });
      if (w.__tvvIntroDone) intro();
      else window.addEventListener("tvv:intro-done", intro, { once: true });

      gsap.to("[data-wall]", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom top", scrub: true },
      });

      // ── Plates: pinned horizontal travel on desktop.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = root.current?.querySelector<HTMLElement>("[data-track]");
        const section = root.current?.querySelector<HTMLElement>("[data-plates]");
        if (!track || !section) return;
        const distance = () => track.scrollWidth - window.innerWidth;
        const travel = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setPlate(Math.min(PRODUCTS.length, Math.max(1, Math.round(self.progress * (PRODUCTS.length - 1)) + 1)));
              gsap.set("[data-bar]", { scaleX: self.progress });
            },
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-plate-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: travel, start: "left right", end: "right left", scrub: true } },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-plate-copy]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, ease: "power2.out", scrollTrigger: { trigger: el, containerAnimation: travel, start: "left 88%", end: "left 60%", scrub: true } },
          );
        });
      });

      // ── Ledger preview follows the cursor (fine pointers only).
      if (window.matchMedia("(pointer: fine)").matches && preview.current) {
        const xTo = gsap.quickTo(preview.current, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(preview.current, "y", { duration: 0.6, ease: "power3" });
        const move = (e: PointerEvent) => {
          xTo(e.clientX + 28);
          yTo(e.clientY - 120);
        };
        window.addEventListener("pointermove", move);
        return () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("tvv:intro-done", intro);
          mm.revert();
        };
      }
      return () => {
        window.removeEventListener("tvv:intro-done", intro);
        mm.revert();
      };
    },
    { scope: root },
  );

  // Re-measure pins when the ledger height changes with filters.
  useGSAP(() => {
    ScrollTrigger.refresh();
  }, { dependencies: [rows.length] });

  return (
    <div ref={root}>
      {/* ───────────── HERO ───────────── */}
      <section data-hero className="on-dark grain relative min-h-[100svh] overflow-hidden bg-ink text-ivory lg:h-[100svh] lg:min-h-[640px]">
        <div data-wall className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-3 opacity-60 sm:grid-cols-4 lg:left-[38%]" aria-hidden>
          {columns.map((col, c) => (
            <div key={c} className={`relative overflow-hidden ${c === 3 ? "hidden sm:block" : ""}`}>
              <div className={c % 2 ? "animate-drift-down" : "animate-drift-up"} style={{ animationDuration: `${46 + c * 9}s` }}>
                {[...col, ...col].map((src, i) => (
                  <div key={`${src}-${i}`} className="relative mb-3 aspect-[3/4] w-full overflow-hidden bg-ink-soft">
                    <Image src={src} alt="" fill sizes="(min-width:1024px) 16vw, 33vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30 lg:bg-gradient-to-r lg:from-ink lg:from-35% lg:via-ink/60 lg:to-ink/10" />

        <div className="container-x relative flex min-h-[100svh] flex-col justify-end pb-16 pt-28 lg:h-full lg:min-h-0 lg:justify-center lg:pb-0">
          <p data-hero-in className="eyebrow flex items-center gap-3 text-ivory/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Live on eBay · {EBAY_STORE.seller}
          </p>
          <h1 className="mt-6">
            <span data-count className="display block text-[clamp(7rem,22vw,19rem)] leading-[0.8] text-ivory">
              {String(ALL_LISTINGS.length).padStart(2, "0")}
            </span>
            <span data-hero-in className="display mt-4 block max-w-[14ch] text-[clamp(2.2rem,4.8vw,4.4rem)] leading-[1.02]">
              listings, live now — <em className="text-gold">as they really are.</em>
            </span>
          </h1>
          <p data-hero-in className="mt-6 max-w-md leading-relaxed text-ivory/75">
            Every Thanh Van Viet listing on eBay, gathered in one place with its own photographs. Ten áo dài in brocade, satin, organza and chiffon, and eight woven bags — each size its own listing, each a click from checkout.
          </p>
          <dl data-hero-in className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 gap-y-5 border-t border-ivory/15 pt-6 sm:grid-cols-4">
            {[
              [String(AO_DAI.length), "áo dài"],
              [String(BAGS.length), "bags"],
              [formatAUD(LOWEST), "from"],
              ["VIC", "ships from"],
            ].map(([v, k]) => (
              <div key={k}>
                <dt className="text-[0.6rem] uppercase tracking-[0.28em] text-ivory/50">{k}</dt>
                <dd className="display mt-1 text-3xl">{v}</dd>
              </div>
            ))}
          </dl>
          <div data-hero-in className="mt-10 flex flex-wrap gap-4">
            <Magnetic>
              <a href="#plates" className="btn-outline-light">
                Browse the pieces ↓
              </a>
            </Magnetic>
            <a href={EBAY_STORE.storeUrl} target="_blank" rel="noopener" className="link-underline eyebrow self-center text-ivory/80">
              Open the eBay store ↗
            </a>
          </div>
        </div>
      </section>

      {/* ───────────── PLATES (pinned horizontal on desktop) ───────────── */}
      <section id="plates" data-plates aria-label="The pieces" className="relative overflow-hidden bg-ivory lg:h-[100svh]">
        <div className="container-x flex items-end justify-between gap-6 pb-8 pt-20 lg:absolute lg:inset-x-0 lg:top-0 lg:z-10 lg:pt-[104px]">
          <div>
            <p className="eyebrow text-crimson">The plates</p>
            <p className="display mt-3 text-[clamp(2rem,3.6vw,3.2rem)] leading-none">Eighteen pieces, twenty-eight listings</p>
          </div>
          <p className="hidden shrink-0 font-serif text-2xl tabular-nums lg:block" aria-hidden>
            <span className="text-crimson">{String(plate).padStart(2, "0")}</span>
            <span className="text-stone"> / {PRODUCTS.length}</span>
          </p>
        </div>

        <div className="no-scrollbar snap-x snap-mandatory overflow-x-auto lg:snap-none lg:flex lg:h-full lg:items-end lg:overflow-visible lg:pb-14">
          <ol data-track className="flex w-max gap-4 px-4 pb-16 sm:gap-6 sm:px-8 lg:gap-10 lg:px-14 lg:pb-0">
            {PRODUCTS.map((p, i) => (
              <li key={p.slug} className="w-[78vw] shrink-0 snap-center sm:w-[46vw] lg:w-[25vw] xl:w-[22vw]">
                <TLink href={`/product/${p.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-rice lg:h-[calc(100svh-410px)] lg:max-h-[620px] lg:min-h-[380px] lg:w-full lg:aspect-auto">
                  <div data-plate-img className="absolute -inset-x-[10%] inset-y-0">
                    <Image
                      src={cover(p)}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 30vw, 80vw"
                      className={`${fitClass(cover(p))} transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.05]`}
                    />
                  </div>
                  <span className="absolute left-3 top-3 bg-ivory/90 px-2 py-1 font-serif text-sm tabular-nums">Nº {String(i + 1).padStart(2, "0")}</span>
                  <span className="absolute bottom-3 right-3 bg-ink/80 px-2 py-1 text-[0.58rem] uppercase tracking-[0.2em] text-ivory">
                    {p.listings.length} {p.listings.length === 1 ? "listing" : "listings"}
                  </span>
                </TLink>
                <div data-plate-copy className="mt-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="display text-lg leading-snug">
                      <TLink href={`/product/${p.slug}`} className="hover:text-crimson">
                        {p.name}
                      </TLink>
                    </h2>
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/15" style={{ background: p.colours[0].hex }} />
                  </div>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {p.listings.map((l) => (
                      <li key={l.id}>
                        <a
                          href={EBAY_STORE.itemUrl(l.id)}
                          target="_blank"
                          rel="noopener"
                          className="inline-flex items-center gap-1.5 border border-line px-2 py-1 text-[0.65rem] transition-colors hover:border-crimson hover:bg-crimson hover:text-ivory"
                          aria-label={`Buy ${p.name}${l.size ? `, size ${l.size}` : ""}, on eBay for ${formatAUD(l.price)}`}
                        >
                          <span className="font-medium">{l.size || "One size"}</span>
                          <span className="opacity-60">{formatAUD(l.price)} ↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
            <li className="flex w-[78vw] shrink-0 flex-col justify-center sm:w-[46vw] lg:w-[24vw]">
              <p className="eyebrow text-crimson">That’s the edit</p>
              <p className="display mt-3 text-4xl leading-tight">Every listing, one line each.</p>
              <a href="#ledger" className="link-underline eyebrow mt-6 self-start">
                Read the ledger ↓
              </a>
            </li>
          </ol>
        </div>
        <div className="absolute inset-x-14 bottom-6 hidden h-px bg-line lg:block" aria-hidden>
          <div data-bar className="h-full origin-left scale-x-0 bg-crimson" />
        </div>
      </section>

      {/* ───────────── LEDGER ───────────── */}
      <section id="ledger" className="border-t border-line bg-rice/40 py-24 lg:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-crimson">The ledger</p>
              <p className="display mt-3 max-w-[16ch] text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.02]">All {ALL_LISTINGS.length} listings, in store order</p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-stone">
                Exactly as they appear on eBay — title, size, item number and price. Áo dài are cut to Vietnamese sizing and run smaller than Australian sizes;{" "}
                <TLink href="/size-guide" className="link-underline text-crimson">
                  check the cm chart
                </TLink>
                .
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Filter label="Show" value={kind} onChange={(v) => setKind(v as Kind)} options={[["all", "All"], ["womens", "Áo dài"], ["accessories", "Bags"]]} />
              <Filter label="Size" value={size} onChange={(v) => setSize(v as SizeFilter)} options={[["any", "Any"], ["S", "S"], ["M", "M"], ["L", "L"], ["One size", "Bags"]]} />
            </div>
          </div>

          <p className="mt-12 text-xs text-stone" aria-live="polite">
            {rows.length} of {ALL_LISTINGS.length} listings
          </p>
          <ol className="mt-3 border-t border-ink/80" onPointerLeave={() => setHover(null)}>
            {rows.map((l) => {
              const img = cover(l.product);
              return (
                <li key={l.id} className="border-b border-line">
                  <a
                    href={EBAY_STORE.itemUrl(l.id)}
                    target="_blank"
                    rel="noopener"
                    onPointerEnter={() => setHover(img)}
                    onFocus={() => setHover(null)}
                    className="group grid grid-cols-[3.25rem_1fr_auto] items-center gap-x-4 gap-y-1 py-4 transition-colors hover:bg-ivory sm:grid-cols-[3.5rem_4rem_1fr_5rem_8rem_6rem_2rem] sm:gap-x-6 sm:px-3"
                  >
                    <span className="row-span-2 font-serif text-2xl tabular-nums text-stone transition-colors group-hover:text-crimson sm:row-span-1">
                      {String(l.n).padStart(2, "0")}
                    </span>
                    <span className="relative hidden aspect-[3/4] w-12 overflow-hidden bg-rice sm:block">
                      <Image src={img} alt="" fill sizes="64px" className={fitClass(img)} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm sm:text-[0.95rem]">{l.title}</span>
                      <span className="mt-0.5 block truncate text-[0.62rem] uppercase tracking-[0.2em] text-stone">{l.product.name}</span>
                    </span>
                    <span className="text-right text-sm sm:text-left">{l.size || "One size"}</span>
                    <span className="col-start-2 text-[0.65rem] tabular-nums text-stone sm:col-start-auto sm:text-xs">item {l.id}</span>
                    <span className="text-right text-sm tabular-nums sm:text-left">{formatAUD(l.price)}</span>
                    <span aria-hidden className="hidden text-right transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-crimson sm:block">
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Cursor preview */}
      <div
        ref={preview}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden aspect-[3/4] w-52 overflow-hidden bg-rice shadow-2xl transition-opacity duration-300 [@media(pointer:fine)]:block ${hover ? "opacity-100" : "opacity-0"}`}
      >
        {hover && <Image src={hover} alt="" fill sizes="208px" className={fitClass(hover)} />}
      </div>

      {/* ───────────── CLOSE ───────────── */}
      <section className="on-dark bg-crimson text-ivory">
        <div className="container-x grid gap-10 py-20 lg:grid-cols-2 lg:items-end lg:py-28">
          <p className="display max-w-[16ch] text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.02]">Can’t see your size or colour?</p>
          <div>
            <p className="max-w-md leading-relaxed text-ivory/80">
              Most pieces come in more sizes than are listed today. Tell us the piece, the size and the date you need it, and we’ll list it for you or find it.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Size request")}`} className="btn-outline-light">
                Ask for a size
              </a>
              <a href={EBAY_STORE.storeUrl} target="_blank" rel="noopener" className="link-underline eyebrow self-center text-ivory/85">
                Visit the eBay store ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div role="group" aria-label={label} className="flex items-center gap-3">
      <span className="eyebrow w-10 text-stone">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={value === v}
            className={`border px-3 py-1.5 text-xs transition-colors duration-300 ${value === v ? "border-ink bg-ink text-ivory" : "border-line bg-ivory hover:border-ink"}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
