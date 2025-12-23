"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-md border-2 border-gray-200 rounded-lg">
          <CardContent className="px-6 py-8">
            <h1 className="text-xl font-semibold text-gray-900 mb-6">Polityka Prywatności</h1>
            <p className="text-lg text-gray-700 mb-4">
              Twoja prywatność jest dla nas ważna. Niniejsza Polityka Prywatności wyjaśnia, jak dbamy o Twoje dane, mimo że nie zbieramy żadnych danych osobowych w tej aplikacji.
            </p>

            <h2 className="text-sm font-semibold text-gray-800 mt-6">1. Informacje, które zbieramy</h2>
            <p className="text-xs text-gray-700 mb-4">
              Nasza aplikacja **nie zbiera żadnych danych osobowych** użytkowników. Nie używamy formularzy kontaktowych ani innych metod zbierania danych.
            </p>

            <h2 className="text-sm font-semibold text-gray-800 mt-6">2. Jak wykorzystujemy Twoje dane</h2>
            <p className="text-xs text-gray-700 mb-4">
              Ponieważ nie zbieramy żadnych danych osobowych, nie wykorzystujemy żadnych informacji do celów marketingowych, analitycznych ani innych.
            </p>

            <h2 className="text-sm font-semibold text-gray-800 mt-6">3. Jak chronimy Twoje dane</h2>
            <p className="text-xs text-gray-700 mb-4">
              Nasza aplikacja nie przetwarza żadnych danych osobowych, dlatego nie zachodzi konieczność stosowania szczególnych środków ochrony danych użytkowników. Niemniej jednak, stosujemy standardowe zabezpieczenia w celu zapewnienia bezpieczeństwa aplikacji.
            </p>

            <h2 className="text-sm font-semibold text-gray-800 mt-6">4. Pliki cookie</h2>
            <p className="text-xs text-gray-700 mb-4">
              **Nie używamy plików cookie** w naszej aplikacji. Żadne pliki cookie nie są ustawiane ani używane do śledzenia aktywności użytkowników.
            </p>

            <h2 className="text-sm font-semibold text-gray-800 mt-6">5. Zmiany w Polityce Prywatności</h2>
            <p className="text-xs text-gray-700 mb-4">
              Zastrzegamy sobie prawo do zmiany tej polityki, jeśli w przyszłości zdecydujemy się na wprowadzenie jakichkolwiek funkcji zbierających dane użytkowników. Każda zmiana będzie publikowana na tej stronie.
            </p>

            <div className="mt-6">
              <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg">
                <Link href="/">Przejdź do strony głównej</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
