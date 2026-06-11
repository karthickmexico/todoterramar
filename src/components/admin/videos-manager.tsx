"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Star, Play, Loader2 } from "lucide-react";
import { extractYouTubeId, getVideoThumbnail } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/image-upload";

interface Video {
  id: string;
  titleEs: string;
  externalUrl: string | null;
  thumbnailUrl: string | null;
  category: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

const schema = z.object({
  titleEs: z.string().min(1),
  titleEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal("")).nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  category: z.string().optional(),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function VideosManager({ videos: initial }: { videos: Video[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isFeatured: false, isPublished: true },
  });

  const watchedThumbnail = watch("thumbnailUrl");

  const openCreate = () => {
    setEditing(null);
    reset({ isFeatured: false, isPublished: true });
    setIsOpen(true);
  };

  const openEdit = (video: Video) => {
    setEditing(video);
    reset({
      titleEs: video.titleEs,
      externalUrl: video.externalUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      category: video.category || "",
      isFeatured: video.isFeatured,
      isPublished: video.isPublished,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/videos/${editing.id}` : "/api/admin/videos";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    if (!confirm("¿Eliminar este video?")) return;
    await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nuevo video
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initial.map((video) => {
          const extUrl = video.externalUrl || "";
          const ytId = extractYouTubeId(extUrl);
          const thumb = video.thumbnailUrl || (extUrl ? getVideoThumbnail(extUrl) : "");

          return (
            <Card key={video.id} className="border-0 shadow-sm overflow-hidden">
              <div className="relative h-36 bg-gray-900">
                {thumb ? (
                  <Image src={thumb} alt={video.titleEs} fill className="object-cover opacity-80" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Play className="w-10 h-10 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/80" />
                </div>
                <div className="absolute top-2 left-2 flex gap-1">
                  {video.isFeatured && <Badge className="bg-amber-500 text-white border-none text-xs">★</Badge>}
                  {!video.isPublished && <Badge variant="secondary" className="text-xs">Draft</Badge>}
                </div>
              </div>
              <CardContent className="p-4">
                <p className="font-medium text-sm text-gray-900 line-clamp-1 mb-2">{video.titleEs}</p>
                {video.category && <p className="text-xs text-gray-400 mb-2">{video.category}</p>}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(video)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => deleteVideo(video.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar video" : "Nuevo video"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Título (Español) *</Label>
              <Input {...register("titleEs")} className="mt-1" />
            </div>
            <div>
              <Label>URL del video (YouTube/Vimeo/directo)</Label>
              <Input {...register("externalUrl")} className="mt-1" placeholder="https://..." />
            </div>
            <div>
              <Label>Miniatura personalizada <span className="text-gray-400 font-normal">(opcional — se usa el thumbnail de YouTube si se deja vacío)</span></Label>
              <div className="mt-1">
                <ImageUpload
                  value={watchedThumbnail}
                  onChange={(url) => setValue("thumbnailUrl", url)}
                  onRemove={() => setValue("thumbnailUrl", "")}
                  folder="videos"
                />
              </div>
            </div>
            <div>
              <Label>Categoría</Label>
              <Input {...register("category")} className="mt-1" placeholder="ej. Productos, Testimonios..." />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea {...register("descriptionEs")} className="mt-1" rows={2} />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch defaultChecked={editing?.isFeatured} onCheckedChange={(v) => setValue("isFeatured", v)} />
                <Label>Destacado</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked={editing?.isPublished ?? true} onCheckedChange={(v) => setValue("isPublished", v)} />
                <Label>Publicado</Label>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
