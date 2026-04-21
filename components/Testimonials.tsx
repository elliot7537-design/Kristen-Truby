"use client";

import { Quote } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "Kristen Truby's approach works so well for me to grow as a community leader. She has been instrumental in helping me reach my goals. The coaching helped me to gain perspective and greatly challenged me. If you are looking for life coaching from a Christian perspective, look no further. Kristen's support, care, and encouragement mean everything!",
    name: "Jennifer A.",
    city: "Coaching Client",
  },
  {
    quote:
      "I would highly recommend Kristen as a warm, person-centered coach. Throughout our sessions, I appreciated the flexibility and understanding she offered throughout the whole process. I especially appreciated that Kristen helped me find clarity and direction in my life. Choosing to make healthy, real choices with her coaching was absolutely life-changing.",
    name: "Candace D.",
    city: "Coaching Client",
  },
  {
    quote:
      "Working with Kristen has been one of the best decisions I've made for my personal growth. She creates a safe, Christ-centered space where you can be completely honest. I walked away with clarity, confidence, and a renewed sense of who God made me to be.",
    name: "Michelle T.",
    city: "Coaching Client",
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
          * What clients are saying — names used with permission.
        </p>
      </div>
    </section>
  );
}
