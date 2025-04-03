'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Używamy useParams z next/navigation
import { Squircle } from "lucide-react";

interface SubCategory {
  kod: string;
  id: string;
  photo_512: string; // Dodajemy link do zdjęcia podkategorii
}

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

export default function Page() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]); // Lista podkategorii
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null); // Wybrana podkategoria
  const [products, setProducts] = useState<Product[]>([]); // Lista produktów
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Używamy useParams do pobrania parametrów URL
  const params = useParams();
  const id = params.id; // Pobieramy id kategorii z URL


  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      // Pobieramy podkategorie na podstawie `id` kategorii
      fetch(`https://www.bapi2.ebartex.pl/xt/index?Xt-super=${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Błąd podczas pobierania danych');
          }
          return response.json();
        })
        .then((data) => {
          setSubCategories(data); // Ustawiamy dane podkategorii
        })
        .catch((error) => {
          console.error('Błąd pobierania podkategorii:', error);
          setError(error.message || "Nie udało się pobrać danych.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]); // Wykonaj zapytanie, gdy `id` zmienia się

  // Funkcja do obsługi kliknięcia w podkategorię
  const handleSubCategoryClick = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    setLoading(true);
    setError(null);
    // Pobieramy produkty dla wybranej podkategorii z innego API
    fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-katalog=${subCategoryId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Błąd podczas pobierania produktów');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []); // Ustawiamy produkty
      })
      .catch((error) => {
        console.error('Błąd pobierania produktów:', error);
        setError(error.message || "Nie udało się pobrać produktów.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto">


      {/* Wyświetlanie listy podkategorii */}
      {loading && <p className="text-gray-500"></p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">

  <div className="overflow-x-auto whitespace-nowrap flex space-x-2 p-2 border-b border-slate-300">
    {subCategories.map((subCategory) => (
      <button
      key={subCategory.id}
      onClick={() => handleSubCategoryClick(subCategory.id)}
      className={`px-4 py-2 border border-slate-300 rounded-md text-gray-700 hover:bg-gray-100 transition flex-shrink-0 
        ${selectedSubCategory === subCategory.id ? 'bg-slate-100 text-gray-700' : 'bg-white'}`}
    >
        {subCategory.kod}
      </button>
    ))}
  </div>
</div>

      {/* Wyświetlanie produktów po wybraniu podkategorii */}
      {selectedSubCategory && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
          {products.map((product) => {
            const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
            const stanColor =
              stan === 0 ? "text-red-700" :
              stan > 0 && stan <= 2 ? "text-orange-500" :
              "text-green-700";

            return (
              <div key={product.id} className="border border-slate-200 rounded-lg p-4 relative">
                <div className="flex justify-center mb-4">
                  {/* Możesz tu dodać obrazek produktu */}
                </div>
                <h2 className="text-sm text-zinc-800 font-normal mb-2">{product.nazwa}</h2>
                
                <div className="absolute bottom-0 left-0 p-2 flex items-center">
                  <Squircle size={16} className={`${stanColor} fill-current mr-2`} />
                  <span className={`text-sm `}>{stan > 0 ? 'W magazynie' : 'Brak w magazynie'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
