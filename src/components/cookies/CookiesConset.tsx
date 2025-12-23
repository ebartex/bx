"use client";
import { CookieIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CookiesConsent = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(null); // Zmieniamy na null, żeby poczekać na wynik z localStorage
  const [showModal, setShowModal] = useState(false); // Stan do kontrolowania widoczności modala

  useEffect(() => {
    // Sprawdź, czy użytkownik już zaakceptował cookies
    const accepted = localStorage.getItem('cookiesAccepted');
    if (accepted === 'true') {
      setCookiesAccepted(true); // Ustawienie stanu po załadowaniu
    } else if (accepted === 'false') {
      setCookiesAccepted(false); // Jeśli nie zaakceptował, ustaw false
    }
  }, []);

  const handleAcceptCookies = () => {
    // Zapisz zgodę na cookies w localStorage
    localStorage.setItem('cookiesAccepted', 'true');
    setCookiesAccepted(true);
  };

  const handleRejectCookies = () => {
    // Zapisz odmowę zgody na cookies w localStorage
    localStorage.setItem('cookiesAccepted', 'false');
    setCookiesAccepted(false);
  };

  const handleManageCookies = () => {
    // Wywołaj modal do zarządzania cookies
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Zamknij modal
  };

  // Sprawdzamy, czy stan cookiesAccepted jest null, aby unikać renderowania przed załadowaniem
  if (cookiesAccepted === null) return null;

  // Jeśli zgoda została już udzielona lub odrzucona, nie renderujemy banera
  if (cookiesAccepted !== null) return null;

  return (
    <div className='bg-muted'>
      <Card className='fixed z-50 right-10 bottom-10 border-2 shadow-none sm:max-w-xl'>
        <CardContent className='flex gap-6 max-sm:flex-col'>
          <CookieIcon className='size-10.5 shrink-0 grow' />
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-medium'>Używamy plików cookie, aby poprawić Twoje doświadczenie!</h2>
            <p className='text-muted-foreground font-medium'>
              Klikając "Zezwól na wszystkie", wyrażasz zgodę na używanie wszystkich plików cookie. Odwiedź naszą{' '}
              <a href='#' className='text-primary'>
                Politykę cookies
              </a>{' '}
              aby dowiedzieć się więcej.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Button 
                size='lg' 
                className='rounded-lg text-base' 
                onClick={handleAcceptCookies}
              >
                Zezwól na wszystkie
              </Button>
              <Button
                size='lg'
                className='bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 rounded-lg text-base'
                onClick={handleManageCookies}
              >
                Zarządzaj cookie
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Zarządzania Cookies */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-medium mb-4">Zarządzaj plikami cookie</h2>
            <p className="mb-4">Wybierz, które pliki cookie chcesz zaakceptować:</p>
            <div className="flex gap-4 mb-4">
              <Button
                size="sm"
                className="bg-green-500 text-white hover:bg-green-600"
                onClick={() => {
                  localStorage.setItem('cookiesAccepted', 'true');
                  setCookiesAccepted(true);
                  setShowModal(false);
                }}
              >
                Akceptuj wszystkie
              </Button>
              <Button
                size="sm"
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => {
                  localStorage.setItem('cookiesAccepted', 'false');
                  setCookiesAccepted(false);
                  setShowModal(false);
                }}
              >
                Odrzuć wszystkie
              </Button>
            </div>
            <Button
              size="sm"
              className="bg-gray-500 text-white hover:bg-gray-600"
              onClick={handleCloseModal}
            >
              Zamknij
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookiesConsent;
