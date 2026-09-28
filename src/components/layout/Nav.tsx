"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TLink } from "@/components/motion/PageTransition";
import { useStore } from "@/lib/store";
import { useLenis } from "@/components/motion/SmoothScroll";
import { gsap, motionOK } from "@/lib/gsap";
import { DARK_HERO_ROUTES, PRIMARY_NAV, SECONDARY_NAV, SERVICE_NAV } from "./nav-links";
import { SITE } from "@/lib/format";
import { asset } from "@/lib/asset";

function BagIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
      <path d="M2 6h14l-1 13H3L2 6Z" stroke="currentColor" strokeWidth="1.1" />
      <path d="M6 8V4.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function Nav() {
  const rawPath = usePathname();
  // trailingSlash: true → "/about/"; normalise for route matching.
  const pathname = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
  const { count, openCart, ready } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overHero = DARK_HERO_ROUTES.includes(pathname);
  const transparent = overHero && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Close the menu on navigation.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ivory focus:px-4 focus:py-2">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,color,border-color] duration-700 ease-[var(--ease-silk)] ${
          transparent
            ? "on-dark border-b border-transparent bg-transparent text-ivory"
            : "border-b border-line/70 bg-ivory/92 text-ink backdrop-blur-md"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-6 lg:h-[76px]">
          {/* Left — desktop primary nav / mobile menu button */}
          <nav aria-label="Primary" className="hidden flex-1 xl:block">
            <ul className="flex items-center gap-5 2xl:gap-7">
              {PRIMARY_NAV.map((l) => (
                <li key={l.href}>
                  <TLink
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="link-underline whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.17em]"
                  >
                    {l.label}
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-1 items-center xl:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-ml-2 flex items-center gap-3 p-2 text-[0.66rem] font-medium uppercase tracking-[0.24em]"
            >
              <span className="relative block h-3 w-6" aria-hidden>
                <span className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-500 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px bg-current transition-all duration-500 ${menuOpen ? "w-6 -translate-y-[5px] -rotate-45" : "w-4"}`} />
              </span>
              <span className="hidden sm:inline">{menuOpen ? "Close" : "Menu"}</span>
              <span className="sr-only sm:hidden">{menuOpen ? "Close menu" : "Open menu"}</span>
            </button>
          </div>

          {/* Centre — wordmark */}
          <TLink href="/" aria-label="Thanh Van Viet — home" className="relative block shrink-0">
            <Image
              src={asset("/brand/wordmark-ivory.png")}
              alt=""
              width={1128}
              height={153}
              priority
              unoptimized
              className={`h-auto w-[150px] transition-opacity duration-700 sm:w-[190px] lg:w-[210px] ${transparent ? "opacity-100" : "opacity-0"}`}
            />
            <Image
              src={asset("/brand/wordmark-red.png")}
              alt=""
              width={1128}
              height={153}
              priority
              unoptimized
              className={`absolute inset-0 h-auto w-[150px] transition-opacity duration-700 sm:w-[190px] lg:w-[210px] ${transparent ? "opacity-0" : "opacity-100"}`}
            />
          </TLink>

          {/* Right — secondary + bag */}
          <div className="flex flex-1 items-center justify-end gap-7">
            <nav aria-label="Secondary" className="hidden xl:block">
              <ul className="flex items-center gap-5 2xl:gap-7">
                {SECONDARY_NAV.map((l) => (
                  <li key={l.href}>
                    <TLink
                      href={l.href}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      className="link-underline whitespace-nowrap text-[0.62rem] font-medium uppercase tracking-[0.17em]"
                    >
                      {l.label}
                    </TLink>
                  </li>
                ))}
              </ul>
            </nav>
            <button
              type="button"
              onClick={openCart}
              className="relative -mr-2 flex items-center gap-2 p-2"
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <BagIcon />
              <span className="hidden text-[0.66rem] font-medium uppercase tracking-[0.22em] sm:inline">Bag</span>
              {ready && count > 0 && (
                <span className="absolute -right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-crimson px-1 text-[0.6rem] font-semibold leading-none text-ivory sm:static sm:ml-0.5">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} isActive={isActive} />
    </>
  );
}

function MobileMenu({ open, onClose, isActive }: { open: boolean; onClose: () => void; isActive: (h: string) => boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const items = [...PRIMARY_NAV, ...SECONDARY_NAV];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      if (motionOK()) {
        gsap.fromTo(el.querySelectorAll("[data-mi]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.045, delay: 0.15 });
        gsap.fromTo(el.querySelectorAll("[data-mf]"), { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.5 });
      }
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [open, lenis, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={ref}
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-[55] flex flex-col bg-ivory pt-16 transition-[clip-path] duration-700 ease-[var(--ease-silk)] xl:hidden ${
        open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
      }`}
    >
      <Image
        src={asset("/brand/mark-red.png")}
        alt=""
        width={537}
        height={630}
        unoptimized
        className="pointer-events-none absolute -bottom-10 -right-16 w-[70vw] max-w-[420px] opacity-[0.06]"
      />
      <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pt-8">
        <ul className="space-y-1">
          {items.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <TLink
                href={l.href}
                onClick={onClose}
                aria-current={isActive(l.href) ? "page" : undefined}
                data-mi
                className="group flex items-baseline gap-4 py-1.5"
              >
                <span className="w-6 text-[0.62rem] tracking-[0.2em] text-stone">{String(i + 1).padStart(2, "0")}</span>
                <span className={`display text-[2.1rem] leading-[1.15] sm:text-5xl ${isActive(l.href) ? "text-crimson italic" : "group-hover:text-crimson"}`}>
                  {l.label}
                </span>
              </TLink>
            </li>
          ))}
        </ul>
      </nav>
      <div data-mf className="container-x border-t border-line py-6 text-sm">
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2">
          {SERVICE_NAV.slice(0, 2).map((l) => (
            <TLink key={l.href} href={l.href} onClick={onClose} className="eyebrow text-stone">
              {l.label}
            </TLink>
          ))}
        </div>
        <a href={`mailto:${SITE.email}`} className="block text-ink">
          {SITE.email}
        </a>
        <p className="mt-1 text-stone">Melbourne · Australia</p>
      </div>
    </div>
  );
}
