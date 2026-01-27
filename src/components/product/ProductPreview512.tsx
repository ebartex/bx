"use client";

import Image from "next/image";

type Props = {
  src: string | null;
  title?: string;
  visible: boolean;
};

export default function ProductPreview512({ src, title, visible }: Props) {
  if (!src || !visible) return null;

  return (
    <div
      className="
        fixed bottom-4 right-4 z-50
        hidden xl:block
        bg-popover
        border border-border
        shadow-2xl
        rounded-xl
        p-3
      "
    >
      <Image
        src={src}
        alt={title || "Podgląd produktu"}
        width={256}
        height={256}
        className="object-contain rounded-lg"
      />
    </div>
  );
}
