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

  if (!categoryName && id) {
    const category = (await getXt(`xt/index?xt-id=${id}`)) as Category[];
    categoryName = category?.[0]?.kod;
  }

  if (!categoryName) return null;

  const first = categoryName[0];
  const rest = categoryName.slice(1);

  return (
    <div className="px-4 pt-2 pb-4">
      <h1 className="text-xl font-bold tracking-tight">
        {/* pierwsza litera z overlay */}
        <span className="relative inline-block">
          {/* bazowa litera */}
          <span className="dark:text-white text-slate-800">
            {first}
          </span>

          {/* czerwona litera – overlay */}
          <span
            aria-hidden
            className="
              pointer-events-none
              absolute
              left-[-0.09em]
              top-0
              text-red-600
              font-bold
              tracking-tight
              z-10
            "
          >
            {first}
          </span>
        </span>

        {/* reszta nazwy */}
        <span className="dark:text-white text-slate-800">
          {rest}
        </span>
      </h1>
    </div>
  );
}
