export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductsManager } from "@/components/admin/products-manager";

export const metadata: Metadata = {
  title: "Productos | TodoTerramar Admin",
  robots: { index: false },
};

export default async function AdminProductsPage() {
  let products: {
    id: string; nameEs: string; price: number | null; imageUrl: string | null;
    availability: string; isFeatured: boolean; isPublished: boolean;
    category: { id: string; nameEs: string } | null;
  }[] = [];
  let categories: { id: string; nameEs: string }[] = [];
  try {
    const [rawProducts, rawCategories] = await Promise.all([
      prisma.product.findMany({
        include: { category: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      }),
      prisma.productCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);
    products = rawProducts.map((p) => ({
      id: p.id,
      nameEs: p.nameEs,
      price: p.price !== null ? Number(p.price) : null,
      imageUrl: p.imageUrl,
      availability: p.availability,
      isFeatured: p.isFeatured,
      isPublished: p.isPublished,
      category: p.category ? { id: p.category.id, nameEs: p.category.nameEs } : null,
    }));
    categories = rawCategories.map((c) => ({ id: c.id, nameEs: c.nameEs }));
  } catch {}

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
      </div>
      <ProductsManager products={products} categories={categories} />
    </div>
  );
}
