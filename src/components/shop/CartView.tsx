"use client";

import Image from "next/image";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import { formatAUD, SITE } from "@/lib/format";
import { CartLineItem, FreeShippingBar } from "./CartLineItem";
import { ProductCard } from "./ProductCard";
import { TLink } from "@/components/motion/PageTransition";
import { LotusDivider } from "@/components/ui/Lotus";
import { EBAY_STORE } from "@/lib/catalog-data";

const STANDARD_SHIPPING = 9.95;

type Confirmed = { ref: string; total: number; items: { name: string; image: string; qty: number; variant: string }[] };

export function CartView() {
  const { ready, lines, subtotal, clear, wishlist } = useStore();
  const [confirmed, setConfirmed] = useState<Confirmed | null>(null);
  const shipping = subtotal >= SITE.freeShippingThreshold || subtotal === 0 ? 0 : STANDARD_SHIPPING;
  const total = subtotal + shipping;
  const gst = total / 11;
  const saved = wishlist.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p);

  if (confirmed) {
    return (
      <section className="container-x flex flex-col items-center py-20 text-center lg:py-28" role="status">
        <LotusDivider className="max-w-[220px]" />
        <p className="eyebrow mt-10 text-crimson">Order {confirmed.ref}</p>
        <h2 className="display mt-4 max-w-[14ch] text-[clamp(2.6rem,6vw,5rem)] leading-[1]">Cảm ơn — thank you.</h2>
        <p className="mt-6 max-w-lg leading-relaxed text-stone">
          This was a preview of our checkout, so no payment was taken and nothing will be sent. Live checkout is coming soon with Australian payments, Apple Pay and Google Pay.
        </p>
        <ul className="mt-12 flex flex-wrap justify-center gap-4">
          {confirmed.items.map((it) => (
            <li key={it.name + it.variant} className="w-28 text-left">
              <div className="relative aspect-[3/4] overflow-hidden bg-rice">
                <Image src={it.image} alt={it.name} fill sizes="112px" className="object-cover" />
              </div>
              <p className="mt-2 text-xs leading-snug">{it.name}</p>
              <p className="text-[0.65rem] text-stone">
                ×{it.qty} · {it.variant}
              </p>
            </li>
          ))}
        </ul>
        <p className="display mt-10 text-2xl">{formatAUD(confirmed.total)}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <TLink href="/shop" className="btn-primary">
            Continue browsing
          </TLink>
          <a href={`mailto:${SITE.email}`} className="btn-outline">
            Email us to order now
          </a>
        </div>
      </section>
    );
  }

  if (!ready) return <div className="container-x min-h-[40vh]" aria-busy="true" />;

  return (
    <>
      {lines.length === 0 ? (
        <section className="container-x flex flex-col items-center py-24 text-center">
          <p className="display text-4xl">Your bag is empty.</p>
          <p className="mt-4 max-w-sm text-stone">Begin with an áo dài, or something small and silk for someone you love.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <TLink href="/collections/womens-ao-dai" className="btn-primary">
              Shop áo dài
            </TLink>
            <TLink href="/collections/accessories" className="btn-outline">
              Accessories &amp; gifts
            </TLink>
          </div>
        </section>
      ) : (
        <section className="container-x grid gap-14 pb-24 pt-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ul className="divide-y divide-line border-y border-line">
              {lines.map((l) => (
                <CartLineItem key={l.id} line={l} large />
              ))}
            </ul>
          </div>
          <aside className="lg:col-span-5">
            <div className="bg-rice/70 p-6 sm:p-10 lg:sticky lg:top-28">
              <h2 className="display text-3xl">Summary</h2>
              <div className="mt-6">
                <FreeShippingBar subtotal={subtotal} threshold={SITE.freeShippingThreshold} />
              </div>
              <dl className="mt-8 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatAUD(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Shipping — Australia, 3–7 business days</dt>
                  <dd>{shipping === 0 ? "Free" : formatAUD(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-4 text-base">
                  <dt className="eyebrow self-center">Total</dt>
                  <dd className="display text-3xl">{formatAUD(total)}</dd>
                </div>
                <p className="text-right text-xs text-stone">Includes {formatAUD(gst)} GST</p>
              </dl>
              <div className="mt-8 border-t border-line pt-6">
                <p className="eyebrow text-crimson">Buy on eBay today</p>
                <p className="mt-2 text-xs leading-relaxed text-stone">Our own checkout is coming soon. Every piece in your bag is live on eBay — one tap each, buyer-protected.</p>
                <ul className="mt-4 space-y-2">
                  {lines.map((l) => {
                    const p = getProduct(l.slug);
                    const listing = p?.listings.find((x) => (x.size || "One size") === l.size) ?? (p?.listings.length === 1 ? p.listings[0] : undefined);
                    if (!p || !listing) return null;
                    return (
                      <li key={l.id}>
                        <a href={EBAY_STORE.itemUrl(listing.id)} target="_blank" rel="noopener" className="group flex items-center justify-between gap-3 border border-line bg-ivory px-4 py-3 text-sm transition-colors hover:border-crimson">
                          <span className="min-w-0 truncate">
                            {p.name} <span className="text-stone">· {l.size}</span>
                          </span>
                          <span className="shrink-0 text-crimson">{formatAUD(listing.price)} ↗</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <button
                type="button"
                className="btn-outline mt-6 w-full py-4"
                onClick={() => {
                  const ref = `TVV-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
                  setConfirmed({
                    ref,
                    total,
                    items: lines.map((l) => {
                      const p = getProduct(l.slug)!;
                      return { name: p.name, image: p.images[0], qty: l.qty, variant: [l.colour, l.size].filter(Boolean).join(" · ") };
                    }),
                  });
                  clear();
                  window.scrollTo({ top: 0 });
                }}
              >
                Checkout (demo)
              </button>
              <p className="mt-4 text-center text-xs leading-relaxed text-stone">
                Live checkout coming with Australian payments (Apple Pay / Google Pay). New Zealand delivery coming soon.
              </p>
            </div>
          </aside>
        </section>
      )}

      {saved.length > 0 && (
        <section className="border-t border-line bg-rice/40 py-20">
          <div className="container-x">
            <p className="eyebrow text-crimson">Your wishlist</p>
            <h2 className="display mt-3 text-4xl">Saved for later</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
              {saved.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
