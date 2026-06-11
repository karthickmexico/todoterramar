"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { X, Send, Loader2, CheckCircle, MessageCircle } from "lucide-react";
import Image from "next/image";

interface ChatWidgetProps {
  locale: string;
}

export function ChatWidget({ locale: _locale }: ChatWidgetProps) {
  const t = useTranslations("chat");
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const popup = isOpen ? (
    <div
      className="fixed z-[9999] bottom-24 right-4 sm:right-6 animate-chat-slide-up"
      style={{ width: "min(400px, calc(100vw - 2rem))" }}
    >
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          border: "1px solid rgba(215,168,79,0.35)",
          boxShadow: "0 28px 80px rgba(21,16,74,0.32), 0 4px 24px rgba(0,0,0,0.16)",
        }}
      >
        {/* ── Navy/gold header ── */}
        <div
          className="relative px-6 pt-10 pb-7 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #08051f 0%, #15104a 55%, #1d1760 100%)" }}
        >
          {/* Gold radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, rgba(215,168,79,0.22) 0%, transparent 55%)" }}
          />
          {/* Gold bottom border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(215,168,79,0.50), transparent)" }}
          />

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar chat"
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.70)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f3d184"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.70)"; }}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo circle */}
          <div className="relative mx-auto mb-5 w-fit z-10">
            <div
              className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center bg-white"
              style={{
                border: "2px solid rgba(215,168,79,0.60)",
                boxShadow: "0 4px 24px rgba(215,168,79,0.25), 0 0 0 4px rgba(215,168,79,0.10)",
              }}
            >
              <Image
                src="/images/todo-terramar-logo.png"
                alt="Todo Terramar"
                width={400}
                height={267}
                className="w-[72px] h-auto object-contain"
              />
            </div>
            {/* Gold status dot */}
            <span
              className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-[#08051f]"
              style={{ background: "#d7a84f" }}
            />
          </div>

          <h2
            className="relative z-10 font-bold text-[16px] leading-snug"
            style={{ color: "#f3d184" }}
          >
            Asesora Todo Terramar
          </h2>
          <p className="relative z-10 text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.72)" }}>
            {t("subtitle")}
          </p>
        </div>

        {/* ── Form body ── */}
        <div className="bg-white px-5 py-5">
          {submitted ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(215,168,79,0.12)", border: "1px solid rgba(215,168,79,0.30)" }}
              >
                <CheckCircle className="w-8 h-8" style={{ color: "#d7a84f" }} />
              </div>
              <p className="font-semibold mb-1.5" style={{ color: "#15104a" }}>
                Gracias, pronto nos pondremos en contacto contigo.
              </p>
              <p className="text-xs text-gray-400">Respondemos dentro de las próximas horas.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder={t("namePlaceholder")}
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                required
                className="w-full text-sm rounded-2xl border px-4 py-3 outline-none transition-all placeholder:text-gray-400"
                style={{
                  borderColor: "rgba(215,168,79,0.30)",
                  color: "#15104a",
                  background: "white",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#d7a84f";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(215,168,79,0.15)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(215,168,79,0.30)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              />
              <input
                placeholder={t("phonePlaceholder")}
                value={form.phone}
                type="tel"
                onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full text-sm rounded-2xl border px-4 py-3 outline-none transition-all placeholder:text-gray-400"
                style={{
                  borderColor: "rgba(215,168,79,0.30)",
                  color: "#15104a",
                  background: "white",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#d7a84f";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(215,168,79,0.15)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(215,168,79,0.30)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              />
              <textarea
                placeholder={t("messagePlaceholder")}
                value={form.message}
                onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                required
                rows={3}
                className="w-full text-sm rounded-2xl border px-4 py-3 outline-none transition-all placeholder:text-gray-400 resize-none"
                style={{
                  borderColor: "rgba(215,168,79,0.30)",
                  color: "#15104a",
                  background: "white",
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#d7a84f";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(215,168,79,0.15)";
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(215,168,79,0.30)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                style={{
                  background: loading ? "#08051f" : "#15104a",
                  color: "#f3d184",
                  boxShadow: "0 4px 20px rgba(21,16,74,0.25)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.background = "#08051f";
                }}
                onMouseLeave={(e) => {
                  if (!loading) (e.currentTarget as HTMLElement).style.background = "#15104a";
                }}
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><Send className="w-3.5 h-3.5 flex-shrink-0" /> {t("send")}</>
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("open")}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 focus:outline-none"
        style={{
          background: "#15104a",
          border: "1px solid rgba(215,168,79,0.50)",
          boxShadow: "0 8px 32px rgba(21,16,74,0.50)",
          color: "white",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#08051f";
          (e.currentTarget as HTMLElement).style.color = "#f3d184";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#15104a";
          (e.currentTarget as HTMLElement).style.color = "white";
        }}
      >
        {isOpen
          ? <X className="w-6 h-6" />
          : <MessageCircle className="w-7 h-7" />
        }
      </button>

      {/* Popup rendered via portal — escapes any parent overflow/transform */}
      {mounted && createPortal(popup, document.body)}
    </>
  );
}
