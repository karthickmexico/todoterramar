import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageCircle, UserPlus, CheckCircle2, ArrowRight } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

interface AffiliateSectionProps {
  locale: string;
}

const WHATSAPP_REGISTER_MSG = "Hola, quiero registrarme en Terramar. ¿Me puedes ayudar?";

const steps = [
  {
    num: "01",
    title: "Contáctanos",
    desc: "Escríbenos por WhatsApp o llena el formulario de registro. Te respondemos de inmediato.",
  },
  {
    num: "02",
    title: "Completa tu registro",
    desc: "Proporcionas datos básicos personales. Te guiamos en cada paso del proceso de afiliación.",
  },
  {
    num: "03",
    title: "Recibe tu kit",
    desc: "Obtienes tu catálogo, productos de muestra y acceso a materiales de venta y capacitación.",
  },
  {
    num: "04",
    title: "Empieza a ganar",
    desc: "Comienza a vender y a construir tu red de distribuidoras para generar ingresos extra.",
  },
];

export function AffiliateSection({ locale }: AffiliateSectionProps) {
  const t = useTranslations();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-white">
      {/* Light navy tint background */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, #f5f4ff 0%, #fdf8ed 50%, #f5f4ff 100%)" }}
      />
      {/* Decorative gold orb */}
      <div
        className="absolute -right-24 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(215,168,79,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border mb-5"
            style={{
              background: "rgba(23,16,79,0.05)",
              border: "1px solid rgba(23,16,79,0.12)",
              color: "#17104f",
            }}
          >
            Cómo Afiliarse
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ color: "#17104f" }}>
            Únete al equipo{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c4922c, #d7a84f, #f0d18a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Terramar
            </span>
          </h2>
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#6b7280" }}>
            El proceso de afiliación es sencillo. En 4 pasos puedes comenzar tu negocio de belleza con Terramar.
          </p>
          <div className="gold-divider max-w-xs mx-auto mt-6" />
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step, i) => (
            <div
              key={i}
              className="step-card relative group rounded-2xl p-6"
            >
              {/* Step number */}
              <span
                className="text-4xl font-black leading-none mb-4 block"
                style={{
                  background: "linear-gradient(135deg, rgba(215,168,79,0.25), rgba(215,168,79,0.08))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {step.num}
              </span>
              <CheckCircle2
                className="w-5 h-5 mb-3 group-hover:scale-110 transition-transform duration-300"
                style={{ color: "#d7a84f" }}
              />
              <h3 className="font-bold text-sm mb-2" style={{ color: "#17104f" }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {whatsappPhone && (
            <a
              href={getWhatsAppUrl(whatsappPhone, WHATSAPP_REGISTER_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #c4922c 0%, #d7a84f 60%, #f0d18a 100%)",
                color: "#09071f",
                boxShadow: "0 4px 24px rgba(215,168,79,0.40)",
              }}
            >
              <MessageCircle className="w-5 h-5" />
              Quiero registrarme
            </a>
          )}
          <Link
            href={`/${locale}/unete-al-equipo`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, #17104f, #211f72)",
              color: "#f0d18a",
              boxShadow: "0 4px 20px rgba(23,16,79,0.25)",
            }}
          >
            <UserPlus className="w-4 h-4" />
            {t("nav.joinTeam")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
