import MenuDesktop from '@/components/layout/sidebar/_MenuDesktop';

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto">
      <div className="flex">
        {/* Sidebar – renderuje się RAZ */}
        <div className="hidden lg:block w-72 shrink-0">
          <MenuDesktop />
        </div>

        {/* Zawartość dynamiczna */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
