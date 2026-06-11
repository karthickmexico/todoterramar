import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { currentPassword, newPassword } = body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "La nueva contraseña debe tener al menos 8 caracteres" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user || !user.password) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const isValid = await verifyPassword(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "La contraseña actual no es correcta" },
      { status: 401 }
    );
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

  return NextResponse.json({ success: true, message: "Contraseña actualizada correctamente" });
}
