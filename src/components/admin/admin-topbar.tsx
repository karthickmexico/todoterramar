"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Settings, LogOut } from "lucide-react";
import type { AdminSession } from "@/lib/auth";

interface AdminTopbarProps {
  session: AdminSession;
}

export function AdminTopbar({ session }: AdminTopbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const initial = (session.name?.charAt(0) || session.email.charAt(0)).toUpperCase();
  const displayName = session.name || "Admin";

  return (
    <header
      className="lg:sticky top-0 z-20 flex h-16 items-center justify-end px-4 sm:px-6 lg:px-8"
      style={{
        background: "rgba(248,243,234,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(215,168,79,0.18)",
      }}
    >
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-all duration-150"
          style={{
            background: "white",
            border: "1px solid rgba(215,168,79,0.35)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(215,168,79,0.65)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(21,16,74,0.10)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(215,168,79,0.35)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
          }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "#15104a", color: "#f3d184" }}
          >
            {initial}
          </div>
          <span
            className="hidden sm:block text-sm font-semibold"
            style={{ color: "#15104a" }}
          >
            {displayName}
          </span>
          <ChevronDown
            className="w-4 h-4 transition-transform duration-200"
            style={{
              color: "#15104a",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden"
            style={{
              background: "white",
              border: "1px solid rgba(215,168,79,0.22)",
              boxShadow: "0 8px 32px rgba(21,16,74,0.13)",
              zIndex: 50,
            }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid rgba(215,168,79,0.14)" }}
            >
              <p className="text-sm font-semibold truncate" style={{ color: "#15104a" }}>
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{session.email}</p>
            </div>

            <div className="py-1.5">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/admin/configuracion");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-amber-50"
                style={{ color: "#15104a" }}
              >
                <Settings className="w-4 h-4 flex-shrink-0" style={{ color: "#d7a84f" }} />
                Configuración
              </button>

              <div
                className="mx-3 my-1"
                style={{ borderTop: "1px solid rgba(215,168,79,0.14)" }}
              />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-red-50"
                style={{ color: "#b91c1c" }}
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
