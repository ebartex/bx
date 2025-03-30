'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';
import '@/styles/nprogress.css'; // Styl paska ładowania

// Konfiguracja NProgress
NProgress.configure({ showSpinner: false, speed: 700 });

export default function NProgressHandler() {
  const pathname = usePathname(); // Użycie usePathname do śledzenia zmiany ścieżki

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    }; 
    const handleStop = () => {
      NProgress.done();
    };

    // Rozpoczęcie i zakończenie ładowania przy każdej zmianie ścieżki
    handleStart();
    handleStop();
  }, [pathname]); // Zależność od zmiany ścieżki

  return null; // Komponent nie renderuje niczego
} 
 