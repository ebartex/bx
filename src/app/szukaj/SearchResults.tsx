//searchresults.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Squircle, PackageCheck, Clock, Info, Package } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Skeleton } from "@/components/ui/skeleton";
import { getTw } from "../../../services/api/tw";
import { slugify } from "@/utils/slugify";
import { Product } from "../../../types/product";
import PriceLabel from "@/components/product/PriceLabel";
import { BadgeLowPrice } from "@/components/layout/ui/badgeLowPrice";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-none p-4 pb-10 relative bg-card text-card-foreground"
        >
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
  const query = searchParams ? searchParams.get("q") || "" : "";

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setOpenPopoverId(null);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenPopoverId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
        console.error("Błąd pobierania danych:", error);
        setError(error.message || "Nie udało się pobrać danych.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleProductClick = (productId: string, slug: string) => {
    router.push(`/products/view/${productId}/${slug}`);
  };

  return (
    <div className="container mx-auto bg-background text-foreground">
      <h1 className="text-xl font-normal pl-4">
        Wyniki wyszukiwania dla <span className="font-medium">"{query}"</span>
      </h1>

      {error && <p className="text-destructive p-4">{error}</p>}

      {loading && <GridSkeleton />}

      {!loading && Array.isArray(results) && results.length > 0 ? (
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {results.map((product) => {
            const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;

            // shadcn tokens
            const stanColor = stan === 0 ? "text-destructive" : "text-success";

            const title =
              product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name ||
              product.nazwa;

            const slug = slugify(title);

            const imgPath =
              product.productphoto?.length > 0
                ? product.productphoto.find((photo) => photo.main_photo === 1)?.photo_512 ||
                  product.productphoto[0]?.photo_512 ||
                  ""
                : "";

            const imgSrc = imgPath
              ? `https://www.imgstatic.ebartex.pl/${imgPath}`
              : "/product_512.png";

            return (
              <div
                key={product.id}
                className="
                  bg-card text-card-foreground border border-border rounded-none
                  p-4 pb-10 relative cursor-pointer flex flex-col justify-between
                  transition-colors hover:bg-muted/50
                "
                onClick={() => handleProductClick(product.id, slug)}
              >
                {(product as any).is_cheapest && (
                  <BadgeLowPrice/>
                )}



                <div className="flex justify-center mb-4">
                  <Image
                    src={imgSrc}
                    width={150}
                    height={150}
                    alt={title}
                    className="mt-5 object-cover rounded-xs"
                  />
                </div>

                <h2 className="text-sm font-normal mb-2 text-foreground">{title}</h2>

                {product.cn && product.cn.length > 0 && (product.cn[0].cena2 || product.cn[0].cena) ? (
                  (() => {
                    const cena = String(product.cn[0].cena2 || product.cn[0].cena);

                    const jednostka = product.cn[0].cena2
                      ? product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_jm_Val || ""
                      : product.jm || "";

                    return (
                      <div className="text-right">
                        <PriceLabel size="medium" price={cena} unit={jednostka} />
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-lg text-muted-foreground mb-2 text-right">
                    <span className="font-bold text-2xl text-foreground">
                      0
                      <sup className="text-sm font-bold custom-sup">,00 zł</sup>
                    </span>
                  </div>
                )}

<div className="absolute bottom-0 left-0 right-0 p-2 min-h-[56px] flex flex-col justify-center">
  <div className="flex items-center">
    <Squircle size={16} className={`${stanColor} fill-current mr-2`} />
    <span className="text-xs text-foreground">
      {stan === 0 ? "brak w magazynie" : "w magazynie"}
    </span>
  </div>

  <div className="h-[16px] mt-1">
    {stan === 0 && Array.isArray(product.zp) && product.zp.length > 0 ? (
<span className="text-xs ml-6 text-muted-foreground leading-tight">
  <span className="font-medium text-foreground">dostawa</span> w toku
</span>

    ) : null}
  </div>
</div>


              </div>
            );
          })}
        </div>
      ) : (
        !loading &&
        !error && <p className="text-muted-foreground p-4">Brak wyników.</p>
      )}
    </div>
  );
}