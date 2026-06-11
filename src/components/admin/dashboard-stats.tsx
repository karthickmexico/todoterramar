import React from "react";
import {
  Users,
  TrendingUp,
  Phone,
  CheckCircle,
  ShoppingBag,
  XCircle,
  Calendar,
  Tag,
  Video,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LEAD_STATUS_COLORS } from "@/lib/constants";

interface Stats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  affiliatedLeads: number;
  buyers: number;
  notInterested: number;
  leadsThisMonth: number;
  activePromos: number;
  publishedVideos: number;
}

interface LeadsBySource {
  source: string;
  _count: { source: number };
}

export function DashboardStats({
  stats,
  leadsBySource,
}: {
  stats: Stats;
  leadsBySource: LeadsBySource[];
}) {
  const mainStats = [
    {
      label: "Total Prospectos",
      value: stats.totalLeads,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Nuevos",
      value: stats.newLeads,
      icon: TrendingUp,
      color: "text-[#15104a]",
      bg: "bg-[#f8f3ea]",
    },
    {
      label: "Contactados",
      value: stats.contactedLeads,
      icon: Phone,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Afiliados",
      value: stats.affiliatedLeads,
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Compradores",
      value: stats.buyers,
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "No interesados",
      value: stats.notInterested,
      icon: XCircle,
      color: "text-gray-500",
      bg: "bg-gray-50",
    },
    {
      label: "Este mes",
      value: stats.leadsThisMonth,
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Promociones activas",
      value: stats.activePromos,
      icon: Tag,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Videos publicados",
      value: stats.publishedVideos,
      icon: Video,
      color: "text-[#15104a]",
      bg: "bg-[#f8f3ea]",
    },
  ];

  const sourceLabels: Record<string, string> = {
    GOOGLE: "Google",
    FACEBOOK: "Facebook",
    INSTAGRAM: "Instagram",
    WHATSAPP: "WhatsApp",
    REFERRAL: "Referido",
    OTHER: "Otro",
  };

  return (
    <div className="space-y-6">
      {/* Main stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {mainStats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Source breakdown */}
      {leadsBySource.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Prospectos por fuente</h3>
            <div className="space-y-3">
              {leadsBySource.map((item) => {
                const total = leadsBySource.reduce(
                  (acc, i) => acc + i._count.source,
                  0
                );
                const pct = total > 0 ? (item._count.source / total) * 100 : 0;
                return (
                  <div key={item.source}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700">
                        {sourceLabels[item.source] || item.source}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {item._count.source} ({Math.round(pct)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ background: "linear-gradient(90deg, #c4922c, #d7a84f)", width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
