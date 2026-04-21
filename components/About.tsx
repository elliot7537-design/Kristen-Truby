"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { EASE } from "@/lib/motion";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);
  const yDetail = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);

  return (
    <section
      id="about"
      ref={ref}
      className="relative bg-cream-50 text-ink-900 py-24 md:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -left-10 bottom-0 font-display text-forest-600/[0.035] italic text-[180px] md:text-[320px] leading-none pointer-events-none select-none"
      >
        Kristen
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-start">
        <div className="md:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full bg-cream-200 overflow-hidden">
            <motion.div style={{ y }} className="absolute inset-0 -top-12 -bottom-12">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                alt="Kristen Truby, Christian life coach"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>

            <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
              <span className="bg-cream-50/95 backdrop-blur-sm px-3 py-1.5 text-[10px] uppercase tracking-widest-xl text-forest-800">
                Certified Life Coach
              </span>
            </div>
          </div>

          <motion.div
            style={{ y: yDetail }}
            className="hidden md:block absolute -bottom-16 -right-8 w-44 h-56 bg-forest-800 z-10"
          >
            <Image
              src="https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80"
              alt=""
              fill
              sizes="180px"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 border border-cream-50/10" />
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

            <Reveal delay={0.2}>
              <motion.figure
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                className="relative my-10 pl-8 border-l-2 border-gold-500"
              >
                <Quote
                  size={20}
                  className="absolute -left-[11px] top-0 bg-cream-50 text-gold-500"
                  strokeWidth={1.5}
                />
                <blockquote className="font-display italic text-2xl md:text-3xl text-forest-800 leading-[1.25]">
                  Real change starts within. God is calling you higher — and
                  I&apos;m honored to walk alongside you on that journey.
                </blockquote>
              </motion.figure>
            </Reveal>

            <Reveal delay={0.25}>
              <p>
                I create a Christ-centered space where you can reconnect
                with your God-given identity and move forward with
                clarity, courage, and confidence. Together we&apos;ll
                integrate faith, truth, and care to give you the tools
                you need — not just to cope, but to truly thrive.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.35}>
            <div className="mt-12 flex items-end justify-between border-t border-ink-900/10 pt-6 max-w-xl">
              <div>
                <div className="font-display italic text-3xl text-forest-800">
                  — Kristen Truby
                </div>
                <div className="text-[10px] uppercase tracking-widest-xl text-forest-600/70 mt-2">
                  Founder · Rooted &amp; Rising
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest-xl text-ink-500">
                  M.S. Sociology
                </div>
                <div className="text-[10px] uppercase tracking-widest-xl text-ink-500 mt-1">
                  Certified Life Coach
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
