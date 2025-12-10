'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Używamy useRouter z next/navigation
import { ChevronDown } from "lucide-react";
import { getXt } from "../../../../../../services/api/xt";

// Typ podkategorii
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
  const params = useParams();
  const id = params.id; // Pobieramy id kategorii z URL

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);

      // Tworzymy pełny URL zapytania
      const apiUrl = `/xt/index?Xt-super=${id}`; // Używamy tylko endpointu, ponieważ getXt() już obsługuje pełny URL

      // Wysyłamy zapytanie do API proxy przy użyciu getXt
      getXt(apiUrl) // Zamiast fetch, używamy getXt
        .then((data) => {
          setSubCategories(Array.isArray(data) ? data as SubCategory[] : []); // Ustawiamy dane podkategorii
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
    router.push(`/categories/view/${subCategoryId}/test`); // Przekierowanie do nowej strony
  };

  return (
    <div className="container mx-auto">
      {/* Wyświetlanie ładowania */}
      {loading && <p className="text-gray-500">Ładowanie...</p>}
      
      {/* Wyświetlanie komunikatu o błędzie */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Wyświetlanie listy podkategorii */}
      <div
        className={`mb-4 overflow-auto ${subCategories.length > 2 ? 'h-100' : 'h-auto'}`}
      >
        {subCategories.length > 0 ? (
          subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              onClick={() => handleSubCategoryClick(subCategory.id)}
              className="rounded-none flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 border rounded-md transition w-full"
            >
              <span className="text-xs text-gray-800">{subCategory.kod}</span>
              <ChevronDown className="text-gray-500" />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Brak podkategorii</p>
        )}
      </div>
    </div>
  );
}
