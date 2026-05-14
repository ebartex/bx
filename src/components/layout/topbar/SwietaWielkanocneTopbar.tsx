"use client";

import { Egg } from "lucide-react";

export default function EasterTopbarMobile() {
  return (
    <div className="w-full border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-green-100 via-yellow-50 to-pink-100 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-2 py-2 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        <Egg className="h-4 w-4 text-yellow-600 shrink-0" />
        <span className="truncate">
          Wesołych Świąt 🐣
        </span>
      </div>
    </div>
  );
}