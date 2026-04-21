"use client";

import { Instagram, Youtube, Mail } from "lucide-react";
import { Reveal } from "./Reveal";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-50 pt-20 md:pt-28 pb-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <p className="font-display italic text-3xl md:text-5xl leading-tight text-cream-50">
            &ldquo;But those who hope in the Lord will renew their strength.
            They will soar on wings like eagles; they will run and not grow
            weary, they will walk and not be faint.&rdquo;
          </p>
          <p className="mt-5 text-[10px] uppercase tracking-widest-xl text-sage-300">
            — Isaiah 40:31
          </p>
        </Reveal>

        <div className="mt-16 md:mt-24 border-t border-cream-100/15 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col">
            <div className="font-display text-xl text-cream-50">
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
            <SocialLink href="mailto:hello@kristentruby.com" label="Email">
              <Mail size={18} strokeWidth={1.5} />
            </SocialLink>
          </div>

          <div className="text-[10px] uppercase tracking-widest-xl text-cream-100/40">
            © {new Date().getFullYear()} Rooted &amp; Rising Life Coaching · All rights reserved
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
