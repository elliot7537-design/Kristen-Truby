"use client";

import { useReducedMotion } from "framer-motion";

type MarqueeProps = {
  items: string[];
  direction?: "left" | "right";
  className?: string;
  itemClassName?: string;
  separator?: string;
  tone?: "dark" | "light";
};

export function Marquee({
  items,
  direction = "left",
  className = "",
  itemClassName = "",
  separator = "✦",
  tone = "dark",
}: MarqueeProps) {
  const reduce = useReducedMotion();
  const loop = [...items, ...items];
  const animClass = reduce
    ? ""
    : direction === "left"
      ? "animate-marquee"
      : "animate-marquee-reverse";

  const bg = tone === "dark" ? "bg-forest-950 text-cream-50" : "bg-cream-100 text-forest-950";
  const sepColor = tone === "dark" ? "text-gold-500" : "text-forest-600";

  return (
    <div
      className={`relative overflow-hidden border-y border-cream-100/15 ${bg} ${className}`}
    >
      <div className={`flex whitespace-nowrap py-7 md:py-8 will-change-transform ${animClass}`}>
        {loop.map((item, i) => (
          <span
            key={i}
            className={`flex items-center font-display text-3xl md:text-5xl lg:text-6xl ${itemClassName}`}
          >
            <span className="italic px-7 md:px-10">{item}</span>
            <span className={`${sepColor} text-2xl md:text-3xl`} aria-hidden>
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
