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
      className="relative bg-cream-50 text-ink-900 py-24 md:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -right-8 bottom-0 font-display text-forest-600/[0.035] italic text-[180px] md:text-[320px] leading-none pointer-events-none select-none"
      >
        Rising
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-12 gap-10 md:gap-16">

        <div className="md:col-span-5">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>The Approach</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-forest-950">
              Rooted{" "}
              <span className="block">&amp; <em className="italic text-forest-700">Rising.</em></span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 text-ink-700 leading-relaxed text-[17px] max-w-md">
              I don&rsquo;t believe in forcing change. I help you recognize what&rsquo;s already there — and learn how to walk in it again.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="mt-6 text-ink-700 leading-relaxed text-[17px] max-w-md">
              This faith-based coaching is rooted in:
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7 flex flex-col">
          <RevealStagger
            as="ul"
            className="flex flex-col divide-y divide-ink-900/10 border-t border-ink-900/10"
            stagger={0.12}
            delay={0.2}
          >
            {VALUES.map((v, i) => (
              <RevealItem key={i} as="li" y={16}>
                <div className="py-8 md:py-10 flex flex-col gap-2">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display italic text-2xl md:text-3xl text-forest-800">
                      {v.label}
                    </span>
                  </div>
                  <p className="text-ink-600 text-[15px] leading-relaxed pl-0">
                    {v.detail}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal delay={0.55}>
            <div className="mt-10 md:mt-14 border-l-2 border-sage-100 pl-8">
              <blockquote className="font-display italic text-2xl md:text-3xl text-forest-800 leading-[1.25]">
                You don&rsquo;t need to become someone new. You need to return to who you are in God.
              </blockquote>
              <div className="mt-5 text-[10px] uppercase tracking-widest-xl text-forest-600/70">
                — Kristen Truby · Founder, Rooted &amp; Rising
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
