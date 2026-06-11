import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const patchSchema = z.object({
  titleEs: z.string().optional(),
  externalUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  descriptionEs: z.string().optional(),
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

  const video = await prisma.video.update({ where: { id }, data: result.data });
  return NextResponse.json({ video });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.video.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
