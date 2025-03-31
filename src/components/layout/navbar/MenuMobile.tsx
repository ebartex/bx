"use client";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
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
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]); // Zmienna do przechowywania podkategorii
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Zmienna do przechowywania wybranej kategorii
  const [isLoading, setIsLoading] = useState(false); // Zmienna do kontrolowania stanu ładowania podkategorii

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
    // Jeżeli ta sama kategoria jest kliknięta, zamykamy ją (ustawiamy null)
    if (selectedCategory === categoryId) {
      setSelectedCategory(null); // Zamykamy kategorię
      setSubcategories([]); // Resetujemy podkategorie
      setIsLoading(false); // Zatrzymujemy ładowanie
    } else {
      // Resetujemy stan podkategorii przy każdej zmianie kategorii
      setSubcategories([]); // Zresetowanie podkategorii, zanim załadujemy nowe dane
      setSelectedCategory(categoryId); // Ustawiamy wybraną kategorię
      setIsLoading(true); // Ustawiamy stan ładowania na true

      // Dodanie opóźnienia na skeleton (np. 500ms)
      setTimeout(() => {
        // Wysyłamy zapytanie o podkategorie
        fetch(`https://www.bapi2.ebartex.pl/xt/subcat?Xt-super=${categoryId}`)
          .then((response) => response.json())
          .then((data) => {
            setSubcategories(data); // Ustawiamy stan podkategorii
            setIsLoading(false); // Po załadowaniu ustawiamy stan ładowania na false
          })
          .catch((error) => {
            console.error("Error fetching subcategories:", error);
            setIsLoading(false); // Jeśli wystąpi błąd, również przestajemy ładować
          });
      }, 500); // Opóźnienie na 500ms (0.5 sekundy)
    }
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
              {categories.map((category, index) => (
                <Accordion key={index} type="single" collapsible value={selectedCategory || undefined}>
                  <AccordionItem value={category.id} className="border-b border-slate-200">
                    <AccordionTrigger
                      className="pl-4 pr-4 pt-2 flex justify-between items-center"
                      onClick={() => handleCategoryClick(category.id)} // Obsługujemy kliknięcie w kategorię
                    >
                      {category.kod} {/* Wyświetlamy kod kategorii */}
                    </AccordionTrigger>

                    {/* Jeżeli wybrano kategorię, wyświetlamy podkategorie */}
                    {selectedCategory === category.id && (
                      <AccordionContent>
                        {/* Jeśli dane są ładowane, wyświetlamy Skeleton */}
                        {isLoading ? (
                          <div>
                            {/* Skeleton w postaci szarego prostokąta */}
                            <Skeleton className="w-full h-6 mb-2" />
                            <Skeleton className="w-full h-6 mb-2" />
                            <Skeleton className="w-full h-6 mb-2" />
                          </div>
                        ) : (
                          // Wyświetlanie podkategorii po załadowaniu
                          subcategories.map((subcategory, subIndex) => (
                            <div key={subIndex} className="pl-6">
                              <p>{subcategory.kod}</p> {/* Wyświetlamy kod podkategorii */}
                            </div>
                          ))
                        )}
                      </AccordionContent>
                    )}
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
