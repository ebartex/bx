"use client";
import { Menu } from "lucide-react";
import Topbar from "../topbar/page";
import CommandSearch from "./CommandSearch";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      <Topbar />
      <nav className="bg-white flex flex-col sm:flex-row items-center justify-between py-0 xl:py-4 xl:px-6"> 
        {/* Flex w kolumnie na urządzeniach mobilnych, wiersz na większych ekranach, wyrównanie w poziomie */}
        <div className="pl-5 pr-5 flex items-center gap-2 sm:w-auto w-full mb-4 sm:mb-0">
        {/* Ikona Menu */}
        <Menu className="sm:hidden " /> {/* Ikona menu widoczna tylko na urządzeniach mobilnych */}

        {/* Obrazek */}
     
          <Image 
            src="/bartex.png" 
            alt="Logo" 
            width={100} 
            height={100} 
            className="mr-4"
          />
        </div>
        
        {/* InputSearchBox */}
        <CommandSearch className="w-full sm:w-auto" /> {/* Wersja mobilna: w pełnej szerokości */}
      </nav>
    </>
  );
}
