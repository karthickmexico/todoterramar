export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogManager } from "@/components/admin/blog-manager";

export const metadata: Metadata = {
  title: "Blog | TodoTerramar Admin",
  robots: { index: false },
};

export default async function AdminBlogPage() {
  let posts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch {}

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog / Contenido</h1>
        <p className="text-gray-500 mt-1">Gestiona artículos para mejorar el SEO</p>
      </div>
      <BlogManager posts={posts} />
    </div>
  );
}
