"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Reveal } from "./Reveal";

type Status = "idle" | "pending" | "ok" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("pending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="bg-cream-50 text-ink-900 py-24 md:py-36 border-t border-ink-900/5"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-12 gap-12 md:gap-16">
        <div className="md:col-span-5">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>Let&apos;s Walk This Together</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-6xl md:text-7xl leading-[0.95] text-forest-950">
              Clarity
              <br />
              <em className="italic text-forest-700">Starts Here.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-ink-700 leading-relaxed text-[17px] max-w-md">
              Feeling stuck or unsure of your next steps? In a free
              30-minute consultation, I&apos;ll join you through the process
              and chart your next move — together. Take the next step toward
              clarity, confidence, and a deeper connection with God. You
              don&apos;t have to do it alone.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a
              href="mailto:hello@rootedandrising.com"
              className="mt-10 inline-flex items-center gap-3 text-forest-800 hover:text-gold-500 transition-colors"
            >
              <Mail size={18} strokeWidth={1.5} />
              <span className="text-sm tracking-wide">
                hello@rootedandrising.com
              </span>
            </a>
          </Reveal>
        </div>

        <Reveal className="md:col-span-7" delay={0.15}>
          <form
            onSubmit={onSubmit}
            className="bg-cream-100 p-8 md:p-12 border border-ink-900/10"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <Field
                label="Your name"
                name="name"
                required
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
            </div>

            <div className="mt-6">
              <label className="block text-[10px] uppercase tracking-widest-xl text-forest-600 mb-3">
                What&apos;s on your heart?
              </label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-transparent border-b border-ink-900/20 focus:border-forest-700 focus:outline-none py-3 text-ink-900 placeholder:text-ink-500/60 resize-none transition-colors"
                placeholder="Tell me a little about the season you're in..."
              />
            </div>

            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
              <button
                type="submit"
                disabled={status === "pending"}
                className="group inline-flex items-center gap-3 bg-forest-950 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-forest-700 transition-colors disabled:opacity-60"
              >
                {status === "pending" ? "Sending..." : "Book Free Consultation"}
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <div className="text-[11px] uppercase tracking-widest-xl min-h-[1rem]">
                {status === "ok" && (
                  <span className="text-forest-700">
                    Thank you — I&apos;ll be in touch soon.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-red-700">
                    Something went wrong. Try email instead.
                  </span>
                )}
              </div>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest-xl text-forest-600 mb-3">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-ink-900/20 focus:border-forest-700 focus:outline-none py-3 text-ink-900 placeholder:text-ink-500/60 transition-colors"
      />
    </div>
  );
}
