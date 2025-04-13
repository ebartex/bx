'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";  // Dodajemy useRouter
import Image from "next/image";
import { Squircle } from "lucide-react";

interface ProductPhoto {
  main_photo: number;
  photo_512: string;
}

interface Product {
  productphoto: ProductPhoto[];
  title: string;
  id: string;
  nazwa: string;
  sm?: { stanHandl?: string }[];
  cn?: { cena: string }[];  // Cena produktu
}

export default function SearchResults() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const router = useRouter(); // Hook do routingu

  useEffect(() => {
    if (query) {
      setLoading(true);
      setError(null);
      fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${encodeURIComponent(query)}?`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Błąd podczas pobierania danych');
          }
          return response.json();
        })
        .then((data) => {
          setResults(Array.isArray(data) ? data : []);
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

  const handleProductClick = (productId: string) => {
    // Nawigacja do strony szczegółów produktu
    router.push(`/product/view/${productId}/test`);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wyniki wyszukiwania dla: {query}</h1>

      {loading && <p className="text-gray-500"></p>}
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
              className="border border-slate-200 rounded-none p-4 relative cursor-pointer flex flex-col justify-between" // Flexbox + justify-between
              onClick={() => handleProductClick(product.id)} // Obsługuje kliknięcie na produkt
            >
              <div className="flex justify-center mb-4">
                <Image
                  src={
                    product.productphoto.length > 0
                      ? `https://www.imgstatic.ebartex.pl/${product.productphoto.find(photo => photo.main_photo === 1)?.photo_512 || ""}`
                      : "/product_512.png"
                  }
                  width={150}
                  height={150}
                  alt={product.nazwa}
                  className="object-cover rounded-md"
                />
              </div>
              
              <h2 className="text-sm text-zinc-800 font-normal mb-2">{product.nazwa}</h2>
              
{/* Wstawiamy cenę po prawej stronie */}
          {product.cn && product.cn.length > 0 && product.cn[0].cena ? (
            <div className="text-lg text-slate-700 mb-2 text-right">
              <span className="font-bold text-xl">
                {/* Konwertujemy cenę na string, zamieniamy przecinek na kropkę, konwertujemy na liczbę */}
                {Number(String(product.cn[0].cena).replace(',', '.')).toFixed(0).replace('.', ',')}
                <sup className="text-sm custom-sup">
                  ,{Number(String(product.cn[0].cena).replace(',', '.')).toFixed(2).split('.')[1]}zł
                </sup>
              </span> 
            </div>
          ) : (
            <div className="text-lg text-zinc-700 mb-2 text-right">
              <span className="font-bold text-2xl">
                0
                <sup className="text-sm font-bold custom-sup">,00</sup>
                zł
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
