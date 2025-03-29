// Navbar.tsx
"use client";
import Topbar from "../topbar/page";
import CommandSearch from "./CommandSearch";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
    <Topbar />
    <nav className="bg-white flex items-center"> {/* Ustaw stałą wysokość navbaru */}
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
    </>
  );
}
