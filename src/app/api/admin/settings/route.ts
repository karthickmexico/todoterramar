import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  // Upsert each setting key/value
  const ops = Object.entries(body).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: String(value) },
      update: { value: String(value) },
    })
  );

  await prisma.$transaction(ops);

  return NextResponse.json({ success: true });
}

export async function GET() {
  const settings = await prisma.siteSetting.findMany();
  return NextResponse.json({
    settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
  });
}
