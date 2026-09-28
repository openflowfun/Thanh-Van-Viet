import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { ContactForm } from "@/components/ui/ContactForm";
import { TLink } from "@/components/motion/PageTransition";
import { SITE } from "@/lib/format";
import { IMG } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact",
  description: `Questions about fit, an order or a family occasion? Email ${SITE.email} — Thanh Van Viet, Melbourne. We reply within 1–2 business days.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Write to us"
        kicker="Fit questions, an order, a wedding date to plan around — we read every message and reply ourselves."
        crumbs={[{ href: "/contact", label: "Contact" }]}
        image={IMG.orangeLantern}
        imageAlt="A woman in a saffron áo dài beneath a silk lantern"
      />
      <section className="container-x grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
        <div className="space-y-10 lg:col-span-4">
          <div data-reveal>
            <p className="eyebrow text-stone">Email</p>
            <a href={`mailto:${SITE.email}`} className="display mt-3 block break-words text-2xl text-crimson hover:underline sm:text-3xl">
              {SITE.email}
            </a>
          </div>
          <div data-reveal>
            <p className="eyebrow text-stone">Studio</p>
            <p className="mt-3 text-lg">Melbourne, Australia</p>
            <p className="mt-1 text-sm text-stone">Online only for now — no showroom visits yet.</p>
          </div>
          <div data-reveal>
            <p className="eyebrow text-stone">Hours</p>
            <p className="mt-3 text-lg">We reply within 1–2 business days.</p>
            <p className="mt-1 text-sm text-stone">Monday to Friday, Melbourne time. Allow a little longer in the weeks before Tết.</p>
          </div>
          <div data-reveal className="border-t border-line pt-8 text-sm text-stone">
            Looking for sizing help first? The{" "}
            <TLink href="/size-guide" className="link-underline text-ink">
              size guide
            </TLink>{" "}
            and{" "}
            <TLink href="/shipping-returns" className="link-underline text-ink">
              shipping &amp; returns
            </TLink>{" "}
            pages answer most questions.
          </div>
        </div>
        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
