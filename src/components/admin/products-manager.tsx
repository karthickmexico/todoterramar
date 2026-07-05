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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, ShoppingBag, Loader2, BookOpen } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ImageUpload } from "@/components/admin/image-upload";

interface Category { id: string; nameEs: string; }
interface Product {
  id: string;
  nameEs: string;
  price: number | null;
  imageUrl: string | null;
  catalogueUrl: string | null;
  catalogueLabel: string | null;
  availability: string;
  isFeatured: boolean;
  isPublished: boolean;
  category: Category | null;
}

const schema = z.object({
  nameEs: z.string().min(1),
  nameEn: z.string().optional(),
  descriptionEs: z.string().optional(),
  price: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  catalogueUrl: z.string().optional().nullable(),
  catalogueLabel: z.string().optional().nullable(),
  availability: z.enum(["IN_STOCK", "OUT_OF_STOCK", "COMING_SOON"]),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function ProductsManager({ products: initial, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { availability: "IN_STOCK", isFeatured: false, isPublished: true },
  });

  const watchedImageUrl = watch("imageUrl");

  const openCreate = () => {
    setEditing(null);
    reset({ availability: "IN_STOCK", isFeatured: false, isPublished: true });
    setIsOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    reset({
      nameEs: product.nameEs,
      price: product.price ? String(product.price) : "",
      imageUrl: product.imageUrl || "",
      catalogueUrl: product.catalogueUrl || "",
      catalogueLabel: product.catalogueLabel || "",
      availability: product.availability as "IN_STOCK" | "OUT_OF_STOCK" | "COMING_SOON",
      isFeatured: product.isFeatured,
      isPublished: product.isPublished,
      categoryId: product.category?.id || "",
    });
    setIsOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const url = editing ? `/api/admin/products/${editing.id}` : "/api/admin/products";
      const method = editing ? "PATCH" : "POST";
      const payload = {
        ...data,
        price: data.price ? parseFloat(data.price) : null,
        catalogueUrl: data.catalogueUrl?.trim() || null,
        catalogueLabel: data.catalogueLabel?.trim() || null,
      };
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

  const deleteProduct = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const availColors: Record<string, string> = {
    IN_STOCK: "bg-green-100 text-green-700",
    OUT_OF_STOCK: "bg-red-100 text-red-700",
    COMING_SOON: "bg-yellow-100 text-yellow-700",
  };

  const availLabels: Record<string, string> = {
    IN_STOCK: "En stock",
    OUT_OF_STOCK: "Agotado",
    COMING_SOON: "Próximamente",
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {initial.map((product) => (
          <Card key={product.id} className="border-0 shadow-sm overflow-hidden">
            <div className="relative h-32">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.nameEs} fill className="object-cover" />
              ) : (
                <div className="h-full flex items-center justify-center" style={{ background: "#f8f3ea" }}>
                  <ShoppingBag className="w-8 h-8" style={{ color: "rgba(215,168,79,0.50)" }} />
                </div>
              )}
              {!product.isPublished && (
                <div className="absolute top-1 left-1">
                  <Badge variant="secondary" className="text-xs">Draft</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <p className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1">{product.nameEs}</p>
              <p className="text-xs font-bold mb-1" style={{ color: "#15104a" }}>
                {product.price ? formatCurrency(Number(product.price)) : "Consultar"}
              </p>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${availColors[product.availability]}`}>
                {availLabels[product.availability]}
              </span>
              <div className="flex gap-1 mt-2 flex-wrap">
                {product.catalogueUrl && (
                  <a
                    href={product.catalogueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(215,168,79,0.12)", color: "#a07828", border: "1px solid rgba(215,168,79,0.30)" }}
                  >
                    <BookOpen className="w-2.5 h-2.5" />
                    Catálogo
                  </a>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEdit(product)}>
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => deleteProduct(product.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Nombre (Español) *</Label>
              <Input {...register("nameEs")} className="mt-1" />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea {...register("descriptionEs")} className="mt-1" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Precio (MXN)</Label>
                <Input {...register("price")} type="number" step="0.01" className="mt-1" placeholder="0.00" />
              </div>
              <div>
                <Label>Disponibilidad</Label>
                <Select defaultValue="IN_STOCK" onValueChange={(v) => setValue("availability", v as "IN_STOCK" | "OUT_OF_STOCK" | "COMING_SOON")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_STOCK">En stock</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Agotado</SelectItem>
                    <SelectItem value="COMING_SOON">Próximamente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Categoría</Label>
              <Select onValueChange={(v) => setValue("categoryId", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sin categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nameEs}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Imagen</Label>
              <div className="mt-1">
                <ImageUpload
                  value={watchedImageUrl}
                  onChange={(url) => setValue("imageUrl", url)}
                  onRemove={() => setValue("imageUrl", "")}
                  folder="products"
                  hint="Recomendado: 900 × 900 px"
                />
              </div>
            </div>
            {/* Catálogo */}
            <div className="rounded-lg p-3 space-y-3" style={{ background: "rgba(215,168,79,0.05)", border: "1px solid rgba(215,168,79,0.18)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#a07828" }}>Catálogo</p>
              <div>
                <Label>URL del catálogo</Label>
                <p className="text-xs text-gray-400 mt-0.5 mb-1">Puedes pegar aquí el enlace del catálogo, PDF, página externa o recurso relacionado con este producto.</p>
                <Input {...register("catalogueUrl")} className="mt-1" placeholder="https://..." />
              </div>
              <div>
                <Label>Texto del botón</Label>
                <Input {...register("catalogueLabel")} className="mt-1" placeholder="Ver catálogo" />
              </div>
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
