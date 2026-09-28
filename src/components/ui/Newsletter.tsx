"use client";

import { useState } from "react";

/** Email-only sign-up. Stores locally until an ESP (Klaviyo, Mailchimp…) is connected. */
export function Newsletter({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const dark = tone === "dark";

  if (done) {
    return (
      <p className={`${className} display text-xl italic ${dark ? "text-gold" : "text-crimson"}`} role="status">
        Cảm ơn — thank you. Your first letter arrives soon.
      </p>
    );
  }

  return (
    <form
      className={`${className} flex items-end gap-3`}
      onSubmit={(e) => {
        e.preventDefault();
        try {
          const list = JSON.parse(localStorage.getItem("tvv.newsletter") ?? "[]");
          localStorage.setItem("tvv.newsletter", JSON.stringify([...list, { email, at: Date.now() }]));
        } catch {}
        setDone(true);
      }}
    >
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          autoComplete="email"
          className={`w-full border-0 border-b bg-transparent px-0 py-3 text-sm focus:outline-none focus:ring-0 ${
            dark ? "border-ivory/30 text-ivory placeholder:text-ivory/40 focus:border-gold" : "border-ink/25 placeholder:text-stone focus:border-crimson"
          }`}
        />
      </label>
      <button type="submit" className={`shrink-0 border-b py-3 text-[0.68rem] font-medium uppercase tracking-[0.26em] ${dark ? "border-gold text-gold" : "border-crimson text-crimson"}`}>
        Subscribe
      </button>
    </form>
  );
}
