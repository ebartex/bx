"use client";

import {
  Command,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

interface SearchResult {
  title: string;
  id: string;
  nazwa: string;
}

export default function CommandSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
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
    const query = event.target.value;

    if (query.length > 2) {
      setResults([]);
      setLoading(true);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        fetchResults(query);
      }, 400);
      setDebounceTimer(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  const fetchResults = async (query: string) => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products?search=${query}`);
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

  return (
    <>
      {/* Grey overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-600/30 bg-opacity-100 z-40"
          onClick={(e) => {
            if (commandRef.current && !commandRef.current.contains(e.target as Node)) {
              setIsOpen(false);
            }
          }}
        />
      )}

      <Command
        ref={commandRef}
        className={`rounded-none border md:min-w-[450px] ${isOpen ? "h-12" : "h-12"}`}
      >
        <Input
          className="z-60 transition-all focus:ring-2 focus:ring-sky-600 focus:ring-offset-1 focus:outline-none pl-6 pr-10 block w-full h-10 rounded-md text-sm border border-sky-700 bg-slate-100 hover:bg-white"
          placeholder="Type a command or search..."
          onClick={handleInputClick}
          onChange={handleSearchChange}
          ref={elementRef}
        />

        {isOpen && (
          <div
            className="absolute overflow-y-auto z-50 bg-white top-17 right-0 xl:w-3/4 pr-0 p-0 xl:p-0"
            style={{ left: window.innerWidth >= 1280 ? `${distanceFromLeft}px` : `0px` }}
          >
            <CommandList 
            className="border h-200 max-h-96 overflow-y-auto rounded-md shadow-lg bg-white border-slate-200"
            
            
            >
              <div>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="h-12 mb-2 bg-slate-100" />
                  ))
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <CommandItem
                      key={result.id}
                      onClick={() => handleLinkClick(result.id)}
                      className="flex items-center space-x-4 hover:bg-slate-200 p-2 pl-4 rounded-md cursor-pointer"
                    >
                      <div className="flex justify-between w-full">
                        <span className="text-sm truncate">{result.title}</span>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <p className="p-4 text-sm text-gray-500">No results found</p>
                )}
              </div>
            </CommandList>
          </div>
        )}
      </Command>
    </>
  );
}
