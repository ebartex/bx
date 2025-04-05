// src/app/product/view/[id]/[slug]/page.tsx

import type { Metadata, ResolvingMetadata } from 'next'
import ProductPage from './Productpage';

type Props = {
  params: Promise<{ id: string; slug: string }>
}

// Funkcja generująca metadane
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Rozwiązujemy params (ponieważ jest to obiekt Promise)
  const { id } = await params
  
  // Pobieramy dane produktu z API
  const product = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-id=${id}`).then((res) => res.json())

  // Opcjonalnie - rozszerzamy metadane (np. openGraph) z metadanych rodzica
  const previousImages = (await parent).openGraph?.images || []
  
  return {
    title: product.nazwa,  // Dynamiczny tytuł na podstawie danych z API
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

// Importujemy nasz komponent ProductPage


export default function Page() {
  return <ProductPage />;
}
