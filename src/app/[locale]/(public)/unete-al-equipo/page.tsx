import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { RegistrationForm } from "@/components/forms/registration-form";
import { ArrowRight, CheckCircle, Users, TrendingUp, Heart, Clock } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.join" });
  return { title: t("title"), description: t("description") };
}

function JoinContent({ locale }: { locale: string }) {
  const t = useTranslations("join");
  const tb = useTranslations("benefits");

  const steps = [
    { key: "step1", icon: "1️⃣" },
    { key: "step2", icon: "2️⃣" },
    { key: "step3", icon: "3️⃣" },
    { key: "step4", icon: "4️⃣" },
  ] as const;

  return (
    <div>
      {/* Hero */}
      <div
        className="relative overflow-hidden py-20 px-4 text-center"
        style={{ background: "linear-gradient(135deg, #08051f 0%, #15104a 55%, #1d1760 100%)" }}
      >
        {/* Gold radial accent */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 75% 30%, rgba(215,168,79,0.14) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-4xl mx-auto">
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase px-5 py-2 rounded-full mb-6"
            style={{ border: "1px solid rgba(215,168,79,0.45)", color: "#f3d184" }}
          >
            Únete al Equipo
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t("title")}</h1>
          <p className="text-xl" style={{ color: "rgba(255,255,255,0.80)" }}>{t("subtitle")}</p>
          <div className="gold-divider max-w-[80px] mx-auto mt-6" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: "#15104a" }}>
            {t("howItWorks.title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.key}
                className="bg-white rounded-2xl p-6 text-center shadow-sm transition-shadow hover:shadow-md"
                style={{ border: "1px solid rgba(215,168,79,0.20)" }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: "#15104a" }}>
                  {t(`howItWorks.${step.key}.title`)}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(`howItWorks.${step.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section
          className="mb-16 rounded-3xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(23,16,79,0.04) 0%, rgba(215,168,79,0.06) 100%)",
            border: "1px solid rgba(215,168,79,0.18)",
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#15104a" }}>
            {tb("title")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["income", "training", "discounts", "community", "schedule", "products"].map((key) => (
              <div key={key} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {tb(`items.${key as "income"}.title`)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {tb(`items.${key as "income"}.description`)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Registration form */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: "#15104a" }}>
            ¡Regístrate ahora!
          </h2>
          <div className="max-w-xl mx-auto">
            <RegistrationForm locale={locale} interest="JOIN_TEAM" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <JoinContent locale={locale} />;
}
