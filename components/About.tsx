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
              The <em className="italic text-forest-700">guide</em> beside
              <br />
              you on the way.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-6 max-w-xl text-ink-700 leading-relaxed text-[17px]">
            <Reveal delay={0.15}>
              <p>
                For years I chased a version of &ldquo;enough&rdquo; the world
                kept moving. I built the career, checked the boxes, and
                quietly wondered why my soul still felt thirsty. Then Jesus
                met me in the noise — and slowly, gently, taught me how to
                listen again.
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p>
                Now I walk alongside women who want more than a life that
                looks good on paper. Through Scripture, honest
                conversation, and a lot of prayer, we rebuild identity
                from the inside out — rooted in who God says you are, not
                what you produce.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <p>
                This isn&apos;t therapy and it isn&apos;t a pep talk.
                It&apos;s a surrendered friendship with a clear direction:
                a life that&apos;s actually yours, given back to the One
                who made it.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.45}>
            <div className="mt-10 font-display italic text-3xl text-forest-800">
              — Kristen
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
