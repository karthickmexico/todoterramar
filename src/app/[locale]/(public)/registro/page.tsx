import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RegistrationForm } from "@/components/forms/registration-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.register" });
  return { title: t("title"), description: t("description") };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="py-16 min-h-screen" style={{ background: "#f8f3ea" }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ background: "rgba(215,168,79,0.15)", border: "1px solid rgba(215,168,79,0.25)" }}>
            <span className="text-3xl">✨</span>
          </div>
        </div>
        <RegistrationForm locale={locale} />
      </div>
    </div>
  );
}
