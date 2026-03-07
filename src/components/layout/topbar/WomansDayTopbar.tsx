"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Flower2 } from "lucide-react";

type Bubble = {
  id: number;
  left: string;
  top: string;
  size: number;
  opacity: number;
  dur: number;
  delay: number;
  rot: number;
};

const words = [
  "Kobieta",
  "Woman",
  "Femme",
  "Frau",
  "Mujer",
  "Donna",
  "Žena",
  "Жінка",
];

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createBubbles(count = 16): Bubble[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${rnd(2, 98).toFixed(2)}%`,
    top: `${rnd(12, 88).toFixed(2)}%`,
    size: rnd(6, 12),
    opacity: rnd(0.14, 0.3),
    dur: rnd(5.5, 11),
    delay: rnd(0, 3.5),
    rot: rnd(-18, 18),
  }));
}

export default function WomensDayTopbar() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setBubbles(createBubbles(16));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const styles = useMemo(
    () => (
      <style>{`
        @keyframes womensday-float {
          0% { transform: translateY(0) rotate(var(--r)) scale(1); }
          50% { transform: translateY(-10px) rotate(calc(var(--r) + 4deg)) scale(1.04); }
          100% { transform: translateY(0) rotate(var(--r)) scale(1); }
        }

        .womensday-floaty {
          animation: womensday-float var(--d) ease-in-out infinite;
          will-change: transform;
        }

        @keyframes womensday-word {
          0% { opacity: 0; transform: translateY(6px); }
          12% { opacity: 1; transform: translateY(0); }
          82% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }

        .womensday-word {
          animation: womensday-word 2.2s ease-in-out;
        }
      `}</style>
    ),
    []
  );

  return (
    <div className="relative z-40 w-full overflow-hidden border-b border-black/10 dark:border-white/10">
      {styles}

      <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-rose-50 to-fuchsia-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-pink-400/20 blur-3xl dark:bg-pink-500/10" />
        <div className="absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full bg-rose-400/20 blur-3xl dark:bg-rose-500/10" />
        <div className="absolute -right-10 top-2 h-32 w-32 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/10" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {bubbles.map((b) => (
          <span
            key={b.id}
            className="absolute womensday-floaty rounded-full"
            style={
              {
                left: b.left,
                top: b.top,
                width: b.size,
                height: b.size,
                opacity: b.opacity,
                ["--d" as any]: `${b.dur}s`,
                ["--r" as any]: `${b.rot}deg`,
                animationDelay: `${b.delay}s`,
                background:
                  b.id % 3 === 0
                    ? "rgba(244,114,182,0.42)"
                    : b.id % 3 === 1
                    ? "rgba(251,113,133,0.32)"
                    : "rgba(232,121,249,0.28)",
                boxShadow: "0 0 10px rgba(255,255,255,0.16) inset",
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-3 py-2 sm:px-4">
        <Flower2 className="h-4 w-4 shrink-0 text-pink-600 dark:text-pink-300 sm:h-5 sm:w-5" />

        <span className="shrink-0 text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
          Dzień Kobiet
        </span>

        <span className="text-zinc-400 dark:text-zinc-500">•</span>

        <span
          key={index}
          className="womensday-word min-w-[84px] text-left text-sm font-semibold text-pink-700 dark:text-pink-300 sm:min-w-[96px] sm:text-base"
        >
          {words[index]}
        </span>
      </div>
    </div>
  );
}