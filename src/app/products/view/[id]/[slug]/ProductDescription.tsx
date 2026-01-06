// src/components/product/ProductDescriptionAccordion.tsx
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  html?: string | null;
  title?: string;
  defaultOpen?: boolean;
};

export default function ProductDescriptionAccordion({
  html,
  title = "Opis produktu",
  defaultOpen = true,
}: Props) {
  const safeHtml = (html ?? "").trim();
  if (!safeHtml) return null;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "desc" : undefined}
      className="w-full space-y-2 mt-6"
    >
      <AccordionItem
        value="desc"
      
      >
        <AccordionTrigger
          className="
            bg-accent px-5 py-3 text-sm font-medium rounded-none
          "
        >
          {title}
        </AccordionTrigger>

        <AccordionContent className="px-5 pt-4 pb-5">
          <div
            className="
              text-sm text-muted-foreground leading-6
              max-w-none

              [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mb-3
              [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2
              [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-2

              [&_p]:mb-3

              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3
              [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3
              [&_li]:mb-1

              [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4
              [&_th]:border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left
              [&_td]:border [&_td]:px-3 [&_td]:py-2
            "
            dangerouslySetInnerHTML={{ __html: safeHtml }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
