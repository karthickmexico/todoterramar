"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, CheckCircle } from "lucide-react";
import { PasswordChangeForm } from "@/components/admin/password-change-form";

// Defined at module level so the reference is stable across renders.
// Inner-function components cause inputs to remount on every state update.
interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
}

function Field({ label, value, onChange, placeholder, type = "text", textarea = false }: FieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      {textarea ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1"
          rows={3}
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1"
        />
      )}
    </div>
  );
}

interface SettingsFormProps {
  settings: Record<string, string>;
}

const SAVE_KEYS = new Set([
  "whatsappNumber", "whatsappDefaultMessage", "location", "businessHours",
  "facebook", "instagram", "youtube", "tiktok",
]);

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(settings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setLoading(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([key]) => SAVE_KEYS.has(key))
      );
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const v = (key: string) => values[key] || "";

  return (
    <div className="space-y-6">
      <Tabs defaultValue="contact">
        <TabsList className="mb-6">
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="social">Redes sociales</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Datos de contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field
                label="Número de WhatsApp (con código de país)"
                value={v("whatsappNumber")}
                onChange={(val) => update("whatsappNumber", val)}
                placeholder="521XXXXXXXXXX"
              />
              <Field
                label="Mensaje predeterminado de WhatsApp"
                value={v("whatsappDefaultMessage")}
                onChange={(val) => update("whatsappDefaultMessage", val)}
                placeholder="¡Hola! Vengo de TodoTerramar..."
                textarea
              />
              <Field
                label="Ciudad / Área de servicio"
                value={v("location")}
                onChange={(val) => update("location", val)}
                placeholder="México"
              />
              <Field
                label="Horario de atención"
                value={v("businessHours")}
                onChange={(val) => update("businessHours", val)}
                placeholder="Lunes a Viernes 9:00 - 18:00"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Redes sociales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field
                label="Facebook (URL completa)"
                value={v("facebook")}
                onChange={(val) => update("facebook", val)}
                placeholder="https://facebook.com/tu-pagina"
              />
              <Field
                label="Instagram (URL completa)"
                value={v("instagram")}
                onChange={(val) => update("instagram", val)}
                placeholder="https://instagram.com/tu-perfil"
              />
              <Field
                label="YouTube (URL completa)"
                value={v("youtube")}
                onChange={(val) => update("youtube", val)}
                placeholder="https://youtube.com/c/tu-canal"
              />
              <Field
                label="TikTok (URL completa)"
                value={v("tiktok")}
                onChange={(val) => update("tiktok", val)}
                placeholder="https://tiktok.com/@tu-perfil"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguridad">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Cambiar contraseña</CardTitle>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={save} disabled={loading} size="lg">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <><CheckCircle className="w-4 h-4" /> Guardado</>
          ) : (
            <><Save className="w-4 h-4" /> Guardar cambios</>
          )}
        </Button>
      </div>
    </div>
  );
}
