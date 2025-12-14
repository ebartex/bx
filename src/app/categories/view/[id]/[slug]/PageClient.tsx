'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter na stronie klienta
import Image from 'next/image';
import { PackageCheck, Clock, Info, Package, Squircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { slugify } from '@/utils/slugify';
import MenuDesktop from '@/components/layout/sidebar/MenuDesktop';

interface ProductPhoto {
  main_photo: number;
  photo_512: string;
}

interface Product {
  jm: string;
  zp: { data: string; id?: string }[];
  productphoto: ProductPhoto[];
  title: string;
  id: string;
  nazwa: string;
  sm?: { stanHandl?: string }[];
  cn?: { cena: string; cena1?: string; cena2?: string }[];
}

interface PageClientProps {
  products: Product[];
}

export default function PageClient({ products }: PageClientProps) {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const router = useRouter();

  const handleProductClick = (productId: string, slug: string) => {
    router.push(`/products/view/${productId}/${slug}`);
  };

  return (
    <div className="container mx-auto bg-white">
      <div className="flex">
        {/* Menu boczne (widoczne tylko na większych ekranach) */}
        <div className="hidden lg:block">
          <MenuDesktop />
        </div>

        <div className="flex-1 p-4">
          {/* Sprawdzanie, czy lista produktów jest pusta */}
          {products.length === 0 ? (
            <div className="text-center mt-10">
              <h2 className="text-xl font-semibold text-gray-700">Brak wyników</h2>
              <p className="text-gray-500">Nie znaleziono żadnych produktów, które pasują do Twojego zapytania.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-4">
              {products.map((product) => {
                const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
                const stanColor = stan === 0 ? 'text-red-700' : 'text-green-700';

                return (
                  <div
                    key={product.id}
                    className="border cursor-pointer border-slate-200 rounded-none p-4 relative"
                    onClick={() => handleProductClick(product.id, slugify(product.nazwa))}
                  >
                    {stan === 0 && product.zp.length > 0 && (
                      <div className="absolute top-0 right-0 p-2">
                        <Popover
                          open={openPopoverId === product.id}
                          onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? product.id : null)}
                        >
                          <PopoverTrigger onClick={(e) => e.stopPropagation()} asChild>
                            <PackageCheck className="ml-20 text-green-800 cursor-pointer" size={32} />
                          </PopoverTrigger>

                          <PopoverContent
                            side="top"
                            className="text-sm space-y-2 max-w-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenPopoverId(null);
                            }}
                          >
                            <div className="flex items-center gap-2 font-semibold text-gray-800">
                              <Info className="text-blue-600" size={18} />
                              <span>Produkt w zamówieniu</span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-700">
                              <Clock size={16} className="text-gray-600" />
                              <span>Data zamówienia: {product.zp[0].data}</span>
                            </div>

                            <div className="flex items-start gap-2 text-gray-600">
                              <Package size={16} className="mt-1 text-yellow-600" />
                              <span>
                                Produkt zostanie uzupełniony o <strong>stan magazynowy</strong> w ciągu kilku dni od daty zamówienia.
                              </span>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}

                    <div className="flex justify-center mb-4">
                      <Image
                        src={
                          product.productphoto.length > 0
                            ? `https://www.imgstatic.ebartex.pl/${product.productphoto.find((photo) => photo.main_photo === 1)?.photo_512 || ''}`
                            : '/product_512.png'
                        }
                        width={150}
                        height={150}
                        alt={product.nazwa}
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h2 className="text-sm text-zinc-800 font-normal mb-2">{product.nazwa}</h2>

                    {product.cn && product.cn.length > 0 && (product.cn[0].cena2 || product.cn[0].cena) ? (
                      <div className="text-lg text-slate-700 mb-2 text-right">
                        <span className="font-bold text-xl">
                          {Number(String(product.cn[0].cena2 || product.cn[0].cena).replace(',', '.'))
                            .toFixed(0)
                            .replace('.', ',')}
                          <sup className="text-sm custom-sup">
                            ,{Number(String(product.cn[0].cena2 || product.cn[0].cena).replace(',', '.')).toFixed(2).split('.')[1]}
                            zł
                            {product.cn[0].cena2
                              ? `/${product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_jm_Val || ''}`
                              : `/${product.jm || ''}`}
                          </sup>
                        </span>
                      </div>
                    ) : (
                      <div className="text-lg text-zinc-700 mb-2 text-right">
                        <span className="font-bold text-2xl">
                          0
                          <sup className="text-sm font-bold custom-sup">,00 zł</sup>
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 p-2 flex items-center">
                      <Squircle size={16} className={`${stanColor} fill-current mr-2`} />
                      <span className="text-sm">w magazynie</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
