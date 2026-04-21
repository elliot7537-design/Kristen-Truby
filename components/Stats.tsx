"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "@/lib/useCountUp";
import { EASE } from "@/lib/motion";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  pad?: number;
};

const STATS: Stat[] = [
  { value: 500, suffix: "+", label: "Women guided" },
  { value: 6, suffix: "+", label: "Years coaching", pad: 2 },
  { value: 12, label: "Countries reached", pad: 2 },
];

function StatItem({ stat, start }: { stat: Stat; start: boolean }) {
  const value = useCountUp(stat.value, { start, duration: 1800 });
  const padded = stat.pad ? String(value).padStart(stat.pad, "0") : value;

  return (
    <div className="py-10 md:py-0 md:px-8 border-t md:border-t-0 md:border-l border-cream-100/15 first:border-t-0 first:border-l-0">
      <div className="font-display text-6xl md:text-[110px] leading-none text-cream-50">
        {padded}
        <span className="text-gold-500">{stat.suffix ?? ""}</span>
      </div>
      <div className="mt-4 text-[11px] uppercase tracking-widest-xl text-cream-100/60">
        {stat.label}
      </div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-forest-950 text-cream-50 py-20 md:py-28 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 50%, rgba(185,201,181,0.5), transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300">
            <span className="h-px w-8 bg-sage-300/60" />
            <span>By the numbers</span>
          </div>
          <h2 className="font-display mt-6 text-3xl md:text-4xl text-cream-50 leading-snug">
            Quiet work, over time, <em className="italic text-sage-300">adds up</em>.
          </h2>
        </motion.div>

        <div
          ref={ref}
          className="mt-12 md:mt-16 grid md:grid-cols-3 border-t border-cream-100/15 pt-8"
        >
          {STATS.map((s) => (
            <StatItem key={s.label} stat={s} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
