'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cpu, Globe, Shield } from 'lucide-react'; // Importing additional icons from lucide-react

interface ClientDialogProps {
  show: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export default function ClientDialog({ show, onAccept, onReject }: ClientDialogProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (show) {
      setOpen(true);
    }
  }, [show]);

  const handleAccept = () => {
    document.cookie = `accepted_cookies=true; path=/; max-age=${60 * 60 * 24 * 365}`;
    setOpen(false);
    onAccept(); // Powiedz rodzicowi
  };

  const handleReject = () => {
    document.cookie = `accepted_cookies=false; path=/; max-age=${60 * 60 * 24 * 365}`;
    setOpen(false);
    onReject(); // Powiedz rodzicowi
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-center z-200"> {/* Set z-index here */}
          {/* Center the logo */}
          <div className="flex justify-center mb-2 mt-2">
            <Image src="/bartex.png" alt="Bartex Logo" width={120} height={120} priority />
          </div>

        <DialogHeader>
          <DialogTitle className="text-xl text-center font-normal mt-2">
            Zgoda na wykorzystanie twoich danych w tych celach:
          </DialogTitle>
          <div className="mt-6 text-left mx-3">
          <ul className="list-disc space-y-2">
            <li className="flex items-center gap-2 text-xs">
              <Cpu size={16} /> Optymalizacja wydajności strony
            </li>
            <li className="flex items-center gap-2 text-xs">
              <Globe size={16} /> Personalizacja treści i reklam
            </li>
            <li className="flex items-center gap-2 text-xs">
              <Shield size={16} /> Zwiększenie bezpieczeństwa danych
            </li>
          </ul>
        </div>
          <DialogDescription className="text-sm mt-4 text-xs">
            Korzystamy z plików cookies, aby zapewnić najlepsze doświadczenie na stronie. 
            Jeśli zgadzasz się na ich użycie, możemy dostarczać ci spersonalizowane treści, ulepszać działanie witryny,
            zapewniać lepszą wydajność, a także poprawiać bezpieczeństwo i komfort korzystania z witryny.
          </DialogDescription>
        </DialogHeader>


        
        {/* Buttons container */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          {/* Modify the accept button to change its color */}
          <Button 
            onClick={handleAccept} 
            className="flex items-center gap-2 bg-sky-800 cursor-pointer text-white hover:bg-sky-800"
          >
            Ok, wszystko w porządku
          </Button>            
          <Button variant="outline" onClick={handleReject} className="flex cursor-pointer  items-center gap-2">
            Nie zgadzam się
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
