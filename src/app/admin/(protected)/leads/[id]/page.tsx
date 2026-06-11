export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LeadDetail } from "@/components/admin/lead-detail";

export const metadata: Metadata = {
  title: "Detalle de Prospecto | TodoTerramar Admin",
  robots: { index: false },
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!lead) notFound();

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <Link href="/admin/leads" className="text-sm text-gray-500 hover:text-[#15104a]">
          ← Regresar a prospectos
        </Link>
      </div>
      <LeadDetail lead={lead} />
    </div>
  );
}
