"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, forwardRef, useCallback, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, motionOK } from "@/lib/gsap";
import { asset, BASE_PATH } from "@/lib/asset";

type Nav = (href: string) => void;
const TransitionContext = createContext<Nav | null>(null);

/**
 * Crimson overlay wipe between routes (~400ms each way).
 * Links opt in via <TLink>, which falls back to normal behaviour for
 * modified clicks, new tabs, hashes and same-page query changes.
 */
export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlay = useRef<HTMLDivElement>(null);
  const covering = useRef(false);

  const navigate = useCallback<Nav>(
    (href) => {
      const norm = (p: string) => (p.startsWith(BASE_PATH) ? p.slice(BASE_PATH.length) : p).replace(/\/+$/, "") || "/";
      if (norm(new URL(href, window.location.origin).pathname) === norm(window.location.pathname) || !motionOK() || !overlay.current) {
        router.push(href);
        return;
      }
      covering.current = true;
      gsap.killTweensOf(overlay.current);
      gsap
        .timeline()
        .set(overlay.current, { display: "flex", transformOrigin: "50% 100%", scaleY: 0 })
        .to(overlay.current, { scaleY: 1, duration: 0.4, ease: "power2.inOut" })
        .add(() => {
          router.push(href);
          // Safety: never leave the curtain down if the route didn't change.
          window.setTimeout(() => {
            if (covering.current && overlay.current) {
              covering.current = false;
              gsap.to(overlay.current, { scaleY: 0, transformOrigin: "50% 0%", duration: 0.45, ease: "power2.inOut", onComplete: () => void gsap.set(overlay.current, { display: "none" }) });
            }
          }, 2500);
        });
    },
    [router],
  );

  useEffect(() => {
    if (!covering.current || !overlay.current) return;
    covering.current = false;
    gsap
      .timeline({ delay: 0.08 })
      .set(overlay.current, { transformOrigin: "50% 0%" })
      .to(overlay.current, { scaleY: 0, duration: 0.45, ease: "power2.inOut" })
      .set(overlay.current, { display: "none" });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={overlay}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] hidden items-center justify-center bg-crimson"
        style={{ transform: "scaleY(0)" }}
      >
        <Image src={asset("/brand/mark-ivory.png")} alt="" width={56} height={66} className="opacity-80" unoptimized />
      </div>
    </TransitionContext.Provider>
  );
}

export const useTransitionNav = () => useContext(TransitionContext);

type TLinkProps = React.ComponentProps<typeof Link>;

export const TLink = forwardRef<HTMLAnchorElement, TLinkProps>(function TLink({ href, onClick, ...rest }, ref) {
  const navigate = useTransitionNav();
  const hrefStr = typeof href === "string" ? href : href.pathname ?? "/";
  return (
    <Link
      ref={ref}
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          !navigate ||
          e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 ||
          rest.target === "_blank" ||
          hrefStr.startsWith("#") || hrefStr.startsWith("mailto:") || /^https?:/.test(hrefStr)
        )
          return;
        e.preventDefault();
        navigate(hrefStr);
      }}
    />
  );
});
