import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();

    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No se recibió ninguna imagen." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato no permitido. Usa JPG, PNG o WEBP." },
        { status: 400 }
      );
    }

    const maxSize = 15 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "La imagen es demasiado grande. Máximo 15MB." },
        { status: 400 }
      );
    }

    const folderValue = formData.get("folder");
    const folder =
      typeof folderValue === "string" && folderValue.trim()
        ? folderValue.trim()
        : "uploads";

    const originalName = file.name || "image";
    const ext = originalName.split(".").pop()?.toLowerCase() || "png";

    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();

    const pathname = `${folder}/${Date.now()}-${baseName}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al subir la imagen. Intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}
