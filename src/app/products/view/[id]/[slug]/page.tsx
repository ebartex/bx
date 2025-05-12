import type { Metadata } from 'next'
import ProductPage from './Productpage';

type Props = {
  params: Promise<{ id: string; slug: string }>
}

// Funkcja generująca metadane
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Tworzymy pełny URL zapytania do API proxy (bez dodatkowego kodowania)
  const apiUrl = `https://www.bapi2.ebartex.pl/tw/index?tw-id=${id}`;

  try {
    // Wykonanie zapytania do API proxy z url bez kodowania
    const response = await fetch(`/api/proxy?url=${apiUrl}`, {
      method: 'GET',
    });

    const product = await response.json();
    console.log(product);

    if (product && product.length > 0) {
      return {
        title: product[0].nazwa,
      };
    } else {
      return {
        title: 'Produkt nie znaleziony',
      };
    }
  } catch (error) {
    console.error('Błąd przy pobieraniu produktu:', error);
    return {
      title: 'Błąd ładowania produktu',
    };
  }
}




export default function Page() {
  return <ProductPage />;
}
