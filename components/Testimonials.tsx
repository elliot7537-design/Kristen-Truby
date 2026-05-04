"use client";

import { Quote } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "I would highly recommend Kristen as a coach. Her warm, person-centered approach makes it easy to open up. Through our sessions, I was able to recognize and work through the thought patterns and barriers that were holding me back from taking action toward my goals. I also found that boundary setting can be complex and confusing, especially with so much information about boundaries available today. I especially appreciated how Kristen helped me understand them in a healthy and faith-based way. Her coaching sessions and presence brought encouragement and a renewed sense of vision for daily life and my new business.",
    name: "C. Brennan",
    city: "Coaching Client",
  },
  {
    quote:
      "Kristen has provided a safe space for me to be honest about my current stage in my walk. She has been understanding and non-judgmental while also providing guidance and questions that gently challenge me. Her coaching has helped to keep me grounded and encourages me to take forward steps. I think anyone would benefit and grow from Kristen's support, care, and encouragement.",
    name: "Grateful Client",
    city: "Coaching Client",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-forest-500 text-cream-50 py-24 md:py-36"
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

        <RevealStagger className="mt-16 md:mt-20 grid md:grid-cols-2 gap-px bg-cream-50/10">
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name}>
              <figure className="bg-forest-500 p-8 md:p-12 h-full flex flex-col">
                <Quote className="text-sage-300" size={28} strokeWidth={1.25} />
                <blockquote className="font-display italic mt-6 text-xl md:text-2xl leading-snug text-cream-50 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 pt-5 border-t border-cream-50/15">
                  <div className="text-sm text-cream-50">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-widest-xl text-cream-50/50 mt-1">
                    {t.city}
                  </div>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
