// Navbar.tsx
"use client";
import CommandSearch from "./CommandSearch";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white flex items-center h-20"> {/* Ustaw stałą wysokość navbaru */}
      {/* Obrazek */}
      <Image 
        src="/bartex.png" 
        alt="Logo" 
        width={100} 
        height={100} 
        className="mr-4" 
      />
      
      {/* InputSearchBox */}
      <CommandSearch />
    </nav>
  );
}
