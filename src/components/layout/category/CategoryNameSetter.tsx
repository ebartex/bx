"use client";

import { useEffect } from "react";
import { useCategory } from "./CategoryContext";

export default function CategoryNameSetter({
  name,
}: {
  name?: string;
}) {
  const { setName } = useCategory();

  useEffect(() => {
    // ustaw nazwę kategorii po wejściu
    setName(name);

    // wyczyść po wyjściu z kategorii
    return () => {
      setName(undefined);
    };
  }, [name, setName]);

  return null;
}
