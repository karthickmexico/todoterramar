import React from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FaqSectionProps {
  locale: string;
}

export function FaqSection({ locale }: FaqSectionProps) {
  const t = useTranslations("faq");
  const faqKeys = ["what", "howJoin", "investment", "earnings", "independent"] as const;

  return (
    <section className="section bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full border mb-4"
            style={{ background: "rgba(243,209,132,0.20)", color: "#15104a", borderColor: "rgba(215,168,79,0.35)" }}
          >
            <HelpCircle className="w-3.5 h-3.5" style={{ color: "#d7a84f" }} />
            Preguntas frecuentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t("title")}</h2>
          <p className="text-gray-500 text-lg">{t("subtitle")}</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqKeys.map((key, i) => (
            <AccordionItem
              key={key}
              value={`item-${i}`}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 overflow-hidden hover:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-800 hover:no-underline hover:text-[#15104a] py-5 text-base">
                {t(`items.${key}.q`)}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-5 text-sm">
                {t(`items.${key}.a`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
