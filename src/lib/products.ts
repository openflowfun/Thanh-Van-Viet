import { GALLERY, LISTINGS, MEDIA, type EbayListing } from "./catalog-data";
import type { SizeChartKey } from "./size-charts";

export type Category = "womens" | "kids" | "family" | "accessories";

export type Subcategory =
  | "classic" | "modern" | "floral" | "silk" | "wedding" | "tet"
  | "girls" | "boys" | "mother-daughter" | "family"
  | "slippers" | "bag" | "hair" | "scarf" | "jewellery" | "gift";

export type Occasion =
  | "Tết" | "Wedding" | "Tea Ceremony" | "Engagement" | "Photoshoot"
  | "Festival" | "Everyday" | "School Photos" | "Family Portraits" | "Gift";

export type Badge = "New" | "Tết" | "Wedding" | "Bestseller";

export type Colour = { name: string; hex: string };

export type SizeGroup = { label: string; options: string[] };

export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  category: Category;
  subcategory: Subcategory;
  colours: Colour[];
  /** Single size selector. For sets, see sizeGroups. */
  sizes: string[];
  /** Multi-wearer sets (e.g. mother + daughter) pick one size per wearer. */
  sizeGroups?: SizeGroup[];
  fabric: string;
  included: string[];
  occasions: Occasion[];
  care: string[];
  short: string;
  description: string[];
  sizeChartKey: SizeChartKey | null;
  images: string[];
  badge?: Badge;
  pairWith?: string[];
  /** The live eBay listings behind this piece — one per size. */
  listings: EbayListing[];
  /** Plain-language details (dimensions, closures) shown on the product page. */
  details?: string[];
};

export const CATEGORIES: { key: Category; label: string; href: string; blurb: string }[] = [
  { key: "womens", label: "Women’s Áo Dài", href: "/collections/womens-ao-dai", blurb: "Brocade, satin, organza and chiffon — from Tết visiting to the wedding day." },
  { key: "kids", label: "Kids Áo Dài", href: "/collections/kids-ao-dai", blurb: "Small áo dài for Tết, school photos and first festivals. Arriving soon." },
  { key: "family", label: "Family Sets", href: "/collections/family-sets", blurb: "Mother–daughter and family pieces cut to match. Arriving soon." },
  { key: "accessories", label: "Bags & Accessories", href: "/collections/accessories", blurb: "Tapestry totes and embroidered áo dài girls bags, to carry the story every day." },
];

export const OCCASIONS: Occasion[] = [
  "Tết", "Wedding", "Tea Ceremony", "Engagement", "Photoshoot",
  "Festival", "Everyday", "School Photos", "Family Portraits", "Gift",
];

/** Colour names are what shoppers see — keep them descriptive, not code-like. */
export const C = {
  peach: { name: "Peach Blush", hex: "#EBA996" },
  silverBlue: { name: "Silver Blue", hex: "#B7C4D2" },
  ivory: { name: "Rice Ivory", hex: "#F3EDE3" },
  blossom: { name: "Blossom Pink", hex: "#EDB2BF" },
  pastel: { name: "Pastel Metallic", hex: "#E6DCCB" },
  cream: { name: "Cream", hex: "#F1E7D2" },
  mint: { name: "Mint", hex: "#BFE2D5" },
  gold: { name: "Champagne Gold", hex: "#E4C98C" },
  blushPearl: { name: "Blush Pearl", hex: "#EFC9CF" },
  iceBlue: { name: "Ice Blue", hex: "#C8D7E3" },
  navy: { name: "Indigo Navy", hex: "#1F2B5B" },
  black: { name: "Ink Black", hex: "#141212" },
  denim: { name: "Denim Blue", hex: "#47658A" },
  sky: { name: "Sky Blue", hex: "#6FA6CC" },
  butter: { name: "Butter Yellow", hex: "#EBD39E" },
  terracotta: { name: "Terracotta", hex: "#C7643E" },
  teal: { name: "Lake Teal", hex: "#4D8C8A" },
  crimson: { name: "Lacquer Crimson", hex: "#8B1A1A" },
} satisfies Record<string, Colour>;

