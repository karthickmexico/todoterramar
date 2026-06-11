"use client";

import { Download, MessageCircle, Tag, Timer, Sparkles, CheckCircle2 } from "lucide-react";
import { formatDate, getWhatsAppUrl } from "@/lib/utils";

interface PromoCardPromotion {
  id: string;
  titleEs: string;
  titleEn: string | null;
  descriptionEs: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  endDate: string | null;
}

interface PromoCardProps {
  promo: PromoCardPromotion;
  title: string;
  locale: string;
  whatsappPhone: string;
  expired: boolean;
  tExpires: string;
  tDownload: string;
  tInquire: string;
}

export function PromoCard({
  promo,
  title,
  locale,
  whatsappPhone,
  expired,
  tExpires,
  tDownload,
  tInquire,
}: PromoCardProps) {
  const isValidSrc = (url: string | null): url is string =>
    !!url && !url.startsWith("/uploads/");

  return (
    <div
      className={`group bg-white rounded-3xl overflow-hidden border shadow-sm transition-all duration-300 ${
        expired ? "border-gray-200 grayscale-[30%]" : "hover:-translate-y-2 hover:shadow-lg"
      }`}
      style={expired ? {} : { borderColor: "rgba(215,168,79,0.25)" }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden" style={{ background: "#f8f3ea" }}>
        {isValidSrc(promo.imageUrl) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={promo.imageUrl}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover ${
              !expired ? "group-hover:scale-105 transition-transform duration-500" : ""
            }`}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <Tag className="w-12 h-12" style={{ color: "rgba(215,168,79,0.45)" }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08051f]/40 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          {expired ? (
            <span className="bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              Expirada
            </span>
          ) : (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1"
              style={{ background: "linear-gradient(135deg, #c4922c, #f0d18a)", color: "#08051f" }}
            >
              <Sparkles className="w-2.5 h-2.5" />
              ¡Activa!
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-snug">
          {title}
        </h3>
        {promo.descriptionEs && (
          <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-relaxed">
            {promo.descriptionEs}
          </p>
        )}

        {!expired && (
          <ul className="space-y-1.5 mb-4">
            {["Envío disponible", "Asesoría personalizada"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#d7a84f" }} />
                {b}
              </li>
            ))}
          </ul>
        )}

        {promo.endDate && (
          <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-full mb-4 w-fit border border-amber-100">
            <Timer className="w-3.5 h-3.5" />
            <span className="font-semibold">
              {tExpires}{" "}
              {formatDate(promo.endDate, locale === "en" ? "en-US" : "es-MX")}
            </span>
          </div>
        )}

        {!expired && (
          <div className="flex gap-2">
            {promo.pdfUrl && (
              <a
                href={promo.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border-2 text-xs font-semibold transition-colors"
                style={{ borderColor: "rgba(215,168,79,0.45)", color: "#15104a" }}
              >
                <Download className="w-3.5 h-3.5" />
                {tDownload}
              </a>
            )}
            {whatsappPhone && (
              <a
                href={getWhatsAppUrl(whatsappPhone, `Hola! Me interesa la promoción: ${title}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white text-xs font-semibold hover:from-[#1fba59] hover:to-[#15803d] transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {tInquire}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
