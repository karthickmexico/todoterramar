import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { formatDate, getWhatsAppUrl } from "@/lib/utils";
import { LEAD_STATUS_COLORS } from "@/lib/constants";

interface Lead {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  interest: string;
  source: string;
  status: string;
  createdAt: Date;
}

const statusLabels: Record<string, string> = {
  NEW: "Nuevo",
  CONTACTED: "Contactado",
  FOLLOW_UP: "Seguimiento",
  AFFILIATED: "Afiliado",
  BUYER: "Comprador",
  NOT_INTERESTED: "No interesado",
};

const interestLabels: Record<string, string> = {
  JOIN_TEAM: "Equipo",
  BUY_PRODUCTS: "Comprar",
  BOTH: "Ambos",
};

export function RecentLeads({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) return null;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Últimos prospectos</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/leads">
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leads.map((lead) => {
            const statusColor = LEAD_STATUS_COLORS[lead.status as keyof typeof LEAD_STATUS_COLORS] || "bg-gray-100 text-gray-600";
            return (
              <div
                key={lead.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: "rgba(215,168,79,0.18)", color: "#15104a" }}>
                  {lead.fullName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="font-semibold text-sm text-gray-900 hover:text-[#15104a] truncate"
                    >
                      {lead.fullName}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
                      {statusLabels[lead.status] || lead.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
                      {interestLabels[lead.interest] || lead.interest}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span>{lead.phone}</span>
                    {lead.city && <span>{lead.city}</span>}
                    <span>{formatDate(lead.createdAt, "es-MX")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <a
                    href={`tel:${lead.phone}`}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Llamar"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={getWhatsAppUrl(lead.phone, `Hola ${lead.fullName}, te contacto de TodoTerramar`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#15104a] hover:bg-[#f8f3ea] transition-colors"
                      title="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
