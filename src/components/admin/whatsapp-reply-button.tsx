"use client";

import { Phone } from "lucide-react";
import { normalizeMxPhone } from "@/lib/utils";

interface WhatsAppReplyButtonProps {
  phone?: string | null;
  name?: string | null;
}

export function WhatsAppReplyButton({ phone, name }: WhatsAppReplyButtonProps) {
  if (!phone) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-400 select-none cursor-not-allowed flex-shrink-0">
        <Phone className="w-3.5 h-3.5" />
        Sin número
      </span>
    );
  }

  const normalized = normalizeMxPhone(phone);
  const message = `Hola ${name ?? ""}, gracias por contactarnos en Todo Terramar. ¿En qué podemos ayudarte?`;
  const url = `https://web.whatsapp.com/send?phone=${normalized}&text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 font-medium"
      style={{ background: "rgba(21,16,74,0.08)", color: "#15104a" }}
    >
      <Phone className="w-3.5 h-3.5" />
      WhatsApp
    </a>
  );
}
