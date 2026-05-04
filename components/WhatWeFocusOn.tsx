"use client";

import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";
import { EASE } from "@/lib/motion";

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
  const reduce = useReducedMotion();

  return (
    <section className="bg-forest-950 text-cream-50 py-24 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-24">
          <Reveal className="md:col-span-6">
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300">
              <span className="h-px w-8 bg-sage-300/60" />
              <span>The Work</span>
            </div>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-cream-50">
              What we{" "}
              <em className="italic text-sage-300">focus</em> on.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-5 md:col-start-8 flex flex-col justify-end" delay={0.15}>
            <p className="text-cream-50/70 leading-relaxed text-[17px]">
              This isn&rsquo;t about becoming someone new. It&rsquo;s about returning to your foundation and rebuilding from there.
            </p>
          </Reveal>
        </div>

        <RevealStagger
          className="grid md:grid-cols-2 gap-px bg-cream-50/10"
          stagger={0.1}
          delay={0.1}
        >
          {PILLARS.map((p) => (
            <RevealItem key={p.num}>
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group bg-forest-950 p-8 md:p-10 h-full flex flex-col border border-cream-50/[0.07] hover:border-sage-300/30 transition-colors"
              >
                <div className="font-display italic text-5xl md:text-6xl text-sage-300/20 leading-none select-none">
                  {p.num}
                </div>
                <h3 className="font-display text-2xl md:text-3xl mt-5 text-cream-50 leading-snug">
                  {p.title}
                </h3>
                <p className="mt-4 text-cream-50/60 leading-relaxed text-[15px] flex-1">
                  {p.copy}
                </p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.3}>
          <div className="mt-12 flex justify-center">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 border border-cream-50/20 text-cream-50 px-8 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-cream-50/5 hover:border-cream-50/40 transition-all"
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
