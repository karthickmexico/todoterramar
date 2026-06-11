import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog Terramar México | TodoTerramar",
  description:
    "Artículos sobre cómo vender Terramar, afiliarse, productos y más.",
};

async function getBlogPosts(locale: string) {
  try {
    return prisma.blogPost.findMany({
      where: {
        isPublished: true,
        language: locale.toUpperCase() === "EN" ? "EN" : "ES",
      },
      orderBy: { publishedAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = await getBlogPosts(locale);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600">
            Artículos y consejos sobre Terramar México
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay artículos publicados aún</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                {post.coverImage ? (
                  <div className="relative h-48">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center" style={{ background: "rgba(243,209,132,0.12)" }}>
                    <BookOpen className="w-12 h-12" style={{ color: "rgba(215,168,79,0.55)" }} />
                  </div>
                )}
                <div className="p-5">
                  {post.publishedAt && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(post.publishedAt, locale === "en" ? "en-US" : "es-MX")}
                    </div>
                  )}
                  <h2 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{post.excerpt}</p>
                  )}
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="text-sm font-semibold hover:underline"
                    style={{ color: "#15104a" }}
                  >
                    Leer más →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
