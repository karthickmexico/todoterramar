import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  titleEs:        z.string().min(1, "El título es requerido"),
  titleEn:        z.string().optional(),
  subtitleEs:     z.string().optional(),
  subtitleEn:     z.string().optional(),
  imageUrl:       z.string().min(1, "La imagen es requerida"),
  mobileImageUrl: z.string().optional().nullable(),
  imageFit:       z.string().optional().default("contain"),
  imagePosition:  z.string().optional().default("center"),
  altTextEs:      z.string().optional(),
  altTextEn:      z.string().optional(),
  linkUrl:        z.string().url().optional().or(z.literal("")).nullable(),
  ctaTextEs:      z.string().optional(),
  ctaTextEn:      z.string().optional(),
  sortOrder:      z.number().int().default(0),
  isPublished:    z.boolean().default(true),
});

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const images = await prisma.promotionSliderImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "Invalid", details: result.error.flatten() }, { status: 400 });
  }

  const image = await prisma.promotionSliderImage.create({ data: result.data });
  return NextResponse.json({ image }, { status: 201 });
}
