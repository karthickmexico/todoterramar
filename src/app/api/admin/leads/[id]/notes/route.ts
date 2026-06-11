import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

const noteSchema = z.object({
  content: z.string().min(1).max(1000),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const result = noteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const note = await prisma.leadNote.create({
    data: {
      leadId: id,
      content: result.data.content,
    },
  });

  return NextResponse.json({ note });
}
