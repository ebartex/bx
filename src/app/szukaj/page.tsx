'use client';

import { Suspense } from "react";

import SearchResults from "./SearchResults";
import Sidebar from "@/components/layout/sidebar/page";

export default function SearchPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <Suspense fallback={<p className="text-gray-500">Ładowanie wyników...</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
