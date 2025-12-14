// page.tsx
import { Suspense } from 'react';
import { getXt } from '../../../../../../services/api/xt'; // Serwis do pobierania danych
import { notFound } from 'next/navigation'; // Zwraca 404, jeśli dane nie są dostępne
import PageClient from './PageClient';
import { Category } from '../../../../../../types/category';

// Typ danych podkategorii
interface SubCategory {
  kod: string;
  id: string;
  photo_512: string; // Link do zdjęcia podkategorii
}

type PageProps = {
  params: Promise<{ id: string }>;
};

// Funkcja generująca metadane
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const category = await getXt(`xt/index?xt-id=${id}`) as Category[];

  if (!category || category.length === 0) {
    return {
      title: 'Kategoria nieznana',
      description: 'Brak dostępnych danych dla tej kategorii.',
    };
  }

  const categoryName = category[0]?.kod || 'Kategoria';
  return {
    title: `${categoryName} - Moja Strona`,
    description: `${categoryName} - Produkty dostępne w naszej ofercie.`,
  };
}

// Pobieranie danych po stronie serwera
export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Zapytanie do API o podkategorie
  const apiUrl = `/xt/index?Xt-super=${id}`;
  const subCategories: Category[] = await getXt(apiUrl) as Category[];

  if (!subCategories || subCategories.length === 0) {
    notFound(); // Jeśli brak wyników, zwróć 404
  }

  return (
    <div className="container mx-auto">
      {/* Przekazujemy dane do klienta */}
      <Suspense fallback={<p className="text-gray-500">Ładowanie...</p>}>
        <PageClient subCategories={subCategories} />
      </Suspense>
    </div>
  );
}
