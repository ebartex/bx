'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Używamy useRouter z next/navigation
import { ChevronDown} from "lucide-react";



interface SubCategory {
  kod: string;
  id: string;
  photo_512: string; // Dodajemy link do zdjęcia podkategorii
}




export default function Page() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]); // Lista podkategorii

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Inicjalizujemy useRouter

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

  // Funkcja do obsługi kliknięcia w podkategorię (przekierowanie)
  const handleSubCategoryClick = (subCategoryId: string) => {
 
    router.push(`/itemcategories/view/${subCategoryId}/test`); // Przekierowanie do nowej strony
  };

  return (
    <div className="container mx-auto">

      {/* Wyświetlanie listy podkategorii */}
      {loading && <p className="text-gray-500"></p>}
      {error && <p className="text-red-500">{error}</p>}

      <div
        className={`mb-4 overflow-auto ${
          subCategories.length > 2 ? 'h-100' : 'h-auto'
        }`}
      >
        {subCategories.map((subCategory) => (
          <div
            key={subCategory.id}
            onClick={() => handleSubCategoryClick(subCategory.id)}
            className="rounded-none flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 border rounded-md transition w-full"
          >
            <span className="text-xs text-gray-800">{subCategory.kod}</span>
            <ChevronDown className="text-gray-500" />
          </div>
        ))}
      </div>


    </div>
  );
}
