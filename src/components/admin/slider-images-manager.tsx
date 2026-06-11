"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, GripVertical, ImageIcon, ExternalLink, Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SliderImage {
  id: string;
  titleEs: string;
  titleEn: string | null;
  subtitleEs: string | null;
  subtitleEn: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  imageFit: string;
  imagePosition: string;
  altTextEs: string | null;
  altTextEn: string | null;
  linkUrl: string | null;
  ctaTextEs: string | null;
  ctaTextEn: string | null;
  sortOrder: number;
  isPublished: boolean;
}

const schema = z.object({
  titleEs:        z.string().min(1, "El título es requerido"),
  titleEn:        z.string().optional(),
  subtitleEs:     z.string().optional(),
  subtitleEn:     z.string().optional(),
  imageUrl:       z.string().min(1, "La imagen es requerida"),
  mobileImageUrl: z.string().optional().nullable(),
  imageFit:       z.enum(["contain", "cover"]),
  imagePosition:  z.enum(["center", "top", "bottom", "left", "right"]),
  altTextEs:      z.string().optional(),
  altTextEn:      z.string().optional(),
  linkUrl:        z.string().url("URL inválida").optional().or(z.literal("")),
  ctaTextEs:      z.string().optional(),
  ctaTextEn:      z.string().optional(),
  sortOrder:      z.number().int(),
  isPublished:    z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface SliderImagesManagerProps {
  images: SliderImage[];
}

export function SliderImagesManager({ images: initial }: SliderImagesManagerProps) {
  const router = useRouter();
  const [images, setImages] = useState(initial);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<SliderImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPublished: true, sortOrder: 0, imageFit: "contain", imagePosition: "center" },
  });

  const watchedImageUrl      = watch("imageUrl");
  const watchedMobileUrl     = watch("mobileImageUrl");
  const watchedPublished     = watch("isPublished");

  const openCreate = () => {
    setEditing(null);
    reset({ isPublished: true, sortOrder: images.length, imageFit: "contain", imagePosition: "center" });
    setIsOpen(true);
  };

  const openEdit = (img: SliderImage) => {
    setEditing(img);
    reset({
      titleEs:        img.titleEs,
      titleEn:        img.titleEn ?? "",
      subtitleEs:     img.subtitleEs ?? "",
      subtitleEn:     img.subtitleEn ?? "",
      imageUrl:       img.imageUrl,
      mobileImageUrl: img.mobileImageUrl ?? "",
      imageFit:       (img.imageFit as "contain" | "cover") || "contain",
      imagePosition:  (img.imagePosition as "center" | "top" | "bottom" | "left" | "right") || "center",
      altTextEs:      img.altTextEs ?? "",
      altTextEn:      img.altTextEn ?? "",
      linkUrl:        img.linkUrl ?? "",
      ctaTextEs:      img.ctaTextEs ?? "",
      ctaTextEn:      img.ctaTextEn ?? "",
      sortOrder:      img.sortOrder,
      isPublished:    img.isPublished,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url = editing
        ? `/api/admin/slider-images/${editing.id}`
        : "/api/admin/slider-images";
      const method = editing ? "PATCH" : "POST";
      const payload = { ...data, linkUrl: data.linkUrl || null };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (img: SliderImage) => {
    const res = await fetch(`/api/admin/slider-images/${img.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !img.isPublished }),
    });
    if (res.ok) {
      setImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, isPublished: !img.isPublished } : i))
      );
    }
  };

  const deleteImage = async (id: string) => {
    if (!confirm("¿Eliminar esta imagen del slider?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/slider-images/${id}`, { method: "DELETE" });
      setImages((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            {images.length} {images.length === 1 ? "imagen" : "imágenes"} en el slider
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Añadir imagen
        </Button>
      </div>

      {/* Empty state */}
      {images.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-medium text-gray-600 mb-1">No hay imágenes en el slider</p>
            <p className="text-sm text-gray-400 mb-4">
              Añade imágenes para mostrarlas en la sección de Promociones del mes.
            </p>
            <Button onClick={openCreate} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Añadir primera imagen
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <Card
              key={img.id}
              className={cn(
                "overflow-hidden transition-all",
                !img.isPublished && "opacity-60"
              )}
            >
              {/* Thumbnail — navy bg + contain so full banner is always visible */}
              <div className="relative h-44 bg-[#09071f]">
                <Image
                  src={img.imageUrl}
                  alt={img.altTextEs ?? img.titleEs}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  {img.isPublished ? (
                    <Badge className="bg-green-500 text-white text-[10px]">Publicada</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">Oculta</Badge>
                  )}
                </div>
                {/* Sort order badge */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <GripVertical className="w-3 h-3" />
                  #{img.sortOrder}
                </div>
              </div>

              <CardContent className="p-4">
                <p className="font-semibold text-gray-900 text-sm truncate mb-0.5">
                  {img.titleEs}
                </p>
                {img.titleEn && (
                  <p className="text-xs text-gray-400 truncate mb-2">{img.titleEn}</p>
                )}
                {img.linkUrl && (
                  <a
                    href={img.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-500 hover:underline truncate mb-2"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {img.linkUrl}
                  </a>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(img)}
                    className="flex-1 h-8 text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <button
                    onClick={() => togglePublish(img)}
                    title={img.isPublished ? "Ocultar" : "Publicar"}
                    className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {img.isPublished ? (
                      <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-green-600" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteImage(img.id)}
                    disabled={deletingId === img.id}
                    title="Eliminar"
                    className="h-8 w-8 flex items-center justify-center rounded-md border border-red-200 hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                  >
                    {deletingId === img.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar banner" : "Añadir banner de inicio"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Image upload */}
            <div>
              <Label>
                Imagen del banner <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1">
                <ImageUpload
                  value={watchedImageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  folder="slider"
                  hint="Recomendado: 1920 × 800 px o 1920 × 900 px para mejor calidad"
                />
              </div>
              {errors.imageUrl && (
                <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message}</p>
              )}
            </div>

            {/* Image display settings */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Ajuste de imagen</Label>
                <Select
                  defaultValue={editing?.imageFit || "contain"}
                  onValueChange={(v) => setValue("imageFit", v as "contain" | "cover")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contain">Mostrar completa</SelectItem>
                    <SelectItem value="cover">Cubrir área</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-gray-400 mt-0.5">Para banners Terramar: Mostrar completa</p>
              </div>
              <div>
                <Label>Posición</Label>
                <Select
                  defaultValue={editing?.imagePosition || "center"}
                  onValueChange={(v) => setValue("imagePosition", v as "center" | "top" | "bottom" | "left" | "right")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="top">Arriba</SelectItem>
                    <SelectItem value="bottom">Abajo</SelectItem>
                    <SelectItem value="left">Izquierda</SelectItem>
                    <SelectItem value="right">Derecha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile image */}
            <div>
              <Label>Imagen móvil <span className="text-gray-400 font-normal">(opcional)</span></Label>
              <div className="mt-1">
                <ImageUpload
                  value={watchedMobileUrl}
                  onChange={(url) => setValue("mobileImageUrl", url)}
                  onRemove={() => setValue("mobileImageUrl", "")}
                  folder="slider"
                  hint="Recomendado: 1080 × 1350 px para móvil"
                />
              </div>
            </div>

            {/* Title ES */}
            <div>
              <Label htmlFor="titleEs">
                Título (Español) <span className="text-red-500">*</span>
              </Label>
              <Input id="titleEs" {...register("titleEs")} placeholder="Promociones del Mes" />
              {errors.titleEs && (
                <p className="text-xs text-red-500 mt-1">{errors.titleEs.message}</p>
              )}
            </div>

            {/* Title EN */}
            <div>
              <Label htmlFor="titleEn">Título (Inglés)</Label>
              <Input id="titleEn" {...register("titleEn")} placeholder="Monthly Promotions" />
            </div>

            {/* Subtitle ES */}
            <div>
              <Label htmlFor="subtitleEs">Subtítulo (Español)</Label>
              <Input id="subtitleEs" {...register("subtitleEs")} placeholder="Descubre nuestra colección exclusiva" />
            </div>

            {/* Subtitle EN */}
            <div>
              <Label htmlFor="subtitleEn">Subtítulo (Inglés)</Label>
              <Input id="subtitleEn" {...register("subtitleEn")} placeholder="Discover our exclusive collection" />
            </div>

            {/* Alt Text ES */}
            <div>
              <Label htmlFor="altTextEs">Texto alternativo (Español)</Label>
              <Input
                id="altTextEs"
                {...register("altTextEs")}
                placeholder="Banner promociones Terramar"
              />
            </div>

            {/* Alt Text EN */}
            <div>
              <Label htmlFor="altTextEn">Texto alternativo (Inglés)</Label>
              <Input
                id="altTextEn"
                {...register("altTextEn")}
                placeholder="Terramar promotions banner"
              />
            </div>

            {/* Link URL + CTA text */}
            <div className="p-3 bg-gray-50 rounded-lg space-y-3">
              <p className="text-xs font-medium text-gray-600">Enlace del banner (opcional)</p>
              <div>
                <Label htmlFor="linkUrl">URL de destino</Label>
                <Input
                  id="linkUrl"
                  {...register("linkUrl")}
                  placeholder="https://ejemplo.com/productos"
                  className="mt-1"
                />
                {errors.linkUrl && (
                  <p className="text-xs text-red-500 mt-1">{errors.linkUrl.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ctaTextEs">Texto del botón (ES)</Label>
                  <Input id="ctaTextEs" {...register("ctaTextEs")} placeholder="Ver más" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="ctaTextEn">Texto del botón (EN)</Label>
                  <Input id="ctaTextEn" {...register("ctaTextEn")} placeholder="View more" className="mt-1" />
                </div>
              </div>
            </div>

            {/* Sort order */}
            <div>
              <Label htmlFor="sortOrder">Orden</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register("sortOrder", { valueAsNumber: true })}
                placeholder="0"
              />
              <p className="text-xs text-gray-400 mt-1">
                Número más bajo = aparece primero en el carrusel.
              </p>
            </div>

            {/* Published toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Label>Publicada</Label>
                <p className="text-xs text-gray-400">Visible en la página de inicio</p>
              </div>
              <Switch
                checked={watchedPublished}
                onCheckedChange={(v) => setValue("isPublished", v)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editing ? "Guardar cambios" : "Añadir imagen"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
