import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProductFilters } from "@/components/public/product-filters";
import { ShoppingBag, Sparkles } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.products" });
  return { title: t("title"), description: t("description") };
}

async function getProductsData() {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    return {
      products: products.map((p) => ({
        ...p,
        price: p.price !== null ? Number(p.price) : null,
        catalogueUrl: p.catalogueUrl ?? null,
        catalogueLabel: p.catalogueLabel ?? null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category ? {
          ...p.category,
          createdAt: p.category.createdAt.toISOString(),
          updatedAt: p.category.updatedAt.toISOString(),
        } : null,
      })),
      categories: categories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { locale } = await params;
  const { category, q } = await searchParams;
  const { products, categories } = await getProductsData();
  const t = await getTranslations({ locale, namespace: "products" });

  return (
    <div className="py-16 min-h-screen">
      {/* Page header */}
      <div className="border-b mb-12" style={{ background: "#f8f3ea", borderColor: "rgba(215,168,79,0.20)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{ background: "rgba(243,209,132,0.25)", color: "#15104a", border: "1px solid rgba(215,168,79,0.40)" }}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Catálogo completo
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: "#15104a" }}>{t("title")}</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductFilters
          locale={locale}
          categories={categories}
          products={products}
          initialCategory={category}
          initialSearch={q}
        />
      </div>
    </div>
  );
}
