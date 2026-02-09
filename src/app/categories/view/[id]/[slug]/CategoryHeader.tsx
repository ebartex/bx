// app/categories/view/[id]/CategoryHeader.tsx
import { getXt } from "../../../../../../services/api/xt";
import { Category } from "../../../../../../types/category";

type CategoryHeaderProps = {
  /** Gotowa nazwa kategorii (ZALECANE) */
  name?: string;
  /** Fallback – id kategorii, jeśli name nie jest podane */
  id?: string;
};

export default async function CategoryHeader({
  name,
  id,
}: CategoryHeaderProps) {
  let categoryName = name;

  // fallback: pobieramy nazwę po id tylko jeśli trzeba
  if (!categoryName && id) {
    const category = (await getXt(`xt/index?xt-id=${id}`)) as Category[];
    categoryName = category?.[0]?.kod;
  }

  if (!categoryName) return null;

  return (
    <div className="px-4 pt-2 pb-4">
      <h1 className="text-xl font-normal text-foreground">
        <span className="dark:font-semibold font-medium">{categoryName}</span>
      </h1>
    </div>
  );
}
