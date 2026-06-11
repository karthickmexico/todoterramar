import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://todoterramar.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ["es", "en"];

  const staticPages = [
    "",
    "/sobre-terramar",
    "/unete-al-equipo",
    "/beneficios",
    "/promociones",
    "/videos",
    "/productos",
    "/contacto",
    "/registro",
    "/blog",
    "/privacidad",
    "/terminos",
  ];

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "" ? 1.0 : page === "/registro" ? 0.9 : 0.7,
    }))
  );

  // Blog posts
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, language: true, updatedAt: true },
    });

    blogUrls = posts.map((post) => ({
      url: `${baseUrl}/${post.language.toLowerCase()}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {}

  return [...staticUrls, ...blogUrls];
}
