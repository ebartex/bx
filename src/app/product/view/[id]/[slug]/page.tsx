"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


// Definicja typu produktu
interface Product {
  id: string;
  nazwa: string;
}
type ProductResponse = Product[]; // API zwraca tablicę obiektów

const ProductPage = () => {
  const params = useParams<{ id: string; slug: string }>();
  const id = params.id;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://www.bapi2.ebartex.pl/tw/index?tw-id=${id}`
        );
        const data: ProductResponse = await response.json();

        if (data.length > 0) {
          setProducts(data);
        } else {
          setError("Produkt nie znaleziony");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Błąd podczas pobierania danych produktu");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Jeśli dane są ładowane, wyświetlamy spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">

      </div>
    );
  }

  // Jeśli wystąpił błąd, wyświetlamy komunikat o błędzie
  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Jeśli produkt nie został znaleziony
  if (products.length === 0) {
    return (
      <div className="text-center">
        <p>Produkt nie został znaleziony.</p>
      </div>
    );
  }

  // Renderowanie produktów, gdy dane są dostępne
  return (
    <>

    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {products.map((product) => (
          <div key={product.id} className="w-full md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.nazwa}</h1>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              Dodaj do koszyka
            </button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default ProductPage;
