import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const updateSchema = z.object({
  status: z
    .enum(["NEW", "CONTACTED", "FOLLOW_UP", "AFFILIATED", "BUYER", "NOT_INTERESTED"])
    .optional(),
  followUpDate: z.string().datetime().optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const result = updateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      ...(result.data.status && { status: result.data.status }),
      ...(result.data.followUpDate !== undefined && {
        followUpDate: result.data.followUpDate ? new Date(result.data.followUpDate) : null,
      }),
    },
  });

  // Log audit
  await prisma.auditLog.create({
    data: {
      userId: session.userId,
      action: "UPDATE_LEAD_STATUS",
      entity: "Lead",
      entityId: id,
      details: JSON.stringify(result.data),
    },
  });

  return NextResponse.json({ lead });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.lead.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
