import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
  RefreshCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
  WalletIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Footer = () => {
  return (
    <footer className="px-4 bg-background text-foreground">
      {/* 3 kolumny benefitów */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <div className="space-y-6 p-6 sm:border-r border-border">
          <div className="flex justify-center">
            <Avatar className="h-13 w-13">
              <AvatarFallback className="bg-muted">
                <TruckIcon className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h6 className="text-xl font-semibold">Transport</h6>
            <p className="text-center text-muted-foreground">
              Zapewniamy transport z rozładunkiem naszych produktów szybko i bezpiecznie do Twoich
              drzwi, gwarantując satysfakcję.
            </p>
          </div>
        </div>

        <div className="space-y-6 p-6 max-sm:border-t md:border-r border-border">
          <div className="flex justify-center">
            <Avatar className="h-13 w-13">
              <AvatarFallback className="bg-muted">
                <WalletIcon className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h6 className="text-xl font-semibold">Płatność</h6>
            <p className="text-center text-muted-foreground">
              Zapłać wygodnie kartą płatniczą, blikiem lub gotówką. Szybka i bezpieczna transakcja
              dla Twojej wygody.
            </p>
          </div>
        </div>

        <div className="space-y-6 p-6 max-md:border-t sm:max-md:col-span-2 border-border">
          <div className="flex justify-center">
            <Avatar className="h-13 w-13">
              <AvatarFallback className="bg-muted">
                <RefreshCcwIcon className="h-7 w-7" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h6 className="text-xl font-semibold">Zwrot towaru</h6>
            <p className="text-center text-muted-foreground">
              Masz prawo do zwrotu towaru w ciągu 30 dni od daty zakupu bez podania przyczyny.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Sekcja kontaktowa (na razie jedna kolumna, ale grid zostawiłem) */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 sm:py-16 md:py-24 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-8">
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPinIcon className="h-5 w-5 shrink-0 text-foreground" />
              <span>Gorzkowice 97-350, Przedborska 27</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <PhoneCallIcon className="h-5 w-5 shrink-0 text-foreground" />
              <span>+48 44 6818 043</span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MailIcon className="h-5 w-5 shrink-0 text-foreground" />
              <span>sklep@ebartex.pl</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Płatności */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <span className="text-muted-foreground">Akceptujemy płatności:</span>

        <Badge variant="outline" className="text-base font-normal">
          <ShieldCheckIcon className="h-4 w-4 text-primary" /> Secure Payment
        </Badge>

        <Image width={32} height={16} src="/blik.svg" alt="BLIK" className="h-7 w-auto" />
        <Image width={32} height={16} src="/gotowka.svg" alt="Gotówka" className="h-6 w-auto" />

        <img
          src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/visa.png"
          alt="Visa"
          className="h-5"
        />
        <img
          src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/paypal.png"
          alt="Paypal"
          className="h-5"
        />
        <img
          src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/master.png"
          alt="Mastercard"
          className="h-5"
        />
      </div>

      <Separator />

      {/* Stopka prawna */}
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Bartex - Materiały budowlane
          <span className="mx-2">•</span>
          <Link href="/polityka-prywatnosci" className="underline hover:text-foreground">
            Polityka prywatności
          </Link>
          <span className="mx-2">•</span>
          <Link href="/" className="underline hover:text-foreground">
            Adres kontaktowy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
