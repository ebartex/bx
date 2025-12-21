// app/products/view/[id]/page.tsx (przykładowa ścieżka)
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTw } from "../../../../../../services/api/tw";
import type { Product } from "../../../../../../types/product";
import ProductClient from "./PageClient";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const result = (await getTw(`tw/index?tw-id=${id}`)) as Product[];

  if (!result || result.length === 0) {
    return {
      title: "Produkt nie znaleziony",
      description: "Nie znaleziono informacji o produkcie.",
    };
  }

  const product = result[0];

  return {
    title: `${product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name || product.nazwa} Bartex Gorzkowice`,
    description: product.kod ?? "Produkt",
  };
}

// ✅ osobna sekcja async — tu dzieje się await, więc Suspense ma sens
async function ProductSection({ id }: { id: string }) {
  const products = (await getTw(`/tw/index?tw-id=${id}`)) as Product[];
  const product = products?.[0];

  // opcjonalnie: obsługa braku produktu
  if (!product) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Produkt nie znaleziony.</p>
      </div>
    );
  }

  return <ProductClient product={product} />;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductSection id={id} />
    </Suspense>
  );
}

function ProductSkeleton() {
  return (
    <div className="w-full bg-white">
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* obrazek */}
          <div>
            <div className="border border-slate-100 shadow-none rounded-none flex items-center justify-center p-4">
              <Skeleton className="h-[320px] w-[320px] max-w-full" />
            </div>
          </div>

          {/* prawa strona */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />      {/* kod / kategoria */}
            <Skeleton className="h-7 w-10/12" />   {/* nazwa */}
            <Skeleton className="h-4 w-40" />      {/* kod paskowy */}

            <div className="pt-2">
              <Skeleton className="h-10 w-44" />   {/* cena */}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-9/12" />
              <Skeleton className="h-4 w-7/12" />
              <Skeleton className="h-4 w-8/12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
