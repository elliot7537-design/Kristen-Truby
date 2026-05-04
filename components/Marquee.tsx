"use client";

import {
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  useReducedMotion,
  motion,
} from "framer-motion";
import { useRef, useState } from "react";

type MarqueeProps = {
  items: string[];
  direction?: "left" | "right";
  className?: string;
  tone?: "dark" | "light";
};

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export function Marquee({
  items,
  direction = "left",
  className = "",
  tone = "dark",
}: MarqueeProps) {
  const reduce = useReducedMotion();
  const baseSpeed = direction === "left" ? -80 : 80; // px per second

  const x = useRef(0);
  const [renderX, setRenderX] = useState(0);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 0, 2000], [4, 1, 4], {
    clamp: true,
  });

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const moveBy = baseSpeed * velocityFactor.get() * (delta / 1000);
    x.current = wrap(-50, 0, x.current + moveBy / items.length);
    setRenderX(x.current);
  });

  const loop = [...items, ...items, ...items, ...items];

  const bg = tone === "dark" ? "bg-forest-800 text-cream-50" : "bg-cream-100 text-forest-950";
  const sep = tone === "dark" ? "text-sage-300" : "text-forest-600";

  return (
    <div className={`relative overflow-hidden border-y ${tone === "dark" ? "border-forest-700" : "border-ink-900/8"} ${bg} ${className}`}>
      <motion.div
        className="flex whitespace-nowrap py-6 md:py-8 will-change-transform"
        style={reduce ? undefined : { x: `${renderX}%` }}
      >
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center font-display text-3xl md:text-4xl lg:text-5xl"
          >
            <span className="italic px-6 md:px-10">{item}</span>
            <span className={`${sep} text-xl md:text-2xl`} aria-hidden>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
