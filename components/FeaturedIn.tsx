"use client";

import { Reveal } from "./Reveal";

const LOGOS = [
  "She Reads Truth",
  "Proverbs 31",
  "Focus on the Family",
  "Christianity Today",
  "The Gospel Coalition",
];

export function FeaturedIn() {
  return (
    <section className="bg-forest-950 text-cream-50/70 border-t border-cream-100/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-14">
        <Reveal className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12">
          <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/50 md:border-r md:border-cream-100/15 md:pr-12 whitespace-nowrap">
            As featured in
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-4 items-center">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="font-display italic text-lg md:text-xl text-cream-100/70"
              >
                {logo}
              </span>
            ))}
          </div>
        </Reveal>
        <p className="mt-6 text-[10px] uppercase tracking-widest-xl text-cream-100/30">
          * Sample placements — replace with actual press when ready.
        </p>
      </div>
    </section>
  );
}
