"use client";

import {
  Command,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Jeśli masz ten komponent w swoim projekcie
import { useRouter } from "next/navigation"; // Importowanie useRouter z Next.js
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  nazwa: string;
}

export default function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const commandRef = useRef<HTMLDivElement | null>(null); // Określamy typ jako HTMLDivElement
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const elementRef = useRef(null);
  const [distanceFromLeft, setDistanceFromLeft] = useState(0);

  const handleInputClick = () => {
    setIsOpen(true); // Otwórz CommandList
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Zamknij CommandList po kliknięciu poza obszar
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    // Jeśli zapytanie ma więcej niż 2 znaki, zaczynamy wyszukiwanie
    if (query.length > 2) {
      setResults([]); // Reset wyników podczas wyszukiwania
      setLoading(true); // Ustawiamy ładowanie
      if (debounceTimer) {
        clearTimeout(debounceTimer); // Zatrzymanie poprzedniego debouncingu
      }

      // Nowy debouncing: zaczynaj wyszukiwanie po 400 ms
      const timer = setTimeout(() => {
        fetchResults(query);
      }, 400);
      setDebounceTimer(timer);
    } else {
      setResults([]); // Resetuj wyniki, jeśli zapytanie jest krótkie
      setLoading(false); // Zakończ ładowanie
    }
  };

  // Funkcja do pobierania wyników z API
  const fetchResults = async (query: string) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products`);
      const data: SearchResult[] = await response.json();
      setResults(data); // Zaktualizuj wyniki
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]);
    } finally {
      setLoading(false); // Zakończ ładowanie
    }
  };

  const handleLinkClick = (id: string) => {
    // Przechodzenie na stronę produktu po kliknięciu
    router.push(`/product/view/${id}/slug`);
    setIsOpen(false); // Zamknij CommandList po kliknięciu w link
  };

  // Nasłuchiwanie zarówno na przewijanie, jak i zmianę rozmiaru okna
  useEffect(() => {
    const updateDistance = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setDistanceFromLeft(rect.left); // Odległość od lewej krawędzi ekranu
      }
    };

    window.addEventListener('scroll', updateDistance);
    window.addEventListener('resize', updateDistance); // Nasłuchuj zmianę rozmiaru okna

    // Początkowe ustawienie odległości
    updateDistance();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('scroll', updateDistance);
      window.removeEventListener('resize', updateDistance); // Usuwamy nasłuchiwanie na resize
    };
  }, []);

  return (
    <>
      <Command
        ref={commandRef}
        className={`rounded-none border md:min-w-[450px] ${isOpen ? "h-12" : "h-12"}`}
      >
        <Input
          className="transition-all focus:ring-2 focus:ring-sky-600 focus:ring-offset-1 focus:outline-none pl-6 pr-10 block w-full h-10 rounded-md text-sm border border-sky-700 focus:outline-none bg-slate-100 hover:bg-white"
          placeholder="Type a command or search..."
          onClick={handleInputClick} // Otwórz CommandList
          onChange={handleSearchChange} // Obsługuje zmiany tekstu
          ref={elementRef}
        />
        {isOpen && (
          <div
            className={`
              absolute 
              h-50 
              overflow-y-auto 
              z-50 
              bg-white
              top-20
              right-0
              xl:w-5/6
              pr-0
              p-0
              xl:p-0
              xl:pr-20
            `}
            style={{ left: window.innerWidth >= 1280 ? `${distanceFromLeft}px` :`0px` }}
      
          >
            <CommandList
              className=" h-50 border"
            >
              <div className="">
                {/* Wyniki wyszukiwania produktów */}
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-12 mb-2 bg-slate-100" />
                  ))
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <CommandItem
                      key={result.id}
                      onClick={() => handleLinkClick(result.id)} // Używamy handleLinkClick do obsługi kliknięcia
                      className="flex items-center space-x-4 hover:bg-slate-200 p-2 pl-4 rounded-md cursor-pointer"
                    >
                      <div className="flex justify-between w-full">
                        <span className="text-sm truncate">{result.title}</span>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <p>No results found</p>
                )}
              </div>
            </CommandList>
          </div>
        )}
      </Command>
    </>
  );
}
