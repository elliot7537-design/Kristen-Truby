"use client";

import { BookOpenText, HeartHandshake, Footprints } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const STEPS = [
  {
    num: "01",
    icon: BookOpenText,
    title: "Fulfill Your Purpose",
    copy:
      "Life can feel overwhelming, but you don’t have to navigate it alone. Together we uncover what God uniquely designed you to do and build a path toward it.",
  },
  {
    num: "02",
    icon: HeartHandshake,
    title: "Overcome Challenges",
    copy:
      "Through strong wisdom and Biblical truth, we face the hard things head-on: naming obstacles, shifting perspective, and finding the strength that was already inside you.",
  },
  {
    num: "03",
    icon: Footprints,
    title: "Grow in Confidence",
    copy:
      "Step into a stronger, more confident version of who you were created to be. Your spiritual growth and personal transformation come together in a space that is both healing and holy.",
  },
];

export function Method() {
  return (
    <section
      id="method"
      className="relative bg-cream-50 text-ink-900 py-24 md:py-36 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute right-0 top-0 font-display text-forest-600/[0.04] italic text-[220px] md:text-[340px] leading-none pointer-events-none select-none -translate-y-10"
      >
        Faith
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        <Reveal className="max-w-2xl mb-20 md:mb-28">
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
            <span className="h-px w-8 bg-forest-600/50" />
            <span>The Method</span>
          </div>
          <h2 className="font-display mt-8 text-5xl md:text-7xl leading-[0.95] text-forest-950">
            Walk in <em className="italic text-forest-700">Purpose,</em>
            <br />
            Live in Faith.
          </h2>
          <p className="mt-8 text-ink-700 leading-relaxed text-[17px]">
            Life can feel overwhelming, but you still have what it takes —
            because God placed it inside you.
          </p>
        </Reveal>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Vertical connecting line — desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute left-[calc(50%-0.5px)] top-0 bottom-0 w-px bg-ink-900/10"
          />

          <RevealStagger className="flex flex-col gap-0" stagger={0.15} delay={0.1}>
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              const Icon = step.icon;
              return (
                <RevealItem key={step.num} y={20}>
                  <div className={`relative grid md:grid-cols-2 gap-0 mb-0 ${i > 0 ? "border-t border-ink-900/10" : ""}`}>

                    {/* Step number node on the connecting line */}
                    <div
                      aria-hidden
                      className="hidden md:flex absolute left-1/2 top-10 -translate-x-1/2 w-10 h-10 rounded-full bg-cream-50 border border-ink-900/15 items-center justify-center z-10"
                    >
                      <span className="font-display italic text-sm text-forest-700">{step.num}</span>
                    </div>

                    {/* Content — alternates sides */}
                    <div className={`py-12 md:py-16 ${isEven ? "md:pr-20 md:text-right md:col-start-1" : "md:pl-20 md:col-start-2 md:row-start-1"}`}>
                      <div className={`flex items-center gap-3 mb-5 ${isEven ? "md:justify-end" : ""}`}>
                        <Icon
                          size={22}
                          strokeWidth={1.25}
                          className="text-forest-600 shrink-0"
                        />
                        <span className="text-[10px] uppercase tracking-widest-xl text-forest-600">
                          Step {step.num}
                        </span>
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl text-forest-950 leading-tight">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-ink-700 leading-relaxed text-[15px] max-w-sm md:max-w-none">
                        {step.copy}
                      </p>
                    </div>

                    {/* Empty cell on the other side (keeps grid alignment) */}
                    <div className={isEven ? "md:col-start-2 md:row-start-1" : "md:col-start-1"} />
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>

      </div>
    </section>
  );
}
