// app/categories/view/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageClient from "./PageClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getXt } from "../../../../../../services/api/xt";
import { Category } from "../../../../../../types/category";
import { Product } from "../../../../../../types/product";

type PageProps = {
  params: Promise<{ id: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const category = (await getXt(`xt/index?xt-id=${id}`)) as Category[];

  if (!category || category.length === 0) {
    return {
      title: "Kategoria nieznana",
      description: "Brak dostępnych danych dla tej kategorii.",
    };
  }

  const categoryName = category[0]?.kod || "Kategoria";
  return {
    title: `${categoryName} - Sklep budowlany Bartex Gorzkowice Kamieńsk Rozprza`,
    description: `${categoryName} - Produkty dostępne w naszej ofercie.`,
  };
}

function buildTwKatalogParam(ids: string[]) {
  const clean = ids
    .map(String)
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));
  if (clean.length === 0) return null;
  return `(${clean.join(",")})`;
}

async function ProductsSection({ id }: { id: string }) {
  const subCategories = (await getXt(`/xt/index?Xt-super=${id}`)) as Category[];

  if (Array.isArray(subCategories) && subCategories.length > 0) {
    const ids = subCategories.map((c) => String(c.id));
    const katalogParam = buildTwKatalogParam(ids);
    if (!katalogParam) notFound();

    const productUrl = `tw/index?tw-katalog=${katalogParam}`;
    const products = (await getXt(productUrl)) as Product[];

    return <PageClient products={products ?? []} />;
  }

  const productUrl = `tw/index?tw-katalog=${id}`;
  const products = (await getXt(productUrl)) as Product[];

  return <PageClient products={products ?? []} />;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto bg-background text-foreground">
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsSection id={id} />
      </Suspense>
    </div>
  );
}

/**
 * ✅ Skeleton dopasowany 1:1 do PageClient cards:
 * - brak gap w grid (tak jak w PageClient)
 * - te same "krawędzie": border-r border-b, shadow-sm, p-4, rounded-none
 * - obrazek wycentrowany i 150x150 + mb-4
 * - title mb-2
 * - price wyrównane do prawej
 * - stock absolutnie na dole -> rezerwujemy miejsce pb-8
 * - badge absolutnie top-2 right-2
 */
function ProductsSkeleton() {
  const cardClass = `
    relative
    border-r border-b border-border shadow-sm
    bg-card text-card-foreground
    rounded-noneexport default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsSection id={id} />
    </Suspense>
  );
}

    p-4
  `;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={`${cardClass} pb-8`}>
          {/* badge placeholder */}
 

          {/* image placeholder */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-[150px] w-[150px] rounded-none" />
          </div>

          {/* title placeholder */}
          <div className="mb-2 space-y-2">
            <Skeleton className="h-4 w-[90%] rounded-none" />
            <Skeleton className="h-4 w-[70%] rounded-none" />
          </div>

          {/* price placeholder (right) */}
          <div className="text-right">
            <Skeleton className="ml-auto h-8 w-28 rounded-none" />
          </div>

          {/* stock placeholder (bottom-left) */}
          <div className="absolute bottom-0 left-0 p-2 flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-none" />
            <Skeleton className="h-3 w-24 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
