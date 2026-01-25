"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ExternalLink, Sparkles } from "lucide-react";

type Confetti = {
  id: number;
  left: string;
  top: string;
  size: number;
  opacity: number;
  dur: number;
  delay: number;
  rot: number;
};

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createConfetti(count = 18): Confetti[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${rnd(2, 98).toFixed(2)}%`,
    top: `${rnd(10, 90).toFixed(2)}%`,
    size: rnd(6, 12),
    opacity: rnd(0.18, 0.55),
    dur: rnd(5.5, 11),
    delay: rnd(0, 3.5),
    rot: rnd(-25, 25),
  }));
}

export default function WospTopbar() {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    setConfetti(createConfetti(18));
  }, []);

  // subtelne “pulse” akcentu co kilka sekund
  useEffect(() => {
    let alive = true;

    const loop = () => {
      const t = Math.floor(rnd(4200, 8800));
      setTimeout(() => {
        if (!alive) return;
        setPulseKey((k) => k + 1);
        loop();
      }, t);
    };

    loop();
    return () => {
      alive = false;
    };
  }, []);

  // inline CSS dla animacji (żeby nie dłubać w globals.css)
  const styles = useMemo(
    () => (
      <style>{`
        @keyframes wosp-float {
          0% { transform: translateY(0) rotate(var(--r)); }
          50% { transform: translateY(-10px) rotate(calc(var(--r) + 4deg)); }
          100% { transform: translateY(0) rotate(var(--r)); }
        }
        .wosp-floaty {
          animation: wosp-float var(--d) ease-in-out infinite;
          will-change: transform;
        }

        @keyframes wosp-sheen {
          0% { transform: translateX(-120%); opacity: 0; }
          15% { opacity: 1; }
          50% { transform: translateX(120%); opacity: 0.8; }
          100% { transform: translateX(120%); opacity: 0; }
        }
        .wosp-sheen::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transform: translateX(-120%);
          opacity: 0;
          animation: wosp-sheen 3.6s ease-in-out infinite;
        }

        @keyframes wosp-heartbeat {
          0% { transform: scale(1); }
          35% { transform: scale(1.08); }
          55% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        .wosp-heartbeat {
          animation: wosp-heartbeat 1.3s ease-in-out infinite;
        }
      `}</style>
    ),
    []
  );

  return (
    <div className="relative z-40 w-full overflow-hidden border-b border-black/10 dark:border-white/10">
      {styles}

      {/* TŁO: light/dark */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-white to-red-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />

      {/* glow + akcenty */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-yellow-400/20 blur-3xl dark:bg-yellow-400/10" />
        <div className="absolute left-1/2 top-0 h-28 w-28 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl dark:bg-red-500/10" />
        <div className="absolute -right-10 top-2 h-32 w-32 rounded-full bg-pink-500/20 blur-3xl dark:bg-pink-500/10" />
      </div>

      {/* confetti */}
      <div className="pointer-events-none absolute inset-0">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="absolute wosp-floaty rounded-sm"
            style={
              {
                left: c.left,
                top: c.top,
                width: c.size,
                height: c.size,
                opacity: c.opacity,
                ["--d" as any]: `${c.dur}s`,
                ["--r" as any]: `${c.rot}deg`,
                animationDelay: `${c.delay}s`,
                // proste “losowe” kolory bez narzucania palety Tailwinda
                background:
                  c.id % 3 === 0
                    ? "rgba(239,68,68,0.75)" // red-ish
                    : c.id % 3 === 1
                    ? "rgba(234,179,8,0.75)" // yellow-ish
                    : "rgba(236,72,153,0.65)", // pink-ish
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* pasek treści */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2 sm:px-4">
        {/* LEWA: logo + tytuł */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0">
            <Image
              src="/wosp-logo.svg" // <- wrzuć do /public (albo zmień na .png)
              alt="WOŚP"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-600 dark:text-red-400 wosp-heartbeat" />
              <span className="truncate text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Wielka Orkiestra Świątecznej Pomocy
              </span>
            </div>
            <div className="truncate text-[12px] sm:text-[13px] text-zinc-700 dark:text-zinc-300">
              Gramy razem — dorzuć cegiełkę i udostępnij ❤️
            </div>
          </div>
        </div>

        {/* PRAWA: CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="https://www.facebook.com/groups/753338646716322"
            className="
              relative overflow-hidden wosp-sheen
              inline-flex items-center gap-2
              rounded-full px-3 py-2 text-xs sm:text-sm font-semibold
              bg-red-600 text-white
              hover:bg-red-700 active:scale-[0.99]
              dark:bg-red-500 dark:hover:bg-red-600
              transition
            "
          >
            <Sparkles className="h-4 w-4" />
            Zobacz akcje WOŚP
            <ExternalLink className="h-4 w-4 opacity-90" />
          </Link>
        </div>
      </div>

      {/* subtelny “pulse” highlight */}
      <div key={pulseKey} className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/35 to-transparent" />
      </div>
    </div>
  );
}
