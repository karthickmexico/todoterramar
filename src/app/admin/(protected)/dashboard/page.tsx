export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentLeads } from "@/components/admin/recent-leads";

export const metadata: Metadata = {
  title: "Dashboard | TodoTerramar Admin",
  robots: { index: false },
};

async function getDashboardData() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      affiliatedLeads,
      buyers,
      notInterested,
      leadsThisMonth,
      activePromos,
      publishedVideos,
      recentLeads,
      leadsBySource,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { status: "CONTACTED" } }),
      prisma.lead.count({ where: { status: "AFFILIATED" } }),
      prisma.lead.count({ where: { status: "BUYER" } }),
      prisma.lead.count({ where: { status: "NOT_INTERESTED" } }),
      prisma.lead.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.promotion.count({
        where: {
          isActive: true,
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
      }),
      prisma.video.count({ where: { isPublished: true } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.lead.groupBy({
        by: ["source"],
        _count: { source: true },
        orderBy: { _count: { source: "desc" } },
      }),
    ]);

    return {
      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        affiliatedLeads,
        buyers,
        notInterested,
        leadsThisMonth,
        activePromos,
        publishedVideos,
      },
      recentLeads,
      leadsBySource,
    };
  } catch {
    return {
      stats: {
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        affiliatedLeads: 0,
        buyers: 0,
        notInterested: 0,
        leadsThisMonth: 0,
        activePromos: 0,
        publishedVideos: 0,
      },
      recentLeads: [],
      leadsBySource: [],
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vista general del negocio</p>
      </div>

      <DashboardStats stats={data.stats} leadsBySource={data.leadsBySource} />

      <div className="mt-8">
        <RecentLeads leads={data.recentLeads} />
      </div>
    </div>
  );
}
