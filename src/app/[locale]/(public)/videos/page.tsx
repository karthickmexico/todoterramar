import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Play, Star } from "lucide-react";
import { extractYouTubeId, getVideoThumbnail } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Videos de Capacitación | TodoTerramar",
    description:
      "Aprende sobre Terramar con nuestros videos de capacitación sobre productos y negocios.",
  };
}

async function getVideos() {
  try {
    return prisma.video.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

function VideoCard({
  video,
  locale,
  featured,
}: {
  video: Awaited<ReturnType<typeof getVideos>>[0];
  locale: string;
  featured?: boolean;
}) {
  const title = locale === "en" && video.titleEn ? video.titleEn : video.titleEs;
  const desc = locale === "en" && video.descriptionEn ? video.descriptionEn : video.descriptionEs;
  const externalUrl = video.externalUrl || "";
  const ytId = externalUrl ? extractYouTubeId(externalUrl) : null;
  const thumb = video.thumbnailUrl || (externalUrl ? getVideoThumbnail(externalUrl) : "");

  const videoSrc = ytId
    ? `https://www.youtube.com/embed/${ytId}`
    : video.videoUrl || externalUrl;

  return (
    <div
      id={video.id}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 ${featured ? "md:col-span-2" : ""}`}
    >
      {/* Video embed or thumbnail */}
      {ytId ? (
        <div className={`relative ${featured ? "aspect-video" : "h-48"}`}>
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : thumb ? (
        <div className={`relative ${featured ? "h-64" : "h-48"}`}>
          <Image src={thumb} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 ml-1" style={{ color: "#15104a" }} />
            </div>
          </div>
        </div>
      ) : (
        <div className={`${featured ? "h-64" : "h-48"} flex items-center justify-center`} style={{ background: "#f8f3ea" }}>
          <Play className="w-12 h-12" style={{ color: "rgba(215,168,79,0.60)" }} />
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {video.isFeatured && (
            <Badge className="bg-amber-500 text-white border-none text-xs">
              <Star className="w-3 h-3 mr-1" />
              Destacado
            </Badge>
          )}
          {video.category && (
            <Badge variant="secondary" className="text-xs">
              {video.category}
            </Badge>
          )}
        </div>
        <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
        {desc && <p className="text-sm text-gray-600 line-clamp-2">{desc}</p>}
      </div>
    </div>
  );
}

function VideosContent({
  videos,
  locale,
}: {
  videos: Awaited<ReturnType<typeof getVideos>>;
  locale: string;
}) {
  const t = useTranslations("videos");
  const featured = videos.filter((v) => v.isFeatured);
  const regular = videos.filter((v) => !v.isFeatured);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
          <p className="text-xl text-gray-600">{t("subtitle")}</p>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Play className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t("noVideos")}</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  {t("featured")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((v) => (
                    <VideoCard key={v.id} video={v} locale={locale} featured />
                  ))}
                </div>
              </section>
            )}

            {regular.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {regular.map((v) => (
                  <VideoCard key={v.id} video={v} locale={locale} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const videos = await getVideos();
  return <VideosContent videos={videos} locale={locale} />;
}
