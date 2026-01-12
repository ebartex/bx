// PageClient.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Używamy useRouter z next/navigation
import { ChevronDown } from 'lucide-react'; // Ikona rozwijania
import { Category } from '../../../../../../types/category';
import MenuDesktop from '@/components/layout/sidebar/_MenuDesktop';
import { slugify } from '@/utils/slugify';


interface PageClientProps {
  subCategories: Category[]; // Lista podkategorii
}

export default function PageClient({ subCategories }: PageClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Funkcja do obsługi kliknięcia w podkategorię
  const handleSubCategoryClick = (subCategoryId: string, slug: string) => {
    router.push(`/categories/view/${subCategoryId}/${slug}`); // Przekierowanie do strony podkategorii
  };

  return (

      <div className="flex-1 p-4">
      <div className={`mb-4 overflow-auto ${subCategories.length > 2 ? 'h-100' : 'h-auto'}`}>
        {subCategories.length > 0 ? (
          subCategories.map((subCategory) => (
            <div
              key={subCategory.id}
              onClick={() => handleSubCategoryClick(subCategory.id, slugify(subCategory.kod))} // Obsługuje kliknięcie
              className="rounded-none flex items-center justify-between cursor-pointer hover:bg-gray-100 p-2 border rounded-md transition w-full"
            >
              <span className="text-xs text-gray-800">{subCategory.kod}</span>
              <ChevronDown className="text-gray-500" />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Brak podkategorii</p>
        )}
      </div>
      </div>

  );
}
