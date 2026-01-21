// PageClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { Category } from "../../../../../../types/category";
import { slugify } from "@/utils/slugify";

interface PageClientProps {
  subCategories: Category[];
}

export default function PageClient({ subCategories }: PageClientProps) {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const router = useRouter();

  const handleSubCategoryClick = (subCategoryId: string, slug: string) => {
    router.push(`/categories/view/${subCategoryId}/${slug}`);
  };

  return (
    <div className="flex-1 p-4 text-foreground">
      {error && (
        <div className="mb-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div
        className={[
          "mb-4",
          "border border-border",
          "bg-card text-card-foreground",
          "rounded-none",
          "overflow-auto",
          subCategories.length > 2 ? "max-h-[420px]" : "max-h-none",
        ].join(" ")}
      >
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground">Ładowanie…</div>
        ) : subCategories.length > 0 ? (
          <ul className="divide-y divide-border">
            {subCategories.map((subCategory) => (
              <li key={subCategory.id}>
                <button
                  type="button"
                  onClick={() =>
                    handleSubCategoryClick(subCategory.id, slugify(subCategory.kod))
                  }
                  className="
                    w-full
                    flex items-center justify-between
                    px-3 py-2
                    text-left
                    transition
                    hover:bg-accent
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                  "
                >
                  <span className="text-xs text-foreground">
                    {subCategory.kod}
                  </span>

                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-sm text-muted-foreground">
            Brak podkategorii
          </p>
        )}
      </div>
    </div>
  );
}
