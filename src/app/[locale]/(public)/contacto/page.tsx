import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/forms/contact-form";
import { prisma } from "@/lib/prisma";
import { useTranslations } from "next-intl";
import { getWhatsAppUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, MapPin, Mail } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.contact" });
  return { title: t("title"), description: t("description") };
}

async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  } catch {
    return {};
  }
}

function ContactContent({
  locale,
  settings,
}: {
  locale: string;
  settings: Record<string, string>;
}) {
  const t = useTranslations("contact");
  const whatsappPhone =
    settings.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
          <p className="text-xl text-gray-600">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6" style={{ background: "rgba(243,209,132,0.08)", border: "1px solid rgba(215,168,79,0.18)" }}>
              <h2 className="font-bold text-gray-900 mb-4">{t("form.title")}</h2>

              {whatsappPhone && (
                <Button asChild variant="whatsapp" size="lg" className="w-full mb-4">
                  <a
                    href={getWhatsAppUrl(whatsappPhone, "¡Hola! Tengo una consulta sobre Terramar.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {t("whatsapp")}
                  </a>
                </Button>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5" style={{ color: "#d7a84f" }} />
                  <div>
                    <div className="font-medium text-gray-800">{t("hours")}</div>
                    <div className="text-gray-600">
                      {settings.businessHours || t("hoursValue")}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5" style={{ color: "#d7a84f" }} />
                  <div>
                    <div className="font-medium text-gray-800">Ubicación</div>
                    <div className="text-gray-600">
                      {settings.location || t("location")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <ContactForm locale={locale} />
        </div>
      </div>
    </div>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSettings();
  return <ContactContent locale={locale} settings={settings} />;
}
