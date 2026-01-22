"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-foreground">
      <div className="max-w-4xl mx-auto">
        <Card className="border-border rounded-lg shadow-none bg-card">
          <CardContent className="px-6 py-8">
            <h1 className="text-xl font-semibold mb-6">
              Polityka Prywatności
            </h1>

            <p className="text-base text-muted-foreground mb-4">
              Twoja prywatność jest dla nas ważna. Niniejsza Polityka Prywatności
              wyjaśnia, jak dbamy o Twoje dane, mimo że nie zbieramy żadnych danych
              osobowych w tej aplikacji.
            </p>

            <h2 className="text-sm font-semibold mt-6">
              1. Informacje, które zbieramy
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Nasza aplikacja <strong>nie zbiera żadnych danych osobowych</strong>{" "}
              użytkowników. Nie używamy formularzy kontaktowych ani innych metod
              zbierania danych.
            </p>

            <h2 className="text-sm font-semibold mt-6">
              2. Jak wykorzystujemy Twoje dane
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ponieważ nie zbieramy żadnych danych osobowych, nie wykorzystujemy
              żadnych informacji do celów marketingowych, analitycznych ani
              innych.
            </p>

            <h2 className="text-sm font-semibold mt-6">
              3. Jak chronimy Twoje dane
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Nasza aplikacja nie przetwarza żadnych danych osobowych, dlatego nie
              zachodzi konieczność stosowania szczególnych środków ochrony danych
              użytkowników. Niemniej jednak stosujemy standardowe zabezpieczenia
              w celu zapewnienia bezpieczeństwa aplikacji.
            </p>

            <h2 className="text-sm font-semibold mt-6">
              4. Pliki cookie
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              <strong>Nie używamy plików cookie</strong> w naszej aplikacji. Żadne
              pliki cookie nie są ustawiane ani używane do śledzenia aktywności
              użytkowników.
            </p>

            <h2 className="text-sm font-semibold mt-6">
              5. Zmiany w Polityce Prywatności
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Zastrzegamy sobie prawo do zmiany tej polityki, jeśli w przyszłości
              zdecydujemy się na wprowadzenie jakichkolwiek funkcji zbierających
              dane użytkowników. Każda zmiana będzie publikowana na tej stronie.
            </p>

            <div className="mt-8">
              <Button asChild size="lg">
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
