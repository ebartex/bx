// page.tsx
import { Suspense } from "react";
import { getXt } from "../../../../../../services/api/xt"; // Zakładam, że masz odpowiedni serwis do pobierania danych
import { notFound } from "next/navigation"; // Zwraca 404, jeśli dane nie są dostępne
import PageClient from "./PageClient";
import { Metadata } from "next";

// Typ danych produktu
interface ProductPhoto {
  main_photo: number;
  photo_512: string;
}

interface Product {
  jm: string;
  zp: { data: string; id?: string }[];
  productphoto: ProductPhoto[];
  title: string;
  id: string;
  nazwa: string;
  sm?: { stanHandl?: string }[];
  cn?: { cena: string; cena1?: string; cena2?: string }[];
}

type PageProps = {
  params: Promise<{ id: string }>;
};

// Funkcja generująca metadane
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getXt(`xt/index?xt-id=${id}`);

  if (!category || category.length === 0) {
    return {
      title: "Kategoria nieznana",
      description: "Brak dostępnych danych dla tej kategorii.",
    };
  }

  // Generowanie tytułu i opisu na podstawie danych z kategorii
  const categoryName = category[0]?.kod || "Kategoria";
  return {
    title: `${categoryName} - Sklep budowlany Bartex`,
    description: `${categoryName} - Produkty dostępne w naszej ofercie.`,
  };
}


// Pobieranie danych po stronie serwera
export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Zapytanie do API o produkty
  const productUrl = `tw/index?tw-katalog=${id}`;
  const products: Product[] = await getXt(productUrl);





  return (
    <div className="container mx-auto">
      {/* Przekazujemy dane do klienta */}
      <Suspense fallback={<p className="text-gray-500">Ładowanie...</p>}>
        <PageClient products={products} />
      </Suspense>
    </div>
  );
}
