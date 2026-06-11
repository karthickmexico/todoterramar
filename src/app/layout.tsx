import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

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
