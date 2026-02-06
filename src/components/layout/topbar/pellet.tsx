"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function PelletTopbar() {
  return (
    <div className="w-full border-b border-black/10 dark:border-white/10 bg-amber-50 dark:bg-zinc-900">
      <div
        className="
          mx-auto max-w-7xl
          px-3 py-2
          flex items-center gap-2
          text-[12px] sm:text-sm
          text-zinc-800 dark:text-zinc-200
        "
      >
        <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />

        <p className="leading-snug">
          Informujemy, że sprzedaż pelletu jest obecnie{" "}
          <strong>ograniczona</strong>. Przepraszamy za utrudnienia.
        </p>

        {/* opcjonalnie link – usuń jeśli nie chcesz */}

      </div>
    </div>
  );
}
