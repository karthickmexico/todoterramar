import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const patchSchema = z.object({
  titleEs: z.string().optional(),
  titleEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  pdfUrl: z.string().optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const result = patchSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const data: Record<string, unknown> = { ...result.data };
  if (result.data.startDate) data.startDate = new Date(result.data.startDate);
  if (result.data.endDate) data.endDate = new Date(result.data.endDate);
  if (result.data.endDate === null) data.endDate = null;

  const promo = await prisma.promotion.update({ where: { id }, data });
  return NextResponse.json({ promo });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.promotion.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
