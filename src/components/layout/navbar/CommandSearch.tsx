"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, Squircle } from "lucide-react";

import {
  Sheet,
  SheetBackButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet2";

import { Skeleton } from "@/components/ui/skeleton";
import NProgressHandler from "@/components/nprogress/NProgressHandler";

import { getXt } from "../../../../services/api/xt";
import { Product } from "../../../../types/product";
import { Category } from "../../../../types/category";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [query, setQuery] = useState("");

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [categoryResults, setCategoryResults] = useState<Category[]>([]);
  const [parentCategoryResults, setParentCategoryResults] = useState<Category[]>([]);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  const resetResults = () => {
    setResults([]);
    setCategoryResults([]);
    setParentCategoryResults([]);
    setLoading(false);
  };

  const closeSheet = () => {
    setIsOpen(false);
    resetResults();
    setQuery("");
  };

  const handleLink = (url: string) => {
    closeSheet();
    router.push(url);
  };

  const addToHistory = (value: string) => {
    const v = value.trim();
    if (v.length < 3) return;

    setSearchHistory((prev) => {
      const next = prev.filter((x) => x !== v);
      return [...next, v].slice(-12);
    });
  };

  const fetchResults = async (q: string) => {
    try {
      setLoading(true);

      const [productRes, categoryRes, parentCategoryRes] = await Promise.all([
        getXt(`/tw/search?q=${q}`),
        getXt(`/xt/index?xt-podkatalog=0&xt-kod=?${q}?`),
        getXt(`/xt/index?Xt-root=2200&Xt-super=!=2200&Xt-podkatalog=!=0&Xt-id=!=2200&xt-kod=?${q}?`),
      ]);

      const productData: Product[] = (productRes as any).json
        ? await (productRes as any).json()
        : (productRes as Product[]);

      const categoryData: Category[] = (categoryRes as any).json
        ? await (categoryRes as any).json()
        : (categoryRes as Category[]);

      const parentCategoryData: Category[] = (parentCategoryRes as any).json
        ? await (parentCategoryRes as any).json()
        : (parentCategoryRes as Category[]);

      setResults(productData);
      setCategoryResults(categoryData);
      setParentCategoryResults(parentCategoryData);
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      resetResults();
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery.length > 2) {
      resetResults();
      fetchResults(newQuery);
    } else {
      resetResults();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.trim().length > 2) {
      addToHistory(query);
      handleLink(`/szukaj?q=${encodeURIComponent(query.trim())}`);
    }
    if (event.key === "Escape") {
      closeSheet();
    }
  };

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const vv = window.visualViewport;
    if (!vv) {
      setKeyboardInset(0);
      return;
    }

    const update = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - (vv.offsetTop || 0));
      setKeyboardInset(inset);
    };

    update();

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, [isOpen]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-border">
      <div className="px-4 pt-4 pb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </div>
      <div className="pb-3">{children}</div>
    </div>
  );

  const RowButton = ({
    onClick,
    children,
  }: {
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors hover:bg-muted/60"
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="
          cursor-pointer w-full h-10 rounded-3xl relative text-left text-sm
          border border-input bg-accent px-10
          text-muted-foreground
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
        "
      >
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        Szukaj
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="top"
          className="p-0 rounded-none h-[65vh] max-h-[65vh] overflow-hidden bg-background text-foreground"
        >
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto overscroll-contain bg-background"
            style={{
              paddingBottom: `${Math.max(16, keyboardInset + 16)}px`,
              scrollPaddingBottom: `${Math.max(16, keyboardInset + 16)}px`,
              WebkitOverflowScrolling: "touch",
            }}
          >
            <SheetHeader className="flex-row items-center gap-2 px-4 pt-4 pb-3 border-b border-border bg-background">
              <SheetTitle className="sr-only">Szukaj</SheetTitle>

              <SheetBackButton />

              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  className="
                    h-10 rounded-3xl pl-10 pr-3 text-sm
                     border-input
                    focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2
                  "
                  placeholder="Szukaj produktów..."
                  onChange={handleSearchChange}
                  value={query}
                  onKeyDown={handleKeyDown}
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </SheetHeader>

            {query.trim().length > 2 && (
              <div className="border-b border-border bg-background flex justify-center py-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    addToHistory(query);
                    handleLink(`/szukaj?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="cursor-pointer gap-2"
                  type="button"
                >
                  <span>Przejdź do wyników</span>
                  <ChevronRight />
                </Button>
              </div>
            )}

            <div className="bg-background">
              {(parentCategoryResults.length > 0 || categoryResults.length > 0) && (
                <Section title="Kategorie">
                  <div className="flex flex-col">
                    {parentCategoryResults.map((category) => (
                      <RowButton
                        key={`parent-${category.id}`}
                        onClick={() => handleLink(`/parentcategories/view/${category.id}/test`)}
                      >
                        <span className="text-sm font-medium text-foreground">
                          {category.kod}
                        </span>
                      </RowButton>
                    ))}

                    {categoryResults.map((category) => (
                      <RowButton
                        key={`cat-${category.id}`}
                        onClick={() => handleLink(`/categories/view/${category.id}/test`)}
                      >
                        <span className="text-sm font-medium text-foreground">
                          {category.kod}
                        </span>
                      </RowButton>
                    ))}
                  </div>
                </Section>
              )}

              <Section title="Wyniki">
                {loading ? (
                  <div className="px-4 pb-2">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-12 mb-2 rounded-none bg-muted" />
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col">
                    {results.map((result) => (
                      <RowButton
                        key={result.id}
                        onClick={() => handleLink(`/products/view/${result.id}/slug`)}
                      >
                        {/* miniatura */}
                        <Image
                          src={
                            result.productphoto?.length > 0
                              ? (() => {
                                  const main = result.productphoto.find(
                                    (p: any) => p.main_photo === 1
                                  );
                                  return main?.photo_512
                                    ? `https://www.imgstatic.ebartex.pl/${main.photo_512}`
                                    : "/product_512.png";
                                })()
                              : "/product_512.png"
                          }
                          width={40}
                          height={40}
                          alt="Zdjęcie produktu"
                        />

                        {/* nazwa + badge */}
                        <div className="min-w-0 flex-1 flex items-center gap-2">
                          <span className="text-sm truncate text-foreground">
                            {result.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name ||
                              result.nazwa}
                          </span>

                          {(result as any).is_cheapest && (
                            <Badge className="h-5 rounded-full px-2" variant="secondary">
                              Najtańszy
                            </Badge>
                          )}
                        </div>

                        {/* stan */}
                        <div className="ml-auto">
                          {result.sm?.length ? (
                            result.sm.map((item: any, idx: number) => {
                              const stan = Number(item.stanHandl) || 0;

                              // shadcn-friendly: primary = jest, destructive = brak
                              const cls = stan === 0 ? "text-destructive" : "text-primary";

                              return (
                                <div key={idx} className="flex items-center">
                                  <Squircle className={`${cls} fill-current`} />
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center">
                              <Squircle className="text-destructive fill-current" />
                            </div>
                          )}
                        </div>
                      </RowButton>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 pb-2 text-sm text-muted-foreground">
                    Brak wyników — wpisz nazwę produktu.
                  </div>
                )}
              </Section>

              {searchHistory.length > 0 && (
                <Section title="Historia wyszukiwania">
                  <div className="px-4 flex flex-wrap gap-2">
                    {[...searchHistory].reverse().map((historyQuery, index) => (
                      <button
                        key={`${historyQuery}-${index}`}
                        onClick={() => handleLink(`/szukaj?q=${encodeURIComponent(historyQuery)}`)}
                        className="
                          cursor-pointer rounded-full px-4 py-1 text-sm transition-colors
                          bg-background border border-border text-foreground
                          hover:bg-muted/60
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        "
                        type="button"
                      >
                        {historyQuery}
                      </button>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <NProgressHandler />
    </>
  );
}
