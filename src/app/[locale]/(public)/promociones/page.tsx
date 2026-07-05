import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { Sparkles } from "lucide-react";
import { PromoCard } from "@/components/public/promo-card";
import { PromoBeautyStrip, type SliderImageItem } from "@/components/public/promo-beauty-strip";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.promotions" });
  return { title: t("title"), description: t("description") };
}

const FALLBACK_SLIDER_IMAGES: SliderImageItem[] = [
  { id: "fb-1", imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&q=80&auto=format&fit=crop", titleEs: "Skincare Esenciales", titleEn: "Skincare Essentials", altTextEs: null, altTextEn: null, linkUrl: null },
  { id: "fb-2", imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&q=80&auto=format&fit=crop", titleEs: "Colección Maquillaje", titleEn: "Makeup Collection", altTextEs: null, altTextEn: null, linkUrl: null },
  { id: "fb-3", imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&q=80&auto=format&fit=crop", titleEs: "Serum Tratamiento", titleEn: "Serum Treatment", altTextEs: null, altTextEn: null, linkUrl: null },
  { id: "fb-4", imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&q=80&auto=format&fit=crop", titleEs: "Ritual Facial", titleEn: "Facial Ritual", altTextEs: null, altTextEn: null, linkUrl: null },
  { id: "fb-5", imageUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&q=80&auto=format&fit=crop", titleEs: "Hidratante Premium", titleEn: "Premium Moisturizer", altTextEs: null, altTextEn: null, linkUrl: null },
  { id: "fb-6", imageUrl: "https://images.unsplash.com/photo-1583241800698-e8ab01830a09?w=400&h=400&q=80&auto=format&fit=crop", titleEs: "Set Belleza", titleEn: "Beauty Set", altTextEs: null, altTextEn: null, linkUrl: null },
];

async function getPromotions() {
  try {
    return prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

async function getSliderImages(): Promise<SliderImageItem[]> {
  try {
    const rows = await prisma.promotionSliderImage.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.length > 0
      ? rows.map(({ id, imageUrl, titleEs, titleEn, altTextEs, altTextEn, linkUrl }) => ({
          id, imageUrl, titleEs, titleEn, altTextEs, altTextEn, linkUrl,
        }))
      : FALLBACK_SLIDER_IMAGES;
  } catch {
    return FALLBACK_SLIDER_IMAGES;
  }
}

export default async function PromotionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "promotions" });

  const [rawPromotions, sliderImages, settings] = await Promise.all([
    getPromotions(),
    getSliderImages(),
    getSiteSettings(),
  ]);
  const whatsappPhone = settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const promotions = rawPromotions.map((p) => ({
    ...p,
    startDate: p.startDate.toISOString(),
    endDate: p.endDate?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const isExpired = (endDate: string | null) =>
    endDate ? new Date(endDate) < new Date() : false;
  const active = promotions.filter((p) => !isExpired(p.endDate));
  const expired = promotions.filter((p) => isExpired(p.endDate));

  const getTitle = (p: (typeof promotions)[0]) =>
    locale === "en" && p.titleEn ? p.titleEn : p.titleEs;

  return (
    <div className="min-h-screen">

      {/* ── Hero header ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden pt-10 pb-16"
        style={{ background: "linear-gradient(135deg, #08051f 0%, #15104a 55%, #1d1760 100%)" }}
      >
        {/* Gold radial accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 70% 40%, rgba(215,168,79,0.12) 0%, transparent 55%)" }}
        />
        {/* Subtle dot texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(215,168,79,0.8) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full border mb-5"
            style={{ borderColor: "rgba(215,168,79,0.45)", color: "#f3d184", background: "rgba(215,168,79,0.08)" }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: "#d7a84f" }} />
            Ofertas Exclusivas Terramar
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.70)" }}>
            Ofertas especiales para cuidar tu piel, verte increíble y comenzar tu negocio Terramar
          </p>
          <div className="gold-divider max-w-[80px] mx-auto mt-6" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Product showcase strip ────────────────────────────────── */}
        <div className="mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4 text-center"
            style={{ color: "#d7a84f" }}
          >
            Línea de productos
          </p>
          <PromoBeautyStrip images={sliderImages} locale={locale} />
        </div>

        {/* ── No promotions state ───────────────────────────────────── */}
        {active.length === 0 && expired.length === 0 && (
          <div className="text-center py-24">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2"
              style={{ background: "rgba(215,168,79,0.08)", borderColor: "rgba(215,168,79,0.20)" }}
            >
              <Sparkles className="w-10 h-10" style={{ color: "rgba(215,168,79,0.50)" }} />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">Próximas promociones</h2>
            <p className="text-gray-400 max-w-sm mx-auto leading-relaxed">
              {t("noPromotions")}. ¡Vuelve pronto para descubrir nuestras ofertas exclusivas!
            </p>
          </div>
        )}

        {/* ── Active promotions ─────────────────────────────────────── */}
        {active.length > 0 && (
          <>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#d7a84f" }}>
              Promociones activas
            </h2>
            <div
              className={
                active.length === 1
                  ? "grid grid-cols-1 max-w-md"
                  : active.length === 2
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              }
            >
              {active.map((promo) => {
                const title = getTitle(promo);
                return (
                  <PromoCard
                    key={promo.id}
                    promo={promo}
                    title={title}
                    locale={locale}
                    whatsappPhone={whatsappPhone}
                    expired={false}
                    tExpires={t("expires")}
                    tDownload={t("download")}
                    tInquire={t("inquire")}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* ── Expired promotions ────────────────────────────────────── */}
        {expired.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Promociones anteriores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
              {expired.map((promo) => {
                const title = getTitle(promo);
                return (
                  <PromoCard
                    key={promo.id}
                    promo={promo}
                    title={title}
                    locale={locale}
                    whatsappPhone={whatsappPhone}
                    expired={true}
                    tExpires={t("expires")}
                    tDownload={t("download")}
                    tInquire={t("inquire")}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

