"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { CATEGORIES, OCCASIONS, PRICE_BANDS, type Category, type Occasion, type Product } from "@/lib/products";

const COLOUR_FAMILIES: { key: string; label: string; hex: string; match: string[] }[] = [
  { key: "ivory", label: "Ivory & cream", hex: "#F3EDE3", match: ["Rice Ivory", "Cream", "Pastel Metallic"] },
  { key: "pink", label: "Pink & peach", hex: "#EDB2BF", match: ["Peach Blush", "Blossom Pink", "Blush Pearl"] },
  { key: "gold", label: "Gold", hex: "#E4C98C", match: ["Champagne Gold", "Butter Yellow"] },
  { key: "green", label: "Mint & teal", hex: "#BFE2D5", match: ["Mint", "Lake Teal"] },
  { key: "blue", label: "Blue", hex: "#B7C4D2", match: ["Silver Blue", "Ice Blue", "Sky Blue", "Denim Blue", "Indigo Navy"] },
  { key: "red", label: "Red & terracotta", hex: "#B5452F", match: ["Lacquer Crimson", "Terracotta"] },
  { key: "black", label: "Black", hex: "#141212", match: ["Ink Black"] },
];

type Sort = "featured" | "price-asc" | "price-desc" | "new";

type Props = {
  products: Product[];
  initialCategory?: Category | null;
  initialOccasion?: Occasion | null;
  /** Hide the category filter on collection pages. */
  lockCategory?: boolean;
  /** Read ?category= and ?occasion= from the URL in the browser (static-export friendly). */
  readQuery?: boolean;
  /** Shown instead of the grid when the collection itself has no pieces yet. */
  comingSoon?: React.ReactNode;
};

export function ShopGrid({ products, initialCategory = null, initialOccasion = null, lockCategory = false, readQuery = false, comingSoon }: Props) {
  const [category, setCategory] = useState<Category | null>(initialCategory);
  const [occasions, setOccasions] = useState<Occasion[]>(initialOccasion ? [initialOccasion] : []);
  const [colours, setColours] = useState<string[]>([]);
  const [price, setPrice] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("featured");
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    if (!readQuery) return;
    const q = new URLSearchParams(window.location.search);
    const c = q.get("category");
    const o = q.get("occasion");
    /* eslint-disable react-hooks/set-state-in-effect */
    if (c && CATEGORIES.some((x) => x.key === c)) setCategory(c as Category);
    if (o && OCCASIONS.includes(o as Occasion)) setOccasions([o as Occasion]);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [readQuery]);

  const availableOccasions = useMemo(() => OCCASIONS.filter((o) => products.some((p) => p.occasions.includes(o))), [products]);
  const availableColours = useMemo(
    () => COLOUR_FAMILIES.filter((f) => products.some((p) => p.colours.some((c) => f.match.includes(c.name)))),
    [products],
  );

  const results = useMemo(() => {
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (occasions.length && !occasions.some((o) => p.occasions.includes(o))) return false;
      if (colours.length) {
        const fams = COLOUR_FAMILIES.filter((f) => colours.includes(f.key)).flatMap((f) => f.match);
        if (!p.colours.some((c) => fams.includes(c.name))) return false;
      }
      if (price) {
        const band = PRICE_BANDS.find((b) => b.key === price)!;
        if (p.price < band.min || p.price >= band.max) return false;
      }
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => Number(b.badge === "New") - Number(a.badge === "New"));
    return list;
  }, [products, category, occasions, colours, price, sort]);

  const activeCount = (category && !lockCategory ? 1 : 0) + occasions.length + colours.length + (price ? 1 : 0);
  const reset = () => {
    if (!lockCategory) setCategory(null);
    setOccasions([]);
    setColours([]);
    setPrice(null);
  };
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const filters = (
    <div className="space-y-10">
      {!lockCategory && (
        <FilterGroup title="Category">
          <Chip active={category === null} onClick={() => setCategory(null)}>
            All
          </Chip>
          {CATEGORIES.filter((c) => products.some((p) => p.category === c.key)).map((c) => (
            <Chip key={c.key} active={category === c.key} onClick={() => setCategory(category === c.key ? null : c.key)}>
              {c.label}
            </Chip>
          ))}
        </FilterGroup>
      )}
      <FilterGroup title="Occasion">
        {availableOccasions.map((o) => (
          <Chip key={o} active={occasions.includes(o)} onClick={() => setOccasions(toggle(occasions, o))}>
            {o}
          </Chip>
        ))}
      </FilterGroup>
      <FilterGroup title="Colour">
        {availableColours.map((f) => (
          <Chip key={f.key} active={colours.includes(f.key)} onClick={() => setColours(toggle(colours, f.key))}>
            <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle ring-1 ring-ink/15" style={{ background: f.hex }} />
            {f.label}
          </Chip>
        ))}
      </FilterGroup>
      <FilterGroup title="Price">
        {PRICE_BANDS.filter((b) => products.some((p) => p.price >= b.min && p.price < b.max)).map((b) => (
          <Chip key={b.key} active={price === b.key} onClick={() => setPrice(price === b.key ? null : b.key)}>
            {b.label}
          </Chip>
        ))}
      </FilterGroup>
      {activeCount > 0 && (
        <button type="button" onClick={reset} className="link-underline eyebrow text-crimson">
          Clear all filters
        </button>
      )}
    </div>
  );

  if (comingSoon && products.length === 0) {
    return <div className="container-x pb-28 pt-16 lg:pt-24">{comingSoon}</div>;
  }

  return (
    <div className="container-x pb-28 pt-12 lg:pt-16">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-4 flex items-center justify-between gap-4 border-y border-line bg-ivory/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:top-[76px] lg:-mx-14 lg:px-14">
        <button type="button" onClick={() => setPanelOpen((o) => !o)} aria-expanded={panelOpen} className="eyebrow flex items-center gap-2 lg:hidden">
          Filter {activeCount > 0 && <span className="text-crimson">({activeCount})</span>}
        </button>
        <p className="hidden text-xs text-stone lg:block" aria-live="polite">
          {results.length} {results.length === 1 ? "piece" : "pieces"} · {results.reduce((n, p) => n + p.listings.length, 0)} live eBay listings
        </p>
        <label className="flex items-center gap-3 text-xs">
          <span className="eyebrow hidden text-stone sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="border-0 bg-transparent py-1 pr-7 text-xs uppercase tracking-[0.18em] focus:ring-0"
          >
            <option value="featured">Featured</option>
            <option value="new">New arrivals</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>
      </div>

      {/* Mobile filter panel */}
      <div className={`grid transition-[grid-template-rows] duration-700 ease-[var(--ease-silk)] lg:hidden ${panelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border-b border-line py-8">
            {filters}
            <button type="button" onClick={() => setPanelOpen(false)} className="btn-ink mt-8 w-full">
              Show {results.length} {results.length === 1 ? "piece" : "pieces"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-40">{filters}</div>
        </aside>
        <div className="lg:col-span-9">
          {results.length ? (
            <ul className="grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-16">
              {results.map((p, i) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={i < 3} sizes="(min-width:1024px) 24vw, 50vw" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center py-24 text-center">
              <p className="display text-3xl">Nothing matches just yet.</p>
              <p className="mt-3 text-sm text-stone">Try removing a filter — or write to us, and we will look for it.</p>
              <button type="button" onClick={reset} className="btn-outline mt-8">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4 text-stone">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-3.5 py-2 text-xs transition-colors duration-300 ${
        active ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}
