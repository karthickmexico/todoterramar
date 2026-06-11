export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Admin Login | TodoTerramar",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #05031a 0%, #08051f 45%, #15104a 100%)" }}>
      {/* Gold radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 40%, rgba(215,168,79,0.16) 0%, transparent 55%)" }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Image
            src="/images/todo-terramar-logo.png"
            alt="TodoTerramar"
            width={1536}
            height={1024}
            quality={100}
            className="mx-auto h-20 w-auto object-contain"
            priority
          />
          <h1 className="mt-5 text-3xl font-bold tracking-tight" style={{ color: "#f3d184" }}>
            TodoTerramar
          </h1>
          <p className="mt-2 text-sm font-medium" style={{ color: "#b8b3d9" }}>
            Panel de administración
          </p>
        </div>

        <AdminLoginForm />

        <p className="text-center text-xs mt-6" style={{ color: "#b8b3d9" }}>
          Acceso exclusivo para administradores autorizados
        </p>
        <p className="text-center text-xs mt-4" style={{ color: "rgba(184,179,217,0.55)" }}>
          © {new Date().getFullYear()} Todo Terramar - powered by{" "}
          <a
            href="https://quantumaltus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline transition-colors"
            style={{ color: "#f3d184" }}
          >
            Quantum Altus
          </a>
        </p>
      </div>
    </main>
  );
}
