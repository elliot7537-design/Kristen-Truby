"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const PILLARS = [
  {
    num: "01",
    title: "Rebuilding Your Spiritual Foundation",
    copy: "Reconnecting with God's truth as the anchor for every decision, relationship, and next step.",
  },
  {
    num: "02",
    title: "Gaining Clarity in Seasons of Transition",
    copy: "Moving through uncertainty with purpose — not paralysis — by uncovering what God has already placed in you.",
  },
  {
    num: "03",
    title: "Strengthening Confidence and Direction",
    copy: "Releasing the weight of perfectionism and people-pleasing so you can walk boldly in who you were created to be.",
  },
  {
    num: "04",
    title: "Moving Forward with Consistency and Faith",
    copy: "Building sustainable momentum so growth doesn't stop when life gets hard.",
  },
];

export function WhatWeFocusOn() {
  return (
    <section className="bg-cream-50 text-ink-900 overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-screen">

        {/* Left — sticky image */}
        <div className="relative md:sticky md:top-0 md:h-screen order-2 md:order-1">
          <Image
            src="/images/focus.jpg"
            alt="Peaceful nature — a reminder to pause and reflect"
            fill
            quality={90}
            sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/20" />
          <div className="absolute bottom-8 left-8 text-[10px] uppercase tracking-widest-xl text-cream-50/70">
            Rooted &amp; Rising · Est. 2018
          </div>
        </div>

        {/* Right — content */}
        <div className="order-1 md:order-2 px-8 md:px-12 lg:px-16 py-24 md:py-36 flex flex-col justify-center">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>The Work</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-forest-950">
              What we{" "}
              <em className="italic text-forest-600">focus</em> on.
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 text-ink-700 leading-relaxed text-[17px] max-w-md">
              This isn&rsquo;t about becoming someone new. It&rsquo;s about returning to your foundation and rebuilding from there.
            </p>
          </Reveal>

          <RevealStagger
            as="ul"
            className="mt-12 flex flex-col divide-y divide-ink-900/10 border-t border-ink-900/10"
            stagger={0.1}
            delay={0.2}
          >
            {PILLARS.map((p) => (
              <RevealItem key={p.num} as="li" y={14}>
                <div className="py-6 flex gap-5">
                  <span className="font-display italic text-2xl text-forest-600 leading-none mt-1 shrink-0 w-7 text-right select-none">
                    {p.num}
                  </span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-forest-950 leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-ink-600 text-[14px] leading-relaxed">
                      {p.copy}
                    </p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal delay={0.5}>
            <a
              href="#contact"
              className="group mt-10 inline-flex items-center gap-3 bg-forest-950 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-forest-700 transition-colors self-start"
            >
              Book a Clarity Call
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
