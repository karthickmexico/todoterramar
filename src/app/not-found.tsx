import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-rose-600 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <Button asChild>
          <Link href="/es">
            <Home className="w-4 h-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
