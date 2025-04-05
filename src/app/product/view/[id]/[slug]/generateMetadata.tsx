// src/app/product/view/[id]/[slug]/generateMetadata.ts

export async function generateMetadata({ params }: { params: { id: string; slug: string } }) {
    const res = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-id=${params.id}`);
    const data = await res.json();
  
    if (data && data.length > 0) {
      return {
        title: data[0].nazwa,  // tytuł na podstawie odpowiedzi z API
      };
    }
  
    return {
      title: "Produkt nie znaleziony", // Tytuł w przypadku braku produktu
    };
  }
  