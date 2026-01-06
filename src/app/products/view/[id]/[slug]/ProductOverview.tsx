import { Card } from '@/components/ui/card'
import Image from "next/image";
import Link from "next/link";
import { Product } from '../../../../../../types/product'
import { Squircle } from 'lucide-react';
import PriceLabel from '@/components/product/PriceLabel';
import { slugify } from "@/utils/slugify";
import ProductDescription from './ProductDescription';

type ProductOverviewProps = {
  product: Product
}

const ProductOverview = ({ product }: ProductOverviewProps) => {
  console.log(product);
  const stanHandl = product.sm?.[0]?.stanHandl ?? 0;
  const stanColor = Number(stanHandl) === 0 ? "text-red-700" : "text-green-700";
  const descriptionHtml = product.tw_descriptions?.[0]?.description ?? "";
  // ====== dane kategorii ======
  const categoryId = product.xt?.id; // dostosuj jeśli inne pole
  const categoryName = product.xt?.kod;
  const categorySlug = slugify(categoryName);

  const categoryHref =
    categoryId
      ? `/categories/view/${categoryId}/${categorySlug}`
      : undefined;

  return (
    <div className='w-full bg-white'> 
      <div className="p-8">
        <div className='grid md:grid-cols-2 gap-8'>

          {/* Left Side - Image */}
          <div>
            <Card className="rounded-xs border-slate-100 shadow-none items-center">
              {product.productphoto.length > 0 ? (
                <Image
                  src={`https://www.imgstatic.ebartex.pl/${product.productphoto.find(photo => photo.main_photo === 1)?.photo_512 || product.productphoto[0]?.photo_512 || "product_512.png"}`}
                  alt={product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa}
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
            </Card>
          </div>

          {/* Right Side */}
          <div>
            <div className='space-y-2'>
              <p className='text-sm text-muted-foreground font-normal'>
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

              <h1 className="text-xl font-normal tracking-wide">
                {product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa}
              </h1>

              {product.kodpaskowy && product.kodpaskowy.trim() !== "" && (
                <p className="text-sm text-muted-foreground font-normal">
                  EAN: <span className="font-medium">{product.kodpaskowy}</span>
                </p>
              )}
            </div>

            <div className='space-y-4'>
              {product.cn && product.cn[0] && (() => {
                const cena = product.cn[0].cena2 || product.cn[0].cena;
                const jednostka = product.cn[0].cena2
                  ? (product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_jm_Val || '')
                  : (product.jm || '');

                return <PriceLabel size="large" price={cena} unit={jednostka} />;
              })()}
            </div>

            <div className='space-y-4'>
              <div className="flex items-center space-x-4 mb-4">
                <Squircle size={16} className={`${stanColor} fill-current mr-2`} />
                <span className="text-sm">w magazynie</span>
              </div>
            </div>
            <ProductDescription html={descriptionHtml} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductOverview;
