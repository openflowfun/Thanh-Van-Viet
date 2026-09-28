import { OCCASIONS_MARQUEE } from "./marquee-items";

/** Slow, CSS-only marquee of occasions (pauses for reduced motion). */
export function Marquee({ items = OCCASIONS_MARQUEE, tone = "crimson" }: { items?: string[]; tone?: "crimson" | "ivory" }) {
  const row = [...items, ...items];
  const cls = tone === "crimson" ? "bg-crimson text-ivory" : "bg-ivory text-crimson border-y border-line";
  return (
    <section aria-label="Occasions" className={`${cls} overflow-hidden py-5 sm:py-7`}>
      <div className="animate-marquee flex w-max items-center">
        {row.map((t, i) => (
          <span key={i} aria-hidden={i >= items.length} className="flex items-center">
            <span className="display whitespace-nowrap px-6 text-2xl italic sm:px-10 sm:text-4xl">{t}</span>
            <svg viewBox="0 0 20 16" className="h-3 w-4 opacity-70" aria-hidden>
              <path d="M10 1c3 3 3 8 0 13-3-5-3-10 0-13Zm0 13C6 13 3 10 3 5c4 2 6 5 7 9Zm0 0c4-1 7-4 7-9-4 2-6 5-7 9Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
