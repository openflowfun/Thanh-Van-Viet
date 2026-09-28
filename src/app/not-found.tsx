import Image from "next/image";
import { TLink } from "@/components/motion/PageTransition";
import { asset } from "@/lib/asset";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[88svh] flex-col items-center justify-center pb-20 pt-32 text-center">
      <Image src={asset("/brand/mark-red.png")} alt="" width={537} height={630} unoptimized className="w-20 opacity-90" />
      <p className="eyebrow mt-10 text-crimson">404 · Không tìm thấy</p>
      <h1 className="display mt-4 max-w-[14ch] text-[clamp(2.6rem,6vw,5rem)] leading-[1]">This page has wandered off.</h1>
      <p className="mt-6 max-w-md leading-relaxed text-stone">
        Like a lantern down the river. Let us take you back to the collections.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <TLink href="/" className="btn-primary">
          Return home
        </TLink>
        <TLink href="/shop" className="btn-outline">
          Shop all
        </TLink>
      </div>
    </section>
  );
}
