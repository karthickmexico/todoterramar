"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  Tag,
  User,
  Clock,
  Send,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { formatDate, getWhatsAppUrl } from "@/lib/utils";
import { LEAD_STATUS_COLORS } from "@/lib/constants";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

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
  message: string | null;
  followUpDate: Date | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  referrerUrl: string | null;
  landingPage: string | null;
  createdAt: Date;
  notes: Note[];
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
  JOIN_TEAM: "Unirse al equipo",
  BUY_PRODUCTS: "Comprar productos",
  BOTH: "Ambas opciones",
};

const sourceLabels: Record<string, string> = {
  GOOGLE: "Google",
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  REFERRAL: "Referido",
  OTHER: "Otro",
};

export function LeadDetail({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState(lead.notes);
  const [saving, setSaving] = useState(false);
  const [addingNote, setAddingNote] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setSaving(true);
    try {
      await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
    } finally {
      setSaving(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      });
      if (res.ok) {
        const data = await res.json();
        setNotes([data.note, ...notes]);
        setNewNote("");
      }
    } finally {
      setAddingNote(false);
    }
  };

  const statusColor = LEAD_STATUS_COLORS[status as keyof typeof LEAD_STATUS_COLORS] || "bg-gray-100 text-gray-600";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl" style={{ background: "rgba(215,168,79,0.18)", color: "#15104a" }}>
            {lead.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.fullName}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor}`}>
                {statusLabels[status] || status}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                {interestLabels[lead.interest] || lead.interest}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Llamar
          </a>
          <a
            href={getWhatsAppUrl(lead.phone, `Hola ${lead.fullName}! Te contacto de TodoTerramar.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ background: "rgba(215,168,79,0.12)", color: "#15104a" }}
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: info + status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Información de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{lead.email}</span>
                </div>
              )}
              {(lead.city || lead.state) && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">
                    {[lead.city, lead.state].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  Fuente: {sourceLabels[lead.source] || lead.source}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  Registrado: {formatDate(lead.createdAt, "es-MX")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          {lead.message && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Mensaje</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
                  {lead.message}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Notas internas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add note */}
              <div className="flex gap-2">
                <Textarea
                  placeholder="Añadir nota interna..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[80px] text-sm"
                />
              </div>
              <Button
                size="sm"
                onClick={addNote}
                disabled={addingNote || !newNote.trim()}
              >
                <Send className="w-3.5 h-3.5" />
                Agregar nota
              </Button>

              {/* Notes list */}
              {notes.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">{note.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(note.createdAt, "es-MX")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">Sin notas aún</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: status change + UTM */}
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Estado del prospecto</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={updateStatus} disabled={saving}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* UTM data */}
          {(lead.utmSource || lead.utmCampaign || lead.referrerUrl || lead.landingPage) && (
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Datos de marketing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {lead.utmSource && (
                  <div><span className="font-medium">UTM Source:</span> {lead.utmSource}</div>
                )}
                {lead.utmMedium && (
                  <div><span className="font-medium">UTM Medium:</span> {lead.utmMedium}</div>
                )}
                {lead.utmCampaign && (
                  <div><span className="font-medium">UTM Campaign:</span> {lead.utmCampaign}</div>
                )}
                {lead.referrerUrl && (
                  <div className="break-all"><span className="font-medium">Referrer:</span> {lead.referrerUrl}</div>
                )}
                {lead.landingPage && (
                  <div className="break-all"><span className="font-medium">Landing:</span> {lead.landingPage}</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
