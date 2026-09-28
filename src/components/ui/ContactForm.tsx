"use client";

import { useState } from "react";
import { SITE } from "@/lib/format";

/**
 * Until a form backend is connected (Formspree, Resend, a Next.js route
 * handler…), submitting composes the message in the visitor's email app,
 * addressed to the shop.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", order: "", topic: "Sizing & fit", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  if (sent) {
    return (
      <div role="status" className="border border-line bg-rice/60 p-10">
        <p className="eyebrow text-crimson">Cảm ơn</p>
        <p className="display mt-3 text-3xl">Your message is ready to send.</p>
        <p className="mt-4 max-w-md leading-relaxed text-stone">
          We’ve opened it in your email app, addressed to {SITE.email}. Press send there and we’ll reply within 1–2 business days.
        </p>
        <button type="button" onClick={() => setSent(false)} className="link-underline eyebrow mt-8">
          Write another message
        </button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-8 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const subject = `${form.topic}${form.order ? ` — order ${form.order}` : ""} — ${form.name}`;
        const body = `${form.message}\n\n— ${form.name}\n${form.email}${form.order ? `\nOrder: ${form.order}` : ""}`;
        window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <label className="block">
        <span className="eyebrow text-stone">Name</span>
        <input required value={form.name} onChange={set("name")} autoComplete="name" className="field mt-1" />
      </label>
      <label className="block">
        <span className="eyebrow text-stone">Email</span>
        <input required type="email" value={form.email} onChange={set("email")} autoComplete="email" className="field mt-1" />
      </label>
      <label className="block">
        <span className="eyebrow text-stone">
          Order number <span className="normal-case tracking-normal">(optional)</span>
        </span>
        <input value={form.order} onChange={set("order")} className="field mt-1" placeholder="TVV-" />
      </label>
      <label className="block">
        <span className="eyebrow text-stone">About</span>
        <select value={form.topic} onChange={set("topic")} className="field mt-1">
          <option>Sizing &amp; fit</option>
          <option>An order</option>
          <option>Wedding or event</option>
          <option>Returns</option>
          <option>Wholesale &amp; collaboration</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow text-stone">Message</span>
        <textarea
          required
          rows={6}
          value={form.message}
          onChange={set("message")}
          className="field mt-1 resize-y"
          placeholder="For fit advice, include your bust, waist, hip and height in cm, and the date you need it by."
        />
      </label>
      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-primary">
          Send message
        </button>
        <p className="text-xs text-stone">We reply within 1–2 business days.</p>
      </div>
    </form>
  );
}
