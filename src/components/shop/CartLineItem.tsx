"use client";

import Image from "next/image";
import { TLink } from "@/components/motion/PageTransition";
import { getProduct } from "@/lib/products";
import { formatAUD } from "@/lib/format";
import { useStore, type CartLine } from "@/lib/store";

export function CartLineItem({ line, large = false, onNavigate }: { line: CartLine; large?: boolean; onNavigate?: () => void }) {
  const { setQty, remove } = useStore();
  const p = getProduct(line.slug);
  if (!p) return null;
  return (
    <li className={`flex gap-4 ${large ? "py-8 sm:gap-8" : "py-5"}`}>
      <TLink href={`/product/${p.slug}`} onClick={onNavigate} className={`relative shrink-0 overflow-hidden bg-rice ${large ? "h-40 w-28 sm:h-52 sm:w-40" : "h-28 w-20"}`}>
        <Image src={p.images[0]} alt={p.name} fill sizes={large ? "160px" : "80px"} className="object-cover" />
      </TLink>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <TLink href={`/product/${p.slug}`} onClick={onNavigate} className={`display block leading-snug hover:text-crimson ${large ? "text-2xl" : "text-lg"}`}>
              {p.name}
            </TLink>
            <p className="mt-1 text-xs text-stone">
              {line.colour}
              {line.size && ` · ${line.size}`}
            </p>
          </div>
          <p className="shrink-0 text-sm">{formatAUD(p.price * line.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-line" role="group" aria-label={`Quantity for ${p.name}`}>
            <button type="button" className="h-9 w-9 text-lg leading-none hover:text-crimson" onClick={() => setQty(line.id, line.qty - 1)} aria-label="Decrease quantity">
              −
            </button>
            <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
              {line.qty}
            </span>
            <button type="button" className="h-9 w-9 text-lg leading-none hover:text-crimson" onClick={() => setQty(line.id, line.qty + 1)} aria-label="Increase quantity">
              +
            </button>
          </div>
          <button type="button" onClick={() => remove(line.id)} className="link-underline text-[0.65rem] uppercase tracking-[0.2em] text-stone hover:text-ink">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function FreeShippingBar({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const pct = Math.min(100, (subtotal / threshold) * 100);
  const remaining = threshold - subtotal;
  return (
    <div>
      <p className="text-xs text-stone">
        {remaining > 0 ? (
          <>
            You’re <span className="text-ink">{formatAUD(remaining)}</span> from free Australian shipping.
          </>
        ) : (
          <>Your order ships free across Australia.</>
        )}
      </p>
      <div className="mt-2 h-px w-full bg-line">
        <div className="h-px bg-crimson transition-[width] duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
