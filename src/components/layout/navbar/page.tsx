"use client";


import CommandSearch from "./CommandSearch";
import Image from "next/image";
import Link from "next/link";
import MenuMobile from "./MenuMobile";


export default function Navbar() {
  return (
    <>
      
      <nav className="bg-white flex flex-col sm:flex-row items-center justify-between py-3 xl:py-4 xl:pr-6"> 
        {/* Flex w kolumnie na urządzeniach mobilnych, wiersz na większych ekranach, wyrównanie w poziomie */}
        <div className="pr-5 flex items-center gap-2 sm:w-auto w-full mb-4 sm:mb-0">
        {/* Ikona Menu */}
        <div className="block lg:hidden">
        <MenuMobile/>
      </div>
  
     
      

        {/* Obrazek */}
          <Link href="/">
          <Image 
            src="/bartex.png" 
            alt="Logo" 
            width={100} 
            height={25} 
            className="mr-4"
          />
          </Link>
        </div>
        
        {/* InputSearchBox */}
        <CommandSearch /> {/* Wersja mobilna: w pełnej szerokości */}
      </nav>
    </>
  );
}
