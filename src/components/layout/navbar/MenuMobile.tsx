"use client";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Typ dla kategorii
type Category = {
  id: string;  // Zmieniamy z kod na id
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
    // Resetujemy stan podkategorii przy każdej zmianie kategorii
    setSubcategories([]); // Zresetowanie podkategorii, zanim załadujemy nowe dane
    setSelectedCategory(categoryId); // Ustawiamy wybraną kategorię

    // Wysyłamy zapytanie o podkategorie
    fetch(`https://www.bapi2.ebartex.pl/xt/subcat?Xt-super=${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        setSubcategories(data); // Ustawiamy stan podkategorii
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
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
              {categories.map((category, index) => (
                <div key={index}>
                  <Accordion type="single" collapsible>
                    <AccordionItem value={`item-${index}`} className="border-b border-slate-200">
                      <AccordionTrigger
                        className="pl-4 pr-4"
                        onClick={() => handleCategoryClick(category.id)} // Używamy category.id
                      >
                        {category.kod} {/* Wyświetlamy category.id */}
                      </AccordionTrigger>

                      {/* Jeżeli wybrano kategorię, wyświetlamy podkategorie */}
                      {selectedCategory === category.id && subcategories.length > 0 && (
                        <AccordionContent>
                          {/* Wyświetlanie podkategorii */}
                          {subcategories.map((subcategory, subIndex) => (
                            <div key={subIndex} className="pl-6">
                              <p>{subcategory.kod}</p> {/* Wyświetlamy kod podkategorii */}
                            </div>
                          ))}
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
