"use client";

import Image from "next/image";
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
    <section className="bg-cream-100 text-ink-900 overflow-hidden">
      <div className="grid md:grid-cols-2">

        {/* Left — content */}
        <div className="px-8 md:px-12 lg:px-16 py-24 md:py-36">

          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>Who This Is For</span>
            </div>
            <h2 className="font-display mt-6 text-5xl md:text-6xl lg:text-7xl leading-[0.92] text-forest-950">
              This is for <em className="italic text-forest-600">you</em> if&hellip;
            </h2>
          </Reveal>

          <RevealStagger
            as="ul"
            className="mt-12 border-t border-ink-900/10"
            stagger={0.08}
            delay={0.1}
          >
            {ITEMS.map((item, i) => (
              <RevealItem key={i} as="li" y={12}>
                <motion.div
                  whileHover={reduce ? undefined : { x: 5 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="group flex items-start gap-5 py-5 border-b border-ink-900/10 cursor-default"
                >
                  <span className="font-display italic text-base text-forest-400 leading-none mt-1.5 w-6 shrink-0 text-right select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-xl md:text-2xl text-ink-900 leading-snug flex-1 group-hover:text-forest-700 transition-colors duration-300">
                    {item}
                  </p>
                </motion.div>
              </RevealItem>
            ))}
          </RevealStagger>

          <Reveal delay={0.5}>
            <a
              href="#contact"
              className="group mt-10 inline-flex items-center gap-3 bg-forest-950 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-forest-700 transition-colors"
            >
              Book a Clarity Call
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </Reveal>
        </div>

        {/* Right — image */}
        <div className="relative min-h-[50vh] md:min-h-0 md:sticky md:top-0 md:h-screen">
          <Image
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1400&q=80"
            alt="A woman in quiet reflection outdoors"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/10" />
        </div>

      </div>
    </section>
  );
}
