import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, Award, Globe } from "lucide-react";

interface AboutSectionProps {
  locale: string;
}

export function AboutSection({ locale }: AboutSectionProps) {
  const t = useTranslations();

  const pillars = [
    {
      icon: Award,
      color: "#d7a84f",
      title: "Marca Reconocida",
      desc: "Más de 50 años de trayectoria en belleza y bienestar en México y América Latina.",
    },
    {
      icon: ShieldCheck,
      color: "#22c55e",
      title: "Productos de Calidad",
      desc: "Formulaciones desarrolladas por expertos con ingredientes de alta efectividad.",
    },
    {
      icon: Globe,
      color: "#818cf8",
      title: "Presencia Nacional",
      desc: "Red de distribuidores en toda la República Mexicana.",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-white">
      {/* Subtle background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(170deg, #fafafa 0%, #f5f4ff 40%, #fdf8ed 100%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: Text */}
          <div>
            <span
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-6"
              style={{
                background: "rgba(23,16,79,0.05)",
                border: "1px solid rgba(23,16,79,0.12)",
                color: "#17104f",
              }}
            >
              Sobre Terramar
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5" style={{ color: "#17104f" }}>
              La marca de belleza{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #c4922c, #d7a84f, #f0d18a)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                que te empodera
              </span>
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-5" style={{ color: "#4b5563" }}>
              Terramar Brands es una empresa mexicana líder en la venta directa de productos de
              belleza, maquillaje y cuidado personal. Con una amplia gama de artículos para mujer,
              la marca combina tendencia, calidad y precios accesibles.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#6b7280" }}>
              A través de su red de distribuidoras independientes, Terramar ofrece una oportunidad
              real de emprendimiento para mujeres en toda la República Mexicana.
            </p>

            {/* Gold divider */}
            <div className="gold-divider max-w-[200px] mb-8" />

            <Link
              href={`/${locale}/sobre-terramar`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-px"
              style={{
                background: "linear-gradient(135deg, #17104f, #211f72)",
                color: "#f0d18a",
                boxShadow: "0 4px 20px rgba(23,16,79,0.25)",
              }}
            >
              {t("nav.about")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Pillar cards */}
          <div className="space-y-4">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:-translate-x-1"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(23,16,79,0.07)",
                  boxShadow: "0 2px 16px rgba(23,16,79,0.06)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${p.color}15`,
                    border: `1px solid ${p.color}30`,
                  }}
                >
                  <p.icon style={{ width: "20px", height: "20px", color: p.color }} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: "#17104f" }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
