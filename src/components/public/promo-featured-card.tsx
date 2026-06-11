"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import {
  MessageCircle,
  Download,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Timer,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn, formatDate, getWhatsAppUrl } from "@/lib/utils";

const LIFESTYLE_IMAGES = [
  "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&h=640&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583241800698-e8ab01830a09?w=900&h=640&q=85&auto=format&fit=crop",
];

const BENEFITS = [
  "Envío disponible en todo México",
  "Promoción por tiempo limitado",
  "Asesoría personalizada incluida",
];

interface Promotion {
  id: string;
  titleEs: string;
  titleEn: string | null;
  descriptionEs: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  endDate: string | null;
}

interface PromoFeaturedCardProps {
  promo: Promotion;
  locale: string;
  whatsappPhone: string;
}

export function PromoFeaturedCard({ promo, locale, whatsappPhone }: PromoFeaturedCardProps) {
  const t = useTranslations("promotions");

  const slides = [
    promo.imageUrl ?? LIFESTYLE_IMAGES[0],
    ...LIFESTYLE_IMAGES,
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    const id = setInterval(() => emblaApi.scrollNext(), 3800);
    return () => {
      clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const title = locale === "en" && promo.titleEn ? promo.titleEn : promo.titleEs;

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500"
      style={{ border: "1px solid rgba(215,168,79,0.25)" }}
    >
      <div className="grid md:grid-cols-2">

        {/* ── LEFT: Image slider ─────────────────────────────────────── */}
        <div className="relative overflow-hidden min-h-[300px] md:min-h-[460px]" style={{ background: "#f8f3ea" }}>
          <div className="overflow-hidden h-full absolute inset-0" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((src, i) => (
                <div key={i} className="flex-none w-full relative min-h-[300px] md:min-h-[460px]">
                  <Image
                    src={src}
                    alt={`${title} - imagen ${i + 1}`}
                    fill
                    priority={i === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08051f]/50 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          </div>

          {/* "Promoción Exclusiva" badge */}
          <div
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
            style={{ background: "linear-gradient(135deg, #c4922c, #f0d18a)", color: "#08051f" }}
          >
            <Sparkles className="w-3 h-3" />
            Promoción Exclusiva
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-4 h-4" style={{ color: "#15104a" }} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition-all duration-200"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="w-4 h-4" style={{ color: "#15104a" }} />
          </button>

          {/* Dot indicators */}
          {scrollSnaps.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Ir a imagen ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-200",
                    i === selectedIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Details ─────────────────────────────────────────── */}
        <div className="p-8 md:p-10 flex flex-col justify-between gap-6 bg-white">
          <div className="space-y-4">
            {/* "Oferta especial" chip */}
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border"
              style={{ background: "rgba(243,209,132,0.20)", color: "#15104a", borderColor: "rgba(215,168,79,0.35)" }}
            >
              <Sparkles className="w-3 h-3" style={{ color: "#d7a84f" }} />
              ¡Oferta especial!
            </span>

            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {title}
            </h3>

            {promo.descriptionEs && (
              <p className="text-gray-500 leading-relaxed line-clamp-4 text-sm md:text-base">
                {promo.descriptionEs}
              </p>
            )}

            {promo.endDate && (
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-sm px-4 py-2 rounded-2xl border border-amber-100">
                <Timer className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">
                  {t("expires")}{" "}
                  {formatDate(promo.endDate, locale === "en" ? "en-US" : "es-MX")}
                </span>
              </div>
            )}

            <ul className="space-y-2 pt-1">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "#d7a84f" }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {whatsappPhone && (
              <a
                href={getWhatsAppUrl(
                  whatsappPhone,
                  `Hola! Me interesa la promoción: ${title}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(34,197,94,0.30)] hover:shadow-[0_6px_24px_rgba(34,197,94,0.40)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                {t("inquire")}
              </a>
            )}
            {promo.pdfUrl && (
              <a
                href={promo.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl border-2 font-semibold hover:-translate-y-0.5 transition-all duration-200 text-sm"
                style={{ borderColor: "rgba(215,168,79,0.45)", color: "#15104a" }}
              >
                <Download className="w-4 h-4" />
                {t("download")}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
