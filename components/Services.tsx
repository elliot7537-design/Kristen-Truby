"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";
import { EASE } from "@/lib/motion";

const OFFERINGS = [
  {
    kind: "01 · Foundation",
    title: "1:1 Coaching",
    copy: "Twelve weeks, one-on-one. Weekly sessions rooted in Scripture, bi-weekly prayer walks, and a plan built for the season you&rsquo;re actually in.",
    price: "From $2,400",
  },
  {
    kind: "02 · Community",
    title: "Group Circles",
    copy: "Eight-woman cohorts that meet for eight weeks. A quiet room to ask the questions you can&rsquo;t ask out loud anywhere else.",
    price: "From $675",
  },
  {
    kind: "03 · Intensive",
    title: "Faith & Purpose Intensive",
    copy: "A two-day in-person retreat to uncover calling, name the lies you&rsquo;ve been agreeing with, and leave with a written rule of life.",
    price: "From $1,200",
  },
];

export function Services() {
  const reduce = useReducedMotion();
  return (
    <section
      id="services"
      className="bg-cream-100 text-ink-900 py-24 md:py-36 border-t border-ink-900/5"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-end mb-16 md:mb-24">
          <Reveal className="md:col-span-5">
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>Coaching</span>
            </div>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-forest-950">
              Ways we can <em className="italic text-forest-700">walk</em> together.
            </h2>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
            <p className="text-ink-700 leading-relaxed text-[17px] max-w-lg">
              Every offering is Christ-centered, Scripture-saturated, and
              built to meet you where you are. Choose the rhythm that fits
              your season — we&apos;ll refine the rest together.
            </p>
          </Reveal>
        </div>

        <RevealStagger className="grid md:grid-cols-3 gap-px bg-ink-900/10">
          {OFFERINGS.map((o) => (
            <RevealItem key={o.title}>
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="group relative bg-cream-50 p-8 md:p-10 h-full flex flex-col"
              >
                <div className="text-[10px] uppercase tracking-widest-xl text-forest-600">
                  {o.kind}
                </div>
                <h3 className="font-display text-3xl md:text-4xl mt-5 text-forest-950">
                  {o.title}
                </h3>
                <p
                  className="mt-5 text-ink-700 leading-relaxed text-[15px] flex-1"
                  dangerouslySetInnerHTML={{ __html: o.copy }}
                />
                <div className="mt-8 flex items-center justify-between border-t border-ink-900/10 pt-5">
                  <span className="text-[11px] uppercase tracking-widest-xl text-forest-800">
                    {o.price}
                  </span>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest-xl text-forest-800 group-hover:text-gold-500 transition-colors"
                  >
                    Learn more
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
