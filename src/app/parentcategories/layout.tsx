import MenuDesktop from '@/components/layout/sidebar/MenuDesktop';

export default function ParentcategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto bg-white">
      <div className="flex">
        {/* Sidebar – renderuje się RAZ */}
        <div className="hidden lg:block">
          <MenuDesktop />
        </div>

        {/* Zawartość dynamiczna */}
        <div className="flex-1 p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
