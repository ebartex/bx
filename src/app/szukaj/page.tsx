'use client';

import { Suspense } from "react";

import SearchResults from "./SearchResults";

import MenuDesktop from "@/components/layout/sidebar/MenuDesktop";

export default function SearchPage() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="bg-white">
      <MenuDesktop />
</div>
      {/* Main content */}
      <div className="flex-1">
        <Suspense fallback={<p className="text-gray-500"></p>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
