"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, CheckCircle, TriangleAlert } from "lucide-react";
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
  hint?: string;
}

function Field({ label, value, onChange, placeholder, type = "text", textarea = false, hint }: FieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      {hint && <p className="text-xs text-gray-400 mt-0.5 mb-1">{hint}</p>}
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

interface CodeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}

function CodeField({ label, value, onChange, placeholder, hint }: CodeFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      {hint && <p className="text-xs text-gray-400 mt-0.5 mb-1">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={7}
        spellCheck={false}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        style={{ fontFamily: "monospace", fontSize: "12px", minHeight: "160px", resize: "vertical" }}
      />
    </div>
  );
}

interface SettingsFormProps {
  settings: Record<string, string>;
}

const SAVE_KEYS = new Set([
  // Contact
  "whatsappNumber", "whatsappDefaultMessage", "location", "businessHours",
  // Social
  "facebook", "instagram", "youtube", "tiktok",
  // SEO
  "siteTitle", "siteDescription", "seoKeywords", "defaultOgImageUrl", "googleSearchConsoleCode",
  // Tracking
  "googleAnalyticsId", "googleTagManagerId", "metaPixelId", "tiktokPixelId",
  // Custom code
  "customHeadCode", "customBodyStartCode", "customBodyEndCode",
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
        <TabsList className="mb-6 flex-wrap h-auto gap-1">
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="social">Redes sociales</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="seo">SEO / Scripts</TabsTrigger>
        </TabsList>

        {/* ── Contacto ─────────────────────────────────────────────── */}
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

        {/* ── Redes sociales ───────────────────────────────────────── */}
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

        {/* ── Seguridad ────────────────────────────────────────────── */}
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

        {/* ── SEO / Scripts ────────────────────────────────────────── */}
        <TabsContent value="seo">
          <div className="space-y-6">

            {/* A. SEO básico */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">SEO básico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field
                  label="Título del sitio"
                  value={v("siteTitle")}
                  onChange={(val) => update("siteTitle", val)}
                  placeholder="TodoTerramar - Distribuidora Terramar México"
                  hint="Se usa como título por defecto en buscadores y redes sociales."
                />
                <Field
                  label="Descripción del sitio"
                  value={v("siteDescription")}
                  onChange={(val) => update("siteDescription", val)}
                  placeholder="Únete al equipo Terramar México o compra productos de belleza y bienestar."
                  textarea
                  hint="Descripción que aparece en Google y al compartir en redes."
                />
                <Field
                  label="Palabras clave SEO (opcional)"
                  value={v("seoKeywords")}
                  onChange={(val) => update("seoKeywords", val)}
                  placeholder="terramar, belleza, cosméticos, distribuidora, méxico"
                  hint="Separadas por comas. Impacto SEO limitado, pero útil para referencia."
                />
                <Field
                  label="URL de imagen OG por defecto (opcional)"
                  value={v("defaultOgImageUrl")}
                  onChange={(val) => update("defaultOgImageUrl", val)}
                  placeholder="https://todoterramar.com/og-image.jpg"
                  hint="Imagen que se muestra al compartir el sitio en WhatsApp, Facebook, etc."
                />
                <Field
                  label="Código de verificación Google Search Console (opcional)"
                  value={v("googleSearchConsoleCode")}
                  onChange={(val) => update("googleSearchConsoleCode", val)}
                  placeholder="AbCdEfGhIjKlMnOpQrStUvWxYz123456789"
                  hint='Solo el contenido del atributo content del meta tag. Ej: si el tag es <meta name="google-site-verification" content="AbCdEf" />, pega solo "AbCdEf".'
                />
              </CardContent>
            </Card>

            {/* B. Verificación y tracking */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Verificación y tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Field
                  label="Google Analytics 4 ID"
                  value={v("googleAnalyticsId")}
                  onChange={(val) => update("googleAnalyticsId", val)}
                  placeholder="G-XXXXXXXXXX"
                  hint='ID de medición de Google Analytics 4. Empieza con "G-".'
                />
                <Field
                  label="Google Tag Manager ID"
                  value={v("googleTagManagerId")}
                  onChange={(val) => update("googleTagManagerId", val)}
                  placeholder="GTM-XXXXXXX"
                  hint='ID de contenedor de Google Tag Manager. Empieza con "GTM-".'
                />
                <Field
                  label="Meta Pixel ID"
                  value={v("metaPixelId")}
                  onChange={(val) => update("metaPixelId", val)}
                  placeholder="123456789012345"
                  hint="ID numérico del píxel de Facebook / Meta Ads."
                />
                <Field
                  label="TikTok Pixel ID (opcional)"
                  value={v("tiktokPixelId")}
                  onChange={(val) => update("tiktokPixelId", val)}
                  placeholder="CXXXXXXXXXXXXXXXXXX"
                  hint="ID del píxel de TikTok Ads."
                />
              </CardContent>
            </Card>

            {/* C. Código personalizado */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Código personalizado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Warning */}
                <div
                  className="flex items-start gap-3 rounded-lg p-4 text-sm"
                  style={{
                    background: "rgba(251,191,36,0.08)",
                    border: "1px solid rgba(251,191,36,0.30)",
                    color: "#92400e",
                  }}
                >
                  <TriangleAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
                  <p>
                    <strong>Precaución:</strong> Código incorrecto puede afectar el funcionamiento del sitio.
                    Usa solo códigos de proveedores confiables como Google, Meta o TikTok.
                    Solo pega códigos de fuentes de confianza — scripts incorrectos pueden romper el sitio.
                  </p>
                </div>

                <CodeField
                  label="Código personalizado en <head>"
                  value={v("customHeadCode")}
                  onChange={(val) => update("customHeadCode", val)}
                  placeholder={`<!-- Meta tags de verificación, link tags o scripts para el head -->\n<meta name="google-site-verification" content="..." />`}
                  hint="Meta tags de verificación, link tags o scripts que deben ir dentro del <head>. Se inyecta en el HTML de todas las páginas públicas."
                />

                <CodeField
                  label='Código después de abrir <body>'
                  value={v("customBodyStartCode")}
                  onChange={(val) => update("customBodyStartCode", val)}
                  placeholder={`<!-- Google Tag Manager (noscript) u otros scripts de inicio de body -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`}
                  hint="Scripts como el noscript de Google Tag Manager o código que debe ir inmediatamente después de que abre el body."
                />

                <CodeField
                  label='Código antes de cerrar </body>'
                  value={v("customBodyEndCode")}
                  onChange={(val) => update("customBodyEndCode", val)}
                  placeholder={`<!-- Scripts que cargan al final de la página -->\n<script src="https://ejemplo.com/script.js"></script>`}
                  hint="Scripts que deben cargarse cerca del final de la página, antes de que cierre el body."
                />

              </CardContent>
            </Card>

          </div>
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
