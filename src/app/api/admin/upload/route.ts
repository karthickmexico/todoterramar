import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 15 * 1024 * 1024; // 15 MB

const ALLOWED_FOLDERS = ["slider", "promotions", "products", "blog", "videos", "misc"];

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  const rawFolder = (formData.get("folder") as string) || "misc";
  const folder = ALLOWED_FOLDERS.includes(rawFolder) ? rawFolder : "misc";

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No se recibió ningún archivo" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Tipo de archivo no permitido. Usa JPG, PNG o WEBP." },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "El archivo es demasiado grande. Máximo 15 MB." },
      { status: 400 }
    );
  }

  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()
    .slice(0, 40);
  const pathname = `${folder}/${safeName}.${ext}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
