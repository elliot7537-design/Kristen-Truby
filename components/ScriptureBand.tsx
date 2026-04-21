"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { EASE } from "@/lib/motion";

export function ScriptureBand() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-120, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.15, 1]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-forest-950 text-cream-50 grain"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 -top-20 -bottom-20"
      >
        <Image
          src="https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=2400&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-950/70 to-forest-950"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10 py-28 md:py-40 lg:py-48">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300 mb-10 md:mb-14"
        >
          <span className="h-px w-10 bg-sage-300/60" />
          <span>Say on the Lord</span>
          <span className="h-px w-10 bg-sage-300/60" />
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          className="font-display text-cream-50 italic text-[38px] sm:text-5xl md:text-6xl lg:text-[88px] leading-[1.02] text-balance"
        >
          &ldquo;But those who hope in the Lord will{" "}
          <span className="text-sage-300">renew their strength.</span> They will
          soar on wings like eagles; they will run and not grow weary, they will
          walk and not be faint.&rdquo;
        </motion.blockquote>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-12 md:mt-16 flex items-center gap-4"
        >
          <span className="h-px w-8 bg-gold-500" />
          <span className="text-[11px] uppercase tracking-widest-xl text-gold-400">
            Isaiah 40:31
          </span>
        </motion.div>
      </div>
    </section>
  );
}
