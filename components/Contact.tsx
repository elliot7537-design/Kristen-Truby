"use client";

import { Mail } from "lucide-react";
import { Reveal } from "./Reveal";
import { BookingWidget } from "./BookingWidget";

export function Contact() {
  return (
    <section
      id="contact"
      className="bg-cream-50 text-ink-900 py-24 md:py-36 border-t border-ink-900/5"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 grid md:grid-cols-12 gap-12 md:gap-16">

        {/* Left — info */}
        <div className="md:col-span-4">
          <Reveal>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-forest-600">
              <span className="h-px w-8 bg-forest-600/50" />
              <span>Take the Next Step</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display mt-8 text-5xl md:text-6xl leading-[0.95] text-forest-950">
              Ready to move{" "}
              <em className="italic text-forest-700">forward?</em>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-ink-700 leading-relaxed text-[17px]">
              Book a free 30-minute clarity call. Choose a time that works for you, wherever you are in the world.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <a
              href="mailto:hello@rootedandrising.com"
              className="mt-8 inline-flex items-center gap-3 text-forest-700 hover:text-forest-500 transition-colors"
            >
              <Mail size={16} strokeWidth={1.5} />
              <span className="text-sm tracking-wide">hello@rootedandrising.com</span>
            </a>
          </Reveal>
        </div>

        {/* Right — native booking widget */}
        <Reveal className="md:col-span-8" delay={0.15}>
          <BookingWidget />
        </Reveal>

      </div>
    </section>
  );
}
