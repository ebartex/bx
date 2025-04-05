'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Squircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Używamy nowej wersji useRouter z next/navigation

// Typy danych o produkcie
interface Product {
  id: number;
  nazwa: string;
  kod: string;
  kodpaskowy: string;
  jm: string;
  katalog: number;
  sm: { idtw: number; stanHandl?: number }[]; // Dodanie stanHandl jako opcjonalnego
  cn: { cena: number;}[];  // Tablica cn
  xt: { id:number; kod: string;}  // Tablica xt
  productphoto: { id: number; tw_id: number; photo_512: string; photo_256: string; photo_128: string; main_photo: number }[];
}

type ProductResponse = Product[]; // API zwraca tablicę produktów

const ProductPage = () => {
  const params = useParams<{ id: string; slug: string }>();
  const id = params.id;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Inicjalizujemy router

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

  // Wyświetlanie spinnera ładowania
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Wyświetlanie komunikatu o błędzie, jeśli nie udało się pobrać danych
  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // Wyświetlanie komunikatu, jeśli brak produktów
  if (products.length === 0) {
    return (
      <div className="text-center">
        <p>Produkt nie został znaleziony.</p>
      </div>
    );
  }

  // Funkcja do obsługi kliknięcia w nazwę kategorii
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/itemcategories/view/${categoryId}/test`); // Przekierowujemy do nowego URL
  };

  // Renderowanie szczegółów produktu, gdy dane są dostępne
  return (
    <>
      <div className="mx-auto p-2">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          {products.map((product) => {
            // Sprawdzamy, czy `product.sm` nie jest puste i przypisujemy domyślną wartość
            const stanHandl = product.sm?.[0]?.stanHandl ?? 0; // Ustawiamy wartość domyślną na 0, jeśli stanHandl jest null lub undefined

            // Określenie koloru statusu zapasów
            const stanColor =
              stanHandl === 0 ? "text-red-700" : "text-green-700"; // Kolor czerwony, gdy stanHandl === 0, w przeciwnym razie zielony

            return (
              <div key={product.id} className="w-full bg-white">
                <h1 
                  // Obsługuje kliknięcie w nazwę kategorii
                  className="text-md xs:text-sm sm:text-sm xl:text-xl font-normal xl:font-normal text-gray-900 mb-2"
                >
                  {product.nazwa}
                </h1>

                {/* Lewa strona: Obrazek produktu (wyśrodkowany na małych ekranach) */}
                <div className="xs:w-full flex justify-center">
                  {product.productphoto.length > 0 ? (
                    <Image
                      src={`https://www.imgstatic.ebartex.pl/${product.productphoto[0].photo_512}`}
                      alt={product.nazwa}
                      width={256} // Domyślny rozmiar dla małych ekranów
                      height={256} // Domyślny rozmiar dla małych ekranów
                      className="xs:w-64 xs:h-64 sm:w-64 sm:h-64 md:w-96 md:h-96"
                    />
                  ) : (
                    <div className="text-gray-500">Brak zdjęcia produktu</div>
                  )}
                </div>

                {/* Prawa strona: Szczegóły produktu (wyrównane do lewej na małych ekranach) */}
                <div className="md:w-1/2 flex flex-col items-start md:items-start">
                  <p className="text-sm mb-2">Kod: {product.kod}</p>
                  <p className="text-sm mb-2">Kod paskowy: {product.kodpaskowy}</p>
                  <p className="text-sm mb-4">Jednostka miary: {product.jm}</p>
                  <p className="text-sm mb-4">Cena: {product.cn[0]?.cena}</p>
                  <p className="text-sm mb-4 cursor-pointer" onClick={() => handleCategoryClick(product.xt?.id)} >Katalog: {product.xt?.kod}</p>
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Status zapasów */}
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
