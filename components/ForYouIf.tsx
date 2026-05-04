"use client";

import { ArrowRight } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const ITEMS = [
  "You're going through a life transition and feel unsure of what's next.",
  "You feel stuck or unmotivated in your faith.",
  "You're carrying disappointment or emotional weight.",
  "You're tired of trying to be perfect.",
  "You know there's more in you — but can't seem to access it.",
];

export function ForYouIf() {
  return (
    <section className="bg-cream-50 text-ink-900 py-24 md:py-36 border-t border-ink-900/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">

          <div className="md:col-span-4 md:sticky md:top-28 md:self-start">
            <Reveal>
              <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
                <span className="h-px w-8 bg-forest-600/50" />
                <span>Who This Is For</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-forest-950">
                This is for{" "}
                <em className="italic text-forest-700">you</em> if&hellip;
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-ink-600 leading-relaxed text-[16px] max-w-sm">
                If any of these resonate, you&rsquo;re in the right place. You don&rsquo;t have to keep carrying this alone.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <a
                href="#contact"
                className="group mt-10 inline-flex items-center gap-3 bg-forest-950 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-forest-800 transition-colors"
              >
                Book a Clarity Call
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </Reveal>
          </div>

          <RevealStagger
            as="ul"
            className="md:col-span-7 md:col-start-6 flex flex-col divide-y divide-ink-900/10 border-t border-ink-900/10"
            stagger={0.1}
            delay={0.15}
          >
            {ITEMS.map((item, i) => (
              <RevealItem key={i} as="li" y={16}>
                <div className="flex items-start gap-6 py-8 md:py-10">
                  <span className="font-display italic text-4xl md:text-5xl text-forest-200 leading-none select-none mt-1 min-w-[2ch] text-right">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-ink-800 text-lg md:text-xl leading-snug font-medium pt-2">
                    {item}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

        </div>
      </div>
    </section>
  );
}
