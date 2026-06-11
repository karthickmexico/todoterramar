import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Video } from "lucide-react";
import { extractYouTubeId, getVideoThumbnail } from "@/lib/utils";

interface Video {
  id: string;
  titleEs: string;
  titleEn: string | null;
  descriptionEs: string | null;
  videoUrl: string | null;
  externalUrl: string | null;
  thumbnailUrl: string | null;
  isFeatured: boolean;
  category: string | null;
}

interface VideosPreviewProps {
  videos: Video[];
  locale: string;
}

export function VideosPreview({ videos, locale }: VideosPreviewProps) {
  const t = useTranslations("videos");

  if (videos.length === 0) return null;

  return (
    <section className="section bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full border mb-4"
              style={{ background: "rgba(243,209,132,0.20)", color: "#15104a", borderColor: "rgba(215,168,79,0.35)" }}
            >
              <Video className="w-3.5 h-3.5" style={{ color: "#d7a84f" }} />
              Contenido exclusivo
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500 mt-2">{t("subtitle")}</p>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex flex-shrink-0 transition-colors"
            style={{ borderColor: "rgba(215,168,79,0.40)", color: "#15104a" }}
          >
            <Link href={`/${locale}/videos`}>{t("viewAll")} <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, i) => {
            const title = locale === "en" && video.titleEn ? video.titleEn : video.titleEs;
            const externalUrl = video.externalUrl || "";
            const thumb = video.thumbnailUrl || (externalUrl ? getVideoThumbnail(externalUrl) : "");
            const isFeaturedLayout = i === 0 && videos.length >= 3;

            return (
              <Link
                key={video.id}
                href={`/${locale}/videos`}
                className={`group relative rounded-2xl overflow-hidden bg-gray-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isFeaturedLayout ? "md:col-span-2" : ""}`}
              >
                {/* Thumbnail */}
                <div className={`relative ${isFeaturedLayout ? "h-72" : "h-52"}`}>
                  {thumb ? (
                    <Image
                      src={thumb}
                      alt={title}
                      fill
                      className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 33vw"
                    />
                  ) : (
                    <div
                      className="h-full"
                      style={{ background: "linear-gradient(135deg, #08051f, #15104a)" }}
                    />
                  )}
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                    <Play className="w-6 h-6 ml-0.5" style={{ color: "#15104a" }} />
                  </div>
                </div>

                {/* Meta */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    {video.isFeatured && (
                      <span className="bg-amber-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        ★ Destacado
                      </span>
                    )}
                    {video.category && (
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                        {video.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-sm line-clamp-2 leading-snug">{title}</h3>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button
            asChild
            variant="outline"
            style={{ borderColor: "rgba(215,168,79,0.40)", color: "#15104a" }}
          >
            <Link href={`/${locale}/videos`}>{t("viewAll")} <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
