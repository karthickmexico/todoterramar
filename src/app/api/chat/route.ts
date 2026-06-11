import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

const chatSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(1).max(500),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const { allowed } = checkRateLimit(ip, "chat", {
      maxRequests: 10,
      windowMs: 60_000,
    });
    if (!allowed) {
      return NextResponse.json({ error: "Demasiados intentos" }, { status: 429 });
    }

    const body = await request.json();
    const result = chatSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const inquiry = await prisma.chatInquiry.create({
      data: {
        name: result.data.name,
        phone: result.data.phone || null,
        email: result.data.email || null,
        message: result.data.message,
      },
    });

    return NextResponse.json({ success: true, id: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const inquiries = await prisma.chatInquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ inquiries });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
