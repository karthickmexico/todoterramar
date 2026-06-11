import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const patchSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  language: z.enum(["ES", "EN"]).optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const result = patchSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const data: Record<string, unknown> = { ...result.data };
  if (result.data.isPublished) {
    data.publishedAt = new Date();
  }

  const post = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json({ post });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
