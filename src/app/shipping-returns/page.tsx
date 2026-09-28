import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { TLink } from "@/components/motion/PageTransition";
import { SITE, formatAUD } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Australia-wide delivery in 3–7 business days from Melbourne, free over A$150. New Zealand coming soon. 14-day returns on unworn pieces.",
  alternates: { canonical: "/shipping-returns" },
};

const SHIPPING = [
  { method: "Standard — Australia-wide", time: "3–7 business days", cost: `${formatAUD(9.95)} · free over ${formatAUD(SITE.freeShippingThreshold)}` },
  { method: "Express — Australia-wide", time: "1–3 business days (metro)", cost: formatAUD(14.95) },
  { method: "New Zealand", time: "Coming soon", cost: "—" },
];

const FAQ = [
  {
    q: "When will my order leave?",
    a: "Orders are packed in Melbourne and dispatched within 1–2 business days, with tracking sent by email. In the three weeks before Tết, please allow an extra day.",
  },
  {
    q: "I need it for a date — a wedding, Tết, a photo day.",
    a: "Tell us the date in the order notes or by email. For weddings and tea ceremonies we recommend ordering at least three weeks ahead, so there is time to exchange sizes if needed.",
  },
  {
    q: "Can I return or exchange?",
    a: "Yes. Unworn, unwashed pieces with their tags attached can be returned within 14 days of delivery for an exchange, store credit or refund. Return postage for a change of mind is at your cost; we cover it if something is faulty or we sent the wrong item.",
  },
  {
    q: "Is anything final sale?",
    a: "For hygiene, earrings are final sale. Pieces that have been altered or tailored after delivery cannot be returned.",
  },
  {
    q: "How do I start a return?",
    a: `Email ${SITE.email} with your order number and what you’d like to return. We’ll reply with the return address and next steps within 1–2 business days.`,
  },
  {
    q: "Do you ship to New Zealand?",
    a: "Not yet — New Zealand is next. Join the newsletter and we’ll let you know the day it opens.",
  },
];

export default function ShippingReturnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shipping & returns"
        title="From Melbourne, to your door"
        kicker="Every order is packed by hand in Melbourne and sent Australia-wide. New Zealand coming soon."
        crumbs={[{ href: "/shipping-returns", label: "Shipping & returns" }]}
      />

      <section className="container-x py-20 lg:py-24">
        <div data-reveal className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <caption className="sr-only">Shipping options</caption>
            <thead>
              <tr className="border-b border-ink">
                {["Method", "Delivery", "Cost"].map((h) => (
                  <th key={h} scope="col" className="py-4 pr-6 text-[0.62rem] font-medium uppercase tracking-[0.22em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SHIPPING.map((r) => (
                <tr key={r.method} className="border-b border-line">
                  <th scope="row" className="display py-5 pr-6 text-xl font-normal">
                    {r.method}
                  </th>
                  <td className="py-5 pr-6 text-sm">{r.time}</td>
                  <td className="py-5 text-sm">{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-stone">All prices in AUD and include GST.</p>
      </section>

      <section className="border-t border-line bg-rice/50 py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <h2 className="display text-4xl lg:col-span-4 lg:text-5xl">Questions, answered</h2>
          <dl className="divide-y divide-line border-y border-line lg:col-span-8">
            {FAQ.map((f) => (
              <div key={f.q} data-reveal className="grid gap-3 py-7 sm:grid-cols-5 sm:gap-8">
                <dt className="display text-xl sm:col-span-2">{f.q}</dt>
                <dd className="text-sm leading-relaxed text-ink/80 sm:col-span-3">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x flex flex-col items-start justify-between gap-6 py-20 sm:flex-row sm:items-center">
        <p className="display text-3xl">Still wondering about fit?</p>
        <div className="flex flex-wrap gap-4">
          <TLink href="/size-guide" className="btn-outline">
            Size guide
          </TLink>
          <TLink href="/contact" className="btn-primary">
            Contact us
          </TLink>
        </div>
      </section>
    </>
  );
}
