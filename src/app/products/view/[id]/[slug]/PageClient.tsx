// app/product/[id]/ProductClient.tsx
"use client";



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