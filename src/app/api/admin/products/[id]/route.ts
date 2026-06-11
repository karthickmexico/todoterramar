import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const patchSchema = z.object({
  nameEs: z.string().optional(),
  descriptionEs: z.string().optional(),
  price: z.number().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "COMING_SOON"]).optional(),
  isFeatured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const result = patchSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const product = await prisma.product.update({ where: { id }, data: result.data });
  return NextResponse.json({ product });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
