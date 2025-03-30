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
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Wyniki wyszukiwania dla: {query}</h1>

      {loading && <p className="text-gray-500">Ładowanie...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(results) && results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left border-b">Zdjęcie</th>
                <th className="py-3 px-4 text-left border-b">Nazwa</th>
                <th className="py-3 px-4 text-center border-b">Stan</th>
              </tr>
            </thead>
            <tbody>
              {results.map((product) => {
                const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
                const stanColor =
                  stan === 0 ? "text-red-700" :
                  stan > 0 && stan <= 2 ? "text-orange-500" :
                  "text-green-700";

                return (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">
                      <Image
                        src={
                          product.productphoto.length > 0
                            ? `https://www.imgstatic.ebartex.pl/${product.productphoto.find(photo => photo.main_photo === 1)?.photo_512 || ""}`
                            : "/product_512.png"
                        }
                        width={40}
                        height={40}
                        alt={product.nazwa}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{product.nazwa}</td>
                    <td className={`py-2 px-4 border-b text-center font-semibold ${stanColor}`}>
                      {stan.toFixed(3)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && !error && <p className="text-gray-500">Brak wyników.</p>
      )}
    </div>
  );
}
