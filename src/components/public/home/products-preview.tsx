"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";

interface Product {
  id: string;
  nameEs: string;
  nameEn: string | null;
  descriptionEs: string | null;
  price: number | null;
  imageUrl: string | null;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "COMING_SOON";
  isFeatured: boolean;
  category: { nameEs: string; nameEn: string | null } | null;
}

interface ProductsPreviewProps {
  products: Product[];
  locale: string;
  whatsappPhone?: string;
}

export function ProductsPreview({ products, locale, whatsappPhone: whatsappPhoneProp }: ProductsPreviewProps) {
  const t = useTranslations("products");
  const whatsappPhone = whatsappPhoneProp ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  if (products.length === 0) return null;

  return (
    <section className="section bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full border mb-4"
              style={{ background: "rgba(243,209,132,0.20)", color: "#15104a", borderColor: "rgba(215,168,79,0.35)" }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#d7a84f" }} />
              Productos destacados
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500 mt-2">{t("subtitle")}</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex flex-shrink-0 transition-colors"
            style={{ borderColor: "rgba(215,168,79,0.40)", color: "#15104a" }}
          >
            <Link href={`/${locale}/productos`}>
              {t("viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const name = locale === "en" && product.nameEn ? product.nameEn : product.nameEs;
            const catName = locale === "en" && product.category?.nameEn
              ? product.category.nameEn
              : product.category?.nameEs;

            return (
              <div key={product.id} className="luxury-card group overflow-hidden">
                {/* Image */}
                <div className="relative h-56 overflow-hidden" style={{ background: "#f8f3ea" }}>
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <ShoppingBag className="w-14 h-14" style={{ color: "rgba(215,168,79,0.45)" }} />
                    </div>
                  )}

                  {/* Availability badge */}
                  <div className="absolute top-3 right-3">
                    {product.availability === "IN_STOCK" && (
                      <span className="bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {t("inStock")}
                      </span>
                    )}
                    {product.availability === "OUT_OF_STOCK" && (
                      <span className="bg-gray-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {t("outOfStock")}
                      </span>
                    )}
                    {product.availability === "COMING_SOON" && (
                      <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {t("comingSoon")}
                      </span>
                    )}
                  </div>

                  {product.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        ★ {t("featured")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {catName && (
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#d7a84f" }}>
                      {catName}
                    </p>
                  )}
                  <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-2 text-[15px] leading-snug">
                    {name}
                  </h3>
                  {product.descriptionEs && (
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                      {product.descriptionEs}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold" style={{ color: "#15104a" }}>
                      {product.price
                        ? formatCurrency(Number(product.price))
                        : <span className="text-sm font-medium text-gray-500">{t("priceOptional")}</span>}
                    </span>
                  </div>

                  {whatsappPhone && product.availability === "IN_STOCK" && (
                    <a
                      href={getWhatsAppUrl(
                        whatsappPhone,
                        `Hola! Me interesa el producto: ${name}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1fba59] transition-colors shadow-sm"
                      onClick={() => {
                        if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).gtag) {
                          ((window as unknown as Record<string, unknown>).gtag as (...args: unknown[]) => void)(
                            "event", "product_inquiry", { product_name: name }
                          );
                        }
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("inquire")}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile view all */}
        <div className="text-center mt-10">
          <Button asChild size="lg" className="shadow-luxury">
            <Link href={`/${locale}/productos`}>
              {t("viewAll")} <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
