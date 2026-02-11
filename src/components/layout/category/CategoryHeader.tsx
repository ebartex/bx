"use client";

import { useCategory } from "./CategoryContext";


export default function CategoryHeader() {
  const { name } = useCategory();
  if (!name) return null;

  return (
    <div className="px-4 pt-2 pb-4">
      <h1 className="text-xl font-normal">
        <span className="dark:font-semibold font-medium">{name}</span>
      </h1>
    </div>
  );
}
