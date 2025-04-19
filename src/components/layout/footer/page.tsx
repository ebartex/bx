import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="px-4">

        <div className="text-neutral-900 text-xs py-4">
  <p className="text-neutral-700 text-xs py-4">Akceptujemy płatności</p>
  <div className="flex space-x-8">
    <img src="/visa.svg" alt="Visa" className="h-6"/>
    <img src="/mastercard.svg" alt="MasterCard" className="h-6"/>
    <img src="/blik.svg" alt="BLIK" className="h-6"/>
  </div>
</div>
<div className="text-neutral-900 text-xs py-4">
<p>&copy; {new Date().getFullYear()} Bartex - Materiały budowlane <span className="mx-2">•</span> <Link href="/" className="text-neutral-500 underline">Polityka prywatności</Link> <span className="mx-2">•</span> <Link href="/" className="text-neutral-500 underline">Adres kontatkowy</Link></p>
</div>

    </footer>
  );
};

export default Footer;
