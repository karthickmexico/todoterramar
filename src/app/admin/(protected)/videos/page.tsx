export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { VideosManager } from "@/components/admin/videos-manager";

export const metadata: Metadata = {
  title: "Videos | TodoTerramar Admin",
  robots: { index: false },
};

export default async function AdminVideosPage() {
  let videos: Awaited<ReturnType<typeof prisma.video.findMany>> = [];
  try {
    videos = await prisma.video.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch {}

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
      </div>
      <VideosManager videos={videos} />
    </div>
  );
}
