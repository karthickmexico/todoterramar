import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const schema = z.object({
  nameEs: z.string().min(1),
  nameEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  price: z.number().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  catalogueUrl: z.string().url().optional().nullable(),
  catalogueLabel: z.string().optional().nullable(),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "COMING_SOON"]).default("IN_STOCK"),
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

  const product = await prisma.product.create({ data: result.data });
  return NextResponse.json({ product }, { status: 201 });
}
