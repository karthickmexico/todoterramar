import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  titleEs: z.string().min(1),
  titleEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  externalUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = schema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const video = await prisma.video.create({ data: result.data });
  return NextResponse.json({ video }, { status: 201 });
}

export async function GET() {
  const videos = await prisma.video.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ videos });
}
