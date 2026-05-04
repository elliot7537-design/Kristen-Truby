"use client";

import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const VALUES = [
  {
    label: "Truth over pressure.",
    detail: "We move at the pace of healing, not hustle — grounded in what God says about you.",
  },
  {
    label: "Growth over perfection.",
    detail: "Progress is holy. You don't have to have it all together to take the next step.",
  },
  {
    label: "Consistency over quick fixes.",
    detail: "Real transformation is built slowly, faithfully — one honest conversation at a time.",
  },
];

export function RootedAndRising() {
  return (
    <section
      id="about"
      className="relative text-cream-50 overflow-hidden"
    >
      {/* Top panel — dark with headline */}
      <div className="bg-forest-950 px-6 lg:px-10 pt-24 pb-20 md:pt-36 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300">
              <span className="h-px w-8 bg-sage-300/60" />
              <span>The Approach</span>
            </div>
          </Reveal>

          <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-20 items-end">
            <Reveal delay={0.1}>
              <h2 className="font-display text-6xl sm:text-7xl md:text-[96px] leading-[0.9] text-cream-50">
                Rooted
                <br />
                <em className="italic text-sage-300">&amp; Rising.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-cream-50/70 leading-relaxed text-[18px] md:text-xl max-w-lg mb-2">
                I don&rsquo;t believe in forcing change. I help you recognize what&rsquo;s already there — and learn how to walk in it again.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Bottom panel — champagne with values */}
      <div className="bg-cream-200 px-6 lg:px-10 pt-16 pb-24 md:pt-20 md:pb-36">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-ink-700 text-[13px] uppercase tracking-widest-xl mb-10">
              This faith-based coaching is rooted in:
            </p>
          </Reveal>

          <RevealStagger
            as="ul"
            className="flex flex-col"
            stagger={0.12}
            delay={0.1}
          >
            {VALUES.map((v, i) => (
              <RevealItem key={i} as="li" y={16}>
                <div className="grid md:grid-cols-2 gap-4 md:gap-16 py-8 md:py-10 border-b border-ink-900/10 items-baseline">
                  <span className="font-display italic text-3xl md:text-4xl text-forest-800">
                    {v.label}
                  </span>
                  <p className="text-ink-600 text-[16px] leading-relaxed">
                    {v.detail}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal delay={0.5}>
            <div className="mt-14 md:mt-20 bg-forest-950 text-cream-50 px-10 py-12 md:px-14 md:py-14">
              <blockquote className="font-display italic text-3xl md:text-4xl lg:text-5xl text-cream-50 leading-[1.15]">
                &ldquo;You don&rsquo;t need to become someone new. You need to return to who you are in God.&rdquo;
              </blockquote>
              <div className="mt-6 text-[10px] uppercase tracking-widest-xl text-sage-300">
                — Kristen Truby · Founder, Rooted &amp; Rising
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
