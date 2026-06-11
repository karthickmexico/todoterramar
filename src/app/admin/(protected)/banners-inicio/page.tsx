export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SliderImagesManager } from "@/components/admin/slider-images-manager";

export const metadata: Metadata = {
  title: "Banners de Inicio | TodoTerramar Admin",
  robots: { index: false },
};

export default async function AdminBannersInicioPage() {
  let images: {
    id: string;
    titleEs: string;
    titleEn: string | null;
    subtitleEs: string | null;
    subtitleEn: string | null;
    imageUrl: string;
    mobileImageUrl: string | null;
    imageFit: string;
    imagePosition: string;
    altTextEs: string | null;
    altTextEn: string | null;
    linkUrl: string | null;
    ctaTextEs: string | null;
    ctaTextEn: string | null;
    sortOrder: number;
    isPublished: boolean;
  }[] = [];

  try {
    images = await prisma.promotionSliderImage.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {}

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Banners de Inicio</h1>
        <p className="text-sm text-gray-500 mt-1">
          Controla el carrusel principal de la página de inicio. Las imágenes activas se muestran en el banner hero al entrar al sitio.
        </p>
      </div>
      <SliderImagesManager images={images} />
    </div>
  );
}
