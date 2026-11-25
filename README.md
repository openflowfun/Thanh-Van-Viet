# THANH VAN VIET — Vietnamese Fashion & Lifestyle

The storefront for Thanh Van Viet, a Vietnamese fashion and lifestyle house in Melbourne, Australia (New Zealand next).
It's an editorial e-commerce frontend with cinematic scroll, a typed catalogue of the 28 live eBay listings (18 pieces) with their real photos, and a mock cart and wishlist.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · `@gsap/react`

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
npm run lint
```

Node 20+ is recommended.

### The HTML version

The site is set up as a **static HTML export** (`output: "export"` in `next.config.ts`).
`npm run build` writes the whole website to **`out/`** as plain `.html`, `.css` and `.js` files. Every page is pre-rendered, including all 18 product pages and the eBay edit. No Node.js server is needed to host it.

- **Upload:** copy the *contents* of `out/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages with a custom domain, or cPanel `public_html`).
- **Preview locally:** `npm run preview`, then open http://localhost:3000.
  Double-clicking `index.html` won't work properly, because pages load their assets from the site root (`/_next/…`) and need to be served over HTTP.
- `website-html/` in the delivered folder is a ready-built copy of `out/`.

### GitHub Pages preview — one double-click

The live preview is at **https://openflowfun.github.io/Thanh-Van-Viet/**. It's served from the `gh-pages` branch, which contains only the built HTML. `main` holds the source.

**Double-click `Push to GitHub.command`** in the project folder. It:

1. commits everything you've changed and pushes `main`;
2. builds the site for the `/Thanh-Van-Viet` sub-folder in a cache folder outside iCloud (`~/Library/Caches/thanh-van-viet-build`), so `node_modules` never syncs; if Node 20+ isn't installed it publishes the ready-built `out/` instead;
3. publishes the build to `gh-pages` (with `.nojekyll`) and opens the preview.

It uses your normal GitHub sign-in (Keychain / GitHub CLI) and falls back to `.git/claude-credentials` if that file exists. First run on a new Mac: if macOS says the file can't be opened, right-click → **Open** once.

By hand:

```bash
NEXT_PUBLIC_BASE_PATH=/Thanh-Van-Viet npm run build   # site lives in a sub-folder on Pages
touch out/.nojekyll                                    # let Pages serve the _next folder
```

