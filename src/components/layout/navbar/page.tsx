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

<svg
  width="auto"
  height="40"
  viewBox="0 0 200 60"
  className="inline-block text-slate-800 dark:text-white"
>
  <defs>
    <mask id="text-mask">
      <text
        x="0"
        y="45"
        fontSize="48"
        fontWeight="800"
        letterSpacing="-0.05em"
        fill="white"
      >
        BARTEX
      </text>
    </mask>
  </defs>

  {/* bazowy tekst */}
  <text
    x="0"
    y="45"
    fontSize="48"
    fontWeight="800"
    fill="currentColor"
  >
    BARTEX
  </text>

  {/* czerwona A widoczna tylko w literach */}
  <text
    x="30"
    y="45"
    fontSize="52"
    fontWeight="800"
    fill="#dc2626"
    mask="url(#text-mask)"
  >
    A
  </text>
</svg>


           
          </Link>
          
        </div>
        
        {/* InputSearchBox */}
        <CommandSearch /> {/* Wersja mobilna: w pełnej szerokości */}
      </nav>
      </div>
    </>
  );
}