const AO_QUAN = ["Áo — the long tunic", "Quần — matching trousers"];
const AO_ONLY = ["Áo — the long tunic (trousers not included)"];

const BROCADE_CARE = [
  "Dry clean recommended",
  "Or hand wash cold, gently; do not wring or soak",
  "Dry flat in shade",
  "Cool iron on the reverse, with a pressing cloth — never iron over beading",
];
const SATIN_CARE = [
  "Hand wash cold with a mild detergent",
  "Hang to dry in shade",
  "Cool iron on the reverse; avoid embroidered areas",
];
const CHIFFON_CARE = [
  "Hand wash cold, separately",
  "Hang to dry in shade",
  "Low iron or steam from the reverse",
];
const BAG_CARE = [
  "Spot clean with a damp cloth and mild soap",
  "Air dry, stuffed with paper to keep the shape",
  "Do not machine wash or tumble dry",
];

const AO_DAI_FIT =
  "Vietnamese sizing: this áo dài runs smaller than Australian sizes. Check the cm chart — S is bust 82–84 cm, M 86–88 cm, L 90–92 cm.";

/**
 * Gallery order: portrait photography first (it fills a 3:4 frame), then square and
 * landscape product shots, then the size chart and brand cards. Every eBay image is kept.
 */
const rank = (src: string) => {
  const m = MEDIA[src];
  if (!m) return 1;
  if (m.kind === "chart") return 3;
  if (m.kind === "logo") return 4;
  return m.h > m.w * 1.05 ? 0 : 1;
};
const curate = (srcs: string[]) => srcs.map((src, i) => ({ src, i })).sort((a, b) => rank(a.src) - rank(b.src) || a.i - b.i).map((x) => x.src);

const fromListings = (slug: string, editorialOrder = true) => {
  const listings = LISTINGS[slug];
  const order = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL"];
  const sizes = [...new Set(listings.map((l) => l.size || "One size"))].sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return {
    slug,
    listings,
    sizes,
    price: Math.min(...listings.map((l) => l.price)),
    images: editorialOrder ? curate(GALLERY[slug]) : GALLERY[slug],
  };
};

const WEAR_IT_WITH = ["cream-elephant-tapestry-tote", "ao-dai-girls-embroidered-tote-black", "fishing-cat-canvas-tote"];
const BRIDAL_PAIR = ["suong-ivory-organza-ao-dai", "hoang-kim-gold-embroidered-ao-dai", "cream-elephant-tapestry-tote"];
const PEARL_TRIO = ["ngoc-trai-ivory-pearl-brocade-ao-dai", "hong-ngoc-blush-pearl-brocade-ao-dai", "bang-lam-ice-blue-pearl-brocade-ao-dai"];
const BAG_PAIR = ["mau-don-embroidered-satin-ao-dai-set", "bac-ha-mint-floral-chiffon-ao-dai", "ngoc-trai-ivory-pearl-brocade-ao-dai"];

