import MenuDesktop from "@/components/layout/sidebar/MenuDesktop";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex">
        {/* Komponent MenuDesktop widoczny na urządzeniach LG */}
        <div className="hidden lg:block">
          <MenuDesktop />
        </div>

        {/* Zdjęcie zajmujące resztę dostępnej przestrzeni */}
        <div className="p-6 lg:flex-1">
          <Image
            alt="Zdjęcie"
            src="/pl_11736_20230905_114759.jpg"
            width={1146}
            height={430}
            className="object-contain w-full h-full" // Dopasowanie obrazu, zachowanie proporcji
          />
        </div>
      </div>
    </>
  );
}
