"use client";

import { useEffect, useState } from "react";
import { Snowflake, Sparkles } from "lucide-react";

type Flake = {
  id: number;
  left: string;
  top: string;
  size: number;
  opacity: number;
  dur: number;
  delay: number;
};

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createFlakes(count = 9): Flake[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${rnd(4, 96).toFixed(2)}%`,
    top: `${rnd(12, 78).toFixed(2)}%`,
    size: rnd(10, 16),
    opacity: rnd(0.18, 0.5),
    dur: rnd(4.5, 9.5),
    delay: rnd(0, 3.5),
  }));
}

export default function YearAmbientTopba() {
  const [flakes, setFlakes] = useState<Flake[]>([]);
  const [cometKey, setCometKey] = useState(0);

  // flakes – tylko po mount (SSR-safe)
  useEffect(() => {
    setFlakes(createFlakes(9));
  }, []);

  // losowa kometa
  useEffect(() => {
    let alive = true;

    const loop = () => {
      const t = Math.floor(rnd(3500, 9000));
      setTimeout(() => {
        if (!alive) return;
        setCometKey((k) => k + 1);
        loop();
      }, t);
    };

    loop();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="relative z-40 w-full overflow-hidden border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-1 h-28 w-28 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-24 w-24 -translate-x-1/2 rounded-full bg-indigo-400/10 blur-3xl" />
        <div className="absolute -right-10 top-2 h-28 w-28 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      {/* snowflakes */}
      <div className="pointer-events-none absolute inset-0">
        {flakes.map((f) => (
          <div
            key={f.id}
            className="absolute year-floaty"
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
            <Snowflake
              className="text-white/70"
              style={{ width: f.size, height: f.size }}
            />
          </div>
        ))}
      </div>

      {/* comet */}
      <div key={cometKey} className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/3 top-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent blur-[0.5px] year-comet" />
        <div className="absolute -left-1/3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-xl year-comet" />
      </div>

      {/* center */}
      <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-3 px-3 py-2">
        <Sparkles className="h-4 w-4 text-fuchsia-300/80" />

        <span className="relative year-glitch text-sm sm:text-base font-semibold tracking-[0.42em] text-white/90 drop-shadow">
          <span className="absolute inset-0 -z-10 rounded-md bg-white/5 blur-[0.5px]" />
          2026
        </span>

        <Sparkles className="h-4 w-4 text-cyan-300/80" />
      </div>
    </div>
  );
}
