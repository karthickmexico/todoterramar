import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.about" });
  return { title: t("title"), description: t("description") };
}

function AboutContent({ locale }: { locale: string }) {
  const t = useTranslations("about");
  const tc = useTranslations("common");

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
            style={{ background: "rgba(215,168,79,0.15)", border: "1px solid rgba(215,168,79,0.25)" }}
          >
            <span className="text-3xl">🌸</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
          <p className="text-xl text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Content sections */}
        <div className="space-y-12">
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("whatIs.title")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("whatIs.content")}</p>
          </section>

          <section className="rounded-2xl p-8" style={{ background: "rgba(243,209,132,0.08)", border: "1px solid rgba(215,168,79,0.18)" }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("whyJoin.title")}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">{t("whyJoin.content")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Ingresos ilimitados",
                "Horario flexible",
                "Capacitación continua",
                "Descuentos exclusivos",
                "Comunidad de apoyo",
                "Sin límite de territorio",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("whyBuy.title")}</h2>
            <p className="text-gray-600 leading-relaxed">{t("whyBuy.content")}</p>
          </section>

          {/* Disclaimer */}
          <section className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">{t("disclaimer.title")}</h3>
                <p className="text-amber-700 text-sm leading-relaxed">{t("disclaimer.content")}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href={`/${locale}/registro`}>
              Regístrate ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <AboutContent locale={locale} />;
}
