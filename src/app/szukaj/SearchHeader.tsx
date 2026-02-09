'use client';

import { useSearchParams } from "next/navigation";

export default function SearchHeader() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  if (!query) return null;

  return (
    <h1 className="text-xl font-normal px-4 py-3">
      Wyniki wyszukiwania dla{" "}
      <span className="dark:font-bold font-medium">"{query}"</span>
    </h1>
  );
}
