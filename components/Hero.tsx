"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, EASE_REVEAL } from "@/lib/motion";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen bg-forest-950 text-cream-50 overflow-hidden grain"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(185,201,181,0.3), transparent 50%), radial-gradient(circle at 80% 70%, rgba(184,146,86,0.2), transparent 60%)",
        }}
      />

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
          <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest-xl text-cream-50/80">
            Nashville, TN
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.4 } },
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

          <motion.h1
            variants={fadeUp}
            className="font-display text-cream-50 mt-8 text-[54px] leading-[0.95] sm:text-7xl md:text-[92px] md:leading-[0.94]"
          >
            Supporting you{" "}
            <em className="italic text-sage-300">through</em>
            <br />
            every stage of{" "}
            <span className="inline-block bg-cream-50 text-forest-950 px-3 italic font-medium">
              life.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-8 max-w-xl text-cream-100/80 text-base md:text-lg leading-relaxed"
          >
            We don&apos;t give you strength — we help you remember your own.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 bg-cream-50 text-forest-950 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-sage-300 transition-colors"
            >
              Book Now
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
            <a
              href="#method"
              className="inline-flex items-center gap-3 border border-cream-100/30 px-7 py-4 text-[11px] uppercase tracking-widest-xl text-cream-50 hover:border-cream-50 hover:bg-cream-50/5 transition-all"
            >
              Learn More
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-16 md:mt-20 grid grid-cols-3 max-w-lg border-t border-cream-100/15 pt-6 gap-4"
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
      </div>
    </section>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};
