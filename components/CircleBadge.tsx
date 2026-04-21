"use client";

import { Leaf } from "lucide-react";

type Props = {
  text?: string;
  className?: string;
};

export function CircleBadge({
  text = "CHRISTIAN · LIFE · COACHING · ROOTED · AND · RISING · ",
  className = "",
}: Props) {
  const id = "circle-text-path";

  return (
    <div className={`relative ${className}`}>
      <div className="animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <path
              id={id}
              d="M 100, 100 m -82, 0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
              fill="none"
            />
          </defs>
          <text className="fill-cream-50 text-[13px] tracking-[0.18em]" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
            <textPath href={`#${id}`} startOffset="0">
              {text.repeat(2)}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Leaf
          className="text-sage-300"
          size={28}
          strokeWidth={1.25}
        />
      </div>
    </div>
  );
}
