'use client';

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

  // Scroll wrapper wewnątrz Sheet (żeby sterować paddingiem pod klawiaturę)
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Wysokość klawiatury (w px) wyliczona z VisualViewport
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
    setTimeout(() => router.push(url), 150);
  };

  const handleAddToHistory = (newQuery: string) => {
    if (!searchHistory.includes(newQuery)) {
      setSearchHistory((prev) => [...prev, newQuery]);
    }
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

  const handleInputBlur = () => {
    if (query.length > 2) handleAddToHistory(query);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query.length > 2) {
      inputRef.current?.blur();
      handleLink(`/szukaj?q=${encodeURIComponent(query)}`);
    }
    if (event.key === "Escape") {
      closeSheet();
    }
  };

  // Autofocus input po otwarciu
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  // Wykrywanie klawiatury (mobile) przez VisualViewport
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // różnica między layout viewportem a real viewportem (z klawiaturą)
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
  }, []);

  // Doscrolluj tak, żeby dół (CTA) był osiągalny przy klawiaturze
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-slate-100">
      <div className="px-4 pt-4 pb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
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
      className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Trigger w headerze/na stronie */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full h-10 bg-slate-100 text-left text-slate-500 px-10 rounded-none relative"
      >
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        Szukaj produkty...
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="top"
          className="
            p-0
            rounded-none
            h-[65vh]
            max-h-[65vh]
            overflow-hidden
          "
        >
          {/* Jeden przewijalny kontener na całą zawartość (włącznie z inputem i CTA) */}
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto bg-white overscroll-contain"
            style={{
              // miejsce "pod klawiaturę" – dzięki temu da się doscrollować do CTA
              paddingBottom: `${Math.max(16, keyboardInset + 16)}px`,
            }}
          >
            <SheetHeader className="flex-row items-center gap-2 px-4 pt-4 pb-3 border-b bg-white">
              <SheetTitle className="sr-only">Szukaj</SheetTitle>

              <SheetBackButton />

              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  className="
                    border border-slate-200
                    bg-white
                    focus:ring-0 focus:outline-none
                    pl-10 pr-3
                    block w-full h-10
                    rounded-none text-sm
                  "
                  placeholder="Szukaj produktów..."
                  onChange={handleSearchChange}
                  onBlur={handleInputBlur}
                  onFocus={scrollToBottom}
                  value={query}
                  onKeyDown={handleKeyDown}
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </SheetHeader>

            {/* Content */}
            <div className="bg-white">
              {/* Kategorie */}
              {(parentCategoryResults.length > 0 || categoryResults.length > 0) && (
                <Section title="Kategorie">
                  <div className="flex flex-col">
                    {parentCategoryResults.map((category) => (
                      <RowButton
                        key={`parent-${category.id}`}
                        onClick={() => handleLink(`/parentcategories/view/${category.id}/test`)}
                      >
                        <span className="text-sm font-medium">{category.kod}</span>
                      </RowButton>
                    ))}

                    {categoryResults.map((category) => (
                      <RowButton
                        key={`cat-${category.id}`}
                        onClick={() => handleLink(`/categories/view/${category.id}/test`)}
                      >
                        <span className="text-sm font-medium">{category.kod}</span>
                      </RowButton>
                    ))}
                  </div>
                </Section>
              )}

              {/* Wyniki */}
              <Section title="Wyniki">
                {loading ? (
                  <div className="px-4 pb-2">
                    {[...Array(5)].map((_, index) => (
                      <Skeleton key={index} className="h-12 mb-2 bg-slate-100 rounded-none" />
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  <div className="flex flex-col">
                    {results.map((result) => (
                      <RowButton
                        key={result.id}
                        onClick={() => handleLink(`/products/view/${result.id}/slug`)}
                      >
                        <Image
                          src={
                            result.productphoto?.length > 0
                              ? (() => {
                                  const main = result.productphoto.find((p: any) => p.main_photo === 1);
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

                        <span className="text-sm truncate">
                          {result.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name ||
                            result.nazwa}
                        </span>

                        <div className="ml-auto">
                          {result.sm?.length ? (
                            result.sm.map((item: any, idx: number) => {
                              const stan = Number(item.stanHandl) || 0;
                              const colorClass = stan === 0 ? "text-red-700" : "text-green-700";
                              return (
                                <div key={idx} className="flex items-center">
                                  <Squircle className={`${colorClass} fill-current`} />
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center">
                              <Squircle className="text-red-700 fill-current" />
                            </div>
                          )}
                        </div>
                      </RowButton>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 pb-2 text-sm text-gray-500">
                    Brak wyników — wpisz nazwę produktu..
                  </div>
                )}
              </Section>

              {/* Historia */}
              {searchHistory.length > 0 && (
                <Section title="Historia wyszukiwania">
                  <div className="px-4 flex flex-wrap gap-2">
                    {searchHistory.map((historyQuery, index) => (
                      <button
                        key={index}
                        onClick={() => handleLink(`/szukaj?q=${encodeURIComponent(historyQuery)}`)}
                        className="cursor-pointer bg-white border text-slate-700 rounded-full px-4 py-1 text-sm hover:bg-slate-100"
                        type="button"
                      >
                        {historyQuery}
                      </button>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* CTA – na samym końcu przewijania */}
            {query.length > 2 && (
              <div className="border-t bg-white">
                <button
                  onClick={() => handleLink(`/szukaj?q=${encodeURIComponent(query)}`)}
                  className="w-full text-slate-700 pl-4 pt-3 pb-3 pr-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                  type="button"
                >
                  <span>Przejdź do wyników</span>
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <NProgressHandler />
    </>
  );
}
