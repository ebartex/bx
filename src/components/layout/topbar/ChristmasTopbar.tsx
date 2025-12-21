"use client";

import { useEffect, useState } from "react";
import { Trees, Snowflake, X } from "lucide-react";

const STORAGE_KEY = "christmas_topbar_closed_2025";

export default function ChristmasTopbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const closed = localStorage.getItem(STORAGE_KEY) === "1";
      setVisible(!closed);
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
      {/* subtle snow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-10 top-2 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute left-1/3 top-0 h-20 w-20 rounded-full bg-sky-300/10 blur-2xl" />
        <div className="absolute right-10 top-3 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-center px-3 py-2 text-center text-xs sm:text-sm">
        {/* content */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-white/90">
          <Trees className="h-4 w-4 text-green-300 drop-shadow" />

          <span className="font-semibold text-white/95">
            Wesołych Świąt Bożego Narodzenia
          </span>

          <Snowflake className="h-4 w-4 text-white/80" />

          <span className="text-white/80">
            życzymy spokojnych, rodzinnych chwil oraz pomyślności w Nowym Roku
          </span>

          <Trees className="h-4 w-4 text-green-300 drop-shadow" />
        </div>

        {/* close button */}
        <button
          onClick={close}
          aria-label="Zamknij pasek"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-1.5 text-white/80 ring-1 ring-white/15 transition hover:bg-white/20 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
