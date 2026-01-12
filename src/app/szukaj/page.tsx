'use client';

import { Suspense } from "react";
import SearchResults from "./SearchResults";
import MenuDesktop from "@/components/layout/sidebar/_MenuDesktop";
import { Skeleton } from "@/components/ui/skeleton";

function SearchResultsSkeleton() {
  return (
    <div className="container mx-auto bg-white">
      <div className="p-4">
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border border-slate-200 rounded-none p-4 pb-10 relative">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-[150px] w-[150px] rounded-md" />
            </div>

            <Skeleton className="h-4 w-[90%] mb-2" />
            <Skeleton className="h-4 w-[70%] mb-6" />

            <div className="flex justify-end">
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="absolute bottom-0 left-0 p-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-white">
        <MenuDesktop />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
