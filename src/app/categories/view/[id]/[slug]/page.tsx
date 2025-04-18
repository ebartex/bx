'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Importujemy useRouter z next/navigation
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

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]); // Lista produktów
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Inicjujemy useRouter

  // Pobieramy parametr tw-katalog z URL
  const { id } = useParams(); // Zakładając, że parametr w URL to 'id' (np. /itemcategory/view/[id])

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);

      // Tworzymy dynamiczne zapytanie do API z parametrem tw-katalog
      fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-katalog=${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Błąd podczas pobierania produktów');
          }
          return response.json();
        })
        .then((data) => {
          setProducts(Array.isArray(data) ? data : []); // Ustawiamy dane produktów
        })
        .catch((error) => {
          console.error('Błąd pobierania produktów:', error);
          setError(error.message || "Nie udało się pobrać produktów.");
        })
        .finally(() => {
          setLoading(false);
        });

      // Pobieramy nazwę kategorii
      fetch(`https://www.bapi2.ebartex.pl/xt/index?xt-id=${id}`)
        .then((res) => res.json())
        .catch((err) => {
          console.error("Błąd pobierania kategorii:", err);
        });
    }
  }, [id]);

  const handleProductClick = (productId: string, slug: string) => {
    // Przejście do strony produktu przy użyciu router.push
    router.push(`/products/view/${productId}/${slug}`);
  };

  return (
    <div className="container mx-auto">
      {/* Wyświetlanie komunikatu o ładowaniu */}
      {loading && <p className="text-gray-500">Ładowanie...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Wyświetlanie listy produktów */}
      {Array.isArray(products) && products.length > 0 ? (
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
            const stanColor =
              stan === 0 ? "text-red-700" : "text-green-700";

            return (
              <div
                key={product.id}
                className="border cursor-pointer border-slate-200 rounded-none p-4 relative"
                onClick={() => handleProductClick(product.id, 'test')} // Przechodzi do strony produktu po kliknięciu
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

                {/* Wyświetlanie ceny */}
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
                  <span className={`text-sm`}>w magazynie</span>
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
