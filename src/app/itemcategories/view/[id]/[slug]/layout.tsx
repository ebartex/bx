'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MenuDesktop from '@/components/layout/sidebar/MenuDesktop';
import Breadcrumbs from '@/components/layout/breadcrumbs/page';

interface LayoutProps {
  children: ReactNode;
}

interface Category {
  kod: string;
}

export default function ItemCategoryLayout({ children }: LayoutProps) {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState<string | null>(null);

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

  // Funkcja metadata do dynamicznego ustawiania tytułu
  const metadata = categoryName
    ? { title: `${categoryName} - Moja Strona` }
    : { title: "Ładowanie..." };
    const breadcrumbs = [
        { label: 'Strona główna', href: '/' },
        { label: 'Blacha', href: '/category' },
        { label: 'Blacha czarna łez', href: undefined }, // Ostatni element nie ma linku
      ];
  return (
    <>
    
    <div>
      
    <Breadcrumbs breadcrumbs={breadcrumbs} />
    </div>
      {/* Dodajemy meta dane do head */}
      <head>
        <meta name="description" content={categoryName ? `${categoryName} - Kategoria produktów` : "Ładowanie kategorii"} />
        <title>{metadata.title}</title>
      </head>
      
      {/* Tytuł kategorii */}
      {categoryName && (
        <h1 className="text-xl font-semibold text-zinc-800 mb-6">
          {categoryName}
        </h1>
      )}

      <div className="flex">
        
        <div className="hidden lg:block">
          
          <MenuDesktop />
        </div>

        <div className="flex-1 sm:p-4">
          <div className="mb-4">
            
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
