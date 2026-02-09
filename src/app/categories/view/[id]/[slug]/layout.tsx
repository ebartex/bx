// app/categories/view/[id]/[slug]/layout.tsx
import MenuDesktop from "@/components/layout/sidebar/_MenuDesktop";
import CategoryHeader from "./CategoryHeader";

export default async function CategoryViewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  return (
    <div className="bg-background text-foreground">
      {/* ✅ NAD SIDEBAR + CONTENT */}
      <CategoryHeader id={id} />

      <div className="flex">
        {/* Sidebar – raz */}
        <div className="hidden lg:block w-72 shrink-0">
          <MenuDesktop />
        </div>

        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
