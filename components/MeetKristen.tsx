"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export function MeetKristen({
  portraitImage,
  bio1,
  bio2,
  bio3,
  bio4,
}: {
  portraitImage?: string;
  bio1?: string;
  bio2?: string;
  bio3?: string;
  bio4?: string;
} = {}) {
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
      className="relative bg-cream-50 text-ink-900 overflow-hidden"
    >
      <div className="grid md:grid-cols-2 min-h-screen">

        {/* Left — portrait image */}
        <div className="relative md:sticky md:top-0 md:h-screen order-2 md:order-1">
          <motion.div style={{ y }} className="absolute inset-0 -top-12 -bottom-12">
            <Image
              src={portraitImage ?? "/images/kristen-portrait-new.png"}
              alt="Kristen Truby, Christian life coach"
              fill
              quality={90}
              sizes="(min-width: 1280px) 640px, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </motion.div>

          <div className="absolute top-6 left-6 flex items-center gap-2 bg-cream-50/90 backdrop-blur-sm px-3 py-2 border border-ink-900/10">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest-xl text-forest-800">
              Now Accepting Clients
            </span>
          </div>

          <div className="absolute bottom-6 left-6 bg-cream-50/90 backdrop-blur-sm px-3 py-2 border border-ink-900/10">
            <div className="text-[10px] uppercase tracking-widest-xl text-forest-700">
              M.S. Sociology · 20+ Years
            </div>
          </div>
        </div>

        {/* Right — bio text */}
        <div className="order-1 md:order-2 px-8 md:px-12 lg:px-16 py-24 md:py-36 flex flex-col justify-center">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>Meet Kristen</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-forest-950">
              Hi, I&apos;m{" "}
              <em className="italic text-forest-600">Kristen</em> Truby.
            </h2>
          </Reveal>

          <div className="mt-10 space-y-6 text-ink-700 leading-relaxed text-[17px]">
            <Reveal delay={0.15}>
              <p>
                {bio1 ?? "I'm a certified Christian life coach with a Master's degree in Sociology, and I've spent over 20 years serving as a missionary around the world. That journey took me into many different communities and cultures, where I learned how to truly listen, connect, and understand people's stories on a deeper level."}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p>
                {bio2 ?? "Those experiences shaped the way I show up: with compassion, patience, and care."}
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <p>
                {bio3 ?? "Rooted and Rising was created for the seasons when life feels uncertain, heavy, or full of transition. I believe that with the right support, you can rediscover clarity, rebuild your strength, and move forward with purpose."}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p>
                {bio4 ?? "In our work together, I create a calm, faith-rooted space where you can slow down, breathe, and reconnect with who God created you to be. Whether you're navigating a life transition, rebuilding your faith, or simply ready to move forward with more intention; I'm honored to walk alongside you."}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.4}>
            <div className="mt-10 border-t border-ink-900/10 pt-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <button
                onClick={scrollToContact}
                className="group inline-flex items-center gap-3 bg-forest-950 text-cream-50 px-7 py-4 text-[11px] uppercase tracking-widest-xl hover:bg-forest-700 transition-colors"
              >
                Book a Clarity Call
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
              <div>
                <div className="font-display italic text-xl text-forest-700">
                 Kristen Truby
                </div>
                <div className="text-[10px] uppercase tracking-widest-xl text-ink-500 mt-1">
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
