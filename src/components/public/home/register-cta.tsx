import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

interface RegisterCtaProps {
  locale: string;
}

const WHATSAPP_REGISTER_MSG = "Hola, quiero registrarme en Terramar. ¿Me puedes ayudar?";

export function RegisterCta({ locale }: RegisterCtaProps) {
  const t = useTranslations();
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-3xl overflow-hidden px-8 py-16 sm:py-20 text-center"
          style={{
            background: "linear-gradient(150deg, #09071f 0%, #17104f 50%, #211f72 100%)",
            border: "1.5px solid rgba(215,168,79,0.30)",
            boxShadow: "0 24px 80px rgba(9,7,31,0.40), inset 0 1px 0 rgba(215,168,79,0.15)",
          }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(215,168,79,0.8) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Glow orbs */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[80px] pointer-events-none" style={{ background: "rgba(215,168,79,0.12)" }} />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-[70px] pointer-events-none" style={{ background: "rgba(215,168,79,0.08)" }} />

          <div className="relative z-10">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-7"
              style={{
                background: "rgba(215,168,79,0.12)",
                border: "1px solid rgba(215,168,79,0.35)",
                color: "#f0d18a",
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "#d7a84f" }} />
              Registro de Distribuidores Terramar
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              {t("register.title")}
            </h2>
            <p className="text-lg mb-3 max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t("register.subtitle")}
            </p>
            <p className="text-sm mb-10 max-w-xl mx-auto" style={{ color: "rgba(215,168,79,0.75)" }}>
              El proceso requiere información personal básica. Te guiamos paso a paso para completar tu registro como distribuidora Terramar.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Primary: WhatsApp register */}
              {whatsappPhone && (
                <a
                  href={getWhatsAppUrl(whatsappPhone, WHATSAPP_REGISTER_MSG)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, #c4922c 0%, #d7a84f 60%, #f0d18a 100%)",
                    color: "#09071f",
                    boxShadow: "0 4px 24px rgba(215,168,79,0.45)",
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Quiero registrarme
                </a>
              )}

              {/* Secondary: Registration page */}
              <Link
                href={`/${locale}/registro`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:bg-white/10"
                style={{
                  border: "1.5px solid rgba(215,168,79,0.45)",
                  color: "#f0d18a",
                }}
              >
                {t("hero.ctaJoin")}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust note */}
            <p className="mt-8 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Sin costo de consulta · Información confidencial · Respuesta inmediata por WhatsApp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
