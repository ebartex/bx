'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Squircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Typy danych o produkcie
interface Product {
  id: number;
  nazwa: string;
  kod: string;
  kodpaskowy: string;
  jm: string;
  katalog: number;
  sm: { idtw: number; stanHandl?: number }[];
  cn: { cena: number;}[];
  xt: { id:number; kod: string;} 
  productphoto: { id: number; tw_id: number; photo_512: string; photo_256: string; photo_128: string; main_photo: number }[];
}

type ProductResponse = Product[];

const ProductPage = () => {
  const params = useParams<{ id: string; slug: string }>();
  const id = params.id;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Przygotowujemy pełny URL zapytania do API proxy
        const fullUrl = `https://www.bapi2.ebartex.pl/tw/index?tw-id=${id}`;

        // Wysyłamy zapytanie do API proxy, przekazując pełny URL
        const response = await fetch(`/api/proxy?url=${encodeURIComponent(fullUrl)}`, {
          method: "GET",
        });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center">
        <p>Produkt nie został znaleziony.</p>
      </div>
    );
  }

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/itemcategories/view/${categoryId}/test`);
  };

  return (
    <>
      <div className="mx-auto p-2">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {products.map((product) => {
            const stanHandl = product.sm?.[0]?.stanHandl ?? 0;
            const stanColor = stanHandl === 0 ? "text-red-700" : "text-green-700";

            return (
              <div key={product.id} className="w-full bg-white">
                <h1 className="text-md xs:text-sm sm:text-sm xl:text-xl font-normal xl:font-normal text-gray-900 mb-2">
                  {product.nazwa}
                </h1>

                <div className="xs:w-full flex justify-center">
                  {product.productphoto.length > 0 ? (
                    <Image
                      src={`https://www.imgstatic.ebartex.pl/${product.productphoto.find(photo => photo.main_photo === 1)?.photo_512 || product.productphoto[0]?.photo_512 || "product_512.png"}`}
                      alt={product.nazwa}
                      width={512}
                      height={512}
                      className="xs:w-64 xs:h-64 sm:w-64 sm:h-64 md:w-96 md:h-96"
                    />
                  ) : (
                    <Image
                      src="/product_512.png"
                      alt="Brak zdjęcia produktu"
                      width={512}
                      height={512}
                      className="xs:w-64 xs:h-64 sm:w-64 sm:h-64 md:w-96 md:h-96"
                    />
                  )}
                </div>

                <div className="md:w-1/2 flex flex-col items-start md:items-start">
                  {product.kod && <p className="text-sm mb-2">Kod: {product.kod}</p>}
                  {product.kodpaskowy && <p className="text-sm mb-2">Kod paskowy: {product.kodpaskowy}</p>}
                  {product.jm && <p className="text-sm mb-4">Jednostka miary: {product.jm}</p>}
                  {product.cn && product.cn[0]?.cena && <p className="text-sm mb-4">Cena: {product.cn[0].cena}</p>}

                  <p className="text-sm mb-4 cursor-pointer" onClick={() => handleCategoryClick(product.xt?.id)}>
                    Katalog: {product.xt?.kod}
                  </p>

                  <div className="flex items-center space-x-4 mb-4">
                    <Squircle size={16} className={`${stanColor} fill-current mr-2`} />
                    <span className="text-sm">w magazynie</span>
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
