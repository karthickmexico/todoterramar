import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await prisma.blogPost
    .findUnique({ where: { slug } })
    .catch(() => null);
  if (!post) return { title: "Artículo no encontrado" };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params;

  const post = await prisma.blogPost
    .findUnique({
      where: { slug, isPublished: true },
    })
    .catch(() => null);

  if (!post) notFound();

  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#15104a] mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        {post.coverImage && (
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          {post.publishedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt, locale === "en" ? "en-US" : "es-MX")}
              </time>
            </div>
          )}
        </header>

        <div
          className="prose max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(243,209,132,0.08)", border: "1px solid rgba(215,168,79,0.18)" }}>
            <h3 className="font-bold text-gray-900 mb-2">
              ¿Te interesa unirte al equipo Terramar?
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Regístrate y uno de nuestros asesores te contactará
            </p>
            <Button asChild>
              <Link href={`/${locale}/registro`}>
                Registrarme ahora
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
