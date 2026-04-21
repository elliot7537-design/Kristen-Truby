"use client";

import { Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "./Reveal";

const HOURS = [
  { day: "Monday", time: "9:00 AM – 5:00 PM" },
  { day: "Tuesday", time: "9:00 AM – 5:00 PM" },
  { day: "Wednesday", time: "9:00 AM – 7:00 PM" },
  { day: "Thursday", time: "9:00 AM – 5:00 PM" },
  { day: "Friday", time: "9:00 AM – 3:00 PM" },
  { day: "Saturday", time: "By appointment" },
  { day: "Sunday", time: "Closed" },
];

export function Footer() {
  return (
    <footer className="relative bg-forest-950 text-cream-50 pt-20 md:pt-28 pb-10 overflow-hidden grain">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300 mb-8">
            <span className="h-px w-8 bg-sage-300/60" />
            <span>Availability</span>
          </div>
        </Reveal>

        <RevealStagger className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px bg-cream-100/10 mb-20 md:mb-28">
          {HOURS.map((h) => (
            <RevealItem key={h.day}>
              <div className="bg-forest-950 p-5 md:p-6 h-full flex flex-col justify-between min-h-[110px]">
                <div className="text-[10px] uppercase tracking-widest-xl text-sage-300">
                  {h.day}
                </div>
                <div className="font-display text-base md:text-lg text-cream-50 mt-3 leading-snug">
                  {h.time}
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-20">
          <Reveal className="md:col-span-7">
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300 mb-6">
              <span className="h-px w-8 bg-sage-300/60" />
              <span>A word for the journey</span>
            </div>
            <p className="font-display italic text-3xl md:text-5xl leading-[1.1] text-cream-50">
              &ldquo;But those who hope in the Lord will renew their strength.
              They will soar on wings like eagles; they will run and not grow
              weary, they will walk and not be faint.&rdquo;
            </p>
            <p className="mt-5 text-[10px] uppercase tracking-widest-xl text-gold-500">
              — Isaiah 40:31
            </p>
          </Reveal>

          <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
            <div className="flex items-center gap-4 text-[11px] uppercase tracking-widest-xl text-sage-300 mb-6">
              <span className="h-px w-8 bg-sage-300/60" />
              <span>Get in touch</span>
            </div>
            <ul className="space-y-4 text-cream-100/85">
              <li>
                <a
                  href="mailto:hello@rootedandrising.com"
                  className="flex items-center gap-3 hover:text-gold-500 transition-colors"
                >
                  <Mail size={16} strokeWidth={1.5} />
                  <span className="text-sm tracking-wide">
                    hello@rootedandrising.com
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+1"
                  className="flex items-center gap-3 hover:text-gold-500 transition-colors"
                >
                  <Phone size={16} strokeWidth={1.5} />
                  <span className="text-sm tracking-wide">
                    By appointment
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-cream-100/70">
                <MapPin size={16} strokeWidth={1.5} />
                <span className="text-sm tracking-wide">In-person &amp; virtual</span>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="border-t border-cream-100/15 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col">
            <div className="font-display text-2xl text-cream-50">
              Rooted &amp; <span className="italic text-sage-300">Rising</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/50 mt-1">
              Life Coaching · Kristen Truby
            </div>
          </div>

          <div className="flex items-center gap-6">
            <SocialLink href="#" label="Instagram">
              <Instagram size={18} strokeWidth={1.5} />
            </SocialLink>
            <SocialLink href="#" label="YouTube">
              <Youtube size={18} strokeWidth={1.5} />
            </SocialLink>
            <SocialLink href="mailto:hello@rootedandrising.com" label="Email">
              <Mail size={18} strokeWidth={1.5} />
            </SocialLink>
          </div>

          <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/40">
            © {new Date().getFullYear()} Rooted &amp; Rising · All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="text-cream-100/70 hover:text-gold-500 transition-colors"
    >
      {children}
    </a>
  );
}
