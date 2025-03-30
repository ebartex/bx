"use client";

import { Suspense } from "react";
import SearchResults from "./searchResults";


export default function SearchPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Ładowanie wyników...</p>}>
      <SearchResults />
    </Suspense>
  );
}
