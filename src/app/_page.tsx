import MenuDesktop from '@/components/layout/sidebar/_MenuDesktop';
import Image from 'next/image';

export default function Home() {

  return (
    <>
      <div className="flex h-screen">
    
        {/* Komponent MenuDesktop widoczny na urządzeniach LG */}
        <div className="hidden lg:block w-1/5 bg-white ">
          <MenuDesktop />
        </div>
        {/* Zdjęcie zajmujące resztę dostępnej przestrzeni */}
        <div className="lg:flex-1">
          <div className="relative w-full"> {/* Zmieniamy wysokość zdjęcia na górę */}
            <Image
              alt="Zdjęcie"
              src="/pl_11736_20230905_114759.jpg"
              width={1146}
              height={430}
              className="object-contain w-full h-full" // Dopasowanie obrazu, zachowanie proporcji
            />
          </div>
        </div>
      </div>
    </>
  );
}