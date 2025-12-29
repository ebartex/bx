"use client";

import { Sparkles, Snowflake } from "lucide-react";

export default function NewYearTopbar() {
  return (
    <div className="relative z-40 w-full border-b bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-2 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute left-1/3 top-0 h-20 w-20 rounded-full bg-sky-300/10 blur-2xl" />
        <div className="absolute right-10 top-3 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-2 text-center text-xs sm:text-sm text-white/90">
        <Sparkles className="h-4 w-4 text-emerald-300 drop-shadow" />

        <span className="font-semibold text-white">
          Szczęśliwego Nowego Roku 2026!
        </span>

        <Snowflake className="h-4 w-4 text-white/80" />

        <span className="text-white/80">
          Zdrowia, spokoju i realizacji wszystkich planów w nadchodzącym roku ✨
        </span>

        <Sparkles className="h-4 w-4 text-emerald-300 drop-shadow" />
      </div>
    </div>
  );
}
