import ProductPage from "./Productpage";

export interface PageProps {
  params: {
    id: string;
    slug: string;
  };
}

// (1) Dynamic metadata
export async function generateMetadata({ params }: PageProps) {
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

// (2) Strona renderowana serwerowo, ładuje komponent kliencki
export default function Page({ params }: PageProps) {
  return <ProductPage id={params.id} slug={params.slug} />;
}
