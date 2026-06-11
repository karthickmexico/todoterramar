"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

interface PwFieldProps {
  label: string;
  value: string;
  show: boolean;
  onChange: (v: string) => void;
  onToggleShow: () => void;
}

function PwField({ label, value, show, onChange, onToggleShow }: PwFieldProps) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1">
        <Input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="pr-10"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export function PasswordChangeForm() {
  const [pw, setPw] = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSuccess(false);
    if (!pw.current || !pw.newPw || !pw.confirm) {
      setError("Todos los campos son requeridos");
      return;
    }
    if (pw.newPw.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (pw.newPw !== pw.confirm) {
      setError("La nueva contraseña y la confirmación no coinciden");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.newPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al actualizar la contraseña");
        return;
      }
      setSuccess(true);
      setPw({ current: "", newPw: "", confirm: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Actualiza la contraseña de acceso al panel de administración.
      </p>

      {error && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{
            background: "rgba(185,28,28,0.06)",
            border: "1px solid rgba(185,28,28,0.18)",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="rounded-lg p-3 text-sm flex items-center gap-2"
          style={{
            background: "rgba(215,168,79,0.08)",
            border: "1px solid rgba(215,168,79,0.30)",
            color: "#15104a",
          }}
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#d7a84f" }} />
          Contraseña actualizada correctamente
        </div>
      )}

      <PwField
        label="Contraseña actual"
        value={pw.current}
        show={show.current}
        onChange={(v) => setPw((p) => ({ ...p, current: v }))}
        onToggleShow={() => setShow((s) => ({ ...s, current: !s.current }))}
      />
      <PwField
        label="Nueva contraseña"
        value={pw.newPw}
        show={show.newPw}
        onChange={(v) => setPw((p) => ({ ...p, newPw: v }))}
        onToggleShow={() => setShow((s) => ({ ...s, newPw: !s.newPw }))}
      />
      <PwField
        label="Confirmar nueva contraseña"
        value={pw.confirm}
        show={show.confirm}
        onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
        onToggleShow={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
      />

      <div className="pt-2">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          style={{ background: "#15104a", color: "#f3d184" }}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Actualizar contraseña"
          )}
        </Button>
      </div>
    </div>
  );
}
