"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
// Define product type based on the provided API schema
interface Product {
  id: number;
  nazwa: string;
  kod: string;
  kodpaskowy: string;
  jm: string;
  katalog: number;
  sm: { idtw: number; stanHandl: number }[];
  productphoto: { id: number; tw_id: number; photo_512: string; photo_256: string; photo_128: string; main_photo: number }[];
}
type ProductResponse = Product[]; // API returns an array of products

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

  // Display loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Display error message if there's an issue fetching data
  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Display message if no products are found
  if (products.length === 0) {
    return (
      <div className="text-center">
        <p>Produkt nie został znaleziony.</p>
      </div>
    );
  }

  // Render product details when data is available
  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {products.map((product) => (
            <div key={product.id} className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
              <div className="flex justify-center mb-4">
                {/* Check if there are any product photos */}
                {product.productphoto.length > 0 ? (
                  <Image
                    src={`https://www.imgstatic.ebartex.pl/${product.productphoto[0].photo_512}`}
                    alt={product.nazwa}
                    className="w-full max-w-md h-auto rounded-lg"
                    width={216}
                    height={216}
                  />
                ) : (
                  <div className="text-gray-500">Brak zdjęcia produktu</div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nazwa}</h1>
              <p className="text-xl text-gray-700 mb-2">Kod: {product.kod}</p>
              <p className="text-xl text-gray-700 mb-2">Kod paskowy: {product.kodpaskowy}</p>
              <p className="text-lg text-gray-600 mb-4">Jednostka miary: {product.jm}</p>

              <div className="flex items-center space-x-4 mb-4">
                {/* Stock Status */}
                <p className="text-lg text-green-600 font-semibold">
                  {product.sm[0].stanHandl > 0 ? `${product.sm[0].stanHandl} szt. dostępne` : "Brak na stanie"}
                </p>
              </div>

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
