import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminLogin, setAdminCookie } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    // Strict rate limiting for auth
    const { allowed } = checkRateLimit(ip, "auth", {
      maxRequests: 5,
      windowMs: 15 * 60_000, // 5 per 15 minutes
    });

    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera 15 minutos." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { email, password } = result.data;
    const loginResult = await adminLogin(email, password);

    if (!loginResult.success || !loginResult.token) {
      return NextResponse.json(
        { error: loginResult.error || "Credenciales inválidas" },
        { status: 401 }
      );
    }

    await setAdminCookie(loginResult.token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