export const PRODUCTS: Product[] = [
  // ─────────────────────────── WOMEN’S ÁO DÀI ───────────────────────────
  {
    ...fromListings("mau-don-embroidered-satin-ao-dai-set"),
    name: "Mẫu Đơn Embroidered Satin Áo Dài Set",
    category: "womens",
    subcategory: "floral",
    colours: [C.peach],
    fabric: "Premium satin with a soft sheen, embroidered peony spray (Ozaga Lace)",
    included: AO_QUAN,
    occasions: ["Tết", "Tea Ceremony", "Photoshoot"],
    care: SATIN_CARE,
    short: "A blushing satin áo dài with an embroidered peony — mẫu đơn — trailing from collar to sleeve.",
    description: [
      "Mẫu đơn, the peony, is the flower of spring abundance, and here it is embroidered in coral and leaf green across the shoulder and down one sleeve. The premium satin catches window light softly — it is the piece we reach for when a photograph matters.",
      "Cut A-line to the floor with a high mandarin collar and a flared sleeve, and sold as a set with matching trousers.",
    ],
    details: ["A-line, full length", "Mandarin collar, flared sleeve", AO_DAI_FIT],
    sizeChartKey: "women",
    badge: "Tết",
    pairWith: WEAR_IT_WITH,
  },
  {
    ...fromListings("truc-bamboo-brocade-ao-dai-tu-than"),
    name: "Trúc Bamboo Brocade Áo Dài Tứ Thân",
    category: "womens",
    subcategory: "modern",
    colours: [C.silverBlue],
    fabric: "Premium brocade (gấm cao cấp), woven bamboo-leaf motif",
    included: AO_ONLY,
    occasions: ["Tết", "Festival", "Photoshoot", "Everyday"],
    care: BROCADE_CARE,
    short: "Silver-blue brocade woven with bamboo leaves — a modernised four-panel tứ thân, light enough for all day.",
    description: [
      "Trúc — bamboo — bends without breaking, and it has long stood for grace under pressure. This brocade carries the leaf as a tonal weave you notice only as the light moves, in a cool silver blue that sits beautifully beside ivory and blush.",
      "A modernised tứ thân (four-panel) cut with a long sleeve and lightweight hand. Wear it with friends in ivory and pink for the photograph everyone keeps.",
    ],
    details: ["Modernised traditional tứ thân cut", "Long sleeve, lightweight", AO_DAI_FIT],
    sizeChartKey: "women",
    pairWith: PEARL_TRIO,
  },
  {
    ...fromListings("ngoc-trai-ivory-pearl-brocade-ao-dai"),
    name: "Ngọc Trai Ivory Pearl Brocade Áo Dài",
    category: "womens",
    subcategory: "silk",
    colours: [C.ivory],
    fabric: "Silk-look brocade with a pearl-beaded neckline",
    included: AO_ONLY,
    occasions: ["Engagement", "Tea Ceremony", "Photoshoot"],
    care: BROCADE_CARE,
    short: "Ivory brocade with a ring of pearls at the neck and a wide bell sleeve — quietly bridal.",
    description: [
      "Ngọc trai means pearl. A neat row of them circles a soft round neckline, and the ivory brocade beneath carries a faint floral weave that glows rather than shines.",
      "The bell sleeve and long A-line make it a natural choice for an engagement, a tea ceremony or the second outfit of a wedding day.",
    ],
    details: ["Pearl-beaded round neckline", "Bell sleeve, A-line, full length", AO_DAI_FIT],
    sizeChartKey: "women",
    badge: "Wedding",
    pairWith: PEARL_TRIO,
  },
  {
    ...fromListings("hoa-dao-layered-ao-dai"),
    name: "Hoa Đào Layered Chiffon Áo Dài",
    category: "womens",
    subcategory: "modern",
    colours: [C.blossom],
    fabric: "Smooth, silky chiffon in a double-layer hem",
    included: ["Áo — the long tunic (tunic only)"],
    occasions: ["Tết", "Festival", "Photoshoot"],
    care: CHIFFON_CARE,
    short: "Peach-blossom pink with knotted frog buttons, a tassel tie and a double-layered hem.",
    description: [
      "Hoa đào, the peach blossom, belongs to Tết in the north — and this áo dài wears its colour. Hand-knotted frog buttons run from the collar, finished with a long tasselled cord.",
      "The hem falls in two soft layers and the three-quarter bell sleeve keeps it light and easy to move in. Tunic only — wear it with ivory or pink trousers.",
    ],
    details: ["Knotted frog buttons and tassel cord", "Double-layer hem, three-quarter bell sleeve", AO_DAI_FIT],
    sizeChartKey: "women",
    pairWith: WEAR_IT_WITH,
  },
  {
    ...fromListings("anh-kim-metallic-lace-ao-dai"),
    name: "Ánh Kim Metallic Lace Áo Dài",
    category: "womens",
    subcategory: "wedding",
    colours: [C.pastel],
    fabric: "Metallic floral brocade lace over an ivory lining",
    included: AO_QUAN,
    occasions: ["Wedding", "Engagement", "Tea Ceremony"],
    care: BROCADE_CARE,
    short: "Ivory lace threaded with pastel metallic florals that shimmer as you walk.",
    description: [
      "Ánh kim — a metallic gleam. Pastel leaves and blossoms are woven into a fine lace and lit with iridescent thread, so the whole áo dài seems to change colour between shade and sun.",
      "A high collar, long flared sleeve and floor-length panels, worn over matching ivory trousers. The most luminous piece in the house.",
    ],
    details: ["High mandarin collar, flared sleeve", "Sold with trousers", AO_DAI_FIT],
    sizeChartKey: "women",
    badge: "Wedding",
    pairWith: BRIDAL_PAIR,
  },
  {
    ...fromListings("suong-ivory-organza-ao-dai"),
    name: "Sương Ivory Organza Áo Dài",
    category: "womens",
    subcategory: "wedding",
    colours: [C.cream],
    fabric: "Silk-look organza over satin, covered buttons",
    included: AO_QUAN,
    occasions: ["Wedding", "Engagement", "Tea Ceremony", "Photoshoot"],
    care: CHIFFON_CARE,
    short: "Ivory-cream organza layered over satin, with sheer bell sleeves and a row of covered buttons.",
    description: [
      "Sương is morning mist — the soft, pale light this áo dài seems to hold. A sheer organza layer floats over cream satin, so the colour deepens and lightens as you move.",
      "Sheer three-quarter bell sleeves, a column of covered buttons and matching trousers make it an easy, elegant choice for a wedding or a tea ceremony.",
    ],
    details: ["Sheer organza sleeves, covered buttons", "Sold with trousers", AO_DAI_FIT],
    sizeChartKey: "women",
    badge: "Wedding",
    pairWith: BRIDAL_PAIR,
  },
  {
    ...fromListings("bac-ha-mint-floral-chiffon-ao-dai"),
    name: "Bạc Hà Mint Floral Chiffon Áo Dài",
    category: "womens",
    subcategory: "floral",
    colours: [C.mint],
    fabric: "Floral chiffon with embroidered medallions and an embroidered collar",
    included: AO_QUAN,
    occasions: ["Tết", "Festival", "Photoshoot", "Everyday"],
    care: CHIFFON_CARE,
    short: "Cool mint chiffon scattered with rose-coloured medallions — fresh, light and made for spring.",
    description: [
      "Bạc hà is mint: cool, fresh, a little unexpected for Tết. Rose and lilac medallions are scattered across the chiffon, and the collar is embroidered to match.",
      "A wide bell sleeve and easy A-line make it as comfortable at a long family lunch as it is in photographs. Sold with matching trousers.",
    ],
    details: ["Embroidered collar and medallions", "Bell sleeve, sold with trousers", AO_DAI_FIT],
    sizeChartKey: "women",
    pairWith: WEAR_IT_WITH,
  },
  {
    ...fromListings("hoang-kim-gold-embroidered-ao-dai"),
    name: "Hoàng Kim Gold Embroidered Áo Dài",
    category: "womens",
    subcategory: "wedding",
    colours: [C.gold],
    fabric: "Silk-look champagne satin, embroidered medallions",
    included: AO_ONLY,
    occasions: ["Wedding", "Tea Ceremony", "Tết"],
    care: SATIN_CARE,
    short: "Champagne gold with embroidered medallions — a heritage colour for the family tea ceremony.",
    description: [
      "Hoàng kim — imperial gold — was once the colour of the court. Here it softens to champagne, with round embroidered medallions in rose, teal and gold scattered over a silk-look satin.",
      "An A-line cut with a high collar, made for the lễ gia tiên and for Tết mornings with family.",
    ],
    details: ["Embroidered medallions, high collar", "A-line, full length", AO_DAI_FIT],
    sizeChartKey: "women",
    badge: "Wedding",
    pairWith: BRIDAL_PAIR,
  },
  {
    ...fromListings("hong-ngoc-blush-pearl-brocade-ao-dai"),
    name: "Hồng Ngọc Blush Pearl Brocade Áo Dài",
    category: "womens",
    subcategory: "silk",
    colours: [C.blushPearl],
    fabric: "Silk-look floral brocade with a pearl-beaded neckline",
    included: AO_ONLY,
    occasions: ["Tết", "Engagement", "Photoshoot"],
    care: BROCADE_CARE,
    short: "Soft blush brocade, a pearl-edged neckline and a long bell sleeve.",
    description: [
      "Hồng ngọc is a rose-coloured jewel. A tonal floral weave runs through the blush brocade, and seed pearls trace the round neckline.",
      "Made as a set of three with the ivory and ice-blue pearl brocades — for sisters, bridesmaids or best friends at Tết.",
    ],
    details: ["Pearl-beaded round neckline", "Long bell sleeve, A-line", AO_DAI_FIT],
    sizeChartKey: "women",
    pairWith: PEARL_TRIO,
  },
  {
    ...fromListings("bang-lam-ice-blue-pearl-brocade-ao-dai"),
    name: "Băng Lam Ice Blue Pearl Brocade Áo Dài",
    category: "womens",
    subcategory: "silk",
    colours: [C.iceBlue],
    fabric: "Silk-look floral brocade with a pearl-beaded neckline",
    included: AO_ONLY,
    occasions: ["Tết", "Engagement", "Photoshoot", "Everyday"],
    care: BROCADE_CARE,
    short: "Ice-blue brocade with a ring of pearls — cool, calm and quietly luminous.",
    description: [
      "Băng lam — ice blue. A pale, cool brocade with a soft floral weave, finished with seed pearls at the neckline.",
      "The bell sleeve and long line photograph beautifully on city streets as much as in a temple courtyard. One of the pearl brocade trio, with ivory and blush.",
    ],
    details: ["Pearl-beaded round neckline", "Long bell sleeve, A-line", AO_DAI_FIT],
    sizeChartKey: "women",
    pairWith: PEARL_TRIO,
  },

  // ─────────────────────────── BAGS ───────────────────────────
  {
    ...fromListings("navy-elephant-tapestry-tote", false),
    name: "Navy Elephant Tapestry Tote",
    category: "accessories",
    subcategory: "bag",
    colours: [C.navy],
    fabric: "Woven tapestry, cream rope handles, pink lining",
    included: ["Top-handle tote"],
    occasions: ["Everyday", "Gift", "Festival"],
    care: BAG_CARE,
    short: "An indigo tapestry tote woven with a jewelled elephant, carried on cream rope handles.",
    description: [
      "The elephant is a symbol of strength and good fortune across Southeast Asia, and here it is woven in red, gold and turquoise on deep indigo, framed by a patterned border.",
      "Structured enough to keep its shape, light enough to carry all day, with a soft pink lining and a zipped interior.",
    ],
    details: ["30 × 20 × 10 cm", "Rope top handles", "Lined, spacious interior"],
    sizeChartKey: null,
    pairWith: BAG_PAIR,
  },
  {
    ...fromListings("cream-elephant-tapestry-tote", false),
    name: "Cream Elephant Tapestry Tote",
    category: "accessories",
    subcategory: "bag",
    colours: [C.cream],
    fabric: "Woven tapestry, rope handles, zip closure",
    included: ["Shoulder tote"],
    occasions: ["Everyday", "Gift", "Festival"],
    care: BAG_CARE,
    short: "Cream tapestry with a burgundy elephant, a zip top and two side pockets.",
    description: [
      "A burgundy elephant on a cream ground, bordered in red and black — the bag that goes with almost every áo dài in the house.",
      "A zip closure with a secure strap, two side pockets and rope handles that sit comfortably on the shoulder.",
    ],
    details: ["30 × 20 × 10 cm", "Zip closure and secure strap", "Two side pockets"],
    sizeChartKey: null,
    pairWith: BAG_PAIR,
  },
  {
    ...fromListings("blue-elephant-woven-shoulder-bag", false),
    name: "Blue Elephant Woven Shoulder Bag",
    category: "accessories",
    subcategory: "bag",
    colours: [C.cream],
    fabric: "Woven tapestry with canvas trim",
    included: ["Shoulder bag"],
    occasions: ["Everyday", "Gift"],
    care: BAG_CARE,
    short: "A cream woven bag with a sky-blue elephant and red geometric borders.",
    description: [
      "A blue elephant in a red saddle-cloth, woven onto cream and bordered with bright geometric bands — cheerful and easy to wear.",
      "Rope handles, side pockets and a roomy interior for everyday carrying.",
    ],
    details: ["Rope handles", "Side pockets"],
    sizeChartKey: null,
    pairWith: BAG_PAIR,
  },
  {
    ...fromListings("ao-dai-girls-embroidered-tote-black", false),
    name: "Áo Dài Girls Embroidered Tote — Black",
    category: "accessories",
    subcategory: "bag",
    colours: [C.black],
    fabric: "Black canvas with traditional Vietnamese embroidery",
    included: ["Canvas tote"],
    occasions: ["Everyday", "Gift"],
    care: BAG_CARE,
    short: "Three girls in áo dài and nón lá, wheeling a bicycle — embroidered on black canvas.",
    description: [
      "Three schoolgirls in pink, yellow and green áo dài, conical hats tilted, walking a bicycle beneath a stitched “Việt Nam” — a little piece of home to carry every day.",
      "Sturdy canvas with long shoulder straps; elegant enough for the city, practical enough for the market.",
    ],
    details: ["36 × 35 × 8 cm", "Long shoulder straps", "Embroidered front panel"],
    sizeChartKey: null,
    pairWith: BAG_PAIR,
  },
  {
    ...fromListings("ao-dai-girls-embroidered-tote-denim", false),
    name: "Áo Dài Girls Embroidered Tote — Denim Blue",
    category: "accessories",
    subcategory: "bag",
    colours: [C.denim],
    fabric: "Denim-blue canvas with traditional Vietnamese embroidery",
    included: ["Canvas tote"],
    occasions: ["Everyday", "Gift"],
    care: BAG_CARE,
    short: "The áo dài girls embroidery on soft denim-blue canvas, with a zipped main compartment.",
    description: [
      "The same three girls in áo dài and nón lá, embroidered on a soft denim-blue canvas that wears in beautifully.",
      "A zipped main compartment with an inner zip pocket, and long straps for the shoulder. A thoughtful gift for anyone far from Việt Nam.",
    ],
    details: ["36 × 35 × 7.5 cm", "Zip main compartment, inner zip pocket", "Lined interior"],
    sizeChartKey: null,
    pairWith: BAG_PAIR,
  },
  {
    ...fromListings("sunbathing-cat-tapestry-tote", false),
    name: "Sunbathing Cat Tapestry Tote",
    category: "accessories",
    subcategory: "bag",
    colours: [C.sky],
    fabric: "Woven tapestry, striped webbing straps, orange lining",
    included: ["Shoulder tote"],
    occasions: ["Everyday", "Gift"],
    care: BAG_CARE,
    short: "A cat in sunglasses lounging on a beach chair — woven in sky blue and terracotta.",
    description: [
      "For the friend who is always on holiday in spirit: a white cat in round sunglasses, drink in paw, woven into a bright tapestry.",
      "Striped webbing straps, a top zip, an inner zip pocket and a sturdy 10 cm base.",
    ],
    details: ["44 cm top · 35 cm base · 35 cm high · 10 cm deep", "Top zip, inner zip pocket", "Sturdy base"],
    sizeChartKey: null,
    badge: "New",
    pairWith: BAG_PAIR,
  },
  {
    ...fromListings("wish-you-were-here-dog-tote", false),
    name: "“Wish You Were Here” Dog Tapestry Tote",
    category: "accessories",
    subcategory: "bag",
    colours: [C.butter],
    fabric: "Woven tapestry, striped webbing straps",
    included: ["Shoulder tote"],
    occasions: ["Everyday", "Gift"],
    care: BAG_CARE,
    short: "A postcard-style pup and a “Wish you were here” banner, woven in warm butter and brick.",
    description: [
      "Like a postcard from somewhere sunny: a cheerful pup in a yellow bow tie beneath a bold “Wish you were here”.",
      "A large tapestry tote with a zip closure, spacious interior and sturdy base.",
    ],
    details: ["44 cm top · 35 cm base · 35 cm high · 10 cm deep", "Zip closure", "Sturdy base"],
    sizeChartKey: null,
    badge: "New",
    pairWith: BAG_PAIR,
  },
  {
    ...fromListings("fishing-cat-canvas-tote", false),
    name: "Fishing Cat Canvas Tote",
    category: "accessories",
    subcategory: "bag",
    colours: [C.teal],
    fabric: "Canvas tapestry print, striped webbing strap",
    included: ["Shoulder tote", "Detachable strap"],
    occasions: ["Everyday", "Gift"],
    care: BAG_CARE,
    short: "A cat in a sun hat, fishing beneath a beach umbrella — with a zip top and detachable strap.",
    description: [
      "A slow afternoon, woven: a little cat in a red sun hat fishing under a striped umbrella, in teal, orange and sand.",
      "A zip shoulder bag with a detachable strap, roomy enough for a laptop sleeve and a market run.",
    ],
    details: ["44 × 35 × 10 cm", "Zip top, detachable strap"],
    sizeChartKey: null,
    badge: "New",
    pairWith: BAG_PAIR,
  },
];

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);

