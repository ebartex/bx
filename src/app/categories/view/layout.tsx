// app/categories/view/layout.tsx
import { CategoryProvider } from "@/components/layout/category/CategoryContext";
import CategoryHeader from "@/components/layout/category/CategoryHeader";
import MenuDesktop from "@/components/layout/sidebar/_MenuDesktop";



export default function CategoriesViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CategoryProvider>
      <div className="container mx-auto bg-background text-foreground">
        {/* HEADER NAD SIDEBAR + CONTENT */}
        <CategoryHeader />

        <div className="flex">
          <div className="hidden lg:block w-72 shrink-0">
            <MenuDesktop />
          </div>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </CategoryProvider>
  );
}
