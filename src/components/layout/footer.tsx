import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MessageCircle, MapPin, Clock, Share2, Play, Phone, Mail } from "lucide-react";

interface FooterProps {
  locale: string;
  settings?: Record<string, string>;
}

export function Footer({ locale, settings }: FooterProps) {
  const t = useTranslations();
  const whatsappPhone = settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const year = new Date().getFullYear();

  const navLinks = [
    { href: `/${locale}/sobre-terramar`, label: t("nav.about") },
    { href: `/${locale}/unete-al-equipo`, label: t("nav.joinTeam") },
    { href: `/${locale}/beneficios`, label: t("nav.benefits") },
    { href: `/${locale}/promociones`, label: t("nav.promotions") },
    { href: `/${locale}/videos`, label: t("nav.videos") },
    { href: `/${locale}/productos`, label: t("nav.products") },
    { href: `/${locale}/blog`, label: t("nav.blog") },
    { href: `/${locale}/contacto`, label: t("nav.contact") },
  ];

  return (
    <footer style={{ background: "#09071f" }}>
      {/* Gold top border */}
      <div className="gold-divider" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #c4922c 0%, #d7a84f 50%, #f0d18a 100%)",
                  boxShadow: "0 2px 12px rgba(215,168,79,0.35)",
                }}
              >
                <span className="font-black text-sm leading-none select-none" style={{ color: "#09071f" }}>T</span>
              </div>
              <div>
                <span
                  className="font-bold text-lg block leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #f0d18a, #d7a84f)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Todo Terramar
                </span>
                <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(215,168,79,0.5)" }}>
                  By Yhoana Marell
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
              {t("footer.tagline")}
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#d7a84f" }} />
                <span>{settings?.location || "México"}</span>
              </div>
              <div className="flex items-start gap-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#d7a84f" }} />
                <span>{settings?.businessHours || "Lun-Vie 9:00 – 18:00"}</span>
              </div>
              {settings?.phoneNumber && (
                <div className="flex items-start gap-2 text-sm">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#d7a84f" }} />
                  <a
                    href={`tel:${settings.phoneNumber.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-white/70"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {settings.phoneNumber}
                  </a>
                </div>
              )}
              {settings?.contactEmail && (
                <div className="flex items-start gap-2 text-sm">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#d7a84f" }} />
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="transition-colors hover:text-white/70"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {settings.contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Links col 1 */}
          <div>
            <h3
              className="font-semibold text-sm uppercase tracking-wider mb-5"
              style={{ color: "#d7a84f" }}
            >
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2.5">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold-300"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links col 2 */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-5" style={{ color: "#d7a84f" }}>
              Más
            </h3>
            <ul className="space-y-2.5">
              {navLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/45 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {whatsappPhone && (
                <li>
                  <a
                    href={`https://wa.me/${whatsappPhone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm flex items-center gap-1.5 transition-colors"
                    style={{ color: "#22c55e" }}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social + disclaimer */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-5" style={{ color: "#d7a84f" }}>
              {t("footer.followUs")}
            </h3>
            <div className="flex gap-2.5 mb-6">
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  aria-label="Facebook"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  aria-label="Instagram"
                >
                  <Share2 className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  aria-label="YouTube"
                >
                  <Play className="w-4 h-4" />
                </a>
              )}
              {whatsappPhone && (
                <a
                  href={`https://wa.me/${whatsappPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#22c55e" }}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>

            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(215,168,79,0.05)",
                border: "1px solid rgba(215,168,79,0.12)",
              }}
            >
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                {t("footer.disclaimer")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(215,168,79,0.10)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {year} Todo Terramar - powered by{" "}
            <a
              href="https://quantumaltus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors"
              style={{ color: "#f3d184" }}
            >
              Quantum Altus
            </a>
          </p>
          <div className="flex gap-5">
            <Link
              href={`/${locale}/privacidad`}
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href={`/${locale}/terminos`}
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
