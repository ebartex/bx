'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import MenuDesktop from '@/components/layout/sidebar/MenuDesktop';

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

  return (
    <>
    
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
