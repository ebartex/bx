// page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { getXt } from "../../../../../../services/api/xt";

import PageClient from "./PageClient";
import type { Product } from "../../../../../../types/product";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  params: Promise<{ id: string }>; // ✅ zostaje Promise
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const category = (await getXt(`xt/index?xt-id=${id}`)) as Product[];

  if (!category || category.length === 0) {
    return {
      title: "Kategoria nieznana",
      description: "Brak dostępnych danych dla tej kategorii.",
    };
  }

  const categoryName = category[0]?.kod || "Kategoria";
  return {
    title: `${categoryName} - Sklep budowlany Bartex`,
    description: `${categoryName} - Produkty dostępne w naszej ofercie.`,
  };
}

async function ProductsSection({ id }: { id: string }) {
  const productUrl = `tw/index?tw-katalog=${id}`;
  const products = (await getXt(productUrl)) as Product[];

  return <PageClient products={products} />;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // ✅ TU TEŻ MUSI być await

  return (
    <div className="container mx-auto bg-white">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsSection id={id} />
      </Suspense>
    </div>
  );
}




function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="border border-slate-200 p-4 flex flex-col gap-3"
        >
          {/* zdjęcie */}
          <Skeleton className="h-[150px] w-full rounded-md" />

          {/* nazwa */}
          <Skeleton className="h-4 w-3/4" />

          {/* cena */}
          <Skeleton className="h-6 w-1/2 ml-auto" />

          {/* stan magazynu */}
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
