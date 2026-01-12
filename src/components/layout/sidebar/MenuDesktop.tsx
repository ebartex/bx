"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "../../../../types/category";
import { getXt } from "../../../../services/api/xt";

export default function MenuDesktop({
  onHoverCategory,
}: {
  onHoverCategory: (cat: Category) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = (await getXt("/xt/index?Xt-super=2200&Xt-root=2200")) as Category[];
        setCategories(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <aside className="w-full">
      {/* HEADER */}
      <div className="bg-background">
        <div className="px-4 py-4">
          <div className=" text-sm font-medium">
            Kategorie
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div>
{loading ? (
  <ul className="bg-background">
    {Array.from({ length: 8 }).map((_, i) => (
      <li key={i}>
        <div className="h-10 px-4 flex items-center">
          <Skeleton className="h-4 w-2/3 rounded-sm" />
        </div>
      </li>
    ))}
  </ul>
) : (
  <ul className="bg-background">
    {categories.map((cat) => (
      <li key={cat.id}>
        <button
          type="button"
          onMouseEnter={() => onHoverCategory(cat)}
          onFocus={() => onHoverCategory(cat)}
          className="
            group
            w-full h-10 px-4
            flex items-center
            text-left
            cursor-pointer
          "
        >
          <span
            className="
              block truncate
              text-[13px] font-normal
              text-muted-foreground
              group-hover:text-foreground
            "
          >
            {cat.kod}
          </span>
        </button>
      </li>
    ))}
  </ul>
)}



      </div>
    </aside>
  );
}
