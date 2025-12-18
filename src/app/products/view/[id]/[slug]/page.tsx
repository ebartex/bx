import { getTw } from "../../../../../../services/api/tw";
import { Product } from "../../../../../../types/product";
import ProductClient from "./PageClient";


type PageProps = {
  params: Promise<{ id: string }>;
};


export async function generateMetadata({ params }: PageProps) {
  const { id } = await params; // Oczekujemy id produktu z params

  // Pobieramy dane produktu
  const result: Product[] = await getTw(`tw/index?tw-id=${id}`);

  // Sprawdzamy, czy produkt istnieje
  if (!result || result.length === 0) {
    return {
      title: "Produkt nie znaleziony",
      description: "Nie znaleziono informacji o produkcie."
    };
  }

  const product = result[0]; // Wybieramy pierwszy produkt z tablicy

  // Dynamicznie ustawiamy tytuł i opis na podstawie danych produktu
  return {
    title: `${product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa} Bartex Gorzkowice`, // Tytuł strony będzie nazwą produktu
    description: product.kod // Możesz dostosować opis, np. używając kodu produktu
  };
}
export default async function Page({ params }: PageProps) {

  const { id } = await params;


  const products: Product[] = await getTw(`/tw/index?tw-id=${id}`);
  const product = products[0];

  return <ProductClient product={product} />;
}