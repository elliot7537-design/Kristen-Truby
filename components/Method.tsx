"use client";

import { BookOpenText, HeartHandshake, Footprints } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const PILLARS = [
  {
    icon: BookOpenText,
    title: "Fulfil Your Purpose",
    copy:
      "Life can feel overwhelming, but you don&rsquo;t have to navigate it alone. Together we uncover what God uniquely designed you to do and build a path toward it.",
  },
  {
    icon: HeartHandshake,
    title: "Overcome Challenges",
    copy:
      "Through strong wisdom and Biblical truth, we face the hard things head-on — naming obstacles, shifting perspective, and finding the strength that was already inside you.",
  },
  {
    icon: Footprints,
    title: "Grow in Confidence",
    copy:
      "Build a stronger, more confident future version of yourself. Your spiritual growth and personal transformation come together in a space that is both healing and holy.",
  },
];

export function Method() {
  return (
    <section
      id="method"
      className="bg-cream-50 text-ink-900 py-24 md:py-36 border-t border-ink-900/5"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-20 items-start">
          <Reveal className="md:col-span-6">
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>The Method</span>
            </div>
            <h2 className="font-display mt-8 text-5xl md:text-7xl leading-[0.95] text-forest-950">
              Walk in <em className="italic text-forest-700">Purpose,</em>
              <br />
              Live in Faith.
            </h2>
          </Reveal>

          <Reveal className="md:col-span-5 md:col-start-8 md:pt-10" delay={0.1}>
            <p className="text-ink-700 leading-relaxed text-[17px]">
              Life can feel overwhelming, but you still have what it takes —
              because God placed it inside you. As a Christian life coach,
              I help you fulfill your purpose, overcome challenges with
              strong wisdom, and build a stronger, more confident future
              version of yourself.
            </p>
          </Reveal>
        </div>

        <RevealStagger className="grid md:grid-cols-3 gap-10 md:gap-14 border-t border-ink-900/10 pt-14 md:pt-20">
          {PILLARS.map((p) => (
            <RevealItem key={p.title}>
              <div className="flex flex-col">
                <p.icon className="text-forest-700" size={32} strokeWidth={1.25} />
                <h3 className="font-display mt-6 text-2xl md:text-3xl text-forest-950">
                  {p.title}
                </h3>
                <p
                  className="mt-4 text-ink-700 leading-relaxed text-[15px]"
                  dangerouslySetInnerHTML={{ __html: p.copy }}
                />
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
