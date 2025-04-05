// src/app/product/view/[id]/[slug]/page.tsx

import type { Metadata } from 'next'
import ProductPage from './Productpage';

type Props = {
  params: Promise<{ id: string; slug: string }>
}

// Funkcja generująca metadane
export async function generateMetadata(
  { params }: Props,

): Promise<Metadata> {
  // Rozwiązujemy params (ponieważ jest to obiekt Promise)
  const { id } = await params
  
  // Pobieramy dane produktu z API
  const product = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-id=${id}`).then((res) => res.json())

  // Opcjonalnie - rozszerzamy metadane (np. openGraph) z metadanych rodzica

  
  return {
    title: product[0].nazwa,  // Dynamiczny tytuł na podstawie danych z API

  }
}

// Importujemy nasz komponent ProductPage


export default function Page() {
  return <ProductPage />;
}
