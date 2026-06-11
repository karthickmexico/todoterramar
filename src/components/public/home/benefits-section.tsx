import React from "react";
import { useTranslations } from "next-intl";
import {
  DollarSign,
  Star,
  GraduationCap,
  Tag,
  Heart,
  Calendar,
} from "lucide-react";

interface BenefitsSectionProps {
  locale: string;
}

const benefits = [
  { key: "income",    icon: DollarSign,    color: "#22c55e" },
  { key: "products",  icon: Star,          color: "#d7a84f" },
  { key: "training",  icon: GraduationCap, color: "#818cf8" },
  { key: "discounts", icon: Tag,           color: "#f0d18a" },
  { key: "community", icon: Heart,         color: "#f472b6" },
  { key: "schedule",  icon: Calendar,      color: "#38bdf8" },
] as const;

export function BenefitsSection({ locale }: BenefitsSectionProps) {
  const t = useTranslations("benefits");

  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28"
      style={{ background: "linear-gradient(160deg, #17104f 0%, #211f72 60%, #17104f 100%)" }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #f0d18a 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none" style={{ background: "rgba(215,168,79,0.08)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none" style={{ background: "rgba(215,168,79,0.06)" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-5"
            style={{ border: "1px solid rgba(215,168,79,0.35)", color: "#f0d18a", background: "rgba(215,168,79,0.08)" }}
          >
            Ventajas exclusivas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t("subtitle")}
          </p>
          {/* Gold divider */}
          <div className="gold-divider max-w-xs mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b) => (
            <div
              key={b.key}
              className="benefit-card group rounded-2xl p-6 cursor-default"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <div
                className="w-13 h-13 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  width: "52px",
                  height: "52px",
                  background: `${b.color}18`,
                  border: `1px solid ${b.color}35`,
                }}
              >
                <b.icon style={{ width: "24px", height: "24px", color: b.color }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {t(`items.${b.key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {t(`items.${b.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
