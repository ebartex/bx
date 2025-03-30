"use client";

import { Suspense } from "react";
import SearchResults from "./SearchResults";



export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Ładowanie wyników...</p>}>
      <SearchResults />
    </Suspense>
  );
}
