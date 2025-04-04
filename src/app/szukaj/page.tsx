'use client';

import { Suspense } from "react";

import SearchResults from "./SearchResults";

import MenuDesktop from "@/components/layout/sidebar/MenuDesktop";

export default function SearchPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <MenuDesktop />

      {/* Main content */}
      <div className="flex-1">
        <Suspense fallback={<p className="text-gray-500">Ładowanie wyników...</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
