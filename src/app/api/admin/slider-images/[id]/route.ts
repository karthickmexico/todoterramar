import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const patchSchema = z.object({
  titleEs:        z.string().min(1).optional(),
  titleEn:        z.string().optional(),
  subtitleEs:     z.string().optional(),
  subtitleEn:     z.string().optional(),
  imageUrl:       z.string().optional(),
  mobileImageUrl: z.string().optional().nullable(),
  imageFit:       z.string().optional(),
  imagePosition:  z.string().optional(),
  altTextEs:      z.string().optional(),
  altTextEn:      z.string().optional(),
  linkUrl:        z.string().url().optional().or(z.literal("")).nullable(),
  ctaTextEs:      z.string().optional(),
  ctaTextEn:      z.string().optional(),
  sortOrder:      z.number().int().optional(),
  isPublished:    z.boolean().optional(),
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
  if (!result.success) {
    return NextResponse.json({ error: "Invalid", details: result.error.flatten() }, { status: 400 });
  }

  const image = await prisma.promotionSliderImage.update({ where: { id }, data: result.data });
  return NextResponse.json({ image });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.promotionSliderImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
