"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { href: `/${locale}`, label: t("nav.home"), exact: true },
    { href: `/${locale}/sobre-terramar`, label: t("nav.about") },
    { href: `/${locale}/unete-al-equipo`, label: t("nav.joinTeam") },
    { href: `/${locale}/promociones`, label: t("nav.promotions") },
    { href: `/${locale}/productos`, label: t("nav.products") },
    { href: `/${locale}/videos`, label: t("nav.videos") },
    { href: `/${locale}/blog`, label: t("nav.blog") },
    { href: `/${locale}/contacto`, label: t("nav.contact") },
  ];

  const switchLocale = (newLocale: string) => {
    const segs = pathname.split("/");
    segs[1] = newLocale;
    return segs.join("/") || "/";
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === `/${locale}` : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          "bg-navy-700",
          scrolled
            ? "shadow-[0_4px_24px_rgba(9,7,31,0.5)]"
            : "shadow-[0_2px_16px_rgba(9,7,31,0.35)]"
        )}
        style={{ borderBottom: "1px solid rgba(215,168,79,0.25)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[88px] md:min-h-[108px]">

            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="flex-shrink-0 group"
              aria-label="Todo Terramar — Inicio"
            >
              <Image
                src="/images/todo-terramar-logo.png"
                alt="Todo Terramar — By Yhoana Marell"
                width={1536}
                height={1024}
                priority
                quality={100}
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-0">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-3 py-2 text-[12.5px] font-medium rounded-lg transition-colors duration-150",
                      active
                        ? "text-gold-300"
                        : "text-white/75 hover:text-gold-300"
                    )}
                  >
                    {item.label}
                    {active && (
                      <span
                        className="absolute bottom-[1px] left-3 right-3 h-[2px] rounded-full"
                        style={{ background: "linear-gradient(90deg, #c4922c, #f0d18a)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">

              {/* Language selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide border border-white/15 text-white/70 hover:border-gold-500/50 hover:text-gold-300 transition-colors duration-150">
                    <Globe className="w-3.5 h-3.5" />
                    {locale}
                    <ChevronDown className="w-3 h-3 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-36 shadow-lg rounded-xl border border-navy-200 bg-white"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href={switchLocale("es")}
                      className="cursor-pointer flex items-center gap-2 text-sm"
                    >
                      <span>🇲🇽</span> Español
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href={switchLocale("en")}
                      className="cursor-pointer flex items-center gap-2 text-sm"
                    >
                      <span>🇺🇸</span> English
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Register CTA */}
              <Link
                href={`/${locale}/registro`}
                className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-[12.5px] font-semibold transition-all duration-150 hover:-translate-y-px"
                style={{
                  background: "linear-gradient(135deg, #c4922c 0%, #d7a84f 60%, #f0d18a 100%)",
                  color: "#09071f",
                  boxShadow: "0 2px 12px rgba(215,168,79,0.40)",
                }}
              >
                {t("nav.register")}
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
                className="xl:hidden p-2 rounded-xl text-white/80 hover:text-gold-300 hover:bg-white/5 transition-colors duration-150"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Gold divider line */}
        <div className="gold-divider" />

        {/* Mobile drawer */}
        <div
          className={cn(
            "xl:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
            isOpen ? "max-h-[680px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-navy-800 border-t border-gold-500/15">
            <nav className="px-4 pt-3 pb-2 space-y-0.5">
              {navItems.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-150",
                      active
                        ? "text-gold-300 bg-white/5 font-semibold"
                        : "text-white/70 hover:text-gold-300 hover:bg-white/5"
                    )}
                  >
                    {active && (
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: "#d7a84f" }}
                      />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="px-4 pt-1 pb-5">
              <Link
                href={`/${locale}/registro`}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-150"
                style={{
                  background: "linear-gradient(135deg, #c4922c 0%, #d7a84f 60%, #f0d18a 100%)",
                  color: "#09071f",
                  boxShadow: "0 4px 16px rgba(215,168,79,0.40)",
                }}
              >
                {t("nav.register")} →
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
