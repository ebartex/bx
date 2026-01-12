"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import MenuDesktop from "@/components/layout/sidebar/MenuDesktop";
import { slugify } from "@/utils/slugify";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { Category } from "../../types/category";
import { getXt } from "../../services/api/xt";

export default function HomeClient() {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);

  const [subcategories, setSubcategories] = useState<Record<string, Category[]>>(
    {}
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // ✅ nowy stan: czy overlay właśnie się zamyka (fade-out)
  const [isClosing, setIsClosing] = useState(false);

  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const closeOverlayWithFade = (delay = 140) => {
    setIsClosing(true);
    window.setTimeout(() => {
      setOverlayOpen(false);
      setActiveCategory(null);
      setIsClosing(false);
    }, delay);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      // ✅ zamiast natychmiast: fade-out
      closeOverlayWithFade(140);
    }, 150);
  };

  const ensureSubcategories = async (cat: Category) => {
    if (subcategories[cat.id]) return;

    setLoadingId(cat.id);
    try {
      const data = (await getXt(`/xt/subcat?Xt-super=${cat.id}`)) as Category[];
      setSubcategories((prev) => ({ ...prev, [cat.id]: data }));
    } catch (e) {
      console.error(e);
      setSubcategories((prev) => ({ ...prev, [cat.id]: [] }));
    } finally {
      setLoadingId(null);
    }
  };

  const handleHoverCategory = async (cat: Category) => {
    cancelClose();
    setIsClosing(false); // ✅ jak wchodzę ponownie, przerywam zamykanie
    setActiveCategory(cat);
    setOverlayOpen(true);
    await ensureSubcategories(cat);
  };

  const goToSubcat = (subId: string, kod: string) => {
    // ✅ 1) start fade-out
    setIsClosing(true);

    const href = `/parentcategories/view/${subId}/${slugify(kod)}`;

    // ✅ 2) po krótkiej animacji nawigacja
    window.setTimeout(() => {
      router.push(href);
    }, 140);
  };

  const activeSubs = activeCategory ? subcategories[activeCategory.id] || [] : [];

  return (
    <div className="flex h-screen">
      {/* LEFT 1/5 */}
      <div
        className="hidden lg:block w-1/6 border-r"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <MenuDesktop onHoverCategory={handleHoverCategory} />
      </div>

      {/* RIGHT flex-1 */}
      <div
        className="relative flex-1"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {/* IMAGE (always) */}
        <div className="relative w-full h-full">
          <Image
            alt="Zdjęcie"
            src="/pl_11736_20230905_114759.jpg"
            width={1146}
            height={430}
            className="object-contain object-left-top w-full h-full"
          />
        </div>

        {/* OVERLAY */}
        {overlayOpen && activeCategory && (
          <div
            className={[
              "absolute inset-0 z-20 bg-background",
              "transition-opacity duration-150 ease-out",
              isClosing ? "opacity-0" : "opacity-100",
            ].join(" ")}
          >
            {/* header */}
            <div className="border-b">
              <div className="px-4 py-4">
                <div className="text-sm font-medium">{activeCategory.kod}</div>
              </div>
            </div>

            {/* content */}
            <ScrollArea className="h-[calc(100vh-56px)]">
              <div className="p-4">
                {loadingId === activeCategory.id &&
                !subcategories[activeCategory.id] ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(18)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-none" />
                    ))}
                  </div>
                ) : activeSubs.length ? (
                  <ul className="grid grid-cols-3 gap-2">
                    {activeSubs.map((sub) => (
                      <li key={sub.id}>
                        <button
                          type="button"
                          onClick={() => goToSubcat(sub.id, sub.kod)}
                          className="
                            w-full
                            h-10
                            px-4
                            text-left
                            cursor-pointer
                            rounded-none
                            text-muted-foreground
                            hover:bg-accent
                            hover:text-accent-foreground
                            transition-colors
                          "
                        >
                          <span className="truncate text-[13px]">
                            {sub.kod}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm">Brak podkategorii.</div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
