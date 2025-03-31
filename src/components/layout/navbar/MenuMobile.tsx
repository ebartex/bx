"use client";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Sheet,  SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
type Category = {
    kod: string;
  }
export default function MenuMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // State to store categories

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu state
  };

  useEffect(() => {
    // Fetch the categories from the API
    fetch("https://www.bapi2.ebartex.pl/xt/index?Xt-super=2200&Xt-root=2200")
      .then(response => response.json())
      .then(data => {
        // Assuming data is an array of categories
        setCategories(data); // Set categories state
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Menu
            className="sm:hidden"
            onClick={toggleMenu}
          />
        </SheetTrigger>

        <SheetContent className="p-0">
          <SheetHeader className="p-0">
            <SheetTitle className="pt-4 pl-2">Kategorie</SheetTitle>
  
          </SheetHeader>

          <div className="p-0 overflow-auto ">
            {/* Display categories */}
            <div>
              {categories.map((category, index) => (
                <div key={index} className="">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b border-slate-200">
            <AccordionTrigger className="pl-4 pr-4 ">{category.kod}</AccordionTrigger>
            <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
            Yes. It adheres to the WAI-ARIA design pattern.<br/>
          
        </AccordionContent>
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
