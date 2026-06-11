"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Tag,
  Video,
  Package,
  BookOpen,
  MessageSquare,
  Menu,
  X,
  Images,
} from "lucide-react";
const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/leads", icon: Users, label: "Prospectos" },
  { href: "/admin/promociones", icon: Tag, label: "Promociones" },
  { href: "/admin/banners-inicio", icon: Images, label: "Banners Inicio" },
  { href: "/admin/videos", icon: Video, label: "Videos" },
  { href: "/admin/productos", icon: Package, label: "Productos" },
  { href: "/admin/blog", icon: BookOpen, label: "Blog" },
  { href: "/admin/chat", icon: MessageSquare, label: "Chat / Consultas" },
];

const SIDEBAR_BG = "#08051f";
const SIDEBAR_BORDER = "rgba(215,168,79,0.15)";
const ACTIVE_BG = "rgba(215,168,79,0.15)";
const ACTIVE_COLOR = "#f3d184";
const INACTIVE_COLOR = "rgba(255,255,255,0.50)";
const INACTIVE_HOVER_BG = "rgba(255,255,255,0.06)";

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
        <Link href="/admin/dashboard" className="flex flex-col items-start gap-3">
          <Image
            src="/images/todo-terramar-logo.png"
            alt="TodoTerramar"
            width={1536}
            height={1024}
            priority
            quality={100}
            className="h-20 w-auto max-w-[200px] object-contain"
          />
          <p className="text-[10px] tracking-[0.28em] uppercase font-semibold" style={{ color: "rgba(215,168,79,0.80)" }}>
            Panel Admin
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={active
                ? { background: ACTIVE_BG, color: ACTIVE_COLOR, borderLeft: `3px solid #d7a84f` }
                : { color: INACTIVE_COLOR }
              }
              onMouseEnter={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = INACTIVE_HOVER_BG;
              }}
              onMouseLeave={(e) => {
                if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-72 z-30"
        style={{ background: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14"
        style={{ background: SIDEBAR_BG, borderBottom: `1px solid ${SIDEBAR_BORDER}` }}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/images/todo-terramar-logo.png"
            alt="TodoTerramar"
            width={1536}
            height={1024}
            quality={100}
            className="h-8 w-auto object-contain"
          />
          <span className="font-bold text-white text-sm">Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ color: INACTIVE_COLOR }}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-20">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside
            className="absolute left-0 top-14 bottom-0 w-72 flex flex-col"
            style={{ background: SIDEBAR_BG, borderRight: `1px solid ${SIDEBAR_BORDER}` }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
