"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Credenciales inválidas");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-11 bg-white/8 border rounded-xl text-white text-sm focus:outline-none transition-all placeholder:text-white/45";
  const inputStyle = {
    background: "rgba(255,255,255,0.08)",
    borderColor: "rgba(215,168,79,0.35)",
  };
  const inputFocusStyle = "focus:border-[#d7a84f] focus:ring-2 focus:ring-[#d7a84f]/25";

  return (
    <div
      className="backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
      style={{
        background: "rgba(21,16,74,0.72)",
        border: "1px solid rgba(215,168,79,0.35)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.50), 0 0 0 1px rgba(215,168,79,0.12)",
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#b8b3d9" }}>
            Correo electrónico
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#d7a84f" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} ${inputFocusStyle} pl-10 pr-4`}
              style={inputStyle}
              placeholder="admin@todoterramar.com"
              required
              autoComplete="email"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#b8b3d9" }}>
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#d7a84f" }} />
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} ${inputFocusStyle} pl-10 pr-12`}
              style={inputStyle}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error — keep red for actual auth errors */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 font-bold rounded-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          style={{
            background: "linear-gradient(135deg, #f3d184 0%, #d7a84f 100%)",
            color: "#08051f",
            boxShadow: "0 4px 20px rgba(215,168,79,0.35)",
          }}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Iniciando sesión...</>
          ) : (
            "Ingresar al panel"
          )}
        </button>
      </form>
    </div>
  );
}
