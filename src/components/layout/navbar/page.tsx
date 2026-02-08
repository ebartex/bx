"use client";


import CommandSearch from "./CommandSearch";
import Link from "next/link";
import MenuMobile from "./MenuMobile";



export default function Navbar() {
  return (
    <>
         <div className="xl:w-[1200px] mx-auto">

      <nav className="bg-sidebar flex flex-col sm:flex-row items-center justify-between mb-2 xl:pr-6"> 
        {/* Flex w kolumnie na urządzeniach mobilnych, wiersz na większych ekranach, wyrównanie w poziomie */}
        <div className="pr-5 flex items-center gap-2 sm:w-auto w-full mb-4 sm:mb-0">
        {/* Ikona Menu */}
        <div className="block lg:hidden">
        <MenuMobile/>
      </div>
  
     
      

        {/* Obrazek */}
          <Link href="/">

<span className="text-3xl font-semibold">
  <span className="dark:text-white text-slate-800">Bar</span>
  <span className="text-rose-600">tex</span>
</span>


           
          </Link>
          
        </div>
        
        {/* InputSearchBox */}
        <CommandSearch /> {/* Wersja mobilna: w pełnej szerokości */}
      </nav>
      </div>
    </>
  );
}
