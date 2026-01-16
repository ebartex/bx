import MenuDesktop from "@/components/layout/sidebar/_MenuDesktop";

export default function ParentcategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto">
      <div className="flex">
        {/* Sidebar – stała szerokość */}
        <aside className="hidden lg:block w-72 shrink-0">
          <MenuDesktop />
        </aside>

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
