import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../../../../../types/product";
import { Squircle } from "lucide-react";
import PriceLabel from "@/components/product/PriceLabel";
import { slugify } from "@/utils/slugify";
import ProductDescription from "./ProductDescription";

type ProductOverviewProps = {
  product: Product;
};

const ProductOverview = ({ product }: ProductOverviewProps) => {
  const stanHandl = product.sm?.[0]?.stanHandl ?? 0;

  // shadcn-friendly (bez hardcode): jest = primary, brak = destructive
  const stanColor = Number(stanHandl) === 0 ? "text-destructive" : "text-success";

  const descriptionHtml = product.tw_descriptions?.[0]?.description ?? "";

  const categoryId = product.xt?.id;
  const categoryName = product.xt?.kod;
  const categorySlug = slugify(categoryName);
  const categoryHref = categoryId ? `/categories/view/${categoryId}/${categorySlug}` : undefined;

  const imgSrc =
    product.productphoto?.length > 0
      ? `https://www.imgstatic.ebartex.pl/${
          product.productphoto.find((p) => p.main_photo === 1)?.photo_512 ||
          product.productphoto[0]?.photo_512 ||
          "product_512.png"
        }`
      : "/product_512.png";

  const imgAlt =
    product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa;

  return (
    <div className="w-full bg-card text-foreground">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Side - Image */}
          <div className="min-w-0">
            <Card className="border-border shadow-none rounded-none bg-card">
              <div className="p-3 sm:p-4">
                <Image
                  src={imgSrc}
                  alt={imgAlt}
                  width={512}
                  height={512}
                  sizes="(max-width: 768px) 100vw, 512px"
                  className="h-auto w-full max-w-[420px] object-contain mx-auto"
                />
              </div>
            </Card>
          </div>

          {/* Right Side */}
          <div className="min-w-0">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-normal">
                Kategoria:{" "}
                {categoryHref ? (
                  <Link
                    href={categoryHref}
                    className="hover:text-foreground transition-colors"
                  >
                    {categoryName}
                  </Link>
                ) : (
                  <span>{categoryName}</span>
                )}
              </p>

              <h1 className="text-xl font-normal tracking-wide text-foreground">
                {product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name ||
                  product.nazwa}
              </h1>

              {product.kodpaskowy?.trim() ? (
                <p className="text-sm text-muted-foreground font-normal">
                  EAN: <span className="font-medium text-foreground">{product.kodpaskowy}</span>
                </p>
              ) : null}
            </div>

            <div className="mt-4 space-y-4">
              {product.cn?.[0] &&
                (() => {
                  const cena = product.cn[0].cena2 || product.cn[0].cena;
                  const jednostka = product.cn[0].cena2
                    ? product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_jm_Val || ""
                    : product.jm || "";

                  return <PriceLabel size="large" price={cena} unit={jednostka} />;
                })()}
            </div>

            <div className="mt-4">
              <div className="flex items-center space-x-3">
                <Squircle size={16} className={`${stanColor} fill-current`} />
                <span className="text-sm text-foreground">
                  {Number(stanHandl) === 0 ? "brak w magazynie" : "w magazynie"}
                </span>
              </div>
            </div>

            {/* Opis */}
            <div className="mt-6 min-w-0">
              <ProductDescription html={descriptionHtml} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
