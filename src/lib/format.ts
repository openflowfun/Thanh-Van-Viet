const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

/** A$69.95 / A$249 — whole dollars shown without cents. */
export function formatAUD(value: number) {
  const s = aud.format(value).replace(/^\$/, "A$");
  return s.endsWith(".00") ? s.slice(0, -3) : s;
}

export const SITE = {
  name: "Thanh Van Viet",
  wordmark: "THANH VAN VIET",
  tagline: "Vietnamese Fashion & Lifestyle",
  hero: "Vietnamese Elegance, Made to Be Remembered.",
  email: "thanhvanviet.au@gmail.com",
  location: "Melbourne, Australia",
  url: "https://thanhvanviet.com.au",
  freeShippingThreshold: 150,
  shippingNote: "Australia-wide delivery in 3–7 business days. New Zealand coming soon.",
};
