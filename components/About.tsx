"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal } from "./Reveal";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <section
      id="about"
      ref={ref}
      className="bg-cream-50 text-ink-900 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-5 relative aspect-[4/5] w-full bg-cream-200 overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-0 -top-12 -bottom-12">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
              alt="Kristen Truby, Christian life coach"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="md:col-span-7 md:pt-6">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>About Kristen</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-5xl md:text-7xl leading-[0.95] text-forest-950">
              Hi, I&apos;m{" "}
              <em className="italic text-forest-700">Kristen</em> Truby.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-6 max-w-xl text-ink-700 leading-relaxed text-[17px]">
            <Reveal delay={0.15}>
              <p>
                I&apos;m a Certified Christian Life Coach with a Master&apos;s
                in Sociology and 20+ years of professional experience. I
                specialize in guiding individuals through life&apos;s most
                complex seasons of change, adversity, and growth — through
                Biblical truth and personal conviction.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p>
                I create a Christ-centered space where you can reconnect
                with your God-given identity and move forward with
                clarity, courage, and confidence. God is calling you
                higher, and I&apos;m honored to walk alongside you on
                that journey.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <p>
                Together we&apos;ll integrate faith, truth, and care to give
                you the tools you need — not just to cope, but to truly
                thrive in every stage of life.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.45}>
            <div className="mt-10 font-display italic text-3xl text-forest-800">
              — Kristen Truby
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
