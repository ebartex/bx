'use client';

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";  // Dodajemy useRouter
import Image from "next/image";
import { Squircle, PackageCheck, Clock, Info, Package } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; 
import { getTw } from "../../../services/api/tw";
import { slugify } from "@/utils/slugify";
import { Product } from "../../../types/product";
import PriceLabel from "@/components/product/PriceLabel";






export default function SearchResults() {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('q') || '' : '';
  
  const router = useRouter(); // Hook do routingu

  useEffect(() => {
    const handleScroll = () => {
      setOpenPopoverId(null); // Zamknij popover przy scrollu
    };
  
    window.addEventListener('scroll', handleScroll, true); // true = nasłuchuje też wewnętrznych elementów (np. div z overflow)
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenPopoverId(null); // Zamknij popover po naciśnięciu Escape
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);

      // Tworzymy pełny URL zapytania do API proxy
      const productUrl =`/tw/search?q=${encodeURIComponent(query)}`; // Poprawiamy endpoint

      // Wysyłamy zapytanie do API proxy przy użyciu getTw
      getTw(productUrl) // Zamiast fetch, używamy getTw
        .then((data) => {
          // Sprawdzamy, czy dane są typu Product[]
          if (Array.isArray(data)) {
            setResults(data as Product[]); // Rzutujemy dane na Product[]
          } else {
            setResults([]); // Jeśli dane nie są tablicą, ustawiamy pustą tablicę
          }
        })
        .catch((error) => {
          console.error('Błąd pobierania danych:', error);
          setError(error.message || "Nie udało się pobrać danych.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [query]);

  const handleProductClick = (productId: string, slug: string) => {
    // Nawigacja do strony szczegółów produktu
    router.push(`/products/view/${productId}/${slug}`);  
  };

  return (
    <div className="container mx-auto bg-white">
      <h1 className="text-xl font-normal pl-4">Wyniki wyszukiwania dla <span className="font-medium">"{query}</span>"</h1>


      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(results) && results.length > 0 ? (
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {results.map((product) => {
            const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
            const stanColor =
              stan === 0 ? "text-red-700" : "text-green-700";

            return (
              <div 
                key={product.id} 
                className="border border-slate-200 rounded-none p-4 pb-10 relative cursor-pointer flex flex-col justify-between" // Flexbox + justify-between
                onClick={() => handleProductClick(product.id, slugify(product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa))} // Obsługuje kliknięcie na produkt
              >
                {stan === 0 && Array.isArray(product.zp) && product.zp.length > 0 && (
                  <div className="absolute top-0 right-0 p-2">
                    <Popover
                      open={openPopoverId === product.id}
                      onOpenChange={(isOpen) =>
                        setOpenPopoverId(isOpen ? product.id : null)
                      }
                    >
                      <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
                        <PackageCheck
                          className="ml-20 text-green-800 cursor-pointer"
                          size={32}
                        />
                      </PopoverTrigger>

                      <PopoverContent
                        side="top"
                        className="text-sm space-y-2 max-w-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenPopoverId(null); // Zamknij przy kliknięciu w zawartość
                        }}
                      >
                        {/* Nagłówek */}
                        <div className="flex items-center gap-2 font-semibold text-gray-800">
                          <Info className="text-blue-600" size={18} />
                          <span>Produkt w zamówieniu</span>
                        </div>

                        {/* Data */}
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} className="text-gray-600" />
                          <span>Data zamówienia: {product.zp[0].data}</span>
                        </div>

                        {/* Opis */}
                        <div className="flex items-start gap-2 text-gray-600">
                          <Package size={16} className="mt-1 text-yellow-600" />
                          <span>
                            Produkt zostanie uzupełniony o <strong>stan magazynowy</strong> w ciągu kilku dni od daty zamówienia.
                          </span>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
                <div className="flex justify-center mb-4">
                  <Image
                    src={
                      product.productphoto.length > 0
                        ? `https://www.imgstatic.ebartex.pl/${product.productphoto.find(photo => photo.main_photo === 1)?.photo_512 || ""}`
                        : "/product_512.png"
                    }
                    width={150}
                    height={150}
                    alt={product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa}
                    className="mt-5 object-cover rounded-md"
                  />
                </div>
                
                <h2 className="text-sm text-zinc-800 font-normal mb-2">{product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa}</h2>
                
                {/* Wstawiamy cenę po prawej stronie */}
                {product.cn && product.cn.length > 0 && (product.cn[0].cena2 || product.cn[0].cena) ? (() => {
                  const cena = String(product.cn[0].cena2 || product.cn[0].cena);
      
                  const jednostka = product.cn[0].cena2
                    ? (product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_jm_Val || '')
                    : (product.jm || '');

                  return (
                 <div className="text-right"> 
                  <PriceLabel size="medium" price={cena} unit={jednostka}/>
                  </div>
                  );
                })() : (
                  <div className="text-lg text-zinc-700 mb-2 text-right">
                    <span className="font-bold text-2xl">
                      0
                      <sup className="text-sm font-bold custom-sup">,00 zł</sup>
                    </span>
                  </div>
                )}

                {/* Ikona + napis w lewym dolnym rogu */}
                <div className="absolute bottom-0 left-0 p-2 flex items-center">
                  <Squircle size={16} className={`${stanColor} fill-current mr-2`} />
                  <span className={`text-sm `}>w magazynie</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && !error && <p className="text-gray-500">Brak wyników.</p>
      )}
    </div>
  );
}
