// layout.tsx

'use client';

import { ReactNode } from 'react';


import MenuDesktop from '@/components/layout/sidebar/MenuDesktop';

interface LayoutProps {
  children: ReactNode; // Zawartość strony (komponenty, tekst itp.)
}

export default function ItemCategoryLayout({ children }: LayoutProps) {


  return (
    <div className="flex">
      {/* Menu boczne (widoczne tylko na większych ekranach) */}
      <div className="hidden sm:block">
        <MenuDesktop />
      </div>

      <div className="flex-1 p-4">
        {/* Zawartość strony (np. lista produktów) */}
        <div className="mb-4">

          {children}
        </div>
      </div>
    </div>
  );
}
