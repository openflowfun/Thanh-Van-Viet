import Image from "next/image";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { TLink } from "@/components/motion/PageTransition";

type Crumb = { href: string; label: string };

/** Light, editorial page header used by inner pages. */
export function PageHeader({
  eyebrow,
  title,
  kicker,
  crumbs,
  image,
  imageAlt = "",
}: {
  eyebrow: string;
  title: string;
  kicker?: string;
  crumbs?: Crumb[];
  image?: string;
  imageAlt?: string;
}) {
  return (
    <header className="container-x pt-28 lg:pt-40">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-8 text-[0.62rem] uppercase tracking-[0.24em] text-stone">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <TLink href="/" className="hover:text-ink">
                Home
              </TLink>
            </li>
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-ink">
                    {c.label}
                  </span>
                ) : (
                  <TLink href={c.href} className="hover:text-ink">
                    {c.label}
                  </TLink>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className={`grid gap-10 ${image ? "lg:grid-cols-12 lg:items-end" : ""}`}>
        <div className={image ? "lg:col-span-7" : ""}>
          <p data-reveal className="eyebrow text-crimson">
            {eyebrow}
          </p>
          <SplitHeading as="h1" trigger="mount" text={title} className="display mt-4 max-w-[16ch] text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.98]" />
          {kicker && (
            <p data-reveal className="mt-6 max-w-xl leading-relaxed text-stone sm:text-lg">
              {kicker}
            </p>
          )}
        </div>
        {image && (
          <div data-reveal className="relative aspect-[4/3] overflow-hidden bg-rice lg:col-span-5 lg:aspect-[4/5] lg:max-h-[440px]">
            <Image src={image} alt={imageAlt} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
    </header>
  );
}
