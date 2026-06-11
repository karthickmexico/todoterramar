export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { PoweredByFooter } from "@/components/common/powered-by-footer";
import { Toaster } from "@/components/ui/toaster";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#f7f4ee" }}>
      <AdminSidebar />
      <div className="flex flex-col flex-1 lg:ml-72 min-h-screen pt-14 lg:pt-0">
        <AdminTopbar session={session} />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
          <div
            className="px-4 sm:px-6 lg:px-8 py-5"
            style={{ borderTop: "1px solid rgba(215,168,79,0.15)" }}
          >
            <PoweredByFooter
              className="text-center text-gray-400"
              linkClassName="text-[#15104a] hover:text-[#d7a84f]"
            />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
