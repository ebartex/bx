import Link from "next/link";
import React from "react";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import { MailIcon, MapPinIcon, PhoneCallIcon, RefreshCcwIcon, ShieldCheckIcon, TruckIcon, WalletIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback } from "@/components/ui/avatar";
const Footer = () => {
  return (
    <footer className="px-4">




      <div className='mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
        <div className='space-y-6 p-6 sm:border-e'>
          <div className='item-center flex justify-center'>
            <Avatar className='size-13'>
              <AvatarFallback className='bg-muted'>
                <TruckIcon className='size-7' />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='flex flex-col items-center gap-4'>
            <h6 className='text-xl font-semibold'>Transport</h6>
            <p className='text-center'>
              Zapewniamy transport z rozładunkiem naszych produktów szybko i bezpiecznie do Twoich drzwi, gwarantując satysfakcję.
            </p>
          </div>
        </div>
        <div className='space-y-6 p-6 max-sm:border-t md:border-e'>
          <div className='item-center flex justify-center'>
            <Avatar className='size-13'>
              <AvatarFallback className='bg-muted'>
                <WalletIcon className='size-7' />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='flex flex-col items-center gap-4'>
            <h6 className='text-xl font-semibold'>Płatność</h6>
            <p className='text-center'>
              Zapłać wygodnie kartą płatniczą, blikiem lub gotówką. Szybka i bezpieczna transakcja dla Twojej wygody.
            </p>
          </div>
        </div>
        <div className='space-y-6 p-6 max-md:border-t sm:max-md:col-span-2'>
          <div className='item-center flex justify-center'>
            <Avatar className='size-13'>
              <AvatarFallback className='bg-muted'>
                <RefreshCcwIcon className='size-7' />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='flex flex-col items-center gap-4'>
            <h6 className='text-xl font-semibold'>Zwrot towaru</h6>
            <p className='text-center'>
              Masz prawo do zwrotu towaru w ciągu 30 dni od daty zakupu bez podania przyczyny.
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 sm:py-16 md:py-24 lg:grid-cols-4 lg:px-8'>
        <div className='flex flex-col gap-8'>
          <a href='#'>
            
          </a>
          <div className='space-y-3'>
            <div className='flex items-start gap-2'>
              <MapPinIcon className='size-5 shrink-0' />
              <span>Gorzkowice 97-350, Przedborska 27</span>
            </div>
            <div className='flex items-center gap-2'>
              <PhoneCallIcon className='size-5 shrink-0' />
              <span>+48 44 6818 043</span>
            </div>
            <div className='flex items-center gap-2'>
              <MailIcon className='size-5 shrink-0' />
              <span>sklep@ebartex.pl</span>
            </div>
          </div>
        </div>

      </div>
      <Separator />
      <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 py-6 sm:px-6 lg:px-8'>
               Akceptujemy płatności:
        <Badge variant='outline' className='text-base font-normal'>
          <ShieldCheckIcon className='!size-4.5 text-green-600' /> Secure Payment
        </Badge>
 
    <Image width={32} height={16} src="/blik.svg" alt="BLIK" className="h-7"/>
    <Image width={32} height={16} src="/gotowka.svg" alt="Gotówka" className="h-6"/>
        
        <img src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/visa.png' alt='Visa' className='h-5' />
        <img src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/paypal.png' alt='Paypal' className='h-5' />
        <img src='https://cdn.shadcnstudio.com/ss-assets/brand-logo/master.png' alt='Mastercard' className='h-5' />
      </div>
      <Separator />
 

        <div className="text-neutral-900 text-xs mx-auto flex max-w-7xl justify-center px-4 py-6 sm:px-6 lg:px-8">
<p>&copy; {new Date().getFullYear()} Bartex - Materiały budowlane <span className="mx-2">•</span> <Link href="/" className="text-neutral-500 underline">Polityka prywatności</Link> <span className="mx-2">•</span> <Link href="/" className="text-neutral-500 underline">Adres kontaktowy</Link></p>
</div>
     




    </footer>
  );
};  

export default Footer;
