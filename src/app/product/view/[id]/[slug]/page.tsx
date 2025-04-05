// src/app/product/view/[id]/[slug]/page.tsx

import ProductPage from "./Productpage";

// Funkcja generująca metadane (w tym tytuł strony)
export async function generateMetadata({ params }: { params: { id: string; slug: string } }) {
  const res = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-id=${params.id}`);
  const data = await res.json();

  if (data && data.length > 0) {
    return {
      title: data[0].nazwa,  // Dynamiczny tytuł na podstawie danych z API
    };
  }

  return {
    title: "Produkt nie znaleziony",  // Tytuł w przypadku braku produktu
  };
}

// Importujemy nasz komponent ProductPage


export default function Page() {
  return <ProductPage />;
}
