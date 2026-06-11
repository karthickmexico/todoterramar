"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Download,
  MessageCircle,
  Calendar,
  Tag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, getWhatsAppUrl } from "@/lib/utils";
import { PromoFeaturedCard } from "@/components/public/promo-featured-card";

interface Promotion {
  id: string;
  titleEs: string;
  titleEn: string | null;
  descriptionEs: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  endDate: string | null;
}

interface PromotionsPreviewProps {
  promotions: Promotion[];
  locale: string;
}

export function PromotionsPreview({ promotions, locale }: PromotionsPreviewProps) {
  const t = useTranslations("promotions");
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const featured = promotions[0] ?? null;
  const rest = promotions.slice(1);

  const getTitle = (p: Promotion) =>
    locale === "en" && p.titleEn ? p.titleEn : p.titleEs;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-white">
      {/* Subtle background */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #fafafa 0%, #f5f4ff 50%, #fafafa 100%)" }} />
      {/* Soft glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(23,16,79,0.04)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full border mb-4"
              style={{
                background: "rgba(23,16,79,0.05)",
                border: "1px solid rgba(23,16,79,0.12)",
                color: "#17104f",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#d7a84f" }} />
              Promociones Exclusivas
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ color: "#17104f" }}>
              {t("title")}
            </h2>
            <p className="text-base sm:text-lg max-w-2xl" style={{ color: "#6b7280" }}>
              Ofertas especiales para cuidar tu piel, verte increíble y comenzar tu negocio Terramar
            </p>
          </div>
          {promotions.length > 0 && (
            <Button
              asChild
              variant="outline"
              className="hidden sm:flex rounded-2xl flex-shrink-0"
              style={{
                border: "1.5px solid rgba(23,16,79,0.2)",
                color: "#17104f",
              }}
            >
              <Link href={`/${locale}/promociones`}>
                {t("viewAll")} <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {/* Gold divider */}
        <div className="gold-divider max-w-sm mb-12" />

        {/* Empty state */}
        {promotions.length === 0 && (
          <div className="text-center py-20">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
              style={{
                background: "rgba(23,16,79,0.05)",
                border: "2px solid rgba(215,168,79,0.25)",
              }}
            >
              <Sparkles className="w-10 h-10" style={{ color: "rgba(215,168,79,0.5)" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "#17104f" }}>Próximas promociones</h3>
            <p className="max-w-sm mx-auto text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
              Las promociones del mes se publicarán muy pronto. ¡Síguenos para no perderte ninguna oferta exclusiva!
            </p>
          </div>
        )}

        {/* Featured card */}
        {featured && (
          <div className="mb-10">
            <PromoFeaturedCard
              promo={featured}
              locale={locale}
              whatsappPhone={whatsappPhone}
            />
          </div>
        )}

        {/* Remaining cards */}
        {rest.length > 0 && (
          <div
            className={
              rest.length === 1
                ? "grid grid-cols-1 max-w-md"
                : rest.length === 2
                ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }
          >
            {rest.map((promo) => {
              const title = getTitle(promo);
              return (
                <div
                  key={promo.id}
                  className="promo-card group rounded-3xl overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden" style={{ background: "linear-gradient(135deg, #eeedf8, #fdf8ed)" }}>
                    {promo.imageUrl && !promo.imageUrl.startsWith("/uploads/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={promo.imageUrl}
                        alt={title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Tag className="w-10 h-10" style={{ color: "rgba(23,16,79,0.15)" }} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent" />
                    <div
                      className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{
                        background: "linear-gradient(135deg, #c4922c, #f0d18a)",
                        color: "#09071f",
                      }}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      ¡Activa!
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-base mb-2 line-clamp-2 leading-snug" style={{ color: "#17104f" }}>
                      {title}
                    </h3>
                    {promo.descriptionEs && (
                      <p className="text-sm line-clamp-2 mb-3 leading-relaxed" style={{ color: "#6b7280" }}>
                        {promo.descriptionEs}
                      </p>
                    )}
                    {promo.endDate && (
                      <div
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full mb-4 w-fit"
                        style={{
                          background: "rgba(215,168,79,0.10)",
                          border: "1px solid rgba(215,168,79,0.25)",
                          color: "#a47622",
                        }}
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-semibold">
                          {t("expires")}{" "}
                          {formatDate(promo.endDate, locale === "en" ? "en-US" : "es-MX")}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      {promo.pdfUrl && (
                        <a
                          href={promo.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-xs font-semibold transition-colors hover:bg-navy-50"
                          style={{
                            border: "1.5px solid rgba(23,16,79,0.18)",
                            color: "#17104f",
                          }}
                        >
                          <Download className="w-3.5 h-3.5" />
                          {t("download")}
                        </a>
                      )}
                      {whatsappPhone && (
                        <a
                          href={getWhatsAppUrl(whatsappPhone, `Hola! Me interesa la promoción: ${title}`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl text-white text-xs font-semibold transition-all"
                          style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {t("inquire")}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile view-all */}
        {promotions.length > 0 && (
          <div className="text-center mt-10 sm:hidden">
            <Link
              href={`/${locale}/promociones`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all"
              style={{
                border: "1.5px solid rgba(23,16,79,0.2)",
                color: "#17104f",
              }}
            >
              {t("viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
