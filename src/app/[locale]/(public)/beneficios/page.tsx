import { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, Clock, Star, Users, GraduationCap, Tag, TrendingUp, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Beneficios de ser Distribuidora Terramar | TodoTerramar",
  description:
    "Descubre todos los beneficios de unirte al equipo Terramar: ingresos extras, horario flexible, descuentos exclusivos y más.",
};

function BeneficiosContent({ locale }: { locale: string }) {
  const t = useTranslations("benefits");

  const benefits = [
    {
      icon: DollarSign,
      color: "from-green-400 to-emerald-500",
      title: "Ingresos sin límite",
      desc: "Genera ganancias proporcionales a tu esfuerzo. Sin límite de ingresos ni territorios.",
    },
    {
      icon: Clock,
      color: "from-blue-400 to-indigo-500",
      title: "Horario flexible",
      desc: "Trabaja cuando quieras y donde quieras. Tú eres tu propio jefe.",
    },
    {
      icon: Tag,
      color: "from-[#c4922c] to-[#d7a84f]",
      title: "Descuentos exclusivos",
      desc: "Obtén descuentos especiales en todos los productos Terramar para uso personal.",
    },
    {
      icon: GraduationCap,
      color: "from-purple-400 to-violet-500",
      title: "Capacitación gratuita",
      desc: "Accede a videos, manuales y talleres de capacitación sin costo.",
    },
    {
      icon: Users,
      color: "from-amber-400 to-orange-500",
      title: "Comunidad de apoyo",
      desc: "Únete a una comunidad de mujeres exitosas que se apoyan y crecen juntas.",
    },
    {
      icon: Star,
      color: "from-[#17104f] to-[#211f72]",
      title: "Productos de calidad",
      desc: "Vende productos reconocidos en todo México por su calidad y efectividad.",
    },
    {
      icon: TrendingUp,
      color: "from-teal-400 to-cyan-500",
      title: "Crecimiento profesional",
      desc: "Desarrolla habilidades de ventas, liderazgo y emprendimiento.",
    },
    {
      icon: Heart,
      color: "from-[#d7a84f] to-[#f0d18a]",
      title: "Bienestar personal",
      desc: "Usa los productos y comprueba su efectividad en ti misma.",
    },
  ];

  return (
    <div className="py-16">
      <div className="relative overflow-hidden py-16 px-4 text-center mb-16" style={{ background: "linear-gradient(135deg, #08051f 0%, #15104a 55%, #1d1760 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4">Beneficios de afiliarte</h1>
          <p className="text-xl text-white/90">
            Descubre por qué miles de mujeres en México eligieron Terramar como su negocio
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}>
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center rounded-3xl p-10" style={{ background: "rgba(243,209,132,0.08)", border: "1px solid rgba(215,168,79,0.18)" }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Lista para comenzar?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Regístrate ahora y uno de nuestros asesores te contactará para explicarte todos los detalles.
          </p>
          <Button asChild size="xl">
            <Link href={`/${locale}/registro`}>
              Registrarme ahora
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default async function BeneficiosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <BeneficiosContent locale={locale} />;
}
