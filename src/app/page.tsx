'use client';


import ClientDialog from '@/components/cookies/ClientDialog';
import MenuDesktop from '@/components/layout/sidebar/MenuDesktop';
import { useEffect, useState } from 'react';
import Image from 'next/image';


export default function Home() {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowDialog(true); // Pokaż tylko jeśli nie ma zapamiętanej decyzji
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowDialog(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowDialog(false);
  };



  return (
    <>
      <div className="flex h-screen">
      
        {/* Komponent MenuDesktop widoczny na urządzeniach LG */}
        <div className="hidden lg:block w-1/4">
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
      <ClientDialog
        show={showDialog}
        onAccept={handleAccept}
        onReject={handleReject}
      /> 
    </>
  );
}


