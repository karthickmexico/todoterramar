import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/public/home/hero-section";
import { AboutSection } from "@/components/public/home/about-section";
import { CategoriesSection } from "@/components/public/home/categories-section";
import { BenefitsSection } from "@/components/public/home/benefits-section";
import { AffiliateSection } from "@/components/public/home/affiliate-section";
import { PromotionsPreview } from "@/components/public/home/promotions-preview";
import { VideosPreview } from "@/components/public/home/videos-preview";
import { ProductsPreview } from "@/components/public/home/products-preview";
import { FaqSection } from "@/components/public/home/faq-section";
import { RegisterCta } from "@/components/public/home/register-cta";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.home" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
  };
}


async function getHomeData() {
  try {
    const [promotions, videos, products, rawSliderImages, dbCategories] = await Promise.all([
      prisma.promotion.findMany({
        where: {
          isActive: true,
          OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: 4,
      }),
      prisma.video.findMany({
        where: { isPublished: true },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
        take: 3,
      }),
      prisma.product.findMany({
        where: { isPublished: true, isFeatured: true },
        include: { category: true },
        orderBy: [{ sortOrder: "asc" }],
        take: 6,
      }),
      prisma.promotionSliderImage.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      prisma.productCategory.findMany({
        orderBy: [{ sortOrder: "asc" }],
        select: { slug: true, nameEs: true, nameEn: true },
      }),
    ]);

    // Pass DB banners as-is; HeroSection handles the empty-DB fallback internally
    const sliderImages = rawSliderImages.map(
      ({ id, imageUrl, mobileImageUrl, imageFit, imagePosition, titleEs, titleEn, subtitleEs, subtitleEn, altTextEs, altTextEn, linkUrl, ctaTextEs, ctaTextEn }) => ({
        id, imageUrl, mobileImageUrl, imageFit, imagePosition, titleEs, titleEn, subtitleEs, subtitleEn, altTextEs, altTextEn, linkUrl, ctaTextEs, ctaTextEn,
      })
    );

    return {
      sliderImages,
      dbCategories,
      promotions: promotions.map((p) => ({
        ...p,
        startDate: p.startDate.toISOString(),
        endDate: p.endDate?.toISOString() ?? null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      videos: videos.map((v) => ({
        ...v,
        createdAt: v.createdAt.toISOString(),
        updatedAt: v.updatedAt.toISOString(),
      })),
      products: products.map((p) => ({
        ...p,
        price: p.price !== null ? Number(p.price) : null,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        category: p.category
          ? {
              ...p.category,
              createdAt: p.category.createdAt.toISOString(),
              updatedAt: p.category.updatedAt.toISOString(),
            }
          : null,
      })),
    };
  } catch {
    return {
      promotions: [],
      videos: [],
      products: [],
      sliderImages: [],
      dbCategories: [],
    };
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { promotions, videos, products, sliderImages, dbCategories } = await getHomeData();

  return (
    <>
      {/* 1. Hero banner carousel */}
      <HeroSection locale={locale} sliderImages={sliderImages} />

      {/* 2. About Terramar */}
      <AboutSection locale={locale} />

      {/* 3. Product categories grid */}
      <CategoriesSection locale={locale} dbCategories={dbCategories} />

      {/* 4. Monthly promotions */}
      <PromotionsPreview promotions={promotions} locale={locale} />

      {/* 5. Featured products */}
      <ProductsPreview products={products} locale={locale} />

      {/* 6. Videos */}
      <VideosPreview videos={videos} locale={locale} />

      {/* 7. Benefits of affiliating */}
      <BenefitsSection locale={locale} />

      {/* 8. How to affiliate — steps */}
      <AffiliateSection locale={locale} />

      {/* 9. FAQ */}
      <FaqSection locale={locale} />

      {/* 10. Registration CTA with WhatsApp */}
      <RegisterCta locale={locale} />
    </>
  );
}
