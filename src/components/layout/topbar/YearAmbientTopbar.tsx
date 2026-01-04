"use client";

import { useEffect, useMemo, useState } from "react";
import { Snowflake, Sparkles } from "lucide-react";

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function YearAmbientTopbar() {
  // mały „surprise”: kometa pojawia się losowo co kilka sekund
  const [cometKey, setCometKey] = useState(0);

  useEffect(() => {
    let alive = true;

    const schedule = () => {
      const t = Math.floor(rnd(3500, 9000)); // losowo
      setTimeout(() => {
        if (!alive) return;
        setCometKey((k) => k + 1); // restart animacji
        schedule();
      }, t);
    };

    schedule();
    return () => {
      alive = false;
    };
  }, []);

  // śnieżki jako „ambient particles”
  const flakes = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        left: `${rnd(4, 96).toFixed(2)}%`,
        top: `${rnd(12, 78).toFixed(2)}%`,
        size: rnd(10, 16),
        opacity: rnd(0.18, 0.5),
        dur: rnd(4.5, 9.5),
        delay: rnd(0, 3.5),
      })),
    []
  );

  return (
    <div className="relative z-40 w-full border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-1 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 h-24 w-24 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -right-10 top-2 h-28 w-28 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      {/* snow particles */}
      <div className="pointer-events-none absolute inset-0">
        {flakes.map((f) => (
          <div
            key={f.id}
            className="absolute animate-[floaty_var(--d)_ease-in-out_infinite]"
            style={
              {
                left: f.left,
                top: f.top,
                opacity: f.opacity,
                ["--d" as any]: `${f.dur}s`,
                animationDelay: `${f.delay}s`,
              } as React.CSSProperties
            }
          >
            <Snowflake style={{ width: f.size, height: f.size }} className="text-white/70" />
          </div>
        ))}
      </div>

      {/* surprise comet */}
      <div key={cometKey} className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/3 top-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent blur-[0.5px] animate-[comet_1.2s_ease-out_1]" />
        <div className="absolute -left-1/3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-xl animate-[comet_1.2s_ease-out_1]" />
      </div>

      {/* center */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-3 py-2">
        <Sparkles className="h-4 w-4 text-fuchsia-300/80" />

        <span className="relative text-sm sm:text-base font-semibold tracking-[0.42em] text-white/90 drop-shadow">
          {/* lekkie „szkło” za 2026 */}
          <span className="absolute inset-0 -z-10 rounded-md bg-white/5 blur-[0.5px]" />
          2026
        </span>

        <Sparkles className="h-4 w-4 text-cyan-300/80" />
      </div>

      {/* local keyframes */}
      <style jsx>{`
        @keyframes floaty {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
          50% {
            transform: translate3d(0, -6px, 0) rotate(8deg);
          }
          100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
          }
        }
        @keyframes comet {
          0% {
            transform: translate3d(0, -50%, 0) skewX(-18deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(210%, -50%, 0) skewX(-18deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
