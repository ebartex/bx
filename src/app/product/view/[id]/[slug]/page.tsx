"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Squircle } from "lucide-react";

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
      <div className="mx-auto p-2">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {products.map((product) => {
            // Determine stock status color
            const stanColor =
              product.sm[0].stanHandl === 0
                ? "text-red-700"
                : product.sm[0].stanHandl > 0 && product.sm[0].stanHandl <= 2
                ? "text-orange-500"
                : "text-green-700";

            return (
              <div key={product.id} className="w-full bg-white">
              <h1 className="
                text-sm xs:text-sm sm:text-sm xl:text-xl font-normal xl:font-bold text-gray-900 mb-2
              ">
                {product.nazwa}
              </h1>
                
                  {/* Left side: Product image (centered on small screens) */}
                  <div className="xs:w-full flex justify-center ">
                    {product.productphoto.length > 0 ? (
                      <Image
                        src={`https://www.imgstatic.ebartex.pl/${product.productphoto[0].photo_512}`}
                        alt={product.nazwa}
             
                        width={216}
                        height={216}
                      />
                    ) : (
                      <div className="text-gray-500">Brak zdjęcia produktu</div>
                    )}
                  </div>

                  {/* Right side: Product details (left-aligned on small screens) */}
                  <div className="md:w-1/2 flex flex-col items-start md:items-start">
                    <p className="text-sm mb-2">Kod: {product.kod}</p>
                    <p className="text-sm mb-2">Kod paskowy: {product.kodpaskowy}</p>
                    <p className="text-sm mb-4">Jednostka miary: {product.jm}</p>

                    <div className="flex items-center space-x-4 mb-4">
                      {/* Stock Status */}
                      <Squircle size={16} className={`${stanColor} fill-current mr-2`} />
                      <span className={`text-sm`}>w magazynie</span>
                    </div>
                  </div>
                
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
