import ProductPage from "./Productpage";

// (1) Dynamic metadata
export async function generateMetadata(params: { id: string; slug: string }) {
  const res = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-id=${params.id}`);
  const data = await res.json();

  if (data && data.length > 0) {
    return {
      title: data[0].nazwa,
    };
  }

  return {
    title: "Produkt nie znaleziony",
  };
}

// (2) Renderowanie strony
export default function Page() {
  return <ProductPage />;
}