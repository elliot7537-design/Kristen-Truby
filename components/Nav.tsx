"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { EASE } from "@/lib/motion";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Coaching" },
  { href: "#method", label: "The Method" },
  { href: "#testimonials", label: "Testimonials" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-sage-300/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10 py-5">
        <a
          href="#top"
          className="font-display text-forest-950 text-xl md:text-2xl tracking-wide leading-none"
        >
          <span className="block text-[10px] non-italic uppercase tracking-widest-xl text-forest-700/80 font-sans mb-0.5">
            Rooted &amp; Rising
          </span>
          Kristen <span className="italic text-forest-700">Truby</span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase tracking-widest-xl text-forest-900/85 hover:text-forest-950 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 border border-forest-950/40 px-5 py-2.5 text-[11px] uppercase tracking-widest-xl text-forest-950 hover:bg-forest-950 hover:text-cream-50 transition-all duration-300"
        >
          Book a Consultation
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-forest-950 p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="md:hidden overflow-hidden bg-sage-300/95 backdrop-blur-md border-t border-forest-950/10"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-widest-xl text-forest-900/90"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center border border-forest-950/40 px-5 py-3 text-[11px] uppercase tracking-widest-xl text-forest-950"
              >
                Book a Call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
