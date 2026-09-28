"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { useLenis } from "@/components/motion/SmoothScroll";
import { TLink } from "@/components/motion/PageTransition";
import { CartLineItem, FreeShippingBar } from "@/components/shop/CartLineItem";
import { formatAUD, SITE } from "@/lib/format";

export function CartDrawer() {
  const { cartOpen, closeCart, lines, subtotal, count } = useStore();
  const lenis = useLenis();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!cartOpen) {
      lenis?.start();
      return;
    }
    lenis?.stop();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cartOpen, lenis, closeCart]);

  return (
    <div className={`fixed inset-0 z-[70] ${cartOpen ? "" : "pointer-events-none"}`} aria-hidden={!cartOpen} inert={!cartOpen}>
      <div
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-700 ${cartOpen ? "opacity-100" : "opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        data-lenis-prevent
        className={`absolute right-0 top-0 flex h-full w-full max-w-[440px] flex-col bg-ivory shadow-2xl transition-transform duration-700 ease-[var(--ease-silk)] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="display text-2xl">
            Your bag <span className="align-top text-xs text-stone">({count})</span>
          </h2>
          <button ref={closeBtn} type="button" onClick={closeCart} className="eyebrow link-underline">
            Close
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="display text-3xl">Your bag is empty.</p>
            <p className="mt-3 max-w-xs text-sm text-stone">Begin with an áo dài, or something small and silk for someone you love.</p>
            <TLink href="/collections/womens-ao-dai" className="btn-primary mt-8">
              Shop Áo Dài
            </TLink>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4">
              <FreeShippingBar subtotal={subtotal} threshold={SITE.freeShippingThreshold} />
            </div>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <CartLineItem key={l.id} line={l} />
              ))}
            </ul>
            <div className="border-t border-line px-6 pb-6 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="display text-2xl">{formatAUD(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-stone">Shipping and GST calculated at checkout. Prices in AUD.</p>
              <TLink href="/cart" className="btn-primary mt-5 w-full">
                View bag &amp; checkout
              </TLink>
              <button type="button" onClick={closeCart} className="btn-outline mt-3 w-full">
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
