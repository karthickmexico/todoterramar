export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChatWidget } from "@/components/public/chat-widget";
import { CookieBanner } from "@/components/public/cookie-banner";
import { AnalyticsScripts } from "@/components/public/analytics-scripts";
import { HeadInjector } from "@/components/public/head-injector";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SETTINGS } from "@/lib/constants";

async function getSettings() {
  try {
    const rows = await prisma.siteSetting.findMany();
    const map = Object.fromEntries(rows.map((s) => [s.key, s.value]));
    return { ...DEFAULT_SETTINGS, ...map };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const title = s.siteTitle || "TodoTerramar - Distribuidora Terramar México";
  const description =
    s.siteDescription ||
    "Únete al equipo Terramar México o compra productos de belleza y bienestar. Distribuidora independiente.";

  return {
    title: {
      template: `%s | ${s.siteTitle || "TodoTerramar"}`,
      default: title,
    },
    description,
    keywords: s.seoKeywords || undefined,
    verification: s.googleSearchConsoleCode
      ? { google: s.googleSearchConsoleCode }
      : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: s.defaultOgImageUrl ? [{ url: s.defaultOgImageUrl }] : [],
    },
  };
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
      {/* Analytics & tracking scripts (client, afterInteractive) */}
      <AnalyticsScripts
        gaId={settings.googleAnalyticsId}
        gtmId={settings.googleTagManagerId}
        metaPixelId={settings.metaPixelId}
        tiktokPixelId={settings.tiktokPixelId}
      />

      {/* Custom <head> injection (client, after hydration) */}
      {settings.customHeadCode && (
        <HeadInjector code={settings.customHeadCode} />
      )}

      {/* Custom body-start code (server-rendered HTML) */}
      {settings.customBodyStartCode && (
        // eslint-disable-next-line react/no-danger
        <div
          dangerouslySetInnerHTML={{ __html: settings.customBodyStartCode }}
          suppressHydrationWarning
        />
      )}

      <Header locale={locale} />
      <main className="min-h-screen pt-[88px] md:pt-[108px]">{children}</main>
      <Footer locale={locale} settings={settings} />
      <ChatWidget locale={locale} />
      <CookieBanner locale={locale} />

      {/* Custom body-end code (server-rendered HTML) */}
      {settings.customBodyEndCode && (
        // eslint-disable-next-line react/no-danger
        <div
          dangerouslySetInnerHTML={{ __html: settings.customBodyEndCode }}
          suppressHydrationWarning
        />
      )}
    </>
  );
}
