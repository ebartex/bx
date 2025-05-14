"use client";

import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string; slug: string }>;
};

export default function ProductLayout({ children, params }: Props) {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const resolvedParams = await params;
      const apiUrl = `https://www.bapi2.ebartex.pl/tw/index?tw-id=${resolvedParams.id}`;

      try {
        const response = await fetch(`/api/proxy?url=${apiUrl}`, { method: 'GET' });
        const productData = await response.json();
        setProduct(productData[0] || { title: 'Produkt nie znaleziony' });
      } catch (error) {
        console.error('Błąd przy pobieraniu produktu:', error);
        setProduct({ title: 'Błąd ładowania produktu' });
      }
    };

    fetchProduct();
  }, [params]);

  return (
    <>
      {/* Only overrides title when product data is available */}
      {product && (
          <title>{product.nazwa || 'Produkt nie znaleziony'}</title>
      )}
      <main>{children}</main>
    </>
  );
}
