"use client";

import { Quote } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "Kristen doesn't try to fix you — she helps you hear God again. In twelve weeks I went from running on fumes to actually knowing who I am.",
    name: "Meredith K.",
    city: "Dallas, TX",
  },
  {
    quote:
      "I came wanting a career plan. I left with a whole new relationship with Jesus. Everything else has fallen into place because of that.",
    name: "Avery S.",
    city: "Charlotte, NC",
  },
  {
    quote:
      "Every session felt like someone finally handed me a compass. Scripture, honest questions, and a lot of laughter. I'd recommend her to every woman I love.",
    name: "Danielle R.",
    city: "Seattle, WA",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-forest-900 text-cream-50 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300">
            <span className="h-px w-8 bg-sage-300/60" />
            <span>From the women</span>
          </div>
          <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-cream-50">
            Their <em className="italic text-sage-300">words</em>, not mine.
          </h2>
        </Reveal>

        <RevealStagger className="mt-16 md:mt-20 grid md:grid-cols-3 gap-px bg-cream-100/10">
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name}>
              <figure className="bg-forest-900 p-8 md:p-10 h-full flex flex-col">
                <Quote className="text-gold-500" size={28} strokeWidth={1.25} />
                <blockquote className="font-display italic mt-6 text-xl md:text-2xl leading-snug text-cream-50 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 pt-5 border-t border-cream-100/15">
                  <div className="text-sm text-cream-50">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/50 mt-1">
                    {t.city}
                  </div>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>

        <p className="mt-8 text-[10px] uppercase tracking-widest-xl text-cream-100/30">
          * Sample testimonials — replace with real client words when ready.
        </p>
      </div>
    </section>
  );
}
