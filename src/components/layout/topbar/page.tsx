// Topbar.tsx
"use client";

import ThemeToggle from "@/components/ui/theme-toggle";
import { Mail, Phone } from "lucide-react";


export default function Topbar() {
  return (
    <nav className="h-8 w-full text-sm
      bg-sidebar text-foreground
      "
    >
      <div className="xl:w-[1200px] xl:mx-auto flex h-full items-center justify-end gap-4 px-4">
        
        <div className="flex items-center">
          <Phone size={14} />
          <span className="pl-2 pr-4">44 6818 043</span>
        </div>

        <div className="flex items-center">
          <Mail size={14} />
          <span className="pl-2">sklep@ebartex.pl</span>
        </div>

        {/* PRZEŁĄCZNIK MOTYWU */}
        <ThemeToggle />
      </div>
    </nav>
  );
}
