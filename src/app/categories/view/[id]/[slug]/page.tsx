import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getXt } from "../../../../../../services/api/xt";
import { Category } from "../../../../../../types/category";
import { Product } from "../../../../../../types/product";
import { Skeleton } from "@/components/ui/skeleton";
import PageClient from "./PageClient";
import CategoryNameSetter from "@/components/layout/category/CategoryNameSetter";

type PageProps = {
  params: Promise<{ id: string; slug: string }>;
};

function buildTwKatalogParam(ids: string[]) {
  const clean = ids
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);

  return clean.length ? `(${clean.join(",")})` : null;
}

async function ProductsSection({ id }: { id: string }) {
  const subCategories = (await getXt(`/xt/index?Xt-super=${id}`)) as Category[];

  if (Array.isArray(subCategories) && subCategories.length > 0) {
    const ids = subCategories.map((c) => String(c.id));
    const katalogParam = buildTwKatalogParam(ids);
    if (!katalogParam) notFound();

    const products = (await getXt(
      `tw/index?tw-katalog=${katalogParam}`
    )) as Product[];

    return <PageClient products={products ?? []} />;
  }

  const products = (await getXt(`tw/index?tw-katalog=${id}`)) as Product[];
  return <PageClient products={products ?? []} />;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const category = (await getXt(`xt/index?xt-id=${id}`)) as Category[];
  const categoryName = category?.[0]?.kod;

  return (
    <>
      <CategoryNameSetter name={categoryName} />

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsSection id={id} />
      </Suspense>
    </>
  );
}

/**
 * ✅ Skeleton dopasowany 1:1 do PageClient cards:
 * - brak gap w grid (tak jak w PageClient)
 * - border-r border-b, rounded-none, p-4, pb-10
 * - obrazek 150x150 wycentrowany + mb-4
 * - title mb-2 (2 linie)
 * - cena po prawej
 * - stock absolutnie na dole + miejsce na "dostawa w toku"
 */
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="
            relative
            bg-card text-card-foreground
            border-b border-r border-background
            rounded-none
            p-4 pb-10
          "
        >
          {/* image */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-[150px] w-[150px] rounded-none" />
          </div>

          {/* title */}
          <div className="mb-2 space-y-2">
            <Skeleton className="h-4 w-[90%] rounded-none" />
            <Skeleton className="h-4 w-[70%] rounded-none" />
          </div>

          {/* price */}
          <div className="mt-auto text-right">
            <Skeleton className="ml-auto h-8 w-28 rounded-none" />
          </div>

          {/* stock only */}
          <div className="absolute bottom-0 left-0 right-0 p-2 min-h-[40px] flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-none" />
            <Skeleton className="h-3 w-24 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
}

