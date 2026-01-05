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

  // usuń spacje, "zł"/"PLN", zamień przecinek na kropkę
  const cleaned = s
    .replace(/\s+/g, "")
    .replace(/zł|pln/gi, "")
    .replace(",", ".");

  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return undefined;

  return String(n);
}

const SITE = "https://www.ebartex.pl";
const CDN = "https://www.imgstatic.ebartex.pl/"; // jeśli masz inne, podmień

function toAbsUrl(u?: string) {
  if (!u) return null;
  const v = u.trim();
  if (!v) return null;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("//")) return `https:${v}`;
  if (v.startsWith("/")) return `${SITE}${v}`;
  return `${CDN}${v}`;
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

  const slug = slugify(name);
  const canonical = `${SITE}/products/view/${id}/${slug}`;

  return {
    title: `${name} Bartex Gorzkowice`,
    description: (product.kod ?? "Produkt") as string,
    alternates: {
      canonical,
    },
  };
}

// ✅ osobna sekcja async — tu dzieje się await, więc Suspense ma sens
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

  // ====== dane do schema ======
  const category =
    (product as any).kategoria ??
    product.s_t_elements?.[0]?.product_classification?.[0]?.CDim_shop_name;

  const ean = (product as any).kodpaskowy ?? (product as any).ean ?? "";
  const gtinObj = pickGtin(ean);

  // cena — podmień pola jeśli masz inne
  const price = parsePrice(
    (product as any).cena ?? (product as any).price ?? (product as any).cena_brutto
  );

  // obrazki — podmień źródła jeśli masz inne
  const imagesRaw =
    (product as any).images ??
    (product as any).photos ??
    (product as any).zdjecia ??
    (product as any).galeria ??
    [];

  const image = Array.isArray(imagesRaw)
    ? imagesRaw
        .map((x: any) =>
          toAbsUrl(typeof x === "string" ? x : x?.url || x?.src || x?.path)
        )
        .filter(Boolean)
    : [toAbsUrl(imagesRaw)].filter(Boolean);

  // ====== schema.org Product ======
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    url: canonical,
    ...(image.length ? { image } : {}),
    ...(category ? { category } : {}),
    ...(product.kod ? { sku: product.kod } : {}),
    ...(gtinObj ?? {}),
  };

  // Offer dodajemy TYLKO jeśli mamy cenę (żeby Google nie krzyczał o missing price)
  if (price) {
    schema.offers = {
      "@type": "Offer",
      priceCurrency: "PLN",
      price,
      availability: "https://schema.org/InStock", // jeśli masz stan, zmapuj logicznie
      itemCondition: "https://schema.org/NewCondition",
      url: canonical,
    };
  }

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
