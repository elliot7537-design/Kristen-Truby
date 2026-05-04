"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";
import { EASE } from "@/lib/motion";

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
  const imgRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60]);

  return (
    <section id="about" className="bg-cream-200 text-ink-900 overflow-hidden">

      {/* Full-width image banner */}
      <div ref={imgRef} className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 scale-110">
          <Image
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2400&q=80"
            alt="A sunlit forest path — moving forward with faith"
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
        </motion.div>
        <div className="absolute inset-0 bg-forest-950/30" />

        {/* Headline overlaid on image */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-16 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-200 mb-6">
              <span className="h-px w-8 bg-sage-200/60" />
              <span>The Approach</span>
            </div>
            <h2 className="font-display text-6xl sm:text-7xl md:text-[96px] leading-[0.9] text-cream-50">
              Rooted <em className="italic text-sage-300">&amp; Rising.</em>
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Content below image */}
      <div className="px-6 lg:px-16 py-20 md:py-28 mx-auto max-w-7xl">

        <Reveal>
          <p className="text-ink-700 text-[18px] md:text-xl leading-relaxed max-w-2xl mb-16 md:mb-20">
            I don&rsquo;t believe in forcing change. I help you recognize what&rsquo;s already there — and learn how to walk in it again. This faith-based coaching is rooted in:
          </p>
        </Reveal>

        <RevealStagger as="ul" className="flex flex-col" stagger={0.12} delay={0.1}>
          {VALUES.map((v, i) => (
            <RevealItem key={i} as="li" y={16}>
              <div className="grid md:grid-cols-2 gap-4 md:gap-20 py-8 md:py-10 border-b border-ink-900/10 items-baseline">
                <span className="font-display italic text-3xl md:text-4xl text-forest-700">
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
          <div className="mt-16 md:mt-20 border-l-4 border-forest-600 pl-8 md:pl-12 max-w-3xl">
            <blockquote className="font-display italic text-3xl md:text-4xl lg:text-5xl text-forest-950 leading-[1.15]">
              &ldquo;You don&rsquo;t need to become someone new. You need to return to who you are in God.&rdquo;
            </blockquote>
            <div className="mt-6 text-[10px] uppercase tracking-widest-xl text-forest-600/70">
              — Kristen Truby · Founder, Rooted &amp; Rising
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
