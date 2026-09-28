import type { Metadata, Viewport } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { PageTransitionProvider } from "@/components/motion/PageTransition";
import { RevealManager } from "@/components/motion/RevealManager";
import { Preloader } from "@/components/layout/Preloader";
import { Nav } from "@/components/layout/Nav";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { SITE } from "@/lib/format";
import { asset } from "@/lib/asset";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  display: "swap",
});

// Be Vietnam Pro — a humanist sans drawn for Vietnamese diacritics.
const beVietnam = Be_Vietnam_Pro({
  variable: "--font-bevn",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.wordmark} — Vietnamese Fashion & Lifestyle, Melbourne`,
    template: `%s · ${SITE.wordmark}`,
  },
  description:
    "Authentic Vietnamese áo dài, family sets, silk slippers and gifts — thoughtfully selected in Melbourne for Tết, weddings, tea ceremonies and the days you remember.",
  keywords: ["áo dài", "ao dai Melbourne", "Vietnamese fashion Australia", "Tết outfit", "Vietnamese wedding áo dài", "kids áo dài", "mother daughter áo dài"],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: SITE.wordmark,
    title: `${SITE.wordmark} — ${SITE.hero}`,
    description: "Authentic Vietnamese fashion, thoughtfully selected for Australia.",
    images: [{ url: asset("/brand/og.jpg"), width: 1200, height: 630, alt: "Thanh Van Viet" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-ok')}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${playfair.variable} ${beVietnam.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <noscript>
          <style>{`#preloader{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen">
        <StoreProvider>
          <SmoothScroll>
            <PageTransitionProvider>
              <Preloader />
              <Nav />
              <main id="main">{children}</main>
              <Footer />
              <CartDrawer />
              <RevealManager />
            </PageTransitionProvider>
          </SmoothScroll>
        </StoreProvider>
      </body>
    </html>
  );
}
