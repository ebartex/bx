"use client";

import CommandSearch from "./CommandSearch";
import Image from "next/image";
import Link from "next/link";
import MenuMobile from "./MenuMobile";

export default function Navbar() {
  return (
    <>
      <nav className="bg-white flex items-center justify-between py-3 xl:py-4 "> 
        {/* Flex w poziomie z wyrównaniem między elementami */}
        
        {/* Lewa strona - Logo */}
        <div className="flex items-center gap-2 pr-5">
          {/* Ikona Menu */}
          <div className="block lg:hidden">
            <MenuMobile />
          </div>

          {/* Logo */}
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

        {/* Wyszukiwarka po prawej stronie */}
        <div className="flex-1">
          <CommandSearch />
        </div>
      </nav>
    </>
  );
}
