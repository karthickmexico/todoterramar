export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LeadsTable } from "@/components/admin/leads-table";

export const metadata: Metadata = {
  title: "Prospectos | TodoTerramar Admin",
  robots: { index: false },
};

async function getLeads({
  page,
  status,
  interest,
  source,
  q,
}: {
  page: number;
  status?: string;
  interest?: string;
  source?: string;
  q?: string;
}) {
  const limit = 20;
  const where: Record<string, unknown> = {};

  if (status) where.status = status;
  if (interest) where.interest = interest;
  if (source) where.source = source;
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { email: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        notes: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { leads, total, pages: Math.ceil(total / limit) };
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    interest?: string;
    source?: string;
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  const { leads, total, pages } = await getLeads({
    page,
    status: params.status,
    interest: params.interest,
    source: params.source,
    q: params.q,
  });

  return (
    <div className="max-w-7xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prospectos</h1>
          <p className="text-gray-500 mt-1">{total} prospecto{total !== 1 ? "s" : ""} en total</p>
        </div>
      </div>

      <LeadsTable
        leads={leads}
        total={total}
        page={page}
        pages={pages}
        filters={{
          status: params.status,
          interest: params.interest,
          source: params.source,
          q: params.q,
        }}
      />
    </div>
  );
}
