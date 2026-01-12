"use client";

import React from "react";

export default function ScrollArrows({
  targetId,
  step = 160,
}: {
  targetId: string;
  step?: number;
}) {
  const scrollBy = (delta: number) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollBy({ top: delta, behavior: "smooth" });
  };

  return (
    <div
      className={[
        "absolute right-2 top-1/2 -translate-y-1/2",
        "flex flex-col gap-2",
        "opacity-0 group-open:opacity-100",
        "transition-opacity",
        "pointer-events-none group-open:pointer-events-auto",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={() => scrollBy(-step)}
        className={[
          "h-9 w-9 rounded-xl",
          "border border-slate-200",
          "bg-white/90 backdrop-blur",
          "shadow-sm",
          "text-sky-800",
          "hover:bg-sky-50 hover:border-sky-800/25",
          "transition-colors",
          "pointer-events-auto",
        ].join(" ")}
        aria-label="Przewiń w górę"
        title="Przewiń w górę"
      >
        ▲
      </button>

      <button
        type="button"
        onClick={() => scrollBy(step)}
        className={[
          "h-9 w-9 rounded-xl",
          "border border-slate-200",
          "bg-white/90 backdrop-blur",
          "shadow-sm",
          "text-sky-800",
          "hover:bg-sky-50 hover:border-sky-800/25",
          "transition-colors",
          "pointer-events-auto",
        ].join(" ")}
        aria-label="Przewiń w dół"
        title="Przewiń w dół"
      >
        ▼
      </button>
    </div>
  );
}
