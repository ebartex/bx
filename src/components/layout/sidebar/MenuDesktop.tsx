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
          <div className="px-4 py-2 space-y-2">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-none" />
            ))}
          </div>
        ) : (
          <ul className="bg-background">
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onMouseEnter={() => onHoverCategory(cat)}
                  onFocus={() => onHoverCategory(cat)}
                  className="
                  
                    group relative
                    w-full
                    h-10
                    px-4
                    text-left

                  
 
                  "
                >
                  {/* LEWY AKCENT */}
                  <span
                    aria-hidden
                    className="
                absolute left-0 top-0
                      h-full w-[3px]
               
          
                    "
                  />

                  {/* LABEL */}
                  <span className="
                  text-muted-foreground 
                  hover:text-foreground 
                  cursor-pointer block truncate text-[13px] font-normal ">
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
