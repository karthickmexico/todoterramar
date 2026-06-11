"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MessageCircle,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
} from "lucide-react";
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
  notes: { content: string; createdAt: Date }[];
}

interface LeadsTableProps {
  leads: Lead[];
  total: number;
  page: number;
  pages: number;
  filters: {
    status?: string;
    interest?: string;
    source?: string;
    q?: string;
  };
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

const sourceLabels: Record<string, string> = {
  GOOGLE: "Google",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  REFERRAL: "Referido",
  OTHER: "Otro",
};

export function LeadsTable({ leads, total, page, pages, filters }: LeadsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.q || "");

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (filters.status && key !== "status") params.set("status", filters.status);
    if (filters.interest && key !== "interest") params.set("interest", filters.interest);
    if (filters.source && key !== "source") params.set("source", filters.source);
    if (filters.q && key !== "q") params.set("q", filters.q);
    if (value && value !== "ALL") params.set(key, value);
    params.set("page", "1");
    router.push(`/admin/leads?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("q", search);
  };

  const exportCsv = () => {
    const headers = ["Nombre", "Teléfono", "Email", "Ciudad", "Estado", "Interés", "Fuente", "Estado", "Fecha"];
    const rows = leads.map((l) => [
      l.fullName, l.phone, l.email || "", l.city || "", l.state || "",
      interestLabels[l.interest] || l.interest,
      sourceLabels[l.source] || l.source,
      statusLabels[l.status] || l.status,
      new Date(l.createdAt).toLocaleDateString("es-MX"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospectos-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, teléfono, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </form>
          <div className="flex gap-2">
            <Select
              value={filters.status || "ALL"}
              onValueChange={(v) => updateFilter("status", v)}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos los estados</SelectItem>
                {Object.entries(statusLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.interest || "ALL"}
              onValueChange={(v) => updateFilter("interest", v)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Interés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {Object.entries(interestLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={exportCsv}>
              <Download className="w-4 h-4" />
              CSV
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {leads.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No hay prospectos con los filtros seleccionados
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Prospecto</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Contacto</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Interés</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Fuente</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Fecha</th>
                  <th className="text-right px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const statusColor = LEAD_STATUS_COLORS[lead.status as keyof typeof LEAD_STATUS_COLORS] || "bg-gray-100 text-gray-600";
                  return (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background: "rgba(215,168,79,0.18)", color: "#15104a" }}>
                            {lead.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{lead.fullName}</div>
                            {(lead.city || lead.state) && (
                              <div className="text-xs text-gray-400">
                                {[lead.city, lead.state].filter(Boolean).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-gray-700">{lead.phone}</div>
                        {lead.email && <div className="text-xs text-gray-400">{lead.email}</div>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                          {interestLabels[lead.interest] || lead.interest}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                        {sourceLabels[lead.source] || lead.source}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
                          {statusLabels[lead.status] || lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-500 text-xs">
                        {formatDate(lead.createdAt, "es-MX")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={getWhatsAppUrl(lead.phone, `Hola ${lead.fullName}!`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-[#15104a] hover:bg-[#f8f3ea] transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <Link
                            href={`/admin/leads/${lead.id}`}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Página {page} de {pages} ({total} total)
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/leads?page=${page - 1}`)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              {page < pages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/admin/leads?page=${page + 1}`)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
