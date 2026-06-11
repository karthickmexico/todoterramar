import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  language: z.enum(["ES", "EN"]).default("ES"),
  isPublished: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = schema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const post = await prisma.blogPost.create({
    data: {
      ...result.data,
      publishedAt: result.data.isPublished ? new Date() : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
