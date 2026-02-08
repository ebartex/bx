// categories.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Squircle } from "lucide-react";
import { slugify } from "@/utils/slugify";
import { Product } from "../../../../../../types/product";
import PriceLabel from "@/components/product/PriceLabel";
import { BadgeLowPrice } from "@/components/layout/ui/badgeLowPrice";

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
    <div className="flex-1 text-foreground">
      {products.length === 0 ? (
        <div className="text-center mt-10">
          <h2 className="text-xl font-semibold text-foreground">Brak wyników</h2>
          <p className="text-muted-foreground">
            Nie znaleziono żadnych produktów, które pasują do Twojego zapytania.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xl:grid-cols-4">
          {products.map((product) => {
            const stan = product.sm?.[0]?.stanHandl ? parseFloat(product.sm[0].stanHandl) : 0;
            const stanColor = stan === 0 ? "text-destructive" : "text-success";

            const title =
              product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name ||
              product.nazwa;

            const slug = slugify(title);

            const mainPhoto = product.productphoto?.find((p) => p.main_photo === 1)?.photo_512;
            const imgSrc =
              product.productphoto?.length > 0 && mainPhoto
                ? `https://www.imgstatic.ebartex.pl/${mainPhoto}`
                : "/product_512.png";

            const hasPrice =
              product.cn && product.cn.length > 0 && (product.cn[0].cena2 || product.cn[0].cena);

            const cena = hasPrice ? String(product.cn![0].cena2 || product.cn![0].cena) : "0";

            const jednostka = hasPrice
              ? product.cn![0].cena2
                ? product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_jm_Val || ""
                : product.jm || ""
              : "";

            return (
              <div
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => handleProductClick(product.id, slug)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleProductClick(product.id, slug);
                  }
                }}
                className="
                  bg-card text-card-foreground border border-border rounded-none
                  p-4 pb-10 relative cursor-pointer
                  transition-colors hover:bg-muted/50
                  flex flex-col justify-between
                "
              >
                {/* Badge – identycznie jak w SearchResults (bez wrappera, bez klas tutaj) */}
                {(product as any).is_cheapest && <BadgeLowPrice />}

                {/* Image */}
                <div className="flex justify-center mb-4">
                  <Image
                    src={imgSrc}
                    width={150}
                    height={150}
                    alt={title}
                    className="mt-5 object-cover rounded-xs"
                  />
                </div>

                {/* Title */}
                <h2 className="text-sm font-normal mb-2 text-foreground">{title}</h2>

                {/* Price – zawsze w tym samym miejscu (doklejone do dołu) */}
                <div className="mt-auto text-right">
                  {hasPrice ? (
                    <PriceLabel size="medium" price={cena} unit={jednostka} />
                  ) : (
                    <div className="text-lg text-muted-foreground">
                      <span className="font-bold text-2xl text-foreground">
                        0
                        <sup className="text-sm font-bold custom-sup">,00 zł</sup>
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div className="absolute bottom-0 left-0 p-2 flex items-center">
                  <Squircle size={14} className={`${stanColor} fill-current mr-2`} />
                  <span className="text-xs text-foreground">
                    {stan === 0 ? "brak w magazynie" : "w magazynie"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
