"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, MessageCircle, X, BookOpen } from "lucide-react";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";

interface Category { id: string; nameEs: string; nameEn: string | null; }
interface Product {
  id: string; nameEs: string; nameEn: string | null;
  descriptionEs: string | null; price: number | null;
  imageUrl: string | null; catalogueUrl: string | null; catalogueLabel: string | null;
  availability: "IN_STOCK" | "OUT_OF_STOCK" | "COMING_SOON";
  isFeatured: boolean; categoryId: string | null;
  category: Category | null;
}

interface ProductFiltersProps {
  locale: string; categories: Category[]; products: Product[];
  initialCategory?: string; initialSearch?: string;
}

export function ProductFilters({ locale, categories, products, initialCategory, initialSearch }: ProductFiltersProps) {
  const t = useTranslations("products");
  const [search, setSearch] = useState(initialSearch || "");
  const [activeCategory, setActiveCategory] = useState(initialCategory || "");
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = locale === "en" && p.nameEn ? p.nameEn : p.nameEs;
      const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || (p.descriptionEs || "").toLowerCase().includes(search.toLowerCase());
      const matchCategory = !activeCategory || p.categoryId === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [products, search, activeCategory, locale]);

  const availBadge = (a: string) => {
    if (a === "IN_STOCK") return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">{t("inStock")}</span>;
    if (a === "OUT_OF_STOCK") return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{t("outOfStock")}</span>;
    return <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{t("comingSoon")}</span>;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 h-11 rounded-xl"
            style={{ borderColor: "rgba(215,168,79,0.35)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory("")}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
            style={!activeCategory
              ? { background: "#15104a", color: "#f3d184", boxShadow: "0 2px 8px rgba(21,16,74,0.25)" }
              : { background: "#fff", color: "#15104a", border: "1px solid rgba(215,168,79,0.30)" }
            }
          >
            {t("allCategories")}
          </button>
          {categories.map((cat) => {
            const name = locale === "en" && cat.nameEn ? cat.nameEn : cat.nameEs;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(active ? "" : cat.id)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={active
                  ? { background: "#15104a", color: "#f3d184", boxShadow: "0 2px 8px rgba(21,16,74,0.25)" }
                  : { background: "#fff", color: "#15104a", border: "1px solid rgba(215,168,79,0.30)" }
                }
              >
                {name}
              </button>
            );
          })}
        </div>
      )}

      <p className="text-sm text-gray-500 mb-6">
        <span className="font-semibold text-gray-700">{filtered.length}</span>{" "}
        producto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(215,168,79,0.10)" }}
          >
            <ShoppingBag className="w-9 h-9" style={{ color: "#d7a84f" }} />
          </div>
          <p className="text-gray-500 font-medium">{t("noProducts")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const name = locale === "en" && product.nameEn ? product.nameEn : product.nameEs;
            const catName = locale === "en" && product.category?.nameEn ? product.category.nameEn : product.category?.nameEs;
            return (
              <div key={product.id} className="luxury-card group overflow-hidden">
                <div className="relative h-52 overflow-hidden" style={{ background: "#f8f3ea" }}>
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <ShoppingBag className="w-12 h-12" style={{ color: "rgba(215,168,79,0.45)" }} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">{availBadge(product.availability)}</div>
                  {product.isFeatured && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">★</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {catName && (
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#d7a84f" }}>{catName}</p>
                  )}
                  <h3 className="font-bold text-gray-900 text-sm mb-1.5 line-clamp-2 leading-snug">{name}</h3>
                  {product.descriptionEs && <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{product.descriptionEs}</p>}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold" style={{ color: "#15104a" }}>
                      {product.price ? formatCurrency(Number(product.price)) : <span className="text-sm font-medium text-gray-400">{t("priceOptional")}</span>}
                    </span>
                  </div>
                  {whatsappPhone && product.availability === "IN_STOCK" && (
                    <a href={getWhatsAppUrl(whatsappPhone, `Hola! Me interesa: ${name}`)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1fba59] transition-colors shadow-sm">
                      <MessageCircle className="w-3.5 h-3.5" />{t("inquire")}
                    </a>
                  )}
                  {product.catalogueUrl && (
                    <a
                      href={product.catalogueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold transition-all mt-2"
                      style={{ background: "rgba(215,168,79,0.10)", color: "#15104a", border: "1px solid rgba(215,168,79,0.35)" }}
                    >
                      <BookOpen className="w-3.5 h-3.5" style={{ color: "#d7a84f" }} />
                      {product.catalogueLabel || (locale === "en" ? "View catalogue" : "Ver catálogo")}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
