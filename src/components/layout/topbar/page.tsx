// Navbar.tsx
"use client";

import { Mail, Phone } from "lucide-react";

export default function Topbar() {
  return (
    <nav className="flex bg-slate-100 text-slate-900 h-8 items-center justify-end text-sm w-full px-4">
      <div className="xl:w-[1200px] xl:mx-auto flex items-center justify-end">
        <Phone size={14} /> 
        <span className="pl-2 pr-4">44 6818 043</span> 
        <Mail size={14} /> 
        <span className="pl-2">sklep@ebartex.pl</span>
      </div>
    </nav>
  );
}
