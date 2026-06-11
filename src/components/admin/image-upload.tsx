"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  hint?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = "misc",
  hint,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", folder || "uploads");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al subir la imagen.");
      }
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleChange}
      />

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
          {/* Using plain img to support any URL (local path or external) without domain config */}
          <div className="relative h-44 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Vista previa"
              className="h-44 w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-800 shadow hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              Cambiar imagen
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 rounded-lg text-xs font-medium text-red-600 shadow hover:bg-red-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Quitar
              </button>
            )}
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-[#d7a84f] hover:bg-amber-50/30 transition-all flex flex-col items-center gap-3 text-center disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#d7a84f" }} />
              <p className="text-sm text-gray-500">Subiendo imagen…</p>
            </>
          ) : (
            <>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(215,168,79,0.12)" }}
              >
                <ImageIcon className="w-6 h-6" style={{ color: "#d7a84f" }} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Haz clic para subir una imagen
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  PNG, JPG o WEBP · Máx. 5 MB
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
