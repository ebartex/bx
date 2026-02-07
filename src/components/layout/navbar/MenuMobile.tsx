"use client";

import { useState, useEffect } from "react";
import { Menu, SquareRoundCorner } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { getXt } from "../../../../services/api/xt";

type Category = {
  id: string;
  kod: string;
};

type SubCategory = {
  kod: string;
  id: string;
};

export default function MenuMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, SubCategory[]>>({});
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getXt("xt/index?Xt-super=2200&Xt-root=2200");
        setCategories(data as Category[]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    if (subcategories[categoryId]) return;

    setLoadingCategory(categoryId);

    const fetchSubcategories = async () => {
      try {
        const data = await getXt(`xt/subcat?Xt-super=${categoryId}`);
        setSubcategories((prev) => ({
          ...prev,
          [categoryId]: data as SubCategory[],
        }));
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setTimeout(() => setLoadingCategory(null), 500);
      }
    };

    fetchSubcategories();
  };

  const handleSubCategoryClick = (subCategoryId: string) => {
    setIsMenuOpen(false);
    router.push(`/parentcategories/view/${subCategoryId}/test`);
  };

  return (
    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <SheetTrigger asChild>
<button
  type="button"
  aria-label="Otwórz menu kategorii"
  onClick={() => setIsMenuOpen((v) => !v)}
  className={`
    lg:hidden
    ml-2
    inline-flex items-center justify-center
    h-10 w-10
    rounded-lg
    transition-all
    hover:bg-muted/50
    active:bg-muted/70
    active:scale-95
    ${isMenuOpen ? "bg-muted/60" : ""}
  `}
>
  <Menu className="h-7 w-7" />
</button>

      </SheetTrigger>

      <SheetContent className="p-0 bg-background text-foreground">
        <SheetHeader className="p-0 border-b border-border">
          <SheetTitle className="pt-4 pl-2 text-base font-semibold">
            Kategorie
          </SheetTitle>
        </SheetHeader>

        <div className="p-0 overflow-auto">
          <Accordion type="single" collapsible>
            {categories.map((category) => (
              <AccordionItem
                key={category.id}
                value={category.id}
                className="border-b border-border"
              >
                <AccordionTrigger
                  className="pr-4 pt-2 flex justify-between items-center font-normal"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="relative mb-5">
                    <SquareRoundCorner className="absolute left-1 text-muted-foreground" />
                  </div>
                  <span className="flex-grow pl-5 text-foreground">
                    {category.kod}
                  </span>
                </AccordionTrigger>

                <AccordionContent>
                  {loadingCategory === category.id ? (
                    <div className="px-4 pb-2">
                      <Skeleton className="w-full h-6 mb-2" />
                      <Skeleton className="w-full h-6 mb-2" />
                      <Skeleton className="w-full h-6 mb-2" />
                    </div>
                  ) : (
                    <ScrollArea className="h-72">
                      {subcategories[category.id]?.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          type="button"
                          onClick={() => handleSubCategoryClick(subcategory.id)}
                          className="
                            w-full text-left pl-6 pr-4 py-2
                            cursor-pointer transition-colors
                            hover:bg-muted/60
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                          "
                        >
                          <p className="text-sm text-foreground">{subcategory.kod}</p>
                        </button>
                      ))}
                    </ScrollArea>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
