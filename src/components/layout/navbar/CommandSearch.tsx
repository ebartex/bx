"use client";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, Squircle } from "lucide-react";
import Image from 'next/image';
import NProgressHandler from "@/components/nprogress/NProgressHandler";


interface ProductPhoto {
  main_photo: number;
  photo_512: string;
}

interface SearchResult {
  productphoto: ProductPhoto[];
  title: string;
  id: string;
  nazwa: string;
  sm?: { stanHandl?: string }[]; // Add the 'sm' property with an optional array of objects
}
interface CategoryResult {
  id: string;
  kod: string;

}
export default function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false); // Kontroluje widoczność okna wyników
  const [backgroundVisible, setBackgroundVisible] = useState(false); // Kontroluje widoczność tła
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");  // Przechowujemy zapytanie użytkownika
  const [searchHistory, setSearchHistory] = useState<string[]>([]); // Historia wyszukiwania
  const [categoryResults, setCategoryResults] = useState<CategoryResult[]>([]);
  const commandRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const elementRef = useRef<HTMLInputElement | null>(null);
  const [distanceFromLeft, setDistanceFromLeft] = useState(0);

  const handleInputClick = () => {
    setIsOpen(true);
    setBackgroundVisible(true); // Upewniamy się, że tło jest widoczne
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Zamykamy tylko wyniki
    }
  };
 
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (newQuery.length > 2) {
      setResults([]);
      setLoading(true);
      fetchResults(newQuery);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  const fetchResults = async (query: string) => {
    try {
      setLoading(true);
      
      const [productRes, categoryRes] = await Promise.all([
        fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${query}?`),
        fetch(`https://www.bapi2.ebartex.pl/xt/index?xt-kod=?${query}?`)
      ]);
  
      const productData: SearchResult[] = await productRes.json();
      const categoryData: CategoryResult[] = await categoryRes.json();
  
      setResults(productData);
      setCategoryResults(categoryData);
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]);
      setCategoryResults([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleLink = (url: string) => {
    // Zamykamy okno wyników
    setIsOpen(false);
    setResults([]);
    setQuery("");
  
    // Ukrywamy tło po 0.5 sekundy
    setTimeout(() => {
      setBackgroundVisible(false);
    }, 500);
  
    // Przekierowanie użytkownika
    setTimeout(() => {
      router.push(url);
    }, 300);
  };
  /*

  const handleSearchHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery); // Ustawiamy zapytanie na klikniętą frazę
    fetchResults(historyQuery); // Pobieramy wyniki dla tej frazy
  };
*/
  const handleAddToHistory = (newQuery: string) => {
    if (!searchHistory.includes(newQuery)) {
      setSearchHistory((prevHistory) => [...prevHistory, newQuery]);
    }
  };

  const handleInputBlur = () => {
    // Zapisujemy zapytanie, kiedy użytkownik opuszcza input
    if (query.length > 2) {
      handleAddToHistory(query);
    }
  };

  useEffect(() => {
    const updateDistance = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setDistanceFromLeft(rect.left);
      }
    };

    window.addEventListener("scroll", updateDistance);
    window.addEventListener("resize", updateDistance);

    updateDistance();

    return () => {
      window.removeEventListener("scroll", updateDistance);
      window.removeEventListener("resize", updateDistance);
    };
  }, []);

  return (
    <>
      {/* Tło jest zawsze widoczne, nawet po zamknięciu okna wyników */}
      {backgroundVisible && isOpen && (
        <div
          className={`fixed inset-0 bg-zinc-600/90 z-40 transition-opacity duration-500 opacity-100`}
          onClick={(e) => {
            // Zamknięcie tylko wyników, tło nie znika natychmiast
            if (commandRef.current && !commandRef.current.contains(e.target as Node)) {
              setIsOpen(false);
            }
          }}
        />
      )}

      <Command
        ref={commandRef}
        className={`rounded-none md:min-w-[450px] ${isOpen ? "h-12" : "h-12"}`}
      >
        <div className="relative">
          <input
            className="
              boder-none
              relative z-40 
              bg-slate-100 
              transition-all 
              focus:ring-0 
              focus:ring-offset-none 
              focus:shadow-none 
              focus:outline-none 
              focus:bg-white
              pl-10 pr-10 block w-full h-10 
              rounded-none text-sm"
            placeholder="Nazwa produktu kod kreskowy numer katalogowy..."
            onClick={handleInputClick}
            onChange={handleSearchChange}
            onBlur={handleInputBlur}  // Zapisz zapytanie przy opuszczeniu inputa
            value={query}
            ref={elementRef}
          />
          {/* Ikona Search */}
          <Search size={18} className=" z-60 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
        </div>

        {isOpen && (
          <div
            className="xl:h-90 h-65 overflow-y-auto absolute overflow-y-auto z-50 bg-white xl:top-24 top-33 right-0 xl:w-3/4 pr-0 p-0 xl:p-0"
            style={{ left: window.innerWidth >= 1280 ? `${distanceFromLeft}px` : `0px` }}
          >
            <CommandList className="border xl:h-80 h-50 bg-white border-slate-200">
              <CommandGroup className="p-0" heading="Wyniki">
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-12 mb-2 bg-slate-100" />
                  ))
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleLink(`/product/view/${result.id}/slug`)} // Używamy onClick tutaj w divie
                    >
                      <CommandItem
                        onClick={() => handleLink(`/product/view/${result.id}/slug`)}
                        className="flex hover:rounded-none items-center space-x-4 hover:!bg-gray-100 p-3 cursor-pointer"
                      >
<div className="flex w-full">
  <Image
    src={
      result.productphoto.length > 0
        ? `${result.productphoto.find((photo: { main_photo: number; }) => photo.main_photo === 1)?.photo_512 ? "https://www.imgstatic.ebartex.pl/" + result.productphoto.find(photo => photo.main_photo === 1)?.photo_512 : "/product_512.png"}`
        : "/product_512.png"
    }
    width={40}
    height={40}
    alt="Zdjęcie produktu"
  />
  <span className="text-sm truncate">{result.nazwa}</span>
  <div className="ml-auto">
  {result.sm?.length ?? 0 > 0 ? (
    result.sm?.map((item, index) => {
    const stan = Number(item.stanHandl) || 0; // Konwersja na liczbę
    const colorClass =
      stan === 0 ? "text-red-700" : "text-green-700";

    return (
      <div key={index} className="flex items-center space-x-2">
        <Squircle className={`${colorClass} fill-current`} />
 
      </div>
    );
  })
) : (
  <div className="flex items-center space-x-2">
    <Squircle className="text-red-700 fill-current" />
    
  </div>
)}
</div>
</div>

                      </CommandItem>
                    </div>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500">No results found</p>
                )}
              </CommandGroup>
              {categoryResults.length > 0 && (
  <CommandGroup heading="Kategorie">
    {categoryResults.map((category) => (
      <CommandItem
        key={category.id}
        onClick={() => handleLink(`/category/view/${category.id}/slug`)}
        className="flex items-center space-x-4 hover:!bg-gray-100 p-3 cursor-pointer"
      >
        <div className="flex w-full">
          <span onClick={() => handleLink(`/itemcategories/view/${category.id}/test`)} className="text-sm font-medium">{category.kod}</span>
     
        </div>
      </CommandItem>
    ))}
  </CommandGroup>
)}
              {/* Historia wyszukiwania */}
              {searchHistory.length > 0 && (
                <CommandGroup heading="Historia wyszukiwania">
                  <div className="p-2 flex flex-wrap gap-2">
                    {searchHistory.map((historyQuery, index) => (
                      <button
                        key={index}
                        onClick={() => handleLink(`/szukaj?q=${historyQuery}`)}
                        className="cursor-pointer bg-white border text-slate-700 rounded-full px-4 py-1 text-sm hover:bg-slate-100"
                      >
                        {historyQuery}
                      </button>
                    ))}
                  </div>
                </CommandGroup>
              )}

              {/* Pokaż wyniki tylko jeśli query > 2 */}
              {query.length > 2 && (
                <div className="absolute bottom-3 right-0 z-20 w-full">
                  <div>
                  <div onClick={() => handleLink(`/szukaj?q=${encodeURIComponent(query)}`)}>
                  <button className="w-full text-slate-700 pl-4 pt-2 pb-2 pr-4 flex justify-between items-center hover:bg-gray-100 cursor-pointer">
                    <span>Przejdź do wyników</span>
                    <ChevronRight />
                  </button>
                </div>
                  </div>
                </div>
              )}
            </CommandList>
          </div>
        )}
      </Command>
      <NProgressHandler />
    </>
  );
}
