"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { EASE } from "@/lib/motion";

export function MeetKristen() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <section
      id="meet-kristen"
      ref={ref}
      className="relative bg-forest-950 text-cream-50 py-24 md:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -left-8 bottom-0 font-display text-cream-50/[0.025] italic text-[180px] md:text-[320px] leading-none pointer-events-none select-none"
      >
        Kristen
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-12 gap-10 md:gap-16 items-start">

        <div className="md:col-span-5 relative">
          <div className="relative aspect-[4/5] w-full bg-forest-800 overflow-hidden">
            <motion.div style={{ y }} className="absolute inset-0 -top-12 -bottom-12">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
                alt="Kristen Truby, Christian life coach"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-forest-950/20" />

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-forest-950/80 backdrop-blur-sm px-3 py-2 border border-cream-100/15">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-300 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest-xl text-cream-50">
                Certified Life Coach
              </span>
            </div>

            <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest-xl text-cream-50/70">
              M.S. Sociology · 20+ Years Experience
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7 md:pt-4">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300">
              <span className="h-px w-8 bg-sage-300/60" />
              <span>Meet Kristen</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-cream-50">
              Hi, I&apos;m{" "}
              <em className="italic text-sage-300">Kristen</em> Truby.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-6 max-w-xl text-cream-50/75 leading-relaxed text-[17px]">
            <Reveal delay={0.15}>
              <p>
                I&apos;m a certified Christian life coach with a Master&apos;s degree in
                Sociology, and I&apos;ve spent over 20 years serving as a missionary
                around the world. That journey took me into many different communities
                and cultures, where I learned how to truly listen, connect, and
                understand people&apos;s stories on a deeper level.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p>
                Those experiences shaped the way I show up — with compassion,
                patience, and care.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p>
                Rooted and Rising was created for the seasons when life feels
                uncertain, heavy, or full of transition. I believe that with the
                right support, you can rediscover clarity, rebuild your strength,
                and move forward with purpose.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p>
                In our work together, I create a calm, faith-rooted space where
                you can slow down, breathe, and reconnect with who God created
                you to be. Whether you&apos;re navigating a life transition,
                rebuilding your faith, or simply ready to move forward with more
                intention — I&apos;m honored to walk alongside you.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <div className="mt-10 border-t border-cream-50/10 pt-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 bg-cream-50 text-forest-950 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-sage-100 transition-colors"
              >
                Book a Clarity Call
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
              <div>
                <div className="font-display italic text-xl text-sage-300">
                  — Kristen Truby
                </div>
                <div className="text-[10px] uppercase tracking-widest-xl text-cream-50/40 mt-1">
                  Founder · Rooted &amp; Rising
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
