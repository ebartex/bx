// app/products/view/[id]/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { getTw } from "../../../../../../services/api/tw";
import type { Product } from "../../../../../../types/product";
import ProductClient from "./PageClient";
import { Skeleton } from "@/components/ui/skeleton";
import { slugify } from "@/utils/slugify";

type PageProps = {
  params: Promise<{ id: string }>;
};

const SITE = "https://www.ebartex.pl";
const IMG_CDN = "https://www.imgstatic.ebartex.pl/";

function pickGtin(ean?: string) {
  const v = (ean ?? "").trim().replace(/\s+/g, "");
  if (!/^\d+$/.test(v)) return null;

  if (v.length === 8) return { gtin8: v };
  if (v.length === 12) return { gtin12: v };
  if (v.length === 13) return { gtin13: v };
  if (v.length === 14) return { gtin14: v };

  return null;
}

function parsePrice(raw: unknown): string | undefined {
  if (raw === null || raw === undefined) return undefined;

  if (typeof raw === "number") {
    return Number.isFinite(raw) && raw > 0 ? String(raw) : undefined;
  }

  const s = String(raw).trim();
  if (!s) return undefined;

  const cleaned = s
    .replace(/\s+/g, "")
    .replace(/zł|pln/gi, "")
    .replace(",", ".");

  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return undefined;

  return String(n);
}

function productImages(product: Product): string[] {
  const photos = (product as any).productphoto ?? [];
  if (!Array.isArray(photos) || photos.length === 0) {
    return [`${SITE}/product_512.png`];
  }

  const main = photos.find((p: any) => Number(p?.main_photo) === 1) ?? photos[0];
  const path = main?.photo_512 || photos[0]?.photo_512 || "product_512.png";
  const url = path.startsWith("http") ? path : `${IMG_CDN}${path}`;

  return [url];
}

function availabilityFromStock(product: Product) {
  const stanHandl = (product as any).sm?.[0]?.stanHandl ?? 0;
  const inStock = Number(stanHandl) > 0;
  return inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const result = (await getTw(`tw/index?tw-id=${id}`)) as Product[];

  if (!result || result.length === 0) {
    return {
      title: "Produkt nie znaleziony",
      description: "Nie znaleziono informacji o produkcie.",
      robots: { index: false },
    };
  }

  const product = result[0];

  const name =
    product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name ||
    product.nazwa ||
    `Produkt ${id}`;

  const canonical = `${SITE}/products/view/${id}/${slugify(name)}`;

  return {
    title: `${name} Bartex Gorzkowice`,
    description: (product.xt?.kod ?? product.kod ?? "Produkt") as string,
    alternates: { canonical },
  };
}

// async section
async function ProductSection({ id }: { id: string }) {
  const products = (await getTw(`/tw/index?tw-id=${id}`)) as Product[];
  const product = products?.[0];

  if (!product) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">Produkt nie znaleziony.</p>
      </div>
    );
  }

  const name =
    product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name ||
    product.nazwa ||
    `Produkt ${id}`;

  const slug = slugify(name);
  const canonical = `${SITE}/products/view/${id}/${slug}`;

  const image = productImages(product);

  const ean = (product as any).kodpaskowy ?? "";
  const gtinObj = pickGtin(ean);

  const cenaRaw = (product as any).cn?.[0]?.cena2 ?? (product as any).cn?.[0]?.cena;
  const price = parsePrice(cenaRaw);

  const availability = availabilityFromStock(product);

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url: canonical,
    image,
    ...(gtinObj ?? {}),
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "PLN",
      ...(price ? { price } : {}),
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (!price) delete schema.offers;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductClient product={product} />
    </>
  );
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
    <div className="w-full bg-card text-foreground">
      <div className="p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="border border-border rounded-none shadow-none flex items-center justify-center p-4 bg-card">
              <Skeleton className="h-[320px] w-[320px] max-w-full" />
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-10/12" />
            <Skeleton className="h-4 w-40" />

            <div className="pt-2">
              <Skeleton className="h-10 w-44" />
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