Then commit the contents of `out/` to the `gh-pages` branch. For a normal domain, build without `NEXT_PUBLIC_BASE_PATH`.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: preloader, cinematic hero, occasions marquee, collection tiles, pinned story ribbon, "This season", editorial film strip, mother–daughter feature, values, lookbook strip, newsletter |
| `/shop` | All 18 pieces (28 eBay listings), filterable by category, occasion, colour and price, with sorting. Accepts `?category=` and `?occasion=` |
| `/ebay` | **Live on eBay** — counter hero over a drifting wall of the real photos, pinned horizontal "plates" (one per piece, each size linking to its listing), and the full ledger of all 28 listings with filters and a cursor photo preview |
| `/collections/[slug]` | `womens-ao-dai`, `kids-ao-dai`, `family-sets`, `accessories` |
| `/product/[slug]` | PDP: pinned scrubbed gallery, size → **Buy on eBay** for that exact listing, what's included, fabric/occasion/care, cm size chart, the listing(s) on eBay, "pair it with", a cloth story using the product's own photo, JSON-LD with one offer per listing |
| `/lookbook` | Editorial chapters with photography first and no prices |
| `/about` | Brand story, pillars, and an "Our family" block ready for a personal story |
| `/contact` | Form (opens the visitor's email app, addressed to thanhvanviet.au@gmail.com), email, hours |
| `/cart` | Bag, GST, and a free-shipping bar. **Checkout (demo)** shows a confirmation and takes no payment |
| `/size-guide` | Women's, girls', boys' and slipper charts in cm |
| `/shipping-returns` | Delivery table and FAQ |
| 404 | Branded not-found page |

The cart drawer, wishlist and mobile menu live in the shared layout.

## Brand assets: where to swap logos

All logo files are in **`public/brand/`**. They're generated from the two supplied lockups (light and dark):

| File | Use |
| --- | --- |
| `logo-light-original.png`, `logo-dark-original.png` | The supplied originals, untouched |
| `logo-full-{red,ivory,black}.png` | Full lockup on a transparent background (footer uses ivory) |
| `wordmark-{red,ivory,black}.png` | Wordmark only (nav: ivory over dark heroes, red on light pages; preloader) |
| `mark-{red,ivory,black}.png` | Nón lá + lotus emblem (menu, 404, CTA watermark, page-transition wipe) |
| `lotus-divider-*.png` | The lotus divider from the lockup |
| `og.jpg` | Default Open Graph image |
| `src/app/icon.png`, `apple-icon.png`, `favicon.ico` | Favicon: cropped nón lá + face, ivory on crimson |

To update a logo, replace the file and keep the same name and aspect ratio. The animated lotus divider is an inline SVG in `src/components/ui/Lotus.tsx`.

## Content & data

- **Products:** `src/lib/products.ts` — the 18 real pieces behind the 28 live eBay listings (seller `thanhvanviet.au04`, scanned 25 Nov 2026): names, copy, colours, occasions, and the "This season" edit. Kids' and family collections show an "Arriving soon" panel until they have pieces.
- **eBay data & photos:** `src/lib/catalog-data.ts` holds each listing's item number, size, price and exact title, plus image dimensions. The listings' own photos are in `public/products/<slug>/` (`NN.webp` 1600px and `NN-sm.webp` 720px — the image loader picks the small file for small slots). Size charts and logo cards are kept but moved to the end of each gallery.
- **Size charts:** `src/lib/size-charts.ts`, in cm. The women's chart is Thanh Van Viet's own (weight, bust, waist; Vietnamese sizing that runs small).
- **Editorial photography:** `src/lib/images.ts` — hero, lookbook and mood images are still **Unsplash placeholders**; all product imagery is real.
- **Site constants:** `src/lib/format.ts`. Email, free-shipping threshold, shipping note, site URL (`https://thanhvanviet.com.au`, a placeholder; update it when the domain is live).
- **Policies to confirm:** the shipping prices (A$9.95 standard, A$14.95 express, free over A$150) and returns terms (14 days, unworn with tags, earrings final sale) are sensible drafts. Confirm them before launch.

## Motion system

- `SmoothScroll`: Lenis driven by GSAP's ticker, so ScrollTrigger and smooth scroll share one clock.
- `RevealManager`: add `data-reveal` to any element (server or client) and it rises in once. `data-reveal="fade"` and `data-reveal-delay` are supported.
- `SplitHeading`: letter-by-letter mask reveal. The hero waits for the preloader.
- `Parallax`, `Magnetic`, `PageTransition`/`TLink` (400 ms crimson wipe with the emblem), `Preloader` (≤ 1.2 s, first visit per session).
- Easing is `expo.out` / `power2` only, with no bounce.
- **Reduced motion:** Lenis, the preloader, pins, parallax and reveals are all disabled. Content is visible without JS.

## Connecting a real backend later

The storefront UI talks to commerce only through `src/lib/store.tsx` (`useStore()`: `add`, `setQty`, `remove`, `clear`, `wishlist`, `toggleWish`) and to catalogue data only through `src/lib/products.ts`.

1. **Catalogue:** replace `PRODUCTS` with a fetch from Shopify Storefront API, Medusa, Sanity or similar in the server components (`/shop`, `/collections/[slug]`, `/product/[slug]`). Keep the `Product` type as your mapping target.
2. **Cart & checkout:** swap the localStorage bodies in `store.tsx` for your cart API. Point the "Checkout (demo)" button in `src/components/shop/CartView.tsx` at the hosted checkout (Shopify, or Stripe Checkout with Apple Pay and Google Pay in AUD).
3. **Images:** update `src/lib/image-loader.ts` (or remove the custom loader in `next.config.ts`) when images move to your CDN.
4. **Forms:** `ContactForm.tsx` and `Newsletter.tsx` are marked where to call a route handler, Resend, Formspree or Klaviyo.
5. **NZ:** add NZD pricing and shipping zones, then remove the "coming soon" copy in `SITE.shippingNote`.

## Accessibility & SEO

- Semantic landmarks, a skip link, visible crimson focus rings, `aria-pressed` on selectors, labelled dialogs, Esc to close.
- Per-page metadata and Open Graph, `sitemap.xml`, `robots.txt`, `ClothingStore` and `Product` JSON-LD.
- Fonts: Playfair Display + Be Vietnam Pro, both with the Vietnamese subset so diacritics (Tết, áo dài, Huế) render correctly.
