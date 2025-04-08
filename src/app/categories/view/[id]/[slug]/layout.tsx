// layout.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import MenuDesktop from '@/components/layout/sidebar/MenuDesktop';

interface LayoutProps {
  children: ReactNode; // Zawartość strony (komponenty, tekst itp.)
}
interface Category {
  kod: string;
}
export default function CategoryLayout({ children }: LayoutProps) {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  // Funkcja metadata do dynamicznego ustawiania tytułu
  useEffect(() => {
    if (id) {
      fetch(`https://www.bapi2.ebartex.pl/xt/index?xt-id=${id}`)
        .then((res) => res.json())
        .then((data: Category[]) => {
          if (Array.isArray(data) && data.length > 0) {
            setCategoryName(data[0].kod);
          }
        })
        .catch((err) => {
          console.error("Błąd pobierania kategorii:", err);
        });
    }
  }, [id]);



  const metadata = categoryName
    ? { title: `${categoryName} - Moja Strona` }
    : { title: "Ładowanie..." };


        return (
           <>
          {/* Dodajemy meta dane do head */}
          <head>
        <meta name="description" content={categoryName ? `${categoryName} - Kategoria produktów` : "Ładowanie kategorii"} />
        <title>{metadata.title}</title>
      </head>
 
    <div className="flex">
      {/* Menu boczne (widoczne tylko na większych ekranach) */}
      <div className="hidden lg:block">
        <MenuDesktop />
      </div>

      <div className="flex-1 p-4">
        {/* Zawartość strony (np. lista podkategorii) */}
        <div className="mb-4">

          {children}
        </div>
      </div>
    </div>
    </>
  );
}