export const byCategory = (c: Category) => PRODUCTS.filter((p) => p.category === c);

export const categoryFromSlug: Record<string, Category> = {
  "womens-ao-dai": "womens",
  "kids-ao-dai": "kids",
  "family-sets": "family",
  accessories: "accessories",
};

export const THIS_SEASON = [
  "mau-don-embroidered-satin-ao-dai-set",
  "bac-ha-mint-floral-chiffon-ao-dai",
  "suong-ivory-organza-ao-dai",
  "anh-kim-metallic-lace-ao-dai",
  "bang-lam-ice-blue-pearl-brocade-ao-dai",
  "truc-bamboo-brocade-ao-dai-tu-than",
  "cream-elephant-tapestry-tote",
  "ao-dai-girls-embroidered-tote-black",
].map((s) => getProduct(s)!);

export const PRICE_BANDS = [
  { key: "under-30", label: "Under A$30", min: 0, max: 30 },
  { key: "30-70", label: "A$30 – 70", min: 30, max: 70 },
  { key: "70-90", label: "A$70 – 90", min: 70, max: 90 },
  { key: "90-plus", label: "A$90+", min: 90, max: Infinity },
] as const;

/** Every eBay listing, flattened, in store order (1–28). */
export const ALL_LISTINGS = PRODUCTS.flatMap((p) => p.listings.map((l) => ({ ...l, product: p }))).sort((a, b) => a.n - b.n);

/** Photos (not size charts or logo cards) — used for cards, hovers and editorial spots. */
export const photosOf = (p: Product) => p.images.filter((src) => (MEDIA[src]?.kind ?? "photo") === "photo");
