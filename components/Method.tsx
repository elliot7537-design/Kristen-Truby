"use client";

import { BookOpenText, HeartHandshake, Footprints } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";
import { EASE } from "@/lib/motion";

const PILLARS = [
  {
    num: "01",
    icon: BookOpenText,
    title: "Fulfil Your Purpose",
    copy:
      "Life can feel overwhelming, but you don&rsquo;t have to navigate it alone. Together we uncover what God uniquely designed you to do and build a path toward it.",
  },
  {
    num: "02",
    icon: HeartHandshake,
    title: "Overcome Challenges",
    copy:
      "Through strong wisdom and Biblical truth, we face the hard things head-on &mdash; naming obstacles, shifting perspective, and finding the strength that was already inside you.",
  },
  {
    num: "03",
    icon: Footprints,
    title: "Grow in Confidence",
    copy:
      "Build a stronger, more confident future version of yourself. Your spiritual growth and personal transformation come together in a space that is both healing and holy.",
  },
];

export function Method() {
  const reduce = useReducedMotion();

  return (
    <section
      id="method"
      className="relative bg-cream-50 text-ink-900 py-24 md:py-36 border-t border-ink-900/5 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute right-0 top-0 font-display text-forest-600/[0.04] italic text-[220px] md:text-[340px] leading-none pointer-events-none select-none -translate-y-10"
      >
        Faith
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-20 items-start">
          <Reveal className="md:col-span-6">
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>The Method</span>
            </div>
            <h2 className="font-display mt-8 text-5xl md:text-7xl leading-[0.95] text-forest-950">
              Walk in <em className="italic text-forest-700">Purpose,</em>
              <br />
              Live in Faith.
            </h2>
          </Reveal>

          <Reveal className="md:col-span-5 md:col-start-8 md:pt-10" delay={0.1}>
            <p className="text-ink-700 leading-relaxed text-[17px]">
              Life can feel overwhelming, but you still have what it takes —
              because God placed it inside you. As a Christian life coach,
              I help you fulfill your purpose, overcome challenges with
              strong wisdom, and build a stronger, more confident future
              version of yourself.
            </p>
          </Reveal>
        </div>

        <RevealStagger className="grid md:grid-cols-3 gap-0 border-t border-ink-900/15 pt-14 md:pt-20">
          {PILLARS.map((p, idx) => (
            <RevealItem key={p.title}>
              <motion.div
                whileHover={reduce ? undefined : { y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`group relative flex flex-col h-full px-0 md:px-8 pb-10 md:pb-0 ${
                  idx > 0
                    ? "md:border-l border-ink-900/10 pt-10 md:pt-0"
                    : ""
                } ${
                  idx > 0 && idx < PILLARS.length
                    ? "border-t md:border-t-0 border-ink-900/10"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display italic text-6xl md:text-7xl text-forest-800 leading-none">
                    {p.num}
                  </span>
                  <p.icon
                    className="text-forest-600 transition-all duration-500 group-hover:text-gold-500 group-hover:rotate-[-6deg]"
                    size={28}
                    strokeWidth={1.25}
                  />
                </div>

                <div className="h-px w-12 bg-forest-700 mb-6 transition-all duration-500 group-hover:w-24 group-hover:bg-gold-500" />

                <h3 className="font-display text-3xl md:text-4xl text-forest-950 leading-tight">
                  {p.title}
                </h3>
                <p
                  className="mt-5 text-ink-700 leading-relaxed text-[15px]"
                  dangerouslySetInnerHTML={{ __html: p.copy }}
                />
              </motion.div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
