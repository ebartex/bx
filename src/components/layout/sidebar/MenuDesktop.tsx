'use client';

import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

// Typ dla kategorii
type Category = {
  id: string;
  kod: string;
};

// Typ dla podkategorii
type SubCategory = {
  kod: string;
  id: string;
};

export default function MenuDesktop() {
  const [categories, setCategories] = useState<Category[]>([]); // Zmienna do przechowywania kategorii
  const [subcategories, setSubcategories] = useState<{ [key: string]: SubCategory[] }>({}); // Zmienna do przechowywania podkategorii dla każdej kategorii
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null); // Zmienna do przechowywania ID kategorii, która jest ładowana
  const router = useRouter(); // Inicjujemy useRouter

  useEffect(() => {
    // Pobieranie kategorii z API proxy
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent('https://www.bapi2.ebartex.pl/xt/index?Xt-super=2200&Xt-root=2200')}`, {
          method: "GET",
        });
        const data = await response.json();
        setCategories(data); // Ustawiamy stan kategorii
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Uruchamiamy funkcję pobierającą kategorie
  }, []);

  // Funkcja obsługująca kliknięcie w kategorię
  const handleCategoryClick = (categoryId: string) => {
    // Jeżeli podkategorie dla tej kategorii już zostały pobrane, nie musimy ich ponownie ładować
    if (subcategories[categoryId]) {
      return;
    }

    // Ustawiamy kategorię jako ładowaną
    setLoadingCategory(categoryId);

    // Pobieranie podkategorii dla danej kategorii z API proxy
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(`https://www.bapi2.ebartex.pl/xt/subcat?Xt-super=${categoryId}`)}`, {
          method: "GET",
        });
        const data = await response.json();
        setSubcategories((prev) => ({
          ...prev,
          [categoryId]: data, // Dodajemy podkategorie dla danej kategorii
        }));

        // Opóźniamy ustawienie stanu ładowania o 0.5 sekundy
        setTimeout(() => {
          setLoadingCategory(null); // Ustawiamy stan ładowania na null po załadowaniu danych
        }, 500); // Opóźnienie 0.5 sekundy
      } catch (error) {
        console.error("Error fetching subcategories:", error);

        // Opóźniamy ustawienie stanu ładowania na null, w przypadku błędu
        setTimeout(() => {
          setLoadingCategory(null); // Ustawiamy stan ładowania na null po błędzie
        }, 500);
      }
    };

    fetchSubcategories(); // Uruchamiamy funkcję pobierającą podkategorie
  };

  // Funkcja obsługująca kliknięcie w subkategorię
  const handleSubCategoryClick = (subCategoryId: string) => {
    // Przejście do strony z podkategorią
    router.push(`/parentcategories/view/${subCategoryId}/test`);
  };

  return (
    <div className="hidden xl:block lg:flex lg:flex-col lg:w-64 p-4">
      <h2 className="text-md font-semibold mb-4">Kategorie</h2>

      <Accordion type="single" collapsible>
        {categories.map((category, index) => (
          <AccordionItem key={index} value={category.id} className="border-b border-slate-200">
            <AccordionTrigger
              className="hover:bg-slate-100 hover:rounded-none cursor-pointer pr-4 pt-2 flex justify-between items-center font-normal"
              onClick={() => handleCategoryClick(category.id)}
            >
              <span>{category.kod}</span>
            </AccordionTrigger>

            <AccordionContent>
              {loadingCategory === category.id ? (
                <div>
                  <Skeleton className="w-full h-6 mb-2" />
                  <Skeleton className="w-full h-6 mb-2" />
                  <Skeleton className="w-full h-6 mb-2" />
                </div>
              ) : (
                <ScrollArea className="h-72">
                  {subcategories[category.id]?.map((subcategory, subIndex) => (
                    <div
                      key={subIndex}
                      onClick={() => handleSubCategoryClick(subcategory.id)} // Kliknięcie w subkategorię
                      className="pl-6 pb-2 pt-2 hover:!bg-slate-100 cursor-pointer"
                    >
                      <p>{subcategory.kod}</p> {/* Wyświetlanie kodu subkategorii */}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
