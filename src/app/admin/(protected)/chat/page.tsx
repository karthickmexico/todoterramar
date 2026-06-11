export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { WhatsAppReplyButton } from "@/components/admin/whatsapp-reply-button";

export const metadata: Metadata = {
  title: "Chat / Consultas | TodoTerramar Admin",
  robots: { index: false },
};

async function getInquiries() {
  try {
    return prisma.chatInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch {
    return [];
  }
}

export default async function ChatPage() {
  const inquiries = await getInquiries();
  const unread = inquiries.filter((i) => !i.isRead).length;

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Chat / Consultas</h1>
        {unread > 0 && (
          <Badge className="text-[#08051f]" style={{ background: "linear-gradient(135deg,#f3d184,#d7a84f)" }}>{unread} nuevas</Badge>
        )}
      </div>

      {inquiries.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16 text-gray-500">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            No hay consultas recibidas
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => (
            <Card
              key={inquiry.id}
              className={`border-0 shadow-sm ${!inquiry.isRead ? "border-l-4" : ""}`}
              style={!inquiry.isRead ? { borderLeftColor: "#d7a84f" } : {}}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{inquiry.name}</span>
                      {!inquiry.isRead && (
                        <Badge variant="default" className="text-xs">Nueva</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{inquiry.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      {inquiry.phone && <span>📱 {inquiry.phone}</span>}
                      {inquiry.email && <span>✉️ {inquiry.email}</span>}
                      <span>{formatDate(inquiry.createdAt, "es-MX")}</span>
                    </div>
                  </div>
                  <WhatsAppReplyButton phone={inquiry.phone} name={inquiry.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
