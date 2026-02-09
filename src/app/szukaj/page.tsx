'use client';

import { Suspense } from "react";
import SearchResults from "./SearchResults";
import SearchHeader from "./SearchHeader";
import MenuDesktop from "@/components/layout/sidebar/_MenuDesktop";
import { Skeleton } from "@/components/ui/skeleton";

function SearchResultsSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-6 w-96 mb-4" />

      <div className="grid grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-none p-4 pb-10 relative bg-card"
          >
            <div className="flex justify-center mb-4">
              <Skeleton className="h-[150px] w-[150px]" />
            </div>
            <Skeleton className="h-4 w-[90%] mb-2" />
            <Skeleton className="h-4 w-[70%] mb-6" />
            <div className="flex justify-end">
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto">
      {/* 🔹 HEADER NAD SIDEBAR + WYNIKI */}
      <Suspense fallback={null}>
        <SearchHeader />
      </Suspense>

      {/* 🔹 DWIE KOLUMNY */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <MenuDesktop />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
