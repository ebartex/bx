import type { Metadata } from 'next'
import ProductPage from './Productpage';

type Props = {
  params: Promise<{ id: string; slug: string }>
}

// Funkcja generująca metadane
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Rozwiązujemy params (ponieważ jest to obiekt Promise)
  const { id } = await params;
  
  // Tworzymy pełny URL zapytania do API proxy
  const apiUrl = `https://www.bapi2.ebartex.pl/tw/index?tw-id=${id}`;

  try {
    // Wykonanie zapytania do API proxy
    const response = await fetch(`/api/proxy?url=${encodeURIComponent(apiUrl)}`, {
      method: 'GET',
    });

    // Sprawdzamy, czy odpowiedź jest poprawna
    const product = await response.json();

    // Zwracamy metadane na podstawie danych produktu
    if (product && product.length > 0) {
      return {
        title: product[0].nazwa,  // Dynamiczny tytuł na podstawie danych z API
      };
    } else {
      return {
        title: 'Produkt nie znaleziony',  // Tytuł, jeśli produkt nie istnieje
      };
    }
  } catch (error) {
    console.error('Błąd przy pobieraniu produktu:', error);
    return {
      title: 'Błąd ładowania produktu',  // Tytuł na wypadek błędu
    };
  }
}

export default function Page() {
  return <ProductPage />;
}
