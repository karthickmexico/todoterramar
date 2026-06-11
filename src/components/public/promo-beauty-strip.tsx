"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface SliderImageItem {
  id: string;
  imageUrl: string;
  titleEs: string;
  titleEn: string | null;
  altTextEs: string | null;
  altTextEn: string | null;
  linkUrl: string | null;
}

interface PromoBeautyStripProps {
  images: SliderImageItem[];
  locale?: string;
}

export function PromoBeautyStrip({ images, locale = "es" }: PromoBeautyStripProps) {
  const slides = images.length < 6 ? [...images, ...images] : images;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", update);
    update();
    const id = setInterval(() => emblaApi.scrollNext(), 3200);
    return () => {
      clearInterval(id);
      emblaApi.off("select", update);
    };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className="relative group/strip">
      {/* Prev arrow */}
      <button
        onClick={scrollPrev}
        disabled={!canPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity duration-200 hover:scale-110 disabled:opacity-0 -translate-x-1"
        style={{
          background: "rgba(9,7,31,0.70)",
          border: "1px solid rgba(215,168,79,0.40)",
          backdropFilter: "blur(8px)",
        }}
        aria-label="Anterior"
      >
        <ChevronLeft className="w-4 h-4" style={{ color: "#d7a84f" }} />
      </button>

      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 py-2">
          {slides.map((slide, i) => {
            const alt =
              (locale === "en" && slide.altTextEn ? slide.altTextEn : slide.altTextEs) ??
              (locale === "en" && slide.titleEn ? slide.titleEn : slide.titleEs);

            const card = (
              <div
                className="flex-none w-36 h-36 sm:w-44 sm:h-44 relative rounded-2xl overflow-hidden group/card hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                style={{
                  border: "1px solid rgba(215,168,79,0.20)",
                  boxShadow: "0 4px 16px rgba(9,7,31,0.12)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(215,168,79,0.25)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(215,168,79,0.45)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(9,7,31,0.12)";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(215,168,79,0.20)";
                }}
              >
                <Image
                  src={slide.imageUrl}
                  alt={alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                  sizes="176px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300">
                  <span className="block text-[10px] font-semibold text-white text-center leading-tight drop-shadow">
                    {locale === "en" && slide.titleEn ? slide.titleEn : slide.titleEs}
                  </span>
                </div>
              </div>
            );

            return slide.linkUrl ? (
              <a
                key={`${slide.id}-${i}`}
                href={slide.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none"
              >
                {card}
              </a>
            ) : (
              <div key={`${slide.id}-${i}`} className="flex-none">
                {card}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next arrow */}
      <button
        onClick={scrollNext}
        disabled={!canNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/strip:opacity-100 transition-opacity duration-200 hover:scale-110 disabled:opacity-0 translate-x-1"
        style={{
          background: "rgba(9,7,31,0.70)",
          border: "1px solid rgba(215,168,79,0.40)",
          backdropFilter: "blur(8px)",
        }}
        aria-label="Siguiente"
      >
        <ChevronRight className="w-4 h-4" style={{ color: "#d7a84f" }} />
      </button>

      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: "linear-gradient(to right, #fafafa, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: "linear-gradient(to left, #fafafa, transparent)" }} />
    </div>
  );
}
