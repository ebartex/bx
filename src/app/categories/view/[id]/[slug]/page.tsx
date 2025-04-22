'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Importujemy useRouter z next/navigation
import Image from "next/image";
import { Squircle, PackageCheck, Clock, Info, Package } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductPhoto {
  main_photo: number;
  photo_512: string;
}

interface Product {
  zp: {
    data: string; id?: string 
  }[];
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
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

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
                {/* Sprawdzamy, czy stan magazynowy wynosi 0 i wyświetlamy popover */}
                {stan === 0 && Array.isArray(product.zp) && product.zp.length > 0 && (
                  <div className="absolute top-0 right-0 p-2">
                    <Popover
                      open={openPopoverId === product.id}
                      onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? product.id : null)}
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
