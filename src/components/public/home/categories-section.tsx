import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CategoryCard {
  slug: string;
  nameEs: string;
  nameEn: string;
  imageUrl: string;
}

const CATEGORY_DATA: CategoryCard[] = [
  {
    slug: "cuidado-de-la-piel",
    nameEs: "Cuidado de la Piel",
    nameEn: "Skin Care",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=860&q=85&auto=format&fit=crop",
  },
  {
    slug: "maquillaje",
    nameEs: "Maquillaje",
    nameEn: "Makeup",
    imageUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=860&q=85&auto=format&fit=crop",
  },
  {
    slug: "fragancias",
    nameEs: "Fragancias",
    nameEn: "Fragrances",
    imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&h=860&q=85&auto=format&fit=crop",
  },
  {
    slug: "cabello",
    nameEs: "Cuidado del Cabello",
    nameEn: "Hair Care",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=860&q=85&auto=format&fit=crop",
  },
  {
    slug: "nutricion",
    nameEs: "Nutrición",
    nameEn: "Nutrition",
    imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&h=860&q=85&auto=format&fit=crop",
  },
  {
    slug: "hogar",
    nameEs: "Hogar y Bienestar",
    nameEn: "Home & Wellness",
    imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=860&q=85&auto=format&fit=crop",
  },
  {
    slug: "accesorios",
    nameEs: "Joyería y Accesorios",
    nameEn: "Jewelry & Accessories",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=860&q=85&auto=format&fit=crop",
  },
  {
    slug: "promociones-especiales",
    nameEs: "Promociones Especiales",
    nameEn: "Special Offers",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=860&q=85&auto=format&fit=crop",
  },
];

interface CategoriesSectionProps {
  locale: string;
  dbCategories?: { slug: string; nameEs: string; nameEn?: string | null }[];
}

export function CategoriesSection({ locale, dbCategories }: CategoriesSectionProps) {
  const categories = CATEGORY_DATA.map((cat) => {
    const db = dbCategories?.find((d) => d.slug === cat.slug);
    return {
      ...cat,
      nameEs: db?.nameEs ?? cat.nameEs,
      nameEn: db?.nameEn ?? cat.nameEn,
    };
  });

  const getName = (c: CategoryCard) =>
    locale === "en" ? (c.nameEn || c.nameEs) : c.nameEs;

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <p
            className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-2 sm:mb-3"
            style={{ color: "#d7a84f" }}
          >
            {locale === "en" ? "de productos" : "de productos"}
          </p>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
            style={{ color: "#17104f" }}
          >
            {locale === "en" ? "PRODUCT" : "CATEGORÍAS"}
            <span className="font-light ml-2" style={{ color: "#6b7280" }}>
              {locale === "en" ? "CATEGORIES" : ""}
            </span>
          </h2>
          <div className="gold-divider max-w-[80px] mx-auto mt-4" />
        </div>

        {/* Grid — 4 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/productos?categoria=${cat.slug}`}
              className="group relative block rounded-2xl overflow-hidden"
              style={{ height: "clamp(260px, 35vw, 430px)" }}
            >
              {/* Background image */}
              <Image
                src={cat.imageUrl}
                alt={getName(cat)}
                fill
                quality={85}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />

              {/* Dark gradient overlay — thicker at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent
                              group-hover:from-black/80 transition-colors duration-300" />

              {/* Category title at bottom */}
              <div className="absolute inset-x-0 bottom-0 px-4 py-5">
                <h3
                  className="text-white font-semibold text-base sm:text-lg leading-snug tracking-wide"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.6)" }}
                >
                  {getName(cat)}
                </h3>
                <span
                  className="inline-block mt-1 text-[11px] font-semibold tracking-wider uppercase
                               opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0
                               transition-all duration-300"
                  style={{ color: "#f0d18a" }}
                >
                  {locale === "en" ? "Shop now →" : "Ver productos →"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
