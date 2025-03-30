'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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
}

export default function SearchResults() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

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

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wyniki wyszukiwania dla: {query}</h1>

      {loading && <p className="text-gray-500">Ładowanie...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(results) && results.length > 0 ? (
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {results.map((product) => {
            const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
            const stanColor =
              stan === 0 ? "text-red-700" :
              stan > 0 && stan <= 2 ? "text-orange-500" :
              "text-green-700";

            return (
              <div key={product.id} className="border border-gray-300 shadow-lg rounded-lg p-4">
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
                <h2 className="text-lg font-semibold mb-2">{product.nazwa}</h2>
                <p className={`text-center font-semibold ${stanColor}`}>
                  {stan.toFixed(3)}
                </p>
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
