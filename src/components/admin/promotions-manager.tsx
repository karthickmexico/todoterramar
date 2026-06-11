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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { formatDate, isVideoExpired } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/image-upload";

interface Promotion {
  id: string;
  titleEs: string;
  titleEn: string | null;
  descriptionEs: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  sortOrder: number;
}

const schema = z.object({
  titleEs: z.string().min(1, "El título es requerido"),
  titleEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  descriptionEn: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  pdfUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.string(),
  endDate: z.string().optional(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function PromotionsManager({ promotions: initial }: { promotions: Promotion[] }) {
  const router = useRouter();
  const [promotions, setPromotions] = useState(initial);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isActive: true, startDate: new Date().toISOString().split("T")[0] },
  });

  const watchedImageUrl = watch("imageUrl");

  const openCreate = () => {
    setEditing(null);
    reset({ isActive: true, startDate: new Date().toISOString().split("T")[0] });
    setIsOpen(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditing(promo);
    reset({
      titleEs: promo.titleEs,
      titleEn: promo.titleEn || "",
      descriptionEs: promo.descriptionEs || "",
      imageUrl: promo.imageUrl || "",
      pdfUrl: promo.pdfUrl || "",
      startDate: new Date(promo.startDate).toISOString().split("T")[0],
      endDate: promo.endDate ? new Date(promo.endDate).toISOString().split("T")[0] : "",
      isActive: promo.isActive,
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url = editing
        ? `/api/admin/promotions/${editing.id}`
        : "/api/admin/promotions";
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

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/promotions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  };

  const deletePromo = async (id: string) => {
    if (!confirm("¿Eliminar esta promoción?")) return;
    await fetch(`/api/admin/promotions/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nueva promoción
        </Button>
      </div>

      {promotions.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="text-center py-16 text-gray-500">
            No hay promociones aún
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map((promo) => {
            const expired = promo.endDate ? isVideoExpired(promo.endDate) : false;
            return (
              <Card key={promo.id} className="border-0 shadow-sm overflow-hidden">
                {promo.imageUrl ? (
                  <div className="relative h-40">
                    <Image src={promo.imageUrl} alt={promo.titleEs} fill className="object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {expired && <Badge variant="secondary">Expirada</Badge>}
                      {!promo.isActive && <Badge variant="secondary">Inactiva</Badge>}
                    </div>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center" style={{ background: "#f8f3ea" }}>
                    <span className="text-4xl">🌸</span>
                  </div>
                )}
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{promo.titleEs}</h3>
                  {promo.endDate && (
                    <p className="text-xs text-gray-500 mb-3">
                      Vigente hasta: {formatDate(promo.endDate, "es-MX")}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={promo.isActive}
                      onCheckedChange={() => toggleActive(promo.id, promo.isActive)}
                    />
                    <span className="text-xs text-gray-500">
                      {promo.isActive ? "Activa" : "Inactiva"}
                    </span>
                    <div className="ml-auto flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(promo)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deletePromo(promo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar promoción" : "Nueva promoción"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Título (Español) *</Label>
              <Input {...register("titleEs")} className="mt-1" />
              {errors.titleEs && <p className="text-xs text-red-500">{errors.titleEs.message}</p>}
            </div>
            <div>
              <Label>Título (English)</Label>
              <Input {...register("titleEn")} className="mt-1" />
            </div>
            <div>
              <Label>Descripción (Español)</Label>
              <Textarea {...register("descriptionEs")} className="mt-1" rows={3} />
            </div>
            <div>
              <Label>Imagen</Label>
              <div className="mt-1">
                <ImageUpload
                  value={watchedImageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  onRemove={() => setValue("imageUrl", "")}
                  folder="promotions"
                  hint="Recomendado: 900 × 600 px"
                />
              </div>
            </div>
            <div>
              <Label>URL del PDF</Label>
              <Input {...register("pdfUrl")} className="mt-1" placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha inicio</Label>
                <Input {...register("startDate")} type="date" className="mt-1" />
              </div>
              <div>
                <Label>Fecha fin</Label>
                <Input {...register("endDate")} type="date" className="mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                defaultChecked={editing?.isActive ?? true}
                onCheckedChange={(v) => setValue("isActive", v)}
              />
              <Label>Activa</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancelar
              </Button>
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
