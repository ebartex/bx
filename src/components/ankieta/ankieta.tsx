"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { sendThemeVote } from "../../../services/api/themeVote";

type Choice = "light" | "dark" | "declined";
type Step = "question" | "thanks" | "done";

function generateId() {
  return "anon-" + Math.random().toString(36).substring(2) + Date.now();
}

function getAnonId() {
  let id = localStorage.getItem("anon-id");
  if (!id) {
    id = generateId();
    localStorage.setItem("anon-id", id);
  }
  return id;
}

export default function FeedbackBubble() {
  const [open, setOpen] = useState(false);
  const [storedChoice, setStoredChoice] = useState<Choice | null>(null);
  const [step, setStep] = useState<Step>("question");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme-survey") as Choice | null;

    // jeśli już było głosowanie/odmowa – nie pokazuj wcale
    if (stored) {
      setStoredChoice(stored);
      return;
    }

    // auto-open po wejściu (niedrażniąco)
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    setStep("question");
  };

  const finalizeAndHide = (v: Choice) => {
    localStorage.setItem("theme-survey", v);
    setStoredChoice(v); // dopiero teraz ukryjemy na stałe (if niżej)
    close();
    setStep("done");
  };

  const save = async (v: Choice) => {
    if (loading) return;

    try {
      setLoading(true);

      const anonId = getAnonId();

      // UWAGA: jeśli Twój endpoint jest /api/vote/theme, zmień tutaj:
      // const url = `${process.env.NEXT_PUBLIC_CAKE_API}/api/vote/theme`;
      const url = `/vote/theme`;

      await sendThemeVote(url, { anon_id: anonId, choice: v });

      // declined: bez podziękowania, po prostu schowaj
      if (v === "declined") {
        finalizeAndHide(v);
        return;
      }

      // light/dark: pokaż podziękowanie i dopiero potem schowaj
      setStep("thanks");
      window.setTimeout(() => finalizeAndHide(v), 1600);
    } catch (e) {
      console.error("Vote failed", e);
    } finally {
      setLoading(false);
    }
  };

  // Ukryj całkowicie dopiero po zapisaniu wyboru (po thanks lub declined)
  if (storedChoice) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        {/* Klik w dymek = toggle open/close (Radix/shadcn robi to za nas) */}
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-11 w-11 rounded-full shadow-lg"
            aria-label={open ? "Zamknij ankietę" : "Otwórz ankietę"}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          side="top"
          sideOffset={12}
          className="w-[320px] p-4"
        >
          <button
            type="button"
            onClick={close}
           className="absolute right-3 top-3 
  opacity-70 hover:opacity-100 transition cursor-pointer
  focus:outline-none focus:ring-0 focus-visible:ring-0
  focus:border-none"

            aria-label="Zamknij"
          >
            <X className="h-4 w-4" />
          </button>

          {step === "question" && (
            <>
              <div className="pr-6">
                <p className="text-sm font-medium">
                  Krótkie pytanie o wygląd strony
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Zajmie 2 sekundy — pomoże nam dobrać domyślny motyw.
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium">Który styl strony wolisz?</p>

                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    disabled={loading}
                    onClick={() => save("light")}
                  >
                    Jasny
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    disabled={loading}
                    onClick={() => save("dark")}
                  >
                    Ciemny
                  </Button>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => save("declined")}
                  className="cursor-pointer mt-3 w-full text-xs text-muted-foreground underline hover:text-foreground transition disabled:opacity-60"
                >
                  Nie teraz
                </button>
              </div>
            </>
          )}

          {step === "thanks" && (
            <div className="py-6 text-center">
              <p className="text-sm font-medium">✅ Dziękujemy za oddanie głosu!</p>
              <p className="text-xs text-muted-foreground mt-1">
                To pomaga nam dopasować wygląd strony.
              </p>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
