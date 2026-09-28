import Image from "next/image";
import { TLink } from "@/components/motion/PageTransition";
import { LotusDivider } from "@/components/ui/Lotus";
import { Newsletter } from "@/components/ui/Newsletter";
import { PRIMARY_NAV, SECONDARY_NAV, SERVICE_NAV } from "./nav-links";
import { SITE } from "@/lib/format";
import { asset } from "@/lib/asset";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-ivory">
      <div className="container-x pb-10 pt-20 lg:pt-28">
        <div className="flex flex-col items-center text-center">
          <Image
            src={asset("/brand/logo-full-ivory.png")}
            alt="Thanh Van Viet — Vietnamese Fashion & Lifestyle"
            width={1128}
            height={929}
            unoptimized
            className="h-auto w-[220px] sm:w-[280px]"
          />
        </div>

        <div className="mt-20 grid gap-12 border-t border-ivory/10 pt-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="eyebrow text-gold">Letters from the house</p>
            <p className="display mt-4 max-w-sm text-2xl leading-snug">New collections, Tết edits and quiet notes on Vietnamese craft.</p>
            <Newsletter tone="dark" className="mt-6 max-w-sm" />
          </div>
          <FooterCol title="Shop" links={PRIMARY_NAV} />
          <FooterCol title="House" links={SECONDARY_NAV} />
          <FooterCol title="Care" links={SERVICE_NAV} />
        </div>

        <div className="mt-16 flex justify-center">
          <LotusDivider tone="gold" className="max-w-[260px] opacity-80" />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-center text-xs text-ivory/55 lg:flex-row lg:text-left">
          <p>
            <a href={`mailto:${SITE.email}`} className="link-underline text-ivory/80">
              {SITE.email}
            </a>
            <span className="mx-3">·</span>Melbourne · Australia
          </p>
          <p>{SITE.shippingNote}</p>
          <p>
            © {year} {SITE.wordmark}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="eyebrow text-ivory/45">{title}</p>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <TLink href={l.href} className="link-underline text-ivory/85 hover:text-ivory">
              {l.label}
            </TLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
