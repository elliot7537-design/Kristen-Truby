"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";
import { EASE } from "@/lib/motion";

const ITEMS = [
  "You're going through a life transition and feel unsure of what's next.",
  "You feel stuck or unmotivated in your faith.",
  "You're carrying disappointment or emotional weight.",
  "You're tired of trying to be perfect.",
  "You know there's more in you — but can't seem to access it.",
];

export function ForYouIf() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-cream-100 text-ink-900 py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <Reveal className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>Who This Is For</span>
            </div>
            <h2 className="font-display mt-6 text-5xl md:text-7xl leading-[0.92] text-forest-950">
              This is for <em className="italic text-forest-600">you</em> if&hellip;
            </h2>
          </div>
          <p className="text-ink-600 text-[16px] leading-relaxed max-w-xs md:mb-2">
            If any of these resonate, you&rsquo;re in the right place.
          </p>
        </Reveal>

        <RevealStagger
          as="ul"
          className="border-t border-ink-900/10"
          stagger={0.08}
          delay={0.1}
        >
          {ITEMS.map((item, i) => (
            <RevealItem key={i} as="li" y={12}>
              <motion.div
                whileHover={reduce ? undefined : { x: 6 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group flex items-start gap-6 md:gap-10 py-7 md:py-8 border-b border-ink-900/10 cursor-default"
              >
                <span className="font-display italic text-xl text-forest-400 leading-none mt-1 w-8 shrink-0 text-right select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-2xl md:text-4xl lg:text-5xl text-ink-900 leading-tight flex-1 group-hover:text-forest-700 transition-colors duration-300">
                  {item}
                </p>
                <ArrowRight
                  size={18}
                  className="shrink-0 mt-2 text-forest-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1"
                />
              </motion.div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.4}>
          <div className="mt-12 flex justify-end">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-forest-950 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-forest-800 transition-colors"
            >
              Book a Clarity Call
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
