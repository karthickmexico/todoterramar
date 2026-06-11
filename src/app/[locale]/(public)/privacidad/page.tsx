import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | TodoTerramar",
  description: "Aviso de privacidad y política de tratamiento de datos personales de TodoTerramar.",
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Aviso de Privacidad</h1>
        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold">Responsable del tratamiento de datos</h2>
            <p className="text-gray-600">
              TodoTerramar, distribuidora independiente de Terramar, es responsable del tratamiento
              de sus datos personales. Este sitio web no representa a la empresa corporativa Terramar México.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Datos que recabamos</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Nombre completo</li>
              <li>Número de teléfono / WhatsApp</li>
              <li>Correo electrónico</li>
              <li>Ciudad y estado de residencia</li>
              <li>Datos de navegación (cookies, UTM, referrer)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Finalidades del tratamiento</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Contactarte para brindarte información sobre Terramar</li>
              <li>Enviarte información sobre promociones (si lo autorizas)</li>
              <li>Mejorar nuestros servicios y experiencia en el sitio</li>
              <li>Análisis estadístico y de marketing</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Derechos ARCO</h2>
            <p className="text-gray-600">
              Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al tratamiento de tus
              datos personales. Para ejercer estos derechos, escríbenos por WhatsApp o al correo
              electrónico de contacto.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Cookies</h2>
            <p className="text-gray-600">
              Este sitio utiliza cookies para mejorar la experiencia de usuario y realizar
              análisis de tráfico mediante Google Analytics. Puedes configurar tu navegador
              para rechazar cookies.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Cambios al aviso</h2>
            <p className="text-gray-600">
              Nos reservamos el derecho de modificar este aviso. Los cambios serán publicados
              en este mismo sitio web.
            </p>
          </section>
          <p className="text-sm text-gray-500 mt-8">
            Última actualización: Junio 2025
          </p>
        </div>
      </div>
    </div>
  );
}
