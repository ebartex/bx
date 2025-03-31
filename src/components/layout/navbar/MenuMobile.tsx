"use client";
import { useState, useEffect } from "react";
import { Menu,  SquareRoundCorner } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton"; // Importujemy Skeleton z shadcn

// Typ dla kategorii
type Category = {
  id: string;
  kod: string;
};

// Typ dla podkategorii
type SubCategory = {
  kod: string;
};

export default function MenuMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Zmienna do przechowywania kategorii
  const [subcategories, setSubcategories] = useState<{ [key: string]: SubCategory[] }>({}); // Zmienna do przechowywania podkategorii dla każdej kategorii
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null); // Zmienna do przechowywania ID kategorii, która jest ładowana

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Przełączanie stanu menu
  };

  useEffect(() => {
    // Pobieranie kategorii z API
    fetch("https://www.bapi2.ebartex.pl/xt/index?Xt-super=2200&Xt-root=2200")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data); // Ustawiamy stan kategorii
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Funkcja obsługująca kliknięcie w kategorię
  const handleCategoryClick = (categoryId: string) => {
    // Jeżeli podkategorie dla tej kategorii już zostały pobrane, nie musimy ich ponownie ładować
    if (subcategories[categoryId]) {
      return;
    }

    // Ustawiamy kategorię jako ładowaną
    setLoadingCategory(categoryId);

    // Pobieranie podkategorii dla danej kategorii
    fetch(`https://www.bapi2.ebartex.pl/xt/subcat?Xt-super=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setSubcategories((prev) => ({
          ...prev,
          [categoryId]: data, // Dodajemy podkategorie dla danej kategorii
        }));

        // Opóźniamy ustawienie stanu ładowania o 0.5 sekundy
        setTimeout(() => {
          setLoadingCategory(null); // Ustawiamy stan ładowania na null po załadowaniu danych
        }, 500); // Opóźnienie 0.5 sekundy
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);

        // Opóźniamy ustawienie stanu ładowania na null, w przypadku błędu
        setTimeout(() => {
          setLoadingCategory(null); // Ustawiamy stan ładowania na null po błędzie
        }, 500);
      });
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="sm:hidden" onClick={toggleMenu} />
        </SheetTrigger>

        <SheetContent className="p-0">
          <SheetHeader className="p-0">
            <SheetTitle className="pt-4 pl-2">Kategorie</SheetTitle>
          </SheetHeader>

          <div className="p-0 overflow-auto">
            {/* Wyświetlanie kategorii */}
            <div>
              <Accordion type="single" collapsible>
                {categories.map((category, index) => (
                  <>
                    <AccordionItem key={index} value={category.id} className="border-b border-slate-200">
                      <AccordionTrigger
                        className="pr-4 pt-2 flex justify-between items-center font-normal"
                        onClick={() => handleCategoryClick(category.id)} // Obsługujemy kliknięcie w kategorię
                      >
                        {/* Kontener z pozycjonowaniem relative */}
                        <div className="relative  mb-5">
                          {/* Ikona Square z pozycjonowaniem absolute */}
                          <SquareRoundCorner className="absolute left-1" />
                        </div>

                        {/* Tekst z nazwą kategorii */}
                        <span className="flex-grow pl-5 ">{category.kod}</span>
                      </AccordionTrigger>

                      {/* Jeżeli wybrano kategorię, wyświetlamy podkategorie */}
                      <AccordionContent>
                        {/* Jeśli dane są ładowane, wyświetlamy Skeleton */}
                        {loadingCategory === category.id ? (
                          <div>
                            {/* Skeleton w postaci szarego prostokąta */}
                            <Skeleton className="w-full h-6 mb-2" />
                            <Skeleton className="w-full h-6 mb-2" />
                            <Skeleton className="w-full h-6 mb-2" />
                          </div>
                        ) : (
                          // Wyświetlanie podkategorii po załadowaniu
                          subcategories[category.id]?.map((subcategory, subIndex) => (
                            <div key={subIndex} className="pl-6">
                              <p>{subcategory.kod}</p> {/* Wyświetlamy kod podkategorii */}
                            </div>
                          ))
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </>
                ))}
              </Accordion>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
