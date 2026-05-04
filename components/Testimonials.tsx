"use client";

import { Reveal } from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "I would highly recommend Kristen as a coach. Her warm, person-centered approach makes it easy to open up. Through our sessions, I was able to recognize and work through the thought patterns and barriers that were holding me back from taking action toward my goals. I also found that boundary setting can be complex and confusing, especially with so much information about boundaries available today. I especially appreciated how Kristen helped me understand them in a healthy and faith-based way. Her coaching sessions and presence brought encouragement and a renewed sense of vision for daily life and my new business.",
    name: "C. Brennan",
    title: "Coaching Client",
  },
  {
    quote:
      "Kristen has provided a safe space for me to be honest about my current stage in my walk. She has been understanding and non-judgmental while also providing guidance and questions that gently challenge me. Her coaching has helped to keep me grounded and encourages me to take forward steps. I think anyone would benefit and grow from Kristen's support, care, and encouragement.",
    name: "Grateful Client",
    title: "Coaching Client",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="bg-forest-950 text-cream-50 py-24 md:py-36 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <Reveal className="mb-16 md:mb-24 flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300">
          <span className="h-px w-8 bg-sage-300/60" />
          <span>From the women</span>
        </Reveal>

        {/* First testimonial — large pull quote */}
        <Reveal delay={0.1}>
          <figure className="mb-20 md:mb-28">
            <blockquote className="font-display italic text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-cream-50 max-w-5xl">
              &ldquo;{TESTIMONIALS[0].quote}&rdquo;
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-5">
              <span className="h-px w-10 bg-sage-300/50" />
              <div>
                <div className="text-sage-300 text-sm tracking-wide">{TESTIMONIALS[0].name}</div>
                <div className="text-[10px] uppercase tracking-widest-xl text-cream-50/40 mt-0.5">{TESTIMONIALS[0].title}</div>
              </div>
            </figcaption>
          </figure>
        </Reveal>

        {/* Second testimonial — smaller, indented right */}
        <Reveal delay={0.2}>
          <figure className="md:pl-32 lg:pl-56 border-t border-cream-50/10 pt-16 md:pt-20">
            <blockquote className="font-display italic text-2xl sm:text-3xl md:text-4xl leading-[1.15] text-cream-50/80 max-w-3xl">
              &ldquo;{TESTIMONIALS[1].quote}&rdquo;
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-5">
              <span className="h-px w-10 bg-sage-300/50" />
              <div>
                <div className="text-sage-300 text-sm tracking-wide">{TESTIMONIALS[1].name}</div>
                <div className="text-[10px] uppercase tracking-widest-xl text-cream-50/40 mt-0.5">{TESTIMONIALS[1].title}</div>
              </div>
            </figcaption>
          </figure>
        </Reveal>

      </div>
    </section>
  );
}
