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

export default function ItemCategoryLayout({ children }: LayoutProps) {
  const { id } = useParams();
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [parentCategory, setParentCategory] = useState<string | null>(null);
  const [grandparentCategory, setGrandparentCategory] = useState<string | null>(null); // Kategoria nadkategorii
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      fetch(`https://www.bapi2.ebartex.pl/xt/index?xt-id=${id}`)
        .then((res) => res.json())
        .then((data: Category[]) => {
          if (Array.isArray(data) && data.length > 0) {
            const currentCategory = data[0];
            setCategoryName(currentCategory.kod);

            // Jeśli istnieje kategoria nadrzędna, zapytaj o nią
            if (currentCategory.super) {
              fetch(`https://www.bapi2.ebartex.pl/xt/index?xt-id=${currentCategory.super}`)
                .then((res) => res.json())
                .then((parentData: Category[]) => {
                  if (Array.isArray(parentData) && parentData.length > 0) {
                    setParentCategory(parentData[0].kod);

                    // Jeśli istnieje kategoria nadkategorii, zapytaj o nią
                    if (parentData[0].super) {
                      fetch(`https://www.bapi2.ebartex.pl/xt/index?xt-id=${parentData[0].super}`)
                        .then((res) => res.json())
                        .then((grandparentData: Category[]) => {
                          if (Array.isArray(grandparentData) && grandparentData.length > 0) {
                            setGrandparentCategory(grandparentData[0].kod);
                          }
                        })
                        .catch((err) => {
                          console.error("Błąd pobierania kategorii nadkategorii:", err);
                        });
                    }
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
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const breadcrumbs = [
    { label: 'Strona główna', href: '/' },
    grandparentCategory ? { label: grandparentCategory, href: `/category/${grandparentCategory}` } : null, // Kategoria nadkategorii
    parentCategory ? { label: parentCategory, href: `/category/${parentCategory}` } : null, // Kategoria nadrzędna
    { label: categoryName || '', href: undefined }, // Ostatni element bez linku (aktywny)
  ].filter((breadcrumb): breadcrumb is { label: string; href: string | undefined } => breadcrumb !== null); // Filtrujemy null (jeśli brak jakiejkolwiek kategorii)

  const metadata = categoryName
    ? { title: `${categoryName} - Bartex Gorzkowice Sklep budowlany` }
    : { title: "Ładowanie..." };

  return (
    <>
      {/* Dodajemy meta dane do head */}
      <head>
        <meta name="description" content={categoryName ? `${categoryName} - Kategoria produktów` : "Ładowanie kategorii"} />
        <title>{metadata.title}</title>
      </head>

      <Breadcrumbs breadcrumbs={breadcrumbs} />
      
      {/* Tytuł kategorii */}
      {categoryName && (
        <h1 className="text-xl font-semibold text-zinc-800 ml-3 mt-3 mb-6">
          {categoryName}
        </h1>
      )}

      <div className="flex">
        {/* Menu boczne (widoczne tylko na większych ekranach) */}
        <div className="hidden lg:block">
          <MenuDesktop />
        </div>

        <div className="flex-1 sm:p-4">
          <div className="mb-4">
            {isLoading ? <p>Ładowanie...</p> : children}
          </div>
        </div>
      </div>
    </>
  );
}
