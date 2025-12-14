// app/product/[id]/ProductClient.tsx
"use client";


import { Button } from "@/components/ui/button";
import { Product } from "../../../../../../types/product";
import ProductOverview from "./ProductOverview";



type ProductClientProps = {
  product: Product;
};

export default function ProductClient({ product }: ProductClientProps) {

 return (
    <>
      <ProductOverview product={product} />
    </>
  );
}