"use client";
import { useState } from "react";

import { Menu } from "lucide-react";

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function MenuMobile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Stan do kontrolowania otwarcia menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Zmienia stan menu
  };

  return (
    <>
      {/* Ikona Menu */}
 

      {/* Sheet komponent - menu wysuwane z lewej strony */}
      <Sheet>
      <SheetTrigger asChild>
      <Menu
        className="sm:hidden"
        onClick={toggleMenu} // Kliknięcie powoduje otwarcie/zamknięcie menu
      />
      
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">

          </div>
          <div className="grid grid-cols-4 items-center gap-4">

          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    </>
  );
}
