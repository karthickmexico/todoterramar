export const dynamic = "force-dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/public/chat-widget";
import { CookieBanner } from "@/components/public/cookie-banner";
import { AnalyticsScripts } from "@/components/public/analytics-scripts";
import { prisma } from "@/lib/prisma";

async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  } catch {
    return {};
  }
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const settings = await getSettings();

  return (
    <>
      <AnalyticsScripts gaId={settings.gaId} metaPixelId={settings.metaPixelId} />
      <Header locale={locale} />
      <main className="min-h-screen pt-[88px] md:pt-[108px]">{children}</main>
      <Footer locale={locale} settings={settings} />
      <ChatWidget locale={locale} />
      <CookieBanner locale={locale} />
    </>
  );
}
