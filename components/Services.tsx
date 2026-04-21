"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";
import { EASE } from "@/lib/motion";

const OFFERINGS = [
  {
    kind: "01 · Individual",
    title: "1:1 Life Coaching",
    copy: "Personal, one-on-one coaching sessions tailored to your specific season of life. We&rsquo;ll work through challenges, clarify your purpose, and build a plan rooted in Biblical truth.",
    cta: "Book an Appointment",
  },
  {
    kind: "02 · Online",
    title: "Virtual Sessions",
    copy: "Coaching is available online so you can grow from anywhere. Our secure client forms are completed before your appointment so we can jump straight into what matters most.",
    cta: "Get Started Online",
  },
  {
    kind: "03 · Free Intro",
    title: "Free Consultation",
    copy: "Not sure if coaching is right for you? Start with a free 30-minute consultation. No pressure &mdash; just an honest conversation about where you are and where God is calling you.",
    cta: "Book Free Session",
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
              Every session is Christ-centered and built to meet you where you
              are. If you have questions, call or email and we&apos;ll respond as
              soon as possible. We can&apos;t wait to meet you.
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
                <div className="mt-8 border-t border-ink-900/10 pt-5">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest-xl text-forest-800 group-hover:text-gold-500 transition-colors"
                  >
                    {o.cta}
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
