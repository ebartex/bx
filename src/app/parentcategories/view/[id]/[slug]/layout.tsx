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
  super: string | null;
}

export default function CategoryLayout({ children }: LayoutProps) {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [parentCategory, setParentCategory] = useState<string | null>(null); // Kategoria nadrzędna
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Funkcja metadata do dynamicznego ustawiania tytułu
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Tworzymy pełny URL zapytania do API proxy
      const categoryUrl = `https://www.bapi2.ebartex.pl/xt/index?xt-id=${id}`;

      fetch(`/api/proxy?url=${encodeURIComponent(categoryUrl)}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data: Category[]) => {
          if (Array.isArray(data) && data.length > 0) {
            const currentCategory = data[0];
            setCategoryName(currentCategory.kod);

            // Jeżeli istnieje kategoria nadrzędna, zapytaj o nią
            if (currentCategory.super) {
              const parentCategoryUrl = `https://www.bapi2.ebartex.pl/xt/index?xt-id=${currentCategory.super}`;
              
              // Zapytanie do API proxy dla kategorii nadrzędnej
              fetch(`/api/proxy?url=${encodeURIComponent(parentCategoryUrl)}`, {
                method: "GET",
              })
                .then((res) => res.json())
                .then((parentData: Category[]) => {
                  if (Array.isArray(parentData) && parentData.length > 0) {
                    setParentCategory(parentData[0].kod);
                  }
                })
                .catch((err) => {
                  console.error("Błąd pobierania kategorii nadrzędnej:", err);
                });
            }
          }
        })
        .catch((err) => {
          console.error("Błąd pobierania kategorii:", err);
        })
        .finally(() => setIsLoading(false)); // Zakończenie ładowania
    }
  }, [id]);

  const breadcrumbs = [
    { label: 'Strona główna', href: '/' },
    parentCategory ? { label: parentCategory, href: `/parentcategory/${parentCategory}` } : null, // Kategoria nadrzędna
    { label: categoryName || '', href: undefined }, // Ostatni element bez linku (aktywny)
  ].filter((breadcrumb): breadcrumb is { label: string; href: string | undefined } => breadcrumb !== null); // Filtrujemy null (jeśli brak kategorii nadrzędnej)

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

      <Breadcrumbs breadcrumbs={breadcrumbs} />

      <div className="flex">
        {/* Menu boczne (widoczne tylko na większych ekranach) */}
        <div className="hidden lg:block">
          <MenuDesktop />
        </div>

        <div className="flex-1 p-4">
          {/* Zawartość strony (np. lista podkategorii) */}
          <div className="mb-4">
            {isLoading ? <p>Ładowanie...</p> : children}
          </div>
        </div>
      </div>
    </>
  );
}
