import React from "react";
import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";

interface TestimonialsSectionProps {
  locale: string;
}

const testimonials = [
  {
    name: "María González",
    city: "Ciudad de México",
    avatar: "MG",
    text: "Desde que me uní al equipo Terramar, mis ingresos aumentaron más de un 40%. El apoyo del equipo es increíble y los productos se venden solos.",
    stars: 5,
    role: "Distribuidora desde 2021",
    color: "from-rose-500 to-pink-400",
  },
  {
    name: "Ana Patricia López",
    city: "Guadalajara, Jalisco",
    avatar: "AL",
    text: "Los productos Terramar son de una calidad excepcional. Mis clientas regresan una y otra vez. ¡Es un negocio que se construye solo con clientes felices!",
    stars: 5,
    role: "Distribuidora desde 2020",
    color: "from-blush-500 to-rose-400",
  },
  {
    name: "Patricia Ruiz Mendoza",
    city: "Monterrey, NL",
    avatar: "PR",
    text: "Puedo trabajar desde casa mientras cuido a mis hijos. Terramar me dio la libertad financiera que siempre soñé. ¡Es la mejor decisión que tomé!",
    stars: 5,
    role: "Distribuidora desde 2022",
    color: "from-champagne-500 to-amber-400",
  },
];

export function TestimonialsSection({ locale }: TestimonialsSectionProps) {
  const t = useTranslations("testimonials");

  return (
    <section className="section relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-blush-950">
      {/* Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-champagne-300 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 mb-4">
            💬 Historias de éxito
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8 hover:bg-white/15 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-white/10" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-champagne-300 fill-current" />
                ))}
              </div>

              <p className="text-white/90 leading-relaxed italic mb-7 text-sm">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-white/50 text-xs">{t.city}</div>
                  <div className="text-champagne-300/80 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
