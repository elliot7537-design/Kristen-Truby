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
  { value: 26, suffix: "+", label: "Clients served", pad: 2 },
  { value: 20, suffix: "+", label: "Years of experience", pad: 2 },
  { value: 98, suffix: "%", label: "Client satisfaction" },
];

function StatItem({ stat, start }: { stat: Stat; start: boolean }) {
  const value = useCountUp(stat.value, { start, duration: 1800 });
  const padded = stat.pad ? String(value).padStart(stat.pad, "0") : value;

  return (
    <div className="py-10 md:py-0 md:px-8 border-t md:border-t-0 md:border-l border-forest-950/15 first:border-t-0 first:border-l-0">
      <div className="font-display text-6xl md:text-[110px] leading-none text-forest-950">
        {padded}
        <span className="text-forest-600">{stat.suffix ?? ""}</span>
      </div>
      <div className="mt-4 text-[11px] uppercase tracking-widest-xl text-forest-800/60">
        {stat.label}
      </div>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-sage-300 text-forest-950 py-20 md:py-28 relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-700">
            <span className="h-px w-8 bg-forest-700/60" />
            <span>By the numbers</span>
          </div>
          <h2 className="font-display mt-6 text-3xl md:text-4xl text-forest-950 leading-snug">
            Real change starts <em className="italic text-forest-700">within.</em>
          </h2>
        </motion.div>

        <div
          ref={ref}
          className="mt-12 md:mt-16 grid md:grid-cols-3 border-t border-forest-950/15 pt-8"
        >
          {STATS.map((s) => (
            <StatItem key={s.label} stat={s} start={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
