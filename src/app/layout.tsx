import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#15104A",
};

export const metadata: Metadata = {
  title: {
    template: "%s | TodoTerramar",
    default: "TodoTerramar - Distribuidora Terramar México",
  },
  description:
    "Únete al equipo Terramar México o compra productos de belleza y bienestar. Distribuidora independiente.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://todoterramar.com"
  ),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={geistSans.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
