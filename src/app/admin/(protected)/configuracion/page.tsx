export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Configuración | TodoTerramar Admin",
  robots: { index: false },
};

async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return { ...DEFAULT_SETTINGS, ...map };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">
          Ajusta los textos, redes sociales y datos de contacto del sitio
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
