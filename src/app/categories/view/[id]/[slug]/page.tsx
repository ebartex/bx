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
  // tylko cyfry, bez syfu
  const clean = ids.map(String).map((s) => s.trim()).filter((s) => /^\d+$/.test(s));
  if (clean.length === 0) return null;
  return `(${clean.join(",")})`; // (1,2,3)
}

async function ProductsSection({ id }: { id: string }) {
  // 1) próbujemy jako parent: pobierz podkategorie
  const subCategories = (await getXt(`/xt/index?Xt-super=${id}`)) as Category[];

  // 2) jeśli są podkategorie → robimy produkty ze wszystkich podkategorii
  if (Array.isArray(subCategories) && subCategories.length > 0) {
    const ids = subCategories.map((c) => String(c.id));
    const katalogParam = buildTwKatalogParam(ids);
    if (!katalogParam) notFound();

    const productUrl = `tw/index?tw-katalog=${katalogParam}`;
    const products = (await getXt(productUrl)) as Product[];

    return <PageClient products={products ?? []} />;
  }

  // 3) jeśli nie ma podkategorii → zwykła kategoria
  const productUrl = `tw/index?tw-katalog=${id}`;
  const products = (await getXt(productUrl)) as Product[];

  return <PageClient products={products ?? []} />;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto">
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
        <div key={i} className="border border-slate-200 p-4 flex flex-col gap-3">
          <Skeleton className="h-[150px] w-full rounded-md" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2 ml-auto" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}
