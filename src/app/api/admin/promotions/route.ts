import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const promoSchema = z.object({
  titleEs: z.string().min(1),
  titleEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  pdfUrl: z.string().url().optional().or(z.literal("")).nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = promoSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const promo = await prisma.promotion.create({
    data: {
      ...result.data,
      startDate: new Date(result.data.startDate),
      endDate: result.data.endDate ? new Date(result.data.endDate) : null,
      imageUrl: result.data.imageUrl || null,
      pdfUrl: result.data.pdfUrl || null,
    },
  });

  return NextResponse.json({ promo }, { status: 201 });
}

export async function GET() {
  const promos = await prisma.promotion.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ promos });
}
