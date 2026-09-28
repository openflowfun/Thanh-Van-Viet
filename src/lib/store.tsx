"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "./products";

/**
 * Mock commerce state (cart + wishlist) persisted to localStorage.
 * When a real backend arrives (Shopify Storefront, Medusa, Stripe…),
 * replace the bodies of these actions — the component API can stay.
 */

export type CartLine = {
  id: string; // slug + variant key
  slug: string;
  colour: string;
  size: string;
  qty: number;
};

type Store = {
  ready: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "id" | "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const Ctx = createContext<Store | null>(null);

const CART_KEY = "tvv.cart.v1";
const WISH_KEY = "tvv.wishlist.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — keep in memory */
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Hydrate from storage once on mount (client only).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLines(read<CartLine[]>(CART_KEY, []).filter((l) => getProduct(l.slug)));
    setWishlist(read<string[]>(WISH_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) write(CART_KEY, lines);
  }, [lines, ready]);
  useEffect(() => {
    if (ready) write(WISH_KEY, wishlist);
  }, [wishlist, ready]);

  const add = useCallback<Store["add"]>((line, qty = 1) => {
    const id = `${line.slug}__${line.colour}__${line.size}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) return prev.map((l) => (l.id === id ? { ...l, qty: Math.min(l.qty + qty, 10) } : l));
      return [...prev, { ...line, id, qty }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 10) } : l)),
    );
  }, []);

  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const toggleWish = useCallback((slug: string) => {
    setWishlist((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  }, []);

  const value = useMemo<Store>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + (getProduct(l.slug)?.price ?? 0) * l.qty, 0);
    return {
      ready,
      lines,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      wishlist,
      toggleWish,
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
    };
  }, [ready, lines, wishlist, cartOpen, add, setQty, remove, clear, toggleWish]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
