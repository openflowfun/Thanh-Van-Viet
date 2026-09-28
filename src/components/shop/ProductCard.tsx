"use client";

import Image from "next/image";
import { TLink } from "@/components/motion/PageTransition";
import { useStore } from "@/lib/store";
import { formatAUD } from "@/lib/format";
import type { Product } from "@/lib/products";

export function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden>
      <path
        d="M9 15S1.5 10.4 1.5 5.2A3.7 3.7 0 0 1 9 3.4a3.7 3.7 0 0 1 7.5 1.8C16.5 10.4 9 15 9 15Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.1"
      />
    </svg>
  );
}

export function ProductCard({ product: p, priority = false, sizes = "(min-width:1024px) 25vw, 50vw" }: { product: Product; priority?: boolean; sizes?: string }) {
  const { add, wishlist, toggleWish } = useStore();
  const wished = wishlist.includes(p.slug);
  const quickSizes = p.sizeGroups ? null : p.sizes;

  return (
    <article className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-rice">
        <TLink href={`/product/${p.slug}`} className="absolute inset-0" aria-label={p.name}>
          <Image
            src={p.images[0]}
            alt={`${p.name} — ${p.colours[0].name}`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-silk)] group-hover:scale-[1.04]"
          />
          {p.images[1] && (
            <Image
              src={p.images[1]}
              alt=""
              fill
              sizes={sizes}
              className="object-cover opacity-0 transition-opacity duration-700 [@media(pointer:fine)]:group-hover:opacity-100"
            />
          )}
        </TLink>

        {p.badge && (
          <span className="pointer-events-none absolute left-3 top-3 bg-ivory/90 px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-crimson">
            {p.badge}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWish(p.slug)}
          aria-pressed={wished}
          aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
          className={`absolute right-2 top-2 p-2 transition-colors ${wished ? "text-crimson" : "text-ink/70 hover:text-crimson"}`}
        >
          <HeartIcon filled={wished} />
        </button>

        {/* Quick add — revealed on hover (desktop) */}
        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full bg-ivory/95 px-3 py-3 backdrop-blur transition-transform duration-500 ease-[var(--ease-silk)] group-focus-within:translate-y-0 group-hover:translate-y-0 [@media(pointer:fine)]:block">
          {quickSizes ? (
            <div className="flex items-center gap-2">
              <span className="mr-1 text-[0.6rem] uppercase tracking-[0.2em] text-stone">Quick add</span>
              <div className="flex flex-wrap gap-1">
                {quickSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => add({ slug: p.slug, colour: p.colours[0].name, size: s })}
                    className="min-w-8 border border-line px-1.5 py-1 text-[0.65rem] hover:border-crimson hover:bg-crimson hover:text-ivory"
                    aria-label={`Add ${p.name}, size ${s}, to bag`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <TLink href={`/product/${p.slug}`} className="block text-center text-[0.62rem] uppercase tracking-[0.22em] hover:text-crimson">
              Choose a size for each wearer →
            </TLink>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="display text-[1.05rem] leading-snug sm:text-lg">
            <TLink href={`/product/${p.slug}`} className="hover:text-crimson">
              {p.name}
            </TLink>
          </h3>
          <div className="mt-2 flex gap-1.5" aria-label={`Colours: ${p.colours.map((c) => c.name).join(", ")}`}>
            {p.colours.map((c) => (
              <span key={c.name} className="h-2.5 w-2.5 rounded-full ring-1 ring-ink/10" style={{ background: c.hex }} />
            ))}
          </div>
        </div>
        <p className="shrink-0 text-sm transition-opacity duration-500 [@media(pointer:fine)]:opacity-60 [@media(pointer:fine)]:group-hover:opacity-100">
          {p.compareAt && <span className="mr-2 text-stone line-through">{formatAUD(p.compareAt)}</span>}
          {formatAUD(p.price)}
        </p>
      </div>
    </article>
  );
}
