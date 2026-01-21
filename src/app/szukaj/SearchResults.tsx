'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Squircle, PackageCheck, Clock, Info, Package } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTw } from "../../../services/api/tw";
import { slugify } from "@/utils/slugify";
import { Product } from "../../../types/product";
import PriceLabel from "@/components/product/PriceLabel";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="border border-slate-200 rounded-none p-4 pb-10 relative">
          <div className="flex justify-center mb-4">
            <Skeleton className="h-[150px] w-[150px] rounded-md" />
          </div>

          <Skeleton className="h-4 w-[90%] mb-2" />
          <Skeleton className="h-4 w-[70%] mb-6" />

          <div className="flex justify-end">
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="absolute bottom-0 left-0 p-2 flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchResults() {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get('q') || '' : '';

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setOpenPopoverId(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenPopoverId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    const productUrl = `/tw/search?q=${encodeURIComponent(query)}`;

    getTw(productUrl)
      .then((data) => {
        if (Array.isArray(data)) setResults(data as Product[]);
        else setResults([]);
      })
      .catch((error) => {
        console.error('Błąd pobierania danych:', error);
        setError(error.message || "Nie udało się pobrać danych.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleProductClick = (productId: string, slug: string) => {
    router.push(`/products/view/${productId}/${slug}`);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-normal pl-4">
        Wyniki wyszukiwania dla <span className="font-medium">"{query}"</span>
      </h1>

      {error && <p className="text-red-500 p-4">{error}</p>}

      {/* Skeleton podczas ładowania */}
      {loading && <GridSkeleton />}

      {!loading && Array.isArray(results) && results.length > 0 ? (
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {results.map((product) => {
            const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
            const stanColor = stan === 0 ? "text-red-700" : "text-green-700";

            const title =
              product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa;

            return (
              <div
                key={product.id}
                className="bg-card text-card-foreground border border-muted rounded-none p-4 pb-10 relative cursor-pointer flex flex-col justify-between"
                onClick={() => handleProductClick(product.id, slugify(title))}
              >
                {(product as any).is_cheapest && (
                  <Badge
                    className="absolute top-2 right-2 h-5 min-w-5 rounded-full px-2 bg-yellow-500 text-primary dark:bg-orange-600 tabular-nums"
                    variant="secondary"
                  >
                    Najtańszy
                  </Badge>
                )}

                {stan === 0 && Array.isArray(product.zp) && product.zp.length > 0 && (
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
                        ? `https://www.imgstatic.ebartex.pl/${
                            product.productphoto.find((photo) => photo.main_photo === 1)?.photo_512 || ""
                          }`
                        : "/product_512.png"
                    }
                    width={150}
                    height={150}
                    alt={title}
                    className="mt-5 object-cover rounded-md"
                  />
                </div>

                <h2 className="text-sm text-zinc-800 font-normal mb-2">{title}</h2>

                {product.cn && product.cn.length > 0 && (product.cn[0].cena2 || product.cn[0].cena) ? (
                  (() => {
                    const cena = String(product.cn[0].cena2 || product.cn[0].cena);

                    const jednostka = product.cn[0].cena2
                      ? product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_jm_Val || ''
                      : product.jm || '';

                    return (
                      <div className="text-right">
                        <PriceLabel size="medium" price={cena} unit={jednostka} />
                      </div>
                    );
                  })()
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
      ) : (
        !loading && !error && <p className="text-gray-500 p-4">Brak wyników.</p>
      )}
    </div>
  );
}
