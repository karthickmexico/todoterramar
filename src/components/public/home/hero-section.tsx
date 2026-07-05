"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { getWhatsAppUrl } from "@/lib/utils";

interface SliderImage {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  imageFit?: string | null;
  imagePosition?: string | null;
  titleEs: string;
  titleEn: string | null;
  subtitleEs?: string | null;
  subtitleEn?: string | null;
  altTextEs: string | null;
  altTextEn: string | null;
  linkUrl: string | null;
  ctaTextEs?: string | null;
  ctaTextEn?: string | null;
}

interface HeroSectionProps {
  locale: string;
  sliderImages?: SliderImage[];
  whatsappPhone?: string;
}

// Single branded fallback — shown only when no banners exist in the DB.
// Replace by adding real banners in /admin/banners-inicio.
const FALLBACK_SLIDES: SliderImage[] = [
  {
    id: "fb-brand",
    imageUrl: "",
    titleEs: "Bienvenido a TodoTerramar",
    titleEn: "Welcome to TodoTerramar",
    subtitleEs: "Agrega banners desde el panel de administración",
    subtitleEn: "Add banners from the admin panel",
    altTextEs: "TodoTerramar",
    altTextEn: "TodoTerramar",
    linkUrl: null,
  },
];

export function HeroSection({ locale, sliderImages, whatsappPhone: whatsappPhoneProp }: HeroSectionProps) {
  const t = useTranslations();
  const whatsappPhone = whatsappPhoneProp ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const slides = sliderImages && sliderImages.length > 0 ? sliderImages : FALLBACK_SLIDES;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 28 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo   = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!paused && emblaApi) {
      timerRef.current = setInterval(() => emblaApi.scrollNext(), 5000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, emblaApi]);

  const getAlt      = (s: SliderImage) =>
    (locale === "en" ? s.altTextEn || s.titleEn : s.altTextEs) ?? s.titleEs;
  const getTitle    = (s: SliderImage) =>
    locale === "en" && s.titleEn ? s.titleEn : s.titleEs;
  const getSubtitle = (s: SliderImage) =>
    locale === "en" && s.subtitleEn ? s.subtitleEn : (s.subtitleEs ?? null);
  const getCtaText  = (s: SliderImage) =>
    locale === "en" && s.ctaTextEn ? s.ctaTextEn : (s.ctaTextEs ?? null);

  const currentSlide = slides[selectedIndex] ?? slides[0];

  return (
    <section className="w-full bg-[#09071f]">

      {/* ── Full-width banner carousel ────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden group/hero"
        style={{ height: "clamp(320px, 42vw, 760px)" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Embla viewport */}
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full">
            {slides.map((slide, i) => {
              const fit = slide.imageFit || "contain";
              const pos = slide.imagePosition || "center";

              const inner = (
                <div className="relative flex-none w-full h-full bg-[#09071f]">
                  {slide.imageUrl ? (
                    <>
                      {/* Blurred background — fills letterbox areas beautifully */}
                      <div className="absolute inset-0 overflow-hidden">
                        <Image
                          src={slide.imageUrl}
                          alt=""
                          fill
                          aria-hidden
                          quality={40}
                          sizes="100vw"
                          className="object-cover scale-110 opacity-40"
                          style={{ filter: "blur(32px)" }}
                        />
                        <div className="absolute inset-0 bg-[#09071f]/45" />
                      </div>

                      {/* Mobile-specific image (hidden sm and up) */}
                      {slide.mobileImageUrl && (
                        <div className="absolute inset-0 sm:hidden">
                          <Image
                            src={slide.mobileImageUrl}
                            alt={getAlt(slide)}
                            fill
                            priority={i === 0}
                            quality={100}
                            sizes="(max-width: 640px) 100vw, 0px"
                            className="object-contain"
                            style={{ objectPosition: pos }}
                          />
                        </div>
                      )}

                      {/* Main / desktop image */}
                      <Image
                        src={slide.imageUrl}
                        alt={getAlt(slide)}
                        fill
                        priority={i === 0}
                        quality={100}
                        sizes="100vw"
                        className={[
                          slide.mobileImageUrl ? "hidden sm:block" : "",
                          fit === "cover" ? "object-cover" : "object-contain",
                        ].filter(Boolean).join(" ")}
                        style={{ objectPosition: pos }}
                      />
                    </>
                  ) : (
                    /* No image — navy gradient placeholder */
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(135deg, #08051f 0%, #15104a 55%, #211f72 100%)" }}
                    />
                  )}

                  {/* Narrow bottom gradient for caption bar readability only */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />
                </div>
              );

              return slide.linkUrl ? (
                <a
                  key={slide.id}
                  href={slide.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none w-full h-full"
                >
                  {inner}
                </a>
              ) : (
                <div key={slide.id} className="flex-none w-full h-full">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom caption bar */}
        <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-[6px] px-5 py-4 sm:px-8 sm:py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-base sm:text-xl md:text-2xl font-medium text-white leading-snug truncate">
                {getTitle(currentSlide)}
              </p>
              {getSubtitle(currentSlide) && (
                <p className="text-xs sm:text-sm text-white/75 mt-0.5 truncate">
                  {getSubtitle(currentSlide)}
                </p>
              )}
            </div>
            {currentSlide.linkUrl && (
              <a
                href={currentSlide.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full transition-all whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #c4922c, #f0d18a)",
                  color: "#09071f",
                }}
              >
                {getCtaText(currentSlide) || (locale === "en" ? "View more" : "Ver más")}
              </a>
            )}
          </div>
        </div>

        {/* Prev arrow */}
        <button
          onClick={scrollPrev}
          aria-label="Banner anterior"
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                     opacity-0 group-hover/hero:opacity-100 transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(9,7,31,0.70)",
            border: "1px solid rgba(215,168,79,0.50)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#f0d18a" }} />
        </button>

        {/* Next arrow */}
        <button
          onClick={scrollNext}
          aria-label="Banner siguiente"
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10
                     w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                     opacity-0 group-hover/hero:opacity-100 transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(9,7,31,0.70)",
            border: "1px solid rgba(215,168,79,0.50)",
            backdropFilter: "blur(8px)",
          }}
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: "#f0d18a" }} />
        </button>
      </div>

      {/* ── Dots ─────────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="flex justify-center items-center gap-2 py-4 bg-white">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Ir al banner ${i + 1}`}
              className="rounded-full transition-all duration-300"
              style={{
                width:  i === selectedIndex ? "28px" : "9px",
                height: "9px",
                background: i === selectedIndex
                  ? "linear-gradient(90deg, #c4922c, #f0d18a)"
                  : "rgba(23,16,79,0.20)",
              }}
            />
          ))}
        </div>
      )}

      {/* ── CTA strip ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 py-6 sm:py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            href={`/${locale}/unete-al-equipo`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full
                       font-semibold text-sm transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "linear-gradient(135deg, #17104f 0%, #211f72 100%)",
              color: "#f0d18a",
              boxShadow: "0 4px 16px rgba(23,16,79,0.25)",
            }}
          >
            {t("hero.ctaJoin")} →
          </Link>

          <Link
            href={`/${locale}/promociones`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full
                       font-semibold text-sm border transition-all duration-200 hover:bg-navy-50"
            style={{
              border: "1.5px solid rgba(23,16,79,0.25)",
              color: "#17104f",
            }}
          >
            {t("nav.promotions")}
          </Link>

          {whatsappPhone && (
            <a
              href={getWhatsAppUrl(whatsappPhone, "¡Hola! Me gustaría más información sobre Terramar.")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full
                         font-semibold text-sm bg-[#25D366] text-white hover:bg-[#1fba59] transition-colors"
              style={{ boxShadow: "0 4px 14px rgba(37,211,102,0.28)" }}
            >
              <MessageCircle className="w-4 h-4" />
              {t("hero.ctaWhatsApp")}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
