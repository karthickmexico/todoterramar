export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PromotionsManager } from "@/components/admin/promotions-manager";

export const metadata: Metadata = {
  title: "Promociones | TodoTerramar Admin",
  robots: { index: false },
};

export default async function AdminPromotionsPage() {
  let promotions: Awaited<ReturnType<typeof prisma.promotion.findMany>> = [];
  try {
    promotions = await prisma.promotion.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {}

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
      </div>
      <PromotionsManager promotions={promotions} />
    </div>
  );
}
