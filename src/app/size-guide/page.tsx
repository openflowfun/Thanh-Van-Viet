import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SizeChartTable } from "@/components/shop/SizeChartTable";
import { HOW_TO_MEASURE, SIZE_CHARTS } from "@/lib/size-charts";
import { SITE } from "@/lib/format";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Áo dài size charts in centimetres — weight, bust and waist for women; bust, waist, hip and height for children. Vietnamese sizing runs smaller than Australian sizes.",
  alternates: { canonical: "/size-guide" },
};

const SECTIONS = [
  { id: "women", chart: SIZE_CHARTS.women },
  { id: "girls", chart: SIZE_CHARTS.girls },
  { id: "boys", chart: SIZE_CHARTS.boys },
  { id: "slippers", chart: SIZE_CHARTS.slippers },
];

export default function SizeGuidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Size guide"
        title="Measure, don’t guess"
        kicker="An áo dài is cut close through the bust and waist, and Vietnamese sizing runs slimmer than Australian S, M, L. Five minutes with a tape measure is the best fitting you can have."
        crumbs={[{ href: "/size-guide", label: "Size guide" }]}
      />

      <nav aria-label="Size charts" className="container-x mt-12">
        <ul className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="inline-block border border-line px-4 py-2 text-xs uppercase tracking-[0.18em] hover:border-ink">
                {s.chart.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="container-x grid gap-16 py-20 lg:grid-cols-12 lg:py-24">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="eyebrow text-crimson">How to measure</p>
            <ol className="mt-6 space-y-6">
              {HOW_TO_MEASURE.map((m, i) => (
                <li key={m.part} className="flex gap-4" data-reveal>
                  <span className="display text-2xl italic text-crimson">{i + 1}</span>
                  <div>
                    <p className="font-medium">{m.part}</p>
                    <p className="mt-1 text-sm leading-relaxed text-stone">{m.how}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10 border-t border-line pt-8">
              <p className="display text-2xl">Need a fit note?</p>
              <p className="mt-2 text-sm leading-relaxed text-stone">
                Send us your four measurements, the piece you love and your date. We’ll reply with a size recommendation within 1–2 business days.
              </p>
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Fit note request")}`} className="btn-outline mt-6">
                Email us
              </a>
            </div>
          </div>
        </aside>
        <div className="space-y-20 lg:col-span-8">
          {SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-32" data-reveal>
              <SizeChartTable chart={s.chart} />
            </div>
          ))}
          <div data-reveal className="bg-rice/70 p-8 sm:p-10">
            <p className="eyebrow text-crimson">A note on fit</p>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-ink/80">
              <li>— If you are between sizes, choose the larger. An áo dài is easy to take in, and impossible to let out.</li>
              <li>— The áo should skim the body without pulling across the bust when you sit. Side slits should begin just above the waist.</li>
              <li>— Quần (trousers) are worn long: they should brush the floor in the shoes you’ll wear.</li>
              <li>— For children, buy for height first, and allow room to grow.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
