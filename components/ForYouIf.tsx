"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";
function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

const ITEMS = [
  "You're going through a life transition and feel unsure of what's next.",
  "You feel stuck or unmotivated in your faith.",
  "You're carrying disappointment or emotional weight.",
  "You're tired of trying to be perfect.",
  "You know there's more in you — but can't seem to access it.",
];

export function ForYouIf() {
  return (
    <section className="bg-cream-100 text-ink-900 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        {/* Section label */}
        <Reveal className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
          <span className="h-px w-8 bg-forest-600/50" />
          <span>Who This Is For</span>
        </Reveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Image — tall, spans 2 rows on left */}
          <div className="md:row-span-2 relative min-h-[280px] md:min-h-0 overflow-hidden bg-forest-800">
            <Image
              src="/images/for-you.jpg"
              alt="A woman in quiet reflection outdoors"
              fill
              quality={90}
              sizes="(min-width: 1280px) 480px, (min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-forest-950/15" />
          </div>

          {/* Headline cell */}
          <Reveal className="md:col-span-2 bg-cream-50 p-8 md:p-10 flex flex-col justify-center">
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.92] text-forest-950">
              This is for{" "}
              <em className="italic text-forest-600">you</em> if&hellip;
            </h2>
            <p className="mt-5 text-ink-600 text-[16px] leading-relaxed max-w-md">
              If any of these resonate, you&rsquo;re in the right place. You don&rsquo;t have to keep carrying this alone.
            </p>
          </Reveal>

          {/* Items 1 & 2 — share second row alongside image */}
          <RevealStagger className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3" stagger={0.08} delay={0.1}>
            {ITEMS.slice(0, 2).map((item, i) => (
              <RevealItem key={i}>
                <div className="bg-cream-50 p-7 md:p-8 h-full flex flex-col gap-4">
                  <span className="font-display italic text-3xl text-forest-300 leading-none select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-xl md:text-2xl text-forest-950 leading-snug flex-1">
                    {item}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          {/* Items 3, 4, 5 — full-width row of three */}
          <RevealStagger className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3" stagger={0.08} delay={0.15}>
            {ITEMS.slice(2).map((item, i) => (
              <RevealItem key={i}>
                <div className="bg-forest-800 text-cream-50 p-7 md:p-8 h-full flex flex-col gap-4">
                  <span className="font-display italic text-3xl text-sage-300/50 leading-none select-none">
                    {String(i + 3).padStart(2, "0")}
                  </span>
                  <p className="font-display text-xl md:text-2xl text-cream-50 leading-snug flex-1">
                    {item}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          {/* CTA — full width */}
          <Reveal className="md:col-span-3 bg-forest-950 p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" delay={0.25}>
            <p className="font-display italic text-2xl md:text-3xl text-cream-50">
              Ready to stop carrying this alone?
            </p>
            <button
              onClick={scrollToContact}
              className="group shrink-0 inline-flex items-center gap-3 border border-cream-50/30 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-cream-50/10 transition-colors"
            >
              Book a Clarity Call
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
