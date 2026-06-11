"use client";

import React, { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen, Loader2, ExternalLink } from "lucide-react";
import { formatDate, slugify } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/image-upload";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  language: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  language: z.enum(["ES", "EN"]),
  isPublished: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function BlogManager({ posts: initial }: { posts: BlogPost[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors }, } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { language: "ES", isPublished: false },
  });

  const watchTitle = watch("title");
  const watchedCoverImage = watch("coverImage");

  const openCreate = () => {
    setEditing(null);
    reset({ language: "ES", isPublished: false });
    setIsOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    reset({
      title: post.title,
      slug: post.slug,
      language: post.language as "ES" | "EN",
      isPublished: post.isPublished,
    });
    setIsOpen(true);
  };

  const autoSlug = () => {
    if (watchTitle) setValue("slug", slugify(watchTitle));
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/blog/${editing.id}` : "/api/admin/blog";
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

  const deletePost = async (id: string) => {
    if (!confirm("¿Eliminar este artículo?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nuevo artículo
        </Button>
      </div>

      {initial.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16 text-gray-500">
            <BookOpen className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            No hay artículos aún. Crea el primer artículo SEO.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {initial.map((post) => (
            <Card key={post.id} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                    <Badge variant={post.isPublished ? "default" : "secondary"} className="text-xs">
                      {post.isPublished ? "Publicado" : "Borrador"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{post.language}</Badge>
                  </div>
                  <p className="text-xs text-gray-400">
                    /{post.language.toLowerCase()}/blog/{post.slug} ·{" "}
                    {formatDate(post.createdAt, "es-MX")}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar artículo" : "Nuevo artículo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                {...register("title")}
                className="mt-1"
                onBlur={!editing ? autoSlug : undefined}
              />
            </div>
            <div>
              <Label>Slug (URL)</Label>
              <div className="flex gap-2 mt-1">
                <Input {...register("slug")} />
                <Button type="button" variant="outline" size="sm" onClick={autoSlug}>
                  Auto
                </Button>
              </div>
            </div>
            <div>
              <Label>Idioma</Label>
              <Select
                defaultValue={editing?.language || "ES"}
                onValueChange={(v) => setValue("language", v as "ES" | "EN")}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ES">Español</SelectItem>
                  <SelectItem value="EN">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Extracto (para listas)</Label>
              <Textarea {...register("excerpt")} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>Contenido *</Label>
              <Textarea {...register("content")} className="mt-1" rows={8} placeholder="Escribe el artículo aquí (HTML o texto plano)..." />
              {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
            </div>
            <div>
              <Label>Imagen de portada</Label>
              <div className="mt-1">
                <ImageUpload
                  value={watchedCoverImage}
                  onChange={(url) => setValue("coverImage", url)}
                  onRemove={() => setValue("coverImage", "")}
                  folder="blog"
                  hint="Recomendado: 1200 × 630 px"
                />
              </div>
            </div>
            <div>
              <Label>SEO Título</Label>
              <Input {...register("seoTitle")} className="mt-1" />
            </div>
            <div>
              <Label>SEO Descripción</Label>
              <Textarea {...register("seoDesc")} className="mt-1" rows={2} />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                defaultChecked={editing?.isPublished}
                onCheckedChange={(v) => setValue("isPublished", v)}
              />
              <Label>Publicar</Label>
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
