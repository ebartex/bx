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

<span className="relative inline-block text-3xl font-extrabold tracking-tight">
  {/* bazowy napis */}
  <span className="dark:text-white text-slate-800">
    BARTEX
  </span>

  {/* nakładana litera */}
  <span
    aria-hidden
    className="
      pointer-events-none
      absolute
      left-[0.55em]
      top-0
      text-red-600
      font-extrabold
      tracking-tight
      z-10
    "
  >
    A
  </span>
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
