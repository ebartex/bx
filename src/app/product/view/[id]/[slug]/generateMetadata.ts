// src/app/product/view/[id]/[slug]/generateMetadata.ts

export async function generateMetadata({ params }: { params: { id: string; slug: string } }) {
  const res = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-id=${params.id}`);
  const data = await res.json();



  return {
    title: "Produkt nie znaleziony", // Tytuł w przypadku braku produktu
  };
}
