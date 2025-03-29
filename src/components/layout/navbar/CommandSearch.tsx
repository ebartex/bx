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

import { ChevronRight, Search } from "lucide-react";
import Image from 'next/image';
interface ProductPhoto {
  main_photo: number;
  photo_512: string;
}

interface SearchResult {
  productphoto: ProductPhoto[];  // Typ zdefiniowany jako tablica obiektów ProductPhoto
  title: string;
  id: string;
  nazwa: string;
}

export default function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");  // Przechowujemy zapytanie użytkownika
  const commandRef = useRef<HTMLDivElement | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const elementRef = useRef<HTMLInputElement | null>(null);
  const [distanceFromLeft, setDistanceFromLeft] = useState(0);

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
      setIsOpen(false);
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
    setQuery(newQuery);  // Aktualizujemy zapytanie

    if (newQuery.length > 2) {
      setResults([]);
      setLoading(true);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        fetchResults(newQuery);
      }, 400);
      setDebounceTimer(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  const fetchResults = async (query: string) => {
    try {
      const response = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${query}?`);
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (id: string) => {
    router.push(`/product/view/${id}/slug`);
    setIsOpen(false);
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

  function toggleRowExpansion(id: string) {
    // Zaloguj lub wykonaj operację na 'id'
    console.log("Rozwinięcie wiersza dla ID:", id);
  }

  return (
    <>
      {/* Grey overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-600/90 bg-opacity-100 z-40"
          onClick={(e) => {
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
            relative z-60 
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
            value={query}
            ref={elementRef}
          />
          {/* Ikona Search */}
          <Search size={18} className=" z-60 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
        </div>

        {isOpen && (
          <div
            className="xl:h-90 h-70 overflow-y-auto absolute overflow-y-auto z-50 bg-white xl:top-22 top-26 right-0 xl:w-3/4 pr-0 p-0 xl:p-0"
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
                    <CommandItem
                      key={result.id}
                      onClick={() => handleLinkClick(result.id)}
                      className="flex hover:rounded-none items-center space-x-4 hover:!bg-gray-100 p-3 cursor-pointer"
                    >
                      <div className="flex  w-full">
                      <Image
                src={
                  result.productphoto.length > 0
                    ? `${result.productphoto.find((photo: { main_photo: number; }) => photo.main_photo === 1)?.photo_512 ? "https://www.imgstatic.ebartex.pl/" + result.productphoto.find(photo => photo.main_photo === 1)?.photo_512 : "/product_512.png"}`
                    : "/product_512.png"
                }
                width={40}
                height={40}
                alt="Zdjęcie produktu"
                onClick={() => toggleRowExpansion(result.id)} // Przekazujemy onClick
              />
                        <span className="text-sm truncate">{result.nazwa}</span>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500">No results found</p>
                )}
              </CommandGroup>

              {/* Pokaż wyniki tylko jeśli query > 2 */}
              {query.length > 2 && (
                <div className="absolute bottom-3 right-0 z-20 w-full">
                  <div>
                    <div className="flex">
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
    </>
  );
}
