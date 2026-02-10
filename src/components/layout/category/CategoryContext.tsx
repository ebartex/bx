"use client";

import { createContext, useContext, useState } from "react";

type CategoryContextType = {
  name?: string;
  setName: (name?: string) => void;
};

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export function CategoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [name, setName] = useState<string | undefined>(undefined);

  return (
    <CategoryContext.Provider value={{ name, setName }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error(
      "useCategory must be used inside <CategoryProvider>"
    );
  }

  return context;
}
