"use client";

import Image from "next/image";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { ArrowRight, MoveDown } from "lucide-react";
import { EASE, EASE_REVEAL } from "@/lib/motion";
import { CircleBadge } from "./CircleBadge";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

const charFade: Variants = {
  hidden: { opacity: 0, y: 48, rotate: 3 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

function SplitWord({ word, emphasize }: { word: string; emphasize?: boolean }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {word.split("").map((ch, i) => (
        <motion.span
          key={i}
          variants={charFade}
          className={`inline-block ${emphasize ? "italic text-sage-300" : ""}`}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="top"
      className="relative min-h-screen bg-forest-950 text-cream-50 overflow-hidden grain"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(185,201,181,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(184,146,86,0.25), transparent 60%)",
        }}
      />

      <div
        aria-hidden
        className="absolute left-6 top-28 hidden lg:flex items-center gap-3 text-[10px] uppercase tracking-widest-xl text-cream-100/40 rotate-90 origin-top-left"
        style={{ transformOrigin: "top left" }}
      >
        <span className="h-px w-10 bg-cream-100/30" />
        <span>Est. 2018 · Faith-Based Guidance</span>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-32 md:pt-36 pb-16 md:pb-24 grid md:grid-cols-12 gap-10 md:gap-14 items-end min-h-screen">
        <motion.div
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)" }}
          transition={{
            duration: 1.4,
            ease: EASE_REVEAL,
            delay: 0.1,
          }}
          className="md:col-span-5 relative aspect-[3/4] w-full bg-forest-900"
        >
          <Image
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80"
            alt="Kristen Truby portrait"
            fill
            priority
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.4, ease: EASE }}
            className="absolute -right-10 md:-right-14 -top-10 md:-top-14 w-32 h-32 md:w-44 md:h-44 hidden sm:block"
          >
            <CircleBadge />
          </motion.div>

          <div className="absolute top-4 left-4 flex items-center gap-2 bg-forest-950/80 backdrop-blur-sm px-3 py-2 border border-cream-100/15">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest-xl text-cream-50">
              Now Accepting New Clients
            </span>
          </div>

          <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest-xl text-cream-50/80">
            Certified · Christ-Centered
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduce ? 0 : 0.04,
                delayChildren: 0.4,
              },
            },
          }}
          className="md:col-span-7 flex flex-col"
        >
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300"
          >
            <span className="h-px w-8 bg-sage-300/60" />
            <span>Rooted &amp; Rising · Life Coaching</span>
          </motion.div>

          <h1 className="font-display text-cream-50 mt-8 text-[52px] leading-[0.95] sm:text-7xl md:text-[92px] md:leading-[0.94]">
            <span className="block">
              <SplitWord word="Supporting" />{" "}
              <SplitWord word="you" />
            </span>
            <span className="block">
              <SplitWord word="through" emphasize />{" "}
              <SplitWord word="every" />
            </span>
            <span className="block">
              <SplitWord word="stage" /> <SplitWord word="of" />{" "}
              <motion.span
                variants={charFade}
                className="inline-block bg-cream-50 text-forest-950 px-3 italic font-medium"
              >
                life.
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-cream-100/80 text-base md:text-lg leading-relaxed"
          >
            We don&apos;t give you strength — we help you remember your own.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <motion.a
              href="#contact"
              whileHover={reduce ? undefined : { y: -2 }}
              className="group inline-flex items-center gap-3 bg-cream-50 text-forest-950 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-sage-300 transition-colors"
            >
              Book Now
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </motion.a>
            <motion.a
              href="#method"
              whileHover={reduce ? undefined : { y: -2 }}
              className="inline-flex items-center gap-3 border border-cream-100/30 px-7 py-4 text-[11px] uppercase tracking-widest-xl text-cream-50 hover:border-cream-50 hover:bg-cream-50/5 transition-all"
            >
              Learn More
            </motion.a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-16 md:mt-20 grid grid-cols-3 max-w-xl border-t border-cream-100/15 pt-6 gap-4"
          >
            <div>
              <div className="font-display text-4xl md:text-5xl text-cream-50">
                26<span className="text-gold-500">+</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/60 mt-2">
                Clients
              </div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-cream-50">
                M.S.
              </div>
              <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/60 mt-2">
                Sociology
              </div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-cream-50">
                98<span className="text-gold-500">%</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/60 mt-2">
                Satisfaction
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-cream-100/50"
        >
          <span className="text-[10px] uppercase tracking-widest-xl">Scroll</span>
          <MoveDown
            size={16}
            strokeWidth={1.25}
            className="animate-bounce"
            style={{ animationDuration: "2.5s" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
